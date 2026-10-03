import { describe, expect, it } from 'vitest';
import {
  activeFilterCount,
  emptyFilters,
  filterVehicles,
  filtersToParams,
  paramsToFilters,
  runCampingFinder,
  runFinder,
  sortVehicles,
  weightClass,
  type FilterableVehicle,
} from '@/lib/filter';

const base: FilterableVehicle = {
  id: 'x',
  condition: 'neu',
  make: 'Challenger',
  category: 'teilintegriert',
  transmission: 'Schaltgetriebe',
  grossWeightKg: 3500,
  price: 70000,
  lengthMm: 6990,
  mileageKm: 10,
  seats: 4,
  sleepingPlaces: 4,
  beds: [{ type: 'doppelbett', lengthMm: 2000, widthMm: 1400, label: 'Heckdoppelbett' }],
};
const v = (patch: Partial<FilterableVehicle>): FilterableVehicle => ({ ...base, ...patch });

const list = [
  v({
    id: 'a',
    make: 'Challenger',
    price: 45000,
    category: 'kastenwagen',
    lengthMm: 5990,
    condition: 'gebraucht',
    mileageKm: 40000,
    seats: 4,
    sleepingPlaces: 2,
    beds: [{ type: 'einzelbetten', lengthMm: 1900, widthMm: 700, label: null }],
  }),
  v({ id: 'b', make: 'Challenger', price: 72000, grossWeightKg: 4250, lengthMm: 7400, seats: 4, sleepingPlaces: 4 }),
  v({
    id: 'c',
    make: 'Eura Mobil',
    price: 89000,
    category: 'alkoven',
    transmission: 'Automatik',
    lengthMm: 6990,
    seats: 6,
    sleepingPlaces: 6,
    beds: [{ type: 'etagenbett', lengthMm: 1950, widthMm: 800, label: null }],
  }),
  v({
    id: 'd',
    make: 'La Strada',
    price: 61000,
    grossWeightKg: null,
    lengthMm: null,
    seats: null,
    sleepingPlaces: null,
    beds: [],
  }),
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
    const f = { ...emptyFilters(), make: ['Challenger', 'Eura Mobil'], condition: ['neu' as const] };
    expect(filterVehicles(list, f).map((x) => x.id)).toEqual(['b', 'c']);
  });

  it('excludes vehicles with unknown weight or length when those filters are set', () => {
    expect(filterVehicles(list, { ...emptyFilters(), weight: ['bis35'] }).map((x) => x.id)).toEqual(['a', 'c']);
    expect(filterVehicles(list, { ...emptyFilters(), lengthMax: 7000 }).map((x) => x.id)).toEqual(['a', 'c']);
  });

  it('applies the maximum price inclusively', () => {
    expect(filterVehicles(list, { ...emptyFilters(), priceMax: 61000 }).map((x) => x.id)).toEqual(['a', 'd']);
  });

  it('counts active filters', () => {
    expect(activeFilterCount({ ...emptyFilters(), make: ['Challenger'], priceMax: 1, category: ['alkoven', 'kastenwagen'] })).toBe(4);
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

describe('runCampingFinder', () => {
  it('matches hard constraints with explainable reasons', () => {
    const r = runCampingFinder(list, { sleeps: '4', lengthMax: '7.5', bedLength: 'min195', budget: '80+', condition: 'neu' });
    expect(r.hasExact).toBe(true);
    expect(r.exact.map((m) => m.vehicle.id)).toEqual(['c']);
    expect(r.exact[0]?.reasons.some((x) => x.label.includes('Schlafplätze'))).toBe(true);
  });

  it('excludes vehicles when required bed length is unknown', () => {
    const r = runCampingFinder(list, { bedLength: 'min190', lengthMax: 'any', budget: 'any', condition: 'any' });
    expect(r.exact.every((m) => m.vehicle.id !== 'd')).toBe(true);
  });

  it('returns empty exact set instead of fake matches', () => {
    const r = runCampingFinder(list, { sleeps: '5plus', bedLength: 'gt200', lengthMax: '6', budget: 'bis50' });
    expect(r.hasExact).toBe(false);
    expect(r.exact).toHaveLength(0);
  });
});

describe('runFinder legacy bridge', () => {
  it('still returns style-based matches', () => {
    const r = runFinder(list, { style: 'raum', condition: 'neu' });
    expect(r.exact).toBe(true);
    expect(r.results.map((x) => x.id)).toEqual(['c']);
  });
});
