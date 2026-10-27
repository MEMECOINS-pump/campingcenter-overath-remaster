import type { Locale } from './locales';

/**
 * Lightweight translation-memory stub for vehicle free-text descriptions.
 * Without a translation API / secrets, EN pages keep the German source text
 * and optionally surface a non-authoritative notice — never invent specs.
 */
export type TmResult = {
  text: string;
  translated: boolean;
  /** Present when EN was requested but no MT memory hit exists. */
  notice?: string;
};

const memory = new Map<string, string>();

export function tmRemember(de: string, en: string): void {
  memory.set(de.trim(), en.trim());
}

export function translateVehicleCopy(sourceDe: string, lang: Locale): TmResult {
  const text = sourceDe.trim();
  if (!text || lang === 'de') return { text: sourceDe, translated: false };

  const hit = memory.get(text);
  if (hit) return { text: hit, translated: true };

  return {
    text: sourceDe,
    translated: false,
    notice: 'Description shown in German (authoritative inventory text). Machine translation is not configured.',
  };
}
