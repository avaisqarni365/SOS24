"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Play, Pause, RotateCcw, Droplets, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";

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
    badge: "Problem: Schadensbild",
    moisture: "92% Wandfeuchte",
    desc: "Grundwasser und Bodenfeuchte steigen unkontrolliert durch die Kapillaren des Mauerwerks nach oben. Folge: Abplatzender Putz, Salzausblühungen und Schimmelgefahr."
  },
  {
    step: 2,
    title: "Präzisions-Bohrlochkette",
    badge: "Schritt 1: Vorbereitung",
    moisture: "85% Wandfeuchte",
    desc: "Im Sockelbereich wird eine dichte Kette aus Bohrlöchern (Abstand ca. 10-12 cm) schräg ins Mauerwerk gebohrt. Spezial-Injektionspacker werden staubfrei eingesetzt."
  },
  {
    step: 3,
    title: "Chemische Injektion (Wirkstoffausbreitung)",
    badge: "Schritt 2: Injektion",
    moisture: "48% Verdrängung",
    desc: "Hochviskose Silan-/Siloxan-Mikroemulsion wird drucklos injiziert. Der Wirkstoff dringt tief in die feinsten Poren ein, verdrängt Wasser und bildet eine chemische Sperrschicht."
  },
  {
    step: 4,
    title: "Dauerhafte Horizontalsperre & Austrocknung",
    badge: "Ergebnis: 10 Jahre Garantie",
    moisture: "< 6% Trocken",
    desc: "Die hydrophobe Barriere ist geschlossen. Keine Bodenfeuchte kann mehr aufsteigen. Das Mauerwerk oberhalb trocknet dauerhaft aus und behält seine volle Bausubstanz."
  }
];

