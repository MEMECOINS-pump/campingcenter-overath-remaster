/**
 * Soft-nav + hard-load visual/CSP audit against a running preview.
 * Usage: node scripts/soft-nav-audit.mjs [baseURL]
 */
import { chromium } from '@playwright/test';

const baseURL = process.argv[2] || 'http://127.0.0.1:4174';

const routes = [
  { path: '/', name: 'Start', expect: { hero: '.hero, .cf-hero, [data-hero]', crumbs: false } },
  { path: '/wohnmobile/', name: 'Showroom', expect: { hero: '.page-hero, .phero, .sr-hero', crumbs: true } },
  { path: '/wohnmobile/challenger-240-graphite-solar-arctic-46984365116544/', name: 'Detail', expect: { hero: '.phero, .page-hero, .vd-hero', crumbs: true } },
  { path: '/vergleich/', name: 'Vergleichen', expect: { hero: '.page-hero, .cmp-hero', crumbs: true } },
  { path: '/camper-finder/', name: 'Camping Finder', expect: { hero: '.page-hero, .finder-hero', crumbs: true } },
  { path: '/vermietung-wohnmobile/', name: 'Vermietung', expect: { hero: '.phero', crumbs: true } },
  { path: '/werkstatt-kundendienst/', name: 'Werkstatt', expect: { hero: '.phero', crumbs: true } },
  { path: '/wohnmobil-ankauf/', name: 'Ankauf', expect: { hero: '.page-hero, .ak-hero, .phero', crumbs: true } },
  { path: '/ueber-uns/', name: 'Über uns', expect: { hero: '.page-hero, .phero', crumbs: true } },
  { path: '/kontakt/', name: 'Kontakt', expect: { hero: '.phero', crumbs: true } },
  { path: '/marken/', name: 'Hersteller', expect: { hero: '.page-hero, .phero', crumbs: true } },
  { path: '/360-rundgang/', name: 'Rundgang', expect: { hero: '.page-hero, .phero', crumbs: true } },
  { path: '/impressum/', name: 'Impressum', expect: { hero: '.page-hero, .legal-hero', crumbs: true } },
  { path: '/datenschutz/', name: 'Datenschutz', expect: { hero: '.page-hero, .legal-hero', crumbs: true } },
  { path: '/agb/', name: 'AGB', expect: { hero: '.page-hero, .legal-hero', crumbs: true } },
  { path: '/barrierefreiheit/', name: 'Barrierefreiheit', expect: { hero: '.page-hero, .legal-hero', crumbs: true } },
  { path: '/jobs/', name: 'Jobs', expect: { hero: '.phero', crumbs: true } },
  { path: '/wohnmobil-verkauf/', name: 'Verkauf', expect: { hero: '.page-hero, .phero', crumbs: true } },
  { path: '/fahrzeugwaesche-herbst/', name: 'Fahrzeugwäsche', expect: { hero: '.phero', crumbs: true } },
  { path: '/la-strada-konfigurator/', name: 'La Strada', expect: { hero: '.phero', crumbs: true } },
  { path: '/merkliste/', name: 'Merkliste', expect: { hero: '.page-hero', crumbs: true } },
  { path: '/bewerbung/', name: 'Bewerbung', expect: { hero: '.page-hero, .phero', crumbs: true } },
];

function fail(issues, msg) {
  issues.push(msg);
}

