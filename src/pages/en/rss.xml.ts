import { buildFeed } from "../../lib/feed";

export async function GET() {
  return new Response(await buildFeed("en"), {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
