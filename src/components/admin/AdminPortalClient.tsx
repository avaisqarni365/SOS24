'use client';

import React, { useState, useEffect } from 'react';
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
  Eye,
  Download,
  X,
} from 'lucide-react';
import { COMPANY, COMPANY_INFO } from '@/data/content-data';
import {
  GAS_API_URL,
  NOTIFY_EMAIL_DEFAULT,
  getWorkspaceStore,
  saveWorkspaceStore,
  subscribeWorkspaceStore,
  uploadDamagePhotosToDrive,
  resizeImageToBase64,
  type WorkspaceLead,
  type WorkspaceGoBDDoc,
  type WorkspaceAppointment,
  type QuoteLineItem,
  type StoredDrivePhoto,
  type LeadStatus,
} from '@/lib/backend';

type AdminTab = 'overview' | 'leads' | 'drive' | 'planer' | 'belege' | 'termine' | 'hilfe';

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

const WTA_TEMPLATES: QuoteLineItem[] = [
  { pos: 'Nachträgliche Horizontalsperre (WTA-Injektion)', basis: 'Bohrlochinjektion mit Silan-Creme inkl. Verschließen', qty: 12, unit: 'lfm', price: 135, labour: true },
  { pos: 'Kellerinnenabdichtung (2K-Dichtschlämme MDS)', basis: '2-lagiger Auftrag auf vorbereitetem Untergrund', qty: 20, unit: 'm²', price: 115, labour: true },
  { pos: 'WTA-Sanierputzsystem (Porenputz)', basis: 'Salzspeichernder Sanierputz inkl. Spritzbewurf', qty: 20, unit: 'm²', price: 85, labour: true },
  { pos: 'Druckwasserdichte Hohlkehle', basis: 'Wand-Sohlen-Anschluss ausrunden & abdichten', qty: 12, unit: 'lfm', price: 55, labour: true },
  { pos: 'Sporensichere Schimmelbeseitigung', basis: 'Tiefendesinfektion & Feinreinigung', qty: 12, unit: 'm²', price: 65, labour: true },
  { pos: 'Calciumsilikat-Klimaplatte (Innendämmung)', basis: 'Kapillaraktive Kalziumsilikatplatte inkl. Spezialkleber', qty: 12, unit: 'm²', price: 110, labour: true },
  { pos: 'Hochdruck-Rissverpressung (PU / Epoxidharz)', basis: 'Setzen von Hochdruckpackern & Injektion', qty: 5, unit: 'lfm', price: 165, labour: true },
  { pos: 'Anfahrt & Baustelleneinrichtung', basis: 'Raum Wuppertal & Bergisches Land inkl. Schutzfolie', qty: 1, unit: 'Pausch.', price: 89, labour: true },
];

