import { bindTrackAttributes, track } from '@/lib/analytics';
import { readConsent, writeConsent } from '@/lib/consent';
import { COMPARE_MAX, clearCollection, hasItem, onCollectionChange, readCollection, toggleItem } from '@/lib/collections';

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) =>
  Array.from(root.querySelectorAll<T>(sel));

/* ---------- toast ---------- */
let toastTimer: number | undefined;
export function toast(message: string): void {
  const el = $('[data-toast]');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-visible'), 3200);
}

/* ---------- scroll lock (shared by overlays) ---------- */
let lockCount = 0;
export function lockScroll(lock: boolean): void {
  lockCount = Math.max(0, lockCount + (lock ? 1 : -1));
  document.body.classList.toggle('scroll-locked', lockCount > 0);
}

/** Modal <dialog> with scroll lock and focus return to the opener. */
export function openModal(dialog: HTMLDialogElement, opener?: HTMLElement | null): void {
  if (dialog.open) return;
  dialog.showModal();
  lockScroll(true);
  dialog.addEventListener(
    'close',
    () => {
      lockScroll(false);
      opener?.focus({ preventScroll: true });
    },
    { once: true },
  );
}

/* ---------- header ---------- */
function initHeader(): void {
  const header = $('[data-header]');
  if (!header) return;

  if (header.dataset.overlay) {
    const update = () => header.classList.toggle('is-solid', window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  const dropdowns = $$('[data-dropdown]', header);
  const closeAll = (except?: Element) => {
    for (const dd of dropdowns) {
      if (dd === except) continue;
      $('button', dd)?.setAttribute('aria-expanded', 'false');
      const panel = $('.dropdown', dd);
      if (panel) panel.hidden = true;
    }
  };

  for (const dd of dropdowns) {
    const btn = $<HTMLButtonElement>('button', dd);
    const panel = $('.dropdown', dd);
    if (!btn || !panel) continue;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      closeAll(dd);
      btn.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    });
    dd.addEventListener('focusout', (e) => {
      if (!dd.contains(e.relatedTarget as Node | null)) {
        btn.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      }
    });
    dd.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) {
        closeAll();
        btn.focus();
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('[data-dropdown]')) closeAll();
  });
}

/* ---------- mobile menu ---------- */
function initMenu(): void {
  const dialog = $<HTMLDialogElement>('[data-menu]');
  const openers = $$<HTMLButtonElement>('[data-menu-open]');
  if (!dialog) return;

  const setExpanded = (v: boolean) => openers.forEach((b) => b.setAttribute('aria-expanded', String(v)));

  openers.forEach((btn) =>
    btn.addEventListener('click', () => {
      dialog.showModal();
      lockScroll(true);
      setExpanded(true);
    }),
  );

  dialog.addEventListener('close', () => {
    lockScroll(false);
    setExpanded(false);
    openers[0]?.focus({ preventScroll: true });
  });

  $$('[data-menu-close]', dialog).forEach((b) => b.addEventListener('click', () => dialog.close()));

  dialog.addEventListener('click', (e) => {
    const link = (e.target as Element).closest('a');
    if (link) {
      const href = link.getAttribute('href') ?? '';
      // same-page anchors: close so the target is visible
      if (href.includes('#') || href === location.pathname) dialog.close();
    }
  });

  // Close when switching to desktop layout while open
  window.matchMedia('(min-width: 64em)').addEventListener('change', (mq) => {
    if (mq.matches && dialog.open) dialog.close();
  });
}

/* ---------- on-screen keyboard: hide sticky bars while typing ---------- */
function initKeyboardAwareness(): void {
  const coarse = window.matchMedia('(pointer: coarse)');
  const isField = (el: EventTarget | null) =>
    el instanceof HTMLElement &&
    (el.matches('textarea, select, [contenteditable]') ||
      (el instanceof HTMLInputElement && !['checkbox', 'radio', 'button', 'submit', 'file', 'range'].includes(el.type)));

  document.addEventListener('focusin', (e) => {
    if (coarse.matches && isField(e.target)) document.body.classList.add('kb-open');
  });
  document.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!isField(document.activeElement)) document.body.classList.remove('kb-open');
    }, 60);
  });
}

