
// ─── CODE 驗證 ────────────────────────────────────────────────────────────────
const VERIFY_GAS_URL = 'https://script.google.com/macros/s/AKfycbx0KnmS9mIl0UInXDGOOkLuQFlVhBkI0RnmdJtSof4EwUi9ZDKmH--JSVSlLfii5ECT/exec'; // ← 換成 verify.js 部署後的網址
const VERIFY_TOKEN   = 'saori-lv-2026-xK9mP';
const CODE_CACHE_KEY = 'lifevalue_code_auth_v1';
const CODE_VALID_DAYS = 14;

/** 檢查 localStorage 中是否有未過期的驗證記錄 */
function isCodeAuthorized() {
  try {
    const raw = localStorage.getItem(CODE_CACHE_KEY);
    if (!raw) return false;
    const cache = JSON.parse(raw);
    if (!cache || !cache.expiry) return false;
    return Date.now() < cache.expiry;
  } catch (e) { return false; }
}

/** 將驗證成功的結果存入 localStorage（14 天） */
function saveCodeAuth(userName) {
  const expiry = Date.now() + CODE_VALID_DAYS * 24 * 60 * 60 * 1000;
  try {
    localStorage.setItem(CODE_CACHE_KEY, JSON.stringify({ expiry, userName }));
  } catch (e) {}
}

/** 顯示 code modal，驗證成功後執行 callback */
let _codeCallback = null;
function showCodeModal(callback) {
  _codeCallback = callback;
  const modal = document.getElementById('code-modal-backdrop');
  const input = document.getElementById('code-input');
  const errEl = document.getElementById('code-error-msg');
  const btn   = document.getElementById('code-submit-btn');
  // 套用模式顏色
  btn.className = 'code-submit-btn' + (state.mode === 'work' ? ' wm' : '');
  errEl.textContent = '';
  input.value = '';
  input.classList.remove('error');
  modal.classList.add('show');
  setTimeout(() => input.focus(), 100);
}

function hideCodeModal() {
  document.getElementById('code-modal-backdrop').classList.remove('show');
  _codeCallback = null;
}

/** 送出 code 驗證（JSONP 方式，繞過 GAS CORS 限制） */
function submitCode() {
  const input = document.getElementById('code-input');
  const errEl = document.getElementById('code-error-msg');
  const btn   = document.getElementById('code-submit-btn');
  const code  = input.value.trim().toUpperCase();

  if (!code) {
    input.classList.add('error');
    errEl.textContent = '請輸入存取碼';
    setTimeout(() => input.classList.remove('error'), 600);
    return;
  }

  // 顯示 loading 狀態
  btn.disabled = true;
  btn.innerHTML = '<span class="code-spinner"></span>驗證中…';
  errEl.textContent = '';

  // 使用 JSONP 呼叫 GAS（繞過 CORS）
  const cbName = '_gasVerifyCb_' + Date.now();
  const script = document.createElement('script');
  let settled = false;

  const cleanup = () => {
    settled = true;
    delete window[cbName];
    if (script.parentNode) script.parentNode.removeChild(script);
    btn.disabled = false;
    btn.textContent = '驗證';
  };

  window[cbName] = function(result) {
    cleanup();
    if (result.ok) {
      saveCodeAuth(result.userName || '');
      hideCodeModal();
      showToast('✅ 驗證成功，歡迎繼續使用！請再次點選下一步。');
      if (_codeCallback) _codeCallback();
    } else {
      input.classList.add('error');
      setTimeout(() => input.classList.remove('error'), 600);
      const msgs = {
        invalid_code:   '存取碼無效，請確認後重新輸入。',
        code_expired:   `存取碼已於 ${result.expiredAt || ''} 過期，請聯絡 Saori 更新。`,
        missing_code:   '請輸入存取碼。',
        unauthorized:   '驗證失敗，請稍後再試。',
        sheet_not_found:'系統設定錯誤，請聯絡管理員。',
        server_error:   '伺服器錯誤，請稍後再試。'
      };
      errEl.textContent = msgs[result.error] || '驗證失敗，請稍後再試。';
    }
  };

  // 逾時處理（10 秒）
  const timeout = setTimeout(() => {
    if (!settled) {
      cleanup();
      errEl.textContent = '連線逾時，請檢查網路後再試。';
    }
  }, 10000);

  const url = `${VERIFY_GAS_URL}?callback=${cbName}&token=${encodeURIComponent(VERIFY_TOKEN)}&code=${encodeURIComponent(code)}`;
  script.crossOrigin = 'anonymous'; // 不帶 cookie，避免 Google 插入 /u/1/
  script.src = url;
  script.onerror = () => {
    clearTimeout(timeout);
    cleanup();
    errEl.textContent = '連線失敗，請稍後再試。';
  };
  document.head.appendChild(script);
}

/** Inline 驗證（step 1 欄位用），成功後執行 callback */
function submitInlineCode(code, callback) {
  const codeInput = document.getElementById('inline-code-input');
  const codeBlock = document.getElementById('code-inline-block');
  const codeErr   = document.getElementById('inline-code-error');
  const nextBtn   = document.getElementById('nav-next');

  // 顯示遮罩
  const overlay = document.getElementById('loading-overlay');
  const overlayText = overlay?.querySelector('.loading-text');
  if (overlayText) overlayText.textContent = '驗證中，請稍候…';
  if (overlay) overlay.classList.add('show');

  if (nextBtn) { nextBtn.disabled = true; nextBtn.textContent = '驗證中…'; }
  codeErr.textContent = '';

  const cbName = '_gasVerifyCb_' + Date.now();
  const script = document.createElement('script');
  let settled = false;

  const cleanup = () => {
    settled = true;
    delete window[cbName];
    if (script.parentNode) script.parentNode.removeChild(script);
    if (nextBtn) { nextBtn.disabled = false; nextBtn.textContent = '下一步：篩選排序 →'; }
  };

  window[cbName] = function(result) {
    cleanup();
    // 隱藏遮罩
    if (overlay) overlay.classList.remove('show');
    
    if (result.ok) {
      saveCodeAuth(result.userName || '');
      // 顯示已驗證 badge，隱藏輸入框
      if (codeInput) codeInput.style.display = 'none';
      const badge = document.getElementById('inline-code-verified-badge');
      if (badge) badge.style.display = 'inline-block';
      if (callback) callback();
    } else {
      codeBlock.classList.add('error');
      setTimeout(() => codeBlock.classList.remove('error'), 1500);
      const msgs = {
        invalid_code:   '存取碼無效，請確認後重新輸入。',
        code_expired:   `存取碼已過期，請聯絡 Saori 更新。`,
        missing_code:   '請輸入存取碼。',
        unauthorized:   '驗證失敗，請稍後再試。',
        sheet_not_found:'系統設定錯誤，請聯絡管理員。',
        server_error:   '伺服器錯誤，請稍後再試。'
      };
      codeErr.textContent = msgs[result.error] || '驗證失敗，請稍後再試。';
      if (codeInput) codeInput.focus();
    }
  };

  const timeout = setTimeout(() => {
    if (!settled) { cleanup(); codeErr.textContent = '連線逾時，請檢查網路後再試。'; }
  }, 10000);

  const url = `${VERIFY_GAS_URL}?callback=${cbName}&token=${encodeURIComponent(VERIFY_TOKEN)}&code=${encodeURIComponent(code)}`;
  script.crossOrigin = 'anonymous';
  script.src = url;
  script.onerror = () => {
    clearTimeout(timeout);
    cleanup();
    codeErr.textContent = '連線失敗，請稍後再試。';
  };
  document.head.appendChild(script);
}

// 點擊背景關閉 modal（不強制，讓使用者可以取消）
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('code-modal-backdrop').addEventListener('click', function(e) {
    if (e.target === this) hideCodeModal();
  });
});

