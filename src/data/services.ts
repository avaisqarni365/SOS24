/** Short service cards for the homepage rail and navigation. Slugs match SERVICE_PAGES in seo-pages.ts. */
export interface ServiceCard {
  slug: string;
  title: string;
  text: string;
  art: "keller" | "sperre" | "innen" | "schimmel" | "messung" | "riss";
}

export const SERVICE_CARDS: ServiceCard[] = [
  {
    slug: "kellersanierung",
    title: "Kellersanierung",
    text: "Nasse Keller dauerhaft trocken und wieder nutzbar, von innen saniert, ohne Aufgraben.",
    art: "keller",
  },
  {
    slug: "horizontalsperre",
    title: "Feuchte Wände & Horizontalsperre",
    text: "Aufsteigende Feuchte stoppen: Bohrlochkette, drucklose Silan-Mikroemulsion nach WTA-Merkblatt 4-4-04.",
    art: "sperre",
  },
  {
    slug: "kellerinnenabdichtung",
    title: "Keller von innen abdichten",
    text: "Dichtungsschlämme, Hohlkehle und Sanierputz gegen seitlich drückendes Wasser.",
    art: "innen",
  },
  {
    slug: "schimmelbeseitigung",
    title: "Schimmelbeseitigung",
    text: "Ursache finden, Befall sporensicher entfernen, Oberfläche mit Calciumsilikat schützen.",
    art: "schimmel",
  },
  {
    slug: "feuchtemessung",
    title: "Feuchtemessung & Gutachten",
    text: "Kapillar oder hygroskopisch? Wir messen im Baustoff, bevor irgendjemand bohrt.",
    art: "messung",
  },
  {
    slug: "rissverpressung",
    title: "Rissverpressung",
    text: "Wasserführende Risse in Beton und Mauerwerk mit PU-Harz oder Epoxid dicht verpressen.",
    art: "riss",
  },
];
