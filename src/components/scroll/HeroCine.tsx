"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

const WIDE = { src: "/media/hero-cine-wide.mp4", poster: "/media/hero-cine-wide.webp" };
const TALL = { src: "/media/hero-cine-tall.mp4", poster: "/media/hero-cine-tall.webp" };
/** portrait phones and tablets get the tall cut, everything else the wide one */
const PORTRAIT = "(max-aspect-ratio: 4/5)";

/**
 * The cinematic first frame: the image film runs silently behind the hero
 * heading. The video is written into the page the way iPhones start one by
 * themselves (autoplay, muted, playsinline, both cuts as <source> with a
 * media query), so it runs before any script. The script only steps in
 * where a browser holds it back: it retries on the first real tap (iOS
 * Low Power Mode allows playback only from a tap), swaps the cut when a
 * tablet turns, and drives the pause / play button.
 */
export default function HeroCine() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const wanted = useRef(true);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    const mq = window.matchMedia(PORTRAIT);

    const start = () => {
      if (!wanted.current || !v.paused) return;
      v.play().catch(() => {
        /* held back (Low Power Mode): the next tap tries again */
      });
    };
    // a browser that ignores <source media> or a tablet that turns: set the right cut
    const fit = () => {
      const cut = mq.matches ? TALL : WIDE;
      v.poster = cut.poster;
      if (v.currentSrc && !v.currentSrc.endsWith(cut.src)) {
        v.src = cut.src;
        v.load();
      }
      start();
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTap = () => start();

    v.addEventListener("playing", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("loadeddata", start);
    v.addEventListener("canplay", start);
    // touchend and click count as a tap for iOS playback; touchstart and scroll do not
    window.addEventListener("touchend", onTap, { passive: true });
    window.addEventListener("click", onTap);
    window.addEventListener("scroll", onTap, { passive: true });
    document.addEventListener("visibilitychange", onTap);
    mq.addEventListener?.("change", fit);
    if (!v.paused) setPlaying(true);
    fit();
    return () => {
      v.removeEventListener("playing", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("loadeddata", start);
      v.removeEventListener("canplay", start);
      window.removeEventListener("touchend", onTap);
      window.removeEventListener("click", onTap);
      window.removeEventListener("scroll", onTap);
      document.removeEventListener("visibilitychange", onTap);
      mq.removeEventListener?.("change", fit);
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        <video
          ref={ref}
          className="hero-cine__v"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={WIDE.poster}
          disablePictureInPicture
          disableRemotePlayback
        >
          <source src={TALL.src} type="video/mp4" media={PORTRAIT} />
          <source src={WIDE.src} type="video/mp4" />
        </video>
        <div className="hero-cine__shade" />
      </div>
      <button type="button" className="hero-cine__btn" onClick={toggle} aria-label={playing ? "Film anhalten" : "Film abspielen"}>
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>
    </>
  );
}
