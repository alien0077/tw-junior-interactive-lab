/* ==========================================================================
   store.js — 學習狀態儲存與迷思診斷追蹤引擎 (v2 JSON Schema)
   ========================================================================== */
(function (global) {
  'use strict';

  var STORAGE_KEY = 'tw_junior_lab_v2';
  var listeners = [];
  var memoryFallback = null;

  var BADGE_CATALOG = {
    MYTH_BUSTER_NEGATIVES: { icon: '🎈', name: '負負得正破冰者', desc: '破解負數運算與數線雙解陷阱' },
    MYTH_BUSTER_BALANCE: { icon: '⚖️', name: '等量天平大師', desc: '理解移項本質並完成年齡差拆題' },
    MYTH_BUSTER_PARABOLA: { icon: '🏀', name: '拋物線神射手', desc: '看懂括號歸零平移並秒殺最大收益' },
    MYTH_BUSTER_BUOYANCY: { icon: '⚓', name: '阿基米德鑑識官', desc: '破除沉體無浮力迷思並精通去皮重' },
    MYTH_BUSTER_CIRCUIT: { icon: '⚡', name: '電流不滅守護者', desc: '驗證電子能量背包與串並聯亮度法則' },
    MYTH_BUSTER_GEO_ECON: { icon: '🌬️', name: '氣候市場雙料通', desc: '掌握焚風成因與動點／移線供需判別' }
  };

  function defaultRoot() {
    return {
      studentId: 'stu_local_' + Math.random().toString(36).slice(2, 7),
      xpEarned: 0,
      unlockedBadges: [],
      units: {}
    };
  }

  function load() {
    try {
      var raw = global.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.units) {
          return parsed;
        }
      }
    } catch (e) {
      if (memoryFallback) return memoryFallback;
    }
    var fresh = defaultRoot();
    save(fresh);
    return fresh;
  }

  function save(state) {
    memoryFallback = state;
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore storage quota / private mode errors
    }
    listeners.forEach(function (fn) {
      try { fn(state); } catch (err) {}
    });
  }

  function ensureUnit(state, unitId) {
    if (!state.units[unitId]) {
      state.units[unitId] = {
        unitId: unitId,
        stage: 'ENGAGE',
        completedStages: [],
        masteryLevel: 'NEW',
        attempts: 0,
        hintsUsedLevel: 0,
        triggeredMisconceptions: [],
        solverTacticsCompleted: [],
        lastInteractionMetrics: {
          interactionCount: 0,
          completionSeconds: 0,
          startedAt: Date.now(),
          lastUpdated: new Date().toISOString()
        }
      };
    }
    return state.units[unitId];
  }

  var Store = {
    getState: function () {
      return load();
    },

    getUnitState: function (unitId) {
      var state = load();
      return ensureUnit(state, unitId);
    },

    subscribe: function (fn) {
      listeners.push(fn);
      return function unsubscribe() {
        listeners = listeners.filter(function (item) { return item !== fn; });
      };
    },

    touchInteraction: function (unitId) {
      var state = load();
      var u = ensureUnit(state, unitId);
      u.lastInteractionMetrics.interactionCount += 1;
      u.lastInteractionMetrics.lastUpdated = new Date().toISOString();
      if (u.masteryLevel === 'NEW') {
        u.masteryLevel = 'IN_PROGRESS';
      }
      save(state);
    },

    setStage: function (unitId, stageName) {
      var state = load();
      var u = ensureUnit(state, unitId);
      u.stage = stageName;
      if (u.masteryLevel === 'NEW') u.masteryLevel = 'IN_PROGRESS';
      u.lastInteractionMetrics.lastUpdated = new Date().toISOString();
      save(state);
    },

    completeStage: function (unitId, stageName, xpReward) {
      var state = load();
      var u = ensureUnit(state, unitId);
      var gained = 0;
      if (u.completedStages.indexOf(stageName) === -1) {
        u.completedStages.push(stageName);
        gained = xpReward || 25;
        state.xpEarned += gained;
      }
      if (u.masteryLevel === 'NEW') u.masteryLevel = 'IN_PROGRESS';
      if (
        u.completedStages.indexOf('ENGAGE') !== -1 &&
        u.completedStages.indexOf('EXPLORE') !== -1 &&
        u.completedStages.indexOf('EVALUATE') !== -1
      ) {
        u.masteryLevel = 'MASTERED';
        var elapsed = Math.round((Date.now() - (u.lastInteractionMetrics.startedAt || Date.now())) / 1000);
        u.lastInteractionMetrics.completionSeconds = Math.max(1, elapsed);
      }
      u.lastInteractionMetrics.lastUpdated = new Date().toISOString();
      save(state);
      return gained;
    },

    recordAttempt: function (unitId) {
      var state = load();
      var u = ensureUnit(state, unitId);
      u.attempts += 1;
      u.lastInteractionMetrics.lastUpdated = new Date().toISOString();
      save(state);
    },

    recordHint: function (unitId, level) {
      var state = load();
      var u = ensureUnit(state, unitId);
      if (level > u.hintsUsedLevel) {
        u.hintsUsedLevel = level;
      }
      u.lastInteractionMetrics.lastUpdated = new Date().toISOString();
      save(state);
    },

    recordMisconception: function (unitId, code, description) {
      var state = load();
      var u = ensureUnit(state, unitId);
      var existing = null;
      for (var i = 0; i < u.triggeredMisconceptions.length; i++) {
        if (u.triggeredMisconceptions[i].misconceptionCode === code) {
          existing = u.triggeredMisconceptions[i];
          break;
        }
      }
      if (!existing) {
        u.triggeredMisconceptions.push({
          misconceptionCode: code,
          description: description,
          timestamp: new Date().toISOString(),
          resolvedAfterCounterexample: false
        });
      } else {
        existing.timestamp = new Date().toISOString();
      }
      save(state);
    },

    resolveMisconception: function (unitId, code) {
      var state = load();
      var u = ensureUnit(state, unitId);
      u.triggeredMisconceptions.forEach(function (m) {
        if (m.misconceptionCode === code) {
          m.resolvedAfterCounterexample = true;
        }
      });
      save(state);
    },

    completeTactic: function (unitId, tacticCode, xpReward) {
      var state = load();
      var u = ensureUnit(state, unitId);
      var gained = 0;
      if (u.solverTacticsCompleted.indexOf(tacticCode) === -1) {
        u.solverTacticsCompleted.push(tacticCode);
        gained = xpReward || 40;
        state.xpEarned += gained;
      }
      save(state);
      return gained;
    },

    getBadgeInfo: function (badgeId) {
      if (BADGE_CATALOG[badgeId]) return BADGE_CATALOG[badgeId];
      var catalog = global.JuniorCatalog;
      if (catalog && typeof catalog.getById === 'function') {
        var cleaned = String(badgeId || '').replace(/^BADGE_/, '').replace(/^MYTH_BUSTER_/, '');
        var meta = catalog.getById(cleaned);
        if (meta) {
          var icon = meta.subject === 'math' ? '📐' : (meta.subject === 'science' ? '🔬' : '🌍');
          return {
            icon: icon,
            name: meta.code + ' 破題精熟者',
            desc: '完成「' + meta.title + '」反例與會考破題挑戰'
          };
        }
      }
      return { icon: '🏅', name: badgeId, desc: '' };
    },

    awardBadge: function (badgeId, xpBonus) {
      var state = load();
      if (state.unlockedBadges.indexOf(badgeId) === -1) {
        state.unlockedBadges.push(badgeId);
        state.xpEarned += (xpBonus || 80);
        save(state);
        return Store.getBadgeInfo(badgeId);
      }
      return null;
    },

    getBadgeCatalog: function () {
      return BADGE_CATALOG;
    },

    exportJSON: function () {
      return JSON.stringify(load(), null, 2);
    },

    resetAll: function () {
      var fresh = defaultRoot();
      save(fresh);
      return fresh;
    }
  };

  global.JuniorStore = Store;
})(window);
