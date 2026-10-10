"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** The small labels above headings that must stay on one line. */
const SELECTOR = ".sc-label, .hero-film__k";
/** never smaller than this, so a label stays readable */
const MIN_PX = 7.5;

/** Shrink one label (letter-spacing first, then size) until it fits its box. */
function fit(el: HTMLElement) {
  el.style.removeProperty("font-size");
  el.style.removeProperty("letter-spacing");
  const box = el.clientWidth;
  if (!box || el.scrollWidth <= box + 1) return;
  const cs = getComputedStyle(el);
  let size = parseFloat(cs.fontSize);
  let spacing = parseFloat(cs.letterSpacing) || 0;
  for (let i = 0; i < 16 && el.scrollWidth > box + 1; i++) {
    if (spacing > size * 0.04) spacing *= 0.75;
    else if (size > MIN_PX) size = Math.max(MIN_PX, size * 0.95);
    else break;
    // the stylesheet sets label sizes with !important, so the fit must too
    el.style.setProperty("letter-spacing", `${spacing.toFixed(2)}px`, "important");
    el.style.setProperty("font-size", `${size.toFixed(2)}px`, "important");
  }
}

/**
 * Keeps every small label on a single line: on narrow screens, or in a
 * longer translation, it tightens the label instead of letting it wrap.
 * Runs on load, when fonts arrive, on resize, after a page change and when
 * the language changes.
 */
export default function LabelFit() {
  const path = usePathname();
  useEffect(() => {
    let frame = 0;
    const run = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => document.querySelectorAll<HTMLElement>(SELECTOR).forEach(fit));
    };
    run();
    document.fonts?.ready.then(run);
    window.addEventListener("resize", run);
    // the page translation swaps the label texts in place
    const mo = new MutationObserver(run);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["lang", "data-text"] });
    const late = window.setTimeout(run, 1200);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", run);
      mo.disconnect();
      window.clearTimeout(late);
    };
  }, [path]);
  return null;
}
