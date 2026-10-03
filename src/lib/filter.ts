/**
 * Pure filter / sort / finder logic. Shared by build-time rendering, the client-side
 * showroom and the unit tests – deliberately free of data imports so the browser
 * bundle stays small.
 */

export type Condition = 'neu' | 'gebraucht';
export type Category = 'alkoven' | 'teilintegriert' | 'kastenwagen' | 'vollintegriert' | 'sonstige';
export type WeightClass = 'bis35' | 'ueber35';
export type BedType =
  | 'einzelbetten'
  | 'doppelbett'
  | 'queensbett'
  | 'hubbett'
  | 'etagenbett'
  | 'querbett'
  | 'laengsbett'
  | 'sonstige';

export interface BedSpec {
  type: BedType;
  lengthMm: number | null;
  widthMm: number | null;
  label: string | null;
}

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
  seats: number | null;
  sleepingPlaces: number | null;
  beds: BedSpec[];
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

export const maxBedLengthMm = (v: Pick<FilterableVehicle, 'beds'>): number | null => {
  const lengths = v.beds.map((b) => b.lengthMm).filter((n): n is number => typeof n === 'number' && n > 0);
  return lengths.length ? Math.max(...lengths) : null;
};

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

/* ---------- Camping Finder ---------- */

export type BedLengthChoice = 'any' | 'lt190' | 'min190' | 'min195' | 'min200' | 'gt200';
export type LengthMaxChoice = '6' | '6.5' | '7' | '7.5' | 'any';
export type PersonsChoice = '1' | '2' | '3' | '4' | '5plus';

export interface FinderAnswers {
  persons?: PersonsChoice | undefined;
  seats?: PersonsChoice | 'any' | undefined;
  sleeps?: PersonsChoice | undefined;
  bedType?: BedType | 'any' | undefined;
  bedLength?: BedLengthChoice | undefined;
  lengthMax?: LengthMaxChoice | undefined;
  transmission?: 'Schaltgetriebe' | 'Automatik' | 'any' | undefined;
  budget?: 'bis50' | '50-80' | '80+' | 'any' | undefined;
  condition?: Condition | 'any' | undefined;
  style?: 'kompakt' | 'komfort' | 'raum' | 'offen' | undefined;
}

export interface MatchReason {
  label: string;
  ok: boolean;
}

export interface FinderMatch<T extends FilterableVehicle> {
  vehicle: T;
  score: number;
  reasons: MatchReason[];
  needsConfirmation: boolean;
}

const personsToMin = (p?: PersonsChoice | 'any'): number | null => {
  if (!p || p === 'any') return null;
  if (p === '5plus') return 5;
  return Number(p);
};

const bedLengthMinMm = (c?: BedLengthChoice): number | null => {
  switch (c) {
    case 'lt190':
      return null; // soft preference only
    case 'min190':
      return 1900;
    case 'min195':
      return 1950;
    case 'min200':
      return 2000;
    case 'gt200':
      return 2001;
    default:
      return null;
  }
};

const lengthMaxMm = (c?: LengthMaxChoice): number | null => {
  switch (c) {
    case '6':
      return 6000;
    case '6.5':
      return 6500;
    case '7':
      return 7000;
    case '7.5':
      return 7500;
    default:
      return null;
  }
};

const styleCategories: Record<NonNullable<FinderAnswers['style']>, Category[]> = {
  kompakt: ['kastenwagen'],
  komfort: ['teilintegriert', 'vollintegriert'],
  raum: ['alkoven'],
  offen: [],
};

function hardPass<T extends FilterableVehicle>(v: T, a: FinderAnswers): { ok: boolean; needsConfirmation: boolean; reasons: MatchReason[] } {
  const reasons: MatchReason[] = [];
  let needsConfirmation = false;

  const minSleeps = personsToMin(a.sleeps);
  if (minSleeps !== null) {
    if (v.sleepingPlaces == null) {
      needsConfirmation = true;
      reasons.push({ label: 'Schlafplätze bitte bestätigen lassen', ok: false });
    } else if (v.sleepingPlaces < minSleeps) {
      return { ok: false, needsConfirmation, reasons };
    } else {
      reasons.push({ label: `${v.sleepingPlaces} Schlafplätze`, ok: true });
    }
  }

  const minSeats = personsToMin(a.seats === 'any' ? undefined : a.seats) ?? personsToMin(a.persons);
  if (minSeats !== null) {
    if (v.seats == null) {
      needsConfirmation = true;
      reasons.push({ label: 'Sitzplätze bitte bestätigen lassen', ok: false });
    } else if (v.seats < minSeats) {
      return { ok: false, needsConfirmation, reasons };
    } else {
      reasons.push({ label: `${v.seats} Sitzplätze`, ok: true });
    }
  }

  const maxLen = lengthMaxMm(a.lengthMax);
  if (maxLen !== null) {
    if (v.lengthMm == null) {
      needsConfirmation = true;
      reasons.push({ label: 'Fahrzeuglänge bitte bestätigen lassen', ok: false });
    } else if (v.lengthMm > maxLen) {
      return { ok: false, needsConfirmation, reasons };
    } else {
      reasons.push({ label: 'Fahrzeuglänge innerhalb deiner Auswahl', ok: true });
    }
  }

  const minBed = bedLengthMinMm(a.bedLength);
  if (minBed !== null) {
    const bed = maxBedLengthMm(v);
    if (bed == null) {
      // Strict: do not pretend match when bed length unknown
      return { ok: false, needsConfirmation: true, reasons: [...reasons, { label: 'Bettlänge nicht belegt – ausgeschlossen', ok: false }] };
    }
    if (bed < minBed) return { ok: false, needsConfirmation, reasons };
    reasons.push({ label: `Bettlänge mindestens ${(minBed / 10).toFixed(0)} cm`.replace('200.1', '200'), ok: true });
  }

  if (a.budget && a.budget !== 'any') {
    const [min, max] = a.budget === 'bis50' ? [0, 50000] : a.budget === '50-80' ? [50000, 80000] : [80000, Infinity];
    if (v.price < min || v.price > max) return { ok: false, needsConfirmation, reasons };
    reasons.push({ label: 'passt zu deinem Budget', ok: true });
  }

  if (a.condition && a.condition !== 'any') {
    if (v.condition !== a.condition) return { ok: false, needsConfirmation, reasons };
    reasons.push({ label: a.condition === 'neu' ? 'Neufahrzeug' : 'Gebrauchtfahrzeug', ok: true });
  }

  return { ok: true, needsConfirmation, reasons };
}

