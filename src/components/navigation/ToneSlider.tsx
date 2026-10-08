"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import { Sun, Leaf } from "lucide-react";
import { setTone, toneName, TONE_DEFAULT, TONE_KEY } from "@/lib/tone";

/** Every slider and swatch on the page (header, menu, settings) stays in step. */
const EVENT = "sos-tone";

export function readTone() {
  try {
    const v = parseFloat(localStorage.getItem(TONE_KEY) ?? "");
    return Number.isNaN(v) ? TONE_DEFAULT : v;
  } catch {
    return TONE_DEFAULT;
  }
}

/** Set the tone everywhere: page colours, storage, every slider and swatch. */
export function chooseTone(v: number) {
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
}

/** Follow tone changes made by any slider or swatch. */
export function onTone(fn: (v: number) => void) {
  const on = (e: Event) => fn((e as CustomEvent<number>).detail);
  window.addEventListener(EVENT, on);
  return () => window.removeEventListener(EVENT, on);
}

/**
 * The colour slider: drag left for a lighter, whiter site, right for green,
 * the middle is the water blue. The tone belongs to the light theme, so
 * moving it while the dark theme is on switches back to light.
 */
export default function ToneSlider({
  compact = false,
  bare = false,
  className = "",
}: {
  compact?: boolean;
  /** no label and value: the surrounding panel shows them */
  bare?: boolean;
  className?: string;
}) {
  const [t, setT] = useState(TONE_DEFAULT);
  const id = useId();

  useEffect(() => {
    setT(readTone());
    return onTone(setT);
  }, []);

  const change = (raw: number) => {
    let v = raw;
    for (const anchor of [0, 50, 100]) if (Math.abs(v - anchor) <= 3) v = anchor;
    setT(v);
    chooseTone(v);
  };

  const labelled = !compact && !bare;

  return (
    <div className={`tone${compact ? " tone--compact" : ""} ${className}`}>
      {labelled && (
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
        aria-label={labelled ? undefined : "Farbe der Website: hell, Wasser oder grün"}
        aria-valuetext={toneName(t)}
        className="tone__range"
        style={{ "--tone-pos": `${t}%` } as CSSProperties}
      />
      <Leaf className="tone__i tone__i--leaf" aria-hidden="true" />
      {labelled && (
        <output htmlFor={id} className="tone__v">
          {toneName(t)}
        </output>
      )}
    </div>
  );
}
