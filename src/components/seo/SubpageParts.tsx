import type { Faq, LayerNote, PageSection } from "@/data/seo-pages";
import { hy, keep } from "@/lib/hyphenate";

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Brotkrumen" className="font-mono text-xs text-[var(--sc-ink-soft)]">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-2">
            {i < items.length - 1 ? (
              <>
                <a href={it.path} className="hover:text-[var(--bone)]">
                  {it.name}
                </a>
                <span aria-hidden="true">/</span>
              </>
            ) : (
              <span aria-current="page" className="text-[var(--bone)]">
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
export function LayerStack({ layers, title }: { layers: LayerNote[]; title: string }) {
  const palette = ["#7a6146", "#9a6b4b", "#62c4ac", "#8f9a96", "#d9d2c1", "#f3f1ec"];
  const ordered = [...layers].reverse();
  return (
    <figure className="m-0 rounded-3xl border border-line/10 bg-[var(--ink-2)] p-5 sm:p-6">
      <figcaption className="sc-label mb-4 no-justify">{title}</figcaption>
      <ol className="grid gap-2.5" reversed>
        {ordered.map((l, i) => {
          const c = palette[(layers.length - 1 - i) % palette.length];
          return (
            <li
              key={l.name}
              className="grid grid-cols-[0.9rem_1fr] gap-3 rounded-2xl border border-line/5 bg-[var(--ink-3)] p-3.5"
              style={{ transform: `translateX(${i * 6}px)` }}
            >
              <span className="mt-1 h-full min-h-[2.2rem] w-3 rounded-full" style={{ background: c }} aria-hidden="true" />
              <div>
                <h3 className="text-[0.98rem] font-semibold text-[var(--bone)]">{l.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--sc-ink-soft)]">{hy(l.text)}</p>
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
    <div className="prose-sos grid gap-12">
      {sections.map((s) => (
        <section key={s.heading}>
          <h2 className="font-editorial text-3xl leading-tight text-[var(--head-on-bone)] sm:text-4xl">{keep(s.heading)}</h2>
          <div className="mt-5">
            {s.paragraphs.map((p, i) => (
              <p key={i}>{hy(p)}</p>
            ))}
            {s.bullets && s.bullets.length > 0 && (
              <ul>
                {s.bullets.map((b) => (
                  <li key={b}>{hy(b)}</li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

export function FaqList({ faqs, title }: { faqs: Faq[]; title: string }) {
  return (
    <section aria-labelledby="faq-sub-title">
      <h2 id="faq-sub-title" className="font-editorial text-3xl text-[var(--head-on-bone)] sm:text-4xl">
        {title}
      </h2>
      <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
        {faqs.map((f) => (
          <details key={f.q} className="faq-item py-5">
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
              className="flex min-h-[56px] items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-5 py-4 font-semibold text-[var(--head-on-bone)] hover:border-[var(--emerald-deep)]"
            >
              <span>
                {l.label}
                {l.sub ? <span className="block text-xs font-normal text-[var(--text-on-bone)]">{l.sub}</span> : null}
              </span>
              <span aria-hidden="true" className="text-[var(--emerald-deep)]">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
