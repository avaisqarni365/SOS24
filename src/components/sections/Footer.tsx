"use client";

import React from "react";
import Link from "next/link";
import { COMPANY_INFO } from "@/data/content-data";

export default function Footer() {
  return (
    <footer className="bg-landing-ink text-landing-bone/60 py-16 border-t border-white/[0.07]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-editorial text-xl tracking-[0.14em] text-landing-bone uppercase font-normal">
                sos-abdichtung<span className="text-landing-mint font-bold">.</span>
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-landing-bone/40">
                Wuppertal
              </span>
            </div>
            <p className="text-xs text-landing-bone/60 max-w-sm leading-relaxed">
              Zertifizierter SchimmelPeter® Partnerbetrieb für Kellersanierung, chemische Horizontalsperren und Schimmelbeseitigung im Raum Wuppertal und Bergisches Land (PLZ 42xxx).
            </p>
            <p className="text-[11px] font-mono text-landing-bone/40">
              WTA-zertifiziert · 10 Jahre Systemgarantie · Ohne Aufgraben · Inhaber: {COMPANY_INFO.owner}
            </p>
          </div>

          {/* Links Col */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-landing-bone mb-4">
              Fachleistungen
            </h4>
            <ul className="space-y-2.5 text-xs text-landing-bone/60">
              <li><a href="#leistungen" className="hover:text-landing-bone transition-colors">Horizontalsperre</a></li>
              <li><a href="#3d-injektion" className="hover:text-landing-bone transition-colors">3D-Injektionsverfahren</a></li>
              <li><a href="#leistungen" className="hover:text-landing-bone transition-colors">Kellerinnenabdichtung</a></li>
              <li><a href="#leistungen" className="hover:text-landing-bone transition-colors">Schimmelbeseitigung</a></li>
              <li><a href="#servicegebiet" className="hover:text-landing-bone transition-colors">Servicegebiet PLZ 42</a></li>
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-landing-bone mb-4">
              Rechtliches
            </h4>
            <ul className="space-y-2.5 text-xs text-landing-bone/60">
              <li><Link href="/impressum" className="hover:text-landing-bone transition-colors">Impressum (§ 5 TMG)</Link></li>
              <li><Link href="/datenschutz" className="hover:text-landing-bone transition-colors">Datenschutzerklärung (DSGVO)</Link></li>
              <li><a href="#faq" className="hover:text-landing-bone transition-colors">Häufige Fragen (FAQ)</a></li>
              <li><a href={`tel:${COMPANY_INFO.phoneTel}`} className="hover:text-landing-bone transition-colors">Telefon: {COMPANY_INFO.phoneDisplay}</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-landing-bone/40">
          <p>© 2026 sos-abdichtung Wuppertal · Alle Rechte vorbehalten.</p>
          <p>SchimmelPeter® Partnerbetrieb für das Bergische Land</p>
        </div>
      </div>
    </footer>
  );
}
