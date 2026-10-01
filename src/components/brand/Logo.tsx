/**
 * sos-abdichtung mark: a wall section of brick courses on an emerald tile, a
 * luminous horizontal barrier across its foot, and a water drop below it that
 * the barrier cuts flat. The whole trade in one glyph: water stops at the
 * line. Reads the same on light and dark grounds.
 */
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sos-tile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a9a80" />
          <stop offset="1" stopColor="#15594b" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#sos-tile)" />
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="11.25" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.5" />
      <g fill="#ffffff">
        <rect x="9" y="9" width="14" height="5.5" rx="1.4" />
        <rect x="25" y="9" width="14" height="5.5" rx="1.4" />
        <rect x="9" y="16.5" width="7" height="5.5" rx="1.4" opacity="0.85" />
        <rect x="18" y="16.5" width="14" height="5.5" rx="1.4" opacity="0.85" />
        <rect x="34" y="16.5" width="5" height="5.5" rx="1.4" opacity="0.85" />
        <rect x="9" y="24" width="14" height="5.5" rx="1.4" opacity="0.7" />
        <rect x="25" y="24" width="14" height="5.5" rx="1.4" opacity="0.7" />
      </g>
      <rect x="6" y="31.5" width="36" height="3.5" rx="1.75" fill="#8ff0d6" />
      <path d="M24 44.5c-3.3 0-5.8-2.4-5.8-5.5 0-1.1.4-2.2 1-3.2h9.6c.6 1 1 2.1 1 3.2 0 3.1-2.5 5.5-5.8 5.5z" fill="#7cc4ff" />
    </svg>
  );
}

export default function Logo({ tone = "auto", sub }: { tone?: "auto" | "light" | "dark"; sub?: string }) {
  const ink =
    tone === "dark" ? "text-[var(--head-on-bone)]" : tone === "light" ? "text-[#f3f1ec]" : "text-[var(--bone)]";
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={42} />
      <span className={`flex flex-col leading-none ${ink}`}>
        <span className="font-sans text-[1.25rem] font-semibold tracking-[-0.015em]">
          <span className="font-bold tracking-[0.02em] text-[var(--mint)]">sos</span>
          <span className="opacity-50">-</span>abdichtung
        </span>
        {sub ? (
          <span className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] opacity-70 max-[379px]:hidden">{sub}</span>
        ) : null}
      </span>
    </span>
  );
}
