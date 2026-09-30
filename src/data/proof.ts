/**
 * "Nachweis, Phase für Phase": how each phase of a wall remediation is
 * confirmed by measurement. Values are schematic example values
 * (Durchfeuchtungsgrad in %, per measuring height), labelled as such on the
 * page. They follow the physics of a horizontal barrier: the barrier stops the
 * supply, the wall above then dries over time, and a reference point below the
 * barrier stays wet.
 */
export const HEIGHTS_CM = [5, 30, 60, 100, 150];
export const BARRIER_CM = 15;

export interface ProofPhase {
  id: string;
  n: number;
  title: string;
  when: string;
  measure: string;
  proof: string;
  criterion: string;
  /** Durchfeuchtungsgrad in % at HEIGHTS_CM (example values) */
  values: number[];
}

const NULL = [92, 85, 70, 45, 18];

export const PHASES: ProofPhase[] = [
  {
    id: "befund",
    n: 1,
    title: "Befund und Nullmessung",
    when: "Vor jedem Eingriff",
    measure:
      "Feste Messpunkte in fünf Höhen, markiert und fotografiert. Kapazitive Übersicht über die Fläche, dazu Proben aus der Tiefe per CM- oder Darr-Methode und eine Salzanalyse.",
    proof: "Messpunktplan und Feuchteprofil (Nullmessung)",
    criterion:
      "Die Ursache ist eindeutig: Die Feuchte nimmt gleichmäßig nach unten zu, das Muster kapillar aufsteigender Feuchte.",
    values: NULL,
  },
  {
    id: "plan",
    n: 2,
    title: "Sanierungsplan und Sollmenge",
    when: "Vor Beginn der Arbeiten",
    measure:
      "Wanddicke, Wandlänge und Baustoff bestimmen die Injektionsmenge. Das Bohrraster mit bis zu 20 cm Abstand und die Zielwerte für die Abnahme werden festgelegt.",
    proof: "Sanierungsplan mit Sollmenge je Meter und verbindliches Angebot",
    criterion: "Jede Position im Angebot lässt sich auf einen Messwert der Nullmessung zurückführen.",
    values: NULL,
  },
  {
    id: "injektion",
    n: 3,
    title: "Injektion nach Plan",
    when: "Ausführung",
    measure:
      "Bohrungen nach Raster, Einbringen der berechneten Menge des in Paraffin gelösten Kunststoffs, Verbrauch je Wandabschnitt notiert.",
    proof: "Injektionsprotokoll: Ist-Menge gegen Soll-Menge, Fotos der Bohrlochkette",
    criterion:
      "Der Ist-Verbrauch entspricht dem berechneten Bedarf. Die Wand ist danach noch feucht: Die Sperre stoppt den Nachschub, das gespeicherte Wasser muss erst verdunsten.",
    values: [92, 84, 69, 44, 18],
  },
  {
    id: "trocknung",
    n: 4,
    title: "Trocknung und Kontrollmessung",
    when: "In Abständen über Wochen bis Monate",
    measure: "Kontrollmessungen an denselben Punkten, mit demselben Verfahren, in festen Abständen.",
    proof: "Messreihe über die Zeit",
    criterion:
      "Oberhalb der Sperre fallen die Werte von Messung zu Messung. Der Punkt unterhalb der Sperre bleibt feucht: Er zeigt, dass die Sperre trennt.",
    values: [90, 58, 40, 26, 15],
  },
  {
    id: "abnahme",
    n: 5,
    title: "Vergleichsmessung und Abnahme",
    when: "Abschluss",
    measure: "Vergleichsmessung an allen Punkten der Nullmessung, gemeinsame Begehung der sanierten Flächen.",
    proof: "Abnahmeprotokoll mit Vorher-nachher-Werten, von beiden Seiten unterschrieben",
    criterion: "Die im Sanierungsplan festgelegten Zielwerte sind erreicht. Erst dann folgt der Sanierputz auf trockenem Grund.",
    values: [89, 32, 24, 18, 14],
  },
];

/** The four rules that make the result reproducible, in the language of a lab. */
export const RULES = [
  { title: "Nullmessung vor dem Eingriff", text: "Ohne Ausgangswert gibt es keinen Vergleich. Gemessen wird, bevor gebohrt wird." },
  { title: "Gleiche Punkte, gleiches Verfahren", text: "Nur Messungen an denselben markierten Punkten mit derselben Methode sind vergleichbar." },
  { title: "Ein Referenzpunkt", text: "Ein Messpunkt unterhalb der Sperre bleibt bewusst im feuchten Bereich und belegt die Trennwirkung." },
  { title: "Jedes Protokoll für Sie", text: "Messwerte, Mengen und Abnahme stehen im Protokoll, und Sie erhalten es immer schriftlich, nach jeder Phase." },
];
