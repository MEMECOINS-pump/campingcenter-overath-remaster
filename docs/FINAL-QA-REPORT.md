# Final QA Report — Campingcenter Overath Remaster

**Date:** 2026-10-28  
**Scope:** Staging remaster only (`https://memecoins-pump.github.io/campingcenter-overath-remaster/`)  
**Production WordPress** (`https://ccoverath.de/`) — **not** deployed to; out of scope for fixes.  
**Baseline tip before work:** `0ed943d`  
**Hours-badge fix SHA:** `da0d1e8`  
**Follow-up (compare tray vs compass):** `af2158e`

---

## Executive summary

The critical opening-hours badge overflow is fixed at the layout root and covered by automated geometry tests across the brief viewport list (320–1920). CI typecheck/lint/unit/build and GitHub Pages deploy for `da0d1e8` completed successfully. A mid-width vehicle-rail page-scroll leak and a mobile compare-tray/compass collision were confirmed and fixed. Forms remain in presentation/mailto mode without silent posts to customers when `PUBLIC_FORM_ENDPOINT` is unset. Full Lighthouse lab scores were not fabricated; performance is reported only from build/asset evidence and blocked items are listed honestly.

---

## Opening-hours badge fix

### Root cause

At ≥90em the status pill sat in a flexible `minmax(0, 1fr)` header gap between logo and nav. Dynamic copy such as `Heute geöffnet · bis 13:00 Uhr` (~190px of ink) exceeded the residual gap (~175px). Combined with `width: max-content` on the line plus `overflow: hidden` / ellipsis, text was clipped mid-string (e.g. ending at `13:`) instead of sizing the badge to content. Ellipsis was a concealment strategy, not a layout fix.

### Correction

1. **Header grid:** desktop track is now `auto max-content minmax(0, 1fr)` so the pill gets an intrinsic column and does not shrink below its label.
2. **Responsive German copy** from one shared calculation (`opening-hours.ts` + boot script), Europe/Berlin + NRW holidays, precedence unchanged (`manual > special > holiday > weekly`):
   - Desktop (≥90em): `Heute geöffnet bis 13 Uhr`
   - Mobile: `Geöffnet bis 13 Uhr`
   - Very narrow (&lt;22.5em): `Bis 13 Uhr geöffnet`
3. Clock display for badge closes drops `:00` (`13:00` → `13 Uhr`). Sheet/banner keep fuller detail; OpenState badges stay `Jetzt geöffnet` / `Aktuell geschlossen`.
4. Removed ellipsis/clipping as the primary containment strategy; pill uses `width: fit-content`.

### Before / after

| | Before | After |
|---|---|---|
| Desktop squeezed gap | Label clipped inside/outside pill border | Intrinsic column; full desktop wording visible |
| Copy | Single long string with `·` and `13:00` | Three lengths; CSS shows the active one |
| Tests | Unit status only | + Playwright geometry @ 15 widths |

### Automated tests

- **Unit:** `tests/opening-hours.test.ts` — holidays (incl. Allerheiligen), open/closed variants, clock formatting, precedence — **62** Vitest tests green.
- **E2E:** `e2e/opening-hours-badge.spec.ts` — viewports **320, 344, 360, 375, 390, 393, 412, 430, 480, 600, 768, 1024, 1280, 1440, 1920** + forced `18 Uhr` at 1440 — **16/16** passed locally after fix.

### Consistency

Header pill, hours sheet banner, `html[data-cco-open*]`, OpenState chips, and companion open-status event all consume the same boot `compute()` / `computeOpenStatus()` precedence.

---

## Visual defects (confirmed)

| ID | Severity | Finding | Fix / status |
|---|---|---|---|
| OH-1 | Critical | Hours pill text escaped/clipped in header | Fixed in `da0d1e8` |
| RAIL-1 | High | Featured/Recently Arrived rails expanded `document.scrollWidth` (~+93px @ 600px) | Contained with `overflow-x: clip` + `min-width: 0` on rails (`da0d1e8`) |
| CMP-1 | High | Compare tray overlapped Adventure Compass FAB on mobile | Tray reserves right inset for FAB (`af2158e`) |

No additional critical header/nav badge overflows were confirmed in the hours geometry matrix. Broader page-by-page visual regression was sampled (home @ 320/375/1440) rather than exhaustive pixel diffs for every route.

---

## Mobile quality

Tested widths from the brief via Playwright geometry (header pill + header bounds). Soft/utility-row layouts use short/compact labels; desktop inline layout uses full wording. Mobile action bar + sticky compare + compass stacking: compare/compass collision addressed; action-bar height still drives `--actionbar-h` for lifts.

---

## Performance

**Not fabricated.** No full Lighthouse CI run was attached to this session.

Observed / build evidence:

- Static Astro build ~2.6s locally; image pipeline reuses AVIF/WebP/JPEG variants (239 optimized assets in build log).
- Local fonts (Inter, Fraunces), `compressHTML`, CSP via Astro config.
- Hero images use priority/responsive `widths` patterns already in components.

**Blocked / remaining for measurement:** lab LCP/CLS/INP on warm Pages CDN after `af2158e` deploy; field data (CrUX) for staging hostname if desired.

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
| Push `af2158e` | Compare-tray follow-up pushed to `main` (deploy in flight / follow CI) |
| Staging | `https://memecoins-pump.github.io/campingcenter-overath-remaster/` |
| Production `ccoverath.de` | Untouched (WordPress) |

Local gates before push: `npm test` (62), `npm run check` (0 errors), `npm run lint` (clean), badge e2e 16/16, `npm run build` OK.

---

## Remaining issues / blockers

1. **Performance lab numbers** for staging after latest deploy — measure separately (Lighthouse/Web Vitals); do not invent scores.
2. **Formal a11y audit** (screen reader pass, reflow at 400%, contrast matrix) still outstanding.
3. **Form backend** — confirm `PUBLIC_FORM_ENDPOINT` for real staging submissions when ready; until then presentation/mailto only.
4. **Cross-browser** — Playwright Chromium covered geometry; Safari/Firefox not run in this session.
5. **Untracked local folders** (`DC-BOT-MIETBOT/`, `_audit-legacy/`) — keep out of remaster deploys unless explicitly intended.

---

## Soft-nav / live smoke (hours badge)

After `da0d1e8` Pages deploy: homepage soft-load should show responsive pill copy without clipping. Re-check after CDN propagation if a prior build was cached. Production WordPress must not be used for remaster verification.
