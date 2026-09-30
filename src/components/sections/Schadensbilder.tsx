"use client";

import React, { useState } from "react";
import { Check, ArrowRight, ShieldCheck, Layers, DropletOff } from "lucide-react";
import { SERVICES } from "@/data/content-data";

export default function Schadensbilder() {
  const [activeTab, setActiveTab] = useState(0);

  const current = SERVICES[activeTab];

  return (
    <section id="leistungen" className="py-20 bg-sand-50/60 border-t border-b border-sand-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-xs font-bold mb-3">
            <Layers className="w-3.5 h-3.5" />
            Zertifizierte Fachverfahren
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sand-900 tracking-tight">
            Gezielte Sanierungslösungen statt halber Sachen
          </h2>
          <p className="mt-3 text-sm sm:text-base text-sand-600 max-w-2xl mx-auto">
            Jedes Feuchtigkeitsproblem hat eine eindeutige physikalische Ursache. Als SchimmelPeter® Partnerbetrieb wenden wir ausschließlich geprüfte, WTA-zertifizierte Spezialprodukte an.
          </p>
        </div>

        {/* Scrolling Service Chips (Matching ACCA's Industry Chips) */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-thin mb-8 justify-start sm:justify-center">
          {SERVICES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(idx)}
              className={`shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === idx
                  ? "bg-accent-600 text-white shadow-lg shadow-accent-500/25 scale-[1.03]"
                  : "bg-white text-sand-700 border border-sand-200 hover:border-accent-300 shadow-soft"
              }`}
            >
              <span className="text-lg">{s.icon}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Active Service Card */}
        <div className="bg-white rounded-3xl border border-sand-200 shadow-soft overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-3xl shadow-soft">
                    {current.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-accent-700 uppercase tracking-wider">
                      {current.badge}
                    </span>
                    <h3 className="text-2xl font-bold text-sand-900 mt-0.5">
                      {current.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-sand-600 leading-relaxed mb-6">
                  {current.shortDesc}
                </p>

                {/* Features Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {current.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-sand-800">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 text-emerald-700" />
                      </div>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Action Buttons */}
              <div className="pt-6 border-t border-sand-100 flex flex-wrap items-center gap-3">
                <a
                  href="#kontakt"
                  className="px-6 py-3 text-xs font-bold text-white bg-accent-600 hover:bg-accent-700 rounded-xl shadow-soft transition-all"
                >
                  Unverbindlich für Ihr Haus anfragen &rarr;
                </a>
                {current.id === "feuchte-waende" && (
                  <a
                    href="#3d-injektion"
                    className="px-5 py-3 text-xs font-bold text-sand-700 bg-sand-50 hover:bg-sand-100 border border-sand-200 rounded-xl transition-all"
                  >
                    3D-Injektionsverfahren testen
                  </a>
                )}
              </div>
            </div>

            {/* Right Visual Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-sand-50 to-accent-50/50 p-8 sm:p-10 border-t lg:border-t-0 lg:border-l border-sand-200 flex flex-col justify-center items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-soft border border-sand-200 flex items-center justify-center text-5xl mb-6">
                {current.icon}
              </div>

              <div className="space-y-3 max-w-xs">
                <div className="p-3.5 rounded-2xl bg-white/90 border border-sand-200/80 shadow-soft">
                  <div className="text-xl font-black text-sand-900">100% Sperrwirkung</div>
                  <div className="text-[11px] text-sand-500">Geprüft nach WTA-Merkblatt 4-4-04</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 border border-sand-200/80 shadow-soft">
                  <div className="text-xl font-black text-emerald-600">10 Jahre Garantie</div>
                  <div className="text-[11px] text-sand-500">Auf die chemische Horizontalsperre</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 border border-sand-200/80 shadow-soft">
                  <div className="text-xl font-black text-hydro-700">Kein Aufgraben</div>
                  <div className="text-[11px] text-sand-500">Schonende Ausführung von der Innenseite</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
