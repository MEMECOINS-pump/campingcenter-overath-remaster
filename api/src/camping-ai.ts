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

Nur Themen rund um Camping & unser Haus:
- Wohnmobile kaufen (neu/gebraucht), Camper-Finder
- Vermietung (ADAC-Mietstation Köln-Ost)
- Ankauf von Wohnmobilen/Wohnwagen/Vans/Booten
- Werkstatt & Kundendienst (keine Ferndiagnose)
- Marken: Challenger, LA STRADA, Eura Mobil
- Öffnungszeiten, Feiertage NRW, Anfahrt, Kontakt
- Praxisnahe Camping-Tipps (Bettlänge, Zuladung, Bauformen)

Regeln:
- Antworte auf Deutsch, klar, freundlich, kurz (max. 80 Wörter im summary).
- Erfinde keine Preise, Verfügbarkeiten, Garantien oder medizinischen/technischen Ferndiagnosen.
- Bei Off-Topic: höflich ablehnen und auf Camping-Themen lenken.
- Nutze CTA-Links nur aus: /wohnmobile/, /camper-finder/, /vermietung-wohnmobile/, /wohnmobil-ankauf/, /werkstatt-kundendienst/#termin, /marken/, /la-strada-konfigurator/, /kontakt/

Antwort ausschließlich als JSON:
{ "title": string, "summary": string, "bullets": string[], "ctaLabel": string|null, "ctaHref": string|null, "disclaimer": string|null, "offTopic": boolean }`;

/** Lightweight rules fallback when AI is unavailable (Worker has no access to the Astro lib). */
export function assistCampingRules(message: string): CampingAssistResult {
  const text = message.toLowerCase();
  if (/politik|crypto|hack|waffe|drog|medizin|sex|porno/i.test(text)) {
    return {
      title: 'Nur Camping-Themen',
      summary:
        'Ich helfe bei Wohnmobilen, Vermietung, Ankauf, Werkstatt, Marken und Öffnungszeiten des Campingcenter Overath.',
      provider: 'rules',
      offTopic: true,
      ctaLabel: 'Fahrzeuge ansehen',
      ctaHref: '/wohnmobile/',
    };
  }
  if (/miet|adac|verleih/.test(text)) {
    return {
      title: 'Wohnmobil mieten',
      summary: 'ADAC-Mietstation Köln-Ost – sag uns Zeitraum und Personenzahl, wir beraten zur passenden Klasse.',
      provider: 'rules',
      ctaLabel: 'Zur Vermietung',
      ctaHref: '/vermietung-wohnmobile/',
    };
  }
  if (/ankauf|verkaufen|inzahlung/.test(text)) {
    return {
      title: 'Ankauf',
      summary: 'Fairer Ankauf mit Angebot in der Regel innerhalb von 24 Stunden – inkl. optionaler Abholung.',
      provider: 'rules',
      ctaLabel: 'Ankauf starten',
      ctaHref: '/wohnmobil-ankauf/',
    };
  }
  if (/werkstatt|heizung|batter|nässe|naesse|gfk|tüv|tuv|fehler/.test(text)) {
    return {
      title: 'Werkstatt & Service',
      summary: 'Fachwerkstatt für Wohnmobile und Wohnwagen. Keine Ferndiagnose – wir ordnen ein und finden einen Termin.',
      provider: 'rules',
      disclaimer: 'Keine verbindliche Ferndiagnose.',
      ctaLabel: 'Termin anfragen',
      ctaHref: '/werkstatt-kundendienst/#termin',
    };
  }
  if (/öffnung|oeffnung|offen|feiertag|geschlossen/.test(text)) {
    return {
      title: 'Öffnungszeiten',
      summary: 'Mo–Fr 07:00–13:00 und 14:00–17:00, Sa 09:00–13:00. Sonntag & NRW-Feiertage geschlossen. Weberstraße 12, Overath.',
      provider: 'rules',
      ctaLabel: 'Kontakt',
      ctaHref: '/kontakt/',
    };
  }
  if (/challenger|la\s*strada|eura|marke/.test(text)) {
    return {
      title: 'Marken',
      summary: 'Vertragspartner: Challenger, LA STRADA und Eura Mobil – Beratung und Bestand in Overath.',
      provider: 'rules',
      ctaLabel: 'Marken',
      ctaHref: '/marken/',
    };
  }
  return {
    title: 'Campingcenter Overath',
    summary:
      'Wir helfen bei Kauf, Miete, Ankauf, Werkstatt und Camping-Fragen rund um Wohnmobile – persönlich in Overath.',
    bullets: ['Camper-Finder für passende Fahrzeuge', 'ADAC-Vermietung', 'Fachwerkstatt vor Ort'],
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
