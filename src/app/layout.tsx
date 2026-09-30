import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
// Engine floor first, brand tokens second: the brand must win the :root cascade.
import "@/styles/scrollcraft.css";
import "@/styles/globals.css";
import { SITE_URL } from "@/lib/site";

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
    "Kellersanierung Wuppertal ohne Aufgraben: nasse Keller und feuchte Wände trockenlegen. SchimmelPeter® Partner, kostenlose Feuchtemessung, 10 Jahre Garantie.",
  applicationName: "sos-abdichtung",
  authors: [{ name: "Shahzad Mahmood" }],
  robots: { index: true, follow: true, "max-image-preview": "large" },
  formatDetection: { telephone: true },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "sos-abdichtung",
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0e1310",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${newsreader.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
