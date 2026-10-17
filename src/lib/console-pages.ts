import { getCollection } from "astro:content";
import { CONSOLE_KEYS } from "./consoles";

// Consolas con página propia (/es/consola/<clave>/): las que tienen al menos una
// ficha en el catálogo. Fuera «pc» (un juego de PC en PC no es lo que se busca)
// y «other», que no es una consola.
let cache: string[] | null = null;
export async function consolePageKeys(): Promise<string[]> {
  if (cache) return cache;
  const present = new Set<string>();
  const [recomps, ports, decomps, tools, mods] = await Promise.all([
    getCollection("recomps"), getCollection("ports"), getCollection("decomps"), getCollection("tools"), getCollection("mods"),
  ]);
  for (const e of [...recomps, ...ports, ...decomps, ...mods]) if (e.data.console) present.add(e.data.console);
  for (const e of tools) for (const c of e.data.consoles ?? []) present.add(c);
  cache = CONSOLE_KEYS.filter((k) => present.has(k) && k !== "pc" && k !== "other");
  return cache;
}
