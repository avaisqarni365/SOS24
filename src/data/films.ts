/**
 * The image films: one reel for the home page and one per service, cut from
 * the client's clips and branded step cards (silent, 432 x 768, H.264).
 * Each service film has its own shots: none is shared with another film
 * or with the home reel.
 * Chapter times are where each phase starts in the file.
 */
export interface Film {
  src: string;
  poster: string;
  seconds: number;
  title: string;
  chapters: { label: string; at: number }[];
}

const film = (slug: string, title: string, seconds: number, chapters: [string, number][]): Film => ({
  // ?v: the films were re-cut; a new version so no cache keeps the old cut
  src: `/media/film-${slug}.mp4?v=2`,
  poster: `/media/film-${slug}.webp?v=2`,
  seconds,
  title,
  chapters: chapters.map(([label, at]) => ({ label, at })),
});

export const REEL: Film = {
  // re-cut without the red injection packers: 12 s, ?v for the new file
  src: "/media/sos-reel.mp4?v=3",
  poster: "/media/sos-reel-poster.webp",
  seconds: 12,
  title: "So arbeiten wir",
  chapters: [
    { label: "Messen", at: 0 },
    { label: "Beraten", at: 2.3 },
    { label: "Abdichten", at: 3.75 },
    { label: "Übergabe", at: 7.15 },
    { label: "Kontakt", at: 9.25 },
  ],
};

/** Only films of real jobs. The generated films (Horizontalsperre, Feuchtemessung,
    Rissverpressung, Dachabdichtung, Balkon & Terrasse) are off the site until
    real footage replaces them; their files stay in public/media. */
export const SERVICE_FILMS: Record<string, Film> = {
  kellersanierung: film("kellersanierung", "Kellersanierung", 11, [["Befund", 0], ["Abdichten", 2.7], ["Ergebnis", 6.35], ["Übergabe", 7.5], ["Kontakt", 8.35]]),
  kellerinnenabdichtung: film("kellerinnenabdichtung", "Keller von innen abdichten", 9, [["Befund", 0], ["Vorbereiten", 0.85], ["Abdichten", 1.9], ["Putzen", 3.45], ["Ergebnis", 5], ["Kontakt", 6.15]]),
  schimmelbeseitigung: film("schimmelbeseitigung", "Schimmelbeseitigung", 11, [["Befund", 0], ["Messen", 1.65], ["Entfernen", 4.45], ["Schützen", 5.6], ["Ergebnis", 7.15], ["Kontakt", 8.3]]),
  sockelabdichtung: film("sockelabdichtung", "Sockelabdichtung", 10, [["Vor Ort", 0], ["Befund", 1.35], ["Vorbereiten", 2.7], ["Abdichten", 4.25], ["Kontakt", 7.35]]),
};

/**
 * One watch page per real film (/filme/<slug>/): Google indexes a video only
 * on a page that exists for it, not as decoration beside text. `uploadDate`
 * is when the film came onto the site; `service` links the page to its
 * service. The descriptions say what the film shows, chapter by chapter.
 */
export interface FilmPage {
  slug: string;
  film: Film;
  title: string;
  description: string;
  uploadDate: string;
  service?: string;
  /** the same film as a Short on the YouTube channel */
  youtube: string;
  /** what each chapter shows, in the order of film.chapters (the films are silent, so this is their text) */
  shows: string[];
}

