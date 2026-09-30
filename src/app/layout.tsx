import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
// Engine floor first, brand tokens second: the brand must win the :root cascade.
import "@/styles/scrollcraft.css";
import "@/styles/globals.css";
import { SITE_URL, OG_IMAGE } from "@/lib/site";
import MobileContactBar from "@/components/sections/MobileContactBar";
import { APPEARANCE_BOOT } from "@/components/navigation/AppearanceMenu";
import { LanguageProvider } from "@/i18n/LanguageContext";

// Self-hosted variable fonts: no request to Google at runtime (DSGVO) and no build-time fetch.
const inter = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});

const newsreader = localFont({
  src: [
    { path: "../fonts/newsreader-latin-wght-normal.woff2", style: "normal" },
    { path: "../fonts/newsreader-latin-wght-italic.woff2", style: "italic" },
  ],
  variable: "--font-editorial",
  weight: "200 800",
  display: "swap",
});

const mono = localFont({
  src: "../fonts/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono",
  weight: "100 800",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f6f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1310" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${newsreader.variable} ${mono.variable}`}
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
