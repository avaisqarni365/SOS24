import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import AdminPortalClient from "@/components/admin/AdminPortalClient";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/SubpageParts";
import { SITE_URL, BUSINESS_ID, WEBSITE_ID, abs, breadcrumbNode, OG_IMAGE } from "@/lib/site";

const TITLE = "Admin & Backoffice | sos-abdichtung Wuppertal";
const DESCRIPTION =
  "Internes Admin-Portal und Backoffice für sos-abdichtung (Shahzad Mahmood): Schadensanfragen, Google Drive Fotos, GoBD-Belege und Termine verwalten.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/admin/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/admin/",
    type: "website",
    locale: "de_DE",
    siteName: "sos-abdichtung",
    images: [OG_IMAGE],
  },
};

export default function AdminPage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Admin & Backoffice", path: "/admin/" },
  ];

  const graph = [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/admin/#webpage`,
      url: abs("/admin/"),
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "de-DE",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
      breadcrumb: { "@id": `${SITE_URL}/admin/#breadcrumb` },
    },
    {
      ...breadcrumbNode(crumbs),
      "@id": `${SITE_URL}/admin/#breadcrumb`,
    },
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main" className="min-h-screen bg-canvas text-ink pt-20 sm:pt-24 lg:pt-32 pb-20 overflow-x-clip">
        <h1 className="sr-only">Admin-Portal &amp; GoBD-Backoffice</h1>
        <div className="sc-wrap">
          <AdminPortalClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
