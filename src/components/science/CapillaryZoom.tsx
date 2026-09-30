import { PHOTOS } from "@/data/photos";
import "./CapillaryZoom.css";

/**
 * Horizontalsperre, layer by layer: four zoom levels from the wall to one pore
 * wall. Scroll drives the zoom (--sc-p); without JS or with reduced motion the
 * four levels are a plain figure series.
 *
 * Physics (Jurin): h = 2σ·cosθ / (ρ·g·r). Water at 20 °C: σ = 0,0728 N/m,
 * ρ·g ≈ 9810 N/m³, so with a fully wetting pore (cosθ ≈ 1): h ≈ 1,48·10⁻⁵ m² / r.
 * r = 10 µm → 1,5 m, 1 µm → 15 m, 0,1 µm → 148 m (theoretical, no evaporation).
 * A hydrophobic film makes θ > 90°, cosθ < 0: the pore pushes water down.
 */

const TUBES = [
  { r: "10 µm", h: "≈ 1,5 m", x: 250, w: 60, level: 0.3 },
  { r: "1 µm", h: "≈ 15 m", x: 520, w: 28, level: 0.62 },
  { r: "0,1 µm", h: "≈ 150 m", x: 760, w: 12, level: 0.9 },
];

function LevelWall() {
  const p = PHOTOS.risingDamp;
  return (
    <div className="cz-art">
      <img
        src={p.src}
        srcSet={`${p.src} 480w, ${p.src2x} 960w`}
        sizes="(max-width: 860px) 92vw, 60vw"
        width={p.w}
        height={p.h}
        alt={p.alt}
        loading="lazy"
        decoding="async"
      />
      <svg viewBox="0 0 480 320" aria-hidden="true" className="cz-overlay">
        <rect x="150" y="186" width="92" height="62" fill="none" stroke="#62c4ac" strokeWidth="3" rx="4" />
        <path d="M242 186 L300 120" stroke="#62c4ac" strokeWidth="2" strokeDasharray="5 5" />
        <text x="306" y="116" fill="#f3f1ec" fontSize="16" fontFamily="ui-monospace, monospace">
          Sockel, 0 bis 1 m
        </text>
      </svg>
    </div>
  );
}

function LevelMasonry() {
  return (
    <div className="cz-art">
      <svg viewBox="0 0 1000 620" role="img" aria-label="Mauerwerk im Schnitt mit aufsteigender Feuchte aus dem Erdreich">
        <defs>
          <linearGradient id="cz-damp" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#3b6ea8" stopOpacity="0.85" />
            <stop offset="0.7" stopColor="#3b6ea8" stopOpacity="0.35" />
            <stop offset="1" stopColor="#3b6ea8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="1000" height="620" fill="#1b241f" />
        <rect y="520" width="1000" height="100" fill="#3a2f22" />
        <rect y="580" width="1000" height="40" fill="#3b6ea8" opacity="0.5" />
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 6 }).map((__, col) => {
            const off = row % 2 ? 80 : 0;
            return (
              <rect
                key={`${row}-${col}`}
                x={40 + col * 160 - off}
                y={460 - row * 62}
                width="150"
                height="54"
                fill="#9a6b4b"
                stroke="#6e4a33"
                strokeWidth="8"
              />
            );
          })
        )}
        <rect className="cz-rise" x="0" y="150" width="1000" height="370" fill="url(#cz-damp)" />
        <g fill="#e8e1cf" className="cz-salt">
          {Array.from({ length: 26 }).map((_, i) => (
            <circle key={i} cx={20 + i * 38} cy={200 + ((i * 37) % 30)} r={3 + (i % 3)} />
          ))}
        </g>
        {[180, 420, 700, 880].map((x) => (
          <path key={x} d={`M${x} 590 V240`} stroke="#8fb9e8" strokeWidth="4" strokeDasharray="10 14" className="cz-flow" />
        ))}
        <circle cx="560" cy="400" r="70" fill="none" stroke="#62c4ac" strokeWidth="4" />
        <text x="650" y="330" fill="#f3f1ec" fontSize="26" fontFamily="ui-monospace, monospace">
          Stein und Fuge
        </text>
      </svg>
    </div>
  );
}

function LevelPores() {
  return (
    <div className="cz-art">
      <svg viewBox="0 0 1000 620" role="img" aria-label="Drei Kapillaren unterschiedlicher Weite: je feiner, desto höher steigt Wasser">
        <rect width="1000" height="620" fill="#141b17" />
        <rect y="540" width="1000" height="80" fill="#3b6ea8" opacity="0.7" />
        {TUBES.map((t) => {
          const top = 60;
          const bottom = 560;
          const waterTop = bottom - (bottom - top) * t.level;
          return (
            <g key={t.r}>
              <rect x={t.x - t.w / 2 - 10} y={top} width={t.w + 20} height={bottom - top} fill="#9a6b4b" opacity="0.35" rx="4" />
              <rect x={t.x - t.w / 2} y={top} width={t.w} height={bottom - top} fill="#0e1310" />
              <rect className="cz-column" x={t.x - t.w / 2} y={waterTop} width={t.w} height={bottom - waterTop} fill="#5a8fc4" />
              <text x={t.x} y={40} textAnchor="middle" fill="#f3f1ec" fontSize="24" fontFamily="ui-monospace, monospace">
                r = {t.r}
              </text>
              <text x={t.x + t.w / 2 + 18} y={waterTop + 8} fill="#aeb6b0" fontSize="20" fontFamily="ui-monospace, monospace">
                {t.h}
              </text>
            </g>
          );
        })}
        <text x="500" y="604" textAnchor="middle" fill="#f3f1ec" fontSize="20" fontFamily="ui-monospace, monospace">
          Bodenfeuchte
        </text>
      </svg>
      <p className="cz-formula" aria-label="Steighöhe h gleich zwei Sigma mal Kosinus Theta durch Rho mal g mal r">
        h = 2σ · cos θ / (ρ · g · r)
      </p>
    </div>
  );
}

