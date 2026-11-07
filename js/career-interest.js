/* career-interest.js — 職業興趣探索（已合併舊版 career-card 熱情探索工具）
 * 流程：1 註冊名稱（需對應到試算表分頁）→ 2 挑選 10–15 個職業 → 3 分類動機
 *      → 4 從挑選的職業排出前 10 名（純粹喜歡排在候選最前面）→ 5 寫原因與洞察 → 6 統計與反思 → 送出到 GAS
 * 進度存在 localStorage，中斷後回來可繼續。
 */

// ─── 設定 ────────────────────────────────────────────────────────────────────
// ← 部署 GAS/career-interest.js 後，把 Web App 網址貼在這裡
const CI_GAS_URL = 'https://script.google.com/macros/s/AKfycbxLfhnN5YeFRTyS-wnmlLYnRnXNsf1RTiIwEBehRdverOWS_lNQNRDwEhzGVkyrF7hS/exec';
const CI_TOKEN   = 'saori-ci-2026-hT4qW'; // ← 需與 GAS 中的 TOKEN 相同

const STATE_KEY  = 'career-interest-state-v1'; // 沿用舊 key：舊版進度載入時會補上新欄位
const PICK_MIN   = 10;
const PICK_MAX   = 15;
const PURE_MIN   = 5;   // 「純粹喜歡」至少幾個才能排序
const RANK_SIZE  = 10;  // 一律排 10 名：純粹喜歡不足 10 個時，從其他挑選的職業補上

// 動機分類（值會送到 GAS，需與 GAS 的 CLS_LABELS 相同）
const CLS_LABELS = { pure: '純粹喜歡', others: '他人期望', capable: '僅是有能力做' };

const INSIGHT_PLACEHOLDERS = {
  others: '例如：這是誰的期望？如果沒有這份期望，你還會想做嗎？',
  capable: '例如：做得到卻不興奮，是少了什麼？'
};

// Holland 六大類（R/I/A/S/E/C 固定順序，並列時依此排）
const HOLLAND_ORDER  = ['R', 'I', 'A', 'S', 'E', 'C'];
const HOLLAND_LABELS = { R: '實用型', I: '研究型', A: '藝術型', S: '社會型', E: '企業型', C: '事務型' };

// 反思問題：{type} 會換成主要類型名稱
const REFLECTION_QUESTIONS = [
  '在你「純粹喜歡」的工作中，你注意到哪些共同的主題或模式？',
  '你的主要類型是「{type}」，這個結果讓你感到意外嗎？為什麼？',
  '如果不考慮薪資、能力或他人期望，你最想從事哪一份工作？是什麼吸引你？',
  '你的「{type}」傾向，在目前的生活或工作中有哪些地方已經得到滿足？',
  '看完這份探索結果，你想對未來的自己說什麼？'
];

