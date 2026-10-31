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
  // El proyecto no publica su código: solo reparte el programa compilado.
  "closed-source": { es: "código cerrado", en: "closed source" },
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
  // El catálogo es de juegos en PC; estas marcan que el proyecto publica además
  // versiones para otras plataformas (según los archivos de sus releases).
  "build-android": { es: "versión para Android", en: "Android build" },
  "build-ios": { es: "versión para iOS", en: "iOS build" },
  "build-switch": { es: "versión para Switch", en: "Switch build" },
  "build-3ds": { es: "versión para 3DS", en: "3DS build" },
  "build-vita": { es: "versión para PS Vita", en: "PS Vita build" },
  "build-web": { es: "versión para navegador", en: "browser build" },
};

export function tagLabel(tag: string, lang: Lang): string {
  return LABELS[tag]?.[lang] ?? tag;
}

// Para el buscador: la clave y, si la hay, su traducción, así "carreras"
// encuentra lo etiquetado como racing.
export function tagSearch(tags: string[], lang: Lang): string[] {
  return tags.flatMap((t) => { const l = tagLabel(t, lang); return l === t ? [t] : [t, l]; });
}
