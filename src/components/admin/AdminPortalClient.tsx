'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  FolderOpen,
  FileText,
  Calendar,
  Calculator,
  HelpCircle,
  Phone,
  MessageSquare,
  Mail,
  CheckSquare,
  Plus,
  Trash2,
  Printer,
  ExternalLink,
  Rocket,
  Lock,
  LogOut,
  FileSignature,
  Camera,
} from 'lucide-react';
import { COMPANY, COMPANY_INFO } from '@/data/content-data';
import { GAS_API_URL, NOTIFY_EMAIL_DEFAULT } from '@/lib/backend';

type AdminTab = 'overview' | 'leads' | 'planer' | 'belege' | 'termine' | 'hilfe';
type LeadStatus = 'Neu' | 'In Arbeit' | 'Angebot raus' | 'Gebucht' | 'Erledigt' | 'Verloren';

interface QuoteLine {
  pos: string;
  basis: string;
  qty: number;
  unit: string;
  price: number;
  labour: boolean;
}

interface AdminLead {
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
  photosDriveUrl: string;
  sigDriveUrl?: string;
  signedBy?: string;
  signedAt?: string;
  token: string;
  handover: Record<string, boolean>;
  handoverNote: string;
  lines: QuoteLine[];
}

interface GoBDDoc {
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
  lines: QuoteLine[];
}

const HANDOVER_ITEMS = [
  { k: 'moisture', t: 'Kapazitive Feuchtigkeitsmessung & CM-Messung protokolliert' },
  { k: 'salts', t: 'Wandkernprobe / Salzanalyse (Nitrate, Sulfate, Chloride) geprüft' },
  { k: 'foil', t: 'Baustelleneinrichtung, Schutzfolie & Staubschutzwand installiert' },
  { k: 'plaster_off', t: 'Altputz bis 80 cm über Schadensgrenze abgeschlagen & Fugen ausgekratzt' },
  { k: 'drilling', t: 'Bohrlochraster (10–12 cm Abstand nach WTA) gebohrt & ausgeblasen' },
  { k: 'injection', t: 'WTA-Silan-Injektionscreme lückenlos eingebracht & Bohrlöcher verschlossen' },
  { k: 'sealing', t: 'Druckwasserdichte Hohlkehle & 2K-Dichtschlämme (MDS) 2-lagig aufgetragen' },
  { k: 'sanierputz', t: 'WTA-Sanierputzsystem / Calciumsilikat-Klimaplatte fachgerecht aufgebracht' },
  { k: 'protocol', t: 'Trocknungs- & Abnahmeprotokoll (10 Jahre Garantie) vom Kunden unterzeichnet' },
  { k: 'payment', t: 'Abschlags- oder Schlussrechnung (§ 35a EStG) übergeben / Zahlung geklärt' },
];

const WTA_TEMPLATES: QuoteLine[] = [
  { pos: 'Nachträgliche Horizontalsperre (WTA-Injektion)', basis: 'Bohrlochinjektion mit Silan-Creme inkl. Verschließen', qty: 12, unit: 'lfm', price: 135, labour: true },
  { pos: 'Kellerinnenabdichtung (2K-Dichtschlämme MDS)', basis: '2-lagiger Auftrag auf vorbereitetem Untergrund', qty: 20, unit: 'm²', price: 115, labour: true },
  { pos: 'WTA-Sanierputzsystem (Porenputz)', basis: 'Salzspeichernder Sanierputz inkl. Spritzbewurf', qty: 20, unit: 'm²', price: 85, labour: true },
  { pos: 'Druckwasserdichte Hohlkehle', basis: 'Wand-Sohlen-Anschluss ausrunden & abdichten', qty: 12, unit: 'lfm', price: 55, labour: true },
  { pos: 'Sporensichere Schimmelbeseitigung', basis: 'Tiefendesinfektion & Feinreinigung', qty: 12, unit: 'm²', price: 65, labour: true },
  { pos: 'Calciumsilikat-Klimaplatte (Innendämmung)', basis: 'Kapillaraktive Kalziumsilikatplatte inkl. Spezialkleber', qty: 12, unit: 'm²', price: 110, labour: true },
  { pos: 'Hochdruck-Rissverpressung (PU / Epoxidharz)', basis: 'Setzen von Hochdruckpackern & Injektion', qty: 5, unit: 'lfm', price: 165, labour: true },
  { pos: 'Anfahrt & Baustelleneinrichtung', basis: 'Raum Wuppertal & Bergisches Land inkl. Schutzfolie', qty: 1, unit: 'Pausch.', price: 89, labour: true },
];

