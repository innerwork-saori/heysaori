// ══════════ 薪資成長計算機 ══════════
// Flow: read inputs → validate → buildSalaryRows (pure) → render summary / chart / table.

(function () {
  const MAX_YEARS = 50;
  const SHOW_ALL_BAR_VALUES_UP_TO = 12; // more years than this → only label first & last bar

  const form = document.getElementById('sgForm');
  const promoList = document.getElementById('sgPromoList');
  const addPromoBtn = document.getElementById('sgAddPromo');
  const errorEl = document.getElementById('sgError');
  const resultsEl = document.getElementById('sgResults');
  if (!form || !promoList || !resultsEl) return;

  // ── Formatting ──
  function fmtMoney(n) {
    return Math.round(n).toLocaleString('zh-TW');
  }
  function fmtPct(p) {
    return (p >= 0 ? '+' : '') + p.toFixed(1) + '%';
  }

  // ── Promotion rows ──
  function addPromoRow(year, pct) {
    const li = document.createElement('li');
    li.className = 'sg-promo-row';
    li.innerHTML = `
      <span>第</span>
      <input type="number" class="sg-promo-year" min="2" max="${MAX_YEARS}" step="1" inputmode="numeric" placeholder="5" aria-label="第幾年">
      <span>年</span>
      <span>調薪</span>
      <input type="number" class="sg-promo-pct" min="0" step="0.5" inputmode="decimal" placeholder="20" aria-label="調薪百分比">
      <span>%</span>
      <button type="button" class="sg-btn-remove">移除</button>
    `;
    li.querySelector('.sg-promo-year').value = year || '';
    li.querySelector('.sg-promo-pct').value = pct || '';
    li.querySelector('.sg-btn-remove').addEventListener('click', () => li.remove());
    promoList.appendChild(li);
    return li;
  }

  // Returns { promos: {year: rate}, error: string|null }
  function readPromos(years) {
    const promos = {};
    const rows = promoList.querySelectorAll('.sg-promo-row');
    for (const row of rows) {
      const yRaw = row.querySelector('.sg-promo-year').value.trim();
      const pRaw = row.querySelector('.sg-promo-pct').value.trim();
      if (yRaw === '' && pRaw === '') continue; // empty row: ignore
      const y = Number(yRaw);
      const p = Number(pRaw);
      if (yRaw === '' || pRaw === '' || !Number.isInteger(y) || !Number.isFinite(p)) {
        return { promos, error: '升遷／跳槽那一列沒填完整：請填年份和調薪百分比，或按「移除」。' };
      }
      if (y < 2) return { promos, error: '升遷／跳槽要從第 2 年開始算，第 1 年就是起薪。' };
      if (y > years) return { promos, error: `第 ${y} 年超過你要算的 ${years} 年，請改年份或把年數加長。` };
      if (p < 0) return { promos, error: '升遷／跳槽的調薪不能是負數。' };
      if (promos[y] !== undefined) return { promos, error: `第 ${y} 年填了兩次，請合併成一筆。` };
      promos[y] = p / 100;
    }
    return { promos, error: null };
  }

  // ── Inputs ──
  function readInputs() {
    const base = Number(document.getElementById('sgBase').value);
    const ratePct = document.getElementById('sgRate').value.trim();
    const months = Number(document.getElementById('sgMonths').value);
    const years = Number(document.getElementById('sgYears').value);

    if (!(base > 0)) return { error: '請填起薪（月薪），要大於 0。' };
    if (ratePct === '' || !(Number(ratePct) >= 0)) return { error: '請填每年調薪幅度，沒有調薪就填 0。' };
    if (!(months >= 12)) return { error: '年薪月數至少是 12 個月。' };
    if (!Number.isInteger(years) || years < 1 || years > MAX_YEARS) {
      return { error: `要算的年數請填 1 到 ${MAX_YEARS} 之間的整數。` };
    }

    const { promos, error } = readPromos(years);
    if (error) return { error };

    return { base, rate: Number(ratePct) / 100, months, years, promos };
  }

  // ── Calculation (pure) ──
  function buildSalaryRows({ base, rate, months, years, promos }) {
    const rows = [];
    let monthly = base;
    let cumulative = 0;
    for (let year = 1; year <= years; year++) {
      let raise = null;
      let isPromo = false;
      if (year > 1) {
        isPromo = promos[year] !== undefined;
        raise = isPromo ? promos[year] : rate;
        monthly *= 1 + raise;
      }
      const annual = monthly * months;
      cumulative += annual;
      rows.push({ year, monthly, annual, cumulative, raise, isPromo });
    }
    return rows;
  }

  function summarize(rows, base) {
    const first = rows[0];
    const last = rows[rows.length - 1];
    const multiple = last.monthly / base;
    const cagr = rows.length > 1 ? (Math.pow(multiple, 1 / (rows.length - 1)) - 1) * 100 : 0;
    return {
      first,
      last,
      multiple,
      overallPct: (multiple - 1) * 100,
      cagr,
      total: last.cumulative,
      promoCount: rows.filter(r => r.isPromo).length,
    };
  }

  // ── Rendering ──
  function setText(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  function renderVerdict(s, years) {
    const el = document.getElementById('sgVerdict');
    if (!el) return;
    if (years === 1) {
      el.innerHTML = `第 1 年的年薪是 <span class="sg-keep"><strong>${fmtMoney(s.first.annual)}</strong> 元</span>。`;
      return;
    }
    const promoNote = s.promoCount > 0 ? `，其中包含 ${s.promoCount} 次升遷或跳槽` : '';
    // .sg-keep keeps each figure on the same line as its unit
    el.innerHTML =
      `第 ${years} 年，你的月薪會是 <span class="sg-keep"><strong>${fmtMoney(s.last.monthly)}</strong> 元</span>，` +
      `是起薪的 <span class="sg-keep"><strong>${s.multiple.toFixed(2)}</strong> 倍</span>。` +
      `這 ${years} 年一共會賺到 <span class="sg-keep"><strong>${fmtMoney(s.total)}</strong> 元</span>${promoNote}。`;
  }

  function renderStats(s, months, years) {
    const unit = '<small>元</small>';
    setText('sgStartMonthly', fmtMoney(s.first.monthly) + unit);
    setText('sgEndMonthly', fmtMoney(s.last.monthly) + `<small>第 ${years} 年</small>`);
    setText('sgMultiple', s.multiple.toFixed(2) + '<small>倍</small>');
    setText('sgStartAnnual', fmtMoney(s.first.annual) + unit);
    setText('sgEndAnnual', fmtMoney(s.last.annual) + unit);
    setText('sgTotal', fmtMoney(s.total) + unit);
    setText('sgOverall', fmtPct(s.overallPct));
    setText('sgCagr', fmtPct(s.cagr));
    setText('sgMonthsOut', months + '<small>個月</small>');
  }

  function renderChart(rows) {
    const chart = document.getElementById('sgChart');
    if (!chart) return;
    const max = Math.max(...rows.map(r => r.monthly));
    const showAll = rows.length <= SHOW_ALL_BAR_VALUES_UP_TO;
    chart.innerHTML = '';
    rows.forEach((r, i) => {
      const li = document.createElement('li');
      li.className = 'sg-bar' + (r.isPromo ? ' is-promo' : '');
      li.title = `第 ${r.year} 年｜月薪 ${fmtMoney(r.monthly)} 元｜年薪 ${fmtMoney(r.annual)} 元`;
      li.setAttribute('aria-label', li.title);

      const isEdge = i === 0 || i === rows.length - 1;
      if (showAll || isEdge) {
        const value = document.createElement('span');
        value.className = 'sg-bar-value';
        value.textContent = fmtMoney(r.monthly);
        li.appendChild(value);
      }

      const fill = document.createElement('span');
      fill.className = 'sg-bar-fill';
      // Bars are proportional to the real value (starting from 0), so heights are honest.
      // 1.5rem is reserved for the value label above the tallest bar (see .sg-bar-value).
      fill.style.height = `calc((100% - 1.5rem) * ${(r.monthly / max).toFixed(4)})`;
      fill.style.animationDelay = `${Math.min(i * 40, 800)}ms`;
      li.appendChild(fill);

      const year = document.createElement('span');
      year.className = 'sg-bar-year';
      year.textContent = r.year;
      li.appendChild(year);

      chart.appendChild(li);
    });
  }

  function renderTable(rows, months) {
    const head = document.getElementById('sgAnnualHead');
    if (head) head.textContent = `年薪（${months} 個月）`;
    const tbody = document.getElementById('sgTbody');
    if (!tbody) return;
    tbody.innerHTML = rows.map(r => {
      const raise = r.raise === null
        ? '<span class="sg-raise-none">起薪</span>'
        : fmtPct(r.raise * 100);
      const tag = r.isPromo ? '<span class="sg-tag">升遷／跳槽</span>' : '';
      return `
        <tr class="${r.isPromo ? 'is-promo' : ''}">
          <td><span class="sg-year">${r.year}</span>${tag}</td>
          <td class="num">${fmtMoney(r.monthly)}</td>
          <td class="num">${fmtMoney(r.annual)}</td>
          <td class="num sg-raise">${raise}</td>
          <td class="num sg-cum">${fmtMoney(r.cumulative)}</td>
        </tr>`;
    }).join('');
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const input = readInputs();
    if (input.error) {
      showError(input.error);
      return;
    }
    errorEl.hidden = true;

    const rows = buildSalaryRows(input);
    const s = summarize(rows, input.base);

    renderVerdict(s, input.years);
    renderStats(s, input.months, input.years);
    renderChart(rows);
    renderTable(rows, input.months);

    const wasHidden = resultsEl.hidden;
    resultsEl.hidden = false;
    if (wasHidden) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      resultsEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  }

  // ── Init ──
  form.addEventListener('submit', handleSubmit);
  if (addPromoBtn) {
    addPromoBtn.addEventListener('click', () => {
      addPromoRow().querySelector('.sg-promo-year').focus();
    });
  }
  addPromoRow();
})();
