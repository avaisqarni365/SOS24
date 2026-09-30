"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ScrollSectionRail() {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<string>("top");

  const sectionStops = [
    { id: "top", label: t("rail.start") || "Start" },
    { id: "leistungen", label: t("nav.services") || "Leistungen" },
    { id: "3d-injektion", label: t("nav.process3d") || "3D-Verfahren" },
    { id: "zertifizierung", label: t("rail.warranty") || "Garantie" },
    { id: "galerie", label: t("nav.gallery") || "Galerie" },
    { id: "rechner", label: t("rail.calc") || "Rechner" },
    { id: "servicegebiet", label: t("rail.region") || "PLZ 42" },
    { id: "faq", label: "FAQ" },
    { id: "kontakt", label: t("rail.contact") || "Kontakt" }
  ];

  useEffect(() => {
    const elements = sectionStops.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -30% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0]
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Seitenabschnitte"
      className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 lg:block select-none"
    >
      {/* High-Contrast Frosted Glass Dock - 100% Readable Over Light & Dark Backgrounds */}
      <div className="rounded-2xl bg-[#0E1310]/90 backdrop-blur-2xl border border-white/15 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
        <ul className="flex flex-col gap-1.5">
          {sectionStops.map((stop) => {
            const isActive = activeId === stop.id;
            return (
              <li key={stop.id}>
                <a
                  href={`#${stop.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`group flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl text-[11px] font-mono transition-all duration-200 ${
                    isActive
                      ? "bg-landing-mint text-[#0E1310] font-semibold shadow-[0_0_14px_rgba(98,196,172,0.45)]"
                      : "text-white/70 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  <span className="whitespace-nowrap tracking-wide">
                    {stop.label}
                  </span>

                  <span
                    className={`block rounded-full transition-all duration-200 ${
                      isActive
                        ? "h-2 w-2 bg-[#0E1310] ring-2 ring-[#0E1310]/40"
                        : "h-1.5 w-1.5 bg-white/40 group-hover:bg-landing-mint group-hover:scale-125"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
