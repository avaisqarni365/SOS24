import type { ReactNode } from "react";
import ScenarioAnim from "@/components/science/ScenarioAnim";

/**
 * One short scenario per service, drawn in SVG and animated in CSS (see
 * "SCENARIOS" in globals.css). Classes carry the timing: p1 = the problem
 * (gone in the third phase), s2 = the treatment, s3 = the result; g2x/g2y
 * grow in the second phase, dash2/dash3 draw a line, pop2 pops in, drip
 * falls. The static state of every element is the finished result.
 */
export function ScenarioDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <pattern id="an-brick" width="40" height="20" patternUnits="userSpaceOnUse">
          <rect width="40" height="20" fill="#c66a52" />
          <path d="M0 0H40M0 10H40M20 0V10M0 10V20M40 10V20" stroke="#efdcd2" strokeWidth="2" />
        </pattern>
        <pattern id="an-concrete" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#d6dde4" />
          <circle cx="5" cy="7" r="1.2" fill="#bcc6d0" />
          <circle cx="17" cy="15" r="1" fill="#c3ccd5" />
          <circle cx="11" cy="20" r="0.8" fill="#b6c0ca" />
        </pattern>
        <linearGradient id="an-water" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#1784c7" stopOpacity="0.7" />
          <stop offset="1" stopColor="#1784c7" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="an-cold">
          <stop offset="0" stopColor="#2b5fd9" stopOpacity="0.55" />
          <stop offset="1" stopColor="#2b5fd9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="an-warm">
          <stop offset="0" stopColor="#f59e0b" stopOpacity="0.45" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="an-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f9fd" />
          <stop offset="1" stopColor="#e3f1fa" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const Check = ({ x, y, label = "dicht" }: { x: number; y: number; label?: string }) => (
  <g className="s3">
    <rect x={x - 4} y={y - 18} width={label.length * 9 + 46} height="36" rx="18" fill="#ffffff" stroke="#16a06a" strokeWidth="2" />
    <circle cx={x + 14} cy={y} r="11" fill="#16a06a" />
    <path d={`M${x + 8} ${y}l4 4 8-8`} fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <text x={x + 32} y={y + 5} fontSize="14" fontWeight="800" fill="#0b5e40">
      {label}
    </text>
  </g>
);

const Drops = ({ pts, cls = "drip" }: { pts: [number, number][]; cls?: string }) => (
  <>
    {pts.map(([x, y], i) => (
      <path
        key={`${x}-${y}`}
        className={cls}
        style={{ animationDelay: `${(i * 0.23).toFixed(2)}s` }}
        d={`M${x} ${y}c-3 5-5 8-5 11a5 5 0 0 0 10 0c0-3-2-6-5-11Z`}
        fill="#1784c7"
      />
    ))}
  </>
);

const Bg = () => <rect width="480" height="280" fill="url(#an-sky)" />;

