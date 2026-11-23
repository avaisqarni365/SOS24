import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import HomeSteps from "@/components/sections/HomeSteps";
import QuoteCalculator from "@/components/calculator/QuoteCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ScrollEngine, { SC_BOOT } from "@/components/scroll/ScrollEngine";
import { Breadcrumbs, Prose, FaqList } from "@/components/seo/SubpageParts";
import { abs, businessNode, websiteNode, breadcrumbNode, faqNode, OG_IMAGE } from "@/lib/site";
import { hy } from "@/lib/hyphenate";

const TITLE = "Angebotsrechner Kellersanierung | sos-abdichtung";
const DESCRIPTION =
  "Angebotsrechner für Kellersanierung und Abdichtung: Leistung, Fläche und Zustand wählen, Umfang sehen, Festpreis nach kostenloser Messung anfragen.";
const PATH = "/kostenrechner/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
};

const SECTIONS = [
  {
    heading: "Was kostet eine Kellersanierung? Wovon der Preis abhängt",
    paragraphs: [
      "Die Kosten einer Kellersanierung lassen sich nicht aus der Kellergröße ablesen. Entscheidend ist die Ursache: Eine Horizontalsperre an einer einzelnen Wand ist ein anderes Vorhaben als eine Innenabdichtung gegen drückendes Wasser an drei Seiten mit Rissverpressung. Dazu kommen der Baustoff, die Wandstärke, der Durchfeuchtungsgrad und der Zustand des alten Putzes.",
      "Deshalb zeigt der Angebotsrechner keinen Preis, sondern den Umfang: welche Arbeiten zu Ihrer Auswahl gehören und was im Angebot stehen wird. Den Preis nennen wir nach der kostenlosen Messung vor Ort, schriftlich und als Festpreis, der sich danach nicht mehr ändert.",
    ],
    bullets: [
      "Ursache: aufsteigende Feuchte, seitlich eindringendes Wasser, Risse oder Kondensat",
      "Länge und Stärke der betroffenen Wände",
      "Baustoff: Ziegel, Bruchstein oder Beton",
      "Durchfeuchtung, Salzbelastung und Zustand des Putzes",
    ],
  },
  {
    heading: "Vom Rechner zum Festpreis",
    paragraphs: [
      "Ihre Auswahl im Rechner können Sie direkt als Anfrage senden. Wir melden uns, vereinbaren den Termin und messen vor Ort in mehreren Höhen und an mehreren Wänden. Aus den Messwerten entsteht das Angebot, in dem jede Wand und jeder Arbeitsschritt einzeln aufgeführt ist. So können Sie Angebote vergleichen und die Sanierung bei Bedarf in Abschnitten ausführen lassen.",
    ],
  },
];

const FAQS = [
  {
    q: "Warum zeigt der Angebotsrechner keinen Preis?",
    a: "Weil ein Preis ohne Messung nicht stimmen kann. Zwei Keller gleicher Größe können sehr unterschiedliche Arbeiten brauchen. Der Rechner zeigt deshalb den Umfang Ihrer Auswahl; den Festpreis erhalten Sie schriftlich nach der kostenlosen Messung.",
  },
  {
    q: "Was kostet die Feuchtemessung vor Ort?",
    a: "Nichts. Die Besichtigung mit Feuchtemessung ist kostenlos und unverbindlich, im Ruhrgebiet ebenso wie im Bergischen Land und im Rheinland.",
  },
  {
    q: "Ist das Angebot nach der Messung verbindlich?",
    a: "Ja. Sie erhalten ein schriftliches Festpreisangebot, in dem Wände und Arbeitsschritte einzeln aufgeführt sind. Der Preis ändert sich danach nicht mehr.",
  },
  {
    q: "Ist eine Kellersanierung von innen günstiger als eine von außen?",
    a: "In der Regel ja, weil Bagger, Verbau, Entsorgung und die Wiederherstellung von Garten und Pflaster entfallen. Ob die Sanierung von innen für Ihr Haus der richtige Weg ist, zeigt die Messung.",
  },
];

export default function KostenrechnerPage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Angebotsrechner", path: PATH },
  ];
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SC_BOOT }} />
      <JsonLd graph={[businessNode(), websiteNode(), { ...breadcrumbNode(crumbs), "@id": `${abs(PATH)}#breadcrumb` }, faqNode(FAQS)]} />
      <Navbar />
      <main id="main">
        <section className="sc-page-top pb-0" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-6">
              Angebotsrechner <em>Kellersanierung</em>
            </h1>
            <p className="sc-lede mt-5 max-w-3xl text-[var(--sc-ink-soft)]">
              {hy("Leistung, Fläche und Zustand wählen: Sie sehen sofort, wie groß das Vorhaben ist und was im Angebot steht. Einen Preis nennen wir erst nach der kostenlosen Messung, dann schriftlich und verbindlich.")}
            </p>
          </div>
        </section>
        <QuoteCalculator />
        <section className="surface-bone-2 sc-section">
          <div className="sc-wrap max-w-4xl">
            <Prose sections={SECTIONS} />
          </div>
        </section>
        <section className="sc-section">
          <div className="sc-wrap max-w-4xl">
            <FaqList faqs={FAQS} title="Fragen zu Kosten und Angebot" />
          </div>
        </section>
        <HomeSteps />
      </main>
      <Footer />
      <ScrollEngine />
    </>
  );
}
