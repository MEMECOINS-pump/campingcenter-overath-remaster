import { company, formatHours, openingHours } from '@/data/company';

export interface CampingAssistResult {
  title: string;
  summary: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  disclaimer?: string;
  provider: 'rules' | 'ai';
  offTopic?: boolean;
}

const hoursText = openingHours.map((p) => `${p.days}: ${formatHours(p)}`).join(' · ');

type TopicId =
  | 'verkauf'
  | 'finder'
  | 'vermietung'
  | 'ankauf'
  | 'werkstatt'
  | 'marken'
  | 'oeffnung'
  | 'kontakt'
  | 'camping-tipps';

type Topic = {
  id: TopicId;
  title: string;
  /** Higher weight = preferred when several topics match. */
  weight: number;
  patterns: RegExp[];
  summary: string;
  bullets?: string[];
  ctaLabel: string;
  ctaHref: string;
  disclaimer?: string;
};

const TOPICS: Topic[] = [
  {
    id: 'oeffnung',
    title: 'Öffnungszeiten & Feiertage',
    weight: 12,
    patterns: [
      /öffnungs|oeffnungs|geöffnet|geoeffnet|habt ihr offen|wann offen|geschlossen|feiertag|wann habt|uhrzeit|öffnungszeit/i,
    ],
    summary: `Unsere Zeiten: ${hoursText}. Sonntags und an gesetzlichen Feiertagen in NRW sind wir geschlossen.`,
    bullets: [
      `${company.address.street}, ${company.address.postalCode} ${company.address.city}`,
      `Telefon ${company.phone.display}`,
    ],
    ctaLabel: 'Kontakt & Anfahrt',
    ctaHref: '/kontakt/',
  },
  {
    id: 'vermietung',
    title: 'Wohnmobil mieten',
    weight: 11,
    patterns: [/mieten|mietwagen|vermiet|verleih|mietstation|\badac\b|urlaub mieten|camper mieten|wohnmobil mieten/i],
    summary:
      'Als ADAC-Mietstation Köln-Ost vermieten wir Wohnmobile für deinen Urlaub. Am besten mit Zeitraum und Personenzahl anfragen – dann finden wir die passende Klasse.',
    bullets: [`E-Mail: ${company.emails.rental}`, 'Beratung zu Größe, Ausstattung und Reisezeit'],
    ctaLabel: 'Zur Vermietung',
    ctaHref: '/vermietung-wohnmobile/',
  },
  {
    id: 'ankauf',
    title: 'Fahrzeug verkaufen / Ankauf',
    weight: 11,
    patterns: [/ankauf|ankaufen|inzahlung|mein (wohnmobil|camper|wohnwagen) verkaufen|fahrzeug verkaufen|bewertung.*fahrzeug|ankaufs/i],
    summary:
      'Wir kaufen Wohnmobile, Wohnwagen, Vans und Boote an. Mit Fotos und Angaben erhältst du in der Regel innerhalb von 24 Stunden ein unverbindliches Angebot.',
    bullets: ['Online-Formular mit Fotos', 'Optional Abholung & Abmeldung', 'Transparent und unverbindlich'],
    ctaLabel: 'Ankauf starten',
    ctaHref: '/wohnmobil-ankauf/',
  },
  {
    id: 'finder',
    title: 'Passenden Camper finden',
    weight: 10,
    patterns: [
      /finder|welcher camper|welches (wohnmobil|modell)|was passt|für \d person|personen|schlafplatz|bettlänge|bettlange|fahrzeuglänge|familie.*camper|camper.*familie/i,
    ],
    summary:
      'Sag uns grob Personen, Schlafplätze, Bettlänge und gewünschte Fahrzeuglänge – der Camper-Finder zeigt passende Modelle aus unserem Bestand.',
    bullets: ['Wenige kurze Fragen', 'Treffer aus dem aktuellen Bestand', 'Danach unverbindlich anfragen'],
    ctaLabel: 'Camper-Finder starten',
    ctaHref: '/camper-finder/',
  },
  {
    id: 'verkauf',
    title: 'Wohnmobil kaufen',
    weight: 9,
    patterns: [
      /kaufen|kaufinteresse|neu(fahrzeug|wagen)?|gebraucht|im bestand|preis|finanz|raten|welches wohnmobil kaufen|camper kaufen|wohnmobil suchen|fahrzeuge ansehen/i,
    ],
    summary:
      'Bei uns siehst du neue und gebrauchte Wohnmobile vor Ort – Challenger, LA STRADA, Eura Mobil und geprüfte Gebrauchte. Beratung von Campern für Camper, ohne Druck.',
    bullets: [
      'Bestand vor Ort in Overath ansehen',
      'Camper-Finder für die Vorauswahl',
      'Finanzierung und Inzahlungnahme möglich',
    ],
    ctaLabel: 'Fahrzeuge ansehen',
    ctaHref: '/wohnmobile/',
  },
  {
    id: 'marken',
    title: 'Marken & Partner',
    weight: 8,
    patterns: [/challenger|la\s*strada|eura\s*mobil|\beura\b|vertragspartner|konfigurator|markenpartner/i],
    summary:
      'Wir sind Vertragspartner von Challenger, LA STRADA und Eura Mobil. LA STRADA kannst du online konfigurieren und das Ergebnis bei uns anfragen.',
    bullets: ['Persönliche Beratung in Overath', 'Aktuelle Modelle im Bestand', 'LA STRADA Konfigurator'],
    ctaLabel: 'Marken ansehen',
    ctaHref: '/marken/',
  },
  {
    id: 'kontakt',
    title: 'Kontakt & Anfahrt',
    weight: 8,
    patterns: [/kontakt|anfahr|adresse|telefon|anrufen|route planen|wo seid ihr|e-?mail schreiben|nachricht schreiben/i],
    summary: `Campingcenter Overath, ${company.address.street}, ${company.address.postalCode} ${company.address.city}. Tel. ${company.phone.display}, E-Mail ${company.email}.`,
    bullets: ['Persönliche Beratung vor Ort', 'Route und Karte auf der Kontaktseite'],
    ctaLabel: 'Zur Kontaktseite',
    ctaHref: '/kontakt/',
  },
  {
    id: 'camping-tipps',
    title: 'Camping-Wissen',
    weight: 6,
    patterns: [
      /alkoven|teilintegriert|vollintegriert|kastenwagen|\bvan\b|führerschein|fuehrerschein|\bb96\b|zuladung|stellplatz|wintercamping|campingplatz|bauform|reisemobil tipp/i,
    ],
    summary:
      'Praxis-Tipp: Wichtig sind Personen, Schlafplätze, Bettlänge, Länge, Zuladung und Führerschein. Wir helfen dir, daraus das passende Fahrzeug im Bestand zu machen.',
    bullets: [
      'Kastenwagen/Van: wendig, oft Klasse B',
      'Teilintegriert: starker Alltagskompromiss',
      'Alkoven: viel Platz für Familien',
    ],
    ctaLabel: 'Camper-Finder starten',
    ctaHref: '/camper-finder/',
  },
  {
    id: 'werkstatt',
    title: 'Werkstatt & Service',
    weight: 5,
    // Only clear repair / workshop intent – not generic “solar”, “service”, “battery” in a buying context
    patterns: [
      /werkstatt|reparatur|kundendienst|termin.*werkstatt|werkstatt.*termin/i,
      /heizung.*(defekt|kaputt|geht nicht|fehler)|truma|fehlercode|e5\d{2}/i,
      /n[aä]sse(schaden)?|undicht|schimmel|gfk|unfallschaden/i,
      /gasprüfung|tüv|tuv|\bhu\b|\bsp\b|dichtigkeit/i,
      /(batterie|solar|elektro).*(defekt|kaputt|problem|ladet nicht)|ladeger/i,
    ],
    summary:
      'Unsere Fachwerkstatt hilft bei Prüfung, Technik, Nässe- und GFK-Schäden. Beschreib kurz das Problem – wir ordnen es ein und finden einen Termin. Keine Ferndiagnose.',
    bullets: ['HU/SP, Gas- und Dichtigkeitsprüfung', 'Heizung, Elektro, Wasser, Fahrwerk', 'Nässe- & GFK-Reparatur'],
    ctaLabel: 'Werkstatt-Termin anfragen',
    ctaHref: '/werkstatt-kundendienst/#termin',
    disclaimer: 'Keine verbindliche Ferndiagnose – Prüfung erfolgt vor Ort.',
  },
];

