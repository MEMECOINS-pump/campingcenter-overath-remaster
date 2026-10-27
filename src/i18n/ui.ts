import type { Locale } from './locales';

/** Customer-facing UI strings. Vehicle specs/IDs stay in inventory; only labels here. */
export const ui = {
  skipToContent: { de: 'Zum Inhalt springen', en: 'Skip to content' },
  homeAria: { de: 'Startseite', en: 'Home' },
  mainNavAria: { de: 'Hauptnavigation', en: 'Main navigation' },
  more: { de: 'Mehr', en: 'More' },
  favorites: { de: 'Merkliste', en: 'Wishlist' },
  bookAdvice: { de: 'Beratung vereinbaren', en: 'Book consultation' },
  callAria: { de: 'Anrufen', en: 'Call' },
  menu: { de: 'Menü', en: 'Menu' },
  menuClose: { de: 'Menü schließen', en: 'Close menu' },
  mobileNavAria: { de: 'Mobile Navigation', en: 'Mobile navigation' },
  contact: { de: 'Kontakt', en: 'Contact' },
  planRoute: { de: 'Route planen', en: 'Get directions' },
  openingHours: { de: 'Öffnungszeiten', en: 'Opening hours' },
  closedSundayHoliday: {
    de: 'Sonntags und an gesetzlichen Feiertagen (NRW) geschlossen.',
    en: 'Closed on Sundays and public holidays (NRW).',
  },
  cookieSettings: { de: 'Cookie-Einstellungen', en: 'Cookie settings' },
  footerDisclaimer: {
    de: 'Redesign-Präsentation. Die offizielle Website des Campingcenter Overath ist',
    en: 'Redesign presentation. The official Campingcenter Overath website is',
  },
  footerDisclaimerEnd: {
    de: 'Maßgeblich sind die dort und im Autohaus gemachten Angaben.',
    en: 'Details on that site and at the dealership are authoritative.',
  },
  footerMottoSuffix: {
    de: 'in Overath – Vertragshändler, ADAC-Mietstation und Fachwerkstatt für Wohnmobile und Wohnwagen.',
    en: 'in Overath – authorised dealer, ADAC rental station and specialist workshop for motorhomes and caravans.',
  },

  /* nav */
  navSale: { de: 'Verkauf', en: 'Sales' },
  navSaleHint: { de: 'Fahrzeuge entdecken', en: 'Browse vehicles' },
  navAllVehicles: { de: 'Alle Fahrzeuge', en: 'All vehicles' },
  navAllVehiclesHint: { de: 'Neu- und Gebrauchtfahrzeuge im Bestand', en: 'New and used vehicles in stock' },
  navUsed: { de: 'Gebrauchte Wohnmobile', en: 'Used motorhomes' },
  navUsedHint: { de: 'Gebrauchtfahrzeuge im Bestand', en: 'Used vehicles in stock' },
  navFinder: { de: 'Camper-Finder', en: 'Camper Finder' },
  navFinderHint: { de: 'Welcher Camper passt zu dir?', en: 'Which camper fits you?' },
  navBrands: { de: 'Marken', en: 'Brands' },
  navBrandsHint: { de: 'Challenger, La Strada, Eura Mobil', en: 'Challenger, La Strada, Eura Mobil' },
  navConfigurator: { de: 'La Strada Konfigurator', en: 'La Strada configurator' },
  navConfiguratorHint: { de: 'Dein LA STRADA konfigurieren', en: 'Configure your LA STRADA' },
  navWishlist: { de: 'Merkliste', en: 'Wishlist' },
  navWishlistHint: { de: 'Deine gemerkten Fahrzeuge', en: 'Your saved vehicles' },
  navTradeIn: { de: 'Ankauf', en: 'Trade-in' },
  navTradeInHint: { de: 'Ankauf starten', en: 'Start trade-in' },
  navRental: { de: 'Vermietung', en: 'Rental' },
  navRentalHint: { de: 'Wohnmobil mieten', en: 'Rent a motorhome' },
  navWorkshop: { de: 'Werkstatt', en: 'Workshop' },
  navWorkshopHint: { de: 'Service & Terminanfrage', en: 'Service & appointment' },
  navAbout: { de: 'Über uns', en: 'About us' },
  navAboutHint: { de: 'Von Campern für Camper', en: 'By campers, for campers' },
  navTour: { de: '360° Rundgang', en: '360° tour' },
  navWash: { de: 'Fahrzeugwäsche', en: 'Vehicle wash' },
  navJobs: { de: 'Jobs', en: 'Jobs' },
  navContact: { de: 'Kontakt', en: 'Contact' },
  navImprint: { de: 'Impressum', en: 'Imprint' },
  navPrivacy: { de: 'Datenschutz', en: 'Privacy' },
  navTerms: { de: 'AGB', en: 'Terms' },
  navA11y: { de: 'Barrierefreiheit', en: 'Accessibility' },

  footerVehicles: { de: 'Fahrzeuge', en: 'Vehicles' },
  footerAllMh: { de: 'Alle Wohnmobile', en: 'All motorhomes' },
  footerService: { de: 'Service', en: 'Service' },
  footerSell: { de: 'Wohnmobil verkaufen', en: 'Sell your motorhome' },
  footerRent: { de: 'Wohnmobil mieten', en: 'Rent a motorhome' },
  footerWorkshop: { de: 'Werkstatt & Kundendienst', en: 'Workshop & aftersales' },
  footerCompany: { de: 'Unternehmen', en: 'Company' },
  footerContactRoute: { de: 'Kontakt & Anfahrt', en: 'Contact & directions' },
  footerDaysMonFri: { de: 'Montag bis Freitag', en: 'Monday to Friday' },
  footerDaysSat: { de: 'Samstag', en: 'Saturday' },

  /* companion */
  companionFabAria: {
    de: 'Hilfe, Barrierefreiheit und Spracheinstellungen öffnen',
    en: 'Open help, accessibility and language settings',
  },
  companionTitle: { de: 'Dein Reisebegleiter', en: 'Your Travel Companion' },
  companionSubtitle: { de: 'Wie können wir dir helfen?', en: 'How can we help you?' },
  companionClose: { de: 'Schließen', en: 'Close' },
  companionBack: { de: 'Zurück', en: 'Back' },
  companionCardAdvice: { de: 'Camping-Beratung', en: 'Camping advice' },
  companionCardAdviceHint: {
    de: 'Frag unsere Camping-KI zu Kauf, Miete, Ankauf und Service.',
    en: 'Ask our camping AI about buying, renting, trade-in and service.',
  },
  companionCardA11y: { de: 'Barrierefreiheit', en: 'Accessibility' },
  companionCardA11yHint: {
    de: 'Schrift, Kontrast, Bewegung und Lesbarkeit anpassen.',
    en: 'Adjust text size, contrast, motion and readability.',
  },
  companionCardLang: { de: 'Sprache', en: 'Language' },
  companionCardLangHint: {
    de: 'Website auf Deutsch oder Englisch nutzen.',
    en: 'Use the site in German or English.',
  },
  companionQuickContact: { de: 'Schnellkontakt', en: 'Quick contact' },
  companionCallNow: { de: 'Jetzt anrufen', en: 'Call now' },
  companionWriteMessage: { de: 'Nachricht schreiben', en: 'Send a message' },
  companionOpenNow: { de: 'Jetzt geöffnet', en: 'Open now' },
  companionClosedNow: { de: 'Aktuell geschlossen', en: 'Currently closed' },
  companionHolidayClosed: { de: 'Feiertag · Geschlossen', en: 'Public holiday · Closed' },
  companionLangLead: {
    de: 'Wähle deine Sprache. Deine Merkliste und Formulare bleiben erhalten.',
    en: 'Choose your language. Your wishlist and forms are kept where possible.',
  },
  companionLangCurrent: { de: 'Aktuelle Sprache', en: 'Current language' },
  companionAiOfflineTitle: {
    de: 'Beratung gerade nicht erreichbar',
    en: 'Advice temporarily unavailable',
  },
  companionAiOfflineBody: {
    de: 'Die Camping-KI ist momentan offline. Ruf uns an oder schreib uns – wir helfen persönlich weiter.',
    en: 'The camping AI is offline right now. Call or message us — we will help you personally.',
  },

  /* a11y panel */
  a11yTitle: { de: 'Anzeige anpassen', en: 'Display settings' },
  a11yKicker: { de: 'Campingcenter Overath', en: 'Campingcenter Overath' },
  a11yLead: {
    de: 'Praktische Darstellungshilfen für diese Website. Die rechtliche Erklärung findest du unter Barrierefreiheit.',
    en: 'Practical display aids for this site. See the accessibility statement for the legal explanation.',
  },
  a11yFont: { de: 'Schriftgröße', en: 'Text size' },
  a11yFontSm: { de: 'Schrift verkleinern', en: 'Decrease text size' },
  a11yFontMd: { de: 'Standard-Schriftgröße', en: 'Default text size' },
  a11yFontLg: { de: 'Schrift vergrößern', en: 'Increase text size' },
  a11yDisplay: { de: 'Darstellung', en: 'Display' },
  a11yContrast: { de: 'Kontrast erhöhen', en: 'Increase contrast' },
  a11yMotion: { de: 'Animationen reduzieren', en: 'Reduce motion' },
  a11yReadable: { de: 'Lesefreundliche Darstellung', en: 'Readable layout' },
  a11yLinks: { de: 'Links hervorheben', en: 'Highlight links' },
  a11yReset: { de: 'Zurücksetzen', en: 'Reset' },
  a11yStatement: { de: 'Erklärung zur Barrierefreiheit', en: 'Accessibility statement' },

  /* cookie */
  cookieTitle: { de: 'Deine Privatsphäre', en: 'Your privacy' },
  cookieBody: {
    de: 'Kein Tracking. Google Maps und YouTube laden wir nur mit deiner Zustimmung.',
    en: 'No tracking. We load Google Maps and YouTube only with your consent.',
  },
  cookieAcceptAll: { de: 'Alle akzeptieren', en: 'Accept all' },
  cookieSettingsBtn: { de: 'Einstellungen', en: 'Settings' },
  cookieNecessaryOnly: { de: 'Nur notwendige', en: 'Necessary only' },
  cookieDialogTitle: { de: 'Cookie- und Medien-Einstellungen', en: 'Cookie and media settings' },
  cookieDialogIntro: {
    de: 'Du entscheidest, was geladen wird. Deine Auswahl kannst du jederzeit im Footer unter „Cookie-Einstellungen“ ändern.',
    en: 'You decide what is loaded. Change your choice anytime via “Cookie settings” in the footer.',
  },
  cookieNecessary: { de: 'Notwendig', en: 'Necessary' },
  cookieNecessaryDesc: {
    de: 'Speichert deine Merkliste, deinen Vergleich und diese Auswahl lokal in deinem Browser. Keine Übertragung an Dritte.',
    en: 'Stores your wishlist, comparison and this choice locally in your browser. Nothing is sent to third parties.',
  },
  cookieAlwaysOn: { de: 'Immer aktiv', en: 'Always on' },
  cookieMedia: { de: 'Externe Medien', en: 'External media' },
  cookieMediaDesc: {
    de: 'Google Maps (Anfahrt) und YouTube-Videos (über youtube-nocookie.com). Beim Laden werden Daten an Google übertragen.',
    en: 'Google Maps (directions) and YouTube videos (youtube-nocookie.com). Loading sends data to Google.',
  },
  cookieStats: { de: 'Statistik', en: 'Statistics' },
  cookieStatsDesc: {
    de: 'Anonyme Reichweitenmessung zur Verbesserung der Seite. In dieser Präsentation ist kein Statistik-Dienst eingebunden.',
    en: 'Anonymous reach measurement to improve the site. No analytics service is embedded in this presentation.',
  },
  cookieSave: { de: 'Speichern', en: 'Save' },
  cookieEssential: { de: 'Nur essenzielle', en: 'Essential only' },

  /* chat */
  chatKicker: { de: 'ccoverath KI', en: 'ccoverath AI' },
  chatTitle: { de: 'Camping-Assistent', en: 'Camping assistant' },
  chatClose: { de: 'Assistent schließen', en: 'Close assistant' },
  chatTabChat: { de: 'Chat', en: 'Chat' },
  chatTabManuals: { de: 'Wartungshefte', en: 'Service manuals' },
  chatHello: { de: 'Hallo – wie kann ich helfen?', en: 'Hello – how can I help?' },
  chatIntro: {
    de: 'Fragen zu Challenger, Kauf, Miete, Ankauf, Öffnungszeiten oder Service. Kurze Stichworte reichen.',
    en: 'Ask about Challenger, buying, rental, trade-in, opening hours or service. Short keywords are enough.',
  },
  chatPlaceholder: { de: 'Nachricht an ccoverath KI …', en: 'Message to ccoverath AI…' },
  chatSend: { de: 'Senden', en: 'Send' },
  chatHint: {
    de: 'Enter senden · Shift+Enter neue Zeile · Größe oben mit S–XL',
    en: 'Enter to send · Shift+Enter new line · Size S–XL above',
  },
  chatWindowSize: { de: 'Fenstergröße', en: 'Window size' },
  chatThinking: { de: 'ccoverath KI denkt', en: 'ccoverath AI is thinking' },
  chatTooShort: {
    de: 'Schreib bitte etwas genauer – z. B. „Challenger 240“, „mieten“ oder „Öffnungszeiten“.',
    en: 'Please be a bit more specific — e.g. “Challenger 240”, “rent” or “opening hours”.',
  },
  chatOpenPdf: { de: 'PDF öffnen', en: 'Open PDF' },

  /* hero / home */
  heroTitle: { de: 'Dein Abenteuer beginnt hier.', en: 'Your adventure starts here.' },
  heroLead: {
    de: 'Wohnmobile kaufen, mieten und professionell betreuen lassen – bei deinen Camping-Experten in Overath.',
    en: 'Buy, rent and professionally care for motorhomes — with your camping experts in Overath.',
  },
  heroCtaVehicles: { de: 'Fahrzeuge entdecken', en: 'Explore vehicles' },
  heroCtaAdvice: { de: 'Beratung vereinbaren', en: 'Book consultation' },
  heroRentLead: { de: 'Lieber erst mieten?', en: 'Prefer to rent first?' },
  heroRentLink: { de: 'Wohnmobil mieten', en: 'Rent a motorhome' },
  heroFactPartner: {
    de: 'Vertragspartner Challenger, LA STRADA & Eura Mobil',
    en: 'Authorised partner for Challenger, LA STRADA & Eura Mobil',
  },
  heroFactAdac: { de: 'ADAC-Mietstation Köln-Ost', en: 'ADAC rental station Cologne-East' },
  heroFactWorkshop: {
    de: 'Fachwerkstatt für Wohnmobile & Wohnwagen',
    en: 'Specialist workshop for motorhomes & caravans',
  },
  heroStock: { de: 'Fahrzeuge im Bestand', en: 'vehicles in stock' },
  heroAlt: {
    de: 'Wohnmobil an der Küste bei Sonnenuntergang',
    en: 'Motorhome on the coast at sunset',
  },

  faqEyebrow: { de: 'Häufige Fragen', en: 'FAQ' },
  faqTitle: { de: 'Gut zu wissen.', en: 'Good to know.' },
  faqLead: {
    de: 'Die wichtigsten Antworten rund um Kauf, Ankauf, Miete und Werkstatt.',
    en: 'Key answers on buying, trade-in, rental and workshop.',
  },

  /* vehicle UI labels */
  vehPrice: { de: 'Preis', en: 'Price' },
  vehMileage: { de: 'Kilometerstand', en: 'Mileage' },
  vehLength: { de: 'Länge', en: 'Length' },
  vehWeight: { de: 'Gewicht', en: 'Weight' },
  vehSleeps: { de: 'Schlafplätze', en: 'Berths' },
  vehSeats: { de: 'Sitzplätze', en: 'Seats' },
  vehYear: { de: 'Baujahr', en: 'Year' },
  vehNew: { de: 'Neu', en: 'New' },
  vehUsed: { de: 'Gebraucht', en: 'Used' },
  vehDetails: { de: 'Details', en: 'Details' },
  vehCompare: { de: 'Vergleichen', en: 'Compare' },
  vehSave: { de: 'Merken', en: 'Save' },
  vehFilter: { de: 'Filter', en: 'Filters' },
  vehResults: { de: 'Ergebnisse', en: 'Results' },
  vehNoResults: { de: 'Keine Fahrzeuge gefunden', en: 'No vehicles found' },
  onRequest: { de: 'Auf Anfrage', en: 'On request' },

  /* legal note for EN */
  legalEnNote: {
    de: '',
    en: 'German text is authoritative for legal pages. English is a convenience translation only.',
  },

  /* SEO defaults */
  seoHomeTitle: {
    de: 'Campingcenter Overath – Wohnmobile kaufen, mieten & Werkstatt',
    en: 'Campingcenter Overath – Buy, rent & service motorhomes',
  },
  seoHomeDesc: {
    de: 'Wohnmobile kaufen, mieten und professionell betreuen lassen: Vertragspartner von CHALLENGER, LA STRADA und EURA MOBIL, ADAC-Mietstation Köln-Ost und Fachwerkstatt in Overath.',
    en: 'Buy, rent and professionally care for motorhomes: authorised partner for CHALLENGER, LA STRADA and EURA MOBIL, ADAC rental station Cologne-East and specialist workshop in Overath.',
  },

  actionBarCall: { de: 'Anrufen', en: 'Call' },
  actionBarMessage: { de: 'Nachricht', en: 'Message' },
  actionBarAdvice: { de: 'Beratung', en: 'Advice' },

  daysMonFriShort: { de: 'Mo–Fr', en: 'Mon–Fri' },
  daysSatShort: { de: 'Sa', en: 'Sat' },
  hoursSuffix: { de: 'Uhr', en: '' },
} as const;

export type UiKey = keyof typeof ui;

export function t(lang: Locale, key: UiKey): string {
  const row = ui[key];
  return row[lang] || row.de;
}

export type UiDict = { [K in UiKey]: string };

export function dict(lang: Locale): UiDict {
  const out = {} as UiDict;
  for (const key of Object.keys(ui) as UiKey[]) {
    out[key] = t(lang, key);
  }
  return out;
}
