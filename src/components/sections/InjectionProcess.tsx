"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PROCESS_PIPELINE } from "@/data/content-data";

// Dynamically import 3D component with SSR disabled to guarantee no WebGL/window SSR mismatches
const WallInjection3D = dynamic(() => import("@/components/3d/WallInjection3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-sand-100 rounded-3xl animate-pulse flex items-center justify-center text-sand-400 text-xs">
      3D-Simulationsmodell wird geladen...
    </div>
  )
});

export default function InjectionProcess() {
  const [pipelineStep, setPipelineStep] = useState(0);

  // Auto-progress process pipeline indicator (like ACCA's AI pipeline)
  useEffect(() => {
    const timer = setInterval(() => {
      setPipelineStep((prev) => (prev + 1) % (PROCESS_PIPELINE.length + 1));
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="3d-injektion" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-hydro-100 text-hydro-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-hydro-600" />
            Interaktive Technologie-Demonstration
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sand-900 tracking-tight">
            Wie chemische Injektion nasses Mauerwerk stoppt
          </h2>
          <p className="mt-3 text-sm sm:text-base text-sand-600 max-w-2xl mx-auto">
            Statt tonnenweise Erde im Vorgarten aufzugraben, injizieren wir eine hydrophobierende Silan-Mikroemulsion direkt in die Poren des Mauerwerks. Erleben Sie den Wirkungsablauf im 3D-Modell:
          </p>
        </div>

        {/* 3D Visualizer Mount */}
        <div className="mb-16">
          <WallInjection3D />
        </div>

        {/* 4-Step Process Pipeline (Matching ACCA's AI pipeline visual) */}
        <div id="ablauf" className="pt-8">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-sand-900">
              Der 4-Schritte Sanierungsablauf mit gutem Ende
            </h3>
            <p className="text-xs sm:text-sm text-sand-500 mt-1">
              Transparent, sauber und ohne böse Überraschungen bei den Kosten
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_PIPELINE.map((p, i) => (
              <div
                key={p.step}
                className={`p-6 rounded-2xl border transition-all ${
                  i === pipelineStep
                    ? "bg-white border-accent-400 shadow-md ring-2 ring-accent-200/60 scale-[1.02]"
                    : "bg-sand-50/70 border-sand-200 hover:bg-white hover:border-sand-300"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-sand-200/70 text-sand-700">
                    {p.time}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-accent-700 uppercase tracking-wider">
                  Schritt {p.step}
                </div>
                <h4 className="text-base font-bold text-sand-900 mt-1">
                  {p.title}
                </h4>
                <p className="text-xs text-sand-600 mt-2 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Call to action below pipeline */}
          <div className="mt-10 text-center">
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 rounded-xl shadow-soft hover:shadow-glow-accent transition-all active:scale-[0.97]"
            >
              <span>Jetzt kostenlose Vor-Ort-Diagnose anfordern</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
