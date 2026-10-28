import { company } from '@/data/company';
import type { FinderAnswers } from '@/lib/filter';

const FIELD_LABELS: Record<keyof FinderAnswers, string> = {
  persons: 'Mit wem',
  seats: 'Sitzplätze',
  sleeps: 'Schlafplätze',
  bedType: 'Bettform',
  bedLength: 'Bettlänge',
  lengthMax: 'Maximale Fahrzeuglänge',
  transmission: 'Getriebe',
  condition: 'Zustand',
  budget: 'Budget',
  style: 'Reiseart',
};

const VALUE_LABELS: Record<string, string> = {
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5plus': '5 oder mehr',
  einzelbetten: 'Einzelbetten',
  doppelbett: 'Doppelbett',
  queensbett: 'Queensbett',
  hubbett: 'Hubbett',
  etagenbett: 'Etagenbett',
  any: 'keine Präferenz',
  lt190: 'unter 190 cm',
  min190: 'mindestens 190 cm',
  min195: 'mindestens 195 cm',
  min200: 'mindestens 200 cm',
  gt200: 'über 200 cm',
  '6': 'bis 6 m',
  '6.5': 'bis 6,5 m',
  '7': 'bis 7 m',
  '7.5': 'bis 7,5 m',
  neu: 'Neufahrzeug',
  gebraucht: 'Gebrauchtfahrzeug',
  bis50: 'bis 50.000 €',
  '50-80': '50.000–80.000 €',
  '80+': 'über 80.000 €',
  kompakt: 'kurze Trips',
  offen: 'flexibel',
  komfort: 'längere Reisen',
  raum: 'viel Raum',
  Schaltgetriebe: 'Schaltgetriebe',
  Automatik: 'Automatik',
};

export interface FinderLeadInput {
  name: string;
  email: string;
  phone: string;
  answers: FinderAnswers;
  recommendedVehicleIds: string[];
}

/** German e-mail the Camper-Finder prepares when no API is configured. */
export function formatFinderLead(input: FinderLeadInput): { to: string; subject: string; body: string } {
  const answers = (Object.keys(FIELD_LABELS) as (keyof FinderAnswers)[])
    .filter((key) => input.answers[key])
    .map((key) => {
      const raw = String(input.answers[key]);
      return `- ${FIELD_LABELS[key]}: ${VALUE_LABELS[raw] ?? raw}`;
    });

  const body = [
    'Anfrage aus dem Camper-Finder',
    `Name: ${input.name}`,
    `E-Mail: ${input.email}`,
    `Telefon: ${input.phone || '–'}`,
    '',
    'Antworten:',
    ...(answers.length ? answers : ['- keine Angaben']),
    '',
    `Empfohlene Fahrzeuge: ${input.recommendedVehicleIds.join(', ') || '–'}`,
  ].join('\n');

  return {
    to: company.emails.finderReport,
    subject: 'Camper-Finder – neue Anfrage',
    body,
  };
}
