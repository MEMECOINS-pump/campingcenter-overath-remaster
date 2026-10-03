import { describe, expect, it } from 'vitest';
import { assistCamping } from '@/lib/camping-assist';

describe('assistCamping', () => {
  it('answers opening hours', () => {
    const r = assistCamping('Wann habt ihr geöffnet?');
    expect(r.title).toMatch(/Öffnung/i);
    expect(r.summary).toMatch(/Montag|07:00|Overath/i);
  });

  it('routes workshop questions', () => {
    const r = assistCamping('Meine Heizung zeigt Fehlercode E517');
    expect(r.title).toMatch(/Werkstatt/i);
    expect(r.disclaimer).toBeTruthy();
  });

  it('rejects off-topic prompts', () => {
    const r = assistCamping('Wie hoch steht der Bitcoin Kurs heute?');
    expect(r.offTopic).toBe(true);
    expect(r.summary).toMatch(/Camping/i);
  });

  it('helps with camper buying', () => {
    const r = assistCamping('Welches Wohnmobil passt zum Kaufen für die Familie?');
    expect(r.ctaHref).toMatch(/wohnmobile|camper-finder/);
  });
});
