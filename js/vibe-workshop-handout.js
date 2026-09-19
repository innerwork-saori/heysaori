
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  if (item) item.classList.toggle('open');
}

function switchOs(os) {
  document.querySelectorAll('.os-tab').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.os === os);
  });
  document.querySelectorAll('.os-panel').forEach(function (panel) {
    panel.classList.toggle('os-hidden', panel.dataset.os !== os);
  });
  try { localStorage.setItem('ws-os', os); } catch (e) {}
}

function restoreOs() {
  let os = 'win';
  try { os = localStorage.getItem('ws-os') || 'win'; } catch (e) {}
  if (document.querySelector('.os-tab[data-os="' + os + '"]')) {
    switchOs(os);
  }
}

function copyCode(btn) {
  const wrap = btn.closest('.code-block-wrap');
  const codeEl = wrap ? wrap.querySelector('.code-block') : null;
  if (!codeEl) return;
  const text = codeEl.textContent;

  const markCopied = function () {
    const original = btn.textContent;
    btn.textContent = '已複製 ✓';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 1500);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(markCopied).catch(function () {
      fallbackCopy(text, markCopied);
    });
  } else {
    fallbackCopy(text, markCopied);
  }
}

function fallbackCopy(text, onDone) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try { document.execCommand('copy'); onDone(); } catch (e) {}
  document.body.removeChild(textarea);
}

function runSearch(query) {
  const msg = document.getElementById('searchMsg');
  const q = (query || '').trim().toLowerCase();
  if (msg) msg.classList.remove('show');
  if (!q) return;

  const tokens = q.split(/\s+/).filter(Boolean);
  const sections = document.querySelectorAll('.ws-section');
  let target = null;

  let bestScore = 0;
  sections.forEach(function (sec) {
    const text = sec.textContent.toLowerCase();
    if (!tokens.every(function (t) { return text.includes(t); })) return;
    const score = tokens.reduce(function (sum, t) {
      return sum + (text.split(t).length - 1);
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      target = sec;
    }
  });

  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    target.classList.remove('search-hit');
    requestAnimationFrame(function () { target.classList.add('search-hit'); });
    setTimeout(function () { target.classList.remove('search-hit'); }, 1600);
    return true;
  }
  if (msg) msg.classList.add('show');
  return false;
}

function setSearchOpen(open) {
  const bar = document.getElementById('searchBar');
  const toggle = document.getElementById('searchToggle');
  const input = document.getElementById('searchInput');
  if (!bar || !toggle) return;
  bar.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  if (open && input) input.focus();
}

function initSearchToggle() {
  const bar = document.getElementById('searchBar');
  const toggle = document.getElementById('searchToggle');
  if (!bar || !toggle) return;

  toggle.addEventListener('click', function () {
    setSearchOpen(!bar.classList.contains('open'));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && bar.classList.contains('open')) {
      setSearchOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (bar.classList.contains('open') && !e.target.closest('#pageTools')) setSearchOpen(false);
  });
}

// 捲動時，錨點列標出目前讀到的章節，並把它捲到橫向列的中間（手機上列表放不下）
function initAnchorSpy() {
  const row = document.getElementById('anchorNav');
  const tools = document.getElementById('pageTools');
  if (!row || !tools) return;

  const topNav = document.querySelector('.nav');
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = [];
  row.querySelectorAll('.anchor-link').forEach(function (link) {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) items.push({ link: link, target: target });
  });
  if (!items.length) return;

  let current = null;
  let locked = false;
  let lockTimer = null;
  let ticking = false;

  function setCurrent(item) {
    if (item === current) return;
    if (current) {
      current.link.classList.remove('active');
      current.link.removeAttribute('aria-current');
    }
    current = item;
    if (!item) return;
    item.link.classList.add('active');
    item.link.setAttribute('aria-current', 'true');
    if (row.scrollWidth > row.clientWidth) {
      const left = item.link.offsetLeft - (row.clientWidth - item.link.offsetWidth) / 2;
      row.scrollTo({ left: left, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  function update() {
    ticking = false;
    if (locked) return;
    const line = (topNav ? topNav.offsetHeight : 0) + tools.offsetHeight + 40;
    let found = null;
    items.forEach(function (it) {
      if (it.target.getBoundingClientRect().top <= line) found = it;
    });
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) found = items[items.length - 1];
    setCurrent(found);
  }

  // 點錨點後的平滑捲動期間不跟著中途經過的章節跳動，捲完（150ms 沒有新捲動）再更新
  function lockUntilScrollEnds(ms) {
    locked = true;
    clearTimeout(lockTimer);
    lockTimer = setTimeout(function () { locked = false; update(); }, ms);
  }

  window.addEventListener('scroll', function () {
    if (locked) {
      lockUntilScrollEnds(150);
      return;
    }
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  row.addEventListener('click', function (e) {
    const link = e.target.closest('.anchor-link');
    if (!link) return;
    const item = items.find(function (it) { return it.link === link; });
    if (!item) return;
    setCurrent(item);
    lockUntilScrollEnds(1200);
  });

  update();
}

document.addEventListener('DOMContentLoaded', function () {
  restoreOs();
  initSearchToggle();
  initAnchorSpy();

  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  if (form && input) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (runSearch(input.value)) setSearchOpen(false);
    });
  }
});
