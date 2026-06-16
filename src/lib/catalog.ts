// Capa de datos unificada: convierte recomps / tools / ports en un mismo `Item`
// para que el catálogo, las tarjetas y las páginas de detalle usen UNA sola forma.
import { getCollection, type CollectionEntry } from "astro:content";
import { consoleMeta } from "./consoles";
import { statusMeta, toolKindMeta, toolStatusMeta } from "./status";
import { statFor } from "./stats";
import { t, localePath, type Lang } from "../i18n";

export type ItemType = "recomp" | "tool" | "port" | "decomp";

export interface Item {
  type: ItemType;
  id: string;
  name: string;
  desc: string;
  requirements?: string;
  forkOf?: { label: string; url: string };
  href: string;
  external: boolean;
  railColor: string;
  boxLabel: string;
  typeLabel: string;
  typeColor: string;
  kindLabel: string;
  statusKey: string;
  status: { label: string; color: string } | null;
  consoleKeys: string[];
  repo?: string;
  stars?: number;
  pushedAt?: string;
  version?: string;
  progress?: number;       // métrica unificada de la barra (avance o % decomp)
  progressLabel?: string;  // su etiqueta ya localizada
  tags: string[];
  featured: boolean;
  ours: boolean;
  abandoned: boolean;
  takedown: boolean;
  search: string;
}

// Colores de tipo y categoría — fuente única de verdad (los reusan las páginas).
export const TYPE_COLOR: Record<ItemType, string> = {
  recomp: "#ef6a4d",
  tool: "#9b87e0",
  port: "#3fb0a8",
  decomp: "#5fb3c9",
};
export const CAT_COLOR: Record<string, string> = { "decomp-port": "#3fb0a8", "fan-remake": "#cd7dd6" };

// Código corto para la mini-portada del catálogo (estilo RetroAchievements).
const TOOL_BOX: Record<string, string> = { recompiler: "RCMP", launcher: "LNCH", patcher: "PTCH", library: "LIB" };

function liveStat(d: { enrich?: boolean; repo?: string }) {
  return d.enrich === false ? {} : statFor(d.repo);
}

// Relación de fork: la curada (d.forkOf) manda; si no, la detectada por el bot.
function forkInfo(d: { forkOf?: { label: string; url: string } }, s: { fork?: string }) {
  return d.forkOf ?? (s.fork ? { label: s.fork, url: `https://github.com/${s.fork}` } : undefined);
}

// Métrica ÚNICA de la barra de progreso para CUALQUIER item: avance curado si lo
// hay, si no el % de decompilación. Un solo lugar → la Card nunca diverge.
function metric(d: { progress?: number; decomp?: string }, lang: Lang): { progress?: number; progressLabel?: string } {
  if (d.progress != null) return { progress: d.progress, progressLabel: t(lang, "card.progress", { n: d.progress }) };
  const dp = d.decomp ? statFor(d.decomp).decompPercent : undefined;
  if (dp != null) return { progress: dp, progressLabel: t(lang, "card.decomp", { n: dp }) };
  return {};
}

export function recompItem(e: CollectionEntry<"recomps">, lang: Lang): Item {
  const d = e.data;
  const cm = consoleMeta(d.console);
  const sm = statusMeta(d.status);
  const s = liveStat(d);
  return {
    type: "recomp", id: e.id, name: d.name, desc: d.desc[lang], requirements: d.requirements?.[lang], forkOf: forkInfo(d, s),
    href: localePath(lang, `recomp/${e.id}`), external: false,
    railColor: cm.color, boxLabel: cm.tag, typeLabel: t(lang, "type.recomp"), typeColor: TYPE_COLOR.recomp,
    kindLabel: cm.label, statusKey: d.status,
    status: { label: t(lang, `status.${d.status}`), color: sm.color },
    consoleKeys: [d.console], repo: d.repo, stars: s.stars, pushedAt: s.pushedAt, version: s.version,
    ...metric(d, lang),
    tags: d.tags, featured: d.featured, ours: false, abandoned: d.abandoned, takedown: d.takedown,
    search: [d.name, d.repo, d.author, cm.label, cm.full, ...d.tags, d.desc[lang]].filter(Boolean).join(" ").toLowerCase(),
  };
}

export function toolItem(e: CollectionEntry<"tools">, lang: Lang): Item {
  const d = e.data;
  const km = toolKindMeta(d.kind);
  const ts = toolStatusMeta(d.status);
  const s = liveStat(d);
  return {
    type: "tool", id: e.id, name: d.name, desc: d.desc[lang], forkOf: forkInfo(d, s),
    href: d.ours ? localePath(lang, "unricopie") : localePath(lang, `tool/${e.id}`), external: false,
    railColor: km.color, boxLabel: TOOL_BOX[d.kind] ?? "TOOL", typeLabel: t(lang, "type.tool"), typeColor: TYPE_COLOR.tool,
    kindLabel: t(lang, `toolkind.${d.kind}`), statusKey: d.status ?? "",
    status: ts ? { label: t(lang, `toolstatus.${d.status}`), color: ts.color } : null,
    consoleKeys: d.consoles, repo: d.repo, stars: s.stars, pushedAt: s.pushedAt, version: s.version,
    tags: d.tags, featured: d.featured, ours: d.ours, abandoned: d.abandoned, takedown: d.takedown,
    search: [d.name, d.repo, d.author, t(lang, `toolkind.${d.kind}`), ...d.tags, d.desc[lang]].filter(Boolean).join(" ").toLowerCase(),
  };
}

