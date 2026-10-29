/**
 * Stellenangebote laut https://ccoverath.de/jobs/ (Stand 2026-09-30).
 * `sourceModified` ist das Änderungsdatum der jeweiligen Originalseite (WordPress REST API).
 */

export interface Job {
  slug: string;
  title: string;
  employment: string;
  schemaEmploymentType: ('PART_TIME' | 'FULL_TIME' | 'OTHER')[];
  sourceUrl: string;
  sourceModified: string;
  intro: string;
  facts?: string[];
  tasks: string[];
  requirements: string[];
  offer: string[];
  pay?: { min: number; max: number; unit: 'HOUR' | 'MONTH' };
  formal: boolean;
}

export const jobs: Job[] = [
  {
    slug: 'rechnungswesen',
    title: 'Mitarbeiter für das Rechnungswesen (m/w/d)',
    employment: 'Teilzeit – gerne auch im Ruhestand',
    schemaEmploymentType: ['PART_TIME'],
    sourceUrl: 'https://ccoverath.de/rechnungswesen/',
    sourceModified: '2026-09-24',
    intro:
      'Wir suchen für unser Unternehmen in Nordrhein-Westfalen eine zuverlässige und eigenverantwortliche Unterstützung für unsere Buchhaltung und Verwaltung. Sie suchen eine flexible Aufgabe und bringen Struktur in Zahlen? Dann passen Sie perfekt zu uns!',
    facts: [
      'Arbeitszeit: ca. 3-mal pro Woche für jeweils 6 Stunden (ca. 18 Stunden/Woche)',
      'Flexibilität: Tage und Kernzeiten stimmen wir gerne flexibel mit Ihnen ab',
      'Ideal für erfahrene Kräfte – ausdrücklich auch für Personen im Ruhestand / Vorruhestand',
    ],
    tasks: [
      'Zahlungsverkehr: Vorbereitung und Durchführung aller Überweisungen von Eingangsrechnungen',
      'Schnittstelle zum Steuerberater: Sortierung, Aufbereitung und digitale Übermittlung aller relevanten Buchhaltungsunterlagen sowie laufender Austausch mit unserem Steuerberatungsbüro',
      'Mahnwesen: kontinuierliche Kontrolle, Prüfung und Überwachung',
      'Kostenkontrolle: Mitwirkung bei der laufenden Planung und Ermittlung der Betriebskosten',
      'Systempflege: schrittweise Einarbeitung in unsere internen Systeme und Softwarestrukturen',
      'Kernfokus: übergeordnete Überwachung und lückenlose Kontrolle des gesamten Rechnungswesens',
    ],
    requirements: [
      'Kaufmännische Ausbildung (z. B. Bürokaufmann/-frau, Steuerfachangestellte/r) oder fundierte, mehrjährige Erfahrung in Buchhaltung / Rechnungswesen',
      'Sorgfältige, strukturierte und absolut zuverlässige Arbeitsweise',
      'Routine im Umgang mit Zahlen, idealerweise Erfahrung mit Buchhaltungssoftware oder digitalen Ablagesystemen',
      'Kommunikationsstärke für den direkten Draht zu unserem Steuerberater',
    ],
    offer: [
      'Unbefristete Teilzeitbeschäftigung mit fairer Vergütung (je nach Erfahrung ca. 18,50 € – 22,00 € pro Stunde)',
      'Gründliche Einarbeitung in unsere Systeme und Abläufe',
      'Ruhiges, wertschätzendes Arbeitsumfeld mit hoher Eigenverantwortung',
      'Maximale Flexibilität bei der Absprache Ihrer Arbeitstage',
    ],
    pay: { min: 18.5, max: 22, unit: 'HOUR' },
    formal: true,
  },
  {
    slug: 'reinigungskraft',
    title: 'Reinigungskraft (m/w/d)',
    employment: 'Minijob (520-€-Basis) oder Teilzeit',
    schemaEmploymentType: ['PART_TIME', 'OTHER'],
    sourceUrl: 'https://ccoverath.de/reinigungskraft/',
    sourceModified: '2025-09-10',
    intro:
      'Als Reinigungskraft sorgst du dafür, dass sich unser Team und unsere Kunden in sauberen und gepflegten Räumen wohlfühlen. Ob Büros, Aufenthaltsräume oder Sanitäranlagen – mit deinem Einsatz machst du den Unterschied!',
    tasks: [
      'Reinigung der Verkaufshalle, WC und Aufenthaltsraum',
      'Reinigung unserer Vermietflotte sowie von Neu- und Gebrauchtreisemobilen und Wohnwagen',
    ],
    requirements: [
      'Eigenverantwortliches und lösungsorientiertes Arbeiten',
      'Du bist zuverlässig, gründlich und motiviert',
      'Führerschein',
      'Keine Erfahrung? Kein Problem – wir zeigen dir alles, was du wissen musst.',
    ],
    offer: [
      '520-€-Job mit flexiblen Arbeitszeiten – ideal als Nebenjob',
      'Zuverlässige und pünktliche Bezahlung',
      'Angenehmes und freundliches Arbeitsumfeld',
      'Tolles Team mit flachen Hierarchien',
      'Wohnmobile & Camping hautnah erleben – ein abwechslungsreicher Arbeitsplatz',
    ],
    formal: false,
  },
];

export const employer = {
  text: 'Wir verkaufen nicht nur Wohnmobile, sondern sorgen auch dafür, dass sie einwandfrei funktionieren. Unser Unternehmen wächst – deshalb suchen wir für unsere neue Werkstatt zum nächstmöglichen Zeitpunkt mehrere Quereinsteiger (m/w/d).',
  profile:
    'Du arbeitest gerne eigenverantwortlich und engagiert, bringst organisatorisches Geschick mit und überzeugst durch ein offenes, freundliches Auftreten? Dann freuen wir uns auf deine Bewerbung.',
  benefits: [
    'Festvertrag',
    '30 Tage Urlaub',
    'Abwechslungsreich',
    'Flexibel',
    'Familienfreundlich',
    'Beständig',
    'Wachsendes Unternehmen',
    'Überdurchschnittliche Bezahlung für Quereinsteiger',
  ],
  postalContact: 'Campingcenter Overath GmbH & Co KG, z. Hd. Herrn Martin Meinke, Weberstraße 12, 51491 Overath',
};
