/**
 * Werkstatt-Leistungen – ausschließlich aus https://ccoverath.de/werkstatt-kundendienst/
 * übernommen und thematisch gruppiert.
 */

export type IconName =
  | 'shield'
  | 'wrench'
  | 'bolt'
  | 'sofa'
  | 'truck'
  | 'drop'
  | 'flame'
  | 'sparkle';

export interface ServiceGroup {
  id: string;
  title: string;
  lead: string;
  icon: IconName;
  items: string[];
}

export const serviceGroups: ServiceGroup[] = [
  {
    id: 'pruefung',
    title: 'Prüfung & Sicherheit',
    lead: 'Sicherheitscheck mit Siegel – damit du beruhigt losfahren kannst.',
    icon: 'shield',
    items: [
      'TÜV-Abnahmen',
      'Gasprüfung',
      'Dichtigkeitsprüfung',
      'Inspektionen',
      'Bremseneinstellung',
      'Bremsen-Auflaufeinheit',
    ],
  },
  {
    id: 'reparatur',
    title: 'Reparatur & Instandsetzung',
    lead: 'Spezialisiert auf Nässe- und GFK-Schäden – wir reparieren die Ursache und beseitigen die Folgeschäden.',
    icon: 'wrench',
    items: [
      'GFK-Reparaturen',
      'Beseitigung von Nässeschäden',
      'Unfallreparaturen jeder Art (GFK, Dach- und Seitenwände, Heck und Bug inkl. Blechteile)',
      'Reparatur und Einbau von Möbelteilen',
      'Reparaturen bei Wohnwagen',
    ],
  },
  {
    id: 'technik',
    title: 'Technik & Autarkie',
    lead: 'Ob LED, Solar oder effizientes Heizen: Wir beraten dich, wie dein Wohnmobil komfortabler, umweltbewusster und günstiger im Unterhalt wird.',
    icon: 'bolt',
    items: [
      'Rund um die Gasanlage: Kocher, Heizung, Kühlschrank, Gaswarngeräte',
      'Rund um die Elektroanlage',
      'Solar- und Photovoltaikanlagen',
      'Beleuchtung innen und außen, 12-V- und 220-V-Anlagen',
      'Klimaanlagen',
      'Wasserversorgung (Wasserhahn, Wasserboiler)',
      'Toilettenanlagen',
    ],
  },
  {
    id: 'komfort',
    title: 'Komfort & Ausstattung',
    lead: 'Sondereinbauten und komfortabler Innenausbau – ganz nach deinen Wünschen.',
    icon: 'sofa',
    items: [
      'Sondereinbauten',
      'Markisen',
      'Sat-Anlagen und Antennen',
      'Navigationssysteme und Radio',
      'Dachluken und Hebekippdächer',
      'Fenster, Eingangstüren, Serviceklappen, Rollos und Einstiegsstufen',
    ],
  },
  {
    id: 'fahrwerk',
    title: 'Fahrwerk & Transport',
    lead: 'Mehr Fahrkomfort und mehr mitnehmen: vom Fahrradhalter bis zur Motorradbühne.',
    icon: 'truck',
    items: [
      'Luftfedern',
      'Motorradbühnen',
      'Anhängekupplungen',
      'Fahrradhalter',
      'Rangiersysteme (Reich Mover, Truma-Mover)',
      'Schlingervorrichtungen',
    ],
  },
];

export const workshopHighlights = [
  {
    title: 'Sicherheitscheck mit Siegel',
    text: 'TÜV-Abnahme, Gasprüfung, Dichtigkeitsprüfungen, Inspektionen und Bremseneinstellung.',
  },
  {
    title: 'Spezialisten für Nässe- und GFK-Schäden',
    text: 'Wir reparieren GFK-Schäden und beseitigen die dadurch entstandenen Nässeschäden.',
  },
  {
    title: 'Rüste auf Energiesparen auf',
    text: 'LED, Solaranlage, Photovoltaik oder neue Technologien für effizientes Heizen.',
  },
];

export const workshopRequestTopics = [
  'TÜV-Abnahme',
  'Gasprüfung',
  'Dichtigkeitsprüfung',
  'Inspektion',
  'Unfall- / GFK-Schaden',
  'Nässeschaden',
  'Nachrüstung / Sondereinbau',
  'Solar / Elektrik',
  'Fahrzeugwäsche',
  'Sonstiges',
];
