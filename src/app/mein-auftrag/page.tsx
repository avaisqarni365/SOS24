import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import CustomerPortalClient from "@/components/portal/CustomerPortalClient";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/SubpageParts";
import { SITE_URL, BUSINESS_ID, WEBSITE_ID, abs, breadcrumbNode, OG_IMAGE } from "@/lib/site";

const TITLE = "Mein Auftrag & Status | sos-abdichtung";
const DESCRIPTION =
  "Live Kunden-Portal für Sanierungsaufträge, Google Drive Foto-Upload, Termine und GoBD-Angebote bei sos-abdichtung.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/mein-auftrag/" },
  // Private: kept out of search results (and out of the sitemap).
  robots: { index: false, follow: false },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/mein-auftrag/",
    type: "website",
    locale: "de_DE",
    siteName: "sos-abdichtung",
    images: [OG_IMAGE],
  },
};

export default function CustomerPortalPage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Mein Auftrag", path: "/mein-auftrag/" },
  ];

  const graph = [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/mein-auftrag/#webpage`,
      url: abs("/mein-auftrag/"),
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "de-DE",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
      breadcrumb: { "@id": `${SITE_URL}/mein-auftrag/#breadcrumb` },
    },
    {
      ...breadcrumbNode(crumbs),
      "@id": `${SITE_URL}/mein-auftrag/#breadcrumb`,
    },
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main" className="min-h-screen bg-canvas text-ink pt-20 sm:pt-24 lg:pt-32 pb-20 overflow-x-clip">
        <h1 className="sr-only">Mein Auftrag &amp; Schadensstatus</h1>
        <div className="sc-wrap">
          <CustomerPortalClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
