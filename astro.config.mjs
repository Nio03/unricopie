// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Recompendium se publica como sitio estático en GitHub Pages como "project
// page": https://nio03.github.io/unricopie/  → site = el dominio, base = /unricopie.
//
// Si algún día usas dominio propio o lo publicas en la raíz
// (https://nio03.github.io/), cambia site a tu dominio y base a '/'.
//
// Ver README.md → "Despliegue" para el detalle.
export default defineConfig({
  site: 'https://nio03.github.io',
  base: '/unricopie',
  trailingSlash: 'ignore',
  // Sitemap para buscadores: genera /unricopie/sitemap-index.xml con todas las páginas.
  // Las páginas antiguas del español en la raíz (src/pages/[...legacy].astro) son
  // solo redirecciones: fuera del sitemap.
  integrations: [sitemap({ filter: (page) => /\/unricopie\/((es|en)\/.*)?$/.test(page) })],
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
