"use client";

import { useEffect, useRef, useState } from "react";
import type { WallLayer } from "@/data/layers";
import type { ProcedureStep } from "@/data/procedure";
import type { HouseViewer } from "./houseViewer";

/**
 * The interactive house: the visitor turns it 360°, zooms, walks through the
 * procedure and picks layers. three.js loads when the section is near the
 * viewport; until then (and without WebGL) the static cross-section poster
 * stands in, and every step and layer stays readable as normal text.
 */
export default function HouseViewer3D({
  steps,
  layers,
  poster,
}: {
  steps: ProcedureStep[];
  layers: WallLayer[];
  poster: React.ReactNode;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewer = useRef<HouseViewer | null>(null);
  const [ready, setReady] = useState(false);
  const [touched, setTouched] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [layerId, setLayerId] = useState<string | null>(null);
  const step = steps[stepIdx];
  const layer = layers.find((l) => l.id === (layerId ?? step.layer)) ?? layers[0];

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const probe = document.createElement("canvas");
    if (!probe.getContext("webgl2")) return;
    let disposed = false;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        import("./houseViewer")
          .then(({ createHouseViewer }) => {
            if (disposed) return;
            viewer.current = createHouseViewer(host, {
              layers,
              initial: steps[0],
              onPick: (id) => setLayerId(id),
              onInteract: () => setTouched(true),
            });
            setReady(true);
          })
          .catch(() => setReady(false));
      },
      { rootMargin: "120% 0px" }
    );
    io.observe(host);
    return () => {
      disposed = true;
      io.disconnect();
      viewer.current?.dispose();
      viewer.current = null;
    };
    // mount once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    viewer.current?.setStep(step);
  }, [step, ready]);
  useEffect(() => {
    viewer.current?.select(layerId);
  }, [layerId, ready]);

  const go = (i: number) => {
    setStepIdx((i + steps.length) % steps.length);
    setLayerId(null);
  };

  return (
    <div className="hv">
      <div className={`hv__stage theme-dark${ready ? " is-3d" : ""}`}>
        <div className="hv__poster">{poster}</div>
        <div ref={hostRef} className="hv__canvas" />
        {ready && (
          <>
            <p className={`hv__hint${touched ? " is-gone" : ""}`} aria-hidden="true">
              <span className="hv__hint-icon">⟲</span> 360° drehen: ziehen
            </p>
            <div className="hv__tools">
              <button type="button" onClick={() => viewer.current?.zoom(0.8)} aria-label="Heranzoomen">
                +
              </button>
              <button type="button" onClick={() => viewer.current?.zoom(1.25)} aria-label="Herauszoomen">
                −
              </button>
              <button type="button" onClick={() => viewer.current?.reset()} aria-label="Ansicht zurücksetzen">
                ⟲
              </button>
            </div>
          </>
        )}
      </div>

      <div className="hv__panel">
        <ol className="hv__steps" aria-label="Ablauf der Sanierung">
          {steps.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                aria-pressed={i === stepIdx}
                aria-label={`Schritt ${i + 1}: ${s.title}`}
                title={s.title}
                onClick={() => go(i)}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ol>

        <div className="hv__step" aria-live="polite">
          <p className="hv__kicker">
            Schritt {stepIdx + 1} von {steps.length}
          </p>
          <h3>{step.title}</h3>
          <p className="hv__material">
            <span>Material</span>
            {step.material}
          </p>
          <p className="hv__text">{step.text}</p>
          <div className="hv__nav">
            <button type="button" onClick={() => go(stepIdx - 1)}>
              <span aria-hidden="true">←</span> Zurück
            </button>
            <button type="button" className="is-primary" onClick={() => go(stepIdx + 1)}>
              {stepIdx === steps.length - 1 ? "Von vorn" : "Weiter"} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="hv__layers">
          <p className="hv__kicker">Die Schichten der Kellerwand, von außen nach innen</p>
          <ul>
            {layers.map((l, i) => (
              <li key={l.id}>
                <button
                  type="button"
                  aria-pressed={layer.id === l.id}
                  onClick={() => setLayerId(l.id)}
                  style={{ ["--swatch" as string]: l.color }}
                >
                  <span className="hv__num">{i + 1}</span>
                  {l.name}
                </button>
              </li>
            ))}
          </ul>
          <p className="hv__layer-text">
            <strong>{layer.name}:</strong> {layer.text}
          </p>
        </div>
      </div>
    </div>
  );
}
