const questions = [
  {
    q: '第一道試煉：你是否真的每天把 AI 當成工作武器在用？',
    opts: [
      '【表演咒術】即使在課堂上施展得不錯，但日常工作幾乎看不到 AI 的痕跡。',
      '【初學者契約】掌握幾個熱門工具，但大多停在搜尋、摘要、寫文案這個層次。',
      '【熟練術師】有固定的 AI 工作流程，能說清楚哪些工作交給 AI、哪些還是自己來。',
      '【魔典持有者】自建 GPT、Agent 或 Prompt 流程，真正用 AI 改變了內容、營運或商業方式。'
    ]
  },
  {
    q: '第二道試煉：你是否將自己的知識整理成了可傳承的魔典？',
    opts: [
      '【流浪吟遊者】內容追著當下流行跑，今天介紹這個、明天換另一個，沒有積累。',
      '【偶發靈感者】偶爾分享心得，但缺乏穩定節奏，也很少更新。',
      '【穩定著述者】有固定輸出的文章、教學或案例，能看出清楚的觀點與立場。',
      '【活的魔典】建立了系統化的知識庫或方法論，持續修正篩選，內容會自己生長。'
    ]
  },
  {
    q: '第三道試煉：你是否持有可以被驗證的真實魔法造物？',
    opts: [
      '【幻象殘影】大多只有截圖、口頭說明或課堂 demo，別人沒辦法自己動手試。',
      '【草稿羊皮紙】有一些範例，但很難讓人自己操作或驗證它真的能用。',
      '【公開的法器】有模板、流程或 demo，別人可以看、可以拿來用。',
      '【仍在運作的構造物】有持續運作的自動化成品、GitHub 或可重複使用的工具，隨時可取用。'
    ]
  },
  {
    q: '第四道試煉：你能將魔法真正傳授給他人，還是只讓人覺得你很厲害？',
    opts: [
      '【魔術表演者】大多在展示 AI 的神奇，他人看完還是不知道從哪裡開始。',
      '【咒語抄寫員】可以說明操作步驟，但換個情境就很難套用。',
      '【魔法理論師】能把複雜概念講清楚，讓他人理解背後的原理與取捨。',
      '【傳承騎士】能設計練習、給回饋、做檢核，讓他人真的做出屬於自己的流程或成果。'
    ]
  },
  {
    q: '第五道試煉：你是否曾踏足企業導入 AI 的真實廢墟戰場？',
    opts: [
      '【神器販售者】只談工具有多強大，很少提到流程、人員、資料、權限與風險。',
      '【地圖上的戰略家】知道企業會卡關，但說的偏概念，缺乏處理真實困境的具體方法。',
      '【老練傭兵】能說清楚導入限制、失敗案例、資料治理與跨部門溝通的真實挑戰。',
      '【戰場老兵】有實際導入、顧問或流程改造的作戰紀錄，能分辨 demo 與真正可落地的方案。'
    ]
  },
  {
    q: '第六道試煉：你是否坦誠面對 AI 的限制，還是用焦慮的迷霧籠罩聽眾？',
    opts: [
      '【恐懼煉金師】慣用「再不學就被淘汰」製造恐懼，很少提到限制。',
      '【過度包裝的吟遊詩人】會提醒趨勢，但容易把 AI 說得像無所不能的神器。',
      '【誠實的魔法師】願意說明限制、失敗案例，也公開自己的方法與判斷依據。',
      '【魔法解構師】能清楚區分炒作、demo 與可落地的方案——讓人看見魔法，也看懂魔法背後的真相。'
    ]
  }
];

const ranks = [
  '迷霧中的見習觀察者',
  '符文解讀者',
  '秘法審核者',
  '廢墟戰場的落地判官',
  '透明魔法的引路人'
];
const icons = ['◇', '✧', '✦', '✹', '✺'];

