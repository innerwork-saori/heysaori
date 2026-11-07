// booking.html：待辦打勾＋進度、Cal.com 彈出日曆

const STORAGE_KEY = 'heysaori-booking-tasks';

// ── 打勾狀態：存在這台裝置的瀏覽器裡（私密模式或封鎖時就不記，頁面照常可用） ──
function loadDoneTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveDoneTasks(doneTasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doneTasks));
  } catch (e) {
    // 存不了就算了，打勾在這次瀏覽仍然有效
  }
}

function renderProgress(tasks) {
  const doneCount = tasks.filter((task) => task.querySelector('.task-check').checked).length;
  const total = tasks.length;
  const progress = document.querySelector('.booking-progress');
  const text = document.querySelector('#progressText');
  const fill = document.querySelector('#progressFill');
  if (!progress || !text || !fill) return;

  fill.style.width = `${(doneCount / total) * 100}%`;
  progress.classList.toggle('is-complete', doneCount === total);
  text.innerHTML = doneCount === total
    ? '六件都完成了，等 Saori 確認後就會跟你聯絡。'
    : `已完成 <strong>${doneCount}</strong> / ${total}`;
}

function initChecklist() {
  const tasks = [...document.querySelectorAll('.task[data-task]')];
  const doneTasks = loadDoneTasks();

  tasks.forEach((task) => {
    const checkbox = task.querySelector('.task-check');
    if (!checkbox) return;
    checkbox.checked = doneTasks.includes(task.dataset.task);
    task.classList.toggle('is-done', checkbox.checked);

    checkbox.addEventListener('change', () => {
      task.classList.toggle('is-done', checkbox.checked);
      const done = tasks
        .filter((t) => t.querySelector('.task-check').checked)
        .map((t) => t.dataset.task);
      saveDoneTasks(done);
      renderProgress(tasks);
    });
  });

  renderProgress(tasks);
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

initChecklist();
initCalendarPopup();
