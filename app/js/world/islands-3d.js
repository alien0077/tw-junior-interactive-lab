/**
 * islands-3d.js — 國中知識群島 3D 微縮探索世界
 * Art Direction: 「博物學立體微縮圖鑑 × 建築模型桌」
 * Strict adherence to UI_UX_DESIGN_CONSTITUTION.md
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ISLANDS = [
  {
    key: 'math',
    name: '數學幾何島',
    icon: '📐',
    subtitle: '數線・方程式・幾何・二次函數',
    subjectFilter: 'math',
    unitCount: 18,
    color: '#2B4C7E',
    accent: '#C48F36',
    pos: [-10.4, 0, -0.4],
    pinHeight: 4.9
  },
  {
    key: 'bio',
    name: '生物秘境島',
    icon: '🌿',
    subtitle: '細胞・循環・遺傳・生態系',
    subjectFilter: 'bio',
    unitCount: 6,
    color: '#35684D',
    accent: '#7EA172',
    pos: [7.8, 0, 6.2],
    pinHeight: 4.5
  },
  {
    key: 'physchem',
    name: '理化實驗島',
    icon: '⚗️',
    subtitle: '浮力・光學・熱學・化學・電路',
    subjectFilter: 'physchem',
    unitCount: 8,
    color: '#B24C3E',
    accent: '#2A7A73',
    pos: [-1.2, 0, -8.5],
    pinHeight: 5.7
  },
  {
    key: 'earth',
    name: '地科天文島',
    icon: '🌋',
    subtitle: '板塊地層・天氣圖・日地月潮汐',
    subjectFilter: 'earth',
    unitCount: 2,
    color: '#4A5568',
    accent: '#C46838',
    pos: [9.5, 0, -5.8],
    pinHeight: 5.2
  },
  {
    key: 'social',
    name: '社會人文島',
    icon: '🧭',
    subtitle: '地形焚風・台灣史・供需・五權',
    subjectFilter: 'social',
    unitCount: 9,
    color: '#8A583B',
    accent: '#C79B3B',
    pos: [-1.8, 0, 7.2],
    pinHeight: 4.6
  }
];

const TOD_PRESETS = {
  day: {
    sky: '#E9E4D8',
    fog: '#DCE7E6',
    fogNear: 28,
    fogFar: 74,
    sea: '#78B2B8',
    foam: '#F6F3EC',
    sunColor: '#FFF8E7',
    sunIntensity: 1.9,
    sunPos: [18, 25, 14],
    hemiSky: '#F7F3E8',
    hemiGround: '#8EA29B',
    hemiIntensity: 0.92,
    fillColor: '#D6E7EE',
    fillIntensity: 0.35,
    windowEmissive: 0.08,
    lanternEmissive: 0.18,
    beamOpacity: 0.0,
    craterEmissive: 0.1,
    starOpacity: 0.0,
    exposure: 1.04
  },
  dusk: {
    sky: '#E7C8AE',
    fog: '#E0BA9B',
    fogNear: 25,
    fogFar: 68,
    sea: '#5B8796',
    foam: '#F2DEC8',
    sunColor: '#FFAB6B',
    sunIntensity: 1.7,
    sunPos: [-23, 10.5, 15],
    hemiSky: '#F2BC91',
    hemiGround: '#4A566B',
    hemiIntensity: 0.78,
    fillColor: '#7F91B2',
    fillIntensity: 0.38,
    windowEmissive: 1.05,
    lanternEmissive: 1.4,
    beamOpacity: 0.22,
    craterEmissive: 0.72,
    starOpacity: 0.22,
    exposure: 1.0
  },
  night: {
    sky: '#1A2B3C',
    fog: '#1A2B3C',
    fogNear: 22,
    fogFar: 64,
    sea: '#1D3549',
    foam: '#7F9FB3',
    sunColor: '#A9C5E2',
    sunIntensity: 0.95,
    sunPos: [14, 21, -16],
    hemiSky: '#507296',
    hemiGround: '#131E29',
    hemiIntensity: 0.56,
    fillColor: '#3E5B7A',
    fillIntensity: 0.32,
    windowEmissive: 1.65,
    lanternEmissive: 2.1,
    beamOpacity: 0.42,
    craterEmissive: 1.35,
    starOpacity: 0.88,
    exposure: 0.96
  }
};

/* ============================================================================
   Matte Architectural Material Factory
   ============================================================================ */
function createMaterialBank() {
  const bank = {
    // Stone & Plaster
    ivoryStone: new THREE.MeshStandardMaterial({ color: 0xede6d8, roughness: 0.84, metalness: 0.03, flatShading: true }),
    warmLimestone: new THREE.MeshStandardMaterial({ color: 0xdfd6c5, roughness: 0.86, metalness: 0.02, flatShading: true }),
    sandBeach: new THREE.MeshStandardMaterial({ color: 0xdec8a1, roughness: 0.91, metalness: 0.01, flatShading: true }),
    riverStone: new THREE.MeshStandardMaterial({ color: 0x8d8b84, roughness: 0.88, metalness: 0.04, flatShading: true }),
    darkSlate: new THREE.MeshStandardMaterial({ color: 0x46515c, roughness: 0.82, metalness: 0.08, flatShading: true }),
    whitePlaster: new THREE.MeshStandardMaterial({ color: 0xf4f0e7, roughness: 0.78, metalness: 0.02, flatShading: true }),

    // Subject Signature Matte Tones
    mathBlue: new THREE.MeshStandardMaterial({ color: 0x2b4c7e, roughness: 0.76, metalness: 0.06, flatShading: true }),
    brass: new THREE.MeshStandardMaterial({ color: 0xc48f36, roughness: 0.38, metalness: 0.72, flatShading: false }),
    copperVerdigris: new THREE.MeshStandardMaterial({ color: 0x2a7a73, roughness: 0.62, metalness: 0.32, flatShading: true }),
    terracotta: new THREE.MeshStandardMaterial({ color: 0xb24c3e, roughness: 0.85, metalness: 0.03, flatShading: true }),
    civicTerracotta: new THREE.MeshStandardMaterial({ color: 0x8a583b, roughness: 0.83, metalness: 0.04, flatShading: true }),
    timber: new THREE.MeshStandardMaterial({ color: 0x7b5438, roughness: 0.86, metalness: 0.02, flatShading: true }),
    sailCream: new THREE.MeshStandardMaterial({ color: 0xf7f2e7, roughness: 0.82, metalness: 0.0, side: THREE.DoubleSide }),

    // Botanical & Terrain
    mossDeep: new THREE.MeshStandardMaterial({ color: 0x35684d, roughness: 0.88, metalness: 0.02, flatShading: true }),
    mossBright: new THREE.MeshStandardMaterial({ color: 0x4f8261, roughness: 0.87, metalness: 0.02, flatShading: true }),
    foliageSage: new THREE.MeshStandardMaterial({ color: 0x7ea172, roughness: 0.86, metalness: 0.02, flatShading: true }),
    cypressGreen: new THREE.MeshStandardMaterial({ color: 0x3a5a44, roughness: 0.88, metalness: 0.02, flatShading: true }),
    earthClay: new THREE.MeshStandardMaterial({ color: 0x9b8265, roughness: 0.9, metalness: 0.02, flatShading: true }),
    ochreHill: new THREE.MeshStandardMaterial({ color: 0xb48a56, roughness: 0.89, metalness: 0.02, flatShading: true }),
    pondWater: new THREE.MeshStandardMaterial({ color: 0x4ea3a1, roughness: 0.28, metalness: 0.08, flatShading: true }),
    shoalWater: new THREE.MeshStandardMaterial({
      color: 0x89c4c2,
      roughness: 0.65,
      metalness: 0.04,
      transparent: true,
      opacity: 0.48
    }),

    // Geology Strata (Earth Island)
    sandstone: new THREE.MeshStandardMaterial({ color: 0xd6b485, roughness: 0.9, metalness: 0.02, flatShading: true }),
    shale: new THREE.MeshStandardMaterial({ color: 0x8a7968, roughness: 0.88, metalness: 0.03, flatShading: true }),
    limestoneStrata: new THREE.MeshStandardMaterial({ color: 0xc8c2b4, roughness: 0.86, metalness: 0.02, flatShading: true }),
    basalt: new THREE.MeshStandardMaterial({ color: 0x4a5568, roughness: 0.84, metalness: 0.06, flatShading: true }),

    // Glass & Emissive Architectural Accents
    greenhouseGlass: new THREE.MeshStandardMaterial({
      color: 0xdcf0eb,
      roughness: 0.18,
      metalness: 0.06,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
      side: THREE.DoubleSide
    }),
    lanternGlass: new THREE.MeshStandardMaterial({
      color: 0xfff3d4,
      emissive: 0xffc66d,
      emissiveIntensity: 0.2,
      roughness: 0.2,
      metalness: 0.05,
      transparent: true,
      opacity: 0.86
    }),
    warmWindow: new THREE.MeshStandardMaterial({
      color: 0xf7e3ba,
      emissive: 0xffb852,
      emissiveIntensity: 0.08,
      roughness: 0.42,
      metalness: 0.05
    }),
    craterGlow: new THREE.MeshStandardMaterial({
      color: 0x873e23,
      emissive: 0xc46838,
      emissiveIntensity: 0.1,
      roughness: 0.78,
      metalness: 0.04,
      flatShading: true
    }),
    slitDark: new THREE.MeshStandardMaterial({
      color: 0x222c37,
      emissive: 0xd9a156,
      emissiveIntensity: 0.04,
      roughness: 0.75,
      metalness: 0.1
    }),
    foam: new THREE.MeshStandardMaterial({
      color: 0xf6f3ec,
      roughness: 0.92,
      metalness: 0.0,
      transparent: true,
      opacity: 0.56
    })
  };
  return bank;
}

function tagIslandTree(root, islandKey) {
  root.traverse((obj) => {
    obj.userData.islandKey = islandKey;
    if (obj.isMesh) {
      if (obj.userData.castShadow !== false) obj.castShadow = true;
      if (obj.userData.receiveShadow !== false) obj.receiveShadow = true;
    }
  });
}

