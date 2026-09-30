import type { ServiceCard } from "@/data/services";

/** Small cross-section illustrations, one per service, in the brand palette. */
export default function ServiceArt({ kind }: { kind: ServiceCard["art"] }) {
  const bricks = (x: number, y: number, w: number, h: number, damp = 0) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#9a6b4b" />
      {Array.from({ length: Math.floor(h / 14) }).map((_, i) => (
        <path key={i} d={`M${x} ${y + 14 * (i + 1)} H${x + w}`} stroke="#6e4a33" strokeWidth="1.5" />
      ))}
      {damp > 0 && <rect x={x} y={y + h - damp} width={w} height={damp} fill="#3b6ea8" opacity="0.55" />}
    </g>
  );
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="200" fill="#1b241f" />
      {kind === "keller" && (
        <g>
          <rect y="70" width="320" height="130" fill="#3a2f22" />
          <path d="M60 30 L160 -10 L260 30 Z" fill="#141b17" transform="translate(0 30)" />
          <rect x="70" y="60" width="180" height="120" fill="#26322c" />
          {bricks(70, 70, 16, 110, 30)}
          {bricks(234, 70, 16, 110, 30)}
          <rect x="86" y="172" width="148" height="8" fill="#62c4ac" />
          <rect x="120" y="100" width="80" height="50" rx="4" fill="#f1cf7a" opacity="0.25" />
        </g>
      )}
      {kind === "sperre" && (
        <g>
          {bricks(80, 20, 160, 170, 40)}
          <rect x="80" y="140" width="160" height="12" fill="#62c4ac" />
          {Array.from({ length: 8 }).map((_, i) => (
            <g key={i}>
              <rect x={88 + i * 20} y="143" width="10" height="6" fill="#dfe6e3" />
              <circle cx={93 + i * 20} cy="146" r="2" fill="#0e1310" />
            </g>
          ))}
        </g>
      )}
      {kind === "innen" && (
        <g>
          <rect x="30" y="0" width="80" height="200" fill="#3a2f22" />
          {bricks(110, 0, 70, 180)}
          <rect x="180" y="0" width="10" height="180" fill="#8f9a96" />
          <rect x="190" y="0" width="12" height="180" fill="#d9d2c1" />
          <path d="M190 180 L230 180 Q195 176 190 150 Z" fill="#8f9a96" />
          <rect x="110" y="180" width="210" height="20" fill="#5c5a55" />
          {[40, 80, 120].map((y) => (
            <path key={y} d={`M60 ${y} l24 0 m-8 -6 l8 6 l-8 6`} stroke="#5a8fc4" strokeWidth="3" fill="none" />
          ))}
        </g>
      )}
      {kind === "schimmel" && (
        <g>
          <rect x="40" y="20" width="240" height="170" fill="#d9d2c1" />
          <rect x="40" y="20" width="120" height="170" fill="#f3f1ec" />
          {[
            [210, 50, 16],
            [236, 70, 10],
            [196, 80, 8],
            [250, 44, 7],
          ].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#3b4a3c" opacity="0.8" />
          ))}
          <path d="M160 20 V190" stroke="#62c4ac" strokeWidth="4" strokeDasharray="8 8" />
        </g>
      )}
      {kind === "messung" && (
        <g>
          {bricks(60, 20, 200, 170, 70)}
          <rect x="130" y="70" width="70" height="46" rx="8" fill="#0e1310" stroke="#62c4ac" strokeWidth="2" />
          <text x="165" y="100" textAnchor="middle" fill="#62c4ac" fontSize="18" fontFamily="ui-monospace, monospace">
            %
          </text>
          <path d="M165 116 V150" stroke="#dfe6e3" strokeWidth="4" />
        </g>
      )}
      {kind === "riss" && (
        <g>
          <rect x="50" y="20" width="220" height="170" fill="#8a8f8b" />
          <path d="M150 20 L160 60 L145 95 L165 130 L152 190" stroke="#1b241f" strokeWidth="6" fill="none" />
          <path d="M150 20 L160 60 L145 95 L165 130 L152 190" stroke="#62c4ac" strokeWidth="3" fill="none" />
          {[45, 90, 135, 175].map((y, i) => (
            <circle key={i} cx={i % 2 ? 180 : 130} cy={y} r="6" fill="#dfe6e3" />
          ))}
        </g>
      )}
    </svg>
  );
}
