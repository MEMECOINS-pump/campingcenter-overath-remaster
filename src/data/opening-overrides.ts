/**
 * Konfigurierbare Öffnungs-Overrides (Europa/Berlin Kalendertag).
 * Precedence in opening-hours.ts:
 *   1. manual (temporär erzwungen)
 *   2. specialDays (einzelne Daten)
 *   3. holidayPolicy bei NRW-Feiertagen
 *   4. weekly openingHours
 *
 * Keine erfundenen Sonderöffnungen — Liste bewusst leer, bis Betrieb freigibt.
 */

export type DayHours = { opens: string; closes: string }[];

/** Temporäre manuelle Steuerung (z. B. Betriebsfeier, Notfall). */
export interface ManualOpenOverride {
  /** ISO-Datum YYYY-MM-DD — Override gilt nur an diesem Kalendertag (Berlin). */
  date: string;
  /** Geschlossen erzwingen */
  closed?: boolean;
  /** Alternative Stunden (nur wenn nicht closed) */
  hours?: DayHours;
  /** Kurzlabel für UI */
  label: string;
}

/** Einmalige Sondertage (Inventur, verkürzter Samstag, …). */
export interface SpecialOpenDay {
  date: string;
  closed?: boolean;
  hours?: DayHours;
  label: string;
}

/**
 * Verhalten an gesetzlichen NRW-Feiertagen, wenn kein Manual/Special greift.
 * - closed: ganztägig geschlossen (Standard / authentisch für Overath)
 * - weekly: Feiertag ignorieren und Wochenplan nutzen (nur nach expliziter Freigabe)
 */
export type HolidayOpenPolicy = 'closed' | 'weekly';

export const holidayOpenPolicy: HolidayOpenPolicy = 'closed';

/** Manuelle Tages-Overrides — leer bis freigegeben. */
export const manualOpenOverrides: ManualOpenOverride[] = [];

/** Sondertage — leer bis freigegeben. */
export const specialOpenDays: SpecialOpenDay[] = [];

export function manualOverrideOn(isoDate: string): ManualOpenOverride | null {
  return manualOpenOverrides.find((o) => o.date === isoDate) ?? null;
}

export function specialDayOn(isoDate: string): SpecialOpenDay | null {
  return specialOpenDays.find((o) => o.date === isoDate) ?? null;
}
