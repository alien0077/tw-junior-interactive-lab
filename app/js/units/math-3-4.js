/* ==========================================================================
   math-3-4.js — 單元 3-4：二次函數（拋物線）
   籃球投籃實驗室 + 括號歸零即時泡泡 + 圍牆裁切極值 + 逆風扣籃反例 + 兩根平均秒頂點
   ========================================================================== */
(function (global) {
  'use strict';

  var UNIT_ID = 'MATH_9_3_4';

  function mount(container) {
    return global.JuniorSolverUI.renderUnitShell(container, {
      unitId: UNIT_ID,
      badgeText: '📐 九年級數學｜單元 3-4',
      title: '二次函數（拋物線）',
      subtitle: '用籃球投籃與「括號歸零法」破解左加右減大魔王，掌握圍牆極值與兩根對稱秒殺術',
      goldenRule: '讓括號歸零的 x 就是頂點新位置；函數有範圍限制時，必畫圍牆看頂點在不在裡面！',
      hints: [
        '想一想：原本 y = x² 頂點發生在「括號裡面等於 0」的時候。如果式子改成 y = (x − 3)²，請問 x 要代入多少，括號裡面才會變回 0？',
        '代入 x = +3 才能讓 (3 − 3) = 0！所以頂點從 x = 0 搬家搬到了右邊的 +3。同理，求最大收益 y = (200 + 10x)(80 − 2x) 時，找讓兩個括號為 0 的根平均起來，就是頂點對稱軸！'
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
        '<div style="font-size:0.84rem;color:#2563eb;font-weight:700;margin-bottom:6px;">STAGE 1｜情境衝突提問</div>' +
        '<p class="engage-question">🏀 籃球軌跡方程式為 <span class="math-expr">y = −0.2(x − 3)² + 5</span>。很多同學看到括號裡寫著「− 3」，就直覺以為拋物線最高點（籃框位置）在左邊 x = −3！但實際上最高點卻在右邊 x = +3！為什麼「減 3」反而往右移？</p>' +
        '<div class="prediction-grid">' +
          '<button class="pred-btn" data-c="wrong">A. 因為負負得正，前面有個 −0.2 把它變正的</button>' +
          '<button class="pred-btn" data-c="zero">B. 因為要讓括號 (x − 3) 歸零回到頂點高度 5，x 必須代入 +3！</button>' +
          '<button class="pred-btn" data-c="rule">C. 沒為什麼，課本口訣規定「左加右減」背起來就好</button>' +
        '</div>' +
        '<div id="m34-eng-msg"></div>' +
        '<button id="m34-to-exp" class="btn-primary hidden" style="margin-top:12px;">進入階段 ②：籃球投籃＆圍牆裁切實驗室 →</button>' +
      '</div>';

    var msg = bodyEl.querySelector('#m34-eng-msg');
    var nextBtn = bodyEl.querySelector('#m34-to-exp');
    bodyEl.querySelectorAll('.pred-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        bodyEl.querySelectorAll('.pred-btn').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        if (btn.getAttribute('data-c') === 'zero') {
          msg.innerHTML = '<div class="counterexample-box success">✔ 一針見血！數學不需要死背口訣，「讓平方括號歸零的 x 值」就是頂點所在位置！</div>';
          shell.markStageDone('ENGAGE', 25);
        } else {
          msg.innerHTML = '<div class="counterexample-box error">💡 不靠死背也能懂！進到下一個投籃實驗室，試著拉動 h 值並觀察括號內的「歸零提示泡泡」！</div>';
          shell.markStageDone('ENGAGE', 15);
        }
        nextBtn.classList.remove('hidden');
      });
    });
    nextBtn.addEventListener('click', function () { shell.goToStage('EXPLORE'); });
  }

  function renderExplore(bodyEl, shell) {
    var a = -0.25;
    var h = 1;
    var k = 4;
    var fenceOn = false;
    var xMin = 2;
    var xMax = 5;
    var shooting = false;
    var ballX = -4;
    var scoreCount = 0;
    var usedFence = false;
    var rafId = null;

    // 籃框目標固定在 (3, 5) 上方附近：調整拋物線通過籃框 (3, 4.5) 或頂點對準 (3, 5)
    var hoopX = 3;
    var hoopY = 4;

    bodyEl.innerHTML =
      '<div class="dual-view-grid">' +
        '<div class="canvas-panel">' +
          '<div class="panel-title"><span>🏀 拋物線投籃與圍牆裁切畫布</span><small>目標籃框：(3, 4)</small></div>' +
          '<canvas id="m34-canvas" class="sim-canvas"></canvas>' +
          '<div class="controls-bar">' +
            '<div class="slider-group"><label>開口大小 a：<strong>' + a + '</strong></label><input id="s-a" type="range" min="-0.6" max="0.4" step="0.05" value="-0.25"></div>' +
            '<div class="slider-group"><label>水平移動 h：<strong id="lbl-h">1</strong></label><input id="s-h" type="range" min="-4" max="4" step="0.5" value="1"></div>' +
            '<div class="slider-group"><label>垂直移動 k：<strong id="lbl-k">4</strong></label><input id="s-k" type="range" min="-1" max="5" step="0.5" value="4"></div>' +
          '</div>' +
          '<div class="controls-bar">' +
            '<button id="btn-shoot" class="btn-primary">🏀 依目前曲線投籃！</button>' +
            '<button id="btn-fence" class="btn-light">🧱 切換「圍牆裁切極值 [2 ≤ x ≤ 5]」</button>' +
          '</div>' +
        '</div>' +
        '<div class="logic-panel">' +
          '<div class="panel-title"><span>🧠 歸零探測泡泡</span><span id="m34-exp-badge" class="badge-status status-inprogress">調整並投進一球 + 開啟圍牆</span></div>' +
          '<div id="m34-bubble" style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:14px;font-size:0.94rem;"></div>' +
          '<div id="m34-shoot-msg" style="margin-top:10px;"></div>' +
          '<button id="m34-next-exp" class="btn-primary hidden" style="margin-top:12px;">完成探索！前往階段 ③ 總結技巧 →</button>' +
        '</div>' +
      '</div>';

    var canvas = bodyEl.querySelector('#m34-canvas');
    var setup = global.JuniorSolverUI.setupCanvas(canvas, 540, 340);
    var ctx = setup.ctx;
    var bubbleEl = bodyEl.querySelector('#m34-bubble');
    var shootMsg = bodyEl.querySelector('#m34-shoot-msg');
    var badgeEl = bodyEl.querySelector('#m34-exp-badge');
    var nextBtn = bodyEl.querySelector('#m34-next-exp');

    function f(x) {
      return a * Math.pow(x - h, 2) + k;
    }

    function updateReadout() {
      var hStr = h === 0 ? 'x²' : (h > 0 ? '(x − ' + h + ')²' : '(x + ' + Math.abs(h) + ')²');
      var kStr = k === 0 ? '' : (k > 0 ? ' + ' + k : ' − ' + Math.abs(k));
      var zeroExplain = h === 0
        ? 'x = 0 時括號為 0'
        : (h > 0
          ? '要讓 (x − ' + h + ') 歸零，x 必須代入 <strong style="color:#dc2626;">+' + h + '</strong>（往右！）'
          : '要讓 (x + ' + Math.abs(h) + ') 歸零，x 必須代入 <strong style="color:#dc2626;">' + h + '</strong>（往左！）');

      var fenceHtml = '';
      if (fenceOn) {
        var vertexInside = (h >= xMin && h <= xMax);
        var vals = [f(xMin), f(xMax)];
        if (vertexInside) vals.push(f(h));
        var maxV = Math.max.apply(null, vals).toFixed(2);
        var minV = Math.min.apply(null, vals).toFixed(2);
        fenceHtml =
          '<div class="counterexample-box ' + (vertexInside ? 'success' : 'error') + '" style="margin-top:10px;">' +
            '🧱 <strong>圍牆區間 [2 ≤ x ≤ 5]：</strong><br>' +
            (vertexInside
              ? '✔ 頂點 x=' + h + ' 被關在圍牆裡面，可以當極值！'
              : '⚠️ 頂點 x=' + h + ' 躲在圍牆外面，只剩斜坡！最大最小值只會出現在左右圍牆邊緣！') +
            '<br>區間最大值 = <strong>' + maxV + '</strong>，最小值 = <strong>' + minV + '</strong>' +
          '</div>';
      }

      bubbleEl.innerHTML =
        '<div style="font-size:1.08rem;margin-bottom:8px;">' +
          '<span class="math-expr">y = ' + a + ' ' + hStr + kStr + '</span>' +
        '</div>' +
        '<div style="background:#eff6ff;padding:10px;border-radius:8px;border:1px solid #bfdbfe;">' +
          '🎯 <strong>為什麼頂點在 (' + h + ', ' + k + ')？</strong><br>' + zeroExplain +
        '</div>' +
        '<div style="margin-top:8px;font-size:0.86rem;color:#475569;">開口方向：' + (a < 0 ? '向下（有最高點）' : (a > 0 ? '向上（有最低點）' : '變成水平直線！')) + '</div>' +
        fenceHtml;

      if (scoreCount > 0 && usedFence) {
        badgeEl.className = 'badge-status status-mastered';
        badgeEl.textContent = '✔ 已達成進球與圍牆探索';
        nextBtn.classList.remove('hidden');
        shell.markStageDone('EXPLORE', 35);
      }
    }

    function toPx(x, y) {
      return {
        x: 270 + x * 42,
        y: 255 - y * 36
      };
    }

    function draw() {
      ctx.clearRect(0, 0, setup.width, setup.height);

      // 網格與軸
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (var gx = -6; gx <= 6; gx++) {
        var p = toPx(gx, 0);
        ctx.beginPath(); ctx.moveTo(p.x, 10); ctx.lineTo(p.x, 330); ctx.stroke();
      }
      for (var gy = -2; gy <= 6; gy++) {
        var py = toPx(0, gy);
        ctx.beginPath(); ctx.moveTo(15, py.y); ctx.lineTo(525, py.y); ctx.stroke();
      }

      var o = toPx(0, 0);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(15, o.y); ctx.lineTo(525, o.y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(o.x, 10); ctx.lineTo(o.x, 330); ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      for (var tx = -5; tx <= 5; tx++) {
        if (tx !== 0) ctx.fillText(String(tx), toPx(tx, 0).x, o.y + 14);
      }

      // 圍牆區域背景
      if (fenceOn) {
        var fLeft = toPx(xMin, 0).x;
        var fRight = toPx(xMax, 0).x;
        ctx.fillStyle = 'rgba(250, 204, 21, 0.16)';
        ctx.fillRect(fLeft, 10, fRight - fLeft, 320);
        ctx.strokeStyle = '#d97706';
        ctx.setLineDash([5, 4]);
        ctx.beginPath(); ctx.moveTo(fLeft, 10); ctx.lineTo(fLeft, 330); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(fRight, 10); ctx.lineTo(fRight, 330); ctx.stroke();
        ctx.setLineDash([]);
      }

      // 拋物線繪製
      ctx.lineWidth = 3;
      for (var sx = -5.8; sx < 5.8; sx += 0.1) {
        var p1 = toPx(sx, f(sx));
        var p2 = toPx(sx + 0.1, f(sx + 0.1));
        var inside = !fenceOn || (sx >= xMin && sx <= xMax);
        ctx.strokeStyle = inside ? '#2563eb' : 'rgba(148, 163, 184, 0.45)';
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // 畫頂點
      var vp = toPx(h, k);
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(vp.x, vp.y, 6, 0, Math.PI * 2); ctx.fill();
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('頂點(' + h + ', ' + k + ')', vp.x, vp.y - 12);

      // 畫籃框 (3, 4)
      var hp = toPx(hoopX, hoopY);
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(hp.x - 16, hp.y); ctx.lineTo(hp.x + 16, hp.y); ctx.stroke();
      ctx.fillStyle = '#9a3412';
      ctx.fillRect(hp.x + 16, hp.y - 26, 6, 36);

      // 投籃動畫
      if (shooting) {
        ballX += 0.14;
        var bp = toPx(ballX, f(ballX));
        ctx.fillStyle = '#f97316';
        ctx.beginPath(); ctx.arc(bp.x, bp.y, 10, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#7c2d12';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        if (ballX >= 5.5) {
          shooting = false;
          var yAtHoop = f(hoopX);
          if (Math.abs(yAtHoop - hoopY) <= 0.45 && a < 0) {
            scoreCount += 1;
            shootMsg.innerHTML = '<div class="counterexample-box success">🏀 <strong>空心入網！</strong>x=3 時高度剛好通過 y=' + yAtHoop.toFixed(2) + '！再點「🧱 切換圍牆裁切極值」就完成探索囉！</div>';
            updateReadout();
          } else {
            shootMsg.innerHTML = '<div class="counterexample-box error">✖ 沒投進！（x=3 時球在高度 ' + yAtHoop.toFixed(2) + '，籃框在 4，且開口須朝下 a < 0）試著調整 h 或 k 對準籃框 (3, 4)！</div>';
          }
        }
      }

      rafId = global.requestAnimationFrame(draw);
    }

    bodyEl.querySelector('#s-a').addEventListener('input', function (e) {
      a = parseFloat(e.target.value);
      e.target.previousElementSibling.querySelector('strong').textContent = a;
      global.JuniorStore.touchInteraction(UNIT_ID);
      updateReadout();
    });
    bodyEl.querySelector('#s-h').addEventListener('input', function (e) {
      h = parseFloat(e.target.value);
      bodyEl.querySelector('#lbl-h').textContent = h;
      global.JuniorStore.touchInteraction(UNIT_ID);
      updateReadout();
    });
    bodyEl.querySelector('#s-k').addEventListener('input', function (e) {
      k = parseFloat(e.target.value);
      bodyEl.querySelector('#lbl-k').textContent = k;
      global.JuniorStore.touchInteraction(UNIT_ID);
      updateReadout();
    });
    bodyEl.querySelector('#btn-shoot').addEventListener('click', function () {
      ballX = -4;
      shooting = true;
    });
    bodyEl.querySelector('#btn-fence').addEventListener('click', function (e) {
      fenceOn = !fenceOn;
      usedFence = true;
      e.target.classList.toggle('active', fenceOn);
      updateReadout();
    });
    nextBtn.addEventListener('click', function () { shell.goToStage('EXPLAIN'); });

    updateReadout();
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
          '<h3 style="margin-top:0;">📐 核心原理：頂點式的三個開關</h3>' +
          '<ol style="padding-left:20px;margin:0;line-height:1.85;">' +
            '<li><strong>a 決定開口與胖瘦：</strong>a &gt; 0 開口朝上（有最小值）；a &lt; 0 開口朝下（有最大值）；|a| 越大越瘦窄。</li>' +
            '<li><strong>h 是「讓括號歸零」的 x：</strong>在 <span class="math-expr">y = a(x − h)² + k</span> 裡，當 x = h 括號歸零，y 剛好停在極值 k，所以頂點永遠在 (h, k)。</li>' +
          '</ol>' +
        '</div>' +
        '<div class="faq-card">' +
          '<h3 style="margin-top:0;">💡 學生高頻疑問 × 最簡單解法</h3>' +
          '<div class="faq-item">' +
            '<div class="faq-q">疑問 1：「左加右減每次看題目還是正負寫反怎麼辦？」</div>' +
            '<div class="faq-a"><strong>最簡單解法：</strong>直接問「<strong>誰讓括號歸零？</strong>」看到 <span class="math-expr">y = 2(x − 3)² − 5</span>，誰讓 (x−3)=0？x=3！尾巴是多少？−5！立刻讀出頂點 (3, −5)！</div>' +
          '</div>' +
          '<div class="faq-item">' +
            '<div class="faq-q">疑問 2：「有限制範圍（如 1 ≤ x ≤ 4）求最大最小值怎麼算？」</div>' +
            '<div class="faq-a"><strong>最簡單解法：</strong>畫兩道圍牆！先檢查頂點 x 有沒有被關在牆內：有在牆內就能當極值；頂點在牆外時，最大最小值一定發生在左右兩道圍牆邊界！</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:18px;text-align:right;">' +
        '<button id="m34-to-eval" class="btn-primary">前往階段 ④：逆風扣籃反例＆兩根平均秒頂點 →</button>' +
      '</div>';

    bodyEl.querySelector('#m34-to-eval').addEventListener('click', function () {
      shell.goToStage('EVALUATE');
    });
  }

  function renderEvaluate(bodyEl, shell) {
    var counterDone = false;
    var tacticDone = false;

    bodyEl.innerHTML =
      '<div class="canvas-panel" style="margin-bottom:18px;">' +
        '<div class="panel-title"><span>⚡ 逆風扣籃迷思挑戰：籃框位於左側 (−2, 5)，哪一條拋物線能精準讓頂點對準 (−2, 5)？</span></div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">' +
          '<button class="btn-light m34-eq" data-eq="wrong1">A. y = −0.4(x − 2)² + 5</button>' +
          '<button class="btn-light m34-eq" data-eq="wrong2">B. y = −0.4(x + 2)² − 5</button>' +
          '<button class="btn-light m34-eq" data-eq="right">C. y = −0.4(x + 2)² + 5</button>' +
        '</div>' +
        '<div id="m34-eq-fb"></div>' +
      '</div>' +
      '<div id="m34-tactic-mount"></div>';

    var fb = bodyEl.querySelector('#m34-eq-fb');
    function checkAll() {
      if (counterDone && tacticDone) {
        shell.markStageDone('EVALUATE', 40);
        shell.unlockBadge('MYTH_BUSTER_PARABOLA', 80);
      }
    }

    bodyEl.querySelectorAll('.m34-eq').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var eq = btn.getAttribute('data-eq');
        global.JuniorStore.recordAttempt(UNIT_ID);
        if (eq === 'wrong1') {
          global.JuniorStore.recordMisconception(UNIT_ID, 'MIS_PARABOLA_SIGN_FLIP', '將頂點 (-2, 5) 誤寫成 (x - 2)² + 5，導致籃球往右邊 (+2, 5) 飛去撞牆');
          fb.innerHTML = '<div class="counterexample-box error">🚨 <strong>反例演示：</strong>代入 x = −2 看看：<span class="math-expr">(−2 − 2)² = (−4)² = 16</span> 根本沒歸零！球會飛去右邊的 (+2, 5) 撞牆彈回來！</div>';
        } else if (eq === 'wrong2') {
          fb.innerHTML = '<div class="counterexample-box error">🚨 <strong>高度歪了！</strong>x 座標 (−2) 歸零對了，但尾巴是 −5，球在地下室 (−2, −5) 就掉下去了！</div>';
        } else {
          counterDone = true;
          global.JuniorStore.resolveMisconception(UNIT_ID, 'MIS_PARABOLA_SIGN_FLIP');
          fb.innerHTML = '<div class="counterexample-box success">✔ <strong>空心扣籃成功！</strong>x = −2 讓 (x + 2) 歸零，尾巴 +5 就是最高點，頂點精準落在 (−2, 5)！</div>';
          checkAll();
        }
      });
    });

    global.JuniorSolverUI.mountTacticAssembler(bodyEl.querySelector('#m34-tactic-mount'), {
      unitId: UNIT_ID,
      tacticCode: 'TWO_ROOTS_SYMMETRY_AXIS',
      title: '會考最大收益免配方秒殺法（兩根平均找對稱軸）',
      problemText: '某商店售價 200 元可賣 80 個，每漲價 10 元少賣 2 個。設漲價 x 次，總收入 y = (200 + 10x)(80 − 2x)，問漲價幾次收入最大？',
      slots: [
        { label: '步驟 1：找出讓兩括號歸零的兩根', expectedId: 'roots' },
        { label: '步驟 2：利用對稱性平均求頂點 x', expectedId: 'avg' },
        { label: '步驟 3：代回算出最大收入金額', expectedId: 'calc' }
      ],
      chips: [
        { id: 'wrong_expand', label: '先全部展開乘開變成 −20x² + 400x + 16000 再慢慢配方', wrongReason: '展開再配方容易算錯！其實不用展開，用對稱軸找兩根中點 5 秒就出答案！' },
        { id: 'roots', label: '200 + 10x = 0 得 x₁ = −20；80 − 2x = 0 得 x₂ = 40' },
        { id: 'avg', label: '對稱軸剛好在兩根正中間：x = (−20 + 40) ÷ 2 = 10 次' },
        { id: 'calc', label: '代入 x = 10 → 售價 300 元賣 60 個，最大收入 18000 元' }
      ],
      finalSummaryHtml: '🏆 <strong>秒殺心得：</strong>遇到 (A + bx)(C − dx) 最大收益題，直接抓兩根取平均，連展開都不必，考試快人 2 分鐘！',
      onComplete: function () {
        tacticDone = true;
        checkAll();
      }
    });

    return null;
  }

  global.JuniorUnits[UNIT_ID] = { mount: mount };
})(window);
