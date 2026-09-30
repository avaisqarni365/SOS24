"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Menu, X, ArrowUpRight } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0e14]/85 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo - Minimalist Kontai24 Style */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-white/[0.08] border border-white/[0.15] flex items-center justify-center text-white font-mono font-bold text-xs tracking-wider group-hover:border-cyan-400/50 transition-colors">
            SOS
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-white tracking-tight">
              SOS-Abdichtung
            </span>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              · SchimmelPeter® Partner
            </span>
          </div>
        </Link>

        {/* Minimalist Desktop Nav Links - Only 4 items like Kontai24 */}
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
          <a href="#leistungen" className="hover:text-white transition-colors">
            Leistungen
          </a>
          <a href="#3d-injektion" className="hover:text-white transition-colors flex items-center gap-1.5">
            <span>3D-Verfahren</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          </a>
          <a href="#servicegebiet" className="hover:text-white transition-colors">
            Servicegebiet PLZ 42
          </a>
          <a href="#rechner" className="hover:text-white transition-colors">
            Kostenrechner
          </a>
        </div>

        {/* Minimalist Right Action - Direct Phone + Clean Button */}
        <div className="flex items-center gap-4">
          <a
            href={`tel:${COMPANY_INFO.phoneTel}`}
            className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" />
            <span>{COMPANY_INFO.phoneDisplay}</span>
          </a>

          <a
            href="#kontakt"
            className="px-4 py-2 text-xs font-medium text-white bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.15] hover:border-cyan-400/40 rounded-lg transition-all flex items-center gap-1"
          >
            <span>Termin anfragen</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white border border-white/10"
            aria-label="Menü öffnen"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b0e14] border-b border-white/[0.08] px-6 py-5 space-y-4">
          <div className="flex flex-col gap-3 text-sm font-medium text-slate-300">
            <a href="#leistungen" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">
              Leistungen
            </a>
            <a href="#3d-injektion" onClick={() => setMobileMenuOpen(false)} className="hover:text-white flex items-center justify-between">
              <span>3D-Verfahren</span>
              <span className="text-[10px] font-mono text-cyan-400">WTA</span>
            </a>
            <a href="#servicegebiet" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">
              Servicegebiet PLZ 42
            </a>
            <a href="#rechner" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">
              Kostenrechner
            </a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white">
              FAQ
            </a>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2">
            <a
              href={`tel:${COMPANY_INFO.phoneTel}`}
              className="py-2.5 text-center text-xs font-mono font-medium text-slate-300 bg-white/[0.04] border border-white/10 rounded-lg"
            >
              Tel: {COMPANY_INFO.phoneDisplay}
            </a>
            <a
              href="#kontakt"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 text-center text-xs font-medium text-[#0b0e14] bg-cyan-400 rounded-lg font-bold"
            >
              Kostenlose Vor-Ort-Analyse
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
