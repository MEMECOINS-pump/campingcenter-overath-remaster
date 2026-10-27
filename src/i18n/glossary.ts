import type { Locale } from './locales';

/** UI glossary for inventory filters, cards, and finder — labels only; never invent specs. */
export const glossary = {
  condition: {
    neu: { de: 'Neu', en: 'New' },
    gebraucht: { de: 'Gebraucht', en: 'Used' },
  },
  conditionFilter: {
    neu: { de: 'Neufahrzeuge', en: 'New vehicles' },
    gebraucht: { de: 'Gebrauchte', en: 'Used vehicles' },
  },
  category: {
    Alkoven: { de: 'Alkoven', en: 'Overcab' },
    Teilintegriert: { de: 'Teilintegriert', en: 'Semi-integrated' },
    Kastenwagen: { de: 'Kastenwagen', en: 'Camper van' },
    Vollintegriert: { de: 'Vollintegriert', en: 'Fully integrated' },
    Van: { de: 'Van', en: 'Van' },
  },
  transmission: {
    Schaltgetriebe: { de: 'Schaltgetriebe', en: 'Manual' },
    Automatik: { de: 'Automatik', en: 'Automatic' },
  },
  filter: {
    aria: { de: 'Fahrzeuge filtern', en: 'Filter vehicles' },
    condition: { de: 'Zustand', en: 'Condition' },
    category: { de: 'Fahrzeugart', en: 'Body type' },
    make: { de: 'Marke', en: 'Make' },
    weight: { de: 'Zulässiges Gesamtgewicht', en: 'Gross vehicle weight' },
    weightUnder35: { de: 'bis 3,5 t', en: 'up to 3.5 t' },
    weightUnder35Hint: { de: 'Führerschein Klasse B', en: 'Category B licence' },
    weightOver35: { de: 'über 3,5 t', en: 'over 3.5 t' },
    weightOver35Hint: { de: 'Klasse C1 oder alte Klasse 3', en: 'Category C1 or former class 3' },
    transmission: { de: 'Getriebe', en: 'Transmission' },
    priceUpTo: { de: 'Preis bis', en: 'Price up to' },
    lengthUpTo: { de: 'Länge bis', en: 'Length up to' },
    any: { de: 'Beliebig', en: 'Any' },
    reset: { de: 'Filter zurücksetzen', en: 'Reset filters' },
  },
  card: {
    factsAria: { de: 'Eckdaten', en: 'Key facts' },
    priceAria: { de: 'Preis:', en: 'Price:' },
    details: { de: 'Details ansehen', en: 'View details' },
    compare: { de: 'Vergleichen', en: 'Compare' },
    save: { de: 'merken', en: 'save' },
    imagesFollow: { de: 'Bilder folgen', en: 'Images coming soon' },
    newInStock: { de: 'NEU IM BESTAND', en: 'NEW IN STOCK' },
    vatDeductible: { de: 'MwSt. ausweisbar', en: 'VAT reclaimable' },
    exteriorAlt: { de: 'Außenansicht', en: 'exterior view' },
    newVehicle: { de: 'Neufahrzeug', en: 'New vehicle' },
    used: { de: 'Gebraucht', en: 'Used' },
    modelYear: { de: 'MJ', en: 'MY' },
    firstReg: { de: 'EZ', en: 'Reg.' },
  },
  finderUi: {
    next: { de: 'Weiter', en: 'Next' },
    showResults: { de: 'Empfehlungen zeigen', en: 'Show recommendations' },
    back: { de: 'Zurück', en: 'Back' },
    stepOf: { de: '{n} von {total}', en: '{n} of {total}' },
    resultsTitle: { de: 'Deine Empfehlungen', en: 'Your recommendations' },
    pickAnswer: { de: 'Bitte wähle eine Option.', en: 'Please choose an option.' },
    noExact: {
      de: 'Mit den aktuellen Angaben gab es keinen exakten Treffer. Wir beraten dich gern persönlich.',
      en: 'No exact match for these answers. We are happy to advise you in person.',
    },
    noExactBlocked: {
      de: 'Mit den aktuellen Angaben gab es keinen exakten Treffer (u. a. {reasons}). Wir beraten dich gern persönlich.',
      en: 'No exact match for these answers (incl. {reasons}). We are happy to advise you in person.',
    },
    whyLabel: { de: 'Warum dieses Fahrzeug?', en: 'Why this vehicle?' },
  },
} as const;

type GlossRow = { de: string; en: string };

export function g(lang: Locale, row: GlossRow): string {
  return row[lang] || row.de;
}

export function translateCategoryLabel(label: string, lang: Locale): string {
  const row = glossary.category[label as keyof typeof glossary.category];
  return row ? g(lang, row) : label;
}

export function translateTransmission(label: string | null | undefined, lang: Locale): string | null {
  if (!label) return null;
  const row = glossary.transmission[label as keyof typeof glossary.transmission];
  return row ? g(lang, row) : label;
}

export function translateCondition(condition: 'neu' | 'gebraucht', lang: Locale): string {
  return g(lang, glossary.condition[condition]);
}
