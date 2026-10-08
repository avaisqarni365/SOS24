"use client";

import { useId, useRef, useState } from "react";

type MethodKey = "kap" | "cm" | "darr";
type Pattern = {
  key: string;
  label: string;
  diagnosis: string;
  signs: string[];
  measure: string;
  next: string;
  href: string;
  cta: string;
  methods: MethodKey[];
};

const PATTERNS: Pattern[] = [
  {
    key: "rising",
    label: "Aufsteigende Feuchte",
    diagnosis:
      "Gleichmäßig von unten nach oben: Das spricht für kapillar aufsteigende Feuchte, typisch bei defekter oder fehlender Horizontalsperre.",
    signs: [
      "Ein gleichmäßiges Feuchteband vom Boden, das nach oben ausläuft, oft bis etwa 1 m Höhe.",
      "Ein heller Salzrand (Ausblühungen) an der Feuchtefront.",
      "Der Putz im Sockelbereich mürbt ab, unabhängig von Jahreszeit und Lüften.",
    ],
    measure:
      "Ein Feuchteprofil in mehreren Höhen: kapazitiv für das Bild, CM oder Darr für den Wassergehalt im Mauerwerk, dazu die Salzbelastung.",
    next: "Messung in mehreren Höhen, dann Horizontalsperre per Injektion.",
    href: "/leistungen/horizontalsperre/",
    cta: "Zur Horizontalsperre",
    methods: ["kap", "cm", "darr"],
  },
  {
    key: "lateral",
    label: "Seitlich eindringendes Wasser",
    diagnosis:
      "Wasser drückt von außen durch das Bauteil: typisch bei undichter Vertikalsperre, schadhafter Außenabdichtung oder einem Riss.",
    signs: [
      "Feuchte Flecken an der erdberührten Wand, am stärksten in mittlerer bis unterer Höhe.",
      "Keine saubere waagrechte Front, oft entlang einer Fuge oder eines Risses.",
      "Nach Regen oder Tauwetter meist deutlicher.",
    ],
    measure:
      "Die Feuchteverteilung über die Fläche und in der Tiefe, um Fugen, Risse und Anschlüsse als Eintrittsstelle einzugrenzen.",
    next: "Eintrittsstelle eingrenzen, dann die passende Abdichtung planen, bei Bedarf von innen.",
    href: "/leistungen/kellerinnenabdichtung/",
    cta: "Zur Kellerinnenabdichtung",
    methods: ["kap", "cm"],
  },
  {
    key: "pipe",
    label: "Leitungsschaden",
    diagnosis:
      "Punktuelle Feuchte an einer Leitung, unabhängig von der Höhe: Das spricht für ein Rohr oder eine Leitung. Schnell handeln, solche Schäden sind oft versichert.",
    signs: [
      "Ein runder oder länglicher Fleck direkt an einer Leitung, egal in welcher Höhe.",
      "Der Fleck wächst oft zügig, auch ohne Regen.",
      "Unterhalb der Stelle läuft die Feuchte häufig nach unten aus.",
    ],
    measure:
      "Die Feuchteverteilung rund um die Leitung, um den Schwerpunkt einzugrenzen und die Ausbreitung zu dokumentieren.",
    next: "Ursache messen lassen und den Befund für die Versicherung dokumentieren.",
    href: "/leistungen/feuchtemessung/",
    cta: "Zur Feuchtemessung",
    methods: ["kap", "cm"],
  },
  {
    key: "condensate",
    label: "Kondensat / Wärmebrücke",
    diagnosis:
      "Oberflächenkondensat an einer kalten Stelle: Heiz- und Lüftungsverhalten sowie Wärmebrücken prüfen.",
    signs: [
      "Feuchte und Schimmelpunkte oben in der Außenecke und an der Fensterlaibung.",
      "Im Winter stärker, bei viel Feuchte im Raum und wenig Lüften.",
      "Die Stelle fühlt sich deutlich kälter an als der Rest der Wand.",
    ],
    measure:
      "Oberflächentemperatur, Raumklima und die Feuchte im Putz. Ist das Mauerwerk dahinter trocken, spricht das für Kondensat.",
    next: "Schimmel fachgerecht entfernen lassen und die Ursache abstellen.",
    href: "/leistungen/schimmelbeseitigung/",
    cta: "Zur Schimmelbeseitigung",
    methods: ["kap"],
  },
];