// 職業資料：來源為「職業卡.xlsx」，sn 對應試算表 A 欄（SN）
// code（Holland Code）不顯示給使用者，避免影響直覺選擇，只隨資料一起送出
const JOBS = [
  { sn: 1, zh: "遊戲設計師", en: "Game Designer", code: "AE" },
  { sn: 2, zh: "室內設計師", en: "Interior Designer", code: "AE" },
  { sn: 3, zh: "音樂家", en: "Musician", code: "AE" },
  { sn: 4, zh: "演員", en: "Actor", code: "AE" },
  { sn: 5, zh: "藝術總監", en: "Art Director", code: "AE" },
  { sn: 6, zh: "編輯", en: "Editor", code: "AEC" },
  { sn: 7, zh: "記者/特派員", en: "Reporter/Correspondent", code: "AEI" },
  { sn: 8, zh: "商業與工業設計師", en: "Commercial and Industrial Designer", code: "AER" },
  { sn: 9, zh: "流行服飾設計師", en: "Fashion Designer", code: "AER" },
  { sn: 10, zh: "廣電主播/主持人", en: "Broadcaster/Host", code: "AES" },
  { sn: 11, zh: "造型設計師", en: "Stylist", code: "AES" },
  { sn: 12, zh: "多媒體設計師", en: "Multimedia Designer", code: "AI" },
  { sn: 13, zh: "詩人/作家", en: "Poet/Writer", code: "AI" },
  { sn: 14, zh: "建築師", en: "Architect", code: "AIR" },
  { sn: 15, zh: "攝影師", en: "Photographer", code: "AR" },
  { sn: 16, zh: "藝術家", en: "Artist", code: "AR" },
  { sn: 17, zh: "舞者", en: "Dancer", code: "AR" },
  { sn: 18, zh: "平面設計師", en: "Graphic Designer", code: "ARE" },
  { sn: 19, zh: "景觀/園藝設計師", en: "Landscape/Gardening Designer", code: "ARE" },
  { sn: 20, zh: "翻譯/口譯", en: "Translator/Interpreter", code: "AS" },
  { sn: 21, zh: "會計師", en: "Accountant", code: "CE" },
  { sn: 22, zh: "採購", en: "Purchasing", code: "CE" },
  { sn: 23, zh: "行政人員", en: "Administrative Personnel", code: "CER" },
  { sn: 24, zh: "公務員", en: "Civil Servant", code: "CES" },
  { sn: 25, zh: "資料與檔案管理員", en: "Data and File Manager", code: "CI" },
  { sn: 26, zh: "精算師", en: "Actuary", code: "CIE" },
  { sn: 27, zh: "金融投資分析師", en: "Financial Investment Analyst", code: "CIE" },
  { sn: 28, zh: "資訊安全人員", en: "Information Security Personnel", code: "CIR" },
  { sn: 29, zh: "網站開發人員", en: "Website Developer", code: "CIR" },
  { sn: 30, zh: "數位行銷", en: "Digital Marketing", code: "EA" },
  { sn: 31, zh: "廣告文案", en: "Copywriter", code: "EA" },
  { sn: 32, zh: "導演", en: "Director", code: "EA" },
  { sn: 33, zh: "公關", en: "Public Relations", code: "EAS" },
  { sn: 34, zh: "不動產經紀人", en: "Real Estate Agent", code: "EC" },
  { sn: 35, zh: "業務", en: "Sales", code: "EC" },
  { sn: 36, zh: "門市/專櫃人員", en: "Store/Counter Staff", code: "EC" },
  { sn: 37, zh: "軍官", en: "Military Officer", code: "ECR" },
  { sn: 38, zh: "咖啡師", en: "Barista", code: "ECR" },
  { sn: 39, zh: "保險經紀人", en: "Insurance Broker", code: "ECS" },
  { sn: 40, zh: "總經理", en: "General Manager", code: "ECS" },
  { sn: 41, zh: "專案管理師", en: "Project Manager", code: "ECS" },
  { sn: 42, zh: "人力資源專員", en: "Human Resources Specialist", code: "ECS" },
  { sn: 43, zh: "律師", en: "Lawyer", code: "EI" },
  { sn: 44, zh: "網站行銷策畫", en: "Website Marketing Planner", code: "EIC" },
  { sn: 45, zh: "企管顧問", en: "Management Consultant", code: "EIC" },
  { sn: 46, zh: "船長/領航員", en: "Ship Captain/Navigator", code: "ERC" },
  { sn: 47, zh: "法官", en: "Judge", code: "ES" },
  { sn: 48, zh: "議員/立法委員", en: "Legislator/Parliamentarian", code: "ES" },
  { sn: 49, zh: "禮儀師", en: "Etiquette Expert", code: "ESC" },
  { sn: 50, zh: "空服員", en: "Flight Attendant", code: "ESC" },
  { sn: 51, zh: "客服人員", en: "Customer Service Personnel", code: "ESC" },
  { sn: 52, zh: "按摩/美容師", en: "Massage/Beautician", code: "ESR" },
  { sn: 53, zh: "人類學家", en: "Anthropologist", code: "IA" },
  { sn: 54, zh: "程式設計師", en: "Programmer", code: "IC" },
  { sn: 55, zh: "數據分析師", en: "Data Analyst", code: "ICE" },
  { sn: 56, zh: "藥師", en: "Pharmacist", code: "ICS" },
  { sn: 57, zh: "市場調查人員", en: "Market Researcher", code: "IEC" },
  { sn: 58, zh: "商業智慧分析師", en: "Business Intelligence Analyst", code: "IEC" },
  { sn: 59, zh: "大氣科學家", en: "Atmospheric Scientist", code: "IR" },
  { sn: 60, zh: "電機工程師", en: "Electrical Engineer", code: "IR" },
  { sn: 61, zh: "航太工程師", en: "Aerospace Engineer", code: "IR" },
  { sn: 62, zh: "人因工程師", en: "Human Factors Engineer", code: "IR" },
  { sn: 63, zh: "生命科學家", en: "Life Scientist", code: "IR" },
  { sn: 64, zh: "生化工程師", en: "Biochemical Engineer", code: "IR" },
  { sn: 65, zh: "化工工程師", en: "Chemical Engineer", code: "IR" },
  { sn: 66, zh: "環工工程師", en: "Environmental Engineer", code: "IRC" },
  { sn: 67, zh: "機電工程師", en: "Mechatronics Engineer", code: "IRC" },
  { sn: 68, zh: "機械工程師", en: "Mechanical Engineer", code: "IRC" },
  { sn: 69, zh: "光電工程師", en: "Optoelectronics Engineer", code: "IRC" },
  { sn: 70, zh: "電腦硬體工程師", en: "Computer Hardware Engineer", code: "IRC" },
  { sn: 71, zh: "網管人員", en: "Network Administrator", code: "IRC" },
  { sn: 72, zh: "水土保育人員", en: "Soil and Water Conservationist", code: "IRE" },
  { sn: 73, zh: "材料工程師", en: "Materials Engineer", code: "IRE" },
  { sn: 74, zh: "牙醫師", en: "Dentist", code: "IRS" },
  { sn: 75, zh: "營養師", en: "Nutritionist", code: "IS" },
  { sn: 76, zh: "醫師", en: "Physician", code: "ISR" },
  { sn: 77, zh: "獸醫", en: "Veterinarian", code: "ISR" },
  { sn: 78, zh: "保全", en: "Security Guard", code: "RCE" },
  { sn: 79, zh: "產品維修人員", en: "Product Repair Technician", code: "RCI" },
  { sn: 80, zh: "機長", en: "Pilot", code: "RCI" },
  { sn: 81, zh: "運動員", en: "Athlete", code: "RE" },
  { sn: 82, zh: "廚師", en: "Chef", code: "REA" },
  { sn: 83, zh: "警察", en: "Police Officer", code: "REC" },
  { sn: 84, zh: "動物飼養員", en: "Animal Caretaker", code: "RI" },
  { sn: 85, zh: "地理與航照測繪員", en: "Geographic and Aerial Surveyor", code: "RIC" },
  { sn: 86, zh: "土木工程師", en: "Civil Engineer", code: "RIC" },
  { sn: 87, zh: "農業與食品技術員", en: "Agriculture and Food Technologist", code: "RIC" },
  { sn: 88, zh: "幼教老師", en: "Preschool Teacher", code: "SA" },
  { sn: 89, zh: "國高中老師", en: "High School Teacher", code: "SA" },
  { sn: 90, zh: "社工師", en: "Social Worker", code: "SE" },
  { sn: 91, zh: "神職人員", en: "Clergy", code: "SEA" },
  { sn: 92, zh: "導遊/導覽員", en: "Tour Guide", code: "SEA" },
  { sn: 93, zh: "服務生", en: "Waitstaff/Server", code: "SEC" },
  { sn: 94, zh: "家教/補習班老師", en: "Tutor", code: "SEI" },
  { sn: 95, zh: "教授", en: "Professor", code: "SI" },
  { sn: 96, zh: "諮商與臨床心理師", en: "Counseling and Clinical Psychologist", code: "SIA" },
  { sn: 97, zh: "護理師", en: "Nurse", code: "SIC" },
  { sn: 98, zh: "物理與職能治療師", en: "Physiotherapist", code: "SIR" },
  { sn: 99, zh: "看護", en: "Caregiver", code: "SRC" },
  { sn: 100, zh: "運動教練", en: "Sports Coach", code: "SRE" },
];
const JOB_BY_SN = new Map(JOBS.map(j => [j.sn, j]));

