/* ==========================================================================
   math-pack.js — 數學科其餘 15 個完整互動單元（補齊全 18 個數學單元）
   ========================================================================== */
(function (global) {
  'use strict';

  var create = global.JuniorSimEngines.createUnitFromSpec;

  var SPECS = [
    {
      id: 'MATH_7_1_2',
      badgeText: '📐 七年級數學｜單元 1-2',
      title: '分數的四則運算與因倍數',
      subtitle: '披薩等分通分、包含除倒數原理與公因數／公倍數應用破題',
      goldenRule: '加減比大小要先切一樣大（通分）；除以分數就是問「能裝幾個小湯匙」（乘倒數）。',
      hints: ['把 1 條 1 公尺繩子每 0.5 公尺剪一段，能剪 2 段！用比 1 小的湯匙舀水，舀的次數當然越除越多！', '公因數(GCD)用於「切碎分給別人」，公倍數(LCM)用於「拼大正方形或等下一次同時相遇」。'],
      exploreTitle: '🍕 披薩等分擴分與包含除彩帶切割器',
      simType: 'm_frac_pizza',
      engage: {
        question: '🍕 把 3/4 公尺長的彩帶，每 1/4 公尺剪成一段，可以剪出 3 段！為什麼除法「3/4 ÷ 1/4 = 3」反而越除越大？',
        options: [
          { label: 'A. 因為題目出錯了，除法一定要越除越小', correct: false, feedback: '除以比 1 大的數才變小；除以比 1 小的數（小湯匙），能切出的份數反而會變多！' },
          { label: 'B. 因為除法問的是「前面能裝幾個後面」，除數越小就能切出越多段！', correct: true, feedback: '完全正確！這就是「包含除」的本質，也是除以分數等於乘倒數的由來！' }
        ]
      },
      principles: [
        '<strong>擴約分不變質：</strong>把披薩每片切半，總片數與你拿到的片數同乘 2，吃進去的總面積一模一樣。',
        '<strong>除以分數＝乘倒數：</strong>每 1 份能切出 b/a 個 a/b，所以除以 a/b 等於乘以倒數 b/a。'
      ],
      faqs: [
        { q: '為什麼 1/2 + 1/3 不能上下直接相加變成 2/5？', a: '半個西瓜加三分之一個西瓜，怎麼可能湊起來還沒半個大（2/5 = 0.4 < 0.5）？不同大小不能直接數片數，一定要通分切一樣大！' },
        { q: '公因數 (GCD) 和公倍數 (LCM) 應用題老是搞反？', a: '看東西變小還是變大：「切小分裝」找公因數(GCD)、「拼大或等下次同班車」找公倍數(LCM)！' }
      ],
      trap: {
        question: '一盒糖果 6 個一數剩 4 個、8 個一數剩 6 個、10 個一數剩 8 個，最少有幾顆？',
        misconceptionCode: 'MIS_LCM_REMAINDER_ADD',
        misconceptionDesc: '週期不足型餘數題誤把餘數相加而非先扣掉共同缺額',
        options: [
          { label: 'A. 120 + 2 = 122 顆', correct: false, feedback: '代入檢驗：122 ÷ 6 = 20 餘 2（不是餘 4！）。全部都「差 2 顆整除」，應該用減 2！' },
          { label: 'B. [6, 8, 10] − 2 = 118 顆', correct: true, feedback: '118 ÷ 6 餘 4、÷ 8 餘 6、÷ 10 餘 8，全部差 2 顆整除，直接求公倍數減 2 秒殺！' }
        ]
      },
      tactic: {
        code: 'GCD_SPLIT_REMAINDER',
        title: '分裝水果「剩餘與不足」公因數破題',
        problemText: '蘋果 75 顆平分給若干人剩 3 顆；橘子 50 顆平分給同樣這群人卻不足 4 顆，最多有幾人？',
        slots: [
          { label: '步驟 1：把多餘的扣掉、不夠的補齊', expectedId: 'adj' },
          { label: '步驟 2：求調整後兩數的最大公因數', expectedId: 'gcd' },
          { label: '步驟 3：防呆檢查（人數須大於餘數）', expectedId: 'chk' }
        ],
        chips: [
          { id: 'gcd', label: '求 (72, 54) 的最大公因數 = 18 人' },
          { id: 'adj', label: '蘋果 75 − 3 = 72 顆（剛好分完）；橘子 50 + 4 = 54 顆（補齊剛好分完）' },
          { id: 'chk', label: '檢查 18 > 3 且 18 > 4，確認合理無誤！' },
          { id: 'bad', label: '直接求 (75, 50) = 25 人再加減餘數', wrongReason: '75 跟 50 都沒整除，必須先扣多餘、補不足變整除才能找公因數！' }
        ],
        summary: '🏆 口訣：「多就減掉、少就補上」，變剛好整除後求 GCD，最後檢查組數大於餘數！'
      },
      badgeId: 'BADGE_MATH_7_1_2'
    },
    {
      id: 'MATH_7_1_4',
      badgeText: '📐 七年級數學｜單元 1-4',
      title: '二元一次聯立方程式與坐標',
      subtitle: '兩直線交點即為解、平行無解視覺化，與雞兔同籠鶴龜速解',
      goldenRule: '一個條件畫一條線（無數種可能），兩個條件的交點就是唯一共同真相！',
      hints: ['同時在紅線上又在藍線上的點，幾何上就是兩條線相交的那唯一一點。', '兩條直線平行永遠碰不到＝無解；完全重疊＝無限多組解。'],
      exploreTitle: '📈 互動坐標系：兩直線交點、平行與重合',
      simType: 'm_linear_sys',
      engage: {
        question: '📍 在坐標平面上，如果兩個二元一次方程式畫出來是「兩條互相平行的直線」，代表這組聯立方程式有幾組解？',
        options: [
          { label: 'A. 沒有交點 → 無解！', correct: true, feedback: '答對了！兩線平行永遠碰不到，代數消去法也會出現像 0 = 4 這種矛盾式！' },
          { label: 'B. 兩條線一樣長 → 無限多組解', correct: false, feedback: '平行線永不相交，找不到任何一點同時在兩條線上，所以是「無解」喔！' }
        ]
      },
      principles: [
        '<strong>一條線＝無數個點：</strong>單一條件 x + y = 5 有無限多組解，排在坐標上連成一條直線。',
        '<strong>聯立＝找交點：</strong>同時滿足兩條直線的點就是交點；加減消去法口訣是「同號相減、異號相加」。'
      ],
      faqs: [
        { q: '坐標 (3, 2) 哪個是左右 x、哪個是上下 y？', a: '記住「先走進電梯（左右找 x 門），再按樓層（上下找 y 樓）」！' },
        { q: '求兩條直線和 x 軸圍成的三角形面積怎麼最快？', a: '兩線代 y=0 求底長，解聯立求交點，交點的 |y| 坐標就是三角形的高！' }
      ],
      trap: {
        question: '聯立方程組 x + y = 3 與 2x + 2y = 10，用消去法消掉後得到「0 = 4」，這代表什麼？',
        misconceptionCode: 'MIS_PARALLEL_INFINITE',
        misconceptionDesc: '混淆聯立方程式無解 (0=4) 與無限多組解 (0=0)',
        options: [
          { label: 'A. 無限多組解', correct: false, feedback: '0 = 0（恆成立）才是重合無限多組解；0 = 4 根本不可能成立，是兩線平行「無解」！' },
          { label: 'B. 兩線平行，無解', correct: true, feedback: '完全正確！係數成比例但常數不成比例，就是平行線無解！' }
        ]
      },
      tactic: {
        code: 'CRANE_TURTLE_FAST',
        title: '買票／雞兔同籠「鶴龜假設法」10 秒口算',
        problemText: '全班 40 人買全票 300 元與半票 200 元，共花 10500 元，問買了幾張全票？',
        slots: [
          { label: '步驟 1：假設全部都買便宜半票', expectedId: 'all' },
          { label: '步驟 2：計算實際多花出來的總差額', expectedId: 'diff' },
          { label: '步驟 3：總差額 ÷ 每張單價差＝全票數', expectedId: 'div' }
        ],
        chips: [
          { id: 'all', label: '假設 40 張全買半票：40 × 200 = 8000 元' },
          { id: 'diff', label: '實際多花了 10500 − 8000 = 2500 元' },
          { id: 'div', label: '每換 1 張全票多 100 元 → 2500 ÷ 100 = 25 張全票！' },
          { id: 'bad', label: '10500 ÷ 300 = 35 張', wrongReason: '裡面混了半票，不能直接拿總金額除以全票單價！' }
        ],
        summary: '🏆 鶴龜假設法免列聯立，10 秒就能口算驗證答案！'
      },
      badgeId: 'BADGE_MATH_7_1_4'
    },
    {
      id: 'MATH_7_1_5',
      badgeText: '📐 七年級數學｜單元 1-5',
      title: '比例與正反比',
      subtitle: '正比過原點直線 vs 反比固定面積，破解「一起變大就是正比」陷阱',
      goldenRule: '正比是「一起變幾倍」（商固定過原點）；反比是「此消彼長乘積固定」（面積不變）。',
      hints: ['正比一定要檢查：當 x = 0 時 y 是不是 0？x 變 2 倍時 y 有沒有跟著變 2 倍？', '反比不是「x 變大 y 變小」就好，必須是 x × y 乘起來永遠等於固定常數 k！'],
      exploreTitle: '⚙️ 正比・反比・假正比三軌鑑別儀',
      simType: 'm_proportion',
      engage: {
        question: '🎂 媽媽今年 31 歲、我今年 1 歲，我每年長大 1 歲媽媽也長大 1 歲（兩個人同時變大）。請問我和媽媽的年齡成「正比」嗎？',
        options: [
          { label: 'A. 成正比，因為我增加媽媽也增加', correct: false, feedback: '這是會考超級陷阱！你 1 歲媽媽 31 歲（31倍），明年你 2 歲媽媽 32 歲（變 16 倍），倍數沒固定且 0 歲時媽媽不是 0 歲！' },
          { label: 'B. 不成正比！正比必須「倍數固定且過原點」，年齡只是相差固定', correct: true, feedback: '太精準了！立刻進實驗室切換三條線親眼比較差別！' }
        ]
      },
      principles: [
        '<strong>正比 (y = kx)：</strong>比值 y/x 永遠不變，圖形是一條通過原點 (0,0) 的斜直線。',
        '<strong>反比 (xy = k)：</strong>乘積固定，畫在坐標上是雙曲線，長方形面積恆等。'
      ],
      faqs: [
        { q: '題目給 3x = 4y，為什麼 x : y 是 4 : 3 而不是 3 : 4？', a: '等號兩邊係數互換才是比！代入驗算：3×(4) = 4×(3) = 12，瞬間不寫反！' },
        { q: '剩餘披薩＝8 − 吃掉披薩，吃越多剩越少，這算反比嗎？', a: '不算！那是「相加固定 (x+y=8)」，反比必須是「相乘固定 (xy=k)」！' }
      ],
      trap: {
        question: '已知 3x = 4y（且 x, y 不為 0），請問 x : y = ？',
        misconceptionCode: 'MIS_RATIO_SWAP',
        misconceptionDesc: '由 3x = 4y 誤判 x : y = 3 : 4 未係數互換',
        options: [
          { label: 'A. 3 : 4', correct: false, feedback: '代回去檢查：如果 x=3, y=4，那 3(3)=9 根本不等於 4(4)=16！係數要互換！' },
          { label: 'B. 4 : 3', correct: true, feedback: '代入 3(4) = 4(3) = 12 完美成立！口訣「等號兩邊係數互換」！' }
        ]
      },
      tactic: {
        code: 'RATIO_SET_R',
        title: '連比化簡與「設 r 倍數法」防呆',
        problemText: '已知 x : y = 2 : 3，y : z = 4 : 5，且 x + y + z = 70，求 x？',
        slots: [
          { label: '步驟 1：把共同橋樑 y 通分成公倍數 12', expectedId: 'lcm' },
          { label: '步驟 2：嚴禁直接代數字，必設 r 倍數', expectedId: 'setr' },
          { label: '步驟 3：代入總和解 r 再乘回 x', expectedId: 'ans' }
        ],
        chips: [
          { id: 'lcm', label: 'x:y = 8:12，y:z = 12:15 → 連比 x:y:z = 8:12:15' },
          { id: 'setr', label: '設 x = 8r, y = 12r, z = 15r' },
          { id: 'ans', label: '8r + 12r + 15r = 35r = 70 → r = 2 → x = 16！' },
          { id: 'bad', label: '直接用 x = 8, y = 12, z = 15 當真實答案', wrongReason: '8+12+15=35 不等於 70！比例只是倍數關係，必須乘上 r！' }
        ],
        summary: '🏆 看到連比求實際數值，永遠「對齊橋樑 → 設 r → 解 r」！'
      },
      badgeId: 'BADGE_MATH_7_1_5'
    },
    {
      id: 'MATH_7_1_6',
      badgeText: '📐 七年級數學｜單元 1-6',
      title: '一元一次不等式',
      subtitle: '數線 180° 鏡像翻轉動畫解釋「乘除負數為何變號」，搭配省錢方案臨界點',
      goldenRule: '加減只是整排搬家（順序不變）；乘除負數是照鏡子左右翻轉（不等號必轉向）。',
      hints: ['在數線上 5 在 2 右邊 (5 > 2)。乘以 −1 後整條數線左右翻面，−5 跑到 −2 左邊，所以 −5 < −2！', '只有「乘或除負數」不等號才轉向，加減負數不用轉向！'],
      exploreTitle: '🪞 數線平移 vs 180° 鏡像翻轉模擬器',
      simType: 'm_ineq_flip',
      engage: {
        question: '🪞 明明 5 > 2，為什麼兩邊同時乘上 (−1) 變成 −5 跟 −2 後，原本較大的 5 反而變小了（−5 < −2）？',
        options: [
          { label: 'A. 因為乘以負數把整條數線以 0 為中心左右照鏡子翻轉 180°，左右順序顛倒了！', correct: true, feedback: '精準抓到幾何本質！進實驗室親手按翻轉鍵看看！' },
          { label: 'B. 因為只要算式裡出現負號，不管加減乘除都要把不等號反轉', correct: false, feedback: '錯喔！兩邊同時「減 10」只是整條數線往左平移，順序沒變，只有「乘除負數」才翻轉！' }
        ]
      },
      principles: [
        '<strong>加減不變向：</strong>整條數線同步平移，右邊的人依然在右邊。',
        '<strong>乘除負數必變向：</strong>等同以原點 0 鏡像翻轉 180°，大小左右對調。'
      ],
      faqs: [
        { q: '「至少」「不超過」「未滿」哪幾個要加等號？', a: '問邊界算不算！「至少 60 分及格」考剛好 60 算及格（≥）；「未滿 12 歲免費」剛好 12 歲不算（<）！' }
      ],
      trap: {
        question: '解不等式 −3x ≤ 12，下列哪一步是正確的？',
        misconceptionCode: 'MIS_INEQ_FORGET_FLIP',
        misconceptionDesc: '不等式兩邊同除以負數時忘記反轉不等號方向',
        options: [
          { label: 'A. 兩邊同除 (−3) 得 x ≤ −4', correct: false, feedback: '代入 x = −10 驗算：−3(−10) = +30 根本沒有 ≤ 12！除以負數忘記把 ≤ 反轉成 ≥ 了！' },
          { label: 'B. 兩邊同除 (−3) 並反轉方向得 x ≥ −4', correct: true, feedback: '代入 x = 0 驗算：0 ≤ 12 成立！除以負數一定要反轉不等號！' }
        ]
      },
      keywordRadar: {
        code: 'INEQ_SCHEME_COMPARE',
        title: '會考團體票省錢陷阱審題關鍵字（找出 2 個關鍵詞）',
        tokens: [
          { text: '遊樂園門票每張 100 元，滿 30 人買團體票打 8 折。現有 ', plain: true },
          { text: '未滿 30 人', isTrapKey: true, note: '代表人數範圍限制在 x < 30（不含 30）！' },
          { text: ' 的班級想省錢，問 ', plain: true },
          { text: '至少', isTrapKey: true, note: '求出 x > 24 後，配合「至少幾人」取最小整數解 x = 25 人！' },
          { text: ' 幾人時，直接買 30 張團體票比買單張便宜？', plain: true }
        ],
        unlockedHtml: '🏆 <strong>解鎖列式：</strong>30 × 80 < 100x → x > 24，搭配「至少」與「未滿 30」，最少 25 人時直接買 30 張團票更便宜！'
      },
      badgeId: 'BADGE_MATH_7_1_6'
    },
    {
      id: 'MATH_8_2_1',
      badgeText: '📐 八年級數學｜單元 2-1',
      title: '乘法公式',
      subtitle: '彈性正方形面積切割打臉 (a+b)² = a² + b²，與平方差速算',
      goldenRule: '平方不是分配給裡面每個人，而是畫出完整正方形；別吃掉那兩塊 ab 長方形！',
      hints: ['用數字打臉：(3+2)² = 25，但 3² + 2² = 13，少掉的 12 就是兩塊 3×2 長方形！', '看到兩數平方相減 A² − B²，永遠先拆成 (A+B)(A−B) 速算！'],
      exploreTitle: '🟦 彈性正方形面積即時切割器',
      simType: 'm_mult_formula',
      engage: {
        question: '📐 小明寫 (10 + 2)² = 10² + 2² = 104，跟正確答案 144 整整差了 40！這憑空消失的 40 躲在哪裡？',
        options: [
          { label: 'A. 躲在邊長 10 與 2 交錯組成的「兩塊 10×2 長方形 (2ab = 40)」裡！', correct: true, feedback: '一針見血！進正方形畫布親手拉動 a 跟 b 看這兩塊黃色長方形！' },
          { label: 'B. 因為 10 應該要乘以 2 次方才對', correct: false, feedback: '10² 本來就是 100 沒算錯，是漏掉了中間兩塊 10×2 = 20 的面積喔！' }
        ]
      },
      principles: [
        '<strong>和的平方 (a+b)² = a² + 2ab + b²：</strong>大正方形切一刀十字，必出現兩塊 ab 長方形。',
        '<strong>差的平方 (a−b)² = a² − 2ab + b²：</strong>扣兩條 ab 時重疊的角落 b² 被多扣一次，所以最後要 +b² 補回來！'
      ],
      faqs: [
        { q: '知 a+b=7、ab=10，怎麼不用解 a, b 就求出 a²+b²？', a: '用橋樑公式：a² + b² = (a+b)² − 2ab = 49 − 20 = 29！' }
      ],
      trap: {
        question: '計算 (a − b)² 時，最後一項 b² 前面的符號是加還是減？',
        misconceptionCode: 'MIS_DIFF_SQ_LAST_SIGN',
        misconceptionDesc: '誤將 (a-b)² 寫成 a² - 2ab - b²',
        options: [
          { label: 'A. − b²', correct: false, feedback: '代 a=5, b=2 驗算：(5−2)² = 9，但 25 − 20 − 4 = 1（錯！）。重疊小角被多扣一次要加回來！' },
          { label: 'B. + b²', correct: true, feedback: '正確！(5−2)² = 25 − 20 + 4 = 9，任何實數的平方都是正的！' }
        ]
      },
      tactic: {
        code: 'DIFF_OF_SQ_FAST',
        title: '平方差大數秒殺（免硬乘）',
        problemText: '不用直式乘法，5 秒算出 (2025² − 2023²) ÷ 4048 的值！',
        slots: [
          { label: '步驟 1：辨識平方差拆成 (A+B)(A−B)', expectedId: 'split' },
          { label: '步驟 2：心算兩括號相加與相減', expectedId: 'eval' },
          { label: '步驟 3：分子分母直接約分收工', expectedId: 'cancel' }
        ],
        chips: [
          { id: 'split', label: '分子改寫為 (2025 + 2023)(2025 − 2023)' },
          { id: 'eval', label: '算出括號 = 4048 × 2' },
          { id: 'cancel', label: '(4048 × 2) ÷ 4048 = 2！' },
          { id: 'bad', label: '先拿直式算出 2025×2025 = 4100625', wrongReason: '太慢又容易算錯！看到 A² − B² 反射動作就是拆 (A+B)(A−B)！' }
        ],
        summary: '🏆 看到大數字平方相減，永遠用平方差一秒約分！'
      },
      badgeId: 'BADGE_MATH_8_2_1'
    },
    {
      id: 'MATH_8_2_2',
      badgeText: '📐 八年級數學｜單元 2-2',
      title: '多項式四則運算',
      subtitle: '幾何維度方塊解釋同類項合併、去括號變號與除法原理',
      goldenRule: '同次方才是同單位（面積不能加長度）；多項式除法缺項必補 0 佔位。',
      hints: ['x² 是正方形面積、x 是線段長度，兩者維度不同不能直接合併成 x³！', '括號前面有負號 −(2x − 3)，像空投炸彈 (−1) 一樣，括號內每一項都要反轉變號！'],
      exploreTitle: '🧱 多項式幾何維度方塊碰撞台',
      simType: 'm_poly_blocks',
      engage: {
        question: '🧱 把 1 塊面積 x² 的磁磚加上 1 條長度 x 的木條，能合併寫成 2x³ 嗎？',
        options: [
          { label: 'A. 不能！面積跟長度單位維度不同，只能分開寫成 x² + x', correct: true, feedback: '完全正確！進方塊台試著硬撞看看它們為什麼彈開！' },
          { label: 'B. 可以，指數 2 加 1 等於 3', correct: false, feedback: '那是「乘法」x² · x = x³！加法不能把不同次方硬合在一起喔！' }
        ]
      },
      principles: [
        '<strong>多項式門檻：</strong>未知數 x 絕對不能出現在分母、絕對值或根號內。',
        '<strong>除法原理：</strong>被除式 ＝ 除式 × 商式 ＋ 餘式（缺項一定要補 0x 才不會對錯位）。'
      ],
      faqs: [
        { q: '為什麼 (x+1)/2 是多項式，但 2/(x+1) 不是？', a: '看誰掉進分母地下室！數字在分母只是分數係數（安全）；未知數 x 掉進分母就不是多項式！' }
      ],
      trap: {
        question: '化簡 (5x − 3) − (2x − 4)，正確結果是？',
        misconceptionCode: 'MIS_PAREN_SIGN_DROP',
        misconceptionDesc: '去括號前面遇減號時，忘記把第二項 −4 也反轉成 +4',
        options: [
          { label: 'A. 3x − 7', correct: false, feedback: '中計了！括號前的負號要把裡面「每一項」都翻面，−(−4) 要變成 +4，不是 −4！' },
          { label: 'B. 3x + 1', correct: true, feedback: '正確！5x − 3 − 2x + 4 = 3x + 1！' }
        ]
      },
      tactic: {
        code: 'POLY_COEFF_PAIR',
        title: '免全展開秒求特定項係數（找對象配對法）',
        problemText: '求 (2x² − 3x + 5)(x² + 4x − 1) 展開後「x² 項的係數」？',
        slots: [
          { label: '步驟 1：只挑能乘出 x² 的三對配對', expectedId: 'pairs' },
          { label: '步驟 2：各別算出三對係數乘積', expectedId: 'prod' },
          { label: '步驟 3：相加即得答案（省掉其餘 6 次乘法）', expectedId: 'sum' }
        ],
        chips: [
          { id: 'pairs', label: '鎖定 (2x²)(-1)、(-3x)(4x)、(5)(x²) 三組' },
          { id: 'prod', label: '分別得 −2x²、−12x²、+5x²' },
          { id: 'sum', label: '−2 − 12 + 5 = −9！' },
          { id: 'bad', label: '從頭到尾做 9 次乘法全部展開', wrongReason: '浪費時間又容易漏負號，只抓目標次方配對 10 秒搞定！' }
        ],
        summary: '🏆 問單一項係數永遠用「找對象配對法」，免全展開零粗心！'
      },
      badgeId: 'BADGE_MATH_8_2_2'
    },
    {
      id: 'MATH_8_2_3',
      badgeText: '📐 八年級數學｜單元 2-3',
      title: '平方根與畢氏定理',
      subtitle: '動態調整夾角證明畢氏面積守恆、破解 √(9+16)=3+4 與展開圖最短路徑',
      goldenRule: '平方根就是給面積求邊長；畢氏定理相加的是正方形面積，根號不能對加減拆開！',
      hints: ['下筆前先圈出 90° 直角對面的「斜邊 c」！求斜邊用加、求股長用減。', '螞蟻爬長方體最短路徑：攤平成長方形，把「兩條最短邊合起來」再跟最長邊做畢氏定理！'],
      exploreTitle: '📐 畢氏面積量杯對照（試調整夾角 ∠C！）',
      simType: 'm_pythagoras',
      engage: {
        question: '🔺 已知直角三角形兩邊長為 3 和 5，請問第三邊一定是 √(3² + 5²) = √34 嗎？',
        options: [
          { label: 'A. 不一定！如果 5 是斜邊，第三邊是 √(5² − 3²) = 4！', correct: true, feedback: '太機警了！看到 3 跟 5 一定要先確認「誰對著直角（誰是斜邊）」！' },
          { label: 'B. 一定是 √34，畢氏定理永遠兩邊平方相加', correct: false, feedback: '如果 5 已經是最長的斜邊，另一股就要用「減法」5² − 3² = 16 → 股長 4 喔！' }
        ]
      },
      principles: [
        '<strong>面積守恆：</strong>只有夾角剛好 90° 時，兩股正方形面積和才等於斜邊正方形面積。',
        '<strong>常用畢氏數比例：</strong>(3,4,5)、(5,12,13)、(7,24,25)、(8,15,17)，遇大數先約分再乘回。'
      ],
      faqs: [
        { q: '√(9 + 16) 可以拆成 √9 + √16 = 3 + 4 = 7 嗎？', a: '絕對不行！√25 = 5 ≠ 7！根號只能對「乘除」拆開，絕對不能對「加減」拆開！' }
      ],
      trap: {
        question: '計算 √(9 + 16) 的正確值為？',
        misconceptionCode: 'MIS_SQRT_DISTRIBUTE_ADD',
        misconceptionDesc: '誤以為根號可對加法拆開：√(a+b) = √a + √b',
        options: [
          { label: 'A. √9 + √16 = 3 + 4 = 7', correct: false, feedback: '反例打臉：邊長 3 與 4 的直角三角形斜邊只有 5，如果變 7 兩邊和就等於第三邊圍不成三角形了！' },
          { label: 'B. 先算裡面 9 + 16 = 25，再開根號 = 5', correct: true, feedback: '正確！根號裡有加減一定要先算完才能開根號！' }
        ]
      },
      tactic: {
        code: 'ANT_UNFOLD_SHORTEST',
        title: '立體長方體螞蟻爬行「展開圖短邊合算法」',
        problemText: '長方體長 5、寬 4、高 3，螞蟻沿表面從左下角爬到空間對頂角，最短距離是多少？',
        slots: [
          { label: '步驟 1：剪開攤平成平面長方形', expectedId: 'unfold' },
          { label: '步驟 2：套用「兩短邊合一、最長邊獨立」', expectedId: 'short' },
          { label: '步驟 3：套畢氏定理求斜邊長', expectedId: 'calc' }
        ],
        chips: [
          { id: 'unfold', label: '將相鄰兩面攤平成平面，兩點連線為斜邊' },
          { id: 'short', label: '把兩條最短邊 (3 + 4 = 7) 合併，最長邊 5 獨立' },
          { id: 'calc', label: '最短距離 = √(7² + 5²) = √74！' },
          { id: 'bad', label: '把兩條最長邊 (5 + 4 = 9) 合併得 √(9² + 3²) = √90', wrongReason: '√90 > √74 繞遠路了！永遠把「兩條最短邊」加在一起才最短！' }
        ],
        summary: '🏆 立體最短路徑偷吃步：兩短邊相加平方＋最長邊平方再開根號，免試三種！'
      },
      badgeId: 'BADGE_MATH_8_2_3'
    },
    {
      id: 'MATH_8_2_4',
      badgeText: '📐 八年級數學｜單元 2-4',
      title: '因式分解與十字交乘法',
      subtitle: '密碼轉盤交叉驗證中間項、橫著讀出括號，與換元整體代換',
      goldenRule: '因式分解是把面積拼回長方形；十字交叉只檢查中間項，寫答案永遠「橫著看」。',
      hints: ['常數項是正號(+)→兩數同號用加法湊中間項；常數項是負號(−)→一正一負用相減湊中間項！', '看到重複的括號 (x+2)² − 5(x+2) − 6，別展開，把它設成大寫 A 秒解！'],
      exploreTitle: '🔐 十字交乘密碼轉盤（解鎖 x² + 5x + 6）',
      simType: 'm_factor_grid',
      engage: {
        question: '🔐 用十字交乘法拆開二次式時，畫完交叉線驗證中間項正確了，寫出最終兩個括號時應該「橫著寫」還是「斜著寫」？',
        options: [
          { label: 'A. 橫著寫！交叉只是為了檢查中間一次項', correct: true, feedback: '答對！寫錯方向是十字交乘最冤枉的失分點，進密碼盤轉轉看！' },
          { label: 'B. 順著交叉斜線寫成括號', correct: false, feedback: '如果係數不是 1，斜著寫展開後會完全對不上原本的多項式喔！永遠「橫著讀」！' }
        ]
      },
      principles: [
        '<strong>分配律逆運算：</strong>(ax+p)(bx+q) 展開時外項與內項正好交叉相乘形成中間項。',
        '<strong>正負號快篩：</strong>常數正＝同號相加、常數負＝異號相減，立刻淘汰一半錯誤組合。'
      ],
      faqs: [
        { q: '四項多項式 x² + 2xy + y² − 9 怎麼分組？', a: '看到有 2xy 立刻用「3+1 分組」：(x+y)² − 3² = (x+y+3)(x+y−3)！' }
      ],
      trap: {
        question: '分解 (x + 2)² − 5(x + 2) − 6，最不會算錯的方法是？',
        misconceptionCode: 'MIS_FACTOR_BLIND_EXPAND',
        misconceptionDesc: '遇重複括號二次式未用換元法而盲目展開導致計算失誤',
        options: [
          { label: 'A. 把 (x + 2) 設成 A → A² − 5A − 6 = (A−6)(A+1) → 換回 (x−4)(x+3)', correct: true, feedback: '漂亮！換元法乾淨俐落，完全不怕展開算錯！' },
          { label: 'B. 先把 (x+2)² 寫成 x²+4 再減掉 5x+10', correct: false, feedback: '連踩兩個雷：(x+2)² 少了 4x，去括號也漏變號！用整體換元 A 就能完美避坑！' }
        ]
      },
      tactic: {
        code: 'FACTOR_GROUP_3_1',
        title: '四項因式分解「3+1 湊平方差」破題',
        problemText: '因式分解 x² − 6x + 9 − y²',
        slots: [
          { label: '步驟 1：抓出完全平方前三項（3+1 分組）', expectedId: 'g3' },
          { label: '步驟 2：收成平方差 A² − B² 結構', expectedId: 'sq' },
          { label: '步驟 3：拆成 (A + B)(A − B) 完成', expectedId: 'fin' }
        ],
        chips: [
          { id: 'g3', label: '將 (x² − 6x + 9) 打包在一起，− y² 留後面' },
          { id: 'sq', label: '寫成 (x − 3)² − y²' },
          { id: 'fin', label: '平方差分解 = (x − 3 + y)(x − 3 − y)！' },
          { id: 'bad', label: '每兩項分組 (x² − 6x) + (9 − y²)', wrongReason: 'x(x−6) 跟 (3+y)(3−y) 沒有共同公因式，分組會卡死！' }
        ],
        summary: '🏆 四項分解先看有沒有完全平方（3+1），沒有才用 2+2！'
      },
      badgeId: 'BADGE_MATH_8_2_4'
    },
    {
      id: 'MATH_8_2_5',
      badgeText: '📐 八年級數學｜單元 2-5',
      title: '一元二次方程式與配方法',
      subtitle: '幾何切半貼兩邊補缺角推導配方法，與十字道路平移靠邊秒列式',
      goldenRule: '配方法就是把長條切半貼兩側，補上「一半的平方」變正方形再直接開根號！',
      hints: ['方程式兩邊都有 (x−2) 時「絕對不能直接約掉」，因為 x=2 時你在除以 0，會把根殺掉！', '長方形開十字道路求剩餘草地：把馬路通通平移推到邊緣，直接 (長−x)(寬−x)！'],
      exploreTitle: '✂️ 幾何配方法手術台（x² + 6x = 7）',
      simType: 'm_complete_sq',
      engage: {
        question: '🚨 解 x(x − 2) = 3(x − 2) 時，小華直接把兩邊的 (x − 2) 約掉得到 x = 3，這樣對嗎？',
        options: [
          { label: 'A. 錯！直接約掉會把另一個真正的根 x = 2 給殺掉了！', correct: true, feedback: '太讚了！因為 (x−2) 可能是 0，必須全部移到左邊提公因式 (x−2)(x−3)=0 才能抓出兩個根！' },
          { label: 'B. 對啊，等量除法公理兩邊可以同除以 (x − 2)', correct: false, feedback: '把 x = 2 代回原式：2(0) = 3(0) 成立！等量除法嚴禁「除以 0」，約掉含 x 的因式必漏根！' }
        ]
      },
      principles: [
        '<strong>A × B = 0 原理：</strong>一定要先整理成右邊 = 0，才能說 A=0 或 B=0。',
        '<strong>配方法口訣：</strong>先讓 x² 係數變 1 → 常數移右邊 → 兩邊同加「一次項係數一半的平方」。'
      ],
      faqs: [
        { q: '判別式 D = b² − 4ac 問「有實數解」要用 > 0 還是 ≥ 0？', a: '重根 (D = 0) 也算有解！所以問「有解」一定要寫 D ≥ 0！' }
      ],
      trap: {
        question: '解一元二次方程式 x(x − 5) = 2(x − 5)，完整的解是？',
        misconceptionCode: 'MIS_CANCEL_VAR_ROOT',
        misconceptionDesc: '解方程式時直接約去含未知數因式 (x-5) 導致遺漏根 x=5',
        options: [
          { label: 'A. 只有 x = 2', correct: false, feedback: '把 x = 5 代進去：5×0 = 2×0 也是對的！你把 x = 5 消滅掉了！' },
          { label: 'B. 移項提公因式 (x − 5)(x − 2) = 0 → x = 5 或 2', correct: true, feedback: '完美避開漏根陷阱！永遠移到同一邊提公因式！' }
        ]
      },
      tactic: {
        code: 'ROAD_SHIFT_AREA',
        title: '長方形十字道路「平移靠邊法」一步列式',
        problemText: '長 20m、寬 14m 的草地，中間開一橫一直等寬 x 公尺的道路，剩餘草地面積 216 m²，如何列式？',
        slots: [
          { label: '步驟 1：把橫路推到頂端、直路推到最左邊', expectedId: 'push' },
          { label: '步驟 2：剩下的四塊草地無縫合體成長方形', expectedId: 'eq' },
          { label: '步驟 3：展開因式分解求路寬 x', expectedId: 'sol' }
        ],
        chips: [
          { id: 'push', label: '將兩條道路平移靠邊，免扣免補重疊十字架！' },
          { id: 'eq', label: '剩餘長方形長 (20 − x)、寬 (14 − x) → (20 − x)(14 − x) = 216' },
          { id: 'sol', label: 'x² − 34x + 64 = 0 → (x − 2)(x − 32) = 0 → 路寬 x = 2m（32 不合）' },
          { id: 'bad', label: '280 − 20x − 14x = 216', wrongReason: '忘記把中間重疊的十字交叉方塊 x² 加回來了！直接平移靠邊永遠不會漏！' }
        ],
        summary: '🏆 十字道路（就算畫成斜平行四邊形）通通「平移靠邊」秒變 (L−x)(W−x)！'
      },
      badgeId: 'BADGE_MATH_8_2_5'
    },
    {
      id: 'MATH_8_2_6',
      badgeText: '📐 八年級數學｜單元 2-6',
      title: '幾何圖形與全等三角形',
      subtitle: 'SSA 擺動圓規撞出兩交點反例，與會考摺疊題「必出等腰」三步破題',
      goldenRule: '全等就是條件把形狀和大小都鎖死；SSA 會盪出兩個三角形（直角 RHS 除外）。',
      hints: ['看角有沒有被兩條已知邊夾在正中間：夾在中間＝SAS（鎖死）；跑去旁邊＝SSA（鐘擺晃出兩個）。', '摺疊題三步驟：標對應全等 → 平行內錯角找等腰 → 設 x 配畢氏定理！'],
      exploreTitle: '🧭 SSA 擺動圓規反例實驗室',
      simType: 'm_ssa_compass',
      engage: {
        question: '📐 已知兩個三角形的「兩條邊長」與「其中一邊的對角」都相等（SSA），它們一定全等嗎？',
        options: [
          { label: 'A. 不一定！短邊像鐘擺一樣可以切出兩個不同三角形（銳角與鈍角）', correct: true, feedback: '答對！快進實驗室親手擺動短邊 BC 見證兩個交點！' },
          { label: 'B. 一定全等，只要有三個條件就夠了', correct: false, feedback: 'AAA（可放大縮小）跟 SSA（鐘擺雙交點）都不保證全等喔！' }
        ]
      },
      principles: [
        '<strong>五大有效全等：</strong>SSS、SAS、ASA、AAS、RHS（直角斜邊與一股）。',
        '<strong>摺疊軸對稱：</strong>摺痕為對稱軸，摺疊前後對應邊、對應角完全全等。'
      ],
      faqs: [
        { q: '看到雙正方形共用一個頂點問線段長度，輔助線怎麼想？', a: '立刻啟動「手拉手旋轉全等」：找繞共用頂點旋轉 90° 的兩個三角形必 SAS 全等！' }
      ],
      trap: {
        question: '下列哪一組條件「無法」保證兩個三角形一定全等？',
        misconceptionCode: 'MIS_SSA_CONGRUENT',
        misconceptionDesc: '誤以為 SSA 或 AAA 可以作為三角形全等性質',
        options: [
          { label: 'A. SSA（兩邊與其中一邊對角）', correct: true, feedback: '完全正確！SSA 只有在該角為 90° 且對邊為斜邊（RHS）時才唯一鎖死！' },
          { label: 'B. AAS（兩角與其中一角對邊）', correct: false, feedback: '兩角確定了，第三角自動用 180° 鎖死，所以 AAS 等同 ASA，是一定全等的！' }
        ]
      },
      tactic: {
        code: 'FOLD_ISOSCELES_PYTHAG',
        title: '會考長方形「紙片摺疊題」三步破題 SOP',
        problemText: '長方形紙片 ABCD（寬 6、長 8）沿對角線 BD 摺疊使 C 落在 C\'，求重疊部分 ΔEBD 的邊長 BE？',
        slots: [
          { label: '步驟 1：標記摺疊全等角', expectedId: 'eq_ang' },
          { label: '步驟 2：配平行線內錯角抓出等腰三角形', expectedId: 'iso' },
          { label: '步驟 3：設未知數 x 套畢氏定理求解', expectedId: 'pyth' }
        ],
        chips: [
          { id: 'eq_ang', label: '摺疊前後對應角相等：∠EBD = ∠CBD' },
          { id: 'iso', label: 'AD ∥ BC 得內錯角 ∠EDB = ∠CBD → ΔEBD 為等腰 (EB = ED = x)' },
          { id: 'pyth', label: '在直角 ΔABE 中：AE = 8 − x，列 6² + (8 − x)² = x² 解出 x = 25/4！' },
          { id: 'bad', label: '直接猜 E 是 AD 中點，設 AE = 4', wrongReason: '摺疊後 E 點通常不在中點，必須設 x 配畢氏定理算出精準值！' }
        ],
        summary: '🏆 只要看到「長方形＋摺疊」，反射動作就是：內錯角找等腰 → 設 x 算畢氏！'
      },
      badgeId: 'BADGE_MATH_8_2_6'
    },
    {
      id: 'MATH_8_2_7',
      badgeText: '📐 八年級數學｜單元 2-7',
      title: '等差數列與等比數列',
      subtitle: '階梯積木倒扣拼長方形證明級數和，與下標和相等秒算術',
      goldenRule: '算項數看間隔（相減）；算等差級數和就是把階梯倒扣拼成長方形再除 2！',
      hints: ['從第 3 階爬到第 8 階只爬了 8 − 3 = 5 步 (5d)，不用每次都回頭求首項 a₁！', '在等差數列裡，只要項數下標和一樣 (3+11 = 7+7)，數值總和就一樣 (a₃+a₁₁ = 2a₇)！'],
      exploreTitle: '🧱 等差階梯倒扣拼矩形證明器',
      simType: 'm_arith_stairs',
      engage: {
        question: '🪜 等差數列中已知 a₃ = 10、a₈ = 25，想求公差 d，必須先設首項 a₁ 解聯立嗎？',
        options: [
          { label: 'A. 不用！從第 3 階到第 8 階剛好爬 5 步，直接 (25−10) ÷ (8−3) = 3 秒算！', correct: true, feedback: '超快！把數列當爬樓梯看間隔，省下一大半計算時間！' },
          { label: 'B. 一定要先套 aₙ = a₁ + (n−1)d 解出 a₁ 才能算', correct: false, feedback: '太繞路了！兩項相減會直接把 a₁ 抵銷掉，a₈ − a₃ = 5d 一秒出公差！' }
        ]
      },
      principles: [
        '<strong>間隔公式：</strong>aₙ = aₘ + (n − m)d，頭尾都算的總項數則是 (末號 − 首號) + 1。',
        '<strong>梯形總和公式：</strong>複製一組倒扣拼成寬 (a₁+aₙ)、高 n 的大矩形，除 2 得總和。'
      ],
      faqs: [
        { q: '等比數列的公比可以是負數嗎？', a: '可以！例如 2, −4, 8, −16（公比 −2），數值會像心電圖一樣正負交替跳動！' }
      ],
      trap: {
        question: '從第 5 天開始存錢，一直存到第 12 天（第 5 天跟第 12 天都有存），總共存了幾天？',
        misconceptionCode: 'MIS_FENCEPOST_COUNT',
        misconceptionDesc: '計算頭尾皆含的項數時直接相減忘記加 1',
        options: [
          { label: 'A. 12 − 5 = 7 天', correct: false, feedback: '伸出手指數：5, 6, 7, 8, 9, 10, 11, 12 總共有 8 天！12 − 5 算的是「間隔數」，頭尾都算要 + 1！' },
          { label: 'B. (12 − 5) + 1 = 8 天', correct: true, feedback: '避開植樹節點陷阱！頭尾都含永遠「大減小再加 1」！' }
        ]
      },
      tactic: {
        code: 'ARITH_INDEX_SUM',
        title: '等差中項「下標和相等」免求首項秒殺術',
        problemText: '等差數列中已知 a₃ + a₇ + a₁₁ = 36，求 a₁ + a₁₃ 的值？',
        slots: [
          { label: '步驟 1：利用 3 + 11 = 7 + 7 化簡條件', expectedId: 's1' },
          { label: '步驟 2：直接求出中間項 a₇', expectedId: 's2' },
          { label: '步驟 3：利用 1 + 13 = 7 + 7 秒出答案', expectedId: 's3' }
        ],
        chips: [
          { id: 's1', label: 'a₃ + a₁₁ = 2a₇ → 原式變成 3a₇ = 36' },
          { id: 's2', label: '解出中項 a₇ = 12' },
          { id: 's3', label: 'a₁ + a₁₃ = 2a₇ = 2 × 12 = 24！' },
          { id: 'bad', label: '設 a₁ 與 d 嘗試解出 a₁ 的精確值', wrongReason: '只有一條方程式解不出兩個未知數 a₁ 與 d！必須靠對稱下標和直接消去！' }
        ],
        summary: '🏆 看到等差數列一堆項相加，馬上檢查「下標和」是否相等！'
      },
      badgeId: 'BADGE_MATH_8_2_7'
    },
    {
      id: 'MATH_9_3_1',
      badgeText: '📐 九年級數學｜單元 3-1',
      title: '相似形與三角比',
      subtitle: '投影放大面積變平方倍、A/8 字相似防呆與母子相似三大公式',
      goldenRule: '相似形角度不變、邊長同倍率縮放、面積變倍率平方；三角比是固定角度下的固定邊長比。',
      hints: ['A 字型求中間橫底邊 DE，千萬不能用「上：下」，一定要用「小三角邊：大三角整邊 (AD:AB)」！', '直角三角形斜邊上的高（母子相似）：高平方＝左段×右段！'],
      exploreTitle: '🔦 手電筒相似投影倍率與面積平方格',
      simType: 'm_similar_proj',
      engage: {
        question: '🎨 把一張牆壁海報的長和寬都等比例放大成原來的 3 倍，如果原本塗滿需要 1 桶油漆，放大後需要幾桶油漆？',
        options: [
          { label: 'A. 3 桶', correct: false, feedback: '長變 3 倍、寬也變 3 倍，面積變成 3 × 3 = 9 倍！只買 3 桶塗不到一半就沒漆了！' },
          { label: 'B. 3² = 9 桶（面積比＝邊長平方比）', correct: true, feedback: '答對！進投影實驗室親眼數數看方格數量！' }
        ]
      },
      principles: [
        '<strong>相似與三角比：</strong>固定銳角的直角三角形全部 AA 相似，所以對邊/斜邊 (sin) 永遠是固定常數。',
        '<strong>母子相似三大公式：</strong>CD² = AD×BD、AC² = AD×AB、BC² = BD×AB。'
      ],
      faqs: [
        { q: '三角形邊長放大 3 倍，內角 60° 也會變 180° 嗎？', a: '不會！三個角加起來永遠 180°，放大縮小只改邊長，角度鎖死不變！' }
      ],
      trap: {
        question: '在 ΔABC 中 DE ∥ BC，已知 AD = 2、DB = 3，請問橫邊 DE : BC = ？',
        misconceptionCode: 'MIS_SIMILAR_A_TOP_BOTTOM',
        misconceptionDesc: '在 A 字型相似中誤用上段比下段 (2:3) 當作橫底邊比',
        options: [
          { label: 'A. 2 : 3（上段比下段）', correct: false, feedback: '會考頭號陷阱！下面那塊是梯形不是三角形，必須用「小邊 AD : 大邊 AB = 2 : (2+3) = 2 : 5」！' },
          { label: 'B. 2 : 5（小三角邊 : 大三角整邊）', correct: true, feedback: '完美避雷！求中間橫邊永遠用「上 : 全長」！' }
        ]
      },
      tactic: {
        code: 'MOTHER_CHILD_SIMILAR',
        title: '直角三角形「母子相似」3 秒秒殺',
        problemText: '直角 ΔABC (∠C=90°) 作斜邊上的高 CD，已知左段 AD = 4、右段 BD = 9，求高 CD 與左股 AC？',
        slots: [
          { label: '步驟 1：套射影公式求斜邊上的高 CD', expectedId: 'h' },
          { label: '步驟 2：先算整條斜邊全長 AB', expectedId: 'ab' },
          { label: '步驟 3：套左股平方＝左段 × 整條斜邊', expectedId: 'ac' }
        ],
        chips: [
          { id: 'h', label: 'CD² = AD × BD = 4 × 9 = 36 → 高 CD = 6' },
          { id: 'ab', label: '斜邊總長 AB = 4 + 9 = 13' },
          { id: 'ac', label: 'AC² = AD × AB = 4 × 13 = 52 → AC = 2√13' },
          { id: 'bad', label: 'CD = (4 + 9) ÷ 2 = 6.5', wrongReason: '高是兩段的幾何平均 √(4×9)=6，不是算術平均喔！' }
        ],
        summary: '🏆 母子相似口訣：高方＝左×右，股方＝鄰段×全斜邊！'
      },
      badgeId: 'BADGE_MATH_9_3_1'
    },
    {
      id: 'MATH_9_3_2',
      badgeText: '📐 九年級數學｜單元 3-2',
      title: '圓的性質',
      subtitle: '圓周角滑動與半徑等腰展開證明、弧度統一心法與公切線平移',
      goldenRule: '半徑永遠一樣長（造等腰三角形），所以圓周角永遠只看到圓心角的一半角度！',
      hints: ['遇到圓的所有角度都以「弧度」當貨幣：圓心角 1 倍弧、圓周角 1/2 弧、圓內角兩弧平均、圓外角兩弧差一半！', '看到切線必連「圓心與切點」標上 90°！'],
      exploreTitle: '⭕ 圓周角頂點滑動與半徑輔助線證明器',
      simType: 'm_circle_angle',
      engage: {
        question: '🎬 電影院弧形銀幕固定在圓弧上，坐在圓周正後方跟坐在圓周左側看銀幕，誰的視角（圓周角）比較大？',
        options: [
          { label: 'A. 一樣大！只要頂點都在圓周上且看同一段弧，角度永遠是圓心角的一半', correct: true, feedback: '太讚了！進圓形畫布拖動頂點 P 並展開綠色半徑輔助線看證明！' },
          { label: 'B. 坐正後方比較大，坐旁邊角度會變超小', correct: false, feedback: '視覺容易騙人，其實同弧所對的圓周角全部一模一樣大！進下一步滑動看看！' }
        ]
      },
      principles: [
        '<strong>半圓圓周角必 90°：</strong>直徑對的圓心角 180°，一半永遠是 90° 直角。',
        '<strong>圓外切四邊形：</strong>因圓外一點兩切線段等長，故兩雙對邊和相等 (AB + CD = BC + AD)。'
      ],
      faqs: [
        { q: '外公切線跟內公切線長公式常搞反減號還是加號？', a: '平移小圓半徑建直角三角形：外公切線兩半徑在同側「相減 (R−r)」，內公切線在兩側「相加 (R+r)」！' }
      ],
      trap: {
        question: '圓內接四邊形 ABCD 與 圓外切四邊形 EFGH 的性質，下列何者正確？',
        misconceptionCode: 'MIS_CIRCLE_QUAD_SWAP',
        misconceptionDesc: '混淆圓內接四邊形（對角互補）與圓外切四邊形（對邊和相等）',
        options: [
          { label: 'A. 圓內接＝對邊和相等；圓外切＝對角互補', correct: false, feedback: '剛好記反了！頂點「在圓上（內接）」看的是圓周角加起來 360°÷2=180°（對角互補）；四邊「切在外面（外切）」看切線段等長（對邊和相等）！' },
          { label: 'B. 圓內接＝對角互補 180°；圓外切＝兩雙對邊和相等', correct: true, feedback: '一針見血！用「角在圓上、邊在圓外」永遠不記反！' }
        ]
      },
      tactic: {
        code: 'EXT_TANGENT_SHIFT',
        title: '兩圓外公切線「平移建直角三角形」SOP',
        problemText: '兩圓半徑 R = 8、r = 3，連心距 d = 13，求外公切線段長？',
        slots: [
          { label: '步驟 1：兩圓心各自連向切點標 90°', expectedId: 'perp' },
          { label: '步驟 2：平移外公切線通過小圓圓心形成直角 Δ', expectedId: 'shift' },
          { label: '步驟 3：斜邊 13、股長 (R−r)=5 套畢氏秒算', expectedId: 'pyth' }
        ],
        chips: [
          { id: 'perp', label: '圓心連切點得兩條平行半徑（垂直公切線）' },
          { id: 'shift', label: '將公切線平移至小圓圓心，大圓半徑剩下一段 R − r = 5' },
          { id: 'pyth', label: '以連心距 13 為斜邊 → 外公切線長 = √(13² − 5²) = 12！' },
          { id: 'bad', label: '用 √(13² − (8+3)²) = √48', wrongReason: 'R + r 是「內公切線」的做法，外公切線兩半徑在同側要相減！' }
        ],
        summary: '🏆 看到外公切線想 (R−r)，內公切線想 (R+r)，斜邊永遠是連心距 d！'
      },
      badgeId: 'BADGE_MATH_9_3_2'
    },
    {
      id: 'MATH_9_3_3',
      badgeText: '📐 九年級數學｜單元 3-3',
      title: '三角形的三心（外心、內心、重心）',
      subtitle: '動態拉成鈍角見證外心跑出外部，與直角 R=c/2、r=(a+b-c)/2 秒殺',
      goldenRule: '外心碰頂點（中垂）、內心擦三邊（角平）、重心找平衡（中線 2:1）。',
      hints: ['外心是外接圓圓心（到三頂點等距）；內心是內切圓圓心（到三邊等距）；重心是中線交點（6 塊等面積）。', '直角三角形斜邊中點就是外心 O，所以外接圓半徑 R = 斜邊一半！'],
      exploreTitle: '🔺 三角形三心同台變形實驗室',
      simType: 'm_triangle_centers',
      engage: {
        question: '🚒 要在三個村莊之間蓋一座消防局，希望到三個村莊（頂點）距離一模一樣，應該找三角形的哪一顆心？',
        options: [
          { label: 'A. 外心（外接圓圓心，到三頂點等距）', correct: true, feedback: '答對！如果是到三條馬路（三邊）等距才是找內心喔！' },
          { label: 'B. 內心（內切圓圓心）', correct: false, feedback: '內心是到「三條邊」等距；到「三個頂點」等距要找外心！' }
        ]
      },
      principles: [
        '<strong>外心 O（三中垂線）：</strong>銳角在內部、直角在斜邊中點、鈍角跑出外部。',
        '<strong>內心 I（三角平分線）：</strong>面積 = ½(a+b+c)r，三小塊面積比＝三邊長比。',
        '<strong>重心 G（三中線）：</strong>永遠在內部，頂點到重心：重心到中點 = 2 : 1。'
      ],
      faqs: [
        { q: '直角三角形三邊 6, 8, 10，外接圓與內切圓半徑怎麼 3 秒心算？', a: '外接圓 R = 斜邊÷2 = 5；內切圓 r = (兩股和 − 斜邊)÷2 = (6+8−10)÷2 = 2！' }
      ],
      trap: {
        question: '鈍角三角形的外心、內心、重心，有幾顆心會跑到三角形「外部」？',
        misconceptionCode: 'MIS_CENTERS_OUTSIDE',
        misconceptionDesc: '誤以為內心或重心也會跑到鈍角三角形外部',
        options: [
          { label: 'A. 只有「外心」會跑到外部（內心與重心永遠在內部）', correct: true, feedback: '完全正確！內切圓一定要躲在裡面，物理平衡點重心也永遠在板子內部！' },
          { label: 'B. 外心跟重心都會跑到外部', correct: false, feedback: '如果重心跑到木板外面，木板就不可能被撐平衡了！只有「外心」會跑出去！' }
        ]
      },
      tactic: {
        code: 'RIGHT_TRI_OG_DIST',
        title: '直角三角形「外心到重心距離 OG」會考壓軸速殺',
        problemText: '直角三角形三邊長 6, 8, 10，求外心 O 與重心 G 之間的距離 OG？',
        slots: [
          { label: '步驟 1：定位外心 O 就在斜邊中點', expectedId: 'o' },
          { label: '步驟 2：算出斜邊中線長（即外接圓半徑 R）', expectedId: 'r' },
          { label: '步驟 3：重心切中線 2:1 → OG 佔 1/3', expectedId: 'og' }
        ],
        chips: [
          { id: 'o', label: '直角 Δ 外心 O 剛好＝斜邊中點，所以直角頂點連 O 就是斜邊中線！' },
          { id: 'r', label: '斜邊中線長 ＝ 外接圓半徑 R = 10 ÷ 2 = 5' },
          { id: 'og', label: '重心 G 把中線切出 2:1，故 OG = (1/3) × 5 = 5/3！' },
          { id: 'bad', label: '直接拿 R − r = 5 − 2 = 3 當作 OG', wrongReason: '3 是兩半徑差，不是外心到重心距離！OG 永遠等於斜邊的 1/6！' }
        ],
        summary: '🏆 直角三角形外心到重心距離 OG 永遠＝斜邊 ÷ 6（此題 10/6 = 5/3）！'
      },
      badgeId: 'BADGE_MATH_9_3_3'
    },
    {
      id: 'MATH_9_3_5',
      badgeText: '📐 九年級數學｜單元 3-5',
      title: '統計圖表與機率',
      subtitle: '人頭排列打破盒狀圖「寬＝人多」迷思，與古典機率防漏算',
      goldenRule: '盒狀圖每段人數一樣多（各 25%），越窄越集中；硬幣沒記憶，機率看長期比例。',
      hints: ['盒狀圖把全班人排隊切三刀分成 4 群（各 25%），某段畫很寬只代表分數很分散！', '兩顆相同骰子算機率時，務必當成「一紅一白」畫 6×6 表格才不會漏算 (1,2) 與 (2,1)！'],
      exploreTitle: '📊 20 人等分 25% 盒狀圖透視器',
      simType: 'm_boxplot_prob',
      engage: {
        question: '📊 甲班 40 人的盒狀圖上，右半箱子（Q₂ 到 Q₃）畫得特別長，左半箱子畫得很短。請問哪一段的人數比較多？',
        options: [
          { label: 'A. 一樣多！每一段都剛好裝了 25%（10 人），只是右邊分數拉得很分散', correct: true, feedback: '太強了！這是會考統計圖表最愛考的觀念陷阱！' },
          { label: 'B. 右半箱子比較長，所以人數比較多', correct: false, feedback: '錯喔！進透視器拉動分數散開，親眼看每段人數計數器依然鎖死在 5 人 (25%)！' }
        ]
      },
      principles: [
        '<strong>四分位數意義：</strong>Q₁ (25%)、Q₂ 中位數 (50%)、Q₃ (75%)，箱子涵蓋中間最穩定的 50% 人口。',
        '<strong>獨立事件與大數法則：</strong>前 5 次硬幣全正面，第 6 次出現反面機率依然是 50%。'
      ],
      faqs: [
        { q: '「同時抽出兩顆球」跟「抽一顆不放回再抽第二顆」機率一樣嗎？', a: '完全一樣！第二次抽球時袋子裡總球數會少 1 顆，分母一定要減 1！' }
      ],
      trap: {
        question: '擲一枚公正硬幣已經連續出現 5 次正面，請問第 6 次出現「反面」的機率是？',
        misconceptionCode: 'MIS_GAMBLER_FALLACY',
        misconceptionDesc: '陷入賭徒謬誤，誤以為連出正面後下一次出現反面機率會變大',
        options: [
          { label: 'A. 大於 50%（為了平衡前面連出 5 次正面）', correct: false, feedback: '硬幣沒有腦袋也不會記仇！每次丟都是全新獨立事件，不會幫你補償平衡！' },
          { label: 'B. 依然剛好是 50% (1/2)', correct: true, feedback: '完全正確！破除賭徒謬誤！' }
        ]
      },
      tactic: {
        code: 'PROB_TWO_DICE_TABLE',
        title: '兩顆相同骰子「視同不同」6×6 表格防漏算',
        problemText: '同時丟出兩顆長得一模一樣的公正骰子，點數和為 7 的機率與點數和為 2 的機率誰大？',
        slots: [
          { label: '步驟 1：將相同骰子標記為紅、白兩顆', expectedId: 'color' },
          { label: '步驟 2：列出 6×6 = 36 種等機會組合', expectedId: 'grid' },
          { label: '步驟 3：數出和為 7 與和為 2 的格數比較', expectedId: 'cnt' }
        ],
        chips: [
          { id: 'color', label: '將兩骰視為獨立的紅骰與白骰（確保每格機會均等）' },
          { id: 'grid', label: '總樣本空間 = 6 × 6 = 36 種組合' },
          { id: 'cnt', label: '和為 7 有 (1,6)~(6,1) 共 6 種 (6/36=1/6)；和為 2 只有 (1,1) 共 1 種 (1/36) → 7 大 6 倍！' },
          { id: 'bad', label: '相同骰子 (1,6) 跟 (6,1) 只能算同一種', wrongReason: '如果只算一種，會讓 (1,6) 跟 (1,1) 被誤當成同樣機會，真實實驗中 (1,6) 出現機率是 (1,1) 的兩倍！' }
        ],
        summary: '🏆 算古典機率永遠把「相同物品標上 1 號、2 號」，確保分母每種情況機會相等！'
      },
      badgeId: 'BADGE_MATH_9_3_5'
    }
  ];

  SPECS.forEach(function (spec) {
    global.JuniorUnits[spec.id] = create(spec);
  });
})(window);
