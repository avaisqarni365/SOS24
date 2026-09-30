// Writes public/llms.txt from the same data files the pages render, so the
// two can never disagree. Runs before every build (see package.json).
import { writeFileSync } from "node:fs";
import { COMPANY_INFO, FAQS } from "../src/data/content-data.ts";
import { SERVICE_PAGES, CITY_PAGES } from "../src/data/seo-pages.ts";
import { PHASES } from "../src/data/proof.ts";

const SITE = "https://sos-abdichtung.de";

const lines: string[] = [
  "# sos-abdichtung",
  "",
  "> Fachbetrieb für Kellersanierung ohne Aufgraben, Horizontalsperren im Injektionsverfahren, Kellerinnenabdichtung, Schimmelbeseitigung, Feuchtemessung und Rissverpressung in Wuppertal und dem Bergischen Land (PLZ 42). Offizieller SchimmelPeter® Partnerbetrieb.",
  "",
  "## Kerninformationen",
  `- Inhaber: ${COMPANY_INFO.owner}`,
  `- Sitz: ${COMPANY_INFO.street}, ${COMPANY_INFO.city}`,
  `- Telefon: ${COMPANY_INFO.phoneDisplay}`,
  `- E-Mail: ${COMPANY_INFO.email}`,
  `- Servicegebiet: ${CITY_PAGES.map((c) => c.name).join(", ")}`,
  "- Feuchtemessung vor Ort: kostenlos",
  "- Garantie: 10 Jahre von sos-abdichtung auf die ausgeführten Arbeiten; zusätzlich 25 Jahre Produktgarantie des Herstellers SchimmelPeter GmbH",
  "- Verfahren: Horizontalsperre per Injektion (in Paraffin gelöster Kunststoff, Bohrlöcher im Abstand bis 20 cm, meist ohne Vortrocknung), Innenabdichtung, Schimmelsanierung",
  "- Qualifikation: geschult in den SchimmelPeter-Schulungszentren, Schimmelsanierung mit Prüfung beim TÜV Süd",
  "- Ausführung von innen, keine Erdarbeiten",
  "- Anfrage: Formular auf der Startseite (öffnet WhatsApp mit vorbereiteter Nachricht) oder telefonisch",
  "",
  "## Leistungen",
  ...SERVICE_PAGES.map((s) => `- [${s.navTitle}](${SITE}/leistungen/${s.slug}/): ${s.lede}`),
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

writeFileSync(new URL("../public/llms.txt", import.meta.url), lines.join("\n"));
console.log("llms.txt written");