// ─── 狀態 ────────────────────────────────────────────────────────────────────
function emptyState() {
  return {
    name: '', step: 1,
    picks: [],          // 挑選的 sn
    cls: {},            // { sn: 'pure' | 'others' | 'capable' }
    ranking: [],        // 純粹喜歡的名次（sn）
    reasons: {},        // { sn: 原因 }（只送出有名次的）
    insights: {},       // { sn: 洞察 }（他人期望 / 僅是有能力做）
    reflections: [],    // 反思回答，index 對應 REFLECTION_QUESTIONS
    submittedAt: null
  };
}

let state = loadState() || emptyState();

function loadState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || typeof s !== 'object' || !Array.isArray(s.picks)) return null;
    // 過濾掉不存在的 sn，避免資料版本不同時出錯
    s.picks = s.picks.filter(sn => JOB_BY_SN.has(sn)).slice(0, PICK_MAX);
    const cls = {};
    if (!s.cls) {
      // 舊版（合併前）進度沒有分類：舊版只挑熱血亢奮的職業，視為全部「純粹喜歡」，保留原本的名次與原因
      s.picks.forEach(sn => { cls[sn] = 'pure'; });
    } else {
      Object.entries(s.cls).forEach(([sn, c]) => {
        if (s.picks.includes(Number(sn)) && CLS_LABELS[c]) cls[sn] = c;
      });
    }
    s.cls = cls;
    s.ranking = (s.ranking || []).filter(sn => s.picks.includes(sn)).slice(0, RANK_SIZE);
    s.reasons = s.reasons || {};
    s.insights = s.insights || {};
    s.reflections = Array.isArray(s.reflections) ? s.reflections : [];
    return Object.assign(emptyState(), s);
  } catch (e) {
    return null;
  }
}

function saveState() {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) {}
}

function clearState() {
  try { localStorage.removeItem(STATE_KEY); } catch (e) {}
  state = emptyState();
}

// ─── 資料推導（不碰 DOM）─────────────────────────────────────────────────────
function picksValid()    { return state.picks.length >= PICK_MIN && state.picks.length <= PICK_MAX; }
function pureList()      { return state.picks.filter(sn => state.cls[sn] === 'pure'); }
function classifiedCount() { return state.picks.filter(sn => state.cls[sn]).length; }
function allClassified() { return classifiedCount() === state.picks.length; }
function rankingValid()  { return state.ranking.length === RANK_SIZE; }
/** 沒排進前 10 名的「他人期望／僅是有能力做」：這些才需要寫洞察 */
function unrankedNonPure(c) {
  return state.picks.filter(sn => state.cls[sn] && state.cls[sn] !== 'pure' &&
    (!c || state.cls[sn] === c) && !state.ranking.includes(sn));
}
/** 候選排序：純粹喜歡 → 他人期望 → 僅是有能力做 */
const CLS_ORDER = { pure: 0, others: 1, capable: 2 };
function clsTag(sn) {
  const c = state.cls[sn];
  return c && c !== 'pure' ? el('span', { class: 'ci-cls-tag', text: CLS_LABELS[c] }) : null;
}
function reasonsFilled() {
  return state.ranking.filter(sn => (state.reasons[sn] || '').trim() !== '').length;
}

/** 依「純粹喜歡」職業的代碼字母計數，例如 AER 的 A、E、R 各算 1 次 */
function hollandStats() {
  const count = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  pureList().forEach(sn => {
    for (const ch of JOB_BY_SN.get(sn).code) if (ch in count) count[ch]++;
  });
  const ranked = HOLLAND_ORDER
    .map(code => ({ code, label: HOLLAND_LABELS[code], count: count[code] }))
    .sort((a, b) => b.count - a.count || HOLLAND_ORDER.indexOf(a.code) - HOLLAND_ORDER.indexOf(b.code));
  const top = ranked[0].count;
  const primary = top > 0 ? ranked.filter(r => r.count === top) : [];
  return { ranked, top, primary };
}

function primaryTypeText(stats) {
  return stats.primary.map(r => r.label).join('、') || '—';
}

function reflectionQuestions() {
  const type = primaryTypeText(hollandStats());
  return REFLECTION_QUESTIONS.map(q => q.replaceAll('{type}', type));
}

/** 某一步是否可以進入（前面的條件都已完成） */
function canEnter(step) {
  if (step === 1) return true;
  if (step === 2) return !!state.name;
  if (step === 3) return canEnter(2) && picksValid();
  if (step === 4) return canEnter(3) && allClassified() && pureList().length >= PURE_MIN;
  if (step === 5) return canEnter(4) && rankingValid();
  if (step === 6) return canEnter(5) && reasonsFilled() === state.ranking.length;
  if (step === 'review') return canEnter(6);
  return false;
}

function goTo(step) {
  if (step !== 'done' && !canEnter(step)) return;
  state.step = step;
  saveState();
  render();
  const main = document.querySelector('.ci-main');
  if (main && window.scrollY > main.offsetTop - 140) {
    window.scrollTo({ top: main.offsetTop - 140, behavior: 'auto' });
  }
}

