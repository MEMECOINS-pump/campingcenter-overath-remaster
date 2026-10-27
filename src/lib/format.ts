import type { Locale } from '@/i18n';

const localeTag = (lang: Locale = 'de') => (lang === 'en' ? 'en-GB' : 'de-DE');

export const formatPrice = (value: number, lang: Locale = 'de'): string =>
  new Intl.NumberFormat(localeTag(lang), { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);

export const formatInt = (value: number, lang: Locale = 'de'): string =>
  new Intl.NumberFormat(localeTag(lang), { maximumFractionDigits: 0 }).format(value);

export const formatKm = (value: number, lang: Locale = 'de'): string => `${formatInt(value, lang)} km`;

export const formatLength = (mm: number, lang: Locale = 'de'): string =>
  `${new Intl.NumberFormat(localeTag(lang), { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(mm / 1000)} m`;

export const formatWeight = (kg: number, lang: Locale = 'de'): string => `${formatInt(kg, lang)} kg`;

export function formatDateDE(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

export function formatDateLocalized(iso: string, lang: Locale = 'de'): string {
  if (lang === 'de') return formatDateDE(iso);
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(y, m - 1, d),
  );
}
