import React from "react";
import { ArrowLeft } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export const metadata = {
  alternates: { canonical: "/datenschutz/" },
  title: "Datenschutzerklärung | sos-abdichtung",
  description: "Datenschutzerklärung nach der DSGVO für sos-abdichtung.",
};

export default function DatenschutzPage() {
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
          Datenschutzerklärung
        </h1>

        <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Datenschutz auf einen Blick</h2>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften (DSGVO) sowie dieser Datenschutzerklärung.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Verantwortliche Stelle</h2>
            <p className="font-semibold text-white">sos-abdichtung</p>
            <p>Inhaber: Shahzad Mahmood</p>
            <p>{COMPANY_INFO.street}</p>
            <p>{COMPANY_INFO.city}</p>
            <p>Telefon: {COMPANY_INFO.phoneDisplay}</p>
            <p>E-Mail: {COMPANY_INFO.email}</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Datenerfassung auf dieser Website</h2>
            <p className="font-semibold text-white">Kontakt- und Terminanfrage:</p>
            <p>
              Wenn Sie uns per Anfrageformular oder WhatsApp kontaktieren, werden Ihre Angaben inklusive der angegebenen Kontaktdaten zur Bearbeitung und für eventuelle Rückfragen bei uns gespeichert. Diese Daten geben wir nicht an unbefugte Dritte weiter. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">4. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten sowie ein Recht auf Berichtigung oder Löschung dieser Daten.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
