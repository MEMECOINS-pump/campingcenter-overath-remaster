import type { CollectDetail } from '@/scripts/forms';

/**
 * Client-side photo handling: decode, downscale and re-encode large smartphone photos
 * before they are attached to a form submission. Nothing is uploaded until the form is sent.
 */

const MAX_EDGE = 2048;
const QUALITY = 0.82;
const MAX_IMAGE_BYTES = 30 * 1024 * 1024;
const MAX_DOC_BYTES = 10 * 1024 * 1024;

interface Entry {
  id: number;
  file: File;
  el: HTMLLIElement;
  result: Blob | null;
  url: string | null;
}

const formatSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  // Small, already-compressed images are kept as they are.
  if (scale === 1 && file.size < 1.5 * 1024 * 1024 && /jpe?g|webp/.test(file.type)) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', QUALITY));
  if (!blob) throw new Error('encode');
  return blob.size < file.size ? blob : file;
}

function init(root: HTMLElement): void {
  const max = Number(root.dataset.max ?? 8);
  const name = root.dataset.name ?? 'fotos';
  const list = root.querySelector<HTMLUListElement>('[data-up-list]');
  const template = root.querySelector<HTMLTemplateElement>('[data-up-template]');
  const count = root.querySelector('[data-up-count]');
  const live = root.querySelector('[data-up-live]');
  const inputs = Array.from(root.querySelectorAll<HTMLInputElement>('[data-up-input]'));
  if (!list || !template) return;

  const entries: Entry[] = [];
  let seq = 0;

  const announce = (msg: string) => {
    if (live) live.textContent = msg;
  };

  const refresh = () => {
    if (count) count.textContent = String(entries.length);
    root.toggleAttribute('data-full', entries.length >= max);
    inputs.forEach((i) => (i.disabled = entries.length >= max));
  };

  const setState = (e: Entry, state: 'processing' | 'ready' | 'error', status: string, progress = 0) => {
    e.el.dataset.state = state;
    const s = e.el.querySelector('[data-up-status]');
    if (s) s.textContent = status;
    const bar = e.el.querySelector<HTMLElement>('[data-up-bar]');
    if (bar) bar.style.width = `${progress}%`;
    const retry = e.el.querySelector<HTMLButtonElement>('[data-up-retry]');
    if (retry) retry.hidden = state !== 'error';
  };

  const process = async (e: Entry) => {
    const isPdf = e.file.type === 'application/pdf';
    setState(e, 'processing', 'Wird vorbereitet …', 15);
    // visible progress while the browser decodes (which reports none itself)
    let p = 15;
    const tick = window.setInterval(() => {
      p = Math.min(90, p + 12);
      const bar = e.el.querySelector<HTMLElement>('[data-up-bar]');
      if (bar) bar.style.width = `${p}%`;
    }, 120);
    try {
      if (isPdf) {
        if (e.file.size > MAX_DOC_BYTES) throw new Error('size');
        e.result = e.file;
        const doc = e.el.querySelector<HTMLElement>('[data-up-doc]');
        if (doc) doc.hidden = false;
      } else {
        if (!e.file.type.startsWith('image/') && !/\.(heic|heif)$/i.test(e.file.name)) throw new Error('type');
        if (e.file.size > MAX_IMAGE_BYTES) throw new Error('size');
        e.result = await compress(e.file);
        e.url = URL.createObjectURL(e.result);
        const img = e.el.querySelector<HTMLImageElement>('[data-up-img]');
        if (img) img.src = e.url;
      }
      window.clearInterval(tick);
      const saved = e.result.size < e.file.size ? ` (von ${formatSize(e.file.size)} optimiert)` : '';
      setState(e, 'ready', `Bereit · ${formatSize(e.result.size)}${saved}`, 100);
      announce(`${e.file.name} hinzugefügt.`);
    } catch (err) {
      window.clearInterval(tick);
      e.result = null;
      const reason = (err as Error).message;
      const msg =
        reason === 'size'
          ? 'Datei ist zu groß.'
          : reason === 'type'
            ? 'Dateityp wird nicht unterstützt.'
            : 'Konnte nicht gelesen werden – bitte erneut versuchen oder als JPG speichern.';
      setState(e, 'error', msg);
      announce(`${e.file.name}: ${msg}`);
    }
  };

  const add = (files: FileList | null) => {
    if (!files) return;
    const room = max - entries.length;
    const picked = Array.from(files).slice(0, room);
    if (files.length > room) announce(`Maximal ${max} Dateien – ${files.length - room} wurden nicht übernommen.`);
    for (const file of picked) {
      const el = template.content.firstElementChild?.cloneNode(true) as HTMLLIElement;
      const entry: Entry = { id: ++seq, file, el, result: null, url: null };
      const nameEl = el.querySelector('[data-up-name]');
      if (nameEl) nameEl.textContent = file.name || `Foto ${entry.id}`;
      el.querySelector('[data-up-remove]')?.setAttribute('aria-label', `${file.name} entfernen`);
      el.querySelector('[data-up-retry]')?.setAttribute('aria-label', `${file.name} erneut versuchen`);
      el.querySelector('[data-up-remove]')?.addEventListener('click', () => {
        if (entry.url) URL.revokeObjectURL(entry.url);
        entries.splice(entries.indexOf(entry), 1);
        el.remove();
        refresh();
        announce(`${file.name} entfernt.`);
        inputs[inputs.length - 1]?.focus();
      });
      el.querySelector('[data-up-retry]')?.addEventListener('click', () => void process(entry));
      list.append(el);
      entries.push(entry);
      void process(entry);
    }
    refresh();
  };

  inputs.forEach((input) =>
    input.addEventListener('change', () => {
      add(input.files);
      input.value = '';
    }),
  );

  const form = root.closest('form');
  form?.addEventListener('cco:collect', (ev) => {
    const { data, summary } = (ev as CustomEvent<CollectDetail>).detail;
    const ready = entries.filter((e) => e.result);
    ready.forEach((e, i) => {
      const ext = e.result?.type === 'application/pdf' ? 'pdf' : 'jpg';
      data.append(`${name}[]`, e.result as Blob, e.file.name.replace(/\.[^.]+$/, '') + `-${i + 1}.${ext}`);
    });
    if (ready.length) summary.push(`\n${ready.length} ${ready.length === 1 ? 'Datei' : 'Dateien'} ausgewählt: ${ready.map((e) => e.file.name).join(', ')} – bitte an diese E-Mail anhängen.`);
  });
  form?.addEventListener('reset', () => {
    entries.splice(0).forEach((e) => {
      if (e.url) URL.revokeObjectURL(e.url);
      e.el.remove();
    });
    refresh();
  });

  refresh();
}

document.querySelectorAll<HTMLElement>('[data-uploader]').forEach(init);
