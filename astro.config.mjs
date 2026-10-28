// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages serves project sites from a sub-path (/<repo>/). The deploy workflow
// injects SITE_URL and BASE_PATH from actions/configure-pages; locally both default
// to the root so `npm run dev` works without configuration.
const site = process.env.SITE_URL || 'http://localhost:4321';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  output: 'static',
  compressHTML: true,
  build: {
    format: 'directory',
    inlineStylesheets: 'never',
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  image: {
    responsiveStyles: false,
  },
  // Retired URLs of ccoverath.de that still receive links. Static redirect pages do
  // not prefix the destination with `base`, so it is added here.
  redirects: Object.fromEntries(
    Object.entries({
      '/download/': '/',
      '/caravan-salon/': '/',
      '/fruehjahrswaesche/': '/fahrzeugwaesche-herbst/',
      '/newsletter/': '/kontakt/',
      '/werkstatt/': '/werkstatt-kundendienst/',
      '/ankauf/': '/wohnmobil-ankauf/',
      '/vermietung/': '/vermietung-wohnmobile/',
      '/barrierefreiheitserklaerung/': '/barrierefreiheit/',
    }).map(([from, to]) => [from, `${base.replace(/\/$/, '')}${to}`]),
  ),
  markdown: {
    syntaxHighlight: false,
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-sans',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/InterVariable-latin.woff2'], weight: '100 900', style: 'normal' },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Fraunces',
      cssVariable: '--font-display',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          { src: ['./src/assets/fonts/FrauncesVariable-latin.woff2'], weight: '100 900', style: 'normal' },
        ],
      },
    },
  ],
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data: blob: https://img.classistatic.de",
        "font-src 'self'",
        "connect-src 'self' https://formspree.io https://*.workers.dev",
        "frame-src https://www.youtube-nocookie.com https://www.google.com https://konfigurator.lastrada-mobile.de",
        "media-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://formspree.io mailto:",
        // Not set: on an http preview WebKit upgrades every script to https and
        // then fails the TLS handshake, so the site never boots. The public site
        // is already https, and browsers block mixed active content there.
      ],
      // JS sets CSS vars for progress bars / chat resize / compare cols.
      // Keep hashed style-src for <style> elements; allow only style attributes.
      // View-transition CSS for main lives in global.css (no Astro-injected <style>).
      styleDirective: {
        resources: [{ resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(danke|merkliste|vergleich|download)\//.test(page),
    }),
  ],
});
