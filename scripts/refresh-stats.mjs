#!/usr/bin/env node
// Refresca src/data/stats.json con los datos EN VIVO de cada repo:
// estrellas, último push, fecha de creación, licencia, homepage, lenguaje,
// estado archivado y la última release (versión + fecha).
//
// Estos datos son volátiles y derivables → viven aquí, NO en los YAML.
// Lo corre el GitHub Action a diario (con GITHUB_TOKEN → 5000 req/hora).
// En local lee el token de la variable de entorno o de un archivo .env.local
// (gitignored). Sin token: 60 req/hora.
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDirs = ["recomps", "tools", "ports", "decomps", "mods"].map((d) => join(root, "src/data", d));
const statsPath = join(root, "src/data/stats.json");

// Token: env var o .env.local (KEY=VALUE), sin dependencias.
async function loadToken() {
  if (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) return process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  try {
    const env = await readFile(join(root, ".env.local"), "utf8");
    const m = env.match(/^\s*(?:GITHUB_TOKEN|GH_TOKEN)\s*=\s*["']?([^"'\s]+)/m);
    if (m) return m[1];
  } catch {}
  return "";
}

async function collectRepos() {
  const repos = new Set();
  for (const dir of dataDirs) {
    let files = [];
    try { files = await readdir(dir); } catch { continue; }
    for (const f of files) {
      if (!/\.ya?ml$/.test(f)) continue;
      const doc = parse(await readFile(join(dir, f), "utf8")) || {};
      if (doc.enrich === false) continue;
      if (typeof doc.repo === "string" && /^[^/\s]+\/[^/\s]+$/.test(doc.repo)) repos.add(doc.repo);
    }
  }
  return [...repos].sort();
}

function clean(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ""));
}

// Recoge los proyectos decomp.dev referenciados ("owner/repo") en los YAML.
async function collectDecomp() {
  const set = new Set();
  for (const dir of ["recomps", "ports", "decomps"].map((d) => join(root, "src/data", d))) {
    let files = [];
    try { files = await readdir(dir); } catch { continue; }
    for (const f of files) {
      if (!/\.ya?ml$/.test(f)) continue;
      const doc = parse(await readFile(join(dir, f), "utf8")) || {};
      if (typeof doc.decomp === "string") set.add(doc.decomp);
    }
  }
  return set;
}

// Progreso de decompilación (matched code %), proyecto a proyecto.
// decomp.dev cerró su directorio (projects.json responde 410 desde el 15-10-2026),
// pero sigue sirviendo el JSON de cada proyecto que ya tenía. ByteMatch usa las
// mismas URLs y recibe los proyectos que migran. Se piden los dos y gana el
// informe con el commit más reciente; si ninguno responde, se conserva el % anterior.
const DECOMP_SOURCES = ["https://bytematch.dev", "https://decomp.dev"];

async function fetchProjectReport(base, key) {
  try {
    const res = await fetch(`${base}/${key}.json`, {
      headers: { "User-Agent": "recompendium-stats-bot" },
      signal: AbortSignal.timeout(45000),
    });
    if (!res.ok) return null;
    const j = await res.json();
    const pct = j?.measures?.matched_code_percent;
    if (typeof pct !== "number") return null;
    return { pct, at: j.commit?.timestamp || "", base };
  } catch { return null; }
}

async function fetchDecompPercents(keys, prev) {
  const out = {};
  for (const key of keys) {
    const reports = [];
    for (const base of DECOMP_SOURCES) {
      const r = await fetchProjectReport(base, key);
      if (r) reports.push(r);
      await new Promise((ok) => setTimeout(ok, 500));
    }
    reports.sort((a, b) => b.at.localeCompare(a.at));
    if (reports.length) out[key] = Math.round(reports[0].pct);
    else if (typeof prev[key]?.decompPercent === "number") {
      out[key] = prev[key].decompPercent;
      console.warn(`  ! sin informe para ${key}: se conserva ${out[key]} %`);
    } else console.warn(`  ! sin informe para ${key}`);
  }
  return out;
}

async function fetchRepo(slug, headers) {
  const res = await fetch(`https://api.github.com/repos/${slug}`, { headers });
  if (res.status === 403 || res.status === 429) {
    const reset = res.headers.get("x-ratelimit-reset");
    throw new Error(`rate-limit (reset ${reset ? new Date(+reset * 1000).toISOString() : "?"})`);
  }
  if (res.status === 404) return { gone: true };
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const d = await res.json();
  const spdx = d.license?.spdx_id;
  return clean({
    stars: d.stargazers_count,
    pushedAt: d.pushed_at,
    createdAt: d.created_at,
    archived: d.archived || undefined,
    license: spdx && spdx !== "NOASSERTION" ? spdx : undefined,
    homepage: d.homepage || undefined,
    language: d.language || undefined,
    fork: d.fork && d.parent ? d.parent.full_name : undefined,
  });
}

async function fetchLatestRelease(slug, headers) {
  try {
    const res = await fetch(`https://api.github.com/repos/${slug}/releases/latest`, { headers });
    if (!res.ok) return {};
    const d = await res.json();
    return clean({ version: d.tag_name, versionAt: d.published_at });
  } catch { return {}; }
}

async function main() {
  const token = await loadToken();
  if (!token) console.warn("⚠  Sin token (env o .env.local): límite de 60 req/hora.");
  else console.log("✓ Token detectado (5000 req/hora).");
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "recompendium-stats-bot",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let prev = {};
  try { prev = JSON.parse(await readFile(statsPath, "utf8")); } catch {}

  const repos = await collectRepos();
  console.log(`Consultando ${repos.length} repos…`);
  const out = {};
  let ok = 0, gone = 0, failed = 0;

  for (const slug of repos) {
    try {
      const r = await fetchRepo(slug, headers);
      if (r.gone) {
        gone++;
        console.log(`  · 404 ${slug} (omitido)`);
        if (prev[slug]) out[slug] = prev[slug];
        continue;
      }
      const rel = await fetchLatestRelease(slug, headers);
      out[slug] = { ...r, ...rel };
      ok++;
    } catch (e) {
      failed++;
      console.warn(`  ! ${slug}: ${e.message}`);
      if (prev[slug]) out[slug] = prev[slug];
    }
  }

  // Progreso de decompilación (ByteMatch / decomp.dev) — se fusiona bajo la clave del proyecto decomp.
  const decompKeys = await collectDecomp();
  const decompPct = await fetchDecompPercents(decompKeys, prev);
  let decompN = 0;
  for (const [key, pct] of Object.entries(decompPct)) {
    out[key] = { ...(out[key] || {}), decompPercent: pct };
    decompN++;
  }
  if (decompKeys.size) console.log(`  · decomps: ${decompN}/${decompKeys.size} con % de decompilación`);

  const sorted = Object.fromEntries(Object.keys(out).sort().map((k) => [k, out[k]]));
  await writeFile(statsPath, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`✓ ${ok} ok · ${gone} 404 · ${failed} fallos → ${statsPath}`);
  if (ok === 0 && repos.length > 0) process.exitCode = 1;
}

main().catch((e) => { console.error(e); process.exit(1); });
