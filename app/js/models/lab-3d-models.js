import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * 國中知識群島 — 7 大可信 3D 立體教學模型模組
 * 嚴格遵守 UI_UX_DESIGN_CONSTITUTION.md（禁止無意義光球/幾何替代、具可信多部件結構、真實材質、互動參數與文字解讀）
 * 暴露 API: window.JuniorLab3D = { hasModel, getMeta, mount }
 */

const MODEL_META = {
  SCI_7_1_1: {
    title: '3D 動植物細胞剖面與滲透模型',
    subtitle: '切換植物／動物細胞與高／等／低張溶液，觀察質壁分離與膨壓保護機制',
    hint: '拖曳旋轉 360°・滾輪縮放・觀察液胞與細胞膜形變'
  },
  SCI_7_1_3: {
    title: '3D 心臟四腔室與體／肺循環立體管路',
    subtitle: '解剖前視剖面：比較左右心室壁厚度，追蹤肺動脈缺氧血與主動脈充氧血路徑',
    hint: '拖曳旋轉心臟剖面・切換體循環／肺循環高亮'
  },
  SCI_8_2_2: {
    title: '3D 凸透鏡光具座與真實折射光束實驗台',
    subtitle: '拖動燭火物距 u，即時檢視兩條特殊光線折射、倒立實像與正立放大虛像',
    hint: '拖曳調整觀察角度・滑動物距 u 觀察成像位置與倍率'
  },
  SCI_9_3_3: {
    title: '3D 立體電路實驗板與電子能量流',
    subtitle: '切換串聯／並聯、扳動銅質閘刀開關與電池電壓，對比燈泡功率與總電流',
    hint: '拖曳旋轉電路板・切換串並聯與開關觀察能量流動'
  },
  SOC_G1_C3: {
    title: '3D 台灣中央山脈立體地形與焚風氣流剖面',
    subtitle: '迎風面濕絕熱降溫降雨（−0.6°C/100m）與背風面乾絕熱增溫焚風（+1.0°C/100m）',
    hint: '拖曳旋轉中央山脈地形・切換風向與高度溫度標牌'
  },
  SCI_9_3_4: {
    title: '3D 地層截切定律與台灣聚合板塊剖面',
    subtitle: '五階段地質演化：水平沉積 → 板塊褶皺 → 隆起侵蝕 → 逆斷層錯動 → 火成岩脈切穿',
    hint: '拖曳旋轉地層岩塊・依步驟檢驗「被切穿較老、切穿最新」'
  },
  SCI_9_3_5: {
    title: '3D 日地月 23.5° 傾斜公轉與月相潮汐儀',
    subtitle: '固定 23.5° 地軸傾角檢視四季直射緯度、晝夜晨昏線與朔望大潮／上下弦小潮',
    hint: '拖曳檢視地軸傾角與晝夜面・切換節氣與月相'
  }
};

/* =========================================================================
 * 共用基礎工具：WebGL 檢測、場景建立、紙感 3D 標籤、安全資源釋放
 * ========================================================================= */

function createFallbackUI(containerEl, meta, reason) {
  containerEl.innerHTML =
    '<div class="lab3d-wrap">' +
      '<div class="lab3d-readout" style="border-left-color:#B24234;">' +
        '<strong>⚠ 目前瀏覽器環境無法啟用 WebGL 3D 渲染（' + (meta ? meta.title : '3D 教學模型') + '）</strong>' +
        '<p style="margin:6px 0 0;">請點擊上方的「<strong>📊 2D 實驗模擬與數據</strong>」分頁，即可進行完整的互動操作與數據探究。' +
        (reason ? '（技術訊息：' + reason + '）' : '') + '</p>' +
      '</div>' +
    '</div>';
  return function noopCleanup() {};
}

function disposeObject3D(root) {
  if (!root) return;
  const disposedGeo = new Set();
  const disposedMat = new Set();
  const disposedTex = new Set();

  root.traverse((obj) => {
    if (obj.geometry && !disposedGeo.has(obj.geometry)) {
      disposedGeo.add(obj.geometry);
      obj.geometry.dispose();
    }
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const m of mats) {
        if (!m || disposedMat.has(m)) continue;
        disposedMat.add(m);
        for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'alphaMap', 'bumpMap']) {
          if (m[key] && !disposedTex.has(m[key])) {
            disposedTex.add(m[key]);
            m[key].dispose();
          }
        }
        m.dispose();
      }
    }
  });
}

/**
 * 產生清晰印刷手札風 3D Sprite 標籤（符合 UI/UX 憲法：米白紙底＋炭黑細框）
 */
function createLabelSprite(text, options = {}) {
  const {
    bg = '#FCFBF7',
    border = '#1E252B',
    color = '#1E252B',
    dotColor = null,
    fontSize = 26,
    scale = 0.0085
  } = options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const font = `700 ${fontSize}px "Noto Sans TC", "PingFang TC", sans-serif`;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const padX = 18;
  const padY = 12;
  const dotW = dotColor ? 22 : 0;
  const w = Math.ceil(metrics.width + padX * 2 + dotW);
  const h = Math.ceil(fontSize + padY * 2);

  canvas.width = Math.max(64, w * 2);
  canvas.height = Math.max(32, h * 2);
  ctx.scale(2, 2);

  // 卡片底色與細線框
  const r = 6;
  ctx.fillStyle = bg;
  ctx.strokeStyle = border;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(r, 1.5);
  ctx.lineTo(w - r, 1.5);
  ctx.quadraticCurveTo(w - 1.5, 1.5, w - 1.5, r);
  ctx.lineTo(w - 1.5, h - r);
  ctx.quadraticCurveTo(w - 1.5, h - 1.5, w - r, h - 1.5);
  ctx.lineTo(r, h - 1.5);
  ctx.quadraticCurveTo(1.5, h - 1.5, 1.5, h - r);
  ctx.lineTo(1.5, r);
  ctx.quadraticCurveTo(1.5, 1.5, r, 1.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  if (dotColor) {
    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(padX + 6, h / 2, 6.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, padX + dotW, h / 2 + 1);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(w * scale, h * scale, 1);
  sprite.renderOrder = 10;
  return sprite;
}

/**
 * 通用 3D 實驗台舞台建置器（含 OrbitControls、DPR 控制、ResizeObserver、重置視角鍵、自動釋放）
 */
function createLabStage(containerEl, meta, opts = {}) {
  const {
    bgColor = 0x1e262b,
    cameraPos = [0, 3.2, 7.8],
    targetPos = [0, 0, 0],
    fov = 40,
    minDist = 3.0,
    maxDist = 18.0,
    maxPolar = Math.PI * 0.85
  } = opts;

  containerEl.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'lab3d-wrap';

  const canvasBox = document.createElement('div');
  canvasBox.className = 'lab3d-canvas-box';
  canvasBox.style.background = '#' + bgColor.toString(16).padStart(6, '0');

  const hintChip = document.createElement('div');
  hintChip.className = 'lab3d-hint-chip';
  hintChip.textContent = '🧭 ' + (meta.hint || '拖曳旋轉 360°・滾輪縮放');
  canvasBox.appendChild(hintChip);

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'btn-light';
  resetBtn.textContent = '↺ 重置視角';
  resetBtn.style.cssText = 'position:absolute;top:10px;right:10px;z-index:4;padding:3px 9px;font-size:0.74rem;';
  canvasBox.appendChild(resetBtn);

  const toolbar = document.createElement('div');
  toolbar.className = 'lab3d-toolbar';

  const readout = document.createElement('div');
  readout.className = 'lab3d-readout';

  wrap.appendChild(canvasBox);
  wrap.appendChild(toolbar);
  wrap.appendChild(readout);
  containerEl.appendChild(wrap);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    if (!renderer.getContext()) {
      throw new Error('無法取得 WebGL Context');
    }
  } catch (err) {
    return { error: err.message || 'WebGL 初始化失敗' };
  }

  const width = Math.max(280, canvasBox.clientWidth || 680);
  const height = Math.max(240, canvasBox.clientHeight || 410);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  canvasBox.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(bgColor);

  const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);
  camera.position.set(cameraPos[0], cameraPos[1], cameraPos[2]);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(targetPos[0], targetPos[1], targetPos[2]);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = minDist;
  controls.maxDistance = maxDist;
  controls.maxPolarAngle = maxPolar;
  controls.update();

  resetBtn.addEventListener('click', () => {
    camera.position.set(cameraPos[0], cameraPos[1], cameraPos[2]);
    controls.target.set(targetPos[0], targetPos[1], targetPos[2]);
    controls.update();
  });

  // 標準三點實驗室光照（各模型可自行微調或新增光源）
  const hemiLight = new THREE.HemisphereLight(0xf6f3ea, 0x3b444c, 0.9);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xfff7e8, 1.35);
  keyLight.position.set(6, 9, 7);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 28;
  const sc = 7;
  keyLight.shadow.camera.left = -sc;
  keyLight.shadow.camera.right = sc;
  keyLight.shadow.camera.top = sc;
  keyLight.shadow.camera.bottom = -sc;
  keyLight.shadow.bias = -0.0008;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xb9d8f0, 0.55);
  rimLight.position.set(-7, 4, -6);
  scene.add(rimLight);

  const onResize = () => {
    const w = Math.max(240, canvasBox.clientWidth);
    const h = Math.max(220, canvasBox.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
  };

  let ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(onResize);
    ro.observe(canvasBox);
  }
  window.addEventListener('resize', onResize);

  let rafId = 0;
  let disposed = false;
  let tickCallback = null;
  const clock = new THREE.Clock();

  function animate() {
    if (disposed) return;
    rafId = requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.elapsedTime;
    if (tickCallback) tickCallback(dt, elapsed);
    controls.update();
    renderer.render(scene, camera);
  }

  function start(fn) {
    tickCallback = fn;
    animate();
  }

  function cleanup() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(rafId);
    if (ro) ro.disconnect();
    window.removeEventListener('resize', onResize);
    controls.dispose();
    disposeObject3D(scene);
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }

  return {
    scene,
    camera,
    renderer,
    controls,
    hemiLight,
    keyLight,
    rimLight,
    toolbar,
    readout,
    canvasBox,
    start,
    cleanup
  };
}

function addToolbarGroup(toolbar, labelText) {
  const group = document.createElement('div');
  group.style.cssText = 'display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap;margin-right:8px;';
  if (labelText) {
    const lbl = document.createElement('span');
    lbl.textContent = labelText;
    lbl.style.cssText = 'font-size:0.8rem;font-weight:700;color:#455059;';
    group.appendChild(lbl);
  }
  toolbar.appendChild(group);
  return group;
}

function makeToggleButtons(parent, items, activeKey, onSelect) {
  const btnMap = {};
  for (const item of items) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-light' + (item.key === activeKey ? ' active' : '');
    btn.textContent = item.label;
    btn.addEventListener('click', () => {
      Object.keys(btnMap).forEach((k) => btnMap[k].classList.toggle('active', k === item.key));
      onSelect(item.key);
    });
    parent.appendChild(btn);
    btnMap[item.key] = btn;
  }
  return btnMap;
}

/* =========================================================================
 * 模型 1：SCI_7_1_1 — 3D 動植物細胞剖面與滲透模型
 * ========================================================================= */
