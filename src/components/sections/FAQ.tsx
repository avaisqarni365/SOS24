"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, PhoneCall } from "lucide-react";
import { FAQS, COMPANY_INFO } from "@/data/content-data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-[#0b0e14] border-t border-white/[0.08]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">
            Häufige Fragen & Antworten
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-[1.15]">
            Wissenswertes zur Kellersanierung.
            <br />
            <span className="text-slate-400">Präzise Antworten.</span>
          </h2>
          <p className="mt-4 text-sm text-slate-400">
            Kompakte Antworten auf die wichtigsten Fragen rund um feuchte Wände, Kosten und Horizontalsperren im Raum Wuppertal.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/[0.08] overflow-hidden transition-all bg-white/[0.02] hover:border-white/[0.14]"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-white text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-cyan-400 border-cyan-400/40" : "text-slate-400"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.06] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Callout */}
        <div className="mt-12 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-white">Haben Sie eine spezielle Frage zu Ihrem Gebäude?</h4>
            <p className="text-xs text-slate-400 mt-0.5">Herr Mahmood berät Sie gerne persönlich und unverbindlich.</p>
          </div>
          <a
            href={`tel:${COMPANY_INFO.phoneTel}`}
            className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#0b0e14] text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Jetzt anrufen</span>
          </a>
        </div>
      </div>
    </section>
  );
}
