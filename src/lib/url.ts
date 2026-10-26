// Construye URLs respetando `base` de astro.config.mjs (para GitHub Pages
// publicado bajo /unricopie u otra subruta). Usa siempre href() en los enlaces
// internos en vez de rutas absolutas escritas a mano.
export function href(path = ''): string {
  const base = import.meta.env.BASE_URL || '/';
  const clean = path.replace(/^\//, '');
  if (!clean) return base;
  return withSlash(base.endsWith('/') ? base + clean : base + '/' + clean);
}

// Las páginas se publican como carpetas (/es/ports/), y GitHub Pages redirige
// con un 301 la versión sin barra. Google contaba cada enlace sin barra como
// «página con redirección», así que las rutas de página llevan la barra final.
// Los archivos (rss.xml, search.json, iconos) se dejan como están, y también
// lo que va detrás de ? o #.
export function withSlash(url: string): string {
  const cut = url.search(/[?#]/);
  const path = cut === -1 ? url : url.slice(0, cut);
  const rest = cut === -1 ? '' : url.slice(cut);
  if (!path || path.endsWith('/')) return url;
  if (path.slice(path.lastIndexOf('/') + 1).includes('.')) return url;
  return path + '/' + rest;
}
