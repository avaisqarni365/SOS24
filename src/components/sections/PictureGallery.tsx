"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { GALLERY, type GalleryCategory } from "@/data/gallery";

/**
 * Photo gallery with category filters and a lightbox (keyboard: Esc, arrows).
 * Captions come from src/data/gallery.ts; UI labels are translated.
 */
export default function PictureGallery({ hideHeader = false }: { hideHeader?: boolean }) {
  const { t } = useLanguage();
  const [category, setCategory] = useState<"all" | GalleryCategory>("all");
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const categories: { id: "all" | GalleryCategory; label: string }[] = [
    { id: "all", label: t("gallery.filterAll") },
    { id: "horizontal", label: t("gallery.filterHorizontal") },
    { id: "keller", label: t("gallery.filterKeller") },
    { id: "drainage", label: t("gallery.filterDrainage") },
    { id: "schimmel", label: t("gallery.filterSchimmel") },
    { id: "team", label: t("gallery.filterTeam") },
  ];
  const items = category === "all" ? GALLERY : GALLERY.filter((i) => i.category === category);

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const cur = open === null ? null : items[open];

  return (
    <section id="galerie" className="sc-section bg-white" aria-labelledby="galerie-title">
      <div className="sc-wrap">
        {!hideHeader && (
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end mb-10">
            <div>
              <p className="sc-label text-[#0f5c49] font-bold">{t("gallery.eyebrow")}</p>
              <h2 id="galerie-title" className="sc-display mt-3 text-4xl sm:text-5xl lg:text-6xl text-[#0b0f0d]">
                {t("gallery.h1")} <em className="text-[var(--brick)]">{t("gallery.accent")}</em>
              </h2>
            </div>
            <p className="sc-body text-[#0b0f0d] font-medium">{t("gallery.sub")}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2" role="group" aria-label={t("gallery.eyebrow")}>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={category === c.id}
              onClick={() => {
                setCategory(c.id);
                setOpen(null);
              }}
              className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold transition-all ${
                category === c.id
                  ? "border-transparent bg-[var(--grad)] text-white shadow-sm"
                  : "border-line/15 bg-white text-[#0b0f0d] hover:border-[var(--emerald-deep)] hover:bg-[#f7faf9]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setOpen(i);
                }}
                className="group flex h-full w-full flex-col overflow-hidden rounded-[26px] border border-line/12 bg-white p-3 text-left shadow-sm hover:border-[var(--emerald-deep)] hover:shadow-md transition-all"
                aria-label={`${it.title}: ${t("gallery.zoomHint")}`}
              >
                <span className="relative block aspect-[16/11] overflow-hidden rounded-[18px] bg-[#f7faf9] border border-black/5">
                  <img
                    src={it.src}
                    srcSet={it.src2x ? `${it.src} ${it.w}w, ${it.src2x} 960w` : undefined}
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                    width={it.w}
                    height={it.h}
                    alt={it.alt}
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full transition-transform duration-500 ease-out group-hover:scale-105 ${
                      it.category === "team" ? "object-cover object-top bg-white" : "object-cover"
                    }`}
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/94 px-3 py-1 font-sans text-xs font-bold text-[#050807] shadow-sm backdrop-blur-md border border-black/5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--mint)]" />
                    {it.tag}
                  </span>
                </span>
                <span className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
                  <span className="font-editorial text-2xl leading-tight text-[#050807] font-bold">{it.title}</span>
                  <span className="text-sm leading-relaxed text-[#0b0f0d] font-medium">{it.text}</span>
                  <span className="mt-auto flex items-center justify-between pt-3 font-mono text-[0.72rem] text-[#0b0f0d] font-semibold border-t border-line/8">
                    <span>Foto: SchimmelPeter®</span>
                    <span className="text-[#0f5c49] font-bold">{t("gallery.zoomHint")} →</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {cur && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="galerie-dialog-title"
          className="theme-dark fixed inset-0 z-[70] flex items-center justify-center bg-[#0e1310]/95 p-4 backdrop-blur-sm sm:p-8"
          onClick={close}
        >
          <div className="relative flex w-full max-w-4xl flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={cur.src2x ?? cur.src}
              width={cur.src2x ? 960 : cur.w}
              height={cur.src2x ? Math.round((960 / cur.w) * cur.h) : cur.h}
              alt={cur.alt}
              className="max-h-[68vh] w-auto rounded-xl border border-line/10 object-contain"
              style={{ maxWidth: `min(100%, ${(cur.src2x ? 960 : cur.w) * 1.6}px)` }}
            />
            <div className="max-w-2xl text-center">
              <p className="font-mono text-xs text-[var(--sc-ink-soft)]">
                {cur.tag} · {open! + 1} / {items.length} · Foto: SchimmelPeter®
              </p>
              <h3 id="galerie-dialog-title" className="mt-1 font-editorial text-2xl text-[var(--bone)]">
                {cur.title}
              </h3>
              <p className="mt-1 text-sm text-[var(--sc-ink-soft)]">{cur.text}</p>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => step(-1)} className="min-h-[44px] rounded-full border border-line/20 px-5 text-sm" aria-label="Vorheriges Bild">
                ←
              </button>
              <button ref={closeRef} type="button" onClick={close} className="min-h-[44px] rounded-full bg-[var(--bone)] px-5 text-sm font-semibold text-[var(--ink)]">
                {t("gallery.modalClose")}
              </button>
              <button type="button" onClick={() => step(1)} className="min-h-[44px] rounded-full border border-line/20 px-5 text-sm" aria-label="Nächstes Bild">
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
