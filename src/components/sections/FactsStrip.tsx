import CountUp from "@/components/ui/CountUp";

export interface Fact {
  value: string;
  label: string;
}

/** The key figures right under the hero: what a homeowner wants to know first. */
const HOME_FACTS: Fact[] = [
  { value: "10 Jahre", label: "Garantie auf unsere Arbeit" },
  { value: "25 Jahre", label: "Produktgarantie von SchimmelPeter" },
  { value: "0", label: "Erdarbeiten bei der Sanierung von innen" },
  { value: "24 h", label: "bis zum Termin vor Ort in Wuppertal" },
  { value: "5", label: "Messhöhen, Protokoll nach jeder Phase" },
  { value: "6", label: "Städte im Servicegebiet PLZ 42" },
];

/** A row of key figures that count up when they come into view. */
export default function FactsStrip({ facts = HOME_FACTS, title }: { facts?: Fact[]; title?: string }) {
  return (
    <section className="facts" aria-label={title ?? "Zahlen und Fakten"}>
      <div className="sc-wrap">
        {title ? <h2 className="sc-label mb-3">{title}</h2> : null}
        <dl className="facts__grid" style={{ ["--n" as string]: facts.length }}>
          {facts.map((f) => (
            <div key={f.label} className="facts__item">
              <dt>{f.label}</dt>
              <dd>
                <CountUp value={f.value} onView ms={900} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
