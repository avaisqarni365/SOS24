import type { ReactNode } from "react";
import { LOGO_PATHS } from "@/components/brand/Logo";
import type { KitArt as Art } from "@/data/kit";

/**
 * Flat drawings of the instruments and materials, in the logo's colours,
 * each carrying the SOS mark. One 120 x 120 grid for all of them so they
 * line up in a row. <KitSymbols /> must be on the page once: it holds the
 * mark and the thermal gradient the drawings reference.
 */
const NAVY = "#173455";
const BLUE = "#0B8AD0";
const STEEL = "#C7D2DD";
const STEEL2 = "#9DAEBF";
const DARK = "#22303F";
const BRICK = "#B95642";

export function KitSymbols() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <symbol id="kit-sos" viewBox="74 172 539 215">
          <path d={LOGO_PATHS.sos + LOGO_PATHS.drop} fill="currentColor" />
        </symbol>
        <linearGradient id="kit-thermal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2B3FD1" />
          <stop offset="0.45" stopColor="#21B5E8" />
          <stop offset="0.72" stopColor="#F5D23A" />
          <stop offset="1" stopColor="#E8462E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Mark({ x, y, w, c }: { x: number; y: number; w: number; c: string }) {
  return <use href="#kit-sos" x={x} y={y} width={w} height={(w * 215) / 539} color={c} />;
}

const Shadow = ({ rx = 34 }: { rx?: number }) => <ellipse cx="60" cy="109" rx={rx} ry="4.5" fill="#0B1B2E" opacity="0.1" />;

function Bucket({ lid, label, text, size = 6.4 }: { lid: string; label: string; text: string; size?: number }) {
  return (
    <>
      <Shadow rx={32} />
      <path d="M30 44Q60 14 90 44" fill="none" stroke={STEEL2} strokeWidth="2.5" />
      <path d="M28 44H92L86 102Q60 107 34 102Z" fill="#fff" stroke={STEEL} strokeWidth="2" />
      <rect x="24" y="36" width="72" height="11" rx="4" fill={lid} />
      <path d="M29.7 60H90.3L87.9 84H32.1Z" fill={label} />
      <Mark x={44} y={63} w={32} c="#fff" />
      <text x="60" y="81.5" textAnchor="middle" fontSize={size} fontWeight="700" letterSpacing="0.06em" fill="#fff">
        {text}
      </text>
    </>
  );
}

function Canister({ x, color, letter }: { x: number; color: string; letter: string }) {
  return (
    <>
      <rect x={x + 4} y="25" width="15" height="12" rx="4" fill="none" stroke={color} strokeWidth="4" />
      <rect x={x + 23} y="26" width="8" height="11" rx="2" fill={DARK} />
      <rect x={x} y="35" width="34" height="68" rx="6" fill={color} />
      <rect x={x + 4} y="50" width="26" height="36" rx="3" fill="#fff" />
      <Mark x={x + 6.5} y={53} w={21} c={BLUE} />
      <text x={x + 17} y="80" textAnchor="middle" fontSize="15" fontWeight="800" fill={color}>
        {letter}
      </text>
    </>
  );
}

const BRICKS: [number, number, number][] = [
  [10, 32, 32], [44, 32, 32], [78, 32, 32],
  [10, 52, 16], [28, 52, 32], [62, 52, 32], [96, 52, 14],
  [10, 72, 32], [44, 72, 32], [78, 72, 32],
];

