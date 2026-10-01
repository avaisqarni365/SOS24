"use client";

import React, { useState } from "react";
import { Menu, Phone, X, MessageCircle, ShieldCheck } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";
import Logo from "@/components/brand/Logo";
import LanguageSelector from "@/components/navigation/LanguageSelector";
import AppearanceMenu from "@/components/navigation/AppearanceMenu";
import { useLanguage } from "@/i18n/LanguageContext";

const LINKS = [
  { href: "/#leistungen", key: "nav.services" },
  { href: "/#schicht-fuer-schicht", key: "nav.process3d" },
  { href: "/#nachweis", key: "nav.proof" },
  { href: "/#galerie", key: "nav.gallery" },
  { href: "/#rechner", key: "nav.calculator" },
  { href: "/#servicegebiet", key: "nav.region" },
];

const AUDIENCE = [
  { href: "/#fuer-hausbesitzer", label: "Für Hausbesitzer" },
  { href: "/#fuer-unternehmen", label: "Für Hausverwaltungen & Unternehmen" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50">
      <a href="#main" className="skip-link">
        Zum Inhalt springen
      </a>

      {/* emerald strip: who we are, who it is for, direct lines (desktop) */}
      <div className="site-header__strip hidden lg:block">
        <div className="site-wrap flex h-9 items-center justify-between gap-6 text-[0.8125rem]">
          <p className="no-justify flex items-center gap-2 font-medium">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            SchimmelPeter® Partnerbetrieb · Kostenlose Feuchtemessung vor Ort
          </p>
          <nav aria-label="Zielgruppen" className="flex items-center gap-5">
            {AUDIENCE.map((a) => (
              <a key={a.href} href={a.href}>
                {a.label}
              </a>
            ))}
            <span aria-hidden="true" className="h-4 w-px bg-white/30" />
            <a href={`tel:${COMPANY_INFO.phoneTel}`} className="flex items-center gap-1.5 font-semibold">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {COMPANY_INFO.phoneDisplay}
            </a>
            <a href={COMPANY_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-semibold">
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              WhatsApp
            </a>
          </nav>
        </div>
      </div>

      <div className="site-header__bar">
        <div className="site-wrap flex h-16 items-center justify-between gap-3 sm:h-[4.5rem] lg:gap-4">
          <a href="/" aria-label="sos-abdichtung, zur Startseite" className="shrink-0">
            <Logo sub="SchimmelPeter® Partner · Wuppertal" />
          </a>

          <nav aria-label="Hauptnavigation" className="site-nav hidden shrink-0 min-[1440px]:block">
            <ul className="flex items-center">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="block whitespace-nowrap">
                    {t(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <AppearanceMenu />
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            <a href="/#kontakt" className="btn-shine hidden min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full px-5 text-[0.9375rem] font-semibold sm:inline-flex">
              {t("nav.cta")}
            </a>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line/15 bg-[var(--ink)] text-[var(--bone)] hover:border-[var(--mint)] min-[1440px]:hidden"
              aria-label={open ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-line/10 bg-[var(--ink)] px-6 py-5 shadow-lg min-[1440px]:hidden">
          <ul className="flex flex-col text-base text-[var(--bone)]">
            {[...LINKS, { href: "/#faq", key: "nav.faq" }].map((l) => (
              <li key={l.href} className="border-b border-line/[0.08] last:border-0">
                <a href={l.href} onClick={() => setOpen(false)} className="block py-3 hover:text-[var(--mint)]">
                  {t(l.key)}
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-3 grid gap-2 text-sm">
            {AUDIENCE.map((a) => (
              <li key={a.href}>
                <a href={a.href} onClick={() => setOpen(false)} className="block rounded-xl bg-line/[0.05] px-4 py-3 font-semibold text-[var(--bone)]">
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-sm text-[var(--sc-ink-soft)]">Sprache</span>
            <LanguageSelector />
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            <a
              href={`tel:${COMPANY_INFO.phoneTel}`}
              className="flex items-center justify-center gap-2 rounded-full border border-line/15 py-3 font-semibold"
            >
              <Phone className="h-4 w-4 text-[var(--mint)]" aria-hidden="true" />
              {COMPANY_INFO.phoneDisplay}
            </a>
            <a
              href="/#kontakt"
              onClick={() => setOpen(false)}
              className="btn-shine rounded-full py-3.5 text-center text-[0.9375rem] font-semibold"
            >
              {t("contact.submit")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
