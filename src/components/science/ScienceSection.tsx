import type { ComponentType } from "react";
import { SCIENCE } from "@/data/science";
import { hy } from "@/lib/hyphenate";
import CapillaryZoom from "./CapillaryZoom";
import CausesHouse from "./CausesHouse";
import DewPointLab from "./DewPointLab";
import MoisturePatterns from "./MoisturePatterns";
import NegativeSeal from "./NegativeSeal";
import CrackInjection from "./CrackInjection";

const VISUALS: Record<string, { Visual: ComponentType; padded: boolean }> = {
  horizontalsperre: { Visual: CapillaryZoom, padded: false },
  kellersanierung: { Visual: CausesHouse, padded: false },
  schimmelbeseitigung: { Visual: DewPointLab, padded: true },
  feuchtemessung: { Visual: MoisturePatterns, padded: true },
  kellerinnenabdichtung: { Visual: NegativeSeal, padded: false },
  rissverpressung: { Visual: CrackInjection, padded: false },
};

/** The service area's science chapter: keyword H2, intro, then the layer-by-layer visual. */
export default function ScienceSection({ slug }: { slug: string }) {
  const chapter = SCIENCE[slug];
  const entry = VISUALS[slug];
  if (!chapter || !entry) return null;
  const { Visual, padded } = entry;
  return (
    <section className="science border-t border-line/10" aria-labelledby={`science-${slug}`}>
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-16 sm:px-8 sm:pt-24">
        <p className="sc-label">Wissen, Schicht für Schicht</p>
        <h2 id={`science-${slug}`} className="sc-display mt-3 max-w-4xl text-4xl sm:text-5xl lg:text-6xl">
          {chapter.heading}
        </h2>
        <p className="sc-body mt-5 max-w-2xl">{hy(chapter.intro)}</p>
      </div>
      {padded ? (
        <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-8">
          <Visual />
        </div>
      ) : (
        <Visual />
      )}
    </section>
  );
}
