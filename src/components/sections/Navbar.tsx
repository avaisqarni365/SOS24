"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, Menu, X, ArrowRight } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";
import LanguageSelector from "@/components/navigation/LanguageSelector";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-[#0E1310]/95 backdrop-blur-xl border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4 lg:gap-8">
        
        {/* Brand Logo - 100% Kontai24 Clean Editorial Architecture */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group select-none">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 whitespace-nowrap">
              <span className="font-editorial text-lg sm:text-xl lg:text-[22px] tracking-[0.12em] text-landing-bone uppercase font-normal whitespace-nowrap">
                sos-abdichtung
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-landing-mint shadow-[0_0_8px_rgba(98,196,172,0.9)]" />
            </div>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-landing-bone/45 -mt-0.5 whitespace-nowrap">
              Wuppertal · Region 42
            </span>
          </div>
        </Link>

        {/* Minimalist Centered Nav Links - Uncluttered, Single Line, No Wrapping */}
        <nav aria-label="Hauptnavigation" className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-[13px] font-medium text-landing-bone/70 shrink-0">
          <a
            href="#leistungen"
            className="hover:text-landing-bone transition-colors whitespace-nowrap py-1"
          >
            {t("nav.services") || "Leistungen"}
          </a>
          <a
            href="#3d-injektion"
            className="hover:text-landing-bone transition-colors whitespace-nowrap flex items-center gap-1.5 py-1"
          >
            <span>{t("nav.process3d") || "3D-Verfahren"}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-landing-mint animate-pulse" />
          </a>
          <a
            href="#galerie"
            className="hover:text-landing-bone transition-colors whitespace-nowrap py-1"
          >
            {t("nav.gallery") || "Galerie"}
          </a>
          <a
            href="#rechner"
            className="hover:text-landing-bone transition-colors whitespace-nowrap py-1"
          >
            {t("nav.calculator") || "Kostenrechner"}
          </a>
          <a
            href="#servicegebiet"
            className="hover:text-landing-bone transition-colors whitespace-nowrap py-1"
          >
            {t("nav.region") || "Servicegebiet"}
          </a>
        </nav>

        {/* Right Action Cluster - Organized, Spacious, Never Overlapping */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* 6-Language Dropdown Selector */}
          <LanguageSelector />

          {/* Clean Phone Capsule (Visible on wide screens, never wraps) */}
          <a
            href={`tel:${COMPANY_INFO.phoneTel}`}
            className="hidden xl:inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 hover:border-landing-mint/40 bg-white/[0.03] text-xs font-mono text-landing-bone/80 hover:text-landing-mint transition-all whitespace-nowrap shrink-0"
            title="Direkter Telefonkontakt"
          >
            <Phone className="w-3 h-3 text-landing-mint shrink-0" />
            <span className="whitespace-nowrap">{COMPANY_INFO.phoneDisplay}</span>
          </a>

          {/* High-Converting CTA Button */}
          <a
            href="#kontakt"
            className="hidden sm:inline-flex items-center justify-center rounded-full bg-landing-bone hover:bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-[13px] font-semibold text-[#0E1310] transition-all whitespace-nowrap shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            {t("nav.cta")}
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full text-landing-bone/80 hover:text-landing-bone hover:bg-white/5 transition-colors shrink-0"
            aria-label="Menü öffnen"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0E1310]/98 backdrop-blur-2xl px-6 py-6 flex flex-col gap-1 text-sm text-landing-bone/80 animate-in fade-in slide-in-from-top-2 duration-200">
          <a
            href="#leistungen"
            onClick={() => setMobileMenuOpen(false)}
            className="py-3 hover:text-landing-bone transition-colors border-b border-white/[0.04]"
          >
            {t("nav.services") || "Leistungen"}
          </a>
          <a
            href="#3d-injektion"
            onClick={() => setMobileMenuOpen(false)}
            className="py-3 hover:text-landing-bone transition-colors flex items-center justify-between border-b border-white/[0.04]"
          >
            <span>{t("nav.process3d") || "3D-Verfahren"}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-landing-mint/15 text-landing-mint border border-landing-mint/30">
              WTA 4-4
            </span>
          </a>
          <a
            href="#galerie"
            onClick={() => setMobileMenuOpen(false)}
            className="py-3 hover:text-landing-bone transition-colors border-b border-white/[0.04]"
          >
            {t("nav.gallery") || "Galerie"}
          </a>
          <a
            href="#rechner"
            onClick={() => setMobileMenuOpen(false)}
            className="py-3 hover:text-landing-bone transition-colors border-b border-white/[0.04]"
          >
            {t("nav.calculator") || "Kostenrechner"}
          </a>
          <a
            href="#servicegebiet"
            onClick={() => setMobileMenuOpen(false)}
            className="py-3 hover:text-landing-bone transition-colors border-b border-white/[0.04]"
          >
            {t("nav.region") || "Servicegebiet"}
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="py-3 hover:text-landing-bone transition-colors"
          >
            {t("nav.faq") || "Häufige Fragen"}
          </a>

          <div className="pt-4 flex flex-col gap-2.5 mt-2">
            <a
              href={`tel:${COMPANY_INFO.phoneTel}`}
              className="py-3 px-4 text-center text-xs font-mono font-medium text-landing-bone/90 bg-white/[0.04] hover:bg-white/[0.08] rounded-full border border-white/10 flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-landing-mint" />
              <span>{COMPANY_INFO.phoneDisplay}</span>
            </a>
            <a
              href="#kontakt"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-landing-bone px-4 py-3.5 text-sm font-semibold text-[#0E1310] hover:bg-white transition-all shadow-md"
            >
              <span>{t("nav.cta")}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
