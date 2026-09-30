import React from "react";
import { ArrowLeft } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export const metadata = {
  alternates: { canonical: "/impressum/" },
  title: "Impressum | sos-abdichtung",
  description: "Impressum und rechtliche Angaben gemäß § 5 TMG für sos-abdichtung.",
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-[#0b0e14] py-16 px-4 sm:px-6 text-slate-300">
      <div className="max-w-3xl mx-auto bg-white/[0.02] rounded-3xl p-8 sm:p-12 border border-white/[0.08]">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Startseite</span>
        </a>

        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-8">
          Impressum
        </h1>

        <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-white mb-2">Angaben gemäß § 5 TMG:</h2>
            <p className="font-semibold text-white">sos-abdichtung</p>
            <p className="text-slate-400">SchimmelPeter® Partnerbetrieb</p>
            <p>Inhaber: Shahzad Mahmood</p>
            <p>{COMPANY_INFO.street}</p>
            <p>{COMPANY_INFO.city}</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">Kontakt:</h2>
            <p>Telefon: {COMPANY_INFO.phoneDisplay}</p>
            <p>E-Mail: {COMPANY_INFO.email}</p>
            <p>Einsatzgebiet: Wuppertal, Solingen, Remscheid, Velbert und Bergisches Land (PLZ 42xxx)</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">Haftung für Inhalte:</h2>
            <p>
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">Haftung für Links:</h2>
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">Verbraucherstreitbeilegung / Universalschlichtungsstelle:</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
