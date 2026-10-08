import { useId } from "react";

/**
 * SOS ABDICHTUNG — the brand lockup, drawn to the identity renders.
 *
 * Construction, top to bottom: a roof band with its chimney on the right
 * slope; the water drop hanging under the apex; SOS set large, with the
 * middle O a ring holding the same drop; "- ABDICHTUNG -" ruled either side.
 *
 * Finish: the renders are never flat navy — every surface carries a vertical
 * light (lighter at the top) and each drop has a gloss spot. The gradients
 * read their stops from CSS custom properties, so the same artwork is navy
 * with shine on paper and white-metal with shine on the dark plates, without
 * a second file.
 */
export function LogoLockup({ height = 64, className = "" }: { height?: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const ink = `lk-${uid}`;
  const drop = `ld-${uid}`;
  return (
    <svg
      height={height}
      viewBox="0 0 200 126"
      className={`logo-lockup ${className}`}
      role="img"
      aria-label="SOS Abdichtung"
      fill="none"
      style={{ width: "auto" }}
    >
      <defs>
        <linearGradient id={ink} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--lk-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--lk-b)" }} />
        </linearGradient>
        <linearGradient id={drop} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--ld-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--ld-b)" }} />
        </linearGradient>
      </defs>

      {/* chimney on the right slope, drawn first so the roof band closes it */}
      <rect x="138" y="14" width="14" height="30" rx="1" fill={`url(#${ink})`} />

      {/* the roof band, with a thin catch of light along its top edge */}
      <path d="M14 52 100 2l86 50h-18L100 25 32 52Z" fill={`url(#${ink})`} />
      <path d="M15.5 51 100 2l84.5 49" stroke="#ffffff" strokeOpacity="0.3" strokeWidth="2.2" strokeLinejoin="round" />

      {/* the drop under the apex, glossed */}
      <path
        d="M100 23c0 0 10.5 12.6 10.5 18.4a10.5 10.5 0 0 1-21 0C89.5 35.6 100 23 100 23Z"
        fill={`url(#${drop})`}
      />
      <ellipse cx="95.6" cy="36" rx="2.7" ry="4.4" fill="#ffffff" opacity="0.8" transform="rotate(-16 95.6 36)" />

      {/* SOS — the middle O is drawn as a ring so it can hold the drop */}
      <text x="40" y="96" textAnchor="middle" className="logo-lockup__s" fill={`url(#${ink})`}>S</text>
      <circle cx="100" cy="72" r="26" stroke={`url(#${ink})`} strokeWidth="16" />
      <path
        d="M100 56c0 0 9 10.8 9 15.8a9 9 0 0 1-18 0c0-5 9-15.8 9-15.8Z"
        fill={`url(#${drop})`}
      />
      <ellipse cx="96.4" cy="67" rx="2.3" ry="3.7" fill="#ffffff" opacity="0.85" transform="rotate(-16 96.4 67)" />
      <text x="160" y="96" textAnchor="middle" className="logo-lockup__s" fill={`url(#${ink})`}>S</text>

      {/* - ABDICHTUNG - */}
      <rect x="5" y="111" width="15" height="3.2" rx="1.6" fill={`url(#${ink})`} />
      <rect x="180" y="111" width="15" height="3.2" rx="1.6" fill={`url(#${ink})`} />
      <text x="100" y="118" textAnchor="middle" className="logo-lockup__w" fill={`url(#${ink})`}>ABDICHTUNG</text>
    </svg>
  );
}

/** The mark alone, same finish, for favicon-sized contexts. */
export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const ink = `mk-${uid}`;
  const drop = `md-${uid}`;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false" fill="none">
      <defs>
        <linearGradient id={ink} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--lk-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--lk-b)" }} />
        </linearGradient>
        <linearGradient id={drop} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--ld-a)" }} />
          <stop offset="1" style={{ stopColor: "var(--ld-b)" }} />
        </linearGradient>
      </defs>
      <rect x="32.6" y="10.2" width="5.4" height="12.4" rx="0.8" fill={`url(#${ink})`} />
      <path d="M2.6 31.4 24 8.6l21.4 22.8h-7.2L24 17.4 9.8 31.4Z" fill={`url(#${ink})`} />
      <path
        d="M24 18.8c0 0 5.9 7.1 5.9 10.7a5.9 5.9 0 0 1-11.8 0c0-3.6 5.9-10.7 5.9-10.7Z"
        fill={`url(#${drop})`}
      />
      <ellipse cx="21.6" cy="26.4" rx="1.4" ry="2.3" fill="#ffffff" opacity="0.8" transform="rotate(-16 21.6 26.4)" />
    </svg>
  );
}

/**
 * The navigation lock — the "new way" for the header.
 *
 * The full emblem (roof over SOS over ABDICHTUNG) is a poster mark: at 60px
 * its ten shapes and gradients blur into each other. Navigation needs the
 * opposite: a flat, compact mark and a one-line wordmark, sharp at any size.
 * The mark keeps the identity's three ideas -- roof, chimney, drop -- in
 * solid fills: the silhouette in the surface ink, the drop in the water blue.
 */
function MarkNav({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none">
      <rect x="32.6" y="10.2" width="5.6" height="12.6" rx="0.8" fill="currentColor" />
      <path d="M2.6 31.4 24 8.6l21.4 22.8h-7.2L24 17.4 9.8 31.4Z" fill="currentColor" />
      <path
        d="M24 19.4c0 0 6.2 7.4 6.2 11.2a6.2 6.2 0 0 1-12.4 0c0-3.8 6.2-11.2 6.2-11.2Z"
        fill="var(--logo-drop)"
      />
    </svg>
  );
}

export default function Logo({ tone = "auto", sub }: { tone?: "auto" | "light" | "dark"; sub?: string }) {
  return (
    <span className="logo">
      <MarkNav size={36} />
      <span className="logo__line">
        <strong>SOS</strong> Abdichtung
      </span>
    </span>
  );
}
