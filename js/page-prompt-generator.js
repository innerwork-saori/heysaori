
/* ── i18n ── */
const i18n = {
  zh: {
    pageTitle: '網站 Prompt 產生器 · Saori',
    heroTitle: '一頁式網站<br>Prompt 產生器',
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
    labelTrust: '客戶推薦 ／ 心得分享',
    labelEmail: 'Email <span class="req">必填</span>',
    labelOther: '其他聯絡方式',
    labelStyle: '風格（按住 shift 不放，滑鼠點選即可多選）',
    labelColor: '配色',
    colorOpt0: '（不指定，讓 AI 決定）',
    colorOpt1: '柔和藍綠色調',
    colorOpt2: '暖橙色調',
    colorOpt3: '莫蘭迪中性色',
    colorOpt4: '黑白極簡',
    colorOpt5: '自訂配色（請填下方）',
    labelCustomColor: '自訂配色 <span style="color:var(--accent-rose)">*必填</span>',
    labelFont: '字型',
    btnGen: '產生 Prompt',
    btnCopy: '複製',
    pasteHint: '複製後貼到 AI ↗',
    footerRole: '軟體工程師・系統分析師・生涯諮詢師',
    toast: '✓ 已複製至剪貼簿',
    phName: '例：謝孟娟',
    phTitle: '例：職涯諮詢師',
    phBg: '簡短介紹你的經歷、專長與信念……',
    phClient: '例：想轉職的工程師',
    phPain: '例：不知道方向、資歷難以呈現',
    phService: '例：一對一職涯諮詢、履歷健檢',
    phMethod: '例：蘇格拉底式提問、正念引導',
    phGain: '例：清晰的職涯方向與具體行動計畫',
    phTrust: '如尚無推薦，填「暫無」即可，AI 將提示位置留空',
    phOther: '例：LINE ID、Instagram',
    phCustomColor: '例：奶茶米色 + 深棕色字體',
    errRequired: '這幾位主角不能缺席喔：姓名、Email、職稱、目標客戶，請先填寫 ✨',
    errPainService: '至少告訴我一件事：客戶痛點 或 你提供的服務，二選一即可 😎',
    errMethodGain: '還差一點點！請填「我的特色」或「客戶能獲得」其中一項，我比較好發揮 🚀',
    errTooEmpty: '欸呀～資訊太少啦！再多給我一些線索，我才能幫你變出厲害的網站內容喔',
    errCustomColor: '選了自訂配色，請填寫你喜歡的配色描述 🎨',
    smartFallback: '（請反問我問題協助我釐清之後再開始生成網頁）',
    promptHeader: '你是一位專業的網頁設計師。請遵循網頁 UX 原則幫我設計一個一頁式個人品牌網站的完整 HTML 檔案。',
    promptAbout: '【關於我】',
    promptAudience: '【目標客戶與服務】',
    promptBgSection: '【我的背景】',
    promptTrustSection: '【客戶推薦/心得分享】',
    promptContact: '【聯絡方式】',
    promptDesign: '【設計要求】',
    promptFooter: '請輸出一個完整的單一 HTML 檔案，CSS 和 JavaScript 都嵌入在同一個檔案內。\n頁面要能在手機上正常顯示（RWD）。',
    styleDefault: '專業、溫暖、值得信賴',
    colorDefault: '（不指定，請依風格自行搭配）',
    fontDefault: 'Noto Sans TC',
    fontNote: '，請使用 Google Fonts，標題用粗體',
    layoutNote: '- 版面：包含以下六個區塊：Hero、About、Service、Process、Trust、Contact',
    styleDetailsSummary: '▸ 風格參考說明',
    colorDetailsSummary: '▸ 配色靈感參考',
    styleOptions: [
      { label: '極簡清新風', vibe: '乾淨、留白多、耐看',         traits: '白底、簡單排版、少量強調色' },
      { label: '專業科技風', vibe: '理性、俐落、像新創官網',      traits: '深色或中性色、卡片區塊、清楚 CTA' },
      { label: '雜誌編輯風', vibe: '有質感、重排版',             traits: '大標題、強字體對比、留白節奏明顯' },
      { label: '插畫親切風', vibe: '輕鬆、親切、有品牌個性',     traits: '插畫主視覺、柔和配色、活潑' },
      { label: '大膽前衛風', vibe: '強烈、吸睛、有設計感',       traits: '粗字體、強對比、故意不那麼工整' },
      { label: '復古懷舊風', vibe: '溫暖、有年代感',             traits: '復古配色、襯線字、舊感材質裝飾' },
      { label: '年輕潮流風', vibe: '年輕、亮眼、偏流行感',       traits: '金屬感、亮色、高反差、未來感元素' },
      { label: '高級精品風', vibe: '高級、精緻、質感導向',       traits: '大圖、細緻字體、節制配色、重視氣氛' },
      { label: '活潑多彩風', vibe: '友善、熱鬧、適合活動或教育', traits: '多色系、圓角、明亮插圖或圖塊' },
      { label: '柔角新粗獷風（Soft Neo-Brutalism）', vibe: '大膽但不刺眼、有個性有溫度', traits: '粗黑邊框 + 圓角、錯位陰影、高對比配色、幾何區塊感' },
      { label: '自訂風格（請填下方）', special: 'custom' },
    ],
    labelCustomStyle: '自訂風格描述 <span style="color:var(--accent-rose)">*必填</span>',
    phCustomStyle: '例：日系和風、帶有手寫感的溫柔插畫風、科幻感深色系……',
    errCustomStyle: '選了自訂風格，請填寫你的風格描述 ✏️',
    styleTableHead: ['風格', '感覺', '常見特徵'],
    colorDetailsHtml: `
      <div style="margin-bottom:0.4rem;font-weight:500;color:var(--text-soft);letter-spacing:0.08em;">配色工具</div>
      <div>· <a href="https://coolors.co/" target="_blank" style="color:var(--accent1);text-decoration:none;border-bottom:1px solid var(--paper-mid);">Coolors</a> — 快速產生配色組合</div>
      <div>· <a href="https://www.happyhues.co/palettes/15" target="_blank" style="color:var(--accent1);text-decoration:none;border-bottom:1px solid var(--paper-mid);">Happy Hues</a> — 看配色實際套在頁面上的效果</div>
      <div style="margin-top:0.6rem;margin-bottom:0.4rem;font-weight:500;color:var(--text-soft);letter-spacing:0.08em;">找色碼</div>
      <div>· <a href="https://www.toodoo.com/db/color.html" target="_blank" style="color:var(--accent1);text-decoration:none;border-bottom:1px solid var(--paper-mid);">色碼表 (Toodoo)</a></div>
      <div>· <a href="https://www.wibibi.com/info.php?tid=372" target="_blank" style="color:var(--accent1);text-decoration:none;border-bottom:1px solid var(--paper-mid);">色碼表 (Wibibi)</a></div>`,
    fontPreviewText: '字型預覽：品牌感從文字開始',
    fontOptions: [
      { value: '__none__',        label: '（不設定，讓 AI 決定）',      serif: false, special: 'none'   },
      { value: 'Noto Sans TC',    label: 'Noto Sans TC（清晰通用）',    serif: false },
      { value: 'Zen Maru Gothic', label: 'Zen Maru Gothic（圓潤親和）', serif: false },
      { value: 'Shippori Mincho', label: 'Shippori Mincho（質感明體）', serif: true  },
      { value: 'Kiwi Maru',       label: 'Kiwi Maru（可愛溫暖）',      serif: false },
      { value: 'Kosugi Maru',     label: 'Kosugi Maru（簡潔圓體）',    serif: false },
      { value: '__custom__',      label: '自訂字型（請填下方）',         serif: false, special: 'custom' },
    ],
    labelCustomFont: '自訂字型名稱 <span style="color:var(--accent-rose)">*必填</span>',
    phCustomFont: '例：Nunito、Source Han Sans、思源黑體',
    errCustomFont: '選了自訂字型，請填寫字型名稱 🔤',
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
    heroTitle: 'One-Page Website<br>Prompt Generator',
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
    labelTrust: 'Testimonials / Reviews',
    labelEmail: 'Email <span class="req">required</span>',
    labelOther: 'Other Contact',
    labelStyle: 'Style (hold Shift to select multiple)',
    labelColor: 'Color Palette',
    colorOpt0: '(No preference — let AI decide)',
    colorOpt1: 'Soft Blue-Green',
    colorOpt2: 'Warm Orange',
    colorOpt3: 'Muted Neutral (Morandi)',
    colorOpt4: 'Black & White Minimal',
    colorOpt5: 'Custom (fill in below)',
    labelCustomColor: 'Custom Color <span style="color:var(--accent-rose)">*required</span>',
    labelFont: 'Font',
    btnGen: 'Generate Prompt',
    btnCopy: 'Copy',
    pasteHint: 'Paste into your AI tool ↗',
    footerRole: 'Software Engineer · Systems Analyst · Career Coach',
    toast: '✓ Copied to clipboard',
    phName: 'e.g. Jane Smith',
    phTitle: 'e.g. Career Coach',
    phBg: 'Brief intro about your background, expertise, and values…',
    phClient: 'e.g. Engineers looking to switch careers',
    phPain: 'e.g. Unclear direction, hard to showcase experience',
    phService: 'e.g. 1-on-1 career coaching, resume review',
    phMethod: 'e.g. Socratic questioning, mindfulness-based guidance',
    phGain: 'e.g. A clear career direction and concrete action plan',
    phTrust: 'If none yet, type "None" — AI will leave a placeholder',
    phOther: 'e.g. LinkedIn, Instagram',
    phCustomColor: 'e.g. Warm beige + dark brown text',
    errRequired: 'Please fill in the required fields: Name, Email, Title, and Target Audience ✨',
    errPainService: 'Please fill in at least one: Client Pain Points or Services I Offer 😎',
    errMethodGain: 'Almost there! Fill in either "My Approach" or "What Clients Gain" 🚀',
    errTooEmpty: 'Not enough info yet! Give me a few more details so I can craft a great prompt.',
    errCustomColor: 'You selected Custom Color — please describe your preferred palette 🎨',
    smartFallback: '(Please ask me clarifying questions before generating the page)',
    promptHeader: 'You are a professional web designer. Please follow web UX principles and create a complete single-page personal brand website as a full HTML file.',
    promptAbout: '[About Me]',
    promptAudience: '[Target Audience & Services]',
    promptBgSection: '[My Background]',
    promptTrustSection: '[Testimonials / Reviews]',
    promptContact: '[Contact]',
    promptDesign: '[Design Requirements]',
    promptFooter: 'Output a complete single HTML file with all CSS and JavaScript embedded.\nThe page must be fully responsive (mobile-friendly).',
    styleDefault: 'professional, warm, trustworthy',
    colorDefault: '(No preference — let AI decide based on style)',
    fontDefault: 'Inter',
    fontNote: ', loaded from Google Fonts; use bold for headings',
    layoutNote: '- Layout: include these six sections: Hero, About, Service, Process, Trust, Contact',
    styleDetailsSummary: '▸ Style Reference Guide',
    colorDetailsSummary: '▸ Color Inspiration',
    styleOptions: [
      { label: 'Clean Minimal',    vibe: 'Airy, spacious, timeless',          traits: 'White background, simple layout, subtle accent color' },
      { label: 'Tech Professional', vibe: 'Rational, sharp, startup-like',    traits: 'Dark or neutral tones, card layout, clear CTA' },
      { label: 'Editorial',        vibe: 'Polished, typography-driven',        traits: 'Large headlines, strong font contrast, deliberate whitespace' },
      { label: 'Illustrative',     vibe: 'Friendly, approachable, branded',   traits: 'Illustration hero, soft palette, playful feel' },
      { label: 'Bold & Avant-garde', vibe: 'Striking, design-forward',        traits: 'Heavy type, high contrast, intentionally asymmetric' },
      { label: 'Retro / Vintage',  vibe: 'Warm, nostalgic',                   traits: 'Vintage palette, serif fonts, aged textures' },
      { label: 'Trendy & Youthful', vibe: 'Fresh, vibrant, pop-culture feel', traits: 'Metallic accents, bright colors, futuristic elements' },
      { label: 'Luxury',           vibe: 'Premium, refined, atmosphere-first', traits: 'Full-bleed imagery, delicate type, restrained palette' },
      { label: 'Colorful & Playful', vibe: 'Welcoming, lively, great for events or education', traits: 'Multi-color, rounded corners, bright illustrations' },
      { label: 'Soft Neo-Brutalism', vibe: 'Bold but approachable, character with warmth', traits: 'Thick rounded borders, offset shadows, high contrast, geometric blocks' },
      { label: 'Custom Style (fill in below)', special: 'custom' },
    ],
    styleTableHead: ['Style', 'Vibe', 'Common Traits'],
    labelCustomStyle: 'Custom Style Description <span style="color:var(--accent-rose)">*required</span>',
    phCustomStyle: 'e.g. Japanese minimalism, soft hand-drawn illustration, dark sci-fi aesthetic…',
    errCustomStyle: 'You selected Custom Style — please describe your preferred style ✏️',
    colorDetailsHtml: `
      <div style="margin-bottom:0.4rem;font-weight:500;color:var(--text-soft);letter-spacing:0.08em;">Color Tools</div>
      <div>· <a href="https://coolors.co/" target="_blank" style="color:var(--accent1);text-decoration:none;border-bottom:1px solid var(--paper-mid);">Coolors</a> — Generate palette combinations instantly</div>
      <div>· <a href="https://www.happyhues.co/palettes/15" target="_blank" style="color:var(--accent1);text-decoration:none;border-bottom:1px solid var(--paper-mid);">Happy Hues</a> — See palettes applied to real UI</div>
      <div style="margin-top:0.6rem;margin-bottom:0.4rem;font-weight:500;color:var(--text-soft);letter-spacing:0.08em;">Find Color Codes</div>
      <div>· <a href="https://htmlcolorcodes.com/" target="_blank" style="color:var(--accent1);text-decoration:none;border-bottom:1px solid var(--paper-mid);">HTML Color Codes</a></div>
      <div>· <a href="https://www.colorhexa.com/" target="_blank" style="color:var(--accent1);text-decoration:none;border-bottom:1px solid var(--paper-mid);">ColorHexa</a></div>`,
    fontPreviewText: 'Font Preview: Your brand starts with typography',
    fontOptions: [
      { value: '__none__',          label: '(No preference — let AI decide)',    serif: false, special: 'none'   },
      { value: 'Inter',             label: 'Inter（clean & modern）',            serif: false },
      { value: 'DM Sans',           label: 'DM Sans（friendly & minimal）',      serif: false },
      { value: 'Raleway',           label: 'Raleway（elegant sans-serif）',      serif: false },
      { value: 'Playfair Display',  label: 'Playfair Display（editorial）',      serif: true  },
      { value: 'Lora',              label: 'Lora（warm & literary）',            serif: true  },
      { value: 'Merriweather',      label: 'Merriweather（readable serif）',     serif: true  },
      { value: 'EB Garamond',       label: 'EB Garamond（classic & refined）',   serif: true  },
      { value: '__custom__',        label: 'Custom font (fill in below)',         serif: false, special: 'custom' },
    ],
    labelCustomFont: 'Custom Font Name <span style="color:var(--accent-rose)">*required</span>',
    phCustomFont: 'e.g. Nunito, Outfit, Josefin Sans',
    errCustomFont: 'You selected Custom font — please enter the font name 🔤',
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

  // Update color select options
  const colorSel = document.getElementById('color');
  if (colorSel) {
    [...colorSel.options].forEach(opt => {
      const key = opt.getAttribute('data-i18n');
      if (key && i18n[lang][key] !== undefined) opt.textContent = i18n[lang][key];
    });
  }

  // Rebuild style options
  const styleSel = document.getElementById('style');
  if (styleSel) {
    const prevSelected = [...styleSel.options].filter(o => o.selected).map(o => o.dataset.styleKey);
    styleSel.innerHTML = '';
    i18n[lang].styleOptions.forEach(opt => {
      const el = document.createElement('option');
      el.value = opt.label;
      el.textContent = opt.label;
      el.dataset.styleKey = opt.label;
      if (opt.special) el.dataset.special = opt.special;
      styleSel.appendChild(el);
    });
    toggleCustomStyle(); // sync visibility after rebuild
  }

  // Rebuild style reference table
  const styleBody = document.getElementById('styleDetailsBody');
  if (styleBody) {
    const L = i18n[lang];
    const [h1, h2, h3] = L.styleTableHead;
    const rows = L.styleOptions.filter(opt => !opt.special).map((opt, i, arr) => {
      const bg = i % 2 === 1 ? ' style="background:var(--paper-warm);"' : '';
      const last = i === arr.length - 1;
      const border = last ? '' : 'border-bottom:1px solid var(--paper-mid);';
      return `<tr${bg}><td style="padding:5px 10px;${border}color:var(--text-main);">${opt.label}</td><td style="padding:5px 10px;${border}color:var(--text-mid);">${opt.vibe}</td><td style="padding:5px 10px;${border}color:var(--text-soft);">${opt.traits}</td></tr>`;
    }).join('');
    styleBody.innerHTML = `<table style="width:100%;border-collapse:collapse;"><thead><tr style="background:var(--paper-warm);"><th style="padding:6px 10px;text-align:left;color:var(--text-mid);font-weight:500;letter-spacing:0.06em;border-bottom:1px solid var(--paper-mid);">${h1}</th><th style="padding:6px 10px;text-align:left;color:var(--text-mid);font-weight:500;letter-spacing:0.06em;border-bottom:1px solid var(--paper-mid);">${h2}</th><th style="padding:6px 10px;text-align:left;color:var(--text-mid);font-weight:500;letter-spacing:0.06em;border-bottom:1px solid var(--paper-mid);">${h3}</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  // Rebuild color inspiration
  const colorBody = document.getElementById('colorDetailsBody');
  if (colorBody) colorBody.innerHTML = i18n[lang].colorDetailsHtml;

  // Rebuild font options for current language
  const fontSel = document.getElementById('font');
  if (fontSel) {
    const prevVal = fontSel.options[fontSel.selectedIndex]?.dataset.fontName || '';
    fontSel.innerHTML = '';
    i18n[lang].fontOptions.forEach(opt => {
      const el = document.createElement('option');
      el.value = opt.label;
      el.textContent = opt.label;
      el.dataset.fontName = opt.value;
      el.dataset.serif = opt.serif ? '1' : '0';
      if (opt.special) el.dataset.special = opt.special;
      fontSel.appendChild(el);
    });
    // Try to restore previously selected font by name
    const match = [...fontSel.options].find(o => o.dataset.fontName === prevVal);
    if (match) match.selected = true;
    previewFont(); // re-run to sync customFontWrap visibility
  }

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
function previewFont() {
  const sel = document.getElementById('font');
  const selectedOpt = sel.options[sel.selectedIndex];
  const special = selectedOpt ? selectedOpt.dataset.special : '';
  const previewEl = document.getElementById('fontPreview');
  const customWrap = document.getElementById('customFontWrap');

  // Show/hide custom font input
  customWrap.style.display = special === 'custom' ? 'block' : 'none';

  if (special === 'none' || special === 'custom') {
    // Reset preview to default body font
    previewEl.style.fontFamily = '';
    return;
  }

  const f = selectedOpt ? selectedOpt.dataset.fontName : '';
  const isSerif = selectedOpt ? selectedOpt.dataset.serif === '1' : false;
  previewEl.style.fontFamily = f ? (isSerif ? `'${f}', serif` : `'${f}', sans-serif`) : '';
}
function pickedColor() {
  const v = vals('color');
  if (!v) return '';
  return v.includes('自訂') ? (vals('customColor') || '（請描述你喜歡的配色）') : v;
}
function toggleCustomColor() {
  const isCustom = vals('color').includes('自訂') || vals('color').toLowerCase().includes('custom');
  document.getElementById('customColorWrap').style.display = isCustom ? 'block' : 'none';
}

function toggleCustomStyle() {
  const styleSel = document.getElementById('style');
  const hasCustom = [...styleSel.selectedOptions].some(opt => opt.dataset.special === 'custom');
  document.getElementById('customStyleWrap').style.display = hasCustom ? 'block' : 'none';
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
  if (vals('color').includes('自訂') || vals('color').toLowerCase().includes('custom')) {
    if (!vals('customColor')) {
      showOutput(L.errCustomColor);
      document.getElementById('customColor').focus();
      return;
    }
  }

  // Validate custom font
  const fontSel = document.getElementById('font');
  const fontOpt = fontSel.options[fontSel.selectedIndex];
  if (fontOpt?.dataset.special === 'custom' && !vals('customFont')) {
    showOutput(L.errCustomFont);
    document.getElementById('customFont').focus();
    return;
  }

  // Validate custom style
  const styleSelEl = document.getElementById('style');
  const hasCustomStyle = [...styleSelEl.selectedOptions].some(opt => opt.dataset.special === 'custom');
  if (hasCustomStyle && !vals('customStyle')) {
    showOutput(L.errCustomStyle);
    document.getElementById('customStyle').focus();
    return;
  }

  const smartVal = (id) => { const v = vals(id); return v || L.smartFallback; };

  const getFontName = () => {
    const sel = document.getElementById('font');
    const opt = sel.options[sel.selectedIndex];
    const special = opt?.dataset.special;
    if (special === 'none') return '';
    if (special === 'custom') return vals('customFont') || L.fontDefault;
    return opt ? opt.dataset.fontName : L.fontDefault;
  };

  const t =
`${L.promptHeader}

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
    const sel = document.getElementById('style');
    const opts = [...sel.selectedOptions];
    const hasCustom = opts.some(o => o.dataset.special === 'custom');
    const named = opts.filter(o => !o.dataset.special).map(o => o.value);
    const parts = [...named, ...(hasCustom && vals('customStyle') ? [vals('customStyle')] : [])];
    const sep = currentLang === 'zh' ? '、' : ', ';
    return (parts.join(sep) || (currentLang === 'zh' ? '專業' : 'Professional')) + sep + L.styleDefault;
  })()}