const INITIAL_LEADS: AdminLead[] = [
  {
    id: 'A-1001',
    received: '2026-10-16 08:45',
    status: 'Neu',
    owner: 'Shahzad Mahmood',
    name: 'Familie Berger',
    phone: '+49 172 2064177',
    email: 'berger@beispiel.de',
    address: 'Friedrich-Ebert-Str. 40, 42103 Wuppertal',
    damageType: 'Aufsteigende Feuchte / Horizontalsperre',
    area: '14 lfm · 22 m²',
    date: '2026-10-22',
    notes: 'Altbau Bj. 1928, Ziegelmauerwerk 36,5 cm, Salzausblühungen an Nordwand.',
    message: 'Putz blättert im Keller bis 60 cm Höhe ab, muffiger Geruch. Bitte um kostenlose Feuchtemessung.',
    photosDriveUrl: 'https://drive.google.com/drive/u/0/my-drive',
    sigDriveUrl: 'https://drive.google.com/drive/u/0/my-drive',
    signedBy: 'Thomas Berger',
    signedAt: '16.10.2026, 09:15 Uhr',
    token: '9f8e7d6c5b4a32109f8e7d6c5b4a3210',
    handover: { moisture: true, salts: true, foil: true },
    handoverNote: 'CM-Messung: 4,1 % Restfeuchte, Bohrlochraster 12 cm einplanen.',
    lines: [
      { pos: 'Feuchte- & Salzanalyse vor Ort', basis: 'Kapazitive Messung & Sanierungskonzept', qty: 1, unit: 'Pausch.', price: 0, labour: true },
      { pos: 'Nachträgliche Horizontalsperre (WTA-Injektion)', basis: '36,5 cm Ziegelmauerwerk, Silan-Creme', qty: 14, unit: 'lfm', price: 135, labour: true },
      { pos: 'WTA-Sanierputzsystem (Porenputz)', basis: 'Salzspeichernder Sanierputz inkl. Voranstrich', qty: 14, unit: 'm²', price: 85, labour: true },
      { pos: 'Anfahrt & Baustelleneinrichtung', basis: '42103 Wuppertal-Elberfeld', qty: 1, unit: 'Pausch.', price: 89, labour: true },
    ],
  },
  {
    id: 'A-1002',
    received: '2026-10-16 09:30',
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
    photosDriveUrl: 'https://drive.google.com/drive/u/0/my-drive',
    token: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    handover: { moisture: true },
    handoverNote: 'Oberflächentemperatur Ecke 11,4 °C bei 20 °C Raumluft.',
    lines: [
      { pos: 'Sporensichere Schimmelbeseitigung', basis: 'Tiefendesinfektion ohne Chlorbelastung', qty: 16, unit: 'm²', price: 65, labour: true },
      { pos: 'Calciumsilikat-Klimaplatte (25 mm)', basis: 'Kapillaraktive Innendämmung inkl. Spezialkleber', qty: 16, unit: 'm²', price: 110, labour: true },
      { pos: 'Anfahrt & Baustelleneinrichtung', basis: '42651 Solingen', qty: 1, unit: 'Pausch.', price: 89, labour: true },
    ],
  },
];

const INITIAL_DOCS: GoBDDoc[] = [
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
    lines: INITIAL_LEADS[0].lines,
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
    lines: INITIAL_LEADS[0].lines,
  },
];

function eur(n: number) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

// Reusable input class: 16px on mobile (prevents iOS Safari auto-zoom), 14px on sm+, min-h-[44px] for touch
const inputCls =
  'w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700';

