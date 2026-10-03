import type { NormalizedVehicle } from '../types';

export interface InventoryProvider {
  readonly name: string;
  /** Fetch current active listings from the authorized source. Throws on transport/auth failure. */
  fetchActive(): Promise<NormalizedVehicle[]>;
}

export class ProviderError extends Error {
  readonly code: 'auth' | 'rate_limit' | 'unavailable' | 'empty' | 'invalid';
  constructor(message: string, code: 'auth' | 'rate_limit' | 'unavailable' | 'empty' | 'invalid', cause?: unknown) {
    super(message, cause !== undefined ? { cause } : undefined);
    this.name = 'ProviderError';
    this.code = code;
  }
}
