import { buildFeed } from "../lib/feed";

// Dirección antigua del feed en español, de antes de mover el español a /es/.
// Los lectores de RSS no siguen redirecciones con <meta>, así que aquí se sigue
// sirviendo el mismo feed para no dejar sin novedades a quien ya se suscribió.
export async function GET() {
  return new Response(await buildFeed("es"), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
