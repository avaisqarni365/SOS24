/**
 * The 3D viewer behind "Jeder Ort, Schicht für Schicht": one renderer, one
 * orbit camera, four compact cut-away scenes (Keller inside, Keller outside,
 * garage concrete, living-room corner). Each scene is built on demand,
 * animates between the states of its treatment steps, exposes its layers
 * for picking and labels, and is disposed when the visitor switches.
 * Loaded lazily, so three.js never sits on the first-paint path.
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { SceneDef, SceneStep } from "@/data/scenes3d";

type State = Record<string, number>;
interface View {
  target: THREE.Vector3;
  dist: number;
  dir: THREE.Vector3;
}
interface Runtime {
  group: THREE.Group;
  views: Record<string, View>;
  apply: (s: State) => void;
  pick: [string, THREE.Object3D][];
  mats: Record<string, THREE.MeshStandardMaterial[]>;
  anchors: Record<string, () => THREE.Vector3>;
  /** which layer labels to show in this state */
  labels: (s: State) => string[];
  /** direction the cut face looks towards (labels hide from behind) */
  front: THREE.Vector3;
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => {
  x = clamp01(x);
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const dirAt = (azimuth: number, rise: number) => new THREE.Vector3(Math.sin(azimuth), rise, Math.cos(azimuth)).normalize();
const view = (x: number, y: number, z: number, dist: number, az: number, rise: number): View => ({
  target: new THREE.Vector3(x, y, z),
  dist,
  dir: dirAt(az, rise),
});

/** Box already placed at its rest position, UVs in world metres so textures never stretch. */
function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, tile = 1) {
  const g = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
  g.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const nor = g.attributes.normal as THREE.BufferAttribute;
  const uv = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const nx = Math.abs(nor.getX(i));
    const ny = Math.abs(nor.getY(i));
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    if (nx > 0.5) uv.setXY(i, z / tile, y / tile);
    else if (ny > 0.5) uv.setXY(i, x / tile, z / tile);
    else uv.setXY(i, x / tile, y / tile);
  }
  uv.needsUpdate = true;
  return g;
}

/** Small procedural textures drawn once on a canvas. */
function canvasTex(size: number, draw: (g: CanvasRenderingContext2D, s: number, rnd: () => number) => void) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  draw(g, size, rnd);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export interface SceneViewer {
  loadScene: (def: SceneDef) => void;
  setStep: (step: SceneStep) => void;
  select: (layerId: string | null) => void;
  zoom: (factor: number) => void;
  reset: () => void;
  dispose: () => void;
}