// ─── CARD DATA ───────────────────────────────────────────────────────────────
const ALL_CARDS = [
  {id:'1',sn:1,name:'享受生活與美食',cat:'自我與生活'},
  {id:'2',sn:2,name:'有趣的人事物',cat:'自我與生活'},
  {id:'3',sn:3,name:'忠於自我',cat:'自我與生活'},
  {id:'4',sn:4,name:'自由自在不受拘束',cat:'自我與生活'},
  {id:'5',sn:5,name:'內在的平靜',cat:'自我與生活'},
  {id:'6',sn:6,name:'對生命、人性或人生的洞察智慧',cat:'自我與生活'},
  {id:'7',sn:7,name:'保持潔淨身體、心靈或環境',cat:'自我與生活'},
  {id:'8',sn:8,name:'健康的身體與心靈',cat:'自我與生活'},
  {id:'9',sn:9,name:'保有隱私不受人打擾',cat:'自我與生活'},
  {id:'10',sn:10,name:'追求真理與知性',cat:'自我與生活'},
  {id:'11',sn:11,name:'自我肯定 喜歡自己',cat:'自我與生活'},
  {id:'12',sn:12,name:'自我表達與呈現',cat:'自我與生活'},
  {id:'13',sn:13,name:'舒適的環境',cat:'自我與生活'},
  {id:'14',sn:14,name:'信仰、宗教或靈性的生活',cat:'自我與生活'},
  {id:'15',sn:15,name:'平凡的生活',cat:'自我與生活'},
  {id:'16',sn:16,name:'能親近大自然',cat:'自我與生活'},
  {id:'17',sn:17,name:'規律的生活',cat:'自我與生活'},
  {id:'18',sn:18,name:'有獨處的空間',cat:'自我與生活'},
  {id:'19',sn:19,name:'低調 不張揚',cat:'自我與生活'},
  {id:'20',sn:20,name:'忠誠',cat:'美德'},
  {id:'21',sn:21,name:'國家主權 民族意識',cat:'美德'},
  {id:'22',sn:22,name:'不欺騙 不說謊',cat:'美德'},
  {id:'23',sn:23,name:'不要傷害別人',cat:'美德'},
  {id:'24',sn:24,name:'知恩圖報',cat:'美德'},
  {id:'25',sn:25,name:'真誠一致',cat:'美德'},
  {id:'26',sn:26,name:'全人類的福祉',cat:'美德'},
  {id:'27',sn:27,name:'尊重傳統延續歷史',cat:'美德'},
  {id:'28',sn:28,name:'公平正義',cat:'美德'},
  {id:'29',sn:29,name:'保護環境或動植物',cat:'美德'},
  {id:'30',sn:30,name:'社會公益 關懷弱勢',cat:'美德'},
  {id:'31',sn:31,name:'交友廣闊',cat:'人際關係'},
  {id:'32',sn:32,name:'愛與被愛',cat:'人際關係'},
  {id:'33',sn:33,name:'歸屬與認同屬於某個身份或團體',cat:'人際關係'},
  {id:'34',sn:34,name:'能彼此尊重',cat:'人際關係'},
  {id:'35',sn:35,name:'獲得父母認同',cat:'人際關係'},
  {id:'36',sn:36,name:'有一個安穩的家',cat:'人際關係'},
  {id:'37',sn:37,name:'深刻友誼',cat:'人際關係'},
  {id:'38',sn:38,name:'人際和諧',cat:'人際關係'},
  {id:'39',sn:39,name:'有小孩',cat:'人際關係'},
  {id:'40',sn:40,name:'能好好照顧家人',cat:'人際關係'},
  {id:'41',sn:41,name:'有伙伴一起打拼',cat:'工作'},
  {id:'42',sn:42,name:'解決他人的問題幫助他人成長',cat:'工作'},
  {id:'43',sn:43,name:'對他人社會有影響力',cat:'工作'},
  {id:'44',sn:44,name:'負責 勇於承擔責任',cat:'工作'},
  {id:'45',sn:45,name:'資產與金錢',cat:'工作'},
  {id:'46',sn:46,name:'晉升的機會與速度',cat:'工作'},
  {id:'47',sn:47,name:'擁有自己的事業',cat:'工作'},
  {id:'48',sn:48,name:'權威身份 擁有特定地位職權',cat:'工作'},
  {id:'49',sn:49,name:'社會認可 受人尊重肯定',cat:'工作'},
  {id:'50',sn:50,name:'有效率 有效能',cat:'工作'},
  {id:'51',sn:51,name:'領導團隊',cat:'工作'},
  {id:'52',sn:52,name:'務實 重視可行性',cat:'工作'},
  {id:'53',sn:53,name:'能被看見 有舞台能發光',cat:'工作'},
  {id:'54',sn:54,name:'清楚的流程與規範',cat:'工作'},
  {id:'55',sn:55,name:'隨遇而安 順勢而為',cat:'工作'},
  {id:'56',sn:56,name:'工作穩定性',cat:'工作'},
  {id:'57',sn:57,name:'工作生活平衡',cat:'工作'},
  {id:'58',sn:58,name:'發揮自己的天賦能力',cat:'工作'},
  {id:'59',sn:59,name:'追求美感或藝術',cat:'工作'},
  {id:'60',sn:60,name:'專業',cat:'工作'},
  {id:'61',sn:61,name:'創新與創造',cat:'工作'},
  {id:'62',sn:62,name:'追求工作品質',cat:'工作'},
  {id:'63',sn:63,name:'獨立自主',cat:'工作'},
  {id:'64',sn:64,name:'邏輯清晰',cat:'工作'},
  {id:'65',sn:65,name:'能持續自我成長',cat:'工作'},
  {id:'66',sn:66,name:'安全感 工作上或心理面可預測或可掌控',cat:'工作'},
  {id:'67',sn:67,name:'冒險挑戰',cat:'工作'},
  {id:'68',sn:68,name:'有明確的目標或方向',cat:'工作'},
  {id:'69',sn:69,name:'有成就感',cat:'工作'},
  {id:'70',sn:70,name:'有秩序與穩定的環境',cat:'工作'}
];

const WORK_IDS = ['41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70'];

const CAT_COLORS = {
  '自我與生活': '#4a7c6f',
  '美德': '#5a6ea0',
  '人際關係': '#c8502a',
  '工作': '#d4a84b'
};

// ─── STATE ───────────────────────────────────────────────────────────────────
const STATE_KEY = 'lifevalue_state_v2';
let state = {
  mode: null,
  step: 0,
  userName: '',
  cards: [],          // [{id, status:'important'|'unimportant'|'none'}]
  selected: [],       // [id] up to 20
  ranked: [],         // [id] ordered, top 10 are the top10
  reasons: {},        // {id: string}
  satisfaction: {},   // {id: number 1-10}
  createdAt: null
};

function saveState() {
  const nameVal = document.getElementById('user-name')?.value?.trim();
  if (nameVal) state.userName = nameVal;
  try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch(e){}
}

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e){}
  return null;
}

function clearState() {
  localStorage.removeItem(STATE_KEY);
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const saved = loadState();
  if (saved && saved.mode && saved.step > 0) {
    const resumeSection = document.getElementById('resume-section');
    const modeSelectSection = document.getElementById('mode-select-section');
    if (resumeSection) resumeSection.style.display = 'block';
    if (modeSelectSection) modeSelectSection.style.display = 'none';
    const meta = document.getElementById('resume-meta');
    if (meta) {
      const modeLabel = saved.mode === 'work' ? '工作價值觀探索' : '人生價值觀探索';
      const stepLabel = saved.step >= 5 ? '已完成探索' : `進度：Step 0${saved.step}`;
      const nameLabel = saved.userName ? `${saved.userName}・` : '';
      meta.textContent = `${nameLabel}${modeLabel}・${stepLabel}`;
    }
  }

  const fileInput = document.getElementById('lv-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const data = JSON.parse(evt.target.result);
          if (!validateImportJSON(data)) { showToast('格式不符，請確認檔案為本工具匯出的 JSON'); return; }
          localStorage.setItem(STATE_KEY, JSON.stringify(data));
          location.reload();
        } catch(err) { showToast('檔案讀取失敗，請重試'); }
      };
      reader.onerror = () => showToast('檔案讀取失敗，請重試');
      reader.readAsText(file, 'utf-8');
      e.target.value = '';
    });
  }
});

