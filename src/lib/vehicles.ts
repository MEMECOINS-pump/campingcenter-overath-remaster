import inventory from '@/data/inventory.json';
import { formatKm, formatLength, formatPrice, formatWeight } from './format';
import type { Category, Condition, FilterableVehicle } from './filter';

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
}

export type { Category, Condition };

export const inventorySource = inventory.source;
export const snapshotDate = inventory.snapshotDate;
export const vehicles = inventory.vehicles as Vehicle[];

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
export function specRows(v: Vehicle): SpecRow[] {
  const rows: (SpecRow | null)[] = [
    { key: 'condition', label: 'Zustand', value: v.condition === 'neu' ? 'Neufahrzeug' : 'Gebraucht' },
    { key: 'category', label: 'Fahrzeugart', value: v.categoryLabel },
    v.modelYear ? { key: 'modelYear', label: 'Modelljahr', value: String(v.modelYear) } : null,
    v.firstRegistration ? { key: 'firstRegistration', label: 'Erstzulassung', value: v.firstRegistration } : null,
    v.mileageKm !== null ? { key: 'mileage', label: 'Kilometerstand', value: formatKm(v.mileageKm) } : null,
    v.powerKw ? { key: 'power', label: 'Leistung', value: `${v.powerKw} kW (${v.powerPs} PS)` } : null,
    v.fuel ? { key: 'fuel', label: 'Kraftstoff', value: v.fuel } : null,
    { key: 'transmission', label: 'Getriebe', value: v.transmission ?? 'auf Anfrage' },
    v.lengthMm ? { key: 'length', label: 'Länge', value: formatLength(v.lengthMm) } : null,
    v.grossWeightKg ? { key: 'weight', label: 'Zul. Gesamtgewicht', value: formatWeight(v.grossWeightKg) } : null,
    v.emissionClass ? { key: 'emission', label: 'Schadstoffklasse', value: v.emissionClass } : null,
    v.previousOwners !== null ? { key: 'owners', label: 'Vorbesitzer', value: String(v.previousOwners) } : null,
    v.huUntil ? { key: 'hu', label: 'HU', value: v.huUntil === 'neu' ? 'neu' : `bis ${v.huUntil}` } : null,
    v.color ? { key: 'color', label: 'Farbe', value: v.color } : null,
  ];
  return rows.filter((r): r is SpecRow => r !== null);
}

export function cardFacts(v: Vehicle): string[] {
  return [
    v.condition === 'neu' ? (v.modelYear ? `Neu · MJ ${v.modelYear}` : 'Neufahrzeug') : v.firstRegistration ? `EZ ${v.firstRegistration}` : 'Gebraucht',
    v.mileageKm && v.mileageKm > 0 ? formatKm(v.mileageKm) : null,
    v.lengthMm ? formatLength(v.lengthMm) : null,
    v.transmission ?? null,
    v.powerPs ? `${v.powerPs} PS` : null,
  ].filter((x): x is string => Boolean(x));
}

export const priceLabel = (v: Vehicle): string => formatPrice(v.price);

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

export const toLite = (v: Vehicle): VehicleLite => ({
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
  image: v.images[0] ? vehicleImage(v.images[0], 640) : null,
  priceLabel: priceLabel(v),
  facts: cardFacts(v),
  specs: specRows(v),
});
