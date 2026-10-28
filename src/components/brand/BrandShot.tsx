/**
 * Real pictures only: the service van with the company wordmark, and photos
 * of real jobs with real tools (drilling, crack sealing, rendering). No
 * generated crew pictures.
 */
export const SHOTS = {
  van: { src: "/img/brand/servicewagen.webp?v=3", w: 432, h: 300, alt: "Servicewagen von SOS-Abdichtung mit Firmenlogo vor einem Wohnhaus" },
  risse: { src: "/img/sp/risse-abdichten-kellerboden-320.webp", w: 320, h: 213, alt: "Handwerker schließt einen Riss im Kellerboden mit der Kelle" },
  spachteln: { src: "/img/sp/sanierputz-spachteln-320.webp", w: 320, h: 213, alt: "Sanierputz wird mit der Glättkelle auf die Wand gezogen" },
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
