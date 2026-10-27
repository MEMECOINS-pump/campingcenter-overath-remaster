import { bindTrackAttributes, track } from '@/lib/analytics';
import { readConsent, writeConsent } from '@/lib/consent';
import { COMPARE_MAX, clearCollection, hasItem, onCollectionChange, readCollection, toggleItem } from '@/lib/collections';
import { computeOpenStatus, type OpenStatus } from '@/lib/opening-hours';

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
  if (!header || header.hasAttribute('data-bound')) return;
  header.setAttribute('data-bound', '');

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
  if (!dialog || dialog.hasAttribute('data-bound')) return;
  dialog.setAttribute('data-bound', '');

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
      if (href.includes('#') || href === location.pathname) dialog.close();
    }
  });

  window.matchMedia('(min-width: 64em)').addEventListener('change', (mq) => {
    if (mq.matches && dialog.open) dialog.close();
  });
}

/* ---------- on-screen keyboard: hide sticky bars while typing ---------- */
function initKeyboardAwareness(): void {
  if (document.documentElement.hasAttribute('data-kb-bound')) return;
  document.documentElement.setAttribute('data-kb-bound', '');
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
  const html = document.documentElement;

  if (banner && !readConsent()) {
    banner.hidden = false;
    html.classList.add('needs-consent');
    html.classList.remove('consent-known');
  } else {
    html.classList.add('consent-known');
    html.classList.remove('needs-consent');
    if (banner) banner.hidden = true;
  }

  if (document.body.hasAttribute('data-consent-bound')) return;
  document.body.setAttribute('data-consent-bound', '');

  const decide = (media: boolean, stats: boolean) => {
    writeConsent(media, stats);
    if (banner) banner.hidden = true;
    html.classList.add('consent-known');
    html.classList.remove('needs-consent');
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
    lockScroll(true);
    dialog.showModal();
  });

  dialog?.addEventListener('close', () => {
    lockScroll(false);
    if (!form) return;
    if (dialog.returnValue === 'all') decide(true, true);
    else if (dialog.returnValue === 'necessary') decide(false, false);
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
  const lang = siteLang();
  $$<HTMLButtonElement>('[data-fav-toggle]').forEach((btn) => {
    const on = hasItem('favorites', btn.dataset.favToggle ?? '');
    btn.setAttribute('aria-pressed', String(on));
    const label = btn.querySelector('[data-label]');
    if (label) label.textContent = on ? (lang === 'en' ? 'Saved' : 'Gemerkt') : lang === 'en' ? 'Save' : 'Merken';
  });
  $$<HTMLButtonElement>('[data-compare-toggle]').forEach((btn) => {
    const on = hasItem('compare', btn.dataset.compareToggle ?? '');
    btn.setAttribute('aria-pressed', String(on));
    const label = btn.querySelector('[data-label]');
    if (label)
      label.textContent = on ? (lang === 'en' ? 'In compare' : 'Im Vergleich') : lang === 'en' ? 'Compare' : 'Vergleichen';
  });
}

function initCollections(): void {
  if (!document.body.hasAttribute('data-collections-bound')) {
    document.body.setAttribute('data-collections-bound', '');
    document.addEventListener('click', (e) => {
      const target = e.target as Element;
      const fav = target.closest<HTMLElement>('[data-fav-toggle]');
      if (fav) {
        e.preventDefault();
        const id = fav.dataset.favToggle ?? '';
        const on = toggleItem('favorites', id);
        const lang = siteLang();
        toast(
          on
            ? lang === 'en'
              ? 'Added to wishlist'
              : 'Zur Merkliste hinzugefügt'
            : lang === 'en'
              ? 'Removed from wishlist'
              : 'Von der Merkliste entfernt',
        );
        track('vehicle_favorite', { vehicle_id: id, state: on ? 'add' : 'remove' });
        return;
      }
      const cmp = target.closest<HTMLElement>('[data-compare-toggle]');
      if (cmp) {
        e.preventDefault();
        const id = cmp.dataset.compareToggle ?? '';
        const on = toggleItem('compare', id);
        const lang = siteLang();
        if (on === null)
          toast(
            lang === 'en'
              ? `Maximum ${COMPARE_MAX} vehicles in compare — remove one first.`
              : `Maximal ${COMPARE_MAX} Fahrzeuge im Vergleich – entferne zuerst eines.`,
          );
        else
          toast(
            on
              ? lang === 'en'
                ? 'Added to compare'
                : 'Zum Vergleich hinzugefügt'
              : lang === 'en'
                ? 'Removed from compare'
                : 'Aus dem Vergleich entfernt',
          );
        if (on !== null) track('vehicle_compare', { vehicle_id: id, state: on ? 'add' : 'remove' });
        return;
      }
      if (target.closest('[data-compare-clear]')) {
        clearCollection('compare');
        toast(siteLang() === 'en' ? 'Compare cleared' : 'Vergleich geleert');
      }
    });
    onCollectionChange(syncCollections);
  }
  syncCollections();
}

/* ---------- opening status (re-bind after view transitions) ---------- */
function siteLang(): 'de' | 'en' {
  const htmlLang = document.documentElement.lang || '';
  const body = document.body?.dataset.lang;
  const pref = document.documentElement.dataset.ccoLang;
  if (body === 'en' || pref === 'en' || htmlLang.startsWith('en')) return 'en';
  return 'de';
}

function applyOpening(root: HTMLElement, status: OpenStatus): void {
  const isHoliday = status.reason === 'holiday';
  const next = status.state === 'closed' ? status.opensNext : null;
  const holidaySub = root.dataset.i18nHolidaySub || 'Gesetzlicher Feiertag (NRW)';
  root.dataset.state = status.state;
  root.dataset.reason = status.reason;

  root.querySelectorAll<HTMLElement>('[data-oh-line]').forEach((el) => {
    el.textContent = status.label;
  });
  root.querySelectorAll<HTMLElement>('[data-oh-sub]').forEach((el) => {
    if (isHoliday) {
      el.hidden = false;
      el.textContent = `${holidaySub}${next ? ` · ${next}` : ''}`;
    } else if (next) {
      el.hidden = false;
      el.textContent = next;
    } else {
      el.hidden = true;
      el.textContent = '';
    }
  });
  root.querySelectorAll<HTMLElement>('[data-oh-today]').forEach((el) => {
    el.textContent = status.todayLabel;
  });
  root.querySelectorAll<HTMLButtonElement>('[data-oh-open]').forEach((btn) => {
    btn.dataset.state = status.state;
    btn.dataset.reason = status.reason;
  });
  root.querySelectorAll<HTMLElement>('[data-oh-banner]').forEach((el) => {
    el.dataset.state = status.state;
    el.dataset.reason = status.reason;
  });
  root.querySelectorAll<HTMLElement>('[data-oh-banner-title]').forEach((el) => {
    el.textContent = isHoliday
      ? root.dataset.i18nBannerHoliday || 'Heute Feiertag – geschlossen'
      : status.state === 'open'
        ? root.dataset.i18nBannerOpen || 'Jetzt geöffnet'
        : root.dataset.i18nBannerClosed || 'Jetzt geschlossen';
  });
  root.querySelectorAll<HTMLElement>('[data-oh-alert]').forEach((el) => {
    el.hidden = !isHoliday;
  });
  root.querySelectorAll<HTMLElement>('[data-oh-alert-name]').forEach((el) => {
    el.textContent = status.holiday?.name ?? '';
  });
  const alertEl = root.querySelector<HTMLElement>('[data-oh-alert]');
  const alertH = isHoliday && alertEl && !alertEl.hidden ? Math.ceil(alertEl.getBoundingClientRect().height) : 0;
  document.documentElement.style.setProperty('--header-alert-h', `${alertH}px`);
  root.querySelectorAll<HTMLElement>('[data-oh-next]').forEach((el) => {
    el.hidden = !next;
    el.textContent = next ?? '';
  });
}

function tickOpening(): void {
  const lang = siteLang();
  $$<HTMLElement>('[data-opening-status]').forEach((root) => {
    const rootLang = root.dataset.lang === 'en' ? 'en' : lang;
    applyOpening(root, computeOpenStatus(new Date(), undefined, rootLang));
  });
  $$<HTMLElement>('[data-open-state]').forEach((el) => {
    const status = computeOpenStatus(new Date(), undefined, lang);
    el.dataset.state = status.state;
    el.dataset.reason = status.reason;
    const host = el.closest<HTMLElement>('[data-i18n-companion-open], [data-companion]') || document.body;
    const holiday =
      (host as HTMLElement).dataset?.i18nCompanionHoliday ||
      document.querySelector<HTMLElement>('[data-i18n-companion-holiday]')?.dataset.i18nCompanionHoliday ||
      (lang === 'en' ? 'Public holiday · Closed' : 'Feiertag · Geschlossen');
    const open =
      document.querySelector<HTMLElement>('[data-i18n-companion-open]')?.dataset.i18nCompanionOpen ||
      (lang === 'en' ? 'Open now' : 'Jetzt geöffnet');
    const closed =
      document.querySelector<HTMLElement>('[data-i18n-companion-closed]')?.dataset.i18nCompanionClosed ||
      (lang === 'en' ? 'Currently closed' : 'Aktuell geschlossen');
    el.textContent = status.reason === 'holiday' ? holiday : status.state === 'open' ? open : closed;
  });
}

function initOpening(): void {
  $$<HTMLElement>('[data-opening-status]').forEach((root) => {
    if (root.hasAttribute('data-bound')) return;
    root.setAttribute('data-bound', '');
    const rootLang = root.dataset.lang === 'en' ? 'en' : siteLang();
    applyOpening(root, computeOpenStatus(new Date(), undefined, rootLang));
    const sheet = root.querySelector<HTMLDialogElement>('[data-oh-sheet]');
    const setSheet = (open: boolean) => {
      document.body.classList.toggle('scroll-locked', open);
      if (open) sheet?.showModal();
      else sheet?.close();
    };
    root.querySelector('[data-oh-open]')?.addEventListener('click', () => setSheet(true));
    root.querySelector('[data-oh-close]')?.addEventListener('click', () => setSheet(false));
    sheet?.addEventListener('click', (e) => {
      if (e.target === sheet) setSheet(false);
    });
    sheet?.addEventListener('close', () => document.body.classList.remove('scroll-locked'));
  });
  tickOpening();
  if (!document.documentElement.hasAttribute('data-oh-interval')) {
    document.documentElement.setAttribute('data-oh-interval', '');
    window.setInterval(tickOpening, 30_000);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') tickOpening();
    });
  }
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

