/* ==========================================================================
   app.js — 主控制器：總覽篩選、單元掛載/卸載、XP 同步與迷思診斷儀表板
   ========================================================================== */
(function (global) {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var Store = global.JuniorStore;
    var Catalog = global.JuniorCatalog;
    var SolverUI = global.JuniorSolverUI;

    var catalogView = document.getElementById('catalog-view');
    var workspaceView = document.getElementById('unit-workspace');
    var unitGrid = document.getElementById('unit-grid');
    var navXp = document.getElementById('nav-xp');
    var navBadges = document.getElementById('nav-badges');
    var heroMastered = document.getElementById('hero-mastered-count');
    var heroTotal = document.getElementById('hero-total-units');
    var btnHome = document.getElementById('btn-home');
    var btnBackCatalog = document.getElementById('btn-back-catalog');
    var gradeSelect = document.getElementById('grade-select');
    var chkOnlyReady = document.getElementById('chk-only-ready');
    var filterTabs = document.querySelectorAll('.filter-tab');

    var diagModal = document.getElementById('diagnostics-modal');
    var diagBody = document.getElementById('diagnostics-body');
    var btnDiag = document.getElementById('btn-diagnostics');
    var btnCloseDiag = document.getElementById('btn-close-diag');
    var btnCloseDiagBottom = document.getElementById('btn-close-diag-bottom');
    var btnExportJson = document.getElementById('btn-export-json');
    var btnResetStore = document.getElementById('btn-reset-store');

    var filterSubject = 'all';
    var filterGrade = 'all';
    var onlyReady = false;
    var currentUnmount = null;

    if (heroTotal) {
      heroTotal.textContent = String(Catalog.UNITS.length);
    }

    function updateNavMetrics(state) {
      if (!state) state = Store.getState();
      navXp.textContent = String(state.xpEarned || 0);
      navBadges.textContent = String((state.unlockedBadges || []).length);

      var masteredCount = 0;
      Object.keys(state.units || {}).forEach(function (uid) {
        if (state.units[uid].masteryLevel === 'MASTERED') {
          masteredCount += 1;
        }
      });
      if (heroMastered) {
        heroMastered.textContent = String(masteredCount);
      }
    }

    function renderCatalog() {
      var state = Store.getState();
      unitGrid.innerHTML = '';

      var filtered = Catalog.UNITS.filter(function (u) {
        if (filterSubject !== 'all' && u.subject !== filterSubject) return false;
        if (filterGrade !== 'all' && u.grade !== filterGrade) return false;
        if (onlyReady) {
          var uSt = state.units[u.id];
          if (uSt && uSt.masteryLevel === 'MASTERED') return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        unitGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:36px;color:#64748b;">沒有符合篩選條件的單元，請切換科目或年級條件。</div>';
        return;
      }

      filtered.forEach(function (unit) {
        var uState = state.units[unit.id];
        var mastery = uState ? uState.masteryLevel : 'NEW';
        var card = document.createElement('article');
        card.className = 'unit-card ' + (unit.implemented ? 'ready' : 'planned');

        var badgeClass = unit.subject === 'math'
          ? 'badge-math'
          : (unit.subject === 'science' ? 'badge-science' : 'badge-social');

        var statusHtml;
        if (!unit.implemented) {
          statusHtml = '<span class="badge-status status-planned">' + unit.phase + ' 規劃中</span>';
        } else if (mastery === 'MASTERED') {
          statusHtml = '<span class="badge-status status-mastered">★ 已精熟</span>';
        } else if (mastery === 'IN_PROGRESS') {
          statusHtml = '<span class="badge-status status-inprogress">進行中</span>';
        } else {
          statusHtml = '<span class="badge-status status-ready">' + (unit.phase === 'Phase 1' ? '▶ 旗艦體驗' : '▶ 立即體驗') + '</span>';
        }

        var tagsHtml = (unit.tags || []).map(function (t) {
          return '<span class="unit-tag">' + t + '</span>';
        }).join('');

        var actionHtml = unit.implemented
          ? '<button class="btn-primary btn-open-unit" data-id="' + unit.id + '">啟動互動實驗 →</button>'
          : '<button class="btn-light btn-planned-info" data-phase="' + unit.phase + '">查看規格藍圖</button>';

        card.innerHTML =
          '<div>' +
            '<div class="unit-card-top">' +
              '<span class="badge-subject ' + badgeClass + '">' + unit.subjectLabel + '・' + unit.grade + '年級</span>' +
              statusHtml +
            '</div>' +
            '<h3>' + unit.code + '｜' + unit.title + '</h3>' +
            '<p>' + unit.summary + '</p>' +
            '<div class="unit-tags">' + tagsHtml + '</div>' +
          '</div>' +
          '<div class="unit-card-footer">' +
            '<span>' + (unit.implemented ? '四階段完整實作' : '規格已定案・待排程') + '</span>' +
            actionHtml +
          '</div>';

        var openBtn = card.querySelector('.btn-open-unit');
        if (openBtn) {
          openBtn.addEventListener('click', function () {
            openUnit(unit.id);
          });
        }

        var planBtn = card.querySelector('.btn-planned-info');
        if (planBtn) {
          planBtn.addEventListener('click', function () {
            SolverUI.showToast('📋 「' + unit.title + '」已收錄於 v2 深度教學規格書（預計 ' + unit.phase + ' 上線）');
          });
        }

        unitGrid.appendChild(card);
      });
    }

    function openUnit(unitId) {
      var mod = global.JuniorUnits && global.JuniorUnits[unitId];
      if (!mod || typeof mod.mount !== 'function') {
        SolverUI.showToast('找不到單元模組：' + unitId);
        return;
      }
      if (typeof currentUnmount === 'function') {
        currentUnmount();
        currentUnmount = null;
      }
      catalogView.classList.add('hidden');
      workspaceView.classList.remove('hidden');
      btnBackCatalog.classList.remove('hidden');
      workspaceView.innerHTML = '';
      currentUnmount = mod.mount(workspaceView);
      global.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function goHome() {
      if (typeof currentUnmount === 'function') {
        currentUnmount();
        currentUnmount = null;
      }
      workspaceView.classList.add('hidden');
      workspaceView.innerHTML = '';
      catalogView.classList.remove('hidden');
      btnBackCatalog.classList.add('hidden');
      renderCatalog();
      updateNavMetrics();
    }

    function renderDiagnostics() {
      var state = Store.getState();
      var unitIds = Object.keys(state.units || {});
      var totalMisconceptions = 0;
      var resolvedMisconceptions = 0;
      var totalTactics = 0;
      var subjectHotspots = {
        math: { label: '📐 數學科', triggered: 0, resolved: 0 },
        science: { label: '🔬 自然科', triggered: 0, resolved: 0 },
        social: { label: '🌍 社會科', triggered: 0, resolved: 0 }
      };

      unitIds.forEach(function (uid) {
        var u = state.units[uid];
        var meta = Catalog.getById(uid);
        var subjKey = meta ? meta.subject : null;
        (u.triggeredMisconceptions || []).forEach(function (m) {
          totalMisconceptions += 1;
          if (subjKey && subjectHotspots[subjKey]) subjectHotspots[subjKey].triggered += 1;
          if (m.resolvedAfterCounterexample) {
            resolvedMisconceptions += 1;
            if (subjKey && subjectHotspots[subjKey]) subjectHotspots[subjKey].resolved += 1;
          }
        });
        totalTactics += (u.solverTacticsCompleted || []).length;
      });

      var badgesHtml = (state.unlockedBadges || []).length === 0
        ? '<span style="color:#64748b;font-size:0.88rem;">尚未解鎖徽章，請完成任一單元的階段 ④ 反例與破題挑戰！</span>'
        : state.unlockedBadges.map(function (bid) {
            var b = Store.getBadgeInfo(bid);
            return '<span class="misconception-pill resolved" style="font-size:0.86rem;padding:5px 12px;">' + b.icon + ' <strong>' + b.name + '</strong></span>';
          }).join('');

      var hotspotHtml = Object.keys(subjectHotspots).map(function (key) {
        var h = subjectHotspots[key];
        var pending = h.triggered - h.resolved;
        return '<div class="diag-stat">' +
          '<span>' + h.label + ' 迷思熱點</span>' +
          '<strong>' + (h.triggered === 0 ? '尚無紀錄' : ('已破除 ' + h.resolved + ' / ' + h.triggered + (pending > 0 ? '（待修正 ' + pending + '）' : ' ✔'))) + '</strong>' +
        '</div>';
      }).join('');

      var unitRowsHtml = unitIds.length === 0
        ? '<p style="color:#64748b;font-size:0.9rem;">尚未開始任何單元互動。</p>'
        : unitIds.map(function (uid) {
            var u = state.units[uid];
            var meta = Catalog.getById(uid);
            var title = meta ? (meta.code + ' ' + meta.title) : uid;
            var misHtml = (u.triggeredMisconceptions || []).length === 0
              ? '<span style="color:#16a34a;font-size:0.82rem;">✔ 尚未踩入任何迷思陷阱</span>'
              : u.triggeredMisconceptions.map(function (m) {
                  return '<span class="misconception-pill ' + (m.resolvedAfterCounterexample ? 'resolved' : 'active') + '">' +
                    (m.resolvedAfterCounterexample ? '✔ 已破除：' : '⚠️ 待修正：') + m.description +
                  '</span>';
                }).join('');

            return '<div class="diag-unit-row">' +
              '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">' +
                '<strong>' + title + '</strong>' +
                '<span class="badge-status ' + (u.masteryLevel === 'MASTERED' ? 'status-mastered' : 'status-inprogress') + '">' + u.masteryLevel + '｜已完成階段：' + (u.completedStages || []).length + '/4</span>' +
              '</div>' +
              '<div style="font-size:0.82rem;color:#64748b;margin-top:4px;">' +
                '互動次數：' + (u.lastInteractionMetrics ? u.lastInteractionMetrics.interactionCount : 0) +
                '｜提示層級：L' + (u.hintsUsedLevel || 0) +
                '｜解題技法：' + ((u.solverTacticsCompleted || []).length > 0 ? u.solverTacticsCompleted.join(', ') : '尚無') +
              '</div>' +
              '<div style="margin-top:6px;">' + misHtml + '</div>' +
            '</div>';
          }).join('');

      diagBody.innerHTML =
        '<div class="diag-summary-grid">' +
          '<div class="diag-stat"><span>累積經驗值</span><strong>' + (state.xpEarned || 0) + ' XP</strong></div>' +
          '<div class="diag-stat"><span>解鎖徽章</span><strong>' + (state.unlockedBadges || []).length + ' / ' + Catalog.UNITS.length + '</strong></div>' +
          '<div class="diag-stat"><span>破除迷思 / 觸發</span><strong>' + resolvedMisconceptions + ' / ' + totalMisconceptions + '</strong></div>' +
          '<div class="diag-stat"><span>會考破題技能</span><strong>' + totalTactics + ' 項</strong></div>' +
        '</div>' +
        '<h4 style="margin:12px 0 6px;">🔥 跨單元迷思觸發熱點總表</h4>' +
        '<div class="diag-summary-grid" style="margin-bottom:14px;">' + hotspotHtml + '</div>' +
        '<h4 style="margin:12px 0 6px;">🏅 已獲得徽章</h4>' +
        '<div style="margin-bottom:16px;">' + badgesHtml + '</div>' +
        '<h4 style="margin:12px 0 8px;">📌 各單元精熟與迷思診斷軌跡</h4>' +
        unitRowsHtml +
        '<h4 style="margin:16px 0 6px;">🧾 v2 JSON Schema 原始紀錄預覽</h4>' +
        '<pre class="json-preview">' + Store.exportJSON().replace(/</g, '&lt;') + '</pre>';
    }

    // 篩選事件
    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filterTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        filterSubject = tab.getAttribute('data-subject');
        renderCatalog();
      });
    });

    gradeSelect.addEventListener('change', function (e) {
      filterGrade = e.target.value;
      renderCatalog();
    });

    chkOnlyReady.addEventListener('change', function (e) {
      onlyReady = !!e.target.checked;
      renderCatalog();
    });

    btnHome.addEventListener('click', goHome);
    btnBackCatalog.addEventListener('click', goHome);

    btnDiag.addEventListener('click', function () {
      renderDiagnostics();
      diagModal.classList.remove('hidden');
    });

    function closeDiag() {
      diagModal.classList.add('hidden');
    }

    btnCloseDiag.addEventListener('click', closeDiag);
    btnCloseDiagBottom.addEventListener('click', closeDiag);
    diagModal.addEventListener('click', function (e) {
      if (e.target === diagModal) closeDiag();
    });

    btnExportJson.addEventListener('click', function () {
      var json = Store.exportJSON();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(json).then(function () {
          SolverUI.showToast('✔ 已複製診斷 JSON 到剪貼簿！');
        }, function () {
          global.prompt('請複製以下 JSON：', json);
        });
      } else {
        global.prompt('請複製以下 JSON：', json);
      }
    });

    btnResetStore.addEventListener('click', function () {
      if (global.confirm('確定要清除所有單元進度、XP 與迷思診斷紀錄嗎？')) {
        Store.resetAll();
        renderDiagnostics();
        if (!catalogView.classList.contains('hidden')) {
          renderCatalog();
        }
        SolverUI.showToast('🗑 已重置所有學習紀錄');
      }
    });

    Store.subscribe(function (st) {
      updateNavMetrics(st);
    });

    global.JuniorApp = {
      goHome: goHome,
      openUnit: openUnit
    };

    updateNavMetrics();
    renderCatalog();
  });
})(window);
