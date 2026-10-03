/**
 * Normalized vehicle model – frontend and API share this shape.
 * Source of truth is the authorized mobile.de inventory; never invent missing specs.
 */

export type VehicleLifecycle = 'active' | 'inactive' | 'removed' | 'sold';
export type SyncStatus = 'ok' | 'stale' | 'incomplete' | 'invalid';
export type Condition = 'neu' | 'gebraucht';
export type Category = 'alkoven' | 'teilintegriert' | 'kastenwagen' | 'vollintegriert' | 'sonstige';

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

export interface NormalizedVehicle {
  internalVehicleId: string;
  sourceProvider: 'mobile.de' | 'fixture';
  sourceVehicleId: string;
  lastSyncedAt: string;
  sourceUpdatedAt: string | null;
  syncStatus: SyncStatus;
  lifecycle: VehicleLifecycle;

  slug: string;
  title: string;
  make: string;
  model: string;
  modelVariant: string | null;
  category: Category;
  categoryLabel: string;
  condition: Condition;

  price: number | null;
  vatDeductible: boolean | null;
  mileageKm: number | null;
  firstRegistration: string | null;
  modelYear: number | null;

  engine: string | null;
  fuel: string | null;
  transmission: string | null;
  powerKw: number | null;
  powerPs: number | null;

  lengthMm: number | null;
  widthMm: number | null;
  heightMm: number | null;
  grossWeightKg: number | null;

  seats: number | null;
  sleepingPlaces: number | null;
  beds: BedSpec[];

  equipment: string[];
  description: string | null;
  highlights: string[];
  images: string[];
  availability: string | null;
  location: string | null;
  dealerName: string | null;
  sourceUrl: string;

  emissionClass: string | null;
  previousOwners: number | null;
  huUntil: string | null;
  color: string | null;
}

export interface SyncLogEntry {
  id: string;
  startedAt: string;
  completedAt: string | null;
  provider: string;
  imported: number;
  updated: number;
  unchanged: number;
  removed: number;
  invalid: number;
  errors: string[];
  success: boolean;
  lastSuccessfulSyncAt: string | null;
}

export const MISSING_LABEL = 'Auf Anfrage';

/** Public-facing value or neutral missing state – never guess. */
export function displayOrAsk(value: string | number | null | undefined, format?: (n: number) => string): string {
  if (value === null || value === undefined || value === '') return MISSING_LABEL;
  if (typeof value === 'number') return format ? format(value) : String(value);
  return value;
}

export function maxBedLengthMm(beds: BedSpec[]): number | null {
  const lengths = beds.map((b) => b.lengthMm).filter((n): n is number => typeof n === 'number' && n > 0);
  return lengths.length ? Math.max(...lengths) : null;
}

export function hasBedType(beds: BedSpec[], type: BedType): boolean {
  return beds.some((b) => b.type === type);
}
