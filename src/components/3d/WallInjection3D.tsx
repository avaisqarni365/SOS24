"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Layers, RotateCcw } from "lucide-react";

interface PhaseInfo {
  step: number;
  badge: string;
  moisture: string;
  title: string;
  desc: string;
}

const PHASES: PhaseInfo[] = [
  {
    step: 1,
    badge: "KAPILLARE DURCHFEUCHTUNG",
    moisture: "92% Wandfeuchte",
    title: "Nasses Mauerwerk & Salzkristalle",
    desc: "Bodenwasser steigt kapillar durch das poröse Ziegel- und Bruchsteinmauerwerk auf. Schadsalze kristallisieren an der Wandoberfläche und zerstören Putz und Farbschichten."
  },
  {
    step: 2,
    badge: "BOHRLOCHKETTE & PACKER",
    title: "Präzisions-Bohrlochkette im 60°-Winkel",
    moisture: "85% Vorbereitung",
    desc: "Ein versetztes zweireihiges Bohrlochraster (10–12 cm Abstand) wird ohne Erschütterung ins Mauerwerk gebohrt. Spezial-Injektionspacker werden staubfrei verankert."
  },
  {
    step: 3,
    badge: "CHEMISCHE MIKROEMULSION",
    title: "Drucklose Silan-Flutung nach WTA",
    moisture: "44% Verdrängung",
    desc: "Hochkriechende Silan-Mikroemulsion dringt tief in die feinsten Kapillarporen ein, verdrängt das Porenwasser und vernetzt molekular mit dem mineralischen Baustoff."
  },
  {
    step: 4,
    badge: "HORIZONTALE SPERRSCHICHT",
    title: "Dauerhafte Trocknung & Versiegelung",
    moisture: "< 5% Dauerhaft trocken",
    desc: "Die hydrophobe Barriere ist lückenlos geschlossen. Aufsteigende Feuchte wird dauerhaft gestoppt. Die Wand trocknet porentief aus — mit 10 Jahren System-Garantie."
  }
];

