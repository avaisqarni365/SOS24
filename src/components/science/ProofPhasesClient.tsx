"use client";

import { useState } from "react";
import type { ProofPhase } from "@/data/proof";

/* Validated pair on the #141b17 card surface (dataviz validator, dark mode):
   Nullmessung copper, current phase green; the reference is also dashed and
   direct-labelled, so identity never rests on colour alone. */
const C_NULL = "#c98050";
const C_NOW = "#36a68c";
const SURFACE = "#141b17";

const W = 560;
const H = 420;
const X0 = 64;
const X1 = 536;
const Y0 = 24; // 160 cm
const Y1 = 372; // 0 cm
const x = (v: number) => X0 + (v / 100) * (X1 - X0);
const y = (cm: number) => Y1 - (cm / 160) * (Y1 - Y0);

function Chart({ heights, barrier, base, phase }: { heights: number[]; barrier: number; base: number[]; phase: ProofPhase }) {
  const [hover, setHover] = useState<number | null>(null);
  const pts = (vals: number[]) => vals.map((v, i) => `${x(v)},${y(heights[i])}`).join(" ");
  const same = phase.values.every((v, i) => v === base[i]);
  const top = heights.length - 1;
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="proof-chart-title">
        <title id="proof-chart-title">
          {`Feuchteprofil der Wand: Durchfeuchtungsgrad in Prozent je Messhöhe, Nullmessung und Phase ${phase.n}`}
        </title>
        {/* grid and axes, recessive */}
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={Y0} y2={Y1} stroke="#f3f1ec" strokeOpacity="0.08" />
            <text x={x(v)} y={Y1 + 22} textAnchor="middle" fontSize="13" fill="#aeb6b0" fontFamily="ui-monospace, monospace">
              {v} %
            </text>
          </g>
        ))}
        {[0, 50, 100, 150].map((cm) => (
          <g key={cm}>
            <line x1={X0} x2={X1} y1={y(cm)} y2={y(cm)} stroke="#f3f1ec" strokeOpacity="0.08" />
            <text x={X0 - 10} y={y(cm) + 4} textAnchor="end" fontSize="13" fill="#aeb6b0" fontFamily="ui-monospace, monospace">
              {cm} cm
            </text>
          </g>
        ))}
        <text x={(X0 + X1) / 2} y={H - 6} textAnchor="middle" fontSize="13" fill="#aeb6b0">
          Durchfeuchtungsgrad
        </text>
        {/* the barrier */}
        <line x1={X0} x2={X1} y1={y(barrier)} y2={y(barrier)} stroke="#f3f1ec" strokeOpacity="0.55" strokeDasharray="2 5" strokeWidth="2" />
        <text x={X0 + 8} y={y(barrier) - 7} textAnchor="start" fontSize="12" fill="#f3f1ec" fontFamily="ui-monospace, monospace">
          Horizontalsperre ({barrier} cm)
        </text>
        {/* Nullmessung: dashed reference */}
        <polyline points={pts(base)} fill="none" stroke={C_NULL} strokeWidth="2" strokeDasharray="7 5" strokeLinejoin="round" />
        {base.map((v, i) => (
          <circle key={`b${i}`} cx={x(v)} cy={y(heights[i])} r="5" fill={C_NULL} stroke={SURFACE} strokeWidth="2" />
        ))}
        <text x={x(base[top]) + 12} y={y(heights[top]) + 4} fontSize="13" fill="#f3f1ec">
          Nullmessung
        </text>
        {/* current phase */}
        {!same && (
          <>
            <polyline points={pts(phase.values)} fill="none" stroke={C_NOW} strokeWidth="2.5" strokeLinejoin="round" />
            {phase.values.map((v, i) => (
              <circle key={`p${i}`} cx={x(v)} cy={y(heights[i])} r="6" fill={C_NOW} stroke={SURFACE} strokeWidth="2" />
            ))}
            <text x={x(phase.values[1]) + 12} y={y(heights[1]) + 4} fontSize="13" fill="#f3f1ec">
              Phase {phase.n}
            </text>
          </>
        )}
        {/* hover crosshair on the hovered height */}
        {hover !== null && (
          <line x1={X0} x2={X1} y1={y(heights[hover])} y2={y(heights[hover])} stroke="#f3f1ec" strokeOpacity="0.35" />
        )}
        {/* hit targets, larger than the marks, one per measuring height */}
        {heights.map((cm, i) => (
          <rect
            key={`h${i}`}
            x={X0}
            y={y(cm) - 14}
            width={X1 - X0}
            height={28}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute right-3 rounded-xl border border-white/10 bg-[#0e1310]/95 px-3 py-2 font-mono text-xs"
          style={{ top: `${(y(heights[hover]) / H) * 100}%`, transform: "translateY(-120%)" }}
          role="status"
        >
          <div className="text-[var(--bone)]">Messhöhe {heights[hover]} cm</div>
          <div className="text-[var(--sc-ink-soft)]">Nullmessung: {base[hover]} %</div>
          {!same && (
            <div className="text-[var(--sc-ink-soft)]">
              Phase {phase.n}: {phase.values[hover]} %
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProofPhasesClient({
  phases,
  heights,
  barrier,
}: {
  phases: ProofPhase[];
  heights: number[];
  barrier: number;
}) {
  const [active, setActive] = useState(0);
  const phase = phases[active];
  const base = phases[0].values;
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      <ol className="grid gap-3">
        {phases.map((p, i) => {
          const on = i === active;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={on}
                className={`w-full rounded-[18px] border p-5 text-left transition-colors ${
                  on ? "border-[var(--mint)] bg-[var(--ink-3)]" : "border-white/10 bg-[var(--ink-2)] hover:border-white/25"
                }`}
              >
                <span className="flex items-baseline gap-3">
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-mono text-sm font-bold ${
                      on ? "bg-[var(--mint)] text-[var(--ink)]" : "bg-white/10 text-[var(--bone)]"
                    }`}
                  >
                    {p.n}
                  </span>
                  <span>
                    <span className="block font-editorial text-2xl leading-tight text-[var(--bone)]">{p.title}</span>
                    <span className="block font-mono text-[0.7rem] uppercase tracking-wider text-[var(--sc-ink-soft)]">{p.when}</span>
                  </span>
                </span>
                <span className={`mt-3 block text-sm leading-relaxed ${on ? "text-[var(--bone)]/90" : "text-[var(--sc-ink-soft)]"}`}>
                  {p.measure}
                </span>
                <span className="mt-3 block text-sm">
                  <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--mint)]">Dokument </span>
                  <span className="text-[var(--bone)]/85">{p.proof}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className="lg:sticky lg:top-24">
        <div className="rounded-[22px] border border-white/10 bg-[var(--ink-2)] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="sc-label">Feuchteprofil der Wand</p>
            <ul className="flex flex-wrap gap-4 text-xs text-[var(--sc-ink-soft)]" aria-label="Legende">
              <li className="flex items-center gap-2">
                <svg width="26" height="8" aria-hidden="true">
                  <line x1="0" x2="26" y1="4" y2="4" stroke={C_NULL} strokeWidth="2" strokeDasharray="7 5" />
                </svg>
                Nullmessung
              </li>
              <li className="flex items-center gap-2">
                <svg width="26" height="8" aria-hidden="true">
                  <line x1="0" x2="26" y1="4" y2="4" stroke={C_NOW} strokeWidth="2.5" />
                </svg>
                Phase {phase.n}
              </li>
            </ul>
          </div>
          <Chart heights={heights} barrier={barrier} base={base} phase={phase} />
          <div className="mt-2 rounded-2xl bg-[var(--ink-3)] p-4" aria-live="polite">
            <p className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--mint)]">Prüfkriterium Phase {phase.n}</p>
            <p className="mt-1 text-[var(--bone)]">{phase.criterion}</p>
          </div>
          <details className="mt-3 text-sm text-[var(--sc-ink-soft)]">
            <summary className="cursor-pointer py-2">Werte als Tabelle</summary>
            <table className="mt-2 w-full font-mono text-xs">
              <caption className="sr-only">Durchfeuchtungsgrad in Prozent je Messhöhe</caption>
              <thead>
                <tr className="text-left text-[var(--bone)]">
                  <th scope="col" className="py-1">Höhe</th>
                  {phases.map((p) => (
                    <th key={p.id} scope="col" className="py-1">
                      P{p.n}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heights.map((cm, i) => (
                  <tr key={cm} className="border-t border-white/5">
                    <th scope="row" className="py-1 text-left font-normal">
                      {cm} cm
                    </th>
                    {phases.map((p) => (
                      <td key={p.id} className="py-1">
                        {p.values[i]} %
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
          <p className="mt-2 text-xs text-[var(--sc-ink-soft)]">
            Beispielwerte, schematisch. Die tatsächlichen Werte Ihres Objekts stehen im Messprotokoll.
          </p>
        </div>
      </div>
    </div>
  );
}
