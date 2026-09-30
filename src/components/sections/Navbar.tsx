"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Menu, X } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-landing-ink/85 backdrop-blur-lg border-b border-white/5 transition-colors">
      <div className="max-w-6xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo - 100% Kontai24 Exact Style */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-editorial text-lg sm:text-xl tracking-[0.14em] text-landing-bone uppercase font-normal">
            sos-abdichtung<span className="text-landing-mint font-bold">.</span>
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.16em] text-landing-bone/40 ml-1">
            Wuppertal
          </span>
        </Link>

        {/* Minimalist Nav Links - Only 4 items like Kontai24 */}
        <div className="hidden md:flex items-center gap-8 text-sm text-landing-bone/60">
          <a href="#leistungen" className="hover:text-landing-bone transition-colors">
            Fachleistungen
          </a>
          <a href="#3d-injektion" className="hover:text-landing-bone transition-colors flex items-center gap-1.5">
            <span>3D-Verfahren</span>
            <span className="h-1.5 w-1.5 rounded-full bg-landing-mint"></span>
          </a>
          <a href="#rechner" className="hover:text-landing-bone transition-colors">
            Kostenrechner
          </a>
          <a href="#servicegebiet" className="hover:text-landing-bone transition-colors">
            Servicegebiet PLZ 42
          </a>
        </div>

        {/* Minimalist Right Action - Direct Phone + Clean Button */}
        <div className="flex items-center gap-5">
          <a
            href={`tel:${COMPANY_INFO.phoneTel}`}
            className="hidden sm:inline text-sm text-landing-bone/60 hover:text-landing-bone transition-colors font-mono"
          >
            {COMPANY_INFO.phoneDisplay}
          </a>

          <a
            href="#kontakt"
            className="hidden sm:inline-flex items-center rounded-full bg-landing-bone px-4 py-2 text-[13px] sm:text-sm font-semibold text-[#0E1310] hover:bg-white transition-colors whitespace-nowrap shadow-sm"
          >
            Diagnose anfragen →
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden -mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-landing-bone/70 hover:text-landing-bone hover:bg-white/5 transition-colors"
            aria-label="Menü öffnen"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-landing-ink/95 backdrop-blur-lg px-6 py-4 flex flex-col gap-1 text-sm text-landing-bone/70">
          <a
            href="#leistungen"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2.5 hover:text-landing-bone transition-colors"
          >
            Fachleistungen
          </a>
          <a
            href="#3d-injektion"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2.5 hover:text-landing-bone transition-colors flex items-center justify-between"
          >
            <span>3D-Verfahren</span>
            <span className="text-[10px] font-mono text-landing-mint">WTA</span>
          </a>
          <a
            href="#rechner"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2.5 hover:text-landing-bone transition-colors"
          >
            Kostenrechner
          </a>
          <a
            href="#servicegebiet"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2.5 hover:text-landing-bone transition-colors"
          >
            Servicegebiet PLZ 42
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2.5 hover:text-landing-bone transition-colors"
          >
            Häufige Fragen
          </a>

          <div className="pt-4 border-t border-white/5 flex flex-col gap-2 mt-2">
            <a
              href={`tel:${COMPANY_INFO.phoneTel}`}
              className="py-2.5 text-center text-xs font-mono font-medium text-landing-bone/80 bg-white/5 rounded-full"
            >
              📞 {COMPANY_INFO.phoneDisplay}
            </a>
            <a
              href="#kontakt"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center rounded-full bg-landing-bone px-4 py-3 text-sm font-semibold text-[#0E1310] hover:bg-white transition-colors"
            >
              Kostenlose Vor-Ort-Diagnose
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
