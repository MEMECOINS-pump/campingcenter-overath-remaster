import { company } from './company';
import type { Locale } from '@/i18n';

export interface Faq {
  q: string;
  a: string;
}

type FaqRow = { de: Faq; en: Faq };

/** Every answer paraphrases statements from ccoverath.de – no new claims. */
const FAQ_ROWS: FaqRow[] = [
  {
    de: {
      q: 'Welche Marken führt das Campingcenter Overath?',
      a: 'Wir sind Vertragspartner von CHALLENGER, LA STRADA und EURA MOBIL. Außerdem findest du bei uns gebrauchte Wohnmobile verschiedener Hersteller – vom Kastenwagen bis zum Alkoven.',
    },
    en: {
      q: 'Which brands does Campingcenter Overath carry?',
      a: 'We are an authorised partner for CHALLENGER, LA STRADA and EURA MOBIL. You will also find used motorhomes from various makers — from camper vans to overcab models.',
    },
  },
  {
    de: {
      q: 'Kann ich mein Wohnmobil an euch verkaufen?',
      a: 'Ja. Wir kaufen Wohnmobile, Wohnwagen, Vans und Boote an. Über unser Online-Formular erhältst du innerhalb von 24 Stunden ein unverbindliches Angebot. Auf Wunsch holen wir das Fahrzeug deutschlandweit ab und übernehmen die Abmeldung.',
    },
    en: {
      q: 'Can I sell my motorhome to you?',
      a: 'Yes. We buy motorhomes, caravans, vans and boats. Via our online form you usually receive a non-binding offer within 24 hours. On request we collect the vehicle nationwide in Germany and handle deregistration.',
    },
  },
  {
    de: {
      q: 'Nehmt ihr mein altes Wohnmobil in Zahlung?',
      a: 'Ja, wir nehmen dein altes Wohnmobil in Zahlung und bieten flexible Finanzierungsmöglichkeiten. Sprich uns einfach bei der Beratung darauf an.',
    },
    en: {
      q: 'Do you take my old motorhome in part-exchange?',
      a: 'Yes, we take your old motorhome in part-exchange and offer flexible financing options. Just mention it during your consultation.',
    },
  },
  {
    de: {
      q: 'Wie kann ich ein Wohnmobil mieten?',
      a: 'Wir sind Mietstation der ADAC Wohnmobilvermietung in Köln-Ost. Du kannst bei uns vor Ort mieten oder rund um die Uhr online über den ADAC buchen. ADAC-Mitglieder erhalten 3 % Rabatt.',
    },
    en: {
      q: 'How can I rent a motorhome?',
      a: 'We are a rental station of ADAC motorhome hire in Cologne-East. Rent with us on site or book online around the clock via ADAC. ADAC members receive a 3% discount.',
    },
  },
  {
    de: {
      q: 'Welche Prüfungen übernimmt eure Werkstatt?',
      a: 'Unter anderem TÜV-Abnahmen, Gasprüfungen, Dichtigkeitsprüfungen, Inspektionen und Bremseneinstellungen. Spezialisiert sind wir außerdem auf Nässe- und GFK-Schäden.',
    },
    en: {
      q: 'Which inspections does your workshop handle?',
      a: 'Among others: TÜV approvals, gas checks, watertightness tests, services and brake adjustments. We also specialise in moisture and GRP damage.',
    },
  },
  {
    de: {
      q: 'Kümmert ihr euch auch um Wohnwagen?',
      a: 'Ja. Wir reparieren Wohnwagen, montieren Rangiersysteme wie Reich Mover oder Truma-Mover und übernehmen Arbeiten an der Bremsen-Auflaufeinheit.',
    },
    en: {
      q: 'Do you also look after caravans?',
      a: 'Yes. We repair caravans, fit mover systems such as Reich Mover or Truma-Mover, and work on overrun brake units.',
    },
  },
  {
    de: {
      q: 'Kann ich online einen festen Werkstatttermin buchen?',
      a: `Über das Formular stellst du eine Terminanfrage mit deinem Wunschzeitraum. Wir melden uns dann bei dir und stimmen den Termin ab. Schneller geht es telefonisch unter ${company.phone.display}.`,
    },
    en: {
      q: 'Can I book a fixed workshop appointment online?',
      a: `Use the form to request an appointment with your preferred window. We then contact you to confirm. Faster by phone on ${company.phone.display}.`,
    },
  },
  {
    de: {
      q: 'Wann und wo finde ich euch?',
      a: 'Du findest uns in der Weberstraße 12 in 51491 Overath. Geöffnet ist Montag bis Freitag von 07:00 bis 13:00 und 14:00 bis 17:00 Uhr sowie samstags von 09:00 bis 13:00 Uhr.',
    },
    en: {
      q: 'When and where can I find you?',
      a: 'You will find us at Weberstraße 12, 51491 Overath. Open Monday to Friday 07:00–13:00 and 14:00–17:00, and Saturdays 09:00–13:00.',
    },
  },
];

/** @deprecated Prefer faqsFor(lang) — German default for legacy imports. */
export const faqs: Faq[] = FAQ_ROWS.map((r) => r.de);

export function faqsFor(lang: Locale): Faq[] {
  return FAQ_ROWS.map((r) => r[lang] || r.de);
}
