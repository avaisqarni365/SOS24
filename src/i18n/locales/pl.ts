/** PL strings, loaded only when the visitor picks this language. */
const STRINGS: Record<string, string> = {
    // Nav
    "nav.services": "Usługi",
    "nav.process3d": "Metoda 3D",
    "nav.simulation": "Scientific Lab",
    "nav.gallery": "Galeria",
    "nav.proof": "Dowód",
    "rail.proof": "Pomiary",
    "rail.layers": "Ściana 3D",
    "nav.calculator": "Kalkulator oferty",
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
    "rail.contact": "Kontakt"
};

export default STRINGS;
