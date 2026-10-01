import { COMPANY_INFO } from "@/data/content-data";

export const SITE_URL = "https://sos-abdichtung.de";
export const SITE_NAME = "sos-abdichtung";
export const PARTNER_URL = "https://www.schimmelpeter.de/partner/wuppertal-kellersanierung";

/** Share preview (WhatsApp, Facebook, LinkedIn, X): JPEG, because not every
    messenger renders WebP previews. */
export const OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "sos-abdichtung: Kellersanierung Wuppertal, Haus mit nassem Keller im Schnitt",
};

export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** The business node shared by every page graph. NAP must match the Google Business Profile. */
export function businessNode() {
  return {
    "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
    "@id": BUSINESS_ID,
    name: "sos-abdichtung",
    alternateName: "sos-abdichtung, SchimmelPeter® Partnerbetrieb",
    legalName: `sos-abdichtung, Inh. ${COMPANY_INFO.owner}`,
    description:
      "Fachbetrieb für Kellersanierung ohne Aufgraben, Horizontalsperren im Injektionsverfahren, Kellerinnenabdichtung und Schimmelbeseitigung in Wuppertal und dem Bergischen Land (PLZ 42).",
    url: SITE_URL,
    telephone: COMPANY_INFO.phoneTel,
    email: COMPANY_INFO.email,
    founder: {
      "@type": "Person",
      name: COMPANY_INFO.owner,
      jobTitle: COMPANY_INFO.title,
      image: `${SITE_URL}/img/gallery/shahzad-mahmood-480.webp`,
    },
    image: `${SITE_URL}/img/gallery/shahzad-mahmood-480.webp`,
    logo: `${SITE_URL}/logo.svg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_INFO.street,
      addressLocality: "Essen",
      postalCode: "45144",
      addressCountry: "DE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.4429,
      longitude: 6.9806,
    },
    priceRange: "€€",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    areaServed: ["Wuppertal", "Solingen", "Remscheid", "Velbert", "Haan", "Wermelskirchen"].map(
      (name) => ({ "@type": "City", name })
    ),
    memberOf: { "@type": "Organization", name: "SchimmelPeter®", url: "https://www.schimmelpeter.de" },
    sameAs: [PARTNER_URL],
    knowsAbout: [
      "Kellersanierung",
      "Horizontalsperre",
      "Injektionsverfahren",
      "Kellerinnenabdichtung",
      "Schimmelbeseitigung",
      "Feuchtemessung",
      "Rissverpressung",
    ],
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "de-DE",
    publisher: { "@id": BUSINESS_ID },
  };
}

export function breadcrumbNode(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function faqNode(faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
