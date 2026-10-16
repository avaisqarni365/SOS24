import { hy } from "@/lib/hyphenate";
import "./NegativeSeal.css";

/**
 * Keller von innen abdichten: a section through soil, basement wall and room.
 * The sealing sits on the negative side, so the water pushes it away from the
 * wall. Shown as the finished build-up with every layer and label visible,
 * followed by the legend; nothing is tied to scrolling.
 */

/** Pressure arrows in the saturated soil: longer and heavier with depth. */
const WATER_TABLE = 230;
const ARROW_Y = [290, 360, 430, 500, 570];

/** Zigzag along the prepared wall face: the pores the slurry keys into. */
function keyedFace(): string {
  let d = "M540 0";
  for (let y = 0; y < 516; y += 12) d += ` L545 ${y + 6} L540 ${y + 12}`;
  return d;
}

const LEGEND = [
  {
    name: "Erdreich und Wasserdruck",
    color: "#7a6146",
    text: "Das Wasser im Erdreich drückt von außen gegen die Wand. Der hydrostatische Druck wächst um etwa 0,1 bar, also rund 10 kN/m², je Meter Wassertiefe.",
  },
  {
    name: "Mauerwerk",
    color: "#9a6b4b",
    text: "Die Wand trägt, dichtet aber selbst nicht. Hinter einer Innenabdichtung bleibt sie durchfeuchtet, der Raum davor wird trocken.",
  },
  {
    name: "Vorbereiteter Untergrund",
    color: "#e9dcc6",
    text: "Alter Putz und lose Teile werden bis auf den tragfähigen, sauberen Untergrund entfernt, denn nur dort kann die Abdichtung haften.",
  },
  {
    name: "Hohlkehle",
    color: "#a9a391",
    text: "Eine Kehle aus Dichtmörtel rundet den Boden-Wand-Anschluss aus, an dem sonst Risse und Wasserwege entstehen.",
  },
  {
    name: "Dichtschlämme (2 Lagen)",
    color: "#8f9a96",
    text: "Die mineralische Dichtschlämme wird in zwei Lagen aufgetragen und verkrallt sich in den Poren, sodass der Wasserdruck sie nicht abdrückt.",
  },
  {
    name: "Sanierputz",
    color: "#d9d2c1",
    text: "Der diffusionsoffene Sanierputz schließt die Wand zum Raum ab und lagert Salze in seinem Porenraum ein, ohne dass die Oberfläche ausblüht.",
  },
];

