import { ArrowRight, FlaskConical, Images, Users, Calculator } from "lucide-react";
import { hy } from "@/lib/hyphenate";

/**
 * "Mehr erfahren": the landing page stays short, the detail lives one
 * click deeper. Four picture cards (Lab, Galerie, Für wen, Angebotsrechner)
 * and two links to the method guide and the FAQ. The towns live in the
 * map section (RegionExplorer), once.
 */
const CARDS = [
  {
    href: "/labor/",
    Icon: FlaskConical,
    tone: "var(--ic-green)",
    img: "/media/film-feuchtemessung.webp",
    w: 432,
    h: 768,
    pos: "50% 30%",
    k: "Scientific Lab",
    title: "Verfahren im Detail",
    text: "Jedes Verfahren als Szenario, Film, Gleichung und 3D-Modell.",
  },
  {
    href: "/galerie/",
    Icon: Images,
    tone: "var(--ic-red)",
    img: "/img/brand/servicewagen.webp?v=3",
    w: 432,
    h: 300,
    pos: "50% 50%",
    k: "Galerie & Team",
    title: "Filme und Bilder",
    text: "Unser Team im Einsatz, der Servicewagen und Stimmen von Kunden.",
  },
  {
    href: "/leistungen/#fuer-wen",
    Icon: Users,
    tone: "var(--ic-water)",
    img: "/img/brand/brand-walker.webp",
    w: 198,
    h: 302,
    pos: "50% 18%",
    k: "Für wen",
    title: "Haus oder Bestand",
    text: "Für Hausbesitzer, Hausverwaltungen, Vermieter und Unternehmen.",
  },
  {
    href: "/kostenrechner/",
    Icon: Calculator,
    tone: "var(--ic-green)",
    img: "/img/gallery/bohrung-injektion.webp",
    w: 679,
    h: 450,
    pos: "50% 50%",
    k: "Angebotsrechner",
    title: "Ihr Angebot planen",
    text: "Fläche und Schadensbild angeben, das Angebot kommt nach der Messung.",
  },
];

export default function MoreLinks() {
  return (
    <section id="mehr" className="sc-section more" aria-labelledby="mehr-title">
      <div className="sc-wrap">
        <p className="sc-label">Mehr erfahren</p>
        <h2 id="mehr-title" className="sc-display mt-3">
          Alles Weitere, <em>eine Seite tiefer.</em>
        </h2>
        <ul className="more__grid">
          {CARDS.map((c) => (
            <li key={c.href}>
              <a href={c.href} className="more__card" style={{ ["--ic" as string]: c.tone }}>
                <span className="more__ico" aria-hidden="true">
                  <c.Icon />
                </span>
                <span className="more__img">
                  <img src={c.img} width={c.w} height={c.h} alt="" loading="lazy" decoding="async" style={{ objectPosition: c.pos }} />
                </span>
                <span className="more__body">
                  <span className="more__k">{c.k}</span>
                  <span className="more__t">{c.title}</span>
                  <span className="more__d">{c.text}</span>
                  <span className="more__go" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <nav className="more__quick" aria-label="Noch Fragen?">
          <a href="/leistungen/#wegweiser" className="more__chip more__chip--line">
            Welches Verfahren passt?
          </a>
          <a href="/leistungen/#faq" className="more__chip more__chip--line">
            Häufige Fragen
          </a>
        </nav>
      </div>
    </section>
  );
}
