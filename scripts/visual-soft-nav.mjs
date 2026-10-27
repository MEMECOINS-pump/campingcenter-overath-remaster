import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://127.0.0.1:4174';
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
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
  await page.evaluate((p) => {
    const a = document.createElement('a');
    a.href = p;
    document.body.appendChild(a);
    a.click();
  }, route);
  try {
    await page.waitForURL((url) => {
      const path = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
      return path === route || path.endsWith(route);
    }, { timeout: 10000 });
  } catch {
    failed++;
    console.log(`FAIL ${route} → nav timeout (at ${page.url()})`);
    continue;
  }
  await page.waitForTimeout(60);
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
    (!info.hasPhero && !info.hasPageHero) ||
    (info.btnBg &&
      info.btnFg &&
      /rgb\(255,\s*255,\s*255\)/.test(info.btnBg) &&
      /rgb\(255,\s*255,\s*255\)/.test(info.btnFg));
  if (fail) failed++;
  console.log(`${fail ? 'FAIL' : 'OK  '} ${route}`, JSON.stringify(info));
}

await browser.close();
process.exitCode = failed ? 1 : 0;
