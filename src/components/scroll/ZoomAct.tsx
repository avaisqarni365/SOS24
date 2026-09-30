import CapillaryZoom from "@/components/science/CapillaryZoom";
import { hy } from "@/lib/hyphenate";

/**
 * Second frame of the homepage: the hero zooms into the salt rim of the
 * Keller, this act carries on from the wall photo down to one pore wall.
 */
export default function ZoomAct() {
  return (
    <section id="vom-keller-zur-pore" className="zoom-act theme-dark bg-[var(--ink)]" aria-labelledby="zoom-title">
      <div className="sc-wrap zoom-act__head">
        <p className="sc-label">Warum der Keller nass wird</p>
        <h2 id="zoom-title" className="sc-display mt-3 max-w-4xl text-4xl sm:text-5xl lg:text-6xl">
          Vom Keller <em className="text-[var(--mint)]">bis in die Pore.</em>
        </h2>
        <p className="sc-body mt-5 max-w-2xl">
          {hy(
            "Scrollen Sie in die Wand hinein: vom Feuchterand im Sockel über Stein und Fuge bis zur einzelnen Pore. Und was die Injektion der Horizontalsperre dort verändert."
          )}
        </p>
      </div>
      <CapillaryZoom />
    </section>
  );
}
