import { ImapFlow } from 'imapflow';
import type { ImapCredentials } from '../types.js';
import { extractDomain, rootDomain } from '../matcher.js';

export interface ImapSenderHit {
  domain: string;
  rootDomain: string;
  hits: number;
  firstSeen: string;
  lastSeen: string;
  sampleSubjects: string[];
}

export interface ImapScanResult {
  ok: boolean;
  scanned: number;
  senders: ImapSenderHit[];
  error?: string;
}

export async function scanInbox(creds: ImapCredentials): Promise<ImapScanResult> {
  const client = new ImapFlow({
    host: creds.host,
    port: creds.port,
    secure: creds.tls,
    auth: { user: creds.user, pass: creds.pass },
    logger: false,
    tls: { rejectUnauthorized: false },
  });

  const senders = new Map<string, ImapSenderHit>();
  let scanned = 0;

  try {
    await client.connect();
    const lock = await client.getMailboxLock('INBOX');
    try {
      const daysBack = creds.daysBack ?? 1825;
      const since = new Date(Date.now() - daysBack * 86400_000);
      const uids = await client.search({ since }, { uid: true });
      if (!uids || uids.length === 0) {
        return { ok: true, scanned: 0, senders: [] };
      }
      for await (const msg of client.fetch(uids, { envelope: true, uid: true }, { uid: true })) {
        scanned++;
        const env = msg.envelope;
        const fromAddr = env?.from?.[0]?.address;
        if (!fromAddr) continue;
        const domain = extractDomain(fromAddr);
        if (!domain) continue;
        const root = rootDomain(domain);
        const key = root;
        const date = env?.date ? new Date(env.date).toISOString() : new Date().toISOString();
        const subject = (env?.subject ?? '').slice(0, 140);
        const existing = senders.get(key);
        if (existing) {
          existing.hits++;
          if (date < existing.firstSeen) existing.firstSeen = date;
          if (date > existing.lastSeen) existing.lastSeen = date;
          if (existing.sampleSubjects.length < 3 && subject && !existing.sampleSubjects.includes(subject)) {
            existing.sampleSubjects.push(subject);
          }
        } else {
          senders.set(key, {
            domain,
            rootDomain: root,
            hits: 1,
            firstSeen: date,
            lastSeen: date,
            sampleSubjects: subject ? [subject] : [],
          });
        }
      }
    } finally {
      lock.release();
    }
    await client.logout();
    return {
      ok: true,
      scanned,
      senders: [...senders.values()].sort((a, b) => b.hits - a.hits),
    };
  } catch (err) {
    try { await client.logout(); } catch { /* already closed */ }
    return { ok: false, scanned, senders: [], error: (err as Error).message };
  }
}
