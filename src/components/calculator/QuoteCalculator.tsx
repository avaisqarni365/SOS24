'use client';

import React, { useState } from 'react';
import {
  Calculator,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  Phone,
  ShieldCheck,
  Info,
  Send,
  Loader2,
} from 'lucide-react';
import { COMPANY } from '@/data/content-data';
import { submitLeadToWorkspace } from '@/lib/backend';
import SendError from '@/components/ui/SendError';

type DamageCategory = 'horizontalsperre' | 'kellerinnenabdichtung' | 'schimmel' | 'rissinjektion';
type SeverityLevel = 'leicht' | 'mittel' | 'stark';
type WallMaterial = 'ziegel' | 'beton' | 'bruchstein' | 'unklar';

const CATEGORY_CONFIG: Record<
  DamageCategory,
  {
    label: string;
    unit: string;
    minQty: number;
    maxQty: number;
    defaultQty: number;
    recommendedMethod: string;
    durationDays: string;
  }
> = {
  horizontalsperre: {
    label: 'Aufsteigende Feuchte (Horizontalsperre)',
    unit: 'laufende Meter Wandlänge (lfm)',
    minQty: 3,
    maxQty: 60,
    defaultQty: 12,
    recommendedMethod: 'Niederdruck-/gravimetrische Bohrlochinjektion (Silan-Siloxan / Paraffin-System nach WTA)',
    durationDays: '1 bis 2 Arbeitstage',
  },
  kellerinnenabdichtung: {
    label: 'Feuchte Kellerwand (Innenabdichtung & Sanierputz)',
    unit: 'Quadratmeter Wandfläche (m²)',
    minQty: 5,
    maxQty: 120,
    defaultQty: 20,
    recommendedMethod: 'Negativabdichtung (Dichtungsschlämme MDS) + mehrlagiges WTA-Sanierputzsystem inkl. Hohlkehle',
    durationDays: '2 bis 4 Arbeitstage',
  },
  schimmel: {
    label: 'Schimmelbefall & Wärmebrücken (Klimaplatte)',
    unit: 'Quadratmeter Wandfläche (m²)',
    minQty: 3,
    maxQty: 80,
    defaultQty: 12,
    recommendedMethod: 'Sporensichere Tiefendesinfektion + kapillaraktive Calciumsilikat-Klimaplatte zur Taupunktanhebung',
    durationDays: '1 bis 2 Arbeitstage',
  },
  rissinjektion: {
    label: 'Wasserführende Wand-/Bodenrisse (Harzinjektion)',
    unit: 'laufende Meter Risslänge (lfm)',
    minQty: 1,
    maxQty: 30,
    defaultQty: 5,
    recommendedMethod: 'Hochdruck-Verpressung über Bohrpacker mit elastischem 2K-Polyurethan- oder Epoxidharz',
    durationDays: '1 Arbeitstag',
  },
};

const SEVERITY_CONFIG: Record<SeverityLevel, { label: string; hint: string }> = {
  leicht: {
    label: 'Leicht (erste Feuchteflecken / muffiger Geruch)',
    hint: 'Geringer Vorbereitungsaufwand am Altputz',
  },
  mittel: {
    label: 'Deutlich (Salzausblühungen / abblätternder Putz)',
    hint: 'Inkl. Altputzabschlag im Schadensbereich & Salzbehandlung',
  },
  stark: {
    label: 'Stark (drückende Nässe / dicker Altbau-Bruchstein)',
    hint: 'Erhöhter Injektionsmittelbedarf & mehrlagiger Systemaufbau',
  },
};

const MATERIAL_CONFIG: Record<WallMaterial, { label: string }> = {
  ziegel: { label: 'Ziegelmauerwerk / Kalksandstein' },
  beton: { label: 'Beton / Hohlblockstein' },
  bruchstein: { label: 'Bruchstein / Naturstein (Altbau NRW)' },
  unklar: { label: 'Noch unklar (wird vor Ort gemessen)' },
};

