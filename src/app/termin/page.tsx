import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import OnlineAppointmentBooking from "@/components/sections/OnlineAppointmentBooking";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/SubpageParts";
import { abs, businessNode, websiteNode, breadcrumbNode, BUSINESS_ID, WEBSITE_ID, OG_IMAGE } from "@/lib/site";

const TITLE = "Online-Termin buchen: Vor-Ort-Messung | sos-abdichtung";
const DESCRIPTION =
  "Wunschtermin für kostenlose Feuchtemessung vor Ort in ganz NRW buchen: Inhaber Shahzad Mahmood prüft Ihren Keller persönlich mit elektronischer Messtechnik.";
const PATH = "/termin/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
    type: "website",
    locale: "de_DE",
    siteName: "sos-abdichtung",
    images: [OG_IMAGE],
  },
};

/** Dedicated standalone appointment booking page for Google Business Profile and direct campaigns. */
export default function TerminPage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Termin buchen", path: PATH },
  ];
  const graph = [
    businessNode(),
    websiteNode(),
    {
      "@type": "ContactPage",
      "@id": `${abs(PATH)}#webpage`,
      url: abs(PATH),
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "de-DE",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
      breadcrumb: { "@id": `${abs(PATH)}#breadcrumb` },
    },
    { ...breadcrumbNode(crumbs), "@id": `${abs(PATH)}#breadcrumb` },
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main" className="appointment-page pt-24 sm:pt-28">
        <section className="sc-page-top" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-5 text-3xl sm:text-4xl lg:text-5xl font-black text-[#0f2537]">
              Vor-Ort-Termin: <em>kostenlose Feuchtemessung.</em>
            </h1>
            <p className="mt-3 text-slate-600 max-w-2xl text-base sm:text-lg">
              Wählen Sie Ihren Wunschtermin direkt im Kalender. Inhaber Shahzad Mahmood kommt persönlich mit professioneller CM- und dielektrischer Messtechnik zu Ihnen vor Ort – 100 % kostenfrei und unverbindlich in ganz NRW.
            </p>
          </div>
        </section>
        <OnlineAppointmentBooking />
      </main>
      <Footer />
    </>
  );
}
