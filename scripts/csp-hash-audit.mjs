/**
 * Compare inline <style> sha256 digests to CSP style-src allowlist.
 * Usage:
 *   node scripts/csp-hash-audit.mjs
 *   node scripts/csp-hash-audit.mjs dist/index.html
 *   node scripts/csp-hash-audit.mjs https://example.com/
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const hash = (s) => createHash('sha256').update(s).digest('base64');

async function loadHtml(pathOrUrl) {
  if (/^https?:\/\//.test(pathOrUrl)) {
    const res = await fetch(pathOrUrl);
    if (!res.ok) throw new Error(`${res.status} ${pathOrUrl}`);
    return { name: pathOrUrl, html: await res.text() };
  }
  return { name: pathOrUrl, html: readFileSync(pathOrUrl, 'utf8') };
}

function audit(name, html) {
  const csp = html.match(/content-security-policy" content="([^"]+)/i)?.[1] ?? '';
  const styleSrc = csp.match(/style-src[^;]+/)?.[0] ?? '';
  const attr = csp.match(/style-src-attr[^;]+/)?.[0] ?? '(none)';
  const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  const actual = styles.map(hash);
  const allowed = [...styleSrc.matchAll(/'sha256-([^']+)'/g)].map((m) => m[1]);
  const missing = actual.filter((h) => !allowed.includes(h));
  console.log(`\n${name}`);
  console.log('  allowed', allowed.map((h) => h.slice(0, 16)));
  console.log('  actual ', actual.map((h) => h.slice(0, 16)));
  console.log('  missing', missing.map((h) => h.slice(0, 24)));
  console.log('  attr   ', attr.slice(0, 48));
  return missing.length === 0;
}

const inputs = process.argv.slice(2);
const defaults = ['dist/index.html', 'dist/kontakt/index.html', 'dist/werkstatt-kundendienst/index.html'];
let ok = true;
for (const input of inputs.length ? inputs : defaults) {
  if (!/^https?:\/\//.test(input) && !existsSync(input)) {
    console.error('missing', input);
    ok = false;
    continue;
  }
  const { name, html } = await loadHtml(input);
  ok = audit(name, html) && ok;
}
process.exit(ok ? 0 : 1);
