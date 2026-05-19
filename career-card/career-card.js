
  // DATA
/**
 * career-card-data.js
 * 熱情探索工具 - 職業卡資料陣列（100 張）
 * 對應需求 2.1, 2.2, 10.2
 *
 * 依主導碼分組：
 *   A 藝術型 (Artistic)      - A001~A020 (20 張)
 *   C 事務型 (Conventional)  - C001~C009 (9 張)
 *   E 企業型 (Enterprising)  - E001~E023 (23 張)
 *   I 研究型 (Investigative) - I001~I025 (25 張)
 *   R 實用型 (Realistic)     - R001~R010 (10 張)
 *   S 社會型 (Social)        - S001~S013 (13 張)
 */

const CAREER_CARDS = [

  // ═══════════════════════════════════════════════════════
  // A 藝術型 (Artistic) - 20 張
  // ═══════════════════════════════════════════════════════
  { id: 'A001', nameZh: '遊戲設計師', nameEn: 'Game Designer', hollandCode: 'AE', primaryCode: 'A', description: '負責規劃與設計電子遊戲的玩法機制、故事情節、角色設定與關卡結構，將創意概念轉化為完整的遊戲體驗。需要兼具藝術美感與邏輯思維，與程式、美術、音效等團隊緊密合作。', workContent: ['設計遊戲規則、關卡與玩法機制', '撰寫遊戲設計文件（GDD）', '與美術、程式、音效團隊協作開發', '進行遊戲測試並根據回饋調整設計', '研究市場趨勢與玩家行為'], traits: ['富有創意與想像力', '邏輯思維清晰', '熱愛遊戲並具備玩家視角', '善於溝通與跨部門協作', '對細節有高度要求'] },
  { id: 'A002', nameZh: '室內設計師', nameEn: 'Interior Designer', hollandCode: 'AE', primaryCode: 'A', description: '規劃並設計室內空間的功能配置、風格美學與材料選用，將客戶需求轉化為兼具美觀與實用的生活或工作環境。需要具備空間感知能力與藝術品味。', workContent: ['與客戶溝通需求並提出設計方案', '繪製平面圖、立面圖與3D效果圖', '選擇建材、家具、燈光與軟裝配件', '監督施工進度並確保設計落實', '控制預算與時程管理'], traits: ['具備空間美感與藝術品味', '善於傾聽並理解客戶需求', '注重細節與品質', '具備溝通協調能力', '對流行趨勢敏感'] },
  { id: 'A003', nameZh: '音樂家', nameEn: 'Musician', hollandCode: 'AE', primaryCode: 'A', description: '以音樂為職業，從事演奏、演唱、作曲或編曲等工作。可在樂團、錄音室、演唱會或教育機構中發揮音樂才能，透過音樂傳遞情感與藝術價值。', workContent: ['演奏樂器或演唱於現場表演或錄音', '創作、編曲或改編音樂作品', '排練與準備演出曲目', '與其他音樂人合作錄製專輯', '參與音樂教學或工作坊'], traits: ['對音樂有高度熱情與天賦', '具備紀律與持續練習的毅力', '情感豐富且善於表達', '具備音樂理論基礎', '能承受壓力並在舞台上表現'] },
  { id: 'A004', nameZh: '演員', nameEn: 'Actor', hollandCode: 'AE', primaryCode: 'A', description: '透過肢體、聲音與情感詮釋角色，在電影、電視、舞台劇或廣告中呈現故事。需要深入理解劇本與角色心理，並具備即興應變的能力。', workContent: ['研讀劇本並分析角色性格與動機', '參與排練並與導演、演員協作', '在攝影棚、舞台或外景地進行表演', '接受媒體採訪與宣傳活動', '持續進修表演技巧'], traits: ['情感豐富且善於表達', '具備強烈的同理心與觀察力', '勇於嘗試並接受挑戰', '能承受公眾目光與壓力', '具備自律與持續學習的精神'] },
  { id: 'A005', nameZh: '藝術總監', nameEn: 'Art Director', hollandCode: 'AE', primaryCode: 'A', description: '負責統籌視覺創作方向，確保廣告、出版、影視或品牌專案的整體視覺風格一致且符合創意目標。需要兼具藝術眼光與領導能力。', workContent: ['制定專案的整體視覺風格與方向', '指導設計師、攝影師與插畫師的創作', '審核視覺稿件並提供修改意見', '與客戶或行銷團隊溝通創意概念', '管理創意團隊的工作進度'], traits: ['具備卓越的視覺美感與品味', '善於領導與激勵創意團隊', '能清晰表達創意概念', '具備跨媒體的視覺知識', '注重品質並能在壓力下決策'] },
  { id: 'A006', nameZh: '編輯', nameEn: 'Editor', hollandCode: 'AEC', primaryCode: 'A', description: '負責審閱、修改與優化文字內容，確保出版品或媒體內容的品質、準確性與可讀性。需要具備敏銳的語言感知力與對內容主題的深入理解。', workContent: ['審閱稿件並進行文字修改與潤飾', '與作者溝通修改意見', '規劃出版內容的主題與方向', '校對最終稿件確保無誤', '協調排版、設計與印刷流程'], traits: ['對語言文字有高度敏感度', '邏輯清晰且注重細節', '具備廣泛的知識背景', '善於溝通並能給予建設性意見', '有耐心且能長時間專注'] },
  { id: 'A007', nameZh: '記者／特派員', nameEn: 'Reporter/Correspondent', hollandCode: 'AEI', primaryCode: 'A', description: '採訪、調查並報導新聞事件，透過文字、影像或影片將資訊傳遞給大眾。需要具備快速蒐集資訊、分析事實與清晰表達的能力。', workContent: ['採訪新聞事件與相關人士', '撰寫新聞稿、報導或深度分析文章', '查核資訊來源確保報導準確性', '在截稿期限內完成稿件', '追蹤特定議題進行深度報導'], traits: ['好奇心強且善於提問', '具備快速學習與適應能力', '文字表達清晰流暢', '具備道德判斷力與新聞倫理意識', '能在壓力下保持冷靜'] },
  { id: 'A008', nameZh: '商業與工業設計師', nameEn: 'Commercial and Industrial Designer', hollandCode: 'AER', primaryCode: 'A', description: '設計消費性產品或工業設備的外觀、功能與使用者體驗，兼顧美學、人體工學與製造可行性，將創意概念轉化為可量產的實體產品。', workContent: ['研究使用者需求與市場趨勢', '繪製產品草圖與3D模型', '選擇材料並評估製造可行性', '製作原型並進行使用者測試', '與工程師合作確保設計可量產'], traits: ['兼具藝術美感與工程思維', '善於觀察使用者行為', '具備3D空間想像力', '注重細節與功能性', '能在限制條件下發揮創意'] },
  { id: 'A009', nameZh: '流行服飾設計師', nameEn: 'Fashion Designer', hollandCode: 'AER', primaryCode: 'A', description: '設計服裝、配件或鞋履，將流行趨勢、文化靈感與個人美學融入作品，創造兼具美感與實穿性的時尚產品。', workContent: ['研究流行趨勢與目標市場', '繪製設計草圖與技術規格圖', '選擇布料、色彩與輔料', '監督樣品製作並進行修改', '規劃系列主題並參與時裝展'], traits: ['對時尚與美學有高度敏感度', '具備創意與獨特的設計風格', '了解服裝結構與製作工藝', '善於觀察並預測流行趨勢', '能承受高壓的工作節奏'] },
  { id: 'A010', nameZh: '廣電主播／主持人', nameEn: 'Broadcaster/Host', hollandCode: 'AES', primaryCode: 'A', description: '在電視、廣播或網路媒體上主持節目、播報新聞或主持活動，以清晰的口語表達與親和的形象與觀眾互動，傳遞資訊或娛樂內容。', workContent: ['準備節目腳本與採訪問題', '在直播或錄製中主持節目', '採訪來賓並引導對話', '與製作團隊協作規劃節目內容', '維護公眾形象並參與宣傳活動'], traits: ['口語表達清晰且具感染力', '臨場反應靈活', '具備親和力與觀眾緣', '能在鏡頭前保持自然', '對時事與社會議題有廣泛了解'] },
  { id: 'A011', nameZh: '造型設計師', nameEn: 'Stylist', hollandCode: 'AES', primaryCode: 'A', description: '為個人、藝人、廣告或影視作品規劃整體造型，包含服裝、髮型、妝容與配件的搭配，打造符合主題或個人風格的視覺形象。', workContent: ['與客戶溝通需求並提出造型方案', '挑選服裝、配件與道具', '協調髮型師與化妝師的工作', '在拍攝或活動現場監督造型呈現', '研究流行趨勢並建立靈感資料庫'], traits: ['對時尚與美學有敏銳感知', '具備創意與獨特的審美觀', '善於溝通並理解客戶需求', '能在壓力下快速做出決策', '具備廣泛的時尚與文化知識'] },
  { id: 'A012', nameZh: '多媒體設計師', nameEn: 'Multimedia Designer', hollandCode: 'AI', primaryCode: 'A', description: '整合文字、圖像、動畫、影音等多種媒體元素，創作互動式或數位內容，應用於網站、APP、廣告、教育或娛樂等領域。', workContent: ['設計網頁、APP或數位媒體的視覺介面', '製作動態圖形、動畫或影片', '整合互動功能與使用者體驗設計', '與程式開發人員協作實現設計', '測試並優化數位內容的呈現效果'], traits: ['兼具藝術創意與技術能力', '善於學習新軟體與工具', '具備使用者思維', '注重細節與視覺一致性', '能獨立作業也能團隊合作'] },
  { id: 'A013', nameZh: '詩人／作家', nameEn: 'Poet/Writer', hollandCode: 'AI', primaryCode: 'A', description: '以文字為媒介創作詩歌、小說、散文或其他文學作品，透過語言的藝術表達個人觀點、情感與對世界的洞察，豐富人類的精神文化。', workContent: ['構思並創作文學作品', '修改與潤飾文稿', '研究相關主題與背景資料', '與出版社或編輯合作出版', '參與文學活動、朗讀會或工作坊'], traits: ['對語言文字有高度敏感度與熱情', '具備豐富的想像力與觀察力', '能長時間獨立思考與創作', '對人性與社會有深刻洞察', '具備持續創作的毅力'] },
  { id: 'A014', nameZh: '建築師', nameEn: 'Architect', hollandCode: 'AIR', primaryCode: 'A', description: '設計建築物的外觀、空間配置與結構系統，兼顧美學、功能性、安全性與環境永續，將設計概念轉化為可建造的建築作品。', workContent: ['與客戶溝通需求並提出設計方案', '繪製建築圖面與3D模型', '協調結構、機電等工程師的設計', '監督施工過程確保設計落實', '申請建築許可並處理法規事務'], traits: ['兼具藝術美感與工程邏輯', '具備3D空間想像力', '注重細節且具系統思維', '善於溝通與跨專業協作', '對環境與人文有深刻關懷'] },
  { id: 'A015', nameZh: '攝影師', nameEn: 'Photographer', hollandCode: 'AR', primaryCode: 'A', description: '以相機捕捉影像，記錄人物、風景、事件或商業主題，透過構圖、光線與後製技術創作具有藝術價值或商業用途的攝影作品。', workContent: ['規劃拍攝主題、場景與燈光', '操作相機與攝影器材進行拍攝', '後製處理與修圖', '與客戶溝通需求並交付成品', '建立個人作品集與品牌形象'], traits: ['具備敏銳的視覺美感', '善於觀察光線與構圖', '具備耐心與等待時機的能力', '熟悉攝影器材與後製軟體', '能與被攝者建立信任感'] },
  { id: 'A016', nameZh: '藝術家', nameEn: 'Artist', hollandCode: 'AR', primaryCode: 'A', description: '以繪畫、雕塑、裝置藝術或其他媒材創作藝術作品，表達個人的創意、情感與對世界的詮釋，並透過展覽或銷售與大眾分享。', workContent: ['構思並創作藝術作品', '研究藝術史與當代藝術趨勢', '準備並參與藝術展覽', '與畫廊、策展人或收藏家合作', '申請藝術補助或駐村計畫'], traits: ['具備強烈的創作慾望與個人風格', '對藝術有深刻的熱情與投入', '能承受不確定性與經濟壓力', '具備自律與持續創作的能力', '對美學與文化有廣泛涉獵'] },
  { id: 'A017', nameZh: '舞者', nameEn: 'Dancer', hollandCode: 'AR', primaryCode: 'A', description: '以肢體動作詮釋音樂與情感，在舞台、影視或活動中進行表演。需要長期訓練以維持技術水準，並具備藝術表現力與身體控制能力。', workContent: ['每日進行舞蹈訓練與排練', '參與舞台演出或影視拍攝', '學習並詮釋不同風格的舞蹈', '與編舞家及其他舞者合作', '參與試鏡與演出機會爭取'], traits: ['具備優異的肢體協調與控制能力', '對音樂與節奏有高度敏感度', '具備強烈的表演慾望', '能承受高強度的體能訓練', '具備紀律與持續精進的精神'] },
  { id: 'A018', nameZh: '平面設計師', nameEn: 'Graphic Designer', hollandCode: 'ARE', primaryCode: 'A', description: '運用視覺元素（文字、圖像、色彩、排版）設計品牌識別、廣告、出版品或數位媒體，傳遞特定訊息並創造視覺吸引力。', workContent: ['設計品牌標誌、名片與視覺識別系統', '製作廣告、海報與行銷素材', '設計書籍、雜誌或包裝的版面', '與客戶溝通並根據回饋修改設計', '管理設計檔案與輸出規格'], traits: ['具備視覺美感與排版能力', '熟悉設計軟體（如Adobe系列）', '善於理解客戶需求並轉化為視覺', '注重細節與品質', '能在截止日期前完成工作'] },
  { id: 'A019', nameZh: '景觀／園藝設計師', nameEn: 'Landscape/Gardening Designer', hollandCode: 'ARE', primaryCode: 'A', description: '規劃並設計戶外空間的植栽配置、地形塑造與景觀元素，創造兼具美觀、生態與功能性的公共或私人綠色環境。', workContent: ['與客戶溝通需求並進行場地調查', '設計景觀平面圖與植栽計畫', '選擇適合的植物、材料與設施', '監督施工並確保設計落實', '提供後續維護建議'], traits: ['對自然環境與植物有熱情', '具備空間美感與設計能力', '了解植物生態與生長習性', '善於溝通並理解客戶需求', '能在戶外環境工作'] },
  { id: 'A020', nameZh: '翻譯／口譯', nameEn: 'Translator/Interpreter', hollandCode: 'AS', primaryCode: 'A', description: '在不同語言之間進行文字翻譯或即時口語傳譯，確保訊息的準確性、流暢性與文化適切性，服務於商業、外交、法律、文學或媒體等領域。', workContent: ['翻譯文件、書籍或商業資料', '在會議、法庭或活動中進行即時口譯', '研究專業術語與文化背景', '校對並確保譯文品質', '與客戶溝通並了解翻譯需求'], traits: ['精通兩種以上語言', '對語言細節與文化差異敏感', '具備快速思考與反應能力（口譯）', '注重準確性與細節', '具備廣泛的知識背景'] },
  // ═══════════════════════════════════════════════════════
  // C 事務型 (Conventional) - 9 張
  // ═══════════════════════════════════════════════════════
  { id: 'C001', nameZh: '會計師', nameEn: 'Accountant', hollandCode: 'CE', primaryCode: 'C', description: '負責記錄、分析與報告企業或個人的財務資訊，確保財務報表的準確性與合規性，並提供稅務規劃與財務建議。需要具備嚴謹的數字敏感度與法規知識。', workContent: ['編製財務報表與帳目', '進行稅務申報與規劃', '審核財務資料確保合規', '提供財務分析與建議', '協助內部或外部審計'], traits: ['對數字有高度敏感度', '嚴謹細心且注重準確性', '具備邏輯分析能力', '了解財務法規與會計準則', '能長時間專注於細節工作'] },
  { id: 'C002', nameZh: '採購', nameEn: 'Purchasing', hollandCode: 'CE', primaryCode: 'C', description: '負責為企業採購所需的原材料、商品或服務，透過市場調查、供應商評估與議價，確保以最佳成本取得符合品質要求的物資。', workContent: ['評估並選擇供應商', '進行採購議價與合約談判', '追蹤訂單進度確保準時交貨', '管理供應商關係', '分析採購成本並尋求節省機會'], traits: ['善於談判與溝通', '具備市場分析能力', '注重細節與流程管理', '能在壓力下做出決策', '具備成本意識'] },
  { id: 'C003', nameZh: '行政人員', nameEn: 'Administrative Personnel', hollandCode: 'CER', primaryCode: 'C', description: '負責辦公室日常行政事務，包含文件管理、會議安排、資料整理與跨部門協調，確保組織運作順暢。', workContent: ['處理文件歸檔與資料管理', '安排會議、出差與行程', '協調跨部門溝通與資訊傳遞', '管理辦公室物資與設備', '協助主管處理行政事務'], traits: ['組織能力強且注重細節', '善於多工處理', '具備良好的溝通能力', '能在繁忙環境中保持冷靜', '熟悉辦公軟體與行政流程'] },
  { id: 'C004', nameZh: '公務員', nameEn: 'Civil Servant', hollandCode: 'CES', primaryCode: 'C', description: '在政府機關服務，執行公共政策、提供行政服務，確保政府運作符合法規與公共利益。工作穩定，需遵守嚴格的行政程序與倫理規範。', workContent: ['執行政府政策與行政業務', '處理民眾申請與服務', '撰寫公文與行政報告', '協調跨機關業務', '參與政策研究與規劃'], traits: ['遵守規則且具備責任感', '善於處理文書與行政事務', '具備服務精神', '能在官僚體系中有效工作', '注重公共利益與倫理'] },
  { id: 'C005', nameZh: '資料與檔案管理員', nameEn: 'Data and File Manager', hollandCode: 'CI', primaryCode: 'C', description: '負責組織、維護與管理企業或機構的資料庫、文件檔案與資訊系統，確保資料的完整性、可及性與安全性。', workContent: ['建立並維護資料庫與檔案系統', '整理、分類與歸檔文件', '確保資料安全與備份', '協助使用者查詢與調閱資料', '制定資料管理規範與流程'], traits: ['具備高度的組織能力', '注重細節與準確性', '熟悉資料庫與文件管理系統', '能長時間專注於系統性工作', '具備資訊安全意識'] },
  { id: 'C006', nameZh: '精算師', nameEn: 'Actuary', hollandCode: 'CIE', primaryCode: 'C', description: '運用數學、統計與財務理論評估風險與不確定性，為保險、退休金、投資等領域提供精確的風險量化與定價建議。', workContent: ['建立風險評估模型', '分析保險產品的定價與準備金', '評估退休金計畫的財務健全性', '撰寫精算報告', '與管理層溝通風險建議'], traits: ['數學與統計能力卓越', '邏輯思維嚴謹', '具備解決複雜問題的能力', '注重細節與準確性', '能清晰表達複雜的數量概念'] },
  { id: 'C007', nameZh: '金融投資分析師', nameEn: 'Financial Investment Analyst', hollandCode: 'CIE', primaryCode: 'C', description: '分析金融市場、企業財務與經濟趨勢，為投資決策提供研究報告與建議，協助客戶或機構優化投資組合。', workContent: ['研究產業與企業基本面', '建立財務模型與估值分析', '撰寫投資研究報告', '追蹤市場動態與投資組合表現', '向客戶或管理層提報投資建議'], traits: ['對金融市場有高度興趣', '具備量化分析能力', '邏輯清晰且善於表達', '能在壓力下快速做出判斷', '持續學習市場知識'] },
  { id: 'C008', nameZh: '資訊安全人員', nameEn: 'Information Security Personnel', hollandCode: 'CIR', primaryCode: 'C', description: '負責保護企業資訊系統與資料免受網路攻擊、資料洩漏與未授權存取，制定並執行資安政策與防護措施。', workContent: ['監控網路與系統的安全狀態', '進行弱點掃描與滲透測試', '制定資安政策與應變計畫', '處理資安事件與調查', '提供員工資安教育訓練'], traits: ['對資訊安全有高度熱情', '具備邏輯分析與問題解決能力', '熟悉網路與系統架構', '能在壓力下快速應對威脅', '持續追蹤最新資安趨勢'] },
  { id: 'C009', nameZh: '網站開發人員', nameEn: 'Website Developer', hollandCode: 'CIR', primaryCode: 'C', description: '設計並開發網站的前端介面與後端功能，確保網站的效能、安全性與使用者體驗，並維護網站的正常運作。', workContent: ['撰寫前端（HTML/CSS/JS）與後端程式碼', '設計資料庫架構', '測試並修復程式錯誤', '優化網站效能與安全性', '與設計師及客戶協作確認需求'], traits: ['具備程式設計能力', '善於解決技術問題', '注重細節與程式品質', '能持續學習新技術', '具備邏輯思維與系統觀'] },
  // ═══════════════════════════════════════════════════════
  // E 企業型 (Enterprising) - 18 張
  // ═══════════════════════════════════════════════════════
  { id: 'E001', nameZh: '數位行銷', nameEn: 'Digital Marketing', hollandCode: 'EA', primaryCode: 'E', description: '運用數位媒體與網路平台規劃並執行行銷策略，透過SEO、社群媒體、電子郵件與廣告等管道提升品牌知名度與業績。', workContent: ['規劃並執行數位行銷活動', '管理社群媒體帳號與內容', '分析行銷數據並優化策略', '執行SEO與付費廣告（SEM）', '與設計師及內容創作者協作'], traits: ['對數位趨勢有高度敏感度', '具備創意與數據分析能力', '善於溝通與跨部門協作', '能快速適應變化的市場環境', '具備目標導向的執行力'] },
  { id: 'E002', nameZh: '廣告文案', nameEn: 'Copywriter', hollandCode: 'EA', primaryCode: 'E', description: '為廣告、行銷活動或品牌傳播撰寫具有說服力與創意的文字內容，透過精準的語言傳遞品牌訊息並激發目標受眾的行動。', workContent: ['撰寫廣告標語、文案與腳本', '與創意總監及設計師協作', '研究目標受眾與市場趨勢', '為不同媒體平台調整文案風格', '參與創意發想與提案'], traits: ['文字表達能力卓越', '具備創意與說服力', '善於理解品牌與受眾需求', '能在截止日期前完成高品質作品', '對語言細節有高度敏感度'] },
  { id: 'E003', nameZh: '導演', nameEn: 'Director', hollandCode: 'EA', primaryCode: 'E', description: '統籌電影、電視、廣告或舞台劇的創作方向，指導演員表演、協調各部門工作，將劇本轉化為完整的視聽作品。', workContent: ['詮釋劇本並制定創作方向', '指導演員表演與場景調度', '與攝影、美術、音效等部門協作', '監督拍攝進度與品質', '參與後製剪輯與最終審定'], traits: ['具備強烈的藝術視野與領導力', '善於溝通並激勵團隊', '能在壓力下做出快速決策', '對視覺與敘事有深刻理解', '具備解決問題的創意思維'] },
  { id: 'E004', nameZh: '公關', nameEn: 'Public Relations', hollandCode: 'EAS', primaryCode: 'E', description: '負責管理企業或個人的公眾形象，透過媒體關係、危機處理與活動策劃，建立並維護正面的品牌聲譽。', workContent: ['撰寫新聞稿與媒體資料', '維護媒體關係並安排採訪', '規劃並執行公關活動', '處理危機公關與輿情管理', '監測媒體報導並分析效果'], traits: ['善於溝通與建立人際關係', '具備危機處理能力', '文字表達清晰流暢', '能在壓力下保持冷靜', '對媒體生態有深入了解'] },
  { id: 'E005', nameZh: '不動產經紀人', nameEn: 'Real Estate Agent', hollandCode: 'EC', primaryCode: 'E', description: '協助客戶買賣或租賃不動產，提供市場分析、物件評估與交易協商服務，促成雙方達成滿意的交易。', workContent: ['了解客戶需求並推薦適合物件', '進行市場調查與物件估價', '安排看屋並介紹物件特色', '協助談判並處理交易文件', '維護客戶關係並開發新客源'], traits: ['善於溝通與建立信任', '具備市場分析能力', '積極主動且目標導向', '能承受業績壓力', '對不動產市場有深入了解'] },
  { id: 'E006', nameZh: '業務', nameEn: 'Sales', hollandCode: 'EC', primaryCode: 'E', description: '負責開發新客戶、維護既有客戶關係，透過產品或服務的介紹與說服，達成銷售目標並為企業創造營收。', workContent: ['開發潛在客戶並進行拜訪', '了解客戶需求並提供解決方案', '進行產品展示與提案', '談判合約條件並完成交易', '維護客戶關係並追蹤售後服務'], traits: ['善於溝通與說服', '積極主動且抗壓性強', '具備目標導向的執行力', '能快速建立信任關係', '對產品與市場有深入了解'] },
  { id: 'E007', nameZh: '門市／專櫃人員', nameEn: 'Store/Counter Staff', hollandCode: 'EC', primaryCode: 'E', description: '在零售門市或百貨專櫃服務顧客，提供產品介紹、銷售建議與售後服務，確保顧客有良好的購物體驗。', workContent: ['接待顧客並了解購買需求', '介紹產品特色並提供建議', '處理收銀與交易流程', '維護賣場陳列與庫存管理', '處理顧客投訴與退換貨'], traits: ['親切有禮且具服務熱忱', '善於溝通與說服', '能在繁忙環境中保持效率', '具備產品知識', '注重顧客體驗'] },
  { id: 'E008', nameZh: '軍官', nameEn: 'Military Officer', hollandCode: 'ECR', primaryCode: 'E', description: '在軍隊中擔任領導職務，負責指揮部隊、執行任務、訓練士兵，並維護國家安全與軍事紀律。', workContent: ['指揮並訓練所屬部隊', '規劃並執行軍事任務', '維護部隊紀律與士氣', '處理行政與後勤事務', '參與軍事演習與戰略規劃'], traits: ['具備強烈的領導力與責任感', '能在高壓環境下做出決策', '具備紀律與自律精神', '善於激勵與管理團隊', '具備體能與心理韌性'] },
  { id: 'E009', nameZh: '咖啡師', nameEn: 'Barista', hollandCode: 'ECR', primaryCode: 'E', description: '專業製作各式咖啡飲品，提供顧客優質的咖啡體驗，並在咖啡館或餐飲場所維護服務品質與環境整潔。', workContent: ['製作各式咖啡與飲品', '接待顧客並提供飲品建議', '維護咖啡機器與設備', '管理咖啡豆與原料庫存', '維持工作環境整潔'], traits: ['對咖啡有高度熱情與知識', '注重細節與品質', '具備服務熱忱', '能在繁忙環境中保持效率', '善於與顧客互動'] },
  { id: 'E010', nameZh: '保險經紀人', nameEn: 'Insurance Broker', hollandCode: 'ECS', primaryCode: 'E', description: '協助客戶評估風險需求，推薦並銷售適合的保險產品，提供保險規劃建議與理賠協助服務。', workContent: ['分析客戶風險需求並提供保險建議', '介紹並銷售保險產品', '協助客戶辦理投保與理賠', '維護客戶關係並定期追蹤', '開發新客源並達成業績目標'], traits: ['善於溝通與建立信任', '具備風險分析能力', '積極主動且目標導向', '能承受業績壓力', '對保險產品有深入了解'] },
  { id: 'E011', nameZh: '總經理', nameEn: 'General Manager', hollandCode: 'ECS', primaryCode: 'E', description: '負責企業整體營運管理，制定策略方向、統籌各部門工作，確保企業達成業務目標並持續成長。', workContent: ['制定企業策略與年度計畫', '統籌各部門運作與資源分配', '監督財務績效與業務目標達成', '代表企業對外溝通與談判', '建立企業文化與人才發展'], traits: ['具備卓越的領導力與決策能力', '善於策略思考與全局觀', '能在壓力下保持冷靜', '具備優秀的溝通與談判能力', '對商業環境有深刻洞察'] },
  { id: 'E012', nameZh: '專案管理師', nameEn: 'Project Manager', hollandCode: 'ECS', primaryCode: 'E', description: '負責規劃、執行與監控專案，協調跨部門資源，確保專案在時程、預算與品質目標內順利完成。', workContent: ['制定專案計畫與時程', '協調跨部門資源與溝通', '監控專案進度並處理風險', '管理專案預算與成本', '向利害關係人報告專案狀態'], traits: ['具備優秀的組織與規劃能力', '善於溝通與協調', '能在壓力下解決問題', '具備風險管理意識', '注重細節且目標導向'] },
  { id: 'E013', nameZh: '人力資源專員', nameEn: 'Human Resources Specialist', hollandCode: 'ECS', primaryCode: 'E', description: '負責企業人才招募、員工關係管理、薪酬福利規劃與教育訓練，確保企業擁有適合的人才並維持良好的工作環境。', workContent: ['執行招募流程與面試', '管理員工關係與勞資事務', '規劃薪酬福利制度', '設計並執行教育訓練計畫', '處理員工績效評估'], traits: ['善於溝通與建立人際關係', '具備同理心與公正性', '了解勞動法規', '能處理敏感的人事議題', '具備組織與規劃能力'] },
  { id: 'E014', nameZh: '律師', nameEn: 'Lawyer', hollandCode: 'EI', primaryCode: 'E', description: '提供法律諮詢、代理訴訟或處理法律事務，協助客戶了解並維護其法律權益，在法庭或談判中為客戶辯護。', workContent: ['研究法律案例與相關法規', '撰寫法律文件與合約', '代理客戶出庭訴訟', '提供法律諮詢與建議', '進行法律談判與調解'], traits: ['邏輯思維嚴謹且善於辯論', '具備強烈的正義感', '文字表達清晰有力', '能在壓力下保持冷靜', '具備廣泛的法律知識'] },
  { id: 'E015', nameZh: '網站行銷策畫', nameEn: 'Website Marketing Planner', hollandCode: 'EIC', primaryCode: 'E', description: '規劃並執行網站的行銷策略，透過內容行銷、SEO優化、使用者體驗改善等方式提升網站流量與轉換率。', workContent: ['制定網站行銷策略與計畫', '分析網站流量與使用者行為', '規劃內容行銷與SEO策略', '協調設計師與開發人員執行', '追蹤行銷成效並優化策略'], traits: ['對數位行銷有深入了解', '具備數據分析能力', '善於策略思考', '能跨部門協作', '具備創意與執行力'] },
  { id: 'E016', nameZh: '企管顧問', nameEn: 'Management Consultant', hollandCode: 'EIC', primaryCode: 'E', description: '協助企業診斷問題、制定策略並推動改善，提供專業的管理建議與解決方案，協助客戶提升競爭力與營運效率。', workContent: ['分析企業現況與問題', '研究產業趨勢與競爭環境', '制定改善策略與行動計畫', '協助客戶執行變革', '撰寫顧問報告並向管理層提報'], traits: ['具備強烈的分析與解決問題能力', '善於溝通與說服', '能快速學習不同產業知識', '具備策略思考能力', '能在壓力下交付高品質成果'] },
  { id: 'E017', nameZh: '船長／領航員', nameEn: 'Ship Captain/Navigator', hollandCode: 'ERC', primaryCode: 'E', description: '負責指揮船舶航行，確保船員、貨物與乘客的安全，並遵守海事法規與航行規範。', workContent: ['規劃航行路線與時程', '指揮船舶操作與航行', '監督船員工作與安全', '處理緊急狀況與海難應變', '維護航行日誌與相關文件'], traits: ['具備強烈的責任感與領導力', '能在壓力下冷靜決策', '具備航海知識與技術', '善於管理團隊', '具備體能與心理韌性'] },
  { id: 'E018', nameZh: '法官', nameEn: 'Judge', hollandCode: 'ES', primaryCode: 'E', description: '在法庭中主持審判程序，依據法律與證據做出公正裁決，維護司法正義與社會秩序。', workContent: ['主持法庭審判程序', '審閱案件資料與法律文件', '聆聽雙方陳述與辯論', '依法做出裁決與判決', '撰寫判決書'], traits: ['具備嚴謹的法律知識', '公正客觀且不偏不倚', '邏輯思維清晰', '能承受社會壓力', '具備高度的道德標準'] },

  { id: 'E019', nameZh: '議員／立法委員', nameEn: 'Legislator/Parliamentarian', hollandCode: 'ES', primaryCode: 'E', description: '代表選民在立法機構中參與法律制定、政策審議與政府監督，透過辯論、協商與投票推動社會改革與公共利益。', workContent: ['出席立法院或議會審議法案', '代表選民提出質詢', '參與委員會審查', '與選民溝通並服務選區', '研究政策議題並提出建議'], traits: ['具備強烈的公共服務精神', '善於溝通與辯論', '具備政治敏感度', '能承受公眾壓力', '對社會議題有深刻關懷'] },
  { id: 'E020', nameZh: '禮儀師', nameEn: 'Etiquette Expert', hollandCode: 'ESC', primaryCode: 'E', description: '為喪禮、婚禮或各類儀式提供專業的禮儀服務，協助家屬或客戶規劃並執行莊重、溫馨的儀式，給予情感支持。', workContent: ['規劃並執行各類儀式流程', '協助家屬處理相關事務', '提供情感支持與陪伴', '協調各方服務人員', '確保儀式莊重進行'], traits: ['具備同理心與細心', '善於溝通與安撫', '注重細節與流程', '能在情緒化環境中保持冷靜', '具備責任感'] },
  { id: 'E021', nameZh: '空服員', nameEn: 'Flight Attendant', hollandCode: 'ESC', primaryCode: 'E', description: '在飛機上為乘客提供安全指引、餐飲服務與緊急應變，確保乘客在飛行過程中的安全與舒適。', workContent: ['執行飛行前安全檢查', '提供乘客餐飲與服務', '執行安全示範與緊急應變', '處理乘客需求與投訴', '維護客艙整潔'], traits: ['親切有禮且具服務熱忱', '能在壓力下保持冷靜', '具備緊急應變能力', '善於溝通與多語言能力', '具備體力與耐力'] },
  { id: 'E022', nameZh: '客服人員', nameEn: 'Customer Service Personnel', hollandCode: 'ESC', primaryCode: 'E', description: '透過電話、線上或面對面方式處理客戶的詢問、投訴與需求，提供解決方案並確保客戶滿意度。', workContent: ['接聽並處理客戶詢問', '解決客戶投訴與問題', '記錄客戶資訊與服務紀錄', '協調內部部門解決問題', '提供產品或服務資訊'], traits: ['親切有禮且具耐心', '善於溝通與傾聽', '能在壓力下保持冷靜', '具備問題解決能力', '注重客戶體驗'] },
  { id: 'E023', nameZh: '按摩／美容師', nameEn: 'Massage/Beautician', hollandCode: 'ESR', primaryCode: 'E', description: '提供按摩、美容護膚、美甲或美髮等身體護理服務，協助客戶放鬆身心、改善外觀，提升生活品質。', workContent: ['提供各式按摩與身體護理', '進行臉部護膚與美容療程', '了解客戶需求並提供建議', '維護工作環境整潔', '持續學習新技術與療程'], traits: ['具備精細的手部操作能力', '善於溝通與傾聽', '具備服務熱忱', '注重衛生與品質', '能長時間站立工作'] },
  // ═══════════════════════════════════════════════════════
  // I 研究型 (Investigative) - 18 張
  // ═══════════════════════════════════════════════════════
  { id: 'I001', nameZh: '人類學家', nameEn: 'Anthropologist', hollandCode: 'IA', primaryCode: 'I', description: '研究人類的起源、文化、社會結構與行為，透過田野調查、文獻分析與比較研究，深入理解人類多樣性與文明發展。', workContent: ['進行田野調查與民族誌研究', '分析文化習俗與社會結構', '撰寫學術論文與研究報告', '參與博物館或文化機構的研究', '教授人類學相關課程'], traits: ['對人類文化有強烈的好奇心', '具備觀察力與同理心', '善於跨文化溝通', '能長時間進行田野研究', '具備嚴謹的學術研究能力'] },
  { id: 'I002', nameZh: '程式設計師', nameEn: 'Programmer', hollandCode: 'IC', primaryCode: 'I', description: '撰寫、測試與維護電腦程式，將業務需求轉化為可執行的軟體功能，解決技術問題並持續優化程式效能。', workContent: ['撰寫並測試程式碼', '分析需求並設計技術解決方案', '修復程式錯誤與優化效能', '撰寫技術文件', '與團隊協作進行軟體開發'], traits: ['具備邏輯思維與問題解決能力', '對程式設計有高度熱情', '能長時間專注於技術工作', '持續學習新技術', '注重程式品質與可維護性'] },
  { id: 'I003', nameZh: '數據分析師', nameEn: 'Data Analyst', hollandCode: 'ICE', primaryCode: 'I', description: '收集、清理與分析大量資料，從中發現規律與洞察，為企業決策提供數據支持與視覺化報告。', workContent: ['收集並清理資料', '進行統計分析與資料探勘', '建立資料視覺化報告', '與業務部門溝通分析結果', '建立並維護資料管道'], traits: ['對數據有高度敏感度', '具備統計與分析能力', '熟悉資料分析工具', '善於將複雜數據轉化為清晰洞察', '具備邏輯思維'] },
  { id: 'I004', nameZh: '藥師', nameEn: 'Pharmacist', hollandCode: 'ICS', primaryCode: 'I', description: '負責調配藥品、審核處方、提供用藥諮詢，確保患者安全用藥，並在醫療機構或藥局中提供專業的藥學服務。', workContent: ['審核並調配處方藥品', '提供用藥諮詢與衛教', '管理藥品庫存與效期', '與醫師協作確保用藥安全', '參與藥物治療管理'], traits: ['具備嚴謹的藥學知識', '注重細節與準確性', '善於溝通與衛教', '具備責任感', '能在繁忙環境中保持專注'] },
  { id: 'I005', nameZh: '市場調查人員', nameEn: 'Market Researcher', hollandCode: 'IEC', primaryCode: 'I', description: '設計並執行市場調查，收集消費者行為、市場趨勢與競爭情報，為企業的行銷策略與產品開發提供數據依據。', workContent: ['設計問卷與調查方法', '執行消費者訪談與焦點團體', '分析調查數據並撰寫報告', '研究市場趨勢與競爭環境', '向管理層提報調查結果'], traits: ['具備研究設計與分析能力', '善於溝通與訪談', '注重數據準確性', '能將數據轉化為商業洞察', '具備好奇心與探索精神'] },
  { id: 'I006', nameZh: '商業智慧分析師', nameEn: 'Business Intelligence Analyst', hollandCode: 'IEC', primaryCode: 'I', description: '建立並維護商業智慧系統，整合企業資料並提供決策支持報告，協助管理層了解業務績效與市場機會。', workContent: ['建立BI報表與儀表板', '整合多來源資料', '分析業務績效指標', '與業務部門協作定義需求', '維護資料倉儲與ETL流程'], traits: ['具備資料分析與視覺化能力', '熟悉BI工具', '善於理解業務需求', '注重資料品質', '具備邏輯思維'] },
  { id: 'I007', nameZh: '大氣科學家', nameEn: 'Atmospheric Scientist', hollandCode: 'IR', primaryCode: 'I', description: '研究大氣層的物理與化學特性，分析天氣現象與氣候變化，為天氣預報、氣候研究與環境政策提供科學依據。', workContent: ['收集並分析氣象數據', '建立天氣預報模型', '研究氣候變化趨勢', '撰寫科學論文與研究報告', '提供氣象諮詢服務'], traits: ['對自然科學有強烈的好奇心', '具備數學與統計能力', '善於分析複雜數據', '能長時間進行研究工作', '具備嚴謹的科學態度'] },
  { id: 'I008', nameZh: '電機工程師', nameEn: 'Electrical Engineer', hollandCode: 'IR', primaryCode: 'I', description: '設計、開發與測試電力系統、電子設備與電路，確保電氣系統的安全性、效能與可靠性。', workContent: ['設計電路與電力系統', '進行電氣設備測試與驗證', '分析並解決電氣問題', '撰寫技術規格與報告', '與其他工程師協作開發'], traits: ['具備電機工程知識', '善於解決技術問題', '注重安全與品質', '具備邏輯思維', '能持續學習新技術'] },
  { id: 'I009', nameZh: '航太工程師', nameEn: 'Aerospace Engineer', hollandCode: 'IR', primaryCode: 'I', description: '設計並開發飛機、太空船或相關系統，確保航空航太設備的安全性、效能與可靠性，推動人類探索天空與宇宙。', workContent: ['設計航空航太結構與系統', '進行飛行測試與性能分析', '解決工程問題並優化設計', '撰寫技術文件', '與跨領域團隊協作'], traits: ['對航空航太有強烈熱情', '具備工程分析能力', '注重安全與精確性', '善於解決複雜問題', '具備創新思維'] },
  { id: 'I010', nameZh: '人因工程師', nameEn: 'Human Factors Engineer', hollandCode: 'IR', primaryCode: 'I', description: '研究人類行為與能力，設計符合人體工學的產品、系統與工作環境，提升使用者的安全性、效率與舒適度。', workContent: ['進行使用者研究與可用性測試', '設計符合人體工學的介面與環境', '分析人機互動問題', '撰寫設計規範與研究報告', '與設計師及工程師協作'], traits: ['對人類行為有強烈好奇心', '具備研究設計能力', '善於觀察與分析', '能跨領域溝通', '注重使用者體驗'] },
  { id: 'I011', nameZh: '生命科學家', nameEn: 'Life Scientist', hollandCode: 'IR', primaryCode: 'I', description: '研究生物體的結構、功能、演化與生態，透過實驗與觀察探索生命的奧秘，為醫學、農業與環境保護提供科學基礎。', workContent: ['設計並執行生物實驗', '分析實驗數據', '撰寫科學論文', '申請研究經費', '參與學術交流與研討會'], traits: ['對生命科學有強烈的好奇心', '具備嚴謹的實驗能力', '善於分析複雜數據', '能長時間進行研究', '具備創新思維'] },
  { id: 'I012', nameZh: '生化工程師', nameEn: 'Biochemical Engineer', hollandCode: 'IR', primaryCode: 'I', description: '結合生物學與化學工程原理，設計並優化生物製程，應用於製藥、食品、環境等產業的生產與研發。', workContent: ['設計並優化生物製程', '進行實驗室研究與測試', '分析製程數據', '解決生產問題', '撰寫技術報告'], traits: ['具備生物與化學工程知識', '善於解決技術問題', '注重實驗精確性', '具備創新思維', '能跨領域協作'] },
  { id: 'I013', nameZh: '化工工程師', nameEn: 'Chemical Engineer', hollandCode: 'IR', primaryCode: 'I', description: '設計並優化化學製程，將原料轉化為有用產品，應用於石化、製藥、食品與材料等產業。', workContent: ['設計化學製程與設備', '優化生產效率與安全性', '分析製程數據', '解決生產問題', '撰寫技術規格'], traits: ['具備化學工程知識', '善於解決技術問題', '注重安全與環保', '具備邏輯思維', '能在複雜環境中工作'] },
  { id: 'I014', nameZh: '環工工程師', nameEn: 'Environmental Engineer', hollandCode: 'IRC', primaryCode: 'I', description: '設計並實施環境保護措施，處理廢水、廢氣與固體廢棄物，確保工業活動符合環保法規並減少對環境的衝擊。', workContent: ['設計廢水處理與污染防治系統', '進行環境影響評估', '監測環境品質', '確保符合環保法規', '研究環境保護技術'], traits: ['對環境保護有強烈使命感', '具備工程分析能力', '了解環保法規', '善於解決複雜問題', '具備責任感'] },
  { id: 'I015', nameZh: '機電工程師', nameEn: 'Mechatronics Engineer', hollandCode: 'IRC', primaryCode: 'I', description: '整合機械、電子與控制系統，設計並開發自動化設備與智慧機器，應用於製造、機器人與工業自動化領域。', workContent: ['設計機電整合系統', '開發自動化設備', '進行系統測試與調試', '解決機電問題', '撰寫技術文件'], traits: ['具備機械與電子工程知識', '善於整合跨領域技術', '注重系統可靠性', '具備創新思維', '能解決複雜技術問題'] },
  { id: 'I016', nameZh: '機械工程師', nameEn: 'Mechanical Engineer', hollandCode: 'IRC', primaryCode: 'I', description: '設計、分析與製造機械系統與設備，確保機械產品的功能性、安全性與效能，應用於製造、汽車、航太等產業。', workContent: ['設計機械零件與系統', '進行結構分析與模擬', '監督製造與測試流程', '解決機械問題', '撰寫技術規格'], traits: ['具備機械工程知識', '善於解決技術問題', '注重精確性與品質', '具備3D空間想像力', '能持續學習新技術'] },
  { id: 'I017', nameZh: '牙醫師', nameEn: 'Dentist', hollandCode: 'IRS', primaryCode: 'I', description: '診斷並治療口腔疾病，提供牙齒保健、修復與美容等服務，維護患者的口腔健康與整體健康。', workContent: ['進行口腔檢查與診斷', '執行補牙、拔牙與根管治療', '提供牙齒矯正與美容服務', '衛教患者口腔保健知識', '管理診所行政事務'], traits: ['具備精細的手部操作能力', '注重細節與精確性', '善於與患者溝通', '具備同理心', '能在有限空間內長時間工作'] },
  { id: 'I018', nameZh: '營養師', nameEn: 'Nutritionist', hollandCode: 'IS', primaryCode: 'I', description: '評估個人或群體的營養狀況，提供飲食建議與營養計畫，協助預防疾病並促進健康，服務於醫療、食品或公共衛生領域。', workContent: ['評估患者或客戶的營養狀況', '制定個人化飲食計畫', '提供營養諮詢與衛教', '研究食品營養成分', '參與公共衛生推廣活動'], traits: ['對健康與營養有強烈熱情', '善於溝通與衛教', '具備科學分析能力', '具備同理心', '能持續學習最新營養研究'] },
  // ═══════════════════════════════════════════════════════
  // R 實用型 (Realistic) - 12 張
  // ═══════════════════════════════════════════════════════
  { id: 'R001', nameZh: '保全', nameEn: 'Security Guard', hollandCode: 'RCE', primaryCode: 'R', description: '負責保護人員、財產與設施的安全，執行巡邏、門禁管制與緊急應變，維護安全秩序。', workContent: ['執行定期巡邏與安全檢查', '管理門禁與訪客登記', '監控監視系統', '處理緊急狀況與事故', '撰寫安全報告'], traits: ['具備責任感與警覺性', '體能良好', '能在壓力下保持冷靜', '具備溝通能力', '遵守規則與程序'] },
  { id: 'R002', nameZh: '產品維修人員', nameEn: 'Product Repair Technician', hollandCode: 'RCI', primaryCode: 'R', description: '診斷並修復各類電子、機械或家電產品的故障，確保產品恢復正常功能，提供客戶優質的維修服務。', workContent: ['診斷產品故障原因', '拆解並修復故障零件', '測試維修後的產品功能', '向客戶說明維修情況', '管理維修零件庫存'], traits: ['具備動手操作能力', '善於解決技術問題', '注重細節與品質', '具備耐心', '持續學習新技術'] },
  { id: 'R003', nameZh: '機長', nameEn: 'Pilot', hollandCode: 'RCI', primaryCode: 'R', description: '駕駛商業或私人飛機，確保乘客與貨物安全抵達目的地，遵守航空法規並在各種天氣條件下做出正確判斷。', workContent: ['執行飛行前檢查', '駕駛飛機並監控飛行系統', '與空中交通管制溝通', '處理緊急狀況', '撰寫飛行日誌'], traits: ['具備高度的責任感', '能在壓力下冷靜決策', '具備優異的空間感知能力', '注重安全與細節', '持續學習航空知識'] },
  { id: 'R004', nameZh: '運動員', nameEn: 'Athlete', hollandCode: 'RE', primaryCode: 'R', description: '以體育競技為職業，透過長期訓練與比賽展現運動技能，追求個人或團隊的最佳表現，並代表國家或俱樂部參與競賽。', workContent: ['每日進行體能與技術訓練', '參與國內外競賽', '與教練協作制定訓練計畫', '維護身體健康與傷後復健', '參與媒體活動與贊助商合作'], traits: ['具備卓越的體能與運動天賦', '具備強烈的競爭意識', '能承受高強度訓練', '具備紀律與自律精神', '能在壓力下發揮最佳表現'] },
  { id: 'R005', nameZh: '廚師', nameEn: 'Chef', hollandCode: 'REA', primaryCode: 'R', description: '在餐廳、飯店或食品機構中烹調各式料理，創作美味菜餚，管理廚房運作並確保食品安全與品質。', workContent: ['準備並烹調各式料理', '設計菜單與新菜色', '管理廚房人員與流程', '確保食材新鮮與食品安全', '控制食材成本'], traits: ['對烹飪有高度熱情與創意', '具備精細的手部操作能力', '能在高壓環境中工作', '注重衛生與品質', '善於團隊合作'] },
  { id: 'R006', nameZh: '警察', nameEn: 'Police Officer', hollandCode: 'REC', primaryCode: 'R', description: '維護社會治安與公共秩序，執行法律、預防犯罪、調查案件，保護市民的生命財產安全。', workContent: ['執行巡邏與治安維護', '處理報案與緊急事件', '調查犯罪案件', '執行逮捕與法律程序', '撰寫警察報告'], traits: ['具備強烈的正義感與責任感', '能在危險環境中保持冷靜', '具備體能與應變能力', '善於溝通與處理衝突', '遵守法律與倫理規範'] },
  { id: 'R007', nameZh: '動物飼養員', nameEn: 'Animal Caretaker', hollandCode: 'RI', primaryCode: 'R', description: '在動物園、農場或研究機構中照顧動物的日常需求，包含餵食、清潔、健康監測與行為觀察，確保動物的健康與福祉。', workContent: ['提供動物日常餵食與照護', '清潔動物居住環境', '監測動物健康狀況', '協助獸醫進行醫療處置', '記錄動物行為與健康資料'], traits: ['對動物有強烈的熱情與愛心', '具備耐心與細心', '能承受體力勞動', '善於觀察動物行為', '具備責任感'] },
  { id: 'R008', nameZh: '地理與航照測繪員', nameEn: 'Geographic and Aerial Surveyor', hollandCode: 'RIC', primaryCode: 'R', description: '使用測量儀器與航空攝影技術，收集地理空間資料，製作地圖與地理資訊系統資料，應用於工程、規劃與環境管理。', workContent: ['執行地面測量與航空攝影', '處理並分析地理空間資料', '製作地圖與GIS資料', '操作測量儀器與軟體', '撰寫測量報告'], traits: ['具備精確的測量能力', '善於使用技術儀器', '注重細節與準確性', '能在戶外環境工作', '具備地理知識'] },
  { id: 'R009', nameZh: '土木工程師', nameEn: 'Civil Engineer', hollandCode: 'RIC', primaryCode: 'R', description: '設計並監督道路、橋樑、建築物、水利設施等基礎建設的規劃與施工，確保工程的安全性、功能性與耐久性。', workContent: ['設計基礎建設工程', '監督施工進度與品質', '進行結構分析與計算', '處理工程問題', '撰寫工程報告'], traits: ['具備工程分析能力', '注重安全與品質', '善於解決技術問題', '能在戶外環境工作', '具備責任感'] },
  { id: 'R010', nameZh: '農業與食品技術員', nameEn: 'Agriculture and Food Technologist', hollandCode: 'RIC', primaryCode: 'R', description: '應用科學技術改善農業生產與食品加工，確保農產品與食品的品質、安全與效率，推動農業現代化。', workContent: ['研究並改善農業生產技術', '監控食品加工品質', '進行農產品與食品檢驗', '推廣農業技術', '撰寫技術報告'], traits: ['對農業與食品科學有熱情', '具備科學分析能力', '能在戶外與實驗室工作', '注重品質與安全', '善於解決實際問題'] },



  { id: 'I019', nameZh: '光電工程師', nameEn: 'Optoelectronics Engineer', hollandCode: 'IRC', primaryCode: 'I', description: '研究並應用光學與電子技術，設計開發光電元件、顯示器、光纖通訊與雷射系統，推動光電產業的技術創新。', workContent: ['設計光電元件與系統', '進行光學與電子測試', '研究新型光電材料', '解決光電技術問題', '撰寫技術報告'], traits: ['對光電科技有強烈好奇心', '具備物理與工程知識', '注重實驗精確性', '善於解決技術問題', '具備創新思維'] },
  { id: 'I020', nameZh: '電腦硬體工程師', nameEn: 'Computer Hardware Engineer', hollandCode: 'IRC', primaryCode: 'I', description: '設計並開發電腦硬體元件，包含處理器、記憶體、電路板與周邊設備，確保硬體系統的效能、可靠性與相容性。', workContent: ['設計電腦硬體架構', '開發並測試硬體元件', '分析硬體效能', '解決硬體相容性問題', '撰寫技術規格'], traits: ['具備電腦硬體知識', '善於解決技術問題', '注重細節與精確性', '具備邏輯思維', '能持續學習新技術'] },
  { id: 'I021', nameZh: '網管人員', nameEn: 'Network Administrator', hollandCode: 'IRC', primaryCode: 'I', description: '負責企業網路基礎設施的建置、維護與管理，確保網路系統的穩定性、安全性與效能，並處理網路故障與問題。', workContent: ['建置並維護網路基礎設施', '監控網路效能與安全', '處理網路故障與問題', '管理網路設備與配置', '撰寫網路文件'], traits: ['具備網路技術知識', '善於解決技術問題', '注重系統穩定性', '能在壓力下快速應對', '持續學習新技術'] },
  { id: 'I022', nameZh: '水土保育人員', nameEn: 'Soil and Water Conservationist', hollandCode: 'IRE', primaryCode: 'I', description: '規劃並執行水土保持措施，防止土壤侵蝕與水資源流失，保護自然環境並確保土地的永續利用。', workContent: ['調查並評估水土流失問題', '設計水土保持工程', '監督施工並確保效果', '推廣水土保育觀念', '撰寫環境評估報告'], traits: ['對自然環境有強烈使命感', '具備工程與生態知識', '能在戶外環境工作', '善於解決環境問題', '具備責任感'] },
  { id: 'I023', nameZh: '材料工程師', nameEn: 'Materials Engineer', hollandCode: 'IRE', primaryCode: 'I', description: '研究並開發各種材料（金屬、陶瓷、聚合物、複合材料），改善材料性能，應用於製造、電子、航太等產業。', workContent: ['研究材料特性與性能', '開發新材料與製程', '進行材料測試與分析', '解決材料相關問題', '撰寫技術報告'], traits: ['對材料科學有強烈好奇心', '具備實驗能力', '注重細節與精確性', '善於解決技術問題', '具備創新思維'] },
  { id: 'I024', nameZh: '醫師', nameEn: 'Physician', hollandCode: 'ISR', primaryCode: 'I', description: '診斷並治療各種疾病與傷害，提供預防保健建議，確保患者的身體健康，在醫院、診所或社區醫療機構中服務。', workContent: ['進行病史詢問與身體檢查', '診斷疾病並制定治療計畫', '開立處方並執行醫療處置', '與其他醫療人員協作', '提供患者衛教'], traits: ['具備廣泛的醫學知識', '善於溝通與同理心', '能在壓力下做出決策', '注重細節與準確性', '具備強烈的責任感'] },
  { id: 'I025', nameZh: '獸醫', nameEn: 'Veterinarian', hollandCode: 'ISR', primaryCode: 'I', description: '診斷並治療動物的疾病與傷害，提供預防保健服務，確保動物的健康與福祉，服務於動物醫院、農場或研究機構。', workContent: ['進行動物健康檢查與診斷', '執行手術與醫療處置', '開立藥物並提供治療', '提供動物主人衛教', '參與動物疾病防治'], traits: ['對動物有強烈的愛心', '具備廣泛的獸醫學知識', '善於溝通', '能在壓力下做出決策', '具備精細的手部操作能力'] },
  // ═══════════════════════════════════════════════════════
  // S 社會型 (Social) - 13 張
  // ═══════════════════════════════════════════════════════
  { id: 'S001', nameZh: '幼教老師', nameEn: 'Preschool Teacher', hollandCode: 'SA', primaryCode: 'S', description: '在幼兒園或托育機構中照顧並教育幼兒，透過遊戲、故事與活動促進幼兒的認知、情感與社會發展。', workContent: ['設計並執行幼兒教育活動', '照顧幼兒的日常生活需求', '觀察並記錄幼兒發展狀況', '與家長溝通幼兒學習情況', '維護安全的學習環境'], traits: ['對幼兒有強烈的愛心與耐心', '具備創意與活力', '善於溝通與觀察', '具備責任感', '能在繁忙環境中保持冷靜'] },
  { id: 'S002', nameZh: '國高中老師', nameEn: 'High School Teacher', hollandCode: 'SA', primaryCode: 'S', description: '在國中或高中教授特定學科，引導學生學習知識與技能，培養學生的思考能力與品格，並協助學生面對升學挑戰。', workContent: ['備課並設計教學活動', '在課堂中教授學科知識', '評量學生學習成效', '與家長溝通學生狀況', '參與學校行政與課外活動'], traits: ['對教育有強烈的熱情', '具備學科專業知識', '善於溝通與引導', '具備耐心與同理心', '能激勵學生學習'] },
  { id: 'S003', nameZh: '社工師', nameEn: 'Social Worker', hollandCode: 'SE', primaryCode: 'S', description: '協助弱勢族群、家庭或社區解決社會問題，提供資源連結、心理支持與倡議服務，促進社會公平與個人福祉。', workContent: ['評估個案需求並制定服務計畫', '連結社會資源與福利服務', '提供個案諮詢與支持', '進行家庭訪視', '撰寫個案報告'], traits: ['具備強烈的同理心與使命感', '善於溝通與建立信任', '能承受情緒壓力', '了解社會福利制度', '具備問題解決能力'] },
  { id: 'S004', nameZh: '神職人員', nameEn: 'Clergy', hollandCode: 'SEA', primaryCode: 'S', description: '在宗教機構中服務信眾，提供靈性指引、宗教儀式主持與社區關懷，協助信眾面對生命中的挑戰與意義探索。', workContent: ['主持宗教儀式與禮拜', '提供靈性諮詢與牧靈關懷', '講道與宗教教育', '參與社區服務與慈善活動', '管理宗教機構事務'], traits: ['具備強烈的信仰與使命感', '善於溝通與傾聽', '具備同理心', '能在困難情境中給予支持', '具備廣泛的宗教與人文知識'] },
  { id: 'S005', nameZh: '導遊／導覽員', nameEn: 'Tour Guide', hollandCode: 'SEA', primaryCode: 'S', description: '帶領旅客參觀景點，提供歷史、文化與地理知識的解說，確保旅客有安全、愉快且豐富的旅遊體驗。', workContent: ['規劃並帶領旅遊行程', '解說景點的歷史與文化', '協調交通與住宿安排', '處理旅途中的突發狀況', '與旅客建立良好互動'], traits: ['善於溝通與表達', '具備廣泛的歷史文化知識', '具備親和力與服務熱忱', '能在壓力下保持冷靜', '具備語言能力'] },
  { id: 'S006', nameZh: '服務生', nameEn: 'Waitstaff/Server', hollandCode: 'SEC', primaryCode: 'S', description: '在餐廳或餐飲場所為顧客提供點餐、上菜與結帳服務，確保顧客有良好的用餐體驗。', workContent: ['接待顧客並介紹菜單', '記錄並傳遞點餐資訊', '上菜並確保服務品質', '處理顧客需求與投訴', '維護用餐環境整潔'], traits: ['親切有禮且具服務熱忱', '能在繁忙環境中保持效率', '善於溝通與應變', '具備體力與耐力', '注重顧客體驗'] },
  { id: 'S007', nameZh: '家教／補習班老師', nameEn: 'Tutor', hollandCode: 'SEI', primaryCode: 'S', description: '為學生提供個別化或小班制的學科輔導，針對學生的學習需求設計教學內容，協助學生提升學業成績與學習信心。', workContent: ['評估學生學習狀況', '設計個別化教學計畫', '進行一對一或小班教學', '追蹤學生學習進度', '與家長溝通學習狀況'], traits: ['具備學科專業知識', '善於溝通與引導', '具備耐心與同理心', '能激勵學生學習', '善於因材施教'] },
  { id: 'S008', nameZh: '教授', nameEn: 'Professor', hollandCode: 'SI', primaryCode: 'S', description: '在大學或研究機構中從事教學與學術研究，培育高等人才，推動知識創新，並參與學術社群的交流與服務。', workContent: ['設計並講授大學課程', '進行學術研究並發表論文', '指導研究生', '申請研究計畫', '參與學術研討會與服務'], traits: ['對學術研究有強烈熱情', '具備深厚的專業知識', '善於溝通與教學', '具備批判性思維', '能長時間進行研究'] },
  { id: 'S009', nameZh: '諮商與臨床心理師', nameEn: 'Counseling and Clinical Psychologist', hollandCode: 'SIA', primaryCode: 'S', description: '透過心理評估、諮商與治療，協助個人處理心理健康問題、情緒困擾與行為障礙，促進心理健康與生活品質。', workContent: ['進行心理評估與診斷', '提供個別或團體心理諮商', '設計並執行心理治療計畫', '撰寫心理評估報告', '參與跨專業團隊合作'], traits: ['具備強烈的同理心', '善於傾聽與溝通', '能承受情緒壓力', '具備嚴謹的心理學知識', '注重倫理與保密原則'] },
  { id: 'S010', nameZh: '護理師', nameEn: 'Nurse', hollandCode: 'SIC', primaryCode: 'S', description: '在醫療機構中提供直接的護理照護，執行醫療處置、監測患者狀況、提供衛教，並協助醫師進行診療工作。', workContent: ['執行護理評估與照護計畫', '進行醫療處置與給藥', '監測患者生命徵象', '提供患者與家屬衛教', '記錄護理紀錄'], traits: ['具備強烈的同理心與責任感', '能在高壓環境中保持冷靜', '注重細節與準確性', '善於溝通', '具備體力與心理韌性'] },
  { id: 'S011', nameZh: '物理與職能治療師', nameEn: 'Physiotherapist', hollandCode: 'SIR', primaryCode: 'S', description: '評估並治療因疾病、受傷或障礙導致的身體功能問題，透過運動治療、手法治療與輔具使用，協助患者恢復功能與獨立生活能力。', workContent: ['評估患者身體功能狀況', '設計並執行治療計畫', '進行運動治療與手法治療', '指導患者進行復健運動', '撰寫治療紀錄'], traits: ['具備同理心與耐心', '善於溝通與激勵', '具備解剖學與生理學知識', '注重細節', '能承受體力勞動'] },
  { id: 'S012', nameZh: '看護', nameEn: 'Caregiver', hollandCode: 'SRC', primaryCode: 'S', description: '為老年人、病患或身心障礙者提供日常生活照護，包含個人衛生、飲食協助、陪伴與基本醫療輔助，確保被照護者的安全與舒適。', workContent: ['協助被照護者的日常生活活動', '提供個人衛生照護', '監測健康狀況並回報', '陪伴並提供情感支持', '協助復健活動'], traits: ['具備強烈的愛心與耐心', '善於溝通與傾聽', '能承受體力勞動', '具備責任感', '能在壓力下保持冷靜'] },
  { id: 'S013', nameZh: '運動教練', nameEn: 'Sports Coach', hollandCode: 'SRE', primaryCode: 'S', description: '指導運動員或一般民眾進行體能訓練與技術提升，制定訓練計畫，激勵學員達成運動目標，並確保訓練安全。', workContent: ['評估學員體能與技術水準', '設計個別化訓練計畫', '指導技術動作與戰術', '激勵學員並追蹤進度', '確保訓練安全'], traits: ['對運動有強烈熱情', '善於溝通與激勵', '具備運動專業知識', '具備耐心與同理心', '能在戶外環境工作'] },

];
  // CONSTANTS
