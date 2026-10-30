import type { Metadata } from "next";
import { Play } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import HomeSteps from "@/components/sections/HomeSteps";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/SubpageParts";
import { FILM_PAGES, isoDuration } from "@/data/films";
import { WEBSITE_ID, abs, businessNode, websiteNode, breadcrumbNode, OG_IMAGE } from "@/lib/site";
import { hy } from "@/lib/hyphenate";

const TITLE = "Filme: Kellersanierung und Abdichtung | sos-abdichtung";
const DESCRIPTION =
  "Kurze Filme aus unserer Arbeit: Kellersanierung, Innenabdichtung, Schimmelbeseitigung und Sockelabdichtung, jeder Schritt im Bild, ohne Ton.";
const PATH = "/filme/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
};

/** The overview of all films; each card leads to the film's own watch page. */
export default function FilmePage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Filme", path: PATH },
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
      mainEntity: {
        "@type": "ItemList",
        itemListElement: FILM_PAGES.map((f, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: abs(`/filme/${f.slug}/`),
          name: f.title,
        })),
      },
    },
    { ...breadcrumbNode(crumbs), "@id": `${abs(PATH)}#breadcrumb` },
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main">
        <section className="sc-page-top" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-6 text-[2.4rem] leading-[1.04] sm:text-5xl">
              Filme aus unserer Arbeit
            </h1>
            <p className="sc-lede mt-5 max-w-3xl text-ink font-medium">
              {hy("Kurze Filme ohne Ton, gedreht bei unserer Arbeit: was bei einer Kellersanierung, einer Innenabdichtung, einer Schimmelbeseitigung und einer Sockelabdichtung passiert, Schritt für Schritt.")}
            </p>
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FILM_PAGES.map((f) => (
                <li key={f.slug}>
                  <a href={`/filme/${f.slug}/`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line/12 bg-surface shadow-sm transition-all hover:border-accent-deep/40 hover:shadow-md">
                    <span className="relative block aspect-[9/16] max-h-[420px] overflow-hidden bg-black">
                      <img src={f.film.poster} alt={`Standbild aus dem Film: ${f.title}`} width={432} height={768} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                      <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg">
                          <Play className="h-6 w-6 text-[#14253c]" />
                        </span>
                      </span>
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 font-mono text-xs text-white">
                        <time dateTime={isoDuration(f.film.seconds)}>{f.film.seconds} s</time>
                      </span>
                    </span>
                    <span className="block p-5">
                      <span className="block text-lg font-bold text-ink">{f.title}</span>
                      <span className="mt-1 block text-sm text-ink font-medium">{f.film.chapters.map((c) => c.label).join(" · ")}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <HomeSteps />
      </main>
      <Footer />
    </>
  );
}
