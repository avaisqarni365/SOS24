"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const WIDE = { src: "/media/hero-cine-wide.mp4", poster: "/media/hero-cine-wide.webp" };
const TALL = { src: "/media/hero-cine-tall.mp4", poster: "/media/hero-cine-tall.webp" };
/** portrait phones and tablets get the tall cut, everything else the wide one */
const PORTRAIT = "(max-aspect-ratio: 4/5)";

/**
 * The cinematic first frame: the image film runs silently behind the hero
 * heading. Landscape screens get the wide cut, portrait screens the tall
 * one; turning a tablet swaps them. iPhones refuse to start a video on
 * their own in Low Power Mode, so a refused start is retried on the first
 * touch or scroll. A small button pauses and plays it (and with "reduce
 * motion" the film waits for that button).
 */
export default function HeroCine() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const wanted = useRef(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // iOS starts a video by itself only when it is muted and inline
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "");

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) wanted.current = false;
    const mq = window.matchMedia(PORTRAIT);

    const start = () => {
      if (!wanted.current) return;
      v.play().catch(() => {
        /* refused (Low Power Mode): the first touch or scroll tries again */
      });
    };
    const load = () => {
      const cut = mq.matches ? TALL : WIDE;
      v.poster = cut.poster;
      if (!v.src.endsWith(cut.src)) {
        v.src = cut.src;
        v.load();
      }
      start();
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const retry = () => start();

    v.addEventListener("playing", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("canplay", retry);
    window.addEventListener("touchstart", retry, { passive: true });
    window.addEventListener("scroll", retry, { passive: true });
    document.addEventListener("visibilitychange", retry);
    mq.addEventListener?.("change", load);
    load();
    return () => {
      v.removeEventListener("playing", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("canplay", retry);
      window.removeEventListener("touchstart", retry);
      window.removeEventListener("scroll", retry);
      document.removeEventListener("visibilitychange", retry);
      mq.removeEventListener?.("change", load);
    };
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      wanted.current = true;
      v.play().catch(() => {});
    } else {
      wanted.current = false;
      v.pause();
    }
  };

  return (
    <>
      <div className="hero-cine" aria-hidden="true">
        <video ref={ref} className="hero-cine__v" muted loop playsInline preload="auto" poster={WIDE.poster} />
        <div className="hero-cine__shade" />
      </div>
      <button type="button" className="hero-cine__btn" onClick={toggle} aria-label={playing ? "Film anhalten" : "Film abspielen"}>
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>
    </>
  );
}
