# Recompendium

**Catálogo multi-consola, en vivo y filtrable de recompilaciones estáticas de juegos de consola a ejecutables nativos de PC.**

Desde *Unleashed Recompiled* la escena de recomps explotó: N64, Xbox 360, GameCube, Wii, PS2… pero no había un catálogo único, multi-consola y actualizado. Read Only Memo es editorial/mensual, PCGamingWiki es wiki manual, Codex Gamicus es solo GameCube. Recompendium llena ese hueco: datos curados a mano, **verificados**, y enriquecidos a diario desde GitHub.

🔗 **Sitio** (al publicar): https://nio03.github.io/unricopie/

Este repo (`unricopie`) es **Recompendium**: el sitio del catálogo (Astro, estático).

> El repo se llama `unricopie` por la URL de GitHub Pages, no por el launcher. En [`unricopie-launcher/`](./unricopie-launcher) queda el scaffold Tauri de un launcher multi-consola que empezamos y **está parado**: no se desarrolla ni se anuncia como producto. El código se conserva por si se retoma.

> ⚖️ Recompendium no aloja ni enlaza ROMs ni assets con copyright. Cada recomp es **solo código**: necesitas tu propia copia legal del juego. Ver [Términos](./src/pages/terms.astro) y [Privacidad](./src/pages/privacy.astro).

---

## Qué cuenta como recomp

En el **Catálogo** entran solo **recompilaciones estáticas** (traducir el binario original a C/C++ y compilarlo nativo): N64Recomp, XenonRecomp, ReXGlue, PS2Recomp y los juegos que producen.

Las **decompilaciones** a código fuente y los **remakes** de fans tienen su propia sección, **Ports y remakes** (P-06 / Sonic '06, Ship of Harkinian, OpenGOAL, etc.): traen el mismo juego a PC, pero no son recompilaciones estáticas.

El sitio es **bilingüe (ES/EN)** con rutas por idioma (`/` y `/en/`); las descripciones de cada proyecto van en ambos idiomas.

## Stack

- **[Astro](https://astro.build)** — sitio estático, cero JS por defecto, islas de JS vanilla solo para los filtros.
- **Content Collections + Zod** — el esquema (`src/content.config.ts`) valida cada aporte automáticamente.
- **GitHub Actions** — un cron diario refresca los datos en vivo; otro publica en GitHub Pages.
- **Diseño** estilo *tracker* (RetroAchievements): tema oscuro, catálogo en filas densas con mini-portada por consola, badges de estado y estrellas.

## Modelo de datos (importante)

Hay una separación deliberada entre lo **curado** y lo **en vivo**:

- **Curado** → los YAML en `src/data/{recomps,tools,ports}/`: nombre, `desc` bilingüe `{es,en}`, estado, consola, `toolchain`, `featured`, `tags`, `links`. El `author` solo se pone si aporta un nombre real distinto del dueño del repo (si no, se deriva de `repo`).
- **En vivo** → `src/data/stats.json`, refrescado por el bot desde la API de GitHub: estrellas, último push, fecha de creación, **última release (versión)**, **licencia**, lenguaje y homepage. **No edites este archivo a mano.**

El sitio fusiona ambos en build → nunca consulta GitHub desde el navegador.

## Estructura

```
unricopie/
├── src/
│   ├── data/
│   │   ├── recomps/        # un YAML por juego (recompilación estática)  ← el catálogo
│   │   ├── tools/          # recompiladores, launchers, librerías
│   │   ├── ports/          # ports decomp y remakes de fans (P-06, Ship of Harkinian…)
│   │   └── stats.json      # datos en vivo (lo refresca el bot; no editar a mano)
│   ├── content.config.ts   # esquema Zod (desc bilingüe {es,en} + homepage/licencia)
│   ├── i18n/               # capa de idioma: diccionario es/en + helpers (t, localePath)
│   ├── lib/                # catalog, consoles, status, stats, url, site
│   ├── components/
│   │   ├── Card.astro      # tarjeta/fila única (un Item con type → render adecuado)
│   │   └── pages/          # cuerpos de página (CatalogView, HomePage, ItemDetailPage,
│   │                       #   LaunchersPage, PortsPage, ContributePage)
│   ├── layouts/Base.astro
│   ├── styles/global.css   # sistema visual (paleta + tipografías + componentes)
│   └── pages/              # rutas ES (/) y EN (/en/): catálogo, launchers, ports,
│                           #   contribuir, acerca, terms, privacy, detalle
├── public/                 # favicon.svg, og.svg
├── scripts/
│   ├── refresh-stats.mjs   # GitHub API → src/data/stats.json (datos en vivo)
│   ├── normalize-data.mjs  # normaliza/limpia los YAML a formato canónico
│   └── validate-data.mjs   # chequeo rápido de los YAML (para PRs)
├── .github/workflows/      # deploy.yml · refresh-stats.yml · validate.yml
└── unricopie-launcher/     # scaffold Tauri de un launcher — PARADO, no se desarrolla
```

## Desarrollo

```bash
npm install
npm run dev            # http://localhost:4321/unricopie/
npm run build          # genera dist/ (valida el esquema de datos de paso)
npm run preview        # sirve dist/
npm run validate-data  # chequeo rápido de los YAML
npm run refresh-stats  # refresca stats.json desde GitHub
```

**Token (solo para `refresh-stats` en local):** crea un `.env.local` (gitignored) con `GITHUB_TOKEN=...`. Sin token, GitHub limita a 60 req/hora; con token, 5000. **En CI no hace falta:** el workflow usa el `GITHUB_TOKEN` automático del runner.

## Despliegue (GitHub Pages)

El sitio se publica como *project page* en `https://nio03.github.io/unricopie/` (de ahí `base: '/unricopie'` en [`astro.config.mjs`](./astro.config.mjs)). Para encenderlo:

1. **Settings → Pages → Source: GitHub Actions.**
2. **Settings → Actions → General → Workflow permissions → "Read and write"** (para que el bot de stats pueda commitear `stats.json`).
3. Listo: los workflows hacen el resto.
   - `refresh-stats.yml` — cron diario: actualiza `stats.json` y lo commitea.
   - `deploy.yml` — publica en cada push a `main` y cuando termina el refresh de stats.
   - `validate.yml` — valida YAML + build en cada PR/push.

Si usas dominio propio o publicas en la raíz, cambia `site` y pon `base: '/'`.

## Contribuir

¿Conoces un recomp que falta o tienes una corrección? Es un YAML y un Pull Request — ver **[CONTRIBUTING.md](./CONTRIBUTING.md)**. No hace falta poner estrellas, versiones ni fechas: el bot las rellena desde el repo.

## Licencia y legal

Código bajo [MIT](./LICENSE). Los datos del catálogo son hechos públicos sobre proyectos de terceros; cada proyecto enlazado conserva su propia licencia. Ver **Términos de uso** y **Política de privacidad** (enlaces en el pie del sitio).