async function probe(page, route, mode, issues) {
  const label = `${route.name} [${mode}]`;

  // CSP / console
  const csp = [];
  const errors = [];
  const onConsole = (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  };
  const onCsp = (e) => csp.push(`${e.violatedDirective}: ${e.blockedURI || e.sourceFile || ''}`);
  page.on('console', onConsole);
  page.on('pagesecuritypolicyviolation', onCsp);

  try {
    if (mode === 'hard') {
      await page.goto(baseURL + route.path, { waitUntil: 'networkidle', timeout: 30000 });
    } else {
      // soft-nav: start from home, click a link or use client-side navigation
      await page.goto(baseURL + '/', { waitUntil: 'networkidle', timeout: 30000 });
      await page.evaluate((path) => {
        const a = document.createElement('a');
        a.href = path;
        a.textContent = 'nav';
        document.body.appendChild(a);
        a.click();
      }, route.path);
      await page.waitForURL((url) => url.pathname.replace(/\/$/, '') === route.path.replace(/\/$/, '') || url.pathname === route.path, {
        timeout: 15000,
      });
      // First paint after swap — capture quickly then settle
      await page.waitForTimeout(50);
    }

    // Breadcrumbs: numbered list FOUC
    if (route.expect.crumbs) {
      const crumbs = page.locator('.crumbs').first();
      if ((await crumbs.count()) > 0) {
        const crumbInfo = await crumbs.evaluate((el) => {
          const list = el.querySelector('ul, ol');
          if (!list) return { missing: true };
          const cs = getComputedStyle(list);
          const marker = getComputedStyle(list.querySelector('li') || list);
          const text = el.innerText.replace(/\s+/g, ' ').trim();
          return {
            tag: list.tagName,
            listStyle: cs.listStyleType,
            display: cs.display,
            markerContent: marker.getPropertyValue('list-style-type'),
            text,
            looksNumbered: /^\s*1[.)]/.test(text) || /(?:^|\n)\s*\d+\./.test(el.innerText),
          };
        });
        if (crumbInfo.missing) fail(issues, `${label}: crumbs list missing`);
        if (crumbInfo.listStyle !== 'none' && crumbInfo.listStyle !== '') {
          fail(issues, `${label}: crumbs list-style=${crumbInfo.listStyle}`);
        }
        if (crumbInfo.looksNumbered) fail(issues, `${label}: numbered breadcrumb FOUC text="${crumbInfo.text.slice(0, 80)}"`);
        if (crumbInfo.display === 'list-item') fail(issues, `${label}: crumbs display=list-item`);
      } else if (mode === 'hard') {
        // Some pages may nest crumbs only in phero — warn but don't hard-fail soft if structure differs
        const any = await page.locator('.crumbs, nav[aria-label="Brotkrumen"]').count();
        if (!any) fail(issues, `${label}: no breadcrumbs found`);
      }
    }

    // Hero styling
    const heroSel = route.expect.hero;
    const hero = page.locator(heroSel).first();
    if ((await hero.count()) > 0) {
      const heroInfo = await hero.evaluate((el) => {
        const cs = getComputedStyle(el);
        const h1 = el.querySelector('h1');
        const h1cs = h1 ? getComputedStyle(h1) : null;
        const btn = el.querySelector('.btn-light, .btn-accent, .btn-glass, .btn');
        const btnCs = btn ? getComputedStyle(btn) : null;
        return {
          minHeight: cs.minHeight,
          height: cs.height,
          color: cs.color,
          bg: cs.backgroundColor,
          overflow: cs.overflow,
          h1Color: h1cs?.color,
          h1Font: h1cs?.fontFamily,
          h1Size: h1cs?.fontSize,
          btnBg: btnCs?.backgroundColor,
          btnColor: btnCs?.color,
          btnDisplay: btnCs?.display,
          className: el.className,
        };
      });

      // Unstyled phero: typically no min-height clamp applied → auto/0, or transparent over white
      if (elIsPhero(heroInfo.className)) {
        const mh = parseFloat(heroInfo.minHeight);
        if (!Number.isFinite(mh) || mh < 200) {
          fail(issues, `${label}: phero min-height broken (${heroInfo.minHeight})`);
        }
        // text should be light on dark hero
        if (heroInfo.h1Color && isDarkText(heroInfo.h1Color) && isDarkBg(heroInfo.bg)) {
          fail(issues, `${label}: hero h1 dark-on-dark color=${heroInfo.h1Color} bg=${heroInfo.bg}`);
        }
      }

      if (heroInfo.btnBg && heroInfo.btnColor) {
        if (nearWhite(heroInfo.btnBg) && nearWhite(heroInfo.btnColor)) {
          fail(issues, `${label}: white-on-white CTA bg=${heroInfo.btnBg} fg=${heroInfo.btnColor}`);
        }
        if (isTransparent(heroInfo.btnBg) && nearWhite(heroInfo.btnColor) && elIsPhero(heroInfo.className)) {
          // glass buttons OK; plain btn without bg on dark hero is bad if it's meant to be btn-light
          const hasLight = await hero.locator('.btn-light').count();
          if (hasLight) fail(issues, `${label}: btn-light transparent on hero`);
        }
      }
    } else {
      fail(issues, `${label}: hero not found (${heroSel})`);
    }

    // Header / status / companion
    const header = page.locator('[data-header], .site-header').first();
    if ((await header.count()) === 0) fail(issues, `${label}: header missing`);
    else {
      const h = await header.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { position: cs.position, zIndex: cs.zIndex, display: cs.display };
      });
      if (h.display === 'none') fail(issues, `${label}: header display:none`);
      if (!['sticky', 'fixed'].includes(h.position) && route.path !== '/') {
        // overlay pages use fixed; normal sticky — either OK; static would be broken styles
        if (h.position === 'static') fail(issues, `${label}: header position=static (styles missing?)`);
      }
    }

    const pill = page.locator('[data-oh-open], .oh-pill').first();
    if ((await pill.count()) === 0) fail(issues, `${label}: opening pill missing`);
    else {
      const p = await pill.evaluate((el) => {
        const cs = getComputedStyle(el);
        return { display: cs.display, minHeight: cs.minHeight, opacity: cs.opacity };
      });
      if (p.display === 'none' || Number(p.opacity) === 0) fail(issues, `${label}: opening pill hidden`);
    }

    const fab = page.locator('.companion-fab, [data-companion-open]').first();
    if ((await fab.count()) === 0) fail(issues, `${label}: companion FAB missing`);

    // Truncation / overlap heuristics on hero title
    const h1 = page.locator('h1').first();
    if ((await h1.count()) > 0) {
      const box = await h1.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return {
          w: r.width,
          h: r.height,
          top: r.top,
          overflow: cs.overflow,
          textOverflow: cs.textOverflow,
          scrollW: el.scrollWidth,
          clientW: el.clientWidth,
        };
      });
      if (box.h < 8) fail(issues, `${label}: h1 height collapsed (${box.h})`);
      if (box.scrollW > box.clientW + 40 && box.textOverflow === 'ellipsis') {
        // ellipsis on h1 can be intentional; only flag severe collapse
      }
    }

    await page.waitForTimeout(mode === 'soft' ? 200 : 0);

    // Late CSP / errors
    for (const v of csp) {
      if (/style|script/i.test(v)) fail(issues, `${label}: CSP ${v}`);
    }
    for (const e of errors) {
      if (/Content Security Policy|Refused to apply|Refused to execute/i.test(e)) {
        fail(issues, `${label}: console ${e.slice(0, 160)}`);
      }
    }
  } finally {
    page.off('console', onConsole);
    page.off('pagesecuritypolicyviolation', onCsp);
  }
}

