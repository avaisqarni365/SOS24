import type { Metadata } from "next";
import { COMPANY_INFO } from "@/data/content-data";
import LegalPage from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  alternates: { canonical: "/datenschutz/" },
  title: "Datenschutzerklärung | sos-abdichtung",
  description:
    "Datenschutzerklärung von sos-abdichtung: Hosting, Anfragen und Termine über Google Workspace, Google Analytics nur mit Einwilligung, Ihre Rechte.",
};

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung" updated="Oktober 2026">
      <section>
        <h2>1. Verantwortlicher</h2>
        <address>
          sos-abdichtung, Inhaber {COMPANY_INFO.owner}
          <br />
          {COMPANY_INFO.street}, {COMPANY_INFO.city}
          <br />
          Telefon: <a href={`tel:${COMPANY_INFO.phoneTel}`}>{COMPANY_INFO.phoneDisplay}</a>
          <br />
          E-Mail: <a href={`mailto:${COMPANY_INFO.email}`}>{COMPANY_INFO.email}</a>
        </address>
      </section>

      <section>
        <h2>2. Das Wichtigste in Kürze</h2>
        <ul>
          <li>
            Google Analytics wird nur geladen, wenn Sie dem ausdrücklich zustimmen. Ohne Zustimmung setzt diese Website
            keine Cookies.
          </li>
          <li>Schriftarten werden von unserem eigenen Server geladen, nicht von Google oder anderen Anbietern.</li>
          <li>
            Wenn Sie ein Formular absenden, Fotos hochladen oder einen Termin buchen, werden Ihre Angaben an unser
            Büro-System bei Google (Google Workspace) übertragen und dort gespeichert.
          </li>
          <li>Die interaktive Karte von OpenStreetMap wird erst geladen, wenn Sie darauf klicken.</li>
        </ul>
      </section>

      <section>
        <h2>3. Hosting und Server-Protokolle</h2>
        <p>
          Diese Website wird über GitHub Pages bereitgestellt, einen Dienst der GitHub, Inc., 88 Colin P. Kelly Jr.
          Street, San Francisco, CA 94107, USA. Beim Aufruf der Seiten verarbeitet GitHub technisch notwendige Daten,
          insbesondere Ihre IP-Adresse, Datum und Uhrzeit des Abrufs, die aufgerufene Adresse und Angaben zu Browser und
          Betriebssystem. Das dient der Auslieferung der Website und ihrer Sicherheit, etwa der Abwehr von Angriffen.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist ein sicherer und
          zuverlässiger Betrieb der Website. Dabei können Daten in die USA übermittelt werden. GitHub stützt solche
          Übermittlungen auf das EU-US Data Privacy Framework sowie auf EU-Standardvertragsklauseln. Näheres finden Sie
          in der{" "}
          <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener noreferrer">
            Datenschutzerklärung von GitHub
          </a>
          .
        </p>
      </section>

      <section>
        <h2>4. Speicherung in Ihrem Browser</h2>
        <p>
          Wenn Sie die Sprache, die Darstellung (hell oder dunkel), die Farbe oder die Schriftgröße umstellen, merkt sich
          Ihr Browser diese Auswahl (Einträge „sos_lang“, „sos_theme“, „sos_color“ und „sos_text“ im lokalen Speicher).
          Ebenso merkt er sich Ihre Antwort auf die Frage nach Google Analytics („sos_consent“). Wenn Sie eine Anfrage
          senden, legt die Website zudem eine Kopie Ihrer Angaben in Ihrem Browser ab („sos_abdichtung_workspace_v2“),
          damit Sie Ihren Vorgang auf diesem Gerät wiederfinden. Diese Einträge werden nicht an uns übertragen. Sie sind
          für die von Ihnen gewünschte Funktion erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Sie können sie jederzeit über
          die Einstellungen Ihres Browsers löschen; auf einem gemeinsam genutzten Gerät empfehlen wir das nach dem
          Absenden einer Anfrage.
        </p>
      </section>

      <section>
        <h2>5. Kontaktanfragen, Fotos und Termine</h2>
        <h3>Formulare, Foto-Upload und Online-Terminbuchung</h3>
        <p>
          Wenn Sie das Anfrageformular, den Angebotsrechner, die Online-Terminbuchung oder den Foto-Upload nutzen,
          übertragen wir Ihre Angaben (etwa Name, Telefonnummer, E-Mail-Adresse, Ort oder Adresse des Objekts,
          Schadensbeschreibung, Wunschtermin und hochgeladene Fotos) an unser Büro-System. Es läuft bei der Google
          Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland (Google Apps Script). Ihre Anfrage wird dort in
          einer Tabelle (Google Sheets) gespeichert, Fotos in Google Drive, Termine in Google Kalender; über Ihre Anfrage
          werden wir per E-Mail benachrichtigt. Buchen Sie online einen Termin oder unterschreiben Sie einen Auftrag, senden wir
          Ihnen eine Bestätigung an die angegebene E-Mail-Adresse; den Link zu Ihrem Vorgang schicken wir auf Wunsch.
        </p>
        <p>
          Wir verwenden Ihre Angaben, um Ihre Anfrage zu beantworten, einen Termin zu vereinbaren und ein Angebot zu
          erstellen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen). Dabei können Daten in
          die USA übermittelt werden; Google stützt solche Übermittlungen auf das EU-US Data Privacy Framework sowie auf
          EU-Standardvertragsklauseln.
        </p>
        <p>
          Der Angebotsrechner übermittelt außerdem Ihre Eingaben zum Schaden (Postleitzahl oder Ort, Schadensart, Fläche,
          Schweregrad) ohne Namen oder Kontaktdaten an dasselbe System, damit wir sehen, welche Schäden angefragt werden.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist, unser Angebot auf die
          tatsächliche Nachfrage abzustimmen.
        </p>
        <h3>Telefon und E-Mail</h3>
        <p>
          Wenn Sie uns anrufen oder schreiben, verarbeiten wir Ihre Angaben, um Ihre Anfrage zu beantworten, einen Termin
          zu vereinbaren und ein Angebot zu erstellen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.
        </p>
        <h3>WhatsApp</h3>
        <p>
          Wenn Sie uns über WhatsApp schreiben, wird Ihre Nachricht über den Dienst der WhatsApp Ireland Limited, Merrion
          Road, Dublin 4, Irland, übertragen. Dabei gelten zusätzlich die Datenschutzbestimmungen von WhatsApp; eine
          Übermittlung von Daten in die USA an die Muttergesellschaft Meta ist möglich. Wenn Sie das nicht möchten,
          erreichen Sie uns ebenso per Telefon oder E-Mail.
        </p>
      </section>

      <section id="analyse">
        <h2>6. Webanalyse mit Google Analytics (nur mit Ihrer Einwilligung)</h2>
        <p>
          Wenn Sie zustimmen, nutzen wir Google Analytics 4, einen Dienst der Google Ireland Limited, Gordon House,
          Barrow Street, Dublin 4, Irland. Google Analytics erfasst, welche Seiten Sie aufrufen, wie Sie auf unsere
          Website gekommen sind (etwa über eine Google-Suche oder Anzeige), welches Gerät und welchen Browser Sie nutzen
          und ob Sie eine Anfrage absenden. Dafür werden Cookies gesetzt („_ga“ und „_ga_…“, gespeichert bis zu zwei
          Jahre). Google Analytics 4 speichert nach Angaben von Google keine vollständigen IP-Adressen. Die Auswertung
          erhalten wir nur zusammengefasst; sie hilft uns zu verstehen, welche Inhalte gelesen werden und ob unsere
          Anzeigen Anfragen bringen.
        </p>
        <p>
          Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG). Ohne Einwilligung wird
          Google Analytics nicht geladen. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen,
          über den Link „Cookie-Einstellungen“ unten auf jeder Seite. Dabei können Daten in die USA übermittelt werden;
          Google ist nach dem EU-US Data Privacy Framework zertifiziert. Näheres finden Sie in der{" "}
          <a href="https://policies.google.com/privacy?hl=de" rel="noopener noreferrer">
            Datenschutzerklärung von Google
          </a>
          .
        </p>
      </section>

      <section>
        <h2>7. Interaktive Karte (OpenStreetMap)</h2>
        <p>
          Im Abschnitt Servicegebiet können Sie eine interaktive Karte laden. Sie stammt von der OpenStreetMap Foundation,
          St John&apos;s Innovation Centre, Cowley Road, Cambridge, CB4 0WS, Vereinigtes Königreich. Die Karte wird erst
          geladen, wenn Sie auf „Interaktive Karte laden“ klicken; dabei wird Ihre IP-Adresse an OpenStreetMap
          übertragen. Rechtsgrundlage ist Ihre Einwilligung durch den Klick (Art. 6 Abs. 1 lit. a DSGVO). Für das
          Vereinigte Königreich besteht ein Angemessenheitsbeschluss der EU-Kommission. Die übersichtliche Karte ohne
          Klick ist Teil unserer Website und überträgt keine Daten an Dritte.
        </p>
      </section>

      <section>
        <h2>8. Digitaler Fachberater</h2>
        <p>
          Fragen, die Sie dem digitalen Fachberater unten rechts stellen, leiten wir über unser Büro-System an Google
          Gemini weiter, einen Dienst der Google Ireland Limited, der die Antwort formuliert. Bitte geben Sie dort keine
          Namen, Adressen oder Telefonnummern ein; für eine Anfrage nutzen Sie bitte das Formular. Rechtsgrundlage ist
          Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist, Ihre Fragen auch außerhalb der Bürozeiten zu
          beantworten. Buchen Sie über den Fachberater einen Termin oder senden Sie Fotos, gilt Abschnitt 5.
        </p>
      </section>

      <section>
        <h2>9. Speicherdauer</h2>
        <p>
          Anfragen speichern wir, solange sie für die Bearbeitung nötig sind. Kommt ein Auftrag zustande, gelten die
          gesetzlichen Aufbewahrungsfristen des Handels- und Steuerrechts (in der Regel sechs bzw. zehn Jahre).
        </p>
      </section>

      <section>
        <h2>10. Ihre Rechte</h2>
        <p>Sie haben das Recht auf</p>
        <ul>
          <li>Auskunft über Ihre bei uns gespeicherten Daten (Art. 15 DSGVO),</li>
          <li>Berichtigung (Art. 16 DSGVO) und Löschung (Art. 17 DSGVO),</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO) und Datenübertragbarkeit (Art. 20 DSGVO),</li>
          <li>Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO),</li>
          <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).</li>
        </ul>
        <p>
          Eine formlose Nachricht an die oben genannte E-Mail-Adresse genügt. Sie können sich außerdem bei einer
          Datenschutz-Aufsichtsbehörde beschweren, für uns zuständig ist die Landesbeauftragte für Datenschutz und
          Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.
        </p>
      </section>
    </LegalPage>
  );
}