function addFoamRing(group, rx, rz, mats, foamRings, phaseOffset) {
  const ringGeo = new THREE.TorusGeometry(1, 0.075, 6, 30);
  ringGeo.rotateX(Math.PI / 2);
  const ring = new THREE.Mesh(ringGeo, mats.foam);
  ring.scale.set(rx, 1, rz);
  ring.position.y = 0.05;
  ring.userData.castShadow = false;
  ring.userData.receiveShadow = false;
  group.add(ring);
  foamRings.push({ mesh: ring, baseRx: rx, baseRz: rz, phase: phaseOffset });

  // Subtle bathymetric shoal ring right beneath the water surface
  const shoalGeo = new THREE.CylinderGeometry(1, 1.15, 0.22, 16);
  const shoal = new THREE.Mesh(shoalGeo, mats.shoalWater);
  shoal.scale.set(rx * 0.98, 1, rz * 0.98);
  shoal.position.y = -0.14;
  shoal.userData.castShadow = false;
  shoal.userData.receiveShadow = false;
  group.add(shoal);
}

/* ============================================================================
   Reusable Botanical Helpers
   ============================================================================ */
function makeCypress(mats, height = 1.25) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, height * 0.28, 6), mats.timber);
  trunk.position.y = height * 0.14;
  g.add(trunk);

  const lower = new THREE.Mesh(new THREE.ConeGeometry(0.24, height * 0.58, 7), mats.cypressGreen);
  lower.position.y = height * 0.5;
  g.add(lower);

  const upper = new THREE.Mesh(new THREE.ConeGeometry(0.17, height * 0.45, 7), mats.mossDeep);
  upper.position.y = height * 0.78;
  g.add(upper);
  return g;
}

function makeTieredCedar(mats, scale = 1.0) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.45, 6), mats.timber);
  trunk.position.y = 0.22;
  g.add(trunk);

  const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.48, 0.56, 7), mats.mossDeep);
  c1.position.y = 0.62;
  g.add(c1);

  const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.48, 7), mats.mossBright);
  c2.position.y = 0.95;
  c2.rotation.y = 0.4;
  g.add(c2);

  const c3 = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.36, 7), mats.foliageSage);
  c3.position.y = 1.24;
  c3.rotation.y = 0.8;
  g.add(c3);

  g.scale.setScalar(scale);
  return g;
}

function makeBroadleafTree(mats, scale = 1.0, crownMat = null) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.52, 6), mats.timber);
  trunk.position.y = 0.26;
  g.add(trunk);

  const m = crownMat || mats.mossBright;
  const mainCrown = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38, 0), m);
  mainCrown.position.set(0, 0.72, 0);
  mainCrown.scale.set(1.12, 0.88, 1.05);
  g.add(mainCrown);

  const sideCrown = new THREE.Mesh(new THREE.DodecahedronGeometry(0.25, 0), mats.foliageSage);
  sideCrown.position.set(0.22, 0.64, 0.12);
  g.add(sideCrown);

  g.scale.setScalar(scale);
  return g;
}

/* ============================================================================
   1. 數學幾何島 (Math Geometry Island)
   ============================================================================ */
function buildMathIsland(mats, foamRings) {
  const group = new THREE.Group();

  // Warm sand beach rim (hexagonal faceted base)
  const sandBase = new THREE.Mesh(new THREE.CylinderGeometry(3.45, 3.95, 0.52, 6), mats.sandBeach);
  sandBase.position.y = 0.14;
  sandBase.rotation.y = Math.PI / 6;
  group.add(sandBase);

  // Lower hexagonal limestone terrace
  const lowerTerrace = new THREE.Mesh(new THREE.CylinderGeometry(2.92, 3.15, 0.52, 6), mats.warmLimestone);
  lowerTerrace.position.y = 0.62;
  lowerTerrace.rotation.y = Math.PI / 6;
  group.add(lowerTerrace);

  // Upper hexagonal stone plaza
  const upperTerrace = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.32, 0.44, 6), mats.ivoryStone);
  upperTerrace.position.set(-0.22, 1.08, -0.15);
  upperTerrace.rotation.y = Math.PI / 6;
  group.add(upperTerrace);

  // Subtle brass compass inlay on the central plaza
  const compassGroup = new THREE.Group();
  compassGroup.position.set(0.35, 0.895, 1.25);
  const compassOuter = new THREE.Mesh(new THREE.RingGeometry(0.56, 0.64, 24), mats.brass);
  compassOuter.rotation.x = -Math.PI / 2;
  compassOuter.userData.castShadow = false;
  compassGroup.add(compassOuter);

  const compassInner = new THREE.Mesh(new THREE.RingGeometry(0.18, 0.24, 16), mats.mathBlue);
  compassInner.rotation.x = -Math.PI / 2;
  compassInner.position.y = 0.005;
  compassInner.userData.castShadow = false;
  compassGroup.add(compassInner);

  for (let i = 0; i < 4; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.018, 1.18), mats.brass);
    spoke.rotation.y = (i * Math.PI) / 4;
    spoke.scale.z = i % 2 === 0 ? 1.0 : 0.7;
    spoke.userData.castShadow = false;
    compassGroup.add(spoke);
  }
  group.add(compassGroup);

  // Classical Parthenon-inspired Geometric Portico
  const temple = new THREE.Group();
  temple.position.set(-0.48, 1.3, -0.35);
  temple.rotation.y = 0.26;

  // 3-tier stepped stylobate
  const step1 = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.14, 1.85), mats.warmLimestone);
  step1.position.y = 0.07;
  temple.add(step1);
  const step2 = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.13, 1.66), mats.ivoryStone);
  step2.position.y = 0.2;
  temple.add(step2);
  const step3 = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.12, 1.48), mats.whitePlaster);
  step3.position.y = 0.32;
  temple.add(step3);

  // Inner sanctuary cella
  const cella = new THREE.Mesh(new THREE.BoxGeometry(1.18, 1.36, 0.72), mats.warmLimestone);
  cella.position.set(0, 1.06, -0.1);
  temple.add(cella);

  // 6 fluted-style cylindrical ivory columns (4 across front + 2 rear flanks)
  const colPositions = [
    [-0.82, 0.56], [-0.28, 0.56], [0.28, 0.56], [0.82, 0.56],
    [-0.82, -0.56], [0.82, -0.56]
  ];
  colPositions.forEach(([cx, cz]) => {
    const colBase = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.13, 0.08, 8), mats.warmLimestone);
    colBase.position.set(cx, 0.42, cz);
    temple.add(colBase);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.098, 1.34, 10), mats.whitePlaster);
    shaft.position.set(cx, 1.12, cz);
    temple.add(shaft);

    const capital = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.24), mats.ivoryStone);
    capital.position.set(cx, 1.81, cz);
    temple.add(capital);
  });

  // Architrave & cornice
  const entablature = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.22, 1.54), mats.ivoryStone);
  entablature.position.y = 1.96;
  temple.add(entablature);

  // Triangular pediment in slate blue (#2B4C7E)
  const pedShape = new THREE.Shape();
  pedShape.moveTo(-1.14, 0);
  pedShape.lineTo(1.14, 0);
  pedShape.lineTo(0, 0.62);
  pedShape.closePath();
  const pedGeo = new THREE.ExtrudeGeometry(pedShape, { depth: 1.58, bevelEnabled: false });
  pedGeo.translate(0, 0, -0.79);
  const pediment = new THREE.Mesh(pedGeo, mats.mathBlue);
  pediment.position.y = 2.07;
  temple.add(pediment);

  // Ivory roof ridge & subtle brass acroterion
  const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 1.62), mats.brass);
  ridge.position.y = 2.7;
  temple.add(ridge);

  group.add(temple);

  // Golden Brass 3D Pythagoras Sculpture (3-4-5 right triangle + 3 proportional squares)
  const pythGroup = new THREE.Group();
  pythGroup.position.set(1.62, 0.88, -0.05);
  pythGroup.rotation.y = -0.45;

  // Stone display pedestal
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.66, 0.34, 6), mats.warmLimestone);
  plinth.position.y = 0.17;
  pythGroup.add(plinth);

  const pythArt = new THREE.Group();
  pythArt.position.set(-0.28, 0.72, 0);

  const a = 0.54; // vertical leg (3)
  const b = 0.72; // horizontal leg (4)
  const c = Math.hypot(a, b); // hypotenuse (5 = 0.90)
  const barT = 0.048;

  const makeFramedSquare = (side) => {
    const sq = new THREE.Group();
    const plate = new THREE.Mesh(new THREE.BoxGeometry(side - barT * 1.4, side - barT * 1.4, 0.03), mats.mathBlue);
    sq.add(plate);
    const top = new THREE.Mesh(new THREE.BoxGeometry(side, barT, barT), mats.brass);
    top.position.y = side / 2;
    const bot = top.clone();
    bot.position.y = -side / 2;
    const left = new THREE.Mesh(new THREE.BoxGeometry(barT, side, barT), mats.brass);
    left.position.x = -side / 2;
    const right = left.clone();
    right.position.x = side / 2;
    sq.add(top, bot, left, right);
    return sq;
  };

  // Central right triangle plate
  const triShape = new THREE.Shape();
  triShape.moveTo(0, 0);
  triShape.lineTo(b, 0);
  triShape.lineTo(0, a);
  triShape.closePath();
  const triMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(triShape, { depth: 0.05, bevelEnabled: false }),
    mats.brass
  );
  triMesh.position.z = -0.025;
  pythArt.add(triMesh);

  // Square on vertical leg a (to the left)
  const sqA = makeFramedSquare(a);
  sqA.position.set(-a / 2, a / 2, 0);
  pythArt.add(sqA);

  // Square on horizontal leg b (below — lift sculpture slightly so it clears pedestal!)
  pythArt.position.y = 0.36 + b;
  const sqB = makeFramedSquare(b);
  sqB.position.set(b / 2, -b / 2, 0);
  pythArt.add(sqB);

  // Square on hypotenuse c (outward normal from (0,a) -> (b,0))
  const angle = Math.atan2(-a, b);
  const midX = b / 2;
  const midY = a / 2;
  // Outward unit normal pointing up-right: (a/c, b/c)
  const sqC = makeFramedSquare(c);
  sqC.position.set(midX + (a / c) * (c / 2), midY + (b / c) * (c / 2), 0);
  sqC.rotation.z = angle;
  pythArt.add(sqC);

  pythGroup.add(pythArt);
  group.add(pythGroup);

  // Parabolic Arch Bridge spanning a tiny carved inlet on the south-west rim
  const inletPond = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.72, 0.16, 12), mats.pondWater);
  inletPond.position.set(-1.75, 0.34, 1.55);
  inletPond.scale.set(1.25, 1, 0.75);
  inletPond.userData.castShadow = false;
  group.add(inletPond);

  const bridgeGroup = new THREE.Group();
  bridgeGroup.position.set(-1.75, 0.42, 1.55);
  bridgeGroup.rotation.y = 0.72;

  const archCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.92, 0.02, 0),
    new THREE.Vector3(0, 0.92, 0),
    new THREE.Vector3(0.92, 0.02, 0)
  );
  const archPts = archCurve.getPoints(12);
  for (let i = 0; i < archPts.length - 1; i++) {
    const p0 = archPts[i];
    const p1 = archPts[i + 1];
    const segLen = p0.distanceTo(p1);
    const plank = new THREE.Mesh(new THREE.BoxGeometry(segLen + 0.04, 0.09, 0.48), mats.ivoryStone);
    plank.position.lerpVectors(p0, p1, 0.5);
    plank.rotation.z = Math.atan2(p1.y - p0.y, p1.x - p0.x);
    bridgeGroup.add(plank);
  }
  // Thin brass parabolic handrails on both sides
  [-0.22, 0.22].forEach((zOff) => {
    const railCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-0.9, 0.24, zOff),
      new THREE.Vector3(0, 1.14, zOff),
      new THREE.Vector3(0.9, 0.24, zOff)
    );
    const rail = new THREE.Mesh(new THREE.TubeGeometry(railCurve, 14, 0.022, 6, false), mats.brass);
    bridgeGroup.add(rail);
  });
  group.add(bridgeGroup);

  // Stylized Mediterranean cypress trees
  const cypressCoords = [
    [-2.35, 0.86, -0.95, 1.35],
    [-2.05, 0.86, -1.55, 1.08],
    [1.15, 0.86, -1.75, 1.25],
    [1.75, 0.86, 1.48, 1.05]
  ];
  cypressCoords.forEach(([x, y, z, h]) => {
    const cyp = makeCypress(mats, h);
    cyp.position.set(x, y, z);
    group.add(cyp);
  });

  addFoamRing(group, 4.12, 4.02, mats, foamRings, 0.2);
  tagIslandTree(group, 'math');
  return { group };
}

