/* ==========================================================================
   solver-ui.js — 統一四階段外殼、HiDPI Canvas、鷹架提示抽屜、解題訓練元件
   ========================================================================== */
(function (global) {
  'use strict';

  global.JuniorUnits = global.JuniorUnits || {};

  function showToast(msg) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 3200);
  }

  /**
   * 處理 Retina / HiDPI Canvas 清晰渲染
   */
  function setupCanvas(canvas, logicalWidth, logicalHeight) {
    var dpr = global.devicePixelRatio || 1;
    canvas.width = Math.round(logicalWidth * dpr);
    canvas.height = Math.round(logicalHeight * dpr);
    canvas.style.width = '100%';
    canvas.style.maxWidth = logicalWidth + 'px';
    canvas.style.aspectRatio = logicalWidth + ' / ' + logicalHeight;
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, width: logicalWidth, height: logicalHeight };
  }

  /**
   * 建立四階段統一互動教學外殼
   * config: {
   *   unitId, badgeText, title, subtitle, goldenRule,
   *   hints: [level1Text, level2Html],
   *   onRenderStage: function(stageKey, stageBodyEl, shellApi)
   * }
   */
  function renderUnitShell(container, config) {
    var unitId = config.unitId;
    var unitState = global.JuniorStore.getUnitState(unitId);
    var activeStage = 'ENGAGE';
    var hintLevel = unitState.hintsUsedLevel || 0;
    var stageCleanup = null;

    var STAGES = [
      { key: 'ENGAGE', num: '1', label: '情境衝突提問' },
      { key: 'EXPLORE', num: '2', label: '雙視角動手探索' },
      { key: 'EXPLAIN', num: '3', label: '原理與疑問詳解' },
      { key: 'EVALUATE', num: '4', label: '迷思反例與破題' },
      { key: 'HANDBOOK', num: '5', label: '完整講義與題型全攻略' }
    ];

    container.innerHTML =
      '<div class="unit-shell">' +
        '<div class="unit-header-bar">' +
          '<div>' +
            '<div class="unit-header-meta">' +
              '<span>' + config.badgeText + '</span>' +
              '<span id="shell-mastery-badge"></span>' +
            '</div>' +
            '<h2>' + config.title + '</h2>' +
            '<div style="color:#cbd5e1;font-size:0.88rem;margin-top:4px;">' + config.subtitle + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">' +
            '<button id="shell-handbook-btn" class="btn-secondary">📖 完整題型講義</button>' +
            '<button id="shell-back-btn" class="btn-ghost">← 返回單元總覽</button>' +
          '</div>' +
        '</div>' +

        '<div id="shell-golden-banner" class="golden-rule-banner locked">' +
          '<div>' +
            '<span id="shell-golden-icon">🔒</span> ' +
            '<span id="shell-golden-text" class="golden-rule-text">請先於階段 ② 完成雙視角探索，即可解鎖本單元「微概念金句條」！</span>' +
          '</div>' +
          '<small id="shell-golden-status">未解鎖</small>' +
        '</div>' +

        '<div class="stage-stepper" id="shell-stepper"></div>' +
        '<div class="unit-stage-body" id="shell-stage-body"></div>' +

        '<div class="hint-drawer-wrap">' +
          '<div class="hint-controls">' +
            '<span style="font-size:0.86rem;color:#475569;">💡 卡關了嗎？均一微概念兩段式鷹架提示：</span>' +
            '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
              '<button id="btn-hint-1" class="btn-light">第 1 層提示：生活類比線索</button>' +
              '<button id="btn-hint-2" class="btn-light">第 2 層提示：「為什麼」原理圖解</button>' +
            '</div>' +
          '</div>' +
          '<div id="shell-hint-area"></div>' +
        '</div>' +
      '</div>';

    var stepperEl = container.querySelector('#shell-stepper');
    var stageBodyEl = container.querySelector('#shell-stage-body');
    var goldenBanner = container.querySelector('#shell-golden-banner');
    var goldenIcon = container.querySelector('#shell-golden-icon');
    var goldenText = container.querySelector('#shell-golden-text');
    var goldenStatus = container.querySelector('#shell-golden-status');
    var masteryBadge = container.querySelector('#shell-mastery-badge');
    var hintArea = container.querySelector('#shell-hint-area');

    container.querySelector('#shell-back-btn').addEventListener('click', function () {
      if (global.JuniorApp && global.JuniorApp.goHome) {
        global.JuniorApp.goHome();
      }
    });

    var hbBtn = container.querySelector('#shell-handbook-btn');
    if (hbBtn) {
      hbBtn.addEventListener('click', function () {
        switchStage('HANDBOOK');
      });
    }

    function refreshHeader() {
      var st = global.JuniorStore.getUnitState(unitId);
      var unlocked = st.completedStages.indexOf('EXPLORE') !== -1 || st.completedStages.indexOf('EXPLAIN') !== -1;
      if (unlocked) {
        goldenBanner.classList.remove('locked');
        goldenIcon.textContent = '✨ 核心金句已解鎖：';
        goldenText.textContent = config.goldenRule;
        goldenStatus.textContent = '已定錨';
      } else {
        goldenBanner.classList.add('locked');
        goldenIcon.textContent = '🔒';
        goldenText.textContent = '完成階段 ②「雙視角動手探索」後，將自動凝結本單元核心金句！';
        goldenStatus.textContent = '探索後解鎖';
      }

      if (st.masteryLevel === 'MASTERED') {
        masteryBadge.innerHTML = '<span class="badge-status status-mastered">★ 已精熟</span>';
      } else if (st.masteryLevel === 'IN_PROGRESS') {
        masteryBadge.innerHTML = '<span class="badge-status status-inprogress">進行中</span>';
      } else {
        masteryBadge.innerHTML = '<span class="badge-status status-ready">新單元</span>';
      }
    }

    function renderStepper() {
      var st = global.JuniorStore.getUnitState(unitId);
      stepperEl.innerHTML = '';
      STAGES.forEach(function (item) {
        var btn = document.createElement('button');
        var isDone = st.completedStages.indexOf(item.key) !== -1;
        btn.className = 'stage-tab' + (activeStage === item.key ? ' active' : '') + (isDone ? ' done' : '');
        btn.innerHTML = '<span class="stage-num">' + (isDone ? '✓' : item.num) + '</span><span>' + item.label + '</span>';
        btn.addEventListener('click', function () {
          switchStage(item.key);
        });
        stepperEl.appendChild(btn);
      });
    }

    function renderHints() {
      hintArea.innerHTML = '';
      if (hintLevel >= 1 && config.hints && config.hints[0]) {
        hintArea.innerHTML += '<div class="hint-box"><strong>🔍 第 1 層線索（生活類比）：</strong>' + config.hints[0] + '</div>';
      }
      if (hintLevel >= 2 && config.hints && config.hints[1]) {
        hintArea.innerHTML += '<div class="hint-box"><strong>🧠 第 2 層拆解（為什麼）：</strong>' + config.hints[1] + '</div>';
      }
    }

    container.querySelector('#btn-hint-1').addEventListener('click', function () {
      hintLevel = Math.max(hintLevel, 1);
      global.JuniorStore.recordHint(unitId, 1);
      renderHints();
    });

    container.querySelector('#btn-hint-2').addEventListener('click', function () {
      hintLevel = Math.max(hintLevel, 2);
      global.JuniorStore.recordHint(unitId, 2);
      renderHints();
    });

    function switchStage(stageKey) {
      if (typeof stageCleanup === 'function') {
        stageCleanup();
        stageCleanup = null;
      }
      activeStage = stageKey;
      global.JuniorStore.setStage(unitId, stageKey);
      renderStepper();
      refreshHeader();
      stageBodyEl.innerHTML = '';
      var maybeCleanup = null;
      if (stageKey === 'HANDBOOK' && global.JuniorHandbookUI) {
        maybeCleanup = global.JuniorHandbookUI.renderHandbookStage(unitId, stageBodyEl, shellApi);
      } else {
        maybeCleanup = config.onRenderStage(stageKey, stageBodyEl, shellApi);
      }
      if (typeof maybeCleanup === 'function') {
        stageCleanup = maybeCleanup;
      }
    }

    var shellApi = {
      goToStage: function (stageKey) {
        switchStage(stageKey);
      },
      markStageDone: function (stageKey, xpReward) {
        var gained = global.JuniorStore.completeStage(unitId, stageKey, xpReward);
        if (gained > 0) {
          showToast('完成「' + stageKey + '」階段！獲得 +' + gained + ' XP');
        }
        renderStepper();
        refreshHeader();
      },
      unlockBadge: function (badgeId, xpBonus) {
        var badge = global.JuniorStore.awardBadge(badgeId, xpBonus);
        if (badge) {
          showToast('🏅 解鎖徽章：' + badge.icon + ' ' + badge.name + ' (+' + (xpBonus || 80) + ' XP)');
        }
        refreshHeader();
      },
      refresh: function () {
        renderStepper();
        refreshHeader();
      }
    };

    renderStepper();
    refreshHeader();
    renderHints();
    var initialStage = global.__juniorPendingInitialStage || 'ENGAGE';
    global.__juniorPendingInitialStage = null;
    switchStage(initialStage);

    return function unmountShell() {
      if (typeof stageCleanup === 'function') {
        stageCleanup();
        stageCleanup = null;
      }
    };
  }

  /**
   * 元件 A：KeywordRadarOverlay（關鍵字雷達圈選器）
   * config: {
   *   unitId, tacticCode, title,
   *   tokens: [{ text: '...', isTrapKey: true/false, note: '...' }],
   *   unlockedHtml: '...',
   *   onComplete: function()
   * }
   */
  function mountKeywordRadar(el, config) {
    var foundMap = {};
    var requiredIndices = [];
    config.tokens.forEach(function (t, idx) {
      if (t.isTrapKey) requiredIndices.push(idx);
    });

    el.innerHTML =
      '<div class="solver-card">' +
        '<div class="solver-card-header">' +
          '<strong>🎯 會考審題雷達：' + config.title + '</strong>' +
          '<span class="solver-badge" id="kr-progress">已抓出 0 / ' + requiredIndices.length + ' 個關鍵字</span>' +
        '</div>' +
        '<p style="margin:0 0 10px;font-size:0.86rem;color:#92400e;">請用滑鼠點擊題目中決定成敗的「關鍵詞／陷阱條件」，全部抓出才會解鎖破題公式！</p>' +
        '<div class="keyword-passage" id="kr-passage"></div>' +
        '<div id="kr-feedback" style="margin-top:10px;font-size:0.88rem;"></div>' +
        '<div id="kr-unlocked" class="counterexample-box success hidden" style="margin-top:12px;">' + config.unlockedHtml + '</div>' +
      '</div>';

    var passageEl = el.querySelector('#kr-passage');
    var progressEl = el.querySelector('#kr-progress');
    var feedbackEl = el.querySelector('#kr-feedback');
    var unlockedEl = el.querySelector('#kr-unlocked');

    config.tokens.forEach(function (tok, idx) {
      if (tok.plain) {
        passageEl.appendChild(document.createTextNode(tok.text));
        return;
      }
      var span = document.createElement('span');
      span.className = 'keyword-token';
      span.textContent = tok.text;
      span.addEventListener('click', function () {
        if (tok.isTrapKey) {
          if (!foundMap[idx]) {
            foundMap[idx] = true;
            span.classList.add('found');
            var count = Object.keys(foundMap).length;
            progressEl.textContent = '已抓出 ' + count + ' / ' + requiredIndices.length + ' 個關鍵字';
            feedbackEl.innerHTML = '<span style="color:#15803d;font-weight:700;">✔ 抓對了！</span> ' + (tok.note || '');
            if (count === requiredIndices.length) {
              unlockedEl.classList.remove('hidden');
              var gained = global.JuniorStore.completeTactic(config.unitId, config.tacticCode, 40);
              if (gained > 0) showToast('⚡ 審題技巧過關！+' + gained + ' XP');
              if (config.onComplete) config.onComplete();
            }
          }
        } else {
          span.classList.add('wrong-flash');
          setTimeout(function () { span.classList.remove('wrong-flash'); }, 450);
          feedbackEl.innerHTML = '<span style="color:#b91c1c;">✖ 「' + tok.text + '」只是一般敘述，再找找真正限制計算或物理條件的字眼！</span>';
        }
      });
      passageEl.appendChild(span);
    });
  }

  /**
   * 元件 C：TacticBlockAssembler（會考解題步驟積木組裝槽）
   * config: {
   *   unitId, tacticCode, title, problemText,
   *   slots: [{ label: '步驟 1：...', expectedId: 's1' }],
   *   chips: [{ id: 's2', label: '...' }, { id: 'wrong', label: '...', wrongReason: '...' }],
   *   finalSummaryHtml: '...',
   *   onComplete: function()
   * }
   */
  function mountTacticAssembler(el, config) {
    var currentSlotIdx = 0;
    var usedChips = {};

    el.innerHTML =
      '<div class="solver-card">' +
        '<div class="solver-card-header">' +
          '<strong>🧩 會考拆題步驟積木槽：' + config.title + '</strong>' +
          '<span class="solver-badge" id="ta-badge">第 1 / ' + config.slots.length + ' 步</span>' +
        '</div>' +
        '<p style="margin:0 0 10px;font-size:0.92rem;background:#fff;padding:10px 12px;border-radius:8px;border:1px solid #fde68a;">' + config.problemText + '</p>' +
        '<div class="tactic-slots" id="ta-slots"></div>' +
        '<div style="font-size:0.84rem;color:#78350f;font-weight:700;margin-top:8px;">👇 依正確解題順序，點選下方的步驟積木：</div>' +
        '<div class="tactic-pool" id="ta-pool"></div>' +
        '<div id="ta-feedback"></div>' +
        '<div id="ta-done" class="counterexample-box success hidden">' + config.finalSummaryHtml + '</div>' +
      '</div>';

    var slotsEl = el.querySelector('#ta-slots');
    var poolEl = el.querySelector('#ta-pool');
    var badgeEl = el.querySelector('#ta-badge');
    var feedbackEl = el.querySelector('#ta-feedback');
    var doneEl = el.querySelector('#ta-done');

    function renderSlots() {
      slotsEl.innerHTML = '';
      config.slots.forEach(function (slot, idx) {
        var box = document.createElement('div');
        var isFilled = idx < currentSlotIdx;
        box.className = 'tactic-slot' + (isFilled ? ' filled' : '');
        var matchedChip = null;
        if (isFilled) {
          config.chips.forEach(function (c) { if (c.id === slot.expectedId) matchedChip = c; });
        }
        box.innerHTML =
          '<div class="tactic-slot-label">' + slot.label + '</div>' +
          '<div>' + (matchedChip ? '<strong>✔ ' + matchedChip.label + '</strong>' : (idx === currentSlotIdx ? '<span style="color:#2563eb;">等待放入此步積木…</span>' : '<span style="color:#94a3b8;">待解鎖</span>')) + '</div>';
        slotsEl.appendChild(box);
      });
      badgeEl.textContent = currentSlotIdx >= config.slots.length
        ? '全部完成 ✔'
        : '第 ' + (currentSlotIdx + 1) + ' / ' + config.slots.length + ' 步';
    }

    function renderPool() {
      poolEl.innerHTML = '';
      config.chips.forEach(function (chip) {
        var btn = document.createElement('button');
        btn.className = 'tactic-chip';
        btn.textContent = chip.label;
        btn.disabled = !!usedChips[chip.id] || currentSlotIdx >= config.slots.length;
        btn.addEventListener('click', function () {
          var targetSlot = config.slots[currentSlotIdx];
          if (!targetSlot) return;
          if (chip.id === targetSlot.expectedId) {
            usedChips[chip.id] = true;
            currentSlotIdx += 1;
            feedbackEl.innerHTML = '<div class="counterexample-box success">✔ 正確！進入下一解題關鍵步驟。</div>';
            renderSlots();
            renderPool();
            if (currentSlotIdx >= config.slots.length) {
              doneEl.classList.remove('hidden');
              var gained = global.JuniorStore.completeTactic(config.unitId, config.tacticCode, 40);
              if (gained > 0) showToast('🧩 拆題步驟全破！+' + gained + ' XP');
              if (config.onComplete) config.onComplete();
            }
          } else {
            feedbackEl.innerHTML =
              '<div class="counterexample-box error">✖ 這樣做會卡住或算錯：' +
              (chip.wrongReason || '順序還不對，請先思考上一步要先處理什麼基準量！') +
              '</div>';
          }
        });
        poolEl.appendChild(btn);
      });
    }

    renderSlots();
    renderPool();
  }

  global.JuniorSolverUI = {
    setupCanvas: setupCanvas,
    renderUnitShell: renderUnitShell,
    mountKeywordRadar: mountKeywordRadar,
    mountTacticAssembler: mountTacticAssembler,
    showToast: showToast
  };
})(window);
