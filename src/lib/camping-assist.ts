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

type Topic = {
  id: string;
  title: string;
  patterns: RegExp[];
  summary: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  disclaimer?: string;
};

const TOPICS: Topic[] = [
  {
    id: 'verkauf',
    title: 'Wohnmobil kaufen',
    patterns: [/kauf|verkauf|neu|gebraucht|bestand|fahrzeug|preis|finanz|angebot|welches wohnmobil|camper finden|marke/i],
    summary:
      'Beim Campingcenter Overath findest du neue und gebrauchte Wohnmobile vor Ort – mit ehrlicher Beratung von Campern für Camper.',
    bullets: [
      'Vertragspartner: Challenger, LA STRADA und Eura Mobil',
      'Gebrauchte Fahrzeuge geprüft und transparent erklärt',
      'Camper-Finder hilft bei Länge, Betten und Ausstattung',
    ],
    ctaLabel: 'Fahrzeuge ansehen',
    ctaHref: '/wohnmobile/',
  },
  {
    id: 'finder',
    title: 'Camper-Finder',
    patterns: [/finder|welcher camper|welches modell|passend|personen|schlafplatz|bettlänge|bettlange|fahrzeuglänge/i],
    summary:
      'Mit dem Camper-Finder filterst du in wenigen Fragen passende Wohnmobile nach Personen, Schlafplätzen, Bettlänge und Fahrzeuglänge.',
    bullets: ['Kurze Fragen', 'Treffer aus dem aktuellen Bestand', 'Danach unverbindlich anfragen'],
    ctaLabel: 'Camper-Finder starten',
    ctaHref: '/camper-finder/',
  },
  {
    id: 'vermietung',
    title: 'Wohnmobil mieten',
    patterns: [/miet|verleih|urlaub|reise|adac|mieten|vermiet/i],
    summary:
      'Wir sind ADAC-Mietstation Köln-Ost. Für die Vermietung beraten wir dich zu Fahrzeugklasse, Zeitraum und Ausstattung.',
    bullets: [
      'Anfragen am besten mit Reisezeitraum und Personenzahl',
      'E-Mail Vermietung: ' + company.emails.rental,
    ],
    ctaLabel: 'Zur Vermietung',
    ctaHref: '/vermietung-wohnmobile/',
  },
  {
    id: 'ankauf',
    title: 'Fahrzeug verkaufen / Ankauf',
    patterns: [/ankauf|verkaufen|inzahlung|ankaufen|mein wohnmobil verkaufen|bewertung/i],
    summary:
      'Wir kaufen Wohnmobile, Wohnwagen, Vans und Boote an – mit fairer Bewertung und Angebot in der Regel innerhalb von 24 Stunden.',
    bullets: ['Online-Formular mit Fotos', 'Auf Wunsch Abholung und Abmeldung', 'Unverbindlich und transparent'],
    ctaLabel: 'Ankauf starten',
    ctaHref: '/wohnmobil-ankauf/',
  },
  {
    id: 'werkstatt',
    title: 'Werkstatt & Service',
    patterns: [
      /werkstatt|reparatur|heizung|truma|batter|solar|nässe|naesse|feucht|undicht|gfk|unfall|tüv|tuv|gasprüfung|service|fehlercode|e5\d{2}/i,
    ],
    summary:
      'Unsere Fachwerkstatt kümmert sich um Wohnmobile und Wohnwagen – von Prüfung über Technik bis Nässe- und GFK-Schäden. Keine Ferndiagnose: Wir ordnen dein Anliegen ein und vereinbaren einen Termin.',
    bullets: [
      'Sicherheitscheck mit Siegel, Gasprüfung, HU/SP',
      'Heizung, Elektro, Solar, Wasser, Fahrwerk',
      'Nässe- und GFK-Reparaturen',
    ],
    ctaLabel: 'Werkstatt-Termin anfragen',
    ctaHref: '/werkstatt-kundendienst/#termin',
    disclaimer: 'Keine verbindliche Ferndiagnose – die genaue Ursache prüft ein Techniker vor Ort.',
  },
  {
    id: 'marken',
    title: 'Marken & Partner',
    patterns: [/challenger|la\s*strada|eura|marke|vertragspartner|hersteller|konfigurator/i],
    summary:
      'Offizielle Vertragspartner: Challenger, LA STRADA und Eura Mobil. Für LA STRADA gibt es zusätzlich den Konfigurator mit anschließender Angebotsanfrage bei uns.',
    bullets: ['Persönliche Beratung in Overath', 'Aktuelle Modelle und Ausstattungen', 'LA STRADA online konfigurieren'],
    ctaLabel: 'Marken ansehen',
    ctaHref: '/marken/',
  },
  {
    id: 'oeffnung',
    title: 'Öffnungszeiten & Feiertage',
    patterns: [/öffnungs|oeffnungs|geöffnet|geoeffnet|offen|geschlossen|feiertag|wann habt|uhrzeit|samstag|sonntag/i],
    summary: `Unsere Öffnungszeiten (Europe/Berlin): ${hoursText}. Sonntags und an gesetzlichen Feiertagen in NRW haben wir geschlossen.`,
    bullets: [
      'Adresse: ' + `${company.address.street}, ${company.address.postalCode} ${company.address.city}`,
      'Telefon: ' + company.phone.display,
    ],
    ctaLabel: 'Kontakt & Anfahrt',
    ctaHref: '/kontakt/',
  },
  {
    id: 'kontakt',
    title: 'Kontakt & Anfahrt',
    patterns: [/kontakt|anfahr|adresse|telefon|anrufen|route|wo seid|überath|overath|mail|e-mail/i],
    summary: `Du findest uns in der ${company.address.street}, ${company.address.postalCode} ${company.address.city}. Ruf uns an unter ${company.phone.display} oder schreib an ${company.email}.`,
    bullets: ['Persönliche Beratung vor Ort', 'Route und Karte auf der Kontaktseite'],
    ctaLabel: 'Zur Kontaktseite',
    ctaHref: '/kontakt/',
  },
  {
    id: 'camping-tipps',
    title: 'Camping-Wissen',
    patterns: [
      /camping|stellplatz|wohnwagen|alkoven|teilintegriert|vollintegriert|van|kastenwagen|führerschein|fuehrerschein|b96|gewicht|zuladung|wintercamping|campingplatz/i,
    ],
    summary:
      'Kurz und praxisnah: Beim Camper-Kauf zählen Personenanzahl, Schlafplätze, Bettlänge, Fahrzeuglänge, Zuladung und Führerschein-Klasse. Wir helfen dir, das passende Fahrzeug im Bestand zu finden – ohne Fachchinesisch.',
    bullets: [
      'Kastenwagen/Van: wendig, oft Führerschein B',
      'Teilintegriert: guter Alltagskompromiss',
      'Alkoven: viel Schlafplatz für Familien',
      'Vor dem Kauf: Bettlänge und Zuladung prüfen',
    ],
    ctaLabel: 'Passenden Camper finden',
    ctaHref: '/camper-finder/',
  },
];

