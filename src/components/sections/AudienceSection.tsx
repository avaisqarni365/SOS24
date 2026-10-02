import { Home, Building2, Check, PhoneCall, Ruler, FileCheck2 } from "lucide-react";
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
      "Verbindliches Festpreisangebot nach der Messung",
      "10 Jahre Garantie auf die Arbeit, 25 Jahre Produktgarantie von SchimmelPeter",
      "Feuchte-Check auch vor dem Hauskauf",
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
      "Schriftliche Messprotokolle zu jeder Phase, etwa für Eigentümerversammlung oder Versicherung",
      "Arbeiten von innen, ohne Baustelle vor dem Haus; Mieter und Betrieb bleiben weitgehend ungestört",
      "Festpreis je Objekt nach Begehung und Messung",
      `Direkter Draht zu ${COMPANY_INFO.owner}`,
    ],
    cta: { label: "Objektbegehung anfragen", href: "#kontakt" },
    more: { label: "Ablauf mit Nachweis", href: "#nachweis" },
  },
];

const STEPS = [
  { Icon: PhoneCall, title: "Anfragen", text: "Anruf, WhatsApp oder Formular. Wir melden uns in der Regel innerhalb von 24 Stunden." },
  { Icon: Ruler, title: "Messen vor Ort", text: "Kostenlose Feuchtemessung an festen Punkten. Sie sehen die Werte selbst." },
  { Icon: FileCheck2, title: "Angebot und Sanierung", text: "Festpreis, Termin, Ausführung mit Protokoll in jeder Phase." },
];

export default function AudienceSection() {
  return (
    <section id="fuer-wen" className="sc-section band-mint" aria-labelledby="fuer-wen-title">
      <div className="sc-wrap">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="sc-label">Für wen wir arbeiten</p>
            <h2 id="fuer-wen-title" className="sc-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
              Ein Keller, zwei Blickwinkel. <em className="text-[var(--mint)]">Eine Lösung.</em>
            </h2>
          </div>
          <p className="sc-body">
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
              <h3 className="mt-2 font-editorial text-3xl leading-tight text-[var(--bone)]">{title}</h3>
              <ul className="mt-5 grid gap-2.5">
                {points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-[0.98rem] leading-snug text-[var(--bone)]/85">
                    <Check className="mt-0.5 h-5 w-5 flex-none text-[var(--mint)]" aria-hidden="true" />
                    <span>{hy(p)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={cta.href}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[var(--grad)] px-6 text-sm font-semibold text-white shadow-sm hover:opacity-95 transition-opacity"
                >
                  {cta.label} <span aria-hidden="true">&nbsp;→</span>
                </a>
                <a href={more.href} className="text-sm font-semibold text-[var(--emerald-deep)] underline-offset-4 hover:underline">
                  {more.label}
                </a>
              </div>
            </article>
          ))}
        </div>

        <ol className="audience-steps mt-6" aria-label="So beginnt jede Sanierung">
          {STEPS.map(({ Icon, title, text }, i) => (
            <li key={title}>
              <span className="audience-steps__num">{i + 1}</span>
              <div>
                <p className="no-justify flex items-center gap-2 font-semibold text-[var(--bone)]">
                  <Icon className="h-4 w-4 text-[var(--mint)]" aria-hidden="true" />
                  {title}
                </p>
                <p className="mt-1 text-sm text-[var(--sc-ink-soft)]">{hy(text)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
