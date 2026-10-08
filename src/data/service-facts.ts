import type { SceneId } from "./scenes3d";

/**
 * Per service page: the key figures (count up on the page) and which 3D
 * scenes explain the method. Figures follow the service texts and the
 * Nachweis example values; anything that depends on the object is marked
 * as an example.
 */
export const SERVICE_FACTS: Record<string, { value: string; label: string }[]> = {
  kellersanierung: [
    { value: "10 Jahre", label: "Garantie auf unsere Arbeit" },
    { value: "25 Jahre", label: "Produktgarantie von SchimmelPeter" },
    { value: "0", label: "Erdarbeiten bei der Sanierung von innen" },
    { value: "5", label: "Messhöhen, Protokoll nach jeder Phase" },
  ],
  horizontalsperre: [
    { value: "20 cm", label: "höchster Abstand der Bohrlöcher" },
    { value: "85 → 32 %", label: "Durchfeuchtung bei 30 cm, Nullmessung bis Abnahme (Beispiel)" },
    { value: "25 Jahre", label: "Produktgarantie von SchimmelPeter" },
    { value: "0", label: "Erdarbeiten, Garten und Einfahrt bleiben" },
  ],
  kellerinnenabdichtung: [
    { value: "2", label: "Lagen mineralische Dichtungsschlämme" },
    { value: "1", label: "Hohlkehle am Boden-Wand-Anschluss" },
    { value: "2", label: "Schichten Sanierputz: Grund- und Oberputz" },
    { value: "0", label: "Erdarbeiten: abgedichtet wird von innen" },
  ],
  schimmelbeseitigung: [
    { value: "12,6 °C", label: "kritische Oberflächentemperatur an der Wand" },
    { value: "9,3 °C", label: "Taupunkt bei 20 °C und 50 % Luftfeuchte" },
    { value: "10", label: "pH-Wert der Klimaplatte um 10: schimmelhemmend" },
    { value: "40–60 %", label: "Luftfeuchte im Raum als Ziel" },
  ],
  feuchtemessung: [
    { value: "5", label: "Messhöhen je Messpunkt, von 5 bis 150 cm" },
    { value: "3", label: "Verfahren: kapazitiv, CM-Methode, Darr-Methode" },
    { value: "105 °C", label: "Darr-Methode: Probe trocknen bis zur Massekonstanz" },
    { value: "1", label: "Protokoll für Sie nach jeder Messung" },
  ],
  rissverpressung: [
    { value: "2", label: "Harze: PU elastisch, Epoxid kraftschlüssig" },
    { value: "45°", label: "schräge Bohrungen zum Riss (typisch)" },
    { value: "0", label: "Packer bleiben nach dem Verpressen in der Wand" },
    { value: "100 %", label: "des Rissverlaufs vorab dokumentiert" },
  ],
  dachabdichtung: [
    { value: "2-lagig", label: "Bitumenbahnen, vollflächig verschweißt" },
    { value: "4", label: "Dacharten: Flach-, Steildach, Terrasse, Garage" },
    { value: "10 Jahre", label: "Garantie auf unsere Arbeit" },
    { value: "0", label: "offene Nähte nach der Abnahmeprüfung" },
  ],
  "balkon-terrasse": [
    { value: "0", label: "Nähte: Flüssigkunststoff dichtet fugenlos" },
    { value: "15 cm", label: "Aufkantung an Tür und Wandanschluss" },
    { value: "1,5 %", label: "Mindestgefälle zur Entwässerung" },
    { value: "10 Jahre", label: "Garantie auf unsere Arbeit" },
  ],
  sockelabdichtung: [
    { value: "30 cm", label: "Spritzwasserzone über Gelände, mindestens" },
    { value: "2", label: "Lagen Dickbeschichtung am Sockel" },
    { value: "10 Jahre", label: "Garantie auf unsere Arbeit" },
    { value: "0", label: "Erdarbeiten über die Sockelzone hinaus" },
  ],
};

export const SERVICE_SCENES: Record<string, SceneId[]> = {
  dachabdichtung: ["garage"],
  "balkon-terrasse": ["garage"],
  sockelabdichtung: ["keller-aussen"],
  kellersanierung: ["keller-innen", "keller-aussen"],
  horizontalsperre: ["keller-innen"],
  kellerinnenabdichtung: ["keller-innen", "keller-aussen"],
  schimmelbeseitigung: ["wohnraum"],
  feuchtemessung: ["keller-innen"],
  rissverpressung: ["garage"],
};
