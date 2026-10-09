import type { ReactNode } from "react";
import { LOGO_PATHS } from "@/components/brand/Logo";
import type { KitArt as Art } from "@/data/kit";

/**
 * The instruments and materials as product pictures: shaded bodies, glass
 * glare, metal and plastic sheen, a soft floor shadow, and a label with the
 * SOS mark on every one. One 120 x 120 grid for all of them so they line up
 * in a row. <KitSymbols /> must be on the page once: it holds the mark and
 * the shared gradients the pictures reference.
 */
const BLUE = "#0B8AD0";
const INK = "#0d2a44";

/** gradients run across a shape's own box, so one set serves every picture */
export function KitSymbols() {
  const lin = (id: string, stops: [number, string, number?][], vertical = false) => (
    <linearGradient id={id} x1="0" y1="0" x2={vertical ? "0" : "1"} y2={vertical ? "1" : "0"}>
      {stops.map(([o, c, a]) => (
        <stop key={`${o}${c}`} offset={o} stopColor={c} stopOpacity={a ?? 1} />
      ))}
    </linearGradient>
  );
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
        {lin("kit-navy", [[0, "#3a5174"], [0.18, "#22385a"], [0.75, "#172a45"], [1, "#0d1a2c"]])}
        {lin("kit-steel", [[0, "#7f8b97"], [0.22, "#eef2f6"], [0.45, "#c4cdd6"], [0.8, "#9aa6b2"], [1, "#6e7a86"]])}
        {lin("kit-chrome", [[0, "#f6f8fa"], [0.35, "#a3aeb9"], [0.6, "#e3e8ed"], [1, "#6f7b87"]], true)}
        {lin("kit-white", [[0, "#cfd6dd"], [0.16, "#f4f6f8"], [0.34, "#ffffff"], [0.7, "#eef1f4"], [1, "#c2cad3"]])}
        {lin("kit-black", [[0, "#3c4652"], [0.2, "#56616e"], [0.4, "#2a323c"], [0.8, "#1b222a"], [1, "#0e1318"]])}
        {lin("kit-blue", [[0, "#084a80"], [0.25, "#0f7cc4"], [0.45, "#1a96dc"], [0.75, "#0b6fb8"], [1, "#073f6e"]])}
        {lin("kit-navyband", [[0, "#0d2238"], [0.3, "#1d3a5e"], [0.5, "#24476f"], [0.8, "#163050"], [1, "#0b1b2e"]])}
        {lin("kit-red", [[0, "#6e160f"], [0.25, "#b42318"], [0.45, "#d92d20"], [0.75, "#a8231a"], [1, "#5e140e"]])}
        {lin("kit-lcd", [[0, "#effafe"], [1, "#b9e0f4"]], true)}
        {lin("kit-glare", [[0, "#ffffff", 0.55], [1, "#ffffff", 0]])}
        {lin("kit-paper", [[0, "#dccdb0"], [0.2, "#efe4cf"], [0.45, "#fbf6ec"], [0.8, "#ece0c8"], [1, "#d6c5a4"]])}
        {lin("kit-lid", [[0, "#e9eef3"], [1, "#b3bec9"]], true)}
        {lin("kit-lid-blue", [[0, "#2aa3e6"], [1, "#0a5a9a"]], true)}
        {lin("kit-lid-black", [[0, "#4a5561"], [1, "#151b22"]], true)}
        {lin("kit-roll", [[0, "#4a5460"], [0.3, "#2a323b"], [0.7, "#161c22"], [1, "#0b0f13"]], true)}
        {lin("kit-board-top", [[0, "#fbf8f2"], [1, "#ece4d4"]], true)}
        <radialGradient id="kit-face" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dfe5eb" />
        </radialGradient>
        <radialGradient id="kit-floor" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#0b1b2e" stopOpacity="0.32" />
          <stop offset="1" stopColor="#0b1b2e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="kit-btn" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#5d7698" />
          <stop offset="1" stopColor="#1b2d47" />
        </radialGradient>
        <radialGradient id="kit-btn-blue" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#5cc0f2" />
          <stop offset="1" stopColor="#0a5a9a" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function Mark({ x, y, w, c }: { x: number; y: number; w: number; c: string }) {
  return <use href="#kit-sos" x={x} y={y} width={w} height={(w * 215) / 539} color={c} />;
}

/** the soft shadow every product stands on */
const Floor = ({ rx = 34, cy = 108 }: { rx?: number; cy?: number }) => <ellipse cx="60" cy={cy} rx={rx} ry="6" fill="url(#kit-floor)" />;

/** a dial: chrome bezel, white face, ticks, red needle, glass glint */
function Gauge({ cx, cy, r, angle = -40 }: { cx: number; cy: number; r: number; angle?: number }) {
  const ticks = Array.from({ length: 9 }, (_, i) => -135 + i * 33.75);
  const rad = (a: number) => (a * Math.PI) / 180;
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="url(#kit-chrome)" />
      <circle cx={cx} cy={cy} r={r * 0.8} fill="url(#kit-face)" />
      {ticks.map((a) => (
        <line
          key={a}
          x1={cx + Math.sin(rad(a)) * r * 0.62}
          y1={cy - Math.cos(rad(a)) * r * 0.62}
          x2={cx + Math.sin(rad(a)) * r * 0.74}
          y2={cy - Math.cos(rad(a)) * r * 0.74}
          stroke="#3b4652"
          strokeWidth="0.8"
        />
      ))}
      <path d={`M${cx - Math.sin(rad(angle)) * r * 0.16} ${cy + Math.cos(rad(angle)) * r * 0.16}L${cx + Math.sin(rad(angle)) * r * 0.66} ${cy - Math.cos(rad(angle)) * r * 0.66}`} stroke="#d92d20" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r * 0.13} fill="#1d252e" />
      <path d={`M${cx - r * 0.62} ${cy - r * 0.2}A${r * 0.7} ${r * 0.7} 0 0 1 ${cx + r * 0.1} ${cy - r * 0.66}`} fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.8" />
    </>
  );
}