/* ============================================================================
   2. 生物秘境島 (Biology Sanctuary Island)
   ============================================================================ */
function buildBioIsland(mats, foamRings) {
  const group = new THREE.Group();

  // Organic layered base & undercut clay rim
  const clayBase = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.72, 0.62, 11), mats.earthClay);
  clayBase.position.y = 0.22;
  clayBase.scale.set(1.06, 1, 0.96);
  group.add(clayBase);

  // Lower meadow tier
  const meadow = new THREE.Mesh(new THREE.CylinderGeometry(3.02, 3.22, 0.42, 11), mats.mossBright);
  meadow.position.y = 0.66;
  meadow.scale.set(1.04, 1, 0.94);
  group.add(meadow);

  // Multi-tiered organic mossy hills (back-left & back-right)
  const hill1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.55, 1), mats.mossDeep);
  hill1.position.set(-1.15, 1.15, -0.95);
  hill1.scale.set(1.15, 0.68, 0.95);
  group.add(hill1);

  const hill2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.22, 1), mats.mossBright);
  hill2.position.set(1.38, 1.05, -0.78);
  hill2.scale.set(1.08, 0.58, 1.0);
  group.add(hill2);

  const hill3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.95, 1), mats.foliageSage);
  hill3.position.set(-1.62, 0.95, 0.72);
  hill3.scale.set(1.0, 0.48, 0.92);
  group.add(hill3);

  // Recessed turquoise pond in the foreground hollow
  const pondRim = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.14, 6, 14), mats.riverStone);
  pondRim.rotation.x = Math.PI / 2;
  pondRim.position.set(-0.78, 0.88, 1.32);
  pondRim.scale.set(1.18, 0.88, 0.75);
  group.add(pondRim);

  const pondSurface = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.88, 0.08, 14), mats.pondWater);
  pondSurface.position.set(-0.78, 0.88, 1.32);
  pondSurface.scale.set(1.14, 1, 0.84);
  pondSurface.userData.castShadow = false;
  group.add(pondSurface);

  // Tiny lily pads on pond
  [[-1.08, 1.24, 0.18], [-0.52, 1.48, 0.15], [-0.74, 1.08, 0.12]].forEach(([lx, lz, lr]) => {
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(lr, lr, 0.025, 8), mats.foliageSage);
    pad.position.set(lx, 0.935, lz);
    pad.userData.castShadow = false;
    group.add(pad);
  });

  // Stepping stones leading from pond to greenhouse entrance
  [
    [0.25, 0.9, 1.65],
    [0.52, 0.9, 1.34],
    [0.64, 0.9, 0.98]
  ].forEach(([sx, sy, sz], i) => {
    const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 0.07, 7), mats.warmLimestone);
    stone.position.set(sx, sy, sz);
    stone.rotation.y = i * 0.7;
    group.add(stone);
  });

  // Ribbed Botanical Glass Greenhouse Dome (Kew-inspired maquette)
  const gh = new THREE.Group();
  gh.position.set(0.32, 0.88, -0.05);

  // Circular stone plinth & low wall
  const ghBase = new THREE.Mesh(new THREE.CylinderGeometry(1.36, 1.44, 0.44, 16), mats.ivoryStone);
  ghBase.position.y = 0.22;
  gh.add(ghBase);

  // Entrance porch
  const porch = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.68, 0.46), mats.ivoryStone);
  porch.position.set(0.22, 0.34, 1.32);
  porch.rotation.y = 0.16;
  gh.add(porch);

  const porchDoor = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.46, 0.08), mats.warmWindow);
  porchDoor.position.set(0.26, 0.28, 1.54);
  porchDoor.rotation.y = 0.16;
  gh.add(porchDoor);

  // Translucent tinted glass dome
  const domeGeo = new THREE.SphereGeometry(1.28, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.52);
  const glassDome = new THREE.Mesh(domeGeo, mats.greenhouseGlass);
  glassDome.position.y = 0.44;
  glassDome.userData.castShadow = false;
  gh.add(glassDome);

  // 8 Curved brass structural rib arches
  for (let i = 0; i < 4; i++) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.032, 6, 22, Math.PI), mats.brass);
    rib.position.y = 0.44;
    rib.rotation.y = (i * Math.PI) / 4;
    gh.add(rib);
  }
  // Horizontal brass purlin rings
  [0.45, 0.94, 1.42].forEach((hy, idx) => {
    const r = idx === 0 ? 1.31 : idx === 1 ? 1.2 : 0.84;
    const purlin = new THREE.Mesh(new THREE.TorusGeometry(r, 0.025, 6, 24), mats.brass);
    purlin.rotation.x = Math.PI / 2;
    purlin.position.y = hy;
    gh.add(purlin);
  });

  // Top lantern cupola
  const cupola = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 0.24, 10), mats.warmWindow);
  cupola.position.y = 1.76;
  gh.add(cupola);
  const cupolaCap = new THREE.Mesh(new THREE.ConeGeometry(0.36, 0.24, 10), mats.copperVerdigris);
  cupolaCap.position.y = 1.98;
  gh.add(cupolaCap);

  // Miniature stylized trees visible INSIDE the greenhouse!
  const innerTree1 = makeBroadleafTree(mats, 0.72, mats.mossDeep);
  innerTree1.position.set(-0.34, 0.42, -0.2);
  gh.add(innerTree1);
  const innerTree2 = makeBroadleafTree(mats, 0.56, mats.foliageSage);
  innerTree2.position.set(0.36, 0.42, 0.14);
  gh.add(innerTree2);
  const innerFern = new THREE.Mesh(new THREE.DodecahedronGeometry(0.28, 0), mats.mossBright);
  innerFern.position.set(0.0, 0.56, -0.42);
  innerFern.scale.set(1.2, 0.7, 1.0);
  gh.add(innerFern);

  group.add(gh);

  // Surrounding cluster of multi-tiered cedar and broadleaf trees
  const cedars = [
    [-1.78, 1.32, -1.15, 0.98],
    [-1.12, 1.56, -1.65, 1.12],
    [1.82, 1.26, -1.12, 0.95],
    [2.28, 0.86, 0.35, 0.84]
  ];
  cedars.forEach(([x, y, z, s]) => {
    const t = makeTieredCedar(mats, s);
    t.position.set(x, y, z);
    group.add(t);
  });

  const broads = [
    [-2.18, 0.96, 0.62, 0.92, mats.mossBright],
    [1.76, 0.88, 1.32, 0.86, mats.foliageSage],
    [-0.18, 1.12, -1.96, 0.88, mats.mossDeep]
  ];
  broads.forEach(([x, y, z, s, cm]) => {
    const t = makeBroadleafTree(mats, s, cm);
    t.position.set(x, y, z);
    group.add(t);
  });

  addFoamRing(group, 4.02, 3.68, mats, foamRings, 1.4);
  tagIslandTree(group, 'bio');
  return { group };
}

/* ============================================================================
   3. 理化實驗島 (Physics & Chemistry Lab Island)
   ============================================================================ */
