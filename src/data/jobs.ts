import { CITY_PAGES, type CityPage } from "@/data/seo-pages";
import { COMPANY_INFO } from "@/data/content-data";

/**
 * Stellenangebote. Three real openings; staff start in Essen and work on sites across the region.
 * Each role has one ad page (/jobs/<slug>/) with JobPosting markup for Google's job search, placed
 * in Essen where the job is based. Each town has a page (/jobs/<town>/) that presents the roles for
 * people searching "Jobs in <Stadt>"; those town pages link to the ads and carry no second
 * JobPosting, because Google treats one job posted for many towns as duplicates.
 *
 * No wage figures here (the site names no prices; pay is agreed in person).
 */
export interface JobRole {
  slug: string;
  /** the title of the ad, as a job seeker would search it */
  title: string;
  short: string;
  /** search words people use for this kind of job; shown as chips and used in the town pages */
  keywords: string[];
  employment: string;
  /** schema.org employmentType */
  employmentType: string[];
  hours: string;
  metaTitle: string;
  metaDescription: string;
  lede: string;
  tasks: string[];
  requirements: string[];
  offer: string[];
  /** one sentence for the town pages; {stadt} is replaced with the town's name */
  inTown: string;
}

/** The ads were published on this day and are checked again before the end date. */
export const JOBS_POSTED = "2026-11-21";
export const JOBS_VALID_THROUGH = "2027-02-28";

