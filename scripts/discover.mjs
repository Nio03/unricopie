#!/usr/bin/env node
// Descubre proyectos nuevos a partir del RSS de Video Game Esoterica.
//
// SOLO descubre y avisa: nunca escribe en el catálogo. Clasificar un proyecto
// (recomp / port / tool / decomp, o fuera) exige leer el README y decidir, y
// ahí una heurística se equivoca: WheelWizard parece un launcher de recomps y
// es un gestor de mods sobre Dolphin; gen1recomp se llama "recomp" y es un
// remake en LÖVE2D. Eso lo hace una persona, no este script.
//
// El RSS no pide clave de API ni gasta cuota, pero solo trae los últimos 15
// vídeos (~7 días al ritmo del canal). Por eso el workflow le pasa la tanda
// anterior con --previous: un candidato sigue en la lista hasta que entra en
// el catálogo o en la lista de descartes, aunque su vídeo ya no esté en el feed.
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dataDirs = ["recomps", "tools", "ports", "decomps"].map((d) => join(root, "src/data", d));
const ignorePath = join(root, "scripts/discovery-ignore.txt");
const FEED = "https://www.youtube.com/feeds/videos.xml?channel_id=UCn2pQB4jsCTLUtx2NIkCvUg";
const HOSTS = /^(?:www\.)?(github\.com|gitlab\.com|codeberg\.org|bitbucket\.org)$/i;

const args = process.argv.slice(2);
const argOf = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : ""; };

// Token: env var o .env.local (KEY=VALUE), igual que refresh-stats.
async function loadToken() {
  if (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) return process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  try {
    const env = await readFile(join(root, ".env.local"), "utf8");
    const m = env.match(/^\s*(?:GITHUB_TOKEN|GH_TOKEN)\s*=\s*["']?([^"'\s]+)/m);
    if (m) return m[1];
  } catch {}
  return "";
}

const unescapeXml = (s) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
   .replace(/&#3?9;/g, "'").replace(/&#x27;/g, "'").replace(/&amp;/g, "&");

// El feed de YouTube es estable y pequeño; un parser de XML entero sería
// una dependencia nueva para tres campos.
function parseFeed(xml) {
  const out = [];
  for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const e = m[1];
    const pick = (tag) => (e.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)) ?? [, ""])[1];
    out.push({
      id: pick("yt:videoId"),
      title: unescapeXml(pick("title")).trim(),
      date: pick("published").slice(0, 10),
      desc: unescapeXml(pick("media:description")),
    });
  }
  return out;
}

// Todos los hosts, no solo github.com: así aparecieron los proyectos en GitLab.
function reposFromText(text) {
  const found = [];
  for (let u of text.match(/https?:\/\/[^\s<>()\]"]+/g) ?? []) {
    u = u.replace(/[.,;:)]+$/, "");
    let url;
    try { url = new URL(u); } catch { continue; }
    if (!HOSTS.test(url.hostname)) continue;
    const p = url.pathname.split("/").filter(Boolean);
    if (p.length < 2) continue;
    found.push({ host: url.hostname.replace(/^www\./, "").toLowerCase(), slug: `${p[0]}/${p[1].replace(/\.git$/, "")}` });
  }
  return found;
}

// Slugs que YA están en el catálogo, de repo: y de repoUrl:.
async function catalogSlugs() {
  const slugs = new Set();
  for (const dir of dataDirs) {
    let files = [];
    try { files = await readdir(dir); } catch { continue; }
    for (const f of files.filter((x) => /\.ya?ml$/.test(x))) {
      const doc = parse(await readFile(join(dir, f), "utf8")) || {};
      if (typeof doc.repo === "string") slugs.add(doc.repo.toLowerCase());
      if (typeof doc.repoUrl === "string") for (const r of reposFromText(doc.repoUrl)) slugs.add(r.slug.toLowerCase());
    }
  }
  return slugs;
}

// Descartes deliberados. Sin esto el bot vuelve a proponer cada día lo mismo.
async function ignoreSlugs() {
  const out = new Set();
  try {
    for (const line of (await readFile(ignorePath, "utf8")).split(/\r?\n/)) {
      const slug = line.split("#")[0].trim();
      if (slug) out.add(slug.toLowerCase());
    }
  } catch {}
  return out;
}