function restoreState() {
  const saved = loadState();
  if (!saved) return;
  state = saved;
  applyMode(state.mode);
  syncAllBadges();
  if (state.step === 5) {
    // restore result page
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('result').classList.add('active');
    renderResult();
    updateNavBar(5);
    window.scrollTo(0,0);
  } else {
    goToStep(state.step);
  }
}

// 一次更新所有 tab 的進度說明（restore 後呼叫）
function syncAllBadges() {
  // Tab 1：重要幾張
  const impN = state.cards.filter(c => c.status === 'important').length;
  const t1 = document.getElementById('tab1-count');
  if (t1) t1.textContent = `重要 ${impN} 張`;

  // Tab 2：已選幾張
  const selN = state.selected.length;
  const t2 = document.getElementById('tab2-count');
  if (t2) t2.textContent = selN >= 10 ? `已選 ${selN} 張` : (selN > 0 ? `已選 ${selN} 張` : '等待篩選');

  // Tab 3：原因說明填了幾個
  const top10 = state.ranked.slice(0, 10);
  const filled = top10.filter(id => (state.reasons[id]||'').length >= 10).length;
  const t3 = document.getElementById('tab3-count');
  if (t3) t3.textContent = filled === 10 ? '已完成' : (filled > 0 ? `已填 ${filled}/10` : '等待填寫');

  // Tab 4：滿意度評了幾個
  const rated = top10.filter(id => state.satisfaction[id] !== undefined && state.satisfaction[id] !== null).length;
  const t4 = document.getElementById('tab4-count');
  if (t4) t4.textContent = rated === 10 ? '已完成' : (rated > 0 ? `已評 ${rated}/10` : '等待評分');
  
  // 更新 progress badges
  updateProgressBadges();
}

function dismissRestore() {
  clearState();
  state = { mode:null, step:0, userName:'', cards:[], selected:[], ranked:[], reasons:{}, satisfaction:{}, createdAt:null };
  document.getElementById('restore-banner').style.display = 'none';
  document.getElementById('progress-bar').classList.remove('visible');
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('mode-screen').style.display = 'block';
  window.scrollTo(0,0);
}

function resumeExploration() {
  restoreState();
}

function startFresh() {
  if (confirm('確定要重新開始嗎？目前的探索進度將會清除。')) {
    clearState();
    state = { mode:null, step:0, userName:'', cards:[], selected:[], ranked:[], reasons:{}, satisfaction:{}, createdAt:null };
    const resumeSection = document.getElementById('resume-section');
    const modeSelectSection = document.getElementById('mode-select-section');
    if (resumeSection) resumeSection.style.display = 'none';
    if (modeSelectSection) modeSelectSection.style.display = 'block';
  }
}

function triggerImportJSON() {
  const input = document.getElementById('lv-file-input');
  if (input) input.click();
}

function validateImportJSON(data) {
  if (!data || typeof data !== 'object') return false;
  return ['mode', 'step', 'cards', 'selected', 'ranked', 'reasons', 'satisfaction'].every(
    f => Object.prototype.hasOwnProperty.call(data, f)
  );
}

