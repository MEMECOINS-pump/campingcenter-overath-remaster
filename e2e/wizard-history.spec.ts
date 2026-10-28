import { test, expect } from '@playwright/test';

const base = process.env.BASE_PATH || '/';

function path(p: string) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}${p.startsWith('/') ? p : `/${p}`}`;
}

test.describe('ankauf wizard history', () => {
  test('browser forward returns to the step already reached', async ({ page }) => {
    await page.goto(path('/wohnmobil-ankauf/'));
    await page.locator('[data-consent-action="necessary"]').click({ timeout: 2000 }).catch(() => undefined);

    const stepName = page.locator('[data-wz-name]');
    const next = page.locator('.wz-next');
    await next.scrollIntoViewIfNeeded();
    await next.click();
    await expect(stepName).toHaveText('Hersteller & Modell');

    await page.locator('input[name="hersteller"]').fill('Knaus');
    await page.locator('input[name="modell"]').fill('Van TI');
    await next.click();
    await expect(stepName).toHaveText('Fahrzeugdaten');

    await page.goBack();
    await expect(stepName).toHaveText('Hersteller & Modell');

    await page.goForward();
    await expect(stepName).toHaveText('Fahrzeugdaten');
  });
});
