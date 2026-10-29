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
const warnings = [];
const seenRepos = new Map();
// Registro de juegos: cada identificador de `games` en una ficha tiene que estar aquí.
const games = parse(await readFile(join(root, "src/data/games.yaml"), "utf8")) ?? {};
const usedGames = new Set();

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
    if ((kind === "recomp" || kind === "decomp" || kind === "mod") && !doc.console) errors.push(`${path}: falta "console"`);
    if (kind === "mod" && (!doc.kind || !doc.game)) errors.push(`${path}: falta "kind" o "game"`);
    if (kind === "tool" && !doc.kind) errors.push(`${path}: falta "kind"`);
    for (const g of doc.games ?? []) {
      if (!games[g]) errors.push(`${path}: el juego "${g}" no está en src/data/games.yaml`);
      usedGames.add(g);
    }
    // Solo rastreamos repos que SÍ se enriquecen; si una entrada usa
    // enrich:false (comparte repo a propósito) no cuenta como duplicado.
    if (doc.repo && doc.enrich !== false) {
      const prev = seenRepos.get(doc.repo);
      if (prev) {
        if (prev.kind === kind) {
          // Mismo tipo: normal. Un proyecto puede cubrir varios juegos
          // (p.ej. Zelda64Recomp sirve a Majora's Mask y a Ocarina of Time).
          console.log(`ℹ  repo compartido: ${doc.repo} (${path} y ${prev.path}) — ambos mostrarán los mismos datos en vivo.`);
        } else {
          // Tipos distintos: casi siempre es un error. Un juego que apunta al
          // repo de su toolchain hereda las estrellas y el último push de la
          // herramienta. Si es a propósito, pon enrich: false en la entrada.
          warnings.push(
            `${path} (${kind}) comparte repo con ${prev.path} (${prev.kind}): ${doc.repo}\n` +
              `      Un ${kind} no suele compartir repo con un ${prev.kind}. Revisa si apunta al repo equivocado\n` +
              `      (mostraría las estrellas y el último push del otro proyecto). Si es intencionado, usa enrich: false.`,
          );
        }
      } else {
        seenRepos.set(doc.repo, { path, kind });
      }
    }
  }
}

await check(join(root, "src/data/recomps"), "recomp");
await check(join(root, "src/data/tools"), "tool");
await check(join(root, "src/data/ports"), "port");
await check(join(root, "src/data/decomps"), "decomp");
await check(join(root, "src/data/mods"), "mod");

const unused = Object.keys(games).filter((g) => !usedGames.has(g));
if (unused.length) warnings.push(`${unused.length} juego(s) del registro sin ninguna ficha: ${unused.join(", ")}`);

if (warnings.length) {
  console.warn(`⚠  ${warnings.length} aviso(s):`);
  for (const w of warnings) console.warn("  - " + w);
}
if (errors.length) {
  console.error(`✗ ${errors.length} error(es) de datos:`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("✓ Datos válidos.");
