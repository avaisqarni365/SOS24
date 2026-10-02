import type { Faq, LayerNote, PageSection } from "@/data/seo-pages";
import { hy, keep } from "@/lib/hyphenate";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Brotkrumen" className="font-mono text-xs text-[#55605c]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-2">
            {i < items.length - 1 ? (
              <>
                <a href={it.path} className="hover:text-[#0b0f0d] transition-colors">
                  {it.name}
                </a>
                <span aria-hidden="true" className="text-black/30">/</span>
              </>
            ) : (
              <span aria-current="page" className="text-[#0b0f0d] font-semibold">
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Layer-by-layer stack: bottom of the list is the ground side, as in the homepage cross-section. */
/** Layer colours, deepest first: soil, masonry, barrier, seal, plaster, board. */
export const LAYER_PALETTE = ["#7a6146", "#9a6b4b", "#62c4ac", "#8f9a96", "#d9d2c1", "#f3f1ec"];

/**
 * The layers as a numbered ruler laid over a picture: 1 is the deepest
 * layer, the numbers match the "Schicht für Schicht" list beside it.
 * compact shows the first three and a "+n".
 */
export function LayerRuler({ layers, compact = false }: { layers: { name: string }[]; compact?: boolean }) {
  const shown = compact ? layers.slice(0, 3) : layers;
  const more = layers.length - shown.length;
  return (
    <ol className={`layer-ruler${compact ? " layer-ruler--compact" : ""}`} aria-label="Schichten, von innen nach außen nummeriert">
      {shown.map((l, i) => (
        <li key={l.name}>
          <span className="layer-ruler__n" style={{ background: LAYER_PALETTE[i % LAYER_PALETTE.length] }}>
            {i + 1}
          </span>
          {l.name}
        </li>
      ))}
      {more > 0 ? <li className="layer-ruler__more">+{more}</li> : null}
    </ol>
  );
}

export function LayerStack({ layers, title }: { layers: LayerNote[]; title: string }) {
  const palette = LAYER_PALETTE;
  return (
    <figure className="m-0 overflow-hidden rounded-3xl border border-line/12 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-line/8">
        <figcaption className="sc-label text-[#0b0f0d]">{title}</figcaption>
        <span className="font-mono text-xs text-[#7a8681]">Einflussfaktoren</span>
      </div>
      <ol className="grid gap-3">
        {layers.map((l, i) => {
          const c = palette[i % palette.length];
          return (
            <li
              key={l.name}
              className="grid grid-cols-[2rem_1fr] gap-3.5 rounded-2xl border border-line/8 bg-[#f7faf9] p-4 transition-all hover:bg-white hover:border-[var(--mint)] hover:shadow-xs"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs font-bold text-white shadow-xs"
                style={{ background: c }}
                aria-hidden="true"
              >
                0{i + 1}
              </span>
              <div>
                <h3 className="text-base font-bold text-[#0b0f0d]">{l.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#0b0f0d] font-medium">{l.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

/** Framed Symptoms Section: problem identification in clean cards */
export function SymptomsFrame({
  symptoms,
  serviceName,
  title = "Woran Sie es erkennen: Typische Anzeichen",
  subtitle = "Feuchtigkeit und Feuchteschäden entwickeln sich schleichend. Achten Sie auf diese typischen Anzeichen:",
}: {
  symptoms: string[];
  serviceName?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="sc-section bg-white border-t border-line/10" aria-labelledby="symptoms-title">
      <div className="sc-wrap">
        <div className="max-w-3xl mb-10">
          <p className="sc-label text-[var(--emerald-deep)] font-mono text-xs uppercase tracking-widest font-bold">
            Schadenserkennung
          </p>
          <h2 id="symptoms-title" className="sc-display mt-3 text-3xl sm:text-4xl text-[#0b0f0d]">
            {title}
          </h2>
          <p className="sc-lede mt-3 text-[#0b0f0d] font-medium">
            {subtitle}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {symptoms.map((s) => (
            <div
              key={s}
              className="flex items-start gap-3.5 rounded-2xl border border-line/10 bg-[#f7faf9] p-5 shadow-xs transition-all hover:bg-white hover:border-[var(--mint)]/40 hover:shadow-sm"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-800 font-bold text-sm mt-0.5" aria-hidden="true">
                !
              </span>
              <div>
                <p className="text-sm font-semibold text-[#0b0f0d] leading-snug">{s}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line/10 bg-[#f7faf9] px-6 py-4">
          <p className="text-sm text-[#0b0f0d] font-medium">
            <strong className="text-[#000000] font-bold">Wichtig:</strong> Unbehandelte Feuchtigkeit führt zu Schimmelbefall und zerstört das Mauerwerk. Handeln Sie rechtzeitig.
          </p>
          <a href="#kontakt" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--emerald-deep)] hover:underline">
            Kostenlose Feuchtemessung anfragen <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/** Prominent full-width Process Steps Frame */
export function ProcessSteps({
  steps,
  title = "In 4 Schritten zum dauerhaft trockenen Ergebnis",
  subtitle = "Transparenz und Verlässlichkeit vom ersten Vor-Ort-Termin bis zur sauberen Übergabe mit Garantie.",
}: {
  steps: { title: string; text: string }[];
  title?: string;
  subtitle?: string;
}) {
  const perks = [
    "Kostenlos & unverbindlich vor Ort",
    "Garantierter Festpreis ohne Nachforderungen",
    "Saubere Ausführung ohne Bagger & Aufgraben",
    "10 Jahre Garantie & schriftliches Protokoll",
  ];

  return (
    <section className="sc-section bg-[#f7faf9] border-t border-line/10" aria-labelledby="process-steps-heading">
      <div className="sc-wrap">
        <div className="max-w-3xl mb-12">
          <p className="sc-label text-[var(--emerald-deep)] font-mono text-xs uppercase tracking-widest font-bold">
            Ablauf & Verlässlichkeit
          </p>
          <h2 id="process-steps-heading" className="sc-display mt-3 text-3xl sm:text-4xl lg:text-5xl text-[#0b0f0d]">
            {title}
          </h2>
          <p className="sc-lede mt-3 text-[#0b0f0d] font-medium">
            {subtitle}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="group relative flex flex-col justify-between rounded-3xl border border-line/12 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[var(--mint)]"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--mint)] font-mono text-base font-bold text-white shadow-sm transition-transform group-hover:scale-105">
                    0{i + 1}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0b0f0d] uppercase tracking-wider">
                    Phase 0{i + 1}
                  </span>
                </div>

                <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#0b0f0d] leading-snug group-hover:text-[var(--emerald-deep)] transition-colors">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-[#0b0f0d] font-medium leading-relaxed">
                  {s.text}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-line/8">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--emerald-deep)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--mint)]" />
                  {perks[i] || "Fachgerechte Ausführung"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-line/10 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--mint)]/10 text-[var(--mint)]">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-base text-[#0b0f0d]">Kostenlose Schadensanalyse vor Ort</h4>
              <p className="text-sm text-[#0b0f0d] font-medium mt-0.5">Wir messen die Durchfeuchtung direkt im Mauerwerk und erstellen ein verbindliches Festpreisangebot.</p>
            </div>
          </div>
          <a
            href="#kontakt"
            className="shrink-0 inline-flex min-h-[46px] items-center rounded-full bg-[var(--grad)] px-6 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            Termin anfragen <span aria-hidden="true">&nbsp;→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/** Technical Layers Frame: Modern Architectural Bento Showcase */
export function TechnicalLayersFrame({
  layers,
  serviceName,
}: {
  layers: LayerNote[];
  serviceName?: string;
}) {
  const palette = LAYER_PALETTE;
  const layerRoles = [
    "Basis & Fundament",
    "Wirkzone & Injektion",
    "Druckwassersperre",
    "Diffusions- & Salzpuffer",
    "Oberfläche & Raumklima",
  ];

  return (
    <section className="sc-section bg-[#f7faf9] border-t border-line/10" aria-labelledby="layers-title">
      <div className="sc-wrap">
        <div className="rounded-3xl sm:rounded-4xl border border-line/12 bg-white p-6 sm:p-10 lg:p-12 shadow-sm">
          {/* Header */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--mint)]/10 border border-[var(--mint)]/20 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[var(--emerald-deep)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--mint)]" />
              <span>Bauphysik · DIN 18533 · Mehrschicht-System</span>
            </div>
            <h2 id="layers-title" className="sc-display mt-4 text-3xl sm:text-4xl lg:text-5xl text-[#0b0f0d]">
              Schicht für Schicht: <span className="text-[var(--emerald-deep)]">Das System im Querschnitt</span>
            </h2>
            <p className="sc-lede mt-4 text-[#0b0f0d] font-medium">
              Eine dauerhafte Bauwerksabdichtung basiert auf dem exakt aufeinander abgestimmten Verbund spezialisierter Schutzlagen. Jede Schicht erfüllt eine unverzichtbare Funktion im dauerhaften Schutz gegen drückendes Wasser, aufsteigende Feuchte und Bausalze.
            </p>
          </div>

          {/* 2-Column Bento Grid */}
          <div className="mt-10 sm:mt-12 grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:items-stretch">
            {/* Left: System Function & Warranties */}
            <div className="flex flex-col justify-between gap-6">
              <div className="rounded-2xl sm:rounded-3xl border border-line/10 bg-[#f7faf9] p-6 sm:p-8 flex-1">
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#0b0f0d] leading-snug">
                  Warum isolierte Einzelmaßnahmen versagen
                </h3>
                <p className="mt-3 text-sm sm:text-base text-[#0b0f0d] font-medium leading-relaxed">
                  Ein oberflächlicher Anstrich oder reine Entfeuchtungsgeräte bekämpfen nur kurzfristige Symptome. Unser bauaufsichtlich zugelassenes System stoppt das Wasser direkt in den Kapillaren, wehrt drückendes Erdreich ab und sorgt für eine diffusionsoffene Austrocknung – ohne Aufgraben und ohne Bagger im Garten.
                </p>

                <div className="mt-6 pt-6 border-t border-line/8 space-y-3.5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--mint)]/15 text-[var(--emerald-deep)] font-bold text-xs mt-0.5" aria-hidden="true">✓</span>
                    <p className="text-xs sm:text-sm text-[#0b0f0d] font-medium leading-snug">
                      <strong className="text-[#000000] font-bold">Sperrt Kapillarwasser:</strong> Hydrophobiert die Poren dauerhaft auf molekularer Ebene.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--mint)]/15 text-[var(--emerald-deep)] font-bold text-xs mt-0.5" aria-hidden="true">✓</span>
                    <p className="text-xs sm:text-sm text-[#0b0f0d] font-medium leading-snug">
                      <strong className="text-[#000000] font-bold">Druckwasserdicht:</strong> Hält auch bei starkem Hangwasser und Regen zuverlässig dicht.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--mint)]/15 text-[var(--emerald-deep)] font-bold text-xs mt-0.5" aria-hidden="true">✓</span>
                    <p className="text-xs sm:text-sm text-[#0b0f0d] font-medium leading-snug">
                      <strong className="text-[#000000] font-bold">Salzresistent & atmungsaktiv:</strong> Lagert Salze schadlos ein und beugt Schimmel vor.
                    </p>
                  </div>
                </div>
              </div>

              {/* Warranties & Action Card */}
              <div className="rounded-2xl sm:rounded-3xl border border-[var(--mint)]/20 bg-gradient-to-br from-[#f0f9f6] via-white to-white p-6 sm:p-7 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-[var(--emerald-deep)] font-bold">
                    Garantierte Sicherheit
                  </span>
                  <span className="rounded-full bg-[var(--mint)]/15 text-[var(--emerald-deep)] font-bold text-xs px-2.5 py-0.5">
                    Geprüfter Fachbetrieb
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white border border-line/8 p-3.5 shadow-2xs">
                    <span className="block font-bold text-lg sm:text-xl text-[var(--emerald-deep)]">25 Jahre</span>
                    <span className="text-[#0b0f0d] text-xs font-semibold">SchimmelPeter® Produktgarantie</span>
                  </div>
                  <div className="rounded-xl bg-white border border-line/8 p-3.5 shadow-2xs">
                    <span className="block font-bold text-lg sm:text-xl text-[var(--emerald-deep)]">10 Jahre</span>
                    <span className="text-[#0b0f0d] text-xs font-semibold">SOS Abdichtung Handwerksgarantie</span>
                  </div>
                </div>

                <a
                  href="#kontakt"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--grad)] py-3.5 px-4 text-sm font-semibold text-white shadow-sm hover:opacity-95 transition-opacity"
                >
                  Kostenlose Vor-Ort-Analyse anfragen <span aria-hidden="true">&nbsp;→</span>
                </a>
              </div>
            </div>

            {/* Right: Architectural Cross-Section Timeline */}
            <div className="rounded-2xl sm:rounded-3xl border border-line/10 bg-[#f7faf9] p-5 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-line/8">
                  <div>
                    <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#0b0f0d]">
                      Funktion der einzelnen Schichten
                    </h3>
                    <p className="text-xs text-[#0b0f0d] font-semibold mt-0.5">
                      Systemaufbau vom Baugrund bis zur Wandoberfläche
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#0b0f0d] font-bold bg-white px-3 py-1 rounded-full border border-line/10 shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--mint)]" />
                    Erdreich ──► Wohnraum
                  </span>
                </div>

                {/* Layer Cards */}
                <div className="space-y-3.5 relative">
                  {layers.map((l, i) => (
                    <div
                      key={l.name}
                      className="group relative rounded-2xl border border-line/10 bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-[var(--mint)] hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <span
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold text-white shadow-xs"
                            style={{ background: palette[i % palette.length] }}
                            aria-hidden="true"
                          >
                            0{i + 1}
                          </span>
                          <h4 className="font-bold text-base sm:text-[1.05rem] text-[#0b0f0d] group-hover:text-[var(--emerald-deep)] transition-colors">
                            {l.name}
                          </h4>
                        </div>
                        <span className="hidden sm:inline-flex text-[0.7rem] font-mono uppercase tracking-wider text-[#0b0f0d] font-bold bg-[#f7faf9] px-2.5 py-1 rounded-md border border-line/10 shrink-0">
                          {layerRoles[i] || `Schicht 0${i + 1}`}
                        </span>
                      </div>

                      <p className="text-sm text-[#0b0f0d] font-medium leading-relaxed sm:pl-11 mt-1.5 sm:mt-0">
                        {l.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-line/8">
                <p className="text-xs text-[#0b0f0d] font-medium leading-relaxed">
                  <strong className="text-[#000000] font-bold">Wichtig:</strong> Die genaue Zusammensetzung und Stärke der Schichten wird bei der kostenlosen Vor-Ort-Messung exakt auf das Mauerwerk Ihres Objekts (Ziegel, Bruchstein, Beton) abgestimmt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Framed Article Cards for rich SEO knowledge */
export function Prose({
  sections,
  title,
  subtitle,
}: {
  sections: PageSection[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="grid gap-8 text-left">
      {title && (
        <div className="mb-2">
          <p className="sc-label text-[var(--emerald-deep)] font-mono text-xs uppercase tracking-widest font-bold">Fachwissen</p>
          <h2 className="sc-display mt-3 text-3xl sm:text-4xl text-[#0b0f0d]">{title}</h2>
          {subtitle && <p className="sc-lede mt-3 text-[#0b0f0d] font-medium max-w-3xl">{subtitle}</p>}
        </div>
      )}
      {sections.map((s, idx) => (
        <article
          key={s.heading}
          className="rounded-3xl border border-line/12 bg-white p-6 sm:p-9 shadow-sm transition-all hover:border-[var(--mint)]/30 hover:shadow-md"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--mint)]/10 font-mono text-xs font-bold text-[var(--emerald-deep)]">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-xs uppercase tracking-wider text-[#0b0f0d] font-bold">Fachinformation</span>
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl font-bold leading-tight text-[#0b0f0d]">
            {keep(s.heading)}
          </h3>

          <div className="mt-5 space-y-4">
            {s.paragraphs.map((p, i) => (
              <p key={i} className="text-[#0b0f0d] font-medium text-base leading-relaxed">
                {hy(p)}
              </p>
            ))}
          </div>

          {s.bullets && s.bullets.length > 0 && (
            <div className="mt-6 pt-6 border-t border-line/8">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--emerald-deep)] mb-3">
                Wichtige Punkte auf einen Blick:
              </p>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 rounded-2xl bg-[#f7faf9] border border-line/8 p-3.5 text-sm font-semibold text-[#0b0f0d]"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--mint)]/15 text-[var(--mint)] font-bold text-xs mt-0.5" aria-hidden="true">
                      ✓
                    </span>
                    <span className="leading-snug">{hy(b)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

/** Questions as numbered cards; the open one is marked. Used on every page. */
export function FaqCards({ faqs, openFirst = true }: { faqs: Faq[]; openFirst?: boolean }) {
  return (
    <div className="faq-cards">
      {faqs.map((f, i) => (
        <details key={f.q} className="faq-card" open={openFirst && i === 0}>
          <summary>
            <span className="faq-card__n" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="faq-card__q">{f.q}</span>
            <span className="faq-card__icon" aria-hidden="true" />
          </summary>
          <div className="faq-card__a">
            <p>{hy(f.a)}</p>
          </div>
        </details>
      ))}
    </div>
  );
}

export function FaqList({ faqs, title }: { faqs: Faq[]; title: string }) {
  return (
    <section aria-labelledby="faq-sub-title">
      <p className="sc-label">Häufige Fragen</p>
      <h2 id="faq-sub-title" className="sc-display mt-3 text-left">
        {title}
      </h2>
      <div className="mt-8">
        <FaqCards faqs={faqs} />
      </div>
    </section>
  );
}

export function LinkGrid({ title, links }: { title: string; links: { href: string; label: string; sub?: string }[] }) {
  return (
    <section aria-label={title}>
      <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[var(--emerald-deep)]">{title}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border border-line/12 bg-white px-5 py-4 font-semibold text-[#0b0f0d] shadow-sm hover:border-[var(--emerald-deep)] hover:shadow-md transition-all"
            >
              <span>
                {l.label}
                {l.sub ? <span className="block text-xs font-semibold text-[#0b0f0d]">{l.sub}</span> : null}
              </span>
              <span aria-hidden="true" className="text-[var(--emerald-deep)] font-bold">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
