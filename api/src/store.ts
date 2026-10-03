import type { Env } from './types';

export const KEYS = {
  vehicles: 'vehicles:v1',
  syncLogs: 'sync:logs:v1',
  lastSuccessfulSync: 'sync:last-ok:v1',
  finderLeads: 'leads:finder:v1',
  rentalLeads: 'leads:rental:v1',
  workshopLeads: 'leads:workshop:v1',
  rate: (ip: string, bucket: string) => `rate:${bucket}:${ip}`,
} as const;

export async function getJson<T>(env: Env, key: string): Promise<T | null> {
  const raw = await env.STORE.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function putJson(env: Env, key: string, value: unknown): Promise<void> {
  await env.STORE.put(key, JSON.stringify(value));
}

/** Simple sliding-window rate limit. Returns false when over limit. */
export async function rateLimit(env: Env, ip: string, bucket: string, max: number, windowSec: number): Promise<boolean> {
  const key = KEYS.rate(ip || 'anon', bucket);
  const now = Date.now();
  const raw = await env.STORE.get(key);
  let hits: number[] = [];
  if (raw) {
    try {
      hits = (JSON.parse(raw) as number[]).filter((t) => now - t < windowSec * 1000);
    } catch {
      hits = [];
    }
  }
  if (hits.length >= max) return false;
  hits.push(now);
  await env.STORE.put(key, JSON.stringify(hits), { expirationTtl: windowSec + 60 });
  return true;
}
