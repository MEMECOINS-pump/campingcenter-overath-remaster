import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://127.0.0.1:4174';
const browser = await chromium.launch();
const page = await browser.newPage();
const hits = [];
page.on('console', (m) => {
  if (m.type() === 'error' && /inline style|Content Security/i.test(m.text())) hits.push(m.text().slice(0, 220));
});
await page.goto(`${base}/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.evaluate(() => {
  const a = document.createElement('a');
  a.href = '/werkstatt-kundendienst/';
  document.body.appendChild(a);
  a.click();
});
await page.waitForTimeout(500);
console.log('csp-hits', hits.length);
for (const h of hits) console.log('-', h);
await browser.close();
process.exitCode = hits.length ? 1 : 0;
