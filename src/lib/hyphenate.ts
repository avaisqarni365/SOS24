import { hyphenateSync } from "hyphen/de";

const SHY = "­";

/** Compounds the pattern set splits at the wrong joint, with their correct break points. */
const EXCEPTIONS: Record<string, string> = {
  Kellerinnenabdichtung: "Kel|ler|in|nen|ab|dich|tung",
  Kellerinnenwand: "Kel|ler|in|nen|wand",
  Kellerinnenwände: "Kel|ler|in|nen|wän|de",
  Innenabdichtung: "In|nen|ab|dich|tung",
  Horizontalsperre: "Ho|ri|zon|tal|sper|re",
  Horizontalsperren: "Ho|ri|zon|tal|sper|ren",
};
const EXC = Object.fromEntries(Object.entries(EXCEPTIONS).map(([k, v]) => [k, v.replace(/\|/g, SHY)]));

const SKIP = /@|www\.|https?:|^sos-|\.(de|com)\b/i;

/**
 * Inserts soft hyphens into German body text at build time, so justified
 * paragraphs break long compounds cleanly in every browser, including those
 * that ship no German hyphenation dictionary. Server components only: the
 * pattern set never reaches the client bundle.
 */
export function hy(text: string): string {
  return keep(text)
    .split(/(\s+)/)
    .map((tok) =>
      SKIP.test(tok)
        ? tok
        : tok.replace(/[A-Za-zÄÖÜäöüß]{7,}/g, (w) => EXC[w] ?? hyphenateSync(w, { minWordLength: 7 }))
    )
    .join("");
}

/** Keeps codes like "4-4-04" on one line (non-breaking hyphen between digits). */
export function keep(text: string): string {
  return text.replace(/(\d)-(?=\d)/g, "$1\u2011");
}
