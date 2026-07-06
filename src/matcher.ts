export function extractDomain(emailOrAddress: string): string | null {
  if (!emailOrAddress) return null;
  const match = emailOrAddress.match(/<([^>]+)>/);
  const raw = (match ? match[1] : emailOrAddress).trim();
  const at = raw.lastIndexOf('@');
  if (at < 0) return null;
  return raw.slice(at + 1).toLowerCase().replace(/[>,;]+$/, '');
}

const NOISE_PREFIXES = ['noreply', 'no-reply', 'donotreply', 'do-not-reply', 'mailer', 'mail', 'news', 'newsletter', 'notifications', 'support', 'hello', 'contact', 'info', 'team', 'updates', 'account', 'welcome', 'admin', 'bounces'];

export function rootDomain(domain: string): string {
  const parts = domain.split('.');
  if (parts.length <= 2) return domain;
  const last2 = parts.slice(-2).join('.');
  const last3 = parts.slice(-3).join('.');
  const multiCcTld = /\.(co|com|org|net|gov|ac)\.[a-z]{2}$/.test(domain);
  return multiCcTld ? last3 : last2;
}

export function isLikelyServiceSender(localPart: string): boolean {
  const lp = localPart.toLowerCase();
  if (NOISE_PREFIXES.some(p => lp === p || lp.startsWith(p + '-') || lp.startsWith(p + '.'))) return true;
  return /^[a-z0-9._-]+$/.test(lp);
}
