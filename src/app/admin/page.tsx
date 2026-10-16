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
      <main id="main" className="min-h-screen bg-canvas text-ink pb-24 lg:pb-16 overflow-x-clip">
        <section className="sc-page-top" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-4">
              Admin-Portal &amp; <em>GoBD-Backoffice.</em>
            </h1>
            <p className="text-sm sm:text-base text-ink-soft mt-2 max-w-3xl font-plex">
              Schadensanfragen, Google Drive Schadensfotos, digitale Auftragsunterschriften, Vor-Ort-Checkliste und GoBD-Rechnungen auf Smartphone, Tablet und Desktop verwalten.
            </p>
          </div>
        </section>
        <div className="sc-wrap mt-6 sm:mt-8">
          <AdminPortalClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
