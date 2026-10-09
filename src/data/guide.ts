/**
 * Which method for which sign: the question every homeowner asks first.
 * Used by the table on /leistungen/ and by the Schnell-Check on the service
 * pages. A guide, not a diagnosis: the free measurement decides.
 */
export const GUIDE = [
  { sign: "Feuchterand und weiße Salze im Sockel, nach oben hin trockener", cause: "Aufsteigende Feuchte aus dem Erdreich", slug: "horizontalsperre" },
  { sign: "Nasse Flächen über die ganze Wandhöhe, Wasser drückt seitlich", cause: "Seitlich eindringendes Wasser", slug: "kellerinnenabdichtung" },
  { sign: "Schwarze Flecken in Raumecken, hinter Schränken, an Fensterlaibungen", cause: "Kondensat an kalten Flächen", slug: "schimmelbeseitigung" },
  { sign: "Wasser sickert durch einen Riss in Beton oder Mauerwerk", cause: "Wasserführender Riss", slug: "rissverpressung" },
  { sign: "Mehrere Anzeichen zugleich, der Keller soll wieder nutzbar werden", cause: "Mehrere Ursachen", slug: "kellersanierung" },
  { sign: "Ursache unklar, Gutachten für Kauf, Versicherung oder Vermieter", cause: "Erst messen", slug: "feuchtemessung" },
];

/** the contact form's damage option for each service (prefills /kontakt/) */
export const DAMAGE_BY_SLUG: Record<string, string> = {
  kellersanierung: "Nasser Keller / Drückendes Hangwasser",
  horizontalsperre: "Feuchte Kellerwände / Horizontalsperre",
  kellerinnenabdichtung: "Nasser Keller / Drückendes Hangwasser",
  schimmelbeseitigung: "Schimmelbefall & Geruch",
  feuchtemessung: "Allgemeine Feuchtigkeitsmessung",
  rissverpressung: "Wasserführender Riss",
};

/** the contact page, prefilled with the damage type where there is one */
export const formHrefFor = (slug: string) =>
  DAMAGE_BY_SLUG[slug] ? `/kontakt/?schaden=${encodeURIComponent(DAMAGE_BY_SLUG[slug])}` : "/kontakt/";

/**
 * The Schnell-Check: three questions, each answer adds points to the
 * services its sign points to (from the guide above). The highest score
 * wins; a tie, or "unsure", leads to the measurement first.
 */
export const CHECK_QUESTIONS: { q: string; answers: { a: string; score: Record<string, number> }[] }[] = [
  {
    q: "Wo sehen Sie die Feuchtigkeit?",
    answers: [
      { a: "Unten an der Wand, nach oben hin trockener", score: { horizontalsperre: 3 } },
      { a: "Über die ganze Wandhöhe", score: { kellerinnenabdichtung: 3 } },
      { a: "In Raumecken, hinter Schränken, an Fenstern", score: { schimmelbeseitigung: 3 } },
      { a: "Entlang eines Risses", score: { rissverpressung: 3 } },
    ],
  },
  {
    q: "Was fällt Ihnen noch auf?",
    answers: [
      { a: "Weiße, kristalline Salzränder", score: { horizontalsperre: 2 } },
      { a: "Schwarze Flecken, muffiger Geruch", score: { schimmelbeseitigung: 2 } },
      { a: "Wasser läuft oder tropft nach Regen", score: { kellerinnenabdichtung: 1, rissverpressung: 1 } },
      { a: "Putz bröckelt, Farbe blättert", score: { horizontalsperre: 1, kellerinnenabdichtung: 1 } },
    ],
  },
  {
    q: "Wie groß ist der Schaden?",
    answers: [
      { a: "Eine Stelle", score: {} },
      { a: "Mehrere Wände oder der ganze Keller", score: { kellersanierung: 3 } },
      { a: "Ich bin unsicher, was es ist", score: { feuchtemessung: 4 } },
    ],
  },
];