export const JOB_ROLES: JobRole[] = [
  {
    slug: "abdichter-bauhelfer",
    title: "Abdichter / Bauhelfer (m/w/d) in Vollzeit",
    short: "Abdichter / Bauhelfer",
    keywords: ["Vollzeit", "Bauhelfer", "Abdichter", "Bautenschutz", "Handwerker", "Helfer Bau", "Quereinsteiger"],
    employment: "Vollzeit, unbefristet angestrebt",
    employmentType: ["FULL_TIME"],
    hours: "Montag bis Freitag, auf Baustellen im Ruhrgebiet und im Bergischen Land",
    metaTitle: "Abdichter / Bauhelfer (m/w/d) Vollzeit in Essen | Job",
    metaDescription:
      "Stellenangebot Abdichter / Bauhelfer (m/w/d) in Vollzeit: Kellersanierung ab Essen, Baustellen im Ruhrgebiet. Auch für Quereinsteiger. Jetzt bewerben.",
    lede:
      "Wir legen Keller trocken: Horizontalsperren, Innenabdichtung, Rissverpressung und Sanierputz. Dafür suchen wir einen Abdichter oder Bauhelfer in Vollzeit, der sauber arbeitet und mit anpacken kann. Erfahrung im Bautenschutz ist gut, aber keine Bedingung: Quereinsteiger arbeitet der Inhaber selbst ein.",
    tasks: [
      "Alten Putz abschlagen und Kellerwände für die Abdichtung vorbereiten",
      "Bohrlöcher für die Horizontalsperre setzen und das Injektionsmittel einbringen",
      "Dichtungsschlämme, Hohlkehle und Sanierputz auftragen",
      "Risse in Beton und Mauerwerk verpressen",
      "Baustelle abdecken, sauber halten und besenrein übergeben",
    ],
    requirements: [
      "Erfahrung am Bau oder handwerkliches Geschick; Quereinsteiger sind willkommen",
      "Zuverlässig, pünktlich und sorgfältig, auch im bewohnten Haus beim Kunden",
      "Körperlich belastbar: Arbeit im Keller, Tragen von Material",
      "Deutsch für die Verständigung auf der Baustelle und mit Kunden",
      "Führerschein Klasse B ist von Vorteil",
    ],
    offer: [
      "Einarbeitung in alle Verfahren durch den Inhaber",
      "Kleines Team, kurze Wege, feste Ansprechperson",
      "Baustellen in der Region, Start in Essen",
      "Lohn nach Vereinbarung und Erfahrung",
    ],
    inTown: "Vollzeit auf Baustellen in {stadt} und Umgebung: Keller abdichten, Horizontalsperren setzen, Sanierputz auftragen. Auch für Quereinsteiger.",
  },
  {
    slug: "teilzeit-minijob",
    title: "Bauhelfer / Aushilfe (m/w/d) in Teilzeit oder als Minijob",
    short: "Teilzeit / Minijob",
    keywords: ["Teilzeit", "Minijob", "Aushilfe", "Nebenjob", "Teilzeitarbeit", "Helfer", "tageweise"],
    employment: "Teilzeit oder Minijob",
    employmentType: ["PART_TIME"],
    hours: "Tageweise nach Absprache, auf Baustellen im Ruhrgebiet und im Bergischen Land",
    metaTitle: "Teilzeit / Minijob: Bauhelfer, Aushilfe (m/w/d) Essen",
    metaDescription:
      "Teilzeitarbeit oder Minijob als Bauhelfer / Aushilfe (m/w/d): tageweise ab Essen, Baustellen im Ruhrgebiet. Nebenjob mit Einarbeitung. Jetzt bewerben.",
    lede:
      "Sie suchen Teilzeitarbeit, einen Minijob oder einen Nebenjob im Handwerk? Wir suchen eine Aushilfe, die uns tageweise auf der Baustelle unterstützt: vorbereiten, zuarbeiten, aufräumen. Die Tage sprechen wir vorher ab.",
    tasks: [
      "Baustelle einrichten: abdecken, Material und Werkzeug bereitstellen",
      "Putz abschlagen und Schutt entsorgen",
      "Beim Bohren, Injizieren und Verputzen zuarbeiten",
      "Baustelle reinigen und Werkzeug pflegen",
    ],
    requirements: [
      "Zuverlässig und pünktlich an den vereinbarten Tagen",
      "Körperlich belastbar; Erfahrung am Bau ist nicht nötig",
      "Deutsch für die Verständigung auf der Baustelle",
      "Sorgfältiger Umgang mit dem Haus des Kunden",
    ],
    offer: [
      "Feste Absprachen: Sie wissen vorher, an welchen Tagen Sie arbeiten",
      "Einarbeitung auf der Baustelle",
      "Anstellung in Teilzeit oder als Minijob, ordentlich angemeldet",
      "Lohn nach Vereinbarung",
    ],
    inTown: "Teilzeitarbeit, Minijob oder Nebenjob als Aushilfe auf Baustellen in {stadt} und Umgebung, tageweise nach Absprache.",
  },
  {
    slug: "werkstudent-studentenjob",
    title: "Werkstudent / Studentenjob (m/w/d): Baustelle, Fotos und Büro",
    short: "Werkstudent / Studentenjob",
    keywords: ["Studentenjob", "Werkstudent", "Nebenjob für Studenten", "Ferienjob", "Aushilfe", "flexibel", "Social Media"],
    employment: "Werkstudent oder studentische Aushilfe",
    employmentType: ["PART_TIME"],
    hours: "Flexibel neben dem Studium, in den Semesterferien auch mehr",
    metaTitle: "Studentenjob / Werkstudent (m/w/d) im Handwerk, Essen",
    metaDescription:
      "Studentenjob oder Werkstudent (m/w/d) im Handwerk: Baustellenhilfe, Fotos und Videos, Büro. Flexibel neben dem Studium ab Essen, Ruhrgebiet. Jetzt bewerben.",
    lede:
      "Ein Studentenjob, bei dem man sieht, was man geschafft hat: Sie helfen auf der Baustelle, fotografieren und filmen unsere Arbeit für die Website und die sozialen Medien oder unterstützen im Büro. Die Zeiten richten sich nach Ihrem Stundenplan.",
    tasks: [
      "Auf der Baustelle mit anpacken und zuarbeiten",
      "Fotos und kurze Videos der Arbeitsschritte aufnehmen",
      "Beiträge für Facebook, Instagram und das Google-Profil vorbereiten",
      "Im Büro helfen: Termine, Unterlagen, Ablage",
    ],
    requirements: [
      "Eingeschrieben an einer Hochschule oder Universität",
      "Zuverlässig; Lust auf praktische Arbeit",
      "Sicheres Deutsch in Wort und Schrift",
      "Ein gutes Auge für Fotos und Videos mit dem Smartphone ist ein Plus",
      "Führerschein Klasse B ist von Vorteil",
    ],
    offer: [
      "Flexible Zeiten neben Vorlesungen und Prüfungen",
      "Einblick in einen Handwerksbetrieb vom Aufmaß bis zur Abnahme",
      "Einarbeitung durch den Inhaber",
      "Lohn nach Vereinbarung",
    ],
    inTown: "Studentenjob oder Werkstudentenstelle mit Einsätzen in {stadt} und Umgebung: Baustelle, Fotos und Videos, Büro. Flexibel neben dem Studium.",
  },
];

