import { describe, expect, it } from 'vitest';
import {
  g,
  glossary,
  translateCategoryLabel,
  translateCondition,
  translateTransmission,
} from '@/i18n/glossary';
import { translateVehicleCopy, tmRemember } from '@/i18n/tm';
import { cardFacts, priceLabel } from '@/lib/vehicles';
import { assistCamping } from '@/lib/camping-assist';
import { computeOpenStatus } from '@/lib/opening-hours';
import { faqsFor } from '@/data/faqs';
import { finderQuestionsFor } from '@/data/camper-finder';
import { localizedPath } from '@/i18n';

describe('glossary & vehicle labels', () => {
  it('translates filter/category labels without inventing specs', () => {
    expect(translateCategoryLabel('Alkoven', 'en')).toBe('Overcab');
    expect(translateCategoryLabel('Teilintegriert', 'en')).toBe('Semi-integrated');
    expect(translateTransmission('Automatik', 'en')).toBe('Automatic');
    expect(translateCondition('gebraucht', 'en')).toBe('Used');
    expect(g('en', glossary.filter.reset)).toMatch(/Reset/i);
  });

  it('formats card facts with locale number style', () => {
    const sample = {
      condition: 'gebraucht' as const,
      firstRegistration: '03/2020',
      modelYear: null,
      mileageKm: 42000,
      lengthMm: 6990,
      transmission: 'Schaltgetriebe',
      powerPs: 140,
    };
    const de = cardFacts(sample as never, 'de');
    const en = cardFacts(sample as never, 'en');
    expect(de.some((f) => f.includes('6,99'))).toBe(true);
    expect(en.some((f) => f.includes('6.99'))).toBe(true);
    expect(en.some((f) => f === 'Manual')).toBe(true);
    expect(priceLabel({ price: 89900 } as never, 'en')).toMatch(/€|EUR/);
  });
});

describe('translation memory stub', () => {
  it('keeps DE source when no MT memory and does not invent copy', () => {
    const r = translateVehicleCopy('Solar, Markise, Lithium', 'en');
    expect(r.translated).toBe(false);
    expect(r.text).toBe('Solar, Markise, Lithium');
    expect(r.notice).toMatch(/not configured/i);
  });

  it('returns remembered EN when present', () => {
    tmRemember('Solar, Markise', 'Solar, awning');
    const r = translateVehicleCopy('Solar, Markise', 'en');
    expect(r.translated).toBe(true);
    expect(r.text).toBe('Solar, awning');
  });
});

describe('EN content helpers', () => {
  it('exposes EN FAQ and finder questions', () => {
    const faqs = faqsFor('en');
    expect(faqs[0]?.q).toMatch(/brands/i);
    expect(faqsFor('de')[0]?.q).toMatch(/Marken/);
    expect(finderQuestionsFor('en')[0]?.title).toMatch(/people/i);
  });

  it('routes EN pages via localizedPath', () => {
    expect(localizedPath('/vermietung-wohnmobile/', 'en')).toBe('/en/vermietung-wohnmobile/');
    expect(localizedPath('/camper-finder/', 'en')).toBe('/en/camper-finder/');
    expect(localizedPath('/marken/', 'en')).toBe('/en/marken/');
  });
});

describe('AI + opening hours EN', () => {
  it('answers EN rental intent in English', () => {
    const r = assistCamping('I want to rent a motorhome', 'en');
    expect(r.title).toMatch(/Rent/i);
    expect(r.summary).toMatch(/ADAC/i);
    expect(r.ctaHref).toMatch(/vermietung/);
  });

  it('short EN fallback is English', () => {
    const r = assistCamping('hi', 'en');
    expect(r.summary).toMatch(/specific/i);
  });

  it('computes EN open status labels on a known holiday', () => {
    // Neujahr 2026 10:00 Berlin ≈ 09:00 UTC
    const neujahr = new Date('2026-01-01T09:00:00Z');
    const s = computeOpenStatus(neujahr, undefined, 'en');
    expect(s.reason).toBe('holiday');
    expect(s.label).toMatch(/Closed for public holiday/i);
    expect(s.shortLabel).toMatch(/HOLIDAY/i);
    expect(s.label).not.toMatch(/Geschlossen wegen Feiertag/);
  });
});