/** a pail: lid, handle, tapered body, wrap-around label */
function Pail({ body, lid, band, text, size = 6, ink = "#ffffff", markColor = "#ffffff" }: { body: string; lid: string; band: string; text: string; size?: number; ink?: string; markColor?: string }) {
  return (
    <>
      <Floor rx={36} />
      <path d="M24 42Q60 4 96 42" fill="none" stroke="#8c99a6" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M24 44H96L90.5 100Q60 109 29.5 100Z" fill={`url(#${body})`} />
      <path d="M26.6 60H93.4L91.4 85Q60 91 28.6 85Z" fill={`url(#${band})`} />
      <Mark x={43} y={63} w={34} c={markColor} />
      <text x="60" y="82" textAnchor="middle" fontSize={size} fontWeight="800" letterSpacing="0.06em" fill={ink}>
        {text}
      </text>
      <path d="M33 89H87" stroke={ink} strokeWidth="0.8" opacity="0.45" />
      <path d="M31.5 50L36 98" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" opacity="0.38" />
      <path d="M23 42v4.5a37 7 0 0 0 74 0V42" fill={`url(#${lid})`} />
      <ellipse cx="60" cy="42" rx="37" ry="7" fill={`url(#${lid})`} />
      <ellipse cx="60" cy="41" rx="30" ry="4.4" fill="#ffffff" opacity="0.28" />
      <rect x="20.5" y="39" width="5" height="9" rx="2" fill="#7d8995" />
      <rect x="94.5" y="39" width="5" height="9" rx="2" fill="#7d8995" />
    </>
  );
}

