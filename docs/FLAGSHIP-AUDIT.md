# Flagship-Audit 2026/2027 — Campingcenter Overath

**Stand:** Branch `remake/flagship-2026` · Baseline-Tag `remake/flagship-2026-base` · Commit-Basis `17755e3`  
**Produktion:** https://ccoverath.de/ — **nicht** überschreiben  
**Präsentation/Staging:** GitHub Pages via Push auf `main` (Workflow `.github/workflows/deploy.yml`)  
**Sprache:** Deutsch only · Keine erfundenen Fahrzeuge/Preise/Bewertungen/Partnerschaften

---

## 0. Schutzstatus (Phase 0)

| Item | Status |
|------|--------|
| Tip vor Remake | `17755e3` auf `main` = `origin/main` |
| Protect-Branch | `remake/flagship-2026` @ `17755e3` |
| Protect-Tag | `remake/flagship-2026-base` → `17755e3` |
| Untracked (nicht Teil Remaster) | `DC-BOT-MIETBOT/`, `_audit-legacy/` |
| Deploy-Risiko | Deploy nur bei Push auf **`main`** — Remake-Arbeit bleibt auf Branch |

### Env / APIs (Namen only — keine Secrets)

**Frontend (`.env.example`):** `PUBLIC_FORM_ENDPOINT`, `PUBLIC_API_BASE`, `PUBLIC_INDEXABLE`, `SITE_URL`, `BASE_PATH`  
**Build/CI:** dieselben Public-Vars + Pages `SITE_URL`/`BASE_PATH`  
**Worker (`api/`):** `PUBLIC_SITE_ORIGIN`, `PUBLIC_SITE_BASE`, `FINDER_REPORT_TO`, `RENTAL_MAIL_TO`, `WORKSHOP_MAIL_TO`, `MOBILE_DE_*`, `MAIL_*`, `AI_*`, `LASTRADA_API_KEY`, optional `CORS_ORIGINS`  
**Deploy:** Astro static → GitHub Pages; API optional Cloudflare Worker (`api/wrangler.toml`). Kein Cloudflare Pages fürs Astro-Frontend.

### Remaster vs. Produktion (Kurz)

| | Remaster (Repo) | Produktion ccoverath.de |
|--|-----------------|-------------------------|
| Stack | Astro 7 static + optional Worker | Live-Site (Legacy-Basis, Inhalte authentisch) |
| Indexierung | `PUBLIC_INDEXABLE` default off (noindex) | Indexiert |
| Inventar | Snapshot `inventory.json` (mobile.de-IDs) | Live-Portal mobile.de |
| Sprache | DE only (EN-Routen entfernt) | DE |
| Redirects | Legacy-Pfade in `astro.config.mjs` | Bestehende URLs |

---

## 1. Routen-Inventar

### Statisch

`/`, `/360-rundgang/`, `/agb/`, `/barrierefreiheit/`, `/bewerbung/`, `/camper-finder/`, `/danke/`, `/datenschutz/`, `/fahrzeugwaesche-herbst/`, `/impressum/`, `/jobs/`, `/kontakt/`, `/la-strada-konfigurator/`, `/marken/`, `/merkliste/`, `/ueber-uns/`, `/vergleich/`, `/vermietung-wohnmobile/`, `/werkstatt-kundendienst/`, `/wohnmobil-ankauf/`, `/wohnmobil-verkauf/`, `/wohnmobile/`, `/robots.txt`, `404`

### Dynamisch

- Jobs: `/rechnungswesen/`, `/reinigungskraft/`
- Fahrzeuge: `/wohnmobile/[slug]/` aus `src/data/inventory.json` (aktuell 17 Einträge)

### Redirects (`astro.config.mjs`)

`/download/`→`/`, `/caravan-salon/`→`/`, `/fruehjahrswaesche/`→`/fahrzeugwaesche-herbst/`, `/newsletter/`→`/kontakt/`, `/werkstatt/`→`/werkstatt-kundendienst/`, `/ankauf/`→`/wohnmobil-ankauf/`, `/vermietung/`→`/vermietung-wohnmobile/`, `/barrierefreiheitserklaerung/`→`/barrierefreiheit/`

---

