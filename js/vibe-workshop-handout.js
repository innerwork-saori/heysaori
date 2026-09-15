
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
  } else if (msg) {
    msg.classList.add('show');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  restoreOs();

  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  if (form && input) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      runSearch(input.value);
    });
  }
});
