import { getCollection } from "astro:content";

// Lista de juegos del registro (src/data/games.yaml) para el campo «Juego o
// juegos» del formulario. Va aparte y el formulario la descarga solo cuando
// alguien escribe en ese campo: el formulario de edición está en cada ficha, y
// meter ahí los ~900 juegos haría más pesadas todas las páginas.
export async function GET() {
  const games = (await getCollection("games"))
    .map((g) => ({ id: g.id, n: g.data.name, y: g.data.year ?? null }))
    .sort((a, b) => a.n.localeCompare(b.n));
  return new Response(JSON.stringify({ games }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
