"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Justified text needs a long line: below this width (in em of its own font size) it
    opens holes between words, so the block is set flush left instead. */
const MIN_EM = 30;
const SELECTOR = "main p, main li, main dd, main blockquote";

function fit(el: HTMLElement) {
  el.style.removeProperty("text-align");
  if (getComputedStyle(el).textAlign !== "justify") return;
  const size = parseFloat(getComputedStyle(el).fontSize) || 16;
  if (el.clientWidth / size < MIN_EM) {
    el.style.setProperty("text-align", "start", "important");
    return;
  }
  // justified and wide enough: it must be able to break long German words
  if (getComputedStyle(el).hyphens !== "auto") {
    el.style.setProperty("hyphens", "auto", "important");
    el.style.setProperty("-webkit-hyphens", "auto", "important");
  }
}

/**
 * Keeps justification where it reads well: wide text columns, with hyphenation. Cards,
 * narrow columns and phones get ragged-right text. Runs on load, when fonts arrive, on
 * resize, after a page change and when the language changes.
 */
export default function JustifyFit() {
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