function mountCellModel(containerEl, meta) {
  const stage = createLabStage(containerEl, meta, {
    bgColor: 0x1c2624,
    cameraPos: [0.4, 3.7, 6.9],
    targetPos: [0, 0.1, 0],
    minDist: 3.4,
    maxDist: 14
  });
  if (stage.error) return createFallbackUI(containerEl, meta, stage.error);

  const { scene, toolbar, readout } = stage;

  // 顯微鏡載玻片標本台底座
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(3.4, 3.65, 0.22, 48),
    new THREE.MeshStandardMaterial({ color: 0x2d3836, roughness: 0.75, metalness: 0.15 })
  );
  plinth.position.y = -1.65;
  plinth.receiveShadow = true;
  scene.add(plinth);

  const glassSlide = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 0.08, 4.1),
    new THREE.MeshPhysicalMaterial({ color: 0xdff0ed, roughness: 0.12, transparent: true, opacity: 0.24, metalness: 0.05 })
  );
  glassSlide.position.y = -1.5;
  scene.add(glassSlide);

  // 工具函式：建構剖面細胞核（含核仁）
  function buildCutawayNucleus(radius, colorOuter, colorInner) {
    const g = new THREE.Group();
    const outerGeo = new THREE.SphereGeometry(radius, 32, 24, 0, Math.PI * 1.5, 0, Math.PI);
    const outerMat = new THREE.MeshStandardMaterial({ color: colorOuter, roughness: 0.55, side: THREE.DoubleSide });
    const outer = new THREE.Mesh(outerGeo, outerMat);
    outer.rotation.y = Math.PI * 0.25;
    outer.castShadow = true;
    g.add(outer);

    // 剖面切口（兩個半圓平片）
    const sliceMat = new THREE.MeshStandardMaterial({ color: colorInner, roughness: 0.65, side: THREE.DoubleSide });
    const halfDiscGeo = new THREE.CircleGeometry(radius * 0.99, 28, -Math.PI / 2, Math.PI);
    const s1 = new THREE.Mesh(halfDiscGeo, sliceMat);
    s1.rotation.y = Math.PI * 0.25;
    g.add(s1);
    const s2 = new THREE.Mesh(halfDiscGeo, sliceMat);
    s2.rotation.y = Math.PI * 0.75;
    g.add(s2);

    // 核仁
    const nucleolus = new THREE.Mesh(
      new THREE.SphereGeometry(radius * 0.36, 20, 16),
      new THREE.MeshStandardMaterial({ color: 0x45224d, roughness: 0.4 })
    );
    nucleolus.position.set(0.06, 0.04, 0.06);
    g.add(nucleolus);

    return g;
  }

  // 工具函式：建構剖面粒線體（含內膜皺褶嵴 cristae）
  function buildMitochondrion() {
    const g = new THREE.Group();
    const outer = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.19, 0.44, 10, 20),
      new THREE.MeshStandardMaterial({ color: 0xd96b38, roughness: 0.5 })
    );
    outer.rotation.z = Math.PI / 2;
    outer.scale.set(1, 1, 0.72);
    g.add(outer);

    // 上切面暴露內膜基質
    const matrix = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.145, 0.38, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0xf4c394, roughness: 0.6 })
    );
    matrix.rotation.z = Math.PI / 2;
    matrix.position.y = 0.075;
    matrix.scale.set(1, 0.55, 0.62);
    g.add(matrix);

    // 蛇行內膜嵴（Cristae）
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const x = -0.22 + t * 0.44;
      const z = (i % 2 === 0 ? 1 : -1) * 0.075;
      pts.push(new THREE.Vector3(x, 0.135, z));
    }
    const cristaCurve = new THREE.CatmullRomCurve3(pts);
    const crista = new THREE.Mesh(
      new THREE.TubeGeometry(cristaCurve, 32, 0.022, 8, false),
      new THREE.MeshStandardMaterial({ color: 0xa63f1c, roughness: 0.45 })
    );
    g.add(crista);
    return g;
  }

  // 工具函式：建構剖面葉綠體（內含堆疊類囊體餅）
  function buildChloroplast() {
    const g = new THREE.Group();
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 22, 16),
      new THREE.MeshStandardMaterial({ color: 0x2f7d3e, roughness: 0.48 })
    );
    shell.scale.set(1.35, 0.58, 0.85);
    g.add(shell);

    const stroma = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.35, 0.05, 20),
      new THREE.MeshStandardMaterial({ color: 0x76b877, roughness: 0.6 })
    );
    stroma.scale.set(1.08, 1, 0.72);
    stroma.position.y = 0.12;
    g.add(stroma);

    // 3 疊類囊體（葉綠餅 Grana）
    const discMat = new THREE.MeshStandardMaterial({ color: 0x1e5c2c, roughness: 0.4 });
    const stackOffsets = [[-0.18, 0], [0.02, 0.05], [0.19, -0.04]];
    for (const [sx, sz] of stackOffsets) {
      for (let d = 0; d < 4; d++) {
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.024, 14), discMat);
        disc.position.set(sx, 0.155 + d * 0.03, sz);
        g.add(disc);
      }
    }
    return g;
  }

  /* ---------- A. 植物細胞群組 ---------- */
  const plantGroup = new THREE.Group();
  scene.add(plantGroup);

  // 六角柱狀纖維素細胞壁（前兩面切開形成開放剖面箱體）
  function makeHexPoints(r) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 + Math.PI / 6;
      pts.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
    }
    return pts;
  }

  // 底部實心六角底座（細胞壁底）
  const hexBaseShape = new THREE.Shape(makeHexPoints(2.22));
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x5d8a5e, roughness: 0.72, metalness: 0.04 });
  const wallBase = new THREE.Mesh(
    new THREE.ExtrudeGeometry(hexBaseShape, { depth: 0.24, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2 }),
    wallMat
  );
  wallBase.rotation.x = -Math.PI / 2;
  wallBase.position.y = -1.35;
  wallBase.castShadow = true;
  wallBase.receiveShadow = true;
  plantGroup.add(wallBase);

  // 後方與左右 4 面立牆（保留前方 2 面為觀測剖面）
  const outerHex = makeHexPoints(2.22);
  const innerHex = makeHexPoints(1.92);
  const wallHeight = 2.15;
  for (let i = 0; i < 6; i++) {
    // 角度在 +Z 前方的兩面（i === 0, i === 1）改為低切緣，其餘 4 面為高牆
    const isFrontCut = (i === 0 || i === 1);
    const h = isFrontCut ? 0.34 : wallHeight;
    const p0 = outerHex[i];
    const p1 = outerHex[(i + 1) % 6];
    const q1 = innerHex[(i + 1) % 6];
    const q0 = innerHex[i];
    const segShape = new THREE.Shape([p0, p1, q1, q0]);
    const segGeo = new THREE.ExtrudeGeometry(segShape, { depth: h, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 2 });
    const segMesh = new THREE.Mesh(segGeo, wallMat);
    segMesh.rotation.x = -Math.PI / 2;
    segMesh.position.y = -1.12;
    segMesh.castShadow = true;
    segMesh.receiveShadow = true;
    plantGroup.add(segMesh);
  }

  // 內部可收縮細胞膜＋原生質體容器（在濃鹽水中物理向內收縮形成「質壁分離」）
  const plantProtoplast = new THREE.Group();
  plantProtoplast.position.y = -0.15;
  plantGroup.add(plantProtoplast);

  // 細胞膜半透明剖面六角囊
  const memOuter = makeHexPoints(1.88);
  const memShape = new THREE.Shape(memOuter);
  const memGeo = new THREE.ExtrudeGeometry(memShape, {
    depth: 1.72,
    bevelEnabled: true,
    bevelThickness: 0.14,
    bevelSize: 0.12,
    bevelSegments: 3
  });
  memGeo.center();
  const plantMemMat = new THREE.MeshPhysicalMaterial({
    color: 0xa8d5a2,
    roughness: 0.32,
    transparent: true,
    opacity: 0.42,
    depthWrite: false
  });
  const plantMembrane = new THREE.Mesh(memGeo, plantMemMat);
  plantMembrane.rotation.x = -Math.PI / 2;
  plantProtoplast.add(plantMembrane);

  // 細胞膜外緣邊框（方便清晰看見質壁分離的空隙！）
  const memRimPts = [];
  for (let i = 0; i <= 6; i++) {
    const p = memOuter[i % 6];
    memRimPts.push(new THREE.Vector3(p.x, 0.85, -p.y));
  }
  const memRim = new THREE.Mesh(
    new THREE.TubeGeometry(new THREE.CatmullRomCurve3(memRimPts, true), 48, 0.045, 8, true),
    new THREE.MeshStandardMaterial({ color: 0xd9f2c9, roughness: 0.35, emissive: 0x2e4a2b, emissiveIntensity: 0.25 })
  );
  plantProtoplast.add(memRim);

  // 大型中央液胞（青綠色半透明水囊，隨溶液張力劇烈伸縮）
  const vacuoleGeo = new THREE.SphereGeometry(0.95, 32, 24);
  const vacuoleMat = new THREE.MeshPhysicalMaterial({
    color: 0x4db8c4,
    roughness: 0.14,
    metalness: 0.02,
    transparent: true,
    opacity: 0.68,
    clearcoat: 0.8
  });
  const plantVacuole = new THREE.Mesh(vacuoleGeo, vacuoleMat);
  plantVacuole.position.set(-0.22, -0.05, -0.1);
  plantVacuole.scale.set(1.18, 0.86, 0.92);
  plantProtoplast.add(plantVacuole);

  // 植物細胞核（被大液胞推向一側）
  const plantNucleus = buildCutawayNucleus(0.46, 0x82548e, 0xc39ecd);
  plantNucleus.position.set(0.95, 0.15, -0.45);
  plantProtoplast.add(plantNucleus);

  // 5 個立體剖面葉綠體
  const chloroCoords = [
    [-1.12, 0.25, 0.55, 0.4],
    [0.45, 0.28, 0.88, -0.6],
    [1.15, -0.35, 0.32, 1.2],
    [-0.95, -0.42, -0.82, 0.9],
    [0.12, 0.38, -1.05, -0.2]
  ];
  for (const [cx, cy, cz, ry] of chloroCoords) {
    const ch = buildChloroplast();
    ch.position.set(cx, cy, cz);
    ch.rotation.y = ry;
    plantProtoplast.add(ch);
  }

  // 3 個立體粒線體
  const plantMitoCoords = [
    [-0.45, -0.45, 0.92, 0.5],
    [0.85, -0.42, -0.88, -0.7],
    [-1.18, 0.05, -0.18, 1.3]
  ];
  for (const [mx, my, mz, ry] of plantMitoCoords) {
    const m = buildMitochondrion();
    m.position.set(mx, my, mz);
    m.rotation.y = ry;
    plantProtoplast.add(m);
  }

  // 植物細胞標籤
  const plantLabels = new THREE.Group();
  const pLbl1 = createLabelSprite('纖維素細胞壁（剛性保護）', { dotColor: '#5D8A5E', scale: 0.0072 });
  pLbl1.position.set(-2.2, 1.35, -0.8);
  const pLbl2 = createLabelSprite('細胞膜（可質壁分離）', { dotColor: '#A8D5A2', scale: 0.0072 });
  pLbl2.position.set(1.9, 1.25, 0.8);
  const pLbl3 = createLabelSprite('大型中央液胞', { dotColor: '#4DB8C4', scale: 0.0072 });
  pLbl3.position.set(-0.6, 1.12, 0.2);
  const pLbl4 = createLabelSprite('葉綠體（類囊體）', { dotColor: '#2F7D3E', scale: 0.007 });
  pLbl4.position.set(-1.75, -0.25, 1.35);
  const pLbl5 = createLabelSprite('細胞核與核仁', { dotColor: '#82548E', scale: 0.007 });
  pLbl5.position.set(1.65, 0.65, -0.95);
  const pLbl6 = createLabelSprite('粒線體（內膜嵴）', { dotColor: '#D96B38', scale: 0.007 });
  pLbl6.position.set(0.35, -0.95, 1.55);
  plantLabels.add(pLbl1, pLbl2, pLbl3, pLbl4, pLbl5, pLbl6);
  plantGroup.add(plantLabels);

  /* ---------- B. 動物細胞群組（無細胞壁、具高基氏體與脹破／萎縮反應） ---------- */
  const animalGroup = new THREE.Group();
  animalGroup.visible = false;
  scene.add(animalGroup);

  const animalBody = new THREE.Group();
  animalBody.position.y = -0.05;
  animalGroup.add(animalBody);

  // 動物細胞柔性剖面外膜（保存原始頂點供濃鹽水皺縮 crenation 變形）
  const animalShellGeo = new THREE.SphereGeometry(1.75, 40, 28, 0, Math.PI * 1.5, 0, Math.PI);
  const animalBasePos = animalShellGeo.attributes.position.array.slice();
  const animalShellMat = new THREE.MeshPhysicalMaterial({
    color: 0xe09687,
    roughness: 0.36,
    metalness: 0.02,
    transparent: true,
    opacity: 0.62,
    side: THREE.DoubleSide
  });
  const animalShell = new THREE.Mesh(animalShellGeo, animalShellMat);
  animalShell.rotation.y = Math.PI * 0.25;
  animalShell.scale.set(1.08, 0.84, 1.04);
  animalBody.add(animalShell);

  // 細胞質半透明內層切面
  const cytoMat = new THREE.MeshStandardMaterial({ color: 0xf4cfc4, roughness: 0.7, transparent: true, opacity: 0.45, side: THREE.DoubleSide });
  const cytoSlice1 = new THREE.Mesh(new THREE.CircleGeometry(1.72, 32, -Math.PI / 2, Math.PI), cytoMat);
  cytoSlice1.rotation.y = Math.PI * 0.25;
  cytoSlice1.scale.set(1.06, 0.82, 1.02);
  animalBody.add(cytoSlice1);
  const cytoSlice2 = new THREE.Mesh(new THREE.CircleGeometry(1.72, 32, -Math.PI / 2, Math.PI), cytoMat);
  cytoSlice2.rotation.y = Math.PI * 0.75;
  cytoSlice2.scale.set(1.06, 0.82, 1.02);
  animalBody.add(cytoSlice2);

  // 動物中央細胞核
  const animalNucleus = buildCutawayNucleus(0.56, 0x7b4c8d, 0xc7a3d4);
  animalNucleus.position.set(0, 0.08, -0.08);
  animalBody.add(animalNucleus);

  // 4 個粒線體
  const aMitoCoords = [
    [-0.95, -0.15, 0.45, 0.5],
    [0.88, -0.22, 0.55, -0.8],
    [0.72, 0.35, -0.68, 1.1],
    [-0.78, 0.32, -0.62, -0.3]
  ];
  for (const [mx, my, mz, ry] of aMitoCoords) {
    const m = buildMitochondrion();
    m.position.set(mx, my, mz);
    m.rotation.y = ry;
    animalBody.add(m);
  }

  // 高基氏體（層疊彎月囊泡）
  const golgiGroup = new THREE.Group();
  golgiGroup.position.set(-0.22, -0.58, 0.82);
  const golgiMat = new THREE.MeshStandardMaterial({ color: 0xd99b38, roughness: 0.45 });
  for (let i = 0; i < 4; i++) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.34 + i * 0.03, i * 0.09, -0.08),
      new THREE.Vector3(0, i * 0.09 + 0.04, 0.06 + i * 0.02),
      new THREE.Vector3(0.34 - i * 0.03, i * 0.09, -0.08)
    ]);
    const sac = new THREE.Mesh(new THREE.TubeGeometry(curve, 18, 0.034, 8, false), golgiMat);
    golgiGroup.add(sac);
  }
  for (let v = 0; v < 4; v++) {
    const ves = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 10), golgiMat);
    ves.position.set(-0.36 + v * 0.24, 0.36 + (v % 2) * 0.07, 0.08);
    golgiGroup.add(ves);
  }
  animalBody.add(golgiGroup);

  // 漲破危機警示裂紋環（僅動物細胞＋清水時顯示）
  const lysisRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.08, 0.045, 12, 48),
    new THREE.MeshBasicMaterial({ color: 0xe64833, transparent: true, opacity: 0.85 })
  );
  lysisRing.rotation.x = Math.PI / 2;
  lysisRing.visible = false;
  animalGroup.add(lysisRing);

  const lysisLabel = createLabelSprite('⚠ 漲破危機！無細胞壁保護', { bg: '#FFF1EE', border: '#C9382B', color: '#B3251B', scale: 0.008 });
  lysisLabel.position.set(0, 1.88, 0);
  lysisLabel.visible = false;
  animalGroup.add(lysisLabel);

  const aLbl1 = createLabelSprite('柔性細胞膜（無細胞壁）', { dotColor: '#E09687', scale: 0.0072 });
  aLbl1.position.set(-2.05, 1.15, 0.4);
  const aLbl2 = createLabelSprite('高基氏體與分泌囊泡', { dotColor: '#D99B38', scale: 0.007 });
  aLbl2.position.set(-0.4, -1.08, 1.55);
  const aLbl3 = createLabelSprite('細胞核與核仁', { dotColor: '#7B4C8D', scale: 0.007 });
  aLbl3.position.set(1.35, 1.18, -0.35);
  const aLbl4 = createLabelSprite('粒線體', { dotColor: '#D96B38', scale: 0.007 });
  aLbl4.position.set(1.82, -0.22, 0.95);
  animalGroup.add(aLbl1, aLbl2, aLbl3, aLbl4);

  /* ---------- C. 滲透水分子流向粒子 ---------- */
  const waterParticles = [];
  const waterGeo = new THREE.SphereGeometry(0.058, 10, 8);
  const waterMat = new THREE.MeshStandardMaterial({ color: 0x5cc9e6, emissive: 0x1d6880, emissiveIntensity: 0.4, roughness: 0.2 });
  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2;
    const elev = ((i % 3) - 1) * 0.6;
    const mesh = new THREE.Mesh(waterGeo, waterMat);
    scene.add(mesh);
    waterParticles.push({ mesh, angle, elev, phase: (i * 0.17) % 1 });
  }

  /* ---------- 狀態與控制列 ---------- */
  const state = {
    cellType: 'plant', // 'plant' | 'animal'
    solution: 'iso'    // 'hypo' | 'iso' | 'hyper'
  };

  let curProtoScale = 0.94;
  let curVacScale = 0.92;
  let curAnimalScale = 1.0;
  let curCrenation = 0.0;

  function updateReadout() {
    plantGroup.visible = state.cellType === 'plant';
    animalGroup.visible = state.cellType === 'animal';
    const isLysis = state.cellType === 'animal' && state.solution === 'hypo';
    lysisRing.visible = isLysis;
    lysisLabel.visible = isLysis;

    const solName = {
      hypo: '清水（低張溶液：外界水勢高、溶質濃度低）',
      iso: '生理食鹽水（等張溶液：內外濃度平衡）',
      hyper: '濃鹽水（高張溶液：外界鹽分高、水勢低）'
    }[state.solution];

    let explain = '';
    if (state.cellType === 'plant') {
      if (state.solution === 'hypo') {
        explain = '<strong>水分子淨流向：細胞外 ➔ 細胞內。</strong>大液胞大量吸水膨脹，將細胞膜緊緊頂在剛性的「纖維素細胞壁」內側，形成飽滿膨壓，<strong>因細胞壁支撐而不會漲破</strong>！';
      } else if (state.solution === 'iso') {
        explain = '<strong>水分子進出速率相等（動態平衡）。</strong>植物細胞膜自然貼合於細胞壁內側，大液胞維持正常體積與細胞型態。';
      } else {
        explain = '<strong>水分子淨流向：細胞內 ➔ 細胞外。</strong>大液胞急劇失水縮小，柔性細胞膜向內拉扯並與堅硬的六角細胞壁分開，形成經典的<strong>「質壁分離（Plasmolysis）」</strong>！';
      }
    } else {
      if (state.solution === 'hypo') {
        explain = '<strong>⚠ 漲破危機！水分子淨流向：細胞外 ➔ 細胞內。</strong>動物細胞（如紅血球）<strong>沒有纖維素細胞壁</strong>，持續吸水膨脹將導致細胞膜承受過度張力而破裂（溶血／漲破）！';
      } else if (state.solution === 'iso') {
        explain = '<strong>水分子進出速率平衡。</strong>醫療靜脈注射使用 0.9% 生理食鹽水，正是為了維持與動物細胞等張，避免紅血球漲破或萎縮。';
      } else {
        explain = '<strong>水分子淨流向：細胞內 ➔ 細胞外。</strong>動物細胞大量失水，柔性細胞膜向內塌陷並產生鋸齒狀<strong>萎縮皺摺（Crenation）</strong>。';
      }
    }

    readout.innerHTML =
      '<div><strong>目前檢體：</strong>' + (state.cellType === 'plant' ? '🌿 植物細胞（具纖維素細胞壁、大液胞、葉綠體）' : '🧬 動物細胞（無細胞壁、具高基氏體與粒線體）') +
      ' ｜ <strong>浸泡溶液：</strong>' + solName + '</div>' +
      '<div style="margin-top:4px;">' + explain + '</div>';
  }

  const gCell = addToolbarGroup(toolbar, '細胞種類：');
  makeToggleButtons(gCell, [
    { key: 'plant', label: '🌿 植物細胞' },
    { key: 'animal', label: '🧬 動物細胞' }
  ], state.cellType, (k) => { state.cellType = k; updateReadout(); });

  const gSol = addToolbarGroup(toolbar, '外界溶液：');
  makeToggleButtons(gSol, [
    { key: 'hypo', label: '💧 清水 (低張)' },
    { key: 'iso', label: '⚖ 生理食鹽水 (等張)' },
    { key: 'hyper', label: '🧂 濃鹽水 (高張)' }
  ], state.solution, (k) => { state.solution = k; updateReadout(); });

  updateReadout();

  stage.start((dt, elapsed) => {
    const tgtProto = state.solution === 'hypo' ? 1.0 : state.solution === 'iso' ? 0.94 : 0.69;
    const tgtVac = state.solution === 'hypo' ? 1.18 : state.solution === 'iso' ? 0.90 : 0.42;
    const tgtAnimal = state.solution === 'hypo' ? 1.24 : state.solution === 'iso' ? 1.0 : 0.74;
    const tgtCren = (state.cellType === 'animal' && state.solution === 'hyper') ? 1.0 : 0.0;

    const k = Math.min(1, dt * 5);
    curProtoScale += (tgtProto - curProtoScale) * k;
    curVacScale += (tgtVac - curVacScale) * k;
    curAnimalScale += (tgtAnimal - curAnimalScale) * k;
    curCrenation += (tgtCren - curCrenation) * k;

    plantProtoplast.scale.set(curProtoScale, 0.78 + curProtoScale * 0.22, curProtoScale);
    plantVacuole.scale.set(1.15 * curVacScale, 0.85 * curVacScale, 0.9 * curVacScale);

    // 動物細胞脹大脈動或皺縮變形
    const swellPulse = (state.cellType === 'animal' && state.solution === 'hypo') ? Math.sin(elapsed * 7) * 0.035 : 0;
    animalBody.scale.setScalar(curAnimalScale + swellPulse);
    if (lysisRing.visible) {
      const s = 1 + Math.sin(elapsed * 6) * 0.06;
      lysisRing.scale.set(s, s, 1);
    }

    // 皺縮鋸齒頂點變形
    if (state.cellType === 'animal') {
      const posAttr = animalShellGeo.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        const bx = animalBasePos[i * 3];
        const by = animalBasePos[i * 3 + 1];
        const bz = animalBasePos[i * 3 + 2];
        const wrinkle = 1 + curCrenation * 0.14 * Math.sin(bx * 6.5) * Math.cos(by * 6.5) * Math.sin(bz * 6.5);
        posAttr.setXYZ(i, bx * wrinkle, by * wrinkle, bz * wrinkle);
      }
      posAttr.needsUpdate = true;
    }

    // 水分子滲透動畫
    for (let i = 0; i < waterParticles.length; i++) {
      const p = waterParticles[i];
      if (state.solution === 'hypo') {
        p.phase = (p.phase + dt * 0.55) % 1;
        const r = 3.1 - p.phase * 1.65;
        p.mesh.position.set(Math.cos(p.angle) * r, p.elev, Math.sin(p.angle) * r);
      } else if (state.solution === 'hyper') {
        p.phase = (p.phase + dt * 0.65) % 1;
        const r = 1.45 + p.phase * 1.75;
        p.mesh.position.set(Math.cos(p.angle) * r, p.elev, Math.sin(p.angle) * r);
      } else {
        const r = 2.35 + Math.sin(elapsed * 2.2 + i) * 0.35;
        p.mesh.position.set(Math.cos(p.angle) * r, p.elev, Math.sin(p.angle) * r);
      }
    }
  });

  return stage.cleanup;
}

