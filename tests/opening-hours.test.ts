import { describe, expect, it } from 'vitest';
import { easterSunday, holidayOn, nrwHolidaysForYear } from '@/data/holidays';
import { computeOpenStatus } from '@/lib/opening-hours';

/** Build a Date that is this wall-clock time in Europe/Berlin. */
function berlinDate(isoDate: string, hh: number, mm: number): Date {
  // Use a formatter round-trip via explicit offset approximation:
  // pick UTC instant and verify with Intl; adjust if needed.
  const [y, m, d] = isoDate.split('-').map(Number);
  let guess = Date.UTC(y!, m! - 1, d!, hh - 1, mm, 0); // CET-ish start
  for (let i = 0; i < 8; i++) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date(guess));
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const got = `${get('year')}-${String(get('month')).padStart(2, '0')}-${String(get('day')).padStart(2, '0')} ${String(get('hour')).padStart(2, '0')}:${String(get('minute')).padStart(2, '0')}`;
    const want = `${isoDate} ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    if (got === want) return new Date(guess);
    const diffMin =
      (hh - get('hour')) * 60 +
      (mm - get('minute')) +
      (Number(isoDate.slice(8, 10)) - get('day')) * 24 * 60;
    guess += diffMin * 60_000;
  }
  return new Date(guess);
}

describe('NRW holidays', () => {
  it('computes Easter 2026 correctly', () => {
    const e = easterSunday(2026);
    expect(e.getFullYear()).toBe(2026);
    expect(e.getMonth() + 1).toBe(4);
    expect(e.getDate()).toBe(5);
  });

  it('includes fixed and movable NRW holidays', () => {
    const list = nrwHolidaysForYear(2026);
    expect(list.find((h) => h.date === '2026-01-01')?.name).toBe('Neujahr');
    expect(list.find((h) => h.date === '2026-04-03')?.name).toBe('Karfreitag');
    expect(list.find((h) => h.date === '2026-04-06')?.name).toBe('Ostermontag');
    expect(list.find((h) => h.date === '2026-06-04')?.name).toBe('Fronleichnam');
    expect(list.find((h) => h.date === '2026-12-25')?.name).toBe('1. Weihnachtstag');
  });

  it('resolves holidayOn', () => {
    expect(holidayOn('2026-10-03')?.name).toBe('Tag der Deutschen Einheit');
    expect(holidayOn('2026-10-04')).toBeNull();
  });
});

describe('computeOpenStatus with holidays', () => {
  it('shows closed with holiday name on Neujahr even midday', () => {
    const s = computeOpenStatus(berlinDate('2026-01-01', 10, 0));
    expect(s.state).toBe('closed');
    expect(s.reason).toBe('holiday');
    expect(s.holiday?.name).toBe('Neujahr');
    expect(s.label).toContain('Neujahr');
    expect(s.todayLabel).toContain('Feiertag');
  });

  it('after midnight into a holiday stays closed and names the holiday', () => {
    const s = computeOpenStatus(berlinDate('2026-12-25', 0, 15));
    expect(s.state).toBe('closed');
    expect(s.reason).toBe('holiday');
    expect(s.holiday?.name).toBe('1. Weihnachtstag');
    expect(s.shortLabel).toBe('Geschlossen');
  });

  it('opens on a normal weekday morning', () => {
    // 2026-01-07 is a Wednesday
    const s = computeOpenStatus(berlinDate('2026-01-07', 9, 30));
    expect(s.state).toBe('open');
    expect(s.label).toMatch(/geöffnet/i);
  });

  it('skips holidays when announcing next open', () => {
    // Friday 2026-01-02 evening – next open should skip nothing weird; New Year was day before
    const s = computeOpenStatus(berlinDate('2026-04-03', 12, 0)); // Karfreitag
    expect(s.state).toBe('closed');
    expect(s.reason).toBe('holiday');
    if (s.state === 'closed') {
      expect(s.opensNext).toBeTruthy();
      expect(s.opensNext).not.toMatch(/heute/i);
    }
  });
});
