export interface MailServerConfig {
  host: string;
  port: number;
  tls: boolean;
}

export interface AutoConfigResult {
  ok: boolean;
  provider: string;
  imap: MailServerConfig | null;
  smtp: MailServerConfig | null;
  needsBridge: boolean;
  bridgeHint?: string;
  source: 'protonmail-bridge' | 'thunderbird-ispdb' | 'hardcoded' | 'guessed';
  error?: string;
}

const HARDCODED: Record<string, { provider: string; imap: MailServerConfig; smtp: MailServerConfig }> = {
  'gmail.com': {
    provider: 'Gmail',
    imap: { host: 'imap.gmail.com', port: 993, tls: true },
    smtp: { host: 'smtp.gmail.com', port: 587, tls: false },
  },
  'googlemail.com': {
    provider: 'Gmail',
    imap: { host: 'imap.gmail.com', port: 993, tls: true },
    smtp: { host: 'smtp.gmail.com', port: 587, tls: false },
  },
  'outlook.com': {
    provider: 'Outlook',
    imap: { host: 'outlook.office365.com', port: 993, tls: true },
    smtp: { host: 'smtp-mail.outlook.com', port: 587, tls: false },
  },
  'hotmail.com': {
    provider: 'Outlook',
    imap: { host: 'outlook.office365.com', port: 993, tls: true },
    smtp: { host: 'smtp-mail.outlook.com', port: 587, tls: false },
  },
  'live.com': {
    provider: 'Outlook',
    imap: { host: 'outlook.office365.com', port: 993, tls: true },
    smtp: { host: 'smtp-mail.outlook.com', port: 587, tls: false },
  },
  'yahoo.com': {
    provider: 'Yahoo',
    imap: { host: 'imap.mail.yahoo.com', port: 993, tls: true },
    smtp: { host: 'smtp.mail.yahoo.com', port: 587, tls: false },
  },
  'yahoo.fr': {
    provider: 'Yahoo',
    imap: { host: 'imap.mail.yahoo.com', port: 993, tls: true },
    smtp: { host: 'smtp.mail.yahoo.com', port: 587, tls: false },
  },
  'icloud.com': {
    provider: 'iCloud',
    imap: { host: 'imap.mail.me.com', port: 993, tls: true },
    smtp: { host: 'smtp.mail.me.com', port: 587, tls: false },
  },
  'me.com': {
    provider: 'iCloud',
    imap: { host: 'imap.mail.me.com', port: 993, tls: true },
    smtp: { host: 'smtp.mail.me.com', port: 587, tls: false },
  },
  'aol.com': {
    provider: 'AOL',
    imap: { host: 'imap.aol.com', port: 993, tls: true },
    smtp: { host: 'smtp.aol.com', port: 587, tls: false },
  },
  'orange.fr': {
    provider: 'Orange',
    imap: { host: 'imap.orange.fr', port: 993, tls: true },
    smtp: { host: 'smtp.orange.fr', port: 465, tls: true },
  },
  'wanadoo.fr': {
    provider: 'Orange (Wanadoo)',
    imap: { host: 'imap.orange.fr', port: 993, tls: true },
    smtp: { host: 'smtp.orange.fr', port: 465, tls: true },
  },
  'free.fr': {
    provider: 'Free',
    imap: { host: 'imap.free.fr', port: 993, tls: true },
    smtp: { host: 'smtp.free.fr', port: 465, tls: true },
  },
  'sfr.fr': {
    provider: 'SFR',
    imap: { host: 'imap.sfr.fr', port: 993, tls: true },
    smtp: { host: 'smtp.sfr.fr', port: 465, tls: true },
  },
  'laposte.net': {
    provider: 'La Poste',
    imap: { host: 'imap.laposte.net', port: 993, tls: true },
    smtp: { host: 'smtp.laposte.net', port: 465, tls: true },
  },
  'bbox.fr': {
    provider: 'Bouygues',
    imap: { host: 'imap.bbox.fr', port: 993, tls: true },
    smtp: { host: 'smtp.bbox.fr', port: 465, tls: true },
  },
};

