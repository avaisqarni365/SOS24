import raw from "../../public/data/pages.json";
import { CITY_PAGES, SERVICE_PAGES, type CityPage, type ServicePage } from "@/data/seo-pages";

/**
 * Page content from the admin ("Seiten & Fotos"). The Publish button there writes
 * public/data/pages.json and the photos into public/media/ and pushes them to GitHub; the build
 * that follows reads the file here, so the owner's texts and photos are in the page's HTML.
 * A field that is missing or empty keeps the built-in text.
 */
export interface PagePhoto {
  src: string;
  alt: string;
  w: number;
  h: number;
}
interface Override {
  title?: string;
  metaDescription?: string;
  h1?: string;
  lede?: string;
  photos?: PagePhoto[];
}

const PAGES = ((raw as unknown as { pages?: Record<string, Override> }).pages ?? {}) as Record<string, Override>;
const TEXT = ["title", "metaDescription", "h1", "lede"] as const;

function merge<P extends { title: string; metaDescription: string; h1: string; lede: string }>(base: P, path: string): P & { photos: PagePhoto[] } {
  const o = PAGES[path] ?? {};
  const text: Partial<Record<(typeof TEXT)[number], string>> = {};
  for (const k of TEXT) {
    const v = typeof o[k] === "string" ? o[k]!.trim() : "";
    if (v) text[k] = v;
  }
  const photos = (Array.isArray(o.photos) ? o.photos : []).filter((p) => p && /^\/media\/[\w-]+\.(jpg|png|webp)$/.test(p.src) && p.alt);
  return { ...base, ...text, photos };
}

export function cityPage(slug: string): (CityPage & { photos: PagePhoto[] }) | undefined {
  const base = CITY_PAGES.find((c) => c.slug === slug);
  return base && merge(base, `/kellersanierung/${base.slug}/`);
}

export function servicePage(slug: string): (ServicePage & { photos: PagePhoto[] }) | undefined {
  const base = SERVICE_PAGES.find((s) => s.slug === slug);
  return base && merge(base, `/leistungen/${base.slug}/`);
}
