import { describe, expect, it } from 'vitest';
import {
  defaultLocale,
  getLangFromPath,
  localizedPath,
  stripLocale,
  switchLocalePath,
  t,
  formatLengthLocalized,
} from '@/i18n';

describe('i18n routing', () => {
  it('defaults to German and detects /en/', () => {
    expect(defaultLocale).toBe('de');
    expect(getLangFromPath('/')).toBe('de');
    expect(getLangFromPath('/wohnmobile/')).toBe('de');
    expect(getLangFromPath('/en/')).toBe('en');
    expect(getLangFromPath('/en/kontakt/')).toBe('en');
  });

  it('builds localized paths without breaking DE URLs', () => {
    expect(localizedPath('/wohnmobile/', 'de')).toBe('/wohnmobile/');
    expect(localizedPath('/wohnmobile/', 'en')).toBe('/en/wohnmobile/');
    expect(localizedPath('/', 'en')).toBe('/en/');
    // Not yet translated → DE fallback
    expect(localizedPath('/werkstatt-kundendienst/', 'en')).toBe('/werkstatt-kundendienst/');
  });

  it('switches locale while preserving path', () => {
    expect(switchLocalePath('/en/kontakt/', 'de')).toBe('/kontakt/');
    expect(switchLocalePath('/kontakt/', 'en')).toBe('/en/kontakt/');
    expect(stripLocale('/en/wohnmobile/')).toBe('/wohnmobile/');
    expect(switchLocalePath('/werkstatt-kundendienst/', 'en')).toBe('/werkstatt-kundendienst/');
  });

  it('translates companion and nav keys', () => {
    expect(t('de', 'companionTitle')).toBe('Dein Reisebegleiter');
    expect(t('en', 'companionTitle')).toBe('Your Travel Companion');
    expect(t('en', 'companionFabAria')).toMatch(/accessibility/i);
    expect(t('de', 'navRental')).toBe('Vermietung');
    expect(t('en', 'navRental')).toBe('Rental');
  });

  it('localizes length formatting', () => {
    expect(formatLengthLocalized(6990, 'de')).toBe('6,99 m');
    expect(formatLengthLocalized(6990, 'en')).toBe('6.99 m');
  });
});