export default function NegativeSeal() {
  return (
    <section
      className="negseal"
      aria-label="Keller von innen abdichten: Aufbau der Innenabdichtung Schicht für Schicht"
    >
      <div className="negseal__stage">
        <figure className="ns-figure">
          <p className="sc-label ns-kicker">Schnitt: Erdreich, Kellerwand, Raum</p>
          <svg data-i18n=""
            className="ns-svg"
            viewBox="0 0 1200 700"
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-labelledby="ns-title ns-desc"
          >
            <title id="ns-title">Innenabdichtung einer Kellerwand im Schnitt</title>
            <desc id="ns-desc">
              Links das Erdreich mit Grundwasser, dessen Druck mit der Tiefe zunimmt. In der Mitte die
              durchfeuchtete Mauerwerkswand. Rechts auf der Raumseite der vorbereitete Untergrund, die
              Hohlkehle am Boden-Wand-Anschluss, zwei Lagen mineralische Dichtschlämme und der
              Sanierputz. Der Wasserdruck endet an der Abdichtung, der Raum bleibt trocken.
            </desc>
            <defs>
              <linearGradient id="ns-soil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#7a6146" />
                <stop offset="1" stopColor="#3a2f22" />
              </linearGradient>
              <pattern id="ns-brick" width="40" height="24" patternUnits="userSpaceOnUse" x="420">
                <rect width="40" height="24" fill="#9a6b4b" />
                <path d="M0 1 H40 M0 13 H40 M20 1 V13 M0 13 V24 M40 13 V24" stroke="#6e4a33" strokeWidth="2.5" />
              </pattern>
              <linearGradient id="ns-damp-wall" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#3b6ea8" stopOpacity="0.8" />
                <stop offset="1" stopColor="#3b6ea8" stopOpacity="0.35" />
              </linearGradient>
              <linearGradient id="ns-damp-room" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#3b6ea8" stopOpacity="0.7" />
                <stop offset="1" stopColor="#3b6ea8" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="ns-room" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#18201c" />
                <stop offset="1" stopColor="#222c27" />
              </linearGradient>
            </defs>

            {/* sky strip, soil, groundwater */}
            <rect width="1200" height="700" fill="#0e1310" />
            <rect x="0" y="64" width="420" height="636" fill="url(#ns-soil)" />
            <path d="M0 64 H420" stroke="#4f6b45" strokeWidth="6" />
            <g fill="#5e4a35" opacity="0.8">
              {[
                [60, 120, 14, 8], [180, 150, 10, 6], [300, 110, 16, 9], [120, 200, 9, 5],
                [360, 190, 12, 7], [70, 380, 12, 7], [240, 470, 14, 8], [140, 540, 10, 6],
                [330, 620, 13, 7], [60, 660, 11, 6], [210, 320, 9, 5],
              ].map(([cx, cy, rx, ry]) => (
                <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} />
              ))}
            </g>
            <rect x="0" y={WATER_TABLE} width="420" height={700 - WATER_TABLE} fill="#3b6ea8" opacity="0.24" />
            <rect x="540" y="656" width="660" height="44" fill="#3a2f22" />
            <rect x="540" y="656" width="660" height="44" fill="#3b6ea8" opacity="0.3" />
            <path
              d={`M0 ${WATER_TABLE} q26 -7 52 0 t52 0 t52 0 t52 0 t52 0 t52 0 t52 0 t52 0`}
              stroke="#8fb6e0"
              strokeWidth="3"
              fill="none"
            />
            <path d={`M290 ${WATER_TABLE - 30} h28 l-14 20 z`} fill="#8fb6e0" />
            <text x="24" y={WATER_TABLE - 14} className="ns-t ns-t--soil">Grundwasserspiegel</text>

            {/* room and floor slab */}
            <rect x="540" y="0" width="660" height="600" fill="url(#ns-room)" />
            <rect x="540" y="600" width="660" height="56" fill="#8a8f8b" />
            <g fill="#6f7572">
              {[580, 660, 760, 850, 960, 1050, 1140].map((x, i) => (
                <circle key={x} cx={x} cy={620 + (i % 3) * 10} r={3 + (i % 2)} />
              ))}
            </g>

            {/* the wall, and the damp inside it */}
            <rect x="420" y="0" width="120" height="700" fill="url(#ns-brick)" />
            <rect className="ns-damp-wall" x="420" y="190" width="120" height="510" fill="url(#ns-damp-wall)" />

            {/* old damp plaster, taken off in phase B (gone in the static final state) */}
            <g className="ns-oldplaster">
              <rect x="540" y="0" width="24" height="600" fill="#b9ae98" />
              <rect x="540" y="300" width="24" height="300" fill="#3b6ea8" opacity="0.45" />
              <g fill="#e8e1cf">
                <circle cx="552" cy="318" r="3" />
                <circle cx="558" cy="296" r="2.5" />
                <circle cx="548" cy="340" r="2.5" />
              </g>
              <path d="M548 420 l8 14 l-6 10 l9 18" stroke="#6f6656" strokeWidth="2" fill="none" />
            </g>
            <rect className="ns-damp-room" x="540" y="300" width="240" height="300" fill="url(#ns-damp-room)" />

            {/* 3: prepared, keyed substrate face */}
            <path className="ns-prep" d={keyedFace()} stroke="#e9dcc6" strokeWidth="3" fill="none" />

            {/* 4: Hohlkehle (cove) at the floor-wall joint */}
            <path className="ns-cove" d="M540 524 A76 76 0 0 0 616 600 L540 600 Z" fill="#a9a391" />

            {/* 5: two coats of mineral sealing slurry, over wall, cove and floor */}
            <path
              className="ns-coat ns-coat--1"
              pathLength={1}
              d="M544 0 V524 A72 72 0 0 0 616 596 H1200"
              stroke="#8f9a96"
              strokeWidth="8"
              fill="none"
            />
            <path
              className="ns-coat ns-coat--2"
              pathLength={1}
              d="M552 0 V524 A64 64 0 0 0 616 588 H1200"
              stroke="#b3bdb9"
              strokeWidth="8"
              fill="none"
            />

            {/* 6: Sanierputz */}
            <rect className="ns-putz" x="556" y="0" width="26" height="516" fill="#d9d2c1" />

            {/* water pressure: arrows grow with depth, plus uplift under the slab */}
            <g className="ns-arrows" fill="#8fb6e0" stroke="#8fb6e0">
              {ARROW_Y.map((y, i) => {
                const len = 50 + (y - WATER_TABLE) * 0.75;
                const head = 9 + i * 1.5;
                return (
                  <g key={y} className="ns-arrow">
                    <line x1={412 - len} y1={y} x2={398} y2={y} strokeWidth={3 + i} />
                    <path d={`M412 ${y} L396 ${y - head} L396 ${y + head} Z`} stroke="none" />
                  </g>
                );
              })}
              {[700, 900, 1100].map((x) => (
                <g key={x} className="ns-arrow ns-arrow--up">
                  <line x1={x} y1={698} x2={x} y2={672} strokeWidth="4" />
                  <path d={`M${x} 660 L${x - 9} 674 L${x + 9} 674 Z`} stroke="none" />
                </g>
              ))}
            </g>

            {/* final: pressure passes the wet wall and stops at the sealing */}
            <g className="ns-blocked">
              {ARROW_Y.map((y) => (
                <g key={y}>
                  <line x1="430" y1={y} x2="522" y2={y} stroke="#8fb6e0" strokeWidth="3" strokeDasharray="8 7" />
                  <path d={`M534 ${y} L522 ${y - 7} L522 ${y + 7} Z`} fill="#8fb6e0" />
                  <line x1="540" y1={y - 16} x2="540" y2={y + 16} stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </g>
              ))}
            </g>

            {/* context labels */}
            <text x="24" y="40" className="ns-t ns-t--mono">Positivseite (Erdreich)</text>
            <text x="1176" y="40" textAnchor="end" className="ns-t ns-t--mono">Negativseite (Raum)</text>
            <g className="ns-bubble">
              <circle cx="40" cy="300" r="16" />
              <text x="40" y="306">1</text>
            </g>
            <g className="ns-bubble">
              <circle cx="480" cy="110" r="16" />
              <text x="480" y="116">2</text>
            </g>
            <g className="ns-l-pressure">
              <text x="24" y="636" className="ns-t">≈ 0,1 bar je Meter</text>
              <text x="24" y="664" className="ns-t">Wassertiefe (≈ 10 kN/m²)</text>
            </g>

            {/* step labels with leaders */}
            <g className="ns-step ns-step--3">
              <line x1="622" y1="112" x2="546" y2="112" className="ns-leader" />
              <g className="ns-bubble">
                <circle cx="640" cy="112" r="16" />
                <text x="640" y="118">3</text>
              </g>
              <text x="666" y="110" className="ns-t">Untergrund vorbereiten,</text>
              <text x="666" y="136" className="ns-t">tragfähig und sauber</text>
            </g>
            <g className="ns-step ns-step--5">
              <line x1="622" y1="242" x2="552" y2="242" className="ns-leader" />
              <g className="ns-bubble">
                <circle cx="640" cy="242" r="16" />
                <text x="640" y="248">5</text>
              </g>
              <text x="666" y="240" className="ns-t">Mineralische Dichtschlämme, 2 Lagen,</text>
              <text x="666" y="266" className="ns-t">verkrallt im Untergrund</text>
            </g>
            <g className="ns-step ns-step--6">
              <line x1="622" y1="372" x2="572" y2="372" className="ns-leader" />
              <g className="ns-bubble">
                <circle cx="640" cy="372" r="16" />
                <text x="640" y="378">6</text>
              </g>
              <text x="666" y="370" className="ns-t">Sanierputz, diffusionsoffen,</text>
              <text x="666" y="396" className="ns-t">nimmt Salze im Porenraum auf</text>
            </g>
            <g className="ns-step ns-step--4">
              <line x1="628" y1="512" x2="572" y2="572" className="ns-leader" />
              <g className="ns-bubble">
                <circle cx="640" cy="500" r="16" />
                <text x="640" y="506">4</text>
              </g>
              <text x="666" y="498" className="ns-t">Hohlkehle: der kritische</text>
              <text x="666" y="524" className="ns-t">Boden-Wand-Anschluss</text>
            </g>
            <g className="ns-dry">
              <path d="M968 552 l10 10 l20 -22" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <text x="1010" y="566" className="ns-t ns-t--mint">Raum trocken</text>
            </g>
          </svg>
          <figcaption className="ns-caption">
            {hy("Schematische Darstellung. Bei kapillar aufsteigender Feuchte wird die Innenabdichtung mit einer Horizontalsperre kombiniert.")}
          </figcaption>
        </figure>

        <div className="ns-side">
          <p className="sc-label">Aufbau von außen nach innen</p>
          <ol className="ns-legend">
            {LEGEND.map((l) => (
              <li key={l.name} style={{ ["--sw" as string]: l.color }}>
                <strong>{l.name}</strong>
                <p>{hy(l.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
