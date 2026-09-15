const STUDENT_PAGE = 'vibe-workshop-handout.html';
const ANCHOR_LABELS = {
  '#tools': '🧰 工具準備',
  '#structure': '📋 架構',
  '#step1': 'Step 1 網站',
  '#step1-tool': 'Step 1 工具',
  '#step2': 'Step 2 生成',
  '#faq': '❓ FAQ',
  '#step3': 'Step 3 上架',
  '#install': '⚙️ 安裝環境',
  '#step4': 'Step 4 優化'
};

const QUICK_LINKS = [
  { name: '網站 Prompt 產生器', url: 'Page_prompt_generator.html' },
  { name: '工具 Prompt 產生器', url: 'Tool_prompt_generator.html' },
  { name: 'GitHub 說明書', url: 'https://hackmd.io/@Socrates/rJvFgZMhbe' },
  { name: 'LINE 群組', url: 'https://line.me/ti/g/eJ9lnlPpD6' },
  { name: '課後問卷', url: null }
];

let chapters = [];
let activeId = null;
let timerInterval = null;

function storageGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch (e) { return fallback; }
}
function storageSet(key, value) {
  try { localStorage.setItem(key, value); } catch (e) {}
}
function storageRemove(key) {
  try { localStorage.removeItem(key); } catch (e) {}
}

async function init() {
  try {
    const res = await fetch('data/workshop-chapters.json');
    const data = await res.json();
    chapters = data.chapters;
  } catch (e) {
    document.getElementById('chapterView').innerHTML = '<p class="loading">章節資料載入失敗，請確認 data/workshop-chapters.json 存在。</p>';
    return;
  }

  renderSidebar();
  renderLinksPanel();

  const lastId = storageGet('wsp-active-chapter', null);
  const startId = (lastId && chapters.some(function (c) { return c.id === lastId; })) ? lastId : chapters[0].id;
  selectChapter(startId);
}

function renderSidebar() {
  const list = document.getElementById('chapterList');
  list.innerHTML = '';
  chapters.forEach(function (ch) {
    if (ch.type === 'appendix') {
      const divider = document.createElement('li');
      divider.className = 'chapter-divider';
      list.appendChild(divider);
    }

    const li = document.createElement('li');
    li.className = 'chapter-item' + (ch.type === 'break' ? ' is-break' : '') + (ch.type === 'appendix' ? ' is-appendix' : '');
    li.dataset.id = ch.id;

    if (ch.type !== 'break') {
      const check = document.createElement('input');
      check.type = 'checkbox';
      check.className = 'chapter-check';
      check.checked = storageGet('wsp-done-' + ch.id, '') === '1';
      check.addEventListener('click', function (e) { e.stopPropagation(); });
      check.addEventListener('change', function () {
        storageSet('wsp-done-' + ch.id, check.checked ? '1' : '0');
        li.classList.toggle('done', check.checked);
      });
      li.appendChild(check);
      if (check.checked) li.classList.add('done');

      const num = document.createElement('span');
      num.className = 'chapter-num';
      num.textContent = ch.type === 'appendix' ? '📎' : ch.id;
      li.appendChild(num);
    }

    const title = document.createElement('span');
    title.className = 'chapter-title-text';
    title.textContent = ch.title;
    li.appendChild(title);

    li.addEventListener('click', function () { selectChapter(ch.id); });
    list.appendChild(li);
  });
}

function selectChapter(id) {
  activeId = id;
  storageSet('wsp-active-chapter', id);
  document.querySelectorAll('.chapter-item').forEach(function (li) {
    li.classList.toggle('active', li.dataset.id === id);
  });
  renderChapterView(chapters.find(function (c) { return c.id === id; }));
}

