/**
 * Pure filter / sort / finder logic. Shared by build-time rendering, the client-side
 * showroom and the unit tests – deliberately free of data imports so the browser
 * bundle stays small.
 */

export type Condition = 'neu' | 'gebraucht';
export type Category = 'alkoven' | 'teilintegriert' | 'kastenwagen' | 'vollintegriert' | 'sonstige';
export type WeightClass = 'bis35' | 'ueber35';

export interface FilterableVehicle {
  id: string;
  condition: Condition;
  make: string;
  category: Category;
  transmission: string | null;
  grossWeightKg: number | null;
  price: number;
  lengthMm: number | null;
  mileageKm: number | null;
}

export interface FilterState {
  condition: Condition[];
  make: string[];
  category: Category[];
  transmission: string[];
  weight: WeightClass[];
  priceMax: number | null;
  lengthMax: number | null;
}

export const emptyFilters = (): FilterState => ({
  condition: [],
  make: [],
  category: [],
  transmission: [],
  weight: [],
  priceMax: null,
  lengthMax: null,
});

export const weightClass = (v: Pick<FilterableVehicle, 'grossWeightKg'>): WeightClass | null =>
  v.grossWeightKg === null ? null : v.grossWeightKg <= 3500 ? 'bis35' : 'ueber35';

export function matches(v: FilterableVehicle, f: FilterState): boolean {
  if (f.condition.length && !f.condition.includes(v.condition)) return false;
  if (f.make.length && !f.make.includes(v.make)) return false;
  if (f.category.length && !f.category.includes(v.category)) return false;
  if (f.transmission.length && !(v.transmission && f.transmission.includes(v.transmission))) return false;
  if (f.weight.length) {
    const w = weightClass(v);
    if (!w || !f.weight.includes(w)) return false;
  }
  if (f.priceMax !== null && v.price > f.priceMax) return false;
  if (f.lengthMax !== null && (v.lengthMm === null || v.lengthMm > f.lengthMax)) return false;
  return true;
}

export const filterVehicles = <T extends FilterableVehicle>(list: T[], f: FilterState): T[] => list.filter((v) => matches(v, f));

export const activeFilterCount = (f: FilterState): number =>
  f.condition.length + f.make.length + f.category.length + f.transmission.length + f.weight.length + (f.priceMax !== null ? 1 : 0) + (f.lengthMax !== null ? 1 : 0);

export type SortKey = 'empfohlen' | 'preis-auf' | 'preis-ab' | 'km-auf' | 'laenge-auf';
export const sortKeys: SortKey[] = ['empfohlen', 'preis-auf', 'preis-ab', 'km-auf', 'laenge-auf'];

export function sortVehicles<T extends FilterableVehicle>(list: T[], key: SortKey): T[] {
  const copy = [...list];
  switch (key) {
    case 'preis-auf':
      return copy.sort((a, b) => a.price - b.price);
    case 'preis-ab':
      return copy.sort((a, b) => b.price - a.price);
    case 'km-auf':
      return copy.sort((a, b) => (a.mileageKm ?? 0) - (b.mileageKm ?? 0));
    case 'laenge-auf':
      return copy.sort((a, b) => (a.lengthMm ?? Infinity) - (b.lengthMm ?? Infinity));
    default:
      return copy;
  }
}

/* ---------- URL (de)serialisation – German, human-readable query keys ---------- */

const listKeys = { condition: 'zustand', make: 'marke', category: 'art', transmission: 'getriebe', weight: 'gewicht' } as const;

export function filtersToParams(f: FilterState, sort: SortKey): URLSearchParams {
  const p = new URLSearchParams();
  for (const [field, key] of Object.entries(listKeys) as [keyof typeof listKeys, string][]) {
    for (const value of f[field]) p.append(key, value);
  }
  if (f.priceMax !== null) p.set('preis', String(f.priceMax));
  if (f.lengthMax !== null) p.set('laenge', String(f.lengthMax));
  if (sort !== 'empfohlen') p.set('sortierung', sort);
  return p;
}

