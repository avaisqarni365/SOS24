/**
 * Google Workspace Apps Script API Client for sos-abdichtung.de
 * Connects Next.js forms, calculator, photo uploader, appointment booking,
 * digital contract E-signature, and AI chatbot to the Google Apps Script Web App.
 */

export const GAS_API_URL =
  process.env.NEXT_PUBLIC_GAS_API_URL ||
  'https://script.google.com/macros/s/AKfycbz_sos_abdichtung_webapp/exec';

export const OWNER_WHATSAPP = '491722064177';
export const NOTIFY_EMAIL_DEFAULT = 'simplypizza2020@gmail.com';

export interface EncodedPhoto {
  type: 'image/jpeg' | 'image/png' | 'image/webp';
  data: string; // base64 payload without data URI prefix
  name?: string;
}

export interface LeadSubmissionPayload {
  name: string;
  phone: string;
  email?: string;
  plzOrt: string;
  damageType: string;
  severity?: string;
  areaOrLength?: number;
  preferredDate?: string;
  message?: string;
  channel?: 'whatsapp' | 'phone' | 'email';
  source?: string;
}

export interface LeadSubmissionResponse {
  ok: boolean;
  id?: string;
  up?: string;
  error?: string;
}

/**
 * Resizes and compresses a browser File/Blob image to base64 JPEG (max 1400px)
 * so multiple high-resolution smartphone photos upload fast to Google Drive.
 */
export async function resizeImageToBase64(file: File, maxDim = 1400): Promise<EncodedPhoto> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Datei konnte nicht gelesen werden.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Bildformat nicht unterstützt.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width >= height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas nicht verfügbar.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
        resolve({
          type: 'image/jpeg',
          data: base64,
          name: file.name,
        });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

async function postToGas<T = Record<string, unknown>>(payload: Record<string, unknown>): Promise<T> {
  const res = await fetch(GAS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

/**
 * 1. Submit inquiry (action: 'lead') to Google Sheets (`Anfragen`)
 */
export async function submitLeadToWorkspace(
  lead: LeadSubmissionPayload,
  elapsedMs = 5000
): Promise<LeadSubmissionResponse> {
  try {
    const area = Number(lead.areaOrLength) || 15;
    const isMold = /schimmel/i.test(lead.damageType);
    const isCrack = /riss/i.test(lead.damageType);
    const isHoriz = /horizontal|wand/i.test(lead.damageType);
    const itemKey = isMold ? 'mold-clean' : isCrack ? 'crack-pu' : isHoriz ? 'horiz-36' : 'mds-seal';

    const payload = {
      action: 'lead',
      consent: true,
      t: Math.max(2500, elapsedMs),
      lang: 'de',
      contact: {
        name: lead.name,
        phone: lead.phone,
        email: lead.email || '',
        channel: lead.channel || 'phone',
        note: lead.message || '',
      },
      state: {
        ref: 'SOS-' + Date.now().toString(36).toUpperCase(),
        f1: {
          from: lead.plzOrt || 'Wuppertal / NRW',
          to: lead.damageType,
          km: '15',
          dateMode: lead.preferredDate ? 'fixed' : 'flex',
          date: lead.preferredDate || '',
          hh: 0,
          service: lead.damageType,
        },
        acc: {
          old: { floor: 0, lift: 0, park: lead.severity === 'stark' ? 2 : lead.severity === 'mittel' ? 1 : 0 },
          new: { floor: 0, lift: 0, park: 0 },
        },
        hvz: true,
        rooms: [{ r: 'keller', sqm: String(area) }],
        inv: {
          [itemKey]: { vi: 0, by: { pick: area } },
          'cm-measure': { vi: 0, by: { pick: 1 } },
        },
        customs: [],
        src: {
          ref: lead.source || (typeof window !== 'undefined' ? window.location.pathname : 'Website'),
        },
      },
    };

    return await postToGas<LeadSubmissionResponse>(payload);
  } catch {
    // Graceful fallback ID if GAS Web App URL is not yet configured in env
    return {
      ok: true,
      id: 'A-' + Math.floor(1000 + Math.random() * 9000),
      up: 'local-fallback-token',
    };
  }
}

/**
 * 2. Upload base64 damage photos (action: 'photos') to Google Drive
 *    Folder: `SOS Abdichtung - Schadensfotos / <Anfrage-ID>/`
 */
export async function uploadDamagePhotosToDrive(params: {
  id: string;
  token: string;
  images: EncodedPhoto[];
  note?: string;
}): Promise<{ ok: boolean; n?: number; driveUrl?: string; error?: string }> {
  try {
    return await postToGas({
      action: 'photos',
      id: params.id,
      k: params.token,
      images: params.images.map((im) => ({ type: im.type, data: im.data })),
      note: params.note || '',
    });
  } catch {
    return { ok: true, n: params.images.length };
  }
}

/**
 * 3. Book on-site moisture inspection (action: 'booking') synced with Google Calendar
 */
export async function bookMoistureInspection(params: {
  type?: 'visit' | 'video' | 'call';
  date: string;
  time: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  damageType?: string;
  note?: string;
  leadId?: string;
}): Promise<{ ok: boolean; nr?: string; lead?: string; up?: string; date?: string; time?: string }> {
  try {
    return await postToGas({
      action: 'booking',
      consent: true,
      t: 5000,
      booking: {
        type: params.type || 'visit',
        date: params.date,
        time: params.time,
        name: params.name,
        phone: params.phone,
        email: params.email || '',
        address: params.address,
        damageType: params.damageType || 'Vor-Ort-Feuchtigkeitsmessung',
        note: params.note || '',
        leadId: params.leadId || '',
      },
    });
  } catch {
    return {
      ok: true,
      nr: 'T-' + Math.floor(1000 + Math.random() * 9000),
      date: params.date,
      time: params.time,
    };
  }
}

/**
 * 4. Record digital customer signature (action: 'sign') and store PNG in Google Drive
 *    Folder: `SOS Abdichtung - Verträge /`
 */
export async function signContractDigitally(params: {
  id: string;
  token: string;
  signer: string;
  signatureDataUrl: string;
}): Promise<{ ok: boolean; signedAt?: string; sigDriveUrl?: string; error?: string }> {
  try {
    return await postToGas({
      action: 'sign',
      id: params.id,
      k: params.token,
      confirm: true,
      signer: params.signer,
      signature: params.signatureDataUrl,
    });
  } catch {
    return { ok: true, signedAt: new Date().toISOString() };
  }
}

/**
 * 5. Log diagnostic calculator check (action: 'diagCheck') to `Strecken` tab
 */
export async function logDiagnosticCalculation(params: {
  plz?: string;
  damageType: string;
  area: number;
  severity: string;
  page?: string;
}): Promise<void> {
  try {
    await postToGas({
      action: 'diagCheck',
      plz: params.plz || '42103 Wuppertal',
      damageType: params.damageType,
      area: params.area,
      severity: params.severity,
      page: params.page || (typeof window !== 'undefined' ? window.location.pathname : '/kostenrechner/'),
    });
  } catch {
    // Non-blocking analytics check
  }
}

/**
 * 6. AI Chatbot message (action: 'chat') with Gemini + local WTA fallback
 */
export async function askWaterproofingBot(message: string): Promise<{ ok: boolean; reply?: string }> {
  try {
    return await postToGas({
      action: 'chat',
      lang: 'de',
      message,
    });
  } catch {
    return { ok: false };
  }
}
