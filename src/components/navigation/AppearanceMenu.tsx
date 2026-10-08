"use client";

import { useEffect, useRef, useState } from "react";
import { SunMoon, Sun, Moon, Monitor, Type } from "lucide-react";
import ToneSlider, { readTone } from "@/components/navigation/ToneSlider";
import { setTone } from "@/lib/tone";

type Theme = "light" | "dark" | "auto";
type TextSize = "md" | "lg" | "xl";

/** Script for <head>: applies the stored choice before first paint, so the
    page never flashes in the wrong theme or text size. */
// White is the default on every device; dark only when the visitor picks it
// ("auto" follows the device, and only when chosen).
export const APPEARANCE_BOOT = `(function(){var d=document.documentElement;d.setAttribute('data-theme','light');try{var t=localStorage.getItem('sos_theme'),z=localStorage.getItem('sos_text');if(t==='dark')d.setAttribute('data-theme','dark');else if(t==='auto')d.removeAttribute('data-theme');if(z==='lg'||z==='xl')d.setAttribute('data-text',z)}catch(e){}})();`;

const THEMES: { id: Theme; label: string; Icon: typeof Sun }[] = [
  { id: "light", label: "Hell", Icon: Sun },
  { id: "dark", label: "Dunkel", Icon: Moon },
  { id: "auto", label: "Automatisch", Icon: Monitor },
];
const SIZES: { id: TextSize; label: string; scale: string }[] = [
  { id: "md", label: "Normal", scale: "A" },
  { id: "lg", label: "Groß", scale: "A+" },
  { id: "xl", label: "Sehr groß", scale: "A++" },
];

function save(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* private mode: the choice lasts for this page view */
  }
}

/** "Ansicht": light, dark or automatic theme and three text sizes. */
export default function AppearanceMenu() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [size, setSize] = useState<TextSize>("md");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = document.documentElement;
    const t = d.getAttribute("data-theme");
    setTheme(t === "light" || t === "dark" ? t : "auto");

    const z = d.getAttribute("data-text");
    setSize(z === "lg" || z === "xl" ? z : "md");

    // the colour slider switches dark back to light; follow it
    const onTheme = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    window.addEventListener("sos-theme", onTheme);
    return () => window.removeEventListener("sos-theme", onTheme);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pickTheme = (t: Theme) => {
    setTheme(t);
    const d = document.documentElement;
    if (t === "auto") d.removeAttribute("data-theme");
    else d.setAttribute("data-theme", t);
    save("sos_theme", t === "light" ? null : t);
    // the colour tone belongs to the light theme only
    setTone(t === "dark" ? 50 : readTone());
  };
  const pickSize = (z: TextSize) => {
    setSize(z);
    const d = document.documentElement;
    if (z === "md") d.removeAttribute("data-text");
    else d.setAttribute("data-text", z);
    save("sos_text", z === "md" ? null : z);
  };

  return (
    <div className="relative" ref={box}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="appearance-panel"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line/15 bg-surface text-ink hover:border-accent-deep shadow-2xs transition-colors"
        title="Ansicht: Farbe, Hell/Dunkel und Schriftgröße"
      >
        <SunMoon className="h-5 w-5" aria-hidden="true" />
        <span className="visually-hidden">Ansicht anpassen</span>
      </button>
      {open && (
        <div
          id="appearance-panel"
          className="absolute right-0 top-[calc(100%+0.6rem)] z-[60] w-[17.5rem] max-sm:fixed max-sm:inset-x-3 max-sm:top-[4.4rem] max-sm:w-auto surface-pop rounded-2xl p-4"
        >
          <ToneSlider className="tone--panel" />
          <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-wider text-ink font-bold">Darstellung</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5" role="group" aria-label="Darstellung">
            {THEMES.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={theme === id}
                onClick={() => pickTheme(id)}
                className={`flex min-h-[3.5rem] flex-col items-center justify-center gap-1 rounded-xl border text-[0.72rem] font-semibold transition-all ${
                  theme === id ? "btn-shine border-transparent shadow-sm" : "border-line/15 bg-surface-2 text-ink hover:border-accent-deep hover:bg-surface"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-ink font-bold">
            <Type className="h-3.5 w-3.5" aria-hidden="true" /> Schriftgröße
          </p>
          <div className="mt-2 grid grid-cols-3 gap-1.5" role="group" aria-label="Schriftgröße">
            {SIZES.map((z, i) => (
              <button
                key={z.id}
                type="button"
                aria-pressed={size === z.id}
                aria-label={z.label}
                onClick={() => pickSize(z.id)}
                className={`min-h-[3rem] rounded-xl border font-semibold transition-all ${
                  size === z.id ? "btn-shine border-transparent shadow-sm" : "border-line/15 bg-surface-2 text-ink hover:border-accent-deep hover:bg-surface"
                }`}
                style={{ fontSize: `${0.85 + i * 0.18}rem` }}
              >
                {z.scale}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
