/**
 * Challenger knowledge for the Camping-KI.
 * Sources (dealer PDFs on Desktop, extracted 2026-10-03):
 * - 2024/2025 Challenger service & dimension tables (Trigano VDL)
 * - 2025 Vans / Integral / Profiles manuals & supplements
 * - Live stock snapshot: src/data/inventory.json
 *
 * Never invent exact prices beyond inventory; catalog dims are manufacturer figures.
 */

import inventory from '@/data/inventory.json';

export interface ChallengerStockItem {
  slug: string;
  title: string;
  model: string;
  categoryLabel: string;
  condition: string;
  price: number;
  lengthM: number | null;
  firstRegistration: string | null;
  mileageKm: number | null;
  transmission: string | null;
  highlights: string[];
}

export interface ChallengerCatalogModel {
  code: string;
  series: 'alkoven' | 'teilintegriert' | 'van' | 'x' | 's' | 'integral';
  seriesLabel: string;
  base: 'Fiat' | 'Ford' | 'Fiat/Ford';
  /** Manufacturer table length in meters (approx., without ladder). */
  lengthM?: number;
  widthM?: number;
  heightM?: number;
  note?: string;
}

/** Product families – user-friendly overview. */
export const challengerFamilies = [
  {
    id: 'vans',
    label: 'Vans / Kastenwagen',
    blurb: 'Kompakt, wendig, oft ideal für Paare und Führerschein B – viel Fahrspaß, weniger „Haus auf Rädern“.',
  },
  {
    id: 'teilintegriert',
    label: 'Teilintegrierte (Profiles)',
    blurb: 'Der Allrounder: gutes Raumgefühl, feste Betten oder Hubbett, starker Alltagskompromiss für Paare und Familien.',
  },
  {
    id: 'x',
    label: 'Gamme X',
    blurb: 'Sportlich-moderne Teilintegrierte auf Fiat – z. B. X250/X260, oft mit starker Ausstattung und Automatik-Optionen.',
  },
  {
    id: 'alkoven',
    label: 'Alkoven',
    blurb: 'Klassiker mit Bett über dem Fahrerhaus – viel Schlafplatz, beliebt bei Familien (z. B. C256).',
  },
  {
    id: 'integral',
    label: 'Vollintegrierte (Integral)',
    blurb: 'Panorama-Fahrerhaus und großzügiges Wohngefühl – mehr Komfort auf Reisen, etwas größer und hochwertiger.',
  },
] as const;

/**
 * Dimension snapshot from Challenger DE Hauptabmessungen table (Collection 2024).
 * A = Gesamtlänge, B = Breite, C = Höhe (ohne Dachgalerie) – Herstellerangaben.
 */
export const challengerCatalogModels: ChallengerCatalogModel[] = [
  { code: 'C256', series: 'alkoven', seriesLabel: 'Alkoven', base: 'Ford', lengthM: 6.0, widthM: 2.75, heightM: 3.1 },
  { code: 'C387', series: 'alkoven', seriesLabel: 'Alkoven', base: 'Fiat', lengthM: 5.97, widthM: 2.77, heightM: 3.1 },
  { code: 'X150', series: 'x', seriesLabel: 'Gamme X', base: 'Fiat', lengthM: 7.0, widthM: 2.77, heightM: 3.1 },
  { code: 'X250', series: 'x', seriesLabel: 'Gamme X', base: 'Fiat', lengthM: 7.4, widthM: 2.77, heightM: 3.1 },
  { code: 'S194', series: 's', seriesLabel: 'Gamme S', base: 'Fiat', lengthM: 6.0, widthM: 2.49, heightM: 2.8 },
  { code: 'S215', series: 's', seriesLabel: 'Gamme S', base: 'Ford', lengthM: 6.36, widthM: 2.49, heightM: 2.8 },
  { code: 'S217', series: 's', seriesLabel: 'Gamme S', base: 'Ford', lengthM: 6.0, widthM: 2.48, heightM: 2.8 },
  { code: '240', series: 'teilintegriert', seriesLabel: 'Teilintegriert', base: 'Ford', lengthM: 7.0, widthM: 2.75, heightM: 2.89 },
  { code: '250', series: 'teilintegriert', seriesLabel: 'Teilintegriert', base: 'Ford', lengthM: 6.4, widthM: 2.75, heightM: 2.89 },
  { code: '260', series: 'teilintegriert', seriesLabel: 'Teilintegriert', base: 'Ford', lengthM: 7.0, widthM: 2.75, heightM: 2.89 },
  { code: '270', series: 'teilintegriert', seriesLabel: 'Teilintegriert', base: 'Ford', lengthM: 7.0, widthM: 2.75, heightM: 2.89 },
  { code: '287GA', series: 'teilintegriert', seriesLabel: 'Teilintegriert', base: 'Ford', lengthM: 7.0, widthM: 2.75, heightM: 2.89 },
  { code: '328', series: 'teilintegriert', seriesLabel: 'Teilintegriert', base: 'Ford', lengthM: 7.2, widthM: 2.75, heightM: 2.89 },
  { code: '337', series: 'teilintegriert', seriesLabel: 'Teilintegriert', base: 'Ford', lengthM: 7.2, widthM: 2.75, heightM: 2.89 },
  { code: '380', series: 'teilintegriert', seriesLabel: 'Teilintegriert', base: 'Ford', lengthM: 7.2, widthM: 2.75, heightM: 2.89 },
  { code: '384', series: 'teilintegriert', seriesLabel: 'Teilintegriert', base: 'Fiat', lengthM: 7.17, widthM: 2.77, heightM: 2.92 },
];