function buildPhysChemIsland(mats, foamRings) {
  const group = new THREE.Group();

  // Rugged slate coastal headland base
  const rockBase = new THREE.Mesh(new THREE.CylinderGeometry(3.15, 3.75, 0.72, 9), mats.darkSlate);
  rockBase.position.y = 0.26;
  rockBase.scale.set(1.08, 1, 0.94);
  group.add(rockBase);

  // Sandstone workshop terrace
  const terrace = new THREE.Mesh(new THREE.CylinderGeometry(2.68, 2.95, 0.44, 9), mats.warmLimestone);
  terrace.position.set(-0.32, 0.78, 0.08);
  group.add(terrace);

  // Rocky promontory outcrop for the optical lighthouse
  const outcrop = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.46, 0.96, 7), mats.darkSlate);
  outcrop.position.set(1.62, 0.92, -0.68);
  group.add(outcrop);

  // Red Terracotta Brick Laboratory Workshop (#B24C3E)
  const lab = new THREE.Group();
  lab.position.set(-0.78, 1.0, -0.22);
  lab.rotation.y = 0.24;

  const labPlinth = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.22, 1.56), mats.warmLimestone);
  labPlinth.position.y = 0.11;
  lab.add(labPlinth);

  const labBody = new THREE.Mesh(new THREE.BoxGeometry(2.04, 1.18, 1.42), mats.terracotta);
  labBody.position.y = 0.8;
  lab.add(labBody);

  // Pitched slate gabled roof
  const roofShape = new THREE.Shape();
  roofShape.moveTo(-1.14, 0);
  roofShape.lineTo(1.14, 0);
  roofShape.lineTo(0, 0.68);
  roofShape.closePath();
  const roofGeo = new THREE.ExtrudeGeometry(roofShape, { depth: 1.6, bevelEnabled: false });
  roofGeo.translate(0, 0, -0.8);
  const roof = new THREE.Mesh(roofGeo, mats.darkSlate);
  roof.position.y = 1.38;
  lab.add(roof);

  // Brick chimney with terracotta cap
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.32, 1.12, 0.32), mats.terracotta);
  chimney.position.set(-0.62, 1.98, -0.34);
  lab.add(chimney);
  const chimneyCap = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.09, 0.4), mats.warmLimestone);
  chimneyCap.position.set(-0.62, 2.56, -0.34);
  lab.add(chimneyCap);

  // Warm glowing workshop windows (front + side)
  [-0.56, 0.0, 0.56].forEach((wx) => {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.42, 0.08), mats.ivoryStone);
    frame.position.set(wx, 0.88, 0.71);
    lab.add(frame);
    const pane = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.33, 0.1), mats.warmWindow);
    pane.position.set(wx, 0.88, 0.72);
    lab.add(pane);
  });
  // Side windows
  [-0.32, 0.32].forEach((wz) => {
    const pane = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.34, 0.28), mats.warmWindow);
    pane.position.set(1.02, 0.88, wz);
    lab.add(pane);
  });
  group.add(lab);

  // Red-and-White Striped Coastal Optical Lighthouse
  const lh = new THREE.Group();
  lh.position.set(1.62, 1.4, -0.68);

  const bands = [
    { rTop: 0.48, rBot: 0.56, h: 0.48, y: 0.24, mat: mats.whitePlaster },
    { rTop: 0.42, rBot: 0.48, h: 0.48, y: 0.72, mat: mats.terracotta },
    { rTop: 0.36, rBot: 0.42, h: 0.48, y: 1.2, mat: mats.whitePlaster },
    { rTop: 0.31, rBot: 0.36, h: 0.46, y: 1.67, mat: mats.terracotta },
    { rTop: 0.27, rBot: 0.31, h: 0.38, y: 2.09, mat: mats.whitePlaster }
  ];
  bands.forEach((b) => {
    const seg = new THREE.Mesh(new THREE.CylinderGeometry(b.rTop, b.rBot, b.h, 10), b.mat);
    seg.position.y = b.y;
    lh.add(seg);
  });

  // Gallery deck & dark slate railing
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.34, 0.1, 10), mats.darkSlate);
  deck.position.y = 2.32;
  lh.add(deck);
  const rail = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.024, 6, 12), mats.darkSlate);
  rail.rotation.x = Math.PI / 2;
  rail.position.y = 2.46;
  lh.add(rail);

  // Glass lantern room
  const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.44, 10), mats.lanternGlass);
  lantern.position.y = 2.58;
  lh.add(lantern);

  // Copper roof cap (#2A7A73) + brass finial
  const cap = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.34, 10), mats.copperVerdigris);
  cap.position.y = 2.96;
  lh.add(cap);
  const finial = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.025, 0.24, 6), mats.brass);
  finial.position.y = 3.22;
  lh.add(finial);

  // Subtle rotating optical light cone (visible at dusk/night)
  const beamPivot = new THREE.Group();
  beamPivot.position.y = 2.6;

  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffe4a0,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const coneGeo = new THREE.ConeGeometry(0.95, 4.4, 12, 1, true);
  coneGeo.translate(0, -2.2, 0);
  coneGeo.rotateZ(Math.PI / 2);
  const beamMesh = new THREE.Mesh(coneGeo, beamMat);
  beamMesh.position.x = 0.22;
  beamMesh.userData.castShadow = false;
  beamMesh.userData.receiveShadow = false;
  beamPivot.add(beamMesh);

  const beamMesh2 = beamMesh.clone();
  beamMesh2.rotation.y = Math.PI;
  beamMesh2.position.x = -0.22;
  beamPivot.add(beamMesh2);

  lh.add(beamPivot);
  group.add(lh);

  // Stone Pier + Copper-Trimmed Balance / Pulley Crane
  const pier = new THREE.Group();
  pier.position.set(0.32, 0.36, 2.25);

  const pierDeck = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.42, 1.85), mats.warmLimestone);
  pierDeck.position.y = 0.14;
  pier.add(pierDeck);

  // Crane mast + angled jib
  const mast = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.38, 0.14), mats.timber);
  mast.position.set(-0.22, 1.02, 0.18);
  pier.add(mast);

  const jib = new THREE.Mesh(new THREE.BoxGeometry(0.11, 1.18, 0.11), mats.timber);
  jib.position.set(0.16, 1.56, 0.44);
  jib.rotation.z = -0.78;
  jib.rotation.y = -0.45;
  pier.add(jib);

  // Copper pulley wheel (#2A7A73) + hanging cable + brass test weight
  const pulley = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.08, 10), mats.copperVerdigris);
  pulley.rotation.x = Math.PI / 2;
  pulley.position.set(0.46, 1.86, 0.62);
  pier.add(pulley);

  const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.92, 6), mats.darkSlate);
  cable.position.set(0.46, 1.38, 0.62);
  pier.add(cable);

  const weight = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.28, 8), mats.brass);
  weight.position.set(0.46, 0.86, 0.62);
  pier.add(weight);

  // Wooden crates on pier
  const crate = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.32, 0.34), mats.timber);
  crate.position.set(-0.34, 0.51, 0.58);
  crate.rotation.y = 0.28;
  pier.add(crate);

  group.add(pier);

  // A couple of coastal pines on the west rock
  const pine = makeTieredCedar(mats, 0.78);
  pine.position.set(-2.22, 0.88, 0.82);
  group.add(pine);

  addFoamRing(group, 4.18, 3.92, mats, foamRings, 2.6);
  tagIslandTree(group, 'physchem');
  return { group, lighthouseBeam: beamPivot, lighthouseBeamMat: beamMat };
}

/* ============================================================================
   4. 地科天文島 (Earth Science & Astronomy Island)
   ============================================================================ */
function buildEarthIsland(mats, foamRings) {
  const group = new THREE.Group();

  // Dramatic 4-Layer Stratified Cutaway Sedimentary Cliff (visible geological cross-section!)
  // Shaped as a semi-circular plateau with a crisp flat front cutaway face facing south-west
  const makeStrataHalfShape = (radius) => {
    const s = new THREE.Shape();
    s.moveTo(-radius, -0.35);
    s.lineTo(radius, -0.35);
    s.absarc(0, -0.35, radius, 0, Math.PI, false);
    s.closePath();
    return s;
  };

  const strataGroup = new THREE.Group();
  strataGroup.rotation.y = -0.38;

  const layers = [
    { r: 3.35, h: 0.52, y: 0.02, mat: mats.basalt, tiltZ: 0.03 },
    { r: 3.12, h: 0.44, y: 0.54, mat: mats.limestoneStrata, tiltZ: 0.035 },
    { r: 2.94, h: 0.42, y: 0.98, mat: mats.shale, tiltZ: 0.03 },
    { r: 2.78, h: 0.36, y: 1.4, mat: mats.sandstone, tiltZ: 0.02 }
  ];

  layers.forEach((L) => {
    const geo = new THREE.ExtrudeGeometry(makeStrataHalfShape(L.r), { depth: L.h, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, L.mat);
    mesh.position.y = L.y;
    mesh.rotation.z = L.tiltZ;
    strataGroup.add(mesh);
  });

  // Secondary offset fault block on the front-right to make the strata shift unmistakably clear
  const faultLayers = [
    { w: 1.55, d: 1.05, h: 0.38, y: 0.19, mat: mats.basalt },
    { w: 1.48, d: 1.0, h: 0.32, y: 0.54, mat: mats.limestoneStrata },
    { w: 1.4, d: 0.94, h: 0.3, y: 0.85, mat: mats.shale },
    { w: 1.32, d: 0.88, h: 0.24, y: 1.12, mat: mats.sandstone }
  ];
  faultLayers.forEach((fl) => {
    const blk = new THREE.Mesh(new THREE.BoxGeometry(fl.w, fl.h, fl.d), fl.mat);
    blk.position.set(1.12, fl.y, 0.92);
    blk.rotation.y = 0.18;
    blk.rotation.z = -0.05;
    strataGroup.add(blk);
  });

  group.add(strataGroup);

  // Miniature Volcanic Cone with Crater Rim (on the eastern flank)
  const volcano = new THREE.Group();
  volcano.position.set(1.42, 1.46, -0.92);

  const vOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 1.35, 1.42, 9), mats.basalt);
  vOuter.position.y = 0.71;
  volcano.add(vOuter);

  const vRim = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.1, 6, 9), mats.shale);
  vRim.rotation.x = Math.PI / 2;
  vRim.position.y = 1.41;
  volcano.add(vRim);

  // Inner crater warm glow (#C46838)
  const magma = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.3, 0.12, 9), mats.craterGlow);
  magma.position.y = 1.33;
  magma.userData.castShadow = false;
  volcano.add(magma);

  group.add(volcano);

  // White Hemispherical Astronomical Observatory Dome with Slit & Brass Telescope
  const obs = new THREE.Group();
  obs.position.set(-0.78, 1.74, -0.78);
  obs.rotation.y = 0.55;

  const obsPlinth = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 1.15, 0.22, 12), mats.limestoneStrata);
  obsPlinth.position.y = 0.11;
  obs.add(obsPlinth);

  const obsDrum = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.96, 0.72, 14), mats.ivoryStone);
  obsDrum.position.y = 0.58;
  obs.add(obsDrum);

  // Small illuminated control-room window
  const obsWin = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.08), mats.warmWindow);
  obsWin.position.set(0.42, 0.56, 0.88);
  obsWin.rotation.y = 0.44;
  obs.add(obsWin);

  // White observatory hemisphere
  const obsDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.92, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
    mats.whitePlaster
  );
  obsDome.position.y = 0.94;
  obs.add(obsDome);

  // Telescope viewing slit arch
  const slit = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.94, 0.94), mats.slitDark);
  slit.position.set(0, 1.36, 0.34);
  slit.rotation.x = -0.32;
  obs.add(slit);

  // Brass telescope tube peeking out of the slit
  const scopeGroup = new THREE.Group();
  scopeGroup.position.set(0, 1.32, 0.38);
  scopeGroup.rotation.x = Math.PI * 0.29;

  const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 1.12, 10), mats.brass);
  scopeTube.position.y = 0.32;
  scopeGroup.add(scopeTube);

  const scopeRing = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.08, 10), mats.darkSlate);
  scopeRing.position.y = 0.86;
  scopeGroup.add(scopeRing);

  obs.add(scopeGroup);
  group.add(obs);

  // Subtle highland rocks on the sandstone plateau
  [[-1.88, 1.82, 0.12, 0.28], [0.22, 1.82, 0.18, 0.22]].forEach(([rx, ry, rz, rs]) => {
    const boulder = new THREE.Mesh(new THREE.DodecahedronGeometry(rs, 0), mats.shale);
    boulder.position.set(rx, ry, rz);
    boulder.scale.set(1.2, 0.72, 0.9);
    group.add(boulder);
  });

  addFoamRing(group, 3.88, 3.55, mats, foamRings, 3.9);
  tagIslandTree(group, 'earth');
  return { group };
}

