"use client";

import { useCallback, useState } from "react";
import { ArrowRight, Clock, Car, MapPin, Phone } from "lucide-react";
import QuickView, { isPlainClick } from "@/components/ui/QuickView";
import { COMPANY_INFO } from "@/data/content-data";

export interface CityFrame {
  slug: string;
  name: string;
  plz: string[];
  districts: string[];
  response: string;
  km: number;
  min: number;
  /** the town's own outline, with a viewBox cut to it: its "logo" */
  icon: { d: string; vb: string };
}
export interface MiniMap {
  vb: string;
  top: number;
  essenX: number;
  areas: { slug: string; name: string; d: string; cx: number; cy: number }[];
}

const short = (r: string) => r.replace(" Stunden", " h").replace(" bis ", "–");

/**
 * The six towns as small framed cards, each with its own outline. A click
 * opens a short map: where the town lies, its postcodes, how soon we are
 * there and how far it is from the office. Without JavaScript each card is
 * a plain link to the town's page.
 */
export default function CityFrames({ cities, map }: { cities: CityFrame[]; map: MiniMap }) {
  const [active, setActive] = useState<CityFrame | null>(null);
  const close = useCallback(() => setActive(null), []);
  const at = active ? map.areas.find((a) => a.slug === active.slug) : undefined;

  return (
    <>
      <ul className="cityf">
        {cities.map((c) => (
          <li key={c.slug}>
            <a
              href={`/kellersanierung/${c.slug}/`}
              className="cityf__card"
              aria-haspopup="dialog"
              onClick={(e) => {
                if (!isPlainClick(e)) return;
                e.preventDefault();
                setActive(c);
              }}
            >
              <span className="cityf__logo" aria-hidden="true">
                <svg viewBox={c.icon.vb} preserveAspectRatio="xMidYMid meet">
                  <path d={c.icon.d} />
                </svg>
              </span>
              <span className="cityf__name">{c.name}</span>
              <span className="cityf__plz">
                PLZ {c.plz[0]}
                {c.plz.length > 1 ? `–${c.plz[c.plz.length - 1]}` : ""}
              </span>
              <span className="cityf__time">
                <Clock aria-hidden="true" /> {short(c.response)}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <QuickView open={!!active} onClose={close} labelledBy="city-qv-title" wide>
        {active && (
          <div className="qv-city">
            <svg className="qv-city__map" data-i18n="" viewBox={map.vb} role="img" aria-label={`Karte: ${active.name} im Servicegebiet, Sitz in Essen`}>
              {map.areas.map((a) => (
                <path key={a.slug} d={a.d} className={a.slug === active.slug ? "is-on" : undefined} />
              ))}
              {at ? (
                <>
                  <path className="qv-city__route" d={`M${map.essenX} ${map.top + 16}L${at.cx} ${at.cy}`} />
                  <circle className="qv-city__pin" cx={at.cx} cy={at.cy} r="9" />
                  <text className="qv-city__label" x={at.cx} y={at.cy + 34} textAnchor="middle">
                    {active.name}
                  </text>
                </>
              ) : null}
              <g transform={`translate(${map.essenX} ${map.top})`} className="qv-city__hq">
                <path d="M0 4 L9 18 L-9 18 Z" />
                <text x="14" y="17">Essen (Sitz)</text>
              </g>
            </svg>
            <div className="qv-city__body">
              <p className="qv__k">Servicegebiet PLZ 42</p>
              <h2 id="city-qv-title" className="qv__t">
                Kellersanierung in {active.name}
              </h2>
              <dl className="qv-city__facts">
                <div>
                  <dt>
                    <Clock aria-hidden="true" /> Termin vor Ort
                  </dt>
                  <dd>in {active.response}</dd>
                </div>
                <div>
                  <dt>
                    <Car aria-hidden="true" /> Anfahrt ab Essen
                  </dt>
                  <dd>
                    {`ca. ${active.km} km, ca. ${active.min} Min.`} <span>(geschätzt)</span>
                  </dd>
                </div>
                <div className="qv-city__wide">
                  <dt>
                    <MapPin aria-hidden="true" /> Postleitzahlen
                  </dt>
                  <dd className="qv-city__plz">
                    {active.plz.map((p) => (
                      <span key={p}>{p}</span>
                    ))}
                  </dd>
                </div>
                <div className="qv-city__wide">
                  <dt>Stadtteile</dt>
                  <dd>{active.districts.join(", ")}</dd>
                </div>
              </dl>
              <div className="qv__actions">
                <a href={`/kellersanierung/${active.slug}/`} className="qv__btn qv__btn--solid">
                  {active.name} im Detail
                  <ArrowRight aria-hidden="true" />
                </a>
                <a href="/kontakt/" className="qv__btn">
                  Kontakt
                </a>
                <a href={`tel:${COMPANY_INFO.phoneTel}`} className="qv__btn">
                  <Phone aria-hidden="true" />
                  Anrufen
                </a>
              </div>
            </div>
          </div>
        )}
      </QuickView>
    </>
  );
}
