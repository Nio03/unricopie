import { getCollection } from "astro:content";
import { getGames, coverOf } from "../../lib/games";
import { CONSOLES, inkOn } from "../../lib/consoles";
import { statFor } from "../../lib/stats";
import { existsSync } from "node:fs";
import { join } from "node:path";

// El catálogo que baja Unricopie: las recomps y los ports del sitio, con los textos en los
// dos idiomas y la dirección de su portada. Son los mismos datos públicos de las fichas
// (CC BY-SA 4.0); las recetas de instalación van aparte (recetas.json, que no está en el
// repo público). La forma es la que lee `app/src/catalogo.rs` del launcher.
const SITE = "https://recompendium.com";

// El fondo y las capturas de IGDB de los juegos que Unricopie instala, en public/arte/<juego>/
// (fondo.webp y c1..c6.webp). Sin archivo, el juego no los trae y el launcher usa su color.
const ARTE = join(process.cwd(), "public", "arte");
const arteDe = (gid) => {
  if (!gid) return {};
  const url = (f) => (existsSync(join(ARTE, gid, f)) ? `${SITE}/arte/${gid}/${f}` : null);
  const capturas = [1, 2, 3, 4, 5, 6].map((n) => url(`c${n}.webp`)).filter(Boolean);
  return { ...(url("fondo.webp") ? { fondo: url("fondo.webp") } : {}), ...(capturas.length ? { capturas } : {}) };
};

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
      const st = statFor(d.repo);
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
        // La última release del proyecto en GitHub, su fecha y las estrellas (de stats.json).
        version: st.version ?? "",
        fecha: st.versionAt?.slice(0, 10) ?? "",
        estrellas: st.stars ?? 0,
        arte: (() => {
          const a = { ...(portada ? { portada: `${SITE}${portada}` } : {}), ...arteDe(gid) };
          return Object.keys(a).length ? { ...a, fuente: "igdb" } : {};
        })(),
      });
    }
  }
  return new Response(JSON.stringify({ formato: 1, generado: new Date().toISOString(), entradas: out }), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
