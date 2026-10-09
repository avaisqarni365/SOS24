"use client";

import { useId, useState } from "react";

/* Magnus over water, DIN 4108-2 style surface check (Rsi = 0,25 m²K/W). */
const A = 17.62;
const B = 243.12;
const RSI = 0.25;

function dewPoint(t: number, rh: number) {
  const al = Math.log(rh / 100) + (A * t) / (B + t);
  return (B * al) / (A - al);
}
function pSat(t: number) {
  return 611.2 * Math.exp((A * t) / (B + t));
}

type WallKey = "altbau" | "teil" | "gedaemmt" | "ecke";
const WALLS: { key: WallKey; label: string; u: number }[] = [
  { key: "altbau", label: "Altbau ungedämmt (U ≈ 1,4 W/m²K)", u: 1.4 },
  { key: "teil", label: "Mauerwerk teilgedämmt (U ≈ 0,8)", u: 0.8 },
  { key: "gedaemmt", label: "Gedämmte Außenwand (U ≈ 0,3)", u: 0.3 },
  { key: "ecke", label: "Wärmebrücke / Raumecke (U ≈ 2,0)", u: 2.0 },
];

type Level = "ok" | "warn" | "risk" | "dew";
const LEVELS: Record<Level, { color: string; title: string; text: string; tips: string[] }> = {
  ok: {
    color: "currentColor",
    title: "unkritisch",
    text: "Die Wand bleibt warm genug. Die Feuchte direkt an der Oberfläche liegt unter der Schwelle, ab der Schimmel auf Dauer wachsen kann.",
    tips: [
      "Weiter regelmäßig stoßlüften, besonders nach Kochen, Duschen und Wäschetrocknen.",
      "Die Raumluftfeuchte mit einem Hygrometer im Blick behalten.",
      "Wird die Wand trotzdem feucht, kommt das Wasser oft nicht aus der Raumluft: dann Ursache messen lassen.",
    ],
  },
  warn: {
    color: "#e8b04c",
    title: "grenzwertig",
    text: "Die Oberfläche ist deutlich feuchter als die Raumluft. Hält dieser Zustand über Tage an, wird es an kalten Stellen knapp.",
    tips: [
      "Mehrmals täglich einige Minuten stoßlüften statt die Fenster dauerhaft zu kippen.",
      "Möbel einige Zentimeter von Außenwänden abrücken, damit warme Luft die Wand erreicht.",
      "Auch selten genutzte Räume nicht stark auskühlen lassen.",
    ],
  },
  risk: {
    color: "#d9694f",
    title: "Schimmelrisiko",
    text: "Über längere Zeit reicht das für Schimmelwachstum, auch ohne sichtbares Wasser.",
    tips: [
      "Raumluftfeuchte senken: stoßlüften, Wäsche möglichst nicht im Raum trocknen.",
      "Möbel von Außenwänden abrücken und Raumecken frei halten.",
      "Ursache messen lassen: Kondensat, Wärmebrücke und Feuchte aus dem Mauerwerk sehen ähnlich aus.",
    ],
  },
  dew: {
    color: "#d9694f",
    title: "Tauwasser an der Oberfläche",
    text: "Die Wand ist kälter als der Taupunkt der Raumluft. Hier schlägt sich Wasser nieder, Schimmel findet sehr gute Bedingungen.",
    tips: [
      "Nasse Stellen trocken wischen und den Raum gründlich lüften.",
      "Heizung an kalten Außenwänden nicht drosseln, Möbel abrücken.",
      "Ursache und Ausmaß messen lassen, bevor Sie Schimmel selbst behandeln.",
    ],
  },
};

const fmt = (n: number) => {
  const s = (Math.round(n * 10) / 10).toFixed(1).replace(".", ",");
  return s === "-0,0" ? "0,0" : s;
};

/* SVG geometry: 600 x 300, temperature scale fixed so changes stay comparable. */
const W = 600;
const H = 300;
const T_MAX = 26;
const T_MIN = -18;
const yOf = (t: number) => {
  const c = Math.min(T_MAX, Math.max(T_MIN, t));
  return 16 + ((T_MAX - c) / (T_MAX - T_MIN)) * (H - 32);
};
const AIR = 120;

type Layer = { name: string; w: number; r: number; fill: string };

function layersFor(u: number): Layer[] {
  const insulated = u <= 0.3;
  const rWall = 1 / u - RSI - 0.04;
  const solid: Layer[] = insulated
    ? [
        { name: "Innenputz", w: 20, r: 0.02, fill: "#d8d1c2" },
        { name: "Mauerwerk", w: 170, r: 0.5, fill: "url(#dpl-brick)" },
        { name: "Dämmung", w: 150, r: rWall - 0.54, fill: "url(#dpl-ins)" },
        { name: "Außenputz", w: 20, r: 0.02, fill: "#bdb6a6" },
      ]
    : [
        { name: "Innenputz", w: 20, r: 0.02, fill: "#d8d1c2" },
        { name: "Mauerwerk", w: 320, r: rWall - 0.04, fill: "url(#dpl-brick)" },
        { name: "Außenputz", w: 20, r: 0.02, fill: "#bdb6a6" },
      ];
  return solid;
}

