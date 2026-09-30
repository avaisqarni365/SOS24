import { COMPANY_INFO } from "@/data/content-data";
import { hy } from "@/lib/hyphenate";

export const CTA_LABEL = "Kostenlose Feuchtemessung anfragen";

/**
 * Hero: the promise on the left, the problem on the right. The house is a
 * render of the same 3D model the "Schicht für Schicht" act takes apart
 * further down, so the page stays in one visual world from the first frame.
 * Planes: a calm back glow, the house (subject), the copy on top.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="hero"
      aria-labelledby="hero-title"
      data-sc-act="pin"
      data-sc-span="1.3"
      data-sc-drift="#0e1310"
      style={{ ["--sc-span" as string]: 1.3 }}
    >
      <div data-sc-stage className="hero__stage">
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
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-[var(--bone)] hover:border-[var(--mint)]"
            >
              {COMPANY_INFO.phoneDisplay}
            </a>
          </div>
          <a href="#schicht-fuer-schicht" className="hero__3d">
            <span aria-hidden="true">⟲</span> Das Haus in 3D drehen, Schicht für Schicht
          </a>
        </div>
          <figure className="hero__house" data-hero-plane="subject">
            <img
              src="/img/hero-house-1400.webp"
              srcSet="/img/hero-house-760.webp 760w, /img/hero-house-1400.webp 1400w"
              sizes="(max-width: 860px) 88vw, 46vw"
              width={1400}
              height={1367}
              alt="Schnittmodell eines Hauses mit nassem Keller: Wasser steht auf dem Kellerboden, die Wand ist bis zu einem weißen Salzrand durchfeuchtet."
              fetchPriority="high"
              decoding="async"
            />
            <figcaption className="hero__marks" aria-hidden="true">
              <span className="hero__mark" style={{ left: "43%", top: "73%" }}>
                Wasser am Boden
              </span>
              <span className="hero__mark hero__mark--left" style={{ left: "20%", top: "58%" }}>
                Salzrand in der Wand
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
