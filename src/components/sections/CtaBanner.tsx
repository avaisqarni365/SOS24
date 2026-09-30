"use client";

import React from "react";
import AmbientGlow from "@/components/ui/AmbientGlow";
import { MessageSquare, PhoneCall } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export default function CtaBanner() {
  return (
    <section id="start" className="relative bg-landing-ink text-landing-bone overflow-hidden py-24 sm:py-32">
      <AmbientGlow />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-landing-mint mb-5 font-mono">
          Sofort-Diagnose Vor Ort
        </p>

        <h2 className="font-editorial font-normal tracking-[-0.02em] leading-[1.05] text-[2.25rem] sm:text-5xl lg:text-[3.5rem] text-landing-bone">
          Feuchte Wände im Gebäude?
          <br />
          <span className="italic text-landing-mint">Handeln Sie, bevor Bausubstanz leidet.</span>
        </h2>

        <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-landing-bone/70 leading-relaxed">
          Eine kostenlose Vor-Ort-Feuchtemessung durch Herrn Mahmood bringt sofortige Klarheit. 
          100% sauber von der Innenseite, ohne Baggerarbeiten und mit 10 Jahren Systemgarantie.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-all active:scale-[0.98] bg-landing-bone text-[#0E1310] hover:bg-white shadow-sm"
          >
            <span>Kostenlosen Termin anfragen</span>
            <span aria-hidden="true">→</span>
          </a>

          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-xs font-mono font-medium text-landing-bone hover:text-landing-mint border border-white/15 hover:border-landing-mint/50 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-landing-mint" />
            <span>Direkt per WhatsApp schreiben</span>
          </a>
        </div>

        <p className="mt-8 text-xs font-mono text-landing-bone/40">
          Reaktionszeit in der Regel innerhalb von 2 Stunden · Raum Wuppertal & Bergisches Land
        </p>
      </div>
    </section>
  );
}
