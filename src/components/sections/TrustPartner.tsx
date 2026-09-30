"use client";

import React from "react";
import { ShieldCheck, Award, FileCheck, Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export default function TrustPartner() {
  return (
    <section className="py-20 bg-dark-900 border-t border-line/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-dark-850 rounded-3xl border border-line/10 p-8 sm:p-12 overflow-hidden shadow-card-dark">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Partner Info Column */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-800 text-cyan-400 text-xs font-mono font-bold mb-4 border border-cyan-500/30">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                Offizieller Fachpartner
              </div>

              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                sos-abdichtung — Ihr zertifizierter SchimmelPeter® Partnerbetrieb
              </h2>

              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Als eigenständiger Fachbetrieb im deutschlandweiten Qualitätsverbund von 
                <strong className="text-white font-semibold"> SchimmelPeter® </strong> 
                bieten wir Ihnen höchste handwerkliche Standards bei der Bautrocknung, 
                Feuchtigkeitsbeseitigung und Kellersanierung. Geleitet von 
                Inhaber <strong className="text-white font-semibold">Shahzad Mahmood</strong>, steht sos-abdichtung 
                für transparente Festpreise, saubere Arbeitsweisen und dauerhaften Bautenschutz mit bis zu 10 Jahren Garantie.
              </p>

              {/* Certification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {COMPANY_INFO.certifications.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-dark-800 border border-line/10">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{c.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{c.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Contact & Partner Card */}
            <div className="lg:col-span-5">
              <div className="bg-dark-900 rounded-2xl border border-line/10 p-6 sm:p-8 shadow-card-dark">
                <div className="flex items-center gap-3.5 pb-5 border-b border-line/10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-hydro-700 text-dark-950 font-black flex items-center justify-center text-xl shadow-glow-cyan-sm">
                    SOS
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">sos-abdichtung</h3>
                    <p className="text-xs text-slate-400">SchimmelPeter® Partnerbetrieb</p>
                    <p className="text-xs font-mono font-semibold text-cyan-400 mt-0.5">Shahzad Mahmood, Inhaber</p>
                  </div>
                </div>

                <div className="py-5 space-y-3.5 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <div>{COMPANY_INFO.street}</div>
                      <div>{COMPANY_INFO.city}</div>
                      <div className="text-[11px] text-cyan-300 font-mono mt-0.5">
                        Einsatzgebiet: Wuppertal, Solingen, Remscheid, Velbert (PLZ 42)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                    <a href={`tel:${COMPANY_INFO.phoneTel}`} className="font-mono font-bold text-white hover:text-cyan-400 transition-colors">
                      {COMPANY_INFO.phoneDisplay}
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                    <a href={`mailto:${COMPANY_INFO.email}`} className="text-slate-300 hover:text-cyan-400 transition-colors truncate">
                      {COMPANY_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-line/10">
                  <a
                    href={`tel:${COMPANY_INFO.phoneTel}`}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-dark-950 text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-glow-cyan-sm transition-all"
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
