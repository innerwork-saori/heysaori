/* ── 範例 Prompt 展示 ── */

// 範例情境資料（信用卡帳單整理工具）
const EXAMPLE_PROMPT = (function buildExamplePrompt() {
  const sep = '='.repeat(60);
  const lines = [
    '你是一位專業的軟體工程師、UIUX 設計師與系統分析師。',
    '請先釐清以下需求（如有不完善之處，請提問或提出建議與我確認），確認後再開發工具並輸出完整可直接使用的靜態網頁程式碼。',
    '',
    sep,
    '【工具基本資訊】',
    sep,
    '工具類型：🌐 網頁工具',
    '工具名稱：信用卡帳單整理工具',
    '',
    '【目標與問題】',
    '幫誰、解決什麼問題：',
    '幫我（Saori）自動讀取 mail 附檔中的信用卡帳單，整理成一覽表，省去逐封開信對帳的麻煩。',
    '現況痛點：',
    '一封一封開啟 mail，開啟附件，人工逐行比對資料，容易漏看也很耗時。',
    '',
    sep,
    '【INPUT — 使用者輸入】',
    sep,
    '輸入欄位：',
    '這個工具自動讀取 mail 的附檔',
    '填寫範例：',
    'mail 中的信用卡帳單附檔',
    '欄位合法值限制：',
    '（請反問我問題協助我釐清）',
    '欄位缺漏時的處理：',
    '（請反問我問題協助我釐清）',
    '資料來源：',
    'mail 附檔通常是 PDF，有密碼',
    '',
    sep,
    '【OUTPUT — 輸出結果】',
    sep,
    '輸出格式與畫面：',
    '將所有資料印在畫面上，顯示日期（可能有兩個） / 銀行 / 消費項目名稱 / 金額',
    '結果範例：',
    '（請反問我問題協助我釐清）',
    '精準度與格式要求：',
    '（請反問我問題協助我釐清）',
    '錯誤或失敗時的回應：',
    '（請反問我問題協助我釐清）',
    '',
    sep,
    '【RULES — 商業規則與限制】',
    sep,
    '固定規則與計算邏輯：（無特別規定，請依常識判斷）',
    '不能做的事：',
    '（請反問我問題協助我釐清）',
    '',
    sep,
    '【EDGE CASES — 異常情況處理】',
    sep,
    '空白送出：顯示友善提示訊息，標示必填欄位，不執行計算',
    '異常值：顯示清楚的錯誤提示，告知使用者正確輸入方式',
    '資料衝突：',
    '（請反問我問題協助我釐清）',
    '模糊情境：',
    '（請反問我問題協助我釐清）',
    '',
    sep,
    '【DESIGN — 設計偏好】',
    sep,
    '風格偏好：柔角新粗獷風（Soft Neo-Brutalism）',
    '字型：Noto Sans TC（清晰通用）',
    '',
    sep,
    '【ACCEPTANCE CRITERIA — 驗收標準】',
    sep,
    '做對了的情境：',
    '列出所有帳單資料，每筆顯示日期、銀行、消費項目、金額',
    '做錯了的情境（不能出現）：',
    '（請反問我問題協助我釐清）',
    '視覺與體驗要求：',
    '（請反問我問題協助我釐清）',
    '其他補充：',
    '（請反問我問題協助我釐清）',
    '',
    sep,
    '【開發要求】',
    sep,
    '- 請輸出完整的單一 HTML 檔案，CSS 與 JavaScript 全部內嵌',
    '- 不需要後端伺服器，純前端即可運作。（如果有必要，跟我確認要不要使用 google app script 作為後端串接）',
    '- 畫面要乾淨易用，適合非技術背景的使用者操作',
    '- 頁面要能在手機與電腦上正常顯示（RWD）',
    '- 所有錯誤訊息請使用繁體中文，語氣友善',
    '- 程式碼請加入適當的中文註解，方便未來修改',
  ];
  return lines.join('\n');
})();

