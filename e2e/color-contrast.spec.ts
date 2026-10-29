import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const base = process.env.BASE_PATH || '/';

function path(p: string) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}${p.startsWith('/') ? p : `/${p}`}`;
}

const pages = [
  '/',
  '/wohnmobile/',
  '/wohnmobile/challenger-c256-start-edition-solar-457131578/',
  '/wohnmobil-verkauf/',
  '/wohnmobil-ankauf/',
  '/vermietung-wohnmobile/',
  '/werkstatt-kundendienst/',
  '/kontakt/',
  '/ueber-uns/',
  '/camper-finder/',
  '/vergleich/',
  '/merkliste/',
  '/jobs/',
  '/360-rundgang/',
  '/marken/',
  '/impressum/',
  '/datenschutz/',
  '/agb/',
  '/bewerbung/',
  '/danke/',
  '/fahrzeugwaesche-herbst/',
  '/la-strada-konfigurator/',
];

type Hit = { text: string; ratio: number; need: number; color: string; bg: string };

async function dismissCookies(page: Page) {
  const accept = page.locator('[data-consent-action="all"], [data-consent-action="necessary"]').first();
  if (await accept.isVisible().catch(() => false)) await accept.click();
}

async function contrastHits(page: Page): Promise<Hit[]> {
  return page.evaluate(() => {
    const parse = (c: string) => {
      const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (!m) return null;
      const r = m[1];
      const g = m[2];
      const b = m[3];
      if (r === undefined || g === undefined || b === undefined) return null;
      return { r: +r, g: +g, b: +b, a: m[4] === undefined ? 1 : +m[4] };
    };
    const lin = (v: number) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    const lum = (c: { r: number; g: number; b: number }) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
    const ratioOf = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) => {
      const l1 = lum(a);
      const l2 = lum(b);
      const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
      return (hi + 0.05) / (lo + 0.05);
    };
    const bgOf = (el: Element) => {
      let n: Element | null = el;
      while (n) {
        const bg = parse(getComputedStyle(n).backgroundColor);
        if (bg && bg.a >= 0.85) return bg;
        n = n.parentElement;
      }
      return { r: 20, g: 16, b: 14, a: 1 };
    };
    const hits: Hit[] = [];
    const seen = new Set<string>();
    const nodes = document.querySelectorAll('h1,h2,h3,p,a,button,label,legend,strong,span,small,li,dt,dd,summary,th,td');
    for (const el of nodes) {
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;
      if (el.closest('[hidden], [aria-hidden="true"], dialog:not([open])')) continue;
      if (el.children.length > 0) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8 || rect.bottom < 0 || rect.top > innerHeight) continue;
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.length < 2 || text.length > 90) continue;
      const fg = parse(cs.color);
      if (!fg || fg.a < 0.85) continue;
      const bg = bgOf(el);
      const ratio = ratioOf(fg, bg);
      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const need = large ? 3 : 4.5;
      if (ratio + 0.08 >= need) continue;
      const key = `${text}|${Math.round(ratio * 10)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      hits.push({
        text,
        ratio: Math.round(ratio * 100) / 100,
        need,
        color: cs.color,
        bg: `rgb(${bg.r}, ${bg.g}, ${bg.b})`,
      });
    }
    return hits;
  });
}

async function scanPage(page: Page) {
  const found: Hit[] = [];
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 700) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(40);
    found.push(...(await contrastHits(page)));
  }
  const uniq = new Map<string, Hit>();
  for (const hit of found) uniq.set(`${hit.text}|${hit.color}|${hit.bg}`, hit);
  return [...uniq.values()];
}

