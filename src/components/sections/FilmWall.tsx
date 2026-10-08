"use client";

import { useCallback, useState } from "react";
import { Play, ArrowRight } from "lucide-react";
import QuickView from "@/components/ui/QuickView";
import type { Film } from "@/data/films";

export interface WallFilm extends Film {
  slug: string;
  href?: string;
}

/**
 * All image films as a wall of posters. Only the posters load (about
 * 15 KB each); a click opens the film large in the quick view and plays it.
 */
export default function FilmWall({ films }: { films: WallFilm[] }) {
  const [active, setActive] = useState<WallFilm | null>(null);
  const close = useCallback(() => setActive(null), []);

  return (
    <>
      <ul className="filmwall">
        {films.map((f) => (
          <li key={f.slug}>
            <button type="button" className="filmwall__card" onClick={() => setActive(f)} aria-haspopup="dialog">
              <span className="filmwall__poster">
                <img src={f.poster} alt="" width={432} height={768} loading="lazy" decoding="async" />
                <span className="filmwall__play" aria-hidden="true">
                  <Play />
                </span>
                <span className="filmwall__len">{f.seconds} s</span>
              </span>
              <span className="filmwall__title">{f.title}</span>
              <span className="filmwall__chapters">{f.chapters.map((c) => c.label).join(" · ")}</span>
            </button>
          </li>
        ))}
      </ul>

      <QuickView open={!!active} onClose={close} labelledBy="film-qv-title" wide>
        {active && (
          <div className="qv-film">
            <video
              className="qv-film__video"
              src={active.src}
              poster={active.poster}
              width={432}
              height={768}
              autoPlay
              muted
              loop
              playsInline
              controls
              aria-label={`Film ohne Ton: ${active.title}`}
            />
            <div className="qv-film__body">
              <p className="qv__k">Film · {active.seconds} Sekunden · ohne Ton</p>
              <h2 id="film-qv-title" className="qv__t">
                {active.title}
              </h2>
              <ol className="qv-film__chapters">
                {active.chapters.map((c, i) => (
                  <li key={c.label}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {c.label}
                  </li>
                ))}
              </ol>
              {active.href && (
                <div className="qv__actions">
                  <a href={active.href} className="qv__btn qv__btn--solid">
                    Zur Leistung
                    <ArrowRight aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </QuickView>
    </>
  );
}
