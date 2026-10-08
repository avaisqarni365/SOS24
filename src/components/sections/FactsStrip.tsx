import { ShieldCheck, BadgeCheck, Shovel, Clock, Ruler, MapPin, type LucideIcon } from "lucide-react";
import { PartnerText } from "@/components/brand/PartnerLink";

export interface Fact {
  value: string;
  label: string;
  Icon?: LucideIcon;
}

/** The key figures, each one short line: a bold value and what it means. */
const HOME_FACTS: Fact[] = [
  { value: "10 Jahre", label: "Garantie auf die Arbeit", Icon: ShieldCheck },
  { value: "25 Jahre", label: "Produktgarantie SchimmelPeter®", Icon: BadgeCheck },
  { value: "Ohne", label: "Aufgraben", Icon: Shovel },
  { value: "24 h", label: "bis zum Termin vor Ort", Icon: Clock },
  { value: "5", label: "Messhöhen je Messpunkt", Icon: Ruler },
  { value: "6", label: "Städte im Servicegebiet", Icon: MapPin },
];

function Chips({ facts, id, className = "" }: { facts: Fact[]; id?: string; className?: string }) {
  return (
    <ul id={id} className={`factchips ${className}`} aria-label="Zahlen und Fakten">
      {facts.map(({ value, label, Icon }) => (
        <li key={label}>
          {Icon ? (
            <span className="factchips__i" aria-hidden="true">
              <Icon />
            </span>
          ) : null}
          <span className="factchips__t">
            <strong>{value}</strong> <PartnerText text={label} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The key figures as a row of light chips. With `inHero` they sit in the
 * hero copy, so the first frame carries the claim, both contact buttons and
 * the figures at once.
 */
export default function FactsStrip({ facts = HOME_FACTS, title, inHero = false }: { facts?: Fact[]; title?: string; inHero?: boolean }) {
  if (inHero) return <Chips facts={facts} id="zahlen" className="factchips--hero" />;
  return (
    <section id="zahlen" className="facts facts--chips" aria-label={title ?? "Zahlen und Fakten"}>
      <div className="sc-wrap">
        {title ? <h2 className="sc-label mb-4">{title}</h2> : null}
        <Chips facts={facts} />
      </div>
    </section>
  );
}
