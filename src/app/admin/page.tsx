import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import AdminPortalClient from "@/components/admin/AdminPortalClient";
import JsonLd from "@/components/seo/JsonLd";
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
      ...breadcrumbNode([
        { name: "Startseite", path: "/" },
        { name: "Admin & Backoffice", path: "/admin/" },
      ]),
      "@id": `${SITE_URL}/admin/#breadcrumb`,
    },
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main" className="min-h-screen bg-surface-100 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full mb-2">
              SOS Abdichtung · Cloud Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
              Admin-Portal &amp; GoBD-Backoffice
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Schadensanfragen, Google Drive Schadensfotos, digitale Auftragsunterschriften, Vor-Ort-Checkliste und GoBD-Rechnungen verwalten.
            </p>
          </div>
          <AdminPortalClient />
        </div>
      </main>
      <Footer />
    </>
  );
}
