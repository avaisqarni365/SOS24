"use client";

import React from "react";
import Link from "next/link";
import { COMPANY_INFO } from "@/data/content-data";

export default function Footer() {
  return (
    <footer className="bg-[#0b0e14] text-slate-400 py-16 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.15] flex items-center justify-center text-white font-mono font-bold text-xs">
                SOS
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                sos-abdichtung
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Zertifizierter SchimmelPeter® Partnerbetrieb für Kellersanierung, chemische Horizontalsperren und Schimmelbeseitigung im Raum Wuppertal und Bergisches Land (PLZ 42xxx).
            </p>
            <p className="text-[11px] font-mono text-slate-500">
              WTA-zertifiziert · 10 Jahre Systemgarantie · Ohne Aufgraben
            </p>
          </div>

          {/* Links Col */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-4">
              Leistungen
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#leistungen" className="hover:text-white transition-colors">Horizontalsperre</a></li>
              <li><a href="#3d-injektion" className="hover:text-white transition-colors">3D-Injektionsverfahren</a></li>
              <li><a href="#leistungen" className="hover:text-white transition-colors">Kellerinnenabdichtung</a></li>
              <li><a href="#leistungen" className="hover:text-white transition-colors">Schimmelbeseitigung</a></li>
              <li><a href="#servicegebiet" className="hover:text-white transition-colors">Servicegebiet PLZ 42</a></li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-white mb-4">
              Rechtliches
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><Link href="/impressum" className="hover:text-white transition-colors">Impressum (§ 5 TMG)</Link></li>
              <li><Link href="/datenschutz" className="hover:text-white transition-colors">Datenschutzerklärung (DSGVO)</Link></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Häufige Fragen (FAQ)</a></li>
              <li><a href={`tel:${COMPANY_INFO.phoneTel}`} className="hover:text-white transition-colors">Telefonische Beratung</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© 2026 {COMPANY_INFO.fullName}. Alle Rechte vorbehalten.</p>
          <p>Made with precision for Wuppertal & Bergisches Land</p>
        </div>
      </div>
    </footer>
  );
}