export function portItem(e: CollectionEntry<"ports">, lang: Lang): Item {
  const d = e.data;
  const cm = d.console ? consoleMeta(d.console) : null;
  const sm = statusMeta(d.status);
  const s = liveStat(d);
  const catColor = CAT_COLOR[d.category] ?? "#9AA0B5";
  return {
    type: "port", id: e.id, name: d.name, desc: d.desc[lang], requirements: d.requirements?.[lang], forkOf: forkInfo(d, s),
    href: localePath(lang, `port/${e.id}`), external: false,
    railColor: cm?.color ?? catColor, boxLabel: cm?.tag ?? "PRT", typeLabel: t(lang, "type.port"), typeColor: TYPE_COLOR.port,
    kindLabel: t(lang, `category.${d.category}`), statusKey: d.status,
    status: { label: t(lang, `status.${d.status}`), color: sm.color },
    consoleKeys: d.console ? [d.console] : [], repo: d.repo, stars: s.stars, pushedAt: s.pushedAt, version: s.version,
    ...metric(d, lang),
    tags: [...(d.engine ? [d.engine] : []), ...d.tags], featured: d.featured, ours: false, abandoned: d.abandoned, takedown: d.takedown,
    search: [d.name, d.repo, d.author, d.engine, cm?.label, t(lang, `category.${d.category}`), ...d.tags, d.desc[lang]].filter(Boolean).join(" ").toLowerCase(),
  };
}

export function decompItem(e: CollectionEntry<"decomps">, lang: Lang): Item {
  const d = e.data;
  const cm = consoleMeta(d.console);
  const s = liveStat(d);
  return {
    type: "decomp", id: e.id, name: d.name, desc: d.desc[lang], forkOf: forkInfo(d, s),
    href: localePath(lang, `decomp/${e.id}`), external: false,
    railColor: cm.color, boxLabel: cm.tag, typeLabel: t(lang, "type.decomp"), typeColor: TYPE_COLOR.decomp,
    kindLabel: cm.label, statusKey: "", status: null,
    consoleKeys: [d.console], repo: d.repo, stars: s.stars, pushedAt: s.pushedAt, version: s.version,
    ...metric(d, lang),
    tags: d.tags, featured: d.featured, ours: false, abandoned: d.abandoned, takedown: d.takedown,
    search: [d.name, d.repo, cm.label, cm.full, ...d.tags, d.desc[lang]].filter(Boolean).join(" ").toLowerCase(),
  };
}

/** Orden estándar: destacados / nuestros primero, luego estrellas, luego nombre. */
export function sortItems(items: Item[]): Item[] {
  return [...items].sort((a, b) => {
    const af = (a.ours ? 2 : 0) + (a.featured ? 1 : 0);
    const bf = (b.ours ? 2 : 0) + (b.featured ? 1 : 0);
    if (af !== bf) return bf - af;
    return (b.stars ?? -1) - (a.stars ?? -1) || a.name.localeCompare(b.name);
  });
}

export async function getRecompItems(lang: Lang) {
  return (await getCollection("recomps")).map((e) => recompItem(e, lang));
}
export async function getToolItems(lang: Lang) {
  return (await getCollection("tools")).map((e) => toolItem(e, lang));
}
export async function getPortItems(lang: Lang) {
  return (await getCollection("ports")).map((e) => portItem(e, lang));
}
export async function getDecompItems(lang: Lang) {
  return (await getCollection("decomps")).map((e) => decompItem(e, lang));
}
export async function getAllItems(lang: Lang): Promise<Item[]> {
  const [r, t, p, dc] = await Promise.all([getRecompItems(lang), getToolItems(lang), getPortItems(lang), getDecompItems(lang)]);
  return [...r, ...t, ...p, ...dc];
}

/** Recomps relacionados con una herramienta (para su página de detalle). */
export async function toolRelated(entry: CollectionEntry<"tools">, lang: Lang): Promise<{ items: Item[]; titleKey: "detail.relatedTool" | "detail.relatedLaunch" | "detail.relatedPlatform" }> {
  const recomps = await getCollection("recomps");
  const d = entry.data;
  let matched: CollectionEntry<"recomps">[];
  let titleKey: "detail.relatedTool" | "detail.relatedLaunch" | "detail.relatedPlatform";
  if (d.kind === "launcher") {
    matched = recomps.filter((r) => d.consoles.includes(r.data.console));
    titleKey = "detail.relatedLaunch";
  } else {
    const byTool = recomps.filter((r) => r.data.toolchain === d.name);
    if (byTool.length) { matched = byTool; titleKey = "detail.relatedTool"; }
    else { matched = recomps.filter((r) => d.consoles.includes(r.data.console)); titleKey = "detail.relatedPlatform"; }
  }
  return { items: sortItems(matched.map((e) => recompItem(e, lang))), titleKey };
}
