/** Short service cards for the homepage rail and navigation. Slugs match SERVICE_PAGES in seo-pages.ts. */
export interface ServiceCard {
  slug: string;
  title: string;
  text: string;
  art: "keller" | "sperre" | "innen" | "schimmel" | "messung" | "riss";
  /** card picture: a still from the 3D model (transparent, "contain") or a photo ("cover") */
  image: { src: string; alt: string; fit: "contain" | "cover" };
}

export const SERVICE_CARDS: ServiceCard[] = [
  {
    slug: "kellersanierung",
    title: "Kellersanierung",
    text: "Nasse Keller dauerhaft trocken und wieder nutzbar, von innen saniert, ohne Aufgraben.",
    art: "keller",
    image: { src: "/img/hero-keller-poster.webp", alt: "3D-Schnitt: nasser Keller mit Wasser am Boden und Salzrand in der Wand", fit: "contain" },
  },
  {
    slug: "horizontalsperre",
    title: "Feuchte Wände & Horizontalsperre",
    text: "Aufsteigende Feuchte stoppen: neue Sperrschicht per Injektion, ohne Erdarbeiten und meist ohne Vortrocknung.",
    art: "sperre",
    image: { src: "/img/3d/keller-innen-3-640.webp", alt: "3D-Modell: Horizontalsperre per Injektion knapp über dem Kellerboden", fit: "contain" },
  },
  {
    slug: "kellerinnenabdichtung",
    title: "Keller von innen abdichten",
    text: "Dichtungsschlämme, Hohlkehle und Sanierputz gegen seitlich drückendes Wasser.",
    art: "innen",
    image: { src: "/img/3d/keller-innen-8-640.webp", alt: "3D-Modell: alle Schichten der Innenabdichtung, auseinandergezogen", fit: "contain" },
  },
  {
    slug: "schimmelbeseitigung",
    title: "Schimmelbeseitigung",
    text: "Ursache finden, Befall sporensicher entfernen, Oberfläche mit Calciumsilikat schützen.",
    art: "schimmel",
    image: { src: "/img/3d/wohnraum-1-640.webp", alt: "3D-Modell: Wohnraum mit Wärmebild der kalten Ecke und Schimmel", fit: "contain" },
  },
  {
    slug: "feuchtemessung",
    title: "Feuchtemessung & Gutachten",
    text: "Kapillar oder hygroskopisch? Wir messen im Baustoff, bevor irgendjemand bohrt.",
    art: "messung",
    image: { src: "/img/sp/feuchte-wand-aufsteigende-feuchtigkeit-480.webp", alt: "Feuchte Wand mit Feuchterand und Salzspuren im Sockel", fit: "cover" },
  },
  {
    slug: "rissverpressung",
    title: "Rissverpressung",
    text: "Wasserführende Risse in Beton und Mauerwerk mit PU-Harz oder Epoxid dicht verpressen.",
    art: "riss",
    image: { src: "/img/3d/garage-3-640.webp", alt: "3D-Modell: Riss in der Betonwand, mit Harz verpresst", fit: "contain" },
  },
];
