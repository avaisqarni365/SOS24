import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs, FaqList, LinkGrid } from "@/components/seo/SubpageParts";
import { ApplyButtons, Chips, RoleCard } from "@/components/seo/JobParts";
import { CITY_PAGES, type CityPage } from "@/data/seo-pages";
import { COMPANY_INFO } from "@/data/content-data";
import { JOB_FAQS, JOB_KEYWORDS, JOB_ROLES, JOBS_POSTED, JOBS_VALID_THROUGH, jobCity, jobRole, type JobRole } from "@/data/jobs";
import { BUSINESS_ID, WEBSITE_ID, abs, businessNode, websiteNode, breadcrumbNode, faqNode, OG_IMAGE } from "@/lib/site";
import { hy } from "@/lib/hyphenate";

/** /jobs/<slug>/ is either one of the three ads or the jobs page of a town. */
export const dynamicParams = false;

export function generateStaticParams() {
  return [...JOB_ROLES.map((r) => ({ slug: r.slug })), ...CITY_PAGES.map((c) => ({ slug: c.slug }))];
}

const townTitle = (c: CityPage) => {
  const long = `Jobs in ${c.name}: Teilzeit, Minijob, Studentenjob`;
  return long.length <= 60 ? long : `Jobs in ${c.name}: Teilzeit, Minijob, Student`;
};
const townDescription = (c: CityPage) =>
  `Jobs in ${c.name}: Bauhelfer in Vollzeit, Teilzeit oder Minijob als Aushilfe, Studentenjob. Auch für Quereinsteiger. Jetzt bewerben.`;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const role = jobRole(params.slug);
  const city = jobCity(params.slug);
  if (!role && !city) return {};
  const path = `/jobs/${params.slug}/`;
  const title = role ? role.metaTitle : townTitle(city!);
  const description = role ? role.metaDescription : townDescription(city!);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: "de_DE", siteName: "sos-abdichtung", images: [OG_IMAGE] },
  };
}

const list = (items: string[]) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;

