/**
 * The four 3D scenes of the "Jeder Ort, Schicht für Schicht" viewer. Each
 * scene is a compact cut-away of one place (Keller inside, Keller outside,
 * garage, living room), its layers from outside to inside, and the
 * treatment as steps: material, what is done, and the model state the
 * viewer animates to. Wording follows SchimmelPeter's description of the
 * methods; nothing here promises more than the service pages do.
 */
export type SceneId = "keller-innen" | "keller-aussen" | "garage" | "wohnraum";

export interface SceneLayer {
  id: string;
  name: string;
  short: string;
  color: string;
  text: string;
}

/** A figure shown with a step: value (counts up when it starts with a number) and what it means. */
export interface SceneFact {
  value: string;
  label: string;
}

/** A measured value shown live on the stage (example values, labelled as such). */
export interface SceneReading {
  label: string;
  value: string;
  /** 0 = dry, 1 = wet: drives the little meter */
  level: number;
}

export interface SceneStep {
  id: string;
  title: string;
  material: string;
  text: string;
  layer: string;
  view: string;
  state: Record<string, number>;
  facts?: SceneFact[];
  reading?: SceneReading;
}

export interface SceneDef {
  id: SceneId;
  label: string;
  title: string;
  intro: string;
  service: { label: string; href: string };
  layers: SceneLayer[];
  steps: SceneStep[];
}

