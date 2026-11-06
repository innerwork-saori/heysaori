(() => {
  const sourceInput = document.getElementById('sourceText');
  const keyInput = document.getElementById('apiKey');
  const generateButton = document.getElementById('generateButton');
  const status = document.getElementById('status');
  const keyHelpDialog = document.getElementById('keyHelpDialog');
  const styleBoxes = document.querySelectorAll('input[name="styles"]');
  const pickerWarning = document.getElementById('pickerWarning');
  const outputsGrid = document.getElementById('outputsGrid');
  const styleCards = { wanAn: document.getElementById('wanAnCard'), boYang: document.getElementById('boYangCard') };
  const styleNames = { wanAn: '萬安體', boYang: '伯洋體' };
  const modeSelects = { wanAn: document.getElementById('wanAnMode'), boYang: document.getElementById('boYangMode') };
  const modeFields = { wanAn: document.getElementById('wanAnModeField'), boYang: document.getElementById('boYangModeField') };
  const regenButtons = document.querySelectorAll('.regen-button');
  let isBusy = false;

  function getSelectedStyles() {
    return Array.from(styleBoxes).filter((box) => box.checked).map((box) => box.value);
  }

  function getButtonLabel(selected) {
    if (selected.length === 2) return '同時產生兩種語體';
    if (selected.length === 1) return `產生${styleNames[selected[0]]}`;
    return '請先勾選語體';
  }

  function syncStylePicker() {
    const selected = getSelectedStyles();
    Object.entries(styleCards).forEach(([style, card]) => {
      if (card) card.hidden = !selected.includes(style);
      if (modeFields[style]) modeFields[style].hidden = !selected.includes(style);
    });
    if (outputsGrid) outputsGrid.classList.toggle('is-single', selected.length === 1);
    if (pickerWarning) pickerWarning.hidden = selected.length > 0;
    generateButton.textContent = getButtonLabel(selected);
    generateButton.disabled = isBusy || selected.length === 0;
    regenButtons.forEach((button) => {
      button.disabled = isBusy || !styleCards[button.dataset.regen]?.dataset.generated;
    });
  }

  function syncModeLabels() {
    Object.entries(modeSelects).forEach(([style, select]) => {
      const label = document.querySelector(`[data-mode-label="${style}"]`);
      if (select && label) label.textContent = select.options[select.selectedIndex].text;
    });
  }

  styleBoxes.forEach((box) => box.addEventListener('change', syncStylePicker));
  Object.values(modeSelects).forEach((select) => select?.addEventListener('change', syncModeLabels));
  syncStylePicker();
  syncModeLabels();

  document.getElementById('openKeyHelp').addEventListener('click', (event) => {
    event.preventDefault();
    keyHelpDialog.showModal();
  });
  document.getElementById('closeKeyHelp').addEventListener('click', () => keyHelpDialog.close());
  keyHelpDialog.addEventListener('click', (event) => {
    if (event.target === keyHelpDialog) keyHelpDialog.close();
  });

  const wanAnModes = {
    convert: '將文字改寫成萬安語體。先抓住輸入裡最具體的情境，再用公務回應方式包裝；不要重述原文後接制式結尾。',
    press: '模擬記者會答詢：先碰觸問題裡最具體的部分，再以程序化說法迂迴回應。寫成自然口語，不要列官話句型。',
    analyze: '為原文的官腔程度、資訊密度、模糊程度、程序用語比例、實際回答程度各評 0 到 100 分，並簡短說明理由。',
    decode: '將萬安語體翻譯成直接易懂的人話，指出實際說了什麼、迴避了什麼。不能推知的內容標示「原文未交代」。',
    extreme: '把官樣文章的迂迴感推到荒謬好笑：可用層層轉介、程序套程序等節奏，但要針對輸入情境創作，不得堆疊固定句，也不得新增事實或承諾。'
  };

  const boYangModes = {
    transform: '把輸入改寫成分析型論述：先界定問題，再依需要拆解概念與推理，最後回到核心主張。篇幅適中，不必硬套六段式。',
    counter: '以論述方式回應挑戰：先指出問題中的前提或概念是否混淆，再說明理由並回應核心疑問。保持理性，不做人身攻擊。',
    expand: '把問題展開成較完整的知識論述：釐清定義、整理不同層次、逐步推理。只可使用輸入提供的證據；沒有來源的研究、數據或案例不可杜撰。',
    debate: '模擬理性辯論：找出主張背後的前提，檢視推論是否成立，提出關鍵追問並收斂自己的論點。不可把對方立場扭曲成稻草人。',
    analyze: '以 0 到 100 分評估概念密度、分類程度、邏輯完整性、前提校正率、論述冗長度，每項簡短說明依據。'
  };

  const wanAnSystem = `你是繁體中文的萬安語體喜劇寫手，模仿四平八穩、程序完備而資訊密度偏低的公共發言腔調。這是語體戲仿，不扮演任何真實政治人物。保留輸入的重要細節；每次只挑一至兩種迂迴手法，不要每次都照「掌握、關注、局處、程序、檢討」的固定順序。不要逐句複述後貼通用官話。不得捏造政策、事實、行動、日期或承諾。固定使用繁體中文與台灣語境，不使用「大陸／內地」等詞。`;
  const boYangSystem = `你是繁體中文的分析型論述寫手，依照使用者提供的特徵創作「伯洋體」戲仿：先釐清定義與前提，再拆解問題、逐步推理，最後回到核心主張。可自然使用「其實」等口語轉折、冷面幽默或反問，但避免每次機械套用六段式或口頭禪。論述要清楚有層次，不為了顯得專業而灌水。不得冒充沈伯洋或宣稱是其原話；不得虛構研究、數據、案例、引言或專業共識。若輸入資訊不足，明確指出限制。使用繁體中文與台灣語境，不使用「大陸／內地」等詞。`;

  async function requestStyle({ apiKey, source, model, system, instruction }) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        temperature: 0.9,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: `${instruction}\n\n使用者提供的內容：\n${source}` }
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `API 請求失敗（${response.status}）`);
    const answer = data.choices?.[0]?.message?.content;
    if (!answer) throw new Error('API 沒有回傳可顯示的文字。');
    return answer;
  }

  document.querySelectorAll('.copy-button').forEach((button) => {
    button.addEventListener('click', async () => {
      const output = document.getElementById(button.dataset.copyTarget);
      try {
        await navigator.clipboard.writeText(output.textContent);
        status.textContent = `已複製${button.dataset.copyTarget === 'wanAnResult' ? '萬安體' : '伯洋體'}結果。`;
      } catch {
        status.textContent = '無法存取剪貼簿，請手動選取並複製。';
      }
    });
  });

  async function runStyles(styles) {
    const apiKey = keyInput.value.trim();
    const source = sourceInput.value.trim();
    if (!styles.length) { status.textContent = '請至少勾選一種語體。'; return; }
    if (!apiKey) {
      status.textContent = '請先輸入 OpenRouter API Key。';
      document.querySelector('.key-details').open = true;
      keyInput.focus();
      return;
    }
    if (!source) { status.textContent = '請先輸入要處理的文字或問題。'; sourceInput.focus(); return; }

    const allTasks = {
      wanAn: { instructions: wanAnModes, system: wanAnSystem },
      boYang: { instructions: boYangModes, system: boYangSystem }
    };
    const tasks = styles.map((style) => ({
      ...allTasks[style],
      style,
      name: styleNames[style],
      mode: modeSelects[style].value,
      result: document.getElementById(`${style}Result`),
      copy: document.querySelector(`[data-copy-target="${style}Result"]`)
    }));

    isBusy = true;
    syncStylePicker();
    tasks.forEach(({ result, copy }) => { result.textContent = '生成中…'; copy.disabled = true; });
    status.textContent = tasks.length === 2 ? '正在同時生成兩種語體…' : `正在生成${tasks[0].name}…`;

    const outcomes = await Promise.all(tasks.map(async (task) => {
      try {
        task.result.textContent = await requestStyle({
          apiKey,
          source,
          model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
          system: task.system,
          instruction: task.instructions[task.mode]
        });
        task.copy.disabled = false;
        return { name: task.name, ok: true };
      } catch (error) {
        task.result.textContent = `生成失敗：${error.message}`;
        return { name: task.name, ok: false };
      } finally {
        styleCards[task.style].dataset.generated = 'true';
      }
    }));

    const done = outcomes.filter(({ ok }) => ok).map(({ name }) => name);
    const failed = outcomes.filter(({ ok }) => !ok).map(({ name }) => `${name}生成失敗`);
    if (!failed.length) status.textContent = tasks.length === 2 ? '兩種語體都已完成。' : `${done[0]}已完成。`;
    else status.textContent = `${done.length ? `${done.join('、')}完成；` : ''}${failed.join('、')}。`;
    isBusy = false;
    syncStylePicker();
  }

  generateButton.addEventListener('click', () => runStyles(getSelectedStyles()));
  regenButtons.forEach((button) => {
    button.addEventListener('click', () => runStyles([button.dataset.regen]));
  });
})();