/**
 * career-card-constants.js
 * 熱情探索工具（Career Card / Passion Discovery Tool）常數定義
 *
 * 包含：
 *   - HOLLAND_COLORS：Holland Code 六大類配色對照表
 *   - REFLECTION_QUESTIONS：固定 5 題反思問題（含 {primaryType} 佔位符）
 *   - appState：應用程式初始狀態物件
 */

// ─────────────────────────────────────────────
// Holland Code 配色對照表
// 對應需求 2.3：各主導碼的背景色、中文標籤與英文名稱
// ─────────────────────────────────────────────
const HOLLAND_COLORS = {
  R: { bg: '#FFE0C8', label: '實用型', name: 'Realistic' },
  I: { bg: '#C8E0FF', label: '研究型', name: 'Investigative' },
  A: { bg: '#FFF5C8', label: '藝術型', name: 'Artistic' },
  S: { bg: '#C8F0F0', label: '社會型', name: 'Social' },
  E: { bg: '#D4F0C8', label: '企業型', name: 'Enterprising' },
  C: { bg: '#E8D4F8', label: '事務型', name: 'Conventional' }
};

// ─────────────────────────────────────────────
// 固定 5 題反思問題
// 對應需求 7.1：問題內容固定，不隨使用者資料動態生成
// 對應需求 7.2：問題 2 與問題 4 含 {primaryType} 佔位符，
//               由 personalizeReflections() 替換為主要熱情傾向類別名稱
// ─────────────────────────────────────────────
const REFLECTION_QUESTIONS = [
  '在你「純粹喜歡」的工作中，你注意到哪些共同的主題或模式？',
  '你的主要熱情傾向是「{primaryType}」，這個結果讓你感到意外嗎？為什麼？',
  '如果不考慮薪資、能力或他人期望，你最想從事哪一份工作？是什麼吸引你？',
  '你的「{primaryType}」傾向在你目前的生活或工作中，有哪些地方已經得到滿足？',
  '看完這份探索結果，你想對未來的自己說什麼？'
];

