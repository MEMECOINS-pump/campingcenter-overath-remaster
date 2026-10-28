import { test, expect } from '@playwright/test';

const base = process.env.BASE_PATH || '/';

function path(p: string) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}${p.startsWith('/') ? p : `/${p}`}`;
}

async function dismissConsent(page: import('@playwright/test').Page) {
  await page.locator('[data-consent-action="necessary"]').click({ timeout: 2500 }).catch(() => undefined);
}

async function openCompanionOnce(page: import('@playwright/test').Page) {
  await dismissConsent(page);
  const fab = page.locator('[data-companion-open]').first();
  await expect(fab).toBeVisible();
  await fab.scrollIntoViewIfNeeded();
  /* Hit-test: ensure something is not covering the FAB center */
  const box = await fab.boundingBox();
  expect(box).toBeTruthy();
  expect(box!.width).toBeGreaterThan(40);
  expect(box!.height).toBeGreaterThan(40);
  if (box) {
    const top = await page.evaluate(
      ({ x, y }) => {
        const el = document.elementFromPoint(x, y);
        if (el?.closest?.('[data-companion-open]')) return 'fab';
        return `${el?.tagName || 'none'}.${(el as HTMLElement)?.className || ''}`;
      },
      { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    );
    expect(top, 'FAB must be the topmost hit target').toBe('fab');
  }
  await fab.click({ force: false });
  await expect(page.locator('[data-companion-panel]')).toHaveAttribute('open', '');
  await page.locator('[data-companion-close]').click();
  await expect(page.locator('[data-companion-panel]')).not.toHaveAttribute('open');
}

test.describe('Companion navigation regression (no refresh)', () => {
  test('opens after soft-nav across key routes', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(String(err)));

    await page.goto(path('/'));
    await dismissConsent(page);
    await openCompanionOnce(page);

    const softRoutes = [
      '/wohnmobile/',
      '/wohnmobil-ankauf/',
      '/kontakt/',
      '/camper-finder/',
      '/werkstatt-kundendienst/',
      '/barrierefreiheit/',
      '/vermietung-wohnmobile/',
    ];

    for (const route of softRoutes) {
      /* Prefer real in-page links so ClientRouter handles the transition */
      const link = page.locator(`a[href="${path(route)}"]:visible`).first();
      if (await link.count()) {
        await link.click();
      } else {
        await page.goto(path(route));
      }
      await page.waitForURL(new RegExp(route.replace(/\//g, '\\/')));
      await openCompanionOnce(page);
    }

    await page.goBack();
    await page.waitForLoadState('domcontentloaded');
    await openCompanionOnce(page);

    await page.goForward();
    await page.waitForLoadState('domcontentloaded');
    await openCompanionOnce(page);

    expect(errors, `page errors: ${errors.join(' | ')}`).toEqual([]);
  });

  test('50 navigation/open/close cycles without refresh', async ({ page }) => {
    test.setTimeout(180_000);
    await page.goto(path('/'));
    await dismissConsent(page);

    const cycleRoutes = ['/', '/wohnmobile/', '/kontakt/', '/camper-finder/', '/ueber-uns/'];
    for (let i = 0; i < 50; i++) {
      const route = cycleRoutes[i % cycleRoutes.length]!;
      await page.goto(path(route));
      await openCompanionOnce(page);
    }
  });

  test('mobile viewport first tap after navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path('/'));
    await dismissConsent(page);
    await page.goto(path('/wohnmobile/'));
    await openCompanionOnce(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await openCompanionOnce(page);
  });
});
