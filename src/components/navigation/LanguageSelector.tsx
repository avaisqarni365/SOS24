"use client";

import { useLanguage } from "@/i18n/LanguageContext";
import { SUPPORTED_LOCALES } from "@/i18n/translations";

/** German or English: two buttons, the active one raised. */
export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="langswitch" role="group" aria-label="Sprache / Language" data-no-translate>
      {SUPPORTED_LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          lang={l.code}
          aria-pressed={lang === l.code}
          aria-label={l.nativeName}
          title={l.nativeName}
          onClick={() => lang !== l.code && setLang(l.code)}
        >
          {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
