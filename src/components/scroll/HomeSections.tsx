import { SERVICE_CARDS, type ServiceCard } from "@/data/services";
import { FAQS } from "@/data/content-data";
import { CITY_PAGES } from "@/data/seo-pages";
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
      data-sc-drift="#101613"
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
export function ServicesRail() {
  return (
    <section
      id="leistungen"
      className="sc-section"
      aria-labelledby="leistungen-title"
      data-sc-act="flow"
      data-sc-drift="#0e1310"
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
            {hy("Welche Leistung Ihr Keller braucht, entscheidet die Messung. Jedes Verfahren hat eine eigene Seite mit Ablauf, Kosten und Fragen.")}
          </p>
        </div>
        <ul className="services-grid mt-12">
          {SERVICE_CARDS.map((s) => {
            const Icon = CARD_ICON[s.art];
            return (
              <li key={s.slug}>
                <a className="service-card" href={`/leistungen/${s.slug}/`}>
                  <span className="service-card__icon" aria-hidden="true">
                    <Icon strokeWidth={1.6} />
                  </span>
                  <h3>{s.title}</h3>
                  <p>{hy(s.text)}</p>
                  <span className="service-card__more">
                    Zum Verfahren <span aria-hidden="true">→</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
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
          <a key={a.name} href={`/kellersanierung/${a.slug}/`} className="region-map__area">
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
      className="sc-section"
      aria-labelledby="region-title"
      data-sc-act="flow"
      data-sc-drift="#0e1310"
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
                  <a
                    href={`/kellersanierung/${c.slug}/`}
                    className="flex min-h-[56px] flex-col justify-center rounded-2xl border border-white/10 bg-[var(--ink-2)] px-4 py-3 hover:border-[var(--mint)]"
                  >
                    <span className="font-semibold">{c.name}</span>
                    <span className="font-mono text-[0.7rem] text-[var(--sc-ink-soft)]">Vor Ort in {c.responseTime}</span>
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
    <section id="faq" className="surface-bone sc-section" aria-labelledby="faq-title" data-sc-act="flow">
      <div className="sc-wrap max-w-4xl">
        <h2 id="faq-title" className="sc-display text-4xl sm:text-5xl text-[var(--head-on-bone)]" data-sc-in>
          Häufige Fragen zur Kellersanierung
        </h2>
        <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {FAQS.map((f) => (
            <details key={f.q} className="faq-item group py-5">
              <summary className="flex min-h-[44px] items-start justify-between gap-6 text-left text-lg font-semibold text-[var(--head-on-bone)]">
                <span>{f.q}</span>
                <span className="faq-plus mt-1 text-2xl leading-none text-[var(--emerald-deep)]" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[var(--text-on-bone)]">{hy(f.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
