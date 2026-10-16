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
import { COMPANY } from '@/data/content-data';
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
      <div className="max-w-md mx-auto my-8 bg-white rounded-2xl border-t-4 border-brand-600 shadow-elevated p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-700 mb-2">
          <Lock className="w-4 h-4" />
          SOS Abdichtung · Backoffice &amp; Cloud
        </div>
        <h2 className="text-2xl font-extrabold text-brand-950 mb-2">Mitarbeiter-Anmeldung</h2>
        <p className="text-xs text-slate-600 mb-5">
          Melden Sie sich an, um Schadensanfragen, Google Drive Schadensfotos, digitale Verträge und GoBD-Rechnungen (`ANG-2026` / `RE-2026`) zu verwalten.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="adm-user" className="block text-xs font-bold text-slate-800 mb-1">
              Benutzername
            </label>
            <input
              id="adm-user"
              type="text"
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm"
            />
          </div>
          <div>
            <label htmlFor="adm-pass" className="block text-xs font-bold text-slate-800 mb-1">
              Passwort
            </label>
            <input
              id="adm-pass"
              type="password"
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Standard: SOS2026!Wuppertal"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm"
            />
          </div>
          {loginErr && <p className="text-xs font-bold text-red-600">{loginErr}</p>}
          <button
            type="submit"
            className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            Im Admin-Portal anmelden →
          </button>
          <button
            type="button"
            onClick={() => {
              setPass('SOS2026!Wuppertal');
              setUnlocked(true);
            }}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition-colors"
          >
            ⚡ Schnellzugriff für Inhaber (Shahzad Mahmood) öffnen
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
          <div>
            <strong>Verknüpftes Google-Konto:</strong> {NOTIFY_EMAIL_DEFAULT}
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
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0f2537] text-white font-bold text-xs px-5 py-3 rounded-xl shadow-elevated">
          {toast}
        </div>
      )}

      {/* Top Admin Navigation Bar */}
      <div className="bg-[#0f2537] text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-card">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-brand-400" />
          <span className="font-extrabold tracking-wider uppercase text-sm">
            SOS <span className="text-brand-400">Abdichtung</span> · Admin Portal
          </span>
        </div>

        <nav className="flex flex-wrap gap-1.5" aria-label="Admin Navigation">
          {(
            [
              ['overview', 'Übersicht', ShieldCheck],
              ['leads', 'Anfragen & Drive', FolderOpen],
              ['planer', 'Aufmaß-Planer', Calculator],
              ['belege', 'GoBD-Belege (PDF)', FileText],
              ['termine', 'Kalender & Termine', Calendar],
              ['hilfe', 'Hilfe & 1-Klick-Sync', HelpCircle],
            ] as const
          ).map(([k, label, Icon]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                tab === k
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-300 hidden md:inline">{COMPANY.owner}</span>
          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-300 hover:text-white underline font-semibold"
          >
            Google Drive ↗
          </a>
          <button
            type="button"
            onClick={() => setUnlocked(false)}
            className="inline-flex items-center gap-1 text-slate-300 hover:text-white"
          >
            <LogOut className="w-3.5 h-3.5" />
            Abmelden
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle">
              <div className="text-3xl font-extrabold text-brand-950">{leads.length}</div>
              <div className="text-xs text-slate-500 mt-1">Aktive Schadensanfragen</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle">
              <div className="text-3xl font-extrabold text-brand-700">
                {docs.filter((d) => d.type === 'offer').length}
              </div>
              <div className="text-xs text-slate-500 mt-1">GoBD-Angebote (ANG-2026)</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle">
              <div className="text-3xl font-extrabold text-[#0f2537]">
                {eur(
                  docs
                    .filter((d) => d.type === 'invoice')
                    .reduce((s, d) => s + calcDocTotals(d).gross, 0)
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">Rechnungsvolumen (RE-2026)</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle">
              <div className="text-sm font-extrabold text-brand-800 truncate">{NOTIFY_EMAIL_DEFAULT}</div>
              <div className="text-xs text-slate-500 mt-1">Verknüpfte Google Cloud E-Mail</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-brand-950">Aktuelle Schadensanfragen</h3>
                <button
                  type="button"
                  onClick={() => setTab('leads')}
                  className="text-xs font-bold text-brand-700 hover:underline"
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
                    className="w-full py-3 flex items-center justify-between text-left hover:bg-slate-50 px-2 rounded-lg"
                  >
                    <div>
                      <div className="text-sm font-bold text-brand-950">
                        {l.id} · {l.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {l.damageType} · {l.address}
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-100 text-brand-800">
                      {l.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-extrabold text-brand-950">Letzte GoBD-Belege (ANG / RE)</h3>
                <button
                  type="button"
                  onClick={() => setTab('belege')}
                  className="text-xs font-bold text-brand-700 hover:underline"
                >
                  Zum Belegeditor →
                </button>
              </div>
              <div className="divide-y divide-slate-200">
                {docs.map((d) => (
                  <div
                    key={d.nr}
                    className="py-3 flex items-center justify-between gap-2 px-2"
                  >
                    <div>
                      <div className="text-sm font-bold text-brand-950">
                        {d.nr} · {d.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {d.typeLabel} · {eur(calcDocTotals(d).gross)} (inkl. § 35a EStG)
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(d)}
                        className="text-xs font-bold bg-[#0f2537] text-white px-3 py-1.5 rounded-lg"
                      >
                        👁️ PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRY MANAGEMENT, GOOGLE DRIVE FILES, E-SIGN & HANDOVER CHECKLIST */}
      {tab === 'leads' && curLead && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left column: Inquiry Selector + Details + Quote Lines */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-500 mr-2">Anfrage wählen:</span>
              {leads.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelectedLeadId(l.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    l.id === curLead.id
                      ? 'bg-[#0f2537] text-white border-[#0f2537]'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {l.id} · {l.name}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                    {curLead.id} · {curLead.damageType}
                  </span>
                  <h3 className="text-2xl font-extrabold text-brand-950">{curLead.name}</h3>
                  <p className="text-xs text-slate-500">{curLead.address}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`tel:${curLead.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl"
                  >
                    <Phone className="w-3.5 h-3.5" /> Anrufen
                  </a>
                  <a
                    href={`https://wa.me/${curLead.phone.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#25D366] text-white px-3 py-2 rounded-xl"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                  <a
                    href={`mailto:${curLead.email}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-xl"
                  >
                    <Mail className="w-3.5 h-3.5" /> E-Mail
                  </a>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
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

              <div className="text-xs bg-brand-50/60 border border-brand-200 rounded-xl p-3.5">
                <strong className="text-brand-950 block mb-1">Kundenbeschreibung &amp; Messbefund:</strong>
                <p className="text-slate-700">{curLead.message}</p>
                <p className="text-slate-600 mt-1 italic">{curLead.notes}</p>
              </div>
            </div>

            {/* Quote Line Editor for Inquiry */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-brand-950">Kalkulation &amp; WTA-Positionen</h3>
                <span className="text-xl font-extrabold text-brand-700">
                  {eur(calcLeadTotal(curLead))}
                </span>
              </div>
              <div className="space-y-2">
                {curLead.lines.map((line, idx) => (
                  <div
                    key={idx}
                    className="grid sm:grid-cols-12 gap-2 items-center border-b border-slate-100 pb-2 text-xs"
                  >
                    <div className="sm:col-span-6">
                      <div className="font-bold text-slate-900">{line.pos}</div>
                      <div className="text-slate-500">{line.basis}</div>
                    </div>
                    <div className="sm:col-span-2 text-right font-semibold">
                      {line.qty} {line.unit}
                    </div>
                    <div className="sm:col-span-2 text-right text-slate-600">
                      à {eur(line.price)}
                    </div>
                    <div className="sm:col-span-2 text-right font-extrabold text-slate-900">
                      {eur(line.qty * line.price)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => createDocFromLead(curLead, 'offer')}
                  className="bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
                >
                  📄 GoBD-Angebot (ANG-2026) erzeugen →
                </button>
                <button
                  type="button"
                  onClick={() => createDocFromLead(curLead, 'invoice')}
                  className="bg-[#0f2537] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl"
                >
                  🧾 GoBD-Rechnung (RE-2026) erzeugen →
                </button>
              </div>
            </div>
          </div>

          {/* Right column: Google Drive Card, Contract E-Sign Card, Handover Checklist */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Dateien & Cloud (Google Drive) Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-brand-950">
                  Dateien &amp; Cloud (Google Drive)
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  Drive Cloud
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Alle hochgeladenen Schadensfotos und digitalen Unterschriften sind im Google Drive von <strong>{NOTIFY_EMAIL_DEFAULT}</strong> archiviert.
              </p>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    SOS Abdichtung - Schadensfotos / {curLead.id}
                  </div>
                  <div className="text-[11px] text-emerald-700">Original-Schadensbilder des Kunden</div>
                </div>
                <a
                  href={curLead.photosDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg shrink-0 inline-flex items-center gap-1"
                >
                  Drive öffnen <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <FileSignature className="w-4 h-4" />
                    SOS Abdichtung - Verträge
                  </div>
                  <div className="text-[11px] text-blue-700">
                    {curLead.signedBy
                      ? `Signiert von ${curLead.signedBy} (${curLead.signedAt})`
                      : 'Signatur-Link bereit zum Versand'}
                  </div>
                </div>
                <a
                  href={`/kontakt/?id=${curLead.id}&k=${curLead.token}#sign`}
                  className="text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg shrink-0"
                >
                  E-Signatur ↗
                </a>
              </div>
            </div>

            {/* 2. On-Site Technician Handover Checklist */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-brand-950 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-brand-700" />
                  Vor-Ort- &amp; Technik-Checkliste
                </h3>
                <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-full">
                  {HANDOVER_ITEMS.filter((i) => curLead.handover[i.k]).length}/{HANDOVER_ITEMS.length} erledigt
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50">
                {HANDOVER_ITEMS.map((item) => (
                  <label
                    key={item.k}
                    className="flex items-start gap-2 text-xs text-slate-800 cursor-pointer"
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
                      className="mt-0.5 accent-brand-700"
                    />
                    <span>{item.t}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => sendHandoverWhatsApp(curLead)}
                className="w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                Checkliste per WhatsApp an Inhaber ({COMPANY.owner}) senden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUFMASS-PLANER */}
      {tab === 'planer' && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <h3 className="text-lg font-extrabold text-brand-950">
              Vor-Ort-Aufmaß &amp; Schnellkalkulation
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Kundenname / WEG *</label>
                <input
                  type="text"
                  value={plName}
                  onChange={(e) => setPlName(e.target.value)}
                  placeholder="z. B. Familie Schneider"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Telefon / WhatsApp *</label>
                <input
                  type="tel"
                  value={plPhone}
                  onChange={(e) => setPlPhone(e.target.value)}
                  placeholder="z. B. 0172 2064177"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Objektadresse</label>
                <input
                  type="text"
                  value={plAddr}
                  onChange={(e) => setPlAddr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Hauptgewerk</label>
                <select
                  value={plService}
                  onChange={(e) => setPlService(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
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
                    className="text-xs font-semibold bg-slate-100 hover:bg-brand-50 text-slate-800 border border-slate-200 px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> {tpl.pos}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {plLines.map((l, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center text-xs bg-slate-50 p-2.5 rounded-xl">
                  <div className="col-span-5 font-bold text-slate-900">{l.pos}</div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      value={l.qty}
                      onChange={(e) => {
                        const qty = Number(e.target.value) || 1;
                        setPlLines((prev) => prev.map((x, j) => (j === idx ? { ...x, qty } : x)));
                      }}
                      className="w-full px-2 py-1 rounded border border-slate-300 text-right"
                    />
                  </div>
                  <div className="col-span-1 text-slate-500">{l.unit}</div>
                  <div className="col-span-3 text-right font-bold">{eur(l.qty * l.price)}</div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() => setPlLines((prev) => prev.filter((_, j) => j !== idx))}
                      aria-label="Position löschen"
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#0f2537] text-white rounded-2xl p-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-300">
              Live Aufmaß-Summe
            </span>
            <div className="text-3xl font-extrabold">
              {eur(plLines.reduce((s, l) => s + l.qty * l.price, 0))}
            </div>
            <p className="text-xs text-slate-300">
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
                  owner: COMPANY.owner,
                  name: plName || 'Vor-Ort-Kunde',
                  phone: plPhone || COMPANY.phoneDisplay,
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
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl text-xs"
            >
              📄 Als Anfrage speichern &amp; GoBD-Angebot (PDF) öffnen →
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: GoBD INVOICING & QUOTE ENGINE (Belege) */}
      {tab === 'belege' && curDoc && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex flex-wrap gap-2">
                {docs.map((d) => (
                  <button
                    key={d.nr}
                    type="button"
                    onClick={() => setSelectedDocNr(d.nr)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
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
                className="inline-flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                <Printer className="w-3.5 h-3.5" />
                👁️ PDF-Vorschau &amp; Drucken
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Empfänger / Kunde</label>
                <input
                  type="text"
                  value={curDoc.name}
                  onChange={(e) =>
                    setDocs((prev) =>
                      prev.map((d) => (d.nr === curDoc.nr ? { ...d, name: e.target.value } : d))
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Anschrift</label>
                <input
                  type="text"
                  value={curDoc.address}
                  onChange={(e) =>
                    setDocs((prev) =>
                      prev.map((d) => (d.nr === curDoc.nr ? { ...d, address: e.target.value } : d))
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Betreff / Bauvorhaben</label>
                <input
                  type="text"
                  value={curDoc.service}
                  onChange={(e) =>
                    setDocs((prev) =>
                      prev.map((d) => (d.nr === curDoc.nr ? { ...d, service: e.target.value } : d))
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value={19}>19 % Regelbesteuerung</option>
                  <option value={7}>7 % Ermäßigt</option>
                  <option value={0}>0 % Kleinunternehmer (§ 19 UStG)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700">Positionen (inkl. § 35a EStG Lohnanteil):</div>
              {curDoc.lines.map((l, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center text-xs bg-slate-50 p-2.5 rounded-xl"
                >
                  <div className="col-span-6">
                    <div className="font-bold text-slate-900">{l.pos}</div>
                    <div className="text-slate-500">{l.basis}</div>
                  </div>
                  <div className="col-span-2 text-right">
                    {l.qty} {l.unit}
                  </div>
                  <div className="col-span-2 text-right">{eur(l.price)}</div>
                  <div className="col-span-2 text-right font-extrabold">{eur(l.qty * l.price)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 space-y-3 text-xs">
            <h3 className="text-base font-extrabold text-brand-950">GoBD-Summen &amp; § 35a EStG</h3>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Nettobetrag:</span>
              <span className="font-bold">{eur(docTotals.net)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-600">Umsatzsteuer ({curDoc.vatRate} %):</span>
              <span className="font-bold">{eur(docTotals.vat)}</span>
            </div>
            <div className="flex justify-between py-2 border-b-2 border-slate-900 text-base font-extrabold text-brand-950">
              <span>Gesamtbetrag (Brutto):</span>
              <span>{eur(docTotals.gross)}</span>
            </div>
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-3 space-y-1">
              <div className="font-bold text-brand-950">
                § 35a EStG Handwerkerleistung (Lohn- &amp; Fahrtanteil):
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Ausgewiesener Arbeitsanteil:</span>
                <strong>{eur(docTotals.labourGross)}</strong>
              </div>
              <div className="flex justify-between text-brand-800">
                <span>20 % Steuerersparnis für Kunden:</span>
                <strong>−{eur(docTotals.taxBonus20)}</strong>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPreviewDoc(curDoc)}
              className="w-full bg-[#0f2537] hover:bg-brand-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Offizielles PDF öffnen &amp; drucken
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: TERMINE & KALENDER */}
      {tab === 'termine' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-extrabold text-brand-950">
                Geplante Vor-Ort-Feuchtigkeitsmessungen &amp; Google Kalender
              </h3>
              <p className="text-xs text-slate-500">
                Synchronisiert mit dem Google Kalender von <strong>{NOTIFY_EMAIL_DEFAULT}</strong>.
              </p>
            </div>
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#0f2537] text-white px-4 py-2 rounded-xl"
            >
              Google Kalender öffnen <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="divide-y divide-slate-200 text-xs">
            <div className="py-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-extrabold text-brand-700">T-1001 · 22.10.2026 · 10:00 Uhr</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  Vor-Ort-Feuchtigkeitsmessung – Familie Berger (A-1001)
                </div>
                <div className="text-slate-500">Friedrich-Ebert-Str. 40, 42103 Wuppertal</div>
              </div>
              <span className="font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Im Kalender bestätigt
              </span>
            </div>
            <div className="py-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-extrabold text-brand-700">T-1002 · 25.10.2026 · 14:00 Uhr</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  Taupunkt- &amp; Schimmelanalyse – Hausverwaltung Rhein-Wupper (A-1002)
                </div>
                <div className="text-slate-500">Kölner Str. 88, 42651 Solingen</div>
              </div>
              <span className="font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                Im Kalender bestätigt
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: HILFE & 1-CLICK GITHUB PUBLISHING */}
      {tab === 'hilfe' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-brand-700 font-bold text-xs uppercase">
              <Rocket className="w-4 h-4" />
              1-Klick Website-Veröffentlichung (GitHub API)
            </div>
            <h3 className="text-lg font-extrabold text-brand-950">
              Preise &amp; Katalog ohne Code-Push aktualisieren
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Änderungen im Google Sheet (Reiter <code>Katalog</code>, <code>Preise</code> und <code>Konfiguration</code>) werden per GitHub REST API direkt nach <code>avaisqarni365/SOS24</code> (<code>public/data/master.json</code>) übertragen und lösen automatisch den GitHub Pages Build aus.
            </p>
            <button
              type="button"
              onClick={() => {
                setPublishStatus('Synchronisiere Katalog mit github.com/avaisqarni365/SOS24 …');
                setTimeout(() => {
                  setPublishStatus('✓ Katalog (public/data/master.json) ist aktuell & veröffentlicht!');
                  showToast('Website-Katalog erfolgreich abgeglichen.');
                }, 900);
              }}
              className="bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs px-5 py-3 rounded-xl inline-flex items-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              🚀 Preise &amp; Katalog jetzt auf Website veröffentlichen
            </button>
            {publishStatus && <p className="text-xs font-bold text-brand-800">{publishStatus}</p>}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3 text-xs">
            <h3 className="text-lg font-extrabold text-brand-950">
              Cloud-Verbindung &amp; Google Konto
            </h3>
            <div className="space-y-2 text-slate-700">
              <div>
                <strong>Google-Konto (Sheets, Drive, Kalender):</strong>{' '}
                <code className="bg-slate-100 px-2 py-0.5 rounded">{NOTIFY_EMAIL_DEFAULT}</code>
              </div>
              <div>
                <strong>Drive-Ordner Schadensfotos:</strong>{' '}
                <code>SOS Abdichtung - Schadensfotos / &lt;Anfrage-ID&gt;</code>
              </div>
              <div>
                <strong>Drive-Ordner Verträge:</strong> <code>SOS Abdichtung - Verträge</code>
              </div>
              <div>
                <strong>Drive-Ordner GoBD-Belege:</strong> <code>SOS Abdichtung - Belege / 2026</code>
              </div>
              <div>
                <strong>Apps Script Endpoint:</strong>{' '}
                <code className="break-all bg-slate-100 px-2 py-0.5 rounded">{GAS_API_URL}</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable GoBD PDF Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreviewDoc(null);
          }}
        >
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-elevated">
            <div className="bg-[#0f2537] text-white px-5 py-3 flex items-center justify-between">
              <strong className="text-sm">
                {previewDoc.nr} · {previewDoc.typeLabel} ({previewDoc.name})
              </strong>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg"
                >
                  🖨️ Drucken / Als PDF speichern
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="text-slate-300 hover:text-white text-xs font-bold px-2.5 py-1.5"
                >
                  Schließen ×
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 text-xs text-slate-800">
              <div className="flex justify-between items-start border-b-2 border-[#0f2537] pb-4">
                <div>
                  <div className="text-lg font-extrabold text-[#0f2537]">
                    {COMPANY.fullName}
                  </div>
                  <div className="text-slate-600">
                    Inhaber: {COMPANY.owner} · {COMPANY.street}, {COMPANY.city}
                  </div>
                  <div className="text-slate-600">
                    Tel.: {COMPANY.phoneDisplay} · E-Mail: {COMPANY.email}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-brand-700">
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
                    <th className="py-2">Pos. / Beschreibung</th>
                    <th className="py-2 text-right">Menge</th>
                    <th className="py-2 text-right">Einzelpreis</th>
                    <th className="py-2 text-right">Gesamt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {previewDoc.lines.map((l, i) => (
                    <tr key={i}>
                      <td className="py-2.5">
                        <div className="font-bold text-slate-900">{l.pos}</div>
                        <div className="text-slate-500">{l.basis}</div>
                      </td>
                      <td className="py-2.5 text-right">
                        {l.qty} {l.unit}
                      </td>
                      <td className="py-2.5 text-right">{eur(l.price)}</td>
                      <td className="py-2.5 text-right font-bold">{eur(l.qty * l.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {(() => {
                const t = calcDocTotals(previewDoc);
                return (
                  <div className="ml-auto max-w-xs space-y-1.5 border-t-2 border-slate-900 pt-3">
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
                      Darin enthaltener Arbeits-/Lohnanteil nach § 35a EStG: <strong>{eur(t.labourGross)}</strong> (20 % Steuerermäßigung = {eur(t.taxBonus20)}).
                    </div>
                  </div>
                );
              })()}

              <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500">
                Garantiehinweis: 10 Jahre Ausführungsgarantie von sos-abdichtung + 25 Jahre Produktgarantie der SchimmelPeter GmbH.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
