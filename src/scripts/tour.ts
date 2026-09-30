import { track } from '@/lib/analytics';

interface Scene {
  id: string;
  title: string;
  src: string;
}

interface PannellumViewer {
  loadScene(id: string): void;
  on(event: 'load' | 'error' | 'scenechange', cb: (arg?: unknown) => void): void;
}

declare global {
  interface Window {
    pannellum?: { viewer(el: HTMLElement, config: object): PannellumViewer };
  }
}

const strings = {
  loadButtonLabel: 'Panorama laden',
  loadingLabel: 'Lädt …',
  bylineLabel: 'von %s',
  noPanoramaError: 'Kein Panorama gefunden.',
  fileAccessError: 'Die Datei %s konnte nicht geladen werden.',
  malformedURLError: 'Die Panorama-Adresse ist fehlerhaft.',
  iOS8WebGLError: 'Dein Gerät unterstützt die Darstellung leider nicht.',
  genericWebGLError: 'Dein Browser unterstützt kein WebGL – der Rundgang kann nicht angezeigt werden.',
  textureSizeError: 'Das Panorama ist zu groß für dein Gerät.',
  unknownError: 'Unbekannter Fehler. Bitte lade die Seite neu.',
};

const root = document.querySelector<HTMLElement>('[data-tour]');
if (root) init(root);

function init(root: HTMLElement): void {
  const scenes = JSON.parse(root.dataset.scenes ?? '[]') as Scene[];
  const host = root.querySelector<HTMLElement>('[data-tour-viewer]')!;
  const poster = root.querySelector<HTMLElement>('[data-tour-poster]')!;
  const status = root.querySelector<HTMLElement>('[data-tour-status]')!;
  const current = root.querySelector<HTMLElement>('[data-tour-current]')!;
  const thumbs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-tour-scene]'));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let viewer: PannellumViewer | undefined;
  let loading: Promise<PannellumViewer> | undefined;
  let index = 0;

  const setIndex = (i: number) => {
    index = i;
    current.textContent = String(i + 1);
    thumbs.forEach((t, n) => t.setAttribute('aria-pressed', String(n === i)));
    const active = thumbs[i];
    const strip = active?.closest('ul');
    if (active && strip) strip.scrollTo({ left: active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2, behavior: reduced ? 'auto' : 'smooth' });
  };

  const load = (): Promise<PannellumViewer> => {
    loading ??= (async () => {
      status.textContent = 'Rundgang wird geladen …';
      await import('pannellum/build/pannellum.js');
      const lib = window.pannellum;
      if (!lib) throw new Error('pannellum missing');
      const config = {
        default: {
          firstScene: scenes[index]?.id,
          autoLoad: true,
          sceneFadeDuration: reduced ? 0 : 600,
          autoRotate: reduced ? 0 : -2,
          autoRotateInactivityDelay: 4000,
          showZoomCtrl: true,
          showFullscreenCtrl: true,
          keyboardZoom: true,
          compass: false,
          hfov: 100,
          strings,
        },
        scenes: Object.fromEntries(scenes.map((s) => [s.id, { title: s.title, type: 'equirectangular', panorama: s.src }])),
      };
      const v = lib.viewer(host, config);
      v.on('load', () => (status.textContent = ''));
      v.on('error', () => (status.textContent = 'Die Station konnte nicht geladen werden.'));
      poster.hidden = true;
      host.setAttribute('tabindex', '0');
      host.setAttribute('aria-label', '360° Panorama – mit Pfeiltasten umsehen');
      host.focus({ preventScroll: true });
      track('tour_start');
      return v;
    })().catch((err: unknown) => {
      console.error(err);
      loading = undefined;
      status.textContent = 'Der Rundgang konnte nicht geladen werden. Bitte versuche es erneut.';
      throw err;
    });
    return loading;
  };

  const go = async (i: number) => {
    const next = (i + scenes.length) % scenes.length;
    const scene = scenes[next];
    if (!scene) return;
    const wasLoaded = Boolean(viewer);
    setIndex(next);
    viewer = await load();
    if (wasLoaded) {
      status.textContent = `${scene.title} wird geladen …`;
      viewer.loadScene(scene.id);
    }
  };

  root.querySelector('[data-tour-start]')?.addEventListener('click', () => void go(index));
  root.querySelector('[data-tour-prev]')?.addEventListener('click', () => void go(index - 1));
  root.querySelector('[data-tour-next]')?.addEventListener('click', () => void go(index + 1));
  thumbs.forEach((t, i) => t.addEventListener('click', () => void go(i)));
}
