/* ==========================================================================
   soc-g1-c3.js — 社會科雙主題旗艦館：
   分頁 1（地理 G-1）：台灣地形、季風降雨與背風焚風剖面（含氣流溫濕粒子動畫）
   分頁 2（公民 C-3）：手搖飲經濟供需模擬（動點＝需求量 vs 整條移線＝需求／供給變動）
   ========================================================================== */
(function (global) {
  'use strict';

  var UNIT_ID = 'SOC_G1_C3';

  function mount(container) {
    return global.JuniorSolverUI.renderUnitShell(container, {
      unitId: UNIT_ID,
      badgeText: '🌍 社會科雙主題｜地理 G-1 × 公民 C-3',
      title: '台灣地形焚風與市場供需法則',
      subtitle: '動態氣流翻山模擬「迎風下雨、背風焚風」，與手搖飲市場操作「點動（量）vs 移線（需求）」',
      goldenRule: '迎風爬升冷卻下雨，背風乾燥壓縮變焚風；自己改價點在線上滑，其他條件改整條線搬家！',
      hints: [
        '地理提示：濕空氣爬坡時因為水氣凝結放熱，每上升 100 公尺只降溫 0.6°C；等水下光了變成「乾空氣」往下滑，每下降 100 公尺卻暴增 1.0°C，所以下到平原反而比原本更燙！',
        '公民提示：看到題目問「需求增加」還是「需求量增加」，只要檢查是不是「這項商品自己的價格」變動引起的！自己降價只是沿著同一條線滑動（量）；天氣變熱或流行爆紅才是整條線搬家！'
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
        '<div style="font-size:0.84rem;color:#d97706;font-weight:700;margin-bottom:6px;">STAGE 1｜跨科生活衝突提問</div>' +
        '<p class="engage-question">🌬️ <strong>地理疑問：</strong>夏天吹來 28°C 濕潤西南風，翻過 3000 公尺中央山脈到台東卻變成 40°C 超乾熱的「焚風」，熱量是山脈烤出來的嗎？<br>🧋 <strong>公民疑問：</strong>珍奶店「週年慶降價 10 元」排滿客人，跟「網紅推薦爆紅」也排滿客人，兩者在供需圖上畫法一樣嗎？</p>' +
        '<div class="prediction-grid">' +
          '<button class="pred-btn" data-c="wrong">A. 山脈岩石發熱烤乾空氣；兩件事都讓需求線往右平移</button>' +
          '<button class="pred-btn" data-c="right">B. 是「上山凝結降水＋下山乾壓縮增溫」溫差造成焚風；自己降價只動「點（需求量）」，網紅爆紅才讓整條線平移！</button>' +
          '<button class="pred-btn" data-c="wrong2">C. 焚風來自太陽直射背風面；網紅爆紅只影響供給線不影響需求線</button>' +
        '</div>' +
        '<div id="soc-eng-msg"></div>' +
        '<button id="soc-to-exp" class="btn-primary hidden" style="margin-top:12px;">進入階段 ②：台灣焚風模擬器＆手搖飲供需市場 →</button>' +
      '</div>';

    var msg = bodyEl.querySelector('#soc-eng-msg');
    var nextBtn = bodyEl.querySelector('#soc-to-exp');
    bodyEl.querySelectorAll('.pred-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        bodyEl.querySelectorAll('.pred-btn').forEach(function (b) { b.classList.remove('selected'); });
        btn.classList.add('selected');
        if (btn.getAttribute('data-c') === 'right') {
          msg.innerHTML = '<div class="counterexample-box success">✔ 雙科直覺都很銳利！進入下一頁親自模擬氣流翻山溫度變化，並拉動珍奶售價測試均衡！</div>';
          shell.markStageDone('ENGAGE', 25);
        } else {
          msg.innerHTML = '<div class="counterexample-box error">💡 兩個都是會考超高頻素養陷阱！進到下一步用動態剖面圖和供需曲線看透背後的因果！</div>';
          shell.markStageDone('ENGAGE', 15);
        }
        nextBtn.classList.remove('hidden');
      });
    });
    nextBtn.addEventListener('click', function () { shell.goToStage('EXPLORE'); });
  }

  function renderExplore(bodyEl, shell) {
    var activeLab = 'geo'; // 'geo' | 'econ'
    var season = 'summer'; // 'summer' (SW -> 台東焚風) | 'winter' (NE -> 基隆雨高雄晴)
    var price = 50; // 手搖飲定價 20 ~ 90
    var demandShift = 0; // -20 ~ +25
    var supplyShift = 0; // -20 ~ +20
    var seenGeo = true;
    var seenEcon = false;
    var seenShift = false;
    var rafId = null;

    // 氣流粒子
    var airParticles = [];
    for (var i = 0; i < 26; i++) {
      airParticles.push({ progress: i / 26 });
    }
    var rainDrops = [];
    for (var r = 0; r < 24; r++) {
      rainDrops.push({ x: 80 + Math.random() * 140, y: 120 + Math.random() * 130, speed: 2 + Math.random() * 2 });
    }

    bodyEl.innerHTML =
      '<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap;">' +
        '<button id="soc-tab-geo" class="btn-light active">🏔️ 實驗室 A：台灣季風地形雨與焚風（地理 G-1）</button>' +
        '<button id="soc-tab-econ" class="btn-light">🧋 實驗室 B：手搖飲供需曲線（動點 vs 移線）（公民 C-3）</button>' +
      '</div>' +
      '<div class="dual-view-grid">' +
        '<div class="canvas-panel">' +
          '<div class="panel-title"><span id="soc-canvas-title">🏔️ 中央山脈 3000m 東西剖面與氣流溫度追蹤</span><small>即時模擬</small></div>' +
          '<canvas id="soc-canvas" class="sim-canvas"></canvas>' +
          '<div id="soc-controls" class="controls-bar"></div>' +
        '</div>' +
        '<div class="logic-panel">' +
          '<div class="panel-title"><span>📊 機制因果與數據判讀</span><span id="soc-exp-badge" class="badge-status status-inprogress">請切換並體驗雙實驗室</span></div>' +
          '<div id="soc-readout" style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:14px;font-size:0.92rem;"></div>' +
          '<button id="soc-to-exp" class="btn-primary hidden" style="margin-top:12px;">完成探索！前往階段 ③ 總結原理 →</button>' +
        '</div>' +
      '</div>';

    var canvas = bodyEl.querySelector('#soc-canvas');
    var setup = global.JuniorSolverUI.setupCanvas(canvas, 540, 340);
    var ctx = setup.ctx;
    var controlsEl = bodyEl.querySelector('#soc-controls');
    var readoutEl = bodyEl.querySelector('#soc-readout');
    var titleEl = bodyEl.querySelector('#soc-canvas-title');
    var badgeEl = bodyEl.querySelector('#soc-exp-badge');
    var nextBtn = bodyEl.querySelector('#soc-to-exp');
    var tabGeo = bodyEl.querySelector('#soc-tab-geo');
    var tabEcon = bodyEl.querySelector('#soc-tab-econ');

    function checkDone() {
      if (seenGeo && seenEcon && seenShift) {
        badgeEl.className = 'badge-status status-mastered';
        badgeEl.textContent = '✔ 地理與經濟實驗完成';
        nextBtn.classList.remove('hidden');
        shell.markStageDone('EXPLORE', 35);
      }
    }

    function calcEcon() {
      // Qd = 110 + demandShift - P, Qs = -10 - supplyShift + P
      // (supplyShift > 0 表示供給增加整條右移，即在同 P 下 Qs 變多 -> Qs = -10 + supplyShift + P)
      var qd = Math.max(0, 110 + demandShift - price);
      var qs = Math.max(0, -10 + supplyShift + price);
      var eqP = (120 + demandShift - supplyShift) / 2;
      var eqQ = 110 + demandShift - eqP;
      return { qd: qd, qs: qs, eqP: eqP, eqQ: eqQ, diff: qd - qs };
    }

    function renderControlsAndReadout() {
      if (activeLab === 'geo') {
        titleEl.textContent = '🏔️ 中央山脈 3000m 東西剖面（迎風降溫 vs 背風增溫）';
        controlsEl.innerHTML =
          '<button id="geo-summer" class="btn-light ' + (season === 'summer' ? 'active' : '') + '">☀️ 夏季西南季風（產生台東焚風）</button>' +
          '<button id="geo-winter" class="btn-light ' + (season === 'winter' ? 'active' : '') + '">❄️ 冬季東北季風（基隆雨・高雄晴）</button>';

        controlsEl.querySelector('#geo-summer').addEventListener('click', function () {
          season = 'summer';
          global.JuniorStore.touchInteraction(UNIT_ID);
          renderControlsAndReadout();
        });
        controlsEl.querySelector('#geo-winter').addEventListener('click', function () {
          season = 'winter';
          global.JuniorStore.touchInteraction(UNIT_ID);
          renderControlsAndReadout();
        });

        if (season === 'summer') {
          readoutEl.innerHTML =
            '<div style="background:#fff7ed;border:1px solid #fed7aa;padding:12px;border-radius:8px;line-height:1.8;">' +
              '<strong>1. 迎風面（西南部海風 28°C）：</strong><br>' +
              '爬升 3000 m 時水氣凝結放熱降下大雨，每 100 m 只降 0.6°C → 到山頂變成 <strong>10°C</strong>（水氣已全擰乾！）。<br>' +
              '<strong>2. 背風面（東南部台東平原）：</strong><br>' +
              '乾燥空氣下沉被氣壓壓縮，每 100 m 暴增 1.0°C → 下到山腳飆升成 <strong style="color:#dc2626;">40°C 乾熱焚風！</strong>' +
            '</div>';
        } else {
          readoutEl.innerHTML =
            '<div style="background:#eff6ff;border:1px solid #bfdbfe;padding:12px;border-radius:8px;line-height:1.8;">' +
              '<strong>1. 迎風面（北部基隆宜蘭 18°C）：</strong><br>' +
              '東北季風帶著海面水氣撞上雪山與中央山脈北段，被迫抬升凝結造成整個冬天陰雨綿綿。<br>' +
              '<strong>2. 背風面（中南部嘉義高雄）：</strong><br>' +
              '水氣被中央山脈擋死在北東側，翻過來只剩乾燥晴朗氣流，所以南部冬天乾旱少雨！' +
            '</div>';
        }
      } else {
        titleEl.textContent = '🧋 手搖飲定價與供需均衡圖（點動 vs 移線）';
        var ec = calcEcon();
        controlsEl.innerHTML =
          '<div class="slider-group">' +
            '<label>1️⃣ 調整珍奶定價 P：<strong>' + price + ' 元</strong>（只移動線上黑點＝需求量/供給量變動）</label>' +
            '<input id="econ-price" type="range" min="20" max="90" step="5" value="' + price + '">' +
          '</div>' +
          '<div style="width:100%;display:flex;gap:6px;flex-wrap:wrap;">' +
            '<button id="ev-normal" class="btn-light ' + (demandShift === 0 && supplyShift === 0 ? 'active' : '') + '">常態基準</button>' +
            '<button id="ev-viral" class="btn-light ' + (demandShift > 0 ? 'active' : '') + '">🔥 網紅爆紅（需求線右移）</button>' +
            '<button id="ev-cold" class="btn-light ' + (demandShift < 0 ? 'active' : '') + '">🥶 寒流來襲（需求線左移）</button>' +
            '<button id="ev-milk" class="btn-light ' + (supplyShift < 0 ? 'active' : '') + '">🥛 鮮奶原料大漲（供給線左移）</button>' +
          '</div>';

        controlsEl.querySelector('#econ-price').addEventListener('input', function (e) {
          price = parseInt(e.target.value, 10);
          global.JuniorStore.touchInteraction(UNIT_ID);
          renderControlsAndReadout();
        });
        controlsEl.querySelector('#ev-normal').addEventListener('click', function () { demandShift = 0; supplyShift = 0; renderControlsAndReadout(); });
        controlsEl.querySelector('#ev-viral').addEventListener('click', function () { demandShift = 20; supplyShift = 0; seenShift = true; renderControlsAndReadout(); checkDone(); });
        controlsEl.querySelector('#ev-cold').addEventListener('click', function () { demandShift = -20; supplyShift = 0; seenShift = true; renderControlsAndReadout(); checkDone(); });
        controlsEl.querySelector('#ev-milk').addEventListener('click', function () { demandShift = 0; supplyShift = -20; seenShift = true; renderControlsAndReadout(); checkDone(); });

        var statusTxt = Math.abs(ec.diff) < 1
          ? '<span style="color:#16a34a;font-weight:700;">✔ 達到市場均衡！剛好賣完不缺貨也不屯貨！</span>'
          : (ec.diff > 0
            ? '<span style="color:#dc2626;font-weight:700;">🔥 供不應求（缺貨排隊 ' + ec.diff + ' 杯！定價太低了）</span>'
            : '<span style="color:#2563eb;font-weight:700;">📦 供過於求（倉庫滯銷 ' + Math.abs(ec.diff) + ' 杯！定價太高了）</span>');

        readoutEl.innerHTML =
          '<div style="background:#f1f5f9;padding:10px;border-radius:8px;line-height:1.8;">' +
            '目前定價 <strong>' + price + ' 元</strong>：想買人數（Qd）= <strong>' + ec.qd + '</strong>｜願意做（Qs）= <strong>' + ec.qs + '</strong><br>' +
            statusTxt + '<br>' +
            '🎯 目前市場均衡點：價格 <strong>' + ec.eqP.toFixed(0) + ' 元</strong>，成交量 <strong>' + ec.eqQ.toFixed(0) + ' 杯</strong>' +
          '</div>' +
          (!seenShift ? '<div style="margin-top:8px;font-size:0.86rem;color:#b45309;">👆 點選「網紅爆紅」或「鮮奶原料大漲」看看整條線如何平移改寫均衡價！</div>' : '');
      }
      checkDone();
    }

    function draw() {
      ctx.clearRect(0, 0, setup.width, setup.height);

      if (activeLab === 'geo') {
        var isSummer = (season === 'summer');
        // 地形剖面座標：左海岸 -> 中央山脈山頂(270, 95) -> 右海岸
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(0, 275, 540, 65); // 海平面

        // 山脈多邊形
        ctx.fillStyle = '#65a30d';
        ctx.beginPath();
        ctx.moveTo(75, 275);
        ctx.lineTo(150, 255);
        ctx.lineTo(270, 95);
        ctx.lineTo(395, 255);
        ctx.lineTo(465, 275);
        ctx.closePath();
        ctx.fill();

        // 標籤
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(isSummer ? '高雄 / 西部 (迎風 28°C)' : '高雄 / 西南部 (背風晴朗)', 95, 305);
        ctx.fillText('中央山脈 3000m', 270, 82);
        ctx.fillText(isSummer ? '台東 / 東部 (背風焚風 40°C!)' : '基隆宜蘭 (迎風冬雨)', 440, 305);

        // 雨滴（總是畫在迎風面那一側）
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        rainDrops.forEach(function (d) {
          d.y += d.speed;
          if (d.y > 265) d.y = 115;
          var rx = isSummer ? d.x : (540 - d.x);
          ctx.beginPath(); ctx.moveTo(rx, d.y); ctx.lineTo(rx - 3, d.y + 10); ctx.stroke();
        });

        // 雲團在迎風坡頂
        ctx.fillStyle = 'rgba(148, 163, 184, 0.78)';
        var cloudX = isSummer ? 210 : 330;
        ctx.beginPath();
        ctx.arc(cloudX, 118, 24, 0, Math.PI * 2);
        ctx.arc(cloudX + 24, 114, 20, 0, Math.PI * 2);
        ctx.arc(cloudX - 24, 124, 18, 0, Math.PI * 2);
        ctx.fill();

        // 流動氣流粒子
        airParticles.forEach(function (pt) {
          pt.progress = (pt.progress + 0.004) % 1;
          var t = pt.progress;
          var x = isSummer ? (40 + t * 460) : (500 - t * 460);
          var y;
          if (t < 0.5) {
            y = 240 - (t / 0.5) * 155;
            ctx.fillStyle = '#0284c7'; // 濕冷爬坡藍
          } else {
            y = 85 + ((t - 0.5) / 0.5) * 165;
            ctx.fillStyle = isSummer ? '#ea580c' : '#38bdf8'; // 夏天背風乾燥橘紅焚風！
          }
          ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
        });
      } else {
        // 供需曲線座標圖：X軸 數量 Q (0~120), Y軸 價格 P (0~110)
        var ox = 65, oy = 295;
        var scaleX = 3.5; // Q=120 -> 420px
        var scaleY = 2.3; // P=110 -> 253px

        function px(q, p) { return { x: ox + q * scaleX, y: oy - p * scaleY }; }

        // 座標軸
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ox, 28); ctx.lineTo(ox, oy); ctx.lineTo(505, oy); ctx.stroke();
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('數量 Q (杯)', 480, oy + 22);
        ctx.fillText('價格 P (元)', ox, 18);

        // 基準虛線（如果發生移線，留下舊線對照）
        if (demandShift !== 0) {
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
          ctx.lineWidth = 2;
          var d0a = px(10, 100), d0b = px(100, 10);
          ctx.beginPath(); ctx.moveTo(d0a.x, d0a.y); ctx.lineTo(d0b.x, d0b.y); ctx.stroke();
          ctx.setLineDash([]);
        }
        if (supplyShift !== 0) {
          ctx.setLineDash([5, 5]);
          ctx.strokeStyle = 'rgba(37, 99, 235, 0.35)';
          ctx.lineWidth = 2;
          var s0a = px(10, 20), s0b = px(100, 110);
          ctx.beginPath(); ctx.moveTo(s0a.x, s0a.y); ctx.lineTo(s0b.x, s0b.y); ctx.stroke();
          ctx.setLineDash([]);
        }

        // 當前需求線 D：P = 110 + demandShift - Q
        var dStartQ = Math.max(0, 110 + demandShift - 105);
        var dEndQ = Math.min(120, 110 + demandShift - 5);
        var dp1 = px(dStartQ, 110 + demandShift - dStartQ);
        var dp2 = px(dEndQ, 110 + demandShift - dEndQ);
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(dp1.x, dp1.y); ctx.lineTo(dp2.x, dp2.y); ctx.stroke();
        ctx.fillStyle = '#dc2626';
        ctx.fillText('需求線 D', dp2.x - 10, dp2.y - 8);

        // 當前供給線 S：P = Q + 10 - supplyShift
        var sStartQ = Math.max(0, 10 + supplyShift - 5);
        var sEndQ = Math.min(115, 105 + supplyShift - 10);
        var sp1 = px(sStartQ, sStartQ + 10 - supplyShift);
        var sp2 = px(sEndQ, sEndQ + 10 - supplyShift);
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(sp1.x, sp1.y); ctx.lineTo(sp2.x, sp2.y); ctx.stroke();
        ctx.fillStyle = '#2563eb';
        ctx.fillText('供給線 S', sp2.x - 10, sp2.y - 8);

        // 目前定價水平線 + Qd/Qs 兩點
        var ec = calcEcon();
        var pyLine = px(0, price).y;
        ctx.strokeStyle = '#16a34a';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ox, pyLine); ctx.lineTo(490, pyLine); ctx.stroke();
        ctx.setLineDash([]);

        var pQd = px(ec.qd, price);
        var pQs = px(ec.qs, price);
        ctx.fillStyle = '#dc2626';
        ctx.beginPath(); ctx.arc(pQd.x, pQd.y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2563eb';
        ctx.beginPath(); ctx.arc(pQs.x, pQs.y, 6, 0, Math.PI * 2); ctx.fill();

        // 均衡點
        var pEq = px(ec.eqQ, ec.eqP);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(pEq.x, pEq.y, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillText('均衡(' + ec.eqQ.toFixed(0) + ',' + ec.eqP.toFixed(0) + '元)', pEq.x, pEq.y - 12);
      }

      rafId = global.requestAnimationFrame(draw);
    }

    tabGeo.addEventListener('click', function () {
      activeLab = 'geo'; seenGeo = true;
      tabGeo.classList.add('active'); tabEcon.classList.remove('active');
      renderControlsAndReadout();
    });
    tabEcon.addEventListener('click', function () {
      activeLab = 'econ'; seenEcon = true;
      tabEcon.classList.add('active'); tabGeo.classList.remove('active');
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
          '<h3 style="margin-top:0;">🏔️ 地理 G-1：迎風降雨 vs 背風焚風</h3>' +
          '<p style="line-height:1.85;">海風撞擊山脈被迫爬坡，膨脹冷卻（−0.6°C/100m）把水氣全部下光；變成「乾空氣」下坡受氣壓壓縮劇烈升溫（+1.0°C/100m），所以下山後比原本更乾更熱，這就是焚風！</p>' +
        '</div>' +
        '<div class="faq-card">' +
          '<h3 style="margin-top:0;">🧋 公民 C-3：破除兩大經濟學超級陷阱</h3>' +
          '<div class="faq-item">' +
            '<div class="faq-q">疑問 1：「需求增加」跟「需求量增加」到底怎麼在 3 秒內分辨？</div>' +
            '<div class="faq-a"><strong>最簡單口訣：</strong>看原因是不是「<strong>這個商品自己的價格變了</strong>」！商品自己特價變便宜 → 只是點在線上滑動叫「需求<strong>量</strong>增加」；天氣變熱、網紅爆紅、薪水增加 → 整條線往右搬家叫「<strong>需求</strong>增加」！</div>' +
          '</div>' +
          '<div class="faq-item">' +
            '<div class="faq-q">疑問 2：「機會成本要將沒選的所有選項金額全部加起來嗎？」</div>' +
            '<div class="faq-a"><strong>最簡單解法：</strong>絕對不要全加！你同一時間只能分身去一個地方，所以只算放棄掉裡面「<strong>價值最高的那唯一一個</strong>」！</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:18px;text-align:right;">' +
        '<button id="soc-to-eval" class="btn-primary">前往階段 ④：新聞事件分流挑戰（動點 vs 移線）→</button>' +
      '</div>';

    bodyEl.querySelector('#soc-to-eval').addEventListener('click', function () {
      shell.goToStage('EVALUATE');
    });
  }

  function renderEvaluate(bodyEl, shell) {
    var tasks = [
      {
        title: '事件 1：珍奶店歡慶週年「全品項半價促銷」，排隊買珍奶的杯數暴增！',
        correct: 'qd',
        reason: '這是珍奶「自己的價格」打折下降造成的，消費者偏好曲線並沒有改變，只是沿同一條需求線往下滑動 → 屬於「需求量增加」！'
      },
      {
        title: '事件 2：醫學報導指出「這家茶葉配方能幫助睡眠」（價錢沒變），整排買氣暴衝！',
        correct: 'd_right',
        reason: '價格沒變，但外部偏好大幅提升！代表在原本每一個價位下想買的人都變多了，整條需求曲線往右大搬家 → 屬於「需求增加」！'
      },
      {
        title: '事件 3：今年夏天吹拂極強「西南季風」，中央山脈東西兩側何處最可能出現高溫乾燥焚風？',
        correct: 'east',
        reason: '西南風從西南方吹來，西南部是迎風面下大雨；翻過山脈到達東側（台東）背風面下沉壓縮增溫形成焚風！'
      }
    ];

    var passed = {};
    bodyEl.innerHTML =
      '<div class="canvas-panel">' +
        '<div class="panel-title"><span>⚡ 108 課綱跨科素養通關（全部答對即授與徽章）</span><span id="soc-score" class="badge-status status-inprogress">0 / 3 通過</span></div>' +
        '<div id="soc-quiz-list"></div>' +
      '</div>';

    var listEl = bodyEl.querySelector('#soc-quiz-list');
    var scoreEl = bodyEl.querySelector('#soc-score');

    tasks.forEach(function (task, idx) {
      var card = document.createElement('div');
      card.className = 'faq-item';
      var buttonsHtml = idx < 2
        ? '<button class="btn-light soc-opt" data-v="qd">需求量增加（點在線上滑）</button>' +
          '<button class="btn-light soc-opt" data-v="d_right">需求增加（整條需求線右移）</button>' +
          '<button class="btn-light soc-opt" data-v="s_right">供給增加（供給線右移）</button>'
        : '<button class="btn-light soc-opt" data-v="west">西南部嘉義台南（迎風面）</button>' +
          '<button class="btn-light soc-opt" data-v="east">東南部台東（背風面）</button>';

      card.innerHTML =
        '<div style="font-weight:700;margin-bottom:8px;">' + task.title + '</div>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">' + buttonsHtml + '</div>' +
        '<div class="soc-fb" style="margin-top:8px;"></div>';

      var fbEl = card.querySelector('.soc-fb');
      card.querySelectorAll('.soc-opt').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var v = btn.getAttribute('data-v');
          global.JuniorStore.recordAttempt(UNIT_ID);
          if (v === task.correct) {
            passed[idx] = true;
            btn.classList.add('active');
            fbEl.innerHTML = '<div class="counterexample-box success">✔ <strong>答對！</strong>' + task.reason + '</div>';
            global.JuniorStore.resolveMisconception(UNIT_ID, 'MIS_DEMAND_VS_QUANTITY_' + idx);
          } else {
            global.JuniorStore.recordMisconception(UNIT_ID, 'MIS_DEMAND_VS_QUANTITY_' + idx, task.title);
            fbEl.innerHTML = '<div class="counterexample-box error">🚨 <strong>再想一下！</strong>' + task.reason + '</div>';
          }
          var cnt = Object.keys(passed).length;
          scoreEl.textContent = cnt + ' / 3 通過';
          if (cnt === 3) {
            scoreEl.className = 'badge-status status-mastered';
            shell.markStageDone('EVALUATE', 40);
            global.JuniorStore.completeTactic(UNIT_ID, 'DEMAND_CURVE_CLASSIFY', 40);
            shell.unlockBadge('MYTH_BUSTER_GEO_ECON', 80);
          }
        });
      });
      listEl.appendChild(card);
    });

    return null;
  }

  global.JuniorUnits[UNIT_ID] = { mount: mount };
})(window);
