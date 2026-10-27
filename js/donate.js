// donate.html：飲料點單合計 + 複製帳號 / 金額
(function () {
  var drinkItems = document.querySelectorAll('.drink-item');
  var drinkList = document.querySelector('.drink-list');
  var customInput = document.getElementById('customAmount');
  var totalEl = document.getElementById('totalAmount');
  var noteEl = document.getElementById('totalNote');
  var copyAmountBtn = document.getElementById('copyAmount');
  var currentTotal = 0;

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // 舊瀏覽器 / 非 https 的備用做法
    return new Promise(function (resolve, reject) {
      var input = document.createElement('textarea');
      input.value = text;
      input.setAttribute('readonly', '');
      input.style.position = 'absolute';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(input);
      ok ? resolve() : reject();
    });
  }

  function showCopyResult(button, label) {
    var original = button.dataset.label || button.textContent;
    button.dataset.label = original;
    button.textContent = label;
    button.classList.add('is-copied');
    setTimeout(function () {
      button.textContent = original;
      button.classList.remove('is-copied');
    }, 1800);
  }

  function bindCopy(button, getText) {
    button.addEventListener('click', function () {
      copyText(getText())
        .then(function () { showCopyResult(button, '已複製 ✓'); })
        .catch(function () { showCopyResult(button, '請手動複製'); });
    });
  }

  // ── 合計：自訂金額優先，否則加總飲料 ──
  function getQty(item) {
    return parseInt(item.querySelector('.drink-qty').textContent, 10) || 0;
  }

  function readCustomAmount() {
    if (!customInput) return 0;
    var value = Math.floor(Number(customInput.value));
    return value > 0 ? value : 0;
  }

  function calcOrder() {
    var custom = readCustomAmount();
    if (custom) return { total: custom, cups: [], isCustom: true };

    var total = 0;
    var cups = [];
    drinkItems.forEach(function (item) {
      var qty = getQty(item);
      if (!qty) return;
      total += qty * Number(item.dataset.price);
      cups.push(item.querySelector('.drink-name').textContent + ' × ' + qty);
    });
    return { total: total, cups: cups, isCustom: false };
  }

  function buildNote(order) {
    if (!order.total) return '先選一杯飲料，或自己填金額';
    if (order.isCustom) return '謝謝你請 Saori 喝飲料 🧋 轉帳時請輸入這個金額';
    return '謝謝你請 Saori 喝 ' + order.cups.join('、') + ' 🧋';
  }

  function render() {
    var order = calcOrder();
    currentTotal = order.total;

    totalEl.textContent = order.total.toLocaleString('zh-TW');
    noteEl.textContent = buildNote(order);
    copyAmountBtn.disabled = !order.total;
    if (drinkList) drinkList.classList.toggle('is-inactive', order.isCustom);

    drinkItems.forEach(function (item) {
      var qty = getQty(item);
      item.classList.toggle('is-selected', qty > 0);
      item.querySelector('[data-step="-1"]').disabled = qty === 0;
    });
  }

  if (totalEl && noteEl && copyAmountBtn) {
    drinkItems.forEach(function (item) {
      item.querySelectorAll('.drink-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var qtyEl = item.querySelector('.drink-qty');
          var next = Math.max(0, getQty(item) + Number(btn.dataset.step));
          qtyEl.textContent = next;
          // 按飲料代表想用菜單算，清掉自訂金額
          if (customInput) customInput.value = '';
          render();
        });
      });
    });

    if (customInput) customInput.addEventListener('input', render);
    bindCopy(copyAmountBtn, function () { return String(currentTotal); });
    render();
  }

  // ── 複製帳號 ──
  document.querySelectorAll('.donate-copy[data-account]').forEach(function (button) {
    bindCopy(button, function () { return button.dataset.account; });
  });
})();