- ${currentLang === 'zh' ? '配色' : 'Color Palette'}：${pickedColor() || L.colorDefault}
- ${currentLang === 'zh' ? '字型' : 'Font'}：${getFontName() ? `${getFontName()}${L.fontNote}` : (currentLang === 'zh' ? '（不指定，請依風格自行搭配）' : '(No preference — let AI decide based on style)')}
${L.layoutNote}

${L.promptFooter}`;

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
const FIELDS = ['name','title','client','pain','service','method','gain','bg','trust','email','other','color','customColor','font','customFont','customStyle'];

function saveAll() {
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) localStorage.setItem('ppg_' + id, el.value);
  });
  const style = document.getElementById('style');
  if (style) {
    const sel = [...style.options].map(o => o.selected ? '1' : '0').join(',');
    localStorage.setItem('ppg_style', sel);
  }
}

function loadAll() {
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    const v = localStorage.getItem('ppg_' + id);
    if (el && v !== null) el.value = v;
  });
  const style = document.getElementById('style');
  const sel = localStorage.getItem('ppg_style');
  if (style && sel) {
    sel.split(',').forEach((v, i) => {
      if (style.options[i]) style.options[i].selected = v === '1';
    });
  }
  previewFont();
  toggleCustomColor();}

loadAll();
setLang(currentLang);

document.querySelectorAll('input, textarea, select').forEach(el => {
  if (el.id === 'out') return;
  el.addEventListener('input', () => { document.getElementById('out').value = ''; document.getElementById('outputWrap').style.display = 'none'; saveAll(); });
  el.addEventListener('change', () => { document.getElementById('out').value = ''; document.getElementById('outputWrap').style.display = 'none'; saveAll(); });
});
