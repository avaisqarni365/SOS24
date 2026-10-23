// Writes public/llms.txt and public/llms-full.txt from the same data files the pages render, so the
// two can never disagree. Runs before every build (see package.json).
import { writeFileSync } from "node:fs";
import { COMPANY_INFO, FAQS } from "../src/data/content-data.ts";
import { SERVICE_PAGES, CITY_PAGES } from "../src/data/seo-pages.ts";
import { PHASES } from "../src/data/proof.ts";

const SITE = "https://sos-abdichtung.de";

const lines: string[] = [
  "# sos-abdichtung",
  "",
  "> Bautenschutz-Fachbetrieb für Kellersanierung von innen ohne Aufgraben, feuchte Kellerwände, Horizontalsperren im Injektionsverfahren, Kellerinnenabdichtung nach WTA, Mauerwerkstrockenlegung, Schimmel im Keller und in Wohnräumen (Schimmelsanierung mit Klimaplatten), kostenlose Feuchtigkeitsmessung und Rissverpressung. Im Einsatz in Wuppertal, Essen, Düsseldorf, Bochum, Dortmund und dem Bergischen Land. Offizieller SchimmelPeter® Partnerbetrieb.",
  "",
  "## Kerninformationen",
  `- Inhaber: ${COMPANY_INFO.owner}`,
  `- Sitz: ${COMPANY_INFO.street}, ${COMPANY_INFO.city}`,
  `- Telefon: ${COMPANY_INFO.phoneDisplay}`,
  `- E-Mail: ${COMPANY_INFO.email}`,
  `- Servicegebiet: ${CITY_PAGES.map((c) => c.name).join(", ")}`,
  "- Feuchtemessung vor Ort: kostenlos und unverbindlich",
  "- Garantie: 10 Jahre von sos-abdichtung auf die ausgeführten Arbeiten; zusätzlich 25 Jahre Produktgarantie des Herstellers SchimmelPeter GmbH",
  "- Verfahren: Horizontalsperre per Injektion (in Paraffin gelöster Kunststoff, Bohrlöcher im Abstand bis 20 cm, meist ohne Vortrocknung), Innenabdichtung mit MDS, Schimmelsanierung mit TÜV-geprüftem Standard",
  "- Qualifikation: geschult in den SchimmelPeter-Schulungszentren, Schimmelsanierung mit Prüfung beim TÜV Süd",
  "- Ausführung von innen, keine Erdarbeiten, kein Aufgraben des Gartens oder Pflasters erforderlich",
  "- Steuerbonus: Handwerkerleistung nach § 35a EStG – 20 % der Lohnkosten (bis zu 1.200 €/Jahr) direkt von der Einkommensteuer absetzbar",
  `- Anfrage: Online-Formular (${SITE}/kontakt/), Online-Wunschtermin für die kostenlose Messung (${SITE}/termin/), WhatsApp oder telefonisch unter +49 172 2064177; Rückruf in der Regel am selben Werktag`,
  "- Öffnungszeiten: Mo–Fr 08:00–18:00 Uhr, Sa 09:00–14:00 Uhr",
  "",
  "## Leistungen",
  `- [Alle Leistungen im Überblick, mit Wegweiser von Anzeichen zu Verfahren](${SITE}/leistungen/)`,
  // the services as named in the Google Business Profile, with the term people search for
  ...SERVICE_PAGES.map((s) => `- [${s.serviceName}](${SITE}/leistungen/${s.slug}/) (${s.keyword}): ${s.lede}`),
  "",
  "## Weitere Seiten",
  `- [Angebotsrechner Kellersanierung](${SITE}/kostenrechner/): Umfang des Vorhabens einschätzen und das Festpreis-Angebot nach kostenloser Messung anfragen (keine Preisangaben)`,
  `- [Galerie](${SITE}/galerie/): Schadensbilder und Arbeitsschritte aus dem SchimmelPeter-Netzwerk`,
  `- 3D-Modelle auf jeder Leistungsseite und auf der Startseite: Keller von innen und außen, Garage (Rissverpressung), Wohnraum (Schimmel), Schritt für Schritt mit Material und Zahlen`,
  "",
  "## Nachweis in jeder Phase",
  "Jedes Messprotokoll wird dem Kunden immer schriftlich übergeben, nach jeder Phase.",
  ...PHASES.map((p) => `${p.n}. ${p.title}: ${p.measure} Kunde erhält: ${p.proof}. Prüfkriterium: ${p.criterion}`),
  "",
  "## Servicegebiet",
  ...CITY_PAGES.map(
    (c) => `- [Kellersanierung ${c.name}](${SITE}/kellersanierung/${c.slug}/): vor Ort in ${c.responseTime}. PLZ ${c.plz.join(", ")}`
  ),
  "",
  "## Häufige Fragen",
  ...FAQS.flatMap((f) => [`### ${f.q}`, f.a, ""]),
];

const fullLines: string[] = [
  ...lines,
  "",
  "## Technische Verfahren & WTA-Merkblätter im Detail",
  "### Horizontalsperre nach WTA-Merkblatt 4-4",
  "Die kapillare Feuchtigkeitsaufnahme im Mauerwerk wird durch Einbringen einer chemischen Injektionscreme oder eines Paraffin-Systems gestoppt. Bohrlöcher werden im Raster von 10-12 cm oberhalb der Gelände- oder Kellersohlenoberkante gebohrt und mit Silan-Emulsion drucklos oder im Niederdruckverfahren gefüllt.",
  "",
  "### Kellerinnenabdichtung (MDS - Mineralische Dichtschlämme)",
  "Auf das vorbereitete Mauerwerk wird eine zweikomponentige, sulfatbeständige, rissüberbrückende Dichtschlämme in mindestens zwei Arbeitsgängen aufgetragen. Einbindung des Wand-Sohlen-Anschlusses über eine druckwasserdichte Hohlkehle.",
  "",
  "### Schimmelpilzsanierung nach Leitfaden des Umweltbundesamtes & TÜV Süd",
  "Sporenbindung, Tiefendesinfektion mit chlorfreien Bioziden, Feinreinigung mit HEPA-gefilterten Industriestaubsaugern und Aufbringen kapillaraktiver Calciumsilikat-Klimaplatten zur dauerhaften Vermeidung von Kondensatfeuchte.",
  "",
  "## Rechtliche Angaben & E-E-A-T Nachweise",
  `- Name: ${COMPANY_INFO.fullName}`,
  `- Inhaber: ${COMPANY_INFO.owner}`,
  `- Handwerkskammer / Sitz: ${COMPANY_INFO.city}, ${COMPANY_INFO.street}`,
  `- Hotline: ${COMPANY_INFO.phoneDisplay}`,
  `- E-Mail: ${COMPANY_INFO.email}`,
  "- Garantieerklärung: 10 Jahre Ausführungsgarantie + 25 Jahre Herstellergarantie",
  "- Partnernetzwerk: SchimmelPeter® Deutschland",
];

writeFileSync(new URL("../public/llms.txt", import.meta.url), lines.join("\n"));
writeFileSync(new URL("../public/llms-full.txt", import.meta.url), fullLines.join("\n"));
console.log("llms.txt and llms-full.txt written");
