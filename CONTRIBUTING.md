# Contribuir a Recompendium · Contributing

*(Español abajo / English below.)*

El catálogo es la carpeta `src/data/`: **un archivo YAML por proyecto**, en tres colecciones:

| Carpeta | Para | Esquema |
|---|---|---|
| `src/data/recomps/` | juegos recompilados (estáticos) | `console`, `status`, … |
| `src/data/tools/` | recompiladores, launchers, librerías | `kind`, `consoles`, … |
| `src/data/ports/` | ports decomp y remakes de fans (no recomp) | `category`, … |

Añadir o corregir uno es editar/crear un archivo y abrir un Pull Request. La validación automática (CI: `validate-data` + `astro build`) revisa el formato antes de mergear.

## Regla de alcance

- **Catálogo (`recomps/`)**: solo **recompilaciones estáticas** (binario original → C/C++ → nativo).
- **Ports y remakes (`ports/`)**: decompilaciones a fuente y remakes de fans (P-06, Ship of Harkinian, OpenGOAL…). No son recomp, pero traen el mismo juego a PC.
- Si dudas en cuál va, ponlo en el PR y lo charlamos.

## Descripciones bilingües (obligatorio)

Todas las descripciones llevan español e inglés:

```yaml
desc:
  es: "Una o dos líneas sobre el proyecto."
  en: "One or two lines about the project."
```

También se acepta un único string (se usará en ambos idiomas), pero **lo ideal es dar los dos**.

## Añadir un juego (recomp)

`src/data/recomps/<slug>.yaml`:

```yaml
name: "Conker's Bad Fur Day"     # requerido
console: n64                     # requerido — ver lista abajo
status: playable                 # playable | wip | experimental
repo: usuario/ConkerRecomp       # owner/repo (sin URL). Omite si no vive en GitHub.
author: usuario
originalDeveloper: Rare
year: 2025
progress: 80                     # opcional — % aproximado
toolchain: N64Recomp             # opcional — N64Recomp | XenonRecomp | ReXGlue…
desc: { es: "…", en: "…" }       # requerido
tags: [widescreen, mods]
# enrich: false                  # solo si comparte repo con otra entrada
```

**Consolas:** `n64`, `gamecube`, `wii`, `wiiu`, `ps2`, `ps1`, `psp`, `x360`, `dreamcast`, `other`.
**Estados:** `playable`, `wip`, `experimental`.

## Añadir una herramienta / launcher

`src/data/tools/<slug>.yaml` — `kind`: `recompiler` | `launcher` | `patcher` | `library`; `status` (opcional): `stable` | `beta` | `wip` | `experimental`.

## Añadir un port o remake

`src/data/ports/<slug>.yaml` — `category`: `decomp-port` | `fan-remake`; opcional `engine` (Unity, Godot…), `console` de origen.

## Lo que **no** tienes que poner

`stars`, `pushedAt` ni fechas: el GitHub Action `refresh-stats.yml` los rellena a diario en `src/data/stats.json`. No edites ese archivo a mano.

## Antes de abrir el PR

```bash
npm install
npm run validate-data   # chequeo rápido de tu YAML
npm run build           # validación completa del esquema + sitio bilingüe
```

En la descripción del PR, enlaza algo que permita **verificar** el proyecto (un release jugable, un vídeo, un hilo). Mejor `wip` honesto que `playable` optimista.

---

## English (summary)

The catalog lives in `src/data/` — one YAML per project across three collections: `recomps/` (static recompilations only), `tools/` (recompilers/launchers/libraries) and `ports/` (decomp ports & fan remakes — not recomps). Descriptions are **bilingual** (`desc: { es, en }`). Don't add stars/dates — a daily GitHub Action fills `stats.json`. Run `npm run validate-data` and `npm run build` before opening a PR, and link something that lets us **verify** the project. Prefer an honest `wip` over an optimistic `playable`.
