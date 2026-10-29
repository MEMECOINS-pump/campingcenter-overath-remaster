import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { vehicles } from '@/lib/vehicles';
import { brands } from '@/data/brands';
import { company } from '@/data/company';
import { jobs } from '@/data/jobs';
import { serviceGroups } from '@/data/services';
import { tourScenes } from '@/data/tour';

describe('inventory', () => {
  it('has unique ids and slugs', () => {
    expect(new Set(vehicles.map((v) => v.id)).size).toBe(vehicles.length);
    expect(new Set(vehicles.map((v) => v.slug)).size).toBe(vehicles.length);
  });

  it('only contains complete, plausible listings', () => {
    for (const v of vehicles) {
      expect(v.price, v.slug).toBeGreaterThan(1000);
      expect(v.images.length, v.slug).toBeGreaterThan(0);
      expect(v.slug).toMatch(/^[a-z0-9-]+$/);
      expect(v.sourceUrl).toMatch(/^https:\/\/(suchen|home)\.mobile\.de\//);
    }
  });

  it('only lists new vehicles of brands we are a dealer for', () => {
    const known = new Set(brands.map((b) => b.inventoryMake).filter(Boolean));
    const unknown = vehicles.filter((v) => v.condition === 'neu' && !known.has(v.make)).map((v) => v.make);
    expect(unknown).toEqual([]);
  });
});

describe('content', () => {
  it('uses the verified company contact data', () => {
    expect(company.phone.href).toBe('tel:+492206951310');
    expect(company.email).toBe('service@ccoverath.de');
    expect(company.address.postalCode).toBe('51491');
  });

  it('keeps the workshop anchors stable', () => {
    expect(serviceGroups.map((g) => g.id)).toEqual(['pruefung', 'reparatur', 'technik', 'komfort', 'fahrwerk']);
  });

  it('keeps job slugs identical to the original URLs', () => {
    expect(jobs.map((j) => j.slug)).toEqual(['rechnungswesen', 'reinigungskraft']);
  });

  it('ships every panorama and thumbnail', () => {
    for (const s of tourScenes) {
      expect(existsSync(`public/${s.src}`), s.src).toBe(true);
      expect(existsSync(`public/${s.thumb}`), s.thumb).toBe(true);
    }
  });
});
