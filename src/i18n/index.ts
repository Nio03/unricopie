import { ui, defaultLang, type Lang, type UIKey } from "./ui";

export { languages, locales, defaultLang } from "./ui";
export type { Lang, UIKey } from "./ui";

/** Traduce una clave al idioma dado, con interpolación de {placeholders}. */
export function t(lang: Lang, key: UIKey, params?: Record<string, string | number>): string {
  const dict = ui[lang] as Record<string, string>;
  const fallback = ui[defaultLang] as Record<string, string>;
  let s = dict[key] ?? fallback[key] ?? String(key);
  if (params) for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}

/** Helper ligado a un idioma: const tr = useT(lang); tr("nav.catalog"). */
export function useT(lang: Lang) {
  return (key: UIKey, params?: Record<string, string | number>) => t(lang, key, params);
}

/**
 * Ruta interna respetando `base` y el idioma.
 *   localePath('es', 'launchers')  -> /launchers
 *   localePath('en', 'launchers')  -> /en/launchers
 *   localePath('es')               -> /
 *   localePath('en')               -> /en/
 */
export function localePath(lang: Lang, path = ""): string {
  const base = import.meta.env.BASE_URL || "/";
  const clean = path.replace(/^\/+/, "");
  const prefix = lang === defaultLang ? "" : "en/";
  const joined = (base.endsWith("/") ? base : base + "/") + prefix + clean;
  const collapsed = joined.replace(/\/{2,}/g, "/");
  return collapsed || "/";
}

/** Devuelve la misma ruta lógica en el OTRO idioma (para el selector + hreflang).
 *  Robusto a que BASE_URL lleve o no barra final y a la presencia/ausencia del
 *  prefijo /en. (from se mantiene por compatibilidad de firma; no se usa.) */
export function swapLocalePath(currentPath: string, _from: Lang, to: Lang): string {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, ""); // "" o "/unricopie"
  let p = currentPath;
  if (base && (p === base || p.startsWith(base + "/"))) p = p.slice(base.length);
  if (!p.startsWith("/")) p = "/" + p;
  p = p.replace(/^\/en(?=\/|$)/, ""); // quita el prefijo de idioma → ruta neutra
  const rel = p.replace(/^\/+/, "").replace(/\/+$/, "");
  return localePath(to, rel);
}
