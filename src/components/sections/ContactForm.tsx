'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  ShieldCheck,
  Award,
  MessageSquare,
  Camera,
  X,
  FileSignature,
  FileText,
  Loader2,
  FolderOpen,
  Calendar,
  Download,
} from 'lucide-react';
import { COMPANY, COMPANY_INFO } from '@/data/content-data';
import {
  buildGoogleCalendarUrl,
  downloadIcsFile,
  INSPECTION_SLOTS,
} from '@/lib/calendar';
import SendError from '@/components/ui/SendError';
import {
  submitLeadToWorkspace,
  uploadDamagePhotosToDrive,
  signContractDigitally,
  resizeImageToBase64,
  processFileForUpload,
  NOTIFY_EMAIL_DEFAULT,
  type EncodedPhoto,
} from '@/lib/backend';

interface ContactFormProps {
  compact?: boolean;
  defaultDamage?: string;
  place?: string;
}

const inputCls =
  'w-full min-h-[46px] px-4 py-3 rounded-xl border border-slate-300 bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-600/20 outline-none text-slate-900 text-base sm:text-sm transition';

export default function ContactForm({ compact = false, defaultDamage, place }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leadId, setLeadId] = useState<string>('');
  const [uploadToken, setUploadToken] = useState<string>('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photosUploadedCount, setPhotosUploadedCount] = useState(0);
  const [uploadedPreviews, setUploadedPreviews] = useState<
    { name: string; url: string; isPdf?: boolean }[]
  >([]);
  const [selectedPhotos, setSelectedPhotos] = useState<
    { file: File; preview: string; isPdf?: boolean }[]
  >([]);
  const [photoError, setPhotoError] = useState<string>('');
  const [sendError, setSendError] = useState<string>('');
  const [signError, setSignError] = useState<string>('');
  const mountedAtRef = useRef<number>(Date.now());

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    plzOrt: place || '',
    damageType: defaultDamage || 'Feuchter Keller / Nasse Wände',
    areaSqm: '',
    preferredDate: '',
    preferredTimeSlot: 'morning',
    message: '',
    privacy: false,
  });

  // Digital Contract E-Sign mode (?id=A-1001&k=TOKEN#sign)
  const [signMode, setSignMode] = useState<{ id: string; k: string } | null>(null);
  const [signerName, setSignerName] = useState('');
  const [signSuccess, setSignSuccess] = useState(false);
  const [signing, setSigning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id') || '';
    const k = params.get('k') || '';
    if (id && /^A-\d+$/i.test(id)) {
      setSignMode({ id, k });
      setLeadId(id);
      setUploadToken(k);
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError('');
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const isImg = (f: File) => f.type.startsWith('image/');
    const isDoc = (f: File) =>
      f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');
    const validFiles = files.filter((f) => isImg(f) || isDoc(f));
    if (validFiles.length === 0) {
      setPhotoError('Bitte wählen Sie Bilddateien (JPG, PNG, WEBP) oder PDF-Dokumente aus.');
      return;
    }
    const next = validFiles.slice(0, 6 - selectedPhotos.length).map((file) => ({
      file,
      isPdf: isDoc(file),
      preview: isImg(file) ? URL.createObjectURL(file) : '',
    }));
    setSelectedPhotos((prev) => [...prev, ...next].slice(0, 6));
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const buildSummaryText = (assignedId?: string) => {
    const slot = INSPECTION_SLOTS.find((s) => s.id === formData.preferredTimeSlot);
    return (
      `Anfrage kostenlose Schadensanalyse (${COMPANY.name})${assignedId ? ` [${assignedId}]` : ''}\n\n` +
      `Name: ${formData.name}\n` +
      `Telefon: ${formData.phone}\n` +
      `E-Mail: ${formData.email || 'nicht angegeben'}\n` +
      `PLZ / Ort: ${formData.plzOrt}\n` +
      `Schadensart: ${formData.damageType}\n` +
      (formData.areaSqm ? `Fläche / Wandlänge: ca. ${formData.areaSqm} m²/lfm\n` : '') +
      (formData.preferredDate ? `Wunschtermin: ${formData.preferredDate} (${slot?.label || 'Vormittags'} ${slot?.timeRange || '08:00 – 11:00 Uhr'})\n` : '') +
      `Beschreibung: ${formData.message || 'Bitte um Rückruf zur Terminvereinbarung.'}`
    );
  };

  const uploadPhotosForLead = async (
    targetLeadId: string,
    targetToken: string,
    photosToUpload: { file: File; preview: string; isPdf?: boolean }[]
  ) => {
    if (photosToUpload.length === 0) return;
    setPhotoUploading(true);
    try {
      const encoded: EncodedPhoto[] = [];
      const previews: { name: string; url: string; isPdf?: boolean }[] = [];
      for (const item of photosToUpload) {
        try {
          const enc = await processFileForUpload(item.file);
          encoded.push(enc);
          previews.push({
            name: item.file.name,
            url: item.isPdf ? '' : `data:${enc.type};base64,${enc.data}`,
            isPdf: item.isPdf,
          });
        } catch {
          // ignore single decode error
        }
      }
      if (encoded.length > 0) {
        const up = await uploadDamagePhotosToDrive({
          id: targetLeadId,
          token: targetToken,
          images: encoded,
          note: formData.message,
        });
        if (!up.ok) {
          setPhotoError('Die Fotos wurden nicht hochgeladen. Bitte senden Sie sie per WhatsApp.');
          return;
        }
        setPhotosUploadedCount((prev) => prev + encoded.length);
        setUploadedPreviews((prev) => [...prev, ...previews]);
        setSelectedPhotos([]);
      }
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSendError('');
    try {
      const elapsed = Date.now() - mountedAtRef.current;
      const slot = INSPECTION_SLOTS.find((s) => s.id === formData.preferredTimeSlot);
      const formattedPreferredDate = formData.preferredDate
        ? `${formData.preferredDate} (${slot?.timeRange || '10:00 Uhr'})`
        : '';
      const res = await submitLeadToWorkspace(
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          plzOrt: formData.plzOrt,
          damageType: formData.damageType,
          areaOrLength: Number(formData.areaSqm) || 15,
          preferredDate: formattedPreferredDate,
          message: formData.message,
          channel: 'phone',
          source: 'Kontaktformular (/kontakt/)',
        },
        elapsed
      );

      if (!res.ok || !res.id) {
        setSendError(res.error || 'server');
        return;
      }
      const id = res.id;
      const tok = res.up || '';
      setLeadId(id);
      setUploadToken(tok);

      if (selectedPhotos.length > 0 && id) {
        await uploadPhotosForLead(id, tok, selectedPhotos);
      }

      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdditionalPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !leadId) return;
    const batch = files.slice(0, 6).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    await uploadPhotosForLead(leadId, uploadToken || 'local-token', batch);
    e.target.value = '';
  };

  const handleWhatsAppSend = async () => {
    if (!formData.name || !formData.phone) return;
    let id = leadId;
    let tok = uploadToken;
    if (!id) {
      const res = await submitLeadToWorkspace({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        plzOrt: formData.plzOrt,
        damageType: formData.damageType,
        areaOrLength: Number(formData.areaSqm) || 15,
        preferredDate: formData.preferredDate,
        message: formData.message,
        channel: 'whatsapp',
        source: 'Kontaktformular WhatsApp (/kontakt/)',
      });
      id = res.ok && res.id ? res.id : '';
      tok = res.up || '';
      setLeadId(id);
      setUploadToken(tok);
      if (id && selectedPhotos.length > 0) {
        await uploadPhotosForLead(id, tok, selectedPhotos);
      }
    }
    const text = encodeURIComponent(buildSummaryText(id));
    window.open(
      `https://wa.me/${COMPANY.whatsappNumber}?text=${text}`,
      '_blank',
      'noopener,noreferrer'
    );
    setSubmitted(true);
  };

  // Signature pad handlers
  const startDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawingRef.current = true;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const moveDraw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0f2537';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const endDraw = () => {
    drawingRef.current = false;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const submitDigitalSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signMode || !canvasRef.current || !signerName.trim()) return;
    setSigning(true);
    setSignError('');
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const res = await signContractDigitally({
        id: signMode.id,
        token: signMode.k,
        signer: signerName.trim(),
        signatureDataUrl: dataUrl,
      });
      if (!res.ok) {
        setSignError(res.error || 'server');
        return;
      }
      setSignSuccess(true);
    } finally {
      setSigning(false);
    }
  };

  const mailtoUrl = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
    `Anfrage Schadensanalyse ${leadId ? `[${leadId}] ` : ''}– ${formData.damageType} (${formData.plzOrt})`
  )}&body=${encodeURIComponent(buildSummaryText(leadId))}`;

  return (
    <section
      id="kontakt"
      className={`${compact ? 'py-10' : 'py-12 lg:py-20'} bg-canvas text-ink font-plex`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {signMode && (
          <div
            id="sign"
            className="mb-10 bg-white text-slate-900 rounded-2xl border-2 border-emerald-700 shadow-lg p-5 sm:p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <FileSignature className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Digitale Auftragsbestätigung · Anfrage {signMode.id}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Sanierungsangebot digital gegenzeichnen
                </h2>
              </div>
            </div>
            {signSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-emerald-950 space-y-2">
                <p className="font-bold text-base sm:text-lg">
                  ✓ Vielen Dank, {signerName}! Ihre digitale Unterschrift zu {signMode.id} wurde in
                  Google Drive (`SOS Abdichtung - Verträge`) und im Admin-Portal hinterlegt.
                </p>
                <p className="text-sm text-slate-600">
                  Herr Shahzad Mahmood setzt sich umgehend mit Ihnen zur finalen Terminabstimmung in
                  Verbindung.
                </p>
              </div>
            ) : (
              <form onSubmit={submitDigitalSignature} className="space-y-4">
                <p className="text-sm text-slate-600">
                  Bitte tragen Sie Ihren vollständigen Namen ein und unterschreiben Sie mit dem
                  Finger oder der Maus im Unterschriftsfeld. Das Signatur-Zertifikat wird
                  rechtssicher archiviert.
                </p>
                <div>
                  <label
                    htmlFor="signer-name"
                    className="block text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Vollständiger Name des Auftraggebers *
                  </label>
                  <input
                    id="signer-name"
                    type="text"
                    required
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Vor- und Nachname"
                    className={`${inputCls} max-w-md`}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between max-w-lg mb-1.5">
                    <span className="text-sm font-semibold text-slate-800">
                      Unterschrift (Finger / Maus) *
                    </span>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline"
                    >
                      Feld löschen
                    </button>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={480}
                    height={160}
                    onMouseDown={startDraw}
                    onMouseMove={moveDraw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={moveDraw}
                    onTouchEnd={endDraw}
                    className="w-full max-w-lg h-40 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-crosshair touch-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={signing}
                  className="min-h-[48px] inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  {signing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileSignature className="w-4 h-4" />
                  )}
                  Auftrag {signMode.id} verbindlich digital unterzeichnen
                </button>
                <SendError error={signError} what="Ihre Unterschrift" />
              </form>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Direct Contact & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-3">
                Kostenlose Feuchtigkeitsmessung vor Ort
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight mb-3">
                Jetzt kostenlose Schadensanalyse in Wuppertal &amp; Region anfordern
              </h2>
              <p className="text-ink-soft text-sm sm:text-base leading-relaxed">
                Inhaber <strong>{COMPANY_INFO.owner}</strong> begutachtet Ihren Feuchteschaden
                persönlich vor Ort – inklusive elektronischer Feuchtemessung, Ursachendiagnose und
                verbindlichem Festpreis-Sanierungskonzept.
              </p>
            </div>

            <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Direkt-Kontakt &amp; Notdienst
                  </div>
                  <a
                    href={`tel:${COMPANY_INFO.phoneTel}`}
                    className="text-lg font-extrabold text-slate-900 hover:text-emerald-700 transition-colors"
                  >
                    {COMPANY_INFO.phoneDisplay}
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Auch direkt per WhatsApp (inkl. Schadensfotos)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    E-Mail
                  </div>
                  <a
                    href={`mailto:${COMPANY_INFO.email}`}
                    className="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors break-all"
                  >
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Einsatzgebiet &amp; Firmensitz
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {COMPANY.serviceAreaSummary}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sitz: {COMPANY_INFO.street}, {COMPANY_INFO.city}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Erreichbarkeit
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    {COMPANY.openingHoursDisplay}
                  </p>
                  <p className="text-xs text-slate-500">
                    Rückmeldung innerhalb von 24 Stunden garantiert
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#0f2537] text-white rounded-xl p-4 flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-sm font-extrabold">10 Jahre Garantie</div>
                  <div className="text-xs text-slate-300">Auf alle Ausführungen</div>
                </div>
              </div>
              <div className="bg-[#0f2537] text-white rounded-xl p-4 flex items-center gap-3">
                <Award className="w-7 h-7 text-amber-400 shrink-0" />
                <div>
                  <div className="text-sm font-extrabold">25 Jahre Produkt</div>
                  <div className="text-xs text-slate-300">SchimmelPeter® System</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form + Damage Photo Upload */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-2xl p-5 sm:p-8 border border-slate-200 shadow-md">
            {submitted ? (
              <div className="py-4 sm:py-6 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
                    Vorgangsnummer: {leadId || 'A-1003'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Ihre Schadensanfrage ist eingegangen!
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Vielen Dank, <strong>{formData.name}</strong>. Ihre Anfrage (`{leadId}`)
                    {photosUploadedCount > 0
                      ? ` sowie ${photosUploadedCount} Schadensfoto(s) wurden erfolgreich in Google Drive (SOS Abdichtung - Schadensfotos / ${leadId}) und im Admin-Portal gespeichert.`
                      : ' wurde erfolgreich im System und Google Workspace gespeichert.'}
                  </p>
                </div>

                {/* Show uploaded photo thumbnails immediately */}
                {uploadedPreviews.length > 0 && (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-left max-w-lg mx-auto space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-emerald-700" />
                        Hochgeladene Schadensfotos ({uploadedPreviews.length})
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        Cloud: {NOTIFY_EMAIL_DEFAULT}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {uploadedPreviews.map((up, i) => (
                        <div
                          key={i}
                          className="w-16 h-16 rounded-lg overflow-hidden border border-emerald-300 bg-white flex flex-col items-center justify-center p-1"
                          title={up.name}
                        >
                          {up.isPdf ? (
                            <div className="flex flex-col items-center justify-center text-center">
                              <FileText className="w-6 h-6 text-red-600" />
                              <span className="text-[8px] font-bold text-slate-800 truncate max-w-[56px]">
                                {up.name}
                              </span>
                            </div>
                          ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={up.url}
                              alt={up.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Post-submission additional photo upload */}
                <div className="max-w-lg mx-auto bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-left">
                  <div className="text-xs">
                    <strong className="text-slate-800 block">
                      Weitere Schadensfotos zu {leadId} nachreichen?
                    </strong>
                    <span className="text-slate-500">
                      Werden direkt dem Vorgang {leadId} im Admin-Portal &amp; Google Drive zugeordnet.
                    </span>
                  </div>
                  <label
                    htmlFor="post-submit-photos"
                    className="min-h-[40px] inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl cursor-pointer shrink-0"
                  >
                    {photoUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                    <span>+ Fotos hochladen</span>
                  </label>
                  <input
                    id="post-submit-photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalPhotoUpload}
                    className="hidden"
                  />
                </div>

                {/* Google Calendar 1-Click Sync Card if preferredDate was selected */}
                {formData.preferredDate && (
                  <div className="bg-emerald-50/80 border border-emerald-300 rounded-2xl p-4 sm:p-5 text-left max-w-lg mx-auto space-y-3 shadow-xs">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5 text-emerald-800">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>Ihr Wunschtermin zur Feuchtemessung</span>
                      </span>
                      <span className="text-emerald-800 bg-white border border-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-black">
                        Vorgang {leadId}
                      </span>
                    </div>

                    <div className="text-sm font-black text-slate-900">
                      {new Date(formData.preferredDate).toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="text-xs font-extrabold text-emerald-800">
                      {(() => {
                        const slot = INSPECTION_SLOTS.find((s) => s.id === formData.preferredTimeSlot) || INSPECTION_SLOTS[0];
                        return `${slot.icon} ${slot.label}: ${slot.timeRange}`;
                      })()}
                    </div>

                    <div className="pt-2 border-t border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <a
                        href={buildGoogleCalendarUrl({
                          title: `SOS Abdichtung · Vor-Ort-Feuchtigkeitsmessung (${formData.name})`,
                          description: `Kostenlose Schadensanalyse & Feuchtemessung durch Shahzad Mahmood (${COMPANY_INFO.phoneDisplay}).\nVorgangs-ID: ${leadId}\nSchaden: ${formData.damageType}\nAdresse: ${formData.plzOrt}`,
                          location: formData.plzOrt || 'NRW',
                          startDate: formData.preferredDate,
                          startTime: (INSPECTION_SLOTS.find((s) => s.id === formData.preferredTimeSlot) || INSPECTION_SLOTS[0]).startTime,
                          durationMinutes: (INSPECTION_SLOTS.find((s) => s.id === formData.preferredTimeSlot) || INSPECTION_SLOTS[0]).durationMinutes,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>In Google Kalender ↗</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          const slot = INSPECTION_SLOTS.find((s) => s.id === formData.preferredTimeSlot) || INSPECTION_SLOTS[0];
                          downloadIcsFile({
                            title: `SOS Abdichtung · Vor-Ort-Feuchtigkeitsmessung (${formData.name})`,
                            description: `Kostenlose Schadensanalyse & Feuchtemessung durch Shahzad Mahmood (${COMPANY_INFO.phoneDisplay}).\nVorgangs-ID: ${leadId}\nSchaden: ${formData.damageType}\nAdresse: ${formData.plzOrt}`,
                            location: formData.plzOrt || 'NRW',
                            startDate: formData.preferredDate,
                            startTime: slot.startTime,
                            durationMinutes: slot.durationMinutes,
                          });
                        }}
                        className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-600" />
                        <span>Apple / Outlook (.ics)</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3.5 rounded-xl shadow-sm transition-colors text-sm"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Direkt per WhatsApp senden
                  </button>
                  <a
                    href={mailtoUrl}
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 bg-[#0f2537] hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl shadow-sm transition-colors text-sm"
                  >
                    <Mail className="w-5 h-5" />
                    Per E-Mail-Programm senden
                  </a>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs">
                  <Link
                    href="/admin/"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 underline"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    Vorgang {leadId} &amp; Fotos im Admin-Portal ansehen →
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setSelectedPhotos([]);
                      setPhotosUploadedCount(0);
                      setUploadedPreviews([]);
                    }}
                    className="font-semibold text-slate-500 hover:text-slate-700 underline"
                  >
                    Neue Anfrage starten
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Anfrage für kostenlose Vor-Ort-Besichtigung &amp; Foto-Diagnose
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Unverbindlich &amp; kostenfrei im Raum Wuppertal, Solingen, Remscheid, Velbert
                    &amp; Bergisches Land.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Ihr Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Vor- und Nachname"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Telefon / Mobil für Rückruf *
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="z. B. 0172 2064177"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      E-Mail-Adresse (optional)
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ihre@email.de"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-plz"
                      className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      PLZ &amp; Ort des Objekts *
                    </label>
                    <input
                      id="contact-plz"
                      name="plzOrt"
                      type="text"
                      required
                      value={formData.plzOrt}
                      onChange={handleChange}
                      placeholder="z. B. 42103 Wuppertal"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label
                      htmlFor="contact-damage"
                      className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Schadensart *
                    </label>
                    <select
                      id="contact-damage"
                      name="damageType"
                      value={formData.damageType}
                      onChange={handleChange}
                      className={inputCls}
                    >
                      <option value="Feuchter Keller / Nasse Wände">
                        Feuchter Keller / Nasse Wände
                      </option>
                      <option value="Aufsteigende Feuchte / Horizontalsperre">
                        Aufsteigende Feuchte / Horizontalsperre
                      </option>
                      <option value="Schimmelbefall / Stockflecken">
                        Schimmelbefall / Stockflecken
                      </option>
                      <option value="Wandrisse / Wassereintritt (Rissinjektion)">
                        Wandrisse / Wassereintritt (Rissinjektion)
                      </option>
                      <option value="Balkon- / Terrassenabdichtung">
                        Balkon- / Terrassenabdichtung
                      </option>
                      <option value="Allgemeine Feuchtemessung / Hauskauf-Check">
                        Allgemeine Feuchtemessung / Hauskauf-Check
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-area"
                      className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Fläche / Länge (ca. m²/lfm)
                    </label>
                    <input
                      id="contact-area"
                      name="areaSqm"
                      type="number"
                      min="1"
                      max="500"
                      value={formData.areaSqm}
                      onChange={handleChange}
                      placeholder="z. B. 15"
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-date"
                      className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                    >
                      Wunschtermin Messung (optional)
                    </label>
                    <input
                      id="contact-date"
                      name="preferredDate"
                      type="date"
                      min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className={inputCls}
                    />
                  </div>
                </div>

                {formData.preferredDate && (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2 animate-in fade-in">
                    <div className="text-xs font-bold text-emerald-950 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Bevorzugtes Zeitfenster am {new Date(formData.preferredDate).toLocaleDateString('de-DE')}:</span>
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">Kostenlos vor Ort</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {INSPECTION_SLOTS.map((slot) => {
                        const isSelected = formData.preferredTimeSlot === slot.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, preferredTimeSlot: slot.id }))}
                            className={`p-2 rounded-lg border text-left text-xs transition-all ${
                              isSelected
                                ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/30 font-bold shadow-xs'
                                : 'bg-white/70 hover:bg-white border-slate-200 text-slate-700'
                            }`}
                          >
                            <div className="text-[11px] font-black text-slate-900">{slot.icon} {slot.label}</div>
                            <div className="text-[10px] text-slate-500">{slot.timeRange}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Kurze Beschreibung (z. B. Baujahr, betroffener Raum)
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="z. B. Altbau Bj. 1930, Putz blättert im Keller ab, muffiger Geruch..."
                    className={inputCls}
                  />
                </div>

                {/* Damage Photo Upload to Google Drive & Admin Portal */}
                <div className="bg-emerald-50/60 border-2 border-dashed border-emerald-300 rounded-xl p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <Camera className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">
                          Schadensfotos &amp; Dokumente beifügen (optional, bis zu 6 Dateien)
                        </span>
                        <span className="text-xs text-slate-600 block mt-0.5">
                          Direkt vom Smartphone aufnehmen oder auswählen (Fotos, PDF-Pläne, Gutachten) – wird automatisch im{' '}
                          <strong>Google Drive ({NOTIFY_EMAIL_DEFAULT})</strong> und im{' '}
                          <strong>Admin-Dashboard</strong> gespeichert.
                        </span>
                      </div>
                    </div>
                    <label
                      htmlFor="contact-photos"
                      className="min-h-[44px] inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl cursor-pointer transition-colors shrink-0"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Fotos / PDFs ({selectedPhotos.length}/6)</span>
                    </label>
                    <input
                      id="contact-photos"
                      type="file"
                      accept="image/*,application/pdf,.pdf"
                      multiple
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </div>

                  {photoError && (
                    <p className="text-xs font-bold text-red-600 mt-2">{photoError}</p>
                  )}

                  {selectedPhotos.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-emerald-200/80 space-y-2">
                      <div className="text-xs font-bold text-emerald-900">
                        ✓ {selectedPhotos.length} Datei(en) bereit zum Cloud-Upload:
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {selectedPhotos.map((p, idx) => (
                          <div
                            key={idx}
                            className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-600 bg-white shadow-sm flex flex-col items-center justify-center p-1 text-center"
                          >
                            {p.isPdf ? (
                              <div className="flex flex-col items-center justify-center p-1">
                                <FileText className="w-7 h-7 text-red-600" />
                                <span className="text-[9px] font-bold text-slate-800 truncate max-w-[70px]">
                                  {p.file.name}
                                </span>
                              </div>
                            ) : (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={p.preview}
                                alt={`Schadensfoto ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              aria-label="Datei entfernen"
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/75 text-white flex items-center justify-center"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="contact-privacy"
                    name="privacy"
                    type="checkbox"
                    required
                    checked={formData.privacy}
                    onChange={handleChange}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 shrink-0"
                  />
                  <label htmlFor="contact-privacy" className="text-xs text-slate-600 leading-relaxed">
                    Ich stimme zu, dass meine Angaben und Fotos zur Bearbeitung meiner Anfrage gemäß
                    der{' '}
                    <Link
                      href="/datenschutz/"
                      className="text-emerald-700 font-semibold underline hover:text-emerald-800"
                    >
                      Datenschutzerklärung
                    </Link>{' '}
                    verarbeitet werden. *
                  </label>
                </div>

                <SendError error={sendError} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting || photoUploading}
                    className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 bg-[#0f2537] hover:bg-slate-800 disabled:opacity-60 text-white font-bold px-6 py-4 rounded-xl shadow-sm transition-colors text-sm"
                  >
                    {submitting || photoUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>
                          {photoUploading
                            ? 'Fotos werden in Drive gespeichert…'
                            : 'Wird gesendet…'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Kostenlose Besichtigung anfordern</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    disabled={!formData.name || !formData.phone}
                    className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-4 rounded-xl shadow-sm transition-colors text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Direkt per WhatsApp senden</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
