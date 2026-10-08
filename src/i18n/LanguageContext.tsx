"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { SupportedLocale, SUPPORTED_LOCALES, DE, LocaleMeta } from "./translations";
import { applyDict, loadDict } from "./domTranslate";

interface LanguageContextType {
  lang: SupportedLocale;
  setLang: (locale: SupportedLocale) => void;
  t: (key: string) => string;
  currentLocale: LocaleMeta;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/** The English interface strings, fetched only when someone switches to English. */
const LOADERS: Record<Exclude<SupportedLocale, "de">, () => Promise<{ default: Record<string, string> }>> = {
  en: () => import("./locales/en"),
};

const isLocale = (v: string | null): v is SupportedLocale => !!v && SUPPORTED_LOCALES.some((l) => l.code === v);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLocale>("de");
  const [dict, setDict] = useState<Record<string, string>>(DE);

  const apply = useCallback(async (next: SupportedLocale) => {
    const root = document.documentElement;
    try {
      if (next === "de") {
        setDict(DE);
        applyDict(null);
      } else {
        // the interface strings and the page dictionary arrive together
        const [ui, page] = await Promise.all([LOADERS[next](), loadDict(next)]);
        setDict(ui.default);
        applyDict(page);
      }
      setLangState(next);
      root.lang = next;
      // headings change length with the language: let them refit
      window.dispatchEvent(new Event("sos-i18n"));
    } finally {
      root.classList.remove("i18n-wait");
    }
  }, []);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("sos_lang");
    } catch {
      // storage blocked (private mode, sandboxed frame)
    }
    if (isLocale(stored) && stored !== "de") apply(stored).catch(() => {});
    else document.documentElement.classList.remove("i18n-wait");
  }, [apply]);

  const setLang = (next: SupportedLocale) => {
    try {
      if (next === "de") localStorage.removeItem("sos_lang");
      else localStorage.setItem("sos_lang", next);
    } catch {
      // the choice lasts for this page view
    }
    apply(next).catch(() => {});
  };

  const t = (key: string): string => dict[key] || DE[key] || key;

  const currentLocale = SUPPORTED_LOCALES.find((l) => l.code === lang) || SUPPORTED_LOCALES[0];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, currentLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
