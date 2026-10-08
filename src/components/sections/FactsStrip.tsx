import { ShieldCheck, BadgeCheck, Shovel, Clock, Ruler, MapPin, type LucideIcon } from "lucide-react";
import { PartnerText } from "@/components/brand/PartnerLink";

export interface Fact {
  value: string;
  label: string;
  Icon?: LucideIcon;
  /** the icon's colour; by default the brand's green, dark red and water blue in turn */
  tone?: string;
}

/** The brand's three icon colours, used in turn. */
export const TONES = ["var(--ic-green)", "var(--ic-red)", "var(--ic-water)"];
export const toneAt = (i: number) => TONES[i % TONES.length];

/** The key figures in the first frame, each one short line. */
const HOME_FACTS: Fact[] = [
  { value: "10 Jahre", label: "Garantie auf die Arbeit", Icon: ShieldCheck },
  { value: "25 Jahre", label: "Produktgarantie SchimmelPeter®", Icon: BadgeCheck },
  { value: "Ohne", label: "Aufgraben", Icon: Shovel },
  { value: "24 h", label: "bis zum Termin vor Ort", Icon: Clock },
  { value: "5", label: "Messhöhen je Messpunkt", Icon: Ruler },
  { value: "6", label: "Städte im Servicegebiet", Icon: MapPin },
];

/**
 * Figures as light chips: an icon (or a coloured value), the value in bold,
 * what it means. On phones they become small tiles, three a row. Used in the
 * landing hero, on the service pages and in the Scientific Lab.
 */
export function FactChips({ facts, id, className = "", label = "Zahlen und Fakten" }: { facts: Fact[]; id?: string; className?: string; label?: string }) {
  return (
    <ul id={id} className={`factchips ${className}`} aria-label={label}>
      {facts.map(({ value, label: text, Icon, tone }, i) => (
        <li
          key={text}
          className={Icon ? "factchips__label" : "factchips__label factchips__label--plain"}
          style={{ ["--ic" as string]: tone ?? toneAt(i) }}
        >
          {Icon ? (
            <span className="factchips__i" aria-hidden="true">
              <Icon />
            </span>
          ) : null}
          <span className="factchips__t">
            <strong>{value}</strong> <PartnerText text={text} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The key figures. With `inHero` they sit in the hero copy, so the first
 * frame carries the claim, both contact buttons and the figures at once.
 */
export default function FactsStrip({ facts = HOME_FACTS, title, inHero = false }: { facts?: Fact[]; title?: string; inHero?: boolean }) {
  if (inHero) return <FactChips facts={facts} id="zahlen" className="factchips--hero" />;
  return (
    <section id="zahlen" className="facts facts--chips" aria-label={title ?? "Zahlen und Fakten"}>
      <div className="sc-wrap">
        {title ? <h2 className="sc-label mb-4">{title}</h2> : null}
        <FactChips facts={facts} />
      </div>
    </section>
  );
}
