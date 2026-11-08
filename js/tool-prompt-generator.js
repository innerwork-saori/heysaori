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

/* ── Pill toggle ── */
function togglePill(el) {
  el.classList.toggle('active');
  // 使用者自己改了選項，「已幫你選」的提示就收起來
  const helperResult = document.getElementById('toolHelperResult');
  if (helperResult) helperResult.hidden = true;
  // 「我不確定」和其他選項互斥：選了一邊就取消另一邊
  if (el.classList.contains('active')) {
    const pickedUnsure = !!el.dataset.unsure;
    document.querySelectorAll('#toolTypePills .tool-pill.active').forEach(p => {
      if (p !== el && !!p.dataset.unsure !== pickedUnsure) p.classList.remove('active');
    });
    // 選了「我不確定」：順便打開「幫我選」的問題，給使用者一個縮小範圍的機會
    const helper = document.getElementById('toolHelper');
    if (pickedUnsure && helper) helper.open = true;
  }
  saveAll();
  resetOutput();
}

function getActivePills() {
  return [...document.querySelectorAll('#toolTypePills .tool-pill.active:not([data-unsure])')]
    .map(p => p.dataset.label)
    .join('、');
}

/* ── 「幫我選」：依使用情境直接選好工具類型 ── */
function pickToolType(label) {
  const pills = document.querySelectorAll('#toolTypePills .tool-pill');
  pills.forEach(p => p.classList.toggle('active', p.dataset.label === label));
  saveAll();
  resetOutput();

  const helper = document.getElementById('toolHelper');
  if (helper) helper.open = false;
  const result = document.getElementById('toolHelperResult');
  if (result) {
    result.textContent = `✓ 已幫你選「${label}」。不對的話，直接點上面的選項修改就好。`;
    result.hidden = false;
  }
}

function isToolTypeUnsure() {
  return !!document.querySelector('#toolTypePills .tool-pill.active[data-unsure]');
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
  PromptSheet.update();
}

/* ── 必填檢查（按「複製 Prompt」時才跑） ── */
function checkPrompt() {
  if (!getActivePills() && !isToolTypeUnsure() && !vals('toolTypeOther')) {
    return { message: '第 1 題還沒選：你想做哪一種工具？看不懂的話選「我不確定」就好 ✨', focusId: 'toolTypeOther' };
  }
  if (!vals('goalWho')) {
    return { message: '第 2 題「這工具給誰用、幫他解決什麼麻煩」最重要，請先寫一兩句 🙏', focusId: 'goalWho' };
  }
  if (!vals('inputFields')) {
    return { message: '第 3 題還沒寫：使用的人要輸入或提供什麼？列幾項就好 📝', focusId: 'inputFields' };
  }
  if (!vals('outputFormat')) {
    return { message: '第 4 題還沒寫：按下去之後會看到什麼結果？一句話就好 🎯', focusId: 'outputFormat' };
  }
  const designErr = DesignPref.validate();
  if (designErr) return { message: designErr };
  return null;
}

function promptProgress() {
  const done = [
    getActivePills() || isToolTypeUnsure() || vals('toolTypeOther'),
    vals('goalWho'),
    vals('inputFields'),
    vals('outputFormat'),
  ].filter(Boolean).length;
  return { done, total: 4 };
}

