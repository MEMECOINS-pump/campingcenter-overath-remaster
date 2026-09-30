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
    inlineStylesheets: 'auto',
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
        "connect-src 'self' https://formspree.io",
        "frame-src https://www.youtube-nocookie.com https://www.google.com",
        "media-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://formspree.io mailto:",
        'upgrade-insecure-requests',
      ],
    },
  },
  integrations: [
    sitemap({
      filter: (page) => !/\/(danke|merkliste|vergleich|download)\//.test(page),
    }),
  ],
});
