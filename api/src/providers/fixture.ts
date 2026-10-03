import type { NormalizedVehicle } from '../types';
import type { InventoryProvider } from './types';
import fixture from '../data/fixture-inventory.json';

/** Last-good / presentation inventory – used when mobile.de credentials are not configured. */
export class FixtureProvider implements InventoryProvider {
  readonly name = 'fixture';

  async fetchActive(): Promise<NormalizedVehicle[]> {
    const now = new Date().toISOString();
    return (fixture.vehicles as NormalizedVehicle[]).map((v) => ({
      ...v,
      sourceProvider: 'fixture',
      lastSyncedAt: now,
      lifecycle: 'active',
      syncStatus: v.syncStatus ?? 'ok',
    }));
  }
}
