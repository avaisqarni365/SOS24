"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    ScrollCraft?: { mount: (root: Element | Document | string) => unknown };
    __scMounted?: boolean;
  }
}

/**
 * Inline boot line. Rendered as the first thing in <body> on scroll pages so
 * html.sc-js is set before first paint. Without JS, or with reduced motion,
 * the class never lands and every section is a plain, complete document.
 */
export const SC_BOOT = `(function(){try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('sc-js')}}catch(e){}})();`;

/** Loads the scrollcraft engine after hydration and mounts it once. */
export default function ScrollEngine() {
  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("sc-js") || window.__scMounted) return;
    window.__scMounted = true;

    let mounted = false;
    let bailed = false;
    const bail = () => {
      bailed = true;
      html.classList.remove("sc-js");
    };
    const s = document.createElement("script");
    s.src = "/scrollcraft/scrollcraft.min.js";
    s.async = true;
    s.onload = () => {
      // Too late: the page already fell back to the static layout.
      if (bailed) return;
      try {
        window.ScrollCraft?.mount(document.body);
        mounted = true;
        window.dispatchEvent(new Event("sc:mounted"));
      } catch {
        bail();
      }
    };
    s.onerror = bail;
    document.body.appendChild(s);
    // Never leave content hidden behind an engine that did not arrive.
    const t = window.setTimeout(() => {
      if (!mounted) bail();
    }, 6000);
    return () => window.clearTimeout(t);
  }, []);

  return null;
}
