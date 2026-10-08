"use client";

import { useCallback, useState } from "react";
import { ArrowRight } from "lucide-react";
import BrandShot, { type ShotKey } from "@/components/brand/BrandShot";
import QuickView from "@/components/ui/QuickView";

export interface BrandGalleryItem {
  shot: ShotKey;
  title: string;
  note: string;
  detail: string;
}

/** The van and the crew; a click shows the picture large with its story. */
export default function BrandGallery({ items }: { items: BrandGalleryItem[] }) {
  const [active, setActive] = useState<BrandGalleryItem | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <>
      <ul className="brand-gallery" aria-label="SOS Abdichtung im Einsatz">
        {items.map((g) => (
          <li key={g.shot} className={`brand-gallery__item brand-gallery__item--${g.shot}`}>
            <button
              type="button"
              className="brand-gallery__btn"
              onClick={() => setActive(g)}
              aria-haspopup="dialog"
              aria-label={`${g.title}: größer ansehen`}
            >
              <BrandShot shot={g.shot} decorative />
              <span className="brand-gallery__cap" aria-hidden="true">
                <strong>{g.title}</strong>
                <span>{g.note}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <QuickView open={!!active} onClose={close} labelledBy="brand-qv-title" wide>
        {active && (
          <div className="qv-photo">
            <BrandShot shot={active.shot} className="qv-photo__img" />
            <div className="qv-photo__body">
              <p className="qv__k">SOS Abdichtung im Einsatz</p>
              <h2 id="brand-qv-title" className="qv__t">
                {active.title}
              </h2>
              <p className="qv__lead">{active.detail}</p>
              <div className="qv__actions">
                <a href="/#kontakt" className="qv__btn qv__btn--solid" onClick={close}>
                  Termin vereinbaren
                  <ArrowRight aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        )}
      </QuickView>
    </>
  );
}
