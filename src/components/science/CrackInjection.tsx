import { hy } from "@/lib/hyphenate";
import "./CrackInjection.css";

/**
 * Risse im Keller abdichten: an elevation strip of the room-side wall face
 * with the crack and four packers, and below it a horizontal section through
 * the wall thickness showing boreholes, packers and the resin filling the
 * crack from wall centre to both faces.
 *
 * Shown in its finished state (crack filled, packers removed, boreholes
 * closed, every label visible); nothing is tied to scrolling.
 */

type Pt = readonly [number, number];

const toPath = (pts: readonly Pt[]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

/* ---- elevation strip: the wall face seen from the room ---------------- */
const FACE: Pt[] = [
  [100, 150], [160, 138], [220, 156], [280, 142], [340, 160], [400, 146], [460, 152],
  [520, 138], [580, 158], [640, 144], [700, 156], [760, 140], [820, 154], [880, 146],
  [940, 160], [1000, 144], [1060, 152], [1100, 140],
];
function faceY(x: number): number {
  for (let i = 1; i < FACE.length; i++) {
    const [x0, y0] = FACE[i - 1];
    const [x1, y1] = FACE[i];
    if (x <= x1) return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
  }
  return FACE[FACE.length - 1][1];
}
const PACKERS = [
  { x: 250, side: -1, tag: -1 },
  { x: 480, side: 1, tag: -1 },
  { x: 710, side: -1, tag: -1 },
  { x: 940, side: 1, tag: 1 },
].map((p, i) => {
  const cy = faceY(p.x + 34);
  return { ...p, n: i + 1, y: faceY(p.x) + p.side * 46, hitX: p.x + 34, hitY: cy };
});

/* ---- section: soil | wall | room, crack through the full thickness ---- */
const CRACK: Pt[] = [
  [300, 470], [340, 462], [380, 478], [420, 468], [470, 484], [520, 472], [560, 488],
  [600, 476], [640, 466], [690, 480], [740, 470], [790, 486], [840, 474], [900, 482],
];
const MID = 7; // index of the wall-centre point where the boreholes meet the crack
const RESIN_TO_SOIL = CRACK.slice(0, MID + 1).reverse();
const RESIN_TO_ROOM = CRACK.slice(MID);

/** Boreholes from the room face at about 15 degrees, meeting the crack at wall centre. */
const BORES = [
  { x: 900, y: 395, angle: 164.89, plug: [876.8, 401.3] as Pt },
  { x: 900, y: 557, angle: -164.89, plug: [876.8, 550.7] as Pt },
];

const LEGEND = [
  {
    name: "Rissaufnahme",
    text: "Verlauf, Breite und Zustand werden dokumentiert: wasserführend, feucht oder trocken. Danach richten sich Harz und Packerabstand.",
  },
  {
    name: "Bohrungen schräg zum Riss",
    text: "Die Bohrungen werden im Wechsel links und rechts des Risses schräg gesetzt, sodass sie ihn etwa in Wandmitte treffen.",
  },
  {
    name: "Packer setzen",
    text: "In jede Bohrung kommt ein Packer mit Rückschlagnippel, der mit einer Gummimanschette im Bohrloch abdichtet.",
  },
  {
    name: "Harz einpressen bis zum Austritt am nächsten Packer",
    text: "Das Harz wird am ersten Packer eingepresst, bis es am nächsten austritt. So füllt es den Riss über die ganze Wanddicke und verdrängt das Wasser.",
  },
  {
    name: "Packer entfernen, Bohrlöcher schließen",
    text: "Nach dem Aushärten werden die Packer gezogen und die Bohrlöcher mit Mörtel verschlossen. Der Riss ist dicht, das Wasser bleibt draußen.",
  },
];

function Drop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      d={`M${x} ${y} q${10 * s} ${16 * s} 0 ${25 * s} q${-10 * s} ${-9 * s} 0 ${-25 * s}z`}
      fill="#8fb6e0"
    />
  );
}

