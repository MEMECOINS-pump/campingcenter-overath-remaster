# CCO API (Cloudflare Worker)

Secure backend for the Campingcenter Overath remaster.

## Features

- Normalized vehicle cache with mobile.de adapter (or fixture fallback)
- Idempotent sync that never wipes inventory on provider failure
- Camping Finder lead storage + 12h `[AUSWERTUNG]` reports
- Rental inquiries → `vermietung@ccoverath.de`
- Workshop assistant (rules + optional AI)
- La Strada configuration inquiry

## Setup

```bash
cd api
npm install --legacy-peer-deps
npx wrangler login
npx wrangler kv namespace create STORE
npx wrangler kv namespace create STORE --preview
# put the IDs into wrangler.toml
npm run deploy
```

### Secrets

```bash
npx wrangler secret put MOBILE_DE_API_USER
npx wrangler secret put MOBILE_DE_API_PASSWORD
npx wrangler secret put MAIL_HOST
npx wrangler secret put MAIL_USER
npx wrangler secret put MAIL_PASSWORD
npx wrangler secret put AI_API_KEY
```

Set `PUBLIC_API_BASE` on the Astro site to the Worker URL.