function LevelPoreWall() {
  return (
    <div className="cz-art">
      <svg viewBox="0 0 1000 620" role="img" aria-label="Eine Pore im Detail: vor der Injektion steigt Wasser mit hohlem Meniskus, danach wird es mit gewölbtem Meniskus nach unten gedrückt, Wasserdampf entweicht">
        <rect width="1000" height="620" fill="#141b17" />
        {/* pore walls (mineral) */}
        <rect x="260" y="40" width="160" height="560" fill="#9a6b4b" />
        <rect x="580" y="40" width="160" height="560" fill="#9a6b4b" />
        {/* hydrophobic polymer film, a few molecules thick */}
        <rect className="cz-film" x="414" y="40" width="8" height="560" fill="#62c4ac" />
        <rect className="cz-film" x="578" y="40" width="8" height="560" fill="#62c4ac" />
        {/* water column: wetting (before) */}
        <g className="cz-before">
          <path d="M420 600 V220 Q500 290 580 220 V600 Z" fill="#5a8fc4" />
          <text x="500" y="190" textAnchor="middle" fill="#f3f1ec" fontSize="22" fontFamily="ui-monospace, monospace">
            θ &lt; 90°: Wasser steigt
          </text>
        </g>
        {/* water column: non-wetting (after) */}
        <g className="cz-after">
          <path d="M422 600 V470 Q500 400 578 470 V600 Z" fill="#5a8fc4" />
          <text x="500" y="380" textAnchor="middle" fill="#f3f1ec" fontSize="22" fontFamily="ui-monospace, monospace">
            θ &gt; 90°: Wasser wird zurückgedrückt
          </text>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} className="cz-vapour" cx={470 + (i % 3) * 30} cy={330 - i * 55} r="7" fill="#e8e1cf" opacity="0.8" />
          ))}
          <text x="500" y="80" textAnchor="middle" fill="#e8e1cf" fontSize="20" fontFamily="ui-monospace, monospace">
            Wasserdampf entweicht
          </text>
        </g>
        <text x="760" y="140" fill="#62c4ac" fontSize="20" fontFamily="ui-monospace, monospace">
          Polymerfilm,
        </text>
        <text x="760" y="166" fill="#62c4ac" fontSize="20" fontFamily="ui-monospace, monospace">
          wenige Moleküle
        </text>
        <text x="760" y="192" fill="#62c4ac" fontSize="20" fontFamily="ui-monospace, monospace">
          dick
        </text>
        <path d="M755 160 L592 220" stroke="#62c4ac" strokeWidth="2" />
      </svg>
    </div>
  );
}

const LEVELS = [
  {
    n: 1,
    title: "Die Wand",
    text: "Feuchterand und Salzspuren im Sockel: das typische Bild, wenn die Horizontalsperre fehlt oder defekt ist.",
    Art: LevelWall,
  },
  {
    n: 2,
    title: "Das Mauerwerk",
    text: "Bodenfeuchte steigt über Stein und Fuge auf. Wo das Wasser an der Oberfläche verdunstet, bleiben Salze zurück.",
    Art: LevelMasonry,
  },
  {
    n: 3,
    title: "Die Poren",
    text: "Kapillarkraft: Je feiner die Pore, desto höher zieht sie Wasser. Die Werte gelten rechnerisch ohne Verdunstung, im echten Mauerwerk bremsen Verdunstung und Porenstruktur.",
    Art: LevelPores,
  },
  {
    n: 4,
    title: "Die Porenwand nach der Injektion",
    text: "Der in Paraffin gelöste Kunststoff legt sich als hauchdünner Polymerfilm an die Porenwand. Der Randwinkel kippt über 90°, die Pore drückt Wasser nach unten. Sie bleibt offen, Wasserdampf kann weiter entweichen.",
    Art: LevelPoreWall,
  },
];

export default function CapillaryZoom() {
  return (
    <section
      className="cz"
      aria-label="Kapillar-Zoom: von der Wand bis zur Porenwand"
      data-sc-act="pin"
      data-sc-span="3.6"
      style={{ ["--sc-span" as string]: 3.6 }}
    >
      <div data-sc-stage className="cz__stage">
        <ol className="cz__levels">
          {LEVELS.map(({ n, title, text, Art }) => (
            <li key={n} className={`cz-level cz-level--${n}`}>
              <figure className="cz-figure">
                <Art />
                <figcaption className="cz-caption">
                  <span className="cz-num" aria-hidden="true">
                    {n}
                  </span>
                  <span>
                    <strong>{title}.</strong> {text}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
        <div className="cz__scale" aria-hidden="true">
          {["Wand", "Mauerwerk", "Pore", "Porenwand"].map((l, i) => (
            <span key={l} className={`cz-tick cz-tick--${i + 1}`}>
              {l}
            </span>
          ))}
        </div>
        <p className="cz-credit">Foto: SchimmelPeter®. Schematische Darstellung, nicht maßstäblich.</p>
      </div>
    </section>
  );
}
