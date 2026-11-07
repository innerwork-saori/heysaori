
/* ── i18n ── */
const i18n = {
  zh: {
    pageTitle: '網站 Prompt 產生器 · Saori',
    heroTitle: '網站<br>Prompt 產生器',
    heroDesc: '填入你的品牌資訊，自動生成可交給 AI 設計網站的完整 Prompt',
    sec1Title: '關於你',
    sec2Title: '目標客戶與服務',
    sec3Title: '信任感建立',
    sec4Title: '聯絡方式',
    sec5Title: '設計偏好',
    labelName: '姓名 <span class="req">必填</span>',
    labelTitle: '職稱 ／ 定位 <span class="req">必填</span>',
    labelBg: '我的背景（2–3 句話）',
    labelClient: '目標客戶 <span class="req">必填</span>',
    orLabel: '以下二擇一必填',
    labelPain: '客戶痛點',
    labelService: '我提供的服務',
    labelMethod: '我的特色 ／ 方法',
    labelGain: '客戶能獲得',
    hintClient: '你最想幫助誰？寫出對方的身分或處境，越具體越好。',
    hintPain: '他們找上你之前，正在煩惱什麼、卡在哪裡？',
    hintService: '你實際能幫他們做什麼？列 1–3 項就好。',
    hintMethod: '你的做法跟別人哪裡不一樣？例如流程、風格或堅持。',
    hintGain: '跟你合作之後，客戶的工作或生活會有什麼改變？',
    labelTrust: '客戶推薦 ／ 心得分享',
    labelEmail: 'Email <span class="req">必填</span>',
    labelOther: '其他聯絡方式',
    labelLayout: '網站架構',
    hintLayout: '不確定就選「讓 AI 建議」。一頁式適合內容精簡、一路往下滑就看完；多頁式適合服務項目或內容比較多。',
    layoutOptSingle: '一頁式（所有內容放在同一頁）',
    layoutOptMulti: '多頁式（分成多個頁面）',
    layoutOptAi: '讓 AI 建議',
    btnGen: '產生 Prompt',
    btnCopy: '複製',
    pasteHint: '複製後貼到 AI ↗',
    footerRole: '軟體工程師・系統分析師・生涯諮詢師',
    toast: '✓ 已複製至剪貼簿',
    phName: '例：謝孟娟',
    phBg: '簡短介紹你的經歷、專長與信念……',
    phTrust: '如尚無推薦，填「暫無」即可，AI 將提示位置留空',
    phOther: '例：LINE ID、Instagram',
    errRequired: '這幾位主角不能缺席喔：姓名、Email、職稱、目標客戶，請先填寫 ✨',
    errPainService: '至少告訴我一件事：客戶痛點 或 你提供的服務，二選一即可 😎',
    errMethodGain: '還差一點點！請填「我的特色」或「客戶能獲得」其中一項，我比較好發揮 🚀',
    errTooEmpty: '欸呀～資訊太少啦！再多給我一些線索，我才能幫你變出厲害的網站內容喔',
    smartFallback: '（請反問我問題協助我釐清之後再開始生成網頁）',
    // 依「網站架構」選項組出 prompt 開頭、版面說明、輸出格式
    layoutPrompts: {
      single: {
        header: '你是一位專業的網頁設計師。請遵循網頁 UX 原則幫我設計一個一頁式個人品牌網站的完整 HTML 檔案，檔名為 index.html。請使用 frontend-design skill 來設計。',
        note: '- 版面：一頁式，包含以下六個區塊：Hero、About、Service、Process、Trust、Contact',
        footer: '請輸出一個完整的單一 HTML 檔案，CSS 和 JavaScript 都嵌入在同一個檔案內。\n頁面要能在手機上正常顯示（RWD）。',
      },
      multi: {
        header: '你是一位專業的網頁設計師。請遵循網頁 UX 原則幫我設計一個多頁式個人品牌網站，首頁檔名為 index.html。請使用 frontend-design skill 來設計。',
        note: '- 版面：多頁式。內容需涵蓋 Hero、About、Service、Process、Trust、Contact。開始寫程式前，請先依我提供的內容提出頁面規劃（有哪些頁面、每頁放哪些區塊、各自的檔名），等我確認後再產生檔案。每一頁都要有一致的導覽列與頁尾。',
        footer: '請把每一頁輸出成獨立的 HTML 檔案，所有頁面共用一個 style.css；如需 JavaScript，請放在共用的 script.js。\n頁面要能在手機上正常顯示（RWD）。',
      },
      ai: {
        header: '你是一位專業的網頁設計師。請遵循網頁 UX 原則幫我設計一個個人品牌網站，首頁檔名為 index.html。請使用 frontend-design skill 來設計。',
        note: '- 版面：請依我提供的內容量，建議採用一頁式或多頁式並說明理由（多頁式請一併列出頁面規劃與檔名），等我確認後再開始產生檔案。內容需涵蓋 Hero、About、Service、Process、Trust、Contact。',
        footer: '若採一頁式：請輸出一個完整的單一 HTML 檔案（index.html），CSS 和 JavaScript 都嵌入在同一個檔案內。\n若採多頁式：每一頁輸出成獨立的 HTML 檔案，所有頁面共用一個 style.css；如需 JavaScript，請放在共用的 script.js。\n頁面要能在手機上正常顯示（RWD）。',
      },
    },
    promptAbout: '【關於我】',
    promptAudience: '【目標客戶與服務】',
    promptBgSection: '【我的背景】',
    promptTrustSection: '【客戶推薦/心得分享】',
    promptContact: '【聯絡方式】',
    promptDesign: '【設計要求】',
    styleDefault: '專業、溫暖、值得信賴',
    colorDefault: '（不指定，請依風格自行搭配）',
    fontDefault: 'Noto Sans TC',
    fontNote: '，請使用 Google Fonts，標題用粗體',
    snippetGroupLabel: '快速指令範本',
    snippetStyleBtn: '調整視覺風格',
    snippetTextBtn: '修改文字內容',
    snippetPhotoBtn: '加入照片',
    snippetStyleContent: `請修改這個網站設計，調整以下部分：

1. 主色調改為 [填入顏色描述，例如：深藍色 #1a3c5e]
2. Hero 區塊的背景改為 [純色／漸層／圖片]
3. 字型改為更 [現代／溫暖／正式] 的風格
4. 按鈕樣式改為 [圓角／方形／有陰影]

其他內容維持不變，請輸出完整的修改後 HTML 檔案。`,
    snippetTextContent: `請修改 HTML 中的以下內容，其他都不要動：

- Hero 標題改為：[填入]
- About 區塊第一段改為：[填入]
- Service 項目一改為：[填入]

請輸出修改後的完整 HTML 檔案。`,
    snippetPhotoContent: `請在 Hero 區塊加入我的個人照片。
https://xxx.github.io/ooo/zzz.webp
請把照片放在文字的右側，圓形裁切，寬度約 200–250px，在手機版時照片移到文字下方。
其他內容不變，請輸出完整修改後的 HTML 檔案。`,
  },
  en: {
    pageTitle: 'Website Prompt Generator · Saori',
    heroTitle: 'Website<br>Prompt Generator',
    heroDesc: 'Fill in your brand info and instantly generate a complete AI prompt for your website design.',
    sec1Title: 'About You',
    sec2Title: 'Target Audience & Services',
    sec3Title: 'Social Proof',
    sec4Title: 'Contact',
    sec5Title: 'Design Preferences',
    labelName: 'Name <span class="req">required</span>',
    labelTitle: 'Title / Role <span class="req">required</span>',
    labelBg: 'My Background (2–3 sentences)',
    labelClient: 'Target Audience <span class="req">required</span>',
    orLabel: 'Fill in one of the following',
    labelPain: 'Client Pain Points',
    labelService: 'Services I Offer',
    labelMethod: 'My Approach / Method',
    labelGain: 'What Clients Gain',
    hintClient: 'Who do you most want to help? Describe their role or situation — the more specific, the better.',
    hintPain: 'What are they struggling with before they find you?',
    hintService: 'What can you actually do for them? 1–3 items is enough.',
    hintMethod: 'How is your approach different? e.g. your process, style, or principles.',
    hintGain: "After working with you, what changes in your client's work or life?",
    labelTrust: 'Testimonials / Reviews',
    labelEmail: 'Email <span class="req">required</span>',
    labelOther: 'Other Contact',
    labelLayout: 'Site Structure',
    hintLayout: 'Not sure? Pick "Let AI recommend". Single-page suits concise content people can scroll through; multi-page suits more services or content.',
    layoutOptSingle: 'Single page (everything on one page)',
    layoutOptMulti: 'Multi-page (split into several pages)',
    layoutOptAi: 'Let AI recommend',
    btnGen: 'Generate Prompt',
    btnCopy: 'Copy',
    pasteHint: 'Paste into your AI tool ↗',
    footerRole: 'Software Engineer · Systems Analyst · Career Coach',
    toast: '✓ Copied to clipboard',
    phName: 'e.g. Jane Smith',
    phBg: 'Brief intro about your background, expertise, and values…',
    phTrust: 'If none yet, type "None" — AI will leave a placeholder',
    phOther: 'e.g. LinkedIn, Instagram',
    errRequired: 'Please fill in the required fields: Name, Email, Title, and Target Audience ✨',
    errPainService: 'Please fill in at least one: Client Pain Points or Services I Offer 😎',
    errMethodGain: 'Almost there! Fill in either "My Approach" or "What Clients Gain" 🚀',
    errTooEmpty: 'Not enough info yet! Give me a few more details so I can craft a great prompt.',
    smartFallback: '(Please ask me clarifying questions before generating the page)',
    layoutPrompts: {
      single: {
        header: 'You are a professional web designer. Please follow web UX principles and create a complete single-page personal brand website as a full HTML file named index.html. Please use the frontend-design skill for the design.',
        note: '- Layout: single page, with these six sections: Hero, About, Service, Process, Trust, Contact',
        footer: 'Output a complete single HTML file with all CSS and JavaScript embedded.\nThe page must be fully responsive (mobile-friendly).',
      },
      multi: {
        header: 'You are a professional web designer. Please follow web UX principles and create a multi-page personal brand website, with the home page named index.html. Please use the frontend-design skill for the design.',
        note: '- Layout: multi-page. The content should cover Hero, About, Service, Process, Trust, Contact. Before writing any code, propose a page plan based on my content (which pages, which sections on each page, and file names), and wait for my confirmation before generating files. Every page needs a consistent navigation bar and footer.',
        footer: 'Output each page as its own HTML file, all sharing one style.css; put any JavaScript in a shared script.js.\nThe pages must be fully responsive (mobile-friendly).',
      },
      ai: {
        header: 'You are a professional web designer. Please follow web UX principles and create a personal brand website, with the home page named index.html. Please use the frontend-design skill for the design.',
        note: '- Layout: based on how much content I have, recommend either a single-page or multi-page site and explain why (for multi-page, also list the page plan and file names). Wait for my confirmation before generating files. The content should cover Hero, About, Service, Process, Trust, Contact.',
        footer: 'If single-page: output one complete HTML file (index.html) with all CSS and JavaScript embedded.\nIf multi-page: output each page as its own HTML file, all sharing one style.css; put any JavaScript in a shared script.js.\nThe pages must be fully responsive (mobile-friendly).',
      },
    },
    promptAbout: '[About Me]',
    promptAudience: '[Target Audience & Services]',
    promptBgSection: '[My Background]',
    promptTrustSection: '[Testimonials / Reviews]',
    promptContact: '[Contact]',
    promptDesign: '[Design Requirements]',
    styleDefault: 'professional, warm, trustworthy',
    colorDefault: '(No preference — let AI decide based on style)',
    fontDefault: 'Inter',
    fontNote: ', loaded from Google Fonts; use bold for headings',
    snippetGroupLabel: 'Quick Template Prompts',
    snippetStyleBtn: 'Adjust Visual Style',
    snippetTextBtn: 'Edit Text Content',
    snippetPhotoBtn: 'Add a Photo',
    snippetStyleContent: `Please update the website design with the following changes:

1. Change the primary color to [e.g., deep navy blue #1a3c5e]
2. Change the Hero section background to [solid color / gradient / image]
3. Update the typography to a more [modern / warm / formal] style
4. Change the button style to [rounded / square / with shadow]

Keep all other content unchanged. Please output the complete modified HTML file.`,
    snippetTextContent: `Please update the following text in the HTML — do not change anything else:

- Hero headline: [fill in]
- About section first paragraph: [fill in]
- Service item 1: [fill in]

Please output the complete modified HTML file.`,
    snippetPhotoContent: `Please add my personal photo to the Hero section.
https://xxx.github.io/ooo/zzz.webp
Place the photo to the right of the text, cropped in a circle, approximately 200–250px wide. On mobile, move the photo below the text.
Keep all other content unchanged. Please output the complete modified HTML file.`,
  }
};