// ─────────────────────────────────────────────
// 應用程式初始狀態
// 對應設計文件 Architecture > 狀態管理
// ─────────────────────────────────────────────
const appState = {
  currentStep: 0,        // 0=welcome, 1-6=steps, 7=report
  selectedCards: new Set(),  // Step 1 選取的職業卡 ID（Set<string>）
  classifications: {},   // Step 2 分類結果：{ [cardId]: 'pure_like' | 'others_expectation' | 'capable_only' }
  reasons: {},           // Step 3 填寫的原因：{ [cardId]: { reason: '', enjoyment: '', achievement: '' } }
  insights: {},          // Step 4 填寫的洞察：{ [cardId]: string }
  reflections: {},       // Step 6 填寫的反思：{ [questionIndex]: string }
  lastSaved: null        // Date | null，最後儲存時間
};

  // CORE
/**
 * career-card-core.js
 * 熱情探索工具（Career Card / Passion Discovery Tool）核心純函式
 *
 * 包含：
 *   - personalizeReflections：將反思問題中的 {primaryType} 佔位符替換為主要熱情傾向類別名稱
 *   - validateStep2：驗證 Step 2 所有卡片已分類且 Pure_Like 數量 ≥ 10
 */

// ─────────────────────────────────────────────
// 個人化反思問題
// 對應需求 7.2：問題中的 {primaryType} 佔位符替換為主要熱情傾向類別名稱
// ─────────────────────────────────────────────

