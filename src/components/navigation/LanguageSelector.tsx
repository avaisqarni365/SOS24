"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { SUPPORTED_LOCALES, SupportedLocale } from "@/i18n/translations";

export default function LanguageSelector() {
  const { lang, setLang, currentLocale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block text-left" data-no-translate>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface hover:bg-surface-2 border border-line/15 hover:border-accent-deep/40 text-xs font-mono text-ink transition-all shadow-xs"
        aria-label="Sprache auswählen"
        aria-expanded={isOpen}
      >
        <Globe className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="font-semibold uppercase tracking-wider">{currentLocale.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-ink transition-transform duration-200 ${
            isOpen ? "rotate-180 text-accent-deep" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="surface-pop absolute right-0 mt-2 w-48 rounded-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-ink font-bold border-b border-line/8 mb-1">
            Sprache / Language
          </div>
          {SUPPORTED_LOCALES.map((locale) => {
            const isSelected = locale.code === lang;
            return (
              <button
                key={locale.code}
                onClick={() => {
                  setLang(locale.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors font-mono ${
                  isSelected
                    ? "bg-accent-deep/10 text-accent-deep font-bold"
                    : "text-ink font-medium hover:bg-surface-2"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 shrink-0 text-[10px] uppercase tracking-[0.14em] opacity-60">
                    {locale.code}
                  </span>
                  <span>{locale.nativeName}</span>
                </div>
                {isSelected && (
                  <span className="text-accent-deep text-xs">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
