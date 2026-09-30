/** Merkliste & Vergleich – persisted in localStorage, synchronised across tabs. */

export type CollectionName = 'favorites' | 'compare';

const KEYS: Record<CollectionName, string> = {
  favorites: 'cco:favorites',
  compare: 'cco:compare',
};

export const COMPARE_MAX = 3;
export const COLLECTION_EVENT = 'cco:collection';

export function readCollection(name: CollectionName): string[] {
  try {
    const raw = localStorage.getItem(KEYS[name]);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function write(name: CollectionName, ids: string[]): void {
  try {
    localStorage.setItem(KEYS[name], JSON.stringify(ids));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(COLLECTION_EVENT, { detail: { name, ids } }));
}

export function hasItem(name: CollectionName, id: string): boolean {
  return readCollection(name).includes(id);
}

/** Toggle an id. Returns the new membership, or `null` when the compare list is full. */
export function toggleItem(name: CollectionName, id: string): boolean | null {
  const ids = readCollection(name);
  if (ids.includes(id)) {
    write(
      name,
      ids.filter((x) => x !== id),
    );
    return false;
  }
  if (name === 'compare' && ids.length >= COMPARE_MAX) return null;
  write(name, [...ids, id]);
  return true;
}

export function removeItem(name: CollectionName, id: string): void {
  write(
    name,
    readCollection(name).filter((x) => x !== id),
  );
}

export function clearCollection(name: CollectionName): void {
  write(name, []);
}

export function onCollectionChange(cb: () => void): void {
  window.addEventListener(COLLECTION_EVENT, cb);
  window.addEventListener('storage', (e) => {
    if (e.key && Object.values(KEYS).includes(e.key)) cb();
  });
}
