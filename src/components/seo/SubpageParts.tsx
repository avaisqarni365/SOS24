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
    <figure className="m-0 rounded-3xl border border-line/10 bg-white p-5 shadow-sm sm:p-6">
      <figcaption className="sc-label mb-4 text-[#0b0f0d]">{title}</figcaption>
      <ol className="grid gap-2.5" reversed>
        {ordered.map((l, i) => {
          const c = palette[(layers.length - 1 - i) % palette.length];
          return (
            <li
              key={l.name}
              className="grid grid-cols-[1.6rem_1fr] gap-3 rounded-2xl border border-line/8 bg-[#f7faf9] p-3.5"
              style={{ transform: `translateX(${i * 6}px)` }}
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

export function Prose({ sections }: { sections: PageSection[] }) {
  return (
    <div className="prose-sos grid gap-12 text-left">
      {sections.map((s) => (
        <section key={s.heading}>
          <h2 className="font-editorial text-3xl leading-tight text-[#0b0f0d] sm:text-4xl text-left">{keep(s.heading)}</h2>
          <div className="mt-5">
            {s.paragraphs.map((p, i) => (
              <p key={i} className="text-left text-[#2c3631] text-base leading-relaxed">{hy(p)}</p>
            ))}
            {s.bullets && s.bullets.length > 0 && (
              <ul className="mt-4 list-disc pl-5">
                {s.bullets.map((b) => (
                  <li key={b} className="text-left text-[#2c3631] my-1">{hy(b)}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
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
