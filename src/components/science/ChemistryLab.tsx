import { CHEMISTRY, type Reaction } from "@/data/chemistry";

/**
 * Formula setter. The data writes `H_2O` and `30×10^3`; this turns the `_`
 * and `^` runs into real <sub>/<sup> so the equations read as chemistry
 * rather than as source code. Everything else passes through untouched.
 */
function Formula({ source }: { source: string }) {
  const parts = source.split(/([_^][0-9a-zA-Z]+)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("_")) return <sub key={i}>{p.slice(1)}</sub>;
        if (p.startsWith("^")) return <sup key={i}>{p.slice(1)}</sup>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

function ReactionRow({ r }: { r: Reaction }) {
  return (
    <li className="rx">
      <p className="rx__stage">{r.stage}</p>
      <p className="rx__eq">
        <Formula source={r.equation} />
      </p>
      <p className="rx__note">{r.note}</p>
    </li>
  );
}

/** The chemistry chapter: one entry per service, each with its equations. */
export default function ChemistryLab() {
  return (
    <section id="chemie" className="sc-section band-bone" aria-labelledby="chemie-title">
      <div className="sc-wrap">
        <p className="sc-label">Die Reaktion</p>
        <h2 id="chemie-title" className="sc-display mt-4 max-w-[20ch]">
          Was im Mauerwerk <em>tatsächlich passiert.</em>
        </h2>
        <p className="sc-lede mt-6 max-w-[52ch]">
          Jedes Verfahren ist eine Reaktion mit dem Wasser, das im Bauteil steht. Hier
          stehen sie ausgeschrieben — mit dem Messwert, an dem sich ablesen lässt, ob
          sie stattgefunden hat.
        </p>

        <div className="chem">
          {CHEMISTRY.map((c, i) => (
            <article key={c.slug} className="chem__entry" id={`chemie-${c.slug}`}>
              <header className="chem__head">
                <span className="chem__n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="chem__service">{c.service}</p>
                  <h3 className="chem__h">{c.heading}</h3>
                  <p className="chem__intro">{c.intro}</p>
                </div>
              </header>
              <ol className="rx-list">
                {c.reactions.map((r) => (
                  <ReactionRow key={r.stage} r={r} />
                ))}
              </ol>
              <p className="chem__out">
                <span className="chem__out-v">{c.outcome.value}</span>
                <span className="chem__out-l">{c.outcome.label}</span>
              </p>
              <p className="chem__link">
                <a href={`/leistungen/${c.slug}/`}>
                  {c.service} als Leistung ansehen <span aria-hidden="true">→</span>
                </a>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
