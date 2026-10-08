export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  badge: string;
  shortDesc: string;
  benefits: string[];
  cta: string;
}

export interface RegionCity {
  name: string;
  plzPrefix: string[];
  districts: string[];
  responseHours: string;
  highlight: string;
}

export const COMPANY_INFO = {
  name: "sos-abdichtung",
  fullName: "sos-abdichtung, SchimmelPeter® Partnerbetrieb",
  network: "SchimmelPeter® Deutschland",
  owner: "Shahzad Mahmood",
  title: "Inhaber & Bautenschutz-Experte",
  street: "Niebuhrstraße 46",
  city: "45144 Essen",
  operatingRegion: "Wuppertal & Bergisches Land (PLZ 42xxx)",
  phoneDisplay: "+49 (0)176 2064177",
  phoneTel: "+491762064177",
  email: "info@sos-abdichtung.de",
  whatsappUrl: "https://wa.me/491762064177?text=Hallo%20Herr%20Mahmood%2C%20ich%20habe%20ein%20Feuchtigkeitsproblem%20in%20meinem%20Geb%C3%A4ude%20im%20Raum%20Wuppertal%20(PLZ%2042)%20und%20w%C3%BCnsche%20eine%20kostenlose%20Beratung.",
  certifications: [
    { label: "Geschult bei SchimmelPeter®", desc: "Ausbildung in den SchimmelPeter-Schulungszentren, mehrmals jährlich Weiterbildung" },
    { label: "25 Jahre Produktgarantie", desc: "Garantie des Herstellers SchimmelPeter GmbH auf die Wirksamkeit" },
    { label: "10 Jahre Garantie auf die Arbeit", desc: "Garantie von sos-abdichtung auf die ausgeführten Arbeiten" },
    { label: "SchimmelPeter® Partner", desc: "Bundesweites Qualitätsnetzwerk" },
  ]
};

export const SERVICES: ServiceItem[] = [
  {
    id: "feuchte-waende",
    icon: "🧱",
    title: "Feuchte Wände & Horizontalsperre",
    badge: "Bestseller Wuppertal",
    shortDesc: "Aufsteigende Bodenfeuchtigkeit dauerhaft stoppen mittels moderner chemischer Injektionstechnik ohne Aufgraben.",
    benefits: [
      "Injektion mit in Paraffin gelöstem Kunststoff",
      "Keine Vortrocknung nötig, Mauerwerk bleibt diffusionsfähig",
      "Keine statische Schwächung des Mauerwerks",
      "Schutz vor Mauersalzen und Ausblühungen"
    ],
    cta: "3D-Verfahren ansehen"
  },
  {
    id: "kellersanierung",
    icon: "🏠",
    title: "Nasse Keller sanieren",
    badge: "Komplett-Sanierung",
    shortDesc: "Umfassende Kellersanierung von innen oder außen: Verwandeln Sie feuchte Lagerräume wieder in trockenen Wohn- & Nutzwert.",
    benefits: [
      "Kellerinnenabdichtung gegen drückendes Wasser",
      "Boden-Wand-Anschluss & Hohlkehlenausbildung",
      "Mineralische Dichtungsschlämmen (MDS)",
      "Klimaregulierende Sanierputzsysteme"
    ],
    cta: "Kellersanierung anfragen"
  },
  {
    id: "schimmelbeseitigung",
    icon: "🛡️",
    title: "Schimmelbeseitigung & Analyse",
    badge: "Gesundheits-Schutz",
    shortDesc: "Schadens- & Ursachenanalyse bei Schimmelbefall. Nachhaltige Beseitigung und Vorbeugung durch zertifizierte Fachleute.",
    benefits: [
      "Messtechnische Ursachenprüfung (Taupunkt/Feuchte)",
      "Sporenabtötung ohne toxische Chlorbelastung",
      "Kalziumsilikat-Innendämmung gegen Kondensat",
      "Rechtssichere Gutachten für Eigentümer & Mieter"
    ],
    cta: "Schimmel-Check buchen"
  },
  {
    id: "rissverpressung",
    icon: "⚡",
    title: "Rissverpressung & Fugenabdichtung",
    badge: "Präzisionstechnik",
    shortDesc: "Elastische oder kraftschlüssige Rissinjektion bei wasserführenden Rissen in Beton und Mauerwerk.",
    benefits: [
      "Hochdruck-Injektion mit PU-Harz / Epoxid",
      "Sofortiger Stopp von fließendem Wassereintritt",
      "Dauerhafte Dehnfähigkeit bei Bauteilbewegungen",
      "Geeignet für WU-Betonkeller & Weiße Wannen"
    ],
    cta: "Rissverpressung anfragen"
  }
];