/**
 * 將反思問題陣列中所有 {primaryType} 佔位符替換為指定的主要熱情傾向類別名稱。
 *
 * @param {string[]} questions - 反思問題字串陣列（可含 {primaryType} 佔位符）
 * @param {string} primaryType - 主要熱情傾向類別名稱，例如「藝術型」
 * @returns {string[]} 替換後的新問題陣列（不修改原陣列）
 *
 * @example
 * personalizeReflections(
 *   ['你的主要熱情傾向是「{primaryType}」，這個結果讓你感到意外嗎？'],
 *   '藝術型'
 * );
 * // → ['你的主要熱情傾向是「藝術型」，這個結果讓你感到意外嗎？']
 */
function personalizeReflections(questions, primaryType) {
  return questions.map(q => q.replaceAll('{primaryType}', primaryType));
}

// ─────────────────────────────────────────────
// Step 2 驗證
// 對應需求 3.4：所有卡片已分類 && Pure_Like 數量 ≥ 10
// ─────────────────────────────────────────────

/**
 * 驗證 Step 2 的分類狀態是否符合進入 Step 3 的條件。
 *
 * 驗證規則：
 *   1. selectedCards 中的每張卡片都必須在 classifications 中有對應的分類記錄
 *   2. 分類為 'pure_like' 的卡片數量必須 ≥ 5
 *
 * @param {object} state - 應用程式狀態物件
 * @param {Set<string>} state.selectedCards - Step 1 選取的職業卡 ID 集合
 * @param {Object.<string, string>} state.classifications - 各職業卡的分類結果
 *   值為 'pure_like' | 'others_expectation' | 'capable_only'
 * @returns {{ valid: boolean, errors: string[] }} 驗證結果
 *
 * @example
 * // 所有卡片已分類且 pure_like >= 5 → valid
 * validateStep2({
 *   selectedCards: new Set(['A001', ...]),  // 5+ 張
 *   classifications: { 'A001': 'pure_like', ... }
 * });
 * // → { valid: true, errors: [] }
 *
 * @example
 * // 有未分類卡片 → invalid
 * validateStep2({
 *   selectedCards: new Set(['A001', 'A002']),
 *   classifications: { 'A001': 'pure_like' }  // A002 未分類
 * });
 * // → { valid: false, errors: ['請為所有職業卡完成分類'] }
 */
