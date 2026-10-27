import { t, type Locale } from '@/i18n';

export interface NavItem {
  label: string;
  href: string;
  hint?: string;
  children?: NavItem[];
}

export function mainNavFor(lang: Locale): NavItem[] {
  return [
    {
      label: t(lang, 'navSale'),
      href: '/wohnmobile/',
      hint: t(lang, 'navSaleHint'),
      children: [
        { label: t(lang, 'navAllVehicles'), href: '/wohnmobile/', hint: t(lang, 'navAllVehiclesHint') },
        { label: t(lang, 'navUsed'), href: '/wohnmobil-verkauf/', hint: t(lang, 'navUsedHint') },
        { label: t(lang, 'navFinder'), href: '/camper-finder/', hint: t(lang, 'navFinderHint') },
        { label: t(lang, 'navBrands'), href: '/marken/', hint: t(lang, 'navBrandsHint') },
        { label: t(lang, 'navConfigurator'), href: '/la-strada-konfigurator/', hint: t(lang, 'navConfiguratorHint') },
        { label: t(lang, 'navWishlist'), href: '/merkliste/', hint: t(lang, 'navWishlistHint') },
      ],
    },
    { label: t(lang, 'navTradeIn'), href: '/wohnmobil-ankauf/', hint: t(lang, 'navTradeInHint') },
    { label: t(lang, 'navRental'), href: '/vermietung-wohnmobile/', hint: t(lang, 'navRentalHint') },
    { label: t(lang, 'navWorkshop'), href: '/werkstatt-kundendienst/', hint: t(lang, 'navWorkshopHint') },
    { label: t(lang, 'navAbout'), href: '/ueber-uns/', hint: t(lang, 'navAboutHint') },
  ];
}

export function moreNavFor(lang: Locale): NavItem[] {
  return [
    { label: t(lang, 'navTour'), href: '/360-rundgang/' },
    { label: t(lang, 'navWash'), href: '/fahrzeugwaesche-herbst/' },
    { label: t(lang, 'navJobs'), href: '/jobs/' },
    { label: t(lang, 'navContact'), href: '/kontakt/' },
  ];
}

export function legalNavFor(lang: Locale): NavItem[] {
  return [
    { label: t(lang, 'navImprint'), href: '/impressum/' },
    { label: t(lang, 'navPrivacy'), href: '/datenschutz/' },
    { label: t(lang, 'navTerms'), href: '/agb/' },
    { label: t(lang, 'navA11y'), href: '/barrierefreiheit/' },
  ];
}

/** @deprecated Prefer mainNavFor(lang) — German default for legacy imports. */
export const mainNav: NavItem[] = mainNavFor('de');
/** @deprecated Prefer moreNavFor(lang) */
export const moreNav: NavItem[] = moreNavFor('de');
/** @deprecated Prefer legalNavFor(lang) */
export const legalNav: NavItem[] = legalNavFor('de');
