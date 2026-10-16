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
  Calendar,
  Loader2,
} from 'lucide-react';
import { COMPANY } from '@/data/content-data';
import {
  submitLeadToWorkspace,
  uploadDamagePhotosToDrive,
  signContractDigitally,
  resizeImageToBase64,
  type EncodedPhoto,
} from '@/lib/backend';

interface ContactFormProps {
  compact?: boolean;
}

export default function ContactForm({ compact = false }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leadId, setLeadId] = useState<string>('');
  const [uploadToken, setUploadToken] = useState<string>('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photosUploadedCount, setPhotosUploadedCount] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState<{ file: File; preview: string }[]>([]);
  const mountedAtRef = useRef<number>(Date.now());

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    plzOrt: '',
    damageType: 'Feuchter Keller / Nasse Wände',
    areaSqm: '',
    preferredDate: '',
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
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const next = files.slice(0, 6 - selectedPhotos.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedPhotos((prev) => [...prev, ...next].slice(0, 6));
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const buildSummaryText = (assignedId?: string) => {
    return (
      `Anfrage kostenlose Schadensanalyse (${COMPANY.name})${assignedId ? ` [${assignedId}]` : ''}\n\n` +
      `Name: ${formData.name}\n` +
      `Telefon: ${formData.phone}\n` +
      `E-Mail: ${formData.email || 'nicht angegeben'}\n` +
      `PLZ / Ort: ${formData.plzOrt}\n` +
      `Schadensart: ${formData.damageType}\n` +
      (formData.areaSqm ? `Fläche / Wandlänge: ca. ${formData.areaSqm} m²/lfm\n` : '') +
      (formData.preferredDate ? `Wunschtermin: ${formData.preferredDate}\n` : '') +
      `Beschreibung: ${formData.message || 'Bitte um Rückruf zur Terminvereinbarung.'}`
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const elapsed = Date.now() - mountedAtRef.current;
      const res = await submitLeadToWorkspace(
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          plzOrt: formData.plzOrt,
          damageType: formData.damageType,
          areaOrLength: Number(formData.areaSqm) || 15,
          preferredDate: formData.preferredDate,
          message: formData.message,
          channel: 'phone',
          source: 'Kontaktformular',
        },
        elapsed
      );

      const id = res.id || 'A-1001';
      const tok = res.up || '';
      setLeadId(id);
      setUploadToken(tok);

      if (selectedPhotos.length > 0 && id) {
        setPhotoUploading(true);
        const encoded: EncodedPhoto[] = [];
        for (const item of selectedPhotos) {
          try {
            encoded.push(await resizeImageToBase64(item.file));
          } catch {
            // ignore single image decode failure
          }
        }
        if (encoded.length > 0) {
          await uploadDamagePhotosToDrive({
            id,
            token: tok,
            images: encoded,
            note: formData.message,
          });
          setPhotosUploadedCount(encoded.length);
        }
        setPhotoUploading(false);
      }

      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppSend = async () => {
    if (!formData.name || !formData.phone) return;
    let id = leadId;
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
        source: 'Kontaktformular (WhatsApp)',
      });
      id = res.id || '';
      if (id) setLeadId(id);
      if (res.up) setUploadToken(res.up);
    }
    const text = encodeURIComponent(buildSummaryText(id));
    window.open(`https://wa.me/${COMPANY.whatsappNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  // Signature pad handlers
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
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

  const moveDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
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
    ctx.strokeStyle = '#0b251c';
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
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      await signContractDigitally({
        id: signMode.id,
        token: signMode.k,
        signer: signerName.trim(),
        signatureDataUrl: dataUrl,
      });
      setSignSuccess(true);
    } finally {
      setSigning(false);
    }
  };

  const mailtoUrl = `mailto:${COMPANY.email}?subject=${encodeURIComponent(
    `Anfrage Schadensanalyse ${leadId ? `[${leadId}] ` : ''}– ${formData.damageType} (${formData.plzOrt})`
  )}&body=${encodeURIComponent(buildSummaryText(leadId))}`;

  return (
    <section id="kontakt" className={`${compact ? 'py-12' : 'py-16 lg:py-24'} bg-surface-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {signMode && (
          <div id="sign" className="mb-10 bg-white rounded-2xl border-2 border-brand-600 shadow-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
                <FileSignature className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Digitale Auftragsbestätigung · Anfrage {signMode.id}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-950">
                  Sanierungsangebot digital gegenzeichnen
                </h2>
              </div>
            </div>
            {signSuccess ? (
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 text-brand-900">
                <p className="font-bold text-lg mb-1">
                  ✓ Vielen Dank, {signerName}! Ihre digitale Unterschrift zu {signMode.id} wurde in Google Drive hinterlegt.
                </p>
                <p className="text-sm text-slate-600">
                  Herr Shahzad Mahmood setzt sich umgehend mit Ihnen zur finalen Terminabstimmung in Verbindung.
                </p>
              </div>
            ) : (
              <form onSubmit={submitDigitalSignature} className="space-y-4">
                <p className="text-sm text-slate-600">
                  Bitte tragen Sie Ihren vollständigen Namen ein und unterschreiben Sie mit dem Finger oder der Maus im Unterschriftsfeld. Das Signatur-Zertifikat wird rechtssicher archiviert.
                </p>
                <div>
                  <label htmlFor="signer-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Vollständiger Name des Auftraggebers *
                  </label>
                  <input
                    id="signer-name"
                    type="text"
                    required
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Vor- und Nachname"
                    className="w-full max-w-md px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between max-w-lg mb-1.5">
                    <span className="text-sm font-semibold text-slate-800">Unterschrift (Finger / Maus) *</span>
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
                  className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
                >
                  {signing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSignature className="w-4 h-4" />}
                  Auftrag {signMode.id} verbindlich digital unterzeichnen
                </button>
              </form>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contact & Guarantees */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full mb-3">
                Kostenlose Feuchtigkeitsmessung vor Ort
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-950 tracking-tight mb-3">
                Jetzt kostenlose Schadensanalyse in Wuppertal &amp; Region anfordern
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Inhaber <strong>{COMPANY.owner}</strong> begutachtet Ihren Feuchteschaden persönlich vor Ort – inklusive elektronischer Feuchtemessung, Ursachendiagnose und verbindlichem Festpreis-Sanierungskonzept.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Direkt-Kontakt &amp; Notdienst
                  </div>
                  <a
                    href={`tel:${COMPANY.phoneHref}`}
                    className="text-lg font-extrabold text-brand-950 hover:text-brand-700 transition-colors"
                  >
                    {COMPANY.phoneDisplay}
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">Auch direkt per WhatsApp (inkl. Schadensfotos)</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">E-Mail</div>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="text-base font-bold text-brand-950 hover:text-brand-700 transition-colors break-all"
                  >
                    {COMPANY.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Einsatzgebiet &amp; Firmensitz
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{COMPANY.serviceAreaSummary}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sitz: {COMPANY.streetAddress}, {COMPANY.postalCode} {COMPANY.addressLocality}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Erreichbarkeit</div>
                  <p className="text-sm font-semibold text-slate-800">{COMPANY.openingHoursDisplay}</p>
                  <p className="text-xs text-slate-500">Rückmeldung innerhalb von 24 Stunden garantiert</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-brand-950 text-white rounded-xl p-4 flex items-center gap-3">
                <ShieldCheck className="w-7 h-7 text-brand-400 shrink-0" />
                <div>
                  <div className="text-sm font-extrabold">10 Jahre Garantie</div>
                  <div className="text-xs text-slate-300">Auf alle Ausführungen</div>
                </div>
              </div>
              <div className="bg-brand-950 text-white rounded-xl p-4 flex items-center gap-3">
                <Award className="w-7 h-7 text-accent-400 shrink-0" />
                <div>
                  <div className="text-sm font-extrabold">25 Jahre Produkt</div>
                  <div className="text-xs text-slate-300">SchimmelPeter® System</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
            {submitted ? (
              <div className="py-6 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2 max-w-lg mx-auto">
                  <span className="inline-block text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 px-3 py-1 rounded-full">
                    Vorgangsnummer: {leadId || 'A-1001'}
                  </span>
                  <h3 className="text-2xl font-extrabold text-brand-950">
                    Ihre Schadensanfrage ist eingegangen!
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Vielen Dank, <strong>{formData.name}</strong>. Ihre Angaben
                    {photosUploadedCount > 0
                      ? ` sowie ${photosUploadedCount} Schadensfoto(s) wurden sicher in unserer Cloud archiviert.`
                      : ' wurden an Inhaber Shahzad Mahmood übermittelt.'}{' '}
                    Für eine Sofort-Antwort können Sie Ihre Zusammenfassung zusätzlich mit 1 Klick per WhatsApp öffnen:
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3.5 rounded-xl shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Direkt per WhatsApp senden
                  </button>
                  <a
                    href={mailtoUrl}
                    className="inline-flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-bold px-6 py-3.5 rounded-xl shadow-sm transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    Per E-Mail-Programm senden
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSelectedPhotos([]);
                    setPhotosUploadedCount(0);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 underline pt-2"
                >
                  Angaben noch einmal bearbeiten
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-bold text-brand-950">
                    Anfrage für kostenlose Vor-Ort-Besichtigung
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Unverbindlich &amp; kostenfrei im Raum Wuppertal, Solingen, Remscheid, Velbert &amp; Bergisches Land.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-800 mb-1.5">
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none text-slate-900 text-sm transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-semibold text-slate-800 mb-1.5">
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none text-slate-900 text-sm transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      E-Mail-Adresse (optional)
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ihre@email.de"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none text-slate-900 text-sm transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-plz" className="block text-sm font-semibold text-slate-800 mb-1.5">
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none text-slate-900 text-sm transition"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label htmlFor="contact-damage" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Schadensart *
                    </label>
                    <select
                      id="contact-damage"
                      name="damageType"
                      value={formData.damageType}
                      onChange={handleChange}
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none text-slate-900 text-sm bg-white transition"
                    >
                      <option value="Feuchter Keller / Nasse Wände">Feuchter Keller / Nasse Wände</option>
                      <option value="Aufsteigende Feuchte / Horizontalsperre">Aufsteigende Feuchte / Horizontalsperre</option>
                      <option value="Schimmelbefall / Stockflecken">Schimmelbefall / Stockflecken</option>
                      <option value="Wandrisse / Wassereintritt (Rissinjektion)">Wandrisse / Wassereintritt (Rissinjektion)</option>
                      <option value="Balkon- / Terrassenabdichtung">Balkon- / Terrassenabdichtung</option>
                      <option value="Allgemeine Feuchtemessung / Hauskauf-Check">Allgemeine Feuchtemessung / Hauskauf-Check</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-area" className="block text-sm font-semibold text-slate-800 mb-1.5">
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none text-slate-900 text-sm transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-date" className="block text-sm font-semibold text-slate-800 mb-1.5">
                      Wunschtermin Messung
                    </label>
                    <div className="relative">
                      <input
                        id="contact-date"
                        name="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={handleChange}
                        className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none text-slate-900 text-sm transition"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-800 mb-1.5">
                    Kurze Beschreibung (z. B. Baujahr, betroffener Raum)
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="z. B. Altbau Bj. 1930, Putz blättert im Keller ab, muffiger Geruch..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none text-slate-900 text-sm transition"
                  />
                </div>

                {/* Damage Photo Upload to Google Drive */}
                <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <Camera className="w-5 h-5 text-brand-700 shrink-0" />
                      <div>
                        <span className="text-sm font-bold text-slate-800 block">
                          Schadensfotos beifügen (optional, bis zu 6 Bilder)
                        </span>
                        <span className="text-xs text-slate-500">
                          Direkt vom Smartphone aufnehmen oder auswählen – wird verschlüsselt in unserer Cloud gespeichert.
                        </span>
                      </div>
                    </div>
                    <label
                      htmlFor="contact-photos"
                      className="inline-flex items-center gap-1.5 text-xs font-bold bg-white hover:bg-brand-50 text-brand-800 border border-slate-300 px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                      Fotos auswählen
                    </label>
                    <input
                      id="contact-photos"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </div>

                  {selectedPhotos.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 mt-3 pt-3 border-t border-slate-200">
                      {selectedPhotos.map((p, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-300 bg-white group"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.preview}
                            alt={`Schadensfoto ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(idx)}
                            aria-label="Foto entfernen"
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
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
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-brand-700 focus:ring-brand-600"
                  />
                  <label htmlFor="contact-privacy" className="text-xs text-slate-600 leading-relaxed">
                    Ich stimme zu, dass meine Angaben und Fotos zur Bearbeitung meiner Anfrage gemäß der{' '}
                    <Link href="/datenschutz/" className="text-brand-700 underline hover:text-brand-800">
                      Datenschutzerklärung
                    </Link>{' '}
                    verarbeitet werden. *
                  </label>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={submitting || photoUploading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white font-bold px-6 py-4 rounded-xl shadow-sm transition-colors text-sm"
                  >
                    {submitting || photoUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {photoUploading ? 'Fotos werden hochgeladen…' : 'Wird gesendet…'}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Kostenlose Besichtigung anfordern
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    disabled={!formData.name || !formData.phone}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-6 py-4 rounded-xl shadow-sm transition-colors text-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Direkt per WhatsApp senden
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
