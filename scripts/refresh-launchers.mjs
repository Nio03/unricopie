#!/usr/bin/env node
// Refresca src/data/launchers.json: qué repos instala cada launcher del
// catálogo, leídos de la lista que el propio launcher publica (campo
// `manifests` de su ficha en src/data/tools/). El sitio cruza esos repos con
// los de las fichas para mostrar, en la ficha del launcher, los proyectos que
// instala, y en la página de cada juego, «Se instala con».
//
// Como stats.json, son datos volátiles y derivables: no van en los YAML.
// Lo corre el GitHub Action a diario. Si una lista no se puede leer ese día,
// se conserva la anterior, para no vaciar la ficha por un fallo pasajero.
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const toolsDir = join(root, "src/data/tools");
const outPath = join(root, "src/data/launchers.json");

// "owner/repo" a partir de un slug o de una URL de GitHub; null si no lo es.
function repoOf(s) {
  if (typeof s !== "string") return null;
  const m = s.trim().match(/^(?:https?:\/\/(?:www\.)?github\.com\/)?([A-Za-z0-9._-]+)\/([A-Za-z0-9._-]+?)(?:\.git)?(?:[/?#].*)?$/);
  if (!m || /^https?:/i.test(s.trim()) && !/github\.com/i.test(s)) return null;
  return `${m[1]}/${m[2]}`;
}

async function getJson(url) {
  const r = await fetch(url, { headers: { accept: "application/json" } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

async function getText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}

// Un lector por formato. Cada uno devuelve la lista de repos ("owner/repo").
const READERS = {
  // GithubLauncher y sus forks: { Categoría: [{ name, repository, … }] }.
  // La categoría de emuladores no son ports: se deja fuera.
  async ghl(url) {
    const data = await getJson(url);
    return Object.entries(data)
      .filter(([cat]) => !/emulat/i.test(cat))
      .flatMap(([, apps]) => (Array.isArray(apps) ? apps : []).map((a) => repoOf(a.repository)));
  },
  // Ports Launcher: { ports: [{ name, source, … }] }. Las entradas con la
  // clave "-name" están desactivadas.
  async "ports-launcher"(url) {
    const data = await getJson(url);
    return (data.ports ?? []).filter((p) => p.name).map((p) => repoOf(p.source));
  },
  // ReComp Launcher: la lista vive en el código (KNOWN_RECOMPS, con "github_repo").
  async "known-recomps"(url) {
    const src = await getText(url);
    return [...src.matchAll(/["']github_repo["']\s*:\s*["']([^"']+)["']/g)].map((m) => repoOf(m[1]));
  },
  // Quiver: API paginada ({ items, nextCursor, isDone }). El repo de cada app
  // solo viene en su detalle, así que se guarda en `cache` y solo se pregunta
  // por las apps nuevas.
  async quiver(url, cache) {
    const apps = [];
    let cursor = "";
    for (let page = 0; page < 50; page++) {
      const data = await getJson(`${url}?limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`);
      apps.push(...(data.items ?? []));
      if (data.isDone || !data.nextCursor) break;
      cursor = data.nextCursor;
    }
    const repos = [];
    for (const app of apps.filter((a) => a.projectType === "port")) {
      if (!(app.slug in cache)) {
        try {
          const d = await getJson(`${url}/${encodeURIComponent(app.slug)}`);
          cache[app.slug] = d.project?.provider === "github" ? repoOf(d.project.repository) : null;
        } catch {
          continue;
        }
      }
      repos.push(cache[app.slug]);
    }
    return repos;
  },
};

async function main() {
  let prev = {};
  try { prev = JSON.parse(await readFile(outPath, "utf8")); } catch {}
  const out = { quiverCache: { ...(prev.quiverCache ?? {}) } };

  for (const f of (await readdir(toolsDir)).filter((x) => /\.ya?ml$/.test(x)).sort()) {
    const doc = parse(await readFile(join(toolsDir, f), "utf8")) || {};
    const manifests = doc.manifests ?? [];
    if (!manifests.length) continue;
    const id = f.replace(/\.ya?ml$/, "");
    try {
      const repos = new Set();
      for (const m of manifests) {
        const read = READERS[m.format];
        if (!read) throw new Error(`formato desconocido: ${m.format}`);
        for (const r of await read(m.url, out.quiverCache)) if (r) repos.add(r);
      }
      if (!repos.size) throw new Error("la lista está vacía");
      out[id] = { repos: [...repos].sort((a, b) => a.localeCompare(b)), checkedAt: new Date().toISOString().slice(0, 10) };
      console.log(`  · ${id}: ${repos.size} repos`);
    } catch (e) {
      console.warn(`  ! ${id}: ${e.message} (se conserva la lista anterior)`);
      if (prev[id]) out[id] = prev[id];
    }
  }

  out.quiverCache = Object.fromEntries(Object.entries(out.quiverCache).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(outPath, JSON.stringify(out, null, 2) + "\n");
  console.log(`✓ ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
