# Contribuir a Recompendium · Contributing

*(Español abajo / English below.)*

El catálogo es la carpeta `src/data/`: **un archivo YAML por proyecto**, en cuatro colecciones:

| Carpeta | Para | Esquema |
|---|---|---|
| `src/data/recomps/` | juegos recompilados (estáticos) | `console`, `status`, … |
| `src/data/tools/` | recompiladores, launchers, librerías | `kind`, `consoles`, … |
| `src/data/ports/` | ports decomp y remakes de fans (no recomp) | `category`, … |
| `src/data/decomps/` | decompilaciones (registro de decomp.dev) | `console`, `decomp`, … |

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
status: playable                 # experimental | playable | fully
repo: usuario/ConkerRecomp       # owner/repo (sin URL). Omite si no vive en GitHub.
author: usuario
originalDeveloper: Rare
year: 2025
progress: 80                     # opcional — % aproximado
toolchain: N64Recomp             # opcional — N64Recomp | XenonRecomp | ReXGlue…
desc: { es: "…", en: "…" }       # requerido
requirements: { es: "…", en: "…" }  # opcional — qué necesita el usuario (ROM/ISO, BIOS, Title Update…)
tags: [widescreen, mods]
# enrich: false                  # solo si comparte repo con otra entrada
```

**Consolas:** las claves de `src/lib/consoles.ts` — hoy `snes`, `n64`, `gamecube`, `wii`, `wiiu`, `switch`, `ps1`, `ps2`, `ps3`, `psp`, `xbox`, `x360`, `dreamcast` (también NAOMI), `saturn`, `gba`, `nds`, `pc`, `other`.
**Estados:** `experimental`, `playable`, `fully` (completamente jugable). No existe `wip`: el `astro build` lo rechaza.
**Proyecto muerto o retirado:** no borres la entrada; añade `abandoned: true` o `takedown: true` (y quita `repo` si fue por reclamación).

## Añadir una herramienta / launcher

`src/data/tools/<slug>.yaml` — `kind`: `recompiler` | `launcher` | `patcher` | `library`; `status` (opcional): `experimental` | `beta` | `usable` | `stable`.

## Añadir un port o remake

`src/data/ports/<slug>.yaml` — `category`: `decomp-port` | `fan-remake`; `status` como en recomps (`experimental` | `playable` | `fully`, por defecto `playable`); opcional `engine` (Unity, Godot…), `console` de origen, `requirements`.

## Lo que **no** tienes que poner

`stars`, `pushedAt` ni fechas: el GitHub Action `refresh-stats.yml` los rellena a diario en `src/data/stats.json`. No edites ese archivo a mano.

## Antes de abrir el PR

```bash
npm install
npm run validate-data   # chequeo rápido de tu YAML
npm run build           # validación completa del esquema + sitio bilingüe
```

En la descripción del PR, enlaza algo que permita **verificar** el proyecto (un release jugable, un vídeo, un hilo). Mejor `experimental` honesto que `playable` optimista.

---

## English (summary)

The catalog lives in `src/data/` — one YAML per project across four collections: `recomps/` (static recompilations only), `tools/` (recompilers/launchers/libraries), `ports/` (decomp ports & fan remakes — not recomps) and `decomps/` (decomp.dev registry). Statuses are `experimental` | `playable` | `fully` for recomps/ports and `experimental` | `beta` | `usable` | `stable` for tools (there is no `wip` — the build rejects it); console keys are the ones in `src/lib/consoles.ts`; `requirements: { es, en }` says what the user must supply (ROM/ISO, BIOS…); a dead or removed project keeps its file with `abandoned: true` / `takedown: true`. Descriptions are **bilingual** (`desc: { es, en }`). Don't add stars/dates — a daily GitHub Action fills `stats.json`. Run `npm run validate-data` and `npm run build` before opening a PR, and link something that lets us **verify** the project. Prefer an honest `experimental` over an optimistic `playable`.