const PROTON_DOMAINS = ['proton.me', 'pm.me', 'protonmail.com', 'protonmail.ch'];

export async function detectMailConfig(email: string): Promise<AutoConfigResult> {
  const at = email.lastIndexOf('@');
  if (at < 0) {
    return { ok: false, provider: 'unknown', imap: null, smtp: null, needsBridge: false, source: 'guessed', error: 'Email invalide' };
  }
  const domain = email.slice(at + 1).toLowerCase();

  if (PROTON_DOMAINS.includes(domain)) {
    return {
      ok: true,
      provider: 'ProtonMail (via Bridge)',
      imap: { host: '127.0.0.1', port: 1143, tls: false },
      smtp: { host: '127.0.0.1', port: 1025, tls: false },
      needsBridge: true,
      bridgeHint: "ProtonMail Bridge doit tourner localement. Le mot de passe est celui généré par Bridge (pas ton mot de passe Proton).",
      source: 'protonmail-bridge',
    };
  }

  const hard = HARDCODED[domain];
  if (hard) {
    return { ok: true, provider: hard.provider, imap: hard.imap, smtp: hard.smtp, needsBridge: false, source: 'hardcoded' };
  }

  const ispdb = await fetchThunderbirdISPDB(domain);
  if (ispdb.ok) return ispdb;

  return {
    ok: true,
    provider: `Deviné (${domain})`,
    imap: { host: `imap.${domain}`, port: 993, tls: true },
    smtp: { host: `smtp.${domain}`, port: 587, tls: false },
    needsBridge: false,
    source: 'guessed',
  };
}

async function fetchThunderbirdISPDB(domain: string): Promise<AutoConfigResult> {
  try {
    const res = await fetch(`https://autoconfig.thunderbird.net/v1.1/${encodeURIComponent(domain)}`, {
      headers: { 'User-Agent': 'identity-scanner/0.1' },
    });
    if (!res.ok) {
      return { ok: false, provider: 'unknown', imap: null, smtp: null, needsBridge: false, source: 'thunderbird-ispdb', error: `ISPDB ${res.status}` };
    }
    const xml = await res.text();
    const imap = parseServer(xml, 'imap');
    const smtp = parseServer(xml, 'smtp');
    const provider = (xml.match(/<displayName>([^<]+)<\/displayName>/i)?.[1] ?? domain).trim();
    if (!imap) {
      return { ok: false, provider, imap: null, smtp, needsBridge: false, source: 'thunderbird-ispdb', error: 'Pas d\'IMAP dans ISPDB' };
    }
    return { ok: true, provider, imap, smtp, needsBridge: false, source: 'thunderbird-ispdb' };
  } catch (err) {
    return { ok: false, provider: 'unknown', imap: null, smtp: null, needsBridge: false, source: 'thunderbird-ispdb', error: (err as Error).message };
  }
}

function parseServer(xml: string, type: 'imap' | 'smtp'): MailServerConfig | null {
  const re = new RegExp(`<(?:incoming|outgoing)Server[^>]*type="${type}"[^>]*>([\\s\\S]*?)</(?:incoming|outgoing)Server>`, 'i');
  const match = xml.match(re);
  if (!match) return null;
  const block = match[1];
  const host = block.match(/<hostname>([^<]+)<\/hostname>/i)?.[1]?.trim();
  const port = Number(block.match(/<port>([^<]+)<\/port>/i)?.[1]?.trim());
  const socket = (block.match(/<socketType>([^<]+)<\/socketType>/i)?.[1] ?? '').trim().toUpperCase();
  if (!host || !port) return null;
  const tls = socket === 'SSL' || socket === 'TLS';
  return { host, port, tls };
}
