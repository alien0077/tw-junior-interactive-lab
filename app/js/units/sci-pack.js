/* ==========================================================================
   sci-pack.js — 自然科其餘 14 個完整互動單元（補齊全 16 個自然單元）
   ========================================================================== */
(function (global) {
  'use strict';

  var create = global.JuniorSimEngines.createUnitFromSpec;

  var SPECS = [
    {
      id: 'SCI_7_1_1',
      badgeText: '🔬 七年級自然生物｜單元 1-1',
      title: '細胞構造與物質進出',
      subtitle: '動植物細胞滲透壓對照、細胞壁抗爆，與複式顯微鏡倒像移動口訣',
      goldenRule: '分子永遠從擁擠處往空曠處擴散；植物有硬殼（細胞壁）護體，泡純水也不會爆！',
      hints: ['主角是「水」穿過半透膜叫滲透，其餘氣體小分子都叫擴散。', '複式顯微鏡看的是上下左右顛倒 (轉 180°) 的像，口訣：「影像偏哪裡，玻片就往哪裡推」！'],
      exploreTitle: '🧫 紅血球 vs 植物細胞滲透壓沙盒',
      simType: 's_cell_osmosis',
      engage: {
        question: '🩸 把紅血球與洋蔥表皮細胞同時丟進純水中，為什麼只有紅血球「砰」一聲脹破了？',
        options: [
          { label: 'A. 植物細胞外面多了堅硬的「細胞壁」頂住膨脹壓力，不會破！', correct: true, feedback: '答對！快進滲透沙盒切換純水、生理食鹽水與濃鹽水看看！' },
          { label: 'B. 因為水分子無法滲透進入植物細胞', correct: false, feedback: '水一樣會衝進植物細胞（讓它變硬挺飽滿），只是外面有細胞壁像鋼籠一樣撐住沒破！' }
        ]
      },
      principles: [
        '<strong>半透膜挑食：</strong>水與氣體直接擴散；葡萄糖走通道蛋白；澱粉太大過不去。',
        '<strong>高張／等張／低張：</strong>濃鹽水讓細胞失水萎縮；生理食鹽水動態平衡；純水讓動物細胞脹破。'
      ],
      faqs: [
        { q: '濃鹽水醃小黃瓜出水，是鹽巴跑進去把水擠出來嗎？', a: '錯！鹽巴進不去細胞膜，是細胞裡面的「水」為了稀釋外面超鹹的鹽水自己往外衝！' },
        { q: '複式顯微鏡視野裡草履蟲偏「右上方」，玻片要往哪邊移？', a: '口訣「偏哪推哪」→ 玻片直接往「右上方」推，草履蟲就會滑進正中央！' }
      ],
      trap: {
        question: '在複式顯微鏡下觀察寫著英文字母「b」的玻片，視野中會看到哪個字母？',
        misconceptionCode: 'MIS_MICROSCOPE_FLIP',
        misconceptionDesc: '複式顯微鏡只做左右相反或上下顛倒，忘記是旋轉 180°',
        options: [
          { label: 'A. 變成 d（只左右相反）', correct: false, feedback: '複式顯微鏡是「上下顛倒＋左右相反」，等於把紙轉 180° 變成 q！' },
          { label: 'B. 變成 q（上下顛倒＋左右相反＝旋轉 180°）', correct: true, feedback: '完全正確！考試直接把考卷倒過來看就秒解！' }
        ]
      },
      tactic: {
        code: 'MICROSCOPE_HIGH_POWER',
        title: '高倍物鏡切換四特徵秒辨',
        problemText: '將複式顯微鏡由 100× 切換為 400×（放大 4 倍），視野亮度、細胞大小與單排細胞數目如何變化？',
        slots: [
          { label: '步驟 1：物鏡變長離玻片變近，進光量變少', expectedId: 'dark' },
          { label: '步驟 2：單顆細胞放大 4 倍，視野範圍縮窄', expectedId: 'big' },
          { label: '步驟 3：原本排成一排 12 顆細胞只剩幾顆？', expectedId: 'cnt' }
        ],
        chips: [
          { id: 'dark', label: '視野變暗（需改用大光圈或凹面鏡聚光）' },
          { id: 'big', label: '細胞變大、看到的實際區域變小' },
          { id: 'cnt', label: '單排數目變 12 ÷ 4 = 3 顆（若鋪滿圓面積則除以 4² = 16）' },
          { id: 'bad', label: '放大後視野更亮、看到的細胞變多', wrongReason: '倍率越高進光越少（變暗），因為只聚焦極小區域，細胞數目一定變少！' }
        ],
        summary: '🏆 高倍鏡口訣：「鏡長、影大、數少、視野暗」！'
      },
      badgeId: 'BADGE_SCI_7_1_1'
    },
    {
      id: 'SCI_7_1_2',
      badgeText: '🔬 七年級自然生物｜單元 1-2',
      title: '光合作用與消化系統',
      subtitle: 'LIS 柳樹吃空氣 CO₂ 長大、酵素高溫燙熟不可逆與澱粉檢驗步驟',
      goldenRule: '植物主要吃空氣和水長大（24 小時都在呼吸）；酵素怕高溫燙熟變形，不怕低溫冬眠！',
      hints: ['蛋白質酵素高溫加熱就像煮熟雞蛋，立體形狀被永久破壞，降溫也救不回來！', '光合作用去葉綠素必須用「酒精隔水加熱」（酒精易燃絕不能直接火燒）！'],
      exploreTitle: '🧪 酵素溫度鐘形曲線（試先拉到 65°C 再降回！）',
      simType: 's_photo_enzyme',
      engage: {
        question: '🌳 一棵 2 公斤小柳樹 5 年長成 76 公斤大樹，花盆土壤只少了 50 公克！長出來的 74 公斤樹幹材料從哪來？',
        options: [
          { label: 'A. 來自空氣中的二氧化碳 (CO₂) 與根吸上來的水！', correct: true, feedback: '答對！打破「植物靠吃土長大」的世紀迷思！' },
          { label: 'B. 全部來自我們倒進土裡的化學肥料', correct: false, feedback: '肥料只提供微量礦物質，構成樹幹纖維素的碳原子絕大多數來自空氣中的 CO₂！' }
        ]
      },
      principles: [
        '<strong>24 小時呼吸：</strong>植物白天黑夜都在行呼吸作用，只是白天光合作用太強蓋過了呼吸。',
        '<strong>膽汁無酵素：</strong>膽汁像洗碗精「乳化」大油滴變小油滴增加接觸面積，不含消化酵素。'
      ],
      faqs: [
        { q: '碘液、本氏液、澄清石灰水各自檢驗什麼？', a: '碘液檢「澱粉」變藍黑；本氏液＋隔水加熱檢「葡萄糖」變綠黃橙紅；澄清石灰水檢「CO₂」變白色混濁！' }
      ],
      trap: {
        question: '把唾液澱粉酶先煮沸到 80°C，再冷卻回人體最適溫度 37°C，請問它還能分解澱粉嗎？',
        misconceptionCode: 'MIS_ENZYME_HEAT_REVERSIBLE',
        misconceptionDesc: '誤以為高溫失活的酵素降溫後可恢復活性',
        options: [
          { label: 'A. 可以，回到 37°C 就恢復了', correct: false, feedback: '煮熟的雞蛋冰回冰箱會變回生雞蛋嗎？高溫會永久破壞酵素蛋白質結構！' },
          { label: 'B. 不能！高溫已永久變性（若是先冰在 0°C 再回溫 37°C 才可以）', correct: true, feedback: '精準區分「低溫休眠（可逆）」與「高溫變性（不可逆）」！' }
        ]
      },
      tactic: {
        code: 'PHOTO_STARCH_STEPS',
        title: '葉片光合作用澱粉檢驗實驗步驟排序',
        problemText: '檢驗照光葉片是否產生澱粉，正確的實驗操作順序為何？',
        slots: [
          { label: '步驟 1：軟化角質與細胞膜', expectedId: 'boil' },
          { label: '步驟 2：安全溶出葉綠素褪色', expectedId: 'alc' },
          { label: '步驟 3：漂洗後滴入試劑觀察變色', expectedId: 'iod' }
        ],
        chips: [
          { id: 'boil', label: '將葉片放入滾燙熱水中煮沸數分鐘' },
          { id: 'alc', label: '放入酒精中「隔水加熱」溶出葉綠素（防酒精起火）' },
          { id: 'iod', label: '熱水漂洗後滴入「碘液」，有澱粉處變藍黑色！' },
          { id: 'bad', label: '直接拿酒精燈對裝酒精的燒杯直火加熱', wrongReason: '酒精燃點極低直接火燒會起火爆炸，務必隔水加熱！' }
        ],
        summary: '🏆 口訣：「熱水煮軟 → 酒精隔水褪綠 → 漂洗滴碘液變藍黑」！'
      },
      badgeId: 'BADGE_SCI_7_1_2'
    },
    {
      id: 'SCI_7_1_3',
      badgeText: '🔬 七年級自然生物｜單元 1-3',
      title: '循環系統（心臟與血液）',
      subtitle: '破除「動脈必充氧」迷思、肺循環 vs 體循環與血管養分排序',
      goldenRule: '動靜脈看方向（離心為動、回心為靜）；充氧減氧看左右（心左鮮紅、心右暗藍）！',
      hints: ['肺動脈要把全身用完的暗紅缺氧血「推出心臟」送去肺部吸氧，所以肺動脈流的是減氧血！', '飯後血糖最高＝肝門靜脈；尿素廢物最乾淨＝腎靜脈！'],
      exploreTitle: '🫀 心臟四腔室與體／肺循環動畫',
      simType: 's_circulation',
      engage: {
        question: '🫀 有一條血管叫「肺動脈」，裡面流著暗紅缺氧血；既然是減氧血，為什麼不叫它肺靜脈？',
        options: [
          { label: 'A. 因為動靜脈是按「血流方向（離開心臟＝動脈）」命名的，不是看含氧量！', correct: true, feedback: '一針見血！進心臟模擬器切換肺循環與體循環看清楚！' },
          { label: 'B. 因為肺動脈裡的血其實是充氧血', correct: false, feedback: '剛從右心室推出去肺部準備換氣的血最缺氧！流完肺泡回來的「肺靜脈」才是充氧血！' }
        ]
      },
      principles: [
        '<strong>左心室肌肉最厚：</strong>要把血打上大腦與腳趾頭（體循環距離超遠），需要最強馬達。',
        '<strong>顯微鏡看小魚尾鰭：</strong>水流從大分支變細＝小動脈；從細匯聚成大條＝小靜脈。'
      ],
      faqs: [
        { q: '哪條血管尿素含量最低？肝靜脈還是腎靜脈？', a: '是「腎靜脈」（剛被腎臟過濾洗掉尿素）！肝臟是把氨轉成尿素的工廠，尿素反而多！' }
      ],
      trap: {
        question: '下列關於人體血管的敘述，何者「正確」？',
        misconceptionCode: 'MIS_ARTERY_ALWAYS_OXYGEN',
        misconceptionDesc: '誤以為所有動脈皆流充氧血、所有靜脈皆流減氧血',
        options: [
          { label: 'A. 所有動脈都流鮮紅充氧血', correct: false, feedback: '肺動脈流的是暗藍減氧血！動靜脈只看離開心臟或回到心臟！' },
          { label: 'B. 肺靜脈流的是充氧血，且瓣膜功能皆為防止血液倒流', correct: true, feedback: '完全正確！肺靜脈剛從肺泡吸飽氧氣回到左心房！' }
        ]
      },
      keywordRadar: {
        code: 'FISH_TAIL_VESSEL',
        title: '顯微鏡觀察小魚尾鰭審題關鍵字（找出 2 個關鍵詞）',
        tokens: [
          { text: '小華以 ', plain: true },
          { text: '複式顯微鏡', isTrapKey: true, note: '視野上下左右顛倒！若問「實際心臟在魚身哪側」要跟影像方向反過來！' },
          { text: ' 觀察小魚尾鰭，發現甲血管血流由大管 ', plain: true },
          { text: '分支流向細管', isTrapKey: true, note: '分支變細永遠是「小動脈」（匯集變粗是小靜脈），不受倒像影響！' },
          { text: '，請判斷甲血管種類與心臟實際位置。', plain: true }
        ],
        unlockedHtml: '🏆 <strong>雙重防呆過關！</strong>分支＝小動脈、匯集＝小靜脈；但判斷真實左右方位記得複式顯微鏡倒轉 180°！'
      },
      badgeId: 'BADGE_SCI_7_1_3'
    },
    {
      id: 'SCI_7_1_4',
      badgeText: '🔬 七年級自然生物｜單元 1-4',
      title: '神經、內分泌與恆定性',
      subtitle: '先縮手後喊痛時間差賽跑、神經受損推理與血糖負回饋',
      goldenRule: '脖子以下急煞反射找脊髓、頭部反射找腦幹、想事情找大腦；唯一降血糖只有胰島素！',
      hints: ['路徑：受器 → 感覺神經 → 脊髓/大腦 → 運動神經 → 肌肉。能感覺不能動＝運動神經斷；沒感覺能動＝感覺神經斷！', '唯一降血糖的是胰島素；升糖素與腎上腺素都是升血糖！'],
      exploreTitle: '⚡ 神經傳導雙軌時間差賽跑器',
      simType: 's_nerve_reflex',
      engage: {
        question: '🔥 手不小心碰到滾燙熱鍋時，為什麼你總是「先縮手」才來得及「大喊好痛」？',
        options: [
          { label: 'A. 縮手反射在「脊髓」就先走捷徑急煞了，痛覺訊號要再往上爬到大腦才慢半拍感覺痛！', correct: true, feedback: '完全正確！進實驗室按「被針扎」看藍光與紅光賽跑！' },
          { label: 'B. 因為大腦決定先縮手，過一秒才決定要痛', correct: false, feedback: '等大腦想完手早熟了！急煞保護反射是不經大腦、由脊髓直接下令的！' }
        ]
      },
      principles: [
        '<strong>神經 vs 內分泌：</strong>神經電訊號超快短暫精準；內分泌血液傳激素較慢但影響久且廣。',
        '<strong>恆定負回饋：</strong>像冷氣恆溫器，飯後血糖高靠胰島素存成肝糖，飢餓時靠升糖素拆回血糖。'
      ],
      faqs: [
        { q: '眨眼、瞳孔縮小、流口水也經過脊髓嗎？', a: '不用！脖子以上頭臉部的反射直接由「腦幹」管，不用繞遠路去脊髓！' }
      ],
      trap: {
        question: '某病患被醫師針扎腳底時「覺得很痛，但大腦想動腳趾卻完全動不了」，最可能是哪條線路受損？',
        misconceptionCode: 'MIS_NERVE_DAMAGE_SWAP',
        misconceptionDesc: '混淆感覺神經受損與運動神經受損的臨床症狀',
        options: [
          { label: 'A. 感覺神經受損', correct: false, feedback: '如果感覺神經斷了，他根本不會覺得痛！他有痛覺代表進去大腦的線路是好的！' },
          { label: 'B. 運動神經受損（訊息進得去、命令出不來）', correct: true, feedback: '邏輯超清晰！有感覺＝感覺神經正常；不能動＝運動神經斷裂！' }
        ]
      },
      tactic: {
        code: 'BLOOD_SUGAR_CURVE',
        title: '血糖折線圖雙激素調控拆解',
        problemText: '某人中午吃完大餐 1 小時後血糖衝高，接著下午跑 3000 公尺血糖下降，體內哪兩個激素依序上場救援？',
        slots: [
          { label: '步驟 1：飯後血糖衝高 → 降血糖存肝糖', expectedId: 'ins' },
          { label: '步驟 2：長跑消耗血糖偏低 → 拆肝糖救援', expectedId: 'glu' }
        ],
        chips: [
          { id: 'ins', label: '胰島素分泌增加（全身唯一降血糖激素！）' },
          { id: 'glu', label: '升糖素（與腎上腺素）分泌增加，分解肝糖升高血糖！' },
          { id: 'bad', label: '飯後分泌升糖素把糖存起來', wrongReason: '升糖素會讓血糖升更高喔！降血糖永遠只有胰島素！' }
        ],
        summary: '🏆 血糖調控口訣：「唯一降糖胰島素，升糖腎上都升糖」！'
      },
      badgeId: 'BADGE_SCI_7_1_4'
    },
    {
      id: 'SCI_7_1_5',
      badgeText: '🔬 七年級自然生物｜單元 1-5',
      title: '遺傳、細胞分裂與孟德爾',
      subtitle: '減數分裂為何砍半、棋盤機率與譜系圖「無中生有定隱性」',
      goldenRule: '減數分裂分 2 次讓染色體減半；只看生殖細胞裡的基因才算遺傳（後天不遺傳）！',
      hints: ['譜系圖先找「爸媽沒病卻生出有病小孩（無中生有）」→ 小孩必為隱性 aa、爸媽皆為 Aa！', '顯性不等於數量多，六指症是顯性但世界上五指隱性人佔 99.9%！'],
      exploreTitle: '🧬 孟德爾遺傳棋盤配對機',
      simType: 's_genetics',
      engage: {
        question: '🏋️ 爸爸後天重訓練出超大六塊肌，也常熬夜看手機變成大近視，生出來的寶寶會遺傳這兩件事嗎？',
        options: [
          { label: 'A. 都不會！後天身體改變沒有改寫精卵裡的 DNA 序列，不會遺傳', correct: true, feedback: '答對！徹底破除拉馬克「用進廢退會遺傳」的迷思！' },
          { label: 'B. 會，父母身體變強或近視都會直接傳給下一代', correct: false, feedback: '想想看：如果爸爸不小心斷了一根手指，寶寶出生會少一根手指嗎？不會！只有生殖細胞基因突變才遺傳！' }
        ]
      },
      principles: [
        '<strong>減數分裂目的：</strong>複製 1 次、分裂 2 次讓精卵染色體砍半成 23 條，受精才湊回正常 46 條。',
        '<strong>性聯遺傳 (X 隱性)：</strong>男生只有一條 X，口訣「男看母、女看父」！'
      ],
      faqs: [
        { q: '前兩胎都生女兒，第三胎生兒子的機率會變高嗎？', a: '不會！每次受精都是 X 與 Y 精子重新起跑，永遠是 50%！' }
      ],
      trap: {
        question: '家族譜系圖中，正常雙親（無病）生出一位罹患某遺傳病的兒子，請問此疾病為？',
        misconceptionCode: 'MIS_PEDIGREE_DOMINANT',
        misconceptionDesc: '在「無中生有」譜系圖誤判新出現性狀為顯性',
        options: [
          { label: 'A. 顯性遺傳（突然顯現出來）', correct: false, feedback: '如果是顯性，父母兩人都沒帶顯性基因（都是 aa），怎麼可能生出顯性小孩！必為隱性！' },
          { label: 'B. 隱性遺傳（無中生有定隱性，雙親皆為帶因者 Aa）', correct: true, feedback: '會考譜系圖秒殺神技 get！' }
        ]
      },
      tactic: {
        code: 'PEDIGREE_RECESSIVE_SOLVE',
        title: '家族譜系圖三步秒推基因型',
        problemText: '雙眼皮父母生出單眼皮女兒（已知雙眼皮為顯性 A、單眼皮為隱性 a），求父母基因型與下一胎再生單眼皮的機率？',
        slots: [
          { label: '步驟 1：先標出隱性女兒基因型', expectedId: 'aa' },
          { label: '步驟 2：各從爸媽拿一個 a，倒推雙親', expectedId: 'pa' },
          { label: '步驟 3：棋盤 Aa × Aa 算出單眼皮機率', expectedId: 'prob' }
        ],
        chips: [
          { id: 'aa', label: '單眼皮為隱性，女兒必為純合子 aa' },
          { id: 'pa', label: '爸媽外表顯性但各提供一個 a → 爸媽皆為 Aa' },
          { id: 'prob', label: 'Aa × Aa 產生 AA : Aa : aa = 1 : 2 : 1 → 單眼皮機率 25% (1/4)！' },
          { id: 'bad', label: '已經生過一個單眼皮，下一胎機率變 0%', wrongReason: '每一胎都是獨立事件，永遠重新算 25%！' }
        ],
        summary: '🏆 譜系圖永遠「先填所有隱性 aa → 倒推雙親 → 棋盤算機率」！'
      },
      badgeId: 'BADGE_SCI_7_1_5'
    },
    {
      id: 'SCI_7_1_6',
      badgeText: '🔬 七年級自然生物｜單元 1-6',
      title: '生態系與食物鏈',
      subtitle: '10% 能量散熱金字塔 vs 重金屬毒物頂端大濃縮',
      goldenRule: '能量每往上一層只剩 10%（單向散熱）；分解者讓物質循環；毒物不散失在頂端大濃縮！',
      hints: ['能量在呼吸維持體溫時散熱 90% 回宇宙，所以越上層總能量越少！', '重金屬排不出去累積在脂肪裡，食物鏈越頂端中毒越慘！'],
      exploreTitle: '🔺 能量金字塔 vs 毒物生物放大對照',
      simType: 's_food_pyramid',
      engage: {
        question: '🦁 草原食物鏈「草 → 羚羊 → 獅子」，哪一個階層擁有的「總能量」最多？',
        options: [
          { label: 'A. 獅子體型最大最兇猛，所以獅子總能量最多', correct: false, feedback: '一頭獅子要吃幾千隻羚羊、幾萬噸草才能長大！每轉一手散熱 90%，頂端總能量反而最少！' },
          { label: 'B. 底層的草地（生產者）總能量最多！', correct: true, feedback: '答對！進金字塔對照「能量」跟「重金屬毒物」兩種完全相反的趨勢！' }
        ]
      },
      principles: [
        '<strong>能量單向流、物質可循環：</strong>能量靠太陽每天補貨；碳氮元素靠細菌真菌（分解者）循環。',
        '<strong>生物放大作用：</strong>不易分解的毒物（汞、DDT）會在最高級消費者體內濃度飆高千倍。'
      ],
      faqs: [
        { q: '食物網裡某動物被抓光，上下層怎麼推？', a: '先找直接吃牠的（沒食物變少）跟直接被牠吃的（沒天敵先暴增，再把更下層啃光）！' }
      ],
      trap: {
        question: '若河川遭到微量重金屬「汞」污染，食物鏈「藻類 → 小蝦 → 吳郭魚 → 白鷺鷥」中誰體內汞濃度最高？',
        misconceptionCode: 'MIS_TOXIN_DECREASES_UP',
        misconceptionDesc: '將毒物生物放大與能量遞減搞反，誤以為生產者毒物濃度最高',
        options: [
          { label: 'A. 藻類（最先吸收河水）', correct: false, feedback: '藻類只吸到一點點，但小蝦吃一百份藻、魚吃一百隻蝦、白鷺鷥吃幾十條魚，毒物全部濃縮進白鷺鷥！' },
          { label: 'B. 頂端的白鷺鷥（生物放大作用）', correct: true, feedback: '完全正確！能量越上越少，毒物越上越毒！' }
        ]
      },
      tactic: {
        code: 'ENERGY_10_PERCENT',
        title: '10% 能量傳遞計算秒殺',
        problemText: '若 10,000 焦耳的草經過「草 → 蝗蟲 → 青蛙 → 蛇」，最後到達蛇體內的能量約剩多少？',
        slots: [
          { label: '步驟 1：數箭頭跳了幾層', expectedId: 'hops' },
          { label: '步驟 2：每跳一層乘以 10% (÷ 10)', expectedId: 'calc' }
        ],
        chips: [
          { id: 'hops', label: '草 → 蝗蟲 (1) → 青蛙 (2) → 蛇 (3)，共跳 3 層' },
          { id: 'calc', label: '10,000 × 0.1 × 0.1 × 0.1 = 10 焦耳！' },
          { id: 'bad', label: '10,000 × 0.9 × 0.9 × 0.9 = 7290 焦耳', wrongReason: '90% 是散失掉的熱能，真正傳給下一層的只有 10% (× 0.1)！' }
        ],
        summary: '🏆 能量計算數箭頭：幾個箭頭就除以幾個 10！'
      },
      badgeId: 'BADGE_SCI_7_1_6'
    },
    {
      id: 'SCI_8_2_2',
      badgeText: '🔬 八年級自然理化｜單元 2-2',
      title: '聲波與光學',
      subtitle: '波不搬運物質、兩條光線推導凸透鏡成像與移動鳴笛回聲',
      goldenRule: '波只傳能量不搬運物質；光進慢介質向法線偏；兩條光線交叉決定實像或虛像！',
      hints: ['聲音跑多快只看「介質和溫度」，大聲喊只是振幅變高，聲速完全不會變快！', '凸透鏡物距在焦距外「物近像遠像變大」；躲進焦距內變成正立放大虛像（放大鏡）！'],
      exploreTitle: '🔍 凸透鏡兩條特殊光線即時成像桌',
      simType: 's_optics_lens',
      engage: {
        question: '🔦 用黑紙遮住凸透鏡的「下半部」，原本在紙屏上清晰的蠟燭倒像會變成什麼樣子？',
        options: [
          { label: 'A. 像會少掉一半（只剩半根蠟燭）', correct: false, feedback: '超高頻大陷阱！上半部透鏡依然能讓來自整根蠟燭各點的光線折射會聚，所以像依然完整，只是亮度變暗一半！' },
          { label: 'B. 依然是完整的蠟燭像，只是亮度變暗一半！', correct: true, feedback: '物理觀念超強！快進光學桌拖動蠟燭體驗兩條光線成像！' }
        ]
      },
      principles: [
        '<strong>聲音三要素：</strong>響度看振幅、音調看頻率、音色看波形；聲速只看介質與溫度。',
        '<strong>平面鏡照全身：</strong>不論站多遠，所需最短鏡長永遠等於身高的一半！'
      ],
      faqs: [
        { q: '對山谷喊超大聲，回音會比較快傳回來嗎？', a: '不會！室溫聲速固定約 340 m/s，喊再大聲只是變響（振幅高），不會跑比較快！' }
      ],
      trap: {
        question: '站在山谷前對著山壁大喊，如果把音量調大 3 倍，回音傳回來的時間會怎麼變？',
        misconceptionCode: 'MIS_LOUDER_FASTER_SOUND',
        misconceptionDesc: '誤以為聲音越大聲（振幅越大）傳播波速越快',
        options: [
          { label: 'A. 變快，更快聽到回音', correct: false, feedback: '音量大小只影響振幅，不改變波速！只要空氣溫度沒變，聲速一模一樣！' },
          { label: 'B. 完全不變（聲速只取決於介質與溫度）', correct: true, feedback: '完全正確！別被大喊的直覺騙了！' }
        ]
      },
      tactic: {
        code: 'MOVING_CAR_ECHO',
        title: '移動汽車鳴笛回聲「線段加總法」',
        problemText: '汽車以 20 m/s 朝山壁前進並鳴笛，4 秒後聽到回聲（聲速 340 m/s），問鳴笛瞬間車離山壁多遠？',
        slots: [
          { label: '步驟 1：算 4 秒內聲音與車各自走的距離', expectedId: 'd' },
          { label: '步驟 2：兩者相加剛好等於原距離的 2 倍 (2S)', expectedId: 'sum' },
          { label: '步驟 3：除以 2 即得鳴笛瞬間距離', expectedId: 'div' }
        ],
        chips: [
          { id: 'd', label: '聲音走 340×4 = 1360m，車往前走 20×4 = 80m' },
          { id: 'sum', label: '兩段接起來剛好是去加回：2S = 1360 + 80 = 1440m' },
          { id: 'div', label: 'S = 1440 ÷ 2 = 720 公尺！' },
          { id: 'bad', label: '直接算 340 × 4 ÷ 2 = 680 公尺', wrongReason: '車子在 4 秒內往山壁前進了 80 公尺，不能當靜止回聲算！' }
        ],
        summary: '🏆 朝山壁鳴笛：2S = (聲速 + 車速) × t；遠離山壁則相減！'
      },
      badgeId: 'BADGE_SCI_8_2_2'
    },
    {
      id: 'SCI_8_2_3',
      badgeText: '🔬 八年級自然理化｜單元 2-3',
      title: '熱學（比熱與狀態變化）',
      subtitle: '比熱溫度頑固度、加熱平台期潛熱與熱平衡「大減小」列式',
      goldenRule: '比熱大＝溫柔難加熱難降溫；狀態改變期間熱量拿去拆分子牽手，溫度先暫停！',
      hints: ['相同穩定熱源加熱相同時間＝吸收「完全一樣多」的熱量！溫度升越慢的比熱越大。', '熱平衡列式永遠「大減小」：H放 = m₁s₁(T高 − T平) = H吸 = m₂s₂(T平 − T低)。'],
      exploreTitle: '🌡️ 冰 → 水 → 氣加熱曲線與 0°C／100°C 平台期',
      simType: 's_heat_curve',
      engage: {
        question: '🔥 煮滾開水已經到達 100°C 冒泡時，把瓦斯爐轉到最大火繼續狂燒，水溫會衝上 110°C 嗎？',
        options: [
          { label: 'A. 不會！一大氣壓下水溫卡在 100°C 平台期，多出的火力只是讓水蒸發變快', correct: true, feedback: '答對！進加熱曲線拖動時間軸觀察兩段水平平台期！' },
          { label: 'B. 會，火力越大水溫越高', correct: false, feedback: '沸騰期間熱量全部拿去拆散水分子變成水蒸氣（汽化潛熱），水溫不會超過 100°C！' }
        ]
      },
      principles: [
        '<strong>比熱 s 的意義：</strong>水的比熱最大 (1)，所以能調節沿海氣候並造成白天海風、夜晚陸風。',
        '<strong>室溫鐵棒摸起來比木頭冰：</strong>兩者溫度一模一樣，只是鐵導熱超快瞬間吸走你的手溫！'
      ],
      faqs: [
        { q: '同熱源加熱 100g 水與 100g 油 5 分鐘，誰吸的熱多？', a: '一樣多！相同熱源加熱相同時間＝給出一樣多熱量，只是油比熱小所以溫度飆比較高！' }
      ],
      trap: {
        question: '在 25°C 教室裡放了許久的鐵尺與木尺，摸起來鐵尺明顯比較冰涼，請問誰的溫度比較低？',
        misconceptionCode: 'MIS_METAL_COLDER_TEMP',
        misconceptionDesc: '把導熱快造成的冰涼觸覺誤以為物體實際溫度較低',
        options: [
          { label: 'A. 鐵尺溫度較低', correct: false, feedback: '放在同一間教室久了都達到熱平衡 25°C！覺得冰是因為鐵「導熱快」搶走你手心熱量！' },
          { label: 'B. 兩者溫度一樣都是 25°C，只是鐵導熱快吸走手溫', correct: true, feedback: '完全破除觸覺錯覺！' }
        ]
      },
      tactic: {
        code: 'HEAT_BALANCE_BIG_SUB_SMALL',
        title: '混合熱平衡「左放右吸、大減小」防錯 SOP',
        problemText: '將 200g、90°C 鐵塊放入 100g、20°C 水中（無熱散失），平衡末溫 32°C，如何求鐵比熱 s？',
        slots: [
          { label: '步驟 1：寫高溫放熱（90 − 32 大減小）', expectedId: 'out' },
          { label: '步驟 2：寫低溫吸熱（32 − 20 大減小）', expectedId: 'in' },
          { label: '步驟 3：兩邊相等解出比熱 s', expectedId: 'eq' }
        ],
        chips: [
          { id: 'out', label: 'H放 = 200 × s × (90 − 32) = 11600s' },
          { id: 'in', label: 'H吸 = 100 × 1 × (32 − 20) = 1200 卡' },
          { id: 'eq', label: '11600s = 1200 → s ≈ 0.103 cal/g·°C！' },
          { id: 'bad', label: 'H吸寫成 100 × 1 × (20 − 32) = −1200', wrongReason: '不要寫小減大弄出負號！永遠大減小，左放＝右吸就不會正負算反！' }
        ],
        summary: '🏆 熱平衡口訣：末溫必介於高低溫之間，ΔT 永遠「大減小」！'
      },
      badgeId: 'BADGE_SCI_8_2_3'
    },
    {
      id: 'SCI_8_2_4',
      badgeText: '🔬 八年級自然理化｜單元 2-4',
      title: '化學反應與質量守恆',
      subtitle: '密閉玻璃罩拆穿氣體逸散假象，與限量試劑「除以係數法」秒殺',
      goldenRule: '化學反應只是原子樂高拆開重拼，一顆都不增減；看質量守恆要把氣體算進去！',
      hints: ['木頭燒完變輕是因為 CO₂ 氣體飛走；鐵生鏽變重是因為抓進了空氣中的氧！', '找限量試劑四步：全換莫耳數 → 各別「除以方程式係數」 → 最小者最先用完當老大！'],
      exploreTitle: '⚖️ 開放燒杯 vs 密閉玻璃罩質量守恆台',
      simType: 's_mass_conserv',
      engage: {
        question: '🔥 一塊 100g 木炭燒完只剩 5g 灰燼，一根 50g 鐵釘生鏽變成 58g。這代表它們違反質量守恆定律嗎？',
        options: [
          { label: 'A. 沒有違反！因為沒把飛走的 CO₂ 或抓進來的 O₂ 氣體一起放上秤！', correct: true, feedback: '答對！進實驗室蓋上密閉玻璃罩親眼驗證磅秤讀數一動不動！' },
          { label: 'B. 違反了，燃燒會把部分質量消滅掉', correct: false, feedback: '原子在化學反應裡永遠不會被消滅，只是變成看不見的氣體飛走了！' }
        ]
      },
      principles: [
        '<strong>係數比＝莫耳數比：</strong>平衡方程式只能改前面係數，絕對不能改右下小數字（把 H₂O 改 H₂O₂ 會變毒雙氧水！）。',
        '<strong>限量試劑：</strong>最先耗盡的反應物決定整場反應最多能生出多少產物。'
      ],
      faqs: [
        { q: '為什麼不能拿兩種反應物的「克數」直接比係數？', a: '每種原子體重（分子量）不同！必須先除以分子量換成「莫耳數（顆數）」才能跟係數比！' }
      ],
      trap: {
        question: '大理石與稀鹽酸在「蓋緊瓶蓋的密閉寶特瓶」內反應完畢秤得 250g，接著「轉開瓶蓋聽到嘶一聲」後再秤，讀數會？',
        misconceptionCode: 'MIS_SEALED_OPEN_MASS',
        misconceptionDesc: '忽略轉開瓶蓋後二氧化碳逃逸造成磅秤視重減輕',
        options: [
          { label: 'A. 維持 250g 不變', correct: false, feedback: '轉開瓶蓋「嘶～」一聲，瓶裡高壓的 CO₂ 氣體跑出瓶外了，磅秤讀數會變小！' },
          { label: 'B. 小於 250g（但總質量含逃出的 CO₂ 依然守恆）', correct: true, feedback: '精準區分「系統總質量守恆」與「開放後氣體逸散視重變輕」！' }
        ]
      },
      tactic: {
        code: 'LIMITING_REAGENT_DIV_COEFF',
        title: '化學計量限量試劑「除以係數比大小」秒殺法',
        problemText: '反應式 N₂ + 3H₂ → 2NH₃。拿 2 mol N₂ 與 5 mol H₂ 充分反應，誰是限量試劑？最多生成幾 mol NH₃？',
        slots: [
          { label: '步驟 1：各別「現有莫耳數 ÷ 方程式係數」', expectedId: 'div' },
          { label: '步驟 2：找商最小者＝最先用完的限量試劑', expectedId: 'min' },
          { label: '步驟 3：以限量試劑按係數比算產物', expectedId: 'prod' }
        ],
        chips: [
          { id: 'div', label: 'N₂：2 ÷ 1 = 2；H₂：5 ÷ 3 ≈ 1.67' },
          { id: 'min', label: '1.67 < 2 → H₂ 最先用完（限量試劑老大！）' },
          { id: 'prod', label: 'H₂ : NH₃ = 3 : 2 → 生成 NH₃ = 5 × (2/3) = 10/3 mol！' },
          { id: 'bad', label: '2 mol < 5 mol 所以 N₂ 比較少是限量試劑', wrongReason: 'H₂ 每次消耗是 N₂ 的 3 倍！不能直接比莫耳數，一定要先「除以係數」！' }
        ],
        summary: '🏆 限量試劑口訣：「換莫耳 → 除係數 → 最小當老大」！'
      },
      badgeId: 'BADGE_SCI_8_2_4'
    },
    {
      id: 'SCI_8_2_5',
      badgeText: '🔬 八年級自然理化｜單元 2-5',
      title: '氧化還原與酸鹼鹽',
      subtitle: '金屬搶氧活性拔河、酸鹼滴定離子舞池與 aMaVa = bMbVb 萬能式',
      goldenRule: '氧化還原＝搶氧拔河（得氧被氧化＝還原劑）；酸鹼中和就是 H⁺ 牽手 OH⁻ 變成水！',
      hints: ['口訣：「幫別人做事叫劑，發生在自己身上叫被」——搶贏氧的活性大金屬自己被氧化，順便幫對方還原，所以是還原劑！', '酸不管怎麼加水稀釋，pH 頂多無限逼近 7，永遠不會變鹼性 (>7)！'],
      exploreTitle: '🧪 酸鹼滴定微觀離子舞池（當量點瞬間變色！）',
      simType: 's_redox_titration',
      engage: {
        question: '💧 拿一大缸純水不停倒進 10 mL 鹽酸 (pH=2) 裡面狂稀釋，這缸水的 pH 值最後會不會變成 8（鹼性）？',
        options: [
          { label: 'A. 絕對不會！頂多無限接近中性 pH = 7，永遠不會跨過 7 變鹼性', correct: true, feedback: '觀念超穩！進滴定舞池親手滴一滴一滴看 H⁺ 與 OH⁻ 配對變色！' },
          { label: 'B. 會，水加夠多就會超過 7 變鹼性', correct: false, feedback: '純水本身是中性 (pH=7)，怎麼可能把酸加純水加到變鹼性呢！只會卡在 7 漸近線上！' }
        ]
      },
      principles: [
        '<strong>中和公式：</strong>a × Ma × Va = b × Mb × Vb（別漏乘硫酸 H₂SO₄ 的 2 價！）。',
        '<strong>滴定管刻度陷阱：</strong>0 刻度在最上方，越往下數字越大！'
      ],
      faqs: [
        { q: 'pH 從 2 稀釋到 3，要加水變成幾倍？', a: 'pH 每差 1 格濃度差 10 倍！從 2 到 3 要稀釋成原體積的「10 倍」，不是 1.5 倍！' }
      ],
      trap: {
        question: '在 C + 2CuO → CO₂ + 2Cu 高爐冶煉反應中，搶走氧氣變成 CO₂ 的碳 (C) 扮演什麼角色？',
        misconceptionCode: 'MIS_OXIDIZING_AGENT_SWAP',
        misconceptionDesc: '混淆「被氧化」與「氧化劑」名詞定義',
        options: [
          { label: 'A. 氧化劑（因為它自己氧化了）', correct: false, feedback: '清潔劑是「幫桌子變乾淨」，所以「還原劑」是「幫別人(CuO)還原」！C 搶了氧讓 CuO 還原成銅，所以 C 是還原劑！' },
          { label: 'B. 本身「被氧化」，當「還原劑」幫氧化銅還原成純銅', correct: true, feedback: '繞口令破關！記住：得氧＝被氧化＝還原劑！' }
        ]
      },
      tactic: {
        code: 'TITRATION_VALENCE',
        title: '酸鹼中和「價數防呆」計算 SOP',
        problemText: '用 0.2 M 的氫氧化鈉 (NaOH) 滴定 20 mL、0.1 M 的「硫酸 (H₂SO₄)」，完全中和需要幾 mL 的 NaOH？',
        slots: [
          { label: '步驟 1：抓出酸鹼各自解離價數 a, b', expectedId: 'val' },
          { label: '步驟 2：代入 a·Ma·Va = b·Mb·Vb', expectedId: 'eq' },
          { label: '步驟 3：解出 NaOH 體積 Vb', expectedId: 'ans' }
        ],
        chips: [
          { id: 'val', label: 'H₂SO₄ 能解離 2 個 H⁺ (a = 2)；NaOH 解離 1 個 OH⁻ (b = 1)' },
          { id: 'eq', label: '2 × 0.1 × 20 = 1 × 0.2 × Vb' },
          { id: 'ans', label: '4 = 0.2 × Vb → 需要 Vb = 20 mL！' },
          { id: 'bad', label: '直接用 0.1 × 20 = 0.2 × Vb 得 10 mL', wrongReason: '忘記硫酸一分子有「兩個 H⁺」！沒乘價數 2 會少算一半！' }
        ],
        summary: '🏆 看到硫酸 (H₂SO₄) 或氫氧化鈣 Ca(OH)₂，立刻把價數 2 圈出來！'
      },
      badgeId: 'BADGE_SCI_8_2_5'
    },
    {
      id: 'SCI_9_3_1',
      badgeText: '🔬 九年級自然理化｜單元 3-1',
      title: '直線運動與牛頓定律',
      subtitle: '推不動＝靜摩擦等於推力、v-t 圖斜率面積與連接體系統法',
      goldenRule: '不動或等速＝合力是 0（推力剛好等於摩擦力）；v-t 圖看斜率找加速、算面積求距離！',
      hints: ['只要箱子靜止不動，你推 30N 摩擦力就是 30N！如果摩擦力比推力大，箱子不就自己倒飛回來了嗎？', 'v-t 圖裡折線最高點不是折返點，穿過時間軸 (v = 0) 才是真正折返！'],
      exploreTitle: '📦 推箱子靜摩擦即時反制實驗台',
      simType: 's_newton_vt',
      engage: {
        question: '📦 大壯用 40 N 的力氣推一個大衣櫃，衣櫃紋絲不動（最大靜摩擦 50 N）。請問此時地板摩擦力是多少？',
        options: [
          { label: 'A. 等於 40 N（靜止不動代表合力為 0，推多少力就回敬多少力）', correct: true, feedback: '破除百年物理第一大迷思！進實驗室拉動推力看藍紅箭頭永遠等長！' },
          { label: 'B. 大於 40 N（因為摩擦力贏過推力才推不動）', correct: false, feedback: '反例打臉：如果向左摩擦力 50 N > 向右推力 40 N，合力向左 10 N，衣櫃就會自己往你身上撞過來了！' }
        ]
      },
      principles: [
        '<strong>自由落體同時落地：</strong>在無空氣阻力下，重球與輕球重力加速度同為 9.8 m/s²。',
        '<strong>作用力＝反作用力：</strong>大卡車撞小轎車，兩車承受的撞擊力「完全一樣大」！'
      ],
      faqs: [
        { q: 'x-t 圖跟 v-t 圖的「水平線」意思一樣嗎？', a: '完全不同！x-t 水平線＝靜止不動；v-t 水平線＝等速度運動（一直在跑）！' }
      ],
      trap: {
        question: '大卡車與小轎車正面相撞，小轎車被撞飛變形，請問撞擊瞬間哪一台車受到的撞擊力比較大？',
        misconceptionCode: 'MIS_ACTION_REACTION_BIGGER',
        misconceptionDesc: '誤以為質量大的卡車施予小車的撞擊力大於小車施予卡車的反作用力',
        options: [
          { label: 'A. 小轎車受的力比較大，才被撞飛', correct: false, feedback: '牛頓第三定律：作用力與反作用力永遠大小相等！小車飛出去是因為質量 m 小 (a = F/m) 加速度變化劇烈！' },
          { label: 'B. 兩台車承受的撞擊力完全一模一樣大！', correct: true, feedback: '完全正確！別被損毀程度騙過牛頓第三定律！' }
        ]
      },
      tactic: {
        code: 'CONNECTED_BLOCKS_SYSTEM',
        title: '連接體（綁一起拉）「先合體、再單挑」兩步法',
        problemText: '光滑地面上 A(3kg) 與 B(2kg) 用繩綁在一起，用 20N 向前拉 B，求中間繩子拉力 T？',
        slots: [
          { label: '步驟 1：把 A+B 當成一塊大物體求加速度 a', expectedId: 'sys' },
          { label: '步驟 2：只看後面沒被手拉的 A 求繩張力 T', expectedId: 'iso' }
        ],
        chips: [
          { id: 'sys', label: '總質量 3 + 2 = 5 kg → 系統加速度 a = 20 ÷ 5 = 4 m/s²' },
          { id: 'iso', label: '只有繩子拉著 A 加速 → T = mA × a = 3 × 4 = 12 N！' },
          { id: 'bad', label: '繩子跟手一樣直接承受 20 N', wrongReason: '手拉的 20N 要負責推兩塊，中間繩子只需要拉後面的 A (3kg)，所以只有 12N！' }
        ],
        summary: '🏆 連接體口訣：「先合體算總 a，再單挑後面那塊算 T」，免解聯立！'
      },
      badgeId: 'BADGE_SCI_9_3_1'
    },
    {
      id: 'SCI_9_3_2',
      badgeText: '🔬 九年級自然理化｜單元 3-2',
      title: '功、能與簡單機械',
      subtitle: '垂直無做功、雲霄飛車位動熱能轉換與動滑輪「橫切數繩法」',
      goldenRule: '力與移動垂直或不動＝沒做功；機械省力必費距離，永遠不能「省功」！',
      hints: ['提水桶平地等速走：手向上提、水桶向前移（垂直 90°），重力與提力做功皆為 0！', '動滑輪橫畫一刀數幾條繩子拉住重物，N 條繩就省力 1/N（拉繩長度變 N 倍）！'],
      exploreTitle: '🎢 無動力雲霄飛車位能／動能／熱能柱狀圖',
      simType: 's_coaster_energy',
      engage: {
        question: '🪣 小明提著 10 公斤水桶在平坦走廊上等速走 20 公尺，手痠得要命！請問小明的手「對水桶做的物理功」是多少焦耳？',
        options: [
          { label: 'A. 0 焦耳！（提力向上、移動向前呈 90° 垂直，水桶沒獲得額外位能或動能）', correct: true, feedback: '精準抓到物理做功定義！進雲霄飛車觀察機械能與熱能轉換！' },
          { label: 'B. 10 × 20 = 200 焦耳', correct: false, feedback: '生理肌肉消耗熱量不等於對物體做功！力跟位移垂直時物理做功為 0！' }
        ]
      },
      principles: [
        '<strong>簡單機械守恆：</strong>斜面與動滑輪省力幾倍，手拉距離就要多幾倍，總功一模一樣。',
        '<strong>槓桿平衡：</strong>順時針總力矩 ＝ 逆時針總力矩（非輕質木棒重量畫在正中央！）。'
      ],
      faqs: [
        { q: '為什麼真實雲霄飛車後面的山丘一定比第一個起點矮？', a: '因為摩擦力會把部分力學能轉成熱能散失，無動力台車永遠爬不回原本一樣高！' }
      ],
      trap: {
        question: '使用一個省力 3 倍的長斜坡推鋼琴上卡車（不計摩擦），與直接垂直搬上去相比，哪種做法比較「省功」？',
        misconceptionCode: 'MIS_MACHINE_SAVES_WORK',
        misconceptionDesc: '誤以為省力簡單機械同時也能省功（減少總能量）',
        options: [
          { label: 'A. 用斜坡比較省功', correct: false, feedback: '天下沒有免費午餐！力氣變 1/3 但路程變 3 倍，(1/3 F) × (3 S) = F·S，總功完全一樣！' },
          { label: 'B. 兩者做功完全一樣（簡單機械只省力費距離，絕不省功！）', correct: true, feedback: '能量守恆鐵律過關！' }
        ]
      },
      tactic: {
        code: 'PULLEY_SCISSOR_COUNT',
        title: '滑輪組「剪刀橫切數繩法」秒算施力',
        problemText: '一個滑輪組由 1 個定滑輪＋1 個動滑輪組成，動滑輪正上方有 2 條繩子共同往上拉住 60 kgw 重物（不計滑輪重），手需施力多少？重物升 1m 手要拉幾公尺？',
        slots: [
          { label: '步驟 1：在動滑輪正上方橫畫一刀數繩數 N', expectedId: 'cut' },
          { label: '步驟 2：算出省力後的施力 F = W ÷ N', expectedId: 'f' },
          { label: '步驟 3：依做功守恆求拉繩長度 S = N × h', expectedId: 's' }
        ],
        chips: [
          { id: 'cut', label: '橫切後數出共有 N = 2 條繩子一起分擔重物' },
          { id: 'f', label: '手施力 F = 60 ÷ 2 = 30 kgw（省一半力）' },
          { id: 's', label: '手拉繩長 S = 2 × 1 = 2 公尺（費兩倍距離）！' },
          { id: 'bad', label: '施力 30 kgw 且拉繩長只要 0.5 公尺', wrongReason: '既省力又省距離會違反能量守恆！省力幾倍就必費幾倍距離！' }
        ],
        summary: '🏆 動滑輪口訣：「橫切數繩 N 條，力除 N、長乘 N」！'
      },
      badgeId: 'BADGE_SCI_9_3_2'
    },
    {
      id: 'SCI_9_3_4',
      badgeText: '🔬 九年級自然地科｜單元 3-4',
      title: '地球構造、板塊與天氣圖',
      subtitle: '海底也有板塊、冷暖滯留鋒面抬升降雨與地層「截切定律」定老新',
      goldenRule: '板塊含地殼加頂部地函（海底也有）；空氣上升冷卻才成雲下雨，下沉就放晴！',
      hints: ['右手大拇指朝上＝北半球低壓上升逆時針往內轉（陰雨）；大拇指朝下＝高壓下沉順時針往外吹（晴朗）！', '地層剖面排序口訣：「切穿別人的比較年輕」！'],
      exploreTitle: '⛈️ 冷鋒・暖鋒・滯留鋒氣團抬升模擬盒',
      simType: 's_plate_front',
      engage: {
        question: '🌏 地球表面 70% 是海水，請問「海底下」有沒有板塊在移動？',
        options: [
          { label: 'A. 有！板塊是整個岩石圈（陸地與海底全都有，如太平洋板塊 99% 在海底）', correct: true, feedback: '答對！大洋板塊甚至比大陸板塊重，相撞時常往下隱沒！' },
          { label: 'B. 沒有，板塊只在陸地上漂移', correct: false, feedback: '那是早年不完整的大陸漂移想法！現代板塊學說確認海洋底部全是板塊！' }
        ]
      },
      principles: [
        '<strong>台灣造山成因：</strong>菲律賓海板塊與歐亞板塊聚合互撞，擠出中央山脈並造成頻繁地震。',
        '<strong>冷鋒過境後變化：</strong>冷鋒掃過台灣後改受冷高壓控制 → 氣溫驟降、氣壓升高、轉晴乾冷！'
      ],
      faqs: [
        { q: '為什麼 5-6 月梅雨季雨會連下好幾天停不下來？', a: '北方冷氣團與南方暖氣團推力旗鼓相當，卡在台灣上空變成「滯留鋒」！' }
      ],
      trap: {
        question: '地質剖面中，有一條岩漿入侵形成的「火成岩脈」貫穿了砂岩、頁岩與石灰岩三層，請問誰最年輕？',
        misconceptionCode: 'MIS_GEOLOGY_INTRUSION_OLD',
        misconceptionDesc: '誤以為底層或被切穿的沉積岩比入侵岩脈更年輕',
        options: [
          { label: 'A. 最底下的砂岩最年輕', correct: false, feedback: '未翻轉前沉積岩是「下老上新」，而且能被岩脈穿破代表它早就存在了！' },
          { label: 'B. 貫穿它們的火成岩脈最年輕（截切定律：切穿別人的晚發生）', correct: true, feedback: '完全正確！必須先有這三層，岩漿後來才衝得破它們！' }
        ]
      },
      keywordRadar: {
        code: 'WEATHER_MAP_COLD_FRONT',
        title: '地面天氣圖冷鋒過境審題關鍵字（找出 2 個關鍵詞）',
        tokens: [
          { text: '氣象圖上有一道 ', plain: true },
          { text: '藍色三角形鋒面', isTrapKey: true, note: '藍色三角＝冷鋒！三角形尖端指向哪裡，冷鋒就往哪裡推進！' },
          { text: ' 正由北向南通過台北。當鋒面 ', plain: true },
          { text: '完全過境之後', isTrapKey: true, note: '冷鋒過境後受冷氣團高壓控制 → 氣溫下降、氣壓升高、轉為乾冷晴朗！' },
          { text: '，請問台北的氣溫與氣壓將如何變化？', plain: true }
        ],
        unlockedHtml: '🏆 <strong>天氣圖判讀滿分！</strong>冷鋒過境時狂風驟雨；「過境後」氣溫降、氣壓升、轉乾冷！'
      },
      badgeId: 'BADGE_SCI_9_3_4'
    },
    {
      id: 'SCI_9_3_5',
      badgeText: '🔬 九年級自然地科｜單元 3-5',
      title: '天文：日地月與潮汐',
      subtitle: '23.5° 地軸傾斜直射斜射能量網格、月相 vs 月食，與潮汐每日延後 50 分鐘',
      goldenRule: '四季靠地軸傾斜 23.5° 決定直射斜射（無關遠近）；月相是看亮面的角度，不是地球遮影！',
      hints: ['7 月台灣夏天最熱時，地球反而位在離太陽「最遠」的位置，且同日澳洲正值大冬天！', '潮汐規律：每天滿潮延遲約 50 分鐘；相鄰兩次滿潮間隔 12 小時 25 分；初一與十五都是大潮！'],
      exploreTitle: '☀️ 地軸傾斜 23.5° 直射 vs 斜射能量網格',
      simType: 's_astro_seasons',
      engage: {
        question: '🌍 台灣 7 月酷熱夏天，是因為 7 月時地球公轉到離太陽最近的地方嗎？',
        options: [
          { label: 'A. 是啊，離太陽越近越熱', correct: false, feedback: '反例打臉：如果靠遠近，為什麼 7 月同天南半球澳洲正在下大雪？事實上 7 月地球反而離太陽最遠！' },
          { label: 'B. 不是！是因為地軸傾斜 23.5° 讓北半球陽光直射、能量集中且白晝長！', correct: true, feedback: '破除全球第一天文迷思！進能量網格看直射跟斜射的受熱面積差多少！' }
        ]
      },
      principles: [
        '<strong>月相盈虧 ≠ 月食：</strong>月相是我們從不同角度看月球原本就亮一半的面向；地球影子遮月亮才是月食（只在極少數農曆十五發生）。',
        '<strong>大潮與小潮：</strong>初一（新月）與十五（滿月）日地月一直線皆大潮；初八、廿三成直角為小潮。'
      ],
      faqs: [
        { q: '上弦月、下弦月哪一邊亮？什麼時間看到？', a: '上弦月（初七八）＝「上」半夜看到、亮右邊（西邊）；下弦月（廿二三）＝「下」半夜到早上看到、亮左邊（東邊）！' }
      ],
      trap: {
        question: '平時每個月農曆初七看到「半圓形的上弦月」，黑暗的那一半是被地球影子遮住的嗎？',
        misconceptionCode: 'MIS_MOON_PHASE_EARTH_SHADOW',
        misconceptionDesc: '混淆平時月相盈虧成因與月食（地球遮影）',
        options: [
          { label: 'A. 是，地球擋住了太陽照向月亮的一半光線', correct: false, feedback: '地球影子遮月亮叫「月食」，只會發生在滿月農曆十五！平時月相只是月亮自己背對太陽的黑夜面朝向我們！' },
          { label: 'B. 不是！那是月亮自己背向太陽的黑夜面，只是我們從側面看過去一半亮一半暗', correct: true, feedback: '完全正確！徹底分清月相與月食！' }
        ]
      },
      tactic: {
        code: 'TIDE_DELAY_50_MIN',
        title: '會考潮汐「每日延後 50 分鐘」與出遊選時 SOP',
        problemText: '今天上午 08:00 滿潮，請問：(1) 今天何時最適合去海邊撿貝殼看招潮蟹？(2) 兩天後上午的滿潮大約幾點？',
        slots: [
          { label: '步驟 1：撿貝殼要找水位最低的「乾潮」（+6h12m）', expectedId: 'low' },
          { label: '步驟 2：每日延後 50 分鐘 → 兩天延後 100 分鐘', expectedId: 'delay' },
          { label: '步驟 3：加總算出兩天後滿潮時間', expectedId: 'ans' }
        ],
        chips: [
          { id: 'low', label: '08:00 + 6 小時 12 分 ≈ 下午 14:12 乾潮最適合撿貝殼！' },
          { id: 'delay', label: '2 天 × 50 分鐘 = 100 分鐘（1 小時 40 分）' },
          { id: 'ans', label: '08:00 + 1h40m = 上午 09:40 滿潮！' },
          { id: 'bad', label: '兩天後一樣在上午 08:00 滿潮', wrongReason: '月球每天公轉往前走 13°，地球每天要多自轉約 50 分鐘才追上月球！' }
        ],
        summary: '🏆 潮汐口訣：「每天晚 50 分、半日滿乾差 6h12m；撿貝乾潮、進港滿潮」！'
      },
      badgeId: 'BADGE_SCI_9_3_5'
    }
  ];

  SPECS.forEach(function (spec) {
    global.JuniorUnits[spec.id] = create(spec);
  });
})(window);
