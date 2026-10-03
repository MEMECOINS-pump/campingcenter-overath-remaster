import { createInventoryProvider, ProviderError } from './providers';
import type { Env, NormalizedVehicle, SyncLogEntry } from './types';
import { getJson, putJson, KEYS } from './store';

function fingerprint(v: NormalizedVehicle): string {
  return JSON.stringify({
    title: v.title,
    price: v.price,
    mileageKm: v.mileageKm,
    lengthMm: v.lengthMm,
    seats: v.seats,
    sleepingPlaces: v.sleepingPlaces,
    beds: v.beds,
    images: v.images,
    sourceUpdatedAt: v.sourceUpdatedAt,
    lifecycle: v.lifecycle,
  });
}

/**
 * Idempotent inventory sync.
 * On provider failure: KEEP last good inventory (never wipe).
 */
export async function runVehicleSync(env: Env): Promise<SyncLogEntry> {
  const startedAt = new Date().toISOString();
  const id = `sync_${startedAt.replace(/[:.]/g, '-')}`;
  const previous = (await getJson<NormalizedVehicle[]>(env, KEYS.vehicles)) ?? [];
  const lastOk = (await getJson<string>(env, KEYS.lastSuccessfulSync)) ?? null;
  const provider = createInventoryProvider(env);

  const log: SyncLogEntry = {
    id,
    startedAt,
    completedAt: null,
    provider: provider.name,
    imported: 0,
    updated: 0,
    unchanged: 0,
    removed: 0,
    invalid: 0,
    errors: [],
    success: false,
    lastSuccessfulSyncAt: lastOk,
  };

  try {
    const incoming = await provider.fetchActive();
    const bySource = new Map(previous.map((v) => [`${v.sourceProvider}:${v.sourceVehicleId}`, v]));
    const next: NormalizedVehicle[] = [];
    const seen = new Set<string>();

    for (const raw of incoming) {
      if (!raw.sourceVehicleId || !raw.title) {
        log.invalid += 1;
        continue;
      }
      const key = `${raw.sourceProvider}:${raw.sourceVehicleId}`;
      seen.add(key);
      const prev = bySource.get(key);
      if (!prev) {
        log.imported += 1;
        next.push({ ...raw, lifecycle: 'active' });
        continue;
      }
      const merged: NormalizedVehicle = {
        ...prev,
        ...raw,
        internalVehicleId: prev.internalVehicleId || raw.internalVehicleId,
        lifecycle: 'active',
      };
      if (fingerprint(prev) === fingerprint(merged)) {
        log.unchanged += 1;
        next.push({ ...merged, lastSyncedAt: raw.lastSyncedAt });
      } else {
        log.updated += 1;
        next.push(merged);
      }
    }

    for (const prev of previous) {
      const key = `${prev.sourceProvider}:${prev.sourceVehicleId}`;
      if (seen.has(key)) continue;
      if (prev.lifecycle === 'active') {
        log.removed += 1;
        next.push({
          ...prev,
          lifecycle: 'removed',
          availability: 'unavailable',
          lastSyncedAt: startedAt,
          syncStatus: 'ok',
        });
      } else {
        next.push(prev);
      }
    }

    await putJson(env, KEYS.vehicles, next);
    await putJson(env, KEYS.lastSuccessfulSync, startedAt);
    log.success = true;
    log.lastSuccessfulSyncAt = startedAt;
  } catch (err) {
    const msg = err instanceof ProviderError ? `${err.code}: ${err.message}` : err instanceof Error ? err.message : 'unknown sync error';
    log.errors.push(msg);
    log.success = false;
    // Critical: do NOT clear KEYS.vehicles
    if (previous.length) {
      const stale = previous.map((v) => (v.lifecycle === 'active' ? { ...v, syncStatus: 'stale' as const } : v));
      await putJson(env, KEYS.vehicles, stale);
    }
  }

  log.completedAt = new Date().toISOString();
  const logs = (await getJson<SyncLogEntry[]>(env, KEYS.syncLogs)) ?? [];
  logs.unshift(log);
  await putJson(env, KEYS.syncLogs, logs.slice(0, 50));
  return log;
}

export async function getActiveVehicles(env: Env): Promise<NormalizedVehicle[]> {
  const all = (await getJson<NormalizedVehicle[]>(env, KEYS.vehicles)) ?? [];
  if (all.length) return all.filter((v) => v.lifecycle === 'active');

  // Seed from fixture on first request so the site never shows an empty lot by accident.
  const seed = await createInventoryProvider(env).fetchActive();
  await putJson(env, KEYS.vehicles, seed);
  await putJson(env, KEYS.lastSuccessfulSync, new Date().toISOString());
  return seed.filter((v) => v.lifecycle === 'active');
}