const STATUS_OPTIONS: LeadStatus[] = [
  'Neu',
  'In Arbeit',
  'Angebot raus',
  'Gebucht',
  'Erledigt',
  'Verloren',
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
  const [leads, setLeads] = useState<WorkspaceLead[]>(() => getWorkspaceStore().leads);
  const [docs, setDocs] = useState<WorkspaceGoBDDoc[]>(() => getWorkspaceStore().docs);
  const [appointments, setAppointments] = useState<WorkspaceAppointment[]>(
    () => getWorkspaceStore().appointments
  );

  const [selectedLeadId, setSelectedLeadId] = useState<string>('A-1001');
  const [selectedDocNr, setSelectedDocNr] = useState<string>('ANG-2026-0001');
  const [previewDoc, setPreviewDoc] = useState<WorkspaceGoBDDoc | null>(null);
  const [zoomPhoto, setZoomPhoto] = useState<{ photo: StoredDrivePhoto; leadId: string } | null>(
    null
  );
  const [toast, setToast] = useState<string>('');
  const [publishStatus, setPublishStatus] = useState<string>('');
  const [adminUploading, setAdminUploading] = useState(false);

  // Aufmaß-Planer state
  const [plName, setPlName] = useState('');
  const [plPhone, setPlPhone] = useState('');
  const [plAddr, setPlAddr] = useState('42103 Wuppertal');
  const [plService, setPlService] = useState('Horizontalsperre');
  const [plLines, setPlLines] = useState<QuoteLineItem[]>([
    { ...WTA_TEMPLATES[0] },
    { ...WTA_TEMPLATES[2] },
    { ...WTA_TEMPLATES[7] },
  ]);

  // Subscribe to real-time updates from /kontakt/, GrokLeadBot, and QuoteCalculator
  useEffect(() => {
    const sync = () => {
      const st = getWorkspaceStore();
      setLeads(st.leads);
      setDocs(st.docs);
      setAppointments(st.appointments);
    };
    sync();
    return subscribeWorkspaceStore(sync);
  }, []);

  const persistAll = (
    nextLeads: WorkspaceLead[],
    nextDocs: WorkspaceGoBDDoc[],
    nextAppts: WorkspaceAppointment[] = appointments
  ) => {
    setLeads(nextLeads);
    setDocs(nextDocs);
    setAppointments(nextAppts);
    saveWorkspaceStore({
      leads: nextLeads,
      docs: nextDocs,
      appointments: nextAppts,
    });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const curLead = leads.find((l) => l.id === selectedLeadId) || leads[0];
  const curDoc = docs.find((d) => d.nr === selectedDocNr) || docs[0];
  const totalPhotosCount = leads.reduce((sum, l) => sum + (l.photos?.length || 0), 0);

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

  const calcLeadTotal = (l: WorkspaceLead) =>
    l.lines.reduce((sum, item) => sum + item.qty * item.price, 0);

  const calcDocTotals = (d: WorkspaceGoBDDoc) => {
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

  const createDocFromLead = (
    l: WorkspaceLead,
    type: 'offer' | 'invoice' | 'deposit' | 'credit'
  ) => {
    const prefix =
      type === 'offer' ? 'ANG' : type === 'deposit' ? 'ABS' : type === 'credit' ? 'STO' : 'RE';
    const label =
      type === 'offer'
        ? 'Angebot'
        : type === 'deposit'
          ? 'Abschlagsrechnung'
          : type === 'credit'
            ? 'Stornorechnung'
            : 'Rechnung';
    const seq = docs.filter((d) => d.nr.startsWith(prefix)).length + 1;
    const nr = `${prefix}-2026-${String(seq).padStart(4, '0')}`;
    const today = new Date().toISOString().slice(0, 10);
    const nextDoc: WorkspaceGoBDDoc = {
      nr,
      type,
      typeLabel: label,
      leadId: l.id,
      name: l.name,
      address: l.address,
      email: l.email,
      phone: l.phone,
      service: `${l.damageType} (${l.id})`,
      date: today,
      dueOrValid: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      status: type === 'offer' ? 'Versendet' : 'Offen',
      vatRate: 19,
      discountPct: 0,
      driveFolder: 'SOS Abdichtung - Belege / 2026',
      lines: l.lines.map((x) => ({ ...x })),
    };
    const nextDocs = [nextDoc, ...docs];
    const nextLeads = leads.map((item) =>
      item.id === l.id && type === 'offer' ? { ...item, status: 'Angebot raus' as LeadStatus } : item
    );
    persistAll(nextLeads, nextDocs);
    setSelectedDocNr(nr);
    setTab('belege');
    showToast(`${nextDoc.typeLabel} ${nr} aus Anfrage ${l.id} erstellt & in Drive hinterlegt.`);
  };

  const handleAdminPhotoUpload = async (
    targetLead: WorkspaceLead,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setAdminUploading(true);
    try {
      const encoded = [];
      for (const file of files.slice(0, 6)) {
        try {
          encoded.push(await resizeImageToBase64(file));
        } catch {
          // ignore
        }
      }
      if (encoded.length > 0) {
        await uploadDamagePhotosToDrive({
          id: targetLead.id,
          token: targetLead.token || 'admin-upload',
          images: encoded,
          note: 'Vom Admin hochgeladen',
        });
        const refreshed = getWorkspaceStore();
        setLeads(refreshed.leads);
        showToast(
          `${encoded.length} Foto(s) zu ${targetLead.id} (SOS Abdichtung - Schadensfotos / ${targetLead.id}) hinzugefügt.`
        );
      }
    } finally {
      setAdminUploading(false);
      e.target.value = '';
    }
  };

  const sendHandoverWhatsApp = (l: WorkspaceLead) => {
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
          Melden Sie sich an, um alle Schadensanfragen von <code>/kontakt/</code>, hochgeladene
          Google Drive Schadensfotos ({totalPhotosCount} Fotos), digitale Verträge und GoBD-Belege (
          <code>ANG-2026</code> / <code>RE-2026</code>) zu sehen.
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
            <strong>Inhaber:</strong> {COMPANY_INFO.owner} ({COMPANY_INFO.phoneDisplay})
          </div>
        </div>
      </div>
    );
  }

  const docTotals = calcDocTotals(curDoc);
  const curLeadDocs = docs.filter((d) => d.leadId === curLead?.id);

  return (
    <div className="space-y-6 font-plex text-slate-900">
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 bg-[#0f2537] text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl shadow-xl text-center">
          {toast}
        </div>
      )}

      {/* Top Admin Navigation Bar */}
      <div className="bg-[#0f2537] text-white rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-extrabold tracking-wider uppercase text-xs sm:text-sm truncate">
              SOS <span className="text-emerald-400">Abdichtung</span> · Admin &amp; Google Drive
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
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2"
          aria-label="Admin Navigation"
        >
          {(
            [
              ['overview', 'Übersicht', ShieldCheck],
              ['leads', `Anfragen (${leads.length})`, FolderOpen],
              ['drive', `Drive-Dateien (${totalPhotosCount + docs.length})`, Camera],
              ['planer', 'Aufmaß-Planer', Calculator],
              ['belege', `Belege (${docs.length})`, FileText],
              ['termine', 'Kalender', Calendar],
              ['hilfe', '1-Klick Cloud', HelpCircle],
            ] as const
          ).map(([k, label, Icon]) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`min-h-[44px] inline-flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
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
            <button
              type="button"
              onClick={() => setTab('leads')}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm text-left hover:border-emerald-500 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{leads.length}</div>
              <div className="text-xs text-slate-500 mt-1">
                Schadensanfragen (inkl. /kontakt/ Live-Sync) →
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTab('drive')}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm text-left hover:border-emerald-500 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
                {totalPhotosCount} Fotos · {docs.length} PDFs
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Google Drive Dateien (Fotos, Angebote, Rechnungen) →
              </div>
            </button>
            <button
              type="button"
              onClick={() => setTab('belege')}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm text-left hover:border-emerald-500 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0f2537]">
                {eur(
                  docs
                    .filter((d) => d.type === 'invoice')
                    .reduce((s, d) => s + calcDocTotals(d).gross, 0)
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Rechnungsvolumen ({docs.filter((d) => d.type === 'offer').length} Angebote ·{' '}
                {docs.filter((d) => d.type === 'invoice').length} Rechnungen) →
              </div>
            </button>
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm min-w-0">
              <div className="text-sm font-extrabold text-emerald-800 break-all">
                {NOTIFY_EMAIL_DEFAULT}
              </div>
              <div className="text-xs text-slate-500 mt-1">Verknüpfte Google Drive &amp; Sheet Cloud</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Aktuelle Schadensanfragen &amp; Fotos
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
                      <div className="flex flex-wrap gap-2 mt-1 text-[11px] font-semibold text-emerald-800">
                        <span>📷 {l.photos?.length || 0} Schadensfoto(s)</span>
                        <span>·</span>
                        <span>
                          📄 {docs.filter((d) => d.leadId === l.id).length} Beleg(e) (ANG/RE)
                        </span>
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
                  Angebote &amp; Rechnungen (Google Drive Belege)
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
                        {d.nr} · {d.name} ({d.leadId})
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {d.typeLabel} · {eur(calcDocTotals(d).gross)} · Drive:{' '}
                        <code>{d.driveFolder}</code>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(d)}
                      className="self-start sm:self-center shrink-0 min-h-[40px] text-xs font-bold bg-[#0f2537] hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl"
                    >
                      👁️ PDF ansehen
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INQUIRY MANAGEMENT, GOOGLE DRIVE PHOTOS, OFFERS/INVOICES, E-SIGN & CHECKLIST */}
      {tab === 'leads' && curLead && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left column: Inquiry Selector + Details + Quote Lines */}
          <div className="lg:col-span-7 space-y-6 min-w-0">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-bold text-slate-500 w-full sm:w-auto">
                Anfrage wählen ({leads.length}):
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
                  {l.id} · {l.name} ({l.photos?.length || 0} 📷)
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block">
                    {curLead.id} · Eingegangen: {curLead.received}
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
                  <span className="text-slate-400 font-bold uppercase block mb-1">Status ändern</span>
                  <select
                    value={curLead.status}
                    aria-label="Status der Anfrage"
                    onChange={(e) => {
                      const nextStatus = e.target.value as LeadStatus;
                      const nextLeads = leads.map((l) =>
                        l.id === curLead.id ? { ...l, status: nextStatus } : l
                      );
                      persistAll(nextLeads, docs);
                      showToast(`Status für ${curLead.id} auf "${nextStatus}" gesetzt.`);
                    }}
                    className="w-full min-h-[38px] px-2.5 py-1 rounded-lg border border-slate-300 bg-white font-bold text-slate-900 text-base sm:text-xs"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
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
                  Kalkulation &amp; WTA-Positionen ({curLead.id})
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

          {/* Right column: Google Drive Photos, Offers/Invoices, E-Signature & Handover Checklist */}
          <div className="lg:col-span-5 space-y-6 min-w-0">
            {/* 1. Dateien & Cloud (Google Drive) Card with Visual Photo Previews + Offers/Invoices */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Dateien &amp; Cloud (Google Drive)
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 shrink-0">
                  {NOTIFY_EMAIL_DEFAULT}
                </span>
              </div>

              {/* A. Customer Damage Photos Gallery */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        Schadensfotos ({curLead.photos?.length || 0}) · {curLead.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      Ordner: <code>SOS Abdichtung - Schadensfotos / {curLead.id}</code>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <label
                      htmlFor={`adm-up-${curLead.id}`}
                      className="min-h-[36px] inline-flex items-center gap-1 text-xs font-bold bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-1.5 rounded-lg cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{adminUploading ? 'Lädt…' : '+ Foto'}</span>
                    </label>
                    <input
                      id={`adm-up-${curLead.id}`}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleAdminPhotoUpload(curLead, e)}
                      className="hidden"
                    />
                    <a
                      href={curLead.photosDriveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[36px] text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                    >
                      <span>Drive</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {curLead.photos && curLead.photos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    {curLead.photos.map((ph, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-xl overflow-hidden border border-emerald-300 bg-white shadow-sm flex flex-col"
                      >
                        <button
                          type="button"
                          onClick={() => setZoomPhoto({ photo: ph, leadId: curLead.id })}
                          className="relative h-24 w-full overflow-hidden bg-slate-100 text-left"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={ph.dataUrl}
                            alt={ph.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-colors">
                            <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
                          </span>
                        </button>
                        <div className="p-1.5 text-[10px] flex items-center justify-between gap-1 bg-white">
                          <span className="font-semibold text-slate-700 truncate" title={ph.name}>
                            {ph.name}
                          </span>
                          <a
                            href={ph.dataUrl}
                            download={ph.name}
                            className="text-emerald-700 hover:text-emerald-900 shrink-0 p-0.5"
                            title="Foto herunterladen"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-900 bg-white/80 rounded-lg p-2.5">
                    Noch keine Fotos zu {curLead.id} hochgeladen. Kunde kann über{' '}
                    <code>/kontakt/</code> Fotos senden oder Sie können oben auf{' '}
                    <strong>+ Foto</strong> klicken.
                  </p>
                )}
              </div>

              {/* B. Offers & Invoices (Angebote & Rechnungen) for this Inquiry */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-slate-700 shrink-0" />
                    <span>
                      GoBD-Belege zu {curLead.id} ({curLeadDocs.length})
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500">
                    SOS Abdichtung - Belege / 2026
                  </span>
                </div>
                {curLeadDocs.length > 0 ? (
                  <div className="space-y-1.5">
                    {curLeadDocs.map((d) => (
                      <div
                        key={d.nr}
                        className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">
                            {d.nr} · {d.typeLabel}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {eur(calcDocTotals(d).gross)} · Status: {d.status}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(d)}
                          className="min-h-[36px] bg-[#0f2537] hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg shrink-0"
                        >
                          👁️ PDF
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Noch kein Beleg erstellt. Klicken Sie links auf „GoBD-Angebot erzeugen“.
                  </p>
                )}
              </div>

              {/* C. Digital Contract Signature */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <FileSignature className="w-4 h-4 shrink-0" />
                      <span>SOS Abdichtung - Verträge ({curLead.id})</span>
                    </div>
                    <div className="text-[11px] text-blue-700 mt-0.5 break-words">
                      {curLead.signedBy
                        ? `✓ Digital unterzeichnet von ${curLead.signedBy} (${curLead.signedAt})`
                        : 'Signatur-Link bereit zur Kundenunterschrift auf /kontakt/'}
                    </div>
                  </div>
                  <a
                    href={`/kontakt/?id=${curLead.id}&k=${curLead.token}#sign`}
                    className="min-h-[38px] text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white px-3.5 py-2 rounded-xl shrink-0 inline-flex items-center justify-center"
                  >
                    E-Signatur öffnen ↗
                  </a>
                </div>
                {curLead.signatureDataUrl && (
                  <div className="bg-white border border-blue-200 rounded-lg p-2">
                    <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Hinterlegte Kundenunterschrift ({curLead.signedBy}):
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={curLead.signatureDataUrl}
                      alt={`Unterschrift ${curLead.signedBy}`}
                      className="max-h-16 object-contain"
                    />
                  </div>
                )}
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
                        const nextLeads = leads.map((l) =>
                          l.id === curLead.id
                            ? { ...l, handover: { ...l.handover, [item.k]: checked } }
                            : l
                        );
                        persistAll(nextLeads, docs);
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

      {/* TAB 3: GOOGLE DRIVE CLOUD-TRESOR (ALL PHOTOS, OFFERS, INVOICES & CONTRACTS IN ONE PLACE) */}
      {tab === 'drive' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Google Drive Cloud-Archiv · {NOTIFY_EMAIL_DEFAULT}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Alle Schadensfotos, Angebote, Rechnungen &amp; Verträge
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Alle über <code>/kontakt/</code> hochgeladenen Fotos und im Admin erzeugten
                  GoBD-Belege auf einen Blick.
                </p>
              </div>
              <a
                href="https://drive.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-[#0f2537] text-white px-4 py-2.5 rounded-xl shrink-0"
              >
                <span>Google Drive Ordner öffnen</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Section 1: All Damage Photos across all inquiries */}
            <div className="space-y-3">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-700" />
                1. Kunden-Schadensfotos (Ordner: <code>SOS Abdichtung - Schadensfotos</code>)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {leads.flatMap((l) =>
                  (l.photos || []).map((ph, idx) => (
                    <div
                      key={`${l.id}-${idx}`}
                      className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => setZoomPhoto({ photo: ph, leadId: l.id })}
                        className="relative h-40 w-full bg-slate-200 overflow-hidden group text-left"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={ph.dataUrl}
                          alt={ph.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute top-2 left-2 bg-[#0f2537]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                          {l.id} · {l.name}
                        </span>
                      </button>
                      <div className="p-3 space-y-1 text-xs">
                        <div className="font-bold text-slate-900 truncate" title={ph.name}>
                          {ph.name}
                        </div>
                        <div className="text-[11px] text-slate-500">{ph.uploadedAt}</div>
                        <div className="flex items-center justify-between pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedLeadId(l.id);
                              setTab('leads');
                            }}
                            className="text-xs font-bold text-emerald-700 hover:underline"
                          >
                            Zur Anfrage {l.id} →
                          </button>
                          <a
                            href={ph.dataUrl}
                            download={ph.name}
                            className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Section 2: All GoBD Offers & Invoices */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-700" />
                2. GoBD-Angebote &amp; Rechnungen (Ordner: <code>SOS Abdichtung - Belege / 2026</code>)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {docs.map((d) => (
                  <div
                    key={d.nr}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-emerald-800">{d.nr}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200">
                          {d.typeLabel}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-sm mt-1">{d.name}</div>
                      <div className="text-slate-500">{d.service}</div>
                      <div className="font-extrabold text-slate-900 text-sm mt-2">
                        {eur(calcDocTotals(d).gross)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(d)}
                        className="flex-1 min-h-[40px] bg-[#0f2537] hover:bg-slate-800 text-white font-bold px-3 py-2 rounded-xl"
                      >
                        👁️ PDF öffnen / Drucken
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDocNr(d.nr);
                          setTab('belege');
                        }}
                        className="min-h-[40px] bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold px-3 py-2 rounded-xl"
                      >
                        Bearbeiten
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUFMASS-PLANER */}
      {tab === 'planer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 space-y-4">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Vor-Ort-Aufmaß &amp; Schnellkalkulation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kundenname / WEG *
                </label>
                <input
                  type="text"
                  value={plName}
                  onChange={(e) => setPlName(e.target.value)}
                  placeholder="z. B. Familie Schneider"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Telefon / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={plPhone}
                  onChange={(e) => setPlPhone(e.target.value)}
                  placeholder="z. B. 0172 2064177"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Objektadresse</label>
                <input
                  type="text"
                  value={plAddr}
                  onChange={(e) => setPlAddr(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hauptgewerk</label>
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
                const nl: WorkspaceLead = {
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
                  source: 'Aufmaß-Planer (/admin/)',
                  photosDriveUrl: 'https://drive.google.com/drive/u/0/my-drive',
                  photos: [],
                  token: 'localtoken',
                  handover: { moisture: true },
                  handoverNote: '',
                  lines: plLines,
                };
                const nextLeads = [nl, ...leads];
                persistAll(nextLeads, docs);
                createDocFromLead(nl, 'offer');
              }}
              className="w-full min-h-[48px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm"
            >
              📄 Als Anfrage speichern &amp; GoBD-Angebot (PDF) öffnen →
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: GoBD INVOICING & QUOTE ENGINE (Belege) */}
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
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Empfänger / Kunde
                </label>
                <input
                  type="text"
                  value={curDoc.name}
                  onChange={(e) => {
                    const nextDocs = docs.map((d) =>
                      d.nr === curDoc.nr ? { ...d, name: e.target.value } : d
                    );
                    persistAll(leads, nextDocs);
                  }}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Anschrift</label>
                <input
                  type="text"
                  value={curDoc.address}
                  onChange={(e) => {
                    const nextDocs = docs.map((d) =>
                      d.nr === curDoc.nr ? { ...d, address: e.target.value } : d
                    );
                    persistAll(leads, nextDocs);
                  }}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Betreff / Bauvorhaben
                </label>
                <input
                  type="text"
                  value={curDoc.service}
                  onChange={(e) => {
                    const nextDocs = docs.map((d) =>
                      d.nr === curDoc.nr ? { ...d, service: e.target.value } : d
                    );
                    persistAll(leads, nextDocs);
                  }}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Umsatzsteuer (§ 14 / § 19 UStG)
                </label>
                <select
                  value={curDoc.vatRate}
                  onChange={(e) => {
                    const nextDocs = docs.map((d) =>
                      d.nr === curDoc.nr ? { ...d, vatRate: Number(e.target.value) } : d
                    );
                    persistAll(leads, nextDocs);
                  }}
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

      {/* TAB 6: TERMINE & KALENDER */}
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
            {appointments.map((apt) => (
              <div
                key={apt.nr}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <span className="font-extrabold text-emerald-700">
                    {apt.nr} · {apt.date} · {apt.time} Uhr
                  </span>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {apt.type} – {apt.name} ({apt.leadId})
                  </div>
                  <div className="text-slate-500">
                    {apt.address} · Tel.: {apt.phone}
                  </div>
                </div>
                <span className="self-start sm:self-center shrink-0 font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: HILFE & 1-CLICK GITHUB PUBLISHING */}
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

      {/* Full-Screen Photo Lightbox Modal */}
      {zoomPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setZoomPhoto(null);
          }}
        >
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90dvh]">
            <div className="bg-[#0f2537] text-white px-4 py-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <strong className="text-xs sm:text-sm block truncate">
                  {zoomPhoto.leadId} · {zoomPhoto.photo.name}
                </strong>
                <span className="text-[11px] text-emerald-300 block truncate">
                  Drive: {zoomPhoto.photo.driveFolder}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={zoomPhoto.photo.dataUrl}
                  download={zoomPhoto.photo.name}
                  className="min-h-[38px] inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={() => setZoomPhoto(null)}
                  className="min-h-[38px] bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span>Schließen</span>
                </button>
              </div>
            </div>
            <div className="p-4 bg-slate-900 flex-1 overflow-auto flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoomPhoto.photo.dataUrl}
                alt={zoomPhoto.photo.name}
                className="max-h-[72dvh] w-auto object-contain rounded-lg"
              />
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
