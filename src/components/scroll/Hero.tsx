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
            {/* A short loop rendered from the same 3D model (white ground, so it
                sits in the light page). Dark mode and reduced motion show the
                still picture. Written as HTML so "muted" is in the markup and
                the loop starts before hydration. */}
            <div
              className="hero__video"
              dangerouslySetInnerHTML={{
                __html:
                  '<video autoplay muted loop playsinline preload="auto" width="1152" height="850" poster="/img/hero-keller-poster.webp" aria-label="Schnittmodell eines nassen Kellers, langsam gedreht: Wasser auf dem Boden, Wände bis zum Salzrand durchfeuchtet."><source src="/video/hero-keller.webm" type="video/webm"><source src="/video/hero-keller.mp4" type="video/mp4"></video>',
              }}
            />
            <img
              className="hero__still"
              src="/img/hero-house-1400.webp"
              srcSet="/img/hero-house-760.webp 760w, /img/hero-house-1400.webp 1400w"
              sizes="(max-width: 860px) 88vw, 36rem"
              width={1400}
              height={1032}
              alt="Schnittmodell eines nassen Kellers: Wasser steht auf dem Boden, die Wände sind bis zu einem weißen Salzrand durchfeuchtet."
              loading="lazy"
              decoding="async"
            />
            <figcaption className="hero__legend">
              <span>
                <i style={{ background: "#e8e1cf" }} aria-hidden="true" />
                Salzrand in der Wand
              </span>
              <span>
                <i style={{ background: "#3b6ea8" }} aria-hidden="true" />
                Wasser am Boden
              </span>
              <span>
                <i style={{ background: "#9a6b4b" }} aria-hidden="true" />
                Sockel, 0 bis 1 m durchfeuchtet
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