export default function DewPointLab() {
  const uid = useId();
  const [ti, setTi] = useState(20);
  const [rh, setRh] = useState(60);
  const [te, setTe] = useState(0);
  const [wall, setWall] = useState<WallKey>("altbau");

  const u = WALLS.find((w) => w.key === wall)?.u ?? 1.4;
  const td = dewPoint(ti, rh);
  const q = u * (ti - te);
  const thetaSi = ti - RSI * q;
  const surfRh = Math.min(100, (rh * pSat(ti)) / pSat(thetaSi));
  const level: Level = thetaSi <= td ? "dew" : surfRh >= 80 ? "risk" : surfRh >= 70 ? "warn" : "ok";
  const v = LEVELS[level];

  // piecewise linear temperature profile through the layers
  const layers = layersFor(u);
  const pts: [number, number][] = [
    [0, ti],
    [AIR - 36, ti],
    [AIR, thetaSi],
  ];
  let x = AIR;
  let t = thetaSi;
  const starts: number[] = [];
  for (const l of layers) {
    starts.push(x);
    x += l.w;
    t -= l.r * q;
    pts.push([x, t]);
  }
  pts.push([x + 36, te], [W, te]);
  const poly = pts.map(([px, pt]) => `${px},${yOf(pt).toFixed(1)}`).join(" ");
  const ySi = yOf(thetaSi);

  const sliders = [
    { id: "ti", label: "Raumtemperatur", min: 14, max: 24, step: 0.5, value: ti, set: setTi, unit: "°C" },
    { id: "rh", label: "Relative Luftfeuchte", min: 30, max: 80, step: 1, value: rh, set: setRh, unit: "%" },
    { id: "te", label: "Außentemperatur", min: -15, max: 15, step: 1, value: te, set: setTe, unit: "°C" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr] lg:items-start">
      <div className="rounded-[22px] border border-line/10 bg-[var(--ink-2)] p-5 sm:p-8">
        <p className="sc-label">Ihre Werte</p>
        <h3 className="mt-2 font-editorial text-2xl leading-tight sm:text-3xl">Raumklima und Wand</h3>
        <div className="mt-6 flex flex-col gap-5">
          {sliders.map((s) => (
            <div key={s.id}>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={`${uid}-${s.id}`} className="text-sm font-semibold">
                  {s.label}
                </label>
                <output htmlFor={`${uid}-${s.id}`} className="font-mono text-sm text-accent-deep">
                  {s.unit === "%" ? s.value : fmt(s.value)} {s.unit}
                </output>
              </div>
              <input
                id={`${uid}-${s.id}`}
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={s.value}
                onChange={(e) => s.set(Number(e.target.value))}
                className="mt-1 h-11 w-full cursor-pointer accent-[var(--mint)]"
              />
              <div className="flex justify-between font-mono text-[11px] text-[var(--sc-ink-soft)]" aria-hidden="true">
                <span>
                  {s.min} {s.unit}
                </span>
                <span>
                  {s.max} {s.unit}
                </span>
              </div>
            </div>
          ))}
          <div>
            <label htmlFor={`${uid}-wall`} className="text-sm font-semibold">
              Wandtyp
            </label>
            <select
              id={`${uid}-wall`}
              value={wall}
              onChange={(e) => setWall(e.target.value as WallKey)}
              className="mt-2 min-h-[44px] w-full rounded-full border border-[var(--line-strong)] bg-[var(--ink-3)] px-4 py-2 text-sm text-[var(--bone)] hover:border-accent-deep"
            >
              {WALLS.map((w) => (
                <option key={w.key} value={w.key}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-[22px] border border-line/10 bg-[var(--ink-2)] p-5 sm:p-8">
        <div aria-live="polite" aria-atomic="true">
          <dl className="grid grid-cols-3 gap-3">
            {[
              ["Taupunkt", `${fmt(td)} °C`],
              // soft hyphens: the three readouts share a narrow row on phones
              ["Ober\u00ADfläche innen", `${fmt(thetaSi)} °C`],
              ["Feuchte an der Ober\u00ADfläche", `${Math.round(surfRh)} %`],
            ].map(([k, val]) => (
              <div key={k} className="rounded-2xl bg-[var(--ink-3)] p-3">
                <dt className="font-mono text-[11px] uppercase leading-snug tracking-wide text-[var(--sc-ink-soft)]">{k}</dt>
                <dd className="mt-1 font-mono text-lg text-[var(--bone)] sm:text-2xl" style={{ textAlign: "start" }}>
                  {val}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 rounded-2xl border-l-4 bg-[var(--ink-3)] p-4" style={{ borderColor: v.color }}>
            <p className="sc-label">Einschätzung</p>
            <p
              className={level === "dew" ? "mt-1 text-xl font-bold uppercase tracking-wide" : "mt-1 text-lg font-semibold"}
              style={{ color: v.color, textAlign: "start" }}
            >
              {v.title}
            </p>
            <p className="mt-1 text-sm text-[var(--sc-ink-soft)]">{v.text}</p>
          </div>
        </div>

        <figure className="mt-6">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-labelledby={`${uid}-svgt`}>
            <title id={`${uid}-svgt`}>
              {`Temperaturverlauf durch die Wand: innen ${fmt(ti)} °C, Oberfläche innen ${fmt(thetaSi)} °C, außen ${fmt(te)} °C, Taupunkt ${fmt(td)} °C.`}
            </title>
            <defs>
              <pattern id="dpl-brick" width="40" height="24" patternUnits="userSpaceOnUse">
                <rect width="40" height="24" fill="#8a5a46" />
                <path d="M0 12H40M0 24H40M20 0V12M0 12V24M40 12V24" stroke="#6d4536" strokeWidth="2" />
              </pattern>
              <pattern id="dpl-ins" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="14" height="14" fill="#e3d49c" />
                <path d="M0 0V14" stroke="#cbb877" strokeWidth="5" />
              </pattern>
            </defs>
            <rect width={AIR} height={H} fill="#1f2a24" />
            <rect x={W - AIR} width={AIR} height={H} fill="#16212b" />
            {layers.map((l, i) => (
              <rect key={l.name} x={starts[i]} width={l.w} height={H} fill={l.fill} opacity={0.85} />
            ))}
            {[-10, 0, 10, 20].map((g) => (
              <g key={g}>
                <line x1={0} x2={W} y1={yOf(g)} y2={yOf(g)} stroke="#ffffff" strokeOpacity={0.12} />
                <text x={W / 2} y={yOf(g) - 4} textAnchor="middle" fontSize={13} fill="#f3f1ec" fillOpacity={0.55} className="font-mono">
                  {g} °C
                </text>
              </g>
            ))}
            <line x1={0} x2={W} y1={yOf(td)} y2={yOf(td)} stroke="#8fbde8" strokeWidth={2} strokeDasharray="8 6" />
            <text x={W - 8} y={yOf(td) - 8} textAnchor="end" fontSize={16} fill="#8fbde8" className="font-mono">
              Taupunkt {fmt(td)} °C
            </text>
            <polyline points={poly} fill="none" stroke="#f3f1ec" strokeWidth={3} strokeLinejoin="round" />
            <text x={8} y={yOf(ti) - 10} fontSize={16} fill="#f3f1ec" className="font-mono">
              innen {fmt(ti)} °C
            </text>
            <text x={W - 8} y={Math.min(H - 6, yOf(te) + 24)} textAnchor="end" fontSize={16} fill="#f3f1ec" className="font-mono">
              außen {fmt(te)} °C
            </text>
            {level === "dew" &&
              [0.35, 0.55, 0.75].map((f) => <circle key={f} cx={AIR - 4} cy={H * f} r={4} fill="#8fbde8" />)}
            <g className="motion-safe:transition-transform motion-safe:duration-300" style={{ transform: `translate(${AIR}px, ${ySi}px)` }}>
              <circle r={13} fill={v.color} fillOpacity={0.25} />
              <circle r={7} fill={v.color} stroke="#0e1310" strokeWidth={2} />
            </g>
          </svg>
          <ol className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-[var(--sc-ink-soft)]" aria-label="Schichten von innen nach außen">
            {["Raumluft", ...layers.map((l) => l.name), "Außenluft"].map((n, i) => (
              <li key={n} style={{ textAlign: "start" }}>
                {i + 1} {n}
              </li>
            ))}
          </ol>
          <figcaption className="mt-3 text-xs text-[var(--sc-ink-soft)]">
            Weiße Linie: Temperatur durch die Wand. Punkt: Oberflächentemperatur innen in der Farbe der Einschätzung.
            Vereinfachte stationäre Berechnung nach dem Prinzip von DIN 4108-2 (Rsi = 0,25 m²K/W). Ersetzt keine Messung vor Ort.
          </figcaption>
        </figure>

        <div className="mt-6">
          <p className="sc-label">Was Sie jetzt tun können</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {v.tips.map((tip) => (
              <li key={tip} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: v.color }} />
                <span className="text-[var(--bone-2)]">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