/* ---------- consent ---------- */
function initConsent(): void {
  const banner = $('[data-consent-banner]');
  const dialog = $<HTMLDialogElement>('[data-consent-dialog]');
  const form = $<HTMLFormElement>('[data-consent-form]');

  if (banner && !readConsent()) banner.hidden = false;

  const decide = (media: boolean, stats: boolean) => {
    writeConsent(media, stats);
    if (banner) banner.hidden = true;
  };

  $$('[data-consent-action]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const all = btn.dataset.consentAction === 'all';
      decide(all, all);
    }),
  );

  document.addEventListener('click', (e) => {
    if (!(e.target as Element).closest('[data-consent-open]') || !dialog || !form) return;
    const state = readConsent();
    (form.elements.namedItem('media') as HTMLInputElement).checked = !!state?.media;
    (form.elements.namedItem('stats') as HTMLInputElement).checked = !!state?.stats;
    dialog.showModal();
  });

  dialog?.addEventListener('close', () => {
    if (!form) return;
    if (dialog.returnValue === 'all') decide(true, true);
    else if (dialog.returnValue === 'save')
      decide(
        (form.elements.namedItem('media') as HTMLInputElement).checked,
        (form.elements.namedItem('stats') as HTMLInputElement).checked,
      );
    dialog.returnValue = '';
  });
}

/* ---------- Merkliste & Vergleich ---------- */
function syncCollections(): void {
  const favs = readCollection('favorites');
  const cmp = readCollection('compare');
  $$('[data-fav-count]').forEach((el) => {
    el.textContent = String(favs.length);
    el.hidden = favs.length === 0;
  });
  $$('[data-compare-count]').forEach((el) => {
    el.textContent = String(cmp.length);
  });
  $$('[data-compare-tray]').forEach((el) => {
    el.hidden = cmp.length === 0;
  });
  $$<HTMLButtonElement>('[data-fav-toggle]').forEach((btn) => {
    const on = hasItem('favorites', btn.dataset.favToggle ?? '');
    btn.setAttribute('aria-pressed', String(on));
    const label = btn.querySelector('[data-label]');
    if (label) label.textContent = on ? 'Gemerkt' : 'Merken';
  });
  $$<HTMLButtonElement>('[data-compare-toggle]').forEach((btn) => {
    const on = hasItem('compare', btn.dataset.compareToggle ?? '');
    btn.setAttribute('aria-pressed', String(on));
    const label = btn.querySelector('[data-label]');
    if (label) label.textContent = on ? 'Im Vergleich' : 'Vergleichen';
  });
}

function initCollections(): void {
  document.addEventListener('click', (e) => {
    const target = e.target as Element;
    const fav = target.closest<HTMLElement>('[data-fav-toggle]');
    if (fav) {
      e.preventDefault();
      const id = fav.dataset.favToggle ?? '';
      const on = toggleItem('favorites', id);
      toast(on ? 'Zur Merkliste hinzugefügt' : 'Von der Merkliste entfernt');
      track('vehicle_favorite', { vehicle_id: id, state: on ? 'add' : 'remove' });
      return;
    }
    const cmp = target.closest<HTMLElement>('[data-compare-toggle]');
    if (cmp) {
      e.preventDefault();
      const id = cmp.dataset.compareToggle ?? '';
      const on = toggleItem('compare', id);
      if (on === null) toast(`Maximal ${COMPARE_MAX} Fahrzeuge im Vergleich – entferne zuerst eines.`);
      else toast(on ? 'Zum Vergleich hinzugefügt' : 'Aus dem Vergleich entfernt');
      if (on !== null) track('vehicle_compare', { vehicle_id: id, state: on ? 'add' : 'remove' });
      return;
    }
    if (target.closest('[data-compare-clear]')) {
      clearCollection('compare');
      toast('Vergleich geleert');
    }
  });
  onCollectionChange(syncCollections);
  syncCollections();
}

/* ---------- reveal on scroll ---------- */
function initReveal(): void {
  const items = $$('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => io.observe(el));
}

initHeader();
initMenu();
initKeyboardAwareness();
initConsent();
initCollections();
initReveal();
bindTrackAttributes();
