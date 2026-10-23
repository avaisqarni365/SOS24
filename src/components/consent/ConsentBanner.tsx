"use client";

import { useEffect, useState } from "react";
import { GA_TRACKING_ID } from "@/lib/analytics";

/** The visitor's answer, kept in this browser only. */
export const CONSENT_KEY = "sos_consent";
/** Dispatch this on window (e.g. from the footer) to ask again. */
export const CONSENT_OPEN_EVENT = "sos:consent-open";

type Choice = "granted" | "denied";

function readChoice(): Choice | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/* Google Analytics is not part of the page: its script is added only after the visitor says yes,
   so without consent no request goes to Google and no cookie is set (§ 25 TDDDG). */
function loadAnalytics() {
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; __sosGa?: boolean };
  if (w.__sosGa) return;
  w.__sosGa = true;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // gtag.js reads the arguments object itself, not an array
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_TRACKING_ID);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  document.head.appendChild(s);
}

/* Withdrawing consent: stop sending and remove the cookies Google Analytics set on this site. */
function clearAnalyticsCookies() {
  const host = location.hostname.replace(/^www\./, "");
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (!/^_ga(_|$)/.test(name)) return;
    for (const domain of ["", `; domain=${host}`, `; domain=.${host}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  });
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_TRACKING_ID}`] = true;
}

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const choice = readChoice();
    if (choice === "granted") loadAnalytics();
    else if (choice === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  const decide = (choice: Choice) => {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // private mode: the answer holds for this visit
    }
    if (choice === "granted") loadAnalytics();
    else clearAnalyticsCookies();
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-text"
      className="consent fixed inset-x-3 z-[60] rounded-2xl border border-line/20 bg-surface p-4 text-ink shadow-2xl sm:inset-x-auto sm:right-4 sm:max-w-md"
    >
      <p id="consent-title" className="text-sm font-bold">
        Darf diese Website Google Analytics nutzen?
      </p>
      <p id="consent-text" className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">
        So sehen wir, welche Seiten gelesen werden. Google setzt dafür Cookies, Daten können in die USA gehen. Ohne
        Ihr Ja wird nichts geladen; ändern können Sie das jederzeit unter „Cookie-Einstellungen“.{" "}
        <a href="/datenschutz/#analyse" className="font-semibold underline underline-offset-2">
          Mehr erfahren
        </a>
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => decide("denied")}
          className="min-h-[44px] rounded-full border border-[var(--line-strong)] px-4 text-sm font-semibold"
        >
          Ablehnen
        </button>
        <button
          type="button"
          onClick={() => decide("granted")}
          className="min-h-[44px] rounded-full border border-[var(--line-strong)] px-4 text-sm font-semibold"
        >
          Erlauben
        </button>
      </div>
    </div>
  );
}
