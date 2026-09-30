"use client";

import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import AmbientGlow from "@/components/ui/AmbientGlow";
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
        message: `Hervorragend! Die Postleitzahl ${clean} liegt in unserem Kern-Servicegebiet ${matchedCity}. Herr Mahmood führt innerhalb von 24–48h eine kostenlose Feuchtigkeitsmessung vor Ort durch.`
      });
    } else {
      setCheckResult({
        covered: false,
        message: `Die PLZ ${clean} liegt außerhalb des Kerngebiets 42xxx. Als SchimmelPeter® Partner prüfen wir gerne eine Sonderanfahrt für Ihr Objekt.`
      });
    }
  };

  return (
    <section id="servicegebiet" className="relative bg-landing-ink text-landing-bone overflow-hidden">
      <AmbientGlow />

      <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-32">
        {/* Section Header */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-5 text-landing-mint font-mono">
          Servicegebiet Raum Wuppertal & Bergisches Land
        </p>
        <h2 className="font-editorial font-normal tracking-[-0.02em] leading-[1.04] text-[2.25rem] sm:text-5xl lg:text-[3.5rem] text-landing-bone">
          Das Tal der Wupper.
          <br />
          <span className="italic text-landing-mint">Unser Kern-Einsatzgebiet.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-landing-bone/70">
          Wuppertal, Solingen, Remscheid, Velbert und das gesamte Bergische Land sind durch Schiefer- und Ziegelaltbauten an steilen Hanglagen geprägt. 
          Hier braucht es erfahrene Bautenschutz-Fachleute, die die lokale Bausubstanz kennen. Zuständig für alle Postleitzahlen beginnend mit 42.
        </p>

        {/* Minimalist PLZ Search Bar */}
        <div className="mt-12 max-w-xl">
          <form onSubmit={handlePlzCheck} className="flex gap-2">
            <input
              type="text"
              value={searchPlz}
              onChange={(e) => setSearchPlz(e.target.value)}
              placeholder="Ihre 5-stellige PLZ (z.B. 42103)..."
              maxLength={5}
              className="flex-1 px-5 py-3.5 rounded-full border border-white/10 text-xs sm:text-sm font-mono text-landing-bone bg-landing-ink2 focus:outline-none focus:border-landing-mint placeholder:text-landing-bone/30"
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-full bg-landing-bone hover:bg-white text-[#0E1310] text-xs font-mono font-semibold transition-all shrink-0 active:scale-[0.98]"
            >
              Prüfen
            </button>
          </form>

          {checkResult && (
            <div
              className={`mt-4 p-5 rounded-2xl text-xs font-mono leading-relaxed border ${
                checkResult.covered
                  ? "bg-landing-mint/10 text-landing-mint border-landing-mint/30"
                  : "bg-amber-400/10 text-amber-300 border-amber-400/30"
              }`}
            >
              <div className="font-bold text-sm">
                {checkResult.covered ? "✓ Volle Abdeckung im Raum 42" : "Erweitertes Einsatzgebiet"}
              </div>
              <div className="mt-1 text-landing-bone/80">{checkResult.message}</div>
              {checkResult.covered && (
                <a href="#kontakt" className="inline-block mt-3 text-landing-mint underline font-bold">
                  Jetzt Vor-Ort-Termin anfragen →
                </a>
              )}
            </div>
          )}
        </div>

        {/* Regional City Matrix */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {REGIONAL_CITIES.map((city) => (
            <div
              key={city.name}
              className="p-6 rounded-2xl bg-landing-ink2 border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-editorial font-normal text-landing-bone group-hover:text-landing-mint transition-colors">
                    {city.name}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-landing-emerald/15 text-landing-mint">
                    PLZ {city.plzPrefix[0]}
                  </span>
                </div>

                <p className="text-xs text-landing-bone/60 leading-relaxed">
                  {city.highlight}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-landing-bone/40">
                  {city.districts.slice(0, 3).join(", ")}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-landing-emerald">{city.responseHours}</span>
                <a
                  href="#kontakt"
                  className="flex items-center gap-1 text-xs font-mono text-landing-bone/70 group-hover:text-landing-mint transition-colors"
                >
                  <span>Anfragen</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
