import { openingHours, type OpeningPeriod } from '@/data/company';
import { holidayOn, holidaysAround, type PublicHoliday } from '@/data/holidays';
import {
  holidayOpenPolicy as defaultHolidayPolicy,
  manualOpenOverrides as defaultManual,
  specialOpenDays as defaultSpecial,
  type DayHours,
  type HolidayOpenPolicy,
  type ManualOpenOverride,
  type SpecialOpenDay,
} from '@/data/opening-overrides';

export type OpenReason = 'manual' | 'special' | 'holiday' | 'hours' | 'sunday' | 'outside';

/** Optional injection for tests / future admin payloads. */
export interface OpenPlanContext {
  manual?: ManualOpenOverride[];
  special?: SpecialOpenDay[];
  holidayPolicy?: HolidayOpenPolicy;
}

const defaultCtx = (): Required<OpenPlanContext> => ({
  manual: defaultManual,
  special: defaultSpecial,
  holidayPolicy: defaultHolidayPolicy,
});

export type OpenStatus =
  | {
      state: 'open';
      label: string;
      shortLabel: string;
      closesAt: string;
      todayLabel: string;
      holiday: null;
      reason: OpenReason;
    }
  | {
      state: 'closed';
      label: string;
      shortLabel: string;
      opensNext: string | null;
      todayLabel: string;
      holiday: PublicHoliday | null;
      reason: OpenReason;
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

function formatTodayHours(p: OpeningPeriod | undefined): string {
  if (!p) return 'Heute planmäßig geschlossen';
  return `Regulär heute: ${p.hours.map((h) => `${h.opens}–${h.closes}`).join(' · ')} Uhr`;
}

function formatOverrideHours(hours: DayHours): string {
  return hours.map((h) => `${h.opens}–${h.closes}`).join(' · ') + ' Uhr';
}

function addCalendarDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(y!, m! - 1, d! + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function weekdayIndexFromIso(isoDate: string): number {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y!, m! - 1, d!).getDay();
}

type DayPlan =
  | { kind: 'closed'; reason: OpenReason; label: string; holiday: PublicHoliday | null }
  | { kind: 'hours'; reason: OpenReason; hours: DayHours; label: string; holiday: PublicHoliday | null };

/**
 * Precedence: manual > special > holiday policy > weekly.
 */
export function resolveDayPlan(
  isoDate: string,
  weekdayName: string,
  year = Number(isoDate.slice(0, 4)),
  ctx: OpenPlanContext = {},
): DayPlan {
  const { manual, special, holidayPolicy } = { ...defaultCtx(), ...ctx };

  const manualHit = manual.find((o) => o.date === isoDate);
  if (manualHit) return planFromOverride(manualHit, 'manual');

  const specialHit = special.find((o) => o.date === isoDate);
  if (specialHit) return planFromOverride(specialHit, 'special');

  const holiday = holidayOn(isoDate, year);
  if (holiday && holidayPolicy === 'closed') {
    return {
      kind: 'closed',
      reason: 'holiday',
      label: holiday.name,
      holiday,
    };
  }

  const weekly = periodForDay(weekdayName);
  if (!weekly?.hours[0]) {
    return { kind: 'closed', reason: 'sunday', label: 'Planmäßig geschlossen', holiday };
  }
  return {
    kind: 'hours',
    reason: 'hours',
    hours: weekly.hours,
    label: formatTodayHours(weekly),
    holiday: holidayPolicy === 'weekly' ? holiday : null,
  };
}

function planFromOverride(o: ManualOpenOverride | SpecialOpenDay, reason: 'manual' | 'special'): DayPlan {
  if (o.closed || !o.hours?.length) {
    return { kind: 'closed', reason, label: o.label, holiday: null };
  }
  return { kind: 'hours', reason, hours: o.hours, label: o.label, holiday: null };
}

function nextOpenLabel(fromIso: string, fromMinutes: number, ctx: OpenPlanContext = {}): string | null {
  for (let offset = 0; offset < 14; offset++) {
    const iso = addCalendarDays(fromIso, offset);
    const dayIndex = weekdayIndexFromIso(iso);
    const day = dayNames[dayIndex]!;
    const plan = resolveDayPlan(iso, day, Number(iso.slice(0, 4)), ctx);
    if (plan.kind !== 'hours' || !plan.hours[0]) continue;

    if (offset === 0) {
      const later = plan.hours.find((h) => toMin(h.opens) > fromMinutes);
      if (later) return `öffnet heute um ${later.opens} Uhr`;
      continue;
    }

    const first = plan.hours[0];
    if (offset === 1) return `öffnet morgen um ${first.opens} Uhr`;
    const when = new Intl.DateTimeFormat('de-DE', { weekday: 'long', day: 'numeric', month: 'long' }).format(
      new Date(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10))),
    );
    return `öffnet am ${when} um ${first.opens} Uhr`;
  }
  return null;
}

