// Frontend mínimo (buildless). Usa el bridge global de Tauri
// (app.withGlobalTauri = true en tauri.conf.json) para no necesitar un bundler.
const invoke = window.__TAURI__?.core?.invoke;

const out = document.getElementById("out");
const btn = document.getElementById("load");

btn.addEventListener("click", async () => {
  if (!invoke) {
    out.innerHTML = "<li>Abre esto con <code>npm run tauri dev</code> (el bridge de Tauri no está en un navegador normal).</li>";
    return;
  }
  out.innerHTML = "<li>cargando…</li>";
  try {
    const list = await invoke("list_recomps");
    out.innerHTML = list
      .map((r) => `<li><b>${r.name}</b> — ${r.console} · ${r.status}</li>`)
      .join("");
  } catch (e) {
    out.innerHTML = `<li>error: ${e}</li>`;
  }
});
