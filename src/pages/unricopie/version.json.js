import publicada from "../../data/unricopie-version.json";

// La versión publicada de Unricopie, para que el launcher avise cuando hay una más nueva. Sale
// del mismo dato que los botones de descarga de /unricopie (src/data/unricopie-version.json).
export async function GET() {
  const cuerpo = { formato: 1, version: publicada.version, fecha: publicada.fecha, pagina: publicada.pagina };
  return new Response(JSON.stringify(cuerpo), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