const METHODS: { key: MethodKey; name: string; text: string }[] = [
  { key: "kap", name: "Kapazitive Messung", text: "oberflächennah, schnelles Feuchtebild" },
  { key: "cm", name: "CM-Messung", text: "Probe aus der Tiefe, Wassergehalt in Prozent" },
  { key: "darr", name: "Darr-Methode / Bohrkern", text: "Laborwert, am genauesten" },
];

/* deterministic mould speckles, identical on server and client */
const SPECKLES: [number, number, number][] = (() => {
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const out: [number, number, number][] = [];
  for (let i = 0; i < 46; i++) {
    const a = r() * Math.PI * 0.5;
    const d = 20 + r() * 120;
    out.push([Math.round(600 - Math.cos(a) * d), Math.round(Math.sin(a) * d), Math.round(15 + r() * 25) / 10]);
  }
  for (let i = 0; i < 18; i++) out.push([Math.round(392 + r() * 146), Math.round(40 + r() * 14), Math.round(12 + r() * 18) / 10]);
  return out;
})();

function WallSvg({ active, title }: { active: number; title: string }) {
  const layer = (i: number) => ({
    opacity: active === i ? 1 : 0,
    className: "motion-safe:transition-opacity motion-safe:duration-500",
  });
  return (
    <svg viewBox="0 0 600 460" className="h-auto w-full rounded-2xl" role="img" aria-label={title}>
      <defs>
        <radialGradient id="mp-spot">
          <stop offset="0" stopColor="#24528c" stopOpacity="0.95" />
          <stop offset="0.4" stopColor="#3b6ea8" stopOpacity="0.9" />
          <stop offset="0.72" stopColor="#e8b04c" stopOpacity="0.75" />
          <stop offset="1" stopColor="#e8b04c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mp-rise" gradientUnits="userSpaceOnUse" x1="0" y1="420" x2="0" y2="225">
          <stop offset="0" stopColor="#24528c" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#3b6ea8" stopOpacity="0.9" />
          <stop offset="0.8" stopColor="#e8b04c" stopOpacity="0.8" />
          <stop offset="1" stopColor="#e8b04c" stopOpacity="0.15" />
        </linearGradient>
        <filter id="mp-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <clipPath id="mp-wall">
          <rect width="600" height="420" />
        </clipPath>
      </defs>
      <rect width="600" height="420" fill="#1b241f" />
      <rect width="600" height="420" fill="currentColor" opacity="0.5" />
      <g clipPath="url(#mp-wall)">
        <g {...layer(0)}>
          <path d="M0 420V250Q75 232 150 246T300 240T450 250T600 238V420Z" fill="url(#mp-rise)" filter="url(#mp-soft)" />
          <path d="M0 242Q75 224 150 238T300 232T450 242T600 230" fill="none" stroke="#e8e1cf" strokeWidth="4" strokeLinecap="round" strokeDasharray="0.1 9" />
        </g>
        <g {...layer(1)}>
          <g filter="url(#mp-soft)">
            <ellipse cx="305" cy="330" rx="95" ry="80" fill="url(#mp-spot)" />
            <ellipse cx="258" cy="250" rx="55" ry="65" fill="url(#mp-spot)" />
            <ellipse cx="370" cy="385" rx="80" ry="45" fill="url(#mp-spot)" />
          </g>
          <path d="M296 130l6 40-5 45 8 50-6 55 7 55-4 45" fill="none" stroke="#0e1310" strokeWidth="2.5" strokeOpacity="0.7" />
        </g>
        <g {...layer(2)}>
          <ellipse cx="112" cy="232" rx="58" ry="92" fill="url(#mp-spot)" filter="url(#mp-soft)" />
        </g>
        <g {...layer(3)}>
          <g filter="url(#mp-soft)">
            <circle cx="600" cy="0" r="170" fill="url(#mp-spot)" />
            <rect x="385" y="36" width="160" height="148" rx="10" fill="none" stroke="#e8b04c" strokeOpacity="0.8" strokeWidth="22" />
          </g>
          {SPECKLES.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#1a211d" opacity="0.75" />
          ))}
        </g>
      </g>
      {/* window, pipe run, floor */}
      <rect x="400" y="50" width="130" height="120" fill="#27343c" stroke="#c8c2b3" strokeWidth="6" />
      <path d="M465 50V170" stroke="#c8c2b3" strokeWidth="4" />
      <path d="M0 70H112V420" fill="none" stroke="#c8c2b3" strokeWidth="10" strokeLinejoin="round" />
      <rect x="102" y="200" width="20" height="16" rx="3" fill="#a9a293" />
      <rect y="420" width="600" height="40" fill="#8d887c" />
      <g className="font-mono" fontSize="14" fill="#f3f1ec">
        {[
          [420, "0 m"],
          [220, "1 m"],
          [20, "2 m"],
        ].map(([y, t]) => (
          <g key={t}>
            <path d={`M0 ${y}H14`} stroke="#f3f1ec" strokeWidth="2" />
            <text x="18" y={Number(y) + (y === 420 ? -6 : 5)}>
              {t}
            </text>
          </g>
        ))}
        <text x="590" y="448" textAnchor="end" fill="#1a211d">
          Kellerboden, Wand zum Erdreich, etwa 3 m breit
        </text>
      </g>
    </svg>
  );
}