/* ── 組出 Prompt ── */
function buildPrompt() {
  const unsure = isToolTypeUnsure();
  const toolTypeFull = unsure
    ? '（我不確定，請依下方需求建議最適合的形式）'
    : [getActivePills(), vals('toolTypeOther')].filter(Boolean).join('（') + (vals('toolTypeOther') ? '）' : '');

  const sections = [];

  sections.push(`你是一位專業的軟體工程師、UIUX 設計師與系統分析師。`);
  if (unsure) {
    sections.push(`我不是工程師，不確定這個需求適合做成哪一種工具。請先根據下方需求，建議 1–2 種最適合的工具形式（例如：網頁工具、Chrome 外掛、LINE Bot、Google 試算表自動化、桌面應用程式），用白話說明為什麼適合、我需要準備什麼、有什麼限制。`);
    sections.push(`等我選定工具形式後，再釐清其餘需求（如有不完善之處，請提問或提出建議與我確認），確認後再開發工具並輸出完整可直接使用的程式碼。`);
  } else {
    sections.push(`請先釐清以下需求（如有不完善之處，請提問或提出建議與我確認），確認後再開發工具並輸出完整可直接使用的靜態網頁程式碼。`);
  }

  sections.push(`\n${'='.repeat(60)}`);
  sections.push(`【工具基本資訊】`);
  sections.push(`${'='.repeat(60)}`);
  sections.push(`工具類型：${toolTypeFull}`);
  sections.push(`工具名稱：${smart('toolName', '（還沒取名，請建議 2–3 個名字讓我選）')}`);

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
  const styleVal = DesignPref.getStyles().join('、');
  const colorVal = DesignPref.getColor();
  const fontVal = DesignPref.getFont();
  if (styleVal) sections.push(`風格偏好：${styleVal}`);
  else sections.push(`風格偏好：（不指定，請給一個乾淨易用的預設樣式）`);
  if (colorVal) sections.push(`配色：${colorVal}`);
  if (fontVal) sections.push(`字型：${fontVal}`);

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

  if (unsure) {
    sections.push(`- 依我們確認的工具形式輸出完整程式碼；若是網頁工具，請輸出單一 HTML 檔案（CSS 與 JavaScript 全部內嵌）`);
    sections.push(`- 若需要多個檔案，請逐一輸出，並說明各檔案的用途、存放位置與安裝或部署步驟`);
  } else if (isChrome) {
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

  return sections.join('\n');
}

function clearAll() {
  if (!confirm('確定要清除所有填寫內容嗎？')) return;
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.querySelectorAll('.tool-pill').forEach(p => p.classList.remove('active'));
  DesignPref.reset();
  localStorage.clear();
  resetOutput();
}

/* ── 帶入範例 ──
 * 範例文字放在這裡，欄位裡的灰字只留一行短提示。
 * 按「帶入範例」會把範例填進欄位，使用者改內容就好。
 */
const FIELD_EXAMPLES = {
  "inputFields": "- 商品名稱（文字）\n- 單價（數字，例如 1200）\n- 數量（數字，例如 3）\n- 是否含稅（是 / 否）",
  "outputFormat": "在頁面下方顯示一個結果區塊，包含：\n- 小計金額：8,000 元\n- 稅金（5%）：400 元\n- 總計：8,400 元\n\n並有一個「複製結果」按鈕。",
  "inputExample": "商品名稱：品牌 Logo 設計\n單價：8000\n數量：1\n是否含稅：否",
  "inputValidation": "- 單價必須是正整數\n- 數量最少 1，最多 999\n- 是否含稅只能選「是」或「否」",
  "inputMissing": "- 商品名稱空白：顯示錯誤「請填寫商品名稱」\n- 數量空白：自動帶入 1\n- 是否含稅空白：預設為「否」",
  "inputSource": "使用者直接在網頁表單手動輸入。\n或：從上傳的 Excel 檔案讀取。\n或：從網頁上複製貼上文字。",
  "outputExample": "=== 報價結果 ===\n商品：品牌 Logo 設計 × 1\n小計：8,000 元\n稅金：0 元（未稅）\n總計：8,000 元",
  "outputPrecision": "- 金額要加千分位逗號（8,000）\n- 小數點到整數位即可（不要出現 8000.00）\n- 幣別固定顯示「元」",
  "outputError": "- 輸入了文字但欄位要數字：顯示「請輸入數字金額」\n- 計算結果為負數：顯示「金額有誤，請重新檢查」",
  "rulesBiz": "- 稅率固定為 5%（不可讓使用者修改）\n- 數量超過 10 件，單價打 9 折\n- 國際訂單要另加運費 300 元\n- 每張報價單最多 20 項商品",
  "rulesNot": "- 不能讓使用者修改稅率\n- 不能儲存任何個人資料\n- 結果不能直接發送 Email（只能手動複製）\n- 不顯示小數點後的金額",
  "edgeEmpty": "顯示提示訊息「請先填寫商品名稱與單價」，\n並把空白的欄位標示為紅色，不執行計算。",
  "edgeInvalid": "- 單價填了「abc」：提示「請輸入數字」\n- 數量填了 -5：提示「數量不能為負數」\n- 數量填了 99999：提示「數量上限為 999」",
  "edgeConflict": "- 同時選了「含稅」又填了「稅率 0%」→ 以稅率欄位為主\n- 同時選了「海外訂單」又填了「台灣地址」→ 顯示提醒讓使用者確認",
  "edgeAmbiguous": "- 使用者在「商品名稱」欄位輸入了表情符號：正常顯示，不需阻擋\n- 貼上的文字包含換行：自動移除換行，合併成一行",
  "acCorrect": "✓ 輸入商品名稱「Logo 設計」、單價 8000、數量 1、未稅，\n  按下計算，顯示：小計 8,000 元、稅金 0 元、總計 8,000 元\n\n✓ 輸入數量 15 件，系統自動套用 9 折，顯示折扣後金額\n\n✓ 點擊「複製結果」，成功複製到剪貼簿",
  "acWrong": "✗ 輸入非數字金額，沒有顯示錯誤訊息就直接計算\n✗ 稅率可以被使用者手動修改\n✗ 計算結果出現小數點（例如 8400.0 元）\n✗ 空白送出後沒有任何提示",
  "acUX": "- 手機上也要能正常使用\n- 計算結果要明顯顯示，不要藏在頁面底部\n- 按鈕要夠大，手指點得到",
  "acExtra": "- 參考這個網站的計算邏輯：https://...\n- 風格希望簡單乾淨，不要太花\n- 先做最基本的版本就好，不需要登入功能"
};

function insertExample(id) {
  const el = document.getElementById(id);
  if (!el || !FIELD_EXAMPLES[id]) return;
  if (el.value.trim() && !confirm('要用範例取代你目前寫的內容嗎？')) return;
  el.value = FIELD_EXAMPLES[id];
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.focus();
}

function addExampleButtons() {
  Object.keys(FIELD_EXAMPLES).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'example-btn';
    btn.textContent = '帶入範例';
    btn.addEventListener('click', () => insertExample(id));
    el.insertAdjacentElement('afterend', btn);
  });
}

