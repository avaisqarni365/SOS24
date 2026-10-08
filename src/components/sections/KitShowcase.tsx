import { KIT } from "@/data/kit";
import { KitSymbols } from "@/components/brand/KitArt";
import KitGrid from "@/components/sections/KitGrid";

/**
 * "Werkzeug & Material": the instruments that make a remediation
 * measurable and the materials that do the sealing, in the brand's own
 * colours. Each card opens a quick view with what it is and how it works.
 */
export default function KitShowcase({ id = "ausruestung" }: { id?: string }) {
  return (
    <section id={id} className="sc-section kit" aria-labelledby={`${id}-title`}>
      <KitSymbols />
      <div className="sc-wrap">
        <p className="sc-label">Werkzeug & Material</p>
        <h2 id={`${id}-title`} className="sc-display mt-4">
          Gemessen mit Gerät. <em>Abgedichtet mit System.</em>
        </h2>
        <p className="sc-body mt-5">
          Was wir im Wagen haben und womit wir abdichten. Tippen Sie auf eine Karte: Sie sehen, wofür das Gerät
          oder das Material da ist und was dabei in der Wand passiert.
        </p>
        <KitGrid items={KIT} />
      </div>
    </section>
  );
}
