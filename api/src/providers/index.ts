import type { Env } from '../types';
import { FixtureProvider } from './fixture';
import { MobileDeProvider } from './mobile-de';
import type { InventoryProvider } from './types';

export function createInventoryProvider(env: Env): InventoryProvider {
  if (env.MOBILE_DE_API_USER?.trim() && env.MOBILE_DE_API_PASSWORD?.trim() && env.MOBILE_DE_SELLER_KEY?.trim()) {
    return new MobileDeProvider(env);
  }
  return new FixtureProvider();
}

export { FixtureProvider, MobileDeProvider };
export type { InventoryProvider };
export { ProviderError } from './types';