/* =========================================================================
 * 模型 2：SCI_7_1_3 — 3D 心臟四腔室與體／肺循環立體管路
 * ========================================================================= */
function mountHeartModel(containerEl, meta) {
  const stage = createLabStage(containerEl, meta, {
    bgColor: 0x1b2128,
    cameraPos: [0, 1.3, 8.6],
    targetPos: [0, 0.15, 0],
    minDist: 4.0,
    maxDist: 16.0
  });
  if (stage.error) return createFallbackUI(containerEl, meta, stage.error);

  const { scene, toolbar, readout } = stage;

  const heartRoot = new THREE.Group();
  scene.add(heartRoot);

  // 材質群（分開體循環與肺循環，方便高亮時調整透明度與自發光）
  const matVenousWall = new THREE.MeshStandardMaterial({ color: 0x3b6fa0, roughness: 0.46, transparent: true, opacity: 1 });
  const matVenousInner = new THREE.MeshStandardMaterial({ color: 0x24486b, roughness: 0.62, side: THREE.DoubleSide, transparent: true, opacity: 1 });
  const matArterialWall = new THREE.MeshStandardMaterial({ color: 0xb23a3a, roughness: 0.44, transparent: true, opacity: 1 });
  const matArterialInner = new THREE.MeshStandardMaterial({ color: 0x7c1f23, roughness: 0.6, side: THREE.DoubleSide, transparent: true, opacity: 1 });
  const matSeptum = new THREE.MeshStandardMaterial({ color: 0x8f343c, roughness: 0.54 });
  const matValve = new THREE.MeshStandardMaterial({ color: 0xefe5d1, roughness: 0.4, side: THREE.DoubleSide });

  const matAorta = new THREE.MeshStandardMaterial({ color: 0xc93535, roughness: 0.38, transparent: true, opacity: 1 });
  const matVenaCava = new THREE.MeshStandardMaterial({ color: 0x315f8f, roughness: 0.42, transparent: true, opacity: 1 });
  const matPulmArt = new THREE.MeshStandardMaterial({ color: 0x3d74ab, roughness: 0.4, transparent: true, opacity: 1 });
  const matPulmVein = new THREE.MeshStandardMaterial({ color: 0xc94242, roughness: 0.4, transparent: true, opacity: 1 });

  // 建立單一剖面腔室（後方碗狀肌肉壁 + 明顯可辨的壁厚截面環）
  function buildChamber(rx, ry, rz, wallThick, outerMat, innerMat) {
    const g = new THREE.Group();
    // 外肌肉殼（後半球）
    const outer = new THREE.Mesh(
      new THREE.SphereGeometry(1, 28, 20, Math.PI, Math.PI, 0, Math.PI),
      outerMat
    );
    outer.scale.set(rx, ry, rz);
    g.add(outer);

    // 內腔（較小後半球）
    const inner = new THREE.Mesh(
      new THREE.SphereGeometry(1, 24, 18, Math.PI, Math.PI, 0, Math.PI),
      innerMat
    );
    inner.scale.set(Math.max(0.2, rx - wallThick), Math.max(0.2, ry - wallThick), Math.max(0.2, rz - wallThick));
    g.add(inner);

    // 前剖面壁厚環（直觀展示左心室肌肉壁遠厚於右心室！）
    const ringShape = new THREE.Shape();
    ringShape.absellipse(0, 0, rx, ry, 0, Math.PI * 2, false, 0);
    const hole = new THREE.Path();
    hole.absellipse(0, 0, Math.max(0.18, rx - wallThick), Math.max(0.18, ry - wallThick), 0, Math.PI * 2, true, 0);
    ringShape.holes.push(hole);
    const rim = new THREE.Mesh(
      new THREE.ExtrudeGeometry(ringShape, { depth: 0.08, bevelEnabled: false }),
      outerMat
    );
    rim.position.z = -0.04;
    g.add(rim);
    return g;
  }

  // 解剖前視方向：觀察者左側 (x < 0) 為心臟右半部（缺氧血），觀察者右側 (x > 0) 為心臟左半部（充氧血）
  const atriaGroup = new THREE.Group();
  const ventGroup = new THREE.Group();
  heartRoot.add(atriaGroup, ventGroup);

  // 右心房 (RA, 左上)
  const rightAtrium = buildChamber(0.76, 0.66, 0.72, 0.12, matVenousWall, matVenousInner);
  rightAtrium.position.set(-0.82, 0.62, 0);
  atriaGroup.add(rightAtrium);

  // 左心房 (LA, 右上)
  const leftAtrium = buildChamber(0.74, 0.64, 0.72, 0.13, matArterialWall, matArterialInner);
  leftAtrium.position.set(0.82, 0.64, 0);
  atriaGroup.add(leftAtrium);

  // 右心室 (RV, 左下，較薄肌壁 0.15)
  const rightVentricle = buildChamber(0.86, 1.05, 0.84, 0.15, matVenousWall, matVenousInner);
  rightVentricle.position.set(-0.68, -0.78, 0.04);
  rightVentricle.rotation.z = 0.16;
  ventGroup.add(rightVentricle);

  // 左心室 (LV, 右下，明顯極厚實肌壁 0.36！心尖微向右下方偏)
  const leftVentricle = buildChamber(0.96, 1.18, 0.92, 0.36, matArterialWall, matArterialInner);
  leftVentricle.position.set(0.68, -0.84, 0.04);
  leftVentricle.rotation.z = -0.14;
  ventGroup.add(leftVentricle);

  // 心室中膈（清楚隔絕左右心充氧／缺氧血）
  const septum = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 2.38, 1.15),
    matSeptum
  );
  septum.position.set(0.0, -0.22, -0.35);
  septum.rotation.z = 0.04;
  heartRoot.add(septum);

  // 房室瓣膜（三尖瓣與二尖瓣）
  const valveLeft = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.24, 3, 1, true), matValve);
  valveLeft.position.set(-0.74, 0.02, -0.18);
  valveLeft.rotation.x = Math.PI;
  heartRoot.add(valveLeft);

  const valveRight = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.24, 3, 1, true), matValve);
  valveRight.position.set(0.74, 0.02, -0.18);
  valveRight.rotation.x = Math.PI;
  heartRoot.add(valveRight);

  // ---------- 立體主要大血管（TubeGeometry） ----------
  // 1. 主動脈弓（由左心室出發，向上拱起並分出三條頭臂支脈，向下延伸至降主動脈）
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.45, -0.35, -0.15),
    new THREE.Vector3(0.18, 1.05, -0.15),
    new THREE.Vector3(0.32, 2.02, -0.18),
    new THREE.Vector3(1.18, 2.06, -0.38),
    new THREE.Vector3(1.52, 1.25, -0.68),
    new THREE.Vector3(1.38, -1.95, -0.78)
  ]);
  const aortaMesh = new THREE.Mesh(new THREE.TubeGeometry(aortaCurve, 56, 0.22, 16, false), matAorta);
  heartRoot.add(aortaMesh);

  // 主動脈弓上方三分支
  for (let b = 0; b < 3; b++) {
    const bx = 0.36 + b * 0.32;
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.62, 12), matAorta);
    br.position.set(bx, 2.38, -0.22 - b * 0.06);
    heartRoot.add(br);
  }

  // 2. 肺動脈幹與左右分岔（由右心室出發，呈缺氧藍色！證明動脈不一定載充氧血）
  const pulmMainCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.32, -0.35, 0.15),
    new THREE.Vector3(-0.18, 0.92, 0.28),
    new THREE.Vector3(-0.08, 1.48, 0.12)
  ]);
  heartRoot.add(new THREE.Mesh(new THREE.TubeGeometry(pulmMainCurve, 28, 0.19, 14, false), matPulmArt));

  const pulmLeftBranch = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.08, 1.48, 0.12),
    new THREE.Vector3(-1.15, 1.56, -0.05),
    new THREE.Vector3(-2.35, 1.38, -0.15)
  ]);
  heartRoot.add(new THREE.Mesh(new THREE.TubeGeometry(pulmLeftBranch, 24, 0.145, 12, false), matPulmArt));

  const pulmRightBranch = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.08, 1.48, 0.12),
    new THREE.Vector3(1.05, 1.46, -0.04),
    new THREE.Vector3(2.35, 1.28, -0.12)
  ]);
  heartRoot.add(new THREE.Mesh(new THREE.TubeGeometry(pulmRightBranch, 24, 0.145, 12, false), matPulmArt));

  // 3. 上、下大靜脈（進入右心房，缺氧藍）
  const svcCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.32, 2.35, -0.25),
    new THREE.Vector3(-1.26, 1.45, -0.22),
    new THREE.Vector3(-1.05, 0.82, -0.18)
  ]);
  heartRoot.add(new THREE.Mesh(new THREE.TubeGeometry(svcCurve, 24, 0.19, 14, false), matVenaCava));

  const ivcCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.28, -2.15, -0.45),
    new THREE.Vector3(-1.22, -0.85, -0.45),
    new THREE.Vector3(-1.02, 0.32, -0.32)
  ]);
  heartRoot.add(new THREE.Mesh(new THREE.TubeGeometry(ivcCurve, 24, 0.2, 14, false), matVenaCava));

  // 4. 肺靜脈（充氧紅，由肺部回流左心房）
  const pvCurve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.35, 0.92, -0.15),
    new THREE.Vector3(1.62, 0.78, -0.18),
    new THREE.Vector3(1.12, 0.68, -0.18)
  ]);
  const pvCurve2 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(2.25, 0.42, -0.22),
    new THREE.Vector3(1.58, 0.45, -0.22),
    new THREE.Vector3(1.12, 0.54, -0.22)
  ]);
  heartRoot.add(new THREE.Mesh(new THREE.TubeGeometry(pvCurve1, 20, 0.12, 12, false), matPulmVein));
  heartRoot.add(new THREE.Mesh(new THREE.TubeGeometry(pvCurve2, 20, 0.12, 12, false), matPulmVein));

  // 肺部與全身組織微縮循環環（視覺化完整雙循環回流）
  const lungLoopCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.62, -0.78, 0.1),
    new THREE.Vector3(-0.18, 0.92, 0.28),
    new THREE.Vector3(-0.08, 1.48, 0.12),
    new THREE.Vector3(1.35, 1.44, -0.06),
    new THREE.Vector3(2.55, 1.15, -0.12),
    new THREE.Vector3(2.48, 0.75, -0.16),
    new THREE.Vector3(1.42, 0.72, -0.18),
    new THREE.Vector3(0.82, 0.64, -0.1)
  ]);

  const systemicLoopCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.72, -0.85, -0.05),
    new THREE.Vector3(0.28, 1.05, -0.15),
    new THREE.Vector3(0.55, 2.02, -0.22),
    new THREE.Vector3(1.45, 1.42, -0.62),
    new THREE.Vector3(1.42, -1.95, -0.72),
    new THREE.Vector3(0.05, -2.55, -0.65),
    new THREE.Vector3(-1.26, -2.05, -0.45),
    new THREE.Vector3(-1.18, -0.55, -0.42),
    new THREE.Vector3(-0.88, 0.62, -0.15)
  ]);

  // 淡色微血管交換區環（肺部在右側上方、全身組織在下方）
  const lungBed = new THREE.Mesh(
    new THREE.TorusGeometry(0.42, 0.04, 10, 28),
    new THREE.MeshStandardMaterial({ color: 0xd77d88, roughness: 0.5, transparent: true, opacity: 0.72 })
  );
  lungBed.position.set(2.58, 1.02, -0.14);
  lungBed.rotation.y = Math.PI / 2.2;
  heartRoot.add(lungBed);

  const bodyBed = new THREE.Mesh(
    new THREE.TorusGeometry(0.56, 0.04, 10, 32),
    new THREE.MeshStandardMaterial({ color: 0x8f7a66, roughness: 0.55, transparent: true, opacity: 0.72 })
  );
  bodyBed.position.set(0.08, -2.42, -0.62);
  bodyBed.rotation.x = Math.PI / 2.4;
  heartRoot.add(bodyBed);

  // 動畫血球粒子（體循環 18 顆 + 肺循環 14 顆）
  const cellGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.04, 12);
  const systemicCells = [];
  for (let i = 0; i < 18; i++) {
    const mat = new THREE.MeshStandardMaterial({ color: 0xe83b3b, emissive: 0x5c0e0e, emissiveIntensity: 0.35, roughness: 0.3 });
    const m = new THREE.Mesh(cellGeo, mat);
    heartRoot.add(m);
    systemicCells.push({ mesh: m, mat, t: i / 18 });
  }
  const pulmCells = [];
  for (let i = 0; i < 14; i++) {
    const mat = new THREE.MeshStandardMaterial({ color: 0x3b86d6, emissive: 0x10355e, emissiveIntensity: 0.35, roughness: 0.3 });
    const m = new THREE.Mesh(cellGeo, mat);
    heartRoot.add(m);
    pulmCells.push({ mesh: m, mat, t: i / 14 });
  }

  // 3D 標註標籤
  const labels = [
    ['右心房 (缺氧)', [-1.85, 0.75, 0.55], '#3B6FA0'],
    ['右心室 (薄壁)', [-1.95, -0.85, 0.55], '#2F5E8E'],
    ['左心房 (充氧)', [1.85, 0.75, 0.55], '#B93B3B'],
    ['左心室 (最厚肌壁!)', [2.05, -1.05, 0.55], '#9E2B2B'],
    ['主動脈弓 (充氧紅)', [0.65, 2.75, 0.0], '#C93535'],
    ['肺動脈 (缺氧藍!)', [-1.68, 1.98, 0.35], '#3D74AB'],
    ['肺靜脈 (充氧紅!)', [2.65, 0.32, 0.25], '#C94242'],
    ['上下大靜脈', [-2.25, -1.75, -0.1], '#315F8F'],
    ['肺部氣體交換', [2.85, 1.48, 0.1], '#D77D88'],
    ['全身微血管', [0.1, -2.85, -0.2], '#8F7A66']
  ];
  for (const [text, pos, dot] of labels) {
    const sp = createLabelSprite(text, { dotColor: dot, scale: 0.0068 });
    sp.position.set(pos[0], pos[1], pos[2]);
    heartRoot.add(sp);
  }

  const state = {
    mode: 'full', // 'full' | 'systemic' | 'pulmonary'
    beat: true
  };

  function applyHighlight() {
    const sysOp = state.mode === 'pulmonary' ? 0.22 : 1.0;
    const pulOp = state.mode === 'systemic' ? 0.22 : 1.0;

    matAorta.opacity = sysOp;
    matVenaCava.opacity = sysOp;
    matArterialWall.opacity = state.mode === 'pulmonary' ? 0.45 : 1.0;
    matArterialInner.opacity = state.mode === 'pulmonary' ? 0.45 : 1.0;
    bodyBed.material.opacity = state.mode === 'pulmonary' ? 0.15 : 0.78;

    matPulmArt.opacity = pulOp;
    matPulmVein.opacity = pulOp;
    matVenousWall.opacity = state.mode === 'systemic' ? 0.45 : 1.0;
    matVenousInner.opacity = state.mode === 'systemic' ? 0.45 : 1.0;
    lungBed.material.opacity = state.mode === 'systemic' ? 0.15 : 0.78;

    for (const c of systemicCells) c.mesh.visible = state.mode !== 'pulmonary';
    for (const c of pulmCells) c.mesh.visible = state.mode !== 'systemic';

    if (state.mode === 'full') {
      readout.innerHTML =
        '<strong>完整四腔室與雙循環總覽：</strong>面對標本時採解剖前視（<strong>左螢幕為右心、右螢幕為左心</strong>）。' +
        '注意觀察<strong>左心室肌肉壁厚度約為右心室的 3 倍</strong>，因為左心室必須將充氧血強力壓送至全身；心室中膈則完全隔開充氧與缺氧血。';
    } else if (state.mode === 'systemic') {
      readout.innerHTML =
        '<strong>🔴 體循環路徑高亮：左心室 ➔ 主動脈弓 ➔ 全身微血管（釋出 O₂、帶走 CO₂）➔ 上下大靜脈 ➔ 右心房。</strong>' +
        '體循環距離最長、阻力最大，因此起點「左心室」具有四腔室中最發達的心肌壁。';
    } else {
      readout.innerHTML =
        '<strong>🔵 肺循環路徑高亮：右心室 ➔ 肺動脈（藍・缺氧血！）➔ 肺部微血管（排出 CO₂、吸收 O₂）➔ 肺靜脈（紅・充氧血！）➔ 左心房。</strong>' +
        '會考常考迷思破解：「動脈」定義是<strong>離開心臟</strong>，所以<strong>肺動脈流的是缺氧血</strong>，肺靜脈流的反而是充氧血！';
    }
  }

  const gMode = addToolbarGroup(toolbar, '觀察模式：');
  makeToggleButtons(gMode, [
    { key: 'full', label: '❤ 完整立體心臟' },
    { key: 'systemic', label: '🔴 體循環高亮 (左心室→全身→右心房)' },
    { key: 'pulmonary', label: '🔵 肺循環高亮 (右心室→肺→左心房)' }
  ], state.mode, (k) => { state.mode = k; applyHighlight(); });

  const gBeat = addToolbarGroup(toolbar, '動態：');
  const beatBtn = document.createElement('button');
  beatBtn.type = 'button';
  beatBtn.className = 'btn-light active';
  beatBtn.textContent = '💓 心跳脈動：開啟';
  beatBtn.addEventListener('click', () => {
    state.beat = !state.beat;
    beatBtn.classList.toggle('active', state.beat);
    beatBtn.textContent = state.beat ? '💓 心跳脈動：開啟' : '⏸ 心跳脈動：暫停';
  });
  gBeat.appendChild(beatBtn);

  applyHighlight();

  const colorRed = new THREE.Color(0xe83b3b);
  const colorBlue = new THREE.Color(0x3a84d6);

  stage.start((dt, elapsed) => {
    if (state.beat) {
      // 模擬心房先縮、心室後縮的心動週期（約 72 bpm）
      const phase = (elapsed * 1.2) % 1;
      const atrialPulse = phase < 0.25 ? Math.sin((phase / 0.25) * Math.PI) * 0.055 : 0;
      const ventPulse = (phase >= 0.22 && phase < 0.58) ? Math.sin(((phase - 0.22) / 0.36) * Math.PI) * 0.075 : 0;
      atriaGroup.scale.setScalar(1 - atrialPulse);
      ventGroup.scale.set(1 - ventPulse, 1 - ventPulse * 0.65, 1 - ventPulse);
      const valveAngle = phase < 0.25 ? 0.22 : -0.1;
      valveLeft.rotation.z = valveAngle;
      valveRight.rotation.z = -valveAngle;
    }

    const speed = state.beat ? 0.22 : 0.08;
    for (const c of systemicCells) {
      c.t = (c.t + dt * speed) % 1;
      const pt = systemicLoopCurve.getPointAt(c.t);
      c.mesh.position.copy(pt);
      // 經過下方全身微血管區（t ~ 0.52..0.64）時由紅轉藍
      const mix = THREE.MathUtils.smoothstep(c.t, 0.50, 0.62);
      c.mat.color.copy(colorRed).lerp(colorBlue, mix);
    }

    for (const c of pulmCells) {
      c.t = (c.t + dt * speed * 1.15) % 1;
      const pt = lungLoopCurve.getPointAt(c.t);
      c.mesh.position.copy(pt);
      // 在肺動脈段為藍，經過肺部微血管（t ~ 0.56..0.70）後轉為充氧紅！
      const mix = THREE.MathUtils.smoothstep(c.t, 0.54, 0.68);
      c.mat.color.copy(colorBlue).lerp(colorRed, mix);
    }
  });

  return stage.cleanup;
}

