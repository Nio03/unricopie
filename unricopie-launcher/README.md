# Unricopie Launcher

> ## ⏸️ PARADO
>
> **Este proyecto no está en desarrollo.** Se quedó en el scaffold de la Fase 0 y no se ha
> tocado desde junio de 2026. El esfuerzo está puesto en el catálogo (Recompendium), que es
> lo que aporta valor hoy.
>
> El código se conserva por si se retoma, pero **no es un producto y no se anuncia como tal**:
> ya no tiene página en el sitio ni ficha en el catálogo. Si buscas un launcher de recomps
> que funcione hoy, mira la sección [Launchers](https://nio03.github.io/unricopie/launchers).

Launcher multi-consola de [Recompendium](../README.md). **Fase 0 (scaffold).** Ver el [ROADMAP](./ROADMAP.md).

> Esto es un esqueleto Tauri 2 real pero mínimo. Todavía no descarga ni lanza nada — el comando
> `list_recomps` es un *stub* que la Fase 1 conectará al catálogo.

## Requisitos

- [Rust](https://www.rust-lang.org/tools/install) (cargo) — disponible.
- Node.js 20+.
- Dependencias de sistema de Tauri (WebView): ver <https://tauri.app/start/prerequisites/>.
  - Windows: WebView2 (suele venir con Windows 11).

## Correr en desarrollo

```bash
cd unricopie-launcher
npm install
npm run tauri dev      # primera vez compila el core Rust (tarda)
```

## Estructura

```
unricopie-launcher/
├── index.html          # frontend mínimo (vanilla)
├── src/main.js         # llama al comando list_recomps del core
├── package.json
└── src-tauri/
    ├── Cargo.toml
    ├── build.rs
    ├── tauri.conf.json
    └── src/
        ├── main.rs     # punto de entrada
        └── lib.rs      # comandos (list_recomps: stub)
```

## Por qué Tauri

Binarios pequeños, multiplataforma, y el core en Rust nos da descargas, hashing de ROMs y manejo
de ficheros nativos sin arrastrar un Chromium entero como Electron.
