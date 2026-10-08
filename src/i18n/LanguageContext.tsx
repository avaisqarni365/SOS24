"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { SupportedLocale, SUPPORTED_LOCALES, DE, LocaleMeta } from "./translations";

interface LanguageContextType {
  lang: SupportedLocale;
  setLang: (locale: SupportedLocale) => void;
  t: (key: string) => string;
  currentLocale: LocaleMeta;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/** One small chunk per language, fetched only when someone switches to it. */
const LOADERS: Record<Exclude<SupportedLocale, "de">, () => Promise<{ default: Record<string, string> }>> = {
  en: () => import("./locales/en"),
  tr: () => import("./locales/tr"),
  ru: () => import("./locales/ru"),
  ar: () => import("./locales/ar"),
  pl: () => import("./locales/pl"),
};

const isLocale = (v: string | null): v is SupportedLocale => !!v && SUPPORTED_LOCALES.some((l) => l.code === v);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLocale>("de");
  const [dict, setDict] = useState<Record<string, string>>(DE);

  const apply = useCallback(async (next: SupportedLocale) => {
    const strings = next === "de" ? DE : (await LOADERS[next]()).default;
    setDict(strings);
    setLangState(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  }, []);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("sos_lang");
    } catch {
      // storage blocked (private mode, sandboxed frame)
    }
    if (isLocale(stored) && stored !== "de") apply(stored).catch(() => {});
  }, [apply]);

  const setLang = (next: SupportedLocale) => {
    try {
      localStorage.setItem("sos_lang", next);
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