/* =========================================================================
 * 模型 3：SCI_8_2_2 — 3D 凸透鏡光具座與真實折射光束實驗台
 * ========================================================================= */
function mountLensModel(containerEl, meta) {
  const stage = createLabStage(containerEl, meta, {
    bgColor: 0x1a2028,
    cameraPos: [0.4, 2.75, 10.6],
    targetPos: [0, 0.45, 0],
    fov: 38,
    minDist: 4.5,
    maxDist: 20
  });
  if (stage.error) return createFallbackUI(containerEl, meta, stage.error);

  const { scene, toolbar, readout } = stage;
  const F = 2.1; // 焦距（世界單位）
  const AXIS_Y = 0.72; // 主光軸高度
  const CANDLE_H = 1.05; // 物體（燭火頂端相對主光軸）高度

  // 1. 精密鋁合金與岩灰光具座軌道
  const benchBase = new THREE.Mesh(
    new THREE.BoxGeometry(15.2, 0.34, 1.45),
    new THREE.MeshStandardMaterial({ color: 0x303840, roughness: 0.62, metalness: 0.35 })
  );
  benchBase.position.y = -1.15;
  benchBase.receiveShadow = true;
  scene.add(benchBase);

  // 雙拉絲鋁滑軌圓桿
  const railMat = new THREE.MeshStandardMaterial({ color: 0xbac3cb, roughness: 0.28, metalness: 0.8 });
  for (const rz of [-0.42, 0.42]) {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 14.8, 16), railMat);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0, -0.92, rz);
    scene.add(rail);
  }

  // 光具座刻度尺面板（CanvasTexture 畫上 2F, F, O, F', 2F' 刻度）
  const rulerCanvas = document.createElement('canvas');
  rulerCanvas.width = 1200;
  rulerCanvas.height = 128;
  const rctx = rulerCanvas.getContext('2d');
  rctx.fillStyle = '#EFECE2';
  rctx.fillRect(0, 0, 1200, 128);
  rctx.strokeStyle = '#2B333A';
  rctx.fillStyle = '#1E252B';
  rctx.lineWidth = 2;
  for (let i = -35; i <= 35; i++) {
    const x = 600 + (i / 35) * 560;
    const isMajor = i % 5 === 0;
    rctx.beginPath();
    rctx.moveTo(x, 0);
    rctx.lineTo(x, isMajor ? 46 : 24);
    rctx.stroke();
  }
  rctx.font = '700 32px "JetBrains Mono", monospace';
  rctx.textAlign = 'center';
  const marks = [
    [-2 * F, '2F'],
    [-F, 'F'],
    [0, 'O'],
    [F, "F'"],
    [2 * F, "2F'"]
  ];
  for (const [mx, txt] of marks) {
    const px = 600 + (mx / 7.4) * 560;
    rctx.fillStyle = mx === 0 ? '#B24234' : '#1E252B';
    rctx.fillText(txt, px, 96);
  }
  const rulerTex = new THREE.CanvasTexture(rulerCanvas);
  rulerTex.colorSpace = THREE.SRGBColorSpace;
  const rulerPlate = new THREE.Mesh(
    new THREE.PlaneGeometry(14.8, 0.52),
    new THREE.MeshStandardMaterial({ map: rulerTex, roughness: 0.7 })
  );
  rulerPlate.rotation.x = -Math.PI / 2;
  rulerPlate.position.set(0, -0.97, 0);
  scene.add(rulerPlate);

  // 焦點黃銅立標針
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xc99c4c, roughness: 0.28, metalness: 0.82 });
  for (const [mx, txt] of [[-2 * F, '2F'], [-F, 'F'], [F, "F'"], [2 * F, "2F'"]]) {
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.36, 10), brassMat);
    pin.position.set(mx, -0.78, 0.56);
    scene.add(pin);
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), brassMat);
    bead.position.set(mx, -0.58, 0.56);
    scene.add(bead);
    const lbl = createLabelSprite(txt, { scale: 0.0068 });
    lbl.position.set(mx, -1.52, 0.65);
    scene.add(lbl);
  }

  // 主光軸參考線
  const axisLine = new THREE.Mesh(
    new THREE.CylinderGeometry(0.012, 0.012, 14.6, 8),
    new THREE.MeshBasicMaterial({ color: 0x8ea3b5, transparent: true, opacity: 0.45 })
  );
  axisLine.rotation.z = Math.PI / 2;
  axisLine.position.y = AXIS_Y;
  scene.add(axisLine);

  // 2. 真實雙凸透鏡（LatheGeometry 球面弧剖面 + 物理光學玻璃材質 + 黃銅鏡框）
  const lensGroup = new THREE.Group();
  lensGroup.position.set(0, AXIS_Y, 0);
  scene.add(lensGroup);

  const lensRadius = 1.48;
  const lensHalfThick = 0.24;
  const lathePts = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 (bottom apex) -> 1 (top apex)
    const theta = (t - 0.5) * Math.PI; // -pi/2 .. +pi/2
    const r = Math.cos(theta) * lensRadius;
    const y = Math.sin(theta) * lensHalfThick;
    lathePts.push(new THREE.Vector2(Math.max(0.001, r), y));
  }
  const glassGeo = new THREE.LatheGeometry(lathePts, 48);
  glassGeo.rotateZ(Math.PI / 2); // 讓透鏡光軸沿 X 軸！
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xdcf4ff,
    roughness: 0.06,
    metalness: 0.05,
    transmission: 0.75,
    transparent: true,
    opacity: 0.56,
    ior: 1.52,
    clearcoat: 1.0,
    reflectivity: 0.92
  });
  const glassLens = new THREE.Mesh(glassGeo, glassMat);
  lensGroup.add(glassLens);

  // 黃銅透鏡夾環與立柱座
  const lensRim = new THREE.Mesh(new THREE.TorusGeometry(lensRadius + 0.03, 0.065, 16, 48), brassMat);
  lensRim.rotation.y = Math.PI / 2;
  lensGroup.add(lensRim);

  const lensStem = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.42, 14), brassMat);
  lensStem.position.set(0, -lensRadius - 0.22, 0);
  lensGroup.add(lensStem);

  const lensSaddle = new THREE.Mesh(
    new THREE.BoxGeometry(0.62, 0.24, 1.12),
    new THREE.MeshStandardMaterial({ color: 0x262d34, roughness: 0.5, metalness: 0.4 })
  );
  lensSaddle.position.set(0, -AXIS_Y - 0.88, 0);
  lensGroup.add(lensSaddle);

  // 3. 建立 3D 蠟燭模型（可重複用於實物、倒立實像、正立虛像）
  function buildCandleMesh(isVirtual = false, isImage = false) {
    const g = new THREE.Group();
    const opacity = isVirtual ? 0.5 : isImage ? 0.86 : 1.0;
    const transparent = opacity < 1.0;

    // 蠟身從 y=0 向上延伸至 y=0.66，燭芯到 0.76，火燄頂端剛好在 y=CANDLE_H (1.05)
    const wax = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.125, 0.66, 18),
      new THREE.MeshStandardMaterial({ color: isVirtual ? 0xa3d8f4 : 0xf4ead5, roughness: 0.55, transparent, opacity })
    );
    wax.position.y = 0.33;
    g.add(wax);

    const wick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.12, 8),
      new THREE.MeshStandardMaterial({ color: 0x26221e, transparent, opacity })
    );
    wick.position.y = 0.71;
    g.add(wick);

    const flameOuter = new THREE.Mesh(
      new THREE.ConeGeometry(0.105, 0.34, 16),
      new THREE.MeshBasicMaterial({ color: isVirtual ? 0x7fd4ff : 0xff9d2e, transparent: true, opacity: isVirtual ? 0.58 : 0.92 })
    );
    flameOuter.position.y = 0.88;
    g.add(flameOuter);

    const flameInner = new THREE.Mesh(
      new THREE.ConeGeometry(0.055, 0.2, 12),
      new THREE.MeshBasicMaterial({ color: isVirtual ? 0xd9f5ff : 0xfff3a8, transparent: true, opacity: isVirtual ? 0.75 : 0.98 })
    );
    flameInner.position.y = 0.83;
    g.add(flameInner);

    return { group: g, flameOuter, flameInner };
  }

  // 實物蠟燭與滑台
  const objCarriage = new THREE.Group();
  scene.add(objCarriage);
  const objSaddle = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.24, 1.06),
    new THREE.MeshStandardMaterial({ color: 0x4b5561, roughness: 0.45, metalness: 0.45 })
  );
  objSaddle.position.y = -0.88;
  objCarriage.add(objSaddle);

  const objPost = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 1.54, 12), brassMat);
  objPost.position.y = -0.08;
  objCarriage.add(objPost);

  const objSaucer = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.08, 18), brassMat);
  objSaucer.position.y = AXIS_Y - 0.04;
  objCarriage.add(objSaucer);

  const realCandle = buildCandleMesh(false, false);
  realCandle.group.position.y = AXIS_Y;
  objCarriage.add(realCandle.group);

  const candleLight = new THREE.PointLight(0xffb44c, 2.2, 5.5);
  candleLight.position.set(0, AXIS_Y + 0.92, 0.25);
  objCarriage.add(candleLight);

  // 4. 霧面毛玻璃投影屏 + 倒立實像蠟燭
  const screenGroup = new THREE.Group();
  scene.add(screenGroup);

  const screenSaddle = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.24, 1.06),
    new THREE.MeshStandardMaterial({ color: 0x4b5561, roughness: 0.45, metalness: 0.45 })
  );
  screenSaddle.position.y = -0.88;
  screenGroup.add(screenSaddle);

  const screenPost = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.6, 12), railMat);
  screenPost.position.y = -0.52;
  screenGroup.add(screenPost);

  const screenFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.09, 2.8, 2.15),
    new THREE.MeshStandardMaterial({ color: 0x2a3138, roughness: 0.55 })
  );
  screenFrame.position.y = AXIS_Y;
  screenGroup.add(screenFrame);

  const screenSheet = new THREE.Mesh(
    new THREE.PlaneGeometry(1.98, 2.62),
    new THREE.MeshStandardMaterial({ color: 0xf4f0e4, roughness: 0.85, transparent: true, opacity: 0.82, side: THREE.DoubleSide })
  );
  screenSheet.rotation.y = Math.PI / 2;
  screenSheet.position.set(-0.055, AXIS_Y, 0);
  screenGroup.add(screenSheet);

  // 倒立實像（從主光軸向下倒掛！）
  const realImgCandle = buildCandleMesh(false, true);
  realImgCandle.group.position.set(-0.1, AXIS_Y, 0);
  realImgCandle.group.rotation.z = Math.PI;
  screenGroup.add(realImgCandle.group);

  // 正立放大虛像（位於同側 u < F 時出現）
  const virtImgCandle = buildCandleMesh(true, false);
  virtImgCandle.group.position.set(-3, AXIS_Y, 0);
  virtImgCandle.group.visible = false;
  scene.add(virtImgCandle.group);

  // 5. 光線建構輔助（可更新起點與終點的 3D 細圓柱光束）
  const rayMat1 = new THREE.MeshBasicMaterial({ color: 0xf5a623 }); // 平行主光軸 ➔ 過焦點
  const rayMat2 = new THREE.MeshBasicMaterial({ color: 0x48bfe3 }); // 過鏡心直線
  const virtRayMat = new THREE.MeshBasicMaterial({ color: 0x99e0ff, transparent: true, opacity: 0.72 });

  function makeBeam(mat, radius = 0.028) {
    const geo = new THREE.CylinderGeometry(radius, radius, 1, 10);
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    return mesh;
  }

  function setBeam(mesh, p1, p2) {
    const dir = new THREE.Vector3().subVectors(p2, p1);
    const len = dir.length();
    if (len < 0.001) {
      mesh.visible = false;
      return;
    }
    mesh.visible = true;
    mesh.position.copy(p1).add(p2).multiplyScalar(0.5);
    mesh.scale.set(1, len, 1);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  }

  const ray1a = makeBeam(rayMat1);
  const ray1b = makeBeam(rayMat1);
  const ray2 = makeBeam(rayMat2);

  // 虛線延伸線段群（u < F 時使用）
  const dashBeams1 = [];
  const dashBeams2 = [];
  for (let i = 0; i < 8; i++) {
    dashBeams1.push(makeBeam(virtRayMat, 0.02));
    dashBeams2.push(makeBeam(virtRayMat, 0.02));
  }

  function setDashedBeam(arr, pStart, pEnd, show) {
    for (let i = 0; i < arr.length; i++) {
      if (!show) {
        arr[i].visible = false;
        continue;
      }
      const t0 = i / arr.length;
      const t1 = (i + 0.58) / arr.length;
      const a = new THREE.Vector3().lerpVectors(pStart, pEnd, t0);
      const b = new THREE.Vector3().lerpVectors(pStart, pEnd, t1);
      setBeam(arr[i], a, b);
    }
  }

  const objLbl = createLabelSprite('實物燭火 (u)', { dotColor: '#F5A623', scale: 0.0066 });
  const imgLbl = createLabelSprite('實像 / 虛像', { dotColor: '#48BFE3', scale: 0.0066 });
  scene.add(objLbl, imgLbl);

  /* ---------- 狀態與光學計算 ---------- */
  const state = { uFactor: 2.5 }; // u / F

  const gSlider = addToolbarGroup(toolbar, '物距 u：');
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0.60';
  slider.max = '3.00';
  slider.step = '0.05';
  slider.value = String(state.uFactor);
  slider.style.width = '150px';
  const sliderVal = document.createElement('span');
  sliderVal.style.cssText = 'font-family:var(--font-mono);font-weight:700;font-size:0.86rem;min-width:54px;';
  gSlider.appendChild(slider);
  gSlider.appendChild(sliderVal);

  const gPreset = addToolbarGroup(toolbar, '典型位置：');
  const presets = [
    { key: 'gt2f', label: 'u > 2F (照相機)', val: 2.6 },
    { key: 'eq2f', label: 'u = 2F (影印機)', val: 2.0 },
    { key: 'f2f', label: 'F < u < 2F (投影機)', val: 1.45 },
    { key: 'ltf', label: 'u < F (放大鏡)', val: 0.70 }
  ];
  const presetBtns = {};
  for (const p of presets) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn-light';
    b.textContent = p.label;
    b.addEventListener('click', () => {
      state.uFactor = p.val;
      slider.value = String(p.val);
      updateOptics();
    });
    gPreset.appendChild(b);
    presetBtns[p.key] = b;
  }

  slider.addEventListener('input', () => {
    state.uFactor = parseFloat(slider.value);
    updateOptics();
  });

  function updateOptics() {
    const uf = state.uFactor;
    const u = uf * F;
    sliderVal.textContent = uf.toFixed(2) + 'F';

    // 更新快捷鍵高亮
    presetBtns.gt2f.classList.toggle('active', uf > 2.08);
    presetBtns.eq2f.classList.toggle('active', Math.abs(uf - 2.0) <= 0.08);
    presetBtns.f2f.classList.toggle('active', uf > 1.05 && uf < 1.92);
    presetBtns.ltf.classList.toggle('active', uf < 0.96);

    objCarriage.position.x = -u;
    const tipObj = new THREE.Vector3(-u, AXIS_Y + CANDLE_H, 0);
    const lensTop = new THREE.Vector3(0, AXIS_Y + CANDLE_H, 0);
    const lensCenter = new THREE.Vector3(0, AXIS_Y, 0);
    objLbl.position.set(-u, AXIS_Y + CANDLE_H + 0.5, 0);

    // 平行主光軸入射段
    setBeam(ray1a, tipObj, lensTop);

    const isNearFocus = Math.abs(uf - 1.0) < 0.05;
    if (isNearFocus) {
      // u = F，平行光不成像
      screenGroup.visible = false;
      virtImgCandle.group.visible = false;
      const far1 = new THREE.Vector3(6.8, AXIS_Y + CANDLE_H - (6.8 / F) * CANDLE_H, 0);
      const far2 = new THREE.Vector3(6.8, AXIS_Y - (6.8 / u) * CANDLE_H, 0);
      setBeam(ray1b, lensTop, far1);
      setBeam(ray2, tipObj, far2);
      setDashedBeam(dashBeams1, lensTop, tipObj, false);
      setDashedBeam(dashBeams2, lensCenter, tipObj, false);
      imgLbl.visible = false;
      readout.innerHTML =
        '<strong>u ≈ 1.0F（置於焦點上）：</strong>折射後兩條光線互相平行、永不相交，因此<strong>不成像</strong>（常用於手電筒或探照燈產生平行光束）。';
      return;
    }

    const v = (u * F) / (u - F); // 高斯成像公式 1/u + 1/v = 1/f
    const mag = Math.abs(v / u);

    if (uf > 1.0) {
      // 實像（右側倒立）
      const clampedV = Math.min(6.75, v);
      const clampedScale = Math.min(2.35, mag);
      screenGroup.visible = true;
      screenGroup.position.x = clampedV;
      realImgCandle.group.scale.setScalar(clampedScale);
      virtImgCandle.group.visible = false;

      // 計算在 clampedV 處兩道光線的真實交會點（若未超出軌道則精準交會於像頂）
      const y1AtScreen = AXIS_Y + CANDLE_H * (1 - clampedV / F);
      const y2AtScreen = AXIS_Y - CANDLE_H * (clampedV / u);
      setBeam(ray1b, lensTop, new THREE.Vector3(clampedV, y1AtScreen, 0));
      setBeam(ray2, tipObj, new THREE.Vector3(clampedV, y2AtScreen, 0));
      setDashedBeam(dashBeams1, lensTop, tipObj, false);
      setDashedBeam(dashBeams2, lensCenter, tipObj, false);

      imgLbl.visible = true;
      imgLbl.position.set(clampedV, AXIS_Y - CANDLE_H * clampedScale - 0.42, 0);

      let nature = '';
      let device = '';
      if (uf > 2.06) {
        nature = '倒立縮小實像';
        device = '照相機、眼睛水晶體';
      } else if (Math.abs(uf - 2.0) <= 0.06) {
        nature = '倒立等大實像';
        device = '影印機等倍複印';
      } else {
        nature = '倒立放大實像';
        device = '投影機、複式顯微鏡物鏡';
      }
      readout.innerHTML =
        '<strong>成像結果：' + nature + '</strong>（可用紙屏承接） ｜ ' +
        '<code>u = ' + uf.toFixed(2) + 'F</code>，<code>v = ' + (v / F).toFixed(2) + 'F</code>，放大倍率 <code>|m| = ' + mag.toFixed(2) + '×</code>。<br/>' +
        '<strong>折射路徑：</strong>金黃光束平行主光軸入射 ➔ 折射通過右側焦點 <code>F\'</code>；青藍光束通過鏡心 <code>O</code> 直行，兩光束實際會聚成像。（應用：' + device + '）';
    } else {
      // 虛像（u < F，同側正立放大）
      screenGroup.visible = false;
      virtImgCandle.group.visible = true;
      const vDist = Math.abs(v);
      const clampedV = Math.min(6.4, vDist);
      const clampedMag = Math.min(2.6, mag);
      virtImgCandle.group.position.set(-clampedV, AXIS_Y, 0);
      virtImgCandle.group.scale.setScalar(clampedMag);

      // 折射後在右側呈發散狀
      const rightX = 4.6;
      const p1Right = new THREE.Vector3(rightX, AXIS_Y + CANDLE_H * (1 - rightX / F), 0);
      const p2Right = new THREE.Vector3(rightX, AXIS_Y - CANDLE_H * (rightX / u), 0);
      setBeam(ray1b, lensTop, p1Right);
      setBeam(ray2, tipObj, p2Right);

      // 反向延長虛線相交於同側正立放大虛像頂端
      const virtTip = new THREE.Vector3(-clampedV, AXIS_Y + CANDLE_H * clampedMag, 0);
      setDashedBeam(dashBeams1, lensTop, virtTip, true);
      setDashedBeam(dashBeams2, lensCenter, virtTip, true);

      imgLbl.visible = true;
      imgLbl.position.set(-clampedV, AXIS_Y + CANDLE_H * clampedMag + 0.45, 0);

      readout.innerHTML =
        '<strong>成像結果：正立放大虛像</strong>（與物體同側，無法用紙屏承接，須由透鏡右側逆光觀看） ｜ ' +
        '<code>u = ' + uf.toFixed(2) + 'F</code>，虛像距 <code>|v| = ' + (vDist / F).toFixed(2) + 'F</code>，放大倍率 <code>' + mag.toFixed(2) + '×</code>。<br/>' +
        '<strong>原理：</strong>兩條折射光線在右側發散，人眼逆著發散光線往回延伸（虛線交點），看見放大的正立虛像。（應用：<strong>放大鏡</strong>）';
    }
  }

  updateOptics();

  stage.start((dt, elapsed) => {
    const flicker = 1 + Math.sin(elapsed * 14) * 0.06 + Math.cos(elapsed * 23) * 0.04;
    realCandle.flameOuter.scale.set(1, flicker, 1);
    realImgCandle.flameOuter.scale.set(1, flicker, 1);
    virtImgCandle.flameOuter.scale.set(1, flicker, 1);
    candleLight.intensity = 2.0 + Math.sin(elapsed * 17) * 0.25;
  });

  return stage.cleanup;
}

