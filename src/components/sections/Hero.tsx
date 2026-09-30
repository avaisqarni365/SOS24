"use client";

import React from "react";
import AmbientGlow from "@/components/ui/AmbientGlow";
import WireframeOrb from "@/components/ui/WireframeOrb";
import { COMPANY_INFO } from "@/data/content-data";

export default function Hero() {
  const stats = [
    { value: "42", label: "PLZ-Region Wuppertal · Solingen · Remscheid" },
    { value: "100%", label: "Drucklose Silan-Mikroemulsion nach WTA" },
    { value: "10 J.", label: "Gewährleistung auf Mauerwerksdichtigkeit" },
    { value: "24h", label: "Reaktionszeit für Vor-Ort-Feuchtemessung" }
  ];

  return (
    <section id="top" className="relative bg-landing-ink overflow-hidden">
      {/* Kontai24 Ambient Glow & 3D Mathematical Canvas Orb */}
      <AmbientGlow />
      <WireframeOrb offsetY="-16%" />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-12 sm:pt-32 sm:pb-16 text-center">
        {/* Eyebrow - Kontai24 Signature Tagline */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-landing-mint mb-7">
          Kellersanierung & Horizontalsperren Wuppertal
        </p>

        {/* Headline - Exact Editorial Serif & Luminous Mint Accent */}
        <h1 className="mx-auto max-w-3xl font-editorial font-normal tracking-[-0.025em] leading-[1.05] text-landing-bone text-[2.15rem] sm:text-5xl lg:text-[3.4rem]">
          Gedichtet. Injiziert. Getrocknet.
          <br />
          <span className="italic text-landing-mint">Dauerhaft.</span>
        </h1>

        {/* Lede Text */}
        <p className="mt-8 mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-landing-bone/70">
          sos-abdichtung stoppt aufsteigende Feuchtigkeit, saniert nasse Kellerwände und beseitigt Schimmel im Raum Wuppertal und Bergisches Land. 
          Das WTA-Injektionsverfahren verdrängt Wasser auf molekularer Ebene — sauber von der Innenseite, ohne Baggerarbeiten und mit 10 Jahren Garantie.
        </p>

        {/* Buttons - Pill Shape Hierarchy from Kontai24 */}
        <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all active:scale-[0.98] bg-landing-bone text-[#0E1310] hover:bg-white shadow-sm"
          >
            <span>Kostenlose Vor-Ort-Analyse anfragen</span>
            <span aria-hidden="true">→</span>
          </a>

          <a
            href="#3d-injektion"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all active:scale-[0.98] text-landing-bone hover:text-landing-mint"
          >
            <span>3D-Injektionsmodell ansehen</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        {/* Trust Strip */}
        <p className="mt-10 text-xs text-landing-bone/70 font-mono tracking-wider">
          WTA-MERKBLATT 4-4-04 · TÜV-GEPRÜFTE BAUSTOFFE · 10 JAHRE GARANTIE · OHNE AUFGRABEN · PLZ 42
        </p>
      </div>

      {/* Kontai24 4-Column Border-Divided Stat Grid */}
      <div className="relative border-t border-white/[0.07] bg-landing-ink">
        <div className="max-w-6xl mx-auto px-6">
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s, idx) => (
              <div
                key={s.label}
                className={[
                  "py-8 sm:py-10 px-4 sm:px-6 text-center",
                  idx % 2 === 0 ? "border-r border-white/[0.07]" : "",
                  idx < 2 ? "border-b border-white/[0.07] lg:border-b-0" : "",
                  "lg:border-b-0",
                  idx === 3 ? "lg:border-r-0" : "lg:border-r",
                  "lg:border-white/[0.07]"
                ].join(" ")}
              >
                <dd className="font-editorial font-normal text-landing-bone text-[2rem] sm:text-[2.5rem] leading-none tracking-[-0.01em]">
                  {s.value}
                </dd>
                <dt className="mt-3 hyphens-auto break-words text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-landing-bone/45 leading-snug font-mono">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
