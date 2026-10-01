import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
// Engine floor first, brand tokens second: the brand must win the :root cascade.
import "@/styles/scrollcraft.css";
import "@/styles/globals.css";
import { SITE_URL, OG_IMAGE } from "@/lib/site";
import MobileContactBar from "@/components/sections/MobileContactBar";
import { APPEARANCE_BOOT } from "@/components/navigation/AppearanceMenu";
import { LanguageProvider } from "@/i18n/LanguageContext";

// Self-hosted fonts: no request to Google at runtime (DSGVO) and no build-time fetch.
// Upright type only: IBM Plex Sans for headings and text, IBM Plex Mono for
// labels and figures. Latin-ext and Cyrillic come from public/fonts by
// unicode-range (globals.css) and load only when a page needs them.
const plex = localFont({
  src: "../fonts/ibm-plex-sans-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "100 700",
  display: "swap",
});

const mono = localFont({
  src: [
    { path: "../fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/ibm-plex-mono-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kellersanierung Wuppertal ohne Aufgraben | sos-abdichtung",
    template: "%s",
  },
  description:
    "Kellersanierung Wuppertal ohne Aufgraben: nasse Keller trockenlegen. SchimmelPeter® Partner, kostenlose Messung, 10 Jahre Garantie auf die Arbeit.",
  applicationName: "sos-abdichtung",
  authors: [{ name: "Shahzad Mahmood" }],
  // The GitHub Pages preview (served under a base path) must not be indexed:
  // it would duplicate the real domain. The domain build has no base path.
  robots: process.env.PAGES_BASE_PATH
    ? { index: false, follow: false }
    : { index: true, follow: true, "max-image-preview": "large" },
  formatDetection: { telephone: true },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "sos-abdichtung",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      data-theme="light"
      className={`${plex.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* theme and text size before first paint (see AppearanceMenu) */}
        <script dangerouslySetInnerHTML={{ __html: APPEARANCE_BOOT }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <LanguageProvider>
          {children}
          <MobileContactBar />
        </LanguageProvider>
      </body>
    </html>
  );
}
