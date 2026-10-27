/**
 * Soft-nav visual FOUC check (crumbs / phero / btn-light).
 * Usage:
 *   node scripts/visual-soft-nav.mjs http://127.0.0.1:4174
 *   BASE_PATH=/campingcenter-overath-remaster node scripts/visual-soft-nav.mjs https://memecoins-pump.github.io/campingcenter-overath-remaster
 */
import { chromium } from '@playwright/test';

const origin = (process.argv[2] || 'http://127.0.0.1:4174').replace(/\/$/, '');
const basePath = (process.env.BASE_PATH || '/').replace(/\/?$/, '/') === '/' ? '' : process.env.BASE_PATH.replace(/\/$/, '');

function url(p) {
  const path = p.startsWith('/') ? p : `/${p}`;
  return `${origin}${basePath}${path}`;
}

const routes = [
  '/werkstatt-kundendienst/',
  '/kontakt/',
  '/vermietung-wohnmobile/',
  '/jobs/',
  '/wohnmobile/',
  '/camper-finder/',
  '/wohnmobil-ankauf/',
  '/fahrzeugwaesche-herbst/',
  '/la-strada-konfigurator/',
  '/ueber-uns/',
  '/marken/',
  '/360-rundgang/',
  '/impressum/',
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let failed = 0;

for (const route of routes) {
  await page.goto(url('/'), { waitUntil: 'domcontentloaded' });
  const target = url(route);
  await page.evaluate((href) => {
    const a = document.createElement('a');
    a.href = href;
    document.body.appendChild(a);
    a.click();
  }, target);
  await page.waitForURL((u) => u.href.replace(/\/$/, '') === target.replace(/\/$/, '') || u.pathname.endsWith(route), {
    timeout: 15000,
  });
  await page.waitForTimeout(120);
  const info = await page.evaluate(() => {
    const crumbs = document.querySelector('.crumbs');
    const list = crumbs?.querySelector('ul, ol');
    const phero = document.querySelector('.phero');
    const pageHero = document.querySelector('.page-hero');
    const c = list ? getComputedStyle(list) : null;
    const h = phero ? getComputedStyle(phero) : null;
    const btn = document.querySelector('.phero .btn-light, .page-hero .btn-light');
    const b = btn ? getComputedStyle(btn) : null;
    const crumbText = crumbs ? (crumbs.innerText || '').replace(/\s+/g, ' ').trim() : '';
    const header = document.querySelector('[data-header]');
    return {
      crumbListStyle: c?.listStyleType ?? null,
      crumbDisplay: c?.display ?? null,
      crumbNumbered: /^\s*1\./.test(crumbText) || /\b1\.\s*Start/.test(crumbText),
      crumbText: crumbText.slice(0, 70),
      pheroMinH: h?.minHeight ?? null,
      btnBg: b?.backgroundColor ?? null,
      btnFg: b?.color ?? null,
      hasPhero: Boolean(phero),
      hasPageHero: Boolean(pageHero),
      headerPos: header ? getComputedStyle(header).position : null,
      fab: Boolean(document.querySelector('[data-companion-open]')),
      path: location.pathname,
    };
  });
  const fail =
    info.crumbNumbered ||
    (info.hasPhero && (!info.pheroMinH || parseFloat(info.pheroMinH) < 200)) ||
    (info.btnBg &&
      info.btnFg &&
      /rgb\(255,\s*255,\s*255\)/.test(info.btnBg) &&
      /rgb\(255,\s*255,\s*255\)/.test(info.btnFg)) ||
    (!info.hasPhero && !info.hasPageHero && route !== '/');
  if (fail) failed += 1;
  console.log(`${fail ? 'FAIL' : 'OK  '} ${route} → ${info.path}`, JSON.stringify(info));
}

await browser.close();
process.exit(failed ? 1 : 0);
