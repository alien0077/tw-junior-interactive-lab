/* ==========================================================================
   sci-3-3.js — 單元 3-3：基本電路與歐姆定律
   自由電子能量背包動畫 + 燈泡前後安培計讀數完全相等 + 並聯過載保險絲熔斷 + 串並聯亮度對決 + 關鍵字雷達
   ========================================================================== */
(function (global) {
  'use strict';

  var UNIT_ID = 'SCI_9_3_3';

  function mount(container) {
    return global.JuniorSolverUI.renderUnitShell(container, {
      unitId: UNIT_ID,
      badgeText: '🔬 九年級自然理化｜單元 3-3',
      title: '基本電路、歐姆定律與電功率',
      subtitle: '透過「自由電子背能量包」動畫證明電流不被吃掉，體驗並聯過載跳電與亮度比較公式',
      goldenRule: '電流不被消耗（燈泡吃的是能量）；串聯同電流分電壓、並聯同電壓分電流！',
      hints: [
        '導線裡面原本就塞滿了銅原子的自由電子！電池不是「生出電子」，而是像抽水馬達一樣推大家繞圈並幫電子背上「能量包（電壓）」。',
        '比較燈泡亮度看功率 P：串聯時電流 I 相同，用 P = I²R（電阻大較亮）；並聯時電壓 V 相同，用 P = V²/R（電阻小較亮）！'
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
        '<div style="font-size:0.84rem;color:#0d9488;font-weight:700;margin-bottom:6px;">STAGE 1｜衝突提問（破解電學頭號迷思）</div>' +
        '<p class="engage-question">⚡ 把一顆燈泡接在電池上讓它持續發亮。請問「流進燈泡前」的導線電流，跟「穿過燈泡流回電池負極後」的導線電流，哪一邊比較大？另外，延長線並聯插滿高功率吹風機為什麼容易跳電走火？</p>' +
        '<div class="prediction-grid">' +
          '<button class="pred-btn" data-c="eaten">A. 燈泡把一部分電流吃掉發光了，所以出來後的電流會變小</button>' +
          '<button class="pred-btn" data-c="equal">B. 進出燈泡電流完全一樣大（吃掉的是電能，不是電子）！並聯越多通道讓總電流暴增！</button>' +
          '<button class="pred-btn" data-c="more">C. 並聯電器越多總電阻越大，所以總電流反而會變小</button>' +
        '</div>' +
        '<div id="s33-eng-msg"></div>' +
        '<button id="s33-to-exp" class="btn-primary hidden" style="margin-top:12px;">進入階段 ②：觀察自由電子能量背包與並聯過載 →</button>' +
      '</div>';

    var msg = bodyEl.querySelector('#s33-eng-msg');
    var nextBtn = bodyEl.querySelector('#s33-to-exp');
    bodyEl.querySelectorAll('.pred-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        bodyEl.querySelectorAll('.pred-btn').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        if (btn.getAttribute('data-c') === 'equal') {
          msg.innerHTML = '<div class="counterexample-box success">✔ 觀念滿分！電流不會被消耗，燈泡消耗的是電子身上的「電能」；而並聯像加開收銀通道，會讓總電流暴衝！</div>';
          shell.markStageDone('ENGAGE', 25);
        } else {
          msg.innerHTML = '<div class="counterexample-box error">🤔 超過七成學生都會以為電流被燈泡吃掉，或以為並聯電器越多總電阻越大！進實驗室親眼看電子怎麼跑！</div>';
          shell.markStageDone('ENGAGE', 15);
        }
        nextBtn.classList.remove('hidden');
      });
    });
    nextBtn.addEventListener('click', function () { shell.goToStage('EXPLORE'); });
  }

  function renderExplore(bodyEl, shell) {
    var circuitMode = 'series'; // 'series' | 'parallel'
    var voltage = 12;
    var r1 = 4;
    var r2 = 8;
    var parallelBranches = 2; // 1~4 (並聯支路數，每支路固定 4Ω 測試過載跳電)
    var seenSeries = true;
    var seenOverload = false;
    var fuseLimit = 10; // 最大安全總電流 10A
    var tPhase = 0;
    var rafId = null;

    bodyEl.innerHTML =
      '<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">' +
        '<button id="s33-tab-ser" class="btn-light active">模式 A：串聯雙燈泡（電流不滅＋能量包釋放）</button>' +
        '<button id="s33-tab-par" class="btn-light">模式 B：延長線並聯測試（多開通道總電流暴增跳電！）</button>' +
      '</div>' +
      '<div class="dual-view-grid">' +
        '<div class="canvas-panel">' +
          '<div class="panel-title"><span id="s33-title">⚡ 自由電子能量背包模擬器</span><small id="s33-fuse-pill" class="badge-status status-mastered">安全運行中</small></div>' +
          '<canvas id="s33-canvas" class="sim-canvas"></canvas>' +
          '<div id="s33-controls" class="controls-bar"></div>' +
        '</div>' +
        '<div class="logic-panel">' +
          '<div class="panel-title"><span>📟 歐姆定律與電表讀數</span><span id="s33-exp-badge" class="badge-status status-inprogress">試著在模式 B 觸發一次過載</span></div>' +
          '<div id="s33-readout" style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:14px;font-size:0.92rem;"></div>' +
          '<button id="s33-to-exp" class="btn-primary hidden" style="margin-top:12px;">完成探索！前往階段 ③ 總結亮暗公式 →</button>' +
        '</div>' +
      '</div>';

    var canvas = bodyEl.querySelector('#s33-canvas');
    var setup = global.JuniorSolverUI.setupCanvas(canvas, 540, 340);
    var ctx = setup.ctx;
    var controlsEl = bodyEl.querySelector('#s33-controls');
    var readoutEl = bodyEl.querySelector('#s33-readout');
    var fusePill = bodyEl.querySelector('#s33-fuse-pill');
    var badgeEl = bodyEl.querySelector('#s33-exp-badge');
    var nextBtn = bodyEl.querySelector('#s33-to-exp');
    var tabSer = bodyEl.querySelector('#s33-tab-ser');
    var tabPar = bodyEl.querySelector('#s33-tab-par');

    function checkDone() {
      if (seenSeries && seenOverload) {
        badgeEl.className = 'badge-status status-mastered';
        badgeEl.textContent = '✔ 雙模式已完成';
        nextBtn.classList.remove('hidden');
        shell.markStageDone('EXPLORE', 35);
      }
    }

    function compute() {
      if (circuitMode === 'series') {
        var rTot = r1 + r2;
        var current = voltage / rTot;
        var p1 = current * current * r1;
        var p2 = current * current * r2;
        return {
          overloaded: false,
          current: current,
          rTot: rTot,
          p1: p1,
          p2: p2,
          v1: current * r1,
          v2: current * r2
        };
      } else {
        // 每條並聯支路電阻 = 4 Ω
        var iBranch = voltage / 4;
        var iTotal = iBranch * parallelBranches;
        var rEq = 4 / parallelBranches;
        var overloaded = iTotal > fuseLimit;
        if (overloaded) seenOverload = true;
        return {
          overloaded: overloaded,
          iBranch: iBranch,
          iTotal: iTotal,
          rEq: rEq
        };
      }
    }

    function renderControlsAndReadout() {
      var st = compute();
      if (circuitMode === 'series') {
        controlsEl.innerHTML =
          '<div class="slider-group"><label>電池電壓 V：<strong>' + voltage + ' V</strong></label><input id="s33-v" type="range" min="6" max="24" step="6" value="' + voltage + '"></div>' +
          '<div class="slider-group"><label>左燈泡 R₁：<strong>' + r1 + ' Ω</strong></label><input id="s33-r1" type="range" min="2" max="10" step="2" value="' + r1 + '"></div>' +
          '<div class="slider-group"><label>右燈泡 R₂：<strong>' + r2 + ' Ω</strong></label><input id="s33-r2" type="range" min="2" max="10" step="2" value="' + r2 + '"></div>';

        controlsEl.querySelector('#s33-v').addEventListener('input', function (e) { voltage = parseInt(e.target.value, 10); renderControlsAndReadout(); });
        controlsEl.querySelector('#s33-r1').addEventListener('input', function (e) { r1 = parseInt(e.target.value, 10); renderControlsAndReadout(); });
        controlsEl.querySelector('#s33-r2').addEventListener('input', function (e) { r2 = parseInt(e.target.value, 10); renderControlsAndReadout(); });

        fusePill.className = 'badge-status status-mastered';
        fusePill.textContent = '電流處處相等：' + st.current.toFixed(2) + ' A';

        readoutEl.innerHTML =
          '<div style="background:#f1f5f9;padding:10px;border-radius:8px;line-height:1.8;">' +
            '🔌 總電阻 R總 = R₁ + R₂ = <strong>' + st.rTot + ' Ω</strong><br>' +
            '⚡ 電流 I = V ÷ R總 = <strong>' + st.current.toFixed(2) + ' A</strong>（進 R₁、進 R₂、回負極<strong>三顆安培計完全一樣</strong>！）<br>' +
            '💡 左燈功率 P₁ = I²R₁ = <strong>' + st.p1.toFixed(1) + ' W</strong>（分得 ' + st.v1.toFixed(1) + ' V）<br>' +
            '💡 右燈功率 P₂ = I²R₂ = <strong>' + st.p2.toFixed(1) + ' W</strong>（分得 ' + st.v2.toFixed(1) + ' V）' +
          '</div>' +
          '<div style="margin-top:8px;font-size:0.86rem;color:#0f766e;">👀 看動畫！黃色能量包在電池處背上、過燈泡時發光變小，但藍色電子本身的速度在整圈軌道上永遠一樣快！</div>';
      } else {
        controlsEl.innerHTML =
          '<div class="slider-group"><label>電源電壓 V：<strong>' + voltage + ' V</strong>（每條支路皆 4 Ω）</label><input id="s33-vp" type="range" min="6" max="24" step="6" value="' + voltage + '"></div>' +
          '<div class="slider-group"><label>並聯電器數量（條數）：<strong>' + parallelBranches + ' 台</strong></label><input id="s33-br" type="range" min="1" max="4" step="1" value="' + parallelBranches + '"></div>';

        controlsEl.querySelector('#s33-vp').addEventListener('input', function (e) { voltage = parseInt(e.target.value, 10); renderControlsAndReadout(); checkDone(); });
        controlsEl.querySelector('#s33-br').addEventListener('input', function (e) { parallelBranches = parseInt(e.target.value, 10); renderControlsAndReadout(); checkDone(); });

        if (st.overloaded) {
          fusePill.className = 'badge-status status-inprogress';
          fusePill.style.background = '#fee2e2';
          fusePill.style.color = '#b91c1c';
          fusePill.textContent = '🔥 總電流 ' + st.iTotal.toFixed(1) + ' A > 10 A 保險絲熔斷！';
        } else {
          fusePill.className = 'badge-status status-mastered';
          fusePill.style.background = '';
          fusePill.style.color = '';
          fusePill.textContent = '總電流 ' + st.iTotal.toFixed(1) + ' A（上限 10 A）';
        }

        readoutEl.innerHTML =
          '<div style="background:#f1f5f9;padding:10px;border-radius:8px;line-height:1.8;">' +
            '🔀 並聯支路數 = <strong>' + parallelBranches + ' 條</strong>（等效電阻 R總 = ' + st.rEq.toFixed(2) + ' Ω，反而變小！）<br>' +
            '💧 每條支路各自流過 = ' + st.iBranch.toFixed(1) + ' A（電壓皆為 ' + voltage + ' V）<br>' +
            '⚡ <strong>主幹道總電流 I總 = ' + st.iTotal.toFixed(1) + ' A</strong>' +
          '</div>' +
          (st.overloaded
            ? '<div class="counterexample-box error" style="margin-top:8px;">💥 <strong>過載跳電！</strong>多開平行通道會讓等效總電阻下降、總電流暴衝超過 10 A 保險絲極限，所以保險絲融斷切斷電流保護電線！</div>'
            : '<div style="margin-top:8px;font-size:0.86rem;color:#b45309;">👆 試著調高電壓或插到 4 台電器（超過 10 A），觀察保險絲跳電保護！</div>');
      }
      checkDone();
    }

    function draw() {
      var st = compute();
      var speed = circuitMode === 'series' ? Math.min(0.014, st.current * 0.0025) : (st.overloaded ? 0 : Math.min(0.014, st.iTotal * 0.0015));
      tPhase = (tPhase + speed) % 1;

      ctx.clearRect(0, 0, setup.width, setup.height);

      if (circuitMode === 'series') {
        // 矩形主迴路：左下(85,270) -> 左上(85,75) -> 右上(455,75) -> 右下(455,270)
        var pts = [{x:85,y:270},{x:85,y:75},{x:455,y:75},{x:455,y:270},{x:85,y:270}];
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();

        // 畫電池（下方中央）
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(235, 250, 70, 40);
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔋 ' + voltage + 'V', 270, 275);

        // 畫兩個燈泡（上方 y=75）
        function drawBulb(bx, by, rVal, pVal, label) {
          var glow = Math.min(1, pVal / 40);
          ctx.fillStyle = 'rgba(250, 204, 21, ' + (0.15 + glow * 0.85) + ')';
          ctx.beginPath(); ctx.arc(bx, by, 24, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText(label + ' (' + rVal + 'Ω)', bx, by - 32);
          ctx.fillText(pVal.toFixed(1) + 'W', bx, by + 4);
        }

        drawBulb(195, 75, r1, st.p1, 'R₁');
        drawBulb(345, 75, r2, st.p2, 'R₂');

        // 畫三個安培計
        function drawAmmeter(ax, ay, txt) {
          ctx.fillStyle = '#fff';
          ctx.strokeStyle = '#2563eb';
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(ax, ay, 18, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#1d4ed8';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText(txt, ax, ay + 4);
        }
        drawAmmeter(85, 175, st.current.toFixed(1) + 'A');
        drawAmmeter(270, 75, st.current.toFixed(1) + 'A');
        drawAmmeter(455, 175, st.current.toFixed(1) + 'A');

        // 沿著迴路畫 16 顆「電子＋黃色能量書包」
        var totalLen = 2 * (370 + 195);
        for (var e = 0; e < 16; e++) {
          var dist = ((e / 16 + tPhase) % 1) * totalLen;
          var ex, ey, energyFactor;
          if (dist < 195) { // 左邊往上 (85,270 -> 85,75)
            ex = 85; ey = 270 - dist; energyFactor = 1.0;
          } else if (dist < 195 + 370) { // 上方往右 (85,75 -> 455,75)
            var topD = dist - 195;
            ex = 85 + topD; ey = 75;
            if (ex < 195) energyFactor = 1.0;
            else if (ex < 345) energyFactor = Math.max(0.15, 1 - r1 / (r1 + r2));
            else energyFactor = 0.08;
          } else if (dist < 195 + 370 + 195) { // 右邊往下
            ex = 455; ey = 75 + (dist - 195 - 370); energyFactor = 0.08;
          } else { // 下方回電池
            ex = 455 - (dist - 195 - 370 - 195); ey = 270;
            energyFactor = ex < 270 ? 1.0 : 0.08;
          }

          // 黃色能量背包（過燈泡變小，過電池重新充飽）
          if (energyFactor > 0.12) {
            ctx.fillStyle = 'rgba(250, 204, 21, 0.85)';
            ctx.beginPath(); ctx.arc(ex, ey, 6 + energyFactor * 6, 0, Math.PI * 2); ctx.fill();
          }
          // 藍色電子本體（大小速度全場恆定！）
          ctx.fillStyle = '#2563eb';
          ctx.beginPath(); ctx.arc(ex, ey, 4.5, 0, Math.PI * 2); ctx.fill();
        }
      } else {
        // 並聯多分支圖
        var mainColor = st.overloaded ? '#dc2626' : '#334155';
        ctx.strokeStyle = mainColor;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(95, 290); ctx.lineTo(95, 45);
        ctx.moveTo(445, 290); ctx.lineTo(445, 45);
        ctx.moveTo(95, 290); ctx.lineTo(445, 290);
        ctx.stroke();

        // 電池與保險絲
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(230, 270, 80, 38);
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🔋 ' + voltage + 'V', 270, 294);

        // 主幹道保險絲（在左側 x=95, y=240）
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = st.overloaded ? '#dc2626' : '#16a34a';
        ctx.lineWidth = 2.5;
        ctx.fillRect(73, 225, 44, 24);
        ctx.strokeRect(73, 225, 44, 24);
        ctx.fillStyle = st.overloaded ? '#dc2626' : '#15803d';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText(st.overloaded ? '💥 斷開' : '保險絲', 95, 241);

        for (var b = 0; b < parallelBranches; b++) {
          var by = 60 + b * 48;
          ctx.strokeStyle = st.overloaded ? '#94a3b8' : '#2563eb';
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(95, by); ctx.lineTo(445, by); ctx.stroke();

          ctx.fillStyle = st.overloaded ? '#e2e8f0' : 'rgba(250, 204, 21, 0.85)';
          ctx.beginPath(); ctx.arc(270, by, 15, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2; ctx.stroke();
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 10px sans-serif';
          ctx.fillText('4Ω', 270, by + 4);

          if (!st.overloaded) {
            for (var k = 0; k < 4; k++) {
              var bx = 110 + (((k / 4 + tPhase * 1.4) % 1) * 320);
              ctx.fillStyle = '#2563eb';
              ctx.beginPath(); ctx.arc(bx, by, 4, 0, Math.PI * 2); ctx.fill();
            }
          }
        }
      }

      rafId = global.requestAnimationFrame(draw);
    }

    tabSer.addEventListener('click', function () {
      circuitMode = 'series'; seenSeries = true;
      tabSer.classList.add('active'); tabPar.classList.remove('active');
      renderControlsAndReadout();
    });
    tabPar.addEventListener('click', function () {
      circuitMode = 'parallel';
      tabPar.classList.add('active'); tabSer.classList.remove('active');
      renderControlsAndReadout();
    });
    nextBtn.addEventListener('click', function () { shell.goToStage('EXPLAIN'); });

    renderControlsAndReadout();
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
          '<h3 style="margin-top:0;">⚡ 核心原理：水流類比與串並聯本質</h3>' +
          '<ol style="padding-left:20px;margin:0;line-height:1.85;">' +
            '<li><strong>歐姆定律 V = IR：</strong>電壓是抽水馬達推力、電阻是水管窄度、電流是水流量。</li>' +
            '<li><strong>電子不滅：</strong>燈泡前後電流一定相等！並聯多開分流通道反而讓總電阻變小、總電流暴衝。</li>' +
          '</ol>' +
        '</div>' +
        '<div class="faq-card">' +
          '<h3 style="margin-top:0;">💡 學生高頻疑問 × 會考秒殺切換公式</h3>' +
          '<div class="faq-item">' +
            '<div class="faq-q">疑問 1：「比較兩個不同電阻的燈泡誰比較亮，公式總是代錯！」</div>' +
            '<div class="faq-a"><strong>最簡單解法：</strong>看接法選「相同變數」的功率公式！<br>• <strong>串聯（電流 I 相同）：</strong>用 <span class="math-expr">P = I²R</span> → 電阻 R 越<strong>大</strong>越亮！<br>• <strong>並聯（電壓 V 相同）：</strong>用 <span class="math-expr">P = V² ÷ R</span> → 電阻 R 越<strong>小</strong>越亮！</div>' +
          '</div>' +
          '<div class="faq-item">' +
            '<div class="faq-q">疑問 2：「複雜電路圖看不出哪顆被短路怎麼辦？」</div>' +
            '<div class="faq-a"><strong>最簡單解法：</strong>標字母法！凡純導線相連都標同一個字母 A；只要某顆燈泡兩端標到「同一個字母」，就代表被純導線跨接短路完全不亮！</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:18px;text-align:right;">' +
        '<button id="s33-to-eval" class="btn-primary">前往階段 ④：燈泡亮度陷阱＆關鍵字掃描雷達 →</button>' +
      '</div>';

    bodyEl.querySelector('#s33-to-eval').addEventListener('click', function () {
      shell.goToStage('EVALUATE');
    });
  }

  function renderEvaluate(bodyEl, shell) {
    var quizDone = false;
    var radarDone = false;

    bodyEl.innerHTML =
      '<div class="canvas-panel" style="margin-bottom:18px;">' +
        '<div class="panel-title"><span>⚡ 迷思亮度對決：把 2 Ω 的甲燈泡與 4 Ω 的乙燈泡改成「並聯」接在 12 V 電池上，哪一顆比較亮？</span></div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">' +
          '<button class="btn-light s33-ans" data-a="b">A. 乙燈泡 (4 Ω) 比較亮（因為電阻較大）</button>' +
          '<button class="btn-light s33-ans" data-a="same">B. 一樣亮</button>' +
          '<button class="btn-light s33-ans" data-a="a">C. 甲燈泡 (2 Ω) 比較亮（並聯同電壓看 P = V²/R）</button>' +
        '</div>' +
        '<div id="s33-eval-fb"></div>' +
      '</div>' +
      '<div id="s33-radar-mount"></div>';

    var fb = bodyEl.querySelector('#s33-eval-fb');
    function checkAll() {
      if (quizDone && radarDone) {
        shell.markStageDone('EVALUATE', 40);
        shell.unlockBadge('MYTH_BUSTER_CIRCUIT', 80);
      }
    }

    bodyEl.querySelectorAll('.s33-ans').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var a = btn.getAttribute('data-a');
        global.JuniorStore.recordAttempt(UNIT_ID);
        if (a !== 'a') {
          global.JuniorStore.recordMisconception(UNIT_ID, 'MIS_PARALLEL_BRIGHTNESS_R', '在並聯電路誤用串聯的 P = I²R 思維，以為電阻大較亮');
          fb.innerHTML = '<div class="counterexample-box error">🚨 <strong>實測打臉：</strong>在並聯裡兩顆燈泡都拿到 12V！算功率：<br>甲 (2Ω)：P = 12² ÷ 2 = <strong>72 W</strong>（超亮！）<br>乙 (4Ω)：P = 12² ÷ 4 = <strong>36 W</strong>。<br>「電阻大比較亮」只在「串聯（同電流）」時才對！</div>';
        } else {
          quizDone = true;
          global.JuniorStore.resolveMisconception(UNIT_ID, 'MIS_PARALLEL_BRIGHTNESS_R');
          fb.innerHTML = '<div class="counterexample-box success">✔ <strong>精準判斷！</strong>並聯電壓相同時，電阻越小的通道流過越多電流，功率 72W 大勝 36W！</div>';
          checkAll();
        }
      });
    });

    global.JuniorSolverUI.mountKeywordRadar(bodyEl.querySelector('#s33-radar-mount'), {
      unitId: UNIT_ID,
      tacticCode: 'CIRCUIT_KEYWORD_RADAR',
      title: '會考電路與家用電器題組審題關鍵字（找出 3 個關鍵詞）',
      tokens: [
        { text: '小華家中有一條延長線連接 ', plain: true },
        { text: '兩台高功率電暖器', isTrapKey: false },
        { text: '，這些電器在插座上屬於 ', plain: true },
        { text: '並聯', isTrapKey: true, note: '看到「並聯」，立刻鎖定兩端電壓 V 皆相等（110V），且總電流會相加暴增！' },
        { text: ' 接法。若 ', plain: true },
        { text: '兩者同時開啟', isTrapKey: false },
        { text: ' 且 ', plain: true },
        { text: '導線電阻不可忽略', isTrapKey: true, note: '代表延長線本身會消耗電能發熱！它與電器串聯，用 P = I²R 計算發熱量！' },
        { text: '，而當電源提供 ', plain: true },
        { text: '定電壓 110 V', isTrapKey: true, note: '定電壓條件下，計算各電器單獨消耗功率務必使用 P = V² ÷ R！' },
        { text: ' 時，請判斷總電流變化。', plain: true }
      ],
      unlockedHtml: '🏆 <strong>審題完全體解鎖！</strong>你抓出了「並聯（總電流相加）」「導線電阻不可忽略（I²R 發熱危險）」「定電壓（V²/R）」三大會考命題核心！',
      onComplete: function () {
        radarDone = true;
        checkAll();
      }
    });

    return null;
  }

  global.JuniorUnits[UNIT_ID] = { mount: mount };
})(window);
