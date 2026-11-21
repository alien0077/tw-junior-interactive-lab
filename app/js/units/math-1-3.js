/* ==========================================================================
   math-1-3.js — 單元 1-3：一元一次方程式
   雙軌同步動態天平 + 等量公理步驟條 + (-2x=8) 反例 + 年齡差不變積木槽
   ========================================================================== */
(function (global) {
  'use strict';

  var UNIT_ID = 'MATH_7_1_3';

  function mount(container) {
    return global.JuniorSolverUI.renderUnitShell(container, {
      unitId: UNIT_ID,
      badgeText: '📐 七年級數學｜單元 1-3',
      title: '一元一次方程式',
      subtitle: '用物理天平看懂「沒有魔法移項，只有兩邊做同樣的事」，破解 −2x = 8 陷阱',
      goldenRule: '沒有魔法移項，只有「兩邊一起做同樣的事」讓天平維持平衡！',
      hints: [
        '等號「=」就像天平中間的支點。你想把左盤多餘的法碼拿走，只拿左邊的話天平會立刻傾斜；只有左右兩邊同時做一模一樣的動作，等式才成立。',
        '黏在 x 前面的「−2」是乘法關係（−2 × x），想消掉它不能用加法 +2（−2x + 2 消不掉），必須兩邊同時除以 (−2) 才行！'
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
        '<p class="engage-question">⚖️ 天平左盤放了 2 個重量一樣的神秘黑盒（各重 x 克）外加 4 個 1 克法碼；右盤放了 10 個 1 克法碼，現在天平完全水平！請問不打開黑盒，怎樣利用天平操作知道 1 個黑盒多重？</p>' +
        '<div class="prediction-grid">' +
          '<button class="pred-btn" data-c="onlyleft">A. 直接把左邊 4 個法碼丟進垃圾桶，變成 2x = 10</button>' +
          '<button class="pred-btn" data-c="both">B. 左右兩邊「同時拿走 4 個法碼」保持平衡，再「同時平分一半」！</button>' +
          '<button class="pred-btn" data-c="guess">C. 只能靠硬猜數字代入，沒有系統做法</button>' +
        '</div>' +
        '<div id="m13-eng-msg"></div>' +
        '<button id="m13-to-exp" class="btn-primary hidden" style="margin-top:12px;">進入階段 ②：親手操作雙軌同步天平 →</button>' +
      '</div>';

    var msgEl = bodyEl.querySelector('#m13-eng-msg');
    var nextBtn = bodyEl.querySelector('#m13-to-exp');
    bodyEl.querySelectorAll('.pred-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        bodyEl.querySelectorAll('.pred-btn').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        if (btn.getAttribute('data-c') === 'both') {
          msgEl.innerHTML = '<div class="counterexample-box success">✔ 沒錯！這就是「等量公理」的真諦。接下來到天平實際試試看如果偷懶只動一邊會發生什麼事！</div>';
          shell.markStageDone('ENGAGE', 25);
        } else {
          msgEl.innerHTML = '<div class="counterexample-box error">⚠️ 如果只從左邊拿走法碼，右邊會變比較重把天平壓歪，等號就破裂了！到下一步親自試試平衡天平！</div>';
          shell.markStageDone('ENGAGE', 15);
        }
        nextBtn.classList.remove('hidden');
      });
    });
    nextBtn.addEventListener('click', function () { shell.goToStage('EXPLORE'); });
  }

  function renderExplore(bodyEl, shell) {
    // 起始狀態：2x + 4 = 10 (真實 x = 3)
    var leftBoxes = 2;
    var leftWeights = 4;
    var rightWeights = 10;
    var trueX = 3;
    var tiltAngle = 0;
    var targetTilt = 0;
    var stepHistory = ['初始平衡：2x + 4 = 10'];
    var rafId = null;

    bodyEl.innerHTML =
      '<div class="dual-view-grid">' +
        '<div class="canvas-panel">' +
          '<div class="panel-title"><span>⚖️ 雙軌同步物理天平</span><span id="m13-balance-pill" class="badge-status status-mastered">平衡中</span></div>' +
          '<canvas id="m13-canvas" class="sim-canvas"></canvas>' +
          '<div class="controls-bar">' +
            '<button id="m13-left-only" class="btn-light">⚠️ 只拿走左邊 4 個法碼</button>' +
            '<button id="m13-both-sub4" class="btn-primary">⚖️ 兩邊同時減 4（等量減法）</button>' +
            '<button id="m13-both-div2" class="btn-primary" disabled>➗ 兩邊同時平分 ÷2</button>' +
            '<button id="m13-reset" class="btn-light">↺ 重來</button>' +
          '</div>' +
        '</div>' +
        '<div class="logic-panel">' +
          '<div class="panel-title"><span>📝 等量公理 → 移項變形過程</span></div>' +
          '<div id="m13-steps" style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:14px;font-size:0.94rem;"></div>' +
          '<div id="m13-explore-status" style="margin-top:12px;"></div>' +
          '<button id="m13-to-explain" class="btn-primary hidden" style="margin-top:12px;">解出 x = 3！前往階段 ③ 總結原理 →</button>' +
        '</div>' +
      '</div>';

    var canvas = bodyEl.querySelector('#m13-canvas');
    var setup = global.JuniorSolverUI.setupCanvas(canvas, 540, 320);
    var ctx = setup.ctx;
    var stepsEl = bodyEl.querySelector('#m13-steps');
    var statusEl = bodyEl.querySelector('#m13-explore-status');
    var pillEl = bodyEl.querySelector('#m13-balance-pill');
    var btnLeftOnly = bodyEl.querySelector('#m13-left-only');
    var btnSub4 = bodyEl.querySelector('#m13-both-sub4');
    var btnDiv2 = bodyEl.querySelector('#m13-both-div2');
    var btnReset = bodyEl.querySelector('#m13-reset');
    var nextBtn = bodyEl.querySelector('#m13-to-explain');

    function updateUI() {
      var lw = leftBoxes * trueX + leftWeights;
      var rw = rightWeights;
      var diff = rw - lw;
      targetTilt = Math.max(-0.24, Math.min(0.24, diff * 0.05));

      if (diff === 0) {
        pillEl.className = 'badge-status status-mastered';
        pillEl.style.background = '';
        pillEl.style.color = '';
        pillEl.textContent = '✔ 左右等重平衡';
      } else {
        pillEl.className = 'badge-status status-inprogress';
        pillEl.style.background = '#fee2e2';
        pillEl.style.color = '#b91c1c';
        pillEl.textContent = diff > 0 ? '🚨 右邊比較重！等式破裂' : '🚨 左邊比較重！等式破裂';
      }

      stepsEl.innerHTML = stepHistory.map(function (s, idx) {
        return '<div style="padding:6px 8px;border-bottom:1px dashed #e2e8f0;' + (idx === stepHistory.length - 1 ? 'font-weight:700;color:#1d4ed8;' : 'color:#475569;') + '">' + (idx + 1) + '. ' + s + '</div>';
      }).join('');

      if (leftBoxes === 1 && leftWeights === 0 && rightWeights === 3) {
        statusEl.innerHTML = '<div class="counterexample-box success">🎉 <strong>解出 x = 3！</strong>你看，「+4 移到右邊變 −4」其實只是「兩邊同時 −4，左邊剛好抵銷」的簡寫而已！</div>';
        nextBtn.classList.remove('hidden');
        shell.markStageDone('EXPLORE', 35);
      }
    }

    btnLeftOnly.addEventListener('click', function () {
      if (leftWeights >= 4) {
        leftWeights -= 4;
        stepHistory.push('❌ 錯誤示範：2x + 4 − 4 ≠ 10（左輕右重，等號失效！）');
        statusEl.innerHTML = '<div class="counterexample-box error">⚠️ <strong>天平傾斜了！</strong>你只消掉左邊的 4，右邊沒跟著減 4，左右不再相等，不能寫等號！請點「↺ 重來」或補救。</div>';
        global.JuniorStore.touchInteraction(UNIT_ID);
        updateUI();
      }
    });

    btnSub4.addEventListener('click', function () {
      if (leftWeights === 4 && rightWeights === 10) {
        leftWeights = 0;
        rightWeights = 6;
        stepHistory.push('2x + 4 − 4 = 10 − 4  （兩邊同減 4 維持平衡）');
        stepHistory.push('2x = 6  （左邊 +4 與 −4 抵銷，看起來就像 +4 移過去變 −4！）');
        btnSub4.disabled = true;
        btnLeftOnly.disabled = true;
        btnDiv2.disabled = false;
        global.JuniorStore.touchInteraction(UNIT_ID);
        updateUI();
      }
    });

    btnDiv2.addEventListener('click', function () {
      if (leftBoxes === 2 && leftWeights === 0 && rightWeights === 6) {
        leftBoxes = 1;
        rightWeights = 3;
        stepHistory.push('2x ÷ 2 = 6 ÷ 2  （兩盤各自平分一半）');
        stepHistory.push('✔ 解得 x = 3');
        btnDiv2.disabled = true;
        global.JuniorStore.touchInteraction(UNIT_ID);
        updateUI();
      }
    });

    btnReset.addEventListener('click', function () {
      leftBoxes = 2; leftWeights = 4; rightWeights = 10;
      btnSub4.disabled = false; btnLeftOnly.disabled = false; btnDiv2.disabled = true;
      stepHistory = ['初始平衡：2x + 4 = 10'];
      statusEl.innerHTML = '';
      updateUI();
    });

    nextBtn.addEventListener('click', function () { shell.goToStage('EXPLAIN'); });

    function drawScale() {
      tiltAngle += (targetTilt - tiltAngle) * 0.14;
      ctx.clearRect(0, 0, setup.width, setup.height);

      var pivotX = 270;
      var pivotY = 175;
      var armHalf = 145;

      // 支點三角底座
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(pivotX - 28, 285);
      ctx.lineTo(pivotX + 28, 285);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(pivotX - 60, 285, 120, 12);

      // 左右盤座標
      var lx = pivotX - Math.cos(tiltAngle) * armHalf;
      var ly = pivotY - Math.sin(tiltAngle) * armHalf;
      var rx = pivotX + Math.cos(tiltAngle) * armHalf;
      var ry = pivotY + Math.sin(tiltAngle) * armHalf;

      // 橫樑
      ctx.strokeStyle = targetTilt === 0 ? '#0f172a' : '#dc2626';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(rx, ry);
      ctx.stroke();

      // 支點軸心
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
      ctx.fill();

      function drawPan(px, py, boxes, weights, labelText) {
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - 45, py + 45);
        ctx.moveTo(px, py);
        ctx.lineTo(px + 45, py + 45);
        ctx.stroke();

        ctx.fillStyle = '#475569';
        ctx.fillRect(px - 62, py + 45, 124, 8);

        var curX = px - 52;
        for (var i = 0; i < boxes; i++) {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(curX, py + 14, 30, 30);
          ctx.fillStyle = '#38bdf8';
          ctx.font = 'bold 14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('x', curX + 15, py + 34);
          curX += 34;
        }
        for (var w = 0; w < weights; w++) {
          var row = Math.floor(w / 5);
          var col = w % 5;
          var wx = curX + col * 14;
          var wy = py + 32 - row * 14;
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(wx, wy, 12, 12);
        }

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(labelText, px, py + 76);
      }

      drawPan(lx, ly, leftBoxes, leftWeights, '左盤：' + leftBoxes + 'x + ' + leftWeights);
      drawPan(rx, ry, 0, rightWeights, '右盤：' + rightWeights);

      rafId = global.requestAnimationFrame(drawScale);
    }

    updateUI();
    drawScale();

    return function cleanup() {
      if (rafId) global.cancelAnimationFrame(rafId);
    };
  }

  function renderExplain(bodyEl, shell) {
    shell.markStageDone('EXPLAIN', 25);
    bodyEl.innerHTML =
      '<div class="explain-grid">' +
        '<div class="principle-card">' +
          '<h3 style="margin-top:0;">📐 核心原理：等量公理與拆禮物順序</h3>' +
          '<ol style="padding-left:20px;margin:0;line-height:1.85;">' +
            '<li><strong>移項變號＝等量公理簡寫：</strong><span class="math-expr">x + 3 = 7</span> 兩邊同時減 3 變成 <span class="math-expr">x = 7 − 3</span>，根本不是跳過等號變臉的魔法。</li>' +
            '<li><strong>先拆外層加減、最後除掉黏著係數：</strong>像拆禮物一樣，先消去遠離 x 的加減常數，最後才除以 x 前面的係數。</li>' +
          '</ol>' +
        '</div>' +
        '<div class="faq-card">' +
          '<h3 style="margin-top:0;">💡 學生高頻疑問 × 最簡單解法</h3>' +
          '<div class="faq-item">' +
            '<div class="faq-q">疑問 1：「−2x = 8 移項時會寫成 x = 8 + 2？」</div>' +
            '<div class="faq-a"><strong>最簡單解法：</strong>問自己「怎麼消掉原本這側的障礙？」−2 跟 x 是<strong>乘法黏著</strong>，不能用 +2 消掉！只能兩邊同時「除以 (−2)」，負號跟著除數走！</div>' +
          '</div>' +
          '<div class="faq-item">' +
            '<div class="faq-q">疑問 2：「應用題落落長，不知道哪裡要放等號 =？」</div>' +
            '<div class="faq-a"><strong>最簡單解法：</strong>在題目裡直接圈出中文裡的「<strong>是、為、共、剛好、等於、一樣多</strong>」，這幾個字就是等號，左邊翻譯放左盤、右邊放右盤！</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:18px;text-align:right;">' +
        '<button id="m13-to-eval" class="btn-primary">前往階段 ④：−2x = 8 陷阱反例＆年齡差積木槽 →</button>' +
      '</div>';

    bodyEl.querySelector('#m13-to-eval').addEventListener('click', function () {
      shell.goToStage('EVALUATE');
    });
  }

  function renderEvaluate(bodyEl, shell) {
    var counterDone = false;
    var tacticDone = false;

    bodyEl.innerHTML =
      '<div class="canvas-panel" style="margin-bottom:18px;">' +
        '<div class="panel-title"><span>⚡ 迷思陷阱測試：遇到 <span class="math-expr">−2x = 8</span>，下一步兩邊要怎麼操作？</span></div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">' +
          '<button class="btn-light m13-trap" data-op="add2">A. 兩邊同時 + 2（因為 −2 移過去變 +2）</button>' +
          '<button class="btn-light m13-trap" data-op="div2">B. 兩邊同時 ÷ 2（只除數字不除負號）</button>' +
          '<button class="btn-light m13-trap" data-op="divneg2">C. 兩邊同時 ÷ (−2)（解開 −2 倍的乘法黏著）</button>' +
        '</div>' +
        '<div id="m13-trap-fb"></div>' +
      '</div>' +
      '<div id="m13-tactic-mount"></div>';

    var trapFb = bodyEl.querySelector('#m13-trap-fb');
    function checkAll() {
      if (counterDone && tacticDone) {
        shell.markStageDone('EVALUATE', 40);
        shell.unlockBadge('MYTH_BUSTER_BALANCE', 80);
      }
    }

    bodyEl.querySelectorAll('.m13-trap').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var op = btn.getAttribute('data-op');
        global.JuniorStore.recordAttempt(UNIT_ID);
        if (op === 'add2') {
          global.JuniorStore.recordMisconception(UNIT_ID, 'MIS_MOVE_MULTIPLY_AS_ADD', '解 −2x = 8 時誤將係數 −2 當成減 2，移項變成 +2');
          trapFb.innerHTML =
            '<div class="counterexample-box error">🚨 <strong>反例演示：</strong>試試看兩邊同時 + 2！<br>' +
            '左邊變成：<span class="math-expr">−2x + 2</span>（根本沒有把 −2 消掉，x 還是被綁住！）<br>' +
            '右邊變成：<span class="math-expr">8 + 2 = 10</span> → 你只把算式變更醜了！乘法黏著一定要用除法消去！</div>';
        } else if (op === 'div2') {
          trapFb.innerHTML =
            '<div class="counterexample-box error">⚠️ <strong>差一點！</strong>兩邊 ÷ 2 後左邊會剩下 <span class="math-expr">−x = 4</span>，還留著一個負號沒解完喔！再試著連負號一起除掉。</div>';
        } else {
          counterDone = true;
          global.JuniorStore.resolveMisconception(UNIT_ID, 'MIS_MOVE_MULTIPLY_AS_ADD');
          trapFb.innerHTML =
            '<div class="counterexample-box success">✔ <strong>完全正確！</strong>兩邊同 ÷ (−2)：左邊 <span class="math-expr">(−2x) ÷ (−2) = x</span>，右邊 <span class="math-expr">8 ÷ (−2) = −4</span>！負號跟著除數一起過去，不會變加號！</div>';
          checkAll();
        }
      });
    });

    global.JuniorSolverUI.mountTacticAssembler(bodyEl.querySelector('#m13-tactic-mount'), {
      unitId: UNIT_ID,
      tacticCode: 'AGE_DIFFERENCE_INVARIANT',
      title: '年齡問題速解（年齡差不變原則）',
      problemText: '父親今年 40 歲，兒子今年 10 歲，請問幾年後父親的年齡剛好是兒子的 3 倍？',
      slots: [
        { label: '步驟 1：抓住不變的基準量', expectedId: 'diff' },
        { label: '步驟 2：用倍數差對齊年齡差', expectedId: 'parts' },
        { label: '步驟 3：算出幾年後的差距', expectedId: 'years' }
      ],
      chips: [
        { id: 'parts', label: '父親 3 份 − 兒子 1 份 = 2 份 = 30 歲 → 當時兒子 1 份 = 15 歲', wrongReason: '還沒先算出爸爸跟兒子相差幾歲！先把固定的年齡差算出來。' },
        { id: 'wrong_ratio', label: '直接拿現在 40 ÷ 10 = 4 倍當差距算', wrongReason: '兩人每年同時長大 1 歲，年齡倍數會一直變，只有「年齡差」永遠不變！' },
        { id: 'diff', label: '先算永遠固定的「年齡差」：40 − 10 = 30 歲' },
        { id: 'years', label: '兒子從現在 10 歲長到 15 歲 → 15 − 10 = 5 年後' }
      ],
      finalSummaryHtml: '🏆 <strong>秒殺心得：</strong>年齡問題永遠抓住「年齡差不變」！不用設一堆 x 也能心算秒殺：差 30 歲、差 2 份 → 兒子 15 歲 → 5 年後！',
      onComplete: function () {
        tacticDone = true;
        checkAll();
      }
    });

    return null;
  }

  global.JuniorUnits[UNIT_ID] = { mount: mount };
})(window);