/* ── Placeholder examples: one profession picked at random per page load ── */
const placeholderExamples = [
  {
    zh: {
      phTitle: '例：軟體工程師',
      phClient: '例：想把流程數位化的中小企業',
      phPain: '例：還在用 Excel 手動對帳、系統之間資料不互通',
      phService: '例：客製化網站、內部管理系統、自動化串接',
      phMethod: '例：先訪談釐清需求、小步交付快速驗證',
      phGain: '例：省下重複工作的時間，資料一目了然',
    },
    en: {
      phTitle: 'e.g. Software Engineer',
      phClient: 'e.g. Small businesses going digital',
      phPain: 'e.g. Manual spreadsheet work, systems that don\'t talk to each other',
      phService: 'e.g. Custom websites, internal tools, workflow automation',
      phMethod: 'e.g. Requirement interviews first, small iterative releases',
      phGain: 'e.g. Hours saved on repetitive work and data you can actually see',
    },
  },
  {
    zh: {
      phTitle: '例：瑜伽老師',
      phClient: '例：久坐、肩頸緊繃的上班族',
      phPain: '例：身體僵硬、壓力大、睡不好',
      phService: '例：小班瑜伽課、一對一私人課',
      phMethod: '例：呼吸引導、溫和的體位調整',
      phGain: '例：身體放鬆、睡得更好，有自己的練習習慣',
    },
    en: {
      phTitle: 'e.g. Yoga Teacher',
      phClient: 'e.g. Desk workers with tight shoulders',
      phPain: 'e.g. Stiff body, high stress, poor sleep',
      phService: 'e.g. Small-group classes, private sessions',
      phMethod: 'e.g. Breathwork, gentle alignment cues',
      phGain: 'e.g. A relaxed body, better sleep, and a steady home practice',
    },
  },
  {
    zh: {
      phTitle: '例：接案插畫家',
      phClient: '例：想建立品牌形象的小店',
      phPain: '例：視覺沒有辨識度、不知道怎麼跟設計師溝通',
      phService: '例：品牌插畫、包裝設計',
      phMethod: '例：手繪水彩風格、先草圖再定稿的合作流程',
      phGain: '例：讓客人一眼記住的品牌形象',
    },
    en: {
      phTitle: 'e.g. Freelance Illustrator',
      phClient: 'e.g. Small shops building their brand',
      phPain: 'e.g. Forgettable visuals, unsure how to brief a designer',
      phService: 'e.g. Brand illustration, packaging design',
      phMethod: 'e.g. Hand-painted watercolor, sketch-first workflow',
      phGain: 'e.g. A brand image customers remember at a glance',
    },
  },
];

