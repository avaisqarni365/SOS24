/**
 * sos-abdichtung mark: a wall section of three brick courses, a mint
 * horizontal barrier across its foot, and a water drop below it that the
 * barrier cuts flat. The whole trade in one glyph: water stops at the line.
 */
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="48" height="48" rx="11" fill="#0e1310" />
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="10.25" fill="none" stroke="#62c4ac" strokeOpacity="0.28" strokeWidth="1.5" />
      {/* brick courses */}
      <g fill="#f3f1ec">
        <rect x="9" y="9" width="14" height="5.5" rx="1.2" />
        <rect x="25" y="9" width="14" height="5.5" rx="1.2" />
        <rect x="9" y="16.5" width="7" height="5.5" rx="1.2" opacity="0.8" />
        <rect x="18" y="16.5" width="14" height="5.5" rx="1.2" opacity="0.8" />
        <rect x="34" y="16.5" width="5" height="5.5" rx="1.2" opacity="0.8" />
        <rect x="9" y="24" width="14" height="5.5" rx="1.2" opacity="0.6" />
        <rect x="25" y="24" width="14" height="5.5" rx="1.2" opacity="0.6" />
      </g>
      {/* the barrier */}
      <rect x="6" y="31.5" width="36" height="3.5" rx="1.75" fill="#62c4ac" />
      {/* the drop, cut flat by the barrier */}
      <path d="M24 44.5c-3.3 0-5.8-2.4-5.8-5.5 0-1.1.4-2.2 1-3.2h9.6c.6 1 1 2.1 1 3.2 0 3.1-2.5 5.5-5.8 5.5z" fill="#3b82c4" />
    </svg>
  );
}

export default function Logo({ tone = "light", sub }: { tone?: "light" | "dark"; sub?: string }) {
  const ink = tone === "light" ? "text-[var(--bone)]" : "text-[var(--head-on-bone)]";
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={34} />
      <span className={`flex flex-col leading-none ${ink}`}>
        <span className="font-sans text-[1.05rem] font-semibold tracking-[-0.01em]">
          <span className="font-extrabold tracking-[0.06em]">sos</span>
          <span className="text-[var(--mint)]">-</span>abdichtung
        </span>
        {sub ? (
          <span className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] opacity-60 max-[379px]:hidden">{sub}</span>
        ) : null}
      </span>
    </span>
  );
}
