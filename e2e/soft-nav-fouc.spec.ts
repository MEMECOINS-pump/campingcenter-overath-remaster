import { test, expect } from '@playwright/test';

const base = process.env.BASE_PATH || '/';

function path(p: string) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}${p.startsWith('/') ? p : `/${p}`}`;
}

const softRoutes = [
  '/werkstatt-kundendienst/',
  '/kontakt/',
  '/vermietung-wohnmobile/',
  '/wohnmobile/',
  '/camper-finder/',
  '/jobs/',
];

test.describe('Soft-nav FOUC / CSP', () => {
  test('no numbered breadcrumbs or unstyled phero after ClientRouter nav', async ({ page }) => {
    const cspHits: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error' && /Applying inline style violates/i.test(msg.text())) {
        cspHits.push(msg.text());
      }
    });

    for (const route of softRoutes) {
      await page.goto(path('/'));
      await page.evaluate((p) => {
        const a = document.createElement('a');
        a.href = p;
        document.body.appendChild(a);
        a.click();
      }, path(route));
      await page.waitForURL((url) => url.pathname.includes(route.replace(/^\/|\/$/g, '')) || url.pathname === path(route));
      await page.waitForTimeout(80);

      const crumbs = page.locator('.crumbs').first();
      await expect(crumbs).toBeVisible();
      const list = crumbs.locator('ul, ol').first();
      await expect(list).toHaveCSS('list-style-type', 'none');
      await expect(list).toHaveCSS('display', 'flex');
      const text = (await crumbs.innerText()).replace(/\s+/g, ' ').trim();
      expect(text, `numbered crumbs on ${route}`).not.toMatch(/^\s*1[.)]/);

      const phero = page.locator('.phero').first();
      if ((await phero.count()) > 0) {
        const minH = await phero.evaluate((el) => getComputedStyle(el).minHeight);
        expect(parseFloat(minH), `phero min-height on ${route}`).toBeGreaterThan(200);
        const btn = phero.locator('.btn-light').first();
        if ((await btn.count()) > 0) {
          const { bg, fg } = await btn.evaluate((el) => {
            const cs = getComputedStyle(el);
            return { bg: cs.backgroundColor, fg: cs.color };
          });
          expect(bg, `btn-light bg on ${route}`).not.toMatch(/rgba?\(0,\s*0,\s*0,\s*0\)/);
          // Solid light CTA on dark hero — not white-on-white
          const lightBg = /rgb\(\s*2(4[0-9]|5[0-5])/i.test(bg);
          const lightFg = /rgb\(\s*2(4[0-9]|5[0-5])/i.test(fg);
          expect(lightBg && lightFg, `white-on-white CTA on ${route}: ${bg} / ${fg}`).toBe(false);
        }
      }
    }

    expect(cspHits, 'CSP blocked inline <style> during soft-nav').toEqual([]);
  });
});
