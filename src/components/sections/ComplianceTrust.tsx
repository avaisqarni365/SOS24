"use client";

import React from "react";
import { ShieldCheck, Award, FileCheck2, Clock } from "lucide-react";

export default function ComplianceTrust() {
  const points = [
    {
      icon: ShieldCheck,
      n: "01",
      eyebrow: "WTA-Standard",
      title: "WTA Merkblatt 4-4-04 zertifiziert",
      desc: "Die drucklose Mauerwerksinjektion erfolgt streng nach den Richtlinien der Wissenschaftlich-Technischen Arbeitsgemeinschaft für Bauwerkserhaltung und Denkmalpflege e.V. (WTA)."
    },
    {
      icon: Award,
      n: "02",
      eyebrow: "Garantie",
      title: "10 Jahre Systemgewährleistung",
      desc: "Sie erhalten ein schriftliches Garantiezertifikat auf die Funktion der eingebrachten Horizontalsperre gegen aufsteigende Feuchtigkeit. Keine leeren Versprechungen."
    },
    {
      icon: FileCheck2,
      n: "03",
      eyebrow: "Messtechnik",
      title: "Messprotokoll nach CM-Methode",
      desc: "Vor und nach der Sanierung erfassen wir die Restfeuchte nach DIN EN ISO 12570. Sie sehen schwarz auf weiß, wie die Feuchtigkeitswerte von über 90% auf unter 5% fallen."
    },
    {
      icon: Clock,
      n: "04",
      eyebrow: "SchimmelPeter® Partner",
      title: "Offizieller Netzwerk-Partnerbetrieb",
      desc: "Geführt von Shahzad Mahmood — mit regionaler Verwurzelung im Bergischen Land und dem Know-how des bundesweiten SchimmelPeter® Expertennetzwerks."
    }
  ];

  return (
    <section id="zertifizierung" className="relative bg-landing-bone2 text-[#1A1D1B]">
      <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-32">
        {/* Section Header */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-5 text-landing-emerald font-mono">
          Zertifizierung & Garantie
        </p>
        <h2 className="font-editorial font-normal tracking-[-0.02em] leading-[1.04] text-[2.25rem] sm:text-5xl lg:text-[3.5rem] text-[#1A1D1B]">
          Geprüfte Bauphysik.
          <br />
          <span className="italic text-landing-mint">10 Jahre schriftliche Garantie.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#444945]">
          Bei der Bausubstanz gibt es keinen Raum für Experimente. Jede chemische Injektion wird mit lückenlosem Prüfprotokoll und bauaufsichtlich zugelassenen Wirkstoffen ausgeführt.
        </p>

        {/* 4 Cards in Snow White Bright Grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.n}
                className="rounded-2xl p-7 border bg-white/70 border-black/5 hover:bg-white transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-landing-emerald/10 text-landing-emerald">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-black/25 font-bold">{p.n}</span>
                  </div>

                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-2 text-landing-emerald/80 font-mono">
                    {p.eyebrow}
                  </p>
                  <h3 className="font-editorial text-lg mb-3 text-[#1A1D1B] leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#444945]">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
