import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import HomeSteps from "@/components/sections/HomeSteps";
import FilmPlayer from "@/components/sections/FilmPlayer";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs, LinkGrid } from "@/components/seo/SubpageParts";
import { FILM_PAGES, isoDuration } from "@/data/films";
import { CITY_PAGES, SERVICE_PAGES } from "@/data/seo-pages";
import { BUSINESS_ID, WEBSITE_ID, abs, businessNode, websiteNode, breadcrumbNode, OG_IMAGE } from "@/lib/site";
import { hy } from "@/lib/hyphenate";

export const dynamicParams = false;

export function generateStaticParams() {
  return FILM_PAGES.map((f) => ({ slug: f.slug }));
}

const pageTitle = (title: string) => {
  const full = `Film: ${title} | sos-abdichtung`;
  return full.length <= 60 ? full : `Film: ${title}`;
};

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = FILM_PAGES.find((f) => f.slug === params.slug);
  if (!page) return {};
  const path = `/filme/${page.slug}/`;
  const title = pageTitle(page.title);
  return {
    title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: page.description,
      url: path,
      type: "video.other",
      locale: "de_DE",
      siteName: "sos-abdichtung",
      images: [OG_IMAGE],
      videos: [{ url: abs(page.film.src), width: 432, height: 768, type: "video/mp4" }],
    },
  };
}

export default function FilmPage({ params }: { params: { slug: string } }) {
  const page = FILM_PAGES.find((f) => f.slug === params.slug);
  if (!page) notFound();
  const path = `/filme/${page.slug}/`;
  const { film } = page;
  const service = SERVICE_PAGES.find((s) => s.slug === page.service);
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Filme", path: "/filme/" },
    { name: page.title, path },
  ];

  const graph = [
    businessNode(),
    websiteNode(),
    {
      "@type": "WebPage",
      "@id": `${abs(path)}#webpage`,
      url: abs(path),
      name: pageTitle(page.title),
      description: page.description,
      inLanguage: "de-DE",
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${abs(path)}#breadcrumb` },
      mainEntity: { "@id": `${abs(path)}#video` },
    },
    { ...breadcrumbNode(crumbs), "@id": `${abs(path)}#breadcrumb` },
    {
      "@type": "VideoObject",
      "@id": `${abs(path)}#video`,
      name: page.title,
      description: page.description,
      thumbnailUrl: [abs(film.poster)],
      uploadDate: page.uploadDate,
      duration: isoDuration(film.seconds),
      contentUrl: abs(film.src),
      embedUrl: abs(path),
      inLanguage: "de-DE",
      isFamilyFriendly: true,
      publisher: { "@id": BUSINESS_ID },
      ...(service ? { about: { "@type": "Service", name: service.serviceName, url: abs(`/leistungen/${service.slug}/`) } } : {}),
      // the chapters as key moments: each links to the page with ?t=<start>
      hasPart: film.chapters.map((c, i) => ({
        "@type": "Clip",
        name: c.label,
        startOffset: Math.floor(c.at),
        endOffset: Math.ceil(film.chapters[i + 1]?.at ?? film.seconds),
        url: `${abs(path)}?t=${Math.floor(c.at)}`,
      })),
    },
  ];

  // the towns that have their own card for this service
  const towns = service
    ? CITY_PAGES.filter((c) => c.localServices?.some((s) => s.slug === service.slug)).map((c) => ({
        href: `/kellersanierung/${c.slug}/#${service.slug}`,
        label: `${service.navTitle} ${c.name}`,
      }))
    : CITY_PAGES.map((c) => ({ href: `/kellersanierung/${c.slug}/`, label: `Kellersanierung ${c.name}` }));
  const others = FILM_PAGES.filter((f) => f.slug !== page.slug).map((f) => ({ href: `/filme/${f.slug}/`, label: f.title, sub: `${f.film.seconds} Sekunden` }));

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main">
        <section className="sc-page-top" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-6 text-[2.2rem] leading-[1.06] sm:text-5xl">
              Film: {page.title}
            </h1>
            <p className="sc-lede mt-5 max-w-3xl text-ink font-medium">{hy(page.description)}</p>
            <p className="mt-2 font-mono text-xs text-ink-soft">
              {film.seconds} Sekunden · ohne Ton · gedreht bei unserer Arbeit in NRW
            </p>
            <div className="mt-8">
              <FilmPlayer film={film} title={page.title} />
            </div>
            {service ? (
              <p className="mt-8">
                <a href={`/leistungen/${service.slug}/`} className="btn-shine inline-flex min-h-[48px] items-center rounded-full px-6 text-sm font-semibold shadow-sm">
                  Mehr zur {service.navTitle} <span aria-hidden="true">&nbsp;→</span>
                </a>
              </p>
            ) : null}
          </div>
        </section>

        <section className="surface-bone-2 sc-section">
          <div className="sc-wrap grid gap-12">
            <LinkGrid title={service ? `${service.navTitle} in Ihrer Stadt` : "In Ihrer Stadt"} links={towns} />
            <LinkGrid title="Weitere Filme" links={others} />
          </div>
        </section>

        <HomeSteps />
      </main>
      <Footer />
    </>
  );
}
