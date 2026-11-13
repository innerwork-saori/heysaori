/* career-4s.js — 轉換期 4S 盤點
 * 流程：15 題（情境 4、自我 4、支持 4、策略 3），每題 1–5 分，一次一題。
 * 各面向取平均（題數不同，不能直接比總分），平均最低的就是最需要補的那一塊。
 * 純前端計算，不存檔、不送出；GA 只記開始、完成與最弱面向，不含使用者輸入的文字。
 */

// ─── 內容 ────────────────────────────────────────────────────────────────────
// 每題的 5 分都代表「這是幫助你的資源」，1 分代表「這在拖住你」。
// tip：這一題分數低時，建議這週做的一件小事。
const FS_AREAS = [
  {
    key: 'situation',
    name: '這件事本身',
    theory: '情境 Situation',
    weak: '讓你慌的，多半是這個改變本身：來得突然、時機不巧，或太多事要從頭學。這不代表你能力不夠，是這一局本來就比較難。',
    questions: [
      { q: '這個改變，是你自己選的嗎？', low: '完全是被迫的', high: '完全是我選的',
        tip: '寫下這件事裡「我還能決定」的三件小事，先挑一件做。' },
      { q: '它來的時間點好嗎？', hint: '想想同一時間，你手上還有沒有別的壓力。', low: '偏偏挑最亂的時候', high: '來得正是時候',
        tip: '列出現在同時壓著你的事，挑一件這週先放下或延後。' },
      { q: '新的環境裡，有多少事要從頭學？', low: '幾乎全都是新的', high: '大部分我已經會了',
        tip: '約主管或前輩聊 15 分鐘，問清楚前三個月最重要的三件事。' },
      { q: '你以前走過類似的改變嗎？', hint: '換工作、換角色、換領域都算。', low: '完全沒有', high: '有，而且走過來了',
        tip: '回想一次你走過來的改變（換學校、搬家也算），寫下當時幫到你的兩個做法。' }
    ]
  },
  {
    key: 'self',
    name: '你自己',
    theory: '自我 Self',
    weak: '這段時間你對自己比較沒把握。剛進入新角色時懷疑自己很常見，不等於你做不到。',
    questions: [
      { q: '你有多少把握能撐過這一段？', low: '幾乎沒把握', high: '很有把握',
        tip: '每天下班前記下 2 件今天做得順或學會的小事，連續記一週。' },
      { q: '想到接下來的日子，你的心情比較接近哪一邊？', low: '很怕出錯', high: '期待能學到東西',
        tip: '把最擔心的一句話寫下來，在旁邊改寫成「這是個考驗，但我可以學到⋯⋯」。' },
      { q: '這個新方向，是你真正在乎的嗎？', low: '跟我在乎的差很遠', high: '很符合我在乎的',
        tip: '寫下工作上你最在乎的三件事，對照新方向，看哪幾件有對上。' },
      { q: '你分得清自己缺的是技能，還是只是缺信心嗎？', low: '一團亂，說不清', high: '很清楚缺什麼',
        tip: '把擔心的事分成兩欄：「我還不會的」和「我會但沒把握的」，各挑一項先處理。' }
    ]
  },
  {
    key: 'support',
    name: '身邊的人',
    theory: '支持 Support',
    weak: '你現在比較像一個人在扛。能問的人、能靠的後援還不夠，或是其實有，但你還沒開口。',
    questions: [
      { q: '家人或伴侶，理解並支持你的決定嗎？', low: '不理解或反對', high: '很支持',
        tip: '找一個晚上跟家人或伴侶說說你的打算，也說出你希望他們怎麼幫你。' },
      { q: '有沒有走過這條路的人可以讓你問？', hint: '前輩、導師、資深同事都算。', low: '一個都沒有', high: '有，而且問得到',
        tip: '聯絡一位走過類似路的前輩，約 20 分鐘請教他當時怎麼過來的。' },
      { q: '課程、社群、諮詢或存款，這類後援夠用嗎？', low: '幾乎沒有', high: '很夠',
        tip: '找一個相關社群或課程加入，順便算一下存款能撐幾個月。' },
      { q: '需要幫忙的時候，你開得了口嗎？', low: '很難開口', high: '很自然就問了',
        tip: '這週向一個人問一個小問題，從最不尷尬的那個人開始。' }
    ]
  },
  {
    key: 'strategy',
    name: '你的做法',
    theory: '策略 Strategies',
    weak: '你手上的應對方法還不夠多。動手處理、換個角度看、照顧壓力，三種都要有一點才撐得久。',
    questions: [
      { q: '你有在動手處理這件事嗎？', hint: '例如問人、學新東西、改履歷、排每天的計畫。', low: '還沒開始', high: '持續在做',
        tip: '挑一件最小的事今天就做：改履歷的一段、報名一堂入門課，或問一個人。' },
      { q: '你能換個角度看這件事嗎？', hint: '例如把它當成學習的機會，或接受自己慢慢上手。', low: '很難，一直往壞處想', high: '常常可以',
        tip: '把「我要一次到位」改成「我先做到七成」，寫下這週的七成長什麼樣子。' },
      { q: '你有在照顧自己的壓力嗎？', hint: '運動、休息、做喜歡的事、找人說說都算。', low: '完全沒有', high: '固定在做',
        tip: '在行事曆上排三個 30 分鐘給自己：散步、運動，或什麼都不做。' }
    ]
  }
];

