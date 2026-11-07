
/* ── i18n ── */
const i18n = {
  zh: {
    pageTitle: '店家網站 Prompt 產生器 · Saori',
    heroTitle: '店家一頁式網站 Prompt 產生器',
    heroDesc: '填入店家資訊，自動生成可交給 AI 設計網站的完整 Prompt',
    sec1Title: '關於這家店',
    sec2Title: '商品與客群',
    sec3Title: '信任感建立',
    sec4Title: '到店資訊',
    sec5Title: '設計偏好',
    labelShopName: '店名 <span class="req">必填</span>',
    labelShopType: '店家類型 <span class="req">必填</span>',
    labelShopPositioning: '一句定位 <span class="req">必填</span>',
    labelShopIntro: '品牌／店家簡介（2–3 句話）<span class="req">必填</span>',
    labelShopArea: '所在城市／區域 <span class="req">必填</span>',
    labelTargetCustomers: '主要客群 <span class="req">必填</span>',
    labelSignatureItems: '招牌品項／熱門服務 <span class="req">必填</span>',
    orLabel: '以下二擇一必填',
    labelCustomerNeed: '顧客會來找這家店的原因',
    labelMainProducts: '主要商品／服務',
    labelShopFeature: '店家特色 ／ 差異',
    labelCustomerExperience: '顧客來店能獲得',
    labelAtmosphereKeywords: '空間／品牌氛圍關鍵字 <span class="req">必填</span>',
    labelConsumptionType: '消費方式 <span class="req">必填</span>',
    labelPriceRange: '價位帶',
    labelBrandStory: '品牌故事／創店理念',
    labelReviews: '顧客評價 ／ 心得分享',
    labelMediaMention: '媒體報導 ／ 合作經歷',
    labelFaq: '常見問題',
    labelAddress: '地址 <span class="req">必填</span>',
    labelBusinessHours: '營業時間 <span class="req">必填</span>',
    labelClosedDays: '公休日',
    labelTransportation: '交通方式',
    labelBookingMethod: '預約 ／ 訂位方式 <span class="req">必填</span>',
    labelOtherContact: '其他聯絡方式 <span class="req">必填</span>',
    labelEmail: 'Email',
    labelMapLink: 'Google Maps 連結',
    labelSocialLinks: '社群連結',
    labelWebsiteGoal: '網站主要目標 <span class="req">必填</span>',
    labelReferenceSites: '參考網站／品牌',
    btnGen: '產生 Prompt',
    btnCopy: '複製',
    pasteHint: '複製後貼到 AI ↗',
    footerRole: '軟體工程師・系統分析師・生涯諮詢師',
    toast: '✓ 已複製至剪貼簿',
    phShopName: '例：山田珈琲',
    phShopType: '例：咖啡店、甜點店、美甲工作室、花店',
    phShopPositioning: '例：巷弄裡適合安靜坐一下午的手沖咖啡店',
    phShopIntro: '例：我們是一間以自家烘豆與季節甜點為主的小店，希望讓來店的人在城市裡找到放鬆片刻。',
    phShopArea: '例：台北市大安區',
    phTargetCustomers: '例：附近上班族、喜歡安靜空間的咖啡愛好者',
    phSignatureItems: '例：拿鐵、布丁、焙茶巴斯克；日系裸色凝膠、足部保養',
    phCustomerNeed: '例：想找好喝咖啡與舒適空間、想做自然耐看的日系美甲',
    phMainProducts: '例：手沖咖啡、巴斯克乳酪蛋糕、預約制凝膠美甲',
    phShopFeature: '例：木質安靜空間、甜點每日限量、主打自然裸透感設計',
    phCustomerExperience: '例：放鬆不趕時間的用餐體驗、安心溝通並完成適合自己的款式',
    phAtmosphereKeywords: '例：溫暖、木質、日系、安靜、職人感',
    phConsumptionType: '例：內用／外帶／預約制／現場候位／可外送',
    phPriceRange: '例：每人低消 180 元；美甲單次約 1200–2200 元',
    phBrandStory: '例：希望在快節奏的城市裡，提供一個讓人慢下來喝杯咖啡的地方。',
    phReviews: '如尚無評價，填「暫無」即可，AI 將提示位置留空',
    phMediaMention: '例：曾被在地咖啡地圖推薦；如無可填「暫無」',
    phFaq: '例：是否可訂位、是否有低消、是否可帶寵物、是否接受刷卡',
    phAddress: '例：台北市大安區 xx 路 xx 號',
    phBusinessHours: '例：週二至週日 12:00–19:00',
    phClosedDays: '例：每週一',
    phTransportation: '例：捷運大安站步行 5 分鐘，附近有收費停車場',
    phBookingMethod: '例：請私訊 Instagram／LINE 預約；可電話訂位',
    phOtherContact: '例：LINE ID、Instagram、電話',
    phMapLink: '例：https://maps.app.goo.gl/xxxx',
    phSocialLinks: '例：Instagram、Facebook、LINE 官方帳號',
    phCustomColor: '例：奶油白、深木色、抹茶綠',
    phWebsiteGoal: '例：吸引來店、提升訂位、展示菜單、建立品牌感',
    phReferenceSites: '例：想參考 Blue Bottle、% Arabica、某間日系美甲店 IG',
    errRequired: '這幾個欄位不能缺席喔：店名、店家類型、一句定位、品牌簡介、所在區域，請先填寫 ✨',
    errRequired2: '還缺幾個必填：主要客群、招牌品項、氛圍關鍵字、消費方式、地址、營業時間、預約方式、聯絡方式、網站目標 ✨',
    errNeedOrProduct: '至少告訴我一件事：顧客來的原因 或 主要商品，二選一即可 😎',
    errFeatureOrGain: '還差一點點！請填「店家特色」或「顧客來店能獲得」其中一項，我比較好發揮 🚀',
    smartFallback: '（請反問我問題協助我釐清之後再開始生成網頁）',
    promptHeader: '你是一位專業的網頁設計師。請遵循網頁 UX 原則幫我設計一個實體店家的一頁式品牌網站，輸出完整 HTML 檔案。',
    promptShopSection: '【關於這家店】',
    promptProductSection: '【商品與客群】',
    promptTrustSection: '【信任感建立】',
    promptVisitSection: '【到店資訊】',
    promptDesign: '【設計要求】',
    promptFooter: '請輸出一個完整的單一 HTML 檔案，CSS 和 JavaScript 都嵌入在同一個檔案內。\n頁面要能在手機上正常顯示（RWD）。',
    styleDefault: '溫暖、有質感、值得信賴',
    colorDefault: '（不指定，請依風格自行搭配）',
    fontDefault: 'Noto Sans TC',
    fontNote: '，請使用 Google Fonts，標題用粗體',
    layoutNote: '- 版面：包含以下區塊：Hero、About、Menu/Service、Social Proof、Visit Info、Contact',
    phCustomStyle: '例：日系喫茶店感、像選物店一樣乾淨安靜、手繪感溫柔……',
    snippetGroupLabel: '快速指令範本',
    btnCopySnippet: '複製這段範本',
    snippetStyleBtn: '調整視覺風格',
    snippetTextBtn: '修改文字內容',
    snippetPhotoBtn: '加入照片',
    snippetStyleContent: `請修改這個網站設計，調整以下部分：

1. 主色調改為 [填入顏色描述，例如：深棕色 #3e2a1a]
2. Hero 區塊的背景改為 [純色／漸層／圖片]
3. 字型改為更 [現代／溫暖／正式] 的風格
4. 按鈕樣式改為 [圓角／方形／有陰影]

其他內容維持不變，請輸出完整的修改後 HTML 檔案。`,
    snippetTextContent: `請修改 HTML 中的以下內容，其他都不要動：

- Hero 標題改為：[填入]
- About 區塊第一段改為：[填入]
- 菜單/服務項目一改為：[填入]

請輸出修改後的完整 HTML 檔案。`,
    snippetPhotoContent: `請在 Hero 區塊加入店家照片。
https://xxx.github.io/ooo/zzz.webp
請把照片作為 Hero 背景或放在文字右側，在手機版時照片移到文字下方。
其他內容不變，請輸出完整修改後的 HTML 檔案。`,
  },
  en: {
    pageTitle: 'Shop Website Prompt Generator · Saori',
    heroTitle: 'One-Page Shop Website Prompt Generator',
    heroDesc: 'Fill in your shop details and instantly generate a complete AI prompt for your website design.',
    sec1Title: 'About the Shop',
    sec2Title: 'Products & Customers',
    sec3Title: 'Social Proof',
    sec4Title: 'Visit Info',
    sec5Title: 'Design Preferences',
    labelShopName: 'Shop Name <span class="req">required</span>',
    labelShopType: 'Shop Type <span class="req">required</span>',
    labelShopPositioning: 'One-line Positioning <span class="req">required</span>',
    labelShopIntro: 'Brand / Shop Description (2–3 sentences) <span class="req">required</span>',
    labelShopArea: 'City / Area <span class="req">required</span>',
    labelTargetCustomers: 'Target Customers <span class="req">required</span>',
    labelSignatureItems: 'Signature Items / Popular Services <span class="req">required</span>',
    orLabel: 'Fill in one of the following',
    labelCustomerNeed: 'Why Customers Come',
    labelMainProducts: 'Main Products / Services',
    labelShopFeature: 'Shop Specialty / Differentiator',
    labelCustomerExperience: 'What Customers Get',
    labelAtmosphereKeywords: 'Atmosphere / Brand Keywords <span class="req">required</span>',
    labelConsumptionType: 'Service Type <span class="req">required</span>',
    labelPriceRange: 'Price Range',
    labelBrandStory: 'Brand Story / Founding Story',
    labelReviews: 'Customer Reviews / Testimonials',
    labelMediaMention: 'Press / Collaborations',
    labelFaq: 'FAQ',
    labelAddress: 'Address <span class="req">required</span>',
    labelBusinessHours: 'Business Hours <span class="req">required</span>',
    labelClosedDays: 'Closed Days',
    labelTransportation: 'Getting There',
    labelBookingMethod: 'Reservation / Booking Method <span class="req">required</span>',
    labelOtherContact: 'Other Contact <span class="req">required</span>',
    labelEmail: 'Email',
    labelMapLink: 'Google Maps Link',
    labelSocialLinks: 'Social Media Links',
    labelWebsiteGoal: 'Website Goal <span class="req">required</span>',
    labelReferenceSites: 'Reference Websites / Brands',
    btnGen: 'Generate Prompt',
    btnCopy: 'Copy',
    pasteHint: 'Paste into your AI tool ↗',
    footerRole: 'Software Engineer · Systems Analyst · Career Coach',
    toast: '✓ Copied to clipboard',
    phShopName: 'e.g. Blue Mountain Coffee',
    phShopType: 'e.g. Coffee shop, dessert shop, nail studio, flower shop',
    phShopPositioning: 'e.g. A quiet hand-drip coffee shop tucked in a side street',
    phShopIntro: 'e.g. We are a small shop focused on single-origin roasts and seasonal desserts, offering city dwellers a moment to slow down.',
    phShopArea: 'e.g. Da\'an District, Taipei',
    phTargetCustomers: 'e.g. Nearby office workers, coffee lovers who prefer quiet spaces',
    phSignatureItems: 'e.g. Latte, pudding, matcha basque cake; natural gel nails, foot care',
    phCustomerNeed: 'e.g. Looking for good coffee and a relaxing space, or natural-looking Japanese-style nails',
    phMainProducts: 'e.g. Hand-drip coffee, basque cheesecake, appointment-based gel nails',
    phShopFeature: 'e.g. Wooden quiet interior, daily-limited desserts, natural nail aesthetics',
    phCustomerExperience: 'e.g. A relaxed dining experience without being rushed; leaving with a nail style that suits you',
    phAtmosphereKeywords: 'e.g. Warm, wooden, Japanese, quiet, artisanal',
    phConsumptionType: 'e.g. Dine-in / takeaway / by appointment / walk-in / delivery available',
    phPriceRange: 'e.g. Minimum spend NT$180 per person; nails approx NT$1200–2200',
    phBrandStory: 'e.g. We wanted to create a place in the city where people can slow down and enjoy a cup of coffee.',
    phReviews: 'If none yet, type "None" — AI will leave a placeholder',
    phMediaMention: 'e.g. Featured in a local coffee map; collaborated with a local brand. Type "None" if not applicable.',
    phFaq: 'e.g. Reservations available? Minimum spend? Pet-friendly? Card payments accepted?',
    phAddress: 'e.g. 123 Example Street, Da\'an District, Taipei',
    phBusinessHours: 'e.g. Tue–Sun 12:00–19:00',
    phClosedDays: 'e.g. Closed on Mondays',
    phTransportation: 'e.g. 5-min walk from Da\'an MRT Station; paid parking nearby',
    phBookingMethod: 'e.g. DM us on Instagram / LINE to book; phone reservations welcome',
    phOtherContact: 'e.g. LINE ID, Instagram, phone number',
    phMapLink: 'e.g. https://maps.app.goo.gl/xxxx',
    phSocialLinks: 'e.g. Instagram, Facebook, LINE Official Account',
    phCustomColor: 'e.g. Cream white, dark wood brown, matcha green',
    phWebsiteGoal: 'e.g. Drive foot traffic, increase reservations, showcase menu, build brand identity',
    phReferenceSites: 'e.g. Blue Bottle, % Arabica, a Japanese nail studio on Instagram',
    errRequired: 'Please fill in the required fields: Shop Name, Type, Positioning, Description, and Area ✨',
    errRequired2: 'A few more required fields: Target Customers, Signature Items, Atmosphere Keywords, Service Type, Address, Hours, Booking Method, Contact, and Website Goal ✨',
    errNeedOrProduct: 'Please fill in at least one: Why Customers Come or Main Products/Services 😎',
    errFeatureOrGain: 'Almost there! Fill in either "Shop Specialty" or "What Customers Get" 🚀',
    smartFallback: '(Please ask me clarifying questions before generating the page)',
    promptHeader: 'You are a professional web designer. Please follow web UX principles and create a complete one-page brand website for a physical shop as a full HTML file.',
    promptShopSection: '[About the Shop]',
    promptProductSection: '[Products & Customers]',
    promptTrustSection: '[Social Proof]',
    promptVisitSection: '[Visit Info]',
    promptDesign: '[Design Requirements]',
    promptFooter: 'Output a complete single HTML file with all CSS and JavaScript embedded.\nThe page must be fully responsive (mobile-friendly).',
    styleDefault: 'warm, quality-driven, trustworthy',
    colorDefault: '(No preference — let AI decide based on style)',
    fontDefault: 'Inter',
    fontNote: ', loaded from Google Fonts; use bold for headings',
    layoutNote: '- Layout: include these sections: Hero, About, Menu/Service, Social Proof, Visit Info, Contact',
    phCustomStyle: 'e.g. Japanese kissaten feel, clean like a concept store, soft hand-drawn aesthetic…',
    snippetGroupLabel: 'Quick Template Prompts',
    btnCopySnippet: 'Copy this template',
    snippetStyleBtn: 'Adjust Visual Style',
    snippetTextBtn: 'Edit Text Content',
    snippetPhotoBtn: 'Add a Photo',
    snippetStyleContent: `Please update the website design with the following changes:

1. Change the primary color to [e.g., warm brown #3e2a1a]
2. Change the Hero section background to [solid color / gradient / image]
3. Update the typography to a more [modern / warm / formal] style
4. Change the button style to [rounded / square / with shadow]

Keep all other content unchanged. Please output the complete modified HTML file.`,
    snippetTextContent: `Please update the following text in the HTML — do not change anything else:

- Hero headline: [fill in]
- About section first paragraph: [fill in]
- Menu/Service item 1: [fill in]

Please output the complete modified HTML file.`,
    snippetPhotoContent: `Please add a shop photo to the Hero section.
https://xxx.github.io/ooo/zzz.webp
Use it as the Hero background or place it beside the text. On mobile, move the photo below the text.
Keep all other content unchanged. Please output the complete modified HTML file.`,
  }
};

