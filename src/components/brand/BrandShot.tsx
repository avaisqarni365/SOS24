/**
 * A picture from the client's brand sheet: the service van and the crew.
 * Each is its own small file, cut from the sheet and re-lettered with the
 * current wordmark (full colour on the van, a white print on the hoodies).
 */
export const SHOTS = {
  van: { src: "/img/brand/brand-van.webp", w: 540, h: 296, alt: "Servicewagen von SOS-Abdichtung mit Logo vor einem Neubau" },
  roofer: { src: "/img/brand/brand-roofer.webp", w: 300, h: 446, alt: "Mitarbeiter in SOS-Abdichtung-Arbeitskleidung verschweißt eine Bitumenbahn auf dem Flachdach" },
  walker: { src: "/img/brand/brand-walker.webp", w: 198, h: 302, alt: "Mitarbeiter in SOS-Abdichtung-Arbeitskleidung mit Werkzeuggürtel und Dachbahn" },
  bohrung: { src: "/img/gallery/bohrung-injektion.webp", w: 679, h: 450, alt: "Handwerker bohrt mit dem Bohrhammer die Löcher für die Injektion in eine feuchte Wand" },
} as const;

export type ShotKey = keyof typeof SHOTS;

export default function BrandShot({
  shot,
  className = "",
  decorative = false,
}: {
  shot: ShotKey;
  className?: string;
  decorative?: boolean;
}) {
  const { src, w, h, alt } = SHOTS[shot];
  return (
    <span className={`brand-shot ${className}`} style={{ aspectRatio: `${w} / ${h}` }}>
      <img src={src} alt={decorative ? "" : alt} width={w} height={h} loading="lazy" decoding="async" />
    </span>
  );
}
