# Presentation Report — Campingcenter Overath Remaster

**Live:** https://memecoins-pump.github.io/campingcenter-overath-remaster/  
**Official facts source:** https://ccoverath.de/ (presentation does not invent inventory/hours)  
**Date:** 2026-10-27

## Bugs fixed

- Removed the entire English i18n layer (blank pages, bad redirects, Merkliste link rewriting).
- German-only chrome (`<html lang="de">`), DE URLs only, no `/en/` in `dist/`.
- Merkliste fix retained: `data-cco-fav-count` / `ccoFavCount` — never `data-fav-count` on `<html>`.
- Single Companion FAB (chat + a11y + contact); no separate Chat/a11y FABs.
- Opening-hours pill centered in the header logo→nav gap (44px tap target; opens status sheet after View Transitions).

## Translation removal

| Removed | Status |
| --- | --- |
| `src/pages/en/**` | Deleted |
| `src/i18n/**` | Deleted |
| Astro `i18n` / `prefixDefaultLocale` | Removed |
| Companion Sprache / EN card | Removed |
| `cco:lang` boot redirects | Removed |
| hreflang EN / EN SEO alternates | Removed |
| Locale link rewriting in `site.ts` | Removed |
| EN-only tests + verify-dist EN routes | Removed |

Companion cards: **Camping-Beratung (KI)**, **Barrierefreiheit**, **Schnellkontakt**.

## What stayed (remaster)

CampingCompanion + Camping-KI, a11y prefs, anti-flicker boot, PrestigeStrip, cookie consent, Finder / workshop / rental / Ankauf / showroom (DE).

## Mobile / design / a11y

- Compact header; opening pill under logo on small screens, gap-centered on desktop.
- Warm CCO palette + PrestigeStrip; soft View Transitions.
- a11y prefs inside Companion; boot applies before paint.

## API / perf

- Static GitHub Pages. Formspree / Workers AI env-dependent.
- Production: **42 DE pages**. Local verify uses `BASE_PATH=/`; CI injects `/campingcenter-overath-remaster/` via `actions/configure-pages`.

## Test coverage

| Area | Result |
| --- | --- |
| `npm run ci` | Green (42 pages, verify OK) |
| Zero `@/i18n` in `src` | Confirmed |
| Live smoke | Homepage `lang=de`, Companion, PrestigeStrip; `/wohnmobile/` 200; `/en/` **404** |

## Remaining

1. Formspree/AI worker secrets if live AI answers are required.
2. Optional deeper mobile QA / real rental form submit.
3. Do not reintroduce `/en/` or `cco:lang`.

## Deploy

- Branch: `main`
- Tip SHA: `78905d4`
- CI & Deploy: [40586172386](https://github.com/MEMECOINS-pump/campingcenter-overath-remaster/actions/runs/40586172386) — build + Pages **success**
- URL: https://memecoins-pump.github.io/campingcenter-overath-remaster/
- Base path: CI `BASE_PATH` from configure-pages → `/campingcenter-overath-remaster/`; local default `/`
