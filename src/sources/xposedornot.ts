import type { ExposureInfo } from '../types.js';

interface XonBreachDetail {
  breach: string;
  domain: string;
  industry?: string;
  xposed_date: string;
  xposed_data?: string;
  xposed_records?: number;
}

interface XonAnalyticsResponse {
  ExposedBreaches?: { breaches_details?: XonBreachDetail[] };
  BreachesSummary?: { site?: string };
  Error?: string;
}

export async function fetchExposures(email: string): Promise<ExposureInfo> {
  try {
    const url = `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(email)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json', 'User-Agent': 'identity-scanner/0.1' },
    });

    if (response.status === 404) {
      return { ok: true, exposures: [] };
    }
    if (!response.ok) {
      return { ok: false, exposures: [], error: `XposedOrNot HTTP ${response.status}` };
    }

    const data = (await response.json()) as XonAnalyticsResponse;
    const details = data.ExposedBreaches?.breaches_details ?? [];

    return {
      ok: true,
      exposures: details.map((b) => ({
        name: b.breach,
        title: b.breach,
        domain: b.domain,
        breachDate: b.xposed_date,
        dataClasses: (b.xposed_data ?? '').split(';').map((s) => s.trim()).filter(Boolean),
        serviceId: null,
      })),
    };
  } catch (err) {
    return { ok: false, exposures: [], error: (err as Error).message };
  }
}
