import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { COMPANY_INFO } from "@/data/content-data";

export const metadata = {
  title: "Datenschutzerklärung — sos-abdichtung | SchimmelPeter® Partnerbetrieb",
  description: "Datenschutzerklärung nach der DSGVO für sos-abdichtung.",
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-sand-50 py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-sand-200 shadow-soft">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-accent-700 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Startseite</span>
        </Link>

        <h1 className="text-3xl font-extrabold text-sand-900 tracking-tight mb-8">
          Datenschutzerklärung
        </h1>

        <div className="space-y-6 text-sm text-sand-700 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-sand-900 mb-2">1. Datenschutz auf einen Blick</h2>
            <p>
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften (DSGVO) sowie dieser Datenschutzerklärung.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-sand-900 mb-2">2. Verantwortliche Stelle</h2>
            <p className="font-semibold text-sand-900">sos-abdichtung</p>
            <p>Inhaber: Shahzad Mahmood</p>
            <p>{COMPANY_INFO.street}</p>
            <p>{COMPANY_INFO.city}</p>
            <p>Telefon: {COMPANY_INFO.phoneDisplay}</p>
            <p>E-Mail: {COMPANY_INFO.email}</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-sand-900 mb-2">3. Datenerfassung auf dieser Website</h2>
            <p className="font-semibold text-sand-800">Kontakt- und Anfrageformular:</p>
            <p>
              Wenn Sie uns per Kontaktformular oder E-Mail Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter. Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-sand-900 mb-2">4. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit an uns wenden.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
