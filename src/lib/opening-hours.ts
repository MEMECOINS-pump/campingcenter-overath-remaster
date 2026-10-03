import { openingHours, type OpeningPeriod } from '@/data/company';

export type OpenStatus =
  | { state: 'open'; label: string; closesAt: string; todayLabel: string }
  | { state: 'closed'; label: string; opensNext: string | null; todayLabel: string };

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function berlinNow(date = new Date()): { day: string; minutes: number; dayIndex: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Berlin',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const day = get('weekday') || dayNames[date.getDay()]!;
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')), dayIndex: dayNames.indexOf(day) };
}

const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));

function periodForDay(day: string, schedule: OpeningPeriod[] = openingHours): OpeningPeriod | undefined {
  return schedule.find((p) => p.schemaDays.includes(day));
}

function formatToday(p: OpeningPeriod | undefined): string {
  if (!p) return 'Heute geschlossen';
  return `Heute: ${p.hours.map((h) => `${h.opens}–${h.closes}`).join(' · ')} Uhr`;
}

function nextOpenLabel(from: { dayIndex: number; minutes: number }, schedule: OpeningPeriod[] = openingHours): string | null {
  for (let offset = 0; offset < 7; offset++) {
    const idx = (from.dayIndex + offset) % 7;
    const day = dayNames[idx]!;
    const period = periodForDay(day, schedule);
    if (!period) continue;
    const first = period.hours[0];
    if (!first) continue;
    if (offset === 0) {
      const later = period.hours.find((h) => toMin(h.opens) > from.minutes);
      if (later) return `öffnet heute um ${later.opens} Uhr`;
      continue;
    }
    const when = offset === 1 ? 'morgen' : period.shortDays;
    return `öffnet ${when} um ${first.opens} Uhr`;
  }
  return null;
}

export function computeOpenStatus(date = new Date(), schedule: OpeningPeriod[] = openingHours): OpenStatus {
  const now = berlinNow(date);
  const today = periodForDay(now.day, schedule);
  const todayLabel = formatToday(today);
  const openSlot = today?.hours.find((h) => now.minutes >= toMin(h.opens) && now.minutes < toMin(h.closes));
  if (openSlot) {
    return {
      state: 'open',
      closesAt: openSlot.closes,
      todayLabel,
      label: `Heute geöffnet · bis ${openSlot.closes} Uhr`,
    };
  }
  const opensNext = nextOpenLabel(now, schedule);
  return {
    state: 'closed',
    todayLabel,
    opensNext,
    label: opensNext ? `Aktuell geschlossen · ${opensNext}` : 'Aktuell geschlossen',
  };
}

export function schedulePayload(schedule: OpeningPeriod[] = openingHours) {
  return schedule.flatMap((p) => p.schemaDays.map((d) => ({ d, h: p.hours.map((h) => [h.opens, h.closes] as [string, string]), short: p.shortDays, label: formatHoursLabel(p) })));
}

function formatHoursLabel(p: OpeningPeriod): string {
  return `${p.shortDays}: ${p.hours.map((h) => `${h.opens}–${h.closes}`).join(' · ')} Uhr`;
}
