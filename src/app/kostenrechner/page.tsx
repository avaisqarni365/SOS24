import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ContactForm from "@/components/sections/ContactForm";
import CostCalculator from "@/components/calculator/CostCalculator";
import JsonLd from "@/components/seo/JsonLd";
import ScrollEngine, { SC_BOOT } from "@/components/scroll/ScrollEngine";
import { Breadcrumbs } from "@/components/seo/SubpageParts";
import { abs, businessNode, websiteNode, breadcrumbNode, OG_IMAGE } from "@/lib/site";
import { hy } from "@/lib/hyphenate";

const TITLE = "Kostenrechner Kellersanierung | sos-abdichtung";
const DESCRIPTION =
  "Kostenrechner für die Kellersanierung: Schadensbild und Wandlänge wählen, Richtwert für die Injektion von innen sehen und mit dem Aufgraben vergleichen.";
const PATH = "/kostenrechner/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
};

export default function KostenrechnerPage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Kostenrechner", path: PATH },
  ];
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SC_BOOT }} />
      <JsonLd graph={[businessNode(), websiteNode(), { ...breadcrumbNode(crumbs), "@id": `${abs(PATH)}#breadcrumb` }]} />
      <Navbar />
      <main id="main">
        <section className="sc-page-top pb-0" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-6">
              Kostenrechner <em>Kellersanierung</em>
            </h1>
            <p className="sc-lede mt-5 max-w-3xl text-[var(--sc-ink-soft)]">
              {hy("Ein erster Richtwert in einer Minute: Schadensbild und Wandlänge wählen. Den verbindlichen Festpreis erhalten Sie nach der kostenlosen Messung vor Ort.")}
            </p>
          </div>
        </section>
        <CostCalculator />
        <ContactForm />
      </main>
      <Footer />
      <ScrollEngine />
    </>
  );
}
