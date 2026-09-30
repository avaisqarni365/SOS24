"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/i18n/LanguageContext";

export interface GalleryItem {
  id: string;
  category: "horizontal" | "keller" | "drainage" | "schimmel" | "team";
  title: string;
  subtitle: string;
  location: string;
  src: string;
  tag: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "shahzad-partner",
    category: "team",
    title: "SchimmelPeter® Partner Shahzad Mahmood",
    subtitle: "Zertifizierter Bautenschutz-Fachmann & persönlicher Ansprechpartner für Wuppertal und Bergisches Land",
    location: "Wuppertal (PLZ 42)",
    src: "/images/schimmelpeter/Shahzad-Mahmood-Portrait-envz3hq2tb08391.png",
    tag: "Fachpartner Vor Ort"
  },
  {
    id: "injektion-bohrloch",
    category: "horizontal",
    title: "WTA-Bohrlochinjektion Mauerwerk",
    subtitle: "Drucklose Injektion mit Silan-Mikroemulsion stoppt kapillare Feuchte auf molekularer Ebene",
    location: "Wuppertal-Elberfeld",
    src: "/images/schimmelpeter/horizontalsperre-defekt-mgxdk2ct6bn7gv9.webp",
    tag: "WTA-Merkblatt 4-4"
  },
  {
    id: "injektion-winkel",
    category: "horizontal",
    title: "Präzisions-Bohrlochreihe im 60°-Winkel",
    subtitle: "Saubere Ausführung von der Kellerinnenseite ohne Beschädigung von Vorgarten oder Pflaster",
    location: "Solingen-Ohligs",
    src: "/images/schimmelpeter/horizontalsperre-defekt-ch8xcbmpfwff2d9.jpg",
    tag: "100% Ohne Bagger"
  },
  {
    id: "kapillar-wirkprinzip",
    category: "horizontal",
    title: "Physikalisches Wirkprinzip Kapillarbrechung",
    subtitle: "Hydrophobierende Wirkstoffausbreitung im Porensystem verdrängt Restfeuchte dauerhaft",
    location: "Bauphysik / WTA",
    src: "/images/schimmelpeter/aufsteigende_feuchtigkeit_infografik-0k23t8ztbqck8y9.png",
    tag: "Infografik Verfahren"
  },
  {
    id: "keller-innenabdichtung",
    category: "keller",
    title: "Kellerinnenabdichtung & Hohlkehle",
    subtitle: "Mehrlagige mineralische Dichtungsschlämmen (MDS) gegen seitlich drückendes Schichtenwasser",
    location: "Remscheid-Lennep",
    src: "/images/schimmelpeter/feuchte-keller-sanieren-dpkjhcnbqzmdc99.jpg",
    tag: "Druckwasserdicht"
  },
  {
    id: "wand-sohle-anschluss",
    category: "keller",
    title: "Wand-Sohlen-Anschluss & Dichtkehle",
    subtitle: "Dauerhafte Rissüberbrückung und Abdichtung am kritischen Übergang zwischen Bodenplatte und Wand",
    location: "Wuppertal-Barmen",
    src: "/images/schimmelpeter/feuchte-keller-sanieren-hb6hbpvx68f8f9t.jpg",
    tag: "Hohlkehlensanierung"
  },
  {
    id: "gewoelbe-sanierputz",
    category: "keller",
    title: "Freigelegtes Kellergewölbe & Sanierputz",
    subtitle: "WTA-Sanierputzsystem nimmt schädliche Mauersalze auf und hält Oberflächen dauerhaft trocken",
    location: "Wuppertal-Cronenberg",
    src: "/images/schimmelpeter/feuchte-keller-sanieren-y66e6sqj82jqnp3.webp",
    tag: "Salzresistent"
  },
  {
    id: "drainage-fundament",
    category: "drainage",
    title: "Fundamentdrainage & Ringdrainage",
    subtitle: "Fachgerechte Verlegung von Dränrohren mit Filtervlies und Kiespackung zur Hangwasserableitung",
    location: "Velbert",
    src: "/images/schimmelpeter/installation_drainagesystem-pjxv3qtbk7szmt6.jpg",
    tag: "DIN 4095 Norm"
  },
  {
    id: "aussenwand-noppenbahn",
    category: "drainage",
    title: "Außenwandabdichtung & Noppenbahn",
    subtitle: "Zweikomponentige Dickbeschichtung mit mechanischem Schutz vor Erdreich und Wurzeln",
    location: "Haan (Bergisches Land)",
    src: "/images/schimmelpeter/unzureichende_drainage_sanieren-fq5g7d5876p88rm.jpg",
    tag: "Erdberührte Wand"
  },
  {
    id: "drainage-spuelschacht",
    category: "drainage",
    title: "Spülschacht- & Abflusseinbindung",
    subtitle: "Kontrollierte Ableitung von Stauwasser bei Hanglagen im steilen Bergischen Land",
    location: "Wuppertal-Vohwinkel",
    src: "/images/schimmelpeter/installation_drainagesystem-h11kfj7cbe5s3ad.webp",
    tag: "Wartungsschacht"
  },
  {
    id: "schimmel-ausbluehung",
    category: "schimmel",
    title: "Salzausblühungen & Schimmelursache",
    subtitle: "Messtechnische Erfassung von Bauteilfeuchte, Taupunkt und Schadstoffbelastung vor Ort",
    location: "Schadensdiagnostik",
    src: "/images/schimmelpeter/wand-schimmel-ausbluehungen-3h9beykc0x4a9hs.webp",
    tag: "Ursachenanalyse"
  },
  {
    id: "schimmel-neutralisation",
    category: "schimmel",
    title: "Porentiefe Sporenabtötung & Calciumsilikat",
    subtitle: "Sporensichere Dekontamination und diffusionsoffener Innenschutz ohne giftige Chlorchemie",
    location: "Wuppertal-Uellendahl",
    src: "/images/schimmelpeter/wand-schimmel-ausbluehungen-mxbkg45d06ys195.jpg",
    tag: "100% Chlorfrei"
  }
];