/* ============================================================================
   5. 社會人文島 (Social & Humanities Island — Taiwan-Inspired)
   ============================================================================ */
function buildSocialIsland(mats, foamRings) {
  const group = new THREE.Group();

  // Coastal sand cove + elongated terrain base
  const sand = new THREE.Mesh(new THREE.CylinderGeometry(3.22, 3.74, 0.48, 10), mats.sandBeach);
  sand.position.y = 0.16;
  sand.scale.set(1.12, 1, 0.9);
  group.add(sand);

  const plain = new THREE.Mesh(new THREE.CylinderGeometry(2.85, 3.06, 0.44, 10), mats.ochreHill);
  plain.position.y = 0.56;
  plain.scale.set(1.08, 1, 0.86);
  group.add(plain);

  // Layered Miniature Central Mountain Range Ridge (中央山脈意象)
  const ridgePeaks = [
    { x: -1.65, z: -0.78, r: 1.05, h: 1.95, mat: mats.mossDeep },
    { x: -0.72, z: -1.18, r: 1.25, h: 2.55, mat: mats.mossBright },
    { x: 0.28, z: -1.06, r: 1.08, h: 2.18, mat: mats.mossDeep },
    { x: 1.18, z: -0.72, r: 0.94, h: 1.56, mat: mats.ochreHill },
    { x: -2.18, z: -0.18, r: 0.82, h: 1.26, mat: mats.foliageSage }
  ];
  ridgePeaks.forEach((p, idx) => {
    const peak = new THREE.Mesh(new THREE.ConeGeometry(p.r, p.h, 5), p.mat);
    peak.position.set(p.x, 0.72 + p.h * 0.45, p.z);
    peak.rotation.y = idx * 0.75 + 0.3;
    group.add(peak);
  });

  // Neoclassical Domed Civic Assembly Hall (ivory stone + terracotta dome #8A583B)
  const hall = new THREE.Group();
  hall.position.set(-0.32, 0.78, 0.72);
  hall.rotation.y = 0.22;

  const hallPlinth = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.22, 1.38), mats.warmLimestone);
  hallPlinth.position.y = 0.11;
  hall.add(hallPlinth);

  const hallMain = new THREE.Mesh(new THREE.BoxGeometry(2.04, 0.96, 1.16), mats.ivoryStone);
  hallMain.position.y = 0.7;
  hall.add(hallMain);

  // Front portico with 4 columns + pediment
  [-0.45, -0.15, 0.15, 0.45].forEach((cx) => {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.88, 8), mats.whitePlaster);
    col.position.set(cx, 0.66, 0.66);
    hall.add(col);
  });
  const portRoofShape = new THREE.Shape();
  portRoofShape.moveTo(-0.62, 0);
  portRoofShape.lineTo(0.62, 0);
  portRoofShape.lineTo(0, 0.32);
  portRoofShape.closePath();
  const portPedGeo = new THREE.ExtrudeGeometry(portRoofShape, { depth: 0.34, bevelEnabled: false });
  portPedGeo.translate(0, 0, -0.17);
  const portPed = new THREE.Mesh(portPedGeo, mats.civicTerracotta);
  portPed.position.set(0, 1.12, 0.62);
  hall.add(portPed);

  // Illuminated civic windows on wings
  [-0.78, 0.78].forEach((wx) => {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.36, 0.08), mats.warmWindow);
    win.position.set(wx, 0.74, 0.58);
    hall.add(win);
  });

  // Octagonal drum + terracotta dome + brass lantern cupola
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.62, 0.42, 8), mats.whitePlaster);
  drum.position.y = 1.38;
  hall.add(drum);

  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.58, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.52),
    mats.civicTerracotta
  );
  dome.position.y = 1.56;
  hall.add(dome);

  const lantern = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.22, 8), mats.warmWindow);
  lantern.position.y = 2.18;
  hall.add(lantern);
  const spire = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.22, 8), mats.brass);
  spire.position.y = 2.38;
  hall.add(spire);

  group.add(hall);

  // Wooden Coastal Pier extending into the sea
  const pierGroup = new THREE.Group();
  pierGroup.position.set(2.25, 0.32, 1.12);
  pierGroup.rotation.y = 0.42;

  const deck = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.09, 0.62), mats.timber);
  deck.position.set(0.55, 0.14, 0);
  pierGroup.add(deck);

  // Pier pilings
  [0.05, 0.62, 1.22].forEach((px) => {
    [-0.24, 0.24].forEach((pz) => {
      const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.68, 6), mats.timber);
      pile.position.set(px, -0.1, pz);
      pierGroup.add(pile);
    });
  });
  group.add(pierGroup);

  // Charming Miniature Sailboat gently bobbing beside the pier tip
  const boat = new THREE.Group();
  boat.position.set(3.68, 0.12, 1.32);
  boat.rotation.y = -0.52;

  // Curved boat hull (tapered prism/extruded hull)
  const hullShape = new THREE.Shape();
  hullShape.moveTo(-0.56, 0);
  hullShape.quadraticCurveTo(0, -0.28, 0.62, 0);
  hullShape.quadraticCurveTo(0, 0.28, -0.56, 0);
  const hullGeo = new THREE.ExtrudeGeometry(hullShape, { depth: 0.22, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 });
  hullGeo.rotateX(Math.PI / 2);
  const hull = new THREE.Mesh(hullGeo, mats.civicTerracotta);
  hull.position.y = 0.14;
  boat.add(hull);

  const deckTrim = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.04, 0.3), mats.ivoryStone);
  deckTrim.position.y = 0.16;
  boat.add(deckTrim);

  // Timber mast + boom
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.026, 1.18, 6), mats.timber);
  mast.position.set(-0.04, 0.72, 0);
  boat.add(mast);

  // Ivory triangular mainsail
  const mainSailShape = new THREE.Shape();
  mainSailShape.moveTo(0, 0);
  mainSailShape.lineTo(-0.54, 0.05);
  mainSailShape.lineTo(0, 0.96);
  mainSailShape.closePath();
  const mainSail = new THREE.Mesh(new THREE.ShapeGeometry(mainSailShape), mats.sailCream);
  mainSail.position.set(-0.05, 0.28, 0.01);
  mainSail.rotation.y = 0.12;
  boat.add(mainSail);

  // Smaller jib sail
  const jibShape = new THREE.Shape();
  jibShape.moveTo(0, 0);
  jibShape.lineTo(0.44, 0.04);
  jibShape.lineTo(0, 0.74);
  jibShape.closePath();
  const jibSail = new THREE.Mesh(new THREE.ShapeGeometry(jibShape), mats.sailCream);
  jibSail.position.set(0.01, 0.28, -0.01);
  jibSail.rotation.y = -0.08;
  boat.add(jibSail);

  group.add(boat);

  // Foothill broadleaf trees
  const trees = [
    [-1.92, 0.76, 1.12, 0.78],
    [1.36, 0.76, 0.62, 0.82],
    [1.82, 0.76, 0.08, 0.72]
  ];
  trees.forEach(([x, y, z, s]) => {
    const t = makeBroadleafTree(mats, s, mats.mossBright);
    t.position.set(x, y, z);
    group.add(t);
  });

  addFoamRing(group, 4.18, 3.48, mats, foamRings, 5.1);
  tagIslandTree(group, 'social');
  return { group, sailboat: boat };
}

/* ============================================================================
   Night Sky Dome Stars (Subtle Celestial Pinpoints — Never Floating UI Particles)
   ============================================================================ */
function buildCelestialStars() {
  const count = 240;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 0.42; // upper sky hemisphere only
    const r = 54 + Math.random() * 14;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi) + 4;
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xf4efe2,
    size: 0.42,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    fog: false
  });
  const pts = new THREE.Points(geo, mat);
  pts.renderOrder = -1;
  return { points: pts, material: mat };
}