function validateStep2(state) {
  const errors = [];
  const { selectedCards, classifications } = state;

  // 檢查是否所有選取的卡片都已完成分類
  let hasUnclassified = false;
  for (const cardId of selectedCards) {
    if (!classifications[cardId]) {
      hasUnclassified = true;
      break;
    }
  }

  if (hasUnclassified) {
    errors.push('請為所有職業卡完成分類');
  }

  // 計算 pure_like 數量
  let pureLikeCount = 0;
  for (const cardId of selectedCards) {
    if (classifications[cardId] === 'pure_like') {
      pureLikeCount++;
    }
  }

  if (pureLikeCount < 5) {
    errors.push(
      `純粹喜歡的工作需達 5 項（目前 ${pureLikeCount} 項），請返回 Step 1 增加選取數量`
    );
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// ─────────────────────────────────────────────
// 資料驗證
// 對應需求 1.5：驗證匯入 JSON 是否包含所有必要欄位
// ─────────────────────────────────────────────

/**
 * 驗證匯入的 JSON 資料是否包含所有必要欄位。
 *
 * @param {object} data - 待驗證的資料物件
 * @returns {boolean} 是否合法
 */
function validateImportedData(data) {
  if (!data || typeof data !== 'object') return false;
  const required = ['version', 'selectedCards', 'classifications', 'reasons', 'insights', 'reflections'];
  return required.every(field => Object.prototype.hasOwnProperty.call(data, field));
}

// ─────────────────────────────────────────────
// 持久化：儲存至 localStorage
// 對應需求 9.1：操作後 1 秒內寫入 localStorage
// ─────────────────────────────────────────────

/**
 * 將 appState 序列化並寫入 localStorage['career_card_data']。
 * selectedCards (Set) 會轉換為 Array 以利 JSON 序列化。
 * 若 localStorage 空間不足，顯示 toast 警告。
 *
 * @param {object} state - 應用程式狀態物件
 */
function saveToStorage(state) {
  try {
    const serializable = Object.assign({}, state, {
      version: '1.0',
      selectedCards: Array.from(state.selectedCards),
      lastSaved: new Date().toISOString()
    });
    localStorage.setItem('career_card_data', JSON.stringify(serializable));
    // 更新 lastSaved 在 state 上
    state.lastSaved = new Date();
    // 更新 Save Indicator（若函式存在）
    if (typeof updateSaveIndicator === 'function') updateSaveIndicator();
  } catch (e) {
    console.error('[saveToStorage] error:', e);
    if (typeof showToast === 'function') {
      showToast('自動儲存失敗，建議手動匯出 JSON 備份');
    }
  }
}

// ─────────────────────────────────────────────
// 持久化：從 localStorage 讀取
// 對應需求 1.1：開啟工具時優先檢查 localStorage
// ─────────────────────────────────────────────

/**
 * 從 localStorage 讀取並反序列化探索資料。
 * selectedCards 陣列會還原為 Set。
 * 失敗或資料不合法時返回 null。
 *
 * @returns {object|null} 還原的狀態物件，或 null
 */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem('career_card_data');
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    // 還原 selectedCards 為 Set（寬鬆驗證：只要有 selectedCards 欄位即可）
    if (!Object.prototype.hasOwnProperty.call(data, 'selectedCards')) return null;
    data.selectedCards = new Set(Array.isArray(data.selectedCards) ? data.selectedCards : []);
    // 確保其他欄位有預設值
    data.classifications = data.classifications || {};
    data.reasons = data.reasons || {};
    data.insights = data.insights || {};
    data.reflections = data.reflections || {};
    return data;
  } catch (e) {
    return null;
  }
}

