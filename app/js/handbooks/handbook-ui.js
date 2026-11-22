/* ==========================================================================
   handbook-ui.js — 完整教學講義與各類題型全攻略渲染引擎
   對齊標準 6 大模組：
   一、基本觀念｜二、常見題型與解法｜三、方法判斷流程｜四、常見錯誤｜五、練習題與解答｜六、總結
   ========================================================================== */
(function (global) {
  'use strict';

  global.JuniorHandbooks = global.JuniorHandbooks || {};

  var CIRCLED_NUMS = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];

  function escHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function renderHandbookStage(unitId, bodyEl, shell) {
    var hb = global.JuniorHandbooks[unitId];
    if (!hb) {
      bodyEl.innerHTML =
        '<div class="hb-empty">' +
          '<p>本單元的完整題型講義資料載入中，請重新整理頁面。</p>' +
        '</div>';
      return null;
    }

    var types = hb.types || [];
    var practices = hb.practices || [];
    var errors = hb.commonErrors || [];
    var flow = hb.decisionFlow || [];
    var concept = hb.concept || {};
    var summary = hb.summary || {};

    var checkedPractices = {};
    var activeTypeFilter = 'all';

    // 建構題型篩選膠囊按鈕
    var typePillsHtml =
      '<button class="hb-type-pill active" data-type="all">全部 ' + types.length + ' 大題型</button>' +
      types.map(function (t) {
        return '<button class="hb-type-pill" data-type="' + t.num + '">題型 ' + t.num + '：' + escHtml(t.name) + '</button>';
      }).join('');

    // 一、基本觀念 HTML
    var notesHtml = (concept.notes || []).map(function (n) {
      return '<li>' + escHtml(n) + '</li>';
    }).join('');

    var conceptHtml =
      '<section id="hb-sec-1" class="hb-section">' +
        '<div class="hb-section-header">' +
          '<span class="hb-sec-num">一</span>' +
          '<h3>基本觀念</h3>' +
        '</div>' +
        '<div class="hb-concept-box">' +
          '<p class="hb-concept-def">' + escHtml(concept.definition) + '</p>' +
          (concept.example
            ? '<div class="hb-example-strip"><span class="hb-chip-label">例</span><code>' + escHtml(concept.example) + '</code></div>'
            : '') +
          (notesHtml
            ? '<div class="hb-note-box"><strong>⚠️ 注意與辨析：</strong><ul>' + notesHtml + '</ul></div>'
            : '') +
        '</div>' +
      '</section>';

    // 三、方法判斷流程 HTML
    var flowHtml =
      '<section id="hb-sec-3" class="hb-section">' +
        '<div class="hb-section-header">' +
          '<span class="hb-sec-num">三</span>' +
          '<h3>判斷使用哪一種方法（解題決策流程）</h3>' +
        '</div>' +
        '<div class="hb-flow-list">' +
          flow.map(function (item, idx) {
            return '<div class="hb-flow-item">' +
              '<div class="hb-flow-step-badge">' + (idx + 1) + '</div>' +
              '<div class="hb-flow-content">' +
                '<div class="hb-flow-q">' + escHtml(item.step) + '</div>' +
                '<div class="hb-flow-a">' + escHtml(item.action) + '</div>' +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</section>';

    // 四、常見錯誤 HTML
    var errorsHtml =
      '<section id="hb-sec-4" class="hb-section">' +
        '<div class="hb-section-header">' +
          '<span class="hb-sec-num">四</span>' +
          '<h3>常見錯誤（考場高頻失分地雷）</h3>' +
        '</div>' +
        '<div class="hb-errors-grid">' +
          errors.map(function (err) {
            return '<div class="hb-error-card">' +
              '<div class="hb-error-title">' + escHtml(err.title) + '</div>' +
              '<div class="hb-err-row wrong"><span class="hb-err-tag">❌ 錯</span><span>' + escHtml(err.wrong) + '</span></div>' +
              '<div class="hb-err-row right"><span class="hb-err-tag">✅ 正確</span><span>' + escHtml(err.correct) + '</span></div>' +
              '<div class="hb-err-reason"><strong>原因：</strong>' + escHtml(err.reason) + '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</section>';

    // 五、練習題 HTML
    var practicesHtml =
      '<section id="hb-sec-5" class="hb-section">' +
        '<div class="hb-section-header hb-section-header-between">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<span class="hb-sec-num">五</span>' +
            '<h3>' + practices.length + ' 題分題型精選練習題與解答</h3>' +
          '</div>' +
          '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">' +
            '<span id="hb-prac-progress" class="badge-status status-inprogress">已練熟 0 / ' + practices.length + ' 題</span>' +
            '<button id="hb-toggle-all-ans" class="btn-light" type="button">👁 全部展開／隱藏解答</button>' +
          '</div>' +
        '</div>' +
        '<div class="hb-practice-list" id="hb-practice-list">' +
          practices.map(function (p, idx) {
            return '<div class="hb-practice-card" data-pidx="' + idx + '">' +
              '<div class="hb-prac-top">' +
                '<span class="hb-prac-badge">第 ' + (p.num || (idx + 1)) + ' 題｜' + escHtml(p.typeName) + '</span>' +
                '<button class="hb-prac-check-btn" data-pidx="' + idx + '" type="button">○ 標記已學會</button>' +
              '</div>' +
              '<div class="hb-prac-q"><strong>題目：</strong>' + escHtml(p.question) + '</div>' +
              '<div class="hb-prac-actions">' +
                '<button class="btn-light hb-prac-reveal-btn" data-pidx="' + idx + '" type="button">🔍 顯示答案與解析</button>' +
              '</div>' +
              '<div class="hb-prac-answer hidden" id="hb-prac-ans-' + idx + '">' +
                '<div class="hb-prac-ans-line"><strong>答案：</strong><code>' + escHtml(p.answer) + '</code></div>' +
                '<div class="hb-prac-exp-line"><strong>解析：</strong>' + escHtml(p.explanation) + '</div>' +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</section>';

    // 六、總結 HTML
    var orderHtml = (summary.order || []).map(function (s, i) {
      return '<li><span class="hb-sum-num">' + (i + 1) + '</span><span>' + escHtml(s) + '</span></li>';
    }).join('');

    var summaryHtml =
      '<section id="hb-sec-6" class="hb-section">' +
        '<div class="hb-section-header">' +
          '<span class="hb-sec-num">六</span>' +
          '<h3>總結與核心觀念</h3>' +
        '</div>' +
        '<div class="hb-summary-card">' +
          '<div class="hb-summary-sub">📌 考場標準解題順序</div>' +
          '<ol class="hb-summary-order">' + orderHtml + '</ol>' +
          '<div class="hb-core-callout">' +
            '<div class="hb-core-label">💎 核心本質</div>' +
            '<p>' + escHtml(summary.coreConcept) + '</p>' +
          '</div>' +
        '</div>' +
      '</section>';

    bodyEl.innerHTML =
      '<div class="hb-container">' +
        '<div class="hb-hero">' +
          '<div>' +
            '<div class="hb-hero-tag">📚 完整教學講義 × ' + types.length + ' 大常見題型與解法全整理</div>' +
            '<h2 class="hb-hero-title">' + escHtml(hb.unitTitle) + '</h2>' +
          '</div>' +
          '<div class="hb-hero-actions">' +
            '<button id="hb-btn-print" class="btn-light" type="button">🖨 列印講義</button>' +
          '</div>' +
        '</div>' +

        '<nav class="hb-toc" aria-label="講義目錄">' +
          '<button class="hb-toc-btn" data-target="hb-sec-1" type="button">一、基本觀念</button>' +
          '<button class="hb-toc-btn" data-target="hb-sec-vis" type="button">🎨 互動圖例與動畫</button>' +
          '<button class="hb-toc-btn" data-target="hb-sec-2" type="button">二、' + types.length + ' 大常見題型</button>' +
          '<button class="hb-toc-btn" data-target="hb-sec-3" type="button">三、方法判斷</button>' +
          '<button class="hb-toc-btn" data-target="hb-sec-4" type="button">四、常見錯誤</button>' +
          '<button class="hb-toc-btn" data-target="hb-sec-5" type="button">五、' + practices.length + ' 題練習與解答</button>' +
          '<button class="hb-toc-btn" data-target="hb-sec-6" type="button">六、總結</button>' +
        '</nav>' +

        conceptHtml +

        '<section id="hb-sec-vis" class="hb-section hb-vis-section">' +
          '<div class="hb-section-header">' +
            '<span class="hb-sec-num" style="background:#0ea5e9;">圖</span>' +
            '<div>' +
              '<h3 id="hb-vis-title">🎨 核心題型互動圖例與組合推演</h3>' +
              '<div id="hb-vis-subtitle" style="font-size:0.84rem;color:#64748b;margin-top:2px;"></div>' +
            '</div>' +
          '</div>' +
          '<div id="hb-vis-mount"></div>' +
        '</section>' +

        '<section id="hb-sec-2" class="hb-section">' +
          '<div class="hb-section-header">' +
            '<span class="hb-sec-num">二</span>' +
            '<h3>' + types.length + ' 大常見題型與逐步解法</h3>' +
          '</div>' +
          '<div class="hb-type-filter-bar" id="hb-type-filter-bar">' + typePillsHtml + '</div>' +
          '<div class="hb-types-grid" id="hb-types-grid"></div>' +
        '</section>' +

        flowHtml +
        errorsHtml +
        practicesHtml +
        summaryHtml +
      '</div>';

    var typesGridEl = bodyEl.querySelector('#hb-types-grid');
    var filterBarEl = bodyEl.querySelector('#hb-type-filter-bar');
    var pracProgressEl = bodyEl.querySelector('#hb-prac-progress');

    function renderTypes() {
      var list = activeTypeFilter === 'all'
        ? types
        : types.filter(function (t) { return String(t.num) === String(activeTypeFilter); });

      typesGridEl.innerHTML = list.map(function (t) {
        var stepsHtml = (t.steps || []).map(function (st, idx) {
          var mark = CIRCLED_NUMS[idx] || ((idx + 1) + '.');
          return '<li><span class="hb-step-mark">' + mark + '</span><span>' + escHtml(st) + '</span></li>';
        }).join('');

        return '<article class="hb-type-card">' +
          '<div class="hb-type-head">' +
            '<span class="hb-type-num">題型 ' + t.num + '</span>' +
            '<h4>' + escHtml(t.name) + '</h4>' +
          '</div>' +
          (t.formula
            ? '<div class="hb-type-formula"><span>公式／法則</span><code>' + escHtml(t.formula) + '</code></div>'
            : '') +
          '<div class="hb-type-example"><strong>📝 經典例題：</strong>' + escHtml(t.example) + '</div>' +
          '<div class="hb-type-steps">' +
            '<div class="hb-sub-label">解題步驟</div>' +
            '<ol>' + stepsHtml + '</ol>' +
          '</div>' +
          '<div class="hb-type-answer"><strong>✅ 答案：</strong><code>' + escHtml(t.answer) + '</code></div>' +
          '<div class="hb-type-principle"><strong>💡 原理（為什麼）：</strong>' + escHtml(t.principle) + '</div>' +
          (t.extension
            ? '<div class="hb-type-extension"><strong>🚀 延伸變化：</strong>' + escHtml(t.extension) + '</div>'
            : '') +
          '<div class="hb-type-keypoint"><strong>🎯 重點：</strong>' + escHtml(t.keyPoint) + '</div>' +
        '</article>';
      }).join('');
    }

    renderTypes();

    // 題型篩選按鈕
    filterBarEl.querySelectorAll('.hb-type-pill').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBarEl.querySelectorAll('.hb-type-pill').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeTypeFilter = btn.getAttribute('data-type');
        renderTypes();
      });
    });

    // 目錄快速跳轉
    bodyEl.querySelectorAll('.hb-toc-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.getAttribute('data-target');
        var el = bodyEl.querySelector('#' + targetId);
        if (el && el.scrollIntoView) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // 列印按鈕
    var printBtn = bodyEl.querySelector('#hb-btn-print');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        global.print();
      });
    }

    // 單題顯示／隱藏解析
    bodyEl.querySelectorAll('.hb-prac-reveal-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = btn.getAttribute('data-pidx');
        var ansEl = bodyEl.querySelector('#hb-prac-ans-' + idx);
        if (!ansEl) return;
        var isHidden = ansEl.classList.contains('hidden');
        ansEl.classList.toggle('hidden');
        btn.textContent = isHidden ? '🙈 隱藏答案與解析' : '🔍 顯示答案與解析';
      });
    });

    // 全部展開／隱藏解析
    var allExpanded = false;
    var toggleAllBtn = bodyEl.querySelector('#hb-toggle-all-ans');
    if (toggleAllBtn) {
      toggleAllBtn.addEventListener('click', function () {
        allExpanded = !allExpanded;
        bodyEl.querySelectorAll('.hb-prac-answer').forEach(function (el) {
          el.classList.toggle('hidden', !allExpanded);
        });
        bodyEl.querySelectorAll('.hb-prac-reveal-btn').forEach(function (btn) {
          btn.textContent = allExpanded ? '🙈 隱藏答案與解析' : '🔍 顯示答案與解析';
        });
        toggleAllBtn.textContent = allExpanded ? '🙈 全部隱藏解答' : '👁 全部展開／隱藏解答';
      });
    }

    // 練習題自評打勾
    var completedAllNotified = false;
    bodyEl.querySelectorAll('.hb-prac-check-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = btn.getAttribute('data-pidx');
        checkedPractices[idx] = !checkedPractices[idx];
        var card = bodyEl.querySelector('.hb-practice-card[data-pidx="' + idx + '"]');
        if (checkedPractices[idx]) {
          btn.classList.add('checked');
          btn.textContent = '✔ 已學會';
          if (card) card.classList.add('mastered');
        } else {
          btn.classList.remove('checked');
          btn.textContent = '○ 標記已學會';
          if (card) card.classList.remove('mastered');
        }
        var doneCount = Object.keys(checkedPractices).filter(function (k) { return checkedPractices[k]; }).length;
        pracProgressEl.textContent = '已練熟 ' + doneCount + ' / ' + practices.length + ' 題';
        if (doneCount === practices.length && practices.length > 0) {
          pracProgressEl.className = 'badge-status status-mastered';
          if (!completedAllNotified) {
            completedAllNotified = true;
            if (shell && shell.markStageDone) {
              shell.markStageDone('HANDBOOK', 30);
            }
          }
        } else {
          pracProgressEl.className = 'badge-status status-inprogress';
        }
      });
    });

    // 掛載本單元專屬互動圖例／動畫
    var visCleanup = null;
    var visSecEl = bodyEl.querySelector('#hb-sec-vis');
    var visMountEl = bodyEl.querySelector('#hb-vis-mount');
    var visTitleEl = bodyEl.querySelector('#hb-vis-title');
    var visSubEl = bodyEl.querySelector('#hb-vis-subtitle');
    var visMod = global.JuniorHandbookVisuals && global.JuniorHandbookVisuals[unitId];
    if (visMod && typeof visMod.mount === 'function' && visMountEl) {
      if (visMod.title && visTitleEl) visTitleEl.textContent = visMod.title;
      if (visMod.subtitle && visSubEl) visSubEl.textContent = visMod.subtitle;
      var maybeVisClean = visMod.mount(visMountEl);
      if (typeof maybeVisClean === 'function') visCleanup = maybeVisClean;
    } else if (visSecEl) {
      visSecEl.classList.add('hidden');
    }

    global.JuniorStore.touchInteraction(unitId);
    return visCleanup;
  }

  global.JuniorHandbookUI = {
    renderHandbookStage: renderHandbookStage
  };
})(window);
