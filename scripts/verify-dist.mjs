// Post-build checks on dist/: metadata, internal links, CSP compatibility, structured data.
// Usage: node scripts/verify-dist.mjs   (reads BASE_PATH / SITE_URL like astro.config.mjs)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const base = (process.env.BASE_PATH || '/').replace(/\/?$/, '/');
const site = process.env.SITE_URL || '';

const requiredRoutes = [
  '', 'wohnmobile/', 'wohnmobil-verkauf/', 'wohnmobil-ankauf/', 'vermietung-wohnmobile/', 'werkstatt-kundendienst/',
  'marken/', 'la-strada-konfigurator/', 'ueber-uns/', 'kontakt/', 'jobs/', 'rechnungswesen/', 'reinigungskraft/', 'bewerbung/',
  '360-rundgang/', 'fahrzeugwaesche-herbst/', 'camper-finder/', 'merkliste/', 'vergleich/', 'impressum/',
  'datenschutz/', 'agb/', 'barrierefreiheitserklaerung/', 'download/', 'danke/',
];
const requiredFiles = ['404.html', 'robots.txt', 'sitemap-index.xml', '.nojekyll', 'site.webmanifest'];

const errors = [];
const fail = (file, msg) => errors.push(`${file}: ${msg}`);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

if (!existsSync(DIST)) {
  console.error('dist/ fehlt – zuerst `npm run build` ausführen.');
  process.exit(1);
}

const files = walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const rel = (f) => relative(DIST, f).split(sep).join('/');

for (const r of requiredRoutes) if (!existsSync(join(DIST, r, 'index.html'))) fail(r || '/', 'Pflichtseite fehlt');
for (const f of requiredFiles) if (!existsSync(join(DIST, f))) fail(f, 'Pflichtdatei fehlt');

/** Resolve a root-relative URL to a file in dist/, or null if it is not internal. */
function target(href) {
  if (!href.startsWith(base) || href.startsWith('//')) return null;
  const path = decodeURIComponent(href.slice(base.length).split(/[?#]/)[0]);
  if (!path || path.endsWith('/')) return join(DIST, path, 'index.html');
  return join(DIST, path);
}

for (const file of htmlFiles) {
  const name = rel(file);
  const html = readFileSync(file, 'utf8');
  const isRedirect = /http-equiv="refresh"/.test(html);

  if (isRedirect) {
    const to = html.match(/url=([^"]+)"/)?.[1] ?? '';
    const t = target(to);
    if (!t || !existsSync(t)) fail(name, `Weiterleitung auf unbekanntes Ziel ${to}`);
    continue;
  }

  if (!/<html lang="de/.test(html)) fail(name, 'lang="de" fehlt');
  if (!/<title>[^<]{10,}<\/title>/.test(html)) fail(name, '<title> fehlt oder zu kurz');
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  if (desc.length < 50) fail(name, `meta description zu kurz (${desc.length})`);
  if (!/<link rel="canonical" href="https?:\/\//.test(html)) fail(name, 'canonical fehlt');
  if (site && !html.includes(`<link rel="canonical" href="${site}`)) fail(name, 'canonical zeigt nicht auf SITE_URL');
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) fail(name, `${h1} × <h1>`);
  if (/\sstyle="/.test(html)) fail(name, 'Inline-style-Attribut (durch CSP blockiert)');
  if (!/http-equiv="content-security-policy"/i.test(html)) fail(name, 'CSP-Meta-Tag fehlt');
  if (/<img(?![^>]*\salt[\s=>])[^>]*>/.test(html)) fail(name, '<img> ohne alt');

  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const json = JSON.parse(m[1]);
      if (/"(aggregateRating|review)"/i.test(JSON.stringify(json))) fail(name, 'JSON-LD enthält Bewertungen');
    } catch {
      fail(name, 'JSON-LD ist kein gültiges JSON');
    }
  }

  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const t = target(m[1].replace(/&amp;/g, '&'));
    if (t && !existsSync(t)) fail(name, `defekter interner Link ${m[1]}`);
  }
  for (const m of html.matchAll(/\ssrcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const t = target(part.trim().split(/\s+/)[0]);
      if (t && !existsSync(t)) fail(name, `fehlendes Bild ${part.trim()}`);
    }
  }
  for (const m of html.matchAll(/\shref="(\/[^"]*)"/g)) {
    if (base !== '/' && !m[1].startsWith(base)) fail(name, `Link ohne Base-Pfad ${m[1]}`);
  }
}

const robots = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
if (!/Sitemap: https?:\/\/.+sitemap-index\.xml/.test(robots)) fail('robots.txt', 'Sitemap-Verweis fehlt');

const sitemaps = files.filter((f) => /sitemap-\d+\.xml$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('');
for (const hidden of ['merkliste', 'vergleich', 'danke', 'download']) {
  if (sitemaps.includes(`/${hidden}/<`)) fail('sitemap', `/${hidden}/ sollte nicht in der Sitemap stehen`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} Problem(e) in dist/:\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✓ dist/ geprüft: ${htmlFiles.length} HTML-Dateien, Base-Pfad ${base}`);
