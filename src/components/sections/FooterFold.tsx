"use client";

import { useEffect } from "react";

/**
 * The footer's link groups are <details>, rendered open. On phones they fold
 * shut so the footer stays short; from 640px up they stay open and cannot be
 * closed, so they read as plain columns.
 */
export default function FooterFold() {
  useEffect(() => {
    const groups = Array.from(document.querySelectorAll<HTMLDetailsElement>(".site-footer__grp"));
    if (!groups.length) return;
    const phone = matchMedia("(max-width: 639px)");
    const apply = () => groups.forEach((g) => (g.open = !phone.matches));
    const keepOpen = (e: Event) => {
      const g = e.currentTarget as HTMLDetailsElement;
      if (!phone.matches && !g.open) g.open = true;
    };
    apply();
    phone.addEventListener("change", apply);
    groups.forEach((g) => g.addEventListener("toggle", keepOpen));
    return () => {
      phone.removeEventListener("change", apply);
      groups.forEach((g) => g.removeEventListener("toggle", keepOpen));
    };
  }, []);
  return null;
}
