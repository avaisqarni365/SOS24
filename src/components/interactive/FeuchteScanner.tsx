"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Zone = {
  id: string;
  label: string;
  cause: string;
  href: string;
  service: string;
};

const ZONES: Record<string, Zone> = {
  rising: {
    id: "rising",
    label: "Aufsteigende Feuchte",
    cause: "Kapillar aus dem Boden. Typisch im unteren Meter, mit Salzrand an der Feuchtefront.",
    href: "/leistungen/horizontalsperre/",
    service: "Horizontalsperre",
  },
  condensate: {
    id: "condensate",
    label: "Kondensat an der Wärmebrücke",
    cause: "Kalte Außenecke, der Taupunkt liegt an der Oberfläche. Hier beginnt Schimmel.",
    href: "/leistungen/schimmelbeseitigung/",
    service: "Schimmelbeseitigung",
  },
  crack: {
    id: "crack",
    label: "Wasserführender Riss",
    cause: "Wasser drückt seitlich durch einen Riss im Bauteil.",
    href: "/leistungen/rissverpressung/",
    service: "Rissverpressung",
  },
  dry: {
    id: "dry",
    label: "Trocken",
    cause: "Normale Ausgleichsfeuchte. Kein Handlungsbedarf an dieser Stelle.",
    href: "/leistungen/feuchtemessung/",
    service: "Feuchtemessung",
  },
};

/** Illustrative moisture field over the wall, x and y in 0..1 (y down). Returns percent and dominant cause. */
function field(x: number, y: number): { m: number; zone: Zone } {
  const rising = 88 * Math.exp(-(1 - y) / 0.2) * (0.85 + 0.15 * Math.sin(x * 19));
  const dx = x - 0.9;
  const dy = y - 0.12;
  const condensate = 72 * Math.exp(-(dx * dx + dy * dy) / 0.012);
  const cx = x - (0.36 + (y - 0.3) * 0.12);
  const crack = y > 0.25 && y < 0.8 ? 64 * Math.exp(-(cx * cx) / 0.0012) : 0;
  const base = 12 + 4 * Math.sin(x * 7 + y * 5);
  const parts: [number, Zone][] = [
    [rising, ZONES.rising],
    [condensate, ZONES.condensate],
    [crack, ZONES.crack],
  ];
  parts.sort((a, b) => b[0] - a[0]);
  const m = Math.min(98, base + parts[0][0] + parts[1][0] * 0.3);
  return { m, zone: m < 30 ? ZONES.dry : parts[0][1] };
}

function heatColor(m: number): [number, number, number] {
  // dry mint -> amber -> damp blue, readable on the pale wall
  const stops: [number, [number, number, number]][] = [
    [0, [98, 196, 172]],
    [35, [196, 214, 120]],
    [55, [236, 176, 76]],
    [75, [74, 130, 196]],
    [100, [34, 72, 150]],
  ];
  for (let i = 1; i < stops.length; i++) {
    if (m <= stops[i][0]) {
      const [a, ca] = stops[i - 1];
      const [b, cb] = stops[i];
      const t = (m - a) / (b - a);
      return [0, 1, 2].map((k) => Math.round(ca[k] + (cb[k] - ca[k]) * t)) as [number, number, number];
    }
  }
  return stops[stops.length - 1][1];
}

