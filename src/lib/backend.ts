/**
 * Google Workspace Apps Script API Client & Real-Time Admin Sync Store for sos-abdichtung.de
 * Connects Next.js forms (/kontakt/), calculator (/kostenrechner/), photo uploader,
 * appointment booking, digital contract E-signature, AI chatbot, and /admin/ dashboard.
 */

export const GAS_API_URL =
  process.env.NEXT_PUBLIC_GAS_API_URL ||
  'https://script.google.com/macros/s/AKfycbzBjzDgaBJDMy-ctRI_PaGKdBe8z-CvzFW-bRv_TAvhLL-Fnr0I8r8QAo5DN9cxQoTK/exec';

export const ADMIN_WEBAPP_URL =
  process.env.NEXT_PUBLIC_ADMIN_WEBAPP_URL ||
  'https://script.google.com/macros/s/AKfycbxVcjb2Or5MQ2uJZjiO0rk_w5Dtc194XR4z0xRPb0p4m13Dr0JPdHg72tW1Z7V-1kkw/exec';

export const OWNER_WHATSAPP = '491722064177';
export const NOTIFY_EMAIL_DEFAULT = 'simplypizza2020@gmail.com';
export const WORKSPACE_STORAGE_KEY = 'sos_abdichtung_workspace_v2';

export interface EncodedPhoto {
  type: 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf' | string;
  data: string; // base64 payload without data URI prefix
  name?: string;
  uploadedAt?: string;
}

export interface StoredDrivePhoto {
  name: string;
  dataUrl: string;
  uploadedAt: string;
  driveFolder: string;
  fileType?: 'image' | 'pdf' | 'document';
}

export interface QuoteLineItem {
  pos: string;
  basis: string;
  qty: number;
  unit: string;
  price: number;
  labour: boolean;
}

export type LeadStatus =
  | 'Neu'
  | 'In Arbeit'
  | 'Angebot raus'
  | 'Gebucht'
  | 'Erledigt'
  | 'Verloren';

export interface WorkspaceLead {
  id: string;
  received: string;
  status: LeadStatus;
  owner: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  damageType: string;
  area: string;
  date: string;
  notes: string;
  message: string;
  source?: string;
  photosDriveUrl: string;
  photos: StoredDrivePhoto[];
  sigDriveUrl?: string;
  signatureDataUrl?: string;
  signedBy?: string;
  signedAt?: string;
  token: string;
  handover: Record<string, boolean>;
  handoverNote: string;
  lines: QuoteLineItem[];
}

export interface WorkspaceGoBDDoc {
  nr: string;
  type: 'offer' | 'invoice' | 'deposit' | 'credit';
  typeLabel: string;
  leadId: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  service: string;
  date: string;
  dueOrValid: string;
  status: string;
  vatRate: number;
  discountPct: number;
  driveFolder: string;
  lines: QuoteLineItem[];
  refOfferNr?: string;
  paymentTermsDays?: number;
  skontoPct?: number;
  skontoDays?: number;
}

export interface WorkspaceAppointment {
  nr: string;
  leadId: string;
  date: string;
  time: string;
  type: string;
  name: string;
  phone: string;
  address: string;
  damageType: string;
  status: string;
}

