import type { Env } from './types';

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
}

/**
 * Sends mail via SMTP using Cloudflare's socket-less HTTPS mail APIs when configured,
 * or a simple authenticated SMTP-over-HTTPS relay pattern.
 *
 * Preferred: set MAIL_HOST to a transactional HTTPS endpoint that accepts JSON
 * `{ to, subject, text, from }` with Basic auth (MAIL_USER / MAIL_PASSWORD),
 * e.g. a company relay or Resend-compatible bridge.
 *
 * Without mail config: returns `{ queued: true }` and callers persist the payload –
 * nothing is lost; the 12h reporter will retry.
 */
export async function sendMail(env: Env, msg: MailMessage): Promise<{ ok: boolean; queued: boolean; error?: string }> {
  const host = env.MAIL_HOST?.trim();
  const from = env.MAIL_FROM?.trim() || 'noreply@ccoverath.de';
  if (!host) {
    return { ok: true, queued: true };
  }

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (env.MAIL_USER && env.MAIL_PASSWORD) {
      headers.Authorization = `Basic ${btoa(`${env.MAIL_USER}:${env.MAIL_PASSWORD}`)}`;
    }
    const res = await fetch(host, {
      method: 'POST',
      headers,
      body: JSON.stringify({ from, to: msg.to, subject: msg.subject, text: msg.text }),
    });
    if (!res.ok) {
      return { ok: false, queued: false, error: `mail HTTP ${res.status}` };
    }
    return { ok: true, queued: false };
  } catch (err) {
    return { ok: false, queued: false, error: err instanceof Error ? err.message : 'mail failure' };
  }
}

export function formatFinderReport(leads: {
  name: string;
  email: string;
  phone: string;
  answers: Record<string, unknown>;
  recommendedVehicleIds: string[];
  createdAt: string;
  id: string;
}[]): { subject: string; text: string } {
  const subject = `[AUSWERTUNG] Camping Finder – ${leads.length} Kundenanfrage${leads.length === 1 ? '' : 'n'}`;
  const blocks = leads.map((l, i) => {
    const a = l.answers;
    return [
      `# Anfrage ${i + 1}`,
      `ID: ${l.id}`,
      `Zeit: ${l.createdAt}`,
      '',
      'Kunde:',
      `Name: ${l.name}`,
      `E-Mail: ${l.email}`,
      `Telefon: ${l.phone}`,
      '',
      'Anforderungen:',
      `Personen: ${a.persons ?? '–'}`,
      `Sitzplätze: ${a.seats ?? '–'}`,
      `Schlafplätze: ${a.sleeps ?? '–'}`,
      `Bettform: ${a.bedType ?? '–'}`,
      `Mindest-Bettlänge: ${a.bedLength ?? '–'}`,
      `Max. Fahrzeuglänge: ${a.lengthMax ?? '–'}`,
      `Budget: ${a.budget ?? '–'}`,
      `Zustand: ${a.condition ?? '–'}`,
      `Getriebe: ${a.transmission ?? '–'}`,
      '',
      'Empfehlungen (IDs):',
      ...(l.recommendedVehicleIds.length ? l.recommendedVehicleIds.map((id) => `- ${id}`) : ['– keine exakte Empfehlung']),
    ].join('\n');
  });
  return {
    subject,
    text: [`[AUSWERTUNG] Camping Finder`, `Anzahl: ${leads.length}`, '', ...blocks].join('\n'),
  };
}
