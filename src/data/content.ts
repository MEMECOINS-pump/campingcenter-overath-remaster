/**
 * Page content sourced from https://ccoverath.de/ (audited 2026-09-30).
 * Copy is edited for readability; the factual statements are unchanged.
 */

export const rental = {
  adacBookingUrl: 'https://autovermietung.adac.de/wohnmobile/checkout/?station=7815392#/fahrzeugauswahl',
  station: 'ADAC Wohnmobilvermietung, Mietstation Köln-Ost',
  intro:
    'Das Campingcenter Overath ist eine bewährte und kompetente Mietstation der ADAC Wohnmobilvermietung in Köln-Ost. Du mietest bei uns vor Ort oder online – 24 Stunden rund um die Uhr über unseren Partner ADAC.',
  partnership:
    'Diese langjährige Partnerschaft bringt dir doppelte Vorteile: Service und Kompetenz unseres engagierten Teams, kombiniert mit den Leistungen der ADAC Wohnmobilvermietung.',
  benefits: [
    { title: 'Neue Fahrzeuge', text: 'Du bist mit neuen Mietfahrzeugen unterwegs.' },
    { title: 'Fahrradträger', text: 'Damit deine Fahrräder mit auf Reisen gehen können.' },
    { title: '3 % Rabatt für ADAC-Mitglieder', text: 'Als ADAC-Mitglied erhältst du 3 % Rabatt auf deine Wohnmobilmiete.' },
  ],
  hygiene: 'Unsere Wohnmobile und Wohnwagen werden nach jeder Anmietung nochmals desinfiziert.',
  freedom:
    'Mit einem Wohnmobil bist du flexibel – fernab großer Bettenburgen und des Massentourismus. Deine Reiseroute passt du jederzeit spontan an Wetter und Lust an.',
};

export const ankauf = {
  vehicleTypes: ['Wohnmobil', 'Wohnwagen', 'Van', 'Boot'],
  promise: 'In wenigen Schritten erhältst du dein unverbindliches Angebot – innerhalb von 24 Stunden.',
  reasons: [
    {
      title: 'Fairer Preis & schnelle Bewertung',
      text: 'Wir bewerten dein Fahrzeug transparent und fair – ohne versteckte Kosten. Innerhalb von 24 Stunden erhältst du ein unverbindliches Angebot auf Basis von Marktwert, Zustand und Ausstattung.',
    },
    {
      title: 'Von Campern geprüft',
      text: 'Wir sind selbst Camper und wissen genau, worauf es ankommt. Dein Fahrzeug wird professionell bewertet – von Menschen, die selbst unterwegs sind.',
    },
    {
      title: 'Erfahrung und ein starkes Netzwerk',
      text: 'Seit Jahrzehnten sind wir in der Wohnmobilbranche aktiv und haben ein großes Netzwerk aus Camping-Enthusiasten in ganz Deutschland und Europa aufgebaut.',
    },
  ],
  process: [
    {
      title: 'Anfrage stellen',
      text: 'Gib uns online die wichtigsten Infos zu deinem Fahrzeug. Je mehr Details, desto genauer die Bewertung.',
    },
    {
      title: 'Bewertung & Angebot innerhalb von 24 h',
      text: 'Unsere Experten prüfen deine Angaben und ermitteln einen fairen Marktpreis. Innerhalb von 24 Stunden erhältst du dein unverbindliches Angebot.',
    },
    {
      title: 'Sichere Zahlung & Abholung',
      text: 'Stimmst du zu, erhältst du die Zahlung sicher und schnell. Kannst du nicht vorbeikommen, holen wir das Fahrzeug bei dir ab – deutschlandweit.',
    },
    {
      title: 'Abmeldung & Weitervermittlung',
      text: 'Auf Wunsch übernehmen wir die Abmeldung und den gesamten Papierkram – und vermitteln dein Fahrzeug an neue, glückliche Besitzer.',
    },
  ],
  accessories: ['Markise', 'Solaranlage', 'Große Batterie / Lithium', 'SAT-Anlage', 'Anhängerkupplung', 'Fahrradträger', 'Klimaanlage', 'Mover'],
};

export const usedBenefits = [
  {
    title: 'Clever sparen – ohne Kompromisse',
    text: 'Ein neues Wohnmobil verliert in den ersten Jahren den größten Teil seines Werts – oft schon bis zu 20 % im ersten Jahr. Diesen Wertverlust sparst du dir.',
  },
  {
    title: 'Wertstabil unterwegs',
    text: 'Der größte Preisverfall liegt bereits hinter dir. Verkaufst du in ein paar Jahren wieder, verlierst du prozentual deutlich weniger als mit einem Neufahrzeug.',
  },
  {
    title: 'Sofort losfahren statt monatelang warten',
    text: 'Keine Bestellzeiten, keine Überraschungen: Du bekommst genau das Fahrzeug, das du siehst, prüfst und erlebst.',
  },
  {
    title: 'Von Campern geprüft',
    text: 'Jedes Wohnmobil wird von unserem Team aus echten Campern geprüft – ob Stauraum, Autarkie oder Bordelektronik. Wir beraten dich ehrlich.',
  },
  {
    title: 'Beratung von Menschen, die selbst campen',
    text: 'Ob du mit Familie reist, autark stehen willst oder ein kompaktes Modell suchst: Wir helfen dir, das Wohnmobil zu finden, das wirklich zu dir passt.',
  },
  {
    title: 'Finanzierung & Inzahlungnahme möglich',
    text: 'Wir bieten flexible Finanzierungsmöglichkeiten und nehmen dein altes Wohnmobil in Zahlung.',
  },
];