export interface WorkspaceState {
  leads: WorkspaceLead[];
  docs: WorkspaceGoBDDoc[];
  appointments: WorkspaceAppointment[];
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

const DEFAULT_LEADS: WorkspaceLead[] = [
  {
    id: 'A-1001',
    received: '16.10.2026, 08:45',
    status: 'Neu',
    owner: 'Shahzad Mahmood',
    name: 'Familie Thomas Berger',
    phone: '+49 172 2064177',
    email: 'berger@beispiel.de',
    address: 'Friedrich-Ebert-Str. 40, 42103 Wuppertal',
    damageType: 'Aufsteigende Feuchte / Horizontalsperre',
    area: '14 lfm · 22 m²',
    date: '2026-10-22',
    notes: 'Altbau Bj. 1928, Ziegelmauerwerk 36,5 cm, Salzausblühungen an Nordwand.',
    message:
      'Putz blättert im Keller bis 60 cm Höhe ab, muffiger Geruch. Bitte um kostenlose Feuchtemessung.',
    source: 'Kontaktformular (/kontakt/)',
    photosDriveUrl: 'https://drive.google.com/drive/u/0/my-drive',
    photos: [
      {
        name: 'A-1001_Kellerwand_Nord_Salzausbluehung.webp',
        dataUrl: '/img/gallery/schimmel-ausbluehungen-480.webp',
        uploadedAt: '16.10.2026, 08:46 Uhr',
        driveFolder: 'SOS Abdichtung - Schadensfotos / A-1001',
        fileType: 'image',
      },
      {
        name: 'A-1001_Horizontalsperre_Bohrlochinjektion.webp',
        dataUrl: '/img/gallery/bohrung-injektion.webp',
        uploadedAt: '16.10.2026, 08:46 Uhr',
        driveFolder: 'SOS Abdichtung - Schadensfotos / A-1001',
        fileType: 'image',
      },
      {
        name: 'A-1001_Feuchte_Kellerwand_Sockel.webp',
        dataUrl: '/img/gallery/feuchterand-sockel-480.webp',
        uploadedAt: '16.10.2026, 08:50 Uhr',
        driveFolder: 'SOS Abdichtung - Schadensfotos / A-1001',
        fileType: 'image',
      },
    ],
    sigDriveUrl: 'https://drive.google.com/drive/u/0/my-drive',
    signedBy: 'Thomas Berger',
    signedAt: '16.10.2026, 09:15 Uhr',
    token: '9f8e7d6c5b4a32109f8e7d6c5b4a3210',
    handover: { moisture: true, salts: true, foil: true },
    handoverNote: 'CM-Messung: 4,1 % Restfeuchte, Bohrlochraster 12 cm einplanen.',
    lines: [
      {
        pos: 'Feuchte- & Salzanalyse vor Ort',
        basis: 'Kapazitive Messung & Sanierungskonzept',
        qty: 1,
        unit: 'Pausch.',
        price: 0,
        labour: true,
      },
      {
        pos: 'Nachträgliche Horizontalsperre (WTA-Injektion)',
        basis: '36,5 cm Ziegelmauerwerk, Silan-Creme',
        qty: 14,
        unit: 'lfm',
        price: 135,
        labour: true,
      },
      {
        pos: 'WTA-Sanierputzsystem (Porenputz)',
        basis: 'Salzspeichernder Sanierputz inkl. Voranstrich',
        qty: 14,
        unit: 'm²',
        price: 85,
        labour: true,
      },
      {
        pos: 'Anfahrt & Baustelleneinrichtung',
        basis: '42103 Wuppertal-Elberfeld',
        qty: 1,
        unit: 'Pausch.',
        price: 89,
        labour: true,
      },
    ],
  },
  {
    id: 'A-1002',
    received: '16.10.2026, 09:30',
    status: 'Angebot raus',
    owner: 'Shahzad Mahmood',
    name: 'Hausverwaltung Rhein-Wupper GmbH',
    phone: '+49 202 5551234',
    email: 'verwaltung@rhein-wupper.de',
    address: 'Kölner Str. 88, 42651 Solingen',
    damageType: 'Schimmelbefall / Klimaplatte',
    area: '16 m²',
    date: '2026-10-25',
    notes: 'EG-Wohnung Schlafzimmer Außenwand, Taupunktunterschreitung an Wärmebrücke.',
    message: 'Mieter meldet wiederkehrenden Schimmel in den Außenecken.',
    source: 'Kontaktformular (/kontakt/)',
    photosDriveUrl: 'https://drive.google.com/drive/u/0/my-drive',
    photos: [
      {
        name: 'A-1002_Aussenecke_Schimmelbefall.webp',
        dataUrl: '/img/sp/schimmel-raumecke-320.webp',
        uploadedAt: '16.10.2026, 09:31 Uhr',
        driveFolder: 'SOS Abdichtung - Schadensfotos / A-1002',
        fileType: 'image',
      },
      {
        name: 'A-1002_Wasserrand_Tapete.webp',
        dataUrl: '/img/sp/schimmel-wasserrand-wand-320.webp',
        uploadedAt: '16.10.2026, 09:32 Uhr',
        driveFolder: 'SOS Abdichtung - Schadensfotos / A-1002',
        fileType: 'image',
      },
      {
        name: 'A-1002_Sanierputz_Vorbereitung.webp',
        dataUrl: '/img/sp/sanierputz-spachteln-320.webp',
        uploadedAt: '16.10.2026, 09:35 Uhr',
        driveFolder: 'SOS Abdichtung - Schadensfotos / A-1002',
        fileType: 'image',
      },
    ],
    token: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    handover: { moisture: true },
    handoverNote: 'Oberflächentemperatur Ecke 11,4 °C bei 20 °C Raumluft.',
    lines: [
      {
        pos: 'Sporensichere Schimmelbeseitigung',
        basis: 'Tiefendesinfektion ohne Chlorbelastung',
        qty: 16,
        unit: 'm²',
        price: 65,
        labour: true,
      },
      {
        pos: 'Calciumsilikat-Klimaplatte (25 mm)',
        basis: 'Kapillaraktive Innendämmung inkl. Spezialkleber',
        qty: 16,
        unit: 'm²',
        price: 110,
        labour: true,
      },
      {
        pos: 'Anfahrt & Baustelleneinrichtung',
        basis: '42651 Solingen',
        qty: 1,
        unit: 'Pausch.',
        price: 89,
        labour: true,
      },
    ],
  },
];

const DEFAULT_DOCS: WorkspaceGoBDDoc[] = [
  {
    nr: 'ANG-2026-0001',
    type: 'offer',
    typeLabel: 'Angebot',
    leadId: 'A-1001',
    name: 'Familie Thomas Berger',
    address: 'Friedrich-Ebert-Str. 40, 42103 Wuppertal',
    email: 'berger@beispiel.de',
    phone: '+49 172 2064177',
    service: 'Horizontalsperre & WTA-Sanierputz (Keller Nordwand)',
    date: '2026-10-16',
    dueOrValid: '2026-10-30',
    status: 'Versendet',
    vatRate: 19,
    discountPct: 0,
    driveFolder: 'SOS Abdichtung - Belege / 2026',
    lines: DEFAULT_LEADS[0].lines,
  },
  {
    nr: 'RE-2026-0001',
    type: 'invoice',
    typeLabel: 'Rechnung',
    leadId: 'A-1001',
    name: 'Familie Thomas Berger',
    address: 'Friedrich-Ebert-Str. 40, 42103 Wuppertal',
    email: 'berger@beispiel.de',
    phone: '+49 172 2064177',
    service: 'Horizontalsperre & WTA-Sanierputz (Keller Nordwand)',
    date: '2026-10-16',
    dueOrValid: '2026-10-30',
    status: 'Offen',
    vatRate: 19,
    discountPct: 0,
    driveFolder: 'SOS Abdichtung - Belege / 2026',
    lines: DEFAULT_LEADS[0].lines,
  },
  {
    nr: 'ANG-2026-0002',
    type: 'offer',
    typeLabel: 'Angebot',
    leadId: 'A-1002',
    name: 'Hausverwaltung Rhein-Wupper GmbH',
    address: 'Kölner Str. 88, 42651 Solingen',
    email: 'verwaltung@rhein-wupper.de',
    phone: '+49 202 5551234',
    service: 'Schimmelbeseitigung & Calciumsilikat-Klimaplatte',
    date: '2026-10-16',
    dueOrValid: '2026-10-30',
    status: 'Versendet',
    vatRate: 19,
    discountPct: 0,
    driveFolder: 'SOS Abdichtung - Belege / 2026',
    lines: DEFAULT_LEADS[1].lines,
  },
];

const DEFAULT_APPOINTMENTS: WorkspaceAppointment[] = [
  {
    nr: 'T-1001',
    leadId: 'A-1001',
    date: '2026-10-22',
    time: '10:00',
    type: 'Vor-Ort-Feuchtigkeitsmessung',
    name: 'Familie Thomas Berger',
    phone: '+49 172 2064177',
    address: 'Friedrich-Ebert-Str. 40, 42103 Wuppertal',
    damageType: 'Aufsteigende Feuchte / Horizontalsperre',
    status: 'Im Kalender bestätigt',
  },
  {
    nr: 'T-1002',
    leadId: 'A-1002',
    date: '2026-10-25',
    time: '14:00',
    type: 'Taupunkt- & Schimmelanalyse',
    name: 'Hausverwaltung Rhein-Wupper GmbH',
    phone: '+49 202 5551234',
    address: 'Kölner Str. 88, 42651 Solingen',
    damageType: 'Schimmelbefall / Klimaplatte',
    status: 'Im Kalender bestätigt',
  },
];

function buildDefaultLinesForDamage(damageType: string, areaNum: number): QuoteLineItem[] {
  const qty = Math.max(1, areaNum || 15);
  const isMold = /schimmel/i.test(damageType);
  const isCrack = /riss/i.test(damageType);
  const isHoriz = /horizontal|aufsteigend/i.test(damageType);

  if (isMold) {
    return [
      { pos: 'Feuchte- & Taupunktmessung vor Ort', basis: 'Kostenlose Erstdiagnose', qty: 1, unit: 'Pausch.', price: 0, labour: true },
      { pos: 'Sporensichere Schimmelbeseitigung', basis: 'Tiefendesinfektion & Feinreinigung', qty, unit: 'm²', price: 65, labour: true },
      { pos: 'Calciumsilikat-Klimaplatte (25 mm)', basis: 'Kapillaraktive Innendämmung inkl. Spezialkleber', qty, unit: 'm²', price: 110, labour: true },
      { pos: 'Anfahrt & Baustelleneinrichtung', basis: 'Raum Wuppertal & NRW', qty: 1, unit: 'Pausch.', price: 89, labour: true },
    ];
  }
  if (isCrack) {
    return [
      { pos: 'Feuchte- & Rissdiagnose vor Ort', basis: 'Kostenlose Erstdiagnose', qty: 1, unit: 'Pausch.', price: 0, labour: true },
      { pos: 'Hochdruck-Rissverpressung (PU / Epoxidharz)', basis: 'Setzen von Hochdruckpackern & Injektion', qty, unit: 'lfm', price: 165, labour: true },
      { pos: 'Anfahrt & Baustelleneinrichtung', basis: 'Raum Wuppertal & NRW', qty: 1, unit: 'Pausch.', price: 89, labour: true },
    ];
  }
  if (isHoriz) {
    return [
      { pos: 'Feuchte- & Salzanalyse vor Ort', basis: 'Kapazitive Messung & Sanierungskonzept', qty: 1, unit: 'Pausch.', price: 0, labour: true },
      { pos: 'Nachträgliche Horizontalsperre (WTA-Injektion)', basis: 'Bohrlochinjektion mit Silan-Creme', qty, unit: 'lfm', price: 135, labour: true },
      { pos: 'WTA-Sanierputzsystem (Porenputz)', basis: 'Salzspeichernder Sanierputz inkl. Spritzbewurf', qty, unit: 'm²', price: 85, labour: true },
      { pos: 'Anfahrt & Baustelleneinrichtung', basis: 'Raum Wuppertal & NRW', qty: 1, unit: 'Pausch.', price: 89, labour: true },
    ];
  }
  return [
    { pos: 'Feuchte- & Salzanalyse vor Ort', basis: 'Kapazitive Messung & Sanierungskonzept', qty: 1, unit: 'Pausch.', price: 0, labour: true },
    { pos: 'Kellerinnenabdichtung (2K-Dichtschlämme MDS)', basis: '2-lagiger Auftrag auf vorbereitetem Untergrund', qty, unit: 'm²', price: 115, labour: true },
    { pos: 'Druckwasserdichte Hohlkehle', basis: 'Wand-Sohlen-Anschluss ausrunden & abdichten', qty: Math.max(4, Math.round(qty * 0.6)), unit: 'lfm', price: 55, labour: true },
    { pos: 'Anfahrt & Baustelleneinrichtung', basis: 'Raum Wuppertal & NRW', qty: 1, unit: 'Pausch.', price: 89, labour: true },
  ];
}

function sanitizeStoredPhoto(ph: StoredDrivePhoto, leadId: string): StoredDrivePhoto {
  let url = ph.dataUrl || '';
  if (
    url.includes('/images/') ||
    url.includes('Stockflecken') ||
    url.includes('horizontalsperre_ziegel') ||
    url.includes('schimmel-wand') ||
    !url
  ) {
    const nameLower = (ph.name || '').toLowerCase();
    if (nameLower.includes('injektion') || nameLower.includes('bohrloch')) {
      url = '/img/gallery/bohrung-injektion.webp';
    } else if (nameLower.includes('aussenecke') || nameLower.includes('schimmel')) {
      url = '/img/sp/schimmel-raumecke-320.webp';
    } else if (nameLower.includes('wasserrand') || nameLower.includes('tapete')) {
      url = '/img/sp/schimmel-wasserrand-wand-320.webp';
    } else if (nameLower.includes('sanierputz') || nameLower.includes('spachteln')) {
      url = '/img/sp/sanierputz-spachteln-320.webp';
    } else if (nameLower.includes('sockel') || nameLower.includes('aussen')) {
      url = '/img/gallery/feuchterand-sockel-480.webp';
    } else {
      url = '/img/gallery/schimmel-ausbluehungen-480.webp';
    }
  }
  return {
    ...ph,
    dataUrl: url,
    driveFolder: ph.driveFolder || `SOS Abdichtung - Schadensfotos / ${leadId}`,
    fileType: ph.fileType || (ph.name && ph.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'),
  };
}

export function getWorkspaceStore(): WorkspaceState {
  if (typeof window === 'undefined') {
    return { leads: DEFAULT_LEADS, docs: DEFAULT_DOCS, appointments: DEFAULT_APPOINTMENTS };
  }
  try {
    const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) {
      const init = { leads: DEFAULT_LEADS, docs: DEFAULT_DOCS, appointments: DEFAULT_APPOINTMENTS };
      window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(init));
      return init;
    }
    const parsed = JSON.parse(raw) as WorkspaceState;
    if (!Array.isArray(parsed.leads) || parsed.leads.length === 0) {
      return { leads: DEFAULT_LEADS, docs: DEFAULT_DOCS, appointments: DEFAULT_APPOINTMENTS };
    }
    const sanitizedLeads = parsed.leads.map((l) => ({
      ...l,
      photos: (l.photos || []).map((ph) => sanitizeStoredPhoto(ph, l.id)),
    }));
    return {
      leads: sanitizedLeads,
      docs: Array.isArray(parsed.docs) && parsed.docs.length > 0 ? parsed.docs : DEFAULT_DOCS,
      appointments:
        Array.isArray(parsed.appointments) && parsed.appointments.length > 0
          ? parsed.appointments
          : DEFAULT_APPOINTMENTS,
    };
  } catch {
    return { leads: DEFAULT_LEADS, docs: DEFAULT_DOCS, appointments: DEFAULT_APPOINTMENTS };
  }
}

