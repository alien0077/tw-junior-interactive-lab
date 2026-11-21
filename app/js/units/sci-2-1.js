/* ==========================================================================
   sci-2-1.js — 單元 2-1：物質狀態、密度與浮力
   模式 A：LIS 阿基米德溢水秤 + 沉體向上浮力向量箭頭 + M-V 斜率 + 鐵捏成船
   模式 B：三態微觀分子透視鏡（證明分子大小與結構不變，只改變間距）
   階段 ④：同重量木塊 vs 鐵塊浮力反例 + M-V 圖相減去皮重步驟積木槽
   ========================================================================== */
(function (global) {
  'use strict';

  var UNIT_ID = 'SCI_8_2_1';

  function mount(container) {
    return global.JuniorSolverUI.renderUnitShell(container, {
      unitId: UNIT_ID,
      badgeText: '🔬 八年級自然理化｜單元 2-1',
      title: '物質狀態、密度與浮力',
      subtitle: '跟著阿基米德看懂「沉到底一樣有浮力」、鐵塊捏成船為何能浮，以及 M-V 去皮重速解',
      goldenRule: '密度看每格有多擁擠；浮力＝排開的液體重（沉到底一樣有浮力！）。',
      hints: [
        '想一想你在游泳池裡抱起水底的石頭或同學，是不是覺得比在陸地上輕很多？那股幫你往上撐的力量就是「浮力」！',
        '浮力大小永遠等於「被你擠走的液體重量」(B = V排 × D液)。木塊雖然比較輕，但它排開的水重「剛好撐起全部木塊重量」；一樣重的鐵塊體積卻很小，只擠走一點點水，所以鐵塊浮力反而比同重量木塊小！'
      ],
      onRenderStage: function (stageKey, bodyEl, shell) {
        if (stageKey === 'ENGAGE') return renderEngage(bodyEl, shell);
        if (stageKey === 'EXPLORE') return renderExplore(bodyEl, shell);
        if (stageKey === 'EXPLAIN') return renderExplain(bodyEl, shell);
        if (stageKey === 'EVALUATE') return renderEvaluate(bodyEl, shell);
      }
    });
  }

  function renderEngage(bodyEl, shell) {
    bodyEl.innerHTML =
      '<div class="engage-card">' +
        '<div style="font-size:0.84rem;color:#0d9488;font-weight:700;margin-bottom:6px;">STAGE 1｜LIS 科學史衝突提問</div>' +
        '<p class="engage-question">⚓ 阿基米德拿到一塊沉到水缸最底部的實心鐵塊（重 78 g，體積 10 cm³）。請問它沉在水中不動時，受到的水的浮力是多少？另外，一壺水煮滾變成大量水蒸氣時，水分子本身發生什麼事？</p>' +
        '<div class="prediction-grid">' +
          '<button class="pred-btn" data-c="zero">A. 鐵塊已經沉到水底，代表浮力＝0；水分子加熱膨脹變大顆了</button>' +
          '<button class="pred-btn" data-c="both">B. 沉底依然有 10 gw 浮力（排開 10 cm³ 水重）；水分子大小不變，只是距離拉遠！</button>' +
          '<button class="pred-btn" data-c="split">C. 浮力等於鐵重 78 gw；水分子被煮斷分成氫氣跟氧氣</button>' +
        '</div>' +
        '<div id="s21-eng-msg"></div>' +
        '<button id="s21-to-exp" class="btn-primary hidden" style="margin-top:12px;">進入階段 ②：阿基米德溢水秤＆微觀分子實驗室 →</button>' +
      '</div>';

    var msg = bodyEl.querySelector('#s21-eng-msg');
    var nextBtn = bodyEl.querySelector('#s21-to-exp');
    bodyEl.querySelectorAll('.pred-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        bodyEl.querySelectorAll('.pred-btn').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        if (btn.getAttribute('data-c') === 'both') {
          msg.innerHTML = '<div class="counterexample-box success">✔ 超強科學直覺！沉體照樣佔據水裡的體積，所以一定受浮力；汽化則是物理變化，H₂O 分子一顆也沒裂！</div>';
          shell.markStageDone('ENGAGE', 25);
        } else {
          msg.innerHTML = '<div class="counterexample-box error">🤔 這是全國國中生最常中的兩大迷思！進到下一步，用「溢水秤」跟「微觀透視鏡」親眼看真相！</div>';
          shell.markStageDone('ENGAGE', 15);
        }
        nextBtn.classList.remove('hidden');
      });
    });
    nextBtn.addEventListener('click', function () { shell.goToStage('EXPLORE'); });
  }

  function renderExplore(bodyEl, shell) {
    var mode = 'buoyancy'; // 'buoyancy' | 'states'
    var MATERIALS = {
      wood: { name: '木塊', density: 0.6, color: '#b45309', mass: 60, vol: 100 },
      ice:  { name: '冰塊', density: 0.9, color: '#bae6fd', mass: 90, vol: 100 },
      iron: { name: '實心鐵塊', density: 7.8, color: '#475569', mass: 78, vol: 10 },
      boat: { name: '同塊鐵捏成空心船', density: 0.5, color: '#334155', mass: 78, vol: 156 }
    };
    var LIQUIDS = {
      oil:   { name: '沙拉油 (0.8)', density: 0.8, color: 'rgba(250, 204, 21, 0.35)' },
      water: { name: '純水 (1.0)', density: 1.0, color: 'rgba(56, 189, 248, 0.35)' },
      brine: { name: '濃鹽水 (1.2)', density: 1.2, color: 'rgba(20, 184, 166, 0.38)' }
    };

    var selectedMat = 'iron';
    var selectedLiq = 'water';
    var tempC = 25; // -15 ~ 120
    var seenBuoy = true;
    var seenBoat = false;
    var seenStates = false;
    var rafId = null;

    // 預先生成分子粒子位置
    var particles = [];
    for (var i = 0; i < 20; i++) {
      particles.push({
        baseX: 110 + (i % 5) * 44,
        baseY: 165 + Math.floor(i / 5) * 36,
        x: 110 + (i % 5) * 44,
        y: 165 + Math.floor(i / 5) * 36,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        phase: Math.random() * Math.PI * 2
      });
    }

    bodyEl.innerHTML =
      '<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">' +
        '<button id="s21-tab-buoy" class="btn-light active">模式 A：阿基米德水缸與溢水秤（密度／浮力）</button>' +
        '<button id="s21-tab-states" class="btn-light">模式 B：三態微觀分子透視鏡（固→液→氣）</button>' +
      '</div>' +
      '<div class="dual-view-grid">' +
        '<div class="canvas-panel">' +
          '<div class="panel-title"><span id="s21-title">⚖️ 虛擬水缸＋溢水杯測量台</span><small>向量即時連動</small></div>' +
          '<canvas id="s21-canvas" class="sim-canvas"></canvas>' +
          '<div id="s21-controls" class="controls-bar"></div>' +
        '</div>' +
        '<div class="logic-panel">' +
          '<div class="panel-title"><span>📊 數據分析與 M-V 關係</span><span id="s21-exp-badge" class="badge-status status-inprogress">試試「鐵捏成船」與「三態」</span></div>' +
          '<div id="s21-readout" style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:14px;font-size:0.92rem;"></div>' +
          '<button id="s21-to-exp" class="btn-primary hidden" style="margin-top:12px;">探索完成！前往階段 ③ 總結原理 →</button>' +
        '</div>' +
      '</div>';

    var canvas = bodyEl.querySelector('#s21-canvas');
    var setup = global.JuniorSolverUI.setupCanvas(canvas, 540, 340);
    var ctx = setup.ctx;
    var controlsEl = bodyEl.querySelector('#s21-controls');
    var readoutEl = bodyEl.querySelector('#s21-readout');
    var titleEl = bodyEl.querySelector('#s21-title');
    var badgeEl = bodyEl.querySelector('#s21-exp-badge');
    var nextBtn = bodyEl.querySelector('#s21-to-exp');
    var tabBuoy = bodyEl.querySelector('#s21-tab-buoy');
    var tabStates = bodyEl.querySelector('#s21-tab-states');

    function checkExploreDone() {
      if (seenBuoy && seenBoat && seenStates) {
        badgeEl.className = 'badge-status status-mastered';
        badgeEl.textContent = '✔ 雙視角探索完成';
        nextBtn.classList.remove('hidden');
        shell.markStageDone('EXPLORE', 35);
      }
    }

    function calcPhysics() {
      var mat = MATERIALS[selectedMat];
      var liq = LIQUIDS[selectedLiq];
      var isFloating = mat.density <= liq.density;
      var submergedRatio = isFloating ? (mat.density / liq.density) : 1;
      var vDisplaced = mat.vol * submergedRatio;
      var buoyancy = vDisplaced * liq.density;
      var weight = mat.mass;
      var normalForce = isFloating ? 0 : (weight - buoyancy);
      return {
        mat: mat, liq: liq, isFloating: isFloating,
        submergedRatio: submergedRatio, vDisplaced: vDisplaced,
        buoyancy: buoyancy, weight: weight, normalForce: normalForce
      };
    }

    function renderControlsAndReadout() {
      if (mode === 'buoyancy') {
        titleEl.textContent = '⚖️ 阿基米德水缸與溢水秤（B = V排 × D液）';
        controlsEl.innerHTML =
          '<div style="width:100%;display:flex;gap:6px;flex-wrap:wrap;">' +
            '<button class="btn-light s21-mat ' + (selectedMat === 'wood' ? 'active' : '') + '" data-m="wood">🪵 木塊 (0.6)</button>' +
            '<button class="btn-light s21-mat ' + (selectedMat === 'ice' ? 'active' : '') + '" data-m="ice">🧊 冰塊 (0.9)</button>' +
            '<button class="btn-light s21-mat ' + (selectedMat === 'iron' ? 'active' : '') + '" data-m="iron">🔩 實心鐵 (7.8)</button>' +
            '<button class="btn-light s21-mat ' + (selectedMat === 'boat' ? 'active' : '') + '" data-m="boat">⛵ 鐵捏成空心船！</button>' +
          '</div>' +
          '<div style="width:100%;display:flex;gap:6px;flex-wrap:wrap;margin-top:4px;">' +
            '<span style="font-size:0.84rem;color:#475569;align-self:center;">液體：</span>' +
            '<button class="btn-light s21-liq ' + (selectedLiq === 'oil' ? 'active' : '') + '" data-l="oil">油 (0.8)</button>' +
            '<button class="btn-light s21-liq ' + (selectedLiq === 'water' ? 'active' : '') + '" data-l="water">純水 (1.0)</button>' +
            '<button class="btn-light s21-liq ' + (selectedLiq === 'brine' ? 'active' : '') + '" data-l="brine">鹽水 (1.2)</button>' +
          '</div>';

        controlsEl.querySelectorAll('.s21-mat').forEach(function (b) {
          b.addEventListener('click', function () {
            selectedMat = b.getAttribute('data-m');
            if (selectedMat === 'boat') seenBoat = true;
            global.JuniorStore.touchInteraction(UNIT_ID);
            renderControlsAndReadout();
            checkExploreDone();
          });
        });
        controlsEl.querySelectorAll('.s21-liq').forEach(function (b) {
          b.addEventListener('click', function () {
            selectedLiq = b.getAttribute('data-l');
            global.JuniorStore.touchInteraction(UNIT_ID);
            renderControlsAndReadout();
            checkExploreDone();
          });
        });

        var p = calcPhysics();
        readoutEl.innerHTML =
          '<div><strong>物體：</strong>' + p.mat.name + '（質量 ' + p.weight + ' g，體積 ' + p.mat.vol + ' cm³，平均密度 <strong>' + p.mat.density + '</strong>）</div>' +
          '<div style="margin:6px 0;"><strong>狀態：</strong>' + (p.isFloating ? '<span style="color:#16a34a;font-weight:700;">浮體（沒入 ' + (p.submergedRatio * 100).toFixed(0) + '%）</span>' : '<span style="color:#dc2626;font-weight:700;">沉體（沉入水底）</span>') + '</div>' +
          '<div style="background:#f1f5f9;padding:10px;border-radius:8px;line-height:1.8;">' +
            '🌊 排開液體體積 V排 = <strong>' + p.vDisplaced.toFixed(1) + ' cm³</strong><br>' +
            '⬆️ 向上浮力 B = ' + p.vDisplaced.toFixed(1) + ' × ' + p.liq.density + ' = <strong style="color:#2563eb;">' + p.buoyancy.toFixed(1) + ' gw</strong><br>' +
            '⬇️ 向下重力 W = <strong style="color:#dc2626;">' + p.weight.toFixed(1) + ' gw</strong><br>' +
            (p.isFloating ? '✔ 浮體受力平衡：浮力剛好等於物重！' : '🧱 池底向上撐住的正向力 = ' + p.normalForce.toFixed(1) + ' gw（注意：浮力不是 0！）') +
          '</div>' +
          (!seenBoat ? '<div style="margin-top:8px;font-size:0.84rem;color:#b45309;">👆 試試看把 78g「實心鐵」點擊「⛵ 鐵捏成空心船」看看為什麼能浮起來！</div>' : '');
      } else {
        titleEl.textContent = '🔬 三態微觀分子透視鏡（H₂O 分子結構不變）';
        var stateName = tempC < 0 ? '🧊 固態（冰：整齊排隊原地微震）' : (tempC < 100 ? '💧 液態（水：靠近滑動流動）' : '☁️ 氣態（水蒸氣：掙脫束縛高速亂飛）');
        controlsEl.innerHTML =
          '<div class="slider-group">' +
            '<label>控制酒精燈溫度：<strong>' + tempC + ' °C</strong> — ' + stateName + '</label>' +
            '<input id="s21-temp" type="range" min="-15" max="120" step="1" value="' + tempC + '">' +
          '</div>';

        controlsEl.querySelector('#s21-temp').addEventListener('input', function (e) {
          tempC = parseInt(e.target.value, 10);
          global.JuniorStore.touchInteraction(UNIT_ID);
          renderControlsAndReadout();
          checkExploreDone();
        });

        readoutEl.innerHTML =
          '<div style="background:#f0fdfa;border:1px solid #99f6e4;padding:12px;border-radius:8px;">' +
            '<strong>👀 觀察重點：</strong><br>' +
            '1. 溫度從 −15°C 一路加熱到 120°C，畫面中的 <strong>H₂O 水分子本身大小完全沒變大，也沒有裂成 H₂ 和 O₂</strong>！<br>' +
            '2. 改變的只有「<strong>分子之間的距離與運動速度</strong>」，這就是「物理變化」！' +
          '</div>';
      }
    }

    var tAnim = 0;
    function draw() {
      tAnim += 0.05;
      ctx.clearRect(0, 0, setup.width, setup.height);

      if (mode === 'buoyancy') {
        var p = calcPhysics();
        // 畫主水缸
        var tankX = 60, tankY = 75, tankW = 220, tankH = 225;
        var liqTop = 135;

        ctx.fillStyle = p.liq.color;
        ctx.fillRect(tankX, liqTop, tankW, tankY + tankH - liqTop);

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(tankX, tankY);
        ctx.lineTo(tankX, tankY + tankH);
        ctx.lineTo(tankX + tankW, tankY + tankH);
        ctx.lineTo(tankX + tankW, tankY);
        ctx.stroke();

        // 溢水口與小溢水杯
        ctx.beginPath();
        ctx.moveTo(tankX + tankW, liqTop - 4);
        ctx.lineTo(tankX + tankW + 46, liqTop + 18);
        ctx.stroke();

        // 溢水小杯 + 磅秤
        var cupX = 335, cupY = 215, cupW = 110, cupH = 70;
        var fillH = Math.min(cupH - 8, p.vDisplaced * 0.42);
        ctx.fillStyle = p.liq.color;
        ctx.fillRect(cupX, cupY + cupH - fillH, cupW, fillH);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(cupX, cupY, cupW, cupH);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(cupX - 10, cupY + cupH, cupW + 20, 22);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('溢水重: ' + p.buoyancy.toFixed(1) + ' gw', cupX + cupW / 2, cupY + cupH + 15);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('阿基米德溢水秤', cupX + cupW / 2, cupY - 10);

        // 畫物體（浮體依沒入比例，沉體落底）
        var objW = selectedMat === 'boat' ? 110 : (selectedMat === 'iron' ? 46 : 76);
        var objH = selectedMat === 'boat' ? 48 : (selectedMat === 'iron' ? 46 : 76);
        var objX = tankX + tankW / 2 - objW / 2;
        var objY = p.isFloating
          ? liqTop - objH * (1 - p.submergedRatio) + Math.sin(tAnim) * 2
          : tankY + tankH - objH - 2;

        if (selectedMat === 'boat') {
          ctx.fillStyle = p.mat.color;
          ctx.beginPath();
          ctx.moveTo(objX, objY);
          ctx.lineTo(objX + objW, objY);
          ctx.lineTo(objX + objW - 18, objY + objH);
          ctx.lineTo(objX + 18, objY + objH);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.moveTo(objX + 14, objY);
          ctx.lineTo(objX + objW - 14, objY);
          ctx.lineTo(objX + objW - 22, objY + objH - 8);
          ctx.lineTo(objX + 22, objY + objH - 8);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = p.mat.color;
          ctx.fillRect(objX, objY, objW, objH);
        }

        // 畫力向量箭頭（向上藍色浮力、向下紅色重力）
        var cx = objX + objW / 2;
        var cy = objY + objH / 2;
        var bLen = Math.max(18, Math.min(75, p.buoyancy * 0.75));
        var wLen = Math.max(22, Math.min(75, p.weight * 0.75));

        function drawArrow(x1, y1, x2, y2, color, label) {
          ctx.strokeStyle = color;
          ctx.fillStyle = color;
          ctx.lineWidth = 4;
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          var dir = y2 < y1 ? -1 : 1;
          ctx.beginPath();
          ctx.moveTo(x2, y2 + dir * 4);
          ctx.lineTo(x2 - 6, y2 - dir * 8);
          ctx.lineTo(x2 + 6, y2 - dir * 8);
          ctx.closePath();
          ctx.fill();
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText(label, x2 + 10, y2 + 4);
        }

        drawArrow(cx - 10, cy, cx - 10, cy - bLen, '#2563eb', '浮力 ' + p.buoyancy.toFixed(1));
        drawArrow(cx + 10, cy, cx + 10, cy + wLen, '#dc2626', '重力 ' + p.weight.toFixed(0));
      } else {
        // 微觀分子透視鏡
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 3;
        ctx.strokeRect(70, 35, 380, 275);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('微觀放大鏡（觀察每顆水分子的尺寸與距離）', 260, 24);

        particles.forEach(function (pt) {
          if (tempC < 0) {
            pt.x = pt.baseX + Math.sin(tAnim * 4 + pt.phase) * 2;
            pt.y = pt.baseY + Math.cos(tAnim * 4 + pt.phase) * 2;
          } else if (tempC < 100) {
            pt.x += pt.vx * 0.5;
            pt.y += pt.vy * 0.5;
            if (pt.x < 90) { pt.x = 90; pt.vx = Math.abs(pt.vx); }
            if (pt.x > 430) { pt.x = 430; pt.vx = -Math.abs(pt.vx); }
            if (pt.y < 145) { pt.y = Math.min(145, pt.y + 3.5); pt.vy = Math.abs(pt.vy); }
            if (pt.y > 290) { pt.y = 290; pt.vy = -Math.abs(pt.vy); }
          } else {
            pt.x += pt.vx * 2.2;
            pt.y += pt.vy * 2.2;
            if (pt.x < 88) { pt.x = 88; pt.vx = Math.abs(pt.vx); }
            if (pt.x > 432) { pt.x = 432; pt.vx = -Math.abs(pt.vx); }
            if (pt.y < 55) { pt.y = 55; pt.vy = Math.abs(pt.vy); }
            if (pt.y > 292) { pt.y = 292; pt.vy = -Math.abs(pt.vy); }
          }

          // 畫 H2O 分子（1 個紅氧 + 2 個白氫），尺寸始終固定！
          ctx.fillStyle = '#ef4444';
          ctx.beginPath(); ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#cbd5e1';
          ctx.beginPath(); ctx.arc(pt.x - 7, pt.y - 6, 4.5, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(pt.x + 7, pt.y - 6, 4.5, 0, Math.PI * 2); ctx.fill();
        });
      }

      rafId = global.requestAnimationFrame(draw);
    }

    tabBuoy.addEventListener('click', function () {
      mode = 'buoyancy'; seenBuoy = true;
      tabBuoy.classList.add('active'); tabStates.classList.remove('active');
      renderControlsAndReadout(); checkExploreDone();
    });
    tabStates.addEventListener('click', function () {
      mode = 'states'; seenStates = true;
      tabStates.classList.add('active'); tabBuoy.classList.remove('active');
      renderControlsAndReadout(); checkExploreDone();
    });
    nextBtn.addEventListener('click', function () { shell.goToStage('EXPLAIN'); });

    renderControlsAndReadout();
    checkExploreDone();
    draw();

    return function cleanup() {
      if (rafId) global.cancelAnimationFrame(rafId);
    };
  }

  function renderExplain(bodyEl, shell) {
    shell.markStageDone('EXPLAIN', 25);
    bodyEl.innerHTML =
      '<div class="explain-grid">' +
        '<div class="principle-card">' +
          '<h3 style="margin-top:0;">🔬 核心原理：密度與阿基米德浮力</h3>' +
          '<ol style="padding-left:20px;margin:0;line-height:1.85;">' +
            '<li><strong>密度看「單位體積有多擠」：</strong><span class="math-expr">D = M ÷ V</span>。三態變化只改距離不破分子。</li>' +
            '<li><strong>浮力來自排開液體的重量：</strong><span class="math-expr">B = V排 × D液</span>。沉體依然佔體積，只是物重贏過浮力。</li>' +
            '<li><strong>鐵船浮起的秘密：</strong>敲成空心碗包進空氣，讓整體平均密度小於水！</li>' +
          '</ol>' +
        '</div>' +
        '<div class="faq-card">' +
          '<h3 style="margin-top:0;">💡 學生高頻疑問 × 最簡單解法</h3>' +
          '<div class="faq-item">' +
            '<div class="faq-q">疑問 1：「100g 木塊（密度 0.5）與 100g 鐵塊（密度 7.8）同時丟進水裡，誰浮力大？」</div>' +
            '<div class="faq-a"><strong>最簡單解法：</strong>看誰是浮體！木塊浮著，<strong>浮力＝物重＝100 gw</strong>；鐵塊沉到底，只排開 100÷7.8 ≈ 12.8 cm³ 的水，<strong>浮力只有 12.8 gw</strong>！所以木塊浮力大得多！</div>' +
          '</div>' +
          '<div class="faq-item">' +
            '<div class="faq-q">疑問 2：「同一塊木頭從淡水移進濃鹽水，浮力會變大嗎？」</div>' +
            '<div class="faq-a"><strong>最簡單解法：</strong>兩邊都是浮體，浮力永遠等於「木頭自己的重量」→ <strong>浮力不變！</strong>只是鹽水密度大比較撐，排開體積變少（浮得更高）！</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:18px;text-align:right;">' +
        '<button id="s21-to-eval" class="btn-primary">前往階段 ④：同重木鐵浮力陷阱＆ M-V 去皮重積木 →</button>' +
      '</div>';

    bodyEl.querySelector('#s21-to-eval').addEventListener('click', function () {
      shell.goToStage('EVALUATE');
    });
  }

  function renderEvaluate(bodyEl, shell) {
    var quizDone = false;
    var tacticDone = false;

    bodyEl.innerHTML =
      '<div class="canvas-panel" style="margin-bottom:18px;">' +
        '<div class="panel-title"><span>⚡ 迷思反例挑戰：把質量都是 100 g 的「木塊 (D=0.5)」和「鐵塊 (D=7.8)」一起丟進純水，誰受到的浮力比較大？</span></div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">' +
          '<button class="btn-light s21-ans" data-a="iron">A. 鐵塊浮力較大（因為完全沒入水裡）</button>' +
          '<button class="btn-light s21-ans" data-a="same">B. 兩者浮力一樣大（因為質量都是 100 g）</button>' +
          '<button class="btn-light s21-ans" data-a="wood">C. 木塊浮力較大（100 gw > 12.8 gw）</button>' +
        '</div>' +
        '<div id="s21-eval-fb"></div>' +
      '</div>' +
      '<div id="s21-tactic-mount"></div>';

    var fb = bodyEl.querySelector('#s21-eval-fb');
    function checkAll() {
      if (quizDone && tacticDone) {
        shell.markStageDone('EVALUATE', 40);
        shell.unlockBadge('MYTH_BUSTER_BUOYANCY', 80);
      }
    }

    bodyEl.querySelectorAll('.s21-ans').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var a = btn.getAttribute('data-a');
        global.JuniorStore.recordAttempt(UNIT_ID);
        if (a !== 'wood') {
          global.JuniorStore.recordMisconception(UNIT_ID, 'MIS_SAME_MASS_SAME_BUOYANCY', '誤以為同質量或沉入水底的鐵塊浮力大於或等於浮體木塊');
          fb.innerHTML = '<div class="counterexample-box error">🚨 <strong>溢水杯反例打臉：</strong>100g 鐵塊密度超高，體積只有 100 ÷ 7.8 ≈ <strong>12.8 cm³</strong>，只排開 12.8 g 水（浮力只有 12.8 gw）！而 100g 木塊浮在水上撐住整塊重量，排開整整 <strong>100 g 水</strong>（浮力 100 gw）！</div>';
        } else {
          quizDone = true;
          global.JuniorStore.resolveMisconception(UNIT_ID, 'MIS_SAME_MASS_SAME_BUOYANCY');
          fb.innerHTML = '<div class="counterexample-box success">✔ <strong>精準破題！</strong>先判浮沉再算浮力：浮體直接等於物重 (100 gw)，沉體只能排開自身小體積 (12.8 gw)！</div>';
          checkAll();
        }
      });
    });

    global.JuniorSolverUI.mountTacticAssembler(bodyEl.querySelector('#s21-tactic-mount'), {
      unitId: UNIT_ID,
      tacticCode: 'MV_GRAPH_SUBTRACT_TARE',
      title: '會考 M-V 關係圖「相減法去量筒皮重」秒殺術',
      problemText: '測量未知液體密度：量筒裝入 10 mL 液體時總質量 30 g；裝入 30 mL 液體時總質量 46 g。求該液體密度與空量筒重？',
      slots: [
        { label: '步驟 1：兩組相減消掉空量筒重', expectedId: 'sub' },
        { label: '步驟 2：求斜率＝液體真實密度', expectedId: 'dens' },
        { label: '步驟 3：回推空量筒質量', expectedId: 'tare' }
      ],
      chips: [
        { id: 'wrong_div', label: '直接拿第一組 30 g ÷ 10 mL = 3.0 g/cm³ 當作密度', wrongReason: '30 g 裡面混了玻璃量筒的重量！直接除會算錯！' },
        { id: 'sub', label: '多倒了 (30 − 10) = 20 mL 液體，多出 (46 − 30) = 16 g 重量' },
        { id: 'dens', label: '密度 D = ΔM ÷ ΔV = 16 ÷ 20 = 0.8 g/cm³' },
        { id: 'tare', label: '10 mL 液體重 10 × 0.8 = 8 g → 空量筒重 30 − 8 = 22 g' }
      ],
      finalSummaryHtml: '🏆 <strong>秒殺心得：</strong>看到沒過原點的 M-V 圖或兩組數據，永遠用「相減求斜率＝液體密度」，再扣回即得量筒重！',
      onComplete: function () {
        tacticDone = true;
        checkAll();
      }
    });

    return null;
  }

  global.JuniorUnits[UNIT_ID] = { mount: mount };
})(window);
