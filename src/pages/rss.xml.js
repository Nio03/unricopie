import { execFileSync } from "node:child_process";
import { getAllItems } from "../lib/catalog";

// Feed de novedades del catálogo. Pedido en r/recomps: un catálogo que crece
// cada semana no sirve de nada si hay que entrar a mirar si ha cambiado algo.
//
// La fecha de alta no vive en los YAML (sería un dato a mano que se olvida de
// actualizar), así que sale de git: el primer commit que añadió cada archivo.
// Una sola llamada a git para todo el historial, no una por ficha.
const LIMIT = 40;
const SITE = "https://nio03.github.io/unricopie";

function fechasDeAlta() {
  try {
    const salida = execFileSync(
      "git",
      ["log", "--diff-filter=A", "--date=iso-strict", "--pretty=format:@%cd", "--name-only", "--", "src/data"],
      { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
    );
    const mapa = new Map();
    let fecha = null;
    for (const linea of salida.split("\n")) {
      if (linea.startsWith("@")) { fecha = linea.slice(1); continue; }
      const m = linea.match(/^src\/data\/(recomps|ports|tools|decomps)\/(.+)\.ya?ml$/);
      // git log va de nuevo a viejo: la PRIMERA vez que vemos un archivo es su
      // commit mas reciente, pero con --diff-filter=A solo salen las altas, y
      // nos quedamos con la ultima que se lee, que es el alta original.
      if (m && fecha) mapa.set(`${m[1]}/${m[2]}`, fecha);
    }
    return mapa;
  } catch {
    // Sin historial (checkout superficial, tarball): el feed sale igual, solo
    // que sin ordenar por alta. Mejor un feed sin fechas que un build roto.
    return new Map();
  }
}

const esc = (s) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const items = await getAllItems("es");
  const fechas = fechasDeAlta();
  const clave = (i) => `${i.type === "recomp" ? "recomps" : i.type === "tool" ? "tools" : i.type === "port" ? "ports" : "decomps"}/${i.id}`;

  const conFecha = items
    .map((i) => ({ i, fecha: fechas.get(clave(i)) }))
    .filter((x) => x.fecha)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
    .slice(0, LIMIT);

  // Si git no estaba disponible, al menos publicamos algo coherente.
  const lista = conFecha.length ? conFecha : items.slice(0, LIMIT).map((i) => ({ i, fecha: null }));

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

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Recompendium — novedades</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Altas recientes en el catálogo de recompilaciones, decompilaciones, ports y herramientas.</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${entradas.join("\n")}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