const rankDetails = [
  {
    summary: '你目前展示出的 AI 深度還在起步階段。先從最基本的開始：把 AI 真正放進你的日常工作，不只是偶爾用一下。',
    next: '建立真實使用習慣',
    questions: ['你有沒有至少一個每天都在用的 AI 工作流程？', '最近一次用 AI 解決真實工作問題是什麼時候、解決了什麼？'],
    evidence: ['日常工作流程截圖或流程圖', '你還在持續使用的 Prompt SOP']
  },
  {
    summary: '你已經在使用 AI，但深度還停留在工具層次。下一步是把經驗整理成方法論——不只是「我用過這個」，而是「我知道為什麼這樣用」。',
    next: '將經驗整理成方法論',
    questions: ['你有沒有把自己的 AI 使用心得整理成文章或框架？', '你能解釋為什麼選這個工具、不選那個嗎？'],
    evidence: ['文章、電子報或教學紀錄', '整理過的方法論或知識庫']
  },
  {
    summary: '你有方法論，也有一些輸出，但還缺乏可被驗證的公開成果。把你做的東西公開出來，讓別人也能使用或檢驗。',
    next: '打造可被驗證的公開成果',
    questions: ['你有沒有可以讓別人直接取用的模板、工具或流程？', '你的哪些成品可以當場讓人操作看看？'],
    evidence: ['公開模板、工具或流程', 'GitHub、Demo 或案例頁']
  },
  {
    summary: '你已經有扎實的基礎，下一步是把能力帶進真實的組織現場。能說清楚「導入時會遇到什麼」，才算真的踏過戰場。',
    next: '累積企業現場經驗',
    questions: ['你有沒有處理過資料、權限、流程與跨部門溝通的真實經驗？', '你能說清楚 demo 到真正落地之間差了什麼嗎？'],
    evidence: ['企業內訓或顧問案例', '失敗案例與修正紀錄']
  },
  {
    summary: '你已經具備完整的 AI 深度：真實使用、方法論、可驗證成果、企業現場、透明溝通——這五件事你都能站得住腳。',
    next: '持續產出可追蹤的教學轉化',
    questions: ['你的他人真的做出了屬於自己的流程或成果嗎？', '課後有沒有檢核、回饋與持續迭代的機制？'],
    evidence: ['他人作品或轉化案例', '可追蹤的課後實作成果']
  }
];

const skills = [
  {name: '真實 AI 工作流', desc: '我平常真的有把 AI 放進工作——不是偶爾用一下，是有固定流程的那種。'},
  {name: '方法論魔典', desc: '我不只介紹工具，而是整理成別人也可以重複使用的判斷框架。'},
  {name: '教學轉化能力', desc: '我能讓他人理解原理、完成練習，最後做出屬於自己的用法。'},
  {name: '企業現場理解', desc: '我了解流程、資料、權限、風險與組織溝通的真實挑戰，不只展示工具。'},
  {name: '限制與失敗案例', desc: '我願意說踩過哪些坑、哪些情境不適合，而不是把 AI 包裝成萬能。'},
  {name: '透明溝通', desc: '我能清楚區分炒作、demo 與真正可落地的方案，不靠製造焦慮來賣課。'}
];

const equips = [
  {name: '仍在運作的自動化成品', desc: '我有實際做出來、還在運作的 automation 或 Agent——不是展示用的，是真的在跑的。'},
  {name: '公開模板或 SOP', desc: '我有可以被別人使用、複製、驗證的 prompt、流程或操作模板。'},
  {name: 'GitHub 或工具 Demo', desc: '我有看得見、能操作、可以檢查邏輯的公開成品。'},
  {name: '系統化知識庫', desc: '我有持續更新的文章、課程、資料庫或方法整理——還在生長的那種。'},
  {name: '企業導入案例', desc: '我有內訓、顧問、流程改造或跨部門落地的真實經歷。'}
];

