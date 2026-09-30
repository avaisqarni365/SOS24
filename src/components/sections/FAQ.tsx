"use client";

import React, { useState } from "react";
import { ChevronDown, PhoneCall } from "lucide-react";
import { FAQS, COMPANY_INFO } from "@/data/content-data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="relative bg-landing-bone text-[#1A1D1B]">
      <div className="relative max-w-4xl mx-auto px-6 py-24 sm:py-32">
        {/* Section Header */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-5 text-landing-emerald font-mono">
          Häufige Fragen & Antworten
        </p>
        <h2 className="font-editorial font-normal tracking-[-0.02em] leading-[1.04] text-[2.25rem] sm:text-5xl lg:text-[3.5rem] text-[#1A1D1B]">
          Wissenswertes zur Kellersanierung.
          <br />
          <span className="italic text-landing-mint">Präzise Antworten.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#444945]">
          Kompakte Antworten auf die wichtigsten Fragen rund um feuchte Kellerwände, Kosten und chemische Horizontalsperren im Raum Wuppertal.
        </p>

        {/* Snow White Accordion Cards */}
        <div className="mt-14 space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-black/5 overflow-hidden transition-all bg-white/70 hover:bg-white shadow-xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-editorial font-normal text-base sm:text-lg text-[#1A1D1B]"
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-8 h-8 rounded-full bg-landing-bone2 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-landing-emerald" : "text-black/40"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-[#444945] leading-relaxed border-t border-black/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Callout in Snow White Bone2 */}
        <div className="mt-14 p-7 rounded-2xl bg-landing-bone2 border border-black/5 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <h4 className="font-editorial text-lg text-[#1A1D1B]">
              Haben Sie eine spezielle Frage zu Ihrem Gebäude?
            </h4>
            <p className="text-xs text-[#444945] mt-1 font-mono">
              Herr Mahmood berät Sie gerne persönlich und unverbindlich.
            </p>
          </div>
          <a
            href={`tel:${COMPANY_INFO.phoneTel}`}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-mono font-semibold bg-[#1A1D1B] hover:bg-black text-landing-bone transition-all shrink-0 active:scale-[0.98] shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5 text-landing-mint" />
            <span>Jetzt anrufen: {COMPANY_INFO.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