// ─────────────────────────────────────────────
// 匯出 JSON
// 對應需求 8.3, 8.5：觸發下載，包含 7 個必要欄位
// ─────────────────────────────────────────────

/**
 * 建構包含所有 7 個必要欄位的 JSON 物件並觸發瀏覽器下載。
 * 同時返回該物件以利測試。
 *
 * @param {object} state - 應用程式狀態物件
 * @returns {object} 匯出的 JSON 物件
 */
function exportJSON(state) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;

  const exportObj = {
    version: '1.0',
    exportedAt: now.toISOString(),
    selectedCards: Array.from(state.selectedCards),
    classifications: state.classifications,
    reasons: state.reasons,
    insights: state.insights,
    reflections: state.reflections
  };

  // 觸發瀏覽器下載（僅在瀏覽器環境中執行）
  if (typeof document !== 'undefined') {
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career_card_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return exportObj;
}

// ─────────────────────────────────────────────
// Holland Code 字母頻率統計
// 對應需求 6.1：統計 Pure_Like 卡片中各字母出現總次數
// ─────────────────────────────────────────────

/**
 * 統計 Pure_Like 卡片中各 Holland Code 字母（R/I/A/S/E/C）出現總次數。
 * 例如 hollandCode 為 "AER" 的卡片，A、E、R 各計 1 次。
 *
 * @param {object[]} pureLikeCards - Pure_Like 職業卡物件陣列
 * @returns {Object.<string, number>} 各字母的出現次數，如 { R:3, I:5, A:2, S:1, E:4, C:0 }
 */
function computeHollandFrequency(pureLikeCards) {
  const freq = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const card of pureLikeCards) {
    const code = card.hollandCode || '';
    for (const ch of code) {
      if (Object.prototype.hasOwnProperty.call(freq, ch)) {
        freq[ch]++;
      }
    }
  }
  return freq;
}

// ─────────────────────────────────────────────
// Holland Code 排序
// 對應需求 6.2：依頻率由高至低排序，並列時依 R,I,A,S,E,C 固定順序
// ─────────────────────────────────────────────

/**
 * 依頻率由高至低排序六大類，並列時依 R,I,A,S,E,C 固定順序。
 *
 * @param {Object.<string, number>} frequency - 各字母的出現次數
 * @returns {{ code: string, label: string, count: number, rank: number }[]} 排序後的 6 個項目
 */
function rankHollandTypes(frequency) {
  const ORDER = ['R', 'I', 'A', 'S', 'E', 'C'];
  const LABELS = { R: '實用型', I: '研究型', A: '藝術型', S: '社會型', E: '企業型', C: '事務型' };

  const items = ORDER.map(code => ({
    code,
    label: LABELS[code],
    count: frequency[code] || 0
  }));

  // 依 count 降序，並列時依 ORDER 固定順序（已按 ORDER 建立，穩定排序保持相對順序）
  items.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return ORDER.indexOf(a.code) - ORDER.indexOf(b.code);
  });

  return items.map((item, i) => Object.assign({}, item, { rank: i + 1 }));
}

const debouncedJobs = {};

function scheduleSave(key, callback, delay) {
  if (debouncedJobs[key]) clearTimeout(debouncedJobs[key]);
  debouncedJobs[key] = setTimeout(function() {
    delete debouncedJobs[key];
    callback();
  }, delay);
}

function getHollandLabel(code) {
  return HOLLAND_COLORS[code] ? HOLLAND_COLORS[code].label : code;
}

function renderCareerCard(card, isSelected) {
  var cardDiv = document.createElement('div');
  cardDiv.className = 'career-card' + (isSelected ? ' selected' : '');
  cardDiv.setAttribute('role', 'button');
  cardDiv.setAttribute('tabindex', '0');
  cardDiv.setAttribute('aria-label', card.nameZh + '，點擊選取');
  cardDiv.dataset.cardId = card.id;
  cardDiv.style.background = HOLLAND_COLORS[card.primaryCode] ? HOLLAND_COLORS[card.primaryCode].bg : 'white';
  cardDiv.innerHTML = `
    <div class="card-selected-badge">✓</div>
    <div class="card-top-row">
      <div class="card-code-badge">${card.hollandCode}</div>
      <button class="card-info-btn" type="button" aria-label="查看${card.nameZh}詳細說明">i</button>
    </div>
    <div class="card-name-zh">${card.nameZh}</div>
    <div class="card-name-en">${card.nameEn}</div>`;

  cardDiv.addEventListener('click', function() {
    toggleCardSelection(card.id);
  });
  cardDiv.addEventListener('keydown', function(evt) {
    if (evt.key === 'Enter' || evt.key === ' ') {
      evt.preventDefault();
      toggleCardSelection(card.id);
    }
  });
  cardDiv.querySelector('.card-info-btn').addEventListener('click', function(evt) {
    evt.stopPropagation();
    openInfoModal(card.id);
  });
  return cardDiv;
}

function toggleCardSelection(cardId) {
  if (appState.selectedCards.has(cardId)) {
    appState.selectedCards.delete(cardId);
    delete appState.classifications[cardId];
    delete appState.reasons[cardId];
    delete appState.insights[cardId];
  } else {
    if (appState.selectedCards.size >= 15) {
      showToast('最多只能選取 15 張職業卡');
      return;
    }
    appState.selectedCards.add(cardId);
  }
  saveToStorage(appState);
  renderStep1();
  updateStepTabs();
}

function updateStepTabs() {
  var selectedCount = appState.selectedCards.size;
  document.getElementById('tab-1-count').textContent = selectedCount ? '已選 ' + selectedCount + ' / 15 張' : '尚未選取';

  var pure = 0, others = 0, capable = 0;
  Object.keys(appState.classifications).forEach(function(cardId) {
    if (appState.classifications[cardId] === 'pure_like') pure++;
    if (appState.classifications[cardId] === 'others_expectation') others++;
    if (appState.classifications[cardId] === 'capable_only') capable++;
  });
  document.getElementById('tab-2-count').textContent = selectedCount ? '已分類 ' + (pure + others + capable) + ' / ' + selectedCount : '等待分類';
  document.getElementById('tab-3-count').textContent = pure ? '純粹喜歡 ' + pure + ' 張' : '等待填寫';
  document.getElementById('tab-4-count').textContent = (others + capable) ? '已填洞察' : '等待填寫';
  document.getElementById('tab-5-count').textContent = pure ? '已統計' : '尚未完成';
  document.getElementById('tab-6-count').textContent = pure ? '準備好' : '尚未完成';
}

