# AI Compass Emergency Fix — Self-Healing Controller

**Date:** 2026-03-28  
**Priority:** P0  
**Commit target:** remaster `main` (GitHub Pages staging)

---

## 1. Exact root cause

Two interacting failure modes:

### A) Deferred module race (explains “refresh fixes homepage”)

The compass open handler lived in deferred ES modules (`site.ts` / `companion.ts`). On a cold load, the FAB is visible before those modules execute. A first click before init is a no-op. After a manual refresh (or a longer wait), modules are cached/ready and the click works.

### B) ClientRouter + scoped CSS + legacy ChatWidget (explains “broken after navigation”)

`transition:persist` kept chrome DOM across soft-nav while Astro scoped CSS hashes from the previous page no longer matched. Closed ChatWidget lost `pointer-events: none` / collapsed size and intercepted FAB hits (`z-chat` vs companion). Hard refresh remounted matching CSS.

### Production note

**https://ccoverath.de/** is still the WordPress site and **does not include** this remaster compass (`data-companion` absent). The remaster lives on GitHub Pages staging. Claims about “production” for this widget must refer to the remaster deploy, not WordPress, until cutover.

---

## 2. Affected files

| File | Change |
|------|--------|
| `src/lib/boot-script.ts` | Inline emergency open/close + heal + recover |
| `src/scripts/companion.ts` | Module enhancements, self-heal, no double-toggle |
| `src/layouts/BaseLayout.astro` | Removed legacy `ChatWidget` |
| `src/styles/global.css` | `--z-companion: 80`, sheet/panel global chrome |
| `e2e/ai-compass-first-click-after-navigation.spec.ts` | **New** named regression suite |
| `e2e/companion-nav-regression.spec.ts` | Ankauf route added |
| `tests/companion.test.ts` | Architecture assertions updated |
| `docs/COMPANION-SELF-HEAL-REPORT.md` | This report |

---

## 3. Permanent fix

1. **Inline boot controller** (blocking `is:inline`) owns FAB open/close with `showModal` — works before any module loads.
2. **Module** replaces `__ccoCompanionSetOpen` for tabs/AI/size; does **not** double-toggle the FAB.
3. **Legacy ChatWidget removed** from layout (primary post-nav click thief eliminated).
4. **Global CSS** for FAB geometry, panel/sheet visibility, closed-chat inert rules.
5. Panel open **never waits** on AI backend.

---

## 4. Self-healing mechanism

- `ccoHealChat` / `healChatOverlays` — force legacy chat shells inert
- `ccoUniqueRoot` / `uniqueRoot` — drop duplicate companions after VT
- Bounded `recover` (max 3) on missing root / failed open
- Lightweight `MutationObserver` on `body` childList (not whole subtree)
- Re-heal on `astro:page-load` / `astro:after-swap`
- Diagnostics: `localStorage.setItem('cco:debug-companion','1')` — no production spam by default

**No full-page reloads.**

---

## 5. Automated test results

Production build + Playwright (`--workers=1`):

| Suite | Result |
|-------|--------|
| `ai-compass-first-click-after-navigation` (8 tests) | **PASS** |
| companion-nav-regression (3) | **PASS** |
| companion-smoke (4) | **PASS** |
| Vitest companion (5) | **PASS** |

**15 / 15 Playwright passed**, including:

- Homepage first click
- Ankauf soft-nav first click
- Direct Ankauf entry
- Multi-route then home
- **100** open/close cycles
- AI import failure still opens panel
- Boot controller + heal path
- Mobile 390×844 Ankauf + scroll

---

## 6. Mobile test results

- Viewport **390×844**
- Ankauf first tap after navigation: **PASS**
- After scroll to bottom: **PASS**

---

## 7. Production / staging verification

| Target | Compass present? | Verified this change? |
|--------|------------------|------------------------|
| `ccoverath.de` (WordPress) | **No** | N/A — widget not deployed there |
| GitHub Pages remaster | Yes | Prior deploy worked in Chromium hit-tests; **this commit pending push/CI** |

After CI deploys this commit, re-check staging:

1. Fresh profile → homepage → one click  
2. Soft-nav → Ankauf → one click  
3. Mobile viewport repeat  

---

## 8. Remaining risks

- WordPress production will keep reporting “no compass / broken” until remaster cutover.
- Aggressive CDN/browser cache of old HTML/JS on staging until deploy + natural cache expiry.
- Safari/iOS not run in this automation pass (Chromium Playwright only); recommend one manual staging pass on iPhone.
