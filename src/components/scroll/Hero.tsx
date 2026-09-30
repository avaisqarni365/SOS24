import { COMPANY_INFO } from "@/data/content-data";
import { hy } from "@/lib/hyphenate";

export const CTA_LABEL = "Kostenlose Feuchtemessung anfragen";

/**
 * Hero: the promise on the left, the problem on the right: a Keller in
 * section with the damage marked. A static first frame; the next section
 * ("Vom Keller bis in die Pore") goes from the Sockel down to the pore.
 * Planes: a calm back glow, the Keller (subject), the copy on top.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="hero"
      aria-labelledby="hero-title"
    >
      <div className="hero__stage">
        <div className="hero__back" data-hero-plane="back" aria-hidden="true" />
        <div className="hero__grid">
          <div className="hero__copy">
          <p className="sc-label">
            SchimmelPeter® Partnerbetrieb · Wuppertal &amp; Bergisches Land
          </p>
          <h1
            id="hero-title"
            className="sc-display hero__title mt-5"
          >
            Kellersanierung Wuppertal.{" "}
            <em className="text-[var(--mint)]">Trocken, Schicht für Schicht.</em>
          </h1>
          <p className="sc-lede mt-6 text-[var(--sc-ink-soft)]">
            {hy("Wir stoppen aufsteigende Feuchtigkeit dort, wo sie entsteht: von innen, ohne Bagger und ohne aufgerissenen Garten. Mit kostenloser Feuchtemessung vor Ort, 10 Jahren Garantie auf unsere Arbeit und 25 Jahren Produktgarantie von SchimmelPeter.")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#kontakt"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[var(--bone)] px-6 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-white"
            >
              {CTA_LABEL} <span aria-hidden="true">→</span>
            </a>
            <a
              href={`tel:${COMPANY_INFO.phoneTel}`}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-line/20 px-6 py-3 text-sm font-semibold text-[var(--bone)] hover:border-[var(--mint)]"
            >
              {COMPANY_INFO.phoneDisplay}
            </a>
          </div>
          <a href="#schicht-fuer-schicht" className="hero__3d">
            <span aria-hidden="true">⟲</span> Keller, Garage und Wohnraum in 3D: Schicht für Schicht
          </a>
        </div>
          <figure className="hero__house" data-hero-plane="subject">
            <img
              src="/img/hero-house-1400.webp"
              srcSet="/img/hero-house-760.webp 760w, /img/hero-house-1400.webp 1400w"
              sizes="(max-width: 860px) 88vw, 46vw"
              width={1400}
              height={1032}
              alt="Schnittmodell eines nassen Kellers: Wasser steht auf dem Boden, die Wände sind bis zu einem weißen Salzrand durchfeuchtet."
              fetchPriority="high"
              decoding="async"
            />
            {/* Callouts in the picture's own pixel grid (1400 x 1032). */}
            <svg className="hero__callouts" viewBox="0 0 1400 1032" aria-hidden="true">
              <g className="hero__callout hero__callout--a">
                <rect x="120" y="264" width="276" height="112" rx="10" />
                <path d="M190 264 L150 176" />
              </g>
              <g className="hero__callout hero__callout--b">
                <ellipse cx="646" cy="630" rx="170" ry="84" />
                <path d="M580 712 L540 820" />
              </g>
              <g className="hero__callout hero__callout--c">
                <rect x="814" y="520" width="100" height="86" rx="8" />
                <path d="M914 580 L956 604" />
              </g>
            </svg>
            <figcaption className="hero__tags theme-dark" aria-hidden="true">
              <span className="hero__tag hero__tag--a" style={{ left: "3%", top: "13%" }}>
                Salzrand in der Wand
              </span>
              <span className="hero__tag hero__tag--b" style={{ left: "27%", top: "80%" }}>
                Wasser am Boden
              </span>
              <span className="hero__tag hero__tag--c" style={{ left: "68.3%", top: "57%" }}>
                Sockel, 0 bis 1 m
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
