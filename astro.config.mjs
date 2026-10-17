// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { parse } from 'yaml';

// Recompendium se publica como sitio estático en GitHub Pages con dominio propio:
// https://recompendium.com/  → site = el dominio, base = '/'. Hasta octubre de
// 2026 vivía en https://nio03.github.io/unricopie/ (base /unricopie); GitHub
// redirige esas direcciones al dominio.
//
// Ver README.md → "Deployment" para el detalle.

// lastmod del sitemap: cada ficha lleva la fecha del último push de su repo (lo
// que trae el bot a stats.json) y cada entrada del blog, su fecha. Así el
// buscador sabe qué páginas cambiaron sin tener que recorrer todas.
function lastmodMap() {
  const map = new Map();
  /** @type {Record<string, any>} */
  let stats = {};
  try { stats = JSON.parse(readFileSync('src/data/stats.json', 'utf8')); } catch {}
  const segs = { recomps: 'recomp', ports: 'port', decomps: 'decomp', tools: 'tool', mods: 'mod' };
  for (const [dir, seg] of Object.entries(segs)) {
    const path = `src/data/${dir}`;
    if (!existsSync(path)) continue;
    for (const f of readdirSync(path).filter((x) => x.endsWith('.yaml'))) {
      const doc = parse(readFileSync(`${path}/${f}`, 'utf8')) || {};
      const at = typeof doc.repo === 'string' ? stats[doc.repo]?.pushedAt : undefined;
      if (!at) continue;
      for (const lang of ['es', 'en']) map.set(`/${lang}/${seg}/${f.replace(/\.yaml$/, '')}/`, at);
    }
  }
  for (const lang of ['es', 'en']) {
    const path = `src/content/blog/${lang}`;
    if (!existsSync(path)) continue;
    for (const f of readdirSync(path).filter((x) => x.endsWith('.md'))) {
      const date = (readFileSync(`${path}/${f}`, 'utf8').match(/^date:\s*(\S+)/m) || [])[1];
      if (date) map.set(`/${lang}/blog/${f.replace(/\.md$/, '')}/`, new Date(date).toISOString());
    }
  }
  return map;
}
const LASTMOD = lastmodMap();

export default defineConfig({
  site: 'https://recompendium.com',
  base: '/',
  trailingSlash: 'ignore',
  // Sitemap para buscadores: genera /sitemap-index.xml con todas las páginas.
  // Las páginas antiguas del español en la raíz (src/pages/[...legacy].astro) son
  // solo redirecciones: fuera del sitemap.
  integrations: [
    sitemap({
      filter: (page) => /^\/((es|en)\/.*)?$/.test(new URL(page).pathname),
      serialize(item) {
        const at = LASTMOD.get(new URL(item.url).pathname);
        if (at) item.lastmod = at;
        return item;
      },
    }),
  ],
  // Bilingüe: español bajo /es/ e inglés bajo /en/. La raíz no pertenece a
  // ningún idioma: src/pages/index.astro elige uno según el navegador.
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  build: {
    format: 'directory',
  },
});
