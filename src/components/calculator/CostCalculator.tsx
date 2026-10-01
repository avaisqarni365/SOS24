"use client";

import React, { useState } from "react";
import { ShieldCheck, ArrowRight, CheckCircle2, TrendingDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function CostCalculator({ hideHeader = false }: { hideHeader?: boolean }) {
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
    <section id="rechner" className="surface-bone relative bg-white text-[#0b0f0d]">
      <div className="relative sc-wrap sc-section pt-6">
        {!hideHeader && (
          <div className="mb-10">
            <p className="sc-label text-[#0f5c49]">
              {t("calc.eyebrow")}
            </p>
            <h2 className="sc-display mt-3 text-4xl sm:text-5xl lg:text-6xl text-[#0b0f0d]">
              {t("calc.h1")} <em className="text-[var(--brick)]">{t("calc.accent")}</em>
            </h2>
            <p className="sc-body mt-4 max-w-2xl text-[#3b4641]">
              {t("calc.sub")}
            </p>
          </div>
        )}

        {/* Clean White Calculator Card */}
        <div className="w-full bg-white rounded-3xl border border-line/12 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 bg-[#f7faf9] border-b border-line/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#0b0f0d]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#13755d]" />
              <span>SchimmelPeter® Verfahren · Verbindliches Angebot nach Messung</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#0f5c49] font-semibold bg-white px-3.5 py-1.5 rounded-full border border-line/12 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#13755d]" />
              <span>10 J. Garantie + 25 J. Produktgarantie</span>
            </div>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Inputs */}
            <div className="lg:col-span-7 space-y-7">
              <div>
                <label className="block text-xs font-mono font-bold text-[#0b0f0d] uppercase tracking-wider mb-3">
                  {t("calc.step1")}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "wand", label: "Feuchte Wand", sub: "Horizontalsperre", icon: "🧱" },
                    { id: "keller", label: "Nasser Keller", sub: "Innenabdichtung", icon: "🏠" },
                    { id: "schimmel", label: "Schimmel", sub: "Ursachenbeseitigung", icon: "🛡️" },
                  ].map((item) => {
                    const isActive = damageType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDamageType(item.id as any)}
                        className={`p-4 rounded-2xl text-left border transition-all ${
                          isActive
                            ? "border-[#13755d] bg-[#13755d] text-white shadow-md"
                            : "border-line/12 bg-[#f7faf9] text-[#0b0f0d] hover:bg-white hover:border-[#13755d]/40"
                        }`}
                      >
                        <span className="text-xl mb-1.5 block">{item.icon}</span>
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className={`text-[11px] font-mono mt-0.5 ${isActive ? "text-white/80" : "text-[#55605c]"}`}>
                          {item.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-mono font-bold text-[#0b0f0d] uppercase tracking-wider">
                    {t("calc.step2")}
                  </label>
                  <span className="text-sm font-mono font-bold text-[#0f5c49] bg-[#13755d]/10 px-3.5 py-1 rounded-full border border-[#13755d]/20">
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
                  className="w-full h-2.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#13755d]"
                />
                <div className="flex justify-between text-[11px] font-mono text-[#55605c] mt-2">
                  <span>3 m</span>
                  <span>15 m</span>
                  <span>35 m</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-[#0b0f0d] uppercase tracking-wider mb-2.5">
                  {t("calc.step3")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setWallType("altbau")}
                    className={`py-3.5 px-4 rounded-xl text-xs font-mono text-center border transition-all ${
                      wallType === "altbau"
                        ? "border-[#13755d] bg-[#13755d] text-white font-bold shadow-sm"
                        : "border-line/12 bg-[#f7faf9] text-[#0b0f0d] hover:bg-white"
                    }`}
                  >
                    Ziegel / Bruchstein Altbau
                  </button>
                  <button
                    type="button"
                    onClick={() => setWallType("beton")}
                    className={`py-3.5 px-4 rounded-xl text-xs font-mono text-center border transition-all ${
                      wallType === "beton"
                        ? "border-[#13755d] bg-[#13755d] text-white font-bold shadow-sm"
                        : "border-line/12 bg-[#f7faf9] text-[#0b0f0d] hover:bg-white"
                    }`}
                  >
                    Kalksandstein / Beton
                  </button>
                </div>
              </div>
            </div>

            {/* Right Cost Summary */}
            <div className="lg:col-span-5 p-7 rounded-2xl bg-[#f7faf9] border border-line/12 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#0f5c49] font-bold">
                    {t("calc.estTitle")}
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#13755d]/15 text-[#0f5c49] border border-[#13755d]/25 font-bold">
                    ca. -60% Ersparnis
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-4xl font-editorial font-bold text-[#0b0f0d]">
                    ab {estimatedInjectionCost.toLocaleString("de-DE")} €*
                  </div>
                  <p className="text-xs text-[#55605c] mt-1 font-mono">
                    inkl. Bohrung, SchimmelPeter-Injektion & Versiegelung
                  </p>
                </div>

                {/* Excavation comparison */}
                <div className="mt-6 pt-5 border-t border-line/10 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-[#55605c]">
                    <span>Klassische Außenaufgrabung:</span>
                    <span className="line-through text-red-700/80">
                      ca. {estimatedExcavationCost.toLocaleString("de-DE")} €
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[#0f5c49] font-bold p-3.5 rounded-xl bg-white border border-line/10 shadow-xs">
                    <span className="flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4 text-[#13755d]" />
                      Ihre Kostenersparnis:
                    </span>
                    <span>ca. {savings.toLocaleString("de-DE")} €</span>
                  </div>
                </div>

                <ul className="mt-6 space-y-2.5 text-xs text-[#3b4641]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#13755d] shrink-0" />
                    <span>Keine Zerstörung von Garten oder Einfahrt</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#13755d] shrink-0" />
                    <span>Saubere Ausführung von der Innenseite</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#13755d] shrink-0" />
                    <span>10 Jahre Garantie auf die Arbeit, 25 Jahre Produktgarantie</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-line/10">
                <a
                  href="#kontakt"
                  className="btn-shine w-full inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold text-white shadow-md active:scale-[0.98]"
                >
                  <span>{t("calc.cta")}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <p className="text-[10px] text-center text-[#55605c] mt-2 font-mono">
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
