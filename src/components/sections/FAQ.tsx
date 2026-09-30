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
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sand-100 text-sand-800 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-accent-700" />
            Häufige Fragen & Antworten
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sand-900 tracking-tight">
            Wissenswertes zur Kellersanierung in Wuppertal
          </h2>
          <p className="mt-3 text-sm text-sand-600">
            Kompakte Antworten auf die wichtigsten Fragen rund um feuchte Wände, Kosten und Horizontalsperren.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-sand-200 overflow-hidden transition-all bg-sand-50/50 hover:bg-sand-50"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sand-900 text-sm sm:text-base"
                >
                  <span>{faq.q}</span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-white border border-sand-200 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-accent-50 text-accent-700" : "text-sand-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-xs sm:text-sm text-sand-600 leading-relaxed border-t border-sand-200/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Further questions callout */}
        <div className="mt-10 p-6 rounded-2xl bg-sand-100/70 border border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-sm font-bold text-sand-900">Haben Sie eine spezielle Frage zu Ihrem Gebäude?</h4>
            <p className="text-xs text-sand-600 mt-0.5">Herr Mahmood berät Sie gerne persönlich und unverbindlich.</p>
          </div>
          <a
            href={`tel:${COMPANY_INFO.phoneTel}`}
            className="px-5 py-2.5 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold transition-all shadow-soft shrink-0 flex items-center gap-1.5"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Jetzt anrufen</span>
          </a>
        </div>
      </div>
    </section>
  );
}
