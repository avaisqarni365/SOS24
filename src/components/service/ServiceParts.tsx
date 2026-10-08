import { PartnerLink, PartnerText, PartnerBadge } from "@/components/brand/PartnerLink";
import { Phone, MessageCircle, Calculator, Check, AlertTriangle } from "lucide-react";
import HeroFilm from "@/components/scroll/HeroFilm";
import { KitSymbols } from "@/components/brand/KitArt";
import KitGrid from "@/components/sections/KitGrid";
import { Breadcrumbs } from "@/components/seo/SubpageParts";
import { COMPANY_INFO } from "@/data/content-data";
import { KIT } from "@/data/kit";
import type { Film } from "@/data/films";
import { hy } from "@/lib/hyphenate";

/** Service hero: the claim on the left, the service's own film on the right. */
export function ServiceHero({
  h1,
  lede,
  navTitle,
  crumbs,
  film,
}: {
  h1: string;
  lede: string;
  navTitle: string;
  crumbs: { name: string; path: string }[];
  film?: Film;
}) {
  return (
    <section className="svc-hero" aria-labelledby="page-title">
      <div className="svc-hero__grid sc-wrap">
        <div className="svc-hero__copy">
          <Breadcrumbs items={crumbs} />
          <p className="svc-hero__chip">
            <span aria-hidden="true" />
            {navTitle} · <PartnerLink>SchimmelPeter® Partnerbetrieb</PartnerLink>
          </p>
          <h1 id="page-title" className="sc-display svc-hero__title">
            {h1}
          </h1>
          <p className="sc-lede svc-hero__lede">{hy(lede)}</p>
          <div className="svc-hero__cta">
            <a href={`tel:${COMPANY_INFO.phoneTel}`} className="svc-btn svc-btn--solid">
              <Phone aria-hidden="true" />
              <span>
                <small>Jetzt anrufen</small>
                {COMPANY_INFO.phoneDisplay}
              </span>
            </a>
            <a href={COMPANY_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="svc-btn">
              <MessageCircle aria-hidden="true" />
              <span>
                <small>WhatsApp</small>
                Foto senden
              </span>
            </a>
            <a href="/kostenrechner/" className="svc-btn">
              <Calculator aria-hidden="true" />
              <span>
                <small>Angebot</small>
                Umfang einschätzen
              </span>
            </a>
          </div>
          <ul className="svc-hero__trust">
            <li>
              <Check aria-hidden="true" /> Messung vor Ort kostenlos
            </li>
            <li>
              <Check aria-hidden="true" /> Festpreis nach der Messung
            </li>
            <li>
              <Check aria-hidden="true" /> 10 Jahre Garantie
            </li>
          </ul>
        </div>
        {film ? <HeroFilm film={film} label="Film" /> : null}
      </div>
    </section>
  );
}

/** Figures and signs side by side: what the method achieves, how the damage shows. */
export function ServiceOverview({
  facts,
  symptoms,
  navTitle,
}: {
  facts: { value: string; label: string }[];
  symptoms: string[];
  navTitle: string;
}) {
  return (
    <section id="ueberblick" className="sc-section svc-over" aria-labelledby="ueberblick-title">
      <div className="sc-wrap">
        <p className="sc-label">Überblick</p>
        <h2 id="ueberblick-title" className="sc-display mt-3">
          {navTitle} <em>auf einen Blick.</em>
        </h2>
        <div className="svc-over__grid">
          {facts.length > 0 && (
            <dl className="svc-facts">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.value}</dt>
                  <dd><PartnerText text={f.label} /></dd>
                </div>
              ))}
            </dl>
          )}
          <div className="svc-signs">
            <p className="svc-signs__k">
              <AlertTriangle aria-hidden="true" /> Woran Sie es erkennen
            </p>
            <ul>
              {symptoms.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <a href="#kontakt" className="svc-signs__cta">
              Kostenlose Feuchtemessung anfragen <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The steps as a timeline on one water line. */
export function ServiceSteps({ steps, navTitle }: { steps: { title: string; text: string }[]; navTitle: string }) {
  return (
    <section id="ablauf" className="sc-section svc-steps" aria-labelledby="ablauf-title">
      <div className="sc-wrap">
        <p className="sc-label">Ablauf</p>
        <h2 id="ablauf-title" className="sc-display mt-3">
          So läuft Ihre {navTitle} ab, <em>Schritt für Schritt.</em>
        </h2>
        <ol className="svc-steps__list">
          {steps.map((s, i) => (
            <li key={s.title} className="svc-step">
              <span className="svc-step__n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="svc-step__t">{s.title}</h3>
              <p className="svc-step__d"><PartnerText text={hy(s.text)} /></p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** The instruments and materials this service uses, with the quick view. */
export function ServiceKit({ slug, navTitle }: { slug: string; navTitle: string }) {
  const items = KIT.filter((k) => k.services.some((s) => s.slug === slug));
  if (!items.length) return null;
  return (
    <section id="material" className="sc-section kit svc-kit" aria-labelledby="material-title">
      <KitSymbols />
      <div className="sc-wrap">
        <p className="sc-label">Geräte & Material</p>
        <h2 id="material-title" className="sc-display mt-3">
          Womit wir bei der {navTitle} <em>arbeiten.</em>
        </h2>
        <p className="sc-body mt-5">
          Tippen Sie auf eine Karte: Sie sehen, wofür das Gerät oder das Material da ist und was dabei in der Wand passiert.
        </p>
        <KitGrid items={items} />
      </div>
    </section>
  );
}