const FS_SCALE = [1, 2, 3, 4, 5];
const FS_STRONG_AT = 4; // 平均 4 分以上：穩
const FS_OK_AT = 3;     // 3 分以上：還可以；以下：偏弱
const FS_ADVANCE_DELAY = 260; // 點選後停一下再跳題，讓人看見自己選了什麼

// 把題目攤平成一維，方便一次一題往前往後
const FS_FLAT = FS_AREAS.flatMap((area, a) =>
  area.questions.map((question, i) => ({ areaIdx: a, qIdx: i, question }))
);

// ─── 狀態 ────────────────────────────────────────────────────────────────────
const state = {
  step: 0,
  answers: new Array(FS_FLAT.length).fill(null),
  change: ''
};
let advanceTimer = null;

const el = (id) => document.getElementById(id);
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── 計算（不碰 DOM）────────────────────────────────────────────────────────
function areaAnswers(areaIdx) {
  return FS_FLAT.map((item, n) => (item.areaIdx === areaIdx ? state.answers[n] : null))
    .filter((v) => v !== null);
}

function areaAverage(areaIdx) {
  const list = areaAnswers(areaIdx);
  return list.reduce((sum, v) => sum + v, 0) / list.length;
}

function statusOf(avg) {
  if (avg >= FS_STRONG_AT) return '穩';
  if (avg >= FS_OK_AT) return '還可以';
  return '偏弱';
}

// 回傳 { averages, weakest: [areaIdx…], strongest: [areaIdx…] }，同分時並列
function summarize() {
  const averages = FS_AREAS.map((_, a) => areaAverage(a));
  const min = Math.min(...averages);
  const max = Math.max(...averages);
  const idxOf = (target) => averages.map((v, a) => (v === target ? a : -1)).filter((a) => a >= 0);
  return { averages, weakest: idxOf(min), strongest: idxOf(max), min, max };
}

// 這個面向裡分數最低的那一題（同分取第一題）
function lowestQuestion(areaIdx) {
  const scores = areaAnswers(areaIdx);
  const lowest = scores.indexOf(Math.min(...scores));
  return FS_AREAS[areaIdx].questions[lowest];
}

function formatScore(avg) {
  return avg.toFixed(1);
}

// ─── GA ──────────────────────────────────────────────────────────────────────
function track(name, params) {
  if (typeof gtag === 'function') gtag('event', name, params || {});
}

// ─── 畫面 ────────────────────────────────────────────────────────────────────
function showPanel(id) {
  ['fs-home', 'fs-quiz', 'fs-result'].forEach((p) => { el(p).hidden = p !== id; });
}

// 焦點給 target（讓鍵盤與螢幕閱讀器接上），畫面捲到 scrollTarget
function focusTop(target, scrollTarget = target) {
  target.focus({ preventScroll: true });
  scrollTarget.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
}

function renderProgress() {
  el('fs-progress').innerHTML = FS_AREAS.map((area, a) =>
    '<span class="fs-progress-area" style="flex:' + area.questions.length + '">' +
    FS_FLAT.map((item, n) => {
      if (item.areaIdx !== a) return '';
      const cls = n < state.step ? 'is-done' : n === state.step ? 'is-current' : '';
      return `<i class="${cls}"></i>`;
    }).join('') + '</span>'
  ).join('');
  el('fs-progress').setAttribute('aria-label', `第 ${state.step + 1} 題，共 ${FS_FLAT.length} 題`);
}

function renderQuestion() {
  const { areaIdx, question } = FS_FLAT[state.step];
  const chosen = state.answers[state.step];

  el('fs-part').textContent = `${FS_AREAS[areaIdx].name}　第 ${state.step + 1} 題，共 ${FS_FLAT.length} 題`;
  el('fs-question').textContent = question.q;
  el('fs-hint').textContent = question.hint || '';
  el('fs-hint').hidden = !question.hint;
  el('fs-end-low').textContent = question.low;
  el('fs-end-high').textContent = question.high;

  el('fs-scale').innerHTML = FS_SCALE.map((v) => {
    const on = chosen === v;
    const end = v === 1 ? `，${question.low}` : v === 5 ? `，${question.high}` : '';
    return `<button type="button" class="fs-score${on ? ' is-on' : ''}" data-v="${v}" aria-pressed="${on}" aria-label="${v} 分${end}">${v}</button>`;
  }).join('');

  el('fs-prev').disabled = state.step === 0;
  el('fs-next').disabled = chosen === null;
  el('fs-next').textContent = state.step === FS_FLAT.length - 1 ? '看結果' : '下一題';
}

function renderStep() {
  renderProgress();
  renderQuestion();
}

