import type { ReactNode } from "react";
import { PARTNER_URL } from "@/lib/site";

/** A link to our partner page at SchimmelPeter, in a new tab. */
export function PartnerLink({ children, className = "", label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <a href={PARTNER_URL} target="_blank" rel="noopener" className={`partner-link ${className}`} aria-label={label}>
      {children}
    </a>
  );
}

// the name may carry soft hyphens from the build-time hyphenation
const NAME = new RegExp(`(${"SchimmelPeter".split("").join("­?")}®?)`);

/** A text with every "SchimmelPeter" in it linked to the partner page. */
export function PartnerText({ text }: { text: string }) {
  const parts = text.split(NAME);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <PartnerLink key={i}>{p}</PartnerLink> : p))}
    </>
  );
}

/** The certified-partner badge, linked to the partner page. */
export function PartnerBadge({ className = "", height = 82 }: { className?: string; height?: number }) {
  return (
    <PartnerLink className={`partner-badge ${className}`} label="SchimmelPeter® Zertifizierter Fachbetrieb: unsere Partnerseite (neues Fenster)">
      <img
        src="/img/gallery/schimmelpeter-fachbetrieb.svg"
        width={Math.round((height * 225) / 82)}
        height={height}
        alt="SchimmelPeter® Zertifizierter Fachbetrieb"
        loading="lazy"
      />
    </PartnerLink>
  );
}