let currentLang = localStorage.getItem('sppg_lang') || 'zh';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('sppg_lang', lang);
  document.getElementById('htmlRoot').lang = lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = i18n[lang].pageTitle;

  document.getElementById('btnZh').classList.toggle('active', lang === 'zh');
  document.getElementById('btnEn').classList.toggle('active', lang === 'en');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key] !== undefined) el.innerHTML = i18n[lang][key];
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (i18n[lang][key] !== undefined) el.placeholder = i18n[lang][key];
  });

  document.getElementById('toast').textContent = i18n[lang].toast;

  DesignPref.setLang(lang);

  PromptSheet.setLang(lang);
}

/* ── END i18n ── */

function vals(id) { return document.getElementById(id).value.trim(); }
function smart(id) { const v = vals(id); return v || i18n[currentLang].smartFallback; }

/* ── 必填檢查（按「複製 Prompt」時才跑） ── */
const SHOP_REQ1 = ['shopName', 'shopType', 'shopPositioning', 'shopIntro', 'shopArea'];
const SHOP_REQ2 = ['targetCustomers', 'signatureItems', 'atmosphereKeywords', 'consumptionType', 'address', 'businessHours', 'bookingMethod', 'otherContact', 'websiteGoal'];

function checkPrompt() {
  const L = i18n[currentLang];
  const empty1 = SHOP_REQ1.find(id => !vals(id));
  if (empty1) return { message: L.errRequired, focusId: empty1 };
  const empty2 = SHOP_REQ2.find(id => !vals(id));
  if (empty2) return { message: L.errRequired2, focusId: empty2 };
  if (!vals('customerNeed') && !vals('mainProducts')) return { message: L.errNeedOrProduct, focusId: 'customerNeed' };
  if (!vals('shopFeature') && !vals('customerExperience')) return { message: L.errFeatureOrGain, focusId: 'shopFeature' };
  const designErr = DesignPref.validate();
  if (designErr) return { message: designErr };
  return null;
}

