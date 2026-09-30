"use client";

import React, { useState } from "react";
import { MapPin, Search, CheckCircle2, Clock, Shield, ArrowRight, Building2 } from "lucide-react";
import { REGIONAL_CITIES } from "@/data/content-data";

export default function RegionalPLZ() {
  const [searchPlz, setSearchPlz] = useState("");
  const [checkResult, setCheckResult] = useState<{
    covered: boolean;
    city?: string;
    message?: string;
  } | null>(null);

  const handlePlzCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchPlz.trim();
    if (!clean) return;

    if (clean.startsWith("42") || clean.startsWith("583") || clean.startsWith("582") || clean.startsWith("408")) {
      let matchedCity = "Raum Wuppertal / Bergisches Land";
      if (clean.startsWith("421") || clean.startsWith("422") || clean.startsWith("423")) matchedCity = "Wuppertal";
      else if (clean.startsWith("426") || clean.startsWith("427")) matchedCity = "Solingen / Haan";
      else if (clean.startsWith("428")) matchedCity = "Remscheid";
      else if (clean.startsWith("425")) matchedCity = "Velbert";

      setCheckResult({
        covered: true,
        city: matchedCity,
        message: `Hervorragend! Die Postleitzahl ${clean} liegt in unserem Kern-Servicegebiet ${matchedCity}. Herr Mahmood kann in 24–48h eine kostenlose Feuchtigkeitsmessung vor Ort durchführen.`
      });
    } else {
      setCheckResult({
        covered: false,
        message: `Die PLZ ${clean} liegt außerhalb des Kerngebiets 42xxx. Als SchimmelPeter® Partnerbetrieb prüfen wir gerne eine Sonderanfahrt für Ihr Objekt.`
      });
    }
  };

  return (
    <section id="region-wuppertal" className="py-20 bg-sand-50/70 border-t border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-800 text-xs font-bold mb-3">
            <MapPin className="w-3.5 h-3.5 text-accent-700" />
            Zuständig für alle PLZ 42 Bereiche
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sand-900 tracking-tight">
            Unser Servicegebiet im Raum Wuppertal & Bergisches Land
          </h2>
          <p className="mt-4 text-sm sm:text-base text-sand-600 max-w-3xl mx-auto leading-relaxed">
            Wuppertal ist das industrielle Herz im Tal der Wupper — weltberühmt für seine Schwebebahn, historische Altbauten mit Natursteinfundamenten und steile Hanglagen. 
            Unser Servicegebiet für die professionelle Kellersanierung erstreckt sich über den gesamten PLZ-Bereich 42 und umfasst Solingen, Remscheid, Velbert und angrenzende Gemeinden.
          </p>
        </div>

        {/* Interactive PLZ Quick-Check Tool */}
        <div className="max-w-2xl mx-auto mb-14">
          <div className="bg-white rounded-2xl p-6 border border-sand-200 shadow-soft">
            <h3 className="text-sm font-bold text-sand-800 mb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-accent-600" />
              <span>Prüfen Sie Ihre Postleitzahl auf Vor-Ort-Service:</span>
            </h3>

            <form onSubmit={handlePlzCheck} className="flex gap-2">
              <input
                type="text"
                value={searchPlz}
                onChange={(e) => setSearchPlz(e.target.value)}
                placeholder="Ihre 5-stellige PLZ (z.B. 42103, 42651, 42853)..."
                maxLength={5}
                className="flex-1 px-4 py-2.5 rounded-xl border border-sand-200 text-xs sm:text-sm text-sand-800 focus:outline-none focus:ring-2 focus:ring-accent-500 bg-sand-50"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold transition-all shadow-soft shrink-0"
              >
                Prüfen
              </button>
            </form>

            {/* Check Results Display */}
            {checkResult && (
              <div
                className={`mt-4 p-4 rounded-xl text-xs leading-relaxed border ${
                  checkResult.covered
                    ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                    : "bg-amber-50 text-amber-900 border-amber-200"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      checkResult.covered ? "text-emerald-600" : "text-amber-600"
                    }`}
                  />
                  <div>
                    <div className="font-bold">
                      {checkResult.covered ? "✓ PLZ bestätigt: Vor-Ort-Analyse verfügbar" : "Erweitertes Einsatzgebiet"}
                    </div>
                    <div className="mt-1">{checkResult.message}</div>
                    {checkResult.covered && (
                      <a
                        href="#kontakt"
                        className="inline-flex items-center gap-1.5 mt-2 font-bold text-accent-700 hover:underline"
                      >
                        Jetzt Termin mit Herrn Mahmood anfragen &rarr;
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Regional Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REGIONAL_CITIES.map((c) => (
            <div
              key={c.name}
              className="bg-white rounded-2xl p-6 border border-sand-200 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-accent-600" />
                    <h3 className="text-lg font-bold text-sand-900">{c.name}</h3>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sand-100 text-sand-700 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" />
                    {c.responseHours}
                  </span>
                </div>

                <p className="text-xs text-sand-600 mb-4 leading-relaxed">
                  {c.highlight}
                </p>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-sand-700">Stadtteile: </span>
                    <span className="text-sand-500">{c.districts.join(", ")}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-sand-700">PLZ-Bereiche: </span>
                    <span className="text-sand-500">{c.plzPrefix.slice(0, 4).join(", ")}...</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-sand-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Kostenlose Vor-Ort-Messung
                </span>
                <a
                  href="#kontakt"
                  className="text-xs font-bold text-accent-700 hover:text-accent-800 flex items-center gap-1"
                >
                  Anfragen
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
