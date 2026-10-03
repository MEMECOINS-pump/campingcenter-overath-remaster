import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env, FinderLead } from './types';
import { getActiveVehicles, runVehicleSync } from './sync';
import { formatFinderReport, sendMail } from './mail';
import { getJson, putJson, rateLimit, KEYS } from './store';
import { assistWorkshop } from './workshop-ai';

const app = new Hono<{ Bindings: Env }>();

app.use('*', async (c, next) => {
  const origins = (c.env.CORS_ORIGINS || `${c.env.PUBLIC_SITE_ORIGIN},http://localhost:4321,http://127.0.0.1:4321`)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const corsMw = cors({
    origin: (origin) => (origin && origins.includes(origin) ? origin : origins[0] ?? '*'),
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    maxAge: 86400,
  });
  return corsMw(c, next);
});

app.get('/api/health', (c) => c.json({ ok: true, service: 'cco-api' }));

app.get('/api/vehicles', async (c) => {
  const vehicles = await getActiveVehicles(c.env);
  return c.json({
    source: 'normalized-cache',
    count: vehicles.length,
    lastSuccessfulSyncAt: await getJson<string>(c.env, KEYS.lastSuccessfulSync),
    vehicles,
  });
});

app.get('/api/vehicles/:id', async (c) => {
  const id = c.req.param('id');
  const vehicles = await getActiveVehicles(c.env);
  const vehicle = vehicles.find((v) => v.internalVehicleId === id || v.sourceVehicleId === id || v.slug === id);
  if (!vehicle) return c.json({ error: 'not_found' }, 404);
  return c.json({ vehicle });
});

app.post('/api/sync/vehicles', async (c) => {
  const log = await runVehicleSync(c.env);
  return c.json(log, log.success ? 200 : 503);
});

app.get('/api/sync/logs', async (c) => {
  // Internal diagnostics – no PII. Do not link publicly in the frontend.
  const logs = (await getJson(c.env, KEYS.syncLogs)) ?? [];
  return c.json({ logs });
});

