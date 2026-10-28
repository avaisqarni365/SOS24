import { ADMIN_WEBAPP_URL } from '@/lib/backend';

/**
 * The website's /admin talks to the Google back office (backend/admin-script) over HTTP:
 * the same login, the same api_ functions, the real Google Sheet. The session token lives
 * in sessionStorage only, so it ends with the tab; no customer data is stored in the browser.
 */
export const ADMIN_TOKEN_KEY = 'sos_admin_session';

async function post<T>(payload: Record<string, unknown>): Promise<T> {
  const res = await fetch(ADMIN_WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

const token = () => {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY) || '';
  } catch {
    return '';
  }
};

/** Errors: 'login', 'locked', 'leaked', 'network'. */
export async function adminSignIn(user: string, pass: string): Promise<{ ok: boolean; name?: string; error?: string }> {
  try {
    const r = await post<{ ok: boolean; token?: string; name?: string; error?: string }>({ action: 'login', user, pass });
    if (r.ok && r.token) {
      try {
        sessionStorage.setItem(ADMIN_TOKEN_KEY, r.token);
      } catch {
        // storage blocked: the session lasts for this page view
      }
      return { ok: true, name: r.name };
    }
    return { ok: false, error: r.error || 'login' };
  } catch {
    return { ok: false, error: 'network' };
  }
}

export async function adminSignOut(): Promise<void> {
  const t = token();
  try {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // nothing stored
  }
  if (t) await post({ action: 'logout', token: t }).catch(() => {});
}

export const hasAdminSession = () => /^[0-9a-f]{64}$/.test(token());

/** Calls an api_ function of the back office. 'login' means the session has ended. */
export async function adminCall<T>(fn: string, ...args: unknown[]): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const r = await post<{ ok: boolean; data?: T; error?: string }>({ action: 'api', token: token(), fn, args });
    return r.ok ? { ok: true, data: r.data as T } : { ok: false, error: r.error || 'error' };
  } catch {
    return { ok: false, error: 'network' };
  }
}

/** A lead as the back office's Google Sheet holds it (leadObj_ in Admin.js). */
export interface SheetLead {
  id: string;
  received: string;
  status: string;
  owner: string;
  name: string;
  phone: string;
  email: string;
  channel: string;
  to: string;
  from: string;
  date: string;
  source: string;
  message: string;
  service: string;
  notes: string;
  photosDrive: string;
  handover: Record<string, boolean> | null;
}

/** Website content (siteContent_ in Shared.js). */
export interface SiteItem {
  kind: 'Aktuell' | 'Stimme';
  date: string;
  title: string;
  text: string;
  link: string;
  name: string;
  place: string;
  stars: number;
  visible: boolean;
}
export interface SiteContent {
  social: Partial<Record<SocialKey, string>>;
  news: SiteItem[];
  reviews: SiteItem[];
}
export type SocialKey = 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'linkedin' | 'google_reviews' | 'whatsapp_channel';
export const SOCIAL_KEYS: SocialKey[] = ['instagram', 'facebook', 'youtube', 'tiktok', 'linkedin', 'google_reviews', 'whatsapp_channel'];
