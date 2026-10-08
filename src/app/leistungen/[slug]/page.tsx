import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ContactForm from "@/components/sections/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import ScienceSection from "@/components/science/ScienceSection";
import LayersAct from "@/components/scroll/LayersAct";
import { ScannerSection } from "@/components/scroll/HomeSections";
import { SERVICE_FACTS, SERVICE_SCENES } from "@/data/service-facts";
import ScrollEngine, { SC_BOOT } from "@/components/scroll/ScrollEngine";
import { SCIENCE } from "@/data/science";
import { Prose, FaqList, LinkGrid, TechnicalLayersFrame } from "@/components/seo/SubpageParts";
import { ServiceHero, ServiceOverview, ServiceSteps, ServiceKit } from "@/components/service/ServiceParts";
import ChapterNav from "@/components/service/ChapterNav";
import { SERVICE_FILMS } from "@/data/films";
import { KIT } from "@/data/kit";
import { SERVICE_PAGES, CITY_PAGES } from "@/data/seo-pages";
import { BUSINESS_ID, WEBSITE_ID, abs, businessNode, websiteNode, breadcrumbNode, faqNode, OG_IMAGE } from "@/lib/site";

const DAMAGE_BY_SLUG: Record<string, string> = {
  kellersanierung: "Nasser Keller / Drückendes Hangwasser",
  horizontalsperre: "Feuchte Kellerwände / Horizontalsperre",
  kellerinnenabdichtung: "Nasser Keller / Drückendes Hangwasser",
  schimmelbeseitigung: "Schimmelbefall & Geruch",
  feuchtemessung: "Allgemeine Feuchtigkeitsmessung",
  rissverpressung: "Wasserführender Riss",
};

/** services with at least one instrument or material in the kit */
const KIT_SLUGS = new Set(KIT.flatMap((k) => k.services.map((s) => s.slug)));

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_PAGES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = SERVICE_PAGES.find((s) => s.slug === params.slug);
  if (!page) return {};
  const path = `/leistungen/${page.slug}/`;
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: path },
    openGraph: { title: page.title, description: page.metaDescription, url: path, type: "article", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const page = SERVICE_PAGES.find((s) => s.slug === params.slug);
  if (!page) notFound();
  const path = `/leistungen/${page.slug}/`;
  const faqs = [...page.faqs, ...(SCIENCE[page.slug]?.faqs ?? [])];
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Leistungen", path: "/leistungen/" },
    { name: page.navTitle, path },
  ];

  const graph = [
    businessNode(),
    websiteNode(),
    {
      "@type": "WebPage",
      "@id": `${abs(path)}#webpage`,
      url: abs(path),
      name: page.title,
      description: page.metaDescription,
      inLanguage: "de-DE",
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${abs(path)}#breadcrumb` },
    },
    { ...breadcrumbNode(crumbs), "@id": `${abs(path)}#breadcrumb` },
    {
      "@type": "Service",
      "@id": `${abs(path)}#service`,
      name: page.navTitle,
      serviceType: page.keyword,
      description: page.lede,
      url: abs(path),
      provider: { "@id": BUSINESS_ID },
      areaServed: CITY_PAGES.map((c) => ({ "@type": "City", name: c.name })),
    },
    faqNode(faqs),
  ];

  const related = page.related
    .map((slug) => SERVICE_PAGES.find((s) => s.slug === slug))
    .filter(Boolean)
    .map((s) => ({ href: `/leistungen/${s!.slug}/`, label: s!.navTitle }));

  const chapters = [
    { id: "ueberblick", label: "Überblick" },
    { id: "ablauf", label: "Ablauf" },
    ...(KIT_SLUGS.has(page.slug) ? [{ id: "material", label: "Material" }] : []),
    { id: "technik", label: "Technik" },
    { id: "wissen", label: "Wissen" },
    { id: "fragen", label: "Fragen" },
    { id: "kontakt", label: "Kontakt" },
  ];

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SC_BOOT }} />
      <JsonLd graph={graph} />
      <span data-sc-progress aria-hidden="true" />
      <Navbar />
      <main id="main" className="svc-page">
        <ServiceHero h1={page.h1} lede={page.lede} navTitle={page.navTitle} crumbs={crumbs} film={SERVICE_FILMS[page.slug]} />
        <ChapterNav items={chapters} label={`Kapitel: ${page.navTitle}`} />

        <ServiceOverview facts={SERVICE_FACTS[page.slug] ?? []} symptoms={page.symptoms} navTitle={page.navTitle} />
        <ServiceSteps steps={page.steps} navTitle={page.navTitle} />
        <ServiceKit slug={page.slug} navTitle={page.navTitle} />

        <div id="technik" className="svc-chapter">
          <TechnicalLayersFrame layers={page.layers} serviceName={page.navTitle} />
          {SERVICE_SCENES[page.slug] ? (
            <LayersAct
              ids={SERVICE_SCENES[page.slug]}
              id="verfahren-3d"
              label="Das Verfahren in 3D"
              title={
                <>
                  {page.navTitle}, <em>Schritt für Schritt.</em>
                </>
              }
              intro="Jeder Schritt im Bild, mit Material, Zahlen und Messwerten. Mit „In 3D drehen“ lädt das Modell: drehen, zoomen und jede Schicht antippen."
            />
          ) : null}
        </div>

        <div id="wissen" className="svc-chapter">
          <ScienceSection slug={page.slug} />
          {page.slug === "feuchtemessung" ? <ScannerSection /> : null}
          <section className="sc-section svc-prose" aria-label={`Wissenswertes zur ${page.navTitle}`}>
            <div className="sc-wrap">
              <Prose
                sections={page.sections}
                title={`Wissenswertes zur ${page.navTitle}`}
                subtitle="Ursachen, bautechnische Zusammenhänge und dauerhafte Lösungen, kurz erklärt."
              />
            </div>
          </section>
        </div>

        <section id="fragen" className="sc-section svc-faq" aria-label={`Fragen zu ${page.navTitle}`}>
          <div className="sc-wrap grid gap-12">
            <FaqList faqs={faqs} title={`Fragen zu ${page.navTitle}`} />
            <LinkGrid title="Verwandte Leistungen" links={related} />
            <LinkGrid
              title={`${page.navTitle} in Ihrer Stadt`}
              links={CITY_PAGES.map((c) => ({ href: `/kellersanierung/${c.slug}/`, label: c.name, sub: `Reaktion ${c.responseTime}` }))}
            />
          </div>
        </section>

        <ContactForm defaultDamage={DAMAGE_BY_SLUG[page.slug]} />
      </main>
      <Footer />
      <ScrollEngine />
    </>
  );
}

