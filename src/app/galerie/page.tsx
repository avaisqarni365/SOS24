import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import HomeSteps from "@/components/sections/HomeSteps";
import PictureGallery from "@/components/sections/PictureGallery";
import FilmWall from "@/components/sections/FilmWall";
import BrandGallery, { type BrandGalleryItem } from "@/components/sections/BrandGallery";
import Feedback from "@/components/sections/Feedback";
import ChapterNav from "@/components/service/ChapterNav";
import { REEL, SERVICE_FILMS } from "@/data/films";
import JsonLd from "@/components/seo/JsonLd";
import ScrollEngine, { SC_BOOT } from "@/components/scroll/ScrollEngine";
import { Breadcrumbs } from "@/components/seo/SubpageParts";
import { abs, businessNode, websiteNode, breadcrumbNode, OG_IMAGE } from "@/lib/site";
import { hy } from "@/lib/hyphenate";

const TITLE = "Galerie: Filme, Bilder und Kundenstimmen | sos-abdichtung";
const DESCRIPTION =
  "Kurze Filme zu jedem Verfahren, Bilder von Team, Wagen und Baustelle, Schadensbilder aus der Praxis und Kundenstimmen. SOS-Abdichtung in NRW.";
const PATH = "/galerie/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
};

const PICTURES: BrandGalleryItem[] = [
  { shot: "van", title: "Servicewagen", note: "Werkzeug und Messtechnik an Bord", detail: "Unser Servicewagen kommt zur kostenlosen Messung und bleibt während der Sanierung vor Ort, mit Feuchtemessgerät, CM-Messkoffer, Wärmebildkamera und Injektionstechnik an Bord." },
  { shot: "risse", title: "Rissabdichtung", note: "Riss für Riss", detail: "Ein Riss im Kellerboden wird geöffnet, gereinigt und mit Dichtmörtel geschlossen. Führt er Wasser, wird er mit Harz verpresst, damit er dauerhaft dicht bleibt." },
  { shot: "bohrung", title: "Horizontalsperre", note: "Bohrloch für Bohrloch", detail: "Eine Reihe Bohrlöcher knapp über dem Boden, höchstens 20 cm auseinander. Darüber kommt die Injektionscreme in die Wand." },
  { shot: "spachteln", title: "Sanierputz", note: "Schicht für Schicht", detail: "Nach der Abdichtung kommt der Sanierputz auf die Wand. Er nimmt Salze aus dem Mauerwerk auf und lässt Feuchte als Dampf entweichen, damit der Putz nicht wieder abplatzt." },
];

export default function GaleriePage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Galerie", path: PATH },
  ];
  const films = [
    { ...REEL, slug: "reel", title: "So arbeiten wir" },
    ...Object.entries(SERVICE_FILMS).map(([slug, f]) => ({ ...f, slug, href: `/leistungen/${slug}/` })),
  ];
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: SC_BOOT }} />
      <JsonLd graph={[businessNode(), websiteNode(), { ...breadcrumbNode(crumbs), "@id": `${abs(PATH)}#breadcrumb` }]} />
      <Navbar />
      <main id="main" className="galerie-page">
        <section className="svc-hero galerie-hero" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-6">
              Galerie: <em>Filme, Bilder und Feedback</em>
            </h1>
            <p className="sc-lede mt-5 max-w-3xl">
              {hy("Kurze Filme zu jedem Verfahren, Bilder von Team, Wagen und Baustelle, typische Schadensbilder und die Stimmen unserer Kunden.")}
            </p>
          </div>
        </section>
        <ChapterNav
          items={[
            { id: "filme", label: "Filme" },
            { id: "bilder", label: "Bilder" },
            { id: "feedback", label: "Feedback" },
            { id: "schritte", label: "Kontakt" },
          ]}
          label="Galerie"
        />

        <section id="filme" className="sc-section galerie-films" aria-labelledby="filme-title">
          <div className="sc-wrap">
            <p className="sc-label">Filme</p>
            <h2 id="filme-title" className="sc-display mt-3">
              So arbeiten wir, <em>Verfahren für Verfahren.</em>
            </h2>
            <p className="sc-body mt-5">
              {hy("Zehn kurze Filme ohne Ton: einer über unsere Arbeit und einer zu jeder Leistung. Tippen Sie auf einen Film, er öffnet sich groß.")}
            </p>
            <FilmWall films={films} />
          </div>
        </section>

        <section id="bilder" className="sc-section galerie-pictures" aria-labelledby="bilder-title">
          <div className="sc-wrap" id="team">
            <p className="sc-label">Bilder</p>
            <h2 id="bilder-title" className="sc-display mt-3">
              Team, Wagen <em>und Baustelle.</em>
            </h2>
            <BrandGallery items={PICTURES} />
          </div>
        </section>
        <PictureGallery hideHeader />

        <Feedback />
        <HomeSteps />
      </main>
      <Footer />
      <ScrollEngine />
    </>
  );
}
