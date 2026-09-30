/**
 * The interactive 3D house: a Bergisch house (slate roof, white frames, green
 * shutters) cut open down to a wet Keller. The visitor turns it 360° and
 * zooms; the procedure steps animate the Keller wall from wet to fully
 * sealed, and the last step fans the wall into its layers. Loaded on demand,
 * so three.js never sits on the first-paint path.
 *
 * Brick maps are photographed PBR textures; soil, slurry, plaster and board
 * are rendered texture maps (see /public/textures). The slate is drawn on a
 * canvas at load.
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { WallLayer } from "@/data/layers";
import type { ModelState, ProcedureStep } from "@/data/procedure";

const H = 2.4; // Keller wall height, metres
const L = 4.0; // basement depth along the cut wall
const ROOM = 4.6; // basement width
const BAR_Y0 = 0.14;
const BAR_Y1 = 0.26;
const GAP = 0.95; // explosion spacing across the Keller floor

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => {
  x = clamp01(x);
  return x * x * (3 - 2 * x);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Box already placed at its rest position, with UVs in world metres so textures never stretch. */
function worldBox(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, tile: number) {
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

/** Natural slate, staggered courses, drawn once on a canvas. */
function slateTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = "#1c2024";
  g.fillRect(0, 0, 512, 512);
  const rows = 16;
  const h = 512 / rows;
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let r = 0; r < rows; r++) {
    const w = 36;
    for (let x = (r % 2) * (w / 2) - w; x < 512 + w; x += w) {
      const l = 30 + rnd() * 14;
      g.fillStyle = `hsl(210 8% ${l}%)`;
      g.beginPath();
      g.moveTo(x + 1.5, r * h + 1.5);
      g.lineTo(x + w - 1.5, r * h + 1.5);
      g.lineTo(x + w - 1.5, r * h + h - 7);
      g.quadraticCurveTo(x + w / 2, r * h + h + 2, x + 1.5, r * h + h - 7);
      g.closePath();
      g.fill();
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export interface HouseViewer {
  setStep: (step: ProcedureStep) => void;
  select: (layerId: string | null) => void;
  zoom: (factor: number) => void;
  reset: () => void;
  dispose: () => void;
}

export interface ViewerOptions {
  layers: WallLayer[];
  initial: ProcedureStep;
  onPick?: (layerId: string) => void;
  onInteract?: () => void;
}

export function createHouseViewer(host: HTMLElement, opts: ViewerOptions): HouseViewer {
  const { layers } = opts;
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
  scene.environmentIntensity = 0.5;

  const sun = new THREE.DirectionalLight(0xfff1dc, 2.5);
  sun.position.set(7, 11, 8);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.radius = 5;
  sun.shadow.bias = -0.0004;
  const sc = sun.shadow.camera as THREE.OrthographicCamera;
  sc.left = -7;
  sc.right = 10;
  sc.top = 10;
  sc.bottom = -6;
  sc.near = 1;
  sc.far = 40;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xdcefe8, 0x1a1410, 0.55));
  const rim = new THREE.DirectionalLight(0x62c4ac, 0.55);
  rim.position.set(-5, 3, -4);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);

  // ---------------------------------------------------------------- textures
  const loader = new THREE.TextureLoader();
  let dirty = true;
  const tex = (url: string, color = true) => {
    // on error the material simply renders without that map
    const t = loader.load(url, () => (dirty = true), undefined, () => (dirty = true));
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    return t;
  };
  const brickMap = tex("/textures/brick-color.webp");
  const brickBump = tex("/textures/brick-bump.webp", false);
  const brickRough = tex("/textures/brick-rough.webp", false);
  const soilMap = tex("/textures/soil.webp");
  const mdsMap = tex("/textures/mds.webp");
  const plasterMap = tex("/textures/plaster.webp");
  const calsilMap = tex("/textures/calsil.webp");
  const slate = slateTexture();
  slate.repeat.set(0.55, 0.55);

  // Damp is a shader tint on the masonry, keyed to the rest-position height,
  // so it stays glued to the bricks when the stack fans apart.
  const uDamp = { value: 1.55 };
  const uSalt = { value: 1 };
  const dampify = (m: THREE.MeshStandardMaterial) => {
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uDamp = uDamp;
      sh.uniforms.uSalt = uSalt;
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
  };

  const brickOpts = { map: brickMap, bumpMap: brickBump, bumpScale: 1.4, roughnessMap: brickRough, roughness: 1 };
  const brickMat = new THREE.MeshStandardMaterial(brickOpts);
  dampify(brickMat);
  const soilMat = new THREE.MeshStandardMaterial({ map: soilMap, roughness: 1 });
  const mdsMat = new THREE.MeshStandardMaterial({ map: mdsMap, roughness: 0.8 });
  const plasterMat = new THREE.MeshStandardMaterial({ map: plasterMap, roughness: 0.92 });
  const calsilMat = new THREE.MeshStandardMaterial({ map: calsilMap, roughness: 0.85 });
  const floorMat = new THREE.MeshStandardMaterial({ map: mdsMap, color: 0x8a8f8b, roughness: 0.9 });
  const barrierMat = new THREE.MeshStandardMaterial({
    color: 0x62c4ac,
    emissive: 0x62c4ac,
    emissiveIntensity: 0.3,
    roughness: 0.35,
    metalness: 0.05,
  });
  const packerMat = new THREE.MeshStandardMaterial({ color: 0xb9c2c0, metalness: 0.8, roughness: 0.3 });
  const capMat = new THREE.MeshStandardMaterial({ color: 0x62c4ac, roughness: 0.4 });

  // ---------------------------------------------------------------- geometry
  const byId = Object.fromEntries(layers.map((l) => [l.id, l]));
  const tM = byId.mauerwerk?.t ?? 0.42;
  const tS = byId.erdreich?.t ?? 0.7;
  const tA = byId.innenabdichtung?.t ?? 0.05;
  const tP = byId.sanierputz?.t ?? 0.06;
  const tK = byId.klimaplatte?.t ?? 0.05;
  const z0 = -L / 2;
  const z1 = L / 2;
  const xM0 = -tM;
  const xS0 = xM0 - tS;
  const xA1 = tA;
  const xP1 = xA1 + tP;
  const xK1 = xP1 + tK;
  const soilTop = H * 0.84;

  const root = new THREE.Group();
  scene.add(root);

  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D, shadow = true) => {
    const o = new THREE.Mesh(g, m);
    o.castShadow = shadow;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  };

  // the cut Keller wall, one group per layer (these are pickable)
  const gSoil = new THREE.Group();
  mesh(worldBox(xS0, xM0, -0.3, soilTop, z0, z1, 1.4), soilMat, gSoil);
  const water = new THREE.Mesh(
    worldBox(xS0 - 0.002, xM0 - 0.001, -0.3, 0.12, z0 - 0.002, z1 + 0.002, 1),
    new THREE.MeshStandardMaterial({ color: 0x3b6ea8, transparent: true, opacity: 0.42, roughness: 0.2 })
  );
  gSoil.add(water);

  const gMasonry = new THREE.Group();
  mesh(worldBox(xM0, 0, -0.3, BAR_Y0, z0, z1, 1.6), brickMat, gMasonry);
  mesh(worldBox(xM0, 0, BAR_Y1, H, z0, z1, 1.6), brickMat, gMasonry);
  const slot = mesh(worldBox(xM0, 0, BAR_Y0, BAR_Y1, z0, z1, 1.6), brickMat, gMasonry);

  const gBarrier = new THREE.Group();
  const barrierGeo = new THREE.BoxGeometry(tM + 0.004, BAR_Y1 - BAR_Y0 + 0.004, L + 0.004);
  barrierGeo.translate(xM0 / 2, (BAR_Y0 + BAR_Y1) / 2, L / 2);
  const barrier = mesh(barrierGeo, barrierMat, gBarrier);
  barrier.position.z = z0;
  barrier.scale.z = 0.0001;

  const packers: THREE.Group[] = [];
  const packerGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.1, 10);
  packerGeo.rotateZ(Math.PI / 2);
  const capGeo = new THREE.CylinderGeometry(0.022, 0.022, 0.025, 12);
  capGeo.rotateZ(Math.PI / 2);
  for (let z = z0 + 0.1; z < z1 - 0.05; z += 0.2) {
    // SchimmelPeter: holes up to 20 cm apart
    const g = new THREE.Group();
    const body = new THREE.Mesh(packerGeo, packerMat);
    body.position.set(0.03, (BAR_Y0 + BAR_Y1) / 2, z);
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0.085, (BAR_Y0 + BAR_Y1) / 2, z);
    g.add(body, cap);
    g.visible = false;
    gMasonry.add(g);
    packers.push(g);
  }

  const gSeal = new THREE.Group();
  mesh(worldBox(0, xA1, 0, H, z0, z1, 1.2), mdsMat, gSeal);
  const cove = new THREE.Shape();
  cove.moveTo(xA1, 0);
  cove.lineTo(xA1 + 0.12, 0);
  cove.quadraticCurveTo(xA1 + 0.02, 0.02, xA1, 0.12);
  cove.lineTo(xA1, 0);
  const coveGeo = new THREE.ExtrudeGeometry(cove, { depth: L, bevelEnabled: false });
  coveGeo.translate(0, 0, z0);
  mesh(coveGeo, mdsMat, gSeal);

  const gPlaster = new THREE.Group();
  mesh(worldBox(xA1, xP1, 0.12, H, z0, z1, 1.2), plasterMat, gPlaster);
  const gBoard = new THREE.Group();
  mesh(worldBox(xP1, xK1, 0.14, H, z0, z1, 1.0), calsilMat, gBoard);

  const floor = mesh(worldBox(xA1, ROOM, -0.14, 0, z0, z1, 1.4), floorMat, root, false);
  floor.receiveShadow = true;

  root.add(gSoil, gMasonry, gBarrier, gSeal, gPlaster, gBoard);
  const interior = [gSeal, gPlaster, gBoard];
  const pickGroups: [string, THREE.Group][] = [
    ["erdreich", gSoil],
    ["mauerwerk", gMasonry],
    ["horizontalsperre", gBarrier],
    ["innenabdichtung", gSeal],
    ["sanierputz", gPlaster],
    ["klimaplatte", gBoard],
  ];
  const layerMats: Record<string, THREE.MeshStandardMaterial[]> = {
    erdreich: [soilMat],
    mauerwerk: [brickMat],
    horizontalsperre: [barrierMat],
    innenabdichtung: [mdsMat],
    sanierputz: [plasterMat],
    klimaplatte: [calsilMat],
  };

  // ------------------------------------------------------------------ house
  const house = new THREE.Group();
  root.add(house);
  const houseBrick = new THREE.MeshStandardMaterial(brickOpts);
  dampify(houseBrick);
  const houseSoil = new THREE.MeshStandardMaterial({ map: soilMap, roughness: 1 });
  const grass = new THREE.MeshStandardMaterial({ color: 0x4a6b3c, roughness: 1 });
  const slab = new THREE.MeshStandardMaterial({ map: mdsMap, color: 0x9a9e9a, roughness: 0.9 });
  const facade = new THREE.MeshStandardMaterial({ map: plasterMap, color: 0xf4f1e8, roughness: 0.95 });
  const roofMat = new THREE.MeshStandardMaterial({ map: slate, roughness: 0.55, metalness: 0.15 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x2a2416, emissive: 0xf1cf7a, emissiveIntensity: 0.75 });
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xf6f4ee, roughness: 0.5 });
  const shutterMat = new THREE.MeshStandardMaterial({ color: 0x2f5a3c, roughness: 0.7 });
  const puddleMat = new THREE.MeshStandardMaterial({ color: 0x3b6ea8, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.7 });
  const mouldMat = new THREE.MeshStandardMaterial({ color: 0x223024, roughness: 1, transparent: true });
  const zB = z0 - tM; // outer face of the back wall
  const top = H + 0.22; // ground-floor level
  const up = H + 2.9; // eaves
  const xR = ROOM + tM; // outer face of the right wall

  // basement: back and right walls, damp like the cut wall
  mesh(worldBox(xM0, xR, -0.3, H, zB, z0, 1.6), houseBrick, house);
  mesh(worldBox(ROOM, xR, -0.3, H, z0, z1, 1.6), houseBrick, house);
  // the garden: soil around the Keller, cut open at the front and left
  const G = 2.4; // garden reach beyond the house
  mesh(worldBox(xS0, xR + tS + G, -0.3, soilTop, zB - tS - G, zB, 1.4), houseSoil, house);
  mesh(worldBox(xR, xR + tS + G, -0.3, soilTop, zB, z1, 1.4), houseSoil, house);
  mesh(worldBox(xS0, xR + tS + G, soilTop, soilTop + 0.05, zB - tS - G, zB, 1), grass, house);
  mesh(worldBox(xR, xR + tS + G, soilTop, soilTop + 0.05, zB, z1, 1), grass, house);
  mesh(worldBox(xS0, xM0, soilTop, soilTop + 0.05, z0, z1, 1), grass, house);
  // a paved path to the side door
  mesh(worldBox(xR + 0.1, xR + tS + G, soilTop + 0.05, soilTop + 0.07, -0.35, 0.45, 1), slab, house);
  // ceiling slab and the ground floor above
  mesh(worldBox(xM0, xR, H, top, zB, z1, 1.4), slab, house);
  mesh(worldBox(ROOM, xR, top, up, zB, z1, 1.2), facade, house);
  mesh(worldBox(xM0, xR, top, up, zB, z0, 1.2), facade, house);
  mesh(worldBox(xM0, 0, top, up, z0, z1, 1.2), facade, house);
  mesh(worldBox(xM0, xR, up, up + 0.16, zB, z1, 1.4), slab, house);
  // windows with white frames and green shutters (the Bergisch look)
  const windowAt = (zc: number, y0: number, y1: number, w: number) => {
    mesh(worldBox(xR, xR + 0.02, y0, y1, zc - w / 2, zc + w / 2, 1), glass, house, false);
    mesh(worldBox(xR, xR + 0.05, y0 - 0.06, y0, zc - w / 2 - 0.08, zc + w / 2 + 0.08, 1), frameMat, house);
    mesh(worldBox(xR, xR + 0.04, y1, y1 + 0.06, zc - w / 2 - 0.06, zc + w / 2 + 0.06, 1), frameMat, house);
    mesh(worldBox(xR, xR + 0.035, y0, y1, zc - 0.02, zc + 0.02, 1), frameMat, house, false);
    mesh(worldBox(xR, xR + 0.035, (y0 + y1) / 2 - 0.02, (y0 + y1) / 2 + 0.02, zc - w / 2, zc + w / 2, 1), frameMat, house, false);
    for (const s of [-1, 1]) {
      const zs = zc + s * (w / 2 + 0.22);
      mesh(worldBox(xR, xR + 0.05, y0, y1, zs - 0.2, zs + 0.2, 1), shutterMat, house);
    }
  };
  windowAt(-1.15, top + 0.9, top + 2.1, 0.8);
  windowAt(1.25, top + 0.9, top + 2.1, 0.8);
  // side door with a small canopy
  mesh(worldBox(xR, xR + 0.03, top, top + 2.05, -0.3, 0.4, 1), shutterMat, house);
  mesh(worldBox(xR, xR + 0.05, top + 2.05, top + 2.12, -0.38, 0.48, 1), frameMat, house);
  mesh(worldBox(xR, xR + 0.45, top + 2.3, top + 2.36, -0.5, 0.6, 1), slab, house);
  // steps down from the door to the path
  mesh(worldBox(xR, xR + 0.35, soilTop + 0.05, top, -0.3, 0.4, 1), slab, house);
  // gable roof along z, slate
  const ridge = new THREE.Shape();
  const rx0 = xM0 - 0.35;
  const rx1 = xR + 0.35;
  ridge.moveTo(rx0, 0);
  ridge.lineTo(rx1, 0);
  ridge.lineTo((rx0 + rx1) / 2, 1.9);
  ridge.lineTo(rx0, 0);
  const roofGeo = new THREE.ExtrudeGeometry(ridge, { depth: z1 - zB + 0.6, bevelEnabled: false });
  roofGeo.translate(0, up + 0.16, zB - 0.3);
  mesh(roofGeo, roofMat, house);
  // chimney through the back slope
  const chimneyMat = new THREE.MeshStandardMaterial({ map: brickMap, color: 0xb8a89c, roughness: 1 });
  mesh(worldBox(3.3, 3.8, up + 0.6, up + 2.45, zB + 0.3, zB + 0.8, 0.8), chimneyMat, house);
  mesh(worldBox(3.24, 3.86, up + 2.45, up + 2.55, zB + 0.24, zB + 0.86, 1), slab, house);
  // what is wrong with this Keller: standing water and mould in the cold corner
  const puddle = new THREE.Mesh(new THREE.CircleGeometry(1, 40), puddleMat);
  puddle.rotation.x = -Math.PI / 2;
  puddle.position.set(2.4, 0.006, 0.2);
  house.add(puddle);
  const mould = new THREE.Group();
  [
    [3.9, 2.05, 0.22],
    [4.2, 1.85, 0.14],
    [3.6, 2.2, 0.1],
    [4.35, 2.2, 0.09],
    [3.75, 1.7, 0.08],
  ].forEach(([x, y, r]) => {
    const m = new THREE.Mesh(new THREE.CircleGeometry(r, 20), mouldMat);
    m.position.set(x, y, z0 + 0.004);
    mould.add(m);
  });
  house.add(mould);

  // soft contact shadow under the whole model
  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = shadowCanvas.height = 128;
  const sg = shadowCanvas.getContext("2d")!;
  const grad = sg.createRadialGradient(64, 64, 8, 64, 64, 64);
  grad.addColorStop(0, "rgba(0,0,0,0.55)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  sg.fillStyle = grad;
  sg.fillRect(0, 0, 128, 128);
  const contact = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 13),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false })
  );
  contact.rotation.x = -Math.PI / 2;
  contact.position.set(2.6, -0.32, -1.6);
  root.add(contact);

  // ---------------------------------------------------------------- controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.minDistance = 5;
  controls.maxDistance = 30;
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = 1.5;
  controls.rotateSpeed = 0.7;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;
  // Sideways drags turn the house; vertical swipes on a phone keep scrolling the page.
  renderer.domElement.style.touchAction = "pan-y";

  // Each step frames its subject from the angle that explains it best:
  // the whole house, the cut Keller wall from the room side, the fanned stack.
  const dirAt = (azimuth: number, rise: number) => new THREE.Vector3(Math.sin(azimuth), rise, Math.cos(azimuth)).normalize();
  const FOCUS = {
    house: { target: new THREE.Vector3(2.1, 3.0, -0.6), dist: 19, dir: dirAt(0.62, 0.34) },
    wall: { target: new THREE.Vector3(0.1, 1.1, 0.1), dist: 8.2, dir: dirAt(0.78, 0.26) },
    explode: { target: new THREE.Vector3(1.7, 2.6, -0.3), dist: 16, dir: dirAt(0.56, 0.36) },
  } as const;
  const home = FOCUS.house.dir.clone();
  controls.target.copy(FOCUS.house.target);
  camera.position.copy(FOCUS.house.target).addScaledVector(home, FOCUS.house.dist);
  controls.update();

  let goalTarget = FOCUS.house.target.clone();
  let goalDist: number | null = FOCUS.house.dist;
  let goalDir: THREE.Vector3 | null = null;
  let userTouched = false;
  const stopAuto = () => {
    if (!userTouched) {
      userTouched = true;
      controls.autoRotate = false;
      opts.onInteract?.();
    }
  };
  controls.addEventListener("start", () => {
    stopAuto();
    // the visitor's own angle and zoom win over the step's framing
    goalDist = null;
    goalDir = null;
  });
  controls.addEventListener("change", () => (dirty = true));

  // --------------------------------------------------------------- state
  const cur: ModelState = { ...opts.initial.state };
  let goal: ModelState = { ...opts.initial.state };
  let selected: string | null = null;
  let pulse = 0;

  function apply(s: ModelState) {
    // damp front: from the salt line (1.55 m) down to just above the barrier
    uDamp.value = lerp(BAR_Y0 + 0.02, 1.55, s.damp);
    uSalt.value = s.damp;
    puddle.visible = s.damp > 0.02;
    puddle.scale.set(1.3 * s.damp, 0.8 * s.damp, 1);
    mould.visible = s.damp > 0.02;
    mouldMat.opacity = s.damp;

    const showPackers = s.packers * (1 - smooth(s.seal * 2));
    packers.forEach((g, i) => {
      const local = clamp01(showPackers * 1.6 - (i / packers.length) * 0.6);
      g.visible = local > 0.01 && s.explode < 0.5;
      g.position.x = lerp(0.4, 0, local);
    });

    barrier.scale.z = Math.max(0.0001, s.barrier);
    barrier.visible = s.barrier > 0.001;
    slot.visible = s.barrier < 0.999;

    const layerVals = [s.seal, s.plaster, s.board];
    interior.forEach((g, i) => {
      const v = smooth(layerVals[i]);
      g.visible = v > 0.01;
      g.position.x = lerp(1.6, 0, v) + GAP * (i + 1) * s.explode;
    });
    const e = smooth(s.explode);
    gSoil.position.x = -GAP * 0.9 * e;
    gBarrier.position.set(0, 1.25 * e + 0.12 * Math.sin(e * Math.PI), 0);
  }

  function highlight(dt: number) {
    pulse += dt;
    for (const [id, mats] of Object.entries(layerMats)) {
      const on = id === selected;
      for (const m of mats) {
        if (m === barrierMat) {
          m.emissiveIntensity = on ? 0.55 + 0.25 * Math.sin(pulse * 4) : 0.3;
        } else {
          m.emissive.setHex(0x62c4ac);
          m.emissiveIntensity = on ? 0.18 + 0.1 * Math.sin(pulse * 4) : 0;
        }
      }
    }
  }

  // ------------------------------------------------------------ labels
  const chips = new Map<string, HTMLButtonElement>();
  const anchors: Record<string, () => THREE.Vector3> = {
    erdreich: () => new THREE.Vector3((xS0 + xM0) / 2, soilTop, z1).add(gSoil.position),
    mauerwerk: () => new THREE.Vector3(xM0 / 2, H, z1).add(gMasonry.position),
    horizontalsperre: () => new THREE.Vector3(xM0 / 2, BAR_Y1, z1).add(gBarrier.position),
    innenabdichtung: () => new THREE.Vector3(xA1 / 2, H, z1).add(gSeal.position),
    sanierputz: () => new THREE.Vector3((xA1 + xP1) / 2, H, z1).add(gPlaster.position),
    klimaplatte: () => new THREE.Vector3((xP1 + xK1) / 2, H, z1).add(gBoard.position),
  };
  layers.forEach((l, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "hv-chip";
    b.tabIndex = -1;
    b.innerHTML = `<span>${i + 1}</span>${l.short}`;
    b.addEventListener("click", () => opts.onPick?.(l.id));
    host.appendChild(b);
    chips.set(l.id, b);
  });

  // ------------------------------------------------------------ picking
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let down: { x: number; y: number } | null = null;
  const onDown = (e: PointerEvent) => (down = { x: e.clientX, y: e.clientY });
  const onUp = (e: PointerEvent) => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(pickGroups.map(([, g]) => g), true)[0];
    if (!hit) return;
    const found = pickGroups.find(([, g]) => {
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

  const v = new THREE.Vector3();
  const offset = new THREE.Vector3();
  function placeChips() {
    // labels only while the cut face (front, +z) is turned towards the viewer
    const show = cur.explode > 0.6 && camera.position.z > z1 + 1;
    const placed: { x: number; y: number; w: number; h: number }[] = [];
    const items: { el: HTMLButtonElement; x: number; y: number }[] = [];
    chips.forEach((el, id) => {
      v.copy(anchors[id]()).add(root.position).project(camera);
      const sx = (v.x * 0.5 + 0.5) * w;
      const sy = (-v.y * 0.5 + 0.5) * h;
      const on = show && v.z < 1 && sx > -20 && sx < w + 20 && sy > 0 && sy < h;
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
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    // ease the model towards the step's state
    const k = 1 - Math.exp(-dt * 3.2);
    let moving = false;
    for (const key of Object.keys(cur) as (keyof ModelState)[]) {
      const d = goal[key] - cur[key];
      if (Math.abs(d) > 0.001) {
        cur[key] += d * k;
        moving = true;
      } else cur[key] = goal[key];
    }
    // ease the framing towards the step's focus
    const kc = 1 - Math.exp(-dt * 2.6);
    if (controls.target.distanceTo(goalTarget) > 0.01) {
      controls.target.lerp(goalTarget, kc);
      moving = true;
    }
    if (goalDist !== null || goalDir !== null) {
      offset.copy(camera.position).sub(controls.target);
      const dist = offset.length();
      const nextDist = goalDist !== null ? lerp(dist, goalDist, kc) : dist;
      offset.normalize();
      if (goalDir) {
        offset.lerp(goalDir, kc).normalize();
        if (offset.angleTo(goalDir) < 0.003) goalDir = null;
      }
      if (goalDist !== null && Math.abs(dist - goalDist) < 0.02) goalDist = null;
      camera.position.copy(controls.target).addScaledVector(offset, nextDist);
      moving = true;
    }
    const changed = controls.update();
    if (moving || changed || dirty || selected || controls.autoRotate) {
      dirty = false;
      apply(cur);
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
    setStep(step) {
      goal = { ...step.state };
      const f = FOCUS[step.focus];
      goalTarget = f.target.clone();
      goalDist = f.dist;
      goalDir = f.dir.clone();
      // a chosen step holds its view; only the opening view keeps turning
      if (step.focus !== "house") controls.autoRotate = false;
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
      const d = THREE.MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance);
      goalDist = d;
      dirty = true;
    },
    reset() {
      goalDir = home.clone();
      goalTarget = FOCUS.house.target.clone();
      goalDist = FOCUS.house.dist;
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
      pmrem.dispose();
      envTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