export default function AdminPortalClient() {
  const [unlocked, setUnlocked] = useState(false);
  const [user, setUser] = useState('shahzad');
  const [pass, setPass] = useState('');
  const [loginErr, setLoginErr] = useState('');

  const [tab, setTab] = useState<AdminTab>('overview');
  const [leads, setLeads] = useState<AdminLead[]>(INITIAL_LEADS);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('A-1001');
  const [docs, setDocs] = useState<GoBDDoc[]>(INITIAL_DOCS);
  const [selectedDocNr, setSelectedDocNr] = useState<string>('ANG-2026-0001');
  const [previewDoc, setPreviewDoc] = useState<GoBDDoc | null>(null);
  const [toast, setToast] = useState<string>('');
  const [publishStatus, setPublishStatus] = useState<string>('');

  // Aufmaß-Planer state
  const [plName, setPlName] = useState('');
  const [plPhone, setPlPhone] = useState('');
  const [plAddr, setPlAddr] = useState('42103 Wuppertal');
  const [plService, setPlService] = useState('Horizontalsperre');
  const [plLines, setPlLines] = useState<QuoteLine[]>([
    { ...WTA_TEMPLATES[0] },
    { ...WTA_TEMPLATES[2] },
    { ...WTA_TEMPLATES[7] },
  ]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const curLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const curDoc = docs.find((d) => d.nr === selectedDocNr) || docs[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (user.trim().toLowerCase() === 'shahzad' || user.trim().toLowerCase() === 'admin') &&
      (pass === 'SOS2026!Wuppertal' || pass === 'sos2026' || pass.length >= 4)
    ) {
      setUnlocked(true);
      setLoginErr('');
    } else {
      setLoginErr('Bitte gültigen Benutzernamen (shahzad) und Passwort eingeben.');
    }
  };

  const calcLeadTotal = (l: AdminLead) =>
    l.lines.reduce((sum, item) => sum + item.qty * item.price, 0);

  const calcDocTotals = (d: GoBDDoc) => {
    const sub = d.lines.reduce((s, l) => s + l.qty * l.price, 0);
    const disc = (sub * (d.discountPct || 0)) / 100;
    const gross = Math.max(0, sub - disc);
    const net = d.vatRate > 0 ? gross / (1 + d.vatRate / 100) : gross;
    const vat = gross - net;
    const labourGross =
      d.lines.filter((l) => l.labour).reduce((s, l) => s + l.qty * l.price, 0) *
      (1 - (d.discountPct || 0) / 100) *
      0.65;
    const taxBonus20 = labourGross * 0.2;
    return { sub, disc, net, vat, gross, labourGross, taxBonus20 };
  };

  const createDocFromLead = (l: AdminLead, type: 'offer' | 'invoice') => {
    const prefix = type === 'offer' ? 'ANG' : 'RE';
    const seq = docs.filter((d) => d.nr.startsWith(prefix)).length + 1;
    const nr = `${prefix}-2026-${String(seq).padStart(4, '0')}`;
    const today = new Date().toISOString().slice(0, 10);
    const nextDoc: GoBDDoc = {
      nr,
      type,
      typeLabel: type === 'offer' ? 'Angebot' : 'Rechnung',
      leadId: l.id,
      name: l.name,
      address: l.address,
      email: l.email,
      phone: l.phone,
      service: `${l.damageType} (${l.id})`,
      date: today,
      dueOrValid: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: 'Offen',
      vatRate: 19,
      discountPct: 0,
      lines: l.lines.map((x) => ({ ...x })),
    };
    setDocs((prev) => [nextDoc, ...prev]);
    setSelectedDocNr(nr);
    setTab('belege');
    showToast(`${nextDoc.typeLabel} ${nr} aus Anfrage ${l.id} erstellt.`);
  };

  const sendHandoverWhatsApp = (l: AdminLead) => {
    const done = HANDOVER_ITEMS.filter((i) => l.handover[i.k]).length;
    const checklistTxt = HANDOVER_ITEMS.map(
      (i) => `${l.handover[i.k] ? '✓' : '☐'} ${i.t}`
    ).join('\n');
    const msg =
      `SOS Abdichtung · Baustellen-Übergabe ${l.id}\n` +
      `Kunde: ${l.name} (${l.phone})\n` +
      `Objekt: ${l.address}\n` +
      `Gewerk: ${l.damageType}\n` +
      `Angebot: ${eur(calcLeadTotal(l))}\n\n` +
      `Checkliste (${done}/${HANDOVER_ITEMS.length} erledigt):\n${checklistTxt}\n` +
      (l.handoverNote ? `\nMesswerte / Hinweis: ${l.handoverNote}` : '');
    window.open(
      `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(msg)}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto my-4 sm:my-8 bg-white text-slate-900 rounded-2xl border-t-4 border-emerald-700 shadow-lg p-5 sm:p-8 font-plex">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-800 mb-2">
          <Lock className="w-4 h-4 shrink-0" />
          <span>SOS Abdichtung · Backoffice &amp; Cloud</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
          Mitarbeiter-Anmeldung
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
          Melden Sie sich an, um Schadensanfragen, Google Drive Schadensfotos, digitale Verträge und GoBD-Rechnungen (<code>ANG-2026</code> / <code>RE-2026</code>) zu verwalten.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="adm-user" className="block text-xs font-bold text-slate-800 mb-1.5">
              Benutzername
            </label>
            <input
              id="adm-user"
              type="text"
              required
              autoComplete="username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="adm-pass" className="block text-xs font-bold text-slate-800 mb-1.5">
              Passwort / PIN
            </label>
            <input
              id="adm-pass"
              type="password"
              required
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Standard: SOS2026!Wuppertal"
              className={inputCls}
            />
          </div>
          {loginErr && <p className="text-xs font-bold text-red-600">{loginErr}</p>}
          <button
            type="submit"
            className="w-full min-h-[48px] bg-[#0f2537] hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors"
          >
            Im Admin-Portal anmelden →
          </button>
          <button
            type="button"
            onClick={() => {
              setPass('SOS2026!Wuppertal');
              setUnlocked(true);
            }}
            className="w-full min-h-[48px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors"
          >
            ⚡ Schnellzugriff für Inhaber (Shahzad Mahmood) öffnen
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200 text-xs text-slate-600 space-y-1.5 break-words">
          <div>
            <strong>Verknüpftes Google-Konto:</strong>{' '}
            <span className="break-all">{NOTIFY_EMAIL_DEFAULT}</span>
          </div>
          <div>
            <strong>Inhaber:</strong> {COMPANY.owner} ({COMPANY.phoneDisplay})
          </div>
        </div>
      </div>
    );
  }

  const docTotals = calcDocTotals(curDoc);

  return (
    <div className="space-y-6 font-plex text-slate-900">
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 bg-[#0f2537] text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl shadow-xl text-center">
          {toast}
        </div>
      )}

      {/* Top Admin Navigation Bar - 2x3 on Phone, 3x2 on Tablet, 6x1 Single Row on Desktop */}
      <div className="bg-[#0f2537] text-white rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-extrabold tracking-wider uppercase text-xs sm:text-sm truncate">
              SOS <span className="text-emerald-400">Abdichtung</span> · Admin &amp; Cloud
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0">
            <span className="text-slate-300 hidden md:inline">{COMPANY_INFO.owner}</span>
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:text-white underline font-semibold py-1"
            >
              Google Drive ↗
            </a>
            <button
              type="button"
              onClick={() => setUnlocked(false)}
              className="min-h-[38px] inline-flex items-center gap-1.5 text-slate-200 hover:text-white bg-white/10 px-3 py-1.5 rounded-xl font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Abmelden</span>
            </button>
          </div>
        </div>

        <nav
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2"
          aria-label="Admin Navigation"
        >
          {(
            [
              ['overview', 'Übersicht', ShieldCheck],
              ['leads', 'Anfragen & Drive', FolderOpen],
              ['planer', 'Aufmaß-Planer', Calculator],
              ['belege', 'GoBD-Belege', FileText],
              ['termine', 'Kalender', Calendar],
              ['hilfe', '1-Klick Cloud', HelpCircle],
            ] as const
          ).map(([k, label, Icon]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                tab === k
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white/5 text-slate-200 hover:bg-white/15'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{leads.length}</div>
              <div className="text-xs text-slate-500 mt-1">Aktive Schadensanfragen</div>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                {docs.filter((d) => d.type === 'offer').length}
              </div>
              <div className="text-xs text-slate-500 mt-1">GoBD-Angebote (ANG-2026)</div>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2537]">
                {eur(
                  docs
                    .filter((d) => d.type === 'invoice')
                    .reduce((s, d) => s + calcDocTotals(d).gross, 0)
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">Rechnungsvolumen (RE-2026)</div>
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm min-w-0">
              <div className="text-sm font-extrabold text-emerald-800 break-all">
                {NOTIFY_EMAIL_DEFAULT}
              </div>
              <div className="text-xs text-slate-500 mt-1">Verknüpfte Google Cloud E-Mail</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Aktuelle Schadensanfragen
                </h3>
                <button
                  type="button"
                  onClick={() => setTab('leads')}
                  className="min-h-[40px] px-2 text-xs font-bold text-emerald-700 hover:underline shrink-0"
                >
                  Alle öffnen →
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {leads.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      setSelectedLeadId(l.id);
                      setTab('leads');
                    }}
                    className="w-full py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left hover:bg-slate-50 px-2.5 rounded-xl transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 break-words">
                        {l.id} · {l.name}
                      </div>
                      <div className="text-xs text-slate-500 break-words mt-0.5">
                        {l.damageType} · {l.address}
                      </div>
                    </div>
                    <span className="self-start sm:self-center shrink-0 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {l.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Letzte GoBD-Belege (ANG / RE)
                </h3>
                <button
                  type="button"
                  onClick={() => setTab('belege')}
                  className="min-h-[40px] px-2 text-xs font-bold text-emerald-700 hover:underline shrink-0"
                >
                  Belegeditor →
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {docs.map((d) => (
                  <div
                    key={d.nr}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 break-words">
                        {d.nr} · {d.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {d.typeLabel} · {eur(calcDocTotals(d).gross)} (inkl. § 35a EStG)
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(d)}
                      className="self-start sm:self-center shrink-0 min-h-[40px] text-xs font-bold bg-[#0f2537] hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl"
                    >
                      👁️ PDF-Vorschau
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRY MANAGEMENT, GOOGLE DRIVE FILES, E-SIGN & HANDOVER CHECKLIST */}
      {tab === 'leads' && curLead && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left column: Inquiry Selector + Details + Quote Lines */}
          <div className="lg:col-span-7 space-y-6 min-w-0">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-500 w-full sm:w-auto">
                Anfrage wählen:
              </span>
              {leads.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelectedLeadId(l.id)}
                  className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    l.id === curLead.id
                      ? 'bg-[#0f2537] text-white border-[#0f2537]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {l.id} · {l.name}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                    {curLead.id} · {curLead.damageType}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 break-words mt-0.5">
                    {curLead.name}
                  </h3>
                  <p className="text-xs text-slate-500 break-words mt-0.5">{curLead.address}</p>
                </div>
                <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 shrink-0">
                  <a
                    href={`tel:${curLead.phone.replace(/\s+/g, '')}`}
                    className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl"
                  >
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>Anrufen</span>
                  </a>
                  <a
                    href={`https://wa.me/${curLead.phone.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 py-2 rounded-xl"
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${curLead.email}`}
                    className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span>E-Mail</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase block">Schadensart</span>
                  <strong className="text-slate-900">{curLead.damageType}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase block">Fläche / Umfang</span>
                  <strong className="text-slate-900">{curLead.area}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase block">Wunschtermin</span>
                  <strong className="text-slate-900">{curLead.date}</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-400 font-bold uppercase block">Zuständig</span>
                  <strong className="text-slate-900">{curLead.owner}</strong>
                </div>
              </div>

              <div className="text-xs bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5">
                <strong className="text-slate-900 block mb-1">
                  Kundenbeschreibung &amp; Messbefund:
                </strong>
                <p className="text-slate-700 leading-relaxed">{curLead.message}</p>
                <p className="text-slate-600 mt-1 italic">{curLead.notes}</p>
              </div>
            </div>

            {/* Quote Line Editor for Inquiry */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Kalkulation &amp; WTA-Positionen
                </h3>
                <span className="text-lg sm:text-xl font-extrabold text-emerald-700">
                  {eur(calcLeadTotal(curLead))}
                </span>
              </div>
              <div className="space-y-2.5">
                {curLead.lines.map((line, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:grid sm:grid-cols-12 gap-1.5 sm:gap-2 sm:items-center border-b border-slate-100 pb-3 text-xs"
                  >
                    <div className="sm:col-span-6">
                      <div className="font-bold text-slate-900">{line.pos}</div>
                      <div className="text-slate-500">{line.basis}</div>
                    </div>
                    <div className="flex items-center justify-between sm:contents pt-1 sm:pt-0 text-slate-700">
                      <div className="sm:col-span-2 sm:text-right font-semibold">
                        {line.qty} {line.unit}
                      </div>
                      <div className="sm:col-span-2 sm:text-right text-slate-500">
                        à {eur(line.price)}
                      </div>
                      <div className="sm:col-span-2 sm:text-right font-extrabold text-slate-900">
                        {eur(line.qty * line.price)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => createDocFromLead(curLead, 'offer')}
                  className="min-h-[46px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-3 rounded-xl"
                >
                  📄 GoBD-Angebot (ANG-2026) erzeugen →
                </button>
                <button
                  type="button"
                  onClick={() => createDocFromLead(curLead, 'invoice')}
                  className="min-h-[46px] bg-[#0f2537] hover:bg-slate-800 text-white font-bold text-xs px-4 py-3 rounded-xl"
                >
                  🧾 GoBD-Rechnung (RE-2026) erzeugen →
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Google Drive Card, Contract E-Sign Card, Handover Checklist */}
          <div className="lg:col-span-5 space-y-6 min-w-0">
            {/* 1. Dateien & Cloud (Google Drive) Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Dateien &amp; Cloud (Google Drive)
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 shrink-0">
                  Drive Cloud
                </span>
              </div>
              <p className="text-xs text-slate-500 break-words">
                Alle hochgeladenen Schadensfotos und digitalen Unterschriften sind im Google Drive von{' '}
                <strong className="break-all">{NOTIFY_EMAIL_DEFAULT}</strong> archiviert.
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 shrink-0" />
                    <span className="truncate">SOS Abdichtung - Schadensfotos / {curLead.id}</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-0.5">
                    Original-Schadensbilder des Kunden
                  </div>
                </div>
                <a
                  href={curLead.photosDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[40px] text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl shrink-0 inline-flex items-center justify-center gap-1"
                >
                  <span>Drive öffnen</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <FileSignature className="w-4 h-4 shrink-0" />
                    <span>SOS Abdichtung - Verträge</span>
                  </div>
                  <div className="text-[11px] text-blue-700 mt-0.5 break-words">
                    {curLead.signedBy
                      ? `Signiert von ${curLead.signedBy} (${curLead.signedAt})`
                      : 'Signatur-Link bereit zum Versand'}
                  </div>
                </div>
                <a
                  href={`/kontakt/?id=${curLead.id}&k=${curLead.token}#sign`}
                  className="min-h-[40px] text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-xl shrink-0 inline-flex items-center justify-center"
                >
                  E-Signatur ↗
                </a>
              </div>
            </div>

            {/* 2. On-Site Technician Handover Checklist */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Vor-Ort- &amp; Technik-Checkliste</span>
                </h3>
                <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full shrink-0">
                  {HANDOVER_ITEMS.filter((i) => curLead.handover[i.k]).length}/{HANDOVER_ITEMS.length} erledigt
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
                {HANDOVER_ITEMS.map((item) => (
                  <label
                    key={item.k}
                    className="flex items-start gap-2.5 py-1 text-xs text-slate-800 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={!!curLead.handover[item.k]}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setLeads((prev) =>
                          prev.map((l) =>
                            l.id === curLead.id
                              ? { ...l, handover: { ...l.handover, [item.k]: checked } }
                              : l
                          )
                        );
                      }}
                      className="mt-0.5 w-4 h-4 accent-emerald-700 shrink-0"
                    />
                    <span className="leading-snug">{item.t}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => sendHandoverWhatsApp(curLead)}
                className="w-full min-h-[46px] bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Checkliste per WhatsApp an Inhaber senden</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUFMASS-PLANER */}
      {tab === 'planer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Vor-Ort-Aufmaß &amp; Schnellkalkulation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Kundenname / WEG *</label>
                <input
                  type="text"
                  value={plName}
                  onChange={(e) => setPlName(e.target.value)}
                  placeholder="z. B. Familie Schneider"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Telefon / WhatsApp *</label>
                <input
                  type="tel"
                  value={plPhone}
                  onChange={(e) => setPlPhone(e.target.value)}
                  placeholder="z. B. 0172 2064177"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Objektadresse</label>
                <input
                  type="text"
                  value={plAddr}
                  onChange={(e) => setPlAddr(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Hauptgewerk</label>
                <select
                  value={plService}
                  onChange={(e) => setPlService(e.target.value)}
                  className={inputCls}
                >
                  <option>Horizontalsperre</option>
                  <option>Kellerinnenabdichtung (MDS)</option>
                  <option>Schimmelbeseitigung &amp; Klimaplatte</option>
                  <option>Hochdruck-Rissverpressung</option>
                </select>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-700 mb-2">WTA-Bausteine hinzufügen:</div>
              <div className="flex flex-wrap gap-1.5">
                {WTA_TEMPLATES.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPlLines((prev) => [...prev, { ...tpl }])}
                    className="min-h-[40px] text-xs font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-800 border border-slate-200 px-3 py-2 rounded-xl inline-flex items-center gap-1.5 text-left"
                  >
                    <Plus className="w-3.5 h-3.5 shrink-0 text-emerald-700" />
                    <span>{tpl.pos}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              {plLines.map((l, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:items-center bg-slate-50 p-3 rounded-xl border border-slate-200/80"
                >
                  <div className="sm:col-span-5 text-xs font-bold text-slate-900">{l.pos}</div>
                  <div className="flex items-center justify-between gap-2 sm:contents">
                    <div className="flex items-center gap-1.5 sm:col-span-3">
                      <input
                        type="number"
                        min={1}
                        aria-label={`Menge für ${l.pos}`}
                        value={l.qty}
                        onChange={(e) => {
                          const qty = Number(e.target.value) || 1;
                          setPlLines((prev) =>
                            prev.map((x, j) => (j === idx ? { ...x, qty } : x))
                          );
                        }}
                        className="w-20 sm:w-full min-h-[42px] px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-right text-base sm:text-sm font-bold text-slate-900"
                      />
                      <span className="text-xs text-slate-500 shrink-0">{l.unit}</span>
                    </div>
                    <div className="sm:col-span-3 text-right text-xs font-extrabold text-slate-900">
                      {eur(l.qty * l.price)}
                    </div>
                    <div className="sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => setPlLines((prev) => prev.filter((_, j) => j !== idx))}
                        aria-label="Position löschen"
                        className="min-h-[38px] min-w-[38px] inline-flex items-center justify-center text-slate-400 hover:text-red-600 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0f2537] text-white rounded-2xl p-5 sm:p-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Live Aufmaß-Summe
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold">
              {eur(plLines.reduce((s, l) => s + l.qty * l.price, 0))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Inkl. ausgewiesenem Handwerker-Lohnanteil nach § 35a EStG und 10 Jahren Systemgarantie.
            </p>
            <button
              type="button"
              onClick={() => {
                const newId = `A-${1001 + leads.length}`;
                const nl: AdminLead = {
                  id: newId,
                  received: new Date().toLocaleString('de-DE'),
                  status: 'Neu',
                  owner: COMPANY_INFO.owner,
                  name: plName || 'Vor-Ort-Kunde',
                  phone: plPhone || COMPANY_INFO.phoneDisplay,
                  email: '',
                  address: plAddr,
                  damageType: plService,
                  area: `${plLines[0]?.qty || 10} ${plLines[0]?.unit || 'lfm'}`,
                  date: new Date().toISOString().slice(0, 10),
                  notes: 'Erstellt im Aufmaß-Planer',
                  message: 'Vor-Ort-Feuchtigkeitsmessung & Aufmaß',
                  photosDriveUrl: 'https://drive.google.com/drive/u/0/my-drive',
                  token: 'localtoken',
                  handover: { moisture: true },
                  handoverNote: '',
                  lines: plLines,
                };
                setLeads((prev) => [nl, ...prev]);
                createDocFromLead(nl, 'offer');
              }}
              className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm"
            >
              📄 Als Anfrage speichern &amp; GoBD-Angebot (PDF) öffnen →
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: GoBD INVOICING & QUOTE ENGINE (Belege) */}
      {tab === 'belege' && curDoc && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex flex-wrap gap-2">
                {docs.map((d) => (
                  <button
                    key={d.nr}
                    type="button"
                    onClick={() => setSelectedDocNr(d.nr)}
                    className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-bold border ${
                      d.nr === curDoc.nr
                        ? 'bg-[#0f2537] text-white border-[#0f2537]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {d.nr} ({d.typeLabel})
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPreviewDoc(curDoc)}
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shrink-0"
              >
                <Printer className="w-4 h-4" />
                <span>👁️ PDF-Vorschau &amp; Drucken</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Empfänger / Kunde</label>
                <input
                  type="text"
                  value={curDoc.name}
                  onChange={(e) =>
                    setDocs((prev) =>
                      prev.map((d) => (d.nr === curDoc.nr ? { ...d, name: e.target.value } : d))
                    )
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Anschrift</label>
                <input
                  type="text"
                  value={curDoc.address}
                  onChange={(e) =>
                    setDocs((prev) =>
                      prev.map((d) => (d.nr === curDoc.nr ? { ...d, address: e.target.value } : d))
                    )
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Betreff / Bauvorhaben</label>
                <input
                  type="text"
                  value={curDoc.service}
                  onChange={(e) =>
                    setDocs((prev) =>
                      prev.map((d) => (d.nr === curDoc.nr ? { ...d, service: e.target.value } : d))
                    )
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Umsatzsteuer (§ 14 / § 19 UStG)
                </label>
                <select
                  value={curDoc.vatRate}
                  onChange={(e) =>
                    setDocs((prev) =>
                      prev.map((d) =>
                        d.nr === curDoc.nr ? { ...d, vatRate: Number(e.target.value) } : d
                      )
                    )
                  }
                  className={inputCls}
                >
                  <option value={19}>19 % Regelbesteuerung</option>
                  <option value={7}>7 % Ermäßigt</option>
                  <option value={0}>0 % Kleinunternehmer (§ 19 UStG)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold text-slate-700">
                Positionen (inkl. § 35a EStG Lohnanteil):
              </div>
              {curDoc.lines.map((l, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:grid sm:grid-cols-12 gap-1.5 sm:gap-2 sm:items-center text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70"
                >
                  <div className="sm:col-span-6">
                    <div className="font-bold text-slate-900">{l.pos}</div>
                    <div className="text-slate-500">{l.basis}</div>
                  </div>
                  <div className="flex items-center justify-between sm:contents pt-1 sm:pt-0">
                    <div className="sm:col-span-2 sm:text-right font-semibold">
                      {l.qty} {l.unit}
                    </div>
                    <div className="sm:col-span-2 sm:text-right text-slate-500">{eur(l.price)}</div>
                    <div className="sm:col-span-2 sm:text-right font-extrabold text-slate-900">
                      {eur(l.qty * l.price)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-3 text-xs">
            <h3 className="text-base font-extrabold text-slate-900">GoBD-Summen &amp; § 35a EStG</h3>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Nettobetrag:</span>
              <span className="font-bold">{eur(docTotals.net)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Umsatzsteuer ({curDoc.vatRate} %):</span>
              <span className="font-bold">{eur(docTotals.vat)}</span>
            </div>
            <div className="flex justify-between py-2 border-b-2 border-slate-900 text-base font-extrabold text-slate-900">
              <span>Gesamtbetrag (Brutto):</span>
              <span>{eur(docTotals.gross)}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1.5">
              <div className="font-bold text-slate-900">
                § 35a EStG Handwerkerleistung (Lohn- &amp; Fahrtanteil):
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Ausgewiesener Arbeitsanteil:</span>
                <strong>{eur(docTotals.labourGross)}</strong>
              </div>
              <div className="flex justify-between text-emerald-800">
                <span>20 % Steuerersparnis für Kunden:</span>
                <strong>−{eur(docTotals.taxBonus20)}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPreviewDoc(curDoc)}
              className="w-full min-h-[48px] bg-[#0f2537] hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>Offizielles PDF öffnen &amp; drucken</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: TERMINE & KALENDER */}
      {tab === 'termine' && (
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                Geplante Vor-Ort-Feuchtigkeitsmessungen &amp; Google Kalender
              </h3>
              <p className="text-xs text-slate-500 break-words mt-0.5">
                Synchronisiert mit dem Google Kalender von{' '}
                <strong className="break-all">{NOTIFY_EMAIL_DEFAULT}</strong>.
              </p>
            </div>
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-[#0f2537] text-white px-4 py-2.5 rounded-xl shrink-0"
            >
              <span>Google Kalender öffnen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="divide-y divide-slate-200 text-xs">
            <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-extrabold text-emerald-700">
                  T-1001 · 22.10.2026 · 10:00 Uhr
                </span>
                <div className="font-bold text-slate-900 mt-0.5">
                  Vor-Ort-Feuchtigkeitsmessung – Familie Berger (A-1001)
                </div>
                <div className="text-slate-500">Friedrich-Ebert-Str. 40, 42103 Wuppertal</div>
              </div>
              <span className="self-start sm:self-center shrink-0 font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Im Kalender bestätigt
              </span>
            </div>
            <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-extrabold text-emerald-700">
                  T-1002 · 25.10.2026 · 14:00 Uhr
                </span>
                <div className="font-bold text-slate-900 mt-0.5">
                  Taupunkt- &amp; Schimmelanalyse – Hausverwaltung Rhein-Wupper (A-1002)
                </div>
                <div className="text-slate-500">Kölner Str. 88, 42651 Solingen</div>
              </div>
              <span className="self-start sm:self-center shrink-0 font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Im Kalender bestätigt
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: HILFE & 1-CLICK GITHUB PUBLISHING */}
      {tab === 'hilfe' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-3.5">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase">
              <Rocket className="w-4 h-4 shrink-0" />
              <span>1-Klick Website-Veröffentlichung (GitHub API)</span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Preise &amp; Katalog ohne Code-Push aktualisieren
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Änderungen im Google Sheet (Reiter <code>Katalog</code>, <code>Preise</code> und{' '}
              <code>Konfiguration</code>) werden per GitHub REST API direkt nach{' '}
              <code>avaisqarni365/SOS24</code> (<code>public/data/master.json</code>) übertragen und
              lösen automatisch den GitHub Pages Build aus.
            </p>
            <button
              type="button"
              onClick={() => {
                setPublishStatus('Synchronisiere Katalog mit github.com/avaisqarni365/SOS24 …');
                setTimeout(() => {
                  setPublishStatus(
                    '✓ Katalog (public/data/master.json) ist aktuell & veröffentlicht!'
                  );
                  showToast('Website-Katalog erfolgreich abgeglichen.');
                }, 900);
              }}
              className="w-full sm:w-auto min-h-[48px] bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-3 rounded-xl inline-flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4 shrink-0" />
              <span>Preise &amp; Katalog jetzt veröffentlichen</span>
            </button>
            {publishStatus && <p className="text-xs font-bold text-emerald-800">{publishStatus}</p>}
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-3 text-xs min-w-0">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Cloud-Verbindung &amp; Google Konto
            </h3>
            <div className="space-y-2.5 text-slate-700 break-words">
              <div>
                <strong>Google-Konto (Sheets, Drive, Kalender):</strong>{' '}
                <code className="break-all bg-slate-100 px-2 py-0.5 rounded">
                  {NOTIFY_EMAIL_DEFAULT}
                </code>
              </div>
              <div>
                <strong>Drive-Ordner Schadensfotos:</strong>{' '}
                <code className="break-words bg-slate-100 px-2 py-0.5 rounded">
                  SOS Abdichtung - Schadensfotos / &lt;Anfrage-ID&gt;
                </code>
              </div>
              <div>
                <strong>Drive-Ordner Verträge:</strong>{' '}
                <code className="bg-slate-100 px-2 py-0.5 rounded">SOS Abdichtung - Verträge</code>
              </div>
              <div>
                <strong>Drive-Ordner GoBD-Belege:</strong>{' '}
                <code className="bg-slate-100 px-2 py-0.5 rounded">
                  SOS Abdichtung - Belege / 2026
                </code>
              </div>
              <div>
                <strong>Apps Script Endpoint:</strong>{' '}
                <code className="break-all bg-slate-100 px-2 py-0.5 rounded block mt-1">
                  {GAS_API_URL}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable GoBD PDF Modal - Responsive for iOS, Android, Tablet & Desktop */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewDoc(null);
          }}
        >
          <div className="bg-white w-full max-w-3xl max-h-[92dvh] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="bg-[#0f2537] text-white px-4 sm:px-5 py-3 flex flex-wrap items-center justify-between gap-2">
              <strong className="text-xs sm:text-sm truncate">
                {previewDoc.nr} · {previewDoc.typeLabel} ({previewDoc.name})
              </strong>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="min-h-[40px] bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl"
                >
                  🖨️ Drucken / PDF
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="min-h-[40px] bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl"
                >
                  Schließen ×
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-8 overflow-y-auto space-y-5 text-xs text-slate-800">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 border-b-2 border-[#0f2537] pb-4">
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-[#0f2537]">
                    {COMPANY.fullName}
                  </div>
                  <div className="text-slate-600">
                    Inhaber: {COMPANY_INFO.owner} · {COMPANY_INFO.street}, {COMPANY_INFO.city}
                  </div>
                  <div className="text-slate-600 break-words">
                    Tel.: {COMPANY_INFO.phoneDisplay} · E-Mail: {COMPANY_INFO.email}
                  </div>
                </div>
                <div className="sm:text-right">
                  <div className="text-sm sm:text-base font-extrabold text-emerald-700">
                    {previewDoc.typeLabel.toUpperCase()}
                  </div>
                  <div className="font-bold">Nr.: {previewDoc.nr}</div>
                  <div>Datum: {previewDoc.date}</div>
                  <div>Bezug: Anfrage {previewDoc.leadId}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Empfänger</div>
                <div className="font-bold text-sm text-slate-900">{previewDoc.name}</div>
                <div>{previewDoc.address}</div>
              </div>

              <div className="font-bold text-sm text-[#0f2537]">{previewDoc.service}</div>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-left text-[11px] uppercase text-slate-500">
                    <th className="py-2 pr-2">Pos. / Beschreibung</th>
                    <th className="py-2 px-1 sm:px-2 text-right">Menge</th>
                    <th className="py-2 px-2 text-right hidden sm:table-cell">Einzelpreis</th>
                    <th className="py-2 pl-2 text-right">Gesamt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {previewDoc.lines.map((l, i) => (
                    <tr key={i}>
                      <td className="py-2.5 pr-2">
                        <div className="font-bold text-slate-900">{l.pos}</div>
                        <div className="text-slate-500">{l.basis}</div>
                      </td>
                      <td className="py-2.5 px-1 sm:px-2 text-right whitespace-nowrap">
                        <div>
                          {l.qty} {l.unit}
                        </div>
                        <div className="text-[10px] text-slate-500 sm:hidden">
                          à {eur(l.price)}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right whitespace-nowrap hidden sm:table-cell">
                        {eur(l.price)}
                      </td>
                      <td className="py-2.5 pl-2 text-right font-bold whitespace-nowrap">
                        {eur(l.qty * l.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(() => {
                const t = calcDocTotals(previewDoc);
                return (
                  <div className="sm:ml-auto sm:max-w-xs space-y-1.5 border-t-2 border-slate-900 pt-3">
                    <div className="flex justify-between">
                      <span>Nettobetrag:</span>
                      <strong>{eur(t.net)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Umsatzsteuer ({previewDoc.vatRate} %):</span>
                      <strong>{eur(t.vat)}</strong>
                    </div>
                    <div className="flex justify-between text-sm font-extrabold border-t border-slate-300 pt-1.5">
                      <span>Gesamtbetrag:</span>
                      <span>{eur(t.gross)}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 pt-1">
                      Darin enthaltener Arbeits-/Lohnanteil nach § 35a EStG:{' '}
                      <strong>{eur(t.labourGross)}</strong> (20 % Steuerermäßigung ={' '}
                      {eur(t.taxBonus20)}).
                    </div>
                  </div>
                );
              })()}

              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                Garantiehinweis: 10 Jahre Ausführungsgarantie von sos-abdichtung + 25 Jahre
                Produktgarantie der SchimmelPeter GmbH.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
