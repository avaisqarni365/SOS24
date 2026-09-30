"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PROCESS_PIPELINE } from "@/data/content-data";

const WallInjection3D = dynamic(() => import("@/components/3d/WallInjection3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] bg-white/[0.02] border border-white/[0.08] rounded-3xl animate-pulse flex items-center justify-center text-slate-500 font-mono text-xs">
      3D-Simulationsmodell wird initialisiert...
    </div>
  )
});

export default function InjectionProcess() {
  return (
    <section id="3d-injektion" className="py-24 bg-[#0b0e14] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header - Kontai24 Rhythm */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
            Das Verfahren
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Ein Bohrloch.
            <br />
            <span className="text-slate-400">Molekulare Sperrschicht.</span>
          </h2>
          <p className="mt-6 text-base text-slate-400 leading-relaxed">
            Dies ist der tatsächliche physikalische Weg im Mauerwerk — keine bloße Illustration. 
            Jedes Bohrloch wird im 60°-Winkel gesetzt und drucklos mit hochviskoser Silan-Mikroemulsion geflutet. 
            Die Wirkstoffmoleküle durchwandern das Kapillarnetzwerk, verdrängen Feuchtigkeit und härten zu einer dauerhaft wasserabweisenden Sperre aus.
          </p>
        </div>

        {/* 3D Visualizer Model Mount */}
        <div className="mb-20">
          <WallInjection3D />
        </div>

        {/* 4 Steps - Kontai24 Step Cards */}
        <div className="border-t border-white/[0.08] pt-16">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">
            Der Sanierungsablauf
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-10">
            Von der Erstbesichtigung zur trockenen Wand in 4 Schritten.
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_PIPELINE.map((p) => (
              <div
                key={p.step}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.16] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      Phase {p.step}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {p.time}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 px-7 py-3.5 text-xs sm:text-sm font-semibold text-[#0b0e14] bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
            >
              <span>Kostenlose Vor-Ort-Diagnose buchen</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