## 2. Feature-Klassifikation (PRESERVE | IMPROVE | REBUILD | REMOVE)

| Bereich | Klasse | Begründung |
|---------|--------|------------|
| BaseLayout / SEO-Head / Schema.org (ohne Fake-Reviews) | **PRESERVE** | Solide Canonicals, JSON-LD, CSP-Hooks |
| Nav IA (`navigation.ts`, Header/Mobile/Footer) | **IMPROVE** | DE-Struktur gut; Flagship-Hubs (Knowledge, Hersteller-Landing) fehlen |
| Homepage-Module | **IMPROVE** | Premium-Story erhalten; Abschnitts-IA Richtung Brief schärfen wo Content existiert |
| Camper-Finder (Steps, Hard/Soft) | **IMPROVE** | Guided Cards + Matching vorhanden; Family-Mode / Style-UI unvollständig |
| Showroom Filter / Detail / Galerie | **PRESERVE** | Authentische Specs, Gallery, Inquiry |
| Vergleich / Merkliste | **IMPROVE** | Funktioniert; Brief erlaubt ≤4 (war 3) |
| Dual Inventory / mobile.de Sync | **IMPROVE** | Static Snapshot + Worker-Code; Live-Sync braucht Secrets |
| Marken Challenger / La Strada / Eura Mobil | **PRESERVE** | Korrekt in `brands.ts` + `/marken/` |
| Knaus als Partner / Panama-Promo | **REMOVE** (Reste) | Nicht Partner; Knaus nur Bestand/Ankauf-Makes ok; Legacy in Scripts/`_audit-legacy` |
| La-Strada-Konfigurator (ehrlich/iframe) | **PRESERVE** | Vorhanden + Inquiry-API |
| Lifestyle / Knowledge-Hub Routen | **REBUILD** | Wissen nur in Chat/Companion — keine Content-Routen |
| Werkstatt + Assistent | **IMPROVE** | Starke UX; Form → `/api/workshop-request` nachziehen |
| Vermietung + ADAC → vermietung@ | **PRESERVE** | Form + Worker-Default-Mail korrekt |
| Ankauf-Wizard | **PRESERVE** | 7-Step; API optional (Formspree/mailto) |
| Companion Launcher | **IMPROVE** → teilweise **REBUILD** Icon/Hub | Right-Dock ok; Wohnmobil-Icon → Kompass/Hilfe; Hub-Labels Flagship |
| A11y Prefs + Erklärung | **PRESERVE** | Overlay allein unzureichend — Prefs + Seite vorhanden; weiter ausbauen |
| Öffnungszeiten + NRW-Feiertage | **IMPROVE** | Berlin + Feiertage + Live-Refresh; Precedence Manual/Special fehlt(e) |
| Kontakt / Cookie / Legal | **PRESERVE** | Impressum/Datenschutz/AGB/Consent |
| i18n / EN | **REMOVE** | Runtime DE; Orphan `content-en.ts` + tote Companion-Lang-CSS |
| Tests | **IMPROVE** | Solide Unit-Tests; E2E dünn (Companion-Smoke) |
| Deploy / Indexierung Go-Live | **IMPROVE** | Pages-Präsentation ≠ Prod; `PUBLIC_INDEXABLE` erst bei Cutover |

---

## 3. Gap-Analyse vs. Flagship-Brief

