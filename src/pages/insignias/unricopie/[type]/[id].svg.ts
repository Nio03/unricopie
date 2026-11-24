// Insignia «Install with | Unricopie» para el README de los proyectos que
// Unricopie sabe instalar: /insignias/unricopie/<tipo>/<id>.svg. Solo existe para
// las fichas de src/data/unricopie.json que no están retiradas; enlaza a la ficha,
// donde está el botón de instalar. SVG estático: sin scripts, sin seguimiento.
import type { APIRoute, GetStaticPaths } from "astro";
import { getAllItems } from "../../../../lib/catalog";
import { badge, svgResponse } from "../../../../lib/badge";
import unricopie from "../../../../data/unricopie.json";

const instalables = new Set((unricopie as { instalables: string[] }).instalables);

export const getStaticPaths = (async () => {
  const items = await getAllItems("en");
  return items
    .filter((i) => !i.external && !i.takedown && instalables.has(`${i.type === "decomp" ? "decomps" : i.type + "s"}/${i.id}`))
    .map((it) => ({ params: { type: it.type, id: it.id } }));
}) satisfies GetStaticPaths;

// El dorado de los botones de instalar del sitio (--gold).
export const GET: APIRoute = () => svgResponse(badge("Install with", "Unricopie", "#f2b54e"));
