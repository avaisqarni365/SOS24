import HouseViewer3D from "./HouseViewer3D";
import { SCENES } from "@/data/scenes3d";
import { hy } from "@/lib/hyphenate";

export default function LayersAct() {
  const scenes = SCENES.map((sc) => ({
    ...sc,
    intro: hy(sc.intro),
    layers: sc.layers.map((l) => ({ ...l, text: hy(l.text) })),
    steps: sc.steps.map((st) => ({ ...st, text: hy(st.text), material: hy(st.material) })),
  }));
  return (
    <section
      id="schicht-fuer-schicht"
      className="sc-section viewer-sec band-stone"
      aria-labelledby="layers-title"
      data-sc-act="flow"
    >
      <div className="sc-wrap">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="sc-label">Das Verfahren in 3D</p>
            <h2 id="layers-title" className="sc-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
              Jeder Ort, <em className="text-[var(--mint)]">Schicht für Schicht.</em>
            </h2>
          </div>
          <p className="sc-body">
            {hy(
              "Keller von innen, Keller von außen, Garage und Wohnraum: Wählen Sie den Ort und gehen Sie die Sanierung Schritt für Schritt durch. Jeder Schritt zeigt im Bild, welche Schicht entsteht, dazu Material und Ausführung. Mit „In 3D drehen“ lädt das Modell, das Sie dann in alle Richtungen drehen können."
            )}
          </p>
        </div>
        <div className="mt-10">
          <HouseViewer3D scenes={scenes} />
        </div>
        <p className="mt-4 text-xs text-[var(--sc-ink-soft)]">
          {hy("Schematische Darstellung. Welches Verfahren Ihr Objekt braucht, entscheidet die Messung vor Ort.")}
        </p>
      </div>
    </section>
  );
}
