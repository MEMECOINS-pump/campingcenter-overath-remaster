import type { Env } from './types';

export interface CampingAssistResult {
  title: string;
  summary: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  disclaimer?: string;
  provider: 'rules' | 'ai';
  offTopic?: boolean;
}

const SYSTEM = `Du bist der Camping-Assistent des Campingcenter Overath (Weberstraße 12, 51491 Overath).

WICHTIG – Intent zuerst erkennen, dann antworten:
- Kaufen / Bestand / Preis / Finanzierung → Verkauf (+ Camper-Finder), CTA /wohnmobile/ oder /camper-finder/
- Mieten / ADAC / Urlaub mieten → Vermietung, CTA /vermietung-wohnmobile/
- Eigenes Fahrzeug verkaufen / Ankauf / Inzahlungnahme → Ankauf, CTA /wohnmobil-ankauf/
- Öffnungszeiten / Feiertag / offen / geschlossen → Öffnung, CTA /kontakt/
- Challenger / LA STRADA / Eura Mobil / Konfigurator → Marken, CTA /marken/ oder /la-strada-konfigurator/
- Kontakt / Anfahrt / Telefon → Kontakt, CTA /kontakt/
- NUR bei klaren Defekten/Reparatur/Werkstatt/Fehlercodes/Nässe/GFK/TÜV-Gas → Werkstatt, CTA /werkstatt-kundendienst/#termin
- Allgemeine Camping-Tipps (Bauform, Führerschein, Zuladung) → Tipps + Camper-Finder

Niemals standardmäßig auf die Werkstatt verweisen. Werkstatt nur bei Reparatur-Intent.
Keine erfundenen Preise, Verfügbarkeiten oder Ferndiagnosen.
Antwort auf Deutsch, kurz, hilfreich.

JSON only:
{ "title": string, "summary": string, "bullets": string[], "ctaLabel": string|null, "ctaHref": string|null, "disclaimer": string|null, "offTopic": boolean }`;