const SCENES: Record<string, { steps: [string, string, string]; art: ReactNode }> = {
  horizontalsperre: {
    steps: ["Feuchte steigt im Mauerwerk auf", "Bohrlöcher, Injektion mit Creme", "Sperre steht, die Wand trocknet"],
    art: (
      <>
        <Bg />
        <rect y="236" width="480" height="44" fill="#d8c3a2" />
        <rect x="150" y="34" width="180" height="202" rx="4" fill="url(#an-brick)" />
        <rect className="g1y" x="150" y="84" width="180" height="114" fill="url(#an-water)" />
        <rect x="150" y="204" width="180" height="32" fill="url(#an-water)" />
        <g className="p1">
          {[190, 240, 290].map((x, i) => (
            <path key={x} className="rise" style={{ animationDelay: `${i * 0.3}s` }} d={`M${x} 170v-34m-7 9 7-9 7 9`} fill="none" stroke="#0b63a8" strokeWidth="3" strokeLinecap="round" />
          ))}
        </g>
        {[168, 202, 236, 270, 304].map((x, i) => (
          <circle key={x} className="pop2" style={{ animationDelay: `${(i * 0.18).toFixed(2)}s` }} cx={x + 6} cy="201" r="5" fill="#173455" />
        ))}
        <rect className="g2x" x="150" y="198" width="180" height="7" rx="2" fill="#0b63a8" />
        <g className="s2">
          <rect x="342" y="188" width="104" height="26" rx="13" fill="#0b63a8" />
          <text x="394" y="206" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">Sperrschicht</text>
        </g>
        <Check x={344} y={70} label="trocken" />
      </>
    ),
  },
  kellerinnenabdichtung: {
    steps: ["Wasser drückt von außen", "Dichtschlämme in zwei Lagen", "Sanierputz, der Raum bleibt trocken"],
    art: (
      <>
        <Bg />
        <rect width="170" height="280" fill="#cdb08b" />
        {[[30, 60], [90, 120], [50, 190], [120, 230], [20, 250]].map(([x, y]) => (
          <ellipse key={`${x}${y}`} cx={x} cy={y} rx="9" ry="6" fill="#b39672" />
        ))}
        <rect x="170" y="20" width="80" height="230" fill="url(#an-brick)" />
        <rect className="p1" x="170" y="20" width="80" height="230" fill="url(#an-water)" />
        <g className="p1">
          {[70, 140, 210].map((y, i) => (
            <path key={y} className="push" style={{ animationDelay: `${i * 0.25}s` }} d={`M110 ${y}h40m-9-8 9 8-9 8`} fill="none" stroke="#0b63a8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>
        <rect className="g2y top" x="250" y="20" width="11" height="230" fill="#8f9aa6" />
        <rect className="g2y top late" x="261" y="20" width="9" height="230" fill="#6f7b88" />
        <path className="s2" d="M270 250v-30q0 30 30 30Z" fill="#6f7b88" />
        <rect className="s3" x="270" y="20" width="12" height="200" fill="#efe6d6" />
        <rect y="250" width="480" height="30" fill="#c9d2db" />
        <Check x={318} y={70} label="trocken" />
      </>
    ),
  },
  rissverpressung: {
    steps: ["Der Riss führt Wasser", "Packer entlang des Risses setzen", "Harz verpresst, der Riss ist dicht"],
    art: (
      <>
        <Bg />
        <rect x="60" y="24" width="360" height="232" rx="6" fill="url(#an-concrete)" />
        <path d="M240 24 230 66l20 40-14 40 20 40-12 46" fill="none" stroke="#3b4652" strokeWidth="5" strokeLinejoin="round" />
        <g className="p1">
          <Drops pts={[[232, 70], [249, 110], [238, 150], [255, 190]]} />
        </g>
        {[[262, 62], [270, 104], [258, 146], [276, 188]].map(([x, y], i) => (
          <g key={`${x}${y}`} className="pop2" style={{ animationDelay: `${(i * 0.2).toFixed(2)}s` }}>
            <rect x={x} y={y - 4} width="18" height="8" rx="2" fill="#d33f2f" />
            <circle cx={x + 20} cy={y} r="5" fill="#a52a1e" />
          </g>
        ))}
        <path className="dash3" pathLength={1} d="M240 24 230 66l20 40-14 40 20 40-12 46" fill="none" stroke="#0b63a8" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
        <Check x={318} y={230} />
      </>
    ),
  },
  schimmelbeseitigung: {
    steps: ["Kalte Ecke, Kondensat, Schimmel", "Messen und Klimaplatte setzen", "Warme Oberfläche, kein Schimmel"],
    art: (
      <>
        <Bg />
        <path d="M60 30 240 70v186L60 236Z" fill="#eef2f6" />
        <path d="M240 70 420 30v206l-180 20Z" fill="#e2e8ee" />
        <path d="M60 236l180 20 180-20v44H60Z" fill="#d6dee6" />
        <ellipse className="p1" cx="240" cy="96" rx="110" ry="80" fill="url(#an-cold)" />
        <g className="p1">
          {[[220, 80], [232, 96], [250, 84], [258, 104], [226, 112], [244, 120], [212, 98], [268, 92]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r="5" fill="#4b5a3a" opacity="0.85" />
          ))}
          <Drops pts={[[200, 140], [280, 150]]} />
        </g>
        <g className="s2">
          <path d="M150 52 238 72v120l-88-14Z" fill="#eadfca" stroke="#d3c4a8" strokeWidth="2" />
          <path d="M242 72 330 52v126l-88 14Z" fill="#e3d6bd" stroke="#d3c4a8" strokeWidth="2" />
          <rect x="330" y="200" width="96" height="30" rx="15" fill="#173455" />
          <text x="378" y="220" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">12,6 °C</text>
        </g>
        <ellipse className="s3" cx="240" cy="110" rx="120" ry="90" fill="url(#an-warm)" />
        <Check x={70} y={60} label="schimmelfrei" />
      </>
    ),
  },
  feuchtemessung: {
    steps: ["Messen in fünf Höhen", "Das Feuchteprofil entsteht", "Die Ursache ist benannt"],
    art: (
      <>
        <Bg />
        <rect x="70" y="30" width="170" height="206" rx="4" fill="url(#an-brick)" />
        <rect x="70" y="150" width="170" height="86" fill="url(#an-water)" />
        {[214, 184, 150, 104, 52].map((y, i) => (
          <circle key={y} className="pop2" style={{ animationDelay: `${(i * 0.15).toFixed(2)}s` }} cx="155" cy={y} r="6" fill="#ffffff" stroke="#0b63a8" strokeWidth="3" />
        ))}
        <g className="probe">
          <rect x="176" y="-14" width="34" height="28" rx="6" fill="#173455" />
          <rect x="181" y="-9" width="24" height="12" rx="2" fill="#dff1fb" />
          <path d="M176 0h-14" stroke="#9daebf" strokeWidth="3" strokeLinecap="round" />
        </g>
        <path d="M290 236h150M290 236V40" stroke="#9daebf" strokeWidth="2" />
        {[
          [300, 120],
          [328, 96],
          [356, 66],
          [384, 34],
          [412, 16],
        ].map(([x, h], i) => (
          <rect key={x} className="g2y" style={{ animationDelay: `${(i * 0.18).toFixed(2)}s` }} x={x} y={236 - h} width="20" height={h} rx="3" fill={i < 2 ? "#0b63a8" : "#1fa9d6"} />
        ))}
        <g className="s3">
          <rect x="300" y="44" width="122" height="28" rx="14" fill="#173455" />
          <text x="361" y="63" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">kapillar</text>
        </g>
      </>
    ),
  },
  kellersanierung: {
    steps: ["Nasser Keller, feuchte Wände", "Von innen abgedichtet", "Trocken und wieder nutzbar"],
    art: (
      <>
        <Bg />
        <path d="M120 112h240L240 40Z" fill="#173455" />
        <rect x="140" y="104" width="200" height="16" fill="#eef1f4" />
        <rect y="120" width="480" height="160" fill="#cdb08b" />
        <rect x="140" y="120" width="200" height="132" fill="#9aa6b2" />
        <rect x="156" y="132" width="168" height="112" fill="#f4f7fa" />
        <g className="p1">
          <ellipse cx="240" cy="240" rx="70" ry="6" fill="#1784c7" opacity="0.6" />
          <rect x="156" y="190" width="20" height="54" fill="url(#an-water)" />
          <rect x="304" y="176" width="20" height="68" fill="url(#an-water)" />
        </g>
        <path className="dash2" pathLength={1} d="M158 134h164v108H158Z" fill="none" stroke="#0b63a8" strokeWidth="5" strokeLinejoin="round" />
        <g className="s3">
          <circle cx="240" cy="150" r="22" fill="url(#an-warm)" />
          <circle cx="240" cy="146" r="6" fill="#f5c542" />
          <path d="M240 132v8" stroke="#9daebf" strokeWidth="2" />
        </g>
        <Check x={350} y={60} label="trocken" />
      </>
    ),
  },
  dachabdichtung: {
    steps: ["Das alte Dach lässt Wasser durch", "Die Bahn wird verschweißt", "Naht für Naht dicht"],
    art: (
      <>
        <Bg />
        <rect x="100" y="150" width="280" height="110" fill="#eef1f4" />
        <rect x="80" y="134" width="320" height="18" fill="#9aa6b2" />
        <path className="p1" d="M80 132h150l8 6 8-6h154" fill="none" stroke="#3b4652" strokeWidth="4" />
        <g className="rain">
          <Drops pts={[[130, 40], [180, 60], [230, 30], [280, 55], [330, 35], [370, 62]]} cls="fall" />
        </g>
        <g className="p1">
          <Drops pts={[[238, 160], [238, 190]]} />
        </g>
        <rect className="g2x" x="80" y="124" width="320" height="10" rx="2" fill="#2b3644" />
        <g className="roll">
          <circle cx="80" cy="117" r="14" fill="#2b3644" stroke="#1b232c" strokeWidth="3" />
          <path className="flame" d="M58 128c-8-6-6-16 2-22 0 6 6 7 6 13 3-3 3-7 2-10 7 5 8 15-1 20Z" fill="#f59e0b" />
        </g>
        <path className="dash3" pathLength={1} d="M80 124h320" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
        <Check x={300} y={70} />
      </>
    ),
  },
  "balkon-terrasse": {
    steps: ["Wasser dringt in die Platte ein", "Flüssigkunststoff mit Vlies", "Fugenlos dicht, auch am Anschluss"],
    art: (
      <>
        <Bg />
        <rect x="30" y="20" width="90" height="260" fill="#eef1f4" />
        <rect x="120" y="176" width="300" height="22" fill="#b8c1ca" />
        <path d="M400 176V96M330 176V96M260 176V96M190 176V96M180 96h230" stroke="#9daebf" strokeWidth="4" strokeLinecap="round" />
        <g className="p1">
          <path d="M130 170h60m10 0h60m10 0h60m10 0h60" stroke="#dfe5ea" strokeWidth="8" />
          <ellipse cx="270" cy="172" rx="60" ry="4" fill="#1784c7" opacity="0.6" />
          <Drops pts={[[280, 204], [320, 214]]} />
        </g>
        <rect className="g2y" x="112" y="134" width="8" height="42" fill="#5b6b7d" />
        <rect className="g2x" x="120" y="168" width="300" height="9" rx="2" fill="#5b6b7d" />
        <path className="s2" d="M130 172h280" stroke="#8a99a8" strokeWidth="2" strokeDasharray="6 5" />
        <g className="s3">
          <Drops pts={[[424, 186], [428, 214]]} cls="fall" />
        </g>
        <Check x={150} y={60} />
      </>
    ),
  },
  sockelabdichtung: {
    steps: ["Spritzwasser durchfeuchtet den Sockel", "Bitumen-Dickbeschichtung, zwei Lagen", "Der Sockel ist geschützt"],
    art: (
      <>
        <Bg />
        <rect x="60" y="20" width="360" height="212" fill="#eef1f4" />
        <rect x="60" y="176" width="360" height="56" fill="#d5dbe1" />
        <rect className="p1" x="60" y="166" width="360" height="66" fill="url(#an-water)" />
        <rect y="232" width="480" height="48" fill="#8cc084" />
        <g className="p1">
          <Drops pts={[[120, 210], [190, 214], [260, 208], [330, 214], [390, 210]]} cls="splash" />
        </g>
        <rect className="g2y" x="60" y="180" width="360" height="52" fill="#2b3644" />
        <rect className="g2y late" x="60" y="186" width="360" height="46" fill="#1f2933" />
        <g className="s3">
          <Drops pts={[[150, 214], [300, 210]]} cls="splash" />
        </g>
        <Check x={150} y={70} label="geschützt" />
      </>
    ),
  },
};

/** The steps of a service's scenario: problem, treatment, result. */
export const scenarioSteps = (slug: string) => SCENES[slug]?.steps;

/**
 * One frame of a scenario, standing still: "before" is the problem, "after"
 * the finished result (styles in globals.css, "SCENES STANDING STILL").
 * Needs <ScenarioDefs/> on the page.
 */
export function ScenarioArt({ slug, state }: { slug: string; state: "before" | "after" }) {
  const s = SCENES[slug];
  if (!s) return null;
  return (
    <svg viewBox="0 0 480 280" className={`scn scn--${state}`} role="img" aria-label={state === "before" ? `Vorher: ${s.steps[0]}` : `Nachher: ${s.steps[2]}`} data-i18n="">
      {s.art}
    </svg>
  );
}

/** The scenario for a service, or nothing if there is none. */
export default function Scenario({ slug }: { slug: string }) {
  const s = SCENES[slug];
  if (!s) return null;
  return (
    <ScenarioAnim kind={slug} steps={s.steps}>
      <svg viewBox="0 0 480 280" role="img" aria-label={`Szenario: ${s.steps.join(", ")}`} data-i18n="">
        {s.art}
      </svg>
    </ScenarioAnim>
  );
}
