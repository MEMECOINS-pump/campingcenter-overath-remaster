import inventory from '@/data/inventory.json';
import { formatKm, formatLength, formatPrice, formatWeight } from './format';
import type { Locale } from '@/i18n/locales';
import { glossary, g, translateCategoryLabel, translateTransmission } from '@/i18n/glossary';
import type { BedSpec, Category, Condition, FilterableVehicle } from './filter';

export * from './filter';

export interface Vehicle extends FilterableVehicle {
  slug: string;
  title: string;
  model: string;
  categoryLabel: string;
  vatDeductible: boolean;
  firstRegistration: string | null;
  powerKw: number | null;
  powerPs: number | null;
  fuel: string | null;
  emissionClass: string | null;
  previousOwners: number | null;
  huUntil: string | null;
  color: string | null;
  modelYear: number | null;
  highlights: string[];
  images: string[];
  sourceUrl: string;
  /** Stable mapping to mobile.de / sync layer */
  sourceProvider: 'mobile.de' | 'fixture';
  sourceVehicleId: string;
  internalVehicleId: string;
  /** When this listing first appeared in our Bestand (not factory-new). */
  firstSeenAt: string | null;
}

export type { Category, Condition };

function seatsFromHighlights(highlights: string[]): number | null {
  for (const h of highlights) {
    const m = h.match(/(\d+)\s*Sitzer/i);
    if (m) return Number(m[1]);
  }
  return null;
}

type RawVehicle = Omit<
  Vehicle,
  'seats' | 'sleepingPlaces' | 'beds' | 'sourceProvider' | 'sourceVehicleId' | 'internalVehicleId' | 'firstSeenAt'
> & {
  seats?: number | null;
  sleepingPlaces?: number | null;
  beds?: BedSpec[];
  firstSeenAt?: string | null;
  id: string;
};

function normalizeVehicle(raw: RawVehicle): Vehicle {
  const seats = raw.seats ?? seatsFromHighlights(raw.highlights ?? []);
  return {
    ...raw,
    seats,
    sleepingPlaces: raw.sleepingPlaces ?? null,
    beds: raw.beds ?? [],
    sourceProvider: 'mobile.de',
    sourceVehicleId: String(raw.id),
    internalVehicleId: `mobile.de:${raw.id}`,
    firstSeenAt: raw.firstSeenAt ?? null,
  };
}

const RECENT_MS = 30 * 24 * 60 * 60 * 1000;

/** True when firstSeenAt is set and within the last 30 days (NEU IM BESTAND). */
export function isNewToInventory(v: Pick<Vehicle, 'firstSeenAt'>, now = Date.now()): boolean {
  if (!v.firstSeenAt) return false;
  const t = Date.parse(v.firstSeenAt);
  if (!Number.isFinite(t)) return false;
  const age = now - t;
  return age >= 0 && age <= RECENT_MS;
}

export interface RecentArrivalSet {
  vehicles: Vehicle[];
  /** Only true when firstSeenAt timestamps prove recent listing. */
  showNewBadge: boolean;
}

/**
 * Homepage spotlight. Prefers vehicles with reliable firstSeenAt.
 * Without dates: highest mobile.de ids as weak “current focus” – never shows NEU IM BESTAND.
 */
export function recentlyArrivedVehicles(limit = 4, now = Date.now()): RecentArrivalSet {
  const dated = vehicles
    .filter((v) => isNewToInventory(v, now))
    .sort((a, b) => Date.parse(b.firstSeenAt!) - Date.parse(a.firstSeenAt!));
  if (dated.length) return { vehicles: dated.slice(0, limit), showNewBadge: true };

  const fallback = [...vehicles].sort((a, b) => Number(b.id) - Number(a.id)).slice(0, limit);
  return { vehicles: fallback, showNewBadge: false };
}

export const inventorySource = inventory.source;
export const snapshotDate = inventory.snapshotDate;
export const vehicles: Vehicle[] = (inventory.vehicles as RawVehicle[]).map(normalizeVehicle);

export const getVehicle = (slug: string): Vehicle | undefined => vehicles.find((v) => v.slug === slug);

export type ImageSize = 360 | 640 | 1024 | 1600;
export const imageSizes: ImageSize[] = [360, 640, 1024, 1600];

/** mobile.de CDN renders these widths (AVIF/WebP negotiated via Accept header). */
export const vehicleImage = (imageId: string, width: ImageSize = 640): string =>
  `${inventory.imageBase}${imageId}?rule=mo-${width}`;

export const vehicleSrcset = (imageId: string, max: ImageSize = 1600): string =>
  imageSizes
    .filter((w) => w <= max)
    .map((w) => `${vehicleImage(imageId, w)} ${w}w`)
    .join(', ');

export interface SpecRow {
  key: string;
  label: string;
  value: string;
}

