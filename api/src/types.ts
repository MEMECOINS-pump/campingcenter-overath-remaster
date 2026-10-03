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

export type ReportStatus = 'pending' | 'reported' | 'failed';

export interface FinderLead {
  id: string;
  createdAt: string;
  reportStatus: ReportStatus;
  reportedAt: string | null;
  retryCount: number;
  lastError: string | null;
  name: string;
  email: string;
  phone: string;
  answers: Record<string, unknown>;
  recommendedVehicleIds: string[];
  sourcePage: string;
}

export interface Env {
  STORE: KVNamespace;
  PUBLIC_SITE_ORIGIN: string;
  PUBLIC_SITE_BASE: string;
  FINDER_REPORT_TO: string;
  RENTAL_MAIL_TO: string;
  WORKSHOP_MAIL_TO: string;
  MOBILE_DE_SELLER_KEY: string;
  MOBILE_DE_API_USER?: string;
  MOBILE_DE_API_PASSWORD?: string;
  MAIL_HOST?: string;
  MAIL_PORT?: string;
  MAIL_USER?: string;
  MAIL_PASSWORD?: string;
  MAIL_FROM?: string;
  AI_API_KEY?: string;
  AI_API_BASE?: string;
  LASTRADA_API_KEY?: string;
  CORS_ORIGINS?: string;
}
