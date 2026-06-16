import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CONSOLE_KEYS } from './lib/consoles';

const consoleEnum = z.enum(CONSOLE_KEYS as [string, ...string[]]);
const repoSlug = z
  .string()
  .regex(/^[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+$/, 'Debe ser "owner/repo" (sin URL completa).');
const linkList = z
  .array(z.object({ label: z.string(), url: z.string().url() }))
  .default([]);

// Relación de fork curada (tiene prioridad sobre la detección automática del bot).
const forkOf = z.object({ label: z.string(), url: z.string().url() }).optional();

// Texto bilingüe: acepta un string (mismo en ambos idiomas) o {es, en}.
// Siempre normaliza a { es, en } — los componentes usan desc[lang].
const localized = z
  .union([z.string(), z.object({ es: z.string(), en: z.string().optional() })])
  .transform((v) => (typeof v === 'string' ? { es: v, en: v } : { es: v.es, en: v.en ?? v.es }));

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
    originalDeveloper: z.string().optional(),
    year: z.number().int().gte(1990).lte(2100).optional(),
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
    status: z.enum(['experimental', 'beta', 'usable', 'stable']).optional(),
    abandoned: z.boolean().default(false),
    takedown: z.boolean().default(false),
    desc: localized,
    ours: z.boolean().default(false),
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
    category: z.enum(['decomp-port', 'fan-remake']),
    console: consoleEnum.optional(),
    status: z.enum(['experimental', 'playable', 'fully']).default('playable'),
    abandoned: z.boolean().default(false),
    takedown: z.boolean().default(false),
    repo: repoSlug.optional(),
    repoUrl: z.string().url().optional(),
    homepage: z.string().url().optional(),
    forkOf,
    author: z.string().optional(),
    originalDeveloper: z.string().optional(),
    engine: z.string().optional(),
    decomp: z.string().optional(), // "owner/repo" del proyecto en decomp.dev (progreso en vivo)
    year: z.number().int().gte(1990).lte(2100).optional(),
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

export const collections = { recomps, tools, ports, decomps };