| Brief-Thema | Ist | Gap |
|-------------|-----|-----|
| Nav IA Flagship | DE-Nav vorhanden | Knowledge-/Hersteller-Unterstruktur |
| Homepage-Struktur | Modulare Sections | Feinschliff Reihenfolge/Content wo belegt |
| Camping Finder 2.0 | Wizard + Hard/Soft | Family-Mode, Style-Karten in UI, ehrliche Leer-Ergebnisse-Copy |
| Inventar/Filter/Detail/Galerie | Showroom komplett | Mobile UX-Politur; Live-Sync |
| Compare ≤4 | Max 3 | Anheben auf 4 |
| Lifestyle/Knowledge | Chat-Wissen | Dedizierte Routen **REBUILD** (Content freigeben) |
| Hersteller-Genauigkeit | 3 Partner korrekt | Panama-Script-Cruft; keine Knaus-Partner-Claims |
| Konfigurator Honesty | La Strada iframe | Beibehalten; keine Fake-3D |
| Werkstatt + AI | Seite + Rules/API | Form-API-Wiring; AI-Key |
| Rental + ADAC | Seite + vermietung@ | Mail-Env in Prod |
| Ankauf | Wizard | Optional dedizierte API |
| Companion Kompass/Hilfe | Wohnmobil+Mini-Kompass FAB | Premium-Kompass; Assistenten-Zentrum 3 Karten |
| A11y Controls | Prefs + Erklärung | WCAG 2.2 AA Audit/Lighthouse nachziehen |
| Öffnungszeiten Precedence | Holiday > Weekly | Manual > Special > Holiday-Policy > Weekly |
| Kontakt-Panels | Kontakt + Companion | „Kontakt & Service“ als klare Hub-Karte |
| Mobile / Perf | ActionBar, Assets | Kontinuierlich messen (nicht behaupten) |
| Security/GDPR | Consent, CSP, Honeypot | Secrets nur Worker; keine Secrets im Repo |
| SEO Migration | Redirects + Sitemap | Cutover-Plan Canonical/Index auf ccoverath.de |
| Tests | Vitest + 1 E2E | Holiday-Precedence + kritische Journeys |

---

## 4. Kundenreisen (Kurz)

1. **Kauf:** Home → Finder oder `/wohnmobile/` → Detail → Anfrage / Vergleich / Merkliste  
2. **Miete:** `/vermietung-wohnmobile/` (+ ADAC) → Form → vermietung@  
3. **Service:** `/werkstatt-kundendienst/` → Termin / Assistent  
4. **Ankauf:** `/wohnmobil-ankauf/` Wizard  
5. **Hilfe:** Companion → Camping-KI / A11y / Kontakt  
6. **Legal/Trust:** Impressum, Datenschutz, AGB, Barrierefreiheit  

---

## 5. In dieser Session umgesetzt (nicht „Flagship fertig“)

Branch `remake/flagship-2026` (nach Baseline `17755e3`):

1. **Companion:** Premium-Kompass-FAB; Hub „Hilfe & Service“ mit Karten Camping-KI / Barrierefreiheit / Kontakt & Service; tote Lang-CSS entfernt  
2. **Öffnungszeiten:** `opening-overrides.ts` + Precedence manual > special > holiday policy > weekly; Boot-Payload synchron; Unit-Tests  
3. **Vergleich:** `COMPARE_MAX = 4`  
4. **Werkstatt-Form:** `data-api-path="/api/workshop-request"`  
5. **Finder:** Family-Mode Soft-Boost bei persons 4/5+  
6. **Cleanup:** Orphan `src/data/content-en.ts` entfernt  
7. **Audit:** diese Datei  

**Tests (ausgeführt):** `npm run test` → 57 passed; `npm run check` → 0 errors. E2E Companion-Smoke angepasst, nicht in dieser Session gelaufen (`npm run test:e2e` braucht Build). 

## 6. Verbleibend — Auth / externe APIs nötig

- `MOBILE_DE_*` Live-Sync → frisches `inventory.json`  
- `MAIL_*` Worker-Versand (sonst nur „queued“)  
- `PUBLIC_API_BASE` / `PUBLIC_FORM_ENDPOINT` für Forms außerhalb Presentation-Mode  
- `AI_API_KEY` für echte Camping-/Werkstatt-KI  
- `LASTRADA_API_KEY` falls serverseitig genutzt  
- Production-Domain Cutover + `PUBLIC_INDEXABLE=true` (explizite Freigabe)  
- Lighthouse / manuelle WCAG-Prüfung auf Staging  

## 7. Empfohlene nächste Sprints

1. Companion + Öffnungszeiten absichern (E2E Pill/Sheet)  
2. Finder 2.0 Family/Style UX + ehrliche Zero-Results  
3. Showroom/Detail Mobile + Compare-Tray UX bei 4  
4. Homepage-IA Feinschliff mit existierendem Content  
5. Knowledge-Hub nur mit freigegebenen Texten  
6. Worker-Secrets + Sync-Job + Staging Smoke  
7. SEO-Cutover-Checkliste vs. ccoverath.de (kein Blind-Deploy)
