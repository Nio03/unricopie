import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CONSOLE_KEYS } from './lib/consoles';

const consoleEnum = z.enum(CONSOLE_KEYS as [string, ...string[]]);
const repoSlug = z
  .string()
  .regex(/^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/, 'Debe ser "owner/repo" (sin URL completa).');
// Texto bilingüe: acepta un string (mismo en ambos idiomas) o {es, en}.
// Siempre normaliza a { es, en } — los componentes usan desc[lang].
const localized = z
  .union([z.string(), z.object({ es: z.string(), en: z.string().optional() })])
  .transform((v) => (typeof v === 'string' ? { es: v, en: v } : { es: v.es, en: v.en ?? v.es }));

// Enlaces extra de una ficha. La etiqueta va en los dos idiomas ({es, en}), o
// como un solo texto si es un nombre propio ("Wikipedia", "CannonBall DX (fork)").
// La web oficial del proyecto no va aquí: va en homepage, que ya se traduce.
const linkList = z
  .array(z.object({ label: localized, url: z.string().url() }))
  .default([]);

// Relación de fork curada (tiene prioridad sobre la detección automática del bot).
const forkOf = z.object({ label: z.string(), url: z.string().url() }).optional();

// ── Recomps: un archivo YAML por juego en src/data/recomps/ ──
const recomps = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/data/recomps' }),
  schema: z.object({
    name: z.string(),
    console: consoleEnum,
    status: z.enum(['experimental', 'playable', 'fully']),
    abandoned: z.boolean().default(false),
    takedown: z.boolean().default(false),
    repo: repoSlug.optional(),
    repoUrl: z.string().url().optional(),
    homepage: z.string().url().optional(),
    forkOf,
    author: z.string().optional(),
    // Nombre anterior del autor o dueño del repo, si el repo cambió de dueño:
    // la ficha lo muestra como «(anteriormente X)» / «(formerly X)».
    authorFormerly: z.string().optional(),
    originalDeveloper: z.string().optional(),
    year: z.number().int().gte(1970).lte(2100).optional(),
    progress: z.number().min(0).max(100).optional(),
    toolchain: z.string().optional(),
    decomp: z.string().optional(), // "owner/repo" del proyecto en decomp.dev (progreso en vivo)
    desc: localized,
    requirements: localized.optional(),
    tags: z.array(z.string()).default([]),
    links: linkList,
    enrich: z.boolean().default(true),
    featured: z.boolean().default(false),
  }),
});

// ── Mods: mods y herramientas de mods en src/data/mods/ ──
// Mods de juegos del catálogo, herramientas para crear mods (editores) y
// gestores que los instalan. Como en el resto del catálogo, solo entran si
// piden tu propia copia del juego.
const mods = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/data/mods' }),
  schema: z.object({
    name: z.string(),
    kind: z.enum(['mod', 'editor', 'manager']),
    // Plataforma del juego al que se aplica (pc si es un juego de PC).
    console: consoleEnum,
    // Juego o juegos sobre los que funciona, tal como se escriben en la ficha.
    game: localized,
    // Ficha del catálogo sobre la que se monta, si la hay: "ports/perfect-dark".
    base: z.string().regex(/^(recomps|ports|decomps|tools)\/[a-z0-9-]+$/).optional(),
    repo: repoSlug.optional(),
    repoUrl: z.string().url().optional(),
    homepage: z.string().url().optional(),
    forkOf,
    author: z.string().optional(),
    authorFormerly: z.string().optional(),
    status: z.enum(['experimental', 'beta', 'usable', 'stable']).optional(),
    abandoned: z.boolean().default(false),
    takedown: z.boolean().default(false),
    desc: localized,
    requirements: localized.optional(),
    tags: z.array(z.string()).default([]),
    links: linkList,
    enrich: z.boolean().default(true),
    featured: z.boolean().default(false),
  }),
});

