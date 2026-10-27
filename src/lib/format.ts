const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
const int = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
const dec2 = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatPrice = (value: number): string => eur.format(value);
export const formatInt = (value: number): string => int.format(value);
export const formatKm = (value: number): string => `${int.format(value)} km`;
export const formatLength = (mm: number): string => `${dec2.format(mm / 1000)} m`;
export const formatWeight = (kg: number): string => `${int.format(kg)} kg`;

export function formatDateDE(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}
