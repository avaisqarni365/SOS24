"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { REEL, SERVICE_FILMS } from "@/data/films";

/**
 * The playlist, all upright films: first the inspection, then every film of
 * the gallery one by one, and from the top again. `skip` jumps over a stretch
 * of a film ([from, to], seconds): in the inspection, the shots of the red
 * injection packers right after the drilling.
 */
const FILMS: { src: string; skip?: [number, number] }[] = [
  { src: "/media/hero-cine-tall.mp4", skip: [5.4, 6.5] },
  { src: REEL.src },
  ...Object.values(SERVICE_FILMS).map((f) => ({ src: f.src })),
];
const POSTER = "/media/hero-cine-tall.webp";

/**
 * The cinematic first frame: two films run silently, one after the other,
 * behind the hero heading. They are upright, so phones show them full-bleed; wide screens show them
 * sharp in a portrait frame on the right, with the same film softly blurred
 * as the backdrop (a 432px-wide film stretched over a desktop would blur by
 * itself). Both videos are written into the page the way iPhones start one
 * by themselves (autoplay, muted, playsinline), so they run before any
 * script. The script only steps in where a browser holds them back: it
 * retries on the first real tap (iOS Low Power Mode allows playback only
 * from a tap) and drives the pause / play button.
 */
export default function HeroCine() {
  const back = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const wanted = useRef(true);

  useEffect(() => {
    const vids = [back.current, frame.current].filter((v): v is HTMLVideoElement => !!v);
    if (!vids.length) return;
    vids.forEach((v) => {
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
    });

    const start = () => {
      if (!wanted.current) return;
      vids.forEach((v) => {
        if (v.paused) v.play().catch(() => {
          /* held back (Low Power Mode): the next tap tries again */
        });
      });
    };
    const onPlay = () => setPlaying(true);
    const onPause = (e: Event) => {
      // the end of one film is not a pause: the next one follows
      if (!(e.target as HTMLVideoElement).ended) setPlaying(vids.some((v) => !v.paused));
    };
    const onTap = () => start();
    // one film after the other, endlessly; each video keeps its own place in the list
    const next = (v: HTMLVideoElement) => {
      const i = (Number(v.dataset.film || 0) + 1) % FILMS.length;
      v.dataset.film = String(i);
      v.src = FILMS[i].src;
      v.play().catch(() => {});
    };
    const onEnded = (e: Event) => next(e.target as HTMLVideoElement);
    // jump over a film's `skip` stretch; checked on every frame where the
    // browser can (requestVideoFrameCallback), so no skipped frame shows
    const jump = (v: HTMLVideoElement) => {
      const skip = FILMS[Number(v.dataset.film || 0)].skip;
      if (skip && v.currentTime >= skip[0] && v.currentTime < skip[1]) v.currentTime = skip[1];
    };
    const onTime = (e: Event) => jump(e.target as HTMLVideoElement);
    type FrameVideo = HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number };
    let alive = true;
    vids.forEach((v) => {
      const fv = v as FrameVideo;
      if (!fv.requestVideoFrameCallback) return;
      const tick = () => {
        if (!alive) return;
        jump(v);
        fv.requestVideoFrameCallback!(tick);
      };
      fv.requestVideoFrameCallback(tick);
    });

    vids.forEach((v) => {
      v.addEventListener("ended", onEnded);
      v.addEventListener("timeupdate", onTime);
      v.addEventListener("playing", onPlay);
      v.addEventListener("pause", onPause);
      v.addEventListener("loadeddata", start);
      v.addEventListener("canplay", start);
    });
    // touchend and click count as a tap for iOS playback; touchstart and scroll do not
    window.addEventListener("touchend", onTap, { passive: true });
    window.addEventListener("click", onTap);
    window.addEventListener("scroll", onTap, { passive: true });
    document.addEventListener("visibilitychange", onTap);
    if (vids.some((v) => !v.paused)) setPlaying(true);
    start();
    return () => {
      alive = false;
      vids.forEach((v) => {
        v.removeEventListener("ended", onEnded);
        v.removeEventListener("timeupdate", onTime);
        v.removeEventListener("playing", onPlay);
        v.removeEventListener("pause", onPause);
        v.removeEventListener("loadeddata", start);
        v.removeEventListener("canplay", start);
      });
      window.removeEventListener("touchend", onTap);
      window.removeEventListener("click", onTap);
      window.removeEventListener("scroll", onTap);
      document.removeEventListener("visibilitychange", onTap);
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vids = [back.current, frame.current].filter((v): v is HTMLVideoElement => !!v);
    if (vids.every((v) => v.paused)) {
      wanted.current = true;
      vids.forEach((v) => v.play().catch(() => {}));
    } else {
      wanted.current = false;
      vids.forEach((v) => v.pause());
    }
  };

  const film = (ref: React.RefObject<HTMLVideoElement>, className: string) => (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      playsInline
      preload="auto"
      poster={POSTER}
      disablePictureInPicture
      disableRemotePlayback
      src={FILMS[0].src}
      data-film="0"
    />
  );

  return (
    <>
      <div className="hero-cine" aria-hidden="true">
        {film(back, "hero-cine__v")}
        <div className="hero-cine__shade" />
      </div>
      <div className="hero-cine__frame" aria-hidden="true">
        {film(frame, "hero-cine__fv")}
      </div>
      <button type="button" className="hero-cine__btn" onClick={toggle} aria-label={playing ? "Film anhalten" : "Film abspielen"}>
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>
    </>
  );
}
