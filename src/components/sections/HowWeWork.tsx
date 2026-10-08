import { PROCESS_PIPELINE } from "@/data/content-data";

/**
 * What the work actually is, on the dark plate: four steps, one line each.
 * The long version lives on /labor/ -- here it only has to answer
 * "what happens if I call", in the time it takes to scroll past.
 */
export default function HowWeWork() {
  return (
    <section id="ablauf" className="sc-section band-ink" aria-labelledby="ablauf-title">
      <div className="sc-wrap">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-end">
          <div>
            <p className="sc-label">Der Ablauf</p>
            <h2 id="ablauf-title" className="sc-display mt-4 max-w-[16ch]">
              Vier Schritte. <em>Keine Überraschungen.</em>
            </h2>
          </div>
          <p className="sc-lede max-w-[46ch] lg:justify-self-end">
            Von der kostenlosen Messung bis zur gemeinsamen Abnahme — mit 10 Jahren
            Garantie auf unsere Arbeit.
          </p>
        </div>

        <ol className="steps mt-14">
          {PROCESS_PIPELINE.map((p) => (
            <li key={p.step} className="step">
              <span className="step__n">{p.step}</span>
              <h3 className="step__t">{p.title}</h3>
              <p className="step__d">{p.desc.split(/(?<=\.)\s/)[0]}</p>
            </li>
          ))}
        </ol>

        <p className="mt-12">
          <a href="/labor/" className="link-quiet">
            Das Verfahren in 3D durchgehen, mit Messnachweis je Phase
            <span aria-hidden="true"> →</span>
          </a>
        </p>
      </div>
    </section>
  );
}
