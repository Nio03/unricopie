// Estados de avance de un recomp (juego) y tipos de herramienta.

export const STATUS = {
  experimental: { label: 'Experimental', color: '#e0a73a', desc: 'Arranca o en etapa temprana; todavía no jugable de inicio a fin.' },
  playable: { label: 'Jugable', color: '#5fcf6b', desc: 'Se juega y avanza, pero nunca es la experiencia completa.' },
  fully: { label: 'Totalmente jugable', color: '#3fb950', desc: 'Terminado o muy avanzado: jugable de principio a fin.' },
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
  recompiler: { label: 'Recompilador', color: '#9b87e0', desc: 'Convierte el binario de la consola a código nativo.' },
  launcher: { label: 'Launcher', color: '#3fb0a8', desc: 'Descarga, organiza y lanza recomps.' },
  patcher: { label: 'Patcher', color: '#cd7dd6', desc: 'Aplica los assets de tu copia sobre el recomp.' },
  library: { label: 'Librería', color: '#9aa0bd', desc: 'Componente de soporte (gráficos, audio, runtime).' },
} as const;

export type ToolKind = keyof typeof TOOL_KIND;
export const TOOL_KINDS = Object.keys(TOOL_KIND) as ToolKind[];

export function toolKindMeta(key: string) {
  return (TOOL_KIND as Record<string, (typeof TOOL_KIND)[ToolKind]>)[key] ?? TOOL_KIND.library;
}

// Estado de madurez de una herramienta.
export const TOOL_STATUS = {
  experimental: { label: 'Experimental', color: '#e0a73a' },
  beta: { label: 'Beta', color: '#7aa2f0' },
  usable: { label: 'Usable', color: '#4fa8d8' },
  stable: { label: 'Estable', color: '#3fb950' },
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
  type: 'recomp' | 'port' | 'tool' | 'decomp';
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
  const lista = opts.type === 'tool' ? UNFINISHED_TOOL_STATUS : UNFINISHED_STATUS;
  return opts.status && lista.includes(opts.status) ? dias : null;
}
