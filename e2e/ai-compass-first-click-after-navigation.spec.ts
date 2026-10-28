import { test, expect } from '@playwright/test';

/**
 * Regression: AI Compass must open on the FIRST click after navigation
 * without a manual browser refresh.
 */
const base = process.env.BASE_PATH || '/';

function path(p: string) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}${p.startsWith('/') ? p : `/${p}`}`;
}

async function dismissConsent(page: import('@playwright/test').Page) {
  await page.locator('[data-consent-action="necessary"]').click({ timeout: 2500 }).catch(() => undefined);
}

async function assertCompassOpensOnce(page: import('@playwright/test').Page) {
  await dismissConsent(page);
  const fab = page.locator('[data-companion-open]').first();
  await expect(fab).toBeVisible();
  const box = await fab.boundingBox();
  expect(box, 'FAB bounding box').toBeTruthy();
  expect(box!.width).toBeGreaterThan(40);
  expect(box!.height).toBeGreaterThan(40);

  const hit = await page.evaluate(
    ({ x, y }) => {
      const el = document.elementFromPoint(x, y);
      if (el?.closest?.('[data-companion-open]')) return 'fab';
      return `${el?.tagName || 'none'}.${String((el as HTMLElement)?.className || '').slice(0, 80)}`;
    },
    { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 },
  );
  expect(hit, 'FAB must be topmost hit target').toBe('fab');

  await fab.click({ force: false });
  const panel = page.locator('[data-companion-panel]');
  await expect(panel).toHaveAttribute('open', '');
  await expect(page.locator('[data-companion-panel] .companion-sheet')).toBeVisible();
  await page.locator('[data-companion-close]').click();
  await expect(panel).not.toHaveAttribute('open');
}

test.describe('ai-compass-first-click-after-navigation', () => {
  test('homepage first click without refresh', async ({ page }) => {
    await page.goto(path('/'));
    await assertCompassOpensOnce(page);
  });

  test('Ankauf after soft-nav without refresh', async ({ page }) => {
    await page.goto(path('/'));
    await dismissConsent(page);
    const link = page.locator(`a[href="${path('/wohnmobil-ankauf/')}"]:visible`).first();
    if (await link.count()) {
      await link.click();
    } else {
      await page.goto(path('/wohnmobil-ankauf/'));
    }
    await page.waitForURL(/wohnmobil-ankauf/);
    await assertCompassOpensOnce(page);
  });

  test('multi-route then homepage without refresh', async ({ page }) => {
    await page.goto(path('/'));
    await dismissConsent(page);
    for (const route of ['/wohnmobile/', '/wohnmobil-ankauf/', '/kontakt/', '/']) {
      const link = page.locator(`a[href="${path(route)}"]:visible`).first();
      if (await link.count()) await link.click();
      else await page.goto(path(route));
      await page.waitForURL(new RegExp(route === '/' ? '/?$' : route.replace(/\//g, '\\/')));
    }
    await assertCompassOpensOnce(page);
  });

  test('direct Ankauf entry first click', async ({ page }) => {
    await page.goto(path('/wohnmobil-ankauf/'));
    await assertCompassOpensOnce(page);
  });

  test('100 navigation/open/close cycles without refresh', async ({ page }) => {
    test.setTimeout(300_000);
    await page.goto(path('/'));
    await dismissConsent(page);
    const routes = ['/', '/wohnmobile/', '/wohnmobil-ankauf/', '/kontakt/', '/camper-finder/'];
    for (let i = 0; i < 100; i++) {
      await page.goto(path(routes[i % routes.length]!));
      await assertCompassOpensOnce(page);
    }
  });

  test('panel opens when AI assist import fails', async ({ page }) => {
    await page.route('**/camping-assist*', (route) => route.abort());
    await page.goto(path('/'));
    await dismissConsent(page);
    await page.locator('[data-companion-open]').first().click();
    await expect(page.locator('[data-companion-panel]')).toHaveAttribute('open', '');
    await page.locator('[data-companion-tab="chat"]').click();
    await expect(page.locator('[data-companion-view="chat"]')).toBeVisible();
  });

  test('boot controller present before module; self-heal restores open', async ({ page }) => {
    await page.goto(path('/'));
    await dismissConsent(page);
    const boot = await page.evaluate(() => ({
      boot: !!(window as unknown as { __ccoCompanionBoot?: boolean }).__ccoCompanionBoot,
      setOpen: typeof (window as unknown as { __ccoCompanionSetOpen?: unknown }).__ccoCompanionSetOpen,
      heal: typeof (window as unknown as { __ccoCompanionHeal?: unknown }).__ccoCompanionHeal,
    }));
    expect(boot.boot).toBe(true);
    expect(boot.setOpen).toBe('function');
    expect(boot.heal).toBe('function');

    /* Simulate broken overlay, then click once — must still open */
    await page.evaluate(() => {
      const chat = document.createElement('div');
      chat.setAttribute('data-chat-widget', '');
      chat.className = 'chatw';
      chat.style.cssText =
        'position:fixed;inset:0;z-index:9999;pointer-events:auto;background:transparent;';
      document.body.appendChild(chat);
      (window as unknown as { __ccoCompanionHeal?: () => void }).__ccoCompanionHeal?.();
    });
    await page.locator('[data-companion-open]').first().click({ force: true });
    await expect(page.locator('[data-companion-panel]')).toHaveAttribute('open', '');
  });

  test('mobile viewport Ankauf first tap', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(path('/'));
    await dismissConsent(page);
    await page.goto(path('/wohnmobil-ankauf/'));
    await assertCompassOpensOnce(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await assertCompassOpensOnce(page);
  });
});