export const SCENES: SceneDef[] = [
  {
    id: "keller-innen",
    label: "Keller von innen",
    title: "Kellerwand von innen sanieren",
    intro:
      "Aufsteigende Feuchte im Keller: Horizontalsperre per Injektion, danach Abdichtung, Sanierputz und Klimaplatte von innen. Garten und Einfahrt bleiben unberührt.",
    service: { label: "Horizontalsperre", href: "/leistungen/horizontalsperre/" },
    layers: [
      { id: "erdreich", name: "Erdreich & Bodenfeuchte", short: "Erdreich", color: "#7a6146", text: "Das Wasser im Boden zieht kapillar ins Mauerwerk. Außen wird nicht gegraben." },
      { id: "mauerwerk", name: "Mauerwerk", short: "Mauerwerk", color: "#9a6b4b", text: "Ziegel, Bruchstein oder Beton. Wir messen vorher, wie tief und wie hoch die Nässe sitzt." },
      { id: "horizontalsperre", name: "Horizontalsperre", short: "Sperre", color: "#62c4ac", text: "Bohrlöcher im Abstand von bis zu 20 cm, gefüllt mit in Paraffin gelöstem Kunststoff. Die Wand bleibt diffusionsfähig." },
      { id: "innenabdichtung", name: "Innenabdichtung & Hohlkehle", short: "Abdichtung", color: "#8f9a96", text: "Mineralische Dichtungsschlämme mit Hohlkehle am Boden-Wand-Anschluss hält seitlich drückende Feuchte zurück." },
      { id: "sanierputz", name: "Sanierputz", short: "Sanierputz", color: "#d9d2c1", text: "Nimmt Restsalze auf und lässt die Wand weiter austrocknen, ohne neue Ausblühungen." },
      { id: "klimaplatte", name: "Calciumsilikat-Platte", short: "Klimaplatte", color: "#f3f1ec", text: "Kapillaraktiv und schimmelhemmend: reguliert die Oberfläche, wo Kondensat droht." },
    ],
    steps: [
      {
        id: "befund",
        title: "Befund und Feuchtemessung",
        material: "Kapazitives Messgerät, CM- oder Darr-Probe aus der Tiefe, Salzanalyse",
        text: "Wir messen an festen Punkten in mehreren Höhen. Hier: aufsteigende Feuchte bis zum Salzrand, Wasser am Boden, Schimmel in der kalten Ecke.",
        layer: "mauerwerk",
        view: "room",
        state: { damp: 1 },
        facts: [{ value: "5", label: "Messhöhen je Messpunkt, von 5 bis 150 cm" }, { value: "85 %", label: "Durchfeuchtung bei 30 cm (Beispiel)" }, { value: "0", label: "Erdarbeiten: der Garten bleibt unberührt" }],
        reading: { label: "Nullmessung · 30 cm", value: "85 %", level: 0.85 },
      },
      {
        id: "bohren",
        title: "Bohrlochkette und Packer",
        material: "Bohrungen im Abstand von bis zu 20 cm, Injektionspacker",
        text: "Knapp über dem Kellerboden entsteht eine durchgehende Reihe Bohrlöcher. In jedes Loch kommt ein Packer, über den das Mittel eingebracht wird.",
        layer: "horizontalsperre",
        view: "wall",
        state: { damp: 1, packers: 1 },
        facts: [{ value: "20 cm", label: "höchster Abstand der Bohrlöcher" }, { value: "15 cm", label: "Höhe der Sperre über dem Boden (Beispiel)" }, { value: "1", label: "Bohrlochkette über die ganze Wandlänge" }],
        reading: { label: "Nullmessung · 30 cm", value: "85 %", level: 0.85 },
      },
      {
        id: "injektion",
        title: "Horizontalsperre injizieren",
        material: "In Paraffin gelöster Kunststoff (SchimmelPeter-Injektion)",
        text: "Das Mittel verteilt sich in den Kapillaren und bildet eine durchgehende, wasserabweisende Sperre über die ganze Wanddicke. Eine Vortrocknung ist meist nicht nötig.",
        layer: "horizontalsperre",
        view: "wall",
        state: { damp: 1, packers: 1, barrier: 1 },
        facts: [{ value: "100 %", label: "Sollmenge je Abschnitt, Ist gegen Soll protokolliert" }, { value: "25 Jahre", label: "Produktgarantie von SchimmelPeter" }, { value: "0", label: "Bagger, Baugrube oder Erdarbeiten" }],
        reading: { label: "Nach der Injektion · 30 cm", value: "84 %", level: 0.84 },
      },
      {
        id: "trocknung",
        title: "Trocknung und Kontrollmessung",
        material: "Kontrollmessungen an denselben Messpunkten",
        text: "Oberhalb der Sperre trocknet die Wand über Wochen aus, der Messpunkt darunter bleibt feucht und belegt die Trennwirkung. Packer raus, Löcher zu.",
        layer: "mauerwerk",
        view: "wall",
        state: { barrier: 1 },
        facts: [{ value: "58 %", label: "Durchfeuchtung bei 30 cm nach einigen Wochen (Beispiel)" }, { value: "1", label: "Referenzpunkt unter der Sperre bleibt feucht" }, { value: "5", label: "Messhöhen, immer dieselben Punkte" }],
        reading: { label: "Kontrollmessung · 30 cm", value: "58 %", level: 0.58 },
      },
      {
        id: "abdichtung",
        title: "Innenabdichtung mit Hohlkehle",
        material: "Mineralische Dichtungsschlämme in zwei Lagen, Hohlkehle aus Sperrmörtel",
        text: "Gegen seitlich drückende Feuchte wird die Wand von innen abgedichtet. Die Hohlkehle schließt den Übergang von Boden und Wand.",
        layer: "innenabdichtung",
        view: "wall",
        state: { barrier: 1, seal: 1 },
        facts: [{ value: "2", label: "Lagen mineralische Dichtungsschlämme" }, { value: "1", label: "Hohlkehle am Boden-Wand-Anschluss" }, { value: "32 %", label: "Durchfeuchtung bei 30 cm zur Abnahme (Beispiel)" }],
        reading: { label: "Abnahme · 30 cm", value: "32 %", level: 0.32 },
      },
      {
        id: "sanierputz",
        title: "Sanierputz",
        material: "Sanierputz-System aus Grund- und Oberputz",
        text: "Der Sanierputz nimmt Restsalze in seinen Poren auf und lässt die Wand weiter austrocknen, ohne dass neue Ausblühungen durchschlagen.",
        layer: "sanierputz",
        view: "wall",
        state: { barrier: 1, seal: 1, plaster: 1 },
        facts: [{ value: "2", label: "Schichten: Grund- und Oberputz" }, { value: "0", label: "neue Ausblühungen: der Putz lagert Salze ein" }, { value: "32 %", label: "Durchfeuchtung bei 30 cm zur Abnahme (Beispiel)" }],
        reading: { label: "Abnahme · 30 cm", value: "32 %", level: 0.32 },
      },
      {
        id: "klimaplatte",
        title: "Klimaplatte und Anstrich",
        material: "Calciumsilikat-Platte, diffusionsoffener Anstrich",
        text: "Wo Kondensat droht, reguliert eine Calciumsilikat-Platte die Oberfläche. Der Keller ist wieder trocken und nutzbar.",
        layer: "klimaplatte",
        view: "room",
        state: { barrier: 1, seal: 1, plaster: 1, board: 1 },
        facts: [{ value: "10", label: "pH-Wert um 10: alkalisch, schimmelhemmend" }, { value: "1", label: "Platte, kapillaraktiv, vollflächig verklebt" }, { value: "10 Jahre", label: "Garantie auf unsere Arbeit" }],
      },
      {
        id: "schichten",
        title: "Alle Schichten im Überblick",
        material: "Erdreich, Mauerwerk, Horizontalsperre, Dichtungsschlämme, Sanierputz, Calciumsilikat",
        text: "Die fertige Kellerwand, auseinandergezogen. Klicken Sie eine Schicht an, um sie hervorzuheben.",
        layer: "horizontalsperre",
        view: "explode",
        state: { barrier: 1, seal: 1, plaster: 1, board: 1, explode: 1 },
        facts: [{ value: "6", label: "Schichten von außen nach innen" }, { value: "10 Jahre", label: "Garantie auf die Arbeit" }, { value: "25 Jahre", label: "Produktgarantie von SchimmelPeter" }],
      },
    ],
  },
  {
    id: "keller-aussen",
    label: "Keller von außen",
    title: "Kellerwand von außen abdichten",
    intro:
      "Drückt Wasser von außen gegen die Wand, kann eine Außenabdichtung mit Drainage die richtige Lösung sein. Ob innen oder außen, entscheidet die Messung.",
    service: { label: "Kellersanierung", href: "/leistungen/kellersanierung/" },
    layers: [
      { id: "mauerwerk", name: "Mauerwerk", short: "Mauerwerk", color: "#9a6b4b", text: "Die Außenseite der Kellerwand, bis zum Fundament freigelegt." },
      { id: "grundierung", name: "Reinigung & Kratzspachtelung", short: "Grundierung", color: "#b7b2a6", text: "Die Wand wird gereinigt, Fugen und Fehlstellen geschlossen, damit die Abdichtung vollflächig haftet." },
      { id: "abdichtung", name: "Dickbeschichtung", short: "Abdichtung", color: "#26292b", text: "Kunststoffmodifizierte Bitumendickbeschichtung in zwei Lagen, mit Hohlkehle am Fundament." },
      { id: "schutz", name: "Schutzschicht", short: "Schutz", color: "#4b5157", text: "Noppenbahn oder Schutzplatte schützt die Abdichtung beim Verfüllen und leitet Wasser nach unten ab." },
      { id: "drainage", name: "Drainage", short: "Drainage", color: "#e3a33b", text: "Drainagerohr im Kiesbett, mit Filtervlies umhüllt, führt Sickerwasser vom Fundament weg." },
      { id: "erdreich", name: "Verfüllung", short: "Erdreich", color: "#7a6146", text: "Zum Schluss wird die Baugrube lagenweise wieder verfüllt." },
    ],
    steps: [
      {
        id: "befund",
        title: "Befund: Wasser drückt von außen",
        material: "Feuchtemessung innen und außen, Blick auf Gelände, Fallrohre und Drainage",
        text: "Die Wand ist in ganzer Höhe nass, besonders an der Seite zum Hang. Das Muster zeigt Wasser, das von außen gegen die Wand drückt.",
        layer: "mauerwerk",
        view: "overview",
        state: { damp: 1 },
        facts: [{ value: "1", label: "Messung innen und außen vor jeder Empfehlung" }, { value: "seitlich", label: "drückt das Wasser gegen die Wand" }],
        reading: { label: "Messung innen · 30 cm", value: "85 %", level: 0.85 },
      },
      {
        id: "freilegen",
        title: "Wand freilegen",
        material: "Baugrube entlang der Wand bis zum Fundament",
        text: "Die Kellerwand wird außen abschnittsweise freigelegt. So lassen sich Zustand und Ursache direkt am Mauerwerk prüfen.",
        layer: "mauerwerk",
        view: "trench",
        state: { damp: 1, dig: 1 },
        facts: [{ value: "1", label: "Baugrube entlang der Wand bis zum Fundament" }, { value: "100 %", label: "der Wandfläche liegt frei" }],
      },
      {
        id: "grundierung",
        title: "Reinigen und Kratzspachtelung",
        material: "Reinigung, Fugen schließen, Kratzspachtelung",
        text: "Lose Teile und alte Anstriche kommen ab, Fehlstellen werden geschlossen. Die Kratzspachtelung ebnet den Untergrund für die Abdichtung.",
        layer: "grundierung",
        view: "trench",
        state: { damp: 0.5, dig: 1, prime: 1 },
        facts: [{ value: "1", label: "Kratzspachtelung schließt Poren und Fugen" }, { value: "0", label: "lose Teile bleiben auf der Wand" }],
      },
      {
        id: "abdichtung",
        title: "Abdichtung in zwei Lagen",
        material: "Kunststoffmodifizierte Bitumendickbeschichtung, Hohlkehle am Fundament",
        text: "Die Dickbeschichtung wird in zwei Lagen aufgebracht und bildet eine geschlossene, wasserdichte Haut vom Fundament bis über die Geländeoberkante.",
        layer: "abdichtung",
        view: "trench",
        state: { dig: 1, prime: 1, coat: 1 },
        facts: [{ value: "2", label: "Lagen Bitumendickbeschichtung" }, { value: "1", label: "Hohlkehle am Fundament" }],
      },
      {
        id: "schutz",
        title: "Schutzschicht",
        material: "Noppenbahn oder Schutzplatte",
        text: "Eine Noppenbahn schützt die frische Abdichtung vor Steinen beim Verfüllen und lässt Sickerwasser nach unten ablaufen.",
        layer: "schutz",
        view: "trench",
        state: { dig: 1, prime: 1, coat: 1, protect: 1 },
        facts: [{ value: "1", label: "Noppenbahn oder Schutzplatte vor der Abdichtung" }],
      },
      {
        id: "drainage",
        title: "Drainage am Fundament",
        material: "Drainagerohr im Kiesbett, Filtervlies",
        text: "Am Fundament liegt das Drainagerohr im Kies, umhüllt von Filtervlies. Es sammelt Sickerwasser und leitet es ab, bevor es sich an der Wand staut.",
        layer: "drainage",
        view: "trench",
        state: { dig: 1, prime: 1, coat: 1, protect: 1, drain: 1 },
        facts: [{ value: "1", label: "Drainagerohr im Kiesbett, mit Filtervlies" }, { value: "0", label: "Stauwasser am Fundament" }],
      },
      {
        id: "verfuellen",
        title: "Verfüllen",
        material: "Lagenweise Verfüllung",
        text: "Die Baugrube wird wieder geschlossen. Die Wand trocknet nun von außen geschützt aus.",
        layer: "erdreich",
        view: "overview",
        state: { prime: 1, coat: 1, protect: 1, drain: 1 },
        facts: [{ value: "lagenweise", label: "verfüllt und verdichtet" }],
      },
      {
        id: "schichten",
        title: "Alle Schichten im Überblick",
        material: "Mauerwerk, Kratzspachtelung, Dickbeschichtung, Noppenbahn, Drainage, Verfüllung",
        text: "Der Wandaufbau außen, auseinandergezogen. Klicken Sie eine Schicht an, um sie hervorzuheben.",
        layer: "abdichtung",
        view: "explode",
        state: { dig: 1, prime: 1, coat: 1, protect: 1, drain: 1, explode: 1 },
        facts: [{ value: "6", label: "Schichten von der Wand bis zum Erdreich" }],
      },
    ],
  },
  {
    id: "garage",
    label: "Garage & Beton",
    title: "Wasserführenden Riss verpressen",
    intro:
      "Ein Riss in der Betonwand von Garage, Tiefgarage oder Keller, durch den Wasser dringt, lässt sich von innen dauerhaft verpressen, ohne die Wand zu öffnen.",
    service: { label: "Rissverpressung", href: "/leistungen/rissverpressung/" },
    layers: [
      { id: "beton", name: "Betonwand", short: "Beton", color: "#9ea3a0", text: "Tragende Wand aus Beton. Wir prüfen Verlauf, Breite und Wasserführung des Risses." },
      { id: "riss", name: "Wasserführender Riss", short: "Riss", color: "#3b6ea8", text: "Der Riss geht durch die ganze Wand. Wasser von außen sickert hindurch und läuft innen ab." },
      { id: "packer", name: "Injektionspacker", short: "Packer", color: "#b9c2c0", text: "Schräg gebohrt, wechselseitig zum Riss, damit jede Bohrung den Riss in der Wandmitte trifft." },
      { id: "harz", name: "Injektionsharz", short: "Harz", color: "#e8b04c", text: "Polyurethan-Harz dichtet wasserführende Risse elastisch ab, Epoxidharz verbindet kraftschlüssig. Die Wahl richtet sich nach dem Riss." },
    ],
    steps: [
      {
        id: "befund",
        title: "Befund am Riss",
        material: "Rissbreite, Verlauf, Feuchte und Wasserführung",
        text: "Der Riss zieht sich schräg durch die Wand, darunter läuft Wasser ab und sammelt sich auf dem Boden. Wir prüfen, ob er noch arbeitet.",
        layer: "riss",
        view: "wall",
        state: { wet: 1 },
        facts: [{ value: "1", label: "Riss, der durch die ganze Wand geht" }, { value: "100 %", label: "des Rissverlaufs dokumentiert" }],
        reading: { label: "Riss · Wasserführung", value: "nass", level: 0.9 },
      },
      {
        id: "bohren",
        title: "Bohren und Packer setzen",
        material: "Schräge Bohrungen, wechselseitig zum Riss, Injektionspacker",
        text: "Entlang des Risses werden Löcher schräg in die Wand gebohrt, abwechselnd links und rechts, und mit Packern versehen.",
        layer: "packer",
        view: "close",
        state: { wet: 1, packers: 1 },
        facts: [{ value: "45°", label: "schräge Bohrungen zum Riss (typisch)" }, { value: "2", label: "Seiten: wechselseitig links und rechts" }],
        reading: { label: "Riss · Wasserführung", value: "nass", level: 0.9 },
      },
      {
        id: "injektion",
        title: "Harz injizieren",
        material: "Polyurethan- oder Epoxidharz, Niederdruck-Injektion",
        text: "Von unten nach oben wird das Harz Packer für Packer eingepresst, bis es am nächsten Packer austritt. So füllt es den Riss über die ganze Wanddicke.",
        layer: "harz",
        view: "close",
        state: { wet: 0.6, packers: 1, resin: 1 },
        facts: [{ value: "2", label: "Harze: PU elastisch, EP kraftschlüssig" }, { value: "100 %", label: "des Risses von innen gefüllt" }],
        reading: { label: "Riss · Wasserführung", value: "stoppt", level: 0.4 },
      },
      {
        id: "abschluss",
        title: "Packer entfernen, Oberfläche schließen",
        material: "Mörtel, bei Bedarf Beschichtung",
        text: "Nach dem Aushärten kommen die Packer heraus, die Bohrlöcher werden verschlossen. Die Wand ist wieder dicht, der Boden trocknet ab.",
        layer: "beton",
        view: "wall",
        state: { resin: 1, finish: 1 },
        facts: [{ value: "0", label: "Packer bleiben in der Wand" }, { value: "0", label: "sichtbare Bohrlöcher nach dem Verschließen" }],
        reading: { label: "Riss · Wasserführung", value: "trocken", level: 0.05 },
      },
    ],
  },
  {
    id: "wohnraum",
    label: "Wohnraum",
    title: "Schimmel in der Raumecke",
    intro:
      "Schimmel an der Außenwand entsteht oft an kalten Ecken, wo Raumfeuchte kondensiert. Erst die Ursache, dann die Beseitigung.",
    service: { label: "Schimmelbeseitigung", href: "/leistungen/schimmelbeseitigung/" },
    layers: [
      { id: "aussenwand", name: "Außenwand", short: "Außenwand", color: "#d9d2c1", text: "Außenwand mit kalter Ecke: dort sinkt die Oberflächentemperatur unter den kritischen Wert." },
      { id: "schimmel", name: "Schimmelbefall", short: "Schimmel", color: "#223024", text: "Befallene Flächen werden fachgerecht entfernt, nicht nur überstrichen." },
      { id: "klimaplatte", name: "Calciumsilikat-Platte", short: "Klimaplatte", color: "#f3f1ec", text: "Hebt die Oberflächentemperatur an, nimmt Feuchte auf und gibt sie wieder ab. Alkalisch und damit schimmelhemmend." },
      { id: "anstrich", name: "Diffusionsoffener Anstrich", short: "Anstrich", color: "#ffffff", text: "Ein Anstrich, der die Platte atmen lässt. Keine dichten Dispersionsfarben." },
    ],
    steps: [
      {
        id: "befund",
        title: "Befund: kalte Ecke",
        material: "Oberflächentemperatur, relative Luftfeuchte, Taupunkt",
        text: "Wir messen die Oberflächentemperatur in der Ecke und die Luftfeuchte im Raum. Liegt die Ecke unter dem kritischen Wert, bildet sich dort Feuchte und Schimmel.",
        layer: "aussenwand",
        view: "room",
        state: { mould: 1, cold: 1 },
        facts: [{ value: "9,3 °C", label: "Taupunkt bei 20 °C und 50 % Luftfeuchte" }, { value: "12,6 °C", label: "kritische Oberflächentemperatur (80 % rF an der Wand)" }, { value: "11,8 °C", label: "gemessen in der Ecke (Beispiel)" }],
        reading: { label: "Ecke · Oberfläche", value: "11,8 °C", level: 0.85 },
      },
      {
        id: "entfernen",
        title: "Schimmel fachgerecht entfernen",
        material: "Abtrag befallener Beschichtungen, Reinigung, Desinfektion",
        text: "Befallene Tapeten und Putzschichten werden abgetragen, die Fläche gereinigt. Überstreichen allein löst das Problem nicht.",
        layer: "schimmel",
        view: "corner",
        state: { mould: 0, cold: 1, strip: 1 },
        facts: [{ value: "100 %", label: "der befallenen Fläche abgetragen" }, { value: "0", label: "Überstreichen: das allein löst nichts" }],
        reading: { label: "Ecke · Oberfläche", value: "11,8 °C", level: 0.85 },
      },
      {
        id: "klimaplatte",
        title: "Klimaplatte an der kalten Wand",
        material: "Calciumsilikat-Platten, vollflächig verklebt",
        text: "Die Platten heben die Oberflächentemperatur an und puffern Feuchte. Die Ecke ist nicht länger der kälteste Punkt im Raum.",
        layer: "klimaplatte",
        view: "corner",
        state: { cold: 0.2, strip: 1, board: 1 },
        facts: [{ value: "10", label: "pH-Wert um 10: alkalisch, schimmelhemmend" }, { value: "14,2 °C", label: "in der Ecke nach der Sanierung (Beispiel)" }],
        reading: { label: "Ecke · Oberfläche", value: "14,2 °C", level: 0.3 },
      },
      {
        id: "anstrich",
        title: "Anstrich und richtig lüften",
        material: "Diffusionsoffener Anstrich; Stoßlüften, gleichmäßig heizen",
        text: "Ein diffusionsoffener Anstrich schließt ab. Dazu gehört regelmäßiges Stoßlüften, damit die Raumfeuchte nicht dauerhaft hoch bleibt.",
        layer: "anstrich",
        view: "room",
        state: { strip: 1, board: 1, paint: 1 },
        facts: [{ value: "40–60 %", label: "Luftfeuchte im Raum als Ziel" }, { value: "3–4 ×", label: "am Tag 5 bis 10 Minuten stoßlüften" }],
        reading: { label: "Ecke · Oberfläche", value: "14,2 °C", level: 0.25 },
      },
    ],
  },
];
