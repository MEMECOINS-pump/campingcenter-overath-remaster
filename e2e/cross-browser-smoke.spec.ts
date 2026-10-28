import { test, expect } from '@playwright/test';

const base = process.env.BASE_PATH || '/';

function path(p: string) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}${p.startsWith('/') ? p : `/${p}`}`;
}

const routes = ['/', '/wohnmobile/', '/kontakt/', '/camper-finder/', '/360-rundgang/', '/impressum/'];

test.describe('cross-browser smoke', () => {
  for (const route of routes) {
    test(`${route} loads in German without console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(String(err)));
      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      const response = await page.goto(path(route));
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator('html')).toHaveAttribute('lang', /de/);
      await expect(page.locator('h1')).toHaveCount(1);
      const description = await page.locator('meta[name="description"]').getAttribute('content');
      expect(description && description.length).toBeGreaterThan(40);
      await expect(page.locator('meta[name="twitter:title"]')).toHaveCount(1);
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }

  test('gallery arrow keys move the photo', async ({ page }) => {
    await page.goto(path('/wohnmobile/challenger-c256-start-edition-solar-457131578/'));
    await page.locator('[data-consent-action="necessary"]').click({ timeout: 2000 }).catch(() => undefined);
    const track = page.locator('[data-gal-track]');
    await expect(track).toBeVisible();
    await track.focus();
    const before = await page.locator('[data-gal-current]').innerText();
    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-gal-current]')).not.toHaveText(before);
  });
});
