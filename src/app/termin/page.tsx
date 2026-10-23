import type { Metadata } from "next";
import { Phone, MessageCircle, ShieldCheck, CheckCircle2, Clock, MapPin, Calendar, HelpCircle } from "lucide-react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import OnlineAppointmentBooking from "@/components/sections/OnlineAppointmentBooking";
import JsonLd from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/seo/SubpageParts";
import { COMPANY_INFO } from "@/data/content-data";
import { abs, businessNode, websiteNode, breadcrumbNode, faqNode, BUSINESS_ID, WEBSITE_ID, OG_IMAGE } from "@/lib/site";

const TITLE = "Online-Termin buchen: Vor-Ort-Messung | sos-abdichtung";
const DESCRIPTION =
  "Wunschtermin für kostenlose Feuchtemessung vor Ort in ganz NRW buchen: Inhaber Shahzad Mahmood prüft Ihren Keller persönlich mit elektronischer Messtechnik.";
const PATH = "/termin/";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PATH,
    type: "website",
    locale: "de_DE",
    siteName: "sos-abdichtung",
    images: [OG_IMAGE],
  },
};

const FAQS = [
  {
    q: "Ist der Vor-Ort-Termin wirklich 100 % kostenlos?",
    a: "Ja, absolut. Sowohl die Anfahrt in ganz Nordrhein-Westfalen als auch die professionelle Feuchtigkeitsmessung und Schadensanalyse durch Inhaber Shahzad Mahmood sind für Sie vollkommen unverbindlich und kostenfrei.",
  },
  {
    q: "Welche Messtechnik kommt bei der Feuchteanalyse zum Einsatz?",
    a: "Wir setzen kalibrierte elektronische Tiefenfeuchtemessgeräte, dielektrische Oberflächensensoren und bei Bedarf chemische CM-Prüfungen ein, um die exakte Feuchtigkeitsverteilung und Salzbelastung im Mauerwerk zu ermitteln.",
  },
  {
    q: "Wie lange dauert die Vor-Ort-Besichtigung?",
    a: "In der Regel dauert die gründliche Analyse zwischen 30 und 45 Minuten. Dabei untersuchen wir Kellerwände, Wand-Sohlen-Anschlüsse, Horizontalsperren und klären die baulichen Ursachen.",
  },
  {
    q: "Wann erhalte ich mein Sanierungsangebot?",
    a: "Nach Auswertung der Messdaten erhalten Sie ein verbindliches Festpreisangebot nach WTA-Richtlinien – transparent aufgeschlüsselt, ohne versteckte Mehrkosten und inklusive bis zu 10 Jahren Gewährleistung.",
  },
];

/** Dedicated standalone appointment booking page for Google Business Profile and direct campaigns. */
export default function TerminPage() {
  const crumbs = [
    { name: "Startseite", path: "/" },
    { name: "Termin buchen", path: PATH },
  ];
  const graph = [
    businessNode(),
    websiteNode(),
    {
      "@type": "ContactPage",
      "@id": `${abs(PATH)}#webpage`,
      url: abs(PATH),
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: "de-DE",
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
      breadcrumb: { "@id": `${abs(PATH)}#breadcrumb` },
    },
    { ...breadcrumbNode(crumbs), "@id": `${abs(PATH)}#breadcrumb` },
    faqNode(FAQS),
  ];

  return (
    <>
      <JsonLd graph={graph} />
      <Navbar />
      <main id="main" className="appointment-page pt-20 sm:pt-24 lg:pt-28">
        {/* Responsive Header */}
        <section className="sc-page-top pb-6 sm:pb-8" aria-labelledby="page-title">
          <div className="sc-wrap max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={crumbs} />

            <div className="mt-4 sm:mt-6 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black uppercase tracking-wider shadow-xs">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Online-Terminplaner · Kostenfreie Vor-Ort-Messung</span>
              </div>

              <h1 id="page-title" className="sc-display text-2xl sm:text-4xl lg:text-5xl font-black text-[#0f2537] tracking-tight leading-tight">
                Vor-Ort-Termin: <em>kostenlose Feuchtemessung.</em>
              </h1>

              <p className="text-slate-600 max-w-3xl text-sm sm:text-base lg:text-lg leading-relaxed">
                Wählen Sie Ihren Wunschtermin direkt im Kalender. Inhaber <strong>Shahzad Mahmood</strong> prüft Ihren Feuchteschaden
                persönlich mit elektronischer CM-Messtechnik – 100 % kostenfrei, transparent und ohne Anfahrtskosten in ganz NRW.
              </p>
            </div>

            {/* 3 Responsive Trust Badges */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">100 % Kostenfrei</div>
                  <div className="text-[11px] text-slate-500">Keine Anfahrts- oder Messgebühren</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Flexible Zeitfenster</div>
                  <div className="text-[11px] text-slate-500">Vormittags &amp; nachmittags wählbar</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Inhaber persönlich</div>
                  <div className="text-[11px] text-slate-500">Herr Shahzad Mahmood vor Ort</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Interactive Booking Engine */}
        <OnlineAppointmentBooking hideHeader={true} className="border-t border-slate-200/60" />

        {/* Step-by-Step Walkthrough */}
        <section className="py-12 sm:py-16 bg-white border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">Transparenter Ablauf</span>
              <h2 className="text-xl sm:text-3xl font-black text-[#0f2537]">In 3 Schritten zu trockenen Kellerwänden</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-sm flex items-center justify-center">1</div>
                <div className="font-extrabold text-slate-900 text-base">Wunschtermin buchen</div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Tragen Sie Ihr Wunschdatum und Ihre Schadensadresse ein. Sie erhalten sofort eine Bestätigung für Ihren Kalender.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-sm flex items-center justify-center">2</div>
                <div className="font-extrabold text-slate-900 text-base">Ursachenanalyse vor Ort</div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Herr Mahmood führt elektronische Feuchtemessungen durch, identifiziert die Ursache (Druckwasser, Kapillarfeuchte, Kondensat) und erklärt die Lage.
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-sm flex items-center justify-center">3</div>
                <div className="font-extrabold text-slate-900 text-base">Verbindlicher Festpreis</div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Sie erhalten ein verbindliches Festpreisangebot ohne Nachforderungen – inklusive bis zu 10 Jahren Garantie auf die Dichtigkeit.
                </p>
              </div>
            </div>

            {/* Direct Urgent Assistance Card */}
            <div className="p-5 sm:p-6 rounded-3xl bg-emerald-900 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg">
              <div className="space-y-1 text-center md:text-left">
                <div className="text-base sm:text-lg font-black text-emerald-200">Dringender Wassereintritt nach Regen?</div>
                <p className="text-xs sm:text-sm text-slate-200 max-w-lg">
                  Wenn Wasser akut im Keller steht oder die Drainage versagt, erreichen Sie Inhaber Shahzad Mahmood auch direkt per Telefon oder WhatsApp.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0 w-full md:w-auto">
                <a
                  href={`tel:${COMPANY_INFO.phoneTel}`}
                  className="w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:bg-slate-100 transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>{COMPANY_INFO.phoneDisplay}</span>
                </a>
                <a
                  href={COMPANY_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto min-h-[46px] px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 sm:py-16 bg-[#f8fafc]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-center space-y-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800">Häufige Fragen</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0f2537]">Fragen zur Vor-Ort-Feuchtemessung</h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                  <div className="flex items-start gap-2.5 font-black text-slate-900 text-sm sm:text-base">
                    <HelpCircle className="w-4 h-4 text-emerald-700 mt-1 shrink-0" />
                    <span>{faq.q}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
