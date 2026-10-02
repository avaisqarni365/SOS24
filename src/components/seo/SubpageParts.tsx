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
  const ordered = [...layers].reverse();
  return (
    <figure className="m-0 overflow-hidden rounded-3xl border border-line/10 bg-white p-5 shadow-sm sm:p-6">
      <figcaption className="sc-label mb-4 text-[#0b0f0d]">{title}</figcaption>
      <ol className="grid gap-2.5" reversed>
        {ordered.map((l, i) => {
          const c = palette[(layers.length - 1 - i) % palette.length];
          return (
            <li
              key={l.name}
              className="grid grid-cols-[1.6rem_1fr] gap-3 rounded-2xl border border-line/8 bg-[#f7faf9] p-3.5 transition-all hover:bg-white hover:border-[var(--mint)]/30 hover:shadow-xs sm:translate-x-[calc(var(--offset)*4px)]"
              style={{ ["--offset" as string]: i }}
            >
              <span className="layer-stack__n" style={{ background: c }} aria-hidden="true">
                {layers.length - i}
              </span>
              <div>
                <h3 className="text-[0.98rem] font-semibold text-[#0b0f0d]">{l.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#3b4641]">{hy(l.text)}</p>
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
          <p className="sc-label text-[var(--emerald-deep)] font-mono text-xs uppercase tracking-widest">
            Schadenserkennung
          </p>
          <h2 id="symptoms-title" className="sc-display mt-3 text-3xl sm:text-4xl text-[#0b0f0d]">
            {title}
          </h2>
          <p className="sc-lede mt-3 text-[#3b4641]">
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
                <p className="text-sm font-semibold text-[#0b0f0d] leading-snug">{hy(s)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line/10 bg-[#f7faf9] px-6 py-4">
          <p className="text-sm text-[#3b4641]">
            <strong className="text-[#0b0f0d]">Wichtig:</strong> Unbehandelte Feuchtigkeit führt zu Schimmelbefall und zerstört das Mauerwerk. Handeln Sie rechtzeitig.
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
          <p className="sc-label text-[var(--emerald-deep)] font-mono text-xs uppercase tracking-widest">
            Ablauf & Verlässlichkeit
          </p>
          <h2 id="process-steps-heading" className="sc-display mt-3 text-3xl sm:text-4xl lg:text-5xl text-[#0b0f0d]">
            {title}
          </h2>
          <p className="sc-lede mt-3 text-[#3b4641]">
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
                  <span className="font-mono text-xs font-semibold text-[#8a9691] uppercase tracking-wider">
                    Phase 0{i + 1}
                  </span>
                </div>

                <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#0b0f0d] leading-snug group-hover:text-[var(--emerald-deep)] transition-colors">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-[#3b4641] leading-relaxed">
                  {hy(s.text)}
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
              <p className="text-sm text-[#55605c] mt-0.5">Wir messen die Durchfeuchtung direkt im Mauerwerk und erstellen ein verbindliches Festpreisangebot.</p>
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

/** Technical Layers Frame: System cross-section & layered breakdown */
export function TechnicalLayersFrame({
  layers,
  serviceName,
}: {
  layers: LayerNote[];
  serviceName?: string;
}) {
  return (
    <section className="sc-section bg-[#f7faf9] border-t border-line/10" aria-labelledby="layers-title">
      <div className="sc-wrap">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p className="sc-label text-[var(--emerald-deep)] font-mono text-xs uppercase tracking-widest">
              Technischer Aufbau
            </p>
            <h2 id="layers-title" className="sc-display mt-3 text-3xl sm:text-4xl text-[#0b0f0d]">
              Schicht für Schicht: <em>Das System im Querschnitt</em>
            </h2>
            <p className="sc-lede mt-4 text-[#3b4641]">
              Eine dauerhafte Abdichtung beruht auf einem perfekt aufeinander abgestimmten Schichtenaufbau. Jede Lage erfüllt eine unverzichtbare Funktion im Schutz gegen Nässe, Druckwasser und Salze.
            </p>

            <div className="mt-8 space-y-4 rounded-3xl border border-line/10 bg-white p-6 sm:p-7 shadow-sm">
              <h3 className="font-bold text-[#0b0f0d] text-base">Warum das System ganzheitlich wirkt:</h3>
              <p className="text-sm text-[#3b4641] leading-relaxed">
                Ein einfacher Anstrich oder isolierte Einzelmaßnahmen halten drückendem Wasser nicht stand. Unser zertifiziertes System kombiniert mechanische und chemische Schutzschichten von innen, sodass die Bausubstanz dauerhaft geschützt und entfeuchtet wird – ganz ohne Aufgraben.
              </p>
              <div className="pt-4 border-t border-line/8 flex items-center justify-between text-xs text-[#55605c]">
                <span>25 Jahre Produktgarantie</span>
                <span className="font-semibold text-[var(--emerald-deep)]">10 Jahre Handwerksgarantie</span>
              </div>
            </div>
          </div>

          <div>
            <LayerStack layers={layers} title="Funktion der einzelnen Schichten" />
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
          <p className="sc-label text-[var(--emerald-deep)] font-mono text-xs uppercase tracking-widest">Fachwissen</p>
          <h2 className="sc-display mt-3 text-3xl sm:text-4xl text-[#0b0f0d]">{title}</h2>
          {subtitle && <p className="sc-lede mt-3 text-[#3b4641] max-w-3xl">{subtitle}</p>}
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
            <span className="font-mono text-xs uppercase tracking-wider text-[#8a9691]">Fachinformation</span>
          </div>

          <h3 className="font-editorial text-2xl sm:text-3xl font-bold leading-tight text-[#0b0f0d]">
            {keep(s.heading)}
          </h3>

          <div className="mt-5 space-y-4">
            {s.paragraphs.map((p, i) => (
              <p key={i} className="text-[#2c3631] text-base leading-relaxed">
                {hy(p)}
              </p>
            ))}
          </div>

          {s.bullets && s.bullets.length > 0 && (
            <div className="mt-6 pt-6 border-t border-line/8">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--emerald-deep)] mb-3">
                Wichtige Punkte auf einen Blick:
              </p>
              <ul className="grid gap-2.5 sm:grid-cols-2">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 rounded-2xl bg-[#f7faf9] border border-line/8 p-3.5 text-sm font-medium text-[#1c2621]"
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
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--emerald-deep)]">{title}</p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border border-line/12 bg-white px-5 py-4 font-semibold text-[#0b0f0d] shadow-sm hover:border-[var(--emerald-deep)] hover:shadow-md transition-all"
            >
              <span>
                {l.label}
                {l.sub ? <span className="block text-xs font-normal text-[#55605c]">{l.sub}</span> : null}
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