function renderResult() {
  const sum = summarize();
  const allStrong = sum.min >= FS_STRONG_AT;
  const allTied = sum.max === sum.min;

  const echo = el('fs-change-echo');
  echo.hidden = !state.change;
  echo.textContent = state.change ? `你正在面對：${state.change}` : ''; // textContent：使用者輸入不進 innerHTML

  const actionBlock = (question) => `<div class="fs-action">
        <h3 class="fs-action-title">這週做一件小事</h3>
        <p class="fs-action-text">${question.tip}</p>
        <p class="fs-action-why">因為這一題你給的分數最低：${question.q}</p>
      </div>`;

  if (allTied) {
    // 四項同分：沒有哪一隻特別短，改從全部題目裡分數最低的那一題給建議
    const lowest = FS_FLAT[state.answers.indexOf(Math.min(...state.answers))].question;
    el('fs-result-label').textContent = '盤點結果';
    el('fs-weak').innerHTML = `<article class="fs-weak-item fs-weak-even">
      <h2 class="fs-weak-name">四隻腳一樣長</h2>
      <p class="fs-weak-desc">${allStrong
        ? '四個方向都站得穩，照現在的步調走就好。想更穩的話，可以從下面這件小事開始。'
        : '沒有哪一隻特別短，所以不用急著找「問題出在哪」。先從分數最低的那一題開始補。'}</p>
      ${actionBlock(lowest)}
    </article>`;
  } else {
    el('fs-result-label').textContent = allStrong
      ? '四隻腳都站得穩。想更穩的話，可以多顧一點的是'
      : '你現在最需要補的是';
    el('fs-weak').innerHTML = sum.weakest.map((a) => {
      const area = FS_AREAS[a];
      return `<article class="fs-weak-item">
      <h2 class="fs-weak-name">${area.name}</h2>
      <p class="fs-weak-theory">4S 理論裡的「${area.theory}」</p>
      ${allStrong ? '' : `<p class="fs-weak-desc">${area.weak}</p>`}
      ${actionBlock(lowestQuestion(a))}
    </article>`;
    }).join('');
  }

  el('fs-legs').innerHTML = FS_AREAS.map((area, a) => {
    const avg = sum.averages[a];
    const weak = !allStrong && !allTied && sum.weakest.includes(a);
    return `<li class="fs-leg${weak ? ' is-weak' : ''}">
      <span class="fs-leg-slot" aria-hidden="true"><span class="fs-leg-bar" style="height:${avg / 5 * 100}%"></span></span>
      <span class="fs-leg-name">${area.name}</span>
      <span class="fs-leg-score">${formatScore(avg)}</span>
      <span class="fs-leg-status">${statusOf(avg)}</span>
    </li>`;
  }).join('');

  el('fs-strong').hidden = allTied;
  if (!allTied) {
    const names = sum.strongest.map((a) => `「${FS_AREAS[a].name}」`).join('和');
    el('fs-strong').textContent = `你最穩的是${names}。先靠它撐著，再慢慢補短的那一邊。`;
  }

  return sum;
}

// ─── 事件 ────────────────────────────────────────────────────────────────────
function handleStart() {
  state.step = 0;
  state.answers.fill(null);
  state.change = el('fs-change').value.trim();
  showPanel('fs-quiz');
  renderStep();
  focusTop(el('fs-question'), el('fs-quiz'));
  track('career_4s_start');
}

function goNext() {
  clearTimeout(advanceTimer);
  if (state.answers[state.step] === null) return;
  if (state.step < FS_FLAT.length - 1) {
    state.step += 1;
    renderStep();
    el('fs-question').focus({ preventScroll: true });
    return;
  }
  const sum = renderResult();
  showPanel('fs-result');
  focusTop(el('fs-weak'), el('fs-result'));
  track('career_4s_complete', { weakest: sum.weakest.map((a) => FS_AREAS[a].key).join(',') });
}

function goPrev() {
  clearTimeout(advanceTimer);
  if (state.step === 0) return;
  state.step -= 1;
  renderStep();
  el('fs-question').focus({ preventScroll: true });
}

function handleScore(value) {
  state.answers[state.step] = value;
  renderQuestion();
  // 重繪後把焦點放回同一格，鍵盤操作才不會掉
  const again = el('fs-scale').querySelector(`[data-v="${value}"]`);
  if (again) again.focus({ preventScroll: true });
  clearTimeout(advanceTimer);
  advanceTimer = setTimeout(goNext, FS_ADVANCE_DELAY);
}

function handleAgain() {
  showPanel('fs-home');
  focusTop(el('fs-home'));
}

function init() {
  if (!el('fs-start') || !el('fs-scale')) return;
  el('fs-home').tabIndex = -1;
  el('fs-start').addEventListener('click', handleStart);
  el('fs-next').addEventListener('click', goNext);
  el('fs-prev').addEventListener('click', goPrev);
  el('fs-again').addEventListener('click', handleAgain);
  el('fs-change').addEventListener('keydown', (e) => { if (e.key === 'Enter') handleStart(); });
  el('fs-scale').addEventListener('click', (e) => {
    const btn = e.target.closest('.fs-score');
    if (btn) handleScore(Number(btn.dataset.v));
  });
}

init();
