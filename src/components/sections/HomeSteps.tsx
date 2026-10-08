import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

/**
 * The last frame of every page: four steps from the first call to the dry
 * wall, each with its own small drawing. Step one carries the ways to reach
 * us; `formHref` lets a town or service page hand its context to the form.
 * The drawings move a little (CSS only), and stand still with reduced motion.
 */
const Bg = () => <ellipse cx="160" cy="262" rx="200" ry="96" fill="#e3f1fa" />;

const Check = ({ x, y, r = 14 }: { x: number; y: number; r?: number }) => (
  <g className="st-pop" style={{ ["--d" as string]: "0.9s" }}>
    <circle cx={x} cy={y} r={r} fill="#16a06a" />
    <path d={`M${x - r * 0.42} ${y}l${r * 0.3} ${r * 0.3} ${r * 0.56}-${r * 0.6}`} fill="none" stroke="#fff" strokeWidth={r * 0.22} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const ART = {
  kontakt: (
    <>
      <Bg />
      {[0, 1, 2].map((i) => (
        <path key={i} className="st-ring" style={{ ["--d" as string]: `${i * 0.35}s` }} d={`M${96 - i * 12} ${86 - i * 10}a${30 + i * 12} ${30 + i * 12} 0 0 0 0 ${48 + i * 20}`} fill="none" stroke="#1784c7" strokeWidth="4" strokeLinecap="round" />
      ))}
      <rect x="114" y="34" width="92" height="164" rx="16" fill="#173455" />
      <rect x="121" y="48" width="78" height="134" rx="7" fill="#ffffff" />
      <rect x="148" y="40" width="24" height="4" rx="2" fill="#3b4f6b" />
      <g className="st-pop" style={{ ["--d" as string]: "0.1s" }}>
        <rect x="140" y="58" width="52" height="42" rx="8" fill="#d9f2e6" />
        <rect x="145" y="63" width="42" height="26" rx="3" fill="#c66a52" />
        <path d="M145 72h42M145 81h42M159 63v9M173 72v9M159 81v8" stroke="#efdcd2" strokeWidth="1.6" />
        <path d="M145 89c6-8 14-7 20-3 6 4 14 3 22-4v7h-42Z" fill="#1784c7" opacity="0.55" />
        <rect x="145" y="92" width="26" height="3" rx="1.5" fill="#9bc7b2" />
      </g>
      <g className="st-pop" style={{ ["--d" as string]: "0.5s" }}>
        <rect x="128" y="108" width="54" height="26" rx="8" fill="#e8f0f7" />
        <rect x="135" y="115" width="38" height="4" rx="2" fill="#7f93aa" />
        <rect x="135" y="123" width="26" height="4" rx="2" fill="#7f93aa" />
      </g>
      <g className="st-pop" style={{ ["--d" as string]: "0.7s" }}>
        <rect x="146" y="142" width="46" height="22" rx="8" fill="#d9f2e6" />
        <rect x="152" y="149" width="32" height="4" rx="2" fill="#5fae8a" />
        <rect x="152" y="156" width="20" height="3" rx="1.5" fill="#5fae8a" />
      </g>
      <Check x={208} y={52} />
    </>
  ),
  messung: (
    <>
      <rect width="320" height="240" fill="#f2f5f8" />
      <path d="M0 0h168v240H0Z" fill="#eaeff4" />
      <path d="M0 150c30-14 52 6 82-4s56-16 86-2v96H0Z" fill="#1784c7" opacity="0.22" />
      <path d="M0 170c24-8 46 4 72-2s60-12 96 0" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="2 6" strokeLinecap="round" />
      <path d="M118 30v192" stroke="#9daebf" strokeWidth="2" strokeDasharray="5 5" />
      {[210, 178, 142, 100, 52].map((y, i) => (
        <circle key={y} className="st-pop" style={{ ["--d" as string]: `${i * 0.18}s` }} cx="118" cy={y} r="6" fill="#ffffff" stroke="#0b63a8" strokeWidth="3" />
      ))}
      <ellipse cx="160" cy="262" rx="200" ry="70" fill="#e3f1fa" />
      <g transform="rotate(-8 228 140)">
        <rect x="178" y="66" width="98" height="140" rx="20" fill="#173455" />
        <rect x="190" y="80" width="74" height="58" rx="7" fill="#dff1fb" />
        {[22, 30, 40, 48, 34].map((h, i) => (
          <rect key={i} className="st-bar" style={{ ["--d" as string]: `${i * 0.12}s` }} x={197 + i * 13} y={132 - h} width="9" height={h} rx="2" fill={i < 3 ? "#1fa9d6" : "#0b63a8"} />
        ))}
        <circle cx="210" cy="164" r="9" fill="#3b4f6b" />
        <circle cx="244" cy="164" r="9" fill="#3b4f6b" />
        <rect x="216" y="184" width="22" height="6" rx="3" fill="#3b4f6b" />
        <path d="M178 96h-22M178 114h-22" stroke="#9daebf" strokeWidth="4" strokeLinecap="round" />
      </g>
    </>
  ),
  angebot: (
    <>
      <circle cx="70" cy="190" r="130" fill="#e3f1fa" />
      <g transform="rotate(-4 166 120)">
        <rect x="96" y="22" width="140" height="190" rx="8" fill="#ffffff" stroke="#cbd6e0" strokeWidth="2" />
        <rect x="112" y="38" width="62" height="9" rx="4.5" fill="#173455" />
        <rect x="112" y="53" width="92" height="4" rx="2" fill="#9daebf" />
        {[76, 92, 108, 124].map((y, i) => (
          <path key={y} className="st-draw" style={{ ["--d" as string]: `${i * 0.15}s` }} pathLength={1} d={`M112 ${y}h${70 - (i % 2) * 18}M196 ${y}h24`} stroke="#3b4f6b" strokeWidth="4" strokeLinecap="round" />
        ))}
        <path d="M112 140h108" stroke="#cbd6e0" strokeWidth="2" />
        <rect x="160" y="148" width="60" height="20" rx="5" fill="#e3f1fa" stroke="#0b63a8" strokeWidth="2" />
        <rect x="168" y="156" width="36" height="4" rx="2" fill="#0b63a8" />
        <path d="M112 186h40" stroke="#3b4f6b" strokeWidth="2.5" strokeLinecap="round" />
        <path className="st-draw" style={{ ["--d" as string]: "0.7s" }} pathLength={1} d="M114 180c6-10 10 6 16-2s8 4 14-1" fill="none" stroke="#0b63a8" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <Check x={226} y={196} r={18} />
      <g transform="rotate(38 262 150)">
        <rect x="254" y="96" width="14" height="78" rx="3" fill="#f5c542" />
        <path d="M254 174h14l-7 16Z" fill="#efdcd2" />
        <path d="M258.5 184h5l-2.5 6Z" fill="#173455" />
        <rect x="254" y="96" width="14" height="10" rx="3" fill="#d33f2f" />
      </g>
    </>
  ),
  sanierung: (
    <>
      <Bg />
      <defs>
        <pattern id="st-brick" width="40" height="20" patternUnits="userSpaceOnUse">
          <rect width="40" height="20" fill="#c66a52" />
          <path d="M0 0H40M0 10H40M20 0V10M0 10V20M40 10V20" stroke="#efdcd2" strokeWidth="2" />
        </pattern>
      </defs>
      <rect x="26" y="24" width="168" height="196" rx="4" fill="url(#st-brick)" />
      <rect className="st-band" x="26" y="184" width="168" height="8" rx="2" fill="#0b63a8" />
      {[44, 76, 108, 140, 172].map((x, i) => (
        <circle key={x} className="st-pop" style={{ ["--d" as string]: `${i * 0.12}s` }} cx={x} cy="188" r="4.5" fill="#173455" />
      ))}
      <path d="M244 172l-6 50h16l4-38 4 38h16l-6-50Z" fill="#173455" />
      <path d="M232 98c0-12 12-20 30-20s30 8 30 20v76h-60Z" fill="#2b3644" />
      <text x="262" y="132" textAnchor="middle" fontSize="12" fontWeight="800" fill="#ffffff" fontFamily="system-ui, sans-serif">
        SOS
      </text>
      <path d="M240 108l-30 40" stroke="#2b3644" strokeWidth="15" strokeLinecap="round" />
      <circle cx="262" cy="62" r="17" fill="#f1c9a5" />
      <path d="M245 58c0-12 8-19 18-19s17 6 17 15c-6-4-14-6-22-4-5 1-9 4-13 8Z" fill="#3b2a20" />
      <g className="st-gun">
        <rect x="190" y="142" width="30" height="13" rx="3" fill="#5b6b7d" />
        <path d="M192 152l-10 30" stroke="#5b6b7d" strokeWidth="5" strokeLinecap="round" />
        <circle cx="212" cy="150" r="7" fill="#1784c7" />
      </g>
      {[
        [64, 52, 0],
        [150, 78, 0.5],
        [104, 120, 1],
      ].map(([x, y, d]) => (
        <path key={`${x}${y}`} className="st-twinkle" style={{ ["--d" as string]: `${d}s` }} d={`M${x} ${y - 13}q2 11 13 13q-11 2-13 13q-2-11-13-13q11-2 13-13Z`} fill="#ffffff" stroke="#0b63a8" strokeWidth="2" strokeLinejoin="round" />
      ))}
      <Check x={42} y={44} r={16} />
    </>
  ),
};

const STEPS = [
  {
    key: "kontakt" as const,
    title: "Kontakt",
    text: "Anruf, WhatsApp oder Formular: Sie schildern kurz, was Sie sehen, gern mit Foto. Wir vereinbaren den Termin.",
  },
  {
    key: "messung" as const,
    title: "Messung vor Ort",
    text: "Kostenlos und unverbindlich: Wir besichtigen innen und außen und messen in fünf Höhen. So steht die Ursache fest.",
  },
  {
    key: "angebot" as const,
    title: "Festpreis-Angebot",
    text: "Auf Basis der Messung erhalten Sie ein schriftliches, verbindliches Angebot zum Festpreis.",
  },
  {
    key: "sanierung" as const,
    title: "Sanierung und Abnahme",
    text: "Nach Ihrem Auftrag planen und sanieren wir. Zum Schluss nehmen wir die Arbeit gemeinsam ab, mit Messprotokoll.",
  },
];

export default function HomeSteps({ formHref = "/kontakt/" }: { formHref?: string }) {
  return (
    <section id="schritte" className="sc-section steps4" aria-labelledby="schritte-title">
      <div className="sc-wrap">
        <p className="sc-label">So geht es los</p>
        <h2 id="schritte-title" className="sc-display mt-3">
          So wird Ihr Keller trocken. <em>In vier Schritten.</em>
        </h2>
        <ol className="steps4__list">
          {STEPS.map((s, i) => (
            <li key={s.key} className="steps4__item">
              <div className="steps4__art" aria-hidden="true">
                <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice">
                  {ART[s.key]}
                </svg>
              </div>
              <div className="steps4__head">
                <span className="steps4__n" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="steps4__t">{s.title}</h3>
              </div>
              <p className="steps4__d">{s.text}</p>
              {i === 0 ? (
                <div className="steps4__cta">
                  <a href={`tel:${COMPANY_INFO.phoneTel}`} className="steps4__btn">
                    <span className="steps4__btn-i">
                      <Phone aria-hidden="true" />
                    </span>
                    {COMPANY_INFO.phoneDisplay}
                  </a>
                  <a href={COMPANY_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer" className="steps4__btn">
                    <span className="steps4__btn-i">
                      <MessageCircle aria-hidden="true" />
                    </span>
                    WhatsApp schreiben
                  </a>
                  <a href={formHref} className="steps4__btn steps4__btn--solid">
                    Zum Formular
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
