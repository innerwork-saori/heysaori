/* work-style.js — 個人風格檢核表
 * 流程：5 組 × 8 個工作要素，每組三輪篩選（8 → 4 → 2 → 1），依選擇累計四種風格的分數。
 * 純前端計算，不存檔、不送出。
 */

// ─── 題庫 ────────────────────────────────────────────────────────────────────
// 每組 8 項，位置固定對應 TYPE_OF（理智、理智、開創、開創、組織、組織、情感、情感）
const WS_SETS = [
  ['獨當一面', '綜整研判', '變化多元', '創新獨特', '規劃組織', '井然有序', '同理情感', '接觸人群'],
  ['實事求是', '問題解析', '實驗嘗試', '規劃遠景', '掌控管理', '資料彙整', '支持輔導', '建立關係'],
  ['追根究底', '邏輯思考', '創新研發', '無拘無束', '建立規則', '行政處理', '傾聽他人', '團隊合作'],
  ['績效導向', '數據分析', '發揮想像', '推銷想法', '協調支援', '注重細節', '感性溫馨', '教育咨詢'],
  ['明快決策', '分析推理', '創意設計', '新奇刺激', '執行計畫', '按部就班', '關懷弱勢', '協助他人']
];
const WS_TYPE_OF = ['R', 'R', 'I', 'I', 'O', 'O', 'F', 'F'];

// 每組三輪：選 4 個（各 +1）→ 從中選 2 個（各 +2）→ 再選 1 個（+2），單項最高 5 分
const WS_ROUNDS = [
  { pick: 4, point: 1 },
  { pick: 2, point: 2 },
  { pick: 1, point: 2 }
];

// 單一風格每組最高 8 分（兩項都進前 4、前 2，其中一項留到最後）
const WS_MAX_PER_TYPE = WS_SETS.length * 8;

const WS_TYPES = {
  I: {
    name: '開創型',
    trait: '想法鮮活多變，勇於嘗試，工作時強調創新與嘗試。但有時可能會因為過於求新求變，致使在工作執行時會不切實際、虎頭蛇尾。',
    pro: '創意思考、勇於嘗試',
    con: '天馬行空、不切實際'
  },
  F: {
    name: '情感型',
    trait: '人際互動特質強，樂於助人，工作時強調團隊的和諧與合作。但有時可能會因為太過人際考量，而較為優柔寡斷。',
    pro: '關懷可親、樂於助人',
    con: '感情用事、優柔寡斷'
  },
  O: {
    name: '組織型',
    trait: '事務管理特質強，工作時強調按部就班，任務執行謹慎可靠。但有時可能會因為太過強調條理組織，而欠缺彈性。',
    pro: '按部就班、組織條理',
    con: '較少彈性、不愛變通'
  },
  R: {
    name: '理智型',
    trait: '邏輯分析特質強，工作時重視證據、數據，行事重視追根究底。但有時會因為對事不對人，而影響人際相處的氣氛。',
    pro: '邏輯分析、就事論事',
    con: '義正嚴辭、心直口快'
  }
};
const WS_TIE_ORDER = ['I', 'F', 'O', 'R']; // 同分時的顯示順序（與原版檢核表一致）
const WS_BAR_ORDER = ['R', 'O', 'I', 'F'];

// ─── 狀態 ────────────────────────────────────────────────────────────────────
const state = {
  setIdx: 0,
  roundIdx: 0,
  score: { R: 0, I: 0, O: 0, F: 0 },
  alive: new Set(),    // 這一輪還能選的項目
  selected: new Set()  // 這一輪目前選到的項目
};

const el = (id) => document.getElementById(id);
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── 狀態變更 ────────────────────────────────────────────────────────────────
function resetQuiz() {
  state.setIdx = 0;
  state.score = { R: 0, I: 0, O: 0, F: 0 };
  startSet();
}

function startSet() {
  state.roundIdx = 0;
  state.alive = new Set(WS_TYPE_OF.keys());
  state.selected = new Set();
}

function toggleOption(i) {
  if (!state.alive.has(i)) return;
  const need = WS_ROUNDS[state.roundIdx].pick;
  if (state.selected.has(i)) {
    state.selected.delete(i);
  } else if (need === 1) {
    state.selected = new Set([i]); // 最後一輪直接換選，不用先取消
  } else if (state.selected.size >= need) {
    renderCount(`只能選 ${need} 個，先取消一個再換`);
    return;
  } else {
    state.selected.add(i);
  }
  renderOptions();
  renderCount();
}

// 回傳 true 表示整份測驗結束
function commitRound() {
  const round = WS_ROUNDS[state.roundIdx];
  state.selected.forEach((i) => { state.score[WS_TYPE_OF[i]] += round.point; });
  state.alive = new Set(state.selected);
  state.selected = new Set();
  state.roundIdx += 1;
  if (state.roundIdx < WS_ROUNDS.length) return false;
  state.setIdx += 1;
  if (state.setIdx >= WS_SETS.length) return true;
  startSet();
  return false;
}

function topTypes() {
  const top = Math.max(...Object.values(state.score));
  return WS_TIE_ORDER.filter((t) => state.score[t] === top);
}

// ─── 畫面 ────────────────────────────────────────────────────────────────────
function showPanel(id) {
  ['ws-home', 'ws-quiz', 'ws-result'].forEach((p) => { el(p).hidden = p !== id; });
}

