import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ContactForm from "@/components/sections/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import ServiceArt from "@/components/brand/ServiceArt";
import ScienceSection from "@/components/science/ScienceSection";
import ScrollEngine, { SC_BOOT } from "@/components/scroll/ScrollEngine";
import { SCIENCE } from "@/data/science";
import { PHOTOS, type PhotoKey } from "@/data/photos";
import { Breadcrumbs, LayerStack, Prose, FaqList, LinkGrid } from "@/components/seo/SubpageParts";
import { SERVICE_PAGES, CITY_PAGES } from "@/data/seo-pages";
import { SERVICE_CARDS } from "@/data/services";
import { COMPANY_INFO } from "@/data/content-data";
import { BUSINESS_ID, WEBSITE_ID, abs, businessNode, websiteNode, breadcrumbNode, faqNode, OG_IMAGE } from "@/lib/site";
import { hy } from "@/lib/hyphenate";

const DAMAGE_BY_SLUG: Record<string, string> = {
  kellersanierung: "Nasser Keller / Drückendes Hangwasser",
  horizontalsperre: "Feuchte Kellerwände / Horizontalsperre",
  kellerinnenabdichtung: "Nasser Keller / Drückendes Hangwasser",
  schimmelbeseitigung: "Schimmelbefall & Geruch",
  feuchtemessung: "Allgemeine Feuchtigkeitsmessung",
  rissverpressung: "Wasserführender Riss",
};

/** Header photo per service: the damage the page is about (SchimmelPeter partner photos). */
const HEADER_PHOTO: Record<string, PhotoKey> = {
  kellersanierung: "mouldTideMark",
  horizontalsperre: "risingDamp",
  kellerinnenabdichtung: "plastering",
  schimmelbeseitigung: "mouldCorner",
  feuchtemessung: "infographic",
  rissverpressung: "crackRepair",
};

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
  const card = SERVICE_CARDS.find((c) => c.slug === page.slug);
  const path = `/leistungen/${page.slug}/`;
  const faqs = [...page.faqs, ...(SCIENCE[page.slug]?.faqs ?? [])];
  const photo = PHOTOS[HEADER_PHOTO[page.slug]];
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Leistungen", path: "/#leistungen" },
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

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SC_BOOT }} />
      <JsonLd graph={graph} />
      <span data-sc-progress aria-hidden="true" />
      <Navbar />
      <main id="main">
        <section className="relative overflow-hidden pb-16 pt-28 sm:pb-24 sm:pt-36" aria-labelledby="page-title">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
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
                <a href={`tel:${COMPANY_INFO.phoneTel}`} className="inline-flex min-h-[48px] items-center rounded-full border border-white/20 px-6 text-sm font-semibold hover:border-[var(--mint)]">
                  {COMPANY_INFO.phoneDisplay}
                </a>
              </div>
              <h2 className="sc-label mt-12">Typische Anzeichen</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {page.symptoms.map((s) => (
                  <li key={s} className="no-justify rounded-full border border-white/10 bg-[var(--ink-2)] px-4 py-2 text-sm text-[var(--bone)]/85">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-5">
              {photo ? (
                <figure className="m-0 overflow-hidden rounded-3xl border border-white/10 bg-[var(--ink-2)]">
                  <img
                    src={photo.src}
                    srcSet={photo.src2x ? `${photo.src} ${photo.w}w, ${photo.src2x} 960w` : undefined}
                    sizes="(max-width: 1024px) 92vw, 40vw"
                    width={photo.w}
                    height={photo.h}
                    alt={photo.alt}
                    fetchPriority="high"
                    decoding="async"
                    className="h-auto w-full"
                  />
                  <figcaption className="px-4 py-2 text-right text-[0.7rem] text-[var(--sc-ink-soft)]">Foto: SchimmelPeter®</figcaption>
                </figure>
              ) : (
                card && (
                  <div className="overflow-hidden rounded-3xl border border-white/10" aria-hidden="true">
                    <div className="aspect-[16/10]">
                      <ServiceArt kind={card.art} />
                    </div>
                  </div>
                )
              )}
              <LayerStack layers={page.layers} title="Schicht für Schicht" />
            </div>
          </div>
        </section>

        <ScienceSection slug={page.slug} />

        <section className="surface-bone py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 sm:px-8 lg:grid-cols-[1fr_22rem]">
            <Prose sections={page.sections} />
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl bg-white p-7 shadow-sm">
                <h2 className="font-editorial text-2xl text-[var(--head-on-bone)]">So läuft es ab</h2>
                <ol className="mt-5 grid gap-5">
                  {page.steps.map((s, i) => (
                    <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--mint)] font-mono text-xs font-bold text-[var(--ink)]" aria-hidden="true">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-[var(--head-on-bone)]">{s.title}</h3>
                        <p className="mt-1 text-sm text-[var(--text-on-bone)]">{hy(s.text)}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </section>

        <section className="surface-bone-2 py-20 sm:py-24">
          <div className="mx-auto grid max-w-5xl gap-16 px-6 sm:px-8">
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
