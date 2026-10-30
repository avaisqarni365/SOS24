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
  src: "/media/sos-reel.mp4",
  poster: "/media/sos-reel-poster.webp",
  seconds: 13,
  title: "So arbeiten wir",
  chapters: [
    { label: "Messen", at: 0 },
    { label: "Beraten", at: 2.3 },
    { label: "Abdichten", at: 3.75 },
    { label: "Übergabe", at: 8.45 },
    { label: "Kontakt", at: 10.55 },
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
}

export const FILM_PAGES: FilmPage[] = [
  {
    slug: "so-arbeiten-wir",
    film: REEL,
    title: "So arbeiten wir: vom Messen bis zur Übergabe",
    description:
      "Unser Ablauf in 13 Sekunden: Feuchtemessung vor Ort, Beratung mit dem Messergebnis, Abdichtung von innen und Übergabe an den Kunden.",
    uploadDate: "2026-10-08T16:37:04+02:00",
  },
  {
    slug: "kellersanierung",
    film: SERVICE_FILMS.kellersanierung,
    title: "Kellersanierung von innen",
    description:
      "Eine Kellersanierung von innen, ohne Aufgraben: der Befund an der feuchten Wand, die Abdichtung, der trockene Keller und die Übergabe.",
    uploadDate: "2026-10-09T15:44:29+02:00",
    service: "kellersanierung",
  },
  {
    slug: "keller-von-innen-abdichten",
    film: SERVICE_FILMS.kellerinnenabdichtung,
    title: "Keller von innen abdichten",
    description:
      "Eine Kellerinnenabdichtung Schritt für Schritt: Befund, Vorbereitung des Untergrunds, Dichtungsschlämme, Sanierputz und das Ergebnis.",
    uploadDate: "2026-10-09T15:44:29+02:00",
    service: "kellerinnenabdichtung",
  },
  {
    slug: "schimmel-im-keller-beseitigen",
    film: SERVICE_FILMS.schimmelbeseitigung,
    title: "Schimmel im Keller beseitigen",
    description:
      "Schimmelbeseitigung im Keller: der Befund, die Messung der Ursache, die sporensichere Entfernung, der Schutz der Wand und das Ergebnis.",
    uploadDate: "2026-10-09T15:44:29+02:00",
    service: "schimmelbeseitigung",
  },
  {
    slug: "sockel-abdichten",
    film: SERVICE_FILMS.sockelabdichtung,
    title: "Sockel abdichten",
    description:
      "Eine Sockelabdichtung vor Ort: die Begehung, der Befund am feuchten Sockel, die Vorbereitung der Fläche und die Abdichtung.",
    uploadDate: "2026-10-09T15:44:29+02:00",
    service: "sockelabdichtung",
  },
];

/** The ISO 8601 duration Google expects, e.g. 13 -> "PT13S". */
export const isoDuration = (seconds: number) => `PT${Math.round(seconds)}S`;
