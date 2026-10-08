import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import ContactForm from "@/components/sections/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import ServiceArt from "@/components/brand/ServiceArt";
import ScienceSection from "@/components/science/ScienceSection";
import FactsStrip from "@/components/sections/FactsStrip";
import LayersAct from "@/components/scroll/LayersAct";
import { ScannerSection } from "@/components/scroll/HomeSections";
import { SERVICE_FACTS, SERVICE_SCENES } from "@/data/service-facts";
import ScrollEngine, { SC_BOOT } from "@/components/scroll/ScrollEngine";
import { SCIENCE } from "@/data/science";
import { PHOTOS, type PhotoKey } from "@/data/photos";
import { Breadcrumbs, Prose, FaqList, LinkGrid, SymptomsFrame, ProcessSteps, TechnicalLayersFrame } from "@/components/seo/SubpageParts";
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
  dachabdichtung: "verticalBarrier",
  "balkon-terrasse": "renovatedRoom",
  sockelabdichtung: "exteriorDrainage",
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

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SC_BOOT }} />
      <JsonLd graph={graph} />
      <span data-sc-progress aria-hidden="true" />
      <Navbar />
      <main id="main">
        {/* Frame 1: Hero */}
        <section className="sc-page-top relative overflow-hidden" aria-labelledby="page-title">
          <div className="sc-wrap grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <Breadcrumbs items={crumbs} />
              
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent-deep/20 bg-accent-deep/10 px-3.5 py-1 text-xs font-semibold text-accent-deep">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-deep" />
                <span>Ohne Aufgraben · Festpreisgarantie · 10 J. Garantie</span>
              </div>

              <h1 id="page-title" className="sc-display mt-4 text-[2.2rem] leading-[1.06] sm:text-5xl lg:text-[3.6rem]">
                {page.h1}
              </h1>
              
              <p className="sc-lede mt-5 text-ink font-medium max-w-2xl">{hy(page.lede)}</p>
              
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#kontakt" className="btn-shine inline-flex min-h-[48px] items-center rounded-full px-6 text-sm font-semibold shadow-sm hover:opacity-95 transition-opacity">
                  Kostenlose Feuchtemessung anfragen <span aria-hidden="true">&nbsp;→</span>
                </a>
                <a href={`tel:${COMPANY_INFO.phoneTel}`} className="inline-flex min-h-[48px] items-center rounded-full border border-line/20 bg-surface px-6 text-sm font-semibold text-ink hover:border-accent-deep transition-colors">
                  {COMPANY_INFO.phoneDisplay}
                </a>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-line/10">
                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <span className="text-accent-deep font-bold">✓</span>
                  <span>Kostenlos vor Ort</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <span className="text-accent-deep font-bold">✓</span>
                  <span>Bis zu 60% günstiger</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <span className="text-accent-deep font-bold">✓</span>
                  <span>25 J. SchimmelPeter®</span>
                </div>
              </div>
            </div>

            <div>
              {photo ? (
                <div className="rounded-[28px] border border-line/10 bg-surface p-3.5 shadow-[0_4px_20px_-4px_rgba(16,40,30,0.08),0_16px_40px_-10px_rgba(16,40,30,0.12)] hover:border-[var(--emerald-deep)]/40 hover:shadow-[0_8px_32px_-4px_rgba(16,40,30,0.14),0_24px_52px_-10px_rgba(19,117,93,0.16)] transition-all duration-300">
                  <figure className="group relative m-0 overflow-hidden rounded-[20px] bg-surface-2 aspect-[16/11] border border-ink/5 shadow-inner">
                    <img
                      src={photo.src}
                      srcSet={photo.src2x ? `${photo.src} ${photo.w}w, ${photo.src2x} 960w` : undefined}
                      sizes="(max-width: 1024px) 92vw, 40vw"
                      width={photo.w}
                      height={photo.h}
                      alt={photo.alt}
                      fetchPriority="high"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3.5 py-1.5 text-xs font-bold text-ink shadow-sm backdrop-blur-md border border-canvas/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-deep" />
                      <span>{page.navTitle}</span>
                    </div>
                    <figcaption className="absolute bottom-2.5 right-3 rounded-md bg-ink/70 px-2.5 py-1 text-right text-[0.7rem] font-medium text-canvas/90 backdrop-blur-md">
                      Foto: SchimmelPeter®
                    </figcaption>
                  </figure>
                  <div className="mt-3.5 flex items-center justify-between px-2 py-1 text-xs">
                    <span className="font-semibold text-ink">Fachverfahren: {page.navTitle}</span>
                    <span className="font-mono text-accent-deep font-bold">Geprüft &amp; Zertifiziert</span>
                  </div>
                </div>
              ) : (
                card && (
                  <div className="overflow-hidden rounded-3xl border border-line/12 bg-surface p-3 shadow-md" aria-hidden="true">
                    <div className="aspect-[16/11] overflow-hidden rounded-2xl">
                      <ServiceArt kind={card.art} />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Frame 2: Schadenserkennung & Symptome */}
        <SymptomsFrame symptoms={page.symptoms} serviceName={page.navTitle} />

        {/* Frame 3: Ablauf Schritt für Schritt */}
        <ProcessSteps steps={page.steps} title={`So läuft Ihre ${page.navTitle} ab`} />

        {/* Frame 4: Zahlen & Fakten */}
        {SERVICE_FACTS[page.slug] ? <FactsStrip facts={SERVICE_FACTS[page.slug]} title="Zahlen & Fakten" /> : null}

        {/* Frame 5: Technischer Schichtenaufbau */}
        <TechnicalLayersFrame layers={page.layers} serviceName={page.navTitle} />

        {/* Frame 6: 3D Interaktives Modell */}
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

        {/* Frame 7: Wissenschaft & Bauphysik */}
        <ScienceSection slug={page.slug} />

        {page.slug === "feuchtemessung" ? <ScannerSection /> : null}

        {/* Frame 8: Detaillierte Fachinformationen (Framed Cards) */}
        <section className="surface-bone sc-section border-t border-line/10">
          <div className="sc-wrap">
            <Prose
              sections={page.sections}
              title={`Wissenswertes zur ${page.navTitle}`}
              subtitle="Fundierte Fachinformationen zu Ursachen, bautechnischen Zusammenhängen und nachhaltigen Sanierungslösungen."
            />
          </div>
        </section>

        {/* Frame 9: Häufige Fragen & Verwandte Links */}
        <section className="surface-bone-2 sc-section border-t border-line/10">
          <div className="sc-wrap grid gap-12">
            <FaqList faqs={faqs} title={`Fragen zu ${page.navTitle}`} />
            <LinkGrid title="Verwandte Leistungen" links={related} />
            <LinkGrid
              title={`${page.navTitle} in Ihrer Stadt`}
              links={CITY_PAGES.map((c) => ({ href: `/kellersanierung/${c.slug}/`, label: c.name, sub: `Reaktion ${c.responseTime}` }))}
            />
          </div>
        </section>

        {/* Frame 10: Kontakt & Termin */}
        <ContactForm defaultDamage={DAMAGE_BY_SLUG[page.slug]} />
      </main>
      <Footer />
      <ScrollEngine />
    </>
  );
}