// AI 回覆範例內容（對應上方的信用卡帳單整理工具 Prompt）
const EXAMPLE_AI_REPLY = `目前我不建議直接開始開發，因為你的需求裡有幾個關鍵點還沒定義清楚，尤其是「純前端」與「自動讀 mail 附檔」本身有落差：純靜態網頁不能直接安全地讀取 Gmail 郵件與附件，若要自動化抓取 mail、處理受密碼保護的 PDF，通常需要 Google Apps Script 或其他後端協助串接。

▌先確認架構

我先幫你把需求拆成兩種可行方案，你選一種後，我再輸出完整單一 HTML：

  方案 A — 純前端版
  適合：先做 MVP、手動上傳 PDF
  優點：可立即做成單一 HTML、部署最簡單
  限制：不能自動讀 Gmail，也不能穩定解密所有受密碼保護 PDF

  方案 B — 前端 + Google Apps Script
  適合：真的要自動讀 mail 附檔、整理帳單
  優點：可串 Gmail、可集中處理附件與解析流程
  限制：需要你授權 Gmail / Drive / Sheet，已不是純前端

▌需求缺口

請你直接回覆下面問題，我會依你的答案整理成正式規格，再開始寫 HTML：

1. 你要選 A 還是 B？

2. PDF 密碼規則是什麼？
   每家銀行固定同一組？還是依卡號末幾碼 / 身分證 / 生日組成？

3. 你說的「日期（好像有兩個）」是指哪兩個？
   · 帳單期間
   · 消費日 / 入帳日
   · 繳款截止日
   你最後想顯示哪一個，或要不要兩個都顯示？

4. 「item 名稱」是要顯示什麼層級？
   每筆交易明細名稱、商店名稱，或只要總金額與少數欄位？

5. 支援幾家銀行？先只做 1 家還是多家混合解析？

6. 你要不要做「對帳」？只列出資料，還是要比對重複交易 / 金額異常？

▌我建議的 MVP

如果你想快速落地，我建議第一版先這樣定義：

  · 使用者可手動上傳 1 到多份信用卡 PDF
  · 若 PDF 有密碼，使用者輸入該 PDF 密碼
  · 畫面列出：銀行、帳單月份、交易日、商店名稱、金額
  · 支援搜尋、排序、依銀行篩選
  · 解析失敗時顯示友善錯誤訊息
  · UI 採柔角新粗獷風，字型用 Noto Sans TC，手機與桌機皆可用

請直接用下面格式回我，我下一步就整理成確認版規格：

  方案：A / B
  銀行：
  PDF 密碼規則：
  要顯示的日期欄位：
  item 名稱定義：
  是否需要對帳規則：
  是否需要匯出 CSV：`;

function toggleExamplePrompt() {
  const body = document.getElementById('examplePromptBody');
  const chevron = document.getElementById('exampleChevron');
  const toggle = document.getElementById('examplePromptToggle');
  if (!body || !chevron || !toggle) return;

  const isOpen = !body.hidden;

  if (isOpen) {
    // 收起
    body.hidden = true;
    chevron.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  } else {
    // 展開，並確保範例內容已填入
    const outputEl = document.getElementById('examplePromptOutput');
    if (outputEl && !outputEl.textContent) {
      outputEl.textContent = EXAMPLE_PROMPT;
    }
    const replyEl = document.getElementById('exampleAiReplyOutput');
    if (replyEl && !replyEl.textContent) {
      replyEl.textContent = EXAMPLE_AI_REPLY;
    }
    body.hidden = false;
    chevron.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }
}

// 鍵盤支援（Enter / Space 觸發展開）
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('examplePromptToggle');
  if (toggle) {
    toggle.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleExamplePrompt();
      }
    });
  }
});

/* ── Design helpers ── */
function toggleCustomColor() {
  const sel = document.getElementById('designColor');
  const wrap = document.getElementById('customColorWrap');
  wrap.style.display = sel.value === '自訂配色（請填下方）' ? 'block' : 'none';
  resetOutput(); saveAll();
}

