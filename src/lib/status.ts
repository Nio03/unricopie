// Estados de avance de un recomp (juego) y tipos de herramienta. Aquí solo van
// los colores: los textos, en los dos idiomas, viven en src/i18n/ui.ts.

export const STATUS = {
  experimental: { color: '#e0a73a' },
  playable: { color: '#5fcf6b' },
  fully: { color: '#3fb950' },
} as const;

export type StatusKey = keyof typeof STATUS;
export const STATUS_KEYS = Object.keys(STATUS) as StatusKey[];

export function statusMeta(key: string) {
  return (STATUS as Record<string, (typeof STATUS)[StatusKey]>)[key] ?? STATUS.experimental;
}

// Eje de mantenimiento, independiente del avance. Se marca a mano (no automático):
// un proyecto "terminado" NO es lo mismo que uno "abandonado".
export const ABANDONED_COLOR = '#8b93a7';

// Retirado por reclamación de copyright/DMCA. Solo enlazamos, no alojamos: la
// ficha se conserva como registro y se le quita el enlace al repositorio.
export const TAKEDOWN_COLOR = '#e05656';

// "Parado": derivado del reloj, no editorial. Más apagado que el ámbar de
// `experimental` para que no compita con el estado, y lejos del gris de
// `abandoned`, que es una afirmación mucho más fuerte.
export const STALLED_COLOR = '#b8863f';

// Tipos de herramienta para la sección "Launchers y herramientas".
export const TOOL_KIND = {
  recompiler: { color: '#9b87e0' },
  launcher: { color: '#3fb0a8' },
  patcher: { color: '#cd7dd6' },
  library: { color: '#9aa0bd' },
} as const;

export type ToolKind = keyof typeof TOOL_KIND;
export const TOOL_KINDS = Object.keys(TOOL_KIND) as ToolKind[];

export function toolKindMeta(key: string) {
  return (TOOL_KIND as Record<string, (typeof TOOL_KIND)[ToolKind]>)[key] ?? TOOL_KIND.library;
}

// Tipos de mod para la sección "Mods" (los textos, en i18n/ui.ts).
export const MOD_KIND = {
  mod: { color: '#e0a73a' },
  editor: { color: '#d4799b' },
  manager: { color: '#7aa2f0' },
} as const;

export function modKindMeta(key: string) {
  return (MOD_KIND as Record<string, (typeof MOD_KIND)[keyof typeof MOD_KIND]>)[key] ?? MOD_KIND.mod;
}

// Estado de madurez de una herramienta.
export const TOOL_STATUS = {
  experimental: { color: '#e0a73a' },
  beta: { color: '#7aa2f0' },
  usable: { color: '#4fa8d8' },
  stable: { color: '#3fb950' },
} as const;

export type ToolStatusKey = keyof typeof TOOL_STATUS;
export const TOOL_STATUS_KEYS = Object.keys(TOOL_STATUS) as ToolStatusKey[];

export function toolStatusMeta(key?: string) {
  if (!key) return null;
  return (TOOL_STATUS as Record<string, (typeof TOOL_STATUS)[ToolStatusKey]>)[key] ?? null;
}

// ── "Parado": proyecto que se quedó quieto ANTES de llegar ──
//
// Propuesto en el issue #5 y señalado por separado en r/recomps ("Experimental
// is all over the map, from completely unplayable to essentially finished").
//
// El reloj por sí solo no sirve: con 90 días marcaría 60 de 309 fichas, y entre
// ellas N64Recomp (quieto porque ya hace su trabajo) y CannonBall (quieto desde
// 2023 porque el motor de OutRun está TERMINADO). Un aviso que señala a los
// mejores junto a los abandonados se aprende a ignorar.
//
// Así que se cruzan dos cosas: quieto Y sin terminar. Lo segundo se detecta
// distinto según la sección, porque los decomps no tienen campo `status` —
// son 126 fichas, la sección más grande, y su señal real es el porcentaje.
export const STALLED_DAYS = 180;

// Un recomp o port que está en estos estados todavía no ha llegado.
export const UNFINISHED_STATUS: readonly string[] = ['experimental', 'playable'];
// Para herramientas, `stable` es el único que cuenta como llegado.
export const UNFINISHED_TOOL_STATUS: readonly string[] = ['experimental', 'beta', 'usable'];

/**
 * ¿La ficha merece el aviso de "parado"? Devuelve los días quietos, o null.
 *
 * `abandoned` manda por encima de esto: si ya sabemos que está muerto (repo
 * archivado, o el autor lo dijo), la ficha lo dice sin necesidad de heurística.
 */
export function stalledDays(opts: {
  type: 'recomp' | 'port' | 'tool' | 'decomp' | 'mod';
  status?: string;
  pushedAt?: string;
  decompPercent?: number;
  abandoned?: boolean;
}): number | null {
  if (opts.abandoned || !opts.pushedAt) return null;

  const dias = Math.floor((Date.now() - Date.parse(opts.pushedAt)) / 86_400_000);
  if (!Number.isFinite(dias) || dias < STALLED_DAYS) return null;

  if (opts.type === 'decomp') {
    // Sin porcentaje no sabemos si llegó, así que no se marca.
    return opts.decompPercent != null && opts.decompPercent < 100 ? dias : null;
  }
  // Los mods usan la misma escala de madurez que las herramientas.
  const lista = opts.type === 'tool' || opts.type === 'mod' ? UNFINISHED_TOOL_STATUS : UNFINISHED_STATUS;
  return opts.status && lista.includes(opts.status) ? dias : null;
}
