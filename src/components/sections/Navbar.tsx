"use client";

import React, { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";
import Logo from "@/components/brand/Logo";
import LanguageSelector from "@/components/navigation/LanguageSelector";
import { useLanguage } from "@/i18n/LanguageContext";

const LINKS = [
  { href: "/#schicht-fuer-schicht", key: "nav.process3d" },
  { href: "/#leistungen", key: "nav.services" },
  { href: "/#nachweis", key: "nav.proof" },
  { href: "/#galerie", key: "nav.gallery" },
  { href: "/#rechner", key: "nav.calculator" },
  { href: "/#servicegebiet", key: "nav.region" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#0e1310]/95 backdrop-blur-xl">
      <a href="#main" className="skip-link">
        Zum Inhalt springen
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:gap-8 lg:px-8">
        <a href="/" aria-label="sos-abdichtung, zur Startseite" className="shrink-0">
          <Logo sub="Wuppertal · Region 42" />
        </a>

        {/* single line from large screens up, never wraps */}
        <nav aria-label="Hauptnavigation" className="hidden shrink-0 lg:block">
          <ul className="flex items-center gap-5 text-[13px] font-medium text-[var(--bone)]/75 xl:gap-7">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="whitespace-nowrap py-1 hover:text-[var(--bone)]">
                  {t(l.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          <LanguageSelector />
          <a
            href={`tel:${COMPANY_INFO.phoneTel}`}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 font-mono text-xs text-[var(--bone)]/85 hover:border-[var(--mint)] 2xl:inline-flex"
          >
            <Phone className="h-3 w-3 text-[var(--mint)]" aria-hidden="true" />
            {COMPANY_INFO.phoneDisplay}
          </a>
          <a
            href="/#kontakt"
            className="hidden min-h-[44px] items-center whitespace-nowrap rounded-full bg-[var(--bone)] px-5 text-[13px] font-semibold text-[var(--ink)] hover:bg-white sm:inline-flex"
          >
            {t("nav.cta")}
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--bone)]/85 hover:bg-white/5 lg:hidden"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-white/10 bg-[#0e1310] px-6 py-5 lg:hidden">
          <ul className="flex flex-col text-sm text-[var(--bone)]/85">
            {[...LINKS, { href: "/#faq", key: "nav.faq" }].map((l) => (
              <li key={l.href} className="border-b border-white/[0.05] last:border-0">
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3 hover:text-[var(--bone)]">
                  {t(l.key)}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2.5">
            <a
              href={`tel:${COMPANY_INFO.phoneTel}`}
              className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-3 font-mono text-xs"
            >
              <Phone className="h-3.5 w-3.5 text-[var(--mint)]" aria-hidden="true" />
              {COMPANY_INFO.phoneDisplay}
            </a>
            <a
              href="/#kontakt"
              onClick={() => setOpen(false)}
              className="rounded-full bg-[var(--bone)] py-3.5 text-center text-sm font-semibold text-[var(--ink)]"
            >
              {t("contact.submit")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
