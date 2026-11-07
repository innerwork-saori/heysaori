/* ── 設計偏好共用模組（Design Preference） ──
 * 使用頁面：Page_prompt_generator.html、shoppage_prompt_generator.html、Tool_prompt_generator.html
 * 搭配樣式：css/design-preference.css
 *
 * 這個模組負責「風格／配色／字型」三個欄位的畫面、選項資料、自訂欄位的顯示與驗證。
 * 怎麼把選到的值寫進 prompt，由各頁自己決定（每頁的預設文字不同）。
 *
 * 用法：
 *   DesignPref.init(containerEl, { lang: 'zh', text: { zh: { phCustomStyle: '…' } }, onChange: fn })
 *   DesignPref.setLang('en')            // 切換語言，保留目前的選擇
 *   DesignPref.validate()               // 回傳錯誤訊息（並 focus 欄位），沒問題回傳 ''
 *   DesignPref.getStyles()              // ['極簡清新風', '自訂的描述…']
 *   DesignPref.getColor()               // '' | '暖橙色調' | 自訂配色文字
 *   DesignPref.getFont()                // '' | 'Noto Sans TC' | 自訂字型文字
 *   DesignPref.getState() / setState()  // 給各頁存到 localStorage（值與語言無關）
 *   DesignPref.reset()
 */
