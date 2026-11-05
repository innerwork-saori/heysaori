(() => {
  const modeInput = document.getElementById('mode');
  const sourceInput = document.getElementById('sourceText');
  const keyInput = document.getElementById('apiKey');
  const generateButton = document.getElementById('generateButton');
  const copyButton = document.getElementById('copyButton');
  const keyHelpDialog = document.getElementById('keyHelpDialog');
  const openKeyHelp = document.getElementById('openKeyHelp');
  const closeKeyHelp = document.getElementById('closeKeyHelp');
  const result = document.getElementById('result');
  const status = document.getElementById('status');

  openKeyHelp.addEventListener('click', (event) => {
    event.preventDefault();
    keyHelpDialog.showModal();
  });
  closeKeyHelp.addEventListener('click', () => keyHelpDialog.close());
  keyHelpDialog.addEventListener('click', (event) => {
    if (event.target === keyHelpDialog) keyHelpDialog.close();
  });

  const modeInstructions = {
    convert: '將文字改寫成萬安語體。先找出輸入裡最具體、最有辨識度的情境，再用自然的公務回應方式包裝；不要只重述原文後面接制式結尾。',
    press: '像記者會現場一樣，先回應問題裡最尖銳或最具體的部分，再用迂迴、程序化的說法化解。回答要像現場發言，不要寫成官話句型清單。',
    analyze: '分析原文並以 0～100 分評估官腔程度、資訊密度、模糊程度、程序用語比例、實際回答問題的程度。每項簡短說明理由。',
    decode: '將輸入的萬安語體翻譯成直接、具體、容易理解的人話。指出原文實際說了什麼、迴避了什麼；不能推知的內容標示「原文未交代」。',
    extreme: '把官樣文章的迂迴感推到荒謬但好笑的程度。可運用層層轉介、反覆確認、程序套程序、看似有回應實則延後回答等喜劇節奏；要針對輸入情境創作，不得只堆疊固定句子，也不得新增具體事實或承諾。'
  };

  const systemPrompt = `你是繁體中文的「萬安語體」喜劇寫手，模仿一種熟悉的公共發言腔調，不扮演或冒充任何真實政治人物。寫作重點是把話說得四平八穩、程序完備，卻巧妙地降低資訊密度。\n\n創作方法：\n- 先讀懂輸入的具體情境、人物關係、數字、時間與真正追問；改寫時保留這些辨識度高的細節，不要把它們洗成泛泛的「相關情況」。\n- 每次依情境挑選一至兩種官腔手法即可，例如先肯定已知狀況、把責任轉交權責單位、訴諸程序、承諾持續掌握、用審慎評估延後表態。不要每種手法都塞進每篇。\n- 範例語料只供理解腔調，不可當固定模板照貼。避免每次都以「已掌握、持續關注、相關局處、依法辦理、滾動檢討」的相同順序組句。改變句子節奏、切入角度與收尾方式，讓回應像針對當下問題臨場說出來。\n- 不要逐句複述輸入再補一段通用官話。內容要有戲劇性或細節上的巧思，讓人看出它是在迴避這個特定問題。\n- 不可捏造輸入沒有提供的政策、事實、行動、日期或承諾；可用假設性、明確戲謔的表達呈現迴避感。不得做人身攻擊。\n- 固定使用繁體中文，語境定位台灣，不使用「大陸／內地」等詞彙。若輸入涉及真實公共議題，保持清楚的模仿創作語境，不宣稱是任何人物原話。`;

  generateButton.addEventListener('click', async () => {
    const apiKey = keyInput.value.trim();
    const source = sourceInput.value.trim();
    if (!apiKey) { status.textContent = '請先輸入 OpenRouter API Key。'; keyInput.focus(); return; }
    if (!source) { status.textContent = '請先輸入要處理的文字或問題。'; sourceInput.focus(); return; }

    generateButton.disabled = true;
    copyButton.disabled = true;
    result.textContent = '';
    status.textContent = '正在生成…';
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
          stream: false,
          temperature: 0.9,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `${modeInstructions[modeInput.value]}\n\n使用者提供的內容：\n${source}` }
          ]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || `API 請求失敗（${response.status}）`);
      const answer = data.choices?.[0]?.message?.content;
      if (!answer) throw new Error('API 沒有回傳可顯示的文字。');
      result.textContent = answer;
      copyButton.disabled = false;
      status.textContent = '完成。';
    } catch (error) {
      result.textContent = '生成失敗，請檢查 API Key、網路連線或模型狀態。';
      status.textContent = error.message;
    } finally {
      generateButton.disabled = false;
    }
  });

  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(result.textContent);
      status.textContent = '已複製生成結果。';
    } catch {
      status.textContent = '無法存取剪貼簿，請手動選取並複製。';
    }
  });
})();
