import type { ImageMetadata } from 'astro';
import euraMobil from '@/assets/logos/eura-mobil.png';
import challenger from '@/assets/logos/challenger.webp';
import laStrada from '@/assets/logos/la-strada.png';
import rmv from '@/assets/logos/rmv.png';
import buettner from '@/assets/logos/buettner.png';
import reich from '@/assets/logos/reich.png';
import alden from '@/assets/logos/alden.png';

export interface Brand {
  id: string;
  name: string;
  /** Name as used in the mobile.de inventory (`make`). */
  inventoryMake?: string;
  logo: ImageMetadata;
  website: string;
  summary: string;
  internalHref?: string;
}

/** Offizielle Vertragspartner-Marken (Challenger, La Strada, Eura Mobil). */
export const brands: Brand[] = [
  {
    id: 'challenger',
    name: 'Challenger',
    inventoryMake: 'Challenger',
    logo: challenger,
    website: 'https://www.reisemobile-challenger.de/',
    summary:
      'Vertragspartner für Challenger (Trigano): Vans, Teilintegrierte, Gamme X, Alkoven und Vollintegrierte – Beratung, Bestand und Service in Overath.',
  },
  {
    id: 'la-strada',
    name: 'LA STRADA',
    inventoryMake: 'La Strada',
    logo: laStrada,
    website: 'https://www.lastrada-mobile.de/',
    summary: 'Vertragspartner für LA STRADA – deutsche Manufaktur-Qualität. Konfiguriere dein Modell und frage dein Angebot bei uns an.',
    internalHref: '/la-strada-konfigurator/',
  },
  {
    id: 'eura-mobil',
    name: 'EURA MOBIL',
    inventoryMake: 'Eura Mobil',
    logo: euraMobil,
    website: 'https://www.euramobil.de/',
    summary: 'Vertragspartner für EURA MOBIL Reisemobile – vom Familienmobil bis zum Premium-Alkoven.',
  },
];

export interface Partner {
  name: string;
  logo: ImageMetadata;
  website: string;
}

/** Technik- und Service-Partner (keine Fahrzeugmarken). */
export const partners: Partner[] = [
  { name: 'RMV Reise-Mobil-Versicherung', logo: rmv, website: 'https://www.rmv-versicherung.de/' },
  { name: 'Büttner Elektronik', logo: buettner, website: 'https://www.buettner-elektronik.de/home.html' },
  { name: 'RK Reich', logo: reich, website: 'https://reich-web.com/' },
  { name: 'ALDEN', logo: alden, website: 'https://www.alden-deutschland.com/' },
];
