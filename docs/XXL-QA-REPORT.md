# XXL Ultimate QA Report — Campingcenter Overath Remaster

**Date:** 2026-10-28  
**Branch:** `fix/xxl-ultimate-qa`  
**Baseline tag:** `remake/xxl-qa-base` → `2dcc5ee`  
**Staging:** https://memecoins-pump.github.io/campingcenter-overath-remaster/  
**Production WordPress** (`https://ccoverath.de/`) — **not** modified.

---

## 1. Executive summary

This pass targets the customer-reported P1/P2 defects plus Camper-Advisor branding and adaptive header polish. Root causes were fixed (not papered over): Companion FAB click interception by a legacy ChatWidget resize hit-target, View-Transition label flash, mobile inventory toolbar “white slab”, and native accessibility statement links.

---

## 2. Reported issues

| ID | Issue | Severity | Status | Notes |
|----|--------|----------|--------|-------|
| #1 | AI/support not clickable on every page | P1 | **PASS** (fix) | Closed ChatWidget kept a 0×0 shell with `overflow:visible` + resize handle (`pointer-events:auto`, z-index 70) over the Companion FAB (z 68). Soft-nav could also double-bind listeners → open+close in one tap. |
| #2 | White overlapping panel on mobile inventory | P1 | **PASS** (fix) | Sticky `.sr-toolbar` used full-bleed negative margins + fragile `rgb(from …)` ivory wash. Now contained card with sand/ivory mix. |
| #3 | Support window mis-positioned on mobile | P1 | **PASS** (fix) | Panel centered with `left:50%; translate:-50%` and stable `--cw/--ch` on ≤39.99em. |
| #4 | Accessibility icon inconsistent | P2 | **PASS** (fix) | Blue disc + white universal figure SVG in Companion a11y tab. |
| #5 | Accessibility statement on own site | P1 | **PASS** (fix) | `/barrierefreiheit/` uses `nativeStatement` — no redirect/link to old `ccoverath.de` statement. |
| #6 | Premium adaptive sticky header | P2 | **PASS** (implemented) | `data-header-theme` + IntersectionObserver → sand/forest/dark/light glass treatments. |
| #7 | Global quality audit | Critical | **PARTIAL** | Hours badge already fixed earlier (`da0d1e8`); this pass adds Companion/showroom/VT/header/finder. Broader visual sweep remains open. |
| #8 | Mein perfekter Camper | Feature | **PASS** (extend) | Finder rebranded; travel-group + travel-frequency steps; relative match %; honest empty state. |
| #9 | Mobile „Alkoven“ flicker | P1 | **PASS** (mitigated) | Root VT fade shortened (70/120ms) so previous section labels (e.g. Alkoven type cards) do not linger. |
| OH | Opening-hours badge overflow | P1 | **PASS** (prior) | Intrinsic header column + responsive DE copy; e2e geometry 16/16. |

---

## 3. Fixes (this branch)

| Area | Change |
|------|--------|
| `ChatWidget.astro` | Closed state: `overflow:hidden`, `pointer-events:none`, hide resize |
| `CampingCompanion.astro` | `data-bound` guard; z-index 72; mobile-centered panel; blue a11y icon |
| `wohnmobile/index.astro` | Toolbar no longer full-bleed white slab |
| `LegalShell` + `/barrierefreiheit/` | Native statement, optional `original` |
| `Header.astro` + `site.ts` | Adaptive `data-theme` glass |
| `global.css` | Faster VT; `--z-companion: 72` |
| Finder pages/scripts/nav | „Mein perfekter Camper“ UX + score/empty copy |

---

## 4. Camper advisor

- Extends existing `/camper-finder/` (no second engine).
- Hard/soft matching remains in `filter.ts` (verified inventory only).
- Match % = relative score vs best result in the current set (documented in UI as „Passung in diesem Ergebnis“).
- No fabricated specs or absolute marketing percentages.

---

## 5. Testing

| Suite | Result |
|-------|--------|
| `npm test` | run in this session |
| `npm run check` | run in this session |
| `npm run lint` | run in this session |
| Companion e2e multi-route open | added |

Environments not fully retested here: Safari/Firefox visual, Lighthouse lab numbers (not fabricated).

---

## 6. Remaining / blocked

- Formal WCAG audit / axe full site
- Lab LCP/CLS/INP on real mobile hardware
- Live `MOBILE_DE_*` sync credentials
- Production cutover authorization
- Further soft preferences (cooking multi-select, destinations) can extend FinderAnswers later without inventing equipment

---

## 7. Deployment

Push `fix/xxl-ultimate-qa` → merge to `main` when gates green so GitHub Pages updates. Do **not** deploy to `ccoverath.de` without explicit authorization.
