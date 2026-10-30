"use client";

import { PartnerLink, PartnerText, PartnerBadge } from "@/components/brand/PartnerLink";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Phone, X, MessageCircle, ShieldCheck, Calendar } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";
import { SERVICE_CARDS } from "@/data/services";
import Logo from "@/components/brand/Logo";
import LanguageSelector from "@/components/navigation/LanguageSelector";
import AppearanceMenu from "@/components/navigation/AppearanceMenu";
import ColorControl from "@/components/navigation/ColorControl";
import { useLanguage } from "@/i18n/LanguageContext";
import { SocialLinks } from "@/components/sections/SiteFeed";

/* The 3D viewer, the scanner and the measurement proof are one tab now
   (/labor/), not two anchors into a very long landing page. */
/** Every city page, in the order of seo-pages.ts CITY_PAGES (kept small here: no page texts in the menu bundle). */
const CITIES = [
  { slug: "wuppertal", name: "Wuppertal" },
  { slug: "solingen", name: "Solingen" },
  { slug: "remscheid", name: "Remscheid" },
  { slug: "velbert", name: "Velbert" },
  { slug: "haan", name: "Haan" },
  { slug: "wermelskirchen", name: "Wermelskirchen" },
  { slug: "essen", name: "Essen" },
  { slug: "duesseldorf", name: "Düsseldorf" },
  { slug: "bochum", name: "Bochum" },
  { slug: "dortmund", name: "Dortmund" },
  { slug: "koeln", name: "Köln" },
  { slug: "duisburg", name: "Duisburg" },
  { slug: "gelsenkirchen", name: "Gelsenkirchen" },
  { slug: "oberhausen", name: "Oberhausen" },
  { slug: "muelheim-an-der-ruhr", name: "Mülheim an der Ruhr" },
  { slug: "hagen", name: "Hagen" },
  { slug: "leverkusen", name: "Leverkusen" },
  { slug: "bottrop", name: "Bottrop" },
];

/** The flat top level of the menu: the main places the site actually goes. */
const PRIMARY: { href: string; key?: string; label?: string }[] = [
  { href: "/termin/", label: "Termin buchen" },
  { href: "/leistungen/", label: "Leistungen" },
  { href: "/labor/", key: "nav.simulation" },
  { href: "/galerie/", key: "nav.gallery" },
  { href: "/kostenrechner/", key: "nav.calculator" },
  { href: "/kontakt/", label: "Kontakt" },
];