const pickedExample = placeholderExamples[Math.floor(Math.random() * placeholderExamples.length)];
Object.assign(i18n.zh, pickedExample.zh);
Object.assign(i18n.en, pickedExample.en);

let currentLang = localStorage.getItem('ppg_lang') || 'zh';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('ppg_lang', lang);
  document.getElementById('htmlRoot').lang = lang === 'zh' ? 'zh-Hant' : 'en';
  document.title = i18n[lang].pageTitle;

  // Update active button
  document.getElementById('btnZh').classList.toggle('active', lang === 'zh');
  document.getElementById('btnEn').classList.toggle('active', lang === 'en');

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key] !== undefined) el.innerHTML = i18n[lang][key];
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if (i18n[lang][key] !== undefined) el.placeholder = i18n[lang][key];
  });

  // Update toast
  document.getElementById('toast').textContent = i18n[lang].toast;

  DesignPref.setLang(lang);

  // Clear output when switching language
  document.getElementById('out').value = '';
  document.getElementById('outputWrap').style.display = 'none';
}

/* ── END i18n ── */

function vals(id) { return document.getElementById(id).value.trim(); }
function smart(id) { const v = vals(id); return v || '（請反問我問題協助我釐清之後再開始生成網頁）'; }
function emptyCount() {
  return ['name','title','client','pain','service','method','gain','bg','trust','email','other'].filter(i => !vals(i)).length;
}
function multi(id) {
  const sep = currentLang === 'zh' ? '、' : ', ';
  return [...document.getElementById(id).selectedOptions].map(o => o.value).join(sep) || (currentLang === 'zh' ? '專業' : 'Professional');
}
function showOutput(text) {
  const out = document.getElementById('out');
  const wrap = document.getElementById('outputWrap');
  out.value = text;
  wrap.style.display = 'block';
  setTimeout(() => wrap.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}

function gen() {
  const L = i18n[currentLang];
  const req = ['email','name','title','client'];
  for (const r of req) {
    if (!vals(r)) {
      showOutput(L.errRequired);
      return;
    }
  }
  if (!vals('pain') && !vals('service')) {
    showOutput(L.errPainService);
    return;
  }
  if (!vals('method') && !vals('gain')) {
    showOutput(L.errMethodGain);
    return;
  }
  if (emptyCount() > 7) {
    showOutput(L.errTooEmpty);
    return;
  }
  const designErr = DesignPref.validate();
  if (designErr) {
    showOutput(designErr);
    return;
  }

  const smartVal = (id) => { const v = vals(id); return v || L.smartFallback; };

  const getFontName = () => DesignPref.getFont();

  const LP = L.layoutPrompts[vals('layout')] || L.layoutPrompts.single;

  const t =
`${LP.header}

${L.promptAbout}
- ${currentLang === 'zh' ? '姓名' : 'Name'}：${smartVal('name')}
- ${currentLang === 'zh' ? '職稱／定位' : 'Title / Role'}：${smartVal('title')}

${L.promptAudience}
- ${currentLang === 'zh' ? '目標客戶' : 'Target Audience'}：${smartVal('client')}
- ${currentLang === 'zh' ? '客戶痛點' : 'Client Pain Points'}：${smartVal('pain')}
- ${currentLang === 'zh' ? '我提供的服務' : 'Services I Offer'}：${smartVal('service')}
- ${currentLang === 'zh' ? '我的特色／方法' : 'My Approach / Method'}：${smartVal('method')}
- ${currentLang === 'zh' ? '客戶能獲得' : 'What Clients Gain'}：${smartVal('gain')}

${L.promptBgSection}
- ${smartVal('bg')}

${L.promptTrustSection}
- ${smartVal('trust')}

${L.promptContact}
- Email：${smartVal('email')}
${vals('other') ? `- ${currentLang === 'zh' ? '其他' : 'Other'}：${vals('other')}` : ''}

${L.promptDesign}
- ${currentLang === 'zh' ? '風格' : 'Style'}：${(() => {
    const parts = DesignPref.getStyles();
    const sep = currentLang === 'zh' ? '、' : ', ';
    return (parts.join(sep) || (currentLang === 'zh' ? '專業' : 'Professional')) + sep + L.styleDefault;
  })()}
- ${currentLang === 'zh' ? '配色' : 'Color Palette'}：${DesignPref.getColor() || L.colorDefault}
- ${currentLang === 'zh' ? '字型' : 'Font'}：${getFontName() ? `${getFontName()}${L.fontNote}` : (currentLang === 'zh' ? '（不指定，請依風格自行搭配）' : '(No preference — let AI decide based on style)')}
${LP.note}

${LP.footer}`;

  showOutput(t);
}

function setSnippet(type) {
  showOutput(i18n[currentLang]['snippet' + type.charAt(0).toUpperCase() + type.slice(1) + 'Content']);
}

function copyText() {
  const out = document.getElementById('out');
  if (!out.value.trim()) return;
  navigator.clipboard.writeText(out.value).then(() => {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  });
}

/* ── Persistence ── */
const FIELDS = ['layout','name','title','client','pain','service','method','gain','bg','trust','email','other'];

function saveAll() {
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) localStorage.setItem('ppg_' + id, el.value);
  });
  localStorage.setItem('ppg_design', JSON.stringify(DesignPref.getState()));
}

function loadAll() {
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    const v = localStorage.getItem('ppg_' + id);
    if (el && v !== null) el.value = v;
  });
  try {
    const design = JSON.parse(localStorage.getItem('ppg_design') || 'null');
    if (design) DesignPref.setState(design);
  } catch (e) { /* 存檔格式不對就略過，用預設值 */ }
}

DesignPref.init(document.getElementById('designPref'), { lang: currentLang });
loadAll();
setLang(currentLang);

document.querySelectorAll('input, textarea, select').forEach(el => {
  if (el.id === 'out') return;
  el.addEventListener('input', () => { document.getElementById('out').value = ''; document.getElementById('outputWrap').style.display = 'none'; saveAll(); });
  el.addEventListener('change', () => { document.getElementById('out').value = ''; document.getElementById('outputWrap').style.display = 'none'; saveAll(); });
});