/** a two-part resin jerrycan: handle, cap, label with the big component letter */
function Jerrycan({ x, band, cap, letter }: { x: number; band: string; cap: string; letter: string }) {
  return (
    <>
      <path d={`M${x} 40a6 6 0 0 1 6-6h14l6 6v60a5 5 0 0 1-5 5H${x + 5}a5 5 0 0 1-5-5Z`} fill="url(#kit-white)" />
      <path d={`M${x + 4} 26h12a3 3 0 0 1 3 3v9H${x + 1}v-9a3 3 0 0 1 3-3Z`} fill="none" stroke="url(#kit-white)" strokeWidth="4" />
      <rect x={x + 23} y="27" width="9" height="9" rx="2" fill={cap} />
      <rect x={x + 22} y="34" width="11" height="3" rx="1" fill="#1d252e" opacity="0.5" />
      <rect x={x} y="56" width="32" height="38" fill={`url(#${band})`} />
      <Mark x={x + 4} y={59} w={24} c="#ffffff" />
      <text x={x + 16} y="88" textAnchor="middle" fontSize="15" fontWeight="900" fill="#ffffff">
        {letter}
      </text>
      <path d={`M${x + 4} 42v56`} stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" opacity="0.6" />
    </>
  );
}

/** an injection packer: steel shaft, rubber sleeve, grease-nipple head */
function Packer({ x, y, rot }: { x: number; y: number; rot: number }) {
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <rect x={x - 2.5} y={y} width="5" height="26" rx="1.5" fill="url(#kit-steel)" />
      <rect x={x - 3.6} y={y + 12} width="7.2" height="12" rx="2.4" fill="#1d252e" />
      <path d={`M${x - 3.6} ${y + 15}h7.2M${x - 3.6} ${y + 18}h7.2M${x - 3.6} ${y + 21}h7.2`} stroke="#39434f" strokeWidth="0.7" />
      <rect x={x - 3.4} y={y - 4} width="6.8" height="5" rx="1" fill="url(#kit-chrome)" />
      <circle cx={x} cy={y - 5.5} r="2.6" fill="url(#kit-chrome)" />
    </g>
  );
}