export const challengerWarranty = {
  buildYears: 2,
  watertightYears: 7,
  mileageLimit: 'ohne Kilometerbegrenzung',
  start: 'ab 1. Zulassung (sonst Liefer-/Rechnungsdatum)',
  notes: [
    'Aufbau-Garantie über Trigano VDL / Challenger – Basisfahrzeug (Fiat/Ford) hat eigene Herstellergarantie.',
    'Garantiearbeiten nur im zugelassenen Händlernetz – z. B. bei uns als Vertragspartner.',
    'Jährliche Dichtigkeits-/Wartungskontrollen laut Serviceheft sind Pflicht für den vollen Garantieanspruch.',
    'Hochdruckreiniger und scharfe Reiniger können Garantieansprüche gefährden.',
    'Optionen (Markise, Solar, Motorradträger …) zählen zur Nutzlast – Achslasten und zGG beachten.',
  ],
} as const;

export const challengerTips = [
  'Nutzlast prüfen: Zubehör und Optionen reduzieren die verfügbare Zuladung – wir rechnen das gerne mit dir durch.',
  'Winter: bei Heizbetrieb ist der Frischwassertank besser geschützt; bei längerer Pause Batterie pflegen und belüften.',
  'Graphite / Ultimate / Arctic / Start Edition sind Ausstattungspakete – wir erklären den Unterschied am Fahrzeug.',
  'Vor dem Kauf: Bettlänge, Sitzplätze laut Fahrzeugbrief und gewünschte Länge realistisch festlegen.',
] as const;

const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

export function getChallengerStock(): ChallengerStockItem[] {
  const vehicles = (inventory as { vehicles: Record<string, unknown>[] }).vehicles ?? [];
  return vehicles
    .filter((v) => String(v.make ?? '').toLowerCase() === 'challenger')
    .map((v) => {
      const lengthMm = typeof v.lengthMm === 'number' ? v.lengthMm : null;
      return {
        slug: String(v.slug ?? ''),
        title: String(v.title ?? ''),
        model: String(v.model ?? ''),
        categoryLabel: String(v.categoryLabel ?? v.category ?? ''),
        condition: String(v.condition ?? ''),
        price: Number(v.price ?? 0),
        lengthM: lengthMm ? Math.round((lengthMm / 1000) * 100) / 100 : null,
        firstRegistration: v.firstRegistration ? String(v.firstRegistration) : null,
        mileageKm: typeof v.mileageKm === 'number' ? v.mileageKm : null,
        transmission: v.transmission ? String(v.transmission) : null,
        highlights: Array.isArray(v.highlights) ? v.highlights.map(String) : [],
      };
    })
    .sort((a, b) => a.price - b.price);
}

export function formatChallengerPrice(price: number): string {
  return euro.format(price);
}

export function findCatalogModel(query: string): ChallengerCatalogModel | null {
  const q = query.toUpperCase().replace(/\s+/g, '');
  // Prefer longer codes first (X250 before 250, C256 before 256)
  const sorted = [...challengerCatalogModels].sort((a, b) => b.code.length - a.code.length);
  for (const m of sorted) {
    const code = m.code.toUpperCase();
    if (new RegExp(`(^|[^A-Z0-9])${code}([^A-Z0-9]|$)`, 'i').test(query)) return m;
    if (q.includes(code)) return m;
  }
  // X260 not in 2024 table – treat as Gamme X sibling of X250
  if (/\bX260\b/i.test(query)) {
    return {
      code: 'X260',
      series: 'x',
      seriesLabel: 'Gamme X',
      base: 'Fiat',
      note: 'Aktuelle Gamme-X-Weiterentwicklung – Details und Exklusiv-Ausstattung zeigen wir dir vor Ort.',
    };
  }
  if (/\b317\b/.test(query)) {
    return {
      code: '317',
      series: 'teilintegriert',
      seriesLabel: 'Teilintegriert',
      base: 'Ford',
      note: 'Längerer Teilintegrierter mit Hubbett-Option – im Bestand oft als Ultimate-Paket.',
    };
  }
  return null;
}

export function findStockForQuery(query: string): ChallengerStockItem[] {
  const stock = getChallengerStock();
  const q = query.toLowerCase();
  const model = findCatalogModel(query);
  if (model) {
    const code = model.code.toLowerCase();
    const hit = stock.filter((s) => s.model.toLowerCase().includes(code) || s.title.toLowerCase().includes(code));
    if (hit.length) return hit;
  }
  if (/graphite/.test(q)) return stock.filter((s) => /graphite/i.test(s.title));
  if (/ultimate/.test(q)) return stock.filter((s) => /ultimate/i.test(s.title));
  if (/arctic/.test(q)) return stock.filter((s) => /arctic/i.test(s.title));
  if (/alkoven/.test(q)) return stock.filter((s) => /alkoven/i.test(s.categoryLabel));
  if (/van|kastenwagen/.test(q)) return stock.filter((s) => /van|kasten/i.test(s.categoryLabel));
  return stock;
}

export function isChallengerQuery(text: string): boolean {
  if (/challenger|trigano|gamme\s*[xs]/i.test(text)) return true;
  if (/\b(c256|c387|x150|x250|x260|287ga)\b/i.test(text)) return true;
  // Bare model numbers only with camping/Challenger context (avoid random "240")
  if (
    /\b(240|250|260|270|317|328|337|380|384)\b/.test(text) &&
    /wohnmobil|camper|reisemobil|teilintegriert|alkoven|graphite|ultimate|arctic|markise|challenger/i.test(text)
  ) {
    return true;
  }
  return /graphite|ultimate edition/i.test(text) && /wohnmobil|camper|challenger|overath/i.test(text);
}
