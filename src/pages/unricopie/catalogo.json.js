import { getCollection } from "astro:content";
import { getGames, coverOf } from "../../lib/games";
import { CONSOLES, inkOn } from "../../lib/consoles";

// El catálogo que baja Unricopie: las recomps y los ports del sitio, con los textos en los
// dos idiomas y la dirección de su portada. Son los mismos datos públicos de las fichas
// (CC BY-SA 4.0); las recetas de instalación van aparte (recetas.json, que no está en el
// repo público). La forma es la que lee `app/src/catalogo.rs` del launcher.
const SITE = "https://recompendium.com";

const texto = (v) => (v && typeof v === "object" ? { es: v.es ?? "", en: v.en ?? "" } : { es: String(v ?? ""), en: "" });

export async function GET() {
  const games = await getGames();
  const out = [];
  for (const [coleccion, metodoFijo] of [["recomps", "recomp"], ["ports", null]]) {
    for (const e of await getCollection(coleccion)) {
      const d = e.data;
      const gid = d.games?.[0] ?? null;
      const juego = gid ? games.get(gid) : null;
      const consola = d.console ?? juego?.platforms?.[0] ?? "pc";
      const meta = CONSOLES[consola] ?? CONSOLES.other;
      const portada = gid ? coverOf(gid) : null;
      out.push({
        entry: `${coleccion}/${e.id}`,
        juego: gid,
        nombre: juego?.name ?? d.name,
        proyecto: d.name,
        repo: d.repo ?? "",
        consola,
        // El nombre corto si la consola tiene dos regionales («NES / Famicom»); si no, el completo.
        consola_nombre: consola === "mobile" || meta.label.includes("/") ? meta.label : meta.full,
        color: meta.color.toLowerCase(),
        tinta: inkOn(meta.color),
        desarrollador: d.originalDeveloper ?? "",
        anio: d.year ?? juego?.year ?? 0,
        estado: d.status ?? "",
        desc: texto(d.desc),
        metodo: metodoFijo ?? d.category ?? "",
        toolchain: d.toolchain ?? "",
        autor: d.author ?? (d.repo ? d.repo.split("/")[0] : ""),
        requisitos: texto(d.requirements),
        retirado: Boolean(d.takedown),
        sin_enlace: Boolean(d.unlinked),
        arte: portada ? { portada: `${SITE}${portada}`, fuente: "igdb" } : {},
      });
    }
  }
  return new Response(JSON.stringify({ formato: 1, generado: new Date().toISOString(), entradas: out }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