function renderChapterView(ch) {
  const view = document.getElementById('chapterView');
  if (!ch) { view.innerHTML = ''; return; }

  const anchorsHtml = (ch.student_anchors || []).map(function (a) {
    const label = ANCHOR_LABELS[a] || a;
    return '<a href="' + STUDENT_PAGE + a + '" target="_blank" rel="noopener">🔗 學員頁：' + label + '</a>';
  }).join('');

  const slideHtml = (ch.content && ch.content.length)
    ? '<ul>' + ch.content.map(function (t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('') + '</ul>'
    : '<p class="empty-note">尚無逐頁內容（簡報文字稿整理後補上）。</p>';

  view.innerHTML =
    '<div class="chapter-eyebrow">' + (ch.type === 'break' ? '休息' : ch.type === 'appendix' ? '附錄' : ('Chapter ' + ch.id)) + '</div>' +
    '<h1>' + escapeHtml(ch.title) + '</h1>' +
    (ch.summary ? '<p class="chapter-summary">' + escapeHtml(ch.summary) + '</p>' : '') +
    (anchorsHtml ? '<div class="anchor-links">' + anchorsHtml + '</div>' : '') +
    '<div class="slide-content">' + slideHtml + '</div>' +
    '<div class="timer-block">' +
      '<div class="block-label">手動休息 / 段落倒數</div>' +
      '<div class="timer-controls">' +
        '<button type="button" class="timer-preset" onclick="startTimer(5)">5 分</button>' +
        '<button type="button" class="timer-preset" onclick="startTimer(10)">10 分</button>' +
        '<button type="button" class="timer-preset" onclick="startTimer(15)">15 分</button>' +
        '<input type="number" class="timer-custom" id="customMinutes" min="1" max="90" placeholder="分鐘">' +
        '<button type="button" class="timer-start" onclick="startCustomTimer()">開始倒數</button>' +
      '</div>' +
    '</div>' +
    '<div class="notes-block">' +
      '<div class="block-label">講師備忘稿</div>' +
      '<textarea class="notes-textarea" id="notesArea" placeholder="這一章要提醒自己的事…">' + escapeHtml(storageGet('wsp-notes-' + ch.id, '')) + '</textarea>' +
    '</div>';

  document.getElementById('notesArea').addEventListener('input', function (e) {
    storageSet('wsp-notes-' + ch.id, e.target.value);
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function resetProgress() {
  if (!confirm('確定要重置本頁的完成勾選、備忘稿與計時記錄嗎？（不會影響章節內容資料）')) return;
  chapters.forEach(function (ch) {
    storageRemove('wsp-done-' + ch.id);
    storageRemove('wsp-notes-' + ch.id);
  });
  storageRemove('wsp-active-chapter');
  renderSidebar();
  selectChapter(chapters[0].id);
}

/* ── TIMER ── */
function startCustomTimer() {
  const val = parseInt(document.getElementById('customMinutes').value, 10);
  if (!val || val <= 0) return;
  startTimer(val);
}

function startTimer(minutes) {
  cancelTimer();
  let remaining = minutes * 60;
  const overlay = document.getElementById('timerOverlay');
  const display = document.getElementById('timerDisplay');
  const label = document.getElementById('timerLabel');
  overlay.hidden = false;
  overlay.classList.remove('warn');
  label.textContent = minutes + ' 分鐘倒數';
  renderTime(display, remaining);

  timerInterval = setInterval(function () {
    remaining--;
    renderTime(display, remaining);
    if (remaining <= 30 && remaining > 0) overlay.classList.add('warn');
    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      label.textContent = '時間到！';
      beep();
    }
  }, 1000);
}

function renderTime(el, seconds) {
  const s = Math.max(0, seconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  el.textContent = String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
}

function cancelTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  document.getElementById('timerOverlay').hidden = true;
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {}
}

/* ── QUICK LINKS / QR ── */
function renderLinksPanel() {
  const grid = document.getElementById('linksGrid');
  grid.innerHTML = QUICK_LINKS.map(function (link, i) {
    if (!link.url) {
      return '<div class="link-row disabled"><span class="link-row-name">' + link.name + '（待補連結）</span></div>';
    }
    return '<div class="link-row">' +
      '<span class="link-row-name">' + link.name + '</span>' +
      '<div class="link-row-actions">' +
        '<a href="' + link.url + '" target="_blank" rel="noopener">開啟</a>' +
        '<button type="button" onclick="showQr(' + i + ')">顯示 QR</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function openLinksPanel() { document.getElementById('linksPanel').hidden = false; }
function closeLinksPanel() { document.getElementById('linksPanel').hidden = true; }

function showQr(index) {
  const link = QUICK_LINKS[index];
  if (!link || !link.url) return;
  const absoluteUrl = new URL(link.url, window.location.href).href;
  document.getElementById('qrTitle').textContent = link.name;
  document.getElementById('qrUrl').textContent = absoluteUrl;
  const holder = document.getElementById('qrCode');
  holder.innerHTML = '';
  new QRCode(holder, { text: absoluteUrl, width: 220, height: 220, colorDark: '#1c1a17', colorLight: '#faf7f2' });
  document.getElementById('qrModal').hidden = false;
}
function closeQr() { document.getElementById('qrModal').hidden = true; }

document.addEventListener('DOMContentLoaded', init);
