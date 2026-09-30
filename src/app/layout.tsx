import type { Metadata } from "next";
import { Inter, Newsreader, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "sos-abdichtung — Kellersanierung & Horizontalsperren Wuppertal (PLZ 42)",
  description: "Zertifizierter SchimmelPeter® Fachbetrieb für Kellersanierung, chemische Horizontalsperren & Schimmelbeseitigung im Raum Wuppertal (PLZ 42). 10 Jahre Garantie.",
  keywords: [
    "kellersanierung wuppertal",
    "feuchte wände trockenlegen wuppertal",
    "schimmelbeseitigung wuppertal",
    "schimmelsanierung wuppertal",
    "horizontalsperre wuppertal",
    "keller trockenlegen solingen",
    "kellersanierung remscheid",
    "kellersanierung velbert",
    "keller von innen abdichten",
    "schimmelpeter wuppertal"
  ],
  authors: [{ name: "Shahzad Mahmood", url: "https://www.schimmelpeter.de" }],
  robots: "index, follow",
  openGraph: {
    title: "sos-abdichtung — Kellersanierung & Horizontalsperren Wuppertal",
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

import { LanguageProvider } from "@/i18n/LanguageContext";

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
          { "@type": "AdministrativeArea", "name": "Bergisches Land" }
        ]
      }
    ]
  };

  return (
    <html lang="de" className={`${inter.variable} ${newsreader.variable} ${mono.variable} scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-landing-ink text-landing-bone font-sans antialiased selection:bg-landing-mint selection:text-landing-ink">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