/* =========================================================================
 * 模型 4：SCI_9_3_3 — 3D 立體電路實驗板與電子能量流
 * ========================================================================= */
function mountCircuitModel(containerEl, meta) {
  const stage = createLabStage(containerEl, meta, {
    bgColor: 0x1e2226,
    cameraPos: [0.2, 4.9, 6.8],
    targetPos: [0, 0.1, 0.1],
    minDist: 3.8,
    maxDist: 15
  });
  if (stage.error) return createFallbackUI(containerEl, meta, stage.error);

  const { scene, toolbar, readout } = stage;

  // 1. 溫潤橡木實驗板底座（程式木紋 CanvasTexture）
  const woodCanvas = document.createElement('canvas');
  woodCanvas.width = 512;
  woodCanvas.height = 512;
  const wctx = woodCanvas.getContext('2d');
  wctx.fillStyle = '#B88956';
  wctx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 3) {
    const shade = Math.sin(y * 0.08) * 10 + Math.cos(y * 0.23) * 6;
    wctx.fillStyle = `rgba(92,58,28,${0.08 + Math.abs(shade) * 0.008})`;
    wctx.fillRect(0, y, 512, 2);
  }
  const woodTex = new THREE.CanvasTexture(woodCanvas);
  woodTex.colorSpace = THREE.SRGBColorSpace;
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(7.2, 0.32, 4.8),
    new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.72 })
  );
  board.position.y = -0.16;
  board.receiveShadow = true;
  scene.add(board);

  // 橡膠止滑腳墊
  const footMat = new THREE.MeshStandardMaterial({ color: 0x222529, roughness: 0.9 });
  for (const [fx, fz] of [[-3.2, -2.0], [3.2, -2.0], [-3.2, 2.0], [3.2, 2.0]]) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.12, 16), footMat);
    foot.position.set(fx, -0.38, fz);
    scene.add(foot);
  }

  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4a448, roughness: 0.28, metalness: 0.85 });
  const copperMat = new THREE.MeshStandardMaterial({ color: 0xc87533, roughness: 0.32, metalness: 0.78 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x2b3137, roughness: 0.45, metalness: 0.55 });
  const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xede6d8, roughness: 0.42 });

  function addBindingPost(x, z) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.26, 14), brassMat);
    post.position.set(x, 0.13, z);
    scene.add(post);
    const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 6), brassMat);
    nut.position.set(x, 0.24, z);
    scene.add(nut);
  }

  // 2. 圓柱電池座（1~3 顆電池對應 3V / 6V / 9V）
  const batteryGroup = new THREE.Group();
  batteryGroup.position.set(-2.35, 0, 0.0);
  scene.add(batteryGroup);

  const tray = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.14, 2.55), darkMetal);
  tray.position.y = 0.07;
  batteryGroup.add(tray);

  const cells = [];
  for (let i = 0; i < 3; i++) {
    const cellG = new THREE.Group();
    cellG.position.set((i - 1) * 0.42, 0.34, 0);
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.17, 1.55, 20),
      new THREE.MeshStandardMaterial({ color: 0x24343e, roughness: 0.4, metalness: 0.35 })
    );
    body.rotation.x = Math.PI / 2;
    cellG.add(body);
    const copperRing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.174, 0.174, 0.38, 20),
      copperMat
    );
    copperRing.rotation.x = Math.PI / 2;
    copperRing.position.z = -0.58;
    cellG.add(copperRing);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.12, 16), brassMat);
    cap.rotation.x = Math.PI / 2;
    cap.position.z = -0.82;
    cellG.add(cap);
    batteryGroup.add(cellG);
    cells.push(cellG);
  }
  addBindingPost(-2.35, -1.45); // 電池正極接線柱
  addBindingPost(-2.35, 1.45);  // 電池負極接線柱

  let batLbl = null;
  function setBatteryLabel(v) {
    if (batLbl) {
      scene.remove(batLbl);
      disposeObject3D(batLbl);
    }
    batLbl = createLabelSprite('電池組 (' + v + 'V)', { dotColor: '#C87533', scale: 0.0068 });
    batLbl.position.set(-2.45, 1.12, 0);
    scene.add(batLbl);
  }
  setBatteryLabel(6);

  // 3. 鉸鏈銅質閘刀開關（實體開合動畫）
  const switchGroup = new THREE.Group();
  switchGroup.position.set(-0.65, 0, 1.45);
  scene.add(switchGroup);

  const swBase = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.14, 0.68), ceramicMat);
  swBase.position.y = 0.07;
  switchGroup.add(swBase);

  // 左樞軸座與右夾片
  const swPivotPost = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.32, 0.18), brassMat);
  swPivotPost.position.set(-0.42, 0.24, 0);
  switchGroup.add(swPivotPost);

  const swJaw1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.32, 0.05), brassMat);
  swJaw1.position.set(0.42, 0.24, 0.06);
  const swJaw2 = swJaw1.clone();
  swJaw2.position.z = -0.06;
  switchGroup.add(swJaw1, swJaw2);

  // 可旋轉閘刀臂
  const knifePivot = new THREE.Group();
  knifePivot.position.set(-0.42, 0.34, 0);
  switchGroup.add(knifePivot);

  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.09, 0.055), brassMat);
  blade.position.x = 0.44;
  knifePivot.add(blade);

  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.07, 0.38, 14),
    new THREE.MeshStandardMaterial({ color: 0xa8332b, roughness: 0.45 })
  );
  handle.rotation.z = Math.PI / 2;
  handle.position.x = 1.05;
  knifePivot.add(handle);

  const swLbl = createLabelSprite('銅質閘刀開關', { dotColor: '#D4A448', scale: 0.0066 });
  swLbl.position.set(-0.65, 1.08, 1.65);
  scene.add(swLbl);

  // 4. 兩顆立體白熾燈泡（螺旋銅座＋燈座＋玻璃球罩＋發光鎢絲＋動態 PointLight）
  function buildLightBulb(x, z, labelText) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    scene.add(g);

    const sock = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.18, 24), ceramicMat);
    sock.position.y = 0.09;
    g.add(sock);

    const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.25, 0.28, 20), brassMat);
    collar.position.y = 0.3;
    g.add(collar);

    // 螺紋環
    for (let r = 0; r < 3; r++) {
      const th = new THREE.Mesh(new THREE.TorusGeometry(0.245, 0.022, 8, 24), brassMat);
      th.rotation.x = Math.PI / 2;
      th.position.y = 0.22 + r * 0.08;
      g.add(th);
    }

    // 內部鎢絲與支撐腳
    const lead1 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.48, 6), railWireMat);
    lead1.position.set(-0.08, 0.65, 0);
    const lead2 = lead1.clone();
    lead2.position.x = 0.08;
    g.add(lead1, lead2);

    const filaMat = new THREE.MeshStandardMaterial({
      color: 0x555555,
      emissive: 0xffb833,
      emissiveIntensity: 0,
      roughness: 0.35
    });
    const filaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.08, 0.88, 0),
      new THREE.Vector3(-0.04, 0.98, 0.04),
      new THREE.Vector3(0.0, 0.90, -0.04),
      new THREE.Vector3(0.04, 0.98, 0.04),
      new THREE.Vector3(0.08, 0.88, 0)
    ]);
    const filament = new THREE.Mesh(new THREE.TubeGeometry(filaCurve, 24, 0.016, 8, false), filaMat);
    g.add(filament);

    // 燈泡玻璃球罩
    const globeMat = new THREE.MeshPhysicalMaterial({
      color: 0xfff8e6,
      emissive: 0xffb326,
      emissiveIntensity: 0,
      roughness: 0.1,
      metalness: 0.02,
      transparent: true,
      opacity: 0.44,
      clearcoat: 1.0
    });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 20), globeMat);
    globe.position.y = 0.84;
    g.add(globe);

    const light = new THREE.PointLight(0xffc352, 0, 5.2);
    light.position.set(0, 0.88, 0);
    g.add(light);

    const lbl = createLabelSprite(labelText, { dotColor: '#FFB326', scale: 0.0066 });
    lbl.position.set(0, 1.62, 0);
    g.add(lbl);

    return { group: g, filaMat, globeMat, light };
  }

  const railWireMat = new THREE.MeshStandardMaterial({ color: 0x8b959e, metalness: 0.7, roughness: 0.3 });
  const bulbA = buildLightBulb(1.15, -1.05, '燈泡 A (3Ω)');
  const bulbB = buildLightBulb(1.15, 0.82, '燈泡 B (3Ω)');

  // 5. 串聯與並聯兩組 3D 銅質導線（TubeGeometry）
  const seriesWireGroup = new THREE.Group();
  const parallelWireGroup = new THREE.Group();
  scene.add(seriesWireGroup, parallelWireGroup);

  const redWireMat = new THREE.MeshStandardMaterial({ color: 0xc44835, roughness: 0.42, metalness: 0.15 });
  const wireCuMat = new THREE.MeshStandardMaterial({ color: 0xc97b38, roughness: 0.34, metalness: 0.65 });

  function makePathCurve(pts) {
    return new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])), false, 'catmullrom', 0.15);
  }

  // 串聯完整單一迴路：電池+ (-2.35, -1.45) → 燈泡A → 燈泡B → 開關 → 電池- (-2.35, 1.45)
  const seriesLoop = makePathCurve([
    [-2.35, 0.18, -1.45],
    [-0.5, 0.14, -1.55],
    [1.15, 0.18, -1.48],
    [1.15, 0.18, -1.05],
    [1.75, 0.14, -0.55],
    [1.75, 0.14, 0.35],
    [1.15, 0.18, 0.82],
    [1.15, 0.18, 1.45],
    [-0.22, 0.18, 1.45],
    [-1.08, 0.18, 1.45],
    [-2.35, 0.18, 1.45]
  ]);
  seriesWireGroup.add(new THREE.Mesh(new THREE.TubeGeometry(seriesLoop, 96, 0.048, 10, false), wireCuMat));

  // 並聯線路：幹線 + 支路 A + 支路 B + 回流幹線
  const parMainIn = makePathCurve([
    [-2.35, 0.18, -1.45],
    [-0.6, 0.14, -1.55],
    [0.2, 0.14, -1.05]
  ]);
  const parBranchA = makePathCurve([
    [0.2, 0.14, -1.05],
    [1.15, 0.18, -1.05],
    [2.35, 0.14, -1.05],
    [2.35, 0.14, 0.82]
  ]);
  const parBranchB = makePathCurve([
    [0.2, 0.14, -1.05],
    [0.2, 0.14, 0.82],
    [1.15, 0.18, 0.82],
    [2.35, 0.14, 0.82]
  ]);
  const parMainOut = makePathCurve([
    [2.35, 0.14, 0.82],
    [2.35, 0.14, 1.45],
    [-0.22, 0.18, 1.45],
    [-1.08, 0.18, 1.45],
    [-2.35, 0.18, 1.45]
  ]);

  parallelWireGroup.add(
    new THREE.Mesh(new THREE.TubeGeometry(parMainIn, 32, 0.052, 10, false), redWireMat),
    new THREE.Mesh(new THREE.TubeGeometry(parBranchA, 36, 0.045, 10, false), wireCuMat),
    new THREE.Mesh(new THREE.TubeGeometry(parBranchB, 36, 0.045, 10, false), wireCuMat),
    new THREE.Mesh(new THREE.TubeGeometry(parMainOut, 36, 0.052, 10, false), wireCuMat)
  );
  // 並聯分流節點黃銅柱
  const nodeA = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.28, 14), brassMat);
  nodeA.position.set(0.2, 0.14, -1.05);
  const nodeB = nodeA.clone();
  nodeB.position.set(2.35, 0.14, 0.82);
  parallelWireGroup.add(nodeA, nodeB);

  // 6. 能量流動球（串聯單圈 18 顆；並聯幹線 14 顆＋兩支路各 9 顆，清楚呈現幹線總電流＝支路相加！）
  const pktGeo = new THREE.SphereGeometry(0.088, 12, 10);
  const pktMat = new THREE.MeshStandardMaterial({ color: 0xffd24c, emissive: 0xff9b17, emissiveIntensity: 0.75, roughness: 0.2 });

  function makePackets(curve, count, group) {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const m = new THREE.Mesh(pktGeo, pktMat);
      group.add(m);
      arr.push({ mesh: m, curve, t: i / count });
    }
    return arr;
  }

  const seriesPkts = makePackets(seriesLoop, 18, seriesWireGroup);
  const parInPkts = makePackets(parMainIn, 7, parallelWireGroup);
  const parOutPkts = makePackets(parMainOut, 10, parallelWireGroup);
  const parAPkts = makePackets(parBranchA, 9, parallelWireGroup);
  const parBPkts = makePackets(parBranchB, 9, parallelWireGroup);

  const state = {
    mode: 'series', // 'series' | 'parallel'
    switchOn: true,
    voltage: 6 // 3 | 6 | 9
  };

  let curKnifeAngle = 0;

  function updateCircuit() {
    seriesWireGroup.visible = state.mode === 'series';
    parallelWireGroup.visible = state.mode === 'parallel';

    // 電池顆數對應 3V / 6V / 9V
    const activeCells = state.voltage / 3;
    cells.forEach((c, idx) => { c.visible = idx < activeCells; });

    // 更新電池文字標籤
    setBatteryLabel(state.voltage);

    const R = 3; // 單燈電阻 3Ω
    const V = state.voltage;
    let rTotal, iTotal, iBranch, vBulb, pBulb;
    if (!state.switchOn) {
      rTotal = state.mode === 'series' ? 6 : 1.5;
      iTotal = 0; iBranch = 0; vBulb = 0; pBulb = 0;
    } else if (state.mode === 'series') {
      rTotal = 2 * R;
      iTotal = V / rTotal;
      iBranch = iTotal;
      vBulb = V / 2;
      pBulb = (vBulb * vBulb) / R;
    } else {
      rTotal = R / 2;
      iTotal = V / rTotal;
      iBranch = V / R;
      vBulb = V;
      pBulb = (vBulb * vBulb) / R;
    }

    // 燈泡亮度與實際功率 P 正比（上限 27W 對應滿載強光）
    const glowNorm = Math.min(1.0, pBulb / 14);
    for (const b of [bulbA, bulbB]) {
      b.filaMat.emissiveIntensity = state.switchOn ? 0.6 + glowNorm * 3.2 : 0;
      b.globeMat.emissiveIntensity = state.switchOn ? 0.15 + glowNorm * 0.95 : 0;
      b.light.intensity = state.switchOn ? 0.5 + glowNorm * 4.5 : 0;
    }

    readout.innerHTML =
      '<strong>電路組態：' + (state.mode === 'series' ? '串聯雙燈（單一迴路分壓）' : '並聯雙燈（雙支路等壓、幹線分流）') +
      ' ｜ 開關：' + (state.switchOn ? '🟢 ON 通路' : '🔴 OFF 斷路') + ' ｜ 電源：' + V + 'V</strong><br/>' +
      '總電阻 <code>R總 = ' + rTotal.toFixed(1) + 'Ω</code> ｜ 幹線總電流 <code>I總 = ' + iTotal.toFixed(2) + 'A</code> ｜ 單燈電壓 <code>V燈 = ' + vBulb.toFixed(1) + 'V</code> ｜ 單燈電功率 <code>P = ' + pBulb.toFixed(1) + 'W</code>。<br/>' +
      (state.switchOn
        ? (state.mode === 'parallel'
          ? '<strong>對比洞察：</strong>同電壓下，並聯每顆燈泡獲得完整 ' + V + 'V，單燈功率是串聯的 <strong>4 倍</strong>，且幹線總電流也是串聯的 <strong>4 倍</strong>（電池耗電更快）！'
          : '<strong>對比洞察：</strong>串聯兩燈平分電源電壓（各得 ' + vBulb.toFixed(1) + 'V），總電阻加倍導致電流減半，燈泡顯著較暗。')
        : '閘刀開關已扳開形成<strong>斷路</strong>，迴路電流為 0A，能量流停止、燈泡熄滅。');
  }

  const gTopo = addToolbarGroup(toolbar, '接法：');
  makeToggleButtons(gTopo, [
    { key: 'series', label: '🔗 串聯雙燈' },
    { key: 'parallel', label: '⚡ 並聯雙燈' }
  ], state.mode, (k) => { state.mode = k; updateCircuit(); });

  const gSw = addToolbarGroup(toolbar, '開關：');
  const swBtn = document.createElement('button');
  swBtn.type = 'button';
  swBtn.className = 'btn-light active';
  swBtn.textContent = '🟢 開關 ON';
  swBtn.addEventListener('click', () => {
    state.switchOn = !state.switchOn;
    swBtn.classList.toggle('active', state.switchOn);
    swBtn.textContent = state.switchOn ? '🟢 開關 ON' : '🔴 開關 OFF';
    updateCircuit();
  });
  gSw.appendChild(swBtn);

  const gVolt = addToolbarGroup(toolbar, '電池電壓：');
  const vSlider = document.createElement('input');
  vSlider.type = 'range';
  vSlider.min = '3';
  vSlider.max = '9';
  vSlider.step = '3';
  vSlider.value = String(state.voltage);
  vSlider.style.width = '100px';
  const vVal = document.createElement('span');
  vVal.textContent = '6V';
  vVal.style.cssText = 'font-family:var(--font-mono);font-weight:700;font-size:0.86rem;';
  vSlider.addEventListener('input', () => {
    state.voltage = parseInt(vSlider.value, 10);
    vVal.textContent = state.voltage + 'V';
    updateCircuit();
  });
  gVolt.appendChild(vSlider);
  gVolt.appendChild(vVal);

  updateCircuit();

  stage.start((dt) => {
    // 閘刀實體開合角度內插
    const targetAng = state.switchOn ? 0.0 : 0.82;
    curKnifeAngle += (targetAng - curKnifeAngle) * Math.min(1, dt * 10);
    knifePivot.rotation.z = curKnifeAngle;

    if (!state.switchOn) return;
    const V = state.voltage;
    if (state.mode === 'series') {
      const sp = 0.065 * (V / 3);
      for (const p of seriesPkts) {
        p.t = (p.t + dt * sp) % 1;
        p.mesh.position.copy(p.curve.getPointAt(p.t));
      }
    } else {
      const spBranch = 0.14 * (V / 3);
      const spMain = spBranch * 1.95; // 幹線流速更快，直觀表達 I總 = I1 + I2
      for (const p of parInPkts) {
        p.t = (p.t + dt * spMain) % 1;
        p.mesh.position.copy(p.curve.getPointAt(p.t));
      }
      for (const p of parOutPkts) {
        p.t = (p.t + dt * spMain * 0.72) % 1;
        p.mesh.position.copy(p.curve.getPointAt(p.t));
      }
      for (const p of parAPkts) {
        p.t = (p.t + dt * spBranch) % 1;
        p.mesh.position.copy(p.curve.getPointAt(p.t));
      }
      for (const p of parBPkts) {
        p.t = (p.t + dt * spBranch) % 1;
        p.mesh.position.copy(p.curve.getPointAt(p.t));
      }
    }
  });

  return stage.cleanup;
}