async function enrich(slug, token) {
  const headers = { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
  const res = await fetch(`https://api.github.com/repos/${slug}`, { headers });
  if (!res.ok) return { gone: res.status === 404, status: res.status };
  const d = await res.json();
  return {
    // full_name es el canónico: si el repo se movió, aquí sale el nombre nuevo
    // y así un "candidato" que en realidad ya está en el catálogo se cae solo.
    canonical: d.full_name,
    desc: d.description ?? "",
    stars: d.stargazers_count,
    lang: d.language ?? "",
    license: d.license?.spdx_id ?? "",
    pushed: d.pushed_at?.slice(0, 10) ?? "",
    archived: d.archived,
    fork: d.fork ? d.parent?.full_name ?? "sí" : "",
  };
}

const main = async () => {
  const token = await loadToken();
  if (!token) console.error("aviso: sin GITHUB_TOKEN, la API de GitHub va a 60 req/hora.");

  const feed = parseFeed(await (await fetch(FEED)).text());
  if (!feed.length) { console.error("error: el feed no devolvió entradas."); process.exit(1); }

  // Candidatos del feed + los que arrastramos de la tanda anterior.
  const cands = new Map(); // slug en minúsculas -> { host, slug, videos[] }
  const add = (host, slug, video) => {
    const k = slug.toLowerCase();
    if (!cands.has(k)) cands.set(k, { host, slug, videos: [] });
    const c = cands.get(k);
    if (video && !c.videos.some((v) => v.id === video.id)) c.videos.push(video);
  };
  for (const v of feed) for (const r of reposFromText(v.desc)) add(r.host, r.slug, { id: v.id, title: v.title, date: v.date });

  const prevPath = argOf("--previous");
  if (prevPath) {
    try {
      for (const c of JSON.parse(await readFile(prevPath, "utf8"))) {
        add(c.host, c.slug);
        for (const v of c.videos ?? []) add(c.host, c.slug, v);
      }
    } catch {}
  }

  const known = await catalogSlugs();
  const ignored = await ignoreSlugs();
  const isKnown = (s) => known.has(s.toLowerCase()) || ignored.has(s.toLowerCase());

  const news = [];
  for (const c of cands.values()) {
    if (isKnown(c.slug)) continue;
    if (c.host !== "github.com") { news.push({ ...c, note: `host ${c.host}: verificar a mano` }); continue; }
    const info = await enrich(c.slug, token);
    if (info.gone) continue;                                    // repo borrado o privado
    if (info.canonical && isKnown(info.canonical)) continue;     // redirect a algo que ya tenemos
    news.push({ ...c, ...info });
  }
  news.sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1));

  const jsonPath = argOf("--json");
  // El salto final importa: el workflow pega este JSON dentro de un comentario
  // HTML del issue, y sin él el "]" acaba en la misma línea que el "-->".
  if (jsonPath) await writeFile(jsonPath, JSON.stringify(news, null, 2) + "\n");

  // Markdown para el issue.
  const lines = [];
  if (!news.length) {
    lines.push("Sin candidatos nuevos.");
  } else {
    lines.push(`**${news.length} candidato(s)** sin ficha en el catálogo ni en la lista de descartes.`, "");
    lines.push("| Repo | ★ | Lenguaje | Descripción de GitHub | Vídeo |", "|---|---|---|---|---|");
    for (const c of news) {
      const name = c.canonical ?? c.slug;
      const url = `https://${c.host}/${c.slug}`;
      const v = c.videos[0];
      const vid = v ? `[${v.date}](https://youtu.be/${v.id})` : "—";
      const flags = [c.archived && "ARCHIVADO", c.fork && `fork de ${c.fork}`, c.note].filter(Boolean).join(", ");
      const desc = ((c.desc ?? "") + (flags ? ` _(${flags})_` : "")).replace(/\|/g, "\\|").slice(0, 160) || "—";
      lines.push(`| [${name}](${url}) | ${c.stars ?? "—"} | ${c.lang || "—"} | ${desc} | ${vid} |`);
    }
    lines.push("", "<details><summary>Títulos de los vídeos</summary>", "");
    for (const c of news) for (const v of c.videos) lines.push(`- \`${c.slug}\` — ${v.date} · ${v.title}`);
    lines.push("", "</details>");
  }
  lines.push("", "---",
    "Clasificar a mano: leer el README y decidir sección, o añadirlo a `scripts/discovery-ignore.txt` con el motivo.",
    "Cuando un candidato entra en el catálogo o en esa lista, desaparece de aquí en la siguiente pasada.");
  console.log(lines.join("\n"));
};

main().catch((e) => { console.error(e); process.exit(1); });
