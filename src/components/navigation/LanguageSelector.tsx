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
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#f7faf9] border border-line/15 hover:border-[#13755d]/40 text-xs font-mono text-[#0b0f0d] transition-all shadow-xs"
        aria-label="Sprache auswählen"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{currentLocale.flag}</span>
        <span className="font-semibold uppercase tracking-wider">{currentLocale.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#55605c] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#13755d]" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white border border-line/12 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-[#55605c] border-b border-line/8 mb-1">
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
                    ? "bg-[#13755d]/10 text-[#0f5c49] font-bold"
                    : "text-[#2c3631] hover:bg-[#f7faf9] hover:text-[#0b0f0d]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{locale.flag}</span>
                  <span>{locale.nativeName}</span>
                </div>
                {isSelected && (
                  <span className="text-[#13755d] text-xs">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