/** Rewrite internal DE hrefs to /en/... when preference is English (keeps clicks sticky). */
const EN_EXACT = new Set([
  '/',
  '/kontakt/',
  '/wohnmobile/',
  '/vermietung-wohnmobile/',
  '/wohnmobil-ankauf/',
  '/werkstatt-kundendienst/',
  '/ueber-uns/',
  '/camper-finder/',
  '/marken/',
  '/404/',
  '/merkliste/',
  '/vergleich/',
]);

function hasEnBare(bare: string): boolean {
  if (EN_EXACT.has(bare)) return true;
  return /^\/wohnmobile\/[^/]+\/$/.test(bare);
}

function toEnHref(href: string): string | null {
  if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#'))
    return null;
  try {
    const u = new URL(href, location.origin);
    let path = u.pathname;
    const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
    if (base && base !== '/' && path.startsWith(base)) path = path.slice(base.length) || '/';
    if (path === '/en' || path.startsWith('/en/')) return null;
    const bare = path.endsWith('/') || /\.[a-z0-9]+$/i.test(path) ? path : `${path}/`;
    if (!hasEnBare(bare)) return null;
    const enPath = bare === '/' ? '/en/' : `/en${bare}`;
    return `${base}${enPath}${u.search}${u.hash}`;
  } catch {
    return null;
  }
}

