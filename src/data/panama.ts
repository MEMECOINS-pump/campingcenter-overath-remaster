/** Inhalte laut https://ccoverath.de/panama/ */

export const panamaUseCases = [
  { id: 'reisen', title: 'Urlaub', text: 'Völlig flexibel auf Reisen gehen und neue Orte entdecken.' },
  { id: 'alltag', title: 'Alltag', text: 'Die Kinder sicher zur Schule bringen und täglich zur Arbeit fahren.' },
  { id: 'wochenende', title: 'Wochenende', text: 'Zum Ausflug einfach die Fahrräder mit einpacken.' },
  { id: 'familie', title: 'Familie', text: 'Mit vier Personen kostengünstig übernachten.' },
  { id: 'camping', title: 'Camping', text: 'Ein 3-Gänge-Menü kochen und gleichzeitig die Getränke kühlen.' },
  { id: 'transport', title: 'Transport', text: 'Ohne Platzprobleme die neue Waschmaschine im Baumarkt abholen.' },
  { id: 'office', title: 'Mobiles Arbeiten', text: 'Mobil und ohne große Kompromisse das eigene Office betreiben.' },
  { id: 'city', title: 'City', text: 'Dank kompakter Abmessungen wendig in der Stadt – und überall hinkommen.' },
];

export interface PanamaModel {
  id: string;
  name: string;
  variants: string;
  base: string;
  lead: string;
  paragraphs: string[];
  features: string[];
  links: { label: string; href: string }[];
  images: ('panama-peak-1' | 'panama-peak-2' | 'panama-peak-3' | 'panama-urban-1' | 'panama-urban-2' | 'panama-urban-3' | 'panama-lifestyle-1' | 'panama-lifestyle-2' | 'panama-lifestyle-3')[];
}

