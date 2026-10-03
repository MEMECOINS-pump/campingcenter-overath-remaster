import type { Category, Condition, Env, NormalizedVehicle } from '../types';
import { ProviderError, type InventoryProvider } from './types';

/**
 * Authorized mobile.de Search / Ad-Integration adapter.
 * Requires dealer/API credentials from mobile.de (HTTP Basic).
 * Docs: https://services.mobile.de/manual/search-api.html
 *
 * Never scrapes public HTML pages.
 */
export class MobileDeProvider implements InventoryProvider {
  readonly name = 'mobile.de';

  constructor(private readonly env: Env) {}

  async fetchActive(): Promise<NormalizedVehicle[]> {
    const user = this.env.MOBILE_DE_API_USER?.trim();
    const pass = this.env.MOBILE_DE_API_PASSWORD?.trim();
    const sellerKey = this.env.MOBILE_DE_SELLER_KEY?.trim();
    if (!user || !pass || !sellerKey) {
      throw new ProviderError('mobile.de credentials not configured', 'auth');
    }

    const url = new URL('https://services.mobile.de/search-api/search');
    url.searchParams.set('customerNumber.seller', sellerKey);
    url.searchParams.set('page.size', '100');

    const auth = btoa(`${user}:${pass}`);
    let res: Response;
    try {
      res = await fetch(url, {
        headers: {
          Accept: 'application/vnd.de.mobile.api+json',
          Authorization: `Basic ${auth}`,
        },
      });
    } catch (cause) {
      throw new ProviderError('mobile.de network failure', 'unavailable', cause);
    }

    if (res.status === 401 || res.status === 403) {
      throw new ProviderError('mobile.de authentication failed', 'auth');
    }
    if (res.status === 429) {
      throw new ProviderError('mobile.de rate limit', 'rate_limit');
    }
    if (!res.ok) {
      throw new ProviderError(`mobile.de HTTP ${res.status}`, 'unavailable');
    }

    const payload = (await res.json()) as MobileSearchResponse;
    const ads = payload.ads ?? payload.results ?? [];
    if (!ads.length) {
      throw new ProviderError('mobile.de returned empty inventory', 'empty');
    }

    const now = new Date().toISOString();
    return ads.map((ad) => mapAd(ad, now)).filter((v): v is NormalizedVehicle => v !== null);
  }
}

interface MobileSearchResponse {
  ads?: MobileAd[];
  results?: MobileAd[];
}

interface MobileAd {
  mobileAdId?: string | number;
  id?: string | number;
  creationDate?: string;
  modificationDate?: string;
  vehicle?: {
    make?: string;
    model?: string;
    modelDescription?: string;
    category?: string;
    condition?: string;
    mileage?: number;
    firstRegistration?: string;
    power?: number;
    fuel?: string;
    gearbox?: string;
    exteriorColor?: string;
    numberOfPreviousOwners?: number;
    seats?: number;
    cubicCapacity?: number;
    emissionClass?: string;
  };
  price?: { consumerPriceAmount?: number; vatRate?: number };
  images?: { uri?: string; url?: string }[];
  detailPageUrl?: string;
  attributes?: Record<string, string | number | boolean | null | undefined>;
}

function mapAd(ad: MobileAd, now: string): NormalizedVehicle | null {
  const sourceId = String(ad.mobileAdId ?? ad.id ?? '').trim();
  if (!sourceId) return null;
  const v = ad.vehicle ?? {};
  const make = (v.make ?? '').trim() || 'Unbekannt';
  const model = (v.modelDescription ?? v.model ?? '').trim() || make;
  const title = `${make} ${model}`.trim();
  const category = mapCategory(v.category);
  const condition = mapCondition(v.condition);
  const attrs = ad.attributes ?? {};
  const lengthMm = num(attrs.lengthMm ?? attrs.length);
  const widthMm = num(attrs.widthMm ?? attrs.width);
  const heightMm = num(attrs.heightMm ?? attrs.height);
  const seats = num(attrs.seats ?? v.seats);
  const sleepingPlaces = num(attrs.sleepingPlaces ?? attrs.berths);
  const powerKw = num(v.power);

  return {
    internalVehicleId: `mobile.de:${sourceId}`,
    sourceProvider: 'mobile.de',
    sourceVehicleId: sourceId,
    lastSyncedAt: now,
    sourceUpdatedAt: ad.modificationDate ?? ad.creationDate ?? null,
    syncStatus: lengthMm || seats || sleepingPlaces ? 'ok' : 'incomplete',
    lifecycle: 'active',
    slug: slugify(`${make}-${model}-${sourceId}`),
    title,
    make,
    model,
    modelVariant: v.model ?? null,
    category,
    categoryLabel: categoryLabel(category),
    condition,
    price: num(ad.price?.consumerPriceAmount),
    vatDeductible: ad.price?.vatRate != null ? ad.price.vatRate > 0 : null,
    mileageKm: num(v.mileage),
    firstRegistration: v.firstRegistration ?? null,
    modelYear: null,
    engine: v.cubicCapacity ? `${v.cubicCapacity} cm³` : null,
    fuel: v.fuel ?? null,
    transmission: v.gearbox ?? null,
    powerKw,
    powerPs: powerKw != null ? Math.round(powerKw * 1.35962) : null,
    lengthMm,
    widthMm,
    heightMm,
    grossWeightKg: num(attrs.grossWeightKg ?? attrs.weight),
    seats,
    sleepingPlaces,
    beds: [],
    equipment: [],
    description: null,
    highlights: [],
    images: (ad.images ?? []).map((i) => i.uri ?? i.url ?? '').filter(Boolean),
    availability: 'available',
    location: 'Overath',
    dealerName: 'Campingcenter Overath',
    sourceUrl: ad.detailPageUrl ?? `https://suchen.mobile.de/fahrzeuge/details.html?id=${sourceId}`,
    emissionClass: v.emissionClass ?? null,
    previousOwners: num(v.numberOfPreviousOwners),
    huUntil: null,
    color: v.exteriorColor ?? null,
  };
}

function mapCategory(raw?: string): Category {
  const s = (raw ?? '').toLowerCase();
  if (s.includes('alkoven')) return 'alkoven';
  if (s.includes('kasten') || s.includes('van') || s.includes('campervan')) return 'kastenwagen';
  if (s.includes('voll')) return 'vollintegriert';
  if (s.includes('teil')) return 'teilintegriert';
  return 'sonstige';
}

function mapCondition(raw?: string): Condition {
  const s = (raw ?? '').toLowerCase();
  return s.includes('new') || s.includes('neu') ? 'neu' : 'gebraucht';
}

function categoryLabel(c: Category): string {
  return (
    {
      alkoven: 'Alkoven',
      teilintegriert: 'Teilintegriert',
      kastenwagen: 'Kastenwagen',
      vollintegriert: 'Vollintegriert',
      sonstige: 'Sonstige',
    } as const
  )[c];
}

function num(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}
