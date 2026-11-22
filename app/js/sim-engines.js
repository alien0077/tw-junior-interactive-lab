/* ==========================================================================
   sim-engines.js — 全科互動模擬引擎庫 & 統一四階段單元產生器
   提供 37 個對應 108 課綱單元的專屬 Canvas 互動視覺引擎（零外部依賴）
   ========================================================================== */
(function (global) {
  'use strict';

  var RENDERERS = {};

  /**
   * 統一四階段單元工廠：將每個單元的教學規格（衝突、模擬器、原理、迷思反例、會考技巧）
   * 轉化為完整可互動的四階段單元模組。
   */
  function createUnitFromSpec(spec) {
    return {
      mount: function (container) {
        return global.JuniorSolverUI.renderUnitShell(container, {
          unitId: spec.id,
          badgeText: spec.badgeText,
          title: spec.title,
          subtitle: spec.subtitle,
          goldenRule: spec.goldenRule,
          hints: spec.hints,
          onRenderStage: function (stageKey, bodyEl, shell) {
            if (stageKey === 'ENGAGE') return renderEngage(spec, bodyEl, shell);
            if (stageKey === 'EXPLORE') return renderExplore(spec, bodyEl, shell);
            if (stageKey === 'EXPLAIN') return renderExplain(spec, bodyEl, shell);
            if (stageKey === 'EVALUATE') return renderEvaluate(spec, bodyEl, shell);
          }
        });
      }
    };
  }

  function renderEngage(spec, bodyEl, shell) {
    var btnsHtml = spec.engage.options.map(function (opt, idx) {
      return '<button class="pred-btn" data-idx="' + idx + '">' + opt.label + '</button>';
    }).join('');

    bodyEl.innerHTML =
      '<div class="engage-card">' +
        '<div style="font-size:0.84rem;color:#2563eb;font-weight:700;margin-bottom:6px;">STAGE 1｜情境衝突提問</div>' +
        '<p class="engage-question">' + spec.engage.question + '</p>' +
        '<div class="prediction-grid">' + btnsHtml + '</div>' +
        '<div id="eng-fb"></div>' +
        '<button id="eng-next" class="btn-primary hidden" style="margin-top:12px;">進入階段 ②：雙視角動手探索實驗室 →</button>' +
      '</div>';

    var fb = bodyEl.querySelector('#eng-fb');
    var nextBtn = bodyEl.querySelector('#eng-next');
    var btns = bodyEl.querySelectorAll('.pred-btn');

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        var idx = parseInt(btn.getAttribute('data-idx'), 10);
        var opt = spec.engage.options[idx];
        if (opt.correct) {
          fb.innerHTML = '<div class="counterexample-box success">✔ ' + opt.feedback + '</div>';
          shell.markStageDone('ENGAGE', 25);
        } else {
          fb.innerHTML = '<div class="counterexample-box error">🤔 ' + opt.feedback + '</div>';
          shell.markStageDone('ENGAGE', 15);
        }
        nextBtn.classList.remove('hidden');
      });
    });

    nextBtn.addEventListener('click', function () {
      shell.goToStage('EXPLORE');
    });
    return null;
  }

  function renderExplore(spec, bodyEl, shell) {
    var interactCount = 0;
    bodyEl.innerHTML =
      '<div class="dual-view-grid">' +
        '<div class="canvas-panel">' +
          '<div class="panel-title"><span>' + spec.exploreTitle + '</span><small style="color:#64748b;">雙視角即時連動</small></div>' +
          '<canvas id="sim-canvas" class="sim-canvas"></canvas>' +
          '<div id="sim-controls" class="controls-bar"></div>' +
        '</div>' +
        '<div class="logic-panel">' +
          '<div class="panel-title"><span>📊 即時公式與因果判讀</span><span id="sim-exp-badge" class="badge-status status-inprogress">請動手操作滑桿／開關</span></div>' +
          '<div id="sim-readout" style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:14px;font-size:0.92rem;line-height:1.75;"></div>' +
          '<button id="sim-to-explain" class="btn-primary hidden" style="margin-top:12px;">金句已解鎖！前往階段 ③ 原理與疑問詳解 →</button>' +
        '</div>' +
      '</div>';

    var canvas = bodyEl.querySelector('#sim-canvas');
    var setup = global.JuniorSolverUI.setupCanvas(canvas, 540, 320);
    var controlsEl = bodyEl.querySelector('#sim-controls');
    var readoutEl = bodyEl.querySelector('#sim-readout');
    var badgeEl = bodyEl.querySelector('#sim-exp-badge');
    var nextBtn = bodyEl.querySelector('#sim-to-explain');

    function onInteract() {
      interactCount += 1;
      global.JuniorStore.touchInteraction(spec.id);
      if (interactCount >= 2) {
        badgeEl.className = 'badge-status status-mastered';
        badgeEl.textContent = '✔ 探索已完成';
        nextBtn.classList.remove('hidden');
        shell.markStageDone('EXPLORE', 35);
      } else {
        badgeEl.textContent = '探索進度 1/2（再調整一次即解鎖）';
      }
    }

    nextBtn.addEventListener('click', function () {
      shell.goToStage('EXPLAIN');
    });

    var renderer = RENDERERS[spec.simType] || RENDERERS.generic_bar;
    var cleanup = renderer({
      ctx: setup.ctx,
      width: setup.width,
      height: setup.height,
      controlsEl: controlsEl,
      readoutEl: readoutEl,
      config: spec.simConfig || {},
      onInteract: onInteract
    });

    return typeof cleanup === 'function' ? cleanup : null;
  }

  function renderExplain(spec, bodyEl, shell) {
    shell.markStageDone('EXPLAIN', 25);
    var pHtml = spec.principles.map(function (p) {
      return '<li>' + p + '</li>';
    }).join('');
    var faqHtml = spec.faqs.map(function (f) {
      return '<div class="faq-item"><div class="faq-q">' + f.q + '</div><div class="faq-a"><strong>最簡單解法：</strong>' + f.a + '</div></div>';
    }).join('');

    bodyEl.innerHTML =
      '<div class="explain-grid">' +
        '<div class="principle-card">' +
          '<h3 style="margin-top:0;">📐 核心原理：為什麼會這樣？</h3>' +
          '<ol style="padding-left:20px;margin:0;line-height:1.85;">' + pHtml + '</ol>' +
        '</div>' +
        '<div class="faq-card">' +
          '<h3 style="margin-top:0;">💡 學生常見疑問 × 最簡單解法</h3>' +
          faqHtml +
        '</div>' +
      '</div>' +
      '<div style="margin-top:18px;text-align:right;">' +
        '<button id="exp-to-eval" class="btn-primary">前往階段 ④：迷思反例打臉與會考破題 →</button>' +
      '</div>';

    bodyEl.querySelector('#exp-to-eval').addEventListener('click', function () {
      shell.goToStage('EVALUATE');
    });
    return null;
  }

  function renderEvaluate(spec, bodyEl, shell) {
    var trapDone = false;
    var solverDone = !spec.tactic && !spec.keywordRadar;

    var optHtml = spec.trap.options.map(function (opt, idx) {
      return '<button class="btn-light trap-opt" data-idx="' + idx + '">' + opt.label + '</button>';
    }).join('');

    bodyEl.innerHTML =
      '<div class="canvas-panel" style="margin-bottom:18px;">' +
        '<div class="panel-title"><span>⚡ 迷思陷阱測試：' + spec.trap.question + '</span></div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">' + optHtml + '</div>' +
        '<div id="trap-fb"></div>' +
      '</div>' +
      '<div id="solver-mount"></div>';

    var trapFb = bodyEl.querySelector('#trap-fb');
    function checkAll() {
      if (trapDone && solverDone) {
        shell.markStageDone('EVALUATE', 40);
        if (spec.badgeId) {
          shell.unlockBadge(spec.badgeId, 80);
        }
      }
    }

    bodyEl.querySelectorAll('.trap-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-idx'), 10);
        var opt = spec.trap.options[idx];
        global.JuniorStore.recordAttempt(spec.id);
        if (opt.correct) {
          trapDone = true;
          btn.classList.add('active');
          global.JuniorStore.resolveMisconception(spec.id, spec.trap.misconceptionCode);
          trapFb.innerHTML = '<div class="counterexample-box success">✔ <strong>精準破除迷思！</strong>' + opt.feedback + '</div>';
          checkAll();
        } else {
          global.JuniorStore.recordMisconception(spec.id, spec.trap.misconceptionCode, spec.trap.misconceptionDesc);
          trapFb.innerHTML = '<div class="counterexample-box error">🚨 <strong>反例打臉：</strong>' + opt.feedback + '</div>';
        }
      });
    });

    var mountEl = bodyEl.querySelector('#solver-mount');
    if (spec.tactic) {
      global.JuniorSolverUI.mountTacticAssembler(mountEl, {
        unitId: spec.id,
        tacticCode: spec.tactic.code,
        title: spec.tactic.title,
        problemText: spec.tactic.problemText,
        slots: spec.tactic.slots,
        chips: spec.tactic.chips,
        finalSummaryHtml: spec.tactic.summary,
        onComplete: function () { solverDone = true; checkAll(); }
      });
    } else if (spec.keywordRadar) {
      global.JuniorSolverUI.mountKeywordRadar(mountEl, {
        unitId: spec.id,
        tacticCode: spec.keywordRadar.code,
        title: spec.keywordRadar.title,
        tokens: spec.keywordRadar.tokens,
        unlockedHtml: spec.keywordRadar.unlockedHtml,
        onComplete: function () { solverDone = true; checkAll(); }
      });
    }
    return null;
  }

  /* ========================================================================
     數學科互動視覺引擎 (15 個)
     ======================================================================== */

  // 1. 分數等分通分與包含除
  RENDERERS.m_frac_pizza = function (p) {
    var parts = 4; // 2, 4, 6, 8
    var divisor = 4; // 1/4 湯匙去舀 3/4 彩帶
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      // 左側：圓餅圖證明 1/2 = (parts/2)/parts
      var cx = 145, cy = 145, r = 90;
      for (var i = 0; i < parts; i++) {
        var a0 = -Math.PI / 2 + (i * 2 * Math.PI) / parts;
        var a1 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / parts;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r, a0, a1);
        ctx.closePath();
        ctx.fillStyle = i < parts / 2 ? '#f59e0b' : '#f1f5f9';
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('塗色面積恆等：1/2 = ' + (parts / 2) + '/' + parts, cx, 265);

      // 右側：包含除彩帶 3/4 ÷ (1/divisor)
      var rx = 285, ry = 100, fullW = 220;
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(rx, ry, fullW, 38);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(rx, ry, fullW * 0.75, 38);
      ctx.strokeStyle = '#1e293b';
      ctx.strokeRect(rx, ry, fullW, 38);
      ctx.fillStyle = '#fff';
      ctx.fillText('彩帶長 3/4', rx + fullW * 0.375, ry + 24);

      var stepW = fullW / divisor;
      var count = (0.75 * divisor);
      for (var k = 0; k < Math.ceil(count); k++) {
        var sx = rx + k * stepW;
        var drawW = Math.min(stepW, rx + fullW * 0.75 - sx);
        if (drawW > 0) {
          ctx.fillStyle = k % 2 === 0 ? '#10b981' : '#059669';
          ctx.fillRect(sx, ry + 58, drawW - 2, 30);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('1/' + divisor, sx + drawW / 2, ry + 77);
        }
      }
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('3/4 ÷ (1/' + divisor + ') = 3/4 × ' + divisor + ' = ' + count.toFixed(2).replace(/\.00$/, '') + ' 份', rx + fullW / 2, ry + 125);
    }

    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>披薩切分總片數（擴分）：<strong id="mfp-p">4</strong></label><input id="mfp-s1" type="range" min="2" max="12" step="2" value="4"></div>' +
      '<div class="slider-group"><label>每次切分湯匙大小：<strong id="mfp-d">1/4</strong></label><input id="mfp-s2" type="range" min="2" max="8" step="1" value="4"></div>';

    function update() {
      p.controlsEl.querySelector('#mfp-p').textContent = parts;
      p.controlsEl.querySelector('#mfp-d').textContent = '1/' + divisor;
      var ans = (0.75 * divisor).toFixed(2).replace(/\.00$/, '');
      p.readoutEl.innerHTML =
        '🍕 <strong>擴分約分不變質：</strong>披薩總片數變多，你拿到的片數同倍率變多，總面積永遠是 <span class="math-expr">' + (parts / 2) + '/' + parts + ' = 1/2</span>。<br><br>' +
        '📏 <strong>為何除以分數＝乘倒數？</strong>3/4 公尺彩帶每 1/' + divisor + ' 公尺剪一段，因為每 1 公尺能剪出 ' + divisor + ' 段，所以總段數就是 <span class="math-expr">3/4 × ' + divisor + ' = ' + ans + '</span> 段（越小的湯匙舀越多次，所以越除越大！）。';
      draw();
    }
    p.controlsEl.querySelector('#mfp-s1').addEventListener('input', function (e) { parts = parseInt(e.target.value, 10); p.onInteract(); update(); });
    p.controlsEl.querySelector('#mfp-s2').addEventListener('input', function (e) { divisor = parseInt(e.target.value, 10); p.onInteract(); update(); });
    update();
  };

  // 2. 二元一次聯立方程式（交點 / 平行 / 重合）
  RENDERERS.m_linear_sys = function (p) {
    var m2 = -1; // 線1固定 y = x + 1；線2為 y = m2*x + b2
    var b2 = 5;
    function toPx(x, y) { return { x: 270 + x * 36, y: 205 - y * 30 }; }
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var o = toPx(0, 0);
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1;
      for (var g = -6; g <= 6; g++) {
        ctx.beginPath(); ctx.moveTo(toPx(g, -4).x, 15); ctx.lineTo(toPx(g, 6).x, 305); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(20, toPx(0, g).y); ctx.lineTo(520, toPx(0, g).y); ctx.stroke();
      }
      ctx.strokeStyle = '#475569'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(20, o.y); ctx.lineTo(520, o.y); ctx.moveTo(o.x, 15); ctx.lineTo(o.x, 305); ctx.stroke();

      // 紅線：y = x + 1
      ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3;
      var a1 = toPx(-6, -5), a2 = toPx(6, 7);
      ctx.beginPath(); ctx.moveTo(a1.x, a1.y); ctx.lineTo(a2.x, a2.y); ctx.stroke();

      // 藍線：y = m2*x + b2
      ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 3;
      var c1 = toPx(-6, m2 * -6 + b2), c2 = toPx(6, m2 * 6 + b2);
      ctx.beginPath(); ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.stroke();

      if (Math.abs(1 - m2) > 0.01) {
        var ix = (b2 - 1) / (1 - m2);
        var iy = ix + 1;
        var ip = toPx(ix, iy);
        ctx.fillStyle = '#16a34a';
        ctx.beginPath(); ctx.arc(ip.x, ip.y, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('唯一交點 (' + ix.toFixed(1) + ', ' + iy.toFixed(1) + ')', ip.x + 10, ip.y - 6);
      }
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>藍線斜率 m：<strong id="mls-m">-1</strong>（調成 1 變平行！）</label><input id="mls-s1" type="range" min="-2" max="2" step="0.5" value="-1"></div>' +
      '<div class="slider-group"><label>藍線截距 b：<strong id="mls-b">5</strong>（斜率1且b=1重疊！）</label><input id="mls-s2" type="range" min="-2" max="5" step="1" value="5"></div>';

    function update() {
      p.controlsEl.querySelector('#mls-m').textContent = m2;
      p.controlsEl.querySelector('#mls-b').textContent = b2;
      var status;
      if (Math.abs(1 - m2) < 0.01) {
        status = b2 === 1
          ? '<span style="color:#d97706;font-weight:700;">🟡 兩線完全重合 → 無限多組解！</span>'
          : '<span style="color:#dc2626;font-weight:700;">🔴 兩線平行永不相交 → 無解（消去法會出現 0 = ' + (b2 - 1) + ' 矛盾）！</span>';
      } else {
        var ix = (b2 - 1) / (1 - m2);
        var iy = ix + 1;
        status = '<span style="color:#16a34a;font-weight:700;">🟢 恰有一交點 → 唯一解 x = ' + ix.toFixed(1) + ', y = ' + iy.toFixed(1) + '</span>';
      }
      p.readoutEl.innerHTML =
        '紅線：<span class="math-expr">y = x + 1</span><br>' +
        '藍線：<span class="math-expr">y = ' + m2 + 'x + (' + b2 + ')</span><br><br>' + status;
      draw();
    }
    p.controlsEl.querySelector('#mls-s1').addEventListener('input', function (e) { m2 = parseFloat(e.target.value); p.onInteract(); update(); });
    p.controlsEl.querySelector('#mls-s2').addEventListener('input', function (e) { b2 = parseFloat(e.target.value); p.onInteract(); update(); });
    update();
  };

  // 3. 正比 vs 反比 vs 假正比（母子年齡）
  RENDERERS.m_proportion = function (p) {
    var mode = 'direct'; // direct | inverse | fake
    var xVal = 3;
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var ox = 60, oy = 275;
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ox, 25); ctx.lineTo(ox, oy); ctx.lineTo(500, oy); ctx.stroke();

      ctx.strokeStyle = mode === 'direct' ? '#16a34a' : (mode === 'inverse' ? '#2563eb' : '#dc2626');
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (var x = 0.5; x <= 10; x += 0.2) {
        var y = mode === 'direct' ? 2 * x : (mode === 'inverse' ? 24 / x : x + 6);
        var px = ox + x * 40;
        var py = oy - y * 11;
        if (py < 25) continue;
        if (x === 0.5) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();

      var curY = mode === 'direct' ? 2 * xVal : (mode === 'inverse' ? 24 / xVal : xVal + 6);
      var cpx = ox + xVal * 40, cpy = Math.max(30, oy - curY * 11);
      if (mode === 'inverse') {
        ctx.fillStyle = 'rgba(37, 99, 235, 0.16)';
        ctx.fillRect(ox, cpy, cpx - ox, oy - cpy);
      }
      ctx.fillStyle = '#0f172a';
      ctx.beginPath(); ctx.arc(cpx, cpy, 6, 0, Math.PI * 2); ctx.fill();
      ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('(' + xVal + ', ' + curY.toFixed(1) + ')', cpx + 8, cpy - 6);
    }
    p.controlsEl.innerHTML =
      '<div style="width:100%;display:flex;gap:6px;flex-wrap:wrap;">' +
        '<button class="btn-light mp-m active" data-m="direct">真・正比 (y = 2x)</button>' +
        '<button class="btn-light mp-m" data-m="inverse">真・反比 (xy = 24)</button>' +
        '<button class="btn-light mp-m" data-m="fake">⚠️ 假正比 (年齡 y = x + 6)</button>' +
      '</div>' +
      '<div class="slider-group"><label>調整 x 值：<strong id="mp-x">3</strong></label><input id="mp-sx" type="range" min="1" max="8" step="1" value="3"></div>';

    function update() {
      p.controlsEl.querySelector('#mp-x').textContent = xVal;
      var y = mode === 'direct' ? 2 * xVal : (mode === 'inverse' ? 24 / xVal : xVal + 6);
      var desc = mode === 'direct'
        ? '✅ <strong>真・正比：</strong>商固定 y ÷ x = <strong>2</strong>，圖形必通過原點 (0, 0)！'
        : (mode === 'inverse'
          ? '✅ <strong>真・反比：</strong>乘積固定 x × y = <strong>24</strong>（藍色長方形面積永遠固定 24 格！）。'
          : '🚨 <strong>假正比陷阱！</strong>雖然 x 變大 y 也變大，但比值 y ÷ x = ' + (y / xVal).toFixed(2) + ' 一直在變，且沒過原點 (0,0)！');
      p.readoutEl.innerHTML = '目前數值：x = ' + xVal + '，y = ' + y.toFixed(1) + '<br><br>' + desc;
      draw();
    }
    p.controlsEl.querySelectorAll('.mp-m').forEach(function (b) {
      b.addEventListener('click', function () {
        p.controlsEl.querySelectorAll('.mp-m').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        mode = b.getAttribute('data-m');
        p.onInteract(); update();
      });
    });
    p.controlsEl.querySelector('#mp-sx').addEventListener('input', function (e) { xVal = parseInt(e.target.value, 10); p.onInteract(); update(); });
    update();
  };

  // 4. 不等式數線 180° 鏡像翻轉
  RENDERERS.m_ineq_flip = function (p) {
    var shift = 0;
    var flipped = false;
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var y = 165, cx = 270, u = 28;
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(25, y); ctx.lineTo(515, y); ctx.stroke();
      for (var n = -8; n <= 8; n++) {
        var nx = cx + n * u;
        ctx.beginPath(); ctx.moveTo(nx, y - 6); ctx.lineTo(nx, y + 6); ctx.stroke();
        if (n % 2 === 0) {
          ctx.fillStyle = n === 0 ? '#dc2626' : '#475569';
          ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
          ctx.fillText(String(n), nx, y + 20);
        }
      }
      var a = (2 + shift) * (flipped ? -1 : 1);
      var b = (5 + shift) * (flipped ? -1 : 1);
      var ax = cx + a * u, bx = cx + b * u;
      ctx.fillStyle = '#2563eb'; ctx.beginPath(); ctx.arc(ax, y - 20, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ea580c'; ctx.beginPath(); ctx.arc(bx, y - 20, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('A=' + a, ax, y - 36);
      ctx.fillText('B=' + b, bx, y - 36);
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = flipped ? '#dc2626' : '#16a34a';
      ctx.fillText(b + (b > a ? '  >  ' : '  <  ') + a, 270, 62);
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>兩邊同加減（整排平移）：<strong id="mif-sh">0</strong></label><input id="mif-s" type="range" min="-3" max="3" step="1" value="0"></div>' +
      '<button id="mif-flip" class="btn-primary">🪞 兩邊同乘以 (−1) 照鏡子翻轉！</button>';

    function update() {
      p.controlsEl.querySelector('#mif-sh').textContent = (shift >= 0 ? '+' + shift : shift);
      var a = (2 + shift) * (flipped ? -1 : 1);
      var b = (5 + shift) * (flipped ? -1 : 1);
      p.readoutEl.innerHTML =
        '原本 <span class="math-expr">5 > 2</span>。<br>' +
        '目前：<span class="math-expr">B(' + b + ') ' + (b > a ? '>' : '<') + ' A(' + a + ')</span><br><br>' +
        (flipped
          ? '🪞 <strong>已左右鏡像翻轉！</strong>原本在右邊較大的 B 翻去了左邊變比較小，所以不等號啪一聲必須反轉方向！'
          : '📦 左右加減平移時，誰在右邊完全沒變，不等號不轉向！按下「× (−1)」見證左右對調！');
      draw();
    }
    p.controlsEl.querySelector('#mif-s').addEventListener('input', function (e) { shift = parseInt(e.target.value, 10); p.onInteract(); update(); });
    p.controlsEl.querySelector('#mif-flip').addEventListener('click', function () { flipped = !flipped; p.onInteract(); update(); });
    update();
  };

  // 5. 乘法公式面積切割
  RENDERERS.m_mult_formula = function (p) {
    var a = 6, b = 3;
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var scale = 22;
      var ox = 150, oy = 45;
      var aw = a * scale, bw = b * scale;
      // a^2
      ctx.fillStyle = '#bfdbfe'; ctx.fillRect(ox, oy, aw, aw);
      // ab (right & bottom)
      ctx.fillStyle = '#fde68a'; ctx.fillRect(ox + aw, oy, bw, aw);
      ctx.fillStyle = '#fde68a'; ctx.fillRect(ox, oy + aw, aw, bw);
      // b^2
      ctx.fillStyle = '#fecaca'; ctx.fillRect(ox + aw, oy + aw, bw, bw);

      ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2;
      ctx.strokeRect(ox, oy, aw + bw, aw + bw);
      ctx.beginPath();
      ctx.moveTo(ox + aw, oy); ctx.lineTo(ox + aw, oy + aw + bw);
      ctx.moveTo(ox, oy + aw); ctx.lineTo(ox + aw + bw, oy + aw);
      ctx.stroke();

      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('a² = ' + (a * a), ox + aw / 2, oy + aw / 2 + 5);
      ctx.fillText('ab = ' + (a * b), ox + aw + bw / 2, oy + aw / 2 + 5);
      ctx.fillText('ab = ' + (a * b), ox + aw / 2, oy + aw + bw / 2 + 5);
      ctx.fillText('b²=' + (b * b), ox + aw + bw / 2, oy + aw + bw / 2 + 5);
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>邊長 a：<strong id="mmf-a">6</strong></label><input id="mmf-sa" type="range" min="3" max="7" step="1" value="6"></div>' +
      '<div class="slider-group"><label>邊長 b：<strong id="mmf-b">3</strong></label><input id="mmf-sb" type="range" min="1" max="4" step="1" value="3"></div>';

    function update() {
      p.controlsEl.querySelector('#mmf-a').textContent = a;
      p.controlsEl.querySelector('#mmf-b').textContent = b;
      var total = (a + b) * (a + b);
      var wrong = a * a + b * b;
      p.readoutEl.innerHTML =
        '完整面積 <span class="math-expr">(' + a + '+' + b + ')² = ' + total + '</span><br>' +
        '= a²(' + (a * a) + ') + <strong style="color:#d97706;">兩塊黃色 ab(' + (2 * a * b) + ')</strong> + b²(' + (b * b) + ')<br><br>' +
        '🚨 若誤寫成 a² + b² = ' + wrong + '，整整吃掉了 <strong>' + (2 * a * b) + '</strong>（兩塊黃色長方形）！';
      draw();
    }
    p.controlsEl.querySelector('#mmf-sa').addEventListener('input', function (e) { a = parseInt(e.target.value, 10); p.onInteract(); update(); });
    p.controlsEl.querySelector('#mmf-sb').addEventListener('input', function (e) { b = parseInt(e.target.value, 10); p.onInteract(); update(); });
    update();
  };

  // 6. 多項式幾何維度方塊
  RENDERERS.m_poly_blocks = function (p) {
    var x2Count = 2, xCount = 3, cCount = 2;
    var tryBadMerge = false;
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      // 畫 x² 紅正方形
      for (var i = 0; i < x2Count; i++) {
        ctx.fillStyle = '#fecaca'; ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2;
        ctx.fillRect(35 + i * 72, 60, 60, 60); ctx.strokeRect(35 + i * 72, 60, 60, 60);
        ctx.fillStyle = '#991b1b'; ctx.fillText('x²', 65 + i * 72, 95);
      }
      // 畫 x 藍長條
      for (var j = 0; j < xCount; j++) {
        ctx.fillStyle = '#bfdbfe'; ctx.strokeStyle = '#2563eb';
        ctx.fillRect(45 + j * 34, 155, 22, 62); ctx.strokeRect(45 + j * 34, 155, 22, 62);
        ctx.fillStyle = '#1e3a8a'; ctx.fillText('x', 56 + j * 34, 190);
      }
      // 畫 1 黃方點
      for (var k = 0; k < cCount; k++) {
        ctx.fillStyle = '#fde68a'; ctx.strokeStyle = '#d97706';
        ctx.fillRect(320 + k * 34, 175, 24, 24); ctx.strokeRect(320 + k * 34, 175, 24, 24);
        ctx.fillStyle = '#78350f'; ctx.fillText('1', 332 + k * 34, 192);
      }
      if (tryBadMerge) {
        ctx.fillStyle = '#dc2626'; ctx.font = 'bold 14px sans-serif';
        ctx.fillText('💥 物理彈開！正方形面積(x²)無法與線段長度(x)合併成 x³！', 270, 275);
      }
    }
    p.controlsEl.innerHTML =
      '<button id="mpb-x2" class="btn-light">+1 塊 x²</button>' +
      '<button id="mpb-x" class="btn-light">+1 條 x</button>' +
      '<button id="mpb-bad" class="btn-primary">⚠️ 試圖把 x² 跟 x 硬撞合併！</button>';
    function update() {
      p.readoutEl.innerHTML =
        '合併結果：<span class="math-expr">' + x2Count + 'x² + ' + xCount + 'x + ' + cCount + '</span><br><br>' +
        '只有<strong>同次方（同形狀維度）</strong>的方塊可以相加，面積不能加長度！';
      draw();
    }
    p.controlsEl.querySelector('#mpb-x2').addEventListener('click', function () { x2Count = (x2Count % 4) + 1; tryBadMerge = false; p.onInteract(); update(); });
    p.controlsEl.querySelector('#mpb-x').addEventListener('click', function () { xCount = (xCount % 5) + 1; tryBadMerge = false; p.onInteract(); update(); });
    p.controlsEl.querySelector('#mpb-bad').addEventListener('click', function () { tryBadMerge = true; p.onInteract(); update(); });
    update();
  };

  // 7. 畢氏定理面積水車（可調角度）
  RENDERERS.m_pythagoras = function (p) {
    var a = 3, b = 4, angleDeg = 90;
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var scale = 24;
      var rad = (angleDeg * Math.PI) / 180;
      var c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad));

      var cx = 220, cy = 225;
      var bx = cx + b * scale, by = cy;
      var ax = cx + a * scale * Math.cos(rad), ay = cy - a * scale * Math.sin(rad);

      // 畫三個代表面積的方塊比較條
      ctx.fillStyle = '#eff6ff'; ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(bx, by); ctx.lineTo(ax, ay); ctx.closePath();
      ctx.fill(); ctx.stroke();

      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('∠C = ' + angleDeg + '°', cx + 22, cy - 8);
      ctx.fillText('a=' + a, (cx + ax) / 2 - 14, (cy + ay) / 2);
      ctx.fillText('b=' + b, (cx + bx) / 2, cy + 16);
      ctx.fillText('對邊 c=' + c.toFixed(2), (ax + bx) / 2 + 24, (ay + by) / 2 - 6);

      // 右側面積量杯對照
      var barX = 390, baseY = 260;
      var sumSq = a * a + b * b;
      var cSq = c * c;
      ctx.fillStyle = '#60a5fa'; ctx.fillRect(barX, baseY - sumSq * 4, 42, sumSq * 4);
      ctx.fillStyle = Math.abs(angleDeg - 90) < 1 ? '#16a34a' : '#ef4444';
      ctx.fillRect(barX + 60, baseY - cSq * 4, 42, cSq * 4);
      ctx.fillStyle = '#0f172a';
      ctx.fillText('a²+b²', barX + 21, baseY + 16);
      ctx.fillText(String(sumSq), barX + 21, baseY - sumSq * 4 - 6);
      ctx.fillText('c²', barX + 81, baseY + 16);
      ctx.fillText(cSq.toFixed(1), barX + 81, baseY - cSq * 4 - 6);
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>改變夾角 ∠C：<strong id="mpy-ang">90°</strong>（試調銳角/鈍角！）</label><input id="mpy-s" type="range" min="60" max="120" step="5" value="90"></div>';
    function update() {
      p.controlsEl.querySelector('#mpy-ang').textContent = angleDeg + '°';
      var rad = (angleDeg * Math.PI) / 180;
      var cSq = a * a + b * b - 2 * a * b * Math.cos(rad);
      p.readoutEl.innerHTML =
        'a² + b² = 3² + 4² = <strong>25</strong><br>' +
        '斜邊平方 c² = <strong>' + cSq.toFixed(1) + '</strong><br><br>' +
        (angleDeg === 90
          ? '✅ <strong>剛好 90° 直角！</strong>兩股正方形的水完美填滿斜邊正方形 (25 = 25)！'
          : (angleDeg < 90 ? '⚠️ 銳角時 c² < a² + b²，水裝不下滿出來了！' : '⚠️ 鈍角時 c² > a² + b²，水根本裝不滿！'));
      draw();
    }
    p.controlsEl.querySelector('#mpy-s').addEventListener('input', function (e) { angleDeg = parseInt(e.target.value, 10); p.onInteract(); update(); });
    update();
  };

  // 8. 因式分解與十字交乘全組合互動轉盤（支援首項 ≠ 1 與全組合篩選）
  RENDERERS.m_factor_grid = function (p) {
    var PROBLEMS = [
      {
        label: '6x² + 11x + 3',
        a: 6, b: 11, c: 3,
        combos: [
          { p: 6, q: 1, r: 3, s: 1, gcdTrap: '上列 (6x, +3) 有公因數 3 → 可直接淘汰！' },
          { p: 6, q: 1, r: 1, s: 3, gcdTrap: '' },
          { p: 3, q: 2, r: 3, s: 1, gcdTrap: '上列 (3x, +3) 有公因數 3 → 可直接淘汰！' },
          { p: 3, q: 2, r: 1, s: 3, gcdTrap: '' }
        ]
      },
      {
        label: '6x² − 7x − 3',
        a: 6, b: -7, c: -3,
        combos: [
          { p: 6, q: 1, r: -1, s: 3, gcdTrap: '' },
          { p: 3, q: 2, r: -3, s: 1, gcdTrap: '上列 (3x, −3) 有公因數 3 → 可直接淘汰！' },
          { p: 3, q: 2, r: -1, s: 3, gcdTrap: '' },
          { p: 3, q: 2, r: 1, s: -3, gcdTrap: '' }
        ]
      },
      {
        label: 'x² + 5x + 6',
        a: 1, b: 5, c: 6,
        combos: [
          { p: 1, q: 1, r: 1, s: 6, gcdTrap: '' },
          { p: 1, q: 1, r: 2, s: 3, gcdTrap: '' }
        ]
      }
    ];
    var probIdx = 0;
    var comboIdx = 0;

    function fmtSign(n) { return n >= 0 ? ('+ ' + n) : ('− ' + Math.abs(n)); }
    function fmtTermX(n) { return n === 1 ? 'x' : (n + 'x'); }

    function drawArrow(ctx, x1, y1, x2, y2, color) {
      var ang = Math.atan2(y2 - y1, x2 - x1);
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 11 * Math.cos(ang - 0.42), y2 - 11 * Math.sin(ang - 0.42));
      ctx.lineTo(x2 - 11 * Math.cos(ang + 0.42), y2 - 11 * Math.sin(ang + 0.42));
      ctx.closePath(); ctx.fill();
    }

    function draw() {
      var ctx = p.ctx;
      var prob = PROBLEMS[probIdx];
      var cb = prob.combos[comboIdx];
      var diag1 = cb.p * cb.s;
      var diag2 = cb.q * cb.r;
      var mid = diag1 + diag2;
      var ok = (mid === prob.b);

      ctx.clearRect(0, 0, p.width, p.height);
      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('目標分解：' + prob.label + '（目前試第 ' + (comboIdx + 1) + ' / ' + prob.combos.length + ' 組）', 18, 26);

      // 左右兩欄數字
      ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center';
      ctx.fillStyle = '#1e3a8a';
      ctx.fillText(fmtTermX(cb.p), 95, 105);
      ctx.fillText(fmtTermX(cb.q), 95, 205);
      ctx.fillStyle = '#9a3412';
      ctx.fillText(fmtSign(cb.r), 235, 105);
      ctx.fillText(fmtSign(cb.s), 235, 205);

      // 彩色交叉箭頭（清楚指出誰乘誰！）
      drawArrow(ctx, 128, 98, 200, 194, '#2563eb');
      drawArrow(ctx, 128, 198, 200, 102, '#ea580c');

      // 右側誰乘誰明細
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
      ctx.fillStyle = '#2563eb';
      ctx.fillText('↘ 藍箭頭：(' + fmtTermX(cb.p) + ') × (' + cb.s + ') = ' + diag1 + 'x', 290, 96);
      ctx.fillStyle = '#ea580c';
      ctx.fillText('↗ 橘箭頭：(' + fmtTermX(cb.q) + ') × (' + cb.r + ') = ' + diag2 + 'x', 290, 126);

      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(290, 140); ctx.lineTo(525, 140); ctx.stroke();

      ctx.fillStyle = ok ? '#15803d' : '#dc2626';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('交叉相加 = ' + mid + 'x' + (ok ? ' ＝ 目標 ' + prob.b + 'x ✔' : ' ≠ 目標 ' + prob.b + 'x ✖'), 290, 165);

      // 直向檢查標註
      ctx.fillStyle = '#475569'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('直乘=' + (cb.p * cb.q) + 'x²', 95, 238);
      ctx.fillText('直乘=' + (cb.r * cb.s), 235, 238);

      if (cb.gcdTrap) {
        ctx.fillStyle = '#b91c1c'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('🚫 ' + cb.gcdTrap, 290, 198);
      }

      if (ok) {
        ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2.5;
        ctx.strokeRect(52, 76, 222, 42);
        ctx.strokeRect(52, 176, 222, 42);
        ctx.fillStyle = '#15803d'; ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('✅ 橫著讀出：(' + fmtTermX(cb.p) + ' ' + fmtSign(cb.r) + ')(' + fmtTermX(cb.q) + ' ' + fmtSign(cb.s) + ')', 52, 286);
      } else {
        ctx.fillStyle = '#64748b'; ctx.font = '13px sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('👇 點下方切換下一組 (p, q, r, s) 組合試試看！', 52, 286);
      }
    }

    function renderControls() {
      var prob = PROBLEMS[probIdx];
      var probBtns = PROBLEMS.map(function (pr, i) {
        return '<button class="btn-light mfg-prob' + (i === probIdx ? ' active' : '') + '" data-i="' + i + '" style="' + (i === probIdx ? 'background:#1e293b;color:#fff;' : '') + '">' + pr.label + '</button>';
      }).join('');
      var comboBtns = prob.combos.map(function (cb, i) {
        return '<button class="btn-light mfg-combo" data-c="' + i + '" style="' + (i === comboIdx ? 'background:#2563eb;color:#fff;' : '') + '">組合 ' + (i + 1) + '：(' + cb.p + ',' + cb.r + ')/(' + cb.q + ',' + cb.s + ')</button>';
      }).join('');
      p.controlsEl.innerHTML =
        '<div style="display:flex;gap:6px;flex-wrap:wrap;width:100%;margin-bottom:6px;"><strong style="font-size:0.82rem;align-self:center;">選題：</strong>' + probBtns + '</div>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;width:100%;"><strong style="font-size:0.82rem;align-self:center;">試組合：</strong>' + comboBtns + '</div>';

      p.controlsEl.querySelectorAll('.mfg-prob').forEach(function (btn) {
        btn.addEventListener('click', function () {
          probIdx = parseInt(btn.getAttribute('data-i'), 10);
          comboIdx = 0;
          p.onInteract();
          renderControls();
          update();
        });
      });
      p.controlsEl.querySelectorAll('.mfg-combo').forEach(function (btn) {
        btn.addEventListener('click', function () {
          comboIdx = parseInt(btn.getAttribute('data-c'), 10);
          p.onInteract();
          renderControls();
          update();
        });
      });
    }

    function update() {
      var prob = PROBLEMS[probIdx];
      var cb = prob.combos[comboIdx];
      var mid = cb.p * cb.s + cb.q * cb.r;
      var ok = (mid === prob.b);
      p.readoutEl.innerHTML =
        '題目：<span class="math-expr">' + prob.label + '</span>（共列出 <strong>' + prob.combos.length + ' 種</strong> 拆法組合）<br>' +
        '交叉算式：<span style="color:#2563eb;">(' + fmtTermX(cb.p) + ')×(' + cb.s + ')</span> + <span style="color:#ea580c;">(' + fmtTermX(cb.q) + ')×(' + cb.r + ')</span> = <strong>' + mid + 'x</strong><br><br>' +
        (ok
          ? '🎉 <strong>配對成功！</strong>因為交叉和剛好等於 ' + prob.b + 'x，寫答案時永遠<strong>橫著讀出兩條綠框</strong>：<code>(' + fmtTermX(cb.p) + ' ' + fmtSign(cb.r) + ')(' + fmtTermX(cb.q) + ' ' + fmtSign(cb.s) + ')</code>！'
          : (cb.gcdTrap
            ? '🚫 <strong>秒殺排除技巧：</strong>' + cb.gcdTrap + ' 原式已無公因式，同一橫排不可能有公因數！'
            : '✖ 交叉和為 <strong>' + mid + 'x</strong>，不等於目標 <strong>' + prob.b + 'x</strong>，請換試另一組 (p, q, r, s)！'));
      draw();
    }
    renderControls();
    update();
  };

  // 9. 配方法幾何補角正方形
  RENDERERS.m_complete_sq = function (p) {
    var step = 0; // 0: x²+6x, 1: 切半貼兩側, 2: 補上 3²=9 變 (x+3)²
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var ox = 140, oy = 45, s = 120, b = 56;
      ctx.fillStyle = '#bfdbfe'; ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = 2;
      ctx.fillRect(ox, oy, s, s); ctx.strokeRect(ox, oy, s, s);
      ctx.fillStyle = '#1e3a8a'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('x²', ox + s / 2, oy + s / 2 + 6);

      if (step === 0) {
        ctx.fillStyle = '#fde68a'; ctx.strokeStyle = '#d97706';
        ctx.fillRect(ox + s, oy, b * 2, s); ctx.strokeRect(ox + s, oy, b * 2, s);
        ctx.fillStyle = '#78350f'; ctx.fillText('6x', ox + s + b, oy + s / 2 + 6);
      } else {
        ctx.fillStyle = '#fde68a'; ctx.strokeStyle = '#d97706';
        ctx.fillRect(ox + s, oy, b, s); ctx.strokeRect(ox + s, oy, b, s);
        ctx.fillRect(ox, oy + s, s, b); ctx.strokeRect(ox, oy + s, s, b);
        ctx.fillStyle = '#78350f';
        ctx.fillText('3x', ox + s + b / 2, oy + s / 2 + 6);
        ctx.fillText('3x', ox + s / 2, oy + s + b / 2 + 6);

        if (step === 1) {
          ctx.setLineDash([5, 5]); ctx.strokeStyle = '#dc2626';
          ctx.strokeRect(ox + s, oy + s, b, b); ctx.setLineDash([]);
          ctx.fillStyle = '#dc2626'; ctx.font = 'bold 12px sans-serif';
          ctx.fillText('缺角 3²=9?', ox + s + b / 2, oy + s + b / 2 + 4);
        } else {
          ctx.fillStyle = '#bbf7d0'; ctx.strokeStyle = '#16a34a';
          ctx.fillRect(ox + s, oy + s, b, b); ctx.strokeRect(ox + s, oy + s, b, b);
          ctx.fillStyle = '#14532d'; ctx.fillText('+9', ox + s + b / 2, oy + s + b / 2 + 5);
        }
      }
    }
    p.controlsEl.innerHTML =
      '<button id="mcs-0" class="btn-light active">1. 原圖 x² + 6x = 7</button>' +
      '<button id="mcs-1" class="btn-light">2. ✂️ 6x 切半貼兩側</button>' +
      '<button id="mcs-2" class="btn-primary">3. 🧩 補上 3² = 9 變正方形！</button>';
    function update() {
      var msgs = [
        '起點：<span class="math-expr">x² + 6x = 7</span>，目前只是一個長方形，還不能直接開根號。',
        '✂️ 把 6x 縱切一半變成兩條 3x 分別貼在右側與下側，立刻看見右下角缺一塊 <strong>3 × 3 = 9</strong>！',
        '🎉 <strong>兩邊同時補上 +9：</strong>左邊完美合體成 <span class="math-expr">(x + 3)² = 7 + 9 = 16</span>，開根號得 x + 3 = ±4 → x = 1 或 −7！'
      ];
      p.readoutEl.innerHTML = msgs[step];
      draw();
    }
    [0, 1, 2].forEach(function (i) {
      p.controlsEl.querySelector('#mcs-' + i).addEventListener('click', function () {
        step = i; p.onInteract(); update();
      });
    });
    update();
  };

  // 10. SSA 擺動圓規反例 vs RHS
  RENDERERS.m_ssa_compass = function (p) {
    var angA = 30;
    var swingIdx = 0; // 0: 銳角交點, 1: 鈍角交點
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var ax = 75, ay = 240;
      var ab = 180;
      var rad = (angA * Math.PI) / 180;
      var bx = ax + ab * Math.cos(rad);
      var by = ay - ab * Math.sin(rad);
      var bc = 115; // 短邊長度

      // 底邊射線
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(490, ay); ctx.stroke();

      // 擺動圓弧
      ctx.setLineDash([5, 5]); ctx.strokeStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(bx, by, bc, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
      ctx.setLineDash([]);

      // 算交點
      var dy = ay - by;
      var dx = dy <= bc ? Math.sqrt(Math.max(0, bc * bc - dy * dy)) : 0;
      var c1x = bx + dx, c2x = bx - dx;
      var chosenX = (angA === 90 || swingIdx === 0) ? c1x : c2x;

      ctx.fillStyle = 'rgba(37, 99, 235, 0.14)';
      ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(chosenX, ay); ctx.closePath();
      ctx.fill(); ctx.stroke();

      // 標出兩交點
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(c1x, ay, 6, 0, Math.PI * 2); ctx.fill();
      if (dx > 8) {
        ctx.beginPath(); ctx.arc(c2x, ay, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#dc2626'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('交點 C₂ (鈍角)', c2x, ay + 20);
      }
      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('A (' + angA + '°)', ax, ay + 20);
      ctx.fillText('B', bx, by - 10);
      ctx.fillText('交點 C₁', c1x, ay + 20);
    }
    p.controlsEl.innerHTML =
      '<button id="mssa-sw" class="btn-primary">🔄 擺動短邊 BC 切換兩個不同三角形！</button>' +
      '<button id="mssa-rhs" class="btn-light">📐 切換 ∠C 為 90°（見證 RHS 唯一鎖死）</button>';
    function update() {
      p.readoutEl.innerHTML = angA === 30
        ? '🚨 <strong>SSA 不全等反例！</strong>兩邊 AB、BC 與 ∠A = 30° 完全相同，但短邊像鐘擺一樣在底邊切出 <strong>C₁、C₂ 兩個不同三角形</strong>（一個銳角、一個鈍角）！'
        : '✅ <strong>當對應角變成直角（RHS）時</strong>，斜邊與股唯一鎖死，鐘擺不再盪出第二個三角形！';
      draw();
    }
    p.controlsEl.querySelector('#mssa-sw').addEventListener('click', function () { angA = 30; swingIdx = 1 - swingIdx; p.onInteract(); update(); });
    p.controlsEl.querySelector('#mssa-rhs').addEventListener('click', function () { angA = angA === 30 ? 40 : 30; p.onInteract(); update(); });
    update();
  };

  // 11. 等差級數倒扣梯形
  RENDERERS.m_arith_stairs = function (p) {
    var n = 5;
    var flippedCopy = false;
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var ox = 110, oy = 60, cell = 30;
      var a1 = 2, d = 1;
      var an = a1 + (n - 1) * d;
      var totalCols = a1 + an;
      for (var row = 0; row < n; row++) {
        var count = a1 + row * d;
        for (var col = 0; col < count; col++) {
          ctx.fillStyle = '#fb923c'; ctx.strokeStyle = '#c2410c';
          ctx.fillRect(ox + col * cell, oy + row * cell, cell - 2, cell - 2);
          ctx.strokeRect(ox + col * cell, oy + row * cell, cell - 2, cell - 2);
        }
        if (flippedCopy) {
          for (var c2 = count; c2 < totalCols; c2++) {
            ctx.fillStyle = '#60a5fa'; ctx.strokeStyle = '#1d4ed8';
            ctx.fillRect(ox + c2 * cell, oy + row * cell, cell - 2, cell - 2);
            ctx.strokeRect(ox + c2 * cell, oy + row * cell, cell - 2, cell - 2);
          }
        }
      }
      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
      ctx.fillText('共 ' + n + ' 排，每排合起來寬 = ' + a1 + ' + ' + an + ' = ' + totalCols, ox, oy + n * cell + 28);
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>項數 n：<strong id="mas-n">5</strong></label><input id="mas-sn" type="range" min="3" max="6" step="1" value="5"></div>' +
      '<button id="mas-flip" class="btn-primary">🧲 複製一組藍色階梯「倒扣拼成長方形」！</button>';
    function update() {
      var a1 = 2, an = 2 + (n - 1);
      var sum = ((a1 + an) * n) / 2;
      p.controlsEl.querySelector('#mas-n').textContent = n;
      p.readoutEl.innerHTML =
        '首項 a₁ = 2，末項 aₙ = ' + an + '，項數 n = ' + n + '<br>' +
        (flippedCopy
          ? '🎉 <strong>拼成大長方形！</strong>總方塊 = (' + a1 + ' + ' + an + ') × ' + n + ' = ' + ((a1 + an) * n) + '，再除以 2 就是橘色總和 <strong>' + sum + '</strong>！'
          : '👆 點擊「倒扣拼成長方形」，親眼看懂梯形總和公式！');
      draw();
    }
    p.controlsEl.querySelector('#mas-sn').addEventListener('input', function (e) { n = parseInt(e.target.value, 10); p.onInteract(); update(); });
    p.controlsEl.querySelector('#mas-flip').addEventListener('click', function () { flippedCopy = !flippedCopy; p.onInteract(); update(); });
    update();
  };

  // 12. 相似形投影倍率與面積平方倍
  RENDERERS.m_similar_proj = function (p) {
    var scale = 2; // 1, 2, 3
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var base = 42;
      // 原圖 1x1
      ctx.fillStyle = '#bfdbfe'; ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2;
      ctx.fillRect(60, 120, base, base); ctx.strokeRect(60, 120, base, base);
      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('原圖 1×1', 81, 182);

      // 投影放大後 r×r 方格
      var sx = 230, sy = 70;
      for (var r = 0; r < scale; r++) {
        for (var c = 0; c < scale; c++) {
          ctx.fillStyle = '#fde68a'; ctx.strokeStyle = '#d97706';
          ctx.fillRect(sx + c * base, sy + r * base, base, base);
          ctx.strokeRect(sx + c * base, sy + r * base, base, base);
        }
      }
      ctx.fillStyle = '#0f172a';
      ctx.fillText('邊長 ×' + scale + ' → 面積變成 ' + (scale * scale) + ' 塊 (r²倍)！', sx + (scale * base) / 2, sy + scale * base + 24);
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>相似放大倍率 r：<strong id="msp-r">2</strong> 倍</label><input id="msp-sr" type="range" min="1" max="4" step="1" value="2"></div>';
    function update() {
      p.controlsEl.querySelector('#msp-r').textContent = scale;
      p.readoutEl.innerHTML =
        '邊長倍率 = <strong>' + scale + ' 倍</strong><br>' +
        '面積倍率 = <strong>' + (scale * scale) + ' 倍</strong>（不是 ' + scale + ' 倍！）<br>' +
        '內角角度 = <strong>依然 90°（完全不變！）</strong>';
      draw();
    }
    p.controlsEl.querySelector('#msp-sr').addEventListener('input', function (e) { scale = parseInt(e.target.value, 10); p.onInteract(); update(); });
    update();
  };

  // 13. 圓周角與圓心角證明
  RENDERERS.m_circle_angle = function (p) {
    var pDeg = 120; // 頂點 P 位置角度
    var showAux = false;
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var cx = 270, cy = 165, r = 115;
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();

      // 弧 AB 固定在下方 (50° ~ 130° => 圓心角 80°)
      var aRad = (50 * Math.PI) / 180, bRad = (130 * Math.PI) / 180;
      var pRad = (-pDeg * Math.PI) / 180;
      var ax = cx + r * Math.cos(aRad), ay = cy + r * Math.sin(aRad);
      var bx = cx + r * Math.cos(bRad), by = cy + r * Math.sin(bRad);
      var px = cx + r * Math.cos(pRad), py = cy + r * Math.sin(pRad);

      // 圓心角 80°
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(cx, cy); ctx.lineTo(bx, by); ctx.stroke();

      // 圓周角 40°
      ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(px, py); ctx.lineTo(bx, by); ctx.stroke();

      if (showAux) {
        ctx.setLineDash([5, 4]); ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, cy); ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('O (圓心角 80°)', cx, cy + 28);
      ctx.fillStyle = '#2563eb'; ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillText('P (圓周角恆為 40°)', px, py - 12);
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>拖動圓周頂點 P 位置：<strong id="mca-p">120°</strong></label><input id="mca-sp" type="range" min="35" max="145" step="5" value="120"></div>' +
      '<button id="mca-aux" class="btn-primary">✨ 展開「半徑等腰輔助線」證明！</button>';
    function update() {
      p.controlsEl.querySelector('#mca-p').textContent = pDeg + '°';
      p.readoutEl.innerHTML =
        '圓心角 ∠AOB = <strong>80°</strong>，不論 P 在圓周怎麼滑動，圓周角 ∠APB 始終 = <strong>40°</strong>！<br><br>' +
        (showAux ? '✅ <strong>綠色虛線 OP 是半徑！</strong>OA = OP = OB 立刻造出兩個等腰三角形，利用外角＝兩內對角和，馬上證明圓心角是圓周角 2 倍！' : '👆 按下「展開半徑輔助線」，看它為什麼永遠是一半！');
      draw();
    }
    p.controlsEl.querySelector('#mca-sp').addEventListener('input', function (e) { pDeg = parseInt(e.target.value, 10); p.onInteract(); update(); });
    p.controlsEl.querySelector('#mca-aux').addEventListener('click', function () { showAux = !showAux; p.onInteract(); update(); });
    update();
  };

  // 14. 三角形三心動態拉動
  RENDERERS.m_triangle_centers = function (p) {
    var topX = 270; // 拖動頂點變成銳角、直角、鈍角
    var centerType = 'O'; // O | I | G
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var A = { x: topX, y: 75 }, B = { x: 150, y: 245 }, C = { x: 390, y: 245 };
      ctx.fillStyle = 'rgba(226, 232, 240, 0.5)'; ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.closePath();
      ctx.fill(); ctx.stroke();

      if (centerType === 'O') {
        // 外心公式
        var D = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
        var ux = ((A.x * A.x + A.y * A.y) * (B.y - C.y) + (B.x * B.x + B.y * B.y) * (C.y - A.y) + (C.x * C.x + C.y * C.y) * (A.y - B.y)) / D;
        var uy = ((A.x * A.x + A.y * A.y) * (C.x - B.x) + (B.x * B.x + B.y * B.y) * (A.x - C.x) + (C.x * C.x + C.y * C.y) * (B.x - A.x)) / D;
        var R = Math.hypot(ux - A.x, uy - A.y);
        ctx.strokeStyle = 'rgba(37, 99, 235, 0.45)'; ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.arc(ux, uy, R, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(ux, uy, 6, 0, Math.PI * 2); ctx.fill();
        ctx.font = 'bold 12px sans-serif'; ctx.fillText('外心 O', ux + 10, uy);
      } else if (centerType === 'I') {
        var a = Math.hypot(B.x - C.x, B.y - C.y);
        var b = Math.hypot(A.x - C.x, A.y - C.y);
        var c = Math.hypot(A.x - B.x, A.y - B.y);
        var ix = (a * A.x + b * B.x + c * C.x) / (a + b + c);
        var iy = (a * A.y + b * B.y + c * C.y) / (a + b + c);
        var s = (a + b + c) / 2;
        var area = Math.abs((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) / 2;
        var rIn = area / s;
        ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(ix, iy, rIn, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#16a34a'; ctx.beginPath(); ctx.arc(ix, iy, 6, 0, Math.PI * 2); ctx.fill();
        ctx.font = 'bold 12px sans-serif'; ctx.fillText('內心 I', ix + 10, iy);
      } else {
        var gx = (A.x + B.x + C.x) / 3, gy = (A.y + B.y + C.y) / 3;
        ctx.strokeStyle = '#d97706'; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo((B.x + C.x) / 2, (B.y + C.y) / 2); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#d97706'; ctx.beginPath(); ctx.arc(gx, gy, 6, 0, Math.PI * 2); ctx.fill();
        ctx.font = 'bold 12px sans-serif'; ctx.fillText('重心 G (2:1)', gx + 10, gy);
      }
    }
    p.controlsEl.innerHTML =
      '<div style="width:100%;display:flex;gap:6px;flex-wrap:wrap;">' +
        '<button class="btn-light mtc-b active" data-t="O">外心 O（外接圓）</button>' +
        '<button class="btn-light mtc-b" data-t="I">內心 I（內切圓）</button>' +
        '<button class="btn-light mtc-b" data-t="G">重心 G（平衡點 2:1）</button>' +
      '</div>' +
      '<div class="slider-group"><label>拖動頂點變成鈍角三角形：</label><input id="mtc-x" type="range" min="70" max="470" step="10" value="270"></div>';
    function update() {
      var isObtuse = topX < 150 || topX > 390;
      p.readoutEl.innerHTML =
        (centerType === 'O'
          ? '🔵 <strong>外心＝中垂線交點（到三頂點等距）。</strong>' + (isObtuse ? '<br>🚨 看！拉成鈍角後，外心跑出三角形外面了！' : '<br>👆 試著把頂點拖到最左或最右變成鈍角！')
          : (centerType === 'I'
            ? '🟢 <strong>內心＝角平分線交點（到三邊等距）</strong>，永遠躲在三角形內部！'
            : '🟠 <strong>重心＝中線交點（平衡點）</strong>，切出 6 塊等面積小三角、頂點到重心：重心到中點 = 2 : 1！'));
      draw();
    }
    p.controlsEl.querySelectorAll('.mtc-b').forEach(function (b) {
      b.addEventListener('click', function () {
        p.controlsEl.querySelectorAll('.mtc-b').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active'); centerType = b.getAttribute('data-t'); p.onInteract(); update();
      });
    });
    p.controlsEl.querySelector('#mtc-x').addEventListener('input', function (e) { topX = parseInt(e.target.value, 10); p.onInteract(); update(); });
    update();
  };

  // 15. 盒狀圖 20 人等分 25% 透視
  RENDERERS.m_boxplot_prob = function (p) {
    var spread = 1; // 1(集中) ~ 3(拉散右側 25%)
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var q0 = 70, q1 = 155, q2 = 240, q3 = 285 + spread * 45, q4 = 335 + spread * 55;
      var by = 120;
      // 畫盒狀圖
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(q0, by); ctx.lineTo(q1, by); ctx.moveTo(q3, by); ctx.lineTo(q4, by); ctx.stroke();
      ctx.fillStyle = '#bfdbfe'; ctx.fillRect(q1, by - 25, q3 - q1, 50); ctx.strokeRect(q1, by - 25, q3 - q1, 50);
      ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(q2, by - 25); ctx.lineTo(q2, by + 25); ctx.stroke();

      // 畫四段各自剛好 5 個人頭！
      var segs = [[q0, q1], [q1, q2], [q2, q3], [q3, q4]];
      var cols = ['#64748b', '#2563eb', '#d97706', '#16a34a'];
      segs.forEach(function (seg, idx) {
        for (var k = 0; k < 5; k++) {
          var px = seg[0] + ((k + 0.5) / 5) * (seg[1] - seg[0]);
          ctx.fillStyle = cols[idx];
          ctx.beginPath(); ctx.arc(px, 215, 6, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = cols[idx]; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('5人 (25%)', (seg[0] + seg[1]) / 2, 248);
      });
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>把右半箱子分數拉散（寬度變寬）：<strong id="mbp-s">正常</strong></label><input id="mbp-r" type="range" min="1" max="3" step="1" value="1"></div>';
    function update() {
      p.controlsEl.querySelector('#mbp-s').textContent = spread === 1 ? '集中' : (spread === 2 ? '拉寬' : '極分散');
      p.readoutEl.innerHTML =
        '👀 <strong>打破「箱子越寬人越多」迷思！</strong><br>' +
        '就算把橘色段拉超寬，裡面的人數依然死死維持 <strong>5 人（全班 25%）</strong>！寬只代表這群人分數拉得很分散，不代表人比較多！';
      draw();
    }
    p.controlsEl.querySelector('#mbp-r').addEventListener('input', function (e) { spread = parseInt(e.target.value, 10); p.onInteract(); update(); });
    update();
  };

  // Fallback 引擎
  RENDERERS.generic_bar = function (p) {
    p.readoutEl.innerHTML = '請透過滑桿探索此單元的變化規律。';
  };

  global.JuniorSimEngines = {
    createUnitFromSpec: createUnitFromSpec,
    RENDERERS: RENDERERS
  };
})(window);
