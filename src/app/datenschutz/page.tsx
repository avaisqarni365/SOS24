import type { Metadata } from "next";
import { COMPANY_INFO } from "@/data/content-data";
import LegalPage from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  alternates: { canonical: "/datenschutz/" },
  title: "Datenschutzerklärung | sos-abdichtung",
  description:
    "Datenschutzerklärung von sos-abdichtung: Hosting, Kontaktanfragen per WhatsApp oder E-Mail, Karte, Ihre Rechte nach der DSGVO.",
};

export default function DatenschutzPage() {
  return (
    <LegalPage title="Datenschutzerklärung" updated="September 2026">
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
          <li>Diese Website setzt keine Cookies und verwendet keine Analyse- oder Tracking-Werkzeuge.</li>
          <li>Schriftarten werden von unserem eigenen Server geladen, nicht von Google oder anderen Anbietern.</li>
          <li>
            Das Anfrageformular speichert nichts auf einem Server. Es bereitet Ihre Nachricht in WhatsApp oder in Ihrem
            E-Mail-Programm vor; übertragen wird sie erst, wenn Sie dort selbst auf „Senden“ tippen.
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
          Wenn Sie die Sprache der Website umstellen, merkt sich Ihr Browser diese Auswahl (Eintrag „sos_lang“ im
          lokalen Speicher). Der Eintrag verlässt Ihr Gerät nicht und wird nicht an uns übertragen. Er ist für die von
          Ihnen gewünschte Funktion erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Sie können ihn jederzeit über die
          Einstellungen Ihres Browsers löschen.
        </p>
      </section>

      <section>
        <h2>5. Kontaktanfragen</h2>
        <h3>Anfrageformular</h3>
        <p>
          Das Formular übermittelt keine Daten an einen Server. Nach dem Absenden öffnet es WhatsApp oder Ihr
          E-Mail-Programm mit einer vorbereiteten Nachricht. Erst wenn Sie diese Nachricht dort absenden, erhalten wir
          Ihre Angaben.
        </p>
        <h3>Telefon und E-Mail</h3>
        <p>
          Wenn Sie uns anrufen oder schreiben, verarbeiten wir Ihre Angaben (etwa Name, Telefonnummer, Adresse des
          Objekts, Schadensbeschreibung), um Ihre Anfrage zu beantworten, einen Termin zu vereinbaren und ein Angebot zu
          erstellen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahmen).
        </p>
        <h3>WhatsApp</h3>
        <p>
          Wenn Sie uns über WhatsApp schreiben, wird Ihre Nachricht über den Dienst der WhatsApp Ireland Limited, Merrion
          Road, Dublin 4, Irland, übertragen. Dabei gelten zusätzlich die Datenschutzbestimmungen von WhatsApp; eine
          Übermittlung von Daten in die USA an die Muttergesellschaft Meta ist möglich. Wenn Sie das nicht möchten,
          erreichen Sie uns ebenso per Telefon oder E-Mail.
        </p>
      </section>

      <section>
        <h2>6. Interaktive Karte (OpenStreetMap)</h2>
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
        <h2>7. Sanierungs-Assistent</h2>
        <p>
          Der Sanierungs-Assistent unten rechts läuft vollständig in Ihrem Browser. Ihre Eingaben dort werden nicht an
          uns oder an Dritte übertragen, es sei denn, Sie wählen am Ende selbst WhatsApp oder E-Mail als Weg zu uns.
        </p>
      </section>

      <section>
        <h2>8. Speicherdauer</h2>
        <p>
          Anfragen speichern wir, solange sie für die Bearbeitung nötig sind. Kommt ein Auftrag zustande, gelten die
          gesetzlichen Aufbewahrungsfristen des Handels- und Steuerrechts (in der Regel sechs bzw. zehn Jahre).
        </p>
      </section>

      <section>
        <h2>9. Ihre Rechte</h2>
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