function softScore<T extends FilterableVehicle>(v: T, a: FinderAnswers): { score: number; reasons: MatchReason[] } {
  let score = 0;
  const reasons: MatchReason[] = [];

  if (a.bedType && a.bedType !== 'any') {
    if (v.beds.some((b) => b.type === a.bedType)) {
      score += 3;
      reasons.push({ label: 'gewünschte Bettform', ok: true });
    } else if (!v.beds.length) {
      // unknown – no false credit
    }
  }

  if (a.transmission && a.transmission !== 'any') {
    if (v.transmission === a.transmission) {
      score += 2;
      reasons.push({ label: `Getriebe: ${a.transmission}`, ok: true });
    }
  }

  if (a.style && styleCategories[a.style].length) {
    if (styleCategories[a.style].includes(v.category)) {
      score += 2;
      reasons.push({ label: 'passt zu deinem Reisestil', ok: true });
    }
  }

  if (a.lengthMax === 'any' && v.lengthMm != null) score += 0.5;
  if (v.price > 0) score += 0.25;
  return { score, reasons };
}

export function runCampingFinder<T extends FilterableVehicle>(
  list: T[],
  a: FinderAnswers,
): { exact: FinderMatch<T>[]; blockedBy: string[]; hasExact: boolean } {
  const exact: FinderMatch<T>[] = [];
  for (const vehicle of list) {
    const hard = hardPass(vehicle, a);
    if (!hard.ok) continue;
    const soft = softScore(vehicle, a);
    exact.push({
      vehicle,
      score: soft.score + (hard.needsConfirmation ? -1 : 2),
      reasons: [...hard.reasons.filter((r) => r.ok), ...soft.reasons],
      needsConfirmation: hard.needsConfirmation,
    });
  }
  exact.sort((x, y) => y.score - x.score || x.vehicle.price - y.vehicle.price);

  const blockedBy: string[] = [];
  if (a.sleeps) blockedBy.push('Schlafplätze');
  if (a.bedLength && a.bedLength !== 'any' && a.bedLength !== 'lt190') blockedBy.push('Bettlänge');
  if (a.lengthMax && a.lengthMax !== 'any') blockedBy.push('Fahrzeuglänge');
  if (a.budget && a.budget !== 'any') blockedBy.push('Budget');

  return { exact: exact.slice(0, 6), blockedBy, hasExact: exact.length > 0 };
}

/** @deprecated use runCampingFinder – kept for older tests during migration */
export interface LegacyFinderAnswers {
  style?: 'kompakt' | 'komfort' | 'raum' | 'offen' | undefined;
  weight?: WeightClass | 'egal' | undefined;
  length?: '5-6' | '6-7' | '7+' | 'egal' | undefined;
  budget?: 'bis50' | '50-80' | '80+' | 'egal' | undefined;
  condition?: Condition | 'egal' | undefined;
}

export function runFinder<T extends FilterableVehicle>(
  list: T[],
  a: LegacyFinderAnswers,
): { exact: boolean; results: T[]; relaxed: string[] } {
  const mapped: FinderAnswers = {
    style: a.style,
    budget: a.budget === 'egal' ? 'any' : a.budget,
    condition: a.condition === 'egal' ? 'any' : a.condition,
    lengthMax: a.length === '5-6' ? '6' : a.length === '6-7' ? '7' : a.length === '7+' ? 'any' : 'any',
  };
  let pool = list;
  if (a.style && styleCategories[a.style].length) {
    pool = list.filter((v) => styleCategories[a.style!].includes(v.category));
  }
  const { exact, blockedBy } = runCampingFinder(pool, mapped);
  if (exact.length) return { exact: true, results: exact.map((m) => m.vehicle), relaxed: [] };
  // legacy soft fallback: ignore style if empty
  if (a.style && styleCategories[a.style].length) {
    const relaxed = runCampingFinder(list, { ...mapped, style: 'offen' });
    if (relaxed.exact.length) {
      return { exact: false, results: relaxed.exact.map((m) => m.vehicle), relaxed: ['Fahrzeugart'] };
    }
  }
  return { exact: false, results: [], relaxed: blockedBy };
}