export interface VehicleType {
  id: 'alkoven' | 'teilintegriert' | 'vollintegriert' | 'kastenwagen' | 'van';
  title: string;
  persons: string;
  facts: string[];
}

/** Fahrzeugarten laut https://ccoverath.de/wohnmobile/ */
export const vehicleTypes: VehicleType[] = [
  { id: 'alkoven', title: 'Alkoven', persons: 'Bis zu 6 Personen', facts: ['Familienfreundlich', 'Raumwunder', 'Feste Betten'] },
  { id: 'teilintegriert', title: 'Teilintegriert', persons: 'Bis zu 5 Personen', facts: ['Schickes Design', 'Spritsparend', 'Innovative Grundrisse'] },
  { id: 'vollintegriert', title: 'Vollintegriert', persons: 'Bis zu 4 Personen', facts: ['Raumwunder', 'Größeres Sichtfeld', 'Winterfeste Fahrerhaus-Isolierung'] },
  { id: 'kastenwagen', title: 'Kastenwagen', persons: 'Bis zu 4 Personen', facts: ['Alltagstauglich und kompakt', 'Alles drin, was man braucht'] },
  { id: 'van', title: 'Van', persons: 'Bis zu 4 Personen', facts: ['Superkompakt', 'Als Pkw nutzbar', 'Inkl. Betten, Küche, Außendusche'] },
];

export const story = {
  headline: 'Von Campern für Camper',
  lead: 'Die Expertinnen und Experten des Campingcenters Overath stehen dir mit Rat und Tat zur Seite. Die Gründer und das Team sind selbst begeisterte Camper – und genau diese Begeisterung steckt in ihrer täglichen Arbeit.',
  body: [
    'Seit 30 Jahren bietet das Campingcenter Overath Reiselustigen, Camping-Liebhabern und Neu-Campern mehr als nur einen Wohnwagen oder ein Wohnmobil. Wir beraten professionell und ausführlich – und finden gemeinsam mit dir die passende Lösung für deinen Urlaub auf vier Rädern.',
    'Viele kennen das renommierte Campingcenter in der Weberstraße und schätzen Qualität und kompetenten Service. Mit den langjährigen Mitarbeiterinnen und Mitarbeitern haben wir zum Campingcenter Overath neu firmiert. Unser bewährtes Verkaufs- und Werkstatt-Team hat sich der Kultur des Campings verpflichtet.',
    'Wir freuen uns auf langjährige Bestandskunden – und natürlich auf neue Campingfreunde, die Qualität, Service und Erfahrung für einen erholsamen Urlaub auf Rädern zu schätzen wissen.',
  ],
};

export const videos = {
  culture: { id: 'eTog12HJsE0', title: 'Wir pflegen die Kultur des Campings – Campingcenter Overath' },
  australia: { id: 'MQLUVc4_rEw', title: 'Schicksalsschläge, Freiheit, Alligatoren – Mit dem Wohnmobil durch Australien' },
  workshop: { id: 'I_xTKmybkWY', title: 'Dein Spezialist für Wohnmobile und Wohnwagen – Campingcenter Overath' },
};

export const promotion = {
  id: 'fahrzeugwaesche-herbst',
  href: '/fahrzeugwaesche-herbst/',
  eyebrow: 'Aktuelle Aktion',
  title: 'Professionelle Fahrzeugwäsche – nur 125 €',
  lead: 'Staub, Regenstreifen, Insektenreste und hartnäckiger Straßenschmutz: Nach dem Urlaub nehmen wir dir die gründliche Außenreinigung ab.',
  price: '125 €',
  includes: [
    'Reinigung der Seitenwände',
    'Reinigung des Dachs',
    'Reinigung der Felgen',
    'Reinigung des Fahrerhauses von außen',
    'Schonende Reinigungsmittel',
  ],
  results: [
    'Du sparst Zeit und Arbeit',
    'Dein Wohnmobil sieht wieder richtig gut aus',
    'Die Verschmutzungen der letzten Reise werden gründlich entfernt',
    'Sauber und gepflegt für die nächste Fahrt',
    'Kein Aufwand, kein Ärger – einfach abgeben und sauber zurückbekommen',
  ],
  note: 'Nach der Hauptreisezeit ist die Nachfrage nach Waschterminen besonders hoch – sichere dir rechtzeitig deinen Termin.',
  disclaimer:
    'Die verwendeten Reinigungsmittel sind für diese Anwendungen geeignet und gelten als unbedenklich. Für Schäden durch bereits bestehende Vorschäden (z. B. abblätternden Lack an der Motorhaube), materialbedingte Reaktionen (z. B. Verfärbungen) oder andere Beeinträchtigungen wird keine Haftung übernommen. Die Reinigung erfolgt auf eigene Verantwortung des Kunden.',
};

export const agbDocuments = [
  { title: 'Reparaturbedingungen', href: 'https://ccoverath.de/wp-content/uploads/2022/01/Reparaturbedingungen_2022.pdf', area: 'Werkstatt' },
  { title: 'Mietbedingungen', href: 'https://ccoverath.de/wp-content/uploads/2021/03/Mietbedingungen_02_2017.pdf', area: 'Vermietung' },
  { title: 'AGB Neuwagen', href: 'https://ccoverath.de/wp-content/uploads/2021/03/AGB_Neuwagen_12_2016_zweiseitig.pdf', area: 'Neuwagen-Verkauf' },
  { title: 'AGB Gebrauchtwagen', href: 'https://ccoverath.de/wp-content/uploads/2026/09/DCHV-Gebrauchtwagenformulare_08_2022.pdf', area: 'Gebrauchtwagen-Verkauf' },
];
