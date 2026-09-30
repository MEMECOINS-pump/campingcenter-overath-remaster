import { company, openingHours } from '@/data/company';
import type { Faq } from '@/data/faqs';
import type { Job } from '@/data/jobs';
import { absoluteUrl } from './url';
import { vehicleImage, type Vehicle } from './vehicles';

type Json = Record<string, unknown>;

const orgId = (site: URL | undefined) => `${absoluteUrl('/', site)}#organization`;

const postalAddress = {
  '@type': 'PostalAddress',
  streetAddress: company.address.street,
  postalCode: company.address.postalCode,
  addressLocality: company.address.city,
  addressRegion: company.address.region,
  addressCountry: company.address.country,
};

/** AutoDealer (LocalBusiness subtype). Deliberately no ratings/reviews. */
export function organizationSchema(site: URL | undefined): Json {
  return {
    '@context': 'https://schema.org',
    '@type': ['AutoDealer', 'AutoRepair'],
    '@id': orgId(site),
    name: company.name,
    legalName: company.legalName,
    slogan: company.claim,
    description: company.description,
    url: absoluteUrl('/', site),
    logo: absoluteUrl('/icon-512.png', site),
    image: absoluteUrl('/og-default.jpg', site),
    telephone: company.phone.e164,
    faxNumber: company.fax.display,
    email: company.email,
    vatID: company.vatId,
    address: postalAddress,
    hasMap: company.mapsSearch,
    openingHoursSpecification: openingHours.flatMap((p) =>
      p.hours.map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: p.schemaDays,
        opens: h.opens,
        closes: h.closes,
      })),
    ),
    brand: ['EURA MOBIL', 'CHALLENGER', 'KNAUS', 'LA STRADA', 'PANAMA'].map((name) => ({ '@type': 'Brand', name })),
    sameAs: [company.officialWebsite, company.social.facebook],
  };
}

export function breadcrumbSchema(items: { label: string; href?: string }[], site: URL | undefined): Json {
  const all = [{ label: 'Start', href: '/' }, ...items];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absoluteUrl(c.href, site) } : {}),
    })),
  };
}

export function vehicleSchema(v: Vehicle, pageUrl: string, site: URL | undefined): Json {
  return {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Vehicle'],
    name: v.title,
    brand: { '@type': 'Brand', name: v.make },
    model: v.model,
    vehicleConfiguration: v.categoryLabel,
    image: v.images.slice(0, 6).map((id) => vehicleImage(id, 1024)),
    itemCondition: v.condition === 'neu' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
    ...(v.mileageKm !== null ? { mileageFromOdometer: { '@type': 'QuantitativeValue', value: v.mileageKm, unitCode: 'KMT' } } : {}),
    ...(v.firstRegistration ? { dateVehicleFirstRegistered: v.firstRegistration } : {}),
    ...(v.modelYear ? { vehicleModelDate: String(v.modelYear) } : {}),
    ...(v.fuel ? { fuelType: v.fuel } : {}),
    ...(v.transmission ? { vehicleTransmission: v.transmission } : {}),
    ...(v.color ? { color: v.color } : {}),
    offers: {
      '@type': 'Offer',
      url: pageUrl,
      price: v.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      seller: { '@id': orgId(site) },
    },
  };
}

export function faqSchema(items: Faq[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceSchema(name: string, description: string, path: string, site: URL | undefined): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteUrl(path, site),
    provider: { '@id': orgId(site) },
    areaServed: { '@type': 'City', name: 'Overath' },
  };
}

export function jobSchema(job: Job, site: URL | undefined): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: [job.intro, ...job.tasks, ...job.requirements, ...job.offer].map((t) => `<p>${t}</p>`).join(''),
    datePosted: job.sourceModified,
    employmentType: job.schemaEmploymentType,
    hiringOrganization: { '@type': 'Organization', name: company.legalName, sameAs: company.officialWebsite },
    jobLocation: { '@type': 'Place', address: postalAddress },
    url: absoluteUrl(`/${job.slug}/`, site),
    ...(job.pay
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'EUR',
            value: { '@type': 'QuantitativeValue', minValue: job.pay.min, maxValue: job.pay.max, unitText: job.pay.unit },
          },
        }
      : {}),
  };
}