function openInfoModal(cardId) {
  var card = CAREER_CARDS.find(function(item) { return item.id === cardId; });
  if (!card) return;
  document.getElementById('info-modal-title').textContent = card.nameZh + ' / ' + card.nameEn;
  document.getElementById('info-modal-code').textContent = 'Holland Code: ' + card.hollandCode;
  document.getElementById('info-modal-desc').textContent = card.description;
  var workList = document.getElementById('info-modal-work-content');
  var traitsList = document.getElementById('info-modal-traits');
  workList.innerHTML = '';
  traitsList.innerHTML = '';
  card.workContent.forEach(function(item) {
    var li = document.createElement('div');
    li.className = 'modal-list-item';
    li.textContent = item;
    workList.appendChild(li);
  });
  card.traits.forEach(function(item) {
    var li = document.createElement('div');
    li.className = 'modal-list-item';
    li.textContent = item;
    traitsList.appendChild(li);
  });
  document.getElementById('info-modal-backdrop').classList.add('open');
  document.getElementById('info-modal-close').focus();
}

function shuffleArray(array) {
  var result = array.slice();
  for (var i = result.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

var SHUFFLED_STEP1_CARDS = shuffleArray(CAREER_CARDS);

function renderStep1() {
  var container = document.getElementById('step1-cards');
  container.innerHTML = '';
  var grid = document.createElement('div');
  grid.className = 'card-grid';
  SHUFFLED_STEP1_CARDS.forEach(function(card) {
    grid.appendChild(renderCareerCard(card, appState.selectedCards.has(card.id)));
  });
  container.appendChild(grid);
  updateStepTabs();
}

function renderStep2() {
  var container = document.getElementById('step2-cards');
  container.innerHTML = '';
  var selectedIds = Array.from(appState.selectedCards);
  if (!selectedIds.length) {
    container.innerHTML = '<p class="no-cards-msg">你尚未選取任何職業卡，請返回 Step 1 選擇職業。</p>';
    return;
  }
  var pure = 0, others = 0, capable = 0;
  selectedIds.forEach(function(cardId) {
    var card = CAREER_CARDS.find(function(item) { return item.id === cardId; });
    if (!card) return;
    var classification = appState.classifications[cardId] || '';
    if (classification === 'pure_like') pure++;
    if (classification === 'others_expectation') others++;
    if (classification === 'capable_only') capable++;

    var cardWrapper = document.createElement('div');
    cardWrapper.className = 'classify-card';
    cardWrapper.dataset.cardId = cardId;
    var header = document.createElement('div');
    header.className = 'classify-card-header';
    header.innerHTML = '<div><div class="classify-card-name">' + card.nameZh + '</div><div class="card-name-en">' + card.nameEn + '</div></div>';
    cardWrapper.appendChild(header);
    var btnGroup = document.createElement('div');
    btnGroup.className = 'classify-btns';
    ['pure_like', 'others_expectation', 'capable_only'].forEach(function(type) {
      var label = type === 'pure_like' ? '純粹喜歡' : type === 'others_expectation' ? '他人期望' : '僅是有能力做';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'classify-btn' + (classification === type ? ' active-' + type : '');
      btn.setAttribute('data-category', type);
      btn.textContent = label;
      btn.setAttribute('aria-pressed', classification === type ? 'true' : 'false');
      btn.addEventListener('click', function() {
        appState.classifications[cardId] = type;
        saveToStorage(appState);
        renderStep2();
        updateStepTabs();
      });
      btnGroup.appendChild(btn);
    });
    cardWrapper.appendChild(btnGroup);
    container.appendChild(cardWrapper);
  });
  document.getElementById('s2-pure-count').textContent = '純粹喜歡：' + pure;
  document.getElementById('s2-others-count').textContent = '他人期望：' + others;
  document.getElementById('s2-capable-count').textContent = '僅是有能力做：' + capable;
  updateStepTabs();
}

function renderStep3() {
  var container = document.getElementById('step3-cards');
  container.innerHTML = '';
  var pureLikeIds = Array.from(appState.selectedCards).filter(function(id) {
    return appState.classifications[id] === 'pure_like';
  });
  if (!pureLikeIds.length) {
    container.innerHTML = '<p class="no-cards-msg">目前沒有被分類為「純粹喜歡」的職業卡，請先完成 Step 2。</p>';
    return;
  }
  pureLikeIds.forEach(function(cardId) {
    var card = CAREER_CARDS.find(function(item) { return item.id === cardId; });
    if (!card) return;
    var values = appState.reasons[cardId] || { reason: '', enjoyment: '', achievement: '' };
    var wrapper = document.createElement('div');
    wrapper.className = 'reason-card';
    wrapper.dataset.cardId = cardId;
    wrapper.innerHTML = '<div class="reason-card-header"><div class="reason-card-name">' + card.nameZh + '</div><div class="card-name-en">' + card.nameEn + '</div></div>';
    var fields = document.createElement('div');
    fields.className = 'reason-fields';
    ['reason', 'enjoyment', 'achievement'].forEach(function(field) {
      var labelText = field === 'reason' ? '喜歡的原因' : field === 'enjoyment' ? '享受的理由' : '成就感描述';
      var group = document.createElement('div');
      group.className = 'field-group';
      group.innerHTML = '<label class="field-label" for="' + cardId + '-' + field + '">' + labelText + '</label>' +
        '<textarea id="' + cardId + '-' + field + '" class="field-textarea" maxlength="500"></textarea>';
      var textarea = group.querySelector('textarea');
      textarea.value = values[field] || '';
      textarea.addEventListener('input', function(evt) {
        var trimmed = evt.target.value.slice(0, 500);
        if (evt.target.value !== trimmed) evt.target.value = trimmed;
        appState.reasons[cardId] = appState.reasons[cardId] || { reason: '', enjoyment: '', achievement: '' };
        appState.reasons[cardId][field] = trimmed;
        scheduleSave('reason-' + cardId + '-' + field, function() { saveToStorage(appState); }, 1000);
      });
      fields.appendChild(group);
    });
    wrapper.appendChild(fields);
    container.appendChild(wrapper);
  });
  updateStepTabs();
}

function renderStep4() {
  var container = document.getElementById('step4-content');
  container.innerHTML = '';
  var others = Array.from(appState.selectedCards).filter(function(id) { return appState.classifications[id] === 'others_expectation'; });
  var capable = Array.from(appState.selectedCards).filter(function(id) { return appState.classifications[id] === 'capable_only'; });
  if (!others.length && !capable.length) {
    container.innerHTML = '<div class="both-empty-msg">此步驟目前無需填寫，可直接點擊「下一步」。</div>';
    return;
  }
  if (others.length) {
    var section = document.createElement('div');
    section.className = 'insight-section';
    section.innerHTML = '<div class="insight-section-title">他人期望</div>';
    others.forEach(function(cardId) {
      var card = CAREER_CARDS.find(function(item) { return item.id === cardId; });
      if (!card) return;
      var values = appState.insights[cardId] || '';
      var cardEl = document.createElement('div');
      cardEl.className = 'reason-card';
      cardEl.dataset.cardId = cardId;
      cardEl.innerHTML = '<div class="reason-card-header"><div class="reason-card-name">' + card.nameZh + '</div><div class="card-name-en">' + card.nameEn + '</div></div>';
      var group = document.createElement('div');
      group.className = 'field-group';
      group.innerHTML = '<label class="field-label" for="insight-' + cardId + '">你的洞察</label>' +
        '<textarea id="insight-' + cardId + '" class="field-textarea" maxlength="500"></textarea>';
      var textarea = group.querySelector('textarea');
      textarea.value = values;
      textarea.addEventListener('input', function(evt) {
        var trimmed = evt.target.value.slice(0, 500);
        if (evt.target.value !== trimmed) evt.target.value = trimmed;
        appState.insights[cardId] = trimmed;
        scheduleSave('insight-' + cardId, function() { saveToStorage(appState); }, 1000);
      });
      cardEl.appendChild(group);
      section.appendChild(cardEl);
    });
    container.appendChild(section);
  } else {
    container.innerHTML += '<div class="no-cards-msg">此類別無職業卡</div>';
  }
  if (capable.length) {
    var section2 = document.createElement('div');
    section2.className = 'insight-section';
    section2.innerHTML = '<div class="insight-section-title">僅是有能力做</div>';
    capable.forEach(function(cardId) {
      var card = CAREER_CARDS.find(function(item) { return item.id === cardId; });
      if (!card) return;
      var values = appState.insights[cardId] || '';
      var cardEl = document.createElement('div');
      cardEl.className = 'reason-card';
      cardEl.dataset.cardId = cardId;
      cardEl.innerHTML = '<div class="reason-card-header"><div class="reason-card-name">' + card.nameZh + '</div><div class="card-name-en">' + card.nameEn + '</div></div>';
      var group = document.createElement('div');
      group.className = 'field-group';
      group.innerHTML = '<label class="field-label" for="insight-' + cardId + '">你的洞察</label>' +
        '<textarea id="insight-' + cardId + '" class="field-textarea" maxlength="500"></textarea>';
      var textarea = group.querySelector('textarea');
      textarea.value = values;
      textarea.addEventListener('input', function(evt) {
        var trimmed = evt.target.value.slice(0, 500);
        if (evt.target.value !== trimmed) evt.target.value = trimmed;
        appState.insights[cardId] = trimmed;
        scheduleSave('insight-' + cardId, function() { saveToStorage(appState); }, 1000);
      });
      cardEl.appendChild(group);
      section2.appendChild(cardEl);
    });
    container.appendChild(section2);
  } else {
    container.innerHTML += '<div class="no-cards-msg">此類別無職業卡</div>';
  }
  updateStepTabs();
}

function renderStep5() {
  var container = document.getElementById('step5-content');
  container.innerHTML = '';
  var pureLikeCards = Array.from(appState.selectedCards)
    .filter(function(id) { return appState.classifications[id] === 'pure_like'; })
    .map(function(id) { return CAREER_CARDS.find(function(card) { return card.id === id; }); })
    .filter(Boolean);

  if (!pureLikeCards.length) {
    container.innerHTML = '<p class="no-cards-msg">目前沒有純粹喜歡的職業卡，請返回 Step 2 完成分類。</p>';
    updateStepTabs();
    return;
  }

  var frequency = computeHollandFrequency(pureLikeCards);
  var ranked = rankHollandTypes(frequency);
  var topCount = ranked[0].count;
  var topCodes = ranked.filter(function(item) { return item.count === topCount && topCount > 0; }).map(function(item) { return item.code; });

  var chart = document.createElement('div');
  chart.className = 'stats-bar-chart';
  ranked.forEach(function(item) {
    var row = document.createElement('div');
    row.className = 'bar-row';
    var pct = topCount > 0 ? Math.round(item.count / topCount * 100) : 0;
    row.innerHTML = '<div class="bar-label">' + item.label + '</div>' +
      '<div class="bar-track"><div class="bar-fill" style="width:' + pct + '%; background:' + (HOLLAND_COLORS[item.code]?.bg || '#eee') + ';"></div></div>' +
      '<div class="bar-count">' + item.count + '</div>';
    chart.appendChild(row);
  });
  container.appendChild(chart);

  var rankingGrid = document.createElement('div');
  rankingGrid.className = 'ranking-cards';
  ranked.forEach(function(item) {
    var cardEl = document.createElement('div');
    cardEl.className = 'ranking-card' + (topCodes.includes(item.code) ? ' top-type' : '');
    cardEl.innerHTML = '<div class="ranking-rank">第 ' + item.rank + ' 名</div>' +
      '<div class="ranking-code">' + item.code + '</div>' +
      '<div class="ranking-label">' + item.label + '</div>' +
      '<div class="ranking-count">' + item.count + ' 次</div>';
    if (topCodes.includes(item.code)) {
      var badge = document.createElement('div');
      badge.className = 'top-type-badge';
      badge.textContent = '主要熱情傾向';
      cardEl.appendChild(badge);
    }
    rankingGrid.appendChild(cardEl);
  });
  container.appendChild(rankingGrid);
  updateStepTabs();
}

function renderStep6() {
  var container = document.getElementById('step6-content');
  container.innerHTML = '';
  var pureLikeCards = Array.from(appState.selectedCards)
    .filter(function(id) { return appState.classifications[id] === 'pure_like'; })
    .map(function(id) { return CAREER_CARDS.find(function(card) { return card.id === id; }); })
    .filter(Boolean);
  var frequency = computeHollandFrequency(pureLikeCards);
  var ranked = rankHollandTypes(frequency);
  var primaryType = ranked[0] && ranked[0].count > 0 ? ranked[0].label : '你的主要熱情傾向';
  var questions = personalizeReflections(REFLECTION_QUESTIONS, primaryType);
  questions.forEach(function(question, index) {
    var wrapper = document.createElement('div');
    wrapper.className = 'reflection-item';
    var qNum = document.createElement('div');
    qNum.className = 'reflection-q-num';
    qNum.textContent = '問題 ' + (index + 1);
    var qText = document.createElement('div');
    qText.className = 'reflection-q-text';
    qText.textContent = question;
    var field = document.createElement('div');
    field.className = 'field-group';
    field.innerHTML = '<label class="field-label" for="reflection-' + index + '">你的回答</label>' +
      '<textarea id="reflection-' + index + '" class="field-textarea" maxlength="1000"></textarea>';
    var textarea = field.querySelector('textarea');
    textarea.value = appState.reflections[index] || '';
    textarea.addEventListener('input', function(evt) {
      var trimmed = evt.target.value.slice(0, 1000);
      if (evt.target.value !== trimmed) evt.target.value = trimmed;
      appState.reflections[index] = trimmed;
      scheduleSave('reflection-' + index, function() { saveToStorage(appState); }, 1000);
    });
    wrapper.appendChild(qNum);
    wrapper.appendChild(qText);
    if (index === 0 && pureLikeCards.length > 0) {
      var hint = document.createElement('div');
      hint.className = 'reflection-pure-hint';
      hint.innerHTML = '<span class="reflection-hint-label">你的「純粹喜歡」：</span>' +
        pureLikeCards.map(function(c) {
          return '<span class="reflection-hint-tag">' + c.nameZh + '</span>';
        }).join('');
      wrapper.appendChild(hint);
    }
    wrapper.appendChild(field);
    container.appendChild(wrapper);
  });
  updateStepTabs();
}

function renderReport() {
  var container = document.getElementById('report-content');
  container.innerHTML = '';
  var pureLikeCards = Array.from(appState.selectedCards)
    .filter(function(id) { return appState.classifications[id] === 'pure_like'; })
    .map(function(id) { return CAREER_CARDS.find(function(card) { return card.id === id; }); })
    .filter(Boolean);
  var others = Array.from(appState.selectedCards).filter(function(id) { return appState.classifications[id] === 'others_expectation'; });
  var capable = Array.from(appState.selectedCards).filter(function(id) { return appState.classifications[id] === 'capable_only'; });

  var statsSection = document.createElement('div');
  statsSection.className = 'report-section';
  statsSection.innerHTML = '<div class="report-section-title">六大類統計與排序</div>';
  var frequency = computeHollandFrequency(pureLikeCards);
  var ranked = rankHollandTypes(frequency);
  ranked.forEach(function(item) {
    var row = document.createElement('div');
    row.className = 'report-field';
    row.innerHTML = '<div class="report-field-label">' + item.label + '</div><div class="report-field-value">' + item.count + ' 次</div>';
    statsSection.appendChild(row);
  });
  container.appendChild(statsSection);

  var pureSection = document.createElement('div');
  pureSection.className = 'report-section';
  pureSection.innerHTML = '<div class="report-section-title">純粹喜歡的職業與原因</div>';
  if (!pureLikeCards.length) {
    pureSection.innerHTML += '<div class="empty-section-msg">尚無純粹喜歡的職業卡。</div>';
  } else {
    pureLikeCards.forEach(function(card) {
      var item = document.createElement('div');
      item.className = 'report-card-item';
      var values = appState.reasons[card.id] || {};
      item.innerHTML = '<div class="report-card-name">' + card.nameZh + ' / ' + card.nameEn + '</div>' +
        '<div class="report-field"><div class="report-field-label">喜歡的原因</div><div class="report-field-value">' + (values.reason || '<span class="report-field-empty">未填寫</span>') + '</div></div>' +
        '<div class="report-field"><div class="report-field-label">享受的理由</div><div class="report-field-value">' + (values.enjoyment || '<span class="report-field-empty">未填寫</span>') + '</div></div>' +
        '<div class="report-field"><div class="report-field-label">成就感描述</div><div class="report-field-value">' + (values.achievement || '<span class="report-field-empty">未填寫</span>') + '</div></div>';
      pureSection.appendChild(item);
    });
  }
  container.appendChild(pureSection);

  var insightSection = document.createElement('div');
  insightSection.className = 'report-section';
  insightSection.innerHTML = '<div class="report-section-title">他人期望與能力導向洞察</div>';
  if (!others.length && !capable.length) {
    insightSection.innerHTML += '<div class="empty-section-msg">此步驟無需填寫。</div>';
  } else {
    if (others.length) {
      insightSection.innerHTML += '<div class="report-field-label">他人期望</div>';
      others.forEach(function(cardId) {
        var card = CAREER_CARDS.find(function(item) { return item.id === cardId; });
        if (!card) return;
        var text = appState.insights[cardId] || '<span class="report-field-empty">未填寫</span>';
        var item = document.createElement('div');
        item.className = 'report-card-item';
        item.innerHTML = '<div class="report-card-name">' + card.nameZh + '</div>' +
          '<div class="report-field"><div class="report-field-value">' + text + '</div></div>';
        insightSection.appendChild(item);
      });
    }
    if (capable.length) {
      insightSection.innerHTML += '<div class="report-field-label">僅是有能力做</div>';
      capable.forEach(function(cardId) {
        var card = CAREER_CARDS.find(function(item) { return item.id === cardId; });
        if (!card) return;
        var text = appState.insights[cardId] || '<span class="report-field-empty">未填寫</span>';
        var item = document.createElement('div');
        item.className = 'report-card-item';
        item.innerHTML = '<div class="report-card-name">' + card.nameZh + '</div>' +
          '<div class="report-field"><div class="report-field-value">' + text + '</div></div>';
        insightSection.appendChild(item);
      });
    }
  }
  container.appendChild(insightSection);

  var reflectionSection = document.createElement('div');
  reflectionSection.className = 'report-section';
  reflectionSection.innerHTML = '<div class="report-section-title">反思問題與回答</div>';
  var pureLikeForRef = pureLikeCards;
  var rankForRef = rankHollandTypes(computeHollandFrequency(pureLikeForRef));
  var primaryType = rankForRef[0] && rankForRef[0].count > 0 ? rankForRef[0].label : '你的主要熱情傾向';
  var questions = personalizeReflections(REFLECTION_QUESTIONS, primaryType);
  questions.forEach(function(question, index) {
    var answer = appState.reflections[index] || '<span class="report-field-empty">未填寫</span>';
    var item = document.createElement('div');
    item.className = 'report-card-item';
    item.innerHTML = '<div class="report-field-label">' + question + '</div>' +
      '<div class="report-field-value">' + answer + '</div>';
    reflectionSection.appendChild(item);
  });
  container.appendChild(reflectionSection);

  var reportRestart = document.getElementById('btn-report-restart');
  if (reportRestart) {
    reportRestart.addEventListener('click', function() {
      if (confirm('確定要重新開始嗎？目前的探索進度將會清除。')) {
        localStorage.removeItem('career_card_data');
        location.reload();
      }
    });
  }
}

  // UI
  function showStep(step) {
    document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); });
    var screenId = step === 0 ? 'screen-welcome' : step === 7 ? 'screen-report' : 'screen-step' + step;
    var screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
    var pb = document.getElementById('progress-bar');
    if (step >= 1 && step <= 6) pb.classList.add('visible'); else pb.classList.remove('visible');
    var nav = document.getElementById('sticky-nav');
    if (step >= 1 && step <= 6) nav.classList.add('visible'); else nav.classList.remove('visible');
    document.querySelectorAll('.step-tab').forEach(function(tab) { tab.classList.toggle('active', parseInt(tab.dataset.step) === step); });
    appState.currentStep = step;
    // Render step content
    if (step === 1) renderStep1();
    else if (step === 2) renderStep2();
    else if (step === 3) renderStep3();
    else if (step === 4) renderStep4();
    else if (step === 5) renderStep5();
    else if (step === 6) renderStep6();
    else if (step === 7) renderReport();
    // Update nav button labels
    var btnNext = document.getElementById('btn-next');
    if (btnNext) btnNext.textContent = step === 6 ? '完成 →' : '下一步 →';
    // Scroll to top
    window.scrollTo(0, 0);
  }
  function showToast(msg, duration) {
    duration = duration || 3000;
    var toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function() { toast.classList.remove('show'); }, duration);
  }
  function updateSaveIndicator() {
    var el = document.getElementById('save-indicator');
    if (!el) return;
    var now = new Date();
    var hh = String(now.getHours()).padStart(2, '0');
    var mm = String(now.getMinutes()).padStart(2, '0');
    el.textContent = '已儲存 ' + hh + ':' + mm;
    el.classList.add('visible');
  }
  function closeInfoModal() {
    document.getElementById('info-modal-backdrop').classList.remove('open');
  }
  function goToPrevStep() {
    if (appState.currentStep > 1) showStep(appState.currentStep - 1);
  }
  function goToNextStep() {
    var step = appState.currentStep;
    if (step === 1) {
      if (appState.selectedCards.size < 10) {
        showToast('請至少選取 10 張職業卡才能繼續（目前已選 ' + appState.selectedCards.size + ' 張）');
        return;
      }
    } else if (step === 2) {
      var result = validateStep2(appState);
      if (!result.valid) {
        // Highlight unclassified cards
        document.querySelectorAll('.classify-card').forEach(function(el) {
          var cardId = el.dataset.cardId;
          if (!appState.classifications[cardId]) {
            el.classList.add('unclassified-error');
          } else {
            el.classList.remove('unclassified-error');
          }
        });
        showToast(result.errors[0], 4000);
        return;
      }
    } else if (step === 3) {
      // Check if any pure_like card has all 3 fields empty
      var pureLikeIds = Array.from(appState.selectedCards).filter(function(id) {
        return appState.classifications[id] === 'pure_like';
      });
      var hasEmpty = pureLikeIds.some(function(id) {
        var r = appState.reasons[id] || {};
        return !r.reason && !r.enjoyment && !r.achievement;
      });
      if (hasEmpty) {
        // Highlight empty cards
        document.querySelectorAll('.reason-card').forEach(function(el) {
          var cardId = el.dataset.cardId;
          var r = appState.reasons[cardId] || {};
          if (!r.reason && !r.enjoyment && !r.achievement) {
            el.classList.add('empty-warning');
          }
        });
        if (!confirm('部分欄位尚未填寫，確定要繼續嗎？')) return;
      }
    }
    if (step < 7) showStep(step + 1);
  }
  function initApp() {
    var saved = loadFromStorage();
    if (saved) {
      appState.currentStep = saved.currentStep || 0;
      appState.selectedCards = saved.selectedCards;
      appState.classifications = saved.classifications || {};
      appState.reasons = saved.reasons || {};
      appState.insights = saved.insights || {};
      appState.reflections = saved.reflections || {};
      document.getElementById('resume-section').style.display = 'block';
      document.getElementById('default-actions').style.display = 'none';
      if (saved.lastSaved) {
        var d = new Date(saved.lastSaved);
        var hh = String(d.getHours()).padStart(2, '0');
        var mm = String(d.getMinutes()).padStart(2, '0');
        var el = document.getElementById('save-indicator');
        if (el) { el.textContent = '已儲存 ' + hh + ':' + mm; el.classList.add('visible'); }
      }
    }
  }
  document.getElementById('btn-start-new').addEventListener('click', function() {
    if (appState.selectedCards.size > 0) {
      if (!confirm('確定要開始新的探索嗎？目前的探索進度將會清除。')) return;
      localStorage.removeItem('career_card_data');
      // 重置 appState
      appState.currentStep = 0;
      appState.selectedCards = new Set();
      appState.classifications = {};
      appState.reasons = {};
      appState.insights = {};
      appState.reflections = {};
      appState.lastSaved = null;
    }
    showStep(1);
  });
  document.getElementById('btn-import-json').addEventListener('click', function() { document.getElementById('file-input').click(); });
  var btnImportResume = document.getElementById('btn-import-json-resume');
  if (btnImportResume) btnImportResume.addEventListener('click', function() { document.getElementById('file-input').click(); });
  document.getElementById('btn-resume').addEventListener('click', function() { showStep(appState.currentStep > 0 ? appState.currentStep : 1); });
  document.getElementById('btn-restart').addEventListener('click', function() {
    if (confirm('確定要重新開始嗎？目前的探索進度將會清除。')) {
      localStorage.removeItem('career_card_data');
      location.reload();
    }
  });
  document.querySelectorAll('.step-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      var step = parseInt(tab.dataset.step, 10);
      if (Number.isNaN(step)) return;
      // 從 step 1 跳往後面的步驟時，驗證已選張數
      if (appState.currentStep === 1 && step > 1) {
        if (appState.selectedCards.size < 10) {
          showToast('請至少選取 10 張職業卡才能繼續（目前已選 ' + appState.selectedCards.size + ' 張）');
          return;
        }
      }
      // 從 step 2 跳往後面的步驟時，執行 step 2 驗證
      if (appState.currentStep === 2 && step > 2) {
        var result = validateStep2(appState);
        if (!result.valid) {
          showToast(result.errors[0], 4000);
          return;
        }
      }
      showStep(step);
    });
  });
  document.getElementById('info-modal-backdrop').addEventListener('click', function(evt) {
    if (evt.target === this) {
      closeInfoModal();
    }
  });
  document.addEventListener('keydown', function(evt) {
    if (evt.key === 'Escape') closeInfoModal();
  });
  document.getElementById('file-input').addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(evt) {
      try {
        var data = JSON.parse(evt.target.result);
        if (!validateImportedData(data)) { showToast('格式不符，請確認檔案為本工具匯出的 JSON'); return; }
        localStorage.setItem('career_card_data', JSON.stringify(data));
        location.reload();
      } catch (err) { showToast('檔案讀取失敗，請重試'); }
    };
    reader.onerror = function() { showToast('檔案讀取失敗，請重試'); };
    reader.readAsText(file, 'utf-8');
    e.target.value = '';
  });
  initApp();