let st = {step: 0, score: 0, userName: '', mySkills: [], myGear: []};
const certTime = new Date().toLocaleString('zh-TW', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'});

function show(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function startGame() {
  const n = document.getElementById('nameInput').value.trim();
  if (!n) return;
  st = {step: 0, score: 0, userName: n, mySkills: [], myGear: []};
  renderQ();
  show('s-question');
}

function renderQ() {
  const q = questions[st.step];
  document.getElementById('progress').innerHTML = questions.map((_, i) => `<div class="prog-seg${i < st.step ? ' done' : i === st.step ? ' cur' : ''}"></div>`).join('');
  document.getElementById('q-user-lbl').textContent = `${st.userName} 的鑑別試煉`;
  document.getElementById('q-counter').textContent = `${st.step + 1} / ${questions.length}`;
  document.getElementById('q-text').textContent = q.q;

  const o = document.getElementById('q-opts');
  o.innerHTML = '';
  q.opts.forEach((op, i) => {
    const b = document.createElement('button');
    b.className = 'opt-card';
    b.innerHTML = `<span class="opt-ltr">${'ABCD'[i]}</span>${op}`;
    b.onclick = () => {
      st.score += i;
      st.step += 1;
      if (st.step < questions.length) {
        renderQ();
      } else {
        renderInv();
        show('s-inventory');
      }
    };
    o.appendChild(b);
  });
}

function renderInv() {
  const sl = document.getElementById('skill-list');
  sl.innerHTML = '';
  skills.forEach((s) => {
    const d = document.createElement('button');
    d.className = 'sel-card';
    d.id = `sk-${s.name}`;
    d.innerHTML = `<div class="sel-name">${s.name}</div><div class="sel-desc">${s.desc}</div>`;
    d.onclick = () => toggleSk(s.name);
    sl.appendChild(d);
  });

  const gl = document.getElementById('gear-list');
  gl.innerHTML = '';
  equips.forEach((e) => {
    const d = document.createElement('button');
    d.className = 'sel-card';
    d.id = `ge-${e.name}`;
    d.innerHTML = `<div class="sel-name">${e.name}</div><div class="sel-desc">${e.desc}</div>`;
    d.onclick = () => toggleGe(e.name);
    gl.appendChild(d);
  });
  updInvSum();
}

function toggleSk(n) {
  const i = st.mySkills.indexOf(n);
  if (i >= 0) st.mySkills.splice(i, 1);
  else st.mySkills.push(n);
  const el = document.getElementById(`sk-${n}`);
  el.classList.toggle('sel-skill', st.mySkills.includes(n));
  el.querySelector('.sel-name').textContent = `${st.mySkills.includes(n) ? '✓ ' : ''}${n}`;
  updInvSum();
}

function toggleGe(n) {
  const i = st.myGear.indexOf(n);
  if (i >= 0) st.myGear.splice(i, 1);
  else st.myGear.push(n);
  const el = document.getElementById(`ge-${n}`);
  el.classList.toggle('sel-gear', st.myGear.includes(n));
  el.querySelector('.sel-name').textContent = `${st.myGear.includes(n) ? '✓ ' : ''}${n}`;
  updInvSum();
}

function updInvSum() {
  const w = document.getElementById('inv-sum');
  const items = document.getElementById('inv-sum-items');
  const has = st.mySkills.length + st.myGear.length > 0;
  w.style.display = has ? 'block' : 'none';
  items.innerHTML = st.mySkills.map((s) => `<span class="badge b-skill">${s}</span>`).join('') + st.myGear.map((g) => `<span class="badge b-gear">${g}</span>`).join('');
}

function getRankIdx() {
  const thresholds = [4, 8, 12, 16];
  const idx = thresholds.findIndex((x) => st.score <= x);
  return idx === -1 ? ranks.length - 1 : idx;
}

function renderList(items, gemClass) {
  return items.map((item) => `<li style="display:flex;align-items:center;margin-bottom:5px;font-size:.8rem;color:#b0a080"><div class="gem sm ${gemClass}" style="display:inline-block;margin-right:8px"></div>${item}</li>`).join('');
}

function goResult() {
  const idx = getRankIdx();
  const rank = ranks[idx];
  const icon = icons[idx];
  const detail = rankDetails[idx];

  document.getElementById('r-user').textContent = st.userName;
  document.getElementById('r-rank').textContent = `${icon} ${rank}`;
  document.getElementById('r-time').textContent = certTime;
  document.getElementById('r-summary').textContent = detail.summary;

  const inv = document.getElementById('r-inv');
  if (!st.mySkills.length && !st.myGear.length) {
    inv.innerHTML = '<p style="color:var(--text-dim);font-size:.8rem;line-height:1.7">你還沒有標記任何已完成的項目。回頭想想你實際做過、產出過、還在用的東西，勾選看看你目前站在哪裡。</p>';
  } else {
    let h = '';
    if (st.mySkills.length) h += `<p style="color:var(--text-dim);font-size:.68rem;letter-spacing:.1em;margin-bottom:8px">可觀察能力 (${st.mySkills.length})</p><div class="wrap-gap" style="margin-bottom:12px">${st.mySkills.map((s) => `<span class="badge b-skill">${s}</span>`).join('')}</div>`;
    if (st.myGear.length) h += `<p style="color:var(--text-dim);font-size:.68rem;letter-spacing:.1em;margin-bottom:8px">可檢驗作品 (${st.myGear.length})</p><div class="wrap-gap">${st.myGear.map((g) => `<span class="badge b-gear">${g}</span>`).join('')}</div>`;
    inv.innerHTML = h;
  }

  document.getElementById('r-next').textContent = detail.next;
  document.getElementById('r-skills').innerHTML = renderList(detail.questions, 'green');
  document.getElementById('r-gear').innerHTML = renderList(detail.evidence, 'orange');

  const rm = document.getElementById('roadmap');
  rm.innerHTML = '';
  ranks.forEach((r, i) => {
    const isCur = i === idx;
    const isPast = i < idx;
    const n = document.createElement('div');
    n.className = `road-node${isCur ? ' current' : isPast ? ' past' : ''}`;
    n.innerHTML = `<div style="font-size:.6rem;color:${isCur ? '#c9a84c' : isPast ? '#2ecc71' : '#3a2a1a'};letter-spacing:.06em;margin-bottom:4px">${isPast ? '已通過' : isCur ? '目前位置' : '待確認'}</div><div style="font-weight:700;font-size:.72rem;color:${isCur ? '#c9a84c' : isPast ? '#2ecc71' : '#3a2a1a'};margin-bottom:6px">${icons[i]} ${r}</div><div><span class="road-tag">${rankDetails[i].next}</span></div>`;
    rm.appendChild(n);
    if (i < ranks.length - 1) {
      const a = document.createElement('div');
      a.className = `road-arrow${idx > i ? ' lit' : ''}`;
      a.textContent = '›';
      rm.appendChild(a);
    }
  });
  show('s-result');
}

function openShare() {
  const idx = getRankIdx();
  const rank = ranks[idx];
  const detail = rankDetails[idx];
  document.getElementById('sh-user').textContent = st.userName;
  document.getElementById('sh-rank').textContent = `${icons[idx]} ${rank}`;
  document.getElementById('sh-time').textContent = certTime;
  document.getElementById('sh-next').textContent = detail.next;
  document.getElementById('sh-nextsk').textContent = detail.questions.join(' / ');
  document.getElementById('sh-sk-wrap').style.display = st.mySkills.length ? 'block' : 'none';
  document.getElementById('sh-ge-wrap').style.display = st.myGear.length ? 'block' : 'none';
  document.getElementById('sh-sk').innerHTML = st.mySkills.map((s) => `<span class="badge b-skill">${s}</span>`).join('');
  document.getElementById('sh-ge').innerHTML = st.myGear.map((g) => `<span class="badge b-gear">${g}</span>`).join('');
  document.getElementById('modal').classList.add('open');
}

function closeShare() {
  document.getElementById('modal').classList.remove('open');
}

function restart() {
  st = {step: 0, score: 0, userName: '', mySkills: [], myGear: []};
  document.getElementById('nameInput').value = '';
  show('s-intro');
}