export function computeOpenStatus(
  date = new Date(),
  _schedule: OpeningPeriod[] = openingHours,
  ctx: OpenPlanContext = {},
): OpenStatus {
  const now = berlinParts(date);
  const plan = resolveDayPlan(now.isoDate, now.day, now.year, ctx);
  const opensNext = nextOpenLabel(now.isoDate, now.minutes, ctx);

  if (plan.kind === 'closed') {
    if (plan.reason === 'holiday') {
      return {
        state: 'closed',
        reason: 'holiday',
        holiday: plan.holiday,
        opensNext,
        shortLabel: 'FEIERTAG · Geschlossen',
        todayLabel: `Heute Feiertag: ${plan.label} – wir haben geschlossen`,
        label: `Geschlossen wegen Feiertag: ${plan.label}`,
      };
    }
    if (plan.reason === 'manual' || plan.reason === 'special') {
      return {
        state: 'closed',
        reason: plan.reason,
        holiday: null,
        opensNext,
        shortLabel: 'Geschlossen',
        todayLabel: plan.label,
        label: plan.label,
      };
    }
    return {
      state: 'closed',
      reason: plan.reason,
      holiday: null,
      opensNext,
      shortLabel: 'Geschlossen',
      todayLabel: plan.label,
      label: 'Aktuell geschlossen',
    };
  }

  const openSlot = plan.hours.find((h) => now.minutes >= toMin(h.opens) && now.minutes < toMin(h.closes));
  if (openSlot) {
    const todayLabel =
      plan.reason === 'manual' || plan.reason === 'special'
        ? `${plan.label}: ${formatOverrideHours(plan.hours)}`
        : plan.label;
    return {
      state: 'open',
      reason: plan.reason,
      holiday: null,
      closesAt: openSlot.closes,
      shortLabel: 'Geöffnet',
      todayLabel,
      label: `Heute geöffnet · bis ${openSlot.closes} Uhr`,
    };
  }

  const reason: OpenReason =
    plan.reason === 'manual' || plan.reason === 'special'
      ? plan.reason
      : now.day === 'Sunday' || !periodForDay(now.day)
        ? 'sunday'
        : 'outside';

  return {
    state: 'closed',
    reason,
    holiday: null,
    opensNext,
    shortLabel: 'Geschlossen',
    todayLabel:
      plan.reason === 'manual' || plan.reason === 'special'
        ? `${plan.label}: ${formatOverrideHours(plan.hours)}`
        : plan.label,
    label: 'Aktuell geschlossen',
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

/** Inline-Boot: Wochenplan + Feiertage + Overrides + Policy. */
export function openingBootPayload(year = new Date().getFullYear()) {
  const { manual, special, holidayPolicy } = defaultCtx();
  return {
    schedule: schedulePayload(),
    holidays: holidaysAround(year)
      .concat(holidaysAround(year + 1))
      .filter((h, i, arr) => arr.findIndex((x) => x.date === h.date) === i),
    holidayPolicy,
    manual: manual.map((o) => ({
      date: o.date,
      closed: Boolean(o.closed || !o.hours?.length),
      hours: (o.hours ?? []).map((h) => [h.opens, h.closes] as [string, string]),
      label: o.label,
    })),
    special: special.map((o) => ({
      date: o.date,
      closed: Boolean(o.closed || !o.hours?.length),
      hours: (o.hours ?? []).map((h) => [h.opens, h.closes] as [string, string]),
      label: o.label,
    })),
  };
}

function formatHoursLabel(p: OpeningPeriod): string {
  return `${p.shortDays}: ${p.hours.map((h) => `${h.opens}–${h.closes}`).join(' · ')} Uhr`;
}
