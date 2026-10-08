import { CHEMISTRY } from "@/data/chemistry";

/**
 * What we bring to the job: the measuring instruments and the materials,
 * each tied to the service it serves. The "how it works" texts come from
 * the chemistry data, so the showcase and the Lab never disagree.
 */
export type KitArt =
  | "meter"
  | "cm"
  | "thermal"
  | "injection"
  | "cream"
  | "slurry"
  | "resin"
  | "plaster"
  | "membrane"
  | "liquid"
  | "kmb"
  | "board";

export interface KitItem {
  id: string;
  kind: "Messtechnik" | "Material";
  name: string;
  /** one line on the card */
  short: string;
  /** what it is, in the quick view */
  what: string;
  /** how it works on site */
  how: string;
  equation?: string;
  services: { slug: string; title: string }[];
  art: KitArt;
}

const chem = (slug: string) => CHEMISTRY.find((c) => c.slug === slug);
const intro = (slug: string) => chem(slug)?.intro ?? "";
const firstEq = (slug: string) => chem(slug)?.reactions[0]?.equation;

const S = {
  messung: { slug: "feuchtemessung", title: "Feuchtemessung & Gutachten" },
  sperre: { slug: "horizontalsperre", title: "Horizontalsperre" },
  innen: { slug: "kellerinnenabdichtung", title: "Keller von innen abdichten" },
  riss: { slug: "rissverpressung", title: "Rissverpressung" },
  schimmel: { slug: "schimmelbeseitigung", title: "Schimmelbeseitigung" },
  keller: { slug: "kellersanierung", title: "Kellersanierung" },
  dach: { slug: "dachabdichtung", title: "Dachabdichtung" },
  balkon: { slug: "balkon-terrasse", title: "Balkon & Terrasse" },
  sockel: { slug: "sockelabdichtung", title: "Sockelabdichtung" },
};

