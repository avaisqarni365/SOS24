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
        {/* no sc-page-top here: its 6.5rem on top of the header left a blank band above the
            heading; the form should be the first thing a phone shows after it */}
        <section className="contact-page__top pt-[5.5rem] sm:pt-28 lg:pt-36" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-3">
              Kontakt: <em>kostenlose Feuchtemessung.</em>
            </h1>
            <p className="mt-2 text-sm sm:text-base">
              Lieber gleich einen Tag aussuchen?{" "}
              <a href="/termin/" className="font-bold underline underline-offset-2">
                Zum Online-Terminplaner →
              </a>
            </p>
          </div>
        </section>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