const ART: Record<Art, ReactNode> = {
  meter: (
    <>
      <Shadow rx={26} />
      <rect x="47" y="10" width="4" height="20" rx="2" fill={STEEL2} />
      <rect x="69" y="10" width="4" height="20" rx="2" fill={STEEL2} />
      <rect x="36" y="26" width="48" height="80" rx="13" fill={NAVY} />
      <rect x="43" y="36" width="34" height="26" rx="5" fill="#DFF1FB" />
      <text x="60" y="52" textAnchor="middle" fontSize="11" fontWeight="700" fill={NAVY}>
        4,2 %
      </text>
      <rect x="47" y="56" width="26" height="2.6" rx="1.3" fill="#BFDDF0" />
      <rect x="47" y="56" width="17" height="2.6" rx="1.3" fill={BLUE} />
      <Mark x={45} y={69} w={30} c="#5CC0F2" />
      <circle cx="51" cy="93" r="4.2" fill="#2B4E78" />
      <circle cx="69" cy="93" r="4.2" fill={BLUE} />
    </>
  ),
  cm: (
    <>
      <Shadow rx={42} />
      <path d="M36 52v-6a5 5 0 0 1 5-5h14a5 5 0 0 1 5 5v6" fill="none" stroke={NAVY} strokeWidth="5" />
      <rect x="10" y="52" width="74" height="51" rx="7" fill={NAVY} />
      <rect x="10" y="69" width="74" height="3" fill="#0F2742" />
      <rect x="18" y="78" width="42" height="17" rx="3" fill="#fff" />
      <Mark x={22} y={81.5} w={27} c={BLUE} />
      <rect x="85" y="31" width="8" height="10" rx="2" fill={STEEL2} />
      <rect x="78" y="40" width="22" height="64" rx="9" fill={STEEL} />
      <rect x="82" y="45" width="5" height="52" rx="2.5" fill="#fff" opacity="0.65" />
      <circle cx="89" cy="23" r="13" fill="#fff" stroke={STEEL2} strokeWidth="3" />
      <path d="M80.5 27.5A9.5 9.5 0 0 1 97.5 27.5" fill="none" stroke={BLUE} strokeWidth="1.6" opacity="0.7" />
      <path d="M89 23L95.5 17.5" stroke={BRICK} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="89" cy="23" r="2" fill={NAVY} />
    </>
  ),
  thermal: (
    <>
      <Shadow rx={30} />
      <rect x="22" y="17" width="20" height="11" rx="3" fill={DARK} />
      <rect x="18" y="25" width="76" height="54" rx="11" fill={NAVY} />
      <rect x="25" y="32" width="62" height="35" rx="5" fill="url(#kit-thermal)" />
      <ellipse cx="37" cy="57" rx="9" ry="6" fill="#2B3FD1" opacity="0.85" />
      <path d="M62 49.5h8M66 45.5v8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <text x="83" y="41" textAnchor="end" fontSize="6.5" fontWeight="700" fill="#fff">
        12,6°
      </text>
      <Mark x={45} y={69.5} w={22} c="#5CC0F2" />
      <path d="M50 79h22l-3 25a4 4 0 0 1-4 3.5h-8a4 4 0 0 1-4-3.5Z" fill={NAVY} />
      <rect x="45" y="83" width="6" height="11" rx="3" fill={DARK} />
    </>
  ),
  injection: (
    <>
      <rect x="10" y="10" width="40" height="15" rx="3" fill="#fff" stroke={STEEL} strokeWidth="1.5" />
      <Mark x={14} y={12.4} w={27} c={BLUE} />
      <rect x="8" y="30" width="104" height="62" rx="4" fill="#EADFD8" />
      {BRICKS.map(([x, y, w]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height="18" rx="1.5" fill={BRICK} />
      ))}
      <rect x="10" y="57" width="100" height="8" fill="#F4EDE9" />
      <path d="M30 61H90" stroke={BLUE} strokeWidth="3" />
      {[30, 60, 90].map((x) => (
        <circle key={x} cx={x} cy="61" r="5.5" fill={BLUE} stroke="#fff" strokeWidth="2.2" />
      ))}
      <path d="M90 61C100 61 104 70 108 78S114 98 112 108" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  cream: (
    <>
      <Shadow rx={22} />
      <path d="M55 24L57 8h6l2 16Z" fill={STEEL2} />
      <rect x="42" y="22" width="36" height="84" rx="7" fill="#fff" stroke={STEEL} strokeWidth="2" />
      <rect x="43" y="42" width="34" height="44" fill={BLUE} />
      <Mark x={46} y={49} w={28} c="#fff" />
      <text x="60" y="77" textAnchor="middle" fontSize="7.5" fontWeight="700" letterSpacing="0.1em" fill="#fff">
        SILAN
      </text>
      <rect x="43" y="96" width="34" height="9" rx="4" fill={STEEL} />
    </>
  ),
  slurry: <Bucket lid={STEEL2} label={BLUE} text="DICHTSCHLÄMME" size={5.8} />,
  resin: (
    <>
      <Shadow rx={40} />
      <Canister x={20} color={BLUE} letter="A" />
      <Canister x={64} color={NAVY} letter="B" />
    </>
  ),
  plaster: (
    <>
      <Shadow rx={36} />
      <path d="M28 30Q60 24 92 30L96 100Q60 106 24 100Z" fill="#EFE5D3" stroke="#D9C9AC" strokeWidth="2" />
      <path d="M28 30Q60 37 92 30" fill="none" stroke="#D9C9AC" strokeWidth="2" />
      <path d="M33 39H87" stroke="#D9C9AC" strokeWidth="1.2" strokeDasharray="3 3" />
      <rect x="34" y="50" width="52" height="36" rx="3" fill={BLUE} />
      <Mark x={42} y={54} w={36} c="#fff" />
      <text x="60" y="81" textAnchor="middle" fontSize="8" fontWeight="800" letterSpacing="0.12em" fill="#fff">
        WTA
      </text>
    </>
  ),
  membrane: (
    <>
      <Shadow rx={44} />
      <path d="M18 86L8 102H72L82 86Z" fill="#2E3D4D" />
      <path d="M18 46a9 20 0 0 0 0 40H90V46Z" fill="#1F2933" />
      <rect x="40" y="46" width="24" height="40" fill={BLUE} />
      <Mark x={42} y={62} w={20} c="#fff" />
      <ellipse cx="90" cy="66" rx="9" ry="20" fill="#3A4B5D" />
      <ellipse cx="90" cy="66" rx="5.5" ry="12.5" fill="none" stroke="#1F2933" strokeWidth="1.6" />
      <ellipse cx="90" cy="66" rx="2.5" ry="5.5" fill="#111A23" />
    </>
  ),
  liquid: <Bucket lid={BLUE} label={NAVY} text="FLÜSSIGKUNSTSTOFF" size={4.9} />,
  kmb: <Bucket lid="#1F2933" label={NAVY} text="KMB · BITUMEN" size={6} />,
  board: (
    <>
      <Shadow rx={44} />
      <path d="M14 72L70 50L108 66L52 90Z" fill="#EAE3D5" />
      <path d="M14 72L52 90V100L14 82Z" fill="#DCD3C0" />
      <path d="M52 90L108 66V76L52 100Z" fill="#CFC5AF" />
      <path d="M14 56L70 34L108 50L52 74Z" fill="#F5F1E9" stroke="#DCD4C4" strokeWidth="1.2" />
      <path d="M14 56L52 74V86L14 68Z" fill="#E6DECD" />
      <path d="M52 74L108 50V62L52 86Z" fill="#D8CFBB" />
      {[[34, 54], [46, 49], [58, 44], [72, 46], [84, 51], [64, 58], [40, 61]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" fill="#E0D7C4" />
      ))}
      <g transform="rotate(-21.5 66 56)">
        <rect x="51" y="50" width="30" height="12" rx="2" fill="#fff" />
        <Mark x={54.5} y={52.3} w={23} c={BLUE} />
      </g>
    </>
  ),
};

export default function KitArt({ art, className = "" }: { art: Art; className?: string }) {
  return (
    <svg className={`kit-art ${className}`} viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      {ART[art]}
    </svg>
  );
}
