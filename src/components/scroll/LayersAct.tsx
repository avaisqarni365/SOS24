import { WALL_LAYERS } from "@/data/layers";
import HouseViewer3D from "./HouseViewer3D";
import { SCENES } from "@/data/scenes3d";
import { hy } from "@/lib/hyphenate";

/**
 * Static fallback for the 3D scene (no WebGL, reduced motion, no JS): the same
 * house cut open, its Keller wall taken apart inside the basement.
 */
function LayersPoster() {
  const byId = Object.fromEntries(WALL_LAYERS.map((l) => [l.id, l]));
  const ground = 300; // top of the soil
  const floor = 560; // Keller floor
  const wx = 290; // outer face of the cut Keller wall
  const ww = 40; // wall thickness
  const bar = 522; // barrier, just above the floor
  // the interior layers, fanned out across the Keller floor
  const panels = (["innenabdichtung", "sanierputz", "klimaplatte"] as const).map((id, i) => ({
    ...byId[id],
    x: wx + ww + 28 + i * 62,
    w: 10,
  }));
  const num = (id: string) => WALL_LAYERS.findIndex((l) => l.id === id) + 1;
  const marker = (id: string, cx: number, cy: number) => (
    <g key={`m-${id}`}>
      <circle cx={cx} cy={cy} r="15" fill={byId[id].color} stroke="#0e1310" strokeWidth="3" />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0e1310" fontFamily="ui-monospace, monospace">
        {num(id)}
      </text>
    </g>
  );

  return (
    <svg
      className="layers__poster"
      viewBox="0 0 1000 620"
      width="1000"
      height="620"
      role="img"
      aria-labelledby="layers-poster-title"
    >
      <title id="layers-poster-title">
        Querschnitt durch ein Haus mit Keller: Erdreich, Mauerwerk mit Horizontalsperre, Innenabdichtung, Sanierputz und
        Calciumsilikat-Platte, von außen nach innen.
      </title>
      <defs>
        <linearGradient id="lp-damp" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3b6ea8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#3b6ea8" stopOpacity="0" />
        </linearGradient>
        <pattern id="lp-brick" width="20" height="12" patternUnits="userSpaceOnUse">
          <rect width="20" height="12" fill={byId.mauerwerk.color} />
          <path d="M0 11.5H20M10 0V6M0 6H20M0 6V12M20 6V12" stroke="#6e4a33" strokeWidth="1.2" />
        </pattern>
      </defs>
      {/* soil and groundwater around the Keller */}
      <rect x="30" y={ground} width="940" height={600 - ground} fill={byId.erdreich.color} opacity="0.75" />
      <rect x="30" y="566" width="940" height="34" fill="#3b6ea8" opacity="0.35" />
      <rect x="30" y={ground - 6} width="940" height="8" fill="#3f5b37" />
      {/* Keller: the cut wall on the left, the far wall on the right, floor */}
      <rect x={wx + ww} y={ground + 12} width={880 - wx - ww} height={floor - ground - 12} fill="#141b17" />
      <rect x={wx} y={ground + 12} width={ww} height={floor - ground - 12} fill="url(#lp-brick)" />
      <rect x={wx} y={bar + 10} width={ww} height={floor - bar - 10} fill="url(#lp-damp)" />
      <rect x={wx - 4} y={bar} width={ww + 8} height="10" fill={byId.horizontalsperre.color} />
      <rect x="880" y={ground + 12} width={ww} height={floor - ground - 12} fill="url(#lp-brick)" />
      <rect x={wx} y={floor} width={920 - wx} height="16" fill="#6f7572" />
      {/* the interior layers, fanned out inside the Keller */}
      {panels.map((pn) => (
        <g key={pn.id}>
          <path
            d={`M${pn.x} ${ground + 30} l18 -12 h${pn.w} v${floor - ground - 38} l-18 12 Z`}
            fill={pn.color}
            opacity="0.7"
          />
          <rect x={pn.x} y={ground + 30} width={pn.w} height={floor - ground - 30} fill={pn.color} />
        </g>
      ))}
      <path d={`M${wx + ww + 6} ${floor - 2} H${panels[2].x + 40}`} stroke="#62c4ac" strokeOpacity="0.5" strokeDasharray="3 6" />
      {/* ceiling slab, ground floor, roof and chimney */}
      <rect x="280" y={ground - 4} width="650" height="16" fill="#6f7572" />
      <rect x="784" y="46" width="34" height="70" fill="url(#lp-brick)" />
      <rect x="778" y="40" width="46" height="10" fill="#6f7572" />
      <rect x={wx} y="150" width={920 - wx} height={ground - 150 - 4} fill="#e9e4d8" />
      <path d="M255 152 L605 28 L955 152 Z" fill="#2c3431" />
      {[360, 740].map((x) => (
        <g key={x}>
          <rect x={x - 5} y="187" width="80" height="80" fill="#f3f1ec" />
          <rect x={x} y="192" width="70" height="70" fill="#f1cf7a" />
          <path d={`M${x + 35} 192 V262 M${x} 227 H${x + 70}`} stroke="#f3f1ec" strokeWidth="4" />
        </g>
      ))}
      <rect x="570" y="202" width="62" height={ground - 202 - 4} rx="4" fill="#2c3431" />
      {/* numbered markers, matching the list */}
      {marker("erdreich", 180, 420)}
      {marker("mauerwerk", wx + ww / 2, 380)}
      {marker("horizontalsperre", wx - 34, bar + 5)}
      {panels.map((pn) => marker(pn.id, pn.x + pn.w / 2 + 9, ground + 2))}
    </svg>
  );
}

export default function LayersAct() {
  const scenes = SCENES.map((sc) => ({
    ...sc,
    intro: hy(sc.intro),
    layers: sc.layers.map((l) => ({ ...l, text: hy(l.text) })),
    steps: sc.steps.map((st) => ({ ...st, text: hy(st.text), material: hy(st.material) })),
  }));
  return (
    <section
      id="schicht-fuer-schicht"
      className="sc-section viewer-sec band-stone"
      aria-labelledby="layers-title"
      data-sc-act="flow"
    >
      <div className="sc-wrap">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="sc-label">Das Verfahren in 3D</p>
            <h2 id="layers-title" className="sc-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
              Jeder Ort, <em className="text-[var(--mint)]">Schicht für Schicht.</em>
            </h2>
          </div>
          <p className="sc-body">
            {hy(
              "Keller von innen, Keller von außen, Garage und Wohnraum: Wählen Sie den Ort, drehen Sie das Modell in alle Richtungen und gehen Sie die Sanierung Schritt für Schritt durch, mit Material und Ausführung zu jedem Schritt."
            )}
          </p>
        </div>
        <div className="mt-10">
          <HouseViewer3D scenes={scenes} poster={<LayersPoster />} />
        </div>
        <p className="mt-4 text-xs text-[var(--sc-ink-soft)]">
          {hy("Schematische Darstellung. Welches Verfahren Ihr Objekt braucht, entscheidet die Messung vor Ort.")}
        </p>
      </div>
    </section>
  );
}
