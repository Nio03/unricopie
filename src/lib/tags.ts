import type { Lang } from "../i18n";

// Las etiquetas (tags) de los YAML son claves en inglés, en minúsculas y con
// guiones. Aquí solo se traducen las descriptivas; las técnicas y los nombres
// propios (mips, powerpc, vulkan, zelda, sdk, frontend…) se muestran igual en
// los dos idiomas. Una etiqueta nueva que no esté aquí sale tal cual.
const LABELS: Record<string, Partial<Record<Lang, string>>> = {
  "matching": { es: "decompilación exacta" },
  "human-driven": { es: "sin IA" },
  // Solo cuando el propio proyecto declara que se hizo con agentes o modelos de IA.
  "ai-assisted": { es: "con ayuda de IA" },
  "widescreen": { es: "modo panorámico" },
  "decomp": { es: "decompilación" },
  "downloader": { es: "descargas" },
  "auto-update": { es: "actualización automática" },
  "clean-room": { es: "sala limpia" },
  "racing": { es: "carreras" },
  "shmup": { es: "matamarcianos" },
  "multiplayer": { es: "multijugador" },
  "ray-tracing": { es: "trazado de rayos" },
  "static-recomp": { es: "recompilación estática" },
  "reverse-engineering": { es: "ingeniería inversa" },
  "netplay": { es: "juego en red" },
  "fps": { es: "disparos en primera persona", en: "first-person shooter" },
  "horror": { es: "terror" },
  "hd-assets": { es: "alta definición" },
  "track-editor": { es: "editor de circuitos" },
  "toys-to-life": { es: "figuras físicas" },
  "custom-toolchain": { es: "cadena de herramientas propia" },
  "compat-layer": { es: "capa de compatibilidad" },
  "runtime": { es: "entorno de ejecución" },
  "online": { es: "en línea" },
  "ui": { es: "interfaz" },
  "renderer": { es: "renderizador" },
  "pokemon": { es: "pokémon", en: "pokémon" },
};

export function tagLabel(tag: string, lang: Lang): string {
  return LABELS[tag]?.[lang] ?? tag;
}

// Para el buscador: la clave y, si la hay, su traducción, así "carreras"
// encuentra lo etiquetado como racing.
export function tagSearch(tags: string[], lang: Lang): string[] {
  return tags.flatMap((t) => { const l = tagLabel(t, lang); return l === t ? [t] : [t, l]; });
}
