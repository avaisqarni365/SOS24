"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Home, Layers, ShieldCheck, SprayCan, Gauge, Wrench, Umbrella, Sun, PanelBottom, MessageCircle, Mail, Phone, CheckCircle2, type LucideIcon } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

/**
 * The quote planner. No euro figure anywhere: a price guessed from three
 * inputs is wrong for most cellars, and the client fixes it after the free
 * measurement. What the visitor gets instead is what really scales with the
 * size of the job: how big the job is, roughly how long we are on site, and
 * what the fixed-price quote will contain. The inputs travel with the
 * request, so the first call starts from them.
 */
type Svc = {
  slug: string;
  title: string;
  Icon: LucideIcon;
  /** what is measured, and in which unit */
  what: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  /** a typical job of this kind: the middle of the scale */
  typical: number;
  /** units per working day on site */
  perDay: number;
  includes: string[];
};

const SERVICES: Svc[] = [
  {
    slug: "horizontalsperre",
    title: "Feuchte Wand",
    Icon: Layers,
    what: "Wandlänge",
    unit: "m",
    min: 2,
    max: 80,
    step: 1,
    typical: 15,
    perDay: 12,
    includes: ["Bohrlochreihe, höchstens 20 cm Abstand", "Injektion mit Silan-Siloxan-Creme", "Bohrlöcher verschlossen", "Messprotokoll vorher und nachher"],
  },
  {
    slug: "kellerinnenabdichtung",
    title: "Keller abdichten",
    Icon: ShieldCheck,
    what: "Wandfläche",
    unit: "m²",
    min: 5,
    max: 250,
    step: 5,
    typical: 40,
    perDay: 14,
    includes: ["Untergrund vorbereiten, Hohlkehle", "Dichtschlämme in zwei Lagen", "Sanierputz nach WTA", "Abnahme mit Messprotokoll"],
  },
  {
    slug: "kellersanierung",
    title: "Kellersanierung",
    Icon: Home,
    what: "Kellerfläche",
    unit: "m²",
    min: 10,
    max: 300,
    step: 5,
    typical: 60,
    perDay: 9,
    includes: ["Ursache gemessen und benannt", "Abdichtung von innen", "Sanierputz und Oberflächen", "10 Jahre Garantie auf die Arbeit"],
  },
  {
    slug: "schimmelbeseitigung",
    title: "Schimmel",
    Icon: SprayCan,
    what: "befallene Fläche",
    unit: "m²",
    min: 1,
    max: 100,
    step: 1,
    typical: 8,
    perDay: 14,
    includes: ["Ursache: Kondensat oder Feuchte", "sporensichere Entfernung", "Calciumsilikat-Platte, wo nötig", "Lüftungs- und Heizempfehlung"],
  },
  {
    slug: "rissverpressung",
    title: "Riss",
    Icon: Wrench,
    what: "Risslänge",
    unit: "m",
    min: 1,
    max: 50,
    step: 1,
    typical: 5,
    perDay: 10,
    includes: ["Packer gesetzt", "PU-Harz oder Epoxid verpresst", "Oberfläche verschlossen", "Dichtheit geprüft"],
  },
  {
    slug: "dachabdichtung",
    title: "Dach",
    Icon: Umbrella,
    what: "Dachfläche",
    unit: "m²",
    min: 10,
    max: 500,
    step: 10,
    typical: 80,
    perDay: 55,
    includes: ["Altbelag geprüft oder entfernt", "Elastomerbitumen, verschweißt", "Anschlüsse und Abläufe", "Dichtheitskontrolle"],
  },
  {
    slug: "balkon-terrasse",
    title: "Balkon",
    Icon: Sun,
    what: "Fläche",
    unit: "m²",
    min: 2,
    max: 150,
    step: 1,
    typical: 15,
    perDay: 15,
    includes: ["Untergrund vorbereitet", "Flüssigkunststoff mit Vlies", "Anschlüsse ohne Naht", "Nutzschicht nach Wunsch"],
  },
  {
    slug: "sockelabdichtung",
    title: "Sockel",
    Icon: PanelBottom,
    what: "Sockellänge",
    unit: "m",
    min: 5,
    max: 150,
    step: 5,
    typical: 30,
    perDay: 18,
    includes: ["Sockel freigelegt und gereinigt", "Bitumen-Dickbeschichtung in zwei Lagen", "Spritzwasserschutz", "Übergang zum Putz"],
  },
  {
    slug: "feuchtemessung",
    title: "Nur Messung",
    Icon: Gauge,
    what: "Räume",
    unit: "Räume",
    min: 1,
    max: 20,
    step: 1,
    typical: 3,
    perDay: 8,
    includes: ["Messung in fünf Höhen je Punkt", "CM-Messung, wo nötig", "Ursache benannt", "Protokoll für Sie"],
  },
];

