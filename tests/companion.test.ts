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
    expect(companion).toContain('Hilfe & Service');
    expect(companion).toContain('Assistenten-Zentrum');
    expect(companion).toContain('Camping-KI');
    expect(companion).toContain('Kontakt & Service');
    expect(companion).toMatch(/Premium Kompass/);
    expect(companion).not.toContain('Minimalist motorhome');
    expect(companion).not.toMatch(/<rect x="4" y="18" width="28"/);
    expect(companion).toContain('data-companion-action="chat"');
    expect(companion).toContain('data-companion-action="a11y"');
    expect(companion).toContain('data-companion-action="contact"');
    expect(companion).not.toContain('data-companion-action="lang"');
    expect(companion).not.toContain('companion-lang-');
    expect(companion).toContain('cco:open-chat');

    expect(chat).not.toContain('chatw-fab');
    expect(chat).toContain('cco:open-chat');
    expect(a11y).not.toContain('a11y-fab');
    expect(a11y).toContain('data-a11y');

    expect(layout).toContain('CampingCompanion');
    expect(layout).toContain('ChatWidget');
    expect(companion).toContain('AccessibilityPrefs');
    expect(layout).toMatch(/lang="de"/);
    expect(companion).toMatch(/margin-inline:\s*auto\s+0/);
    expect(companion).toContain('right-side sheet');
  });

  it('keeps boot-before-paint a11y key without locale redirects', () => {
    const boot = readFileSync(join(root, 'src/lib/boot-script.ts'), 'utf8');
    expect(boot).toContain('cco:a11y');
    expect(boot).toContain('ccoFavCount');
    expect(boot).not.toContain('cco:lang');
    expect(boot).not.toContain('enRoutes');
  });

  it('boot opening labels stay German', () => {
    const boot = readFileSync(join(root, 'src/lib/boot-script.ts'), 'utf8');
    expect(boot).toContain('Aktuell geschlossen');
    expect(boot).toContain('Heute geöffnet');
    expect(boot).toContain('Feiertag');
    expect(boot).not.toContain('Currently closed');
  });

  it('boot refreshes opening status live (not one-shot SSR text)', () => {
    const boot = readFileSync(join(root, 'src/lib/boot-script.ts'), 'utf8');
    const site = readFileSync(join(root, 'src/scripts/site.ts'), 'utf8');
    expect(boot).toContain('__ccoRefreshOpen');
    expect(boot).toContain('cco:refresh-open');
    expect(boot).toContain('data-oh-banner-title');
    expect(boot).toContain('visibilitychange');
    expect(site).toContain('refreshOpenStatus');
    expect(site).toContain('astro:after-swap');
  });

  it('chat lazy-loads assist rules', () => {
    const chat = readFileSync(join(root, 'src/components/layout/ChatWidget.astro'), 'utf8');
    expect(chat).toContain("import('@/lib/camping-assist')");
    expect(chat).toContain('loadAssist');
    expect(chat).toContain('CAMPING_QUICK_PROMPTS');
  });
});
