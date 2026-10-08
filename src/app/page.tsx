import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import GrokLeadBot from "@/components/ai/GrokLeadBot";
import Hero from "@/components/scroll/Hero";
import { ServicesRail } from "@/components/scroll/HomeSections";
import MoreLinks from "@/components/sections/MoreLinks";
import HomeSteps from "@/components/sections/HomeSteps";
import ScrollSectionRail from "@/components/navigation/ScrollSectionRail";
import ScrollEngine, { SC_BOOT } from "@/components/scroll/ScrollEngine";
import JsonLd from "@/components/seo/JsonLd";
import { SERVICE_CARDS } from "@/data/services";
import { SITE_URL, BUSINESS_ID, WEBSITE_ID, abs, businessNode, websiteNode, breadcrumbNode, OG_IMAGE } from "@/lib/site";

const TITLE = "Kellersanierung Wuppertal ohne Aufgraben | sos-abdichtung";
const DESCRIPTION =
  "Kellersanierung Wuppertal ohne Aufgraben: nasse Keller trockenlegen. SchimmelPeter® Partner, kostenlose Messung, 10 Jahre Garantie auf die Arbeit.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/", type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
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
  ];

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SC_BOOT }} />
      <JsonLd graph={graph} />
      <span data-sc-progress aria-hidden="true" />
      <div className="sc-grain" aria-hidden="true" />
      <Navbar />
      <ScrollSectionRail />
      {/* Four stops and the footer: the first frame (claim, call, WhatsApp,
          the figures and the film), the services and one row of links to
          the detail pages, then the four steps from the call to the dry wall.
          The contact form has its own page (/kontakt/); the steps and the
          footer lead there. Who we work for, the service area and the
          FAQ live on /leistungen/, the team in the Galerie, the process and
          the proof in the Scientific Lab. */}
      <main id="main" className="home">
        <Hero />
        <ServicesRail />
        <MoreLinks />
        <HomeSteps />
      </main>
      <Footer />
      <GrokLeadBot />
      <ScrollEngine />
    </>
  );
}