const OFF_TOPIC =
  /politik|wahl|crypto|aktie|bitcoin|hack|waffe|drog|medizin|rezept|sex|porno|gambling|casino|chatgpt jailbreak|ignore previous/i;

function scoreTopic(text: string, topic: Topic): number {
  let hits = 0;
  for (const p of topic.patterns) {
    if (p.test(text)) hits += 1;
  }
  if (!hits) return 0;
  return hits * topic.weight;
}

function pickTopic(text: string): Topic {
  let best: Topic | null = null;
  let bestScore = 0;
  for (const topic of TOPICS) {
    const score = scoreTopic(text, topic);
    if (score > bestScore) {
      best = topic;
      bestScore = score;
    }
  }
  if (best) return best;

  // Camping-related but no sharp intent → Verkauf/Beratung, never Werkstatt by default
  return {
    id: 'verkauf',
    title: 'Wie kann ich helfen?',
    weight: 1,
    patterns: [],
    summary:
      'Am Campingcenter Overath geht’s um Wohnmobile: kaufen, mieten, Ankauf, Markenberatung oder Werkstatt. Sag mir kurz, was du brauchst – dann leite ich dich passend weiter.',
    bullets: ['Wohnmobil kaufen / finden', 'Mieten (ADAC)', 'Ankauf deines Fahrzeugs', 'Öffnungszeiten & Kontakt'],
    ctaLabel: 'Fahrzeuge ansehen',
    ctaHref: '/wohnmobile/',
  };
}

