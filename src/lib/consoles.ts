// Catálogo de consolas soportadas.
// Para añadir una consola nueva: agrega una entrada aquí (key + label + full + color).
// El esquema de datos (src/content.config.ts) y los filtros la toman automáticamente.

// Colores de consola vivos (estilo "boxart"), legibles sobre el tema oscuro.
// `tag` es el código corto para la mini-portada del catálogo.
export const CONSOLES = {
  // Una consola con dos nombres según la región lleva los dos, también en la
  // etiqueta: así se encuentra por cualquiera de ellos en los filtros y el buscador.
  nes: { label: 'NES / Famicom', tag: 'NES', full: 'Nintendo Entertainment System / Famicom', arch: '6502', color: '#9E5A4F' },
  snes: { label: 'SNES / Super Famicom', tag: 'SNES', full: 'Super Nintendo / Super Famicom', arch: '65816', color: '#9B7BD4' },
  n64: { label: 'N64', tag: 'N64', full: 'Nintendo 64', arch: 'MIPS', color: '#C9252B' },
  gamecube: { label: 'GameCube', tag: 'GC', full: 'Nintendo GameCube', arch: 'PowerPC', color: '#6A5FA5' },
  wii: { label: 'Wii', tag: 'WII', full: 'Nintendo Wii', arch: 'PowerPC', color: '#4FA8D8' },
  ps5: { label: 'PS5', tag: 'PS5', full: 'PlayStation 5', arch: 'x86-64', color: '#7FB6E8' },
  ps4: { label: 'PS4', tag: 'PS4', full: 'PlayStation 4', arch: 'x86-64', color: '#4A86C9' },
  ps3: { label: 'PS3', tag: 'PS3', full: 'PlayStation 3', arch: 'Cell/PPE', color: '#26418F' },
  ps2: { label: 'PS2', tag: 'PS2', full: 'PlayStation 2', arch: 'Emotion Engine', color: '#2E5CB8' },
  ps1: { label: 'PS1', tag: 'PS1', full: 'PlayStation', arch: 'MIPS', color: '#8A90A6' },
  psp: { label: 'PSP', tag: 'PSP', full: 'PlayStation Portable', arch: 'MIPS', color: '#E0A93A' },
  x360: { label: 'Xbox 360', tag: '360', full: 'Xbox 360', arch: 'PowerPC', color: '#107C10' },
  wiiu: { label: 'Wii U', tag: 'WIIU', full: 'Nintendo Wii U', arch: 'PowerPC', color: '#00A3C4' },
  // NAOMI es la placa de recreativa hermana de la Dreamcast (mismo SH-4), así que
  // comparten clave: la ficha del juego aclara en cuál de las dos salió.
  dreamcast: { label: 'Dreamcast', tag: 'DC', full: 'Sega Dreamcast / NAOMI', arch: 'SH-4', color: '#E07A3A' },
  saturn: { label: 'Saturn', tag: 'SAT', full: 'Sega Saturn', arch: 'SH-2 x2', color: '#2C7D8C' },
  megadrive: { label: 'Mega Drive / Genesis', tag: 'MD', full: 'Sega Mega Drive / Genesis', arch: '68000', color: '#E64980' },
  // Unidad de CD de la Mega Drive, con su propio 68000: Mega-CD en Europa y Japón, Sega CD en América.
  megacd: { label: 'Mega-CD / Sega CD', tag: 'MCD', full: 'Sega Mega-CD / Sega CD', arch: '68000 x2', color: '#BE185D' },
  // Accesorio de la Mega Drive con dos SH-2: Sega 32X en América y Europa, Super 32X en Japón.
  '32x': { label: '32X / Super 32X', tag: '32X', full: 'Sega 32X / Super 32X', arch: '68000 + SH-2 x2', color: '#C2410C' },
  gb: { label: 'Game Boy', tag: 'GB', full: 'Game Boy', arch: 'Sharp SM83', color: '#8A9A3B' },
  gbc: { label: 'GBC', tag: 'GBC', full: 'Game Boy Color', arch: 'Sharp SM83', color: '#2E9E78' },
  gba: { label: 'GBA', tag: 'GBA', full: 'Game Boy Advance', arch: 'ARM7', color: '#5B3A9C' },
  nds: { label: 'DS', tag: 'DS', full: 'Nintendo DS', arch: 'ARM9', color: '#A33B86' },
  '3ds': { label: '3DS', tag: '3DS', full: 'Nintendo 3DS', arch: 'ARM11', color: '#B03A5B' },
  switch: { label: 'Switch', tag: 'NSW', full: 'Nintendo Switch', arch: 'ARM64', color: '#E0392B' },
  xbox: { label: 'Xbox', tag: 'XBX', full: 'Xbox', arch: 'x86', color: '#0E7A0E' },
  xboxone: { label: 'Xbox One', tag: 'XB1', full: 'Xbox One', arch: 'x86-64', color: '#52B043' },
  // Placas de recreativa sin consola hermana (CPS-3, Sega OutRun…). NAOMI NO va
  // aquí: comparte silicio con la Dreamcast y se queda en esa clave.
  arcade: { label: 'Arcade', tag: 'ARC', full: 'Arcade board', arch: '—', color: '#B8873B' },
  // Juegos de MS-DOS: van aparte de «pc» para que tengan su propia página.
  dos: { label: 'DOS', tag: 'DOS', full: 'MS-DOS', arch: 'x86', color: '#5C7CFA' },
  // Juegos de Windows (la clave sigue siendo «pc» para no cambiar datos ni URLs).
  pc: { label: 'Windows', tag: 'WIN', full: 'Microsoft Windows', arch: 'x86', color: '#6C7193' },
  // Ordenadores japoneses de NEC (Touhou de la era PC-98).
  pc98: { label: 'PC-98', tag: '98', full: 'NEC PC-9801 / PC-98', arch: 'x86', color: '#4F7A8C' },
  // Mac OS anterior a OS X (Marathon y otros juegos de Mac de los 90).
  mac: { label: 'Classic Mac OS', tag: 'MAC', full: 'Classic Mac OS', arch: '68k / PowerPC', color: '#7D8A99' },
  // Juegos de móviles (iOS y Android) llevados a PC.
  mobile: { label: 'iOS / Android', tag: 'MOB', full: 'iOS / Android', arch: 'ARM', color: '#3D9970' },
  other: { label: 'Other', tag: 'ETC', full: 'Other platform', arch: '—', color: '#9AA0B5' },
} as const;

export type ConsoleKey = keyof typeof CONSOLES;
export const CONSOLE_KEYS = Object.keys(CONSOLES) as ConsoleKey[];

// Casi todos los nombres son propios y valen en los dos idiomas; solo las claves
// genéricas se traducen. Sin idioma, se devuelve el nombre en inglés.
const ES_NAMES: Partial<Record<ConsoleKey, { label?: string; full?: string }>> = {
  arcade: { full: 'Placa de recreativa' },
  other: { label: 'Otra', full: 'Otra plataforma' },
  mac: { label: 'Mac OS clásico', full: 'Mac OS clásico' },
};

export function consoleMeta(key: string, lang?: 'es' | 'en') {
  const base = (CONSOLES as Record<string, (typeof CONSOLES)[ConsoleKey]>)[key] ?? CONSOLES.other;
  const es = lang === 'es' ? ES_NAMES[key as ConsoleKey] : undefined;
  return es ? { ...base, ...es } : base;
}
