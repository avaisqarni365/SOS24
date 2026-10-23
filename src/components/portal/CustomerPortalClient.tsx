'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileSignature,
  Camera,
  CheckCircle2,
  Calendar,
  Download,
  Phone,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Clock,
  Loader2,
  AlertCircle,
  FolderOpen,
  ArrowRight,
  ExternalLink,
  Receipt,
  Search,
} from 'lucide-react';
import {
  getWorkspaceStore,
  subscribeWorkspaceStore,
  uploadDamagePhotosToDrive,
  signContractDigitally,
  processFileForUpload,
  type WorkspaceLead,
  type WorkspaceGoBDDoc,
  type WorkspaceAppointment,
  NOTIFY_EMAIL_DEFAULT,
} from '@/lib/backend';
import { buildGoogleCalendarUrl, downloadIcsFile, INSPECTION_SLOTS } from '@/lib/calendar';
import { COMPANY_INFO } from '@/data/content-data';
import SendError from '@/components/ui/SendError';

function CustomerPortalInner() {
  const searchParams = useSearchParams();
  const rawId = searchParams.get('id') || '';
  const rawToken = searchParams.get('k') || '';

  const [searchId, setSearchId] = useState(rawId);
  const [activeLeadId, setActiveLeadId] = useState(rawId);
  const [token, setToken] = useState(rawToken);

  const [lead, setLead] = useState<WorkspaceLead | null>(null);
  const [offer, setOffer] = useState<WorkspaceGoBDDoc | null>(null);
  const [appointment, setAppointment] = useState<WorkspaceAppointment | null>(null);

  // Photo upload state
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState('');

  // Signature state
  const [signerName, setSignerName] = useState('');
  const [signing, setSigning] = useState(false);
  const [signError, setSignError] = useState('');
  const [signSuccess, setSignSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);

  // Sync with workspace store
  useEffect(() => {
    const updateFromStore = () => {
      if (!activeLeadId) return;
      const store = getWorkspaceStore();
      const normalized = activeLeadId.toUpperCase().trim();
      // the ID alone opens nothing: the link's token must match as well
      const l = store.leads.find((x) => x.id.toUpperCase() === normalized && !!token && x.token === token) || null;
      setLead(l);

      if (l) {
        if (!signerName) setSignerName(l.name);
        const off = store.docs.find((d) => d.leadId.toUpperCase() === normalized && d.type === 'offer') || null;
        setOffer(off);
        const appt = store.appointments.find((a) => a.leadId.toUpperCase() === normalized) || null;
        setAppointment(appt);
      }
    };

    updateFromStore();
    return subscribeWorkspaceStore(updateFromStore);
  }, [activeLeadId, signerName, token]);

  // Canvas drawing handlers for touch/mouse
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f2537';
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const moveDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    drawingRef.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Submit digital contract signature
  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureDataUrl = canvas.toDataURL('image/png');
    setSigning(true);
    setSignError('');
    try {
      const res = await signContractDigitally({
        id: lead.id,
        token: token || lead.token,
        signer: signerName || lead.name,
        signatureDataUrl,
      });
      if (res.ok) setSignSuccess(true);
      else setSignError(res.error || 'server');
    } catch {
      setSignError('network');
    } finally {
      setSigning(false);
    }
  };

  // Upload additional damage photos
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!lead || !e.target.files || e.target.files.length === 0) return;
    setPhotoUploading(true);
    setPhotoSuccessMsg('');
    try {
      const files = Array.from(e.target.files);
      const encoded = await Promise.all(files.map((f) => processFileForUpload(f, 1200)));
      const up = await uploadDamagePhotosToDrive({
        id: lead.id,
        token: token || lead.token,
        images: encoded,
        note: 'Über Kunden-Portal hochgeladen',
      });
      if (!up.ok) {
        setPhotoSuccessMsg('Die Fotos wurden nicht hochgeladen. Bitte senden Sie sie per WhatsApp.');
        return;
      }
      setPhotoSuccessMsg(`${files.length} Foto(s) erfolgreich in Google Drive gespeichert.`);
      e.target.value = '';
    } catch {
      setPhotoSuccessMsg('Fehler beim Hochladen.');
    } finally {
      setPhotoUploading(false);
    }
  };

  // Calculate § 35a Labor Deduction
  const lines = offer?.lines || lead?.lines || [];
  const laborNet = lines.filter((l) => l.labour).reduce((sum, l) => sum + (l.price * l.qty), 0);
  const totalNet = lines.reduce((sum, l) => sum + (l.price * l.qty), 0);
  const vat19 = Math.round(totalNet * 0.19 * 100) / 100;
  const gross = Math.round((totalNet + vat19) * 100) / 100;
  const laborGross = Math.round(laborNet * 1.19 * 100) / 100;
  const maxTaxRefund = Math.round(laborGross * 0.20 * 100) / 100;

  // Pipeline stages
  const isSigned = signSuccess || lead?.status === 'Gebucht' || lead?.status === 'Erledigt';
  const stages = [
    { label: 'Anfrage eingegangen', active: true, done: true },
    { label: 'Vor-Ort-Diagnose', active: !!appointment || lead?.status !== 'Neu', done: lead?.status !== 'Neu' },
    { label: 'Festpreis-Angebot', active: !!offer || lead?.status === 'Angebot raus' || isSigned, done: isSigned },
    { label: 'Digital beauftragt', active: isSigned, done: isSigned },
    { label: 'Sanierung abgeschlossen', active: lead?.status === 'Erledigt', done: lead?.status === 'Erledigt' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-plex py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                SOS Abdichtung Kunden-Selfservice
              </span>
              <span className="text-xs text-slate-500 font-medium">
                SchimmelPeter® Partnerbetrieb
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Mein Sanierungsauftrag &amp; Status
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Verfolgen Sie Ihre Schadensanalyse, Ihr Festpreisangebot und zeichnen Sie Verträge digital gegen.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${COMPANY_INFO.phoneTel}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 transition"
            >
              <Phone className="w-4 h-4 text-emerald-700" />
              <span>{COMPANY_INFO.phoneDisplay}</span>
            </a>
            <a
              href={`https://wa.me/491722064177?text=${encodeURIComponent(
                `Guten Tag Herr Mahmood, ich habe eine Frage zu meinem Auftrag ${activeLeadId || ''}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-xs font-bold text-white shadow-xs transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </header>

        {/* Lead Search / Selector if not found or different ID */}
        {!lead && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Auftrag oder Schadensanalyse aufrufen
            </h2>
            <p className="text-xs text-slate-600">
              Geben Sie Ihre Vorgangsnummer (z. B. <strong>A-1001</strong>) ein, um den aktuellen Status und Ihr Angebot einzusehen.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                let clean = searchId.trim();
                if (!clean.toUpperCase().startsWith('A-')) clean = `A-${clean}`;
                setActiveLeadId(clean);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                aria-label="Vorgangsnummer"
                placeholder="z. B. A-1001"
                className="flex-1 min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold uppercase focus:border-emerald-700 outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#0f2537] hover:bg-slate-800 text-white font-bold text-sm"
              >
                Öffnen
              </button>
            </form>
          </div>
        )}

        {lead && (
          <>
            {/* Visual 5-Stage Status Bar */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-wider bg-slate-900 text-white px-3 py-1 rounded-md">
                    Vorgang {lead.id}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    Eingegangen: {lead.received}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Aktueller Status:</span>
                  <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {lead.status}
                  </span>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-100">
                {stages.map((st, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col gap-1 transition ${
                      st.done
                        ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                        : st.active
                          ? 'bg-blue-50/80 border-blue-300 text-blue-900'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black tracking-wider">
                        Schritt {i + 1}
                      </span>
                      {st.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <span className="font-extrabold text-slate-800 leading-tight">
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content Grid: Left (Offer, Details, Sign) & Right (Photos, Appointment, Calendar) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (8 cols): Offer & Invoicing Engine + E-Sign */}
              <div className="lg:col-span-7 space-y-6">
                {/* Offer Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <Receipt className="w-5 h-5 text-emerald-700" />
                      <div>
                        <h2 className="text-base font-black text-slate-900">
                          {offer ? `Verbindliches Festpreisangebot ${offer.nr}` : 'Indikatives Angebot'}
                        </h2>
                        <span className="text-xs text-slate-500">
                          Gemäß § 14 UStG &amp; SchimmelPeter® Festpreisgarantie
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      Gültig 14 Tage
                    </span>
                  </div>

                  {/* Line Items Table */}
                  <div className="divide-y divide-slate-100 text-xs">
                    {lines.map((l, i) => (
                      <div key={i} className="py-2.5 flex justify-between items-start gap-4">
                        <div>
                          <div className="font-bold text-slate-900">{l.pos}</div>
                          <div className="text-[11px] text-slate-500">{l.basis}</div>
                          {l.labour && (
                            <span className="inline-block mt-0.5 text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              § 35a Handwerkerlohn
                            </span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-slate-900">
                            {(l.price * l.qty).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            {l.qty} {l.unit} à {l.price.toFixed(2)} €
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Totals & § 35a Tax Deduction Box */}
                  <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Nettobetrag:</span>
                      <span className="font-bold">{totalNet.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Gesetzliche MwSt. (19%):</span>
                      <span className="font-bold">{vat19.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                      <span>Gesamt-Festpreis (Brutto):</span>
                      <span className="text-emerald-800">{gross.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                    </div>

                    {/* § 35a Tax Savings Badge */}
                    <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-amber-950">
                        <ShieldCheck className="w-4 h-4 text-amber-700" />
                        <span>Steuervorteil nach § 35a EStG für Eigentümer</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-amber-800">
                        In dieser Sanierung sind <strong>{laborGross.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</strong> reine Handwerkerlohnleistungen enthalten. Davon erstattet Ihnen das Finanzamt 20 %, also bis zu <strong>{maxTaxRefund.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € Steuerersparnis</strong> bei unbarer Überweisung.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Digital Signature Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <FileSignature className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h2 className="text-base font-black text-slate-900">
                        Rechtsverbindliche digitale Auftragserteilung
                      </h2>
                      <span className="text-xs text-slate-500">
                        Ohne Ausdrucken · Direkt auf dem Smartphone oder Bildschirm gegenzeichnen
                      </span>
                    </div>
                  </div>

                  {isSigned ? (
                    <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <h3 className="text-base font-extrabold text-emerald-950">
                        Auftrag rechtsverbindlich gebucht!
                      </h3>
                      <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                        Gezeichnet von <strong>{lead.signedBy || signerName}</strong> am {lead.signedAt || new Date().toLocaleString('de-DE')}. Das signierte Zertifikat wurde in Google Drive archiviert.
                      </p>
                      {lead.signatureDataUrl && (
                        <div className="mt-2 p-2 bg-white rounded-lg border border-emerald-200 max-w-xs mx-auto">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={lead.signatureDataUrl} alt="Digitale Signatur" className="max-h-16 mx-auto object-contain" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleSign} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Vollständiger Name des Auftraggebers / Eigentümers:
                        </label>
                        <input
                          type="text"
                          required
                          value={signerName}
                          onChange={(e) => setSignerName(e.target.value)}
                          placeholder="Vor- und Nachname"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-semibold focus:border-emerald-700 outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="font-bold text-slate-800">
                            Unterschrift (mit Finger oder Maus zeichnen):
                          </label>
                          <button
                            type="button"
                            onClick={clearCanvas}
                            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline"
                          >
                            Löschen
                          </button>
                        </div>
                        <canvas
                          ref={canvasRef}
                          width={480}
                          height={140}
                          onMouseDown={startDraw}
                          onMouseMove={moveDraw}
                          onMouseUp={endDraw}
                          onMouseLeave={endDraw}
                          onTouchStart={startDraw}
                          onTouchMove={moveDraw}
                          onTouchEnd={endDraw}
                          className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-crosshair touch-none"
                        />
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                        Hiermit beauftrage ich die Firma <strong>SOS Abdichtung (Inh. Shahzad Mahmood)</strong> verbindlich mit der Ausführung der oben aufgeführten Sanierungsmaßnahmen zum Festpreis von <strong>{gross.toLocaleString('de-DE', { minimumFractionDigits: 2 })} € inkl. MwSt.</strong> gemäß VOB/B und SchimmelPeter® Qualitätskriterien.
                      </div>

                      <SendError error={signError} what="Ihre Unterschrift" />
                      <button
                        type="submit"
                        disabled={signing || !signerName}
                        className="w-full min-h-[46px] rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
                      >
                        {signing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Wird digital signiert &amp; in Drive gespeichert…</span>
                          </>
                        ) : (
                          <>
                            <FileSignature className="w-4 h-4" />
                            <span>Sanierungsauftrag {lead.id} verbindlich digital unterzeichnen</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Right Column (5 cols): Vor-Ort-Termin, Schadensfotos & Google Drive */}
              <div className="lg:col-span-5 space-y-6">
                {/* On-Site Inspection Appointment Box */}
                {appointment && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-700" />
                        <h3 className="text-sm font-black text-slate-900">
                          Vor-Ort-Feuchtigkeitsmessung
                        </h3>
                      </div>
                      <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {appointment.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="font-extrabold text-sm text-slate-900">
                        {new Date(appointment.date).toLocaleDateString('de-DE', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-slate-600 font-medium">
                        Zeitfenster: {appointment.time} Uhr
                      </div>
                      <div className="text-slate-500 flex items-center gap-1 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{appointment.address}</span>
                      </div>
                    </div>

                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <a
                        href={buildGoogleCalendarUrl({
                          title: `SOS Abdichtung · Vor-Ort-Feuchtigkeitsmessung (${lead.name})`,
                          description: `Kostenlose Feuchtemessung & Schadensdiagnose durch Shahzad Mahmood (${COMPANY_INFO.phoneDisplay}).\nVorgang: ${lead.id}`,
                          location: appointment.address,
                          startDate: appointment.date,
                          startTime: '10:00',
                          durationMinutes: 60,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-1.5 transition shadow-xs text-xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>In Google Kalender ↗</span>
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          downloadIcsFile({
                            title: `SOS Abdichtung · Vor-Ort-Feuchtigkeitsmessung (${lead.name})`,
                            description: `Kostenlose Feuchtemessung & Schadensdiagnose durch Shahzad Mahmood (${COMPANY_INFO.phoneDisplay}).\nVorgang: ${lead.id}`,
                            location: appointment.address,
                            startDate: appointment.date,
                            startTime: '10:00',
                            durationMinutes: 60,
                          })
                        }
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition text-xs"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-600" />
                        <span>Apple / Outlook (.ics)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Damage Photos & Google Drive Folder */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Camera className="w-5 h-5 text-emerald-700" />
                      <h3 className="text-sm font-black text-slate-900">
                        Schadensfotos ({lead.photos.length})
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Cloud: Google Drive
                    </span>
                  </div>

                  {lead.photos.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {lead.photos.map((p, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center relative group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.dataUrl}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Noch keine Fotos hochgeladen. Reichen Sie Fotos für eine schnellere Begutachtung ein.
                    </p>
                  )}

                  {/* Add Photos Button */}
                  <div className="pt-2">
                    <label className="w-full min-h-[42px] rounded-xl border border-dashed border-slate-300 hover:border-emerald-600 bg-slate-50 hover:bg-emerald-50/50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition">
                      {photoUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                          <span>Wird komprimiert &amp; hochgeladen…</span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 text-emerald-700" />
                          <span>+ Weitere Schadensfotos hochladen</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {photoSuccessMsg && (
                      <p className="text-[11px] font-bold text-emerald-700 mt-2 text-center">
                        {photoSuccessMsg}
                      </p>
                    )}
                  </div>
                </div>

                {/* Object Information Box */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 text-xs">
                  <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">
                    Objekt- &amp; Kundendaten
                  </h3>
                  <div className="space-y-1.5 text-slate-600">
                    <div>
                      <strong className="text-slate-800">Auftraggeber:</strong> {lead.name}
                    </div>
                    <div>
                      <strong className="text-slate-800">Telefon:</strong> {lead.phone}
                    </div>
                    {lead.email && (
                      <div>
                        <strong className="text-slate-800">E-Mail:</strong> {lead.email}
                      </div>
                    )}
                    <div>
                      <strong className="text-slate-800">Objektadresse:</strong> {lead.address}
                    </div>
                    <div>
                      <strong className="text-slate-800">Diagnostizierter Schaden:</strong> {lead.damageType}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CustomerPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
        </div>
      }
    >
      <CustomerPortalInner />
    </Suspense>
  );
}
