"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/data/content-data";

export default function Schadensbilder() {
  return (
    <section id="leistungen" className="py-24 bg-[#0b0e14] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Kontai24 Section Header Pattern */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
            Die Fachleistungen
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Das ganze Gebäude.
            <br />
            <span className="text-slate-400">Eine dauerhafte Lösung.</span>
          </h2>
          <p className="mt-6 text-base text-slate-400 leading-relaxed">
            Die meisten Sanierungsversuche scheitern an falschen Wandfarben oder oberflächlichen Spachtelarbeiten. sos-abdichtung packt das physikalische Problem an der Wurzel — messtechnisch erfasst, nach WTA-Norm saniert und mit 10 Jahren Garantie abgesichert.
          </p>
        </div>

        {/* Kontai24 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-400/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2">
                Mauerwerk & Sockel
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Horizontalsperre ohne Aufgraben
              </h3>
              <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Drucklose Injektion mit WTA-zertifizierter Silan-Mikroemulsion. Das Mauerwerk wird porentief durchdrungen, bildet eine dauerhafte wasserabweisende Barriere und stoppt aufsteigende Feuchte zu 100%.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Kein Bagger nötig</span>
              <a href="#3d-injektion" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300">
                <span>3D-Ablauf</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-400/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2">
                Keller & Sohle
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Kellerinnenabdichtung & Hohlkehle
              </h3>
              <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Mineralische Dichtungsschlämmen (MDS), Wand-Sohlen-Anschlüsse und hochbelastbare Sanierputzsysteme sichern Keller auch bei drückendem Hangwasser im Raum Wuppertal ab.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>100% Wasserdicht</span>
              <a href="#kontakt" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300">
                <span>Anfragen</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-cyan-400/30 transition-all flex flex-col justify-between group">
            <div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2">
                Gesundheit & Raumklima
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                Schimmelsanierung & Ursachenanalyse
              </h3>
              <p className="mt-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
                Keine giftigen Chlorbomben: Wir ermitteln die genaue Feuchte- und Taupunktursache, entfernen Schimmelbefall sporensicher und verhindern Neubildung durch Calciumsilikat-Dämmung.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Messtechnisch geprüft</span>
              <a href="#kontakt" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300">
                <span>Messung buchen</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