function previewFont() {
  const sel = document.getElementById('designFont');
  const preview = document.getElementById('fontPreview');
  preview.style.fontFamily = sel.value;
  resetOutput(); saveAll();
}

function getSelectedStyles() {
  const sel = document.getElementById('designStyle');
  if (!sel) return '';
  return [...sel.selectedOptions].map(o => o.value).join('、');
}

/* ── Pill toggle ── */
function togglePill(el, val) {
  el.classList.toggle('active');
  saveAll();
  resetOutput();
}

function getActivePills() {
  return [...document.querySelectorAll('#toolTypePills .tool-pill.active')]
    .map(p => p.textContent.trim())
    .join('、');
}

/* ── Helpers ── */
function vals(id) { return (document.getElementById(id)?.value || '').trim(); }
function smart(id, fallback) {
  const v = vals(id);
  return v || (fallback || '（請反問我問題協助我釐清）');
}
function opt(id) {
  const v = vals(id);
  return v ? v : null;
}

function resetOutput() {
  document.getElementById('out').value = '';
  document.getElementById('outputWrap').style.display = 'none';
}

/* ── Validation ── */
function gen() {
  const toolType = getActivePills() || vals('toolTypeOther');
  if (!toolType) {
    showOutput('請先選擇工具類型（網頁工具、Chrome 外掛……）再繼續 ✨');
    return;
  }
  if (!vals('toolName')) {
    showOutput('請填寫工具名稱，哪怕是暫定的描述性名字也可以 ✨');
    return;
  }
  if (!vals('goalWho')) {
    showOutput('「這工具幫誰、解決什麼問題」是最重要的一欄，請先填寫 🙏');
    return;
  }
  if (!vals('inputFields')) {
    showOutput('請描述使用者需要輸入哪些欄位，才能讓 AI 知道工具的互動方式 📝');
    return;
  }
  if (!vals('outputFormat')) {
    showOutput('請說明工具輸出的結果長什麼樣子，AI 才能做出你想要的畫面 🎯');
    return;
  }
  if (!vals('acCorrect')) {
    showOutput('請至少填一個「這樣做對了」的情境，這樣 AI 才知道目標是什麼 ✅');
    return;
  }

  const toolTypeFull = [getActivePills(), vals('toolTypeOther')].filter(Boolean).join('（') + (vals('toolTypeOther') ? '）' : '');

  const sections = [];

  sections.push(`你是一位專業的軟體工程師、UIUX 設計師與系統分析師。`);
  sections.push(`請先釐清以下需求（如有不完善之處，請提問或提出建議與我確認），確認後再開發工具並輸出完整可直接使用的靜態網頁程式碼。`);

  sections.push(`\n${'='.repeat(60)}`);
  sections.push(`【工具基本資訊】`);
  sections.push(`${'='.repeat(60)}`);
  sections.push(`工具類型：${toolTypeFull}`);
  sections.push(`工具名稱：${smart('toolName')}`);

  sections.push(`\n【目標與問題】`);
  sections.push(`幫誰、解決什麼問題：\n${smart('goalWho')}`);
  sections.push(`現況痛點：\n${smart('goalPain')}`);

  sections.push(`\n${'='.repeat(60)}`);
  sections.push(`【INPUT — 使用者輸入】`);
  sections.push(`${'='.repeat(60)}`);
  sections.push(`輸入欄位：\n${smart('inputFields')}`);
  sections.push(`填寫範例：\n${smart('inputExample')}`);
  sections.push(`欄位合法值限制：\n${smart('inputValidation')}`);
  sections.push(`欄位缺漏時的處理：\n${smart('inputMissing')}`);
  if (opt('inputSource')) sections.push(`資料來源：\n${opt('inputSource')}`);
  else sections.push(`資料來源：使用者在畫面上手動輸入`);

  sections.push(`\n${'='.repeat(60)}`);
  sections.push(`【OUTPUT — 輸出結果】`);
  sections.push(`${'='.repeat(60)}`);
  sections.push(`輸出格式與畫面：\n${smart('outputFormat')}`);
  sections.push(`結果範例：\n${smart('outputExample')}`);
  sections.push(`精準度與格式要求：\n${smart('outputPrecision')}`);
  sections.push(`錯誤或失敗時的回應：\n${smart('outputError')}`);

  sections.push(`\n${'='.repeat(60)}`);
  sections.push(`【RULES — 商業規則與限制】`);
  sections.push(`${'='.repeat(60)}`);
  if (opt('rulesBiz')) sections.push(`固定規則與計算邏輯：\n${opt('rulesBiz')}`);
  else sections.push(`固定規則與計算邏輯：（無特別規定，請依常識判斷）`);
  sections.push(`不能做的事：\n${smart('rulesNot')}`);

  sections.push(`\n${'='.repeat(60)}`);
  sections.push(`【EDGE CASES — 異常情況處理】`);
  sections.push(`${'='.repeat(60)}`);
  if (opt('edgeEmpty')) sections.push(`空白送出：\n${opt('edgeEmpty')}`);
  else sections.push(`空白送出：顯示友善提示訊息，標示必填欄位，不執行計算`);
  if (opt('edgeInvalid')) sections.push(`異常值：\n${opt('edgeInvalid')}`);
  else sections.push(`異常值：顯示清楚的錯誤提示，告知使用者正確輸入方式`);
  sections.push(`資料衝突：\n${smart('edgeConflict')}`);
  sections.push(`模糊情境：\n${smart('edgeAmbiguous')}`);

  sections.push(`\n${'='.repeat(60)}`);
  sections.push(`【DESIGN — 設計偏好】`);
  sections.push(`${'='.repeat(60)}`);
  const styleVal = getSelectedStyles();
  const colorSel = document.getElementById('designColor');
  const colorVal = colorSel?.value === '自訂配色（請填下方）'
    ? (vals('designCustomColor') || '自訂配色（未填寫）')
    : (colorSel?.value || '');
  const fontSel = document.getElementById('designFont');
  const fontLabel = fontSel?.options[fontSel.selectedIndex]?.text || '';
  if (styleVal) sections.push(`風格偏好：${styleVal}`);
  else sections.push(`風格偏好：（不指定，請給一個乾淨易用的預設樣式）`);
  if (colorVal) sections.push(`配色：${colorVal}`);
  if (fontLabel) sections.push(`字型：${fontLabel}`);

  sections.push(`\n${'='.repeat(60)}`);
  sections.push(`【ACCEPTANCE CRITERIA — 驗收標準】`);
  sections.push(`${'='.repeat(60)}`);
  sections.push(`做對了的情境：\n${smart('acCorrect')}`);
  sections.push(`做錯了的情境（不能出現）：\n${smart('acWrong')}`);
  sections.push(`視覺與體驗要求：\n${smart('acUX')}`);
  sections.push(`其他補充：\n${smart('acExtra')}`);

  sections.push(`\n${'='.repeat(60)}`);
  sections.push(`【開發要求】`);
  sections.push(`${'='.repeat(60)}`);

  const isChrome = getActivePills().includes('Chrome');
  const isWeb = getActivePills().includes('網頁') || !getActivePills();

  if (isChrome) {
    sections.push(`- 請輸出完整的 Chrome Extension 結構（manifest.json、popup.html、popup.js 等）`);
    sections.push(`- 使用 Manifest V3`);
    sections.push(`- 每個檔案請單獨輸出，並說明各檔案的用途與存放位置`);
  } else {
    sections.push(`- 請輸出完整的單一 HTML 檔案，CSS 與 JavaScript 全部內嵌`);
    sections.push(`- 不需要後端伺服器，純前端即可運作。（如果有必要，跟我確認要不要使用 google app script 作為後端串接）`);
  }

  sections.push(`- 畫面要乾淨易用，適合非技術背景的使用者操作`);
  sections.push(`- 頁面要能在手機與電腦上正常顯示（RWD）`);
  sections.push(`- 所有錯誤訊息請使用繁體中文，語氣友善`);
  sections.push(`- 程式碼請加入適當的中文註解，方便未來修改`);

  const finalPrompt = sections.join('\n');
  showOutput(finalPrompt);
}