/* ============================================================================
   HTML Projected Island Pins Layer (Shared by 3D & 2D Fallback)
   ============================================================================ */
function createPinsLayer(containerEl, options, onPinClick, onPinHover) {
  const layer = document.createElement('div');
  layer.className = 'world-pins-layer';

  const pinMap = new Map();

  ISLANDS.forEach((isl) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'island-pin';
    btn.dataset.island = isl.key;
    btn.style.setProperty('--pin-color', isl.color);
    btn.setAttribute('aria-label', `${isl.name}：${isl.subtitle}`);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'island-pin-name';
    nameSpan.textContent = `${isl.icon} ${isl.name}`;

    const metaSpan = document.createElement('span');
    metaSpan.className = 'island-pin-meta';
    const labelSpan = document.createElement('span');
    labelSpan.textContent = '已精熟';
    const ratioEl = document.createElement('strong');
    ratioEl.textContent = `0/${isl.unitCount}`;
    metaSpan.appendChild(labelSpan);
    metaSpan.appendChild(ratioEl);

    btn.appendChild(nameSpan);
    btn.appendChild(metaSpan);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      onPinClick(isl.key);
    });
    btn.addEventListener('mouseenter', () => onPinHover(isl.key));
    btn.addEventListener('mouseleave', () => onPinHover(null));

    layer.appendChild(btn);
    pinMap.set(isl.key, { el: btn, ratioEl });
  });

  containerEl.appendChild(layer);

  function refreshPins() {
    ISLANDS.forEach((isl) => {
      const entry = pinMap.get(isl.key);
      if (!entry) return;
      let done = 0;
      let total = isl.unitCount;
      if (options && typeof options.getIslandProgress === 'function') {
        const res = options.getIslandProgress(isl.key);
        if (res && typeof res.done === 'number') done = res.done;
        if (res && typeof res.total === 'number' && res.total > 0) total = res.total;
      }
      entry.ratioEl.textContent = `${done}/${total}`;
    });
  }

  function setActivePin(activeKey) {
    pinMap.forEach((entry, key) => {
      entry.el.classList.toggle('active', key === activeKey);
    });
  }

  refreshPins();

  return { layer, pinMap, refreshPins, setActivePin };
}

/* ============================================================================
   Graceful 2D Isometric Archipelago SVG Fallback (Zero-Crash Guarantee)
   ============================================================================ */
function initSvgFallback(containerEl, options) {
  const wrap = document.createElement('div');
  wrap.className = 'world-svg-fallback';
  wrap.style.cssText = 'position:relative;width:100%;height:100%;overflow:hidden;user-select:none;';

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 1200 720');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  svg.style.cssText = 'width:100%;height:100%;display:block;';

  const layouts = {
    math: { cx: 315, cy: 365 },
    bio: { cx: 885, cy: 440 },
    physchem: { cx: 590, cy: 195 },
    earth: { cx: 945, cy: 235 },
    social: { cx: 435, cy: 550 }
  };

  svg.innerHTML = `
    <rect id="fb-sea" x="0" y="0" width="1200" height="720" fill="#78B2B8" />
    <g id="fb-waves" stroke="#E9E4D8" stroke-opacity="0.28" stroke-width="2" fill="none">
      <path d="M60 150 Q140 138 220 150 T380 150" />
      <path d="M760 125 Q840 112 920 125 T1080 125" />
      <path d="M120 510 Q210 495 300 510 T480 510" />
      <path d="M660 615 Q750 600 840 615 T1020 615" />
      <path d="M460 355 Q545 344 630 355 T800 355" />
    </g>

    <!-- 1. 數學幾何島 -->
    <g class="fb-island" data-island="math" style="cursor:pointer" transform="translate(315,365)">
      <ellipse cx="0" cy="22" rx="112" ry="56" fill="#F6F3EC" fill-opacity="0.45" />
      <polygon points="-96,12 -48,-36 48,-36 96,12 48,54 -48,54" fill="#DEC8A1" stroke="#5A4E3C" stroke-width="2" />
      <polygon points="-76,4 -38,-30 38,-30 76,4 38,38 -38,38" fill="#DFD6C5" stroke="#5A4E3C" stroke-width="1.6" />
      <!-- Parthenon -->
      <rect x="-52" y="-36" width="66" height="34" fill="#F4F0E7" stroke="#2B4C7E" stroke-width="2" />
      <polygon points="-58,-36 -19,-64 20,-36" fill="#2B4C7E" />
      <line x1="-42" y1="-34" x2="-42" y2="-2" stroke="#C7BFA9" stroke-width="4" />
      <line x1="-26" y1="-34" x2="-26" y2="-2" stroke="#C7BFA9" stroke-width="4" />
      <line x1="-10" y1="-34" x2="-10" y2="-2" stroke="#C7BFA9" stroke-width="4" />
      <line x1="6" y1="-34" x2="6" y2="-2" stroke="#C7BFA9" stroke-width="4" />
      <!-- Pythagoras brass emblem -->
      <polygon points="28,-6 54,-6 28,-28" fill="#C48F36" stroke="#7A5618" stroke-width="1.5" />
      <rect x="28" y="-6" width="26" height="24" fill="#2B4C7E" stroke="#C48F36" stroke-width="2" />
      <rect x="8" y="-28" width="20" height="22" fill="#2B4C7E" stroke="#C48F36" stroke-width="2" />
    </g>

    <!-- 2. 生物秘境島 -->
    <g class="fb-island" data-island="bio" style="cursor:pointer" transform="translate(885,440)">
      <ellipse cx="0" cy="18" rx="110" ry="56" fill="#F6F3EC" fill-opacity="0.45" />
      <ellipse cx="0" cy="10" rx="96" ry="48" fill="#4F8261" stroke="#2A4D38" stroke-width="2" />
      <ellipse cx="-26" cy="24" rx="28" ry="14" fill="#4EA3A1" stroke="#EDE6D8" stroke-width="2" />
      <!-- Glass greenhouse dome -->
      <path d="M-24,4 A42,42 0 0 1 60,4 Z" fill="#DCF0EB" fill-opacity="0.72" stroke="#C48F36" stroke-width="2.5" />
      <path d="M18,-38 L18,4 M-4,-32 Q10,-12 4,4 M40,-32 Q28,-12 34,4" stroke="#C48F36" stroke-width="1.6" fill="none" />
      <rect x="-26" y="2" width="88" height="12" fill="#EDE6D8" stroke="#5A5A50" stroke-width="1.5" />
      <polygon points="-58,-4 -44,-36 -30,-4" fill="#35684D" />
      <polygon points="-76,8 -62,-20 -48,8" fill="#7EA172" />
    </g>

    <!-- 3. 理化實驗島 -->
    <g class="fb-island" data-island="physchem" style="cursor:pointer" transform="translate(590,195)">
      <ellipse cx="0" cy="18" rx="112" ry="54" fill="#F6F3EC" fill-opacity="0.45" />
      <ellipse cx="0" cy="8" rx="95" ry="44" fill="#46515C" stroke="#2B333C" stroke-width="2" />
      <ellipse cx="-14" cy="4" rx="74" ry="34" fill="#DFD6C5" />
      <!-- Terracotta Lab -->
      <rect x="-64" y="-26" width="66" height="36" fill="#B24C3E" stroke="#6E2D24" stroke-width="1.8" />
      <polygon points="-70,-26 -31,-50 8,-26" fill="#46515C" />
      <rect x="-52" y="-14" width="12" height="14" fill="#FFD68A" class="fb-glow" />
      <rect x="-32" y="-14" width="12" height="14" fill="#FFD68A" class="fb-glow" />
      <!-- Striped Lighthouse -->
      <polygon points="32,8 38,-68 58,-68 64,8" fill="#F4F0E7" stroke="#5A4E44" stroke-width="1.6" />
      <rect x="35" y="-44" width="26" height="14" fill="#B24C3E" />
      <rect x="34" y="-16" width="28" height="14" fill="#B24C3E" />
      <rect x="39" y="-82" width="18" height="14" fill="#FFE6A8" class="fb-glow" />
      <polygon points="35,-82 48,-98 61,-82" fill="#2A7A73" />
    </g>

    <!-- 4. 地科天文島 -->
    <g class="fb-island" data-island="earth" style="cursor:pointer" transform="translate(945,235)">
      <ellipse cx="0" cy="22" rx="108" ry="52" fill="#F6F3EC" fill-opacity="0.45" />
      <!-- Cutaway Strata -->
      <rect x="-86" y="4" width="172" height="16" rx="4" fill="#4A5568" />
      <rect x="-82" y="-10" width="164" height="14" rx="3" fill="#C8C2B4" />
      <rect x="-78" y="-22" width="156" height="12" rx="3" fill="#8A7968" />
      <rect x="-74" y="-34" width="148" height="12" rx="3" fill="#D6B485" />
      <!-- Volcano -->
      <polygon points="10,-34 42,-82 74,-34" fill="#4A5568" />
      <ellipse cx="42" cy="-82" rx="10" ry="4" fill="#C46838" class="fb-glow" />
      <!-- Observatory -->
      <rect x="-54" y="-56" width="46" height="22" fill="#EDE6D8" stroke="#4A5568" stroke-width="1.6" />
      <path d="M-54,-56 A23,23 0 0 1 -8,-56 Z" fill="#F4F0E7" stroke="#4A5568" stroke-width="1.6" />
      <line x1="-30" y1="-68" x2="-12" y2="-82" stroke="#C48F36" stroke-width="5" stroke-linecap="round" />
    </g>

    <!-- 5. 社會人文島 -->
    <g class="fb-island" data-island="social" style="cursor:pointer" transform="translate(435,550)">
      <ellipse cx="0" cy="18" rx="114" ry="54" fill="#F6F3EC" fill-opacity="0.45" />
      <ellipse cx="0" cy="10" rx="98" ry="46" fill="#DEC8A1" stroke="#7A5F3D" stroke-width="2" />
      <ellipse cx="-6" cy="4" rx="82" ry="36" fill="#B48A56" />
      <!-- Central Mountain Range -->
      <polygon points="-76,-6 -46,-62 -16,-6" fill="#35684D" />
      <polygon points="-42,-6 -6,-74 30,-6" fill="#4F8261" />
      <polygon points="4,-6 36,-54 68,-6" fill="#35684D" />
      <!-- Civic Domed Hall -->
      <rect x="-46" y="-12" width="68" height="30" fill="#EDE6D8" stroke="#6E442C" stroke-width="1.6" />
      <path d="M-28,-12 A16,16 0 0 1 4,-12 Z" fill="#8A583B" />
      <!-- Pier & Sailboat -->
      <rect x="52" y="14" width="38" height="8" fill="#7B5438" />
      <path d="M90,26 Q106,36 122,26 Z" fill="#8A583B" />
      <polygon points="106,24 106,-2 122,22" fill="#F7F2E7" stroke="#7B5438" stroke-width="1.2" />
    </g>
  `;

  wrap.appendChild(svg);
  containerEl.appendChild(wrap);

  let activeKey = null;

  const select = (key) => {
    activeKey = key;
    pins.setActivePin(key);
    if (options && typeof options.onSelectIsland === 'function') {
      options.onSelectIsland(key);
    }
  };

  const hover = (key) => {
    if (options && typeof options.onHoverIsland === 'function') {
      options.onHoverIsland(key);
    }
  };

  const pins = createPinsLayer(wrap, options, select, hover);

  const positionFallbackPins = () => {
    const rect = wrap.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const scale = Math.max(rect.width / 1200, rect.height / 720);
    const offX = (rect.width - 1200 * scale) / 2;
    const offY = (rect.height - 720 * scale) / 2;
    ISLANDS.forEach((isl) => {
      const entry = pins.pinMap.get(isl.key);
      const pos = layouts[isl.key];
      if (!entry || !pos) return;
      const px = offX + pos.cx * scale;
      const py = offY + (pos.cy - 68) * scale;
      entry.el.style.left = `${Math.round(px)}px`;
      entry.el.style.top = `${Math.round(py)}px`;
    });
  };

  svg.querySelectorAll('.fb-island').forEach((g) => {
    const key = g.getAttribute('data-island');
    g.addEventListener('click', () => select(key));
    g.addEventListener('mouseenter', () => hover(key));
    g.addEventListener('mouseleave', () => hover(null));
  });

  const ro = new ResizeObserver(positionFallbackPins);
  ro.observe(wrap);
  positionFallbackPins();

  const seaRect = svg.querySelector('#fb-sea');

  return {
    focusIsland(key) {
      activeKey = key;
      pins.setActivePin(key);
    },
    resetCamera() {
      activeKey = null;
      pins.setActivePin(null);
    },
    setTimeOfDay(tod) {
      const preset = TOD_PRESETS[tod] || TOD_PRESETS.day;
      if (seaRect) seaRect.setAttribute('fill', preset.sea);
      const glowFill = tod === 'night' ? '#FFCB66' : tod === 'dusk' ? '#FFB95C' : '#F2E5C6';
      svg.querySelectorAll('.fb-glow').forEach((el) => el.setAttribute('fill', glowFill));
    },
    setPaused() {},
    refreshPins: pins.refreshPins,
    resize: positionFallbackPins,
    dispose() {
      ro.disconnect();
      if (wrap.parentNode === containerEl) containerEl.removeChild(wrap);
    }
  };
}

