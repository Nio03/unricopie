// Insignias para el README de cada proyecto: /insignias/<tipo>/<id>.svg.
// Dicen «Recompendium» y el estado de la ficha, y se rehacen en cada deploy, así
// que cambian solas cuando cambia el estado. Van en inglés, como casi todos los
// README. SVG estático: sin scripts, sin seguimiento.
import type { APIRoute, GetStaticPaths } from "astro";
import { getAllItems, type Item } from "../../../lib/catalog";

// Ancho aproximado de cada carácter en Verdana 11px (la letra de las insignias de
// shields.io), para que el texto quepa sin medirlo en un navegador.
function textWidth(s: string): number {
  let w = 0;
  for (const c of s) {
    if ("ijl.,:;'|!I ".includes(c)) w += 3.6;
    else if ("ftr()-".includes(c)) w += 4.6;
    else if ("mwMW".includes(c)) w += 10.4;
    else if (c >= "A" && c <= "Z") w += 7.6;
    else w += 6.6;
  }
  return Math.ceil(w);
}

// Texto oscuro sobre los colores claros (el verde de «Playable»), blanco sobre el resto.
function inkOn(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  return lum > 0.35 ? "#14161f" : "#ffffff";
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function badge(left: string, right: string, color: string): string {
  const lw = textWidth(left) + 14;
  const rw = textWidth(right) + 14;
  const w = lw + rw;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="20" role="img" aria-label="${esc(`${left}: ${right}`)}">
<title>${esc(`${left}: ${right}`)}</title>
<linearGradient id="s" x2="0" y2="100%"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-opacity=".12"/></linearGradient>
<clipPath id="r"><rect width="${w}" height="20" rx="3" fill="#fff"/></clipPath>
<g clip-path="url(#r)"><rect width="${lw}" height="20" fill="#23263a"/><rect x="${lw}" width="${rw}" height="20" fill="${color}"/><rect width="${w}" height="20" fill="url(#s)"/></g>
<g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
<text x="${lw / 2}" y="15" fill="#010101" fill-opacity=".3">${esc(left)}</text><text x="${lw / 2}" y="14" fill="#e8c35a">${esc(left)}</text>
<text x="${lw + rw / 2}" y="14" fill="${inkOn(color)}">${esc(right)}</text>
</g></svg>`;
}

function stateOf(it: Item): { label: string; color: string } {
  if (it.takedown) return { label: "Taken down", color: "#c0392b" };
  if (it.abandoned) return { label: "Abandoned", color: "#6b7186" };
  if (it.status) return { label: it.status.label, color: it.status.color };
  return { label: "Listed", color: "#5f8fd4" };
}

export const getStaticPaths = (async () => {
  const items = await getAllItems("en");
  return items.filter((i) => !i.external).map((it) => ({ params: { type: it.type, id: it.id }, props: stateOf(it) }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(badge("Recompendium", props.label as string, props.color as string), {
    headers: { "Content-Type": "image/svg+xml; charset=utf-8" },
  });
