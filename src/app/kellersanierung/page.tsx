import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import HomeSteps from "@/components/sections/HomeSteps";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs, Prose, LinkGrid } from "@/components/seo/SubpageParts";
import { CITY_PAGES } from "@/data/seo-pages";
import { abs, businessNode, websiteNode, breadcrumbNode, BUSINESS_ID, WEBSITE_ID, OG_IMAGE } from "@/lib/site";
import { hy } from "@/lib/hyphenate";

const TITLE = "Kellersanierung NRW: alle Städte | sos-abdichtung";
const DESCRIPTION =
  "Kellersanierung in NRW aus Essen: Ruhrgebiet, Bergisches Land und Rheinland. Für jede Stadt die typischen Kellerschäden und was hilft. Messung kostenlos.";
const PATH = "/kellersanierung/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
};

// one line per town: what is typical for its cellars, so the overview is more than a list of names
const REGIONS: { name: string; intro: string; towns: { slug: string; sub: string }[] }[] = [
  {
    name: "Ruhrgebiet",
    intro: "Bergsenkungen, gepumptes Grundwasser an der Emscher und Zechenhäuser ohne Sperrschicht.",
    towns: [
      { slug: "essen", sub: "Unser Sitz: Zechenhäuser im Norden, Hanglagen im Süden" },
      { slug: "muelheim-an-der-ruhr", sub: "Hangwasser in Saarn, Grundwasser an der Ruhr" },
      { slug: "oberhausen", sub: "Siedlungshäuser, Wasser an Emscher und Kanal" },
      { slug: "bottrop", sub: "Setzungsrisse nach dem Ende des Bergbaus" },
      { slug: "gelsenkirchen", sub: "Bergsenkungsrisse, Grundwasser im Emschertal" },
      { slug: "bochum", sub: "Bergschäden und Hanglagen im Süden" },
      { slug: "dortmund", sub: "Nasse Keller im Altbau und in Zechensiedlungen" },
      { slug: "duisburg", sub: "Grundwasser an Rhein und Ruhr, Risse im Mauerwerk" },
      { slug: "hagen", sub: "Schichtenwasser am Hang, Bruchsteinkeller" },
    ],
  },
  {
    name: "Bergisches Land",
    intro: "Hanglagen, Schichtenwasser und alte Keller aus Bruchstein und Schiefer.",
    towns: [
      { slug: "wuppertal", sub: "Kellertrockenlegung am Hang, Bruchstein und Ziegel" },
      { slug: "solingen", sub: "Horizontalsperre im Bruchstein, Wasser vom Hang" },
      { slug: "remscheid", sub: "Wasser durch klüftigen Fels, Bruchsteinkeller" },
      { slug: "velbert", sub: "Bruchstein in Langenberg und Neviges, Hanglagen" },
      { slug: "haan", sub: "Kalkstein in Gruiten, Grundwasser im Düsseltal" },
      { slug: "wermelskirchen", sub: "Schiefer- und Bruchsteinsockel, Talhänge" },
    ],
  },
  {
    name: "Rheinland",
    intro: "Drückendes Grundwasser in Rheinnähe und Gründerzeitkeller ohne Sperrschicht.",
    towns: [
      { slug: "duesseldorf", sub: "Kellerabdichtung am Rhein, Souterrain im Altbau" },
      { slug: "koeln", sub: "Rheinpegel, Gründerzeitkeller in Südstadt und Nippes" },
      { slug: "leverkusen", sub: "Hochwasser an Rhein, Wupper und Dhünn" },
    ],
  },
];

const SECTIONS = [
  {
    heading: "Eine Kellersanierung, viele Ursachen",
    paragraphs: [
      "Ein feuchter Keller in Bottrop hat oft eine andere Ursache als einer in Solingen oder Köln. Im Ruhrgebiet sind es häufig Setzungsrisse aus dem Bergbau und Grundwasser, das an der Emscher dauerhaft abgepumpt wird. Im Bergischen Land drückt Wasser vom Hang gegen die Wand, und in den Bruchsteinkellern steigt die Feuchte durch die Fugen auf. Am Rhein kommt drückendes Grundwasser dazu, wenn der Pegel steigt.",
      "Deshalb hat jede Stadt hier eine eigene Seite: mit den Stadtteilen, den typischen Schäden vor Ort und den Verfahren, die dort am häufigsten helfen. Die Arbeit selbst folgt überall derselben Regel: erst messen, dann sanieren. Die Messung ist kostenlos, das Angebot ein Festpreis, und auf die Arbeit geben wir 10 Jahre Garantie.",
    ],
  },
  {
    heading: "Von Essen aus in ganz NRW",
    paragraphs: [
      "Unser Sitz ist in Essen. Von hier sind wir im Ruhrgebiet meist innerhalb von 24 bis 48 Stunden vor Ort, im Bergischen Land und im Rheinland nach Absprache. Wir sanieren von innen, ohne Aufgraben: mit Horizontalsperre, Innenabdichtung, Rissverpressung und Sanierputz, dazu Sockel, Balkon und Terrasse. Ihre Stadt ist nicht dabei? Rufen Sie an oder schicken Sie Fotos per WhatsApp an 0172 2064177.",
    ],
  },
];

export default function KellersanierungHub() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Kellersanierung NRW", path: PATH },
  ];
  const nameOf = (slug: string) => CITY_PAGES.find((c) => c.slug === slug)!.name;
  const towns = REGIONS.flatMap((r) => r.towns);
  const graph = [
    businessNode(),
    websiteNode(),
    {
      "@type": "CollectionPage",
      "@id": `${abs(PATH)}#webpage`,
      url: abs(PATH),
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "de-DE",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
      breadcrumb: { "@id": `${abs(PATH)}#breadcrumb` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: towns.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: abs(`/kellersanierung/${t.slug}/`),
          name: `Kellersanierung ${nameOf(t.slug)}`,
        })),
      },
    },
    { ...breadcrumbNode(crumbs), "@id": `${abs(PATH)}#breadcrumb` },
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main">
        <section className="sc-page-top" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-6">
              Kellersanierung NRW: <em>Ihre Stadt, Ihr Keller</em>
            </h1>
            <p className="sc-lede mt-5 max-w-3xl">
              {hy(
                "Wir sanieren Keller von innen, ohne Aufgraben, im Ruhrgebiet, im Bergischen Land und im Rheinland. Wählen Sie Ihre Stadt: Dort finden Sie die typischen Kellerschäden vor Ort, die Stadtteile und was dagegen hilft."
              )}
            </p>
            <div className="mt-10 grid gap-12">
              {REGIONS.map((r) => (
                <div key={r.name}>
                  <h2 className="sc-display text-2xl sm:text-3xl text-ink">Kellersanierung {r.name}</h2>
                  <p className="mt-2 mb-5 text-ink font-medium">{hy(r.intro)}</p>
                  <LinkGrid
                    title={`Städte im ${r.name === "Bergisches Land" ? "Bergischen Land" : r.name}`}
                    links={r.towns.map((t) => ({ href: `/kellersanierung/${t.slug}/`, label: `Kellersanierung ${nameOf(t.slug)}`, sub: t.sub }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="surface-bone-2 sc-section">
          <div className="sc-wrap max-w-4xl">
            <Prose sections={SECTIONS} />
          </div>
        </section>

        <HomeSteps />
      </main>
      <Footer />
    </>
  );
}
