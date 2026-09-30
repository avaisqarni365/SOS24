"use client";

import React, { useState } from "react";
import { Calculator, ShieldCheck, ArrowRight, CheckCircle2, TrendingDown } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export default function CostCalculator() {
  const [damageType, setDamageType] = useState<"wand" | "keller" | "schimmel">("wand");
  const [meters, setMeters] = useState<number>(10);
  const [wallType, setWallType] = useState<"altbau" | "beton">("altbau");
  const [plz, setPlz] = useState<string>("42103");

  const costPerMeterInjection = damageType === "wand" ? 180 : damageType === "keller" ? 260 : 95;
  const multiplier = wallType === "altbau" ? 1.15 : 1.0;

  const estimatedInjectionCost = Math.round(meters * costPerMeterInjection * multiplier);
  const estimatedExcavationCost = Math.round(estimatedInjectionCost * 2.4);
  const savings = estimatedExcavationCost - estimatedInjectionCost;

  return (
    <div className="w-full bg-dark-850 rounded-3xl border border-white/10 shadow-card-dark overflow-hidden">
      <div className="p-6 sm:p-8 bg-dark-900 border-b border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-800 text-cyan-400 text-xs font-mono font-semibold mb-2 border border-cyan-500/30">
              <Calculator className="w-3.5 h-3.5" />
              Kostenvoranschlag-Rechner Raum Wuppertal
            </div>
            <h3 className="text-2xl font-bold text-white">
              Sanierungskosten kalkulieren & bis zu 60% sparen
            </h3>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Vergleichen Sie das schonende Injektionsverfahren von innen mit einer teuren Außenaufgrabung für Ihr Gebäude in der Region 42xxx.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-dark-800 px-3.5 py-2 rounded-xl border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>WTA-Richtwerte & Festpreis-Garantie</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2.5">
              1. Welche Sanierung wird benötigt?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: "wand", label: "Feuchte Wand", sub: "Horizontalsperre", icon: "🧱" },
                { id: "keller", label: "Nasser Keller", sub: "Innenabdichtung", icon: "🏠" },
                { id: "schimmel", label: "Schimmel", sub: "Ursachenbeseitigung", icon: "🛡️" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setDamageType(item.id as any)}
                  className={`p-3.5 rounded-2xl text-left border transition-all ${
                    damageType === item.id
                      ? "border-cyan-500 bg-cyan-500/10 shadow-glow-cyan-sm"
                      : "border-white/10 bg-dark-800 hover:border-white/20"
                  }`}
                >
                  <span className="text-xl mb-1 block">{item.icon}</span>
                  <div className="text-xs font-bold text-white">{item.label}</div>
                  <div className="text-[11px] font-mono text-slate-400">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                2. Betroffene Wandlänge (ca. Laufmeter):
              </label>
              <span className="text-base font-mono font-extrabold text-cyan-300 bg-dark-800 px-3 py-1 rounded-xl border border-cyan-500/30">
                {meters} Meter
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="35"
              step="1"
              value={meters}
              onChange={(e) => setMeters(Number(e.target.value))}
              className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
              <span>3 m (Teilwand)</span>
              <span>15 m (Halber Keller)</span>
              <span>35 m (Komplett)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                3. Bauweise / Mauerwerk
              </label>
              <select
                value={wallType}
                onChange={(e) => setWallType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-xs text-white bg-dark-800 focus:outline-none focus:border-cyan-500"
              >
                <option value="altbau">Wuppertaler Altbau (Ziegel / Bruchstein)</option>
                <option value="beton">Massivbau / Beton / Bimsstein</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                4. PLZ im Raum Wuppertal
              </label>
              <input
                type="text"
                value={plz}
                maxLength={5}
                onChange={(e) => setPlz(e.target.value)}
                placeholder="z.B. 42103"
                className="w-full px-3.5 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-white bg-dark-800 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Right Comparison Box */}
        <div className="lg:col-span-5 bg-dark-900 rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-slate-400">Berechneter Richtwert</span>
              <span className="text-[11px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Kein Aufgraben nötig
              </span>
            </div>

            <div className="mt-4">
              <div className="text-xs font-mono text-slate-400">Geschätzte Injektionskosten:</div>
              <div className="text-3xl font-mono font-extrabold text-white mt-1">
                ca. {estimatedInjectionCost.toLocaleString("de-DE")} €*
              </div>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                inkl. Fachmaterial, Bohrlochkette & WTA-Injektion
              </p>
            </div>

            {/* Savings Comparison Card */}
            <div className="mt-5 p-4 rounded-xl bg-dark-800 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Kosten Außenaufgrabung:</span>
                <span className="text-slate-500 line-through font-mono">ca. {estimatedExcavationCost.toLocaleString("de-DE")} €</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" />
                  Ihre geschätzte Ersparnis:
                </span>
                <span className="text-sm font-mono">ca. {savings.toLocaleString("de-DE")} € (ca. 60%)</span>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>10 Jahre Garantie auf die chemische Horizontalsperre</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Kostenlose Vor-Ort-Feuchtigkeitsmessung in {plz || "42xxx"}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <a
              href="#kontakt"
              className="w-full py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-950 text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-glow-cyan-sm transition-all active:scale-[0.98]"
            >
              <span>Verbindliches Festpreisangebot anfragen</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-[10px] text-center text-slate-500 mt-2">
              *Richtwert ohne Gewähr. Das finale Angebot erfolgt nach der exakten Baustoffprüfung vor Ort.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
