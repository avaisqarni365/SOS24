"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Phone, MessageCircle, Menu, X, Shield, MapPin } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-sand-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo & Partner Badge */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-accent-600 to-accent-700 flex items-center justify-center shadow-soft group-hover:shadow-md transition-shadow">
            <span className="text-white font-extrabold text-base tracking-wider">SOS</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-sand-900 tracking-tight">
                SOS-Abdichtung
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sand-100 text-sand-700 border border-sand-200">
                <MapPin className="w-3 h-3 text-accent-600" />
                Raum Wuppertal
              </span>
            </div>
            <div className="text-[10px] sm:text-xs text-sand-500 font-medium">
              SchimmelPeter® Partnerbetrieb
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-sand-700">
          <a href="#leistungen" className="hover:text-accent-600 transition-colors">
            Leistungen
          </a>
          <a href="#3d-injektion" className="hover:text-accent-600 transition-colors flex items-center gap-1">
            <span>3D-Injektion</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-hydro-100 text-hydro-700 font-bold">WTA</span>
          </a>
          <a href="#kostenrechner" className="hover:text-accent-600 transition-colors">
            Kostenrechner
          </a>
          <a href="#region-wuppertal" className="hover:text-accent-600 transition-colors">
            PLZ 42 Gebiet
          </a>
          <a href="#ablauf" className="hover:text-accent-600 transition-colors">
            Ablauf
          </a>
          <a href="#faq" className="hover:text-accent-600 transition-colors">
            FAQ
          </a>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Direct Phone Call */}
          <a
            href={`tel:${COMPANY_INFO.phoneTel}`}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-sand-100 hover:bg-sand-200/80 text-sand-900 text-xs font-bold transition-all border border-sand-200"
            title="Jetzt anrufen"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <Phone className="w-3.5 h-3.5 text-accent-700" />
            <span className="hidden sm:inline">{COMPANY_INFO.phoneDisplay}</span>
            <span className="sm:hidden">Anrufen</span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={COMPANY_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 sm:py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all border border-emerald-200"
            title="WhatsApp Chat"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          {/* Primary CTA */}
          <a
            href="#kontakt"
            className="hidden md:inline-flex px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-white bg-accent-600 hover:bg-accent-700 rounded-xl shadow-soft hover:shadow-glow-accent transition-all active:scale-[0.97]"
          >
            Erstberatung buchen
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-sand-700 hover:bg-sand-100 border border-sand-200"
            aria-label="Menü öffnen"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-sand-200 px-6 py-5 space-y-4 shadow-xl animate-fade-in">
          <div className="flex flex-col gap-3 text-sm font-semibold text-sand-800">
            <a
              href="#leistungen"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-accent-600"
            >
              Leistungen
            </a>
            <a
              href="#3d-injektion"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-accent-600 flex items-center justify-between"
            >
              <span>3D-Injektionsverfahren</span>
              <span className="text-[10px] px-2 py-0.5 bg-hydro-100 text-hydro-700 rounded-full font-bold">WTA</span>
            </a>
            <a
              href="#kostenrechner"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-accent-600"
            >
              Kostenrechner
            </a>
            <a
              href="#region-wuppertal"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-accent-600"
            >
              PLZ 42 Servicegebiet
            </a>
            <a
              href="#ablauf"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-accent-600"
            >
              Ablauf
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-accent-600"
            >
              Häufige Fragen (FAQ)
            </a>
          </div>

          <div className="pt-4 border-t border-sand-200 flex flex-col gap-2.5">
            <a
              href="#kontakt"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-accent-600 text-white text-center text-xs font-bold shadow-soft"
            >
              Kostenlose Erstberatung anfragen
            </a>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 text-white text-center text-xs font-bold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Beratung starten
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
