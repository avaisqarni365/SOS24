import type { Metadata } from "next";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import HomeSteps from "@/components/sections/HomeSteps";
import GrokLeadBot from "@/components/ai/GrokLeadBot";
import LayersAct from "@/components/scroll/LayersAct";
import ProofSection from "@/components/science/ProofSection";
import KitShowcase from "@/components/sections/KitShowcase";
import ScienceSection from "@/components/science/ScienceSection";
import { ScannerSection } from "@/components/scroll/HomeSections";
import JsonLd from "@/components/seo/JsonLd";
import { CHEMISTRY } from "@/data/chemistry";
import { SERVICE_FILMS } from "@/data/films";
import HeroFilm from "@/components/scroll/HeroFilm";
import LabTabs from "@/components/science/LabTabs";
import LayerStack3D from "@/components/science/LayerStack3D";
import { FactChips } from "@/components/sections/FactsStrip";
import Scenario, { ScenarioDefs } from "@/components/science/Scenarios";
import { Formula } from "@/components/science/Formula";
import { hy } from "@/lib/hyphenate";
import { Home, Layers, ShieldCheck, SprayCan, Gauge, Wrench, Umbrella, Sun, PanelBottom, FlaskConical, Box, ScanLine, ClipboardCheck, Sigma, Ruler, type LucideIcon } from "lucide-react";
import { SITE_URL, BUSINESS_ID, WEBSITE_ID, abs, businessNode, websiteNode, breadcrumbNode, OG_IMAGE } from "@/lib/site";

const TITLE = "Scientific Lab | Verfahren, Chemie & Nachweis";
const DESCRIPTION =
  "Neun Verfahren mit Film, chemischer Reaktion und 3D-Modell, dazu der Feuchte-Scanner, Geräte und Material und der Messnachweis in jeder Phase.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/labor/" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/labor/", type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
};

/**
 * The Scientific Lab: everything that explains the trade, on one page.
 * The landing page carries no 3D and no physics at all now — it says what we
 * do and how to reach us. Anyone who wants the evidence comes here and gets
 * the model, the reaction, the measurement and the proof, per service.
 */
