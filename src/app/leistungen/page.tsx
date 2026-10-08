import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import HomeSteps from "@/components/sections/HomeSteps";
import FactsStrip from "@/components/sections/FactsStrip";
import JsonLd from "@/components/seo/JsonLd";
import ScrollEngine, { SC_BOOT } from "@/components/scroll/ScrollEngine";
import { ServiceCardGrid, RegionSection, FaqSection } from "@/components/scroll/HomeSections";
import AudienceSection from "@/components/sections/AudienceSection";
import { FAQS } from "@/data/content-data";
import { Breadcrumbs } from "@/components/seo/SubpageParts";
import { SERVICE_CARDS } from "@/data/services";
import { abs, businessNode, websiteNode, breadcrumbNode, faqNode, BUSINESS_ID, WEBSITE_ID, OG_IMAGE } from "@/lib/site";
import { hy } from "@/lib/hyphenate";

const TITLE = "Leistungen: Kellersanierung & Abdichtung | sos-abdichtung";
const DESCRIPTION =
  "Alle Leistungen: Kellersanierung, Horizontalsperre, Innenabdichtung, Schimmelbeseitigung, Feuchtemessung und Rissverpressung in Wuppertal und PLZ 42.";
const PATH = "/leistungen/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
};

/** Which method for which sign: the question every homeowner asks first. */
const GUIDE = [
  { sign: "Feuchterand und weiße Salze im Sockel, nach oben hin trockener", cause: "Aufsteigende Feuchte aus dem Erdreich", slug: "horizontalsperre" },
  { sign: "Nasse Flächen über die ganze Wandhöhe, Wasser drückt seitlich", cause: "Seitlich eindringendes Wasser", slug: "kellerinnenabdichtung" },
  { sign: "Schwarze Flecken in Raumecken, hinter Schränken, an Fensterlaibungen", cause: "Kondensat an kalten Flächen", slug: "schimmelbeseitigung" },
  { sign: "Wasser sickert durch einen Riss in Beton oder Mauerwerk", cause: "Wasserführender Riss", slug: "rissverpressung" },
  { sign: "Mehrere Anzeichen zugleich, der Keller soll wieder nutzbar werden", cause: "Mehrere Ursachen", slug: "kellersanierung" },
  { sign: "Ursache unklar, Gutachten für Kauf, Versicherung oder Vermieter", cause: "Erst messen", slug: "feuchtemessung" },
];

export default function LeistungenPage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Leistungen", path: PATH },
  ];
  const title = (slug: string) => SERVICE_CARDS.find((s) => s.slug === slug)!.title;
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
        itemListElement: SERVICE_CARDS.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: abs(`/leistungen/${s.slug}/`),
          name: s.title,
        })),
      },
    },
    { ...breadcrumbNode(crumbs), "@id": `${abs(PATH)}#breadcrumb` },
    faqNode(FAQS),
  ];

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SC_BOOT }} />
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main">
        <section id="leistungen" className="sc-page-top" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-6">
              Unsere Leistungen: <em>Kellersanierung und Abdichtung</em>
            </h1>
            <p className="sc-lede mt-5 max-w-3xl">
              {hy(
                "Neun Verfahren, eine Regel: erst messen, dann sanieren. Jede Leistung hat eine eigene Seite mit 3D-Modell, der Physik dahinter, Zahlen, Ablauf und Fragen. Wir arbeiten in Wuppertal, Solingen, Remscheid, Velbert, Haan und Wermelskirchen."
              )}
            </p>
            <ServiceCardGrid />
          </div>
        </section>

        <section id="wegweiser" className="sc-section border-t border-line/10" aria-labelledby="guide-title">
          <div className="sc-wrap">
            <p className="sc-label">Wegweiser</p>
            <h2 id="guide-title" className="sc-display mt-3">
              Welches Verfahren <em>passt zu Ihrem Keller?</em>
            </h2>
            <div className="guide-table mt-8">
              <table>
                <caption className="sr-only">Anzeichen, Ursache und passendes Verfahren</caption>
                <thead>
                  <tr>
                    <th scope="col">Was Sie sehen</th>
                    <th scope="col">Häufige Ursache</th>
                    <th scope="col">Passendes Verfahren</th>
                  </tr>
                </thead>
                <tbody>
                  {GUIDE.map((g) => (
                    <tr key={g.slug}>
                      <td>{g.sign}</td>
                      <td>{g.cause}</td>
                      <td>
                        <a href={`/leistungen/${g.slug}/`}>
                          {title(g.slug)} <span aria-hidden="true">→</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-[var(--sc-ink-soft)]">
              {hy("Ein Wegweiser, keine Diagnose: welches Verfahren Ihr Objekt braucht, zeigt die kostenlose Feuchtemessung vor Ort.")}
            </p>
          </div>
        </section>

        <AudienceSection />
        <RegionSection />
        <FaqSection />
        <FactsStrip title="Zahlen & Fakten" />
        <HomeSteps />
      </main>
      <Footer />
      <ScrollEngine />
    </>
  );
}
