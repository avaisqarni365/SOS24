import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Kellersanierung & feuchte Wände Wuppertal | sos-abdichtung — SchimmelPeter® Partner",
  description: "sos-abdichtung ist Ihr SchimmelPeter® Fachbetrieb für Kellersanierung, chemische Horizontalsperren & Schimmelbeseitigung in Wuppertal, Solingen, Remscheid, Velbert (PLZ 42). 10 Jahre Garantie.",
  keywords: [
    "kellersanierung wuppertal",
    "feuchte wände trockenlegen wuppertal",
    "schimmelbeseitigung wuppertal",
    "schimmelsanierung wuppertal",
    "keller trockenlegen solingen",
    "kellersanierung remscheid",
    "kellersanierung velbert",
    "horizontalsperre injektionsverfahren",
    "keller von innen abdichten",
    "schimmel im keller was tun",
    "keller trockenlegen kosten",
    "schimmelpeter wuppertal",
    "sos-abdichtung"
  ],
  authors: [{ name: "Shahzad Mahmood", url: "https://www.schimmelpeter.de" }],
  robots: "index, follow",
  openGraph: {
    title: "Kellersanierung & feuchte Wände Wuppertal | sos-abdichtung",
    description: "Zertifizierter SchimmelPeter® Partnerbetrieb im Raum Wuppertal & PLZ 42. Feuchte Wände & nasse Keller dauerhaft trockenlegen ohne Aufgraben. 10 Jahre Garantie.",
    type: "website",
    locale: "de_DE",
    siteName: "sos-abdichtung Wuppertal",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://www.sos-abdichtung.de/#business",
        "name": "sos-abdichtung — SchimmelPeter® Partnerbetrieb",
        "legalName": "sos-abdichtung, Inh. Shahzad Mahmood",
        "description": "Zertifizierter Fachbetrieb für Kellersanierung, chemische Horizontalsperren und Schimmelbeseitigung in Wuppertal und Umgebung (PLZ 42).",
        "telephone": "+491722064177",
        "email": "s.mahmood@schimmelpeter.de",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Niebuhrstraße 46",
          "addressLocality": "Essen",
          "postalCode": "45144",
          "addressCountry": "DE"
        },
        "areaServed": [
          { "@type": "City", "name": "Wuppertal" },
          { "@type": "City", "name": "Solingen" },
          { "@type": "City", "name": "Remscheid" },
          { "@type": "City", "name": "Velbert" },
          { "@type": "City", "name": "Haan" },
          { "@type": "City", "name": "Mettmann" },
          { "@type": "AdministrativeArea", "name": "Bergisches Land" }
        ],
        "priceRange": "$$",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "07:30",
          "closes": "19:00"
        }
      }
    ]
  };

  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white text-sand-900 antialiased">
        {children}
      </body>
    </html>
  );
}
