"use client";

import React, { useEffect, useState } from "react";

interface SectionStop {
  id: string;
  label: string;
}

const SECTION_STOPS: SectionStop[] = [
  { id: "top", label: "Start" },
  { id: "leistungen", label: "Fachleistungen" },
  { id: "3d-injektion", label: "3D-Verfahren" },
  { id: "zertifizierung", label: "WTA & Garantie" },
  { id: "rechner", label: "Kostenrechner" },
  { id: "servicegebiet", label: "Servicegebiet 42" },
  { id: "faq", label: "Häufige Fragen" },
  { id: "kontakt", label: "Kontakt" }
];

export default function ScrollSectionRail() {
  const [activeId, setActiveId] = useState<string>("top");
  const [isLightSection, setIsLightSection] = useState<boolean>(false);

  const lightSections = new Set(["leistungen", "zertifizierung", "rechner", "faq", "kontakt"]);

  useEffect(() => {
    const elements = SECTION_STOPS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          const currentId = visible.target.id;
          setActiveId(currentId);
          setIsLightSection(lightSections.has(currentId));
        }
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.05, 0.2, 0.5, 0.8, 1.0]
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Seitenabschnitte"
      className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 lg:block select-none"
    >
      <ul className="flex flex-col items-end gap-3.5">
        {SECTION_STOPS.map((stop) => {
          const isActive = activeId === stop.id;
          return (
            <li key={stop.id}>
              <a
                href={`#${stop.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center justify-end gap-2.5 py-1 px-1"
              >
                {/* Expanding Pill Badge with Adaptive Contrast */}
                <span
                  className={`whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-medium backdrop-blur-md transition-all duration-300 font-mono shadow-sm ${
                    isActive
                      ? "bg-landing-ink text-landing-mint border border-landing-mint/40 opacity-100 translate-x-0"
                      : isLightSection
                      ? "bg-white/80 text-[#1A1D1B] border border-black/10 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                      : "bg-landing-ink/80 text-landing-bone border border-white/10 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  }`}
                >
                  {stop.label}
                </span>

                {/* Point / Indicator Dot */}
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-2.5 w-2.5 bg-landing-mint shadow-[0_0_12px_rgba(98,196,172,0.9)] ring-2 ring-landing-mint/30"
                      : isLightSection
                      ? "h-1.5 w-1.5 bg-black/30 group-hover:bg-black/70 group-hover:scale-125"
                      : "h-1.5 w-1.5 bg-white/30 group-hover:bg-white/80 group-hover:scale-125"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
