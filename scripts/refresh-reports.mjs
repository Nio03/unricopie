#!/usr/bin/env node
// Suma los reportes de la gente sobre cómo funciona cada juego (issues con la etiqueta
// «reporte», del formulario .github/ISSUE_TEMPLATE/reporte.yml) en src/data/reportes.json, que
// publica el sitio en /reportes.json y lee Unricopie.
//
// - Cuenta el último reporte de cada persona para cada proyecto y versión.
// - No cuenta los issues con la etiqueta «invalido».
// - Con --cerrar, cierra los reportes abiertos ya contados (lo hace la Action).
//
// Token: GITHUB_TOKEN (o GH_TOKEN) del entorno o de .env.local, como refresh-stats.mjs.
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "src/data/reportes.json");
const REPO = process.env.GITHUB_REPOSITORY || "Nio03/unricopie";
const cerrar = process.argv.includes("--cerrar");

async function loadToken() {
  if (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) return process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  try {
    const env = await readFile(join(root, ".env.local"), "utf8");
    const m = env.match(/^\s*(?:GITHUB_TOKEN|GH_TOKEN)\s*=\s*["']?([^"'\s]+)/m);
    if (m) return m[1];
  } catch {}
  return "";
}

const token = await loadToken();
const headers = { Accept: "application/vnd.github+json", "User-Agent": "recompendium-reportes" };
if (token) headers.Authorization = `Bearer ${token}`;

async function gh(url, init = {}) {
  const r = await fetch(url, { ...init, headers: { ...headers, ...(init.headers || {}) } });
  if (!r.ok) throw new Error(`${init.method || "GET"} ${url}: ${r.status} ${await r.text()}`);
  return r.status === 204 ? null : r.json();
}

// Los issues del formulario salen como «### Etiqueta\n\nvalor» en el orden del formulario.
function campos(body) {
  const out = {};
  const partes = (body || "").split(/^### /m).slice(1);
  for (const p of partes) {
    const [titulo, ...resto] = p.split("\n");
    const valor = resto.join("\n").trim();
    out[titulo.trim()] = valor === "_No response_" ? "" : valor;
  }
  return out;
}

// Los títulos del formulario, por campo (si se cambia reporte.yml, hay que cambiarlos aquí).
const T = {
  entry: "Proyecto / Project",
  version: "Versión / Version",
  result: "¿Cómo funciona? / How does it work?",
  os: "Sistema / System",
  gpu: "Tarjeta gráfica / GPU",
};
const RESULTADO = {
  "Funciona bien / Works well": "bien",
  "Funciona con problemas / Works with problems": "problemas",
  "No arranca / Doesn't start": "no",
};

const issues = [];
for (let page = 1; ; page++) {
  const lote = await gh(`https://api.github.com/repos/${REPO}/issues?labels=reporte&state=all&per_page=100&page=${page}`);
  issues.push(...lote.filter((i) => !i.pull_request));
  if (lote.length < 100) break;
}

// Persona + proyecto + versión → el último reporte. `contados`: los issues que entraron en la
// cuenta (los que no se entienden o llevan «invalido» se dejan abiertos, para mirarlos a mano).
const ultimos = new Map();
const contados = new Set();
for (const i of issues.sort((a, b) => a.created_at.localeCompare(b.created_at))) {
  if (i.labels.some((l) => l.name === "invalido")) continue;
  const c = campos(i.body);
  const entry = (c[T.entry] || "").trim().replace(/^\/+|\/+$/g, "");
  const resultado = RESULTADO[c[T.result]];
  if (!/^[a-z]+\/[a-z0-9-]+$/.test(entry) || !resultado) continue;
  contados.add(i.number);
  const version = (c[T.version] || "").trim().slice(0, 60);
  ultimos.set(`${i.user.login}|${entry}|${version}`, {
    entry, version, resultado, fecha: i.created_at.slice(0, 10), url: i.html_url,
    sistema: (c[T.os] || "").slice(0, 80), gpu: (c[T.gpu] || "").slice(0, 80),
  });
}

const juegos = {};
for (const r of ultimos.values()) {
  const j = (juegos[r.entry] ??= { total: 0, bien: 0, problemas: 0, no: 0, versiones: {}, ultimos: [] });
  j.total++;
  j[r.resultado]++;
  const v = (j.versiones[r.version] ??= { bien: 0, problemas: 0, no: 0 });
  v[r.resultado]++;
  j.ultimos.push({ version: r.version, resultado: r.resultado, fecha: r.fecha, sistema: r.sistema, gpu: r.gpu, url: r.url });
}
for (const j of Object.values(juegos)) {
  j.ultimos.sort((a, b) => b.fecha.localeCompare(a.fecha));
  j.ultimos = j.ultimos.slice(0, 10);
}

const antes = await readFile(out, "utf8").catch(() => "");
const nuevo = JSON.stringify({ juegos }, null, 1) + "\n";
if (antes !== nuevo) {
  await writeFile(out, nuevo);
  console.log(`reportes.json: ${ultimos.size} reportes de ${Object.keys(juegos).length} proyectos.`);
} else {
  console.log("Sin cambios en reportes.json.");
}

if (cerrar) {
  for (const i of issues.filter((i) => i.state === "open" && contados.has(i.number))) {
    await gh(`https://api.github.com/repos/${REPO}/issues/${i.number}`, {
      method: "PATCH",
      body: JSON.stringify({ state: "closed", state_reason: "completed" }),
    });
  }
}
