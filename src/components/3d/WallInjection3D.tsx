"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Droplets, ShieldCheck, CheckCircle2, ChevronRight, Layers, Eye } from "lucide-react";

interface PhaseInfo {
  step: number;
  title: string;
  badge: string;
  moisture: string;
  desc: string;
}

const PHASES: PhaseInfo[] = [
  {
    step: 1,
    title: "Kapillare Durchfeuchtung",
    badge: "STATUS: DURCHFEUCHTET",
    moisture: "92% Feuchtegehalt",
    desc: "Bodenwasser steigt durch Mikroporen im Ziegelmauerwerk kapillar nach oben. Folge: Abplatzender Putz, Salzkristalle und Schimmelgefahr in Wuppertaler Hanglagen."
  },
  {
    step: 2,
    title: "Präzisions-Bohrlochkette",
    badge: "SCHRITT 1: BOHRUNG",
    moisture: "85% Feuchtegehalt",
    desc: "Bohrung im 60°-Winkel im Sockelbereich (Abstand ca. 10–12 cm). Spezial-Injektionspacker werden staubfrei montiert."
  },
  {
    step: 3,
    title: "Chemische Silan-Injektion",
    badge: "SCHRITT 2: INJEKTION",
    moisture: "44% Verdrängung",
    desc: "Hochviskose Silan-/Siloxan-Mikroemulsion wird drucklos injiziert. Die Moleküle durchdringen das Kapillarnetz und verdrängen das Wasser aktiv."
  },
  {
    step: 4,
    title: "Permanente Horizontalsperre",
    badge: "ERGEBNIS: 10 J. GARANTIE",
    moisture: "< 6% Trocken",
    desc: "Die hydrophobe Barriere ist lückenlos geschlossen. Kein Wasser kann mehr aufsteigen. Das Ziegelmauerwerk trocknet dauerhaft aus."
  }
];

