import type { ReactNode } from "react";
import { PartnerLink, PartnerBadge } from "@/components/brand/PartnerLink";
import { Phone, MessageCircle, Mail, MapPin, ChevronDown } from "lucide-react";
import { SHOTS } from "@/components/brand/BrandShot";
import { COMPANY_INFO } from "@/data/content-data";
import { SERVICE_CARDS } from "@/data/services";
import { CITY_PAGES } from "@/data/seo-pages";
import Logo from "@/components/brand/Logo";
import FooterFold from "@/components/sections/FooterFold";

const PAGES: [string, string][] = [
  ["/leistungen/", "Alle Leistungen"],
  ["/labor/", "Scientific Lab"],
  ["/galerie/", "Galerie"],
  ["/kostenrechner/", "Angebotsrechner"],
  ["/leistungen/#faq", "Häufige Fragen"],
  ["/kontakt/", "Kontakt"],
];

/** A group of footer links: a column from 640px up, a fold on phones. */
function Group({ label, title, className = "", children }: { label: string; title: string; className?: string; children: ReactNode }) {
  return (
    <nav aria-label={label} className={className}>
      <details className="site-footer__grp" open>
        <summary>
          <span className="site-footer__h">{title}</span>
          <ChevronDown aria-hidden="true" />
        </summary>
        <ul>{children}</ul>
      </details>
    </nav>
  );
}

/**
 * The footer, short: the service van as background on one side; over it the
 * brand and the three ways in; then one panel of links (the services, the
 * towns, the pages); at the very bottom the full address and the legal line.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__bg" aria-hidden="true">
        <img src={SHOTS.van.src} width={SHOTS.van.w} height={SHOTS.van.h} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="sc-wrap">
        <div className="site-footer__top">
          <div className="site-footer__id">
            <Logo />
            <PartnerBadge className="site-footer__badge" />
          </div>
          <p className="site-footer__claim">Schützt, was wichtig ist!</p>
          <p className="site-footer__about">
            Kellersanierung, Horizontalsperren und Schimmelbeseitigung in Wuppertal und dem Bergischen Land.
          </p>
          {/* only the number, and WhatsApp as an icon */}
          <div id="footer-kontakt" className="site-footer__act site-footer__act--plain">
            <a href={`tel:${COMPANY_INFO.phoneTel}`} className="site-footer__num">
              <Phone aria-hidden="true" />
              {COMPANY_INFO.phoneDisplay}
            </a>
            <a href={COMPANY_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="site-footer__wa" aria-label="WhatsApp: Foto senden" title="WhatsApp">
              <MessageCircle aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="site-footer__links">
          <Group label="Leistungen im Footer" title="Leistungen" className="site-footer__svc">
            {SERVICE_CARDS.map((s) => (
              <li key={s.slug}>
                <a href={`/leistungen/${s.slug}/`}>{s.title}</a>
              </li>
            ))}
          </Group>
          <Group label="Servicegebiet im Footer" title="Kellersanierung in">
            {CITY_PAGES.map((c) => (
              <li key={c.slug}>
                <a href={`/kellersanierung/${c.slug}/`}>{c.name}</a>
              </li>
            ))}
          </Group>
          <Group label="Seiten" title="Seiten">
            {PAGES.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </Group>
        </div>

        <div className="site-footer__base">
          <address className="site-footer__addr">
            <span>
              <MapPin aria-hidden="true" />
              {COMPANY_INFO.owner} · {COMPANY_INFO.street}, {COMPANY_INFO.city}
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
          <div className="site-footer__legal">
            <p>
              © 2026 sos-abdichtung · Inh. {COMPANY_INFO.owner} · <a href="/impressum/">Impressum</a> ·{" "}
              <a href="/datenschutz/">Datenschutz</a>
            </p>
            <p>
              <PartnerLink>SchimmelPeter®</PartnerLink> ist eine Marke der SchimmelPeter GmbH.
            </p>
          </div>
        </div>
      </div>
      <FooterFold />
    </footer>
  );
}
