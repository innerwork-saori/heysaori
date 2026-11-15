/* countdown-2026.html：依今天的日期（台北時間）顯示倒數進度與當天的提問。
   題目來源是「48 天新年倒數提問日曆」試算表，改題目時兩邊要一起改。
   預覽特定日期：網址加上 ?date=2026-12-05 */

const COUNTDOWN_START = '2026-11-14'; // 第一題的發布日
const COUNTDOWN_TOTAL_DAYS = 48;

const COUNTDOWN_WEEKS = [
  {
    theme: '回顧',
    questions: [
      '如果把今年寫成一本書，書名會是什麼？',
      '今年最讓你驕傲的一件事是什麼？為什麼是它？',
      '今年最痛的一次經驗，教會了你什麼？',
      '今年你學會了什麼，是年初的你不會相信的？',
      '今年有誰出現在你的生命裡，改變了你什麼？',
      '今年有哪個瞬間，你覺得「我現在這樣就很好」？',
      '回頭看這七天，你最想對今年的自己說一句什麼？'
    ]
  },
  {
    theme: '放下',
    questions: [
      '有什麼事你一直撐著在做，其實早就不想做了？',
      '你正在為哪一種「應該」而活？',
      '有沒有一段關係，需要你調整彼此的距離？',
      '你還在等誰的認可？',
      '哪一個舊版本的自己，是時候讓他退休了？',
      '手機、信箱或桌面上，有什麼今天就可以清掉？',
      '放下之後，你替自己騰出了什麼空間？'
    ]
  },
  {
    theme: '價值',
    questions: [
      '如果不用顧慮別人的眼光，你最想怎麼過一天？',
      '你最近一次忘了時間，是在做什麼？',
      '你最羨慕誰的生活？羨慕的究竟是什麼？',
      '你願意為什麼事情吃苦？',
      '有什麼是你絕對不願意妥協的？',
      '說說一個你欣賞的人：他身上哪個特質，你也想擁有？',
      '把這週的答案濃縮成三個價值詞，會是哪三個？'
    ]
  },
  {
    theme: '工作',
    questions: [
      '如果現在的工作明年就消失，你會想念它的哪一部分？',
      '這一年，你的哪一項能力變強了？',
      '工作中什麼事讓你耗能，什麼事讓你充電？',
      '你有哪些成果，還沒好好寫進履歷或自我介紹？',
      '明年你想轉向、深化，還是維持現狀？理由是什麼？',
      '誰是你想找來聊聊職涯的人？這週就傳訊息給他。',
      '明年在職涯上，你想做的一個小實驗是什麼？'
    ]
  },
  {
    theme: '能量',
    questions: [
      '這一年，誰讓你覺得被理解？',
      '你最近一次好好說「謝謝」，是對誰說的？',
      '有什麼話，你一直沒有說出口？',
      '你的身體最近在告訴你什麼？',
      '你用什麼方式休息，才是真的有充到電？',
      '有什麼事你需要向誰求助，卻遲遲沒有開口？',
      '明年你想把更多時間留給誰？'
    ]
  },
  {
    theme: '想像',
    questions: [
      '一年後的今天，你希望自己過著什麼樣的一天？',
      '如果要為 2027 選一個關鍵字，會是什麼？',
      '如果明年只能做三件事，你會選哪三件？',
      '有哪一句話，你希望明年不再對自己說？',
      '有什麼事，你願意在明年勇敢地「失敗看看」？',
      '如果恐懼消失一天，你會去做什麼？',
      '寫一封短信給一年後的自己，你會說什麼？'
    ]
  },
  {
    theme: '行動',
    questions: [
      '把你的 2027 關鍵字，拆成一個三個月內能做到的目標。',
      '這個目標最小的第一步是什麼？能在 10 分鐘內開始嗎？',
      '什麼最可能讓你半途而廢？你要怎麼事先準備？',
      '誰可以陪你、提醒你？你要怎麼開口請他幫忙？',
      '今年的最後一天，你想用什麼方式，跟 2026 好好道別？',
      '新年第一天，你最想為自己做的一件小事是什麼？'
    ]
  }
];

/* ── 資料計算 ── */

// 今天的日期字串（YYYY-MM-DD，台北時間）；網址帶 ?date= 時以它為準，方便預覽
function getTodayString() {
  const override = new URLSearchParams(location.search).get('date');
  if (override && /^\d{4}-\d{2}-\d{2}$/.test(override)) return override;
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(new Date());
}

function daysBetween(fromString, toString) {
  const toUtc = (s) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  return Math.round((toUtc(toString) - toUtc(fromString)) / 86400000);
}

// 回傳目前進度：status 是 'before'（還沒開始）、'running'、'ended'
function getCountdownProgress(todayString) {
  const dayIndex = daysBetween(COUNTDOWN_START, todayString);
  if (dayIndex < 0) return { status: 'before' };
  if (dayIndex >= COUNTDOWN_TOTAL_DAYS) return { status: 'ended' };

  const weekIndex = Math.floor(dayIndex / 7);
  const week = COUNTDOWN_WEEKS[weekIndex];
  return {
    status: 'running',
    dayNumber: dayIndex + 1,
    daysLeft: COUNTDOWN_TOTAL_DAYS - dayIndex,
    weekNumber: weekIndex + 1,
    theme: week.theme,
    question: week.questions[dayIndex % 7]
  };
}

/* ── 畫面更新 ── */

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderProgressBar(dayNumber) {
  const bar = document.getElementById('countdownBar');
  const track = bar && bar.parentElement;
  if (!bar || !track) return;
  bar.style.width = (dayNumber / COUNTDOWN_TOTAL_DAYS * 100) + '%';
  track.setAttribute('aria-valuenow', String(dayNumber));
}

function markWeeks(currentWeekNumber) {
  document.querySelectorAll('.countdown-weeks li[data-week]').forEach((li) => {
    const week = Number(li.dataset.week);
    li.classList.toggle('is-current', week === currentWeekNumber);
    li.classList.toggle('is-done', week < currentWeekNumber);
  });
}

function renderCountdown(progress) {
  // 還沒開始：保留 HTML 裡寫好的第一天內容
  if (progress.status === 'before') return;

  if (progress.status === 'ended') {
    setText('countdownIntro', '48 天的倒數已經走完了。');
    setText('countdownTodayLabel', '倒數已結束');
    setText('countdownQuestion', '這 48 天，你最想留下哪一個答案？');
    setText('countdownProgressText', '48 天，全部走完了');
    renderProgressBar(COUNTDOWN_TOTAL_DAYS);
    markWeeks(COUNTDOWN_WEEKS.length + 1);
    return;
  }

  setText('countdownDaysLeft', String(progress.daysLeft));
  setText('countdownTodayLabel', `W${progress.weekNumber} ${progress.theme}`);
  setText('countdownQuestion', progress.question);
  setText('countdownProgressText', `第 ${progress.dayNumber} 天 / 共 ${COUNTDOWN_TOTAL_DAYS} 天・再 ${progress.daysLeft} 天就是 2027`);
  renderProgressBar(progress.dayNumber);
  markWeeks(progress.weekNumber);
}

renderCountdown(getCountdownProgress(getTodayString()));