export default function WallInjection3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
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
    particleGeo: THREE.BufferGeometry;
    particleCount: number;
  } | null>(null);

  // Initialize Three.js Scene with Kontai24 Exact Ink/Emerald Palette
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1310); // Kontai24 landing-ink

    const camera = new THREE.PerspectiveCamera(36, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(4.4, 2.7, 5.8);
    camera.lookAt(0, 0.65, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Kontai24 Studio Lights: Deep ink ground with mint & emerald rim
    const ambientLight = new THREE.AmbientLight(0x16211c, 2.4);
    scene.add(ambientLight);

    const mintSpot = new THREE.SpotLight(0x62c4ac, 3.4, 25, Math.PI / 4, 0.4);
    mintSpot.position.set(3, 8, 4.5);
    mintSpot.castShadow = true;
    scene.add(mintSpot);

    const emeraldRim = new THREE.DirectionalLight(0x3f9a87, 2.0);
    emeraldRim.position.set(-4, -1, -3);
    scene.add(emeraldRim);

    // Ground Grid in Dark Emerald
    const gridHelper = new THREE.GridHelper(10, 20, 0x3f9a87, 0x141e18);
    gridHelper.position.y = -0.85;
    scene.add(gridHelper);

    // Foundation Base (Bodenplatte)
    const foundationGeo = new THREE.BoxGeometry(4.6, 0.4, 2.0);
    const foundationMat = new THREE.MeshStandardMaterial({
      color: 0x16201b,
      roughness: 0.75,
      metalness: 0.1
    });
    const foundation = new THREE.Mesh(foundationGeo, foundationMat);
    foundation.position.set(0, -0.2, 0);
    foundation.receiveShadow = true;
    scene.add(foundation);

    // Soil Layer (Erdreich)
    const soilGeo = new THREE.BoxGeometry(5.0, 0.3, 2.4);
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x0a0f0c,
      roughness: 0.95
    });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.set(0, -0.55, 0);
    scene.add(soil);

    // Ground Moisture Plane (Mint water glow)
    const waterGeo = new THREE.PlaneGeometry(4.8, 2.2);
    const waterMat = new THREE.MeshBasicMaterial({
      color: 0x62c4ac,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    });
    const waterPlane = new THREE.Mesh(waterGeo, waterMat);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.set(0, -0.38, 0);
    scene.add(waterPlane);

    // Brick Wall
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
          color: 0x1a2e24, // starts damp
          roughness: 0.85,
          metalness: 0.05
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
      color: 0x62c4ac,
      emissive: 0x3f9a87,
      emissiveIntensity: 0.6,
      metalness: 0.8,
      roughness: 0.2
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
      color: 0x62c4ac,
      emissive: 0x62c4ac,
      emissiveIntensity: 0.65,
      transparent: true,
      opacity: 0.75,
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

    // Horizontal Chemical Barrier Plane
    const barrierGeo = new THREE.BoxGeometry(3.9, 0.15, 0.42);
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0x62c4ac,
      emissive: 0x3f9a87,
      emissiveIntensity: 0.85,
      transparent: true,
      opacity: 0.9,
      roughness: 0.1,
      metalness: 0.4
    });
    const barrierMesh = new THREE.Mesh(barrierGeo, barrierMat);
    barrierMesh.position.set(0, 0.24, 0);
    barrierMesh.visible = false;
    scene.add(barrierMesh);

    // Rising Damp Particle System
    const particleCount = 70;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 3.6;
      particlePositions[i + 1] = Math.random() * 1.4;
      particlePositions[i + 2] = (Math.random() - 0.5) * 0.4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x62c4ac,
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
      soil,
      particleGeo,
      particleCount
    };

    // 360° Drag & Touch Controls
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
      const radius = 6.8;
      camera.position.x = Math.sin(angle) * radius;
      camera.position.z = Math.cos(angle) * radius;
      camera.lookAt(0, 0.65, 0);
    };
    const onMouseUp = () => {
      isDragging = false;
    };

    let prevTouchX = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) prevTouchX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const delta = e.touches[0].clientX - prevTouchX;
        prevTouchX = e.touches[0].clientX;
        angle += delta * 0.008;
        const radius = 6.8;
        camera.position.x = Math.sin(angle) * radius;
        camera.position.z = Math.cos(angle) * radius;
        camera.lookAt(0, 0.65, 0);
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
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Damp particles animation
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        pos[i] += 0.005;
        if (pos[i] > 1.5) pos[i] = 0;
      }
      particleGeo.attributes.position.needsUpdate = true;

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

  // Real Scroll Scrubber: Maps scroll through trackRef into progress p (0..1)
  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const totalDist = rect.height - windowHeight;
      if (totalDist <= 0) return;

      const currentScroll = -rect.top;
      const p = Math.max(0, Math.min(1, currentScroll / totalDist));
      setScrollProgress(p);

      // Step mapping
      if (p < 0.25) setActiveStep(1);
      else if (p < 0.5) setActiveStep(2);
      else if (p < 0.75) setActiveStep(3);
      else setActiveStep(4);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update 3D scene continuously based on scroll progress and active step
  useEffect(() => {
    if (!threeRef.current) return;
    const { bricks, diffusers, packers, barrierMesh, particles } = threeRef.current;

    // STEP 1: Nasse Wand
    if (activeStep === 1) {
      packers.forEach((p) => (p.visible = false));
      diffusers.forEach((d) => (d.visible = false));
      barrierMesh.visible = false;
      particles.visible = true;

      bricks.forEach((brick) => {
        const y = brick.position.y;
        const mat = brick.material as THREE.MeshStandardMaterial;
        if (y < 0.6) mat.color.setHex(0x10261c);
        else if (y < 1.0) mat.color.setHex(0x1a3a2d);
        else mat.color.setHex(0x35443c);
      });
    }

    // STEP 2: Bohrlochkette
    if (activeStep === 2) {
      packers.forEach((p) => (p.visible = true));
      diffusers.forEach((d) => (d.visible = false));
      barrierMesh.visible = false;
      particles.visible = true;

      bricks.forEach((brick) => {
        const y = brick.position.y;
        const mat = brick.material as THREE.MeshStandardMaterial;
        if (y < 0.6) mat.color.setHex(0x163327);
        else mat.color.setHex(0x35443c);
      });
    }

    // STEP 3: Chemische Injektion
    if (activeStep === 3) {
      packers.forEach((p) => (p.visible = true));
      diffusers.forEach((d) => {
        d.visible = true;
        d.scale.set(1.25, 1.15, 1.25);
      });
      barrierMesh.visible = false;
      particles.visible = false;

      bricks.forEach((brick) => {
        const y = brick.position.y;
        const mat = brick.material as THREE.MeshStandardMaterial;
        if (y < 0.4) mat.color.setHex(0x276453);
        else mat.color.setHex(0x8c4620);
      });
    }

    // STEP 4: Dauerhaft Trocken
    if (activeStep === 4) {
      packers.forEach((p) => (p.visible = false));
      diffusers.forEach((d) => (d.visible = false));
      barrierMesh.visible = true;
      particles.visible = false;

      bricks.forEach((brick) => {
        const y = brick.position.y;
        const mat = brick.material as THREE.MeshStandardMaterial;
        if (y < 0.25) mat.color.setHex(0x276453);
        else mat.color.setHex(0xb55a2a); // dry terracotta
      });
    }
  }, [activeStep]);

  // Exploded View separation
  useEffect(() => {
    if (!threeRef.current) return;
    const { bricks, barrierMesh, foundation, soil } = threeRef.current;
    const offset = isExploded ? 0.45 : 0;

    foundation.position.y = -0.2 - offset * 0.8;
    soil.position.y = -0.55 - offset * 1.5;

    bricks.forEach((brick) => {
      const origY = brick.userData.origY ?? brick.position.y;
      brick.userData.origY = origY;
      if (origY > 0.4) brick.position.y = origY + offset;
    });

    if (barrierMesh) barrierMesh.position.y = 0.24 + (isExploded ? 0.1 : 0);
  }, [isExploded]);

  const currentPhase = PHASES[activeStep - 1];

  return (
    <div ref={trackRef} className="relative w-full h-[230vh]">
      {/* Pinned Stage Container */}
      <div className="sticky top-20 w-full bg-landing-ink2 rounded-3xl border border-white/[0.08] shadow-card overflow-hidden">
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-landing-ink/90 backdrop-blur-md border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-landing-mint/10 border border-landing-mint/30 flex items-center justify-center text-landing-mint font-mono text-xs font-bold">
              3D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-landing-bone font-editorial">
                  Scroll-gesteuertes Injektionsmodell
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-landing-emerald/15 text-landing-mint border border-landing-emerald/30">
                  WTA 4-4-04
                </span>
              </div>
              <p className="text-xs text-landing-bone/60 font-mono">
                Mausrad drehen zum Durchfahren der 4 Sanierungsphasen
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExploded(!isExploded)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${
                isExploded
                  ? "bg-landing-mint/20 text-landing-mint border-landing-mint/50"
                  : "bg-white/[0.04] text-landing-bone/70 border-white/[0.1] hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isExploded ? "Schichten schließen" : "Schichten explodieren"}</span>
            </button>

            <div className="px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono flex items-center gap-2">
              <span className="text-landing-bone/50">Feuchte:</span>
              <span className={`font-bold ${activeStep === 4 ? "text-landing-mint" : "text-amber-300"}`}>
                {currentPhase.moisture}
              </span>
            </div>
          </div>
        </div>

        {/* Viewport & Phase Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* 3D Canvas */}
          <div className="lg:col-span-8 relative min-h-[380px] sm:min-h-[460px] bg-landing-ink cursor-grab active:cursor-grabbing">
            <div ref={containerRef} className="w-full h-full absolute inset-0" />

            {/* Scrubber Progress Badge */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-landing-ink/90 backdrop-blur-md border border-white/[0.1] text-[11px] font-mono text-landing-bone/70 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-landing-mint animate-pulse"></span>
                <span>Scrub-Fortschritt: {Math.round(scrollProgress * 100)}%</span>
              </div>
            </div>

            {/* 360 Rotation Hint */}
            <div className="absolute bottom-4 left-4 pointer-events-none">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-landing-ink/80 border border-white/[0.08] text-[11px] font-mono text-landing-bone/50">
                <RotateCcw className="w-3 h-3 text-landing-mint" />
                <span>360° interaktiv drehbar</span>
              </div>
            </div>

            {/* Phase Tag */}
            <div className="absolute bottom-4 right-4 pointer-events-none font-mono">
              <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-landing-ink/90 border border-landing-emerald/30 text-landing-mint">
                {currentPhase.badge}
              </span>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 p-7 bg-landing-ink2 border-t lg:border-t-0 lg:border-l border-white/[0.08] flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-landing-mint uppercase tracking-wider mb-1">
                Phase 0{currentPhase.step} / 04
              </div>
              <h4 className="text-2xl font-editorial font-normal text-landing-bone mt-2 leading-snug">
                {currentPhase.title}
              </h4>
              <p className="text-xs sm:text-sm text-landing-bone/70 mt-4 leading-relaxed">
                {currentPhase.desc}
              </p>

              <div className="mt-8 space-y-2.5 pt-4 border-t border-white/[0.06] text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-landing-ink border border-white/[0.04]">
                  <span className="text-landing-bone/50">Standard:</span>
                  <span className="text-landing-bone font-medium">WTA Merkblatt 4-4-04</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-landing-ink border border-white/[0.04]">
                  <span className="text-landing-bone/50">Wirkstoff:</span>
                  <span className="text-landing-mint font-medium">Silan-Mikroemulsion</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-landing-ink border border-white/[0.04]">
                  <span className="text-landing-bone/50">Garantie:</span>
                  <span className="text-landing-bone font-medium">10 Jahre Verbundgarantie</span>
                </div>
              </div>
            </div>

            {/* Phase Selector Buttons */}
            <div className="mt-8 pt-4 border-t border-white/[0.06]">
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {PHASES.map((p) => (
                  <button
                    key={p.step}
                    onClick={() => setActiveStep(p.step)}
                    className={`p-2.5 rounded-xl text-left transition-all border ${
                      activeStep === p.step
                        ? "bg-landing-mint/15 text-landing-mint border-landing-mint/40"
                        : "bg-white/[0.02] text-landing-bone/60 border-white/[0.06] hover:text-white"
                    }`}
                  >
                    Phase {p.step}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
