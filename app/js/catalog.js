/* ==========================================================================
   catalog.js — 台灣 108 課綱國中全科 43 單元完整目錄（100% 互動實作）
   ========================================================================== */
(function (global) {
  'use strict';

  var UNITS = [
    // ==================== 📐 數學科（18 單元） ====================
    {
      id: 'MATH_7_1_1',
      subject: 'math',
      subjectLabel: '數學',
      grade: '7',
      code: '數 1-1',
      title: '整數、負數與數線',
      summary: '熱氣球沙包模型、青蛙時間倒帶理解負負得正，破解直線雙解與絕對值距離。',
      tags: ['負負得正', '絕對值＝距離', '數線雙解'],
      implemented: true,
      phase: 'Phase 1'
    },
    {
      id: 'MATH_7_1_2',
      subject: 'math',
      subjectLabel: '數學',
      grade: '7',
      code: '數 1-2',
      title: '分數的四則運算與因倍數',
      summary: '包含除倒數原理、披薩等分通分與 GCD/LCM 切拼實戰。',
      tags: ['包含除＝乘倒數', '公因數切分'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'MATH_7_1_3',
      subject: 'math',
      subjectLabel: '數學',
      grade: '7',
      code: '數 1-3',
      title: '一元一次方程式',
      summary: '雙軌同步動態天平破解「移項為何變號」，搭配年齡差不變步驟積木槽。',
      tags: ['等量公理天平', '移項變號原理', '年齡差速解'],
      implemented: true,
      phase: 'Phase 1'
    },
    {
      id: 'MATH_7_1_4',
      subject: 'math',
      subjectLabel: '數學',
      grade: '7',
      code: '數 1-4',
      title: '二元一次聯立方程式與坐標',
      summary: '兩直線交點即為共同解、平行無解視覺化，與濃度十字槓桿法。',
      tags: ['直線交點', '鶴龜假設法'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'MATH_7_1_5',
      subject: 'math',
      subjectLabel: '數學',
      grade: '7',
      code: '數 1-5',
      title: '比例與正反比',
      summary: '齒輪反比與過原點直線，破解「一起變大就是正比」高頻迷思。',
      tags: ['商固定 vs 積固定', '設 r 倍數法'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'MATH_7_1_6',
      subject: 'math',
      subjectLabel: '數學',
      grade: '7',
      code: '數 1-6',
      title: '一元一次不等式',
      summary: '數線 180° 照鏡子翻轉動畫，直觀解釋乘除負數為何反轉不等號。',
      tags: ['數線翻轉變號', '方案臨界點'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'MATH_8_2_1',
      subject: 'math',
      subjectLabel: '數學',
      grade: '8',
      code: '數 2-1',
      title: '乘法公式',
      summary: '面積拼圖打臉 (a+b)²=a²+b²，與差平方重疊小角補回動畫。',
      tags: ['面積拼圖', '恆等變形'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'MATH_8_2_2',
      subject: 'math',
      subjectLabel: '數學',
      grade: '8',
      code: '數 2-2',
      title: '多項式四則運算',
      summary: '幾何維度方塊解釋同類項合併，以及降冪補零直式除法。',
      tags: ['維度方塊', '除法原理'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'MATH_8_2_3',
      subject: 'math',
      subjectLabel: '數學',
      grade: '8',
      code: '數 2-3',
      title: '平方根與畢氏定理',
      summary: '水車面積證明 a²+b²=c²、3D 立體表面展開最短路徑與反例拆根號。',
      tags: ['面積守恆', '展開圖最短路徑'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'MATH_8_2_4',
      subject: 'math',
      subjectLabel: '數學',
      grade: '8',
      code: '數 2-4',
      title: '因式分解與十字交乘法',
      summary: '長方形面積重拼與密碼鎖轉盤，理解橫著寫括號的幾何來源。',
      tags: ['逆向拼圖', '換元整體代換'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'MATH_8_2_5',
      subject: 'math',
      subjectLabel: '數學',
      grade: '8',
      code: '數 2-5',
      title: '一元二次方程式與配方法',
      summary: '幾何切半貼兩邊補缺角推導配方法，與十字道路平移靠邊列式。',
      tags: ['補角正方形', '道路平移靠邊'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'MATH_8_2_6',
      subject: 'math',
      subjectLabel: '數學',
      grade: '8',
      code: '數 2-6',
      title: '幾何圖形與全等三角形',
      summary: 'SSA 擺動圓規撞出兩交點反例，搭配摺疊軸對稱與手拉手旋轉。',
      tags: ['SSA 擺動反例', '摺疊必出等腰'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'MATH_8_2_7',
      subject: 'math',
      subjectLabel: '數學',
      grade: '8',
      code: '數 2-7',
      title: '等差數列與等比數列',
      summary: '階梯積木倒扣拼矩形證明級數和，與下標和相等秒算技巧。',
      tags: ['倒扣梯形圖解', '等差中項'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'MATH_9_3_1',
      subject: 'math',
      subjectLabel: '數學',
      grade: '9',
      code: '數 3-1',
      title: '相似形與三角比',
      summary: '投影放大面積變平方倍、母子相似三大公式與三角比固定比值。',
      tags: ['A/8 字相似', '母子相似'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'MATH_9_3_2',
      subject: 'math',
      subjectLabel: '數學',
      grade: '9',
      code: '數 3-2',
      title: '圓的性質',
      summary: '半徑等腰展開證明圓周角＝一半圓心角，與公切線平移建直角三角形。',
      tags: ['弧度統一心法', '公切線平移'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'MATH_9_3_3',
      subject: 'math',
      subjectLabel: '數學',
      grade: '9',
      code: '數 3-3',
      title: '三角形的三心',
      summary: '動態頂點拖曳見證鈍角外心跑出外部，與直角 R=c/2、r=(a+b-c)/2。',
      tags: ['三心不混淆', '直角 R/r 秒殺'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'MATH_9_3_4',
      subject: 'math',
      subjectLabel: '數學',
      grade: '9',
      code: '數 3-4',
      title: '二次函數（拋物線）',
      summary: '籃球投籃實驗室！用「讓括號歸零」秒懂左加右減，搭配圍牆裁切與兩根平均法。',
      tags: ['歸零法破平移', '圍牆裁切極值', '兩根平均秒頂點'],
      implemented: true,
      phase: 'Phase 1'
    },
    {
      id: 'MATH_9_3_5',
      subject: 'math',
      subjectLabel: '數學',
      grade: '9',
      code: '數 3-5',
      title: '統計圖表與機率',
      summary: '人頭排列打破盒狀圖「寬＝人多」錯覺，搭配高爾頓彈珠台大數法則。',
      tags: ['每段皆 25%', '賭徒謬誤'],
      implemented: true,
      phase: 'Phase 3'
    },

    // ==================== 🔬 自然科（16 單元） ====================
    {
      id: 'SCI_7_1_1',
      subject: 'science',
      subjectLabel: '自然・生物',
      grade: '7',
      code: '自 1-1',
      title: '細胞構造與物質進出',
      summary: '細胞膜微觀透視與植物細胞壁抗爆，搭配複式顯微鏡倒像口訣。',
      tags: ['滲透與膨壓', '顯微鏡移動'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'SCI_7_1_2',
      subject: 'science',
      subjectLabel: '自然・生物',
      grade: '7',
      code: '自 1-2',
      title: '光合作用與消化系統',
      summary: 'LIS 柳樹吃空氣長大實驗、酵素高溫燙熟變形 vs 低溫休眠曲線。',
      tags: ['碳來自 CO₂', '酵素變性不可逆'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'SCI_7_1_3',
      subject: 'science',
      subjectLabel: '自然・生物',
      grade: '7',
      code: '自 1-3',
      title: '循環系統（心臟與血液）',
      summary: '破除動脈必充氧迷思，魚尾鰭分合血流判讀與肝門／腎靜脈養分排序。',
      tags: ['離心為動', '肺動脈流減氧血'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'SCI_7_1_4',
      subject: 'science',
      subjectLabel: '自然・生物',
      grade: '7',
      code: '自 1-4',
      title: '神經、內分泌與恆定性',
      summary: '先縮手才覺得痛的時間差賽跑動畫，與神經切斷位置推理。',
      tags: ['反射路徑時間差', '負回饋恆溫'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'SCI_7_1_5',
      subject: 'science',
      subjectLabel: '自然・生物',
      grade: '7',
      code: '自 1-5',
      title: '遺傳、細胞分裂與孟德爾',
      summary: '減數分裂為何砍半對照，與譜系圖「無中生有定隱性」秒殺術。',
      tags: ['減數分裂 2 次', '譜系圖推論'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'SCI_7_1_6',
      subject: 'science',
      subjectLabel: '自然・生物',
      grade: '7',
      code: '自 1-6',
      title: '生態系與食物鏈',
      summary: '10% 能量散熱漏斗 vs 重金屬毒物頂端大濃縮對照沙盒。',
      tags: ['10% 能量金字塔', '生物放大'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'SCI_8_2_1',
      subject: 'science',
      subjectLabel: '自然・理化',
      grade: '8',
      code: '自 2-1',
      title: '物質狀態、密度與浮力',
      summary: 'LIS 阿基米德溢水秤！證實沉底石頭仍有浮力，結合三態微觀分子與 M-V 圖去皮重。',
      tags: ['沉體也有浮力', '鐵捏成船', 'M-V 相減去皮重'],
      implemented: true,
      phase: 'Phase 1'
    },
    {
      id: 'SCI_8_2_2',
      subject: 'science',
      subjectLabel: '自然・理化',
      grade: '8',
      code: '自 2-2',
      title: '聲波與光學',
      summary: '除草機折射偏轉動畫、兩條光線推導凸透鏡成像與移動鳴笛回聲。',
      tags: ['波不搬運物質', '兩線透鏡成像'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'SCI_8_2_3',
      subject: 'science',
      subjectLabel: '自然・理化',
      grade: '8',
      code: '自 2-3',
      title: '熱學（比熱與狀態變化）',
      summary: '比熱溫度頑固度、海陸風循環與狀態平台期「拆分子牽手」潛熱微觀鏡。',
      tags: ['加熱平台期', '比熱斜率比較'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'SCI_8_2_4',
      subject: 'science',
      subjectLabel: '自然・理化',
      grade: '8',
      code: '自 2-4',
      title: '化學反應與質量守恆',
      summary: '密閉玻璃罩拆穿燃燒變輕假象，搭配限量試劑「除以係數法」配對槽。',
      tags: ['原子樂高重拼', '限量試劑秒殺'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'SCI_8_2_5',
      subject: 'science',
      subjectLabel: '自然・理化',
      grade: '8',
      code: '自 2-5',
      title: '氧化還原與酸鹼鹽',
      summary: '金屬搶氧拔河與滴定微觀離子舞池，視覺呈現當量點為何瞬間變色。',
      tags: ['搶氧拔河＝劑/被', 'aMaVa=bMbVb'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'SCI_9_3_1',
      subject: 'science',
      subjectLabel: '自然・理化',
      grade: '9',
      code: '自 3-1',
      title: '直線運動與牛頓定律',
      summary: '推不動＝摩擦力剛好等於推力、v-t 圖面積求位移與連接體系統法。',
      tags: ['靜摩擦反制表', 'v-t 面積位移'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'SCI_9_3_2',
      subject: 'science',
      subjectLabel: '自然・理化',
      grade: '9',
      code: '自 3-2',
      title: '功、能與簡單機械',
      summary: '雲霄飛車摩擦力熱能轉換、垂直無做功與動滑輪「剪刀橫切數繩法」。',
      tags: ['機械不能省功', '橫切數繩法'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'SCI_9_3_3',
      subject: 'science',
      subjectLabel: '自然・理化',
      grade: '9',
      code: '自 3-3',
      title: '基本電路、歐姆定律與電磁',
      summary: '自由電子背能量包動畫證實電流不被吃掉！含並聯過載熔斷、串並聯亮度與關鍵字圈選。',
      tags: ['電子能量背包', '並聯過載跳電', '亮度功率切換'],
      implemented: true,
      phase: 'Phase 1'
    },
    {
      id: 'SCI_9_3_4',
      subject: 'science',
      subjectLabel: '自然・地科',
      grade: '9',
      code: '自 3-4',
      title: '地球構造、板塊與天氣圖',
      summary: '3D 台灣聚合造山、地層「截切定律」定老新與鋒面高低氣壓右手定則。',
      tags: ['海底也有板塊', '地層切穿年輕'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'SCI_9_3_5',
      subject: 'science',
      subjectLabel: '自然・地科',
      grade: '9',
      code: '自 3-5',
      title: '天文：日地月與潮汐',
      summary: '手電筒直射斜射網格破除日地距離四季迷思，與潮汐每日晚 50 分鐘推算。',
      tags: ['23.5° 直射斜射', '月相 vs 月食'],
      implemented: true,
      phase: 'Phase 2'
    },

    // ==================== 🌍 社會科（9 單元） ====================
    {
      id: 'SOC_G1_C3',
      subject: 'social',
      subjectLabel: '社會・地／公',
      grade: '7',
      code: '社 G-1/C-3',
      title: '台灣地形焚風與供需法則',
      summary: '雙主題互動館：模擬季風爬越中央山脈凝結下雨與乾熱焚風；手搖飲定價動點 vs 移線模擬！',
      tags: ['迎風降雨/背風焚風', '動點(量) vs 移線(需求)'],
      implemented: true,
      phase: 'Phase 1'
    },
    {
      id: 'SOC_7_G2',
      subject: 'social',
      subjectLabel: '社會・地理',
      grade: '7',
      code: '社 G-2',
      title: '中國地形、氣候與水文',
      summary: '三級階梯水力渦輪落差與秦嶺—淮河（0°C、800mm）南北米麵分界透視。',
      tags: ['西高東低', '秦嶺淮河'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'SOC_8_G3',
      subject: 'social',
      subjectLabel: '社會・地理',
      grade: '8',
      code: '社 G-3',
      title: '世界氣候區與行星風帶',
      summary: '太陽直射擺動牽引高壓與西風帶，視覺破解地中海「夏乾冬雨」成因。',
      tags: ['風帶季移', '暖涼流影響'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'SOC_7_H1',
      subject: 'social',
      subjectLabel: '社會・歷史',
      grade: '7',
      code: '社 H-1',
      title: '台灣歷史朝代演進',
      summary: '大航海十字路口航線與「一府二鹿三艋舺」茶葉樟腦北移因果地圖。',
      tags: ['海洋轉運站', '重心北移因果'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'SOC_8_H2',
      subject: 'social',
      subjectLabel: '社會・歷史',
      grade: '8',
      code: '社 H-2',
      title: '中國歷史版圖與東亞白銀',
      summary: '400mm 等雨量線農牧拉鋸軸與美洲日本白銀流進明清中國的全球網。',
      tags: ['400mm 農牧線', '全球白銀網'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'SOC_9_H3',
      subject: 'social',
      subjectLabel: '社會・歷史',
      grade: '9',
      code: '社 H-3',
      title: '世界近代變革、大戰與冷戰',
      summary: '工業革命推倒新帝國主義、凡爾賽條約與大恐慌骨牌直通二戰與冷戰。',
      tags: ['因果骨牌推演', '恐怖平衡'],
      implemented: true,
      phase: 'Phase 2'
    },
    {
      id: 'SOC_7_C1',
      subject: 'social',
      subjectLabel: '社會・公民',
      grade: '7',
      code: '社 C-1',
      title: '社會規範與法律基礎',
      summary: '三秒法律分流管：民法賠錢、刑法罰金坐牢、行政法罰鍰與少年司法。',
      tags: ['罰金 vs 罰鍰', '少年保護優先'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'SOC_8_C2',
      subject: 'social',
      subjectLabel: '社會・公民',
      grade: '8',
      code: '社 C-2',
      title: '政府體制、選舉與民主參與',
      summary: '五權制衡齒輪比較獨裁模式，與多數暴力不得侵害少數基本人權護罩。',
      tags: ['權力制衡', '多數尊重少數'],
      implemented: true,
      phase: 'Phase 3'
    },
    {
      id: 'SOC_9_REVIEW',
      subject: 'social',
      subjectLabel: '社會・跨科',
      grade: '9',
      code: '社 統整',
      title: '九年級社會跨科素養統整',
      summary: '結合地緣政治、全球經貿與公民思辨的 108 會考多文本跨領域模擬題組。',
      tags: ['地緣與歷史', '跨科圖表判讀'],
      implemented: true,
      phase: 'Phase 3'
    }
  ];

  global.JuniorCatalog = {
    UNITS: UNITS,
    getById: function (id) {
      for (var i = 0; i < UNITS.length; i++) {
        if (UNITS[i].id === id) return UNITS[i];
      }
      return null;
    }
  };
})(window);
