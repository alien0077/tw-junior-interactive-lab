/* ==========================================================================
   math-1-1.js — 單元 1-1：整數、負數與數線
   模式 A：熱氣球氣球(正)與沙包(負)增減模型
   模式 B：青蛙數線時間倒帶機（視覺化負負得正）
   階段 ④：反例動畫 (-3 - 5) + 會考「直線 AB 雙解檢查燈」
   ========================================================================== */
(function (global) {
  'use strict';

  var UNIT_ID = 'MATH_7_1_1';

  function mount(container) {
    return global.JuniorSolverUI.renderUnitShell(container, {
      unitId: UNIT_ID,
      badgeText: '📐 七年級數學｜單元 1-1',
      title: '整數、負數與數線',
      subtitle: '從「熱氣球拿走沙包」與「青蛙倒帶影片」，徹底看懂負負得正與數線雙解',
      goldenRule: '負號不是壞東西，它只是「反轉方向」的開關；按兩次開關就回到正向。',
      hints: [
        '想像熱氣球身上綁著「往上飄的氣球 (+1)」與「往下墜的沙包 (−1)」。如果你用剪刀『減掉（剪斷）』往下拉的沙包，氣球會變輕還是變重？',
        '在數學裡，「−(−2)」或「(−2) × (−3)」代表做兩次反轉：面向左邊（負向）的青蛙，如果把錄影機「倒帶（負時間）」，畫面裡牠反而是在往右邊（正向）跑！'
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
        '<p class="engage-question">🎈 一個熱氣球目前停在高度 0，籃子裡掛著 3 顆「上升氦氣球 (+3)」與 3 個「重沙包 (−3)」。如果我拿剪刀剪掉並<strong>拿走 2 個沙包</strong>（也就是做減法：−(−2)），熱氣球會怎麼移動？</p>' +
        '<div class="prediction-grid">' +
          '<button class="pred-btn" data-choice="down">A. 因為是「減法」，氣球會往下掉 2 格（變成 −2）</button>' +
          '<button class="pred-btn" data-choice="same">B. 沙包本來就不算數，氣球停在原地不動</button>' +
          '<button class="pred-btn" data-choice="up">C. 拿走往下拉的負擔，氣球反而會往上飄升 +2 格！</button>' +
        '</div>' +
        '<div id="m11-engage-msg"></div>' +
        '<div style="margin-top:14px;">' +
          '<button id="m11-to-explore" class="btn-primary hidden">進入階段 ②：親手剪沙包＆看青蛙倒帶 →</button>' +
        '</div>' +
      '</div>';

    var msgEl = bodyEl.querySelector('#m11-engage-msg');
    var nextBtn = bodyEl.querySelector('#m11-to-explore');
    var btns = bodyEl.querySelectorAll('.pred-btn');

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        var c = btn.getAttribute('data-choice');
        if (c === 'up') {
          msgEl.innerHTML = '<div class="counterexample-box success">✔ 直覺太棒了！「拿走負擔（減去負數）」反而讓高度上升！現在到雙視角實驗室親眼驗證它，順便看看乘法為什麼也負負得正。</div>';
          shell.markStageDone('ENGAGE', 25);
        } else {
          msgEl.innerHTML = '<div class="counterexample-box error">🤔 很多人看到「減法」就直覺覺得數字會變小！但你減掉的是「往下拉的沙包」喔！進下一步親手剪掉沙包看看會發生什麼事！</div>';
          shell.markStageDone('ENGAGE', 15);
        }
        nextBtn.classList.remove('hidden');
      });
    });

    nextBtn.addEventListener('click', function () {
      shell.goToStage('EXPLORE');
    });
  }

  function renderExplore(bodyEl, shell) {
    var mode = 'balloon'; // 'balloon' | 'frog'
    var balloons = 3;
    var sandbags = 3;
    var removedSandbags = 0;
    var frogVelocity = -2;
    var frogTime = 1;
    var exploreActions = 0;
    var rafId = null;
    var animT = 0;

    bodyEl.innerHTML =
      '<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">' +
        '<button id="m11-mode-balloon" class="btn-light active">模式 A：熱氣球加減沙包（理解 3 − (−2) = 5）</button>' +
        '<button id="m11-mode-frog" class="btn-light">模式 B：青蛙攝影機倒帶（理解 (−2) × (−3) = +6）</button>' +
      '</div>' +
      '<div class="dual-view-grid">' +
        '<div class="canvas-panel">' +
          '<div class="panel-title"><span id="m11-canvas-title">🎈 熱氣球物理模型</span><small style="color:#64748b;">即時 60fps 動態</small></div>' +
          '<canvas id="m11-canvas" class="sim-canvas"></canvas>' +
          '<div id="m11-controls" class="controls-bar"></div>' +
        '</div>' +
        '<div class="logic-panel">' +
          '<div class="panel-title"><span>🔢 右側同步數學式</span><span id="m11-explore-badge" class="badge-status status-inprogress">探索進度 0/2</span></div>' +
          '<div id="m11-formula-box" style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;font-size:0.95rem;"></div>' +
          '<div style="margin-top:14px;">' +
            '<button id="m11-next-explain" class="btn-primary" disabled>請先在兩種模式各自操作一次以解鎖金句 →</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    var canvas = bodyEl.querySelector('#m11-canvas');
    var setup = global.JuniorSolverUI.setupCanvas(canvas, 540, 340);
    var ctx = setup.ctx;
    var controlsEl = bodyEl.querySelector('#m11-controls');
    var formulaBox = bodyEl.querySelector('#m11-formula-box');
    var titleEl = bodyEl.querySelector('#m11-canvas-title');
    var badgeEl = bodyEl.querySelector('#m11-explore-badge');
    var nextBtn = bodyEl.querySelector('#m11-next-explain');
    var btnModeA = bodyEl.querySelector('#m11-mode-balloon');
    var btnModeB = bodyEl.querySelector('#m11-mode-frog');

    var seenModes = { balloon: true, frog: false };
    var currentYDisplay = 0;

    function checkExploreComplete() {
      var doneCount = (seenModes.balloon && exploreActions >= 1 ? 1 : 0) + (seenModes.frog ? 1 : 0);
      badgeEl.textContent = '探索進度 ' + doneCount + '/2';
      if (doneCount >= 2) {
        badgeEl.className = 'badge-status status-mastered';
        badgeEl.textContent = '✔ 雙模式已完成';
        nextBtn.disabled = false;
        nextBtn.textContent = '金句已解鎖！前往階段 ③ 看懂全部疑問 →';
        shell.markStageDone('EXPLORE', 35);
      }
    }

    function updateControlsAndFormula() {
      if (mode === 'balloon') {
        titleEl.textContent = '🎈 熱氣球氣球與沙包模型';
        var netHeight = balloons - sandbags;
        controlsEl.innerHTML =
          '<button id="b-cut-bag" class="btn-primary">✂️ 拿走 1 個沙包（減 −1）</button>' +
          '<button id="b-add-bag" class="btn-light">🪨 掛回 1 個沙包（加 −1）</button>' +
          '<button id="b-add-bal" class="btn-light">🎈 增加 1 顆氣球（加 +1）</button>' +
          '<button id="b-reset" class="btn-light">↺ 重設 3−3=0</button>';

        controlsEl.querySelector('#b-cut-bag').addEventListener('click', function () {
          if (sandbags > 0) {
            sandbags -= 1;
            removedSandbags += 1;
            exploreActions += 1;
            global.JuniorStore.touchInteraction(UNIT_ID);
            updateControlsAndFormula();
            checkExploreComplete();
          }
        });
        controlsEl.querySelector('#b-add-bag').addEventListener('click', function () {
          if (sandbags < 6) {
            sandbags += 1;
            exploreActions += 1;
            global.JuniorStore.touchInteraction(UNIT_ID);
            updateControlsAndFormula();
            checkExploreComplete();
          }
        });
        controlsEl.querySelector('#b-add-bal').addEventListener('click', function () {
          if (balloons < 6) {
            balloons += 1;
            exploreActions += 1;
            global.JuniorStore.touchInteraction(UNIT_ID);
            updateControlsAndFormula();
            checkExploreComplete();
          }
        });
        controlsEl.querySelector('#b-reset').addEventListener('click', function () {
          balloons = 3; sandbags = 3; removedSandbags = 0;
          updateControlsAndFormula();
        });

        formulaBox.innerHTML =
          '<div style="margin-bottom:10px;">' +
            '<div>目前氣球數（正向拉力）：<strong style="color:#dc2626;">+' + balloons + '</strong></div>' +
            '<div>目前沙包數（負向重力）：<strong style="color:#1d4ed8;">−' + sandbags + '</strong></div>' +
          '</div>' +
          '<div style="background:#f1f5f9;padding:12px;border-radius:8px;font-family:monospace;font-size:1.05rem;">' +
            '高度 = (+' + balloons + ') + (−' + sandbags + ') = <strong style="color:#0f172a;font-size:1.2rem;">' + (netHeight >= 0 ? '+' + netHeight : netHeight) + '</strong>' +
          '</div>' +
          (removedSandbags > 0
            ? '<div class="counterexample-box success" style="margin-top:10px;">✂️ 剛才從平衡 0 拿走了 <strong>' + removedSandbags + '</strong> 個沙包：<br>' +
              '算式相當於 <span class="math-expr">0 − (−' + removedSandbags + ') = 0 + ' + removedSandbags + ' = +' + removedSandbags + '</span>！<br>少了一個往下拉的負擔，整體高度就往上飄了！</div>'
            : '<div style="margin-top:10px;color:#475569;font-size:0.88rem;">👆 試著點按「✂️ 拿走 1 個沙包」，觀察算式如何變成加法！</div>');
      } else {
        titleEl.textContent = '🐸 青蛙數線時間倒帶機';
        var pos = frogVelocity * frogTime;
        controlsEl.innerHTML =
          '<div class="slider-group">' +
            '<label>青蛙方向與速度：<strong>' + (frogVelocity < 0 ? '面向左邊 ' + frogVelocity + ' 步/秒' : '面向右邊 +' + frogVelocity + ' 步/秒') + '</strong></label>' +
            '<div style="display:flex;gap:6px;margin-top:4px;">' +
              '<button id="f-vel-neg" class="btn-light ' + (frogVelocity === -2 ? 'active' : '') + '">面朝左 (−2)</button>' +
              '<button id="f-vel-pos" class="btn-light ' + (frogVelocity === 2 ? 'active' : '') + '">面朝右 (+2)</button>' +
            '</div>' +
          '</div>' +
          '<div class="slider-group">' +
            '<label>攝影機時間軸：<strong>' + (frogTime < 0 ? '倒帶回 ' + Math.abs(frogTime) + ' 秒前 (' + frogTime + '秒)' : (frogTime === 0 ? '現在 (0 秒)' : '快轉 ' + frogTime + ' 秒後 (+' + frogTime + '秒)')) + '</strong></label>' +
            '<input id="f-time" type="range" min="-3" max="3" step="1" value="' + frogTime + '" />' +
          '</div>';

        controlsEl.querySelector('#f-vel-neg').addEventListener('click', function () {
          frogVelocity = -2;
          seenModes.frog = true;
          updateControlsAndFormula();
          checkExploreComplete();
        });
        controlsEl.querySelector('#f-vel-pos').addEventListener('click', function () {
          frogVelocity = 2;
          seenModes.frog = true;
          updateControlsAndFormula();
          checkExploreComplete();
        });
        controlsEl.querySelector('#f-time').addEventListener('input', function (e) {
          frogTime = parseInt(e.target.value, 10);
          seenModes.frog = true;
          global.JuniorStore.touchInteraction(UNIT_ID);
          updateControlsAndFormula();
          checkExploreComplete();
        });

        formulaBox.innerHTML =
          '<div style="background:#f1f5f9;padding:12px;border-radius:8px;font-size:1.05rem;">' +
            '位置 = 速度 × 時間<br>' +
            '<span class="math-expr">(' + (frogVelocity > 0 ? '+' + frogVelocity : frogVelocity) + ') × (' + (frogTime > 0 ? '+' + frogTime : frogTime) + ') = <strong>' + (pos > 0 ? '+' + pos : pos) + '</strong></span>' +
          '</div>' +
          '<div style="margin-top:10px;font-size:0.9rem;color:#334155;">' +
            (frogVelocity < 0 && frogTime < 0
              ? '<div class="counterexample-box success">🎥 <strong>雙重反轉發生了！</strong>青蛙本來一直「往左走 (−2)」，在 ' + Math.abs(frogTime) + ' 秒前（倒帶 −' + Math.abs(frogTime) + '）牠其實站在<strong>右邊 +' + pos + '</strong>，這樣才有辦法往左走到 0！</div>'
              : '👆 把時間軸拉到負數（−3 秒倒帶），看看面向左邊的青蛙 3 秒前站在哪裡！') +
          '</div>';
      }
    }

    function drawFrame() {
      animT += 0.04;
      ctx.clearRect(0, 0, setup.width, setup.height);

      if (mode === 'balloon') {
        var targetH = balloons - sandbags;
        currentYDisplay += (targetH - currentYDisplay) * 0.12;

        // 垂直數線尺
        var axisX = 110;
        var zeroY = 175;
        var pxPerUnit = 26;
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(axisX, 20);
        ctx.lineTo(axisX, 325);
        ctx.stroke();

        for (var v = -5; v <= 5; v++) {
          var ty = zeroY - v * pxPerUnit;
          ctx.strokeStyle = v === 0 ? '#0f172a' : '#94a3b8';
          ctx.beginPath();
          ctx.moveTo(axisX - 8, ty);
          ctx.lineTo(axisX + 8, ty);
          ctx.stroke();
          ctx.fillStyle = v === 0 ? '#0f172a' : '#64748b';
          ctx.font = v === 0 ? 'bold 13px sans-serif' : '12px sans-serif';
          ctx.textAlign = 'right';
          ctx.fillText(v > 0 ? '+' + v : String(v), axisX - 14, ty + 4);
        }

        var basketY = zeroY - currentYDisplay * pxPerUnit + Math.sin(animT) * 2;
        var centerX = 320;

        // 指示虛線
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#2563eb';
        ctx.beginPath();
        ctx.moveTo(axisX + 10, basketY);
        ctx.lineTo(centerX - 38, basketY);
        ctx.stroke();
        ctx.setLineDash([]);

        // 畫上方氣球
        for (var b = 0; b < balloons; b++) {
          var bx = centerX - (balloons - 1) * 18 + b * 36;
          var by = basketY - 82 + Math.sin(animT + b) * 3;
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(centerX, basketY - 12);
          ctx.lineTo(bx, by + 16);
          ctx.stroke();

          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(bx, by, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('+1', bx, by + 4);
        }

        // 畫吊籃
        ctx.fillStyle = '#b45309';
        ctx.fillRect(centerX - 34, basketY - 12, 68, 30);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('高度 ' + (targetH >= 0 ? '+' + targetH : targetH), centerX, basketY + 8);

        // 畫下方沙包
        for (var s = 0; s < sandbags; s++) {
          var sx = centerX - (sandbags - 1) * 18 + s * 36;
          var sy = basketY + 54;
          ctx.strokeStyle = '#475569';
          ctx.beginPath();
          ctx.moveTo(centerX, basketY + 18);
          ctx.lineTo(sx, sy - 10);
          ctx.stroke();

          ctx.fillStyle = '#1d4ed8';
          ctx.fillRect(sx - 12, sy - 10, 24, 22);
          ctx.fillStyle = '#fff';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText('−1', sx, sy + 5);
        }
      } else {
        // 青蛙倒帶模式數線
        var lineY = 200;
        var originX = 270;
        var unitW = 32;

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(30, lineY);
        ctx.lineTo(510, lineY);
        ctx.stroke();

        for (var n = -7; n <= 7; n++) {
          var nx = originX + n * unitW;
          ctx.strokeStyle = n === 0 ? '#dc2626' : '#64748b';
          ctx.lineWidth = n === 0 ? 2.5 : 1.5;
          ctx.beginPath();
          ctx.moveTo(nx, lineY - 8);
          ctx.lineTo(nx, lineY + 8);
          ctx.stroke();
          ctx.fillStyle = n === 0 ? '#dc2626' : '#334155';
          ctx.font = n === 0 ? 'bold 13px sans-serif' : '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(n > 0 ? '+' + n : String(n), nx, lineY + 25);
        }

        var targetX = originX + frogVelocity * frogTime * unitW;
        // 向量軌跡弧線
        if (frogTime !== 0) {
          var steps = Math.abs(frogTime);
          var dirSign = frogTime > 0 ? 1 : -1;
          for (var step = 0; step < steps; step++) {
            var xStart = originX + step * frogVelocity * dirSign * unitW;
            var xEnd = originX + (step + 1) * frogVelocity * dirSign * unitW;
            var midX = (xStart + xEnd) / 2;
            ctx.strokeStyle = (frogVelocity * frogTime) >= 0 ? 'rgba(22, 163, 74, 0.75)' : 'rgba(220, 38, 38, 0.75)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(xStart, lineY - 12);
            ctx.quadraticCurveTo(midX, lineY - 68, xEnd, lineY - 12);
            ctx.stroke();
          }
        }

        // 畫青蛙
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(targetX, lineY - 26, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🐸', targetX, lineY - 20);

        // 方向箭頭標籤
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(
          (frogVelocity < 0 ? '◀ 面朝左移動 ' : '面朝右移動 ▶ ') + '｜' + (frogTime < 0 ? '⏪ 倒帶中' : (frogTime > 0 ? '⏩ 快轉中' : '⏸ 原點 0 秒')),
          270, 56
        );
        ctx.fillStyle = '#2563eb';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('所在座標：' + (frogVelocity * frogTime > 0 ? '+' + (frogVelocity * frogTime) : (frogVelocity * frogTime)), 270, 84);
      }

      rafId = global.requestAnimationFrame(drawFrame);
    }

    btnModeA.addEventListener('click', function () {
      mode = 'balloon';
      seenModes.balloon = true;
      btnModeA.classList.add('active');
      btnModeB.classList.remove('active');
      updateControlsAndFormula();
      checkExploreComplete();
    });

    btnModeB.addEventListener('click', function () {
      mode = 'frog';
      seenModes.frog = true;
      btnModeB.classList.add('active');
      btnModeA.classList.remove('active');
      updateControlsAndFormula();
      checkExploreComplete();
    });

    nextBtn.addEventListener('click', function () {
      shell.goToStage('EXPLAIN');
    });

    updateControlsAndFormula();
    checkExploreComplete();
    drawFrame();

    return function cleanup() {
      if (rafId) global.cancelAnimationFrame(rafId);
    };
  }

  function renderExplain(bodyEl, shell) {
    shell.markStageDone('EXPLAIN', 25);
    bodyEl.innerHTML =
      '<div class="explain-grid">' +
        '<div class="principle-card">' +
          '<h3 style="margin-top:0;">📐 核心原理：為什麼會這樣？</h3>' +
          '<ol style="padding-left:20px;margin:0;line-height:1.85;">' +
            '<li><strong>負數就是「反方向指令」：</strong>數線以 0 為基準，正往右、負往左。</li>' +
            '<li><strong>絕對值 |a| 的本質是「距離」：</strong>從 0 走到 a 要跨幾步？距離不會有負數，所以 |−5| = 5。</li>' +
            '<li><strong>負負得正（兩次反轉回正向）：</strong>減掉負數等於「拿走負擔」；乘除負數等於「朝左走＋影片倒帶」。</li>' +
          '</ol>' +
        '</div>' +
        '<div class="faq-card">' +
          '<h3 style="margin-top:0;">💡 學生高頻疑問 × 最簡單解法</h3>' +
          '<div class="faq-item">' +
            '<div class="faq-q">疑問 1：「−a 前面有負號，所以 −a 一定是負數嗎？」</div>' +
            '<div class="faq-a"><strong>最簡單解法：</strong>把負號唸成「<strong>的相反數</strong>」！如果 a = −5，那 −a 就是「−5 的相反數」= +5（正數）！</div>' +
          '</div>' +
          '<div class="faq-item">' +
            '<div class="faq-q">疑問 2：「為什麼 −3 − 5 = −8，而不是負負得正變成 +8？」</div>' +
            '<div class="faq-a"><strong>最簡單解法：</strong>區分「兩筆帳分開算」vs「兩個負號碰在一起」！−3 − 5 是「欠 3 元<strong>又</strong>欠 5 元」，沒有乘法也沒有減負數，不會反轉！只有 <strong>−(−)</strong> 或 <strong>(−) × (−)</strong> 才是雙重反轉！</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:18px;text-align:right;">' +
        '<button id="m11-to-eval" class="btn-primary">前往階段 ④：迷思反例打臉與會考雙解關卡 →</button>' +
      '</div>';

    bodyEl.querySelector('#m11-to-eval').addEventListener('click', function () {
      shell.goToStage('EVALUATE');
    });
  }

  function renderEvaluate(bodyEl, shell) {
    var quizDone = false;
    var doubleSolDone = false;

    bodyEl.innerHTML =
      '<div class="dual-view-grid">' +
        '<div class="canvas-panel">' +
          '<div class="panel-title"><span>⚡ 關卡 1：迷思反例抓錯（−3 − 5 等於多少？）</span></div>' +
          '<p style="margin:0 0 10px;">請問 <span class="math-expr">−3 − 5</span> 的正確結果是？</p>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px;">' +
            '<button class="btn-light m11-ans" data-val="+8">+8（負負得正）</button>' +
            '<button class="btn-light m11-ans" data-val="-2">−2（大的減小的）</button>' +
            '<button class="btn-light m11-ans" data-val="-8">−8（往左 3 步再往左 5 步）</button>' +
          '</div>' +
          '<canvas id="m11-eval-canvas" class="sim-canvas"></canvas>' +
          '<div id="m11-eval-feedback"></div>' +
        '</div>' +
        '<div class="logic-panel">' +
          '<div class="panel-title"><span>🎯 關卡 2：會考「直線 AB 雙解檢查燈」</span></div>' +
          '<p style="font-size:0.9rem;margin:0 0 10px;">題目：數線上 A(0)、B(3)，請問「<strong>直線 AB 上</strong>」滿足 PA = 2 × PB 的點 P 在哪裡？（必須找出全部位置才亮雙燈！）</p>' +
          '<div class="slider-group" style="margin-bottom:10px;">' +
            '<label>點選找到的點 P 座標：</label>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;">' +
              '<button class="btn-light m11-p-btn" data-p="1">P = 1</button>' +
              '<button class="btn-light m11-p-btn" data-p="2">P = 2</button>' +
              '<button class="btn-light m11-p-btn" data-p="4.5">P = 4.5</button>' +
              '<button class="btn-light m11-p-btn" data-p="6">P = 6</button>' +
            '</div>' +
          '</div>' +
          '<div id="m11-lamps" style="display:flex;gap:12px;margin:10px 0;">' +
            '<div id="lamp-1" style="flex:1;padding:10px;border-radius:8px;background:#e2e8f0;text-align:center;font-weight:700;">💡 線段內解：未點亮</div>' +
            '<div id="lamp-2" style="flex:1;padding:10px;border-radius:8px;background:#e2e8f0;text-align:center;font-weight:700;">💡 B 點外側解：未點亮</div>' +
          '</div>' +
          '<div id="m11-p-feedback"></div>' +
        '</div>' +
      '</div>';

    var evalCanvas = bodyEl.querySelector('#m11-eval-canvas');
    var setup = global.JuniorSolverUI.setupCanvas(evalCanvas, 500, 180);
    var ctx = setup.ctx;
    var evalFb = bodyEl.querySelector('#m11-eval-feedback');
    var pFb = bodyEl.querySelector('#m11-p-feedback');

    function drawEvalAxis(highlightVal, showTwoLeftJumps) {
      ctx.clearRect(0, 0, setup.width, setup.height);
      var y = 115;
      var cx = 270;
      var u = 22;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(480, y);
      ctx.stroke();

      for (var i = -9; i <= 9; i++) {
        var x = cx + i * u;
        ctx.beginPath();
        ctx.moveTo(x, y - 6);
        ctx.lineTo(x, y + 6);
        ctx.stroke();
        if (i % 3 === 0 || i === -8 || i === -3 || i === 8) {
          ctx.fillStyle = i === 0 ? '#dc2626' : '#475569';
          ctx.font = '11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(String(i), x, y + 20);
        }
      }

      if (showTwoLeftJumps) {
        // 從 0 跳到 -3 再跳到 -8
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx, y - 8);
        ctx.quadraticCurveTo(cx - 1.5 * u, y - 55, cx - 3 * u, y - 8);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx - 3 * u, y - 8);
        ctx.quadraticCurveTo(cx - 5.5 * u, y - 68, cx - 8 * u, y - 8);
        ctx.stroke();

        ctx.fillStyle = '#dc2626';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('先左跳 3 (−3)，再左跳 5 → 掉進 −8！完全沒反轉！', 250, 32);
      }

      if (highlightVal !== null) {
        ctx.fillStyle = highlightVal === -8 ? '#16a34a' : '#dc2626';
        ctx.beginPath();
        ctx.arc(cx + highlightVal * u, y - 16, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    drawEvalAxis(null, false);

    function checkAllDone() {
      if (quizDone && doubleSolDone) {
        shell.markStageDone('EVALUATE', 40);
        shell.unlockBadge('MYTH_BUSTER_NEGATIVES', 80);
      }
    }

    bodyEl.querySelectorAll('.m11-ans').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.getAttribute('data-val');
        global.JuniorStore.recordAttempt(UNIT_ID);
        if (val === '+8') {
          global.JuniorStore.recordMisconception(UNIT_ID, 'MIS_OVERGENERALIZE_NEG_NEG', '將 −3 − 5 誤套用「負負得正」算成 +8');
          drawEvalAxis(8, true);
          evalFb.innerHTML = '<div class="counterexample-box error">🚨 <strong>反例演示：</strong>你看上圖！青蛙先往左跳 3 步到 −3，減 5 就是「繼續往左跳 5 步」，怎麼可能瞬間飛去右邊 +8 呢？這不是乘法也沒有雙負號 −(−5)！</div>';
        } else if (val === '-2') {
          global.JuniorStore.recordMisconception(UNIT_ID, 'MIS_SUBTRACT_SIGN_CONFUSION', '混淆 −3 − 5 與 5 − 3 絕對值相減');
          drawEvalAxis(-2, true);
          evalFb.innerHTML = '<div class="counterexample-box error">🚨 <strong>反例演示：</strong>欠 3 元又欠 5 元，負債只會累積越來越多，不可能變回只欠 2 元喔！</div>';
        } else {
          quizDone = true;
          global.JuniorStore.resolveMisconception(UNIT_ID, 'MIS_OVERGENERALIZE_NEG_NEG');
          global.JuniorStore.resolveMisconception(UNIT_ID, 'MIS_SUBTRACT_SIGN_CONFUSION');
          drawEvalAxis(-8, true);
          evalFb.innerHTML = '<div class="counterexample-box success">✔ 完美破除迷思！兩筆負債累加直接往左走到 −8。</div>';
          checkAllDone();
        }
      });
    });

    var found2 = false;
    var found6 = false;
    bodyEl.querySelectorAll('.m11-p-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var p = btn.getAttribute('data-p');
        if (p === '2') {
          found2 = true;
          btn.classList.add('active');
          bodyEl.querySelector('#lamp-1').style.background = '#dcfce7';
          bodyEl.querySelector('#lamp-1').style.color = '#15803d';
          bodyEl.querySelector('#lamp-1').textContent = '💡 線段內解 P = 2（PA=2, PB=1）✔';
          pFb.innerHTML = '<div class="counterexample-box success">✔ 抓到第一解 P=2！別忘了題目寫「直線 AB 上」，往 B 的右邊找找看還有沒有第二解！</div>';
        } else if (p === '6') {
          found6 = true;
          btn.classList.add('active');
          bodyEl.querySelector('#lamp-2').style.background = '#dcfce7';
          bodyEl.querySelector('#lamp-2').style.color = '#15803d';
          bodyEl.querySelector('#lamp-2').textContent = '💡 外側解 P = 6（PA=6, PB=3）✔';
          pFb.innerHTML = '<div class="counterexample-box success">✔ 抓到 B 右側外解 P=6！（PA=6 剛好是 PB=3 的 2 倍）。</div>';
        } else {
          pFb.innerHTML = '<div class="counterexample-box error">✖ 代入算算看距離：PA = |' + p + ' − 0|，PB = |' + p + ' − 3|，PA 不是 PB 的 2 倍喔！</div>';
        }

        if (found2 && found6) {
          doubleSolDone = true;
          global.JuniorStore.completeTactic(UNIT_ID, 'LINE_DOUBLE_SOLUTION', 40);
          pFb.innerHTML = '<div class="counterexample-box success">🏆 <strong>會考陷阱雙解全破！</strong>只要看到「直線 AB 上」而不是「線段 AB 上」，永遠記得檢查內分點與外側延長點！</div>';
          checkAllDone();
        }
      });
    });

    return null;
  }

  global.JuniorUnits[UNIT_ID] = { mount: mount };
})(window);