export const panamaModels: PanamaModel[] = [
  {
    id: 'peak',
    name: 'PANAMA Peak',
    variants: 'P10+ / P12+',
    base: 'Ford Transit Custom',
    lead: 'Ein multifunktionaler Camper, der sich mehr nach Pkw als nach Transporter anfühlt – mit guter Übersichtlichkeit und ausgezeichnetem Raumangebot.',
    paragraphs: [
      'Der P10+ bietet Platz für bis zu fünf Personen. Die Schlafsitzbank mit Isofix lässt sich in den Airline-Schienen leicht versetzen – so passt du Laderaum und Fahrgastraum flexibel an. Der P12+ ist mit zwei zusätzlichen Einzelsitzen ein familienfreundlicher 7-Sitzer.',
      'Im Aufstelldach, das sich dank zwei Gasdruckdämpfern einfach öffnen lässt, wartet ein ca. 1,20 m breites Bett. Die Matratze liegt auf Tellerfedern und sorgt für angenehmen Schlaf.',
      'Drehbare Vordersitze, Sitzbank und ein Tisch, der sich am Küchenblock einklicken lässt, ergeben eine gemütliche Sitzgruppe für vier Personen. Einzeln schaltbare LED-Leisten und indirekte Ambientebeleuchtung tauchen den Innenraum in angenehmes Licht.',
    ],
    features: [
      'Kühlschrank mit Gefrierfach',
      'Zweiflammen-Herd und Spüle',
      'Zahlreiche Staufächer und Schubladen',
      'Isomatten zur Isolierung und Verdunkelung',
      'USB-Anschlüsse und Steckdosen',
      'Frischwassertank und Außendusche',
      'Klimaanlage und Audiosystem',
      'Beheizte, höhenverstellbare Vordersitze',
      'Rückfahrkamera',
      'Fliegengittertür',
      'Start-Stopp-System',
      'Alufelgen',
    ],
    links: [
      { label: 'Mehr zum P10+', href: 'https://www.panama-van.de/unsere-vans-entdecken/panama-peak/p10/' },
      { label: 'Mehr zum P12+', href: 'https://www.panama-van.de/unsere-vans-entdecken/panama-peak/p12/' },
    ],
    images: ['panama-peak-1', 'panama-lifestyle-1', 'panama-lifestyle-2'],
  },
  {
    id: 'peak-next',
    name: 'PANAMA Peak Next Generation',
    variants: 'P10 / P10+ / P12+ / P54+',
    base: 'Ford (neueste Generation)',
    lead: 'Dein neuester Alltagsbegleiter und Reisepartner – mit einem geräumigen, anpassbaren Innenraum ganz nach deinen Bedürfnissen.',
    paragraphs: [
      'Der Peak bietet alles, was du brauchst, um komfortabel unterwegs zu sein. Je nach Modellvariante kommt noch jede Menge sinnvolle Ausstattung obendrauf.',
    ],
    features: [
      'RADIO SYNC mit 13″-Touchscreen, 5 Lautsprecher',
      'Android Auto und Apple CarPlay',
      'Digitaler Kilometerzähler',
      'Automatische Klimaanlage',
      'Beheizte und drehbare Vordersitze',
      'Elektrische Handbremse, Keyless Start',
      '17″-Alufelgen',
      'DSS-LED-Scheinwerfer, Nebelscheinwerfer vorne',
      'Elektrische, beheizte und einklappbare Außenspiegel',
      'Rückfahrkamera, Parksensoren vorne und hinten',
      'FordPass Connect',
      'Gasherd (2 Brenner) mit Spüle',
      '3er-Sitzbank, zum Bett umbaubar, mit großem Stauraum',
      'Kühlschrank mit Gefrierfach und Frontöffnung',
    ],
    links: [
      { label: 'Mehr zum P10', href: 'https://www.panama-van.de/unsere-vans-entdecken/panama-peak/p10-next-generation/' },
      { label: 'Mehr zum P12', href: 'https://www.panama-van.de/unsere-vans-entdecken/panama-peak/p12-next-generation/' },
      { label: 'Mehr zum P54', href: 'https://www.panama-van.de/unsere-vans-entdecken/panama-peak/p54-next-generation/' },
    ],
    images: ['panama-peak-2', 'panama-peak-3', 'panama-lifestyle-3'],
  },
  {
    id: 'urban',
    name: 'PANAMA Urban',
    variants: 'U10 / U10+ / U11',
    base: 'Peugeot',
    lead: 'Der neueste Streich von PANAMA: ein voll ausgestatteter Van, der dich wirklich überallhin begleitet. Mit 1,98 m Höhe passt er in jedes Parkhaus.',
    paragraphs: [
      'Ausstellbares Hubdach, viel Stauraum und vier Schlafplätze – kombiniert mit Pkw-Komfort wie Klimaautomatik, beheizten Drehsitzen und Smartphone-Integration.',
    ],
    features: [
      'Ausstellbares Hubdach',
      '4 Schlafplätze',
      'Klappbarer Induktionsherd',
      'Abnehmbares Camper-Kit (optional)',
      'Tragbare Kompressor-Kühlbox',
      'Außendusche',
      'Matratze / Umbau-Kit für das untere Bett',
      '2 Schiebetüren, Heckklappe mit Klappfenster',
      'Radio mit Touchscreen, DAB, Bluetooth, USB',
      'Android Auto und Apple CarPlay',
      'Klimaautomatik und hintere Lüftungsdüsen',
      'Beheizte und drehbare Vordersitze',
      '17″-Alufelgen',
      'Fenster in 2. und 3. Reihe, getönte Scheiben hinten',
    ],
    links: [
      { label: 'Mehr zum U10', href: 'https://www.panama-van.de/unsere-vans-entdecken/panama-urban/u10/' },
      { label: 'Mehr zum U11', href: 'https://www.panama-van.de/unsere-vans-entdecken/panama-urban/u11/' },
    ],
    images: ['panama-urban-1', 'panama-urban-2', 'panama-urban-3'],
  },
];
