import { WALL_LAYERS } from "@/data/layers";
import ExplodedWall from "./ExplodedWall";

/** Static money shot: the same exploded stack the 3D scene holds at its peak. */
function LayersPoster() {
  const H = 300;
  const base = 540;
  const dx = 110;
  const dy = -70;
  const gap = 46;
  let x = 170;
  const slots = WALL_LAYERS.filter((l) => l.id !== "horizontalsperre").map((l) => {
    const w = Math.max(16, l.t * 150);
    const slot = { ...l, x, w };
    x += w + gap;
    return slot;
  });
  const masonry = slots.find((s) => s.id === "mauerwerk")!;
  const barrier = WALL_LAYERS.find((l) => l.id === "horizontalsperre")!;

  const box = (bx: number, by: number, w: number, h: number, fill: string, key: string, opacity = 1) => (
    <g key={key} opacity={opacity}>
      <path d={`M${bx} ${by - h} L${bx + dx} ${by - h + dy} L${bx + w + dx} ${by - h + dy} L${bx + w} ${by - h} Z`} fill={fill} opacity="0.92" />
      <path d={`M${bx + w} ${by - h} L${bx + w + dx} ${by - h + dy} L${bx + w + dx} ${by + dy} L${bx + w} ${by} Z`} fill={fill} opacity="0.7" />
      <rect x={bx} y={by - h} width={w} height={h} fill={fill} />
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
        Explosionszeichnung einer Kellerwand: Erdreich, Mauerwerk, Horizontalsperre, Innenabdichtung, Sanierputz und
        Calciumsilikat-Platte, von außen nach innen.
      </title>
      <defs>
        <linearGradient id="lp-damp" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#3b6ea8" stopOpacity="0.85" />
          <stop offset="1" stopColor="#3b6ea8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="520" cy="560" rx="420" ry="26" fill="#000" opacity="0.28" />
      {slots.map((s) => box(s.x, base, s.w, H, s.color, s.id))}
      {/* damp below the barrier, bricks courses on the masonry */}
      <rect x={masonry.x} y={base - 60} width={masonry.w} height={60} fill="url(#lp-damp)" />
      <g stroke="#6e4a33" strokeWidth="1.4">
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M${masonry.x} ${base - 25 * (i + 1)} H${masonry.x + masonry.w}`} />
        ))}
      </g>
      <path
        d={`M${masonry.x - 8} ${base - 28} H${masonry.x + masonry.w + dx + 8}`}
        stroke="#62c4ac"
        strokeDasharray="6 6"
        strokeWidth="2"
      />
      {/* the barrier, lifted out of the masonry */}
      {box(masonry.x, base - H - 70, masonry.w, 22, barrier.color, "barrier")}
      <path d={`M${masonry.x + masonry.w / 2} ${base - H - 66} V${base - 34}`} stroke="#62c4ac" strokeOpacity="0.5" strokeDasharray="3 6" />
      {WALL_LAYERS.map((l, i) => {
        const s = slots.find((q) => q.id === l.id);
        const cx = s ? s.x + s.w / 2 + dx / 2 : masonry.x + masonry.w / 2 + dx / 2;
        const cy = s ? base - H + dy / 2 - 36 : base - H - 70 + dy / 2 - 52;
        return (
          <g key={l.id}>
            <circle cx={cx} cy={cy} r="15" fill={l.color} stroke="#0e1310" strokeWidth="3" />
            <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0e1310" fontFamily="ui-monospace, monospace">
              {i + 1}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function LayersAct() {
  return (
    <section
      id="schicht-fuer-schicht"
      className="layers"
      aria-labelledby="layers-title"
      data-sc-act="pin"
      data-sc-span="4.2"
      data-sc-drift="#0b0f0d"
      style={{ ["--sc-span" as string]: 4.2 }}
    >
      <div data-sc-stage className="layers__stage">
        <div className="layers__head">
          <p className="sc-label">Das Verfahren im Querschnitt</p>
          <h2 id="layers-title" className="sc-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
            Ihre Kellerwand, <em className="text-[var(--mint)]">Schicht für Schicht.</em>
          </h2>
          <p className="sc-body mt-4 max-w-md">
            Jede Schicht hat eine Aufgabe. Wir sanieren von innen, also bleibt die äußerste Schicht, wie sie ist.
          </p>
        </div>
        <figure className="layers__figure">
          <LayersPoster />
          <ExplodedWall />
          <figcaption className="visually-hidden">Explosionsansicht einer sanierten Kellerwand</figcaption>
        </figure>
        <ol className="layers__list">
          {WALL_LAYERS.map((l) => (
            <li key={l.id} className="layer-note" data-layer={l.id} style={{ ["--swatch" as string]: l.color }}>
              <h3>{l.name}</h3>
              <p>{l.text}</p>
            </li>
          ))}
        </ol>
        <p className="layers__caption">Schematische Darstellung. Schichtaufbau und Verfahren richten sich nach der Messung vor Ort.</p>
      </div>
    </section>
  );
}
