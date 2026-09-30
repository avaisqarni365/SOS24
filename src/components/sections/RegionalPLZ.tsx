"use client";

import React, { useState } from "react";
import { Search, CheckCircle2, Clock, ArrowRight, ArrowUpRight } from "lucide-react";
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
    <section id="servicegebiet" className="py-24 bg-[#0b0e14] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header - Kontai24 Style */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
            Servicegebiet PLZ 42
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Das Tal der Wupper.
            <br />
            <span className="text-slate-400">Unser Kern-Einsatzgebiet.</span>
          </h2>
          <p className="mt-6 text-base text-slate-400 leading-relaxed">
            Wuppertal, Solingen, Remscheid, Velbert und das Bergische Land sind durch Schiefer, Bruchstein, Ziegelaltbauten und steile Hanglagen geprägt. 
            Hier braucht es erfahrene Bautenschutz-Fachleute, die die lokale Bausubstanz kennen. Zuständig für alle Postleitzahlen beginnend mit 42.
          </p>
        </div>

        {/* Minimalist PLZ Search Bar */}
        <div className="max-w-xl mb-16">
          <form onSubmit={handlePlzCheck} className="flex gap-2">
            <input
              type="text"
              value={searchPlz}
              onChange={(e) => setSearchPlz(e.target.value)}
              placeholder="Ihre 5-stellige PLZ eingeben (z.B. 42103)..."
              maxLength={5}
              className="flex-1 px-4 py-3 rounded-xl border border-white/[0.12] text-xs sm:text-sm font-mono text-white focus:outline-none focus:border-cyan-400 bg-white/[0.03]"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.15] text-white text-xs font-mono font-medium transition-all shrink-0"
            >
              Verfügbarkeit prüfen
            </button>
          </form>

          {checkResult && (
            <div
              className={`mt-4 p-4 rounded-xl text-xs font-mono leading-relaxed border ${
                checkResult.covered
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                  : "bg-amber-500/10 text-amber-300 border-amber-500/30"
              }`}
            >
              <div className="font-bold">
                {checkResult.covered ? "✓ Volle Abdeckung im Raum 42" : "Erweitertes Servicegebiet"}
              </div>
              <div className="mt-1">{checkResult.message}</div>
              {checkResult.covered && (
                <a href="#kontakt" className="inline-block mt-2 text-cyan-400 underline">
                  Jetzt Vor-Ort-Termin anfragen &rarr;
                </a>
              )}
            </div>
          )}
        </div>

        {/* Regional City Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {REGIONAL_CITIES.slice(0, 4).map((c) => (
            <div
              key={c.name}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{c.name}</h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {c.responseHours}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  {c.highlight}
                </p>
                <div className="text-[11px] font-mono text-slate-500">
                  PLZ: {c.plzPrefix.slice(0, 3).join(", ")}...
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400">24-48h Vor Ort</span>
                <a href="#kontakt" className="text-slate-400 hover:text-white flex items-center gap-1">
                  <span>Anfragen</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
