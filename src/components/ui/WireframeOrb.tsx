"use client";

import React, { useEffect, useRef } from "react";

interface WireframeOrbProps {
  offsetY?: string;
  className?: string;
}

export default function WireframeOrb({ offsetY = "-16%", className = "" }: WireframeOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mathematical formula for the Kontai24 undulating sphere surface
    const radiusFunc = (theta: number, phi: number) =>
      1 +
      0.15 * Math.sin(2.1 * theta + 1.3) * Math.cos(1.7 * phi) +
      0.082 * Math.sin(3.7 * phi + 0.6) * Math.cos(2.9 * theta) +
      0.044 * Math.sin(5.3 * theta + 2.2) * Math.sin(4.1 * phi);

    const latSteps = 34;
    const lonSteps = 56;
    const totalVertices = latSteps * lonSteps;
    const rawCoords: number[] = [];

    for (let t = 0; t < latSteps; t++) {
      for (let a = 0; a < lonSteps; a++) {
        const theta = -1.34 + (2.68 * t) / (latSteps - 1);
        const phi = (2 * Math.PI * a) / lonSteps;
        const radius = 215 * radiusFunc(theta, phi);

        rawCoords.push(
          radius * Math.cos(theta) * Math.cos(phi),
          radius * Math.sin(theta),
          radius * Math.cos(theta) * Math.sin(phi)
        );
      }
    }

    const indexHelper = (r: number, c: number) => lonSteps * r + ((c + lonSteps) % lonSteps);
    const lineIndices: number[] = [];

    for (let r = 0; r < latSteps; r++) {
      for (let c = 0; c < lonSteps; c++) {
        lineIndices.push(indexHelper(r, c), indexHelper(r, c + 1));
        if (r < latSteps - 1) {
          lineIndices.push(indexHelper(r, c), indexHelper(r + 1, c));
          lineIndices.push(indexHelper(r, c), indexHelper(r + 1, c + 1));
        }
      }
    }

    // Mathematical and chemical moisture symbols for SOS-Abdichtung
    const symbols = [
      "H₂O", "WTA", "PLZ", "pH", "bar", "42", "Ø", "m³", "%", "Δt",
      "DIN", "MDS", "H₂O", "WTA", "42xxx", "cm", "kg", "λ", "kPa"
    ];

    const symbolPoints = symbols.map((sym, idx) => ({
      sym,
      idx: Math.floor((idx * totalVertices) / symbols.length) + (idx % 7)
    }));

    const projected = new Float32Array(3 * totalVertices);
    let rotY = 0.55;
    let isVisible = true;
    let lastTime = 0;
    let animId: number;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
    };

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const scale = Math.min(w, h) / 600;
      ctx.clearRect(0, 0, w, h);

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;

      for (let i = 0; i < totalVertices; i++) {
        const x0 = rawCoords[3 * i];
        const y0 = rawCoords[3 * i + 1];
        const z0 = rawCoords[3 * i + 2];

        const xRot = x0 * cosY - z0 * sinY;
        const zRot = x0 * sinY + z0 * cosY;
        const yTilt = 0.955336 * y0 - -0.29552 * zRot;

        projected[3 * i] = xRot;
        projected[3 * i + 1] = yTilt;
        projected[3 * i + 2] = zRot;

        if (xRot < minX) minX = xRot;
        if (xRot > maxX) maxX = xRot;
        if (yTilt < minY) minY = yTilt;
        if (yTilt > maxY) maxY = yTilt;
      }

      const centerX = w / 2 - ((minX + maxX) / 2) * scale;
      const centerY = h / 2 - ((minY + maxY) / 2) * scale;

      // Kontai24 radial gradient wireframe glow
      const grad = ctx.createRadialGradient(
        w / 2,
        h / 2,
        0.1 * Math.min(w, h),
        w / 2,
        h / 2,
        0.52 * Math.min(w, h)
      );
      grad.addColorStop(0, "rgba(214, 232, 226, 0.16)");
      grad.addColorStop(0.55, "rgba(228, 242, 237, 0.34)");
      grad.addColorStop(0.86, "rgba(243, 241, 236, 0.52)");
      grad.addColorStop(1, "rgba(243, 241, 236, 0)");

      ctx.beginPath();
      for (let i = 0; i < lineIndices.length; i += 2) {
        const idxA = 3 * lineIndices[i];
        const idxB = 3 * lineIndices[i + 1];
        ctx.moveTo(centerX + projected[idxA] * scale, centerY + projected[idxA + 1] * scale);
        ctx.lineTo(centerX + projected[idxB] * scale, centerY + projected[idxB + 1] * scale);
      }
      ctx.strokeStyle = grad;
      ctx.lineWidth = Math.max(0.45, 0.32 * scale);
      ctx.stroke();

      // Render floating symbols in 4 depth planes
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const maxRadius = 250;
      for (let layer = 0; layer < 4; layer++) {
        const norm = (layer + 0.5) / 4;
        ctx.font = `${Math.max(7, (8 + 7 * norm) * scale)}px ui-monospace, SFMono-Regular, monospace`;
        ctx.fillStyle = `rgba(243, 241, 236, ${(0.08 + 0.4 * norm).toFixed(3)})`;

        for (const pt of symbolPoints) {
          const pIdx = 3 * pt.idx;
          const zDepth = Math.min(3, Math.floor(((projected[pIdx + 2] + maxRadius) / (2 * maxRadius)) * 4));
          if (zDepth === layer) {
            ctx.fillText(pt.sym, centerX + projected[pIdx] * scale, centerY + projected[pIdx + 1] * scale);
          }
        }
      }
    };

    resize();
    render();

    const loop = (time: number) => {
      animId = requestAnimationFrame(loop);
      if (isVisible && !document.hidden) {
        if (time - lastTime >= 33) {
          rotY += (time - lastTime) * 0.00011;
          lastTime = time;
          render();
        }
      }
    };

    window.addEventListener("resize", () => {
      resize();
      render();
    });

    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-[min(72%,620px)] aspect-square"
        style={{ transform: `translateY(${offsetY})` }}
      />
    </div>
  );
}
