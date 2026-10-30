import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle, Phone, CalendarCheck, MapPin, Clock, ShieldCheck, Gauge, BadgeEuro, UserCheck, ArrowRight } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import HomeSteps from "@/components/sections/HomeSteps";
import OnlineAppointmentBooking from "@/components/sections/OnlineAppointmentBooking";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs, LayerStack, Prose, FaqList, LinkGrid } from "@/components/seo/SubpageParts";
import { CITY_PAGES } from "@/data/seo-pages";
import { FILM_PAGES } from "@/data/films";
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

/** The four promises every visitor should see before scrolling. */
const TRUST = [
  { Icon: Gauge, label: "Feuchtemessung kostenlos" },
  { Icon: BadgeEuro, label: "Festpreis nach Messung" },
  { Icon: ShieldCheck, label: "10 Jahre Garantie" },
  { Icon: UserCheck, label: "Inhaber misst selbst" },
];

export default function CityPage({ params }: { params: { city: string } }) {
  const page = CITY_PAGES.find((c) => c.slug === params.city);
  if (!page) notFound();
  const path = `/kellersanierung/${page.slug}/`;
  const location = LOCATIONS.find((l) => l.key === page.slug);
  const termin = `/termin/?ort=${encodeURIComponent(page.name)}`;
  const whatsapp = `https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(`Hallo Herr Mahmood, ich habe ein Feuchtigkeitsproblem im Keller in ${page.name} und wünsche eine kostenlose Feuchtemessung.`)}`;
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Servicegebiet", path: "/leistungen/#servicegebiet" },
    { name: `Kellersanierung ${page.name}`, path },
  ];
  const local = page.localServices ?? [];
  const cityId = `${abs(path)}#city`;
  const serviceId = `${abs(path)}#service`;

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
      mainEntity: { "@id": serviceId },
      about: [{ "@id": serviceId }, { "@id": cityId }],
      primaryImageOfPage: { "@type": "ImageObject", url: abs(OG_IMAGE.url), width: OG_IMAGE.width, height: OG_IMAGE.height },
      ...(local.length ? { significantLink: local.map((s) => abs(`/leistungen/${s.slug}/`)) } : {}),
    },
    { ...breadcrumbNode(crumbs), "@id": `${abs(path)}#breadcrumb` },
    {
      "@type": "City",
      "@id": cityId,
      name: page.name,
      geo: { "@type": "GeoCoordinates", latitude: page.geo.lat, longitude: page.geo.lng },
      containedInPlace: { "@type": "State", name: "Nordrhein-Westfalen" },
      ...(page.wiki ? { sameAs: page.wiki } : {}),
    },
    {
      "@type": "Service",
      "@id": serviceId,
      name: `Kellersanierung ${page.name}`,
      serviceType: "Kellersanierung",
      description: page.lede,
      url: abs(path),
      provider: { "@id": BUSINESS_ID },
      areaServed: { "@id": cityId },
      // the first visit really costs nothing: the measurement and the fixed-price offer
      offers: {
        "@type": "Offer",
        name: `Kostenlose Feuchtemessung vor Ort in ${page.name}`,
        price: "0",
        priceCurrency: "EUR",
        areaServed: { "@id": cityId },
      },
      ...(location
        ? {
            availableChannel: {
              "@type": "ServiceChannel",
              servicePhone: { "@type": "ContactPoint", telephone: location.phoneTel, contactType: "customer service", availableLanguage: ["de", "en"] },
              serviceLocation: {
                "@type": "Place",
                address: { "@type": "PostalAddress", streetAddress: location.street, postalCode: location.postalCode, addressLocality: location.locality, addressCountry: "DE" },
              },
            },
          }
        : {}),
      ...(local.length
        ? {
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: `Leistungen in ${page.name}`,
              itemListElement: local.map((s) => ({
                "@type": "Offer",
                itemOffered: { "@type": "Service", name: s.heading, description: s.text, url: abs(`${path}#${s.slug}`), areaServed: { "@id": cityId } },
              })),
            },
          }
        : {}),
    },
    faqNode(page.faqs),
  ];

  const nearby = page.nearby
    .map((slug) => CITY_PAGES.find((c) => c.slug === slug))
    .filter(Boolean)
    .map((c) => ({ href: `/kellersanierung/${c!.slug}/`, label: `Kellersanierung ${c!.name}`, sub: `Vor Ort in ${c!.responseTime}` }));

  // services without their own card on this page still get a link
  const otherServices = SERVICE_CARDS.filter((s) => !local.some((l) => l.slug === s.slug)).map((s) => ({
    href: `/leistungen/${s.slug}/`,
    label: s.title,
  }));

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
                <a href={termin} className="btn-shine inline-flex min-h-[48px] items-center rounded-full px-6 text-sm font-semibold shadow-sm hover:opacity-95 transition-opacity">
                  Kostenlose Messung in {page.name} buchen <span aria-hidden="true">&nbsp;→</span>
                </a>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 text-sm font-bold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>Fotos per WhatsApp</span>
                </a>
                <a href={`tel:${COMPANY_INFO.phoneTel}`} className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-line/20 bg-surface px-6 text-sm font-semibold text-ink hover:border-accent-deep transition-colors">
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  {COMPANY_INFO.phoneDisplay}
                </a>
              </div>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:flex-wrap sm:gap-x-6" aria-label="Unsere Zusagen">
                {TRUST.map(({ Icon, label }) => (
                  <li key={label} className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <Icon className="h-4 w-4 shrink-0 text-accent-deep" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
              <dl className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-line/12 bg-surface p-4 shadow-sm">
                  <dt className="sc-label text-accent-deep font-bold">Vor Ort in</dt>
                  <dd className="mt-1 font-editorial text-2xl sm:text-3xl font-bold text-ink">{page.responseTime}</dd>
                </div>
                <div className="rounded-2xl border border-line/12 bg-surface p-4 shadow-sm sm:col-span-2">
                  <dt className="sc-label text-accent-deep font-bold">Stadtteile</dt>
                  <dd className="mt-1 text-sm font-semibold text-ink leading-relaxed">{page.districts.join(" · ")}</dd>
                </div>
                {location ? (
                  // the town where we have a location shows it: address, number, hours and the way there, as in Google Maps
                  <div className="rounded-2xl border border-accent-deep/30 bg-surface p-4 shadow-sm sm:col-span-3">
                    <dt className="sc-label text-accent-deep font-bold">Unser Standort in {location.locality}</dt>
                    <dd className="mt-2 grid gap-2 text-sm font-semibold text-ink leading-relaxed sm:grid-cols-2">
                      <span className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-deep" aria-hidden="true" />
                        <span>
                          sos-abdichtung, {location.street}, {location.postalCode} {location.locality}
                          <br />
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`SOS Abdichtung, ${location.street}, ${location.postalCode} ${location.locality}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-2"
                          >
                            In Google Maps öffnen
                          </a>
                        </span>
                      </span>
                      <span className="flex items-start gap-2">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-deep" aria-hidden="true" />
                        <span>
                          {COMPANY.openingHoursDisplay}
                          <br />
                          <a href={`tel:${location.phoneTel}`} className="underline underline-offset-2">
                            {location.phoneDisplay}
                          </a>
                        </span>
                      </span>
                    </dd>
                  </div>
                ) : null}
                <div className="rounded-2xl border border-line/12 bg-surface p-4 shadow-sm sm:col-span-3">
                  <dt className="sc-label text-accent-deep font-bold">Postleitzahlen</dt>
                  <dd className="mt-1 font-mono text-xs font-semibold text-ink leading-relaxed tracking-wider">{page.plz.join(" ")}</dd>
                </div>
              </dl>
            </div>
            <LayerStack layers={page.localFactors} title={`Warum Keller in ${page.name} feucht werden`} />
          </div>
        </section>

        {local.length > 0 ? (
          <section id="leistungen-vor-ort" className="surface-bone-2 sc-section" aria-labelledby="local-title">
            <div className="sc-wrap">
              <div className="max-w-3xl">
                <p className="sc-label text-accent-deep font-bold">Leistungen vor Ort</p>
                <h2 id="local-title" className="sc-display mt-3 text-3xl sm:text-4xl text-ink">
                  Was wir in {page.name} für Ihren Keller tun
                </h2>
                <p className="sc-lede mt-3 text-ink font-medium">
                  {hy("Jedes Verfahren gegen eine bestimmte Ursache. Welches Ihr Keller braucht, zeigt die kostenlose Messung.")}
                </p>
              </div>
              <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {local.map((s) => (
                  <li key={s.slug} id={s.slug} className="scroll-mt-28 flex flex-col rounded-3xl border border-line/12 bg-surface p-6 shadow-sm transition-all hover:border-accent-deep/40 hover:shadow-md">
                    <h3 className="text-xl font-bold text-ink">{s.heading}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink font-medium">{hy(s.text)}</p>
                    <a href={`/leistungen/${s.slug}/`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-accent-deep hover:underline underline-offset-4">
                      Mehr zum Verfahren <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* one clear next step between the services and the long read */}
        <section className="sc-section py-10" aria-label={`Kostenlose Messung in ${page.name}`}>
          <div className="sc-wrap">
            {/* band-ink: white with dark type in the light theme, the deep-water plate in the dark one */}
            <div className="band-ink flex flex-col gap-6 rounded-3xl border border-line/12 p-7 shadow-lg sm:p-10 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="sc-label font-bold">In {page.responseTime} bei Ihnen</p>
                <h2 className="mt-2 font-editorial text-2xl font-bold leading-tight text-ink sm:text-3xl">
                  Erst messen, dann entscheiden: Die Feuchtemessung in {page.name} ist kostenlos.
                </h2>
                <p className="mt-2 text-sm font-medium">
                  Danach bekommen Sie einen Festpreis, der sich nicht mehr ändert. Eine erste Einordnung gibt der{" "}
                  <a href="/kostenrechner/" className="underline underline-offset-2">
                    Kostenrechner
                  </a>
                  .
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={termin} className="btn-shine inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 text-sm font-semibold shadow-sm">
                  <CalendarCheck className="h-4 w-4" aria-hidden="true" /> Termin wählen
                </a>
                <a href={`tel:${COMPANY_INFO.phoneTel}`} className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-line/20 bg-surface px-6 text-sm font-semibold text-ink hover:border-accent-deep transition-colors">
                  <Phone className="h-4 w-4" aria-hidden="true" /> Anrufen
                </a>
              </div>
            </div>
          </div>
        </section>

        {page.districtGroups?.length ? (
          <section className="surface-bone sc-section" aria-labelledby="districts-title">
            <div className="sc-wrap">
              <div className="max-w-3xl">
                <p className="sc-label text-accent-deep font-bold">Stadtteile</p>
                <h2 id="districts-title" className="sc-display mt-3 text-3xl sm:text-4xl text-ink">
                  Feuchte Keller in {page.name}: was in Ihrem Stadtteil typisch ist
                </h2>
              </div>
              <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {page.districtGroups.map((g) => (
                  <li key={g.name} className="rounded-3xl border border-line/12 bg-surface p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-ink">{g.name}</h3>
                    <p className="mt-1 font-mono text-xs font-semibold text-accent-deep">{g.districts.join(" · ")}</p>
                    <p className="mt-3 text-sm leading-relaxed text-ink font-medium">{hy(g.text)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section className="surface-bone sc-section">
          <div className="sc-wrap">
            <Prose sections={page.sections} />
          </div>
        </section>

        {/* Embedded Interactive Booking Engine pre-filled for this city */}
        <OnlineAppointmentBooking place={page.name} className="border-y border-slate-200/80 my-2" />

        <section className="surface-bone-2 sc-section">
          <div className="sc-wrap grid gap-12">
            <FaqList faqs={page.faqs} title={`Fragen aus ${page.name}`} />
            <LinkGrid title={local.length ? `Weitere Leistungen in ${page.name}` : `Leistungen in ${page.name}`} links={otherServices} />
            <LinkGrid
              title="Filme aus unserer Arbeit"
              links={FILM_PAGES.filter((f) => !f.service || local.some((l) => l.slug === f.service) || f.service === "kellersanierung").map((f) => ({
                href: `/filme/${f.slug}/`,
                label: f.title,
                sub: `Film, ${f.film.seconds} Sekunden`,
              }))}
            />
            {nearby.length > 0 && <LinkGrid title="In der Nähe" links={nearby} />}
          </div>
        </section>

        <HomeSteps formHref={termin} />
      </main>
      <Footer />

      {/* phones: the three ways to reach us stay at the thumb while reading */}
      <div className="h-[4.5rem] lg:hidden" aria-hidden="true" />
      <nav aria-label="Schnellkontakt" className="city-cta-bar fixed inset-x-0 bottom-0 z-30 border-t border-line/15 bg-surface/95 px-3 py-2 shadow-[0_-6px_20px_rgb(0_0_0/0.08)] backdrop-blur lg:hidden">
        <ul className="mx-auto grid max-w-md grid-cols-3 gap-2">
          <li>
            <a href={`tel:${COMPANY_INFO.phoneTel}`} className="flex min-h-[52px] flex-col items-center justify-center rounded-xl border border-line/15 text-xs font-bold text-ink">
              <Phone className="h-5 w-5 text-accent-deep" aria-hidden="true" />
              Anrufen
            </a>
          </li>
          <li>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-[52px] flex-col items-center justify-center rounded-xl bg-[#25D366] text-xs font-bold text-white">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              WhatsApp
            </a>
          </li>
          <li>
            <a href={termin} className="btn-shine flex min-h-[52px] flex-col items-center justify-center rounded-xl text-xs font-bold">
              <CalendarCheck className="h-5 w-5" aria-hidden="true" />
              Termin
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
