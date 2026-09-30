/**
 * A house with a wet Keller, repaired and then taken apart layer by layer.
 * Loaded on demand (dynamic import) so three.js never sits on the first-paint
 * path. Brick maps are photographed PBR textures; soil, slurry, plaster and
 * board are rendered texture maps (see /public/textures).
 *
 * Choreography, driven by the act progress p (--sc-p on the section):
 *   0.00-0.16  the whole house, cut open: wet brick, salt line, puddle, mould
 *   0.14-0.32  the camera dives into the basement wall
 *   0.20-0.30  injection packers set along the drill chain
 *   0.30-0.42  the barrier floods along the chain (mint)
 *   0.38-0.52  the Keller dries down to the barrier, puddle and mould go
 *   0.46-0.58  sealing slurry, renovation plaster and board go on
 *   0.58-0.76  the camera steps back so the whole house is in frame, and
 *              the Keller wall fans apart inside it, the barrier lifts out
 *   0.76-0.90  hold
 *   0.90-1.00  it settles and the camera pulls out to the dry house
 * The house stays standing the whole time, so the scene always reads as a
 * house with a Keller being repaired, never as a loose wall.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { WallLayer } from "@/data/layers";

const H = 2.4; // wall height, metres
const L = 4.0; // basement depth along the cut wall
const ROOM = 4.6; // basement width
const BAR_Y0 = 0.14;
const BAR_Y1 = 0.26;
const GAP = 0.95; // explosion spacing: the layers fan out across the Keller floor

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => {
  x = clamp01(x);
  return x * x * (3 - 2 * x);
};
const seg = (p: number, a: number, b: number) => smooth((p - a) / (b - a));
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

export interface WallScene {
  dispose: () => void;
}

export function createWallScene(
  host: HTMLElement,
  section: HTMLElement,
  layers: WallLayer[]
): WallScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  host.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.45;

  const sun = new THREE.DirectionalLight(0xfff1dc, 2.4);
  sun.position.set(6, 9, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.radius = 4;
  const sc = sun.shadow.camera as THREE.OrthographicCamera;
  sc.left = -4;
  sc.right = 7;
  sc.top = 8;
  sc.bottom = -3;
  sc.near = 1;
  sc.far = 30;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(0xcfe8df, 0x1a1410, 0.5));
  const rim = new THREE.DirectionalLight(0x62c4ac, 0.6);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);

  // ---------------------------------------------------------------- textures
  const loader = new THREE.TextureLoader();
  let pending = 0;
  let dirty = true;
  const tex = (url: string, color = true) => {
    pending++;
    const done = () => {
      pending--;
      dirty = true;
    };
    // on error the material simply renders without that map
    const t = loader.load(url, done, undefined, done);
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

  // Damp is a shader tint on the masonry, keyed to the rest-position height,
  // so it stays glued to the bricks when the stack explodes.
  const uDamp = { value: 0.3 };
  const uSalt = { value: 0 };
  const dampify = (m: THREE.MeshStandardMaterial) => {
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uDamp = uDamp;
      sh.uniforms.uSalt = uSalt;
      sh.vertexShader = sh.vertexShader
        .replace("#include <common>", "#include <common>\nvarying float vRestY;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvRestY = position.y;");
      sh.fragmentShader = sh.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nvarying float vRestY;\nuniform float uDamp;\nuniform float uSalt;"
        )
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

  const brickMat = new THREE.MeshStandardMaterial({
    map: brickMap,
    bumpMap: brickBump,
    bumpScale: 1.4,
    roughnessMap: brickRough,
    roughness: 1,
  });
  dampify(brickMat);
  const soilMat = new THREE.MeshStandardMaterial({ map: soilMap, roughness: 1 });
  const mdsMat = new THREE.MeshStandardMaterial({ map: mdsMap, roughness: 0.8 });
  const plasterMat = new THREE.MeshStandardMaterial({ map: plasterMap, roughness: 0.92 });
  const calsilMat = new THREE.MeshStandardMaterial({ map: calsilMap, roughness: 0.85 });
  const floorMat = new THREE.MeshStandardMaterial({ map: mdsMap, color: 0x8a8f8b, roughness: 0.9 });
  const barrierMat = new THREE.MeshStandardMaterial({
    color: 0x62c4ac,
    emissive: 0x62c4ac,
    emissiveIntensity: 0.2,
    roughness: 0.35,
    metalness: 0.05,
    transparent: true,
    opacity: 0.96,
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

  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D) => {
    const o = new THREE.Mesh(g, m);
    o.castShadow = true;
    o.receiveShadow = true;
    parent.add(o);
    return o;
  };

  const gSoil = new THREE.Group();
  mesh(worldBox(xS0, xM0, -0.3, soilTop, z0, z1, 1.4), soilMat, gSoil);
  // groundwater band at the foot of the soil
  const water = new THREE.Mesh(
    worldBox(xS0 - 0.002, xM0 - 0.001, -0.3, 0.12, z0 - 0.002, z1 + 0.002, 1),
    new THREE.MeshStandardMaterial({ color: 0x3b6ea8, transparent: true, opacity: 0.42, roughness: 0.2 })
  );
  gSoil.add(water);

  const gMasonry = new THREE.Group();
  mesh(worldBox(xM0, 0, -0.3, BAR_Y0, z0, z1, 1.6), brickMat, gMasonry);
  mesh(worldBox(xM0, 0, BAR_Y1, H, z0, z1, 1.6), brickMat, gMasonry);
  // the slot the barrier occupies, dark until it is flooded
  const slot = mesh(
    worldBox(xM0, 0, BAR_Y0, BAR_Y1, z0, z1, 1.6),
    brickMat,
    gMasonry
  );

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
  for (let z = z0 + 0.1; z < z1 - 0.05; z += 0.2) { // SchimmelPeter: holes up to 20 cm apart
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
  // Hohlkehle: the cove at the floor-wall joint
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

  const floor = mesh(worldBox(xA1, ROOM, -0.14, 0, z0, z1, 1.4), floorMat, root);
  floor.castShadow = false;

  root.add(gSoil, gMasonry, gBarrier, gSeal, gPlaster, gBoard);
  const interior = [gSeal, gPlaster, gBoard];

  // ------------------------------------------------------------------ house
  // Everything that is not the cut wall: it sets the scene, steps back for the
  // explosion and returns, repaired, at the end.
  const house = new THREE.Group();
  root.add(house);
  // the house stays opaque; only the puddle and the mould fade as the Keller dries
  const houseBrick = new THREE.MeshStandardMaterial({ map: brickMap, bumpMap: brickBump, bumpScale: 1.4, roughnessMap: brickRough, roughness: 1 });
  dampify(houseBrick);
  const houseSoil = new THREE.MeshStandardMaterial({ map: soilMap, roughness: 1 });
  const grass = new THREE.MeshStandardMaterial({ color: 0x3f5b37, roughness: 1 });
  const slab = new THREE.MeshStandardMaterial({ map: mdsMap, color: 0x9a9e9a, roughness: 0.9 });
  const facade = new THREE.MeshStandardMaterial({ map: plasterMap, color: 0xf1ede3, roughness: 0.95 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x2c3431, roughness: 0.7, metalness: 0.1 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x2a2416, emissive: 0xf1cf7a, emissiveIntensity: 0.9 });
  const puddleMat = new THREE.MeshStandardMaterial({ color: 0x3b6ea8, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.7 });
  const mouldMat = new THREE.MeshStandardMaterial({ color: 0x223024, roughness: 1, transparent: true });
  const zB = z0 - tM; // outer face of the back wall
  const top = H + 0.22; // ground-floor level
  const up = H + 2.9; // eaves
  // basement: back and right walls, damp like the cut wall
  mesh(worldBox(xM0, ROOM + tM, -0.3, H, zB, z0, 1.6), houseBrick, house);
  mesh(worldBox(ROOM, ROOM + tM, -0.3, H, z0, z1, 1.6), houseBrick, house);
  // soil around the basement, cut open at the front
  mesh(worldBox(xS0, ROOM + tM + tS, -0.3, soilTop, zB - tS, zB, 1.4), houseSoil, house);
  mesh(worldBox(ROOM + tM, ROOM + tM + tS, -0.3, soilTop, zB, z1, 1.4), houseSoil, house);
  mesh(worldBox(xS0, ROOM + tM + tS, soilTop, soilTop + 0.05, zB - tS, zB, 1), grass, house);
  mesh(worldBox(ROOM + tM, ROOM + tM + tS, soilTop, soilTop + 0.05, zB, z1, 1), grass, house);
  mesh(worldBox(xS0, xM0, soilTop, soilTop + 0.05, z0, z1, 1), grass, house);
  // ceiling slab and the ground floor above
  mesh(worldBox(xM0, ROOM + tM, H, top, zB, z1, 1.4), slab, house);
  mesh(worldBox(ROOM, ROOM + tM, top, up, zB, z1, 1.2), facade, house);
  mesh(worldBox(xM0, ROOM + tM, top, up, zB, z0, 1.2), facade, house);
  mesh(worldBox(xM0, 0, top, up, z0, z1, 1.2), facade, house);
  mesh(worldBox(xM0, ROOM + tM, up, up + 0.16, zB, z1, 1.4), slab, house);
  for (const [zc, w] of [[-1.0, 0.9], [0.8, 0.9]] as const) {
    mesh(worldBox(ROOM + tM, ROOM + tM + 0.02, top + 0.9, top + 2.1, zc - w / 2, zc + w / 2, 1), glass, house);
  }
  mesh(worldBox(1.2, 2.4, top + 0.9, top + 2.1, z0 + 0.001, z0 + 0.02, 1), glass, house);
  // gable roof along z
  const ridge = new THREE.Shape();
  const rx0 = xM0 - 0.35;
  const rx1 = ROOM + tM + 0.35;
  ridge.moveTo(rx0, 0);
  ridge.lineTo(rx1, 0);
  ridge.lineTo((rx0 + rx1) / 2, 1.9);
  ridge.lineTo(rx0, 0);
  const roofGeo = new THREE.ExtrudeGeometry(ridge, { depth: z1 - zB + 0.6, bevelEnabled: false });
  roofGeo.translate(0, up + 0.16, zB - 0.3);
  mesh(roofGeo, roofMat, house);
  // chimney through the back roof slope and white frames round the windows,
  // so the silhouette reads as a house at every camera distance
  const chimneyMat = new THREE.MeshStandardMaterial({ map: brickMap, color: 0xb8a89c, roughness: 1 });
  mesh(worldBox(3.3, 3.8, up + 0.6, up + 2.45, zB + 0.3, zB + 0.8, 0.8), chimneyMat, house);
  mesh(worldBox(3.24, 3.86, up + 2.45, up + 2.55, zB + 0.24, zB + 0.86, 1), slab, house);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0xf3f1ec, roughness: 0.6 });
  for (const [zc, w] of [[-1.0, 0.9], [0.8, 0.9]] as const) {
    mesh(worldBox(ROOM + tM, ROOM + tM + 0.05, top + 0.84, top + 0.9, zc - w / 2 - 0.08, zc + w / 2 + 0.08, 1), frameMat, house);
    mesh(worldBox(ROOM + tM, ROOM + tM + 0.04, top + 2.1, top + 2.16, zc - w / 2 - 0.06, zc + w / 2 + 0.06, 1), frameMat, house);
    mesh(worldBox(ROOM + tM, ROOM + tM + 0.035, top + 0.9, top + 2.1, zc - 0.02, zc + 0.02, 1), frameMat, house);
  }
  // what is wrong with this Keller: standing water and mould in the cold corner
  const puddle = new THREE.Mesh(new THREE.CircleGeometry(1, 40), puddleMat);
  puddle.rotation.x = -Math.PI / 2;
  puddle.position.set(2.4, 0.006, 0.2);
  puddle.scale.set(1.3, 0.8, 1);
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

  // ------------------------------------------------------------------ labels
  const notes = new Map<string, HTMLElement>();
  section.querySelectorAll<HTMLElement>(".layer-note[data-layer]").forEach((el) => {
    notes.set(el.dataset.layer || "", el);
  });
  const anchors: Record<string, () => THREE.Vector3> = {
    erdreich: () => new THREE.Vector3((xS0 + xM0) / 2, soilTop, z1).add(gSoil.position),
    mauerwerk: () => new THREE.Vector3(xM0 / 2, H, z1).add(gMasonry.position),
    horizontalsperre: () => new THREE.Vector3(xM0 / 2, BAR_Y1, z1).add(gBarrier.position),
    innenabdichtung: () => new THREE.Vector3(xA1 / 2, H, z1).add(gSeal.position),
    sanierputz: () => new THREE.Vector3((xA1 + xP1) / 2, H, z1).add(gPlaster.position),
    klimaplatte: () => new THREE.Vector3((xP1 + xK1) / 2, H, z1).add(gBoard.position),
  };

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
  const target = new THREE.Vector3();

  function place(p: number) {
    const dampUp = 0.8 + 0.2 * seg(p, 0, 0.2);
    const dry = seg(p, 0.38, 0.52);
    uDamp.value = lerp(lerp(0.3, 1.55, dampUp), BAR_Y0 + 0.02, dry);
    uSalt.value = dampUp * (1 - dry);

    const pk = seg(p, 0.2, 0.3);
    packers.forEach((g, i) => {
      const local = clamp01(pk * 1.6 - (i / packers.length) * 0.6);
      g.visible = local > 0.01;
      g.position.x = lerp(0.4, 0, local);
    });

    const flood = seg(p, 0.3, 0.42);
    barrier.scale.z = Math.max(0.0001, flood);
    barrier.visible = flood > 0.001;
    slot.visible = flood < 0.999;
    barrierMat.emissiveIntensity = 0.15 + 0.55 * flood * (1 - seg(p, 0.5, 0.6)) + 0.12;

    const apply = seg(p, 0.46, 0.58);
    interior.forEach((g, i) => {
      const local = clamp01(apply * 1.5 - i * 0.25);
      g.visible = local > 0.01;
      g.userData.applyX = lerp(1.6, 0, smooth(local));
    });

    const e = seg(p, 0.58, 0.76) * (1 - seg(p, 0.9, 0.97));

    // the house never leaves: the wall is taken apart inside it
    puddle.visible = dry < 0.99;
    puddle.scale.set(1.3 * (1 - dry * 0.9), 0.8 * (1 - dry * 0.9), 1);
    mould.visible = dry < 0.98;
    mouldMat.opacity = 1 - dry;
    const hold = seg(p, 0.72, 0.86) * (1 - seg(p, 0.9, 1));
    gSoil.position.x = -GAP * 0.9 * e;
    gMasonry.position.x = 0;
    gBarrier.position.set(0, 1.25 * e + 0.12 * Math.sin(e * Math.PI), 0);
    interior.forEach((g, i) => {
      g.position.x = (g.userData.applyX || 0) + GAP * (i + 1) * e;
    });
    packers.forEach((g) => (g.visible = g.visible && e < 0.5));

    // camera: the whole house, a dive into the cut wall, a slow orbit around
    // the exploded stack, and back out to the repaired house
    const portrait = w / h < 0.9;
    const zoom = seg(p, 0.14, 0.32) * (1 - seg(p, 0.9, 1));
    // close on the wall for the injection, then far enough back during the
    // explosion that roof, chimney and ground floor frame the fanned layers
    // wide stays at 1 once reached, so the house keeps its roof in frame
    // while the layers settle back at the end
    const wide = seg(p, 0.58, 0.76);
    const Rc = lerp(8.4, lerp(17.5, 16.5, hold), wide);
    const ac = lerp(0.72, 0.42, seg(p, 0.2, 0.5)) + lerp(0, 0.12, wide);
    const Ro = 19;
    const ao = 0.62;
    const R = lerp(Ro, Rc, zoom) * (portrait ? 1.7 : 1);
    const a = lerp(ao, ac, zoom);
    target.set(
      lerp(2.1, lerp(-0.1, 1.9, wide), zoom),
      lerp(3.1, lerp(1.2, 3.2, wide), zoom),
      lerp(-0.4, lerp(0, -0.3, wide), zoom)
    );
    camera.position.set(
      target.x + Math.sin(a) * R,
      target.y + lerp(3.4, lerp(1.6, 3.2, wide), zoom),
      target.z + Math.cos(a) * R
    );
    camera.lookAt(target);
    if (portrait) camera.setViewOffset(w, h, 0, -h * 0.08, w, h);
    else camera.setViewOffset(w, h, -w * 0.12, 0, w, h);

    // labels: which layer is in play right now, plus all of them at the peak
    const inPlay: Record<string, boolean> = {
      erdreich: (p > 0.2 && p < 0.3) || e > 0.55,
      mauerwerk: (p > 0.22 && p < 0.32) || e > 0.55,
      horizontalsperre: (p > 0.3 && p < 0.47) || e > 0.55,
      innenabdichtung: (p > 0.5 && p < 0.59) || e > 0.55,
      sanierputz: (p > 0.52 && p < 0.59) || e > 0.55,
      klimaplatte: (p > 0.54 && p < 0.59) || e > 0.55,
    };
    const placed: { x: number; y: number; w: number; h: number }[] = [];
    // the heading is an obstacle too
    const head = section.querySelector<HTMLElement>(".layers__head");
    if (head) {
      const hr = head.getBoundingClientRect();
      const sr = host.getBoundingClientRect();
      placed.push({ x: hr.left - sr.left - 12, y: hr.top - sr.top - 12, w: hr.width + 24, h: hr.height + 24 });
    }
    const vis: { id: string; el: HTMLElement; x: number; y: number }[] = [];
    notes.forEach((el, id) => {
      const fn = anchors[id];
      if (!fn) return;
      v.copy(fn()).add(root.position).project(camera);
      const sx = (v.x * 0.5 + 0.5) * w;
      const sy = (-v.y * 0.5 + 0.5) * h;
      const on = !!inPlay[id] && v.z < 1 && sx > -40 && sx < w + 40 && sy > 0 && sy < h;
      el.classList.toggle("is-on", on);
      if (on) vis.push({ id, el, x: sx, y: sy });
    });
    // Several layers at once: names only, the full text stays in the list.
    const compact = vis.length > 2;
    vis.forEach((it) => it.el.classList.toggle("is-compact", compact));
    const hits = (x: number, y: number, lw: number, lh: number) =>
      placed.find((r) => x < r.x + r.w + 6 && x + lw + 6 > r.x && y < r.y + r.h + 6 && y + lh + 6 > r.y);
    vis.sort((a2, b2) => a2.x - b2.x);
    for (const it of vis) {
      const lw = it.el.offsetWidth;
      const lh = it.el.offsetHeight;
      const x = Math.min(Math.max(8, it.x - 18), w - lw - 8);
      // above the anchor first, then stepping down below it until it fits
      let y = Math.max(8, it.y - lh - 14);
      for (let guard = 0; guard < 12; guard++) {
        const hit = hits(x, y, lw, lh);
        if (!hit) break;
        y = hit.y + hit.h + 8;
      }
      // on a phone keep clear of the floating assistant button at the bottom
      y = Math.min(y, h - lh - (portrait ? 84 : 8));
      placed.push({ x, y, w: lw, h: lh });
      it.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    }
  }

  let lastP = -1;
  let raf = 0;
  let running = false;
  const readP = () => parseFloat(section.style.getPropertyValue("--sc-p")) || 0;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const p = readP();
    if (!dirty && Math.abs(p - lastP) < 0.0005) return;
    lastP = p;
    dirty = pending > 0;
    place(p);
    renderer.render(scene, camera);
  };
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        dirty = true;
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    },
    { rootMargin: "10% 0px" }
  );
  io.observe(section);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      pmrem.dispose();
      envTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
