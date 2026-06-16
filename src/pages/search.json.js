import { getAllItems } from "../lib/catalog";

// Índice del buscador central: un solo JSON, neutro al idioma (lleva ambos
// hrefs y un blob de búsqueda con texto ES+EN). El overlay lo descarga una vez.
export async function GET() {
  const es = await getAllItems("es");
  const en = await getAllItems("en");
  const items = es.map((i, idx) => ({
    n: i.name,
    t: i.type,
    c: i.consoleKeys[0] ?? "",
    he: i.href,
    hn: en[idx]?.href ?? i.href,
    q: (i.search + " " + (en[idx]?.search ?? "")).toLowerCase(),
  }));
  return new Response(JSON.stringify({ items }), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
