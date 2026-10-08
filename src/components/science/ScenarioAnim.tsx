"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A six-second scenario on a tilted 3D stage: the problem, the treatment,
 * the result, with the captions lighting up in step. Runs only while it is
 * on screen (hidden tabs stay paused); with reduced motion it shows the
 * finished state.
 */
export default function ScenarioAnim({ kind, steps, children }: { kind: string; steps: [string, string, string]; children: ReactNode }) {
  const box = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-on", e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure ref={box} className={`anim anim--${kind}`}>
      <div className="anim__stage">{children}</div>
      <figcaption className="anim__caps">
        <span className="anim__k">Szenario in 6 Sekunden</span>
        <ol>
          {steps.map((s, i) => (
            <li key={s} className={`anim__label anim__label--${i + 1}`}>
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
