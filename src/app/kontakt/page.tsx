import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ContactForm from "@/components/sections/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/SubpageParts";
import { abs, businessNode, websiteNode, breadcrumbNode, BUSINESS_ID, WEBSITE_ID, OG_IMAGE } from "@/lib/site";

const TITLE = "Kontakt: kostenlose Feuchtemessung anfragen | sos-abdichtung";
const DESCRIPTION =
  "Kostenlose Feuchtemessung in Wuppertal und PLZ 42 anfragen: per Telefon, WhatsApp oder Formular. Shahzad Mahmood meldet sich meist noch am selben Tag.";
const PATH = "/kontakt/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
};

/** The contact on its own page: the landing page links here from its footer. */
export default function KontaktPage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Kontakt", path: PATH },
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
      <main id="main" className="contact-page">
        <section className="sc-page-top contact-page__top" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-5">
              Kontakt: <em>kostenlose Feuchtemessung.</em>
            </h1>
            <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
              <div className="text-emerald-950 font-medium">
                📅 <strong>Direkten Vor-Ort-Wunschtermin buchen?</strong> Nutzen Sie unseren interaktiven Online-Terminplaner.
              </div>
              <a
                href="/termin/"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shrink-0 transition-colors shadow-xs"
              >
                Zum Online-Terminplaner →
              </a>
            </div>
          </div>
        </section>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