const OFF_TOPIC =
  /politik|wahl|crypto|aktie|bitcoin|hack|waffe|drog|medizin|rezept|sex|porno|gambling|casino|chatgpt jailbreak|ignore previous/i;

/**
 * Camping-only assistant for Campingcenter Overath.
 * Prefers concrete, local answers; never invents prices or diagnoses.
 */
export function assistCamping(message: string): CampingAssistResult {
  const text = message.trim();
  if (text.length < 4) {
    return {
      title: 'Kurze Frage',
      summary: 'Schreib kurz, worum es geht – z. B. kaufen, mieten, Werkstatt, Öffnungszeiten oder Ankauf.',
      provider: 'rules',
    };
  }

  if (OFF_TOPIC.test(text) || !isCampingRelated(text)) {
    return {
      title: 'Nur Camping-Themen',
      summary:
        'Ich helfe dir bei allem rund ums Campingcenter Overath: Wohnmobile kaufen & mieten, Ankauf, Werkstatt, Marken, Öffnungszeiten und praxisnahe Camping-Fragen.',
      bullets: ['Verkauf & Camper-Finder', 'Vermietung (ADAC)', 'Werkstatt & Service', 'Ankauf', 'Öffnung & Kontakt'],
      ctaLabel: 'Fahrzeuge entdecken',
      ctaHref: '/wohnmobile/',
      provider: 'rules',
      offTopic: true,
    };
  }

  const hit = TOPICS.find((t) => t.patterns.some((p) => p.test(text))) ?? TOPICS.find((t) => t.id === 'camping-tipps')!;

  return {
    title: hit.title,
    summary: hit.summary,
    ...(hit.bullets ? { bullets: hit.bullets } : {}),
    ...(hit.ctaLabel ? { ctaLabel: hit.ctaLabel } : {}),
    ...(hit.ctaHref ? { ctaHref: hit.ctaHref } : {}),
    ...(hit.disclaimer ? { disclaimer: hit.disclaimer } : {}),
    provider: 'rules',
  };
}

function isCampingRelated(text: string): boolean {
  if (TOPICS.some((t) => t.patterns.some((p) => p.test(text)))) return true;
  return /camping|camper|wohnmobil|wohnwagen|reisemobil|overath|ccoverath|stellplatz|urlaub|werkstatt|mieten|kaufen|ankauf|van|alkoven/i.test(
    text,
  );
}

export const CAMPING_QUICK_PROMPTS = [
  { label: 'Kaufen', text: 'Ich suche ein passendes Wohnmobil zum Kaufen.' },
  { label: 'Mieten', text: 'Ich möchte ein Wohnmobil mieten.' },
  { label: 'Werkstatt', text: 'Ich brauche Hilfe von der Werkstatt.' },
  { label: 'Öffnung', text: 'Wann habt ihr heute geöffnet?' },
] as const;
