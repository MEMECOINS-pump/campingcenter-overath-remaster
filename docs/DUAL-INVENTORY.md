# Dual inventory

- Astro site builds from `src/data/inventory.json` (static snapshot).
- Cloudflare Worker syncs to KV via `api/src/sync.ts` (mobile.de or fixture).
- `firstSeenAt` is set on first import and preserved on updates. Homepage badge NEU IM BESTAND only when `firstSeenAt` is within 30 days.
- To refresh the static site from Worker inventory later: export active vehicles from GET /api/vehicles into inventory.json, then rebuild Pages.
