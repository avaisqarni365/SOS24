import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/SubpageParts";
import { COMPANY_INFO } from "@/data/content-data";
import { abs, businessNode, websiteNode, breadcrumbNode, OG_IMAGE } from "@/lib/site";
import { hy } from "@/lib/hyphenate";

const TITLE = "Bewertung schreiben: Ihre Erfahrung | sos-abdichtung";
const DESCRIPTION =
  "Wir haben bei Ihnen gearbeitet? Schreiben Sie in einer Minute eine ehrliche Google-Bewertung und helfen Sie anderen Hausbesitzern bei der Suche.";
const PATH = "/bewertung/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
};

const HELPFUL = [
  "Was wir bei Ihnen gemacht haben, zum Beispiel Kellerabdichtung von innen oder Horizontalsperre",
  "In welcher Stadt oder in welchem Stadtteil",
  "Wie Sie Beratung, Sauberkeit und Ergebnis erlebt haben",
];

/**
 * One short address to say, print and send: sos-abdichtung.de/bewertung. Every customer gets
 * the same page and the same button (Google does not allow sending only happy customers on),
 * and nothing is offered in return.
 */
export default function BewertungPage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Bewertung schreiben", path: PATH },
  ];
  return (
    <>
      <JsonLd graph={[businessNode(), websiteNode(), { ...breadcrumbNode(crumbs), "@id": `${abs(PATH)}#breadcrumb` }]} />
      <Navbar />
      <main id="main">
        <section className="sc-page-top" aria-labelledby="page-title">
          <div className="sc-wrap max-w-3xl">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-6">
              Ihre Bewertung <em>hilft anderen Hausbesitzern.</em>
            </h1>
            <p className="sc-lede mt-5">
              {hy("Wir haben bei Ihnen gearbeitet? Dann freuen wir uns über Ihre ehrliche Bewertung bei Google. Sie dauert etwa eine Minute.")}
            </p>
            <a
              href={COMPANY_INFO.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine mt-7 inline-flex min-h-[52px] items-center rounded-full px-7 text-lg font-semibold"
            >
              Jetzt bei Google bewerten <span aria-hidden="true" className="ml-2">→</span>
            </a>
            <p className="mt-3 text-sm text-[var(--ink-soft)]">{hy("Der Link öffnet Google. Sie brauchen dafür ein Google-Konto.")}</p>

            <h2 className="sc-display mt-12 text-2xl sm:text-3xl">Was anderen bei der Suche hilft</h2>
            <ul className="mt-4 grid gap-2 pl-5 text-[1.0625rem] leading-normal" style={{ listStyle: "disc" }}>
              {HELPFUL.map((h) => (
                <li key={h}>{hy(h)}</li>
              ))}
            </ul>
            <p className="mt-6 text-[1.0625rem] leading-normal">
              {hy("Schreiben Sie bitte ganz offen. Wenn etwas nicht gepasst hat, sagen Sie es uns gern auch direkt: ")}
              <a href={`tel:${COMPANY_INFO.phoneTel}`} className="font-semibold underline underline-offset-2">
                {COMPANY_INFO.phoneDisplay}
              </a>
              .
            </p>
            <p className="mt-3 pb-16 text-sm text-[var(--ink-soft)]">
              {hy("Wir bitten jeden Kunden um eine Bewertung und bieten dafür keine Gegenleistung an. So verlangt es Google, und so ist es fair.")}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
