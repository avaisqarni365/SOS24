import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ContactForm from "@/components/sections/ContactForm";
import GrokLeadBot from "@/components/ai/GrokLeadBot";
import LayersAct from "@/components/scroll/LayersAct";
import ProofSection from "@/components/science/ProofSection";
import ChemistryLab from "@/components/science/ChemistryLab";
import KitShowcase from "@/components/sections/KitShowcase";
import ScienceSection from "@/components/science/ScienceSection";
import { ScannerSection } from "@/components/scroll/HomeSections";
import JsonLd from "@/components/seo/JsonLd";
import { CHEMISTRY } from "@/data/chemistry";
import { SITE_URL, BUSINESS_ID, WEBSITE_ID, abs, businessNode, websiteNode, breadcrumbNode, OG_IMAGE } from "@/lib/site";

const TITLE = "Scientific Lab | Verfahren, Chemie & Nachweis";
const DESCRIPTION =
  "Jedes Verfahren im 3D-Modell, die chemische Reaktion dahinter, der Feuchte-Scanner und der Messnachweis in jeder Phase der Sanierung.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/labor/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/labor/", type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
};

/**
 * The Scientific Lab: everything that explains the trade, on one page.
 * The landing page carries no 3D and no physics at all now — it says what we
 * do and how to reach us. Anyone who wants the evidence comes here and gets
 * the model, the reaction, the measurement and the proof, per service.
 */
export default function LaborPage() {
  const graph = [
    businessNode(),
    websiteNode(),
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/labor/#webpage`,
      url: abs("/labor/"),
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "de-DE",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
      breadcrumb: { "@id": `${SITE_URL}/labor/#breadcrumb` },
    },
    {
      ...breadcrumbNode([
        { name: "Startseite", path: "/" },
        { name: "Scientific Lab", path: "/labor/" },
      ]),
      "@id": `${SITE_URL}/labor/#breadcrumb`,
    },
  ];

  const JUMPS = [
    { href: "#modell", label: "Verfahren im 3D-Modell" },
    { href: "#chemie", label: "Chemische Reaktion" },
    { href: "#material", label: "Geräte & Material" },
    { href: "#feuchte-scanner", label: "Feuchte-Scanner" },
    { href: "#nachweis", label: "Nachweis je Phase" },
    { href: "#physik", label: "Physik je Leistung" },
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main">
        <section className="band-ink lab-top" aria-labelledby="lab-title">
          <div className="sc-wrap">
            <p className="sc-label">Scientific Lab</p>
            <h1 id="lab-title" className="sc-display mt-4">
              Der Nachweis, <em>nicht die Behauptung.</em>
            </h1>
            <p className="sc-lede mt-6">
              Jedes Verfahren im Modell, die Reaktion im Mauerwerk als Gleichung, die
              Messung, die sie belegt. Nachrechnen erwünscht.
            </p>
            <nav className="lab-jump" aria-label="Kapitel">
              {JUMPS.map((j) => (
                <a key={j.href} href={j.href}>
                  {j.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        <LayersAct id="modell" />
        <ChemistryLab />
        <KitShowcase id="material" />
        <ScannerSection />
        <ProofSection />

        <section id="physik" className="sc-section" aria-labelledby="physik-title">
          <div className="sc-wrap">
            <p className="sc-label">Physik je Leistung</p>
            <h2 id="physik-title" className="sc-display mt-4 max-w-[20ch]">
              Neun Leistungen, <em>ein Nachweis.</em>
            </h2>
          </div>
        </section>
        {CHEMISTRY.map((c) => (
          <ScienceSection key={c.slug} slug={c.slug} />
        ))}

        <ContactForm />
      </main>
      <Footer />
      <GrokLeadBot />
    </>
  );
}
