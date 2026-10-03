import type { Env } from './types';

export interface WorkshopAssistInput {
  message: string;
  vehicleMake?: string;
  vehicleModel?: string;
  modelYear?: string;
  faultCode?: string;
  since?: string;
}

export interface WorkshopAssistResult {
  summary: string;
  category: string;
  categoryLabel: string;
  priority: 'normal' | 'zeitnah' | 'unklar';
  followUps: string[];
  disclaimer: string;
  structured: Record<string, string>;
  provider: 'rules' | 'ai';
}

const CATEGORIES: { id: string; label: string; patterns: RegExp[] }[] = [
  { id: 'heizung', label: 'Technik / Heizung', patterns: [/heiz/i, /truma/i, /alde/i, /e5\d{2}/i, /warmwasser/i] },
  { id: 'strom', label: 'Technik / Elektro', patterns: [/batter/i, /solar/i, /ladeger/i, /strom/i, /inverter/i, /12\s*v/i, /230/i] },
  { id: 'gas', label: 'Technik / Gas', patterns: [/gas/i, /flasche/i, /gasanlage/i] },
  { id: 'wasser', label: 'Technik / Wasser', patterns: [/wasser/i, /pumpe/i, /tank/i, /abwasser/i, /nasszelle/i, /toilette/i, /dusche/i] },
  { id: 'naesse', label: 'Reparatur / Nässeschaden', patterns: [/n[aä]sse/i, /feucht/i, /undicht/i, /leck/i, /schimmel/i] },
  { id: 'unfall', label: 'Reparatur / Unfall-GFK', patterns: [/unfall/i, /gfk/i, /schaden/i, /beule/i, /kratzer/i, /lack/i] },
  { id: 'fahrwerk', label: 'Fahrwerk / Bremsen', patterns: [/bremse/i, /fahrwerk/i, /achse/i, /reifen/i, /feder/i, /stossd/i] },
  { id: 'klima', label: 'Technik / Klima', patterns: [/klima/i, /k[uü]hlschrank/i, /k[uü]hl/i] },
  { id: 'pruefung', label: 'Prüfung / HU-SP', patterns: [/\bhu\b/i, /\bsp\b/i, /prüfung/i, /tuv|tüv/i, /gasprüfung/i] },
  { id: 'waesche', label: 'Komfort / Fahrzeugwäsche', patterns: [/wäsche|waesche/i, /reinigung/i, /sauber/i] },
];

/**
 * Rule-based assistant (always available). Optional AI enhancement when AI_API_KEY is set.
 * Never claims a definitive diagnosis.
 */
export async function assistWorkshop(env: Env, input: WorkshopAssistInput): Promise<WorkshopAssistResult> {
  const text = [input.message, input.faultCode, input.vehicleMake, input.vehicleModel].filter(Boolean).join(' ');
  const hit = CATEGORIES.find((c) => c.patterns.some((p) => p.test(text))) ?? {
    id: 'allgemein',
    label: 'Allgemeine Werkstattanfrage',
  };

  const followUps: string[] = [];
  if (!input.vehicleMake && !input.vehicleModel) followUps.push('Welches Fahrzeug (Hersteller & Modell)?');
  if (!input.faultCode && /fehler|code|anzeige/i.test(input.message)) followUps.push('Gibt es einen Fehlercode im Display?');
  if (!input.since) followUps.push('Seit wann besteht das Problem?');

  const structured: Record<string, string> = {
    Fahrzeug: [input.vehicleMake, input.vehicleModel, input.modelYear].filter(Boolean).join(' ') || 'noch offen',
    Problem: input.message.trim(),
    Fehlercode: input.faultCode?.trim() || 'nicht angegeben',
    'Seit wann': input.since?.trim() || 'nicht angegeben',
    Bereich: hit.label,
  };

  const base: WorkshopAssistResult = {
    summary:
      `Die Angaben deuten auf ein Anliegen im Bereich „${hit.label}“ hin. ` +
      `Die genaue Ursache sollte durch die Werkstatt geprüft werden – dieser Assistent ersetzt keine Diagnose.`,
    category: hit.id,
    categoryLabel: hit.label,
    priority: /nicht mehr|komplett aus|gefahr|brand|gasgeruch/i.test(text) ? 'zeitnah' : 'normal',
    followUps,
    disclaimer:
      'Hinweis: Keine verbindliche Ferndiagnose. Ein Fachtechniker prüft Fahrzeug und Ursache vor Ort.',
    structured,
    provider: 'rules',
  };

  if (!env.AI_API_KEY?.trim()) return base;

  try {
    const ai = await callOptionalAi(env, input, base);
    return ai ?? base;
  } catch {
    return base;
  }
}

async function callOptionalAi(env: Env, input: WorkshopAssistInput, fallback: WorkshopAssistResult): Promise<WorkshopAssistResult | null> {
  const baseUrl = (env.AI_API_BASE || 'https://api.openai.com/v1').replace(/\/$/, '');
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.AI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'Du bist der vorsichtige Werkstatt-Assistent des Campingcenter Overath. Nur Wohnmobil-/Wohnwagen-Service. Klassifiziere Anfragen, stelle gezielte Rückfragen, stelle NIE eine definitive Diagnose oder Preise. Antworte auf Deutsch als JSON mit keys summary, categoryLabel, followUps (array).',
        },
        {
          role: 'user',
          content: JSON.stringify(input),
        },
      ],
      response_format: { type: 'json_object' },
    }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;
  const parsed = JSON.parse(content) as { summary?: string; categoryLabel?: string; followUps?: string[] };
  return {
    ...fallback,
    summary: parsed.summary || fallback.summary,
    categoryLabel: parsed.categoryLabel || fallback.categoryLabel,
    followUps: Array.isArray(parsed.followUps) ? parsed.followUps.slice(0, 4) : fallback.followUps,
    provider: 'ai',
  };
}