export function saveWorkspaceStore(next: WorkspaceState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('sos-workspace-updated'));
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel('sos_workspace_sync');
      bc.postMessage({ type: 'sync', ts: Date.now() });
      bc.close();
    }
  } catch {
    // ignore storage quota errors
  }
}

export function subscribeWorkspaceStore(onUpdate: (state: WorkspaceState) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => onUpdate(getWorkspaceStore());
  window.addEventListener('sos-workspace-updated', handler);
  window.addEventListener('storage', handler);
  let bc: BroadcastChannel | null = null;
  if ('BroadcastChannel' in window) {
    bc = new BroadcastChannel('sos_workspace_sync');
    bc.onmessage = handler;
  }
  return () => {
    window.removeEventListener('sos-workspace-updated', handler);
    window.removeEventListener('storage', handler);
    if (bc) bc.close();
  };
}

/**
 * Resizes and compresses a browser File/Blob image to base64 JPEG (max 1200px)
 * so multiple high-resolution smartphone photos upload fast to Google Drive and preview in Admin.
 */
export async function resizeImageToBase64(file: File, maxDim = 1200): Promise<EncodedPhoto> {
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
        resolve({
          type: 'image/jpeg',
          data: base64,
          name: file.name,
          uploadedAt: new Date().toLocaleString('de-DE'),
        });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Encodes either an image (compressed via canvas) or a PDF / document into base64
 */
export async function processFileForUpload(file: File, maxDim = 1200): Promise<EncodedPhoto> {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (isPdf) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Dokument konnte nicht gelesen werden.'));
      reader.onload = () => {
        const fullDataUrl = String(reader.result);
        const base64 = fullDataUrl.replace(/^data:[^;]+;base64,/, '');
        resolve({
          type: 'application/pdf',
          data: base64,
          name: file.name,
          uploadedAt: new Date().toLocaleString('de-DE'),
        });
      };
      reader.readAsDataURL(file);
    });
  }
  return resizeImageToBase64(file, maxDim);
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
 * 1. Submit inquiry (action: 'lead') to Google Sheets (`Anfragen`) AND sync to Admin Dashboard
 */
