"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import { Sun, Leaf } from "lucide-react";
import { setTone, toneName, TONE_DEFAULT, TONE_KEY } from "@/lib/tone";

/** Every slider on the page (header, menu, settings) stays in step. */
const EVENT = "sos-tone";

export function readTone() {
  try {
    const v = parseFloat(localStorage.getItem(TONE_KEY) ?? "");
    return Number.isNaN(v) ? TONE_DEFAULT : v;
  } catch {
    return TONE_DEFAULT;
  }
}

/**
 * The colour slider: drag left for a lighter, whiter site, right for green,
 * the middle is the water blue. The tone belongs to the light theme, so
 * moving it while the dark theme is on switches back to light.
 */
export default function ToneSlider({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const [t, setT] = useState(TONE_DEFAULT);
  const id = useId();

  useEffect(() => {
    setT(readTone());
    const on = (e: Event) => setT((e as CustomEvent<number>).detail);
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);

  const change = (raw: number) => {
    let v = raw;
    for (const anchor of [0, 50, 100]) if (Math.abs(v - anchor) <= 3) v = anchor;
    setT(v);
    const d = document.documentElement;
    if (d.getAttribute("data-theme") === "dark") {
      d.setAttribute("data-theme", "light");
      try {
        localStorage.removeItem("sos_theme");
      } catch {
        /* private mode */
      }
      window.dispatchEvent(new CustomEvent("sos-theme", { detail: "light" }));
    }
    setTone(v);
    try {
      if (v === TONE_DEFAULT) localStorage.removeItem(TONE_KEY);
      else localStorage.setItem(TONE_KEY, String(v));
    } catch {
      /* the choice lasts for this page view */
    }
    window.dispatchEvent(new CustomEvent(EVENT, { detail: v }));
  };

  return (
    <div className={`tone${compact ? " tone--compact" : ""} ${className}`}>
      {!compact && (
        <label htmlFor={id} className="tone__k">
          Farbe
        </label>
      )}
      <Sun className="tone__i" aria-hidden="true" />
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={t}
        onChange={(e) => change(Number(e.target.value))}
        aria-label={compact ? "Farbe der Website: hell, Wasser oder grün" : undefined}
        aria-valuetext={toneName(t)}
        className="tone__range"
        style={{ "--tone-pos": `${t}%` } as CSSProperties}
      />
      <Leaf className="tone__i tone__i--leaf" aria-hidden="true" />
      {!compact && (
        <output htmlFor={id} className="tone__v">
          {toneName(t)}
        </output>
      )}
    </div>
  );
}
