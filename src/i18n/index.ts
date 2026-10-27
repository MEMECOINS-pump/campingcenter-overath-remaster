import { defaultLocale, locales, localeMeta, type Locale, LANG_STORAGE_KEY } from './locales';
import { t, dict, type UiKey, type UiDict } from './ui';
import { stripBase, url } from '@/lib/url';

export { defaultLocale, locales, localeMeta, LANG_STORAGE_KEY, t, dict };
export type { Locale, UiKey, UiDict };

/** Detect locale from pathname (after base path). Default German keeps existing SEO URLs. */
export function getLangFromPath(pathname: string): Locale {
  const p = stripBase(pathname);
  if (p === '/en' || p.startsWith('/en/')) return 'en';
  return defaultLocale;
}

/** Path without `/en` prefix (still root-relative, no base). */
export function stripLocale(pathname: string): string {
  const p = stripBase(pathname);
  if (p === '/en' || p === '/en/') return '/';
  if (p.startsWith('/en/')) {
    const rest = p.slice(3);
    return rest.startsWith('/') ? rest : `/${rest}`;
  }
  return p || '/';
}

/**
 * Exact EN page paths (bare, no `/en` prefix). Vehicle detail slugs match via hasEnRoute().
 * Missing EN routes fall back to German URLs so nav never 404s.
 */
export const enRoutes = new Set<string>([
  '/',
  '/kontakt/',
  '/wohnmobile/',
  '/vermietung-wohnmobile/',
  '/wohnmobil-ankauf/',
  '/werkstatt-kundendienst/',
  '/ueber-uns/',
  '/camper-finder/',
  '/marken/',
  '/merkliste/',
  '/vergleich/',
  '/404/',
]);

/** True when an English counterpart exists for this bare path. */
export function hasEnRoute(barePath: string): boolean {
  const bare = barePath.endsWith('/') || barePath === '/' ? barePath : `${barePath}/`;
  if (enRoutes.has(bare)) return true;
  // Inventory detail pages ship under /en/wohnmobile/:slug/
  if (/^\/wohnmobile\/[^/]+\/$/.test(bare)) return true;
  return false;
}

/** Serialize for boot-script redirect (exact paths only; slug pattern is inlined in boot). */
export function enRoutesPayload(): string[] {
  return [...enRoutes];
}

export { glossary, g, translateCategoryLabel, translateTransmission, translateCondition } from './glossary';
export { translateVehicleCopy, tmRemember } from './tm';

/** Build a localized internal path (no base); use with `url()`. */
export function localizedPath(path: string, lang: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const [pathname = '/', hash = ''] = clean.split('#');
  const [pathOnly = '/', query = ''] = pathname.split('?');
  const normalized = pathOnly.endsWith('/') || /\.[a-z0-9]+$/i.test(pathOnly) ? pathOnly : `${pathOnly}/`;
  const q = query ? `?${query}` : '';
  const h = hash ? `#${hash}` : '';
  if (lang === defaultLocale) return `${normalized}${q}${h}`;
  const bare = normalized === '/en/' ? '/' : normalized.startsWith('/en/') ? normalized.slice(3) : normalized;
  if (!hasEnRoute(bare)) return `${bare}${q}${h}`;
  const enBase = bare === '/' ? '/en/' : `/en${bare}`;
  return `${enBase}${q}${h}`;
}

/** Switch locale while keeping the same page path when an EN counterpart exists. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const bare = stripLocale(pathname);
  return localizedPath(bare, target);
}

export function withBaseLocalized(path: string, lang: Locale): string {
  return url(localizedPath(path, lang));
}

export function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function formatLocaleNumber(value: number, lang: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'de-DE', options).format(value);
}

export function formatLengthLocalized(mm: number, lang: Locale): string {
  const m = mm / 1000;
  return `${formatLocaleNumber(m, lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m`;
}

export function formatPriceLocalized(value: number, lang: Locale): string {
  return new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getTranslator(lang: Locale) {
  return (key: UiKey) => t(lang, key);
}

export function htmlLang(lang: Locale): string {
  return localeMeta[lang].htmlLang;
}

export function ogLocale(lang: Locale): string {
  return localeMeta[lang].ogLocale;
}
