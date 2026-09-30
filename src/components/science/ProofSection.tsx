import { PHASES, HEIGHTS_CM, BARRIER_CM, RULES } from "@/data/proof";
import { hy } from "@/lib/hyphenate";
import ProofPhasesClient from "./ProofPhasesClient";

/**
 * "Nachweis, Phase für Phase": every phase of the remediation confirmed by
 * measurement, from the Nullmessung to the signed Abnahme.
 */
export default function ProofSection() {
  const phases = PHASES.map((p) => ({ ...p, measure: hy(p.measure), criterion: hy(p.criterion), proof: hy(p.proof) }));
  return (
    <section id="nachweis" className="sc-section border-t border-white/5" aria-labelledby="nachweis-title">
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
              "Ob eine Sanierung wirkt, entscheidet nicht der Eindruck, sondern die Messung. Deshalb beginnt jede Sanierung mit einer Nullmessung an festen Punkten und endet mit einer Vergleichsmessung an denselben Punkten. Dazwischen ist jeder Schritt dokumentiert."
            )}
          </p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Messregeln">
          {RULES.map((r) => (
            <li key={r.title} className="rounded-[18px] border border-white/10 bg-[var(--ink-2)] p-4">
              <p className="no-justify font-semibold text-[var(--bone)]">{r.title}</p>
              <p className="mt-1 text-sm text-[var(--sc-ink-soft)]">{hy(r.text)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <ProofPhasesClient phases={phases} heights={HEIGHTS_CM} barrier={BARRIER_CM} />
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-[18px] border border-white/10 bg-[var(--ink-2)] p-5">
            <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--sc-ink-soft)]">Garantie auf die Arbeit</dt>
            <dd className="mt-1 font-editorial text-3xl text-[var(--bone)]">10 Jahre</dd>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-[var(--ink-2)] p-5">
            <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--sc-ink-soft)]">Produktgarantie SchimmelPeter</dt>
            <dd className="mt-1 font-editorial text-3xl text-[var(--bone)]">bis 25 Jahre</dd>
          </div>
          <div className="rounded-[18px] border border-white/10 bg-[var(--ink-2)] p-5">
            <dt className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--sc-ink-soft)]">Erdarbeiten</dt>
            <dd className="mt-1 font-editorial text-3xl text-[var(--bone)]">keine</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
