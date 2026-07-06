import express from 'express';
import path from 'node:path';
import { z } from 'zod';
import { config } from './config.js';
import { fetchExposures } from './sources/xposedornot.js';
import { sendGdprRequest } from './sources/smtp.js';
import { detectMailConfig } from './sources/autoconfig.js';
import { detectCredentials, launchBridge } from './sources/credentials.js';
import { scanInbox } from './sources/imap.js';
import { buildGdprMailto } from './gdpr.js';
import { CURATED_SERVICES, findServiceByDomain } from './services.js';
import { rootDomain } from './matcher.js';
import type { GdprRequestResult } from './types.js';

const publicDir = process.env.PUBLIC_DIR ?? path.resolve(process.cwd(), 'public');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(publicDir));

const ExposureSchema = z.object({
  email: z.string().email(),
  imap: z
    .object({
      host: z.string().min(1),
      port: z.number().int().min(1).max(65535),
      user: z.string().min(1),
      pass: z.string().min(1),
      tls: z.boolean().default(false),
      daysBack: z.number().int().min(1).max(3650).default(1825),
    })
    .optional(),
});
const GdprSendSchema = z.object({
  serviceId: z.string(),
  email: z.string().email(),
  smtpHost: z.string().min(1).optional(),
  smtpPort: z.number().int().min(1).max(65535).optional(),
  smtpUser: z.string().min(1).optional(),
  smtpPass: z.string().min(1).optional(),
  smtpTls: z.boolean().optional(),
});
const GdprMailtoSchema = z.object({ serviceId: z.string(), email: z.string().email() });
const ServicesSchema = z.object({ ids: z.array(z.string()) });

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    xposedornotAvailable: true,
    smtpConfigured: Boolean(config.smtp?.host && config.smtp?.user && config.smtp?.pass),
  });
});

app.post('/api/expose', async (req, res) => {
  const parsed = ExposureSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Requête invalide', details: parsed.error.issues });
  }
  const { email, imap } = parsed.data;

  const [rawExposures, imapResult] = await Promise.all([
    fetchExposures(email),
    imap ? scanInbox(imap) : Promise.resolve({ ok: false, scanned: 0, senders: [], error: 'IMAP non fourni' }),
  ]);

  const exposures = rawExposures.exposures.map((e) => {
    const matched = findServiceByDomain(e.domain);
    return {
      name: e.name ?? matched?.name ?? 'Inconnu',
      title: e.title ?? matched?.name ?? 'Inconnu',
      domain: e.domain,
      breachDate: e.breachDate,
      dataClasses: e.dataClasses,
      serviceId: matched?.id ?? null,
    };
  });

  const accountsMap = new Map<string, {
    service: ReturnType<typeof findServiceByDomain>;
    matchedDomain: string;
    hits: number;
    firstSeen?: string;
    lastSeen?: string;
    sampleSubjects: string[];
  }>();
  for (const s of imapResult.senders) {
    const service = findServiceByDomain(s.rootDomain) ?? findServiceByDomain(s.domain);
    const key = service ? service.id : s.rootDomain;
    const existing = accountsMap.get(key);
    if (existing) {
      existing.hits += s.hits;
      existing.sampleSubjects = [...new Set([...existing.sampleSubjects, ...s.sampleSubjects])].slice(0, 3);
      if (!existing.firstSeen || s.firstSeen < existing.firstSeen) existing.firstSeen = s.firstSeen;
      if (!existing.lastSeen || s.lastSeen > existing.lastSeen) existing.lastSeen = s.lastSeen;
    } else {
      accountsMap.set(key, {
        service,
        matchedDomain: s.rootDomain,
        hits: s.hits,
        firstSeen: s.firstSeen,
        lastSeen: s.lastSeen,
        sampleSubjects: s.sampleSubjects,
      });
    }
  }
  for (const exp of exposures) {
    if (!exp.domain) continue;
    const service = findServiceByDomain(exp.domain);
    const key = service ? service.id : rootDomain(exp.domain);
    if (!accountsMap.has(key)) {
      accountsMap.set(key, {
        service,
        matchedDomain: rootDomain(exp.domain),
        hits: 0,
        sampleSubjects: [`Brèche : ${exp.title}`],
      });
    }
  }
  const all = [...accountsMap.values()];
  const accounts = all.filter((a) => a.service !== null).sort((a, b) => b.hits - a.hits);
  const unknown = all.filter((a) => a.service === null).sort((a, b) => b.hits - a.hits);

  res.json({
    ok: true,
    exposures,
    accounts,
    unknown,
    imap: { ok: imapResult.ok, scanned: imapResult.scanned, error: imapResult.error },
    exposureSource: { ok: rawExposures.ok, error: rawExposures.error },
  });
});

app.post('/api/send-gdpr', async (req, res) => {
  const parsed = GdprSendSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Requête invalide', details: parsed.error.issues });
  }
  const { serviceId, email, smtpHost, smtpPort, smtpUser, smtpPass, smtpTls } = parsed.data;

  const service = CURATED_SERVICES.find((s) => s.id === serviceId);
  if (!service) return res.status(404).json({ error: 'Service inconnu' });

  const smtp = {
    host: smtpHost ?? config.smtp.host,
    port: smtpPort ?? config.smtp.port,
    user: smtpUser ?? config.smtp.user,
    pass: smtpPass ?? config.smtp.pass,
    tls: smtpTls ?? config.smtp.tls,
  };

  if (!smtp.host || !smtp.user || !smtp.pass) {
    return res.status(400).json({ error: 'SMTP non configuré : fournissez smtpHost/smtpUser/smtpPass ou remplissez .env' });
  }

  const result = await sendGdprRequest(service, email, smtp);
  res.json(result);
});

app.post('/api/gdpr-mailto', (req, res) => {
  const parsed = GdprMailtoSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Requête invalide' });
  const service = CURATED_SERVICES.find((s) => s.id === parsed.data.serviceId);
  if (!service) return res.status(404).json({ error: 'Service inconnu' });
  res.json({ mailto: buildGdprMailto(service, parsed.data.email) });
});

app.post('/api/launch-bridge', async (_req, res) => {
  const result = await launchBridge();
  res.json(result);
});

app.get('/api/credentials-detect', async (req, res) => {
  const email = String(req.query.email ?? '').trim();
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email manquant ou invalide' });
  }
  const result = await detectCredentials(email);
  res.json(result);
});

app.get('/api/autoconfig', async (req, res) => {
  const email = String(req.query.email ?? '').trim();
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email manquant ou invalide' });
  }
  const result = await detectMailConfig(email);
  res.json(result);
});

app.post('/api/services', (req, res) => {
  const parsed = ServicesSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Requête invalide' });
  }
  const requested = new Set(parsed.data.ids);
  const matched = CURATED_SERVICES.filter((s) => requested.has(s.id));
  res.json({ services: matched });
});

const server = app.listen(config.port, () => {
  console.log(`\n┌─ Identity Scanner ──────────────────────────`);
  console.log(`│  App     : http://localhost:${config.port}/`);
  console.log(`│  Health  : http://localhost:${config.port}/api/health`);
  console.log(`│  Xposed  : Disponible (public API)`);
  console.log(`│  SMTP    : ${config.smtp?.host ? 'configuré' : 'non configuré'}`);
  console.log(`└─────────────────────────────────────────────\n`);
});

export { app, server };