export const KIT: KitItem[] = [
  {
    id: "feuchtemessgeraet",
    kind: "Messtechnik",
    name: "Feuchtemessgerät",
    short: "Feuchte im Baustoff, an fünf Höhen je Messpunkt",
    what: "Das Gerät misst, wie stark die Wand ein elektrisches Feld verändert. Nasses Mauerwerk zeigt einen anderen Wert als trockenes, ohne dass gebohrt wird.",
    how: "Wir messen je Messpunkt in fünf Höhen, von 5 bis 150 cm. Das Profil verrät die Ursache: Feuchte, die nach oben abnimmt, steigt aus dem Boden auf; gleichmäßige Werte deuten auf Kondensat oder Salze.",
    services: [S.messung, S.sperre],
    art: "meter",
  },
  {
    id: "cm-messkoffer",
    kind: "Messtechnik",
    name: "CM-Messkoffer",
    short: "Der belastbare Wert, in Masseprozent",
    what: "Eine Bohrmehlprobe kommt zusammen mit Calciumcarbid in eine Stahlflasche. Das Manometer auf der Flasche zeigt den Gasdruck: das ist der Feuchtegehalt.",
    how: intro("feuchtemessung"),
    equation: firstEq("feuchtemessung"),
    services: [S.messung],
    art: "cm",
  },
  {
    id: "waermebildkamera",
    kind: "Messtechnik",
    name: "Wärmebildkamera",
    short: "Kalte Ecken und Wärmebrücken auf einen Blick",
    what: "Die Kamera zeigt die Oberflächentemperatur der Wand als Farbbild. Kalte Stellen, an denen Feuchte kondensiert, werden sichtbar, bevor Schimmel sie zeigt.",
    how: intro("schimmelbeseitigung"),
    equation: firstEq("schimmelbeseitigung"),
    services: [S.schimmel, S.messung],
    art: "thermal",
  },
  {
    id: "injektionstechnik",
    kind: "Messtechnik",
    name: "Injektionstechnik",
    short: "Bohrlochreihe, Packer und Pumpe",
    what: "Eine Reihe Bohrlöcher, höchstens 20 cm auseinander, knapp über dem Boden. Über Packer gelangt das Mittel drucklos oder mit Niederdruck ins Mauerwerk.",
    how: "Aus den einzelnen Bohrlöchern wächst im Stein eine durchgehende Sperrschicht. Kein Aufgraben, kein Bagger, der Garten bleibt, wie er ist.",
    services: [S.sperre, S.riss],
    art: "injection",
  },
  {
    id: "injektionscreme",
    kind: "Material",
    name: "Injektionscreme",
    short: "Silan-Siloxan gegen aufsteigende Feuchte",
    what: "Eine Creme aus Silan und Siloxan, die in die Bohrlöcher gepresst wird und im Mauerwerk eine wasserabweisende Sperre bildet.",
    how: intro("horizontalsperre"),
    equation: firstEq("horizontalsperre"),
    services: [S.sperre],
    art: "cream",
  },
  {
    id: "dichtschlaemme",
    kind: "Material",
    name: "Dichtschlämme",
    short: "Mineralisch, hält Wasserdruck von hinten",
    what: "Eine mineralische Dichtungsschlämme in zwei Lagen, dazu die Hohlkehle am Übergang von Boden und Wand.",
    how: intro("kellerinnenabdichtung"),
    equation: firstEq("kellerinnenabdichtung"),
    services: [S.innen, S.keller],
    art: "slurry",
  },
  {
    id: "pu-injektionsharz",
    kind: "Material",
    name: "PU-Injektionsharz",
    short: "Schäumt im nassen Riss auf und dichtet",
    what: "Zweikomponentiges Polyurethanharz, das über Packer in den Riss gepresst wird.",
    how: intro("rissverpressung"),
    equation: firstEq("rissverpressung"),
    services: [S.riss],
    art: "resin",
  },
  {
    id: "sanierputz",
    kind: "Material",
    name: "Sanierputz nach WTA",
    short: "Speichert Salze, statt sie zu verschließen",
    what: "Ein Putzsystem aus Grund- und Oberputz mit hohem Luftporengehalt, für Wände, in denen nach der Abdichtung Salze bleiben.",
    how: intro("kellersanierung"),
    equation: firstEq("kellersanierung"),
    services: [S.keller, S.innen],
    art: "plaster",
  },
  {
    id: "bitumenbahn",
    kind: "Material",
    name: "Elastomerbitumen-Bahn",
    short: "Verschweißt, Naht für Naht",
    what: "Bitumenbahn mit SBS-Kautschuk, die mit dem Brenner vollflächig aufgeschweißt wird.",
    how: intro("dachabdichtung"),
    equation: firstEq("dachabdichtung"),
    services: [S.dach],
    art: "membrane",
  },
  {
    id: "fluessigkunststoff",
    kind: "Material",
    name: "Flüssigkunststoff",
    short: "Härtet zur Membran ohne Naht aus",
    what: "Ein Flüssigkunststoff mit Vlies-Einlage, aufgetragen mit Rolle und Pinsel, für Balkon, Terrasse und alle Anschlüsse.",
    how: intro("balkon-terrasse"),
    equation: firstEq("balkon-terrasse"),
    services: [S.balkon, S.dach],
    art: "liquid",
  },
  {
    id: "bitumen-dickbeschichtung",
    kind: "Material",
    name: "Bitumen-Dickbeschichtung",
    short: "KMB für Sockel und erdberührte Wand",
    what: "Kunststoffmodifizierte Bitumen-Dickbeschichtung (KMB), in zwei Lagen auf den Sockel gespachtelt.",
    how: intro("sockelabdichtung"),
    equation: firstEq("sockelabdichtung"),
    services: [S.sockel],
    art: "kmb",
  },
  {
    id: "calciumsilikat",
    kind: "Material",
    name: "Calciumsilikat-Platte",
    short: "Warme, schimmelhemmende Oberfläche",
    what: "Eine mineralische Klimaplatte mit einem pH-Wert um 10. Sie hebt die Oberflächentemperatur an und nimmt Feuchte auf und wieder ab.",
    how: "Schimmel braucht an der Oberfläche rund 80 % relative Feuchte. Die Platte hält die Wand wärmer als den kritischen Wert und ist zu alkalisch, als dass Sporen auf ihr keimen.",
    services: [S.schimmel],
    art: "board",
  },
];