/** Intent-first rules; workshop only on clear repair intent. */
export function assistCampingRules(message: string): CampingAssistResult {
  const text = message.toLowerCase();

  if (/politik|crypto|hack|waffe|drog|medizin|sex|porno/i.test(text)) {
    return {
      title: 'Nur Camping-Themen',
      summary: 'Ich helfe bei Wohnmobilen, Vermietung, Ankauf, Marken und Öffnungszeiten – Werkstatt nur bei Defekten.',
      provider: 'rules',
      offTopic: true,
      ctaLabel: 'Fahrzeuge ansehen',
      ctaHref: '/wohnmobile/',
    };
  }

  if (/öffnungs|oeffnungs|geöffnet|geoeffnet|feiertag|geschlossen|wann habt|habt ihr offen/.test(text)) {
    return {
      title: 'Öffnungszeiten',
      summary: 'Mo–Fr 07:00–13:00 und 14:00–17:00, Sa 09:00–13:00. Sonntag & NRW-Feiertage geschlossen. Weberstraße 12, Overath.',
      provider: 'rules',
      ctaLabel: 'Kontakt',
      ctaHref: '/kontakt/',
    };
  }

  if (/mieten|vermiet|verleih|\badac\b|camper mieten|wohnmobil mieten/.test(text)) {
    return {
      title: 'Wohnmobil mieten',
      summary: 'ADAC-Mietstation Köln-Ost – mit Zeitraum und Personenzahl finden wir die passende Klasse.',
      provider: 'rules',
      ctaLabel: 'Zur Vermietung',
      ctaHref: '/vermietung-wohnmobile/',
    };
  }

  if (/ankauf|ankaufen|inzahlung|mein (wohnmobil|camper) verkaufen|fahrzeug verkaufen/.test(text)) {
    return {
      title: 'Ankauf',
      summary: 'Fairer Ankauf mit Angebot in der Regel innerhalb von 24 Stunden – inkl. optionaler Abholung.',
      provider: 'rules',
      ctaLabel: 'Ankauf starten',
      ctaHref: '/wohnmobil-ankauf/',
    };
  }

  if (/finder|welcher camper|welches wohnmobil|personen|schlafplatz|bettlänge|bettlange|familie/.test(text)) {
    return {
      title: 'Passenden Camper finden',
      summary: 'Mit dem Camper-Finder filterst du nach Personen, Betten und Länge – Treffer aus dem Bestand.',
      provider: 'rules',
      ctaLabel: 'Camper-Finder',
      ctaHref: '/camper-finder/',
    };
  }

  if (/challenger|la\s*strada|eura|konfigurator|vertragspartner/.test(text)) {
    return {
      title: 'Marken',
      summary: 'Vertragspartner: Challenger, LA STRADA und Eura Mobil – Beratung und Bestand in Overath.',
      provider: 'rules',
      ctaLabel: 'Marken',
      ctaHref: '/marken/',
    };
  }

  if (/kontakt|anfahr|adresse|telefon|anrufen|route/.test(text)) {
    return {
      title: 'Kontakt',
      summary: 'Weberstraße 12, 51491 Overath · 02206 95131-0 · service@ccoverath.de',
      provider: 'rules',
      ctaLabel: 'Kontakt',
      ctaHref: '/kontakt/',
    };
  }

  // Workshop ONLY on clear repair intent
  if (
    /werkstatt|reparatur|kundendienst|fehlercode|e5\d{2}|truma|n[aä]sse|undicht|gfk|unfallschaden|gasprüfung|tüv|tuv/.test(
      text,
    ) ||
    /(heizung|batterie|solar).*(defekt|kaputt|geht nicht|problem)/.test(text)
  ) {
    return {
      title: 'Werkstatt & Service',
      summary: 'Fachwerkstatt für Wohnmobile und Wohnwagen. Keine Ferndiagnose – wir ordnen ein und finden einen Termin.',
      provider: 'rules',
      disclaimer: 'Keine verbindliche Ferndiagnose.',
      ctaLabel: 'Termin anfragen',
      ctaHref: '/werkstatt-kundendienst/#termin',
    };
  }

  if (/kaufen|gebraucht|neu|bestand|finanz|wohnmobil suchen|camper kaufen/.test(text)) {
    return {
      title: 'Wohnmobil kaufen',
      summary: 'Neue und gebrauchte Wohnmobile vor Ort – Challenger, LA STRADA, Eura Mobil und geprüfte Gebrauchte.',
      provider: 'rules',
      ctaLabel: 'Fahrzeuge ansehen',
      ctaHref: '/wohnmobile/',
    };
  }

  return {
    title: 'Campingcenter Overath',
    summary:
      'Sag kurz, ob du kaufen, mieten, verkaufen (Ankauf) oder Öffnungszeiten brauchst – ich leite dich passend weiter. Werkstatt nur bei Defekten.',
    bullets: ['Fahrzeuge im Bestand', 'ADAC-Vermietung', 'Ankauf', 'Camper-Finder'],
    provider: 'rules',
    ctaLabel: 'Fahrzeuge ansehen',
    ctaHref: '/wohnmobile/',
  };
}

export async function assistCampingAi(env: Env, message: string, fallback: CampingAssistResult): Promise<CampingAssistResult> {
  if (!env.AI_API_KEY?.trim()) return fallback;

  try {
    const baseUrl = (env.AI_API_BASE || 'https://api.openai.com/v1').replace(/\/$/, '');
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: message },
        ],
        response_format: { type: 'json_object' },
      }),
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return fallback;
    const parsed = JSON.parse(content) as Partial<CampingAssistResult>;
    return {
      title: parsed.title || fallback.title,
      summary: parsed.summary || fallback.summary,
      bullets: Array.isArray(parsed.bullets) ? parsed.bullets.slice(0, 5) : fallback.bullets,
      ctaLabel: parsed.ctaLabel || fallback.ctaLabel,
      ctaHref: parsed.ctaHref || fallback.ctaHref,
      disclaimer: parsed.disclaimer || fallback.disclaimer,
      offTopic: Boolean(parsed.offTopic),
      provider: 'ai',
    };
  } catch {
    return fallback;
  }
}
