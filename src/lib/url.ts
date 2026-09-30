const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

/** Prefix an internal, root-relative path with the deployment base path. */
export function url(path = '/'): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) return path;
  const [pathname = '/', hash = ''] = path.split('#');
  const clean = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withSlash = /\.[a-z0-9]+$/i.test(clean) || clean.includes('?') || clean.endsWith('/') ? clean : `${clean}/`;
  return `${BASE}${withSlash}${hash ? `#${hash}` : ''}`;
}

/** Absolute URL for canonical tags, sitemaps and structured data. */
export function absoluteUrl(path: string, site: URL | undefined): string {
  return new URL(url(path), site ?? 'http://localhost:4321').href;
}

/** Strip the base path again, e.g. to compare against navigation hrefs. */
export function stripBase(pathname: string): string {
  const p = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  return p || '/';
}

export const isExternal = (href: string): boolean => /^https?:\/\//.test(href);
