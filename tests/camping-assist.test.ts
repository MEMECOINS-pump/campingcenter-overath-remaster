import { describe, expect, it } from 'vitest';
import { assistCamping } from '@/lib/camping-assist';

describe('assistCamping', () => {
  it('answers opening hours without workshop CTA', () => {
    const r = assistCamping('Wann habt ihr geöffnet?');
    expect(r.title).toMatch(/Öffnung/i);
    expect(r.ctaHref).toMatch(/kontakt/);
    expect(r.ctaHref).not.toMatch(/werkstatt/);
  });

  it('routes buying questions to sales', () => {
    const r = assistCamping('Ich suche ein Wohnmobil zum Kaufen');
    expect(r.ctaHref).toMatch(/wohnmobile|camper-finder/);
    expect(r.ctaHref).not.toMatch(/werkstatt/);
  });

  it('routes rental questions to rental', () => {
    const r = assistCamping('Ich möchte ein Wohnmobil mieten');
    expect(r.ctaHref).toMatch(/vermietung/);
  });

  it('routes ankauf correctly', () => {
    const r = assistCamping('Ich möchte mein Wohnmobil verkaufen');
    expect(r.ctaHref).toMatch(/ankauf/);
  });

  it('does not send generic camping questions to workshop', () => {
    const r = assistCamping('Was ist der Unterschied zwischen Alkoven und Kastenwagen?');
    expect(r.ctaHref).not.toMatch(/werkstatt/);
  });

  it('does not treat solar packing as workshop by default', () => {
    const r = assistCamping('Habt ihr Wohnmobile mit Solar zum Kaufen?');
    expect(r.ctaHref).not.toMatch(/werkstatt/);
    expect(r.ctaHref).toMatch(/wohnmobile|camper-finder/);
  });

  it('routes clear workshop faults to workshop', () => {
    const r = assistCamping('Meine Heizung geht nicht und zeigt Fehlercode E517');
    expect(r.ctaHref).toMatch(/werkstatt/);
    expect(r.disclaimer).toBeTruthy();
  });

  it('rejects off-topic prompts', () => {
    const r = assistCamping('Wie hoch steht der Bitcoin Kurs heute?');
    expect(r.offTopic).toBe(true);
    expect(r.ctaHref).not.toMatch(/werkstatt/);
  });
});