export function createSceneViewer(
  host: HTMLElement,
  opts: { onPick?: (id: string) => void; onInteract?: () => void }
): SceneViewer {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.55;
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.4);
  sun.position.set(6, 10, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.radius = 5;
  sun.shadow.bias = -0.0004;
  const sc = sun.shadow.camera as THREE.OrthographicCamera;
  sc.left = -7;
  sc.right = 7;
  sc.top = 7;
  sc.bottom = -7;
  sc.near = 1;
  sc.far = 40;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xdcefe8, 0x1a1410, 0.6));
  const rim = new THREE.DirectionalLight(0x62c4ac, 0.5);
  rim.position.set(-5, 3, -4);
  scene.add(rim);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 80);

  // ---------------------------------------------------------- shared assets
  const loader = new THREE.TextureLoader();
  let dirty = true;
  const tex = (url: string, color = true) => {
    const t = loader.load(url, () => (dirty = true), undefined, () => (dirty = true));
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const T = {
    brick: tex("/textures/brick-color.webp"),
    brickBump: tex("/textures/brick-bump.webp", false),
    brickRough: tex("/textures/brick-rough.webp", false),
    soil: tex("/textures/soil.webp"),
    mds: tex("/textures/mds.webp"),
    plaster: tex("/textures/plaster.webp"),
    calsil: tex("/textures/calsil.webp"),
    concrete: canvasTex(512, (g, s, rnd) => {
      g.fillStyle = "#a3a7a4";
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < 9000; i++) {
        const l = 52 + rnd() * 22;
        g.fillStyle = `hsla(150 3% ${l}% / ${0.25 + rnd() * 0.35})`;
        g.fillRect(rnd() * s, rnd() * s, 1 + rnd() * 2.5, 1 + rnd() * 2.5);
      }
      // formwork joints and tie holes
      g.strokeStyle = "rgba(60,64,62,0.35)";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(0, s / 2);
      g.lineTo(s, s / 2);
      g.moveTo(s / 2, 0);
      g.lineTo(s / 2, s);
      g.stroke();
      g.fillStyle = "rgba(50,54,52,0.55)";
      for (const [x, y] of [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]]) {
        g.beginPath();
        g.arc(x * s, y * s, 5, 0, Math.PI * 2);
        g.fill();
      }
    }),
    dimple: canvasTex(256, (g, s) => {
      g.fillStyle = "#3d4247";
      g.fillRect(0, 0, s, s);
      for (let y = 8; y < s; y += 16)
        for (let x = ((y / 16) % 2) * 8 + 8; x < s; x += 16) {
          const gr = g.createRadialGradient(x - 2, y - 2, 1, x, y, 6);
          gr.addColorStop(0, "#6b737a");
          gr.addColorStop(1, "#30353a");
          g.fillStyle = gr;
          g.beginPath();
          g.arc(x, y, 5.5, 0, Math.PI * 2);
          g.fill();
        }
    }),
    gravel: canvasTex(256, (g, s, rnd) => {
      g.fillStyle = "#8f8a80";
      g.fillRect(0, 0, s, s);
      for (let i = 0; i < 700; i++) {
        const l = 45 + rnd() * 35;
        g.fillStyle = `hsl(${30 + rnd() * 20} 8% ${l}%)`;
        g.beginPath();
        g.ellipse(rnd() * s, rnd() * s, 2 + rnd() * 5, 2 + rnd() * 4, rnd() * 3, 0, Math.PI * 2);
        g.fill();
      }
    }),
  };

  /** Masonry material with a moisture front (tint + gloss + salt band). */
  function dampMat(height: { value: number }, salt: { value: number }, base: THREE.MeshStandardMaterialParameters) {
    const m = new THREE.MeshStandardMaterial(base);
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uDamp = height;
      sh.uniforms.uSalt = salt;
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nvarying float vRestY;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRestY = position.y;");
      sh.fragmentShader = sh.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying float vRestY;\nuniform float uDamp;\nuniform float uSalt;")
        .replace(
          "#include <color_fragment>",
          `#include <color_fragment>
           float wet = 1.0 - smoothstep(uDamp - 0.22, uDamp + 0.02, vRestY);
           diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * vec3(0.2, 0.27, 0.4), wet * 0.95);
           float band = smoothstep(uDamp - 0.02, uDamp + 0.04, vRestY) * (1.0 - smoothstep(uDamp + 0.04, uDamp + 0.2, vRestY));
           diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.9, 0.88, 0.82), band * 0.55 * uSalt);`
        )
        .replace(
          "#include <roughnessmap_fragment>",
          `#include <roughnessmap_fragment>
           float wetR = 1.0 - smoothstep(uDamp - 0.22, uDamp + 0.02, vRestY);
           roughnessFactor = mix(roughnessFactor, 0.32, wetR * 0.8);`
        );
    };
    return m;
  }
  const brickBase = (): THREE.MeshStandardMaterialParameters => ({
    map: T.brick,
    bumpMap: T.brickBump,
    bumpScale: 1.4,
    roughnessMap: T.brickRough,
    roughness: 1,
  });

  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D, shadow = true) => {
    const o = new THREE.Mesh(g, m);
    o.castShadow = shadow;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  };
  const grp = (parent: THREE.Object3D) => {
    const g = new THREE.Group();
    parent.add(g);
    return g;
  };
  const puddleMesh = (parent: THREE.Object3D, x: number, y: number, z: number, sx: number, sz: number) => {
    const m = new THREE.MeshStandardMaterial({ color: 0x3b6ea8, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.7 });
    const p = new THREE.Mesh(new THREE.CircleGeometry(1, 40), m);
    p.rotation.x = -Math.PI / 2;
    p.position.set(x, y, z);
    p.userData.base = [sx, sz];
    parent.add(p);
    return { p, m };
  };

  // =================================================== scene: Keller innen
  function buildKellerInnen(): Runtime {
    const root = new THREE.Group();
    const H = 2.4;
    const L = 3.6;
    const ROOM = 3.8;
    const BAR_Y0 = 0.14;
    const BAR_Y1 = 0.26;
    const GAP = 0.8;
    const tM = 0.42;
    const tS = 0.7;
    const tA = 0.05;
    const tP = 0.06;
    const tK = 0.05;
    const z0 = -L / 2;
    const z1 = L / 2;
    const xM0 = -tM;
    const xS0 = xM0 - tS;
    const xA1 = tA;
    const xP1 = xA1 + tP;
    const xK1 = xP1 + tK;
    const soilTop = H * 0.84;
    const uDamp = { value: 1.55 };
    const uSalt = { value: 1 };

    const soilMat = new THREE.MeshStandardMaterial({ map: T.soil, roughness: 1 });
    const brickMat = dampMat(uDamp, uSalt, brickBase());
    const mdsMat = new THREE.MeshStandardMaterial({ map: T.mds, roughness: 0.8 });
    const plasterMat = new THREE.MeshStandardMaterial({ map: T.plaster, roughness: 0.92 });
    const calsilMat = new THREE.MeshStandardMaterial({ map: T.calsil, roughness: 0.85 });
    const barrierMat = new THREE.MeshStandardMaterial({ color: 0x62c4ac, emissive: 0x62c4ac, emissiveIntensity: 0.3, roughness: 0.35 });
    const packerMat = new THREE.MeshStandardMaterial({ color: 0xb9c2c0, metalness: 0.8, roughness: 0.3 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x62c4ac, roughness: 0.4 });
    const grass = new THREE.MeshStandardMaterial({ color: 0x4a6b3c, roughness: 1 });
    const slab = new THREE.MeshStandardMaterial({ map: T.mds, color: 0x9a9e9a, roughness: 0.9 });
    const floorMat = new THREE.MeshStandardMaterial({ map: T.mds, color: 0x8a8f8b, roughness: 0.9 });

    const gSoil = grp(root);
    mesh(box(xS0, xM0, -0.3, soilTop, z0, z1, 1.4), soilMat, gSoil);
    mesh(box(xS0, xM0, soilTop, soilTop + 0.05, z0, z1), grass, gSoil);
    const gMasonry = grp(root);
    mesh(box(xM0, 0, -0.3, BAR_Y0, z0, z1, 1.6), brickMat, gMasonry);
    mesh(box(xM0, 0, BAR_Y1, H, z0, z1, 1.6), brickMat, gMasonry);
    const slot = mesh(box(xM0, 0, BAR_Y0, BAR_Y1, z0, z1, 1.6), brickMat, gMasonry);
    const gBarrier = grp(root);
    const bGeo = new THREE.BoxGeometry(tM + 0.004, BAR_Y1 - BAR_Y0 + 0.004, L + 0.004);
    bGeo.translate(xM0 / 2, (BAR_Y0 + BAR_Y1) / 2, L / 2);
    const barrier = mesh(bGeo, barrierMat, gBarrier);
    barrier.position.z = z0;
    const packers: THREE.Group[] = [];
    const pGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.1, 10);
    pGeo.rotateZ(Math.PI / 2);
    const cGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.025, 12);
    cGeo.rotateZ(Math.PI / 2);
    for (let z = z0 + 0.1; z < z1 - 0.05; z += 0.2) {
      const g = new THREE.Group();
      const b = new THREE.Mesh(pGeo, packerMat);
      b.position.set(0.03, (BAR_Y0 + BAR_Y1) / 2, z);
      const c = new THREE.Mesh(cGeo, capMat);
      c.position.set(0.085, (BAR_Y0 + BAR_Y1) / 2, z);
      g.add(b, c);
      gMasonry.add(g);
      packers.push(g);
    }
    const gSeal = grp(root);
    mesh(box(0, xA1, 0, H, z0, z1, 1.2), mdsMat, gSeal);
    const cove = new THREE.Shape();
    cove.moveTo(xA1, 0);
    cove.lineTo(xA1 + 0.12, 0);
    cove.quadraticCurveTo(xA1 + 0.02, 0.02, xA1, 0.12);
    cove.lineTo(xA1, 0);
    const coveGeo = new THREE.ExtrudeGeometry(cove, { depth: L, bevelEnabled: false });
    coveGeo.translate(0, 0, z0);
    mesh(coveGeo, mdsMat, gSeal);
    const gPlaster = grp(root);
    mesh(box(xA1, xP1, 0.12, H, z0, z1, 1.2), plasterMat, gPlaster);
    const gBoard = grp(root);
    mesh(box(xP1, xK1, 0.14, H, z0, z1, 1.0), calsilMat, gBoard);
    mesh(box(xA1, ROOM, -0.14, 0, z0, z1, 1.4), floorMat, root, false);

    // the rest of the Keller: back and right wall, ceiling, soil around
    const houseBrick = dampMat(uDamp, uSalt, brickBase());
    const zB = z0 - tM;
    const xR = ROOM + tM;
    mesh(box(xM0, xR, -0.3, H, zB, z0, 1.6), houseBrick, root);
    mesh(box(ROOM, xR, -0.3, H, z0, z1, 1.6), houseBrick, root);
    mesh(box(xS0, xR + tS, -0.3, soilTop, zB - tS, zB, 1.4), soilMat, root);
    mesh(box(xR, xR + tS, -0.3, soilTop, zB, z1, 1.4), soilMat, root);
    mesh(box(xS0, xR + tS, soilTop, soilTop + 0.05, zB - tS, zB), grass, root);
    mesh(box(xR, xR + tS, soilTop, soilTop + 0.05, zB, z1), grass, root);
    mesh(box(xM0, xR, H, H + 0.2, zB, z1, 1.4), slab, root);
    // a Keller window in the back wall, with a light well behind
    const glass = new THREE.MeshStandardMaterial({ color: 0x9fb8c8, roughness: 0.1, metalness: 0.3, emissive: 0x9fc4d8, emissiveIntensity: 0.35 });
    const frame = new THREE.MeshStandardMaterial({ color: 0xf6f4ee, roughness: 0.5 });
    mesh(box(1.5, 2.5, 1.75, 2.25, z0 - 0.01, z0 + 0.005), glass, root, false);
    mesh(box(1.45, 2.55, 1.7, 1.75, z0 - 0.01, z0 + 0.03), frame, root);
    mesh(box(1.45, 2.55, 2.25, 2.3, z0 - 0.01, z0 + 0.03), frame, root);
    const { p: puddle } = puddleMesh(root, 2.0, 0.006, 0.3, 1.1, 0.7);
    const mouldMat = new THREE.MeshStandardMaterial({ color: 0x223024, roughness: 1, transparent: true });
    const mould = new THREE.Group();
    [[3.1, 2.05, 0.2], [3.4, 1.85, 0.13], [2.85, 2.2, 0.1], [3.55, 2.2, 0.09], [3.0, 1.7, 0.08]].forEach(([x, y, r]) => {
      const m = new THREE.Mesh(new THREE.CircleGeometry(r, 20), mouldMat);
      m.position.set(x, y, z0 + 0.004);
      mould.add(m);
    });
    root.add(mould);

    const interior = [gSeal, gPlaster, gBoard];
    return {
      group: root,
      views: {
        room: view(1.6, 1.0, -0.2, 9.2, 0.62, 0.42),
        wall: view(0.1, 1.1, 0.1, 6.6, 0.78, 0.26),
        explode: view(1.0, 1.3, 0, 9.5, 0.56, 0.36),
      },
      apply(s) {
        const damp = s.damp ?? 0;
        uDamp.value = lerp(BAR_Y0 + 0.02, 1.55, damp);
        uSalt.value = damp;
        puddle.visible = damp > 0.02;
        puddle.scale.set(1.1 * damp, 0.7 * damp, 1);
        mould.visible = damp > 0.02;
        mouldMat.opacity = damp;
        const seal = s.seal ?? 0;
        const showP = (s.packers ?? 0) * (1 - smooth(seal * 2));
        packers.forEach((g, i) => {
          const local = clamp01(showP * 1.6 - (i / packers.length) * 0.6);
          g.visible = local > 0.01 && (s.explode ?? 0) < 0.5;
          g.position.x = lerp(0.4, 0, local);
        });
        const bar = s.barrier ?? 0;
        barrier.scale.z = Math.max(0.0001, bar);
        barrier.visible = bar > 0.001;
        slot.visible = bar < 0.999;
        const e = smooth(s.explode ?? 0);
        [seal, s.plaster ?? 0, s.board ?? 0].forEach((val, i) => {
          const v = smooth(val);
          interior[i].visible = v > 0.01;
          interior[i].position.x = lerp(1.4, 0, v) + GAP * (i + 1) * e;
        });
        gSoil.position.x = -GAP * 0.9 * e;
        gBarrier.position.set(0, 1.25 * e + 0.12 * Math.sin(e * Math.PI), 0);
      },
      pick: [
        ["erdreich", gSoil],
        ["mauerwerk", gMasonry],
        ["horizontalsperre", gBarrier],
        ["innenabdichtung", gSeal],
        ["sanierputz", gPlaster],
        ["klimaplatte", gBoard],
      ],
      mats: {
        erdreich: [soilMat],
        mauerwerk: [brickMat],
        horizontalsperre: [barrierMat],
        innenabdichtung: [mdsMat],
        sanierputz: [plasterMat],
        klimaplatte: [calsilMat],
      },
      anchors: {
        erdreich: () => new THREE.Vector3((xS0 + xM0) / 2, soilTop, z1).add(gSoil.position),
        mauerwerk: () => new THREE.Vector3(xM0 / 2, H, z1).add(gMasonry.position),
        horizontalsperre: () => new THREE.Vector3(xM0 / 2, BAR_Y1, z1).add(gBarrier.position),
        innenabdichtung: () => new THREE.Vector3(xA1 / 2, H, z1).add(gSeal.position),
        sanierputz: () => new THREE.Vector3((xA1 + xP1) / 2, H, z1).add(gPlaster.position),
        klimaplatte: () => new THREE.Vector3((xP1 + xK1) / 2, H, z1).add(gBoard.position),
      },
      labels: (s) => ((s.explode ?? 0) > 0.6 ? ["erdreich", "mauerwerk", "horizontalsperre", "innenabdichtung", "sanierputz", "klimaplatte"] : []),
      front: new THREE.Vector3(0, 0, 1),
    };
  }

  // ================================================== scene: Keller außen
  function buildKellerAussen(): Runtime {
    const root = new THREE.Group();
    const H = 2.6;
    const L = 3.6;
    const t = 0.36;
    const z0 = -L / 2;
    const z1 = L / 2;
    const soilTop = 2.15;
    const TR = 1.1; // trench width
    const FAR = 1.5;
    const uDamp = { value: 2.6 };
    const uSalt = { value: 0.6 };
    const brickMat = dampMat(uDamp, uSalt, brickBase());
    const soilMat = new THREE.MeshStandardMaterial({ map: T.soil, roughness: 1 });
    const grass = new THREE.MeshStandardMaterial({ color: 0x4a6b3c, roughness: 1 });
    const footMat = new THREE.MeshStandardMaterial({ map: T.concrete, color: 0xb9bcba, roughness: 0.95 });
    const primeMat = new THREE.MeshStandardMaterial({ map: T.mds, color: 0xc9c4b8, roughness: 0.95 });
    const coatMat = new THREE.MeshStandardMaterial({ color: 0x1f2224, roughness: 0.35, metalness: 0.05 });
    const protectMat = new THREE.MeshStandardMaterial({ map: T.dimple, roughness: 0.6 });
    T.dimple.repeat.set(4, 4);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0xe3a33b, roughness: 0.45 });
    const gravelMat = new THREE.MeshStandardMaterial({ map: T.gravel, roughness: 1 });
    const fleeceMat = new THREE.MeshStandardMaterial({ color: 0xf2f2ee, roughness: 0.9, transparent: true, opacity: 0.55 });
    const plasterIn = new THREE.MeshStandardMaterial({ map: T.plaster, color: 0xeeeae0, roughness: 0.95 });
    const floorMat = new THREE.MeshStandardMaterial({ map: T.mds, color: 0x8a8f8b, roughness: 0.9 });

    // foundation, wall, a slice of the Keller inside
    mesh(box(-0.3, t + 0.3, -0.4, 0, z0, z1, 1.2), footMat, root);
    const gWall = grp(root);
    mesh(box(0, t, 0, H, z0, z1, 1.6), brickMat, gWall);
    mesh(box(t, t + 0.02, 0.05, H, z0, z1, 1.2), plasterIn, root);
    mesh(box(t, t + 2.0, -0.12, 0, z0, z1, 1.4), floorMat, root, false);
    mesh(box(t - 0.02, t + 2.0, H, H + 0.2, z0, z1, 1.4), footMat, root);

    // the outer layers, bottom of the wall to just above ground
    const top = soilTop + 0.18;
    const gPrime = grp(root);
    mesh(box(-0.012, 0, 0, top, z0, z1, 1), primeMat, gPrime);
    const gCoat = grp(root);
    mesh(box(-0.035, -0.012, -0.02, top, z0, z1, 1), coatMat, gCoat);
    const cove = new THREE.Shape();
    cove.moveTo(-0.035, 0);
    cove.lineTo(-0.16, 0);
    cove.quadraticCurveTo(-0.05, 0.02, -0.035, 0.13);
    cove.lineTo(-0.035, 0);
    const coveGeo = new THREE.ExtrudeGeometry(cove, { depth: L, bevelEnabled: false });
    coveGeo.translate(0, 0, z0);
    mesh(coveGeo, coatMat, gCoat);
    const gProtect = grp(root);
    mesh(box(-0.06, -0.035, 0.02, top - 0.05, z0, z1, 0.5), protectMat, gProtect);
    const gDrain = grp(root);
    mesh(box(-0.85, -0.3, -0.4, 0.12, z0, z1, 0.6), gravelMat, gDrain);
    mesh(box(-0.87, -0.28, -0.42, 0.14, z0 + 0.001, z1 - 0.001, 1), fleeceMat, gDrain, false);
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, L, 20, 1, true), pipeMat);
    pipe.rotation.x = Math.PI / 2;
    pipe.position.set(-0.55, -0.2, 0);
    pipe.castShadow = true;
    gDrain.add(pipe);

    // soil: the trench part lowers when dug, the far part stays
    const gSoilFar = grp(root);
    mesh(box(-TR - FAR, -TR, -0.4, soilTop, z0, z1, 1.4), soilMat, gSoilFar);
    mesh(box(-TR - FAR, -TR, soilTop, soilTop + 0.05, z0, z1), grass, gSoilFar);
    const gTrench = grp(root);
    const trenchSoil = mesh(box(-TR, 0, 0, 1, z0, z1, 1.4), soilMat, gTrench);
    const trenchGrass = mesh(box(-TR, 0, 0, 0.05, z0, z1), grass, gTrench);
    const trenchBase = -0.4;

    const { p: puddle } = puddleMesh(root, t + 1.0, 0.006, 0.4, 0.8, 0.5);
    const layers = [gPrime, gCoat, gProtect, gDrain];
    return {
      group: root,
      views: {
        overview: view(-0.7, 1.0, 0.2, 8.6, -0.38, 0.5),
        trench: view(-0.45, 0.7, 0.4, 6.0, -0.28, 0.46),
        explode: view(-1.1, 0.9, 0.2, 8.6, -0.45, 0.44),
      },
      apply(s) {
        const damp = s.damp ?? 0;
        uDamp.value = lerp(0.05, 2.6, damp);
        uSalt.value = damp * 0.5;
        puddle.visible = damp > 0.02;
        puddle.scale.set(0.8 * damp, 0.5 * damp, 1);
        const dig = smooth(s.dig ?? 0);
        const h = Math.max(0.001, (soilTop - trenchBase) * (1 - dig));
        trenchSoil.scale.y = h;
        trenchSoil.position.y = trenchBase;
        trenchGrass.position.y = trenchBase + h;
        trenchSoil.visible = dig < 0.995;
        trenchGrass.visible = dig < 0.4;
        const vals = [s.prime ?? 0, s.coat ?? 0, s.protect ?? 0, s.drain ?? 0];
        const e = smooth(s.explode ?? 0);
        vals.forEach((val, i) => {
          const v = smooth(val);
          layers[i].visible = v > 0.01;
          layers[i].position.x = lerp(-0.8, 0, v) - 0.32 * (i + 1) * e;
        });
        gSoilFar.position.x = -1.5 * e;
      },
      pick: [
        ["mauerwerk", gWall],
        ["grundierung", gPrime],
        ["abdichtung", gCoat],
        ["schutz", gProtect],
        ["drainage", gDrain],
        ["erdreich", gSoilFar],
      ],
      mats: {
        mauerwerk: [brickMat],
        grundierung: [primeMat],
        abdichtung: [coatMat],
        schutz: [protectMat],
        drainage: [pipeMat, gravelMat],
        erdreich: [soilMat],
      },
      anchors: {
        mauerwerk: () => new THREE.Vector3(t / 2, H, z1),
        grundierung: () => new THREE.Vector3(-0.006, top, z1).add(gPrime.position),
        abdichtung: () => new THREE.Vector3(-0.02, top - 0.4, z1).add(gCoat.position),
        schutz: () => new THREE.Vector3(-0.05, top - 0.8, z1).add(gProtect.position),
        drainage: () => new THREE.Vector3(-0.55, 0.15, z1).add(gDrain.position),
        erdreich: () => new THREE.Vector3(-TR - 0.6, soilTop, z1).add(gSoilFar.position),
      },
      labels: (s) => ((s.explode ?? 0) > 0.6 ? ["mauerwerk", "grundierung", "abdichtung", "schutz", "drainage", "erdreich"] : []),
      front: new THREE.Vector3(-0.35, 0, 0.94).normalize(),
    };
  }

  // ==================================================== scene: Garage/Beton
  function buildGarage(): Runtime {
    const root = new THREE.Group();
    const W = 5.0;
    const H = 2.6;
    const D = 4.2;
    T.concrete.repeat.set(1, 1);
    const concrete = new THREE.MeshStandardMaterial({ map: T.concrete, roughness: 0.92 });
    const wallMat = concrete.clone();
    const floorMat = new THREE.MeshStandardMaterial({ map: T.concrete, color: 0x9a9d9b, roughness: 0.75 });
    const lineMat = new THREE.MeshStandardMaterial({ color: 0xe8c14c, roughness: 0.6 });
    // back wall with the crack, side wall, floor, ceiling
    const gWall = grp(root);
    mesh(box(-W / 2, W / 2, 0, H, -0.3, 0, 2.4), wallMat, gWall);
    mesh(box(-W / 2 - 0.3, -W / 2, 0, H, -0.3, D, 2.4), concrete, root);
    mesh(box(-W / 2 - 0.3, W / 2, -0.15, 0, -0.3, D, 2.4), floorMat, root, false);
    mesh(box(-W / 2 - 0.3, W / 2, H, H + 0.22, -0.3, D * 0.55, 2.4), concrete, root);
    mesh(box(-1.25, -1.15, 0.001, 0.006, 0.4, D - 0.3), lineMat, root, false);
    mesh(box(1.15, 1.25, 0.001, 0.006, 0.4, D - 0.3), lineMat, root, false);
    // a sectional door on the right, half open
    const doorMat = new THREE.MeshStandardMaterial({ color: 0xdadcd8, roughness: 0.5, metalness: 0.3 });
    for (let i = 0; i < 4; i++) mesh(box(W / 2 - 0.02, W / 2 + 0.03, 1.2 + i * 0.35, 1.53 + i * 0.35, 1.2, 3.6), doorMat, root);

    // the crack: a jagged line down the wall face
    const pts: THREE.Vector2[] = [];
    let seed = 5;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i <= 26; i++) {
      const f = i / 26;
      pts.push(new THREE.Vector2(lerp(-0.7, 0.45, f) + (rnd() - 0.5) * 0.07, lerp(2.45, 0.05, f)));
    }
    const ribbon = (width: number, z: number) => {
      const pos: number[] = [];
      const idx: number[] = [];
      pts.forEach((p, i) => {
        const a = pts[Math.max(0, i - 1)];
        const b = pts[Math.min(pts.length - 1, i + 1)];
        const d = new THREE.Vector2(b.x - a.x, b.y - a.y).normalize();
        const n = new THREE.Vector2(-d.y, d.x).multiplyScalar(width / 2);
        pos.push(p.x - n.x, p.y - n.y, z, p.x + n.x, p.y + n.y, z);
        if (i > 0) {
          const k = i * 2;
          idx.push(k - 2, k - 1, k, k - 1, k + 1, k);
        }
      });
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    };
    const crackMat = new THREE.MeshStandardMaterial({ color: 0x0f1213, roughness: 1, side: THREE.DoubleSide });
    const gCrack = grp(root);
    gCrack.add(new THREE.Mesh(ribbon(0.022, 0.004), crackMat));
    const wetMat = new THREE.MeshStandardMaterial({ color: 0x33424d, roughness: 0.3, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide });
    gCrack.add(new THREE.Mesh(ribbon(0.26, 0.002), wetMat));
    // water running down from the crack's end: drips drawn with alpha
    const streakTex = canvasTex(256, (g, s, rnd) => {
      g.clearRect(0, 0, s, s);
      for (let i = 0; i < 9; i++) {
        const x = s * (0.3 + rnd() * 0.4);
        const w = 6 + rnd() * 14;
        const len = s * (0.45 + rnd() * 0.5);
        const gr = g.createLinearGradient(0, 0, 0, len);
        gr.addColorStop(0, "rgba(40,56,68,0.85)");
        gr.addColorStop(1, "rgba(40,56,68,0)");
        g.fillStyle = gr;
        g.beginPath();
        g.moveTo(x - w, 0);
        g.quadraticCurveTo(x - w * 0.4, len * 0.6, x, len);
        g.quadraticCurveTo(x + w * 0.4, len * 0.6, x + w, 0);
        g.fill();
      }
    });
    const streakMat = new THREE.MeshStandardMaterial({ map: streakTex, transparent: true, opacity: 1, roughness: 0.25, depthWrite: false });
    const streak = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), streakMat);
    streak.position.set(pts[pts.length - 3].x, 0.3, 0.005);
    gCrack.add(streak);
    const { p: puddle } = puddleMesh(root, 0.5, 0.004, 0.45, 0.7, 0.4);

    // resin along the crack, filled from the bottom up
    const resinMat = new THREE.MeshStandardMaterial({ color: 0xe8b04c, emissive: 0xe8b04c, emissiveIntensity: 0.35, roughness: 0.4, side: THREE.DoubleSide });
    const resinGeo = ribbon(0.045, 0.006);
    const resin = new THREE.Mesh(resinGeo, resinMat);
    const gResin = grp(root);
    gResin.add(resin);
    const resinTris = resinGeo.index!.count;

    // packers: drilled at an angle, alternating either side of the crack
    const packerMat = new THREE.MeshStandardMaterial({ color: 0xb9c2c0, metalness: 0.8, roughness: 0.3 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x62c4ac, roughness: 0.4 });
    const patchMat = new THREE.MeshStandardMaterial({ color: 0xb4b7b5, roughness: 0.95 });
    const gPackers = grp(root);
    const packers: { g: THREE.Group; patch: THREE.Mesh }[] = [];
    for (let i = 2; i < pts.length - 1; i += 3) {
      const p = pts[i];
      const side = (i / 3) % 2 < 1 ? 1 : -1;
      const g = new THREE.Group();
      g.position.set(p.x + side * 0.09, p.y, 0);
      g.rotation.y = side * 0.35;
      const bodyGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.14, 12);
      bodyGeo.rotateX(Math.PI / 2);
      const b = new THREE.Mesh(bodyGeo, packerMat);
      b.position.z = 0.07;
      const capGeo = new THREE.CylinderGeometry(0.034, 0.034, 0.035, 14);
      capGeo.rotateX(Math.PI / 2);
      const c = new THREE.Mesh(capGeo, capMat);
      c.position.z = 0.15;
      g.add(b, c);
      gPackers.add(g);
      const patch = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), patchMat);
      patch.position.set(p.x + side * 0.09, p.y, 0.003);
      root.add(patch);
      packers.push({ g, patch });
    }

    return {
      group: root,
      views: {
        wall: view(0, 1.3, 0, 7.4, 0.42, 0.2),
        close: view(-0.1, 1.3, 0, 3.6, 0.3, 0.12),
      },
      apply(s) {
        const wet = s.wet ?? 0;
        wetMat.opacity = 0.55 * wet;
        streakMat.opacity = wet;
        streak.visible = wet > 0.02;
        puddle.visible = wet > 0.02;
        puddle.scale.set(0.7 * wet, 0.4 * wet, 1);
        const pk = s.packers ?? 0;
        const fin = s.finish ?? 0;
        packers.forEach(({ g, patch }, i) => {
          const local = clamp01(pk * 1.6 - (i / packers.length) * 0.6) * (1 - smooth(fin * 1.5));
          g.visible = local > 0.01;
          g.scale.setScalar(Math.max(0.001, local));
          patch.visible = fin > 0.4;
        });
        const r = clamp01(s.resin ?? 0);
        resin.visible = r > 0.01;
        // fill from the bottom: triangles are ordered top to bottom
        const tris = Math.floor((resinTris / 3) * r) * 3;
        resinGeo.setDrawRange(resinTris - tris, tris);
      },
      pick: [
        ["beton", gWall],
        ["riss", gCrack],
        ["packer", gPackers],
        ["harz", gResin],
      ],
      mats: { beton: [wallMat], riss: [crackMat], packer: [packerMat], harz: [resinMat] },
      anchors: {
        beton: () => new THREE.Vector3(-1.6, 2.2, 0),
        riss: () => new THREE.Vector3(pts[5].x, pts[5].y, 0),
        packer: () => {
          const p = pts[11];
          return new THREE.Vector3(p.x + 0.1, p.y, 0.1);
        },
        harz: () => new THREE.Vector3(pts[18].x, pts[18].y, 0),
      },
      labels: (s) => {
        const out = ["beton", "riss"];
        if ((s.packers ?? 0) > 0.4 && (s.finish ?? 0) < 0.5) out.push("packer");
        if ((s.resin ?? 0) > 0.4) out.push("harz");
        return out;
      },
      front: new THREE.Vector3(0, 0, 1),
    };
  }

  // ================================================== scene: Wohnraum-Ecke
  function buildWohnraum(): Runtime {
    const root = new THREE.Group();
    const H = 2.6;
    const X0 = -2.2;
    const Z0 = -2.0;
    const X1 = 2.2;
    const Z1 = 2.0;
    const wallMat = new THREE.MeshStandardMaterial({ map: T.plaster, color: 0xf1ede4, roughness: 0.95 });
    const outerMat = new THREE.MeshStandardMaterial({ map: T.plaster, color: 0xd8d2c4, roughness: 0.95 });
    const floorTex = canvasTex(256, (g, s, rnd) => {
      for (let y = 0; y < s; y += 32) {
        for (let x = -((y / 32) % 2) * 64; x < s; x += 128) {
          g.fillStyle = `hsl(30 ${30 + rnd() * 10}% ${48 + rnd() * 10}%)`;
          g.fillRect(x, y, 127, 31);
        }
      }
    });
    floorTex.repeat.set(2, 2);
    const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.6 });
    // exterior walls (the corner), floor
    const gWall = grp(root);
    mesh(box(X0 - 0.36, X1, 0, H, Z0 - 0.36, Z0, 1.4), wallMat, gWall);
    mesh(box(X0 - 0.36, X0, 0, H, Z0, Z1, 1.4), wallMat, gWall);
    mesh(box(X0 - 0.37, X1, 0, H, Z0 - 0.37, Z0 - 0.36, 1.4), outerMat, root);
    mesh(box(X0 - 0.37, X0 - 0.36, 0, H, Z0 - 0.36, Z1, 1.4), outerMat, root);
    mesh(box(X0 - 0.37, X1, -0.12, 0, Z0 - 0.37, Z1, 1), floorMat, root, false);
    // window with frame and sill, radiator below
    const glass = new THREE.MeshStandardMaterial({ color: 0xbcd4e4, roughness: 0.05, metalness: 0.2, emissive: 0xcfe3f0, emissiveIntensity: 0.5 });
    const frame = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45 });
    mesh(box(0.2, 1.5, 0.95, 2.15, Z0 - 0.02, Z0 + 0.002), glass, root, false);
    mesh(box(0.14, 1.56, 0.9, 0.95, Z0 - 0.02, Z0 + 0.06), frame, root);
    mesh(box(0.14, 1.56, 2.15, 2.21, Z0 - 0.02, Z0 + 0.03), frame, root);
    mesh(box(0.83, 0.87, 0.95, 2.15, Z0 - 0.02, Z0 + 0.03), frame, root);
    mesh(box(0.25, 1.45, 0.25, 0.8, Z0 + 0.05, Z0 + 0.15), frame, root);
    // a lived-in room: skirting, rug, sofa along the side wall, a picture
    const skirt = new THREE.MeshStandardMaterial({ color: 0xf7f5f0, roughness: 0.5 });
    mesh(box(X0, X1, 0, 0.07, Z0, Z0 + 0.018), skirt, root);
    mesh(box(X0, X0 + 0.018, 0, 0.07, Z0, Z1), skirt, root);
    const rug = new THREE.MeshStandardMaterial({ color: 0xcfc5b4, roughness: 1 });
    mesh(box(-0.6, 1.6, 0, 0.012, -0.6, 1.4), rug, root, false);
    const fabric = new THREE.MeshStandardMaterial({ color: 0x6f8478, roughness: 0.95 });
    const fabric2 = new THREE.MeshStandardMaterial({ color: 0x7f9488, roughness: 0.95 });
    const legs = new THREE.MeshStandardMaterial({ color: 0x5a4636, roughness: 0.6 });
    const sx0 = X0 + 0.14;
    const sz0 = -0.35;
    const sz1 = 1.75;
    mesh(box(sx0, sx0 + 0.9, 0.1, 0.42, sz0, sz1), fabric, root);
    mesh(box(sx0, sx0 + 0.22, 0.42, 0.88, sz0, sz1), fabric2, root);
    mesh(box(sx0, sx0 + 0.9, 0.42, 0.62, sz0, sz0 + 0.16), fabric2, root);
    mesh(box(sx0, sx0 + 0.9, 0.42, 0.62, sz1 - 0.16, sz1), fabric2, root);
    mesh(box(sx0 + 0.24, sx0 + 0.86, 0.42, 0.5, sz0 + 0.18, (sz0 + sz1) / 2 - 0.02), fabric, root);
    mesh(box(sx0 + 0.24, sx0 + 0.86, 0.42, 0.5, (sz0 + sz1) / 2 + 0.02, sz1 - 0.18), fabric, root);
    for (const [lx, lz] of [[sx0 + 0.05, sz0 + 0.05], [sx0 + 0.8, sz0 + 0.05], [sx0 + 0.05, sz1 - 0.1], [sx0 + 0.8, sz1 - 0.1]]) {
      mesh(box(lx, lx + 0.05, 0, 0.1, lz, lz + 0.05), legs, root, false);
    }
    const pictureFrame = new THREE.MeshStandardMaterial({ color: 0x2f3a35, roughness: 0.5 });
    const picture = new THREE.MeshStandardMaterial({ color: 0xa9c6b8, roughness: 0.7 });
    mesh(box(X0 + 0.05, X0 + 0.08, 1.25, 1.95, 0.2, 1.2), pictureFrame, root);
    mesh(box(X0 + 0.08, X0 + 0.085, 1.31, 1.89, 0.26, 1.14), picture, root, false);
    // the cold corner as a thermal image: warm (orange) far from the corner,
    // cold (blue) along the corner edge and along ceiling and floor
    const coldTex = canvasTex(256, (g, s) => {
      const img = g.createImageData(s, s);
      const ramp = (c: number): [number, number, number, number] => {
        // 0 warm .. 1 cold
        const stops: [number, [number, number, number]][] = [
          [0, [242, 152, 64]],
          [0.35, [246, 214, 92]],
          [0.55, [110, 205, 220]],
          [0.75, [58, 132, 228]],
          [1, [44, 62, 186]],
        ];
        let i = 0;
        while (i < stops.length - 2 && c > stops[i + 1][0]) i++;
        const [c0, a] = stops[i];
        const [c1, b] = stops[i + 1];
        const k = Math.min(1, Math.max(0, (c - c0) / (c1 - c0)));
        const alpha = 0.12 + 0.6 * Math.min(1, c * 1.15);
        return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, alpha * 255];
      };
      for (let y = 0; y < s; y++) {
        for (let x = 0; x < s; x++) {
          const u = x / s; // 0 at the corner edge
          const v = y / s; // 0 at the ceiling
          const c = Math.min(1, Math.exp(-u / 0.2) * 0.95 + Math.exp(-v / 0.1) * 0.45 + Math.exp(-(1 - v) / 0.08) * 0.4 * Math.exp(-u / 0.5));
          const [r, gg, b, a0] = ramp(c);
          // fade out towards the far edge so the image has no hard border
          const fade = Math.min(1, Math.max(0, (1 - u) / 0.45));
          const a = a0 * fade * fade * (3 - 2 * fade);
          const o = (y * s + x) * 4;
          img.data[o] = r;
          img.data[o + 1] = gg;
          img.data[o + 2] = b;
          img.data[o + 3] = a;
        }
      }
      g.putImageData(img, 0, 0);
    });
    const coldMat = new THREE.MeshBasicMaterial({ map: coldTex, transparent: true, depthWrite: false });
    const coldBack = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.6), coldMat);
    coldBack.position.set(X0 + 1.2, H / 2, Z0 + 0.004);
    const coldSide = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.6), coldMat);
    coldSide.rotation.y = Math.PI / 2;
    coldSide.position.set(X0 + 0.004, H / 2, Z0 + 1.2);
    coldSide.scale.x = -1;
    root.add(coldBack, coldSide);
    // mould in the corner
    // mould grows from the corner edge, densest at ceiling and floor
    const mouldTex = canvasTex(512, (g, s, rnd) => {
      g.clearRect(0, 0, s, s);
      for (let i = 0; i < 4200; i++) {
        const x = Math.pow(rnd(), 2.2) * s;
        const y = rnd() < 0.72 ? Math.pow(rnd(), 1.8) * s * 0.42 : s - Math.pow(rnd(), 1.6) * s * 0.18;
        const r = 0.6 + rnd() * (3.2 - (x / s) * 2.4);
        g.fillStyle = `hsla(${90 + rnd() * 60} 18% ${10 + rnd() * 14}% / ${0.35 + rnd() * 0.5})`;
        g.beginPath();
        g.arc(x, y, r, 0, Math.PI * 2);
        g.fill();
      }
    });
    const mouldMat = new THREE.MeshStandardMaterial({ map: mouldTex, roughness: 1, transparent: true, depthWrite: false });
    const gMould = grp(root);
    const mBack = new THREE.Mesh(new THREE.PlaneGeometry(1.6, H), mouldMat);
    mBack.position.set(X0 + 0.8, H / 2, Z0 + 0.006);
    const mSide = new THREE.Mesh(new THREE.PlaneGeometry(1.6, H), mouldMat);
    mSide.rotation.y = Math.PI / 2;
    mSide.scale.x = -1;
    mSide.position.set(X0 + 0.006, H / 2, Z0 + 0.8);
    gMould.add(mBack, mSide);
    // stripped areas, then the boards, then paint
    const stripMat = new THREE.MeshStandardMaterial({ map: T.mds, color: 0xc3bdb0, roughness: 1 });
    const gStrip = grp(root);
    mesh(box(X0, X0 + 1.4, 0.02, H - 0.02, Z0, Z0 + 0.003), stripMat, gStrip, false);
    mesh(box(X0, X0 + 0.003, 0.02, H - 0.02, Z0, Z0 + 1.4), stripMat, gStrip, false);
    const boardMat = new THREE.MeshStandardMaterial({ map: T.calsil, color: 0xe6e0d2, roughness: 0.85 });
    const gBoard = grp(root);
    mesh(box(X0, 0.08, 0.02, H - 0.02, Z0, Z0 + 0.035), boardMat, gBoard);
    mesh(box(X0, X0 + 0.035, 0.02, H - 0.02, Z0 + 0.035, Z1), boardMat, gBoard);
    return {
      group: root,
      views: {
        room: view(-0.4, 1.2, -0.4, 7.6, 0.5, 0.3),
        corner: view(-1.6, 1.5, -1.4, 4.4, 0.78, 0.16),
      },
      apply(s) {
        const mould = s.mould ?? 0;
        gMould.visible = mould > 0.02;
        mouldMat.opacity = mould;
        coldMat.opacity = s.cold ?? 0;
        coldBack.visible = coldSide.visible = (s.cold ?? 0) > 0.02;
        const strip = smooth(s.strip ?? 0);
        gStrip.visible = strip > 0.02 && (s.board ?? 0) < 0.98;
        stripMat.opacity = strip;
        const b = smooth(s.board ?? 0);
        gBoard.visible = b > 0.01;
        gBoard.position.set(lerp(0.9, 0, b), 0, lerp(0.9, 0, b));
        boardMat.color.setHex(0xe6e0d2).lerp(new THREE.Color(0xffffff), smooth(s.paint ?? 0));
      },
      pick: [
        ["aussenwand", gWall],
        ["schimmel", gMould],
        ["klimaplatte", gBoard],
      ],
      mats: { aussenwand: [wallMat], schimmel: [mouldMat], klimaplatte: [boardMat], anstrich: [boardMat] },
      anchors: {
        aussenwand: () => new THREE.Vector3(X0 + 2.0, H - 0.2, Z0),
        schimmel: () => new THREE.Vector3(X0 + 0.3, 2.3, Z0 + 0.1),
        klimaplatte: () => new THREE.Vector3(X0 + 0.1, 1.6, Z0 + 1.6).add(gBoard.position),
        anstrich: () => new THREE.Vector3(X0 + 0.9, 1.0, Z0 + 0.1).add(gBoard.position),
      },
      labels: (s) => {
        const out = ["aussenwand"];
        if ((s.mould ?? 0) > 0.3) out.push("schimmel");
        if ((s.board ?? 0) > 0.4) out.push("klimaplatte");
        if ((s.paint ?? 0) > 0.4) out.push("anstrich");
        return out;
      },
      front: new THREE.Vector3(0.6, 0, 0.8).normalize(),
    };
  }

  const BUILDERS: Record<string, () => Runtime> = {
    "keller-innen": buildKellerInnen,
    "keller-aussen": buildKellerAussen,
    garage: buildGarage,
    wohnraum: buildWohnraum,
  };

  // ---------------------------------------------------------------- controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 2.5;
  controls.maxDistance = 22;
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = 1.52;
  controls.rotateSpeed = 0.7;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.55;
  // The model loads only on request, so on the stage every gesture belongs
  // to it: one finger turns (all directions), two fingers zoom. The page
  // still scrolls outside the stage.
  renderer.domElement.style.touchAction = "none";
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE };
  let userTouched = false;
  let goalTarget = new THREE.Vector3();
  let goalDist: number | null = null;
  let goalDir: THREE.Vector3 | null = null;
  const stopAuto = () => {
    if (!userTouched) {
      userTouched = true;
      controls.autoRotate = false;
      opts.onInteract?.();
    }
  };
  controls.addEventListener("start", () => {
    stopAuto();
    goalDist = null;
    goalDir = null;
  });
  controls.addEventListener("change", () => (dirty = true));

  // ------------------------------------------------------------- scene state
  let rt: Runtime | null = null;
  let def: SceneDef | null = null;
  let cur: State = {};
  let goal: State = {};
  let firstView = "";
  let selected: string | null = null;
  // the layer the current step works on: always labelled
  let stepLayer: string | null = null;
  let pulse = 0;
  const chips = new Map<string, HTMLButtonElement>();

  function disposeGroup(g: THREE.Object3D) {
    g.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
  }

  function loadScene(d: SceneDef) {
    if (rt) {
      scene.remove(rt.group);
      disposeGroup(rt.group);
    }
    chips.forEach((el) => el.remove());
    chips.clear();
    def = d;
    rt = BUILDERS[d.id]();
    scene.add(rt.group);
    const first = d.steps[0];
    cur = { ...first.state };
    goal = { ...first.state };
    firstView = first.view;
    const v = rt.views[first.view];
    controls.target.copy(v.target);
    camera.position.copy(v.target).addScaledVector(v.dir, v.dist);
    goalTarget = v.target.clone();
    goalDist = null;
    goalDir = null;
    controls.autoRotate = !userTouched;
    d.layers.forEach((l, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hv-chip";
      b.tabIndex = -1;
      b.innerHTML = `<span>${i + 1}</span>${l.short}`;
      b.addEventListener("click", () => opts.onPick?.(l.id));
      host.appendChild(b);
      chips.set(l.id, b);
    });
    selected = null;
    stepLayer = first.layer;
    rt.apply(cur);
    dirty = true;
  }

  function highlight(dt: number) {
    if (!rt) return;
    pulse += dt;
    for (const [id, mats] of Object.entries(rt.mats)) {
      const on = id === selected;
      for (const m of mats) {
        if (!m.userData.baseEmissive) {
          m.userData.baseEmissive = m.emissive.getHex();
          m.userData.baseIntensity = m.emissiveIntensity;
        }
        if (on) {
          m.emissive.setHex(0x62c4ac);
          m.emissiveIntensity = 0.2 + 0.12 * Math.sin(pulse * 4);
        } else {
          m.emissive.setHex(m.userData.baseEmissive);
          m.emissiveIntensity = m.userData.baseIntensity;
        }
      }
    }
  }

  // ------------------------------------------------------------ picking
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let down: { x: number; y: number } | null = null;
  const onDown = (e: PointerEvent) => (down = { x: e.clientX, y: e.clientY });
  const onUp = (e: PointerEvent) => {
    if (!rt || !down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(rt.pick.map(([, g]) => g), true)[0];
    if (!hit) return;
    const found = rt.pick.find(([, g]) => {
      let o: THREE.Object3D | null = hit.object;
      while (o) {
        if (o === g) return true;
        o = o.parent;
      }
      return false;
    });
    if (found) opts.onPick?.(found[0]);
  };
  renderer.domElement.addEventListener("pointerdown", onDown);
  renderer.domElement.addEventListener("pointerup", onUp);

  // ---------------------------------------------------------------- frame
  let w = 1;
  let h = 1;
  const resize = () => {
    w = host.clientWidth || 1;
    h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    dirty = true;
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const v3 = new THREE.Vector3();
  const offset = new THREE.Vector3();
  function placeChips() {
    if (!rt) return;
    const visible = new Set(rt.labels(cur));
    if (stepLayer) visible.add(stepLayer);
    offset.copy(camera.position).sub(controls.target).normalize();
    const facing = offset.dot(rt.front) > 0.15;
    const placed: { x: number; y: number; w: number; h: number }[] = [];
    const items: { el: HTMLButtonElement; x: number; y: number }[] = [];
    chips.forEach((el, id) => {
      const fn = rt!.anchors[id];
      if (!fn) return;
      v3.copy(fn()).project(camera);
      const sx = (v3.x * 0.5 + 0.5) * w;
      const sy = (-v3.y * 0.5 + 0.5) * h;
      const on = facing && visible.has(id) && v3.z < 1 && sx > -20 && sx < w + 20 && sy > 0 && sy < h;
      el.classList.toggle("is-on", on);
      el.classList.toggle("is-selected", id === selected);
      if (on) items.push({ el, x: sx, y: sy });
    });
    items.sort((a, b) => a.x - b.x);
    for (const it of items) {
      const lw = it.el.offsetWidth;
      const lh = it.el.offsetHeight;
      const x = Math.min(Math.max(6, it.x - lw / 2), w - lw - 6);
      let y = Math.max(6, it.y - lh - 10);
      for (let guard = 0; guard < 10; guard++) {
        const hit = placed.find((r) => x < r.x + r.w + 4 && x + lw + 4 > r.x && y < r.y + r.h + 4 && y + lh + 4 > r.y);
        if (!hit) break;
        y = hit.y + hit.h + 6;
      }
      placed.push({ x, y, w: lw, h: lh });
      it.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  }

  let raf = 0;
  let running = false;
  let last = performance.now();
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!rt) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const k = 1 - Math.exp(-dt * 3.2);
    let moving = false;
    const keys = new Set([...Object.keys(cur), ...Object.keys(goal)]);
    keys.forEach((key) => {
      const a = cur[key] ?? 0;
      const b = goal[key] ?? 0;
      if (Math.abs(b - a) > 0.001) {
        cur[key] = a + (b - a) * k;
        moving = true;
      } else cur[key] = b;
    });
    const kc = 1 - Math.exp(-dt * 2.6);
    if (controls.target.distanceTo(goalTarget) > 0.01) {
      controls.target.lerp(goalTarget, kc);
      moving = true;
    }
    if (goalDist !== null || goalDir !== null) {
      offset.copy(camera.position).sub(controls.target);
      const dist = offset.length();
      const next = goalDist !== null ? lerp(dist, goalDist, kc) : dist;
      offset.normalize();
      if (goalDir) {
        offset.lerp(goalDir, kc).normalize();
        if (offset.angleTo(goalDir) < 0.003) goalDir = null;
      }
      if (goalDist !== null && Math.abs(dist - goalDist) < 0.02) goalDist = null;
      camera.position.copy(controls.target).addScaledVector(offset, next);
      moving = true;
    }
    const changed = controls.update();
    if (moving || changed || dirty || selected || controls.autoRotate) {
      dirty = false;
      rt.apply(cur);
      highlight(dt);
      renderer.render(scene, camera);
      placeChips();
    }
  };
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        dirty = true;
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    },
    { rootMargin: "10% 0px" }
  );
  io.observe(host);

  return {
    loadScene,
    setStep(step) {
      if (!rt) return;
      goal = { ...step.state };
      stepLayer = step.layer;
      const v = rt.views[step.view] ?? rt.views[firstView];
      goalTarget = v.target.clone();
      goalDist = v.dist;
      goalDir = v.dir.clone();
      if (step.view !== firstView) controls.autoRotate = false;
      else if (!userTouched) controls.autoRotate = true;
      dirty = true;
    },
    select(id) {
      selected = id;
      dirty = true;
    },
    zoom(factor) {
      stopAuto();
      offset.copy(camera.position).sub(controls.target);
      goalDist = THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance);
      dirty = true;
    },
    reset() {
      if (!rt || !def) return;
      const v = rt.views[firstView];
      goalTarget = v.target.clone();
      goalDist = v.dist;
      goalDir = v.dir.clone();
      controls.autoRotate = false;
      dirty = true;
    },
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      chips.forEach((el) => el.remove());
      if (rt) disposeGroup(rt.group);
      Object.values(T).forEach((t) => t.dispose());
      pmrem.dispose();
      envTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
