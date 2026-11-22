/* ==========================================================================
   visuals-math.js — 國中數學 18 單元專屬互動 SVG 圖解與動畫引擎
   掛載介面：window.JuniorHandbookVisuals[unitId] = { title, subtitle, mount(el) }
   零外部套件、零原始 LaTeX 語法，全採用高對比響應式內嵌 SVG。
   ========================================================================== */
(function (global) {
  'use strict';

  var V = (global.JuniorHandbookVisuals = global.JuniorHandbookVisuals || {});

  var FONT = "system-ui, -apple-system, 'Noto Sans TC', sans-serif";

  function esc(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      var t = a % b;
      a = b;
      b = t;
    }
    return a;
  }

  function fmtNum(n) {
    return n < 0 ? '−' + Math.abs(n) : String(n);
  }

  function fmtSigned(n) {
    return n >= 0 ? '+ ' + n : '− ' + Math.abs(n);
  }

  function fmtSignedTight(n) {
    return n >= 0 ? '+' + n : '−' + Math.abs(n);
  }

  function fmtCoefX(c, showPlus) {
    if (c === 0) return '0x';
    var sign = c < 0 ? '−' : (showPlus ? '+' : '');
    var abs = Math.abs(c);
    return sign + (abs === 1 ? 'x' : abs + 'x');
  }

  function fmtBinom(p, r) {
    var px = p === 1 ? 'x' : (p === -1 ? '−x' : fmtNum(p) + 'x');
    return '(' + px + ' ' + fmtSigned(r) + ')';
  }

  function arrowDef(id, color) {
    return (
      '<marker id="' + id + '" viewBox="0 0 10 10" refX="8.2" refY="5" ' +
      'markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
      '<path d="M 1 1.5 L 9 5 L 1 8.5 z" fill="' + color + '"/>' +
      '</marker>'
    );
  }

  function svgWrap(inner, h) {
    return (
      '<svg viewBox="0 0 640 ' + (h || 270) + '" class="hb-vis-svg" ' +
      'xmlns="http://www.w3.org/2000/svg" style="font-family:' + FONT + ';">' +
      inner +
      '</svg>'
    );
  }

  function pill(x, y, w, h, text, bg, fg, stroke, fs) {
    var fontSize = fs || 12;
    var lines = String(text == null ? '' : text).split('\n');
    var rx = lines.length > 1 ? Math.min(10, h / 2) : Math.min(16, h / 2);
    var out =
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" ' +
      'fill="' + bg + '" stroke="' + (stroke || 'none') + '" stroke-width="1.5"/>';
    if (lines.length === 1) {
      out +=
        '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + fontSize * 0.36) + '" ' +
        'text-anchor="middle" font-size="' + fontSize + '" font-weight="700" fill="' + fg + '">' +
        esc(lines[0]) + '</text>';
    } else {
      var lineH = fontSize * 1.42;
      var blockH = lineH * (lines.length - 1);
      var startY = y + h / 2 - blockH / 2 + fontSize * 0.34;
      for (var i = 0; i < lines.length; i++) {
        out +=
          '<text x="' + (x + w / 2) + '" y="' + (startY + i * lineH).toFixed(1) + '" ' +
          'text-anchor="middle" font-size="' + fontSize + '" font-weight="700" fill="' + fg + '">' +
          esc(lines[i]) + '</text>';
      }
    }
    return out;
  }

  function card(x, y, w, h, bg, stroke, rx) {
    return (
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 10) + '" ' +
      'fill="' + bg + '" stroke="' + stroke + '" stroke-width="1.5"/>'
    );
  }

  /* ========================================================================
     1. MATH_7_1_1 — 數線與絕對值雙解圖解 ＋ 正負數乘除口訣表
     ======================================================================== */
  V['MATH_7_1_1'] = {
    title: '🎨 數線絕對值「雙解距離」圖解 ＋ 正負數口訣表',
    subtitle: '切換不同題型，觀察 |x − a| = d 如何以基準點 a 往左 −d、往右 +d 找出兩個解（或單解／無解）',
    mount: function (el) {
      var cases = [
        {
          label: '|x − 3| = 5（標準雙解）',
          eq: '|x − 3| = 5',
          a: 3, d: 5, min: -4, max: 10,
          explain: '幾何意義：「點 x 到基準點 3 的距離等於 5」。從 3 往左走 5 格得 x = 3 − 5 = −2；往右走 5 格得 x = 3 + 5 = 8，共兩解！'
        },
        {
          label: '|x + 2| = 4（負數基準點）',
          eq: '|x + 2| = |x − (−2)| = 4',
          a: -2, d: 4, min: -8, max: 5,
          explain: '陷阱提醒！|x + 2| 要先改寫成 |x − (−2)|，基準點是 −2（不是 +2）。從 −2 往左 4 格得 −6，往右 4 格得 2。'
        },
        {
          label: '|x − 1| = 0（唯一解）',
          eq: '|x − 1| = 0',
          a: 1, d: 0, min: -3, max: 5,
          explain: '距離為 0 代表點 x 就在基準點 1 上，不左移也不右移，因此只有唯一解 x = 1。'
        },
        {
          label: '|x − 2| = −3（無解陷阱）',
          eq: '|x − 2| = −3',
          a: 2, d: -3, min: -3, max: 7,
          explain: '絕對值代表「距離」，距離恆大於等於 0，絕不可能是負數！看到右邊是負數直接判「無解」，千萬不要去拆 ±3！'
        }
      ];
      var idx = 0;

      function render() {
        var c = cases[idx];
        var padL = 50, padR = 590, lineY = 165;
        var span = c.max - c.min;
        function toX(v) { return padL + ((v - c.min) / span) * (padR - padL); }

        var defs = '<defs>' +
          arrowDef('m711-arr-axis', '#334155') +
          arrowDef('m711-arr-blue', '#2563eb') +
          arrowDef('m711-arr-orange', '#ea580c') +
          '</defs>';

        var svg = defs;
        svg += pill(18, 14, 290, 30, '題目：' + c.eq, '#eff6ff', '#1e40af', '#93c5fd', 14);
        svg += pill(325, 14, 297, 30, '基準點 a = ' + fmtNum(c.a) + '　｜　距離 d = ' + fmtNum(c.d), '#f8fafc', '#334155', '#cbd5e1', 12.5);

        // Number line
        svg += '<line x1="28" y1="' + lineY + '" x2="612" y2="' + lineY + '" stroke="#334155" stroke-width="2.5" marker-end="url(#m711-arr-axis)"/>';
        for (var v = c.min; v <= c.max; v++) {
          var tx = toX(v);
          var isZero = v === 0;
          svg += '<line x1="' + tx + '" y1="' + (lineY - (isZero ? 10 : 6)) + '" x2="' + tx + '" y2="' + (lineY + (isZero ? 10 : 6)) + '" stroke="' + (isZero ? '#0f172a' : '#64748b') + '" stroke-width="' + (isZero ? 2.5 : 1.5) + '"/>';
          svg += '<text x="' + tx + '" y="' + (lineY + 26) + '" text-anchor="middle" font-size="' + (isZero ? 13 : 11.5) + '" font-weight="' + (isZero ? '800' : '600') + '" fill="' + (isZero ? '#0f172a' : '#475569') + '">' + fmtNum(v) + '</text>';
        }
        if (0 >= c.min && 0 <= c.max) {
          svg += '<text x="' + toX(0) + '" y="' + (lineY + 42) + '" text-anchor="middle" font-size="10.5" fill="#64748b">原點 O</text>';
        }

        var ax = toX(c.a);
        // Center pin
        svg += '<line x1="' + ax + '" y1="74" x2="' + ax + '" y2="' + lineY + '" stroke="#7c3aed" stroke-width="2" stroke-dasharray="4 3"/>';
        svg += '<circle cx="' + ax + '" cy="' + lineY + '" r="6" fill="#7c3aed"/>';
        svg += pill(ax - 54, 52, 108, 22, '基準點 a = ' + fmtNum(c.a), '#f5f3ff', '#6d28d9', '#c4b5fd', 11.5);

        if (c.d > 0) {
          var lx = toX(c.a - c.d);
          var rx = toX(c.a + c.d);
          // Left arrow (-d)
          svg += '<path d="M ' + (ax - 4) + ' 118 Q ' + ((ax + lx) / 2) + ' 82 ' + (lx + 4) + ' 154" fill="none" stroke="#ea580c" stroke-width="3" marker-end="url(#m711-arr-orange)"/>';
          svg += pill(((ax + lx) / 2) - 46, 86, 92, 22, '往左 −' + c.d, '#fff7ed', '#c2410c', '#fdba74', 12);
          svg += '<circle cx="' + lx + '" cy="' + lineY + '" r="8" fill="#ea580c" stroke="#fff" stroke-width="2"/>';
          svg += pill(lx - 48, 214, 96, 26, '左解 x = ' + fmtNum(c.a - c.d), '#fff7ed', '#9a3412', '#fb923c', 12.5);

          // Right arrow (+d)
          svg += '<path d="M ' + (ax + 4) + ' 118 Q ' + ((ax + rx) / 2) + ' 82 ' + (rx - 4) + ' 154" fill="none" stroke="#2563eb" stroke-width="3" marker-end="url(#m711-arr-blue)"/>';
          svg += pill(((ax + rx) / 2) - 46, 86, 92, 22, '往右 +' + c.d, '#eff6ff', '#1d4ed8', '#93c5fd', 12);
          svg += '<circle cx="' + rx + '" cy="' + lineY + '" r="8" fill="#2563eb" stroke="#fff" stroke-width="2"/>';
          svg += pill(rx - 48, 214, 96, 26, '右解 x = ' + fmtNum(c.a + c.d), '#eff6ff', '#1e40af', '#60a5fa', 12.5);
        } else if (c.d === 0) {
          svg += '<circle cx="' + ax + '" cy="' + lineY + '" r="10" fill="rgba(22,163,74,0.22)" stroke="#16a34a" stroke-width="2.5"/>';
          svg += pill(ax - 88, 214, 176, 28, '✔ 距離 = 0 → 唯一解 x = ' + fmtNum(c.a), '#dcfce7', '#166534', '#4ade80', 12.5);
        } else {
          svg += card(145, 92, 350, 56, '#fef2f2', '#ef4444', 10);
          svg += '<text x="320" y="116" text-anchor="middle" font-size="14" font-weight="800" fill="#b91c1c">🚫 距離不可能是負數（|x − 2| ≥ 0）</text>';
          svg += '<text x="320" y="137" text-anchor="middle" font-size="12.5" font-weight="700" fill="#991b1b">因此方程式 |x − 2| = −3「無解」！</text>';
        }

        var controls = '<div class="hb-vis-controls">' +
          cases.map(function (item, i) {
            return '<button type="button" class="hb-vis-btn' + (i === idx ? ' active' : '') + '" data-i="' + i + '">' + esc(item.label) + '</button>';
          }).join('') +
          '</div>';

        var signTable =
          '<table class="hb-vis-table">' +
            '<thead><tr><th>正負數運算口訣</th><th>同號（＋配＋ 或 −配−）</th><th>異號（＋配− 或 −配＋）</th><th>必背範例</th></tr></thead>' +
            '<tbody>' +
              '<tr><td><strong>乘除／去括號</strong></td><td><strong style="color:#16a34a;">同號得正（＋）</strong></td><td><strong style="color:#dc2626;">異號得負（−）</strong></td><td>(−3) × (−4) = +12；5 − (−2) = 5 + 2 = 7</td></tr>' +
              '<tr><td><strong>加減法</strong></td><td>數字相加，保留原符號</td><td>大數減小數，看大數符號</td><td>−3 − 5 = −8；−7 + 4 = −3</td></tr>' +
            '</tbody>' +
          '</table>';

        el.innerHTML = controls + svgWrap(svg, 260) +
          '<div class="hb-vis-readout"><strong>🔍 圖解重點：</strong>' + esc(c.explain) + '</div>' +
          signTable;

        el.querySelectorAll('.hb-vis-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            idx = Number(btn.getAttribute('data-i'));
            render();
          });
        });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     2. MATH_7_1_2 — 短除法逐步求 GCD 與 LCM（兩數與三數）
     ======================================================================== */
  V['MATH_7_1_2'] = {
    title: '🎨 短除法逐步求最大公因數 (GCD) 與最小公倍數 (LCM)',
    subtitle: '逐步點擊觀察短除法流程：左側直行相乘＝最大公因數 (GCD)，外圍 L 形全部相乘＝最小公倍數 (LCM)',
    mount: function (el) {
      var probs = [
        {
          label: '兩數：24 與 36',
          nums: [24, 36],
          rows: [
            { div: 2, vals: [24, 36], note: '24 與 36 皆為偶數，先提質因數 2。' },
            { div: 2, vals: [12, 18], note: '商為 12、18，仍是偶數，再提質因數 2。' },
            { div: 3, vals: [6, 9], note: '商為 6、9，皆為 3 的倍數，提質因數 3。' },
            { div: null, vals: [2, 3], note: '最後剩下 2 與 3 已互質（最大公因數為 1），短除法完成！' }
          ],
          gcdExpr: '2 × 2 × 3 = 12',
          lcmExpr: '2 × 2 × 3 × 2 × 3 = 72',
          pf: ['24 = 2³ × 3', '36 = 2² × 3²'],
          pfRule: '標準分解式法：GCD 取共同底數最小次方 (2²×3=12)；LCM 取所有底數最大次方 (2³×3²=72)。'
        },
        {
          label: '三數：18、30、42',
          nums: [18, 30, 42],
          rows: [
            { div: 2, vals: [18, 30, 42], note: '三數皆為偶數，先提出共同質因數 2。' },
            { div: 3, vals: [9, 15, 21], note: '9、15、21 皆為 3 的倍數，提出共同質因數 3。' },
            { div: null, vals: [3, 5, 7], note: '剩下 3、5、7 兩兩互質：(3,5)=1、(5,7)=1、(3,7)=1，不需再除！' },
            { div: null, vals: [3, 5, 7], note: '完成！注意：三數求 LCM 時，只要任「兩數」還有公因數就必須繼續除（本題 3,5,7 兩兩互質可直接收工）。' }
          ],
          gcdExpr: '2 × 3 = 6',
          lcmExpr: '2 × 3 × 3 × 5 × 7 = 630',
          pf: ['18 = 2 × 3²', '30 = 2 × 3 × 5', '42 = 2 × 3 × 7'],
          pfRule: '三數求 GCD 必須「三數皆可整除」才提；求 LCM 則是「任兩數可整除」即可續除（不能整除的照抄下來）。'
        }
      ];

      var pIdx = 0;
      var step = 1; // 1..4
      var timer = null;

      function stopPlay() {
        if (timer) { clearInterval(timer); timer = null; }
      }

      function render() {
        var p = probs[pIdx];
        var isTwo = p.nums.length === 2;
        var svg = '';

        svg += pill(18, 12, 235, 28, '短除法演練：' + p.nums.join(' , '), '#eff6ff', '#1e40af', '#93c5fd', 13.5);
        svg += pill(265, 12, 130, 28, '目前進度：第 ' + step + ' / 4 步', '#f1f5f9', '#334155', '#cbd5e1', 12);

        var leftX = 76;
        var colStart = 122;
        var colGap = isTwo ? 84 : 66;
        var rowY0 = 76;
        var rowH = 44;

        // How many division rows visible?
        var divCount = isTwo ? 3 : 2;
        var visibleRows = Math.min(step + 1, p.rows.length);
        if (!isTwo && step >= 3) visibleRows = 3; // 3 distinct rows for 18,30,42

        // Step 4 highlights: GCD vertical column (blue) and LCM L-shape (orange)
        if (step === 4) {
          var lastIdx = divCount;
          var gcdTop = rowY0 - 20;
          var gcdH = divCount * rowH;
          // L-shape outer highlight
          var lRight = colStart + (p.nums.length - 1) * colGap + 30;
          var lBotY = rowY0 + lastIdx * rowH;
          svg += '<path d="M ' + (leftX - 24) + ' ' + (gcdTop - 4) +
            ' L ' + (leftX + 24) + ' ' + (gcdTop - 4) +
            ' L ' + (leftX + 24) + ' ' + (lBotY - 18) +
            ' L ' + lRight + ' ' + (lBotY - 18) +
            ' L ' + lRight + ' ' + (lBotY + 20) +
            ' L ' + (leftX - 24) + ' ' + (lBotY + 20) + ' Z" ' +
            'fill="rgba(234,88,12,0.12)" stroke="#ea580c" stroke-width="2.5" stroke-dasharray="6 3"/>';
          // GCD blue box
          svg += '<rect x="' + (leftX - 18) + '" y="' + gcdTop + '" width="36" height="' + (gcdH - 2) + '" rx="10" fill="rgba(37,99,235,0.16)" stroke="#2563eb" stroke-width="2.5"/>';
          svg += '<text x="' + (leftX - 26) + '" y="' + (gcdTop + gcdH / 2) + '" text-anchor="end" font-size="11.5" font-weight="800" fill="#1d4ed8">GCD</text>';
          svg += '<text x="' + (lRight + 6) + '" y="' + (lBotY + 4) + '" font-size="11.5" font-weight="800" fill="#c2410c">L形=LCM</text>';
        }

        // Draw rows
        var activeRowIdx = Math.min(step - 1, divCount);
        for (var r = 0; r < visibleRows; r++) {
          var row = p.rows[r];
          var ry = rowY0 + r * rowH;
          var hasDiv = row.div != null && (r < step || step === 4);

          if (hasDiv) {
            var isCur = (r === step - 1);
            svg += '<text x="' + leftX + '" y="' + (ry + 5) + '" text-anchor="middle" font-size="18" font-weight="800" fill="' + (isCur ? '#dc2626' : '#1d4ed8') + '">' + row.div + '</text>';
            // L-bracket |_
            var bLeft = leftX + 22;
            var bRight = colStart + (p.nums.length - 1) * colGap + 24;
            svg += '<path d="M ' + bLeft + ' ' + (ry - 18) + ' L ' + bLeft + ' ' + (ry + 16) + ' L ' + bRight + ' ' + (ry + 16) + '" fill="none" stroke="' + (isCur ? '#0284c7' : '#334155') + '" stroke-width="2.2"/>';
          }

          for (var c = 0; c < row.vals.length; c++) {
            var vx = colStart + c * colGap;
            var isFinal = (r === divCount);
            svg += '<text x="' + vx + '" y="' + (ry + 5) + '" text-anchor="middle" font-size="18" font-weight="' + (isFinal ? '800' : '700') + '" fill="' + (isFinal ? '#c2410c' : '#0f172a') + '">' + row.vals[c] + '</text>';
          }
        }

        // Right panel: Summary cards
        svg += card(362, 52, 260, 92, '#f8fafc', '#cbd5e1', 10);
        svg += '<text x="378" y="74" font-size="12.5" font-weight="800" fill="#334155">📌 標準分解式對照</text>';
        p.pf.forEach(function (line, li) {
          svg += '<text x="382" y="' + (96 + li * 19) + '" font-size="13" font-weight="700" fill="#0f172a">' + esc(line) + '</text>';
        });

        // GCD & LCM result box
        var done = (step === 4);
        svg += card(362, 154, 260, 98, done ? '#f0fdf4' : '#f8fafc', done ? '#22c55e' : '#cbd5e1', 10);
        svg += '<text x="378" y="177" font-size="13" font-weight="800" fill="#1d4ed8">藍色直行 GCD（最大公因數）</text>';
        svg += '<text x="378" y="198" font-size="14" font-weight="800" fill="#0f172a">' + (done ? p.gcdExpr : '點擊第 4 步揭曉結果...') + '</text>';
        svg += '<text x="378" y="222" font-size="13" font-weight="800" fill="#c2410c">橘色 L 形 LCM（最小公倍數）</text>';
        svg += '<text x="378" y="242" font-size="14" font-weight="800" fill="#0f172a">' + (done ? p.lcmExpr : '...') + '</text>';

        var controls = '<div class="hb-vis-controls">' +
          probs.map(function (pr, i) {
            return '<button type="button" class="hb-vis-btn' + (i === pIdx ? ' active' : '') + '" data-p="' + i + '">' + esc(pr.label) + '</button>';
          }).join('') +
          '<span style="color:#cbd5e1;">|</span>' +
          [1, 2, 3, 4].map(function (s) {
            return '<button type="button" class="hb-vis-btn' + (s === step ? ' active' : '') + '" data-s="' + s + '">第 ' + s + ' 步</button>';
          }).join('') +
          '<button type="button" class="hb-vis-btn" data-play="1">' + (timer ? '⏸ 暫停' : '▶ 逐步播放') + '</button>' +
          '</div>';

        var noteText = p.rows[Math.min(step - 1, p.rows.length - 1)].note;
        if (step === 4) noteText += ' ' + p.pfRule;

        el.innerHTML = controls + svgWrap(svg, 268) +
          '<div class="hb-vis-readout"><strong>第 ' + step + ' 步說明：</strong>' + esc(noteText) + '</div>';

        el.querySelectorAll('[data-p]').forEach(function (b) {
          b.addEventListener('click', function () {
            stopPlay();
            pIdx = Number(b.getAttribute('data-p'));
            step = 1;
            render();
          });
        });
        el.querySelectorAll('[data-s]').forEach(function (b) {
          b.addEventListener('click', function () {
            stopPlay();
            step = Number(b.getAttribute('data-s'));
            render();
          });
        });
        var playBtn = el.querySelector('[data-play]');
        if (playBtn) {
          playBtn.addEventListener('click', function () {
            if (timer) { stopPlay(); render(); return; }
            step = 1;
            render();
            timer = setInterval(function () {
              if (step >= 4) { stopPlay(); render(); return; }
              step++;
              render();
            }, 1200);
          });
        }
      }

      render();
      return stopPlay;
    }
  };

  /* ========================================================================
     3. MATH_7_1_3 — 等量公理移項與去分母「每項必乘」動畫圖解
     ======================================================================== */
  V['MATH_7_1_3'] = {
    title: '🎨 等量公理天平移項 ＆ 去分母「每一項都要乘」防錯圖解',
    subtitle: '切換標準移項（2x + 3 = 11）或分數去分母陷阱題（(x+1)/2 − (x−1)/3 = 1），逐步看懂為什麼常數與負號最容易錯',
    mount: function (el) {
      var mode = 'A'; // A: 2x+3=11, B: (x+1)/2 - (x-1)/3 = 1
      var step = 1;

      var explainA = [
        '原始方程式 2x + 3 = 11：天平左右兩邊相等，目標是讓左邊只剩下 x。',
        '等量減法公理：左右兩邊同時 −3！左邊 +3 抵銷，右邊出現 11 − 3（這就是「移項變號」的真正原因！）。',
        '等量除法公理：化簡為 2x = 8 後，左右兩邊同時 ÷2。',
        '解得 x = 4！代回原式驗算：2(4) + 3 = 8 + 3 = 11，完全符合 ✔。'
      ];

      var explainB = [
        '先觀察分母 2 與 3，最小公倍數 LCM(2, 3) = 6。準備把整個方程式「每一項」都同乘 6！',
        '🚨 考場第一大地雷：紅箭頭 ×6 必須打到「每一項」，連右邊沒有分母的常數 1 也要乘以 6（變成 6，不是 1）！',
        '🚨 考場第二大地雷：約分後分子一定要加括號！3(x+1) − 2(x−1) = 6，負號分配進去 −2(−1) 變成 +2！',
        '去括號合併同類項：3x + 3 − 2x + 2 = 6 → x + 5 = 6 → x = 1。代回驗算：(1+1)/2 − (1−1)/3 = 1 − 0 = 1 ✔！'
      ];

      function renderA() {
        var defs = '<defs>' +
          arrowDef('m713-red', '#dc2626') +
          arrowDef('m713-blue', '#2563eb') +
          '</defs>';
        var s = defs;
        s += pill(18, 12, 230, 28, '模式 A：2x + 3 = 11', '#eff6ff', '#1e40af', '#93c5fd', 13.5);

        // Balance beam
        s += '<polygon points="320,210 296,246 344,246" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>';
        s += '<line x1="120" y1="206" x2="520" y2="206" stroke="#334155" stroke-width="5" stroke-linecap="round"/>';
        s += '<text x="320" y="198" text-anchor="middle" font-size="22" font-weight="800" fill="#0f172a">=</text>';

        // Pans
        s += '<rect x="85" y="146" width="180" height="54" rx="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>';
        s += '<rect x="375" y="146" width="180" height="54" rx="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>';

        if (step === 1) {
          s += pill(100, 158, 42, 30, 'x', '#dbeafe', '#1e40af', '#3b82f6', 15);
          s += pill(148, 158, 42, 30, 'x', '#dbeafe', '#1e40af', '#3b82f6', 15);
          s += pill(200, 158, 52, 30, '+ 3', '#ffedd5', '#c2410c', '#fb923c', 14);
          s += pill(415, 158, 100, 30, '11', '#dcfce7', '#166534', '#4ade80', 16);
          s += pill(190, 62, 260, 34, '2x + 3  =  11', '#f1f5f9', '#0f172a', '#cbd5e1', 17);
        } else if (step === 2) {
          s += pill(100, 158, 42, 30, 'x', '#dbeafe', '#1e40af', '#3b82f6', 15);
          s += pill(148, 158, 42, 30, 'x', '#dbeafe', '#1e40af', '#3b82f6', 15);
          s += pill(200, 158, 52, 30, '+ 3', '#fee2e2', '#991b1b', '#f87171', 14);
          s += '<line x1="202" y1="186" x2="250" y2="160" stroke="#dc2626" stroke-width="2.5"/>';
          s += pill(395, 158, 140, 30, '11 − 3 = 8', '#dcfce7', '#166534', '#4ade80', 15);
          // Simultaneous -3 arrows
          s += '<line x1="226" y1="106" x2="226" y2="144" stroke="#dc2626" stroke-width="3" marker-end="url(#m713-red)"/>';
          s += '<line x1="465" y1="106" x2="465" y2="144" stroke="#dc2626" stroke-width="3" marker-end="url(#m713-red)"/>';
          s += pill(170, 74, 112, 28, '兩邊同減 3', '#fef2f2', '#b91c1c', '#fca5a5', 12.5);
          s += pill(409, 74, 112, 28, '兩邊同減 3', '#fef2f2', '#b91c1c', '#fca5a5', 12.5);
          s += '<path d="M 248 144 Q 320 98 395 144" fill="none" stroke="#ea580c" stroke-width="2" stroke-dasharray="5 3" marker-end="url(#m713-red)"/>';
          s += '<text x="320" y="110" text-anchor="middle" font-size="11.5" font-weight="800" fill="#c2410c">等價於 +3 移項變 −3</text>';
        } else if (step === 3) {
          s += pill(120, 158, 110, 30, '2x ÷ 2', '#dbeafe', '#1e40af', '#3b82f6', 15);
          s += pill(410, 158, 110, 30, '8 ÷ 2', '#dcfce7', '#166534', '#4ade80', 15);
          s += '<line x1="175" y1="106" x2="175" y2="144" stroke="#2563eb" stroke-width="3" marker-end="url(#m713-blue)"/>';
          s += '<line x1="465" y1="106" x2="465" y2="144" stroke="#2563eb" stroke-width="3" marker-end="url(#m713-blue)"/>';
          s += pill(120, 74, 110, 28, '兩邊同除 2', '#eff6ff', '#1d4ed8', '#93c5fd', 12.5);
          s += pill(410, 74, 110, 28, '兩邊同除 2', '#eff6ff', '#1d4ed8', '#93c5fd', 12.5);
        } else {
          s += pill(135, 158, 80, 30, 'x', '#2563eb', '#ffffff', '#1d4ed8', 17);
          s += pill(425, 158, 80, 30, '4', '#16a34a', '#ffffff', '#15803d', 17);
          s += pill(165, 68, 310, 38, '✅ 解得 x = 4（驗算：2×4 + 3 = 11）', '#dcfce7', '#166534', '#22c55e', 14);
        }
        return s;
      }

      function renderB() {
        var defs = '<defs>' + arrowDef('m713-b-red', '#dc2626') + '</defs>';
        var s = defs;
        s += pill(18, 12, 310, 28, '模式 B：(x + 1)/2 − (x − 1)/3 = 1', '#fff7ed', '#9a3412', '#fdba74', 13.5);
        s += pill(342, 12, 165, 28, 'LCM(2, 3) = 6', '#f5f3ff', '#6d28d9', '#c4b5fd', 13);

        // Original equation stacked nicely at y=108
        function frac(cx, cy, num, den, hi) {
          var box = hi ? '<rect x="' + (cx - 48) + '" y="' + (cy - 30) + '" width="96" height="60" rx="8" fill="#fef2f2" stroke="#f87171" stroke-width="1.5"/>' : '';
          return box +
            '<text x="' + cx + '" y="' + (cy - 8) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#0f172a">' + num + '</text>' +
            '<line x1="' + (cx - 38) + '" y1="' + cy + '" x2="' + (cx + 38) + '" y2="' + cy + '" stroke="#0f172a" stroke-width="2"/>' +
            '<text x="' + cx + '" y="' + (cy + 20) + '" text-anchor="middle" font-size="16" font-weight="800" fill="#2563eb">' + den + '</text>';
        }

        s += frac(145, 114, 'x + 1', '2', step === 2);
        s += '<text x="235" y="120" text-anchor="middle" font-size="22" font-weight="800" fill="#dc2626">−</text>';
        s += frac(325, 114, 'x − 1', '3', step === 2);
        s += '<text x="415" y="120" text-anchor="middle" font-size="22" font-weight="800" fill="#0f172a">=</text>';
        if (step === 2) {
          s += '<rect x="448" y="84" width="66" height="60" rx="8" fill="#fef2f2" stroke="#dc2626" stroke-width="2.5"/>';
        }
        s += '<text x="481" y="121" text-anchor="middle" font-size="20" font-weight="800" fill="#0f172a">1</text>';

        if (step === 2) {
          // 3 bold red arrows hitting ALL 3 terms
          [145, 325, 481].forEach(function (tx, ti) {
            s += '<line x1="' + tx + '" y1="54" x2="' + tx + '" y2="81" stroke="#dc2626" stroke-width="3" marker-end="url(#m713-b-red)"/>';
            s += pill(tx - 24, 42, 48, 20, '× 6', '#dc2626', '#ffffff', '#b91c1c', 12);
          });
          s += pill(380, 152, 232, 28, '⚠️ 右邊的 1 也要 × 6，不能忘！', '#fef2f2', '#b91c1c', '#ef4444', 12.5);
        }

        if (step >= 3) {
          s += card(42, 162, 556, 42, '#eff6ff', '#60a5fa', 10);
          s += '<text x="320" y="188" text-anchor="middle" font-size="16" font-weight="800" fill="#0f172a">' +
            '3(x + 1)  <tspan fill="#dc2626">− 2(x − 1)</tspan>  =  <tspan fill="#16a34a">6</tspan></text>';
        }
        if (step === 3) {
          s += pill(212, 212, 290, 28, '⚠️ 負號分配：−2(x − 1) = −2x + 2！', '#fff7ed', '#9a3412', '#f97316', 12.5);
        }
        if (step === 4) {
          s += card(42, 212, 556, 42, '#dcfce7', '#22c55e', 10);
          s += '<text x="320" y="238" text-anchor="middle" font-size="15.5" font-weight="800" fill="#166534">' +
            '3x + 3 − 2x + 2 = 6   →   x + 5 = 6   →   x = 1 ✔</text>';
        }
        return s;
      }

      function render() {
        var controls = '<div class="hb-vis-controls">' +
          '<button type="button" class="hb-vis-btn' + (mode === 'A' ? ' active' : '') + '" data-m="A">模式 A：2x + 3 = 11（移項）</button>' +
          '<button type="button" class="hb-vis-btn' + (mode === 'B' ? ' active' : '') + '" data-m="B">模式 B：分數去分母（每項 ×6）</button>' +
          '<span style="color:#cbd5e1;">|</span>' +
          [1, 2, 3, 4].map(function (st) {
            return '<button type="button" class="hb-vis-btn' + (st === step ? ' active' : '') + '" data-s="' + st + '">第 ' + st + ' 步</button>';
          }).join('') +
          '</div>';

        var svg = mode === 'A' ? renderA() : renderB();
        var exp = (mode === 'A' ? explainA : explainB)[step - 1];

        el.innerHTML = controls + svgWrap(svg, 265) +
          '<div class="hb-vis-readout"><strong>第 ' + step + ' 步解析：</strong>' + esc(exp) + '</div>';

        el.querySelectorAll('[data-m]').forEach(function (b) {
          b.addEventListener('click', function () {
            mode = b.getAttribute('data-m');
            step = 1;
            render();
          });
        });
        el.querySelectorAll('[data-s]').forEach(function (b) {
          b.addEventListener('click', function () {
            step = Number(b.getAttribute('data-s'));
            render();
          });
        });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     4. MATH_7_1_4 — 二元一次聯立方程式：兩直線幾何分類與係數比判別
     ======================================================================== */
  V['MATH_7_1_4'] = {
    title: '🎨 兩直線幾何關係 × 係數比判別圖解（唯一解／無解／無限多解）',
    subtitle: '點選三種解的情況，立即對照「座標平面兩條直線的位置」與「係數比 a₁/a₂、b₁/b₂、c₁/c₂」',
    mount: function (el) {
      var modes = [
        {
          label: '① 唯一解（兩線相交於一點）',
          eq1: 'L₁：x + y = 4',
          eq2: 'L₂：x − y = 2',
          ratio: 'a₁/a₂ ≠ b₁/b₂',
          ratioNum: '1/1  ≠  1/(−1)',
          badge: '✅ 唯一解：(3, 1)',
          badgeBg: '#dcfce7', badgeFg: '#166534', badgeSt: '#22c55e',
          explain: '兩條直線的斜率不同（x 與 y 係數不成比例），因此在平面上必交於唯一一點 (3, 1)，該交點即為聯立方程式的唯一解。'
        },
        {
          label: '② 無解（兩線平行永不相交）',
          eq1: 'L₁：x + y = 4',
          eq2: 'L₂：2x + 2y = 2（即 x + y = 1）',
          ratio: 'a₁/a₂ = b₁/b₂ ≠ c₁/c₂',
          ratioNum: '1/2  =  1/2  ≠  4/2',
          badge: '🚫 無解（L₁ ∥ L₂）',
          badgeBg: '#fef2f2', badgeFg: '#991b1b', badgeSt: '#ef4444',
          explain: 'x 與 y 的係數比例相同（斜率相等），但常數項比例不同！幾何上是兩條平行線，永遠沒有交點，故無解。'
        },
        {
          label: '③ 無限多解（兩線完全重合）',
          eq1: 'L₁：x + y = 4',
          eq2: 'L₂：2x + 2y = 8（整式同乘 2）',
          ratio: 'a₁/a₂ = b₁/b₂ = c₁/c₂',
          ratioNum: '1/2  =  1/2  =  4/8',
          badge: '♾ 無限多解（L₁ ≡ L₂）',
          badgeBg: '#f5f3ff', badgeFg: '#5b21b6', badgeSt: '#8b5cf6',
          explain: '三個係數比全部相等！第二條方程式只是第一條整體同乘 2，畫在平面上是完全疊在一起的同一條直線，線上無限多個點都是解。'
        }
      ];
      var mIdx = 0;

      function render() {
        var m = modes[mIdx];
        var ox = 110, oy = 185, u = 32; // origin & unit
        function px(x) { return ox + x * u; }
        function py(y) { return oy - y * u; }

        var defs = '<defs>' + arrowDef('m714-ax', '#475569') + '</defs>';
        var s = defs;

        // Coordinate plane background
        s += card(22, 16, 286, 238, '#f8fafc', '#cbd5e1', 10);

        // Grid
        for (var gx = -2; gx <= 5; gx++) {
          s += '<line x1="' + px(gx) + '" y1="26" x2="' + px(gx) + '" y2="244" stroke="#e2e8f0" stroke-width="1"/>';
        }
        for (var gy = -1; gy <= 4; gy++) {
          s += '<line x1="34" y1="' + py(gy) + '" x2="296" y2="' + py(gy) + '" stroke="#e2e8f0" stroke-width="1"/>';
        }
        // Axes
        s += '<line x1="34" y1="' + oy + '" x2="294" y2="' + oy + '" stroke="#475569" stroke-width="2" marker-end="url(#m714-ax)"/>';
        s += '<line x1="' + ox + '" y1="244" x2="' + ox + '" y2="28" stroke="#475569" stroke-width="2" marker-end="url(#m714-ax)"/>';
        s += '<text x="292" y="' + (oy + 16) + '" font-size="12" font-weight="700" fill="#334155">x</text>';
        s += '<text x="' + (ox + 10) + '" y="36" font-size="12" font-weight="700" fill="#334155">y</text>';
        s += '<text x="' + (ox - 12) + '" y="' + (oy + 14) + '" font-size="11" fill="#64748b">O</text>';

        // Line L1: x + y = 4 -> (-0.5, 4.5) to (5, -1)
        s += '<line x1="' + px(-0.3) + '" y1="' + py(4.3) + '" x2="' + px(5) + '" y2="' + py(-1) + '" stroke="#2563eb" stroke-width="3.2"/>';
        s += '<text x="' + px(0.4) + '" y="' + py(4.1) + '" font-size="12" font-weight="800" fill="#1d4ed8">L₁</text>';

        if (mIdx === 0) {
          // L2: x - y = 2 -> (0.8, -1.2) to (5.2, 3.2)
          s += '<line x1="' + px(0.8) + '" y1="' + py(-1.2) + '" x2="' + px(5.2) + '" y2="' + py(3.2) + '" stroke="#ea580c" stroke-width="3.2"/>';
          s += '<text x="' + px(4.6) + '" y="' + py(3.3) + '" font-size="12" font-weight="800" fill="#c2410c">L₂</text>';
          // Intersection (3, 1)
          s += '<line x1="' + px(3) + '" y1="' + py(1) + '" x2="' + px(3) + '" y2="' + oy + '" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4 3"/>';
          s += '<line x1="' + px(3) + '" y1="' + py(1) + '" x2="' + ox + '" y2="' + py(1) + '" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4 3"/>';
          s += '<circle cx="' + px(3) + '" cy="' + py(1) + '" r="6.5" fill="#16a34a" stroke="#fff" stroke-width="2"/>';
          s += pill(px(3) - 24, py(1) - 34, 72, 22, '交點 (3,1)', '#dcfce7', '#166534', '#22c55e', 11.5);
        } else if (mIdx === 1) {
          // L2: x + y = 1 -> (-1.5, 2.5) to (2.2, -1.2)
          s += '<line x1="' + px(-1.5) + '" y1="' + py(2.5) + '" x2="' + px(2.2) + '" y2="' + py(-1.2) + '" stroke="#ea580c" stroke-width="3.2"/>';
          s += '<text x="' + px(-1.4) + '" y="' + py(2.7) + '" font-size="12" font-weight="800" fill="#c2410c">L₂</text>';
          // Parallel gap arrow
          s += '<line x1="' + px(0.5) + '" y1="' + py(0.5) + '" x2="' + px(2) + '" y2="' + py(2) + '" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 3"/>';
          s += pill(145, 114, 118, 22, '平行 ∥ 永不相交', '#fef2f2', '#b91c1c', '#f87171', 11.5);
        } else {
          // L2 overlaid on L1 with orange dashed line
          s += '<line x1="' + px(-0.3) + '" y1="' + py(4.3) + '" x2="' + px(5) + '" y2="' + py(-1) + '" stroke="#f97316" stroke-width="3.2" stroke-dasharray="9 7"/>';
          [[0, 4], [2, 2], [4, 0]].forEach(function (pt) {
            s += '<circle cx="' + px(pt[0]) + '" cy="' + py(pt[1]) + '" r="5" fill="#7c3aed" stroke="#fff" stroke-width="1.5"/>';
          });
          s += pill(150, 92, 136, 24, '兩線疊合：點點皆解', '#f5f3ff', '#5b21b6', '#a78bfa', 11.5);
        }

        // Right info card
        s += card(326, 16, 296, 238, '#ffffff', '#cbd5e1', 10);
        s += '<text x="344" y="42" font-size="13.5" font-weight="800" fill="#334155">📐 聯立方程式範例</text>';
        s += '<text x="348" y="68" font-size="14" font-weight="700" fill="#1d4ed8">' + esc(m.eq1) + '</text>';
        s += '<text x="348" y="92" font-size="14" font-weight="700" fill="#c2410c">' + esc(m.eq2) + '</text>';

        s += '<line x1="342" y1="108" x2="606" y2="108" stroke="#e2e8f0" stroke-width="1.5"/>';
        s += '<text x="344" y="132" font-size="13" font-weight="800" fill="#334155">🎯 係數比快速判別公式</text>';
        s += card(342, 142, 264, 54, '#f8fafc', '#cbd5e1', 8);
        s += '<text x="474" y="164" text-anchor="middle" font-size="14.5" font-weight="800" fill="#0f172a">' + esc(m.ratio) + '</text>';
        s += '<text x="474" y="185" text-anchor="middle" font-size="12.5" font-weight="700" fill="#475569">代入本題：' + esc(m.ratioNum) + '</text>';

        s += pill(356, 208, 236, 32, m.badge, m.badgeBg, m.badgeFg, m.badgeSt, 13.5);

        var controls = '<div class="hb-vis-controls">' +
          modes.map(function (item, i) {
            return '<button type="button" class="hb-vis-btn' + (i === mIdx ? ' active' : '') + '" data-m="' + i + '">' + esc(item.label) + '</button>';
          }).join('') +
          '</div>';

        el.innerHTML = controls + svgWrap(s, 270) +
          '<div class="hb-vis-readout"><strong>💡 觀念連結：</strong>' + esc(m.explain) + '</div>';

        el.querySelectorAll('[data-m]').forEach(function (b) {
          b.addEventListener('click', function () {
            mIdx = Number(b.getAttribute('data-m'));
            render();
          });
        });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     5. MATH_7_1_5 — 連比最小公倍數橋樑法 ＋ 正比／反比曲線對照
     ======================================================================== */
  V['MATH_7_1_5'] = {
    title: '🎨 連比「最小公倍數橋樑」動畫 ＆ 正比 vs 反比圖形對照',
    subtitle: '先學會用 LCM 對齊中間共用項 b 算出連比，再切換比較正比直線與反比雙曲線的核心差異',
    mount: function (el) {
      var mode = 'bridge'; // 'bridge' | 'curve'
      var step = 1; // 1..4 for bridge

      var bridgeNotes = [
        '已知 a : b = 2 : 3 且 b : c = 4 : 5。兩組比都含有 b，但上面的 b 是 3、下面的 b 是 4，不能直接併排！',
        '找到共用項 b 的最小公倍數：LCM(3, 4) = 12，把 b 統一擴分成 12 當作橋樑！',
        '保持比值不變：上排 2 : 3 兩數同乘 4 得 8 : 12；下排 4 : 5 兩數同乘 3 得 12 : 15。',
        '中間的 b 都變成 12 了！直接合併讀出連比 a : b : c = 8 : 12 : 15（已互質）✔！'
      ];

      function renderBridge() {
        var defs = '<defs>' +
          arrowDef('m715-b', '#2563eb') +
          arrowDef('m715-o', '#ea580c') +
          '</defs>';
        var s = defs;
        s += pill(18, 12, 310, 28, '例題：a : b = 2 : 3，b : c = 4 : 5，求 a : b : c', '#eff6ff', '#1e40af', '#93c5fd', 13);

        // Column headers
        var cx = [145, 295, 445];
        ['a', 'b（橋樑共用項）', 'c'].forEach(function (lbl, i) {
          var isB = i === 1;
          s += pill(cx[i] - (isB ? 64 : 36), 52, isB ? 128 : 72, 26, lbl, isB ? '#fef3c7' : '#f1f5f9', isB ? '#92400e' : '#334155', isB ? '#f59e0b' : '#cbd5e1', 12.5);
        });

        // Highlight b column
        s += '<rect x="242" y="84" width="106" height="122" rx="10" fill="' + (step >= 2 ? 'rgba(245,158,11,0.14)' : 'rgba(241,245,249,0.7)') + '" stroke="' + (step >= 2 ? '#f59e0b' : '#cbd5e1') + '" stroke-width="1.8" stroke-dasharray="5 3"/>';

        // Row 1: 2 : 3
        s += '<text x="' + cx[0] + '" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="#1d4ed8">2</text>';
        s += '<text x="220" y="118" text-anchor="middle" font-size="18" font-weight="800" fill="#94a3b8">:</text>';
        s += '<text x="' + cx[1] + '" y="118" text-anchor="middle" font-size="22" font-weight="800" fill="#b45309">3</text>';

        // Row 2: 4 : 5
        s += '<text x="' + cx[1] + '" y="164" text-anchor="middle" font-size="22" font-weight="800" fill="#b45309">4</text>';
        s += '<text x="370" y="164" text-anchor="middle" font-size="18" font-weight="800" fill="#94a3b8">:</text>';
        s += '<text x="' + cx[2] + '" y="164" text-anchor="middle" font-size="22" font-weight="800" fill="#c2410c">5</text>';

        if (step >= 2) {
          s += pill(496, 98, 128, 30, 'LCM(3, 4) = 12', '#fef3c7', '#92400e', '#f59e0b', 13);
        }

        if (step >= 3) {
          // Arrows showing x4 and x3
          s += '<line x1="92" y1="112" x2="122" y2="112" stroke="#2563eb" stroke-width="2.5" marker-end="url(#m715-b)"/>';
          s += pill(26, 98, 62, 26, '上排 ×4', '#dbeafe', '#1e40af', '#60a5fa', 12);
          s += '<line x1="510" y1="158" x2="472" y2="158" stroke="#ea580c" stroke-width="2.5" marker-end="url(#m715-o)"/>';
          s += pill(516, 144, 62, 26, '下排 ×3', '#ffedd5', '#9a3412', '#fb923c', 12);

          // Expanded numbers beside
          s += '<text x="' + cx[0] + '" y="196" text-anchor="middle" font-size="15" font-weight="800" fill="#2563eb">2×4 = 8</text>';
          s += '<text x="' + cx[1] + '" y="196" text-anchor="middle" font-size="15" font-weight="800" fill="#d97706">3×4 = 4×3 = 12</text>';
          s += '<text x="' + cx[2] + '" y="196" text-anchor="middle" font-size="15" font-weight="800" fill="#ea580c">5×3 = 15</text>';
        }

        if (step === 4) {
          s += card(95, 214, 450, 40, '#dcfce7', '#16a34a', 10);
          s += '<text x="320" y="240" text-anchor="middle" font-size="17" font-weight="800" fill="#166534">✅ 合併連比：a : b : c = 8 : 12 : 15</text>';
        }
        return s;
      }

      function renderCurve() {
        var defs = '<defs>' + arrowDef('m715-ax', '#475569') + '</defs>';
        var s = defs;

        // Left: Direct proportion y = 2x
        s += card(16, 14, 296, 242, '#f8fafc', '#93c5fd', 10);
        s += pill(68, 22, 192, 26, '正比：y = 2x（商 y/x = 2 定值）', '#dbeafe', '#1e40af', '#60a5fa', 12);
        var lox = 110, loy = 195;
        s += '<line x1="40" y1="' + loy + '" x2="290" y2="' + loy + '" stroke="#475569" stroke-width="1.8" marker-end="url(#m715-ax)"/>';
        s += '<line x1="' + lox + '" y1="242" x2="' + lox + '" y2="58" stroke="#475569" stroke-width="1.8" marker-end="url(#m715-ax)"/>';
        s += '<text x="288" y="' + (loy + 14) + '" font-size="11" fill="#475569">x</text>';
        s += '<text x="' + (lox + 8) + '" y="66" font-size="11" fill="#475569">y</text>';
        // Line y=2x passing strictly through (0,0)
        s += '<line x1="' + (lox - 22) + '" y1="' + (loy + 44) + '" x2="' + (lox + 66) + '" y2="' + (loy - 132) + '" stroke="#2563eb" stroke-width="3.2"/>';
        s += '<circle cx="' + lox + '" cy="' + loy + '" r="5" fill="#16a34a" stroke="#fff" stroke-width="1.5"/>';
        s += '<text x="' + (lox - 6) + '" y="' + (loy + 16) + '" text-anchor="end" font-size="11" font-weight="700" fill="#15803d">必過原點 (0,0)</text>';
        s += '<circle cx="' + (lox + 30) + '" cy="' + (loy - 60) + '" r="4.5" fill="#2563eb"/>';
        s += '<text x="' + (lox + 38) + '" y="' + (loy - 56) + '" font-size="11.5" font-weight="700" fill="#1e40af">(1, 2)</text>';
        s += '<circle cx="' + (lox + 60) + '" cy="' + (loy - 120) + '" r="4.5" fill="#2563eb"/>';
        s += '<text x="' + (lox + 68) + '" y="' + (loy - 116) + '" font-size="11.5" font-weight="700" fill="#1e40af">(2, 4)</text>';

        // Right: Inverse proportion xy = 12
        s += card(328, 14, 296, 242, '#f8fafc', '#fdba74', 10);
        s += pill(374, 22, 204, 26, '反比：xy = 12（積 xy = 12 定值）', '#ffedd5', '#9a3412', '#fb923c', 12);
        var rox = 372, roy = 216, ru = 20;
        s += '<line x1="346" y1="' + roy + '" x2="606" y2="' + roy + '" stroke="#475569" stroke-width="1.8" marker-end="url(#m715-ax)"/>';
        s += '<line x1="' + rox + '" y1="242" x2="' + rox + '" y2="58" stroke="#475569" stroke-width="1.8" marker-end="url(#m715-ax)"/>';
        // Equal-area rectangles for (2,6) and (6,2)
        s += '<rect x="' + rox + '" y="' + (roy - 6 * ru) + '" width="' + (2 * ru) + '" height="' + (6 * ru) + '" fill="rgba(234,88,12,0.14)" stroke="#ea580c" stroke-width="1.5" stroke-dasharray="4 3"/>';
        s += '<rect x="' + rox + '" y="' + (roy - 2 * ru) + '" width="' + (6 * ru) + '" height="' + (2 * ru) + '" fill="rgba(37,99,235,0.12)" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="4 3"/>';
        // Hyperbola path for x in [1.6 .. 9.5]
        var pts = [];
        for (var x = 1.65; x <= 9.5; x += 0.35) {
          var y = 12 / x;
          pts.push((rox + x * ru).toFixed(1) + ',' + (roy - y * ru).toFixed(1));
        }
        s += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#ea580c" stroke-width="3.2"/>';
        s += '<circle cx="' + (rox + 2 * ru) + '" cy="' + (roy - 6 * ru) + '" r="4.5" fill="#ea580c"/>';
        s += '<text x="' + (rox + 2 * ru + 6) + '" y="' + (roy - 6 * ru + 4) + '" font-size="11.5" font-weight="700" fill="#c2410c">(2, 6) 面積=12</text>';
        s += '<circle cx="' + (rox + 6 * ru) + '" cy="' + (roy - 2 * ru) + '" r="4.5" fill="#2563eb"/>';
        s += '<text x="' + (rox + 6 * ru - 16) + '" y="' + (roy - 2 * ru - 8) + '" font-size="11.5" font-weight="700" fill="#1d4ed8">(6, 2) 面積=12</text>';
        s += '<text x="494" y="238" text-anchor="middle" font-size="11" font-weight="700" fill="#9a3412">永不碰軸（x ≠ 0, y ≠ 0）</text>';

        return s;
      }

      function render() {
        var controls = '<div class="hb-vis-controls">' +
          '<button type="button" class="hb-vis-btn' + (mode === 'bridge' ? ' active' : '') + '" data-m="bridge">🌉 連比 LCM 橋樑法</button>' +
          '<button type="button" class="hb-vis-btn' + (mode === 'curve' ? ' active' : '') + '" data-m="curve">📈 正比 vs 反比圖形</button>';

        if (mode === 'bridge') {
          controls += '<span style="color:#cbd5e1;">|</span>' +
            [1, 2, 3, 4].map(function (st) {
              return '<button type="button" class="hb-vis-btn' + (st === step ? ' active' : '') + '" data-s="' + st + '">第 ' + st + ' 步</button>';
            }).join('');
        }
        controls += '</div>';

        var readout = mode === 'bridge'
          ? '<strong>第 ' + step + ' 步：</strong>' + bridgeNotes[step - 1]
          : '<strong>🔥 會考核心辨析：</strong>正比「y = kx」必過原點、商固定（注意：y = 2x + 1 不是正比！）；反比「xy = k」為平滑雙曲線，任一點往兩軸圍出的長方形面積恆等於 |k|！';

        el.innerHTML = controls + svgWrap(mode === 'bridge' ? renderBridge() : renderCurve(), 268) +
          '<div class="hb-vis-readout">' + readout + '</div>';

        el.querySelectorAll('[data-m]').forEach(function (b) {
          b.addEventListener('click', function () {
            mode = b.getAttribute('data-m');
            render();
          });
        });
        el.querySelectorAll('[data-s]').forEach(function (b) {
          b.addEventListener('click', function () {
            step = Number(b.getAttribute('data-s'));
            render();
          });
        });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     6. MATH_7_1_6 — 不等式數線區間 & 同乘 (−1) 180° 鏡像翻轉動畫
     ======================================================================== */
  V['MATH_7_1_6'] = {
    title: '🎨 不等式數線圖解 ＆ 同乘 (−1) 180° 鏡像翻轉原理',
    subtitle: '親自按下「同乘 −1 翻轉數線」，一眼看懂為什麼乘除負數時不等號一定要反向！再練習空心 ○ 與實心 ● 端點',
    mount: function (el) {
      var mode = 'flip'; // 'flip' | 'interval'
      var flipped = false;
      var ivIdx = 0;
      var intervals = [
        { label: 'x > 2（空心向右）', text: 'x > 2（不含 2，空心圓 ○）', min: -3, max: 6, a: 2, aInc: false, b: null, dir: 'right', exp: '「大於 >」不包含端點 2，畫空心圓 ○，箭頭往右延伸代表所有比 2 大的數。' },
        { label: 'x ≥ 2（實心向右）', text: 'x ≥ 2（包含 2，實心圓 ●）', min: -3, max: 6, a: 2, aInc: true, b: null, dir: 'right', exp: '「大於等於 ≥」包含端點 2，必須塗滿畫成實心圓 ●，往右延伸。' },
        { label: 'x < −1（空心向左）', text: 'x < −1（不含 −1，空心圓 ○）', min: -5, max: 4, a: -1, aInc: false, b: null, dir: 'left', exp: '「小於 <」不包含 −1，畫空心圓 ○，箭頭往左延伸。' },
        { label: '−2 ≤ x < 3（雙端點）', text: '−2 ≤ x < 3（左實心 ●，右空心 ○）', min: -4, max: 5, a: -2, aInc: true, b: 3, bInc: false, dir: 'between', exp: '複合不等式左邊 −2 有等號畫實心 ●，右邊 3 沒等號畫空心 ○，塗滿中間區段（整數解為 −2, −1, 0, 1, 2）。' }
      ];

      function renderFlip() {
        var defs = '<defs>' +
          arrowDef('m716-ax', '#334155') +
          arrowDef('m716-b', '#2563eb') +
          arrowDef('m716-o', '#ea580c') +
          '</defs>';
        var s = defs;
        var padL = 55, padR = 585, lineY = 175;
        function tx(v) { return padL + ((v + 6) / 12) * (padR - padL); }

        s += pill(18, 12, 340, 30, flipped ? '🔄 已同乘 (−1)：−5 < −2（即 −2 > −5）' : '原始不等式：2 < 5（2 在 5 的左邊）',
          flipped ? '#fef2f2' : '#eff6ff', flipped ? '#b91c1c' : '#1e40af', flipped ? '#f87171' : '#93c5fd', 13.5);

        // Mirror line at 0
        var zx = tx(0);
        s += '<line x1="' + zx + '" y1="54" x2="' + zx + '" y2="236" stroke="#7c3aed" stroke-width="2" stroke-dasharray="6 4"/>';
        s += pill(zx - 52, 48, 104, 22, '🪞 原點 0 鏡面', '#f5f3ff', '#6d28d9', '#c4b5fd', 11.5);

        // Number line
        s += '<line x1="30" y1="' + lineY + '" x2="612" y2="' + lineY + '" stroke="#334155" stroke-width="2.5" marker-end="url(#m716-ax)"/>';
        for (var v = -6; v <= 6; v++) {
          var x = tx(v);
          s += '<line x1="' + x + '" y1="' + (lineY - 6) + '" x2="' + x + '" y2="' + (lineY + 6) + '" stroke="#64748b" stroke-width="1.5"/>';
          s += '<text x="' + x + '" y="' + (lineY + 24) + '" text-anchor="middle" font-size="12" font-weight="' + (v === 0 ? '800' : '600') + '" fill="#334155">' + fmtNum(v) + '</text>';
        }

        if (!flipped) {
          // 2 (blue) and 5 (orange)
          s += '<circle cx="' + tx(2) + '" cy="' + lineY + '" r="9" fill="#2563eb" stroke="#fff" stroke-width="2"/>';
          s += '<circle cx="' + tx(5) + '" cy="' + lineY + '" r="9" fill="#ea580c" stroke="#fff" stroke-width="2"/>';
          s += pill(tx(2) - 24, 128, 48, 24, '2', '#dbeafe', '#1e40af', '#60a5fa', 13);
          s += pill(tx(5) - 24, 128, 48, 24, '5', '#ffedd5', '#9a3412', '#fb923c', 13);
          s += pill(185, 220, 270, 30, '左小右大：2 在 5 左邊 → 2 < 5', '#f1f5f9', '#0f172a', '#cbd5e1', 13);
        } else {
          // Ghosts at 2 and 5
          s += '<circle cx="' + tx(2) + '" cy="' + lineY + '" r="7" fill="#bfdbfe" stroke="#93c5fd" stroke-dasharray="3 2"/>';
          s += '<circle cx="' + tx(5) + '" cy="' + lineY + '" r="7" fill="#fed7aa" stroke="#fdba74" stroke-dasharray="3 2"/>';
          // 180-degree flip arcs over 0
          s += '<path d="M ' + tx(2) + ' ' + (lineY - 10) + ' A ' + (tx(2) - zx) + ' 58 0 0 0 ' + (tx(-2) + 4) + ' ' + (lineY - 12) + '" fill="none" stroke="#2563eb" stroke-width="2.6" stroke-dasharray="5 3" marker-end="url(#m716-b)"/>';
          s += '<path d="M ' + tx(5) + ' ' + (lineY - 10) + ' A ' + (tx(5) - zx) + ' 92 0 0 0 ' + (tx(-5) + 4) + ' ' + (lineY - 12) + '" fill="none" stroke="#ea580c" stroke-width="2.6" stroke-dasharray="5 3" marker-end="url(#m716-o)"/>';
          // Landed dots at -2 and -5
          s += '<circle cx="' + tx(-2) + '" cy="' + lineY + '" r="9" fill="#2563eb" stroke="#fff" stroke-width="2"/>';
          s += '<circle cx="' + tx(-5) + '" cy="' + lineY + '" r="9" fill="#ea580c" stroke="#fff" stroke-width="2"/>';
          s += pill(tx(-2) - 24, 128, 48, 24, '−2', '#dbeafe', '#1e40af', '#60a5fa', 13);
          s += pill(tx(-5) - 24, 128, 48, 24, '−5', '#ffedd5', '#9a3412', '#fb923c', 13);
          s += pill(125, 220, 390, 30, '🔥 翻轉後藍點 (−2) 跑到橘點 (−5) 右邊 → −2 > −5！', '#dcfce7', '#166534', '#22c55e', 13);
        }
        return s;
      }

      function renderInterval() {
        var iv = intervals[ivIdx];
        var defs = '<defs>' +
          arrowDef('m716-i-ax', '#334155') +
          arrowDef('m716-i-ray', '#2563eb') +
          '</defs>';
        var s = defs;
        var padL = 60, padR = 580, lineY = 172, topY = 116;
        function tx(v) { return padL + ((v - iv.min) / (iv.max - iv.min)) * (padR - padL); }

        s += pill(18, 14, 340, 30, '目前區間：' + iv.text, '#eff6ff', '#1e40af', '#93c5fd', 13.5);
        s += pill(375, 14, 245, 30, '○ 空心 = 不含端點 ｜ ● 實心 = 含端點', '#f8fafc', '#334155', '#cbd5e1', 12);

        // Number line
        s += '<line x1="34" y1="' + lineY + '" x2="608" y2="' + lineY + '" stroke="#334155" stroke-width="2.5" marker-end="url(#m716-i-ax)"/>';
        for (var v = iv.min; v <= iv.max; v++) {
          var x = tx(v);
          s += '<line x1="' + x + '" y1="' + (lineY - 6) + '" x2="' + x + '" y2="' + (lineY + 6) + '" stroke="#64748b" stroke-width="1.5"/>';
          s += '<text x="' + x + '" y="' + (lineY + 25) + '" text-anchor="middle" font-size="12.5" font-weight="700" fill="#334155">' + fmtNum(v) + '</text>';
        }

        var ax = tx(iv.a);
        if (iv.dir === 'right') {
          s += '<rect x="' + ax + '" y="' + topY + '" width="' + (592 - ax) + '" height="' + (lineY - topY) + '" fill="rgba(37,99,235,0.12)"/>';
          s += '<line x1="' + ax + '" y1="' + lineY + '" x2="' + ax + '" y2="' + topY + '" stroke="#2563eb" stroke-width="3"/>';
          s += '<line x1="' + ax + '" y1="' + topY + '" x2="594" y2="' + topY + '" stroke="#2563eb" stroke-width="3.5" marker-end="url(#m716-i-ray)"/>';
          s += '<circle cx="' + ax + '" cy="' + topY + '" r="8" fill="' + (iv.aInc ? '#2563eb' : '#ffffff') + '" stroke="#2563eb" stroke-width="3"/>';
        } else if (iv.dir === 'left') {
          s += '<rect x="46" y="' + topY + '" width="' + (ax - 46) + '" height="' + (lineY - topY) + '" fill="rgba(37,99,235,0.12)"/>';
          s += '<line x1="' + ax + '" y1="' + lineY + '" x2="' + ax + '" y2="' + topY + '" stroke="#2563eb" stroke-width="3"/>';
          s += '<line x1="' + ax + '" y1="' + topY + '" x2="46" y2="' + topY + '" stroke="#2563eb" stroke-width="3.5" marker-end="url(#m716-i-ray)"/>';
          s += '<circle cx="' + ax + '" cy="' + topY + '" r="8" fill="' + (iv.aInc ? '#2563eb' : '#ffffff') + '" stroke="#2563eb" stroke-width="3"/>';
        } else {
          var bx = tx(iv.b);
          s += '<rect x="' + ax + '" y="' + topY + '" width="' + (bx - ax) + '" height="' + (lineY - topY) + '" fill="rgba(37,99,235,0.14)"/>';
          s += '<line x1="' + ax + '" y1="' + lineY + '" x2="' + ax + '" y2="' + topY + '" stroke="#2563eb" stroke-width="3"/>';
          s += '<line x1="' + bx + '" y1="' + lineY + '" x2="' + bx + '" y2="' + topY + '" stroke="#2563eb" stroke-width="3"/>';
          s += '<line x1="' + ax + '" y1="' + topY + '" x2="' + bx + '" y2="' + topY + '" stroke="#2563eb" stroke-width="3.5"/>';
          s += '<circle cx="' + ax + '" cy="' + topY + '" r="8" fill="' + (iv.aInc ? '#2563eb' : '#ffffff') + '" stroke="#2563eb" stroke-width="3"/>';
          s += '<circle cx="' + bx + '" cy="' + topY + '" r="8" fill="' + (iv.bInc ? '#2563eb' : '#ffffff') + '" stroke="#2563eb" stroke-width="3"/>';
        }

        s += pill(170, 218, 300, 28, '解集合圖示完成（藍色斜影區即為符合的 x）', '#f0fdf4', '#166534', '#86efac', 12.5);
        return s;
      }

      function render() {
        var controls = '<div class="hb-vis-controls">' +
          '<button type="button" class="hb-vis-btn' + (mode === 'flip' ? ' active' : '') + '" data-m="flip">🪞 同乘 (−1) 翻轉數線</button>' +
          '<button type="button" class="hb-vis-btn' + (mode === 'interval' ? ' active' : '') + '" data-m="interval">○/● 空心與實心端點練習</button>' +
          '<span style="color:#cbd5e1;">|</span>';

        if (mode === 'flip') {
          controls += '<button type="button" class="hb-vis-btn active" style="background:#dc2626;border-color:#dc2626;" data-flip="1">' +
            (flipped ? '↩ 還原回 2 < 5' : '🔄 同乘 (−1) 翻轉數線！') + '</button>';
        } else {
          controls += intervals.map(function (item, i) {
            return '<button type="button" class="hb-vis-btn' + (i === ivIdx ? ' active' : '') + '" data-iv="' + i + '">' + esc(item.label) + '</button>';
          }).join('');
        }
        controls += '</div>';

        var readout = mode === 'flip'
          ? (flipped
            ? '<strong>✅ 真相大白：</strong>把整條數線繞原點 0 旋轉 180°（同乘 −1），原本在左邊的 2 跑到 −2，原本在右邊的 5 跑到 −5，左右順序完全顛倒！所以解 −2x > 6 同除 −2 時，必須變成 x < −3！'
            : '<strong>💡 動手按看看：</strong>目前 2 在 5 左邊（2 < 5）。點擊紅色「同乘 (−1) 翻轉數線」按鈕，觀察兩點經過原點鏡面翻轉後的左右位置！')
          : '<strong>🔍 端點規則：</strong>' + intervals[ivIdx].exp;

        el.innerHTML = controls + svgWrap(mode === 'flip' ? renderFlip() : renderInterval(), 266) +
          '<div class="hb-vis-readout">' + readout + '</div>';

        el.querySelectorAll('[data-m]').forEach(function (b) {
          b.addEventListener('click', function () { mode = b.getAttribute('data-m'); render(); });
        });
        var fb = el.querySelector('[data-flip]');
        if (fb) fb.addEventListener('click', function () { flipped = !flipped; render(); });
        el.querySelectorAll('[data-iv]').forEach(function (b) {
          b.addEventListener('click', function () { ivIdx = Number(b.getAttribute('data-iv')); render(); });
        });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     7. MATH_8_2_1 — 乘法公式幾何面積拼圖切換器
     ======================================================================== */
  V['MATH_8_2_1'] = {
    title: '🎨 乘法公式幾何面積拼圖（和平方／差平方補角／平方差剪拼）',
    subtitle: '切換三大乘法公式，用幾何面積直接看懂為什麼 (a+b)² 不是 a²+b²、為什麼 (a−b)² 最後是 +b²！',
    mount: function (el) {
      var tab = 'add'; // 'add' | 'sub' | 'diff'
      var diffRearranged = false;
      var subShowAddBack = true;

      function render() {
        var s = '';
        var readout = '';

        if (tab === 'add') {
          s += pill(18, 12, 315, 28, '和的平方：(a + b)² = a² + 2ab + b²', '#eff6ff', '#1e40af', '#93c5fd', 13.5);
          // Square at x=75, y=64, a=116, b=52
          var x0 = 78, y0 = 68, A = 116, B = 52;
          s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + A + '" height="' + A + '" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>';
          s += '<rect x="' + (x0 + A) + '" y="' + y0 + '" width="' + B + '" height="' + A + '" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>';
          s += '<rect x="' + x0 + '" y="' + (y0 + A) + '" width="' + A + '" height="' + B + '" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>';
          s += '<rect x="' + (x0 + A) + '" y="' + (y0 + A) + '" width="' + B + '" height="' + B + '" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/>';
          // Inner labels
          s += '<text x="' + (x0 + A / 2) + '" y="' + (y0 + A / 2 + 6) + '" text-anchor="middle" font-size="20" font-weight="800" fill="#1e40af">a²</text>';
          s += '<text x="' + (x0 + A + B / 2) + '" y="' + (y0 + A / 2 + 5) + '" text-anchor="middle" font-size="15" font-weight="800" fill="#15803d">ab</text>';
          s += '<text x="' + (x0 + A / 2) + '" y="' + (y0 + A + B / 2 + 5) + '" text-anchor="middle" font-size="15" font-weight="800" fill="#15803d">ab</text>';
          s += '<text x="' + (x0 + A + B / 2) + '" y="' + (y0 + A + B / 2 + 6) + '" text-anchor="middle" font-size="15" font-weight="800" fill="#c2410c">b²</text>';
          // Dimension labels
          s += '<text x="' + (x0 + A / 2) + '" y="' + (y0 - 8) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#1e40af">a</text>';
          s += '<text x="' + (x0 + A + B / 2) + '" y="' + (y0 - 8) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#c2410c">b</text>';
          s += '<text x="' + (x0 - 14) + '" y="' + (y0 + A / 2 + 4) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#1e40af">a</text>';
          s += '<text x="' + (x0 - 14) + '" y="' + (y0 + A + B / 2 + 4) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#c2410c">b</text>';

          // Right explanation box
          s += card(295, 58, 325, 186, '#f8fafc', '#cbd5e1', 10);
          s += '<text x="315" y="84" font-size="14" font-weight="800" fill="#0f172a">📐 大正方形總面積拆解：</text>';
          s += '<text x="315" y="114" font-size="15" font-weight="800" fill="#1e40af">■ 1 塊藍正方形 = a²</text>';
          s += '<text x="315" y="142" font-size="15" font-weight="800" fill="#15803d">■ 2 塊綠長方形 = ab + ab = 2ab</text>';
          s += '<text x="315" y="170" font-size="15" font-weight="800" fill="#c2410c">■ 1 塊橘正方形 = b²</text>';
          s += pill(315, 192, 286, 36, '⚠️ 漏掉兩塊綠色的 2ab 就會少算面積！', '#fef2f2', '#b91c1c', '#fca5a5', 12.5);
          readout = '<strong>和的平方直覺：</strong>邊長 (a + b) 的大正方形由 4 塊拼成：a² + ab + ab + b² = a² + 2ab + b²，中間的 2ab 就是右側與底部的兩塊綠色長方形！';
        } else if (tab === 'sub') {
          s += pill(18, 12, 340, 28, '差的平方：(a − b)² = a² − 2ab + b²', '#fff7ed', '#9a3412', '#fdba74', 13.5);
          var sx = 78, sy = 68, big = 168, cut = 52, rem = big - cut;
          // Target (a-b)^2 top-left
          s += '<rect x="' + sx + '" y="' + sy + '" width="' + rem + '" height="' + rem + '" fill="#dbeafe" stroke="#2563eb" stroke-width="2.5"/>';
          // Right strip a*b (subtracted once)
          s += '<rect x="' + (sx + rem) + '" y="' + sy + '" width="' + cut + '" height="' + big + '" fill="rgba(239,68,68,0.16)" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="5 3"/>';
          // Bottom strip a*b (subtracted once)
          s += '<rect x="' + sx + '" y="' + (sy + rem) + '" width="' + big + '" height="' + cut + '" fill="rgba(239,68,68,0.16)" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="5 3"/>';
          // Overlapping corner b^2!
          s += '<rect x="' + (sx + rem) + '" y="' + (sy + rem) + '" width="' + cut + '" height="' + cut + '" fill="' + (subShowAddBack ? '#fef08a' : 'rgba(220,38,38,0.34)') + '" stroke="' + (subShowAddBack ? '#16a34a' : '#b91c1c') + '" stroke-width="2.5"/>';
          s += '<text x="' + (sx + rem / 2) + '" y="' + (sy + rem / 2 + 6) + '" text-anchor="middle" font-size="17" font-weight="800" fill="#1e40af">(a − b)²</text>';
          s += '<text x="' + (sx + rem + cut / 2) + '" y="' + (sy + rem / 2) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#b91c1c">− ab</text>';
          s += '<text x="' + (sx + rem / 2) + '" y="' + (sy + rem + cut / 2 + 4) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#b91c1c">− ab</text>';
          s += '<text x="' + (sx + rem + cut / 2) + '" y="' + (sy + rem + cut / 2 + 4) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="' + (subShowAddBack ? '#15803d' : '#7f1d1d') + '">' + (subShowAddBack ? '+ b²' : '扣 2 次!') + '</text>';
          // Outer labels
          s += '<text x="' + (sx + rem / 2) + '" y="' + (sy - 8) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#1e40af">a − b</text>';
          s += '<text x="' + (sx + rem + cut / 2) + '" y="' + (sy - 8) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#dc2626">b</text>';
          s += '<text x="' + (sx - 16) + '" y="' + (sy + big / 2 + 4) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#334155">a</text>';

          // Right explanation box
          s += card(295, 58, 325, 186, '#f8fafc', '#cbd5e1', 10);
          s += '<text x="315" y="84" font-size="14" font-weight="800" fill="#0f172a">💡 為什麼尾巴是「+ b²」不是「− b²」？</text>';
          s += '<text x="315" y="112" font-size="13" font-weight="700" fill="#334155">① 從大正方形 a² 扣掉右側長條 ab</text>';
          s += '<text x="315" y="136" font-size="13" font-weight="700" fill="#334155">② 再扣掉底部長條 ab（共扣 2ab）</text>';
          s += '<text x="315" y="162" font-size="13" font-weight="800" fill="#dc2626">③ 右下角重疊的 b² 被多扣了一次！</text>';
          s += pill(315, 184, 286, 40, '✅ 必須「+ b²」補回 → a² − 2ab + b²', '#dcfce7', '#166534', '#22c55e', 13);
          readout = '<strong>差的平方防錯關鍵：</strong>扣掉右側 ab 與底部 ab 時，右下角重疊的 b² 被扣了兩次！為了還原正確面積，必須把多扣的那塊 b² 加回來，所以最後一定是 + b²！';
        } else {
          s += pill(18, 12, 345, 28, '平方差：a² − b² = (a + b)(a − b)', '#f0fdf4', '#166534', '#4ade80', 13.5);
          var dx = 62, dy = 66, D = 152, C = 48, R = D - C;
          if (!diffRearranged) {
            // L-shape: top rectangle a*(a-b) + bottom-left rectangle (a-b)*b, cut line visible
            s += '<rect x="' + dx + '" y="' + dy + '" width="' + D + '" height="' + R + '" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>';
            s += '<rect x="' + dx + '" y="' + (dy + R) + '" width="' + R + '" height="' + C + '" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/>';
            s += '<rect x="' + (dx + R) + '" y="' + (dy + R) + '" width="' + C + '" height="' + C + '" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.8" stroke-dasharray="4 3"/>';
            s += '<line x1="' + dx + '" y1="' + (dy + R) + '" x2="' + (dx + R) + '" y2="' + (dy + R) + '" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6 3"/>';
            s += '<text x="' + (dx + D / 2) + '" y="' + (dy + R / 2 + 5) + '" text-anchor="middle" font-size="14" font-weight="800" fill="#1e40af">面積 = a × (a − b)</text>';
            s += '<text x="' + (dx + R / 2) + '" y="' + (dy + R + C / 2 + 5) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#c2410c">剪下這塊 b × (a−b)</text>';
            s += '<text x="' + (dx + R + C / 2) + '" y="' + (dy + R + C / 2 + 4) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#64748b">挖掉 b²</text>';
            s += '<text x="' + (dx + D / 2) + '" y="' + (dy - 8) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">a</text>';
            s += '<text x="' + (dx - 18) + '" y="' + (dy + R / 2 + 4) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#1e40af">a−b</text>';
            s += '<text x="' + (dx - 14) + '" y="' + (dy + R + C / 2 + 4) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#ea580c">b</text>';

            s += card(265, 66, 355, 152, '#f8fafc', '#cbd5e1', 10);
            s += '<text x="285" y="96" font-size="14" font-weight="800" fill="#0f172a">✂️ 步驟 1：大正方形 a² 挖掉右下角 b²</text>';
            s += '<text x="285" y="126" font-size="13" fill="#334155">剩下 L 形區域（藍塊＋橘塊），總面積 = a² − b²。</text>';
            s += '<text x="285" y="154" font-size="13" fill="#334155">沿紅色虛線把橘塊剪下來，轉 90° 拼到藍塊右側！</text>';
            s += pill(285, 174, 315, 30, '👆 點擊上方「剪開重組成長方形」看看魔法！', '#eff6ff', '#1d4ed8', '#60a5fa', 12.5);
            readout = '<strong>平方差步驟 1：</strong>從邊長 a 的正方形挖去邊長 b 的小正方形，剩餘面積就是 a² − b²。按下「剪開重組成長方形」把它變成整齊長方形！';
          } else {
            // Rearranged rectangle: width = D + C = a + b, height = R = a - b
            var rx = 56, ry = 88;
            s += '<rect x="' + rx + '" y="' + ry + '" width="' + D + '" height="' + R + '" fill="#dbeafe" stroke="#2563eb" stroke-width="2.2"/>';
            s += '<rect x="' + (rx + D) + '" y="' + ry + '" width="' + C + '" height="' + R + '" fill="#ffedd5" stroke="#ea580c" stroke-width="2.2"/>';
            s += '<text x="' + (rx + D / 2) + '" y="' + (ry + R / 2 + 5) + '" text-anchor="middle" font-size="15" font-weight="800" fill="#1e40af">原藍塊（寬 a）</text>';
            s += '<text x="' + (rx + D + C / 2) + '" y="' + (ry + R / 2 + 5) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#c2410c">移過來的橘塊</text>';
            // Top bracket a + b
            s += '<line x1="' + rx + '" y1="74" x2="' + (rx + D + C) + '" y2="74" stroke="#16a34a" stroke-width="2.5"/>';
            s += pill(rx + (D + C) / 2 - 58, 48, 116, 24, '總長 = a + b', '#dcfce7', '#166534', '#22c55e', 13);
            s += '<text x="' + (rx - 20) + '" y="' + (ry + R / 2 + 5) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#1e40af">a − b</text>';

            s += card(295, 72, 325, 146, '#f0fdf4', '#22c55e', 10);
            s += '<text x="315" y="102" font-size="14.5" font-weight="800" fill="#166534">✨ 重組完成！面積一分不差：</text>';
            s += '<text x="315" y="132" font-size="14" font-weight="700" fill="#0f172a">長方形 長 = a + b，寬 = a − b</text>';
            s += '<text x="315" y="162" font-size="16" font-weight="800" fill="#15803d">a² − b² = (a + b)(a − b)</text>';
            s += '<text x="315" y="192" font-size="12.5" fill="#334155">秒算應用：99² − 1² = (99+1)(99−1) = 9800</text>';
            readout = '<strong>平方差重組證明：</strong>把剪下的橘色長條轉 90° 貼到右側，剛好拼成一個長 (a+b)、寬 (a−b) 的完整長方形，直接證明 a² − b² = (a+b)(a−b)！';
          }
        }

        var controls = '<div class="hb-vis-controls">' +
          '<button type="button" class="hb-vis-btn' + (tab === 'add' ? ' active' : '') + '" data-t="add">(a + b)² 和平方</button>' +
          '<button type="button" class="hb-vis-btn' + (tab === 'sub' ? ' active' : '') + '" data-t="sub">(a − b)² 差平方補角</button>' +
          '<button type="button" class="hb-vis-btn' + (tab === 'diff' ? ' active' : '') + '" data-t="diff">a² − b² 平方差剪拼</button>';

        if (tab === 'sub') {
          controls += '<span style="color:#cbd5e1;">|</span>' +
            '<button type="button" class="hb-vis-btn" data-sub="1">' + (subShowAddBack ? '🔍 查看「被扣兩次」原狀' : '✅ 補回重疊角 + b²') + '</button>';
        }
        if (tab === 'diff') {
          controls += '<span style="color:#cbd5e1;">|</span>' +
            '<button type="button" class="hb-vis-btn active" style="background:#16a34a;border-color:#16a34a;" data-diff="1">' +
            (diffRearranged ? '↩ 還原回 L 形 (a² − b²)' : '✂️ 剪開重組成長方形！') + '</button>';
        }
        controls += '</div>';

        el.innerHTML = controls + svgWrap(s, 264) +
          '<div class="hb-vis-readout">' + readout + '</div>';

        el.querySelectorAll('[data-t]').forEach(function (b) {
          b.addEventListener('click', function () {
            tab = b.getAttribute('data-t');
            render();
          });
        });
        var sb = el.querySelector('[data-sub]');
        if (sb) sb.addEventListener('click', function () { subShowAddBack = !subShowAddBack; render(); });
        var db = el.querySelector('[data-diff]');
        if (db) db.addEventListener('click', function () { diffRearranged = !diffRearranged; render(); });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     8. MATH_8_2_2 — 多項式長除法「缺項補 0」對齊逐步動畫
     ======================================================================== */
  V['MATH_8_2_2'] = {
    title: '🎨 多項式長除法「缺項補 0」對齊逐步動畫',
    subtitle: '以經典必考題 (x³ − 8) ÷ (x − 2) 演示：缺了 x² 與 x 兩項一定要補 + 0x² + 0x，才能直行對齊不跳格！',
    mount: function (el) {
      var step = 1; // 1..4
      var timer = null;
      function stopPlay() { if (timer) { clearInterval(timer); timer = null; } }

      var notes = [
        '第 1 步（最關鍵！）：被除式 x³ − 8 缺少 x² 項與 x 項，必須「降冪排列＋缺項補 0」寫成 x³ + 0x² + 0x − 8！',
        '第 2 步：商取 x²，乘以 (x − 2) 得 x³ − 2x²。直式相減時注意負負得正：0x² − (−2x²) = +2x²，再拉下 + 0x！',
        '第 3 步：商取 +2x，乘以 (x − 2) 得 2x² − 4x。相減：0x − (−4x) = +4x，再拉下 − 8！',
        '第 4 步：商取 +4，乘以 (x − 2) 得 4x − 8。相減得餘式 0！故商式 = x² + 2x + 4，餘式 = 0（整除）✔！'
      ];

      function render() {
        var s = '';
        s += pill(18, 10, 320, 26, '題目：(x³ − 8) ÷ (x − 2)　＝　(x³ + 0x² + 0x − 8) ÷ (x − 2)', '#eff6ff', '#1e40af', '#93c5fd', 12);

        // 4 vertical column bands for alignment
        var cols = [
          { x: 145, w: 66, name: 'x³ 欄', bg: '#f8fafc' },
          { x: 211, w: 72, name: 'x² 欄', bg: step === 1 ? '#fef3c7' : '#f1f5f9' },
          { x: 283, w: 70, name: 'x 欄', bg: step === 1 ? '#fef3c7' : '#f8fafc' },
          { x: 353, w: 66, name: '常數欄', bg: '#f1f5f9' }
        ];
        cols.forEach(function (c, i) {
          var activeCol = (step === 2 && i === 1) || (step === 3 && i === 2) || (step === 4 && i === 3);
          s += '<rect x="' + c.x + '" y="44" width="' + c.w + '" height="214" rx="4" fill="' + (activeCol ? '#dbeafe' : c.bg) + '" stroke="' + (activeCol ? '#60a5fa' : '#e2e8f0') + '" stroke-width="1"/>';
          s += '<text x="' + (c.x + c.w / 2) + '" y="58" text-anchor="middle" font-size="10.5" font-weight="800" fill="#64748b">' + c.name + '</text>';
        });

        var cx = [178, 247, 318, 386];

        // Quotient row (y=80)
        if (step >= 2) s += '<text x="' + cx[1] + '" y="80" text-anchor="middle" font-size="15" font-weight="800" fill="#1d4ed8">x²</text>';
        if (step >= 3) s += '<text x="' + cx[2] + '" y="80" text-anchor="middle" font-size="15" font-weight="800" fill="#1d4ed8">+ 2x</text>';
        if (step >= 4) s += '<text x="' + cx[3] + '" y="80" text-anchor="middle" font-size="15" font-weight="800" fill="#16a34a">+ 4</text>';

        // Division bracket & divisor
        s += '<text x="124" y="108" text-anchor="end" font-size="15" font-weight="800" fill="#0f172a">x − 2</text>';
        s += '<path d="M 134 114 Q 142 100 134 88 L 418 88" fill="none" stroke="#0f172a" stroke-width="2.2"/>';

        // Dividend row (y=108)
        s += '<text x="' + cx[0] + '" y="108" text-anchor="middle" font-size="15" font-weight="800" fill="#0f172a">x³</text>';
        s += '<text x="' + cx[1] + '" y="108" text-anchor="middle" font-size="15" font-weight="800" fill="#b45309">+ 0x²</text>';
        s += '<text x="' + cx[2] + '" y="108" text-anchor="middle" font-size="15" font-weight="800" fill="#b45309">+ 0x</text>';
        s += '<text x="' + cx[3] + '" y="108" text-anchor="middle" font-size="15" font-weight="800" fill="#0f172a">− 8</text>';

        // Step 2 subtraction
        if (step >= 2) {
          s += '<text x="148" y="132" font-size="12" font-weight="800" fill="#dc2626">−)</text>';
          s += '<text x="' + cx[0] + '" y="132" text-anchor="middle" font-size="14.5" font-weight="700" fill="#dc2626">x³</text>';
          s += '<text x="' + cx[1] + '" y="132" text-anchor="middle" font-size="14.5" font-weight="700" fill="#dc2626">− 2x²</text>';
          s += '<line x1="150" y1="139" x2="285" y2="139" stroke="#334155" stroke-width="1.8"/>';
          s += '<text x="' + cx[1] + '" y="159" text-anchor="middle" font-size="14.5" font-weight="800" fill="#0f172a">+ 2x²</text>';
          s += '<text x="' + cx[2] + '" y="159" text-anchor="middle" font-size="14.5" font-weight="700" fill="#64748b">+ 0x</text>';
        }
        // Step 3 subtraction
        if (step >= 3) {
          s += '<text x="214" y="182" font-size="12" font-weight="800" fill="#dc2626">−)</text>';
          s += '<text x="' + cx[1] + '" y="182" text-anchor="middle" font-size="14.5" font-weight="700" fill="#dc2626">2x²</text>';
          s += '<text x="' + cx[2] + '" y="182" text-anchor="middle" font-size="14.5" font-weight="700" fill="#dc2626">− 4x</text>';
          s += '<line x1="215" y1="189" x2="355" y2="189" stroke="#334155" stroke-width="1.8"/>';
          s += '<text x="' + cx[2] + '" y="209" text-anchor="middle" font-size="14.5" font-weight="800" fill="#0f172a">+ 4x</text>';
          s += '<text x="' + cx[3] + '" y="209" text-anchor="middle" font-size="14.5" font-weight="700" fill="#64748b">− 8</text>';
        }
        // Step 4 subtraction
        if (step >= 4) {
          s += '<text x="286" y="232" font-size="12" font-weight="800" fill="#dc2626">−)</text>';
          s += '<text x="' + cx[2] + '" y="232" text-anchor="middle" font-size="14.5" font-weight="700" fill="#dc2626">4x</text>';
          s += '<text x="' + cx[3] + '" y="232" text-anchor="middle" font-size="14.5" font-weight="700" fill="#dc2626">− 8</text>';
          s += '<line x1="286" y1="238" x2="416" y2="238" stroke="#334155" stroke-width="1.8"/>';
          s += '<text x="' + cx[3] + '" y="255" text-anchor="middle" font-size="15" font-weight="800" fill="#16a34a">0</text>';
        }

        // Right callout panel
        s += card(434, 44, 192, 214, '#f8fafc', '#cbd5e1', 10);
        s += '<text x="448" y="68" font-size="13" font-weight="800" fill="#0f172a">📌 本步防錯提醒</text>';
        if (step === 1) {
          s += pill(446, 82, 168, 30, '⚠️ 補 + 0x² 與 + 0x', '#fef3c7', '#92400e', '#f59e0b', 12.5);
          s += '<text x="448" y="136" font-size="12.5" fill="#334155">不補 0 的話，−2x²</text>';
          s += '<text x="448" y="156" font-size="12.5" fill="#334155">就會錯寫到 −8 下方，</text>';
          s += '<text x="448" y="176" font-size="12.5" fill="#dc2626" font-weight="700">直接整題算錯！</text>';
        } else if (step === 2) {
          s += pill(446, 82, 168, 30, '0x² − (−2x²) = +2x²', '#fef2f2', '#b91c1c', '#f87171', 12.5);
          s += '<text x="448" y="136" font-size="12.5" fill="#334155">減去負數變加法！</text>';
          s += '<text x="448" y="158" font-size="12.5" fill="#334155">千萬別寫成 −2x²。</text>';
        } else if (step === 3) {
          s += pill(446, 82, 168, 30, '0x − (−4x) = +4x', '#fef2f2', '#b91c1c', '#f87171', 12.5);
          s += '<text x="448" y="136" font-size="12.5" fill="#334155">同樣注意減去負數！</text>';
          s += '<text x="448" y="158" font-size="12.5" fill="#334155">再把常數 −8 拉下來。</text>';
        } else {
          s += pill(446, 82, 168, 30, '✅ 餘式 = 0（整除）', '#dcfce7', '#166534', '#22c55e', 12.5);
          s += '<text x="448" y="134" font-size="12.5" font-weight="700" fill="#1e40af">商式：x² + 2x + 4</text>';
          s += '<text x="448" y="158" font-size="12" fill="#334155">除法原理驗算：</text>';
          s += '<text x="448" y="178" font-size="11.5" font-weight="700" fill="#0f172a">x³ − 8</text>';
          s += '<text x="448" y="196" font-size="11.5" font-weight="700" fill="#0f172a">= (x−2)(x²+2x+4)</text>';
        }

        var controls = '<div class="hb-vis-controls">' +
          [1, 2, 3, 4].map(function (st) {
            return '<button type="button" class="hb-vis-btn' + (st === step ? ' active' : '') + '" data-s="' + st + '">第 ' + st + ' 步</button>';
          }).join('') +
          '<button type="button" class="hb-vis-btn" data-play="1">' + (timer ? '⏸ 暫停' : '▶ 自動逐步演示') + '</button>' +
          '</div>';

        el.innerHTML = controls + svgWrap(s, 270) +
          '<div class="hb-vis-readout"><strong>步驟詳解：</strong>' + esc(notes[step - 1]) + '</div>';

        el.querySelectorAll('[data-s]').forEach(function (b) {
          b.addEventListener('click', function () {
            stopPlay();
            step = Number(b.getAttribute('data-s'));
            render();
          });
        });
        var pb = el.querySelector('[data-play]');
        if (pb) {
          pb.addEventListener('click', function () {
            if (timer) { stopPlay(); render(); return; }
            step = 1;
            render();
            timer = setInterval(function () {
              if (step >= 4) { stopPlay(); render(); return; }
              step++;
              render();
            }, 1300);
          });
        }
      }

      render();
      return stopPlay;
    }
  };

  /* ========================================================================
     9. MATH_8_2_3 — 畢氏定理與立體長方體「三種展開圖」最短路徑比拚
     ======================================================================== */
  V['MATH_8_2_3'] = {
    title: '🎨 畢氏定理 × 長方體 (8×3×3)「三種展開圖」最短路徑比拚',
    subtitle: '螞蟻從左下前頂點 A 沿表面爬到右上後頂點 B，切換 3 種攤平展開方式，找出唯一最短直線！',
    mount: function (el) {
      var uIdx = 0;
      var unfoldings = [
        {
          label: '展開 ①：前＋上（★ 最短 = 10）',
          faces: '前面 (8×3) ＋ 上面 (8×3)',
          leg1: '長 = 8', leg2: '高 + 寬 = 3 + 3 = 6',
          w: 8, h: 6, splitAt: 3, splitDir: 'h',
          calc: '√(8² + 6²) = √(64 + 36) = √100 = 10',
          isBest: true,
          explain: '🏆 唯一最短路徑！把較短的兩邊「高 3 ＋ 寬 3 = 6」拼成一股，最長邊 8 單獨當另一股，畢氏定理算出 AB = √100 = 10（比另外兩種短 1.4 單位！）。'
        },
        {
          label: '展開 ②：前＋右（√130 ≈ 11.4）',
          faces: '前面 (8×3) ＋ 右面 (3×3)',
          leg1: '長 + 寬 = 8 + 3 = 11', leg2: '高 = 3',
          w: 11, h: 3, splitAt: 8, splitDir: 'v',
          calc: '√(11² + 3²) = √(121 + 9) = √130 ≈ 11.40',
          isBest: false,
          explain: '沿前面＋右面攤平，兩股變成 (8+3)=11 與 3。因為把最長邊 8 又加上 3 變成 11，平方暴增到 121，總長 √130 反而變長！'
        },
        {
          label: '展開 ③：左＋上（√130 ≈ 11.4）',
          faces: '左面 (3×3) ＋ 上面 (3×8)',
          leg1: '高 + 長 = 3 + 8 = 11', leg2: '寬 = 3',
          w: 11, h: 3, splitAt: 3, splitDir: 'v',
          calc: '√(3² + 11²) = √(9 + 121) = √130 ≈ 11.40',
          isBest: false,
          explain: '沿左面＋上面攤平，兩股同樣是 11 與 3，斜邊長也是 √130 ≈ 11.40。結論口訣：「短邊配短邊相加，最長邊單獨留著，和的平方最小！」'
        }
      ];

      function render() {
        var u = unfoldings[uIdx];
        var s = '';
        s += pill(18, 12, 225, 28, '長方體尺寸：長 8 × 寬 3 × 高 3', '#f1f5f9', '#0f172a', '#cbd5e1', 12.5);
        s += pill(258, 12, 364, 28, u.isBest ? '🏆 ' + u.faces + ' → 最短路徑 = 10' : '📏 ' + u.faces + ' → 距離 √130 ≈ 11.40',
          u.isBest ? '#dcfce7' : '#fff7ed', u.isBest ? '#166534' : '#9a3412', u.isBest ? '#22c55e' : '#fb923c', 12.5);

        // Left: 3D Isometric Cuboid (x=30..235)
        s += card(18, 50, 220, 206, '#f8fafc', '#cbd5e1', 10);
        // Front face: (42,145)-(162,145)-(162,210)-(42,210)
        // Depth vector (+46, -34)
        var frontFill = (uIdx === 0 || uIdx === 1) ? '#dbeafe' : '#f1f5f9';
        var topFill = (uIdx === 0 || uIdx === 2) ? '#fef3c7' : '#f8fafc';
        var rightFill = (uIdx === 1) ? '#fef3c7' : '#e2e8f0';
        // Back hidden edges
        s += '<line x1="88" y1="111" x2="88" y2="176" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4 3"/>';
        s += '<line x1="42" y1="210" x2="88" y2="176" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4 3"/>';
        s += '<line x1="88" y1="176" x2="208" y2="176" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4 3"/>';
        // Top face
        s += '<polygon points="42,145 88,111 208,111 162,145" fill="' + topFill + '" stroke="#334155" stroke-width="1.8"/>';
        // Right face
        s += '<polygon points="162,145 208,111 208,176 162,210" fill="' + rightFill + '" stroke="#334155" stroke-width="1.8"/>';
        // Front face
        s += '<polygon points="42,145 162,145 162,210 42,210" fill="' + frontFill + '" stroke="#334155" stroke-width="1.8"/>';
        // Points A & B
        s += '<circle cx="42" cy="210" r="6" fill="#2563eb" stroke="#fff" stroke-width="1.5"/>';
        s += '<text x="34" y="230" font-size="13" font-weight="800" fill="#1d4ed8">A (起點)</text>';
        s += '<circle cx="208" cy="111" r="6" fill="#dc2626" stroke="#fff" stroke-width="1.5"/>';
        s += '<text x="190" y="99" font-size="13" font-weight="800" fill="#b91c1c">B (終點)</text>';
        // Dimensions
        s += '<text x="102" y="226" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">長 8</text>';
        s += '<text x="192" y="204" font-size="11.5" font-weight="700" fill="#334155">寬 3</text>';
        s += '<text x="214" y="148" font-size="11.5" font-weight="700" fill="#334155">高 3</text>';

        // Right: Flattened 2D Net (x=254..622)
        s += card(254, 50, 368, 206, '#ffffff', u.isBest ? '#22c55e' : '#cbd5e1', 10);
        var scale = u.w === 8 ? 22 : 21;
        var netW = u.w * scale;
        var netH = u.h * scale;
        var nx = 254 + (368 - netW) / 2;
        var ny = 76 + (112 - netH) / 2;

        if (u.splitDir === 'h') {
          var sh = u.splitAt * scale;
          s += '<rect x="' + nx + '" y="' + ny + '" width="' + netW + '" height="' + sh + '" fill="#fef3c7" stroke="#334155" stroke-width="1.8"/>';
          s += '<rect x="' + nx + '" y="' + (ny + sh) + '" width="' + netW + '" height="' + (netH - sh) + '" fill="#dbeafe" stroke="#334155" stroke-width="1.8"/>';
          s += '<line x1="' + nx + '" y1="' + (ny + sh) + '" x2="' + (nx + netW) + '" y2="' + (ny + sh) + '" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5 3"/>';
        } else {
          var sw = u.splitAt * scale;
          s += '<rect x="' + nx + '" y="' + ny + '" width="' + sw + '" height="' + netH + '" fill="#dbeafe" stroke="#334155" stroke-width="1.8"/>';
          s += '<rect x="' + (nx + sw) + '" y="' + ny + '" width="' + (netW - sw) + '" height="' + netH + '" fill="#fef3c7" stroke="#334155" stroke-width="1.8"/>';
          s += '<line x1="' + (nx + sw) + '" y1="' + ny + '" x2="' + (nx + sw) + '" y2="' + (ny + netH) + '" stroke="#64748b" stroke-width="1.8" stroke-dasharray="5 3"/>';
        }

        // Right angle square at bottom-right
        s += '<polyline points="' + (nx + netW - 12) + ',' + (ny + netH) + ' ' + (nx + netW - 12) + ',' + (ny + netH - 12) + ' ' + (nx + netW) + ',' + (ny + netH - 12) + '" fill="none" stroke="#334155" stroke-width="1.8"/>';
        // Shortest straight hypotenuse line A(bottom-left) to B(top-right)
        var pathColor = u.isBest ? '#16a34a' : '#ea580c';
        s += '<line x1="' + nx + '" y1="' + (ny + netH) + '" x2="' + (nx + netW) + '" y2="' + ny + '" stroke="' + pathColor + '" stroke-width="3.5"/>';
        s += '<circle cx="' + nx + '" cy="' + (ny + netH) + '" r="6" fill="#2563eb" stroke="#fff" stroke-width="1.5"/>';
        s += '<text x="' + (nx - 14) + '" y="' + (ny + netH + 5) + '" font-size="13" font-weight="800" fill="#1d4ed8">A</text>';
        s += '<circle cx="' + (nx + netW) + '" cy="' + ny + '" r="6" fill="#dc2626" stroke="#fff" stroke-width="1.5"/>';
        s += '<text x="' + (nx + netW + 10) + '" y="' + (ny + 5) + '" font-size="13" font-weight="800" fill="#b91c1c">B</text>';

        // Leg labels
        s += '<text x="' + (nx + netW / 2) + '" y="' + (ny + netH + 18) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#1e40af">' + esc(u.leg1) + '</text>';
        s += '<text x="' + (nx + netW + 8) + '" y="' + (ny + netH / 2 + 4) + '" font-size="11.5" font-weight="800" fill="#b45309">' + esc(u.leg2) + '</text>';

        // Formula bar at bottom of right card
        s += pill(270, 218, 336, 28, 'AB = ' + u.calc, u.isBest ? '#dcfce7' : '#fff7ed', u.isBest ? '#166534' : '#9a3412', pathColor, 12.5);

        var controls = '<div class="hb-vis-controls">' +
          unfoldings.map(function (item, i) {
            return '<button type="button" class="hb-vis-btn' + (i === uIdx ? ' active' : '') + '" data-u="' + i + '">' + esc(item.label) + '</button>';
          }).join('') +
          '</div>';

        el.innerHTML = controls + svgWrap(s, 268) +
          '<div class="hb-vis-readout"><strong>🐜 最短路徑解析：</strong>' + esc(u.explain) + '</div>';

        el.querySelectorAll('[data-u]').forEach(function (b) {
          b.addEventListener('click', function () { uIdx = Number(b.getAttribute('data-u')); render(); });
        });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     10. MATH_8_2_4 — ★ 旗艦級 ★ 十字交乘法全組合與彩色交叉箭頭動畫圖解
     ======================================================================== */
  V['MATH_8_2_4'] = {
    title: '🎨 十字交乘法全組合與彩色交叉箭頭動畫圖解（旗艦實驗室）',
    subtitle: '切換 3 大經典會考題型，點選表格任意組合或按下「逐步動畫檢驗」，直擊同列公因數淘汰與交叉相乘驗算！',
    mount: function (el) {
      var problems = [
        {
          id: 'p1',
          label: '題 1：6x² + 11x + 3（全正）',
          poly: '6x² + 11x + 3',
          a: 6, b: 11, c: 3,
          factorHint: '6 = 1×6、2×3 ｜ 3 = 1×3（原式各項無公因數）',
          combos: [
            { p: 6, r: 1, q: 1, s: 3 },
            { p: 6, r: 3, q: 1, s: 1 },
            { p: 3, r: 3, q: 2, s: 1 },
            { p: 3, r: 1, q: 2, s: 3 }
          ]
        },
        {
          id: 'p2',
          label: '題 2：6x² − 7x − 3（負常數變號）',
          poly: '6x² − 7x − 3',
          a: 6, b: -7, c: -3,
          factorHint: 'c = −3 < 0 → 右欄一正一負！先看數字差，正負相反只要對調符號',
          combos: [
            { p: 6, r: 1, q: 1, s: -3 },
            { p: 6, r: -1, q: 1, s: 3 },
            { p: 6, r: 3, q: 1, s: -1 },
            { p: 3, r: -3, q: 2, s: 1 },
            { p: 3, r: -1, q: 2, s: 3 },
            { p: 3, r: 1, q: 2, s: -3 }
          ]
        },
        {
          id: 'p3',
          label: '題 3：12x² + x − 6（公因數秒殺淘汰）',
          poly: '12x² + x − 6',
          a: 12, b: 1, c: -6,
          factorHint: '12 = 1×12、2×6、3×4 ｜ 6 = 1×6、2×3（利用「同橫列不可有公因數」瞬間刪掉一大半！）',
          combos: [
            { p: 12, r: 2, q: 1, s: -3 },
            { p: 12, r: 1, q: 1, s: -6 },
            { p: 6, r: 3, q: 2, s: -2 },
            { p: 4, r: 2, q: 3, s: -3 },
            { p: 4, r: 1, q: 3, s: -6 },
            { p: 4, r: -3, q: 3, s: 2 },
            { p: 4, r: 3, q: 3, s: -2 }
          ]
        }
      ];

      var pIdx = 0;
      var cIdx = 0;
      var timer = null;

      function stopAnim() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      function evalCombo(prob, cb) {
        var g1 = gcd(cb.p, cb.r);
        var g2 = gcd(cb.q, cb.s);
        var blueProd = cb.p * cb.s;
        var orangeProd = cb.q * cb.r;
        var sum = blueProd + orangeProd;
        var isWin = (sum === prob.b);
        var isFlip = (!isWin && sum === -prob.b);
        var gcdElim = (g1 > 1 || g2 > 1);
        var gcdMsg = '✔ 兩橫列皆互質（可驗算）';
        if (g1 > 1 && g2 > 1) {
          gcdMsg = '🚫 兩橫列皆有公因數 (' + g1 + ' 與 ' + g2 + ')，免算直接淘汰！';
        } else if (g1 > 1) {
          gcdMsg = '🚫 同橫列 (' + fmtCoefX(cb.p, false) + ', ' + fmtSignedTight(cb.r) + ') 有公因數 ' + g1 + '，免算直接淘汰！';
        } else if (g2 > 1) {
          gcdMsg = '🚫 同橫列 (' + fmtCoefX(cb.q, false) + ', ' + fmtSignedTight(cb.s) + ') 有公因數 ' + g2 + '，免算直接淘汰！';
        }
        return {
          g1: g1, g2: g2, gcdElim: gcdElim, gcdMsg: gcdMsg,
          blueProd: blueProd, orangeProd: orangeProd, sum: sum,
          isWin: isWin, isFlip: isFlip
        };
      }

      function render() {
        var prob = problems[pIdx];
        var cb = prob.combos[cIdx];
        var ev = evalCombo(prob, cb);

        var pxStr = fmtCoefX(cb.p, false);
        var qxStr = fmtCoefX(cb.q, false);
        var rStr = fmtSignedTight(cb.r);
        var sStr = fmtSignedTight(cb.s);
        var blueLabel = pxStr + ' × (' + sStr + ') = ' + fmtCoefX(ev.blueProd, true);
        var orangeLabel = qxStr + ' × (' + rStr + ') = ' + fmtCoefX(ev.orangeProd, true);
        var ansStr = fmtBinom(cb.p, cb.r) + fmtBinom(cb.q, cb.s);

        var defs = '<defs>' +
          arrowDef('m824-arr-blue', '#2563eb') +
          arrowDef('m824-arr-orange', '#ea580c') +
          '</defs>';

        var s = defs;

        // Top header bar
        s += pill(14, 10, 224, 28, '多項式：' + prob.poly, '#eff6ff', '#1e40af', '#93c5fd', 14);
        s += pill(248, 10, 378, 28, '正在檢驗：組合 ' + (cIdx + 1) + ' / ' + prob.combos.length + '　（目標一次項：' + fmtCoefX(prob.b, true) + '）',
          ev.isWin ? '#dcfce7' : (ev.gcdElim ? '#fef2f2' : '#f8fafc'),
          ev.isWin ? '#166534' : (ev.gcdElim ? '#991b1b' : '#334155'),
          ev.isWin ? '#22c55e' : (ev.gcdElim ? '#f87171' : '#cbd5e1'), 12.5);

        // Left vertical verification bracket (px * qx = ax²)
        s += '<path d="M 102 82 L 90 82 L 90 174 L 102 174" fill="none" stroke="#64748b" stroke-width="2"/>';
        s += '<text x="84" y="123" text-anchor="end" font-size="11.5" font-weight="700" fill="#475569">直乘驗算</text>';
        s += '<text x="84" y="140" text-anchor="end" font-size="12.5" font-weight="800" fill="#1e40af">' + prob.a + 'x² ✔</text>';

        // Right vertical verification bracket (r * s = c)
        s += '<path d="M 358 82 L 370 82 L 370 174 L 358 174" fill="none" stroke="#64748b" stroke-width="2"/>';
        s += '<text x="376" y="123" font-size="11.5" font-weight="700" fill="#475569">直乘驗算</text>';
        s += '<text x="376" y="140" font-size="12.5" font-weight="800" fill="#0f766e">' + fmtSignedTight(prob.c) + ' ✔</text>';

        // If winning combination -> GREEN HORIZONTAL HIGHLIGHT BOXES around (px + r) and (qx + s)!
        if (ev.isWin) {
          s += '<rect x="108" y="62" width="244" height="40" rx="10" fill="rgba(34,197,94,0.16)" stroke="#16a34a" stroke-width="2.5"/>';
          s += '<rect x="108" y="154" width="244" height="40" rx="10" fill="rgba(34,197,94,0.16)" stroke="#16a34a" stroke-width="2.5"/>';
          s += '<text x="230" y="57" text-anchor="middle" font-size="11" font-weight="800" fill="#15803d">→ 橫著讀上括號：' + esc(fmtBinom(cb.p, cb.r)) + '</text>';
          s += '<text x="230" y="208" text-anchor="middle" font-size="11" font-weight="800" fill="#15803d">→ 橫著讀下括號：' + esc(fmtBinom(cb.q, cb.s)) + '</text>';
        } else if (ev.gcdElim) {
          // Highlight offending GCD row(s) in dashed red
          if (ev.g1 > 1) {
            s += '<rect x="108" y="62" width="244" height="40" rx="10" fill="rgba(239,68,68,0.12)" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="6 3"/>';
          }
          if (ev.g2 > 1) {
            s += '<rect x="108" y="154" width="244" height="40" rx="10" fill="rgba(239,68,68,0.12)" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="6 3"/>';
          }
        }

        // Cross Nodes: Left (px, qx) and Right (r, s)
        s += pill(114, 67, 62, 30, pxStr, '#eff6ff', '#1e3a8a', '#3b82f6', 16);
        s += pill(114, 159, 62, 30, qxStr, '#fff7ed', '#7c2d12', '#f97316', 16);
        s += pill(284, 67, 62, 30, rStr, '#fff7ed', '#7c2d12', '#f97316', 16);
        s += pill(284, 159, 62, 30, sStr, '#eff6ff', '#1e3a8a', '#3b82f6', 16);

        // Colored Diagonal Cross Arrows (Blue: top-left ↘ bottom-right; Orange: bottom-left ↗ top-right)
        s += '<line x1="179" y1="88" x2="278" y2="167" stroke="#2563eb" stroke-width="3.2" marker-end="url(#m824-arr-blue)"/>';
        s += '<line x1="179" y1="168" x2="278" y2="89" stroke="#ea580c" stroke-width="3.2" marker-end="url(#m824-arr-orange)"/>';

        // Floating labels for Blue & Orange diagonal products (well separated above/below intersection)
        s += pill(174, 104, 112, 20, '藍↘ ' + fmtCoefX(ev.blueProd, true), '#dbeafe', '#1d4ed8', '#60a5fa', 11.5);
        s += pill(174, 130, 112, 20, '橘↗ ' + fmtCoefX(ev.orangeProd, true), '#ffedd5', '#c2410c', '#fb923c', 11.5);

        // Right-side Live Cross-Sum Verification Box (x=438..628)
        s += card(434, 48, 194, 166, ev.isWin ? '#f0fdf4' : (ev.gcdElim ? '#fef2f2' : '#f8fafc'),
          ev.isWin ? '#22c55e' : (ev.gcdElim ? '#ef4444' : '#cbd5e1'), 10);
        s += '<text x="531" y="70" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">🧮 交叉相乘即時驗算</text>';
        s += '<text x="446" y="94" font-size="12" font-weight="700" fill="#1d4ed8">藍↘ ' + esc(blueLabel) + '</text>';
        s += '<text x="446" y="114" font-size="12" font-weight="700" fill="#c2410c">橘↗ ' + esc(orangeLabel) + '</text>';
        s += '<line x1="446" y1="124" x2="616" y2="124" stroke="#cbd5e1" stroke-width="1.5"/>';
        s += '<text x="446" y="144" font-size="13.5" font-weight="800" fill="#0f172a">相加 = ' + esc(fmtCoefX(ev.sum, true)) + '</text>';
        s += '<text x="446" y="164" font-size="12.5" font-weight="700" fill="#475569">目標 = ' + esc(fmtCoefX(prob.b, true)) + '</text>';

        if (ev.isWin) {
          s += pill(446, 176, 170, 28, '✅ 命中！完全相等', '#16a34a', '#ffffff', '#15803d', 12.5);
        } else if (ev.gcdElim) {
          s += pill(446, 176, 170, 28, '🚫 公因數直接淘汰', '#dc2626', '#ffffff', '#b91c1c', 12.5);
        } else if (ev.isFlip) {
          s += pill(446, 176, 170, 28, '💡 差負號！右欄變號', '#f59e0b', '#ffffff', '#d97706', 12);
        } else {
          s += pill(446, 176, 170, 28, '❌ 不合（' + fmtCoefX(ev.sum, true) + ' ≠ ' + fmtCoefX(prob.b, true) + '）', '#fee2e2', '#991b1b', '#f87171', 11.5);
        }

        // Bottom caption banner
        if (ev.isWin) {
          s += pill(36, 224, 568, 34, '✔ 交叉檢查對了！橫著讀出答案：' + ansStr, '#16a34a', '#ffffff', '#15803d', 14.5);
        } else if (ev.gcdElim) {
          s += pill(22, 224, 596, 34, ev.gcdMsg, '#fef2f2', '#b91c1c', '#ef4444', 13);
        } else if (ev.isFlip) {
          s += pill(36, 224, 568, 34, '💡 數字對了、只差一個負號！把右欄 (' + rStr + ', ' + sStr + ') 正負號對調就是正解！', '#fef3c7', '#92400e', '#f59e0b', 13);
        } else {
          s += pill(36, 224, 568, 34, '交叉和 ' + fmtCoefX(ev.sum, true) + ' ≠ 目標 ' + fmtCoefX(prob.b, true) + '，請換下一組因數配對！', '#f1f5f9', '#334155', '#cbd5e1', 13);
        }

        // Controls bar
        var controls = '<div class="hb-vis-controls">' +
          problems.map(function (pr, i) {
            return '<button type="button" class="hb-vis-btn' + (i === pIdx ? ' active' : '') + '" data-p="' + i + '">' + esc(pr.label) + '</button>';
          }).join('') +
          '<span style="color:#cbd5e1;">|</span>' +
          '<button type="button" class="hb-vis-btn active" style="background:' + (timer ? '#dc2626' : '#16a34a') + ';border-color:' + (timer ? '#dc2626' : '#16a34a') + ';" data-play="1">' +
          (timer ? '⏸ 暫停動畫' : '▶ 逐步動畫檢驗所有組合') + '</button>' +
          '</div>';

        // Interactive Combination Table (所有組合列舉與篩選表)
        var tableRows = prob.combos.map(function (item, idx) {
          var e = evalCombo(prob, item);
          var rowCls = 'vis-row-clickable';
          if (idx === cIdx) rowCls += ' vis-row-active';
          if (e.isWin) rowCls += ' vis-row-win';
          else if (e.gcdElim) rowCls += ' vis-row-elim';

          var verdict = e.isWin
            ? '✅ 唯一正解：' + fmtBinom(item.p, item.r) + fmtBinom(item.q, item.s)
            : (e.gcdElim ? '🚫 淘汰（不合）' : (e.isFlip ? '❌ 不合（正負相反）' : '❌ 不合'));

          return '<tr class="' + rowCls + '" data-c="' + idx + '">' +
            '<td>組合 ' + (idx + 1) + (idx === cIdx ? ' ◀' : '') + '</td>' +
            '<td><code>(' + esc(fmtCoefX(item.p, false)) + ', ' + esc(fmtSignedTight(item.r)) + ') ／ (' + esc(fmtCoefX(item.q, false)) + ', ' + esc(fmtSignedTight(item.s)) + ')</code></td>' +
            '<td>' + esc(e.gcdMsg) + '</td>' +
            '<td>' + esc(fmtCoefX(e.blueProd, true) + ' ' + fmtCoefX(e.orangeProd, true) + ' = ' + fmtCoefX(e.sum, true)) + '</td>' +
            '<td><strong>' + esc(verdict) + '</strong></td>' +
          '</tr>';
        }).join('');

        var tableHtml =
          '<table class="hb-vis-table">' +
            '<thead><tr>' +
              '<th>組合</th>' +
              '<th>直寫拆法（上列／下列）</th>' +
              '<th>同橫列公因數篩選 (GCD)</th>' +
              '<th>交叉相乘和</th>' +
              '<th>判定結果</th>' +
            '</tr></thead>' +
            '<tbody>' + tableRows + '</tbody>' +
          '</table>';

        var readoutText = '<strong>🎯 本題拆解提示：</strong>' + prob.factorHint + '。' +
          '點擊下方表格任一列即可立即切換十字圖解；記住口訣：「<strong>直著拆、交叉乘、相加對中間、橫著寫答案！</strong>」';

        el.innerHTML = controls + svgWrap(s, 270) +
          '<div class="hb-vis-readout">' + readoutText + '</div>' +
          tableHtml;

        el.querySelectorAll('[data-p]').forEach(function (b) {
          b.addEventListener('click', function () {
            stopAnim();
            pIdx = Number(b.getAttribute('data-p'));
            cIdx = 0;
            render();
          });
        });

        el.querySelectorAll('[data-c]').forEach(function (tr) {
          tr.addEventListener('click', function () {
            stopAnim();
            cIdx = Number(tr.getAttribute('data-c'));
            render();
          });
        });

        var playBtn = el.querySelector('[data-play]');
        if (playBtn) {
          playBtn.addEventListener('click', function () {
            if (timer) { stopAnim(); render(); return; }
            cIdx = 0;
            render();
            timer = setInterval(function () {
              var curProb = problems[pIdx];
              if (cIdx >= curProb.combos.length - 1) {
                stopAnim();
                render();
                return;
              }
              cIdx++;
              render();
            }, 1350);
          });
        }
      }

      render();
      return stopAnim;
    }
  };

  /* ========================================================================
     11. MATH_8_2_5 — 配方法 4 步幾何補角 ＆ 十字道路平移到邊緣
     ======================================================================== */
  V['MATH_8_2_5'] = {
    title: '🎨 配方法 4 步幾何面積補角 ＆ 十字道路平移秒列式',
    subtitle: '用正方形拼圖秒懂「為什麼要加一次項係數一半的平方」，再體驗把花圃十字道路移到邊緣的降維打擊！',
    mount: function (el) {
      var mode = 'square'; // 'square' | 'road'
      var step = 1; // 1..4
      var shifted = false;

      var sqNotes = [
        '第 1 步：解 x² + 6x = 7。左邊面積由一塊正方形 x²（藍）與一塊長方形 6x（橘）組成。',
        '第 2 步：把橘色 6x 對半切開成兩條「3 × x」，分別貼到藍色 x² 的右邊和下邊，這就是為什麼要「÷ 2」！',
        '第 3 步：右下角出現一個 3 × 3 的缺角！左右兩邊同時補上 3² = 9，左邊拼成完整大正方形，右邊變成 7 + 9 = 16！',
        '第 4 步：大正方形面積 (x + 3)² = 16，兩邊開平方根得 x + 3 = ±4 → x = 1 或 x = −7 ✔！'
      ];

      function renderSquare() {
        var s = '';
        s += pill(18, 12, 260, 28, '配方法範例：x² + 6x = 7', '#eff6ff', '#1e40af', '#93c5fd', 13.5);
        s += pill(290, 12, 210, 28, '目前進度：第 ' + step + ' / 4 步', '#f1f5f9', '#334155', '#cbd5e1', 12.5);

        var bx = 66, by = 66, X = 112, H = 48;
        if (step === 1) {
          s += '<rect x="' + bx + '" y="' + by + '" width="' + X + '" height="' + X + '" fill="#dbeafe" stroke="#2563eb" stroke-width="2.2"/>';
          s += '<text x="' + (bx + X / 2) + '" y="' + (by + X / 2 + 6) + '" text-anchor="middle" font-size="18" font-weight="800" fill="#1e40af">x²</text>';
          s += '<rect x="' + (bx + X + 8) + '" y="' + by + '" width="' + (H * 2) + '" height="' + X + '" fill="#ffedd5" stroke="#ea580c" stroke-width="2.2"/>';
          s += '<text x="' + (bx + X + 8 + H) + '" y="' + (by + X / 2 + 6) + '" text-anchor="middle" font-size="17" font-weight="800" fill="#c2410c">6x</text>';
          s += '<text x="' + (bx + X / 2) + '" y="' + (by - 8) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#1e40af">x</text>';
          s += '<text x="' + (bx + X + 8 + H) + '" y="' + (by - 8) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#c2410c">6</text>';
          s += '<text x="' + (bx - 14) + '" y="' + (by + X / 2 + 4) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#334155">x</text>';
        } else {
          // x^2 + right 3x + bottom 3x
          s += '<rect x="' + bx + '" y="' + by + '" width="' + X + '" height="' + X + '" fill="#dbeafe" stroke="#2563eb" stroke-width="2.2"/>';
          s += '<text x="' + (bx + X / 2) + '" y="' + (by + X / 2 + 6) + '" text-anchor="middle" font-size="18" font-weight="800" fill="#1e40af">x²</text>';
          s += '<rect x="' + (bx + X) + '" y="' + by + '" width="' + H + '" height="' + X + '" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/>';
          s += '<text x="' + (bx + X + H / 2) + '" y="' + (by + X / 2 + 5) + '" text-anchor="middle" font-size="14" font-weight="800" fill="#c2410c">3x</text>';
          s += '<rect x="' + bx + '" y="' + (by + X) + '" width="' + X + '" height="' + H + '" fill="#ffedd5" stroke="#ea580c" stroke-width="2"/>';
          s += '<text x="' + (bx + X / 2) + '" y="' + (by + X + H / 2 + 5) + '" text-anchor="middle" font-size="14" font-weight="800" fill="#c2410c">3x</text>';

          if (step === 2) {
            s += '<rect x="' + (bx + X) + '" y="' + (by + X) + '" width="' + H + '" height="' + H + '" fill="#f8fafc" stroke="#dc2626" stroke-width="2" stroke-dasharray="5 3"/>';
            s += '<text x="' + (bx + X + H / 2) + '" y="' + (by + X + H / 2 + 4) + '" text-anchor="middle" font-size="11.5" font-weight="800" fill="#dc2626">缺 3×3</text>';
          } else {
            s += '<rect x="' + (bx + X) + '" y="' + (by + X) + '" width="' + H + '" height="' + H + '" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/>';
            s += '<text x="' + (bx + X + H / 2) + '" y="' + (by + X + H / 2 + 5) + '" text-anchor="middle" font-size="13.5" font-weight="800" fill="#15803d">3²=9</text>';
          }
          if (step === 4) {
            s += '<rect x="' + (bx - 4) + '" y="' + (by - 4) + '" width="' + (X + H + 8) + '" height="' + (X + H + 8) + '" rx="6" fill="none" stroke="#16a34a" stroke-width="3"/>';
          }
          s += '<text x="' + (bx + X / 2) + '" y="' + (by - 9) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#1e40af">x</text>';
          s += '<text x="' + (bx + X + H / 2) + '" y="' + (by - 9) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#c2410c">3</text>';
          s += '<text x="' + (bx - 14) + '" y="' + (by + X / 2 + 4) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#1e40af">x</text>';
          s += '<text x="' + (bx - 14) + '" y="' + (by + X + H / 2 + 4) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#c2410c">3</text>';
        }

        // Right algebraic trace box
        s += card(312, 58, 308, 186, '#f8fafc', '#cbd5e1', 10);
        s += '<text x="330" y="84" font-size="13.5" font-weight="800" fill="#0f172a">📐 代數同步推導</text>';
        s += '<text x="330" y="112" font-size="14" font-weight="' + (step === 1 ? '800' : '600') + '" fill="' + (step === 1 ? '#1d4ed8' : '#475569') + '">① x² + 6x = 7</text>';
        if (step >= 2) s += '<text x="330" y="138" font-size="14" font-weight="' + (step === 2 ? '800' : '600') + '" fill="' + (step === 2 ? '#c2410c' : '#475569') + '">② x² + 2·(3)x = 7　（一半是 3）</text>';
        if (step >= 3) s += '<text x="330" y="164" font-size="14" font-weight="' + (step === 3 ? '800' : '600') + '" fill="' + (step === 3 ? '#15803d' : '#475569') + '">③ x² + 6x + 3² = 7 + 9 = 16</text>';
        if (step >= 4) {
          s += pill(328, 182, 276, 46, '✅ (x + 3)² = 16 → x = 1 或 −7', '#dcfce7', '#166534', '#22c55e', 14);
        }
        return s;
      }

      function renderRoad() {
        var s = '';
        s += pill(18, 12, 340, 28, '應用題：20m × 12m 花圃開闢寬 x 公尺十字道路', '#f0fdf4', '#166534', '#4ade80', 13);

        var gx = 46, gy = 62, gw = 240, gh = 144, rw = 28;
        if (!shifted) {
          // Lawn background
          s += '<rect x="' + gx + '" y="' + gy + '" width="' + gw + '" height="' + gh + '" fill="#86efac" stroke="#15803d" stroke-width="2.2"/>';
          // Cross roads in the middle
          s += '<rect x="' + (gx + 104) + '" y="' + gy + '" width="' + rw + '" height="' + gh + '" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>';
          s += '<rect x="' + gx + '" y="' + (gy + 58) + '" width="' + gw + '" height="' + rw + '" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>';
          // Overlap intersection
          s += '<rect x="' + (gx + 104) + '" y="' + (gy + 58) + '" width="' + rw + '" height="' + rw + '" fill="#fca5a5" stroke="#dc2626" stroke-width="1.8"/>';
          s += '<text x="' + (gx + 118) + '" y="' + (gy + 76) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#991b1b">x²</text>';
          s += '<text x="' + (gx + gw / 2) + '" y="' + (gy - 8) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0f172a">全長 20 m（路寬 x）</text>';
          s += '<text x="' + (gx - 18) + '" y="' + (gy + gh / 2 + 4) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#0f172a">12m</text>';

          s += card(316, 62, 304, 152, '#fff7ed', '#fb923c', 10);
          s += '<text x="334" y="92" font-size="14" font-weight="800" fill="#9a3412">😰 傳統硬扣法容易漏掉重疊 x²：</text>';
          s += '<text x="334" y="122" font-size="13" fill="#334155">剩下草地 = 20×12 − 20x − 12x + x²</text>';
          s += '<text x="334" y="148" font-size="13" fill="#dc2626" font-weight="700">（很多人忘記加回中間交叉的 +x²！）</text>';
          s += pill(334, 168, 268, 30, '👆 按上方「平移道路到邊緣」秒解！', '#eff6ff', '#1d4ed8', '#60a5fa', 12.5);
        } else {
          // Road shifted to right edge and bottom edge!
          s += '<rect x="' + gx + '" y="' + gy + '" width="' + gw + '" height="' + gh + '" fill="#e2e8f0" stroke="#64748b" stroke-width="2"/>';
          s += '<rect x="' + gx + '" y="' + gy + '" width="' + (gw - rw) + '" height="' + (gh - rw) + '" fill="#86efac" stroke="#15803d" stroke-width="2.5"/>';
          s += '<text x="' + (gx + (gw - rw) / 2) + '" y="' + (gy + (gh - rw) / 2 + 5) + '" text-anchor="middle" font-size="15" font-weight="800" fill="#14532d">完整大草地 (20−x)(12−x)</text>';
          s += '<text x="' + (gx + (gw - rw) / 2) + '" y="' + (gy - 8) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#15803d">20 − x</text>';
          s += '<text x="' + (gx + gw - rw / 2) + '" y="' + (gy - 8) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#64748b">x</text>';
          s += '<text x="' + (gx - 20) + '" y="' + (gy + (gh - rw) / 2 + 4) + '" text-anchor="middle" font-size="11.5" font-weight="800" fill="#15803d">12−x</text>';
          s += '<text x="' + (gx - 14) + '" y="' + (gy + gh - rw / 2 + 4) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#64748b">x</text>';

          s += card(316, 62, 304, 152, '#f0fdf4', '#22c55e', 10);
          s += '<text x="334" y="92" font-size="14" font-weight="800" fill="#166534">✨ 平移到邊緣：四塊草地秒合為一！</text>';
          s += '<text x="334" y="124" font-size="14" font-weight="800" fill="#0f172a">草地面積 = (20 − x)(12 − x)</text>';
          s += '<text x="334" y="152" font-size="12.5" fill="#334155">不用擔心重複扣減，直接列方程式！</text>';
          s += '<text x="334" y="180" font-size="12.5" font-weight="700" fill="#dc2626">⚠️ 記得驗根：道路寬度必滿足 0 < x < 12</text>';
        }
        return s;
      }

      function render() {
        var controls = '<div class="hb-vis-controls">' +
          '<button type="button" class="hb-vis-btn' + (mode === 'square' ? ' active' : '') + '" data-m="square">🟦 配方法 4 步面積補角</button>' +
          '<button type="button" class="hb-vis-btn' + (mode === 'road' ? ' active' : '') + '" data-m="road">🛣 十字道路平移法</button>' +
          '<span style="color:#cbd5e1;">|</span>';

        if (mode === 'square') {
          controls += [1, 2, 3, 4].map(function (st) {
            return '<button type="button" class="hb-vis-btn' + (st === step ? ' active' : '') + '" data-s="' + st + '">第 ' + st + ' 步</button>';
          }).join('');
        } else {
          controls += '<button type="button" class="hb-vis-btn active" style="background:#16a34a;border-color:#16a34a;" data-sh="1">' +
            (shifted ? '↩ 還原十字道路' : '✨ 平移道路到邊緣！') + '</button>';
        }
        controls += '</div>';

        var readout = mode === 'square'
          ? '<strong>配方法核心：</strong>' + sqNotes[step - 1]
          : (shifted
            ? '<strong>✅ 平移大招完成：</strong>不管原本開幾條路，只要全部平行推到花圃邊緣，剩餘草地就自動合成一塊完整的 (長 − 路寬) × (寬 − 路寬) 長方形！'
            : '<strong>💡 動手試試：</strong>點擊綠色按鈕，把中間的十字道路平移到最右側和最底側！');

        el.innerHTML = controls + svgWrap(mode === 'square' ? renderSquare() : renderRoad(), 262) +
          '<div class="hb-vis-readout">' + readout + '</div>';

        el.querySelectorAll('[data-m]').forEach(function (b) {
          b.addEventListener('click', function () { mode = b.getAttribute('data-m'); render(); });
        });
        el.querySelectorAll('[data-s]').forEach(function (b) {
          b.addEventListener('click', function () { step = Number(b.getAttribute('data-s')); render(); });
        });
        var shb = el.querySelector('[data-sh]');
        if (shb) shb.addEventListener('click', function () { shifted = !shifted; render(); });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     12. MATH_8_2_6 — 三角形全等條件鎖定驗證（5大定理 ✅ vs SSA 擺動反例 ❌）
     ======================================================================== */
  V['MATH_8_2_6'] = {
    title: '🎨 三角形全等條件鎖定驗證（SSS/SAS/ASA/AAS/RHS ✅ vs SSA 圓規反例 ❌）',
    subtitle: '切換 5 大全等性質與考場最愛考的「SSA 反例」，親眼看圓規弧如何切出兩個完全不同的三角形！',
    mount: function (el) {
      var tab = 'SSA'; // default to SSA or SSS? Let's start with SSS and let SSA shine! Actually SSS first is intuitive.
      tab = 'SSS';
      var ssaBranch = 0; // 0: both, 1: C1 (acute), 2: C2 (obtuse)

      var info = {
        SSS: { ok: true, title: 'SSS 全等（三邊對應相等）', desc: '三條邊長固定後，三角形剛性結構完全鎖死（就像屋頂鐵架），只能畫出唯一一種形狀！' },
        SAS: { ok: true, title: 'SAS 全等（兩邊及其「夾角」相等）', desc: '兩條邊與它們中間夾的角度固定，第三邊的兩個端點位置唯一確定，必全等！' },
        ASA: { ok: true, title: 'ASA 全等（兩角及其「夾邊」相等）', desc: '底邊固定，兩端射線的角度固定，兩條射線延伸必交於唯一頂點，必全等！' },
        AAS: { ok: true, title: 'AAS 全等（兩角及一「非夾邊」相等）', desc: '三角形內角和恆 180°，知道兩角就自動知道第三角，瞬間轉化為 ASA，必全等！' },
        RHS: { ok: true, title: 'RHS 全等（直角△的斜邊與一股相等）', desc: '專屬於直角三角形（∠C = 90°）！由畢氏定理可知另一股唯一確定，轉化為 SSS，必全等！' },
        SSA: { ok: false, title: '❌ SSA 不能保證全等（會考第一大陷阱！）', desc: '固定 ∠A、AB 與對邊 BC，以 B 為圓心、BC 為半徑畫弧，圓弧會與射線交出「兩個不同點 C₁（銳角△）與 C₂（鈍角△）」！兩三角形條件完全一樣卻不全等！' }
      };

      function render() {
        var cur = info[tab];
        var s = '';
        s += pill(18, 12, 380, 28, cur.title, cur.ok ? '#dcfce7' : '#fef2f2', cur.ok ? '#166534' : '#991b1b', cur.ok ? '#22c55e' : '#ef4444', 13);

        if (tab !== 'SSA') {
          // Standard clean triangle drawing
          var A = [100, 218], B = [310, 218], C = tab === 'RHS' ? [100, 78] : [182, 74];
          // Fill
          s += '<polygon points="' + A[0] + ',' + A[1] + ' ' + B[0] + ',' + B[1] + ' ' + C[0] + ',' + C[1] + '" fill="#eff6ff" stroke="#cbd5e1" stroke-width="2"/>';

          var hiAB = (tab === 'SSS' || tab === 'SAS' || tab === 'ASA');
          var hiAC = (tab === 'SSS' || tab === 'SAS' || tab === 'AAS' || tab === 'RHS');
          var hiBC = (tab === 'SSS' || tab === 'RHS');
          var hiAngA = (tab === 'SAS' || tab === 'ASA' || tab === 'AAS' || tab === 'RHS');
          var hiAngB = (tab === 'ASA' || tab === 'AAS');

          // Edges
          s += '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + B[0] + '" y2="' + B[1] + '" stroke="' + (hiAB ? '#2563eb' : '#94a3b8') + '" stroke-width="' + (hiAB ? 4 : 2) + '"/>';
          s += '<line x1="' + A[0] + '" y1="' + A[1] + '" x2="' + C[0] + '" y2="' + C[1] + '" stroke="' + (hiAC ? '#16a34a' : '#94a3b8') + '" stroke-width="' + (hiAC ? 4 : 2) + '"/>';
          s += '<line x1="' + B[0] + '" y1="' + B[1] + '" x2="' + C[0] + '" y2="' + C[1] + '" stroke="' + (hiBC ? '#7c3aed' : '#94a3b8') + '" stroke-width="' + (hiBC ? 4 : 2) + '"/>';

          // Angle marks
          if (tab === 'RHS') {
            s += '<polyline points="' + (A[0] + 18) + ',' + A[1] + ' ' + (A[0] + 18) + ',' + (A[1] - 18) + ' ' + A[0] + ',' + (A[1] - 18) + '" fill="none" stroke="#ea580c" stroke-width="3"/>';
            s += '<text x="' + (A[0] + 24) + '" y="' + (A[1] - 20) + '" font-size="12" font-weight="800" fill="#c2410c">R (90°)</text>';
            s += '<text x="' + ((B[0] + C[0]) / 2 + 14) + '" y="' + ((B[1] + C[1]) / 2 - 4) + '" font-size="13" font-weight="800" fill="#6d28d9">H（斜邊）</text>';
            s += '<text x="' + (A[0] - 24) + '" y="' + ((A[1] + C[1]) / 2) + '" font-size="13" font-weight="800" fill="#15803d">S（一股）</text>';
          } else {
            if (hiAngA) {
              s += '<path d="M ' + (A[0] + 32) + ' ' + A[1] + ' A 32 32 0 0 0 ' + (A[0] + 16) + ' ' + (A[1] - 28) + '" fill="rgba(234,88,12,0.22)" stroke="#ea580c" stroke-width="2.5"/>';
              s += '<text x="' + (A[0] + 38) + '" y="' + (A[1] - 14) + '" font-size="12" font-weight="800" fill="#c2410c">已知角</text>';
            }
            if (hiAngB) {
              s += '<path d="M ' + (B[0] - 32) + ' ' + B[1] + ' A 32 32 0 0 1 ' + (B[0] - 21) + ' ' + (B[1] - 24) + '" fill="rgba(234,88,12,0.22)" stroke="#ea580c" stroke-width="2.5"/>';
              s += '<text x="' + (B[0] - 72) + '" y="' + (B[1] - 14) + '" font-size="12" font-weight="800" fill="#c2410c">已知角</text>';
            }
            if (hiAB) s += '<text x="' + ((A[0] + B[0]) / 2) + '" y="' + (A[1] + 20) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#1d4ed8">已知邊 S</text>';
            if (hiAC) s += '<text x="' + ((A[0] + C[0]) / 2 - 34) + '" y="' + ((A[1] + C[1]) / 2) + '" font-size="12.5" font-weight="800" fill="#15803d">已知邊 S</text>';
            if (hiBC) s += '<text x="' + ((B[0] + C[0]) / 2 + 12) + '" y="' + ((B[1] + C[1]) / 2) + '" font-size="12.5" font-weight="800" fill="#6d28d9">已知邊 S</text>';
          }

          // Vertices
          s += '<text x="' + (A[0] - 14) + '" y="' + (A[1] + 8) + '" font-size="14" font-weight="800" fill="#0f172a">A</text>';
          s += '<text x="' + (B[0] + 10) + '" y="' + (B[1] + 8) + '" font-size="14" font-weight="800" fill="#0f172a">B</text>';
          s += '<text x="' + (C[0] - 5) + '" y="' + (C[1] - 10) + '" font-size="14" font-weight="800" fill="#0f172a">C</text>';

          // Right summary box
          s += card(365, 60, 254, 178, '#f0fdf4', '#22c55e', 10);
          s += '<text x="382" y="90" font-size="15" font-weight="800" fill="#166534">🔒 幾何唯一鎖定：✅ 必全等</text>';
          s += '<text x="382" y="122" font-size="13" fill="#334155">已知條件：</text>';
          var condMap = {
            SSS: '三邊相等（AB、AC、BC）',
            SAS: '兩邊 AB、AC ＋ 中間夾角 ∠A',
            ASA: '兩角 ∠A、∠B ＋ 中間夾邊 AB',
            AAS: '兩角 ∠A、∠B ＋ 非夾邊 AC',
            RHS: '直角 ∠A=90° ＋ 斜邊 BC ＋ 股 AC'
          };
          s += '<text x="382" y="146" font-size="13" font-weight="800" fill="#0f172a">' + condMap[tab] + '</text>';
          s += pill(382, 176, 220, 40, '⚠️ 記住口訣：只有 AAA 和 SSA 不行！', '#fef3c7', '#92400e', '#f59e0b', 12);
        } else {
          // SSA Swinging Compass Arc Counterexample!
          // A = (60, 215), angle A = 34 deg, AB = 190 -> B = (60 + 190*cos34, 215 - 190*sin34) = (217.5, 108.8)
          // Radius r = BC = 122 (> B.y distance to ray = 106.2, < AB = 190) -> 2 intersections on y = 215!
          // dx = sqrt(122^2 - 106.2^2) = sqrt(14884 - 11278.4) = sqrt(3605.6) ≈ 60.0
          // C2 (obtuse) = (217.5 - 60, 215) = (157.5, 215)
          // C1 (acute)  = (217.5 + 60, 215) = (277.5, 215)
          var Ax = 60, Ay = 215, Bx = 218, By = 109, C2x = 158, C1x = 278;

          // Base ray from A
          s += '<line x1="60" y1="215" x2="352" y2="215" stroke="#94a3b8" stroke-width="2" stroke-dasharray="6 4"/>';
          s += '<text x="352" y="232" text-anchor="end" font-size="11" fill="#64748b">射線 AC（底邊未固定）</text>';

          // Shaded triangles depending on ssaBranch
          if (ssaBranch === 0 || ssaBranch === 1) {
            s += '<polygon points="60,215 218,109 278,215" fill="rgba(37,99,235,0.12)" stroke="none"/>';
          }
          if (ssaBranch === 0 || ssaBranch === 2) {
            s += '<polygon points="60,215 218,109 158,215" fill="rgba(234,88,12,0.18)" stroke="none"/>';
          }

          // Compass arc centered at B(218,109), r=122 passing through C2(158,215) and C1(278,215)
          s += '<path d="M 134 198 A 122 122 0 0 0 302 198" fill="none" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="5 4"/>';
          s += '<text x="218" y="246" text-anchor="middle" font-size="11.5" font-weight="800" fill="#dc2626">🧭 以 B 為圓心畫弧（半徑相同！）</text>';

          // Fixed side AB (blue) & fixed angle A
          s += '<line x1="60" y1="215" x2="218" y2="109" stroke="#2563eb" stroke-width="4"/>';
          s += '<text x="122" y="150" font-size="12.5" font-weight="800" fill="#1d4ed8">固定邊 AB</text>';
          s += '<path d="M 96 215 A 36 36 0 0 0 90 195" fill="rgba(22,163,74,0.22)" stroke="#16a34a" stroke-width="2.5"/>';
          s += '<text x="100" y="205" font-size="11.5" font-weight="800" fill="#15803d">固定 ∠A</text>';

          // Two swinging radii BC1 & BC2
          s += '<line x1="218" y1="109" x2="278" y2="215" stroke="#2563eb" stroke-width="' + (ssaBranch === 2 ? 1.5 : 3.5) + '" stroke-dasharray="' + (ssaBranch === 2 ? '4 3' : 'none') + '"/>';
          s += '<line x1="218" y1="109" x2="158" y2="215" stroke="#ea580c" stroke-width="' + (ssaBranch === 1 ? 1.5 : 3.5) + '" stroke-dasharray="' + (ssaBranch === 1 ? '4 3' : 'none') + '"/>';

          // Points
          s += '<circle cx="218" cy="109" r="5.5" fill="#dc2626"/>';
          s += '<text x="224" y="102" font-size="13.5" font-weight="800" fill="#0f172a">B（圓心）</text>';
          s += '<circle cx="158" cy="215" r="6" fill="#ea580c" stroke="#fff" stroke-width="1.5"/>';
          s += '<text x="158" y="232" text-anchor="middle" font-size="12.5" font-weight="800" fill="#c2410c">C₂（鈍角）</text>';
          s += '<circle cx="278" cy="215" r="6" fill="#2563eb" stroke="#fff" stroke-width="1.5"/>';
          s += '<text x="278" y="232" text-anchor="middle" font-size="12.5" font-weight="800" fill="#1d4ed8">C₁（銳角）</text>';
          s += '<text x="48" y="220" font-size="13.5" font-weight="800" fill="#0f172a">A</text>';

          // Right explanation card
          s += card(374, 52, 248, 198, '#fef2f2', '#ef4444', 10);
          s += '<text x="390" y="78" font-size="14" font-weight="800" fill="#991b1b">🚫 為什麼 SSA 失敗？</text>';
          s += '<text x="390" y="104" font-size="12.5" fill="#334155">△ABC₁ 與 △ABC₂ 同時滿足：</text>';
          s += '<text x="394" y="126" font-size="12.5" font-weight="700" fill="#0f172a">① 邊 AB 相等</text>';
          s += '<text x="394" y="146" font-size="12.5" font-weight="700" fill="#0f172a">② 邊 BC₁ = BC₂（同圓半徑）</text>';
          s += '<text x="394" y="166" font-size="12.5" font-weight="700" fill="#0f172a">③ 角 ∠A 相等（非夾角！）</text>';
          s += pill(388, 184, 220, 50, '卻一個是銳角△、一個是鈍角△！\n面積形狀皆不同 → 不一定全等', '#fee2e2', '#991b1b', '#f87171', 11.5);
        }

        var keys = ['SSS', 'SAS', 'ASA', 'AAS', 'RHS', 'SSA'];
        var controls = '<div class="hb-vis-controls">' +
          keys.map(function (k) {
            var isErr = k === 'SSA';
            return '<button type="button" class="hb-vis-btn' + (tab === k ? ' active' : '') + '" data-k="' + k + '">' +
              k + (isErr ? ' ❌ 反例' : ' ✅') + '</button>';
          }).join('');

        if (tab === 'SSA') {
          controls += '<span style="color:#cbd5e1;">|</span>' +
            '<button type="button" class="hb-vis-btn" data-br="1">🔄 切換觀察：' +
            (ssaBranch === 0 ? '同時顯示兩解' : (ssaBranch === 1 ? '只看 △ABC₁（銳角）' : '只看 △ABC₂（鈍角）')) + '</button>';
        }
        controls += '</div>';

        el.innerHTML = controls + svgWrap(s, 266) +
          '<div class="hb-vis-readout"><strong>💡 判定解析：</strong>' + esc(cur.desc) + '</div>';

        el.querySelectorAll('[data-k]').forEach(function (b) {
          b.addEventListener('click', function () { tab = b.getAttribute('data-k'); render(); });
        });
        var brb = el.querySelector('[data-br]');
        if (brb) brb.addEventListener('click', function () { ssaBranch = (ssaBranch + 1) % 3; render(); });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     13. MATH_8_2_7 — 等差級數「倒扣階梯拼長方形」面積證明動畫
     ======================================================================== */
  V['MATH_8_2_7'] = {
    title: '🎨 等差級數「倒扣階梯拼長方形」公式視覺證明',
    subtitle: '點擊「倒扣拼成長方形」，把梯形階梯 Sₙ = 2 + 4 + 6 + 8 + 10 複製倒轉 180° 密合，一秒推出梯形求和公式！',
    mount: function (el) {
      var step = 1; // 1: stairs, 2: floating inverted, 3: snapped rectangle, 4: divide by 2
      var vals = [2, 4, 6, 8, 10];
      var notes = [
        '第 1 步：把等差級數 S₅ = 2 + 4 + 6 + 8 + 10 畫成 5 根藍色柱狀階梯（首項 a₁ = 2，末項 a₅ = 10，項數 n = 5）。',
        '第 2 步：把一模一樣的階梯複製一份（橘色），旋轉 180° 倒過來準備蓋上去！',
        '第 3 步：完美密合！每一行的總高度全部都是 2+10 = 4+8 = 6+6 = 12（首項＋末項），形成寬 n=5、高 (a₁+aₙ)=12 的大長方形！',
        '第 4 步：大長方形總面積 2Sₙ = (a₁ + aₙ) × n = 12 × 5 = 60，因為用了兩份階梯，除以 2 得 Sₙ = (a₁ + aₙ)n / 2 = 30 ✔！'
      ];

      function render() {
        var defs = '<defs>' + arrowDef('m827-arr', '#ea580c') + '</defs>';
        var s = defs;
        s += pill(18, 12, 280, 28, '等差級數：S₅ = 2 + 4 + 6 + 8 + 10', '#eff6ff', '#1e40af', '#93c5fd', 13.5);

        var x0 = 76, baseY = 228, colW = 48, unitH = 12; // max height 12*12 = 144 -> top y=84

        // Draw original blue staircase
        vals.forEach(function (v, i) {
          var h = v * unitH;
          var x = x0 + i * colW;
          var y = baseY - h;
          s += '<rect x="' + x + '" y="' + y + '" width="' + (colW - 2) + '" height="' + h + '" rx="3" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>';
          s += '<text x="' + (x + colW / 2 - 1) + '" y="' + (baseY - 7) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#1e40af">' + v + '</text>';
        });

        // Draw inverted orange staircase
        if (step >= 2) {
          var lift = step === 2 ? 22 : 0;
          var topY = baseY - 12 * unitH - lift;
          vals.forEach(function (v, i) {
            var invV = vals[vals.length - 1 - i]; // 10, 8, 6, 4, 2
            var h = invV * unitH;
            var x = x0 + i * colW;
            s += '<rect x="' + x + '" y="' + topY + '" width="' + (colW - 2) + '" height="' + h + '" rx="3" fill="rgba(251,146,60,0.28)" stroke="#ea580c" stroke-width="2" ' + (step === 2 ? 'stroke-dasharray="5 3"' : '') + '/>';
            s += '<text x="' + (x + colW / 2 - 1) + '" y="' + (topY + 16) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#c2410c">' + invV + '</text>';
          });
          if (step === 2) {
            s += '<path d="M 332 104 Q 350 78 324 72" fill="none" stroke="#ea580c" stroke-width="2.5" marker-end="url(#m827-arr)"/>';
            s += '<text x="336" y="122" font-size="11.5" font-weight="800" fill="#c2410c">旋轉 180° 倒扣</text>';
          }
        }

        // Outer dimension brackets for step 3 & 4
        if (step >= 3) {
          var rectTop = baseY - 12 * unitH;
          s += '<rect x="' + (x0 - 2) + '" y="' + (rectTop - 2) + '" width="' + (colW * 5 + 2) + '" height="' + (12 * unitH + 4) + '" rx="5" fill="none" stroke="#16a34a" stroke-width="3"/>';
          // Height label on left
          s += '<line x1="58" y1="' + rectTop + '" x2="58" y2="' + baseY + '" stroke="#16a34a" stroke-width="2.2"/>';
          s += '<text x="52" y="' + ((rectTop + baseY) / 2 - 6) + '" text-anchor="end" font-size="12" font-weight="800" fill="#15803d">高 =</text>';
          s += '<text x="52" y="' + ((rectTop + baseY) / 2 + 10) + '" text-anchor="end" font-size="12" font-weight="800" fill="#15803d">a₁+aₙ</text>';
          s += '<text x="52" y="' + ((rectTop + baseY) / 2 + 26) + '" text-anchor="end" font-size="12" font-weight="800" fill="#15803d">= 12</text>';
          // Width label at bottom
          s += '<text x="' + (x0 + colW * 2.5) + '" y="248" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a">寬（項數）n = 5</text>';
        } else {
          s += '<text x="' + (x0 + colW * 2.5) + '" y="248" text-anchor="middle" font-size="12.5" font-weight="700" fill="#475569">共 n = 5 項（公差 d = 2）</text>';
        }

        // Right formula card
        s += card(358, 52, 266, 186, step === 4 ? '#f0fdf4' : '#f8fafc', step === 4 ? '#22c55e' : '#cbd5e1', 10);
        s += '<text x="376" y="78" font-size="14" font-weight="800" fill="#0f172a">📐 面積推導等差級數公式</text>';
        s += '<text x="376" y="108" font-size="13" font-weight="700" fill="#1d4ed8">藍階梯：S₅ = 2 + 4 + 6 + 8 + 10</text>';
        if (step >= 2) s += '<text x="376" y="132" font-size="13" font-weight="700" fill="#c2410c">橘階梯：S₅ = 10 + 8 + 6 + 4 + 2</text>';
        if (step >= 3) s += '<text x="376" y="158" font-size="13.5" font-weight="800" fill="#0f172a">相加 2S₅ = (2 + 10) × 5 = 60</text>';
        if (step === 4) {
          s += pill(374, 178, 234, 44, '✅ Sₙ = (a₁ + aₙ) × n ÷ 2 = 30', '#16a34a', '#ffffff', '#15803d', 14);
        }

        var controls = '<div class="hb-vis-controls">' +
          '<button type="button" class="hb-vis-btn' + (step === 1 ? ' active' : '') + '" data-s="1">① 原始階梯</button>' +
          '<button type="button" class="hb-vis-btn' + (step === 2 ? ' active' : '') + '" data-s="2">② 複製倒轉 180°</button>' +
          '<button type="button" class="hb-vis-btn' + (step === 3 ? ' active' : '') + '" data-s="3">③ 倒扣拼成長方形</button>' +
          '<button type="button" class="hb-vis-btn' + (step === 4 ? ' active' : '') + '" data-s="4">④ 除以 2 得公式</button>' +
          '</div>';

        el.innerHTML = controls + svgWrap(s, 264) +
          '<div class="hb-vis-readout"><strong>💡 證明步驟：</strong>' + esc(notes[step - 1]) + '</div>';

        el.querySelectorAll('[data-s]').forEach(function (b) {
          b.addEventListener('click', function () { step = Number(b.getAttribute('data-s')); render(); });
        });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     14. MATH_9_3_1 — 相似三角形四大必考模型切換器
     ======================================================================== */
  V['MATH_9_3_1'] = {
    title: '🎨 相似三角形四大必考模型（A字型／8字型／母子直角／30-45-60）',
    subtitle: '切換四大會考高頻相似模型，對應邊已用相同顏色配對標註，一眼避開「局部比誤當全邊比」陷阱！',
    mount: function (el) {
      var tab = 'A'; // 'A' | '8' | 'mother' | 'trig'

      function render() {
        var s = '';
        var readout = '';

        if (tab === 'A') {
          s += pill(18, 12, 290, 28, '模型 ①：A 字型相似（DE ∥ BC）', '#eff6ff', '#1e40af', '#93c5fd', 13.5);
          // Triangle A(175,54), B(60,232), C(290,232); D on AB at t=0.45 -> (123,134), E on AC -> (227,134)
          s += '<polygon points="175,54 60,232 290,232" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>';
          s += '<polygon points="175,54 123,134 227,134" fill="rgba(37,99,235,0.12)" stroke="none"/>';
          // Color-coded corresponding sides
          s += '<line x1="175" y1="54" x2="60" y2="232" stroke="#2563eb" stroke-width="3"/>';
          s += '<line x1="175" y1="54" x2="123" y2="134" stroke="#1d4ed8" stroke-width="5"/>';
          s += '<line x1="175" y1="54" x2="290" y2="232" stroke="#16a34a" stroke-width="3"/>';
          s += '<line x1="175" y1="54" x2="227" y2="134" stroke="#15803d" stroke-width="5"/>';
          s += '<line x1="123" y1="134" x2="227" y2="134" stroke="#ea580c" stroke-width="4"/>';
          s += '<line x1="60" y1="232" x2="290" y2="232" stroke="#ea580c" stroke-width="4"/>';
          // Parallel arrows
          s += '<text x="175" y="130" text-anchor="middle" font-size="11.5" font-weight="800" fill="#c2410c">DE (∥)</text>';
          s += '<text x="175" y="226" text-anchor="middle" font-size="11.5" font-weight="800" fill="#c2410c">BC (∥)</text>';
          // Vertices
          s += '<text x="175" y="46" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a">A</text>';
          s += '<text x="48" y="240" font-size="14" font-weight="800" fill="#0f172a">B</text>';
          s += '<text x="296" y="240" font-size="14" font-weight="800" fill="#0f172a">C</text>';
          s += '<text x="108" y="138" font-size="13.5" font-weight="800" fill="#1d4ed8">D</text>';
          s += '<text x="234" y="138" font-size="13.5" font-weight="800" fill="#15803d">E</text>';

          s += card(332, 52, 290, 198, '#f8fafc', '#cbd5e1', 10);
          s += '<text x="348" y="78" font-size="14" font-weight="800" fill="#0f172a">📐 △ADE ~ △ABC（AA 相似）</text>';
          s += '<text x="348" y="108" font-size="13.5" font-weight="800" fill="#1d4ed8">① 全長比（求底邊必用！）：</text>';
          s += '<text x="358" y="130" font-size="14" font-weight="800" fill="#c2410c">DE : BC = AD : AB = AE : AC</text>';
          s += '<text x="348" y="160" font-size="13" font-weight="700" fill="#334155">② 側邊截線段比（不可配底邊！）：</text>';
          s += '<text x="358" y="180" font-size="13.5" font-weight="700" fill="#15803d">AD : DB = AE : EC</text>';
          s += pill(346, 198, 262, 38, '⚠️ 陷阱：DE : BC ≠ AD : DB！一定要用 AD : AB！', '#fef2f2', '#b91c1c', '#f87171', 11.5);
          readout = '<strong>A 字型核心規則：</strong>只要涉及兩條平行底邊 DE 與 BC 的比例，必須用「小三角形邊 AD : 大三角形全邊 AB」，千萬不能用上段 AD 比下段 DB！';
        } else if (tab === '8') {
          s += pill(18, 12, 290, 28, '模型 ②：8 字型相似（AB ∥ CD）', '#fff7ed', '#9a3412', '#fdba74', 13.5);
          // A(80,68), B(236,68), O(172,140), D(286,230), C(110,230) -> check collinearity:
          // A=(84,68), D=(274,230) -> mid O at t=0.45: (84+85.5, 68+72.9) = (170,141)
          // B=(234,68) -> line BO through (170,141): dx=-64, dy=73 -> at y=230: t=(230-68)/73=2.219 -> C=(234-142,230)=(92,230)
          s += '<polygon points="84,68 234,68 170,141" fill="rgba(37,99,235,0.12)"/>';
          s += '<polygon points="170,141 274,230 92,230" fill="rgba(234,88,12,0.12)"/>';
          // Top & bottom parallel (orange)
          s += '<line x1="84" y1="68" x2="234" y2="68" stroke="#ea580c" stroke-width="4"/>';
          s += '<line x1="92" y1="230" x2="274" y2="230" stroke="#ea580c" stroke-width="4"/>';
          // Diagonals
          s += '<line x1="84" y1="68" x2="274" y2="230" stroke="#2563eb" stroke-width="3.2"/>';
          s += '<line x1="234" y1="68" x2="92" y2="230" stroke="#16a34a" stroke-width="3.2"/>';
          s += '<circle cx="170" cy="141" r="5" fill="#7c3aed"/>';
          s += '<text x="72" y="64" font-size="14" font-weight="800" fill="#0f172a">A</text>';
          s += '<text x="240" y="64" font-size="14" font-weight="800" fill="#0f172a">B</text>';
          s += '<text x="76" y="236" font-size="14" font-weight="800" fill="#0f172a">C</text>';
          s += '<text x="280" y="236" font-size="14" font-weight="800" fill="#0f172a">D</text>';
          s += '<text x="184" y="146" font-size="14" font-weight="800" fill="#6d28d9">O</text>';

          s += card(332, 52, 290, 198, '#f8fafc', '#cbd5e1', 10);
          s += '<text x="348" y="78" font-size="14" font-weight="800" fill="#0f172a">📐 △AOB ~ △DOC（AA 相似）</text>';
          s += '<text x="348" y="106" font-size="13" fill="#334155">① 平行內錯角相等：∠A = ∠D，∠B = ∠C</text>';
          s += '<text x="348" y="130" font-size="13" fill="#334155">② 對頂角相等：∠AOB = ∠DOC</text>';
          s += pill(346, 148, 262, 34, '對應邊：AB : DC = OA : OD = OB : OC', '#eff6ff', '#1e40af', '#60a5fa', 12.5);
          s += pill(346, 194, 262, 38, '⚠️ 對應頂點是「對角配對」(A對D、B對C)！', '#fef3c7', '#92400e', '#f59e0b', 11.5);
          readout = '<strong>8 字型核心規則：</strong>常隱藏在梯形對角線或平行四邊形中！對應頂點沿同一條斜線「跨過交點 O」配對：藍線 OA 配 OD，綠線 OB 配 OC，橘線 AB 配 DC。';
        } else if (tab === 'mother') {
          s += pill(18, 12, 340, 28, '模型 ③：母子直角三角形（子母相似三大公式）', '#f5f3ff', '#5b21b6', '#c4b5fd', 13);
          // Right triangle: C=(122,74), A=(46,216), B=(316,216) -> check angle C:
          // Actually let's make an EXACT right triangle!
          // Let hypotenuse AB on y=216: A=(54,216), B=(304,216), length c=250.
          // Let p = AD = 90 -> D=(144,216), q = BD = 160 -> h = sqrt(90*160) = 120 -> C=(144, 216-120)=(144,96)!
          // Exact 3-4-5 right triangle! AC=150, BC=200, AB=250, CD=120!
          s += '<polygon points="54,216 304,216 144,96" fill="#f8fafc" stroke="#334155" stroke-width="2"/>';
          // Altitude CD (orange)
          s += '<line x1="144" y1="96" x2="144" y2="216" stroke="#ea580c" stroke-width="3.5"/>';
          // AC (blue), BC (green)
          s += '<line x1="54" y1="216" x2="144" y2="96" stroke="#2563eb" stroke-width="3.5"/>';
          s += '<line x1="144" y1="96" x2="304" y2="216" stroke="#16a34a" stroke-width="3.5"/>';
          // Right angle at D
          s += '<polyline points="144,202 158,202 158,216" fill="none" stroke="#ea580c" stroke-width="2"/>';
          // Right angle at C (along CA and CB)
          s += '<polyline points="135,108 147,117 156,105" fill="none" stroke="#7c3aed" stroke-width="2.2"/>';
          // Segment labels
          s += '<text x="144" y="86" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a">C (90°)</text>';
          s += '<text x="42" y="222" font-size="14" font-weight="800" fill="#0f172a">A</text>';
          s += '<text x="310" y="222" font-size="14" font-weight="800" fill="#0f172a">B</text>';
          s += '<text x="144" y="234" text-anchor="middle" font-size="13.5" font-weight="800" fill="#ea580c">D</text>';
          s += '<text x="86" y="150" font-size="14" font-weight="800" fill="#1d4ed8">b</text>';
          s += '<text x="234" y="148" font-size="14" font-weight="800" fill="#15803d">a</text>';
          s += '<text x="152" y="164" font-size="14" font-weight="800" fill="#c2410c">h</text>';
          s += '<text x="99" y="234" text-anchor="middle" font-size="13" font-weight="800" fill="#1d4ed8">p</text>';
          s += '<text x="224" y="234" text-anchor="middle" font-size="13" font-weight="800" fill="#15803d">q</text>';
          s += '<text x="179" y="252" text-anchor="middle" font-size="12" font-weight="700" fill="#475569">全斜邊 c = p + q</text>';

          s += card(338, 52, 284, 198, '#f8fafc', '#cbd5e1', 10);
          s += '<text x="354" y="78" font-size="14" font-weight="800" fill="#5b21b6">💎 必背射影定理（3 大黃金公式）</text>';
          s += pill(354, 92, 252, 34, '① 中線高平方：h² = p × q', '#ffedd5', '#9a3412', '#fb923c', 14);
          s += pill(354, 134, 252, 34, '② 左股平方：b² = p × c（近 × 全）', '#dbeafe', '#1e40af', '#60a5fa', 13.5);
          s += pill(354, 176, 252, 34, '③ 右股平方：a² = q × c（近 × 全）', '#dcfce7', '#166534', '#4ade80', 13.5);
          s += '<text x="480" y="232" text-anchor="middle" font-size="11.5" font-weight="700" fill="#475569">另附面積法：斜邊高 h = a × b ÷ c</text>';
          readout = '<strong>母子直角口訣：</strong>直角頂點 C 往斜邊作高 CD，會切出 3 個兩兩相似的直角三角形！記住「高平方＝左×右 (h²=pq)」、「股平方＝近段×全斜邊 (b²=pc, a²=qc)」，解題快三倍！';
        } else {
          s += pill(18, 12, 340, 28, '模型 ④：30°-60°-90° 與 45°-45°-90° 特殊三角比', '#f0fdf4', '#166534', '#4ade80', 13);
          // Left: 30-60-90 triangle
          s += card(18, 50, 294, 204, '#f8fafc', '#cbd5e1', 10);
          s += '<polygon points="48,200 248,200 248,85" fill="#eff6ff" stroke="#2563eb" stroke-width="2.5"/>';
          s += '<polyline points="234,200 234,186 248,186" fill="none" stroke="#2563eb" stroke-width="2"/>';
          s += '<text x="84" y="192" font-size="12.5" font-weight="800" fill="#c2410c">30°</text>';
          s += '<text x="220" y="114" font-size="12.5" font-weight="800" fill="#15803d">60°</text>';
          s += '<text x="148" y="220" text-anchor="middle" font-size="14" font-weight="800" fill="#15803d">√3</text>';
          s += '<text x="266" y="148" font-size="14" font-weight="800" fill="#c2410c">1</text>';
          s += '<text x="134" y="132" font-size="14" font-weight="800" fill="#1d4ed8">2（斜邊）</text>';
          s += pill(44, 228, 242, 22, '邊長比 1 : √3 : 2（sin30° = 1/2）', '#dbeafe', '#1e40af', '#60a5fa', 11.5);

          // Right: 45-45-90 triangle
          s += card(328, 50, 294, 204, '#f8fafc', '#cbd5e1', 10);
          s += '<polygon points="386,200 526,200 526,68" fill="#fff7ed" stroke="#ea580c" stroke-width="2.5"/>';
          s += '<polyline points="512,200 512,186 526,186" fill="none" stroke="#ea580c" stroke-width="2"/>';
          s += '<text x="412" y="192" font-size="12.5" font-weight="800" fill="#c2410c">45°</text>';
          s += '<text x="498" y="102" font-size="12.5" font-weight="800" fill="#c2410c">45°</text>';
          s += '<text x="456" y="220" text-anchor="middle" font-size="14" font-weight="800" fill="#c2410c">1</text>';
          s += '<text x="542" y="142" font-size="14" font-weight="800" fill="#c2410c">1</text>';
          s += '<text x="432" y="126" font-size="14" font-weight="800" fill="#7c3aed">√2（斜邊）</text>';
          s += pill(354, 228, 242, 22, '邊長比 1 : 1 : √2（tan45° = 1）', '#ffedd5', '#9a3412', '#fb923c', 11.5);
          readout = '<strong>特殊直角三角比：</strong>對角決定對邊！30° 對最短邊 1、60° 對 √3、90° 對最長斜邊 2；45° 等腰直角三角形則是 1 : 1 : √2。';
        }

        var controls = '<div class="hb-vis-controls">' +
          '<button type="button" class="hb-vis-btn' + (tab === 'A' ? ' active' : '') + '" data-t="A">A 字型 (DE ∥ BC)</button>' +
          '<button type="button" class="hb-vis-btn' + (tab === '8' ? ' active' : '') + '" data-t="8">8 字型 (AB ∥ CD)</button>' +
          '<button type="button" class="hb-vis-btn' + (tab === 'mother' ? ' active' : '') + '" data-t="mother">母子直角三角形</button>' +
          '<button type="button" class="hb-vis-btn' + (tab === 'trig' ? ' active' : '') + '" data-t="trig">30-45-60 特殊三角比</button>' +
          '</div>';

        el.innerHTML = controls + svgWrap(s, 266) +
          '<div class="hb-vis-readout">' + readout + '</div>';

        el.querySelectorAll('[data-t]').forEach(function (b) {
          b.addEventListener('click', function () { tab = b.getAttribute('data-t'); render(); });
        });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     15. MATH_9_3_2 — 圓形核心四大性質互動圖鑑
     ======================================================================== */
  V['MATH_9_3_2'] = {
    title: '🎨 圓形四大必考定理互動圖鑑（圓周角／直徑90°／內接四邊形／公切線）',
    subtitle: '切換圓形四大核心定理，動態調整弧度與觀看公切線平移直角三角形構造！',
    mount: function (el) {
      var tab = 'central'; // 'central' | 'diam' | 'cyclic' | 'tangent'
      var arcDeg = 120; // 80 | 120 | 150

      function render() {
        var s = '';
        var readout = '';

        if (tab === 'central') {
          var half = arcDeg / 2;
          s += pill(18, 12, 310, 28, '定理 ①：同弧所對「圓心角 = 2 × 圓周角」', '#eff6ff', '#1e40af', '#93c5fd', 13);
          var cx = 180, cy = 152, r = 92;
          s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>';
          // Bottom arc centered at 90 deg (down): from 90 - arcDeg/2 to 90 + arcDeg/2
          var a1 = (90 - half) * Math.PI / 180;
          var a2 = (90 + half) * Math.PI / 180;
          var Ax = cx + r * Math.cos(a2), Ay = cy + r * Math.sin(a2);
          var Bx = cx + r * Math.cos(a1), By = cy + r * Math.sin(a1);
          var Px = cx - 22, Py = cy - Math.sqrt(r * r - 22 * 22);

          // Highlight red arc AB
          s += '<path d="M ' + Ax.toFixed(1) + ' ' + Ay.toFixed(1) + ' A ' + r + ' ' + r + ' 0 0 0 ' + Bx.toFixed(1) + ' ' + By.toFixed(1) + '" fill="none" stroke="#dc2626" stroke-width="5"/>';
          // Inscribed angle lines (blue)
          s += '<line x1="' + Px.toFixed(1) + '" y1="' + Py.toFixed(1) + '" x2="' + Ax.toFixed(1) + '" y2="' + Ay.toFixed(1) + '" stroke="#2563eb" stroke-width="2.6"/>';
          s += '<line x1="' + Px.toFixed(1) + '" y1="' + Py.toFixed(1) + '" x2="' + Bx.toFixed(1) + '" y2="' + By.toFixed(1) + '" stroke="#2563eb" stroke-width="2.6"/>';
          // Central angle lines (orange)
          s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + Ax.toFixed(1) + '" y2="' + Ay.toFixed(1) + '" stroke="#ea580c" stroke-width="2.8"/>';
          s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + Bx.toFixed(1) + '" y2="' + By.toFixed(1) + '" stroke="#ea580c" stroke-width="2.8"/>';
          // Points & labels
          s += '<circle cx="' + cx + '" cy="' + cy + '" r="4.5" fill="#ea580c"/>';
          s += '<text x="' + (cx + 10) + '" y="' + (cy - 4) + '" font-size="13" font-weight="800" fill="#c2410c">O</text>';
          s += '<text x="' + cx + '" y="' + (cy + 34) + '" text-anchor="middle" font-size="13.5" font-weight="800" fill="#c2410c">' + arcDeg + '°</text>';
          s += '<circle cx="' + Px.toFixed(1) + '" cy="' + Py.toFixed(1) + '" r="4.5" fill="#2563eb"/>';
          s += '<text x="' + (Px - 14) + '" y="' + (Py - 6) + '" font-size="13" font-weight="800" fill="#1d4ed8">P (' + half + '°)</text>';
          s += '<text x="' + (Ax - 14) + '" y="' + (Ay + 12) + '" font-size="13" font-weight="800" fill="#0f172a">A</text>';
          s += '<text x="' + (Bx + 8) + '" y="' + (By + 12) + '" font-size="13" font-weight="800" fill="#0f172a">B</text>';

          s += card(326, 54, 296, 192, '#f8fafc', '#cbd5e1', 10);
          s += '<text x="344" y="84" font-size="14" font-weight="800" fill="#0f172a">📐 即時角度對照（紅弧 AB = ' + arcDeg + '°）</text>';
          s += pill(344, 100, 260, 34, '橘色圓心角 ∠AOB = 弧 AB = ' + arcDeg + '°', '#ffedd5', '#9a3412', '#fb923c', 13.5);
          s += pill(344, 144, 260, 34, '藍色圓周角 ∠APB = ½ 弧 AB = ' + half + '°', '#dbeafe', '#1e40af', '#60a5fa', 13.5);
          s += '<text x="344" y="204" font-size="12.5" font-weight="700" fill="#334155">💡 無論 P 在上方圓周哪一點移動，</text>';
          s += '<text x="344" y="224" font-size="12.5" font-weight="700" fill="#15803d">只要對著同一個弧 AB，∠APB 永遠是 ' + half + '°！</text>';
          readout = '<strong>圓心角與圓周角：</strong>圓心角等於所對弧的度數，圓周角等於所對弧度數的一半，因此「同弧圓心角 = 2 × 圓周角」！';
        } else if (tab === 'diam') {
          s += pill(18, 12, 300, 28, '定理 ②：半圓（直徑）所對圓周角必 = 90°', '#f0fdf4', '#166534', '#4ade80', 13);
          var cx = 180, cy = 152, r = 92;
          s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>';
          // Diameter AB
          s += '<line x1="' + (cx - r) + '" y1="' + cy + '" x2="' + (cx + r) + '" y2="' + cy + '" stroke="#0f172a" stroke-width="3.5"/>';
          s += '<circle cx="' + cx + '" cy="' + cy + '" r="4.5" fill="#0f172a"/>';
          s += '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#475569">圓心 O（180°）</text>';
          // P1 at -125 deg, P2 at -55 deg
          var p1x = cx + r * Math.cos(-2.18), p1y = cy + r * Math.sin(-2.18);
          var p2x = cx + r * Math.cos(-0.85), p2y = cy + r * Math.sin(-0.85);
          s += '<polyline points="' + (cx - r) + ',' + cy + ' ' + p1x.toFixed(1) + ',' + p1y.toFixed(1) + ' ' + (cx + r) + ',' + cy + '" fill="none" stroke="#2563eb" stroke-width="2.8"/>';
          s += '<polyline points="' + (cx - r) + ',' + cy + ' ' + p2x.toFixed(1) + ',' + p2y.toFixed(1) + ' ' + (cx + r) + ',' + cy + '" fill="none" stroke="#16a34a" stroke-width="2.8"/>';
          s += '<circle cx="' + p1x.toFixed(1) + '" cy="' + p1y.toFixed(1) + '" r="5" fill="#2563eb"/>';
          s += '<circle cx="' + p2x.toFixed(1) + '" cy="' + p2y.toFixed(1) + '" r="5" fill="#16a34a"/>';
          s += '<text x="' + (p1x - 14) + '" y="' + (p1y - 8) + '" font-size="12.5" font-weight="800" fill="#1d4ed8">P₁ (90°)</text>';
          s += '<text x="' + (p2x + 4) + '" y="' + (p2y - 8) + '" font-size="12.5" font-weight="800" fill="#15803d">P₂ (90°)</text>';
          s += '<text x="' + (cx - r - 16) + '" y="' + (cy + 5) + '" font-size="14" font-weight="800" fill="#0f172a">A</text>';
          s += '<text x="' + (cx + r + 8) + '" y="' + (cy + 5) + '" font-size="14" font-weight="800" fill="#0f172a">B</text>';

          s += card(326, 54, 296, 192, '#f0fdf4', '#22c55e', 10);
          s += '<text x="344" y="84" font-size="14" font-weight="800" fill="#166534">✨ 會考最常藏的「隱形直角」</text>';
          s += '<text x="344" y="114" font-size="13" fill="#334155">∵ AB 是直徑 → 下方半圓弧 = 180°</text>';
          s += '<text x="344" y="140" font-size="13.5" font-weight="800" fill="#1e40af">∴ ∠AP₁B = ∠AP₂B = 180° ÷ 2 = 90°！</text>';
          s += pill(344, 162, 260, 62, '🎯 解題反射動作：題目一說「AB 為直徑」，\n馬上找圓周點連成直角三角形用畢氏定理！', '#dcfce7', '#14532d', '#4ade80', 12);
          readout = '<strong>直徑對 90° 定理：</strong>因為半圓弧是 180°，所以直徑兩端連到圓周上任一點都自動形成 90° 直角三角形（也是反推「直角△外心在斜邊中點」的來源）！';
        } else if (tab === 'cyclic') {
          s += pill(18, 12, 330, 28, '定理 ③：圓內接四邊形「對角互補 180°、外角 = 內對角」', '#fff7ed', '#9a3412', '#fdba74', 12.5);
          var cx = 175, cy = 152, r = 90;
          s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>';
          var pts = [
            [cx + r * Math.cos(-2.45), cy + r * Math.sin(-2.45)], // A top-left
            [cx + r * Math.cos(-0.65), cy + r * Math.sin(-0.65)], // B top-right
            [cx + r * Math.cos(0.45), cy + r * Math.sin(0.45)],   // C bot-right
            [cx + r * Math.cos(2.35), cy + r * Math.sin(2.35)]    // D bot-left
          ];
          s += '<polygon points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="rgba(251,146,60,0.1)" stroke="#334155" stroke-width="2.5"/>';
          // Extend DC past C to E for exterior angle
          var ex = pts[2][0] + 58, ey = pts[2][1] + (pts[2][1] - pts[3][1]) * (58 / (pts[2][0] - pts[3][0]));
          s += '<line x1="' + pts[2][0].toFixed(1) + '" y1="' + pts[2][1].toFixed(1) + '" x2="' + ex.toFixed(1) + '" y2="' + ey.toFixed(1) + '" stroke="#2563eb" stroke-width="2.5" stroke-dasharray="5 3"/>';
          // Color-coded corners
          s += '<circle cx="' + pts[0][0].toFixed(1) + '" cy="' + pts[0][1].toFixed(1) + '" r="7" fill="#2563eb"/>';
          s += '<circle cx="' + pts[2][0].toFixed(1) + '" cy="' + pts[2][1].toFixed(1) + '" r="7" fill="#2563eb"/>';
          s += '<circle cx="' + pts[1][0].toFixed(1) + '" cy="' + pts[1][1].toFixed(1) + '" r="7" fill="#ea580c"/>';
          s += '<circle cx="' + pts[3][0].toFixed(1) + '" cy="' + pts[3][1].toFixed(1) + '" r="7" fill="#ea580c"/>';
          s += '<text x="' + (pts[0][0] - 18) + '" y="' + (pts[0][1] - 6) + '" font-size="13" font-weight="800" fill="#1d4ed8">A (80°)</text>';
          s += '<text x="' + (pts[2][0] + 10) + '" y="' + (pts[2][1] - 4) + '" font-size="12.5" font-weight="800" fill="#1d4ed8">C (100°)</text>';
          s += '<text x="' + (pts[1][0] + 8) + '" y="' + (pts[1][1] - 4) + '" font-size="12.5" font-weight="800" fill="#c2410c">B</text>';
          s += '<text x="' + (pts[3][0] - 18) + '" y="' + (pts[3][1] + 14) + '" font-size="12.5" font-weight="800" fill="#c2410c">D</text>';
          s += '<text x="' + (ex - 6) + '" y="' + (ey + 14) + '" font-size="12" font-weight="800" fill="#1d4ed8">外角=80°</text>';

          s += card(326, 54, 296, 192, '#f8fafc', '#cbd5e1', 10);
          s += '<text x="344" y="84" font-size="14" font-weight="800" fill="#0f172a">📐 圓內接四邊形兩大必背結論</text>';
          s += pill(344, 100, 260, 34, '① 對角互補：∠A + ∠C = 180°（藍對藍）', '#dbeafe', '#1e40af', '#60a5fa', 12.5);
          s += pill(344, 142, 260, 34, '　　　　　　∠B + ∠D = 180°（橘對橘）', '#ffedd5', '#9a3412', '#fb923c', 12.5);
          s += pill(344, 184, 260, 44, '② 外角性質：∠BCE = ∠A（外角 = 內對角！）', '#dcfce7', '#166534', '#22c55e', 12.5);
          readout = '<strong>圓內接四邊形：</strong>對角所對的兩個弧剛好合起來是完整一圈 360°，所以兩圓周角相加 = 360° ÷ 2 = 180°！';
        } else {
          s += pill(18, 12, 345, 28, '定理 ④：切線 ⊥ 半徑 ＆ 外公切線平移直角三角形', '#f5f3ff', '#5b21b6', '#c4b5fd', 12.5);
          // Circle 1: O1(122, 162), R=62; Circle 2: O2(314, 162), r=28; d=192
          var o1x = 114, o1y = 160, R = 64, o2x = 304, o2y = 160, r2 = 28;
          var d = o2x - o1x; // 190
          var sinA = (R - r2) / d; // 36/190 = 0.1895
          var cosA = Math.sqrt(1 - sinA * sinA);
          // Top outer tangent points T1 & T2
          var t1x = o1x + R * sinA, t1y = o1y - R * cosA;
          var t2x = o2x + r2 * sinA, t2y = o2y - r2 * cosA;
          // Translated point H on O1T1 at distance (R - r2) from O1
          var hx = o1x + (R - r2) * sinA, hy = o1y - (R - r2) * cosA;

          s += '<circle cx="' + o1x + '" cy="' + o1y + '" r="' + R + '" fill="#eff6ff" stroke="#2563eb" stroke-width="2.2"/>';
          s += '<circle cx="' + o2x + '" cy="' + o2y + '" r="' + r2 + '" fill="#fff7ed" stroke="#ea580c" stroke-width="2.2"/>';
          // Center line O1O2 (hypotenuse d)
          s += '<line x1="' + o1x + '" y1="' + o1y + '" x2="' + o2x + '" y2="' + o2y + '" stroke="#334155" stroke-width="2.6"/>';
          // Radii O1T1 and O2T2
          s += '<line x1="' + o1x + '" y1="' + o1y + '" x2="' + t1x.toFixed(1) + '" y2="' + t1y.toFixed(1) + '" stroke="#2563eb" stroke-width="2.4"/>';
          s += '<line x1="' + o2x + '" y1="' + o2y + '" x2="' + t2x.toFixed(1) + '" y2="' + t2y.toFixed(1) + '" stroke="#ea580c" stroke-width="2.4"/>';
          // Outer common tangent T1T2 (green)
          s += '<line x1="' + (t1x - 16).toFixed(1) + '" y1="' + (t1y - 3).toFixed(1) + '" x2="' + (t2x + 16).toFixed(1) + '" y2="' + (t2y + 3).toFixed(1) + '" stroke="#16a34a" stroke-width="3.2"/>';
          // Translated line O2H (dashed green) forming right triangle O1-H-O2!
          s += '<polygon points="' + o1x + ',' + o1y + ' ' + hx.toFixed(1) + ',' + hy.toFixed(1) + ' ' + o2x + ',' + o2y + '" fill="rgba(124,58,237,0.14)" stroke="none"/>';
          s += '<line x1="' + hx.toFixed(1) + '" y1="' + hy.toFixed(1) + '" x2="' + o2x + '" y2="' + o2y + '" stroke="#7c3aed" stroke-width="2.8" stroke-dasharray="5 3"/>';
          // Labels
          s += '<circle cx="' + o1x + '" cy="' + o1y + '" r="4" fill="#1e40af"/>';
          s += '<circle cx="' + o2x + '" cy="' + o2y + '" r="4" fill="#c2410c"/>';
          s += '<text x="' + (o1x - 16) + '" y="' + (o1y + 16) + '" font-size="12.5" font-weight="800" fill="#1e40af">O₁</text>';
          s += '<text x="' + (o2x + 6) + '" y="' + (o2y + 16) + '" font-size="12.5" font-weight="800" fill="#c2410c">O₂</text>';
          s += '<text x="' + (t1x - 8) + '" y="' + (t1y - 10) + '" font-size="12" font-weight="800" fill="#15803d">T₁ (⊥)</text>';
          s += '<text x="' + (t2x + 2) + '" y="' + (t2y - 10) + '" font-size="12" font-weight="800" fill="#15803d">T₂ (⊥)</text>';
          s += '<text x="' + ((o1x + o2x) / 2) + '" y="' + (o1y + 18) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#334155">連心線 d = 10</text>';
          s += '<text x="' + ((t1x + t2x) / 2) + '" y="' + ((t1y + t2y) / 2 - 12) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="#15803d">外公切線 L</text>';
          s += '<text x="' + (o1x - 2) + '" y="' + ((o1y + hy) / 2 + 4) + '" text-anchor="end" font-size="11.5" font-weight="800" fill="#6d28d9">R−r</text>';

          s += card(356, 54, 266, 192, '#f8fafc', '#cbd5e1', 10);
          s += '<text x="372" y="82" font-size="13.5" font-weight="800" fill="#5b21b6">📐 切線 ⊥ 半徑 → 平移造直角△</text>';
          s += '<text x="372" y="108" font-size="12.5" fill="#334155">設大圓 R=5、小圓 r=2、連心線 d=10：</text>';
          s += pill(370, 122, 238, 36, '外公切線 L = √(d² − (R − r)²)', '#dcfce7', '#166534', '#22c55e', 13);
          s += '<text x="372" y="178" font-size="13" font-weight="800" fill="#0f172a">代入：L = √(10² − 3²) = √91</text>';
          s += pill(370, 194, 238, 38, '💡 若求「內公切線」→ 改成 R + r！\nL內 = √(d² − (R + r)²)', '#f5f3ff', '#5b21b6', '#a78bfa', 11.5);
          readout = '<strong>公切線平移必殺技：</strong>看到切點立刻連半徑標 90°！再把切線平行推到小圓心 O₂，立刻得到以連心線 d 為斜邊、(R − r) 為一股的紫色直角三角形！';
        }

        var controls = '<div class="hb-vis-controls">' +
          '<button type="button" class="hb-vis-btn' + (tab === 'central' ? ' active' : '') + '" data-t="central">圓心角 = 2 圓周角</button>' +
          '<button type="button" class="hb-vis-btn' + (tab === 'diam' ? ' active' : '') + '" data-t="diam">直徑對 90°</button>' +
          '<button type="button" class="hb-vis-btn' + (tab === 'cyclic' ? ' active' : '') + '" data-t="cyclic">內接四邊形對角 180°</button>' +
          '<button type="button" class="hb-vis-btn' + (tab === 'tangent' ? ' active' : '') + '" data-t="tangent">切線 ⊥ 半徑與公切線</button>';

        if (tab === 'central') {
          controls += '<span style="color:#cbd5e1;">|</span>' +
            [80, 120, 150].map(function (deg) {
              return '<button type="button" class="hb-vis-btn' + (arcDeg === deg ? ' active' : '') + '" data-deg="' + deg + '">弧 AB = ' + deg + '°</button>';
            }).join('');
        }
        controls += '</div>';

        el.innerHTML = controls + svgWrap(s, 266) +
          '<div class="hb-vis-readout">' + readout + '</div>';

        el.querySelectorAll('[data-t]').forEach(function (b) {
          b.addEventListener('click', function () { tab = b.getAttribute('data-t'); render(); });
        });
        el.querySelectorAll('[data-deg]').forEach(function (b) {
          b.addEventListener('click', function () { arcDeg = Number(b.getAttribute('data-deg')); render(); });
        });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     16. MATH_9_3_3 — 三角形三心 (外心 O / 內心 I / 重心 G) 與外心漂移器
     ======================================================================== */
  V['MATH_9_3_3'] = {
    title: '🎨 三角形三心對決（外心 O ／ 內心 I ／ 重心 G）＋ 外心內外漂移實驗',
    subtitle: '切換三心看清作圖線段與核心公式，並在「外心 O」模式切換銳角／直角／鈍角三角形，看外心如何跑到外面！',
    mount: function (el) {
      var center = 'O'; // 'O' | 'I' | 'G'
      var triType = 'acute'; // 'acute' | 'right' | 'obtuse' (for O)

      function render() {
        var s = '';
        var readout = '';

        if (center === 'O') {
          // Exact circumcircle coordinates for acute, right, obtuse
          var cfg = {
            acute: {
              badge: '銳角△：外心 O 在三角形「內部」',
              O: [185, 150], R: 78,
              A: [185, 72], B: [115, 185], C: [255, 185],
              note: '銳角三角形三邊中垂線交於內部，OA = OB = OC = 外接圓半徑 R。'
            },
            right: {
              badge: '直角△：外心 O 剛好在「斜邊中點」！（★ 必考）',
              O: [185, 164], R: 82,
              A: [103, 164], B: [267, 164], C: [148, 91],
              note: '🔥 會考超高頻！直角三角形的外心必在「斜邊中點」，因此外接圓半徑 R = 斜邊長 ÷ 2，且斜邊中線 OC = OA = OB = 斜邊的一半！'
            },
            obtuse: {
              badge: '鈍角△：外心 O 漂移跑到三角形「外部」！',
              O: [185, 178], R: 74,
              A: [120, 142], B: [250, 142], C: [185, 104],
              note: '鈍角三角形的外心會掉在最大角（鈍角）對邊的外側！這也是「外心不一定在三角形內部」的經典反例。'
            }
          }[triType];

          s += pill(18, 12, 360, 28, cfg.badge, triType === 'right' ? '#dcfce7' : (triType === 'obtuse' ? '#fef2f2' : '#eff6ff'),
            triType === 'right' ? '#166534' : (triType === 'obtuse' ? '#991b1b' : '#1e40af'),
            triType === 'right' ? '#22c55e' : (triType === 'obtuse' ? '#ef4444' : '#93c5fd'), 12.5);

          // Circumcircle
          s += '<circle cx="' + cfg.O[0] + '" cy="' + cfg.O[1] + '" r="' + cfg.R + '" fill="rgba(37,99,235,0.05)" stroke="#93c5fd" stroke-width="2" stroke-dasharray="6 4"/>';
          // Triangle
          s += '<polygon points="' + cfg.A.join(',') + ' ' + cfg.B.join(',') + ' ' + cfg.C.join(',') + '" fill="rgba(37,99,235,0.12)" stroke="#1e40af" stroke-width="2.6"/>';
          // Equal radii OA, OB, OC (orange)
          [cfg.A, cfg.B, cfg.C].forEach(function (pt) {
            s += '<line x1="' + cfg.O[0] + '" y1="' + cfg.O[1] + '" x2="' + pt[0] + '" y2="' + pt[1] + '" stroke="#ea580c" stroke-width="2" stroke-dasharray="4 3"/>';
          });
          // Circumcenter O
          s += '<circle cx="' + cfg.O[0] + '" cy="' + cfg.O[1] + '" r="6.5" fill="#dc2626" stroke="#fff" stroke-width="2"/>';
          s += '<text x="' + (cfg.O[0] + 10) + '" y="' + (cfg.O[1] + 5) + '" font-size="14" font-weight="800" fill="#b91c1c">O (外心)</text>';
          // Vertices
          s += '<text x="' + (cfg.A[0] - 14) + '" y="' + (cfg.A[1] - 6) + '" font-size="13" font-weight="800" fill="#0f172a">A</text>';
          s += '<text x="' + (cfg.B[0] + 6) + '" y="' + (cfg.B[1] + 14) + '" font-size="13" font-weight="800" fill="#0f172a">B</text>';
          s += '<text x="' + (cfg.C[0] - 4) + '" y="' + (cfg.C[1] - 8) + '" font-size="13" font-weight="800" fill="#0f172a">C</text>';

          s += card(326, 52, 296, 198, '#f8fafc', '#cbd5e1', 10);
          s += '<text x="344" y="78" font-size="14" font-weight="800" fill="#1e40af">🔵 外心 O（外接圓圓心）必背性質</text>';
          s += '<text x="344" y="106" font-size="13" font-weight="700" fill="#0f172a">• 作法：三邊「中垂線」交點</text>';
          s += '<text x="344" y="130" font-size="13" font-weight="700" fill="#c2410c">• 等距：到「三頂點」等距（OA=OB=OC=R）</text>';
          s += '<text x="344" y="156" font-size="12.5" font-weight="700" fill="#334155">• 位置：銳角內部 ／ 直角斜邊中點 ／ 鈍角外部</text>';
          s += pill(344, 174, 260, 56, '🎯 角度公式：\n銳角△：∠BOC = 2∠A\n鈍角△：∠BOC = 360° − 2∠A', '#eff6ff', '#1e40af', '#60a5fa', 12);
          readout = '<strong>外心 O 解析：</strong>' + cfg.note;
        } else if (center === 'I') {
          s += pill(18, 12, 310, 28, '🟢 內心 I（內切圓圓心，恆在三角形內部）', '#f0fdf4', '#166534', '#4ade80', 13);
          // Triangle A(175,64), B(68,226), C(282,226) -> isosceles: base=214, height=162, legs=sqrt(107^2+162^2)=194.15
          // Inradius r = Area / s = (214*162/2) / ((214+388.3)/2) = 17334 / 301.15 = 57.56 -> I=(175, 226-57.6)=(175,168.4)
          var ix = 175, iy = 168, ir = 57.5;
          s += '<polygon points="175,64 68,226 282,226" fill="#f8fafc" stroke="#15803d" stroke-width="2.6"/>';
          // Inscribed circle
          s += '<circle cx="' + ix + '" cy="' + iy + '" r="' + ir + '" fill="rgba(34,197,94,0.14)" stroke="#16a34a" stroke-width="2.4"/>';
          // Angle bisectors (dashed blue)
          s += '<line x1="175" y1="64" x2="' + ix + '" y2="' + iy + '" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="4 3"/>';
          s += '<line x1="68" y1="226" x2="' + ix + '" y2="' + iy + '" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="4 3"/>';
          s += '<line x1="282" y1="226" x2="' + ix + '" y2="' + iy + '" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="4 3"/>';
          // Perpendicular radius r to base
          s += '<line x1="' + ix + '" y1="' + iy + '" x2="' + ix + '" y2="226" stroke="#dc2626" stroke-width="2.6"/>';
          s += '<polyline points="' + ix + ',214 ' + (ix + 12) + ',214 ' + (ix + 12) + ',226" fill="none" stroke="#dc2626" stroke-width="1.8"/>';
          s += '<text x="' + (ix + 16) + '" y="204" font-size="13" font-weight="800" fill="#dc2626">r</text>';
          s += '<circle cx="' + ix + '" cy="' + iy + '" r="5.5" fill="#16a34a" stroke="#fff" stroke-width="1.5"/>';
          s += '<text x="' + (ix + 10) + '" y="' + (iy - 6) + '" font-size="14" font-weight="800" fill="#15803d">I (內心)</text>';
          s += '<text x="175" y="55" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0f172a">A</text>';
          s += '<text x="54" y="232" font-size="13.5" font-weight="800" fill="#0f172a">B</text>';
          s += '<text x="288" y="232" font-size="13.5" font-weight="800" fill="#0f172a">C</text>';

          s += card(326, 52, 296, 198, '#f0fdf4', '#86efac', 10);
          s += '<text x="344" y="78" font-size="14" font-weight="800" fill="#166534">🟢 內心 I（內切圓圓心）必背三大公式</text>';
          s += '<text x="344" y="104" font-size="13" font-weight="700" fill="#0f172a">• 作法：三內角「角平分線」交點</text>';
          s += '<text x="344" y="128" font-size="13" font-weight="700" fill="#dc2626">• 等距：到「三邊」垂直距離皆 = r</text>';
          s += pill(344, 142, 260, 30, '① 面積公式：△ABC = ½ × (a+b+c) × r', '#dcfce7', '#14532d', '#22c55e', 12.5);
          s += pill(344, 178, 260, 30, '② 角度公式：∠BIC = 90° + ½ ∠A', '#dbeafe', '#1e40af', '#60a5fa', 12.5);
          s += '<text x="344" y="230" font-size="12" font-weight="700" fill="#15803d">③ 直角△特例：r = (兩股和 − 斜邊) ÷ 2</text>';
          readout = '<strong>內心 I 解析：</strong>內心到三邊等距（半徑 r），因此把 △ABC 切成三個以三邊為底、高皆為 r 的小三角形，面積比 = 邊長比 a : b : c！';
        } else {
          s += pill(18, 12, 320, 28, '🟠 重心 G（三中線交點，物理平衡重心）', '#fff7ed', '#9a3412', '#fdba74', 13);
          // Triangle A(175,60), B(66,226), C(284,226); midpoints D(175,226), E(229.5,143), F(120.5,143); G=(175, 170.7)
          var A = [175, 60], B = [66, 226], C = [284, 226];
          var D = [175, 226], E = [229.5, 143], F = [120.5, 143], G = [175, 170.7];
          // 6 shaded sub-triangles with alternating soft colors
          var tris = [
            [A, F, G, '#eff6ff'], [A, E, G, '#ffedd5'], [B, F, G, '#dcfce7'],
            [B, D, G, '#fef3c7'], [C, D, G, '#f5f3ff'], [C, E, G, '#fee2e2']
          ];
          tris.forEach(function (t) {
            s += '<polygon points="' + t[0].join(',') + ' ' + t[1].join(',') + ' ' + t[2].join(',') + '" fill="' + t[3] + '" stroke="#cbd5e1" stroke-width="1"/>';
            var mx = (t[0][0] + t[1][0] + t[2][0]) / 3;
            var my = (t[0][1] + t[1][1] + t[2][1]) / 3;
            s += '<text x="' + mx.toFixed(1) + '" y="' + (my + 4).toFixed(1) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#475569">1/6</text>';
          });
          s += '<polygon points="175,60 66,226 284,226" fill="none" stroke="#334155" stroke-width="2.4"/>';
          // 3 Medians
          s += '<line x1="66" y1="226" x2="229.5" y2="143" stroke="#64748b" stroke-width="1.8"/>';
          s += '<line x1="284" y1="226" x2="120.5" y2="143" stroke="#64748b" stroke-width="1.8"/>';
          // Highlight AG : GD = 2 : 1
          s += '<line x1="175" y1="60" x2="175" y2="170.7" stroke="#2563eb" stroke-width="3.6"/>';
          s += '<line x1="175" y1="170.7" x2="175" y2="226" stroke="#ea580c" stroke-width="3.6"/>';
          s += '<text x="167" y="120" text-anchor="end" font-size="12.5" font-weight="800" fill="#1d4ed8">2 份</text>';
          s += '<text x="167" y="204" text-anchor="end" font-size="12.5" font-weight="800" fill="#c2410c">1 份</text>';
          s += '<circle cx="175" cy="170.7" r="6" fill="#ea580c" stroke="#fff" stroke-width="2"/>';
          s += '<text x="184" y="168" font-size="14" font-weight="800" fill="#9a3412">G</text>';
          s += '<text x="175" y="52" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0f172a">A</text>';
          s += '<text x="52" y="232" font-size="13.5" font-weight="800" fill="#0f172a">B</text>';
          s += '<text x="290" y="232" font-size="13.5" font-weight="800" fill="#0f172a">C</text>';
          s += '<text x="175" y="242" text-anchor="middle" font-size="12.5" font-weight="800" fill="#475569">D (中點)</text>';

          s += card(326, 52, 296, 198, '#fff7ed', '#fdba74', 10);
          s += '<text x="344" y="78" font-size="14" font-weight="800" fill="#9a3412">🟠 重心 G 必背兩大黃金定理</text>';
          s += '<text x="344" y="106" font-size="13" font-weight="700" fill="#0f172a">• 作法：三條「中線」（頂點連對邊中點）</text>';
          s += pill(344, 122, 260, 36, '① 黃金比例：AG : GD = 2 : 1（頂點段長！）', '#dbeafe', '#1e40af', '#60a5fa', 12.5);
          s += pill(344, 166, 260, 36, '② 面積平分：6 小塊完全相等（各占 1/6）', '#dcfce7', '#166534', '#22c55e', 12.5);
          s += '<text x="344" y="226" font-size="12.5" font-weight="700" fill="#9a3412">且 △GAB = △GBC = △GCA = 1/3 總面積！</text>';
          readout = '<strong>重心 G 解析：</strong>重心永遠在三角形內部！記住「頂點到 G 占 2 份、G 到中點占 1 份」，以及三條中線會把三角形完美等分成 6 塊面積 1/6 的小三角形！';
        }

        var controls = '<div class="hb-vis-controls">' +
          '<button type="button" class="hb-vis-btn' + (center === 'O' ? ' active' : '') + '" data-c="O">🔵 外心 O（中垂線）</button>' +
          '<button type="button" class="hb-vis-btn' + (center === 'I' ? ' active' : '') + '" data-c="I">🟢 內心 I（角平分線）</button>' +
          '<button type="button" class="hb-vis-btn' + (center === 'G' ? ' active' : '') + '" data-c="G">🟠 重心 G（中線 2:1）</button>';

        if (center === 'O') {
          controls += '<span style="color:#cbd5e1;">|</span>' +
            '<button type="button" class="hb-vis-btn' + (triType === 'acute' ? ' active' : '') + '" data-tt="acute">銳角△（內部）</button>' +
            '<button type="button" class="hb-vis-btn' + (triType === 'right' ? ' active' : '') + '" data-tt="right">直角△（斜邊中點）</button>' +
            '<button type="button" class="hb-vis-btn' + (triType === 'obtuse' ? ' active' : '') + '" data-tt="obtuse">鈍角△（外部！）</button>';
        }
        controls += '</div>';

        el.innerHTML = controls + svgWrap(s, 266) +
          '<div class="hb-vis-readout">' + readout + '</div>';

        el.querySelectorAll('[data-c]').forEach(function (b) {
          b.addEventListener('click', function () { center = b.getAttribute('data-c'); render(); });
        });
        el.querySelectorAll('[data-tt]').forEach(function (b) {
          b.addEventListener('click', function () { triType = b.getAttribute('data-tt'); render(); });
        });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     17. MATH_9_3_4 — 二次函數平移「括號歸零箭頭」＆ 區間切牆求極值
     ======================================================================== */
  V['MATH_9_3_4'] = {
    title: '🎨 拋物線平移「括號歸零箭頭」＆ 限制範圍 [a, b] 切牆求極值',
    subtitle: '徹底破除「減號往左移」錯覺，再切換觀察「頂點在範圍內 vs 被切在範圍外」的會考壓軸極值陷阱！',
    mount: function (el) {
      var mode = 'shift'; // 'shift' | 'crop'
      var sIdx = 1; // 0: y=x^2, 1: y=(x-3)^2+2, 2: y=-(x+2)^2+4
      var cropMode = 'inside'; // 'inside' [0,4] | 'outside' [3,5]

      var shiftPresets = [
        { label: '基準：y = x²', eq: 'y = x²', a: 1, h: 0, k: 0, tip: '基準拋物線：開口向上，頂點在原點 (0, 0)，對稱軸 x = 0。' },
        { label: 'y = (x − 3)² + 2（右3上2）', eq: 'y = (x − 3)² + 2', a: 1, h: 3, k: 2, tip: '🔥 括號歸零口訣：令 x − 3 = 0 得 x = +3，所以是「往右移 3 格」，不是往左！外面的 +2 則是往上移 2 格 → 頂點 (3, 2)！' },
        { label: 'y = −(x + 2)² + 4（開口向下）', eq: 'y = −(x + 2)² + 4', a: -1, h: -2, k: 4, tip: '令 x + 2 = 0 得 x = −2（往左 2 格），+4 往上 4 格 → 頂點 (−2, 4)；首項係數 a = −1 < 0，開口向下，故頂點是「最大值 = 4」！' }
      ];

      function renderShift() {
        var pr = shiftPresets[sIdx];
        var ox = 165, oy = 186, ux = 26, uy = 20;
        function px(x) { return ox + x * ux; }
        function py(y) { return oy - y * uy; }

        var defs = '<defs>' +
          arrowDef('m934-ax', '#475569') +
          arrowDef('m934-b', '#2563eb') +
          arrowDef('m934-o', '#ea580c') +
          '</defs>';
        var s = defs;

        s += card(18, 14, 304, 240, '#f8fafc', '#cbd5e1', 10);
        // Axes
        s += '<line x1="30" y1="' + oy + '" x2="310" y2="' + oy + '" stroke="#475569" stroke-width="1.8" marker-end="url(#m934-ax)"/>';
        s += '<line x1="' + ox + '" y1="244" x2="' + ox + '" y2="26" stroke="#475569" stroke-width="1.8" marker-end="url(#m934-ax)"/>';
        s += '<text x="308" y="' + (oy + 14) + '" font-size="11" fill="#475569">x</text>';
        s += '<text x="' + (ox + 8) + '" y="36" font-size="11" fill="#475569">y</text>';

        // Parent dashed parabola y = x^2
        var pPts = [];
        for (var x = -2.6; x <= 2.6; x += 0.2) {
          var y = x * x;
          if (y <= 7.2) pPts.push(px(x).toFixed(1) + ',' + py(y).toFixed(1));
        }
        s += '<polyline points="' + pPts.join(' ') + '" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/>';
        s += '<circle cx="' + px(0) + '" cy="' + py(0) + '" r="4" fill="#64748b"/>';

        // Shifted parabola
        var cPts = [];
        for (var dx = -2.6; dx <= 2.6; dx += 0.18) {
          var xx = pr.h + dx;
          var yy = pr.a * dx * dx + pr.k;
          var sx = px(xx), sy = py(yy);
          if (sx >= 26 && sx <= 314 && sy >= 24 && sy <= 246) {
            cPts.push(sx.toFixed(1) + ',' + sy.toFixed(1));
          }
        }
        s += '<polyline points="' + cPts.join(' ') + '" fill="none" stroke="#2563eb" stroke-width="3.2"/>';

        // Shift arrows from (0,0) -> (h,0) -> (h,k)
        if (pr.h !== 0) {
          s += '<line x1="' + px(0) + '" y1="' + py(0) + '" x2="' + (px(pr.h) + (pr.h > 0 ? -4 : 4)) + '" y2="' + py(0) + '" stroke="#2563eb" stroke-width="3" marker-end="url(#m934-b)"/>';
          s += '<text x="' + px(pr.h / 2) + '" y="' + (py(0) + 18) + '" text-anchor="middle" font-size="11.5" font-weight="800" fill="#1d4ed8">' + (pr.h > 0 ? '右移 ' + pr.h : '左移 ' + Math.abs(pr.h)) + '</text>';
        }
        if (pr.k !== 0) {
          s += '<line x1="' + px(pr.h) + '" y1="' + py(0) + '" x2="' + px(pr.h) + '" y2="' + (py(pr.k) + 4) + '" stroke="#ea580c" stroke-width="3" marker-end="url(#m934-o)"/>';
          s += '<text x="' + (px(pr.h) + (pr.h >= 0 ? 10 : -10)) + '" y="' + py(pr.k / 2) + '" text-anchor="' + (pr.h >= 0 ? 'start' : 'end') + '" font-size="11.5" font-weight="800" fill="#c2410c">上移 ' + pr.k + '</text>';
        }
        // Vertex dot
        s += '<circle cx="' + px(pr.h) + '" cy="' + py(pr.k) + '" r="6" fill="#dc2626" stroke="#fff" stroke-width="2"/>';
        s += '<text x="' + (px(pr.h) + 8) + '" y="' + (py(pr.k) - 8) + '" font-size="12" font-weight="800" fill="#b91c1c">(' + fmtNum(pr.h) + ', ' + pr.k + ')</text>';

        // Right explanation card
        s += card(338, 14, 284, 240, '#ffffff', '#cbd5e1', 10);
        s += pill(354, 26, 252, 32, pr.eq, '#eff6ff', '#1e40af', '#60a5fa', 15);
        s += '<text x="354" y="84" font-size="13.5" font-weight="800" fill="#0f172a">🎯 括號歸零口訣（防錯神器）</text>';
        s += '<text x="354" y="110" font-size="13" font-weight="700" fill="#1d4ed8">① 左右看括號：令括號內 = 0 → x = ' + fmtNum(pr.h) + '</text>';
        s += '<text x="354" y="134" font-size="13" font-weight="700" fill="#c2410c">② 上下看尾巴：常數項直接讀 → y = ' + pr.k + '</text>';
        s += '<text x="354" y="158" font-size="13" font-weight="700" fill="#334155">③ 開口看首項：a = ' + fmtNum(pr.a) + (pr.a > 0 ? ' > 0（向上，有最小值）' : ' < 0（向下，有最大值）') + '</text>';
        s += pill(354, 182, 252, 54, '頂點座標 = (' + fmtNum(pr.h) + ', ' + pr.k + ')\n對稱軸直線：x = ' + fmtNum(pr.h), '#f0fdf4', '#166534', '#22c55e', 13);
        return s;
      }

      function renderCrop() {
        // Function: y = (x - 1)^2 + 2, vertex at (1, 2)
        // Inside: [0, 4] -> min at x=1 (y=2), max at x=4 (y=11)
        // Outside: [3, 5] -> min at x=3 (y=6), max at x=5 (y=18)
        var isIn = cropMode === 'inside';
        var a = isIn ? 0 : 3, b = isIn ? 4 : 5;
        var ox = 72, oy = 224, ux = 40, uy = 9.2;
        function px(x) { return ox + x * ux; }
        function py(y) { return oy - y * uy; }

        var s = '';
        s += card(18, 14, 304, 240, '#f8fafc', '#cbd5e1', 10);
        // Allowed zone shading
        s += '<rect x="' + px(a) + '" y="28" width="' + (px(b) - px(a)) + '" height="' + (oy - 28) + '" fill="rgba(34,197,94,0.12)"/>';
        // Axes
        s += '<line x1="30" y1="' + oy + '" x2="310" y2="' + oy + '" stroke="#475569" stroke-width="1.8"/>';
        s += '<line x1="' + ox + '" y1="242" x2="' + ox + '" y2="28" stroke="#475569" stroke-width="1.8"/>';

        // Full parabola dimmed
        var allPts = [];
        for (var x = -1.1; x <= 5.2; x += 0.15) {
          var y = (x - 1) * (x - 1) + 2;
          if (y <= 20) allPts.push(px(x).toFixed(1) + ',' + py(y).toFixed(1));
        }
        s += '<polyline points="' + allPts.join(' ') + '" fill="none" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="5 4"/>';

        // Kept segment inside [a, b] in bold blue
        var keptPts = [];
        for (var kx = a; kx <= b + 0.01; kx += 0.12) {
          var cx = Math.min(kx, b);
          var cy = (cx - 1) * (cx - 1) + 2;
          keptPts.push(px(cx).toFixed(1) + ',' + py(cy).toFixed(1));
        }
        s += '<polyline points="' + keptPts.join(' ') + '" fill="none" stroke="#2563eb" stroke-width="4.2"/>';

        // Red domain walls at x=a and x=b
        s += '<line x1="' + px(a) + '" y1="30" x2="' + px(a) + '" y2="' + oy + '" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="6 3"/>';
        s += '<line x1="' + px(b) + '" y1="30" x2="' + px(b) + '" y2="' + oy + '" stroke="#dc2626" stroke-width="2.2" stroke-dasharray="6 3"/>';
        s += '<text x="' + px(a) + '" y="242" text-anchor="middle" font-size="11.5" font-weight="800" fill="#dc2626">x=' + a + '</text>';
        s += '<text x="' + px(b) + '" y="242" text-anchor="middle" font-size="11.5" font-weight="800" fill="#dc2626">x=' + b + '</text>';

        // Vertex (1, 2)
        s += '<circle cx="' + px(1) + '" cy="' + py(2) + '" r="6" fill="' + (isIn ? '#16a34a' : '#94a3b8') + '" stroke="#fff" stroke-width="2"/>';
        s += '<text x="' + px(1) + '" y="' + (py(2) + 18) + '" text-anchor="middle" font-size="11" font-weight="800" fill="' + (isIn ? '#15803d' : '#64748b') + '">頂點(1,2)' + (isIn ? '✔在牆內' : '✕在牆外') + '</text>';

        // Endpoints
        var ya = (a - 1) * (a - 1) + 2;
        var yb = (b - 1) * (b - 1) + 2;
        s += '<circle cx="' + px(a) + '" cy="' + py(ya) + '" r="5.5" fill="' + (isIn ? '#2563eb' : '#16a34a') + '" stroke="#fff" stroke-width="1.5"/>';
        s += '<circle cx="' + px(b) + '" cy="' + py(yb) + '" r="6" fill="#ea580c" stroke="#fff" stroke-width="2"/>';
        s += '<text x="' + (px(b) - 4) + '" y="' + (py(yb) - 8) + '" text-anchor="end" font-size="11.5" font-weight="800" fill="#c2410c">最高(' + b + ',' + yb + ')</text>';
        if (!isIn) {
          s += '<text x="' + (px(a) - 6) + '" y="' + (py(ya) - 8) + '" text-anchor="end" font-size="11.5" font-weight="800" fill="#15803d">最低(' + a + ',' + ya + ')</text>';
        }

        // Right summary card
        s += card(338, 14, 284, 240, '#ffffff', isIn ? '#22c55e' : '#ef4444', 10);
        s += pill(354, 26, 252, 30, 'y = (x − 1)² + 2，限定 ' + a + ' ≤ x ≤ ' + b, '#eff6ff', '#1e40af', '#60a5fa', 13);
        if (isIn) {
          s += '<text x="354" y="82" font-size="14" font-weight="800" fill="#166534">✅ 情況 ①：頂點 x=1 落在牆內！</text>';
          s += '<text x="354" y="110" font-size="13" fill="#334155">• 最小值就在頂點：x = 1 → y = 2</text>';
          s += '<text x="354" y="136" font-size="13" fill="#334155">• 最大值在離頂點最遠端點 x = 4：</text>';
          s += '<text x="364" y="158" font-size="13.5" font-weight="800" fill="#c2410c">y = (4−1)² + 2 = 11</text>';
          s += pill(354, 182, 252, 54, '結論：範圍 2 ≤ y ≤ 11\n（最小值 = 2，最大值 = 11）', '#dcfce7', '#166534', '#22c55e', 13);
        } else {
          s += '<text x="354" y="82" font-size="14" font-weight="800" fill="#b91c1c">🚨 情況 ②：頂點 x=1 被切在牆外！</text>';
          s += '<text x="354" y="110" font-size="13" fill="#dc2626" font-weight="700">不可直接答最小值 = 2（x=1 不能用！）</text>';
          s += '<text x="354" y="136" font-size="13" fill="#334155">• 改代左牆 x = 3 → 最小值 y = 6</text>';
          s += '<text x="354" y="160" font-size="13" fill="#334155">• 再代右牆 x = 5 → 最大值 y = 18</text>';
          s += pill(354, 182, 252, 54, '結論：範圍 6 ≤ y ≤ 18\n（極值全發生在兩側端點！）', '#fef2f2', '#991b1b', '#ef4444', 13);
        }
        return s;
      }

      function render() {
        var controls = '<div class="hb-vis-controls">' +
          '<button type="button" class="hb-vis-btn' + (mode === 'shift' ? ' active' : '') + '" data-m="shift">➡ 平移（括號歸零箭頭）</button>' +
          '<button type="button" class="hb-vis-btn' + (mode === 'crop' ? ' active' : '') + '" data-m="crop">🧱 限制範圍切牆求極值</button>' +
          '<span style="color:#cbd5e1;">|</span>';

        if (mode === 'shift') {
          controls += shiftPresets.map(function (p, i) {
            return '<button type="button" class="hb-vis-btn' + (i === sIdx ? ' active' : '') + '" data-si="' + i + '">' + esc(p.label) + '</button>';
          }).join('');
        } else {
          controls += '<button type="button" class="hb-vis-btn' + (cropMode === 'inside' ? ' active' : '') + '" data-cm="inside">情境 ①：頂點在 [0, 4] 內</button>' +
            '<button type="button" class="hb-vis-btn' + (cropMode === 'outside' ? ' active' : '') + '" data-cm="outside">情境 ②：頂點被切在 [3, 5] 外！</button>';
        }
        controls += '</div>';

        var readout = mode === 'shift'
          ? '<strong>💡 平移核心：</strong>' + shiftPresets[sIdx].tip
          : (cropMode === 'inside'
            ? '<strong>✅ 切牆口訣：</strong>求限定區間極值「先看頂點在不在牆內」！本題 x=1 在 [0, 4] 內，所以頂點就是最小值，離頂點較遠的端點 x=4 是最大值。'
            : '<strong>🚨 會考壓軸陷阱：</strong>看到頂點 x=1 不在 [3, 5] 裡時，頂點直接作廢！整段藍色曲線單調遞增，最小值在 x=3、最大值在 x=5！');

        el.innerHTML = controls + svgWrap(mode === 'shift' ? renderShift() : renderCrop(), 268) +
          '<div class="hb-vis-readout">' + readout + '</div>';

        el.querySelectorAll('[data-m]').forEach(function (b) {
          b.addEventListener('click', function () { mode = b.getAttribute('data-m'); render(); });
        });
        el.querySelectorAll('[data-si]').forEach(function (b) {
          b.addEventListener('click', function () { sIdx = Number(b.getAttribute('data-si')); render(); });
        });
        el.querySelectorAll('[data-cm]').forEach(function (b) {
          b.addEventListener('click', function () { cropMode = b.getAttribute('data-cm'); render(); });
        });
      }

      render();
      return null;
    }
  };

  /* ========================================================================
     18. MATH_9_3_5 — 盒狀圖「每段必占 25%」點陣證明 ＆ 放回／不放回樹狀圖
     ======================================================================== */
  V['MATH_9_3_5'] = {
    title: '🎨 盒狀圖「每段 25% 點陣揭密」＆ 抽球放回／不放回機率樹狀圖',
    subtitle: '用 20 位學生真實分數圓點直接粉碎「盒子長＝人數多」迷思，並比較抽球「放回 vs 不放回」分母如何變化！',
    mount: function (el) {
      var mode = 'box'; // 'box' | 'tree'
      var replace = true; // true: with replacement, false: without replacement

      function renderBox() {
        // 20 students: Min=44, Q1=68, Q2=72 (VERY NARROW 4 pts!), Q3=92 (VERY WIDE 20 pts!), Max=98
        // 5 dots in each quarter!
        var qDots = [
          [44, 50, 56, 61, 66],       // Q0..Q1 (5 dots)
          [68.4, 69.2, 70.0, 70.8, 71.6], // Q1..Q2 (5 densely packed dots!)
          [74, 78, 83, 87, 91],       // Q2..Q3 (5 spread-out dots!)
          [93, 94.5, 96, 97, 98]      // Q3..Max (5 dots)
        ];
        var padL = 46, padR = 602, axisY = 224;
        function tx(v) { return padL + ((v - 40) / 60) * (padR - padL); }

        var s = '';
        s += pill(18, 10, 415, 28, '全班 20 位學生段考成績：每段固定 5 人（= 25%），與格子寬窄無關！', '#eff6ff', '#1e40af', '#93c5fd', 12.5);
        s += pill(444, 10, 178, 28, 'IQR = Q3 − Q1 = 24', '#f0fdf4', '#166534', '#4ade80', 12.5);

        // Background quarter bands
        var bounds = [44, 68, 72, 92, 98];
        var fills = ['rgba(148,163,184,0.10)', 'rgba(239,68,68,0.14)', 'rgba(37,99,235,0.12)', 'rgba(34,197,94,0.12)'];
        var dotColors = ['#475569', '#dc2626', '#2563eb', '#16a34a'];
        for (var q = 0; q < 4; q++) {
          var x1 = tx(bounds[q]), x2 = tx(bounds[q + 1]);
          s += '<rect x="' + x1.toFixed(1) + '" y="48" width="' + (x2 - x1).toFixed(1) + '" height="172" fill="' + fills[q] + '"/>';
        }

        // Student dots above boxplot (y=78..112; stagger narrow band vertically so all 5 dots are crystal clear!)
        qDots.forEach(function (arr, qi) {
          arr.forEach(function (score, di) {
            var dx = tx(score);
            var dy = qi === 1 ? (64 + di * 11.5) : 90;
            s += '<circle cx="' + dx.toFixed(1) + '" cy="' + dy + '" r="5" fill="' + dotColors[qi] + '" stroke="#fff" stroke-width="1.3"/>';
          });
        });

        // Callout arrows comparing narrow Q1-Q2 vs wide Q2-Q3
        s += pill(tx(70) - 70, 126, 140, 22, '極窄 4 分：擠著 5 人 (25%)', '#fef2f2', '#b91c1c', '#f87171', 11);
        s += pill(tx(82) - 76, 126, 152, 22, '超寬 20 分：一樣 5 人 (25%)', '#dbeafe', '#1e40af', '#60a5fa', 11);

        // Boxplot itself at y=162..196
        var byTop = 162, byMid = 179, byBot = 196;
        // Whiskers
        s += '<line x1="' + tx(44) + '" y1="' + byMid + '" x2="' + tx(68) + '" y2="' + byMid + '" stroke="#334155" stroke-width="2.5"/>';
        s += '<line x1="' + tx(92) + '" y1="' + byMid + '" x2="' + tx(98) + '" y2="' + byMid + '" stroke="#334155" stroke-width="2.5"/>';
        s += '<line x1="' + tx(44) + '" y1="' + (byMid - 12) + '" x2="' + tx(44) + '" y2="' + (byMid + 12) + '" stroke="#334155" stroke-width="2.5"/>';
        s += '<line x1="' + tx(98) + '" y1="' + (byMid - 12) + '" x2="' + tx(98) + '" y2="' + (byMid + 12) + '" stroke="#334155" stroke-width="2.5"/>';
        // Boxes Q1-Q2 and Q2-Q3
        s += '<rect x="' + tx(68) + '" y="' + byTop + '" width="' + (tx(72) - tx(68)) + '" height="' + (byBot - byTop) + '" fill="#fecaca" stroke="#dc2626" stroke-width="2.5"/>';
        s += '<rect x="' + tx(72) + '" y="' + byTop + '" width="' + (tx(92) - tx(72)) + '" height="' + (byBot - byTop) + '" fill="#bfdbfe" stroke="#2563eb" stroke-width="2.5"/>';
        // Median line Q2
        s += '<line x1="' + tx(72) + '" y1="' + (byTop - 3) + '" x2="' + tx(72) + '" y2="' + (byBot + 3) + '" stroke="#0f172a" stroke-width="3.2"/>';

        // Labels for Min, Q1, Q2, Q3, Max
        var lbls = [[44, 'Min 44'], [68, 'Q₁ 68'], [72, 'Q₂ 72'], [92, 'Q₃ 92'], [98, 'Max 98']];
        lbls.forEach(function (lb, i) {
          var lx = tx(lb[0]);
          var ly = i === 1 ? 212 : (i === 2 ? 156 : 212);
          s += '<text x="' + lx.toFixed(1) + '" y="' + ly + '" text-anchor="middle" font-size="11" font-weight="800" fill="#0f172a">' + lb[1] + '</text>';
        });

        // Score axis
        s += '<line x1="36" y1="' + axisY + '" x2="612" y2="' + axisY + '" stroke="#475569" stroke-width="2"/>';
        for (var v = 40; v <= 100; v += 10) {
          var vx = tx(v);
          s += '<line x1="' + vx + '" y1="' + (axisY - 4) + '" x2="' + vx + '" y2="' + (axisY + 4) + '" stroke="#64748b" stroke-width="1.5"/>';
          s += '<text x="' + vx + '" y="' + (axisY + 18) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="#475569">' + v + '分</text>';
        }
        return s;
      }

      function renderTree() {
        var s = '';
        s += pill(18, 12, 375, 28, replace ? '袋中有 3 紅 2 白（共 5 球）— 取後【放回】（分母恆為 5）' : '袋中有 3 紅 2 白（共 5 球）— 取後【不放回】（第 2 次分母變 4！）',
          replace ? '#eff6ff' : '#fef2f2', replace ? '#1e40af' : '#991b1b', replace ? '#60a5fa' : '#f87171', 12.5);

        // Start node
        s += pill(20, 128, 84, 34, '3 紅 2 白', '#f1f5f9', '#0f172a', '#94a3b8', 13);

        // Stage 1 nodes: Red (196, 86), White (196, 204)
        s += '<line x1="104" y1="145" x2="178" y2="88" stroke="#dc2626" stroke-width="2.6"/>';
        s += '<line x1="104" y1="145" x2="178" y2="202" stroke="#2563eb" stroke-width="2.6"/>';
        s += pill(116, 92, 42, 20, '3/5', '#fee2e2', '#b91c1c', '#f87171', 11.5);
        s += pill(116, 178, 42, 20, '2/5', '#dbeafe', '#1e40af', '#60a5fa', 11.5);

        s += pill(178, 72, 72, 30, '第1次 紅', '#fee2e2', '#991b1b', '#ef4444', 12.5);
        s += pill(178, 188, 72, 30, '第1次 白', '#dbeafe', '#1e40af', '#3b82f6', 12.5);

        // Stage 2 branches
        var branches = replace
          ? [
              { y1: 87, y2: 64, lbl: '3/5', node: '第2次 紅', c: '#dc2626', res: '紅紅 = 3/5 × 3/5 = 9/25' },
              { y1: 87, y2: 118, lbl: '2/5', node: '第2次 白', c: '#2563eb', res: '紅白 = 3/5 × 2/5 = 6/25' },
              { y1: 203, y2: 174, lbl: '3/5', node: '第2次 紅', c: '#dc2626', res: '白紅 = 2/5 × 3/5 = 6/25' },
              { y1: 203, y2: 228, lbl: '2/5', node: '第2次 白', c: '#2563eb', res: '白白 = 2/5 × 2/5 = 4/25' }
            ]
          : [
              { y1: 87, y2: 64, lbl: '2/4', node: '第2次 紅', c: '#dc2626', res: '紅紅 = 3/5 × 2/4 = 6/20 (3/10)' },
              { y1: 87, y2: 118, lbl: '2/4', node: '第2次 白', c: '#2563eb', res: '紅白 = 3/5 × 2/4 = 6/20 (3/10)' },
              { y1: 203, y2: 174, lbl: '3/4', node: '第2次 紅', c: '#dc2626', res: '白紅 = 2/5 × 3/4 = 6/20 (3/10)' },
              { y1: 203, y2: 228, lbl: '1/4', node: '第2次 白', c: '#2563eb', res: '白白 = 2/5 × 1/4 = 2/20 (1/10)' }
            ];

        branches.forEach(function (br) {
          s += '<line x1="250" y1="' + br.y1 + '" x2="342" y2="' + br.y2 + '" stroke="' + br.c + '" stroke-width="2.4"/>';
          s += pill(278, (br.y1 + br.y2) / 2 - 11, 40, 20, br.lbl, replace ? '#f8fafc' : '#fef3c7', replace ? '#334155' : '#92400e', replace ? '#cbd5e1' : '#f59e0b', 11.5);
          s += pill(342, br.y2 - 13, 68, 26, br.node, br.c === '#dc2626' ? '#fee2e2' : '#dbeafe', br.c === '#dc2626' ? '#991b1b' : '#1e40af', br.c, 11.5);
          s += pill(418, br.y2 - 13, 204, 26, br.res, '#f8fafc', '#0f172a', '#cbd5e1', 11.5);
        });

        s += '<text x="520" y="258" text-anchor="middle" font-size="11.5" font-weight="800" fill="#15803d">✔ 總機率相加恆等於 1</text>';
        return s;
      }

      function render() {
        var controls = '<div class="hb-vis-controls">' +
          '<button type="button" class="hb-vis-btn' + (mode === 'box' ? ' active' : '') + '" data-m="box">📦 盒狀圖每段 25% 點陣揭密</button>' +
          '<button type="button" class="hb-vis-btn' + (mode === 'tree' ? ' active' : '') + '" data-m="tree">🌳 放回 vs 不放回機率樹狀圖</button>';

        if (mode === 'tree') {
          controls += '<span style="color:#cbd5e1;">|</span>' +
            '<button type="button" class="hb-vis-btn' + (replace ? ' active' : '') + '" data-r="1">取後放回（分母 5 → 5）</button>' +
            '<button type="button" class="hb-vis-btn' + (!replace ? ' active' : '') + '" data-r="0">取後不放回（分母 5 → 4！）</button>';
        }
        controls += '</div>';

        var readout = mode === 'box'
          ? '<strong>🔥 會考頭號迷思破解：</strong>盒狀圖每一段的「寬度」只代表分數分散程度（越窄代表大家分數越擠在一起），不代表人數多寡！無論多窄（Q₁~Q₂ 僅 4 分）或多寬（Q₂~Q₃ 達 20 分），每一段永遠都是剛好 25% 的人（本圖皆為 5 顆圓點）！'
          : (replace
            ? '<strong>取後放回（獨立事件）：</strong>球放回袋子後總數仍是 5 球，第 2 次抽球機率不受第 1 次影響，分母維持 5 × 5 = 25。'
            : '<strong>取後不放回（相依事件）：</strong>第 1 次拿走 1 球後袋內只剩 4 球，因此第 2 次所有分母全部變 4！且抽同色球時分子也會減 1（如白白 = 2/5 × 1/4 = 1/10）！');

        el.innerHTML = controls + svgWrap(mode === 'box' ? renderBox() : renderTree(), 266) +
          '<div class="hb-vis-readout">' + readout + '</div>';

        el.querySelectorAll('[data-m]').forEach(function (b) {
          b.addEventListener('click', function () { mode = b.getAttribute('data-m'); render(); });
        });
        el.querySelectorAll('[data-r]').forEach(function (b) {
          b.addEventListener('click', function () { replace = b.getAttribute('data-r') === '1'; render(); });
        });
      }

      render();
      return null;
    }
  };

})(window);