export default function WallInjection3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // References to Three.js objects that we will animate based on activeStep
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
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfaf9f7); // matches sand-50

    // Camera
    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(4.5, 2.8, 6.2);
    camera.lookAt(0, 0.8, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff8ee, 1.2);
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const blueRimLight = new THREE.DirectionalLight(0x0ea5e9, 0.6);
    blueRimLight.position.set(-5, 3, -3);
    scene.add(blueRimLight);

    // Concrete Foundation (Bodenplatte)
    const foundationGeo = new THREE.BoxGeometry(4.8, 0.45, 2.2);
    const foundationMat = new THREE.MeshStandardMaterial({
      color: 0x9a9184, // concrete slate
      roughness: 0.85,
      metalness: 0.1
    });
    const foundation = new THREE.Mesh(foundationGeo, foundationMat);
    foundation.position.set(0, -0.22, 0);
    foundation.receiveShadow = true;
    scene.add(foundation);

    // Wet Soil underneath
    const soilGeo = new THREE.BoxGeometry(5.2, 0.35, 2.6);
    const soilMat = new THREE.MeshStandardMaterial({
      color: 0x4a4339,
      roughness: 0.95
    });
    const soil = new THREE.Mesh(soilGeo, soilMat);
    soil.position.set(0, -0.62, 0);
    scene.add(soil);

    // Ground Moisture Plane (glowing blue water indicator)
    const waterGeo = new THREE.PlaneGeometry(5.0, 2.4);
    const waterMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const waterPlane = new THREE.Mesh(waterGeo, waterMat);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.set(0, -0.44, 0);
    scene.add(waterPlane);

    // Brick Wall (Construct individual bricks with mortar offsets)
    const bricks: THREE.Mesh[] = [];
    const rows = 7;
    const cols = 8;
    const brickW = 0.45;
    const brickH = 0.22;
    const brickD = 0.35;
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
          color: 0xc47a3a, // initial dry terracotta brick
          roughness: 0.75,
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

    // Drill holes and injection packers along row 1
    const packers: THREE.Mesh[] = [];
    const packerGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 16);
    const packerMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.2
    });

    const numHoles = 6;
    const holeSpacing = 3.2 / (numHoles - 1);
    for (let i = 0; i < numHoles; i++) {
      const p = new THREE.Mesh(packerGeo, packerMat);
      p.rotation.x = Math.PI / 3; // 60 degree angled drill hole
      p.position.set(-1.6 + i * holeSpacing, 0.25, 0.18);
      p.visible = false;
      scene.add(p);
      packers.push(p);
    }

    // Chemical Diffusion Spheres expanding from drill holes
    const diffusers: THREE.Mesh[] = [];
    const diffGeo = new THREE.SphereGeometry(0.38, 24, 24);
    const diffMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4, // chemical teal
      transparent: true,
      opacity: 0.65,
      roughness: 0.3
    });

    for (let i = 0; i < numHoles; i++) {
      const d = new THREE.Mesh(diffGeo, diffMat.clone());
      d.position.set(-1.6 + i * holeSpacing, 0.22, 0);
      d.scale.set(0.01, 0.01, 0.01);
      d.visible = false;
      scene.add(d);
      diffusers.push(d);
    }

    // Horizontal Chemical Barrier Mesh (Full layer)
    const barrierGeo = new THREE.BoxGeometry(3.9, 0.16, 0.42);
    const barrierMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
      metalness: 0.3
    });
    const barrierMesh = new THREE.Mesh(barrierGeo, barrierMat);
    barrierMesh.position.set(0, 0.25, 0);
    barrierMesh.visible = false;
    scene.add(barrierMesh);

    // Rising Damp Particles
    const particleCount = 60;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 3.6;
      particlePositions[i + 1] = Math.random() * 1.5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 0.4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.6
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
      particles
    };

    // Mouse Drag Rotation interaction
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
      camera.lookAt(0, 0.8, 0);
    };
    const onMouseUp = () => { isDragging = false; };

    // Touch support
    let prevTouchX = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        prevTouchX = e.touches[0].clientX;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const delta = e.touches[0].clientX - prevTouchX;
        prevTouchX = e.touches[0].clientX;
        angle += delta * 0.008;
        const radius = 7.2;
        camera.position.x = Math.sin(angle) * radius;
        camera.position.z = Math.cos(angle) * radius;
        camera.lookAt(0, 0.8, 0);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    dom.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // Window resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Render loop
    let animationId: number;
    let clock = 0;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      clock += 0.02;

      // Animate rising particles
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        pos[i] += 0.006;
        if (pos[i] > 1.6) pos[i] = 0;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Slight natural breathing camera wobble if not dragging
      if (!isDragging) {
        camera.position.y = 2.8 + Math.sin(clock * 0.5) * 0.08;
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

  // Update Three.js scene according to activeStep
  useEffect(() => {
    if (!threeRef.current) return;
    const { bricks, diffusers, packers, barrierMesh, particles } = threeRef.current;

    // STEP 1: Nasse Wand (Damp blue gradient on lower bricks)
    if (activeStep === 1) {
      packers.forEach(p => (p.visible = false));
      diffusers.forEach(d => (d.visible = false));
      barrierMesh.visible = false;
      particles.visible = true;

      bricks.forEach(brick => {
        const y = brick.position.y;
        const mat = brick.material as THREE.MeshStandardMaterial;
        if (y < 0.6) {
          mat.color.setHex(0x1e3a8a); // saturated dark damp
        } else if (y < 1.0) {
          mat.color.setHex(0x3b82f6); // damp gradient
        } else {
          mat.color.setHex(0x94a3b8); // stained masonry
        }
      });
    }

    // STEP 2: Bohrlochkette (Packers appear, wall still damp)
    if (activeStep === 2) {
      packers.forEach(p => (p.visible = true));
      diffusers.forEach(d => (d.visible = false));
      barrierMesh.visible = false;
      particles.visible = true;

      bricks.forEach(brick => {
        const y = brick.position.y;
        const mat = brick.material as THREE.MeshStandardMaterial;
        if (y < 0.6) mat.color.setHex(0x2563eb);
        else mat.color.setHex(0x64748b);
      });
    }

    // STEP 3: Chemische Injektion (Chemical spheres expand, displacing water)
    if (activeStep === 3) {
      packers.forEach(p => (p.visible = true));
      diffusers.forEach(d => {
        d.visible = true;
        d.scale.set(1.2, 1.1, 1.2);
        (d.material as THREE.MeshStandardMaterial).color.setHex(0x06b6d4); // glowing cyan chemical
      });
      barrierMesh.visible = false;
      particles.visible = false;

      bricks.forEach(brick => {
        const y = brick.position.y;
        const mat = brick.material as THREE.MeshStandardMaterial;
        if (y < 0.4) mat.color.setHex(0x0369a1);
        else mat.color.setHex(0xa36230); // starts drying
      });
    }

    // STEP 4: Trockene Wand (Barrier formed, upper bricks dry terracotta)
    if (activeStep === 4) {
      packers.forEach(p => (p.visible = false));
      diffusers.forEach(d => (d.visible = false));
      barrierMesh.visible = true; // solid continuous barrier
      particles.visible = false;

      bricks.forEach(brick => {
        const y = brick.position.y;
        const mat = brick.material as THREE.MeshStandardMaterial;
        if (y < 0.25) {
          mat.color.setHex(0x0284c7); // moisture stopped below barrier
        } else {
          mat.color.setHex(0xc47a3a); // perfectly warm dry brick
        }
      });
    }
  }, [activeStep]);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev >= 4 ? 1 : prev + 1));
    }, 4200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentPhase = PHASES[activeStep - 1];

  return (
    <div className="w-full bg-sand-50 rounded-3xl border border-sand-200 shadow-soft overflow-hidden">
      {/* Header bar */}
      <div className="px-6 py-4 bg-white border-b border-sand-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-hydro-50 border border-hydro-200 flex items-center justify-center text-hydro-600">
            <Droplets className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-sand-900">3D-Funktionsmodell: Horizontalsperre</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-hydro-100 text-hydro-800 font-semibold">
                WTA-Injektionsverfahren
              </span>
            </div>
            <p className="text-xs text-sand-500">Mauerwerks-Querschnitt mit kapillarem Feuchtigkeitsstopp</p>
          </div>
        </div>

        {/* Live moisture indicator badge */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-sand-100 border border-sand-200 flex items-center gap-2 text-xs">
            <span className="text-sand-500">Status:</span>
            <span className={`font-bold ${activeStep === 4 ? "text-emerald-600" : activeStep === 3 ? "text-cyan-600" : "text-blue-600"}`}>
              {currentPhase.moisture}
            </span>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-sand-300 text-sand-700 hover:bg-sand-50 text-xs font-medium transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      </div>

      {/* Main interactive area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* 3D Canvas Viewport */}
        <div className="lg:col-span-8 relative min-h-[380px] sm:min-h-[440px] bg-gradient-to-b from-sand-50 to-sand-100/60 cursor-grab active:cursor-grabbing">
          <div ref={containerRef} className="w-full h-full absolute inset-0" />

          {/* Hint Overlay */}
          <div className="absolute top-4 left-4 pointer-events-none">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm border border-sand-200/80 text-[11px] text-sand-600 shadow-sm">
              <RotateCcw className="w-3 h-3 text-sand-400" />
              <span>Mit Maus / Finger 360° drehen</span>
            </div>
          </div>

          {/* Current Step Watermark Badge */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-sm border border-sand-200 text-sand-800 shadow-sm">
              {currentPhase.badge}
            </span>
            <span className="text-[11px] text-sand-500 bg-white/80 px-2.5 py-1 rounded-lg">
              Schritt {activeStep} von 4
            </span>
          </div>
        </div>

        {/* Phase Details & Controls Sidebar */}
        <div className="lg:col-span-4 p-6 bg-white border-t lg:border-t-0 lg:border-l border-sand-200 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-hydro-600 uppercase tracking-wider">
              {currentPhase.badge}
            </span>
            <h4 className="text-lg font-bold text-sand-900 mt-1">
              {currentPhase.title}
            </h4>
            <p className="text-xs text-sand-600 mt-3 leading-relaxed">
              {currentPhase.desc}
            </p>

            {/* Technical benefits list */}
            <div className="mt-5 space-y-2 pt-4 border-t border-sand-100">
              <div className="flex items-start gap-2 text-xs text-sand-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Kein Aufgraben des Gartens oder Bürgersteigs</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-sand-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Silan-Moleküle verdrängen Restfeuchte chemisch</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-sand-700">
                <ShieldCheck className="w-4 h-4 text-hydro-500 shrink-0 mt-0.5" />
                <span>10 Jahre Herstellergarantie nach WTA-Norm</span>
              </div>
            </div>
          </div>

          {/* Step Selector Buttons */}
          <div className="mt-6 pt-5 border-t border-sand-100">
            <p className="text-[11px] font-semibold text-sand-500 mb-2 uppercase tracking-wider">
              Phasen auswählen:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PHASES.map((p) => (
                <button
                  key={p.step}
                  onClick={() => {
                    setActiveStep(p.step);
                    setIsPlaying(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-left transition-all text-xs font-medium flex items-center justify-between ${
                    activeStep === p.step
                      ? "bg-hydro-600 text-white shadow-sm"
                      : "bg-sand-50 text-sand-700 hover:bg-sand-100 border border-sand-200/60"
                  }`}
                >
                  <span className="truncate">{p.step}. {p.title.split(" ")[0]}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${activeStep === p.step ? "text-white" : "text-sand-400"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
