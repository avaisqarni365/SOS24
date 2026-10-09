"use client";

import { PartnerLink } from "@/components/brand/PartnerLink";

import { useState } from "react";
import { PHOTOS } from "@/data/photos";
import type { Cause } from "@/data/causes";

function Section({ active, causes: CAUSES }: { active: number; causes: Cause[] }) {
  return (
    <svg data-i18n="" viewBox="0 0 1000 620" className="h-auto w-full" role="img" aria-label="Querschnitt durch einen Keller mit vier Ursachen für Feuchtigkeit">
      <defs>
        <linearGradient id="ch-damp" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3b6ea8" stopOpacity="0.8" />
          <stop offset="1" stopColor="#3b6ea8" stopOpacity="0" />
        </linearGradient>
        <pattern id="ch-brick" width="36" height="18" patternUnits="userSpaceOnUse">
          <rect width="36" height="18" fill="#9a6b4b" />
          <path d="M0 .5H36M0 9.5H36M18 0V9M0 9V18M36 9V18" stroke="#6e4a33" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="1000" height="620" fill="#141b17" />
      {/* soil left, ground line, grass */}
      <rect x="0" y="150" width="290" height="470" fill="#3a2f22" />
      <rect x="0" y="146" width="290" height="8" fill="#3f5b37" />
      <rect x="0" y="560" width="290" height="60" fill="#3b6ea8" opacity="0.35" />
      {/* house above ground */}
      <rect x="290" y="20" width="620" height="130" fill="#26322c" />
      <rect x="360" y="50" width="70" height="70" fill="#f1cf7a" opacity="0.5" />
      <rect x="520" y="50" width="70" height="70" fill="#f1cf7a" opacity="0.25" />
      <rect x="290" y="150" width="620" height="22" fill="#5c5a55" />
      {/* basement wall + room */}
      <rect x="290" y="172" width="56" height="400" fill="url(#ch-brick)" />
      <rect x="346" y="172" width="564" height="400" fill="#1f2925" />
      <rect x="290" y="572" width="620" height="30" fill="#5c5a55" />
      <rect x="290" y="440" width="56" height="132" fill="url(#ch-damp)" />
      {/* vertical barrier (dark, broken) on the soil side */}
      <path d="M286 172 V330 M286 360 V572" stroke="#101010" strokeWidth="6" />
      {/* crack */}
      <path d="M300 200 L312 228 L304 256 L322 290" stroke="#0e1310" strokeWidth="5" fill="none" />
      {/* drainage pipe (blocked) */}
      <circle cx="232" cy="575" r="16" fill="none" stroke="#aeb6b0" strokeWidth="5" />
      <path d="M220 575 H244" stroke="#7a6146" strokeWidth="8" />
      {/* water paths */}
      <path d="M150 330 H280" stroke="#5a8fc4" strokeWidth="5" strokeDasharray="10 10" markerEnd="" />
      <path d="M318 600 V470" stroke="#5a8fc4" strokeWidth="5" strokeDasharray="10 10" />
      <text x="620" y="380" textAnchor="middle" fill="#aeb6b0" fontSize="26" fontFamily="ui-monospace, monospace">
        Kellerraum
      </text>
      <text x="140" y="200" textAnchor="middle" fill="#aeb6b0" fontSize="22" fontFamily="ui-monospace, monospace">
        Erdreich
      </text>
      {CAUSES.map((c, i) => (
        <g key={c.id}>
          <circle cx={c.x} cy={c.y} r={active === i ? 26 : 20} fill={active === i ? "currentColor" : "#f3f1ec"} stroke="#0e1310" strokeWidth="4" />
          <text x={c.x} y={c.y + 8} textAnchor="middle" fontSize="22" fontWeight="700" fill="#0e1310" fontFamily="ui-monospace, monospace">
            {c.n}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function CausesHouseClient({ causes: CAUSES }: { causes: Cause[] }) {
  const [active, setActive] = useState(0);
  const c = CAUSES[active];
  const p = PHOTOS[c.photo];
  return (
    <div className="sc-wrap pb-12 sm:pb-16">
      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
        <div className="relative self-start overflow-hidden rounded-[22px] border border-line/10">
          <Section active={active} causes={CAUSES} />
          {/* real buttons over the hotspots, for mouse, touch and keyboard */}
          {CAUSES.map((cause, i) => (
            <button
              key={cause.id}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              aria-label={`Ursache ${cause.n}: ${cause.title}`}
              className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-12 sm:w-12"
              style={{ left: `${(cause.x / 1000) * 100}%`, top: `${(cause.y / 620) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-5 rounded-[22px] border border-line/10 bg-[var(--ink-2)] p-6 sm:p-7" aria-live="polite">
          <figure className="m-0 overflow-hidden rounded-2xl">
            <img src={p.src} width={p.w} height={p.h} alt={p.alt} loading="lazy" decoding="async" className="h-auto w-full" />
            <figcaption className="mt-1 text-right text-[0.7rem] text-[var(--sc-ink-soft)]">Foto: <PartnerLink>SchimmelPeter®</PartnerLink></figcaption>
          </figure>
          <div>
            <p className="sc-label">Ursache {c.n} von 4</p>
            <h3 className="mt-2 font-editorial text-3xl leading-tight">{c.title}</h3>
            <p className="mt-3 text-[var(--sc-ink-soft)]">{c.what}</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-[var(--bone)]">Woran Sie es erkennen</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {c.signs.map((s) => (
                <li key={s} className="no-justify rounded-full border border-line/10 px-3 py-1.5 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[var(--bone)]">
            <strong>Lösung:</strong> {c.fix}
          </p>
          <a href={c.href} className="inline-flex min-h-[48px] items-center justify-between rounded-full bg-[var(--bone)] px-5 text-sm font-semibold text-[var(--ground)] hover:bg-surface">
            {c.cta} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CAUSES.map((cause, i) => (
          <li key={cause.id}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={active === i}
              className={`flex h-full w-full items-start gap-3 rounded-2xl border p-4 text-left ${active === i ? "border-accent-deep bg-[var(--ink-3)]" : "border-line/10 bg-[var(--ink-2)]"}`}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--bone)] font-mono text-sm font-bold text-[var(--ground)]">{cause.n}</span>
              <span>
                <span className="block font-semibold">{cause.title}</span>
                <span className="mt-1 block text-sm text-[var(--sc-ink-soft)]">{cause.fix}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
