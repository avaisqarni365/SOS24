"use client";

import { useEffect } from "react";

const SELECTOR = "main h1, main h2, main .sc-display";

/** smallest sizes a heading may shrink to before it is allowed to wrap */
function minSize(el: HTMLElement) {
  const phone = window.innerWidth < 640;
  if (el.tagName === "H1") return phone ? 24 : 32;
  return phone ? 21 : 26;
}

// set with priority: several heading sizes in the stylesheet are !important
const set = (el: HTMLElement, prop: string, value: string | null) =>
  value === null ? el.style.removeProperty(prop) : el.style.setProperty(prop, value, "important");

function fit(el: HTMLElement) {
  set(el, "font-size", null);
  set(el, "white-space", null);
  const avail = el.clientWidth;
  if (!avail) return; // hidden (an inactive tab): fitted when shown
  set(el, "white-space", "nowrap");
  const natural = parseFloat(getComputedStyle(el).fontSize);
  const need = el.scrollWidth;
  if (need <= avail + 1) return; // already one line
  const size = Math.floor(natural * (avail / need) * 0.98);
  const min = minSize(el);
  if (size >= min) {
    set(el, "font-size", `${size}px`);
  } else {
    // too long for one line at a readable size: wrap, compactly
    set(el, "white-space", null);
    set(el, "font-size", `${Math.max(min, Math.min(natural, min * 1.15))}px`);
  }
}

/**
 * Every heading on one line: a heading that would wrap is set a little
 * smaller until it fits the column, down to a readable minimum; only a
 * heading too long even then wraps. Refits on resize, after the web fonts
 * load, and when the language changes the text.
 */
export default function HeadingFit() {
  useEffect(() => {
    let t = 0;
    const run = () => document.querySelectorAll<HTMLElement>(SELECTOR).forEach(fit);
    const later = () => {
      window.clearTimeout(t);
      t = window.setTimeout(run, 120);
    };
    run();
    document.fonts?.ready.then(run).catch(() => {});
    window.addEventListener("resize", later);
    window.addEventListener("sos-i18n", later);
    return () => {
      window.removeEventListener("resize", later);
      window.removeEventListener("sos-i18n", later);
      window.clearTimeout(t);
    };
  }, []);
  return null;
}
