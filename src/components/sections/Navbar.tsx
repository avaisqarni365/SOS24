"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";
import Logo from "@/components/brand/Logo";

const LINKS = [
  { href: "/#schicht-fuer-schicht", label: "Verfahren" },
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/#rechner", label: "Kosten" },
  { href: "/#servicegebiet", label: "Servicegebiet" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0e1310]/85 backdrop-blur-lg">
      <a href="#main" className="skip-link">
        Zum Inhalt springen
      </a>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[4.5rem] sm:px-8" aria-label="Hauptnavigation">
        <a href="/" aria-label="sos-abdichtung, zur Startseite">
          <Logo sub="Wuppertal · PLZ 42" />
        </a>

        <ul className="hidden items-center gap-8 text-sm text-[var(--bone)]/70 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-[var(--bone)]">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <a href={`tel:${COMPANY_INFO.phoneTel}`} className="hidden font-mono text-sm text-[var(--bone)]/70 hover:text-[var(--bone)] lg:inline">
            {COMPANY_INFO.phoneDisplay}
          </a>
          <a
            href="/#kontakt"
            className="hidden min-h-[44px] items-center rounded-full bg-[var(--bone)] px-4 text-sm font-semibold text-[var(--ink)] hover:bg-white sm:inline-flex"
          >
            Feuchtemessung anfragen
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--bone)]/80 hover:bg-white/5 md:hidden"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-white/5 bg-[var(--ink)] px-6 py-4 md:hidden">
          <ul className="flex flex-col text-[var(--bone)]/80">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="/#faq" onClick={() => setOpen(false)} className="block py-3">
                Häufige Fragen
              </a>
            </li>
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-white/5 pt-4">
            <a href={`tel:${COMPANY_INFO.phoneTel}`} className="rounded-full bg-white/5 py-3 text-center font-mono text-sm">
              {COMPANY_INFO.phoneDisplay}
            </a>
            <a href="/#kontakt" onClick={() => setOpen(false)} className="rounded-full bg-[var(--bone)] py-3 text-center text-sm font-semibold text-[var(--ink)]">
              Kostenlose Feuchtemessung anfragen
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