/** Only rows the listing actually provides; missing values are omitted, not guessed. */
export function specRows(v: Vehicle, lang: Locale = 'de'): SpecRow[] {
  const L = lang === 'en'
    ? {
        condition: 'Condition',
        category: 'Body type',
        modelYear: 'Model year',
        firstRegistration: 'First registration',
        mileage: 'Mileage',
        power: 'Power',
        fuel: 'Fuel',
        transmission: 'Transmission',
        length: 'Length',
        weight: 'Gross vehicle weight',
        emission: 'Emission class',
        owners: 'Previous owners',
        hu: 'MOT',
        color: 'Colour',
        neu: 'New vehicle',
        used: 'Used',
        onRequest: 'on request',
        huNew: 'new',
        huUntil: (d: string) => `until ${d}`,
      }
    : {
        condition: 'Zustand',
        category: 'Fahrzeugart',
        modelYear: 'Modelljahr',
        firstRegistration: 'Erstzulassung',
        mileage: 'Kilometerstand',
        power: 'Leistung',
        fuel: 'Kraftstoff',
        transmission: 'Getriebe',
        length: 'Länge',
        weight: 'Zul. Gesamtgewicht',
        emission: 'Schadstoffklasse',
        owners: 'Vorbesitzer',
        hu: 'HU',
        color: 'Farbe',
        neu: 'Neufahrzeug',
        used: 'Gebraucht',
        onRequest: 'auf Anfrage',
        huNew: 'neu',
        huUntil: (d: string) => `bis ${d}`,
      };
  const rows: (SpecRow | null)[] = [
    { key: 'condition', label: L.condition, value: v.condition === 'neu' ? L.neu : L.used },
    { key: 'category', label: L.category, value: translateCategoryLabel(v.categoryLabel, lang) },
    v.modelYear ? { key: 'modelYear', label: L.modelYear, value: String(v.modelYear) } : null,
    v.firstRegistration ? { key: 'firstRegistration', label: L.firstRegistration, value: v.firstRegistration } : null,
    v.mileageKm !== null ? { key: 'mileage', label: L.mileage, value: formatKm(v.mileageKm, lang) } : null,
    v.powerKw ? { key: 'power', label: L.power, value: `${v.powerKw} kW (${v.powerPs} PS)` } : null,
    v.fuel ? { key: 'fuel', label: L.fuel, value: v.fuel } : null,
    {
      key: 'transmission',
      label: L.transmission,
      value: translateTransmission(v.transmission, lang) ?? L.onRequest,
    },
    v.lengthMm ? { key: 'length', label: L.length, value: formatLength(v.lengthMm, lang) } : null,
    v.grossWeightKg ? { key: 'weight', label: L.weight, value: formatWeight(v.grossWeightKg, lang) } : null,
    v.emissionClass ? { key: 'emission', label: L.emission, value: v.emissionClass } : null,
    v.previousOwners !== null ? { key: 'owners', label: L.owners, value: String(v.previousOwners) } : null,
    v.huUntil ? { key: 'hu', label: L.hu, value: v.huUntil === 'neu' ? L.huNew : L.huUntil(v.huUntil) } : null,
    v.color ? { key: 'color', label: L.color, value: v.color } : null,
  ];
  return rows.filter((r): r is SpecRow => r !== null);
}

export function cardFacts(v: Vehicle, lang: Locale = 'de'): string[] {
  const cond =
    v.condition === 'neu'
      ? v.modelYear
        ? `${g(lang, glossary.condition.neu)} · ${g(lang, glossary.card.modelYear)} ${v.modelYear}`
        : g(lang, glossary.card.newVehicle)
      : v.firstRegistration
        ? `${g(lang, glossary.card.firstReg)} ${v.firstRegistration}`
        : g(lang, glossary.card.used);
  return [
    cond,
    v.mileageKm && v.mileageKm > 0 ? formatKm(v.mileageKm, lang) : null,
    v.lengthMm ? formatLength(v.lengthMm, lang) : null,
    translateTransmission(v.transmission, lang),
    v.powerPs ? `${v.powerPs} PS` : null,
  ].filter((x): x is string => Boolean(x));
}

export const priceLabel = (v: Vehicle, lang: Locale = 'de'): string => formatPrice(v.price, lang);

export function facetCounts<K extends keyof Vehicle>(list: Vehicle[], key: K): { value: string; count: number }[] {
  const map = new Map<string, number>();
  for (const v of list) {
    const raw = v[key];
    if (raw === null || raw === undefined) continue;
    const value = String(raw);
    map.set(value, (map.get(value) ?? 0) + 1);
  }
  return [...map.entries()].map(([value, count]) => ({ value, count })).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

/** Compact, serialisable record for client-side features (Merkliste, Vergleich, Finder). */
export interface VehicleLite extends FilterableVehicle {
  slug: string;
  title: string;
  model: string;
  categoryLabel: string;
  image: string | null;
  priceLabel: string;
  facts: string[];
  specs: SpecRow[];
}

export const toLite = (v: Vehicle, lang: Locale = 'de'): VehicleLite => ({
  id: v.id,
  slug: v.slug,
  title: v.title,
  model: v.model,
  make: v.make,
  condition: v.condition,
  category: v.category,
  categoryLabel: v.categoryLabel,
  transmission: v.transmission,
  grossWeightKg: v.grossWeightKg,
  price: v.price,
  lengthMm: v.lengthMm,
  mileageKm: v.mileageKm,
  seats: v.seats,
  sleepingPlaces: v.sleepingPlaces,
  beds: v.beds,
  image: v.images[0] ? vehicleImage(v.images[0], 640) : null,
  priceLabel: priceLabel(v, lang),
  facts: cardFacts(v, lang),
  specs: specRows(v),
});