function exportJSON() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const exportObj = {
    version: '1.0',
    exportedAt: now.toISOString(),
    mode: state.mode,
    step: state.step,
    userName: state.userName,
    cards: state.cards,
    selected: state.selected,
    ranked: state.ranked,
    reasons: state.reasons,
    satisfaction: state.satisfaction,
    createdAt: state.createdAt
  };
  const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `價值觀探索_${state.userName || 'result'}_${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('已匯出 JSON 檔案');
}

// ─── MODE ─────────────────────────────────────────────────────────────────────
function startMode(mode) {
  const savedName = state.userName || document.getElementById('user-name')?.value?.trim() || '';
  // 保留跨模式共用的原因與滿意度（key 是 card id，兩個模式共用）
  const savedReasons = { ...state.reasons };
  const savedSatisfaction = { ...state.satisfaction };
  clearState();
  state = {
    mode, step: 1, userName: savedName,
    cards: [], selected: [], ranked: [],
    reasons: savedReasons,
    satisfaction: savedSatisfaction,
    createdAt: null
  };
  const pool = mode === 'work'
    ? ALL_CARDS.filter(c => WORK_IDS.includes(c.id))
    : ALL_CARDS;
  state.cards = pool.map(c => ({ id: c.id, status: 'none' }));
  saveState();
  applyMode(mode);
  goToStep(1);
}

function applyMode(mode) {
  document.getElementById('mode-screen').style.display = 'none';
  const pb = document.getElementById('progress-bar');
  pb.classList.add('visible');
  const badge = document.getElementById('mode-badge');
  if (mode === 'work') {
    badge.textContent = '💼 工作模式';
    badge.className = 'mode-badge work';
    pb.classList.add('mode-work');
    document.querySelectorAll('.nav-btn.primary').forEach(b => b.classList.add('wm'));
    document.querySelectorAll('.count-badge').forEach(b => b.classList.add('work-c'));
  } else {
    badge.textContent = '🌿 人生模式';
    badge.className = 'mode-badge full';
    pb.classList.remove('mode-work');
    document.querySelectorAll('.nav-btn.primary').forEach(b => b.classList.remove('wm'));
    document.querySelectorAll('.count-badge').forEach(b => b.classList.remove('work-c'));
  }
}

function backToModeSelect() {
  // 保留資料，直接回到模式選擇，不清空也不詢問
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('progress-bar').classList.remove('visible');
  document.getElementById('mode-screen').style.display = 'block';
  document.getElementById('sticky-nav').classList.remove('visible');
  window.scrollTo(0,0);
}

// ─── STICKY NAV BAR ───────────────────────────────────────────────────────────
function updateNavBar(step) {
  const bar    = document.getElementById('sticky-nav');
  const back   = document.getElementById('nav-back');
  const next   = document.getElementById('nav-next');
  const isWork = state.mode === 'work';

  // reset wm class on next button
  next.classList.toggle('wm', isWork);

  const cfg = {
    1: { backShow: false, nextLabel: '下一步：篩選排序 →', nextFn: 'goToStep2()' },
    2: { backShow: true,  backFn: 'goToStep(1)', backLabel: '← 返回修改', nextLabel: '下一步：原因說明 →', nextFn: 'goToStep3()' },
    3: { backShow: true,  backFn: 'goToStep(2)', backLabel: '← 返回修改', nextLabel: '下一步：滿意度評分 →', nextFn: 'goToStep4()' },
    4: { backShow: true,  backFn: 'goToStep(3)', backLabel: '← 返回修改', nextLabel: '查看結果 →', nextFn: 'goToResult()' },
    5: { backShow: true,  backFn: 'goToStep(4)', backLabel: '← 返回修改', nextLabel: '重新探索', nextFn: 'backToModeSelect()' },
  };

  const c = cfg[step];
  if (!c) { bar.classList.remove('visible'); return; }

  back.style.display = c.backShow ? '' : 'none';
  if (c.backShow) {
    back.textContent = c.backLabel;
    back.setAttribute('onclick', c.backFn);
  }
  next.textContent = c.nextLabel;
  next.setAttribute('onclick', c.nextFn);
  bar.classList.add('visible');
}

// ─── STEP NAVIGATION ──────────────────────────────────────────────────────────
function goToStep(n) {
  // 不管哪種模式，往前推進時都必須先填姓名
  if (n > 1) {
    const name = document.getElementById('user-name')?.value?.trim() || state.userName;
    if (!name) {
      const nameBlock = document.getElementById('name-block');
      nameBlock.classList.add('error');
      nameBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => nameBlock.classList.remove('error'), 1500);
      showToast('請先填寫你的姓名');
      // 強制跳回 Step 1
      goToStep(1);
      return;
    }
    state.userName = name;
  }

  // ── Step 2 以上需要 code 驗證（tab 直接跳也會被擋）──
  if (n >= 2 && !isCodeAuthorized()) {
    const codeInput = document.getElementById('inline-code-input');
    const codeBlock = document.getElementById('code-inline-block');
    const codeErr   = document.getElementById('inline-code-error');
    const code = codeInput?.value?.trim().toUpperCase() || '';
    if (code) {
      // 有填 code，直接送驗證
      submitInlineCode(code, () => goToStep(n));
      return;
    }
    // 沒填 code：跳回 step 1，捲到驗證碼欄位並提示
    goToStep(1);
    setTimeout(() => {
      if (codeBlock) {
        codeBlock.classList.add('error');
        setTimeout(() => codeBlock.classList.remove('error'), 1500);
        codeBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (codeErr) codeErr.textContent = '請先輸入存取碼才能繼續';
      if (codeInput) codeInput.focus();
    }, 50);
    return;
  }

  // ── 前置步驟資料檢查（防止 tab 跳步）──
  if (n >= 3 && state.ranked.length < 10) {
    showToast('請先完成 Step 2 的篩選排序');
    goToStep(2);
    return;
  }
  // Step 3 validation removed - users can proceed freely

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step-tab').forEach((t,i) => {
    t.classList.toggle('active', i+1 === n);
  });
  const ids = ['step1','step2','step3','step4','result'];
  const target = n <= 4 ? ids[n-1] : 'result';
  document.getElementById(target).classList.add('active');
  state.step = n;
  saveState();
  updateNavBar(n);
  window.scrollTo(0,0);

  if (n === 1) renderStep1();
  if (n === 2) renderStep2();
  if (n === 3) renderStep3();
  if (n === 4) renderStep4();
  
  // 更新 progress badges
  updateProgressBadges();
}

// ─── STEP 1 ───────────────────────────────────────────────────────────────────
function getCard(id) { return ALL_CARDS.find(c => c.id === id); }
function getCardState(id) { return state.cards.find(c => c.id === id); }

function renderStep1() {
  const nameEl = document.getElementById('user-name');
  if (nameEl) nameEl.value = state.userName || '';

  // 已驗證：隱藏輸入框，顯示 badge
  const codeInput = document.getElementById('inline-code-input');
  const badge     = document.getElementById('inline-code-verified-badge');
  if (isCodeAuthorized()) {
    if (codeInput) codeInput.style.display = 'none';
    if (badge) badge.style.display = 'inline-block';
  } else {
    if (codeInput) codeInput.style.display = '';
    if (badge) badge.style.display = 'none';
  }

  const pool = state.cards.map(c => getCard(c.id));
  const cats = [...new Set(pool.map(c => c.cat))];
  const container = document.getElementById('step1-cards');
  container.innerHTML = '';

  cats.forEach(cat => {
    const cards = pool.filter(c => c.cat === cat);
    const block = document.createElement('div');
    block.className = 'category-block';
    block.innerHTML = `<div class="category-label" style="border-color:${CAT_COLORS[cat]||'var(--accent3)'}">${cat}</div>
      <div class="card-grid" id="cat-grid-${cat.replace(/\s/g,'_')}"></div>`;
    container.appendChild(block);
    const grid = block.querySelector('.card-grid');
    cards.forEach(card => {
      grid.appendChild(buildValCard(card));
    });
  });
  updateImpBadge();
}

function buildValCard(card) {
  const cs = getCardState(card.id);
  const status = cs ? cs.status : 'none';
  const div = document.createElement('div');
  div.className = 'val-card' + (status==='important'?' important':'');
  div.id = 'vcard-' + card.id;
  div.innerHTML = `
    <div class="card-top-row">
      <span class="card-sn">SN ${card.sn}</span>
    </div>
    <div class="card-name">${card.name}</div>
    <div class="card-cat-badge" style="background:${CAT_COLORS[card.cat]||'var(--accent3)'}22;color:${CAT_COLORS[card.cat]||'var(--accent3)'};border-color:${CAT_COLORS[card.cat]||'var(--accent3)'}44">${card.cat}</div>
    <div class="card-actions">
      <button class="btn-imp${status==='important'?' imp-active':''}" onclick="markCard('${card.id}','important')">⭐ 重要</button>
    </div>`;
  return div;
}

function markCard(id, status) {
  const cs = getCardState(id);
  if (!cs) return;
  cs.status = cs.status === status ? 'none' : status;
  const card = getCard(id);
  const el = document.getElementById('vcard-' + id);
  if (el) {
    el.className = 'val-card' + (cs.status==='important'?' important':'');
    el.querySelector('.btn-imp').className = 'btn-imp' + (cs.status==='important'?' imp-active':'');
  }
  updateImpBadge();
  saveState();
}

function updateImpBadge() {
  const n = state.cards.filter(c => c.status==='important').length;
  const tab = document.getElementById('tab1-count');
  if (tab) tab.textContent = `重要 ${n} 張`;
  updateProgressBadges();
}

function updateProgressBadges() {
  const container = document.getElementById('progress-badges');
  if (!container) return;
  container.innerHTML = '';
  
  const step = state.step;
  const isWork = state.mode === 'work';
  
  if (step === 1) {
    const n = state.cards.filter(c => c.status==='important').length;
    const badge = document.createElement('div');
    badge.className = 'progress-count-badge' + (n>=10?' good':'') + (isWork?' work-c':'');
    badge.textContent = `重要 ${n} 張`;
    container.appendChild(badge);
  } else if (step === 2) {
    const selN = state.selected.length;
    const badge = document.createElement('div');
    badge.className = 'progress-count-badge' + (selN>=10?' good':'') + (isWork?' work-c':'');
    badge.textContent = `已選 ${selN} / 20`;
    container.appendChild(badge);
  } else if (step === 3) {
    const top10 = state.ranked.slice(0, 10);
    const filled = top10.filter(id => (state.reasons[id]||'').length >= 10).length;
    const badge = document.createElement('div');
    badge.className = 'progress-count-badge' + (filled===10?' good':'') + (isWork?' work-c':'');
    badge.textContent = `已填 ${filled} / 10`;
    container.appendChild(badge);
  } else if (step === 4) {
    const top10 = state.ranked.slice(0, 10);
    const rated = top10.filter(id => state.satisfaction[id] !== undefined && state.satisfaction[id] !== null).length;
    const badge = document.createElement('div');
    badge.className = 'progress-count-badge' + (rated===10?' good':'') + (isWork?' work-c':'');
    badge.textContent = `已評 ${rated} / 10`;
    container.appendChild(badge);
  }
}

function bulkMark(action) {
  if (action === 'reset') {
    state.cards.forEach(c => c.status = 'none');
    renderStep1();
    saveState();
  }
}

function goToStep2() {
  const name = document.getElementById('user-name')?.value?.trim() || state.userName;
  const nameBlock = document.getElementById('name-block');
  if (!name) {
    nameBlock.classList.add('error');
    nameBlock.scrollIntoView({behavior:'smooth', block:'center'});
    setTimeout(() => nameBlock.classList.remove('error'), 1500);
    showToast('請先填寫你的姓名');
    return;
  }
  state.userName = name;

  // ── 驗證存取碼（若尚未驗過）──
  if (!isCodeAuthorized()) {
    const codeInput = document.getElementById('inline-code-input');
    const codeBlock = document.getElementById('code-inline-block');
    const codeErr   = document.getElementById('inline-code-error');
    const code = codeInput?.value?.trim().toUpperCase() || '';
    if (!code) {
      codeBlock.classList.add('error');
      codeErr.textContent = '請輸入存取碼才能繼續';
      codeInput?.focus();
      codeBlock.scrollIntoView({behavior:'smooth', block:'center'});
      setTimeout(() => codeBlock.classList.remove('error'), 1500);
      return;
    }
    // 送出驗證，成功後再繼續
    submitInlineCode(code, () => goToStep2());
    return;
  }
  const impCount = state.cards.filter(c => c.status==='important').length;
  if (impCount < 10) {
    document.getElementById('warn-min10').classList.add('show');
    showToast('請至少標記 10 張重要卡片');
    return;
  }
  document.getElementById('warn-min10').classList.remove('show');
  // sync selected: remove any that are no longer important
  state.selected = state.selected.filter(id => {
    const cs = getCardState(id);
    return cs && cs.status === 'important';
  });
  saveState();
  goToStep(2);
}

// ─── STEP 2 ───────────────────────────────────────────────────────────────────
function renderStep2() {
  const importantCards = state.cards
    .filter(c => c.status === 'important')
    .map(c => getCard(c.id));

  // ★ 如果重要卡片 ≤ 20 張，自動全選
  if (importantCards.length <= 20 && state.selected.length === 0) {
    state.selected = importantCards.map(c => c.id);
    saveState();
  }

  // Step 2-1: selection grid
  const grid = document.getElementById('step2-sel-grid');
  grid.innerHTML = '';
  importantCards.forEach(card => {
    const isSelected = state.selected.includes(card.id);
    const div = document.createElement('div');
    div.className = 'step2-sel-card' + (isSelected ? ' selected' : '');
    div.id = 'sel-card-' + card.id;
    div.onclick = () => toggleSelect(card.id);
    div.innerHTML = `
      <div class="check-box">${isSelected ? '✓' : ''}</div>
      <div class="card-info">
        <div class="name">SN${card.sn} ${card.name}</div>
        <div class="cat" style="color:${CAT_COLORS[card.cat]||'var(--muted)'}">${card.cat}</div>
      </div>`;
    grid.appendChild(div);
  });
  updateSelBadge();

  // Step 2-2: sort section
  if (state.selected.length >= 10) {
    showSortSection();
  } else {
    document.getElementById('step2-sort-section').style.display = 'none';
  }
}

function toggleSelect(id) {
  const idx = state.selected.indexOf(id);
  if (idx >= 0) {
    state.selected.splice(idx, 1);
  } else {
    if (state.selected.length >= 20) {
      document.getElementById('warn-sel-max').classList.add('show');
      setTimeout(() => document.getElementById('warn-sel-max').classList.remove('show'), 2500);
      showToast('最多只能選擇 20 張');
      return;
    }
    state.selected.push(id);
  }
  // Step 2-1 有任何修改，ranked 全部 reset，強迫重新排序
  state.ranked = [];
  document.getElementById('warn-sel-max').classList.remove('show');
  const el = document.getElementById('sel-card-' + id);
  if (el) {
    const isNowSelected = state.selected.includes(id);
    el.className = 'step2-sel-card' + (isNowSelected ? ' selected' : '');
    el.querySelector('.check-box').textContent = isNowSelected ? '✓' : '';
  }
  updateSelBadge();
  if (state.selected.length >= 10) {
    showSortSection();
  } else {
    document.getElementById('step2-sort-section').style.display = 'none';
  }
  saveState();
}

function updateSelBadge() {
  const n = state.selected.length;
  const tab = document.getElementById('tab2-count');
  if (tab) tab.textContent = n >= 10 ? `已選 ${n} 張` : `等待篩選`;
  updateProgressBadges();
}

function showSortSection() {
  const section = document.getElementById('step2-sort-section');
  section.style.display = 'block';
  // ranked 只保留仍在 selected 中的 id（已排序的保留順序）
  state.ranked = state.ranked.filter(id => state.selected.includes(id));
  // 未排序的卡片（不在 ranked 中）放在 unranked 區，不自動加入 ranked
  renderDragList();
}

// ─── DRAG & DROP (Step 2-2) ───────────────────────────────────────────────────
let dragSrcIdx = null;

function renderDragList() {
  const rankedZone   = document.getElementById('ranked-zone');
  const unrankedZone = document.getElementById('unranked-zone');
  if (!rankedZone || !unrankedZone) return;
  rankedZone.innerHTML   = '';
  unrankedZone.innerHTML = '';

  const unranked = state.selected.filter(id => !state.ranked.includes(id));
  const allItems = [...state.ranked, ...unranked];

  // ── 給 ranked-zone 本身加 dragover/drop，讓空白區域也能接收 ──
  rankedZone.ondragover = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    rankedZone.style.borderColor = 'var(--accent3)';
    rankedZone.style.background  = 'rgba(212,168,75,.06)';
  };
  rankedZone.ondragleave = () => {
    rankedZone.style.borderColor = 'transparent';
    rankedZone.style.background  = '';
  };
  rankedZone.ondrop = (e) => {
    e.preventDefault();
    rankedZone.style.borderColor = 'transparent';
    rankedZone.style.background  = '';
    if (dragSrcIdx === null) return;
    const unrankedNow = state.selected.filter(id => !state.ranked.includes(id));
    const all = [...state.ranked, ...unrankedNow];
    const srcWasRanked = dragSrcIdx < state.ranked.length;
    // drop 到 ranked-zone 空白 → 加到 ranked 末尾
    if (!srcWasRanked) {
      const movedId = all[dragSrcIdx];
      state.ranked.push(movedId);
      saveState(); renderDragList();
    }
  };

  allItems.forEach((id, idx) => {
    const card = getCard(id);
    const isRanked = idx < state.ranked.length;
    const rankNum  = idx + 1;
    const item = document.createElement('div');
    item.className = 'drag-item';
    item.draggable = true;
    item.dataset.id  = id;
    item.dataset.idx = idx;
    item.innerHTML = `
      <div class="drag-rank ${isRanked ? (rankNum <= 10 ? 'top10' : 'below10') : 'below10'}" style="${!isRanked ? 'background:var(--border);color:var(--muted)' : ''}">${isRanked ? rankNum : '—'}</div>
      <div class="drag-handle">⠿</div>
      <div style="flex:1">
        <div class="drag-name">${card.name}</div>
        <div class="drag-cat" style="color:${CAT_COLORS[card.cat]||'var(--muted)'}">${card.cat}</div>
      </div>`;
    item.addEventListener('dragstart', onDragStart);
    item.addEventListener('dragenter', onDragEnter);
    item.addEventListener('dragover',  onDragOver);
    item.addEventListener('dragleave', onDragLeave);
    item.addEventListener('drop',      onDrop);
    item.addEventListener('dragend',   onDragEnd);
    item.addEventListener('touchstart', onTouchStart, {passive:true});
    item.addEventListener('touchmove',  onTouchMove,  {passive:false});
    item.addEventListener('touchend',   onTouchEnd);

    if (isRanked) {
      rankedZone.appendChild(item);
    } else {
      unrankedZone.appendChild(item);
    }
  });

  updateSortHint();
}

function updateSortHint() {
  const unranked = state.selected.filter(id => !state.ranked.includes(id));
  const hint = document.getElementById('sort-hint');
  if (hint) {
    const top10Count = Math.min(state.ranked.length, 10);
    hint.textContent = top10Count >= 10
      ? `✅ 已排好 Top 10，可以繼續`
      : `請將卡片拖曳到虛線上方排序（已排 ${top10Count} / 10）`;
    hint.style.color = top10Count >= 10 ? 'var(--accent2)' : 'var(--muted)';
  }
}

function onDragStart(e) {
  dragSrcIdx = parseInt(e.currentTarget.dataset.idx);
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragSrcIdx.toString());
}
function onDragEnter(e) {
  e.preventDefault();
  e.stopPropagation();
  if (!e.currentTarget.classList.contains('dragging')) {
    e.currentTarget.classList.add('drag-over');
  }
}
function onDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = 'move';
  return false;
}
function onDragLeave(e) {
  // 只在真正離開元素時移除（不是進入子元素）
  if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove('drag-over');
  }
}
function onDrop(e) {
  e.preventDefault();
  e.stopPropagation(); // 避免觸發 ranked-zone 的 ondrop
  e.currentTarget.classList.remove('drag-over');
  
  const targetIdx = parseInt(e.currentTarget.dataset.idx);
  if (dragSrcIdx === null || dragSrcIdx === targetIdx) return;

  // 重建 allItems（ranked + unranked）
  const unranked = state.selected.filter(id => !state.ranked.includes(id));
  const allItems = [...state.ranked, ...unranked];

  const movedId = allItems[dragSrcIdx];
  allItems.splice(dragSrcIdx, 1);
  allItems.splice(targetIdx, 0, movedId);

  const srcWasRanked = dragSrcIdx < state.ranked.length;
  const dstIsRanked  = targetIdx  < state.ranked.length;
  let newLen = state.ranked.length;
  if (!srcWasRanked && dstIsRanked) newLen = state.ranked.length + 1;
  else if (srcWasRanked && !dstIsRanked) newLen = state.ranked.length - 1;

  state.ranked = allItems.slice(0, newLen);
  saveState();
  renderDragList();
}
function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  document.querySelectorAll('.drag-item').forEach(el => {
    el.classList.remove('dragging','drag-over');
  });
  dragSrcIdx = null;
  // 強制重繪以清除殘影
  requestAnimationFrame(() => {
    document.querySelectorAll('.drag-item').forEach(el => {
      el.style.transform = 'translateZ(0)';
    });
  });
}

// Touch drag support
let touchDragIdx = null, touchClone = null, touchOffsetY = 0;
function onTouchStart(e) {
  touchDragIdx = parseInt(e.currentTarget.dataset.idx);
  const rect = e.currentTarget.getBoundingClientRect();
  touchOffsetY = e.touches[0].clientY - rect.top;
  touchClone = e.currentTarget.cloneNode(true);
  touchClone.style.cssText = `position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;opacity:.8;z-index:9999;pointer-events:none;transform:translateZ(0);`;
  document.body.appendChild(touchClone);
  e.currentTarget.style.opacity = '0.3';
  e.currentTarget.style.pointerEvents = 'none';
}
function onTouchMove(e) {
  e.preventDefault();
  if (touchClone) {
    touchClone.style.top = (e.touches[0].clientY - touchOffsetY) + 'px';
    touchClone.style.transform = 'translateZ(0)';
  }
}
function onTouchEnd(e) {
  if (touchClone) { touchClone.remove(); touchClone = null; }
  document.querySelectorAll('.drag-item').forEach(el => {
    el.style.opacity = '';
    el.style.pointerEvents = '';
  });
  const touch = e.changedTouches[0];
  const els = document.elementsFromPoint(touch.clientX, touch.clientY);
  const target = els.find(el => el.classList.contains('drag-item') && parseInt(el.dataset.idx) !== touchDragIdx);
  if (target) {
    const targetIdx = parseInt(target.dataset.idx);
    const unranked = state.selected.filter(id => !state.ranked.includes(id));
    const allItems = [...state.ranked, ...unranked];
    const movedId = allItems[touchDragIdx];
    allItems.splice(touchDragIdx, 1);
    allItems.splice(targetIdx, 0, movedId);
    const srcWasRanked = touchDragIdx < state.ranked.length;
    const dstIsRanked = targetIdx < state.ranked.length;
    let newLen = state.ranked.length;
    if (!srcWasRanked && dstIsRanked) newLen = state.ranked.length + 1;
    else if (srcWasRanked && !dstIsRanked) newLen = state.ranked.length - 1;
    state.ranked = allItems.slice(0, newLen);
    saveState();
    renderDragList();
  } else {
    // 沒有 drop 到卡片上，檢查是否 drop 到 ranked-zone 空白區域
    const rankedZone = document.getElementById('ranked-zone');
    if (rankedZone) {
      const rect = rankedZone.getBoundingClientRect();
      if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
          touch.clientY >= rect.top  && touch.clientY <= rect.bottom) {
        const unranked = state.selected.filter(id => !state.ranked.includes(id));
        const all = [...state.ranked, ...unranked];
        const srcWasRanked = touchDragIdx < state.ranked.length;
        if (!srcWasRanked) {
          const movedId = all[touchDragIdx];
          state.ranked.push(movedId);
          saveState(); renderDragList();
        }
      }
    }
  }
  touchDragIdx = null;
  // 強制重繪清除殘影
  requestAnimationFrame(() => {
    document.querySelectorAll('.drag-item').forEach(el => {
      el.style.transform = 'translateZ(0)';
    });
  });
}

function goToStep3() {
  if (state.selected.length < 10) {
    document.getElementById('warn-sel').classList.add('show');
    showToast('請至少選擇 10 張卡片');
    return;
  }
  document.getElementById('warn-sel').classList.remove('show');
  if (state.ranked.length < 10) {
    document.getElementById('warn-sort').classList.add('show');
    showToast('請將至少 10 張卡片拖曳到虛線上方完成排序');
    return;
  }
  document.getElementById('warn-sort').classList.remove('show');
  saveState();
  // 驗證由 goToStep(3) 統一處理
  goToStep(3);
}

// ─── STEP 3 ───────────────────────────────────────────────────────────────────
function renderStep3() {
  const top10 = state.ranked.slice(0, 10);
  const container = document.getElementById('step3-cards');
  container.innerHTML = '';
  top10.forEach((id, idx) => {
    const card = getCard(id);
    const reason = state.reasons[id] || '';
    const div = document.createElement('div');
    div.className = 'reason-card';
    div.innerHTML = `
      <div class="reason-rank">TOP ${idx+1}</div>
      <div class="reason-name">${card.name}</div>
      <div class="reason-cat" style="color:${CAT_COLORS[card.cat]||'var(--muted)'}">${card.cat} · SN${card.sn}</div>
      <div class="reason-qs">
        <div class="reason-q">為什麼這個價值觀對你重要？</div>
        <div class="reason-q">哪些生命經驗讓你重視它？</div>
        <div class="reason-q">如果生活中沒有它，會怎樣？</div>
      </div>
      <textarea class="r-textarea" id="reason-${id}" placeholder="請在此輸入你的想法…" oninput="onReasonInput('${id}')">${reason}</textarea>
      <div style="font-size:.72rem;color:var(--muted);margin-top:.3rem;text-align:right" id="reason-count-${id}">${reason.length} 字</div>`;
    container.appendChild(div);
  });
  updateReasonBadge();
}

function onReasonInput(id) {
  const ta = document.getElementById('reason-' + id);
  const val = ta.value;
  state.reasons[id] = val;
  const countEl = document.getElementById('reason-count-' + id);
  if (countEl) {
    countEl.textContent = val.length + ' 字';
    countEl.style.color = val.length >= 10 ? 'var(--accent2)' : 'var(--muted)';
  }
  ta.classList.toggle('error', val.length > 0 && val.length < 10);
  updateReasonBadge();
  saveState();
}

function updateReasonBadge() {
  const top10 = state.ranked.slice(0, 10);
  const filled = top10.filter(id => (state.reasons[id]||'').length >= 10).length;
  const tab = document.getElementById('tab3-count');
  if (tab) tab.textContent = filled === 10 ? '已完成' : `已填 ${filled}/10`;
  updateProgressBadges();
}

function goToStep4() {
  saveState();
  goToStep(4);
}

// ─── STEP 4 ───────────────────────────────────────────────────────────────────
function renderStep4() {
  const top10 = state.ranked.slice(0, 10);
  const container = document.getElementById('step4-cards');
  container.innerHTML = '';
  if (top10.length < 10) {
    container.innerHTML = `<div class="empty-state"><div class="emoji">⚠️</div><p>請先完成 Step 2 的排序，確保 Top 10 已設定。</p></div>`;
    return;
  }
  top10.forEach((id, idx) => {
    const card = getCard(id);
    const sat = state.satisfaction[id];
    const hasVal = sat !== undefined && sat !== null;
    const div = document.createElement('div');
    div.className = 'sat-card';
    div.innerHTML = `
      <div class="sat-rank">TOP ${idx+1}</div>
      <div class="sat-name">${card.name}</div>
      <div class="sat-label">目前生活中，這個價值觀被滿足的程度是？</div>
      <div class="sat-value-display ${hasVal?'':'unset'}" id="sat-val-${id}">${hasVal ? sat : '請移動滑桿'}</div>
      <div class="sat-slider-wrap">
        <input type="range" class="sat-slider" id="sat-slider-${id}"
          min="1" max="10" step="1" value="${hasVal ? sat : 5}"
          oninput="onSatInput('${id}', this.value)"
          style="background:${hasVal ? getSatGradient(sat) : 'var(--border)'}">
      </div>
      <div class="sat-labels"><span>1 幾乎沒有</span><span>5 普通</span><span>10 完全滿足</span></div>`;
    container.appendChild(div);
    if (!hasVal) {
      // mark as unset until user moves slider
      const slider = div.querySelector('.sat-slider');
      slider.dataset.touched = '0';
    }
  });
  updateSatBadge();
}

function getSatGradient(val) {
  const pct = ((val - 1) / 9) * 100;
  const color = val <= 3 ? 'var(--accent)' : val <= 6 ? 'var(--accent3)' : 'var(--accent2)';
  return `linear-gradient(to right, ${color} ${pct}%, var(--border) ${pct}%)`;
}

function onSatInput(id, val) {
  const n = parseInt(val);
  state.satisfaction[id] = n;
  const display = document.getElementById('sat-val-' + id);
  if (display) {
    display.textContent = n;
    display.className = 'sat-value-display';
    display.style.color = n <= 3 ? 'var(--accent)' : n <= 6 ? 'var(--accent3)' : 'var(--accent2)';
  }
  const slider = document.getElementById('sat-slider-' + id);
  if (slider) {
    slider.style.background = getSatGradient(n);
    slider.dataset.touched = '1';
  }
  updateSatBadge();
  saveState();
}

function updateSatBadge() {
  const top10 = state.ranked.slice(0, 10);
  const rated = top10.filter(id => state.satisfaction[id] !== undefined && state.satisfaction[id] !== null).length;
  const tab = document.getElementById('tab4-count');
  if (tab) tab.textContent = rated === 10 ? '已完成' : `已評 ${rated}/10`;
  updateProgressBadges();
}

function goToResult() {
  const top10 = state.ranked.slice(0, 10);
  if (top10.length < 10) {
    showToast('請先完成 Step 2 的篩選排序');
    goToStep(2);
    return;
  }
  const allRated = top10.every(id => state.satisfaction[id] !== undefined && state.satisfaction[id] !== null);
  if (!allRated) {
    document.getElementById('warn-sat').classList.add('show');
    showToast('請為每個價值觀完成評分');
    return;
  }
  document.getElementById('warn-sat').classList.remove('show');
  state.createdAt = state.createdAt || new Date().toISOString();
  saveState();
  renderResult();
  // activate result tab
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.step-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('result').classList.add('active');
  state.step = 5;
  saveState();
  updateNavBar(5);
  window.scrollTo(0,0);
}

// ─── RESULT PAGE ──────────────────────────────────────────────────────────────
function renderResult() {
  const top10 = state.ranked.slice(0, 10);
  const modeLabel = state.mode === 'work' ? '工作價值觀探索' : '人生價值觀探索';
  const dateStr = state.createdAt
    ? new Date(state.createdAt).toLocaleString('zh-TW', {year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})
    : '';

  // 優先讀取輸入框的最新值，確保 userName 不為空
  const displayName = document.getElementById('user-name')?.value?.trim() || state.userName || '';
  if (displayName) state.userName = displayName;

  document.getElementById('result-title').textContent = `${state.userName ? state.userName + ' 的' : '你的'}價值觀探索結果`;
  document.getElementById('result-meta').textContent = `${modeLabel} · ${dateStr}`;

  const container = document.getElementById('result-content');
  container.innerHTML = '';

  // ── Top 10 Table ──
  const sec1 = document.createElement('div');
  sec1.className = 'result-section';
  sec1.innerHTML = `<h3>🏆 Top 10 價值觀</h3>`;
  const table = document.createElement('table');
  table.className = 'result-table';
  table.innerHTML = `<thead><tr>
    <th style="width:40px">排名</th>
    <th>價值觀</th>
    <th>分類</th>
    <th>原因說明</th>
    <th style="width:120px">滿意度</th>
  </tr></thead>`;
  const tbody = document.createElement('tbody');
  top10.forEach((id, idx) => {
    const card = getCard(id);
    const sat = state.satisfaction[id] || 0;
    const reason = state.reasons[id] || '';
    const barClass = sat <= 3 ? 'low' : sat <= 6 ? 'mid' : 'high';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="排名" style="font-weight:700;color:${idx<3?'var(--accent)':'var(--ink)'};font-size:1rem">${idx+1}</td>
      <td data-label="價值觀"><strong>${card.name}</strong><br><span style="font-size:.65rem;color:var(--muted)">SN${card.sn}</span></td>
      <td data-label="分類"><span class="cat-badge" style="background:${CAT_COLORS[card.cat]||'var(--warm)'}22;color:${CAT_COLORS[card.cat]||'var(--muted)'};border-color:${CAT_COLORS[card.cat]||'var(--border)'}44">${card.cat}</span></td>
      <td data-label="原因說明" style="font-size:.8rem;line-height:1.6">${escHtml(reason)}</td>
      <td data-label="滿意度">
        <div style="font-weight:700;font-size:1rem;color:${sat<=3?'var(--accent)':sat<=6?'var(--accent3)':'var(--accent2)'}">${sat} <span style="font-size:.65rem;font-weight:400;color:var(--muted)">/ 10</span></div>
        <div class="sat-bar-wrap" style="margin-top:.3rem"><div class="sat-bar ${barClass}" style="width:${sat*10}%"></div></div>
      </td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  sec1.appendChild(table);
  container.appendChild(sec1);

  // ── Satisfaction Chart ──
  const sec2 = document.createElement('div');
  sec2.className = 'result-section';
  sec2.innerHTML = `<h3>📊 滿意度視覺化</h3>`;
  top10.forEach((id, idx) => {
    const card = getCard(id);
    const sat = state.satisfaction[id] || 0;
    const barClass = sat <= 3 ? 'low' : sat <= 6 ? 'mid' : 'high';
    const row = document.createElement('div');
    row.className = 'chart-bar-row';
    row.innerHTML = `
      <div class="chart-bar-label">${idx+1}. ${card.name}</div>
      <div class="chart-bar-track">
        <div class="chart-bar-fill ${barClass}" style="width:${sat*10}%">${sat >= 3 ? sat : ''}</div>
      </div>
      <div class="chart-bar-score" style="color:${sat<=3?'var(--accent)':sat<=6?'var(--accent3)':'var(--accent2)'}">${sat}</div>`;
    sec2.appendChild(row);
  });
  container.appendChild(sec2);

  // ── Category Distribution ──
  const catCount = {};
  top10.forEach(id => {
    const cat = getCard(id).cat;
    catCount[cat] = (catCount[cat] || 0) + 1;
  });
  const sec3 = document.createElement('div');
  sec3.className = 'result-section';
  sec3.innerHTML = `<h3>🗂 類別分佈</h3>`;
  const catWrap = document.createElement('div');
  catWrap.style.cssText = 'display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem';
  Object.entries(catCount).sort((a,b)=>b[1]-a[1]).forEach(([cat, n]) => {
    const span = document.createElement('span');
    span.className = 'cat-badge';
    span.style.cssText = `background:${CAT_COLORS[cat]||'var(--warm)'}22;color:${CAT_COLORS[cat]||'var(--muted)'};border-color:${CAT_COLORS[cat]||'var(--border)'}44;font-size:.82rem;padding:.3rem .9rem`;
    span.textContent = `${cat} × ${n}`;
    catWrap.appendChild(span);
  });
  sec3.appendChild(catWrap);
  container.appendChild(sec3);

  // ── Insights ──
  const sec4 = document.createElement('div');
  sec4.className = 'result-section';
  sec4.innerHTML = `<h3>💡 洞察與提醒</h3>`;

  const sats = top10.map(id => ({ id, card: getCard(id), sat: state.satisfaction[id] || 0 }));
  const highest = sats.reduce((a,b) => a.sat >= b.sat ? a : b);
  const lowest = sats.reduce((a,b) => a.sat <= b.sat ? a : b);
  const avgSat = (sats.reduce((s,c) => s + c.sat, 0) / sats.length).toFixed(1);
  const catEntries = Object.entries(catCount).sort((a,b)=>b[1]-a[1]);
  const topCatCount = catEntries.length > 0 ? catEntries[0][1] : 0;
  const topCats = catEntries.filter(([,n]) => n === topCatCount);
  const topCatValue = topCats.map(([cat, n]) => `${cat}（${n} 項）`).join('、');

  const insights = [
    { label:'滿意度最高', value: `${highest.card.name}（${highest.sat} 分）`, sub:'這是你目前生活中最被滿足的核心價值。' },
    { label:'滿意度最低', value: `${lowest.card.name}（${lowest.sat} 分）`, sub:'這個價值觀可能是你目前最需要關注的落差。' },
    { label:'平均滿意度', value: `${avgSat} / 10`, sub: avgSat >= 7 ? '整體而言你的核心價值觀被滿足得不錯！' : avgSat >= 5 ? '有些價值觀還有提升空間。' : '你的核心價值觀目前有較大的落差，值得深入探索。' },
    { label:'最集中的類別', value: topCatValue, sub: topCats.length > 1 ? '你的核心價值觀同時集中在這幾個領域。' : '你的核心價值觀主要集中在這個領域。' }
  ];
  insights.forEach(ins => {
    const div = document.createElement('div');
    div.className = 'insight-card';
    div.innerHTML = `<div class="insight-label">${ins.label}</div>
      <div class="insight-value">${ins.value}</div>
      <div class="insight-sub">${ins.sub}</div>`;
    sec4.appendChild(div);
  });

  // Gap alerts (sat <= 4)
  const gaps = sats.filter(s => s.sat <= 4);
  if (gaps.length > 0) {
    const alert = document.createElement('div');
    alert.className = 'gap-alert';
    alert.innerHTML = `<div class="gap-alert-title">⚠️ 落差提醒：以下價值觀滿意度偏低（≤ 4 分）</div>`;
    gaps.forEach(g => {
      const item = document.createElement('div');
      item.className = 'gap-alert-item';
      item.textContent = `${g.card.name}（${g.sat} 分）— 這個對你重要的價值觀目前可能未被充分滿足。`;
      alert.appendChild(item);
    });
    sec4.appendChild(alert);
  }

  // ── 其他重要價值觀（第 11-20 名）──
  const others = state.ranked.slice(10, 20);
  if (others.length > 0) {
    const othersCard = document.createElement('div');
    othersCard.style.cssText = 'background:#f9f9f9;border:1px solid var(--border);border-radius:8px;padding:1rem 1.2rem;margin-top:1rem;';
    othersCard.innerHTML = `<div style="font-size:.75rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:.6rem;">📌 其他你重視的價值觀（第 11-${10+others.length} 名）</div>
      <div style="font-size:.82rem;color:var(--muted);line-height:1.7;margin-bottom:.6rem;">這些價值觀雖然沒有進入你的 Top 10，但在篩選時你仍認為它們很重要，值得留意：</div>`;
    const othersList = document.createElement('div');
    othersList.style.cssText = 'display:flex;flex-wrap:wrap;gap:.4rem;';
    others.forEach((id, idx) => {
      const card = getCard(id);
      const badge = document.createElement('span');
      badge.className = 'cat-badge';
      badge.style.cssText = `background:white;border:1px solid var(--border);color:var(--ink);font-size:.78rem;padding:.3rem .8rem;`;
      badge.textContent = `${10+idx+1}. ${card.name}`;
      othersList.appendChild(badge);
    });
    othersCard.appendChild(othersList);
    sec4.appendChild(othersCard);
  }

  container.appendChild(sec4);
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
function buildTextContent() {
  const top10 = state.ranked.slice(0, 10);
  const others = state.ranked.slice(10, 20);
  const modeLabel = state.mode === 'work' ? '工作價值觀探索' : '人生價值觀探索';
  const dateStr = state.createdAt
    ? new Date(state.createdAt).toLocaleString('zh-TW')
    : new Date().toLocaleString('zh-TW');
  let txt = `# 價值觀探索報告\n\n`;
  txt += `**姓名：** ${state.userName || '（未填寫）'}\n`;
  txt += `**模式：** ${modeLabel}\n`;
  txt += `**完成時間：** ${dateStr}\n\n`;
  txt += `---\n\n## Top 10 價值觀\n\n`;
  top10.forEach((id, idx) => {
    const card = getCard(id);
    const sat = state.satisfaction[id] || 0;
    const reason = state.reasons[id] || '';
    txt += `### ${idx+1}. ${card.name}\n`;
    txt += `- **分類：** ${card.cat}\n`;
    txt += `- **原因：** ${reason}\n`;
    txt += `- **滿意度：** ${sat} / 10\n\n`;
  });
  if (others.length > 0) {
    txt += `---\n\n## 其他重視的價值觀（第 11-${10+others.length} 名）\n\n`;
    others.forEach((id, idx) => {
      const card = getCard(id);
      txt += `${10+idx+1}. ${card.name}（${card.cat}）\n`;
    });
    txt += `\n`;
  }
  return txt;
}