// 焦點給 target（讓鍵盤與螢幕閱讀器接上），畫面捲到 scrollTarget（預設同一個）
function focusTop(target, scrollTarget = target) {
  target.focus({ preventScroll: true });
  scrollTarget.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

function renderProgress() {
  const stepsDone = state.setIdx * WS_ROUNDS.length + state.roundIdx;
  el('ws-progress').innerHTML = WS_SETS.map((_, s) =>
    '<span class="ws-progress-set">' + WS_ROUNDS.map((_, r) => {
      const n = s * WS_ROUNDS.length + r;
      const cls = n < stepsDone ? 'is-done' : n === stepsDone ? 'is-current' : '';
      return `<i class="${cls}"></i>`;
    }).join('') + '</span>'
  ).join('');
  el('ws-progress').setAttribute('aria-label',
    `第 ${state.setIdx + 1} 組，共 ${WS_SETS.length} 組；第 ${state.roundIdx + 1} 輪，共 ${WS_ROUNDS.length} 輪`);
}

function renderQuestion() {
  const need = WS_ROUNDS[state.roundIdx].pick;
  el('ws-set-label').textContent = `第 ${state.setIdx + 1} 組，共 ${WS_SETS.length} 組`;
  el('ws-question').textContent = state.roundIdx === 0
    ? `選出 ${need} 個比較像你的`
    : state.roundIdx === 1
      ? `從這 4 個裡，再留下 ${need} 個`
      : '最後，只留下最像你的 1 個';
  const lastStep = state.setIdx === WS_SETS.length - 1 && state.roundIdx === WS_ROUNDS.length - 1;
  el('ws-next').textContent = lastStep ? '看結果' : '下一步';
}

function renderOptions() {
  el('ws-grid').innerHTML = WS_SETS[state.setIdx].map((word, i) => {
    const out = !state.alive.has(i);
    const on = state.selected.has(i);
    return `<button type="button" class="ws-opt${on ? ' is-on' : ''}${out ? ' is-out' : ''}" data-i="${i}" aria-pressed="${on}"${out ? ' disabled' : ''}>${word}</button>`;
  }).join('');
}

function renderCount(warning) {
  const need = WS_ROUNDS[state.roundIdx].pick;
  const n = state.selected.size;
  const count = el('ws-count');
  count.classList.toggle('is-warn', Boolean(warning));
  count.textContent = warning || `已選 ${n} / ${need}`;
  el('ws-next').disabled = n !== need;
}

function renderRound() {
  renderProgress();
  renderQuestion();
  renderOptions();
  renderCount();
}

function renderResult() {
  el('ws-top').innerHTML = topTypes().map((t) => {
    const x = WS_TYPES[t];
    return `<article class="ws-type" data-type="${t}">
      <h2 class="ws-type-name">${x.name}</h2>
      <p class="ws-type-trait">${x.trait}</p>
      <dl class="ws-type-points">
        <div><dt>優勢</dt><dd>${x.pro}</dd></div>
        <div><dt>要留意</dt><dd>${x.con}</dd></div>
      </dl>
    </article>`;
  }).join('');

  el('ws-bars').innerHTML = WS_BAR_ORDER.map((t) => {
    const pct = Math.round(state.score[t] / WS_MAX_PER_TYPE * 100);
    return `<li class="ws-bar" data-type="${t}">
      <span class="ws-bar-name">${WS_TYPES[t].name}</span>
      <span class="ws-bar-track"><span class="ws-bar-fill" style="width:${pct}%"></span></span>
      <span class="ws-bar-score">${state.score[t]}</span>
      <span class="ws-bar-pro">${WS_TYPES[t].pro}</span>
    </li>`;
  }).join('');
}

// ─── 事件 ────────────────────────────────────────────────────────────────────
function handleStart() {
  resetQuiz();
  showPanel('ws-quiz');
  renderRound();
  focusTop(el('ws-question'));
}

function handleNext() {
  if (state.selected.size !== WS_ROUNDS[state.roundIdx].pick) return;
  const finished = commitRound();
  if (finished) {
    renderResult();
    showPanel('ws-result');
    focusTop(el('ws-top'), el('ws-result'));
    return;
  }
  renderRound();
  // 換組時整組字都換了，把焦點帶回題目；同組內的下一輪留在原位，看得到哪些被劃掉
  if (state.roundIdx === 0) focusTop(el('ws-question'));
}

function handleAgain() {
  showPanel('ws-home');
  focusTop(el('ws-home'));
}

function init() {
  if (!el('ws-start') || !el('ws-grid')) return;
  el('ws-home').tabIndex = -1;
  el('ws-start').addEventListener('click', handleStart);
  el('ws-next').addEventListener('click', handleNext);
  el('ws-again').addEventListener('click', handleAgain);
  el('ws-grid').addEventListener('click', (e) => {
    const opt = e.target.closest('.ws-opt');
    if (opt) {
      toggleOption(Number(opt.dataset.i));
      // 重繪後把焦點放回同一格，鍵盤操作才不會掉
      const again = el('ws-grid').querySelector(`[data-i="${opt.dataset.i}"]`);
      if (again && !again.disabled) again.focus({ preventScroll: true });
    }
  });
}

init();
