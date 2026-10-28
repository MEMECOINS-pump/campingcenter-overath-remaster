import { test, expect } from '@playwright/test';

const base = process.env.BASE_PATH || '/';

function path(p: string) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}${p.startsWith('/') ? p : `/${p}`}`;
}

test.describe('CampingCompanion smoke', () => {
  test('opens compact support center with tabs', async ({ page }) => {
    await page.goto(path('/'));
    await expect(page.locator('html')).toHaveAttribute('lang', /de/);
    await expect(page.locator('.companion-fab')).toHaveCount(1);
    await expect(page.locator('.chatw-fab, .a11y-fab')).toHaveCount(0);
    await expect(page.locator('[data-companion-open]')).toHaveAttribute(
      'aria-label',
      'Barrierefreiheit & Hilfe öffnen',
    );

    await page.locator('[data-companion-open]').click();
    await expect(page.locator('[data-companion-panel]')).toHaveAttribute('open', '');
    await expect(page.getByRole('heading', { name: 'Hilfe & Barrierefreiheit' })).toBeVisible();
    await expect(page.locator('[data-companion-tab="a11y"]')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[data-companion-view="a11y"]')).toBeVisible();

    await page.locator('[data-companion-tab="chat"]').click();
    await expect(page.locator('[data-companion-view="chat"]')).toBeVisible();
    await expect(page.locator('[data-companion-chat-input]')).toBeVisible();

    await page.locator('[data-companion-tab="contact"]').click();
    await expect(page.locator('[data-companion-view="contact"]')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Jetzt anrufen' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Nachricht schreiben' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Route planen' })).toBeVisible();

    await page.locator('[data-companion-size="sm"]').click();
    await expect(page.locator('[data-companion]')).toHaveAttribute('data-size', 'sm');
    await page.locator('[data-companion-size="md"]').click();
    await expect(page.locator('[data-companion]')).toHaveAttribute('data-size', 'md');

    await page.locator('[data-companion-close]').click();
    await expect(page.locator('[data-companion-panel]')).not.toHaveAttribute('open');
  });

  test('a11y prefs toggle contrast and persist size/font', async ({ page }) => {
    await page.goto(path('/'));
    await page.locator('[data-companion-open]').click();
    await expect(page.locator('[data-companion-view="a11y"]')).toBeVisible();

    const highContrast = page.locator('[data-a11y-choice="contrast"][data-a11y-value="on"]');
    await expect(highContrast).toBeVisible();
    await highContrast.click();
    await expect(page.locator('html')).toHaveClass(/a11y-contrast/);

    await page.locator('[data-a11y-font="xl"]').click();
    await expect(page.locator('html')).toHaveClass(/a11y-font-xl/);

    await page.locator('[data-a11y-choice="contrast"][data-a11y-value="off"]').click();
    await expect(page.locator('html')).not.toHaveClass(/a11y-contrast/);

    await page.locator('[data-companion-size="lg"]').click();
    await page.locator('[data-companion-close]').click();

    await page.reload();
    await expect(page.locator('html')).toHaveClass(/a11y-font-xl/);
    await page.locator('[data-companion-open]').click();
    await expect(page.locator('[data-companion]')).toHaveAttribute('data-size', 'lg');
  });

  test('legacy cco:lang preference does not redirect', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('cco:lang', 'en'));
    await page.goto(path('/'));
    await expect(page).toHaveURL(/\/?$/);
    await expect(page).not.toHaveURL(/\/en\//);
    await expect(page.locator('html')).toHaveAttribute('lang', /de/);
  });
});
