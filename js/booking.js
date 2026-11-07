// booking.html：選狀況、待辦打勾＋進度、Cal.com 彈出日曆

const STORAGE_KEY = 'heysaori-booking-tasks';
const MODE_KEY = 'heysaori-booking-mode';
const MODES = ['first', 'credits', 'renew'];

// ── 存在這台裝置的瀏覽器裡（私密模式或封鎖時就不記，頁面照常可用） ──
function readStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // 存不了就算了，這次瀏覽仍然有效
  }
}

// 每種狀況分開記打勾，避免上次第一次預約勾過的，這次重新購買時還顯示已完成
function tasksKey(mode) {
  return mode === 'first' ? STORAGE_KEY : `${STORAGE_KEY}-${mode}`;
}

function loadDoneTasks(mode) {
  try {
    return JSON.parse(readStorage(tasksKey(mode))) || [];
  } catch (e) {
    return [];
  }
}

function hasWord(list, word) {
  return (list || '').split(' ').includes(word);
}

// ── 依狀況決定每一項要不要顯示、是不是可選 ──
function applyMode(tasks, mode) {
  const doneTasks = loadDoneTasks(mode);

  tasks.forEach((task) => {
    const isShown = hasWord(task.dataset.modes, mode);
    const isOptional = hasWord(task.dataset.optional, mode);
    const checkbox = task.querySelector('.task-check');
    task.hidden = !isShown;
    task.classList.toggle('is-optional', isOptional);
    checkbox.checked = doneTasks.includes(task.dataset.task);
    task.classList.toggle('is-done', checkbox.checked);
  });

  // 整組都沒有要做的事，就把整組（含標題）藏起來
  document.querySelectorAll('.booking .link-group').forEach((group) => {
    group.hidden = !group.querySelector('.task:not([hidden])');
  });

  renderProgress(tasks);
}

function renderProgress(tasks) {
  const required = tasks.filter((task) => !task.hidden && !task.classList.contains('is-optional'));
  const doneCount = required.filter((task) => task.querySelector('.task-check').checked).length;
  const total = required.length;
  const progress = document.querySelector('.booking-progress');
  const text = document.querySelector('#progressText');
  const fill = document.querySelector('#progressFill');
  if (!progress || !text || !fill || total === 0) return;

  fill.style.width = `${(doneCount / total) * 100}%`;
  progress.classList.toggle('is-complete', doneCount === total);
  text.innerHTML = doneCount === total
    ? '都完成了，等 Saori 確認後就會跟你聯絡。'
    : `已完成 <strong>${doneCount}</strong> / ${total}`;
}

function initBooking() {
  const tasks = [...document.querySelectorAll('.task[data-task]')];
  const radios = [...document.querySelectorAll('input[name="visit"]')];
  const hint = document.querySelector('#visitHint');
  if (tasks.length === 0) return;

  const savedMode = readStorage(MODE_KEY);
  let mode = MODES.includes(savedMode) ? savedMode : 'first';

  function selectMode(nextMode) {
    mode = nextMode;
    const radio = radios.find((r) => r.value === mode);
    if (radio) radio.checked = true;
    if (hint && radio) hint.textContent = radio.dataset.hint;
    applyMode(tasks, mode);
  }

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      writeStorage(MODE_KEY, radio.value);
      selectMode(radio.value);
    });
  });

  tasks.forEach((task) => {
    const checkbox = task.querySelector('.task-check');
    if (!checkbox) return;
    checkbox.addEventListener('change', () => {
      task.classList.toggle('is-done', checkbox.checked);
      const done = tasks
        .filter((t) => !t.hidden && t.querySelector('.task-check').checked)
        .map((t) => t.dataset.task);
      writeStorage(tasksKey(mode), JSON.stringify(done));
      renderProgress(tasks);
    });
  });

  selectMode(mode);
}

// ── Cal.com 彈出日曆：程式碼從 Cal.com「透過點閱元素彈出」複製，主題改成淺色配合網站 ──
// 觸發按鈕是 booking.html 裡有 data-cal-link 的「選時間」
function initCalendarPopup() {
  (function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
  Cal("init", "50mins", { origin: "https://app.cal.com" });
  Cal.config = Cal.config || {};
  Cal.config.forwardQueryParams = true;

  // 日曆配色：對應 saori-base.css 的色票
  Cal.ns["50mins"]("ui", {
    "theme": "light",
    "cssVarsPerTheme": {
      "light": {
        "cal-brand": "#8b6f47",
        "cal-bg": "#ffffff",
        "cal-bg-muted": "#f5f0e8",
        "cal-bg-subtle": "#f5f0e8",
        "cal-bg-emphasis": "#ede7da",
        "cal-border": "#ede7da",
        "cal-border-subtle": "#ede7da",
        "cal-text": "#2e2b26",
        "cal-text-emphasis": "#1c1a17"
      },
      "dark": { "cal-brand": "#d4a96a" }
    },
    "hideEventTypeDetails": false,
    "layout": "month_view"
  });
}

initBooking();
initCalendarPopup();
