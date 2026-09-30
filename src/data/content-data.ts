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
  phoneDisplay: "+49 (0)172 2064177",
  phoneTel: "+491722064177",
  email: "s.mahmood@schimmelpeter.de",
  whatsappUrl: "https://wa.me/491722064177?text=Hallo%20Herr%20Mahmood%2C%20ich%20habe%20ein%20Feuchtigkeitsproblem%20in%20meinem%20Geb%C3%A4ude%20im%20Raum%20Wuppertal%20(PLZ%2042)%20und%20w%C3%BCnsche%20eine%20kostenlose%20Beratung.",
  certifications: [
    { label: "WTA-Zertifiziert", desc: "Verfahren nach WTA-Merkblatt 4-4-04" },
    { label: "10 Jahre Garantie", desc: "Langfristige Sicherheit auf Injektionssperren" },
    { label: "TÜV-geprüfte Baustoffe", desc: "Zertifizierte Spezialprodukte" },
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
      "Drucklose Injektion mit Silan-Mikroemulsion",
      "WTA-zertifiziert & hydrophobierend",
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
    name: "Haan & Mettmann",
    plzPrefix: ["42781", "40822"],
    districts: ["Haan-Mitte", "Gruiten", "Mettmann-Zentrum"],
    responseHours: "24-48 Std.",
    highlight: "Sanierung von Souterrain & Kellerwohnungen"
  }
];

export const PROCESS_PIPELINE = [
  {
    step: "01",
    title: "Vor-Ort-Diagnose",
    icon: "🔍",
    time: "Tag 1",
    desc: "Exakte Feuchtigkeitsmessung (kapillar vs. hygroskopisch) und Ermittlung der Schadensursache durch Herrn Mahmood."
  },
  {
    step: "02",
    title: "Festpreis-Angebot",
    icon: "📋",
    time: "Tag 2",
    desc: "Transparentes, verbindliches Sanierungskonzept ohne versteckte Mehrkosten mit individuellem Sanierungsplan."
  },
  {
    step: "03",
    title: "Chemische Injektion",
    icon: "💉",
    time: "Tag 3-4",
    desc: "WTA-zertifiziertes Injektionsverfahren zur Bildung einer lückenlosen Horizontalsperre gegen aufsteigende Nässe."
  },
  {
    step: "04",
    title: "Dauerhafte Trocknung",
    icon: "☀️",
    time: "Ergebnis",
    desc: "10 Jahre Garantie, Schutzentfeuchtung, Sanierputzauftrag und vollständige Werterhaltung Ihrer Immobilie."
  }
];

export const FAQS = [
  {
    q: "Wie erkenne ich, ob mein Keller in Wuppertal von aufsteigender Feuchtigkeit betroffen ist?",
    a: "Typische Anzeichen sind abblätternde Farbe, sandender Putz, modriger Geruch und weiße Ausblühungen (Salzkristalle) im unteren Drittel der Wände. Gerade in Wuppertals Hanglagen dringt oft unkontrollierte Feuchtigkeit von unten ins Mauerwerk ein. Bei unserer Vor-Ort-Analyse messen wir die Feuchte tiefenwirksam im Baustoff."
  },
  {
    q: "Wie funktioniert die chemische Horizontalsperre per Injektionsverfahren?",
    a: "In die betroffene Kellerwand wird im Abstand von ca. 10 bis 12 cm eine Bohrlochkette eingebracht. Anschließend wird eine hochviskose Silan-/Siloxan-Mikroemulsion drucklos injiziert. Der Wirkstoff verteilt sich kapillar im Porengefüge des Mauerwerks, reagiert mit dem Baustoff und bildet eine dauerhaft wasserabweisende (hydrophobe) Barriere, die aufsteigendes Wasser zuverlässig stoppt."
  },
  {
    q: "Muss für die Sanierung der Garten oder das Pflaster aufgegraben werden?",
    a: "Nein! Das Injektionsverfahren zur Horizontalsperre und die Kellerinnenabdichtung erfolgen vollständig von der Rauminnenseite. Teure Erdarbeiten, beschädigte Einfahrten oder zerstörte Vorgärten entfallen komplett."
  },
  {
    q: "Wie hoch sind die Kosten für eine Kellersanierung im Raum Wuppertal / PLZ 42?",
    a: "Die Kosten hängen vom Wandbaustoff (Ziegel, Bruchstein, Beton), der Mauerstärke und dem Durchfeuchtungsgrad ab. Eine Injektionssperre ist um ein Vielfaches wirtschaftlicher als eine Außenaufgrabung. Wir bieten Ihnen nach der kostenlosen Erstmessung ein verbindliches Festpreisangebot."
  },
  {
    q: "Gibt es eine Garantie auf die ausgeführten Arbeiten?",
    a: "Ja, als offizieller SchimmelPeter® Partnerbetrieb gewähren wir Ihnen auf unsere Horizontalsperren-Systeme eine langfristige Garantie von bis zu 10 Jahren auf die Funktionsfähigkeit der chemischen Sperrschicht."
  }
];
