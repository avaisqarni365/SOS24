"use client";

import { useState } from "react";

/**
 * Real, zoomable OpenStreetMap of the service area. Nothing is requested from
 * openstreetmap.org until the visitor clicks (DSGVO: no third-party request
 * without consent). Without JS the link still opens the same map.
 */
const BBOX = "6.93,51.10,7.33,51.38";
const EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX}&layer=mapnik&marker=51.256,7.151`;
const FULL = "https://www.openstreetmap.org/?mlat=51.256&mlon=7.151#map=11/51.24/7.13";

export default function OsmMap() {
  const [on, setOn] = useState(false);
  return (
    <div className="osm-map">
      {on ? (
        <iframe
          src={EMBED}
          title="Interaktive Karte des Servicegebiets rund um Wuppertal (OpenStreetMap)"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="osm-map__gate">
          <p className="no-justify">
            Die interaktive Karte wird von OpenStreetMap geladen. Dabei wird Ihre IP-Adresse an die OpenStreetMap
            Foundation übertragen.
          </p>
          <button type="button" className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[var(--bone)] px-6 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-white" onClick={() => setOn(true)}>
            Interaktive Karte laden
          </button>
        </div>
      )}
      <p className="osm-map__foot no-justify">
        <a href={FULL} target="_blank" rel="noopener noreferrer">
          Karte bei OpenStreetMap öffnen <span aria-hidden="true">↗</span>
        </a>
        <span>© OpenStreetMap-Mitwirkende</span>
      </p>
    </div>
  );
}
