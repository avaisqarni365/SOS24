import { COMPANY_INFO } from "@/data/content-data";
import HeroFilm from "@/components/scroll/HeroFilm";

export const CTA_LABEL = "Kostenlose Feuchtemessung anfragen";

/**
 * Hero: one typographic statement, and beside it the short image film
 * (HeroFilm). The 3D cut-away belongs in the Scientific Lab.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="hero band-ink"
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
            <em>Trocken, Schicht für Schicht.</em>
          </h1>
          <p className="sc-lede mt-6">
            Wir stoppen aufsteigende Feuchtigkeit von innen — ohne Bagger, ohne
            aufgerissenen Garten.
          </p>

          {/* Two taps, side by side: the call for anyone who wants it dealt
              with now, WhatsApp for anyone who would rather send a photo. */}
          <div className="hero__cta mt-8">
            <a href={`tel:${COMPANY_INFO.phoneTel}`} className="hero__btn hero__btn--solid">
              <span className="hero__btn-k">Jetzt anrufen</span>
              <span className="hero__btn-v">{COMPANY_INFO.phoneDisplay}</span>
            </a>
            <a
              href={COMPANY_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hero__btn hero__btn--ghost"
            >
              <span className="hero__btn-k">WhatsApp</span>
              <span className="hero__btn-v">Foto der Wand senden</span>
            </a>
          </div>

          <ul className="hero__facts mt-9">
            <li>Messung vor Ort kostenlos</li>
            <li>10 Jahre Garantie</li>
            <li>Ohne Aufgraben</li>
          </ul>
        </div>
        <HeroFilm />
        </div>
      </div>
    </section>
  );
}

