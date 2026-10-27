import { runCampingFinder, type BedType, type Category, type Condition, type FilterableVehicle, type FinderAnswers } from '@/lib/filter';
import { track } from '@/lib/analytics';

const API = (import.meta.env.PUBLIC_API_BASE as string | undefined)?.replace(/\/$/, '') || '';

const form = document.querySelector<HTMLFormElement>('[data-finder]');
const results = document.querySelector<HTMLElement>('[data-finder-results]');
const lead = document.querySelector<HTMLFormElement>('[data-finder-lead]');

if (form && results) {
  const steps = Array.from(form.querySelectorAll<HTMLFieldSetElement>('[data-finder-q]'));
  const back = form.querySelector<HTMLButtonElement>('[data-finder-back]');
  const nextLabel = form.querySelector('[data-finder-next-label]');
  const stepLabel = form.querySelector('[data-finder-step]');
  const bar = form.querySelector<HTMLElement>('[data-finder-bar]');
  const grid = results.querySelector<HTMLElement>('[data-finder-grid]');
  const title = results.querySelector('[data-finder-title]');
  const summary = results.querySelector('[data-finder-summary]');
  const empty = results.querySelector<HTMLElement>('[data-finder-empty]');
  const reasonsHost = (id: string) => results.querySelector<HTMLElement>(`[data-finder-reasons="${id}"]`);

  const parseBeds = (raw?: string) => {
    if (!raw) return [];
    try {
      return JSON.parse(raw) as FilterableVehicle['beds'];
    } catch {
      return [];
    }
  };

  const items = Array.from(results.querySelectorAll<HTMLElement>('[data-finder-item]')).map((el) => {
    const d = el.querySelector<HTMLElement>('[data-vehicle]')?.dataset ?? el.dataset;
    const num = (s?: string) => (s && s !== '' ? Number(s) : null);
    const v: FilterableVehicle & { el: HTMLElement; slug: string; internalId: string } = {
      el,
      id: d.id ?? '',
      slug: d.slug ?? '',
      internalId: d.internalId ?? d.id ?? '',
      condition: d.condition as Condition,
      make: d.make ?? '',
      category: d.category as Category,
      transmission: d.transmission || null,
      grossWeightKg: num(d.gw),
      price: Number(d.price ?? 0),
      lengthMm: num(d.length),
      mileageKm: num(d.km),
      seats: num(d.seats),
      sleepingPlaces: num(d.sleeps),
      beds: parseBeds(d.beds),
    };
    return v;
  });

  let step = 0;
  let lastAnswers: FinderAnswers = {};
  let lastIds: string[] = [];

  const show = (i: number, focus = true) => {
    step = i;
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    if (back) back.hidden = i === 0;
    if (nextLabel) nextLabel.textContent = i === steps.length - 1 ? 'Empfehlungen zeigen' : 'Weiter';
    if (stepLabel) stepLabel.textContent = `${i + 1} von ${steps.length}`;
    if (bar) bar.style.width = `${((i + 1) / steps.length) * 100}%`;
    track('camping_finder_step', { step: i + 1 });
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
      persons: (fd.get('persons') as FinderAnswers['persons']) || undefined,
      seats: (fd.get('seats') as FinderAnswers['seats']) || undefined,
      sleeps: (fd.get('sleeps') as FinderAnswers['sleeps']) || undefined,
      bedType: (fd.get('bedType') as BedType | 'any') || undefined,
      bedLength: (fd.get('bedLength') as FinderAnswers['bedLength']) || undefined,
      lengthMax: (fd.get('lengthMax') as FinderAnswers['lengthMax']) || undefined,
      transmission: (fd.get('transmission') as FinderAnswers['transmission']) || undefined,
      condition: (fd.get('condition') as FinderAnswers['condition']) || undefined,
      budget: (fd.get('budget') as FinderAnswers['budget']) || undefined,
      style: (fd.get('style') as FinderAnswers['style']) || undefined,
    };
  };

  const showResults = () => {
    lastAnswers = answers();
    const r = runCampingFinder(items, lastAnswers);
    lastIds = r.exact.map((m) => m.vehicle.internalId || m.vehicle.id);

    items.forEach((i) => {
      i.el.hidden = true;
      const host = reasonsHost(i.id);
      if (host) host.innerHTML = '';
    });

    if (r.hasExact) {
      if (empty) empty.hidden = true;
      if (title) title.textContent = 'Deine Empfehlungen';
      if (summary) {
        summary.textContent = `${r.exact.length} passende Fahrzeuge aus dem aktuellen Bestand – mit nachvollziehbaren Gründen.`;
      }
      r.exact.forEach((m) => {
        m.vehicle.el.hidden = false;
        grid?.append(m.vehicle.el);
        const host = reasonsHost(m.vehicle.id);
        if (host) {
          host.innerHTML = `<p class="finder-why-label">Warum passt dieses Fahrzeug zu dir?</p><ul>${m.reasons
            .map((x) => `<li>${x.ok ? '✓' : '•'} ${x.label}</li>`)
            .join('')}${m.needsConfirmation ? '<li>• Technische Angabe bitte bestätigen lassen.</li>' : ''}</ul>`;
        }
      });
      track('camping_finder_results', { count: r.exact.length, exact: 1 });
    } else {
      if (empty) empty.hidden = false;
      if (title) title.textContent = 'Wir finden gemeinsam eine Lösung.';
      if (summary) {
        summary.textContent = r.blockedBy.length
          ? `Mit den aktuellen Angaben gab es keinen exakten Treffer (u. a. ${r.blockedBy.join(', ')}). Wir beraten dich gern persönlich.`
          : 'Mit den aktuellen Angaben gab es keinen exakten Treffer. Wir beraten dich gern persönlich.';
      }
      track('camping_finder_results', { count: 0, exact: 0 });
    }

    results.hidden = false;
    form.hidden = true;
    if (lead) lead.hidden = false;
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    track('camping_finder_complete');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!answered(step)) {
      setError(step, 'Bitte wähle eine Option.');
      return;
    }
    setError(step, '');
    if (step < steps.length - 1) show(step + 1);
    else showResults();
  });

  back?.addEventListener('click', () => {
    if (step > 0) show(step - 1);
  });

  track('camping_finder_start');
  show(0, false);

  lead?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(lead);
    const payload = {
      name: String(fd.get('name') ?? '').trim(),
      email: String(fd.get('email') ?? '').trim(),
      phone: String(fd.get('phone') ?? '').trim(),
      consent: fd.get('datenschutz') === 'on' || fd.get('datenschutz') === 'true',
      answers: lastAnswers,
      recommendedVehicleIds: lastIds,
      sourcePage: '/camper-finder/',
    };
    const status = lead.querySelector('[data-finder-lead-status]');
    const btn = lead.querySelector<HTMLButtonElement>('button[type=submit]');
    if (btn) btn.disabled = true;

    try {
      if (API) {
        const res = await fetch(`${API}/api/camping-finder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('fail');
        if (status) status.textContent = 'Danke – deine Anfrage ist gespeichert. Wir melden uns.';
      } else {
        const subject = encodeURIComponent('[AUSWERTUNG] Camping Finder – Neue Kundenanfrage');
        const body = encodeURIComponent(
          [
            'Camping Finder Anfrage',
            `Name: ${payload.name}`,
            `E-Mail: ${payload.email}`,
            `Telefon: ${payload.phone}`,
            `Antworten: ${JSON.stringify(payload.answers)}`,
            `Empfehlungen: ${payload.recommendedVehicleIds.join(', ') || '–'}`,
          ].join('\n'),
        );
        window.location.href = `mailto:martin_meinke@ccoverath.de?subject=${subject}&body=${body}`;
        if (status) status.textContent = 'Dein E-Mail-Programm öffnet sich mit der vorbereiteten Anfrage.';
      }
      track('camping_finder_lead_submit');
      lead.hidden = true;
    } catch {
      if (status) status.textContent = 'Senden fehlgeschlagen. Bitte ruf uns an oder schreib an service@ccoverath.de.';
    } finally {
      if (btn) btn.disabled = false;
    }
  });
}