export const FILM_PAGES: FilmPage[] = [
  {
    slug: "so-arbeiten-wir",
    film: REEL,
    title: "So arbeiten wir: vom Messen bis zur Übergabe",
    description:
      "Unser Ablauf in 12 Sekunden: Feuchtemessung vor Ort, Beratung mit dem Messergebnis, Abdichtung von innen und Übergabe an den Kunden.",
    uploadDate: "2026-10-08T16:37:04+02:00",
    youtube: "https://www.youtube.com/shorts/Llqz_HsAQbY",
    shows: [
      "Vor Ort nehmen wir den Schaden auf: Wo ist die Wand feucht, wo löst sich der Putz, und was zeigt das Messgerät?",
      "Am Tisch besprechen wir das Messergebnis mit dem Kunden und erklären, welches Verfahren zu diesem Schaden passt.",
      "Dann wird gearbeitet: Wir bohren in das Mauerwerk, setzen die Sperre und dichten die Wand von innen ab.",
      "Im fertigen Raum zeigen wir dem Kunden, was gemacht wurde und worauf er in Zukunft achten sollte.",
      "Ihr Ansprechpartner ist Inhaber Shahzad Mahmood. Die Feuchtemessung vor Ort ist kostenlos.",
    ],
  },
  {
    slug: "kellersanierung",
    film: SERVICE_FILMS.kellersanierung,
    title: "Kellersanierung von innen",
    description:
      "Eine Kellersanierung von innen, ohne Aufgraben: der Befund an der feuchten Wand, die Abdichtung, der trockene Keller und die Übergabe.",
    uploadDate: "2026-10-09T15:44:29+02:00",
    service: "kellersanierung",
    youtube: "https://www.youtube.com/shorts/DBlWxjaVtAM",
    shows: [
      "Im Keller prüfen wir die feuchte Wand: Wo ist sie nass, und wie hoch reicht die Feuchte?",
      "Abgedichtet wird von innen, mit Dichtungsschlämme in zwei Lagen. Das Material rühren wir vor Ort frisch an.",
      "Der Keller nach der Sanierung: Die Wände sind neu verputzt, der Raum ist wieder nutzbar.",
      "Zum Schluss gehen wir mit dem Kunden durch den Raum und zeigen ihm die fertigen Wände.",
      "Ihr Ansprechpartner ist Inhaber Shahzad Mahmood. Die Feuchtemessung vor Ort ist kostenlos.",
    ],
  },
  {
    slug: "keller-von-innen-abdichten",
    film: SERVICE_FILMS.kellerinnenabdichtung,
    title: "Keller von innen abdichten",
    description:
      "Eine Kellerinnenabdichtung Schritt für Schritt: Befund, Vorbereitung des Untergrunds, Dichtungsschlämme, Sanierputz und das Ergebnis.",
    uploadDate: "2026-10-09T15:44:29+02:00",
    service: "kellerinnenabdichtung",
    youtube: "https://www.youtube.com/shorts/7DoXppirIr4",
    shows: [
      "Die Kellerwand unter dem Fenster hat dunkle Feuchteflecken, der alte Putz ist durchfeuchtet.",
      "Wir schlagen den losen Putz ab, bis der tragfähige Untergrund freiliegt.",
      "Darauf kommt die Dichtungsschlämme: zwei Lagen, mit einer Hohlkehle am Übergang von der Wand zum Boden.",
      "Über die Abdichtung kommt Sanierputz nach WTA. Er nimmt die Salze aus der Wand auf, ohne abzuplatzen.",
      "Das Ergebnis: eine helle, glatt verputzte Kellerwand.",
      "Ihr Ansprechpartner ist Inhaber Shahzad Mahmood. Die Feuchtemessung vor Ort ist kostenlos.",
    ],
  },
  {
    slug: "schimmel-im-keller-beseitigen",
    film: SERVICE_FILMS.schimmelbeseitigung,
    title: "Schimmel im Keller beseitigen",
    description:
      "Schimmelbeseitigung im Keller: der Befund, die Messung der Ursache, die sporensichere Entfernung, der Schutz der Wand und das Ergebnis.",
    uploadDate: "2026-10-09T15:44:29+02:00",
    service: "schimmelbeseitigung",
    youtube: "https://www.youtube.com/shorts/1iD-yY5igUM",
    shows: [
      "Die Kellerwand ist großflächig von schwarzem Schimmel befallen, der Putz darunter ist feucht.",
      "Bevor etwas entfernt wird, messen wir: Kommt die Feuchte aus der Wand oder aus der Raumluft?",
      "Dann entfernen wir den Befall von der Wand, ohne die Sporen im Raum zu verteilen.",
      "Zum Schutz kommen Calciumsilikat-Platten an die Wand. Sie halten die Oberfläche warm und hemmen neuen Schimmel.",
      "Das Ergebnis: eine saubere, neu aufgebaute Wand.",
      "Ihr Ansprechpartner ist Inhaber Shahzad Mahmood. Die Feuchtemessung vor Ort ist kostenlos.",
    ],
  },
  {
    slug: "sockel-abdichten",
    film: SERVICE_FILMS.sockelabdichtung,
    title: "Sockel abdichten",
    description:
      "Eine Sockelabdichtung vor Ort: die Begehung, der Befund am feuchten Sockel, die Vorbereitung der Fläche und die Abdichtung.",
    uploadDate: "2026-10-09T15:44:29+02:00",
    service: "sockelabdichtung",
    youtube: "https://www.youtube.com/shorts/Dg6R1d8jetM",
    shows: [
      "Wir sehen uns den Sockel außen am Haus an, rund um das Gebäude.",
      "Am Sockel platzt der Putz ab. Wir halten den Schaden fest und messen die Feuchte.",
      "Der Sockel wird freigelegt, gereinigt und geprüft, damit die Abdichtung auf festem Grund sitzt.",
      "Abgedichtet wird mit Bitumen-Dickbeschichtung (KMB) in zwei Lagen. Danach ist der Sockel gegen Spritzwasser und Erdfeuchte geschützt.",
      "Ihr Ansprechpartner ist Inhaber Shahzad Mahmood. Die Feuchtemessung vor Ort ist kostenlos.",
    ],
  },
];

/** The ISO 8601 duration Google expects, e.g. 13 -> "PT13S". */
export const isoDuration = (seconds: number) => `PT${Math.round(seconds)}S`;
