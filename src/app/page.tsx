import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ContactForm from "@/components/sections/ContactForm";
import CostCalculator from "@/components/calculator/CostCalculator";
import GrokLeadBot from "@/components/ai/GrokLeadBot";
import Hero from "@/components/scroll/Hero";
import Tension from "@/components/scroll/Tension";
import LayersAct from "@/components/scroll/LayersAct";
import { ScannerSection, ServicesRail, ProcessSection, RegionSection, FaqSection } from "@/components/scroll/HomeSections";
import ScrollEngine, { SC_BOOT } from "@/components/scroll/ScrollEngine";
import JsonLd from "@/components/seo/JsonLd";
import { FAQS } from "@/data/content-data";
import { SERVICE_CARDS } from "@/data/services";
import { SITE_URL, BUSINESS_ID, WEBSITE_ID, abs, businessNode, websiteNode, breadcrumbNode, faqNode } from "@/lib/site";

const TITLE = "Kellersanierung Wuppertal ohne Aufgraben | sos-abdichtung";
const DESCRIPTION =
  "Kellersanierung Wuppertal ohne Aufgraben: nasse Keller trockenlegen. SchimmelPeter® Partner, kostenlose Messung, 10 Jahre Garantie auf die Arbeit.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/", type: "website", locale: "de_DE", siteName: "sos-abdichtung" },
};

export default function Home() {
  const graph = [
    businessNode(),
    websiteNode(),
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: abs("/"),
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "de-DE",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
      breadcrumb: { "@id": `${SITE_URL}/#breadcrumb` },
    },
    { ...breadcrumbNode([{ name: "Startseite", path: "/" }]), "@id": `${SITE_URL}/#breadcrumb` },
    {
      "@type": "ItemList",
      name: "Leistungen",
      itemListElement: SERVICE_CARDS.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: abs(`/leistungen/${s.slug}/`),
        name: s.title,
      })),
    },
    faqNode(FAQS),
  ];

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SC_BOOT }} />
      <JsonLd graph={graph} />
      <span data-sc-progress aria-hidden="true" />
      <div className="sc-grain" aria-hidden="true" />
      <Navbar />
      <main id="main">
        <Hero />
        <Tension />
        <ScannerSection />
        <LayersAct />
        <ServicesRail />
        <ProcessSection />
        <CostCalculator />
        <RegionSection />
        <FaqSection />
        <ContactForm />
      </main>
      <Footer />
      <GrokLeadBot />
      <ScrollEngine />
    </>
  );
}
