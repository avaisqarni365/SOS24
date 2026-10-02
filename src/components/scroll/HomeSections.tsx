import { SERVICE_CARDS, type ServiceCard } from "@/data/services";
import { FAQS, COMPANY_INFO } from "@/data/content-data";
import { CITY_PAGES, SERVICE_PAGES } from "@/data/seo-pages";
import { LayerRuler, FaqCards } from "@/components/seo/SubpageParts";
import { MAP_AREAS, MAP_ESSEN, MAP_H, MAP_W } from "@/data/region-map";
import OsmMap from "@/components/interactive/OsmMap";
import { Home, Layers, ShieldCheck, SprayCan, Gauge, Wrench, type LucideIcon } from "lucide-react";

const CARD_ICON: Record<ServiceCard["art"], LucideIcon> = {
  keller: Home,
  sperre: Layers,
  innen: ShieldCheck,
  schimmel: SprayCan,
  messung: Gauge,
  riss: Wrench,
};
import FeuchteScanner from "@/components/interactive/FeuchteScanner";
import { hy } from "@/lib/hyphenate";

/* ------------------------------------------------------------- scanner -- */
export function ScannerSection() {
  return (
    <section
      id="feuchte-scanner"
      className="sc-section"
      aria-labelledby="scanner-title"
      data-sc-act="flow"
     
    >
      <div className="sc-wrap">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end" data-sc-in>
          <h2 id="scanner-title" className="sc-display text-4xl sm:text-5xl lg:text-6xl">
            Erst messen. <em className="text-[var(--mint)]">Dann bohren.</em>
          </h2>
          <p className="sc-body">
            {hy("Frisch gestrichen sieht jede Wand trocken aus. Führen Sie die Sonde über die Wand und sehen Sie, was eine Feuchtemessung sichtbar macht: aufsteigende Nässe im Sockel, Kondensat in der kalten Ecke, ein Riss, der Wasser führt. Jede Ursache braucht ein anderes Verfahren.")}
          </p>
        </div>
        <FeuchteScanner />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- services -- */
/** Six services as one calm grid. The photos live in the gallery below, so
    this section carries no images and nothing moves sideways. */
/** The six services as picture cards; each card opens the service page. */
export function ServiceCardGrid() {
  return (
    <ul className="services-grid mt-10">
      {SERVICE_CARDS.map((s) => {
        const Icon = CARD_ICON[s.art];
        return (
          <li key={s.slug}>
            <a className="service-card" href={`/leistungen/${s.slug}/`}>
              <span className={`service-card__media service-card__media--${s.image.fit}`}>
                <img src={s.image.src} alt={s.image.alt} width={640} height={450} loading="lazy" decoding="async" />
                <span className="service-card__badge">{s.image.fit === "contain" ? "3D · Wissen" : "Messung · Wissen"}</span>
                <LayerRuler layers={SERVICE_PAGES.find((p) => p.slug === s.slug)?.layers ?? []} compact />
              </span>
              <span className="service-card__body">
                <span className="service-card__title">
                  <span className="service-card__icon" aria-hidden="true">
                    <Icon strokeWidth={1.6} />
                  </span>
                  <h3>{s.title}</h3>
                </span>
                <p>{hy(s.text)}</p>
                <span className="service-card__more">
                  Details, 3D-Modell und Wissenschaft <span aria-hidden="true">→</span>
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function ServicesRail() {
  return (
    <section
      id="leistungen"
      className="sc-section band-mint"
      aria-labelledby="leistungen-title"
      data-sc-act="flow"
     
    >
      <div className="sc-wrap">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end" data-sc-in>
          <div>
            <p className="sc-label">Leistungen</p>
            <h2 id="leistungen-title" className="sc-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
              Sechs Verfahren. <em className="text-[var(--mint)]">Eine Ursache nach der anderen.</em>
            </h2>
          </div>
          <p className="sc-body">
            {hy("Welche Leistung Ihr Keller braucht, entscheidet die Messung. Jedes Verfahren hat eine eigene Seite: mit 3D-Modell, der Physik dahinter, Zahlen, Ablauf und Fragen.")}
          </p>
        </div>
        <ServiceCardGrid />
        <p className="mt-8">
          <a href="/leistungen/" className="inline-flex items-center gap-2 font-semibold text-[var(--emerald-deep)] hover:underline">
            Alle Leistungen im Überblick, mit Wegweiser: welches Verfahren bei welchem Anzeichen <span aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- region -- */
/** The service area on real municipal boundaries: the six PLZ-42 towns are
    filled and linked, the neighbours give context, Essen marks the office. */
function RegionMap() {
  const byslug = Object.fromEntries(CITY_PAGES.map((c) => [c.slug, c]));
  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      className="region-map"
      role="img"
      aria-labelledby="region-map-title"
    >
      <title id="region-map-title">
        Karte des Servicegebiets: Wuppertal, Solingen, Remscheid, Velbert, Haan und Wermelskirchen, Sitz in Essen
      </title>
      <rect width={MAP_W} height={MAP_H} className="region-map__bg" />
      <g className="region-map__context">
        {MAP_AREAS.filter((a) => !a.slug).map((a) => (
          <path key={a.name} d={a.d} />
        ))}
      </g>
      {MAP_AREAS.filter((a) => a.slug).map((a) => {
        const city = byslug[a.slug!];
        const big = a.slug === "wuppertal";
        return (
          <a key={a.name} href={`/kellersanierung/${a.slug}/`} className={`region-map__area${big ? " is-main" : ""}`}>
            <path d={a.d} />
            <text x={a.cx} y={a.cy} textAnchor="middle" className={big ? "is-big" : undefined}>
              {a.name}
            </text>
            {city && (
              <text x={a.cx} y={a.cy + (big ? 30 : 24)} textAnchor="middle" className="region-map__sub">
                {city.responseTime}
              </text>
            )}
          </a>
        );
      })}
      {/* Essen lies north of the frame: an arrow at the edge points to it */}
      <g className="region-map__hq" transform={`translate(${MAP_ESSEN.x} 0)`}>
        <path d="M0 10 L9 26 L-9 26 Z" />
        <text x="16" y="25">
          Essen (Sitz)
        </text>
      </g>
    </svg>
  );
}

export function RegionSection() {
  return (
    <section
      id="servicegebiet"
      className="sc-section band-mint"
      aria-labelledby="region-title"
      data-sc-act="flow"
     
    >
      <div className="sc-wrap">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end" data-sc-in>
          <div>
            <p className="sc-label">Servicegebiet PLZ 42</p>
            <h2 id="region-title" className="sc-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
              Wuppertal und das Bergische Land.
            </h2>
          </div>
          <p className="sc-body">
            {hy("Hanglagen, Grundwasser im Tal der Wupper, viel Altbau aus Ziegel und Bruchstein ohne zeitgemäße Horizontalsperre: Die Region hat ihre eigenen Kellerprobleme. Klicken Sie auf Ihre Stadt.")}
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <figure className="region-map__frame">
            <RegionMap />
            <figcaption className="no-justify">
              <span className="region-map__key region-map__key--area" aria-hidden="true" /> Einsatzgebiet
              <span className="region-map__key region-map__key--hq" aria-hidden="true" /> Sitz
              <span className="region-map__credit">Gemeindegrenzen: Land NRW, via Code for Germany</span>
            </figcaption>
          </figure>
          <div className="grid gap-6">
            <ul className="grid grid-cols-2 gap-3">
              {CITY_PAGES.map((c) => (
                <li key={c.slug}>
                  <a href={`/kellersanierung/${c.slug}/`} className="city-card">
                    <span className="city-card__name">{c.name}</span>
                    <span className="city-card__time">Vor Ort in {c.responseTime}</span>
                    <span className="city-card__go" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <OsmMap />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ faq -- */
export function FaqSection() {
  return (
    <section id="faq" className="sc-section border-t border-line/10" aria-labelledby="faq-title" data-sc-act="flow">
      <div className="sc-wrap faq-layout">
        <div className="faq-intro">
          <p className="sc-label">Häufige Fragen</p>
          <h2 id="faq-title" className="sc-display mt-3">
            Was Hausbesitzer <em>uns am häufigsten fragen.</em>
          </h2>
          <p className="sc-body mt-4">
            {hy("Ursache, Ablauf, Kosten und Garantie: die Antworten auf die Fragen, die bei jeder Besichtigung kommen. Tippen Sie eine Frage an, um die Antwort zu lesen.")}
          </p>
          <div className="faq-ask">
            <p className="faq-ask__t">Ihre Frage ist nicht dabei?</p>
            <p className="faq-ask__d">{hy("Shahzad Mahmood antwortet persönlich, meist noch am selben Tag.")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`tel:${COMPANY_INFO.phoneTel}`} className="btn-shine inline-flex min-h-[44px] items-center rounded-full px-5 text-[0.9375rem] font-semibold">
                {COMPANY_INFO.phoneDisplay}
              </a>
              <a
                href={COMPANY_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-full border border-line/15 px-5 text-[0.9375rem] font-semibold hover:border-[var(--mint)]"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
        <FaqCards faqs={FAQS} />
      </div>
    </section>
  );
}