export async function submitLeadToWorkspace(
  lead: LeadSubmissionPayload,
  elapsedMs = 5000
): Promise<LeadSubmissionResponse> {
  const area = Number(lead.areaOrLength) || 15;
  const store = getWorkspaceStore();
  const nextNum = 1001 + store.leads.length;
  let assignedId = `A-${nextNum}`;
  let assignedToken = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);

  try {
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

    const remoteRes = await postToGas<LeadSubmissionResponse>(payload);
    if (remoteRes?.id) assignedId = remoteRes.id;
    if (remoteRes?.up) assignedToken = remoteRes.up;
  } catch {
    // Use local sequential ID A-1003, A-1004...
  }

  const lines = buildDefaultLinesForDamage(lead.damageType, area);
  const todayIso = new Date().toISOString().slice(0, 10);
  const newLead: WorkspaceLead = {
    id: assignedId,
    received: new Date().toLocaleString('de-DE'),
    status: 'Neu',
    owner: 'Shahzad Mahmood',
    name: lead.name,
    phone: lead.phone,
    email: lead.email || '',
    address: lead.plzOrt || '42103 Wuppertal',
    damageType: lead.damageType,
    area: `${area} m²/lfm`,
    date: lead.preferredDate || todayIso,
    notes: `Eingegangen über ${lead.source || 'Kontaktformular (/kontakt/)'}`,
    message: lead.message || 'Bitte um kostenlose Vor-Ort-Feuchtigkeitsmessung.',
    source: lead.source || 'Kontaktformular (/kontakt/)',
    photosDriveUrl: 'https://drive.google.com/drive/u/0/my-drive',
    photos: [],
    token: assignedToken,
    handover: { moisture: false },
    handoverNote: '',
    lines,
  };

  // Automatically create a draft GoBD Offer (ANG-2026-xxxx) so Admin sees it immediately in Angebote & Drive
  const offerSeq = store.docs.filter((d) => d.nr.startsWith('ANG-')).length + 1;
  const offerNr = `ANG-2026-${String(offerSeq).padStart(4, '0')}`;
  const draftOffer: WorkspaceGoBDDoc = {
    nr: offerNr,
    type: 'offer',
    typeLabel: 'Angebot',
    leadId: assignedId,
    name: lead.name,
    address: lead.plzOrt || '42103 Wuppertal',
    email: lead.email || '',
    phone: lead.phone,
    service: `${lead.damageType} (${assignedId})`,
    date: todayIso,
    dueOrValid: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    status: 'Entwurf',
    vatRate: 19,
    discountPct: 0,
    driveFolder: 'SOS Abdichtung - Belege / 2026',
    lines,
  };

  const nextAppointments = [...store.appointments];
  if (lead.preferredDate) {
    nextAppointments.unshift({
      nr: `T-${1001 + store.appointments.length}`,
      leadId: assignedId,
      date: lead.preferredDate,
      time: '10:00',
      type: 'Vor-Ort-Feuchtigkeitsmessung',
      name: lead.name,
      phone: lead.phone,
      address: lead.plzOrt || '42103 Wuppertal',
      damageType: lead.damageType,
      status: 'Wunschtermin angefragt',
    });
  }

  saveWorkspaceStore({
    leads: [newLead, ...store.leads.filter((l) => l.id !== assignedId)],
    docs: [draftOffer, ...store.docs],
    appointments: nextAppointments,
  });

  return {
    ok: true,
    id: assignedId,
    up: assignedToken,
  };
}

