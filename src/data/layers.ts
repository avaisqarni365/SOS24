/** The basement wall, outside to inside. Drives the 3D scene, its static poster and the list. */
export interface WallLayer {
  id: string;
  name: string;
  short: string;
  text: string;
  color: string;
  /** thickness in metres, used by the 3D scene */
  t: number;
}

export const WALL_LAYERS: WallLayer[] = [
  {
    id: "erdreich",
    name: "Erdreich & Bodenfeuchte",
    short: "Erdreich",
    text: "Das Wasser im Boden zieht kapillar ins Mauerwerk. Hier wird nicht gegraben: Einfahrt und Garten bleiben, wie sie sind.",
    color: "#7a6146",
    t: 0.7,
  },
  {
    id: "mauerwerk",
    name: "Mauerwerk",
    short: "Mauerwerk",
    text: "Ziegel, Bruchstein oder Beton. Der Bestand bleibt. Wir messen vorher, wie tief und wie hoch die Nässe sitzt.",
    color: "#9a6b4b",
    t: 0.42,
  },
  {
    id: "horizontalsperre",
    name: "Horizontalsperre",
    short: "Sperre",
    text: "Bohrlöcher im Abstand von bis zu 20 cm, gefüllt mit in Paraffin gelöstem Kunststoff. Er legt sich wasserabweisend an die Kapillaren, die Wand bleibt diffusionsfähig.",
    color: "#62c4ac",
    t: 0.42,
  },
  {
    id: "innenabdichtung",
    name: "Innenabdichtung",
    short: "Abdichtung",
    text: "Mineralische Dichtungsschlämme mit Hohlkehle am Boden-Wand-Anschluss hält seitlich drückendes Wasser zurück.",
    color: "#8f9a96",
    t: 0.05,
  },
  {
    id: "sanierputz",
    name: "Sanierputz",
    short: "Sanierputz",
    text: "Nimmt Restsalze auf und lässt die Wand weiter austrocknen, ohne dass neue Ausblühungen durchschlagen.",
    color: "#d9d2c1",
    t: 0.06,
  },
  {
    id: "klimaplatte",
    name: "Calciumsilikat & Raum",
    short: "Klimaplatte",
    text: "Wo Kondensat droht, reguliert eine Calciumsilikat-Platte die Oberfläche. Der Keller wird wieder nutzbar.",
    color: "#f3f1ec",
    t: 0.05,
  },
];