function showOutput(text) {
  const out = document.getElementById('out');
  const wrap = document.getElementById('outputWrap');
  out.value = text;
  wrap.style.display = 'block';
  setTimeout(() => wrap.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
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

function clearAll() {
  if (!confirm('確定要清除所有填寫內容嗎？')) return;
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.querySelectorAll('.tool-pill').forEach(p => p.classList.remove('active'));
  // reset design selects
  const styleSel = document.getElementById('designStyle');
  if (styleSel) [...styleSel.options].forEach(o => o.selected = false);
  const colorSel = document.getElementById('designColor');
  if (colorSel) { colorSel.value = ''; toggleCustomColor(); }
  const fontSel = document.getElementById('designFont');
  if (fontSel) {
    fontSel.selectedIndex = 0;
    previewFont();
  }
  localStorage.clear();
  resetOutput();
}

/* ── Persistence ── */
const FIELDS = [
  'toolName','toolTypeOther',
  'goalWho','goalPain',
  'inputFields','inputExample','inputValidation','inputMissing','inputSource',
  'outputFormat','outputExample','outputPrecision','outputError',
  'rulesBiz','rulesNot',
  'edgeEmpty','edgeInvalid','edgeConflict','edgeAmbiguous',
  'designCustomColor',
  'acCorrect','acWrong','acUX','acExtra'
];

function saveAll() {
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) localStorage.setItem('tpg_' + id, el.value);
  });
  // save tool type pills
  const activePills = [...document.querySelectorAll('#toolTypePills .tool-pill')]
    .map(p => p.classList.contains('active') ? '1' : '0').join(',');
  localStorage.setItem('tpg_pills', activePills);
  // save design selects
  const styleSel = document.getElementById('designStyle');
  if (styleSel) {
    const selected = [...styleSel.selectedOptions].map(o => o.value);
    localStorage.setItem('tpg_designStyle', JSON.stringify(selected));
  }
  const colorSel = document.getElementById('designColor');
  if (colorSel) localStorage.setItem('tpg_designColor', colorSel.value);
  const fontSel = document.getElementById('designFont');
  if (fontSel) localStorage.setItem('tpg_designFont', fontSel.value);
}