export default function CrackInjection() {
  return (
    <div className="crackinj">
      <section
        className="crackinj__act"
        aria-label="Rissverpressung: ein wasserführender Riss wird über die ganze Wanddicke mit Harz gefüllt"
      >
        <div className="crackinj__stage">
          <figure className="ci-figure">
            <p className="sc-label ci-kicker">Ansicht und Schnitt einer Beton-Kellerwand</p>
            <svg
              className="ci-svg"
              viewBox="0 0 1200 700"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-labelledby="ci-title ci-desc"
            >
              <title id="ci-title">Rissverpressung einer Beton-Kellerwand</title>
              <desc id="ci-desc">
                Oben die Wandfläche von innen mit dem Riss und vier Packern, abwechselnd oberhalb und
                unterhalb des Risses. Unten ein Schnitt durch die Wand: Erdreich links, Beton in der
                Mitte, Raum rechts. Zwei schräge Bohrungen treffen den Riss in Wandmitte. Das Harz füllt
                den Riss von der Mitte bis zu beiden Wandflächen, die Bohrlöcher sind verschlossen, das
                Wasser bleibt im Erdreich.
              </desc>
              <defs>
                <linearGradient id="ci-soil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#7a6146" />
                  <stop offset="1" stopColor="#3a2f22" />
                </linearGradient>
                <pattern id="ci-aggr" width="46" height="38" patternUnits="userSpaceOnUse">
                  <rect width="46" height="38" fill="#8a8f8b" />
                  <circle cx="8" cy="9" r="3" fill="#7a7f7b" />
                  <circle cx="30" cy="20" r="4" fill="#9a9f9b" />
                  <circle cx="17" cy="31" r="2.5" fill="#767b77" />
                  <circle cx="40" cy="5" r="2" fill="#777c78" />
                </pattern>
              </defs>

              <rect width="1200" height="700" fill="#0e1310" />

              {/* ================= elevation strip ================= */}
              <text x="60" y="34" className="ci-t ci-t--mono">Ansicht Wandfläche (Raumseite)</text>
              <rect x="60" y="50" width="1080" height="180" rx="6" fill="url(#ci-aggr)" />
              <path className="ci-e-wet" d={toPath(FACE)} stroke="#3b6ea8" strokeWidth="22" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d={toPath(FACE)} stroke="#2f3431" strokeWidth="5" fill="none" strokeLinejoin="round" />
              <path
                className="ci-e-resin"
                pathLength={1}
                d={toPath(FACE)}
                stroke="#e8b04c"
                strokeWidth="5"
                fill="none"
                strokeLinejoin="round"
              />
              {PACKERS.map((p) => (
                <g key={p.n}>
                  <line
                    className="ci-e-bore"
                    x1={p.x}
                    y1={p.y}
                    x2={p.hitX}
                    y2={p.hitY}
                    stroke="#2f3431"
                    strokeWidth="3"
                    strokeDasharray="6 5"
                  />
                  <circle className="ci-e-hole" cx={p.x} cy={p.y} r="9" fill="#2c3330" />
                  <circle className={`ci-e-emerge ci-e-emerge--${p.n}`} cx={p.x} cy={p.y} r="24" fill="#e8b04c" />
                  <g className="ci-e-head">
                    <circle cx={p.x} cy={p.y} r="15" fill="#c7ccc9" stroke="#4d5450" strokeWidth="2" />
                    <circle cx={p.x} cy={p.y} r="6" fill="#c9a24a" />
                  </g>
                  <circle className="ci-e-ghost" cx={p.x} cy={p.y} r="17" fill="none" stroke="#2f3431" strokeWidth="2" strokeDasharray="4 4" />
                  <circle className="ci-plug" cx={p.x} cy={p.y} r="9" fill="#5f6663" />
                  <text x={p.x + p.tag * 30} y={p.y + 7} textAnchor={p.tag < 0 ? "end" : "start"} className="ci-t ci-t--dark ci-t--tag">
                    P{p.n}
                  </text>
                </g>
              ))}
              <text x="512" y="205" className="ci-t ci-t--dark ci-t--small ci-l-emerge">Harz tritt am nächsten Packer aus</text>

              {/* ================= section ================= */}
              <text x="60" y="284" className="ci-t ci-t--mono">Schnitt durch die Wand</text>
              <text x="150" y="318" textAnchor="middle" className="ci-t">Erdseite</text>
              <text x="600" y="318" textAnchor="middle" className="ci-t">Beton-Kellerwand</text>
              <text x="1050" y="318" textAnchor="middle" className="ci-t">Raumseite</text>

              <rect x="0" y="330" width="300" height="290" fill="url(#ci-soil)" />
              <rect x="0" y="330" width="300" height="290" fill="#3b6ea8" opacity="0.2" />
              <rect x="300" y="330" width="600" height="290" fill="url(#ci-aggr)" />
              <rect x="900" y="330" width="300" height="290" fill="#1b241f" />
              <line x1="600" y1="336" x2="600" y2="614" stroke="#3a403d" strokeWidth="2" strokeDasharray="7 7" />
              <text x="610" y="354" className="ci-t ci-t--dark ci-t--small">Wandmitte</text>

              {/* soil water pressing at the crack mouth */}
              <g>
                <Drop x={262} y={440} />
                <Drop x={282} y={468} s={0.8} />
                <Drop x={244} y={486} s={0.9} />
                <Drop x={210} y={452} s={0.7} />
                <Drop x={120} y={400} s={0.7} />
                <Drop x={70} y={500} s={0.8} />
                <Drop x={170} y={590} s={0.7} />
              </g>

              {/* the crack, the water in it, the resin that replaces it */}
              <path d={toPath(CRACK)} stroke="#2f3431" strokeWidth="11" fill="none" strokeLinejoin="round" />
              <path className="ci-water" pathLength={1} d={toPath(CRACK)} stroke="#5a8fc4" strokeWidth="6" fill="none" strokeLinejoin="round" />
              <path className="ci-trickle" d="M904 486 C908 520 900 560 905 612" stroke="#5a8fc4" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path className="ci-resin" pathLength={1} d={toPath(RESIN_TO_SOIL)} stroke="#e8b04c" strokeWidth="7" fill="none" strokeLinejoin="round" />
              <path className="ci-resin" pathLength={1} d={toPath(RESIN_TO_ROOM)} stroke="#e8b04c" strokeWidth="7" fill="none" strokeLinejoin="round" />

              {/* boreholes, resin in them, packers, plugs */}
              {BORES.map((b, i) => {
                const d = `M${b.x} ${b.y} L600 476`;
                return (
                  <g key={i}>
                    <path className="ci-bore" pathLength={1} d={d} stroke="#2c3330" strokeWidth="16" fill="none" />
                    <path className="ci-bore-resin" pathLength={1} d={d} stroke="#e8b04c" strokeWidth="7" fill="none" />
                    <path className="ci-plug" d={`M${b.x} ${b.y} L${b.plug[0]} ${b.plug[1]}`} stroke="#6f7572" strokeWidth="18" fill="none" />
                    <g transform={`translate(${b.x} ${b.y}) rotate(${b.angle})`}>
                      <g className="ci-packer">
                        <rect x="-6" y="-7" width="110" height="14" fill="#c7ccc9" />
                        <rect x="70" y="-9.5" width="34" height="19" rx="3" fill="#3d4541" />
                        <rect x="-34" y="-13" width="28" height="26" rx="3" fill="#aab1ad" stroke="#5b625e" strokeWidth="2" />
                        <rect x="-52" y="-6" width="18" height="12" fill="#c9a24a" />
                        <circle cx="-54" cy="0" r="7" fill="#c9a24a" />
                      </g>
                      <g className="ci-ghost" fill="none" stroke="#aeb6b0" strokeWidth="2" strokeDasharray="5 5">
                        <rect x="-6" y="-7" width="110" height="14" />
                        <rect x="-34" y="-13" width="28" height="26" rx="3" />
                        <circle cx="-54" cy="0" r="7" />
                      </g>
                    </g>
                  </g>
                );
              })}

              {/* section labels */}
              <text x="318" y="440" className="ci-t ci-t--dark">wasserführender Riss</text>
              <text x="318" y="545" className="ci-t ci-t--dark ci-l-resin">Harz füllt den Riss auf voller Tiefe</text>
              <text x="610" y="604" className="ci-t ci-t--dark ci-t--small ci-l-bore">Bohrung trifft Riss mittig</text>
              <g className="ci-l-packer">
                <text x="1186" y="368" textAnchor="end" className="ci-t">Packer mit Nippel</text>
                <text x="1186" y="394" textAnchor="end" className="ci-t ci-t--soft">(danach entfernt)</text>
              </g>
              <g className="ci-stop">
                <line x1="300" y1="448" x2="300" y2="494" stroke="#62c4ac" strokeWidth="6" strokeLinecap="round" />
                <text x="150" y="560" textAnchor="middle" className="ci-t ci-t--mint">Wasser bleibt</text>
                <text x="150" y="586" textAnchor="middle" className="ci-t ci-t--mint">draußen</text>
              </g>

              {/* wall thickness */}
              <g stroke="#aeb6b0" strokeWidth="2">
                <line x1="300" y1="648" x2="900" y2="648" />
                <line x1="300" y1="638" x2="300" y2="658" />
                <line x1="900" y1="638" x2="900" y2="658" />
              </g>
              <text x="600" y="684" textAnchor="middle" className="ci-t ci-t--soft">Wanddicke: der Riss wird auf ganzer Tiefe gefüllt</text>
            </svg>
            <figcaption className="ci-caption">
              {hy("Schematische Darstellung. Harz und Verfahren richten sich nach der Rissaufnahme vor Ort.")}
            </figcaption>
          </figure>

          <div className="ci-side">
            <p className="sc-label">Ablauf der Rissverpressung</p>
            <ol className="ci-legend">
              {LEGEND.map((l) => (
                <li key={l.name}>
                  <strong>{l.name}</strong>
                  <p>{hy(l.text)}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="ci-compare-wrap">
        <div className="ci-compare" role="group" aria-label="Harze im Vergleich">
          <div className="ci-compare__col" style={{ ["--sw" as string]: "#e8b04c" }}>
            <h3>PU-Harz</h3>
            <p>{hy("Elastisch, für bewegte und wasserführende Risse. Die schäumende Variante stoppt einströmendes Wasser zuerst, danach wird dauerhaft verpresst.")}</p>
          </div>
          <div className="ci-compare__col" style={{ ["--sw" as string]: "#9fd8c4" }}>
            <h3>Epoxidharz</h3>
            <p>{hy("Kraftschlüssig, für ruhende Risse. Es verklebt die Rissflanken fest miteinander und stellt die Tragfähigkeit wieder her.")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