function promptProgress() {
  const done = [...SHOP_REQ1, ...SHOP_REQ2].filter(id => vals(id)).length
    + ((vals('customerNeed') || vals('mainProducts')) ? 1 : 0)
    + ((vals('shopFeature') || vals('customerExperience')) ? 1 : 0);
  return { done, total: SHOP_REQ1.length + SHOP_REQ2.length + 2 };
}

function buildPrompt() {
  const L = i18n[currentLang];

  const getFontName = () => DesignPref.getFont();

  const getStyle = () => {
    const parts = DesignPref.getStyles();
    const sep = currentLang === 'zh' ? '、' : ', ';
    return (parts.join(sep) || (currentLang === 'zh' ? '溫暖' : 'Warm')) + sep + L.styleDefault;
  };

  const zh = currentLang === 'zh';

  const t =
`${L.promptHeader}

${L.promptShopSection}
- ${zh ? '店名' : 'Shop Name'}：${smart('shopName')}
- ${zh ? '店家類型' : 'Type'}：${smart('shopType')}
- ${zh ? '定位' : 'Positioning'}：${smart('shopPositioning')}
- ${zh ? '簡介' : 'Description'}：${smart('shopIntro')}
- ${zh ? '所在區域' : 'Area'}：${smart('shopArea')}

${L.promptProductSection}
- ${zh ? '主要客群' : 'Target Customers'}：${smart('targetCustomers')}
- ${zh ? '顧客來店的原因' : 'Why Customers Come'}：${smart('customerNeed')}
- ${zh ? '主要商品／服務' : 'Main Products / Services'}：${smart('mainProducts')}
- ${zh ? '招牌品項' : 'Signature Items'}：${smart('signatureItems')}
- ${zh ? '消費方式' : 'Service Type'}：${smart('consumptionType')}
${vals('priceRange') ? `- ${zh ? '價位帶' : 'Price Range'}：${vals('priceRange')}` : ''}
- ${zh ? '店家特色／差異' : 'Shop Specialty'}：${smart('shopFeature')}
- ${zh ? '顧客來店能獲得' : 'What Customers Get'}：${smart('customerExperience')}
- ${zh ? '空間氛圍關鍵字' : 'Atmosphere Keywords'}：${smart('atmosphereKeywords')}
${vals('brandStory') ? `- ${zh ? '品牌故事' : 'Brand Story'}：${vals('brandStory')}` : ''}

${L.promptTrustSection}
- ${zh ? '顧客評價' : 'Reviews'}：${smart('reviews')}
${vals('mediaMention') ? `- ${zh ? '媒體報導' : 'Press'}：${vals('mediaMention')}` : ''}
${vals('faq') ? `- ${zh ? '常見問題' : 'FAQ'}：${vals('faq')}` : ''}

${L.promptVisitSection}
- ${zh ? '地址' : 'Address'}：${smart('address')}
- ${zh ? '營業時間' : 'Business Hours'}：${smart('businessHours')}
${vals('closedDays') ? `- ${zh ? '公休日' : 'Closed Days'}：${vals('closedDays')}` : ''}
${vals('transportation') ? `- ${zh ? '交通' : 'Getting There'}：${vals('transportation')}` : ''}
- ${zh ? '預約方式' : 'Booking'}：${smart('bookingMethod')}
- ${zh ? '聯絡方式' : 'Contact'}：${smart('otherContact')}
${vals('email') ? `- Email：${vals('email')}` : ''}
${vals('mapLink') ? `- ${zh ? '地圖' : 'Map'}：${vals('mapLink')}` : ''}
${vals('socialLinks') ? `- ${zh ? '社群' : 'Social'}：${vals('socialLinks')}` : ''}

${L.promptDesign}
- ${zh ? '網站主要目標' : 'Website Goal'}：${smart('websiteGoal')}
- ${zh ? '風格' : 'Style'}：${getStyle()}
- ${zh ? '配色' : 'Color Palette'}：${DesignPref.getColor() || L.colorDefault}
- ${zh ? '字型' : 'Font'}：${getFontName() ? `${getFontName()}${L.fontNote}` : (zh ? '（不指定，請依風格自行搭配）' : '(No preference — let AI decide based on style)')}
${vals('referenceSites') ? `- ${zh ? '參考風格' : 'Reference'}：${vals('referenceSites')}` : ''}
${L.layoutNote}

${L.promptFooter}`;

  return t;
}

