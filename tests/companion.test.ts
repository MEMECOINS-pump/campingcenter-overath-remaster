import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

describe('CampingCompanion hub', () => {
  it('ships a single companion launcher (no dual FAB markup)', () => {
    const companion = readFileSync(join(root, 'src/components/layout/CampingCompanion.astro'), 'utf8');
    const chat = readFileSync(join(root, 'src/components/layout/ChatWidget.astro'), 'utf8');
    const a11y = readFileSync(join(root, 'src/components/layout/AccessibilityPrefs.astro'), 'utf8');
    const layout = readFileSync(join(root, 'src/layouts/BaseLayout.astro'), 'utf8');

    expect(companion).toContain('data-companion');
    expect(companion).toContain('companion-fab');
    expect(companion).toContain("t(lang, 'companionTitle')");
    expect(companion).toContain("t(lang, 'companionFabAria')");
    expect(companion).toContain('data-companion-action="chat"');
    expect(companion).toContain('data-companion-action="a11y"');
    expect(companion).toContain('data-companion-action="lang"');
    expect(companion).toContain('cco:open-chat');

    expect(chat).not.toContain('chatw-fab');
    expect(chat).toContain('cco:open-chat');
    expect(a11y).not.toContain('a11y-fab');
    expect(a11y).toContain('data-a11y');

    expect(layout).toContain('CampingCompanion');
    expect(layout).toContain('ChatWidget');
    expect(companion).toContain('AccessibilityPrefs');
  });

  it('keeps boot-before-paint a11y key', () => {
    const boot = readFileSync(join(root, 'src/lib/boot-script.ts'), 'utf8');
    expect(boot).toContain("cco:a11y");
    expect(boot).toContain('cco:lang');
  });
});
