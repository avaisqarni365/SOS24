import { FILM_PAGES } from "@/data/films";
import { abs } from "@/lib/site";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The video sitemap: every film with its watch page, thumbnail, file and length. */
export function GET() {
  const urls = FILM_PAGES.map(
    (f) => `  <url>
    <loc>${abs(`/filme/${f.slug}/`)}</loc>
    <video:video>
      <video:thumbnail_loc>${esc(abs(f.film.poster))}</video:thumbnail_loc>
      <video:title>${esc(f.title)}</video:title>
      <video:description>${esc(f.description)}</video:description>
      <video:content_loc>${esc(abs(f.film.src))}</video:content_loc>
      <video:duration>${Math.round(f.film.seconds)}</video:duration>
      <video:publication_date>${f.uploadDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>
  </url>`,
  ).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