function setSnippet(type) {
  const key = 'snippet' + type.charAt(0).toUpperCase() + type.slice(1) + 'Content';
  const box = document.getElementById('snippetBox');
  const out = document.getElementById('snippetOut');
  out.value = i18n[currentLang][key];
  box.hidden = false;
  out.focus();
}

function copySnippet() {
  const out = document.getElementById('snippetOut');
  if (!out.value.trim()) return;
  navigator.clipboard.writeText(out.value).then(() => {
    const toast = document.getElementById('toast');
    toast.textContent = i18n[currentLang].toast;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  });
}

/* ── Persistence ── */
const FIELDS = ['shopName','shopType','shopPositioning','shopIntro','shopArea',
  'targetCustomers','signatureItems','customerNeed','mainProducts','shopFeature',
  'customerExperience','atmosphereKeywords','consumptionType','priceRange','brandStory',
  'reviews','mediaMention','faq',
  'address','businessHours','closedDays','transportation','bookingMethod',
  'otherContact','email','mapLink','socialLinks',
  'websiteGoal','referenceSites'];

function saveAll() {
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) localStorage.setItem('sppg_' + id, el.value);
  });
  localStorage.setItem('sppg_design', JSON.stringify(DesignPref.getState()));
}

function loadAll() {
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    const v = localStorage.getItem('sppg_' + id);
    if (el && v !== null) el.value = v;
  });
  try {
    const design = JSON.parse(localStorage.getItem('sppg_design') || 'null');
    if (design) DesignPref.setState(design);
  } catch (e) { /* 存檔格式不對就略過，用預設值 */ }
}

// 店家版的自訂欄位範例文字和 Page 版不同，用 text 覆蓋模組預設
DesignPref.init(document.getElementById('designPref'), {
  lang: currentLang,
  text: {
    zh: { phCustomStyle: i18n.zh.phCustomStyle, phCustomColor: i18n.zh.phCustomColor },
    en: { phCustomStyle: i18n.en.phCustomStyle, phCustomColor: i18n.en.phCustomColor },
  },
});
setLang(currentLang);
loadAll();

PromptSheet.init(document.getElementById('promptSheet'), {
  lang: currentLang,
  build: buildPrompt,
  check: checkPrompt,
  progress: promptProgress,
  emptyMarks: [i18n.zh.smartFallback, i18n.en.smartFallback],
});

document.querySelectorAll('input, textarea, select').forEach(el => {
  if (el.id === 'snippetOut') return;
  el.addEventListener('input', saveAll);
  el.addEventListener('change', saveAll);
});
