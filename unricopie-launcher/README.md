# Unricopie Launcher

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
