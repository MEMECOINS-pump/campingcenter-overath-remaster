/**
 * English page copy — factual parity with DE content from ccoverath.de.
 * Legal pages stay DE-authoritative; this file is convenience marketing copy only.
 */
import { rental as rentalDe, ankauf as ankaufDe } from './content';
import { serviceGroups as serviceGroupsDe } from './services';
import { brands as brandsDe } from './brands';

export const rentalEn = {
  ...rentalDe,
  station: 'ADAC motorhome hire, rental station Cologne-East',
  intro:
    'Campingcenter Overath is an established rental station of ADAC motorhome hire in Cologne-East. Rent with us on site or online around the clock via our partner ADAC.',
  partnership:
    'This long-standing partnership gives you double benefits: the service and know-how of our team, combined with ADAC motorhome hire.',
  benefits: [
    { title: 'New vehicles', text: 'You travel in new rental vehicles.' },
    { title: 'Bike racks', text: 'So your bikes can come along.' },
    { title: '3% discount for ADAC members', text: 'ADAC members receive a 3% discount on motorhome rental.' },
  ],
  hygiene: 'Our motorhomes and caravans are disinfected again after every hire.',
  freedom:
    'A motorhome keeps you flexible — away from large resorts and mass tourism. You can adjust your route anytime to weather and mood.',
};

export const ankaufEn = {
  ...ankaufDe,
  vehicleTypes: ['Motorhome', 'Caravan', 'Van', 'Boat'],
  promise: 'In a few steps you receive your non-binding offer — within 24 hours.',
  reasons: [
    {
      title: 'Fair price & fast valuation',
      text: 'We value your vehicle transparently and fairly — no hidden fees. Within 24 hours you receive a non-binding offer based on market value, condition and equipment.',
    },
    {
      title: 'Checked by campers',
      text: 'We are campers ourselves and know what matters. Your vehicle is assessed professionally — by people who travel too.',
    },
    {
      title: 'Experience and a strong network',
      text: 'For decades we have been active in the motorhome trade and built a large network of camping enthusiasts across Germany and Europe.',
    },
  ],
  process: [
    {
      title: 'Submit an enquiry',
      text: 'Share the key details about your vehicle online. The more detail, the more accurate the valuation.',
    },
    {
      title: 'Valuation & offer within 24 h',
      text: 'Our experts review your details and determine a fair market price. Within 24 hours you receive your non-binding offer.',
    },
    {
      title: 'Secure payment & collection',
      text: 'If you agree, payment is secure and fast. If you cannot come by, we collect the vehicle — nationwide in Germany.',
    },
    {
      title: 'Deregistration & onward sale',
      text: 'On request we handle deregistration and paperwork — and place your vehicle with new happy owners.',
    },
  ],
};

export const storyEn = {
  headline: 'By campers, for campers',
  lead: 'The experts at Campingcenter Overath are there with advice and support. The founders and team are enthusiastic campers themselves — and that passion shapes their daily work.',
  body: [
    'For 30 years Campingcenter Overath has offered travellers, camping fans and first-time campers more than just a caravan or motorhome. We advise thoroughly and professionally — and find the right solution for your holiday on four wheels together with you.',
    'Many know the respected camping centre on Weberstraße and value quality and competent service. With long-standing colleagues we re-established as Campingcenter Overath. Our proven sales and workshop team is committed to camping culture.',
    'We look forward to long-standing customers — and of course to new camping friends who appreciate quality, service and experience for a relaxing holiday on wheels.',
  ],
};

export const workshopHighlightsEn = [
  {
    title: 'Safety check with seal',
    text: 'TÜV approval, gas check, watertightness tests, services and brake adjustment.',
  },
  {
    title: 'Specialists for moisture and GRP damage',
    text: 'We repair GRP damage and fix the resulting moisture damage.',
  },
  {
    title: 'Upgrade for energy savings',
    text: 'LED, solar, photovoltaics or new technologies for efficient heating.',
  },
] as const;

export const serviceGroupsEn = serviceGroupsDe.map((g) => {
  const map: Record<string, { title: string; lead: string; items: string[] }> = {
    pruefung: {
      title: 'Inspection & safety',
      lead: 'Safety check with seal — so you can set off with peace of mind.',
      items: [
        'TÜV approvals',
        'Gas check',
        'Watertightness test',
        'Services',
        'Brake adjustment',
        'Overrun brake unit',
      ],
    },
    reparatur: {
      title: 'Repair & restoration',
      lead: 'Specialised in moisture and GRP damage — we fix the cause and the follow-on damage.',
      items: [
        'GRP repairs',
        'Removal of moisture damage',
        'Accident repairs of all kinds (GRP, roof and side walls, rear and front incl. sheet metal)',
        'Repair and fitting of furniture parts',
        'Caravan repairs',
      ],
    },
    technik: {
      title: 'Technology & autonomy',
      lead: 'Whether LED, solar or efficient heating: we advise how your motorhome becomes more comfortable, greener and cheaper to run.',
      items: [
        'Around the gas system: cooker, heating, fridge, gas alarms',
        'Around the electrical system',
        'Solar and photovoltaic systems',
        'Interior and exterior lighting, 12 V and 230 V systems',
        'Air conditioning',
        'Water supply (tap, boiler)',
        'Toilet systems',
      ],
    },
    komfort: {
      title: 'Comfort & equipment',
      lead: 'Special fittings and comfortable interiors — to your wishes.',
      items: [
        'Special fittings',
        'Awnings',
        'Sat systems and antennas',
        'Navigation systems and radio',
        'Roof hatches and elevating roofs',
        'Windows, entrance doors, service flaps, blinds and entrance steps',
      ],
    },
    fahrwerk: {
      title: 'Chassis & transport',
      lead: 'More comfort and more capacity: from bike racks to motorcycle platforms.',
      items: [
        'Air springs',
        'Motorcycle platforms',
        'Tow bars',
        'Bike racks',
        'Mover systems (Reich Mover, Truma-Mover)',
        'Stabilisers',
      ],
    },
  };
  const en = map[g.id];
  return en ? { ...g, ...en } : g;
});

export const brandsEn = brandsDe.map((b) => {
  const summaries: Record<string, string> = {
    challenger:
      'Authorised partner for Challenger (Trigano): vans, semi-integrated, Gamme X, overcab and fully integrated — advice, stock and service in Overath.',
    'la-strada':
      'Authorised partner for LA STRADA — German manufactory quality. Configure your model and request your offer with us.',
    'eura-mobil':
      'Authorised partner for EURA MOBIL motorhomes — from family models to premium overcab.',
  };
  return { ...b, summary: summaries[b.id] ?? b.summary };
});