test.describe('color contrast', () => {
  test.describe.configure({ timeout: 600_000 });

  test('axe color-contrast on every page', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'full-site axe runs in Chromium; other browsers cover the finder');
    const widths = [360, 1440];
    const failures: string[] = [];
    for (const route of pages) {
      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        const res = await page.goto(path(route));
        expect(res?.ok() || res?.status() === 200).toBeTruthy();
        await dismissCookies(page);
        const axe = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
        for (const v of axe.violations) {
          for (const node of v.nodes.slice(0, 4)) {
            failures.push(`${route} @${width}: ${node.html.slice(0, 140)} — ${node.failureSummary?.split('\n')[0] ?? v.id}`);
          }
        }
        const hits = (await scanPage(page)).filter((hit) => {
          const lightBg = /25[0-5], 2[3-5]\d, 2[2-4]\d|238, 232, 222|250, 248, 244|255, 255, 255/.test(hit.bg);
          const lightText = hit.color.startsWith('rgb(255') || hit.color.startsWith('rgb(247');
          return lightBg && lightText;
        });
        for (const hit of hits.slice(0, 6)) {
          failures.push(`${route} @${width}: "${hit.text}" ${hit.ratio}:1 (need ${hit.need}) ${hit.color} on ${hit.bg}`);
        }
      }
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });

  test('Camper-Finder option cards stay readable on every step', async ({ page }, testInfo) => {
    const width = testInfo.project.name === 'chromium' ? 360 : 390;
    await page.setViewportSize({ width, height: 900 });
    await page.goto(path('/camper-finder/'));
    await dismissCookies(page);
    const shots = '/opt/cursor/artifacts/screenshots';
    mkdirSync(shots, { recursive: true });
    const steps = await page.locator('[data-finder-q]').count();
    expect(steps).toBeGreaterThan(3);
    for (let i = 0; i < steps; i++) {
      const card = page.locator('[data-finder-q].is-active .finder-opt-card').first();
      await expect(card).toBeVisible();
      const colors = await card.evaluate((el) => {
        const strong = el.querySelector('strong') || el;
        const cs = getComputedStyle(strong);
        const bg = getComputedStyle(el).backgroundColor;
        return { color: cs.color, bg, text: (strong.textContent || '').trim() };
      });
      expect(colors.color, colors.text).toMatch(/rgb\(36,\s*40,\s*43\)|rgb\(47,\s*52,\s*56\)/);
      expect(colors.bg).toMatch(/250,\s*248,\s*244|238,\s*232,\s*222|255,\s*255,\s*255/);
      if (testInfo.project.name === 'chromium') {
        await page.screenshot({ path: `${shots}/finder-step-${i + 1}-360.png` });
      }
      await page.locator('[data-finder-q].is-active input').first().check({ force: true });
      const checked = page.locator('[data-finder-q].is-active input:checked + .finder-opt-card strong').first();
      await expect(checked).toHaveCSS('color', 'rgb(36, 40, 43)');
      if (i < steps - 1) await page.locator('[data-finder-next-label]').click();
    }
  });

  test('Camper-Finder cards at desktop width', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'desktop shots are captured once');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(path('/camper-finder/'));
    await dismissCookies(page);
    const shots = '/opt/cursor/artifacts/screenshots';
    mkdirSync(shots, { recursive: true });
    const steps = await page.locator('[data-finder-q]').count();
    for (let i = 0; i < steps; i++) {
      await expect(page.locator('[data-finder-q].is-active .finder-opt-card strong').first()).toHaveCSS('color', 'rgb(36, 40, 43)');
      await page.screenshot({ path: `${shots}/finder-step-${i + 1}-1440.png` });
      await page.locator('[data-finder-q].is-active input').first().check({ force: true });
      if (i < steps - 1) await page.locator('[data-finder-next-label]').click();
    }
  });

  test('status pill stays inside the header', async ({ page }) => {
    for (const width of [320, 360, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path('/camper-finder/'));
      const box = await page.evaluate(() => {
        const pill = document.querySelector('[data-oh-open]');
        const header = document.querySelector('.site-header');
        const main = document.querySelector('main');
        if (!pill || !header || !main) return { ok: false, reason: 'missing' };
        const p = pill.getBoundingClientRect();
        const h = header.getBoundingClientRect();
        const m = main.getBoundingClientRect();
        return {
          ok: p.top >= h.top - 1 && p.bottom <= h.bottom + 1 && p.bottom <= m.top + 1,
          pill: { t: p.top, b: p.bottom },
          header: { t: h.top, b: h.bottom },
          mainTop: m.top,
          pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        };
      });
      expect(box.ok, JSON.stringify({ width, box })).toBeTruthy();
      expect(box.pageOverflow).toBeLessThanOrEqual(1);
    }
  });
});
