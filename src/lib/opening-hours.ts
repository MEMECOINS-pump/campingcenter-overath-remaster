import { openingHours, type OpeningPeriod } from '@/data/company';
import { holidayOn, type PublicHoliday } from '@/data/holidays';
import type { Locale } from '@/i18n';

export type OpenStatus =
  | {
      state: 'open';
      label: string;
      shortLabel: string;
      closesAt: string;
      todayLabel: string;
      holiday: null;
      reason: 'hours';
    }
  | {
      state: 'closed';
      label: string;
      shortLabel: string;
      opensNext: string | null;
      todayLabel: string;
      holiday: PublicHoliday | null;
      reason: 'holiday' | 'hours' | 'sunday' | 'outside';
    };

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function berlinParts(date = new Date()): {
  day: string;
  minutes: number;
  dayIndex: number;
  isoDate: string;
  year: number;
} {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const year = Number(get('year'));
  const month = get('month');
  const dayNum = get('day');
  const day = get('weekday') || dayNames[date.getDay()]!;
  return {
    day,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
    dayIndex: dayNames.indexOf(day),
    isoDate: `${year}-${month}-${dayNum}`,
    year,
  };
}

/** @deprecated use berlinParts */
export const berlinNow = (date = new Date()) => {
  const p = berlinParts(date);
  return { day: p.day, minutes: p.minutes, dayIndex: p.dayIndex };
};

const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));

function periodForDay(day: string, schedule: OpeningPeriod[] = openingHours): OpeningPeriod | undefined {
  return schedule.find((p) => p.schemaDays.includes(day));
}

function formatTodayHours(p: OpeningPeriod | undefined, lang: Locale): string {
  if (!p) return lang === 'en' ? 'Normally closed today' : 'Heute planmäßig geschlossen';
  const hours = p.hours.map((h) => `${h.opens}–${h.closes}`).join(' · ');
  return lang === 'en' ? `Usual hours today: ${hours}` : `Regulär heute: ${hours} Uhr`;
}

function addCalendarDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(y!, m! - 1, d! + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function weekdayIndexFromIso(isoDate: string): number {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y!, m! - 1, d!).getDay(); // 0=Sun … local, but we built from Y-M-D as civil date
}

function nextOpenLabel(
  fromIso: string,
  fromMinutes: number,
  schedule: OpeningPeriod[] = openingHours,
  lang: Locale = 'de',
): string | null {
  for (let offset = 0; offset < 14; offset++) {
    const iso = addCalendarDays(fromIso, offset);
    const hol = holidayOn(iso);
    if (hol) continue;

    const dayIndex = weekdayIndexFromIso(iso); // 0 Sun
    const day = dayNames[dayIndex]!;
    const period = periodForDay(day, schedule);
    if (!period?.hours[0]) continue;

    if (offset === 0) {
      const later = period.hours.find((h) => toMin(h.opens) > fromMinutes);
      if (later) {
        return lang === 'en' ? `opens today at ${later.opens}` : `öffnet heute um ${later.opens} Uhr`;
      }
      continue;
    }

    const first = period.hours[0];
    if (offset === 1) {
      return lang === 'en' ? `opens tomorrow at ${first.opens}` : `öffnet morgen um ${first.opens} Uhr`;
    }
    const when = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'de-DE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(new Date(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10))));
    return lang === 'en' ? `opens ${when} at ${first.opens}` : `öffnet am ${when} um ${first.opens} Uhr`;
  }
  return null;
}

export function computeOpenStatus(
  date = new Date(),
  schedule: OpeningPeriod[] = openingHours,
  lang: Locale = 'de',
): OpenStatus {
  const now = berlinParts(date);
  const holiday = holidayOn(now.isoDate, now.year);
  const today = periodForDay(now.day, schedule);
  const opensNext = nextOpenLabel(now.isoDate, now.minutes, schedule, lang);

  if (holiday) {
    return {
      state: 'closed',
      reason: 'holiday',
      holiday,
      opensNext,
      shortLabel: lang === 'en' ? 'HOLIDAY · Closed' : 'FEIERTAG · Geschlossen',
      todayLabel:
        lang === 'en'
          ? `Public holiday today: ${holiday.name} – we are closed`
          : `Heute Feiertag: ${holiday.name} – wir haben geschlossen`,
      label:
        lang === 'en'
          ? `Closed for public holiday: ${holiday.name}`
          : `Geschlossen wegen Feiertag: ${holiday.name}`,
    };
  }

  const openSlot = today?.hours.find((h) => now.minutes >= toMin(h.opens) && now.minutes < toMin(h.closes));
  if (openSlot) {
    return {
      state: 'open',
      reason: 'hours',
      holiday: null,
      closesAt: openSlot.closes,
      shortLabel: lang === 'en' ? 'Open' : 'Geöffnet',
      todayLabel: formatTodayHours(today, lang),
      label:
        lang === 'en'
          ? `Open today · until ${openSlot.closes}`
          : `Heute geöffnet · bis ${openSlot.closes} Uhr`,
    };
  }

  const reason: 'sunday' | 'outside' | 'hours' = now.day === 'Sunday' || !today ? 'sunday' : 'outside';
  return {
    state: 'closed',
    reason,
    holiday: null,
    opensNext,
    shortLabel: lang === 'en' ? 'Closed' : 'Geschlossen',
    todayLabel: formatTodayHours(today, lang),
    // opensNext belongs only in the secondary line (data-oh-sub) — never duplicate in label
    label: lang === 'en' ? 'Currently closed' : 'Aktuell geschlossen',
  };
}

export function schedulePayload(schedule: OpeningPeriod[] = openingHours) {
  return schedule.flatMap((p) =>
    p.schemaDays.map((d) => ({
      d,
      h: p.hours.map((h) => [h.opens, h.closes] as [string, string]),
      short: p.shortDays,
      label: formatHoursLabel(p),
    })),
  );
}

function formatHoursLabel(p: OpeningPeriod): string {
  return `${p.shortDays}: ${p.hours.map((h) => `${h.opens}–${h.closes}`).join(' · ')} Uhr`;
}

/** Companion / badge strings for a given open status + locale. */
export function companionOpenCopy(status: OpenStatus, lang: Locale): string {
  if (status.reason === 'holiday') {
    return lang === 'en' ? 'Public holiday · Closed' : 'Feiertag · Geschlossen';
  }
  if (status.state === 'open') return lang === 'en' ? 'Open now' : 'Jetzt geöffnet';
  return lang === 'en' ? 'Currently closed' : 'Aktuell geschlossen';
}
