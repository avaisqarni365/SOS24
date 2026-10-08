import { Home, Building2, Check } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";
import { hy } from "@/lib/hyphenate";

/**
 * Two ways in, right after the hero: homeowners and those who look after
 * several buildings (property managers, landlords, companies). Each path
 * says what they get and leads to one action; underneath, the three steps
 * every job starts with.
 */
const PATHS = [
  {
    id: "fuer-hausbesitzer",
    Icon: Home,
    kicker: "Für Hausbesitzer",
    title: "Ihr Keller wird wieder trocken und nutzbar.",
    points: [
      "Kostenlose Feuchtemessung vor Ort: erst die Ursache, dann das Verfahren",
      "Sanierung von innen, Garten und Einfahrt bleiben unberührt",
      "10 Jahre Garantie auf die Arbeit, 25 Jahre Produktgarantie",
    ],
    cta: { label: "Kostenlose Messung anfragen", href: "#kontakt" },
    more: { label: "Feuchtemessung & Gutachten", href: "/leistungen/feuchtemessung/" },
  },
  {
    id: "fuer-unternehmen",
    Icon: Building2,
    kicker: "Für Hausverwaltungen, Vermieter & Unternehmen",
    title: "Mehrere Objekte, ein Ansprechpartner.",
    points: [
      "Mehrfamilienhäuser, Wohnanlagen und Gewerbekeller im Raum PLZ 42",
      "Schriftliche Messprotokolle zu jeder Phase, für Eigentümerversammlung oder Versicherung",
      `Festpreis je Objekt, direkter Draht zu ${COMPANY_INFO.owner}`,
    ],
    cta: { label: "Objektbegehung anfragen", href: "#kontakt" },
    more: { label: "Ablauf mit Nachweis", href: "/labor/" },
  },
];

export default function AudienceSection() {
  return (
    <section id="fuer-wen" className="sc-section" aria-labelledby="fuer-wen-title">
      <div className="sc-wrap">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="sc-label">Für wen wir arbeiten</p>
            <h2 id="fuer-wen-title" className="sc-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
              Ein Keller, zwei Blickwinkel. <em className="text-accent-deep">Eine Lösung.</em>
            </h2>
          </div>
          <p className="sc-body font-medium">
            {hy(
              "Ob Ihr eigenes Haus oder ein ganzer Bestand: Am Anfang steht immer die Messung, am Ende ein trockener Keller mit Protokoll. Wählen Sie Ihren Weg."
            )}
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {PATHS.map(({ id, Icon, kicker, title, points, cta, more }) => (
            <article id={id} key={id} className="audience-card">
              <span className="audience-card__icon" aria-hidden="true">
                <Icon strokeWidth={1.6} />
              </span>
              <p className="sc-label mt-5">{kicker}</p>
              <h3 className="mt-2 font-editorial text-3xl leading-tight font-bold">{title}</h3>
              <ul className="mt-5 grid gap-2.5">
                {points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-[0.98rem] leading-snug font-medium">
                    <Check className="mt-0.5 h-5 w-5 flex-none text-accent-deep" aria-hidden="true" />
                    <span>{hy(p)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={cta.href}
                  className="btn-shine inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-sm font-semibold shadow-sm hover:opacity-95 transition-opacity"
                >
                  {cta.label} <span aria-hidden="true">&nbsp;→</span>
                </a>
                <a href={more.href} className="text-sm font-semibold text-accent-deep underline-offset-4 hover:underline">
                  {more.label}
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

