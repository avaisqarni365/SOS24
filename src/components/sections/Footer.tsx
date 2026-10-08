import { PartnerLink, PartnerText, PartnerBadge } from "@/components/brand/PartnerLink";
import { Phone, MessageCircle, Mail, MapPin, ArrowRight } from "lucide-react";
import { SHOTS } from "@/components/brand/BrandShot";
import { COMPANY_INFO } from "@/data/content-data";
import { SERVICE_CARDS } from "@/data/services";
import { CITY_PAGES } from "@/data/seo-pages";
import Logo from "@/components/brand/Logo";
import { hy } from "@/lib/hyphenate";

const PAGES: [string, string][] = [
  ["/labor/", "Scientific Lab"],
  ["/galerie/", "Galerie"],
  ["/kostenrechner/", "Angebotsrechner"],
  ["/leistungen/#servicegebiet", "Servicegebiet"],
  ["/leistungen/#faq", "Häufige Fragen"],
  ["/kontakt/", "Kontakt"],
];

/**
 * The footer: the service van as its background on one side, fading into
 * the page; over it the brand and the way in (the contact page as one
 * button, the two direct lines beside it); below, four columns of links.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__bg" aria-hidden="true">
        <img src={SHOTS.van.src} width={SHOTS.van.w} height={SHOTS.van.h} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="sc-wrap">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Logo />
            <p className="site-footer__claim">Schützt, was wichtig ist!</p>
            <p className="site-footer__about">
              {hy("Fachbetrieb für Kellersanierung, Horizontalsperren und Schimmelbeseitigung in Wuppertal und dem Bergischen Land. Offizieller")}{" "}
              <PartnerLink>SchimmelPeter® Partnerbetrieb</PartnerLink>
              .
            </p>
            <PartnerBadge className="site-footer__badge" />
          </div>
          <div id="footer-kontakt" className="site-footer__act">
            <a href="/kontakt/" className="site-footer__kontakt">
              <span>
                <small>Kostenlose Feuchtemessung</small>
                Kontakt
              </span>
              <ArrowRight aria-hidden="true" />
            </a>
            <a href={`tel:${COMPANY_INFO.phoneTel}`} className="site-footer__line">
              <Phone aria-hidden="true" />
              <span>
                <small>Anrufen</small>
                {COMPANY_INFO.phoneDisplay}
              </span>
            </a>
            <a href={COMPANY_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="site-footer__line">
              <MessageCircle aria-hidden="true" />
              <span>
                <small>WhatsApp</small>
                Foto senden
              </span>
            </a>
          </div>
        </div>

        <div className="site-footer__cols">
          <nav aria-label="Leistungen im Footer">
            <p className="site-footer__h">Leistungen</p>
            <ul>
              {SERVICE_CARDS.map((s) => (
                <li key={s.slug}>
                  <a href={`/leistungen/${s.slug}/`}>{s.title}</a>
                </li>
              ))}
              <li>
                <a href="/leistungen/" className="site-footer__more">
                  Alle Leistungen →
                </a>
              </li>
            </ul>
          </nav>
          <nav aria-label="Servicegebiet im Footer">
            <p className="site-footer__h">Kellersanierung in</p>
            <ul>
              {CITY_PAGES.map((c) => (
                <li key={c.slug}>
                  <a href={`/kellersanierung/${c.slug}/`}>{c.name}</a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Seiten">
            <p className="site-footer__h">Seiten</p>
            <ul>
              {PAGES.map(([href, label]) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="site-footer__h">Kontakt</p>
            <address className="site-footer__address">
              <strong>{COMPANY_INFO.owner}</strong>
              <span>
                <MapPin aria-hidden="true" />
                {COMPANY_INFO.street}, {COMPANY_INFO.city}
              </span>
              <a href={`tel:${COMPANY_INFO.phoneTel}`}>
                <Phone aria-hidden="true" />
                {COMPANY_INFO.phoneDisplay}
              </a>
              <a href={`mailto:${COMPANY_INFO.email}`}>
                <Mail aria-hidden="true" />
                {COMPANY_INFO.email}
              </a>
            </address>
          </div>
        </div>

        <div className="site-footer__base">
          <p>
            © 2026 sos-abdichtung · Inh. {COMPANY_INFO.owner} · <a href="/impressum/">Impressum</a> ·{" "}
            <a href="/datenschutz/">Datenschutz</a>
          </p>
          <p>
            <PartnerLink>SchimmelPeter®</PartnerLink> ist eine Marke der SchimmelPeter GmbH.
          </p>
        </div>
      </div>
    </footer>
  );
}
