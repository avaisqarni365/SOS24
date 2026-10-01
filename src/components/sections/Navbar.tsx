"use client";

import React, { useEffect, useRef, useState } from "react";
import { Menu, Phone, X, MessageCircle, ShieldCheck, ChevronDown } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";
import { SERVICE_CARDS } from "@/data/services";
import Logo from "@/components/brand/Logo";
import LanguageSelector from "@/components/navigation/LanguageSelector";
import AppearanceMenu from "@/components/navigation/AppearanceMenu";
import { useLanguage } from "@/i18n/LanguageContext";

const LINKS = [
  { href: "/#schicht-fuer-schicht", key: "nav.process3d" },
  { href: "/#nachweis", key: "nav.proof" },
  { href: "/galerie/", key: "nav.gallery" },
  { href: "/kostenrechner/", key: "nav.calculator" },
  { href: "/#servicegebiet", key: "nav.region" },
];

const AUDIENCE = [
  { href: "/#fuer-hausbesitzer", label: "Für Hausbesitzer" },
  { href: "/#fuer-unternehmen", label: "Für Hausverwaltungen & Unternehmen" },
];

/** "Leistungen" in the main bar: all six services with their picture, and the overview page. */
function ServicesMenu({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const enter = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  const leave = () => {
    timer.current = setTimeout(() => setOpen(false), 160);
  };
  return (
    <li ref={ref} className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button type="button" className="site-nav__trigger" aria-expanded={open} aria-controls="services-menu" onClick={() => setOpen(!open)}>
        {label} <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
      <div id="services-menu" className="services-menu" hidden={!open}>
        <ul>
          {SERVICE_CARDS.map((s) => (
            <li key={s.slug}>
              <a href={`/leistungen/${s.slug}/`} onClick={() => setOpen(false)}>
                <span className={`services-menu__img services-menu__img--${s.image.fit}`}>
                  <img src={s.image.src} alt="" width={64} height={44} loading="lazy" decoding="async" />
                </span>
                <span className="services-menu__t">{s.title}</span>
                <span className="services-menu__arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a className="services-menu__all" href="/leistungen/" onClick={() => setOpen(false)}>
          Alle Leistungen im Überblick <span aria-hidden="true">→</span>
        </a>
      </div>
    </li>
  );
}

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
              <ServicesMenu label={t("nav.services")} />
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
          <p className="sc-label">{t("nav.services")}</p>
          <ul className="mt-2 grid gap-1 text-[0.9375rem] text-[var(--bone)] sm:grid-cols-2">
            {SERVICE_CARDS.map((sv) => (
              <li key={sv.slug}>
                <a href={`/leistungen/${sv.slug}/`} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-line/[0.05]">
                  <span className={`services-menu__img services-menu__img--${sv.image.fit}`}>
                    <img src={sv.image.src} alt="" width={64} height={45} loading="lazy" decoding="async" />
                  </span>
                  <span className="font-semibold">{sv.title}</span>
                </a>
              </li>
            ))}
            <li className="sm:col-span-2">
              <a href="/leistungen/" onClick={() => setOpen(false)} className="block px-2 py-2 font-semibold text-[var(--brick)]">
                Alle Leistungen im Überblick →
              </a>
            </li>
          </ul>
          <ul className="mt-3 flex flex-col border-t border-line/10 pt-2 text-base text-[var(--bone)]">
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
