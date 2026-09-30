/** Partner photos from SchimmelPeter® material (supplied by sos-abdichtung as SchimmelPeter partner). */
export interface Photo {
  src: string;
  /** optional larger source for srcset */
  src2x?: string;
  w: number;
  h: number;
  alt: string;
}

const P = (name: string, w: number, h: number, alt: string, big?: boolean): Photo => ({
  src: `/img/sp/${name}-${w}.webp`,
  src2x: big ? `/img/sp/${name}-960.webp` : undefined,
  w,
  h,
  alt,
});

export const PHOTOS = {
  risingDamp: P("feuchte-wand-aufsteigende-feuchtigkeit", 480, 320, "Feuchte Wand mit Feuchterand und Salzspuren im Sockelbereich über dem Fußboden", true),
  infographic: P("infografik-aufsteigende-feuchtigkeit", 480, 480, "Infografik: aufsteigende Feuchtigkeit bei defekter Horizontalsperre"),
  exteriorDrainage: P("aussenabdichtung-drainage-baustelle", 320, 213, "Freigelegte Kellerwand mit Noppenbahn und Drainagerohr auf einer Baustelle"),
  verticalBarrier: P("vertikalsperre-bitumen-kellerwand", 320, 214, "Kellerwand mit Bitumenabdichtung als Vertikalsperre am Gebäudesockel"),
  drainage: P("drainagesystem-fundament", 320, 213, "Drainagerohr und Kiesbett entlang eines Fundaments"),
  crackRepair: P("risse-abdichten-kellerboden", 320, 213, "Handwerker spachtelt Risse in einem Kellerboden zu"),
  renovatedRoom: P("saniert-heller-raum", 320, 213, "Heller, sanierter Wohnraum mit Holzboden nach der Feuchtesanierung"),
  mouldCorner: P("schimmel-raumecke", 320, 213, "Schwarzer Schimmelbefall in einer Raumecke neben dem Heizkörper"),
  pipeDamage: P("undichtes-rohr-wandschaden", 320, 213, "Aufgestemmte Wand mit freigelegten Rohren nach einem Leitungsschaden"),
  mouldTideMark: P("schimmel-wasserrand-wand", 320, 213, "Wasserrand mit Schimmel an einer durchfeuchteten Wand"),
  plastering: P("sanierputz-spachteln", 320, 213, "Hand trägt mit der Kelle neuen Putz auf eine Wand auf"),
} as const;

export type PhotoKey = keyof typeof PHOTOS;
