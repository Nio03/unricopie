// Construye URLs respetando `base` de astro.config.mjs (para GitHub Pages
// publicado bajo /unricopie u otra subruta). Usa siempre href() en los enlaces
// internos en vez de rutas absolutas escritas a mano.
export function href(path = ''): string {
  const base = import.meta.env.BASE_URL || '/';
  const clean = path.replace(/^\//, '');
  if (!clean) return base;
  return base.endsWith('/') ? base + clean : base + '/' + clean;
}
