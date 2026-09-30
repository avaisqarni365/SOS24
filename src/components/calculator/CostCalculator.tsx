"use client";

import React, { useState } from "react";
import { Calculator, ShieldCheck, ArrowRight, CheckCircle2, TrendingDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function CostCalculator() {
  const { t } = useLanguage();
  const [damageType, setDamageType] = useState<"wand" | "keller" | "schimmel">("wand");
  const [meters, setMeters] = useState<number>(10);
  const [wallType, setWallType] = useState<"altbau" | "beton">("altbau");

  const costPerMeterInjection = damageType === "wand" ? 180 : damageType === "keller" ? 260 : 95;
  const multiplier = wallType === "altbau" ? 1.15 : 1.0;

  const estimatedInjectionCost = Math.round(meters * costPerMeterInjection * multiplier);
  const estimatedExcavationCost = Math.round(estimatedInjectionCost * 2.4);
  const savings = estimatedExcavationCost - estimatedInjectionCost;

  return (
    <section id="rechner" className="relative bg-landing-bone text-[#1A1D1B]">
      <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-32">
        {/* Section Header */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-5 text-landing-emerald font-mono">
          {t("calc.eyebrow")}
        </p>
        <h2 className="font-editorial font-normal tracking-[-0.02em] leading-[1.04] text-[2.25rem] sm:text-5xl lg:text-[3.5rem] text-[#1A1D1B]">
          {t("calc.h1")}
          <br />
          <span className="italic text-landing-mint">{t("calc.accent")}</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#444945]">
          {t("calc.sub")}
        </p>

        {/* Snow White Bright Calculator Card */}
        <div className="mt-14 w-full bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 bg-landing-bone2/60 border-b border-black/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#1A1D1B]">
              <span className="w-2 h-2 rounded-full bg-landing-emerald" />
              <span>SchimmelPeter® Verfahren · Verbindliches Angebot nach Messung</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-landing-emerald font-semibold bg-white px-3 py-1.5 rounded-full border border-black/5 shadow-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>10 J. Garantie + bis 25 J. Produktgarantie</span>
            </div>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Inputs */}
            <div className="lg:col-span-7 space-y-7">
              <div>
                <label className="block text-xs font-mono font-bold text-[#1A1D1B] uppercase tracking-wider mb-3">
                  {t("calc.step1")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "wand", label: "Feuchte Wand", sub: "Horizontalsperre", icon: "🧱" },
                    { id: "keller", label: "Nasser Keller", sub: "Innenabdichtung", icon: "🏠" },
                    { id: "schimmel", label: "Schimmel", sub: "Ursachenbeseitigung", icon: "🛡️" }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setDamageType(item.id as any)}
                      className={`p-4 rounded-2xl text-left border transition-all ${
                        damageType === item.id
                          ? "border-black bg-[#1A1D1B] text-landing-bone shadow-sm"
                          : "border-black/10 bg-landing-bone2/40 text-[#1A1D1B] hover:bg-white"
                      }`}
                    >
                      <span className="text-xl mb-1.5 block">{item.icon}</span>
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className={`text-[11px] font-mono mt-0.5 ${damageType === item.id ? "text-landing-bone/70" : "text-[#444945]"}`}>
                        {item.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono font-bold text-[#1A1D1B] uppercase tracking-wider">
                    {t("calc.step2")}
                  </label>
                  <span className="text-sm font-mono font-bold text-landing-emerald bg-landing-emerald/10 px-3.5 py-1 rounded-full border border-landing-emerald/20">
                    {meters} m
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="35"
                  step="1"
                  value={meters}
                  onChange={(e) => setMeters(Number(e.target.value))}
                  className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-landing-emerald"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#444945] mt-2">
                  <span>3 m</span>
                  <span>15 m</span>
                  <span>35 m</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#1A1D1B] uppercase tracking-wider mb-2.5">
                  {t("calc.step3")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setWallType("altbau")}
                    className={`py-3 px-4 rounded-xl text-xs font-mono text-center border transition-all ${
                      wallType === "altbau"
                        ? "border-black bg-[#1A1D1B] text-landing-bone font-bold"
                        : "border-black/10 bg-landing-bone2/40 text-[#1A1D1B] hover:bg-white"
                    }`}
                  >
                    Ziegel / Bruchstein Altbau
                  </button>
                  <button
                    onClick={() => setWallType("beton")}
                    className={`py-3 px-4 rounded-xl text-xs font-mono text-center border transition-all ${
                      wallType === "beton"
                        ? "border-black bg-[#1A1D1B] text-landing-bone font-bold"
                        : "border-black/10 bg-landing-bone2/40 text-[#1A1D1B] hover:bg-white"
                    }`}
                  >
                    Kalksandstein / Beton
                  </button>
                </div>
              </div>
            </div>

            {/* Right Cost Summary */}
            <div className="lg:col-span-5 p-7 rounded-2xl bg-landing-bone border border-black/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-landing-emerald font-semibold">
                    {t("calc.estTitle")}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-landing-emerald/15 text-landing-emerald border border-landing-emerald/25 font-bold">
                    ca. -60% Ersparnis
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-4xl font-editorial font-normal text-[#1A1D1B]">
                    ab {estimatedInjectionCost.toLocaleString("de-DE")} €*
                  </div>
                  <p className="text-xs text-[#444945] mt-1 font-mono">
                    inkl. Bohrung, SchimmelPeter-Injektion & Versiegelung
                  </p>
                </div>

                {/* Excavation comparison */}
                <div className="mt-6 pt-5 border-t border-black/5 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-[#444945]">
                    <span>Klassische Außenaufgrabung:</span>
                    <span className="line-through text-red-700/80">
                      ca. {estimatedExcavationCost.toLocaleString("de-DE")} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-landing-emerald font-bold p-3 rounded-xl bg-white border border-black/5 shadow-xs">
                    <span className="flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4" />
                      Ihre Kostenersparnis:
                    </span>
                    <span>ca. {savings.toLocaleString("de-DE")} €</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-2 text-xs text-[#444945]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-landing-emerald shrink-0" />
                    <span>Keine Zerstörung von Garten oder Einfahrt</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-landing-emerald shrink-0" />
                    <span>Saubere Ausführung von der Innenseite</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-landing-emerald shrink-0" />
                    <span>10 Jahre Garantie auf die Arbeit, bis zu 25 Jahre Produktgarantie des Herstellers</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-black/5">
                <a
                  href="#kontakt"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-all active:scale-[0.98] bg-[#1A1D1B] text-landing-bone hover:bg-black shadow-sm"
                >
                  <span>{t("calc.cta")}</span>
                  <ArrowRight className="w-4 h-4 text-landing-mint" />
                </a>
                <p className="text-[10px] text-center text-black/40 mt-2 font-mono">
                  *Richtwert. Exakte Kosten hängen vom Durchfeuchtungsgrad ab. Vor-Ort-Messung unverbindlich.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
