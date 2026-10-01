import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ContactForm from "@/components/sections/ContactForm";
import PictureGallery from "@/components/sections/PictureGallery";
import JsonLd from "@/components/seo/JsonLd";
import ScrollEngine, { SC_BOOT } from "@/components/scroll/ScrollEngine";
import { Breadcrumbs } from "@/components/seo/SubpageParts";
import { abs, businessNode, websiteNode, breadcrumbNode, OG_IMAGE } from "@/lib/site";
import { hy } from "@/lib/hyphenate";

const TITLE = "Galerie: Schadensbilder und Sanierung | sos-abdichtung";
const DESCRIPTION =
  "Bilder aus der Praxis: feuchte Keller, Salzränder, Schimmel und die Arbeitsschritte der Sanierung, aus dem SchimmelPeter®-Netzwerk im Raum PLZ 42.";
const PATH = "/galerie/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
};

export default function GaleriePage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Galerie", path: PATH },
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
              Galerie: <em>Schadensbilder und Sanierung</em>
            </h1>
            <p className="sc-lede mt-5 max-w-3xl text-[var(--sc-ink-soft)]">
              {hy("Typische Schäden und die Arbeitsschritte der Sanierung, aus dem SchimmelPeter®-Netzwerk. Filtern Sie nach Thema und öffnen Sie jedes Bild groß.")}
            </p>
          </div>
        </section>
        <PictureGallery />
        <ContactForm />
      </main>
      <Footer />
      <ScrollEngine />
    </>
  );
}