export function paramsToFilters(p: URLSearchParams): { filters: FilterState; sort: SortKey } {
  const f = emptyFilters();
  f.condition = p.getAll(listKeys.condition).filter((x): x is Condition => x === 'neu' || x === 'gebraucht');
  f.make = p.getAll(listKeys.make);
  f.category = p
    .getAll(listKeys.category)
    .filter((x): x is Category => ['alkoven', 'teilintegriert', 'kastenwagen', 'vollintegriert', 'sonstige'].includes(x));
  f.transmission = p.getAll(listKeys.transmission);
  f.weight = p.getAll(listKeys.weight).filter((x): x is WeightClass => x === 'bis35' || x === 'ueber35');
  const price = Number(p.get('preis'));
  f.priceMax = Number.isFinite(price) && price > 0 ? price : null;
  const length = Number(p.get('laenge'));
  f.lengthMax = Number.isFinite(length) && length > 0 ? length : null;
  const s = p.get('sortierung') as SortKey | null;
  return { filters: f, sort: s && sortKeys.includes(s) ? s : 'empfohlen' };
}

/* ---------- Camper-Finder ---------- */

export interface FinderAnswers {
  style?: 'kompakt' | 'komfort' | 'raum' | 'offen' | undefined;
  weight?: WeightClass | 'egal' | undefined;
  length?: '5-6' | '6-7' | '7+' | 'egal' | undefined;
  budget?: 'bis50' | '50-80' | '80+' | 'egal' | undefined;
  condition?: Condition | 'egal' | undefined;
}

const styleCategories: Record<NonNullable<FinderAnswers['style']>, Category[]> = {
  kompakt: ['kastenwagen'],
  komfort: ['teilintegriert', 'vollintegriert'],
  raum: ['alkoven'],
  offen: [],
};

interface Constraint<T> {
  label: string;
  test: (v: T) => boolean;
}

/** Each answer becomes a constraint, ordered from most to least important. */
export function finderConstraints<T extends FilterableVehicle>(a: FinderAnswers): Constraint<T>[] {
  const c: Constraint<T>[] = [];
  if (a.condition && a.condition !== 'egal') {
    const cond = a.condition;
    c.push({ label: cond === 'neu' ? 'Neufahrzeug' : 'Gebraucht', test: (v) => v.condition === cond });
  }
  if (a.budget && a.budget !== 'egal') {
    const [min, max] = a.budget === 'bis50' ? [0, 50000] : a.budget === '50-80' ? [50000, 80000] : [80000, Infinity];
    c.push({ label: 'Budget', test: (v) => v.price >= min && v.price <= max });
  }
  if (a.weight && a.weight !== 'egal') {
    const w = a.weight;
    c.push({ label: w === 'bis35' ? 'bis 3,5 t' : 'über 3,5 t', test: (v) => weightClass(v) === w });
  }
  if (a.style && styleCategories[a.style].length) {
    const cats = styleCategories[a.style];
    c.push({ label: 'Fahrzeugart', test: (v) => cats.includes(v.category) });
  }
  if (a.length && a.length !== 'egal') {
    const [min, max] = a.length === '5-6' ? [5000, 6000] : a.length === '6-7' ? [6000, 7000] : [7000, Infinity];
    c.push({ label: 'Länge', test: (v) => (v.lengthMm ?? 0) >= min && (v.lengthMm ?? 0) <= max });
  }
  return c;
}

/** If nothing matches, constraints are relaxed from the least important one – and we say which. */
export function runFinder<T extends FilterableVehicle>(list: T[], a: FinderAnswers): { exact: boolean; results: T[]; relaxed: string[] } {
  const constraints = finderConstraints<T>(a);
  for (let drop = 0; drop <= constraints.length; drop++) {
    const active = constraints.slice(0, constraints.length - drop);
    const results = list.filter((v) => active.every((c) => c.test(v)));
    if (results.length) {
      return { exact: drop === 0, results, relaxed: constraints.slice(constraints.length - drop).map((c) => c.label) };
    }
  }
  return { exact: false, results: [], relaxed: constraints.map((c) => c.label) };
}