function RolePage({ role }: { role: JobRole }) {
  const path = `/jobs/${role.slug}/`;
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Jobs", path: "/jobs/" },
    { name: role.short, path },
  ];
  const graph = [
    businessNode(),
    websiteNode(),
    {
      "@type": "WebPage",
      "@id": `${abs(path)}#webpage`,
      url: abs(path),
      name: role.metaTitle,
      description: role.metaDescription,
      inLanguage: "de-DE",
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${abs(path)}#breadcrumb` },
      mainEntity: { "@id": `${abs(path)}#job` },
    },
    { ...breadcrumbNode(crumbs), "@id": `${abs(path)}#breadcrumb` },
    {
      // one posting per role, at the place the job is based (Google for Jobs)
      "@type": "JobPosting",
      "@id": `${abs(path)}#job`,
      title: role.title,
      description: `<p>${role.lede}</p><p><strong>Ihre Aufgaben</strong></p>${list(role.tasks)}<p><strong>Das sollten Sie mitbringen</strong></p>${list(role.requirements)}<p><strong>Das bieten wir</strong></p>${list(role.offer)}<p>Arbeitszeit: ${role.hours}. Bewerbung per WhatsApp oder Telefon ${COMPANY_INFO.phoneDisplay} oder per E-Mail an ${COMPANY_INFO.email}.</p>`,
      datePosted: JOBS_POSTED,
      validThrough: `${JOBS_VALID_THROUGH}T23:59:59+01:00`,
      employmentType: role.employmentType,
      // name and logo inline: Google reads the employer from the posting itself
      hiringOrganization: { "@type": "Organization", "@id": BUSINESS_ID, name: "sos-abdichtung", sameAs: abs("/"), logo: abs("/logo.svg") },
      jobLocation: {
        "@type": "Place",
        address: { "@type": "PostalAddress", streetAddress: COMPANY_INFO.street, postalCode: "45144", addressLocality: "Essen", addressRegion: "NW", addressCountry: "DE" },
      },
      industry: "Bautenschutz, Kellersanierung",
      url: abs(path),
      directApply: false,
    },
  ];
  const blocks: [string, string[]][] = [
    ["Ihre Aufgaben", role.tasks],
    ["Das sollten Sie mitbringen", role.requirements],
    ["Das bieten wir", role.offer],
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main">
        <section className="sc-page-top" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <p className="sc-label mt-6 text-accent-deep font-bold">Stellenangebot · {role.employment}</p>
            <h1 id="page-title" className="sc-display mt-3 max-w-4xl text-[2.2rem] leading-[1.06] sm:text-5xl">
              {role.title}
            </h1>
            <p className="sc-lede mt-6 max-w-3xl text-ink font-medium">{hy(role.lede)}</p>
            <dl className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-line/12 bg-surface p-4 shadow-sm">
                <dt className="sc-label flex items-center gap-2 text-accent-deep font-bold">
                  <MapPin className="h-4 w-4" aria-hidden="true" /> Arbeitsort
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink leading-relaxed">
                  Start in Essen ({COMPANY_INFO.street}), Baustellen in der Region
                </dd>
              </div>
              <div className="rounded-2xl border border-line/12 bg-surface p-4 shadow-sm">
                <dt className="sc-label flex items-center gap-2 text-accent-deep font-bold">
                  <Clock className="h-4 w-4" aria-hidden="true" /> Arbeitszeit
                </dt>
                <dd className="mt-1 text-sm font-semibold text-ink leading-relaxed">{role.hours}</dd>
              </div>
            </dl>
            <div className="mt-8">
              <ApplyButtons what={role.title} />
            </div>
            <div className="mt-8">
              <Chips items={role.keywords} label="Suchbegriffe zu dieser Stelle" />
            </div>
          </div>
        </section>

        <section className="surface-bone-2 sc-section" aria-label="Die Stelle im Einzelnen">
          <div className="sc-wrap">
            <ul className="grid gap-4 lg:grid-cols-3">
              {blocks.map(([heading, items]) => (
                <li key={heading} className="rounded-3xl border border-line/12 bg-surface p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-ink">{heading}</h2>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink font-medium">
                    {items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="sc-section py-10" aria-labelledby="apply-title">
          <div className="sc-wrap">
            <div className="band-ink flex flex-col gap-6 rounded-3xl border border-line/12 p-7 shadow-lg sm:p-10">
              <div className="max-w-2xl">
                <p className="sc-label font-bold">Bewerbung in zwei Minuten</p>
                <h2 id="apply-title" className="mt-2 font-editorial text-2xl font-bold leading-tight text-ink sm:text-3xl">
                  Schreiben Sie uns kurz, wer Sie sind und ab wann Sie anfangen können.
                </h2>
                <p className="mt-2 text-sm font-medium">
                  Name, Wohnort, Erfahrung und frühester Beginn genügen für den ersten Kontakt. Wir melden uns und vereinbaren ein Kennenlernen in Essen. Wie wir mit Ihren Angaben umgehen, steht in der{" "}
                  <a href="/datenschutz/#bewerbungen" className="underline underline-offset-2">
                    Datenschutzerklärung
                  </a>
                  .
                </p>
              </div>
              <ApplyButtons what={role.title} />
            </div>
          </div>
        </section>

        <section className="surface-bone sc-section">
          <div className="sc-wrap grid gap-12">
            <LinkGrid
              title="Einsatzorte: Jobs nach Stadt"
              links={CITY_PAGES.map((c) => ({ href: `/jobs/${c.slug}/`, label: `Jobs in ${c.name}`, sub: role.short }))}
            />
            <LinkGrid
              title="Weitere Stellen"
              links={[...JOB_ROLES.filter((r) => r.slug !== role.slug).map((r) => ({ href: `/jobs/${r.slug}/`, label: r.title })), { href: "/jobs/", label: "Alle Jobs im Überblick" }]}
            />
            <FaqList faqs={JOB_FAQS} title="Fragen zur Bewerbung" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function TownPage({ city }: { city: CityPage }) {
  const path = `/jobs/${city.slug}/`;
  const title = townTitle(city);
  const description = townDescription(city);
  const isBase = city.slug === "essen";
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Jobs", path: "/jobs/" },
    { name: `Jobs in ${city.name}`, path },
  ];
  const faqs = [
    {
      q: `Gibt es bei sos-abdichtung Jobs in ${city.name}?`,
      a: isBase
        ? "Ja. Unser Betrieb sitzt in Essen, Niebuhrstraße 46. Hier beginnt jeder Arbeitstag, und viele unserer Baustellen liegen in Essen selbst. Offen sind eine Vollzeitstelle als Abdichter oder Bauhelfer, eine Stelle in Teilzeit oder als Minijob und ein Studentenjob."
        : `Ja. Wir sanieren regelmäßig Keller in ${city.name} und suchen dafür Verstärkung: in Vollzeit, in Teilzeit oder als Minijob und als Studentenjob. Angestellt sind Sie bei unserem Betrieb in Essen; von dort fahren wir gemeinsam zu den Baustellen in ${city.name} und den Nachbarstädten.`,
    },
    ...JOB_FAQS,
  ];
  const graph = [
    businessNode(),
    websiteNode(),
    {
      // a landing page for job seekers in this town; the postings themselves live on the role pages
      "@type": "CollectionPage",
      "@id": `${abs(path)}#webpage`,
      url: abs(path),
      name: title,
      description,
      inLanguage: "de-DE",
      isPartOf: { "@id": WEBSITE_ID },
      breadcrumb: { "@id": `${abs(path)}#breadcrumb` },
      about: { "@type": "City", name: city.name, ...(city.wiki ? { sameAs: city.wiki } : {}) },
      significantLink: JOB_ROLES.map((r) => abs(`/jobs/${r.slug}/`)),
    },
    { ...breadcrumbNode(crumbs), "@id": `${abs(path)}#breadcrumb` },
    faqNode(faqs),
  ];
  const nearby = city.nearby
    .map((slug) => CITY_PAGES.find((c) => c.slug === slug))
    .filter(Boolean)
    .map((c) => ({ href: `/jobs/${c!.slug}/`, label: `Jobs in ${c!.name}`, sub: "Teilzeit, Minijob, Studentenjob, Vollzeit" }));

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main">
        <section className="sc-page-top" aria-labelledby="page-title">
          <div className="sc-wrap">
            <Breadcrumbs items={crumbs} />
            <h1 id="page-title" className="sc-display mt-6 max-w-4xl text-[2.3rem] leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
              Jobs in {city.name}: Teilzeit, Minijob, Studentenjob und Vollzeit im Handwerk
            </h1>
            <p className="sc-lede mt-6 max-w-3xl text-ink font-medium">
              {hy(
                isBase
                  ? "Sie suchen Arbeit in Essen? sos-abdichtung ist ein Handwerksbetrieb für Kellersanierung und Bautenschutz in Essen. Wir suchen einen Abdichter oder Bauhelfer in Vollzeit, eine Aushilfe in Teilzeit oder als Minijob und einen Werkstudenten. Erfahrung hilft, ist aber keine Bedingung: Quereinsteiger arbeitet der Inhaber selbst ein."
                  : `Sie suchen Arbeit in ${city.name}? sos-abdichtung saniert feuchte Keller in ${city.name} und sucht dafür Verstärkung: einen Abdichter oder Bauhelfer in Vollzeit, eine Aushilfe in Teilzeit oder als Minijob und einen Werkstudenten. Der Betrieb sitzt in Essen, die Baustellen liegen in ${city.name} und den Nachbarstädten. Quereinsteiger arbeitet der Inhaber selbst ein.`,
              )}
            </p>
            <div className="mt-8">
              <ApplyButtons what={`Jobs in ${city.name}`} town={city.name} />
            </div>
            <dl className="mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-line/12 bg-surface p-4 shadow-sm">
                <dt className="sc-label text-accent-deep font-bold">Offene Stellen</dt>
                <dd className="mt-1 font-editorial text-2xl sm:text-3xl font-bold text-ink">{JOB_ROLES.length}</dd>
              </div>
              <div className="rounded-2xl border border-line/12 bg-surface p-4 shadow-sm sm:col-span-2">
                <dt className="sc-label text-accent-deep font-bold">Einsatzgebiet in {city.name}</dt>
                <dd className="mt-1 text-sm font-semibold text-ink leading-relaxed">{city.districts.join(" · ")}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="surface-bone-2 sc-section" aria-labelledby="roles-title">
          <div className="sc-wrap">
            <div className="max-w-3xl">
              <p className="sc-label text-accent-deep font-bold">Stellenangebote</p>
              <h2 id="roles-title" className="sc-display mt-3 text-3xl sm:text-4xl text-ink">
                Arbeit in {city.name}: diese Stellen sind offen
              </h2>
              <p className="sc-lede mt-3 text-ink font-medium">
                {hy(`Ob Vollzeit, Teilzeitarbeit, Minijob, Nebenjob oder Studentenjob: Zu jeder Stelle stehen hier die Anforderungen. Die Aufgaben und den Weg zur Bewerbung finden Sie im jeweiligen Stellenangebot.`)}
              </p>
            </div>
            <ul className="mt-10 grid gap-4 lg:grid-cols-3">
              {JOB_ROLES.map((r) => (
                <RoleCard key={r.slug} role={r} town={city.name} />
              ))}
            </ul>
          </div>
        </section>

        <section className="surface-bone sc-section" aria-labelledby="work-title">
          <div className="sc-wrap grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div>
              <p className="sc-label text-accent-deep font-bold">Die Arbeit</p>
              <h2 id="work-title" className="sc-display mt-3 text-3xl sm:text-4xl text-ink">
                Was wir in {city.name} machen
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ink font-medium">
                {hy(
                  `Wir legen Keller trocken, von innen und ohne Aufgraben: Wir setzen Horizontalsperren per Injektion, dichten Kellerwände mit Dichtungsschlämme und Hohlkehle ab, verpressen Risse und tragen Sanierputz auf. Eine Baustelle dauert meist zwei bis vier Werktage. ${city.localFactors[0] ? city.localFactors[0].text : ""}`,
                )}
              </p>
              <a href={`/kellersanierung/${city.slug}/`} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-accent-deep hover:underline underline-offset-4">
                Kellersanierung {city.name}: so arbeiten wir vor Ort <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <div className="rounded-3xl border border-line/12 bg-surface p-6 shadow-sm">
              <h3 className="text-lg font-bold text-ink">Gesucht in {city.name}</h3>
              <div className="mt-4">
                <Chips items={JOB_KEYWORDS.map((k) => `${k} ${city.name}`)} label={`Arten von Jobs in ${city.name}`} />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-ink font-medium">
                Wie wir mit Bewerbungen umgehen, steht in der{" "}
                <a href="/datenschutz/#bewerbungen" className="underline underline-offset-2">
                  Datenschutzerklärung
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section className="surface-bone-2 sc-section">
          <div className="sc-wrap grid gap-12">
            <FaqList faqs={faqs} title={`Fragen zu Jobs in ${city.name}`} />
            {nearby.length > 0 && <LinkGrid title="Jobs in der Nähe" links={nearby} />}
            <LinkGrid title="Alle Stellen" links={[{ href: "/jobs/", label: "Alle Jobs im Überblick", sub: "Vollzeit, Teilzeit, Minijob, Studentenjob" }]} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function JobSlugPage({ params }: { params: { slug: string } }) {
  const role = jobRole(params.slug);
  if (role) return <RolePage role={role} />;
  const city = jobCity(params.slug);
  if (!city) notFound();
  return <TownPage city={city} />;
}
