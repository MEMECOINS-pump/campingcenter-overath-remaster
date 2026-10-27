export const locales = ['de', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'de';

export const localeMeta: Record<
  Locale,
  { htmlLang: string; ogLocale: string; label: string; short: string }
> = {
  de: { htmlLang: 'de-DE', ogLocale: 'de_DE', label: 'Deutsch', short: 'DE' },
  en: { htmlLang: 'en-GB', ogLocale: 'en_GB', label: 'English', short: 'EN' },
};

export const LANG_STORAGE_KEY = 'cco:lang';
