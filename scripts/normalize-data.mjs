#!/usr/bin/env node
// Normaliza los YAML del catálogo a un formato canónico y limpio:
//  · quita `author` cuando solo repite al dueño del repo (dato duplicado)
//  · saca de `repoUrl` las URLs que no son un repo de código (homepage / links)
//  · elimina tags basura y duplicados
//  · ordena los campos en un orden estable y omite defaults vacíos
//
// Uso:
//   node scripts/normalize-data.mjs           # dry-run: muestra el plan
//   node scripts/normalize-data.mjs --apply    # reescribe los archivos
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, stringify } from "yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const APPLY = process.argv.includes("--apply");

const ORDER = {
  recomps: ["name", "console", "status", "repo", "repoUrl", "homepage", "author", "originalDeveloper", "year", "progress", "toolchain", "desc", "tags", "links", "featured", "enrich"],
  tools: ["name", "kind", "consoles", "repo", "repoUrl", "homepage", "author", "status", "ours", "desc", "tags", "links", "featured", "enrich"],
  ports: ["name", "category", "console", "status", "repo", "repoUrl", "homepage", "author", "originalDeveloper", "engine", "year", "desc", "tags", "links", "featured", "enrich"],
};

// tags que no aportan nada (basura o ruido editorial)
const TAG_BLOCKLIST = new Set(["oficial", "official"]);

function cleanAuthor(author, repo) {
  if (!author) return undefined;
  if (!repo) return author;
  const owner = repo.split("/")[0];
  if (/[/(]/.test(author)) return author; // "Owner / Persona" o "Owner (Nombre)" → aporta nombre real
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const a = norm(author), o = norm(owner);
  if (a === o || a.includes(o) || o.includes(a)) return undefined; // solo repite al owner
  return author;
}

function cleanTags(tags) {
  if (!Array.isArray(tags)) return undefined;
  const seen = new Set();
  const out = [];
  for (const raw of tags) {
    const t = String(raw).trim();
    if (!t || TAG_BLOCKLIST.has(t.toLowerCase())) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out.length ? out : undefined;
}

const isCodeHost = (u) => /(github|gitlab|bitbucket|sourceforge|codeberg)\.(com|org)/i.test(u);
const isWiki = (u) => /wikipedia\.org/i.test(u);

function normalize(kind, id, d) {
  const changes = [];
  const out = { ...d };

  // 1. author redundante
  if ("author" in out) {
    const cleaned = cleanAuthor(out.author, out.repo);
    if (cleaned === undefined && out.author !== undefined) { delete out.author; changes.push(`drop author "${d.author}"`); }
    else if (cleaned !== out.author) { out.author = cleaned; changes.push(`author → "${cleaned}"`); }
  }

  // 2. repoUrl que no es un repo de código → homepage o links
  if (out.repoUrl && !isCodeHost(out.repoUrl)) {
    const url = out.repoUrl;
    delete out.repoUrl;
    if (isWiki(url)) {
      out.links = [...(out.links || []), { label: "Wikipedia", url }];
      changes.push(`repoUrl(wiki) → links`);
    } else {
      out.homepage = url;
      changes.push(`repoUrl → homepage (${url})`);
    }
  }

  // 3. tags
  if ("tags" in out) {
    const before = JSON.stringify(out.tags);
    const cleaned = cleanTags(out.tags);
    if (cleaned === undefined) { delete out.tags; }
    else out.tags = cleaned;
    if (JSON.stringify(out.tags ?? null) !== before && before !== "null") changes.push(`tags ${before} → ${JSON.stringify(out.tags ?? null)}`);
  }

  // 4. omitir defaults vacíos
  if (out.featured === false) delete out.featured;
  if (out.enrich === true) delete out.enrich;
  if (Array.isArray(out.links) && out.links.length === 0) delete out.links;
  if (Array.isArray(out.tags) && out.tags.length === 0) delete out.tags;

  // 5. reordenar
  const order = ORDER[kind];
  const ordered = {};
  for (const key of order) if (key in out) ordered[key] = out[key];
  for (const key of Object.keys(out)) if (!(key in ordered)) { ordered[key] = out[key]; changes.push(`⚠ campo extra fuera de orden: ${key}`); }

  return { ordered, changes };
}

async function run() {
  let touched = 0, total = 0;
  for (const kind of Object.keys(ORDER)) {
    const dir = join(root, "src/data", kind);
    const files = (await readdir(dir)).filter((f) => /\.ya?ml$/.test(f));
    for (const f of files) {
      total++;
      const id = f.replace(/\.ya?ml$/, "");
      const path = join(dir, f);
      const d = parse(await readFile(path, "utf8"));
      const { ordered, changes } = normalize(kind, id, d);
      const yaml = stringify(ordered, { lineWidth: 0 });
      if (changes.length) {
        touched++;
        console.log(`\n${kind}/${f}`);
        for (const c of changes) console.log(`   · ${c}`);
      }
      if (APPLY) await writeFile(path, yaml);
    }
  }
  console.log(`\n${APPLY ? "APLICADO" : "DRY-RUN"} · ${touched}/${total} archivos con cambios.`);
  if (!APPLY) console.log("Repite con --apply para escribir.");
}
run().catch((e) => { console.error(e); process.exit(1); });