const ART: Record<Art, ReactNode> = {
  /* handheld capacitive moisture meter */
  meter: (
    <>
      <Floor rx={24} />
      <rect x="44" y="6" width="32" height="12" rx="6" fill="url(#kit-steel)" />
      <rect x="48" y="8" width="24" height="3" rx="1.5" fill="#ffffff" opacity="0.6" />
      <rect x="34" y="14" width="52" height="94" rx="14" fill="url(#kit-navy)" />
      <rect x="34" y="40" width="4" height="48" rx="2" fill="#0b1524" opacity="0.65" />
      <rect x="82" y="40" width="4" height="48" rx="2" fill="#0b1524" opacity="0.65" />
      <rect x="40" y="22" width="40" height="36" rx="6" fill="#0b1422" />
      <rect x="43" y="25" width="34" height="30" rx="3.5" fill="url(#kit-lcd)" />
      <text x="73" y="43" textAnchor="end" fontSize="12.5" fontWeight="800" fill={INK} fontFamily="ui-monospace, Menlo, monospace">
        4,2
      </text>
      <text x="74" y="43" fontSize="5.5" fontWeight="800" fill={INK}>
        %
      </text>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={46 + i * 4.2} y="47" width="3.2" height="4.2" rx="0.6" fill={i < 4 ? BLUE : "#9fcbe6"} />
      ))}
      <path d="M43 25h19L51 55h-8Z" fill="url(#kit-glare)" />
      <Mark x={46} y={63} w={28} c="#8fd3f5" />
      <circle cx="50" cy="84" r="5.4" fill="url(#kit-btn)" />
      <circle cx="70" cy="84" r="5.4" fill="url(#kit-btn-blue)" />
      <rect x="54" y="95" width="12" height="4" rx="2" fill="#0b1422" />
      <rect x="37.5" y="20" width="2.6" height="82" rx="1.3" fill="#ffffff" opacity="0.14" />
    </>
  ),
  /* CM test case: hard case, steel bottle, pressure gauge */
  cm: (
    <>
      <Floor rx={46} />
      <path d="M33 52v-6a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5v6" fill="none" stroke="#141a21" strokeWidth="5" strokeLinecap="round" />
      <rect x="7" y="52" width="76" height="54" rx="8" fill="url(#kit-black)" />
      <path d="M12 64h66M12 95h66" stroke="#46515d" strokeWidth="1.4" />
      <rect x="16" y="48" width="9" height="9" rx="1.6" fill="url(#kit-chrome)" />
      <rect x="65" y="48" width="9" height="9" rx="1.6" fill="url(#kit-chrome)" />
      <rect x="18" y="71" width="44" height="17" rx="2.5" fill="#ffffff" />
      <Mark x={22} y={74.5} w={26} c={BLUE} />
      <path d="M50 77h9M50 81h7" stroke="#9daebf" strokeWidth="1" />
      <rect x="76" y="46" width="26" height="60" rx="11" fill="url(#kit-steel)" />
      <rect x="85" y="36" width="8" height="12" rx="2" fill="url(#kit-steel)" />
      <rect x="80" y="62" width="18" height="16" rx="2" fill={BLUE} />
      <text x="89" y="73" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#ffffff">
        CM
      </text>
      <Gauge cx={89} cy={24} r={15} angle={38} />
    </>
  ),
  /* thermal imaging camera, pistol grip */
  thermal: (
    <>
      <Floor rx={30} />
      <path d="M50 74h22l-4 29a5 5 0 0 1-5 4.5h-5a5 5 0 0 1-5-4.5Z" fill="url(#kit-navy)" />
      <path d="M48 78h5v11a2.5 2.5 0 0 1-5 0Z" fill={BLUE} />
      <path d="M57 80v20M63 80v20" stroke="#0b1422" strokeWidth="1.2" opacity="0.6" />
      <rect x="20" y="10" width="28" height="13" rx="4" fill="#0f1a2a" />
      <circle cx="34" cy="16.5" r="4.6" fill="#1f3550" />
      <circle cx="34" cy="16.5" r="2.2" fill="#0a1220" />
      <circle cx="32.8" cy="15.4" r="0.9" fill="#ffffff" opacity="0.8" />
      <rect x="14" y="20" width="92" height="58" rx="12" fill="url(#kit-navy)" />
      <rect x="20" y="25" width="80" height="44" rx="6" fill="#0a1220" />
      <rect x="23" y="28" width="74" height="38" rx="3.5" fill="url(#kit-thermal)" />
      <path d="M23 28h26v38H23Z" fill="#2433b8" opacity="0.55" />
      <ellipse cx="38" cy="55" rx="12" ry="8" fill="#1a238f" opacity="0.85" />
      <path d="M60 47h9M64.5 42.5v9" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="72" y="31" width="22" height="9" rx="2" fill="#0a1220" opacity="0.72" />
      <text x="83" y="37.8" textAnchor="middle" fontSize="6" fontWeight="800" fill="#ffffff">
        12,6°
      </text>
      <path d="M23 28h22L33 66H23Z" fill="url(#kit-glare)" opacity="0.6" />
      <Mark x={47} y={70.2} w={24} c="#8fd3f5" />
      <rect x="17" y="24" width="2.6" height="48" rx="1.3" fill="#ffffff" opacity="0.14" />
    </>
  ),
  /* low-pressure injection unit, hose and packers */
  injection: (
    <>
      <Floor rx={46} />
      <path d="M46 23C68 18 76 40 80 60S92 88 99 90" fill="none" stroke="#141b23" strokeWidth="4.4" strokeLinecap="round" />
      <path d="M46 23C68 18 76 40 80 60S92 88 99 90" fill="none" stroke="#4b5866" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <rect x="12" y="30" width="40" height="72" rx="9" fill="url(#kit-white)" />
      <rect x="15.5" y="60" width="33" height="39" rx="6" fill={BLUE} opacity="0.32" />
      <path d="M43 44h5M43 52h5M43 60h5M43 68h5M43 76h5M43 84h5" stroke="#8c99a6" strokeWidth="1" />
      <rect x="12" y="38" width="40" height="15" fill="url(#kit-blue)" />
      <Mark x={20} y={40.6} w={24} c="#ffffff" />
      <rect x="18" y="21" width="28" height="11" rx="3" fill="url(#kit-navy)" />
      <rect x="28" y="12" width="8" height="11" fill="url(#kit-steel)" />
      <rect x="10" y="98" width="44" height="8" rx="3.5" fill="#1d2833" />
      <path d="M17 34v62" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <Gauge cx={32} cy={12} r={9.5} angle={-20} />
      <Packer x={99} y={84} rot={-24} />
      <Packer x={110} y={78} rot={-8} />
    </>
  ),
  /* injection cream cartridge */
  cream: (
    <>
      <Floor rx={22} />
      <path d="M56 22L58.6 4h2.8L64 22Z" fill="url(#kit-white)" stroke="#c2cad3" strokeWidth="0.8" />
      <rect x="50" y="19" width="20" height="6" rx="2" fill="url(#kit-steel)" />
      <rect x="40" y="23" width="40" height="84" rx="6" fill="url(#kit-white)" />
      <rect x="40" y="37" width="40" height="54" fill="url(#kit-blue)" />
      <Mark x={44} y={42} w={32} c="#ffffff" />
      <text x="60" y="65" textAnchor="middle" fontSize="7.4" fontWeight="900" letterSpacing="0.1em" fill="#ffffff">
        SILAN
      </text>
      <text x="60" y="72.5" textAnchor="middle" fontSize="4.6" fontWeight="700" letterSpacing="0.12em" fill="#cfe9f8">
        INJEKTION
      </text>
      <path d="M46 79h28M46 83h20M46 87h24" stroke="#9fd2f2" strokeWidth="0.9" />
      <rect x="40" y="99" width="40" height="8" rx="3" fill="url(#kit-steel)" />
      <rect x="45" y="25" width="3.6" height="80" rx="1.8" fill="#ffffff" opacity="0.6" />
    </>
  ),
  slurry: <Pail body="kit-white" lid="kit-lid" band="kit-blue" text="DICHTSCHLÄMME" size={5.6} />,
  /* two-part PU resin, component A and B */
  resin: (
    <>
      <Floor rx={44} />
      <Jerrycan x={20} band="kit-blue" cap={BLUE} letter="A" />
      <Jerrycan x={66} band="kit-red" cap="#b42318" letter="B" />
    </>
  ),
  /* renovation plaster, paper sack */
  plaster: (
    <>
      <Floor rx={40} />
      <path d="M22 30Q60 22 98 30L100 100Q60 108 20 100Z" fill="url(#kit-paper)" />
      <path d="M22 30Q60 38 98 30" fill="none" stroke="#cdbb97" strokeWidth="1.4" />
      <path d="M26 35H94" stroke="#bfae8b" strokeWidth="1" strokeDasharray="2.5 2.5" />
      <path d="M86 30l10 0 2 12-8-2Z" fill="#e3d4b5" stroke="#cdbb97" strokeWidth="0.8" />
      <path d="M28 46H92V88H28Z" fill="url(#kit-blue)" />
      <Mark x={38} y={50} w={44} c="#ffffff" />
      <text x="60" y="78" textAnchor="middle" fontSize="9" fontWeight="900" letterSpacing="0.16em" fill="#ffffff">
        WTA
      </text>
      <text x="60" y="84.5" textAnchor="middle" fontSize="4.3" fontWeight="700" letterSpacing="0.14em" fill="#cfe9f8">
        SANIERPUTZ
      </text>
      <path d="M30 94H90" stroke="#bfae8b" strokeWidth="0.8" opacity="0.7" />
      <path d="M26 40Q24 70 26 98" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
    </>
  ),
  /* elastomer bitumen membrane, rolled */
  membrane: (
    <>
      <Floor rx={46} cy={104} />
      <path d="M16 46h76v40H16Z" fill="url(#kit-roll)" />
      {[[24, 52], [34, 61], [28, 74], [46, 55], [52, 79], [62, 50], [70, 66], [78, 58], [84, 78], [40, 70], [58, 64], [20, 80]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="0.9" fill="#8a96a3" opacity="0.7" />
      ))}
      <ellipse cx="16" cy="66" rx="9" ry="20" fill="#232b33" />
      <rect x="38" y="46" width="26" height="40" fill="#ffffff" />
      <rect x="38" y="46" width="26" height="9" fill="url(#kit-blue)" />
      <Mark x={41} y={60} w={20} c={BLUE} />
      <path d="M41 74h20M41 78h14" stroke="#9daebf" strokeWidth="0.9" />
      <path d="M16 48H92" stroke="#ffffff" strokeWidth="2" opacity="0.18" />
      <ellipse cx="92" cy="66" rx="9" ry="20" fill="#3a4653" />
      <ellipse cx="92" cy="66" rx="6.5" ry="14.5" fill="none" stroke="#1d252e" strokeWidth="1.2" />
      <ellipse cx="92" cy="66" rx="4" ry="9" fill="none" stroke="#1d252e" strokeWidth="1.1" />
      <ellipse cx="92" cy="66" rx="2.2" ry="4.8" fill="#0b0f13" />
    </>
  ),
  /* liquid plastic: metal tin, and the fleece that goes with it */
  liquid: (
    <>
      <Floor rx={46} />
      <path d="M30 42Q62 8 94 42" fill="none" stroke="#8c99a6" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="28" y="42" width="68" height="62" rx="5" fill="url(#kit-steel)" />
      <path d="M28 58H96V90H28Z" fill="url(#kit-navyband)" />
      <Mark x={44} y={61} w={36} c="#ffffff" />
      <text x="62" y="84.5" textAnchor="middle" fontSize="5" fontWeight="800" letterSpacing="0.05em" fill="#ffffff">
        FLÜSSIGKUNSTSTOFF
      </text>
      <path d="M33 46v54" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M27 42v3.5a35 6 0 0 0 70 0V42" fill="url(#kit-lid-blue)" />
      <ellipse cx="62" cy="42" rx="35" ry="6" fill="url(#kit-lid-blue)" />
      <ellipse cx="62" cy="41" rx="28" ry="3.6" fill="#ffffff" opacity="0.3" />
      <rect x="6" y="80" width="26" height="26" rx="4" fill="#f4f6f8" stroke="#d5dce3" strokeWidth="1" />
      <ellipse cx="19" cy="80" rx="13" ry="4" fill="#ffffff" stroke="#d5dce3" strokeWidth="1" />
      <ellipse cx="19" cy="80" rx="4" ry="1.3" fill="#c2cad3" />
      <path d="M8 86h22M8 92h22M8 98h22" stroke="#e3e8ed" strokeWidth="1" />
    </>
  ),
  kmb: <Pail body="kit-black" lid="kit-lid-black" band="kit-navyband" text="KMB · BITUMEN" size={6} />,
  /* climate boards, stacked */
  board: (
    <>
      <Floor rx={48} cy={104} />
      <path d="M12 74L68 52L108 68L52 92Z" fill="url(#kit-board-top)" />
      <path d="M12 74L52 92V102L12 84Z" fill="#ddd3bf" />
      <path d="M52 92L108 68V78L52 102Z" fill="#cbc0a8" />
      <path d="M12 58L68 36L108 52L52 76Z" fill="url(#kit-board-top)" stroke="#dcd4c4" strokeWidth="1" />
      <path d="M12 58L52 76V88L12 70Z" fill="#e4dbc9" />
      <path d="M52 76L108 52V64L52 88Z" fill="#d4cab3" />
      {[[30, 56], [42, 51], [54, 46], [70, 47], [84, 52], [64, 60], [38, 63], [76, 58], [50, 66]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.1" fill="#d6cbb3" />
      ))}
      <path d="M12 58L68 36" stroke="#ffffff" strokeWidth="1.6" opacity="0.8" />
      <g transform="rotate(-21.5 66 58)">
        <rect x="50" y="52" width="32" height="13" rx="2" fill="#ffffff" stroke="#dfe5ea" strokeWidth="0.6" />
        <rect x="50" y="52" width="4" height="13" fill={BLUE} />
        <Mark x={57} y={54.6} w={22} c={BLUE} />
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
