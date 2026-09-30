"use client";

import React from "react";
import Link from "next/link";
import { Shield, Droplets, CheckCircle, ArrowRight, Phone, Sparkles, MapPin } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Background Gradient matching ACCA */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-50/70 via-white to-hydro-50/60 pointer-events-none" />

      {/* Decorative Blur Circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-accent-200/20 to-hydro-200/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy (Left) */}
          <div className="lg:col-span-7">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-accent-100/80 border border-accent-200/80 rounded-full text-xs font-bold text-accent-800 mb-6 shadow-soft">
              <span className="w-2 h-2 rounded-full bg-accent-600 animate-pulse"></span>
              <span>SchimmelPeter® Fachbetrieb für Raum Wuppertal (PLZ 42)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-sand-900 tracking-tight leading-[1.15]">
              Nasse Keller & feuchte Wände{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 via-accent-700 to-hydro-700">
                dauerhaft trockenlegen.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-base sm:text-lg text-sand-600 leading-relaxed max-w-2xl">
              Feuchtigkeit im Keller oder Schimmelbefall in Wuppertal, Solingen, Remscheid oder Velbert? 
              Als zertifizierter Partner von SchimmelPeter® bieten wir moderne 
              <strong className="text-sand-900 font-semibold"> chemische Horizontalsperren im Injektionsverfahren</strong>, 
              Innenabdichtungen und Ursachenanalysen — 100% sauber von innen, ohne teures Aufgraben Ihres Gartens.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3.5 sm:gap-4 items-center">
              <a
                href="#kontakt"
                className="px-7 py-3.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 rounded-xl shadow-lg shadow-accent-500/25 transition-all active:scale-[0.97] flex items-center gap-2"
              >
                <span>Kostenlose Vor-Ort-Analyse buchen</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#3d-injektion"
                className="px-6 py-3.5 text-xs sm:text-sm font-bold text-sand-800 bg-white border border-sand-300 rounded-xl hover:bg-sand-50 hover:border-sand-400 transition-all flex items-center gap-2"
              >
                <span>3D-Verfahren ansehen</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-hydro-100 text-hydro-700 font-extrabold">LIVE</span>
              </a>
            </div>

            {/* Trust Proof Badges (Like ACCA's GoBD / DSGVO bar) */}
            <div className="mt-10 pt-8 border-t border-sand-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-sand-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-sand-800">10 Jahre Garantie</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-sand-800">WTA-Zertifiziert</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-sand-800">Ohne Aufgraben</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-sand-800">Festpreis-Angebot</span>
              </div>
            </div>
          </div>

          {/* Hero Visual: 3 Problem Paths (Matching ACCA's 3 user paths) */}
          <div className="lg:col-span-5 space-y-3.5">
            {[
              {
                icon: "🧱",
                title: "Feuchte Kellerwände & Mauerwerk",
                sub: "Aufsteigende Bodenfeuchte im Injektionsverfahren stoppen",
                badge: "Kein Aufgraben",
                color: "from-accent-500 to-amber-600",
                link: "#3d-injektion"
              },
              {
                icon: "🏠",
                title: "Nasser Keller & drückendes Wasser",
                sub: "Mineralische Innenabdichtung & Hohlkehlenausbildung",
                badge: "Komplett trocken",
                color: "from-hydro-500 to-blue-700",
                link: "#leistungen"
              },
              {
                icon: "🛡️",
                title: "Schimmelbefall & Sporenmessung",
                sub: "Ursachenanalyse, Taupunktprüfung & dauerhafte Beseitigung",
                badge: "Gesundheits-Check",
                color: "from-emerald-500 to-teal-700",
                link: "#kontakt"
              }
            ].map((p, idx) => (
              <a
                key={idx}
                href={p.link}
                className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-sand-200 shadow-soft hover:shadow-elevated hover:border-sand-300 transition-all block"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-105 transition-transform shrink-0`}
                >
                  {p.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-sand-900 group-hover:text-accent-700 transition-colors truncate">
                      {p.title}
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sand-100 text-sand-600 shrink-0">
                      {p.badge}
                    </span>
                  </div>
                  <p className="text-xs text-sand-500 mt-1 leading-relaxed line-clamp-1">
                    {p.sub}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-sand-300 group-hover:text-accent-600 group-hover:translate-x-1 transition-all shrink-0" />
              </a>
            ))}

            {/* Direct Local Contact Card */}
            <div className="p-4 rounded-2xl bg-sand-100/80 border border-sand-200/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-sand-200 flex items-center justify-center text-accent-700 font-bold">
                  SM
                </div>
                <div>
                  <div className="text-xs font-bold text-sand-900">Shahzad Mahmood (Inhaber)</div>
                  <div className="text-[11px] text-sand-500">Persönlicher Ansprechpartner vor Ort</div>
                </div>
              </div>
              <a
                href={`tel:${COMPANY_INFO.phoneTel}`}
                className="px-3 py-1.5 rounded-lg bg-accent-600 text-white text-xs font-bold hover:bg-accent-700 transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3 h-3" />
                <span>Anrufen</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