export const REGIONAL_CITIES: RegionCity[] = [
  {
    name: "Wuppertal",
    plzPrefix: ["42103", "42105", "42107", "42109", "42111", "42113", "42115", "42117", "42119", "42275", "42277", "42279", "42281", "42283", "42285", "42287", "42289", "42327", "42329", "42349", "42369", "42389", "42399"],
    districts: ["Elberfeld", "Barmen", "Vohwinkel", "Cronenberg", "Ronsdorf", "Uellendahl", "Langerfeld"],
    responseHours: "24 Std.",
    highlight: "Spezialist für historische Wuppertaler Altbauten & Hanglagen im Tal der Wupper"
  },
  {
    name: "Solingen",
    plzPrefix: ["42651", "42653", "42655", "42657", "42659", "42697", "42699"],
    districts: ["Mitte", "Ohligs", "Wald", "Gräfrath", "Höhscheid", "Aufderhöhe"],
    responseHours: "24-48 Std.",
    highlight: "Kellersanierung & Schimmelschutz in der gesamten Klingenstadt"
  },
  {
    name: "Remscheid",
    plzPrefix: ["42853", "42855", "42857", "42859", "42897", "42899"],
    districts: ["Alt-Remscheid", "Lennep", "Lüttringhausen", "Süd"],
    responseHours: "24-48 Std.",
    highlight: "Feuchte Kellerwände trockenlegen im bergischen Höhenklima"
  },
  {
    name: "Velbert",
    plzPrefix: ["42549", "42551", "42553", "42555"],
    districts: ["Velbert-Mitte", "Neviges", "Langenberg"],
    responseHours: "24-48 Std.",
    highlight: "Fachmännische Innenabdichtung und Horizontalsperren"
  },
  {
    name: "Haan",
    plzPrefix: ["42781"],
    districts: ["Haan-Mitte", "Gruiten"],
    responseHours: "24-48 Std.",
    highlight: "Sanierung von Souterrain & Kellerwohnungen im Raum 42"
  }
];

export const PROCESS_PIPELINE = [
  {
    step: "01",
    title: "Unverbindliche Schadensanalyse",
    icon: "🔍",
    time: "Schritt 1",
    desc: "Außen- und Innenbesichtigung mit Feuchtemessung. Herr Mahmood ermittelt die genaue Ursache, zum Beispiel kapillar aufsteigende Feuchte, Kondensat, eine undichte Leitung oder mangelhafte Drainage."
  },
  {
    step: "02",
    title: "Verbindliches Angebot",
    icon: "📋",
    time: "Schritt 2",
    desc: "Auf Basis der Analyse erhalten Sie ein verbindliches Angebot mit der empfohlenen Lösung, ohne versteckte Mehrkosten."
  },
  {
    step: "03",
    title: "Sanierung nach Plan",
    icon: "💉",
    time: "Schritt 3",
    desc: "Wir erstellen den Sanierungsplan gemeinsam mit Ihnen und sanieren von innen, zum Beispiel mit einer neuen Horizontalsperre per Injektion, ohne Erdarbeiten."
  },
  {
    step: "04",
    title: "Gemeinsame Abnahme",
    icon: "☀️",
    time: "Schritt 4",
    desc: "Nach der Sanierung nehmen Sie die Arbeiten gemeinsam mit uns ab, die Baustelle wird sauber übergeben. Dazu 10 Jahre Garantie auf unsere Arbeit und 25 Jahre Produktgarantie von SchimmelPeter."
  }
];

