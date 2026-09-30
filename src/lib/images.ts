import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/images/*.{jpg,jpeg,png,webp}', { eager: true });

const byName = new Map<string, ImageMetadata>(
  Object.entries(modules).map(([path, mod]) => [path.split('/').pop()!.replace(/\.[a-z]+$/i, ''), mod.default]),
);

/** Look up a prepared photo by file name without extension (see scripts/prepare_assets.py). */
export function photo(name: string): ImageMetadata {
  const img = byName.get(name);
  if (!img) throw new Error(`Unknown image "${name}". Available: ${[...byName.keys()].join(', ')}`);
  return img;
}
