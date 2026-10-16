'use client';

import React, { useState, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Sparkles,
  Camera,
  Calendar,
  Calculator,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { COMPANY } from '@/data/content-data';
import {
  askWaterproofingBot,
  bookMoistureInspection,
  submitLeadToWorkspace,
  uploadDamagePhotosToDrive,
  resizeImageToBase64,
  type EncodedPhoto,
} from '@/lib/backend';

interface ChatMessage {
  role: 'bot' | 'user';
  text: string;
}

type BotTab = 'chat' | 'calc' | 'book' | 'photos';

const QUICK_REPLIES = [
  'Was kostet eine Horizontalsperre?',
  'Feuchter Keller ohne Aufgraben?',
  'Schimmel trotz Lüften – was tun?',
  'Kostenlose Feuchtemessung buchen',
];

function getLocalAnswer(input: string): string {
  const q = input.toLowerCase();

  if (q.includes('horizontalsperre') || q.includes('aufsteigend') || q.includes('kosten') || q.includes('preis')) {
    return (
      'Eine nachträgliche Horizontalsperre im WTA-Injektionsverfahren liegt je nach Wandstärke und Durchfeuchtungsgrad meist zwischen 115 € und 175 € pro laufendem Meter (inkl. 20 % Steuerbonus nach § 35a EStG auf den Arbeitsanteil). ' +
      'Nutzen Sie oben den Reiter „Rechner“ für Ihre Sofort-Kalkulation oder buchen Sie direkt die kostenlose Vor-Ort-Feuchtemessung!'
    );
  }

  if (q.includes('keller') || q.includes('aufgraben') || q.includes('innenabdichtung')) {
    return (
      'Ja! Wir dichten nasse Kellerwände dauerhaft von innen ab (Negativabdichtung mit mineralischer Dichtungsschlämme MDS + salzspeicherndem WTA-Sanierputz). Ihr Garten oder Hof in Wuppertal muss nicht aufgebaggert werden. Darauf geben wir 10 Jahre Ausführungsgarantie.'
    );
  }

  if (q.includes('schimmel') || q.includes('lüften') || q.includes('klimaplatte')) {
    return (
      'Wenn Schimmel trotz Lüften wiederkehrt, liegt fast immer eine geometrische Wärmebrücke oder kapillare Wandfeuchte vor. Wir messen Oberflächentemperatur & Taupunkt und montieren kapillaraktive Calciumsilikat-Klimaplatten, die dem Schimmel dauerhaft den Nährboden entziehen.'
    );
  }

  if (q.includes('messung') || q.includes('termin') || q.includes('besichtigung') || q.includes('buchen')) {
    return (
      'Unsere Vor-Ort-Feuchtigkeitsmessung inkl. Salzanalyse und schriftlichem Sanierungskonzept ist in Wuppertal, Solingen, Remscheid, Velbert, Essen und Umgebung 100 % kostenlos. Wechseln Sie oben auf den Reiter „Termin“ oder senden Sie uns direkt Ihre Schadensfotos!'
    );
  }

  return (
    `Vielen Dank für Ihre Nachricht! Für eine präzise Ersteinschätzung können Sie oben im Reiter „Rechner“ Ihre Fläche eingeben, unter „Fotos“ Bilder vom Schaden hochladen oder Herrn ${COMPANY.owner} mit 1 Klick per WhatsApp (${COMPANY.phoneDisplay}) kontaktieren.`
  );
}

export default function GrokLeadBot() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<BotTab>('chat');
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'bot',
      text: `Guten Tag! Ich bin Ihr digitaler Bautenschutz-Berater von ${COMPANY.name}. Fragen Sie mich zu Kellerabdichtung, Horizontalsperre & Schimmel – oder nutzen Sie die Schnellfunktionen für Sofort-Kalkulation, Terminbuchung und Schadensfotos.`,
    },
  ]);

  // Instant Diagnostic Calculator State
  const [diagType, setDiagType] = useState<'horizontalsperre' | 'keller' | 'schimmel' | 'riss'>('horizontalsperre');
  const [diagMeasure, setDiagMeasure] = useState<number>(12);
  const [diagPlz, setDiagPlz] = useState<string>('42103 Wuppertal');

  // Booking State (action: 'booking' -> Google Calendar)
  const [bookName, setBookName] = useState('');
  const [bookPhone, setBookPhone] = useState('');
  const [bookAddr, setBookAddr] = useState('');
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('10:00');
  const [bookType, setBookType] = useState<'visit' | 'video' | 'call'>('visit');
  const [bookLoading, setBookLoading] = useState(false);
  const [bookDone, setBookDone] = useState<{ nr: string; date: string; time: string } | null>(null);

  // Photo Upload State (action: 'photos' -> Google Drive)
  const [photoName, setPhotoName] = useState('');
  const [photoPhone, setPhotoPhone] = useState('');
  const [photoNote, setPhotoNote] = useState('');
  const [photos, setPhotos] = useState<{ file: File; preview: string }[]>([]);
  const [photoSending, setPhotoSending] = useState(false);
  const [photoSuccessId, setPhotoSuccessId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const diagResult = (() => {
    const rates = {
      horizontalsperre: { label: 'Horizontalsperre (WTA-Injektion)', unit: 'lfm', min: 115, max: 165 },
      keller: { label: 'Kellerinnenabdichtung (MDS + Sanierputz)', unit: 'm²', min: 95, max: 145 },
      schimmel: { label: 'Schimmelsanierung & Klimaplatte', unit: 'm²', min: 75, max: 125 },
      riss: { label: 'Hochdruck-Rissverpressung (PU/Epoxid)', unit: 'lfm', min: 135, max: 195 },
    }[diagType];
    const minPrice = Math.max(450, Math.round((diagMeasure * rates.min) / 20) * 20);
    const maxPrice = Math.max(minPrice + 120, Math.round((diagMeasure * rates.max) / 20) * 20);
    const taxBonus = Math.round(minPrice * 0.6 * 0.2);
    return { ...rates, minPrice, maxPrice, taxBonus };
  })();

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setThinking(true);
    try {
      const apiRes = await askWaterproofingBot(trimmed);
      const reply = apiRes.ok && apiRes.reply ? apiRes.reply : getLocalAnswer(trimmed);
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: getLocalAnswer(trimmed) }]);
    } finally {
      setThinking(false);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookName.trim() || !bookPhone.trim()) return;
    setBookLoading(true);
    try {
      const targetDate =
        bookDate || new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
      const res = await bookMoistureInspection({
        type: bookType,
        date: targetDate,
        time: bookTime,
        name: bookName.trim(),
        phone: bookPhone.trim(),
        address: bookAddr.trim() || diagPlz,
        damageType: diagResult.label,
        note: `Gebucht über KI-Berater (${diagMeasure} ${diagResult.unit})`,
      });
      setBookDone({
        nr: res.nr || 'T-1001',
        date: res.date || targetDate,
        time: res.time || bookTime,
      });
    } finally {
      setBookLoading(false);
    }
  };

  const handlePhotoFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const added = files.slice(0, 5 - photos.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...added].slice(0, 5));
    e.target.value = '';
  };

  const handlePhotoUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoName.trim() || !photoPhone.trim() || photos.length === 0) return;
    setPhotoSending(true);
    try {
      const leadRes = await submitLeadToWorkspace({
        name: photoName.trim(),
        phone: photoPhone.trim(),
        plzOrt: diagPlz,
        damageType: diagResult.label,
        areaOrLength: diagMeasure,
        message: photoNote || 'Schadensfotos über KI-Widget hochgeladen',
        channel: 'whatsapp',
        source: 'Chatbot Foto-Upload',
      });
      const id = leadRes.id || 'A-1001';
      const token = leadRes.up || '';
      const encoded: EncodedPhoto[] = [];
      for (const p of photos) {
        try {
          encoded.push(await resizeImageToBase64(p.file));
        } catch {
          // ignore
        }
      }
      if (encoded.length > 0) {
        await uploadDamagePhotosToDrive({
          id,
          token,
          images: encoded,
          note: photoNote,
        });
      }
      setPhotoSuccessId(id);
    } finally {
      setPhotoSending(false);
    }
  };

  const buildWhatsAppBridgeUrl = () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.text || '';
    const msg =
      `Hallo Herr Mahmood (${COMPANY.name}),\n\n` +
      `ich nutze gerade die Schnell-Diagnose auf Ihrer Website:\n` +
      `• Gewerk: ${diagResult.label}\n` +
      `• Umfang: ca. ${diagMeasure} ${diagResult.unit}\n` +
      `• Ort: ${bookAddr || diagPlz}\n` +
      `• Orientierungsrahmen: ${diagResult.minPrice.toLocaleString('de-DE')} – ${diagResult.maxPrice.toLocaleString('de-DE')} €\n` +
      (lastUserMsg ? `• Meine Frage: "${lastUserMsg}"\n` : '') +
      `\nBitte um Rückmeldung für eine kostenlose Vor-Ort-Feuchtigkeitsmessung.`;
    return `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      {/* Floating Trigger: 48px FAB on mobile above sticky action bar, elegant navy pill on desktop */}
      {!open && (
        <div className="fixed bottom-[5.25rem] sm:bottom-6 right-4 sm:right-6 z-40">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Digitalen Fachberater & Schadensdiagnose öffnen"
            className="w-12 h-12 sm:w-auto sm:h-auto flex items-center justify-center gap-2.5 bg-[#0f2537] hover:bg-brand-900 text-white font-bold sm:px-5 sm:py-3.5 rounded-full shadow-elevated border border-brand-500/40 transition-all"
          >
            <Sparkles className="w-5 h-5 text-brand-400 shrink-0" />
            <span className="text-sm hidden sm:inline">Sofort-Diagnose &amp; Berater</span>
          </button>
        </div>
      )}

      {/* Modal / 88dvh Mobile Bottom Sheet with Frosted Dark Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-end justify-end bg-black/50 backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none sm:pointer-events-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="pointer-events-auto w-full sm:w-[410px] h-[88dvh] sm:h-[620px] sm:mr-6 sm:mb-6 bg-white rounded-t-3xl sm:rounded-2xl shadow-elevated border border-slate-200 overflow-hidden flex flex-col">
            {/* Mobile Drag Handle */}
            <div className="sm:hidden flex justify-center pt-2 pb-1 bg-[#0f2537]">
              <span className="w-10 h-1 rounded-full bg-slate-500/60" />
            </div>

            {/* Header */}
            <div className="bg-[#0f2537] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-brand-700 flex items-center justify-center text-brand-200 font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight">SOS Abdichtung · KI-Diagnose</div>
                  <div className="text-[11px] text-brand-300">
                    Sofort-Rechner · Vor-Ort-Messung · Foto-Upload
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Berater schließen"
                className="text-slate-300 hover:text-white p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 bg-slate-100 p-1 gap-1 border-b border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-colors ${
                  activeTab === 'chat' ? 'bg-white text-brand-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('calc')}
                className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-colors ${
                  activeTab === 'calc' ? 'bg-white text-brand-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                Rechner
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('book')}
                className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-colors ${
                  activeTab === 'book' ? 'bg-white text-brand-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Termin
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('photos')}
                className={`py-2 px-1 rounded-lg flex items-center justify-center gap-1 transition-colors ${
                  activeTab === 'photos' ? 'bg-white text-brand-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Fotos
              </button>
            </div>

            {/* Tab 1: Chat */}
            {activeTab === 'chat' && (
              <>
                <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-surface-50">
                  {messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          m.role === 'user'
                            ? 'bg-brand-700 text-white rounded-br-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-subtle'
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {thinking && (
                    <div className="flex justify-start">
                      <div className="bg-white text-slate-500 border border-slate-200 rounded-2xl px-3.5 py-2 text-xs flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                        Bautenschutz-Analyse läuft…
                      </div>
                    </div>
                  )}

                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {QUICK_REPLIES.map((qr) => (
                      <button
                        key={qr}
                        type="button"
                        onClick={() => sendMessage(qr)}
                        className="text-[11px] font-medium bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 px-2.5 py-1 rounded-full transition-colors text-left"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(input);
                  }}
                  className="p-2.5 border-t border-slate-200 bg-white flex gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ihre Frage zu Keller, Wand oder Schimmel..."
                    aria-label="Nachricht an Fachberater"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:border-brand-600 outline-none text-slate-900"
                  />
                  <button
                    type="submit"
                    aria-label="Nachricht senden"
                    className="bg-brand-700 hover:bg-brand-800 text-white p-2 rounded-xl transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}

            {/* Tab 2: Instant Damage Diagnostic & Cost Estimator (lfm / m²) */}
            {activeTab === 'calc' && (
              <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-surface-50 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">1. Schadensart wählen</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(
                      [
                        ['horizontalsperre', 'Horizontalsperre (lfm)'],
                        ['keller', 'Kellerwand innen (m²)'],
                        ['schimmel', 'Schimmel & Klimaplatte'],
                        ['riss', 'Rissverpressung (lfm)'],
                      ] as const
                    ).map(([k, lbl]) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setDiagType(k)}
                        className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                          diagType === k
                            ? 'bg-[#0f2537] text-white border-[#0f2537]'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span>2. Wandlänge / Fläche ({diagResult.unit})</span>
                    <span className="text-brand-700 font-extrabold">
                      {diagMeasure} {diagResult.unit}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={60}
                    value={diagMeasure}
                    onChange={(e) => setDiagMeasure(Number(e.target.value))}
                    className="w-full accent-brand-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">3. PLZ / Ort</label>
                  <input
                    type="text"
                    value={diagPlz}
                    onChange={(e) => setDiagPlz(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                  />
                </div>

                <div className="bg-[#0f2537] text-white rounded-2xl p-4 space-y-2">
                  <div className="text-[11px] uppercase tracking-wider text-brand-300 font-bold">
                    Sofort-Richtwert inkl. MwSt.
                  </div>
                  <div className="text-2xl font-extrabold">
                    {diagResult.minPrice.toLocaleString('de-DE')} € – {diagResult.maxPrice.toLocaleString('de-DE')} €
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Steuerbonus § 35a EStG: ca. <strong>{diagResult.taxBonus} € Erstattung</strong>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('book')}
                      className="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-3 rounded-xl text-center"
                    >
                      Kostenlose Messung buchen →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Schedule On-Site Moisture Inspection (Vor-Ort-Feuchtigkeitsmessung) */}
            {activeTab === 'book' && (
              <div className="flex-1 p-4 overflow-y-auto bg-surface-50 text-xs">
                {bookDone ? (
                  <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-brand-700 mx-auto" />
                    <div className="font-extrabold text-base text-brand-950">
                      Termin {bookDone.nr} reserviert!
                    </div>
                    <p className="text-slate-600">
                      Wir haben Ihren Wunschtermin am <strong>{bookDone.date}</strong> um{' '}
                      <strong>{bookDone.time} Uhr</strong> im Google Kalender eingetragen.
                    </p>
                    <button
                      type="button"
                      onClick={() => setBookDone(null)}
                      className="text-brand-700 font-bold underline pt-1"
                    >
                      Weiteren Termin anfragen
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookSubmit} className="space-y-3">
                    <div className="font-bold text-slate-900 text-sm">
                      Kostenlose Vor-Ort-Feuchtigkeitsmessung buchen
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(
                        [
                          ['visit', 'Vor-Ort-Messung'],
                          ['video', 'Video (Meet)'],
                          ['call', 'Rückruf'],
                        ] as const
                      ).map(([t, l]) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setBookType(t)}
                          className={`py-2 px-2 rounded-lg border font-bold ${
                            bookType === t
                              ? 'bg-[#0f2537] text-white border-[#0f2537]'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      required
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      placeholder="Ihr Name *"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                    <input
                      type="tel"
                      required
                      value={bookPhone}
                      onChange={(e) => setBookPhone(e.target.value)}
                      placeholder="Telefon / WhatsApp *"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                    <input
                      type="text"
                      value={bookAddr}
                      onChange={(e) => setBookAddr(e.target.value)}
                      placeholder="Objektadresse (Straße, PLZ Ort)"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={bookDate}
                        onChange={(e) => setBookDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                      />
                      <select
                        value={bookTime}
                        onChange={(e) => setBookTime(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                      >
                        <option value="09:00">09:00 Uhr</option>
                        <option value="10:00">10:00 Uhr</option>
                        <option value="12:00">12:00 Uhr</option>
                        <option value="14:00">14:00 Uhr</option>
                        <option value="16:00">16:00 Uhr</option>
                        <option value="17:30">17:30 Uhr</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={bookLoading}
                      className="w-full bg-brand-700 hover:bg-brand-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                      {bookLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                      Termin verbindlich anfragen
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Tab 4: Customer Damage Photo Uploader -> Google Drive */}
            {activeTab === 'photos' && (
              <div className="flex-1 p-4 overflow-y-auto bg-surface-50 text-xs">
                {photoSuccessId ? (
                  <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-brand-700 mx-auto" />
                    <div className="font-extrabold text-base text-brand-950">
                      Fotos gespeichert ({photoSuccessId})!
                    </div>
                    <p className="text-slate-600">
                      Ihre Schadensbilder wurden im Google Drive-Ordner <strong>{photoSuccessId}</strong> abgelegt. Herr Mahmood meldet sich kurzfristig bei Ihnen.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoSuccessId('');
                        setPhotos([]);
                      }}
                      className="text-brand-700 font-bold underline"
                    >
                      Weitere Fotos senden
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePhotoUploadSubmit} className="space-y-3">
                    <div className="font-bold text-slate-900 text-sm">
                      Schadensfotos direkt an Sachverständigen senden
                    </div>
                    <input
                      type="text"
                      required
                      value={photoName}
                      onChange={(e) => setPhotoName(e.target.value)}
                      placeholder="Ihr Name *"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                    <input
                      type="tel"
                      required
                      value={photoPhone}
                      onChange={(e) => setPhotoPhone(e.target.value)}
                      placeholder="Telefon / WhatsApp *"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                    <textarea
                      rows={2}
                      value={photoNote}
                      onChange={(e) => setPhotoNote(e.target.value)}
                      placeholder="Kurze Notiz zum Foto (z. B. Kellerwand links)..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 px-3 border-2 border-dashed border-brand-400 bg-brand-50/60 hover:bg-brand-50 text-brand-900 font-bold rounded-xl flex items-center justify-center gap-2"
                      >
                        <Camera className="w-4 h-4 text-brand-700" />
                        Kamera / Fotos auswählen ({photos.length}/5)
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handlePhotoFiles}
                        className="hidden"
                      />
                    </div>
                    {photos.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto py-1">
                        {photos.map((p, idx) => (
                          <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-300 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.preview} alt={`Schadensbild ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={photoSending || photos.length === 0}
                      className="w-full bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                    >
                      {photoSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Fotos jetzt hochladen
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Persistent 1-Click WhatsApp Bridge & Phone Bar */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-2">
              <a
                href={buildWhatsAppBridgeUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                1-Klick WhatsApp
              </a>
              <a
                href={`tel:${COMPANY.phoneHref}`}
                className="flex items-center justify-center gap-1.5 bg-[#0f2537] hover:bg-brand-900 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Direkt anrufen
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
