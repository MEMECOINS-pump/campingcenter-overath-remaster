/** Challenger Wartungshefte / Ergänzungen – hosted under /downloads/challenger/ */

export interface ChallengerManual {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  kind: 'wartungsheft' | 'ergaenzung' | 'service';
  file: string;
  sizeLabel: string;
  topics: string[];
}

export const challengerManuals: ChallengerManual[] = [
  {
    id: '2025-vans',
    title: 'Challenger Vans 2025',
    subtitle: 'Wartungsheft & Service (DE/FR u. a.)',
    year: '2025',
    kind: 'wartungsheft',
    file: 'challenger-2025-vans-wartungsheft.pdf',
    sizeLabel: '0,7 MB',
    topics: ['Garantie 2 + 7 Jahre', 'Dichtigkeitswartung', 'Service-Intervalle'],
  },
  {
    id: '2025-integral',
    title: 'Challenger Integral 2025',
    subtitle: 'Ergänzung Vollintegrierte',
    year: '2025',
    kind: 'ergaenzung',
    file: 'challenger-2025-integral-ergaenzung.pdf',
    sizeLabel: '3,4 MB',
    topics: ['Motorhaube', 'Elektrik', 'Wasser / Nutzlast'],
  },
  {
    id: 'vans-generic',
    title: 'Challenger Vans',
    subtitle: 'Wartungsheft (aktuelle Ausgabe)',
    year: 'aktuell',
    kind: 'wartungsheft',
    file: 'challenger-vans-wartungsheft.pdf',
    sizeLabel: '0,7 MB',
    topics: ['Serviceheft', 'Besitzerwechsel', 'Kontrollblätter'],
  },
  {
    id: 'integral-generic',
    title: 'Challenger Integral',
    subtitle: 'Ergänzung Vollintegrierte',
    year: 'aktuell',
    kind: 'ergaenzung',
    file: 'challenger-integral-ergaenzung.pdf',
    sizeLabel: '2,3 MB',
    topics: ['Vollintegrierte Besonderheiten', 'Sicherungen', 'Wassertank'],
  },
  {
    id: '2024-service-de',
    title: 'Challenger Service 2024',
    subtitle: 'Deutsche Service-Unterlage inkl. Maße',
    year: '2024',
    kind: 'service',
    file: 'challenger-2024-service-de.pdf',
    sizeLabel: '6,3 MB',
    topics: ['Hauptabmessungen', 'Modelle', 'Technische Hinweise'],
  },
  {
    id: '2022-service-de',
    title: 'Challenger Service 2022',
    subtitle: 'Deutsche Service-Unterlage',
    year: '2022',
    kind: 'service',
    file: 'challenger-2022-service-de.pdf',
    sizeLabel: '6,0 MB',
    topics: ['Wartung', 'Garantiebedingungen', 'Aufbau'],
  },
];

export const challengerManualHighlights = [
  {
    title: '2 Jahre Aufbau-Garantie',
    text: 'Gegen Herstellungsfehler, ohne Kilometerbegrenzung – ab 1. Zulassung.',
  },
  {
    title: '7 Jahre Dichtheit',
    text: 'Dichtigkeitsgarantie mit jährlicher Kontrolle im Vertragsnetz.',
  },
  {
    title: 'Fiat- & Ford-Basis',
    text: 'Basisfahrzeug hat eigene Herstellergarantie und eigenen Service.',
  },
] as const;
