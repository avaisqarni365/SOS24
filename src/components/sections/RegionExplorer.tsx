"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowRight, CalendarCheck, Car, Clock, MapPin, Navigation, Phone, Search } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export interface ExplorerCity {
  slug: string;
  name: string;
  /** the short name for the map label, where the full one covers a neighbour */
  label: string;
  plz: string[];
  districts: string[];
  response: string;
  km: number;
  min: number;
  d: string;
  cx: number;
  cy: number;
}
export interface ExplorerMap {
  vb: string;
  frame: { x: number; y: number; w: number; h: number };
  /** label size relative to the frame */
  k: number;
  context: string[];
  hq: { x: number; y: number };
}

/** The office as Google Maps knows it: the route link starts the visitor's own navigation there. */
const OFFICE_QUERY = "sos-abdichtung, Niebuhrstraße 46, 45144 Essen";
const MAPS_PLACE = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_QUERY)}`;

const page = (slug: string) => `/kellersanierung/${slug}/`;
const plain = (e: React.MouseEvent) => !(e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);

/** The town's own outline as a small badge: the path with a viewBox cut to it. */
function outline(d: string) {
  const xs: number[] = [], ys: number[] = [];
  for (const m of Array.from(d.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g))) { xs.push(+m[1]); ys.push(+m[2]); }
  const [x0, y0, x1, y1] = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  const pad = Math.max(x1 - x0, y1 - y0) * 0.08;
  return [x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad].map((v) => v.toFixed(1)).join(" ");
}

/**
 * The service area in one place, laid out like a map app: the NRW map on the
 * left, a search for town or postcode and a place card on the right. A click
 * on a town (map or list) opens its card; the card links to the town's page.
 * Without JavaScript every town is a plain link, so crawlers see all 18.
 */
export default function RegionExplorer({ map, cities }: { map: ExplorerMap; cities: ExplorerCity[] }) {
  const [sel, setSel] = useState("essen");
  const [q, setQ] = useState("");
  const card = useRef<HTMLElement>(null);
  const city = cities.find((c) => c.slug === sel) ?? cities[0];
  const vb = useMemo(() => outline(city.d), [city.d]);
  // a typed postcode goes along to the booking form with the town
  const plz = /^\d{5}$/.test(q.trim()) && city.plz.includes(q.trim()) ? q.trim() + " " : "";
  const booking = `/termin/?ort=${encodeURIComponent(plz + city.name)}`;

  const query = q.trim().toLowerCase();
  const hits = useMemo(() => {
    if (!query) return cities;
    if (/^\d+$/.test(query)) return cities.filter((c) => c.plz.some((p) => p.startsWith(query)));
    return cities.filter((c) => c.name.toLowerCase().includes(query) || c.districts.some((d) => d.toLowerCase().includes(query)));
  }, [cities, query]);

  const pick = (slug: string) => (e: React.MouseEvent) => {
    if (!plain(e)) return;
    e.preventDefault();
    setSel(slug);
    // phones and tablets stack the card under the map: bring it (and its booking button) into view
    const el = card.current;
    if (el && el.getBoundingClientRect().top > window.innerHeight * 0.55) {
      const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "center" });
    }
  };
  const label = { fontSize: `${21 * map.k}px`, strokeWidth: `${4 * map.k}px` };

  return (
    <div className="rx">
      <figure className="region-map__frame rx__map">
        <svg data-i18n="" viewBox={map.vb} className="region-map region-map--nrw" role="img" aria-labelledby="region-map-title">
          <title id="region-map-title">{`Karte des Einsatzgebiets in NRW: ${cities.map((c) => c.name).join(", ")}; Sitz in Essen`}</title>
          <rect x={map.frame.x} y={map.frame.y} width={map.frame.w} height={map.frame.h} className="region-map__bg" />
          <g className="region-map__context">
            {map.context.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          {cities.map((c) => (
            <a
              key={c.slug}
              href={page(c.slug)}
              onClick={pick(c.slug)}
              aria-current={c.slug === sel ? "true" : undefined}
              className={`region-map__area${c.slug === "essen" ? " is-main" : ""}${c.slug === sel ? " is-sel" : ""}`}
            >
              <path d={c.d} />
              <text x={c.cx} y={c.cy} textAnchor="middle" style={label}>
                {c.label}
              </text>
            </a>
          ))}
          {/* the office: Niebuhrstraße 46, Essen; the highlighted Essen area names the place */}
          <g className="region-map__hq" transform={`translate(${map.hq.x} ${map.hq.y})`}>
            <circle r={9 * map.k}>
              <title>Unser Sitz: Niebuhrstraße 46, 45144 Essen</title>
            </circle>
          </g>
        </svg>
        <figcaption className="no-justify">
          <span className="region-map__key region-map__key--area" aria-hidden="true" /> Einsatzgebiet
          <span className="region-map__key region-map__key--hq" aria-hidden="true" /> Sitz
          <span className="region-map__credit">Gemeindegrenzen: Land NRW, via Code for Germany</span>
        </figcaption>
      </figure>

      <div className="rx__panel">
        <label className="rx__search">
          <Search aria-hidden="true" />
          <span className="visually-hidden">Stadt, Stadtteil oder Postleitzahl suchen</span>
          <input
            type="search"
            value={q}
            onChange={(e) => {
              const v = e.target.value;
              setQ(v);
              // a full postcode or an exact town name opens its card straight away
              const t = v.trim().toLowerCase();
              const one = cities.find((c) => (/^\d{5}$/.test(t) && c.plz.includes(t)) || c.name.toLowerCase() === t);
              if (one) setSel(one.slug);
            }}
            placeholder="Stadt oder PLZ, z. B. 44787"
            autoComplete="postal-code"
            inputMode="search"
          />
        </label>

        <ul className="rx__chips" aria-label="Städte im Einsatzgebiet">
          {hits.map((c) => (
            <li key={c.slug}>
              <a href={page(c.slug)} onClick={pick(c.slug)} className={`rx__chip${c.slug === sel ? " is-sel" : ""}`} aria-current={c.slug === sel ? "true" : undefined}>
                {c.name}
              </a>
            </li>
          ))}
        </ul>
        {hits.length === 0 && (
          <p className="rx__none">
            Ihr Ort ist nicht dabei? Wir kommen in ganz NRW. <a href={`tel:${COMPANY_INFO.phoneTel}`}>Rufen Sie uns an</a>.
          </p>
        )}

        <article key={city.slug} className="rx__card" aria-live="polite" ref={card}>
          <div className="rx__head">
            <div>
              <p className="rx__k">
                <MapPin aria-hidden="true" /> Einsatzgebiet
              </p>
              <h3 className="rx__t">Kellersanierung in {city.name}</h3>
            </div>
            <svg className="rx__shape" viewBox={vb} aria-hidden="true" preserveAspectRatio="xMidYMid meet">
              <path d={city.d} />
            </svg>
          </div>
          <dl className="rx__facts">
            <div>
              <dt>
                <Clock aria-hidden="true" /> Termin vor Ort
              </dt>
              <dd>in {city.response}</dd>
            </div>
            <div>
              <dt>
                <Car aria-hidden="true" /> Anfahrt ab Essen
              </dt>
              <dd>{city.slug === "essen" ? "Unser Sitz" : `ca. ${city.km} km, ca. ${city.min} Min.`}</dd>
            </div>
            <div className="rx__wide">
              <dt>Postleitzahlen</dt>
              {/* eight are enough to recognise the town (a typed one always shows); the rest is on its page */}
              <dd className="rx__plz">
                {(plz && !city.plz.slice(0, 8).includes(plz.trim()) ? [plz.trim(), ...city.plz.slice(0, 7)] : city.plz.slice(0, 8)).map((p) => (
                  <span key={p}>{p}</span>
                ))}
                {city.plz.length > 8 && <span aria-hidden="true">…</span>}
              </dd>
            </div>
          </dl>
          <a href={booking} className="rx__book">
            <CalendarCheck aria-hidden="true" />
            <span>
              Termin buchen
              <small>Kostenlose Feuchtemessung vor Ort in {city.name}</small>
            </span>
            <ArrowRight aria-hidden="true" />
          </a>
          <div className="rx__actions">
            <a href={page(city.slug)} className="rx__btn">
              {city.name} im Detail
            </a>
            <a href={`tel:${COMPANY_INFO.phoneTel}`} className="rx__btn">
              <Phone aria-hidden="true" /> Anrufen
            </a>
            <a href={MAPS_PLACE} target="_blank" rel="noopener noreferrer" className="rx__btn">
              <Navigation aria-hidden="true" /> Google Maps
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
