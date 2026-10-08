"use client";

import { useEffect, useRef } from "react";

const LAYERS = [
  { key: "brick", label: "Mauerwerk" },
  { key: "barrier", label: "Horizontalsperre" },
  { key: "slurry", label: "Dichtschlämme" },
  { key: "plaster", label: "Sanierputz" },
  { key: "finish", label: "Oberfläche" },
];

/**
 * "Schicht für Schicht" in 3D: the five layers of a remediated wall as
 * plates in space. They drift apart and close again, and tilt toward the
 * pointer. Pure CSS 3D, no WebGL, nothing to download.
 */
export default function LayerStack3D() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--tilt-z", `${-40 + x * 16}deg`);
        el.style.setProperty("--tilt-x", `${56 - y * 10}deg`);
      });
    };
    const onLeave = () => {
      el.style.removeProperty("--tilt-z");
      el.style.removeProperty("--tilt-x");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={box} className="l3d" role="img" aria-label="Wandaufbau in 3D: Mauerwerk, Horizontalsperre, Dichtschlämme, Sanierputz, Oberfläche">
      <div className="l3d__scene">
        {LAYERS.map((l, i) => (
          <div key={l.key} className={`l3d__plate l3d__plate--${l.key}`} style={{ ["--i" as string]: i }}>
            <span className="l3d__tag">{l.label}</span>
          </div>
        ))}
      </div>
      <ol className="l3d__legend" aria-hidden="true">
        {LAYERS.map((l, i) => (
          <li key={l.key} className="l3d__label">
            <span className={`l3d__dot l3d__dot--${l.key}`} />
            {String(i + 1).padStart(2, "0")} {l.label}
          </li>
        ))}
      </ol>
    </div>
  );
}
