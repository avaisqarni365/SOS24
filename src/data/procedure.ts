/**
 * The remediation procedure as the 3D house shows it, step by step. Each step
 * names the material or tool, what is done, which layer it concerns, and the
 * state the 3D model animates to. Wording follows SchimmelPeter's own
 * description of the injection method (paraffin-dissolved polymer, holes up
 * to 20 cm apart, the wall stays diffusion-open).
 */
export interface ModelState {
  /** 1 = wet up to the salt line, 0 = dry above the barrier */
  damp: number;
  packers: number;
  barrier: number;
  seal: number;
  plaster: number;
  board: number;
  /** 0 = assembled wall, 1 = layers fanned apart */
  explode: number;
}

export interface ProcedureStep {
  id: string;
  title: string;
  material: string;
  text: string;
  layer: string;
  focus: "house" | "wall" | "explode";
  state: ModelState;
}

const S = (s: Partial<ModelState>): ModelState => ({
  damp: 0,
  packers: 0,
  barrier: 0,
  seal: 0,
  plaster: 0,
  board: 0,
  explode: 0,
  ...s,
});

export const PROCEDURE: ProcedureStep[] = [
  {
    id: "befund",
    title: "Befund und Feuchtemessung",
    material: "Kapazitives Messgerät, CM- oder Darr-Probe aus der Tiefe, Salzanalyse",
    text: "Wir messen an festen Punkten in mehreren Höhen. Das Muster zeigt, ob die Nässe von unten aufsteigt, von der Seite drückt oder als Kondensat entsteht. Hier: aufsteigende Feuchte bis zum Salzrand, Wasser am Boden.",
    layer: "mauerwerk",
    focus: "house",
    state: S({ damp: 1 }),
  },
  {
    id: "bohren",
    title: "Bohrlochkette und Packer",
    material: "Bohrungen im Abstand von bis zu 20 cm, Injektionspacker",
    text: "Knapp über dem Kellerboden wird eine durchgehende Reihe Bohrlöcher in die Wand gesetzt. In jedes Loch kommt ein Packer, über den das Mittel eingebracht wird. Aufgegraben wird nichts.",
    layer: "horizontalsperre",
    focus: "wall",
    state: S({ damp: 1, packers: 1 }),
  },
  {
    id: "injektion",
    title: "Horizontalsperre injizieren",
    material: "In Paraffin gelöster Kunststoff (SchimmelPeter-Injektion)",
    text: "Das Mittel verteilt sich in den Kapillaren und bildet eine durchgehende, wasserabweisende Sperre über die ganze Wanddicke. Die Wand bleibt diffusionsoffen, eine Vortrocknung ist meist nicht nötig.",
    layer: "horizontalsperre",
    focus: "wall",
    state: S({ damp: 1, packers: 1, barrier: 1 }),
  },
  {
    id: "trocknung",
    title: "Trocknung und Kontrollmessung",
    material: "Kontrollmessungen an denselben Messpunkten",
    text: "Die Sperre stoppt den Nachschub von unten. Oberhalb trocknet die Wand über Wochen aus, der Messpunkt unter der Sperre bleibt feucht und belegt die Trennwirkung. Die Packer werden entfernt, die Löcher verschlossen.",
    layer: "mauerwerk",
    focus: "wall",
    state: S({ barrier: 1 }),
  },
  {
    id: "abdichtung",
    title: "Innenabdichtung mit Hohlkehle",
    material: "Mineralische Dichtungsschlämme in zwei Lagen, Hohlkehle aus Sperrmörtel",
    text: "Gegen seitlich drückende Feuchte wird die Wand von innen abgedichtet. Die Hohlkehle am Übergang von Boden und Wand schließt die empfindlichste Stelle.",
    layer: "innenabdichtung",
    focus: "wall",
    state: S({ barrier: 1, seal: 1 }),
  },
  {
    id: "sanierputz",
    title: "Sanierputz",
    material: "Sanierputz-System aus Grund- und Oberputz",
    text: "Der Sanierputz nimmt Restsalze in seinen Poren auf und lässt die Wand weiter austrocknen, ohne dass neue Ausblühungen an die Oberfläche kommen.",
    layer: "sanierputz",
    focus: "wall",
    state: S({ barrier: 1, seal: 1, plaster: 1 }),
  },
  {
    id: "klimaplatte",
    title: "Klimaplatte und Anstrich",
    material: "Calciumsilikat-Platte, diffusionsoffener Anstrich",
    text: "Wo Kondensat droht, reguliert eine Calciumsilikat-Platte die Oberfläche. Sie ist kapillaraktiv und wirkt gegen Schimmel. Danach ist der Keller wieder nutzbar.",
    layer: "klimaplatte",
    focus: "wall",
    state: S({ barrier: 1, seal: 1, plaster: 1, board: 1 }),
  },
  {
    id: "schichten",
    title: "Alle Schichten im Überblick",
    material: "Erdreich, Mauerwerk, Horizontalsperre, Dichtungsschlämme, Sanierputz, Calciumsilikat",
    text: "Die fertige Kellerwand, auseinandergezogen: außen bleibt alles, wie es ist, jede Schicht innen hat eine Aufgabe. Klicken Sie eine Schicht an, um sie hervorzuheben.",
    layer: "horizontalsperre",
    focus: "explode",
    state: S({ barrier: 1, seal: 1, plaster: 1, board: 1, explode: 1 }),
  },
];
