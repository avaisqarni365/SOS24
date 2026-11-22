import raw from "../../public/data/pages.json";
import { CITY_PAGES, SERVICE_PAGES, type CityPage, type Faq, type PageSection, type ServicePage } from "@/data/seo-pages";

/**
 * Page content from the admin ("Seiten & Fotos"). The Publish button there writes
 * public/data/pages.json and the photos into public/media/ and pushes them to GitHub; the build
 * that follows reads the file here, so the owner's texts and photos are in the page's HTML.
 * A field that is missing or empty keeps the built-in text. Own sections and own questions are
 * added below the built-in ones.
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
  sections?: { heading: string; paragraphs: string[] }[];
  faqs?: Faq[];
}

const PAGES = ((raw as unknown as { pages?: Record<string, Override> }).pages ?? {}) as Record<string, Override>;
const TEXT = ["title", "metaDescription", "h1", "lede"] as const;

function merge<P extends { title: string; metaDescription: string; h1: string; lede: string; sections: PageSection[]; faqs: Faq[] }>(base: P, path: string): P & { photos: PagePhoto[] } {
  const o = PAGES[path] ?? {};
  const text: Partial<Record<(typeof TEXT)[number], string>> = {};
  for (const k of TEXT) {
    const v = typeof o[k] === "string" ? o[k]!.trim() : "";
    if (v) text[k] = v;
  }
  const photos = (Array.isArray(o.photos) ? o.photos : []).filter((p) => p && /^\/media\/[\w-]+\.(jpg|png|webp)$/.test(p.src) && p.alt);
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const sections: PageSection[] = (Array.isArray(o.sections) ? o.sections : [])
    .map((s) => ({ heading: str(s?.heading), paragraphs: (Array.isArray(s?.paragraphs) ? s.paragraphs : []).map(str).filter(Boolean) }))
    .filter((s) => s.heading && s.paragraphs.length);
  const faqs: Faq[] = (Array.isArray(o.faqs) ? o.faqs : []).map((f) => ({ q: str(f?.q), a: str(f?.a) })).filter((f) => f.q && f.a);
  return { ...base, ...text, sections: [...base.sections, ...sections], faqs: [...base.faqs, ...faqs], photos };
}

export function cityPage(slug: string): (CityPage & { photos: PagePhoto[] }) | undefined {
  const base = CITY_PAGES.find((c) => c.slug === slug);
  return base && merge(base, `/kellersanierung/${base.slug}/`);
}

export function servicePage(slug: string): (ServicePage & { photos: PagePhoto[] }) | undefined {
  const base = SERVICE_PAGES.find((s) => s.slug === slug);
  return base && merge(base, `/leistungen/${base.slug}/`);
}
