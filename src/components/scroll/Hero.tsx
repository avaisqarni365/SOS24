import { COMPANY_INFO } from "@/data/content-data";
import { hy } from "@/lib/hyphenate";

export const CTA_LABEL = "Kostenlose Feuchtemessung anfragen";

const ROWS = [
  // mid-plane houses on the Wuppertal slope: x, groundY, width, height, roof
  [120, 560, 70, 90, "gable"],
  [200, 548, 60, 110, "flat"],
  [270, 540, 80, 96, "gable"],
  [360, 530, 58, 120, "flat"],
  [430, 522, 76, 100, "gable"],
  [520, 514, 64, 118, "flat"],
  [600, 508, 86, 92, "gable"],
  [700, 520, 60, 104, "flat"],
  [770, 532, 74, 88, "gable"],
  [860, 546, 66, 96, "flat"],
  [940, 560, 80, 84, "gable"],
  [1036, 574, 58, 90, "flat"],
] as const;

function MidHouses() {
  return (
    <g>
      {ROWS.map(([x, gy, w, h, roof], i) => (
        <g key={i}>
          <rect x={x} y={gy - h} width={w} height={h} fill="#1f2b25" />
          {roof === "gable" ? (
            <path d={`M${x - 4} ${gy - h} L${x + w / 2} ${gy - h - 30} L${x + w + 4} ${gy - h} Z`} fill="#18221d" />
          ) : (
            <rect x={x - 3} y={gy - h - 6} width={w + 6} height={6} fill="#18221d" />
          )}
          {[0, 1, 2].map((r) =>
            [0, 1].map((c) => (
              <rect
                key={`${r}${c}`}
                x={x + 12 + c * (w / 2 - 6)}
                y={gy - h + 16 + r * 28}
                width={10}
                height={14}
                fill="#f1cf7a"
                opacity={(i * 7 + r * 3 + c * 5) % 4 === 0 ? 0.85 : 0.14}
              />
            ))
          )}
        </g>
      ))}
    </g>
  );
}

