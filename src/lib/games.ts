// Juegos: el registro de src/data/games.yaml cruzado con las fichas. De aquí
// salen las páginas por juego (/es/juego/<id>/), el índice (/es/juegos/), el
// enlace al juego en cada ficha y «Se instala con».
import { getCollection } from "astro:content";
import launchersData from "../data/launchers.json";
import { getAllItems, sortItems, type Item } from "./catalog";
import type { Lang } from "../i18n";

export interface Game {
  id: string;
  name: string;
  igdb?: number;
  year?: number;
  platforms: string[];
}

// Página propia solo para los juegos con dos proyectos o más: con uno solo, la
// ficha ya cumple esa función, y una página casi igual Google la daría por
// duplicada.
export const MIN_PROJECTS = 2;

let gamesCache: Map<string, Game> | null = null;
export async function getGames(): Promise<Map<string, Game>> {
  if (gamesCache) return gamesCache;
  gamesCache = new Map((await getCollection("games")).map((g) => [g.id, { id: g.id, ...g.data }]));
  return gamesCache;
}

let launcherIds: Set<string> | null = null;
async function launchers(): Promise<Set<string>> {
  if (launcherIds) return launcherIds;
  launcherIds = new Set((await getCollection("tools")).filter((t) => t.data.kind === "launcher").map((t) => t.id));
  return launcherIds;
}
// Un launcher no es un proyecto del juego: sale aparte, en «Se instala con».
const isLauncher = (i: Item, ids: Set<string>) => i.type === "tool" && ids.has(i.id);

const projectsCache = new Map<Lang, Map<string, Item[]>>();
/** Proyectos de cada juego (sin launchers), ya ordenados. */
export async function projectsByGame(lang: Lang): Promise<Map<string, Item[]>> {
  const hit = projectsCache.get(lang);
  if (hit) return hit;
  const ids = await launchers();
  const map = new Map<string, Item[]>();
  for (const it of await getAllItems(lang)) {
    if (isLauncher(it, ids)) continue;
    for (const g of it.games) map.set(g, [...(map.get(g) ?? []), it]);
  }
  for (const [g, items] of map) map.set(g, sortItems(items));
  projectsCache.set(lang, map);
  return map;
}

/** Identificadores de los juegos con página propia. */
export async function gamePageIds(): Promise<string[]> {
  const byGame = await projectsByGame("es");
  return [...byGame.entries()].filter(([, items]) => items.length >= MIN_PROJECTS).map(([g]) => g).sort();
}

// launchers.json: { "<id de la ficha del launcher>": { repos: [...] } }, más
// la caché de Quiver, que no es un launcher.
const installs: Record<string, Set<string>> = Object.fromEntries(
  Object.entries(launchersData as Record<string, { repos?: string[] }>)
    .filter(([, v]) => Array.isArray(v?.repos))
    .map(([id, v]) => [id, new Set(v.repos!.map((r) => r.toLowerCase()))]),
);

const checkedAt: Record<string, string> = Object.fromEntries(
  Object.entries(launchersData as Record<string, { checkedAt?: string }>).filter(([, v]) => v?.checkedAt).map(([id, v]) => [id, v.checkedAt!]),
);

/** Proyectos del catálogo que instala un launcher, y la fecha de su lista; null si no la publica. */
export async function installedBy(toolId: string, lang: Lang): Promise<{ items: Item[]; checkedAt?: string } | null> {
  const repos = installs[toolId];
  if (!repos) return null;
  const ids = await launchers();
  const items = (await getAllItems(lang)).filter((i) => !isLauncher(i, ids) && i.repo && repos.has(i.repo.toLowerCase()));
  return { items: sortItems(items), checkedAt: checkedAt[toolId] };
}

/** Launchers de un juego: los que instalan alguno de sus proyectos según su
 *  lista publicada, y los que llevan el juego en su propia ficha. */
export async function launchersFor(gameId: string, items: Item[], lang: Lang): Promise<Item[]> {
  const repos = new Set(items.map((i) => i.repo?.toLowerCase()).filter(Boolean) as string[]);
  const ids = await launchers();
  const all = (await getAllItems(lang)).filter((i) => isLauncher(i, ids));
  return sortItems(all.filter((l) => l.games.includes(gameId) || [...(installs[l.id] ?? [])].some((r) => repos.has(r))));
}
