import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ContactForm from "@/components/sections/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs, LayerStack, Prose, FaqList, LinkGrid } from "@/components/seo/SubpageParts";
import { CITY_PAGES } from "@/data/seo-pages";
import { SERVICE_CARDS } from "@/data/services";
import { COMPANY_INFO } from "@/data/content-data";
import { BUSINESS_ID, WEBSITE_ID, abs, businessNode, websiteNode, breadcrumbNode, faqNode, OG_IMAGE } from "@/lib/site";
import { hy } from "@/lib/hyphenate";

export const dynamicParams = false;

export function generateStaticParams() {
  return CITY_PAGES.map((c) => ({ city: c.slug }));
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  const page = CITY_PAGES.find((c) => c.slug === params.city);
  if (!page) return {};
  const path = `/kellersanierung/${page.slug}/`;
  return {
    title: page.title,
    description: page.metaDescription,
    alternates: { canonical: path },
    openGraph: { title: page.title, description: page.metaDescription, url: path, type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
  };
}

export default function CityPage({ params }: { params: { city: string } }) {
  const page = CITY_PAGES.find((c) => c.slug === params.city);
  if (!page) notFound();
  const path = `/kellersanierung/${page.slug}/`;
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Servicegebiet", path: "/#servicegebiet" },
    { name: `Kellersanierung ${page.name}`, path },
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
      name: `Kellersanierung ${page.name}`,
      serviceType: "Kellersanierung",
      description: page.lede,
      url: abs(path),
      provider: { "@id": BUSINESS_ID },
      areaServed: {
        "@type": "City",
        name: page.name,
        geo: { "@type": "GeoCoordinates", latitude: page.geo.lat, longitude: page.geo.lng },
      },
    },
    faqNode(page.faqs),
  ];

  const nearby = page.nearby
    .map((slug) => CITY_PAGES.find((c) => c.slug === slug))
    .filter(Boolean)
    .map((c) => ({ href: `/kellersanierung/${c!.slug}/`, label: `Kellersanierung ${c!.name}` }));

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main">
        <section className="sc-page-top" aria-labelledby="page-title">
          <div className="sc-wrap grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <Breadcrumbs items={crumbs} />
              <h1 id="page-title" className="sc-display mt-6 text-[2.4rem] leading-[1.04] sm:text-5xl lg:text-[3.8rem]">
                {page.h1}
              </h1>
              <p className="sc-lede mt-6 text-[var(--sc-ink-soft)]">{hy(page.lede)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#kontakt" className="inline-flex min-h-[48px] items-center rounded-full bg-[var(--bone)] px-6 text-sm font-semibold text-[var(--ink)] hover:bg-white">
                  Kostenlose Feuchtemessung anfragen <span aria-hidden="true">&nbsp;→</span>
                </a>
                <a href={`tel:${COMPANY_INFO.phoneTel}`} className="inline-flex min-h-[48px] items-center rounded-full border border-line/20 px-6 text-sm font-semibold hover:border-[var(--mint)]">
                  {COMPANY_INFO.phoneDisplay}
                </a>
              </div>
              <dl className="mt-12 grid gap-6 sm:grid-cols-3">
                <div>
                  <dt className="sc-label">Vor Ort in</dt>
                  <dd className="mt-2 font-editorial text-3xl">{page.responseTime}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="sc-label">Stadtteile</dt>
                  <dd className="no-justify mt-2 text-sm text-[var(--bone)]/85">{page.districts.join(" · ")}</dd>
                </div>
                <div className="sm:col-span-3">
                  <dt className="sc-label">Postleitzahlen</dt>
                  <dd className="no-justify mt-2 font-mono text-sm text-[var(--bone)]/75">{page.plz.join(" ")}</dd>
                </div>
              </dl>
            </div>
            <LayerStack layers={page.localFactors} title={`Warum Keller in ${page.name} feucht werden`} />
          </div>
        </section>

        <section className="surface-bone sc-section">
          <div className="sc-wrap">
            <Prose sections={page.sections} />
          </div>
        </section>

        <section className="surface-bone-2 sc-section">
          <div className="sc-wrap grid gap-12">
            <LinkGrid
              title={`Leistungen in ${page.name}`}
              links={SERVICE_CARDS.map((s) => ({ href: `/leistungen/${s.slug}/`, label: s.title }))}
            />
            <FaqList faqs={page.faqs} title={`Fragen aus ${page.name}`} />
            {nearby.length > 0 && <LinkGrid title="In der Nähe" links={nearby} />}
          </div>
        </section>

        <ContactForm place={page.name} />
      </main>
      <Footer />
    </>
  );
}
