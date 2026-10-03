/**
 * Gesetzliche Feiertage für Overath (NRW).
 * Eine zentrale Quelle für Header, Kontakt, Footer und Mobile-Menü.
 * Bewegliche Feiertage werden aus dem Ostersonntag berechnet – keine geratenen Daten.
 */

export interface PublicHoliday {
  /** ISO date YYYY-MM-DD in Europe/Berlin calendar sense */
  date: string;
  name: string;
}

/** Anonymous Gregorian algorithm → Easter Sunday as local calendar date. */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=March, 4=April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function iso(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function addDays(base: Date, days: number): { y: number; m: number; d: number } {
  const x = new Date(base.getFullYear(), base.getMonth(), base.getDate() + days);
  return { y: x.getFullYear(), m: x.getMonth() + 1, d: x.getDate() };
}

/** Gesetzliche Feiertage NRW für ein Kalenderjahr. */
export function nrwHolidaysForYear(year: number): PublicHoliday[] {
  const easter = easterSunday(year);
  const fri = addDays(easter, -2);
  const mon = addDays(easter, 1);
  const asc = addDays(easter, 39);
  const whit = addDays(easter, 50);
  const corpus = addDays(easter, 60);

  return [
    { date: iso(year, 1, 1), name: 'Neujahr' },
    { date: iso(fri.y, fri.m, fri.d), name: 'Karfreitag' },
    { date: iso(mon.y, mon.m, mon.d), name: 'Ostermontag' },
    { date: iso(year, 5, 1), name: 'Tag der Arbeit' },
    { date: iso(asc.y, asc.m, asc.d), name: 'Christi Himmelfahrt' },
    { date: iso(whit.y, whit.m, whit.d), name: 'Pfingstmontag' },
    { date: iso(corpus.y, corpus.m, corpus.d), name: 'Fronleichnam' },
    { date: iso(year, 10, 3), name: 'Tag der Deutschen Einheit' },
    { date: iso(year, 11, 1), name: 'Allerheiligen' },
    { date: iso(year, 12, 25), name: '1. Weihnachtstag' },
    { date: iso(year, 12, 26), name: '2. Weihnachtstag' },
  ];
}

const cache = new Map<number, PublicHoliday[]>();

export function holidaysAround(year: number): PublicHoliday[] {
  const years = [year - 1, year, year + 1];
  const out: PublicHoliday[] = [];
  for (const y of years) {
    if (!cache.has(y)) cache.set(y, nrwHolidaysForYear(y));
    out.push(...cache.get(y)!);
  }
  return out;
}

export function holidayOn(isoDate: string, year = Number(isoDate.slice(0, 4))): PublicHoliday | null {
  return holidaysAround(year).find((h) => h.date === isoDate) ?? null;
}
