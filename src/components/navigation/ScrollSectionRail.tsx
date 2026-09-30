"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ScrollSectionRail() {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<string>("top");

  // Anchors of the scroll-site homepage, in page order
  const sectionStops = [
    { id: "top", label: t("rail.start") || "Start" },
    { id: "schicht-fuer-schicht", label: t("rail.layers") || "3D-Wand" },
    { id: "leistungen", label: t("nav.services") || "Leistungen" },
    { id: "nachweis", label: t("rail.proof") || "Nachweis" },
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

  // A slim dot rail inside the page margin: it never covers content. The
  // label of each stop shows on hover and keyboard focus.
  return (
    <nav aria-label="Seitenabschnitte" className="section-rail theme-dark">
      <ul>
        {sectionStops.map((stop) => {
          const isActive = activeId === stop.id;
          return (
            <li key={stop.id}>
              <a href={`#${stop.id}`} aria-current={isActive ? "true" : undefined} className="section-rail__stop">
                <span className="section-rail__label">{stop.label}</span>
                <span className="section-rail__dot" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
