"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** What fades up: each section's heading block and its main content blocks. */
const SELECTOR = [
  "main .sc-section > .sc-wrap > *",
  "main section > .sc-wrap > *",
  "main .steps4__list > li",
  "main .services-grid > li",
  "main .more__grid > li",
].join(", ");

/**
 * Apple-style scroll reveal: content below the fold fades and rises into
 * place once, as it enters the view. Content that is already visible on
 * load, keyboard focus and "reduce motion" are never held back, and
 * without JavaScript nothing is hidden at all.
 */
export default function Reveal() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("rv-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const fold = window.innerHeight;
    const seen = new Set<Element>();
    document.querySelectorAll<HTMLElement>(SELECTOR).forEach((el) => {
      if (seen.has(el) || el.closest(".hero, .rv")) return;
      seen.add(el);
      if (el.getBoundingClientRect().top < fold) return; // already in view: no animation
      // siblings in a row arrive one after another
      const i = Array.prototype.indexOf.call(el.parentElement?.children ?? [], el);
      el.style.setProperty("--rv-delay", `${Math.min(i, 5) * 70}ms`);
      el.classList.add("rv");
      io.observe(el);
    });
    return () => io.disconnect();
  }, [path]);
  return null;
}