function initLocaleLinks(): void {
  if (siteLang() !== 'en') return;
  $$<HTMLAnchorElement>('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;
    const next = toEnHref(href);
    if (next && next !== href) a.setAttribute('href', next);
  });
}

function bootUi(): void {
  initHeader();
  initMenu();
  initKeyboardAwareness();
  initConsent();
  initCollections();
  initOpening();
  initReveal();
  initLocaleLinks();
  bindTrackAttributes();
}

bootUi();
document.addEventListener('astro:page-load', bootUi);
document.addEventListener('astro:after-swap', () => {
  const html = document.documentElement;
  const label = html.dataset.ccoOpenLabel;
  const state = html.dataset.ccoOpen;
  const reason = html.dataset.ccoOpenReason;
  if (label) {
    $$('[data-oh-line]').forEach((el) => {
      el.textContent = label;
    });
  }
  if (state) {
    $$('[data-opening-status], [data-oh-open]').forEach((el) => {
      el.dataset.state = state;
      if (reason) el.dataset.reason = reason;
    });
  }
  const n = html.dataset.ccoFavCount;
  if (n) {
    $$('[data-fav-count]').forEach((el) => {
      if (el === html || el === document.documentElement) return;
      el.textContent = n;
      (el as HTMLElement).hidden = false;
    });
  }
});
