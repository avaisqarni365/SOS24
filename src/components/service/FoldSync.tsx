"use client";

import { useEffect } from "react";

/**
 * Opens a folded chapter (ChapterFold) when a link or the address bar points
 * at it or at anything inside it, and tells the scroll scenes and models to
 * measure again once a fold opens or closes.
 */
export default function FoldSync() {
  useEffect(() => {
    const folds = Array.from(document.querySelectorAll<HTMLElement>(".svc-fold-wrap"));
    if (!folds.length) return;
    /** opens the fold around the hash target; returns that target if a fold had to open */
    const openFor = (hash: string) => {
      if (!hash || hash.length < 2) return null;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      const wrap = target?.closest<HTMLElement>(".svc-fold-wrap");
      const d = wrap?.querySelector<HTMLDetailsElement>("details[data-fold]");
      if (!d || d.open) return null;
      d.open = true;
      return target;
    };
    const remeasure = () => requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    // the page grows as the fold opens, which cancels the browser's own jump:
    // open first, then scroll once the new layout stands
    const scrollTo = (el: HTMLElement) =>
      requestAnimationFrame(() => requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "start" })));
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.pathname !== location.pathname) return;
      const target = openFor(a.hash);
      if (!target) return;
      e.preventDefault();
      history.pushState(null, "", a.hash);
      scrollTo(target);
    };
    const onHash = () => {
      const t = openFor(location.hash);
      if (t) scrollTo(t);
    };
    onHash();
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHash);
    const details = folds.map((w) => w.querySelector<HTMLDetailsElement>("details[data-fold]")).filter(Boolean) as HTMLDetailsElement[];
    details.forEach((d) => d.addEventListener("toggle", remeasure));
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHash);
      details.forEach((d) => d.removeEventListener("toggle", remeasure));
    };
  }, []);
  return null;
}
