export type ServiceCategory =
  | 'social'
  | 'gaming'
  | 'ecommerce'
  | 'streaming'
  | 'tech'
  | 'productivity'
  | 'finance'
  | 'dating'
  | 'ai'
  | 'news'
  | 'other';

export interface CuratedService {
  id: string;
  name: string;
  domains: string[];
  category: ServiceCategory;
  deleteAccountUrl?: string;
  privacyContact?: string;
  notes?: string;
}

export interface ExposureInfo {
  ok: boolean;
  exposures: Array<{
    name: string;
    title: string;
    domain: string;
    breachDate: string;
    dataClasses: string[];
    serviceId: string | null;
  }>;
  error?: string;
}

export interface GdprRequestResult {
  ok: boolean;
  error?: string;
  sentTo?: string;
}

export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  tls: boolean;
}

export interface ImapCredentials {
  host: string;
  port: number;
  user: string;
  pass: string;
  tls: boolean;
  daysBack?: number;
}