export const FAQS = [
  {
    q: "Wie erkenne ich, ob mein Keller in Wuppertal von aufsteigender Feuchtigkeit betroffen ist?",
    a: "Typisch sind dunkle Feuchteränder im unteren Wandbereich, abblätternde Farbe, aufgequollener Putz, weiße Salzausblühungen, Schimmel an Sockelleisten und ein muffiger Geruch. Steigt die Feuchte gleichmäßig von unten nach oben, spricht vieles für kapillar aufsteigende Feuchte und eine defekte Horizontalsperre. Einzelne, klar abgegrenzte Flecken kommen dagegen meist von Rohrschäden oder Wasser von außen. Sicher ist erst die Messung im Mauerwerk."
  },
  {
    q: "Was sind die häufigsten Ursachen für einen nassen Keller?",
    a: "Meist ist es eine von vier Ursachen: eine defekte Kapillarwassersperre, durch die Bodenfeuchte aufsteigt, eine undichte Vertikalsperre, durch die Wasser seitlich eindringt, ein fehlendes oder defektes Drainagesystem oder Risse und undichte Stellen in Wänden und Boden. Oft wirken mehrere zusammen. Deshalb steht bei uns die Messung vor jedem Angebot."
  },
  {
    q: "Wie funktioniert die Horizontalsperre im Injektionsverfahren?",
    a: "In das feuchte Mauerwerk werden Bohrlöcher im Abstand von bis zu 20 cm gesetzt, eine Vortrocknung ist in der Regel nicht nötig. Dann bringen wir eine genau berechnete Menge des SchimmelPeter-Injektionsmittels ein, eines in Paraffin gelösten Kunststoffs. Er verteilt sich im Injektionsbereich und legt sich als wasserabweisendes Polymer an die Kapillarwände: eine neue Sperrschicht, die aufsteigende Feuchte zuverlässig stoppt. Weil diese Schicht nur wenige Moleküle dick ist, bleiben die Poren offen und die Wand bleibt diffusionsfähig."
  },
  {
    q: "Muss für die Sanierung der Garten oder das Pflaster aufgegraben werden?",
    a: "Nein! Das Injektionsverfahren zur Horizontalsperre und die Kellerinnenabdichtung erfolgen vollständig von der Rauminnenseite. Teure Erdarbeiten, beschädigte Einfahrten oder zerstörte Vorgärten entfallen komplett."
  },
  {
    q: "Wie hoch sind die Kosten für eine Kellersanierung im Raum Wuppertal / PLZ 42?",
    a: "Die Kosten hängen vom Wandbaustoff (Ziegel, Bruchstein, Beton), der Mauerstärke und dem Durchfeuchtungsgrad ab. Eine Horizontalsperre per Injektion von innen ist deutlich günstiger als eine Außenabdichtung mit Aufgraben. Wir bieten Ihnen nach der kostenlosen Erstmessung ein verbindliches Festpreisangebot."
  },
  {
    q: "Gibt es eine Garantie auf die ausgeführten Arbeiten?",
    a: "Ja, und zwar zweifach. sos-abdichtung gibt Ihnen 10 Jahre Garantie auf die ausgeführten Arbeiten. Zusätzlich garantiert der Hersteller SchimmelPeter GmbH 25 Jahre lang die Wirksamkeit seiner Produkte."
  },
  {
    q: "Bekomme ich die Messergebnisse schriftlich?",
    a: "Ja, immer. Nach jeder Phase erhalten Sie das Protokoll: die Nullmessung mit Messpunktplan, das Injektionsprotokoll, die Kontrollmessungen und das Abnahmeprotokoll mit den Vorher-nachher-Werten. So können Sie den Erfolg der Sanierung jederzeit selbst nachvollziehen."
  }
];
