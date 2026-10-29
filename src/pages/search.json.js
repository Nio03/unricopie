import { getAllItems } from "../lib/catalog";
import { getGames, gamePageIds } from "../lib/games";
import { localePath } from "../i18n";

// Índice del buscador central: un solo JSON, neutro al idioma (lleva ambos
// hrefs y un blob de búsqueda con texto ES+EN). El overlay lo descarga una vez.
// Los juegos con página propia van primero: quien busca «mario 64» encuentra
// antes el juego y después sus proyectos.
export async function GET() {
  const es = await getAllItems("es");
  const en = await getAllItems("en");
  const games = await getGames();
  const gameItems = (await gamePageIds()).map((id) => {
    const g = games.get(id);
    return {
      n: g.name,
      t: "game",
      c: g.platforms.find((p) => p !== "other") ?? "",
      he: localePath("es", `juego/${id}`),
      hn: localePath("en", `juego/${id}`),
      q: [g.name, id.replace(/-/g, " "), ...g.platforms].join(" ").toLowerCase(),
    };
  });
  const items = [...gameItems, ...es.map((i, idx) => ({
    n: i.name,
    t: i.type,
    c: i.consoleKeys[0] ?? "",
    he: i.href,
    hn: en[idx]?.href ?? i.href,
    q: (i.search + " " + (en[idx]?.search ?? "")).toLowerCase(),
  }))];
  return new Response(JSON.stringify({ items }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
