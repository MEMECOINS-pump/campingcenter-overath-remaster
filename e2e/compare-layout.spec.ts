import { test, expect } from '@playwright/test';

const base = process.env.BASE_PATH || '/';

function path(p: string) {
  const b = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${b}${p.startsWith('/') ? p : `/${p}`}`;
}

test.describe('comparison layout', () => {
  test('four vehicles stay inside the page and scroll sideways at 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto(path('/wohnmobile/'));
    await page.locator('[data-consent-action="necessary"]').click({ timeout: 2000 }).catch(() => undefined);

    const toggles = page.locator('[data-compare-toggle]');
    for (let i = 0; i < 4; i++) {
      await toggles.nth(i).scrollIntoViewIfNeeded();
      await toggles.nth(i).click();
    }

    await page.goto(path('/vergleich/'));
    await expect(page.locator('[data-cmp]')).toBeVisible();
    await expect(page.locator('[data-cmp]')).toHaveAttribute('data-cols', '4');

    const layout = await page.evaluate(() => {
      const doc = document.documentElement;
      const cmp = document.querySelector<HTMLElement>('[data-cmp]')!;
      const name = document.querySelector('.cmp-vname');
      return {
        pageOverflow: doc.scrollWidth - doc.clientWidth,
        scrollsInside: cmp.scrollWidth > cmp.clientWidth + 8,
        name: name?.textContent?.trim() ?? '',
      };
    });

    expect(layout.pageOverflow, 'comparison must not widen the page').toBeLessThanOrEqual(1);
    expect(layout.scrollsInside, 'four columns should scroll inside the comparison').toBe(true);
    expect(layout.name.length).toBeGreaterThan(8);
  });
});