const STATES = [
  { id: "leicht", label: "Leicht", hint: "Flecken, muffiger Geruch", factor: 0.85 },
  { id: "deutlich", label: "Deutlich", hint: "Putz bröckelt, Salzränder", factor: 1 },
  { id: "stark", label: "Stark", hint: "Wasser steht oder läuft", factor: 1.3 },
] as const;

const LEVELS = ["Klein", "Überschaubar", "Mittel", "Groß", "Sehr groß"];

function levelOf(ratio: number) {
  if (ratio < 0.5) return 0;
  if (ratio < 0.9) return 1;
  if (ratio < 1.5) return 2;
  if (ratio < 2.6) return 3;
  return 4;
}

function daysText(days: number, slug: string) {
  if (slug === "feuchtemessung") return days <= 1 ? "ein Termin, etwa zwei Stunden" : "ein bis zwei Termine";
  if (days <= 1) return "etwa ein Arbeitstag";
  if (days <= 2.5) return "etwa 2 bis 3 Arbeitstage";
  if (days <= 5) return "etwa eine Arbeitswoche";
  if (days <= 10) return "etwa 1 bis 2 Wochen";
  return "mehrere Wochen, in Abschnitten";
}

const fmt = (n: number) => n.toLocaleString("de-DE");

export default function QuoteCalculator() {
  const [slug, setSlug] = useState(SERVICES[0].slug);
  const svc = SERVICES.find((s) => s.slug === slug) ?? SERVICES[0];
  const [qty, setQty] = useState(svc.typical);
  const [state, setState] = useState<(typeof STATES)[number]["id"]>("deutlich");

  const pick = (s: Svc) => {
    setSlug(s.slug);
    setQty(s.typical);
  };

  const result = useMemo(() => {
    const f = STATES.find((x) => x.id === state)?.factor ?? 1;
    const ratio = (qty / svc.typical) * f;
    const level = levelOf(ratio);
    const days = (qty / svc.perDay) * f;
    return { level, days: daysText(days, svc.slug) };
  }, [qty, state, svc]);

  const stateLabel = STATES.find((x) => x.id === state)?.label ?? "";
  const summary = `${svc.title}: ${fmt(qty)} ${svc.unit} ${svc.what}, Schaden ${stateLabel.toLowerCase()}`;
  const message = `Hallo Herr Mahmood, ich bitte um ein Festpreis-Angebot nach kostenloser Messung. Mein Vorhaben: ${summary}. Umfang laut Angebotsrechner: ${LEVELS[result.level]}.`;
  const wa = `https://wa.me/${COMPANY_INFO.phoneTel.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  const mail = `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(`Angebot: ${svc.title}`)}&body=${encodeURIComponent(message)}`;
  const fill = ((qty - svc.min) / (svc.max - svc.min)) * 100;

  return (
    <section id="rechner" className="quote sc-section pt-6" aria-label="Angebotsrechner">
      <div className="sc-wrap">
        <div className="quote__card">
          <div className="quote__inputs">
            <fieldset className="quote__step">
              <legend className="quote__k">
                <span>1</span> Was soll gemacht werden?
              </legend>
              <div className="quote__svcs">
                {SERVICES.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    className="quote__svc"
                    aria-pressed={s.slug === slug}
                    onClick={() => pick(s)}
                  >
                    <s.Icon aria-hidden="true" strokeWidth={1.7} />
                    {s.title}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="quote__step">
              <div className="quote__row">
                <label htmlFor="quote-qty" className="quote__k">
                  <span>2</span> {svc.what}
                </label>
                <output htmlFor="quote-qty" className="quote__qty">
                  {fmt(qty)} {svc.unit}
                </output>
              </div>
              <input
                id="quote-qty"
                type="range"
                min={svc.min}
                max={svc.max}
                step={svc.step}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="quote__range"
                style={{ "--fill": `${fill}%` } as CSSProperties}
                aria-valuetext={`${fmt(qty)} ${svc.unit}`}
              />
              <div className="quote__scale" aria-hidden="true">
                <span>
                  {fmt(svc.min)} {svc.unit}
                </span>
                <span>
                  {fmt(svc.max)} {svc.unit}
                </span>
              </div>
            </div>

            <fieldset className="quote__step">
              <legend className="quote__k">
                <span>3</span> Wie stark ist der Schaden?
              </legend>
              <div className="quote__states">
                {STATES.map((s) => (
                  <button key={s.id} type="button" className="quote__state" aria-pressed={s.id === state} onClick={() => setState(s.id)}>
                    <strong>{s.label}</strong>
                    <span>{s.hint}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="quote__out" aria-live="polite">
            <p className="quote__k quote__k--plain">Ihr Vorhaben</p>
            <p className="quote__big">
              {fmt(qty)} {svc.unit}
              <span>
                {svc.what} · {svc.title}
              </span>
            </p>

            <p className="quote__k quote__k--plain">Umfang des Auftrags</p>
            <div className="quote__meter" role="img" aria-label={`Umfang: ${LEVELS[result.level]}, Stufe ${result.level + 1} von 5`}>
              {LEVELS.map((l, i) => (
                <span key={l} className={i <= result.level ? "is-on" : ""} style={{ height: `${36 + i * 16}%` }} />
              ))}
            </div>
            <p className="quote__level">
              {LEVELS[result.level]}
              <span>Arbeit vor Ort: {result.days}</span>
            </p>

            <p className="quote__k quote__k--plain">Das steht im Festpreis-Angebot</p>
            <ul className="quote__list">
              {svc.includes.map((x) => (
                <li key={x}>
                  <CheckCircle2 aria-hidden="true" />
                  {x}
                </li>
              ))}
            </ul>

            <ol className="quote__how">
              <li>
                <strong>Kostenlose Messung</strong> vor Ort
              </li>
              <li>
                <strong>Festpreis</strong> schriftlich
              </li>
              <li>
                <strong>Ausführung</strong> mit Garantie
              </li>
            </ol>

            <div className="quote__cta">
              <a href={wa} target="_blank" rel="noopener noreferrer" className="quote__btn quote__btn--solid">
                <MessageCircle aria-hidden="true" />
                Angebot per WhatsApp anfragen
              </a>
              <div className="quote__cta-row">
                <a href={mail} className="quote__btn">
                  <Mail aria-hidden="true" />
                  Per E-Mail
                </a>
                <a href={`tel:${COMPANY_INFO.phoneTel}`} className="quote__btn">
                  <Phone aria-hidden="true" />
                  Anrufen
                </a>
              </div>
            </div>
            <p className="quote__note">
              Je größer die Fläche, desto größer der Auftrag. Einen Preis nennen wir erst nach der kostenlosen Messung,
              dann schriftlich und verbindlich. Ihre Angaben gehen nur mit, wenn Sie die Anfrage selbst absenden.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
