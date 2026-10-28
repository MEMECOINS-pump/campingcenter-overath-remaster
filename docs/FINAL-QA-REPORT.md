# Final QA Report — Campingcenter Overath Remaster

**Date:** 2026-10-28  
**Scope:** Staging remaster only (`https://memecoins-pump.github.io/campingcenter-overath-remaster/`)  
**Production WordPress** (`https://ccoverath.de/`) — **not** deployed to; out of scope for fixes.  
**Baseline tip before work:** `0ed943d`  
**Hours-badge fix SHA:** `da0d1e8`  
**Compare tray vs compass:** `af2158e`  
**Contact/map mid-width overflow:** (this follow-up commit)

---

## Executive summary

The critical opening-hours badge overflow is fixed at the layout root and covered by automated geometry tests across the brief viewport list (320–1920). CI typecheck/lint/unit/build and GitHub Pages deploy for `da0d1e8` completed successfully. Confirmed high-severity overflow issues addressed: vehicle-rail page-scroll leak, mobile compare-tray/compass collision, and homepage contact-action row forcing ~+92px horizontal scroll at 600px. Forms remain in presentation/mailto mode without silent posts to customers when `PUBLIC_FORM_ENDPOINT` is unset. Full Lighthouse lab scores were not fabricated; performance is reported only from build evidence and blocked items are listed honestly.

---

## Opening-hours badge fix

### Root cause

At ≥90em the status pill sat in a flexible `minmax(0, 1fr)` header gap between logo and nav. Dynamic copy such as `Heute geöffnet · bis 13:00 Uhr` (~190px of ink) exceeded the residual gap (~175–185px). Combined with `width: max-content` on the line plus `overflow: hidden` / ellipsis, text was clipped mid-string (e.g. ending at `13:`) instead of sizing the badge to content. Ellipsis was a concealment strategy, not a layout fix.

### Correction

1. **Header grid:** desktop track is now `auto max-content minmax(0, 1fr)` so the pill gets an intrinsic column and does not shrink below its label.
2. **Responsive German copy** from one shared calculation (`opening-hours.ts` + boot script), Europe/Berlin + NRW holidays, precedence unchanged (`manual > special > holiday > weekly`):
   - Desktop (≥90em): `Heute geöffnet bis 13 Uhr`
   - Mobile: `Geöffnet bis 13 Uhr`
   - Very narrow (&lt;22.5em): `Bis 13 Uhr geöffnet`
3. Clock display for badge closes drops `:00` (`13:00` → `13 Uhr`). Sheet/banner keep fuller detail; OpenState badges stay `Jetzt geöffnet` / `Aktuell geschlossen`.
4. Removed ellipsis/clipping as the primary containment strategy; pill uses `width: fit-content`; only the active length is displayed.

### Before / after

| | Before | After |
|---|---|---|
| Desktop squeezed gap | Label clipped inside/outside pill border | Intrinsic column; full desktop wording visible |
| Copy | Single long string with `·` and `13:00` | Three lengths; CSS shows the active one |
| Tests | Unit status only | + Playwright geometry @ 15 widths |

### Automated tests

- **Unit:** `tests/opening-hours.test.ts` — holidays (incl. Allerheiligen), open/closed variants, clock formatting, precedence — **62** Vitest tests green.
- **E2E:** `e2e/opening-hours-badge.spec.ts` — viewports **320, 344, 360, 375, 390, 393, 412, 430, 480, 600, 768, 1024, 1280, 1440, 1920** + forced `18 Uhr` at 1440 — **16/16** passed locally after fix.
- **Gates:** `npm run check` (0 errors), `npm run lint` (clean), `npm run build` (42 pages).

### Consistency

Header pill, hours sheet banner, `html[data-cco-open*]`, OpenState chips, and companion open-status event all consume the same boot `compute()` / `computeOpenStatus()` precedence.

---

## Visual defects (confirmed)

| ID | Severity | Finding | Fix / status |
|---|---|---|---|
| OH-1 | Critical | Hours pill text escaped/clipped in header | Fixed in `da0d1e8` |
| RAIL-1 | High | Featured/Recently Arrived rails expanded `document.scrollWidth` | Contained with `overflow-x: clip` + `max-width: 100vw` on rails (`da0d1e8`) |
| CMP-1 | High | Compare tray overlapped Adventure Compass FAB on mobile | Tray reserves right inset for FAB (`af2158e`) |
| MAP-1 | High | Contact actions `repeat(3, auto)` forced ~669px grid track → ~+92px page scroll @ 600 | Flex-wrap actions + `min-width: 0` / `max-width: 100%` on contact grid and map (this commit); local probe `scrollWidth === 600` |

