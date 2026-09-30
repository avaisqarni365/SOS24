import { SERVICE_CARDS } from "@/data/services";
import { PROCESS_PIPELINE, FAQS, COMPANY_INFO } from "@/data/content-data";
import { CITY_PAGES } from "@/data/seo-pages";
import ServiceArt from "@/components/brand/ServiceArt";
import FeuchteScanner from "@/components/interactive/FeuchteScanner";
import { hy } from "@/lib/hyphenate";

/* ------------------------------------------------------------- scanner -- */
export function ScannerSection() {
  return (
    <section
      id="feuchte-scanner"
      className="sc-section"
      aria-labelledby="scanner-title"
      data-sc-act="flow"
      data-sc-drift="#101613"
    >
      <div className="sc-wrap">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end" data-sc-in>
          <h2 id="scanner-title" className="sc-display text-4xl sm:text-5xl lg:text-6xl">
            Erst messen. <em className="text-[var(--mint)]">Dann bohren.</em>
          </h2>
          <p className="sc-body">
            {hy("Frisch gestrichen sieht jede Wand trocken aus. Führen Sie die Sonde über die Wand und sehen Sie, was eine Feuchtemessung sichtbar macht: aufsteigende Nässe im Sockel, Kondensat in der kalten Ecke, ein Riss, der Wasser führt. Jede Ursache braucht ein anderes Verfahren.")}
          </p>
        </div>
        <FeuchteScanner />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- services -- */
export function ServicesRail() {
  return (
    <section
      id="leistungen"
      aria-labelledby="leistungen-title"
      data-sc-act="pan"
      data-sc-span="3.2"
      data-sc-drift="#0e1310"
      style={{ ["--sc-span" as string]: 3.2 }}
    >
      <div data-sc-stage className="rail-stage">
        <div className="rail" data-sc-pan="0.08">
          <div className="rail__lead">
            <p className="sc-label">Leistungen</p>
            <h2 id="leistungen-title" className="sc-display mt-3 text-4xl sm:text-5xl">
              Sechs Verfahren. Eine Ursache nach der anderen.
            </h2>
            <p className="sc-body mt-4">
              {hy("Welche Leistung Ihr Keller braucht, entscheidet die Messung. Hier ist, was wir einsetzen.")}
            </p>
          </div>
          {SERVICE_CARDS.map((s) => (
            <a key={s.slug} className="service-card" href={`/leistungen/${s.slug}/`}>
              <div className="service-card__art" data-sc-tilt="5">
                <ServiceArt kind={s.art} />
              </div>
              <div className="service-card__body">
                <h3>{s.title}</h3>
                <p>{hy(s.text)}</p>
                <span className="service-card__more">
                  Mehr zu {s.title.split(" ")[0]} <span aria-hidden="true">→</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- process -- */
export function ProcessSection() {
  return (
    <section id="ablauf" className="surface-bone sc-section" aria-labelledby="ablauf-title" data-sc-act="flow">
      <div className="sc-wrap">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start" data-sc-in>
            <p className="sc-label" style={{ color: "var(--emerald-deep)" }}>
              Ablauf
            </p>
            <h2 id="ablauf-title" className="sc-display mt-3 text-4xl sm:text-5xl lg:text-6xl text-[var(--head-on-bone)]">
              Vom ersten Anruf zur trockenen Wand.
            </h2>
            <p className="mt-5 max-w-md text-[var(--text-on-bone)]">
              {hy(`${COMPANY_INFO.owner} kommt selbst zur Messung. Danach wissen Sie, was die Ursache ist, was die Sanierung kostet und wie lange sie dauert.`)}
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--text-on-bone)]">Garantie</dt>
                <dd className="mt-1 font-editorial text-4xl text-[var(--head-on-bone)]">
                  10 Jahre
                </dd>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--text-on-bone)]">Erdarbeiten</dt>
                <dd className="mt-1 font-editorial text-4xl text-[var(--head-on-bone)]">keine</dd>
              </div>
            </dl>
          </div>
          <ol className="grid gap-5" data-sc-stagger="90">
            {PROCESS_PIPELINE.map((s, i) => (
              <li key={s.step} className="relative rounded-3xl border border-black/5 bg-white p-7 shadow-sm sm:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-editorial text-2xl text-[var(--head-on-bone)] sm:text-3xl">{s.title}</h3>
                  <span className="shrink-0 font-mono text-xs uppercase tracking-wider text-[var(--emerald-deep)]">
                    {s.time}
                  </span>
                </div>
                <p className="mt-3 text-[var(--text-on-bone)]">{hy(s.desc)}</p>
                <div
                  className="absolute bottom-0 left-8 h-1 rounded-full bg-[var(--mint)]"
                  style={{ width: `${(i + 1) * 20}%` }}
                  aria-hidden="true"
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- region -- */
const project = (lat: number, lng: number) => ({
  x: ((lng - 6.9) / 0.42) * 600,
  y: ((51.48 - lat) / 0.37) * 420,
});

export function RegionSection() {
  const hq = project(51.455, 7.011);
  return (
    <section
      id="servicegebiet"
      className="sc-section"
      aria-labelledby="region-title"
      data-sc-act="flow"
      data-sc-drift="#0e1310"
    >
      <div className="sc-wrap grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div data-sc-in>
          <p className="sc-label">Servicegebiet</p>
          <h2 id="region-title" className="sc-display mt-3 text-4xl sm:text-5xl lg:text-6xl">
            Wuppertal und das Bergische Land.
          </h2>
          <p className="sc-body mt-5">
            {hy("Hanglagen, Grundwasser im Tal der Wupper, viel Altbau aus Ziegel und Bruchstein ohne zeitgemäße Horizontalsperre: Die Region hat ihre eigenen Kellerprobleme. Wählen Sie Ihre Stadt.")}
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CITY_PAGES.map((c) => (
              <li key={c.slug}>
                <a
                  href={`/kellersanierung/${c.slug}/`}
                  className="flex min-h-[48px] flex-col justify-center rounded-2xl border border-white/10 bg-[var(--ink-2)] px-4 py-3 hover:border-[var(--mint)]"
                >
                  <span className="font-semibold">{c.name}</span>
                  <span className="font-mono text-[0.7rem] text-[var(--sc-ink-soft)]">{c.responseTime}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <figure className="m-0" data-sc-reveal="iris" data-sc-reveal-at="0.1 0.5">
          <svg
            viewBox="0 0 600 420"
            className="region-map h-auto w-full rounded-3xl bg-[var(--ink-2)]"
            role="img"
            aria-labelledby="region-map-title"
          >
            <title id="region-map-title">Karte des Servicegebiets rund um Wuppertal mit Sitz in Essen</title>
            <defs>
              <radialGradient id="rg" cx="0.6" cy="0.65" r="0.6">
                <stop offset="0" stopColor="#62c4ac" stopOpacity="0.16" />
                <stop offset="1" stopColor="#62c4ac" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="600" height="420" fill="url(#rg)" />
            <g stroke="#f3f1ec" strokeOpacity="0.05">
              {Array.from({ length: 12 }).map((_, i) => (
                <path key={`v${i}`} d={`M${i * 50} 0 V420`} />
              ))}
              {Array.from({ length: 9 }).map((_, i) => (
                <path key={`h${i}`} d={`M0 ${i * 50} H600`} />
              ))}
            </g>
            <path
              d="M600 238 C540 250 470 262 420 270 C390 275 370 280 357 282 C320 290 300 300 305 330 C310 360 280 380 250 420"
              stroke="#3b82c4"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              opacity="0.8"
            />
            <text x="470" y="255" fill="#5a8fc4" fontSize="13" fontStyle="italic">
              Wupper
            </text>
            {CITY_PAGES.map((c) => {
              const p = project(c.geo.lat, c.geo.lng);
              return (
                <path
                  key={`l-${c.slug}`}
                  d={`M${hq.x} ${hq.y} L${p.x} ${p.y}`}
                  stroke="#62c4ac"
                  strokeOpacity="0.18"
                  strokeDasharray="4 6"
                />
              );
            })}
            <g>
              <rect x={hq.x - 7} y={hq.y - 7} width="14" height="14" rx="3" fill="#f3f1ec" />
              <text x={hq.x + 14} y={hq.y + 5} fill="#f3f1ec" fontSize="14">
                Essen (Sitz)
              </text>
            </g>
            {CITY_PAGES.map((c) => {
              const p = project(c.geo.lat, c.geo.lng);
              const big = c.slug === "wuppertal";
              return (
                <a key={c.slug} href={`/kellersanierung/${c.slug}/`}>
                  {big && <circle cx={p.x} cy={p.y} r="34" fill="#62c4ac" opacity="0.12" />}
                  <circle className="pin" cx={p.x} cy={p.y} r={big ? 9 : 6} fill={big ? "#62c4ac" : "#f3f1ec"} />
                  <text x={p.x + 12} y={p.y + 5} fill="#f3f1ec" fontSize={big ? 18 : 14} fontWeight={big ? 700 : 500}>
                    {c.name}
                  </text>
                </a>
              );
            })}
          </svg>
        </figure>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ faq -- */
export function FaqSection() {
  return (
    <section id="faq" className="surface-bone sc-section" aria-labelledby="faq-title" data-sc-act="flow">
      <div className="sc-wrap max-w-4xl">
        <h2 id="faq-title" className="sc-display text-4xl sm:text-5xl text-[var(--head-on-bone)]" data-sc-in>
          Häufige Fragen zur Kellersanierung
        </h2>
        <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {FAQS.map((f) => (
            <details key={f.q} className="faq-item group py-5">
              <summary className="flex min-h-[44px] items-start justify-between gap-6 text-left text-lg font-semibold text-[var(--head-on-bone)]">
                <span>{f.q}</span>
                <span className="faq-plus mt-1 text-2xl leading-none text-[var(--emerald-deep)]" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[var(--text-on-bone)]">{hy(f.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
