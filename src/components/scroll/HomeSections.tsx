import { SERVICE_CARDS } from "@/data/services";
import { FAQS, COMPANY_INFO } from "@/data/content-data";
import { CITY_PAGES } from "@/data/seo-pages";
import { FaqCards } from "@/components/seo/SubpageParts";
import { MAP_AREAS, MAP_ESSEN, MAP_W } from "@/data/region-map";
import { SERVICE_FACTS } from "@/data/service-facts";
import { CHEMISTRY } from "@/data/chemistry";
import ServiceGrid from "@/components/sections/ServiceGrid";
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
            Erst messen. <em className="text-accent-deep">Dann bohren.</em>
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
/** The services as typographic cards; a click opens the quick view
    (components/sections/ServiceGrid.tsx), the card stays a real link. */
export function ServiceCardGrid() {
  const items = SERVICE_CARDS.map((s) => ({
    slug: s.slug,
    // soft hyphens: on phones the titles sit in narrow tiles
    title: hy(s.title),
    text: s.text,
    art: s.art,
    facts: SERVICE_FACTS[s.slug] ?? [],
    material: CHEMISTRY.find((c) => c.slug === s.slug)?.intro,
  }));
  return <ServiceGrid items={items} />;
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
              Neun Verfahren. <em className="text-accent-deep">Eine Ursache nach der anderen.</em>
            </h2>
          </div>
          <p className="sc-body">
            {hy("Als Bautenschutz-Fachbetrieb sanieren wir feuchte Kellerwände von innen, legen Mauerwerk trocken und beseitigen Schimmel im Keller dauerhaft. Welche Leistung Ihr Keller braucht, entscheidet die kostenlose Feuchtigkeitsmessung. Jedes Verfahren hat eine eigene Seite: mit 3D-Modell, der Physik dahinter, Zahlen, Ablauf und Fragen.")}
          </p>
        </div>
        <ServiceCardGrid />
        <p className="mt-8">
          <a href="/leistungen/" className="inline-flex items-center gap-2 font-semibold text-accent-deep hover:underline">
            Alle Leistungen im Überblick, mit Wegweiser: welches Verfahren bei welchem Anzeichen <span aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- region -- */
/** Short names where the full one would cover its neighbours on the map. */
const MAP_LABEL: Record<string, string> = { "Mülheim an der Ruhr": "Mülheim", "Wermelskirchen": "Wermelsk." };

/** The service area on real municipal boundaries: every city with its own page is
    filled and linked, the neighbours give context, a pin marks the office in Essen.
    The frame is fitted to those cities, so a new city page widens the map by itself. */
function RegionMap() {
  const pages = new Set(CITY_PAGES.map((c) => c.slug));
  const linked = MAP_AREAS.filter((a) => a.slug && pages.has(a.slug));
  const xs: number[] = [], ys: number[] = [];
  linked.forEach((a) => Array.from(a.d.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)).forEach((m) => { xs.push(+m[1]); ys.push(+m[2]); }));
  const pad = 36;
  const x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad, w = Math.max(...xs) + pad - x0, h = Math.max(...ys) + pad - y0;
  // labels keep the size they had in the old 800-wide map, relative to the frame
  const k = w / MAP_W;
  const label = { fontSize: `${21 * k}px`, strokeWidth: `${4 * k}px` };
  return (
    <svg data-i18n=""
      viewBox={`${x0.toFixed(0)} ${y0.toFixed(0)} ${w.toFixed(0)} ${h.toFixed(0)}`}
      className="region-map region-map--nrw"
      role="img"
      aria-labelledby="region-map-title"
    >
      <title id="region-map-title">
        {`Karte des Einsatzgebiets in NRW: ${linked.map((a) => a.name).join(", ")}; Sitz in Essen`}
      </title>
      <rect x={x0} y={y0} width={w} height={h} className="region-map__bg" />
      <g className="region-map__context">
        {MAP_AREAS.filter((a) => !linked.includes(a)).map((a) => (
          <path key={a.name} d={a.d} />
        ))}
      </g>
      {linked.map((a) => {
        const office = a.slug === "essen";
        return (
          <a key={a.name} href={`/kellersanierung/${a.slug}/`} className={`region-map__area${office ? " is-main" : ""}`}>
            <path d={a.d} />
            <text x={a.cx} y={a.cy} textAnchor="middle" style={label}>
              {MAP_LABEL[a.name] || a.name}
            </text>
          </a>
        );
      })}
      {/* the office: Niebuhrstraße 46, Essen */}
      <g className="region-map__hq" transform={`translate(${MAP_ESSEN.x} ${MAP_ESSEN.y})`}>
        {/* the highlighted Essen area names the place; a text label here collided with Bochum */}
        <circle r={9 * k}>
          <title>Unser Sitz: Niebuhrstraße 46, 45144 Essen</title>
        </circle>
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
            <p className="sc-label">Einsatzgebiet NRW · Ruhrgebiet, Rheinland &amp; Bergisches Land</p>
            <h2 id="region-title" className="sc-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
              Von Köln bis Dortmund: ganz NRW.
            </h2>
          </div>
          <p className="sc-body">
            {hy("Vom Rhein in Köln, Düsseldorf und Duisburg über das Ruhrgebiet bis ins Bergische Land: Hochwasser und Grundwasser, Bergsenkungen, Hanglagen und Altbauten aus Ziegel und Bruchstein ohne intakte Horizontalsperre. Unser Sitz ist in Essen. Klicken Sie auf Ihre Stadt.")}
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
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ faq -- */
export function FaqSection() {
  return (
    <section id="faq" className="sc-section" aria-labelledby="faq-title" data-sc-act="flow">
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
                className="inline-flex min-h-[44px] items-center rounded-full border border-[var(--line-strong)] px-5 text-[0.9375rem] font-semibold hover:border-accent-deep"
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