const DesignPref = (function () {
  const TEXT = {
    zh: {
      labelStyle: '風格（按住 shift 不放，滑鼠點選即可多選）',
      styleDetailsSummary: '▸ 風格參考說明',
      styleTableHead: ['風格', '感覺', '常見特徵'],
      labelCustomStyle: '自訂風格描述',
      phCustomStyle: '例：日系和風、帶有手寫感的溫柔插畫風、科幻感深色系……',
      labelColor: '配色',
      labelCustomColor: '自訂配色',
      phCustomColor: '例：奶茶米色 + 深棕色字體',
      colorDetailsSummary: '▸ 配色靈感參考',
      labelFont: '字型',
      labelCustomFont: '自訂字型名稱',
      phCustomFont: '例：Nunito、Source Han Sans、思源黑體',
      fontPreviewText: '字型預覽：品牌感從文字開始',
      required: '*必填',
      errCustomStyle: '選了自訂風格，請填寫你的風格描述 ✏️',
      errCustomColor: '選了自訂配色，請填寫你喜歡的配色描述 🎨',
      errCustomFont: '選了自訂字型，請填寫字型名稱 🔤',
      styleOptions: [
        { key: 'minimal',   label: '極簡清新風', vibe: '乾淨、留白多、耐看',         traits: '白底、簡單排版、少量強調色' },
        { key: 'tech',      label: '專業科技風', vibe: '理性、俐落、像新創官網',      traits: '深色或中性色、卡片區塊、清楚 CTA' },
        { key: 'editorial', label: '雜誌編輯風', vibe: '有質感、重排版',             traits: '大標題、強字體對比、留白節奏明顯' },
        { key: 'illust',    label: '插畫親切風', vibe: '輕鬆、親切、有品牌個性',     traits: '插畫主視覺、柔和配色、活潑' },
        { key: 'bold',      label: '大膽前衛風', vibe: '強烈、吸睛、有設計感',       traits: '粗字體、強對比、故意不那麼工整' },
        { key: 'retro',     label: '復古懷舊風', vibe: '溫暖、有年代感',             traits: '復古配色、襯線字、舊感材質裝飾' },
        { key: 'trendy',    label: '年輕潮流風', vibe: '年輕、亮眼、偏流行感',       traits: '金屬感、亮色、高反差、未來感元素' },
        { key: 'luxury',    label: '高級精品風', vibe: '高級、精緻、質感導向',       traits: '大圖、細緻字體、節制配色、重視氣氛' },
        { key: 'colorful',  label: '活潑多彩風', vibe: '友善、熱鬧、適合活動或教育', traits: '多色系、圓角、明亮插圖或圖塊' },
        { key: 'softbrut',  label: '柔角新粗獷風（Soft Neo-Brutalism）', vibe: '大膽但不刺眼、有個性有溫度', traits: '粗黑邊框 + 圓角、錯位陰影、高對比配色、幾何區塊感' },
        { key: 'custom',    label: '自訂風格（請填下方）', custom: true },
      ],
      colorOptions: [
        { key: '',        label: '（不指定，讓 AI 決定）' },
        { key: 'teal',    label: '柔和藍綠色調' },
        { key: 'orange',  label: '暖橙色調' },
        { key: 'morandi', label: '莫蘭迪中性色' },
        { key: 'mono',    label: '黑白極簡' },
        { key: 'custom',  label: '自訂配色（請填下方）', custom: true },
      ],
      colorLinks: [
        { title: '配色工具', links: [
          { href: 'https://coolors.co/', name: 'Coolors', desc: '快速產生配色組合' },
          { href: 'https://www.happyhues.co/palettes/15', name: 'Happy Hues', desc: '看配色實際套在頁面上的效果' },
        ] },
        { title: '找色碼', links: [
          { href: 'https://www.toodoo.com/db/color.html', name: '色碼表 (Toodoo)' },
          { href: 'https://www.wibibi.com/info.php?tid=372', name: '色碼表 (Wibibi)' },
        ] },
      ],
      fontOptions: [
        { value: '__none__',        label: '（不設定，讓 AI 決定）', none: true },
        { value: 'Noto Sans TC',    label: 'Noto Sans TC（清晰通用）' },
        { value: 'Zen Maru Gothic', label: 'Zen Maru Gothic（圓潤親和）' },
        { value: 'Shippori Mincho', label: 'Shippori Mincho（質感明體）', serif: true },
        { value: 'Kiwi Maru',       label: 'Kiwi Maru（可愛溫暖）' },
        { value: 'Kosugi Maru',     label: 'Kosugi Maru（簡潔圓體）' },
        { value: '__custom__',      label: '自訂字型（請填下方）', custom: true },
      ],
    },
    en: {
      labelStyle: 'Style (hold Shift to select multiple)',
      styleDetailsSummary: '▸ Style Reference Guide',
      styleTableHead: ['Style', 'Vibe', 'Common Traits'],
      labelCustomStyle: 'Custom Style Description',
      phCustomStyle: 'e.g. Japanese minimalism, soft hand-drawn illustration, dark sci-fi aesthetic…',
      labelColor: 'Color Palette',
      labelCustomColor: 'Custom Color',
      phCustomColor: 'e.g. Warm beige + dark brown text',
      colorDetailsSummary: '▸ Color Inspiration',
      labelFont: 'Font',
      labelCustomFont: 'Custom Font Name',
      phCustomFont: 'e.g. Nunito, Outfit, Josefin Sans',
      fontPreviewText: 'Font Preview: Your brand starts with typography',
      required: '*required',
      errCustomStyle: 'You selected Custom Style — please describe your preferred style ✏️',
      errCustomColor: 'You selected Custom Color — please describe your preferred palette 🎨',
      errCustomFont: 'You selected Custom Font — please enter the font name 🔤',
      styleOptions: [
        { key: 'minimal',   label: 'Clean Minimal',      vibe: 'Airy, spacious, timeless',          traits: 'White background, simple layout, subtle accent color' },
        { key: 'tech',      label: 'Tech Professional',  vibe: 'Rational, sharp, startup-like',      traits: 'Dark or neutral tones, card layout, clear CTA' },
        { key: 'editorial', label: 'Editorial',          vibe: 'Polished, typography-driven',        traits: 'Large headlines, strong font contrast, deliberate whitespace' },
        { key: 'illust',    label: 'Illustrative',       vibe: 'Friendly, approachable, branded',    traits: 'Illustration hero, soft palette, playful feel' },
        { key: 'bold',      label: 'Bold & Avant-garde', vibe: 'Striking, design-forward',           traits: 'Heavy type, high contrast, intentionally asymmetric' },
        { key: 'retro',     label: 'Retro / Vintage',    vibe: 'Warm, nostalgic',                    traits: 'Vintage palette, serif fonts, aged textures' },
        { key: 'trendy',    label: 'Trendy & Youthful',  vibe: 'Fresh, vibrant, pop-culture feel',   traits: 'Metallic accents, bright colors, futuristic elements' },
        { key: 'luxury',    label: 'Luxury',             vibe: 'Premium, refined, atmosphere-first', traits: 'Full-bleed imagery, delicate type, restrained palette' },
        { key: 'colorful',  label: 'Colorful & Playful', vibe: 'Welcoming, lively, great for events or education', traits: 'Multi-color, rounded corners, bright illustrations' },
        { key: 'softbrut',  label: 'Soft Neo-Brutalism', vibe: 'Bold but approachable, character with warmth', traits: 'Thick rounded borders, offset shadows, high contrast, geometric blocks' },
        { key: 'custom',    label: 'Custom Style (fill in below)', custom: true },
      ],
      colorOptions: [
        { key: '',        label: '(No preference — let AI decide)' },
        { key: 'teal',    label: 'Soft Blue-Green' },
        { key: 'orange',  label: 'Warm Orange' },
        { key: 'morandi', label: 'Muted Neutral (Morandi)' },
        { key: 'mono',    label: 'Black & White Minimal' },
        { key: 'custom',  label: 'Custom (fill in below)', custom: true },
      ],
      colorLinks: [
        { title: 'Color Tools', links: [
          { href: 'https://coolors.co/', name: 'Coolors', desc: 'Generate palette combinations instantly' },
          { href: 'https://www.happyhues.co/palettes/15', name: 'Happy Hues', desc: 'See palettes applied to real UI' },
        ] },
        { title: 'Find Color Codes', links: [
          { href: 'https://htmlcolorcodes.com/', name: 'HTML Color Codes' },
          { href: 'https://www.colorhexa.com/', name: 'ColorHexa' },
        ] },
      ],
      fontOptions: [
        { value: '__none__',         label: '(No preference — let AI decide)', none: true },
        { value: 'Inter',            label: 'Inter（clean & modern）' },
        { value: 'DM Sans',          label: 'DM Sans（friendly & minimal）' },
        { value: 'Raleway',          label: 'Raleway（elegant sans-serif）' },
        { value: 'Playfair Display', label: 'Playfair Display（editorial）', serif: true },
        { value: 'Lora',             label: 'Lora（warm & literary）', serif: true },
        { value: 'Merriweather',     label: 'Merriweather（readable serif）', serif: true },
        { value: 'EB Garamond',      label: 'EB Garamond（classic & refined）', serif: true },
        { value: '__custom__',       label: 'Custom font (fill in below)', custom: true },
      ],
    },
  };

  let root = null;
  let lang = 'zh';
  let overrides = {};
  let onChange = null;

  function t(key) {
    const o = overrides[lang];
    return o && o[key] !== undefined ? o[key] : TEXT[lang][key];
  }
  function $(id) { return document.getElementById(id); }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  /* ── Render ── */
  const SKELETON = `
    <div class="dp-grid">
      <div class="field">
        <label for="style" data-dp="labelStyle"></label>
        <select id="style" multiple size="5"></select>
        <details class="dp-details">
          <summary data-dp="styleDetailsSummary"></summary>
          <div id="styleDetailsBody" class="dp-table-wrap"></div>
        </details>
        <div id="customStyleWrap" class="dp-custom" hidden>
          <label for="customStyle"><span data-dp="labelCustomStyle"></span> <span class="dp-req" data-dp="required"></span></label>
          <textarea id="customStyle"></textarea>
        </div>
      </div>
      <div class="field">
        <label for="color" data-dp="labelColor"></label>
        <select id="color"></select>
        <div id="customColorWrap" class="dp-custom" hidden>
          <label for="customColor"><span data-dp="labelCustomColor"></span> <span class="dp-req" data-dp="required"></span></label>
          <textarea id="customColor"></textarea>
        </div>
        <details class="dp-details">
          <summary data-dp="colorDetailsSummary"></summary>
          <div id="colorDetailsBody" class="dp-links"></div>
        </details>
      </div>
    </div>
    <div class="field dp-font-field">
      <label for="font" data-dp="labelFont"></label>
      <select id="font"></select>
      <div id="customFontWrap" class="dp-custom" hidden>
        <label for="customFont"><span data-dp="labelCustomFont"></span> <span class="dp-req" data-dp="required"></span></label>
        <input id="customFont">
      </div>
      <div id="fontPreview" class="dp-font-preview" data-dp="fontPreviewText"></div>
    </div>`;

  function fillOptions(sel, options, valueKey) {
    sel.innerHTML = '';
    options.forEach(o => {
      const el = document.createElement('option');
      el.value = o[valueKey];
      el.textContent = o.label;
      sel.appendChild(el);
    });
  }

  function renderStyleTable() {
    const [h1, h2, h3] = t('styleTableHead');
    const rows = t('styleOptions').filter(o => !o.custom)
      .map(o => `<tr><td>${escapeHtml(o.label)}</td><td>${escapeHtml(o.vibe)}</td><td>${escapeHtml(o.traits)}</td></tr>`)
      .join('');
    $('styleDetailsBody').innerHTML =
      `<table class="dp-table"><thead><tr><th>${h1}</th><th>${h2}</th><th>${h3}</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  function renderColorLinks() {
    $('colorDetailsBody').innerHTML = t('colorLinks').map(group =>
      `<div class="dp-links-title">${escapeHtml(group.title)}</div>` +
      group.links.map(l =>
        `<div>· <a href="${l.href}" target="_blank" rel="noopener">${escapeHtml(l.name)}</a>${l.desc ? ' — ' + escapeHtml(l.desc) : ''}</div>`
      ).join('')
    ).join('');
  }

  /* ── Sync visibility / preview ── */
  function selectedStyleKeys() {
    return [...$('style').selectedOptions].map(o => o.value);
  }
  function fontOption() {
    return t('fontOptions').find(o => o.value === $('font').value) || t('fontOptions')[0];
  }

  function syncUI() {
    $('customStyleWrap').hidden = !selectedStyleKeys().includes('custom');
    $('customColorWrap').hidden = $('color').value !== 'custom';
    const f = fontOption();
    $('customFontWrap').hidden = !f.custom;
    $('fontPreview').style.fontFamily = (f.none || f.custom) ? '' : `'${f.value}', ${f.serif ? 'serif' : 'sans-serif'}`;
  }

  /* ── Public API ── */
  function init(container, opts) {
    opts = opts || {};
    root = container;
    lang = TEXT[opts.lang] ? opts.lang : 'zh';
    overrides = opts.text || {};
    onChange = typeof opts.onChange === 'function' ? opts.onChange : null;

    root.classList.add('dp');
    root.innerHTML = SKELETON;
    root.addEventListener('change', () => { syncUI(); if (onChange) onChange(); });
    root.addEventListener('input', () => { if (onChange) onChange(); });
    setLang(lang);
  }

  function setLang(newLang) {
    if (!root) return;
    const state = getState();
    lang = TEXT[newLang] ? newLang : 'zh';

    root.querySelectorAll('[data-dp]').forEach(el => { el.textContent = t(el.getAttribute('data-dp')); });
    $('customStyle').placeholder = t('phCustomStyle');
    $('customColor').placeholder = t('phCustomColor');
    $('customFont').placeholder = t('phCustomFont');

    fillOptions($('style'), t('styleOptions'), 'key');
    fillOptions($('color'), t('colorOptions'), 'key');
    fillOptions($('font'), t('fontOptions'), 'value');
    renderStyleTable();
    renderColorLinks();

    setState(state);
  }

  function getState() {
    if (!root) return {};
    return {
      styles: selectedStyleKeys(),
      customStyle: $('customStyle').value,
      color: $('color').value,
      customColor: $('customColor').value,
      font: $('font').value,
      customFont: $('customFont').value,
    };
  }

  function setState(s) {
    if (!root || !s) return;
    const styles = Array.isArray(s.styles) ? s.styles : [];
    [...$('style').options].forEach(o => { o.selected = styles.includes(o.value); });
    $('customStyle').value = s.customStyle || '';
    const colorSel = $('color');
    colorSel.value = s.color || '';
    if (colorSel.selectedIndex < 0) colorSel.selectedIndex = 0;
    $('customColor').value = s.customColor || '';
    // 字型清單依語言不同；找不到（例如切換語言後）就回到「不設定」
    const fontSel = $('font');
    fontSel.value = s.font || '';
    if (fontSel.selectedIndex < 0) fontSel.selectedIndex = 0;
    $('customFont').value = s.customFont || '';
    syncUI();
  }

  function reset() { setState({}); }

  function validate() {
    const checks = [
      [selectedStyleKeys().includes('custom'), 'customStyle', 'errCustomStyle'],
      [$('color').value === 'custom', 'customColor', 'errCustomColor'],
      [!!fontOption().custom, 'customFont', 'errCustomFont'],
    ];
    for (const [active, id, errKey] of checks) {
      if (active && !$(id).value.trim()) {
        $(id).focus();
        return t(errKey);
      }
    }
    return '';
  }

  function getStyles() {
    const keys = selectedStyleKeys();
    const named = t('styleOptions').filter(o => !o.custom && keys.includes(o.key)).map(o => o.label);
    const custom = keys.includes('custom') ? $('customStyle').value.trim() : '';
    return custom ? [...named, custom] : named;
  }

  function getColor() {
    const key = $('color').value;
    if (!key) return '';
    if (key === 'custom') return $('customColor').value.trim();
    const o = t('colorOptions').find(c => c.key === key);
    return o ? o.label : '';
  }

  function getFont() {
    const f = fontOption();
    if (f.none) return '';
    if (f.custom) return $('customFont').value.trim();
    return f.value;
  }

  return { init, setLang, getState, setState, reset, validate, getStyles, getColor, getFont };
})();
