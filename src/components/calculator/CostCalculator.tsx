"use client";

import React, { useState } from "react";
import { Calculator, ShieldCheck, ArrowRight, CheckCircle2, TrendingDown, HelpCircle } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export default function CostCalculator() {
  const [damageType, setDamageType] = useState<"wand" | "keller" | "schimmel">("wand");
  const [meters, setMeters] = useState<number>(10);
  const [wallType, setWallType] = useState<"altbau" | "beton">("altbau");
  const [plz, setPlz] = useState<string>("42103");

  // Calculations for estimation
  const costPerMeterInjection = damageType === "wand" ? 180 : damageType === "keller" ? 260 : 95;
  const multiplier = wallType === "altbau" ? 1.15 : 1.0;

  const estimatedInjectionCost = Math.round(meters * costPerMeterInjection * multiplier);
  const estimatedExcavationCost = Math.round(estimatedInjectionCost * 2.4);
  const savings = estimatedExcavationCost - estimatedInjectionCost;

  return (
    <div className="w-full bg-white rounded-3xl border border-sand-200 shadow-soft overflow-hidden">
      <div className="p-6 sm:p-8 bg-gradient-to-br from-sand-50 via-white to-sand-50 border-b border-sand-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hydro-100 text-hydro-700 text-xs font-semibold mb-2">
              <Calculator className="w-3.5 h-3.5" />
              Kostenvoranschlag-Rechner Raum Wuppertal
            </div>
            <h3 className="text-2xl font-bold text-sand-900">
              Sanierungskosten kalkulieren & bis zu 60% sparen
            </h3>
            <p className="text-sm text-sand-600 mt-1 max-w-2xl">
              Vergleichen Sie das schonende Injektionsverfahren von innen mit einer teuren Außenaufgrabung für Ihr Gebäude in der Region 42xxx.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-sand-500 bg-sand-100/80 px-3.5 py-2 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Unverbindliche Richtwerte nach WTA-Richtlinien</span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Configuration Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Schadensart */}
          <div>
            <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-2.5">
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
                      ? "border-hydro-500 bg-hydro-50/60 ring-2 ring-hydro-200"
                      : "border-sand-200 bg-white hover:border-sand-300"
                  }`}
                >
                  <span className="text-xl mb-1 block">{item.icon}</span>
                  <div className="text-xs font-bold text-sand-900">{item.label}</div>
                  <div className="text-[11px] text-sand-500">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Wandlänge Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-sand-700 uppercase tracking-wider">
                2. Betroffene Wandlänge (ca. Laufmeter):
              </label>
              <span className="text-base font-extrabold text-hydro-700 bg-hydro-50 px-3 py-1 rounded-xl border border-hydro-200">
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
              className="w-full h-2.5 bg-sand-200 rounded-lg appearance-none cursor-pointer accent-hydro-600"
            />
            <div className="flex justify-between text-[11px] text-sand-400 mt-1">
              <span>3 m (Teilwand)</span>
              <span>15 m (Halber Keller)</span>
              <span>35 m (Komplettes Gebäude)</span>
            </div>
          </div>

          {/* Bauart & PLZ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-2">
                3. Bauweise / Mauerwerk
              </label>
              <select
                value={wallType}
                onChange={(e) => setWallType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand-200 text-xs text-sand-800 bg-sand-50 focus:outline-none focus:ring-2 focus:ring-hydro-500"
              >
                <option value="altbau">Wuppertaler Altbau (Ziegel / Bruchstein)</option>
                <option value="beton">Massivbau / Beton / Bimsstein</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-700 uppercase tracking-wider mb-2">
                4. PLZ im Raum Wuppertal
              </label>
              <input
                type="text"
                value={plz}
                maxLength={5}
                onChange={(e) => setPlz(e.target.value)}
                placeholder="z.B. 42103"
                className="w-full px-3.5 py-2.5 rounded-xl border border-sand-200 text-xs text-sand-800 bg-sand-50 focus:outline-none focus:ring-2 focus:ring-hydro-500"
              />
            </div>
          </div>
        </div>

        {/* Results & Comparison Box */}
        <div className="lg:col-span-5 bg-sand-50 rounded-2xl p-6 border border-sand-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <span className="text-xs font-bold text-sand-600">Berechneter Richtwert</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Kein Aufgraben nötig
              </span>
            </div>

            <div className="mt-4">
              <div className="text-xs text-sand-500">Geschätzte Sanierungskosten (Injektion):</div>
              <div className="text-3xl font-extrabold text-sand-900 mt-1">
                ca. {estimatedInjectionCost.toLocaleString("de-DE")} €*
              </div>
              <p className="text-[11px] text-sand-500 mt-0.5">
                inkl. Fachmaterial, Bohrlochkette & WTA-Injektion
              </p>
            </div>

            {/* Savings Comparison Card */}
            <div className="mt-5 p-4 rounded-xl bg-white border border-sand-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-sand-500">Kosten Außenaufgrabung (Garten/Pflaster):</span>
                <span className="text-sand-400 line-through">ca. {estimatedExcavationCost.toLocaleString("de-DE")} €</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 pt-2 border-t border-sand-100">
                <span className="flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4" />
                  Ihre geschätzte Ersparnis:
                </span>
                <span className="text-sm">ca. {savings.toLocaleString("de-DE")} € (ca. 60%)</span>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 text-[11px] text-sand-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>10 Jahre Garantie auf die chemische Horizontalsperre</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Kostenlose Vor-Ort-Feuchtigkeitsmessung in {plz || "42xxx"}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-sand-200">
            <a
              href="#kontakt"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-soft hover:shadow-md transition-all active:scale-[0.98]"
            >
              <span>Verbindliches Festpreisangebot anfragen</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-[10px] text-center text-sand-400 mt-2">
              *Richtwert ohne Gewähr. Das finale Angebot erfolgt nach der exakten Baustoffprüfung vor Ort.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
