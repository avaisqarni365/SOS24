import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import HomeSteps from "@/components/sections/HomeSteps";
import OnlineAppointmentBooking from "@/components/sections/OnlineAppointmentBooking";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs, LayerStack, Prose, FaqList, LinkGrid } from "@/components/seo/SubpageParts";
import { CITY_PAGES } from "@/data/seo-pages";
import { SERVICE_CARDS } from "@/data/services";
import { COMPANY, COMPANY_INFO, LOCATIONS } from "@/data/content-data";
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
    { name: "Servicegebiet", path: "/leistungen/#servicegebiet" },
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
              <p className="sc-lede mt-6 text-ink font-medium">{hy(page.lede)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`/termin/?ort=${encodeURIComponent(page.name)}`} className="btn-shine inline-flex min-h-[48px] items-center rounded-full px-6 text-sm font-semibold shadow-sm hover:opacity-95 transition-opacity">
                  Vor-Ort-Termin in {page.name} buchen <span aria-hidden="true">&nbsp;→</span>
                </a>
                <a
                  href={`https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(`Hallo Herr Mahmood, ich habe ein Feuchtigkeitsproblem im Keller in ${page.name} und wünsche eine kostenlose Feuchtemessung.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 text-sm font-bold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a href={`tel:${COMPANY_INFO.phoneTel}`} className="inline-flex min-h-[48px] items-center rounded-full border border-line/20 bg-surface px-6 text-sm font-semibold text-ink hover:border-accent-deep transition-colors">
                  {COMPANY_INFO.phoneDisplay}
                </a>
              </div>
              <dl className="mt-12 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-line/12 bg-surface p-4 shadow-sm">
                  <dt className="sc-label text-accent-deep font-bold">Vor Ort in</dt>
                  <dd className="mt-1 font-editorial text-2xl sm:text-3xl font-bold text-ink">{page.responseTime}</dd>
                </div>
                <div className="rounded-2xl border border-line/12 bg-surface p-4 shadow-sm sm:col-span-2">
                  <dt className="sc-label text-accent-deep font-bold">Stadtteile</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink leading-relaxed">{page.districts.join(" · ")}</dd>
                </div>
                {LOCATIONS.filter((l) => l.key === page.slug).map((l) => (
                  // the town where we have a location shows it: address and number, as in Google Maps
                  <div key={l.key} className="rounded-2xl border border-accent-deep/30 bg-surface p-4 shadow-sm sm:col-span-3">
                    <dt className="sc-label text-accent-deep font-bold">Unser Standort in {l.locality}</dt>
                    <dd className="mt-1 text-sm font-semibold text-ink leading-relaxed">
                      {l.street}, {l.postalCode} {l.locality} ·{" "}
                      <a href={`tel:${l.phoneTel}`} className="underline underline-offset-2">
                        {l.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                ))}
                <div className="rounded-2xl border border-line/12 bg-surface p-4 shadow-sm sm:col-span-3">
                  <dt className="sc-label text-accent-deep font-bold">Postleitzahlen</dt>
                  <dd className="mt-1 font-mono text-xs font-semibold text-ink leading-relaxed tracking-wider">{page.plz.join(" ")}</dd>
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

        {/* Embedded Interactive Booking Engine pre-filled for this city */}
        <OnlineAppointmentBooking place={page.name} className="border-y border-slate-200/80 my-2" />

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

        <HomeSteps formHref={`/termin/?ort=${encodeURIComponent(page.name)}`} />
      </main>
      <Footer />
    </>
  );
}

