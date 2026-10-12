import { getCollection, type CollectionEntry } from "astro:content";
import type { Lang } from "../i18n";

export type Post = CollectionEntry<"blog">;

// El id que genera el glob es "<lang>/<slug>", así que el idioma lo da la
// carpeta y no un campo que se pueda olvidar de rellenar.
export function postLang(p: Post): Lang {
  return p.id.startsWith("en/") ? "en" : "es";
}
export function postSlug(p: Post): string {
  return p.id.replace(/^(es|en)\//, "");
}

/** Posts publicados de un idioma, del más nuevo al más viejo. */
export async function getPosts(lang: Lang): Promise<Post[]> {
  const all = await getCollection("blog");
  return all
    .filter((p) => postLang(p) === lang && !p.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function fmtPostDate(d: Date, lang: Lang): string {
  return d.toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });
}