/**
 * Camping-only assistant for Campingcenter Overath.
 * Intent-based: Kauf, Miete, Ankauf, Öffnung, … – Werkstatt only on clear repair intent.
 */
export function assistCamping(message: string): CampingAssistResult {
  const text = message.trim();
  if (text.length < 4) {
    return {
      title: 'Kurze Frage',
      summary: 'Schreib kurz, worum es geht – z. B. kaufen, mieten, Ankauf, Öffnungszeiten oder ein Werkstatt-Problem.',
      ctaLabel: 'Fahrzeuge ansehen',
      ctaHref: '/wohnmobile/',
      provider: 'rules',
    };
  }

  if (OFF_TOPIC.test(text) || !isCampingRelated(text)) {
    return {
      title: 'Nur Camping-Themen',
      summary:
        'Ich bleibe bei Camping & Campingcenter Overath: Fahrzeuge kaufen oder mieten, Ankauf, Marken, Öffnungszeiten und Werkstatt-Fragen.',
      bullets: ['Verkauf & Camper-Finder', 'Vermietung (ADAC)', 'Ankauf', 'Öffnung & Kontakt', 'Werkstatt bei Defekten'],
      ctaLabel: 'Fahrzeuge entdecken',
      ctaHref: '/wohnmobile/',
      provider: 'rules',
      offTopic: true,
    };
  }

  const hit = pickTopic(text);
  return {
    title: hit.title,
    summary: hit.summary,
    ...(hit.bullets ? { bullets: hit.bullets } : {}),
    ctaLabel: hit.ctaLabel,
    ctaHref: hit.ctaHref,
    ...(hit.disclaimer ? { disclaimer: hit.disclaimer } : {}),
    provider: 'rules',
  };
}

function isCampingRelated(text: string): boolean {
  if (TOPICS.some((t) => scoreTopic(text, t) > 0)) return true;
  return /camping|camper|wohnmobil|wohnwagen|reisemobil|overath|ccoverath|stellplatz|urlaub|mieten|kaufen|ankauf|van|alkoven|marke|öffnung|oeffnung|kontakt|beratung/i.test(
    text,
  );
}

export const CAMPING_QUICK_PROMPTS = [
  { label: 'Kaufen', text: 'Ich suche ein passendes Wohnmobil zum Kaufen.' },
  { label: 'Mieten', text: 'Ich möchte ein Wohnmobil mieten.' },
  { label: 'Ankauf', text: 'Ich möchte mein Wohnmobil verkaufen / anbieten.' },
  { label: 'Öffnung', text: 'Wann habt ihr heute geöffnet?' },
] as const;