function DepthSvg({ methods }: { methods: MethodKey[] }) {
  const on = (k: MethodKey) => methods.includes(k);
  const col = (k: MethodKey) => (on(k) ? "currentColor" : "#5b665f");
  return (
    <svg viewBox="0 0 360 200" className="h-auto w-full" role="img" aria-label="Messtiefe: welche Methode wo im Wandquerschnitt misst">
      <rect x="30" y="0" width="70" height="200" fill="#d8d1c2" opacity="0.85" />
      <rect x="100" y="0" width="120" height="200" fill="#8a5a46" opacity="0.85" />
      <rect x="220" y="0" width="140" height="200" fill="#6d4536" opacity="0.85" />
      <g className="font-mono" fontSize="11">
        <text x="65" y="18" textAnchor="middle" fill="#1a211d">
          <tspan x="65">Oberfläche</tspan>
          <tspan x="65" dy="13">/ Putz</tspan>
        </text>
        <text x="160" y="18" textAnchor="middle" fill="#f3f1ec">
          <tspan x="160">Mauerwerk</tspan>
          <tspan x="160" dy="13">außen</tspan>
        </text>
        <text x="290" y="24" textAnchor="middle" fill="#f3f1ec">
          Mauerwerkskern
        </text>
        {[1, 2, 3].map((n, i) => (
          <text key={n} x="12" y={80 + i * 45} textAnchor="middle" fill="#f3f1ec">
            {n}
          </text>
        ))}
      </g>
      <defs>
        <linearGradient id="mp-kap" x1="0" x2="1">
          <stop offset="0" stopColor={col("kap")} />
          <stop offset="1" stopColor={col("kap")} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="30" y="68" width="130" height="16" rx="8" fill="url(#mp-kap)" />
      <path d="M30 121H260" stroke={col("cm")} strokeWidth="3" strokeDasharray="6 5" />
      <rect x="215" y="112" width="45" height="18" rx="4" fill={col("cm")} />
      <rect x="30" y="156" width="325" height="20" rx="10" fill={col("darr")} opacity="0.9" />
      <path d="M60 156v20M120 156v20M180 156v20M240 156v20M300 156v20" stroke="#0e1310" strokeOpacity="0.35" />
    </svg>
  );
}

