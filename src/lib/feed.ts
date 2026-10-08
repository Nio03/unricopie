import { execFileSync } from "node:child_process";
import { getAllItems } from "./catalog";
import type { Lang } from "../i18n";

// Generador del feed de novedades, compartido por /rss.xml y /en/rss.xml.
// Pedido en r/recomps: un catálogo que crece cada semana no sirve de nada si
// hay que entrar a mirar si ha cambiado algo.
const LIMIT = 40;
const SITE = "https://nio03.github.io/unricopie";

const TEXTOS = {
  es: {
    titulo: "Recompendium — novedades",
    desc: "Altas recientes en el catálogo de recompilaciones, decompilaciones, ports y herramientas.",
  },
  en: {
    titulo: "Recompendium — what's new",
    desc: "Recent additions to the catalogue of recompilations, decompilations, ports and tools.",
  },
} as const;

// La fecha de alta no vive en los YAML (sería un dato a mano que se olvida de
// actualizar): sale del primer commit que añadió cada archivo. Una sola llamada
// a git para todo el historial, no una por ficha.
function fechasDeAlta(): Map<string, string> {
  try {
    const salida = execFileSync(
      "git",
      ["log", "--diff-filter=A", "--date=iso-strict", "--pretty=format:@%cd", "--name-only", "--", "src/data"],
      { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
    );
    const mapa = new Map<string, string>();
    let fecha: string | null = null;
    for (const linea of salida.split("\n")) {
      if (linea.startsWith("@")) { fecha = linea.slice(1); continue; }
      const m = linea.match(/^src\/data\/(recomps|ports|tools|decomps)\/(.+)\.ya?ml$/);
      // git log va de nuevo a viejo y --diff-filter=A solo lista altas, así que
      // la última lectura de cada archivo es su alta original.
      if (m && fecha) mapa.set(`${m[1]}/${m[2]}`, fecha);
    }
    return mapa;
  } catch {
    // Sin historial (checkout superficial, tarball) el feed sale sin fechas en
    // vez de romper el build.
    return new Map();
  }
}

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const carpeta = (tipo: string) =>
  tipo === "recomp" ? "recomps" : tipo === "tool" ? "tools" : tipo === "port" ? "ports" : "decomps";

export async function buildFeed(lang: Lang): Promise<string> {
  const items = await getAllItems(lang);
  const fechas = fechasDeAlta();
  const t = TEXTOS[lang];
  const self = `${SITE}${lang === "en" ? "/en" : ""}/rss.xml`;

  const conFecha = items
    .map((i) => ({ i, fecha: fechas.get(`${carpeta(i.type)}/${i.id}`) }))
    .filter((x) => x.fecha)
    .sort((a, b) => b.fecha!.localeCompare(a.fecha!))
    .slice(0, LIMIT);
  const lista = conFecha.length ? conFecha : items.slice(0, LIMIT).map((i) => ({ i, fecha: undefined }));

  const entradas = lista.map(({ i, fecha }) => {
    const url = `${SITE}${i.href.replace(/^\/unricopie/, "")}/`;
    const meta = [i.kindLabel, i.status?.label, i.repo].filter(Boolean).join(" · ");
    return `    <item>
      <title>${esc(i.name)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <category>${esc(i.typeLabel)}</category>
      ${fecha ? `<pubDate>${new Date(fecha).toUTCString()}</pubDate>` : ""}
      <description>${esc(`${meta}. ${i.desc}`)}</description>
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(t.titulo)}</title>
    <link>${SITE}${lang === "en" ? "/en" : ""}/</link>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
    <description>${esc(t.desc)}</description>
    <language>${lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${entradas.join("\n")}
  </channel>
</rss>
`;
}
