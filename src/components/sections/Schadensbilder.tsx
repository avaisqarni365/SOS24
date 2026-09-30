"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function Schadensbilder() {
  const cards = [
    {
      n: "01",
      eyebrow: "Mauerwerk & Sockel",
      title: "Horizontalsperre ohne Aufgraben",
      desc: "Drucklose Injektion mit WTA-zertifizierter Silan-Mikroemulsion. Das Mauerwerk wird porentief durchdrungen, bildet eine dauerhafte wasserabweisende Barriere und stoppt aufsteigende Feuchte zu 100%.",
      badge: "Kein Bagger nötig",
      href: "#3d-injektion",
      linkText: "3D-Verfahren ansehen"
    },
    {
      n: "02",
      eyebrow: "Keller & Sohle",
      title: "Kellerinnenabdichtung & Hohlkehle",
      desc: "Mineralische Dichtungsschlämmen (MDS), druckwasserdichte Wand-Sohlen-Anschlüsse und hochbelastbare Sanierputzsysteme sichern Keller auch bei drückendem Hangwasser im Bergischen Land ab.",
      badge: "100% Wasserdicht",
      href: "#kontakt",
      linkText: "Messung anfragen"
    },
    {
      n: "03",
      eyebrow: "Gesundheit & Raumklima",
      title: "Schimmelsanierung & Ursachenanalyse",
      desc: "Keine giftigen Chlorbomben: Wir ermitteln die genaue Feuchte- und Taupunktursache, entfernen Schimmelbefall sporensicher und verhindern Neubildung durch diffusionsoffene Calciumsilikat-Dämmung.",
      badge: "Messtechnisch belegt",
      href: "#kontakt",
      linkText: "Ursache klären"
    }
  ];

  return (
    <section id="leistungen" className="relative bg-landing-bone text-[#1A1D1B]">
      <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-32">
        {/* Section Eyebrow - Kontai24 Style */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-5 text-landing-emerald">
          Fachleistungen
        </p>

        {/* Section Heading */}
        <h2 className="font-editorial font-normal tracking-[-0.02em] leading-[1.04] text-[2.25rem] sm:text-5xl lg:text-[3.5rem] text-[#1A1D1B]">
          Das ganze Gebäude.
          <br />
          <span className="italic text-landing-mint">Eine dauerhafte Lösung.</span>
        </h2>

        {/* Section Lede */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#444945]">
          Die meisten Sanierungsversuche scheitern an oberflächlichen Spachtelarbeiten oder falscher Farbe. 
          sos-abdichtung packt das physikalische Feuchteproblem an der Wurzel — messtechnisch erfasst, nach WTA-Norm saniert und mit 10 Jahren Garantie abgesichert.
        </p>

        {/* Kontai24 3-Card Platform Grid */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.n}
              className="rounded-2xl p-7 border bg-white/60 border-black/5 hover:bg-white/80 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Emerald Dot Icon + Monospace Number */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-landing-emerald/10">
                    <span className="w-2 h-2 rounded-full bg-landing-emerald" />
                  </div>
                  <span className="font-mono text-xs text-black/25 font-bold">{c.n}</span>
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-2 text-landing-emerald/80 font-mono">
                  {c.eyebrow}
                </p>
                <h3 className="font-editorial text-xl mb-3 text-[#1A1D1B] leading-snug">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#444945]">{c.desc}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-black/5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-landing-emerald font-semibold">
                  {c.badge}
                </span>
                <a
                  href={c.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1D1B] hover:text-landing-emerald transition-colors"
                >
                  <span>{c.linkText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
