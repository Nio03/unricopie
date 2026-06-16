# Unricopie — Roadmap

**Unricopie** es el launcher multi-consola de Recompendium: un solo lugar para **descubrir, descargar y organizar** los recomps de N64, GameCube, Wii, PS2 y Xbox 360, comprobando siempre que aportes tu propia copia legal.

Hoy existen launchers por proyecto (p. ej. `N64RecompLauncher` / `SirDiabo/GithubLauncher`, `RecompFrontend`). Unricopie apunta a **unificarlos sobre el catálogo que ya mantenemos** en `../src/data/`.

## Principios

- **Nunca** distribuye ROMs ni assets. Solo descarga el código de los recomps (open source) y lo conecta con tu copia legal.
- **El catálogo manda.** La lista de recomps sale de Recompendium (`src/data/`), no de una base de datos paralela.
- **Multiplataforma y ligero.** Tauri (Rust + frontend web) → binarios pequeños en Windows/macOS/Linux.

## Fases

### Fase 0 — Scaffold *(en curso)*
- [x] Proyecto Tauri creado en `unricopie-launcher/`.
- [x] Roadmap y arquitectura documentados.
- [ ] Frontend mínimo que lee el catálogo (JSON publicado por el sitio o copia local).

### Fase 1 — Descubrir y descargar
- [ ] Listar recomps disponibles desde el catálogo.
- [ ] Resolver el último *release* del repo de cada recomp (GitHub Releases API).
- [ ] Descargar y desempaquetar a una carpeta de librería.
- [ ] Detección de actualizaciones (como N64RecompLauncher, pero multi-consola).

### Fase 2 — Tu copia legal
- [ ] Apuntar el launcher a tu ROM / imagen de disco.
- [ ] Verificación por hash (la ROM correcta para ese recomp).
- [ ] Aplicar assets sobre el recomp y lanzar el juego.

### Fase 3 — Librería
- [ ] Vista de biblioteca con portadas y estado por juego.
- [ ] Gestión de versiones y *rollback*.
- [ ] Perfiles de configuración por juego.

## Arquitectura (propuesta)

```
┌──────────────┐   lee    ┌─────────────────────┐
│  Recompendium │ ───────▶ │  catálogo (JSON)     │
│  src/data/    │          │  recomps + tools     │
└──────────────┘          └─────────┬───────────┘
                                     │
                          ┌──────────▼───────────┐
                          │  Unricopie (Tauri)    │
                          │  ┌────────────────┐   │
                          │  │ frontend web   │   │  UI: catálogo, librería
                          │  ├────────────────┤   │
                          │  │ core en Rust   │   │  descargas, hashing, FS,
                          │  └────────────────┘   │  GitHub Releases, lanzar
                          └───────────────────────┘
```

> El comando `list_recomps` del core (ver `src-tauri/src/lib.rs`) es hoy un *stub*. La Fase 1
> lo conecta al catálogo real (descargando el JSON del sitio publicado o leyendo `../src/data`).
