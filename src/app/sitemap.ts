import type { MetadataRoute } from "next";
import { SERVICE_PAGES, CITY_PAGES } from "@/data/seo-pages";
import { abs } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-01");
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
    { url: abs("/leistungen/"), lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: abs("/labor/"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: abs("/galerie/"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: abs("/kostenrechner/"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: abs("/kontakt/"), lastModified, changeFrequency: "yearly", priority: 0.8 },
    { url: abs("/impressum/"), lastModified, changeFrequency: "yearly", priority: 0.2 },
    { url: abs("/datenschutz/"), lastModified, changeFrequency: "yearly", priority: 0.2 },
  ];
}
