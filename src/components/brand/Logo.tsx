import { useId } from "react";

/**
 * sos-abdichtung mark: a house in section. The brick-red roof stands for the
 * whole building, the dark walls for the cellar, and inside it three green
 * layers, the trade itself: sealed layer by layer. Reads at 16 px and on
 * light and dark grounds (the walls take the text colour).
 */
export function LogoMark({ size = 32, className = "" }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`roof-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d8664d" />
          <stop offset="1" stopColor="#ad3c2e" />
        </linearGradient>
      </defs>
      <path d="M6.5 21 24 6.5 41.5 21" fill="none" stroke={`url(#roof-${id})`} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M10.5 22.5V40.5a3 3 0 0 0 3 3h21a3 3 0 0 0 3-3V22.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <rect x="15" y="26.5" width="18" height="3.6" rx="1.8" fill="#2bab8a" />
      <rect x="15" y="31.6" width="18" height="3.6" rx="1.8" fill="#1a8768" />
      <rect x="15" y="36.7" width="18" height="3.6" rx="1.8" fill="#0f5c49" />
    </svg>
  );
}

export default function Logo({ tone = "auto", sub }: { tone?: "auto" | "light" | "dark"; sub?: string }) {
  const ink =
    tone === "dark" ? "text-[var(--head-on-bone)]" : tone === "light" ? "text-[#f3f1ec]" : "text-[var(--bone)]";
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={42} className="shrink-0" />
      <span className={`flex flex-col leading-none ${ink}`}>
        <span className="font-sans text-[1.25rem] font-semibold tracking-[-0.015em]">
          <span className="logo-sos font-bold tracking-[0.01em]">sos</span>-abdichtung
        </span>
        {sub ? (
          <span className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] opacity-70 max-[379px]:hidden">{sub}</span>
        ) : null}
      </span>
    </span>
  );
}
