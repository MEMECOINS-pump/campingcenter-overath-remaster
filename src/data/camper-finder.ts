export type FinderOption = { value: string; label: string; text: string };
export type FinderQuestion = {
  name: string;
  title: string;
  hint: string;
  options: FinderOption[];
};

type QRow = { de: FinderQuestion; en: FinderQuestion };

const QUESTIONS: QRow[] = [
  {
    de: {
      name: 'persons',
      title: 'Wie viele Personen reisen mit?',
      hint: 'Damit wir Sitz- und Wohnraum richtig einschätzen.',
      options: [
        { value: '1', label: '1', text: 'Solo' },
        { value: '2', label: '2', text: 'Zu zweit' },
        { value: '3', label: '3', text: 'Kleine Gruppe' },
        { value: '4', label: '4', text: 'Familie' },
        { value: '5plus', label: '5+', text: 'Große Gruppe' },
      ],
    },
    en: {
      name: 'persons',
      title: 'How many people are travelling?',
      hint: 'So we can judge seating and living space correctly.',
      options: [
        { value: '1', label: '1', text: 'Solo' },
        { value: '2', label: '2', text: 'As a couple' },
        { value: '3', label: '3', text: 'Small group' },
        { value: '4', label: '4', text: 'Family' },
        { value: '5plus', label: '5+', text: 'Large group' },
      ],
    },
  },
  {
    de: {
      name: 'sleeps',
      title: 'Wie viele Schlafplätze werden benötigt?',
      hint: 'Nur Fahrzeuge mit passenden oder bestätigten Schlafplätzen zählen als harte Treffer.',
      options: [
        { value: '1', label: '1', text: '' },
        { value: '2', label: '2', text: '' },
        { value: '3', label: '3', text: '' },
        { value: '4', label: '4', text: '' },
        { value: '5plus', label: '5+', text: '' },
      ],
    },
    en: {
      name: 'sleeps',
      title: 'How many berths do you need?',
      hint: 'Only vehicles with matching or confirmed berths count as hard hits.',
      options: [
        { value: '1', label: '1', text: '' },
        { value: '2', label: '2', text: '' },
        { value: '3', label: '3', text: '' },
        { value: '4', label: '4', text: '' },
        { value: '5plus', label: '5+', text: '' },
      ],
    },
  },
  {
    de: {
      name: 'bedType',
      title: 'Welche Bettform bevorzugst du?',
      hint: 'Wenn die Bettform in den Quelldaten fehlt, werten wir sie nicht als Treffer.',
      options: [
        { value: 'einzelbetten', label: 'Einzelbetten', text: '' },
        { value: 'doppelbett', label: 'Doppelbett', text: '' },
        { value: 'queensbett', label: 'Queensbett', text: '' },
        { value: 'hubbett', label: 'Hubbett', text: '' },
        { value: 'etagenbett', label: 'Etagenbett', text: '' },
        { value: 'any', label: 'Keine Präferenz', text: '' },
      ],
    },
    en: {
      name: 'bedType',
      title: 'Which bed layout do you prefer?',
      hint: 'If bed layout is missing in the source data, we do not score it as a hit.',
      options: [
        { value: 'einzelbetten', label: 'Single beds', text: '' },
        { value: 'doppelbett', label: 'Double bed', text: '' },
        { value: 'queensbett', label: 'Queen bed', text: '' },
        { value: 'hubbett', label: 'Drop-down bed', text: '' },
        { value: 'etagenbett', label: 'Bunk beds', text: '' },
        { value: 'any', label: 'No preference', text: '' },
      ],
    },
  },
  {
    de: {
      name: 'bedLength',
      title: 'Welche Bettlänge benötigst du?',
      hint: 'Hilfreich besonders für größere Personen. Maße in cm – ohne Beleg in den Daten kein Treffer.',
      options: [
        { value: 'lt190', label: 'Unter 190 cm', text: 'kürzere Betten ok' },
        { value: 'min190', label: 'Mindestens 190 cm', text: '1,90 m' },
        { value: 'min195', label: 'Mindestens 195 cm', text: '1,95 m' },
        { value: 'min200', label: 'Mindestens 200 cm', text: '2,00 m' },
        { value: 'gt200', label: 'Über 200 cm', text: '2,00 m+' },
        { value: 'any', label: 'Keine Präferenz', text: '' },
      ],
    },
    en: {
      name: 'bedLength',
      title: 'What bed length do you need?',
      hint: 'Especially helpful for taller travellers. Lengths in cm — no hit without evidence in the data.',
      options: [
        { value: 'lt190', label: 'Under 190 cm', text: 'shorter beds OK' },
        { value: 'min190', label: 'At least 190 cm', text: '1.90 m' },
        { value: 'min195', label: 'At least 195 cm', text: '1.95 m' },
        { value: 'min200', label: 'At least 200 cm', text: '2.00 m' },
        { value: 'gt200', label: 'Over 200 cm', text: '2.00 m+' },
        { value: 'any', label: 'No preference', text: '' },
      ],
    },
  },
  {
    de: {
      name: 'lengthMax',
      title: 'Wie lang darf dein Fahrzeug maximal sein?',
      hint: 'Wir vergleichen mit der angegebenen Fahrzeuglänge.',
      options: [
        { value: '6', label: 'Bis 6 m', text: '' },
        { value: '6.5', label: 'Bis 6,5 m', text: '' },
        { value: '7', label: 'Bis 7 m', text: '' },
        { value: '7.5', label: 'Bis 7,5 m', text: '' },
        { value: 'any', label: 'Über 7,5 m / egal', text: '' },
      ],
    },
    en: {
      name: 'lengthMax',
      title: 'What is the maximum vehicle length?',
      hint: 'Filters by normalised vehicle length in mm.',
      options: [
        { value: '6', label: 'Up to 6 m', text: '' },
        { value: '6.5', label: 'Up to 6.5 m', text: '' },
        { value: '7', label: 'Up to 7 m', text: '' },
        { value: '7.5', label: 'Up to 7.5 m', text: '' },
        { value: 'any', label: 'Over 7.5 m / any', text: '' },
      ],
    },
  },
  {
    de: {
      name: 'condition',
      title: 'Neu oder gebraucht?',
      hint: 'Optional – du kannst beides offen lassen.',
      options: [
        { value: 'neu', label: 'Neufahrzeug', text: '' },
        { value: 'gebraucht', label: 'Gebraucht', text: '' },
        { value: 'any', label: 'Beides', text: '' },
      ],
    },
    en: {
      name: 'condition',
      title: 'New or used?',
      hint: 'Optional — you can leave both open.',
      options: [
        { value: 'neu', label: 'New vehicle', text: '' },
        { value: 'gebraucht', label: 'Used', text: '' },
        { value: 'any', label: 'Either', text: '' },
      ],
    },
  },
  {
    de: {
      name: 'budget',
      title: 'Welches Budget hast du im Kopf?',
      hint: 'Nur zur Orientierung – Finanzierung und Inzahlungnahme besprechen wir gern persönlich.',
      options: [
        { value: 'bis50', label: 'Bis 50.000 €', text: '' },
        { value: '50-80', label: '50–80.000 €', text: '' },
        { value: '80+', label: 'Über 80.000 €', text: '' },
        { value: 'any', label: 'Noch offen', text: '' },
      ],
    },
    en: {
      name: 'budget',
      title: 'What budget do you have in mind?',
      hint: 'Guidance only — financing and part-exchange are best discussed in person.',
      options: [
        { value: 'bis50', label: 'Up to €50,000', text: '' },
        { value: '50-80', label: '€50–80,000', text: '' },
        { value: '80+', label: 'Over €80,000', text: '' },
        { value: 'any', label: 'Still open', text: '' },
      ],
    },
  },
];

export function finderQuestions(): FinderQuestion[] {
  return QUESTIONS.map((q) => ('de' in q ? q.de : q));
}
