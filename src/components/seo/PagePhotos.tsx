import type { PagePhoto } from "@/data/page-overrides";

/**
 * The photos the owner attached to this page in the admin ("Seiten & Fotos"). Renders nothing
 * while a page has none, so pages without photos look as before.
 */
export default function PagePhotos({ photos, title, id }: { photos: PagePhoto[]; title: string; id: string }) {
  if (!photos.length) return null;
  return (
    <section className="surface-bone sc-section" aria-labelledby={id}>
      <div className="sc-wrap">
        <h2 id={id} className="sc-display text-3xl sm:text-4xl text-ink">
          {title}
        </h2>
        <ul className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p) => (
            <li key={p.src}>
              <figure className="m-0">
                <img
                  src={p.src}
                  alt={p.alt}
                  width={p.w || undefined}
                  height={p.h || undefined}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] h-auto w-full rounded-2xl object-cover"
                />
                <figcaption className="mt-2 text-sm text-ink/70">{p.alt}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
