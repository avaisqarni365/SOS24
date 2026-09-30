"use client";

import React from "react";
import { ArrowRight, Check, ArrowUpRight } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 bg-[#0b0e14]">
      {/* Background Subtle Gradient & Grid - Matching Kontai24 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12),transparent_55%)] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.12] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Kontai24-style Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] text-xs font-mono text-slate-300 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>WTA-Zertifiziert · SchimmelPeter® Partnerbetrieb Wuppertal (PLZ 42)</span>
        </div>

        {/* Headline - Exact rhythm of Kontai24 ("Booked. Reconciled. Filed. / Correctly.") */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08]">
          Gedichtet. Injiziert. Getrocknet.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
            Dauerhaft.
          </span>
        </h1>

        {/* Lede Text */}
        <p className="mt-8 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
          sos-abdichtung stoppt aufsteigende Feuchtigkeit, saniert nasse Kellerwände und beseitigt Schimmel im Raum Wuppertal und Bergisches Land. 
          Das WTA-Injektionsverfahren verdrängt Wasser auf molekularer Ebene — 100% sauber von der Innenseite, ohne Baggerarbeiten und mit 10 Jahren Garantie.
        </p>

        {/* Minimalist CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#kontakt"
            className="px-7 py-3.5 text-xs sm:text-sm font-semibold text-[#0b0e14] bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-[0_0_25px_rgba(34,211,238,0.25)] flex items-center gap-2"
          >
            <span>Kostenlose Vor-Ort-Analyse anfragen</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="#3d-injektion"
            className="px-6 py-3.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] rounded-xl transition-all flex items-center gap-1.5"
          >
            <span>3D-Injektionsverfahren ansehen</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>

        {/* Trust Strip - Exact match to Kontai24's "GoBD · DATEV · ELSTER · SKR03/SKR04 · Hosted in Germany" */}
        <div className="mt-14 pt-8 border-t border-white/[0.08] text-[11px] font-mono text-slate-400 tracking-wider">
          WTA-MERKBLATT 4-4-04 &nbsp;·&nbsp; 10 JAHRE SYSTEM-GARANTIE &nbsp;·&nbsp; TÜV-GEPRÜFTE BAUSTOFFE &nbsp;·&nbsp; 100% OHNE AUFGRABEN &nbsp;·&nbsp; RAUM WUPPERTAL (PLZ 42)
        </div>

        {/* 3 Stats Strip - Exact match to Kontai24 stats */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <div className="text-2xl font-bold font-mono text-white">10 Jahre</div>
            <div className="text-xs text-slate-400 mt-1">Garantie auf chemische Horizontalsperren</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <div className="text-2xl font-bold font-mono text-cyan-400">&lt; 6% Feuchte</div>
            <div className="text-xs text-slate-400 mt-1">Geprüfte Restfeuchte nach Bautrocknung</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <div className="text-2xl font-bold font-mono text-white">24–48 Std.</div>
            <div className="text-xs text-slate-400 mt-1">Vor-Ort-Diagnose in Wuppertal, Solingen, Remscheid</div>
          </div>
        </div>
      </div>
    </section>
  );
}
