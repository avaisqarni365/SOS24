"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { SupportedLocale, SUPPORTED_LOCALES, TRANSLATIONS, LocaleMeta } from "./translations";

interface LanguageContextType {
  lang: SupportedLocale;
  setLang: (locale: SupportedLocale) => void;
  t: (key: string) => string;
  currentLocale: LocaleMeta;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLocale>("de");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("sos_lang") as SupportedLocale;
      if (stored && TRANSLATIONS[stored]) {
        setLangState(stored);
      }
    } catch (e) {
      // Ignore storage errors in restricted iframe
    }
  }, []);

  const setLang = (newLang: SupportedLocale) => {
    setLangState(newLang);
    try {
      localStorage.setItem("sos_lang", newLang);
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    } catch (e) {
      // Ignore
    }
  };

  const t = (key: string): string => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS["de"]?.[key] || key;
  };

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