export default function FeuchteScanner() {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pos, setPos] = useState({ x: 0.3, y: 0.82 });
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const W = 160;
    const H = 100;
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const img = ctx.createImageData(W, H);
    for (let j = 0; j < H; j++)
      for (let i = 0; i < W; i++) {
        const { m } = field(i / (W - 1), j / (H - 1));
        const [r, g, b] = heatColor(m);
        const k = (j * W + i) * 4;
        img.data[k] = r;
        img.data[k + 1] = g;
        img.data[k + 2] = b;
        img.data[k + 3] = 235;
      }
    ctx.putImageData(img, 0, 0);
  }, []);

  const moveTo = useCallback((clientX: number, clientY: number) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    setPos({
      x: Math.min(1, Math.max(0, (clientX - r.left) / r.width)),
      y: Math.min(1, Math.max(0, (clientY - r.top) / r.height)),
    });
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.1 : 0.03;
    const d: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const v = d[e.key];
    if (!v) return;
    e.preventDefault();
    setPos((p) => ({
      x: Math.min(1, Math.max(0, p.x + v[0])),
      y: Math.min(1, Math.max(0, p.y + v[1])),
    }));
  };

  const { m, zone } = field(pos.x, pos.y);
  const level = m < 30 ? "trocken" : m < 55 ? "erhöht" : "nass";

  return (
    <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-stretch">
      <div
        ref={boxRef}
        className="scanner"
        style={{ ["--x" as string]: pos.x * 100, ["--y" as string]: pos.y * 100, ["--r" as string]: reveal ? 2000 : 120 }}
        tabIndex={0}
        role="group"
        aria-label="Feuchte-Scanner. Mit den Pfeiltasten die Messsonde über die Wand bewegen."
        aria-describedby="scanner-readout"
        onPointerMove={(e) => moveTo(e.clientX, e.clientY)}
        onPointerDown={(e) => {
          (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
          moveTo(e.clientX, e.clientY);
        }}
        onKeyDown={onKey}
      >
        {/* the wall as the owner sees it: freshly painted, nothing visible */}
        <svg viewBox="0 0 800 500" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="paint-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
              <feColorMatrix values="0 0 0 0 0.36  0 0 0 0 0.33  0 0 0 0 0.28  0 0 0 0.08 0" />
            </filter>
            <linearGradient id="wall-light" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e9e4d8" />
              <stop offset="1" stopColor="#d3cdbf" />
            </linearGradient>
          </defs>
          <rect width="800" height="500" fill="url(#wall-light)" />
          <rect width="800" height="500" filter="url(#paint-grain)" />
          <rect y="470" width="800" height="30" fill="#8d887c" />
          <rect x="560" y="70" width="150" height="110" fill="#c8c2b3" stroke="#aaa392" strokeWidth="6" />
          <path d="M635 70 V180 M560 125 H710" stroke="#aaa392" strokeWidth="4" />
        </svg>
        <canvas ref={canvasRef} className="scanner__heat absolute inset-0 h-full w-full" aria-hidden="true" />
        <div className="scanner__probe" aria-hidden="true" />
        <div className="scanner__readout" id="scanner-readout" aria-live="polite">
          <div className="opacity-70">Messwert (Simulation)</div>
          <div className="scanner__value">{Math.round(m)} %</div>
          <div>
            Zustand: <strong>{level}</strong>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-6 rounded-[22px] border border-line/10 bg-[var(--ink-2)] p-6 sm:p-8">
        <div>
          <p className="sc-label">Befund an der Sonde</p>
          <h3 className="mt-3 font-editorial text-3xl leading-tight">{zone.label}</h3>
          <p className="mt-3 text-[var(--sc-ink-soft)]">{zone.cause}</p>
        </div>
        <div className="flex flex-col gap-3">
          <a
            href={zone.href}
            className="inline-flex min-h-[48px] items-center justify-between rounded-full bg-[var(--bone)] px-5 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-surface"
          >
            Passende Leistung: {zone.service} <span aria-hidden="true">→</span>
          </a>
          <button
            type="button"
            onClick={() => setReveal((r) => !r)}
            aria-pressed={reveal}
            className="min-h-[48px] rounded-full border border-line/20 px-5 py-3 text-sm font-semibold hover:border-accent-deep"
          >
            {reveal ? "Nur die Sonde zeigen" : "Ganze Feuchtekarte aufdecken"}
          </button>
          <p className="text-xs text-[var(--sc-ink-soft)]">
            Illustrative Wand. Vor Ort messen wir mit Messgeräten im Baustoff und unterscheiden kapillare von
            hygroskopischer Feuchte.
          </p>
        </div>
      </div>
    </div>
  );
}
