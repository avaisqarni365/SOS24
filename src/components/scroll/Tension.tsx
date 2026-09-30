/**
 * Recognition and tension. The frame holds still while the lines assemble,
 * and the wall behind them gets worse: the damp stain climbs, salt blooms,
 * mould arrives last.
 */
export default function Tension() {
  return (
    <section
      className="tension"
      aria-labelledby="tension-title"
      data-sc-act="pin"
      data-sc-span="2.6"
      data-sc-drift="#121714"
      style={{ ["--sc-span" as string]: 2.6 }}
    >
      <div data-sc-stage className="tension__stage">
        <div className="tension__wall" aria-hidden="true">
          <img
            src="/img/sp/feuchte-wand-aufsteigende-feuchtigkeit-960.webp"
            srcSet="/img/sp/feuchte-wand-aufsteigende-feuchtigkeit-480.webp 480w, /img/sp/feuchte-wand-aufsteigende-feuchtigkeit-960.webp 960w"
            sizes="100vw"
            width={960}
            height={640}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="tension__lines">
          <h2 id="tension-title" className="visually-hidden">
            Typische Anzeichen für einen feuchten Keller
          </h2>
          <p data-sc-cue="0 0.34 0">Der Putz bröckelt im unteren Meter.</p>
          <p data-sc-cue="0.2 0.56">Weiße Salzränder wandern die Wand hinauf.</p>
          <p data-sc-cue="0.42 0.78">Es riecht modrig, sobald die Kellertür aufgeht.</p>
          <p className="turn" data-sc-cue="0.68">
            Das Wasser kommt von unten. Also stoppen wir es genau dort.
          </p>
        </div>
      </div>
    </section>
  );
}