/* =========================================================================
 * 模型 5：SOC_G1_C3 — 3D 台灣中央山脈立體地形與焚風氣流剖面
 * ========================================================================= */
function mountFoehnModel(containerEl, meta) {
  const stage = createLabStage(containerEl, meta, {
    bgColor: 0x1e2b33,
    cameraPos: [0.2, 4.9, 11.4],
    targetPos: [0, 0.9, 0],
    minDist: 4.5,
    maxDist: 18
  });
  if (stage.error) return createFallbackUI(containerEl, meta, stage.error);

  const { scene, toolbar, readout } = stage;

  // 1. 中央山脈立體剖面地形網格（含頂點高度與迎／背風面植被著色）
  const W = 10.6;
  const D = 5.4;
  const segX = 64;
  const segZ = 32;
  const terrainGeo = new THREE.PlaneGeometry(W, D, segX, segZ);
  terrainGeo.rotateX(-Math.PI / 2);

  function ridgeHeight(x, z) {
    // 海岸平原 → 中央山脈主脊（最高約 2.45 單位代表 2000m+）→ 縱谷平原
    const mainRidge = 2.45 * Math.exp(-Math.pow((x - 0.05) / 1.95, 2));
    const subPeak1 = 0.55 * Math.exp(-Math.pow((x + 1.35) / 1.0, 2) - Math.pow((z - 1.1) / 1.4, 2));
    const subPeak2 = 0.48 * Math.exp(-Math.pow((x - 1.15) / 1.1, 2) - Math.pow((z + 1.0) / 1.5, 2));
    const rugged = (Math.sin(x * 2.1 + z * 1.4) * 0.14 + Math.cos(x * 3.7 - z * 2.8) * 0.08) * Math.exp(-Math.pow(x / 3.4, 2));
    return Math.max(0.06, mainRidge + subPeak1 + subPeak2 + rugged);
  }

  const posAttr = terrainGeo.attributes.position;
  const colors = new Float32Array(posAttr.count * 3);
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    posAttr.setY(i, ridgeHeight(x, z));
  }
  terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.82,
    metalness: 0.04,
    flatShading: true
  });
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.castShadow = true;
  terrainMesh.receiveShadow = true;
  scene.add(terrainMesh);

  // 地形模型岩層底座方框（呈現立體剖面展台質感）
  const baseBlock = new THREE.Mesh(
    new THREE.BoxGeometry(W, 0.72, D),
    new THREE.MeshStandardMaterial({ color: 0x4b4640, roughness: 0.88 })
  );
  baseBlock.position.y = -0.34;
  scene.add(baseBlock);

  // 海洋水體（兩側近海微縮水板）
  const oceanMat = new THREE.MeshPhysicalMaterial({
    color: 0x267e96,
    roughness: 0.18,
    metalness: 0.05,
    transparent: true,
    opacity: 0.78
  });
  const leftOcean = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.42, D), oceanMat);
  leftOcean.position.set(-W / 2 - 0.78, -0.18, 0);
  const rightOcean = leftOcean.clone();
  rightOcean.position.x = W / 2 + 0.78;
  scene.add(leftOcean, rightOcean);

  // 2. 迎風面立體積雲群與降雨絲
  const weatherGroup = new THREE.Group();
  scene.add(weatherGroup);

  const cloudGroup = new THREE.Group();
  weatherGroup.add(cloudGroup);
  const cloudMat = new THREE.MeshStandardMaterial({ color: 0xebeef2, roughness: 0.92 });
  const puffDefs = [
    [-2.05, 2.35, -0.6, 0.65],
    [-1.45, 2.62, 0.0, 0.82],
    [-1.85, 2.48, 0.85, 0.68],
    [-0.95, 2.75, -0.35, 0.72],
    [-1.25, 2.42, 1.35, 0.56],
    [-2.35, 2.18, 0.25, 0.54]
  ];
  for (const [cx, cy, cz, cr] of puffDefs) {
    const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(cr, 2), cloudMat);
    puff.position.set(cx, cy, cz);
    puff.scale.set(1.2, 0.78, 1.0);
    cloudGroup.add(puff);
  }

  // 降雨水滴條紋
  const raindrops = [];
  const dropGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.28, 6);
  const dropMat = new THREE.MeshBasicMaterial({ color: 0x73d2f3, transparent: true, opacity: 0.78 });
  for (let i = 0; i < 36; i++) {
    const drop = new THREE.Mesh(dropGeo, dropMat);
    const rx = -2.45 + (i % 9) * 0.22;
    const rz = -1.6 + Math.floor(i / 9) * 1.05;
    weatherGroup.add(drop);
    raindrops.push({ mesh: drop, x: rx, z: rz, phase: (i * 0.19) % 1 });
  }

  // 3. 3 條立體氣流軌跡與溫度變色流體粒子
  const airFlowGroup = new THREE.Group();
  scene.add(airFlowGroup);
  const flowPaths = [];
  const flowParticles = [];
  const particleGeo = new THREE.ConeGeometry(0.11, 0.3, 10);
  particleGeo.rotateX(Math.PI / 2);

  for (const zOff of [-1.25, 0, 1.25]) {
    const pts = [];
    for (let i = 0; i <= 14; i++) {
      const t = i / 14;
      const x = -5.2 + t * 10.4;
      const y = ridgeHeight(x, zOff) + 0.52 + Math.sin(t * Math.PI) * 0.35;
      pts.push(new THREE.Vector3(x, y, zOff));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    flowPaths.push(curve);

    // 淡色氣流緞帶導軌
    const guide = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 48, 0.03, 8, false),
      new THREE.MeshBasicMaterial({ color: 0xd8e2e8, transparent: true, opacity: 0.28 })
    );
    airFlowGroup.add(guide);

    for (let k = 0; k < 12; k++) {
      const mat = new THREE.MeshStandardMaterial({ color: 0x2aa89b, emissive: 0x163f3a, emissiveIntensity: 0.35, roughness: 0.3 });
      const m = new THREE.Mesh(particleGeo, mat);
      airFlowGroup.add(m);
      flowParticles.push({ mesh: m, mat, curve, t: k / 12 });
    }
  }

  // 4. 高度與溫度標牌群（可開關）
  const signGroup = new THREE.Group();
  scene.add(signGroup);
  const signPinMat = new THREE.MeshStandardMaterial({ color: 0xede6d8, roughness: 0.5 });
  const signEntries = [];

  function addSign(x, z, text, dotColor) {
    const groundY = ridgeHeight(x, z);
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.05, 8), signPinMat);
    pin.position.set(x, groundY + 0.52, z);
    signGroup.add(pin);
    const sp = createLabelSprite(text, { dotColor, scale: 0.0068 });
    sp.position.set(x, groundY + 1.28, z);
    signGroup.add(sp);
    signEntries.push({ pin, sp, baseX: x, baseZ: z });
  }

  addSign(-4.2, 0.2, '迎風面山腳 0m・30°C 濕暖', '#2AA89B');
  addSign(-1.8, 0.4, '成雲降雨 1000m・24°C', '#4FA3E3');
  addSign(0.05, 0.0, '中央山脈稜線 2000m・18°C', '#5C8BC4');
  addSign(2.0, 0.4, '背風下沉 1000m・28°C', '#F08C2E');
  addSign(4.2, 0.2, '背風河谷 0m・38°C 乾熱焚風!', '#E04628');

  const state = {
    wind: 'se_taitung', // 'se_taitung' | 'sw_hualien'
    showSigns: true
  };

  // 依迎風／背風方向重繪地形植被色（迎風濕綠 vs 背風乾黃）
  function colorTerrain(flipX) {
    const colAttr = terrainGeo.attributes.color;
    const cWetLow = new THREE.Color(0x528d57);
    const cWetHigh = new THREE.Color(0x2f6841);
    const cRock = new THREE.Color(0x7c7972);
    const cDryHigh = new THREE.Color(0xb88b4a);
    const cDryLow = new THREE.Color(0xc9743a);

    for (let i = 0; i < posAttr.count; i++) {
      const rawX = posAttr.getX(i);
      const x = flipX ? -rawX : rawX;
      const y = posAttr.getY(i);
      const col = new THREE.Color();
      if (y > 2.05) {
        col.copy(cRock);
      } else if (x < 0) {
        col.copy(cWetLow).lerp(cWetHigh, Math.min(1, y / 2.0));
      } else {
        col.copy(cDryLow).lerp(cDryHigh, Math.min(1, y / 2.0));
      }
      colAttr.setXYZ(i, col.r, col.g, col.b);
    }
    colAttr.needsUpdate = true;
  }

  function updateFoehnView() {
    // 切換風向時以 180° Y 軸旋轉雲雨與氣流（避免負縮放導致法線反轉），並重定位標牌（避免文字鏡像）
    const flip = state.wind === 'se_taitung' ? 1 : -1;
    const rotY = flip === 1 ? 0 : Math.PI;
    weatherGroup.rotation.y = rotY;
    airFlowGroup.rotation.y = rotY;
    for (const s of signEntries) {
      const sx = s.baseX * flip;
      const gy = ridgeHeight(sx, s.baseZ);
      s.pin.position.set(sx, gy + 0.52, s.baseZ);
      s.sp.position.set(sx, gy + 1.28, s.baseZ);
    }
    signGroup.visible = state.showSigns;
    colorTerrain(flip === -1);

    if (state.wind === 'se_taitung') {
      readout.innerHTML =
        '<strong>🌀 模式：東南季風／颱風環流越山（台東縱谷焚風）</strong><br/>' +
        '濕暖氣流於迎風面爬升 2000m，水氣凝結降雨採<strong>濕絕熱降溫（−0.6°C/100m）</strong>：<code>30°C − 20×0.6°C = 18°C</code>；' +
        '翻過中央山脈後已成乾燥空氣，於背風面下沉採<strong>乾絕熱增溫（+1.0°C/100m）</strong>：<code>18°C + 20×1.0°C = 38°C</code>，形成高溫乾燥的台東焚風！';
    } else {
      readout.innerHTML =
        '<strong>🌀 模式：西南氣流越過中央山脈（花蓮縱谷焚風）</strong><br/>' +
        '暖濕西南氣流先在西部迎風坡大量降雨釋放潛熱（<code>−0.6°C/100m</code> 至山頂 <code>18°C</code>），翻越稜線下沉至東部花蓮縱谷時劇烈乾絕熱增溫（<code>+1.0°C/100m</code>），' +
        '抵達平地飆升至 <strong>38°C</strong>，農作物易乾枯受損。';
    }
  }

  const gWind = addToolbarGroup(toolbar, '氣流情境：');
  makeToggleButtons(gWind, [
    { key: 'se_taitung', label: '💨 東南季風（台東焚風）' },
    { key: 'sw_hualien', label: '💨 西南氣流（花蓮焚風）' }
  ], state.wind, (k) => { state.wind = k; updateFoehnView(); });

  const gSign = addToolbarGroup(toolbar, '標註：');
  const signBtn = document.createElement('button');
  signBtn.type = 'button';
  signBtn.className = 'btn-light active';
  signBtn.textContent = '🏷 顯示高度溫度標牌';
  signBtn.addEventListener('click', () => {
    state.showSigns = !state.showSigns;
    signBtn.classList.toggle('active', state.showSigns);
    updateFoehnView();
  });
  gSign.appendChild(signBtn);

  updateFoehnView();

  const cTeal = new THREE.Color(0x2aa89b);
  const cCool = new THREE.Color(0x52a8eb);
  const cWarm = new THREE.Color(0xf08c2e);
  const cHot = new THREE.Color(0xe63f24);
  const tmpPt = new THREE.Vector3();
  const tmpTan = new THREE.Vector3();

  stage.start((dt, elapsed) => {
    cloudGroup.position.y = Math.sin(elapsed * 1.4) * 0.08;

    // 迎風面降雨落點循環
    for (const r of raindrops) {
      r.phase = (r.phase + dt * 1.35) % 1;
      const topY = 2.1;
      const groundY = ridgeHeight(r.x, r.z);
      const y = topY - r.phase * (topY - groundY);
      r.mesh.position.set(r.x, y, r.z);
    }

    // 氣流粒子爬升降溫 → 翻山急遽增溫
    for (const p of flowParticles) {
      p.t = (p.t + dt * 0.19) % 1;
      p.curve.getPointAt(p.t, tmpPt);
      p.curve.getTangentAt(p.t, tmpTan);
      p.mesh.position.copy(tmpPt);
      p.mesh.lookAt(tmpPt.clone().add(tmpTan));

      if (p.t < 0.5) {
        p.mat.color.copy(cTeal).lerp(cCool, p.t * 2);
      } else if (p.t < 0.78) {
        p.mat.color.copy(cCool).lerp(cWarm, (p.t - 0.5) / 0.28);
      } else {
        p.mat.color.copy(cWarm).lerp(cHot, (p.t - 0.78) / 0.22);
      }
      p.mat.emissive.copy(p.mat.color).multiplyScalar(0.32);
    }
  });

  return stage.cleanup;
}

