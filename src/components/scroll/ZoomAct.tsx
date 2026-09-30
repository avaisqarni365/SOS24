import CapillaryZoom from "@/components/science/CapillaryZoom";
import { hy } from "@/lib/hyphenate";

/**
 * Second frame of the homepage: from the Keller in the hero to the wall
 * photo, the masonry, the pores and one pore wall, as four still figures.
 */
export default function ZoomAct() {
  return (
    <section id="vom-keller-zur-pore" className="zoom-act border-t border-line/10" aria-labelledby="zoom-title">
      <div className="sc-wrap zoom-act__head">
        <p className="sc-label">Warum der Keller nass wird</p>
        <h2 id="zoom-title" className="sc-display mt-3 max-w-4xl text-4xl sm:text-5xl lg:text-6xl">
          Vom Keller <em className="text-[var(--mint)]">bis in die Pore.</em>
        </h2>
        <p className="sc-body mt-5 max-w-2xl">
          {hy(
            "Vier Bilder, vier Maßstäbe: vom Feuchterand im Sockel über Stein und Fuge bis zur einzelnen Pore. Und was die Injektion der Horizontalsperre dort verändert."
          )}
        </p>
      </div>
      <CapillaryZoom />
    </section>
  );
}
