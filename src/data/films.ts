/**
 * The image films: one reel for the home page and one per service, cut from
 * the client's clips and branded step cards (silent, 432 x 768, H.264).
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
  src: `/media/film-${slug}.mp4`,
  poster: `/media/film-${slug}.webp`,
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
  kellersanierung: film("kellersanierung", "Kellersanierung", 11, [["Befund", 0], ["Abdichten", 2.9], ["Übergabe", 6.75], ["Kontakt", 7.8]]),
  horizontalsperre: film("horizontalsperre", "Horizontalsperre", 10, [["Messen", 0], ["Bohren", 0.85], ["Injizieren", 4.8], ["Übergabe", 6.35], ["Kontakt", 7.4]]),
  kellerinnenabdichtung: film("kellerinnenabdichtung", "Keller von innen abdichten", 11, [["Befund", 0], ["Abdichten", 2.05], ["Putzen", 5.9], ["Übergabe", 7.45], ["Kontakt", 8.5]]),
  schimmelbeseitigung: film("schimmelbeseitigung", "Schimmelbeseitigung", 10, [["Befund", 0], ["Messen", 1.45], ["Schützen", 4.45], ["Wohnen", 6], ["Kontakt", 7.05]]),
  feuchtemessung: film("feuchtemessung", "Feuchtemessung", 10, [["Vor Ort", 0], ["Messen", 2.3], ["Beraten", 3.85], ["Kontakt", 6.85]]),
  rissverpressung: film("rissverpressung", "Rissverpressung", 10, [["Riss", 0], ["Verpressen", 1.25], ["Abschluss", 5.5], ["Kontakt", 6.75]]),
  dachabdichtung: film("dachabdichtung", "Dachabdichtung", 11, [["Vor Ort", 0], ["Prüfen", 1.85], ["Abdichten", 3.4], ["Verschweißen", 4.95], ["Kontakt", 8.35]]),
  "balkon-terrasse": film("balkon-terrasse", "Balkon & Terrasse", 10, [["Vorher", 0], ["Prüfen", 1.05], ["Abdichten", 2.6], ["Übergabe", 5.7], ["Kontakt", 6.75]]),
  sockelabdichtung: film("sockelabdichtung", "Sockelabdichtung", 8, [["Befund", 0], ["Vorbereiten", 1.45], ["Abdichten", 3], ["Kontrolle", 4.55], ["Kontakt", 5.4]]),
};
