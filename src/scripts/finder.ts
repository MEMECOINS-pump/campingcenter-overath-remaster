import { runFinder, type Category, type Condition, type FilterableVehicle, type FinderAnswers } from '@/lib/filter';
import { track } from '@/lib/analytics';

const MAX_RESULTS = 6;

const form = document.querySelector<HTMLFormElement>('[data-finder]');
const results = document.querySelector<HTMLElement>('[data-finder-results]');

if (form && results) {
  const steps = Array.from(form.querySelectorAll<HTMLFieldSetElement>('[data-finder-q]'));
  const back = form.querySelector<HTMLButtonElement>('[data-finder-back]');
  const nextLabel = form.querySelector('[data-finder-next-label]');
  const stepLabel = form.querySelector('[data-finder-step]');
  const bar = form.querySelector<HTMLElement>('[data-finder-bar]');
  const grid = results.querySelector<HTMLElement>('[data-finder-grid]');
  const title = results.querySelector('[data-finder-title]');
  const summary = results.querySelector('[data-finder-summary]');
  const allLink = results.querySelector<HTMLAnchorElement>('[data-finder-all]');
  const allBase = allLink?.getAttribute('href') ?? '';

  const items = Array.from(results.querySelectorAll<HTMLElement>('[data-finder-item]')).map((el) => {
    const d = el.querySelector<HTMLElement>('[data-vehicle]')?.dataset ?? {};
    const num = (s?: string) => (s ? Number(s) : null);
    const v: FilterableVehicle & { el: HTMLElement } = {
      el,
      id: d.id ?? '',
      condition: d.condition as Condition,
      make: d.make ?? '',
      category: d.category as Category,
      transmission: d.transmission || null,
      grossWeightKg: num(d.gw),
      price: Number(d.price ?? 0),
      lengthMm: num(d.length),
      mileageKm: num(d.km),
    };
    return v;
  });

  let step = 0;

  const show = (i: number, focus = true) => {
    step = i;
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    if (back) back.hidden = i === 0;
    if (nextLabel) nextLabel.textContent = i === steps.length - 1 ? 'Ergebnis anzeigen' : 'Weiter';
    if (stepLabel) stepLabel.textContent = `Frage ${i + 1}`;
    if (bar) bar.style.width = `${((i + 1) / steps.length) * 100}%`;
    if (focus) {
      const checked = steps[i]?.querySelector<HTMLInputElement>('input:checked') ?? steps[i]?.querySelector<HTMLInputElement>('input');
      checked?.focus({ preventScroll: true });
      form.scrollIntoView({ block: 'nearest' });
    }
  };

  const answered = (i: number) => Boolean(steps[i]?.querySelector('input:checked'));
  const setError = (i: number, msg: string) => {
    const el = steps[i]?.querySelector('[data-finder-error]');
    if (el) el.textContent = msg;
  };

  const answers = (): FinderAnswers => {
    const fd = new FormData(form);
    return {
      style: (fd.get('style') as FinderAnswers['style']) ?? undefined,
      weight: (fd.get('weight') as FinderAnswers['weight']) ?? undefined,
      length: (fd.get('length') as FinderAnswers['length']) ?? undefined,
      condition: (fd.get('condition') as FinderAnswers['condition']) ?? undefined,
      budget: (fd.get('budget') as FinderAnswers['budget']) ?? undefined,
    };
  };

  const showResults = () => {
    const a = answers();
    const r = runFinder(items, a);
    const top = r.results.slice(0, MAX_RESULTS);
    items.forEach((i) => (i.el.hidden = !top.includes(i)));
    top.forEach((i) => grid?.append(i.el));

    const n = r.results.length;
    if (title) title.textContent = r.exact ? (n === 1 ? 'Dieser Camper passt zu dir' : 'Diese Camper passen zu dir') : 'Diese Camper kommen am nächsten';
    if (summary) {
      summary.textContent = r.exact
        ? `${n} ${n === 1 ? 'Fahrzeug passt' : 'Fahrzeuge passen'} zu allen deinen Antworten${n > MAX_RESULTS ? ` – hier die ersten ${MAX_RESULTS}` : ''}.`
        : `Kein Fahrzeug im Bestand erfüllt gerade alle Wünsche. Wir haben ${r.relaxed.join(', ')} gelockert – oder wir suchen gemeinsam weiter.`;
    }
    if (allLink) {
      const p = new URLSearchParams();
      if (a.condition && a.condition !== 'egal') p.set('zustand', a.condition);
      if (a.weight === 'bis35') p.set('gewicht', 'bis35');
      if (a.style === 'kompakt') p.set('art', 'kastenwagen');
      if (a.style === 'raum') p.set('art', 'alkoven');
      if (a.style === 'komfort') {
        p.append('art', 'teilintegriert');
        p.append('art', 'vollintegriert');
      }
      const qs = p.toString();
      allLink.href = qs ? `${allBase}?${qs}` : allBase;
      allLink.textContent = qs ? 'Alle passenden Fahrzeuge' : 'Alle Fahrzeuge ansehen';
    }
    results.hidden = false;
    results.focus({ preventScroll: true });
    results.scrollIntoView({ block: 'start' });
    track('finder_complete', { ...a, results: n, exact: r.exact });
  };

  form.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    const i = steps.findIndex((s) => s.contains(input));
    if (i >= 0) setError(i, '');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!answered(step)) {
      setError(step, 'Bitte wähle eine Antwort.');
      steps[step]?.querySelector<HTMLInputElement>('input')?.focus();
      return;
    }
    if (step < steps.length - 1) show(step + 1);
    else showResults();
  });

  back?.addEventListener('click', () => show(Math.max(0, step - 1)));

  results.querySelector('[data-finder-restart]')?.addEventListener('click', () => {
    form.reset();
    results.hidden = true;
    show(0);
  });

  show(0, false);
}