export default function WallInjection3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isExploded, setIsExploded] = useState<boolean>(false);

  const threeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    bricks: THREE.Mesh[];
    diffusers: THREE.Mesh[];
    packers: THREE.Mesh[];
    waterPlane: THREE.Mesh;
    barrierMesh: THREE.Mesh;
    particles: THREE.Points;
    foundation: THREE.Mesh;
    soil: THREE.Mesh;
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dark cyberpunk / Kontai24 scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0e14); // kontai24 dark theme

    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(4.8, 3.2, 6.4);
    camera.lookAt(0, 0.7, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Atmospheric Lights
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
    scene.add(ambientLight);

    const cyanSpot = new THREE.SpotLight(0x00f0ff, 3.5, 20, Math.PI / 4, 0.5);
    cyanSpot.position.set(2, 6, 4);
    cyanSpot.castShadow = true;
    scene.add(cyanSpot);

    const blueBacklight = new THREE.DirectionalLight(0x0284c7, 2.2);
    blueBacklight.position.set(-4, -1, -3);
    scene.add(blueBacklight);

    // Grid Floor Plane (Kontai24 tech grid)
    const gridHelper = new THREE.GridHelper(10, 20, 0x0ea5e9, 0x1e293b);
    gridHelper.position.y = -0.85;
    scene.add(gridHelper);

    // Concrete Foundation (Bodenplatte)
    const foundationGeo = new THREE.BoxGeometry(4.6, 0.4, 2.0);
    const foundationMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.2
    });
    const foundation = new THREE.Mesh(foundationGeo, foundationMat);
    foundation.position.set(0, -0.2, 0);
    foundation.receiveShadow = true;
    scene.add(foundation);

    // Soil / Ground Base
    const soilGeo = new THREE.BoxGeometry(5.0, 0.3, 2.4);
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.9
    });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.set(0, -0.55, 0);
    scene.add(soil);

    // Ground Moisture Plane (Electric Glowing Blue)
    const waterGeo = new THREE.PlaneGeometry(4.8, 2.2);
    const waterMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const waterPlane = new THREE.Mesh(waterGeo, waterMat);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.set(0, -0.38, 0);
    scene.add(waterPlane);

    // Brick Wall (Ziegelmauerwerk)
    const bricks: THREE.Mesh[] = [];
    const rows = 7;
    const cols = 8;
    const brickW = 0.44;
    const brickH = 0.21;
    const brickD = 0.34;
    const mortar = 0.035;

    const brickGeo = new THREE.BoxGeometry(brickW, brickH, brickD);
    const startX = -((cols * (brickW + mortar)) / 2) + brickW / 2;

    for (let r = 0; r < rows; r++) {
      const isOdd = r % 2 === 1;
      const offsetX = isOdd ? brickW * 0.5 : 0;

      for (let c = 0; c < cols; c++) {
        const posX = startX + c * (brickW + mortar) + (isOdd && c === cols - 1 ? -brickW * 0.5 : offsetX);
        const posY = r * (brickH + mortar) + brickH / 2;

        const brickMat = new THREE.MeshStandardMaterial({
          color: 0xc26a35, // dry terracotta brick
          roughness: 0.8,
          metalness: 0.1
        });

        const brick = new THREE.Mesh(brickGeo, brickMat);
        brick.position.set(posX, posY, 0);
        brick.castShadow = true;
        brick.receiveShadow = true;
        scene.add(brick);
        bricks.push(brick);
      }
    }

    // Drill holes and injection packers
    const packers: THREE.Mesh[] = [];
    const packerGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.42, 16);
    const packerMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.1
    });

    const numHoles = 6;
    const holeSpacing = 3.2 / (numHoles - 1);
    for (let i = 0; i < numHoles; i++) {
      const p = new THREE.Mesh(packerGeo, packerMat);
      p.rotation.x = Math.PI / 3;
      p.position.set(-1.6 + i * holeSpacing, 0.24, 0.18);
      p.visible = false;
      scene.add(p);
      packers.push(p);
    }

    // Chemical Diffusion Spheres
    const diffusers: THREE.Mesh[] = [];
    const diffGeo = new THREE.SphereGeometry(0.38, 20, 20);
    const diffMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.7,
      roughness: 0.2
    });

    for (let i = 0; i < numHoles; i++) {
      const d = new THREE.Mesh(diffGeo, diffMat.clone());
      d.position.set(-1.6 + i * holeSpacing, 0.22, 0);
      d.scale.set(0.01, 0.01, 0.01);
      d.visible = false;
      scene.add(d);
      diffusers.push(d);
    }

    // Continuous Horizontal Chemical Barrier
    const barrierGeo = new THREE.BoxGeometry(3.9, 0.15, 0.42);
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
      metalness: 0.5
    });
    const barrierMesh = new THREE.Mesh(barrierGeo, barrierMat);
    barrierMesh.position.set(0, 0.24, 0);
    barrierMesh.visible = false;
    scene.add(barrierMesh);

    // Rising Damp Particle Points
    const particleCount = 75;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 3.6;
      particlePositions[i + 1] = Math.random() * 1.4;
      particlePositions[i + 2] = (Math.random() - 0.5) * 0.4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.045,
      transparent: true,
      opacity: 0.7
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    threeRef.current = {
      scene,
      camera,
      renderer,
      bricks,
      diffusers,
      packers,
      waterPlane,
      barrierMesh,
      particles,
      foundation,
      soil
    };

    // Mouse Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let angle = 0.5;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      angle += delta * 0.008;
      const radius = 7.2;
      camera.position.x = Math.sin(angle) * radius;
      camera.position.z = Math.cos(angle) * radius;
      camera.lookAt(0, 0.7, 0);
    };
    const onMouseUp = () => { isDragging = false; };

    // Touch Interaction
    let prevTouchX = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) prevTouchX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const delta = e.touches[0].clientX - prevTouchX;
        prevTouchX = e.touches[0].clientX;
        angle += delta * 0.008;
        const radius = 7.2;
        camera.position.x = Math.sin(angle) * radius;
        camera.position.z = Math.cos(angle) * radius;
        camera.lookAt(0, 0.7, 0);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationId: number;
    let clock = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock += 0.02;

      // Rising damp animation
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        pos[i] += 0.006;
        if (pos[i] > 1.5) pos[i] = 0;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Subtle atmospheric camera float
      if (!isDragging) {
        camera.position.y = 3.2 + Math.sin(clock * 0.4) * 0.08;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      dom.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  // Update scene based on active step
  useEffect(() => {
    if (!threeRef.current) return;
    const { bricks, diffusers, packers, barrierMesh, particles } = threeRef.current;

    // STEP 1: Nasse Wand
    if (activeStep === 1) {
      packers.forEach(p => (p.visible = false));
      diffusers.forEach(d => (d.visible = false));
      barrierMesh.visible = false;
      particles.visible = true;

      bricks.forEach(brick => {
        const y = brick.position.y;
        const mat = brick.material as THREE.MeshStandardMaterial;
        if (y < 0.6) {
          mat.color.setHex(0x0f2b48); // dark damp blue
        } else if (y < 1.0) {
          mat.color.setHex(0x1e3a5f);
        } else {
          mat.color.setHex(0x475569);
        }
      });
    }

    // STEP 2: Bohrung
    if (activeStep === 2) {
      packers.forEach(p => (p.visible = true));
      diffusers.forEach(d => (d.visible = false));
      barrierMesh.visible = false;
      particles.visible = true;

      bricks.forEach(brick => {
        const y = brick.position.y;
        const mat = brick.material as THREE.MeshStandardMaterial;
        if (y < 0.6) mat.color.setHex(0x133e68);
        else mat.color.setHex(0x475569);
      });
    }

    // STEP 3: Injektion
    if (activeStep === 3) {
      packers.forEach(p => (p.visible = true));
      diffusers.forEach(d => {
        d.visible = true;
        d.scale.set(1.25, 1.1, 1.25);
      });
      barrierMesh.visible = false;
      particles.visible = false;

      bricks.forEach(brick => {
        const y = brick.position.y;
        const mat = brick.material as THREE.MeshStandardMaterial;
        if (y < 0.4) mat.color.setHex(0x0284c7);
        else mat.color.setHex(0x8a4622); // starts drying
      });
    }

    // STEP 4: Trockene Wand
    if (activeStep === 4) {
      packers.forEach(p => (p.visible = false));
      diffusers.forEach(d => (d.visible = false));
      barrierMesh.visible = true;
      particles.visible = false;

      bricks.forEach(brick => {
        const y = brick.position.y;
        const mat = brick.material as THREE.MeshStandardMaterial;
        if (y < 0.25) {
          mat.color.setHex(0x0284c7);
        } else {
          mat.color.setHex(0xc26a35); // healthy warm terracotta brick
        }
      });
    }
  }, [activeStep]);

  // Exploded View handler (Separates layers in 3D space like ai-ranking-scroll-seo)
  useEffect(() => {
    if (!threeRef.current) return;
    const { bricks, barrierMesh, packers, foundation, soil } = threeRef.current;

    const explodeOffset = isExploded ? 0.45 : 0;

    // Move foundation & soil downward
    foundation.position.y = -0.2 - explodeOffset * 0.8;
    soil.position.y = -0.55 - explodeOffset * 1.5;

    // Separate upper bricks
    bricks.forEach(brick => {
      const origY = brick.userData.origY ?? brick.position.y;
      brick.userData.origY = origY;
      if (origY > 0.4) {
        brick.position.y = origY + explodeOffset;
      }
    });

    if (barrierMesh) {
      barrierMesh.position.y = 0.24 + (isExploded ? 0.1 : 0);
    }
  }, [isExploded]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev >= 4 ? 1 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentPhase = PHASES[activeStep - 1];

  return (
    <div className="w-full bg-dark-850 rounded-3xl border border-white/10 shadow-card-dark overflow-hidden">
      {/* Top HUD Telemetry Bar */}
      <div className="px-6 py-4 bg-dark-900/90 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Droplets className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-wide">
                3D-Funktionsmodell: Horizontalsperre
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                WTA 4-4-04
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interaktive Mauerwerks-Querschnittsdiagnose mit chemischer Diffusionssimulation
            </p>
          </div>
        </div>

        {/* Action Controls & Telemetry Readout */}
        <div className="flex items-center gap-2.5">
          {/* Exploded View Toggle (Inspired by ai-ranking-scroll-seo) */}
          <button
            onClick={() => setIsExploded(!isExploded)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
              isExploded
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/60 shadow-glow-cyan-sm"
                : "bg-dark-800 text-slate-300 border-white/10 hover:border-white/20"
            }`}
            title="Schichten in 3D trennen (Explosionsmodell)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isExploded ? "Schichten zusammenfügen" : "Schichten explodieren"}</span>
          </button>

          <div className="px-3 py-1.5 rounded-xl bg-dark-800 border border-white/10 flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Feuchte:</span>
            <span className={`font-bold ${activeStep === 4 ? "text-emerald-400" : activeStep === 3 ? "text-cyan-400" : "text-blue-400"}`}>
              {currentPhase.moisture}
            </span>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-800 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isPlaying ? "Pause" : "Play"}</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        <div className="lg:col-span-8 relative min-h-[380px] sm:min-h-[460px] bg-dark-950 cursor-grab active:cursor-grabbing">
          <div ref={containerRef} className="w-full h-full absolute inset-0" />

          {/* Floating Rotate Guide Badge */}
          <div className="absolute top-4 left-4 pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-900/80 backdrop-blur-sm border border-white/10 text-[11px] text-slate-400 font-mono shadow-sm">
              <RotateCcw className="w-3 h-3 text-cyan-400" />
              <span>360° drehen mit Maus / Touch</span>
            </div>
          </div>

          {/* Current Step Watermark Badge */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none font-mono">
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-dark-900/90 backdrop-blur-md border border-cyan-500/30 text-cyan-300 shadow-glow-cyan-sm">
              {currentPhase.badge}
            </span>
            <span className="text-[11px] text-slate-400 bg-dark-900/80 px-2.5 py-1 rounded-lg border border-white/10">
              PHASE {activeStep} / 4
            </span>
          </div>
        </div>

        {/* Phase Details & Technical Specs Sidebar */}
        <div className="lg:col-span-4 p-6 sm:p-7 bg-dark-900 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-wider">
              {currentPhase.badge}
            </span>
            <h4 className="text-xl font-bold text-white mt-1">
              {currentPhase.title}
            </h4>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {currentPhase.desc}
            </p>

            {/* Kontai24-style Technical Telemetry Specs */}
            <div className="mt-6 space-y-2.5 pt-4 border-t border-white/10 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-dark-800/80 border border-white/5">
                <span className="text-slate-400">Verfahren:</span>
                <span className="text-white font-semibold">Drucklose Injektion</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-dark-800/80 border border-white/5">
                <span className="text-slate-400">Wirkstoff:</span>
                <span className="text-cyan-300 font-semibold">Silan-Mikroemulsion</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-dark-800/80 border border-white/5">
                <span className="text-slate-400">Garantie:</span>
                <span className="text-emerald-400 font-semibold">10 Jahre Zertifiziert</span>
              </div>
            </div>
          </div>

          {/* Phase Selector Buttons */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <p className="text-[11px] font-mono font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Phasen ansteuern:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PHASES.map((p) => (
                <button
                  key={p.step}
                  onClick={() => {
                    setActiveStep(p.step);
                    setIsPlaying(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-left transition-all text-xs font-mono flex items-center justify-between ${
                    activeStep === p.step
                      ? "bg-cyan-500 text-dark-950 font-bold shadow-glow-cyan-sm"
                      : "bg-dark-800 text-slate-300 hover:bg-dark-750 border border-white/10"
                  }`}
                >
                  <span className="truncate">{p.step}. {p.title.split(" ")[0]}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${activeStep === p.step ? "text-dark-950" : "text-slate-500"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
