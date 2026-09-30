import type { APIRoute } from 'astro';
import { absoluteUrl } from '@/lib/url';

export const GET: APIRoute = ({ site }) =>
  new Response(
    [
      'User-agent: *',
      'Allow: /',
      `Disallow: ${new URL(absoluteUrl('/merkliste/', site)).pathname}`,
      `Disallow: ${new URL(absoluteUrl('/vergleich/', site)).pathname}`,
      `Disallow: ${new URL(absoluteUrl('/danke/', site)).pathname}`,
      '',
      `Sitemap: ${absoluteUrl('/sitemap-index.xml', site)}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
