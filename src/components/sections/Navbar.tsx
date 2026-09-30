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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/10 bg-[var(--nav-bg)] backdrop-blur-xl">
      <a href="#main" className="skip-link">
        Zum Inhalt springen
      </a>

      {/* info bar: who we are, who it is for, direct lines (desktop) */}
      <div className="hidden border-b border-line/[0.07] lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-6 px-8 text-[0.78rem] text-[var(--sc-ink-soft)]">
          <p className="no-justify flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--mint)]" aria-hidden="true" />
            SchimmelPeter® Partnerbetrieb · Kostenlose Feuchtemessung vor Ort
          </p>
          <nav aria-label="Zielgruppen" className="flex items-center gap-5">
            {AUDIENCE.map((a) => (
              <a key={a.href} href={a.href} className="hover:text-[var(--bone)]">
                {a.label}
              </a>
            ))}
            <span aria-hidden="true" className="h-4 w-px bg-line/20" />
            <a href={`tel:${COMPANY_INFO.phoneTel}`} className="flex items-center gap-1.5 font-semibold text-[var(--bone)] hover:text-[var(--mint)]">
              <Phone className="h-3.5 w-3.5 text-[var(--mint)]" aria-hidden="true" />
              {COMPANY_INFO.phoneDisplay}
            </a>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-semibold text-[var(--bone)] hover:text-[var(--mint)]"
            >
              <MessageCircle className="h-3.5 w-3.5 text-[var(--mint)]" aria-hidden="true" />
              WhatsApp
            </a>
          </nav>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 min-[380px]:gap-4 min-[380px]:px-4 sm:h-[4.5rem] sm:px-6 lg:gap-6 lg:px-8">
        <a href="/" aria-label="sos-abdichtung, zur Startseite" className="shrink-0">
          <Logo sub="SchimmelPeter® Partner · Wuppertal" />
        </a>

        <nav aria-label="Hauptnavigation" className="hidden shrink-0 lg:block">
          <ul className="flex items-center gap-1 text-[0.86rem] font-medium text-[var(--bone)]/80">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block whitespace-nowrap rounded-full px-3 py-2 hover:bg-line/[0.06] hover:text-[var(--bone)]"
                >
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
          <a
            href="/#kontakt"
            className="hidden min-h-[44px] items-center whitespace-nowrap rounded-full bg-[var(--mint)] px-5 text-[0.86rem] font-semibold text-[var(--ink)] shadow-sm hover:opacity-90 sm:inline-flex"
          >
            {t("nav.cta")}
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line/15 text-[var(--bone)] hover:border-[var(--mint)] lg:hidden"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-line/10 bg-[var(--ink)] px-6 py-5 lg:hidden">
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
              className="rounded-full bg-[var(--mint)] py-3.5 text-center text-sm font-semibold text-[var(--ink)]"
            >
              {t("contact.submit")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
