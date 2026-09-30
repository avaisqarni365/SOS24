"use client";

import { useEffect, useRef, useState } from "react";
import { SunMoon, Sun, Moon, Monitor, Type } from "lucide-react";

type Theme = "light" | "dark" | "auto";
type TextSize = "md" | "lg" | "xl";

/** Script for <head>: applies the stored choice before first paint, so the
    page never flashes in the wrong theme or text size. */
export const APPEARANCE_BOOT = `(function(){try{var d=document.documentElement,t=localStorage.getItem('sos_theme'),z=localStorage.getItem('sos_text');if(t==='light'||t==='dark')d.setAttribute('data-theme',t);if(z==='lg'||z==='xl')d.setAttribute('data-text',z)}catch(e){}})();`;

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
  const [theme, setTheme] = useState<Theme>("auto");
  const [size, setSize] = useState<TextSize>("md");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = document.documentElement;
    const t = d.getAttribute("data-theme");
    setTheme(t === "light" || t === "dark" ? t : "auto");
    const z = d.getAttribute("data-text");
    setSize(z === "lg" || z === "xl" ? z : "md");
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
    save("sos_theme", t === "auto" ? null : t);
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
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line/15 text-[var(--bone)] hover:border-[var(--mint)]"
        title="Ansicht: Hell/Dunkel und Schriftgröße"
      >
        <SunMoon className="h-5 w-5" aria-hidden="true" />
        <span className="visually-hidden">Ansicht anpassen</span>
      </button>
      {open && (
        <div
          id="appearance-panel"
          className="absolute right-0 top-[calc(100%+0.6rem)] z-[60] w-[17.5rem] max-sm:fixed max-sm:inset-x-3 max-sm:top-[4.4rem] max-sm:w-auto rounded-2xl border border-line/15 bg-[var(--ink-2)] p-4 text-[var(--bone)] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)]"
        >
          <p className="font-mono text-[0.68rem] uppercase tracking-wider text-[var(--sc-ink-soft)]">Darstellung</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5" role="group" aria-label="Darstellung">
            {THEMES.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={theme === id}
                onClick={() => pickTheme(id)}
                className={`flex min-h-[3.5rem] flex-col items-center justify-center gap-1 rounded-xl border text-[0.72rem] font-semibold ${
                  theme === id ? "border-[var(--mint)] bg-[var(--mint)] text-[var(--ink)]" : "border-line/15 hover:border-[var(--mint)]"
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-[var(--sc-ink-soft)]">
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
                className={`min-h-[3rem] rounded-xl border font-semibold ${
                  size === z.id ? "border-[var(--mint)] bg-[var(--mint)] text-[var(--ink)]" : "border-line/15 hover:border-[var(--mint)]"
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
