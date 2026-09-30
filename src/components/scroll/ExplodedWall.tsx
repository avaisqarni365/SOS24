"use client";

import { useEffect, useRef } from "react";
import { WALL_LAYERS } from "@/data/layers";

/**
 * 3D mode for the layers act. Only in cinematic mode (html.sc-js), only with
 * WebGL2, and three.js is imported when the section is ~1.5 viewports away,
 * so nothing 3D touches the first screen. Without any of that the static
 * poster and the ordered list stay as a normal document.
 */
export default function ExplodedWall() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const section = host?.closest<HTMLElement>(".layers");
    if (!host || !section) return;
    if (!document.documentElement.classList.contains("sc-js")) return;
    const probe = document.createElement("canvas");
    if (!probe.getContext("webgl2")) return;

    let disposed = false;
    let dispose: (() => void) | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        import("./wallScene").then(({ createWallScene }) => {
          if (disposed) return;
          section.classList.add("is-3d");
          dispose = createWallScene(host, section, WALL_LAYERS).dispose;
        }).catch(() => section.classList.remove("is-3d"));
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(section);
    return () => {
      disposed = true;
      io.disconnect();
      dispose?.();
      section.classList.remove("is-3d");
    };
  }, []);

  return <div ref={hostRef} className="layers__canvas" aria-hidden="true" />;
}
