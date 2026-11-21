import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs, FaqList, LinkGrid } from "@/components/seo/SubpageParts";
import { ApplyButtons, Chips, RoleCard } from "@/components/seo/JobParts";
import { CITY_PAGES } from "@/data/seo-pages";
import { JOB_FAQS, JOB_KEYWORDS, JOB_ROLES } from "@/data/jobs";
import { WEBSITE_ID, abs, businessNode, websiteNode, breadcrumbNode, faqNode, OG_IMAGE } from "@/lib/site";
import { hy } from "@/lib/hyphenate";

const PATH = "/jobs/";
const TITLE = "Jobs Essen: Vollzeit, Teilzeit, Minijob, Studentenjob";
const DESCRIPTION =
  "Jobs bei sos-abdichtung in Essen: Abdichter / Bauhelfer in Vollzeit, Teilzeit oder Minijob, Studentenjob. Baustellen im Ruhrgebiet. Jetzt bewerben.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
};

export default function JobsPage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Jobs", path: PATH },
  ];
  const graph = [
    businessNode(),
    websiteNode(),
    {
      "@type": "CollectionPage",
      "@id": `${abs(PATH)}#webpage`,
      url: abs(PATH),
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "de-DE",
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${abs(PATH)}#breadcrumb` },
      primaryImageOfPage: { "@type": "ImageObject", url: abs(OG_IMAGE.url), width: OG_IMAGE.width, height: OG_IMAGE.height },
      significantLink: JOB_ROLES.map((r) => abs(`/jobs/${r.slug}/`)),
    },
    { ...breadcrumbNode(crumbs), "@id": `${abs(PATH)}#breadcrumb` },
    faqNode(JOB_FAQS),
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main">
        <section className="sc-page-top" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-6 max-w-4xl text-[2.4rem] leading-[1.04] sm:text-5xl lg:text-[3.6rem]">
              Jobs bei sos-abdichtung: Vollzeit, Teilzeit, Minijob und Studentenjob
            </h1>
            <p className="sc-lede mt-6 max-w-3xl text-ink font-medium">
              {hy(
                "Wir sind ein Handwerksbetrieb für Kellersanierung und Bautenschutz mit Sitz in Essen. Für unsere Baustellen im Ruhrgebiet und im Bergischen Land suchen wir Verstärkung: einen Abdichter oder Bauhelfer in Vollzeit, eine Aushilfe in Teilzeit oder als Minijob und einen Werkstudenten. Bewerben können Sie sich in zwei Minuten per WhatsApp.",
              )}
            </p>
            <div className="mt-8">
              <ApplyButtons what="Jobs bei sos-abdichtung" />
            </div>
            <div className="mt-8">
              <Chips items={JOB_KEYWORDS} label="Arten von Stellen" />
            </div>
          </div>
        </section>

        <section className="surface-bone-2 sc-section" aria-labelledby="roles-title">
          <div className="sc-wrap">
            <div className="max-w-3xl">
              <p className="sc-label text-accent-deep font-bold">Offene Stellen</p>
              <h2 id="roles-title" className="sc-display mt-3 text-3xl sm:text-4xl text-ink">
                Drei Stellenangebote, ein Team
              </h2>
            </div>
            <ul className="mt-10 grid gap-4 lg:grid-cols-3">
              {JOB_ROLES.map((r) => (
                <RoleCard key={r.slug} role={r} />
              ))}
            </ul>
          </div>
        </section>

        <section className="surface-bone sc-section">
          <div className="sc-wrap grid gap-12">
            <LinkGrid
              title="Jobs nach Stadt: wo wir arbeiten"
              links={CITY_PAGES.map((c) => ({ href: `/jobs/${c.slug}/`, label: `Jobs in ${c.name}`, sub: "Vollzeit, Teilzeit, Minijob, Studentenjob" }))}
            />
            <FaqList faqs={JOB_FAQS} title="Fragen zur Bewerbung" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