export const jobRole = (slug: string) => JOB_ROLES.find((r) => r.slug === slug);
export const jobCity = (slug: string): CityPage | undefined => CITY_PAGES.find((c) => c.slug === slug);

/** Every search word of all roles, once. */
export const JOB_KEYWORDS = Array.from(new Set(JOB_ROLES.flatMap((r) => r.keywords)));

/** The ways to apply. The WhatsApp and mail texts name the job (and the town), so the office knows what it is about. */
export function applyLinks(what: string, town?: string) {
  const where = town ? ` (Einsatzort ${town})` : "";
  const text = `Hallo Herr Mahmood, ich interessiere mich für die Stelle „${what}“${where}. Mein Name ist `;
  const body = `Guten Tag Herr Mahmood,\n\nich interessiere mich für die Stelle „${what}“${where}.\n\nName:\nTelefon:\nWohnort:\nErfahrung:\nFrühester Beginn:\n\nMit freundlichen Grüßen`;
  return {
    whatsapp: `https://wa.me/${COMPANY_INFO.phoneTel.replace("+", "")}?text=${encodeURIComponent(text)}`,
    tel: `tel:${COMPANY_INFO.phoneTel}`,
    mail: `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(`Bewerbung: ${what}${where}`)}&body=${encodeURIComponent(body)}`,
  };
}

/** Questions applicants ask; shown on the overview and on every town page. */
export const JOB_FAQS = [
  {
    q: "Wie bewerbe ich mich?",
    a: "Am einfachsten per WhatsApp oder Anruf unter 0172 2064177. Schreiben Sie kurz, welche Stelle Sie interessiert, wo Sie wohnen und ab wann Sie anfangen können. Ein Lebenslauf ist willkommen, aber für den ersten Kontakt nicht nötig.",
  },
  {
    q: "Brauche ich eine Ausbildung im Bautenschutz?",
    a: "Nein. Erfahrung am Bau hilft, aber Quereinsteiger sind willkommen. Die Verfahren, also Horizontalsperre, Innenabdichtung, Rissverpressung und Sanierputz, zeigt Ihnen der Inhaber auf der Baustelle.",
  },
  {
    q: "Wo wird gearbeitet?",
    a: "Der Betrieb sitzt in Essen, Niebuhrstraße 46. Von dort fahren wir zu Baustellen im Ruhrgebiet, im Bergischen Land und im Rheinland. In welchen Städten Sie eingesetzt werden, sprechen wir vorher ab.",
  },
  {
    q: "Gibt es Teilzeitarbeit, Minijobs und Studentenjobs?",
    a: "Ja. Neben der Vollzeitstelle suchen wir eine Aushilfe in Teilzeit oder als Minijob und einen Werkstudenten. Die Arbeitstage werden vorher abgesprochen und richten sich bei Studierenden nach dem Stundenplan.",
  },
  {
    q: "Wie hoch ist der Lohn?",
    a: "Den Lohn vereinbaren wir im Gespräch, abhängig von Erfahrung und Stundenumfang. Alle Stellen sind ordentlich angemeldet.",
  },
];