// ─── DOM helpers ─────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

function el(tag, attrs, children) {
  const node = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (k === 'text') node.textContent = v;
    else if (k === 'class') node.className = v;
    else if (v !== false && v != null) node.setAttribute(k, v === true ? '' : v);
  });
  (children || []).forEach(c => c && node.appendChild(c));
  return node;
}

let toastTimer = null;
function showToast(msg) {
  const t = $('ci-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('is-show'), 2600);
}

// ─── Render ──────────────────────────────────────────────────────────────────
function render() {
  const step = state.step;

  document.querySelectorAll('[data-panel]').forEach(p => {
    p.hidden = String(p.dataset.panel) !== String(step);
  });

  renderSteps();
  if (step === 1) renderStep1();
  if (step === 2) renderJobs();
  if (step === 3) renderClassify();
  if (step === 4) renderRanking();
  if (step === 5) renderReasons();
  if (step === 6) renderStatsAndReflections();
  if (step === 'review') renderReview();
  if (step === 'done') renderDone();
  renderBar();
}

function renderSteps() {
  // 送出前確認屬於第 6 步，進度條仍標在「統計與反思」
  const current = state.step === 'review' ? 6 : state.step;
  document.querySelectorAll('#ci-steps li').forEach(li => {
    const s = Number(li.dataset.step);
    const isCurrent = s === current;
    const isDone = state.step === 'done' || (s < current && canEnter(s));
    li.classList.toggle('is-current', isCurrent);
    li.classList.toggle('is-done', isDone && !isCurrent);
    const btn = li.querySelector('button');
    btn.disabled = !isDone || isCurrent || state.step === 'done';
    if (isCurrent) btn.setAttribute('aria-current', 'step'); else btn.removeAttribute('aria-current');
  });
}

function renderStep1() {
  const input = $('ci-name');
  if (input && !input.value) input.value = state.name || '';
}

// Step 2：挑選。挑選鈕與說明鈕是兩個並排的按鈕（按鈕不能包按鈕）
function renderJobs() {
  const wrap = $('ci-jobs');
  const q = ($('ci-search').value || '').trim().toLowerCase();
  const full = state.picks.length >= PICK_MAX;
  wrap.innerHTML = '';
  let shown = 0;
  JOBS.forEach(job => {
    if (q && !(job.zh.toLowerCase().includes(q) || job.en.toLowerCase().includes(q))) return;
    const picked = state.picks.includes(job.sn);
    wrap.appendChild(el('div', { class: 'ci-job-wrap' }, [
      el('button', {
        type: 'button',
        class: 'ci-job',
        'data-sn': job.sn,
        'aria-pressed': picked ? 'true' : 'false',
        disabled: !picked && full
      }, [
        el('span', { class: 'ci-job-zh', text: job.zh }),
        el('span', { class: 'ci-job-en', text: job.en })
      ]),
      JOB_DETAILS[job.sn]
        ? el('button', { type: 'button', class: 'ci-job-info', 'data-info': job.sn, 'aria-label': `看「${job.zh}」的說明`, text: 'ⓘ' })
        : null
    ]));
    shown++;
  });
  $('ci-jobs-empty').hidden = shown > 0;
}

// Step 3：分類動機（每個職業一組單選）
function renderClassify() {
  const list = $('ci-cls-list');
  list.innerHTML = '';
  state.picks.forEach(sn => {
    const job = JOB_BY_SN.get(sn);
    const name = 'ci-cls-' + sn;
    const options = Object.entries(CLS_LABELS).map(([value, label]) =>
      el('label', { class: 'ci-cls-opt' }, [
        el('input', { type: 'radio', name, value, 'data-sn': sn, checked: state.cls[sn] === value }),
        el('span', { text: label })
      ])
    );
    list.appendChild(el('li', { class: 'ci-cls-item' + (state.cls[sn] ? ' is-set' : '') }, [
      el('fieldset', {}, [
        el('legend', { class: 'ci-cls-name' }, [document.createTextNode(job.zh), el('small', { text: job.en })]),
        el('div', { class: 'ci-cls-opts' }, options)
      ])
    ]));
  });
}

function renderRanking() {
  const pure = pureList().length;
  $('ci-rank-desc').textContent = pure < RANK_SIZE
    ? `你有 ${pure} 個「純粹喜歡」的職業，先把它們排進去，再從其他職業補滿 10 名。第 1 名是最讓你熱血亢奮的工作，排好後可以用箭頭調整順序。`
    : '從你挑選的職業中排出前 10 名，第 1 名是最讓你熱血亢奮的工作。排好後可以用箭頭調整順序。';

  const ladder = $('ci-ladder');
  ladder.innerHTML = '';
  for (let i = 0; i < RANK_SIZE; i++) {
    const sn = state.ranking[i];
    const job = sn != null ? JOB_BY_SN.get(sn) : null;
    const isNext = i === state.ranking.length;
    const li = el('li', { class: 'ci-rung' + (job ? ' is-filled' : '') + (isNext ? ' is-next' : '') }, [
      el('span', { class: 'ci-rung-num', 'aria-hidden': 'true', text: String(i + 1) })
    ]);
    if (job) {
      li.appendChild(el('div', { class: 'ci-rung-name' }, [
        el('span', { class: 'ci-visually-hidden', text: `第 ${i + 1} 名 ` }),
        document.createTextNode(job.zh),
        clsTag(sn),
        el('small', { text: job.en })
      ]));
      li.appendChild(el('div', { class: 'ci-rung-actions' }, [
        el('button', { type: 'button', 'data-act': 'up', 'data-i': i, 'aria-label': `把${job.zh}往前移`, disabled: i === 0, text: '↑' }),
        el('button', { type: 'button', 'data-act': 'down', 'data-i': i, 'aria-label': `把${job.zh}往後移`, disabled: i === state.ranking.length - 1, text: '↓' }),
        el('button', { type: 'button', 'data-act': 'remove', 'data-i': i, 'aria-label': `把${job.zh}移回候選`, text: '✕' })
      ]));
    } else {
      li.appendChild(el('span', { class: 'ci-rung-placeholder', text: isNext ? '點選右邊的職業放進這裡' : '' }));
      li.appendChild(el('span'));
    }
    ladder.appendChild(li);
  }

  const pool = $('ci-pool');
  pool.innerHTML = '';
  const rest = state.picks
    .filter(sn => !state.ranking.includes(sn))
    .sort((a, b) => CLS_ORDER[state.cls[a]] - CLS_ORDER[state.cls[b]]);
  rest.forEach(sn => {
    pool.appendChild(el('li', {}, [
      el('button', { type: 'button', 'data-sn': sn, disabled: rankingValid() }, [
        document.createTextNode(JOB_BY_SN.get(sn).zh),
        clsTag(sn)
      ])
    ]));
  });
  const empty = $('ci-pool-empty');
  empty.hidden = rest.length > 0 && !rankingValid();
  empty.textContent = rankingValid()
    ? (rest.length ? '前 10 名已排滿。想換人的話，先把某一名移回候選。' : '前 10 名已排滿。')
    : '候選都排進去了。';
}

// 原因欄的範例：每次開啟頁面隨機洗牌，10 個欄位各拿到不同的一句。
// 範例刻意不綁特定職業，任何一名都說得通。
const REASON_EXAMPLES = [
  '想到可以把腦中的畫面做出來，就忍不住興奮……',
  '想像有人因為我的幫忙鬆了一口氣，心裡就熱熱的……',
  '每天都會遇到新的問題要解，光想就覺得不會無聊……',
  '可以一直學新東西，越鑽越深的感覺很過癮……',
  '想像站在台上，大家專心聽我說話的那一刻……',
  '把一團混亂整理得清清楚楚，會讓我很有成就感……',
  '可以到處跑、看不同的地方，不用整天坐在同一個位置……',
  '想到親手做出來的東西被別人用到，就覺得很值得……',
  '喜歡和一群人一起拚一個目標，最後一起慶祝……',
  '可以安靜專心地做一件事，做到很好為止……',
  '想像自己能做決定、帶著大家往前走的樣子……',
  '看到別人一點一點進步，比自己進步還開心……',
  '每天都能動手、動身體，而不是只盯著螢幕……',
  '可以把複雜的東西講到別人一聽就懂，很有趣……',
  '想到能發現別人沒注意到的細節，就很興奮……',
  '工作內容跟我平常就愛做的事一樣，好像在玩……'
];

function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const reasonExamples = shuffled(REASON_EXAMPLES); // 同一次瀏覽內固定，來回切換步驟不會一直換

// Step 5：名次的原因（必填）＋其他職業的洞察（選填）
function renderReasons() {
  const list = $('ci-reasons');
  list.innerHTML = '';
  state.ranking.forEach((sn, i) => {
    const job = JOB_BY_SN.get(sn);
    const id = 'ci-reason-' + sn;
    const placeholder = '例如：' + reasonExamples[i % reasonExamples.length];
    const ta = el('textarea', { id, class: 'ci-input', 'data-sn': sn, 'data-kind': 'reason', rows: 3, maxlength: 1000, placeholder });
    ta.value = state.reasons[sn] || '';
    list.appendChild(el('li', { class: 'ci-reason' }, [
      el('span', { class: 'ci-rung-num', 'aria-hidden': 'true', text: String(i + 1) }),
      el('div', {}, [
        el('label', { for: id }, [document.createTextNode(`第 ${i + 1} 名：${job.zh}`), el('small', { text: job.en })]),
        ta
      ])
    ]));
  });

  const others = unrankedNonPure();
  $('ci-insights-wrap').hidden = others.length === 0;
  const ins = $('ci-insights');
  ins.innerHTML = '';
  others.forEach(sn => {
    const job = JOB_BY_SN.get(sn);
    const c = state.cls[sn];
    const id = 'ci-insight-' + sn;
    const ta = el('textarea', { id, class: 'ci-input', 'data-sn': sn, 'data-kind': 'insight', rows: 2, maxlength: 1000, placeholder: INSIGHT_PLACEHOLDERS[c] });
    ta.value = state.insights[sn] || '';
    ins.appendChild(el('li', { class: 'ci-insight' }, [
      el('label', { for: id }, [
        document.createTextNode(job.zh),
        el('span', { class: 'ci-cls-tag', text: CLS_LABELS[c] })
      ]),
      ta
    ]));
  });
}

// Step 6：六大類統計＋反思
function renderStatsAndReflections() {
  const stats = hollandStats();
  const n = pureList().length;
  $('ci-stats-desc').textContent =
    `依你「純粹喜歡」的 ${n} 個職業計算：每個職業的興趣代碼可能有 2–3 個字母，每個字母各算一次。出現最多的是你的主要類型：${primaryTypeText(stats)}。`;

  const list = $('ci-stats');
  list.innerHTML = '';
  stats.ranked.forEach(r => {
    const isTop = stats.primary.includes(r);
    const pct = stats.top > 0 ? Math.round(r.count / stats.top * 100) : 0;
    const bar = el('span', { class: 'ci-stat-bar' }, [el('span', { class: 'ci-stat-fill' })]);
    bar.firstChild.style.width = pct + '%';
    list.appendChild(el('li', { class: 'ci-stat' + (isTop ? ' is-top' : '') }, [
      el('span', { class: 'ci-stat-label' }, [
        el('span', { class: 'ci-stat-code', text: r.code }),
        document.createTextNode(r.label)
      ]),
      bar,
      el('span', { class: 'ci-stat-count', text: `${r.count} 次` })
    ]));
  });

  const qs = reflectionQuestions();
  const rl = $('ci-reflections');
  rl.innerHTML = '';
  qs.forEach((q, i) => {
    const id = 'ci-reflect-' + i;
    const ta = el('textarea', { id, class: 'ci-input', 'data-i': i, rows: 3, maxlength: 1000 });
    ta.value = state.reflections[i] || '';
    rl.appendChild(el('li', { class: 'ci-reflection' }, [el('label', { for: id, text: q }), ta]));
  });
}

function reviewBlock(title, editStep, rows) {
  return el('section', { class: 'ci-review-block' }, [
    el('div', { class: 'ci-review-head' }, [
      el('h3', { class: 'ci-sub-title', text: title }),
      el('button', { type: 'button', class: 'ci-link', 'data-goto': editStep, 'aria-label': `修改${title}`, text: '修改' })
    ]),
    el('dl', { class: 'ci-review-dl' }, rows.flatMap(([k, v]) => [
      el('dt', { text: k }),
      el('dd', { text: v || '（未填寫）', class: v ? '' : 'is-empty' })
    ]))
  ]);
}

function renderReview() {
  const list = $('ci-review-list');
  list.innerHTML = '';
  state.ranking.forEach((sn, i) => {
    const job = JOB_BY_SN.get(sn);
    list.appendChild(el('li', { class: 'ci-review-item' }, [
      el('span', { class: 'ci-rung-num', 'aria-hidden': 'true', text: String(i + 1) }),
      el('div', {}, [
        el('p', { class: 'ci-review-name' }, [
          el('span', { class: 'ci-visually-hidden', text: `第 ${i + 1} 名 ` }),
          document.createTextNode(job.zh),
          clsTag(sn),
          el('small', { text: job.en })
        ]),
        el('p', { class: 'ci-review-reason', text: (state.reasons[sn] || '').trim() })
      ]),
      el('button', { type: 'button', class: 'ci-link', 'data-sn': sn, 'aria-label': `修改${job.zh}的原因`, text: '修改' })
    ]));
  });

  const extra = $('ci-review-extra');
  extra.innerHTML = '';
  ['others', 'capable'].forEach(c => {
    const sns = unrankedNonPure(c);
    if (sns.length) {
      extra.appendChild(reviewBlock(CLS_LABELS[c], 5,
        sns.map(sn => [JOB_BY_SN.get(sn).zh, (state.insights[sn] || '').trim()])));
    }
  });
  const stats = hollandStats();
  extra.appendChild(reviewBlock('興趣類型與反思', 6, [
    ['主要類型', primaryTypeText(stats)],
    ...reflectionQuestions().map((q, i) => [q, (state.reflections[i] || '').trim()])
  ]));
}

/** 回到第 5 步並把焦點放在指定職業的原因欄 */
function editReason(sn) {
  goTo(5);
  const ta = $('ci-reason-' + sn);
  if (ta) {
    ta.scrollIntoView({ block: 'center' });
    ta.focus();
  }
}

function renderDone() {
  $('ci-done-type').textContent = pureList().length
    ? `你的主要類型：${primaryTypeText(hollandStats())}`
    : '';
  const list = $('ci-done-list');
  list.innerHTML = '';
  state.ranking.forEach(sn => {
    list.appendChild(el('li', {}, [
      el('strong', { text: JOB_BY_SN.get(sn).zh }),
      el('p', { text: state.reasons[sn] || '' })
    ]));
  });
}

let submitting = false;

function renderBar() {
  const bar = $('ci-bar');
  const step = state.step;
  if (step === 1 || step === 'done') { bar.hidden = true; return; }
  bar.hidden = false;

  const count = $('ci-bar-count');
  const next = $('ci-next');
  next.textContent = '下一步';

  if (step === 2) {
    const n = state.picks.length;
    count.innerHTML = `已選 <b>${n}</b> / ${PICK_MAX}` + (n < PICK_MIN ? `<br>至少再選 ${PICK_MIN - n} 個` : '');
    next.disabled = !picksValid();
  } else if (step === 3) {
    const pure = pureList().length;
    const left = state.picks.length - classifiedCount();
    count.innerHTML = `純粹喜歡 <b>${pure}</b> 個` +
      (left > 0 ? `<br>還有 ${left} 個沒分類` : pure < PURE_MIN ? `<br>至少要 ${PURE_MIN} 個，可回上一步多挑幾個` : '');
    next.disabled = !canEnter(4);
  } else if (step === 4) {
    count.innerHTML = `已排 <b>${state.ranking.length}</b> / ${RANK_SIZE}`;
    next.disabled = !rankingValid();
  } else if (step === 5) {
    const n = reasonsFilled();
    count.innerHTML = `已寫 <b>${n}</b> / ${state.ranking.length}`;
    next.disabled = n < state.ranking.length;
  } else if (step === 6) {
    count.textContent = '反思可以留空';
    next.textContent = '檢查內容';
    next.disabled = false;
  } else if (step === 'review') {
    count.textContent = '確認無誤再送出';
    next.textContent = submitting ? '送出中…' : (state.submittedAt ? '確認重新送出' : '確認送出給 Saori');
    next.disabled = submitting;
  }
}

// ─── 職業說明彈窗 ────────────────────────────────────────────────────────────
// 不顯示興趣代碼：挑選時看到代碼會影響直覺選擇
function openJobInfo(sn) {
  const job = JOB_BY_SN.get(sn);
  const d = JOB_DETAILS[sn];
  const dialog = $('ci-dialog');
  if (!job || !d || !dialog || typeof dialog.showModal !== 'function') return;
  $('ci-dialog-title').textContent = job.zh;
  $('ci-dialog-code').textContent = job.en;
  $('ci-dialog-desc').textContent = d.desc;
  const fill = (id, items) => {
    const ul = $(id);
    ul.innerHTML = '';
    items.forEach(t => ul.appendChild(el('li', { text: t })));
  };
  fill('ci-dialog-work', d.work);
  fill('ci-dialog-traits', d.traits);
  dialog.dataset.sn = sn;
  dialog.showModal();
}

function closeJobInfo() {
  const dialog = $('ci-dialog');
  if (!dialog || !dialog.open) return;
  const sn = dialog.dataset.sn;
  dialog.close();
  // 焦點回到原本的說明鈕
  const back = document.querySelector(`.ci-job-info[data-info="${sn}"]`);
  if (back) back.focus();
}

// ─── Step 1：驗證註冊名稱 ───────────────────────────────────────────────────
function gasConfigured() {
  return !!CI_GAS_URL && CI_GAS_URL.indexOf('PASTE_') !== 0;
}

async function checkName(name) {
  const url = `${CI_GAS_URL}?action=check&token=${encodeURIComponent(CI_TOKEN)}&name=${encodeURIComponent(name)}`;
  const res = await fetch(url);
  return res.json();
}

async function onNameSubmit(e) {
  e.preventDefault();
  const input = $('ci-name');
  const msg = $('ci-name-msg');
  const btn = $('ci-name-btn');
  const name = (input.value || '').trim();
  msg.classList.remove('is-error');

  if (!name) {
    msg.textContent = '請先輸入註冊名稱。';
    msg.classList.add('is-error');
    input.focus();
    return;
  }
  if (!gasConfigured()) {
    msg.textContent = '工具還沒有連上試算表，請通知 Saori。';
    msg.classList.add('is-error');
    return;
  }

  btn.disabled = true;
  msg.textContent = '確認中…';
  try {
    const result = await checkName(name);
    if (result && result.ok) {
      // 換了一個名稱、而裝置上還有別人的進度時，先確認
      if (state.name && state.name !== name && state.picks.length > 0) {
        const ok = window.confirm(`這台裝置上有「${state.name}」未完成的進度，要清除並以「${name}」重新開始嗎？`);
        if (!ok) { msg.textContent = ''; return; }
        clearState();
      }
      state.name = name;
      msg.textContent = '';
      goTo(2);
    } else {
      const errors = {
        not_found: `找不到「${name}」這個註冊名稱。請確認和 Saori 給你的名稱完全一致，包含大小寫與空格。`,
        unauthorized: '工具設定有誤，請通知 Saori。'
      };
      msg.textContent = errors[result && result.error] || '確認失敗，請稍後再試。';
      msg.classList.add('is-error');
    }
  } catch (err) {
    msg.textContent = '連線失敗，請檢查網路後再試。';
    msg.classList.add('is-error');
  } finally {
    btn.disabled = false;
  }
}

// ─── Step 2：挑選 ────────────────────────────────────────────────────────────
function togglePick(sn) {
  const i = state.picks.indexOf(sn);
  if (i >= 0) {
    state.picks.splice(i, 1);
    delete state.cls[sn];
    state.ranking = state.ranking.filter(x => x !== sn); // 取消挑選時同步移出名次
  } else {
    if (state.picks.length >= PICK_MAX) {
      showToast(`最多選 ${PICK_MAX} 個，先取消一個再選。`);
      return;
    }
    state.picks.push(sn);
  }
  saveState();
  renderJobs();
  renderBar();
  const again = document.querySelector(`.ci-job[data-sn="${sn}"]`);
  if (again) again.focus();
}

// ─── Step 3：分類 ────────────────────────────────────────────────────────────
function setClass(sn, c) {
  state.cls[sn] = c;
  saveState();
  const item = document.querySelector(`input[name="ci-cls-${sn}"]`);
  if (item) item.closest('.ci-cls-item').classList.add('is-set');
  renderBar();
}

// ─── Step 4：排序 ────────────────────────────────────────────────────────────
function addToRanking(sn) {
  if (rankingValid() || state.ranking.includes(sn)) return;
  state.ranking.push(sn);
  saveState();
  renderRanking();
  renderBar();
}

function onLadderAction(act, i) {
  const r = state.ranking;
  if (act === 'up' && i > 0) [r[i - 1], r[i]] = [r[i], r[i - 1]];
  if (act === 'down' && i < r.length - 1) [r[i + 1], r[i]] = [r[i], r[i + 1]];
  if (act === 'remove') r.splice(i, 1);
  saveState();
  renderRanking();
  renderBar();
  // 讓鍵盤使用者的焦點跟著移動的項目
  if (act !== 'remove') {
    const target = act === 'up' ? i - 1 : i + 1;
    const b = document.querySelector(`#ci-ladder [data-act="${act}"][data-i="${target}"]:not(:disabled)`)
           || document.querySelector(`#ci-ladder [data-i="${target}"]:not(:disabled)`);
    if (b) b.focus();
  }
}

// ─── 送出 ────────────────────────────────────────────────────────────────────
let textSaveTimer = null;
function saveSoon() {
  clearTimeout(textSaveTimer);
  textSaveTimer = setTimeout(saveState, 400);
}

function buildPayload() {
  const reasons = {};
  state.ranking.forEach(sn => { reasons[sn] = (state.reasons[sn] || '').trim(); });
  const classifications = {};
  const insights = {};
  state.picks.forEach(sn => {
    classifications[sn] = state.cls[sn];
    const t = (state.insights[sn] || '').trim();
    if (state.cls[sn] !== 'pure' && !state.ranking.includes(sn) && t) insights[sn] = t;
  });
  const reflections = reflectionQuestions().map((q, i) => ({ q, a: (state.reflections[i] || '').trim() }));
  return {
    token: CI_TOKEN,
    action: 'submit',
    name: state.name,
    picks: state.picks,
    classifications,
    ranking: state.ranking,
    reasons,
    insights,
    reflections,
    // 分頁是空白時，GAS 會用這份清單補上完整表格
    jobs: JOBS.map(j => [j.sn, `${j.zh} (${j.en})`, j.code])
  };
}

async function submit() {
  const msg = $('ci-submit-msg');
  msg.classList.remove('is-error');
  if (!canEnter('review')) {
    msg.textContent = '還有步驟沒完成，請確認每個名次都寫下原因後再送出。';
    msg.classList.add('is-error');
    return;
  }
  if (!gasConfigured()) {
    msg.textContent = '工具還沒有連上試算表，請通知 Saori。你的內容已存在這台裝置上。';
    msg.classList.add('is-error');
    return;
  }

  submitting = true;
  renderBar();
  msg.textContent = '';
  try {
    const res = await fetch(CI_GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' }, // 簡單請求，避免 CORS preflight
      body: JSON.stringify(buildPayload())
    });
    const result = await res.json();
    if (result && result.ok) {
      state.submittedAt = new Date().toISOString();
      submitting = false;
      goTo('done');
      showToast('已送出給 Saori');
      return;
    }
    const errors = {
      not_found: `試算表裡找不到「${state.name}」分頁，請通知 Saori。你的內容已存在這台裝置上。`,
      invalid_data: '資料不完整，請確認每一步都完成後再送出。',
      unauthorized: '工具設定有誤，請通知 Saori。'
    };
    msg.textContent = errors[result && result.error] || '送出失敗，請稍後再試。你的內容已存在這台裝置上。';
    msg.classList.add('is-error');
  } catch (err) {
    msg.textContent = '連線失敗，請檢查網路後再試。你的內容已存在這台裝置上。';
    msg.classList.add('is-error');
  } finally {
    submitting = false;
    if (state.step === 'review') renderBar();
  }
}

