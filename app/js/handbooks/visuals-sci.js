/* ==========================================================================
   visuals-sci.js — 國中自然全 16 單元專屬互動 SVG 圖例與動態推演引擎
   掛載於 window.JuniorHandbookVisuals[unitId]
   ========================================================================== */
(function (global) {
  'use strict';

  global.JuniorHandbookVisuals = global.JuniorHandbookVisuals || {};

  var FONT = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

  /* ========================================================================
     1. SCI_7_1_1 — 細胞構造與物質進出
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_7_1_1'] = {
    title: '🔬 顯微鏡倒像移片 ＆ 滲透作用雙細胞對照',
    subtitle: '點擊視野象限實測玻片移動方向，並切換不同濃度溶液觀察紅血球與植物細胞變化',
    mount: function (el) {
      var mode = 'scope';
      var quad = 'tr';
      var sol = 'water';

      var QUADS = {
        tl: { label: '左上方', cx: 112, cy: 96, dx: -1, dy: -1, dirText: '左上方', oppText: '右下方' },
        tr: { label: '右上方', cx: 198, cy: 96, dx: 1, dy: -1, dirText: '右上方', oppText: '左下方' },
        bl: { label: '左下方', cx: 112, cy: 174, dx: -1, dy: 1, dirText: '左下方', oppText: '右上方' },
        br: { label: '右下方', cx: 198, cy: 174, dx: 1, dy: 1, dirText: '右下方', oppText: '左上方' }
      };

      var SOLS = {
        water: {
          name: '低張溶液：清水',
          arrowDir: 'in',
          rbcState: '吸水膨脹 → 脹破（溶血）',
          plantState: '吸水膨脹 → 維持完整（細胞壁保護）',
          rbcColor: '#ef4444',
          note: '外界水分子濃度高於細胞內 → 水分淨流入細胞。動物紅血球無細胞壁會脹破；植物細胞有堅硬細胞壁保護，只會變飽滿不會破裂！'
        },
        saline: {
          name: '等張溶液：0.9% 生理食鹽水',
          arrowDir: 'eq',
          rbcState: '進出速率相等 → 維持雙凹圓盤',
          plantState: '進出速率相等 → 維持原狀',
          rbcColor: '#dc2626',
          note: '細胞內外滲透壓相等 → 水分子「仍有進出」，但進入速率＝離開速率（動態平衡），細胞體積維持不變。'
        },
        salt: {
          name: '高張溶液：濃食鹽水',
          arrowDir: 'out',
          rbcState: '失水萎縮 → 表面皺縮',
          plantState: '失水萎縮 → 質離（細胞膜與壁分離）',
          rbcColor: '#b91c1c',
          note: '外界溶質濃度高、水濃度低 → 水分淨流出細胞。紅血球萎縮皺縮；植物細胞壁外框不變，但內部細胞膜向內縮離細胞壁（質離現象）！'
        }
      };

      function render() {
        var html =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'scope' ? 'active' : '') + '" data-mode="scope">🔬 複式顯微鏡倒像移片</button>' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'osmosis' ? 'active' : '') + '" data-mode="osmosis">💧 滲透作用（紅血球 vs 植物細胞）</button>' +
          '</div>';

        if (mode === 'scope') {
          var q = QUADS[quad];
          var sx = 470, sy = 136;
          var ex = sx + q.dx * 54, ey = sy + q.dy * 42;
          html +=
            '<div class="hb-vis-controls">' +
              '<span style="font-size:0.82rem;color:#475569;font-weight:700;">選擇物像在視野的位置：</span>' +
              ['tl', 'tr', 'bl', 'br'].map(function (k) {
                return '<button type="button" class="hb-vis-btn ' + (quad === k ? 'active' : '') + '" data-quad="' + k + '">' + QUADS[k].label + '</button>';
              }).join('') +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="複式顯微鏡倒像移片示意圖">' +
              '<defs>' +
                '<marker id="s711-arr-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#0284c7"/></marker>' +
                '<marker id="s711-arr-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/></marker>' +
              '</defs>' +
              '<rect x="14" y="12" width="284" height="246" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>' +
              '<text x="155" y="33" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a" font-family="' + FONT + '">👁 顯微鏡視野（點擊象限切換）</text>' +
              '<circle cx="155" cy="138" r="88" fill="#ffffff" stroke="#334155" stroke-width="3"/>' +
              '<line x1="67" y1="138" x2="243" y2="138" stroke="#cbd5e1" stroke-dasharray="4 3"/>' +
              '<line x1="155" y1="50" x2="155" y2="226" stroke="#cbd5e1" stroke-dasharray="4 3"/>' +
              '<circle cx="155" cy="138" r="5" fill="none" stroke="#94a3b8" stroke-width="1.5"/>' +
              // clickable quadrants
              '<rect x="67" y="50" width="88" height="88" fill="transparent" style="cursor:pointer" data-qhit="tl"/>' +
              '<rect x="155" y="50" width="88" height="88" fill="transparent" style="cursor:pointer" data-qhit="tr"/>' +
              '<rect x="67" y="138" width="88" height="88" fill="transparent" style="cursor:pointer" data-qhit="bl"/>' +
              '<rect x="155" y="138" width="88" height="88" fill="transparent" style="cursor:pointer" data-qhit="br"/>' +
              '<text x="106" y="75" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="' + FONT + '">左上</text>' +
              '<text x="204" y="75" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="' + FONT + '">右上</text>' +
              '<text x="106" y="210" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="' + FONT + '">左下</text>' +
              '<text x="204" y="210" text-anchor="middle" font-size="10" fill="#94a3b8" font-family="' + FONT + '">右下</text>' +
              // cell object in selected quadrant
              '<ellipse cx="' + q.cx + '" cy="' + q.cy + '" rx="20" ry="14" fill="#dcfce7" stroke="#059669" stroke-width="2.5"/>' +
              '<circle cx="' + (q.cx - 4) + '" cy="' + q.cy + '" r="5" fill="#047857"/>' +
              // movement of image back to center
              '<line x1="' + (q.cx - q.dx * 16) + '" y1="' + (q.cy - q.dy * 12) + '" x2="' + (155 + q.dx * 12) + '" y2="' + (138 + q.dy * 10) + '" stroke="#0284c7" stroke-width="2.5" stroke-dasharray="5 3" marker-end="url(#s711-arr-blue)"/>' +
              '<text x="155" y="246" text-anchor="middle" font-size="11" fill="#0284c7" font-weight="700" font-family="' + FONT + '">目標：讓物像往「' + q.oppText + '」移回正中央</text>' +

              // Right panel: Stage & Slide push direction
              '<rect x="314" y="12" width="312" height="246" rx="12" fill="#fffbeb" stroke="#fcd34d"/>' +
              '<text x="470" y="33" text-anchor="middle" font-size="13" font-weight="800" fill="#92400e" font-family="' + FONT + '">🖐️ 載物臺玻片實際推動方向</text>' +
              '<rect x="355" y="72" width="230" height="128" rx="8" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>' +
              '<rect x="435" y="106" width="70" height="60" rx="4" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.5"/>' +
              '<circle cx="' + sx + '" cy="' + sy + '" r="6" fill="#dc2626"/>' +
              '<line x1="' + sx + '" y1="' + sy + '" x2="' + ex + '" y2="' + ey + '" stroke="#dc2626" stroke-width="4" marker-end="url(#s711-arr-red)"/>' +
              '<rect x="342" y="210" width="256" height="34" rx="8" fill="#fef2f2" stroke="#fca5a5"/>' +
              '<text x="470" y="232" text-anchor="middle" font-size="13" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">玻片往「' + q.dirText + '」推！（物在哪就往哪推）</text>' +
              '<text x="470" y="60" text-anchor="middle" font-size="11" fill="#64748b" font-family="' + FONT + '">複式顯微鏡呈 180° 倒像：玻片字「p」→ 視野見「d」</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>🎯 考場口訣：「物在何方，片推何方」</strong><br>' +
              '目前視野中的標本位在<strong>' + q.label + '</strong>，想移回中央必須讓「像」往' + q.oppText + '跑；由於複式顯微鏡呈現<strong>上下左右完全顛倒</strong>的倒像，玻片移動方向與像相反，因此實際上要把玻片往<strong>' + q.dirText + '</strong>推！' +
            '</div>';
        } else {
          var s = SOLS[sol];
          var rbcSvg = '';
          var plantSvg = '';
          if (sol === 'water') {
            rbcSvg =
              '<circle cx="160" cy="142" r="56" fill="#fee2e2" stroke="#dc2626" stroke-width="3" stroke-dasharray="10 5"/>' +
              '<path d="M122,110 L132,126 M198,112 L185,126 M160,82 L160,96 M160,202 L160,188" stroke="#dc2626" stroke-width="2.5"/>' +
              '<text x="160" y="138" text-anchor="middle" font-size="13" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">💥 脹破溶血！</text>' +
              '<text x="160" y="156" text-anchor="middle" font-size="11" fill="#7f1d1d" font-family="' + FONT + '">（無細胞壁保護）</text>';
            plantSvg =
              '<rect x="415" y="88" width="130" height="108" rx="14" fill="#dcfce7" stroke="#15803d" stroke-width="5"/>' +
              '<rect x="422" y="95" width="116" height="94" rx="10" fill="#bbf7d0" stroke="#059669" stroke-width="2"/>' +
              '<ellipse cx="480" cy="142" rx="40" ry="28" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>' +
              '<text x="480" y="146" text-anchor="middle" font-size="12" font-weight="800" fill="#0369a1" font-family="' + FONT + '">液胞飽滿膨脹</text>';
          } else if (sol === 'saline') {
            rbcSvg =
              '<ellipse cx="160" cy="142" rx="46" ry="30" fill="#fecaca" stroke="#dc2626" stroke-width="3"/>' +
              '<ellipse cx="160" cy="142" rx="22" ry="11" fill="#fca5a5" stroke="#ef4444" stroke-width="1.5"/>' +
              '<text x="160" y="196" text-anchor="middle" font-size="12" font-weight="700" fill="#0f172a" font-family="' + FONT + '">維持雙凹圓盤狀</text>';
            plantSvg =
              '<rect x="415" y="88" width="130" height="108" rx="14" fill="#dcfce7" stroke="#15803d" stroke-width="5"/>' +
              '<rect x="425" y="98" width="110" height="88" rx="9" fill="#bbf7d0" stroke="#059669" stroke-width="2"/>' +
              '<ellipse cx="480" cy="142" rx="30" ry="20" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.5"/>' +
              '<text x="480" y="146" text-anchor="middle" font-size="11" font-weight="700" fill="#0369a1" font-family="' + FONT + '">液胞正常</text>';
          } else {
            rbcSvg =
              '<polygon points="160,112 173,124 190,120 183,138 195,152 177,156 172,172 158,162 142,170 140,154 125,148 138,136 132,120 149,124" fill="#fca5a5" stroke="#b91c1c" stroke-width="2.5"/>' +
              '<text x="160" y="196" text-anchor="middle" font-size="12" font-weight="800" fill="#991b1b" font-family="' + FONT + '">失水萎縮皺縮</text>';
            plantSvg =
              '<rect x="415" y="88" width="130" height="108" rx="14" fill="#f1f5f9" stroke="#15803d" stroke-width="5"/>' +
              '<path d="M442,115 Q480,104 518,116 Q510,142 516,168 Q480,178 444,167 Q450,142 442,115 Z" fill="#bbf7d0" stroke="#059669" stroke-width="2.5"/>' +
              '<ellipse cx="480" cy="142" rx="16" ry="11" fill="#e0f2fe" stroke="#0284c7"/>' +
              '<text x="480" y="213" text-anchor="middle" font-size="11" font-weight="800" fill="#15803d" font-family="' + FONT + '">細胞壁不變，膜縮離（質離）</text>';
          }

          var waterArrows = '';
          if (sol === 'water') {
            waterArrows =
              '<text x="80" y="146" font-size="11" font-weight="800" fill="#0284c7" font-family="' + FONT + '">H₂O 進→</text>' +
              '<text x="206" y="146" font-size="11" font-weight="800" fill="#0284c7" font-family="' + FONT + '">←進 H₂O</text>' +
              '<text x="358" y="146" font-size="11" font-weight="800" fill="#0284c7" font-family="' + FONT + '">H₂O 進→</text>' +
              '<text x="550" y="146" font-size="11" font-weight="800" fill="#0284c7" font-family="' + FONT + '">←進 H₂O</text>';
          } else if (sol === 'saline') {
            waterArrows =
              '<text x="66" y="146" font-size="11" font-weight="700" fill="#0284c7" font-family="' + FONT + '">H₂O ⇄</text>' +
              '<text x="218" y="146" font-size="11" font-weight="700" fill="#0284c7" font-family="' + FONT + '">⇄ H₂O</text>' +
              '<text x="366" y="146" font-size="11" font-weight="700" fill="#0284c7" font-family="' + FONT + '">H₂O ⇄</text>' +
              '<text x="552" y="146" font-size="11" font-weight="700" fill="#0284c7" font-family="' + FONT + '">⇄ H₂O</text>';
          } else {
            waterArrows =
              '<text x="68" y="146" font-size="11" font-weight="800" fill="#d97706" font-family="' + FONT + '">←出 H₂O</text>' +
              '<text x="205" y="146" font-size="11" font-weight="800" fill="#d97706" font-family="' + FONT + '">H₂O 出→</text>' +
              '<text x="356" y="146" font-size="11" font-weight="800" fill="#d97706" font-family="' + FONT + '">←出 H₂O</text>' +
              '<text x="550" y="146" font-size="11" font-weight="800" fill="#d97706" font-family="' + FONT + '">H₂O 出→</text>';
          }

          html +=
            '<div class="hb-vis-controls">' +
              ['water', 'saline', 'salt'].map(function (k) {
                return '<button type="button" class="hb-vis-btn ' + (sol === k ? 'active' : '') + '" data-sol="' + k + '">' + SOLS[k].name + '</button>';
              }).join('') +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="滲透作用紅血球與植物細胞比較圖">' +
              '<rect x="16" y="16" width="290" height="238" rx="12" fill="#fef2f2" stroke="#fecaca"/>' +
              '<text x="161" y="42" text-anchor="middle" font-size="14" font-weight="800" fill="#991b1b" font-family="' + FONT + '">🩸 動物紅血球（無細胞壁）</text>' +
              '<text x="161" y="62" text-anchor="middle" font-size="11" fill="#64748b" font-family="' + FONT + '">' + s.name + '</text>' +
              rbcSvg +
              '<rect x="334" y="16" width="290" height="238" rx="12" fill="#f0fdf4" stroke="#bbf7d0"/>' +
              '<text x="479" y="42" text-anchor="middle" font-size="14" font-weight="800" fill="#166534" font-family="' + FONT + '">🌿 植物細胞（有細胞壁）</text>' +
              '<text x="479" y="62" text-anchor="middle" font-size="11" fill="#64748b" font-family="' + FONT + '">' + s.name + '</text>' +
              plantSvg +
              waterArrows +
              '<text x="161" y="240" text-anchor="middle" font-size="11.5" font-weight="700" fill="#b91c1c" font-family="' + FONT + '">' + s.rbcState + '</text>' +
              '<text x="479" y="240" text-anchor="middle" font-size="11.5" font-weight="700" fill="#15803d" font-family="' + FONT + '">' + s.plantState + '</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>💧 滲透判讀：</strong>' + s.note +
            '</div>' +
            '<table class="hb-vis-table">' +
              '<thead><tr><th>溶液種類</th><th>水分淨流向</th><th>動物紅血球</th><th>植物細胞</th></tr></thead>' +
              '<tbody>' +
                '<tr class="' + (sol === 'water' ? 'vis-row-active' : '') + '"><td>清水（低張）</td><td>水進入細胞</td><td>吸水膨脹破裂</td><td>膨脹但不破裂（有細胞壁）</td></tr>' +
                '<tr class="' + (sol === 'saline' ? 'vis-row-active' : '') + '"><td>0.9% 生理食鹽水（等張）</td><td>進出速率相等</td><td>維持雙凹圓盤</td><td>維持原狀</td></tr>' +
                '<tr class="' + (sol === 'salt' ? 'vis-row-active' : '') + '"><td>濃食鹽水（高張）</td><td>水流出細胞</td><td>萎縮皺縮</td><td>質離（細胞壁形狀不變）</td></tr>' +
              '</tbody>' +
            '</table>';
        }

        el.innerHTML = html;
        el.querySelectorAll('[data-mode]').forEach(function (b) {
          b.addEventListener('click', function () { mode = b.getAttribute('data-mode'); render(); });
        });
        el.querySelectorAll('[data-quad]').forEach(function (b) {
          b.addEventListener('click', function () { quad = b.getAttribute('data-quad'); render(); });
        });
        el.querySelectorAll('[data-qhit]').forEach(function (r) {
          r.addEventListener('click', function () { quad = r.getAttribute('data-qhit'); render(); });
        });
        el.querySelectorAll('[data-sol]').forEach(function (b) {
          b.addEventListener('click', function () { sol = b.getAttribute('data-sol'); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     2. SCI_7_1_2 — 光合作用與消化系統
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_7_1_2'] = {
    title: '🌿 光合作用雙階段流程 ＆ 酵素溫度活性曲線',
    subtitle: '區分光反應與碳反應的原料產物，以及酵素低溫休眠（可逆）vs 高溫變性（不可逆）',
    mount: function (el) {
      var mode = 'photo';
      var phase = 'all';
      var tempMode = '37';

      var TEMPS = {
        '0': {
          t: 0, x: 75, y: 206, act: '極低（約 5%）', shape: 'intact',
          title: '0°C 低溫休眠（活性低、構造完整）',
          desc: '低溫只是讓分子碰撞減慢，酵素蛋白質結構<strong>沒有被破壞</strong>！一旦放回 37°C 溫水中，酵素活性即可完全恢復（可逆）。'
        },
        '37': {
          t: 37, x: 205, y: 66, act: '最高（100%）', shape: 'intact',
          title: '37°C 人體酵素最適溫度（活性巔峰）',
          desc: '人體消化酵素（如唾液澱粉酶、胃蛋白酶）在體溫 37°C 附近反應速率最快；注意胃蛋白酶最適 pH≈2（強酸），腸液酵素最適偏弱鹼！'
        },
        '70': {
          t: 70, x: 320, y: 215, act: '0%（永久失活）', shape: 'denatured',
          title: '70°C 以上高溫變性（結構破壞、不可逆）',
          desc: '高溫會永久破壞酵素的蛋白質立體結構（像煮熟的蛋白無法變回生蛋白）。即使再降溫回到 37°C，活性仍維持 <strong>0% 無法恢復</strong>！'
        }
      };

      function render() {
        var html =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'photo' ? 'active' : '') + '" data-mode="photo">🌿 光合作用光反應／碳反應</button>' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'enzyme' ? 'active' : '') + '" data-mode="enzyme">🌡️ 酵素溫度活性曲線</button>' +
          '</div>';

        if (mode === 'photo') {
          var hiL = (phase === 'all' || phase === 'light') ? 1 : 0.3;
          var hiC = (phase === 'all' || phase === 'carbon') ? 1 : 0.3;
          var readout = phase === 'light'
            ? '<strong>☀️ 光反應：</strong>由葉綠體內的<strong>葉綠素</strong>吸收光能，將水分子（H₂O）分解產生<strong>氧氣（O₂，由氣孔釋出）</strong>與能量，傳遞給碳反應使用。'
            : (phase === 'carbon'
              ? '<strong>🍃 碳反應：</strong>不需直接照光，利用光反應提供的<strong>能量</strong>與<strong>酵素</strong>，將氣孔進入的二氧化碳（CO₂）合成<strong>葡萄糖（C₆H₁₂O₆）</strong>與水（H₂O）。'
              : '<strong>🌿 總反應：</strong>水（H₂O）＋二氧化碳（CO₂）→（光能＋葉綠體）→ 葡萄糖 ＋ 氧氣（O₂）＋ 水。氧氣全部來自<strong>水</strong>，葡萄糖的碳來自<strong>CO₂</strong>！');

          html +=
            '<div class="hb-vis-controls">' +
              '<button type="button" class="hb-vis-btn ' + (phase === 'all' ? 'active' : '') + '" data-phase="all">全流程總覽</button>' +
              '<button type="button" class="hb-vis-btn ' + (phase === 'light' ? 'active' : '') + '" data-phase="light">① 光反應（水→O₂＋能量）</button>' +
              '<button type="button" class="hb-vis-btn ' + (phase === 'carbon' ? 'active' : '') + '" data-phase="carbon">② 碳反應（CO₂→葡萄糖）</button>' +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="光合作用光反應與碳反應流程圖">' +
              '<defs>' +
                '<marker id="s712-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#0f172a"/></marker>' +
                '<marker id="s712-arr-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#d97706"/></marker>' +
              '</defs>' +
              // Chloroplast container
              '<rect x="74" y="48" width="492" height="176" rx="28" fill="#f0fdf4" stroke="#16a34a" stroke-width="3"/>' +
              '<text x="320" y="70" text-anchor="middle" font-size="13" font-weight="800" fill="#15803d" font-family="' + FONT + '">葉綠體內部（光合作用工廠）</text>' +
              // Light reaction block
              '<g opacity="' + hiL + '">' +
                '<rect x="108" y="92" width="166" height="96" rx="14" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>' +
                '<text x="191" y="118" text-anchor="middle" font-size="14" font-weight="800" fill="#92400e" font-family="' + FONT + '">① 光反應</text>' +
                '<text x="191" y="139" text-anchor="middle" font-size="11.5" fill="#78350f" font-family="' + FONT + '">葉綠素吸收太陽能</text>' +
                '<text x="191" y="158" text-anchor="middle" font-size="11.5" fill="#78350f" font-family="' + FONT + '">分解水分子 H₂O</text>' +
                '<text x="191" y="177" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309" font-family="' + FONT + '">釋放 O₂ ＋ 產生能量</text>' +
                // Sunlight input
                '<text x="38" y="88" text-anchor="middle" font-size="12" font-weight="800" fill="#d97706" font-family="' + FONT + '">☀️ 太陽能</text>' +
                '<line x1="68" y1="92" x2="104" y2="114" stroke="#d97706" stroke-width="3" marker-end="url(#s712-arr-amber)"/>' +
                // Water input
                '<text x="38" y="168" text-anchor="middle" font-size="12" font-weight="800" fill="#0284c7" font-family="' + FONT + '">💧 H₂O</text>' +
                '<text x="38" y="184" text-anchor="middle" font-size="10" fill="#64748b" font-family="' + FONT + '">根吸收</text>' +
                '<line x1="68" y1="164" x2="104" y2="154" stroke="#0284c7" stroke-width="3" marker-end="url(#s712-arr)"/>' +
                // O2 output upward
                '<line x1="191" y1="92" x2="191" y2="34" stroke="#0284c7" stroke-width="3" marker-end="url(#s712-arr)"/>' +
                '<rect x="130" y="8" width="122" height="24" rx="12" fill="#e0f2fe" stroke="#0284c7"/>' +
                '<text x="191" y="24" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0369a1" font-family="' + FONT + '">O₂ 氧氣（氣孔釋出）</text>' +
              '</g>' +
              // Energy bridge
              '<line x1="274" y1="140" x2="352" y2="140" stroke="#d97706" stroke-width="3.5" marker-end="url(#s712-arr-amber)"/>' +
              '<rect x="285" y="114" width="58" height="20" rx="6" fill="#fffbeb" stroke="#f59e0b"/>' +
              '<text x="314" y="128" text-anchor="middle" font-size="11" font-weight="800" fill="#b45309" font-family="' + FONT + '">⚡ 能量</text>' +
              // Carbon reaction block
              '<g opacity="' + hiC + '">' +
                '<rect x="358" y="92" width="176" height="96" rx="14" fill="#dcfce7" stroke="#059669" stroke-width="2.5"/>' +
                '<text x="446" y="118" text-anchor="middle" font-size="14" font-weight="800" fill="#065f46" font-family="' + FONT + '">② 碳反應</text>' +
                '<text x="446" y="139" text-anchor="middle" font-size="11.5" fill="#064e3b" font-family="' + FONT + '">利用酵素與能量</text>' +
                '<text x="446" y="158" text-anchor="middle" font-size="11.5" fill="#064e3b" font-family="' + FONT + '">固定二氧化碳 CO₂</text>' +
                '<text x="446" y="177" text-anchor="middle" font-size="11" font-weight="700" fill="#047857" font-family="' + FONT + '">合成葡萄糖 ＋ H₂O</text>' +
                // CO2 input from top
                '<rect x="382" y="8" width="128" height="24" rx="12" fill="#f1f5f9" stroke="#64748b"/>' +
                '<text x="446" y="24" text-anchor="middle" font-size="11.5" font-weight="800" fill="#334155" font-family="' + FONT + '">CO₂（由氣孔進入）</text>' +
                '<line x1="446" y1="32" x2="446" y2="88" stroke="#475569" stroke-width="3" marker-end="url(#s712-arr)"/>' +
                // Glucose output to bottom/right
                '<line x1="446" y1="188" x2="446" y2="232" stroke="#059669" stroke-width="3" marker-end="url(#s712-arr)"/>' +
                '<rect x="336" y="236" width="220" height="26" rx="13" fill="#059669"/>' +
                '<text x="446" y="253" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff" font-family="' + FONT + '">🍬 葡萄糖（養分）＋ H₂O</text>' +
              '</g>' +
            '</svg>' +
            '<div class="hb-vis-readout">' + readout + '</div>';
        } else {
          var tm = TEMPS[tempMode];
          var enzShape = tm.shape === 'intact'
            ? '<path d="M475,112 A42,42 0 1,1 475,168 L502,152 L486,140 L502,128 Z" fill="#bae6fd" stroke="#0284c7" stroke-width="3"/>' +
              '<polygon points="528,125 510,140 528,155 546,140" fill="#fcd34d" stroke="#d97706" stroke-width="2"/>' +
              '<text x="515" y="196" text-anchor="middle" font-size="12" font-weight="800" fill="#0369a1" font-family="' + FONT + '">構造完整：可與受質結合</text>' +
              '<text x="515" y="216" text-anchor="middle" font-size="11" fill="#059669" font-weight="700" font-family="' + FONT + '">' + (tempMode === '0' ? '（回溫至 37°C 即可恢復活性！）' : '（37°C 結合碰撞速率最快！）') + '</text>'
            : '<path d="M452,126 Q475,100 505,122 Q538,108 552,140 Q522,175 488,156 Q456,178 452,126 Z" fill="#fee2e2" stroke="#dc2626" stroke-width="3" stroke-dasharray="6 3"/>' +
              '<text x="502" y="144" text-anchor="middle" font-size="12" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">✖ 蛋白質變性</text>' +
              '<text x="505" y="196" text-anchor="middle" font-size="12" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">立體構造被永久破壞</text>' +
              '<text x="505" y="216" text-anchor="middle" font-size="11" fill="#dc2626" font-weight="700" font-family="' + FONT + '">（降回 37°C 也永遠無法恢復！）</text>';

          html +=
            '<div class="hb-vis-controls">' +
              '<button type="button" class="hb-vis-btn ' + (tempMode === '0' ? 'active' : '') + '" data-temp="0">❄️ 0°C 低溫休眠</button>' +
              '<button type="button" class="hb-vis-btn ' + (tempMode === '37' ? 'active' : '') + '" data-temp="37">🔥 37°C 最適溫度</button>' +
              '<button type="button" class="hb-vis-btn ' + (tempMode === '70' ? 'active' : '') + '" data-temp="70">☠️ 70°C 高溫變性</button>' +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="酵素活性與溫度關係圖">' +
              // Axes
              '<line x1="65" y1="220" x2="365" y2="220" stroke="#334155" stroke-width="2"/>' +
              '<line x1="65" y1="220" x2="65" y2="30" stroke="#334155" stroke-width="2"/>' +
              '<text x="215" y="254" text-anchor="middle" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '">溫度（°C）</text>' +
              '<text x="26" y="128" text-anchor="middle" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '" transform="rotate(-90 26 128)">酵素反應速率（活性）</text>' +
              // Curve
              '<path d="M75,206 Q145,192 205,66 Q248,66 278,215 L350,215" fill="none" stroke="#0284c7" stroke-width="3.5"/>' +
              // Ticks
              '<text x="75" y="236" text-anchor="middle" font-size="11" fill="#475569" font-family="' + FONT + '">0°C</text>' +
              '<text x="205" y="236" text-anchor="middle" font-size="11" font-weight="700" fill="#0284c7" font-family="' + FONT + '">37°C</text>' +
              '<text x="278" y="236" text-anchor="middle" font-size="11" fill="#dc2626" font-family="' + FONT + '">60°C</text>' +
              '<text x="325" y="236" text-anchor="middle" font-size="11" fill="#dc2626" font-family="' + FONT + '">70°C</text>' +
              '<line x1="205" y1="66" x2="205" y2="220" stroke="#94a3b8" stroke-dasharray="4 3"/>' +
              // Active point
              '<circle cx="' + tm.x + '" cy="' + tm.y + '" r="8" fill="' + (tempMode === '70' ? '#dc2626' : '#059669') + '" stroke="#ffffff" stroke-width="2.5"/>' +
              '<text x="' + (tm.x + (tempMode === '70' ? -25 : 14)) + '" y="' + (tm.y - 12) + '" font-size="11.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">' + tm.t + '°C：' + tm.act + '</text>' +
              // Right inspector box
              '<rect x="392" y="22" width="232" height="226" rx="14" fill="#f8fafc" stroke="#cbd5e1"/>' +
              '<text x="508" y="48" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a" font-family="' + FONT + '">酵素分子立體構造</text>' +
              '<text x="508" y="68" text-anchor="middle" font-size="11.5" font-weight="700" fill="#475569" font-family="' + FONT + '">目前溫度：' + tm.t + '°C</text>' +
              enzShape +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>🧪 ' + tm.title + '：</strong>' + tm.desc +
            '</div>';
        }

        el.innerHTML = html;
        el.querySelectorAll('[data-mode]').forEach(function (b) {
          b.addEventListener('click', function () { mode = b.getAttribute('data-mode'); render(); });
        });
        el.querySelectorAll('[data-phase]').forEach(function (b) {
          b.addEventListener('click', function () { phase = b.getAttribute('data-phase'); render(); });
        });
        el.querySelectorAll('[data-temp]').forEach(function (b) {
          b.addEventListener('click', function () { tempMode = b.getAttribute('data-temp'); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     3. SCI_7_1_3 — 循環系統
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_7_1_3'] = {
    title: '❤️ 心臟四腔室肺／體循環路線 ＆ 魚尾鰭血管判讀',
    subtitle: '切換體循環、肺循環與魚尾鰭微血管，破除「動脈一定充氧血」的超級陷阱',
    mount: function (el) {
      var tab = 'systemic';

      function render() {
        var html =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn ' + (tab === 'systemic' ? 'active' : '') + '" data-tab="systemic">🔴 體循環（左心室出發）</button>' +
            '<button type="button" class="hb-vis-btn ' + (tab === 'pulmonary' ? 'active' : '') + '" data-tab="pulmonary">🔵 肺循環（右心室出發）</button>' +
            '<button type="button" class="hb-vis-btn ' + (tab === 'fish' ? 'active' : '') + '" data-tab="fish">🐟 魚尾鰭分合血流判讀</button>' +
          '</div>';

        if (tab === 'fish') {
          html +=
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="魚尾鰭顯微鏡血管判讀圖">' +
              '<defs>' +
                '<marker id="s713-fa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/></marker>' +
                '<marker id="s713-fv" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#2563eb"/></marker>' +
              '</defs>' +
              '<rect x="20" y="16" width="600" height="238" rx="14" fill="#fffbeb" stroke="#fde68a"/>' +
              '<text x="320" y="40" text-anchor="middle" font-size="14" font-weight="800" fill="#92400e" font-family="' + FONT + '">🔬 複式顯微鏡下的魚尾鰭血管（看「分叉」與「匯合」！）</text>' +
              // Arteriole branching
              '<path d="M55,140 L175,140" stroke="#ef4444" stroke-width="14" stroke-linecap="round"/>' +
              '<path d="M175,140 Q215,140 245,86" fill="none" stroke="#ef4444" stroke-width="8"/>' +
              '<path d="M175,140 Q215,140 245,140" fill="none" stroke="#ef4444" stroke-width="8"/>' +
              '<path d="M175,140 Q215,140 245,194" fill="none" stroke="#ef4444" stroke-width="8"/>' +
              // Capillaries (single-file RBCs)
              '<line x1="245" y1="86" x2="395" y2="86" stroke="#a855f7" stroke-width="4" stroke-dasharray="1 0"/>' +
              '<line x1="245" y1="140" x2="395" y2="140" stroke="#a855f7" stroke-width="4"/>' +
              '<line x1="245" y1="194" x2="395" y2="194" stroke="#a855f7" stroke-width="4"/>' +
              // RBCs single file
              '<circle cx="275" cy="86" r="4.5" fill="#dc2626"/><circle cx="320" cy="86" r="4.5" fill="#dc2626"/><circle cx="365" cy="86" r="4.5" fill="#dc2626"/>' +
              '<circle cx="285" cy="140" r="4.5" fill="#dc2626"/><circle cx="330" cy="140" r="4.5" fill="#dc2626"/><circle cx="375" cy="140" r="4.5" fill="#dc2626"/>' +
              '<circle cx="270" cy="194" r="4.5" fill="#dc2626"/><circle cx="315" cy="194" r="4.5" fill="#dc2626"/><circle cx="360" cy="194" r="4.5" fill="#dc2626"/>' +
              // Venule merging
              '<path d="M395,86 Q425,140 465,140" fill="none" stroke="#3b82f6" stroke-width="8"/>' +
              '<path d="M395,140 Q425,140 465,140" fill="none" stroke="#3b82f6" stroke-width="8"/>' +
              '<path d="M395,194 Q425,140 465,140" fill="none" stroke="#3b82f6" stroke-width="8"/>' +
              '<path d="M465,140 L585,140" stroke="#3b82f6" stroke-width="14" stroke-linecap="round"/>' +
              // Flow arrows
              '<line x1="80" y1="140" x2="142" y2="140" stroke="#ffffff" stroke-width="2.5" marker-end="url(#s713-fa)"/>' +
              '<line x1="490" y1="140" x2="552" y2="140" stroke="#ffffff" stroke-width="2.5" marker-end="url(#s713-fv)"/>' +
              // Labels
              '<rect x="44" y="168" width="150" height="48" rx="8" fill="#fef2f2" stroke="#fca5a5"/>' +
              '<text x="119" y="188" text-anchor="middle" font-size="12.5" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">小動脈（分叉流出）</text>' +
              '<text x="119" y="206" text-anchor="middle" font-size="11" fill="#7f1d1d" font-family="' + FONT + '">流速最快、管壁較厚</text>' +
              '<rect x="242" y="210" width="156" height="36" rx="8" fill="#faf5ff" stroke="#d8b4fe"/>' +
              '<text x="320" y="227" text-anchor="middle" font-size="12" font-weight="800" fill="#6b21a8" font-family="' + FONT + '">微血管（單列紅血球）</text>' +
              '<text x="320" y="242" text-anchor="middle" font-size="10.5" fill="#7e22ce" font-family="' + FONT + '">管徑最細、流速最慢</text>' +
              '<rect x="446" y="168" width="150" height="48" rx="8" fill="#eff6ff" stroke="#93c5fd"/>' +
              '<text x="521" y="188" text-anchor="middle" font-size="12.5" font-weight="800" fill="#1d4ed8" font-family="' + FONT + '">小靜脈（匯合流入）</text>' +
              '<text x="521" y="206" text-anchor="middle" font-size="11" fill="#1e3a8a" font-family="' + FONT + '">流速次之、回心方向</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>⚠️ 考場鐵則：</strong>複式顯微鏡會使影像上下左右顛倒，<strong>絕對不要背「往左就是動脈」</strong>！唯一正確判讀法：<strong>血流從主管「分叉」出去＝小動脈</strong>；<strong>血流「匯合」進主管＝小靜脈</strong>；<strong>只容許紅血球單列通過＝微血管</strong>。' +
            '</div>';
        } else {
          var isSys = (tab === 'systemic');
          var sysOp = isSys ? '1' : '0.22';
          var pulOp = isSys ? '0.22' : '1';
          html +=
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="心臟四腔室與肺體循環路線圖">' +
              '<defs>' +
                '<marker id="s713-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/></marker>' +
                '<marker id="s713-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#2563eb"/></marker>' +
              '</defs>' +
              // Note on anatomical orientation
              '<text x="16" y="24" font-size="11" font-weight="700" fill="#64748b" font-family="' + FONT + '">📌 圖左＝人體右側（缺氧血藍）｜圖右＝人體左側（充氧血紅）</text>' +
              // Lungs at top
              '<rect x="225" y="34" width="190" height="36" rx="18" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>' +
              '<text x="320" y="57" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0369a1" font-family="' + FONT + '">🫁 肺部微血管（CO₂出・O₂進）</text>' +
              // Body tissues at bottom
              '<rect x="215" y="220" width="210" height="36" rx="18" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>' +
              '<text x="320" y="243" text-anchor="middle" font-size="12.5" font-weight="800" fill="#92400e" font-family="' + FONT + '">🧍 全身組織微血管（O₂出・CO₂進）</text>' +
              // Heart 4 chambers
              '<rect x="225" y="96" width="95" height="48" rx="8" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2.5"/>' +
              '<text x="272" y="124" text-anchor="middle" font-size="13" font-weight="800" fill="#1e3a8a" font-family="' + FONT + '">右心房</text>' +
              '<rect x="225" y="148" width="95" height="50" rx="8" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2.5"/>' +
              '<text x="272" y="177" text-anchor="middle" font-size="13" font-weight="800" fill="#1e3a8a" font-family="' + FONT + '">右心室</text>' +
              '<rect x="320" y="96" width="95" height="48" rx="8" fill="#fee2e2" stroke="#b91c1c" stroke-width="2.5"/>' +
              '<text x="368" y="124" text-anchor="middle" font-size="13" font-weight="800" fill="#991b1b" font-family="' + FONT + '">左心房</text>' +
              '<rect x="320" y="148" width="95" height="50" rx="8" fill="#fecaca" stroke="#b91c1c" stroke-width="2.5"/>' +
              '<text x="368" y="177" text-anchor="middle" font-size="13" font-weight="800" fill="#991b1b" font-family="' + FONT + '">左心室</text>' +
              // Valves
              '<line x1="255" y1="146" x2="290" y2="146" stroke="#ffffff" stroke-width="4"/>' +
              '<line x1="350" y1="146" x2="385" y2="146" stroke="#ffffff" stroke-width="4"/>' +
              '<text x="320" y="149" text-anchor="middle" font-size="9.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">瓣膜</text>' +

              // Pulmonary loop (Right Ventricle -> Lungs -> Left Atrium)
              '<g opacity="' + pulOp + '">' +
                '<path d="M225,172 L152,172 L152,52 L220,52" fill="none" stroke="#2563eb" stroke-width="4" marker-end="url(#s713-b)"/>' +
                '<text x="144" y="108" text-anchor="end" font-size="11.5" font-weight="800" fill="#1d4ed8" font-family="' + FONT + '">肺動脈</text>' +
                '<text x="144" y="123" text-anchor="end" font-size="10.5" fill="#1e40af" font-family="' + FONT + '">（缺氧血藍！）</text>' +
                '<path d="M415,52 L488,52 L488,118 L420,118" fill="none" stroke="#dc2626" stroke-width="4" marker-end="url(#s713-r)"/>' +
                '<text x="496" y="82" text-anchor="start" font-size="11.5" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">肺靜脈</text>' +
                '<text x="496" y="97" text-anchor="start" font-size="10.5" fill="#991b1b" font-family="' + FONT + '">（充氧血紅！）</text>' +
              '</g>' +

              // Systemic loop (Left Ventricle -> Body -> Right Atrium)
              '<g opacity="' + sysOp + '">' +
                '<path d="M415,172 L536,172 L536,238 L430,238" fill="none" stroke="#dc2626" stroke-width="4" marker-end="url(#s713-r)"/>' +
                '<text x="544" y="200" text-anchor="start" font-size="11.5" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">主動脈</text>' +
                '<text x="544" y="215" text-anchor="start" font-size="10.5" fill="#991b1b" font-family="' + FONT + '">（充氧血紅）</text>' +
                '<path d="M215,238 L92,238 L92,118 L220,118" fill="none" stroke="#2563eb" stroke-width="4" marker-end="url(#s713-b)"/>' +
                '<text x="84" y="182" text-anchor="end" font-size="11.5" font-weight="800" fill="#1d4ed8" font-family="' + FONT + '">大靜脈</text>' +
                '<text x="84" y="197" text-anchor="end" font-size="10.5" fill="#1e40af" font-family="' + FONT + '">（缺氧血藍）</text>' +
              '</g>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              (isSys
                ? '<strong>🔴 體循環路線：</strong>左心室（肌肉最厚）→ 主動脈（充氧血）→ 全身組織微血管（把 O₂ 給細胞、帶走 CO₂）→ 上下大靜脈（缺氧血）→ 右心房。'
                : '<strong>🔵 肺循環路線：</strong>右心室 → <strong>肺動脈（缺氧血！）</strong>→ 肺部微血管（排出 CO₂、吸收 O₂）→ <strong>肺靜脈（充氧血！）</strong>→ 左心房。切記：動脈只定義「離心」，不代表一定充氧！') +
            '</div>';
        }

        el.innerHTML = html;
        el.querySelectorAll('[data-tab]').forEach(function (b) {
          b.addEventListener('click', function () { tab = b.getAttribute('data-tab'); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     4. SCI_7_1_4 — 神經、內分泌與恆定性
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_7_1_4'] = {
    title: '⚡ 縮手反射 vs 痛覺時間差動畫 ＆ 血糖負回饋環路',
    subtitle: '按下「手指碰到燙鍋！」觀察訊號如何先由脊髓縮手、再傳到大腦感到痛',
    mount: function (el) {
      var mode = 'reflex';
      var step = 0; // 0: idle, 1: sensory to spine, 2: hand pulls back!, 3: brain feels pain!
      var timer = null;
      var sugar = 'high';

      function clearAnim() {
        if (timer) { clearInterval(timer); timer = null; }
      }

      function runReflexAnim() {
        clearAnim();
        step = 1;
        render();
        timer = setInterval(function () {
          step += 1;
          if (step >= 3) {
            step = 3;
            clearAnim();
          }
          render();
        }, 900);
      }

      function render() {
        var html =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'reflex' ? 'active' : '') + '" data-mode="reflex">🔥 縮手反射 vs 痛覺時間差</button>' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'sugar' ? 'active' : '') + '" data-mode="sugar">🍬 血糖負回饋環路</button>' +
          '</div>';

        if (mode === 'reflex') {
          var stepTexts = [
            '待機中：點擊「🖐️ 手指碰到燙鍋！」觀察反射與感覺的路徑時間差。',
            '⏱️ 0.05 秒（步驟 1）：手指受器偵測高溫 → 經由「感覺神經元」將訊號傳入脊髓！',
            '⏱️ 0.10 秒（步驟 2）：⚡ 脊髓直接下令經「運動神經元」→ 手臂肌肉立即收縮【先縮手】！',
            '⏱️ 0.40 秒（步驟 3）：🧠 同一份訊號繼續沿脊髓上行抵達【大腦】→ 才意識到「好燙好痛！」'
          ];
          var s1 = step >= 1 ? '#dc2626' : '#cbd5e1';
          var s2 = step >= 2 ? '#059669' : '#cbd5e1';
          var s3 = step >= 3 ? '#7c3aed' : '#cbd5e1';

          html +=
            '<div class="hb-vis-controls">' +
              '<button type="button" class="hb-vis-btn" style="background:#fef2f2;border-color:#dc2626;color:#b91c1c;" data-act="fire">🖐️ 手指碰到燙鍋！（播放動畫）</button>' +
              '<button type="button" class="hb-vis-btn ' + (step === 1 ? 'active' : '') + '" data-step="1">① 受器→脊髓</button>' +
              '<button type="button" class="hb-vis-btn ' + (step === 2 ? 'active' : '') + '" data-step="2">② 脊髓→縮手</button>' +
              '<button type="button" class="hb-vis-btn ' + (step === 3 ? 'active' : '') + '" data-step="3">③ 大腦→感痛</button>' +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="縮手反射與痛覺大腦路徑時間差圖">' +
              '<defs>' +
                '<marker id="s714-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="' + s1 + '"/></marker>' +
                '<marker id="s714-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="' + s2 + '"/></marker>' +
                '<marker id="s714-p" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="' + s3 + '"/></marker>' +
              '</defs>' +
              // Brain
              '<rect x="454" y="20" width="154" height="62" rx="16" fill="' + (step >= 3 ? '#f3e8ff' : '#f8fafc') + '" stroke="' + (step >= 3 ? '#7c3aed' : '#94a3b8') + '" stroke-width="2.5"/>' +
              '<text x="531" y="47" text-anchor="middle" font-size="13.5" font-weight="800" fill="#581c87" font-family="' + FONT + '">🧠 大腦（感覺區）</text>' +
              '<text x="531" y="67" text-anchor="middle" font-size="11" font-weight="700" fill="#7c3aed" font-family="' + FONT + '">' + (step >= 3 ? '0.40 秒：好痛啊！' : '產生痛覺意識') + '</text>' +
              // Spinal cord
              '<rect x="266" y="102" width="132" height="68" rx="14" fill="' + (step >= 1 ? '#fef3c7' : '#f8fafc') + '" stroke="' + (step >= 1 ? '#d97706' : '#94a3b8') + '" stroke-width="2.5"/>' +
              '<text x="332" y="131" text-anchor="middle" font-size="13.5" font-weight="800" fill="#92400e" font-family="' + FONT + '">🦴 脊髓</text>' +
              '<text x="332" y="151" text-anchor="middle" font-size="11" font-weight="700" fill="#b45309" font-family="' + FONT + '">四肢反射中樞</text>' +
              // Hot pot + finger receptor
              '<rect x="28" y="42" width="146" height="62" rx="12" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>' +
              '<text x="101" y="69" text-anchor="middle" font-size="13" font-weight="800" fill="#991b1b" font-family="' + FONT + '">🔥 燙鍋 → 手指受器</text>' +
              '<text x="101" y="88" text-anchor="middle" font-size="11" fill="#b91c1c" font-family="' + FONT + '">接收高溫刺激</text>' +
              // Arm muscle effector
              '<rect x="28" y="162" width="146" height="62" rx="12" fill="' + (step >= 2 ? '#dcfce7' : '#f8fafc') + '" stroke="' + (step >= 2 ? '#059669' : '#94a3b8') + '" stroke-width="2.5"/>' +
              '<text x="101" y="189" text-anchor="middle" font-size="13" font-weight="800" fill="#065f46" font-family="' + FONT + '">💪 手臂肌肉（動器）</text>' +
              '<text x="101" y="208" text-anchor="middle" font-size="11" font-weight="700" fill="#059669" font-family="' + FONT + '">' + (step >= 2 ? '0.10 秒：⚡ 先縮手！' : '等待運動神經指令') + '</text>' +
              // Path 1: Receptor -> Spine
              '<path d="M174,73 Q226,73 262,120" fill="none" stroke="' + s1 + '" stroke-width="4" marker-end="url(#s714-r)"/>' +
              '<text x="228" y="68" text-anchor="middle" font-size="11" font-weight="800" fill="#dc2626" font-family="' + FONT + '">① 感覺神經元</text>' +
              // Path 2: Spine -> Muscle
              '<path d="M266,154 Q224,193 179,193" fill="none" stroke="' + s2 + '" stroke-width="4" marker-end="url(#s714-g)"/>' +
              '<text x="228" y="210" text-anchor="middle" font-size="11" font-weight="800" fill="#059669" font-family="' + FONT + '">② 運動神經元（短）</text>' +
              // Path 3: Spine -> Brain
              '<path d="M398,124 Q430,124 452,66" fill="none" stroke="' + s3 + '" stroke-width="4" stroke-dasharray="6 3" marker-end="url(#s714-p)"/>' +
              '<text x="506" y="128" text-anchor="middle" font-size="11" font-weight="800" fill="#7c3aed" font-family="' + FONT + '">③ 上行神經（路徑較長）</text>' +
              // Bottom timeline bar
              '<rect x="30" y="236" width="580" height="24" rx="12" fill="#f1f5f9"/>' +
              '<rect x="30" y="236" width="' + (step === 0 ? 0 : step === 1 ? 150 : step === 2 ? 320 : 580) + '" height="24" rx="12" fill="' + (step === 3 ? '#7c3aed' : step === 2 ? '#059669' : '#dc2626') + '" opacity="0.22"/>' +
              '<text x="115" y="252" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c" font-family="' + FONT + '">0.05s 傳入脊髓</text>' +
              '<text x="315" y="252" text-anchor="middle" font-size="11" font-weight="800" fill="#059669" font-family="' + FONT + '">0.10s 先縮手（脊髓）</text>' +
              '<text x="525" y="252" text-anchor="middle" font-size="11" font-weight="800" fill="#6b21a8" font-family="' + FONT + '">0.40s 後感痛（大腦）</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' + stepTexts[step] + '</div>';
        } else {
          var isHigh = (sugar === 'high');
          var isEmer = (sugar === 'emer');
          var hormone = isHigh ? '胰島素（降血糖）' : (isEmer ? '腎上腺素（緊急升血糖）' : '升糖素（升血糖）');
          var gland = isEmer ? '腎上腺（交感神經刺激）' : '胰島（內分泌腺）';
          var liver = isHigh ? '葡萄糖 → 合成「肝糖」儲存＋加速細胞利用' : '肝糖 → 分解成「葡萄糖」釋入血液';
          var result = isHigh ? '血糖下降 → 回復正常（負回饋）' : (isEmer ? '血糖飆升＋心跳加速 → 應付危機！' : '血糖上升 → 回復正常（負回饋）');
          var col = isHigh ? '#0284c7' : (isEmer ? '#dc2626' : '#d97706');

          html +=
            '<div class="hb-vis-controls">' +
              '<button type="button" class="hb-vis-btn ' + (sugar === 'high' ? 'active' : '') + '" data-sugar="high">🍚 飯後血糖過高</button>' +
              '<button type="button" class="hb-vis-btn ' + (sugar === 'low' ? 'active' : '') + '" data-sugar="low">🏃 飢餓血糖過低</button>' +
              '<button type="button" class="hb-vis-btn ' + (sugar === 'emer' ? 'active' : '') + '" data-sugar="emer">⚡ 緊張危機（腎上腺素）</button>' +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="血糖恆定負回饋環路圖">' +
              '<defs><marker id="s714-fb" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="' + col + '"/></marker></defs>' +
              '<rect x="200" y="16" width="240" height="44" rx="22" fill="#f8fafc" stroke="' + col + '" stroke-width="2.5"/>' +
              '<text x="320" y="43" text-anchor="middle" font-size="13.5" font-weight="800" fill="' + col + '" font-family="' + FONT + '">' + (isHigh ? '📈 飯後：血液葡萄糖過高' : isEmer ? '🚨 緊急危難：需要爆發能量' : '📉 飢餓：血液葡萄糖過低') + '</text>' +
              '<rect x="424" y="106" width="194" height="58" rx="12" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>' +
              '<text x="521" y="131" text-anchor="middle" font-size="12.5" font-weight="800" fill="#92400e" font-family="' + FONT + '">' + gland + '</text>' +
              '<text x="521" y="151" text-anchor="middle" font-size="12" font-weight="700" fill="#b45309" font-family="' + FONT + '">分泌：' + hormone + '</text>' +
              '<rect x="165" y="204" width="310" height="50" rx="12" fill="#f0fdf4" stroke="#059669" stroke-width="2"/>' +
              '<text x="320" y="225" text-anchor="middle" font-size="12.5" font-weight="800" fill="#065f46" font-family="' + FONT + '">🫀 肝臟與肌肉細胞反應</text>' +
              '<text x="320" y="244" text-anchor="middle" font-size="11.5" font-weight="700" fill="#047857" font-family="' + FONT + '">' + liver + '</text>' +
              '<rect x="22" y="106" width="194" height="58" rx="12" fill="#eff6ff" stroke="#0284c7" stroke-width="2"/>' +
              '<text x="119" y="131" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0369a1" font-family="' + FONT + '">⚖️ 調節結果</text>' +
              '<text x="119" y="151" text-anchor="middle" font-size="11.5" font-weight="700" fill="#0284c7" font-family="' + FONT + '">' + result + '</text>' +
              // Loop arrows
              '<path d="M440,38 Q521,38 521,100" fill="none" stroke="' + col + '" stroke-width="3.5" marker-end="url(#s714-fb)"/>' +
              '<path d="M521,164 Q521,228 480,228" fill="none" stroke="' + col + '" stroke-width="3.5" marker-end="url(#s714-fb)"/>' +
              '<path d="M165,228 Q119,228 119,170" fill="none" stroke="' + col + '" stroke-width="3.5" marker-end="url(#s714-fb)"/>' +
              '<path d="M119,106 Q119,38 195,38" fill="none" stroke="' + col + '" stroke-width="3.5" stroke-dasharray="5 3" marker-end="url(#s714-fb)"/>' +
              '<text x="320" y="140" text-anchor="middle" font-size="12" font-weight="800" fill="#64748b" font-family="' + FONT + '">血液循環運輸激素</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>🎯 考點辨析：</strong>能「降血糖」的激素只有<strong>胰島素</strong>；能「升血糖」的有<strong>升糖素</strong>（平常飢餓）與<strong>腎上腺素</strong>（緊張危急）。內分泌腺無導管，靠<strong>血液</strong>運送！' +
            '</div>';
        }

        el.innerHTML = html;
        el.querySelectorAll('[data-mode]').forEach(function (b) {
          b.addEventListener('click', function () { clearAnim(); mode = b.getAttribute('data-mode'); render(); });
        });
        el.querySelectorAll('[data-act="fire"]').forEach(function (b) {
          b.addEventListener('click', runReflexAnim);
        });
        el.querySelectorAll('[data-step]').forEach(function (b) {
          b.addEventListener('click', function () { clearAnim(); step = Number(b.getAttribute('data-step')); render(); });
        });
        el.querySelectorAll('[data-sugar]').forEach(function (b) {
          b.addEventListener('click', function () { sugar = b.getAttribute('data-sugar'); render(); });
        });
      }

      render();
      return clearAnim;
    }
  };

  /* ========================================================================
     5. SCI_7_1_5 — 遺傳、細胞分裂與孟德爾
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_7_1_5'] = {
    title: '🧬 孟德爾 2×2 棋盤方格 ＆ 細胞／減數分裂套數比較',
    subtitle: '切換 4 種高頻遺傳組合（含 ABO 血型與性聯色盲），即時產出基因型、表現型與機率',
    mount: function (el) {
      var mode = 'punnett';
      var cross = 'Aa_Aa';

      var CROSSES = {
        Aa_Aa: {
          label: 'Aa × Aa',
          p1: ['A', 'a'], p2: ['A', 'a'],
          cells: [
            { g: 'AA', p: '顯性', bg: '#dbeafe', col: '#1d4ed8' },
            { g: 'Aa', p: '顯性', bg: '#dbeafe', col: '#1d4ed8' },
            { g: 'Aa', p: '顯性', bg: '#dbeafe', col: '#1d4ed8' },
            { g: 'aa', p: '隱性', bg: '#fee2e2', col: '#b91c1c' }
          ],
          ratio: '基因型 1 AA : 2 Aa : 1 aa｜表現型 3 顯性 : 1 隱性',
          clue: '譜系口訣「無中生有＝隱性」：雙親皆正常（Aa × Aa），卻生出患病子代（aa，機率 1/4），必為隱性遺傳！'
        },
        Aa_aa: {
          label: 'Aa × aa（測交）',
          p1: ['A', 'a'], p2: ['a', 'a'],
          cells: [
            { g: 'Aa', p: '顯性', bg: '#dbeafe', col: '#1d4ed8' },
            { g: 'aa', p: '隱性', bg: '#fee2e2', col: '#b91c1c' },
            { g: 'Aa', p: '顯性', bg: '#dbeafe', col: '#1d4ed8' },
            { g: 'aa', p: '隱性', bg: '#fee2e2', col: '#b91c1c' }
          ],
          ratio: '基因型 1 Aa : 1 aa｜表現型 1 顯性 : 1 隱性（各 50%）',
          clue: '只要看到子代「顯性：隱性 ≈ 1：1」，親代組合必為 Aa × aa！'
        },
        ABO: {
          label: 'Iᴬi × Iᴮi（ABO 血型）',
          p1: ['Iᴬ', 'i'], p2: ['Iᴮ', 'i'],
          cells: [
            { g: 'IᴬIᴮ', p: 'AB 型', bg: '#f3e8ff', col: '#6b21a8' },
            { g: 'Iᴮi', p: 'B 型', bg: '#fef3c7', col: '#92400e' },
            { g: 'Iᴬi', p: 'A 型', bg: '#dbeafe', col: '#1d4ed8' },
            { g: 'ii', p: 'O 型', bg: '#dcfce7', col: '#166534' }
          ],
          ratio: 'A 型 25%｜B 型 25%｜AB 型 25%｜O 型 25%（四種皆可能！）',
          clue: '父母分別為 A 型與 B 型，若生出 O 型（ii）小孩，則雙親基因型必分別為 Iᴬi 與 Iᴮi！'
        },
        colorblind: {
          label: 'XᴮXᵇ × XᴮY（性聯色盲）',
          p1: ['Xᴮ', 'Xᵇ'], p2: ['Xᴮ', 'Y'],
          cells: [
            { g: 'XᴮXᴮ', p: '正常女', bg: '#dbeafe', col: '#1d4ed8' },
            { g: 'XᴮXᵇ', p: '帶因正常女', bg: '#e0f2fe', col: '#0369a1' },
            { g: 'XᴮY', p: '正常男', bg: '#dcfce7', col: '#166534' },
            { g: 'XᵇY', p: '色盲男！', bg: '#fee2e2', col: '#b91c1c' }
          ],
          ratio: '整體色盲機率 1/4（25%）；若已知為男孩，色盲機率 1/2（50%）！',
          clue: '男生只需 1 條 Xᵇ 就發病，且男生的 X 必來自母親！注意題目問「生出患病男孩(1/4)」還是「男孩患病機率(1/2)」。'
        }
      };

      function render() {
        var html =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'punnett' ? 'active' : '') + '" data-mode="punnett">🧬 孟德爾 2×2 棋盤方格</button>' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'division' ? 'active' : '') + '" data-mode="division">🧫 細胞分裂 vs 減數分裂套數圖</button>' +
          '</div>';

        if (mode === 'punnett') {
          var c = CROSSES[cross];
          html +=
            '<div class="hb-vis-controls">' +
              Object.keys(CROSSES).map(function (k) {
                return '<button type="button" class="hb-vis-btn ' + (cross === k ? 'active' : '') + '" data-cross="' + k + '">' + CROSSES[k].label + '</button>';
              }).join('') +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="孟德爾2乘2棋盤方格與譜系圖">' +
              // Punnett Grid (left)
              '<text x="178" y="28" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">2×2 棋盤方格：' + c.label + '</text>' +
              // Top headers (p1)
              '<rect x="116" y="42" width="96" height="34" rx="6" fill="#f1f5f9" stroke="#cbd5e1"/>' +
              '<text x="164" y="64" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a" font-family="' + FONT + '">' + c.p1[0] + '</text>' +
              '<rect x="218" y="42" width="96" height="34" rx="6" fill="#f1f5f9" stroke="#cbd5e1"/>' +
              '<text x="266" y="64" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a" font-family="' + FONT + '">' + c.p1[1] + '</text>' +
              // Left headers (p2)
              '<rect x="44" y="82" width="66" height="72" rx="6" fill="#f1f5f9" stroke="#cbd5e1"/>' +
              '<text x="77" y="123" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a" font-family="' + FONT + '">' + c.p2[0] + '</text>' +
              '<rect x="44" y="160" width="66" height="72" rx="6" fill="#f1f5f9" stroke="#cbd5e1"/>' +
              '<text x="77" y="201" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a" font-family="' + FONT + '">' + c.p2[1] + '</text>' +
              // 4 cells
              [0, 1, 2, 3].map(function (i) {
                var cx = (i % 2 === 0) ? 116 : 218;
                var cy = (i < 2) ? 82 : 160;
                var cell = c.cells[i];
                return '<rect x="' + cx + '" y="' + cy + '" width="96" height="72" rx="8" fill="' + cell.bg + '" stroke="' + cell.col + '" stroke-width="2"/>' +
                  '<text x="' + (cx + 48) + '" y="' + (cy + 32) + '" text-anchor="middle" font-size="16" font-weight="800" fill="' + cell.col + '" font-family="' + FONT + '">' + cell.g + '</text>' +
                  '<text x="' + (cx + 48) + '" y="' + (cy + 54) + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="#334155" font-family="' + FONT + '">' + cell.p + '（25%）</text>';
              }).join('') +
              // Right panel: Pedigree "無中生有" + Ratio summary
              '<rect x="342" y="22" width="276" height="224" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>' +
              '<text x="480" y="46" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a" font-family="' + FONT + '">📋 譜系判讀鐵則：無中生有＝隱性</text>' +
              // Mini pedigree diagram
              '<rect x="408" y="64" width="32" height="32" rx="4" fill="#ffffff" stroke="#334155" stroke-width="2"/>' +
              '<text x="424" y="85" text-anchor="middle" font-size="11" font-weight="800" fill="#0f172a" font-family="' + FONT + '">Aa</text>' +
              '<circle cx="536" cy="80" r="16" fill="#ffffff" stroke="#334155" stroke-width="2"/>' +
              '<text x="536" y="85" text-anchor="middle" font-size="11" font-weight="800" fill="#0f172a" font-family="' + FONT + '">Aa</text>' +
              '<line x1="440" y1="80" x2="520" y2="80" stroke="#334155" stroke-width="2"/>' +
              '<line x1="480" y1="80" x2="480" y2="124" stroke="#334155" stroke-width="2"/>' +
              '<circle cx="480" cy="142" r="17" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>' +
              '<text x="480" y="147" text-anchor="middle" font-size="11.5" font-weight="800" fill="#ffffff" font-family="' + FONT + '">aa</text>' +
              '<text x="480" y="176" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c" font-family="' + FONT + '">正常雙親生出患病子代 → 病為隱性！</text>' +
              '<rect x="358" y="190" width="244" height="44" rx="8" fill="#eff6ff" stroke="#93c5fd"/>' +
              '<text x="480" y="208" text-anchor="middle" font-size="11" font-weight="800" fill="#1d4ed8" font-family="' + FONT + '">本組合比例統計</text>' +
              '<text x="480" y="226" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0f172a" font-family="' + FONT + '">' + (cross === 'ABO' ? 'A : B : AB : O ＝ 1 : 1 : 1 : 1' : cross === 'colorblind' ? '整體色盲 1/4｜男孩色盲 1/2' : cross === 'Aa_Aa' ? '顯性 3/4 (75%)｜隱性 1/4 (25%)' : '顯性 1/2 (50%)｜隱性 1/2 (50%)') + '</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>🎯 結果：</strong>' + c.ratio + '<br>' +
              '<strong>💡 解題秒殺點：</strong>' + c.clue +
            '</div>';
        } else {
          html +=
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="細胞分裂與減數分裂套數比較圖">' +
              '<defs><marker id="s715-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#475569"/></marker></defs>' +
              // Left: Mitosis
              '<rect x="16" y="14" width="292" height="242" rx="12" fill="#eff6ff" stroke="#93c5fd"/>' +
              '<text x="162" y="38" text-anchor="middle" font-size="14" font-weight="800" fill="#1d4ed8" font-family="' + FONT + '">細胞分裂（體細胞生長／修補）</text>' +
              '<circle cx="162" cy="82" r="24" fill="#ffffff" stroke="#2563eb" stroke-width="2.5"/>' +
              '<text x="162" y="87" text-anchor="middle" font-size="13" font-weight="800" fill="#1d4ed8" font-family="' + FONT + '">2N</text>' +
              '<text x="234" y="86" font-size="11" font-weight="700" fill="#475569" font-family="' + FONT + '">母細胞（4 條）</text>' +
              '<line x1="162" y1="106" x2="162" y2="146" stroke="#475569" stroke-width="2.5" marker-end="url(#s715-a)"/>' +
              '<text x="228" y="132" font-size="11" font-weight="700" fill="#0369a1" font-family="' + FONT + '">複製 1 次、分裂 1 次</text>' +
              '<line x1="162" y1="148" x2="108" y2="180" stroke="#475569" stroke-width="2"/>' +
              '<line x1="162" y1="148" x2="216" y2="180" stroke="#475569" stroke-width="2"/>' +
              '<circle cx="108" cy="202" r="22" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2.5"/>' +
              '<text x="108" y="207" text-anchor="middle" font-size="13" font-weight="800" fill="#1d4ed8" font-family="' + FONT + '">2N</text>' +
              '<circle cx="216" cy="202" r="22" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2.5"/>' +
              '<text x="216" y="207" text-anchor="middle" font-size="13" font-weight="800" fill="#1d4ed8" font-family="' + FONT + '">2N</text>' +
              '<text x="162" y="244" text-anchor="middle" font-size="12" font-weight="800" fill="#1e40af" font-family="' + FONT + '">產生 2 個子細胞，套數不變（皆 2N）</text>' +

              // Right: Meiosis
              '<rect x="332" y="14" width="292" height="242" rx="12" fill="#fdf2f8" stroke="#f9a8d4"/>' +
              '<text x="478" y="38" text-anchor="middle" font-size="14" font-weight="800" fill="#be185d" font-family="' + FONT + '">減數分裂（產生精子／卵配子）</text>' +
              '<circle cx="478" cy="76" r="22" fill="#ffffff" stroke="#db2777" stroke-width="2.5"/>' +
              '<text x="478" y="81" text-anchor="middle" font-size="13" font-weight="800" fill="#be185d" font-family="' + FONT + '">2N</text>' +
              '<text x="556" y="80" font-size="11" font-weight="700" fill="#9d174d" font-family="' + FONT + '">複製 1 次</text>' +
              '<line x1="478" y1="98" x2="418" y2="128" stroke="#475569" stroke-width="2"/>' +
              '<line x1="478" y1="98" x2="538" y2="128" stroke="#475569" stroke-width="2"/>' +
              '<text x="478" y="122" text-anchor="middle" font-size="10.5" font-weight="800" fill="#be185d" font-family="' + FONT + '">第1次（同源分離）</text>' +
              '<circle cx="418" cy="144" r="16" fill="#fce7f3" stroke="#db2777" stroke-width="2"/>' +
              '<text x="418" y="148" text-anchor="middle" font-size="11" font-weight="800" fill="#be185d" font-family="' + FONT + '">1N</text>' +
              '<circle cx="538" cy="144" r="16" fill="#fce7f3" stroke="#db2777" stroke-width="2"/>' +
              '<text x="538" y="148" text-anchor="middle" font-size="11" font-weight="800" fill="#be185d" font-family="' + FONT + '">1N</text>' +
              '<line x1="418" y1="160" x2="378" y2="188" stroke="#475569" stroke-width="1.8"/>' +
              '<line x1="418" y1="160" x2="444" y2="188" stroke="#475569" stroke-width="1.8"/>' +
              '<line x1="538" y1="160" x2="512" y2="188" stroke="#475569" stroke-width="1.8"/>' +
              '<line x1="538" y1="160" x2="578" y2="188" stroke="#475569" stroke-width="1.8"/>' +
              '<circle cx="378" cy="204" r="16" fill="#fbcfe8" stroke="#be185d" stroke-width="2"/><text x="378" y="208" text-anchor="middle" font-size="11" font-weight="800" fill="#9d174d" font-family="' + FONT + '">1N</text>' +
              '<circle cx="444" cy="204" r="16" fill="#fbcfe8" stroke="#be185d" stroke-width="2"/><text x="444" y="208" text-anchor="middle" font-size="11" font-weight="800" fill="#9d174d" font-family="' + FONT + '">1N</text>' +
              '<circle cx="512" cy="204" r="16" fill="#fbcfe8" stroke="#be185d" stroke-width="2"/><text x="512" y="208" text-anchor="middle" font-size="11" font-weight="800" fill="#9d174d" font-family="' + FONT + '">1N</text>' +
              '<circle cx="578" cy="204" r="16" fill="#fbcfe8" stroke="#be185d" stroke-width="2"/><text x="578" y="208" text-anchor="middle" font-size="11" font-weight="800" fill="#9d174d" font-family="' + FONT + '">1N</text>' +
              '<text x="478" y="244" text-anchor="middle" font-size="12" font-weight="800" fill="#9d174d" font-family="' + FONT + '">產生 4 個配子，套數減半（皆 1N）</text>' +
            '</svg>' +
            '<table class="hb-vis-table">' +
              '<thead><tr><th>比較項目</th><th>細胞分裂</th><th>減數分裂</th></tr></thead>' +
              '<tbody>' +
                '<tr><td>染色體複製次數</td><td>1 次</td><td><strong>也是 1 次！（極常考陷阱）</strong></td></tr>' +
                '<tr><td>細胞分裂次數</td><td>1 次</td><td>2 次</td></tr>' +
                '<tr><td>子細胞數量與套數</td><td>2 個、維持 2N（成對）</td><td>4 個、減半為 1N（不成對）</td></tr>' +
              '</tbody>' +
            '</table>';
        }

        el.innerHTML = html;
        el.querySelectorAll('[data-mode]').forEach(function (b) {
          b.addEventListener('click', function () { mode = b.getAttribute('data-mode'); render(); });
        });
        el.querySelectorAll('[data-cross]').forEach(function (b) {
          b.addEventListener('click', function () { cross = b.getAttribute('data-cross'); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     6. SCI_7_1_6 — 生態系與食物鏈
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_7_1_6'] = {
    title: '🔺 10% 能量正金字塔 vs 🔻 重金屬生物放大倒金字塔',
    subtitle: '點擊任一營養階層，同步比較能量逐層遞減（×1/10）與毒素逐層累積（×10）的完全相反趨勢',
    mount: function (el) {
      var level = 0; // 0: producer, 1: primary, 2: secondary, 3: tertiary

      var LEVELS = [
        { name: '生產者（藻類／植物）', energy: '10,000 kcal', toxin: '1 ppm', desc: '能量基座最龐大，透過光合作用固定太陽能；體內吸收微量不可分解的重金屬（如汞、DDT）。' },
        { name: '初級消費者（小蝦／草食）', energy: '1,000 kcal', toxin: '10 ppm', desc: '僅獲得上一層約 10% 的能量（90% 以呼吸熱能散失），但吃下大量生產者，重金屬濃度濃縮 10 倍！' },
        { name: '次級消費者（小魚）', energy: '100 kcal', toxin: '100 ppm', desc: '能量只剩生產者的 1%（1/100），但重金屬無法代謝排出，體內濃度已飆升至 100 ppm！' },
        { name: '三級消費者（大魚／老鷹）', energy: '10 kcal', toxin: '1,000 ppm', desc: '處於食物鏈最高層：獲得能量最少（族群個體數也最少），但體內重金屬毒素濃度最高（暴增 1000 倍）！' }
      ];

      function render() {
        var cur = LEVELS[level];
        // Pyramid geometry: 4 rows from top (idx 3) to bottom (idx 0)
        var yTops = [196, 148, 100, 52]; // index 0 = bottom, 3 = top
        var rowH = 44;
        // Left (Energy upright pyramid): center x = 165, widths decrease as level goes up
        var eWidths = [250, 196, 142, 88];
        var eColors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
        // Right (Toxin inverted pyramid): center x = 475, widths increase as level goes up
        var tWidths = [88, 142, 196, 250];
        var tColors = ['#fef3c7', '#fde047', '#fb923c', '#ef4444'];

        var eShapes = '';
        var tShapes = '';
        for (var i = 0; i < 4; i++) {
          var y = yTops[i];
          var isAct = (i === level);
          var strokeCol = isAct ? '#0f172a' : '#ffffff';
          var sw = isAct ? 3 : 1.5;

          // Upright trapezoid for Energy
          var wBotE = eWidths[i];
          var wTopE = (i < 3) ? eWidths[i + 1] : 54;
          var x1E = 165 - wBotE / 2, x2E = 165 + wBotE / 2;
          var x3E = 165 + wTopE / 2, x4E = 165 - wTopE / 2;
          eShapes +=
            '<polygon points="' + x1E + ',' + (y + rowH) + ' ' + x2E + ',' + (y + rowH) + ' ' + x3E + ',' + y + ' ' + x4E + ',' + y + '" ' +
            'fill="' + eColors[i] + '" stroke="' + strokeCol + '" stroke-width="' + sw + '" style="cursor:pointer" data-lvl="' + i + '"/>' +
            '<text x="165" y="' + (y + 27) + '" text-anchor="middle" font-size="11.5" font-weight="800" fill="#064e3b" font-family="' + FONT + '" style="pointer-events:none">' + LEVELS[i].energy + '</text>';

          // Inverted trapezoid for Toxin
          var wBotT = (i > 0) ? tWidths[i - 1] : 54;
          var wTopT = tWidths[i];
          var x1T = 475 - wBotT / 2, x2T = 475 + wBotT / 2;
          var x3T = 475 + wTopT / 2, x4T = 475 - wTopT / 2;
          tShapes +=
            '<polygon points="' + x1T + ',' + (y + rowH) + ' ' + x2T + ',' + (y + rowH) + ' ' + x3T + ',' + y + ' ' + x4T + ',' + y + '" ' +
            'fill="' + tColors[i] + '" stroke="' + strokeCol + '" stroke-width="' + sw + '" style="cursor:pointer" data-lvl="' + i + '"/>' +
            '<text x="475" y="' + (y + 27) + '" text-anchor="middle" font-size="11.5" font-weight="800" fill="' + (i === 3 ? '#ffffff' : '#7c2d12') + '" font-family="' + FONT + '" style="pointer-events:none">' + LEVELS[i].toxin + '</text>';
        }

        el.innerHTML =
          '<div class="hb-vis-controls">' +
            LEVELS.map(function (lv, idx) {
              return '<button type="button" class="hb-vis-btn ' + (level === idx ? 'active' : '') + '" data-lvl="' + idx + '">' + (idx + 1) + '. ' + lv.name.split('（')[0] + '</button>';
            }).join('') +
          '</div>' +
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="能量正金字塔與生物放大倒金字塔">' +
            '<text x="165" y="28" text-anchor="middle" font-size="13.5" font-weight="800" fill="#047857" font-family="' + FONT + '">🔺 能量正金字塔（10% 遞減）</text>' +
            '<text x="475" y="28" text-anchor="middle" font-size="13.5" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">🔻 生物放大倒金字塔（毒素遞增）</text>' +
            eShapes +
            tShapes +
            // Middle labels for each row
            '<text x="320" y="79" text-anchor="middle" font-size="11" font-weight="800" fill="' + (level === 3 ? '#dc2626' : '#475569') + '" font-family="' + FONT + '">三級消費者</text>' +
            '<text x="320" y="127" text-anchor="middle" font-size="11" font-weight="800" fill="' + (level === 2 ? '#dc2626' : '#475569') + '" font-family="' + FONT + '">次級消費者</text>' +
            '<text x="320" y="175" text-anchor="middle" font-size="11" font-weight="800" fill="' + (level === 1 ? '#dc2626' : '#475569') + '" font-family="' + FONT + '">初級消費者</text>' +
            '<text x="320" y="223" text-anchor="middle" font-size="11" font-weight="800" fill="' + (level === 0 ? '#059669' : '#475569') + '" font-family="' + FONT + '">生產者</text>' +
            '<text x="165" y="258" text-anchor="middle" font-size="11" fill="#065f46" font-weight="700" font-family="' + FONT + '">每往上一層，約 90% 以熱能散失（單向不循環）</text>' +
            '<text x="475" y="258" text-anchor="middle" font-size="11" fill="#991b1b" font-weight="700" font-family="' + FONT + '">高階消費者吃下最多獵物，重金屬濃度最高！</text>' +
          '</svg>' +
          '<div class="hb-vis-readout">' +
            '<strong>📌 選取階層：' + cur.name + '</strong><br>' +
            '可用能量：<strong>' + cur.energy + '</strong>｜體內重金屬濃度：<strong>' + cur.toxin + '</strong><br>' +
            cur.desc +
          '</div>';

        el.querySelectorAll('[data-lvl]').forEach(function (node) {
          node.addEventListener('click', function () {
            level = Number(node.getAttribute('data-lvl'));
            render();
          });
        });
      }

      render();
    }
  };

  /* ========================================================================
     7. SCI_8_2_1 — 物質狀態、密度與浮力
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_8_2_1'] = {
    title: '📈 M−V 圖去皮重法 ＆ 浮體／沉體受力與浮力公式',
    subtitle: '看懂 M−V 圖 y 截距就是空量筒質量，並徹底釐清浮體 B＝W 與沉體 B＝V物×D液 的差異',
    mount: function (el) {
      var mode = 'mv';
      var liq = 'water';
      var bMode = 'float';

      var LIQS = {
        oil: { name: '未知液甲（酒精／油）', d: 0.8, col: '#d97706' },
        water: { name: '純水', d: 1.0, col: '#0284c7' },
        salt: { name: '飽和食鹽水', d: 1.2, col: '#7c3aed' }
      };

      function render() {
        var html =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'mv' ? 'active' : '') + '" data-mode="mv">📈 M−V 圖去皮重法</button>' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'buoy' ? 'active' : '') + '" data-mode="buoy">⚖️ 浮體 vs 沉體受力箭頭圖</button>' +
          '</div>';

        if (mode === 'mv') {
          var l = LIQS[liq];
          var m0 = 40;
          // Graph origin: (80, 224), x scale: V=0..50 -> 80..330 (5px per cm3), y scale: M=0..120 -> 224..44 (1.5px per g)
          var xAt = function (v) { return 80 + v * 5; };
          var yAt = function (m) { return 224 - m * 1.5; };
          var v1 = 20, m1 = m0 + v1 * l.d;
          var v2 = 50, m2 = m0 + v2 * l.d;

          html +=
            '<div class="hb-vis-controls">' +
              ['oil', 'water', 'salt'].map(function (k) {
                return '<button type="button" class="hb-vis-btn ' + (liq === k ? 'active' : '') + '" data-liq="' + k + '">' + LIQS[k].name + '（D=' + LIQS[k].d.toFixed(1) + '）</button>';
              }).join('') +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="M-V圖去皮重法量筒與液體密度">' +
              // Grid & axes
              '<line x1="80" y1="224" x2="355" y2="224" stroke="#334155" stroke-width="2"/>' +
              '<line x1="80" y1="224" x2="80" y2="30" stroke="#334155" stroke-width="2"/>' +
              '<text x="220" y="256" text-anchor="middle" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '">液體體積 V（cm³）</text>' +
              '<text x="26" y="130" text-anchor="middle" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '" transform="rotate(-90 26 130)">總質量 M總（g）</text>' +
              // Ticks
              '<text x="80" y="240" text-anchor="middle" font-size="10.5" fill="#475569" font-family="' + FONT + '">0</text>' +
              '<text x="' + xAt(20) + '" y="240" text-anchor="middle" font-size="10.5" fill="#475569" font-family="' + FONT + '">20</text>' +
              '<text x="' + xAt(50) + '" y="240" text-anchor="middle" font-size="10.5" fill="#475569" font-family="' + FONT + '">50</text>' +
              '<text x="72" y="' + (yAt(40) + 4) + '" text-anchor="end" font-size="11" font-weight="800" fill="#dc2626" font-family="' + FONT + '">40</text>' +
              '<text x="72" y="' + (yAt(80) + 4) + '" text-anchor="end" font-size="10.5" fill="#475569" font-family="' + FONT + '">80</text>' +
              '<text x="72" y="' + (yAt(100) + 4) + '" text-anchor="end" font-size="10.5" fill="#475569" font-family="' + FONT + '">100</text>' +
              // Line
              '<line x1="' + xAt(0) + '" y1="' + yAt(m0) + '" x2="' + xAt(v2) + '" y2="' + yAt(m2) + '" stroke="' + l.col + '" stroke-width="3.5"/>' +
              // Slope triangle between v1=20 and v2=50
              '<line x1="' + xAt(v1) + '" y1="' + yAt(m1) + '" x2="' + xAt(v2) + '" y2="' + yAt(m1) + '" stroke="#059669" stroke-width="2" stroke-dasharray="4 3"/>' +
              '<line x1="' + xAt(v2) + '" y1="' + yAt(m1) + '" x2="' + xAt(v2) + '" y2="' + yAt(m2) + '" stroke="#059669" stroke-width="2" stroke-dasharray="4 3"/>' +
              '<text x="' + ((xAt(v1) + xAt(v2)) / 2) + '" y="' + (yAt(m1) + 15) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#059669" font-family="' + FONT + '">ΔV = 30</text>' +
              '<text x="' + (xAt(v2) + 8) + '" y="' + ((yAt(m1) + yAt(m2)) / 2 + 4) + '" font-size="11" font-weight="800" fill="#059669" font-family="' + FONT + '">ΔM = ' + (m2 - m1).toFixed(0) + '</text>' +
              // Intercept point
              '<circle cx="' + xAt(0) + '" cy="' + yAt(m0) + '" r="6" fill="#dc2626"/>' +
              '<circle cx="' + xAt(v1) + '" cy="' + yAt(m1) + '" r="5" fill="' + l.col + '"/>' +
              '<circle cx="' + xAt(v2) + '" cy="' + yAt(m2) + '" r="5" fill="' + l.col + '"/>' +
              '<text x="90" y="' + (yAt(m0) + 18) + '" font-size="11" font-weight="800" fill="#dc2626" font-family="' + FONT + '">← y 截距＝空量筒質量 40 g</text>' +
              // Right formula box
              '<rect x="404" y="22" width="220" height="226" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>' +
              '<text x="514" y="48" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">📐 去皮重求密度兩步驟</text>' +
              '<text x="420" y="78" font-size="12" font-weight="700" fill="#dc2626" font-family="' + FONT + '">① 找 V = 0 處（截距）：</text>' +
              '<text x="428" y="98" font-size="12" font-weight="800" fill="#0f172a" font-family="' + FONT + '">M空量筒 = 40 g</text>' +
              '<text x="420" y="130" font-size="12" font-weight="700" fill="#059669" font-family="' + FONT + '">② 用斜率（ΔM ÷ ΔV）：</text>' +
              '<text x="428" y="152" font-size="12.5" font-weight="800" fill="' + l.col + '" font-family="' + FONT + '">D = (' + m2 + ' − ' + m1 + ') ÷ (50 − 20)</text>' +
              '<text x="428" y="174" font-size="13.5" font-weight="800" fill="' + l.col + '" font-family="' + FONT + '">= ' + l.d.toFixed(1) + ' g/cm³</text>' +
              '<rect x="418" y="192" width="192" height="44" rx="8" fill="#fef2f2" stroke="#fca5a5"/>' +
              '<text x="514" y="211" text-anchor="middle" font-size="11" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">❌ 常見地雷：不可直接算</text>' +
              '<text x="514" y="227" text-anchor="middle" font-size="11" font-weight="700" fill="#991b1b" font-family="' + FONT + '">M總 ÷ V（沒扣量筒重！）</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>🎯 讀圖秒殺：</strong>任何沒通過原點的 M−V 直線，<strong>y 軸截距就是容器質量（40 g）</strong>，而<strong>直線斜率 ΔM/ΔV 就是液體密度（' + l.d.toFixed(1) + ' g/cm³）</strong>；斜率越陡，密度越大！' +
            '</div>';
        } else {
          var isFloat = (bMode === 'float');
          var isSink = (bMode === 'sink');
          var blockY = isFloat ? 86 : (isSink ? 166 : 126);
          var blockCol = isFloat ? '#fef3c7' : (isSink ? '#cbd5e1' : '#e0e7ff');
          var blockStroke = isFloat ? '#d97706' : (isSink ? '#475569' : '#4f46e5');
          var titleB = isFloat ? '🪵 浮體（D物 < D液）' : (isSink ? '🧱 沉體（D物 > D液）' : '🫧 懸浮體（D物 = D液）');

          html +=
            '<div class="hb-vis-controls">' +
              '<button type="button" class="hb-vis-btn ' + (bMode === 'float' ? 'active' : '') + '" data-bmode="float">🪵 浮體（B = W）</button>' +
              '<button type="button" class="hb-vis-btn ' + (bMode === 'sink' ? 'active' : '') + '" data-bmode="sink">🧱 沉體（B = V物×D液）</button>' +
              '<button type="button" class="hb-vis-btn ' + (bMode === 'susp' ? 'active' : '') + '" data-bmode="susp">🫧 懸浮體（D物 = D液）</button>' +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="浮體與沉體受力箭頭圖">' +
              '<defs>' +
                '<marker id="s821-up" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#0284c7"/></marker>' +
                '<marker id="s821-dn" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/></marker>' +
                '<marker id="s821-n" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#059669"/></marker>' +
              '</defs>' +
              // Beaker & Water
              '<rect x="66" y="108" width="218" height="122" fill="#e0f2fe"/>' +
              '<path d="M66,44 L66,230 L284,230 L284,44" fill="none" stroke="#334155" stroke-width="4"/>' +
              '<line x1="66" y1="108" x2="284" y2="108" stroke="#0284c7" stroke-width="2" stroke-dasharray="5 3"/>' +
              // Object block
              '<rect x="135" y="' + blockY + '" width="80" height="60" rx="6" fill="' + blockCol + '" stroke="' + blockStroke + '" stroke-width="3"/>' +
              '<text x="175" y="' + (blockY + 35) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#0f172a" font-family="' + FONT + '">物體 W</text>' +
              // Downward W arrow
              '<line x1="158" y1="' + (blockY + 30) + '" x2="158" y2="' + (blockY + 95) + '" stroke="#dc2626" stroke-width="4" marker-end="url(#s821-dn)"/>' +
              '<text x="148" y="' + (blockY + 86) + '" text-anchor="end" font-size="12" font-weight="800" fill="#dc2626" font-family="' + FONT + '">物重 W</text>' +
              // Upward B arrow
              '<line x1="192" y1="' + (blockY + 30) + '" x2="192" y2="' + (blockY - (isSink ? 14 : 35)) + '" stroke="#0284c7" stroke-width="4" marker-end="url(#s821-up)"/>' +
              '<text x="202" y="' + (blockY - (isSink ? 4 : 20)) + '" font-size="12" font-weight="800" fill="#0284c7" font-family="' + FONT + '">浮力 B</text>' +
              // Normal force if sink
              (isSink
                ? '<line x1="212" y1="228" x2="212" y2="194" stroke="#059669" stroke-width="3.5" marker-end="url(#s821-n)"/>' +
                  '<text x="220" y="216" font-size="11.5" font-weight="800" fill="#059669" font-family="' + FONT + '">底撐力 N</text>'
                : '') +
              // Right analysis box
              '<rect x="316" y="20" width="308" height="230" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>' +
              '<text x="470" y="48" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a" font-family="' + FONT + '">' + titleB + '</text>' +
              '<rect x="334" y="64" width="272" height="44" rx="8" fill="#eff6ff" stroke="#93c5fd"/>' +
              '<text x="470" y="91" text-anchor="middle" font-size="14" font-weight="800" fill="#1d4ed8" font-family="' + FONT + '">' + (isFloat ? '首選公式：B ＝ W（物重）' : isSink ? '首選公式：B ＝ V物 × D液' : 'B ＝ W ＝ V物 × D液') + '</text>' +
              '<text x="336" y="134" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '">• 受力平衡：' + (isFloat ? 'B = W（合力為 0）' : isSink ? 'B + N = W（故 B < W）' : 'B = W（完全沒入且合力為 0）') + '</text>' +
              '<text x="336" y="162" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '">• 沒入體積：' + (isFloat ? 'V沒 = W ÷ D液（只沒入部分）' : 'V沒 = V物（100% 沒入）') + '</text>' +
              '<rect x="334" y="182" width="272" height="54" rx="8" fill="#fef3c7" stroke="#f59e0b"/>' +
              '<text x="470" y="204" text-anchor="middle" font-size="11.5" font-weight="800" fill="#92400e" font-family="' + FONT + '">🧂 考場加鹽變題（D液 變大）：</text>' +
              '<text x="470" y="224" text-anchor="middle" font-size="11.5" font-weight="700" fill="#78350f" font-family="' + FONT + '">' + (isFloat ? '仍浮著 → 浮力 B 不變！但上浮（V沒 變小）' : isSink ? '仍沉底 → 浮力 B 變大！底撐力 N 變小' : 'D液 > D物 → 變成浮體！浮力仍等於 W（不變）') + '</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>🎯 浮力唯一心法：</strong>先看「浮」還是「沉」！<strong>浮體直接看物重（B = W）</strong>，不管液體換多濃、只要還浮著浮力就不變；<strong>沉體看排開液重（B = V物 × D液）</strong>，液體越濃浮力越大！' +
            '</div>';
        }

        el.innerHTML = html;
        el.querySelectorAll('[data-mode]').forEach(function (b) {
          b.addEventListener('click', function () { mode = b.getAttribute('data-mode'); render(); });
        });
        el.querySelectorAll('[data-liq]').forEach(function (b) {
          b.addEventListener('click', function () { liq = b.getAttribute('data-liq'); render(); });
        });
        el.querySelectorAll('[data-bmode]').forEach(function (b) {
          b.addEventListener('click', function () { bMode = b.getAttribute('data-bmode'); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     8. SCI_8_2_2 — 聲波與光學（凸透鏡六區成像作圖器）
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_8_2_2'] = {
    title: '🔍 凸透鏡成像兩條特殊光線作圖器',
    subtitle: '切換 5 大物距位置，即時繪製「平行主軸→過焦點」與「過鏡心不偏折」兩條特殊光線與成像！',
    mount: function (el) {
      var zone = 'gt2f';
      var CX = 320, CY = 148, F = 66, OBJ_H = 52;

      var ZONES = {
        gt2f: { label: 'u > 2F', u: 175, vText: 'F < v < 2F', nature: '倒立、縮小、實像', app: '照相機、眼睛視網膜' },
        eq2f: { label: 'u = 2F', u: 132, vText: 'v = 2F', nature: '倒立、等大、實像', app: '1:1 複印機（物像距 4F）' },
        between: { label: 'F < u < 2F', u: 96, vText: 'v > 2F', nature: '倒立、放大、實像', app: '投影機、顯微鏡物鏡' },
        eqf: { label: 'u = F', u: 66, vText: '無窮遠（平行光）', nature: '不成像（無法相交）', app: '探照燈、手電筒平行光' },
        ltf: { label: 'u < F', u: 40, vText: '物同側虛像', nature: '正立、放大、虛像', app: '放大鏡、遠視眼校正輔助' }
      };

      function render() {
        var z = ZONES[zone];
        var ox = CX - z.u;
        var oy = CY - OBJ_H;
        var raysSvg = '';
        var imgSvg = '';

        if (zone === 'eqf') {
          // Parallel rays emerging to the right
          var slope = OBJ_H / F;
          var rxEnd = 615;
          var r1y = CY - OBJ_H + (rxEnd - CX) * slope;
          var r2y = CY + (rxEnd - CX) * slope;
          raysSvg =
            '<line x1="' + ox + '" y1="' + oy + '" x2="' + CX + '" y2="' + oy + '" stroke="#dc2626" stroke-width="2.2"/>' +
            '<line x1="' + CX + '" y1="' + oy + '" x2="' + rxEnd + '" y2="' + Math.min(258, r1y) + '" stroke="#dc2626" stroke-width="2.2"/>' +
            '<line x1="' + ox + '" y1="' + oy + '" x2="' + rxEnd + '" y2="' + Math.min(264, r2y) + '" stroke="#2563eb" stroke-width="2.2"/>' +
            '<rect x="440" y="34" width="174" height="38" rx="8" fill="#fef3c7" stroke="#f59e0b"/>' +
            '<text x="527" y="57" text-anchor="middle" font-size="12" font-weight="800" fill="#92400e" font-family="' + FONT + '">折射後互相平行 → 不成像！</text>';
        } else {
          // Thin lens equation: 1/v = 1/F - 1/u
          var v = (F * z.u) / (z.u - F);
          var ix = CX + v;
          var imgH = -OBJ_H * (v / z.u); // positive means below axis if inverted? Wait: y increases downward!
          // Object tip is at CY - OBJ_H (above axis). Magnification m = -v/u.
          // If real (v > 0), image is inverted -> tip is BELOW axis at CY + OBJ_H*(v/u).
          // If virtual (v < 0), image is upright -> tip is ABOVE axis at CY - OBJ_H*(-v/u) = CY + OBJ_H*(v/u)!
          // Both formulas unify to iy = CY + OBJ_H * (v / z.u)!
          var iy = CY + OBJ_H * (v / z.u);

          if (v > 0) {
            raysSvg =
              '<line x1="' + ox + '" y1="' + oy + '" x2="' + CX + '" y2="' + oy + '" stroke="#dc2626" stroke-width="2.2"/>' +
              '<line x1="' + CX + '" y1="' + oy + '" x2="' + ix.toFixed(1) + '" y2="' + iy.toFixed(1) + '" stroke="#dc2626" stroke-width="2.2"/>' +
              '<line x1="' + ox + '" y1="' + oy + '" x2="' + ix.toFixed(1) + '" y2="' + iy.toFixed(1) + '" stroke="#2563eb" stroke-width="2.2"/>';
            imgSvg =
              '<line x1="' + ix.toFixed(1) + '" y1="' + CY + '" x2="' + ix.toFixed(1) + '" y2="' + iy.toFixed(1) + '" stroke="#7c3aed" stroke-width="4" marker-end="url(#s822-img)"/>' +
              '<text x="' + ix.toFixed(1) + '" y="' + (iy + 16).toFixed(1) + '" text-anchor="middle" font-size="11.5" font-weight="800" fill="#6b21a8" font-family="' + FONT + '">實像</text>';
          } else {
            // Virtual image on left side (ix < CX, iy < CY)
            // Extend real rays to the right
            var r1EndX = 560;
            var r1EndY = oy + ((CY - oy) / F) * (r1EndX - CX);
            var r2EndX = 560;
            var r2EndY = CY + ((CY - oy) / z.u) * (r2EndX - CX);
            raysSvg =
              '<line x1="' + ox + '" y1="' + oy + '" x2="' + CX + '" y2="' + oy + '" stroke="#dc2626" stroke-width="2.2"/>' +
              '<line x1="' + CX + '" y1="' + oy + '" x2="' + r1EndX + '" y2="' + Math.min(262, r1EndY).toFixed(1) + '" stroke="#dc2626" stroke-width="2.2"/>' +
              '<line x1="' + ox + '" y1="' + oy + '" x2="' + r2EndX + '" y2="' + Math.min(262, r2EndY).toFixed(1) + '" stroke="#2563eb" stroke-width="2.2"/>' +
              // Dashed backward extensions to virtual tip (ix, iy)
              '<line x1="' + CX + '" y1="' + oy + '" x2="' + ix.toFixed(1) + '" y2="' + iy.toFixed(1) + '" stroke="#dc2626" stroke-width="1.8" stroke-dasharray="5 3"/>' +
              '<line x1="' + ox + '" y1="' + oy + '" x2="' + ix.toFixed(1) + '" y2="' + iy.toFixed(1) + '" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="5 3"/>';
            imgSvg =
              '<line x1="' + ix.toFixed(1) + '" y1="' + CY + '" x2="' + ix.toFixed(1) + '" y2="' + iy.toFixed(1) + '" stroke="#7c3aed" stroke-width="4" stroke-dasharray="5 3" marker-end="url(#s822-img)"/>' +
              '<text x="' + ix.toFixed(1) + '" y="' + (iy - 8).toFixed(1) + '" text-anchor="middle" font-size="11.5" font-weight="800" fill="#6b21a8" font-family="' + FONT + '">正立放大虛像</text>';
          }
        }

        el.innerHTML =
          '<div class="hb-vis-controls">' +
            Object.keys(ZONES).map(function (k) {
              return '<button type="button" class="hb-vis-btn ' + (zone === k ? 'active' : '') + '" data-zone="' + k + '">' + ZONES[k].label + '</button>';
            }).join('') +
          '</div>' +
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="凸透鏡成像光線作圖器">' +
            '<defs>' +
              '<marker id="s822-obj" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#059669"/></marker>' +
              '<marker id="s822-img" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#7c3aed"/></marker>' +
            '</defs>' +
            // Legend strip
            '<text x="16" y="22" font-size="11" font-weight="700" fill="#dc2626" font-family="' + FONT + '">━ 光線1：平行主軸→過焦點 F\'</text>' +
            '<text x="218" y="22" font-size="11" font-weight="700" fill="#2563eb" font-family="' + FONT + '">━ 光線2：過鏡心 O 不偏折</text>' +
            '<text x="404" y="22" font-size="11" font-weight="800" fill="#059669" font-family="' + FONT + '">⬆ 綠＝物體</text>' +
            '<text x="488" y="22" font-size="11" font-weight="800" fill="#7c3aed" font-family="' + FONT + '">⬆ 紫＝成像</text>' +
            // Optical axis
            '<line x1="20" y1="' + CY + '" x2="620" y2="' + CY + '" stroke="#64748b" stroke-width="1.8" stroke-dasharray="6 4"/>' +
            // Convex lens
            '<path d="M320,38 Q336,148 320,258 Q304,148 320,38 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="2.5"/>' +
            '<text x="320" y="266" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0369a1" font-family="' + FONT + '">凸透鏡 O</text>' +
            // F and 2F marks
            [
              { x: CX - 2 * F, t: '2F' },
              { x: CX - F, t: 'F' },
              { x: CX + F, t: 'F\'' },
              { x: CX + 2 * F, t: '2F\'' }
            ].map(function (pt) {
              return '<circle cx="' + pt.x + '" cy="' + CY + '" r="3.5" fill="#0f172a"/>' +
                '<text x="' + pt.x + '" y="' + (CY + 18) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#334155" font-family="' + FONT + '">' + pt.t + '</text>';
            }).join('') +
            raysSvg +
            // Object arrow
            '<line x1="' + ox + '" y1="' + CY + '" x2="' + ox + '" y2="' + oy + '" stroke="#059669" stroke-width="4" marker-end="url(#s822-obj)"/>' +
            '<text x="' + ox + '" y="' + (oy - 8) + '" text-anchor="middle" font-size="11.5" font-weight="800" fill="#065f46" font-family="' + FONT + '">物體</text>' +
            imgSvg +
          '</svg>' +
          '<div class="hb-vis-readout">' +
            '<strong>📌 目前區間：' + z.label + '</strong>｜像距位置：<strong>' + z.vText + '</strong>｜成像性質：<strong>' + z.nature + '</strong><br>' +
            '<strong>🔧 常見應用：</strong>' + z.app + '（口訣：<strong>一焦分虛實、二焦分大小；物近像遠像變大</strong>！）' +
          '</div>';

        el.querySelectorAll('[data-zone]').forEach(function (b) {
          b.addEventListener('click', function () { zone = b.getAttribute('data-zone'); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     9. SCI_8_2_3 — 熱學比熱與狀態變化
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_8_2_3'] = {
    title: '🔥 加熱時間−溫度階梯圖（冰 → 水 → 水蒸氣）',
    subtitle: '點擊各線段比較「斜線段（比熱決定斜率）」與「水平平台期（吸潛熱打破分子排列，溫度不變）」',
    mount: function (el) {
      var seg = 'all';

      var SEGS = {
        all: {
          title: '全段總覽：固 → 液 → 氣 三態變化',
          desc: '穩定熱源下，<strong>加熱時間 ∝ 吸收熱量 H</strong>。斜線段溫度上升（ΔT ≠ 0，比熱越小斜率越陡）；水平平台期吸熱但溫度固定（ΔT = 0，狀態共存）。'
        },
        s1: {
          title: '① 固態冰升溫（−20°C → 0°C）',
          desc: '全為固態冰。因為冰的比熱（0.5 cal/g·°C）只有水的一半，吸收相同熱量升溫較快，因此<strong>斜率比液態水更陡</strong>！'
        },
        s2: {
          title: '② 熔化平台期（0°C，冰水共存）',
          desc: '吸熱但溫度維持 0°C 不變！熱量全用於<strong>打破固體冰晶的整齊排列（熔化潛熱）</strong>，過程中冰越來越少、水越來越多。'
        },
        s3: {
          title: '③ 液態水升溫（0°C → 100°C）',
          desc: '全為液態水。水的比熱（1.0 cal/g·°C）較大，升溫較慢，故<strong>斜率比冰與水蒸氣平緩</strong>（H = m × s × ΔT）。'
        },
        s4: {
          title: '④ 沸騰平台期（100°C，液氣共存）',
          desc: '吸熱但溫度維持 100°C 不變！需要大量<strong>汽化潛熱</strong>將液體分子徹底拉開變成氣體，因此<strong>沸騰平台比熔化平台更長</strong>！'
        },
        s5: {
          title: '⑤ 氣態水蒸氣升溫（100°C 以上）',
          desc: '全為水蒸氣。比熱約 0.48 cal/g·°C（比水小），故斜率再度變陡！'
        }
      };

      // Coordinates of staircase points:
      // P0(70, 224) [-20C] -> P1(120, 186) [0C] -> P2(205, 186) [0C] -> P3(365, 86) [100C] -> P4(525, 86) [100C] -> P5(585, 42) [120C]
      var PTS = [
        { id: 's1', x1: 70, y1: 224, x2: 120, y2: 186, col: '#0284c7', label: '① 固態冰', lx: 82, ly: 200 },
        { id: 's2', x1: 120, y1: 186, x2: 205, y2: 186, col: '#d97706', label: '② 熔化（冰+水）', lx: 162, ly: 174 },
        { id: 's3', x1: 205, y1: 186, x2: 365, y2: 86, col: '#059669', label: '③ 液態水（斜率較緩）', lx: 292, ly: 150 },
        { id: 's4', x1: 365, y1: 86, x2: 525, y2: 86, col: '#dc2626', label: '④ 沸騰（水+蒸氣）', lx: 445, ly: 74 },
        { id: 's5', x1: 525, y1: 86, x2: 585, y2: 42, col: '#7c3aed', label: '⑤ 蒸氣', lx: 565, ly: 52 }
      ];

      function render() {
        var cur = SEGS[seg];
        el.innerHTML =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn ' + (seg === 'all' ? 'active' : '') + '" data-seg="all">全段總覽</button>' +
            '<button type="button" class="hb-vis-btn ' + (seg === 's1' ? 'active' : '') + '" data-seg="s1">① 固態升溫</button>' +
            '<button type="button" class="hb-vis-btn ' + (seg === 's2' ? 'active' : '') + '" data-seg="s2">② 熔化平台期</button>' +
            '<button type="button" class="hb-vis-btn ' + (seg === 's3' ? 'active' : '') + '" data-seg="s3">③ 液態升溫</button>' +
            '<button type="button" class="hb-vis-btn ' + (seg === 's4' ? 'active' : '') + '" data-seg="s4">④ 沸騰平台期</button>' +
            '<button type="button" class="hb-vis-btn ' + (seg === 's5' ? 'active' : '') + '" data-seg="s5">⑤ 蒸氣升溫</button>' +
          '</div>' +
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="加熱時間溫度階梯圖">' +
            // Axes
            '<line x1="65" y1="234" x2="612" y2="234" stroke="#334155" stroke-width="2"/>' +
            '<line x1="65" y1="234" x2="65" y2="22" stroke="#334155" stroke-width="2"/>' +
            '<text x="340" y="260" text-anchor="middle" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '">穩定熱源加熱時間 t（吸收熱量 H）→</text>' +
            '<text x="22" y="130" text-anchor="middle" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '" transform="rotate(-90 22 130)">溫度 T（°C）</text>' +
            // Horizontal reference lines for 0C and 100C
            '<line x1="65" y1="186" x2="605" y2="186" stroke="#cbd5e1" stroke-dasharray="4 3"/>' +
            '<text x="58" y="190" text-anchor="end" font-size="11" font-weight="800" fill="#0284c7" font-family="' + FONT + '">0°C</text>' +
            '<line x1="65" y1="86" x2="605" y2="86" stroke="#cbd5e1" stroke-dasharray="4 3"/>' +
            '<text x="58" y="90" text-anchor="end" font-size="11" font-weight="800" fill="#dc2626" font-family="' + FONT + '">100°C</text>' +
            '<text x="58" y="226" text-anchor="end" font-size="10.5" fill="#64748b" font-family="' + FONT + '">−20°C</text>' +
            // Segments
            PTS.map(function (p) {
              var active = (seg === 'all' || seg === p.id);
              var sw = (seg === p.id) ? 7 : 4;
              var op = active ? 1 : 0.25;
              return '<g opacity="' + op + '" style="cursor:pointer" data-seg="' + p.id + '">' +
                '<line x1="' + p.x1 + '" y1="' + p.y1 + '" x2="' + p.x2 + '" y2="' + p.y2 + '" stroke="' + p.col + '" stroke-width="' + sw + '" stroke-linecap="round"/>' +
                '<line x1="' + p.x1 + '" y1="' + p.y1 + '" x2="' + p.x2 + '" y2="' + p.y2 + '" stroke="transparent" stroke-width="18"/>' +
                '<circle cx="' + p.x1 + '" cy="' + p.y1 + '" r="4" fill="' + p.col + '"/>' +
                '<circle cx="' + p.x2 + '" cy="' + p.y2 + '" r="4" fill="' + p.col + '"/>' +
                '<text x="' + p.lx + '" y="' + p.ly + '" text-anchor="middle" font-size="11" font-weight="800" fill="' + p.col + '" font-family="' + FONT + '">' + p.label + '</text>' +
              '</g>';
            }).join('') +
            // Comparison badge
            '<rect x="378" y="148" width="226" height="66" rx="10" fill="#f8fafc" stroke="#cbd5e1"/>' +
            '<text x="491" y="169" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">💡 斜率判比熱口訣</text>' +
            '<text x="491" y="188" text-anchor="middle" font-size="11" fill="#334155" font-family="' + FONT + '">斜線越陡 → 升溫越快 → 比熱越小</text>' +
            '<text x="491" y="205" text-anchor="middle" font-size="11" font-weight="700" fill="#dc2626" font-family="' + FONT + '">水平線段 → ΔT = 0（純吸潛熱）</text>' +
          '</svg>' +
          '<div class="hb-vis-readout">' +
            '<strong>🔥 ' + cur.title + '：</strong>' + cur.desc +
          '</div>';

        el.querySelectorAll('[data-seg]').forEach(function (node) {
          node.addEventListener('click', function () { seg = node.getAttribute('data-seg'); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     10. SCI_8_2_4 — 化學反應與質量守恆（限量試劑分子配對）
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_8_2_4'] = {
    title: '⚛️ 限量試劑分子球配對圖（2H₂ ＋ O₂ → 2H₂O）',
    subtitle: '切換不同莫耳數組合，實戰「除以係數取最小」並數一數生成幾分子水、剩餘哪一種氣體！',
    mount: function (el) {
      var preset = '4_3';

      var PRESETS = {
        '4_3': { h2: 4, o2: 3, label: '4 mol H₂ + 3 mol O₂' },
        '6_2': { h2: 6, o2: 2, label: '6 mol H₂ + 2 mol O₂' },
        '4_2': { h2: 4, o2: 2, label: '4 mol H₂ + 2 mol O₂（恰好用完）' },
        '2_3': { h2: 2, o2: 3, label: '2 mol H₂ + 3 mol O₂' }
      };

      function drawH2(x, y) {
        return '<g transform="translate(' + x + ',' + y + ')">' +
          '<circle cx="-7" cy="0" r="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>' +
          '<circle cx="7" cy="0" r="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>' +
          '<text x="0" y="3.5" text-anchor="middle" font-size="8.5" font-weight="800" fill="#0369a1" font-family="' + FONT + '">H₂</text>' +
        '</g>';
      }

      function drawO2(x, y) {
        return '<g transform="translate(' + x + ',' + y + ')">' +
          '<circle cx="-8" cy="0" r="9.5" fill="#fecaca" stroke="#dc2626" stroke-width="2"/>' +
          '<circle cx="8" cy="0" r="9.5" fill="#fecaca" stroke="#dc2626" stroke-width="2"/>' +
          '<text x="0" y="3.5" text-anchor="middle" font-size="8.5" font-weight="800" fill="#991b1b" font-family="' + FONT + '">O₂</text>' +
        '</g>';
      }

      function drawH2O(x, y) {
        return '<g transform="translate(' + x + ',' + y + ')">' +
          '<circle cx="0" cy="-2" r="9.5" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>' +
          '<circle cx="-10" cy="8" r="6.5" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.8"/>' +
          '<circle cx="10" cy="8" r="6.5" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.8"/>' +
          '<text x="0" y="1" text-anchor="middle" font-size="7.5" font-weight="800" fill="#7f1d1d" font-family="' + FONT + '">H₂O</text>' +
        '</g>';
      }

      function render() {
        var p = PRESETS[preset];
        var gH2 = p.h2 / 2;
        var gO2 = p.o2 / 1;
        var rxnGroups = Math.min(gH2, gO2);
        var usedH2 = rxnGroups * 2;
        var usedO2 = rxnGroups * 1;
        var madeH2O = rxnGroups * 2;
        var leftH2 = p.h2 - usedH2;
        var leftO2 = p.o2 - usedO2;
        var limiter = (gH2 < gO2) ? 'H₂（氫氣）' : (gO2 < gH2 ? 'O₂（氧氣）' : '兩者皆恰好完全用完！');

        var beforeSvg = '';
        for (var i = 0; i < p.h2; i++) {
          beforeSvg += drawH2(54 + (i % 3) * 56, 78 + Math.floor(i / 3) * 34);
        }
        for (var j = 0; j < p.o2; j++) {
          beforeSvg += drawO2(58 + (j % 3) * 56, 174 + Math.floor(j / 3) * 34);
        }

        var afterSvg = '';
        for (var k = 0; k < madeH2O; k++) {
          afterSvg += drawH2O(412 + (k % 3) * 64, 78 + Math.floor(k / 3) * 42);
        }
        var lx = 412;
        for (var m = 0; m < leftH2; m++) {
          afterSvg += drawH2(lx + m * 56, 198);
        }
        for (var n = 0; n < leftO2; n++) {
          afterSvg += drawO2(lx + n * 58, 198);
        }

        el.innerHTML =
          '<div class="hb-vis-controls">' +
            Object.keys(PRESETS).map(function (k) {
              return '<button type="button" class="hb-vis-btn ' + (preset === k ? 'active' : '') + '" data-pre="' + k + '">' + PRESETS[k].label + '</button>';
            }).join('') +
          '</div>' +
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="限量試劑分子配對圖">' +
            '<defs><marker id="s824-a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#059669"/></marker></defs>' +
            // Left box: Before
            '<rect x="18" y="20" width="212" height="230" rx="12" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>' +
            '<text x="124" y="44" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a" font-family="' + FONT + '">反應前：' + p.h2 + ' H₂ ＋ ' + p.o2 + ' O₂</text>' +
            '<line x1="34" y1="142" x2="214" y2="142" stroke="#e2e8f0" stroke-dasharray="4 3"/>' +
            beforeSvg +
            // Center reaction formula
            '<line x1="240" y1="128" x2="352" y2="128" stroke="#059669" stroke-width="4" marker-end="url(#s824-a)"/>' +
            '<text x="298" y="96" text-anchor="middle" font-size="12" font-weight="800" fill="#065f46" font-family="' + FONT + '">2H₂ ＋ O₂ → 2H₂O</text>' +
            '<text x="298" y="116" text-anchor="middle" font-size="11" font-weight="700" fill="#0284c7" font-family="' + FONT + '">反應組數 ＝ ' + rxnGroups + ' 組</text>' +
            '<text x="298" y="152" text-anchor="middle" font-size="10.5" fill="#475569" font-family="' + FONT + '">min(' + p.h2 + '÷2, ' + p.o2 + '÷1)</text>' +
            '<text x="298" y="168" text-anchor="middle" font-size="10.5" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">限量：' + (gH2 < gO2 ? 'H₂' : gO2 < gH2 ? 'O₂' : '無剩餘') + '</text>' +
            // Right box: After
            '<rect x="368" y="20" width="254" height="230" rx="12" fill="#f0fdf4" stroke="#86efac" stroke-width="2"/>' +
            '<text x="495" y="44" text-anchor="middle" font-size="13" font-weight="800" fill="#166534" font-family="' + FONT + '">反應後：生成 ' + madeH2O + ' mol H₂O</text>' +
            afterSvg +
            '<rect x="382" y="156" width="226" height="82" rx="8" fill="#fffbeb" stroke="#fcd34d" stroke-dasharray="4 3" opacity="0.55"/>' +
            '<text x="495" y="173" text-anchor="middle" font-size="11" font-weight="800" fill="#92400e" font-family="' + FONT + '">' + (leftH2 > 0 ? '剩餘未反應：' + leftH2 + ' mol H₂' : leftO2 > 0 ? '剩餘未反應：' + leftO2 + ' mol O₂' : '✨ 完美用完，無剩餘反應物！') + '</text>' +
            '<text x="495" y="232" text-anchor="middle" font-size="10.5" fill="#64748b" font-family="' + FONT + '">原子總數不變 → 總質量必守恆！</text>' +
          '</svg>' +
          '<table class="hb-vis-table">' +
            '<thead><tr><th>物質</th><th>係數</th><th>原有莫耳數</th><th>除以係數（可配組數）</th><th>反應後結果</th></tr></thead>' +
            '<tbody>' +
              '<tr class="' + (gH2 <= gO2 ? 'vis-row-win' : '') + '"><td>H₂（氫氣）</td><td>2</td><td>' + p.h2 + ' mol</td><td>' + p.h2 + ' ÷ 2 ＝ <strong>' + gH2 + '</strong></td><td>剩 ' + leftH2 + ' mol</td></tr>' +
              '<tr class="' + (gO2 <= gH2 ? 'vis-row-win' : '') + '"><td>O₂（氧氣）</td><td>1</td><td>' + p.o2 + ' mol</td><td>' + p.o2 + ' ÷ 1 ＝ <strong>' + gO2 + '</strong></td><td>剩 ' + leftO2 + ' mol</td></tr>' +
              '<tr><td>H₂O（水）</td><td>2</td><td>0 mol</td><td>由最小組數（' + rxnGroups + '）決定</td><td><strong>生成 ' + madeH2O + ' mol</strong></td></tr>' +
            '</tbody>' +
          '</table>' +
          '<div class="hb-vis-readout" style="margin-top:10px;">' +
            '<strong>🎯 限量試劑結論：</strong>限量試劑為 <strong>' + limiter + '</strong>，反應總共進行 ' + rxnGroups + ' 組，生成 <strong>' + madeH2O + ' mol H₂O</strong>。' +
          '</div>';

        el.querySelectorAll('[data-pre]').forEach(function (b) {
          b.addEventListener('click', function () { preset = b.getAttribute('data-pre'); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     11. SCI_8_2_5 — 氧化還原與酸鹼鹽
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_8_2_5'] = {
    title: '⚔️ 金屬搶氧拔河（氧化還原）＆ 酸鹼滴定離子舞池',
    subtitle: '一眼搞懂「得氧＝被氧化＝還原劑」，以及酸鹼中和過程中 H⁺、OH⁻、Cl⁻、Na⁺ 離子數量變化',
    mount: function (el) {
      var mode = 'redox';
      var rx = 'mg_cuo';
      var titr = 'before';

      var RXNS = {
        mg_cuo: {
          title: 'Mg ＋ CuO → MgO ＋ Cu（可發生！）',
          can: true,
          left: 'Mg（活性大）', right: 'CuO（Cu 活性小）',
          winNote: 'Mg 活性 ＞ Cu → Mg 成功把 O 搶走！',
          oxBox: 'Mg → MgO（得氧＝被氧化＝還原劑）',
          redBox: 'CuO → Cu（失氧＝被還原＝氧化劑）'
        },
        cu_mgo: {
          title: 'Cu ＋ MgO → 不反應！',
          can: false,
          left: 'Cu（活性小）', right: 'MgO（Mg 活性大）',
          winNote: 'Cu 活性 ＜ Mg → 搶不贏 Mg 的氧，完全不反應！',
          oxBox: 'MgO 緊緊抓著氧，非常安定',
          redBox: 'Cu 無法搶氧 → 無氧化還原發生'
        },
        c_cuo: {
          title: 'C ＋ 2CuO → CO₂ ＋ 2Cu（碳還原煉銅）',
          can: true,
          left: 'C（活性較大）', right: 'CuO（Cu 活性小）',
          winNote: 'C 活性 ＞ Cu → 碳粉把氧化銅的氧搶走，煉出紅棕色銅！',
          oxBox: 'C → CO₂（得氧＝被氧化＝還原劑）',
          redBox: 'CuO → Cu（失氧＝被還原＝氧化劑）'
        }
      };

      var TITR = {
        before: { label: '① 滴定前（純 HCl）', ph: '1.0（強酸）', color: '#f8fafc', colName: '酚酞：無色', h: 3, cl: 3, na: 0, oh: 0, h2o: 0, note: '錐形瓶內只有 H⁺ 與 Cl⁻（各 3 顆），呈強酸性，酚酞為無色。' },
        mid: { label: '② 未達當量點（加 1 份 NaOH）', ph: '2.0（仍酸性）', color: '#f8fafc', colName: '酚酞：無色', h: 2, cl: 3, na: 1, oh: 0, h2o: 1, note: '滴入的 1 顆 OH⁻ 立刻與 1 顆 H⁺ 結合變成水並放熱！瓶內剩 2 顆 H⁺，仍為酸性。' },
        eq: { label: '③ 當量點（恰好中和）', ph: '7.0（中性）', color: '#fce7f3', colName: '酚酞：淡粉紅', h: 0, cl: 3, na: 3, oh: 0, h2o: 3, note: 'H⁺ 與 OH⁻ 恰好完全反應完畢！此時<strong>溫度最高</strong>，瓶內主要剩下 Na⁺、Cl⁻ 與大量 H₂O。' },
        over: { label: '④ 過量 NaOH（鹼性）', ph: '12.5（強鹼）', color: '#f472b6', colName: '酚酞：深桃紅', h: 0, cl: 3, na: 5, oh: 2, h2o: 3, note: '多滴入的 OH⁻ 沒人可配對，留在溶液中呈鹼性，酚酞轉為深桃紅色；注意 Cl⁻ 始終維持 3 顆不變！' }
      };

      function render() {
        var html =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'redox' ? 'active' : '') + '" data-mode="redox">⚔️ 金屬搶氧拔河（氧化還原）</button>' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'titr' ? 'active' : '') + '" data-mode="titr">🧪 酸鹼滴定離子舞池</button>' +
          '</div>';

        if (mode === 'redox') {
          var r = RXNS[rx];
          html +=
            '<div class="hb-vis-controls">' +
              Object.keys(RXNS).map(function (k) {
                return '<button type="button" class="hb-vis-btn ' + (rx === k ? 'active' : '') + '" data-rx="' + k + '">' + RXNS[k].title.split('（')[0] + '</button>';
              }).join('') +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="金屬搶氧拔河氧化還原圖">' +
              '<defs><marker id="s825-o" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/></marker></defs>' +
              '<text x="320" y="30" text-anchor="middle" font-size="14.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">' + r.title + '</text>' +
              // Left contender
              '<rect x="34" y="54" width="176" height="72" rx="12" fill="' + (r.can ? '#dcfce7' : '#f1f5f9') + '" stroke="' + (r.can ? '#059669' : '#94a3b8') + '" stroke-width="2.5"/>' +
              '<text x="122" y="84" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a" font-family="' + FONT + '">' + r.left + '</text>' +
              '<text x="122" y="108" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (r.can ? '#047857' : '#64748b') + '" font-family="' + FONT + '">' + (r.can ? '💪 搶氧勝利！' : '😵 搶輸氧原子') + '</text>' +
              // Right contender
              '<rect x="430" y="54" width="176" height="72" rx="12" fill="' + (r.can ? '#fee2e2' : '#dcfce7') + '" stroke="' + (r.can ? '#dc2626' : '#059669') + '" stroke-width="2.5"/>' +
              '<text x="518" y="84" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a" font-family="' + FONT + '">' + r.right + '</text>' +
              '<text x="518" y="108" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (r.can ? '#b91c1c' : '#047857') + '" font-family="' + FONT + '">' + (r.can ? '💨 交出氧原子' : '🛡️ 死守氧原子') + '</text>' +
              // Oxygen atom transfer arrow
              (r.can
                ? '<path d="M426,86 Q320,44 218,86" fill="none" stroke="#dc2626" stroke-width="3.5" marker-end="url(#s825-o)"/>' +
                  '<circle cx="320" cy="64" r="15" fill="#dc2626"/><text x="320" y="69" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff" font-family="' + FONT + '">O</text>' +
                  '<text x="320" y="106" text-anchor="middle" font-size="11.5" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">氧原子被搶向左邊！</text>'
                : '<line x1="218" y1="90" x2="422" y2="90" stroke="#94a3b8" stroke-width="3" stroke-dasharray="6 4"/>' +
                  '<text x="320" y="82" text-anchor="middle" font-size="13" font-weight="800" fill="#64748b" font-family="' + FONT + '">✖ 無法奪氧</text>') +
              // Role mapping boxes
              '<rect x="34" y="146" width="276" height="48" rx="10" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>' +
              '<text x="172" y="175" text-anchor="middle" font-size="12" font-weight="800" fill="#1d4ed8" font-family="' + FONT + '">' + r.oxBox + '</text>' +
              '<rect x="330" y="146" width="276" height="48" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>' +
              '<text x="468" y="175" text-anchor="middle" font-size="12" font-weight="800" fill="#92400e" font-family="' + FONT + '">' + r.redBox + '</text>' +
              // Activity bar
              '<rect x="34" y="212" width="572" height="40" rx="10" fill="#f8fafc" stroke="#cbd5e1"/>' +
              '<text x="320" y="229" text-anchor="middle" font-size="10.5" font-weight="700" fill="#64748b" font-family="' + FONT + '">常見活性順序（越左越會搶氧＝越強還原劑）</text>' +
              '<text x="320" y="245" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">K ＞ Na ＞ Ca ＞ Mg ＞ Al ＞ C ＞ Zn ＞ Fe ＞ Pb ＞ H ＞ Cu ＞ Hg ＞ Ag ＞ Au</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>⚔️ 搶氧結果：</strong>' + r.winNote + ' 切記：<strong>被氧化者＝幫別人還原＝還原劑</strong>；<strong>被還原者＝幫別人氧化＝氧化劑</strong>！' +
            '</div>';
        } else {
          var t = TITR[titr];
          var ions = [];
          for (var a = 0; a < t.h; a++) ions.push({ txt: 'H⁺', bg: '#fecaca', st: '#dc2626' });
          for (var b = 0; b < t.oh; b++) ions.push({ txt: 'OH⁻', bg: '#bfdbfe', st: '#2563eb' });
          for (var c = 0; c < t.cl; c++) ions.push({ txt: 'Cl⁻', bg: '#dcfce7', st: '#059669' });
          for (var d = 0; d < t.na; d++) ions.push({ txt: 'Na⁺', bg: '#fef3c7', st: '#d97706' });
          for (var e = 0; e < t.h2o; e++) ions.push({ txt: 'H₂O', bg: '#e0f2fe', st: '#0284c7' });

          var ionSvg = ions.map(function (it, idx) {
            var col = idx % 4;
            var row = Math.floor(idx / 4);
            var ix = 94 + col * 46;
            var iy = 128 + row * 34;
            return '<circle cx="' + ix + '" cy="' + iy + '" r="15" fill="' + it.bg + '" stroke="' + it.st + '" stroke-width="2"/>' +
              '<text x="' + ix + '" y="' + (iy + 4) + '" text-anchor="middle" font-size="9.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">' + it.txt + '</text>';
          }).join('');

          html +=
            '<div class="hb-vis-controls">' +
              Object.keys(TITR).map(function (k) {
                return '<button type="button" class="hb-vis-btn ' + (titr === k ? 'active' : '') + '" data-titr="' + k + '">' + TITR[k].label + '</button>';
              }).join('') +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="酸鹼滴定離子數量變化圖">' +
              // Flask
              '<path d="M126,34 L126,76 L56,226 Q50,242 68,242 L262,242 Q280,242 274,226 L204,76 L204,34 Z" fill="' + t.color + '" stroke="#334155" stroke-width="3"/>' +
              '<text x="165" y="24" text-anchor="middle" font-size="12" font-weight="800" fill="#0f172a" font-family="' + FONT + '">NaOH 滴入 3 分子 HCl</text>' +
              ionSvg +
              // Right status panel
              '<rect x="314" y="20" width="308" height="228" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>' +
              '<text x="468" y="46" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a" font-family="' + FONT + '">' + t.label + '</text>' +
              '<text x="334" y="78" font-size="12.5" font-weight="800" fill="#0284c7" font-family="' + FONT + '">• 溶液 pH 值：' + t.ph + '</text>' +
              '<text x="334" y="104" font-size="12.5" font-weight="800" fill="#be185d" font-family="' + FONT + '">• 指示劑顏色：' + t.colName + '</text>' +
              '<text x="334" y="136" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '">目前微粒數統計：</text>' +
              '<text x="334" y="160" font-size="12" font-weight="800" fill="#dc2626" font-family="' + FONT + '">H⁺ ＝ ' + t.h + ' 顆　｜　OH⁻ ＝ ' + t.oh + ' 顆</text>' +
              '<text x="334" y="184" font-size="12" font-weight="800" fill="#059669" font-family="' + FONT + '">Cl⁻ ＝ ' + t.cl + ' 顆（始終不變！）</text>' +
              '<text x="334" y="208" font-size="12" font-weight="800" fill="#d97706" font-family="' + FONT + '">Na⁺ ＝ ' + t.na + ' 顆　｜　新生成 H₂O ＝ ' + t.h2o + ' 顆</text>' +
              '<text x="334" y="234" font-size="11" font-weight="700" fill="#64748b" font-family="' + FONT + '">🔥 酸鹼中和為放熱反應（當量點溫度最高）</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>🧪 離子舞池解析：</strong>' + t.note +
            '</div>';
        }

        el.innerHTML = html;
        el.querySelectorAll('[data-mode]').forEach(function (b) {
          b.addEventListener('click', function () { mode = b.getAttribute('data-mode'); render(); });
        });
        el.querySelectorAll('[data-rx]').forEach(function (b) {
          b.addEventListener('click', function () { rx = b.getAttribute('data-rx'); render(); });
        });
        el.querySelectorAll('[data-titr]').forEach(function (b) {
          b.addEventListener('click', function () { titr = b.getAttribute('data-titr'); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     12. SCI_9_3_1 — 直線運動與牛頓定律
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_9_3_1'] = {
    title: '📐 x−t 圖、v−t 圖著色面積位移 ＆ 靜摩擦反制折線圖',
    subtitle: '秒辨 x−t 斜率＝速度、v−t 面積＝位移，並點擊推力觀察靜摩擦力如何「你推多少它擋多少」',
    mount: function (el) {
      var mode = 'vt';
      var push = 8;

      function render() {
        var html =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'xt' ? 'active' : '') + '" data-mode="xt">📈 x−t 圖（斜率＝速度）</button>' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'vt' ? 'active' : '') + '" data-mode="vt">📐 v−t 圖（斜率＝a、面積＝位移）</button>' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'fric' ? 'active' : '') + '" data-mode="fric">🧱 靜摩擦反制折線圖</button>' +
          '</div>';

        if (mode === 'xt') {
          html +=
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="x-t圖斜率等於速度示意圖">' +
              '<line x1="65" y1="224" x2="365" y2="224" stroke="#334155" stroke-width="2"/>' +
              '<line x1="65" y1="224" x2="65" y2="28" stroke="#334155" stroke-width="2"/>' +
              '<text x="215" y="254" text-anchor="middle" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '">時間 t（s）</text>' +
              '<text x="26" y="128" text-anchor="middle" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '" transform="rotate(-90 26 128)">位置 x（m）</text>' +
              // 3 segments: 0-4s rise to 20m, 4-7s flat, 7-10s fall to 5m
              '<polyline points="65,224 185,64 265,64 345,184" fill="none" stroke="#0284c7" stroke-width="3.5"/>' +
              // Slope triangle on 0-4s
              '<line x1="65" y1="224" x2="185" y2="224" stroke="#059669" stroke-width="2" stroke-dasharray="4 3"/>' +
              '<line x1="185" y1="224" x2="185" y2="64" stroke="#059669" stroke-width="2" stroke-dasharray="4 3"/>' +
              '<text x="125" y="216" text-anchor="middle" font-size="11" font-weight="800" fill="#059669" font-family="' + FONT + '">Δt = 4 s</text>' +
              '<text x="192" y="148" font-size="11" font-weight="800" fill="#059669" font-family="' + FONT + '">Δx = +20 m</text>' +
              '<text x="225" y="54" text-anchor="middle" font-size="11" font-weight="800" fill="#d97706" font-family="' + FONT + '">水平＝靜止 (v=0)</text>' +
              '<text x="336" y="114" text-anchor="middle" font-size="11" font-weight="800" fill="#dc2626" font-family="' + FONT + '">負斜率＝折返</text>' +
              '<circle cx="185" cy="64" r="5" fill="#0284c7"/><circle cx="265" cy="64" r="5" fill="#d97706"/><circle cx="345" cy="184" r="5" fill="#dc2626"/>' +
              // Summary card
              '<rect x="394" y="24" width="228" height="220" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>' +
              '<text x="508" y="52" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">📈 x−t 圖三大讀圖規則</text>' +
              '<text x="410" y="86" font-size="12" font-weight="800" fill="#059669" font-family="' + FONT + '">① 斜率 ＝ 速度 v ＝ Δx/Δt</text>' +
              '<text x="418" y="106" font-size="11" fill="#334155" font-family="' + FONT + '">0~4 秒：v = +20 ÷ 4 = +5 m/s</text>' +
              '<text x="410" y="138" font-size="12" font-weight="800" fill="#d97706" font-family="' + FONT + '">② 水平線 ＝ 靜止不動</text>' +
              '<text x="418" y="158" font-size="11" fill="#334155" font-family="' + FONT + '">4~7 秒：位置停在 x = 20 m</text>' +
              '<text x="410" y="190" font-size="12" font-weight="800" fill="#dc2626" font-family="' + FONT + '">③ 轉折點 ＝ 運動方向反轉</text>' +
              '<text x="418" y="210" font-size="11" fill="#334155" font-family="' + FONT + '">7~10 秒：斜率變負，往回走！</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>🎯 必記口訣：</strong>拿到運動學圖形<strong>第一步先看縱軸是 x 還是 v</strong>！在 x−t 圖中，水平線是靜止，斜線是等速，曲線才是加減速！' +
            '</div>';
        } else if (mode === 'vt') {
          html +=
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="v-t圖斜率加速度與梯形面積位移圖">' +
              // Trapezoid shaded area: t=0..2 (v=0..10), t=2..6 (v=10), t=6..8 (v=10..0)
              // x scale: 0..8s -> 70..350 (35px/s), y scale: 0..12 m/s -> 220..40 (15px per m/s)
              '<polygon points="70,220 140,70 280,70 350,220" fill="#bae6fd" opacity="0.65"/>' +
              '<line x1="65" y1="220" x2="375" y2="220" stroke="#334155" stroke-width="2"/>' +
              '<line x1="70" y1="224" x2="70" y2="28" stroke="#334155" stroke-width="2"/>' +
              '<text x="220" y="254" text-anchor="middle" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '">時間 t（s）</text>' +
              '<text x="26" y="128" text-anchor="middle" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '" transform="rotate(-90 26 128)">速度 v（m/s）</text>' +
              '<polyline points="70,220 140,70 280,70 350,220" fill="none" stroke="#0284c7" stroke-width="3.5"/>' +
              // Dashed guides
              '<line x1="140" y1="70" x2="140" y2="220" stroke="#0284c7" stroke-dasharray="4 3"/>' +
              '<line x1="280" y1="70" x2="280" y2="220" stroke="#0284c7" stroke-dasharray="4 3"/>' +
              '<text x="62" y="74" text-anchor="end" font-size="11" font-weight="800" fill="#0284c7" font-family="' + FONT + '">10</text>' +
              '<text x="70" y="236" text-anchor="middle" font-size="10.5" fill="#475569" font-family="' + FONT + '">0</text>' +
              '<text x="140" y="236" text-anchor="middle" font-size="10.5" fill="#475569" font-family="' + FONT + '">2</text>' +
              '<text x="280" y="236" text-anchor="middle" font-size="10.5" fill="#475569" font-family="' + FONT + '">6</text>' +
              '<text x="350" y="236" text-anchor="middle" font-size="10.5" fill="#475569" font-family="' + FONT + '">8</text>' +
              // Labels inside area
              '<text x="210" y="140" text-anchor="middle" font-size="14" font-weight="800" fill="#0369a1" font-family="' + FONT + '">著色面積 ＝ 位移 Δx</text>' +
              '<text x="210" y="162" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">梯形 ＝ (4 + 8) × 10 ÷ 2 ＝ 60 m</text>' +
              '<text x="210" y="60" text-anchor="middle" font-size="11" font-weight="800" fill="#059669" font-family="' + FONT + '">水平線 ＝ 等速度 (a = 0)</text>' +
              // Right card
              '<rect x="394" y="24" width="228" height="220" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>' +
              '<text x="508" y="52" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">📐 v−t 圖黃金雙寶</text>' +
              '<text x="410" y="86" font-size="12" font-weight="800" fill="#dc2626" font-family="' + FONT + '">① 斜率 ＝ 加速度 a ＝ Δv/Δt</text>' +
              '<text x="418" y="106" font-size="11" fill="#334155" font-family="' + FONT + '">0~2s 加速：a = +10÷2 = +5 m/s²</text>' +
              '<text x="418" y="124" font-size="11" fill="#334155" font-family="' + FONT + '">6~8s 煞車：a = −10÷2 = −5 m/s²</text>' +
              '<text x="410" y="158" font-size="12" font-weight="800" fill="#0284c7" font-family="' + FONT + '">② 面積 ＝ 位移 Δx</text>' +
              '<text x="418" y="178" font-size="11" fill="#334155" font-family="' + FONT + '">時間軸上方＝正向位移（+）</text>' +
              '<text x="418" y="196" font-size="11" fill="#334155" font-family="' + FONT + '">時間軸下方＝反向位移（−）</text>' +
              '<text x="418" y="220" font-size="11" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">⚠️ 折返點在「v = 0 穿越橫軸處」</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>🎯 會考最愛：</strong>畫出 v−t 圖直接算<strong>梯形／三角形面積</strong>，比死背一大堆運動公式快又零失誤！記住：v−t 圖的水平線代表<strong>等速度</strong>，不是靜止！' +
            '</div>';
        } else {
          // Friction curve: max static f_s(max) = 10 N at F = 10 N; kinetic f_k = 8 N for F > 10 N
          var isMoving = push > 10;
          var actualF = isMoving ? 8 : push;
          var netF = isMoving ? (push - 8) : 0;
          // Graph: F=0..16 -> x=70..342 (17px/N), f=0..12 -> y=220..52 (14px/N)
          var px = 70 + push * 17;
          var py = 220 - actualF * 14;

          html +=
            '<div class="hb-vis-controls">' +
              '<span style="font-size:0.82rem;color:#475569;font-weight:700;">選擇水平推力 F：</span>' +
              [0, 4, 8, 10, 14].map(function (v) {
                return '<button type="button" class="hb-vis-btn ' + (push === v ? 'active' : '') + '" data-push="' + v + '">' + v + ' N' + (v === 10 ? '（最大靜摩擦）' : v === 14 ? '（開始滑動）' : '') + '</button>';
              }).join('') +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="靜摩擦力與動摩擦力折線圖">' +
              '<line x1="70" y1="220" x2="365" y2="220" stroke="#334155" stroke-width="2"/>' +
              '<line x1="70" y1="220" x2="70" y2="34" stroke="#334155" stroke-width="2"/>' +
              '<text x="218" y="252" text-anchor="middle" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '">水平外力 F（N）</text>' +
              '<text x="26" y="128" text-anchor="middle" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '" transform="rotate(-90 26 128)">摩擦力 f（N）</text>' +
              // 45-degree static line (0,0) to (10,10)
              '<line x1="70" y1="220" x2="240" y2="80" stroke="#0284c7" stroke-width="3.5"/>' +
              // Drop at 10 -> 8
              '<line x1="240" y1="80" x2="240" y2="108" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3"/>' +
              // Horizontal kinetic line (10,8) to (16,8)
              '<line x1="240" y1="108" x2="342" y2="108" stroke="#dc2626" stroke-width="3.5"/>' +
              // Labels
              '<text x="148" y="138" text-anchor="middle" font-size="11" font-weight="800" fill="#0284c7" font-family="' + FONT + '" transform="rotate(-38 148 138)">靜摩擦 f靜 = F外</text>' +
              '<text x="240" y="68" text-anchor="middle" font-size="11" font-weight="800" fill="#0369a1" font-family="' + FONT + '">最大靜摩擦 10 N</text>' +
              '<text x="302" y="98" text-anchor="middle" font-size="11" font-weight="800" fill="#dc2626" font-family="' + FONT + '">動摩擦 8 N（定值）</text>' +
              '<text x="240" y="236" text-anchor="middle" font-size="10.5" fill="#475569" font-family="' + FONT + '">10</text>' +
              '<text x="308" y="236" text-anchor="middle" font-size="10.5" fill="#475569" font-family="' + FONT + '">14</text>' +
              // Current point
              '<circle cx="' + px + '" cy="' + py + '" r="7.5" fill="' + (isMoving ? '#dc2626' : '#059669') + '" stroke="#ffffff" stroke-width="2.5"/>' +
              // Status card
              '<rect x="392" y="26" width="230" height="218" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>' +
              '<text x="507" y="54" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a" font-family="' + FONT + '">目前推力 F ＝ ' + push + ' N</text>' +
              '<rect x="410" y="70" width="194" height="38" rx="8" fill="' + (isMoving ? '#fee2e2' : '#dcfce7') + '"/>' +
              '<text x="507" y="94" text-anchor="middle" font-size="13" font-weight="800" fill="' + (isMoving ? '#b91c1c' : '#166534') + '" font-family="' + FONT + '">' + (isMoving ? '🏃 開始加速滑動！' : '🧱 靜止不動（合力=0）') + '</text>' +
              '<text x="412" y="136" font-size="12.5" font-weight="800" fill="#0284c7" font-family="' + FONT + '">• 摩擦力 f ＝ ' + actualF + ' N</text>' +
              '<text x="412" y="164" font-size="12.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">• 水平合力 ＝ ' + netF + ' N</text>' +
              '<text x="412" y="198" font-size="11" fill="#475569" font-family="' + FONT + '">' + (isMoving ? '合力 F − f動 = 14 − 8 = 6 N' : '靜止時「推多少就反制多少」') + '</text>' +
              '<text x="412" y="220" font-size="11" font-weight="700" fill="#b91c1c" font-family="' + FONT + '">摩擦力與接觸面積大小無關！</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>🧱 摩擦力陷阱破解：</strong>物體還沒動之前（F ≦ 10 N），<strong>靜摩擦力永遠等於外力</strong>（不是永遠等於最大靜摩擦 10 N！）；一旦滑動後，動摩擦力固定為 8 N，不隨推力增加而改變！' +
            '</div>';
        }

        el.innerHTML = html;
        el.querySelectorAll('[data-mode]').forEach(function (b) {
          b.addEventListener('click', function () { mode = b.getAttribute('data-mode'); render(); });
        });
        el.querySelectorAll('[data-push]').forEach(function (b) {
          b.addEventListener('click', function () { push = Number(b.getAttribute('data-push')); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     13. SCI_9_3_2 — 功、能與簡單機械（滑輪組剪刀橫切數繩法）
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_9_3_2'] = {
    title: '✂️ 滑輪組「剪刀橫切數繩法」互動器',
    subtitle: '切換 1～4 繩滑輪組，用紅色虛線橫切動滑輪上方，直接數出承重繩數 n → F＝W/n、S拉＝n·h！',
    mount: function (el) {
      var n = 2;
      var W = 120;
      var H = 2;

      var CONFIGS = {
        1: { name: '定滑輪（1 繩）', note: '不省力也不費時（F = W），純粹用來「改變施力方向」（向下拉更順手）。' },
        2: { name: '動滑輪（2 繩）', note: '動滑輪兩側共 2 條繩向上拉起物體 → 省一半力（F = W/2），但拉繩距離加倍（S = 2h）！' },
        3: { name: '三繩滑輪組（3 繩）', note: '剪刀切過動滑輪上方共截斷 3 條承重繩 → 施力只需 W/3，拉繩距離為 3h！' },
        4: { name: '四繩滑輪組（4 繩）', note: '雙定＋雙動滑輪，4 條繩分擔重物 → 施力只需 W/4，拉繩距離為 4h！' }
      };

      function buildPulleySvg(count) {
        var ceiling = '<rect x="52" y="18" width="276" height="10" rx="3" fill="#475569"/>';
        var cutY = 128;
        var svg = ceiling;

        if (count === 1) {
          // Fixed pulley at (170, 74), load on left (x=144), pull down on right (x=196)
          svg +=
            '<line x1="170" y1="28" x2="170" y2="74" stroke="#475569" stroke-width="4"/>' +
            '<circle cx="170" cy="74" r="26" fill="#e2e8f0" stroke="#334155" stroke-width="3"/>' +
            '<circle cx="170" cy="74" r="5" fill="#334155"/>' +
            '<line x1="144" y1="74" x2="144" y2="188" stroke="#0284c7" stroke-width="3.5"/>' +
            '<line x1="196" y1="74" x2="196" y2="176" stroke="#dc2626" stroke-width="3.5" marker-end="url(#s932-f)"/>' +
            '<text x="206" y="168" font-size="12" font-weight="800" fill="#dc2626" font-family="' + FONT + '">F = 120 N</text>' +
            // Cut line across load rope only
            '<line x1="90" y1="' + cutY + '" x2="172" y2="' + cutY + '" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6 4"/>' +
            '<text x="84" y="' + (cutY + 4) + '" text-anchor="end" font-size="13" font-family="' + FONT + '">✂️</text>' +
            '<circle cx="144" cy="' + cutY + '" r="10" fill="#dc2626"/><text x="144" y="' + (cutY + 4) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="' + FONT + '">1</text>' +
            // Load
            '<rect x="114" y="188" width="60" height="46" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>' +
            '<text x="144" y="216" text-anchor="middle" font-size="12" font-weight="800" fill="#92400e" font-family="' + FONT + '">120 N</text>';
        } else if (count === 2) {
          // Movable pulley at (185, 162), left rope anchored to ceiling (x=159), right rope pulled UP (x=211)
          svg +=
            '<line x1="159" y1="28" x2="159" y2="162" stroke="#0284c7" stroke-width="3.5"/>' +
            '<line x1="211" y1="162" x2="211" y2="54" stroke="#dc2626" stroke-width="3.5" marker-end="url(#s932-f)"/>' +
            '<text x="220" y="64" font-size="12" font-weight="800" fill="#dc2626" font-family="' + FONT + '">F = 60 N ⬆</text>' +
            '<circle cx="185" cy="162" r="26" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>' +
            '<circle cx="185" cy="162" r="5" fill="#0284c7"/>' +
            '<line x1="185" y1="162" x2="185" y2="198" stroke="#334155" stroke-width="3"/>' +
            '<rect x="155" y="198" width="60" height="42" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>' +
            '<text x="185" y="224" text-anchor="middle" font-size="12" font-weight="800" fill="#92400e" font-family="' + FONT + '">120 N</text>' +
            // Cut line cutting 2 ropes
            '<line x1="112" y1="' + cutY + '" x2="255" y2="' + cutY + '" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6 4"/>' +
            '<text x="106" y="' + (cutY + 4) + '" text-anchor="end" font-size="13" font-family="' + FONT + '">✂️</text>' +
            '<circle cx="159" cy="' + cutY + '" r="10" fill="#dc2626"/><text x="159" y="' + (cutY + 4) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="' + FONT + '">1</text>' +
            '<circle cx="211" cy="' + cutY + '" r="10" fill="#dc2626"/><text x="211" y="' + (cutY + 4) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#fff" font-family="' + FONT + '">2</text>';
        } else if (count === 3) {
          // 1 fixed top (165, 68) + 1 movable bottom (165, 166): ropes at x=142, 165(hook), 188 pulled UP at right (x=214)
          svg +=
            '<line x1="165" y1="28" x2="165" y2="68" stroke="#475569" stroke-width="4"/>' +
            '<circle cx="165" cy="68" r="22" fill="#e2e8f0" stroke="#334155" stroke-width="2.5"/>' +
            '<circle cx="165" cy="166" r="24" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>' +
            // 3 load-bearing strands: 141, 165, 189 (pulled up on right)
            '<line x1="141" y1="68" x2="141" y2="166" stroke="#0284c7" stroke-width="3.2"/>' +
            '<line x1="165" y1="90" x2="165" y2="142" stroke="#0284c7" stroke-width="3.2"/>' +
            '<line x1="189" y1="166" x2="189" y2="54" stroke="#dc2626" stroke-width="3.2" marker-end="url(#s932-f)"/>' +
            '<text x="200" y="64" font-size="12" font-weight="800" fill="#dc2626" font-family="' + FONT + '">F = 40 N ⬆</text>' +
            '<line x1="165" y1="166" x2="165" y2="200" stroke="#334155" stroke-width="3"/>' +
            '<rect x="135" y="200" width="60" height="40" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>' +
            '<text x="165" y="225" text-anchor="middle" font-size="12" font-weight="800" fill="#92400e" font-family="' + FONT + '">120 N</text>' +
            // Cut line
            '<line x1="96" y1="' + cutY + '" x2="236" y2="' + cutY + '" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6 4"/>' +
            '<text x="90" y="' + (cutY + 4) + '" text-anchor="end" font-size="13" font-family="' + FONT + '">✂️</text>' +
            '<circle cx="141" cy="' + cutY + '" r="9.5" fill="#dc2626"/><text x="141" y="' + (cutY + 4) + '" text-anchor="middle" font-size="10.5" font-weight="800" fill="#fff" font-family="' + FONT + '">1</text>' +
            '<circle cx="165" cy="' + cutY + '" r="9.5" fill="#dc2626"/><text x="165" y="' + (cutY + 4) + '" text-anchor="middle" font-size="10.5" font-weight="800" fill="#fff" font-family="' + FONT + '">2</text>' +
            '<circle cx="189" cy="' + cutY + '" r="9.5" fill="#dc2626"/><text x="189" y="' + (cutY + 4) + '" text-anchor="middle" font-size="10.5" font-weight="800" fill="#fff" font-family="' + FONT + '">3</text>';
        } else {
          // 4 ropes: 2 fixed top + 2 movable bottom, free end pulled DOWN on far right (does not count!)
          svg +=
            '<line x1="168" y1="28" x2="168" y2="66" stroke="#475569" stroke-width="4"/>' +
            '<rect x="122" y="52" width="92" height="28" rx="14" fill="#e2e8f0" stroke="#334155" stroke-width="2.5"/>' +
            '<rect x="122" y="152" width="92" height="28" rx="14" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>' +
            // 4 strands supporting bottom block
            '<line x1="132" y1="80" x2="132" y2="152" stroke="#0284c7" stroke-width="3"/>' +
            '<line x1="156" y1="80" x2="156" y2="152" stroke="#0284c7" stroke-width="3"/>' +
            '<line x1="180" y1="80" x2="180" y2="152" stroke="#0284c7" stroke-width="3"/>' +
            '<line x1="204" y1="80" x2="204" y2="152" stroke="#0284c7" stroke-width="3"/>' +
            // Free end pulled down on far right (outside cut)
            '<path d="M214,66 L246,66 L246,162" fill="none" stroke="#dc2626" stroke-width="3.2" marker-end="url(#s932-f)"/>' +
            '<text x="254" y="156" font-size="12" font-weight="800" fill="#dc2626" font-family="' + FONT + '">F = 30 N ⬇</text>' +
            '<line x1="168" y1="180" x2="168" y2="202" stroke="#334155" stroke-width="3"/>' +
            '<rect x="138" y="202" width="60" height="38" rx="6" fill="#fef3c7" stroke="#d97706" stroke-width="2.5"/>' +
            '<text x="168" y="226" text-anchor="middle" font-size="12" font-weight="800" fill="#92400e" font-family="' + FONT + '">120 N</text>' +
            // Cut line cutting only the 4 load-bearing strands
            '<line x1="90" y1="' + cutY + '" x2="226" y2="' + cutY + '" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6 4"/>' +
            '<text x="84" y="' + (cutY + 4) + '" text-anchor="end" font-size="13" font-family="' + FONT + '">✂️</text>' +
            [132, 156, 180, 204].map(function (rx, idx) {
              return '<circle cx="' + rx + '" cy="' + cutY + '" r="9" fill="#dc2626"/><text x="' + rx + '" y="' + (cutY + 3.5) + '" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="' + FONT + '">' + (idx + 1) + '</text>';
            }).join('') +
            '<text x="275" y="180" text-anchor="middle" font-size="10" font-weight="700" fill="#64748b" font-family="' + FONT + '">（最右向下拉不計入）</text>';
        }
        return svg;
      }

      function render() {
        var cfg = CONFIGS[n];
        var force = W / n;
        var dist = n * H;
        var work = W * H;

        el.innerHTML =
          '<div class="hb-vis-controls">' +
            [1, 2, 3, 4].map(function (k) {
              return '<button type="button" class="hb-vis-btn ' + (n === k ? 'active' : '') + '" data-n="' + k + '">' + CONFIGS[k].name + '</button>';
            }).join('') +
          '</div>' +
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="滑輪組剪刀橫切數繩法圖">' +
            '<defs><marker id="s932-f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/></marker></defs>' +
            buildPulleySvg(n) +
            // Right calculation board
            '<rect x="358" y="18" width="264" height="234" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>' +
            '<text x="490" y="44" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a" font-family="' + FONT + '">✂️ 剪刀橫切結算（W=120 N, h=2 m）</text>' +
            '<rect x="376" y="58" width="228" height="36" rx="8" fill="#fef2f2" stroke="#fca5a5"/>' +
            '<text x="490" y="81" text-anchor="middle" font-size="13.5" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">有效承重繩數 n ＝ ' + n + ' 條</text>' +
            '<text x="380" y="122" font-size="12.5" font-weight="800" fill="#0284c7" font-family="' + FONT + '">① 省力公式：F ＝ W ÷ n</text>' +
            '<text x="392" y="142" font-size="13" font-weight="800" fill="#0f172a" font-family="' + FONT + '">F ＝ 120 ÷ ' + n + ' ＝ ' + force + ' N</text>' +
            '<text x="380" y="172" font-size="12.5" font-weight="800" fill="#059669" font-family="' + FONT + '">② 費時公式：S拉 ＝ n × h</text>' +
            '<text x="392" y="192" font-size="13" font-weight="800" fill="#0f172a" font-family="' + FONT + '">S拉 ＝ ' + n + ' × 2 ＝ ' + dist + ' m</text>' +
            '<rect x="376" y="206" width="228" height="34" rx="8" fill="#dcfce7" stroke="#86efac"/>' +
            '<text x="490" y="228" text-anchor="middle" font-size="12" font-weight="800" fill="#166534" font-family="' + FONT + '">作功不變：' + force + ' × ' + dist + ' ＝ ' + work + ' J（不省功！）</text>' +
          '</svg>' +
          '<div class="hb-vis-readout">' +
            '<strong>✂️ ' + cfg.name + '：</strong>' + cfg.note +
          '</div>';

        el.querySelectorAll('[data-n]').forEach(function (b) {
          b.addEventListener('click', function () { n = Number(b.getAttribute('data-n')); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     14. SCI_9_3_3 — 基本電路、歐姆定律與電磁
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_9_3_3'] = {
    title: '💡 串聯 vs 並聯燈泡亮度大對決 ＆ 安培右手／右手開掌',
    subtitle: '比較串聯（I 同看 P=I²R）與並聯（V 同看 P=V²/R）誰較亮，並掌握三大電磁右手定則',
    mount: function (el) {
      var mode = 'circuit';
      var cType = 'series';
      var magType = 'wire';

      function render() {
        var html =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'circuit' ? 'active' : '') + '" data-mode="circuit">💡 串聯 vs 並聯電路分配圖</button>' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'mag' ? 'active' : '') + '" data-mode="mag">🖐️ 安培右手／右手開掌磁力圖</button>' +
          '</div>';

        if (mode === 'circuit') {
          var isSer = (cType === 'series');
          var circuitSvg = '';
          if (isSer) {
            circuitSvg =
              // Wire loop
              '<rect x="52" y="54" width="276" height="162" rx="10" fill="none" stroke="#334155" stroke-width="3"/>' +
              // Battery on left
              '<rect x="36" y="114" width="32" height="42" fill="#ffffff"/>' +
              '<line x1="36" y1="126" x2="68" y2="126" stroke="#dc2626" stroke-width="4"/>' +
              '<line x1="44" y1="144" x2="60" y2="144" stroke="#334155" stroke-width="4"/>' +
              '<text x="24" y="139" text-anchor="end" font-size="11.5" font-weight="800" fill="#dc2626" font-family="' + FONT + '">12V</text>' +
              // Bulb 1 (2 ohm, dimmer: 8W)
              '<circle cx="148" cy="54" r="24" fill="#fef9c3" stroke="#ca8a04" stroke-width="2.5"/>' +
              '<text x="148" y="50" text-anchor="middle" font-size="11" font-weight="800" fill="#854d0e" font-family="' + FONT + '">甲 2Ω</text>' +
              '<text x="148" y="65" text-anchor="middle" font-size="10" font-weight="800" fill="#a16207" font-family="' + FONT + '">8 W</text>' +
              '<text x="148" y="96" text-anchor="middle" font-size="11" font-weight="700" fill="#0284c7" font-family="' + FONT + '">V₁ = 4V, I = 2A</text>' +
              // Bulb 2 (4 ohm, BRIGHTER: 16W!)
              '<circle cx="256" cy="54" r="32" fill="#fde047" opacity="0.45"/>' +
              '<circle cx="256" cy="54" r="24" fill="#facc15" stroke="#d97706" stroke-width="3"/>' +
              '<text x="256" y="50" text-anchor="middle" font-size="11" font-weight="800" fill="#78350f" font-family="' + FONT + '">乙 4Ω</text>' +
              '<text x="256" y="65" text-anchor="middle" font-size="10.5" font-weight="800" fill="#b45309" font-family="' + FONT + '">16W ★亮</text>' +
              '<text x="256" y="96" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c" font-family="' + FONT + '">V₂ = 8V, I = 2A</text>' +
              '<text x="190" y="204" text-anchor="middle" font-size="12" font-weight="800" fill="#0f172a" font-family="' + FONT + '">單一迴路：I處處相等 = 2 A｜R總 = 2+4 = 6 Ω</text>';
          } else {
            circuitSvg =
              // Outer loop + middle parallel branch
              '<rect x="52" y="48" width="276" height="168" rx="8" fill="none" stroke="#334155" stroke-width="3"/>' +
              '<line x1="130" y1="132" x2="328" y2="132" stroke="#334155" stroke-width="3"/>' +
              '<line x1="130" y1="48" x2="130" y2="216" stroke="#334155" stroke-width="3"/>' +
              // Battery on left
              '<rect x="36" y="110" width="32" height="44" fill="#ffffff"/>' +
              '<line x1="36" y1="124" x2="68" y2="124" stroke="#dc2626" stroke-width="4"/>' +
              '<line x1="44" y1="142" x2="60" y2="142" stroke="#334155" stroke-width="4"/>' +
              '<text x="24" y="138" text-anchor="end" font-size="11.5" font-weight="800" fill="#dc2626" font-family="' + FONT + '">12V</text>' +
              // Top branch Bulb 1 (2 ohm, SUPER BRIGHT: 72W!)
              '<circle cx="232" cy="48" r="32" fill="#fde047" opacity="0.55"/>' +
              '<circle cx="232" cy="48" r="23" fill="#facc15" stroke="#d97706" stroke-width="3"/>' +
              '<text x="232" y="44" text-anchor="middle" font-size="11" font-weight="800" fill="#78350f" font-family="' + FONT + '">甲 2Ω</text>' +
              '<text x="232" y="59" text-anchor="middle" font-size="10" font-weight="800" fill="#b45309" font-family="' + FONT + '">72W ★亮</text>' +
              '<text x="232" y="92" text-anchor="middle" font-size="11" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">V=12V, I₁=6A</text>' +
              // Middle branch Bulb 2 (4 ohm, dimmer: 36W)
              '<circle cx="232" cy="132" r="22" fill="#fef9c3" stroke="#ca8a04" stroke-width="2.5"/>' +
              '<text x="232" y="128" text-anchor="middle" font-size="11" font-weight="800" fill="#854d0e" font-family="' + FONT + '">乙 4Ω</text>' +
              '<text x="232" y="143" text-anchor="middle" font-size="10" font-weight="800" fill="#a16207" font-family="' + FONT + '">36 W</text>' +
              '<text x="232" y="172" text-anchor="middle" font-size="11" font-weight="700" fill="#0284c7" font-family="' + FONT + '">V=12V, I₂=3A</text>' +
              '<text x="190" y="204" text-anchor="middle" font-size="12" font-weight="800" fill="#0f172a" font-family="' + FONT + '">分流總電流：I總 = 6 + 3 = 9 A（家用電器接法）</text>';
          }

          html +=
            '<div class="hb-vis-controls">' +
              '<button type="button" class="hb-vis-btn ' + (isSer ? 'active' : '') + '" data-ct="series">串聯（I 同分壓 → R 大較亮）</button>' +
              '<button type="button" class="hb-vis-btn ' + (!isSer ? 'active' : '') + '" data-ct="parallel">並聯（V 同分流 → R 小較亮）</button>' +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="串聯與並聯燈泡功率比較電路圖">' +
              circuitSvg +
              // Right comparison panel
              '<rect x="358" y="20" width="264" height="230" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>' +
              '<text x="490" y="48" text-anchor="middle" font-size="14" font-weight="800" fill="#0f172a" font-family="' + FONT + '">' + (isSer ? '串聯電路核心規則' : '並聯電路核心規則') + '</text>' +
              '<rect x="376" y="64" width="228" height="42" rx="8" fill="#eff6ff" stroke="#93c5fd"/>' +
              '<text x="490" y="90" text-anchor="middle" font-size="13.5" font-weight="800" fill="#1d4ed8" font-family="' + FONT + '">' + (isSer ? 'I 相同 → 選用 P ＝ I²R' : 'V 相同 → 選用 P ＝ V²/R') + '</text>' +
              '<text x="380" y="132" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '">• 分配規律：' + (isSer ? '電壓按電阻正比分壓' : '電流按電阻反比分流') + '</text>' +
              '<text x="380" y="158" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '">• 燈泡甲(2Ω)：' + (isSer ? 'P₁ = 2²×2 = 8 W' : 'P₁ = 12²÷2 = 72 W') + '</text>' +
              '<text x="380" y="184" font-size="12" font-weight="700" fill="#334155" font-family="' + FONT + '">• 燈泡乙(4Ω)：' + (isSer ? 'P₂ = 2²×4 = 16 W' : 'P₂ = 12²÷4 = 36 W') + '</text>' +
              '<rect x="376" y="200" width="228" height="36" rx="8" fill="#fef3c7" stroke="#f59e0b"/>' +
              '<text x="490" y="223" text-anchor="middle" font-size="12.5" font-weight="800" fill="#92400e" font-family="' + FONT + '">' + (isSer ? '🏆 串聯結論：電阻大（乙）較亮！' : '🏆 並聯結論：電阻小（甲）較亮！') + '</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>⚡ 秒殺重點：</strong>比燈泡亮度就是比<strong>電功率 P</strong>！同樣是甲(2Ω)與乙(4Ω)，<strong>串聯時乙較亮（P ∝ R）</strong>，<strong>並聯時卻變成甲較亮（P ∝ 1/R）</strong>！' +
            '</div>';
        } else {
          var magSvg = '';
          var magNote = '';
          if (magType === 'wire') {
            magSvg =
              '<line x1="175" y1="226" x2="175" y2="38" stroke="#dc2626" stroke-width="6" marker-end="url(#s933-r)"/>' +
              '<ellipse cx="175" cy="140" rx="92" ry="34" fill="none" stroke="#0284c7" stroke-width="3.5" stroke-dasharray="10 4"/>' +
              '<path d="M250,156 L267,140 L248,128" fill="none" stroke="#0284c7" stroke-width="3.5"/>' +
              '<text x="192" y="54" font-size="13" font-weight="800" fill="#dc2626" font-family="' + FONT + '">👍 拇指：電流 I（向上）</text>' +
              '<text x="175" y="198" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0284c7" font-family="' + FONT + '">✊ 四指環繞：磁場 B（俯視逆時針）</text>';
            magNote = '<strong>安培右手定則（長直載流導線）：</strong>右手大拇指指向<strong>電流 I 方向</strong>，其餘四指自然彎曲的方向即為周圍<strong>同心圓磁場 B 方向</strong>（磁場強度與距離成反比）。';
          } else if (magType === 'coil') {
            magSvg =
              '<rect x="85" y="96" width="180" height="72" rx="14" fill="#f1f5f9" stroke="#64748b" stroke-width="2.5"/>' +
              '<path d="M110,96 C110,74 132,74 132,96 L132,168 C132,190 154,190 154,168 L154,96 C154,74 176,74 176,96 L176,168 C176,190 198,190 198,168 L198,96 C198,74 220,74 220,96 L220,168" fill="none" stroke="#dc2626" stroke-width="3.5"/>' +
              '<line x1="265" y1="132" x2="328" y2="132" stroke="#0284c7" stroke-width="4.5" marker-end="url(#s933-b)"/>' +
              '<text x="304" y="114" text-anchor="middle" font-size="15" font-weight="800" fill="#0284c7" font-family="' + FONT + '">N 極</text>' +
              '<text x="58" y="138" text-anchor="middle" font-size="15" font-weight="800" fill="#64748b" font-family="' + FONT + '">S 極</text>' +
              '<text x="175" y="220" text-anchor="middle" font-size="12" font-weight="800" fill="#0f172a" font-family="' + FONT + '">✊ 四指順電流 I 握住線圈 → 👍 拇指指 N 極！</text>';
            magNote = '<strong>安培右手定則（螺線管電磁鐵）：</strong>這時反過來！用右手<strong>四指順著線圈電流 I 方向握住</strong>，大拇指所指的那一端就是<strong>磁場 N 極</strong>（插入軟鐵棒磁力大增）！';
          } else {
            magSvg =
              '<line x1="175" y1="176" x2="175" y2="56" stroke="#dc2626" stroke-width="4.5" marker-end="url(#s933-r)"/>' +
              '<line x1="175" y1="176" x2="295" y2="176" stroke="#0284c7" stroke-width="4.5" marker-end="url(#s933-b)"/>' +
              '<line x1="175" y1="176" x2="98" y2="226" stroke="#059669" stroke-width="5" marker-end="url(#s933-g)"/>' +
              '<text x="188" y="68" font-size="13" font-weight="800" fill="#dc2626" font-family="' + FONT + '">👍 拇指：電流 I（向上）</text>' +
              '<text x="242" y="164" font-size="13" font-weight="800" fill="#0284c7" font-family="' + FONT + '">🖐 四指：磁場 B（向右）</text>' +
              '<text x="115" y="242" font-size="13" font-weight="800" fill="#059669" font-family="' + FONT + '">✋ 掌心推出：磁力 F（出紙面！）</text>';
            magNote = '<strong>右手開掌定則（判斷載流導線或正電荷受力方向）：</strong>攤開右手，<strong>拇指＝電流 I</strong>、<strong>四指＝磁場 B（N→S）</strong>、<strong>掌心推出方向＝磁力 F</strong>！若為電子流（負電荷），拇指指向相反方向！';
          }

          html +=
            '<div class="hb-vis-controls">' +
              '<button type="button" class="hb-vis-btn ' + (magType === 'wire' ? 'active' : '') + '" data-mag="wire">長直導線（安培右手）</button>' +
              '<button type="button" class="hb-vis-btn ' + (magType === 'coil' ? 'active' : '') + '" data-mag="coil">螺線管（安培右手）</button>' +
              '<button type="button" class="hb-vis-btn ' + (magType === 'palm' ? 'active' : '') + '" data-mag="palm">磁力方向（右手開掌）</button>' +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="電磁右手定則圖">' +
              '<defs>' +
                '<marker id="s933-r" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/></marker>' +
                '<marker id="s933-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#0284c7"/></marker>' +
                '<marker id="s933-g" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#059669"/></marker>' +
              '</defs>' +
              magSvg +
              '<rect x="358" y="24" width="262" height="222" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>' +
              '<text x="489" y="54" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">🖐️ 三大右手定則速查表</text>' +
              '<text x="376" y="88" font-size="12" font-weight="800" fill="#dc2626" font-family="' + FONT + '">1. 長直導線求磁場：</text>' +
              '<text x="386" y="108" font-size="11.5" fill="#334155" font-family="' + FONT + '">拇指＝I，四指彎曲＝B</text>' +
              '<text x="376" y="140" font-size="12" font-weight="800" fill="#0284c7" font-family="' + FONT + '">2. 螺線管求 N 極：</text>' +
              '<text x="386" y="160" font-size="11.5" fill="#334155" font-family="' + FONT + '">四指握＝I，拇指＝N 極</text>' +
              '<text x="376" y="192" font-size="12" font-weight="800" fill="#059669" font-family="' + FONT + '">3. 導線受磁力（開掌）：</text>' +
              '<text x="386" y="212" font-size="11.5" fill="#334155" font-family="' + FONT + '">拇指＝I、四指＝B、掌心＝F</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' + magNote + '</div>';
        }

        el.innerHTML = html;
        el.querySelectorAll('[data-mode]').forEach(function (b) {
          b.addEventListener('click', function () { mode = b.getAttribute('data-mode'); render(); });
        });
        el.querySelectorAll('[data-ct]').forEach(function (b) {
          b.addEventListener('click', function () { cType = b.getAttribute('data-ct'); render(); });
        });
        el.querySelectorAll('[data-mag]').forEach(function (b) {
          b.addEventListener('click', function () { magType = b.getAttribute('data-mag'); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     15. SCI_9_3_4 — 地球構造、板塊與天氣圖
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_9_3_4'] = {
    title: '🪨 地層截切定律 5 步演化 ＆ 北半球高低壓風向圖',
    subtitle: '逐步演練地質事件先後排序（沉積→褶皺→侵蝕→斷層→岩脈），並秒記高壓順時針外旋、低壓逆時針內旋',
    mount: function (el) {
      var mode = 'strata';
      var step = 5;

      var STEPS = [
        { n: 1, title: '步驟 1：水平沉積（A → B → C）', desc: '依據「疊置定律」，最底層的頁岩 A 最老，往上依序沉積砂岩 B、石灰岩 C。' },
        { n: 2, title: '步驟 2：板塊擠壓發生褶皺', desc: '水平岩層受到強大水平擠壓力，彎曲成波浪狀的褶皺構造。' },
        { n: 3, title: '步驟 3：抬升侵蝕（不整合面）＋ 沉積新層 D', desc: '岩層抬升出水面遭受侵蝕削平（波浪狀侵蝕面），之後再下沉沉積新的水平岩層 D。' },
        { n: 4, title: '步驟 4：斷層錯動切穿 A～D', desc: '地震引發斷層線切過 A、B、C、D 與侵蝕面，使右側岩層相對錯動！故斷層比 A～D 都年輕。' },
        { n: 5, title: '步驟 5：岩漿岩脈侵入（最年輕！）', desc: '火成岩脈垂直貫穿所有岩層，甚至連「斷層線」都被岩脈截斷！依據「截切定律」，<strong>岩脈最年輕</strong>！' }
      ];

      function buildStrataSvg(s) {
        var g = '';
        if (s === 1) {
          g +=
            '<rect x="46" y="168" width="320" height="58" fill="#cbd5e1" stroke="#475569"/>' +
            '<rect x="46" y="116" width="320" height="52" fill="#fde68a" stroke="#b45309"/>' +
            '<rect x="46" y="68" width="320" height="48" fill="#bbf7d0" stroke="#15803d"/>' +
            '<text x="206" y="202" text-anchor="middle" font-size="13" font-weight="800" fill="#1e293b" font-family="' + FONT + '">岩層 A（最老）</text>' +
            '<text x="206" y="147" text-anchor="middle" font-size="13" font-weight="800" fill="#78350f" font-family="' + FONT + '">岩層 B</text>' +
            '<text x="206" y="97" text-anchor="middle" font-size="13" font-weight="800" fill="#166534" font-family="' + FONT + '">岩層 C</text>';
        } else if (s === 2) {
          g +=
            '<path d="M46,184 Q126,144 206,184 T366,184 L366,232 L46,232 Z" fill="#cbd5e1" stroke="#475569"/>' +
            '<path d="M46,134 Q126,94 206,134 T366,134 L366,184 Q286,224 206,184 T46,184 Z" fill="#fde68a" stroke="#b45309"/>' +
            '<path d="M46,84 Q126,44 206,84 T366,84 L366,134 Q286,174 206,134 T46,134 Z" fill="#bbf7d0" stroke="#15803d"/>' +
            '<text x="126" y="212" text-anchor="middle" font-size="12" font-weight="800" fill="#1e293b" font-family="' + FONT + '">A 褶皺</text>' +
            '<text x="126" y="150" text-anchor="middle" font-size="12" font-weight="800" fill="#78350f" font-family="' + FONT + '">B 褶皺</text>' +
            '<text x="126" y="98" text-anchor="middle" font-size="12" font-weight="800" fill="#166534" font-family="' + FONT + '">C 褶皺</text>';
        } else {
          // Steps 3, 4, 5: eroded top + horizontal D + optional fault + optional dike
          var shift = (s >= 4) ? 18 : 0;
          // Left block (x=46..212)
          g +=
            '<clipPath id="s934-left"><rect x="46" y="42" width="166" height="194"/></clipPath>' +
            '<clipPath id="s934-right"><rect x="212" y="42" width="154" height="194"/></clipPath>' +
            '<g clip-path="url(#s934-left)">' +
              '<path d="M46,184 Q126,144 206,184 T366,184 L366,240 L46,240 Z" fill="#cbd5e1" stroke="#475569"/>' +
              '<path d="M46,134 Q126,94 206,134 T366,134 L366,184 Q286,224 206,184 T46,184 Z" fill="#fde68a" stroke="#b45309"/>' +
              '<path d="M46,96 L366,96 L366,134 Q286,174 206,134 T46,134 Z" fill="#bbf7d0" stroke="#15803d"/>' +
              '<rect x="46" y="56" width="320" height="40" fill="#bae6fd" stroke="#0284c7"/>' +
              '<path d="M46,96 Q62,90 78,96 T110,96 T142,96 T174,96 T206,96" fill="none" stroke="#92400e" stroke-width="2.5"/>' +
            '</g>' +
            '<g clip-path="url(#s934-right)" transform="translate(0,' + shift + ')">' +
              '<path d="M46,184 Q126,144 206,184 T366,184 L366,240 L46,240 Z" fill="#cbd5e1" stroke="#475569"/>' +
              '<path d="M46,134 Q126,94 206,134 T366,134 L366,184 Q286,224 206,184 T46,184 Z" fill="#fde68a" stroke="#b45309"/>' +
              '<path d="M46,96 L366,96 L366,134 Q286,174 206,134 T46,134 Z" fill="#bbf7d0" stroke="#15803d"/>' +
              '<rect x="46" y="56" width="320" height="40" fill="#bae6fd" stroke="#0284c7"/>' +
              '<path d="M206,96 Q222,90 238,96 T270,96 T302,96 T334,96 T366,96" fill="none" stroke="#92400e" stroke-width="2.5"/>' +
            '</g>' +
            '<text x="96" y="80" font-size="11.5" font-weight="800" fill="#0369a1" font-family="' + FONT + '">新沉積 D</text>' +
            '<text x="96" y="150" font-size="11.5" font-weight="800" fill="#78350f" font-family="' + FONT + '">褶皺 B</text>' +
            '<text x="96" y="212" font-size="11.5" font-weight="800" fill="#1e293b" font-family="' + FONT + '">最老 A</text>';
          if (s >= 4) {
            g += '<line x1="212" y1="42" x2="212" y2="236" stroke="#0f172a" stroke-width="3.5" stroke-dasharray="7 4"/>' +
              '<text x="212" y="36" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">⚡ 斷層線（切穿 A~D）</text>';
          }
          if (s >= 5) {
            g += '<polygon points="154,236 178,236 276,46 254,46" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>' +
              '<text x="266" y="40" text-anchor="middle" font-size="11.5" font-weight="800" fill="#dc2626" font-family="' + FONT + '">🌋 岩脈（截斷斷層＝最年輕！）</text>';
          }
        }
        return g;
      }

      function render() {
        var html =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'strata' ? 'active' : '') + '" data-mode="strata">🪨 地層截切定律排序圖</button>' +
            '<button type="button" class="hb-vis-btn ' + (mode === 'weather' ? 'active' : '') + '" data-mode="weather">🌀 北半球高低氣壓風向圖</button>' +
          '</div>';

        if (mode === 'strata') {
          var st = STEPS[step - 1];
          html +=
            '<div class="hb-vis-controls">' +
              STEPS.map(function (it) {
                return '<button type="button" class="hb-vis-btn ' + (step === it.n ? 'active' : '') + '" data-st="' + it.n + '">' + it.n + '. ' + it.title.split('：')[1].split('（')[0] + '</button>';
              }).join('') +
            '</div>' +
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="地層截切定律演化圖">' +
              buildStrataSvg(step) +
              '<rect x="390" y="22" width="234" height="226" rx="12" fill="#f8fafc" stroke="#cbd5e1"/>' +
              '<text x="507" y="48" text-anchor="middle" font-size="13.5" font-weight="800" fill="#0f172a" font-family="' + FONT + '">📜 地質事件先後順序（老→新）</text>' +
              STEPS.map(function (it, idx) {
                var done = it.n <= step;
                var cur = it.n === step;
                return '<rect x="404" y="' + (62 + idx * 34) + '" width="206" height="28" rx="6" fill="' + (cur ? '#dbeafe' : done ? '#f1f5f9' : '#ffffff') + '" stroke="' + (cur ? '#0284c7' : '#e2e8f0') + '"/>' +
                  '<text x="414" y="' + (80 + idx * 34) + '" font-size="11.5" font-weight="' + (cur ? '800' : '600') + '" fill="' + (cur ? '#0369a1' : done ? '#334155' : '#94a3b8') + '" font-family="' + FONT + '">' + it.n + '. ' + it.title.split('：')[1] + '</text>';
              }).join('') +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>🪨 ' + st.title + '：</strong>' + st.desc +
            '</div>';
        } else {
          html +=
            '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="北半球高氣壓與低氣壓風向示意圖">' +
              '<defs>' +
                '<marker id="s934-h" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#0284c7"/></marker>' +
                '<marker id="s934-l" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/></marker>' +
              '</defs>' +
              // Left: High Pressure (Clockwise Outward)
              '<rect x="16" y="14" width="294" height="242" rx="14" fill="#eff6ff" stroke="#93c5fd"/>' +
              '<text x="163" y="38" text-anchor="middle" font-size="14" font-weight="800" fill="#1d4ed8" font-family="' + FONT + '">☀️ 北半球高氣壓 H（晴朗乾燥）</text>' +
              '<circle cx="163" cy="134" r="72" fill="none" stroke="#93c5fd" stroke-width="1.5" stroke-dasharray="5 3"/>' +
              '<circle cx="163" cy="134" r="44" fill="none" stroke="#60a5fa" stroke-width="2"/>' +
              '<text x="163" y="143" text-anchor="middle" font-size="26" font-weight="900" fill="#1d4ed8" font-family="' + FONT + '">H</text>' +
              // 4 clockwise outward curved wind arrows
              '<path d="M163,90 Q196,86 218,108" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#s934-h)"/>' +
              '<path d="M207,134 Q211,168 189,190" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#s934-h)"/>' +
              '<path d="M163,178 Q130,182 108,160" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#s934-h)"/>' +
              '<path d="M119,134 Q115,100 137,78" fill="none" stroke="#0284c7" stroke-width="3" marker-end="url(#s934-h)"/>' +
              '<text x="163" y="226" text-anchor="middle" font-size="12" font-weight="800" fill="#0369a1" font-family="' + FONT + '">順時針「向外」旋出（輻散）</text>' +
              '<text x="163" y="244" text-anchor="middle" font-size="11" font-weight="700" fill="#334155" font-family="' + FONT + '">中心氣流下沉增溫 → 水氣蒸發 → 晴朗</text>' +

              // Right: Low Pressure (Counterclockwise Inward)
              '<rect x="330" y="14" width="294" height="242" rx="14" fill="#fef2f2" stroke="#fca5a5"/>' +
              '<text x="477" y="38" text-anchor="middle" font-size="14" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">🌧️ 北半球低氣壓 L（陰雨／颱風）</text>' +
              '<circle cx="477" cy="134" r="72" fill="none" stroke="#fca5a5" stroke-width="1.5" stroke-dasharray="5 3"/>' +
              '<circle cx="477" cy="134" r="44" fill="none" stroke="#f87171" stroke-width="2"/>' +
              '<text x="477" y="143" text-anchor="middle" font-size="26" font-weight="900" fill="#dc2626" font-family="' + FONT + '">L</text>' +
              // 4 counterclockwise inward curved wind arrows
              '<path d="M532,102 Q518,86 488,92" fill="none" stroke="#dc2626" stroke-width="3" marker-end="url(#s934-l)"/>' +
              '<path d="M510,190 Q528,172 520,144" fill="none" stroke="#dc2626" stroke-width="3" marker-end="url(#s934-l)"/>' +
              '<path d="M422,166 Q436,182 466,176" fill="none" stroke="#dc2626" stroke-width="3" marker-end="url(#s934-l)"/>' +
              '<path d="M444,78 Q426,96 434,124" fill="none" stroke="#dc2626" stroke-width="3" marker-end="url(#s934-l)"/>' +
              '<text x="477" y="226" text-anchor="middle" font-size="12" font-weight="800" fill="#b91c1c" font-family="' + FONT + '">逆時針「向內」旋入（輻合）</text>' +
              '<text x="477" y="244" text-anchor="middle" font-size="11" font-weight="700" fill="#334155" font-family="' + FONT + '">中心氣流上升冷卻 → 水氣凝結 → 成雲致雨</text>' +
            '</svg>' +
            '<div class="hb-vis-readout">' +
              '<strong>🌀 考場萬用口訣：「北半球高順出晴、低逆入雨」</strong><br>' +
              '風向是由「風吹來的方向」命名！等壓線越密集，氣壓梯度力越大、<strong>風速越強</strong>。' +
            '</div>';
        }

        el.innerHTML = html;
        el.querySelectorAll('[data-mode]').forEach(function (b) {
          b.addEventListener('click', function () { mode = b.getAttribute('data-mode'); render(); });
        });
        el.querySelectorAll('[data-st]').forEach(function (b) {
          b.addEventListener('click', function () { step = Number(b.getAttribute('data-st')); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     16. SCI_9_3_5 — 天文：日地月與潮汐
     ======================================================================== */
  global.JuniorHandbookVisuals['SCI_9_3_5'] = {
    title: '🌕 日地月軌道、八大月相、潮汐與日／月食對齊器',
    subtitle: '點擊四大關鍵農曆日期，同步觀察北極俯視軌道位置、地球潮汐隆起（大潮／小潮）與地球所見月相！',
    mount: function (el) {
      var phase = 'new';

      // Sunlight comes from LEFT (x=40) shining RIGHTWARD!
      // Earth at (240, 136), Orbit radius = 84
      // Counterclockwise from North Pole:
      // 初一朔(new): LEFT of Earth (156, 136) -> Sun-Moon-Earth aligned -> 大潮 + 日食條件
      // 初七上弦(first): BOTTOM of Earth (240, 220) -> 90 deg -> 小潮, right half lit (亮面朝西)
      // 十五望(full): RIGHT of Earth (324, 136) -> Sun-Earth-Moon aligned -> 大潮 + 月食條件
      // 廿二下弦(last): TOP of Earth (240, 52) -> 90 deg -> 小潮, left half lit (亮面朝東)
      var PHASES = {
        new: {
          label: '🌑 初一 朔（新月）',
          mx: 156, my: 136,
          tide: '大潮（潮差最大！）',
          tideRx: 44, tideRy: 26,
          eclipse: '☀️ 日食發生條件（月在日地之間）',
          litSide: 'none',
          desc: '月球位在太陽與地球之間，暗面正對地球（看不到月亮）。日地月成一直線，引力疊加引發<strong>大潮</strong>；若三者恰在同一平面，月球影子遮住地球即發生<strong>日食</strong>！'
        },
        first: {
          label: '🌓 初七／初八 上弦月',
          mx: 240, my: 220,
          tide: '小潮（潮差最小）',
          tideRx: 32, tideRy: 35,
          eclipse: '無日食／月食',
          litSide: 'right',
          desc: '日、地、月呈 90° 直角，太陽與月球引潮力互相抵消，形成<strong>小潮</strong>。在北半球看上弦月，<strong>右半邊亮（亮面朝西）</strong>，傍晚出現在中天、午夜西沉。'
        },
        full: {
          label: '🌕 十五／十六 望（滿月）',
          mx: 324, my: 136,
          tide: '大潮（潮差最大！）',
          tideRx: 44, tideRy: 26,
          eclipse: '🌑 月食發生條件（地在日月之間）',
          litSide: 'full',
          desc: '地球位在太陽與月球之間，月球整個亮面正對地球（滿月）。日地月成一直線引發<strong>大潮</strong>；若月球進入地球本影區即發生<strong>月食</strong>！'
        },
        last: {
          label: '🌗 廿二／廿三 下弦月',
          mx: 240, my: 52,
          tide: '小潮（潮差最小）',
          tideRx: 32, tideRy: 35,
          eclipse: '無日食／月食',
          litSide: 'left',
          desc: '日、地、月再次呈 90° 直角，形成<strong>小潮</strong>。在北半球看下弦月，<strong>左半邊亮（亮面朝東）</strong>，半夜才從東方升起、清晨高掛中天。'
        }
      };

      function drawEarthViewMoon(litSide) {
        var cx = 528, cy = 104, r = 42;
        if (litSide === 'none') {
          return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#1e293b" stroke="#64748b" stroke-width="2.5"/>' +
            '<text x="' + cx + '" y="' + (cy + 5) + '" text-anchor="middle" font-size="11.5" font-weight="800" fill="#94a3b8" font-family="' + FONT + '">全暗（新月）</text>';
        }
        if (litSide === 'full') {
          return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#fef08a" stroke="#eab308" stroke-width="3"/>' +
            '<text x="' + cx + '" y="' + (cy + 5) + '" text-anchor="middle" font-size="12" font-weight="800" fill="#854d0e" font-family="' + FONT + '">全亮（滿月）</text>';
        }
        if (litSide === 'right') {
          return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
            '<path d="M' + cx + ',' + (cy - r) + ' A' + r + ',' + r + ' 0 0,1 ' + cx + ',' + (cy + r) + ' Z" fill="#fef08a"/>' +
            '<text x="' + cx + '" y="' + (cy + 58) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#b45309" font-family="' + FONT + '">右半亮（亮面朝西）</text>';
        }
        return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#1e293b" stroke="#475569" stroke-width="2"/>' +
          '<path d="M' + cx + ',' + (cy - r) + ' A' + r + ',' + r + ' 0 0,0 ' + cx + ',' + (cy + r) + ' Z" fill="#fef08a"/>' +
          '<text x="' + cx + '" y="' + (cy + 58) + '" text-anchor="middle" font-size="11" font-weight="800" fill="#b45309" font-family="' + FONT + '">左半亮（亮面朝東）</text>';
      }

      function render() {
        var p = PHASES[phase];
        el.innerHTML =
          '<div class="hb-vis-controls">' +
            ['new', 'first', 'full', 'last'].map(function (k) {
              return '<button type="button" class="hb-vis-btn ' + (phase === k ? 'active' : '') + '" data-ph="' + k + '">' + PHASES[k].label + '</button>';
            }).join('') +
          '</div>' +
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="日地月軌道月相與潮汐圖">' +
            '<defs><marker id="s935-sun" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#f59e0b"/></marker></defs>' +
            // Space background left
            '<rect x="14" y="14" width="404" height="242" rx="14" fill="#0f172a"/>' +
            '<text x="216" y="34" text-anchor="middle" font-size="11.5" font-weight="700" fill="#94a3b8" font-family="' + FONT + '">北極上空俯視（月球逆時針公轉 ↺）</text>' +
            // Sun on left
            '<circle cx="46" cy="136" r="24" fill="#facc15" stroke="#f59e0b" stroke-width="3"/>' +
            '<text x="46" y="141" text-anchor="middle" font-size="12" font-weight="900" fill="#78350f" font-family="' + FONT + '">太陽</text>' +
            '<line x1="74" y1="86" x2="112" y2="86" stroke="#f59e0b" stroke-width="2" marker-end="url(#s935-sun)"/>' +
            '<line x1="74" y1="136" x2="112" y2="136" stroke="#f59e0b" stroke-width="2" marker-end="url(#s935-sun)"/>' +
            '<line x1="74" y1="186" x2="112" y2="186" stroke="#f59e0b" stroke-width="2" marker-end="url(#s935-sun)"/>' +
            // Moon orbit
            '<circle cx="240" cy="136" r="84" fill="none" stroke="#475569" stroke-width="1.8" stroke-dasharray="5 4"/>' +
            // Tidal bulge around Earth
            '<ellipse cx="240" cy="136" rx="' + p.tideRx + '" ry="' + p.tideRy + '" fill="#38bdf8" opacity="0.35" stroke="#38bdf8" stroke-width="1.5"/>' +
            // Earth (left half lit by sun, right half dark)
            '<circle cx="240" cy="136" r="22" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>' +
            '<path d="M240,114 A22,22 0 0,0 240,158 Z" fill="#38bdf8"/>' +
            '<text x="240" y="140" text-anchor="middle" font-size="10.5" font-weight="800" fill="#ffffff" font-family="' + FONT + '">地球</text>' +
            // 4 clickable ghost orbit positions
            ['new', 'first', 'full', 'last'].map(function (k) {
              var it = PHASES[k];
              var isSel = (k === phase);
              return '<g style="cursor:pointer" data-ph="' + k + '">' +
                '<circle cx="' + it.mx + '" cy="' + it.my + '" r="' + (isSel ? 15 : 10) + '" fill="#334155" stroke="' + (isSel ? '#facc15' : '#64748b') + '" stroke-width="' + (isSel ? 3 : 1.5) + '"/>' +
                '<path d="M' + it.mx + ',' + (it.my - (isSel ? 14 : 9)) + ' A' + (isSel ? 14 : 9) + ',' + (isSel ? 14 : 9) + ' 0 0,0 ' + it.mx + ',' + (it.my + (isSel ? 14 : 9)) + ' Z" fill="#fef08a"/>' +
              '</g>';
            }).join('') +
            '<text x="156" y="168" text-anchor="middle" font-size="10.5" font-weight="700" fill="#e2e8f0" font-family="' + FONT + '">初一</text>' +
            '<text x="240" y="248" text-anchor="middle" font-size="10.5" font-weight="700" fill="#e2e8f0" font-family="' + FONT + '">初七上弦</text>' +
            '<text x="358" y="140" text-anchor="middle" font-size="10.5" font-weight="700" fill="#e2e8f0" font-family="' + FONT + '">十五望</text>' +
            '<text x="284" y="54" text-anchor="start" font-size="10.5" font-weight="700" fill="#e2e8f0" font-family="' + FONT + '">廿二下弦</text>' +

            // Right Earth-view inspector panel
            '<rect x="430" y="14" width="196" height="242" rx="14" fill="#f8fafc" stroke="#cbd5e1"/>' +
            '<text x="528" y="38" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a" font-family="' + FONT + '">🌍 地球上所見月相</text>' +
            drawEarthViewMoon(p.litSide) +
            '<rect x="442" y="172" width="172" height="32" rx="8" fill="#e0f2fe" stroke="#38bdf8"/>' +
            '<text x="528" y="193" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0369a1" font-family="' + FONT + '">🌊 ' + p.tide + '</text>' +
            '<rect x="442" y="212" width="172" height="34" rx="8" fill="' + (phase === 'new' || phase === 'full' ? '#fef3c7' : '#f1f5f9') + '" stroke="' + (phase === 'new' || phase === 'full' ? '#f59e0b' : '#cbd5e1') + '"/>' +
            '<text x="528" y="233" text-anchor="middle" font-size="10.5" font-weight="800" fill="#92400e" font-family="' + FONT + '">' + p.eclipse + '</text>' +
          '</svg>' +
          '<div class="hb-vis-readout">' +
            '<strong>🌙 ' + p.label + '：</strong>' + p.desc +
          '</div>';

        el.querySelectorAll('[data-ph]').forEach(function (node) {
          node.addEventListener('click', function () { phase = node.getAttribute('data-ph'); render(); });
        });
      }

      render();
    }
  };
})(window);
