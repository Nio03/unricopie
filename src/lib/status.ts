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

export function toolStatusMeta(key?: string) {
  if (!key) return null;
  return (TOOL_STATUS as Record<string, (typeof TOOL_STATUS)[ToolStatusKey]>)[key] ?? null;
}
