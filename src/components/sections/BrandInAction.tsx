import { ShieldCheck, Handshake, Leaf, Gauge, FlaskConical, Thermometer, Syringe, Flame, PaintRoller } from "lucide-react";
import BrandShot, { type ShotKey } from "@/components/brand/BrandShot";

/**
 * "Ein Team, ein Auftritt": the brand as the customer meets it at the door.
 * The van and the uniforms from the brand sheet, the three values the sheet
 * names, and the equipment that makes a remediation measurable.
 */
const GALLERY: { shot: ShotKey; title: string; note: string }[] = [
  { shot: "van", title: "Servicewagen", note: "Werkzeug und Messtechnik an Bord" },
  { shot: "roofer", title: "Dachabdichtung", note: "verschweißt, Naht für Naht" },
  { shot: "wall", title: "Innenabdichtung", note: "Schicht für Schicht" },
  { shot: "walker", title: "Ein Team", note: "eine Arbeitskleidung" },
];

const VALUES = [
  { Icon: ShieldCheck, title: "Schutz", text: "Dauerhaft dicht, mit 10 Jahren Garantie auf unsere Arbeit." },
  { Icon: Handshake, title: "Vertrauen", text: "Ein fester Ansprechpartner und ein Festpreis nach der Messung." },
  { Icon: Leaf, title: "Nachhaltigkeit", text: "Sanieren statt abreißen: von innen, ohne Bagger." },
];

const EQUIPMENT = [
  { Icon: Gauge, label: "Feuchtemessgerät" },
  { Icon: FlaskConical, label: "CM-Messkoffer" },
  { Icon: Thermometer, label: "Wärmebildkamera" },
  { Icon: Syringe, label: "Injektionstechnik" },
  { Icon: Flame, label: "Schweißbrenner" },
  { Icon: PaintRoller, label: "Flüssigkunststoff" },
];

export default function BrandInAction() {
  return (
    <section id="team" className="sc-section brand-act" aria-labelledby="team-title">
      <div className="sc-wrap">
        <p className="sc-label">Unser Auftritt</p>
        <h2 id="team-title" className="sc-display mt-4">
          Ein Team. <em>Ein Auftritt.</em>
        </h2>
        <p className="sc-body mt-5">
          Wer bei Ihnen klingelt, kommt im Servicewagen von SOS Abdichtung und trägt unsere
          Arbeitskleidung. An Bord ist die Messtechnik, mit der wir jede Sanierung belegen.
        </p>

        <ul className="brand-gallery" aria-label="SOS Abdichtung im Einsatz">
          {GALLERY.map((g) => (
            <li key={g.shot} className={`brand-gallery__item brand-gallery__item--${g.shot}`}>
              <BrandShot shot={g.shot} />
              <span className="brand-gallery__cap">
                <strong>{g.title}</strong>
                <span>{g.note}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="brand-values">
          {VALUES.map(({ Icon, title, text }) => (
            <div key={title} className="brand-value">
              <span className="brand-value__i" aria-hidden="true">
                <Icon strokeWidth={1.75} />
              </span>
              <div>
                <p className="brand-value__t">{title}</p>
                <p className="brand-value__d">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="brand-kit">
          <p className="brand-kit__k">Ausrüstung im Wagen</p>
          <ul className="brand-kit__list">
            {EQUIPMENT.map(({ Icon, label }) => (
              <li key={label}>
                <Icon strokeWidth={1.75} aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
