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
  daysSunday: { de: 'Sonntag', en: 'Sunday' },
  daysSundayHoliday: { de: 'So / Feiertag', en: 'Sun / holiday' },
  daysHolidaysNrw: { de: 'Feiertage (NRW)', en: 'Public holidays (NRW)' },
  closed: { de: 'geschlossen', en: 'closed' },

  brandClaim: {
    de: 'Wir pflegen die Kultur des Campings',
    en: 'We nurture the culture of camping',
  },
  brandMotto: { de: 'Von Campern für Camper', en: 'By campers, for campers' },
  brandFounded: { de: 'Seit 30 Jahren', en: 'For 30 years' },

  /* home sections */
  prestigeAria: { de: 'Warum Campingcenter Overath', en: 'Why Campingcenter Overath' },
  prestigeFamily: { de: 'Familiär in Overath', en: 'Family-run in Overath' },
  prestigePartners: { de: '3 Markenpartner', en: '3 brand partners' },
  prestigeStock: { de: 'Fahrzeuge', en: 'vehicles' },
  prestigeStockHint: { de: 'Aktueller Bestand', en: 'Current stock' },
  prestigeWorkshop: { de: 'Fachwerkstatt', en: 'Specialist workshop' },
  prestigeWorkshopHint: { de: 'Service & Nachrüstung', en: 'Service & retrofits' },
  prestigeAbout: { de: 'Über uns', en: 'About us' },

  finderHeroTitle: {
    de: 'Dein Camper. Dein Leben. Dein Match.',
    en: 'Your camper. Your life. Your match.',
  },
  finderHeroLead: {
    de: 'Sag uns, wie du reisen möchtest – wir zeigen dir Fahrzeuge, die wirklich zu deinen Anforderungen passen. Inklusive Sitzplätze, Schlafplätze, Bettlänge und Fahrzeuglänge.',
    en: 'Tell us how you want to travel — we show vehicles that really match your needs, including seats, berths, bed length and vehicle length.',
  },
  finderHeroCta: { de: 'Camper finden', en: 'Find a camper' },
  finderHeroStock: { de: 'Bestand ansehen', en: 'Browse stock' },
  finderHeroP1: {
    de: 'Persönliche Empfehlung statt Marken-Ratespiel',
    en: 'Personal recommendation instead of brand guessing',
  },
  finderHeroP2: {
    de: 'Bettlänge & Fahrzeuglänge als echte Filter',
    en: 'Bed length & vehicle length as real filters',
  },
  finderHeroP3: {
    de: 'Danach Beratung mit deinen Antworten',
    en: 'Then advice with your answers',
  },

  quickBuyTitle: { de: 'Wohnmobil kaufen', en: 'Buy a motorhome' },
  quickBuyText: { de: 'Finde dein nächstes Zuhause auf Rädern.', en: 'Find your next home on wheels.' },
  quickBuyCta: { de: 'Fahrzeuge entdecken', en: 'Explore vehicles' },
  quickSellTitle: { de: 'Fahrzeug verkaufen', en: 'Sell your vehicle' },
  quickSellText: { de: 'Einfach zum persönlichen Angebot.', en: 'Simply to a personal offer.' },
  quickSellCta: { de: 'Fahrzeug bewerten', en: 'Value my vehicle' },
  quickRentTitle: { de: 'Wohnmobil mieten', en: 'Rent a motorhome' },
  quickRentText: { de: 'Freiheit erleben, wann du willst.', en: 'Freedom whenever you want.' },
  quickRentCta: { de: 'Mietmöglichkeiten entdecken', en: 'Explore rental options' },
  quickWsTitle: { de: 'Werkstatt & Service', en: 'Workshop & service' },
  quickWsText: {
    de: 'Professioneller Service für deinen Camper.',
    en: 'Professional service for your camper.',
  },
  quickWsCta: { de: 'Werkstatt entdecken', en: 'Explore workshop' },
  quickAria: { de: 'Was möchtest du tun?', en: 'What would you like to do?' },

  featuredEyebrow: { de: 'Aktuell im Bestand', en: 'Currently in stock' },
  featuredTitle: {
    de: 'Fahrzeuge, die auf ihre nächste Reise warten.',
    en: 'Vehicles waiting for their next trip.',
  },
  featuredAll: { de: 'Alle {n} Fahrzeuge', en: 'All {n} vehicles' },
  featuredNote: {
    de: 'Angaben laut Fahrzeuginserat. Verfügbarkeit bitte telefonisch bestätigen lassen.',
    en: 'Details per listing. Please confirm availability by phone.',
  },
  featuredLead: {
    de: '{used} gebrauchte und {neu} neue Wohnmobile im aktuellen Bestand – zum Anschauen, Probesitzen und Beraten-Lassen in Overath.',
    en: '{used} used and {neu} new motorhomes in current stock — view, try and get advice in Overath.',
  },
  asOf: { de: 'Stand', en: 'As of' },

  arrivedEyebrow: { de: 'Frisch eingetroffen', en: 'Just arrived' },
  arrivedTitle: {
    de: 'Entdecke unsere neuesten Fahrzeuge und finde deinen nächsten Reisebegleiter.',
    en: 'Discover our newest vehicles and find your next travel companion.',
  },
  arrivedLeadBadge: {
    de: 'Frisch in unserem Bestand – mit Badge „NEU IM BESTAND“, wenn das Einstelldatum bestätigt ist.',
    en: 'Fresh in our stock — with a “NEW IN STOCK” badge when the listing date is confirmed.',
  },
  arrivedLead: {
    de: 'Eine aktuelle Auswahl aus unserem Bestand. Das genaue Einstelldatum folgt mit der Live-Synchronisation.',
    en: 'A current selection from our stock. Exact listing dates follow with live sync.',
  },
  arrivedCta: { de: 'Zum Bestand', en: 'To stock' },

  brandsEyebrow: { de: 'Vertragshändler', en: 'Authorised dealer' },
  brandsTitle: { de: 'Starke Marken. Persönliche Beratung.', en: 'Strong brands. Personal advice.' },
  brandsLead: {
    de: 'Als Vertragspartner von CHALLENGER, LA STRADA und EURA MOBIL beraten wir dich persönlich – und zeigen dir, welches Modell wirklich zu dir passt.',
    en: 'As an authorised partner for CHALLENGER, LA STRADA and EURA MOBIL we advise you personally — and show which model really fits you.',
  },
  brandsAll: { de: 'Alle Marken', en: 'All brands' },
  brandsOwnPage: { de: 'Eigene Themenseite', en: 'Dedicated page' },
  brandsInStock: { de: '{n} im Bestand', en: '{n} in stock' },
  brandsMore: { de: 'Mehr zur Marke', en: 'More about the brand' },

  ankaufEyebrow: { de: 'Wohnmobil verkaufen', en: 'Sell your motorhome' },
  ankaufTitle: { de: 'Dein Camper, fair bewertet.', en: 'Your camper, fairly valued.' },
  ankaufCta: { de: 'Fahrzeug bewerten', en: 'Value my vehicle' },

  wsTeaserEyebrow: { de: 'Werkstatt & Kundendienst', en: 'Workshop & aftersales' },
  wsTeaserTitle: {
    de: 'Dein Camper verdient den besten Service.',
    en: 'Your camper deserves the best service.',
  },
  wsTeaserLead: {
    de: 'Vom Sicherheitscheck bis zur Nachrüstung: Unsere Fachwerkstatt kümmert sich um Wohnmobile und Wohnwagen – spezialisiert auf Nässe- und GFK-Schäden.',
    en: 'From safety checks to retrofits: our specialist workshop looks after motorhomes and caravans — specialised in moisture and GRP damage.',
  },
  wsTeaserCta: { de: 'Werkstatt-Termin anfragen', en: 'Request workshop appointment' },
  wsTeaserMore: { de: 'Werkstatt entdecken', en: 'Explore workshop' },

  rentalEyebrow: { de: 'Wohnmobil mieten', en: 'Rent a motorhome' },
  rentalTitle: { de: 'Freiheit auf Zeit.', en: 'Freedom for a while.' },
  rentalLead: {
    de: 'Wir sind Mietstation der ADAC Wohnmobilvermietung in Köln-Ost. Miete bei uns vor Ort – oder buche rund um die Uhr online beim ADAC.',
    en: 'We are a rental station of ADAC motorhome hire in Cologne-East. Rent with us on site — or book online around the clock via ADAC.',
  },
  rentalCta: { de: 'Mietmöglichkeiten entdecken', en: 'Explore rental options' },
  rentalAdac: { de: 'Beim ADAC buchen', en: 'Book with ADAC' },
  rentalNote: {
    de: 'Die Online-Buchung erfolgt auf der Website der ADAC Autovermietung.',
    en: 'Online booking takes place on the ADAC car hire website.',
  },
  opensExternal: { de: 'öffnet externe Website des ADAC', en: 'opens ADAC external website' },

  storyEyebrow: { de: 'Über uns', en: 'About us' },
  storyTitle: { de: 'Von Campern für Camper.', en: 'By campers, for campers.' },
  storyCta: { de: 'Unsere Geschichte', en: 'Our story' },
  storyVisit: { de: 'Besuch uns in Overath', en: 'Visit us in Overath' },
  storyBadge: { de: 'Camping-Kompetenz in der Weberstraße', en: 'Camping expertise on Weberstraße' },

  contactTitle: { de: 'Wir sind für dich da.', en: "We're here for you." },
  contactEyebrow: { de: 'Kontakt & Anfahrt', en: 'Contact & directions' },
  contactCall: { de: 'Jetzt anrufen', en: 'Call now' },
  contactWrite: { de: 'Nachricht schreiben', en: 'Send a message' },
  contactRoute: { de: 'Route planen', en: 'Get directions' },
  contactPhoneLabel: { de: 'Telefon', en: 'Phone' },
  contactEmailLabel: { de: 'E-Mail', en: 'Email' },

  ctaTitle: {
    de: 'Bereit für dein nächstes Abenteuer?',
    en: 'Ready for your next adventure?',
  },
  ctaText: {
    de: 'Ob kaufen, mieten oder erst einmal beraten lassen – wir helfen dir dabei, den Camper zu finden, der zu deinem Leben passt.',
    en: 'Whether buying, renting or getting advice first — we help you find the camper that fits your life.',
  },

  toastFavAdd: { de: 'Zur Merkliste hinzugefügt', en: 'Added to wishlist' },
  toastFavRemove: { de: 'Von der Merkliste entfernt', en: 'Removed from wishlist' },
  toastCmpAdd: { de: 'Zum Vergleich hinzugefügt', en: 'Added to compare' },
  toastCmpRemove: { de: 'Aus dem Vergleich entfernt', en: 'Removed from compare' },
  toastCmpMax: {
    de: 'Maximal {n} Fahrzeuge im Vergleich – entferne zuerst eines.',
    en: 'Maximum {n} vehicles in compare — remove one first.',
  },
  toastCmpClear: { de: 'Vergleich geleert', en: 'Compare cleared' },
  favSaved: { de: 'Gemerkt', en: 'Saved' },
  favSave: { de: 'Merken', en: 'Save' },
  cmpOn: { de: 'Im Vergleich', en: 'In compare' },
  cmpAdd: { de: 'Vergleichen', en: 'Compare' },

  detailSimilar: { de: 'Ähnliche Fahrzeuge', en: 'Similar vehicles' },
  detailSimilarEyebrow: { de: 'Auch interessant', en: 'You may also like' },
  detailEnquire: { de: 'Fahrzeug anfragen', en: 'Enquire about vehicle' },
  detailSpecs: { de: 'Technische Daten', en: 'Specifications' },
  detailHighlights: { de: 'Highlights', en: 'Highlights' },
  detailNew: { de: 'Neufahrzeug', en: 'New vehicle' },
  detailUsed: { de: 'Gebraucht', en: 'Used' },
  detailUsedLower: { de: 'gebraucht', en: 'used' },
  detailPriceAria: { de: 'Preis: ', en: 'Price: ' },
  detailVat: { de: 'MwSt. ausweisbar · ', en: 'VAT reclaimable · ' },
  detailPriceNote: { de: 'Preis laut Fahrzeuginserat', en: 'Price as listed' },
  detailBookAdvice: { de: 'Beratung vereinbaren', en: 'Book consultation' },
  detailCall: { de: 'Anrufen', en: 'Call' },
  detailVehicleId: { de: 'Fahrzeug-Nr.', en: 'Vehicle no.' },
  detailAsOf: { de: 'Stand', en: 'As of' },
  detailTrustTitle: { de: 'Darauf kannst du dich verlassen', en: 'What you can rely on' },
  detailBenefitNew1Title: { de: 'Vertragshändler', en: 'Authorised dealer' },
  detailBenefitNew1Text: {
    de: 'Beratung und Übergabe direkt beim Vertragshändler für {make}.',
    en: 'Advice and handover directly from the authorised dealer for {make}.',
  },
  detailBenefitNew2Title: { de: 'Werkstatt im Haus', en: 'Workshop on site' },
  detailBenefitNew2Text: {
    de: 'Service, Wartung und Reparaturen später direkt bei uns in Overath.',
    en: 'Service, maintenance and repairs later — right here in Overath.',
  },
  detailBenefitNew3Title: { de: 'Inzahlungnahme möglich', en: 'Trade-in possible' },
  detailBenefitNew3Text: {
    de: 'Dein bisheriges Fahrzeug nehmen wir gern in Zahlung.',
    en: 'We are happy to take your current vehicle in trade.',
  },
  detailBenefitUsed1Title: { de: 'Von Campern geprüft', en: 'Checked by campers' },
  detailBenefitUsed1Text: {
    de: 'Unser Team aus echten Campern prüft Stauraum, Autarkie und Bordelektronik.',
    en: 'Our team of real campers checks storage, autonomy and onboard electronics.',
  },
  detailBenefitUsed2Title: { de: 'Werkstatt im Haus', en: 'Workshop on site' },
  detailBenefitUsed2Text: {
    de: 'Service, Wartung und Reparaturen direkt bei uns in Overath.',
    en: 'Service, maintenance and repairs right here in Overath.',
  },
  detailBenefitUsed3Title: { de: 'Finanzierung & Inzahlungnahme', en: 'Finance & trade-in' },
  detailBenefitUsed3Text: {
    de: 'Flexible Finanzierungsmöglichkeiten – und dein altes Wohnmobil nehmen wir in Zahlung.',
    en: 'Flexible finance options — and we take your previous motorhome in trade.',
  },
  detailSourceNote: {
    de: 'Angaben laut Fahrzeuginserat (Stand {date}). Irrtümer, Änderungen und Zwischenverkauf vorbehalten – Ausstattung und Verfügbarkeit bestätigen wir dir gern persönlich.',
    en: 'Details per listing (as of {date}). Errors, changes and prior sale reserved — we are happy to confirm equipment and availability in person.',
  },
  detailFullListing: {
    de: 'Vollständiges Inserat auf mobile.de',
    en: 'Full listing on mobile.de',
  },
  detailOpensTab: { de: ' (öffnet in neuem Tab)', en: ' (opens in a new tab)' },
  detailInquiryEyebrow: { de: 'Unverbindlich', en: 'No obligation' },
  detailInquiryLead: {
    de: 'Frag nach Details, vereinbare eine Besichtigung oder lass dir ein Angebot für dein bisheriges Fahrzeug machen.',
    en: 'Ask for details, arrange a viewing, or get an offer for your current vehicle.',
  },
  detailInquiryTopic: { de: 'Worum geht es?', en: 'What is this about?' },
  detailInquiryOpt1: { de: 'Rückfrage zum Fahrzeug', en: 'Question about the vehicle' },
  detailInquiryOpt2: { de: 'Besichtigung vereinbaren', en: 'Arrange a viewing' },
  detailInquiryOpt3: { de: 'Inzahlungnahme meines Fahrzeugs', en: 'Trade-in of my vehicle' },
  detailFormName: { de: 'Name', en: 'Name' },
  detailFormEmail: { de: 'E-Mail', en: 'Email' },
  detailFormPhone: { de: 'Telefon', en: 'Phone' },
  detailFormPhoneHint: { de: 'Für eine schnelle Rückmeldung', en: 'For a quick reply' },
  detailFormMessage: { de: 'Nachricht', en: 'Message' },
  detailFormSubmit: { de: 'Anfrage senden', en: 'Send enquiry' },
  detailFormSuccessTitle: { de: 'Danke für deine Anfrage!', en: 'Thanks for your enquiry!' },
  detailFormSuccessText: {
    de: 'Wir melden uns zum {title} so schnell wie möglich – in der Regel innerhalb der Öffnungszeiten.',
    en: 'We will get back to you about the {title} as soon as possible — usually within opening hours.',
  },
  detailInquiryMsg: {
    de: 'Hallo, ich interessiere mich für den {title} (Fahrzeug-Nr. {id}, {price}). Bitte meldet euch bei mir.',
    en: 'Hello, I am interested in the {title} (vehicle no. {id}, {price}). Please get in touch.',
  },
  detailInquirySubject: {
    de: 'Fahrzeuganfrage: {title} (Nr. {id})',
    en: 'Vehicle enquiry: {title} (no. {id})',
  },
  detailSeoDesc: {
    de: '{title} – {condition}, {category}, {price}. {facts}. Jetzt anfragen beim Campingcenter Overath.',
    en: '{title} – {condition}, {category}, {price}. {facts}. Enquire now at Campingcenter Overath.',
  },
  detailAllVehicles: { de: 'Alle Fahrzeuge', en: 'All vehicles' },
  detailEnquireShort: { de: 'Anfragen', en: 'Enquire' },
  detailSpecCondition: { de: 'Zustand', en: 'Condition' },
  detailSpecCategory: { de: 'Fahrzeugart', en: 'Body type' },
  detailSpecModelYear: { de: 'Modelljahr', en: 'Model year' },
  detailSpecFirstReg: { de: 'Erstzulassung', en: 'First registration' },
  detailSpecMileage: { de: 'Kilometerstand', en: 'Mileage' },
  detailSpecPower: { de: 'Leistung', en: 'Power' },
  detailSpecFuel: { de: 'Kraftstoff', en: 'Fuel' },
  detailSpecTransmission: { de: 'Getriebe', en: 'Transmission' },
  detailSpecLength: { de: 'Länge', en: 'Length' },
  detailSpecWeight: { de: 'Zul. Gesamtgewicht', en: 'Gross vehicle weight' },
  detailSpecEmission: { de: 'Schadstoffklasse', en: 'Emission class' },
  detailSpecOwners: { de: 'Vorbesitzer', en: 'Previous owners' },
  detailSpecHu: { de: 'HU', en: 'MOT' },
  detailSpecColor: { de: 'Farbe', en: 'Colour' },
  detailOnRequest: { de: 'auf Anfrage', en: 'on request' },
  detailHuNew: { de: 'neu', en: 'new' },
  detailHuUntil: { de: 'bis {date}', en: 'until {date}' },

  wishlistTitle: { de: 'Merkliste – deine gemerkten Wohnmobile', en: 'Wishlist – your saved motorhomes' },
  wishlistDesc: {
    de: 'Deine gemerkten Wohnmobile beim Campingcenter Overath – lokal in deinem Browser gespeichert, jederzeit vergleichen und anfragen.',
    en: 'Your saved motorhomes at Campingcenter Overath — stored locally in your browser, ready to compare and enquire.',
  },
  wishlistEyebrow: { de: 'Merkliste', en: 'Wishlist' },
  wishlistH1: { de: 'Deine Favoriten', en: 'Your favourites' },
  wishlistLead: {
    de: 'Gespeichert nur hier in deinem Browser – ohne Konto, ohne Übertragung. Vergleiche deine Favoriten oder frag sie gesammelt an.',
    en: 'Stored only in your browser — no account, no upload. Compare favourites or enquire about them together.',
  },
  wishlistAria: { de: 'Gemerkte Fahrzeuge', en: 'Saved vehicles' },
  wishlistNoun: { de: 'Fahrzeuge', en: 'vehicles' },
  wishlistSaved: { de: 'gemerkt', en: 'saved' },
  wishlistInquireAll: { de: 'Gesammelt anfragen', en: 'Enquire about all' },
  wishlistCompare: { de: 'Vergleichen', en: 'Compare' },
  wishlistClear: { de: 'Alle entfernen', en: 'Remove all' },
  wishlistEmptyTitle: { de: 'Noch nichts gemerkt.', en: 'Nothing saved yet.' },
  wishlistEmptyText: {
    de: 'Tippe bei einem Fahrzeug auf das Herz – dann findest du es hier wieder, auch beim nächsten Besuch.',
    en: 'Tap the heart on a vehicle — you will find it here again on your next visit.',
  },
  wishlistBrowse: { de: 'Fahrzeuge entdecken', en: 'Browse vehicles' },
  wishlistFinder: { de: 'Camper-Finder starten', en: 'Start Camper Finder' },
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
