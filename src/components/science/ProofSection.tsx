import { PHASES, HEIGHTS_CM, BARRIER_CM, RULES } from "@/data/proof";
import { hy } from "@/lib/hyphenate";
import { Check } from "lucide-react";
import ProofPhasesClient from "./ProofPhasesClient";

/**
 * "Nachweis, Phase für Phase": every phase of the remediation confirmed by
 * measurement, from the Nullmessung to the signed Abnahme.
 */
export default function ProofSection() {
  const phases = PHASES.map((p) => ({ ...p, measure: hy(p.measure), criterion: hy(p.criterion), proof: hy(p.proof) }));
  return (
    <section id="nachweis" className="sc-section border-t border-line/5" aria-labelledby="nachweis-title">
      <span id="ablauf" aria-hidden="true" />
      <div className="sc-wrap">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="sc-label">Ablauf mit Nachweis</p>
            <h2 id="nachweis-title" className="sc-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
              Feuchte Wände trockenlegen, <em className="text-[var(--mint)]">messbar in jeder Phase.</em>
            </h2>
          </div>
          <p className="sc-body">
            {hy(
              "Ob eine Sanierung wirkt, entscheidet nicht der Eindruck, sondern die Messung. Deshalb beginnt jede Sanierung mit einer Nullmessung an festen Punkten und endet mit einer Vergleichsmessung an denselben Punkten. Dazwischen ist jeder Schritt dokumentiert, und jedes Messprotokoll erhalten Sie schriftlich."
            )}
          </p>
        </div>

        <ul className="proof-rules mt-8" aria-label="Messregeln">
          {RULES.map((r) => (
            <li key={r.title} title={r.text}>
              <Check aria-hidden="true" />
              {r.title}
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <ProofPhasesClient phases={phases} heights={HEIGHTS_CM} barrier={BARRIER_CM} />
        </div>

      </div>
    </section>
  );
}
