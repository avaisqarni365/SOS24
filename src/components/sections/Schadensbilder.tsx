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
    <section id="leistungen" className="relative bg-landing-bone text-[#1A1D1B]">
      <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-32">
        {/* Section Eyebrow - Kontai24 Style */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-5 text-landing-emerald font-mono">
          {t("services.eyebrow")}
        </p>

        {/* Section Heading */}
        <h2 className="font-editorial font-normal tracking-[-0.02em] leading-[1.04] text-[2.25rem] sm:text-5xl lg:text-[3.5rem] text-[#1A1D1B]">
          {t("services.h1")}
          <br />
          <span className="italic text-landing-mint">{t("services.accent")}</span>
        </h2>

        {/* Section Lede */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-[#444945]">
          {t("services.sub")}
        </p>

        {/* Kontai24 3-Card Platform Grid */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.n}
              className="rounded-2xl p-7 border bg-white/60 border-black/5 hover:bg-white/80 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Emerald Dot Icon + Monospace Number */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-landing-emerald/10">
                    <span className="w-2 h-2 rounded-full bg-landing-emerald" />
                  </div>
                  <span className="font-mono text-xs text-black/25 font-bold">{c.n}</span>
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] mb-2 text-landing-emerald/80 font-mono">
                  {c.eyebrow}
                </p>
                <h3 className="font-editorial text-xl mb-3 text-[#1A1D1B] leading-snug">
                  {c.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#444945]">{c.desc}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-black/5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-landing-emerald font-semibold">
                  {c.badge}
                </span>
                <a
                  href={c.href}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1D1B] hover:text-landing-emerald transition-colors"
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
