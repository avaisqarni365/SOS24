/**
 * A region of the brand sheet, shown as a photo.
 *
 * The client's brand sheet is one 1536x1024 image holding the van, the
 * uniforms and the work scenes. Rather than cutting it into separate files,
 * each shot is a window onto that one image: the browser fetches and caches
 * it once, and every tile on the site reuses it. The crops were measured on
 * the sheet itself and stop short of its text ribbons, storyboard labels,
 * the placeholder phone number and the testimonial panel.
 */
const SHEET = { src: "/img/brand/brand-sheet.webp", w: 1536, h: 1024 };

export const SHOTS = {
  van: { x: 470, y: 64, w: 540, h: 296, alt: "Servicewagen von SOS Abdichtung mit Logo vor einem Neubau" },
  roofer: { x: 1018, y: 64, w: 300, h: 446, alt: "Mitarbeiter in SOS-Abdichtung-Arbeitskleidung verschweißt eine Bitumenbahn auf dem Flachdach" },
  wall: { x: 150, y: 652, w: 305, h: 204, alt: "Mitarbeiter in SOS-Abdichtung-Arbeitskleidung trägt Abdichtung mit der Rolle auf eine Wand auf" },
  walker: { x: 1338, y: 560, w: 198, h: 302, alt: "Mitarbeiter in SOS-Abdichtung-Arbeitskleidung mit Werkzeuggürtel und Dachbahn" },
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
  const { x, y, w, h, alt } = SHOTS[shot];
  return (
    <span className={`brand-shot ${className}`} style={{ aspectRatio: `${w} / ${h}` }}>
      <img
        src={SHEET.src}
        alt={decorative ? "" : alt}
        width={SHEET.w}
        height={SHEET.h}
        loading="lazy"
        decoding="async"
        style={{
          width: `${(SHEET.w / w) * 100}%`,
          left: `${(-x / w) * 100}%`,
          top: `${(-y / h) * 100}%`,
        }}
      />
    </span>
  );
}
