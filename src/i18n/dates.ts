import type { Lang } from './ui';

/**
 * Format a post date for display.
 * Arabic uses Arabic-Indic digits and Arabic month names, which is what a
 * Lebanese reader expects; English uses a plain long date.
 */
export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-LB' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Machine-readable YYYY-MM-DD for <time datetime="..."> */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