/* =========================================================================
 * 模型 6：SCI_9_3_4 — 3D 地層截切定律與台灣聚合板塊剖面
 * ========================================================================= */
function mountGeologyModel(containerEl, meta) {
  const stage = createLabStage(containerEl, meta, {
    bgColor: 0x1e2226,
    cameraPos: [0.3, 2.75, 8.6],
    targetPos: [0, 0.25, 0],
    minDist: 4.0,
    maxDist: 16
  });
  if (stage.error) return createFallbackUI(containerEl, meta, stage.error);

  const { scene, toolbar, readout } = stage;

  // 程式地層顆粒紋理產生器
  function makeRockTexture(baseHex, speckHex, style) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext('2d');
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 256, 128);
    ctx.fillStyle = speckHex;
    if (style === 'pebble') {
      for (let i = 0; i < 65; i++) {
        ctx.beginPath();
        ctx.ellipse((i * 37) % 256, (i * 53) % 128, 4 + (i % 5), 3 + (i % 3), i, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (style === 'lines') {
      for (let y = 6; y < 128; y += 11) {
        ctx.fillRect(0, y, 256, 2);
      }
    } else if (style === 'brick') {
      ctx.strokeStyle = speckHex;
      ctx.lineWidth = 2;
      for (let y = 0; y < 128; y += 26) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
        const off = (y / 26) % 2 === 0 ? 0 : 28;
        for (let x = off; x < 256; x += 56) {
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 26); ctx.stroke();
        }
      }
    } else {
      for (let i = 0; i < 240; i++) {
        ctx.fillRect((i * 73) % 256, (i * 29) % 128, 3, 2);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 1);
    return t;
  }

  // 建立可同步進行「褶皺 + 頂部侵蝕削平 + 左右逆斷層錯動」的動態 3D 岩層網格
  const BLOCK_W = 6.8;
  const BLOCK_D = 3.0;
  const LAYER_DEFS = [
    { name: '礫岩層（最老）', y0: -1.4, y1: -0.75, color: '#8B5A42', speck: '#5C3726', style: 'pebble' },
    { name: '砂岩層', y0: -0.75, y1: -0.1, color: '#CFA36A', speck: '#A77B42', style: 'sand' },
    { name: '頁岩層', y0: -0.1, y1: 0.55, color: '#61707A', speck: '#434F57', style: 'lines' },
    { name: '石灰岩層', y0: 0.55, y1: 1.2, color: '#D8D0BE', speck: '#B3A995', style: 'brick' }
  ];

  const dynamicLayers = [];
  for (const def of LAYER_DEFS) {
    const geo = new THREE.BoxGeometry(BLOCK_W, def.y1 - def.y0, BLOCK_D, 48, 4, 2);
    geo.translate(0, (def.y0 + def.y1) / 2, 0);
    const basePos = geo.attributes.position.array.slice();
    const mat = new THREE.MeshStandardMaterial({
      map: makeRockTexture(def.color, def.speck, def.style),
      roughness: 0.85
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    dynamicLayers.push({ mesh, geo, basePos });
  }

  // 步驟 3 之後才出現的新水平沉積覆蓋層（與下方被削平的褶皺構成「角不整合面」）
  const capGeo = new THREE.BoxGeometry(BLOCK_W, 0.44, BLOCK_D, 48, 2, 2);
  capGeo.translate(0, 1.12, 0);
  const capBasePos = capGeo.attributes.position.array.slice();
  const capMesh = new THREE.Mesh(
    capGeo,
    new THREE.MeshStandardMaterial({ map: makeRockTexture('#9E8D70', '#77684E', 'sand'), roughness: 0.82 })
  );
  capMesh.visible = false;
  scene.add(capMesh);

  // 表層草坡頂蓋（覆於新覆蓋層之上）
  const grassGeo = new THREE.BoxGeometry(BLOCK_W, 0.1, BLOCK_D, 48, 1, 2);
  grassGeo.translate(0, 1.38, 0);
  const grassBasePos = grassGeo.attributes.position.array.slice();
  const grassMesh = new THREE.Mesh(
    grassGeo,
    new THREE.MeshStandardMaterial({ color: 0x56824d, roughness: 0.88 })
  );
  grassMesh.visible = false;
  scene.add(grassMesh);

  // 侵蝕不整合面金色指示線
  const unconfLine = new THREE.Mesh(
    new THREE.BoxGeometry(BLOCK_W + 0.06, 0.045, BLOCK_D + 0.06),
    new THREE.MeshBasicMaterial({ color: 0xf0be4a })
  );
  unconfLine.position.y = 0.90;
  unconfLine.visible = false;
  scene.add(unconfLine);

  // 步驟 2 聚合板塊擠壓箭頭
  const compressGroup = new THREE.Group();
  const arrowMat = new THREE.MeshStandardMaterial({ color: 0xe67e22, roughness: 0.35 });
  for (const side of [-1, 1]) {
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 10), arrowMat);
    shaft.rotation.z = Math.PI / 2;
    shaft.position.set(side * 4.2, 0.0, 0);
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.42, 12), arrowMat);
    head.rotation.z = side * (Math.PI / 2);
    head.position.set(side * 3.68, 0.0, 0);
    compressGroup.add(shaft, head);
  }
  compressGroup.visible = false;
  scene.add(compressGroup);

  // 步驟 4 逆斷層裂面高光板
  const faultPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(0.08, 4.1),
    new THREE.MeshBasicMaterial({ color: 0xe74c3c, side: THREE.DoubleSide })
  );
  faultPlane.position.set(0.1, 0.15, BLOCK_D / 2 + 0.03);
  faultPlane.rotation.z = -0.44; // 斷層面傾斜角
  faultPlane.visible = false;
  scene.add(faultPlane);

  // 步驟 5 炙熱火成岩脈（由底部岩漿庫向上直穿所有岩層、侵蝕面與斷層面！）
  const dikeGroup = new THREE.Group();
  scene.add(dikeGroup);
  const dikeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.95, -1.65, 0.05),
    new THREE.Vector3(-0.55, -0.75, 0.08),
    new THREE.Vector3(-0.18, 0.25, 0.04),
    new THREE.Vector3(0.45, 1.15, 0.06),
    new THREE.Vector3(0.68, 1.88, 0.04)
  ]);
  const dikeOuter = new THREE.Mesh(
    new THREE.TubeGeometry(dikeCurve, 40, 0.28, 12, false),
    new THREE.MeshStandardMaterial({ color: 0x2c2628, roughness: 0.72, metalness: 0.1 })
  );
  dikeOuter.scale.set(1, 1, 5.2); // 沿前後方向拉展成完整穿透岩脈板牆！
  dikeGroup.add(dikeOuter);

  const magmaVein = new THREE.Mesh(
    new THREE.TubeGeometry(dikeCurve, 40, 0.09, 10, false),
    new THREE.MeshStandardMaterial({ color: 0xff6e26, emissive: 0xe84c18, emissiveIntensity: 1.4, roughness: 0.3 })
  );
  magmaVein.position.z = BLOCK_D / 2 - 0.02;
  dikeGroup.add(magmaVein);

  const magmaChamber = new THREE.Mesh(
    new THREE.SphereGeometry(0.65, 20, 14),
    new THREE.MeshStandardMaterial({ color: 0xd94816, emissive: 0xd93a0b, emissiveIntensity: 1.0, roughness: 0.4 })
  );
  magmaChamber.scale.set(1.6, 0.52, 2.2);
  magmaChamber.position.set(-0.95, -1.55, 0);
  dikeGroup.add(magmaChamber);
  dikeGroup.visible = false;

  // 標註標籤
  const geoLblFold = createLabelSprite('背斜／向斜褶皺', { dotColor: '#E67E22', scale: 0.0068 });
  geoLblFold.position.set(-1.6, 2.05, 0.5);
  const geoLblUnconf = createLabelSprite('侵蝕不整合面', { dotColor: '#F0BE4A', scale: 0.0068 });
  geoLblUnconf.position.set(-2.55, 1.15, 1.6);
  const geoLblFault = createLabelSprite('逆斷層（上盤上移）', { dotColor: '#E74C3C', scale: 0.0068 });
  geoLblFault.position.set(1.65, 2.25, 1.2);
  const geoLblDike = createLabelSprite('火成岩脈（切穿全部・最新!）', { dotColor: '#FF6E26', scale: 0.007 });
  geoLblDike.position.set(0.85, 2.48, 0.4);
  scene.add(geoLblFold, geoLblUnconf, geoLblFault, geoLblDike);

  const state = { step: 1 };
  let animFold = 0;
  let animErode = 0;
  let animFault = 0;
  let animDike = 0;

  // 依據目前進度變形所有岩層頂點
  function deformMesh(geo, basePos, foldAmt, erodeAmt, faultAmt, isCap) {
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = basePos[i * 3];
      let y = basePos[i * 3 + 1];
      const z = basePos[i * 3 + 2];

      if (!isCap) {
        // 褶皺（橫向擠壓微縮 + 正弦波起伏）
        x *= 1 - foldAmt * 0.07;
        y += foldAmt * 0.46 * Math.sin(x * 1.12 + 0.4);
        // 侵蝕削平（y > 0.90 的隆起背斜頂部被平切）
        if (erodeAmt > 0.01 && y > 0.90) {
          y = y * (1 - erodeAmt) + 0.90 * erodeAmt;
        }
      } else {
        x *= 1 - foldAmt * 0.07;
      }

      // 逆斷層錯動：斷層面 x_fault(y) = 0.10 - 0.46 * y，右側為上盤，沿斜面向左上方逆衝！
      if (faultAmt > 0.005) {
        const faultX = 0.10 - 0.46 * y;
        const side = THREE.MathUtils.smoothstep(x - faultX, -0.06, 0.06);
        x -= side * faultAmt * 0.24;
        y += side * faultAmt * 0.52;
      }

      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  const STEP_TEXTS = {
    1: '<strong>步驟 1｜水平沉積（疊置定律）：</strong>沉積物在海底或湖底由下而上依序水平堆積（礫岩最老 ➔ 砂岩 ➔ 頁岩 ➔ 石灰岩較新）。',
    2: '<strong>步驟 2｜聚合板塊擠壓褶皺：</strong>菲律賓海板塊與歐亞板塊聚合擠壓台灣造山帶，原本水平的岩層受側向壓力彎曲成<strong>背斜與向斜褶皺</strong>。',
    3: '<strong>步驟 3｜隆起侵蝕與不整合面：</strong>褶皺岩層抬升出水面遭受風化侵蝕削平（金線即為<strong>侵蝕不整合面</strong>），隨後下沉再於其上堆積新的水平沉積岩與表土。',
    4: '<strong>步驟 4｜逆斷層錯動：</strong>持續的板塊推擠使地層斷裂，<strong>斷層上盤沿傾斜斷層面向上逆衝</strong>，連同不整合面一起被切錯，證明「斷層發生於新沉積層之後」。',
    5: '<strong>步驟 5｜炙熱火成岩脈切穿（截切定律）：</strong>地下岩漿沿裂隙上湧冷卻成黑色玄武岩脈，<strong>一口氣切穿褶皺、侵蝕面與逆斷層</strong>！因此發生順序為：<strong>沉積 ➔ 褶皺 ➔ 侵蝕與新覆蓋 ➔ 逆斷層 ➔ 火成岩脈（最新！）</strong>。'
  };

  function updateStepUI() {
    readout.innerHTML = STEP_TEXTS[state.step];
    compressGroup.visible = state.step === 2 || state.step === 4;
    capMesh.visible = state.step >= 3;
    grassMesh.visible = state.step >= 3;
    unconfLine.visible = state.step === 3;
    faultPlane.visible = state.step >= 4;
    dikeGroup.visible = state.step >= 5;

    geoLblFold.visible = state.step >= 2;
    geoLblUnconf.visible = state.step >= 3;
    geoLblFault.visible = state.step >= 4;
    geoLblDike.visible = state.step >= 5;
  }

  const gStep = addToolbarGroup(toolbar, '地質事件演進：');
  makeToggleButtons(gStep, [
    { key: '1', label: '1. 水平沉積' },
    { key: '2', label: '2. 板塊擠壓褶皺' },
    { key: '3', label: '3. 隆起侵蝕面' },
    { key: '4', label: '4. 逆斷層錯動' },
    { key: '5', label: '5. 炙熱岩脈切穿' }
  ], '1', (k) => { state.step = parseInt(k, 10); updateStepUI(); });

  updateStepUI();

  stage.start((dt, elapsed) => {
    const tFold = state.step >= 2 ? 1 : 0;
    const tErode = state.step >= 3 ? 1 : 0;
    const tFault = state.step >= 4 ? 1 : 0;
    const tDike = state.step >= 5 ? 1 : 0;

    const k = Math.min(1, dt * 4.5);
    const prevSum = animFold + animErode + animFault;
    animFold += (tFold - animFold) * k;
    animErode += (tErode - animErode) * k;
    animFault += (tFault - animFault) * k;
    animDike += (tDike - animDike) * k;

    if (Math.abs((animFold + animErode + animFault) - prevSum) > 0.0005 || elapsed < 0.2) {
      for (const l of dynamicLayers) {
        deformMesh(l.geo, l.basePos, animFold, animErode, animFault, false);
      }
      if (state.step >= 3) {
        deformMesh(capGeo, capBasePos, animFold, animErode, animFault, true);
        deformMesh(grassGeo, grassBasePos, animFold, animErode, animFault, true);
      }
    }

    if (dikeGroup.visible) {
      dikeGroup.position.y = -1.6 * (1 - animDike);
      magmaVein.material.emissiveIntensity = 1.1 + Math.sin(elapsed * 4.5) * 0.35;
    }

    if (compressGroup.visible) {
      const pulse = Math.sin(elapsed * 4) * 0.14;
      compressGroup.children[0].position.x = -4.2 + pulse;
      compressGroup.children[1].position.x = -3.68 + pulse;
      compressGroup.children[2].position.x = 4.2 - pulse;
      compressGroup.children[3].position.x = 3.68 - pulse;
    }
  });

  return stage.cleanup;
}

