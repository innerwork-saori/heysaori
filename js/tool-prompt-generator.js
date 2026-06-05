
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
  if (opt('goalPain')) sections.push(`現況痛點：\n${opt('goalPain')}`);

  sections.push(`\n${'='.repeat(60)}`);
  sections.push(`【INPUT — 使用者輸入】`);
  sections.push(`${'='.repeat(60)}`);
  sections.push(`輸入欄位：\n${smart('inputFields')}`);
  if (opt('inputExample')) sections.push(`填寫範例：\n${opt('inputExample')}`);
  if (opt('inputValidation')) sections.push(`欄位合法值限制：\n${opt('inputValidation')}`);
  if (opt('inputMissing')) sections.push(`欄位缺漏時的處理：\n${opt('inputMissing')}`);
  if (opt('inputSource')) sections.push(`資料來源：\n${opt('inputSource')}`);
  else sections.push(`資料來源：使用者在畫面上手動輸入`);

  sections.push(`\n${'='.repeat(60)}`);
  sections.push(`【OUTPUT — 輸出結果】`);
  sections.push(`${'='.repeat(60)}`);
  sections.push(`輸出格式與畫面：\n${smart('outputFormat')}`);
  if (opt('outputExample')) sections.push(`結果範例：\n${opt('outputExample')}`);
  if (opt('outputPrecision')) sections.push(`精準度與格式要求：\n${opt('outputPrecision')}`);
  if (opt('outputError')) sections.push(`錯誤或失敗時的回應：\n${opt('outputError')}`);

  sections.push(`\n${'='.repeat(60)}`);
  sections.push(`【RULES — 商業規則與限制】`);
  sections.push(`${'='.repeat(60)}`);
  if (opt('rulesBiz')) sections.push(`固定規則與計算邏輯：\n${opt('rulesBiz')}`);
  else sections.push(`固定規則與計算邏輯：（無特別規定，請依常識判斷）`);
  if (opt('rulesNot')) sections.push(`不能做的事：\n${opt('rulesNot')}`);

  sections.push(`\n${'='.repeat(60)}`);
  sections.push(`【EDGE CASES — 異常情況處理】`);
  sections.push(`${'='.repeat(60)}`);
  if (opt('edgeEmpty')) sections.push(`空白送出：\n${opt('edgeEmpty')}`);
  else sections.push(`空白送出：顯示友善提示訊息，標示必填欄位，不執行計算`);
  if (opt('edgeInvalid')) sections.push(`異常值：\n${opt('edgeInvalid')}`);
  else sections.push(`異常值：顯示清楚的錯誤提示，告知使用者正確輸入方式`);
  if (opt('edgeConflict')) sections.push(`資料衝突：\n${opt('edgeConflict')}`);
  if (opt('edgeAmbiguous')) sections.push(`模糊情境：\n${opt('edgeAmbiguous')}`);

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
  if (opt('acWrong')) sections.push(`做錯了的情境（不能出現）：\n${opt('acWrong')}`);
  if (opt('acUX')) sections.push(`視覺與體驗要求：\n${opt('acUX')}`);
  if (opt('acExtra')) sections.push(`其他補充：\n${opt('acExtra')}`);

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
    sections.push(`- 不需要後端伺服器，純前端即可運作`);
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
