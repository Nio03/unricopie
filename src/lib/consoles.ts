// Catálogo de consolas soportadas.
// Para añadir una consola nueva: agrega una entrada aquí (key + label + full + color).
// El esquema de datos (src/content.config.ts) y los filtros la toman automáticamente.

// Colores de consola vivos (estilo "boxart"), legibles sobre el tema oscuro.
// `tag` es el código corto para la mini-portada del catálogo.
export const CONSOLES = {
  n64: { label: 'N64', tag: 'N64', full: 'Nintendo 64', arch: 'MIPS', color: '#C9252B' },
  gamecube: { label: 'GameCube', tag: 'GC', full: 'Nintendo GameCube', arch: 'PowerPC', color: '#6A5FA5' },
  wii: { label: 'Wii', tag: 'WII', full: 'Nintendo Wii', arch: 'PowerPC', color: '#4FA8D8' },
  ps2: { label: 'PS2', tag: 'PS2', full: 'PlayStation 2', arch: 'Emotion Engine', color: '#2E5CB8' },
  ps1: { label: 'PS1', tag: 'PS1', full: 'PlayStation', arch: 'MIPS', color: '#8A90A6' },
  psp: { label: 'PSP', tag: 'PSP', full: 'PlayStation Portable', arch: 'MIPS', color: '#E0A93A' },
  x360: { label: 'Xbox 360', tag: '360', full: 'Xbox 360', arch: 'PowerPC', color: '#107C10' },
  wiiu: { label: 'Wii U', tag: 'WIIU', full: 'Nintendo Wii U', arch: 'PowerPC', color: '#00A3C4' },
  dreamcast: { label: 'Dreamcast', tag: 'DC', full: 'Sega Dreamcast', arch: 'SH-4', color: '#E07A3A' },
  gba: { label: 'GBA', tag: 'GBA', full: 'Game Boy Advance', arch: 'ARM7', color: '#5B3A9C' },
  nds: { label: 'DS', tag: 'DS', full: 'Nintendo DS', arch: 'ARM9', color: '#A33B86' },
  switch: { label: 'Switch', tag: 'NSW', full: 'Nintendo Switch', arch: 'ARM64', color: '#E0392B' },
  xbox: { label: 'Xbox', tag: 'XBX', full: 'Xbox', arch: 'x86', color: '#0E7A0E' },
  pc: { label: 'PC', tag: 'PC', full: 'PC', arch: 'x86', color: '#6C7193' },
  other: { label: 'Other', tag: 'ETC', full: 'Other platform', arch: '—', color: '#9AA0B5' },
} as const;

export type ConsoleKey = keyof typeof CONSOLES;
export const CONSOLE_KEYS = Object.keys(CONSOLES) as ConsoleKey[];

export function consoleMeta(key: string) {
  return (CONSOLES as Record<string, (typeof CONSOLES)[ConsoleKey]>)[key] ?? CONSOLES.other;
}
