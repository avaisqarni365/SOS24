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
