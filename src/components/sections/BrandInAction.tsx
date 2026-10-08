import { ShieldCheck, Handshake, Leaf } from "lucide-react";
import BrandGallery, { type BrandGalleryItem } from "@/components/sections/BrandGallery";

/**
 * "Ein Team, ein Auftritt": the brand as the customer meets it at the door.
 * The van and the uniforms from the brand sheet and the three values the
 * sheet names. The equipment has its own section (KitShowcase).
 */
const GALLERY: BrandGalleryItem[] = [
  {
    shot: "van",
    title: "Servicewagen",
    note: "Werkzeug und Messtechnik an Bord",
    detail:
      "Unser Servicewagen kommt zur kostenlosen Messung und bleibt während der Sanierung vor Ort. An Bord: Feuchtemessgerät, CM-Messkoffer, Wärmebildkamera und die Injektionstechnik.",
  },
  {
    shot: "roofer",
    title: "Dachabdichtung",
    note: "verschweißt, Naht für Naht",
    detail:
      "Die Elastomerbitumen-Bahn wird vollflächig aufgeschweißt. An den Nähten schmelzen beide Bahnen zu einem Material zusammen: keine Fuge, die altern kann.",
  },
  {
    shot: "wall",
    title: "Innenabdichtung",
    note: "Schicht für Schicht",
    detail:
      "Mineralische Dichtschlämme in zwei Lagen, die Hohlkehle am Boden, darauf Sanierputz, der die Salze aus der Wand aufnimmt. Abgedichtet wird von innen, ohne Aufgraben.",
  },
  {
    shot: "walker",
    title: "Ein Team",
    note: "eine Arbeitskleidung",
    detail:
      "Wer bei Ihnen arbeitet, trägt die Arbeitskleidung von SOS Abdichtung. Sie haben einen festen Ansprechpartner, vom ersten Anruf bis zur Abnahme.",
  },
];

const VALUES = [
  { Icon: ShieldCheck, title: "Schutz", text: "Dauerhaft dicht, mit 10 Jahren Garantie auf unsere Arbeit." },
  { Icon: Handshake, title: "Vertrauen", text: "Ein fester Ansprechpartner und ein Festpreis nach der Messung." },
  { Icon: Leaf, title: "Nachhaltigkeit", text: "Sanieren statt abreißen: von innen, ohne Bagger." },
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

        <BrandGallery items={GALLERY} />

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
      </div>
    </section>
  );
}
