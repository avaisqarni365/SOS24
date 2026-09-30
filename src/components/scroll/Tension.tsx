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
          <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="t-wall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1a211d" />
                <stop offset="1" stopColor="#121714" />
              </linearGradient>
              <linearGradient id="t-stain" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#2c4d6e" stopOpacity="0.85" />
                <stop offset="0.55" stopColor="#2c4d6e" stopOpacity="0.35" />
                <stop offset="0.8" stopColor="#6b6247" stopOpacity="0.25" />
                <stop offset="1" stopColor="#6b6247" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect width="1600" height="1000" fill="url(#t-wall)" />
            <path
              className="stain"
              d="M0 1000 L0 640 C120 610 200 660 320 626 C460 588 560 650 700 618 C860 582 960 646 1120 610 C1260 580 1380 640 1600 604 L1600 1000 Z"
              fill="url(#t-stain)"
            />
            <g className="salt" fill="#e8e1cf">
              {Array.from({ length: 70 }).map((_, i) => {
                const x = (i * 211) % 1600;
                const y = 560 + ((i * 97) % 140);
                return <circle key={i} cx={x} cy={y} r={1.5 + (i % 3)} opacity={0.35 + (i % 4) * 0.12} />;
              })}
            </g>
            <g className="mould" fill="#2a3a2c">
              <circle cx="1450" cy="180" r="38" opacity="0.55" />
              <circle cx="1500" cy="150" r="22" opacity="0.5" />
              <circle cx="1410" cy="140" r="16" opacity="0.45" />
              <circle cx="1530" cy="210" r="14" opacity="0.4" />
              <circle cx="140" cy="220" r="26" opacity="0.4" />
              <circle cx="180" cy="190" r="12" opacity="0.4" />
            </g>
            <rect y="960" width="1600" height="40" fill="#0e1310" />
          </svg>
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
