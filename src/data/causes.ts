import type { PhotoKey } from "./photos";

/**
 * Schimmel im Keller: the four ways moisture gets into basement masonry
 * (SchimmelPeter's own classification), as hotspots on a cross-section.
 * All four are listed as plain text too, so nothing depends on JS.
 */
export interface Cause {
  id: string;
  n: number;
  title: string;
  /** hotspot position in the 1000 x 620 section */
  x: number;
  y: number;
  photo: PhotoKey;
  what: string;
  signs: string[];
  fix: string;
  href: string;
  cta: string;
}

export const CAUSES: Cause[] = [
  {
    id: "kapillar",
    n: 1,
    title: "Defekte Kapillarwassersperre",
    x: 318,
    y: 470,
    photo: "risingDamp",
    what: "Die horizontale Sperre unter dem Mauerwerk, oft aus Bitumen oder Kunststoff, fehlt oder ist gealtert. Bodenfeuchte steigt kapillar in die Wand.",
    signs: ["Feuchterand gleichmäßig von unten", "Salzausblühungen im Sockel", "Putz blüht und bröckelt"],
    fix: "Neue Horizontalsperre per Injektion von innen, ohne Aufgraben.",
    href: "/leistungen/horizontalsperre/",
    cta: "Zur Horizontalsperre",
  },
  {
    id: "vertikal",
    n: 2,
    title: "Undichte Vertikalsperre",
    x: 250,
    y: 330,
    photo: "verticalBarrier",
    what: "Die Außenabdichtung der erdberührten Wand ist gerissen oder verwittert. Wasser dringt seitlich aus dem Erdreich ins Mauerwerk.",
    signs: ["Feuchte Flächen an der Erdseite", "Stärker nach Regen", "Kein sauberer Feuchterand"],
    fix: "Innenabdichtung mit Dichtschlämme und Hohlkehle, wo Aufgraben nicht möglich ist.",
    href: "/leistungen/kellerinnenabdichtung/",
    cta: "Zur Innenabdichtung",
  },
  {
    id: "drainage",
    n: 3,
    title: "Fehlende oder defekte Drainage",
    x: 200,
    y: 560,
    photo: "drainage",
    what: "Ohne funktionierende Drainage staut sich Niederschlagswasser am Fundament und drückt gegen die Kellerwand.",
    signs: ["Wasser nach Starkregen", "Nasse Ecken am Wandfuß", "Pfützen am Boden-Wand-Anschluss"],
    fix: "Ursache messen, Wasserdruck von innen abdichten, Drainage bei Bedarf erneuern lassen.",
    href: "/leistungen/kellersanierung/",
    cta: "Zur Kellersanierung",
  },
  {
    id: "riss",
    n: 4,
    title: "Risse und undichte Stellen",
    x: 318,
    y: 250,
    photo: "crackRepair",
    what: "Setzungs- oder Schwindrisse in Wand und Boden lassen Wasser direkt durch das Bauteil laufen.",
    signs: ["Nasse Linie entlang des Risses", "Wasser tritt punktuell aus", "Kalkfahnen am Riss"],
    fix: "Rissverpressung mit PU- oder Epoxidharz über die ganze Wanddicke.",
    href: "/leistungen/rissverpressung/",
    cta: "Zur Rissverpressung",
  },
];

