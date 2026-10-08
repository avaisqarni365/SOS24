import { ArrowRight, MapPin, FlaskConical, Images, Users, Calculator } from "lucide-react";
import { CITY_PAGES } from "@/data/seo-pages";
import { MAP_AREAS, MAP_ESSEN } from "@/data/region-map";
import CityFrames, { type CityFrame, type MiniMap } from "@/components/sections/CityFrames";
import { hy } from "@/lib/hyphenate";

/** Office: Niebuhrstraße 46, 45144 Essen. */
const OFFICE = { lat: 51.4466, lng: 6.98 };

/** Rings of a boundary path, thinned to every nth point (small sizes need few). */
function thin(d: string, n: number) {
  const rings = d.split(/(?=M)/).map((r) =>
    Array.from(r.matchAll(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g), (m) => [Number(m[1]), Number(m[2])] as [number, number]),
  );
  const kept = rings.map((pts) => pts.filter((_, i) => i % n === 0 || i === pts.length - 1)).filter((pts) => pts.length > 2);
  const path = kept.map((pts) => "M" + pts.map(([x, y]) => `${x} ${y}`).join("L") + "Z").join("");
  const all = kept.flat();
  const xs = all.map((q) => q[0]);
  const ys = all.map((q) => q[1]);
  return { d: path, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
}

/** Road distance and drive time from the office, estimated from the
    straight line (x 1.3 for the roads, 55 km/h on average). */
function drive(geo: { lat: number; lng: number }) {
  const R = 6371;
  const rad = (v: number) => (v * Math.PI) / 180;
  const a =
    Math.sin(rad(geo.lat - OFFICE.lat) / 2) ** 2 +
    Math.cos(rad(OFFICE.lat)) * Math.cos(rad(geo.lat)) * Math.sin(rad(geo.lng - OFFICE.lng) / 2) ** 2;
  const road = 2 * R * Math.asin(Math.sqrt(a)) * 1.3;
  const five = (v: number) => Math.max(5, Math.round(v / 5) * 5);
  return { km: five(road), min: five((road / 55) * 60) };
}

function cityData(): { cities: CityFrame[]; map: MiniMap } {
  const areas = MAP_AREAS.filter((a) => a.slug).map((a) => ({ ...a, ...thin(a.d, 2) }));
  const cities = CITY_PAGES.map((c) => {
    const area = areas.find((a) => a.slug === c.slug);
    const icon = area ? thin(area.d, 3) : { d: "", box: [0, 0, 1, 1] };
    const [x0, y0, x1, y1] = icon.box;
    const pad = Math.max(x1 - x0, y1 - y0) * 0.06;
    return {
      slug: c.slug,
      name: c.name,
      label: hy(c.name),
      plz: c.plz,
      districts: c.districts,
      response: c.responseTime,
      ...drive(c.geo),
      icon: { d: icon.d, vb: [x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad].map((v) => v.toFixed(1)).join(" ") },
    };
  });
  const xs = areas.flatMap((a) => [a.box[0], a.box[2]]);
  const ys = areas.flatMap((a) => [a.box[1], a.box[3]]);
  const [x0, y0, x1, y1] = [Math.min(...xs) - 20, Math.min(...ys) - 64, Math.max(...xs) + 20, Math.max(...ys) + 20];
  return {
    cities,
    map: {
      vb: [x0, y0, x1 - x0, y1 - y0].map((v) => v.toFixed(1)).join(" "),
      top: y0 + 8,
      essenX: Math.min(Math.max(MAP_ESSEN.x, x0 + 20), x1 - 120),
      areas: areas.map(({ slug, name, d, cx, cy }) => ({ slug: slug!, name, d, cx, cy })),
    },
  };
}

/**
 * "Mehr erfahren": the landing page stays short, the detail lives one
 * click deeper. Four picture cards (Lab, Galerie, Für wen, Angebotsrechner),
 * the six towns as framed cards with a short map each, and two links to the
 * method guide and the FAQ.
 */
const CARDS = [
  {
    href: "/labor/",
    Icon: FlaskConical,
    tone: "var(--ic-green)",
    img: "/media/film-feuchtemessung.webp",
    w: 432,
    h: 768,
    pos: "50% 30%",
    k: "Scientific Lab",
    title: "Verfahren im Detail",
    text: "Jedes Verfahren als Szenario, Film, Gleichung und 3D-Modell.",
  },
  {
    href: "/galerie/",
    Icon: Images,
    tone: "var(--ic-red)",
    img: "/img/brand/brand-van.webp",
    w: 540,
    h: 296,
    pos: "50% 50%",
    k: "Galerie & Team",
    title: "Filme und Bilder",
    text: "Unser Team im Einsatz, der Servicewagen und Stimmen von Kunden.",
  },
  {
    href: "/leistungen/#fuer-wen",
    Icon: Users,
    tone: "var(--ic-water)",
    img: "/img/brand/brand-walker.webp",
    w: 198,
    h: 302,
    pos: "50% 18%",
    k: "Für wen",
    title: "Haus oder Bestand",
    text: "Für Hausbesitzer, Hausverwaltungen, Vermieter und Unternehmen.",
  },
  {
    href: "/kostenrechner/",
    Icon: Calculator,
    tone: "var(--ic-green)",
    img: "/img/gallery/bohrung-injektion.webp",
    w: 679,
    h: 450,
    pos: "50% 50%",
    k: "Angebotsrechner",
    title: "Ihr Angebot planen",
    text: "Fläche und Schadensbild angeben, das Angebot kommt nach der Messung.",
  },
];

export default function MoreLinks() {
  const { cities, map } = cityData();
  return (
    <section id="mehr" className="sc-section more" aria-labelledby="mehr-title">
      <div className="sc-wrap">
        <p className="sc-label">Mehr erfahren</p>
        <h2 id="mehr-title" className="sc-display mt-3">
          Alles Weitere, <em>eine Seite tiefer.</em>
        </h2>
        <ul className="more__grid">
          {CARDS.map((c) => (
            <li key={c.href}>
              <a href={c.href} className="more__card" style={{ ["--ic" as string]: c.tone }}>
                <span className="more__ico" aria-hidden="true">
                  <c.Icon />
                </span>
                <span className="more__img">
                  <img src={c.img} width={c.w} height={c.h} alt="" loading="lazy" decoding="async" style={{ objectPosition: c.pos }} />
                </span>
                <span className="more__body">
                  <span className="more__k">{c.k}</span>
                  <span className="more__t">{c.title}</span>
                  <span className="more__d">{c.text}</span>
                  <span className="more__go" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="more__area">
          <p className="more__area-k">
            <MapPin aria-hidden="true" /> Servicegebiet PLZ 42 <span>Stadt antippen: Karte, Postleitzahlen und Anfahrt</span>
          </p>
          <CityFrames cities={cities} map={map} />
        </div>
        <nav className="more__quick" aria-label="Noch Fragen?">
          <a href="/leistungen/#wegweiser" className="more__chip more__chip--line">
            Welches Verfahren passt?
          </a>
          <a href="/leistungen/#faq" className="more__chip more__chip--line">
            Häufige Fragen
          </a>
        </nav>
      </div>
    </section>
  );
}
