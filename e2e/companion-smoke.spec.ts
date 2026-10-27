import { test, expect } from '@playwright/test';

const base = process.env.BASE_PATH || '/';

function path(p: string) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}${p.startsWith('/') ? p : `/${p}`}`;
}

test.describe('CampingCompanion smoke', () => {
  test('opens and closes hub without dual FABs', async ({ page }) => {
    await page.goto(path('/'));
    await expect(page.locator('html')).toHaveAttribute('lang', /de/);
    await expect(page.locator('.companion-fab')).toHaveCount(1);
    await expect(page.locator('.chatw-fab, .a11y-fab')).toHaveCount(0);

    await page.locator('[data-companion-open]').click();
    await expect(page.locator('[data-companion-panel]')).toHaveAttribute('open', '');
    await expect(page.locator('[data-companion-action="lang"]')).toHaveCount(0);
    await expect(page.locator('[data-companion-action="chat"]')).toBeVisible();
    await expect(page.locator('[data-companion-action="a11y"]')).toBeVisible();

    await page.locator('[data-companion-close]').click();
    await expect(page.locator('[data-companion-panel]')).not.toHaveAttribute('open');
  });

  test('a11y panel toggles contrast without flake', async ({ page }) => {
    await page.goto(path('/'));
    await page.locator('[data-companion-open]').click();
    await page.locator('[data-companion-action="a11y"]').click();
    const contrast = page.locator('[data-a11y-toggle="contrast"]');
    await expect(contrast).toBeVisible();
    await contrast.click();
    await expect(page.locator('html')).toHaveClass(/a11y-contrast/);
    await contrast.click();
    await expect(page.locator('html')).not.toHaveClass(/a11y-contrast/);
  });

  test('legacy cco:lang preference does not redirect', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('cco:lang', 'en'));
    await page.goto(path('/'));
    await expect(page).toHaveURL(/\/?$/);
    await expect(page).not.toHaveURL(/\/en\//);
    await expect(page.locator('html')).toHaveAttribute('lang', /de/);
  });
});
