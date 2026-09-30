"use client";

import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Shield, Heart } from "lucide-react";
import { COMPANY_INFO, REGIONAL_CITIES } from "@/data/content-data";

export default function Footer() {
  return (
    <footer className="bg-sand-900 text-sand-400 pt-16 pb-12 border-t border-sand-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-600 flex items-center justify-center text-white font-extrabold text-base">
                SOS
              </div>
              <div>
                <span className="text-white font-bold text-lg">sos-abdichtung</span>
                <p className="text-[11px] text-sand-500">SchimmelPeter® Partnerbetrieb</p>
              </div>
            </div>

            <p className="text-xs text-sand-400 leading-relaxed max-w-sm">
              Ihr zertifizierter Fachbetrieb für nachhaltige Kellersanierung, drucklose Horizontalsperren im Injektionsverfahren und professionelle Schimmelbeseitigung im Raum Wuppertal und Bergisches Land.
            </p>

            <div className="pt-2 text-xs space-y-1.5 text-sand-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                <span>{COMPANY_INFO.street}, {COMPANY_INFO.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                <a href={`tel:${COMPANY_INFO.phoneTel}`} className="hover:text-white transition-colors">
                  {COMPANY_INFO.phoneDisplay}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-accent-500 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white transition-colors">
                  {COMPANY_INFO.email}
                </a>
              </div>
            </div>
          </div>

          {/* Leistungen Links */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-sm mb-4">Leistungen</h4>
            <ul className="space-y-2 text-xs text-sand-400">
              <li>
                <a href="#leistungen" className="hover:text-white transition-colors">
                  Feuchte Wände & Horizontalsperre
                </a>
              </li>
              <li>
                <a href="#3d-injektion" className="hover:text-white transition-colors">
                  Chemische Mauerwerksinjektion (3D)
                </a>
              </li>
              <li>
                <a href="#leistungen" className="hover:text-white transition-colors">
                  Nasse Keller & Innenabdichtung
                </a>
              </li>
              <li>
                <a href="#leistungen" className="hover:text-white transition-colors">
                  Schimmelbeseitigung & Analyse
                </a>
              </li>
              <li>
                <a href="#kostenrechner" className="hover:text-white transition-colors">
                  Sanierungskosten-Rechner
                </a>
              </li>
            </ul>
          </div>

          {/* Einsatzgebiet PLZ 42 */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-sm mb-4">Einsatzgebiet (PLZ 42)</h4>
            <ul className="space-y-1.5 text-xs text-sand-400">
              {REGIONAL_CITIES.map((c) => (
                <li key={c.name} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-500"></span>
                  <a href="#region-wuppertal" className="hover:text-white transition-colors">
                    {c.name} ({c.districts.slice(0, 2).join(", ")})
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches & Partner */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-sm mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-xs text-sand-400">
              <li>
                <Link href="/impressum" className="hover:text-white transition-colors">
                  Impressum (§ 5 TMG)
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-white transition-colors">
                  Datenschutzerklärung (DSGVO)
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Garantie & WTA-Zertifikate
                </a>
              </li>
            </ul>

            <div className="mt-6 p-3 rounded-xl bg-sand-800/80 border border-sand-700/80 text-[11px] text-sand-400">
              <span className="font-bold text-white block">SchimmelPeter® Partner</span>
              <span>Qualitätsgesichertes Sanierungsnetzwerk</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sand-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-500">
          <p>
            &copy; 2026 {COMPANY_INFO.fullName}. Alle Rechte vorbehalten.
          </p>
          <p className="flex items-center gap-1 text-sand-400">
            <span>Ihr Bautenschutz-Fachbetrieb für Wuppertal & Umgebung</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
