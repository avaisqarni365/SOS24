"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/** Chapter starts in /media/sos-reel.mp4 (seconds), as the editor cut it. */
const CHAPTERS = [
  { label: "Messen", at: 0 },
  { label: "Beraten", at: 2.3 },
  { label: "Abdichten", at: 3.75 },
  { label: "Übergabe", at: 8.45 },
  { label: "Kontakt", at: 10.55 },
];

type Conn = { saveData?: boolean; effectiveType?: string };

/**
 * The image film beside the hero: 13 seconds, no sound, 0.6 MB. Nothing is
 * downloaded until it is on screen. It plays by itself only on wide screens
 * where nobody asked for less data or less motion; phones get the poster
 * and a play button. A pause button is always there.
 */
export default function HeroFilm() {
  const video = useRef<HTMLVideoElement>(null);
  const box = useRef<HTMLElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    const v = video.current;
    const el = box.current;
    if (!v || !el) return;
    const conn = (navigator as Navigator & { connection?: Conn }).connection;
    const lean = !!conn?.saveData || /2g/.test(conn?.effectiveType ?? "");
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = matchMedia("(min-width: 1024px)").matches;
    const auto = wide && !lean && !calm;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (auto && !userPaused.current) {
            v.preload = "auto";
            v.play().catch(() => {});
          }
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    const onTime = () => {
      let i = 0;
      CHAPTERS.forEach((c, k) => {
        if (v.currentTime >= c.at) i = k;
      });
      setChapter(i);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      io.disconnect();
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = useCallback(() => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  }, []);

  const seek = useCallback((at: number) => {
    const v = video.current;
    if (!v) return;
    v.currentTime = at + 0.01;
    userPaused.current = false;
    v.play().catch(() => {});
  }, []);

  return (
    <figure ref={box} className="hero-film" aria-label="Imagefilm von SOS-Abdichtung">
      <div className="hero-film__frame">
        <video
          ref={video}
          className="hero-film__video"
          src="/media/sos-reel.mp4"
          poster="/media/sos-reel-poster.webp"
          width={432}
          height={768}
          muted
          loop
          playsInline
          preload="none"
          aria-label="Imagefilm ohne Ton: messen, beraten, abdichten, übergeben"
        />
        <button type="button" className="hero-film__toggle" onClick={toggle} aria-label={playing ? "Film anhalten" : "Film abspielen"}>
          {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        </button>
        <span className="hero-film__tag">Imagefilm</span>
        <span className={`hero-film__owner${chapter === CHAPTERS.length - 1 ? " is-hidden" : ""}`}>
          <img src="/img/gallery/shahzad-mahmood-160.webp" width={160} height={176} alt="" loading="lazy" />
          <span>
            <strong>Shahzad Mahmood</strong>
            Ihr Ansprechpartner
          </span>
        </span>
      </div>
      <figcaption className="hero-film__side">
        <span className="hero-film__k">So arbeiten wir · 13 Sekunden</span>
        <ol className="hero-film__chapters">
          {CHAPTERS.map((c, i) => (
            <li key={c.label}>
              <button type="button" aria-current={i === chapter ? "step" : undefined} onClick={() => seek(c.at)}>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                {c.label}
              </button>
            </li>
          ))}
        </ol>
        <span className="hero-film__who">
          <img src="/img/gallery/shahzad-mahmood-160.webp" width={160} height={176} alt="" loading="lazy" />
          <span>
            <strong>Shahzad Mahmood</strong>
            Ihr Ansprechpartner
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
