export type SupportedLocale = "de" | "en" | "tr" | "ru" | "ar" | "pl";

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
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", dir: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", dir: "ltr" },
];

export const TRANSLATIONS: Record<SupportedLocale, Record<string, string>> = {
  de: {
    // Nav
    "nav.services": "Leistungen",
    "nav.process3d": "3D-Verfahren",
    "nav.simulation": "Scientific Lab",
    "nav.gallery": "Galerie",
    "nav.proof": "Nachweis",
    "rail.proof": "Nachweis",
    "rail.layers": "3D-Wand",
    "nav.calculator": "Kostenrechner",
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
    "calc.eyebrow": "Kosten & Ersparnisrechner",
    "calc.h1": "Transparente Kosten.",
    "calc.accent": "Bis zu 60% günstiger als Aufgraben.",
    "calc.sub": "Vergleichen Sie das schonende chemische Injektionsverfahren von der Innenseite mit einer aufwändigen und teuren Außenaufgrabung für Ihr Gebäude in Wuppertal und Umgebung.",
    "calc.step1": "1. Schadensbild auswählen",
    "calc.step2": "2. Betroffene Wandlänge:",
    "calc.step3": "3. Mauerwerkstyp",
    "calc.estTitle": "Kalkulierter Richtpreis",
    "calc.cta": "Verbindliches Festpreisangebot anfragen",

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
    "rail.contact": "Kontakt",
  },

  en: {
    // Nav
    "nav.services": "Services",
    "nav.process3d": "3D Process",
    "nav.simulation": "Scientific Lab",
    "nav.gallery": "Gallery",
    "nav.proof": "Proof",
    "rail.proof": "Proof",
    "rail.layers": "3D wall",
    "nav.calculator": "Cost Calculator",
    "nav.region": "Service Area",
    "nav.faq": "FAQ",
    "nav.cta": "Request Diagnosis →",
    "nav.phone": "Available by phone",

    // Hero
    "hero.tagline": "Basement Waterproofing & Horizontal Barriers Wuppertal",
    "hero.h1": "Sealed. Injected. Dried.",
    "hero.accent": "Permanently.",
    "hero.sub": "sos-abdichtung stops rising damp, restores wet basement masonry, and eliminates mould in Wuppertal and the Bergisches Land region. Our WTA-certified chemical injection displaces water at molecular level — executed cleanly from the inside with zero excavation and backed by a 10-year warranty.",
    "hero.ctaPrimary": "Request Free On-Site Analysis",
    "hero.ctaSecondary": "Explore 3D Injection Model",
    "hero.trustStrip": "WTA CODE 4-4-04 · TÜV-TESTED MATERIALS · 10-YEAR WARRANTY · ZERO EXCAVATION · PLZ 42",
    "hero.stat1Val": "42",
    "hero.stat1Label": "PLZ Postal Region Wuppertal · Solingen · Remscheid",
    "hero.stat2Val": "100%",
    "hero.stat2Label": "Pressureless Silane Microemulsion (WTA)",
    "hero.stat3Val": "10 Y.",
    "hero.stat3Label": "Official Warranty on Masonry Dryness",
    "hero.stat4Val": "24h",
    "hero.stat4Label": "On-Site Moisture Measurement Response Time",

    // Services
    "services.eyebrow": "Professional Services",
    "services.h1": "The entire structure.",
    "services.accent": "One permanent solution.",
    "services.sub": "Most damp repairs fail because of cosmetic surface plaster or regular paint. sos-abdichtung tackles building physics at its roots — accurately measured, restored to WTA standards, and guaranteed for 10 years.",
    "services.card1Title": "Horizontal Barrier without Excavation",
    "services.card1Desc": "Pressureless silane microemulsion injection. Masonry is penetrated into deep capillaries, creating an impermeable hydrophobic barrier that completely halts rising damp.",
    "services.card1Badge": "No Excavator Needed",
    "services.card2Title": "Internal Basement Waterproofing & Fillet",
    "services.card2Desc": "Mineral waterproofing slurries (MDS), pressure-resistant wall-slab joints, and heavy-duty restoration plasters protect basements against heavy hillside water in Wuppertal.",
    "services.card2Badge": "100% Watertight",
    "services.card3Title": "Mould Remediation & Root Cause Analysis",
    "services.card3Desc": "No hazardous chlorine fumes: we measure moisture and dew-point levels accurately, eradicate mould spores safely, and prevent recurrence with breathable calcium-silicate panels.",
    "services.card3Badge": "Instrument Verified",

    // 3D Pipeline
    "pipe.eyebrow": "WTA Injection Process",
    "pipe.h1": "One Borehole.",
    "pipe.accent": "4 Phases to Molecular Dryness.",
    "pipe.sub": "This is the real physical path inside the brickwork — not an artist's impression. Each borehole is drilled at a 60° angle and flooded with low-viscosity silane microemulsion, permanently blocking water.",
    "pipe.secSub": "Restoration Timeline",
    "pipe.secH3": "From initial diagnosis to dry masonry in 4 steps.",
    "pipe.btn": "Book Free On-Site Inspection",

    // Compliance
    "comp.eyebrow": "Certification & Guarantee",
    "comp.h1": "Verified Building Physics.",
    "comp.accent": "10-Year Written Guarantee.",
    "comp.sub": "With building integrity, there is no room for trial and error. Every chemical injection is executed with an official CM measurement protocol and German construction-authority approved compounds.",

    // Calculator
    "calc.eyebrow": "Cost & Savings Calculator",
    "calc.h1": "Transparent Pricing.",
    "calc.accent": "Up to 60% cheaper than exterior excavation.",
    "calc.sub": "Compare non-invasive internal chemical injection with expensive, destructive outdoor digging for your property in the Wuppertal area.",
    "calc.step1": "1. Select Damage Type",
    "calc.step2": "2. Wall Length (approx. metres):",
    "calc.step3": "3. Masonry Type",
    "calc.estTitle": "Estimated Benchmark Cost",
    "calc.cta": "Request Binding Fixed-Price Offer",

    // Regional
    "reg.eyebrow": "Service Area Wuppertal & Bergisches Land",
    "reg.h1": "The Wupper River Valley.",
    "reg.accent": "Our Core Service Territory.",
    "reg.sub": "Wuppertal, Solingen, Remscheid, Velbert and the Bergisches Land are characterized by historic slate and brick buildings on steep hillsides. Local building expertise is essential.",
    "reg.searchPlaceholder": "Enter your 5-digit German postal code (e.g. 42103)...",
    "reg.btn": "Check",

    // FAQ
    "faq.eyebrow": "Frequently Asked Questions",
    "faq.h1": "Key Facts on Basement Drying.",
    "faq.accent": "Precise Answers.",
    "faq.sub": "Clear answers to the most important questions about damp walls, restoration costs, and horizontal barrier warranties in Wuppertal.",

    // CTA
    "cta.eyebrow": "Immediate On-Site Diagnosis",
    "cta.h1": "Damp Walls in Your Building?",
    "cta.accent": "Act before structural damage and mould spread.",
    "cta.sub": "A free on-site moisture measurement by Mr. Mahmood provides immediate clarity. 100% clean from the inside, zero excavation, and backed by a 10-year system warranty.",
    "cta.btn": "Request Free Appointment",
    "cta.whatsapp": "Message Directly on WhatsApp",

    // Contact
    "contact.eyebrow": "Contact & On-Site Consultation",
    "contact.h1": "Let's Discuss Your Property.",
    "contact.accent": "We respond within a few hours.",
    "contact.sub": "Book your non-binding inspection. Mr. Mahmood will measure moisture levels in your walls and provide a transparent, fixed-price quote with zero surprise charges.",
    "contact.name": "Full Name / Contact Person *",
    "contact.phone": "Phone Number for Callback *",
    "contact.email": "Email Address",
    "contact.plz": "Building Postal Code (PLZ) *",
    "contact.damage": "Type of Damage",
    "contact.msg": "Your Message / Details about the Property",
    "contact.submit": "Send Request & Open WhatsApp",
    "contact.viaWhatsapp": "Send via WhatsApp",
    "contact.viaMail": "Send by e-mail",

    // Gallery
    "gallery.eyebrow": "FROM THE FIELD",
    "gallery.h1": "What remediation looks like.",
    "gallery.accent": "Damage patterns and work steps.",
    "gallery.sub": "Photos from the SchimmelPeter® network: typical damage and the methods Shahzad Mahmood uses as a partner company in Wuppertal, Solingen, Remscheid and the Bergisches Land.",
    "gallery.filterAll": "All photos",
    "gallery.filterHorizontal": "Horizontal Barrier",
    "gallery.filterKeller": "Basement & Masonry",
    "gallery.filterDrainage": "Drainage Systems",
    "gallery.filterSchimmel": "Mould Remediation",
    "gallery.filterTeam": "Diagnostics & Team",
    "gallery.modalClose": "Close",
    "gallery.tagVerified": "SchimmelPeter® method",
    "gallery.zoomHint": "Expand →",

    // Rail
    "rail.start": "Start",
    "rail.warranty": "Warranty",
    "rail.calc": "Calculator",
    "rail.region": "PLZ 42",
    "rail.contact": "Contact",
  },

  tr: {
    // Nav
    "nav.services": "Hizmetler",
    "nav.process3d": "3D Yöntem",
    "nav.simulation": "Scientific Lab",
    "nav.gallery": "Galeri",
    "nav.proof": "Kanıt",
    "rail.proof": "Kanıt",
    "rail.layers": "3D duvar",
    "nav.calculator": "Maliyet",
    "nav.region": "Hizmet Bölgesi",
    "nav.faq": "Sıkça Sorulanlar",
    "nav.cta": "Teşhis Talep Et →",
    "nav.phone": "Telefonla Ulaşın",

    // Hero
    "hero.tagline": "Bodrum İzolasyonu & Kimyasal Nem Bariyeri Wuppertal",
    "hero.h1": "İzole Edildi. Enjekte Edildi. Kurutuldu.",
    "hero.accent": "Kalıcı Olarak.",
    "hero.sub": "sos-abdichtung, Wuppertal ve Bergisches Land bölgesinde yükselen rutubeti durdurur, ıslak bodrum duvarlarını onarır ve küfü yok eder. WTA sertifikalı kimyasal enjeksiyon yöntemimiz suyu moleküler düzeyde uzaklaştırır — kazı yapmadan, içeriden temizce uygulanır ve 10 yıl garantilidir.",
    "hero.ctaPrimary": "Ücretsiz Yerinde İnceleme İste",
    "hero.ctaSecondary": "3D Enjeksiyon Modelini Gör",
    "hero.trustStrip": "WTA 4-4-04 STANDARDI · TÜV ONAYLI MALZEMELER · 10 YIL GARANTİ · KAZI YAPILMAZ · PLZ 42",
    "hero.stat1Val": "42",
    "hero.stat1Label": "Posta Kodu Bölgesi Wuppertal · Solingen · Remscheid",
    "hero.stat2Val": "%100",
    "hero.stat2Label": "WTA Standartlarında Basınçsız Silan Mikroemülsiyonu",
    "hero.stat3Val": "10 Yıl",
    "hero.stat3Label": "Duvar Kuruluğunda Resmi Sistem Garantisi",
    "hero.stat4Val": "24 Saat",
    "hero.stat4Label": "Yerinde Nem Ölçümü Yanıt Süresi",

    // Services
    "services.eyebrow": "Uzman Hizmetler",
    "services.h1": "Tüm bina.",
    "services.accent": "Kalıcı tek bir çözüm.",
    "services.sub": "Yüzeysel boya ve alçı onarımları rutubeti çözmez. sos-abdichtung fiziksel problemi kökünden çözer: profesyonel ölçüm, WTA standardında uygulama ve 10 yıl garanti.",
    "services.card1Title": "Kazısız Yatay Nem Bariyeri (Horizontalsperre)",
    "services.card1Desc": "WTA sertifikalı silan mikroemülsiyonu ile basınçsız enjeksiyon. Duvar gözeneklerine nüfuz ederek kalıcı su geçirmez bariyer oluşturur, yükselen nemi %100 durdurur.",
    "services.card1Badge": "Kepçe / Kazı Gerekmez",
    "services.card2Title": "İçten Bodrum Yalıtımı & Pah Uygulaması",
    "services.card2Desc": "Mineral yalıtım harçları (MDS), basınca dayanıklı zemin-duvar birleşimleri ve özel restorasyon sıvaları ile Wuppertal'in yamaç sularına karşı tam koruma.",
    "services.card2Badge": "%100 Su Geçirmez",
    "services.card3Title": "Küf Temizliği & Neden Analizi",
    "services.card3Desc": "Zehirli klor kullanmıyoruz: Nem ve çiğ noktası ölçümü ile küfün kaynağını bulur, sporları yok eder ve kalsiyum silikat panellerle yeniden oluşmasını engelleriz.",
    "services.card3Badge": "Ölçümle Kanıtlanmış",

    // 3D Pipeline
    "pipe.eyebrow": "WTA Enjeksiyon Yöntemi",
    "pipe.h1": "Tek bir delik.",
    "pipe.accent": "Moleküler kuruluğa 4 adım.",
    "pipe.sub": "Bu, duvarın içindeki gerçek fiziksel süreçtir. 60° açıyla açılan deliklere basınçsız silan mikroemülsiyonu doldurulur; kimyasal bağ oluşturarak suyu tamamen engeller.",
    "pipe.secSub": "Uygulama Aşamaları",
    "pipe.secH3": "İlk incelemeden kuru duvara 4 adımda.",
    "pipe.btn": "Ücretsiz Yerinde Teşhis Randevusu Al",

    // Compliance
    "comp.eyebrow": "Sertifikasyon & Güvence",
    "comp.h1": "Test Edilmiş Yapı Fiziği.",
    "comp.accent": "10 Yıl Yazılı Garanti Belgesi.",
    "comp.sub": "Bina güvenliğinde deneme yanılmaya yer yoktur. Her enjeksiyon, CM nem ölçüm protokolü ve resmi yapı izinli Alman kimyasalları ile yapılır.",

    // Calculator
    "calc.eyebrow": "Maliyet & Tasarruf Hesaplayıcı",
    "calc.h1": "Şeffaf Fiyatlandırma.",
    "calc.accent": "Dış kazıya kıyasla %60'a varan tasarruf.",
    "calc.sub": "Evinizin bahçesini ve girişini kazdırmak yerine içeriden uygulanan modern kimyasal enjeksiyonun ekonomik avantajını hemen hesaplayın.",
    "calc.step1": "1. Hasar Türünü Seçin",
    "calc.step2": "2. Duvar Uzunluğu (Metre):",
    "calc.step3": "3. Duvar Tipi",
    "calc.estTitle": "Tahmini Yaklaşık Fiyat",
    "calc.cta": "Sabit Fiyat Teklifi İsteyin",

    // Regional
    "reg.eyebrow": "Hizmet Bölgesi: Wuppertal & Çevresi",
    "reg.h1": "Wupper Vadisi.",
    "reg.accent": "Ana Hizmet Sahamız.",
    "reg.sub": "Wuppertal, Solingen, Remscheid ve Velbert dik yamaçları ve tarihi taş/tuğla binalarıyla bilinir. 42 ile başlayan tüm posta kodlarında hizmetinizdeyiz.",
    "reg.searchPlaceholder": "5 haneli posta kodunuzu girin (örn. 42103)...",
    "reg.btn": "Sorgula",

    // FAQ
    "faq.eyebrow": "Sıkça Sorulan Sorular",
    "faq.h1": "Bodrum Yalıtımı Hakkında.",
    "faq.accent": "Net ve Açık Yanıtlar.",
    "faq.sub": "Nemli duvarlar, maliyetler ve 10 yıl garantili enjeksiyon hakkında Wuppertal ev sahiplerinin en çok merak ettiği sorular.",

    // CTA
    "cta.eyebrow": "Hızlı Yerinde İnceleme",
    "cta.h1": "Binanızda Nem veya Küf mü Var?",
    "cta.accent": "Bina hasarı büyümeden önlem alın.",
    "cta.sub": "Shahzad Mahmood tarafından yapılacak ücretsiz yerinde nem ölçümü ile kesin durumu öğrenin. Bahçe kazılmaz, temiz çalışılır, 10 yıl garantilidir.",
    "cta.btn": "Ücretsiz Randevu Al",
    "cta.whatsapp": "WhatsApp'tan Doğrudan Yazın",

    // Contact
    "contact.eyebrow": "İletişim & Randevu",
    "contact.h1": "Binanızı Değerlendirelim.",
    "contact.accent": "Birkaç saat içinde dönüş yapıyoruz.",
    "contact.sub": "Ücretsiz keşif için bize ulaşın. Duvarlarınızdaki nemi profesyonel cihazlarla ölçüp size net, şeffaf ve sürprizsiz bir sabit fiyat sunalım.",
    "contact.name": "Adınız Soyadınız *",
    "contact.phone": "Geri Arama İçin Telefon Numaranız *",
    "contact.email": "E-Posta Adresiniz",
    "contact.plz": "Binanın Posta Kodu (PLZ) *",
    "contact.damage": "Hasar Türü",
    "contact.msg": "Mesajınız / Bina Detayları",
    "contact.submit": "Talebi Gönder & WhatsApp'ı Aç",
    "contact.viaWhatsapp": "WhatsApp ile gönder",
    "contact.viaMail": "E-posta ile gönder",

    // Gallery
    "gallery.eyebrow": "SAHADAN",
    "gallery.h1": "Yalıtım uygulamada böyle görünür.",
    "gallery.accent": "Hasar türleri ve çalışma adımları.",
    "gallery.sub": "SchimmelPeter® ağından fotoğraflar: tipik hasarlar ve Shahzad Mahmood'un Wuppertal, Solingen, Remscheid ve Bergisches Land bölgesinde ortak firma olarak uyguladığı yöntemler.",
    "gallery.filterAll": "Tüm fotoğraflar",
    "gallery.filterHorizontal": "Yatay Bariyer",
    "gallery.filterKeller": "Bodrum ve Duvar",
    "gallery.filterDrainage": "Drenaj Sistemleri",
    "gallery.filterSchimmel": "Küf Giderme",
    "gallery.filterTeam": "Keşif ve Ekip",
    "gallery.modalClose": "Kapat",
    "gallery.tagVerified": "SchimmelPeter® yöntemi",
    "gallery.zoomHint": "Büyüt →",

    // Rail
    "rail.start": "Başlangıç",
    "rail.warranty": "Garanti",
    "rail.calc": "Hesaplayıcı",
    "rail.region": "PLZ 42",
    "rail.contact": "İletişim",
  },

  ru: {
    // Nav
    "nav.services": "Услуги",
    "nav.process3d": "3D-Метод",
    "nav.simulation": "Scientific Lab",
    "nav.gallery": "Галерея",
    "nav.proof": "Доказательство",
    "rail.proof": "Замеры",
    "rail.layers": "3D-стена",
    "nav.calculator": "Калькулятор",
    "nav.region": "Регион 42",
    "nav.faq": "Вопросы и ответы",
    "nav.cta": "Заказать диагностику →",
    "nav.phone": "Консультация по телефону",

    // Hero
    "hero.tagline": "Гидроизоляция подвалов и стен в Вуппертале",
    "hero.h1": "Изолировано. Введено. Высушено.",
    "hero.accent": "Навсегда.",
    "hero.sub": "sos-abdichtung устраняет капиллярную влагу, сырость в подвалах и плесень в Вуппертале и регионе Бергишес Ланд. Сертифицированная WTA инъекционная гидроизоляция вытесняет воду на молекулярном уровне — без раскопок, изнутри помещения с гарантией 10 лет.",
    "hero.ctaPrimary": "Бесплатный выезд и замер влажности",
    "hero.ctaSecondary": "Смотреть 3D-модель инъекции",
    "hero.trustStrip": "СТАНДАРТ WTA 4-4-04 · СЕРТИФИКАТ TÜV · ГАРАНТИЯ 10 ЛЕТ · БЕЗ ЗЕМЛЯНЫХ РАБОТ · PLZ 42",
    "hero.stat1Val": "42",
    "hero.stat1Label": "Почтовый регион Вупперталь · Золинген · Ремшайд",
    "hero.stat2Val": "100%",
    "hero.stat2Label": "Безнапорная силановая микроэмульсия WTA",
    "hero.stat3Val": "10 лет",
    "hero.stat3Label": "Официальная гарантия на сухость кладки",
    "hero.stat4Val": "24 ч.",
    "hero.stat4Label": "Время выезда эксперта на объект",

    // Services
    "services.eyebrow": "Наши компетенции",
    "services.h1": "Все здание.",
    "services.accent": "Одно надежное решение.",
    "services.sub": "Косметический ремонт и шпаклевка не спасают от сырости. sos-abdichtung устраняет физическую причину: точные замеры, сертифицированная санация по нормам WTA и 10 лет гарантии.",
    "services.card1Title": "Горизонтальная отсечка без раскопок",
    "services.card1Desc": "Безнапорная инъекция силановой микроэмульсии. Состав проникает в мельчайшие капилляры кирпича и камня, создавая непреодолимый водоотталкивающий барьер.",
    "services.card1Badge": "Без экскаватора",
    "services.card2Title": "Внутренняя гидроизоляция подвала",
    "services.card2Desc": "Минеральные шламы (MDS), герметизация стыков стена-пол и паропроницаемые санирующие штукатурки надежно защищают от грунтовых вод на склонах Вупперталя.",
    "services.card2Badge": "100% водонепроницаемость",
    "services.card3Title": "Удаление плесени и анализ причин",
    "services.card3Desc": "Без опасного хлора: мы определяем точку росы и причину сырости, уничтожаем споры и монтируем силикат-кальциевые плиты для предотвращения рецидивов.",
    "services.card3Badge": "Подтверждено приборами",

    // 3D Pipeline
    "pipe.eyebrow": "Инъекционный метод WTA",
    "pipe.h1": "Отверстие в стене.",
    "pipe.accent": "4 фазы к молекулярной сухости.",
    "pipe.sub": "Это реальный физический процесс внутри кладки. Скважины бурятся под углом 60° и заполняются микроэмульсией, вытесняющей влагу навсегда.",
    "pipe.secSub": "Этапы выполнения",
    "pipe.secH3": "От первого осмотра до сухой стены за 4 шага.",
    "pipe.btn": "Записаться на бесплатный замер",

    // Compliance
    "comp.eyebrow": "Сертификаты и гарантии",
    "comp.h1": "Проверенная строительная физика.",
    "comp.accent": "10 лет письменной гарантии.",
    "comp.sub": "В вопросах сохранности здания недопустимы эксперименты. Каждая процедура сопровождается протоколом карбидного замера (CM) и немецкими сертифицированными составами.",

    // Calculator
    "calc.eyebrow": "Калькулятор стоимости и экономии",
    "calc.h1": "Прозрачные цены.",
    "calc.accent": "До 60% дешевле, чем раскапывать снаружи.",
    "calc.sub": "Сравните аккуратную инъекцию изнутри здания с дорогостоящими раскопками фундамента вашего дома в регионе Вупперталя.",
    "calc.step1": "1. Выберите тип проблемы",
    "calc.step2": "2. Длина стены (погонные метры):",
    "calc.step3": "3. Материал кладки",
    "calc.estTitle": "Ориентировочная стоимость",
    "calc.cta": "Запросить фиксированную смету",

    // Regional
    "reg.eyebrow": "Регион обслуживания: Вупперталь и округ",
    "reg.h1": "Долина реки Вуппер.",
    "reg.accent": "Основная зона выезда специалистов.",
    "reg.sub": "Вупперталь, Золинген, Ремшайд и Фельберт отличаются холмистым рельефом и старинными домами из сланца и кирпича. Мы обслуживаем все индексы с кодом 42.",
    "reg.searchPlaceholder": "Введите 5 цифр индекса (напр. 42103)...",
    "reg.btn": "Проверить",

    // FAQ
    "faq.eyebrow": "Частые вопросы",
    "faq.h1": "Все о гидроизоляции.",
    "faq.accent": "Точные и понятные ответы.",
    "faq.sub": "Ответы на главные вопросы владельцев недвижимости о сырости в подвале, гарантиях и методике WTA.",

    // CTA
    "cta.eyebrow": "Срочный выезд специалиста",
    "cta.h1": "Сырость в подвале или на стенах?",
    "cta.accent": "Действуйте до разрушения кладки и плесени.",
    "cta.sub": "Бесплатный замер влажности от инженера Шахзада Махмуда даст точный диагноз. Без разрушения двора, чисто и с гарантией 10 лет.",
    "cta.btn": "Заказать бесплатный осмотр",
    "cta.whatsapp": "Написать напрямую в WhatsApp",

    // Contact
    "contact.eyebrow": "Контакты и консультация",
    "contact.h1": "Обсудим ваш объект.",
    "contact.accent": "Отвечаем в течение 2-3 часов.",
    "contact.sub": "Запишитесь на удобное время. Мы измерим уровень влаги высокоточными приборами и предоставим прозрачное предложение с фиксированной ценой.",
    "contact.name": "Ваше имя / контактное лицо *",
    "contact.phone": "Телефон для обратной связи *",
    "contact.email": "Электронная почта",
    "contact.plz": "Почтовый индекс объекта *",
    "contact.damage": "Тип повреждения",
    "contact.msg": "Ваше сообщение / детали объекта",
    "contact.submit": "Отправить заявку и открыть WhatsApp",
    "contact.viaWhatsapp": "Отправить через WhatsApp",
    "contact.viaMail": "Отправить по e-mail",

    // Gallery
    "gallery.eyebrow": "ИЗ ПРАКТИКИ",
    "gallery.h1": "Как выглядит санация.",
    "gallery.accent": "Типичные повреждения и этапы работ.",
    "gallery.sub": "Фотографии из сети SchimmelPeter®: типичные повреждения и методы, которые Шахзад Махмуд как партнёрская фирма применяет в Вуппертале, Золингене, Ремшайде и регионе Бергишес-Ланд.",
    "gallery.filterAll": "Все фото",
    "gallery.filterHorizontal": "Горизонтальная отсечка",
    "gallery.filterKeller": "Подвал и стены",
    "gallery.filterDrainage": "Дренажные системы",
    "gallery.filterSchimmel": "Удаление плесени",
    "gallery.filterTeam": "Диагностика и команда",
    "gallery.modalClose": "Закрыть",
    "gallery.tagVerified": "Метод SchimmelPeter®",
    "gallery.zoomHint": "Увеличить →",

    // Rail
    "rail.start": "Старт",
    "rail.warranty": "Гарантия",
    "rail.calc": "Калькулятор",
    "rail.region": "Регион 42",
    "rail.contact": "Контакты",
  },

  ar: {
    // Nav
    "nav.services": "الخدمات",
    "nav.process3d": "تقنية 3D",
    "nav.simulation": "Scientific Lab",
    "nav.gallery": "المعرض",
    "nav.proof": "الإثبات",
    "rail.proof": "الإثبات",
    "rail.layers": "الجدار 3D",
    "nav.calculator": "الحاسبة",
    "nav.region": "منطقة الخدمة",
    "nav.faq": "الأسئلة الشائعة",
    "nav.cta": "طلب فحص مجاني ←",
    "nav.phone": "اتصال هاتفي مباشر",

    // Hero
    "hero.tagline": "عزل الأقبية وحقن الجدران ضد الرطوبة في فوبرتال",
    "hero.h1": "عُزل. حُقن. جُفف.",
    "hero.accent": "بشكل دائم.",
    "hero.sub": "شركة sos-abdichtung تضع حداً للرطوبة الصاعدة وتعالج جدران الأقبية وتقضي على العفن في فوبرتال ومنطقة بيرغيشس لاند. تقنية الحقن المعتمدة وفق معايير WTA تطرد الرطوبة على المستوى الجزيئي — من الداخل بدون حفر خارجي وبضمان 10 سنوات.",
    "hero.ctaPrimary": "طلب فحص وقياس رطوبة مجاني",
    "hero.ctaSecondary": "مشاهدة نموذج الحقن ثلاثي الأبعاد",
    "hero.trustStrip": "معايير WTA 4-4-04 · مواد معتمدة من TÜV · ضمان 10 سنوات · بدون حفر خارجي · الرمز البريدي 42",
    "hero.stat1Val": "42",
    "hero.stat1Label": "منطقة الرمز البريدي: فوبرتال · زولينغن · ريمشايد",
    "hero.stat2Val": "100%",
    "hero.stat2Label": "مستحلب سيلان نانوي بدون ضغط وفق معايير WTA",
    "hero.stat3Val": "10 سنوات",
    "hero.stat3Label": "ضمان رسمي معتمد على جفاف الجدران",
    "hero.stat4Val": "24 ساعة",
    "hero.stat4Label": "سرعة الاستجابة للفحص الميداني",

    // Services
    "services.eyebrow": "الخدمات الاحترافية",
    "services.h1": "المبنى بأكمله.",
    "services.accent": "حل نهائي ودائم.",
    "services.sub": "معظم محاولات الإصلاح التقليدية تفشل بسبب الطلاء السطحي. نحن نعالج المشكلة الفيزيائية من جذورها: قياس دقيق، معالجة وفق مواصفات WTA، وضمان رسمي لمدة 10 سنوات.",
    "services.card1Title": "حاجز رطوبة أفقي بدون أي حفر خارجي",
    "services.card1Desc": "حقن مستحلب السيلان المعتمد من WTA بدون ضغط. يتغلغل في مسام الجدار العميقة ويشكل حاجزاً مائياً دائماً يمنع صعود الرطوبة بنسبة 100%.",
    "services.card1Badge": "بدون جرافات أو حفر",
    "services.card2Title": "عزل الأقبية الداخلي ومعالجة الزوايا",
    "services.card2Desc": "ملاط عزل معدني مقاوم للماء (MDS) وحماية وصلات الجدران بالأرضيات لضمان أقبية جافة حتى مع ضغط المياه الجوفية على منحدرات فوبرتال.",
    "services.card2Badge": "مقاوم للماء 100%",
    "services.card3Title": "إزالة العفن ومعالجة أسبابه الجذرية",
    "services.card3Desc": "بدون مواد كيميائية سامة: نحدد نقطة التكثف ومصدر الرطوبة، ونزيل أبواغ العفن بأمان، ونركب ألواح سيليكات الكالسيوم لمنع تكراره نهائياً.",
    "services.card3Badge": "مثبت بأجهزة القياس",

    // 3D Pipeline
    "pipe.eyebrow": "تقنية الحقن المعتمدة WTA",
    "pipe.h1": "ثقب واحد في الجدار.",
    "pipe.accent": "4 مراحل للوصول إلى الجفاف التام.",
    "pipe.sub": "هذا هو المسار الفيزيائي الحقيقي داخل البناء. يتم حفر الثقوب بزاوية 60 درجة وغمرها بمستحلب السيلان لتشكيل حاجز غير منفذ للماء.",
    "pipe.secSub": "خطوات التنفيذ",
    "pipe.secH3": "من المعاينة الأولى إلى الجدار الجاف في 4 خطوات.",
    "pipe.btn": "حجز موعد فحص مجاني في الموقع",

    // Compliance
    "comp.eyebrow": "الشهادات والضمان",
    "comp.h1": "فيزياء بناء معتمدة ومجربة.",
    "comp.accent": "شهادة ضمان خطية لمدة 10 سنوات.",
    "comp.sub": "سلامة مبناك لا تحتمل التجارب. كل عملية حقن تنفذ وفق تقرير قياس الرطوبة المعتمد وباستخدام مواد ألمانية مرخصة من هيئات البناء.",

    // Calculator
    "calc.eyebrow": "حاسبة التكاليف والتوفير",
    "calc.h1": "أسعار واضحة وشفافة.",
    "calc.accent": "توفير يصل إلى 60% مقارنة بالحفر الخارجي.",
    "calc.sub": "قارن بين طريقة الحقن الداخلي النظيفة وتكاليف الحفر الخارجي الباهظة لعقارك في منطقة فوبرتال وما حولها.",
    "calc.step1": "1. حدد نوع الضرر",
    "calc.step2": "2. طول الجدار المتضرر (بالمتر):",
    "calc.step3": "3. نوع البناء والجدار",
    "calc.estTitle": "التكلفة التقديرية المبدئية",
    "calc.cta": "طلب عرض سعر نهائي وثابت",

    // Regional
    "reg.eyebrow": "منطقة الخدمة: فوبرتال ومحيطها",
    "reg.h1": "وادي نهر فوبر.",
    "reg.accent": "منطقة عملنا المباشرة والرئيسية.",
    "reg.sub": "تتميز فوبرتال وزولينغن وريمشايد بمبانيها التاريخية وتضاريسها المنحدرة. نحن نغطي جميع الرموز البريدية التي تبدأ بالرقم 42.",
    "reg.searchPlaceholder": "أدخل الرمز البريدي المكون من 5 أرقام (مثال: 42103)...",
    "reg.btn": "تحقق الآن",

    // FAQ
    "faq.eyebrow": "الأسئلة الشائعة",
    "faq.h1": "معلومات تهمك عن عزل الأقبية.",
    "faq.accent": "إجابات دقيقة وموثوقة.",
    "faq.sub": "إجابات موجزة عن أهم الاستفسارات حول رطوبة الجدران والتكاليف وضمان الـ 10 سنوات في منطقة فوبرتال.",

    // CTA
    "cta.eyebrow": "فحص ميداني فوري",
    "cta.h1": "هل تعاني من رطوبة الجدران؟",
    "cta.accent": "تصرّف الآن قبل تلف البنية الإنشائية وظهور العفن.",
    "cta.sub": "فحص وقياس الرطوبة المجاني من قبل السيد شهزاد محمود يمنحك وضوحاً كاملاً. عمل نظيف من الداخل وبدون حفر مع ضمان 10 سنوات.",
    "cta.btn": "طلب موعد فحص مجاني",
    "cta.whatsapp": "مراسلة مباشرة عبر واتساب",

    // Contact
    "contact.eyebrow": "الاتصال والمعاينة",
    "contact.h1": "دعنا نتحدث عن عقارك.",
    "contact.accent": "نرد على استفساركم خلال ساعات قليلة.",
    "contact.sub": "احجز موعد المعاينة المجاني. سيقوم السيد محمود بقياس نسبة الرطوبة بأحدث الأجهزة وتقديم عرض سعر ثابت بدون أي تكاليف خفية.",
    "contact.name": "الاسم الكامل / جهة الاتصال *",
    "contact.phone": "رقم الهاتف للاتصال بكم *",
    "contact.email": "البريد الإلكتروني",
    "contact.plz": "الرمز البريدي للعقار (PLZ) *",
    "contact.damage": "نوع الضرر أو المشكلة",
    "contact.msg": "رسالتك / تفاصيل العقار",
    "contact.submit": "إرسال الطلب وفتح واتساب",
    "contact.viaWhatsapp": "إرسال عبر واتساب",
    "contact.viaMail": "إرسال بالبريد الإلكتروني",

    // Gallery
    "gallery.eyebrow": "من الواقع العملي",
    "gallery.h1": "هكذا تبدو أعمال الترميم.",
    "gallery.accent": "أنماط الأضرار وخطوات العمل.",
    "gallery.sub": "صور من شبكة SchimmelPeter®: أضرار نموذجية والطرق التي يستخدمها شهزاد محمود كشريك معتمد في فوبرتال وزولينغن وريمشايد ومنطقة بيرغيشس لاند.",
    "gallery.filterAll": "كل الصور",
    "gallery.filterHorizontal": "الحاجز الأفقي والحقن",
    "gallery.filterKeller": "عزل الأقبية والجدران",
    "gallery.filterDrainage": "أنظمة تصريف المياه",
    "gallery.filterSchimmel": "مكافحة العفن والرطوبة",
    "gallery.filterTeam": "الفحص الهندسي والفريق",
    "gallery.modalClose": "إغلاق",
    "gallery.tagVerified": "طريقة SchimmelPeter®",
    "gallery.zoomHint": "تكبير الصورة ←",

    // Rail
    "rail.start": "البداية",
    "rail.warranty": "الضمان",
    "rail.calc": "الحاسبة",
    "rail.region": "المنطقة 42",
    "rail.contact": "الاتصال",
  },

  pl: {
    // Nav
    "nav.services": "Usługi",
    "nav.process3d": "Metoda 3D",
    "nav.simulation": "Scientific Lab",
    "nav.gallery": "Galeria",
    "nav.proof": "Dowód",
    "rail.proof": "Pomiary",
    "rail.layers": "Ściana 3D",
    "nav.calculator": "Kalkulator",
    "nav.region": "Obszar 42",
    "nav.faq": "Częste pytania",
    "nav.cta": "Zamów diagnozę →",
    "nav.phone": "Kontakt telefoniczny",

    // Hero
    "hero.tagline": "Osuszanie piwnic i przepony poziome Wuppertal",
    "hero.h1": "Uszczelnione. Zainfekowane. Osuszone.",
    "hero.accent": "Trwale.",
    "hero.sub": "sos-abdichtung zatrzymuje podciąganie kapilarne, osusza zawilgocone ściany piwnic i usuwa pleśń w Wuppertalu i regionie Bergisches Land. Certyfikowana metoda iniekcji WTA wypiera wodę na poziomie molekularnym — czysto od wewnątrz, bez wykopów i z 10-letnią gwarancją.",
    "hero.ctaPrimary": "Zamów bezpłatny pomiar wilgotności",
    "hero.ctaSecondary": "Zobacz model iniekcji 3D",
    "hero.trustStrip": "NORMA WTA 4-4-04 · CERTYFIKAT TÜV · 10 LAT GWARANCJI · BEZ WYKOPÓW · KOD 42",
    "hero.stat1Val": "42",
    "hero.stat1Label": "Region kodów pocztowych Wuppertal · Solingen · Remscheid",
    "hero.stat2Val": "100%",
    "hero.stat2Label": "Bezciśnieniowa mikroemulsja silanowa WTA",
    "hero.stat3Val": "10 lat",
    "hero.stat3Label": "Gwarancja na szczelność i suchość muru",
    "hero.stat4Val": "24h",
    "hero.stat4Label": "Czas reakcji i przyjazdu na pomiar",

    // Services
    "services.eyebrow": "Specjalistyczne usługi",
    "services.h1": "Cały budynek.",
    "services.accent": "Jedno trwałe rozwiązanie.",
    "services.sub": "Większość prób naprawy zawodzi przez zwykłe tynkowanie lub malowanie. sos-abdichtung eliminuje problem fizyczny u źródła: precyzyjny pomiar, renowacja wg normy WTA i 10 lat gwarancji.",
    "services.card1Title": "Przepona pozioma bez odkopywania fundamentów",
    "services.card1Desc": "Bezciśnieniowa iniekcja mikroemulsji silanowej z certyfikatem WTA. Penetruje mikroskopijne kapilary muru, tworząc trwałą barierę hydrofobową, która w 100% zatrzymuje podciąganie wody.",
    "services.card1Badge": "Bez koparek i bałaganu",
    "services.card2Title": "Wewnętrzna hydroizolacja piwnicy",
    "services.card2Desc": "Mineralne szlamy uszczelniające (MDS), szczelne połączenia ściana-posadzka oraz tynki renowacyjne chronią piwnice przed wodą naporową na zboczach Wuppertalu.",
    "services.card2Badge": "100% wodoszczelność",
    "services.card3Title": "Usuwanie pleśni i analiza przyczyn",
    "services.card3Desc": "Bez szkodliwego chloru: badamy punkt rosy i wilgotność, bezpiecznie usuwamy zarodniki pleśni i montujemy płyty krzemianowo-wapienne zapobiegające nawrotom.",
    "services.card3Badge": "Potwierdzone pomiarami",

    // 3D Pipeline
    "pipe.eyebrow": "Metoda iniekcji WTA",
    "pipe.h1": "Jeden otwór wiertniczy.",
    "pipe.accent": "4 fazy do molekularnej suchości.",
    "pipe.sub": "To rzeczywisty proces fizyczny zachodzący wewnątrz muru. Otwory wiercone są pod kątem 60° i nasączane mikroemulsją silanową, trwale wypierając wodę.",
    "pipe.secSub": "Przebieg prac",
    "pipe.secH3": "Od pierwszych oględzin do suchej ściany w 4 krokach.",
    "pipe.btn": "Zarezerwuj bezpłatny pomiar na miejscu",

    // Compliance
    "comp.eyebrow": "Certyfikaty i gwarancja",
    "comp.h1": "Sprawdzona fizyka budowli.",
    "comp.accent": "10 lat pisemnej gwarancji.",
    "comp.sub": "W kwestii konstrukcji budynku nie ma miejsca na kompromisy. Każda iniekcja wykonywana jest z protokołem pomiaru wilgotności (metoda CM) i atestowaną chemią budowlaną.",

    // Calculator
    "calc.eyebrow": "Kalkulator kosztów i oszczędności",
    "calc.h1": "Przejrzyste ceny.",
    "calc.accent": "Do 60% taniej niż odkopywanie budynku z zewnątrz.",
    "calc.sub": "Porównaj czystą iniekcję chemiczną od wewnątrz z kosztownym i uciążliwym rozkopywaniem ogrodu i podjazdu.",
    "calc.step1": "1. Wybierz rodzaj problemu",
    "calc.step2": "2. Długość zawilgoconej ściany (metry):",
    "calc.step3": "3. Rodzaj muru",
    "calc.estTitle": "Szacunkowy koszt orientacyjny",
    "calc.cta": "Zamów wiążącą ofertę ze stałą ceną",

    // Regional
    "reg.eyebrow": "Obszar działania: Wuppertal i okolice",
    "reg.h1": "Dolina rzeki Wupper.",
    "reg.accent": "Nasz główny rejon obsługi.",
    "reg.sub": "Wuppertal, Solingen, Remscheid i Velbert charakteryzują się stromymi zboczami i zabytkowymi budynkami z cegły i łupka. Obsługujemy wszystkie kody pocztowe z grupy 42.",
    "reg.searchPlaceholder": "Wpisz 5-cyfrowy kod pocztowy (np. 42103)...",
    "reg.btn": "Sprawdź",

    // FAQ
    "faq.eyebrow": "Często zadawane pytania",
    "faq.h1": "Wszystko o osuszaniu piwnic.",
    "faq.accent": "Precyzyjne i rzetelne odpowiedzi.",
    "faq.sub": "Odpowiedzi na najważniejsze pytania właścicieli nieruchomości dotyczące zawilgocenia, kosztów i gwarancji w rejonie Wuppertalu.",

    // CTA
    "cta.eyebrow": "Szybka diagnoza na miejscu",
    "cta.h1": "Mokre ściany w budynku?",
    "cta.accent": "Działaj, zanim rozwinie się groźna pleśń.",
    "cta.sub": "Bezpłatny pomiar wilgotności wykonany przez inż. Shahzada Mahmooda da Ci natychmiastową pewność. Czysto od środka, bez koparek i z 10-letnią gwarancją.",
    "cta.btn": "Zamów bezpłatny termin",
    "cta.whatsapp": "Napisz bezpośrednio na WhatsApp",

    // Contact
    "contact.eyebrow": "Kontakt i konsultacja",
    "contact.h1": "Porozmawiajmy o Twoim budynku.",
    "contact.accent": "Odpowiadamy w ciągu kilku godzin.",
    "contact.sub": "Zarezerwuj niezobowiązującą wizytę. Pan Mahmood zbada wilgotność profesjonalnymi miernikami i przedstawi przejrzystą ofertę bez ukrytych kosztów.",
    "contact.name": "Imię i nazwisko / Osoba do kontaktu *",
    "contact.phone": "Numer telefonu do kontaktu *",
    "contact.email": "Adres e-mail",
    "contact.plz": "Kod pocztowy budynku (PLZ) *",
    "contact.damage": "Rodzaj uszkodzenia",
    "contact.msg": "Twoja wiadomość / Szczegóły obiektu",
    "contact.submit": "Wyślij zapytanie i otwórz WhatsApp",
    "contact.viaWhatsapp": "Wyślij przez WhatsApp",
    "contact.viaMail": "Wyślij e-mailem",

    // Gallery
    "gallery.eyebrow": "Z PRAKTYKI",
    "gallery.h1": "Tak wygląda renowacja.",
    "gallery.accent": "Typowe uszkodzenia i etapy prac.",
    "gallery.sub": "Zdjęcia z sieci SchimmelPeter®: typowe uszkodzenia i metody, które Shahzad Mahmood stosuje jako firma partnerska w Wuppertalu, Solingen, Remscheid i regionie Bergisches Land.",
    "gallery.filterAll": "Wszystkie zdjęcia",
    "gallery.filterHorizontal": "Przepona pozioma",
    "gallery.filterKeller": "Piwnice i mury",
    "gallery.filterDrainage": "Systemy drenażowe",
    "gallery.filterSchimmel": "Usuwanie pleśni",
    "gallery.filterTeam": "Diagnostyka i zespół",
    "gallery.modalClose": "Zamknij",
    "gallery.tagVerified": "Metoda SchimmelPeter®",
    "gallery.zoomHint": "Powiększ →",

    // Rail
    "rail.start": "Start",
    "rail.warranty": "Gwarancja",
    "rail.calc": "Kalkulator",
    "rail.region": "Obszar 42",
    "rail.contact": "Kontakt",
  }
};
