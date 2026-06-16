#!/usr/bin/env node
// Validación rápida de los YAML del catálogo, pensada para PRs.
// Complementa a `astro build` (que ya valida el esquema Zod) con chequeos
// extra: YAML parseable, claves mínimas, formato de repo y slugs duplicados.
import { readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRe = /^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/;
const errors = [];
const seenRepos = new Map();

async function check(dir, kind) {
  let files = [];
  try {
    files = await readdir(dir);
  } catch {
    return;
  }
  for (const f of files.filter((x) => /\.ya?ml$/.test(x))) {
    const path = `${dir.replace(root + "\\", "").replace(root + "/", "")}/${f}`;
    let doc;
    try {
      doc = parse(await readFile(join(dir, f), "utf8"));
    } catch (e) {
      errors.push(`${path}: YAML inválido — ${e.message}`);
      continue;
    }
    if (!doc || typeof doc !== "object") {
      errors.push(`${path}: vacío o no es un objeto`);
      continue;
    }
    if (!doc.name) errors.push(`${path}: falta "name"`);
    if (!doc.desc) errors.push(`${path}: falta "desc"`);
    if (doc.repo && !repoRe.test(doc.repo)) errors.push(`${path}: "repo" debe ser owner/repo (no URL): ${doc.repo}`);
    if (kind === "recomp" && !doc.console) errors.push(`${path}: falta "console"`);
    if (kind === "tool" && !doc.kind) errors.push(`${path}: falta "kind"`);
    // Solo rastreamos repos que SÍ se enriquecen; si una entrada usa
    // enrich:false (comparte repo a propósito) no cuenta como duplicado.
    if (doc.repo && doc.enrich !== false) {
      if (seenRepos.has(doc.repo)) {
        // No es un error: a veces dos entradas comparten repo a propósito
        // (p.ej. una herramienta y el juego que valida). Solo informamos.
        console.log(`ℹ  repo compartido: ${doc.repo} (${path} y ${seenRepos.get(doc.repo)}) — ambos mostrarán los mismos datos en vivo.`);
      } else {
        seenRepos.set(doc.repo, path);
      }
    }
  }
}

await check(join(root, "src/data/recomps"), "recomp");
await check(join(root, "src/data/tools"), "tool");
await check(join(root, "src/data/ports"), "port");

if (errors.length) {
  console.error(`✗ ${errors.length} error(es) de datos:`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("✓ Datos válidos.");
