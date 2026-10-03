export interface NavItem {
  label: string;
  href: string;
  hint?: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    label: 'Wohnmobile',
    href: '/wohnmobile/',
    hint: 'Fahrzeuge entdecken',
    children: [
      { label: 'Alle Fahrzeuge', href: '/wohnmobile/', hint: 'Neu- und Gebrauchtfahrzeuge im Bestand' },
      { label: 'Gebrauchte Wohnmobile', href: '/wohnmobil-verkauf/', hint: 'Gebrauchtfahrzeuge im Bestand' },
      { label: 'Camper-Finder', href: '/camper-finder/', hint: 'Welcher Camper passt zu dir?' },
      { label: 'Marken', href: '/marken/', hint: 'Challenger, La Strada, Eura Mobil' },
      { label: 'La Strada Konfigurator', href: '/la-strada-konfigurator/', hint: 'Dein LA STRADA konfigurieren' },
      { label: 'Merkliste', href: '/merkliste/', hint: 'Deine gemerkten Fahrzeuge' },
    ],
  },
  { label: 'Ankauf', href: '/wohnmobil-ankauf/', hint: 'Ankauf starten' },
  { label: 'Vermietung', href: '/vermietung-wohnmobile/', hint: 'Wohnmobil mieten' },
  { label: 'Werkstatt', href: '/werkstatt-kundendienst/', hint: 'Service & Terminanfrage' },
  { label: 'Über uns', href: '/ueber-uns/', hint: 'Von Campern für Camper' },
];

export const moreNav: NavItem[] = [
  { label: '360° Rundgang', href: '/360-rundgang/' },
  { label: 'Fahrzeugwäsche', href: '/fahrzeugwaesche-herbst/' },
  { label: 'Jobs', href: '/jobs/' },
  { label: 'Kontakt', href: '/kontakt/' },
];

export const legalNav: NavItem[] = [
  { label: 'Impressum', href: '/impressum/' },
  { label: 'Datenschutz', href: '/datenschutz/' },
  { label: 'AGB', href: '/agb/' },
  { label: 'Barrierefreiheit', href: '/barrierefreiheitserklaerung/' },
];
