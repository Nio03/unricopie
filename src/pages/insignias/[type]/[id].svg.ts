// Insignias para el README de cada proyecto: /insignias/<tipo>/<id>.svg.
// Dicen «Recompendium» y el estado de la ficha, y se rehacen en cada deploy, así
// que cambian solas cuando cambia el estado. Van en inglés, como casi todos los
// README. SVG estático: sin scripts, sin seguimiento.
import type { APIRoute, GetStaticPaths } from "astro";
import { getAllItems, type Item } from "../../../lib/catalog";
import { badge, svgResponse } from "../../../lib/badge";

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

export const GET: APIRoute = ({ props }) => svgResponse(badge("Recompendium", props.label as string, props.color as string));
