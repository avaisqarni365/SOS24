"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import AmbientGlow from "@/components/ui/AmbientGlow";
import { PROCESS_PIPELINE } from "@/data/content-data";
import { useLanguage } from "@/i18n/LanguageContext";

const WallInjection3D = dynamic(() => import("@/components/3d/WallInjection3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] bg-landing-ink2 border border-line/[0.08] rounded-3xl animate-pulse flex items-center justify-center text-landing-bone/50 font-mono text-xs">
      3D-Simulationsmodell wird initialisiert...
    </div>
  )
});

export default function InjectionProcess() {
  const { t } = useLanguage();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const isHovered = useRef(false);
  const isVisible = useRef(true);

  // Kontai24 automatic 2.4s step cycle
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovered.current && isVisible.current && !document.hidden) {
        setActiveStepIndex((prev) => (prev + 1) % PROCESS_PIPELINE.length);
      }
    }, 2400);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="3d-injektion" className="relative bg-landing-ink text-landing-bone overflow-hidden">
      <AmbientGlow />

      <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-32">
        {/* Section Header - Kontai24 Exact Style */}
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-5 text-landing-mint font-mono">
          {t("pipe.eyebrow")}
        </p>
        <h2 className="font-editorial font-normal tracking-[-0.02em] leading-[1.04] text-[2.25rem] sm:text-5xl lg:text-[3.5rem] text-landing-bone">
          {t("pipe.h1")}
          <br />
          <span className="italic text-landing-mint">{t("pipe.accent")}</span>
        </h2>
        <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-landing-bone/70">
          {t("pipe.sub")}
        </p>

        {/* Scroll-Driven Pinned 3D Visualizer Model */}
        <div className="mt-14 mb-20">
          <WallInjection3D />
        </div>

        {/* 4 Steps - Kontai24 Exact Interactive Step Grid */}
        <div className="mt-16 pt-12 border-t border-line/[0.08]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] mb-3 text-landing-emerald font-mono">
            {t("pipe.secSub")}
          </p>
          <h3 className="font-editorial font-normal text-2xl sm:text-4xl text-landing-bone mb-12">
            {t("pipe.secH3")}
          </h3>

          <ol className="grid gap-px overflow-hidden rounded-2xl border border-line/10 bg-line/10 sm:grid-cols-2">
            {PROCESS_PIPELINE.map((p, idx) => {
              const isActive = idx === activeStepIndex;
              return (
                <li
                  key={p.step}
                  onMouseEnter={() => {
                    isHovered.current = true;
                    setActiveStepIndex(idx);
                  }}
                  onMouseLeave={() => {
                    isHovered.current = false;
                  }}
                  aria-current={isActive ? "step" : undefined}
                  className={`flex flex-col p-7 transition-colors duration-500 sm:p-8 cursor-pointer ${
                    isActive
                      ? "bg-landing-ink2 ring-1 ring-inset ring-landing-mint/40"
                      : "bg-landing-ink2 hover:bg-landing-ink3"
                  }`}
                >
                  <p
                    className={`font-editorial tabular-nums leading-none transition-colors duration-500 ${
                      isActive ? "text-landing-mint" : "text-landing-bone/60"
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl">0{p.step}</span>
                    <span className="text-xs uppercase tracking-[0.18em] text-landing-bone/40 ml-2 font-mono">
                      / 04
                    </span>
                  </p>

                  <span className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-landing-mint font-mono">
                    Phase {p.step}
                  </span>

                  <h4 className="mt-2 font-editorial text-xl leading-snug text-landing-bone">
                    {p.title}
                  </h4>

                  <p className="mt-3 text-sm leading-relaxed text-landing-bone/80">
                    {p.desc}
                  </p>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-line/5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-mono transition-colors duration-500 ${
                        isActive
                          ? "border border-landing-mint/60 bg-landing-mint/20 text-landing-mint"
                          : "border border-landing-mint/25 bg-landing-mint/10 text-landing-mint/80"
                      }`}
                    >
                      ⏱ {p.time}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-12 text-center">
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-ink bg-landing-bone hover:bg-surface transition-all shadow-sm active:scale-[0.98]"
            >
              <span>{t("pipe.btn")}</span>
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