const AUDIENCE = [
  { href: "/leistungen/#fuer-hausbesitzer", label: "Für Hausbesitzer" },
  { href: "/leistungen/#fuer-unternehmen", label: "Für Hausverwaltungen & Unternehmen" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "";
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  /** a same-page anchor picked in the menu: scrolled to once the menu is gone */
  const pendingScroll = useRef<string | null>(null);

  // A full-screen menu has to behave like a dialog: Escape closes it, focus
  // moves into it and comes back to the button, Tab stays inside, and the
  // page behind it does not scroll.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const focusables = () =>
      Array.from(menuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = [burgerRef.current, ...focusables()].filter(Boolean) as HTMLElement[];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = prevOverflow;
      const target = pendingScroll.current;
      pendingScroll.current = null;
      // scrolling while the page is still locked gets cut off, so the jump
      // waits until the lock is released
      if (target) document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
      else burgerRef.current?.focus({ preventScroll: true });
    };
  }, [open]);

  // Navigating away closes the menu (covers the browser back button too).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHome && href.includes("#")) {
      const id = href.split("#")[1];
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        window.history.pushState(null, "", `#${id}`);
        if (open) {
          pendingScroll.current = id;
          setOpen(false);
        } else {
          el.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }
    }
    setOpen(false);
  };

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
            <PartnerLink>SchimmelPeter® Partnerbetrieb</PartnerLink> · Kostenlose Feuchtemessung vor Ort
          </p>
          <nav aria-label="Zielgruppen" className="flex items-center gap-5">
            {AUDIENCE.map((a) => (
              <a key={a.href} href={a.href} onClick={(e) => handleNavClick(e, a.href)}>
                {a.label}
              </a>
            ))}
            <span aria-hidden="true" className="h-4 w-px bg-surface/30" />
            <a href={`tel:${COMPANY_INFO.phoneTel}`} className="flex items-center gap-1.5 font-semibold">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {COMPANY_INFO.phoneDisplay}
            </a>
            <a href={COMPANY_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-semibold text-emerald-200 hover:text-white transition-colors">
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              WhatsApp
            </a>
            <a href="/termin/" className="flex items-center gap-1.5 font-bold bg-white text-emerald-950 hover:bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs shadow-xs transition-colors">
              <Calendar className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
              Termin buchen
            </a>
            {/* wide screens only: on narrower ones the strip has no room, the menu and footer show them */}
            <span className="hidden 2xl:flex items-center gap-5">
              <span aria-hidden="true" className="h-4 w-px bg-surface/30" />
              <SocialLinks variant="mini" />
            </span>
          </nav>
        </div>
      </div>

      <div className="site-header__bar band-ink">
        <div className="site-wrap flex h-16 items-center justify-between gap-3 sm:h-[4.5rem] lg:gap-4">
          <a href="/" aria-label="sos-abdichtung, zur Startseite" className="shrink-0">
            <Logo />
          </a>

          <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
            <ColorControl compact className="header-tone" />
            <AppearanceMenu />
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

            {/* Recovered Contact Formula Button */}
            <a
              href="/kontakt/"
              onClick={(e) => handleNavClick(e, "/kontakt/")}
              className="header-cta hidden min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full px-5 text-[0.9375rem] font-semibold sm:inline-flex"
            >
              {t("nav.cta")}
            </a>

            <button
              ref={burgerRef}
              type="button"
              onClick={() => setOpen(!open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] bg-surface text-[var(--bone)] hover:border-accent-deep"
              aria-label={open ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {open && <div className="mnav-scrim" aria-hidden="true" onClick={() => setOpen(false)} />}
      {open && (
        /* One screen, flat. The old menu was four accordions of 3D thumbnails:
           three taps to reach a service and a lot of chrome for a phone. This
           is the whole site as a set-serif index, with the two contact
           channels pinned to the bottom where a thumb reaches them. */
        <div id="mobile-menu" ref={menuRef} className="mnav" role="dialog" aria-modal="true" aria-label="Menü">
          <div className="mnav__inner">
            <nav className="mnav__primary" aria-label="Hauptbereiche">
              {PRIMARY.map((l, i) => (
                <a key={l.href} href={l.href} onClick={(e) => handleNavClick(e, l.href)}>
                  <span className="mnav__n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mnav__label">{l.key ? t(l.key) : l.label}</span>
                  <span className="mnav__arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </nav>

            <section className="mnav__block mnav__block--services" aria-labelledby="mnav-services">
              <p id="mnav-services" className="mnav__kicker">Leistungen</p>
              <ul className="mnav__list">
                {SERVICE_CARDS.map((sv) => (
                  <li key={sv.slug}>
                    <a href={`/leistungen/${sv.slug}/`} onClick={() => setOpen(false)}>
                      {sv.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mnav__block mnav__block--cities" aria-labelledby="mnav-cities">
              <p id="mnav-cities" className="mnav__kicker">Einsatzgebiet</p>
              <ul className="mnav__chips">
                {CITIES.map((c) => (
                  <li key={c.slug}>
                    <a href={`/kellersanierung/${c.slug}/`} onClick={() => setOpen(false)}>
                      {c.name}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mnav__block mnav__block--audience" aria-labelledby="mnav-audience">
              <p id="mnav-audience" className="mnav__kicker">Für wen wir arbeiten</p>
              <ul className="mnav__list">
                {AUDIENCE.map((a) => (
                  <li key={a.href}>
                    <a href={a.href} onClick={(e) => handleNavClick(e, a.href)}>
                      {a.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <div className="mnav__prefs">
              <div className="mnav__tone">
                <span className="mnav__kicker">Farbe</span>
                <ColorControl />
              </div>
              <div className="mnav__lang">
                <span className="mnav__kicker">Sprache</span>
                <LanguageSelector />
              </div>
            </div>
          </div>

          <div className="mnav__social">
            <span className="mnav__kicker">Folgen Sie uns</span>
            <SocialLinks variant="mini" />
          </div>

          <div className="mnav__foot">
            <a href={`tel:${COMPANY_INFO.phoneTel}`} className="mnav__call">
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>
                <small>Jetzt anrufen</small>
                {COMPANY_INFO.phoneDisplay}
              </span>
            </a>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mnav__wa"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>
                <small>WhatsApp</small>
                Foto senden
              </span>
            </a>
            <a
              href="/termin/"
              onClick={() => setOpen(false)}
              className="mnav__termin"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>
                <small>Kostenlos</small>
                Termin online buchen
              </span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
