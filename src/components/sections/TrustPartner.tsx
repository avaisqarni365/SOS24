"use client";

import React from "react";
import { ShieldCheck, Award, FileCheck, Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export default function TrustPartner() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-sand-50 rounded-3xl border border-sand-200 p-8 sm:p-12 overflow-hidden shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Partner Info Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-100 text-accent-800 text-xs font-bold mb-4">
                <Award className="w-3.5 h-3.5 text-accent-700" />
                Offizieller Fachpartner
              </div>

              <h2 className="text-3xl font-extrabold text-sand-900 tracking-tight">
                sos-abdichtung — Ihr zertifizierter SchimmelPeter® Partnerbetrieb
              </h2>

              <p className="mt-4 text-sm text-sand-600 leading-relaxed">
                Als eigenständiger Fachbetrieb im deutschlandweiten Qualitätsverbund von 
                <strong className="text-sand-900 font-semibold"> SchimmelPeter® </strong> 
                bieten wir Ihnen höchste handwerkliche Standards bei der Bautrocknung, 
                Feuchtigkeitsbeseitigung und Kellersanierung. Geleitet von 
                Inhaber <strong className="text-sand-900 font-semibold">Shahzad Mahmood</strong>, steht sos-abdichtung 
                für transparente Festpreise, saubere Arbeitsweisen und dauerhaften Bautenschutz mit bis zu 10 Jahren Garantie.
              </p>

              {/* Certification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {COMPANY_INFO.certifications.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-sand-200 shadow-soft">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-sand-900">{c.label}</div>
                      <div className="text-[11px] text-sand-500 mt-0.5">{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Contact & Partner Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-sand-200 p-6 sm:p-8 shadow-elevated">
                <div className="flex items-center gap-3.5 pb-5 border-b border-sand-100">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-600 to-accent-700 text-white font-extrabold flex items-center justify-center text-xl shadow-soft">
                    SOS
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-sand-900">sos-abdichtung</h3>
                    <p className="text-xs text-sand-500">SchimmelPeter® Partnerbetrieb</p>
                    <p className="text-xs font-semibold text-accent-700 mt-0.5">Shahzad Mahmood, Inhaber</p>
                  </div>
                </div>

                <div className="py-5 space-y-3.5 text-xs text-sand-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-sand-400 shrink-0 mt-0.5" />
                    <div>
                      <div>{COMPANY_INFO.street}</div>
                      <div>{COMPANY_INFO.city}</div>
                      <div className="text-[11px] text-accent-700 font-medium mt-0.5">
                        Einsatzgebiet: Wuppertal, Solingen, Remscheid, Velbert (PLZ 42)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-accent-600 shrink-0" />
                    <a href={`tel:${COMPANY_INFO.phoneTel}`} className="font-bold text-sand-900 hover:text-accent-700 transition-colors">
                      {COMPANY_INFO.phoneDisplay}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-accent-600 shrink-0" />
                    <a href={`mailto:${COMPANY_INFO.email}`} className="text-sand-700 hover:text-accent-700 transition-colors truncate">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-sand-100">
                  <a
                    href={`tel:${COMPANY_INFO.phoneTel}`}
                    className="w-full py-3 rounded-xl bg-accent-600 hover:bg-accent-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-soft transition-all"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Herrn Mahmood direkt anrufen</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