// ─── 事件綁定 ────────────────────────────────────────────────────────────────
function resetAll() {
  clearState();
  $('ci-name').value = '';
  $('ci-search').value = '';
  $('ci-resume').hidden = true;
  render();
}

function bindEvents() {
  $('ci-name-form').addEventListener('submit', onNameSubmit);

  $('ci-search').addEventListener('input', renderJobs);
  $('ci-jobs').addEventListener('click', e => {
    const info = e.target.closest('.ci-job-info');
    if (info) { openJobInfo(Number(info.dataset.info)); return; }
    const btn = e.target.closest('.ci-job');
    if (btn && !btn.disabled) togglePick(Number(btn.dataset.sn));
  });

  $('ci-dialog-close').addEventListener('click', closeJobInfo);
  $('ci-dialog').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeJobInfo(); // 點背景關閉
  });

  $('ci-cls-list').addEventListener('change', e => {
    const r = e.target.closest('input[type="radio"][data-sn]');
    if (r) setClass(Number(r.dataset.sn), r.value);
  });

  $('ci-pool').addEventListener('click', e => {
    const btn = e.target.closest('button[data-sn]');
    if (btn && !btn.disabled) addToRanking(Number(btn.dataset.sn));
  });
  $('ci-ladder').addEventListener('click', e => {
    const btn = e.target.closest('button[data-act]');
    if (btn && !btn.disabled) onLadderAction(btn.dataset.act, Number(btn.dataset.i));
  });

  $('panel-5').addEventListener('input', e => {
    const ta = e.target.closest('textarea[data-sn]');
    if (!ta) return;
    const bucket = ta.dataset.kind === 'insight' ? state.insights : state.reasons;
    bucket[ta.dataset.sn] = ta.value;
    renderBar();
    saveSoon();
  });

  $('ci-reflections').addEventListener('input', e => {
    const ta = e.target.closest('textarea[data-i]');
    if (!ta) return;
    state.reflections[Number(ta.dataset.i)] = ta.value;
    saveSoon();
  });

  $('ci-review-list').addEventListener('click', e => {
    const btn = e.target.closest('button[data-sn]');
    if (btn) editReason(Number(btn.dataset.sn));
  });
  $('ci-review-extra').addEventListener('click', e => {
    const btn = e.target.closest('button[data-goto]');
    if (btn) goTo(Number(btn.dataset.goto));
  });

  $('ci-prev').addEventListener('click', () => {
    if (state.step === 'review') goTo(6);
    else if (typeof state.step === 'number' && state.step > 1) goTo(state.step - 1);
  });
  $('ci-next').addEventListener('click', () => {
    if (state.step === 'review') submit();
    else if (state.step === 6) goTo('review');
    else if (typeof state.step === 'number') goTo(state.step + 1);
  });

  $('ci-steps').addEventListener('click', e => {
    const li = e.target.closest('li[data-step]');
    const btn = e.target.closest('button');
    if (li && btn && !btn.disabled) goTo(Number(li.dataset.step));
  });

  $('ci-restart').addEventListener('click', () => {
    if (window.confirm('確定要清除這台裝置上的所有進度，從頭開始嗎？')) resetAll();
  });

  $('ci-edit-again').addEventListener('click', () => goTo(5));
  $('ci-clear-done').addEventListener('click', () => {
    if (!window.confirm('清除後，這台裝置上就看不到這份清單了，已送出的資料不受影響。確定清除嗎？')) return;
    resetAll();
    showToast('已清除這台裝置上的紀錄');
  });
}

// ─── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  bindEvents();
  // 進度不完整時（例如舊版進度還沒分類），退回到最後一個可進入的步驟
  if (state.step === 'review' && !canEnter('review')) state.step = 6;
  if (typeof state.step === 'number') {
    while (state.step > 1 && !canEnter(state.step)) state.step--;
  }
  // 有未完成進度時，提示並提供重新開始
  if (state.step !== 1 && state.step !== 'done') $('ci-resume').hidden = false;
  render();
});
