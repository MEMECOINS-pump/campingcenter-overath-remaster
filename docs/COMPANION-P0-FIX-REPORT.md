# Companion P0 Fix Report — AI Support Widget Clickability

**Project:** Campingcenter Overath  
**Date:** 2026-03-28  
**Priority:** P0 — Critical  
**Status:** Fixed · Tests green · Pending deploy verification on staging

---

## ROOT CAUSE

The site uses **Astro ClientRouter** (View Transitions) with `transition:persist` on chrome widgets.

After soft navigation:

1. Persisted companion / ChatWidget DOM kept old Astro **scoped CSS hashes** from the previous page.
2. New page CSS no longer matched those hashes → closed ChatWidget lost `pointer-events: none` / collapsed size rules.
3. Invisible ChatWidget layer (`z-chat` > `z-companion`) sat over the compass FAB and **ate pointer events**.
4. Hard refresh remounted matching scoped CSS → FAB worked again.

Secondary factors: per-page click listeners on remounted nodes; FAB geometry living only in scoped CSS so hit-targets could shrink after VT.

---

## FIX IMPLEMENTED

1. **`src/scripts/companion.ts`** — Single controller with document capture-phase event delegation; `setOpen` independent of AI backend; German `AI_UNAVAILABLE` copy; duplicate-root cleanup; lazy AI import.
2. **`src/styles/global.css`** — Unscoped hit-testing + FAB/panel geometry for `.companion[data-companion]`; closed ChatWidget forced to zero size + `pointer-events: none !important`.
3. **`BaseLayout.astro`** — Keep `transition:persist="cco-companion"`; **do not** persist ChatWidget (avoids scoped-hash trap).
4. **`CampingCompanion.astro`** — Markup/visuals preserved; init reduced to `initCompanion` + `astro:page-load` / `astro:after-swap`.
5. **`site.ts`** — Boot + after-swap call `initCompanion()`.
6. **E2E** — Soft-nav, 50-cycle, mobile first-tap, smoke soft-nav regressions.

Opening the panel never waits on AI API readiness.

---

## FILES CHANGED

| File | Change |
|------|--------|
| `src/scripts/companion.ts` | **New** — delegated lifecycle controller |
| `src/styles/global.css` | Global companion + closed-chat hit rules |
| `src/layouts/BaseLayout.astro` | Persist companion only; ChatWidget not persisted |
| `src/components/layout/CampingCompanion.astro` | Thin init; design preserved |
| `src/scripts/site.ts` | Wire `initCompanion` |
| `e2e/companion-nav-regression.spec.ts` | **New** — soft-nav / cycles / mobile |
| `e2e/companion-smoke.spec.ts` | Soft-nav uses visible links |
| `tests/companion.test.ts` | Unit assertions for new architecture |

---

## TEST RESULTS

### Playwright (`--workers=1`)

| Test | Result |
|------|--------|
| Soft-nav across key routes + back/forward | **PASS** (26.2s) |
| 50 navigation/open/close cycles (no refresh) | **PASS** (2.4m) |
| Mobile viewport first tap after navigation + scroll | **PASS** (7.6s) |
| Smoke: opens compact support center | **PASS** |
| Smoke: a11y prefs | **PASS** |
| Smoke: legacy lang pref | **PASS** |
| Smoke: FAB hard load + soft-nav | **PASS** |

**7 / 7 passed**

### Vitest

`tests/companion.test.ts` — **5 / 5 passed**

---

## MOBILE RESULTS

- Viewport **390×844** (Playwright)
- First tap after soft-nav to `/wohnmobile/` opens panel
- Opens after scroll to bottom
- Design: centered mobile panel rules retained in global + scoped CSS

Browsers exercised by Playwright Chromium; staging manual Safari/Android recommended post-deploy.

---

## REGRESSION RESULTS

- Soft-nav routes: home → Wohnmobile → Kontakt → Camper Finder → Werkstatt → Barrierefreiheit → Vermietung
- Browser back / forward after soft-nav
- 50 open/close cycles across `/`, `/wohnmobile/`, `/kontakt/`, `/camper-finder/`, `/ueber-uns/`
- Hit-test asserts `elementFromPoint` at FAB center resolves to `[data-companion-open]`

---

## DEPLOYMENT STATUS

- Fix landed in working tree on `main` (commit pending / in progress at report write time).
- Production WordPress `ccoverath.de` is **not** overwritten by this remaster.
- Staging: GitHub Pages remaster after push/CI.

---

## REMAINING ISSUES

- None for P0 clickability after navigation.
- Optional: real-device Safari/Android smoke on staging after deploy.
- Legacy ChatWidget still in layout (non-persisted); closed-state CSS keeps it from intercepting. Full removal is out of scope for this P0.