export default function LaborPage() {
  const graph = [
    businessNode(),
    websiteNode(),
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/labor/#webpage`,
      url: abs("/labor/"),
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "de-DE",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
      breadcrumb: { "@id": `${SITE_URL}/labor/#breadcrumb` },
    },
    {
      ...breadcrumbNode([
        { name: "Startseite", path: "/" },
        { name: "Scientific Lab", path: "/labor/" },
      ]),
      "@id": `${SITE_URL}/labor/#breadcrumb`,
    },
  ];

  const reactions = CHEMISTRY.reduce((n, c) => n + c.reactions.length, 0);
  const STATS = [
    { value: String(CHEMISTRY.length), label: "Verfahren im Labor" },
    { value: String(reactions), label: "Reaktionen als Gleichung" },
    { value: "5", label: "Messhöhen je Messpunkt" },
    { value: "3", label: "Messverfahren: kapazitiv, CM, Darr" },
  ];
  const CHAPTERS = [
    { href: "#verfahren", label: "Verfahren & Chemie", Icon: FlaskConical },
    { href: "#modell", label: "3D-Modell", Icon: Box },
    { href: "#feuchte-scanner", label: "Feuchte-Scanner", Icon: ScanLine },
    { href: "#material", label: "Geräte & Material", Icon: Wrench },
    { href: "#nachweis", label: "Nachweis je Phase", Icon: ClipboardCheck },
  ];
  const ICON: Record<string, LucideIcon> = {
    kellersanierung: Home,
    horizontalsperre: Layers,
    kellerinnenabdichtung: ShieldCheck,
    schimmelbeseitigung: SprayCan,
    feuchtemessung: Gauge,
    rissverpressung: Wrench,
    dachabdichtung: Umbrella,
    "balkon-terrasse": Sun,
    sockelabdichtung: PanelBottom,
  };

  const tabs = CHEMISTRY.map((c) => {
    const Icon = ICON[c.slug] ?? FlaskConical;
    const film = SERVICE_FILMS[c.slug];
    return {
      id: c.slug,
      label: c.service,
      icon: <Icon strokeWidth={1.7} />,
      panel: (
        <>
          <Scenario slug={c.slug} />
          <div className="labpanel" id={`verfahren-${c.slug}`}>
            {film ? <HeroFilm film={film} label="Film" /> : null}
            <article className="labpanel__chem">
              <p className="labpanel__k">{c.service} · Chemie</p>
              <h3 className="labpanel__h">{c.heading}</h3>
              <p className="labpanel__intro">{hy(c.intro)}</p>
              <ol className="labpanel__rx">
                {c.reactions.map((r, i) => (
                  <li key={r.stage}>
                    <span className="labpanel__rx-n" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="labpanel__rx-stage">{r.stage}</p>
                      <p className="labpanel__rx-eq">
                        <Formula source={r.equation} />
                      </p>
                      <p className="labpanel__rx-note">{hy(r.note)}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="labpanel__foot">
                <p className="labpanel__out">
                  <span>{c.outcome.value}</span>
                  {c.outcome.label}
                </p>
                <a href={`/leistungen/${c.slug}/`} className="labpanel__link">
                  {c.service} als Leistung <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          </div>
          <ScienceSection slug={c.slug} />
        </>
      ),
    };
  });

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main" className="lab-page">
        <ScenarioDefs />
        <section className="lab-hero" aria-labelledby="lab-title">
          <div className="sc-wrap">
            <div className="lab-hero__grid">
              <div>
                <p className="sc-label">Scientific Lab</p>
                <h1 id="lab-title" className="sc-display lab-hero__title">
                  Der Nachweis, <em>nicht die Behauptung.</em>
                </h1>
                <p className="sc-lede lab-hero__lede">
                  {hy("Jedes Verfahren als Szenario in sechs Sekunden und als kurzer Film, die Reaktion im Mauerwerk als Gleichung, das Modell in 3D und die Messung, die alles belegt.")}
                </p>
                <FactChips
                  className="lab-chips"
                  label="Das Labor in Zahlen"
                  facts={[
                    { value: STATS[0].value, label: STATS[0].label, Icon: FlaskConical },
                    { value: STATS[1].value, label: STATS[1].label, Icon: Sigma },
                    { value: STATS[2].value, label: STATS[2].label, Icon: Ruler },
                    { value: STATS[3].value, label: STATS[3].label, Icon: Gauge },
                  ]}
                />
              </div>
              <LayerStack3D />
            </div>
            <nav className="lab-chapters" aria-label="Kapitel">
              {CHAPTERS.map(({ href, label, Icon }, i) => (
                <a key={href} href={href} className="lab-chapter">
                  <span className="lab-chapter__n">{String(i + 1).padStart(2, "0")}</span>{" "}
                  <Icon aria-hidden="true" />
                  <span className="lab-chapter__l">{label}</span>
                </a>
              ))}
            </nav>
          </div>
        </section>

        <section id="verfahren" className="sc-section lab-methods" aria-labelledby="verfahren-title">
          <div className="sc-wrap">
            <p className="sc-label">Verfahren & Chemie</p>
            <h2 id="verfahren-title" className="sc-display mt-3">
              Neun Verfahren, <em>ein Labor.</em>
            </h2>
            <p className="sc-body mt-5">
              {hy("Wählen Sie ein Verfahren: Sie sehen den Film dazu, die chemische Reaktion im Mauerwerk mit ihrer Gleichung und, wo es sie gibt, das interaktive Modell der Bauphysik.")}
            </p>
          </div>
          <div className="sc-wrap lab-methods__tabs">
            <LabTabs tabs={tabs} />
          </div>
        </section>

        <LayersAct id="modell" />
        <ScannerSection />
        <KitShowcase id="material" />
        <ProofSection />

        <HomeSteps />
      </main>
      <Footer />
      <GrokLeadBot />
    </>
  );
}