function loadAll() {
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    const v = localStorage.getItem('tpg_' + id);
    if (el && v !== null) el.value = v;
  });
  const pills = document.querySelectorAll('#toolTypePills .tool-pill');
  const saved = localStorage.getItem('tpg_pills');
  if (saved) {
    saved.split(',').forEach((v, i) => {
      if (pills[i] && v === '1') pills[i].classList.add('active');
    });
  }
  // load design selects
  const savedStyles = localStorage.getItem('tpg_designStyle');
  if (savedStyles) {
    const arr = JSON.parse(savedStyles);
    const styleSel = document.getElementById('designStyle');
    if (styleSel) [...styleSel.options].forEach(o => { o.selected = arr.includes(o.value); });
  }
  const savedColor = localStorage.getItem('tpg_designColor');
  const colorSel = document.getElementById('designColor');
  if (colorSel && savedColor !== null) {
    colorSel.value = savedColor;
    toggleCustomColor();
  }
  const savedFont = localStorage.getItem('tpg_designFont');
  const fontSel = document.getElementById('designFont');
  if (fontSel && savedFont) {
    fontSel.value = savedFont;
    previewFont();
  }
}

function manualSave() {
  saveAll();
  const toast = document.getElementById('toast');
  toast.textContent = '💾 已暫存';
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); toast.textContent = '✓ 已複製至剪貼簿'; }, 1800);
}

loadAll();

document.querySelectorAll('input, textarea').forEach(el => {
  if (el.id === 'out') return;
  el.addEventListener('input', () => { resetOutput(); saveAll(); });
});

// persist design multi-select on change
document.getElementById('designStyle')?.addEventListener('change', () => { resetOutput(); saveAll(); });