/* ============================================================================
   Main 3D World Initialization
   ============================================================================ */
function init(containerEl, options = {}) {
  if (!containerEl) {
    throw new Error('JuniorIslands3D.init requires a valid containerEl');
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    console.warn('[JuniorIslands3D] WebGL unavailable, falling back to 2D Isometric SVG:', err);
    return initSvgFallback(containerEl, options);
  }

  const initW = containerEl.clientWidth || window.innerWidth || 960;
  const initH = containerEl.clientHeight || window.innerHeight || 600;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(initW, initH, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = TOD_PRESETS.day.exposure;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  containerEl.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(TOD_PRESETS.day.sky);
  scene.fog = new THREE.Fog(TOD_PRESETS.day.fog, TOD_PRESETS.day.fogNear, TOD_PRESETS.day.fogFar);

  const camera = new THREE.PerspectiveCamera(40, initW / initH, 0.5, 160);
  const DEFAULT_CAM_POS = new THREE.Vector3(0.5, 17.8, 25.2);
  const DEFAULT_TARGET = new THREE.Vector3(0.0, 0.5, 0.8);
  camera.position.copy(DEFAULT_CAM_POS);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(DEFAULT_TARGET);
  controls.enableDamping = true;
  controls.dampingFactor = 0.065;
  controls.maxPolarAngle = Math.PI * 0.44;
  controls.minPolarAngle = Math.PI * 0.16;
  controls.minDistance = 11;
  controls.maxDistance = 36;
  controls.panSpeed = 0.72;
  controls.rotateSpeed = 0.75;
  controls.update();

  // Lighting Rig (Warm Architectural Maquette Key + Hemisphere + Soft Cool Fill)
  const hemiLight = new THREE.HemisphereLight(
    TOD_PRESETS.day.hemiSky,
    TOD_PRESETS.day.hemiGround,
    TOD_PRESETS.day.hemiIntensity
  );
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(TOD_PRESETS.day.sunColor, TOD_PRESETS.day.sunIntensity);
  sunLight.position.set(...TOD_PRESETS.day.sunPos);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.camera.near = 2;
  sunLight.shadow.camera.far = 75;
  sunLight.shadow.camera.left = -22;
  sunLight.shadow.camera.right = 22;
  sunLight.shadow.camera.top = 22;
  sunLight.shadow.camera.bottom = -22;
  sunLight.shadow.bias = -0.0005;
  sunLight.shadow.normalBias = 0.03;
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(TOD_PRESETS.day.fillColor, TOD_PRESETS.day.fillIntensity);
  fillLight.position.set(-16, 12, -14);
  scene.add(fillLight);

  // Calm Low-Poly Faceted Sea Plane
  const seaGeo = new THREE.PlaneGeometry(132, 132, 54, 54);
  seaGeo.rotateX(-Math.PI / 2);
  const seaPosAttr = seaGeo.attributes.position;
  const seaBaseY = new Float32Array(seaPosAttr.count);
  const seaPhase = new Float32Array(seaPosAttr.count);
  for (let i = 0; i < seaPosAttr.count; i++) {
    const vx = seaPosAttr.getX(i);
    const vz = seaPosAttr.getZ(i);
    seaBaseY[i] = 0;
    seaPhase[i] = vx * 0.28 + vz * 0.22;
  }
  const seaMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(TOD_PRESETS.day.sea),
    roughness: 0.58,
    metalness: 0.08,
    flatShading: true
  });
  const seaMesh = new THREE.Mesh(seaGeo, seaMat);
  seaMesh.receiveShadow = true;
  scene.add(seaMesh);

  // Celestial Night Sky Dome Stars
  const stars = buildCelestialStars();
  scene.add(stars.points);

  // Build 5 Hand-Crafted Procedural Islands
  const mats = createMaterialBank();
  const foamRings = [];
  const islandGroups = new Map();
  const pickableRoots = [];
  const pinAnchors = new Map();

  let lighthouseBeam = null;
  let lighthouseBeamMat = null;
  let sailboat = null;
  let sailboatBaseY = 0.12;

  const builders = {
    math: buildMathIsland,
    bio: buildBioIsland,
    physchem: buildPhysChemIsland,
    earth: buildEarthIsland,
    social: buildSocialIsland
  };

  ISLANDS.forEach((def) => {
    const built = builders[def.key](mats, foamRings);
    built.group.position.set(def.pos[0], def.pos[1], def.pos[2]);
    scene.add(built.group);

    islandGroups.set(def.key, built.group);
    pickableRoots.push(built.group);
    pinAnchors.set(def.key, new THREE.Vector3(def.pos[0], def.pinHeight, def.pos[2]));

    if (built.lighthouseBeam) {
      lighthouseBeam = built.lighthouseBeam;
      lighthouseBeamMat = built.lighthouseBeamMat;
    }
    if (built.sailboat) {
      sailboat = built.sailboat;
      sailboatBaseY = built.sailboat.position.y;
    }
  });

  // Camera Tween State
  let camAnim = null;
  let activeIslandKey = null;
  let hoveredIslandKey = null;

  function cancelCameraAnim() {
    camAnim = null;
  }
  controls.addEventListener('start', cancelCameraAnim);

  function animateCameraTo(targetPos, camPos) {
    camAnim = {
      destTarget: targetPos.clone(),
      destCam: camPos.clone()
    };
  }

  function focusIsland(key) {
    const def = ISLANDS.find((item) => item.key === key);
    if (!def) return;
    activeIslandKey = key;
    pins.setActivePin(key);

    const w = containerEl.clientWidth || window.innerWidth;
    // Slight rightward target offset on wide viewports so the right-side drawer leaves the island framed cleanly
    const drawerOffsetX = w >= 920 ? 1.85 : 0;
    const destTarget = new THREE.Vector3(def.pos[0] + drawerOffsetX, 1.35, def.pos[2]);
    const destCam = new THREE.Vector3(def.pos[0] + drawerOffsetX + 2.8, 8.6, def.pos[2] + 11.4);
    animateCameraTo(destTarget, destCam);
  }

  function resetCamera() {
    activeIslandKey = null;
    pins.setActivePin(null);
    animateCameraTo(DEFAULT_TARGET, DEFAULT_CAM_POS);
  }

  function handleSelect(key) {
    focusIsland(key);
    if (options && typeof options.onSelectIsland === 'function') {
      options.onSelectIsland(key);
    }
  }

  function setHoveredIsland(key) {
    if (hoveredIslandKey === key) return;
    hoveredIslandKey = key;
    renderer.domElement.style.cursor = key ? 'pointer' : '';
    if (options && typeof options.onHoverIsland === 'function') {
      options.onHoverIsland(key);
    }
  }

  // HTML Projected Island Pins
  const pins = createPinsLayer(containerEl, options, handleSelect, setHoveredIsland);

  // Day / Dusk / Night Transition State
  let todTarget = TOD_PRESETS.day;
  const targetSkyColor = new THREE.Color(TOD_PRESETS.day.sky);
  const targetFogColor = new THREE.Color(TOD_PRESETS.day.fog);
  const targetSeaColor = new THREE.Color(TOD_PRESETS.day.sea);
  const targetFoamColor = new THREE.Color(TOD_PRESETS.day.foam);
  const targetSunColor = new THREE.Color(TOD_PRESETS.day.sunColor);
  const targetHemiSky = new THREE.Color(TOD_PRESETS.day.hemiSky);
  const targetHemiGround = new THREE.Color(TOD_PRESETS.day.hemiGround);
  const targetFillColor = new THREE.Color(TOD_PRESETS.day.fillColor);
  const targetSunPos = new THREE.Vector3(...TOD_PRESETS.day.sunPos);

  function setTimeOfDay(mode) {
    const preset = TOD_PRESETS[mode] || TOD_PRESETS.day;
    todTarget = preset;
    targetSkyColor.set(preset.sky);
    targetFogColor.set(preset.fog);
    targetSeaColor.set(preset.sea);
    targetFoamColor.set(preset.foam);
    targetSunColor.set(preset.sunColor);
    targetHemiSky.set(preset.hemiSky);
    targetHemiGround.set(preset.hemiGround);
    targetFillColor.set(preset.fillColor);
    targetSunPos.set(...preset.sunPos);
  }

  // Raycasting for Click (<6px drag) and Hover
  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();
  let pointerDownX = 0;
  let pointerDownY = 0;
  let isPointerDown = false;

  function pickIslandAtClient(clientX, clientY) {
    const rect = renderer.domElement.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNDC, camera);
    const hits = raycaster.intersectObjects(pickableRoots, true);
    for (let i = 0; i < hits.length; i++) {
      const key = hits[i].object.userData.islandKey;
      if (key) return key;
    }
    return null;
  }

  function onPointerDown(e) {
    isPointerDown = true;
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
  }

  function onPointerMove(e) {
    if (isPointerDown) return;
    const hitKey = pickIslandAtClient(e.clientX, e.clientY);
    setHoveredIsland(hitKey);
  }

  function onPointerUp(e) {
    if (!isPointerDown) return;
    isPointerDown = false;
    const dist = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
    if (dist < 6) {
      const hitKey = pickIslandAtClient(e.clientX, e.clientY);
      if (hitKey) {
        handleSelect(hitKey);
      }
    }
  }

  function onPointerLeave() {
    isPointerDown = false;
    setHoveredIsland(null);
  }

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
  renderer.domElement.addEventListener('pointerleave', onPointerLeave);

  // Pin Projection Update
  const projVec = new THREE.Vector3();
  function updatePinsProjection() {
    const w = containerEl.clientWidth;
    const h = containerEl.clientHeight;
    if (!w || !h) return;

    ISLANDS.forEach((def) => {
      const entry = pins.pinMap.get(def.key);
      const anchor = pinAnchors.get(def.key);
      if (!entry || !anchor) return;

      projVec.copy(anchor);
      // Slight gentle lift when hovered/active
      const grp = islandGroups.get(def.key);
      if (grp) projVec.y = def.pinHeight + grp.position.y;
      projVec.project(camera);

      if (projVec.z > 1 || projVec.z < -1) {
        entry.el.style.display = 'none';
        return;
      }

      const sx = (projVec.x * 0.5 + 0.5) * w;
      const sy = (-projVec.y * 0.5 + 0.5) * h;

      entry.el.style.display = '';
      entry.el.style.left = `${Math.round(sx)}px`;
      entry.el.style.top = `${Math.round(sy)}px`;
    });
  }

  // Responsive Resize Handling
  function resize() {
    const w = containerEl.clientWidth;
    const h = containerEl.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    updatePinsProjection();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(containerEl);

  // Main Animation Loop (Clean Pause / Resume Support)
  let rafId = null;
  let isPaused = false;
  let isDisposed = false;
  let elapsed = 0;
  let lastTime = performance.now();

  function tick(now) {
    if (isPaused || isDisposed) return;
    rafId = requestAnimationFrame(tick);

    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    elapsed += dt;

    // 1. Calm sinusoidal sea swell
    for (let i = 0; i < seaPosAttr.count; i++) {
      const y = Math.sin(elapsed * 1.15 + seaPhase[i]) * 0.085 + Math.cos(elapsed * 0.72 - seaPhase[i] * 0.6) * 0.04;
      seaPosAttr.setY(i, seaBaseY[i] + y);
    }
    seaPosAttr.needsUpdate = true;

    // 2. Subtle foam ring breathing around island bases
    for (let i = 0; i < foamRings.length; i++) {
      const f = foamRings[i];
      const pulse = 1 + Math.sin(elapsed * 1.35 + f.phase) * 0.022;
      f.mesh.scale.set(f.baseRx * pulse, 1, f.baseRz * pulse);
    }

    // 3. Subtle hover elevation on hovered/active island (tactile model feel)
    islandGroups.forEach((grp, key) => {
      const targetY = key === hoveredIslandKey ? 0.16 : 0.0;
      grp.position.y += (targetY - grp.position.y) * Math.min(1, dt * 8);
    });

    // 4. Lighthouse beam rotation & Social sailboat gentle wave bobbing
    if (lighthouseBeam) {
      lighthouseBeam.rotation.y += dt * 0.65;
    }
    if (sailboat) {
      sailboat.position.y = sailboatBaseY + Math.sin(elapsed * 1.65) * 0.055;
      sailboat.rotation.z = Math.sin(elapsed * 1.25 + 0.6) * 0.05;
      sailboat.rotation.x = Math.cos(elapsed * 1.05) * 0.035;
    }

    // 5. Smooth Day / Dusk / Night transitions
    const todLerp = Math.min(1, dt * 3.8);
    scene.background.lerp(targetSkyColor, todLerp);
    scene.fog.color.lerp(targetFogColor, todLerp);
    scene.fog.near += (todTarget.fogNear - scene.fog.near) * todLerp;
    scene.fog.far += (todTarget.fogFar - scene.fog.far) * todLerp;
    seaMat.color.lerp(targetSeaColor, todLerp);
    mats.foam.color.lerp(targetFoamColor, todLerp);

    sunLight.color.lerp(targetSunColor, todLerp);
    sunLight.intensity += (todTarget.sunIntensity - sunLight.intensity) * todLerp;
    sunLight.position.lerp(targetSunPos, todLerp);

    hemiLight.color.lerp(targetHemiSky, todLerp);
    hemiLight.groundColor.lerp(targetHemiGround, todLerp);
    hemiLight.intensity += (todTarget.hemiIntensity - hemiLight.intensity) * todLerp;

    fillLight.color.lerp(targetFillColor, todLerp);
    fillLight.intensity += (todTarget.fillIntensity - fillLight.intensity) * todLerp;

    mats.warmWindow.emissiveIntensity += (todTarget.windowEmissive - mats.warmWindow.emissiveIntensity) * todLerp;
    mats.lanternGlass.emissiveIntensity += (todTarget.lanternEmissive - mats.lanternGlass.emissiveIntensity) * todLerp;
    mats.craterGlow.emissiveIntensity += (todTarget.craterEmissive - mats.craterGlow.emissiveIntensity) * todLerp;
    mats.slitDark.emissiveIntensity += (todTarget.windowEmissive * 0.45 - mats.slitDark.emissiveIntensity) * todLerp;
    stars.material.opacity += (todTarget.starOpacity - stars.material.opacity) * todLerp;
    renderer.toneMappingExposure += (todTarget.exposure - renderer.toneMappingExposure) * todLerp;

    if (lighthouseBeamMat) {
      lighthouseBeamMat.opacity += (todTarget.beamOpacity - lighthouseBeamMat.opacity) * todLerp;
      lighthouseBeamMat.visible = lighthouseBeamMat.opacity > 0.01;
    }

    // 6. Smooth ease-out camera focus lerp (canceled immediately on manual drag)
    if (camAnim) {
      const k = 1 - Math.exp(-5.4 * dt);
      camera.position.lerp(camAnim.destCam, k);
      controls.target.lerp(camAnim.destTarget, k);
      if (
        camera.position.distanceTo(camAnim.destCam) < 0.06 &&
        controls.target.distanceTo(camAnim.destTarget) < 0.06
      ) {
        camera.position.copy(camAnim.destCam);
        controls.target.copy(camAnim.destTarget);
        camAnim = null;
      }
    }

    controls.update();
    renderer.render(scene, camera);
    updatePinsProjection();
  }

  function startLoop() {
    if (rafId !== null || isPaused || isDisposed) return;
    lastTime = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function setPaused(paused) {
    const next = Boolean(paused);
    if (next === isPaused) return;
    isPaused = next;
    if (isPaused) {
      stopLoop();
    } else {
      resize();
      startLoop();
    }
  }

  function dispose() {
    if (isDisposed) return;
    isDisposed = true;
    stopLoop();
    resizeObserver.disconnect();
    controls.removeEventListener('start', cancelCameraAnim);
    controls.dispose();

    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    renderer.domElement.removeEventListener('pointerup', onPointerUp);
    renderer.domElement.removeEventListener('pointerleave', onPointerLeave);

    scene.traverse((obj) => {
      if (obj.geometry && typeof obj.geometry.dispose === 'function') {
        obj.geometry.dispose();
      }
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m && typeof m.dispose === 'function' && m.dispose());
        } else if (typeof obj.material.dispose === 'function') {
          obj.material.dispose();
        }
      }
    });

    renderer.dispose();
    if (renderer.domElement.parentNode === containerEl) {
      containerEl.removeChild(renderer.domElement);
    }
    if (pins.layer.parentNode === containerEl) {
      containerEl.removeChild(pins.layer);
    }
  }

  startLoop();

  return {
    focusIsland,
    resetCamera,
    setTimeOfDay,
    setPaused,
    refreshPins: pins.refreshPins,
    resize,
    dispose
  };
}

window.JuniorIslands3D = {
  ISLANDS,
  init
};

export { ISLANDS, init };