/* ── 細節區塊：顯示已填幾項 ── */
function countFilled(block) {
  let n = 0;
  block.querySelectorAll('input, textarea, select').forEach(el => {
    if (el.tagName === 'SELECT') {
      if (el.multiple ? el.selectedOptions.length > 0 : el.selectedIndex > 0) n++;
    } else if (el.value.trim()) {
      n++;
    }
  });
  return n;
}

function updateMoreCounts(openFilled) {
  document.querySelectorAll('.more-block').forEach(block => {
    const n = countFilled(block);
    const badge = block.querySelector('.more-count');
    if (badge) badge.textContent = n ? `已填 ${n} 項` : '';
    if (openFilled && n) block.open = true;
  });
}

document.addEventListener('input', e => { if (e.target.closest('.more-block')) updateMoreCounts(false); });
document.addEventListener('change', e => { if (e.target.closest('.more-block')) updateMoreCounts(false); });

/* ── Persistence ── */
const FIELDS = [
  'toolName','toolTypeOther',
  'goalWho','goalPain',
  'inputFields','inputExample','inputValidation','inputMissing','inputSource',
  'outputFormat','outputExample','outputPrecision','outputError',
  'rulesBiz','rulesNot',
  'edgeEmpty','edgeInvalid','edgeConflict','edgeAmbiguous',
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
  localStorage.setItem('tpg_design', JSON.stringify(DesignPref.getState()));
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
  try {
    const design = JSON.parse(localStorage.getItem('tpg_design') || 'null');
    if (design) DesignPref.setState(design);
  } catch (e) { /* 存檔格式不對就略過，用預設值 */ }
}

function manualSave() {
  saveAll();
  const toast = document.getElementById('toast');
  toast.textContent = '💾 已暫存';
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); toast.textContent = '✓ 已複製至剪貼簿'; }, 1800);
}

addExampleButtons();
DesignPref.init(document.getElementById('designPref'), {
  lang: 'zh',
  onChange: () => { resetOutput(); saveAll(); },
});
loadAll();
updateMoreCounts(true);

PromptSheet.init(document.getElementById('promptSheet'), {
  lang: 'zh',
  build: buildPrompt,
  check: checkPrompt,
  progress: promptProgress,
  emptyMarks: ['（請反問我問題協助我釐清）', '（還沒取名，請建議 2–3 個名字讓我選）'],
});

document.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('input', saveAll);
});

