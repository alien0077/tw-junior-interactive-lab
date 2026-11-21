/* ==========================================================================
   sim-engines-sci-soc.js — 自然科 (14個) & 社會科 (8個) 互動視覺引擎庫
   自動註冊至 window.JuniorSimEngines.RENDERERS
   ========================================================================== */
(function (global) {
  'use strict';

  var R = global.JuniorSimEngines.RENDERERS;

  /* ========================================================================
     自然科互動視覺引擎 (14 個)
     ======================================================================== */

  // 16. 細胞滲透作用（紅血球 vs 植物細胞壁）
  R.s_cell_osmosis = function (p) {
    var salt = 0.9; // 0 (純水) | 0.9 (生理食鹽水) | 5 (濃鹽水)
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      // 左邊：紅血球
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#0f172a';
      ctx.fillText('動物紅血球（無細胞壁）', 140, 40);
      if (salt === 0) {
        ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3; ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.arc(140, 165, 76, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#dc2626'; ctx.fillText('💥 吸水過度脹破！', 140, 170);
      } else {
        var rRbc = salt === 0.9 ? 54 : 34;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath(); ctx.arc(140, 165, rRbc, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillText(salt === 0.9 ? '正常雙凹' : '脫水皺縮', 140, 170);
      }

      // 右邊：植物細胞（堅硬細胞壁）
      ctx.fillStyle = '#0f172a';
      ctx.fillText('植物細胞（有硬細胞壁）', 395, 40);
      ctx.strokeStyle = '#15803d'; ctx.lineWidth = 6;
      ctx.strokeRect(320, 95, 150, 140);
      var shrink = salt === 5 ? 26 : (salt === 0.9 ? 8 : 2);
      ctx.fillStyle = '#86efac';
      ctx.fillRect(320 + shrink, 95 + shrink, 150 - shrink * 2, 140 - shrink * 2);
      ctx.fillStyle = '#14532d';
      ctx.fillText(salt === 0 ? '飽滿膨壓不破！' : (salt === 0.9 ? '正常平衡' : '細胞膜萎縮(質離)'), 395, 170);
    }
    p.controlsEl.innerHTML =
      '<button class="btn-light sco-b" data-s="0">💧 泡入純水 (0%)</button>' +
      '<button class="btn-light sco-b active" data-s="0.9">🏥 生理食鹽水 (0.9%)</button>' +
      '<button class="btn-light sco-b" data-s="5">🧂 濃鹽水 (5%)</button>';
    function update() {
      p.readoutEl.innerHTML = salt === 0
        ? '🚨 <strong>純水（低張）：</strong>水大量衝進細胞！紅血球無硬殼護體會脹破，植物靠<strong>細胞壁</strong>頂住只會變飽滿！'
        : (salt === 0.9
          ? '✅ <strong>0.9% 生理食鹽水（等張）：</strong>水進水出一樣多，達到動態平衡！'
          : '🧂 <strong>濃鹽水（高張）：</strong>鹽進不去細胞膜，細胞內的水大量往外衝，導致紅血球皺縮、植物質離！');
      draw();
    }
    p.controlsEl.querySelectorAll('.sco-b').forEach(function (b) {
      b.addEventListener('click', function () {
        p.controlsEl.querySelectorAll('.sco-b').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active'); salt = parseFloat(b.getAttribute('data-s')); p.onInteract(); update();
      });
    });
    update();
  };

  // 17. 光合作用 CO2 成長與酵素溫度變性曲線
  R.s_photo_enzyme = function (p) {
    var temp = 37;
    var cooked = false;
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var ox = 65, oy = 260;
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ox, 35); ctx.lineTo(ox, oy); ctx.lineTo(495, oy); ctx.stroke();
      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('溫度 (°C) 0 → 70°C', 280, 290);
      ctx.fillText('酵素活性', ox, 24);

      // 鐘形曲線 (高峰在 37°C)
      ctx.strokeStyle = cooked ? '#94a3b8' : '#16a34a'; ctx.lineWidth = 3;
      ctx.beginPath();
      for (var t = 0; t <= 70; t += 2) {
        var act = cooked ? 0 : Math.max(0, 100 * Math.exp(-Math.pow((t - 37) / 14, 2)) * (t > 58 ? 0 : 1));
        var x = ox + t * 5.8, y = oy - act * 2.0;
        if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      var curAct = cooked ? 0 : (temp > 58 ? 0 : 100 * Math.exp(-Math.pow((temp - 37) / 14, 2)));
      var cx = ox + temp * 5.8, cy = oy - curAct * 2.0;
      ctx.fillStyle = cooked ? '#dc2626' : '#2563eb';
      ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillText(cooked ? '🍳 蛋白質已煮熟變形(永久歸零！)' : temp + '°C (活性 ' + curAct.toFixed(0) + '%)', Math.min(400, Math.max(150, cx)), cy - 14);
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>調整酵素溫度：<strong id="spe-t">37°C</strong>（試試先拉到 65°C 再降回 37°C！）</label><input id="spe-s" type="range" min="0" max="70" step="1" value="37"></div>' +
      '<button id="spe-res" class="btn-light">↺ 換一組全新酵素</button>';
    function update() {
      if (temp >= 60) cooked = true;
      p.controlsEl.querySelector('#spe-t').textContent = temp + '°C';
      p.readoutEl.innerHTML = cooked
        ? '🚨 <strong>不可逆破壞！</strong>高溫已經把蛋白質酵素像煮雞蛋一樣燙熟變形，現在就算降回 37°C 活性也永遠是 <strong>0%</strong>！'
        : (temp < 12
          ? '❄️ <strong>低溫休眠：</strong>酵素只是被凍僵動作變慢，結構完好，拉回 37°C 馬上復活！'
          : '✅ <strong>37°C 黃金活性區！</strong>別忘了：植物 24 小時都在呼吸，光合作用主要是抓空氣中的 CO₂ 與水長大！');
      draw();
    }
    p.controlsEl.querySelector('#spe-s').addEventListener('input', function (e) { temp = parseInt(e.target.value, 10); p.onInteract(); update(); });
    p.controlsEl.querySelector('#spe-res').addEventListener('click', function () { cooked = false; temp = 37; p.controlsEl.querySelector('#spe-s').value = 37; update(); });
    update();
  };

  // 18. 體循環與肺循環
  R.s_circulation = function (p) {
    var loop = 'pulmonary'; // pulmonary | systemic
    var rafId = null;
    var phase = 0;
    function draw() {
      phase = (phase + 0.008) % 1;
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      // 心臟四腔室簡圖
      ctx.fillStyle = '#dbeafe'; ctx.fillRect(190, 95, 78, 70); ctx.fillRect(190, 165, 78, 80); // 右心(減氧藍)
      ctx.fillStyle = '#fee2e2'; ctx.fillRect(268, 95, 78, 70); ctx.fillRect(268, 165, 78, 80); // 左心(充氧紅)
      ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2;
      ctx.strokeRect(190, 95, 156, 150);
      ctx.beginPath(); ctx.moveTo(268, 95); ctx.lineTo(268, 245); ctx.moveTo(190, 165); ctx.lineTo(346, 165); ctx.stroke();

      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('右心房', 229, 134); ctx.fillText('右心室', 229, 208);
      ctx.fillText('左心房', 307, 134); ctx.fillText('左心室(最厚)', 307, 208);

      // 上方肺部，下方全身組織
      ctx.fillStyle = '#e0f2fe'; ctx.fillRect(205, 18, 126, 40); ctx.strokeRect(205, 18, 126, 40);
      ctx.fillStyle = '#0369a1'; ctx.fillText('🫁 肺部微血管(換氧)', 268, 43);
      ctx.fillStyle = '#fef3c7'; ctx.fillRect(185, 270, 166, 38); ctx.strokeRect(185, 270, 166, 38);
      ctx.fillStyle = '#92400e'; ctx.fillText('🏃 全身組織微血管', 268, 294);

      // 流動血球
      if (loop === 'pulmonary') {
        var isOut = phase < 0.5;
        var x = isOut ? 140 : 395;
        var y = isOut ? (210 - (phase / 0.5) * 170) : (40 + ((phase - 0.5) / 0.5) * 95);
        ctx.fillStyle = isOut ? '#1d4ed8' : '#dc2626';
        ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillText('肺動脈(藍・減氧!)', 95, 135);
        ctx.fillText('肺靜脈(紅・充氧!)', 445, 135);
      } else {
        var isSysOut = phase < 0.5;
        var sx = isSysOut ? 395 : 140;
        var sy = isSysOut ? (205 + (phase / 0.5) * 85) : (290 - ((phase - 0.5) / 0.5) * 165);
        ctx.fillStyle = isSysOut ? '#dc2626' : '#1d4ed8';
        ctx.beginPath(); ctx.arc(sx, sy, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillText('主動脈(紅・充氧)', 445, 250);
        ctx.fillText('大靜脈(藍・減氧)', 95, 250);
      }
      rafId = global.requestAnimationFrame(draw);
    }
    p.controlsEl.innerHTML =
      '<button id="scir-p" class="btn-light active">🫁 觀察肺循環（破解肺動脈迷思！）</button>' +
      '<button id="scir-s" class="btn-light">🏃 觀察體循環（左心室打全身）</button>';
    function update() {
      p.readoutEl.innerHTML = loop === 'pulmonary'
        ? '🔵 <strong>肺循環：</strong>右心室推出「<strong>肺動脈（暗藍減氧血！）</strong>」去肺部換氣 → 吸飽氧變成「<strong>肺靜脈（鮮紅充氧血！）</strong>」回左心房！'
        : '🔴 <strong>體循環：</strong>肌肉最厚的左心室把鮮紅充氧血打進主動脈送往全身 → 耗完氧由上下大靜脈流回右心房！';
    }
    p.controlsEl.querySelector('#scir-p').addEventListener('click', function () {
      loop = 'pulmonary';
      p.controlsEl.querySelector('#scir-p').classList.add('active'); p.controlsEl.querySelector('#scir-s').classList.remove('active');
      p.onInteract(); update();
    });
    p.controlsEl.querySelector('#scir-s').addEventListener('click', function () {
      loop = 'systemic';
      p.controlsEl.querySelector('#scir-s').classList.add('active'); p.controlsEl.querySelector('#scir-p').classList.remove('active');
      p.onInteract(); update();
    });
    update(); draw();
    return function () { if (rafId) global.cancelAnimationFrame(rafId); };
  };

  // 19. 神經反射時間差賽跑
  R.s_nerve_reflex = function (p) {
    var mode = 'pin'; // pin(脊髓反射) | ball(大腦意識)
    var prog = 0;
    var running = false;
    var rafId = null;
    function draw() {
      if (running) {
        prog += 0.014;
        if (prog >= 1) { prog = 1; running = false; }
      }
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      // 畫三個節點：手指(90,230)、脊髓(270,180)、大腦(270,55)、肌肉(450,230)
      var nodes = [
        { x: 90, y: 230, lbl: '受器(手/眼)', col: '#f59e0b' },
        { x: 270, y: 180, lbl: '脊髓(急煞中心)', col: '#2563eb' },
        { x: 270, y: 55, lbl: '大腦(感覺痛/思考)', col: '#7c3aed' },
        { x: 450, y: 230, lbl: '動器(手部肌肉)', col: '#16a34a' }
      ];
      ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(90, 230); ctx.lineTo(270, 180); ctx.lineTo(450, 230);
      ctx.moveTo(270, 180); ctx.lineTo(270, 55); ctx.lineTo(450, 230);
      ctx.stroke();

      nodes.forEach(function (nd) {
        ctx.fillStyle = nd.col;
        ctx.beginPath(); ctx.arc(nd.x, nd.y, 16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(nd.lbl, nd.x, nd.y + 32);
      });

      if (prog > 0) {
        if (mode === 'pin') {
          // 藍光走捷徑：手 -> 脊髓 -> 肌肉（0.5就縮手！）
          var rProg = Math.min(1, prog * 1.8);
          var rx = rProg < 0.5 ? 90 + (rProg / 0.5) * 180 : 270 + ((rProg - 0.5) / 0.5) * 180;
          var ry = rProg < 0.5 ? 230 - (rProg / 0.5) * 50 : 180 + ((rProg - 0.5) / 0.5) * 50;
          ctx.fillStyle = '#2563eb'; ctx.beginPath(); ctx.arc(rx, ry, 8, 0, Math.PI * 2); ctx.fill();
          // 紅光往大腦跑（較慢才喊痛）
          var bProg = prog;
          var bx = bProg < 0.4 ? 90 + (bProg / 0.4) * 180 : 270;
          var by = bProg < 0.4 ? 230 - (bProg / 0.4) * 50 : 180 - ((bProg - 0.4) / 0.6) * 125;
          ctx.fillStyle = '#dc2626'; ctx.beginPath(); ctx.arc(bx, by, 7, 0, Math.PI * 2); ctx.fill();
          if (rProg >= 1) { ctx.fillStyle = '#16a34a'; ctx.fillText('⚡ 0.05s 已縮手！', 450, 195); }
          if (bProg >= 1) { ctx.fillStyle = '#dc2626'; ctx.fillText('💥 0.30s 才覺得痛！', 270, 26); }
        } else {
          var sx = prog < 0.5 ? 90 + (prog / 0.5) * 180 : 270 + ((prog - 0.5) / 0.5) * 180;
          var sy = prog < 0.5 ? 230 - (prog / 0.5) * 175 : 55 + ((prog - 0.5) / 0.5) * 175;
          ctx.fillStyle = '#7c3aed'; ctx.beginPath(); ctx.arc(sx, sy, 8, 0, Math.PI * 2); ctx.fill();
        }
      }
      rafId = global.requestAnimationFrame(draw);
    }
    p.controlsEl.innerHTML =
      '<button id="snr-pin" class="btn-primary">📌 模擬「手被針扎」（脊髓反射）</button>' +
      '<button id="snr-ball" class="btn-light">⚾ 模擬「看見球伸手接住」（大腦意識）</button>';
    function run(m) {
      mode = m; prog = 0; running = true; p.onInteract();
      p.readoutEl.innerHTML = m === 'pin'
        ? '⚡ <strong>先縮手、後喊痛！</strong>藍光訊號在<strong>脊髓</strong>直接迴轉令肌肉急煞（0.05秒），紅光訊號慢半拍爬到大腦皮層時才感覺痛（0.30秒）！'
        : '🧠 <strong>意識隨意運動：</strong>必須一路傳上大腦分析球速位置，再下令運動神經去接球，時間較長！';
    }
    p.controlsEl.querySelector('#snr-pin').addEventListener('click', function () { run('pin'); });
    p.controlsEl.querySelector('#snr-ball').addEventListener('click', function () { run('ball'); });
    p.readoutEl.innerHTML = '👆 點選下方按鈕，觀察「被針扎」與「接球」的神經訊號賽跑！';
    draw();
    return function () { if (rafId) global.cancelAnimationFrame(rafId); };
  };

  // 20. 遺傳與減數分裂棋盤
  R.s_genetics = function (p) {
    var parent1 = 'Tt', parent2 = 'Tt';
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var a = [parent1[0], parent1[1]], b = [parent2[0], parent2[1]];
      var ox = 175, oy = 75, cell = 90;
      ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#1d4ed8';
      ctx.fillText(a[0], ox + cell * 0.5, oy - 14); ctx.fillText(a[1], ox + cell * 1.5, oy - 14);
      ctx.fillStyle = '#dc2626';
      ctx.fillText(b[0], ox - 24, oy + cell * 0.5 + 6); ctx.fillText(b[1], ox - 24, oy + cell * 1.5 + 6);

      var tall = 0;
      for (var r = 0; r < 2; r++) {
        for (var c = 0; c < 2; c++) {
          var pair = [a[c], b[r]].sort().join('');
          var isTall = pair.indexOf('T') !== -1;
          if (isTall) tall += 1;
          ctx.fillStyle = isTall ? '#dcfce7' : '#fef3c7';
          ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
          ctx.fillRect(ox + c * cell, oy + r * cell, cell, cell);
          ctx.strokeRect(ox + c * cell, oy + r * cell, cell, cell);
          ctx.fillStyle = '#0f172a';
          ctx.fillText(pair, ox + c * cell + cell / 2, oy + r * cell + 38);
          ctx.font = '12px sans-serif';
          ctx.fillText(isTall ? '🌱 高莖' : '🌿 矮莖(隱性)', ox + c * cell + cell / 2, oy + r * cell + 64);
          ctx.font = 'bold 16px sans-serif';
        }
      }
      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 13px sans-serif';
      ctx.fillText('高莖機率：' + (tall * 25) + '% ｜ 矮莖機率：' + ((4 - tall) * 25) + '%', 270, 290);
    }
    p.controlsEl.innerHTML =
      '<button class="btn-light sgen-b active" data-p="Tt,Tt">親代 Tt × Tt（無中生有生矮莖！）</button>' +
      '<button class="btn-light sgen-b" data-p="Tt,tt">親代 Tt × tt（高矮 1:1）</button>' +
      '<button class="btn-light sgen-b" data-p="TT,tt">親代 TT × tt（100% 高莖）</button>';
    function update() {
      p.readoutEl.innerHTML =
        '🧬 減數分裂把親代成對染色體拆散成單套精卵（如 ' + parent1[0] + ' 與 ' + parent1[1] + '），再隨機組合！<br><br>' +
        (parent1 === 'Tt' && parent2 === 'Tt'
          ? '⭐ <strong>會考口訣「無中生有定隱性」：</strong>兩個都是高莖的父母 (Tt × Tt)，竟有 25% 機率生出隱性矮莖 (tt)！'
          : '💡 每一胎受精都是獨立事件，生男生女或性狀機率永遠重新計算！');
      draw();
    }
    p.controlsEl.querySelectorAll('.sgen-b').forEach(function (b) {
      b.addEventListener('click', function () {
        p.controlsEl.querySelectorAll('.sgen-b').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        var parts = b.getAttribute('data-p').split(',');
        parent1 = parts[0]; parent2 = parts[1]; p.onInteract(); update();
      });
    });
    update();
  };

  // 21. 10% 能量金字塔 vs 毒物濃縮
  R.s_food_pyramid = function (p) {
    var mode = 'energy'; // energy | toxin
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var levels = [
        { name: '🦅 老鷹(三級)', e: '10 J', t: '1000 ppm', wE: 70, wT: 320, col: '#ef4444' },
        { name: '🐸 青蛙(二級)', e: '100 J', t: '100 ppm', wE: 150, wT: 230, col: '#f59e0b' },
        { name: '🦗 蝗蟲(初級)', e: '1000 J', t: '10 ppm', wE: 240, wT: 140, col: '#3b82f6' },
        { name: '🌿 草地(生產者)', e: '10000 J', t: '1 ppm', wE: 340, wT: 70, col: '#16a34a' }
      ];
      levels.forEach(function (lv, idx) {
        var y = 45 + idx * 62;
        var w = mode === 'energy' ? lv.wE : lv.wT;
        ctx.fillStyle = mode === 'energy' ? lv.col : '#7c3aed';
        ctx.fillRect(270 - w / 2, y, w, 46);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(lv.name + '：' + (mode === 'energy' ? lv.e : lv.t), 270, y + 28);
      });
    }
    p.controlsEl.innerHTML =
      '<button id="sfp-e" class="btn-light active">☀️ 能量金字塔（每層遞減剩 10%）</button>' +
      '<button id="sfp-t" class="btn-light">☠️ 重金屬毒物（生物放大倒金字塔！）</button>';
    function update() {
      p.readoutEl.innerHTML = mode === 'energy'
        ? '☀️ <strong>能量單向散熱：</strong>每一階層呼吸維持體溫消耗掉 90% 能量，所以底座草地能量最多，頂端老鷹最少！'
        : '☠️ <strong>毒物剛好相反！</strong>重金屬排不出去會累積在脂肪中，大魚吃小魚一路往頂端老鷹大濃縮 1000 倍！';
      draw();
    }
    p.controlsEl.querySelector('#sfp-e').addEventListener('click', function () { mode = 'energy'; p.controlsEl.querySelector('#sfp-e').classList.add('active'); p.controlsEl.querySelector('#sfp-t').classList.remove('active'); p.onInteract(); update(); });
    p.controlsEl.querySelector('#sfp-t').addEventListener('click', function () { mode = 'toxin'; p.controlsEl.querySelector('#sfp-t').classList.add('active'); p.controlsEl.querySelector('#sfp-e').classList.remove('active'); p.onInteract(); update(); });
    update();
  };

  // 22. 凸透鏡兩條光線成像
  R.s_optics_lens = function (p) {
    var objDist = 140; // 焦距 F = 70 -> 2F = 140
    var F = 70;
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var cx = 270, cy = 165;
      // 主軸與透鏡
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(20, cy); ctx.lineTo(520, cy); ctx.stroke();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)'; ctx.strokeStyle = '#0284c7'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(cx, cy, 12, 110, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // 標記 F 與 2F
      [-2, -1, 1, 2].forEach(function (k) {
        var fx = cx + k * F;
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(fx, cy, 4, 0, Math.PI * 2); ctx.fill();
        ctx.font = '11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText((Math.abs(k) === 2 ? '2F' : 'F'), fx, cy + 16);
      });

      // 物體蠟燭
      var ox = cx - objDist, oh = 45;
      ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(ox, cy); ctx.lineTo(ox, cy - oh); ctx.stroke();

      // 成像公式 1/q = 1/F - 1/p
      if (Math.abs(objDist - F) < 3) {
        ctx.fillStyle = '#d97706'; ctx.font = 'bold 13px sans-serif';
        ctx.fillText('在焦點 F 上：光線平行射出，不成像！', cx + 110, 50);
      } else {
        var q = (objDist * F) / (objDist - F);
        var ih = -oh * (q / objDist); // 負數代表倒立實像
        var ix = cx + q;
        // 兩條特殊光線
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(ox, cy - oh); ctx.lineTo(cx, cy - oh); ctx.lineTo(ix, cy - ih); ctx.stroke();
        ctx.strokeStyle = '#10b981';
        ctx.beginPath(); ctx.moveTo(ox, cy - oh); ctx.lineTo(ix, cy - ih); ctx.stroke();

        // 畫像
        ctx.strokeStyle = q > 0 ? '#2563eb' : '#7c3aed';
        if (q < 0) ctx.setLineDash([4, 4]);
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(ix, cy); ctx.lineTo(ix, cy - ih); ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>拖動物體距離 p：<strong id="sol-p">140 (=2F)</strong></label><input id="sol-s" type="range" min="35" max="210" step="5" value="140"></div>';
    function update() {
      var lbl = objDist > 140 ? objDist + ' (>2F 縮小倒立實像)' : (objDist === 140 ? '140 (=2F 等大倒立實像)' : (objDist > 70 ? objDist + ' (F~2F 放大倒立實像)' : (objDist === 70 ? '70 (=F 不成像)' : objDist + ' (<F 正立放大虛像＝放大鏡!)')));
      p.controlsEl.querySelector('#sol-p').textContent = lbl;
      p.readoutEl.innerHTML =
        '✨ <strong>不用死背 6 格口訣表！</strong>只要看兩條光線：<br>' +
        '1. 黃線：平行主軸 → 過對面焦點 F<br>' +
        '2. 綠線：穿過鏡心 O → 直線不彎<br>' +
        '兩線真正交會就是倒立實像；發散虛線交會就是正立放大虛像！';
      draw();
    }
    p.controlsEl.querySelector('#sol-s').addEventListener('input', function (e) { objDist = parseInt(e.target.value, 10); p.onInteract(); update(); });
    update();
  };

  // 23. 熱學比熱與 0°C/100°C 狀態平台期
  R.s_heat_curve = function (p) {
    var heatTime = 10; // 0 ~ 30 分鐘
    function tempAt(t) {
      if (t <= 4) return -20 + t * 5;        // 冰升溫到 0
      if (t <= 10) return 0;                  // 0°C 融化平台期
      if (t <= 22) return ((t - 10) / 12) * 100; // 水升溫
      return 100;                             // 100°C 沸騰平台期
    }
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var ox = 65, oy = 250;
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ox, 30); ctx.lineTo(ox, oy); ctx.lineTo(500, oy); ctx.stroke();
      ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3;
      ctx.beginPath();
      for (var t = 0; t <= heatTime; t += 0.5) {
        var x = ox + t * 13.5, y = oy - (tempAt(t) + 20) * 1.65;
        if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
      var curT = tempAt(heatTime);
      var cx = ox + heatTime * 13.5, cy = oy - (curT + 20) * 1.65;
      ctx.fillStyle = '#2563eb'; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(curT.toFixed(0) + '°C', cx, cy - 12);
      ctx.fillText('加熱時間 (分)', 280, 285);
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>持續加熱時間：<strong id="shc-t">10 分鐘</strong></label><input id="shc-s" type="range" min="1" max="30" step="1" value="10"></div>';
    function update() {
      var curT = tempAt(heatTime);
      p.controlsEl.querySelector('#shc-t').textContent = heatTime + ' 分鐘';
      var note = (heatTime >= 4 && heatTime <= 10)
        ? '🧊 <strong>0°C 融化平台期！</strong>一直在加熱但溫度停住不動，因為熱量全部拿去拆散冰塊分子的牽手（潛熱）！'
        : (heatTime >= 22
          ? '💨 <strong>100°C 沸騰平台期！</strong>轉大火也不會變 110°C，熱量全拿去把液態水掙脫成水蒸氣！'
          : '🔥 單一狀態吸熱升溫中（遵守 H = m · s · ΔT）！');
      p.readoutEl.innerHTML = '目前溫度：<strong>' + curT.toFixed(1) + ' °C</strong><br><br>' + note;
      draw();
    }
    p.controlsEl.querySelector('#shc-s').addEventListener('input', function (e) { heatTime = parseInt(e.target.value, 10); p.onInteract(); update(); });
    update();
  };

  // 24. 質量守恆（開放 vs 密閉玻璃罩）
  R.s_mass_conserv = function (p) {
    var sealed = false;
    var reacted = false;
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var mass = !reacted ? 250 : (sealed ? 250 : 238);
      // 磅秤
      ctx.fillStyle = '#1e293b'; ctx.fillRect(150, 240, 240, 48);
      ctx.fillStyle = '#38bdf8'; ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center';
      ctx.fillText('電子秤：' + mass + '.0 g', 270, 270);

      // 燒杯
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 3;
      ctx.strokeRect(215, 130, 110, 108);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.fillRect(217, 175, 106, 61);

      if (sealed) {
        ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(270, 140, 95, Math.PI, 0); ctx.lineTo(365, 240); ctx.lineTo(175, 240); ctx.closePath(); ctx.stroke();
      }
      if (reacted) {
        ctx.fillStyle = '#64748b'; ctx.font = 'bold 12px sans-serif';
        ctx.fillText(sealed ? '☁️ 12g CO₂ 氣體全部被罩在裡面！' : '💨 12g CO₂ 氣體逃出燒杯飛走了！', 270, sealed ? 105 : 65);
      }
    }
    p.controlsEl.innerHTML =
      '<button id="smc-seal" class="btn-light">🔔 切換「開放燒杯 / 蓋密閉玻璃罩」</button>' +
      '<button id="smc-go" class="btn-primary">🧪 加入鹽酸＋大理石開始反應！</button>';
    function update() {
      p.readoutEl.innerHTML = !reacted
        ? '反應前總重：<strong>250 g</strong>。點按「開始反應」並比較有無密閉罩的磅秤讀數！'
        : (sealed
          ? '✅ <strong>密閉罩內始終 250 g！</strong>原子樂高只是重組，沒有一顆消失，完美證明質量守恆！'
          : '🚨 <strong>開放燒杯掉到 238 g！</strong>不是違反質量守恆，而是少掉的 12 g 變成看不見的 CO₂ 飛走了！');
      draw();
    }
    p.controlsEl.querySelector('#smc-seal').addEventListener('click', function () { sealed = !sealed; p.onInteract(); update(); });
    p.controlsEl.querySelector('#smc-go').addEventListener('click', function () { reacted = true; p.onInteract(); update(); });
    update();
  };

  // 25. 酸鹼滴定離子舞池
  R.s_redox_titration = function (p) {
    var drops = 0; // 0 ~ 12，當量點在第 6 滴
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var isBasic = drops > 6;
      var isExact = drops === 6;
      // 錐形瓶
      ctx.fillStyle = isBasic ? 'rgba(244, 114, 182, 0.55)' : 'rgba(226, 232, 240, 0.5)';
      ctx.beginPath(); ctx.moveTo(190, 120); ctx.lineTo(140, 265); ctx.lineTo(310, 265); ctx.lineTo(260, 120); ctx.closePath();
      ctx.fill(); ctx.strokeStyle = '#334155'; ctx.lineWidth = 2.5; ctx.stroke();

      var hLeft = Math.max(0, 6 - drops);
      var ohExtra = Math.max(0, drops - 6);
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      for (var i = 0; i < hLeft; i++) {
        ctx.fillStyle = '#dc2626'; ctx.fillText('H⁺', 175 + i * 22, 240);
      }
      for (var j = 0; j < ohExtra; j++) {
        ctx.fillStyle = '#2563eb'; ctx.fillText('OH⁻', 175 + j * 26, 240);
      }
      ctx.fillStyle = '#0f172a';
      ctx.fillText('已滴入 NaOH：' + drops + ' 滴', 225, 90);
      ctx.fillText(isExact ? '⚖️ 剛好當量點 (pH=7)' : (isBasic ? '🌸 過量 1 滴瞬間變粉紅！' : '💧 仍有 H⁺ (酚酞無色)'), 225, 295);

      // 右側 pH 讀數條
      var ph = drops < 6 ? (1.5 + drops * 0.4) : (drops === 6 ? 7.0 : (11.2 + (drops - 6) * 0.3));
      ctx.fillStyle = '#f1f5f9'; ctx.fillRect(390, 60, 44, 210);
      ctx.fillStyle = ph < 7 ? '#ef4444' : (ph === 7 ? '#16a34a' : '#db2777');
      var hBar = (ph / 14) * 210;
      ctx.fillRect(390, 270 - hBar, 44, hBar);
      ctx.strokeRect(390, 60, 44, 210);
      ctx.fillStyle = '#0f172a'; ctx.fillText('pH ' + ph.toFixed(1), 412, 48);
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>控制滴定管滴入 NaOH 滴數：<strong id="srt-d">0 滴</strong></label><input id="srt-s" type="range" min="0" max="10" step="1" value="0"></div>';
    function update() {
      p.controlsEl.querySelector('#srt-d').textContent = drops + ' 滴';
      p.readoutEl.innerHTML =
        '酸鹼中和本質：<span class="math-expr">H⁺ + OH⁻ → H₂O（放熱）</span><br><br>' +
        (drops < 6 ? '目前還有 ' + (6 - drops) + ' 顆 H⁺ 沒配對完，維持酸性無色。' : (drops === 6 ? '✅ <strong>當量點！</strong>H⁺ 與 OH⁻ 剛好 1:1 全部配對變水！' : '🌸 <strong>瞬間變粉紅！</strong>只要多滴 1 滴孤單的 OH⁻，pH 就從 7 垂直跳到 11+！'));
      draw();
    }
    p.controlsEl.querySelector('#srt-s').addEventListener('input', function (e) { drops = parseInt(e.target.value, 10); p.onInteract(); update(); });
    update();
  };

  // 26. 推箱子靜摩擦反制 + v-t 面積位移
  R.s_newton_vt = function (p) {
    var push = 30; // 最大靜摩擦 50N，動摩擦 30N
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var moving = push > 50;
      var fric = moving ? 30 : push;
      var net = push - fric;

      // 地板與箱子
      ctx.fillStyle = '#cbd5e1'; ctx.fillRect(30, 225, 480, 14);
      ctx.fillStyle = '#b45309'; ctx.fillRect(210, 155, 110, 70);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(moving ? '🚀 加速中!' : '🧱 紋絲不動', 265, 195);

      // 推力紅箭頭（向右）與摩擦力藍箭頭（向左）
      ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(320, 190); ctx.lineTo(320 + push * 1.8, 190); ctx.stroke();
      ctx.fillStyle = '#dc2626'; ctx.fillText('推力 ' + push + 'N →', 350 + push * 0.9, 175);

      ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(210, 190); ctx.lineTo(210 - fric * 1.8, 190); ctx.stroke();
      ctx.fillStyle = '#2563eb'; ctx.fillText('← 摩擦 ' + fric + 'N', 180 - fric * 0.9, 175);

      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 14px sans-serif';
      ctx.fillText('合力 F合 = ' + net + ' N（最大靜摩擦力 = 50 N）', 270, 60);
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>調整推箱子力氣：<strong id="snv-p">30 N</strong></label><input id="snv-s" type="range" min="0" max="80" step="5" value="30"></div>';
    function update() {
      p.controlsEl.querySelector('#snv-p').textContent = push + ' N';
      var moving = push > 50;
      p.readoutEl.innerHTML = moving
        ? '🚀 <strong>突破 50N 門檻開始加速！</strong>一滑動後改受固定 30N 動摩擦力，合力 = ' + (push - 30) + ' N！'
        : '🧱 <strong>推不動（靜止合力 = 0）！</strong>注意看藍箭頭：你推 <strong>' + push + ' N</strong>，靜摩擦力就剛好等於 <strong>' + push + ' N</strong>（絕對不是大於推力！）。';
      draw();
    }
    p.controlsEl.querySelector('#snv-s').addEventListener('input', function (e) { push = parseInt(e.target.value, 10); p.onInteract(); update(); });
    update();
  };

  // 27. 雲霄飛車位能動能熱能轉換
  R.s_coaster_energy = function (p) {
    var pos = 0; // 0(高點) -> 50(谷底) -> 100(第二峰)
    var friction = false;
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      // 軌道 y(t)
      function trackY(t) { return 165 - 75 * Math.cos((t / 50) * Math.PI); }
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 4;
      ctx.beginPath();
      for (var t = 0; t <= 100; t += 2) {
        var x = 40 + t * 2.8, y = trackY(t);
        if (t === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      var cx = 40 + pos * 2.8, cy = trackY(pos);
      ctx.fillStyle = '#ea580c'; ctx.beginPath(); ctx.arc(cx, cy - 10, 10, 0, Math.PI * 2); ctx.fill();

      // 能量計算 (總能 = 100)
      var thermal = friction ? pos * 0.35 : 0;
      var pe = Math.max(0, ((240 - cy) / 150) * 100);
      var ke = Math.max(0, 100 - pe - thermal);

      var bars = [
        { lbl: '位能', v: pe, col: '#2563eb' },
        { lbl: '動能', v: ke, col: '#f97316' },
        { lbl: '熱能', v: thermal, col: '#dc2626' }
      ];
      bars.forEach(function (b, idx) {
        var bx = 365 + idx * 52;
        ctx.fillStyle = b.col; ctx.fillRect(bx, 255 - b.v * 1.7, 36, b.v * 1.7);
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(b.lbl, bx + 18, 272);
        ctx.fillText(b.v.toFixed(0), bx + 18, 250 - b.v * 1.7);
      });
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>拖動雲霄飛車位置：<strong id="sce-p">0%</strong></label><input id="sce-s" type="range" min="0" max="100" step="5" value="0"></div>' +
      '<button id="sce-f" class="btn-light">🔥 開啟真實摩擦力</button>';
    function update() {
      p.controlsEl.querySelector('#sce-p').textContent = pos + '%';
      p.readoutEl.innerHTML = friction
        ? '🔥 <strong>含摩擦力：</strong>部分機械能轉成「紅色熱能」散失，台車爬不到原本一樣高的第二峰！但「位＋動＋熱」總能量依然守恆！'
        : '🎢 <strong>理想無摩擦：</strong>越低動能越大、越高位能越大，總力學能永遠維持 100 不變！';
      draw();
    }
    p.controlsEl.querySelector('#sce-s').addEventListener('input', function (e) { pos = parseInt(e.target.value, 10); p.onInteract(); update(); });
    p.controlsEl.querySelector('#sce-f').addEventListener('click', function (e) { friction = !friction; e.target.classList.toggle('active', friction); p.onInteract(); update(); });
    update();
  };

  // 28. 板塊聚合與冷暖鋒面
  R.s_plate_front = function (p) {
    var front = 'cold'; // cold | warm | stationary
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      ctx.fillStyle = '#cbd5e1'; ctx.fillRect(20, 265, 500, 30);
      ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      if (front === 'cold') {
        ctx.fillStyle = 'rgba(37, 99, 235, 0.35)';
        ctx.beginPath(); ctx.moveTo(20, 265); ctx.lineTo(290, 265); ctx.lineTo(200, 140); ctx.lineTo(20, 140); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
        ctx.beginPath(); ctx.moveTo(290, 265); ctx.lineTo(520, 265); ctx.lineTo(520, 60); ctx.lineTo(200, 140); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#1e3a8a'; ctx.fillText('❄️ 冷氣團推土機猛衝 →', 130, 235);
        ctx.fillStyle = '#b91c1c'; ctx.fillText('⬆️ 暖氣團被猛力抬升成雷雨雲！', 345, 110);
      } else if (front === 'warm') {
        ctx.fillStyle = 'rgba(37, 99, 235, 0.3)';
        ctx.beginPath(); ctx.moveTo(240, 265); ctx.lineTo(520, 265); ctx.lineTo(520, 190); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        ctx.beginPath(); ctx.moveTo(20, 265); ctx.lineTo(240, 265); ctx.lineTo(520, 190); ctx.lineTo(520, 100); ctx.lineTo(20, 100); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#b91c1c'; ctx.fillText('暖氣團輕輕斜爬上冷空氣背 → 綿延小雨', 260, 140);
      } else {
        ctx.fillStyle = 'rgba(37, 99, 235, 0.35)'; ctx.fillRect(20, 175, 250, 90);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)'; ctx.fillRect(270, 145, 250, 120);
        ctx.fillStyle = '#0f172a'; ctx.fillText('🌧️ 冷暖勢均力敵卡在台灣上空＝5-6月梅雨季！', 270, 95);
      }
    }
    p.controlsEl.innerHTML =
      '<button class="btn-light spf-b active" data-f="cold">❄️ 冷鋒（驟雨降溫）</button>' +
      '<button class="btn-light spf-b" data-f="warm">☀️ 暖鋒（溫和連雨）</button>' +
      '<button class="btn-light spf-b" data-f="stationary">🌧️ 滯留鋒（台灣梅雨）</button>';
    function update() {
      p.readoutEl.innerHTML =
        '氣象鐵則：<strong>空氣上升冷卻才成雲下雨；下沉增溫就放晴！</strong><br>' +
        '地質鐵則：板塊包含地殼＋上部地函（海底也有板塊），台灣是菲律賓海與歐亞板塊聚合擠出的！';
      draw();
    }
    p.controlsEl.querySelectorAll('.spf-b').forEach(function (b) {
      b.addEventListener('click', function () {
        p.controlsEl.querySelectorAll('.spf-b').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active'); front = b.getAttribute('data-f'); p.onInteract(); update();
      });
    });
    update();
  };

  // 29. 天文四季直射斜射網格與月相
  R.s_astro_seasons = function (p) {
    var season = 'summer'; // summer | winter
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var isSum = season === 'summer';
      // 畫太陽手電筒光束照在地面
      ctx.fillStyle = '#facc15';
      ctx.beginPath(); ctx.arc(isSum ? 270 : 120, 55, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(250, 204, 21, 0.32)';
      ctx.beginPath();
      if (isSum) {
        ctx.moveTo(245, 75); ctx.lineTo(295, 75); ctx.lineTo(300, 245); ctx.lineTo(240, 245);
      } else {
        ctx.moveTo(105, 75); ctx.lineTo(145, 75); ctx.lineTo(445, 245); ctx.lineTo(270, 245);
      }
      ctx.closePath(); ctx.fill();

      // 地面受熱區
      ctx.fillStyle = '#334155'; ctx.fillRect(40, 245, 460, 20);
      ctx.fillStyle = isSum ? '#dc2626' : '#fb923c';
      ctx.fillRect(isSum ? 240 : 270, 242, isSum ? 60 : 175, 10);

      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(isSum ? '☀️ 夏至直射：能量高度集中小小一塊 → 酷熱！' : '❄️ 冬至斜射：同把光攤平大片土地 → 寒冷！', 270, 295);
    }
    p.controlsEl.innerHTML =
      '<button id="sas-s" class="btn-light active">☀️ 北半球夏至（地軸朝太陽傾斜 23.5°）</button>' +
      '<button id="sas-w" class="btn-light">❄️ 北半球冬至（地軸背離太陽傾斜 23.5°）</button>';
    function update() {
      p.readoutEl.innerHTML = season === 'summer'
        ? '☀️ <strong>夏天不是因為離太陽近！</strong>事實上 7 月地球反而離太陽最遠！只是北半球朝太陽傾倒，陽光直射能量集中且晝長夜短！'
        : '❄️ <strong>冬天陽光斜射！</strong>同一束能量被迫攤平照在 3 倍大的土地上，單位面積熱量大幅稀釋！同時南半球澳洲正值盛夏！';
      draw();
    }
    p.controlsEl.querySelector('#sas-s').addEventListener('click', function () { season = 'summer'; p.controlsEl.querySelector('#sas-s').classList.add('active'); p.controlsEl.querySelector('#sas-w').classList.remove('active'); p.onInteract(); update(); });
    p.controlsEl.querySelector('#sas-w').addEventListener('click', function () { season = 'winter'; p.controlsEl.querySelector('#sas-w').classList.add('active'); p.controlsEl.querySelector('#sas-s').classList.remove('active'); p.onInteract(); update(); });
    update();
  };

  /* ========================================================================
     社會科互動視覺引擎 (8 個)
     ======================================================================== */

  // 30. 中國三級階梯水力落差
  R.soc_china_step = function (p) {
    var damPos = 1; // 1(階梯交界三峽) | 2(上海平坦入海口)
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      // 西高東低三級階梯
      ctx.fillStyle = '#a16207'; ctx.fillRect(30, 80, 140, 195);
      ctx.fillStyle = '#ca8a04'; ctx.fillRect(170, 155, 160, 120);
      ctx.fillStyle = '#65a30d'; ctx.fillRect(330, 225, 140, 50);
      ctx.fillStyle = '#0284c7'; ctx.fillRect(470, 235, 55, 40);

      ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('一階 青藏高原', 100, 125);
      ctx.fillText('二階 高原盆地', 250, 200);
      ctx.fillText('三階 東部平原', 400, 255);

      // 發電廠標記
      var dx = damPos === 1 ? 330 : 445;
      var dy = damPos === 1 ? 190 : 215;
      ctx.fillStyle = damPos === 1 ? '#16a34a' : '#dc2626';
      ctx.beginPath(); ctx.arc(dx, dy, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillText(damPos === 1 ? '⚡ 落差大！水力發電爆表！' : '⚠️ 平原無落差，發電微弱(適合航運)', 270, 42);
    }
    p.controlsEl.innerHTML =
      '<button id="scs-1" class="btn-light active">⚡ 蓋在「二、三階梯交界（長江三峽）」</button>' +
      '<button id="scs-2" class="btn-light">🚢 改蓋在「上海第三階平坦入海口」</button>';
    function update() {
      p.readoutEl.innerHTML = damPos === 1
        ? '✅ <strong>黃金選址！</strong>西高東低讓大河一路向東流，階梯交界懸崖處水流重力落差最大，水力發電效率最高！'
        : '🚢 第三階平原地勢平坦水流溫和，發不了什麼電，但最適合巨型貨輪航運通商！';
      draw();
    }
    p.controlsEl.querySelector('#scs-1').addEventListener('click', function () { damPos = 1; p.controlsEl.querySelector('#scs-1').classList.add('active'); p.controlsEl.querySelector('#scs-2').classList.remove('active'); p.onInteract(); update(); });
    p.controlsEl.querySelector('#scs-2').addEventListener('click', function () { damPos = 2; p.controlsEl.querySelector('#scs-2').classList.add('active'); p.controlsEl.querySelector('#scs-1').classList.remove('active'); p.onInteract(); update(); });
    update();
  };

  // 31. 世界氣候：地中海夏乾冬雨
  R.soc_world_climate = function (p) {
    var zone = 'med'; // med(地中海) | marine(溫帶海洋) | rain(熱帶雨林)
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var ox = 55, oy = 255;
      ctx.strokeStyle = '#334155'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(ox, 35); ctx.lineTo(ox, oy); ctx.lineTo(495, oy); ctx.stroke();

      var rains = zone === 'med' ? [95,85,70,45,25,10,5,12,40,75,95,100] : (zone === 'marine' ? [70,65,68,65,70,72,70,74,72,78,76,75] : [180,175,190,185,180,170,165,175,180,190,185,190]);
      var temps = zone === 'med' ? [9,10,12,15,20,24,27,27,23,18,13,10] : (zone === 'marine' ? [5,5,7,10,13,16,18,18,15,12,8,6] : [27,27,28,28,28,27,27,27,28,28,27,27]);

      for (var m = 0; m < 12; m++) {
        var bx = ox + 15 + m * 35;
        ctx.fillStyle = '#60a5fa';
        ctx.fillRect(bx, oy - rains[m] * 0.9, 20, rains[m] * 0.9);
      }
      ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3;
      ctx.beginPath();
      for (var t = 0; t < 12; t++) {
        var tx = ox + 25 + t * 35, ty = oy - temps[t] * 6.5;
        if (t === 0) ctx.moveTo(tx, ty); else ctx.lineTo(tx, ty);
      }
      ctx.stroke();
      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('1月 → 7月(北半球最熱) → 12月（紅線＝氣溫、藍柱＝雨量）', 275, 285);
    }
    p.controlsEl.innerHTML =
      '<button class="btn-light swc-b active" data-z="med">🍇 地中海型（夏乾冬雨）</button>' +
      '<button class="btn-light swc-b" data-z="marine">☔ 溫帶海洋（全年有雨）</button>' +
      '<button class="btn-light swc-b" data-z="rain">🌴 熱帶雨林（終年高溫多雨）</button>';
    function update() {
      p.readoutEl.innerHTML = zone === 'med'
        ? '🍇 <strong>地中海型氣候秒認法：</strong>7月氣溫紅線爬到最高點時，藍色雨量柱卻掉到谷底（<strong>笑臉配哭臉反著長！</strong>）——因為夏天副高蓋頂不下雨，冬天西風移入才下雨！'
        : (zone === 'marine'
          ? '☔ <strong>溫帶海洋性氣候：</strong>終年吹西風加暖流調節，雨量平頭均勻、冬暖夏涼！'
          : '🌴 <strong>熱帶雨林氣候：</strong>赤道低壓終年對流旺盛，紅線平貼高溫(>25°C)且藍柱全年爆表！');
      draw();
    }
    p.controlsEl.querySelectorAll('.swc-b').forEach(function (b) {
      b.addEventListener('click', function () {
        p.controlsEl.querySelectorAll('.swc-b').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active'); zone = b.getAttribute('data-z'); p.onInteract(); update();
      });
    });
    update();
  };

  // 32. 台灣歷史朝代與經濟重心北移
  R.soc_tw_history = function (p) {
    var era = 0; // 0:荷西1624 | 1:清領初(一府) | 2:1860開港(茶葉樟腦北移)
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      // 簡化台灣蕃薯輪廓
      ctx.fillStyle = '#bbf7d0'; ctx.strokeStyle = '#15803d'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.ellipse(270, 160, 48, 125, 0.25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      var hubY = era === 0 ? 220 : (era === 1 ? 185 : 85);
      var hubX = era === 0 ? 245 : (era === 1 ? 255 : 295);
      ctx.fillStyle = '#dc2626';
      ctx.beginPath(); ctx.arc(hubX, hubY, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'left';
      var labels = ['大員(安平)：鹿皮蔗糖轉口站', '一府二鹿：嘉南稻米蔗糖重心', '三艋舺/大稻埕：茶葉樟腦帶動北移！'];
      ctx.fillText('★ ' + labels[era], hubX + 18, hubY + 5);
    }
    p.controlsEl.innerHTML =
      '<div class="slider-group"><label>拖動歷史時間軸：<strong id="sth-e">1624 荷西時期</strong></label><input id="sth-s" type="range" min="0" max="2" step="1" value="0"></div>';
    function update() {
      var names = ['1624 荷西時期', '1700s 清領初期（南重北輕）', '1860 開港通商（經濟北移台北！）'];
      var notes = [
        '⛵ <strong>大航海十字路口：</strong>荷蘭佔大員(安平)當轉運站，出口鹿皮蔗糖、轉賣中國絲綢與日本白銀！',
        '🌾 <strong>一府二鹿：</strong>早期移民從福建渡海，台南鹿耳門深水港與平坦嘉南平原種稻米蔗糖最繁榮。',
        '🍵 <strong>為何重心北移？</strong>南部港口淤積＋開港後外商狂買「北部山坡的茶葉與樟腦」，台北正式躍升政經心臟！'
      ];
      p.controlsEl.querySelector('#sth-e').textContent = names[era];
      p.readoutEl.innerHTML = notes[era];
      draw();
    }
    p.controlsEl.querySelector('#sth-s').addEventListener('input', function (e) { era = parseInt(e.target.value, 10); p.onInteract(); update(); });
    update();
  };

  // 33. 中國歷史 400mm 農牧拉鋸與白銀流動
  R.soc_china_history = function (p) {
    var theme = 'wall'; // wall | silver
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      if (theme === 'wall') {
        ctx.fillStyle = '#fef3c7'; ctx.fillRect(30, 35, 480, 115);
        ctx.fillStyle = '#dcfce7'; ctx.fillRect(30, 150, 480, 130);
        ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 4; ctx.setLineDash([8, 5]);
        ctx.beginPath(); ctx.moveTo(30, 150); ctx.lineTo(510, 150); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('🐎 北方游牧民族（雨量 < 400mm，天冷乾旱即南下搶糧／互市）', 270, 95);
        ctx.fillText('🧱 萬里長城 ＝ 400mm 等雨量線', 270, 144);
        ctx.fillText('🌾 南方定居農耕漢人（雨量 > 400mm，安史/靖康後重心移往江南）', 270, 220);
      } else {
        ctx.fillStyle = '#e0f2fe'; ctx.fillRect(30, 35, 480, 245);
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('🪙 美洲白銀 ──(馬尼拉大帆船)──▶ 明清中國（一條鞭法銀本位）', 270, 115);
        ctx.fillText('🪙 日本石見銀山 ─────────────────▶ 換購中國絲綢、茶葉、瓷器', 270, 175);
        ctx.fillStyle = '#15803d';
        ctx.fillText('🌍 明清並非孤島，而是大航海時代全球白銀貿易最大終點站！', 270, 235);
      }
    }
    p.controlsEl.innerHTML =
      '<button id="sch-w" class="btn-light active">🧱 400mm 農牧界線與長城</button>' +
      '<button id="sch-s" class="btn-light">🪙 明清全球白銀流動網</button>';
    function update() {
      p.readoutEl.innerHTML = theme === 'wall'
        ? '🧱 長城剛好蓋在年雨量 400mm 線上：氣候變冷草原枯萎時，游牧騎兵南下衝突，進而演變成北魏、元、清的民族大融合！'
        : '🪙 張居正一條鞭法改用白銀繳稅，剛好遇上美洲與日本挖出海量白銀買中國茶瓷，全球一半白銀流進東亞！';
      draw();
    }
    p.controlsEl.querySelector('#sch-w').addEventListener('click', function () { theme = 'wall'; p.controlsEl.querySelector('#sch-w').classList.add('active'); p.controlsEl.querySelector('#sch-s').classList.remove('active'); p.onInteract(); update(); });
    p.controlsEl.querySelector('#sch-s').addEventListener('click', function () { theme = 'silver'; p.controlsEl.querySelector('#sch-s').classList.add('active'); p.controlsEl.querySelector('#sch-w').classList.remove('active'); p.onInteract(); update(); });
    update();
  };

  // 34. 世界大戰因果骨牌鏈
  R.soc_world_wars = function (p) {
    var step = 0;
    var dominoes = [
      { title: '1. 工業革命', desc: '機器暴產缺原料與市場 → 列強出海搶殖民地（新帝國主義）。' },
      { title: '2. 結盟火藥庫 → 一戰', desc: '殖民地分完起衝突，三國同盟 vs 協約國因塞拉耶佛刺殺全面開戰！' },
      { title: '3. 凡爾賽條約＋大恐慌', desc: '德國被罰破產加上 1929 全球失業，絕望民眾把權力交給極權法西斯！' },
      { title: '4. 二戰 → 美蘇冷戰', desc: '同盟國打敗軸心國後，美蘇因意識形態與核武恐怖平衡進入冷戰對峙！' }
    ];
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      dominoes.forEach(function (d, idx) {
        var fallen = idx <= step;
        var x = 75 + idx * 120;
        ctx.save();
        ctx.translate(x, 220);
        ctx.rotate(fallen ? 0.42 : 0);
        ctx.fillStyle = fallen ? '#2563eb' : '#94a3b8';
        ctx.fillRect(-20, -110, 40, 110);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(String(idx + 1), 0, -50);
        ctx.restore();
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(d.title, x, 255);
      });
    }
    p.controlsEl.innerHTML =
      '<button id="sww-next" class="btn-primary">👉 推倒下一張歷史因果骨牌！</button>' +
      '<button id="sww-res" class="btn-light">↺ 重排骨牌</button>';
    function update() {
      p.readoutEl.innerHTML = '<strong>' + dominoes[step].title + '</strong><br><br>' + dominoes[step].desc;
      draw();
    }
    p.controlsEl.querySelector('#sww-next').addEventListener('click', function () { step = (step + 1) % dominoes.length; p.onInteract(); update(); });
    p.controlsEl.querySelector('#sww-res').addEventListener('click', function () { step = 0; update(); });
    update();
  };

  // 35. 社會規範與民刑行政三管分流
  R.soc_law_pipes = function (p) {
    var caseIdx = 0;
    var cases = [
      { title: '酒駕撞壞路邊超跑並撞傷車主', pipes: ['民法(賠修車醫藥)', '刑法(公共危險罰金/坐牢)', '行政法(吊銷駕照罰鍰)'], col: '#dc2626' },
      { title: '網購寄來瑕疵耳機賣家拒絕退貨', pipes: ['民法(解除契約退錢)'], col: '#16a34a' },
      { title: '騎機車闖紅燈未撞到人被警察攔下', pipes: ['行政法(開紅單繳罰鍰・無前科)'], col: '#2563eb' },
      { title: '搭捷運滑手機不讓博愛座', pipes: ['僅道德規範（無國家法律強制罰則）'], col: '#d97706' }
    ];
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      var c = cases[caseIdx];
      ctx.fillStyle = '#f1f5f9'; ctx.fillRect(60, 30, 420, 56);
      ctx.strokeStyle = '#334155'; ctx.strokeRect(60, 30, 420, 56);
      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('案例：' + c.title, 270, 64);

      c.pipes.forEach(function (txt, idx) {
        var y = 125 + idx * 55;
        ctx.fillStyle = c.col; ctx.fillRect(90, y, 360, 40);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif';
        ctx.fillText('▶ ' + txt, 270, y + 25);
      });
    }
    p.controlsEl.innerHTML =
      '<button id="slp-next" class="btn-primary">🎲 切換下一個生活法律情境案例</button>';
    function update() {
      p.readoutEl.innerHTML =
        '⚖️ <strong>三秒分流口訣：</strong><br>' +
        '• <strong>民法：</strong>私人對私人賠錢<br>' +
        '• <strong>刑法：</strong>危害治安留前科（罰金／坐牢）<br>' +
        '• <strong>行政法：</strong>對政府違規（罰鍰，無刑事前科）<br>' +
        '👉 注意：酒駕撞人這種嚴重事件會<strong>同時觸發三種法律責任</strong>！';
      draw();
    }
    p.controlsEl.querySelector('#slp-next').addEventListener('click', function () { caseIdx = (caseIdx + 1) % cases.length; p.onInteract(); update(); });
    update();
  };

  // 36. 五權制衡齒輪 vs 獨裁模式
  R.soc_gov_gears = function (p) {
    var mode = 'checks'; // checks | dictator
    var angle = 0;
    var rafId = null;
    function draw() {
      angle += mode === 'checks' ? 0.02 : 0.08;
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      function gear(x, y, r, rot, col, lbl) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
        for (var i = 0; i < 6; i++) {
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(i * Math.PI / 3) * r, Math.sin(i * Math.PI / 3) * r); ctx.stroke();
        }
        ctx.restore();
        ctx.fillStyle = '#0f172a'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(lbl, x, y + r + 18);
      }
      if (mode === 'checks') {
        gear(155, 155, 48, angle, '#2563eb', '行政權(執行)');
        gear(270, 155, 48, -angle, '#16a34a', '立法權(審預算/倒閣)');
        gear(385, 155, 48, angle, '#d97706', '司法權(釋憲裁判)');
        ctx.fillStyle = '#15803d'; ctx.font = 'bold 13px sans-serif';
        ctx.fillText('⚖️ 權力互鎖互相牽制：防止單一權力腐化獨裁！', 270, 50);
      } else {
        gear(270, 155, 85, angle, '#dc2626', '單一獨裁大老闆(全包)');
        ctx.fillStyle = '#dc2626'; ctx.font = 'bold 13px sans-serif';
        ctx.fillText('🚨 無制衡：亂編預算與抓人無人能擋，人民基本權歸零！', 270, 42);
      }
      rafId = global.requestAnimationFrame(draw);
    }
    p.controlsEl.innerHTML =
      '<button id="sgg-c" class="btn-light active">⚖️ 權力分立制衡模式</button>' +
      '<button id="sgg-d" class="btn-light">🚨 獨裁合併模式（看看會怎樣）</button>';
    function update() {
      p.readoutEl.innerHTML = mode === 'checks'
        ? '✅ <strong>制衡機制：</strong>立法院可提「不信任案」逼行政院長下台；總統也能被動「解散立法院重選」；違憲法律由司法院大法官宣告無效！'
        : '🚨 <strong>獨裁警告：</strong>訂規矩、花錢、抓人全給同一個人管，效率雖高但一旦腐敗完全沒救！';
    }
    p.controlsEl.querySelector('#sgg-c').addEventListener('click', function () { mode = 'checks'; p.controlsEl.querySelector('#sgg-c').classList.add('active'); p.controlsEl.querySelector('#sgg-d').classList.remove('active'); p.onInteract(); update(); });
    p.controlsEl.querySelector('#sgg-d').addEventListener('click', function () { mode = 'dictator'; p.controlsEl.querySelector('#sgg-d').classList.add('active'); p.controlsEl.querySelector('#sgg-c').classList.remove('active'); p.onInteract(); update(); });
    update(); draw();
    return function () { if (rafId) global.cancelAnimationFrame(rafId); };
  };

  // 37. 九年級社會跨科素養模擬儀
  R.soc_cross_review = function (p) {
    var lens = 'geo'; // geo | hist | civ
    function draw() {
      var ctx = p.ctx;
      ctx.clearRect(0, 0, p.width, p.height);
      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('🌏 核心案例：台灣半導體產業與全球供應鏈', 270, 46);

      var cards = [
        { k: 'geo', x: 95, col: '#0284c7', t: '地理視角', sub: '位居東亞航運樞紐\n須防缺水與地震防災' },
        { k: 'hist', x: 270, col: '#d97706', t: '歷史視角', sub: '冷戰美援→加工出口\n→竹科科技轉型脈絡' },
        { k: 'civ', x: 445, col: '#16a34a', t: '公民視角', sub: '比較利益國際分工\n兼顧環境外部成本' }
      ];
      cards.forEach(function (c) {
        var active = c.k === lens;
        ctx.fillStyle = active ? c.col : '#e2e8f0';
        ctx.fillRect(c.x - 75, 95, 150, 150);
        ctx.fillStyle = active ? '#fff' : '#334155';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(c.t, c.x, 130);
        ctx.font = '12px sans-serif';
        c.sub.split('\n').forEach(function (line, i) { ctx.fillText(line, c.x, 168 + i * 24); });
      });
    }
    p.controlsEl.innerHTML =
      '<button class="btn-light scr-b active" data-l="geo">🏔️ 地理視角</button>' +
      '<button class="btn-light scr-b" data-l="hist">📜 歷史視角</button>' +
      '<button class="btn-light scr-b" data-l="civ">⚖️ 公民視角</button>';
    function update() {
      var map = {
        geo: '🏔️ <strong>地理素養：</strong>分析空間區位（群聚效應、交通樞紐）與自然環境限制（乾旱水庫、斷層防災）。',
        hist: '📜 <strong>歷史素養：</strong>理解從戰後農轉工、十大建設到新竹科學園區的時代背景與全球冷戰脈絡。',
        civ: '⚖️ <strong>公民素養：</strong>運用比較利益、國際貿易組織與企業社會責任（ESG／內部化外部成本）做理性思辨。'
      };
      p.readoutEl.innerHTML = map[lens];
      draw();
    }
    p.controlsEl.querySelectorAll('.scr-b').forEach(function (b) {
      b.addEventListener('click', function () {
        p.controlsEl.querySelectorAll('.scr-b').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active'); lens = b.getAttribute('data-l'); p.onInteract(); update();
      });
    });
    update();
  };
})(window);