// ── Tools: launchers, recompiladores y utilidades en src/data/tools/ ──
const tools = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/data/tools' }),
  schema: z.object({
    name: z.string(),
    kind: z.enum(['recompiler', 'launcher', 'patcher', 'library']),
    consoles: z.array(consoleEnum).default([]),
    repo: repoSlug.optional(),
    repoUrl: z.string().url().optional(),
    homepage: z.string().url().optional(),
    forkOf,
    author: z.string().optional(),
    authorFormerly: z.string().optional(),
    status: z.enum(['experimental', 'beta', 'usable', 'stable']).optional(),
    abandoned: z.boolean().default(false),
    takedown: z.boolean().default(false),
    desc: localized,
    tags: z.array(z.string()).default([]),
    links: linkList,
    enrich: z.boolean().default(true),
    featured: z.boolean().default(false),
  }),
});

// ── Ports y remakes: categoría hermana (no son recompilaciones) ──
const ports = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/data/ports' }),
  schema: z.object({
    name: z.string(),
    // native-layer: el ejecutable ORIGINAL corre nativo y un runtime hecho para
    // ese juego sustituye las librerias de sistema de la consola. No hay
    // recompilacion (misma arquitectura) ni decompilacion: es el modelo de
    // Wine + DXVK aplicado a un solo juego.
    // game-engine: un motor hecho para un solo juego que ejecuta su codigo
    // original (en un interprete propio o recompilado en parte), reimplementa el
    // hardware y va pasando funciones a codigo nativo. Ej.: lp-engine (LovePlus+).
    category: z.enum(['decomp-port', 'fan-remake', 'native-layer', 'game-engine']),
    console: consoleEnum.optional(),
    status: z.enum(['experimental', 'playable', 'fully']).default('playable'),
    abandoned: z.boolean().default(false),
    takedown: z.boolean().default(false),
    repo: repoSlug.optional(),
    repoUrl: z.string().url().optional(),
    homepage: z.string().url().optional(),
    forkOf,
    author: z.string().optional(),
    authorFormerly: z.string().optional(),
    originalDeveloper: z.string().optional(),
    engine: z.string().optional(),
    decomp: z.string().optional(), // "owner/repo" del proyecto en decomp.dev (progreso en vivo)
    year: z.number().int().gte(1970).lte(2100).optional(),
    desc: localized,
    requirements: localized.optional(),
    tags: z.array(z.string()).default([]),
    links: linkList,
    enrich: z.boolean().default(true),
    featured: z.boolean().default(false),
  }),
});

// ── Decompilaciones: el registro de decomp.dev (proyectos de RE del código) ──
const decomps = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/data/decomps' }),
  schema: z.object({
    name: z.string(),
    console: consoleEnum,
    repo: repoSlug.optional(),
    repoUrl: z.string().url().optional(),
    forkOf,
    authorFormerly: z.string().optional(),
    decomp: z.string().optional(),
    abandoned: z.boolean().default(false),
    takedown: z.boolean().default(false),
    desc: localized,
    tags: z.array(z.string()).default([]),
    links: linkList,
    enrich: z.boolean().default(true),
    featured: z.boolean().default(false),
  }),
});

// ── Blog: lo que pasó cada semana, y lo que el catálogo no puede contener ──
//
// El catálogo registra QUÉ existe; el blog cuenta QUÉ PASÓ. Sirve también para
// lo que las reglas de entrada dejan fuera a propósito: los ports a navegador
// que traen el juego dentro (CoD, GTA V) no entran en el catálogo, pero el blog
// los cuenta, con sus páginas y sus fuentes.
//
// Un archivo por idioma, en src/content/blog/<lang>/<slug>.md, con el MISMO
// slug en los dos para que hreflang empareje las versiones.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string(),
    // log: registro factual, con cadencia. opinion: solo cuando hay algo que decir.
    kind: z.enum(['log', 'opinion']).default('log'),
    // Un borrador no se publica: ni lista ni página. Para textos en voz del autor
    // que todavía no ha revisado.
    draft: z.boolean().default(false),
  }),
});

export const collections = { recomps, tools, ports, decomps, mods, blog };
