"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import { Palette, Pipette } from "lucide-react";
import { applyColor, colorName, hexFromHue, hueOf, PRESET_HUE, readColor, storeColor, COLOR_DEFAULT, type ColorChoice } from "@/lib/tone";

/** Every control on the page (header, menu, panel) stays in step. */
const EVENT = "sos-color";

/** Set the colour everywhere: page, storage, every control. */
export function chooseColor(c: ColorChoice) {
  applyColor(c);
  storeColor(c);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: c }));
}

/** Follow colour changes made by any control. */
export function onColor(fn: (c: ColorChoice) => void) {
  const on = (e: Event) => fn((e as CustomEvent<ColorChoice>).detail);
  window.addEventListener(EVENT, on);
  return () => window.removeEventListener(EVENT, on);
}

const SWATCHES = [
  { id: "water", label: "Wasser" },
  { id: "green", label: "Grün" },
  { id: "red", label: "Rot" },
] as const;

/** the slider snaps to a preset within a few degrees of it */
function fromSlider(h: number): ColorChoice {
  for (const [id, ph] of Object.entries(PRESET_HUE)) {
    const d = Math.min(Math.abs(h - ph), 360 - Math.abs(h - ph));
    if (d <= 5) return id;
  }
  return hexFromHue(h);
}

/**
 * The colour of the site: Wasser, Grün, Rot, or any colour (the wheel
 * slider or the colour picker). `compact` is the slider alone, for the
 * header bar.
 */
export default function ColorControl({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  const [c, setC] = useState<ColorChoice>(COLOR_DEFAULT);
  const id = useId();

  useEffect(() => {
    setC(readColor());
    return onColor(setC);
  }, []);

  const pick = (next: ColorChoice) => {
    setC(next);
    chooseColor(next);
  };
  const custom = c.startsWith("#") ? c : hexFromHue(hueOf(c));

  const slider = (
    <span className="hue">
      {compact ? <Palette className="hue__i" aria-hidden="true" /> : null}
      <input
        id={id}
        type="range"
        min={0}
        max={359}
        step={1}
        value={hueOf(c)}
        onChange={(e) => pick(fromSlider(Number(e.target.value)))}
        aria-label={`Farbe der Website wählen, jetzt: ${colorName(c)}`}
        className="hue__range"
        style={{ "--hue-pos": `${(hueOf(c) / 359) * 100}%` } as CSSProperties}
      />
    </span>
  );

  if (compact) return <div className={`hue-wrap hue-wrap--compact ${className}`}>{slider}</div>;

  return (
    <div className={`hue-wrap ${className}`}>
      <div className="hue-swatches" role="group" aria-label="Farbe der Website">
        {SWATCHES.map((s) => (
          <button key={s.id} type="button" className="hue-swatch" aria-pressed={c === s.id} onClick={() => pick(s.id)}>
            <span className={`hue-swatch__dot hue-swatch__dot--${s.id}`} aria-hidden="true" />
            {s.label}
          </button>
        ))}
        <label className="hue-swatch hue-swatch--custom" data-on={c.startsWith("#") ? "" : undefined}>
          <span className="hue-swatch__dot hue-swatch__dot--custom" style={{ background: custom }} aria-hidden="true">
            <Pipette aria-hidden="true" />
          </span>
          Eigene
          <input type="color" value={custom} onChange={(e) => pick(e.target.value.toLowerCase())} aria-label="Eigene Farbe wählen" />
        </label>
      </div>
      {slider}
    </div>
  );
}
