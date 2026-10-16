"use client";

import { useEffect, useRef, useState } from "react";
import { SunMoon, Sun, Moon, Monitor, Palette, Contrast, Type } from "lucide-react";
import ColorControl, { onColor } from "@/components/navigation/ColorControl";
import { colorName, readColor, COLOR_DEFAULT, type ColorChoice } from "@/lib/tone";

type Theme = "light" | "dark" | "auto";
type TextSize = "md" | "lg" | "xl";

/** Script for <head>: applies the stored choice before first paint, so the
    page never flashes in the wrong theme or text size. */
// White is the default on every device; dark only when the visitor picks it.
// "Auto" follows the device's light/dark setting, also when it changes later
// (the boot script listens for that while "auto" is stored).
export const APPEARANCE_BOOT = `(function(){var d=document.documentElement;d.setAttribute('data-theme','light');try{var t=localStorage.getItem('sos_theme'),z=localStorage.getItem('sos_text'),m=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)');var a=function(){d.setAttribute('data-theme',m&&m.matches?'dark':'light')};if(t==='dark')d.setAttribute('data-theme','dark');else if(t==='auto')a();if(m){var f=function(){try{if(localStorage.getItem('sos_theme')==='auto')a()}catch(e){}};m.addEventListener?m.addEventListener('change',f):m.addListener(f)}if(z==='lg'||z==='xl')d.setAttribute('data-text',z)}catch(e){}})();`;

const THEMES: { id: Theme; label: string; Icon: typeof Sun }[] = [
  { id: "light", label: "Hell", Icon: Sun },
  { id: "dark", label: "Dunkel", Icon: Moon },
  { id: "auto", label: "Auto", Icon: Monitor },
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

/** "Ansicht": colour, light or dark, and three text sizes. */
export default function AppearanceMenu() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [size, setSize] = useState<TextSize>("md");
  const [color, setColorState] = useState<ColorChoice>(COLOR_DEFAULT);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = document.documentElement;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("sos_theme");
    } catch {
      /* private mode */
    }
    setTheme(stored === "dark" || stored === "auto" ? stored : "light");
    const z = d.getAttribute("data-text");
    setSize(z === "lg" || z === "xl" ? z : "md");
    setColorState(readColor());
    return onColor(setColorState);
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
    save("sos_theme", t === "light" ? null : t);
    const deviceDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    d.setAttribute("data-theme", t === "auto" ? (deviceDark ? "dark" : "light") : t);
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
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] bg-surface text-ink hover:border-accent-deep shadow-2xs transition-colors"
        title="Ansicht: Farbe, Hell/Dunkel und Schriftgröße"
      >
        <SunMoon className="h-5 w-5" aria-hidden="true" />
        <span className="visually-hidden">Ansicht anpassen</span>
      </button>
      {open && (
        <div id="appearance-panel" className="ap" role="dialog" aria-label="Ansicht anpassen">
          <p className="ap__title">Ansicht</p>

          <section className="ap__sec" aria-labelledby="ap-colour">
            <div className="ap__row">
              <span id="ap-colour" className="ap__k">
                <Palette aria-hidden="true" /> Farbe
              </span>
              <span className="ap__v">{colorName(color)}</span>
            </div>
            <ColorControl className="ap__color" />
            <p className="ap__hint">Der Hintergrund bleibt hell, die Farbe zeigt sich in Akzenten, Knöpfen und Symbolen. Im dunklen Modus färbt sie die Schrift-Akzente.</p>
          </section>

          <section className="ap__sec" aria-labelledby="ap-theme">
            <span id="ap-theme" className="ap__k">
              <Contrast aria-hidden="true" /> Darstellung
            </span>
            <div className="ap-seg" role="group" aria-labelledby="ap-theme">
              {THEMES.map(({ id, label, Icon }) => (
                <button key={id} type="button" aria-pressed={theme === id} onClick={() => pickTheme(id)}>
                  <Icon aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className="ap__sec" aria-labelledby="ap-size">
            <span id="ap-size" className="ap__k">
              <Type aria-hidden="true" /> Schriftgröße
            </span>
            <div className="ap-seg ap-seg--size" role="group" aria-labelledby="ap-size">
              {SIZES.map((z, i) => (
                <button key={z.id} type="button" aria-pressed={size === z.id} aria-label={z.label} onClick={() => pickSize(z.id)}>
                  <span style={{ fontSize: `${0.9 + i * 0.16}rem` }}>{z.scale}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
