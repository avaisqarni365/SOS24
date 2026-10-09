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

export const SERVICE_FILMS: Record<string, Film> = {
  kellersanierung: film("kellersanierung", "Kellersanierung", 11, [["Befund", 0], ["Abdichten", 2.7], ["Ergebnis", 6.35], ["Übergabe", 7.5], ["Kontakt", 8.35]]),
  horizontalsperre: film("horizontalsperre", "Horizontalsperre", 9, [["Messen", 0], ["Bohren", 1.15], ["Injizieren", 3.55], ["Übergabe", 5.1], ["Kontakt", 6.35]]),
  kellerinnenabdichtung: film("kellerinnenabdichtung", "Keller von innen abdichten", 9, [["Befund", 0], ["Vorbereiten", 0.85], ["Abdichten", 1.9], ["Putzen", 3.45], ["Ergebnis", 5], ["Kontakt", 6.15]]),
  schimmelbeseitigung: film("schimmelbeseitigung", "Schimmelbeseitigung", 11, [["Befund", 0], ["Messen", 1.65], ["Entfernen", 4.45], ["Schützen", 5.6], ["Ergebnis", 7.15], ["Kontakt", 8.3]]),
  feuchtemessung: film("feuchtemessung", "Feuchtemessung", 11, [["Vor Ort", 0], ["Messen", 1.65], ["Auswerten", 4.45], ["Beraten", 6.55], ["Kontakt", 7.9]]),
  rissverpressung: film("rissverpressung", "Rissverpressung", 8, [["Riss", 0], ["Verpressen", 1.15], ["Abschluss", 4.7], ["Kontakt", 5.35]]),
  dachabdichtung: film("dachabdichtung", "Dachabdichtung", 11, [["Vor Ort", 0], ["Prüfen", 1.85], ["Abdichten", 3.4], ["Verschweißen", 4.95], ["Kontakt", 8.35]]),
  "balkon-terrasse": film("balkon-terrasse", "Balkon & Terrasse", 11, [["Anruf", 0], ["Anfrage", 0.55], ["Prüfen", 2.4], ["Abdichten", 3.95], ["Beraten", 7.05], ["Kontakt", 8.4]]),
  sockelabdichtung: film("sockelabdichtung", "Sockelabdichtung", 10, [["Vor Ort", 0], ["Befund", 1.35], ["Vorbereiten", 2.7], ["Abdichten", 4.25], ["Kontakt", 7.35]]),
};