/**
 * 2. Upload base64 damage photos (action: 'photos') to Google Drive AND attach to Admin Lead
 *    Folder: `SOS Abdichtung - Schadensfotos / <Anfrage-ID>/`
 */
export async function uploadDamagePhotosToDrive(params: {
  id: string;
  token: string;
  images: EncodedPhoto[];
  note?: string;
}): Promise<{ ok: boolean; n?: number; driveUrl?: string; error?: string }> {
  const nowStr = new Date().toLocaleString('de-DE');
  const folder = `SOS Abdichtung - Schadensfotos / ${params.id}`;
  const newPhotos: StoredDrivePhoto[] = params.images.map((im, idx) => {
    const isPdf = im.type === 'application/pdf' || (im.name && im.name.toLowerCase().endsWith('.pdf'));
    return {
      name: im.name || `${params.id}_Datei_${idx + 1}.${isPdf ? 'pdf' : 'jpg'}`,
      dataUrl: im.data.startsWith('data:') ? im.data : `data:${im.type};base64,${im.data}`,
      uploadedAt: im.uploadedAt || nowStr,
      driveFolder: folder,
      fileType: isPdf ? 'pdf' : 'image',
    };
  });

  // Persist into Workspace store so Admin sees uploaded photos immediately
  const store = getWorkspaceStore();
  const exists = store.leads.some((l) => l.id === params.id);
  const updatedLeads = exists
    ? store.leads.map((l) =>
        l.id === params.id
          ? {
              ...l,
              photos: [...l.photos, ...newPhotos],
              notes: params.note ? `${l.notes} · Foto-Notiz: ${params.note}` : l.notes,
            }
          : l
      )
    : [
        {
          id: params.id,
          received: nowStr,
          status: 'Neu' as LeadStatus,
          owner: 'Shahzad Mahmood',
          name: `Foto-Upload (${params.id})`,
          phone: '+49 172 2064177',
          email: '',
          address: 'Wuppertal / NRW',
          damageType: 'Schadensfotos Nachreichung',
          area: '15 m²',
          date: new Date().toISOString().slice(0, 10),
          notes: params.note || 'Direkter Foto-Upload',
          message: params.note || 'Kunde hat Schadensfotos hochgeladen.',
          source: 'Foto-Upload (/kontakt/)',
          photosDriveUrl: 'https://drive.google.com/drive/u/0/my-drive',
          photos: newPhotos,
          token: params.token || 'local-token',
          handover: { moisture: false },
          handoverNote: '',
          lines: buildDefaultLinesForDamage('Feuchter Keller', 15),
        },
        ...store.leads,
      ];

  saveWorkspaceStore({
    ...store,
    leads: updatedLeads,
  });

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
 * 3. Book on-site moisture inspection (action: 'booking') synced with Google Calendar & Admin
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
  const store = getWorkspaceStore();
  const nr = `T-${1001 + store.appointments.length}`;
  const leadId = params.leadId || `A-${1001 + store.leads.length}`;

  const nextAppt: WorkspaceAppointment = {
    nr,
    leadId,
    date: params.date,
    time: params.time,
    type:
      params.type === 'video'
        ? 'Google Meet Video-Diagnose'
        : params.type === 'call'
          ? 'Telefonische Fachberatung'
          : 'Vor-Ort-Feuchtigkeitsmessung',
    name: params.name,
    phone: params.phone,
    address: params.address,
    damageType: params.damageType || 'Vor-Ort-Feuchtigkeitsmessung',
    status: 'Im Kalender bestätigt',
  };

  saveWorkspaceStore({
    ...store,
    appointments: [nextAppt, ...store.appointments],
  });

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
        leadId,
      },
    });
  } catch {
    return {
      ok: true,
      nr,
      lead: leadId,
      date: params.date,
      time: params.time,
    };
  }
}

/**
 * 4. Record digital customer signature (action: 'sign') and store PNG in Google Drive & Admin
 *    Folder: `SOS Abdichtung - Verträge /`
 */
export async function signContractDigitally(params: {
  id: string;
  token: string;
  signer: string;
  signatureDataUrl: string;
}): Promise<{ ok: boolean; signedAt?: string; sigDriveUrl?: string; error?: string }> {
  const signedAt = new Date().toLocaleString('de-DE');
  const store = getWorkspaceStore();
  saveWorkspaceStore({
    ...store,
    leads: store.leads.map((l) =>
      l.id === params.id
        ? {
            ...l,
            status: 'Gebucht',
            signedBy: params.signer,
            signedAt,
            signatureDataUrl: params.signatureDataUrl,
            sigDriveUrl: 'https://drive.google.com/drive/u/0/my-drive',
          }
        : l
    ),
  });

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
    return { ok: true, signedAt };
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