export default function PictureGallery() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: "all", label: t("gallery.filterAll") || "Alle Projekte" },
    { id: "horizontal", label: t("gallery.filterHorizontal") || "Horizontalsperre" },
    { id: "keller", label: t("gallery.filterKeller") || "Keller & Mauerwerk" },
    { id: "drainage", label: t("gallery.filterDrainage") || "Drainagesysteme" },
    { id: "schimmel", label: t("gallery.filterSchimmel") || "Schimmelbeseitigung" },
    { id: "team", label: t("gallery.filterTeam") || "Diagnose & Team" }
  ];

  const filteredItems = selectedCategory === "all"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") setActiveLightboxIndex(null);
      if (e.key === "ArrowRight") {
        setActiveLightboxIndex((prev) => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      }
      if (e.key === "ArrowLeft") {
        setActiveLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, filteredItems.length]);

  return (
    <section
      id="galerie"
      aria-label="Dokumentierte Sanierungsprojekte"
      className="relative py-24 md:py-32 bg-[#0E1310] border-t border-b border-white/[0.08] text-landing-bone overflow-hidden"
    >
      {/* Subtle Mint Ambient Radial Glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-landing-mint/[0.04] blur-[120px]" 
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-landing-mint/30 bg-landing-mint/10 px-3.5 py-1 text-xs font-mono font-medium tracking-wide text-landing-mint mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-landing-mint animate-pulse" />
            {t("gallery.eyebrow") || "PRAXIS & BILDGALERIE"}
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-white">
            {t("gallery.h1") || "Echte Sanierungsprojekte."}{" "}
            <span className="font-serif italic text-landing-mint block sm:inline">
              {t("gallery.accent") || "Dokumentierte Qualität vor Ort."}
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-white/60 leading-relaxed font-sans">
            {t("gallery.sub") ||
              "Einblicke in die handwerkliche Sanierungspraxis von SchimmelPeter® Fachpartner Shahzad Mahmood im Raum Wuppertal, Solingen, Remscheid und dem Bergischen Land."}
          </p>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 md:mb-14">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveLightboxIndex(null);
                }}
                className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-landing-mint text-[#0E1310] font-semibold shadow-[0_0_15px_rgba(98,196,172,0.4)]"
                    : "bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/10"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <article
              key={item.id}
              onClick={() => setActiveLightboxIndex(idx)}
              className="group relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#141B17] hover:border-landing-mint/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.6)] cursor-pointer flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/40">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#141B17] via-transparent to-black/20" />

                {/* Tag Pill Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                  <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-medium text-landing-mint border border-landing-mint/30 shadow-sm">
                    {item.tag}
                  </span>
                </div>

                <div className="absolute top-3 right-3 z-10">
                  <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-sans font-medium text-white/80 border border-white/10 shadow-sm flex items-center gap-1">
                    <svg className="w-3 h-3 text-landing-mint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {item.location}
                  </span>
                </div>

                {/* Hover Zoom Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-[2px]">
                  <div className="rounded-full bg-landing-mint/90 p-3 text-[#0E1310] shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Card Meta Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-sans font-semibold text-lg text-white group-hover:text-landing-mint transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-white/60 leading-relaxed font-sans line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/50">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-landing-mint/90">
                    <span className="h-1.5 w-1.5 rounded-full bg-landing-mint" />
                    {t("gallery.tagVerified") || "WTA-Geprüft"}
                  </span>
                  <span className="group-hover:text-landing-mint transition-colors font-medium">
                    {t("gallery.zoomHint") || "Vergrößern →"}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Banner with Shahzad Mahmood & SchimmelPeter Trust */}
        <div className="mt-12 md:mt-16 rounded-2xl border border-white/[0.08] bg-[#141B17] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden border-2 border-landing-mint/50">
              <Image
                src="/images/schimmelpeter/Shahzad-Mahmood-Portrait-envz3hq2tb08391.png"
                alt="Shahzad Mahmood"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-white font-semibold text-base sm:text-lg">
                Haben Sie ein feuchtes Mauerwerk oder Schimmelbefall?
              </div>
              <p className="text-xs sm:text-sm text-white/60">
                Herr Mahmood besichtigt Ihr Gebäude in Wuppertal, Solingen, Remscheid & Umgebung persönlich.
              </p>
            </div>
          </div>
          <a
            href="#kontakt"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-landing-mint px-6 py-3 text-xs sm:text-sm font-semibold text-[#0E1310] hover:bg-[#72D6BE] transition-all shadow-[0_0_20px_rgba(98,196,172,0.3)]"
          >
            Kostenlose Vor-Ort-Analyse
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && filteredItems[activeLightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setActiveLightboxIndex(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveLightboxIndex(null)}
            aria-label="Schließen"
            className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1
              );
            }}
            aria-label="Vorheriges Bild"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-black/60 p-3 text-white/80 hover:text-white hover:bg-black/90 transition-colors border border-white/10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveLightboxIndex((prev) =>
                prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0
              );
            }}
            aria-label="Nächstes Bild"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-black/60 p-3 text-white/80 hover:text-white hover:bg-black/90 transition-colors border border-white/10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image & Caption Container */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[60vh] rounded-xl overflow-hidden border border-white/10 bg-black">
              <Image
                src={filteredItems[activeLightboxIndex].src}
                alt={filteredItems[activeLightboxIndex].title}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-4 text-center max-w-2xl px-4">
              <div className="flex items-center justify-center gap-2 mb-1.5">
                <span className="font-mono text-xs text-landing-mint bg-landing-mint/10 border border-landing-mint/30 rounded-full px-2.5 py-0.5">
                  {filteredItems[activeLightboxIndex].tag}
                </span>
                <span className="text-white/40 text-xs">·</span>
                <span className="text-white/60 text-xs font-sans">
                  {filteredItems[activeLightboxIndex].location}
                </span>
                <span className="text-white/40 text-xs">·</span>
                <span className="font-mono text-xs text-white/50">
                  {activeLightboxIndex + 1} / {filteredItems.length}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-white">
                {filteredItems[activeLightboxIndex].title}
              </h4>
              <p className="mt-1 text-sm text-white/70">
                {filteredItems[activeLightboxIndex].subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
