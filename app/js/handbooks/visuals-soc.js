/* ==========================================================================
   visuals-soc.js — 國中社會科 9 大單元專屬互動 SVG 圖解與動畫模組
   涵蓋：地理（SOC_G1_C3, SOC_7_G2, SOC_8_G3）、歷史（SOC_7_H1, SOC_8_H2, SOC_9_H3）、
         公民（SOC_7_C1, SOC_8_C2）與九年級跨科素養統整（SOC_9_REVIEW）
   零外部相依・零原始 LaTeX・純原生 SVG + 互動控制面板
   ========================================================================== */
(function (global) {
  'use strict';

  global.JuniorHandbookVisuals = global.JuniorHandbookVisuals || {};

  var FONT_STACK = "system-ui, -apple-system, 'Noto Sans TC', 'PingFang TC', sans-serif";

  function esc(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ========================================================================
     1. SOC_G1_C3：台灣地形焚風與供需法則
        模式 A：焚風氣溫剖面推算圖（迎風 30°C → 爬升 2000m 濕絕熱 −0.6°C/100m → 18°C 降雨
                → 背風下沉 2000m 乾絕熱 +1.0°C/100m → 38°C 乾熱焚風）
        模式 B：動點（需求量）vs 移線（需求／供給）雙圖對照
     ======================================================================== */
  global.JuniorHandbookVisuals['SOC_G1_C3'] = {
    title: '🎨 焚風氣溫剖面推算 × 供需「動點 vs 移線」雙互動圖',
    subtitle: '切換兩大高頻必考圖形：親手追蹤氣團越山增溫過程，並一眼區分「動點」與「移線」',
    mount: function (el) {
      var mode = 'foehn'; // 'foehn' | 'demand'
      var foehnStep = 4;  // 0..4
      var demandCase = 'sale'; // 'sale' | 'kol' | 'wage' | 'income'
      var timer = null;

      var FOEHN_STEPS = [
        {
          id: 0,
          btn: '① 迎風起點 30°C',
          readout: '<strong>步驟 ① 迎風面海平面（0m）：</strong>暖濕氣團從海洋吹向台灣山脈，起始氣溫為 <strong>30°C</strong>，含有豐富水氣。'
        },
        {
          id: 1,
          btn: '② 迎風爬升（−0.6°C/100m）',
          readout: '<strong>步驟 ② 迎風面濕絕熱爬升：</strong>氣流受地形抬升、凝結成雲降雨並釋放潛熱，每上升 100m 降溫 <strong>0.6°C</strong>。爬升 2000m 共降溫：<code>(2000 ÷ 100) × 0.6°C = 12°C</code>。'
        },
        {
          id: 2,
          btn: '③ 山頂 2000m（18°C 降雨）',
          readout: '<strong>步驟 ③ 山頂降雨失水（2000m）：</strong>氣溫降至 <code>30°C − 12°C = 18°C</code>，大量水氣在迎風面化為地形雨落下，翻越山頂後變成<strong>乾燥空氣</strong>。'
        },
        {
          id: 3,
          btn: '④ 背風下沉（+1.0°C/100m）',
          readout: '<strong>步驟 ④ 背風面乾絕熱下沉：</strong>乾燥氣流下沉壓縮增溫，因無水分蒸發吸熱，每下降 100m 劇烈升溫 <strong>1.0°C</strong>。下降 2000m 共升溫：<code>(2000 ÷ 100) × 1.0°C = +20°C</code>！'
        },
        {
          id: 4,
          btn: '⑤ 焚風 38°C 全覽',
          readout: '<strong>結論 ⑤ 背風面焚風（台東大武／花蓮常見）：</strong>抵達背風山腳時氣溫飆升至 <code>18°C + 20°C = 38°C</code>！同樣在海平面，背風面比迎風面整整高出 <strong>8°C</strong>，呈現「高溫、乾燥」特徵。'
        }
      ];

      var DEMAND_CASES = {
        sale: {
          btn: '🏷️ 降價促銷（動點）',
          activeSide: 'left',
          curveType: 'D',
          shiftDir: 'none',
          title: '商品「本身價格」下降 → 需求量增加（沿同一條需求線滑動）',
          detail: '只有<strong>商品本身價格（P）</strong>改變，消費者對該商品的偏好與所得都沒變，因此<strong>需求曲線不移動</strong>，僅由點 A 沿著 D 線向右下移動到點 B（稱為「需求量增加」）。',
          trap: '考試地雷：降價促銷千萬不可選「需求增加（右移）」，必須選「需求量增加（點移動）」！'
        },
        kol: {
          btn: '🌟 網紅推薦爆紅（需求右移）',
          activeSide: 'right',
          curveType: 'D',
          shiftDir: 'right',
          title: '非價格因素（偏好增加）→ 需求增加（整條需求線向右平移）',
          detail: '商品原價未變，但因<strong>網紅推薦造成消費偏好提升</strong>，在每一個價位下大家想買的數量都變多，整條需求曲線由 <strong>D₀ 右移至 D₁</strong>，均衡價格 P 上漲、均衡數量 Q 增加。',
          trap: '口訣：「價變動點、非價移線」——偏好、所得、預期心理、相關商品價格變動皆屬「移線」。'
        },
        wage: {
          btn: '🔧 漲工資／原料大漲（供給左移）',
          activeSide: 'right',
          curveType: 'S',
          shiftDir: 'left',
          title: '生產成本上升 → 供給減少（整條供給線向左平移）',
          detail: '基本工資或原物料價格上漲，廠商生產成本提高，在相同售價下願意提供的產量變少，整條供給曲線由 <strong>S₀ 左移至 S₁</strong>，導致均衡價格 <strong>P 上漲</strong>、均衡交易量 <strong>Q 減少</strong>。',
          trap: '注意方向：「左減右增」！供給減少是往左移（看起來像往上移，別被視覺騙了）。'
        },
        income: {
          btn: '💰 景氣好・所得增加（需求右移）',
          activeSide: 'right',
          curveType: 'D',
          shiftDir: 'right',
          title: '消費者所得增加 → 正常財需求增加（需求線右移）',
          detail: '民眾薪資提升屬於「非本身價格因素」，對一般正常財（如手搖飲、旅遊）的購買意願全面上升，需求線由 <strong>D₀ 右移至 D₁</strong>，推升市場價格與成交量。',
          trap: '進階辨析：若是「劣等財」（如景氣差才常吃的泡麵），所得增加反而會使需求線左移。'
        }
      };

      function clearTimer() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      function buildFoehnSvg() {
        var s = foehnStep;
        var windOpacity = s >= 1 ? 1 : 0.25;
        var peakOpacity = s >= 2 ? 1 : 0.25;
        var leeOpacity = s >= 3 ? 1 : 0.25;
        var endOpacity = s >= 4 ? 1 : 0.25;

        return (
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="焚風氣溫剖面推算圖">' +
            '<defs>' +
              '<linearGradient id="soc-g1-sky" x1="0" y1="0" x2="1" y2="0">' +
                '<stop offset="0%" stop-color="#e0f2fe"/>' +
                '<stop offset="50%" stop-color="#f8fafc"/>' +
                '<stop offset="100%" stop-color="#ffedd5"/>' +
              '</linearGradient>' +
              '<linearGradient id="soc-g1-mtn" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0%" stop-color="#475569"/>' +
                '<stop offset="100%" stop-color="#94a3b8"/>' +
              '</linearGradient>' +
              '<marker id="soc-g1-arr-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#0284c7"/>' +
              '</marker>' +
              '<marker id="soc-g1-arr-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/>' +
              '</marker>' +
            '</defs>' +

            '<rect x="0" y="0" width="640" height="270" fill="url(#soc-g1-sky)"/>' +

            /* 海平面與高度參考線 */
            '<line x1="60" y1="68" x2="612" y2="68" stroke="#cbd5e1" stroke-dasharray="4 4" stroke-width="1"/>' +
            '<line x1="60" y1="146" x2="612" y2="146" stroke="#cbd5e1" stroke-dasharray="4 4" stroke-width="1"/>' +
            '<line x1="60" y1="224" x2="612" y2="224" stroke="#94a3b8" stroke-width="1.5"/>' +
            '<text x="54" y="72" text-anchor="end" font-size="11" font-weight="700" fill="#475569" font-family="' + FONT_STACK + '">2000m</text>' +
            '<text x="54" y="150" text-anchor="end" font-size="11" fill="#64748b" font-family="' + FONT_STACK + '">1000m</text>' +
            '<text x="54" y="228" text-anchor="end" font-size="11" font-weight="700" fill="#475569" font-family="' + FONT_STACK + '">0m</text>' +

            /* 海洋與平地 */
            '<rect x="60" y="224" width="84" height="32" fill="#38bdf8" opacity="0.35"/>' +
            '<text x="102" y="244" text-anchor="middle" font-size="11" font-weight="700" fill="#0369a1" font-family="' + FONT_STACK + '">迎風海洋</text>' +
            '<rect x="496" y="224" width="116" height="32" fill="#fed7aa" opacity="0.55"/>' +
            '<text x="554" y="244" text-anchor="middle" font-size="11" font-weight="700" fill="#9a3412" font-family="' + FONT_STACK + '">背風平地（台東）</text>' +

            /* 山脈剖面 */
            '<polygon points="144,224 320,68 496,224" fill="url(#soc-g1-mtn)" stroke="#334155" stroke-width="2"/>' +
            '<text x="320" y="176" text-anchor="middle" font-size="13" font-weight="800" fill="#f8fafc" font-family="' + FONT_STACK + '">中央山脈</text>' +
            '<text x="320" y="196" text-anchor="middle" font-size="11" fill="#e2e8f0" font-family="' + FONT_STACK + '">高度差 2000m</text>' +

            /* 迎風面地形雨雲 */
            '<g opacity="' + peakOpacity + '">' +
              '<path d="M188,78 C180,78 174,71 176,63 C178,56 186,52 194,54 C199,45 214,42 224,49 C232,45 246,48 250,56 C258,57 262,65 258,72 C255,77 248,78 242,78 Z" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/>' +
              '<line x1="194" y1="84" x2="188" y2="102" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>' +
              '<line x1="210" y1="84" x2="204" y2="104" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>' +
              '<line x1="226" y1="84" x2="220" y2="104" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>' +
              '<line x1="242" y1="84" x2="236" y2="100" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>' +
              '<text x="218" y="36" text-anchor="middle" font-size="11" font-weight="700" fill="#0369a1" font-family="' + FONT_STACK + '">地形雨（釋放潛熱・水氣流失）</text>' +
            '</g>' +

            /* 步驟 1：迎風爬升箭頭 */
            '<g opacity="' + windOpacity + '">' +
              '<path d="M132,208 L296,64" fill="none" stroke="#0284c7" stroke-width="' + (s === 1 ? '4.5' : '3') + '" stroke-dasharray="8 4" marker-end="url(#soc-g1-arr-blue)"/>' +
              '<rect x="74" y="114" width="142" height="44" rx="8" fill="#ffffff" stroke="#0284c7" stroke-width="' + (s === 1 ? '2.5' : '1.2') + '"/>' +
              '<text x="145" y="132" text-anchor="middle" font-size="11" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">濕絕熱 −0.6°C / 100m</text>' +
              '<text x="145" y="149" text-anchor="middle" font-size="11" font-weight="700" fill="#0f172a" font-family="' + FONT_STACK + '">爬升 2000m → 共 −12°C</text>' +
            '</g>' +

            /* 步驟 0：起點 30°C 標記 */
            '<g>' +
              '<circle cx="144" cy="224" r="6" fill="#0284c7" stroke="#fff" stroke-width="2"/>' +
              '<rect x="64" y="182" width="74" height="30" rx="15" fill="' + (s === 0 ? '#0284c7' : '#e0f2fe') + '" stroke="#0284c7" stroke-width="1.5"/>' +
              '<text x="101" y="201" text-anchor="middle" font-size="12" font-weight="800" fill="' + (s === 0 ? '#ffffff' : '#0369a1') + '" font-family="' + FONT_STACK + '">起點 30°C</text>' +
            '</g>' +

            /* 步驟 2：山頂 18°C 標記 */
            '<g opacity="' + peakOpacity + '">' +
              '<circle cx="320" cy="68" r="6" fill="#4f46e5" stroke="#fff" stroke-width="2"/>' +
              '<rect x="272" y="18" width="96" height="32" rx="16" fill="' + (s === 2 ? '#4f46e5' : '#eef2ff') + '" stroke="#4f46e5" stroke-width="1.5"/>' +
              '<text x="320" y="38" text-anchor="middle" font-size="12" font-weight="800" fill="' + (s === 2 ? '#ffffff' : '#3730a3') + '" font-family="' + FONT_STACK + '">山頂 18°C</text>' +
            '</g>' +

            /* 步驟 3：背風下沉箭頭 */
            '<g opacity="' + leeOpacity + '">' +
              '<path d="M344,64 L508,208" fill="none" stroke="#dc2626" stroke-width="' + (s === 3 ? '4.5' : '3') + '" stroke-dasharray="8 4" marker-end="url(#soc-g1-arr-red)"/>' +
              '<rect x="424" y="114" width="150" height="44" rx="8" fill="#ffffff" stroke="#dc2626" stroke-width="' + (s === 3 ? '2.5' : '1.2') + '"/>' +
              '<text x="499" y="132" text-anchor="middle" font-size="11" font-weight="800" fill="#b91c1c" font-family="' + FONT_STACK + '">乾絕熱 +1.0°C / 100m</text>' +
              '<text x="499" y="149" text-anchor="middle" font-size="11" font-weight="700" fill="#0f172a" font-family="' + FONT_STACK + '">下沉 2000m → 共 +20°C</text>' +
              /* 乾燥太陽符號 */
              '<circle cx="568" cy="54" r="14" fill="#fb923c" opacity="0.9"/>' +
              '<text x="568" y="84" text-anchor="middle" font-size="11" font-weight="700" fill="#c2410c" font-family="' + FONT_STACK + '">乾燥無雨</text>' +
            '</g>' +

            /* 步驟 4：背風焚風 38°C 標記 */
            '<g opacity="' + endOpacity + '">' +
              '<circle cx="496" cy="224" r="6" fill="#dc2626" stroke="#fff" stroke-width="2"/>' +
              '<rect x="504" y="182" width="114" height="30" rx="15" fill="' + (s === 4 ? '#dc2626' : '#fee2e2') + '" stroke="#dc2626" stroke-width="1.5"/>' +
              '<text x="561" y="201" text-anchor="middle" font-size="12" font-weight="800" fill="' + (s === 4 ? '#ffffff' : '#991b1b') + '" font-family="' + FONT_STACK + '">焚風 38°C（+8°C）</text>' +
            '</g>' +
          '</svg>'
        );
      }

      function buildDemandSvg() {
        var c = DEMAND_CASES[demandCase];
        var leftActive = c.activeSide === 'left';
        var rightActive = c.activeSide === 'right';
        var isSupply = c.curveType === 'S';

        var rightVisual = '';
        if (isSupply) {
          /* 供給曲線左移（S0 -> S1） */
          rightVisual =
            /* 原需求線 D 固定 */
            '<line x1="398" y1="68" x2="554" y2="206" stroke="#94a3b8" stroke-width="2"/>' +
            '<text x="560" y="210" font-size="12" font-weight="700" fill="#64748b" font-family="' + FONT_STACK + '">D</text>' +
            /* 原供給線 S0 */
            '<line x1="416" y1="208" x2="564" y2="74" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/>' +
            '<text x="568" y="76" font-size="12" font-weight="700" fill="#64748b" font-family="' + FONT_STACK + '">S₀</text>' +
            /* 新供給線 S1 左移 */
            '<line x1="380" y1="186" x2="522" y2="58" stroke="#dc2626" stroke-width="3"/>' +
            '<text x="526" y="60" font-size="12" font-weight="800" fill="#dc2626" font-family="' + FONT_STACK + '">S₁</text>' +
            /* 左移箭頭 */
            '<line x1="518" y1="114" x2="478" y2="114" stroke="#dc2626" stroke-width="2.5" marker-end="url(#soc-g1-d-red)"/>' +
            '<text x="498" y="106" text-anchor="middle" font-size="10" font-weight="800" fill="#dc2626" font-family="' + FONT_STACK + '">供給左移</text>' +
            /* 均衡點 E0 -> E1 */
            '<circle cx="484" cy="146" r="4.5" fill="#64748b"/>' +
            '<text x="494" y="156" font-size="11" font-weight="700" fill="#475569" font-family="' + FONT_STACK + '">E₀</text>' +
            '<circle cx="456" cy="119" r="5.5" fill="#dc2626" stroke="#fff" stroke-width="1.5"/>' +
            '<text x="438" y="114" font-size="11" font-weight="800" fill="#dc2626" font-family="' + FONT_STACK + '">E₁</text>' +
            '<text x="486" y="246" text-anchor="middle" font-size="11" font-weight="800" fill="#b91c1c" font-family="' + FONT_STACK + '">結果：均衡價格 P↑、數量 Q↓</text>';
        } else {
          /* 需求曲線右移（D0 -> D1） */
          rightVisual =
            /* 固定供給線 S */
            '<line x1="396" y1="204" x2="556" y2="70" stroke="#94a3b8" stroke-width="2"/>' +
            '<text x="562" y="72" font-size="12" font-weight="700" fill="#64748b" font-family="' + FONT_STACK + '">S</text>' +
            /* 原需求線 D0 */
            '<line x1="392" y1="74" x2="528" y2="206" stroke="#94a3b8" stroke-width="2" stroke-dasharray="5 4"/>' +
            '<text x="530" y="214" font-size="12" font-weight="700" fill="#64748b" font-family="' + FONT_STACK + '">D₀</text>' +
            /* 新需求線 D1 右移 */
            '<line x1="434" y1="62" x2="574" y2="196" stroke="#16a34a" stroke-width="3"/>' +
            '<text x="578" y="204" font-size="12" font-weight="800" fill="#16a34a" font-family="' + FONT_STACK + '">D₁</text>' +
            /* 右移箭頭 */
            '<line x1="478" y1="162" x2="518" y2="162" stroke="#16a34a" stroke-width="2.5" marker-end="url(#soc-g1-d-green)"/>' +
            '<text x="500" y="154" text-anchor="middle" font-size="10" font-weight="800" fill="#15803d" font-family="' + FONT_STACK + '">需求右移</text>' +
            /* 均衡點 E0 -> E1 */
            '<circle cx="462" cy="144" r="4.5" fill="#64748b"/>' +
            '<text x="444" y="152" font-size="11" font-weight="700" fill="#475569" font-family="' + FONT_STACK + '">E₀</text>' +
            '<circle cx="490" cy="120" r="5.5" fill="#16a34a" stroke="#fff" stroke-width="1.5"/>' +
            '<text x="500" y="114" font-size="11" font-weight="800" fill="#15803d" font-family="' + FONT_STACK + '">E₁</text>' +
            '<text x="486" y="246" text-anchor="middle" font-size="11" font-weight="800" fill="#15803d" font-family="' + FONT_STACK + '">結果：均衡價格 P↑、數量 Q↑</text>';
        }

        return (
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="動點與移線雙圖對照">' +
            '<defs>' +
              '<marker id="soc-g1-d-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#0284c7"/>' +
              '</marker>' +
              '<marker id="soc-g1-d-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#16a34a"/>' +
              '</marker>' +
              '<marker id="soc-g1-d-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/>' +
              '</marker>' +
            '</defs>' +

            /* 左圖卡片：動點 */
            '<g opacity="' + (leftActive ? '1' : '0.42') + '">' +
              '<rect x="14" y="12" width="298" height="246" rx="10" fill="' + (leftActive ? '#f0f9ff' : '#f8fafc') + '" stroke="' + (leftActive ? '#0284c7' : '#cbd5e1') + '" stroke-width="' + (leftActive ? '2.5' : '1.2') + '"/>' +
              '<text x="163" y="34" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">① 動點：需求量變動（本身價格改變）</text>' +
              /* 座標軸 */
              '<line x1="62" y1="54" x2="62" y2="218" stroke="#334155" stroke-width="2"/>' +
              '<line x1="62" y1="218" x2="278" y2="218" stroke="#334155" stroke-width="2"/>' +
              '<text x="50" y="60" text-anchor="end" font-size="11" font-weight="800" fill="#334155" font-family="' + FONT_STACK + '">P</text>' +
              '<text x="284" y="222" font-size="11" font-weight="800" fill="#334155" font-family="' + FONT_STACK + '">Q</text>' +
              /* 需求曲線 D */
              '<line x1="94" y1="68" x2="254" y2="202" stroke="#0284c7" stroke-width="3"/>' +
              '<text x="260" y="206" font-size="12" font-weight="800" fill="#0284c7" font-family="' + FONT_STACK + '">D</text>' +
              /* 點 A 與投影 */
              '<line x1="62" y1="106" x2="139" y2="106" stroke="#94a3b8" stroke-dasharray="4 3"/>' +
              '<line x1="139" y1="106" x2="139" y2="218" stroke="#94a3b8" stroke-dasharray="4 3"/>' +
              '<circle cx="139" cy="106" r="5" fill="#64748b"/>' +
              '<text x="148" y="102" font-size="11" font-weight="700" fill="#475569" font-family="' + FONT_STACK + '">A (原價)</text>' +
              '<text x="56" y="110" text-anchor="end" font-size="10.5" fill="#475569" font-family="' + FONT_STACK + '">P₁</text>' +
              '<text x="139" y="232" text-anchor="middle" font-size="10.5" fill="#475569" font-family="' + FONT_STACK + '">Q₁</text>' +
              /* 點 B 與投影 */
              '<line x1="62" y1="164" x2="209" y2="164" stroke="#0284c7" stroke-dasharray="4 3"/>' +
              '<line x1="209" y1="164" x2="209" y2="218" stroke="#0284c7" stroke-dasharray="4 3"/>' +
              '<circle cx="209" cy="164" r="6" fill="#0284c7" stroke="#fff" stroke-width="1.5"/>' +
              '<text x="218" y="162" font-size="11" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">B (降價)</text>' +
              '<text x="56" y="168" text-anchor="end" font-size="10.5" font-weight="800" fill="#0284c7" font-family="' + FONT_STACK + '">P₂</text>' +
              '<text x="209" y="232" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0284c7" font-family="' + FONT_STACK + '">Q₂</text>' +
              /* 沿線箭頭 */
              '<path d="M150,115 L196,153" stroke="#0284c7" stroke-width="2.5" marker-end="url(#soc-g1-d-blue)"/>' +
              '<text x="163" y="248" text-anchor="middle" font-size="11" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">線不動，點由 A → B 滑動</text>' +
            '</g>' +

            /* 右圖卡片：移線 */
            '<g opacity="' + (rightActive ? '1' : '0.42') + '">' +
              '<rect x="328" y="12" width="298" height="246" rx="10" fill="' + (rightActive ? (isSupply ? '#fef2f2' : '#f0fdf4') : '#f8fafc') + '" stroke="' + (rightActive ? (isSupply ? '#dc2626' : '#16a34a') : '#cbd5e1') + '" stroke-width="' + (rightActive ? '2.5' : '1.2') + '"/>' +
              '<text x="477" y="34" text-anchor="middle" font-size="12.5" font-weight="800" fill="' + (isSupply ? '#b91c1c' : '#15803d') + '" font-family="' + FONT_STACK + '">② 移線：' + (isSupply ? '供給變動（成本改變）' : '需求變動（非價格因素）') + '</text>' +
              /* 座標軸 */
              '<line x1="374" y1="54" x2="374" y2="218" stroke="#334155" stroke-width="2"/>' +
              '<line x1="374" y1="218" x2="594" y2="218" stroke="#334155" stroke-width="2"/>' +
              '<text x="364" y="60" text-anchor="end" font-size="11" font-weight="800" fill="#334155" font-family="' + FONT_STACK + '">P</text>' +
              '<text x="600" y="222" font-size="11" font-weight="800" fill="#334155" font-family="' + FONT_STACK + '">Q</text>' +
              rightVisual +
            '</g>' +
          '</svg>'
        );
      }

      function render() {
        var modeControls =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn' + (mode === 'foehn' ? ' active' : '') + '" data-mode="foehn">⛰️ 焚風氣溫剖面推算圖</button>' +
            '<button type="button" class="hb-vis-btn' + (mode === 'demand' ? ' active' : '') + '" data-mode="demand">📈 動點(需求量) vs 移線(需求)雙圖對照</button>' +
          '</div>';

        var subControls = '';
        var svgHtml = '';
        var readoutHtml = '';
        var tableHtml = '';

        if (mode === 'foehn') {
          subControls =
            '<div class="hb-vis-controls">' +
              FOEHN_STEPS.map(function (st) {
                return '<button type="button" class="hb-vis-btn' + (foehnStep === st.id ? ' active' : '') + '" data-fstep="' + st.id + '">' + esc(st.btn) + '</button>';
              }).join('') +
              '<button type="button" class="hb-vis-btn" data-fplay="1">▶ 逐步動畫</button>' +
            '</div>';
          svgHtml = buildFoehnSvg();
          readoutHtml = '<div class="hb-vis-readout">' + FOEHN_STEPS[foehnStep].readout + '</div>';
          tableHtml =
            '<table class="hb-vis-table">' +
              '<thead><tr><th>階段</th><th>遞減／增溫率</th><th>高度變化</th><th>氣溫結果</th></tr></thead>' +
              '<tbody>' +
                '<tr class="' + (foehnStep <= 2 ? 'vis-row-active' : '') + '"><td>迎風面爬升（濕絕熱）</td><td>每 100m 降 0.6°C</td><td>0m → 2000m（+2000m）</td><td>30°C − 12°C = <strong>18°C</strong></td></tr>' +
                '<tr class="' + (foehnStep >= 3 ? 'vis-row-win' : '') + '"><td>背風面下沉（乾絕熱）</td><td>每 100m 升 1.0°C</td><td>2000m → 0m（−2000m）</td><td>18°C + 20°C = <strong>38°C（焚風）</strong></td></tr>' +
              '</tbody>' +
            '</table>';
        } else {
          subControls =
            '<div class="hb-vis-controls">' +
              Object.keys(DEMAND_CASES).map(function (k) {
                return '<button type="button" class="hb-vis-btn' + (demandCase === k ? ' active' : '') + '" data-dcase="' + k + '">' + esc(DEMAND_CASES[k].btn) + '</button>';
              }).join('') +
            '</div>';
          svgHtml = buildDemandSvg();
          var dc = DEMAND_CASES[demandCase];
          readoutHtml =
            '<div class="hb-vis-readout">' +
              '<strong>' + esc(dc.title) + '</strong><br>' + dc.detail +
              '<br><span style="color:#b91c1c;font-weight:700;">⚠️ ' + esc(dc.trap) + '</span>' +
            '</div>';
          tableHtml =
            '<table class="hb-vis-table">' +
              '<thead><tr><th>情境類型</th><th>變動原因</th><th>圖形表現</th><th>專有名詞</th></tr></thead>' +
              '<tbody>' +
                '<tr class="' + (demandCase === 'sale' ? 'vis-row-active' : '') + '"><td>商品特價促銷</td><td>本身價格改變</td><td>點沿曲線滑動（動點）</td><td>需求量變動</td></tr>' +
                '<tr class="' + (demandCase === 'kol' || demandCase === 'income' ? 'vis-row-win' : '') + '"><td>網紅推薦／所得增加</td><td>非價格因素改變</td><td>整條需求線向右平移</td><td>需求增加（右移）</td></tr>' +
                '<tr class="' + (demandCase === 'wage' ? 'vis-row-elim' : '') + '"><td>漲工資／原料上漲</td><td>生產成本增加</td><td>整條供給線向左平移</td><td>供給減少（左移）</td></tr>' +
              '</tbody>' +
            '</table>';
        }

        el.innerHTML = modeControls + subControls + svgHtml + readoutHtml + tableHtml;

        el.querySelectorAll('[data-mode]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            clearTimer();
            mode = btn.getAttribute('data-mode');
            render();
          });
        });

        el.querySelectorAll('[data-fstep]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            clearTimer();
            foehnStep = Number(btn.getAttribute('data-fstep'));
            render();
          });
        });

        var playBtn = el.querySelector('[data-fplay]');
        if (playBtn) {
          playBtn.addEventListener('click', function () {
            clearTimer();
            foehnStep = 0;
            render();
            timer = setInterval(function () {
              foehnStep += 1;
              if (foehnStep >= FOEHN_STEPS.length) {
                foehnStep = FOEHN_STEPS.length - 1;
                clearTimer();
              }
              render();
            }, 1300);
          });
        }

        el.querySelectorAll('[data-dcase]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            demandCase = btn.getAttribute('data-dcase');
            render();
          });
        });
      }

      render();
      return clearTimer;
    }
  };

  /* ========================================================================
     2. SOC_7_G2：中國地形、氣候與水文
        中國三級階梯剖面與水力落差圖 ＋ 秦嶺—淮河（0°C／800mm）南北分界
     ======================================================================== */
  global.JuniorHandbookVisuals['SOC_7_G2'] = {
    title: '🎨 中國三級階梯剖面 × 水力落差 × 秦嶺—淮河分界圖',
    subtitle: '點選各級階梯或南北分界，一次掌握「西高東低、階梯落差發電、南稻北麥」三大地形因果',
    mount: function (el) {
      var activeKey = 't1';

      var ITEMS = [
        {
          key: 't1',
          btn: '🏔️ 第一階梯：青藏高原',
          elev: '4000m 以上',
          landforms: '青藏高原、柴達木盆地',
          rivers: '長江、黃河、瀾滄江發源地（亞洲水塔）',
          exam: '高地氣候、地勢最高，為多數大河源頭，受山脈阻隔形成高寒環境。'
        },
        {
          key: 't2',
          btn: '🏜️ 第二階梯：高原與盆地',
          elev: '1000–2000m',
          landforms: '內蒙古高原、黃土高原、雲貴高原、四川盆地、塔里木盆地',
          rivers: '長江中上游（峽谷急流）、黃河中游（流經黃土高原含沙大增）',
          exam: '第一與第二階梯交界（橫斷山脈）落差極大，水力蘊藏居中國之冠！'
        },
        {
          key: 't3',
          btn: '🌾 第三階梯：平原與丘陵',
          elev: '500m 以下',
          landforms: '東北平原、華北平原、長江中下游平原、東南丘陵',
          rivers: '長江下游（航運黃金水道）、珠江三角洲',
          exam: '地勢低平利於太平洋東南季風深入內陸降雨，成為人口與農業最密集區！'
        },
        {
          key: 'hydro',
          btn: '⚡ 階梯交界水力落差',
          elev: '陡降落差帶',
          landforms: '交界山脈：崑崙—橫斷山脈｜大興安嶺—太行山—巫山',
          rivers: '三峽大壩（二、三階梯巫山交界）、白鶴灘水電站（一、二階梯）',
          exam: '會考秒殺法則：水力發電看「水量大＋落差大」，必選「階梯交界處」而非平原下游！'
        },
        {
          key: 'qinling',
          btn: '🧭 秦嶺—淮河（0°C／800mm）',
          elev: '南北地理分界',
          landforms: '秦嶺山脈（阻擋冬季冷空氣）＋ 淮河水系',
          rivers: '以北河流冬季結冰；以南終年不凍、水量豐沛',
          exam: '1 月 0°C 等溫線 ＋ 年雨量 800mm 等雨量線：以南水田稻米、以北旱作小麥！'
        }
      ];

      function buildTerrainSvg() {
        var isT1 = activeKey === 't1';
        var isT2 = activeKey === 't2';
        var isT3 = activeKey === 't3';
        var isHydro = activeKey === 'hydro';

        return (
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="中國三級階梯剖面與水力落差圖">' +
            '<defs>' +
              '<marker id="soc-g2-arr-wind" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#0ea5e9"/>' +
              '</marker>' +
              '<marker id="soc-g2-arr-river" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#1d4ed8"/>' +
              '</marker>' +
            '</defs>' +

            '<rect x="0" y="0" width="640" height="270" fill="#f8fafc"/>' +

            /* 標題與方位 */
            '<text x="320" y="22" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0f172a" font-family="' + FONT_STACK + '">中國沿北緯 32° 地形剖面圖（西高東低・三級階梯）</text>' +
            '<text x="64" y="40" font-size="11" font-weight="700" fill="#475569" font-family="' + FONT_STACK + '">← 西（內陸）</text>' +
            '<text x="612" y="40" text-anchor="end" font-size="11" font-weight="700" fill="#0369a1" font-family="' + FONT_STACK + '">東（太平洋） →</text>' +

            /* 高度基準線 */
            '<line x1="56" y1="68" x2="616" y2="68" stroke="#e2e8f0" stroke-dasharray="4 4"/>' +
            '<line x1="56" y1="132" x2="616" y2="132" stroke="#e2e8f0" stroke-dasharray="4 4"/>' +
            '<line x1="56" y1="176" x2="616" y2="176" stroke="#e2e8f0" stroke-dasharray="4 4"/>' +
            '<line x1="56" y1="210" x2="616" y2="210" stroke="#94a3b8" stroke-width="1.5"/>' +
            '<text x="50" y="72" text-anchor="end" font-size="10.5" fill="#64748b" font-family="' + FONT_STACK + '">4000m</text>' +
            '<text x="50" y="136" text-anchor="end" font-size="10.5" fill="#64748b" font-family="' + FONT_STACK + '">2000m</text>' +
            '<text x="50" y="180" text-anchor="end" font-size="10.5" fill="#64748b" font-family="' + FONT_STACK + '">500m</text>' +
            '<text x="50" y="214" text-anchor="end" font-size="10.5" fill="#64748b" font-family="' + FONT_STACK + '">0m</text>' +

            /* 第一階梯 */
            '<polygon points="60,210 60,72 204,72 222,136 222,210" fill="' + (isT1 ? '#c084fc' : '#e9d5ff') + '" stroke="' + (isT1 ? '#7e22ce' : '#a855f7') + '" stroke-width="' + (isT1 ? '2.5' : '1.2') + '"/>' +
            '<text x="132" y="106" text-anchor="middle" font-size="12" font-weight="800" fill="#581c87" font-family="' + FONT_STACK + '">第一階梯</text>' +
            '<text x="132" y="124" text-anchor="middle" font-size="11" font-weight="700" fill="#6b21a8" font-family="' + FONT_STACK + '">青藏高原</text>' +
            '<text x="132" y="142" text-anchor="middle" font-size="10.5" fill="#7e22ce" font-family="' + FONT_STACK + '">＞ 4000m</text>' +

            /* 第二階梯 */
            '<polygon points="222,210 222,136 376,136 394,180 394,210" fill="' + (isT2 ? '#fbbf24' : '#fef3c7') + '" stroke="' + (isT2 ? '#b45309' : '#d97706') + '" stroke-width="' + (isT2 ? '2.5' : '1.2') + '"/>' +
            '<text x="299" y="162" text-anchor="middle" font-size="12" font-weight="800" fill="#78350f" font-family="' + FONT_STACK + '">第二階梯</text>' +
            '<text x="299" y="179" text-anchor="middle" font-size="11" font-weight="700" fill="#92400e" font-family="' + FONT_STACK + '">高原・盆地</text>' +
            '<text x="299" y="196" text-anchor="middle" font-size="10.5" fill="#b45309" font-family="' + FONT_STACK + '">1000–2000m</text>' +

            /* 第三階梯 */
            '<polygon points="394,210 394,180 532,180 540,210" fill="' + (isT3 ? '#4ade80' : '#dcfce7') + '" stroke="' + (isT3 ? '#15803d' : '#22c55e') + '" stroke-width="' + (isT3 ? '2.5' : '1.2') + '"/>' +
            '<text x="463" y="198" text-anchor="middle" font-size="11.5" font-weight="800" fill="#14532d" font-family="' + FONT_STACK + '">第三階梯（平原）</text>' +

            /* 東海太平洋 */
            '<rect x="540" y="200" width="76" height="24" fill="#38bdf8" opacity="0.45"/>' +
            '<text x="578" y="216" text-anchor="middle" font-size="11" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">東海</text>' +

            /* 大河東流曲線 */
            '<path d="M168,70 L204,70 L224,132 L376,132 L396,176 L536,192" fill="none" stroke="#1d4ed8" stroke-width="' + (isHydro ? '3.8' : '2.4') + '" marker-end="url(#soc-g2-arr-river)"/>' +

            /* 水力落差發電站標記 */
            '<g opacity="' + (isHydro ? '1' : '0.78') + '">' +
              '<rect x="190" y="88" width="66" height="24" rx="12" fill="' + (isHydro ? '#dc2626' : '#eff6ff') + '" stroke="' + (isHydro ? '#991b1b' : '#2563eb') + '" stroke-width="1.5"/>' +
              '<text x="223" y="104" text-anchor="middle" font-size="10.5" font-weight="800" fill="' + (isHydro ? '#fff' : '#1d4ed8') + '" font-family="' + FONT_STACK + '">⚡ 橫斷山</text>' +

              '<rect x="360" y="142" width="76" height="24" rx="12" fill="' + (isHydro ? '#dc2626' : '#eff6ff') + '" stroke="' + (isHydro ? '#991b1b' : '#2563eb') + '" stroke-width="1.5"/>' +
              '<text x="398" y="158" text-anchor="middle" font-size="10.5" font-weight="800" fill="' + (isHydro ? '#fff' : '#1d4ed8') + '" font-family="' + FONT_STACK + '">⚡ 三峽大壩</text>' +
            '</g>' +

            /* 東南季風深入內陸箭頭 */
            '<path d="M602,112 C540,94 466,94 404,108" fill="none" stroke="#0ea5e9" stroke-width="' + (isT3 ? '3.5' : '2') + '" stroke-dasharray="6 4" marker-end="url(#soc-g2-arr-wind)"/>' +
            '<text x="514" y="88" text-anchor="middle" font-size="11" font-weight="800" fill="#0284c7" font-family="' + FONT_STACK + '">夏季東南季風（深入內陸降雨）</text>' +

            /* 底部交界山脈標註 */
            '<text x="222" y="236" text-anchor="middle" font-size="10.5" font-weight="700" fill="#475569" font-family="' + FONT_STACK + '">▲ 崑崙—橫斷山脈</text>' +
            '<text x="394" y="236" text-anchor="middle" font-size="10.5" font-weight="700" fill="#475569" font-family="' + FONT_STACK + '">▲ 大興安嶺—太行山—巫山</text>' +
            '<text x="320" y="258" text-anchor="middle" font-size="11" font-weight="700" fill="#0369a1" font-family="' + FONT_STACK + '">三大地形效應：① 大河東流利航運　② 階梯落差發水電　③ 東低利季風深入</text>' +
          '</svg>'
        );
      }

      function buildQinlingSvg() {
        return (
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="秦嶺淮河南北地理分界圖">' +
            /* 北方區域 */
            '<rect x="18" y="16" width="604" height="98" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>' +
            '<text x="36" y="42" font-size="14" font-weight="800" fill="#92400e" font-family="' + FONT_STACK + '">🌾 北方地區（溫帶季風氣候・旱作農業）</text>' +
            '<rect x="36" y="54" width="178" height="46" rx="8" fill="#ffffff" stroke="#fcd34d"/>' +
            '<text x="125" y="73" text-anchor="middle" font-size="11.5" font-weight="800" fill="#b45309" font-family="' + FONT_STACK + '">1 月均溫 ＜ 0°C</text>' +
            '<text x="125" y="91" text-anchor="middle" font-size="11" fill="#475569" font-family="' + FONT_STACK + '">冬季寒冷・河流結冰</text>' +

            '<rect x="230" y="54" width="178" height="46" rx="8" fill="#ffffff" stroke="#fcd34d"/>' +
            '<text x="319" y="73" text-anchor="middle" font-size="11.5" font-weight="800" fill="#b45309" font-family="' + FONT_STACK + '">年降水量 ＜ 800mm</text>' +
            '<text x="319" y="91" text-anchor="middle" font-size="11" fill="#475569" font-family="' + FONT_STACK + '">旱作：小麥・高粱・玉米</text>' +

            '<rect x="424" y="54" width="182" height="46" rx="8" fill="#ffffff" stroke="#fcd34d"/>' +
            '<text x="515" y="73" text-anchor="middle" font-size="11.5" font-weight="800" fill="#b45309" font-family="' + FONT_STACK + '">傳統生活：南船北馬</text>' +
            '<text x="515" y="91" text-anchor="middle" font-size="11" fill="#475569" font-family="' + FONT_STACK + '">陸運馬車・麵食・平頂屋</text>' +

            /* 中央秦嶺淮河分界帶 */
            '<rect x="18" y="122" width="604" height="30" rx="15" fill="#dc2626"/>' +
            '<text x="320" y="142" text-anchor="middle" font-size="13" font-weight="800" fill="#ffffff" font-family="' + FONT_STACK + '">⛰️ 秦嶺 — 淮河 分界線（1 月 0°C 等溫線 ｜ 年降水量 800mm 等雨量線）</text>' +

            /* 南方區域 */
            '<rect x="18" y="160" width="604" height="98" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>' +
            '<text x="36" y="186" font-size="14" font-weight="800" fill="#166534" font-family="' + FONT_STACK + '">🍚 南方地區（副熱帶季風氣候・水田農業）</text>' +
            '<rect x="36" y="198" width="178" height="46" rx="8" fill="#ffffff" stroke="#86efac"/>' +
            '<text x="125" y="217" text-anchor="middle" font-size="11.5" font-weight="800" fill="#15803d" font-family="' + FONT_STACK + '">1 月均溫 ＞ 0°C</text>' +
            '<text x="125" y="235" text-anchor="middle" font-size="11" fill="#475569" font-family="' + FONT_STACK + '">冬季溫和・河流終年不凍</text>' +

            '<rect x="230" y="198" width="178" height="46" rx="8" fill="#ffffff" stroke="#86efac"/>' +
            '<text x="319" y="217" text-anchor="middle" font-size="11.5" font-weight="800" fill="#15803d" font-family="' + FONT_STACK + '">年降水量 ＞ 800mm</text>' +
            '<text x="319" y="235" text-anchor="middle" font-size="11" fill="#475569" font-family="' + FONT_STACK + '">水田：稻米・茶葉・油菜</text>' +

            '<rect x="424" y="198" width="182" height="46" rx="8" fill="#ffffff" stroke="#86efac"/>' +
            '<text x="515" y="217" text-anchor="middle" font-size="11.5" font-weight="800" fill="#15803d" font-family="' + FONT_STACK + '">傳統生活：河運發達</text>' +
            '<text x="515" y="235" text-anchor="middle" font-size="11" fill="#475569" font-family="' + FONT_STACK + '">水運舟楫・米食・斜頂屋</text>' +
          '</svg>'
        );
      }

      function render() {
        var cur = ITEMS.filter(function (it) { return it.key === activeKey; })[0] || ITEMS[0];
        var controls =
          '<div class="hb-vis-controls">' +
            ITEMS.map(function (it) {
              return '<button type="button" class="hb-vis-btn' + (activeKey === it.key ? ' active' : '') + '" data-g2="' + it.key + '">' + esc(it.btn) + '</button>';
            }).join('') +
          '</div>';

        var svg = activeKey === 'qinling' ? buildQinlingSvg() : buildTerrainSvg();
        var readout =
          '<div class="hb-vis-readout">' +
            '<strong>' + esc(cur.btn) + '（' + esc(cur.elev) + '）</strong><br>' +
            '<strong>代表地形：</strong>' + esc(cur.landforms) + '　｜　<strong>水文特色：</strong>' + esc(cur.rivers) + '<br>' +
            '<strong>🎯 會考必背：</strong>' + esc(cur.exam) +
          '</div>';

        var table =
          '<table class="hb-vis-table">' +
            '<thead><tr><th>階梯／分界</th><th>海拔高度</th><th>核心地理意義</th></tr></thead>' +
            '<tbody>' +
              ITEMS.map(function (it) {
                return '<tr class="vis-row-clickable' + (activeKey === it.key ? ' vis-row-active' : '') + '" data-g2="' + it.key + '">' +
                  '<td>' + esc(it.btn) + '</td><td>' + esc(it.elev) + '</td><td>' + esc(it.exam) + '</td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>';

        el.innerHTML = controls + svg + readout + table;
        el.querySelectorAll('[data-g2]').forEach(function (node) {
          node.addEventListener('click', function () {
            activeKey = node.getAttribute('data-g2');
            render();
          });
        });
      }

      render();
    }
  };

  /* ========================================================================
     3. SOC_8_G3：世界氣候區與行星風帶
        地中海氣候風帶季移切換圖（北半球夏季副高北移乾燥 vs 冬季西風南移多雨）
     ======================================================================== */
  global.JuniorHandbookVisuals['SOC_8_G3'] = {
    title: '🎨 地中海型氣候「行星風帶季移」動態切換圖',
    subtitle: '切換夏季與冬季，觀察副熱帶高壓與西風帶如何隨太陽直射點移動，同步對照溫雨圖（夏乾冬雨）',
    mount: function (el) {
      var season = 'summer'; // 'summer' | 'winter' | 'both'

      function buildSeasonSvg() {
        var isSummer = season === 'summer';
        var isWinter = season === 'winter';

        /* 羅馬／雅典風格溫雨圖（1–12 月） */
        var rainBars = [82, 74, 62, 46, 28, 12, 6, 10, 38, 72, 92, 90];
        var tempVals = [8, 9, 12, 15, 19, 24, 27, 27, 23, 18, 13, 9];
        var chartX = 434;
        var chartY = 58;
        var chartW = 180;
        var chartH = 152;

        var barSvg = '';
        var tempPts = [];
        for (var i = 0; i < 12; i++) {
          var bx = chartX + 6 + i * 14.4;
          var bh = Math.round((rainBars[i] / 100) * 116);
          var by = chartY + chartH - bh;
          var highlight = (isSummer && i >= 5 && i <= 7) || (isWinter && (i <= 1 || i >= 10));
          var barFill = highlight ? (isSummer ? '#f97316' : '#0284c7') : '#93c5fd';
          barSvg += '<rect x="' + bx.toFixed(1) + '" y="' + by + '" width="9.5" height="' + bh + '" rx="1.5" fill="' + barFill + '"/>';
          var tx = bx + 4.75;
          var ty = chartY + chartH - Math.round((tempVals[i] / 32) * 130);
          tempPts.push(tx.toFixed(1) + ',' + ty);
          if (i === 0 || i === 6 || i === 11) {
            barSvg += '<text x="' + tx.toFixed(1) + '" y="' + (chartY + chartH + 14) + '" text-anchor="middle" font-size="9.5" font-weight="700" fill="#475569" font-family="' + FONT_STACK + '">' + (i + 1) + '月</text>';
          }
        }
        var tempLine = '<polyline points="' + tempPts.join(' ') + '" fill="none" stroke="#dc2626" stroke-width="2.4"/>';

        /* 左側風帶季移圖（x=18..404） */
        var leftPanel = '';
        if (season === 'both') {
          leftPanel =
            /* 左半：夏季 */
            '<rect x="18" y="34" width="186" height="218" rx="8" fill="#fff7ed" stroke="#f97316" stroke-width="1.8"/>' +
            '<text x="111" y="54" text-anchor="middle" font-size="12" font-weight="800" fill="#c2410c" font-family="' + FONT_STACK + '">☀️ 夏季（7月北移）</text>' +
            '<rect x="30" y="66" width="162" height="34" rx="6" fill="#dbeafe" stroke="#3b82f6"/>' +
            '<text x="111" y="87" text-anchor="middle" font-size="10.5" font-weight="700" fill="#1d4ed8" font-family="' + FONT_STACK + '">西風帶退至 45°N+</text>' +
            '<rect x="30" y="108" width="162" height="58" rx="6" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/>' +
            '<text x="111" y="128" text-anchor="middle" font-size="11" font-weight="800" fill="#9a3412" font-family="' + FONT_STACK + '">30°N–40°N 目標區</text>' +
            '<text x="111" y="145" text-anchor="middle" font-size="11" font-weight="800" fill="#c2410c" font-family="' + FONT_STACK + '">⬇ 副熱帶高壓籠罩</text>' +
            '<text x="111" y="160" text-anchor="middle" font-size="10" fill="#7c2d12" font-family="' + FONT_STACK + '">下沉增溫・炎熱乾燥</text>' +
            '<rect x="30" y="176" width="162" height="32" rx="6" fill="#fef9c3" stroke="#eab308"/>' +
            '<text x="111" y="196" text-anchor="middle" font-size="10.5" font-weight="700" fill="#854d0e" font-family="' + FONT_STACK + '">☀️ 太陽直射 23.5°N</text>' +
            '<text x="111" y="236" text-anchor="middle" font-size="11" font-weight="800" fill="#c2410c" font-family="' + FONT_STACK + '">→ 結果：夏季乾燥</text>' +

            /* 右半：冬季 */
            '<rect x="214" y="34" width="186" height="218" rx="8" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.8"/>' +
            '<text x="307" y="54" text-anchor="middle" font-size="12" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">🌧️ 冬季（1月南移）</text>' +
            '<rect x="226" y="66" width="162" height="34" rx="6" fill="#e0f2fe" stroke="#0ea5e9"/>' +
            '<text x="307" y="87" text-anchor="middle" font-size="10.5" font-weight="700" fill="#0369a1" font-family="' + FONT_STACK + '">極地高壓・西風南壓</text>' +
            '<rect x="226" y="108" width="162" height="58" rx="6" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>' +
            '<text x="307" y="128" text-anchor="middle" font-size="11" font-weight="800" fill="#0c4a6e" font-family="' + FONT_STACK + '">30°N–40°N 目標區</text>' +
            '<text x="307" y="145" text-anchor="middle" font-size="11" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">↗ 盛行西風吹拂</text>' +
            '<text x="307" y="160" text-anchor="middle" font-size="10" fill="#075985" font-family="' + FONT_STACK + '">海洋水氣・溫和濕潤</text>' +
            '<rect x="226" y="176" width="162" height="32" rx="6" fill="#ffedd5" stroke="#fb923c"/>' +
            '<text x="307" y="196" text-anchor="middle" font-size="10.5" font-weight="700" fill="#9a3412" font-family="' + FONT_STACK + '">副高南退至 20°N 附近</text>' +
            '<text x="307" y="236" text-anchor="middle" font-size="11" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">→ 結果：冬季多雨</text>';
        } else {
          var westY = isSummer ? 42 : 98;
          var subHighY = isSummer ? 104 : 168;
          var sunY = isSummer ? 168 : 226;
          var sunLabel = isSummer ? '☀️ 太陽直射北回歸線（23.5°N）→ 風帶全體北移' : '☀️ 太陽直射南半球（23.5°S）→ 風帶全體南移';

          leftPanel =
            '<rect x="18" y="32" width="382" height="222" rx="8" fill="#ffffff" stroke="#cbd5e1"/>' +
            /* 緯度背景網格 */
            '<line x1="68" y1="54" x2="390" y2="54" stroke="#e2e8f0" stroke-dasharray="3 3"/>' +
            '<line x1="68" y1="100" x2="390" y2="100" stroke="#94a3b8" stroke-dasharray="4 3"/>' +
            '<line x1="68" y1="156" x2="390" y2="156" stroke="#94a3b8" stroke-dasharray="4 3"/>' +
            '<line x1="68" y1="214" x2="390" y2="214" stroke="#e2e8f0" stroke-dasharray="3 3"/>' +
            '<text x="62" y="58" text-anchor="end" font-size="10.5" fill="#64748b" font-family="' + FONT_STACK + '">60°N</text>' +
            '<text x="62" y="104" text-anchor="end" font-size="10.5" font-weight="800" fill="#0f172a" font-family="' + FONT_STACK + '">40°N</text>' +
            '<text x="62" y="160" text-anchor="end" font-size="10.5" font-weight="800" fill="#0f172a" font-family="' + FONT_STACK + '">30°N</text>' +
            '<text x="62" y="218" text-anchor="end" font-size="10.5" fill="#64748b" font-family="' + FONT_STACK + '">10°N</text>' +

            /* 30°N–40°N 地中海氣候目標帶 */
            '<rect x="68" y="100" width="322" height="56" fill="' + (isSummer ? '#ffedd5' : '#e0f2fe') + '" opacity="0.65"/>' +
            '<rect x="292" y="102" width="96" height="52" rx="6" fill="#ffffff" stroke="' + (isSummer ? '#ea580c' : '#0284c7') + '" stroke-width="1.8"/>' +
            '<text x="340" y="122" text-anchor="middle" font-size="11" font-weight="800" fill="#0f172a" font-family="' + FONT_STACK + '">地中海沿岸</text>' +
            '<text x="340" y="142" text-anchor="middle" font-size="11" font-weight="800" fill="' + (isSummer ? '#c2410c' : '#0369a1') + '" font-family="' + FONT_STACK + '">' + (isSummer ? '☀️ 炎熱乾燥' : '🌧️ 溫和有雨') + '</text>' +

            /* 西風帶（動態位置） */
            '<rect x="76" y="' + westY + '" width="206" height="48" rx="8" fill="#bae6fd" stroke="#0284c7" stroke-width="' + (isWinter ? '2.5' : '1.4') + '"/>' +
            '<text x="179" y="' + (westY + 20) + '" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0c4a6e" font-family="' + FONT_STACK + '">↗↗ 盛行西風帶（海風濕潤）</text>' +
            '<text x="179" y="' + (westY + 37) + '" text-anchor="middle" font-size="10.5" fill="#0369a1" font-family="' + FONT_STACK + '">' + (isWinter ? '★ 正吹拂 30°N–40°N 大陸西岸！' : '北移至 45°N–60°N，吹不到地中海') + '</text>' +

            /* 副熱帶高壓帶（動態位置） */
            '<rect x="76" y="' + subHighY + '" width="206" height="48" rx="8" fill="#fed7aa" stroke="#ea580c" stroke-width="' + (isSummer ? '2.5' : '1.4') + '"/>' +
            '<text x="179" y="' + (subHighY + 20) + '" text-anchor="middle" font-size="11.5" font-weight="800" fill="#9a3412" font-family="' + FONT_STACK + '">⬇ H 副熱帶高氣壓（下沉乾燥）</text>' +
            '<text x="179" y="' + (subHighY + 37) + '" text-anchor="middle" font-size="10.5" fill="#c2410c" font-family="' + FONT_STACK + '">' + (isSummer ? '★ 正籠罩 30°N–40°N，晴朗無雨！' : '南退至 20°N–30°N，退出地中海') + '</text>' +

            /* 太陽直射提示條 */
            '<rect x="76" y="' + (sunY === 168 ? 222 : 222) + '" width="310" height="24" rx="12" fill="#fef9c3" stroke="#ca8a04"/>' +
            '<text x="231" y="238" text-anchor="middle" font-size="10.5" font-weight="800" fill="#854d0e" font-family="' + FONT_STACK + '">' + sunLabel + '</text>';
        }

        return (
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="地中海氣候行星風帶季移圖">' +
            '<rect x="0" y="0" width="640" height="270" fill="#f8fafc"/>' +
            '<text x="210" y="22" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0f172a" font-family="' + FONT_STACK + '">30°N–40°N 大陸西岸：風帶季節移動</text>' +
            leftPanel +

            /* 右側溫雨圖 */
            '<rect x="414" y="32" width="212" height="222" rx="8" fill="#ffffff" stroke="#cbd5e1"/>' +
            '<text x="520" y="50" text-anchor="middle" font-size="12" font-weight="800" fill="#0f172a" font-family="' + FONT_STACK + '">典型溫雨圖（夏乾冬雨）</text>' +
            '<line x1="434" y1="210" x2="614" y2="210" stroke="#475569" stroke-width="1.5"/>' +
            '<line x1="434" y1="58" x2="434" y2="210" stroke="#475569" stroke-width="1.5"/>' +
            barSvg +
            tempLine +
            '<text x="520" y="244" text-anchor="middle" font-size="10.5" font-weight="800" fill="' + (isSummer ? '#c2410c' : '#0369a1') + '" font-family="' + FONT_STACK + '">' +
              (isSummer ? '紅線高(熱) × 藍柱低(乾) = 夏乾' : (isWinter ? '紅線低(溫) × 藍柱高(雨) = 冬雨' : '雨量呈「U 字型」＝地中海特徵')) +
            '</text>' +
          '</svg>'
        );
      }

      function render() {
        var controls =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn' + (season === 'summer' ? ' active' : '') + '" data-s="summer">☀️ 北半球夏季：副熱帶高壓北移（乾燥）</button>' +
            '<button type="button" class="hb-vis-btn' + (season === 'winter' ? ' active' : '') + '" data-s="winter">🌧️ 北半球冬季：西風帶南移（多雨）</button>' +
            '<button type="button" class="hb-vis-btn' + (season === 'both' ? ' active' : '') + '" data-s="both">🔄 夏冬雙對照</button>' +
          '</div>';

        var readoutText = '';
        if (season === 'summer') {
          readoutText = '<strong>☀️ 北半球夏季（6–8月）：</strong>太陽直射北回歸線，行星風帶整體<strong>北移</strong>。<strong>副熱帶高壓帶</strong>籠罩 30°N–40°N，氣流下沉增溫、雲量極少，形成<strong>高溫乾燥</strong>的夏季（適合種植耐旱的橄欖、葡萄、柑橘）。';
        } else if (season === 'winter') {
          readoutText = '<strong>🌧️ 北半球冬季（12–2月）：</strong>太陽直射南半球，行星風帶整體<strong>南移</strong>。<strong>盛行西風帶</strong>南壓至 30°N–40°N 大陸西岸，把大西洋／地中海的暖濕水氣吹入陸地，帶來<strong>溫和且充沛的冬雨</strong>。';
        } else {
          readoutText = '<strong>🔄 會考秒殺判讀：</strong>看到溫雨圖呈現<strong>「氣溫高時雨量最少（U型雨量）」</strong>就是<strong>地中海型氣候</strong>！若最高溫在 1 月、雨量集中在 7 月，則是<strong>南半球</strong>地中海氣候（如澳洲伯斯、智利聖地牙哥、南非開普敦）。';
        }

        var table =
          '<table class="hb-vis-table">' +
            '<thead><tr><th>季節（北半球）</th><th>太陽直射與風帶移動</th><th>主導氣壓／風帶</th><th>氣候特徵與作物</th></tr></thead>' +
            '<tbody>' +
              '<tr class="' + (season === 'summer' ? 'vis-row-active' : '') + '"><td>夏季（7月）</td><td>直射北半球 → 風帶北移</td><td>副熱帶高氣壓（下沉）</td><td>炎熱乾燥（橄欖、葡萄、軟木橡樹）</td></tr>' +
              '<tr class="' + (season === 'winter' ? 'vis-row-active' : '') + '"><td>冬季（1月）</td><td>直射南半球 → 風帶南移</td><td>盛行西風帶（迎風）</td><td>溫和多雨（小麥生長季、水利灌溉儲水）</td></tr>' +
            '</tbody>' +
          '</table>';

        el.innerHTML = controls + buildSeasonSvg() + '<div class="hb-vis-readout">' + readoutText + '</div>' + table;
        el.querySelectorAll('[data-s]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            season = btn.getAttribute('data-s');
            render();
          });
        });
      }

      render();
    }
  };

  /* ========================================================================
     4. SOC_7_H1：台灣歷史朝代演進
        台灣四百年政權軸與貿易重心北移地圖
     ======================================================================== */
  global.JuniorHandbookVisuals['SOC_7_H1'] = {
    title: '🎨 台灣四百年政權軸與「貿易重心北移」互動地圖',
    subtitle: '點選五大歷史時期，觀察政治核心、主力港口與出口商品如何由南部台南一路向北推移至台北',
    mount: function (el) {
      var eraIdx = 0;

      var ERAS = [
        {
          id: 0,
          btn: '① 荷西大航海',
          years: '1624–1662',
          hub: '台南安平（熱蘭遮城）',
          portKey: 'tainan',
          exports: '鹿皮（輸日本）、蔗糖（輸波斯／歐洲）',
          keyPolicy: '荷蘭東印度公司（VOC）招募漢人開墾，台灣正式納入世界貿易網；西班牙則短暫據雞籠、淡水。',
          shiftLabel: '南部起點：大員（安平）'
        },
        {
          id: 1,
          btn: '② 鄭氏軍屯',
          years: '1662–1683',
          hub: '承天府（台南）',
          portKey: 'tainan',
          exports: '蔗糖、鹿皮（對日本與東南亞走私貿易）',
          keyPolicy: '鄭成功驅逐荷蘭、寓兵於農（軍屯：左營、林鳳營等），陳永華設孔廟興文教，與清廷海禁對抗。',
          shiftLabel: '漢人政權奠基南部平原'
        },
        {
          id: 2,
          btn: '③ 清領前期',
          years: '1683–1860',
          hub: '一府（台南）二鹿（鹿港）三艋舺（台北）',
          portKey: 'lukang',
          exports: '稻米、蔗糖（銷往中國大陸換取布匹日用品）',
          keyPolicy: '渡台禁令放寬後漢人由南向北開墾，興築八堡圳、瑠公圳，出現掌控兩岸貿易的「郊商」組織。',
          shiftLabel: '重心由南向中北部擴張'
        },
        {
          id: 3,
          btn: '④ 清領開港',
          years: '1860–1895',
          hub: '大稻埕・淡水・基隆（台北建府成首善）',
          portKey: 'taipei',
          exports: '茶葉（烏龍茶輸美）、樟腦（全球賽璐珞原料）、蔗糖',
          keyPolicy: '英法聯軍後開港通商（安平、打狗、淡水、雞籠），茶葉與樟腦產於中北部丘陵，經濟與政治重心正式北移！',
          shiftLabel: '★ 關鍵轉折：經濟政治重心北移台北！'
        },
        {
          id: 4,
          btn: '⑤ 日治建設',
          years: '1895–1945',
          hub: '台北總督府（全台縱貫鐵路串聯基隆—高雄）',
          portKey: 'keelung',
          exports: '蓬萊米、新式糖業（「工業日本、農業台灣」）',
          keyPolicy: '1908 縱貫鐵路通車、嘉南大圳（八田與一）、日月潭水力發電，後期轉向「工業台灣、南進基地」。',
          shiftLabel: '全島交通整合：北政治中心、南重工港'
        }
      ];

      var PORTS = [
        { key: 'keelung', name: '基隆・淡水', x: 162, y: 44, lx: 186, ly: 42 },
        { key: 'taipei', name: '大稻埕・艋舺', x: 146, y: 66, lx: 186, ly: 68 },
        { key: 'lukang', name: '鹿港（中部）', x: 108, y: 126, lx: 186, ly: 126 },
        { key: 'tainan', name: '安平・府城', x: 96, y: 184, lx: 186, ly: 184 },
        { key: 'kaohsiung', name: '打狗（高雄）', x: 108, y: 214, lx: 186, ly: 216 }
      ];

      function buildSvg() {
        var cur = ERAS[eraIdx];
        var portNodes = PORTS.map(function (p) {
          var active = p.key === cur.portKey ||
            (cur.id === 2 && (p.key === 'tainan' || p.key === 'lukang' || p.key === 'taipei')) ||
            (cur.id === 3 && (p.key === 'taipei' || p.key === 'keelung')) ||
            (cur.id === 4 && (p.key === 'keelung' || p.key === 'taipei' || p.key === 'kaohsiung'));
          var main = p.key === cur.portKey;
          return (
            '<line x1="' + p.x + '" y1="' + p.y + '" x2="' + (p.lx - 4) + '" y2="' + p.ly + '" stroke="' + (main ? '#dc2626' : '#94a3b8') + '" stroke-width="' + (main ? '1.8' : '1') + '" stroke-dasharray="3 2"/>' +
            '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + (main ? '6.5' : (active ? '5' : '3.8')) + '" fill="' + (main ? '#dc2626' : (active ? '#0284c7' : '#94a3b8')) + '" stroke="#ffffff" stroke-width="1.5"/>' +
            '<text x="' + p.lx + '" y="' + (p.ly + 4) + '" font-size="' + (main ? '11.5' : '10.5') + '" font-weight="' + (main ? '800' : '600') + '" fill="' + (main ? '#b91c1c' : (active ? '#0369a1' : '#64748b')) + '" font-family="' + FONT_STACK + '">' + p.name + '</text>'
          );
        }).join('');

        /* 北移箭頭進度 */
        var arrowPath = '';
        if (eraIdx >= 2) {
          var endY = eraIdx === 2 ? 124 : (eraIdx === 3 ? 68 : 48);
          arrowPath = '<path d="M74,186 C56,154 62,102 128,' + endY + '" fill="none" stroke="#dc2626" stroke-width="2.8" stroke-dasharray="6 3" marker-end="url(#soc-h1-north)"/>';
        }

        /* 底部時間軸節點 */
        var timelineNodes = ERAS.map(function (er, i) {
          var cx = 312 + i * 74;
          var isCur = i === eraIdx;
          return (
            '<g data-era="' + i + '" style="cursor:pointer;">' +
              '<circle cx="' + cx + '" cy="222" r="' + (isCur ? '8' : '5.5') + '" fill="' + (isCur ? '#0284c7' : (i < eraIdx ? '#38bdf8' : '#cbd5e1')) + '" stroke="#ffffff" stroke-width="2"/>' +
              '<text x="' + cx + '" y="244" text-anchor="middle" font-size="10" font-weight="' + (isCur ? '800' : '600') + '" fill="' + (isCur ? '#0369a1' : '#64748b') + '" font-family="' + FONT_STACK + '">' + er.years.split('–')[0] + '</text>' +
            '</g>'
          );
        }).join('');

        return (
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="台灣四百年政權軸與貿易重心北移地圖">' +
            '<defs>' +
              '<marker id="soc-h1-north" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/>' +
              '</marker>' +
            '</defs>' +
            '<rect x="0" y="0" width="640" height="270" fill="#f8fafc"/>' +

            /* 左側台灣簡圖框 */
            '<rect x="16" y="14" width="256" height="242" rx="10" fill="#e0f2fe" stroke="#7dd3fc"/>' +
            '<text x="30" y="32" font-size="11" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">北 ↑</text>' +
            /* 台灣本島輪廓 */
            '<path d="M164,34 C174,40 176,56 172,72 C168,94 162,124 154,154 C146,184 136,212 126,232 C121,238 116,232 112,222 C102,202 90,178 94,148 C98,118 112,86 132,58 C142,44 154,30 164,34 Z" fill="#bbf7d0" stroke="#15803d" stroke-width="2"/>' +
            arrowPath +
            portNodes +
            '<text x="144" y="246" text-anchor="middle" font-size="10.5" font-weight="800" fill="#b91c1c" font-family="' + FONT_STACK + '">' + esc(cur.shiftLabel) + '</text>' +

            /* 右側時期詳情卡 */
            '<rect x="286" y="14" width="338" height="176" rx="10" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>' +
            '<rect x="286" y="14" width="338" height="36" rx="10" fill="#0284c7"/>' +
            '<rect x="286" y="38" width="338" height="12" fill="#0284c7"/>' +
            '<text x="302" y="37" font-size="13.5" font-weight="800" fill="#ffffff" font-family="' + FONT_STACK + '">' + esc(cur.btn) + '（' + esc(cur.years) + '）</text>' +

            '<text x="302" y="72" font-size="11" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">🏛️ 政權／貿易重心：</text>' +
            '<text x="302" y="90" font-size="12" font-weight="700" fill="#0f172a" font-family="' + FONT_STACK + '">' + esc(cur.hub) + '</text>' +

            '<text x="302" y="116" font-size="11" font-weight="800" fill="#15803d" font-family="' + FONT_STACK + '">📦 主力出口商品：</text>' +
            '<text x="302" y="134" font-size="11.5" font-weight="700" fill="#0f172a" font-family="' + FONT_STACK + '">' + esc(cur.exports) + '</text>' +

            '<rect x="300" y="148" width="310" height="32" rx="6" fill="#fef3c7"/>' +
            '<text x="310" y="168" font-size="11" font-weight="700" fill="#92400e" font-family="' + FONT_STACK + '">💡 重心移轉關鍵：南（糖米）→ 北（茶葉樟腦）</text>' +

            /* 右下時間軸 */
            '<rect x="286" y="198" width="338" height="58" rx="10" fill="#ffffff" stroke="#cbd5e1"/>' +
            '<line x1="312" y1="222" x2="608" y2="222" stroke="#cbd5e1" stroke-width="3"/>' +
            timelineNodes +
          '</svg>'
        );
      }

      function render() {
        var cur = ERAS[eraIdx];
        var controls =
          '<div class="hb-vis-controls">' +
            ERAS.map(function (er, i) {
              return '<button type="button" class="hb-vis-btn' + (eraIdx === i ? ' active' : '') + '" data-era="' + i + '">' + esc(er.btn) + '</button>';
            }).join('') +
          '</div>';

        var readout =
          '<div class="hb-vis-readout">' +
            '<strong>' + esc(cur.btn) + '（' + esc(cur.years) + '）：</strong>' + esc(cur.keyPolicy) +
          '</div>';

        var table =
          '<table class="hb-vis-table">' +
            '<thead><tr><th>時期</th><th>主要中心／港口</th><th>代表出口商品</th></tr></thead>' +
            '<tbody>' +
              ERAS.map(function (er, i) {
                return '<tr class="vis-row-clickable' + (eraIdx === i ? ' vis-row-active' : '') + '" data-era="' + i + '">' +
                  '<td>' + esc(er.btn) + '</td><td>' + esc(er.hub) + '</td><td>' + esc(er.exports) + '</td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>';

        el.innerHTML = controls + buildSvg() + readout + table;
        el.querySelectorAll('[data-era]').forEach(function (node) {
          node.addEventListener('click', function () {
            eraIdx = Number(node.getAttribute('data-era'));
            render();
          });
        });
      }

      render();
    }
  };

  /* ========================================================================
     5. SOC_8_H2：中國歷史版圖與東亞白銀
        400mm 農牧拉鋸軸 ＋ 明清全球白銀流動網
     ======================================================================== */
  global.JuniorHandbookVisuals['SOC_8_H2'] = {
    title: '🎨 400mm 農牧拉鋸軸 × 明清「全球白銀流動網」',
    subtitle: '切換兩大歷史空間圖：看懂長城農牧拉鋸如何塑造版圖，與美洲／日本白銀如何推動一條鞭法',
    mount: function (el) {
      var view = 'border'; // 'border' | 'silver'
      var borderSub = 'han'; // 'han' | 'nomad' | 'trade'
      var silverSub = 'all'; // 'all' | 'america' | 'japan' | 'tax'

      function buildBorderSvg() {
        var isHan = borderSub === 'han';
        var isNomad = borderSub === 'nomad';
        var isTrade = borderSub === 'trade';

        return (
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="400mm等雨量線農牧拉鋸軸">' +
            '<defs>' +
              '<marker id="soc-h2-arr-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#15803d"/>' +
              '</marker>' +
              '<marker id="soc-h2-arr-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#b45309"/>' +
              '</marker>' +
            '</defs>' +

            /* 西北遊牧區 */
            '<polygon points="16,16 490,16 144,254 16,254" fill="' + (isNomad ? '#fde68a' : '#fef3c7') + '"/>' +
            /* 東南農耕區 */
            '<polygon points="490,16 624,16 624,254 144,254" fill="' + (isHan ? '#bbf7d0' : '#dcfce7') + '"/>' +
            '<rect x="16" y="16" width="608" height="238" rx="10" fill="none" stroke="#94a3b8" stroke-width="1.5"/>' +

            /* 400mm 等雨量線 / 長城帶 */
            '<line x1="484" y1="20" x2="148" y2="250" stroke="#dc2626" stroke-width="' + (isTrade ? '5' : '3.5') + '" stroke-dasharray="10 5"/>' +
            '<rect x="208" y="114" width="218" height="32" rx="16" fill="#dc2626"/>' +
            '<text x="317" y="135" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff" font-family="' + FONT_STACK + '">🧱 400mm 等雨量線（長城帶）</text>' +

            /* 西北區文字 */
            '<text x="150" y="54" text-anchor="middle" font-size="14" font-weight="800" fill="#92400e" font-family="' + FONT_STACK + '">🐎 草原遊牧區（＜ 400mm）</text>' +
            '<text x="150" y="76" text-anchor="middle" font-size="11.5" fill="#78350f" font-family="' + FONT_STACK + '">匈奴・鮮卑・突厥・契丹・蒙古</text>' +
            '<text x="150" y="96" text-anchor="middle" font-size="11" fill="#b45309" font-family="' + FONT_STACK + '">氣候轉冷乾旱時 → 騎兵南下牧馬</text>' +

            /* 東南區文字 */
            '<text x="484" y="176" text-anchor="middle" font-size="14" font-weight="800" fill="#166534" font-family="' + FONT_STACK + '">🌾 華夏農耕區（＞ 400mm）</text>' +
            '<text x="484" y="198" text-anchor="middle" font-size="11.5" fill="#14532d" font-family="' + FONT_STACK + '">秦漢・隋唐・宋・明（黃河・長江）</text>' +
            '<text x="484" y="218" text-anchor="middle" font-size="11" fill="#15803d" font-family="' + FONT_STACK + '">國力強盛時 → 築長城、通西域屯田</text>' +

            /* 動態推演箭頭 */
            (isHan
              ? '<path d="M416,178 L340,118" stroke="#15803d" stroke-width="4" marker-end="url(#soc-h2-arr-green)"/>' +
                '<rect x="372" y="64" width="218" height="36" rx="8" fill="#ffffff" stroke="#15803d" stroke-width="2"/>' +
                '<text x="481" y="86" text-anchor="middle" font-size="11.5" font-weight="800" fill="#15803d" font-family="' + FONT_STACK + '">農耕北進：漢設河西四郡・唐滅突厥</text>'
              : '') +
            (isNomad
              ? '<path d="M214,104 L286,162" stroke="#b45309" stroke-width="4" marker-end="url(#soc-h2-arr-amber)"/>' +
                '<rect x="34" y="196" width="230" height="36" rx="8" fill="#ffffff" stroke="#b45309" stroke-width="2"/>' +
                '<text x="149" y="218" text-anchor="middle" font-size="11.5" font-weight="800" fill="#b45309" font-family="' + FONT_STACK + '">遊牧南下：五胡・遼金・元清入主中原</text>'
              : '') +
            (isTrade
              ? '<rect x="190" y="162" width="256" height="44" rx="8" fill="#ffffff" stroke="#dc2626" stroke-width="2"/>' +
                '<text x="318" y="181" text-anchor="middle" font-size="11.5" font-weight="800" fill="#b91c1c" font-family="' + FONT_STACK + '">🤝 和戰交替：茶馬互市（以茶絹換戰馬）</text>' +
                '<text x="318" y="198" text-anchor="middle" font-size="10.5" fill="#475569" font-family="' + FONT_STACK + '">長城不只是軍事防線，更是農牧經濟交換帶</text>'
              : '') +
          '</svg>'
        );
      }

      function buildSilverSvg() {
        var hiAm = silverSub === 'all' || silverSub === 'america';
        var hiJp = silverSub === 'all' || silverSub === 'japan';
        var hiTax = silverSub === 'all' || silverSub === 'tax';

        return (
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="明清全球白銀流動網">' +
            '<defs>' +
              '<marker id="soc-h2-s-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#0284c7"/>' +
              '</marker>' +
              '<marker id="soc-h2-s-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#d97706"/>' +
              '</marker>' +
              '<marker id="soc-h2-s-green" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#16a34a"/>' +
              '</marker>' +
              '<marker id="soc-h2-s-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#7c3aed"/>' +
              '</marker>' +
            '</defs>' +

            '<rect x="0" y="0" width="640" height="270" fill="#f8fafc"/>' +
            '<text x="320" y="22" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0f172a" font-family="' + FONT_STACK + '">16–18 世紀「白銀帝國」：全球白銀匯流中國與稅制變革</text>' +

            /* 美洲白銀節點 */
            '<g opacity="' + (hiAm ? '1' : '0.32') + '">' +
              '<rect x="18" y="54" width="144" height="68" rx="10" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>' +
              '<text x="90" y="78" text-anchor="middle" font-size="12.5" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">🌎 美洲銀礦</text>' +
              '<text x="90" y="96" text-anchor="middle" font-size="10.5" fill="#0c4a6e" font-family="' + FONT_STACK + '">秘魯波托西・墨西哥</text>' +
              '<text x="90" y="112" text-anchor="middle" font-size="10" fill="#475569" font-family="' + FONT_STACK + '">西班牙殖民開採</text>' +

              /* 馬尼拉中轉 */
              '<rect x="52" y="176" width="148" height="58" rx="10" fill="#f0f9ff" stroke="#38bdf8" stroke-width="1.8"/>' +
              '<text x="126" y="198" text-anchor="middle" font-size="12" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">⛵ 馬尼拉（菲）</text>' +
              '<text x="126" y="216" text-anchor="middle" font-size="10.5" fill="#475569" font-family="' + FONT_STACK + '">大帆船貿易中繼站</text>' +

              '<path d="M90,124 L112,172" stroke="#0284c7" stroke-width="3" marker-end="url(#soc-h2-s-blue)"/>' +
              '<path d="M202,196 L286,154" stroke="#0284c7" stroke-width="3.2" marker-end="url(#soc-h2-s-blue)"/>' +
              '<text x="240" y="192" text-anchor="middle" font-size="10.5" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">白銀流入 🪙</text>' +
            '</g>' +

            /* 日本白銀節點 */
            '<g opacity="' + (hiJp ? '1' : '0.32') + '">' +
              '<rect x="478" y="42" width="144" height="66" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>' +
              '<text x="550" y="65" text-anchor="middle" font-size="12.5" font-weight="800" fill="#92400e" font-family="' + FONT_STACK + '">🗾 日本銀山</text>' +
              '<text x="550" y="83" text-anchor="middle" font-size="10.5" fill="#78350f" font-family="' + FONT_STACK + '">石見銀山・長崎港</text>' +
              '<text x="550" y="99" text-anchor="middle" font-size="10" fill="#92400e" font-family="' + FONT_STACK + '">經葡萄牙澳門／走私</text>' +

              '<path d="M476,84 L416,108" stroke="#d97706" stroke-width="3.2" marker-end="url(#soc-h2-s-amber)"/>' +
              '<text x="454" y="114" text-anchor="middle" font-size="10.5" font-weight="800" fill="#b45309" font-family="' + FONT_STACK + '">白銀 🪙</text>' +
            '</g>' +

            /* 中央明清中國節點 */
            '<rect x="272" y="74" width="144" height="86" rx="12" fill="#fee2e2" stroke="#dc2626" stroke-width="2.6"/>' +
            '<text x="344" y="98" text-anchor="middle" font-size="13.5" font-weight="800" fill="#991b1b" font-family="' + FONT_STACK + '">🏮 明清中國</text>' +
            '<text x="344" y="117" text-anchor="middle" font-size="10.5" font-weight="700" fill="#7f1d1d" font-family="' + FONT_STACK + '">漳州月港・澳門・廣州</text>' +
            '<text x="344" y="135" text-anchor="middle" font-size="10.5" font-weight="800" fill="#15803d" font-family="' + FONT_STACK + '">出口：絲綢・瓷器・茶葉</text>' +
            '<text x="344" y="151" text-anchor="middle" font-size="10" fill="#991b1b" font-family="' + FONT_STACK + '">（全球最大白銀吸收池）</text>' +

            /* 反向商品輸出箭頭 */
            '<path d="M270,104 C228,84 198,82 166,84" fill="none" stroke="#16a34a" stroke-width="2.2" stroke-dasharray="5 3" marker-end="url(#soc-h2-s-green)"/>' +
            '<text x="218" y="76" text-anchor="middle" font-size="10.5" font-weight="800" fill="#15803d" font-family="' + FONT_STACK + '">絲・瓷・茶 🍵</text>' +

            /* 右下：稅制變革 */
            '<g opacity="' + (hiTax ? '1' : '0.32') + '">' +
              '<path d="M366,162 L414,180" stroke="#7c3aed" stroke-width="3" marker-end="url(#soc-h2-s-purple)"/>' +
              '<rect x="378" y="182" width="244" height="72" rx="10" fill="#f5f3ff" stroke="#7c3aed" stroke-width="2"/>' +
              '<text x="500" y="204" text-anchor="middle" font-size="12" font-weight="800" fill="#5b21b6" font-family="' + FONT_STACK + '">📜 白銀貨幣化 → 稅制大變革</text>' +
              '<text x="500" y="224" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b" font-family="' + FONT_STACK + '">明：一條鞭法（張居正・折銀納稅）</text>' +
              '<text x="500" y="242" text-anchor="middle" font-size="11" font-weight="700" fill="#1e293b" font-family="' + FONT_STACK + '">清：攤丁入畝（丁銀併入田賦・人口暴增）</text>' +
            '</g>' +
          '</svg>'
        );
      }

      function render() {
        var topControls =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn' + (view === 'border' ? ' active' : '') + '" data-v="border">🐎 400mm 農牧拉鋸軸</button>' +
            '<button type="button" class="hb-vis-btn' + (view === 'silver' ? ' active' : '') + '" data-v="silver">🪙 明清全球白銀流動網</button>' +
          '</div>';

        var subControls = '';
        var svgHtml = '';
        var readout = '';
        var table = '';

        if (view === 'border') {
          subControls =
            '<div class="hb-vis-controls">' +
              '<button type="button" class="hb-vis-btn' + (borderSub === 'han' ? ' active' : '') + '" data-bs="han">🌾 農耕強盛北進（漢唐）</button>' +
              '<button type="button" class="hb-vis-btn' + (borderSub === 'nomad' ? ' active' : '') + '" data-bs="nomad">🐎 遊牧南下入主（魏晉／元清）</button>' +
              '<button type="button" class="hb-vis-btn' + (borderSub === 'trade' ? ' active' : '') + '" data-bs="trade">🤝 長城互市交錯帶</button>' +
            '</div>';
          svgHtml = buildBorderSvg();
          if (borderSub === 'han') {
            readout = '<strong>🌾 農耕擴張期（漢・唐）：</strong>中原王朝國力強大時越過 400mm 線，漢武帝設河西四郡通西域，唐太宗被尊為「天可汗」，勢力深入草原與綠洲。';
          } else if (borderSub === 'nomad') {
            readout = '<strong>🐎 遊牧南下期（魏晉・遼金・元・清）：</strong>當草原氣候轉冷乾旱或中原內亂，北方民族憑藉騎兵南下，形成胡漢融合，清朝更以「理藩院」整合蒙藏新疆。';
          } else {
            readout = '<strong>🤝 400mm 線與茶馬互市：</strong>年雨量 400mm 是農耕與遊牧的生態分界，長城沿線既是軍事防線，也是中原茶葉絲綢與草原馬匹毛皮的貿易帶。';
          }
          table =
            '<table class="hb-vis-table">' +
              '<thead><tr><th>區域</th><th>年降水量</th><th>核心生計與歷史互動</th></tr></thead>' +
              '<tbody>' +
                '<tr class="' + (borderSub === 'nomad' ? 'vis-row-active' : '') + '"><td>長城以北／西北</td><td>＜ 400mm</td><td>游牧騎射；缺乏穀物與鐵器茶葉，常透過互市或南下取得物資</td></tr>' +
                '<tr class="' + (borderSub === 'han' ? 'vis-row-win' : '') + '"><td>長城以南／東南</td><td>＞ 400mm</td><td>定居農耕；建立中央集權王朝，藉和親、互市、長城與屯田維繫邊防</td></tr>' +
              '</tbody>' +
            '</table>';
        } else {
          subControls =
            '<div class="hb-vis-controls">' +
              '<button type="button" class="hb-vis-btn' + (silverSub === 'all' ? ' active' : '') + '" data-ss="all">🌐 全球白銀總覽</button>' +
              '<button type="button" class="hb-vis-btn' + (silverSub === 'america' ? ' active' : '') + '" data-ss="america">🌎 美洲→馬尼拉線</button>' +
              '<button type="button" class="hb-vis-btn' + (silverSub === 'japan' ? ' active' : '') + '" data-ss="japan">🗾 日本→澳門線</button>' +
              '<button type="button" class="hb-vis-btn' + (silverSub === 'tax' ? ' active' : '') + '" data-ss="tax">📜 一條鞭法與攤丁入畝</button>' +
            '</div>';
          svgHtml = buildSilverSvg();
          if (silverSub === 'america') {
            readout = '<strong>🌎 美洲白銀線：</strong>西班牙開採秘魯波托西與墨西哥銀礦，藉「馬尼拉大帆船」橫渡太平洋運至菲律賓，再與福建漳州海商換取中國生絲、瓷器與茶葉。';
          } else if (silverSub === 'japan') {
            readout = '<strong>🗾 日本白銀線：</strong>16 世紀日本石見銀山產量大增，葡萄牙人據澳門充當仲介（日銀換中絲），促成東亞海域龐大白銀流動。';
          } else if (silverSub === 'tax') {
            readout = '<strong>📜 白銀如何改變中國稅制：</strong>大量白銀流入使白銀成為通用貨幣，明末張居正推行<strong>一條鞭法</strong>（賦役合一、折銀繳納），清代進一步推行<strong>攤丁入畝</strong>（廢除人頭稅），間接促成清代人口大爆發！';
          } else {
            readout = '<strong>🌐 16–18 世紀全球化真相：</strong>明清雖有海禁或一口通商，卻因絲綢、瓷器、茶葉享譽全球，吸納了當時世界近半數白銀，把中國與美洲、歐洲、日本緊密相連。';
          }
          table =
            '<table class="hb-vis-table">' +
              '<thead><tr><th>白銀路線／制度</th><th>關鍵節點</th><th>歷史影響</th></tr></thead>' +
              '<tbody>' +
                '<tr class="' + (silverSub === 'america' ? 'vis-row-active' : '') + '"><td>太平洋大帆船貿易</td><td>美洲銀礦 → 馬尼拉 → 中國東南沿海</td><td>帶動中國絲瓷茶出口與美洲作物（番薯玉米）傳入</td></tr>' +
                '<tr class="' + (silverSub === 'japan' ? 'vis-row-active' : '') + '"><td>東亞海域中轉貿易</td><td>日本石見銀山 → 澳門／長崎 → 中國</td><td>促使東亞白銀供給大增，商業市鎮興起</td></tr>' +
                '<tr class="' + (silverSub === 'tax' ? 'vis-row-win' : '') + '"><td>明清賦稅白銀化</td><td>一條鞭法（明）→ 攤丁入畝（清）</td><td>簡化稅制、減輕無地農民人頭稅負擔</td></tr>' +
              '</tbody>' +
            '</table>';
        }

        el.innerHTML = topControls + subControls + svgHtml + '<div class="hb-vis-readout">' + readout + '</div>' + table;

        el.querySelectorAll('[data-v]').forEach(function (b) {
          b.addEventListener('click', function () { view = b.getAttribute('data-v'); render(); });
        });
        el.querySelectorAll('[data-bs]').forEach(function (b) {
          b.addEventListener('click', function () { borderSub = b.getAttribute('data-bs'); render(); });
        });
        el.querySelectorAll('[data-ss]').forEach(function (b) {
          b.addEventListener('click', function () { silverSub = b.getAttribute('data-ss'); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     6. SOC_9_H3：世界近代變革、大戰與冷戰
        近代世界史因果骨牌圖（工業革命 → 新帝國主義 → 一戰凡爾賽 → 1929大恐慌 → 二戰 → 冷戰）
     ======================================================================== */
  global.JuniorHandbookVisuals['SOC_9_H3'] = {
    title: '🎨 近代世界史「六大因果骨牌」連鎖推演圖',
    subtitle: '點選每一張骨牌或播放連鎖動畫，看清 18 世紀到 20 世紀重大事件如何環環相扣',
    mount: function (el) {
      var activeIdx = 0;
      var timer = null;

      var DOMINOES = [
        {
          id: 0,
          year: '18C 中',
          short1: '工業革命',
          short2: '蒸汽量產',
          color: '#0284c7',
          bg: '#e0f2fe',
          causeTitle: '工業革命（英國起源）',
          linkText: '機器量產急需「海外原料＋商品市場」',
          nextTitle: '推動新帝國主義瓜分世界',
          detail: '蒸汽機與工廠制讓歐洲產能暴增，資本家急需廉價原物料與海外傾銷市場，加上輪船、鐵路與機槍優勢，促成 19 世紀末列強瓜分亞非。'
        },
        {
          id: 1,
          year: '19C 末',
          short1: '新帝國',
          short2: '瓜分亞非',
          color: '#7c3aed',
          bg: '#f3e8ff',
          causeTitle: '新帝國主義與同盟對立',
          linkText: '殖民地爭奪＋巴爾幹火藥庫＋軍備競賽',
          nextTitle: '1914 塞拉耶佛事件引爆一戰',
          detail: '歐陸形成「三國同盟（德奧義）」與「三國協約（英法俄）」兩大軍事集團，1914 年奧匈王儲遇刺牽一髮動全身，全面爆發第一次世界大戰。'
        },
        {
          id: 2,
          year: '1914–19',
          short1: '一戰與',
          short2: '凡爾賽約',
          color: '#b45309',
          bg: '#fef3c7',
          causeTitle: '第一次世界大戰與凡爾賽條約',
          linkText: '苛刻賠款＋歐洲債台高築＋美國信用泡沫',
          nextTitle: '埋下 1929 全球經濟大恐慌與德人復仇心',
          detail: '凡爾賽條約嚴懲德國（割地、限武、天價賠款），歐洲經濟高度依賴美國貸款，一旦美國股市崩盤，全球金融鏈隨即斷裂！'
        },
        {
          id: 3,
          year: '1929',
          short1: '經濟',
          short2: '大恐慌',
          color: '#dc2626',
          bg: '#fee2e2',
          causeTitle: '1929 紐約華爾街股災',
          linkText: '大量失業＋民主政府失靈＋極權法西斯崛起',
          nextTitle: '希特勒・墨索里尼・日本軍國對外侵略（二戰）',
          detail: '大恐慌席捲全球：美國採「羅斯福新政」以政府干預救經濟；德、義、日卻轉向極權與軍國主義，英法姑息政策更助長希特勒野心。'
        },
        {
          id: 4,
          year: '1939–45',
          short1: '第二次',
          short2: '世界大戰',
          color: '#991b1b',
          bg: '#fecaca',
          causeTitle: '第二次世界大戰（軸心 vs 同盟）',
          linkText: '英法老帝國元氣大傷＋美蘇瓜分戰後勢力',
          nextTitle: '兩大超強意識形態對立 → 冷戰兩極格局',
          detail: '1939 德軍閃擊波蘭開戰、1941 珍珠港事件美國參戰、1945 原子彈促日本投降。戰後成立「聯合國」，但美蘇立刻陷入意識形態對峙。'
        },
        {
          id: 5,
          year: '1947–91',
          short1: '冷戰兩極',
          short2: '美蘇對峙',
          color: '#0f766e',
          bg: '#ccfbf1',
          causeTitle: '美蘇冷戰（北約 vs 華沙公約）',
          linkText: '代理人戰爭（韓戰／越戰）＋軍備太空競賽',
          nextTitle: '1991 蘇聯解體 → 冷戰結束、邁向多極全球化',
          detail: '美國以「馬歇爾計畫、北約、圍堵政策（含台灣第一島鏈）」對抗蘇聯「華沙公約」。1989 柏林圍牆倒塌、1991 蘇聯解體，冷戰落幕。'
        }
      ];

      function clearTimer() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      function buildSvg() {
        var cur = DOMINOES[activeIdx];
        var cards = DOMINOES.map(function (d, i) {
          var x = 22 + i * 102;
          var isCur = i === activeIdx;
          var fallen = i < activeIdx;
          var rot = isCur ? 'rotate(6 ' + (x + 42) + ' 156)' : (fallen ? 'rotate(11 ' + (x + 42) + ' 156)' : '');
          var arrow = '';
          if (i < DOMINOES.length - 1) {
            var linkActive = i === activeIdx;
            arrow =
              '<path d="M' + (x + 74) + ',44 Q' + (x + 92) + ',22 ' + (x + 110) + ',44" fill="none" stroke="' + (linkActive ? '#dc2626' : '#cbd5e1') + '" stroke-width="' + (linkActive ? '3' : '1.8') + '" marker-end="url(#soc-h3-arr' + (linkActive ? '-on' : '') + ')"/>';
          }
          return (
            arrow +
            '<g data-didx="' + i + '" transform="' + rot + '" style="cursor:pointer;">' +
              '<rect x="' + x + '" y="52" width="84" height="106" rx="9" fill="' + (isCur ? d.color : d.bg) + '" stroke="' + d.color + '" stroke-width="' + (isCur ? '3' : '1.6') + '"/>' +
              '<circle cx="' + (x + 42) + '" cy="72" r="11" fill="' + (isCur ? '#ffffff' : d.color) + '"/>' +
              '<text x="' + (x + 42) + '" y="76" text-anchor="middle" font-size="11.5" font-weight="800" fill="' + (isCur ? d.color : '#ffffff') + '" font-family="' + FONT_STACK + '">' + (i + 1) + '</text>' +
              '<text x="' + (x + 42) + '" y="98" text-anchor="middle" font-size="10" font-weight="700" fill="' + (isCur ? '#f8fafc' : '#475569') + '" font-family="' + FONT_STACK + '">' + esc(d.year) + '</text>' +
              '<text x="' + (x + 42) + '" y="121" text-anchor="middle" font-size="12.5" font-weight="800" fill="' + (isCur ? '#ffffff' : '#0f172a') + '" font-family="' + FONT_STACK + '">' + esc(d.short1) + '</text>' +
              '<text x="' + (x + 42) + '" y="140" text-anchor="middle" font-size="11.5" font-weight="700" fill="' + (isCur ? '#f1f5f9' : '#334155') + '" font-family="' + FONT_STACK + '">' + esc(d.short2) + '</text>' +
            '</g>'
          );
        }).join('');

        return (
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="近代世界史因果骨牌圖">' +
            '<defs>' +
              '<marker id="soc-h3-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#94a3b8"/>' +
              '</marker>' +
              '<marker id="soc-h3-arr-on" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/>' +
              '</marker>' +
            '</defs>' +
            '<rect x="0" y="0" width="640" height="270" fill="#f8fafc"/>' +
            '<line x1="18" y1="164" x2="622" y2="164" stroke="#cbd5e1" stroke-width="2"/>' +
            cards +

            /* 底部因果鏈解說框 */
            '<rect x="18" y="178" width="604" height="78" rx="10" fill="#ffffff" stroke="' + cur.color + '" stroke-width="2.2"/>' +
            '<rect x="28" y="188" width="168" height="58" rx="8" fill="' + cur.bg + '"/>' +
            '<text x="112" y="210" text-anchor="middle" font-size="10.5" font-weight="800" fill="' + cur.color + '" font-family="' + FONT_STACK + '">目前骨牌 #' + (activeIdx + 1) + '</text>' +
            '<text x="112" y="230" text-anchor="middle" font-size="11.5" font-weight="800" fill="#0f172a" font-family="' + FONT_STACK + '">' + esc(cur.short1 + cur.short2) + '</text>' +

            '<path d="M202,217 L424,217" stroke="#dc2626" stroke-width="2.5" marker-end="url(#soc-h3-arr-on)"/>' +
            '<rect x="210" y="191" width="204" height="22" rx="6" fill="#fef2f2"/>' +
            '<text x="312" y="206" text-anchor="middle" font-size="10.5" font-weight="800" fill="#b91c1c" font-family="' + FONT_STACK + '">因果推力</text>' +
            '<text x="312" y="238" text-anchor="middle" font-size="10.5" font-weight="700" fill="#334155" font-family="' + FONT_STACK + '">' + esc(cur.linkText) + '</text>' +

            '<rect x="434" y="188" width="178" height="58" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/>' +
            '<text x="523" y="208" text-anchor="middle" font-size="10.5" font-weight="800" fill="#475569" font-family="' + FONT_STACK + '">引爆下一事件</text>' +
            '<text x="523" y="229" text-anchor="middle" font-size="11" font-weight="800" fill="#0f172a" font-family="' + FONT_STACK + '">' + esc(cur.nextTitle.length > 14 ? cur.nextTitle.slice(0, 14) + '…' : cur.nextTitle) + '</text>' +
          '</svg>'
        );
      }

      function render() {
        var cur = DOMINOES[activeIdx];
        var controls =
          '<div class="hb-vis-controls">' +
            DOMINOES.map(function (d, i) {
              return '<button type="button" class="hb-vis-btn' + (activeIdx === i ? ' active' : '') + '" data-didx="' + i + '">' + (i + 1) + '. ' + esc(d.short1) + '</button>';
            }).join('') +
            '<button type="button" class="hb-vis-btn" data-dplay="1">▶ 骨牌連鎖播放</button>' +
          '</div>';

        var readout =
          '<div class="hb-vis-readout">' +
            '<strong>' + esc(cur.causeTitle) + ' → ' + esc(cur.nextTitle) + '</strong><br>' +
            esc(cur.detail) +
          '</div>';

        var table =
          '<table class="hb-vis-table">' +
            '<thead><tr><th>順序</th><th>時代</th><th>歷史轉折</th><th>對下一事件的關鍵推力</th></tr></thead>' +
            '<tbody>' +
              DOMINOES.map(function (d, i) {
                return '<tr class="vis-row-clickable' + (activeIdx === i ? ' vis-row-active' : '') + '" data-didx="' + i + '">' +
                  '<td>#' + (i + 1) + '</td><td>' + esc(d.year) + '</td><td>' + esc(d.causeTitle) + '</td><td>' + esc(d.linkText) + '</td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>';

        el.innerHTML = controls + buildSvg() + readout + table;

        el.querySelectorAll('[data-didx]').forEach(function (node) {
          node.addEventListener('click', function () {
            clearTimer();
            activeIdx = Number(node.getAttribute('data-didx'));
            render();
          });
        });

        var playBtn = el.querySelector('[data-dplay]');
        if (playBtn) {
          playBtn.addEventListener('click', function () {
            clearTimer();
            activeIdx = 0;
            render();
            timer = setInterval(function () {
              activeIdx += 1;
              if (activeIdx >= DOMINOES.length) {
                activeIdx = DOMINOES.length - 1;
                clearTimer();
              }
              render();
            }, 1400);
          });
        }
      }

      render();
      return clearTimer;
    }
  };

  /* ========================================================================
     7. SOC_7_C1：社會規範與法律基礎
        法律位階金字塔（憲法 ＞ 法律 ＞ 命令） ＋ 三秒法律分流互動檢測器
     ======================================================================== */
  global.JuniorHandbookVisuals['SOC_7_C1'] = {
    title: '🎨 法律位階金字塔 × 三秒法律責任分流檢測器',
    subtitle: '切換「位階金字塔」與「情境檢測器」，秒辨憲法／法律／命令與民、刑、行政、少年四大責任',
    mount: function (el) {
      var mode = 'triage'; // 'pyramid' | 'triage'
      var tier = 'const';  // 'const' | 'law' | 'order'
      var caseKey = 'scooter'; // 'scooter' | 'dui' | 'redlight' | 'teen'

      var TIERS = {
        const: {
          btn: '👑 憲法（最高位階）',
          title: '憲法 — 國家根本大法',
          maker: '立法院提修正案（3/4 出席、3/4 決議）→ 公民複決（過半數）',
          names: '中華民國憲法、憲法增修條文',
          rule: '最高性（法律與命令牴觸憲法無效）、原則性、固定性（修憲門檻極高）。',
          example: '憲法保障人民言論自由、人身自由、受國民教育權。'
        },
        law: {
          btn: '📜 法律（立法院三讀）',
          title: '法律 — 民意機關三讀通過',
          maker: '立法院三讀通過，總統公布',
          names: '定名必為「法、律、條例、通則」四種之一',
          rule: '不得牴觸憲法；涉及限制人民自由權利（如罰錢、拘役）須符合「法律保留原則」。',
          example: '民法、刑法、道路交通管理處罰條例、少年事件處理法。'
        },
        order: {
          btn: '📋 命令（行政機關訂定）',
          title: '命令 — 行政機關依法訂定',
          maker: '行政院或各部會、地方政府等行政機關發布',
          names: '常見名稱：規程、規則、細則、辦法、綱要、標準、準則',
          rule: '不得牴觸憲法與法律！優點是彈性高、可快速因應社會細節調整。',
          example: '道路交通安全規則、國民教育法施行細則、各校獎懲實施辦法。'
        }
      };

      var CASES = {
        scooter: {
          btn: '🛵 撞壞鄰居機車',
          sceneLine1: '小華倒車不小心',
          sceneLine2: '撞壞鄰居機車',
          checkText: '侵害私人財產權（無故意毀損犯意）',
          targets: ['civil'],
          verdict: '💼 民事責任（民法侵權行為）',
          detail: '過失毀損他人財物不構成刑法毀損罪（刑法毀損僅罰故意），因此屬於私人間財產紛爭，依《民法》負<strong>損害賠償</strong>或回復原狀責任，可先和解或聲請鄉鎮市區調解。'
        },
        dui: {
          btn: '🍺 酒駕超標被攔查',
          sceneLine1: '阿明酒測值 0.30',
          sceneLine2: '騎車遭警方攔查',
          checkText: '同時觸犯公共危險罪 ＋ 交通違規',
          targets: ['criminal', 'admin'],
          verdict: '🚨 刑事責任（罰金／徒刑）＋ 🏛️ 行政責任（吊扣駕照）',
          detail: '會考超高頻雙重責任題！吐氣酒精濃度達 0.25 mg/L 以上，觸犯《刑法》公共危險罪（<strong>罰金</strong>或有期徒刑、留前科），同時違反《道交條例》須受吊扣駕照等<strong>行政處分</strong>（一行為不二罰下，刑罰優先於罰鍰，但吊扣駕照仍併罰）。'
        },
        redlight: {
          btn: '🚦 闖紅燈未肇事',
          sceneLine1: '騎士趕上班闖紅燈',
          sceneLine2: '被科技執法拍下',
          checkText: '違反交通行政秩序（未致人傷亡）',
          targets: ['admin'],
          verdict: '🏛️ 行政法責任（處「罰鍰」・無前科）',
          detail: '違反《道路交通管理處罰條例》，由監理／警察機關開出罰單，處以<strong>罰鍰</strong>（行政罰），不會留下刑事犯罪紀錄（前科）。若不服可提起行政訴訟！'
        },
        teen: {
          btn: '🎒 15歲少年偷竊',
          sceneLine1: '15 歲國中生在超商',
          sceneLine2: '順手牽羊偷走商品',
          checkText: '觸法年齡 12–18 歲（少年事件處理法）',
          targets: ['juvenile'],
          verdict: '🛡️ 少年保護處分（訓誡・假日生活輔導・保護管束）',
          detail: '12 歲以上未滿 18 歲少年觸法，適用《少年事件處理法》，採<strong>「以保護代替處罰」</strong>原則（非重大最輕本刑 5 年以上之罪），由少年法院裁定保護處分；另父母須負民事連帶賠償！'
        }
      };

      function buildPyramidSvg() {
        var t = TIERS[tier];
        var isC = tier === 'const';
        var isL = tier === 'law';
        var isO = tier === 'order';

        return (
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="法律位階金字塔">' +
            '<rect x="0" y="0" width="640" height="270" fill="#f8fafc"/>' +

            /* 金字塔三層（x中心 175） */
            '<g data-tier="const" style="cursor:pointer;">' +
              '<polygon points="175,24 114,96 236,96" fill="' + (isC ? '#dc2626' : '#fecaca') + '" stroke="#b91c1c" stroke-width="' + (isC ? '3' : '1.5') + '"/>' +
              '<text x="175" y="76" text-anchor="middle" font-size="14" font-weight="800" fill="' + (isC ? '#ffffff' : '#991b1b') + '" font-family="' + FONT_STACK + '">憲法</text>' +
            '</g>' +

            '<g data-tier="law" style="cursor:pointer;">' +
              '<polygon points="108,104 242,104 282,172 68,172" fill="' + (isL ? '#0284c7' : '#bae6fd') + '" stroke="#0369a1" stroke-width="' + (isL ? '3' : '1.5') + '"/>' +
              '<text x="175" y="136" text-anchor="middle" font-size="14" font-weight="800" fill="' + (isL ? '#ffffff' : '#0c4a6e') + '" font-family="' + FONT_STACK + '">法律</text>' +
              '<text x="175" y="156" text-anchor="middle" font-size="10.5" font-weight="700" fill="' + (isL ? '#e0f2fe' : '#0369a1') + '" font-family="' + FONT_STACK + '">法・律・條例・通則</text>' +
            '</g>' +

            '<g data-tier="order" style="cursor:pointer;">' +
              '<polygon points="62,180 288,180 326,246 24,246" fill="' + (isO ? '#16a34a' : '#bbf7d0') + '" stroke="#15803d" stroke-width="' + (isO ? '3' : '1.5') + '"/>' +
              '<text x="175" y="210" text-anchor="middle" font-size="14" font-weight="800" fill="' + (isO ? '#ffffff' : '#14532d') + '" font-family="' + FONT_STACK + '">命令</text>' +
              '<text x="175" y="230" text-anchor="middle" font-size="10.5" font-weight="700" fill="' + (isO ? '#dcfce7' : '#166534') + '" font-family="' + FONT_STACK + '">規程・規則・細則・辦法</text>' +
            '</g>' +

            /* 右側說明卡 */
            '<rect x="348" y="22" width="274" height="226" rx="10" fill="#ffffff" stroke="#0284c7" stroke-width="2"/>' +
            '<rect x="348" y="22" width="274" height="36" rx="10" fill="' + (isC ? '#dc2626' : (isL ? '#0284c7' : '#16a34a')) + '"/>' +
            '<rect x="348" y="46" width="274" height="12" fill="' + (isC ? '#dc2626' : (isL ? '#0284c7' : '#16a34a')) + '"/>' +
            '<text x="485" y="45" text-anchor="middle" font-size="13" font-weight="800" fill="#ffffff" font-family="' + FONT_STACK + '">' + esc(t.title) + '</text>' +

            '<text x="364" y="80" font-size="11" font-weight="800" fill="#475569" font-family="' + FONT_STACK + '">🏛️ 制定／修改程序：</text>' +
            '<text x="364" y="98" font-size="11" font-weight="700" fill="#0f172a" font-family="' + FONT_STACK + '">' + esc(t.maker.slice(0, 22)) + '</text>' +
            (t.maker.length > 22 ? '<text x="364" y="114" font-size="11" font-weight="700" fill="#0f172a" font-family="' + FONT_STACK + '">' + esc(t.maker.slice(22)) + '</text>' : '') +

            '<text x="364" y="140" font-size="11" font-weight="800" fill="#475569" font-family="' + FONT_STACK + '">🏷️ 法規名稱識別：</text>' +
            '<text x="364" y="158" font-size="11" font-weight="700" fill="#0369a1" font-family="' + FONT_STACK + '">' + esc(t.names) + '</text>' +

            '<rect x="362" y="176" width="246" height="58" rx="8" fill="#fef3c7" stroke="#f59e0b"/>' +
            '<text x="372" y="196" font-size="11" font-weight="800" fill="#92400e" font-family="' + FONT_STACK + '">⚖️ 鐵則：下位法不得牴觸上位法</text>' +
            '<text x="372" y="216" font-size="10.5" fill="#78350f" font-family="' + FONT_STACK + '">憲法 ＞ 法律 ＞ 命令（牴觸者無效）</text>' +
          '</svg>'
        );
      }

      function buildTriageSvg() {
        var c = CASES[caseKey];
        var has = function (k) { return c.targets.indexOf(k) !== -1; };

        var branches = [
          { key: 'civil', y: 20, label: '💼 民法責任', sub: '損害賠償・恢復原狀（和解／調解）', color: '#0284c7', bg: '#e0f2fe' },
          { key: 'criminal', y: 80, label: '🚨 刑法責任', sub: '罰金・拘役・徒刑（留犯罪前科）', color: '#dc2626', bg: '#fee2e2' },
          { key: 'admin', y: 140, label: '🏛️ 行政法責任', sub: '罰鍰・吊扣駕照（不留刑事前科）', color: '#d97706', bg: '#fef3c7' },
          { key: 'juvenile', y: 200, label: '🛡️ 少年保護處分', sub: '12–18 歲優先保護管束・假日輔導', color: '#7c3aed', bg: '#f3e8ff' }
        ];

        var lines = branches.map(function (b) {
          var on = has(b.key);
          var ty = b.y + 26;
          return '<path d="M326,135 C354,135 352,' + ty + ' 376,' + ty + '" fill="none" stroke="' + (on ? b.color : '#cbd5e1') + '" stroke-width="' + (on ? '3.5' : '1.5') + '"' + (on ? ' marker-end="url(#soc-c1-arr)"' : '') + '/>';
        }).join('');

        var cards = branches.map(function (b) {
          var on = has(b.key);
          return (
            '<g opacity="' + (on ? '1' : '0.35') + '">' +
              '<rect x="380" y="' + b.y + '" width="242" height="52" rx="9" fill="' + (on ? b.bg : '#ffffff') + '" stroke="' + (on ? b.color : '#cbd5e1') + '" stroke-width="' + (on ? '2.5' : '1.2') + '"/>' +
              '<text x="394" y="' + (b.y + 22) + '" font-size="12.5" font-weight="800" fill="' + (on ? b.color : '#475569') + '" font-family="' + FONT_STACK + '">' + b.label + (on ? ' ✔' : '') + '</text>' +
              '<text x="394" y="' + (b.y + 40) + '" font-size="10.5" fill="#334155" font-family="' + FONT_STACK + '">' + b.sub + '</text>' +
            '</g>'
          );
        }).join('');

        return (
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="三秒法律責任分流互動檢測器">' +
            '<defs>' +
              '<marker id="soc-c1-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">' +
                '<path d="M0,1 L9,5 L0,9 Z" fill="#0f172a"/>' +
              '</marker>' +
            '</defs>' +
            '<rect x="0" y="0" width="640" height="270" fill="#f8fafc"/>' +

            /* 左側情境卡 */
            '<rect x="18" y="68" width="154" height="134" rx="10" fill="#ffffff" stroke="#0284c7" stroke-width="2.2"/>' +
            '<rect x="18" y="68" width="154" height="32" rx="10" fill="#0284c7"/>' +
            '<rect x="18" y="88" width="154" height="12" fill="#0284c7"/>' +
            '<text x="95" y="89" text-anchor="middle" font-size="11.5" font-weight="800" fill="#ffffff" font-family="' + FONT_STACK + '">📌 真實生活情境</text>' +
            '<text x="95" y="132" text-anchor="middle" font-size="13" font-weight="800" fill="#0f172a" font-family="' + FONT_STACK + '">' + esc(c.sceneLine1) + '</text>' +
            '<text x="95" y="154" text-anchor="middle" font-size="13" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">' + esc(c.sceneLine2) + '</text>' +
            '<text x="95" y="186" text-anchor="middle" font-size="10" font-weight="700" fill="#64748b" font-family="' + FONT_STACK + '">點上方按鈕切換情境</text>' +

            /* 連接到中間檢核漏斗 */
            '<line x1="172" y1="135" x2="202" y2="135" stroke="#0284c7" stroke-width="2.5" marker-end="url(#soc-c1-arr)"/>' +

            /* 中央三秒檢核器 */
            '<polygon points="266,74 328,135 266,196 204,135" fill="#fef3c7" stroke="#d97706" stroke-width="2.2"/>' +
            '<text x="266" y="128" text-anchor="middle" font-size="11.5" font-weight="800" fill="#92400e" font-family="' + FONT_STACK + '">三秒分流</text>' +
            '<text x="266" y="146" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b45309" font-family="' + FONT_STACK + '">公害／私益</text>' +
            '<text x="266" y="162" text-anchor="middle" font-size="10.5" font-weight="700" fill="#b45309" font-family="' + FONT_STACK + '">與年齡檢核</text>' +

            lines +
            cards +
          '</svg>'
        );
      }

      function render() {
        var modeBtns =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn' + (mode === 'triage' ? ' active' : '') + '" data-m="triage">⚖️ 三秒法律分流互動檢測器</button>' +
            '<button type="button" class="hb-vis-btn' + (mode === 'pyramid' ? ' active' : '') + '" data-m="pyramid">🔺 法律位階金字塔（憲法＞法律＞命令）</button>' +
          '</div>';

        var subBtns = '';
        var svgHtml = '';
        var readout = '';
        var table = '';

        if (mode === 'pyramid') {
          subBtns =
            '<div class="hb-vis-controls">' +
              Object.keys(TIERS).map(function (k) {
                return '<button type="button" class="hb-vis-btn' + (tier === k ? ' active' : '') + '" data-tier="' + k + '">' + esc(TIERS[k].btn) + '</button>';
              }).join('') +
            '</div>';
          svgHtml = buildPyramidSvg();
          var t = TIERS[tier];
          readout = '<div class="hb-vis-readout"><strong>' + esc(t.title) + '：</strong>' + esc(t.rule) + '<br><strong>生活實例：</strong>' + esc(t.example) + '</div>';
          table =
            '<table class="hb-vis-table">' +
              '<thead><tr><th>位階</th><th>制定機關</th><th>常見名稱</th></tr></thead>' +
              '<tbody>' +
                '<tr class="vis-row-clickable' + (tier === 'const' ? ' vis-row-active' : '') + '" data-tier="const"><td>① 憲法</td><td>立法院提修憲案 → 公民複決</td><td>憲法、增修條文</td></tr>' +
                '<tr class="vis-row-clickable' + (tier === 'law' ? ' vis-row-active' : '') + '" data-tier="law"><td>② 法律</td><td>立法院三讀、總統公布</td><td>法、律、條例、通則</td></tr>' +
                '<tr class="vis-row-clickable' + (tier === 'order' ? ' vis-row-active' : '') + '" data-tier="order"><td>③ 命令</td><td>行政機關依法訂定發布</td><td>規程、規則、細則、辦法</td></tr>' +
              '</tbody>' +
            '</table>';
        } else {
          subBtns =
            '<div class="hb-vis-controls">' +
              Object.keys(CASES).map(function (k) {
                return '<button type="button" class="hb-vis-btn' + (caseKey === k ? ' active' : '') + '" data-ck="' + k + '">' + esc(CASES[k].btn) + '</button>';
              }).join('') +
            '</div>';
          svgHtml = buildTriageSvg();
          var c = CASES[caseKey];
          readout =
            '<div class="hb-vis-readout">' +
              '<strong>判定結果：' + esc(c.verdict) + '</strong><br>' + c.detail +
            '</div>';
          table =
            '<table class="hb-vis-table">' +
              '<thead><tr><th>常考易混名詞</th><th>所屬法律</th><th>有沒有刑事「前科」？</th></tr></thead>' +
              '<tbody>' +
                '<tr class="' + (caseKey === 'dui' ? 'vis-row-elim' : '') + '"><td>罰金（法院判決）</td><td>刑法（刑事責任）</td><td><strong>有前科</strong>（犯罪紀錄）</td></tr>' +
                '<tr class="' + (caseKey === 'redlight' ? 'vis-row-active' : '') + '"><td>罰鍰（行政機關開單）</td><td>行政法（行政責任）</td><td><strong>無前科</strong>（僅行政處罰）</td></tr>' +
                '<tr class="' + (caseKey === 'scooter' ? 'vis-row-win' : '') + '"><td>損害賠償／違約金</td><td>民法（民事責任）</td><td><strong>無前科</strong>（填補私人損害）</td></tr>' +
              '</tbody>' +
            '</table>';
        }

        el.innerHTML = modeBtns + subBtns + svgHtml + readout + table;
        el.querySelectorAll('[data-m]').forEach(function (b) {
          b.addEventListener('click', function () { mode = b.getAttribute('data-m'); render(); });
        });
        el.querySelectorAll('[data-tier]').forEach(function (b) {
          b.addEventListener('click', function () { tier = b.getAttribute('data-tier'); render(); });
        });
        el.querySelectorAll('[data-ck]').forEach(function (b) {
          b.addEventListener('click', function () { caseKey = b.getAttribute('data-ck'); render(); });
        });
      }

      render();
    }
  };

  /* ========================================================================
     8. SOC_8_C2：政府體制、選舉與民主參與
        我國五權制衡關係箭頭圖
     ======================================================================== */
  global.JuniorHandbookVisuals['SOC_8_C2'] = {
    title: '🎨 我國中央政府「五權分立與制衡關係」互動箭頭圖',
    subtitle: '點選五大憲政制衡機制，看懂總統與五院之間「誰制衡誰、門檻條件與法律後果」',
    mount: function (el) {
      var actKey = 'noconf';

      var ACTIONS = [
        {
          key: 'noconf',
          btn: '🎤 立法院質詢／倒閣',
          from: 'leg',
          to: 'exec',
          shortLabel: '質詢・不信任案（倒閣）',
          threshold: '全體立委 1/3 連署、1/2 以上贊成通過',
          effect: '行政院長須於 10 日內辭職，但得同時呈請總統解散立法院！',
          trap: '注意：立法院是對「行政院長（行政院）」提不信任案，不是對總統提倒閣！'
        },
        {
          key: 'reconsider',
          btn: '↩️ 行政院移請覆議',
          from: 'exec',
          to: 'leg',
          shortLabel: '覆議案（認為窒礙難行）',
          threshold: '經總統核可，移請立法院於 15 日內重新表決',
          effect: '若立法院全體委員 1/2 以上決議「維持原案」，行政院長即應接受該決議。',
          trap: '覆議由行政院發動（須經總統核可），對象是立法院通過的法律案、預算案、條約案。'
        },
        {
          key: 'dissolve',
          btn: '⚡ 總統解散國會',
          from: 'pres',
          to: 'leg',
          shortLabel: '被動解散立法院',
          threshold: '限「立法院通過不信任案後」，經諮詢立法院長',
          effect: '立法院解散後須於 60 日內重新改選立委，交由最新民意裁決！',
          trap: '必考地雷：我國總統「不能主動」解散國會，只能在倒閣通過後「被動」解散！'
        },
        {
          key: 'constit',
          btn: '⚖️ 司法院大法官釋憲',
          from: 'jud',
          to: 'leg',
          shortLabel: '憲法法庭違憲審查',
          threshold: '大法官組成憲法法庭審理（亦審理總統彈劾案）',
          effect: '若立法院法律或行政命令牴觸憲法，大法官可宣告「違憲無效」或限期修法。',
          trap: '補充：總統副總統彈劾案是由「立法院」提案，交由「司法院憲法法庭」審理！'
        },
        {
          key: 'impeach',
          btn: '🔍 監察院彈劾與糾正',
          from: 'ctrl',
          to: 'exec',
          shortLabel: '糾正（對機關）／彈劾（對人）',
          threshold: '對行政院及各部會提「糾正」；對失職公務員提「彈劾」',
          effect: '「糾正案」促請行政機關限期改善；「彈劾案」移送「懲戒法院（司法院）」懲戒！',
          trap: '秒殺口訣：「對事（機關）用糾正、對人（官員）用彈劾」，監察院已不再彈劾總統！'
        }
      ];

      /* 機關座標中心點 */
      var NODES = {
        pres: { x: 245, y: 14, w: 150, h: 46, cx: 320, cy: 37, title: '🏛️ 總統', sub: '元首・任命閣揆' },
        exec: { x: 20, y: 98, w: 156, h: 56, cx: 98, cy: 126, title: '🏢 行政院', sub: '最高行政・編預算' },
        leg:  { x: 464, y: 98, w: 156, h: 56, cx: 542, cy: 126, title: '📜 立法院', sub: '立法・審預算・質詢' },
        jud:  { x: 34, y: 202, w: 170, h: 54, cx: 119, cy: 229, title: '⚖️ 司法院', sub: '大法官釋憲・懲戒' },
        exam: { x: 244, y: 202, w: 152, h: 54, cx: 320, cy: 229, title: '📝 考試院', sub: '國家考試・銓敘' },
        ctrl: { x: 436, y: 202, w: 170, h: 54, cx: 521, cy: 229, title: '🔍 監察院', sub: '彈劾・糾正・審計' }
      };

      function buildArrow(act) {
        if (act.key === 'noconf') {
          return '<path d="M460,114 C380,82 260,82 182,114" fill="none" stroke="#dc2626" stroke-width="3.5" marker-end="url(#soc-c2-arr)"/>';
        }
        if (act.key === 'reconsider') {
          return '<path d="M180,140 C260,170 380,170 458,140" fill="none" stroke="#0284c7" stroke-width="3.5" marker-end="url(#soc-c2-arr-b)"/>';
        }
        if (act.key === 'dissolve') {
          return '<path d="M398,46 C460,54 504,70 526,94" fill="none" stroke="#ea580c" stroke-width="3.5" marker-end="url(#soc-c2-arr-o)"/>';
        }
        if (act.key === 'constit') {
          return (
            '<path d="M184,200 C276,174 374,154 460,136" fill="none" stroke="#7c3aed" stroke-width="3.5" marker-end="url(#soc-c2-arr-p)"/>' +
            '<path d="M106,200 L106,158" fill="none" stroke="#7c3aed" stroke-width="2.6" stroke-dasharray="5 3" marker-end="url(#soc-c2-arr-p)"/>'
          );
        }
        /* impeach */
        return '<path d="M452,200 C360,174 266,154 182,136" fill="none" stroke="#0f766e" stroke-width="3.5" marker-end="url(#soc-c2-arr-t)"/>';
      }

      function buildSvg() {
        var cur = ACTIONS.filter(function (a) { return a.key === actKey; })[0] || ACTIONS[0];

        var nodeHtml = Object.keys(NODES).map(function (k) {
          var n = NODES[k];
          var isFrom = cur.from === k;
          var isTo = cur.to === k || (cur.key === 'constit' && k === 'exec');
          var fill = isFrom ? '#0284c7' : (isTo ? '#fef2f2' : '#ffffff');
          var stroke = isFrom ? '#0369a1' : (isTo ? '#dc2626' : '#cbd5e1');
          var sw = (isFrom || isTo) ? '2.6' : '1.4';
          var titleColor = isFrom ? '#ffffff' : (isTo ? '#991b1b' : '#0f172a');
          var subColor = isFrom ? '#e0f2fe' : '#64748b';
          var tag = isFrom ? '（發動）' : (isTo ? '（受制衡）' : '');

          return (
            '<g>' +
              '<rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" rx="10" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + sw + '"/>' +
              '<text x="' + n.cx + '" y="' + (n.y + 22) + '" text-anchor="middle" font-size="12.5" font-weight="800" fill="' + titleColor + '" font-family="' + FONT_STACK + '">' + n.title + tag + '</text>' +
              '<text x="' + n.cx + '" y="' + (n.y + 40) + '" text-anchor="middle" font-size="10.2" font-weight="600" fill="' + subColor + '" font-family="' + FONT_STACK + '">' + n.sub + '</text>' +
            '</g>'
          );
        }).join('');

        return (
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="我國五權制衡關係箭頭圖">' +
            '<defs>' +
              '<marker id="soc-c2-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#dc2626"/></marker>' +
              '<marker id="soc-c2-arr-b" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#0284c7"/></marker>' +
              '<marker id="soc-c2-arr-o" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#ea580c"/></marker>' +
              '<marker id="soc-c2-arr-p" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#7c3aed"/></marker>' +
              '<marker id="soc-c2-arr-t" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9 Z" fill="#0f766e"/></marker>' +
            '</defs>' +
            '<rect x="0" y="0" width="640" height="270" fill="#f8fafc"/>' +

            /* 制衡箭頭 */
            buildArrow(cur) +

            /* 中央焦點標籤卡（放置於中間空白，絕不遮擋任何院） */
            '<rect x="210" y="102" width="220" height="50" rx="10" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.8"/>' +
            '<text x="320" y="122" text-anchor="middle" font-size="11.5" font-weight="800" fill="#92400e" font-family="' + FONT_STACK + '">' + esc(cur.shortLabel) + '</text>' +
            '<text x="320" y="140" text-anchor="middle" font-size="10.2" font-weight="700" fill="#b45309" font-family="' + FONT_STACK + '">權力分立・相互制衡</text>' +

            nodeHtml +
          '</svg>'
        );
      }

      function render() {
        var cur = ACTIONS.filter(function (a) { return a.key === actKey; })[0] || ACTIONS[0];
        var controls =
          '<div class="hb-vis-controls">' +
            ACTIONS.map(function (a) {
              return '<button type="button" class="hb-vis-btn' + (actKey === a.key ? ' active' : '') + '" data-a="' + a.key + '">' + esc(a.btn) + '</button>';
            }).join('') +
          '</div>';

        var readout =
          '<div class="hb-vis-readout">' +
            '<strong>' + esc(cur.btn) + '：</strong>' + esc(cur.threshold) + '<br>' +
            '<strong>法律效果：</strong>' + esc(cur.effect) + '<br>' +
            '<span style="color:#b91c1c;font-weight:700;">⚠️ ' + esc(cur.trap) + '</span>' +
          '</div>';

        var table =
          '<table class="hb-vis-table">' +
            '<thead><tr><th>制衡機制</th><th>發動門檻／程序</th><th>法律效果</th></tr></thead>' +
            '<tbody>' +
              ACTIONS.map(function (a) {
                return '<tr class="vis-row-clickable' + (actKey === a.key ? ' vis-row-active' : '') + '" data-a="' + a.key + '">' +
                  '<td>' + esc(a.btn) + '</td><td>' + esc(a.threshold) + '</td><td>' + esc(a.effect) + '</td>' +
                '</tr>';
              }).join('') +
            '</tbody>' +
          '</table>';

        el.innerHTML = controls + buildSvg() + readout + table;
        el.querySelectorAll('[data-a]').forEach(function (n) {
          n.addEventListener('click', function () {
            actKey = n.getAttribute('data-a');
            render();
          });
        });
      }

      render();
    }
  };

  /* ========================================================================
     9. SOC_9_REVIEW：九年級社會跨科素養統整
        108 會考地理 × 歷史 × 公民三維交叉拆題圖
     ======================================================================== */
  global.JuniorHandbookVisuals['SOC_9_REVIEW'] = {
    title: '🎨 108 會考「地理 × 歷史 × 公民」三維交叉拆題圖',
    subtitle: '切換三大素養題組並點擊各科維度，訓練一眼拆解跨科題幹「空間 × 時間 × 制度」的滿分思維',
    mount: function (el) {
      var caseIdx = 0;
      var focusDim = 'all'; // 'all' | 'geo' | 'his' | 'civ'

      var CASES = [
        {
          id: 0,
          btn: '🍵 茶葉樟腦與開港北移',
          hubLine1: '清末開港通商',
          hubLine2: '茶葉・樟腦北移',
          geo: {
            line1: '北部丘陵多雨・酸性紅土',
            line2: '淡水河水運匯聚大稻埕',
            explain: '【地理拆題】茶樹喜溫暖多雨、排水佳的酸性丘陵（北部桃竹苗、坪林），樟樹分布於中北部山區，造就北部出口暴增。'
          },
          his: {
            line1: '1860 英法聯軍開港通商',
            line2: '政經重心由台南北移台北',
            explain: '【歷史拆題】《天津／北京條約》開放淡水、雞籠、安平、打狗，洋行進駐大稻埕，清廷進而設台北府並建省！'
          },
          civ: {
            line1: '比較利益・國際貿易順差',
            line2: '洋行資本與契約商業興起',
            explain: '【公民拆題】台灣發揮土地氣候「比較利益」專攻茶葉樟腦出口，透過全球貿易累積資本，推動商業分工與市場擴張。'
          },
          synthesis: '<strong>三科連動破題：</strong>「1860 開港（歷史）」打通國際市場，使「北部丘陵茶樟產區（地理）」發揮「比較利益與貿易順差（公民）」，最終促成台北取代台南成為全島核心！'
        },
        {
          id: 1,
          btn: '🌍 碳稅與氣候正義',
          hubLine1: '歐盟 CBAM 碳關稅',
          hubLine2: '淨零與氣候正義',
          geo: {
            line1: '溫室效應・海平面上升',
            line2: '吐瓦魯等島國首當其衝',
            explain: '【地理拆題】燃燒化石燃料加劇全球暖化，造成極端氣候、冰川融化與太平洋低窪珊瑚礁島國面臨淹沒危機。'
          },
          his: {
            line1: '工業革命起歐美歷史排碳',
            line2: '開發中國家工業化爭發展權',
            explain: '【歷史拆題】歐美自 18 世紀工業革命累積大量歷史碳排放，如今開發中國家追求工業脫貧，引發「歷史責任歸屬」爭論。'
          },
          civ: {
            line1: '外部成本內部化（碳費／稅）',
            line2: '世代正義與國際氣候公約',
            explain: '【公民拆題】排碳造成社會「外部成本」，政府課徵碳稅／歐盟實施 CBAM 使外部成本內部化，落實環境與世代正義！'
          },
          synthesis: '<strong>三科連動破題：</strong>「工業革命百年排碳（歷史）」導致「暖化與島國危機（地理）」，國際透過「碳稅把外部成本內部化（公民）」兼顧減碳與公平！'
        },
        {
          id: 2,
          btn: '💾 半導體水資源與國土規劃',
          hubLine1: '台灣護國神山',
          hubLine2: '水電資源與治理',
          geo: {
            line1: '夏雨冬乾・坡陡流急留水難',
            line2: '高科聚落集中西部走廊',
            explain: '【地理拆題】台灣雖年雨量豐沛，但降雨集中夏秋且山高坡陡、河川短急，枯水期西部科技園區極易面臨缺水風險。'
          },
          his: {
            line1: '1970s 十大建設轉型升級',
            line2: '1980 新竹科學園區奠基',
            explain: '【歷史拆題】台灣由戰後「進口替代 → 出口導向（加工出口區）」升級為 1980 年代「高科技產業（竹科）」，嵌入全球供應鏈。'
          },
          civ: {
            line1: '機會成本：農業 vs 工業用水',
            line2: '環境影響評估與公民參與',
            explain: '【公民拆題】枯水期調撥農水供工業涉及資源配置與「機會成本」，開發再生水廠與設廠須經環評、公聽會與合理補償！'
          },
          synthesis: '<strong>三科連動破題：</strong>「1980 設竹科產業升級（歷史）」使晶圓廠群聚西部，遭遇「降雨不均與留水困難（地理）」，須透過「水權補償、環評與再生水治理（公民）」化解衝突！'
        }
      ];

      function buildSvg() {
        var c = CASES[caseIdx];
        var hiGeo = focusDim === 'all' || focusDim === 'geo';
        var hiHis = focusDim === 'all' || focusDim === 'his';
        var hiCiv = focusDim === 'all' || focusDim === 'civ';

        return (
          '<svg viewBox="0 0 640 270" class="hb-vis-svg" role="img" aria-label="108會考三維交叉拆題圖">' +
            '<rect x="0" y="0" width="640" height="270" fill="#f8fafc"/>' +

            /* 三角形連動光束 */
            '<polygon points="140,86 500,86 320,210" fill="#e0f2fe" opacity="0.28" stroke="#94a3b8" stroke-dasharray="6 4" stroke-width="1.5"/>' +
            '<line x1="214" y1="88" x2="262" y2="118" stroke="' + (hiGeo ? '#0284c7' : '#cbd5e1') + '" stroke-width="' + (hiGeo ? '3' : '1.5') + '"/>' +
            '<line x1="426" y1="88" x2="378" y2="118" stroke="' + (hiHis ? '#d97706' : '#cbd5e1') + '" stroke-width="' + (hiHis ? '3' : '1.5') + '"/>' +
            '<line x1="320" y1="184" x2="320" y2="156" stroke="' + (hiCiv ? '#7c3aed' : '#cbd5e1') + '" stroke-width="' + (hiCiv ? '3' : '1.5') + '"/>' +

            /* 左上：地理維度卡 */
            '<g data-dim="geo" opacity="' + (hiGeo ? '1' : '0.35') + '" style="cursor:pointer;">' +
              '<rect x="18" y="18" width="218" height="86" rx="10" fill="#e0f2fe" stroke="#0284c7" stroke-width="' + (focusDim === 'geo' ? '3' : '1.8') + '"/>' +
              '<text x="32" y="40" font-size="12.5" font-weight="800" fill="#0369a1" font-family="' + FONT_STACK + '">🗺️ 地理（空間・環境）</text>' +
              '<text x="32" y="64" font-size="11.2" font-weight="700" fill="#0f172a" font-family="' + FONT_STACK + '">• ' + esc(c.geo.line1) + '</text>' +
              '<text x="32" y="86" font-size="11.2" font-weight="700" fill="#0f172a" font-family="' + FONT_STACK + '">• ' + esc(c.geo.line2) + '</text>' +
            '</g>' +

            /* 右上：歷史維度卡 */
            '<g data-dim="his" opacity="' + (hiHis ? '1' : '0.35') + '" style="cursor:pointer;">' +
              '<rect x="404" y="18" width="218" height="86" rx="10" fill="#fef3c7" stroke="#d97706" stroke-width="' + (focusDim === 'his' ? '3' : '1.8') + '"/>' +
              '<text x="418" y="40" font-size="12.5" font-weight="800" fill="#92400e" font-family="' + FONT_STACK + '">⏳ 歷史（時間・變遷）</text>' +
              '<text x="418" y="64" font-size="11.2" font-weight="700" fill="#0f172a" font-family="' + FONT_STACK + '">• ' + esc(c.his.line1) + '</text>' +
              '<text x="418" y="86" font-size="11.2" font-weight="700" fill="#0f172a" font-family="' + FONT_STACK + '">• ' + esc(c.his.line2) + '</text>' +
            '</g>' +

            /* 中央題幹核心 */
            '<g data-dim="all" style="cursor:pointer;">' +
              '<rect x="242" y="106" width="156" height="52" rx="26" fill="#0f172a" stroke="#38bdf8" stroke-width="2.5"/>' +
              '<text x="320" y="128" text-anchor="middle" font-size="12" font-weight="800" fill="#ffffff" font-family="' + FONT_STACK + '">' + esc(c.hubLine1) + '</text>' +
              '<text x="320" y="146" text-anchor="middle" font-size="11" font-weight="700" fill="#7dd3fc" font-family="' + FONT_STACK + '">' + esc(c.hubLine2) + '</text>' +
            '</g>' +

            /* 下方：公民維度卡 */
            '<g data-dim="civ" opacity="' + (hiCiv ? '1' : '0.35') + '" style="cursor:pointer;">' +
              '<rect x="160" y="182" width="320" height="74" rx="10" fill="#f3e8ff" stroke="#7c3aed" stroke-width="' + (focusDim === 'civ' ? '3' : '1.8') + '"/>' +
              '<text x="320" y="204" text-anchor="middle" font-size="12.5" font-weight="800" fill="#5b21b6" font-family="' + FONT_STACK + '">⚖️ 公民（經濟・法律・公共治理）</text>' +
              '<text x="320" y="226" text-anchor="middle" font-size="11.2" font-weight="700" fill="#0f172a" font-family="' + FONT_STACK + '">• ' + esc(c.civ.line1) + '</text>' +
              '<text x="320" y="245" text-anchor="middle" font-size="11.2" font-weight="700" fill="#0f172a" font-family="' + FONT_STACK + '">• ' + esc(c.civ.line2) + '</text>' +
            '</g>' +
          '</svg>'
        );
      }

      function render() {
        var c = CASES[caseIdx];
        var caseControls =
          '<div class="hb-vis-controls">' +
            CASES.map(function (item, i) {
              return '<button type="button" class="hb-vis-btn' + (caseIdx === i ? ' active' : '') + '" data-cidx="' + i + '">' + esc(item.btn) + '</button>';
            }).join('') +
          '</div>';

        var dimControls =
          '<div class="hb-vis-controls">' +
            '<button type="button" class="hb-vis-btn' + (focusDim === 'all' ? ' active' : '') + '" data-dim="all">🔗 三科聯動總覽</button>' +
            '<button type="button" class="hb-vis-btn' + (focusDim === 'geo' ? ' active' : '') + '" data-dim="geo">🗺️ 只看地理拆題</button>' +
            '<button type="button" class="hb-vis-btn' + (focusDim === 'his' ? ' active' : '') + '" data-dim="his">⏳ 只看歷史拆題</button>' +
            '<button type="button" class="hb-vis-btn' + (focusDim === 'civ' ? ' active' : '') + '" data-dim="civ">⚖️ 只看公民拆題</button>' +
          '</div>';

        var readoutText = c.synthesis;
        if (focusDim === 'geo') readoutText = esc(c.geo.explain);
        if (focusDim === 'his') readoutText = esc(c.his.explain);
        if (focusDim === 'civ') readoutText = esc(c.civ.explain);

        var table =
          '<table class="hb-vis-table">' +
            '<thead><tr><th>考科維度</th><th>題幹關鍵線索</th><th>會考對應核心概念</th></tr></thead>' +
            '<tbody>' +
              '<tr class="vis-row-clickable' + (focusDim === 'geo' ? ' vis-row-active' : '') + '" data-dim="geo"><td>🗺️ 地理</td><td>' + esc(c.geo.line1) + '</td><td>' + esc(c.geo.line2) + '</td></tr>' +
              '<tr class="vis-row-clickable' + (focusDim === 'his' ? ' vis-row-active' : '') + '" data-dim="his"><td>⏳ 歷史</td><td>' + esc(c.his.line1) + '</td><td>' + esc(c.his.line2) + '</td></tr>' +
              '<tr class="vis-row-clickable' + (focusDim === 'civ' ? ' vis-row-active' : '') + '" data-dim="civ"><td>⚖️ 公民</td><td>' + esc(c.civ.line1) + '</td><td>' + esc(c.civ.line2) + '</td></tr>' +
            '</tbody>' +
          '</table>';

        el.innerHTML = caseControls + dimControls + buildSvg() + '<div class="hb-vis-readout">' + readoutText + '</div>' + table;

        el.querySelectorAll('[data-cidx]').forEach(function (b) {
          b.addEventListener('click', function () {
            caseIdx = Number(b.getAttribute('data-cidx'));
            focusDim = 'all';
            render();
          });
        });

        el.querySelectorAll('[data-dim]').forEach(function (b) {
          b.addEventListener('click', function () {
            focusDim = b.getAttribute('data-dim');
            render();
          });
        });
      }

      render();
    }
  };
})(window);
