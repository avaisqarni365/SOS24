import type { Metadata } from "next";
import { COMPANY_INFO } from "@/data/content-data";
import LegalPage from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  alternates: { canonical: "/impressum/" },
  title: "Impressum | sos-abdichtung",
  description: "Impressum von sos-abdichtung, Inhaber Shahzad Mahmood, Essen: Angaben nach § 5 DDG.",
};

export default function ImpressumPage() {
  return (
    <LegalPage title="Impressum" updated="September 2026">
      <section>
        <h2>Angaben nach § 5 DDG</h2>
        <address>
          sos-abdichtung
          <br />
          Inhaber: {COMPANY_INFO.owner}
          <br />
          {COMPANY_INFO.street}
          <br />
          {COMPANY_INFO.city}
        </address>
      </section>

      <section>
        <h2>Kontakt</h2>
        <p>
          Telefon: <a href={`tel:${COMPANY_INFO.phoneTel}`}>{COMPANY_INFO.phoneDisplay}</a>
          <br />
          E-Mail: <a href={`mailto:${COMPANY_INFO.email}`}>{COMPANY_INFO.email}</a>
        </p>
      </section>

      <section>
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <address>
          {COMPANY_INFO.owner}
          <br />
          {COMPANY_INFO.street}, {COMPANY_INFO.city}
        </address>
      </section>

      <section>
        <h2>Partnerschaft</h2>
        <p>
          sos-abdichtung ist ein selbstständiger Partnerbetrieb im Netzwerk der SchimmelPeter GmbH. SchimmelPeter® ist
          eine eingetragene Marke der SchimmelPeter GmbH. Vertragspartner für Aufträge über diese Website ist
          sos-abdichtung, Inhaber {COMPANY_INFO.owner}.
        </p>
      </section>

      <section>
        <h2>Bildnachweise</h2>
        <p>
          Fotos und Infografiken: SchimmelPeter GmbH, Nutzung im Rahmen der Partnerschaft. 3D-Modell und Grafiken:
          sos-abdichtung. Gemeindegrenzen der Servicegebiet-Karte: Land Nordrhein-Westfalen, über den Datensatz
          „click_that_hood“ von Code for Germany. Interaktive Karte: © OpenStreetMap-Mitwirkende.
        </p>
      </section>

      <section>
        <h2>Verbraucherstreitbeilegung</h2>
        <p>
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>

      <section>
        <h2>Haftung für Inhalte und Links</h2>
        <p>
          Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität
          können wir jedoch keine Gewähr übernehmen. Diese Website enthält Links zu Websites Dritter, auf deren Inhalte
          wir keinen Einfluss haben; für diese Inhalte ist der jeweilige Anbieter verantwortlich. Werden uns
          Rechtsverletzungen bekannt, entfernen wir die betreffenden Inhalte oder Links umgehend.
        </p>
      </section>
    </LegalPage>
  );
}
