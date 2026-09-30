/**
 * Gallery photos. Sources: SchimmelPeter® website and PDFs (partner material),
 * converted to WebP. Captions describe what the photo shows; the photos are
 * not presented as documented sos-abdichtung jobs at specific addresses.
 */
export type GalleryCategory = "horizontal" | "keller" | "drainage" | "schimmel" | "team";

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  title: string;
  text: string;
  tag: string;
  src: string;
  src2x?: string;
  w: number;
  h: number;
  alt: string;
}

const G = (name: string) => `/img/gallery/${name}`;

export const GALLERY: GalleryItem[] = [
  {
    id: "ansprechpartner",
    category: "team",
    title: "Shahzad Mahmood, Inhaber",
    text: "Ihr persönlicher Ansprechpartner als SchimmelPeter® Partnerbetrieb für Wuppertal und das Bergische Land. Er kommt selbst zur Messung.",
    tag: "Ihr Ansprechpartner",
    src: G("shahzad-mahmood-480.webp"),
    w: 480,
    h: 528,
    alt: "Porträt von Shahzad Mahmood, Inhaber von sos-abdichtung, im SchimmelPeter-Poloshirt",
  },
  {
    id: "feuchterand",
    category: "horizontal",
    title: "Feuchterand im Sockel",
    text: "Das typische Bild aufsteigender Feuchte: dunkler Rand, Salzspuren, abblätternder Anstrich. Hier hilft eine neue Horizontalsperre per Injektion.",
    tag: "Schadensbild",
    src: G("feuchterand-sockel-480.webp"),
    src2x: G("feuchterand-sockel-960.webp"),
    w: 480,
    h: 320,
    alt: "Wand mit Feuchterand und Salzspuren über dem Fußboden",
  },
  {
    id: "infografik",
    category: "horizontal",
    title: "Aufsteigende Feuchte bei defekter Horizontalsperre",
    text: "Fehlt die Sperrschicht oder ist sie defekt, zieht Bodenfeuchte kapillar ins Mauerwerk und steigt in der Wand nach oben.",
    tag: "Infografik",
    src: G("infografik-horizontalsperre-480.webp"),
    w: 480,
    h: 480,
    alt: "Infografik: aufsteigende Feuchtigkeit bei defekter Horizontalsperre",
  },
  {
    id: "vertikalsperre",
    category: "keller",
    title: "Vertikalsperre aus Bitumen",
    text: "Die Außenabdichtung schützt die erdberührte Kellerwand vor seitlich eindringender Feuchte. Ist sie undicht, dichten wir von innen ab.",
    tag: "Abdichtung",
    src: "/img/sp/vertikalsperre-bitumen-kellerwand-320.webp",
    w: 320,
    h: 214,
    alt: "Kellerwand mit Bitumenabdichtung am Gebäudesockel",
  },
  {
    id: "risse",
    category: "keller",
    title: "Risse abdichten",
    text: "Risse in Wand und Boden lassen Wasser durch das Bauteil laufen. Wasserführende Risse werden über die ganze Tiefe verpresst.",
    tag: "Arbeitsschritt",
    src: "/img/sp/risse-abdichten-kellerboden-320.webp",
    w: 320,
    h: 213,
    alt: "Handwerker schließt Risse in einem Kellerboden",
  },
  {
    id: "sanierputz",
    category: "keller",
    title: "Sanierputz auftragen",
    text: "Nach Abdichtung und Injektion nimmt ein Sanierputz Restsalze auf und lässt die Wand weiter austrocknen.",
    tag: "Arbeitsschritt",
    src: "/img/sp/sanierputz-spachteln-320.webp",
    w: 320,
    h: 213,
    alt: "Hand trägt mit der Kelle Putz auf eine Wand auf",
  },
  {
    id: "saniert",
    category: "keller",
    title: "Das Ziel: ein trockener Raum",
    text: "Helle, trockene Wände und ein Raum, der wieder genutzt werden kann. Nach der Sanierung nehmen Sie die Arbeiten gemeinsam mit uns ab.",
    tag: "Ergebnis",
    src: G("saniert-kellerraum-480.webp"),
    src2x: G("saniert-kellerraum-960.webp"),
    w: 480,
    h: 320,
    alt: "Heller, sanierter Raum mit weißen Wänden und grauem Boden",
  },
  {
    id: "drainage",
    category: "drainage",
    title: "Drainage am Fundament",
    text: "Drainagerohre leiten Niederschlagswasser am Fundament ab und senken so den Wasserdruck auf die Kellerwand.",
    tag: "Drainage",
    src: G("drainage-fundament-480.webp"),
    w: 480,
    h: 320,
    alt: "Drainagerohr und Schalung entlang eines Fundaments",
  },
  {
    id: "noppenbahn",
    category: "drainage",
    title: "Außenabdichtung mit Noppenbahn",
    text: "Ist die Wand von außen zugänglich, schützen Abdichtung, Noppenbahn und Drainage die Kellerwand vor Erdfeuchte und Staunässe.",
    tag: "Außenabdichtung",
    src: "/img/sp/aussenabdichtung-drainage-baustelle-320.webp",
    w: 320,
    h: 213,
    alt: "Freigelegte Kellerwand mit Noppenbahn und Drainagerohr",
  },
  {
    id: "staunaesse",
    category: "drainage",
    title: "Unzureichende Drainage",
    text: "Wasser steht auf der Terrasse und kann nicht abfließen. Auf Dauer belastet das Sockel und Kellerwand.",
    tag: "Schadensbild",
    src: G("terrasse-staunaesse-480.webp"),
    w: 480,
    h: 320,
    alt: "Wasser steht auf einer Terrasse vor einer Hauswand",
  },
  {
    id: "schimmel-mauerwerk",
    category: "schimmel",
    title: "Schimmel und Ausblühungen",
    text: "Dauerhaft feuchtes Mauerwerk mit Schimmel und Salzausblühungen. Vor der Entfernung klären wir die Ursache, sonst kommt der Befall zurück.",
    tag: "Schadensbild",
    src: G("schimmel-ausbluehungen-480.webp"),
    w: 480,
    h: 320,
    alt: "Feuchte Wand mit Schimmel und Salzausblühungen",
  },
  {
    id: "schimmel-ecke",
    category: "schimmel",
    title: "Schimmel in der Raumecke",
    text: "Kalte Außenecken sind typische Wärmebrücken. Dort fällt Kondensat aus und Schimmel beginnt zu wachsen.",
    tag: "Schadensbild",
    src: "/img/sp/schimmel-raumecke-320.webp",
    w: 320,
    h: 213,
    alt: "Schwarzer Schimmel in einer Raumecke neben dem Heizkörper",
  },
];
