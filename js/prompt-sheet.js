/* ── Prompt 預覽面板（三個 Prompt 產生器共用） ──
 * 使用頁面：Page_prompt_generator.html、shoppage_prompt_generator.html、Tool_prompt_generator.html
 * 搭配樣式：css/prompt-generator.css（.pg-sheet 區塊）
 *
 * 邊填邊顯示完整 Prompt；按「複製 Prompt」時才檢查必填。
 * 各頁只要提供三個函式，Prompt 的內容與檢查規則仍由各頁決定：
 *   build()    → 回傳目前的完整 Prompt 文字（沒填的欄位用各頁的預設文字）
 *   check()    → 有問題回傳 { message, focusId }，沒問題回傳 null
 *   progress() → 回傳 { done, total }，必填完成幾項
 *
 * 用法：
 *   PromptSheet.init(document.getElementById('promptSheet'), { build, check, progress, lang, emptyMarks })
 *   PromptSheet.update()          // 欄位以外的變動（例如點選標籤）後呼叫
 *   PromptSheet.setLang('en')
 */
const PromptSheet = (function () {
  const TEXT = {
    zh: {
      title: '你的 Prompt',
      left: n => `必填還差 ${n} 項`,
      ready: '必填都完成了，可以複製',
      copy: '複製 Prompt',
      copied: '✓ 已複製 Prompt',
      copyFailed: '瀏覽器沒有允許複製。請直接選取上面的文字，再按 Ctrl+C（Mac 是 ⌘+C）。',
      open: '查看',
      close: '收起',
      pasteHint: '複製後貼到 AI：',
      note: '灰色的部分是你還沒寫的，AI 會先問你。',
    },
    en: {
      title: 'Your prompt',
      left: n => `${n} required ${n === 1 ? 'field' : 'fields'} left`,
      ready: 'All required fields are done — ready to copy',
      copy: 'Copy prompt',
      copied: '✓ Prompt copied',
      copyFailed: 'Your browser blocked copying. Select the text above and press Ctrl+C (⌘+C on Mac).',
      open: 'View',
      close: 'Hide',
      pasteHint: 'Paste it into an AI:',
      note: 'Grey parts are still empty — the AI will ask you about them.',
    },
  };
  const AI_LINKS = [
    ['Claude', 'https://claude.ai'],
    ['ChatGPT', 'https://chatgpt.com'],
    ['Gemini', 'https://gemini.google.com'],
    ['Manus', 'https://manus.im/invitation/TMWHJSKMHUFT?utm_source=invitation&utm_medium=social&utm_campaign=copy_link'],
    ['Perplexity', 'https://www.perplexity.ai'],
  ];

  let root, opts, lang = 'zh', pending = false;
  const t = key => TEXT[lang][key];
  const $ = sel => root.querySelector(sel);

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  // 把「還沒填」的預設文字標成灰色，使用者一眼看出哪裡還空著
  // 預覽時把「=====」分隔線畫成細線；複製出去的文字不變
  function drawRules(html) {
    return html.replace(/\n?^={10,}$\n?/gm, '<span class="sheet-rule" aria-hidden="true"></span>');
  }

  function markEmpty(html) {
    (opts.emptyMarks || []).forEach(mark => {
      const m = escapeHtml(mark);
      html = html.split(m).join(`<span class="sheet-empty">${m}</span>`);
    });
    return html;
  }

  function render() {
    pending = false;
    if (!root) return;
    $('.sheet-text').innerHTML = drawRules(markEmpty(escapeHtml(opts.build())));
    const { done, total } = opts.progress();
    const left = Math.max(total - done, 0);
    const status = $('.sheet-status');
    status.textContent = left ? t('left')(left) : t('ready');
    status.classList.toggle('is-ready', !left);
    root.style.setProperty('--sheet-progress', total ? done / total : 1);
  }

  function update() {
    if (pending) return;
    pending = true;
    setTimeout(render, 0);
  }

  function showMessage(msg) {
    const box = $('.sheet-msg');
    box.textContent = msg || '';
    box.hidden = !msg;
  }

  function focusField(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const details = el.closest('details');
    if (details) details.open = true;
    setOpen(false);
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.focus({ preventScroll: true });
  }

  function copy() {
    const problem = opts.check();
    if (problem) {
      showMessage(problem.message);
      if (problem.focusId) focusField(problem.focusId);
      return;
    }
    showMessage('');
    writeClipboard(opts.build()).then(ok => {
      if (!ok) { showMessage(t('copyFailed')); return; }
      const toast = document.getElementById('toast');
      if (!toast) return;
      toast.textContent = t('copied');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2200);
    });
  }

  // 先用新的剪貼簿 API；被瀏覽器擋下時，改用舊方法再試一次
  function writeClipboard(text) {
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      return ok;
    };
    if (!navigator.clipboard || !navigator.clipboard.writeText) return Promise.resolve(fallback());
    return navigator.clipboard.writeText(text).then(() => true, () => fallback());
  }

  // 手機版：面板收在畫面底部，點「查看」展開
  function setOpen(open) {
    root.classList.toggle('is-open', open);
    const btn = $('.sheet-toggle');
    btn.textContent = open ? t('close') : t('open');
    btn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('sheet-locked', open);
  }

  function applyText() {
    $('.sheet-title').textContent = t('title');
    $('.sheet-copy').textContent = t('copy');
    $('.sheet-paste-hint').textContent = t('pasteHint');
    $('.sheet-note').textContent = t('note');
    setOpen(root.classList.contains('is-open'));
  }

  function init(el, options) {
    root = el;
    opts = options;
    lang = TEXT[options.lang] ? options.lang : 'zh';
    root.classList.add('pg-sheet');
    root.setAttribute('aria-label', 'Prompt');
    root.innerHTML = `
      <div class="sheet-head">
        <div class="sheet-head-text">
          <h2 class="sheet-title"></h2>
          <p class="sheet-status" aria-live="polite"></p>
        </div>
        <button type="button" class="sheet-toggle" aria-expanded="false"></button>
      </div>
      <div class="sheet-progress" aria-hidden="true"></div>
      <div class="sheet-body">
        <div class="sheet-paper"><div class="sheet-text"></div></div>
        <p class="sheet-note"></p>
        <p class="sheet-msg" role="alert" hidden></p>
        <button type="button" class="primary sheet-copy"></button>
        <div class="sheet-ai">
          <span class="sheet-paste-hint"></span>
          ${AI_LINKS.map(([name, href]) => `<a href="${href}" target="_blank" rel="noopener">${name}</a>`).join('')}
        </div>
      </div>`;
    $('.sheet-copy').addEventListener('click', copy);
    $('.sheet-toggle').addEventListener('click', () => setOpen(!root.classList.contains('is-open')));
    document.addEventListener('input', () => { showMessage(''); update(); });
    document.addEventListener('change', () => { showMessage(''); update(); });
    applyText();
    render();
  }

  function setLang(newLang) {
    if (!root) return;
    lang = TEXT[newLang] ? newLang : 'zh';
    applyText();
    showMessage('');
    render();
  }

  return { init, update, setLang };
})();
