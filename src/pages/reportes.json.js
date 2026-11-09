import reportes from "../data/reportes.json";

// Los reportes de la gente sobre cómo funciona cada proyecto (los suma
// scripts/refresh-reports.mjs desde los issues con la etiqueta «reporte»).
// Los lee Unricopie para enseñarlos en la página de cada juego.
export async function GET() {
  return new Response(JSON.stringify(reportes), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
