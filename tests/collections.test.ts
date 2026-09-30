import { beforeEach, describe, expect, it, vi } from 'vitest';
import { COMPARE_MAX, clearCollection, hasItem, readCollection, removeItem, toggleItem } from '@/lib/collections';

beforeEach(() => {
  const store = new Map<string, string>();
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  });
  vi.stubGlobal('window', new EventTarget());
});

describe('collections', () => {
  it('toggles favorites', () => {
    expect(toggleItem('favorites', 'a')).toBe(true);
    expect(hasItem('favorites', 'a')).toBe(true);
    expect(toggleItem('favorites', 'a')).toBe(false);
    expect(readCollection('favorites')).toEqual([]);
  });

  it(`limits the comparison to ${COMPARE_MAX} vehicles`, () => {
    for (const id of ['a', 'b', 'c']) expect(toggleItem('compare', id)).toBe(true);
    expect(toggleItem('compare', 'd')).toBeNull();
    expect(readCollection('compare')).toEqual(['a', 'b', 'c']);
    removeItem('compare', 'b');
    expect(toggleItem('compare', 'd')).toBe(true);
    expect(readCollection('compare')).toEqual(['a', 'c', 'd']);
  });

  it('notifies listeners and survives corrupt storage', () => {
    const spy = vi.fn();
    window.addEventListener('cco:collection', spy);
    toggleItem('favorites', 'x');
    clearCollection('favorites');
    expect(spy).toHaveBeenCalledTimes(2);
    localStorage.setItem('cco:favorites', '{kaputt');
    expect(readCollection('favorites')).toEqual([]);
    localStorage.setItem('cco:favorites', JSON.stringify(['ok', 3, null]));
    expect(readCollection('favorites')).toEqual(['ok']);
  });
});
