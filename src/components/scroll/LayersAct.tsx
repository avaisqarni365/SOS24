import type { ReactNode } from "react";
import HouseViewer3D from "./HouseViewer3D";
import { SCENES, type SceneId } from "@/data/scenes3d";
import { hy } from "@/lib/hyphenate";

/**
 * The 3D section: the homepage shows all four places; a service page passes
 * the scenes that explain its method, with its own heading.
 */
export default function LayersAct({
  ids,
  id = "schicht-fuer-schicht",
  label = "Das Verfahren in 3D",
  title = (
    <>
      Jeder Ort, <em className="text-[var(--mint)]">Schicht für Schicht.</em>
    </>
  ),
  intro = "Wohnraum, Keller von innen, Keller von außen und Garage: Wählen Sie den Ort und gehen Sie die Sanierung Schritt für Schritt durch. Jeder Schritt zeigt im Bild, welche Schicht entsteht, mit Material, Zahlen und Messwerten. Mit „In 3D drehen“ lädt das Modell, das Sie dann in alle Richtungen drehen können.",
}: {
  ids?: SceneId[];
  id?: string;
  label?: string;
  title?: ReactNode;
  intro?: string;
}) {
  // homepage order: the living room first, then the Keller, garage last
  const order: SceneId[] = ids ?? ["wohnraum", "keller-innen", "keller-aussen", "garage"];
  const scenes = order.map((i) => SCENES.find((s) => s.id === i)!).filter(Boolean).map((sc) => ({
    ...sc,
    intro: hy(sc.intro),
    layers: sc.layers.map((l) => ({ ...l, text: hy(l.text) })),
    steps: sc.steps.map((st) => ({ ...st, text: hy(st.text), material: hy(st.material) })),
  }));
  return (
    <section id={id} className="sc-section viewer-sec border-t border-line/10" aria-labelledby={`${id}-title`} data-sc-act="flow">
      <div className="sc-wrap">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="sc-label">{label}</p>
            <h2 id={`${id}-title`} className="sc-display mt-3">
              {title}
            </h2>
          </div>
          <p className="sc-body">{hy(intro)}</p>
        </div>
        <div className="mt-8">
          <HouseViewer3D scenes={scenes} />
        </div>
        <p className="mt-4 text-xs text-[var(--sc-ink-soft)]">
          {hy("Schematische Darstellung; Zahlen mit dem Hinweis Beispiel sind Beispielwerte. Welches Verfahren Ihr Objekt braucht, entscheidet die Messung vor Ort.")}
        </p>
      </div>
    </section>
  );
}