export default function QuoteCalculator() {
  const [category, setCategory] = useState<DamageCategory>('horizontalsperre');
  const [quantity, setQuantity] = useState<number>(12);
  const [severity, setSeverity] = useState<SeverityLevel>('mittel');
  const [material, setMaterial] = useState<WallMaterial>('ziegel');
  const [plz, setPlz] = useState<string>('42103 Wuppertal');
  const [quickPhone, setQuickPhone] = useState<string>('');
  const [quickName, setQuickName] = useState<string>('');
  const [sendingCloud, setSendingCloud] = useState(false);
  const [cloudLeadId, setCloudLeadId] = useState<string>('');
  const [sendError, setSendError] = useState<string>('');

  const config = CATEGORY_CONFIG[category];

  const handleCategoryChange = (newCat: DamageCategory) => {
    setCategory(newCat);
    setQuantity(CATEGORY_CONFIG[newCat].defaultQty);
    setCloudLeadId('');
  };

  const whatsappSummary = encodeURIComponent(
    `Hallo Herr Mahmood (${COMPANY.name}),\n\n` +
      `ich habe den Sanierungs- & Aufmaßplaner auf Ihrer Website genutzt:\n` +
      `• Schadensart: ${config.label}\n` +
      `• Geschätzter Umfang: ca. ${quantity} ${config.unit}\n` +
      `• Mauerwerk: ${MATERIAL_CONFIG[material].label}\n` +
      `• Schadensgrad: ${SEVERITY_CONFIG[severity].label}\n` +
      `• Objektort: ${plz}\n\n` +
      `Ich bitte um eine kostenlose Vor-Ort-Feuchtemessung und die Erstellung eines verbindlichen Festpreisangebots.`
  );

  const handleDirectCloudRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickName.trim() || !quickPhone.trim()) return;
    setSendingCloud(true);
    setSendError('');
    try {
      const res = await submitLeadToWorkspace({
        name: quickName.trim(),
        phone: quickPhone.trim(),
        plzOrt: plz,
        damageType: config.label,
        severity,
        areaOrLength: quantity,
        message: `Aufmaß-Anfrage: ${config.label}, Umfang: ${quantity} ${config.unit}, Mauerwerk: ${MATERIAL_CONFIG[material].label}, Grad: ${SEVERITY_CONFIG[severity].label}`,
        source: 'Sanierungsrechner',
      });
      if (res.ok && res.id) setCloudLeadId(res.id);
      else setSendError(res.error || 'server');
    } finally {
      setSendingCloud(false);
    }
  };

  return (
    <section id="rechner" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full mb-3">
            <Calculator className="w-3.5 h-3.5" />
            Interaktiver Sanierungs- &amp; Aufmaßplaner 2026
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-950 tracking-tight mb-3">
            Sanierungsaufwand &amp; Verfahren für Ihr Objekt ermitteln
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Wählen Sie Schadensbild, Wandfläche und Mauerwerk: Sie sehen sofort das bautechnisch empfohlene WTA-Verfahren und den Arbeitsumfang. Ein millimetergenaues, verbindliches Festpreisangebot erhalten Sie direkt nach der kostenlosen Feuchtemessung vor Ort – ehrlich, transparent und ohne ungenaue Schätzformeln.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Controls */}
          <div className="lg:col-span-7 bg-surface-50 rounded-2xl p-6 sm:p-8 border border-slate-200/90 space-y-7">
            {/* Step 1: Category */}
            <div>
              <label className="block text-sm font-bold text-brand-950 mb-3">
                1. Welches Schadensbild liegt vor?
              </label>
              <div className="grid sm:grid-cols-2 gap-3">
                {(Object.keys(CATEGORY_CONFIG) as DamageCategory[]).map((key) => {
                  const active = category === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleCategoryChange(key)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        active
                          ? 'bg-brand-950 text-white border-brand-950 shadow-sm'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-brand-500'
                      }`}
                    >
                      <div className="text-sm font-bold leading-snug">{CATEGORY_CONFIG[key].label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Quantity Slider */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label htmlFor="calc-qty" className="text-sm font-bold text-brand-950">
                  2. Geschätzter Umfang ({config.unit})
                </label>
                <span className="text-xl font-extrabold text-brand-700 bg-brand-100 px-3 py-1 rounded-lg">
                  {quantity} {category === 'horizontalsperre' || category === 'rissinjektion' ? 'lfm' : 'm²'}
                </span>
              </div>
              <input
                id="calc-qty"
                type="range"
                min={config.minQty}
                max={config.maxQty}
                step={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-700"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Min: {config.minQty}</span>
                <span>Mittelwert: {config.defaultQty}</span>
                <span>Max: {config.maxQty}</span>
              </div>
            </div>

            {/* Step 3: Severity */}
            <div>
              <label className="block text-sm font-bold text-brand-950 mb-3">
                3. Grad der Durchfeuchtung / Schädigung
              </label>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {(Object.keys(SEVERITY_CONFIG) as SeverityLevel[]).map((lvl) => {
                  const active = severity === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSeverity(lvl)}
                      className={`text-left p-3.5 rounded-xl border text-xs transition-all ${
                        active
                          ? 'bg-brand-100/80 border-brand-600 text-brand-950 font-bold'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold mb-1">{SEVERITY_CONFIG[lvl].label}</div>
                      <div className="text-[11px] text-slate-500">{SEVERITY_CONFIG[lvl].hint}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Wall Material & PLZ */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="calc-material" className="block text-sm font-bold text-brand-950 mb-2">
                  4. Mauerwerk / Bausubstanz
                </label>
                <select
                  id="calc-material"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value as WallMaterial)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-brand-600 outline-none"
                >
                  {(Object.keys(MATERIAL_CONFIG) as WallMaterial[]).map((mat) => (
                    <option key={mat} value={mat}>
                      {MATERIAL_CONFIG[mat].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="calc-plz" className="block text-sm font-bold text-brand-950 mb-2">
                  5. PLZ / Ort des Gebäudes
                </label>
                <input
                  id="calc-plz"
                  type="text"
                  value={plz}
                  onChange={(e) => setPlz(e.target.value)}
                  placeholder="z. B. 42103 Wuppertal"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-medium focus:border-brand-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right: Result Card */}
          <div className="lg:col-span-5 bg-brand-950 text-white rounded-2xl p-6 sm:p-8 shadow-elevated space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Fachgerechte Aufmaß- &amp; Schadensanalyse
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white mt-2.5 tracking-tight leading-snug">
                Verbindlicher Festpreis nach Vor-Ort-Messung
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Keine ungenauen Schätzformeln aus dem Internet: Sie erhalten ein verbindliches, millimetergenaues Festpreisangebot direkt nach der <strong>kostenlosen Vor-Ort-Feuchtemessung</strong> durch Inhaber Shahzad Mahmood.
              </p>
            </div>

            <div className="bg-brand-900/70 rounded-xl p-4 border border-brand-800 space-y-3 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wider text-brand-300 font-semibold">
                  Empfohlenes Sanierungsverfahren
                </div>
                <div className="font-semibold text-white mt-0.5">{config.recommendedMethod}</div>
              </div>
              <div className="flex justify-between pt-2 border-t border-brand-800/80 text-xs">
                <span className="text-slate-300">Geschätzter Umfang:</span>
                <span className="font-bold text-white">{quantity} {category === 'horizontalsperre' || category === 'rissinjektion' ? 'lfm' : 'm²'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Geschätzte Ausführungsdauer:</span>
                <span className="font-bold text-brand-300">{config.durationDays}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Vor-Ort-Feuchtemessung:</span>
                <span className="font-bold text-emerald-400">0,00 € (Kostenlos &amp; unverbindlich)</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-brand-800/60">
                <span className="text-slate-300">§ 35a EStG Steuerbonus:</span>
                <span className="font-bold text-emerald-300">20 % Handwerkerleistung</span>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                Inklusive kapazitiver Tiefenfeuchtemessung &amp; Salzanalyse vor Ort
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                Ohne Aufbaggern des Gartens – saubere Ausführung von innen
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent-400 shrink-0" />
                10 Jahre sos-abdichtung Ausführungsgarantie + 25 Jahre Produktgarantie
              </li>
            </ul>

            {/* Direct 1-Click Cloud Inquiry Box */}
            {cloudLeadId ? (
              <div className="bg-brand-900/90 border border-brand-500 rounded-xl p-4 text-xs space-y-1.5">
                <div className="font-bold text-brand-300 text-sm">
                  ✓ Aufmaß &amp; Schadensdaten gespeichert (Nr. {cloudLeadId})
                </div>
                <p className="text-slate-200">
                  Herr Shahzad Mahmood hat Ihre Schadensparameter erhalten und meldet sich kurzfristig telefonisch zur Abstimmung der kostenlosen Vor-Ort-Messung.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDirectCloudRequest} className="bg-brand-900/60 border border-brand-800 rounded-xl p-3.5 space-y-2.5">
                <div className="text-xs font-bold text-brand-300">
                  ⚡ Daten direkt für kostenlose Vor-Ort-Messung vormerken:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="Ihr Name *"
                    aria-label="Ihr Name"
                    className="px-3 py-2 rounded-lg bg-brand-950/90 border border-brand-700 text-white placeholder-slate-400 text-xs outline-none focus:border-brand-400"
                  />
                  <input
                    type="tel"
                    required
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    placeholder="Telefon / Mobil *"
                    aria-label="Telefonnummer"
                    className="px-3 py-2 rounded-lg bg-brand-950/90 border border-brand-700 text-white placeholder-slate-400 text-xs outline-none focus:border-brand-400"
                  />
                </div>
                <SendError error={sendError} />
                <button
                  type="submit"
                  disabled={sendingCloud}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold px-4 py-2.5 rounded-lg text-xs transition-colors"
                >
                  {sendingCloud ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  Kostenlose Vor-Ort-Messung anfordern
                </button>
              </form>
            )}

            <div className="space-y-3 pt-1">
              <a
                href={`https://wa.me/${COMPANY.whatsappNumber}?text=${whatsappSummary}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-5 py-3.5 rounded-xl transition-colors text-sm shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                Aufmaß per WhatsApp senden &amp; Vor-Ort-Termin buchen
              </a>

              <a
                href="/kontakt/#kontakt"
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-brand-950 font-bold px-5 py-3.5 rounded-xl transition-colors text-sm"
              >
                Festpreis-Besichtigung im Formular anfragen
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`tel:${COMPANY.phoneHref}`}
                className="w-full inline-flex items-center justify-center gap-2 text-brand-200 hover:text-white font-semibold py-2 text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Direkt anrufen: {COMPANY.phoneDisplay}
              </a>
            </div>

            <div className="flex items-start gap-2 text-[11px] text-slate-400 pt-2 border-t border-brand-900">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-brand-400" />
              <span>
                Hinweis: Jeder Feuchteschaden ist individuell. Das verbindliche Festpreisangebot erhalten Sie nach unserer kostenlosen elektronischen Feuchtemessung vor Ort.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
