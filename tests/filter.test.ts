import { describe, expect, it } from 'vitest';
import {
  activeFilterCount,
  emptyFilters,
  filterVehicles,
  filtersToParams,
  paramsToFilters,
  runFinder,
  sortVehicles,
  weightClass,
  type FilterableVehicle,
} from '@/lib/filter';

const base: FilterableVehicle = {
  id: 'x',
  condition: 'neu',
  make: 'Knaus',
  category: 'teilintegriert',
  transmission: 'Schaltgetriebe',
  grossWeightKg: 3500,
  price: 70000,
  lengthMm: 6990,
  mileageKm: 10,
};
const v = (patch: Partial<FilterableVehicle>): FilterableVehicle => ({ ...base, ...patch });

const list = [
  v({ id: 'a', make: 'Knaus', price: 45000, category: 'kastenwagen', lengthMm: 5990, condition: 'gebraucht', mileageKm: 40000 }),
  v({ id: 'b', make: 'Challenger', price: 72000, grossWeightKg: 4250, lengthMm: 7400 }),
  v({ id: 'c', make: 'Eura Mobil', price: 89000, category: 'alkoven', transmission: 'Automatik', lengthMm: 6990 }),
  v({ id: 'd', make: 'Knaus', price: 61000, grossWeightKg: null, lengthMm: null }),
];

describe('weightClass', () => {
  it('splits at the class-B limit of 3.5 t', () => {
    expect(weightClass({ grossWeightKg: 3500 })).toBe('bis35');
    expect(weightClass({ grossWeightKg: 3501 })).toBe('ueber35');
    expect(weightClass({ grossWeightKg: null })).toBeNull();
  });
});

describe('filterVehicles', () => {
  it('returns everything without filters', () => {
    expect(filterVehicles(list, emptyFilters())).toHaveLength(4);
  });

  it('combines facets with AND and values within a facet with OR', () => {
    const f = { ...emptyFilters(), make: ['Knaus', 'Challenger'], condition: ['neu' as const] };
    expect(filterVehicles(list, f).map((x) => x.id)).toEqual(['b', 'd']);
  });

  it('excludes vehicles with unknown weight or length when those filters are set', () => {
    expect(filterVehicles(list, { ...emptyFilters(), weight: ['bis35'] }).map((x) => x.id)).toEqual(['a', 'c']);
    expect(filterVehicles(list, { ...emptyFilters(), lengthMax: 7000 }).map((x) => x.id)).toEqual(['a', 'c']);
  });

  it('applies the maximum price inclusively', () => {
    expect(filterVehicles(list, { ...emptyFilters(), priceMax: 61000 }).map((x) => x.id)).toEqual(['a', 'd']);
  });

  it('counts active filters', () => {
    expect(activeFilterCount({ ...emptyFilters(), make: ['Knaus'], priceMax: 1, category: ['alkoven', 'kastenwagen'] })).toBe(4);
  });
});

describe('sortVehicles', () => {
  it('sorts by price and length without mutating the input', () => {
    expect(sortVehicles(list, 'preis-auf').map((x) => x.id)).toEqual(['a', 'd', 'b', 'c']);
    expect(sortVehicles(list, 'preis-ab').map((x) => x.id)).toEqual(['c', 'b', 'd', 'a']);
    expect(sortVehicles(list, 'laenge-auf').map((x) => x.id)).toEqual(['a', 'c', 'b', 'd']);
    expect(list.map((x) => x.id)).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('URL state', () => {
  it('round-trips filters and sort order', () => {
    const f = { ...emptyFilters(), make: ['La Strada'], category: ['alkoven' as const], weight: ['ueber35' as const], priceMax: 80000 };
    const params = filtersToParams(f, 'preis-auf');
    expect(params.toString()).toBe('marke=La+Strada&art=alkoven&gewicht=ueber35&preis=80000&sortierung=preis-auf');
    expect(paramsToFilters(params)).toEqual({ filters: f, sort: 'preis-auf' });
  });

  it('ignores unknown or malformed values', () => {
    const { filters, sort } = paramsToFilters(new URLSearchParams('art=raumschiff&zustand=alt&preis=-5&sortierung=zufall'));
    expect(filters).toEqual(emptyFilters());
    expect(sort).toBe('empfohlen');
  });
});

describe('runFinder', () => {
  it('returns exact matches when possible', () => {
    const r = runFinder(list, { style: 'raum', condition: 'neu' });
    expect(r.exact).toBe(true);
    expect(r.results.map((x) => x.id)).toEqual(['c']);
    expect(r.relaxed).toEqual([]);
  });

  it('relaxes the least important constraints first and reports them', () => {
    const r = runFinder(list, { condition: 'gebraucht', budget: 'bis50', style: 'raum', length: '7+' });
    expect(r.exact).toBe(false);
    expect(r.results.map((x) => x.id)).toEqual(['a']);
    expect(r.relaxed).toEqual(['Fahrzeugart', 'Länge']);
  });

  it('treats "egal" as no constraint', () => {
    expect(runFinder(list, { weight: 'egal', budget: 'egal', length: 'egal', condition: 'egal', style: 'offen' }).results).toHaveLength(4);
  });
});
