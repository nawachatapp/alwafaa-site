import { ui, defaultLang, languages, type Lang } from './ui';

/**
 * Pull the language out of a URL. `/en/about/` -> 'en'.
 * Falls back to the default language for anything unrecognised.
 */
export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

/**
 * Returns a `t('nav.home')` function bound to one language.
 * Missing keys fall back to the default language rather than rendering
 * an empty string, so a half-translated key is visible but not broken.
 */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return (ui[lang] as Record<string, string>)[key]
        ?? (ui[defaultLang] as Record<string, string>)[key]
        ?? key;
  };
}

/**
 * Build an absolute site path for a page in a given language.
 * ('about', 'en') -> '/en/about/'   ('', 'ar') -> '/ar/'
 * Always root-relative and always trailing-slashed, matching the
 * `format: 'directory'` build output.
 */
export function localisedPath(path: string, lang: Lang): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/${lang}/${clean}/` : `/${lang}/`;
}

/**
 * Given the current URL, the equivalent page in the other language.
 * Used by the language switcher so it keeps the reader on the same page
 * rather than dumping them back on the homepage.
 */
export function alternatePath(url: URL, current: Lang): { lang: Lang; path: string } {
  const other = (Object.keys(languages) as Lang[]).find((l) => l !== current) ?? defaultLang;
  const rest = url.pathname.split('/').slice(2).join('/');
  return { lang: other, path: localisedPath(rest, other) };
}
