import type { ImageMetadata } from 'astro';
import euraMobil from '@/assets/logos/eura-mobil.png';
import challenger from '@/assets/logos/challenger.webp';
import knaus from '@/assets/logos/knaus.png';
import laStrada from '@/assets/logos/la-strada.png';
import panama from '@/assets/logos/panama.png';
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

/** Vertragshändler-Marken laut ccoverath.de (Startseite, /wohnmobile/). */
export const brands: Brand[] = [
  {
    id: 'challenger',
    name: 'Challenger',
    inventoryMake: 'Challenger',
    logo: challenger,
    website: 'https://www.reisemobile-challenger.de/',
    summary: 'Offizieller Partner von Challenger – aktuelle Modelle findest du auf der offiziellen deutschen Challenger-Website.',
  },
  {
    id: 'eura-mobil',
    name: 'EURA MOBIL',
    inventoryMake: 'Eura Mobil',
    logo: euraMobil,
    website: 'https://www.euramobil.de/',
    summary: 'Vertragshändler für EURA MOBIL Reisemobile.',
  },
  {
    id: 'knaus',
    name: 'KNAUS',
    inventoryMake: 'Knaus',
    logo: knaus,
    website: 'https://www.knaus.com/',
    summary: 'Vertragshändler für KNAUS Reisemobile.',
  },
  {
    id: 'la-strada',
    name: 'LA STRADA',
    inventoryMake: 'La Strada',
    logo: laStrada,
    website: 'https://www.lastrada-mobile.de/',
    summary: 'Vertragshändler für LA STRADA – die deutsche Manufaktur für Reisemobile.',
  },
  {
    id: 'panama',
    name: 'PANAMA',
    logo: panama,
    website: 'https://www.panama-van.de/',
    summary: 'Der PANAMA-Profi im Raum Köln: Peak, Peak Next Generation und Urban.',
    internalHref: '/panama/',
  },
];

export interface Partner {
  name: string;
  logo: ImageMetadata;
  website: string;
}

/** „Unsere Partner“ laut ccoverath.de (Startseite, Vermietung). */
export const partners: Partner[] = [
  { name: 'RMV Reise-Mobil-Versicherung', logo: rmv, website: 'https://www.rmv-versicherung.de/' },
  { name: 'Büttner Elektronik', logo: buettner, website: 'https://www.buettner-elektronik.de/home.html' },
  { name: 'RK Reich', logo: reich, website: 'https://reich-web.com/' },
  { name: 'ALDEN', logo: alden, website: 'https://www.alden-deutschland.com/' },
];
