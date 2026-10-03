import { describe, expect, it } from 'vitest';
import { assistCamping } from '@/lib/camping-assist';
import { findCatalogModel, getChallengerStock, isChallengerQuery } from '@/data/challenger-knowledge';

describe('challenger knowledge', () => {
  it('detects challenger queries', () => {
    expect(isChallengerQuery('Was ist ein Challenger 240?')).toBe(true);
    expect(isChallengerQuery('X250 Automatik')).toBe(true);
    expect(isChallengerQuery('Wann habt ihr geöffnet?')).toBe(false);
  });

  it('knows catalog dimensions for 240 and X250', () => {
    expect(findCatalogModel('Challenger 240')?.lengthM).toBe(7);
    expect(findCatalogModel('X250')?.seriesLabel).toMatch(/X/i);
  });

  it('loads stock from inventory', () => {
    expect(getChallengerStock().length).toBeGreaterThan(0);
  });

  it('answers challenger stock overview without workshop CTA', () => {
    const r = assistCamping('Erzähl mir von Challenger und was ihr im Bestand habt');
    expect(r.title).toMatch(/Challenger/i);
    expect(r.ctaHref).not.toMatch(/werkstatt/);
    expect(r.summary + (r.bullets?.join(' ') ?? '')).toMatch(/€|EUR|Bestand|Graphite|X250|240/i);
  });

  it('answers model-specific questions', () => {
    const r = assistCamping('Was kannst du zum Challenger 240 sagen?');
    expect(r.title).toMatch(/240/);
    expect(r.summary + (r.bullets?.join(' ') ?? '')).toMatch(/7|Länge|Teilintegriert|Ford/i);
  });

  it('answers warranty from manuals', () => {
    const r = assistCamping('Welche Garantie hat Challenger auf die Dichtheit?');
    expect(r.summary).toMatch(/7/);
    expect(r.summary).toMatch(/2/);
  });
});
