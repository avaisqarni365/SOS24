"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function Schadensbilder() {
  const { t } = useLanguage();

  const cards = [
    {
      n: "01",
      eyebrow: "Mauerwerk & Sockel",
      title: t("services.card1Title"),
      desc: t("services.card1Desc"),
      badge: t("services.card1Badge"),
      href: "#3d-injektion",
      linkText: "3D-Verfahren"
    },
    {
      n: "02",
      eyebrow: "Keller & Sohle",
      title: t("services.card2Title"),
      desc: t("services.card2Desc"),
      badge: t("services.card2Badge"),
      href: "#kontakt",
      linkText: "Messung anfragen"
    },
    {
      n: "03",
      eyebrow: "Gesundheit & Raumklima",
      title: t("services.card3Title"),
      desc: t("services.card3Desc"),
      badge: t("services.card3Badge"),
      href: "#kontakt",
      linkText: "Ursache klären"
    }
  ];

  return (
    <section id="leistungen" className="relative bg-white text-[#050807] border-t border-line/10">
      <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-28">
        {/* Section Eyebrow */}
        <p className="sc-label mb-4">
          {t("services.eyebrow")}
        </p>

        {/* Section Heading */}
        <h2 className="sc-display mt-2 text-[2.25rem] sm:text-5xl lg:text-[3.5rem] text-[#050807]">
          {t("services.h1")}
          <br />
          <em className="text-[var(--mint)]">{t("services.accent")}</em>
        </h2>

        {/* Section Lede */}
        <p className="sc-lede mt-5 max-w-2xl text-[#050807]">
          {t("services.sub")}
        </p>

        {/* Modern 3-Card Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.n}
              className="rounded-3xl p-7 border border-line/10 bg-white shadow-[0_4px_16px_-4px_rgba(16,40,30,0.06),0_12px_28px_-8px_rgba(16,40,30,0.08)] hover:border-[var(--emerald-deep)] hover:shadow-[0_8px_28px_-4px_rgba(16,40,30,0.12),0_20px_48px_-8px_rgba(19,117,93,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header: Emerald Dot Icon + Monospace Number */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--mint)]/10 text-[var(--emerald-deep)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--mint)]" />
                  </div>
                  <span className="font-mono text-xs text-[#050807] font-bold">0{c.n}</span>
                </div>

                <p className="sc-label text-[10px] mb-2">
                  {c.eyebrow}
                </p>
                <h3 className="font-editorial text-xl mb-3 text-[#050807] font-bold leading-snug">
                  {c.title}
                </h3>
                <p className="text-sm sm:text-[0.95rem] leading-[1.68] text-[#050807] font-normal text-justify hyphens-auto">{c.desc}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-line/8 flex items-center justify-between">
                <span className="text-[11px] font-mono text-[var(--emerald-deep)] font-bold">
                  {c.badge}
                </span>
                <a
                  href={c.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#050807] hover:text-[var(--emerald-deep)] transition-colors"
                >
                  <span>{c.linkText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
