import type { MetadataRoute } from "next";
import { SERVICE_PAGES, CITY_PAGES } from "@/data/seo-pages";
import { FILM_PAGES } from "@/data/films";
import { JOB_ROLES } from "@/data/jobs";
import { abs } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-04");
  return [
    { url: abs("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    ...SERVICE_PAGES.map((s) => ({
      url: abs(`/leistungen/${s.slug}/`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...CITY_PAGES.map((c) => ({
      url: abs(`/kellersanierung/${c.slug}/`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: abs("/kellersanierung/"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: abs("/leistungen/"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: abs("/labor/"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: abs("/filme/"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    ...FILM_PAGES.map((f) => ({
      url: abs(`/filme/${f.slug}/`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: abs("/galerie/"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: abs("/jobs/"), lastModified: new Date("2026-11-21"), changeFrequency: "weekly", priority: 0.7 },
    ...JOB_ROLES.map((r) => ({ url: abs(`/jobs/${r.slug}/`), lastModified: new Date("2026-11-21"), changeFrequency: "weekly" as const, priority: 0.7 })),
    ...CITY_PAGES.map((c) => ({ url: abs(`/jobs/${c.slug}/`), lastModified: new Date("2026-11-21"), changeFrequency: "monthly" as const, priority: 0.5 })),
    { url: abs("/kostenrechner/"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: abs("/termin/"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: abs("/kontakt/"), lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: abs("/impressum/"), lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/datenschutz/"), lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
