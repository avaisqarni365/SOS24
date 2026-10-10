import { PartnerLink, PartnerText, PartnerBadge } from "@/components/brand/PartnerLink";
import { MessageCircle } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";
import HeroCine from "@/components/scroll/HeroCine";
import FactsStrip from "@/components/sections/FactsStrip";

export const CTA_LABEL = "Kostenlose Feuchtemessung anfragen";

/**
 * Hero: one typographic statement over the image film, full width and
 * silent (HeroCine). The 3D cut-away belongs in the Scientific Lab.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="hero band-ink"
      aria-labelledby="hero-title"
    >
      <HeroCine />
      <div className="hero__stage">
        <div className="hero__back" data-hero-plane="back" aria-hidden="true" />
        <div className="hero__grid">
          <div className="hero__copy">
          <p className="sc-label">
            <PartnerLink>SchimmelPeter® Partnerbetrieb</PartnerLink> · Wuppertal &amp; Bergisches Land
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
              className="hero__btn hero__btn--ghost hero__btn--wa"
            >
              <MessageCircle className="hero__btn-wa" aria-hidden="true" />
              <span className="hero__btn-k">WhatsApp</span>
              <span className="hero__btn-v">Foto der Wand senden</span>
            </a>
          </div>

          <FactsStrip inHero />
        </div>
        </div>
      </div>
    </section>
  );
}

