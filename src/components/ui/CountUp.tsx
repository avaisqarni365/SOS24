"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shows a figure such as "85 %", "9,3 °C" or "25 Jahre" and counts its
 * leading number up from zero whenever the value changes (German number
 * format). With onView it starts when it scrolls into view. Text without a
 * leading number is shown as it is. Respects reduced motion.
 */
export default function CountUp({ value, ms = 700, onView = false }: { value: string; ms?: number; onView?: boolean }) {
  const m = value.match(/^(\d+(?:,\d+)?)([\s\S]*)$/);
  const target = m ? parseFloat(m[1].replace(",", ".")) : NaN;
  const decimals = m && m[1].includes(",") ? m[1].split(",")[1].length : 0;
  const rest = m ? m[2] : "";
  const [shown, setShown] = useState(target);
  const [seen, setSeen] = useState(!onView);
  const raf = useRef(0);
  const el = useRef<HTMLSpanElement>(null);

  // optionally wait until the figure scrolls into view
  useEffect(() => {
    if (seen || !el.current) return;
    const io = new IntersectionObserver((e) => {
      if (e.some((x) => x.isIntersecting)) {
        setSeen(true);
        io.disconnect();
      }
    });
    io.observe(el.current);
    return () => io.disconnect();
  }, [seen]);

  useEffect(() => {
    if (Number.isNaN(target) || !seen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setShown(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf.current = requestAnimationFrame(tick);
    };
    setShown(0);
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, ms, seen]);

  if (Number.isNaN(target)) return <>{value}</>;
  const num = shown.toLocaleString("de-DE", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return (
    <>
      <span ref={el} className="tabular-nums">
        {num}
      </span>
      {rest}
    </>
  );
}
