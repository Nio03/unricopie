// Importa el registro de decompilaciones de decomp.dev a src/data/decomps/.
// Datos reales: nombre, plataforma→consola, repo, descripción (GitHub), y el
// campo `decomp` (el bot rellena el % de matched_code en vivo).
//   node scripts/import-decomps.mjs
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { stringify } from "yaml";

async function loadToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    const env = await readFile(".env.local", "utf8");
    const m = env.match(/^\s*(?:GITHUB_TOKEN|GH_TOKEN)\s*=\s*["']?([^"'\s]+)/m);
    if (m) return m[1];
  } catch {}
  return "";
}
const token = await loadToken();
const headers = { "User-Agent": "recompendium", ...(token ? { Authorization: `Bearer ${token}` } : {}) };

const PLATFORM = { gc: "gamecube", wii: "wii", wiiu: "wiiu", n64: "n64", ps2: "ps2", ps: "ps1", ps1: "ps1", psp: "psp", xbox360: "x360", xbox: "xbox", win32: "pc", switch: "switch", nds: "nds", gba: "gba", dreamcast: "dreamcast" };

function slugify(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "decomp";
}

const projects = (await (await fetch("https://decomp.dev/projects.json", { headers })).json()).projects;
await mkdir("src/data/decomps", { recursive: true });
const used = new Set();
let n = 0;
for (const p of projects) {
  const repo = `${p.owner}/${p.repo}`;
  let desc = "";
  try {
    const r = await fetch(`https://api.github.com/repos/${repo}`, { headers });
    if (r.ok) desc = (await r.json()).description || "";
  } catch {}
  const console_ = PLATFORM[p.platform] || "other";
  let slug = slugify(p.name);
  if (used.has(slug)) slug = `${slug}-${slugify(p.owner)}`;
  used.add(slug);
  const text = desc || `${p.name} — proyecto de decompilación (${p.platform}).`;
  const doc = {
    name: p.name,
    console: console_,
    repo,
    decomp: repo,
    desc: { es: text, en: text },
  };
  await writeFile(`src/data/decomps/${slug}.yaml`, stringify(doc, { lineWidth: 0 }));
  n++;
}
console.log(`✓ ${n} decompilaciones importadas a src/data/decomps/`);
console.log(`(consolas nuevas usadas: revisa que existan en consoles.ts)`);
