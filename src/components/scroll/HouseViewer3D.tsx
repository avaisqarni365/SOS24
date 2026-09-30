"use client";

import { useEffect, useRef, useState } from "react";
import { Layers, Shovel, Warehouse, Sofa } from "lucide-react";
import type { SceneDef, SceneId } from "@/data/scenes3d";
import type { SceneViewer } from "./sceneViewer";

const ICONS: Record<SceneId, typeof Layers> = {
  "keller-innen": Layers,
  "keller-aussen": Shovel,
  garage: Warehouse,
  wohnraum: Sofa,
};

/**
 * "Jeder Ort, Schicht für Schicht": four cut-away places, each with its
 * treatment as steps. Every step first shows a light still picture (rendered
 * from the same model, with the step's layer labelled), so the section costs
 * one small image. The 360° model (three.js) loads only when the visitor asks
 * for it; then the scene turns, zooms and its layers can be picked.
 */
export default function HouseViewer3D({ scenes }: { scenes: SceneDef[] }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewer = useRef<SceneViewer | null>(null);
  const [ready, setReady] = useState(false);
  const [canGL, setCanGL] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touchUI, setTouchUI] = useState(false);
  const [touched, setTouched] = useState(false);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [layerId, setLayerId] = useState<string | null>(null);
  const def = scenes[sceneIdx];
  const step = def.steps[stepIdx];
  const layers = def.layers;
  const layer = layers.find((l) => l.id === (layerId ?? step.layer)) ?? layers[0];

  useEffect(() => {
    setCanGL(!!document.createElement("canvas").getContext("webgl2"));
    setTouchUI(window.matchMedia("(pointer: coarse)").matches);
    return () => {
      viewer.current?.dispose();
      viewer.current = null;
    };
  }, []);

  const load3d = () => {
    const host = hostRef.current;
    if (!host || viewer.current || loading) return;
    setLoading(true);
    import("./sceneViewer")
      .then(({ createSceneViewer }) => {
        viewer.current = createSceneViewer(host, {
          onPick: (id) => setLayerId(id),
          onInteract: () => setTouched(true),
        });
        setReady(true);
      })
      .catch(() => setCanGL(false))
      .finally(() => setLoading(false));
  };

  // a new scene (or the viewer becoming ready) loads the scene; steps and
  // layer picks follow
  useEffect(() => {
    viewer.current?.loadScene(def);
  }, [def, ready]);
  useEffect(() => {
    viewer.current?.setStep(step);
  }, [step, ready]);
  useEffect(() => {
    viewer.current?.select(layerId);
  }, [layerId, ready]);

  const pickScene = (i: number) => {
    setSceneIdx(i);
    setStepIdx(0);
    setLayerId(null);
  };
  const go = (i: number) => {
    setStepIdx((i + def.steps.length) % def.steps.length);
    setLayerId(null);
  };

  return (
    <div className="hv">
      <div className="hv__scenes" role="tablist" aria-label="Ort der Sanierung">
        {scenes.map((s, i) => {
          const Icon = ICONS[s.id];
          return (
            <button key={s.id} type="button" role="tab" aria-selected={i === sceneIdx} onClick={() => pickScene(i)}>
              <Icon aria-hidden="true" />
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="hv__body">
        <div className={`hv__stage theme-dark${ready ? " is-3d" : ""}`}>
          <div className="hv__poster">
            <img
              key={`${def.id}-${stepIdx}`}
              src={`/img/3d/${def.id}-${stepIdx + 1}-1280.webp`}
              srcSet={`/img/3d/${def.id}-${stepIdx + 1}-640.webp 640w, /img/3d/${def.id}-${stepIdx + 1}-1280.webp 1280w`}
              sizes="(max-width: 1023px) 92vw, 60vw"
              width={1280}
              height={900}
              alt={`${def.label}, Schritt ${stepIdx + 1}: ${step.title}. Im Bild markiert: ${
                (layers.find((l) => l.id === step.layer) ?? layers[0]).name
              }.`}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div ref={hostRef} className="hv__canvas" />
          <p className="hv__caption">
            <span>
              {stepIdx + 1}/{def.steps.length}
            </span>
            {step.title}
          </p>
          {!ready && canGL && (
            <button type="button" className="hv__load" onClick={load3d} disabled={loading}>
              <span aria-hidden="true">⟲</span>
              {loading ? "3D-Modell lädt …" : "In 3D drehen (360°)"}
            </button>
          )}
          {ready && (
            <>
              <p className={`hv__hint${touched ? " is-gone" : ""}`} aria-hidden="true">
                <span className="hv__hint-icon">⟲</span> {touchUI ? "1 Finger: drehen · 2 Finger: zoomen" : "Ziehen: drehen · Mausrad oder +/−: zoomen"}
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
          <div className="hv__scene-intro">
            <h3>{def.title}</h3>
            <p>{def.intro}</p>
          </div>
          <ol className="hv__steps" aria-label={`Ablauf: ${def.title}`} style={{ ["--n" as string]: def.steps.length }}>
            {def.steps.map((s, i) => (
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
              Schritt {stepIdx + 1} von {def.steps.length}
            </p>
            <h4>{step.title}</h4>
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
                {stepIdx === def.steps.length - 1 ? "Von vorn" : "Weiter"} <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          <div className="hv__layers">
            <p className="hv__kicker">Die Schichten, von außen nach innen</p>
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
            <a className="hv__more" href={def.service.href}>
              Mehr zur Leistung: {def.service.label} <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