function downloadMd() {
  const txt = buildTextContent();
  const blob = new Blob([txt], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `價值觀探索_${state.userName || 'result'}_${new Date().toISOString().slice(0,10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('已下載 Markdown 檔案');
}

function copyText() {
  const txt = buildTextContent();
  navigator.clipboard.writeText(txt).then(() => {
    showToast('已複製到剪貼簿');
  }).catch(() => {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = txt;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    showToast('已複製到剪貼簿');
  });
}

// ─── SEND REPORT ──────────────────────────────────────────────────────────────
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzfrZFdto5Y6TCvyfxQWn6ghX64YaN9oAST-XSn42UXwzyCq32qwhdi3Q9DZk2xz492/exec';
const GAS_TOKEN = 'saori-lv-2026-xK9mP';

async function sendReport() {
  const emailEl = document.getElementById('report-email');
  const email = emailEl.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailEl.style.borderColor = 'var(--accent)';
    emailEl.focus();
    showToast('請輸入有效的 Email 地址');
    return;
  }
  emailEl.style.borderColor = 'var(--border)';

  const top10 = state.ranked.slice(0, 10).map((id, idx) => {
    const card = getCard(id);
    return {
      name: card.name,
      category: card.cat,
      rank: idx + 1,
      reason: state.reasons[id] || '',
      satisfaction: state.satisfaction[id] || 0
    };
  });

  // 加入第 11-20 名
  const others = state.ranked.slice(10, 20).map((id, idx) => {
    const card = getCard(id);
    return {
      name: card.name,
      category: card.cat,
      rank: 10 + idx + 1
    };
  });

  // 確保 userName 是最新值（優先讀取輸入框，再 fallback 到 state）
  const latestName = document.getElementById('user-name')?.value?.trim() || state.userName || '';

  const payload = {
    token: GAS_TOKEN,
    email: email,
    userName: latestName,
    mode: state.mode,
    top10: top10,
    others: others, // 新增：第 11-20 名
    created_at: state.createdAt || new Date().toISOString()
  };

  document.getElementById('loading-overlay').classList.add('show');
  document.getElementById('send-btn').disabled = true;

  try {
    // GAS Web App 不支援 CORS，改用 no-cors 模式送出
    // no-cors 下無法讀取回應內容，採樂觀策略：送出即視為成功
    await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' }, // no-cors 只允許 simple headers
      body: JSON.stringify(payload)
    });
    document.getElementById('loading-overlay').classList.remove('show');
    document.getElementById('send-btn').disabled = false;
    showToast('✅ 報表已寄送到 ' + email);
  } catch (err) {
    document.getElementById('loading-overlay').classList.remove('show');
    document.getElementById('send-btn').disabled = false;
    showToast('❌ 連線失敗，請稍後再試');
  }
}

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/\n/g,'<br>');
}

