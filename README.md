# Recompendium

A live, filterable, multi-console catalogue of static recompilations of console games into native PC executables.

**Site:** https://nio03.github.io/unricopie/

Since *Unleashed Recompiled*, static recompilation has spread across N64, Xbox 360, GameCube, Wii and PS2, but the projects remained scattered. The existing references each cover part of the ground: Read Only Memo is editorial and monthly, PCGamingWiki is a manually maintained wiki, Codex Gamicus covers GameCube only. Recompendium aims at the gap: hand-curated entries, verified against the source repository, enriched daily from the GitHub API.

The repository is named `unricopie` because that name determines the GitHub Pages URL, not because of the launcher. [`unricopie-launcher/`](./unricopie-launcher) holds the Tauri scaffold of a multi-console launcher that reached Phase 0 and is **no longer under development**. The code is kept in case it is resumed; it is not shipped, advertised or listed in the catalogue.

Recompendium hosts no ROMs, assets or copyrighted material, and links to none. Every recompilation listed here is source code only: running any of them requires your own legal copy of the game. See [Terms](./src/pages/terms.astro) and [Privacy](./src/pages/privacy.astro).

## Scope

The distinction between the catalogue's four sections is the point of the project, so it is applied strictly.

| Section | What it holds |
|---|---|
| **Recomps** | Static recompilations: the original binary is translated to C/C++ and compiled natively. N64Recomp, XenonRecomp, ReXGlue, psxrecomp and the games they produce. |
| **Decomps** | Reverse-engineered source code of a game, whether or not a port exists yet. |
| **Ports and remakes** | Decompilation-based ports and from-scratch fan remakes: Ship of Harkinian, OpenGOAL, Sonic P-06. Same game on PC, but not a static recompilation. |
| **Tools** | Recompilers, launchers, patchers and supporting libraries. |

Emulators and FPGA cores are out of scope regardless of how closely a project sits to the scene. A project's name is not evidence of its category: entries are classified from the repository's own README, not from its title or from how it was announced.

The site is bilingual (Spanish and English) with per-language routes, `/` and `/en/`. Every project description is written in both languages.

## Stack

- **[Astro](https://astro.build)** — static output, no JavaScript by default; small vanilla islands drive the filters.
- **Content Collections + Zod** — the schema in `src/content.config.ts` validates every contribution at build time.
- **GitHub Actions** — scheduled jobs refresh the live data, discover new projects and publish the site.
- **Design** — tracker-style, in the vein of RetroAchievements: dark theme, dense catalogue rows with a per-console mini cover, status badges and star counts.

## Data model

Curated data and live data are deliberately kept apart.

**Curated** — the YAML files under `src/data/{recomps,decomps,ports,tools}/`: name, bilingual `desc` (`{es, en}`), status, console, `toolchain`, `featured`, `tags`, `links`. `author` is set only when it carries a real name distinct from the repository owner; otherwise it is derived from `repo`.

**Live** — `src/data/stats.json`, refreshed by the bot from the GitHub API: stars, last push, creation date, latest release, licence, language and homepage. **This file is never edited by hand.**

The two are merged at build time, so the published site never calls GitHub from the browser.

The catalogue is an append-only registry. Entries are not deleted; a project that dies is marked `abandoned`, and one removed on a copyright claim is marked `takedown` and keeps its record without a repository link.

## Layout

```
unricopie/
├── src/
│   ├── data/
│   │   ├── recomps/        # one YAML per game (static recompilation)
│   │   ├── decomps/        # reverse-engineered source projects
│   │   ├── ports/          # decomp-based ports and fan remakes
│   │   ├── tools/          # recompilers, launchers, patchers, libraries
│   │   └── stats.json      # live data, written by the bot; not edited by hand
│   ├── content.config.ts   # Zod schema for all four collections
│   ├── i18n/               # es/en dictionary and helpers (t, localePath)
│   ├── lib/                # catalog, consoles, status, stats, url, site
│   ├── components/
│   │   ├── Card.astro      # the single catalogue row; renders any Item by type
│   │   └── pages/          # page bodies (CatalogView, HomePage, ItemDetailPage,
│   │                       #   LaunchersPage, PortsPage, DecompsPage, FaqPage,
│   │                       #   ContributePage)
│   ├── layouts/Base.astro
│   ├── styles/global.css   # palette, typography and component styles
│   └── pages/              # ES routes at / and EN routes at /en/, plus the
│                           #   detail routes recomp/ decomp/ port/ tool/
├── public/                 # logos, icons, robots.txt
├── scripts/
│   ├── refresh-stats.mjs      # GitHub API -> src/data/stats.json
│   ├── discover.mjs           # finds candidate projects from a YouTube feed
│   ├── discovery-ignore.txt   # projects deliberately rejected, with reasons
│   ├── normalize-data.mjs     # rewrites the YAML into canonical form
│   └── validate-data.mjs      # fast YAML checks, used by CI
├── .github/workflows/      # deploy · refresh-stats · discover · validate
└── unricopie-launcher/     # Tauri launcher scaffold, development stopped
```

## Development

```bash
npm install
npm run dev            # http://localhost:4321/unricopie/
npm run build          # writes dist/ and validates the data schema on the way
npm run preview        # serves dist/
npm run validate-data  # fast YAML checks
npm run refresh-stats  # refresh stats.json from the GitHub API
npm run discover       # list catalogue candidates found in the channel feed
```

**Local token.** `refresh-stats` and `discover` read `GITHUB_TOKEN` from the environment or from a gitignored `.env.local`. Without one GitHub allows 60 requests per hour; with one, 5000. CI needs no configuration: the workflows use the runner's automatic `GITHUB_TOKEN`.

## Automation

Four scheduled or triggered workflows, none of which requires a secret beyond the runner's own token.

- **`refresh-stats.yml`** — daily. Updates `stats.json` and commits it.
- **`deploy.yml`** — publishes on every push to `main`, and again once the stats refresh finishes, since a bot push does not trigger workflows on its own.
- **`validate.yml`** — YAML checks and a full build on every push and pull request.
- **`discover.yml`** — daily. Reads the Video Game Esoterica RSS feed, extracts repository links, discards anything already in the catalogue or listed in `scripts/discovery-ignore.txt`, enriches the rest from the GitHub API, and opens or updates a single issue with the candidates.

`discover.yml` reports and nothing more; it never writes to the catalogue. Deciding which section a project belongs in requires reading its README, and that judgement is not automated: projects are regularly named in ways that contradict what they are, and a wrong entry is worse than a missing one. Rejections belong in `discovery-ignore.txt` with their reason, so the same candidate is not reconsidered every day.

## Deployment

The site is published as a project page at `https://nio03.github.io/unricopie/`, which is why [`astro.config.mjs`](./astro.config.mjs) sets `base: '/unricopie'`. To enable it on a fresh fork:

1. **Settings → Pages → Source: GitHub Actions.**
2. **Settings → Actions → General → Workflow permissions → Read and write**, so the stats bot can commit `stats.json`.

The workflows handle the rest. For a custom domain or a root deployment, change `site` and set `base: '/'`.

## Contributing

Missing projects and corrections are welcome; an entry is one YAML file and a pull request. See **[CONTRIBUTING.md](./CONTRIBUTING.md)**. Do not fill in stars, versions or dates — the bot derives those from the repository.

## Licence

Code under [MIT](./LICENSE). Catalogue entries are public facts about third-party projects; each linked project keeps its own licence. See the Terms of Use and Privacy Policy linked in the site footer.
