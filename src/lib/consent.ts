export interface ConsentState {
  v: 1;
  media: boolean;
  stats: boolean;
  ts: number;
}

const KEY = 'cco:consent';
export const CONSENT_EVENT = 'cco:consent';

export function readConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    if (parsed.v !== 1) return null;
    return { v: 1, media: !!parsed.media, stats: !!parsed.stats, ts: Number(parsed.ts) || 0 };
  } catch {
    return null;
  }
}

export function writeConsent(media: boolean, stats: boolean): ConsentState {
  const state: ConsentState = { v: 1, media, stats, ts: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable (private mode) – consent then lasts for this page view */
  }
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }));
  return state;
}

export const hasMediaConsent = (): boolean => readConsent()?.media === true;
export const hasStatsConsent = (): boolean => readConsent()?.stats === true;

export function onConsent(cb: (s: ConsentState) => void): void {
  window.addEventListener(CONSENT_EVENT, (e) => cb((e as CustomEvent<ConsentState>).detail));
}