/* =========================================================================
 * 模型 7：SCI_9_3_5 — 3D 日地月 23.5° 傾斜公轉與月相潮汐儀
 * ========================================================================= */
function mountAstronomyModel(containerEl, meta) {
  const stage = createLabStage(containerEl, meta, {
    bgColor: 0x0f1520,
    cameraPos: [0.4, 4.3, 9.6],
    targetPos: [0, 0, 0],
    minDist: 4.2,
    maxDist: 20
  });
  if (stage.error) return createFallbackUI(containerEl, meta, stage.error);

  const { scene, hemiLight, keyLight, rimLight, toolbar, readout } = stage;

  // 調低環境光，使太陽直射在地球與月球上形成極清晰的「晝夜晨昏線」！
  hemiLight.intensity = 0.22;
  keyLight.intensity = 0; // 改由太陽本體的方向光主導真實日照
  rimLight.intensity = 0.12;

  const sunDirLight = new THREE.DirectionalLight(0xfff4d6, 2.5);
  sunDirLight.position.set(7.2, 0, 0);
  scene.add(sunDirLight);

  // 遠方靜態星點背景（細緻不花俏）
  const starPos = [];
  for (let i = 0; i < 240; i++) {
    const theta = (i * 2.39996) % (Math.PI * 2);
    const u = ((i * 0.618033) % 1) * 2 - 1;
    const r = 28 + (i % 7) * 2;
    const sq = Math.sqrt(1 - u * u);
    starPos.push(r * sq * Math.cos(theta), r * u, r * sq * Math.sin(theta));
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xdce6f5, size: 0.14 })));

  // 黃道公轉平面黃銅參考環
  const eclipticRing = new THREE.Mesh(
    new THREE.TorusGeometry(6.2, 0.022, 8, 96),
    new THREE.MeshBasicMaterial({ color: 0xc9a861, transparent: true, opacity: 0.42 })
  );
  eclipticRing.rotation.x = Math.PI / 2;
  scene.add(eclipticRing);

  // 1. 地球系統（位於中心，精準固定 23.5° 地軸傾角朝向 +X 北極星方位！）
  const TILT_RAD = (23.5 * Math.PI) / 180;
  const earthTiltGroup = new THREE.Group();
  earthTiltGroup.rotation.z = -TILT_RAD; // 北極向 +X 傾斜 23.5°（夏至太陽在 +X 時直射 23.5°N！）
  scene.add(earthTiltGroup);

  // 繪製含海洋、大陸塊（含台灣位置強調）與極地冰帽的地球貼圖
  const eCanvas = document.createElement('canvas');
  eCanvas.width = 512;
  eCanvas.height = 256;
  const ectx = eCanvas.getContext('2d');
  ectx.fillStyle = '#1E5B8A';
  ectx.fillRect(0, 0, 512, 256);

  // 風格化大陸塊
  ectx.fillStyle = '#538D5B';
  const blobs = [
    [95, 86, 52, 34], [140, 146, 34, 42], // 美洲
    [255, 78, 44, 24], [268, 134, 34, 42], // 歐非
    [352, 88, 68, 38], [398, 166, 36, 22]  // 亞澳
  ];
  for (const [bx, by, rx, ry] of blobs) {
    ectx.beginPath();
    ectx.ellipse(bx, by, rx, ry, 0.2, 0, Math.PI * 2);
    ectx.fill();
  }
  // 標記台灣小點（23.5°N 附近）
  ectx.fillStyle = '#F2C14E';
  ectx.beginPath();
  ectx.arc(392, 95, 4.5, 0, Math.PI * 2);
  ectx.fill();

  // 南北極冰帽
  ectx.fillStyle = '#E8F0F4';
  ectx.fillRect(0, 0, 512, 18);
  ectx.fillRect(0, 238, 512, 18);

  const earthTex = new THREE.CanvasTexture(eCanvas);
  earthTex.colorSpace = THREE.SRGBColorSpace;

  const earthMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.42, 40, 28),
    new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.72, metalness: 0.04 })
  );
  earthTiltGroup.add(earthMesh);

  // 黃銅地軸桿（23.5° 傾斜貫穿南北極）
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xd4a64c, roughness: 0.3, metalness: 0.8 });
  const axisRod = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 4.15, 12), brassMat);
  earthTiltGroup.add(axisRod);
  const nCap = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.22, 12), brassMat);
  nCap.position.y = 2.15;
  earthTiltGroup.add(nCap);

  // 赤道、北回歸線 (23.5°N)、南回歸線 (23.5°S) 立體細環
  function addLatRing(latDeg, colorHex) {
    const rad = (latDeg * Math.PI) / 180;
    const r = 1.445 * Math.cos(rad);
    const y = 1.445 * Math.sin(rad);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.018, 8, 64),
      new THREE.MeshBasicMaterial({ color: colorHex })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    earthTiltGroup.add(ring);
  }
  addLatRing(0, 0xf2c14e);      // 赤道
  addLatRing(23.5, 0xe86f51);   // 北回歸線
  addLatRing(-23.5, 0x58b4d1);  // 南回歸線

  const northLbl = createLabelSprite('北極 N (傾角 23.5°)', { dotColor: '#D4A64C', scale: 0.0064 });
  northLbl.position.set(0, 2.45, 0);
  earthTiltGroup.add(northLbl);

  // 2. 潮汐水層隆起橢球（沿地月連線拉長，大潮顯著隆起、小潮趨緩！）
  const tidalBulge = new THREE.Mesh(
    new THREE.SphereGeometry(1.52, 36, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0x45b8db,
      roughness: 0.15,
      transparent: true,
      opacity: 0.30,
      depthWrite: false
    })
  );
  scene.add(tidalBulge);

  // 3. 太陽群組（含發光球體＋三條平行太陽光線箭頭指向地球）
  const sunGroup = new THREE.Group();
  scene.add(sunGroup);
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 28, 22),
    new THREE.MeshBasicMaterial({ color: 0xffd25a })
  );
  sunMesh.position.set(6.2, 0, 0);
  sunGroup.add(sunMesh);

  const sunHalo = new THREE.Mesh(
    new THREE.SphereGeometry(1.18, 24, 18),
    new THREE.MeshBasicMaterial({ color: 0xffa629, transparent: true, opacity: 0.25 })
  );
  sunHalo.position.set(6.2, 0, 0);
  sunGroup.add(sunHalo);

  // 三條平行太陽光束（清楚顯示夏至直射北回歸線、冬至直射南回歸線！）
  const rayMat = new THREE.MeshBasicMaterial({ color: 0xffdc73, transparent: true, opacity: 0.72 });
  for (const ry of [-0.56, 0, 0.56]) {
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 3.25, 8), rayMat);
    beam.rotation.z = Math.PI / 2;
    beam.position.set(3.55, ry, 0);
    sunGroup.add(beam);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.22, 10), rayMat);
    tip.rotation.z = Math.PI / 2;
    tip.position.set(1.9, ry, 0);
    sunGroup.add(tip);
  }
  const sunLbl = createLabelSprite('☀ 太陽平行光', { dotColor: '#FFD25A', scale: 0.007 });
  sunLbl.position.set(6.2, 1.48, 0);
  sunGroup.add(sunLbl);

  // 4. 月球與白道面軌道（5° 傾角）
  const moonOrbitGroup = new THREE.Group();
  moonOrbitGroup.rotation.x = (5 * Math.PI) / 180;
  scene.add(moonOrbitGroup);

  const moonRing = new THREE.Mesh(
    new THREE.TorusGeometry(3.45, 0.018, 8, 72),
    new THREE.MeshBasicMaterial({ color: 0x9ab0c7, transparent: true, opacity: 0.48 })
  );
  moonRing.rotation.x = Math.PI / 2;
  moonOrbitGroup.add(moonRing);

  // 程式月球隕石坑貼圖
  const mCanvas = document.createElement('canvas');
  mCanvas.width = 256;
  mCanvas.height = 128;
  const mctx = mCanvas.getContext('2d');
  mctx.fillStyle = '#C9C6BE';
  mctx.fillRect(0, 0, 256, 128);
  for (let i = 0; i < 48; i++) {
    mctx.fillStyle = i % 2 === 0 ? 'rgba(130,126,118,0.45)' : 'rgba(165,160,152,0.35)';
    mctx.beginPath();
    mctx.arc((i * 47) % 256, (i * 29) % 128, 3 + (i % 9), 0, Math.PI * 2);
    mctx.fill();
  }
  const moonTex = new THREE.CanvasTexture(mCanvas);
  moonTex.colorSpace = THREE.SRGBColorSpace;

  const moonPivot = new THREE.Group();
  moonOrbitGroup.add(moonPivot);
  const moonMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 24, 18),
    new THREE.MeshStandardMaterial({ map: moonTex, roughness: 0.92 })
  );
  moonMesh.position.set(3.45, 0, 0);
  moonPivot.add(moonMesh);

  const moonLbl = createLabelSprite('月球', { dotColor: '#C9C6BE', scale: 0.0066 });
  moonLbl.position.set(3.45, 0.78, 0);
  moonPivot.add(moonLbl);

  const state = {
    season: 'summer', // 'summer' | 'autumn' | 'winter' | 'spring'
    moon: 'new'       // 'new' | 'first' | 'full' | 'last'
  };

  const SEASON_ANGLES = {
    summer: 0,
    autumn: -Math.PI / 2,
    winter: Math.PI,
    spring: Math.PI / 2
  };
  const MOON_REL_ANGLES = {
    new: 0,
    first: Math.PI / 2,
    full: Math.PI,
    last: -Math.PI / 2
  };

  let curSunAng = 0;
  let curMoonAng = 0;
  let curBulgeX = 1.38;

  function shortestAngleDiff(target, current) {
    let d = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI;
    if (d < -Math.PI) d += Math.PI * 2;
    return d;
  }

  function updateAstroReadout() {
    const seasonInfo = {
      summer: '<strong>夏至（6/21）：</strong>北極傾向太陽，太陽直射<strong>北回歸線（23.5°N，經過台灣嘉義／花蓮）</strong>，北半球晝長夜短、北極圈永晝。',
      autumn: '<strong>秋分（9/23）：</strong>地軸與日地連線垂直，太陽直射<strong>赤道（0°）</strong>，全球晝夜等長（各 12 小時）。',
      winter: '<strong>冬至（12/22）：</strong>北極背離太陽，太陽直射<strong>南回歸線（23.5°S）</strong>，北半球晝短夜長、太陽斜射最甚。',
      spring: '<strong>春分（3/21）：</strong>太陽再度直射<strong>赤道（0°）</strong>，全球晝夜平分。'
    }[state.season];

    const isSpringTide = state.moon === 'new' || state.moon === 'full';
    const moonInfo = {
      new: '<strong>初一（朔／新月）➔ 大潮：</strong>日、地、月排成一直線，太陽與月球引潮力疊加，水層隆起最劇烈，潮差最大！',
      first: '<strong>初七（上弦月）➔ 小潮：</strong>日、地、月夾角 90°，太陽與月球引潮力部分抵銷，水層隆起較緩和，潮差最小。',
      full: '<strong>十五（望／滿月）➔ 大潮：</strong>日、地、月再次排成一直線（地球居中），引潮力疊加形成大潮！',
      last: '<strong>廿二（下弦月）➔ 小潮：</strong>日、地、月再次呈直角 90°，引潮力互相削弱形成小潮。'
    }[state.moon];

    readout.innerHTML =
      seasonInfo + '<br/>' + moonInfo + '<br/>' +
      '<strong>會考核心提醒：</strong>四季成因是<strong>「地軸固定傾斜 23.5° 造成太陽直射緯度改變」</strong>（絕非日地距離遠近！）；因月球同步公轉，地球自轉一周後須多轉約 12°，故每日滿潮時間約<strong>延後 50 分鐘</strong>。';
  }

  const gSeason = addToolbarGroup(toolbar, '節氣：');
  makeToggleButtons(gSeason, [
    { key: 'summer', label: '☀ 夏至 (6/21 北回歸線)' },
    { key: 'autumn', label: '🍂 秋分 (9/23 赤道)' },
    { key: 'winter', label: '❄ 冬至 (12/22 南回歸線)' },
    { key: 'spring', label: '🌱 春分 (3/21 赤道)' }
  ], state.season, (k) => { state.season = k; updateAstroReadout(); });

  const gMoon = addToolbarGroup(toolbar, '月相潮汐：');
  makeToggleButtons(gMoon, [
    { key: 'new', label: '🌑 初一朔 (大潮)' },
    { key: 'first', label: '🌓 初七上弦 (小潮)' },
    { key: 'full', label: '🌕 十五望 (大潮)' },
    { key: 'last', label: '🌗 廿二下弦 (小潮)' }
  ], state.moon, (k) => { state.moon = k; updateAstroReadout(); });

  updateAstroReadout();

  stage.start((dt) => {
    // 地球繞自身 23.5° 傾斜地軸緩慢自轉（由西向東）
    earthMesh.rotation.y += dt * 0.42;

    const k = Math.min(1, dt * 4.5);
    const tgtSun = SEASON_ANGLES[state.season];
    const tgtMoon = tgtSun + MOON_REL_ANGLES[state.moon];
    curSunAng += shortestAngleDiff(tgtSun, curSunAng) * k;
    curMoonAng += shortestAngleDiff(tgtMoon, curMoonAng) * k;

    sunGroup.rotation.y = curSunAng;
    sunDirLight.position.set(Math.cos(curSunAng) * 7.5, 0, -Math.sin(curSunAng) * 7.5);

    moonPivot.rotation.y = curMoonAng;

    // 潮汐水層沿地月連線對齊，並於大潮時明顯拉長、小潮時收斂
    const isSpringTide = state.moon === 'new' || state.moon === 'full';
    const tgtBulge = isSpringTide ? 1.38 : 1.14;
    curBulgeX += (tgtBulge - curBulgeX) * k;
    tidalBulge.rotation.y = curMoonAng;
    const crossScale = isSpringTide ? 0.94 : 1.01;
    tidalBulge.scale.set(curBulgeX, crossScale, crossScale);
  });

  return stage.cleanup;
}

/* =========================================================================
 * 模型登錄表與全域匯出 API (window.JuniorLab3D)
 * ========================================================================= */
const MODEL_BUILDERS = {
  SCI_7_1_1: mountCellModel,
  SCI_7_1_3: mountHeartModel,
  SCI_8_2_2: mountLensModel,
  SCI_9_3_3: mountCircuitModel,
  SOC_G1_C3: mountFoehnModel,
  SCI_9_3_4: mountGeologyModel,
  SCI_9_3_5: mountAstronomyModel
};

const JuniorLab3D = {
  hasModel(unitId) {
    return Object.prototype.hasOwnProperty.call(MODEL_BUILDERS, unitId);
  },

  getMeta(unitId) {
    return MODEL_META[unitId] ? { ...MODEL_META[unitId] } : null;
  },

  mount(unitId, containerEl) {
    const builder = MODEL_BUILDERS[unitId];
    const meta = MODEL_META[unitId];
    if (!builder || !containerEl) {
      return function noop() {};
    }
    try {
      const cleanup = builder(containerEl, meta);
      return typeof cleanup === 'function' ? cleanup : function noop() {};
    } catch (err) {
      return createFallbackUI(containerEl, meta, err && err.message ? err.message : '初始化例外');
    }
  }
};

window.JuniorLab3D = JuniorLab3D;
export default JuniorLab3D;
