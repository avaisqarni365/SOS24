"use client";

import { useEffect, useRef, useState } from "react";
import type { Film } from "@/data/films";

/**
 * The film of a watch page: large, with controls, the poster until it plays.
 * `?t=<seconds>` in the address starts it at that point (Google's "key
 * moments" link there), and every chapter below the film jumps to its start.
 */
export default function FilmPlayer({ film, title }: { film: Film; title: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const [chapter, setChapter] = useState(0);

  const seek = (at: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = at;
    v.play().catch(() => {});
  };

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const t = Number(new URLSearchParams(location.search).get("t"));
    if (t > 0 && t < film.seconds) {
      const go = () => (v.currentTime = t);
      if (v.readyState >= 1) go();
      else v.addEventListener("loadedmetadata", go, { once: true });
    }
    const onTime = () => {
      let i = 0;
      film.chapters.forEach((c, n) => {
        if (v.currentTime >= c.at) i = n;
      });
      setChapter(i);
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [film]);

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,432px)_1fr] md:items-start">
      <video
        ref={video}
        className="w-full rounded-3xl border border-line/12 bg-black shadow-lg"
        src={film.src}
        poster={film.poster}
        width={432}
        height={768}
        controls
        muted
        playsInline
        preload="metadata"
        aria-label={`Film ohne Ton: ${title}`}
      />
      <div>
        <p className="sc-label text-accent-deep font-bold">Kapitel</p>
        <ol className="mt-4 grid gap-2">
          {film.chapters.map((c, i) => (
            <li key={c.label}>
              <button
                type="button"
                onClick={() => seek(c.at)}
                aria-current={i === chapter ? "step" : undefined}
                className={`flex w-full min-h-[48px] items-center gap-4 rounded-2xl border px-4 text-left font-semibold transition-colors ${
                  i === chapter ? "border-accent-deep bg-surface text-ink" : "border-line/12 bg-surface-2 text-ink hover:border-accent-deep/50"
                }`}
              >
                <span className="font-mono text-xs text-accent-deep">{`0:${String(Math.floor(c.at)).padStart(2, "0")}`}</span>
                {c.label}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