export default function MoisturePatterns() {
  const uid = useId();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = PATTERNS[active];

  const onKey = (e: React.KeyboardEvent) => {
    const n = PATTERNS.length;
    const map: Record<string, number> = {
      ArrowRight: (active + 1) % n,
      ArrowDown: (active + 1) % n,
      ArrowLeft: (active - 1 + n) % n,
      ArrowUp: (active - 1 + n) % n,
      Home: 0,
      End: n - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    setActive(map[e.key]);
    tabs.current[map[e.key]]?.focus();
  };

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Typische Feuchtebilder" className="flex flex-wrap gap-2" onKeyDown={onKey}>
        {PATTERNS.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`${uid}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls={`${uid}-panel`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold motion-safe:transition-colors ${
              active === i
                ? "border-accent-deep bg-accent-deep text-[var(--ink)]"
                : "border-line/20 text-[var(--bone)] hover:border-accent-deep"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${active}`}
        className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start"
      >
        <figure className="rounded-[22px] border border-line/10 bg-[var(--ink-2)] p-4 sm:p-6">
          <WallSvg active={active} title={`Schematische Kellerwand mit Feuchtebild: ${p.label}`} />
          <div className="mt-4" aria-hidden="true">
            <div className="h-2 rounded-full" style={{ background: "linear-gradient(90deg,currentColor,#e8b04c,#3b6ea8)" }} />
            <div className="mt-1 flex justify-between font-mono text-[11px] text-[var(--sc-ink-soft)]">
              <span>trocken</span>
              <span>feucht</span>
              <span>nass</span>
            </div>
          </div>
          <figcaption className="mt-3 text-xs text-[var(--sc-ink-soft)]">
            Schematische Darstellung. Die tatsächliche Ursache klärt die Messung vor Ort.
          </figcaption>
        </figure>

        <div className="rounded-[22px] border border-line/10 bg-[var(--ink-2)] p-5 sm:p-8" aria-live="polite">
          <p className="sc-label">Feuchtebild</p>
          <h3 className="mt-2 font-editorial text-2xl leading-tight sm:text-3xl">{p.label}</h3>
          <p className="mt-3 text-[var(--sc-ink-soft)]">{p.diagnosis}</p>
          <p className="sc-label mt-6">Woran Sie es erkennen</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {p.signs.map((s) => (
              <li key={s} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-deep" />
                <span className="text-[var(--bone-2)]">{s}</span>
              </li>
            ))}
          </ul>
          <p className="sc-label mt-6">Was wir messen</p>
          <p className="mt-2 text-sm text-[var(--bone-2)]">{p.measure}</p>
          <p className="sc-label mt-6">Nächster Schritt</p>
          <p className="mt-2 text-sm text-[var(--bone-2)]">{p.next}</p>
          <a
            href={p.href}
            className="mt-5 inline-flex min-h-[48px] w-full items-center justify-between gap-3 rounded-full bg-[var(--bone)] px-5 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-surface"
          >
            {p.cta} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="grid gap-6 rounded-[22px] border border-line/10 bg-[var(--ink-2)] p-5 sm:p-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="sc-label">Messtiefe</p>
          <p className="mt-2 text-sm text-[var(--sc-ink-soft)]">
            Welche Methode wo in der Wand misst. Hervorgehoben: typisch beim Feuchtebild „{p.label}“.
          </p>
          <div className="mt-4">
            <DepthSvg methods={p.methods} />
          </div>
        </div>
        <ol className="flex flex-col gap-3">
          {METHODS.map((m, i) => {
            const on = p.methods.includes(m.key);
            return (
              <li
                key={m.key}
                className={`flex gap-3 rounded-2xl border p-3 motion-safe:transition-colors ${
                  on ? "border-accent-deep bg-[var(--ink-3)]" : "border-line/10"
                }`}
                style={{ textAlign: "start" }}
              >
                <span className={`font-mono text-sm ${on ? "text-accent-deep" : "text-[var(--sc-ink-soft)]"}`}>{i + 1}</span>
                <span>
                  <strong className="block text-sm">{m.name}</strong>
                  <span className="text-sm text-[var(--sc-ink-soft)]">{m.text}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