function elIsPhero(className) {
  return /\bphero\b/.test(className || '');
}

function parseRgb(c) {
  const m = String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!m) return null;
  return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
}

function nearWhite(c) {
  const rgb = parseRgb(c);
  if (!rgb || rgb.a < 0.2) return false;
  return rgb.r > 230 && rgb.g > 230 && rgb.b > 230;
}

function isDarkText(c) {
  const rgb = parseRgb(c);
  if (!rgb) return false;
  return rgb.r + rgb.g + rgb.b < 120;
}

function isDarkBg(c) {
  const rgb = parseRgb(c);
  if (!rgb || rgb.a < 0.3) return true; // transparent over photo counts as dark hero intent
  return rgb.r + rgb.g + rgb.b < 180;
}

function isTransparent(c) {
  const rgb = parseRgb(c);
  return !rgb || rgb.a < 0.1 || (rgb.r === 0 && rgb.g === 0 && rgb.b === 0 && rgb.a === 0);
}

const matrix = [];
const allIssues = [];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

for (const route of routes) {
  const row = { name: route.name, path: route.path, hard: 'OK', soft: 'OK', issues: [] };
  for (const mode of ['hard', 'soft']) {
    const page = await context.newPage();
    const before = allIssues.length;
    try {
      await probe(page, route, mode, allIssues);
    } catch (err) {
      fail(allIssues, `${route.name} [${mode}]: ${err.message}`);
    }
    const newIssues = allIssues.slice(before);
    row[mode] = newIssues.length ? 'FAIL' : 'OK';
    row.issues.push(...newIssues);
    await page.close();
  }
  matrix.push(row);
  const mark = row.hard === 'OK' && row.soft === 'OK' ? '✓' : '✗';
  console.log(`${mark} ${route.name.padEnd(18)} hard=${row.hard} soft=${row.soft}`);
  for (const i of row.issues) console.log(`    - ${i}`);
}

// Mobile soft-nav spot check on key pages
const mobileIssues = [];
const mobile = await context.newPage();
await mobile.setViewportSize({ width: 390, height: 844 });
for (const route of routes.filter((r) => ['Werkstatt', 'Kontakt', 'Vermietung', 'Showroom'].includes(r.name))) {
  const before = mobileIssues.length;
  try {
    await probe(mobile, route, 'soft', mobileIssues);
  } catch (err) {
    fail(mobileIssues, `${route.name} [mobile-soft]: ${err.message}`);
  }
  const ok = mobileIssues.length === before;
  console.log(`${ok ? '✓' : '✗'} ${route.name.padEnd(18)} mobile-soft=${ok ? 'OK' : 'FAIL'}`);
  for (const i of mobileIssues.slice(before)) console.log(`    - ${i}`);
}
await mobile.close();

await browser.close();

console.log('\n===== SUMMARY =====');
console.log(`Routes: ${matrix.length}`);
console.log(`Hard OK: ${matrix.filter((r) => r.hard === 'OK').length}`);
console.log(`Soft OK: ${matrix.filter((r) => r.soft === 'OK').length}`);
console.log(`Desktop issues: ${allIssues.length}`);
console.log(`Mobile issues: ${mobileIssues.length}`);
if (allIssues.length || mobileIssues.length) {
  process.exitCode = 1;
}
