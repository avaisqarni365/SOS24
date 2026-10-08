export type SupportedLocale = "de" | "en";

export interface LocaleMeta {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
  dir?: "ltr" | "rtl";
}

export const SUPPORTED_LOCALES: LocaleMeta[] = [
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", dir: "ltr" },
];

/** German is the site's language and ships with the page; English loads on demand (./locales). */
export const DE: Record<string, string> = {
    // Nav
    "nav.services": "Leistungen",
    "nav.process3d": "3D-Verfahren",
    "nav.simulation": "Scientific Lab",
    "nav.gallery": "Galerie",
    "nav.proof": "Nachweis",
    "rail.proof": "Nachweis",
    "rail.layers": "3D-Wand",
    "nav.calculator": "Angebotsrechner",
    "nav.region": "Servicegebiet",
    "nav.faq": "Häufige Fragen",
    "nav.cta": "Feuchtemessung anfragen",
    "nav.phone": "Telefonisch erreichbar",

    // Hero
    "hero.tagline": "Kellersanierung & Horizontalsperren Wuppertal",
    "hero.h1": "Gedichtet. Injiziert. Getrocknet.",
    "hero.accent": "Dauerhaft.",
    "hero.sub": "sos-abdichtung stoppt aufsteigende Feuchtigkeit, saniert nasse Kellerwände und beseitigt Schimmel im Raum Wuppertal und Bergisches Land. Das WTA-Injektionsverfahren verdrängt Wasser auf molekularer Ebene — sauber von der Innenseite, ohne Baggerarbeiten und mit 10 Jahren Garantie.",
    "hero.ctaPrimary": "Kostenlose Vor-Ort-Analyse anfragen",
    "hero.ctaSecondary": "3D-Injektionsmodell ansehen",
    "hero.trustStrip": "WTA-MERKBLATT 4-4-04 · TÜV-GEPRÜFTE BAUSTOFFE · 10 JAHRE GARANTIE · OHNE AUFGRABEN · PLZ 42",
    "hero.stat1Val": "42",
    "hero.stat1Label": "PLZ-Region Wuppertal · Solingen · Remscheid",
    "hero.stat2Val": "100%",
    "hero.stat2Label": "Drucklose Silan-Mikroemulsion nach WTA",
    "hero.stat3Val": "10 J.",
    "hero.stat3Label": "Gewährleistung auf Mauerwerksdichtigkeit",
    "hero.stat4Val": "24h",
    "hero.stat4Label": "Reaktionszeit für Vor-Ort-Feuchtemessung",

    // Services
    "services.eyebrow": "Fachleistungen",
    "services.h1": "Das ganze Gebäude.",
    "services.accent": "Eine dauerhafte Lösung.",
    "services.sub": "Die meisten Sanierungsversuche scheitern an oberflächlichen Spachtelarbeiten oder falscher Farbe. sos-abdichtung packt das physikalische Feuchteproblem an der Wurzel — messtechnisch erfasst, nach WTA-Norm saniert und mit 10 Jahren Garantie abgesichert.",
    "services.card1Title": "Horizontalsperre ohne Aufgraben",
    "services.card1Desc": "Drucklose Injektion mit WTA-zertifizierter Silan-Mikroemulsion. Das Mauerwerk wird porentief durchdrungen, bildet eine dauerhafte wasserabweisende Barriere und stoppt aufsteigende Feuchte zu 100%.",
    "services.card1Badge": "Kein Bagger nötig",
    "services.card2Title": "Kellerinnenabdichtung & Hohlkehle",
    "services.card2Desc": "Mineralische Dichtungsschlämmen (MDS), druckwasserdichte Wand-Sohlen-Anschlüsse und hochbelastbare Sanierputzsysteme sichern Keller auch bei drückendem Hangwasser im Bergischen Land ab.",
    "services.card2Badge": "100% Wasserdicht",
    "services.card3Title": "Schimmelsanierung & Ursachenanalyse",
    "services.card3Desc": "Keine giftigen Chlorbomben: Wir ermitteln die genaue Feuchte- und Taupunktursache, entfernen Schimmelbefall sporensicher und verhindern Neubildung durch diffusionsoffene Calciumsilikat-Dämmung.",
    "services.card3Badge": "Messtechnisch belegt",

    // 3D Pipeline
    "pipe.eyebrow": "Das WTA-Injektionsverfahren",
    "pipe.h1": "Ein Bohrloch.",
    "pipe.accent": "4 Phasen zur molekularen Dichtigkeit.",
    "pipe.sub": "Dies ist der tatsächliche physikalische Weg im Mauerwerk — keine bloße Illustration. Jedes Bohrloch wird im 60°-Winkel gesetzt und drucklos mit hochviskoser Silan-Mikroemulsion geflutet. Die Wirkstoffmoleküle durchwandern das Kapillarnetzwerk, verdrängen Feuchtigkeit und härten zu einer dauerhaft wasserabweisenden Sperre aus.",
    "pipe.secSub": "Der Sanierungsablauf",
    "pipe.secH3": "Von der Erstbesichtigung zur trockenen Wand in 4 Schritten.",
    "pipe.btn": "Kostenlose Vor-Ort-Diagnose buchen",

    // Compliance
    "comp.eyebrow": "Zertifizierung & Garantie",
    "comp.h1": "Geprüfte Bauphysik.",
    "comp.accent": "10 Jahre schriftliche Garantie.",
    "comp.sub": "Bei der Bausubstanz gibt es keinen Raum für Experimente. Jede chemische Injektion wird mit lückenlosem Prüfprotokoll und bauaufsichtlich zugelassenen Wirkstoffen ausgeführt.",

    // Calculator

    // Regional
    "reg.eyebrow": "Servicegebiet Raum Wuppertal & Bergisches Land",
    "reg.h1": "Das Tal der Wupper.",
    "reg.accent": "Unser Kern-Einsatzgebiet.",
    "reg.sub": "Wuppertal, Solingen, Remscheid, Velbert und das gesamte Bergische Land sind durch Schiefer- und Ziegelaltbauten an steilen Hanglagen geprägt. Hier braucht es erfahrene Bautenschutz-Fachleute, die die lokale Bausubstanz kennen.",
    "reg.searchPlaceholder": "Ihre 5-stellige PLZ (z.B. 42103)...",
    "reg.btn": "Prüfen",

    // FAQ
    "faq.eyebrow": "Häufige Fragen & Antworten",
    "faq.h1": "Wissenswertes zur Kellersanierung.",
    "faq.accent": "Präzise Antworten.",
    "faq.sub": "Kompakte Antworten auf die wichtigsten Fragen rund um feuchte Kellerwände, Kosten und chemische Horizontalsperren im Raum Wuppertal.",

    // CTA
    "cta.eyebrow": "Sofort-Diagnose Vor Ort",
    "cta.h1": "Feuchte Wände im Gebäude?",
    "cta.accent": "Handeln Sie, bevor Bausubstanz leidet.",
    "cta.sub": "Eine kostenlose Vor-Ort-Feuchtemessung durch Herrn Mahmood bringt sofortige Klarheit. 100% sauber von der Innenseite, ohne Baggerarbeiten und mit 10 Jahren Systemgarantie.",
    "cta.btn": "Kostenlosen Termin anfragen",
    "cta.whatsapp": "Direkt per WhatsApp schreiben",

    // Contact
    "contact.eyebrow": "Kontakt & Vor-Ort-Analyse",
    "contact.h1": "Sprechen wir über Ihr Objekt.",
    "contact.accent": "Die Feuchtemessung ist kostenlos.",
    "contact.sub": "Vereinbaren Sie Ihren unverbindlichen Termin. Shahzad Mahmood misst die Feuchtigkeit im Mauerwerk und erstellt Ihnen ein transparentes Festpreisangebot.",
    "contact.name": "Name *",
    "contact.phone": "Telefon für Rückruf *",
    "contact.email": "E-Mail",
    "contact.plz": "PLZ des Objekts *",
    "contact.damage": "Art des Schadens",
    "contact.msg": "Ihre Nachricht",
    "contact.submit": "Kostenlose Feuchtemessung anfragen",
    "contact.viaWhatsapp": "Per WhatsApp senden",
    "contact.viaMail": "Per E-Mail senden",

    // Gallery
    "gallery.eyebrow": "AUS DER PRAXIS",
    "gallery.h1": "So sieht Sanierung aus.",
    "gallery.accent": "Schadensbilder und Arbeitsschritte.",
    "gallery.sub": "Bilder aus dem SchimmelPeter®-Netzwerk: typische Schäden und die Verfahren, die Shahzad Mahmood als Partnerbetrieb im Raum Wuppertal, Solingen, Remscheid und im Bergischen Land einsetzt.",
    "gallery.filterAll": "Alle Bilder",
    "gallery.filterHorizontal": "Horizontalsperre",
    "gallery.filterKeller": "Keller & Mauerwerk",
    "gallery.filterDrainage": "Drainage & Außenabdichtung",
    "gallery.filterSchimmel": "Schimmel",
    "gallery.filterTeam": "Ihr Ansprechpartner",
    "gallery.modalClose": "Schließen",
    "gallery.tagVerified": "SchimmelPeter® Verfahren",
    "gallery.zoomHint": "Vergrößern",

    // Rail
    "rail.start": "Start",
    "rail.warranty": "Garantie",
    "rail.calc": "Rechner",
    "rail.region": "PLZ 42",
    "rail.contact": "Kontakt"
};