export default function Hero() {
  return (
    <section
      id="top"
      className="hero"
      aria-labelledby="hero-title"
      data-sc-act="pin"
      data-sc-span="1.7"
      data-sc-drift="#0e1310"
      style={{ ["--sc-span" as string]: 1.7 }}
    >
      <div data-sc-stage className="hero__stage">
        {/* BACK: sky, the Bergisches Land ridges, the Schwebebahn over the valley */}
        <div className="hero__plane" data-hero-plane="back" aria-hidden="true">
          <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMaxYMax slice">
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0b100d" />
                <stop offset="0.62" stopColor="#15241e" />
                <stop offset="1" stopColor="#1c3129" />
              </linearGradient>
              <radialGradient id="moon" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#f3f1ec" stopOpacity="0.9" />
                <stop offset="0.3" stopColor="#f3f1ec" stopOpacity="0.25" />
                <stop offset="1" stopColor="#f3f1ec" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1600" height="1000" fill="url(#sky)" />
            <circle cx="1290" cy="190" r="120" fill="url(#moon)" />
            <circle cx="1290" cy="190" r="26" fill="#f3f1ec" opacity="0.85" />
            <path d="M0 470 C180 400 330 430 470 392 C640 346 760 410 930 370 C1090 334 1230 380 1380 352 C1480 334 1550 350 1600 342 L1600 1000 L0 1000Z" fill="#14201b" />
            <path d="M0 520 C150 470 300 500 460 468 C620 436 760 488 920 456 C1080 424 1240 470 1400 446 C1500 432 1560 440 1600 436 L1600 1000 L0 1000Z" fill="#17251f" />
            {/* Schwebebahn: truss, A-frame legs, one car */}
            <g opacity="0.55" stroke="#3a5a4f" strokeWidth="3" fill="none">
              <path d="M0 540 L1600 520" />
              <path d="M0 552 L1600 532" />
              {Array.from({ length: 9 }).map((_, i) => {
                const x = 60 + i * 190;
                const y = 540 - (x / 1600) * 20;
                return <path key={i} d={`M${x - 26} ${y + 120} L${x} ${y + 10} L${x + 26} ${y + 120}`} />;
              })}
            </g>
            <g opacity="0.8">
              <rect x="640" y="558" width="92" height="30" rx="8" fill="#62c4ac" opacity="0.5" />
              <path d="M686 530 L686 558" stroke="#62c4ac" strokeOpacity="0.5" strokeWidth="3" />
            </g>
          </svg>
        </div>

        {/* MID: the slope with Gründerzeit rows */}
        <div className="hero__plane" data-hero-plane="mid" aria-hidden="true">
          <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMaxYMax slice">
            <path d="M0 600 C200 560 420 520 640 508 C860 500 1000 560 1160 600 L1600 640 L1600 1000 L0 1000Z" fill="#131d18" />
            <MidHouses />
          </svg>
        </div>

        {/* SUBJECT: the cut-open house, basement in the ground, damp front receding */}
        <div className="hero__plane" data-hero-plane="subject" aria-hidden="true">
          <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMaxYMax slice">
            <defs>
              <linearGradient id="damp" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#3b6ea8" stopOpacity="0.95" />
                <stop offset="0.7" stopColor="#3b6ea8" stopOpacity="0.45" />
                <stop offset="1" stopColor="#3b6ea8" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2b241b" />
                <stop offset="1" stopColor="#1a1611" />
              </linearGradient>
              <linearGradient id="room" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2a3530" />
                <stop offset="1" stopColor="#1f2925" />
              </linearGradient>
              <pattern id="bricks" width="40" height="20" patternUnits="userSpaceOnUse">
                <rect width="40" height="20" fill="#6b4f3a" />
                <path d="M0 0.5 H40 M0 10.5 H40 M20 0 V10 M0 10 V20 M40 10 V20" stroke="#4a3526" strokeWidth="1.5" />
              </pattern>
            </defs>
            {/* soil section */}
            <rect x="0" y="640" width="1600" height="360" fill="url(#soil)" />
            <path d="M0 720 C300 728 600 712 900 724 C1200 736 1400 716 1600 726" stroke="#3a3024" strokeWidth="2" fill="none" />
            <path d="M0 800 C300 790 600 812 900 800 C1200 790 1400 810 1600 798" stroke="#3a3024" strokeWidth="2" fill="none" />
            <rect x="0" y="880" width="1600" height="120" fill="#1d3f5c" opacity="0.55" />
            <path d="M0 880 C120 872 240 888 360 880 C480 872 600 888 720 880 C840 872 960 888 1080 880 C1200 872 1320 888 1440 880 C1520 875 1560 882 1600 880" stroke="#5a8fc4" strokeOpacity="0.6" strokeWidth="2" fill="none" />
            <path d="M0 640 L1600 640" stroke="#2f4a3a" strokeWidth="6" />

            {/* house above ground */}
            <rect x="1170" y="460" width="380" height="180" fill="#26322c" />
            <path d="M1150 462 L1360 330 L1570 462 Z" fill="#1b2420" />
            <rect x="1200" y="500" width="70" height="92" fill="#f1cf7a" opacity="0.8" />
            <rect x="1300" y="500" width="70" height="92" fill="#f1cf7a" opacity="0.25" />
            <rect x="1440" y="530" width="56" height="110" fill="#141b17" />
            {/* cut-open basement */}
            <rect x="1170" y="640" width="380" height="210" fill="url(#room)" />
            <rect x="1170" y="640" width="34" height="210" fill="url(#bricks)" />
            <rect x="1516" y="640" width="34" height="210" fill="url(#bricks)" />
            <rect x="1160" y="850" width="400" height="18" fill="#5c5a55" />
            {/* damp rising from the ground into walls and room face */}
            <rect className="damp-front" x="1170" y="690" width="380" height="160" fill="url(#damp)" opacity="0.8" />
            <g fill="#e8e1cf" opacity="0.7">
              <circle cx="1215" cy="712" r="2.5" />
              <circle cx="1228" cy="704" r="2" />
              <circle cx="1240" cy="716" r="3" />
              <circle cx="1480" cy="708" r="2.5" />
              <circle cx="1496" cy="700" r="2" />
              <circle cx="1505" cy="714" r="3" />
            </g>
            {/* the horizontal barrier, drawn in by scroll */}
            <path
              className="barrier-line"
              pathLength={1}
              d="M1170 832 H1550"
              stroke="#62c4ac"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <g fill="#62c4ac">
              {[1180, 1196, 1524, 1540].map((x) => (
                <circle key={x} cx={x} cy={832} r="4.5" />
              ))}
            </g>
          </svg>
        </div>

        {/* FRONT: grass lip, stones and groundwater droplets, fastest plane */}
        <div className="hero__plane" data-hero-plane="front" aria-hidden="true">
          <svg viewBox="0 0 1600 1000" preserveAspectRatio="xMaxYMax slice">
            <path d="M0 1000 L0 960 C140 940 260 956 380 944 C520 930 640 960 800 950 C980 938 1120 962 1280 948 C1420 936 1520 952 1600 946 L1600 1000 Z" fill="#101712" />
            <g fill="#0b110d">
              <ellipse cx="200" cy="968" rx="40" ry="16" />
              <ellipse cx="720" cy="972" rx="54" ry="18" />
              <ellipse cx="1380" cy="966" rx="46" ry="15" />
            </g>
            <g fill="#5a8fc4" opacity="0.7">
              <path d="M1110 900 q6 10 0 16 q-6 -6 0 -16z" />
              <path d="M1250 916 q6 10 0 16 q-6 -6 0 -16z" />
              <path d="M980 912 q6 10 0 16 q-6 -6 0 -16z" />
            </g>
          </svg>
        </div>

        <div className="hero__scrim" aria-hidden="true" />

        <div className="hero__copy">
          <p className="sc-label">
            SchimmelPeter® Partnerbetrieb · Wuppertal &amp; Bergisches Land
          </p>
          <h1
            id="hero-title"
            className="sc-display mt-5 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.6rem]"
           
          >
            Kellersanierung Wuppertal.{" "}
            <em className="text-[var(--mint)]">Trocken, Schicht für Schicht.</em>
          </h1>
          <p className="sc-lede mt-6 text-[var(--sc-ink-soft)]">
            {hy("Wir stoppen aufsteigende Feuchtigkeit dort, wo sie entsteht: von innen, ohne Bagger und ohne aufgerissenen Garten. Mit kostenloser Feuchtemessung vor Ort, 10 Jahren Garantie auf unsere Arbeit und 25 Jahren Produktgarantie von SchimmelPeter.")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#kontakt"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[var(--bone)] px-6 py-3 text-sm font-semibold text-[var(--ink)] hover:bg-white"
            >
              {CTA_LABEL} <span aria-hidden="true">→</span>
            </a>
            <a
              href={`tel:${COMPANY_INFO.phoneTel}`}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-[var(--bone)] hover:border-[var(--mint)]"
            >
              {COMPANY_INFO.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
