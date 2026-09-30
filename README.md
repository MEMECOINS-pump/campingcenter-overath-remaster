# Campingcenter Overath — Premium Remaster

Redesign-Präsentation der Website des [Campingcenter Overath](https://ccoverath.de/) – Wohnmobile kaufen, verkaufen, mieten und warten lassen, mobil zuerst gedacht.

> **Hinweis:** Dies ist eine inoffizielle Präsentationsfassung. Die offizielle Website ist [ccoverath.de](https://ccoverath.de/); rechtlich maßgeblich sind die dort veröffentlichten Angaben. Die Präsentation ist standardmäßig auf `noindex` gestellt, damit sie in Suchmaschinen nicht mit dem Original konkurriert.

## Funktionen

- **Fahrzeuge:** Bestand mit Filtern (Zustand, Art, Marke, Gewicht/Führerschein, Getriebe, Preis, Länge), Sortierung, teilbaren URLs und mobilem Vollbild-Filter („Zurücksetzen“, „X Fahrzeuge anzeigen“).
- **Fahrzeugdetails:** Galerie mit Wischgesten, Zähler „3 / 14“, Vollbild, technische Daten, Anfrageformular und Sticky-CTA auf dem Smartphone.
- **Merkliste & Vergleich:** lokal im Browser gespeichert, Vergleich von 2–3 Fahrzeugen mit „Nur Unterschiede zeigen“.
- **Camper-Finder:** fünf Fragen, Ergebnisse aus dem echten Bestand; wenn nichts exakt passt, wird transparent gesagt, welche Kriterien gelockert wurden.
- **Ankauf:** 7-Schritte-Assistent mit Entwurfsspeicherung, Browser-Zurück-Unterstützung und Foto-Upload (Kamera/Galerie, automatische Verkleinerung, Vorschau, Fortschritt, Entfernen, Wiederholen).
- **Werkstatt:** alle Leistungen nach Bereichen, Terminanfrage mit bedingten Feldern und Foto-/Dokument-Upload – bewusst ohne Sofortbuchungs-Versprechen.
- **Weitere Seiten:** Vermietung (ADAC), PANAMA, Marken, Über uns, Kontakt & Anfahrt, Jobs & Bewerbung, 360° Rundgang (lädt erst auf Klick), Fahrzeugwäsche, Rechtliches, 404.
- **Datenschutz:** keine Cookies, keine Tracker. YouTube (nocookie) und Google Maps laden erst nach Klick bzw. Einwilligung. Analyse-Events werden nur nach Einwilligung in `window.dataLayer` geschrieben; es ist kein Analyse-Dienst eingebunden.

## Technik

- [Astro](https://astro.build/) 7, statische Ausgabe, TypeScript (strict), kein Frontend-Framework
- Bilder über `astro:assets` (AVIF/WebP, `srcset`), Fahrzeugfotos vom mobile.de-CDN
- Content-Security-Policy per Meta-Tag (von Astro gehasht), keine Inline-Styles
- [Pannellum](https://pannellum.org/) für den 360° Rundgang (lazy geladen)
- Vitest, ESLint, `astro check` und eine eigene Build-Prüfung (`scripts/verify-dist.mjs`)

## Lokal starten

Voraussetzung: Node.js ≥ 22.12

```bash
npm ci
npm run dev        # http://localhost:4321
```

| Befehl            | Zweck                                                         |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Entwicklungsserver                                            |
| `npm run build`   | Produktions-Build nach `dist/`                                |
| `npm run preview` | Build lokal ansehen                                           |
| `npm run check`   | Typprüfung (`astro check`)                                    |
| `npm run lint`    | ESLint                                                        |
| `npm test`        | Unit-Tests (Filter, URL-Status, Finder, Merkliste, Daten)     |
| `npm run verify`  | Prüft `dist/`: Meta-Tags, interne Links, CSP, JSON-LD, Routen |
| `npm run ci`      | alles oben in Reihenfolge                                     |

## Konfiguration

Alle Variablen sind optional (siehe `.env.example`). Es werden keine Geheimnisse benötigt.

| Variable               | Wirkung                                                                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `PUBLIC_FORM_ENDPOINT` | URL eines Formular-Backends (z. B. Formspree). Ohne Wert laufen Formulare im Präsentationsmodus: volle Validierung, danach vorbereitete E-Mail. |
| `PUBLIC_INDEXABLE`     | `true` schaltet die Indexierung durch Suchmaschinen frei – nur für einen echten Produktivstart.                                               |
| `SITE_URL`, `BASE_PATH` | Werden im GitHub-Workflow automatisch gesetzt (Base-Pfad für GitHub Pages).                                                                |

## Deployment

Der Workflow `.github/workflows/deploy.yml` läuft bei jedem Push auf `main`: Installation → Typprüfung → Lint → Tests → Build → Build-Prüfung → Deployment auf GitHub Pages. Base-Pfad und Origin kommen aus `actions/configure-pages`, es ist kein Benutzername fest eingetragen.

Einmalig im Repository unter **Settings → Pages** als Quelle **GitHub Actions** wählen.

## Projektstruktur

```
src/
  components/   Layout, Sektionen, Formulare, Fahrzeug-Komponenten
  data/         geprüfte Inhalte (Firma, Leistungen, Marken, Jobs, Bestand)
  layouts/      BaseLayout (SEO, Header, Footer, Consent)
  lib/          Filter-/Finder-Logik, URL-Helfer, Consent, Analytics, Schema.org
  pages/        Routen (entsprechen den URLs von ccoverath.de)
  scripts/      Client-Skripte (Showroom, Galerie, Formulare, Assistent, Upload, Rundgang)
  styles/       Design-Tokens und globale Styles
scripts/        Asset-Vorbereitung, Bestandsimport, Build-Prüfung
tests/          Vitest
```

## Inhalte und Bildrechte

- Texte, Fakten, Kontaktdaten und Leistungen stammen von ccoverath.de (Stand 30.09.2026) und wurden nur sprachlich überarbeitet. Es gibt keine erfundenen Preise, Fahrzeuge, Bewertungen oder Kennzahlen.
- Der Fahrzeugbestand ist ein Stand der öffentlichen mobile.de-Inserate des Händlers; Fotos werden direkt vom mobile.de-CDN geladen und nicht kopiert.
- Fotos, Logos und Panoramen sind Eigentum des Campingcenter Overath bzw. der jeweiligen Hersteller und werden hier ausschließlich zu Präsentationszwecken gezeigt.