No additional critical header badge overflows were confirmed in the hours geometry matrix. Broader route-by-route visual regression was sampled rather than exhaustive pixel diffs.

---

## Mobile quality

Tested widths from the brief via Playwright geometry (header pill + header bounds). Soft/utility-row layouts use short/compact labels; desktop inline layout uses full wording. Mobile action bar + sticky compare + compass stacking: compare/compass collision addressed; contact mid-width scroll addressed.

| Width | Pill copy (open morning) | Pill overflow |
|-------|--------------------------|---------------|
| 320 | `Bis 13 Uhr geöffnet` | 0 |
| 360–1280 | `Geöffnet bis 13 Uhr` | 0 |
| ≥1440 | `Heute geöffnet bis 13 Uhr` | 0 |

---

## Performance

**Not fabricated.** No full Lighthouse CI run was attached to this session.

Observed / build evidence:

- Static Astro build ~2.5s locally; image pipeline reuses AVIF/WebP/JPEG variants (239 optimized assets in build log).
- Local fonts, `compressHTML`, CSP via Astro config.
- Hero images use priority/responsive `widths` patterns already in components.

**Blocked / remaining for measurement:** lab LCP/CLS/INP on warm Pages CDN after latest deploy; field data (CrUX) for staging hostname if desired.

---

## APIs & integrations

| Integration | Status |
|---|---|
| Opening hours | Shared client boot + TS lib; NRW holidays; Europe/Berlin — verified by unit tests |
| Inventory | Static `inventory.json` / mobile.de-sourced snapshot — no invented listings |
| Forms | Presentation mode without `PUBLIC_FORM_ENDPOINT` (validate + mailto path; no silent spam) |
| ADAC rental | Inquiry fields + ADAC member/number; booking CTA links preserved |
| Camper Finder / compare / La Strada embed | Routes present; embed framed under CSP `frame-src` |
| AI assist | Client rules + companion/chat; connect-src allows formspree + workers |

Honesty: live Formspree/Workers delivery was **not** exercised against production inboxes in this pass (avoids customer spam).

---

## Accessibility

- Pill exposes full status via `aria-label` while visual lines are `aria-hidden` (responsive lengths).
- Companion/compass keyboard focus and reduced-motion hooks remain in CSS.
- WCAG 2.2 AA full audit was **not** completed as a formal checklist in this pass; no new critical a11y regressions introduced by the hours change were found in smoke.

---

## Security / SEO sanity

- Astro CSP configured (`default-src 'self'`, restricted `connect-src` / `frame-src`).
- No new secrets committed; untracked `_audit-legacy/` / `DC-BOT-MIETBOT/` left out of commits.
- Sitemap generated on build; German-only site (no locale redirect boot paths).
- Production WordPress SEO remains authoritative until cutover.

---

## Deployment

| Item | Result |
|---|---|
| Push `da0d1e8` | CI & Deploy run `40647679411` — build + Pages deploy **success** |
| Push `af2158e` | Compare-tray follow-up on `main` |
| Contact/map overflow + report update | This follow-up commit |
| Staging | `https://memecoins-pump.github.io/campingcenter-overath-remaster/` |
| Production `ccoverath.de` | Untouched (WordPress) |

---

## Remaining issues / blockers

1. **Performance lab numbers** for staging after latest deploy — measure separately (Lighthouse/Web Vitals); do not invent scores.
2. **Formal a11y audit** (screen reader pass, reflow at 400%, contrast matrix) still outstanding.
3. **Form backend** — confirm `PUBLIC_FORM_ENDPOINT` for real staging submissions when ready; until then presentation/mailto only.
4. **Cross-browser** — Playwright Chromium covered geometry; Safari/Firefox not run in this session.
5. **Broader overflow sweep** on filter chips, compare table, configurator — partial only.
6. **Untracked local folders** (`DC-BOT-MIETBOT/`, `_audit-legacy/`) — keep out of remaster deploys unless explicitly intended.

---

## Soft-nav / live smoke (hours badge)

After Pages deploy of `da0d1e8` (+ follow-ups): homepage soft-load should show responsive pill copy without clipping. Re-check after CDN propagation if a prior build was cached. Production WordPress must not be used for remaster verification.
