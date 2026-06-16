// Unricopie — core del launcher (Tauri 2). Fase 0: stub.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;

#[derive(Serialize)]
struct Recomp {
    name: String,
    console: String,
    status: String,
}

/// STUB. La Fase 1 conectará esto al catálogo de Recompendium:
/// descargando el JSON publicado por el sitio o leyendo ../../src/data.
#[tauri::command]
fn list_recomps() -> Vec<Recomp> {
    vec![
        Recomp {
            name: "The Legend of Zelda: Majora's Mask".into(),
            console: "N64".into(),
            status: "playable".into(),
        },
        Recomp {
            name: "Sonic Unleashed".into(),
            console: "Xbox 360".into(),
            status: "playable".into(),
        },
    ]
}

#[tauri::command]
fn app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![list_recomps, app_version])
        .run(tauri::generate_context!())
        .expect("error al arrancar Unricopie");
}
