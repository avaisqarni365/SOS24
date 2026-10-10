"use client";

import { useEffect, useRef } from "react";

const WIDE = { src: "/media/hero-cine-wide.mp4", poster: "/media/hero-cine-wide.webp" };
const TALL = { src: "/media/hero-cine-tall.mp4", poster: "/media/hero-cine-tall.webp" };
/** portrait phones get the tall cut, everything else the wide one */
const PORTRAIT = "(max-aspect-ratio: 4/5)";

/**
 * The cinematic first frame: the image film runs silently behind the hero
 * heading, under a dark shade so the type reads. Landscape screens get the
 * wide cut (blurred backdrop, the sharp clip in the right third), portrait
 * phones the tall one; turning a tablet swaps them. Visitors who ask for
 * reduced motion or less data see the still frame only. Decorative: the
 * facts and contact options are in the copy beside it.
 */
export default function HeroCine() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const mq = window.matchMedia(PORTRAIT);
    // the file is chosen here, not with <source media>, which older Safari and Chrome ignore
    const load = () => {
      const cut = mq.matches ? TALL : WIDE;
      v.poster = cut.poster;
      if (reduce || saveData) return;
      if (!v.src.endsWith(cut.src)) {
        v.src = cut.src;
        v.play().catch(() => {
          /* autoplay refused: the poster stays */
        });
      }
    };
    load();
    mq.addEventListener?.("change", load);
    return () => mq.removeEventListener?.("change", load);
  }, []);

  return (
    <div className="hero-cine" aria-hidden="true">
      <video ref={ref} className="hero-cine__v" muted loop playsInline autoPlay preload="none" poster={WIDE.poster} />
      <div className="hero-cine__shade" />
    </div>
  );
}
