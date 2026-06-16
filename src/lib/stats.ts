// Datos en vivo de GitHub (estrellas, último push), refrescados a diario por
// el GitHub Action (.github/workflows/refresh-stats.yml) y versionados en
// src/data/stats.json. El sitio los lee en build → nunca pega contra el
// rate-limit de la API desde el navegador.
import statsData from '../data/stats.json';

export interface RepoStat {
  stars?: number;
  pushedAt?: string;
  createdAt?: string;
  archived?: boolean;
  license?: string;
  homepage?: string;
  language?: string;
  version?: string;
  versionAt?: string;
  fork?: string; // "owner/repo" del repo padre si este es un fork de GitHub
  decompPercent?: number; // % de decompilación (matched code) desde decomp.dev
}

const stats = statsData as Record<string, RepoStat>;

export function statFor(repo?: string): RepoStat {
  if (!repo) return {};
  return stats[repo] ?? {};
}

export function repoUrlOf(entry: { repo?: string; repoUrl?: string }): string | null {
  if (entry.repoUrl) return entry.repoUrl;
  if (entry.repo) return `https://github.com/${entry.repo}`;
  return null;
}

export function fmtStars(n?: number): string {
  if (n == null) return '—';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

export function fmtDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toISOString().slice(0, 10);
}

// Fecha relativa localizada, para la página de detalle.
import { t, type Lang } from '../i18n';
export function relDate(iso: string | undefined, lang: Lang): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days < 1) return t(lang, 'rel.today');
  if (days < 30) return days === 1 ? t(lang, 'rel.day') : t(lang, 'rel.days', { n: days });
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? t(lang, 'rel.month') : t(lang, 'rel.months', { n: months });
  const years = Math.floor(days / 365);
  return years === 1 ? t(lang, 'rel.year') : t(lang, 'rel.years', { n: years });
}
