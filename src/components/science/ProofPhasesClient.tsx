"use client";

import { useState } from "react";
import type { ProofPhase } from "@/data/proof";
import CountUp from "@/components/ui/CountUp";

/* Light card surface: Nullmessung copper and dashed, the current phase green
   and solid; both are direct-labelled, so identity never rests on colour. */
const C_NULL = "#c4703f";
const C_NOW = "#1f8a70";
const SURFACE = "var(--ink-2)";
// text and grid follow the theme (the card sets color: var(--bone))
const INK = "currentColor";
const SOFT = "currentColor";

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
      <svg data-i18n="" viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby="proof-chart-title">
        <title id="proof-chart-title">
          {`Feuchteprofil der Wand: Durchfeuchtungsgrad in Prozent je Messhöhe, Nullmessung und Phase ${phase.n}`}
        </title>
        {[0, 25, 50, 75, 100].map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={Y0} y2={Y1} stroke={INK} strokeOpacity="0.07" />
            <text x={x(v)} y={Y1 + 22} textAnchor="middle" fontSize="13" fill={SOFT} fillOpacity="0.62" fontFamily="ui-monospace, monospace">
              {v} %
            </text>
          </g>
        ))}
        {[0, 50, 100, 150].map((cm) => (
          <g key={cm}>
            <line x1={X0} x2={X1} y1={y(cm)} y2={y(cm)} stroke={INK} strokeOpacity="0.07" />
            <text x={X0 - 10} y={y(cm) + 4} textAnchor="end" fontSize="13" fill={SOFT} fillOpacity="0.62" fontFamily="ui-monospace, monospace">
              {cm} cm
            </text>
          </g>
        ))}
        <text x={(X0 + X1) / 2} y={H - 6} textAnchor="middle" fontSize="13" fill={SOFT} fillOpacity="0.62">
          Durchfeuchtungsgrad
        </text>
        <rect x={X0} y={y(barrier) - 3} width={X1 - X0} height="6" fill={C_NOW} opacity="0.14" />
        <line x1={X0} x2={X1} y1={y(barrier)} y2={y(barrier)} stroke={C_NOW} strokeOpacity="0.8" strokeDasharray="2 5" strokeWidth="2" />
        <text x={X0 + 8} y={y(barrier) - 8} textAnchor="start" fontSize="12" fill={C_NOW} fontFamily="ui-monospace, monospace">
          Horizontalsperre ({barrier} cm)
        </text>
        <polyline points={pts(base)} fill="none" stroke={C_NULL} strokeWidth="2" strokeDasharray="7 5" strokeLinejoin="round" />
        {base.map((v, i) => (
          <circle key={`b${i}`} cx={x(v)} cy={y(heights[i])} r="5" fill={C_NULL} stroke={SURFACE} strokeWidth="2" />
        ))}
        <text x={x(base[top]) + 12} y={y(heights[top]) + 4} fontSize="13" fill={INK}>
          Nullmessung
        </text>
        {!same && (
          <>
            <polyline points={pts(phase.values)} fill="none" stroke={C_NOW} strokeWidth="2.5" strokeLinejoin="round" />
            {phase.values.map((v, i) => (
              <circle key={`p${i}`} cx={x(v)} cy={y(heights[i])} r="6" fill={C_NOW} stroke={SURFACE} strokeWidth="2" />
            ))}
            <text x={x(phase.values[1]) + 12} y={y(heights[1]) + 4} fontSize="13" fill={INK} fontWeight="600">
              Phase {phase.n}
            </text>
          </>
        )}
        {hover !== null && <line x1={X0} x2={X1} y1={y(heights[hover])} y2={y(heights[hover])} stroke={INK} strokeOpacity="0.25" />}
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
          className="proof-tip pointer-events-none absolute right-3"
          style={{ top: `${(y(heights[hover]) / H) * 100}%`, transform: "translateY(-120%)" }}
          role="status"
        >
          <div className="font-semibold">Messhöhe {heights[hover]} cm</div>
          <div>Nullmessung: {base[hover]} %</div>
          {!same && (
            <div>
              Phase {phase.n}: {phase.values[hover]} %
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProofPhasesClient({ phases, heights, barrier }: { phases: ProofPhase[]; heights: number[]; barrier: number }) {
  const [active, setActive] = useState(0);
  const phase = phases[active];
  const base = phases[0].values;
  const at30 = heights.indexOf(30);
  const now30 = phase.values[at30];
  const drop = base[at30] - now30;

  return (
    <div className="proof">
      <ol className="proof-steps" aria-label="Phasen der Sanierung">
        {phases.map((p, i) => (
          <li key={p.id}>
            <button type="button" aria-pressed={i === active} onClick={() => setActive(i)}>
              <span className="proof-steps__n">{p.n}</span>
              <span className="proof-steps__t">{p.title}</span>
              <span className="proof-steps__w">{p.when}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="proof-body">
        <div className="proof-card" aria-live="polite">
          <p className="sc-label">
            Phase {phase.n} von {phases.length} · {phase.when}
          </p>
          <h3 className="proof-card__title">{phase.title}</h3>
          <dl className="proof-kpis">
            <div>
              <dt>Durchfeuchtung bei 30 cm</dt>
              <dd>
                <CountUp value={`${now30} %`} />
              </dd>
            </div>
            <div>
              <dt>gegenüber der Nullmessung</dt>
              <dd>{drop > 0 ? `−${drop} Punkte` : "Ausgangswert"}</dd>
            </div>
            <div>
              <dt>Messhöhen, immer dieselben</dt>
              <dd>
                <CountUp value={String(heights.length)} />
              </dd>
            </div>
          </dl>
          <p className="proof-card__text">{phase.measure}</p>
          <div className="proof-card__row">
            <p>
              <span className="proof-card__k">Sie erhalten</span>
              {phase.proof}
            </p>
            <p>
              <span className="proof-card__k">Prüfkriterium</span>
              {phase.criterion}
            </p>
          </div>
          <div className="proof-card__nav">
            <button type="button" onClick={() => setActive((active + phases.length - 1) % phases.length)}>
              <span aria-hidden="true">←</span> Zurück
            </button>
            <button type="button" className="btn-shine" onClick={() => setActive((active + 1) % phases.length)}>
              {active === phases.length - 1 ? "Von vorn" : "Nächste Phase"} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="proof-chart">
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
          <details className="mt-1 text-sm text-[var(--sc-ink-soft)]">
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
                  <tr key={cm} className="border-t border-line/10">
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
          <p className="text-xs text-[var(--sc-ink-soft)]">
            Beispielwerte, schematisch. Die Werte Ihres Objekts stehen im Messprotokoll, das Sie nach jeder Phase erhalten.
          </p>
        </div>
      </div>
    </div>
  );
}