app.post('/api/camping-finder', async (c) => {
  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'anon';
  if (!(await rateLimit(c.env, ip, 'finder', 8, 3600))) return c.json({ error: 'rate_limited' }, 429);

  const body = await c.req.json<Record<string, unknown>>().catch(() => null);
  if (!body) return c.json({ error: 'invalid_json' }, 400);

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const consent = Boolean(body.consent);
  if (!name || !email || !phone || !consent) return c.json({ error: 'validation' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return c.json({ error: 'email' }, 400);

  const lead: FinderLead = {
    id: `finder_${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
    reportStatus: 'pending',
    reportedAt: null,
    retryCount: 0,
    lastError: null,
    name,
    email,
    phone,
    answers: (body.answers as Record<string, unknown>) ?? {},
    recommendedVehicleIds: Array.isArray(body.recommendedVehicleIds)
      ? body.recommendedVehicleIds.map(String).slice(0, 12)
      : [],
    sourcePage: String(body.sourcePage ?? '/camper-finder/'),
  };

  const leads = (await getJson<FinderLead[]>(c.env, KEYS.finderLeads)) ?? [];
  leads.push(lead);
  await putJson(c.env, KEYS.finderLeads, leads);
  return c.json({ ok: true, id: lead.id, reportStatus: lead.reportStatus });
});

app.post('/api/rental-inquiry', async (c) => {
  const ip = c.req.header('cf-connecting-ip') || 'anon';
  if (!(await rateLimit(c.env, ip, 'rental', 8, 3600))) return c.json({ error: 'rate_limited' }, 429);
  const body = await c.req.json<Record<string, unknown>>().catch(() => null);
  if (!body) return c.json({ error: 'invalid_json' }, 400);

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const consent = Boolean(body.consent);
  const adacMember = String(body.adacMember ?? '') === 'ja';
  const adacNumber = String(body.adacNumber ?? '').trim();
  if (!name || !email || !phone || !consent) return c.json({ error: 'validation' }, 400);

  const text = [
    'Neue Vermietungsanfrage – Campingcenter Overath',
    '',
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Telefon: ${phone}`,
    `Reisezeitraum: ${String(body.period ?? '–')}`,
    `Reisende: ${String(body.travelers ?? '–')}`,
    `ADAC-Mitglied: ${adacMember ? 'Ja' : 'Nein'}`,
    `Mitgliedsnummer: ${adacMember ? adacNumber || 'nicht angegeben' : '–'}`,
    '',
    'Nachricht:',
    String(body.message ?? '–'),
  ].join('\n');

  const mail = await sendMail(c.env, {
    to: c.env.RENTAL_MAIL_TO || 'vermietung@ccoverath.de',
    subject: 'Neue Vermietungsanfrage – Campingcenter Overath',
    text,
  });

  const stored = (await getJson<unknown[]>(c.env, KEYS.rentalLeads)) ?? [];
  stored.push({
    id: `rental_${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
    name,
    email,
    phone,
    adacMember,
    // store number server-side only
    adacNumber: adacMember ? adacNumber || null : null,
    period: body.period ?? null,
    travelers: body.travelers ?? null,
    message: body.message ?? null,
    mailed: mail.ok && !mail.queued,
    queued: mail.queued,
  });
  await putJson(c.env, KEYS.rentalLeads, stored);
  return c.json({ ok: true, mailed: mail.ok && !mail.queued, queued: mail.queued });
});

app.post('/api/workshop-assistant', async (c) => {
  const ip = c.req.header('cf-connecting-ip') || 'anon';
  if (!(await rateLimit(c.env, ip, 'ws-ai', 30, 3600))) return c.json({ error: 'rate_limited' }, 429);
  const body = await c.req.json<Record<string, unknown>>().catch(() => null);
  if (!body || !String(body.message ?? '').trim()) return c.json({ error: 'validation' }, 400);

  const result = await assistWorkshop(c.env, {
    message: String(body.message),
    vehicleMake: body.vehicleMake ? String(body.vehicleMake) : undefined,
    vehicleModel: body.vehicleModel ? String(body.vehicleModel) : undefined,
    modelYear: body.modelYear ? String(body.modelYear) : undefined,
    faultCode: body.faultCode ? String(body.faultCode) : undefined,
    since: body.since ? String(body.since) : undefined,
  });
  return c.json(result);
});

app.post('/api/workshop-request', async (c) => {
  const ip = c.req.header('cf-connecting-ip') || 'anon';
  if (!(await rateLimit(c.env, ip, 'ws-req', 8, 3600))) return c.json({ error: 'rate_limited' }, 429);
  const body = await c.req.json<Record<string, unknown>>().catch(() => null);
  if (!body) return c.json({ error: 'invalid_json' }, 400);
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const consent = Boolean(body.consent);
  if (!name || !email || !phone || !consent) return c.json({ error: 'validation' }, 400);

  const text = [
    'Werkstatt-Anfrage – Campingcenter Overath',
    '',
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Telefon: ${phone}`,
    `Kategorie: ${String(body.categoryLabel ?? body.category ?? '–')}`,
    '',
    'Zusammenfassung:',
    String(body.summary ?? '–'),
    '',
    'Details:',
    String(body.details ?? '–'),
  ].join('\n');

  const mail = await sendMail(c.env, {
    to: c.env.WORKSHOP_MAIL_TO || 'service@ccoverath.de',
    subject: 'Werkstatt-Anfrage – Campingcenter Overath',
    text,
  });

  const stored = (await getJson<unknown[]>(c.env, KEYS.workshopLeads)) ?? [];
  stored.push({ id: `ws_${crypto.randomUUID()}`, createdAt: new Date().toISOString(), name, email, phone, body, mail });
  await putJson(c.env, KEYS.workshopLeads, stored);
  return c.json({ ok: true, mailed: mail.ok && !mail.queued, queued: mail.queued });
});

app.post('/api/lastrada/inquiry', async (c) => {
  const ip = c.req.header('cf-connecting-ip') || 'anon';
  if (!(await rateLimit(c.env, ip, 'lastrada', 8, 3600))) return c.json({ error: 'rate_limited' }, 429);
  const body = await c.req.json<Record<string, unknown>>().catch(() => null);
  if (!body) return c.json({ error: 'invalid_json' }, 400);
  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const consent = Boolean(body.consent);
  if (!name || !email || !phone || !consent) return c.json({ error: 'validation' }, 400);

  const text = [
    'La Strada Konfiguration – Anfrage',
    '',
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Telefon: ${phone}`,
    `Modell: ${String(body.model ?? '–')}`,
    `Konfigurations-ID: ${String(body.configurationId ?? '–')}`,
    `Optionen: ${String(body.options ?? '–')}`,
    '',
    'Nachricht:',
    String(body.message ?? '–'),
    '',
    'Hinweis: Angaben ohne verbindliche Preiszusage.',
  ].join('\n');

  const mail = await sendMail(c.env, {
    to: c.env.WORKSHOP_MAIL_TO || 'service@ccoverath.de',
    subject: 'La Strada Konfiguration – Persönliches Angebot anfragen',
    text,
  });
  return c.json({ ok: true, mailed: mail.ok && !mail.queued, queued: mail.queued });
});

/** 12-hour reporting workflow for Camping Finder evaluations. */
export async function processFinderReports(env: Env): Promise<{ sent: number; failed: number }> {
  const leads = (await getJson<FinderLead[]>(env, KEYS.finderLeads)) ?? [];
  const pending = leads.filter((l) => l.reportStatus === 'pending' || (l.reportStatus === 'failed' && l.retryCount < 5));
  if (!pending.length) return { sent: 0, failed: 0 };

  const report = formatFinderReport(pending);
  const mail = await sendMail(env, { to: env.FINDER_REPORT_TO || 'martin_meinke@ccoverath.de', ...report });
  const now = new Date().toISOString();
  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    if (!pending.some((p) => p.id === lead.id)) continue;
    if (mail.ok && !mail.queued) {
      lead.reportStatus = 'reported';
      lead.reportedAt = now;
      lead.lastError = null;
      sent += 1;
    } else if (mail.queued) {
      // Keep pending – will send when mail is configured.
      lead.lastError = 'mail_not_configured_queued';
    } else {
      lead.reportStatus = 'failed';
      lead.retryCount += 1;
      lead.lastError = mail.error ?? 'send_failed';
      failed += 1;
    }
  }
  await putJson(env, KEYS.finderLeads, leads);
  return { sent, failed };
}

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    // Every 6h: vehicle sync. Every 12h (and also on :00 of 12h slots): finder reports.
    ctx.waitUntil(
      (async () => {
        await runVehicleSync(env);
        const hour = new Date(event.scheduledTime).getUTCHours();
        if (hour % 12 === 0) await processFinderReports(env);
      })(),
    );
  },
};
