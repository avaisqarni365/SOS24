import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import HomeSteps from "@/components/sections/HomeSteps";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs, Prose, LinkGrid, FaqList } from "@/components/seo/SubpageParts";
import { CITY_PAGES } from "@/data/seo-pages";
import { abs, businessNode, websiteNode, breadcrumbNode, faqNode, BUSINESS_ID, WEBSITE_ID, OG_IMAGE } from "@/lib/site";
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
      { slug: "gladbeck", sub: "Zechensiedlungen in Brauck und Butendorf, Bergsenkungsrisse" },
      { slug: "herten", sub: "Bergschäden nach Ewald, Grundwasser am Emscherbruch" },
      { slug: "recklinghausen", sub: "Altbaukeller im Paulusviertel, Zechensiedlungen in Hochlarmark" },
      { slug: "herne", sub: "Altbaukeller in Wanne-Eickel, Grundwasser am Kanal" },
      { slug: "witten", sub: "Hangwasser in Bommern, Ruhrtal in Herbede" },
      { slug: "hattingen", sub: "Bruchsteinkeller in der Altstadt, Hanglagen im Süden" },
      { slug: "gelsenkirchen", sub: "Bergsenkungsrisse, Grundwasser im Emschertal" },
      { slug: "bochum", sub: "Bergschäden in Zechensiedlungen, Hangwasser in Stiepel" },
      { slug: "dortmund", sub: "Nasse Keller im Altbau und in Zechensiedlungen" },
      { slug: "duisburg", sub: "Grundwasser an Rhein und Ruhr, Risse im Mauerwerk" },
      { slug: "hagen", sub: "Hangwasser in Eilpe und Haspe, Bruchstein in Hohenlimburg" },
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
  {
    heading: "Kellerabdichtung, Kellertrockenlegung, Kellersanierung: was wir in NRW ausführen",
    paragraphs: [
      "Wer in NRW einen nassen Keller hat, sucht je nach Region nach Kellerabdichtung, Kellertrockenlegung oder Kellersanierung. Gemeint ist meist dasselbe Ziel: ein trockener Keller. Die Kellertrockenlegung stoppt aufsteigende Feuchte mit einer Horizontalsperre im Injektionsverfahren. Die Kellerabdichtung von innen hält Wasser zurück, das seitlich durch die Wand drückt, mit Hohlkehle und mineralischer Dichtungsschlämme. Wasserführende Risse, wie sie Bergsenkungen im Ruhrgebiet hinterlassen, schließen wir per Rissverpressung.",
      "Welche dieser Arbeiten ein Keller braucht, hängt vom Haus ab und nicht von der Stadt. Darum messen wir in Dortmund genauso wie in Wuppertal oder Köln zuerst die Feuchte in mehreren Höhen und an mehreren Wänden. Erst danach steht fest, ob eine Horizontalsperre genügt oder die Wand zusätzlich abgedichtet werden muss.",
    ],
    bullets: [
      "Horizontalsperre gegen aufsteigende Feuchte, ohne Aufgraben",
      "Kellerabdichtung von innen, auch gegen drückendes Wasser",
      "Rissverpressung bei wasserführenden Rissen in Wand und Boden",
      "Sanierputz, Schimmelbeseitigung und Sockelabdichtung als Ergänzung",
    ],
  },
  {
    heading: "Nasser Keller in NRW: die typischen Ursachen nach Region",
    paragraphs: [
      "Im Ruhrgebiet, von Duisburg über Essen, Gelsenkirchen und Bochum bis Dortmund, stehen viele Zechen- und Gründerzeithäuser mit Ziegelkellern ohne Sperrschicht. Dazu kommen Risse aus Bergsenkungen und hohes Grundwasser an Emscher, Ruhr und Kanal. Im Bergischen Land, in Wuppertal, Solingen, Remscheid und Velbert, trifft Hang- und Schichtenwasser bergseitig auf Keller aus Bruchstein. Im Rheinland, in Düsseldorf, Köln und Leverkusen, steigt mit dem Rheinpegel das Grundwasser und drückt gegen Kellerwand und Bodenplatte.",
      "Auf den Stadtseiten steht das genauer: welche Stadtteile betroffen sind, welche Baujahre und Baustoffe dort üblich sind und welches Verfahren in der Regel hilft.",
    ],
  },
];

const HUB_FAQS = [
  {
    q: "In welchen Städten in NRW sanieren Sie Keller?",
    a: "Im Ruhrgebiet unter anderem in Essen, Mülheim, Oberhausen, Bottrop, Gelsenkirchen, Bochum, Dortmund und Duisburg, im Bergischen Land in Wuppertal, Solingen, Remscheid, Velbert, Haan und Wermelskirchen und im Rheinland in Düsseldorf, Köln und Leverkusen. Alle Städte mit eigener Seite finden Sie oben auf dieser Seite.",
  },
  {
    q: "Meine Stadt steht nicht in der Liste. Kommen Sie trotzdem?",
    a: "In der Regel ja. Wir arbeiten von Essen aus im ganzen Ruhrgebiet, im Bergischen Land und im Rheinland, auch in Städten ohne eigene Seite. Rufen Sie an oder schreiben Sie per WhatsApp an 0172 2064177, dann klären wir das sofort.",
  },
  {
    q: "Kostet die Feuchtemessung außerhalb von Essen etwas?",
    a: "Nein. Die Besichtigung mit Feuchtemessung ist in allen Städten kostenlos und unverbindlich. Danach erhalten Sie ein schriftliches Angebot zum Festpreis.",
  },
  {
    q: "Wie schnell sind Sie vor Ort?",
    a: "Im Ruhrgebiet meist innerhalb von 24 bis 48 Stunden, im Bergischen Land und im Rheinland nach Absprache. Fotos vom Schaden können Sie vorab per WhatsApp schicken.",
  },
  {
    q: "Muss für die Kellersanierung aufgegraben werden?",
    a: "Nein. Wir sanieren von innen: Horizontalsperre, Innenabdichtung und Rissverpressung werden vom Keller aus ausgeführt. Garten, Einfahrt und Pflaster bleiben unberührt, und auch bei Reihenhäusern mit Nachbarwand ist die Sanierung möglich.",
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
    faqNode(HUB_FAQS),
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

        <section className="sc-section">
          <div className="sc-wrap max-w-4xl">
            <FaqList faqs={HUB_FAQS} title="Fragen zur Kellersanierung in NRW" />
          </div>
        </section>

        <HomeSteps />
      </main>
      <Footer />
    </>
  );
}
