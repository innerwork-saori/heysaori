
const questions = [
  {q:'你使用 AI 工具的頻率？',opts:['幾乎沒用過','偶爾用一下','幾乎每天使用','AI 已完全融入日常工作流程']},
  {q:'你下提示詞（Prompt）的方式？',opts:['直接輸入問題，沒有特別設計','會稍微調整措辭','會給角色、背景、格式等指令','有一套自己的提示詞模板庫']},
  {q:'當 AI 給出答案，你會怎麼處理？',opts:['直接使用','大概看一下再用','會查證關鍵資訊','系統性驗證，能辨識幻覺與偏差']},
  {q:'你使用過幾種不同的 AI 模型或工具？',opts:['只用過一種（如 ChatGPT）','用過 2–3 種','用過 4 種以上並比較差異','會依任務選擇最適合的模型']},
  {q:'你有沒有用 AI 解決過實際工作或生活問題？',opts:['還沒有','有試過但效果普通','有，解決了具體問題','有，並且持續產出可重複使用的成果']},
  {q:'你對 AI 自動化或串接工具的熟悉程度？',opts:['不了解','聽過但沒實作','做過簡單自動化（如 Zapier、Make）','能串接 API 或部署給他人使用']},
  {q:'你如何看待 AI 在你專業領域的應用？',opts:['還不確定 AI 能幫什麼','知道一些應用場景','已在工作中落地應用','能設計 AI 輔助的工作流程並教導他人']},
];
const ranks=['初階 AI 法師','中階 AI 法師','高階 AI 法師','大法師','賢者'];
const icons=['🧙','🔮','⚡','👑','🌟'];
const skills=[
  {name:'提示詞咒文學',desc:'能設計有角色、格式、限制的結構化 Prompt'},
  {name:'知識召喚術',desc:'用 AI 快速查找、整理、摘要各類資訊'},
  {name:'自動化陣法',desc:'串接工具或 API，讓重複任務自動執行'},
  {name:'幻覺辨識術',desc:'能察覺 AI 的錯誤輸出並交叉驗證事實'},
  {name:'商業解題術',desc:'將 AI 應用在實際工作問題並產出成果'},
  {name:'人機協作術',desc:'設計人與 AI 分工的工作流程並教導他人'},
];
const equips=[
  {name:'ChatGPT 法杖',desc:'日常對話、寫作、腦力激盪的主力工具'},
  {name:'Claude 秘典',desc:'長文分析、文件摘要、細膩推理的利器'},
  {name:'Perplexity 水晶球',desc:'即時聯網搜尋，附來源引用的查詢神器'},
  {name:'Notion 卷軸',desc:'結合 AI 整理筆記、知識庫與專案管理'},
  {name:'Python 鍊金台',desc:'用程式碼操控 AI API，打造自訂應用'},
];
const roadmap={
  '初階 AI 法師':{next:'中階 AI 法師',skills:['提示詞咒文學','幻覺辨識術'],gear:['Claude 秘典','Perplexity 水晶球']},
  '中階 AI 法師':{next:'高階 AI 法師',skills:['商業解題術','人機協作術'],gear:['Notion 卷軸']},
  '高階 AI 法師':{next:'大法師',skills:['自動化陣法','人機協作術'],gear:['Python 鍊金台']},
  '大法師':{next:'賢者',skills:['策略思維','教學引導'],gear:['智慧冠冕']},
  '賢者':{next:'持續精進',skills:['緊跟 AI 新模型','帶領社群探索'],gear:[]},
};

let st={step:0,score:0,userName:'',mySkills:[],myGear:[]};
const certTime=new Date().toLocaleString('zh-TW',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});

function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');window.scrollTo(0,0);}

function startGame(){
  const n=document.getElementById('nameInput').value.trim();
  if(!n)return;
  st={step:0,score:0,userName:n,mySkills:[],myGear:[]};
  renderQ();show('s-question');
}

function renderQ(){
  const q=questions[st.step];
  document.getElementById('progress').innerHTML=questions.map((_,i)=>`<div class="prog-seg${i<st.step?' done':i===st.step?' cur':''}"></div>`).join('');
  document.getElementById('q-user-lbl').textContent=st.userName+' 的鑑定';
  document.getElementById('q-counter').textContent=`${st.step+1} / ${questions.length}`;
  document.getElementById('q-text').textContent=q.q;
  const o=document.getElementById('q-opts');o.innerHTML='';
  q.opts.forEach((op,i)=>{
    const b=document.createElement('button');
    b.className='opt-card';
    b.innerHTML=`<span class="opt-ltr">${'ABCD'[i]}</span>${op}`;
    b.onclick=()=>{st.score+=i;st.step++;if(st.step<questions.length){renderQ();}else{renderInv();show('s-inventory');}};
    o.appendChild(b);
  });
}

function renderInv(){
  const sl=document.getElementById('skill-list');sl.innerHTML='';
  skills.forEach(s=>{const d=document.createElement('button');d.className='sel-card';d.id='sk-'+s.name;d.innerHTML=`<div class="sel-name">${s.name}</div><div class="sel-desc">${s.desc}</div>`;d.onclick=()=>toggleSk(s.name);sl.appendChild(d);});
  const gl=document.getElementById('gear-list');gl.innerHTML='';
  equips.forEach(e=>{const d=document.createElement('button');d.className='sel-card';d.id='ge-'+e.name;d.innerHTML=`<div class="sel-name">${e.name}</div><div class="sel-desc">${e.desc}</div>`;d.onclick=()=>toggleGe(e.name);gl.appendChild(d);});
}
function toggleSk(n){const i=st.mySkills.indexOf(n);if(i>=0)st.mySkills.splice(i,1);else st.mySkills.push(n);const el=document.getElementById('sk-'+n);el.classList.toggle('sel-skill',st.mySkills.includes(n));el.querySelector('.sel-name').textContent=(st.mySkills.includes(n)?'✓ ':'')+n;updInvSum();}
function toggleGe(n){const i=st.myGear.indexOf(n);if(i>=0)st.myGear.splice(i,1);else st.myGear.push(n);const el=document.getElementById('ge-'+n);el.classList.toggle('sel-gear',st.myGear.includes(n));el.querySelector('.sel-name').textContent=(st.myGear.includes(n)?'✓ ':'')+n;updInvSum();}
function updInvSum(){const w=document.getElementById('inv-sum'),items=document.getElementById('inv-sum-items'),has=st.mySkills.length+st.myGear.length>0;w.style.display=has?'block':'none';items.innerHTML=st.mySkills.map(s=>`<span class="badge b-skill">⚡ ${s}</span>`).join('')+st.myGear.map(g=>`<span class="badge b-gear">⚔ ${g}</span>`).join('');}

function getRankIdx(){const t=[5,10,15,19,22];return t.findIndex(x=>st.score<x);}

function goResult(){
  const idx=getRankIdx(),rank=ranks[idx],icon=icons[idx],plan=roadmap[rank];
  document.getElementById('r-user').textContent=st.userName;
  document.getElementById('r-rank').textContent=icon+' '+rank;
  document.getElementById('r-time').textContent=certTime;
  // inv
  const inv=document.getElementById('r-inv');
  if(!st.mySkills.length&&!st.myGear.length){inv.innerHTML='<p style="color:var(--text-dim);font-size:.8rem;line-height:1.7">你跳過了盤點步驟。</p>';}
  else{let h='';if(st.mySkills.length)h+=`<p style="color:var(--text-dim);font-size:.68rem;letter-spacing:.1em;margin-bottom:8px">⚡ 已掌握技能 (${st.mySkills.length})</p><div class="wrap-gap" style="margin-bottom:12px">${st.mySkills.map(s=>`<span class="badge b-skill">${s}</span>`).join('')}</div>`;if(st.myGear.length)h+=`<p style="color:var(--text-dim);font-size:.68rem;letter-spacing:.1em;margin-bottom:8px">⚔ 已備齊裝備 (${st.myGear.length})</p><div class="wrap-gap">${st.myGear.map(g=>`<span class="badge b-gear">${g}</span>`).join('')}</div>`;inv.innerHTML=h;}
  // plan
  document.getElementById('r-next').textContent=plan.next;
  const gSm='<div class="gem sm green" style="display:inline-block;margin-right:8px"></div>';
  const oSm='<div class="gem sm orange" style="display:inline-block;margin-right:8px"></div>';
  document.getElementById('r-skills').innerHTML=plan.skills.length?plan.skills.map(s=>`<li style="display:flex;align-items:center;margin-bottom:5px;font-size:.8rem;color:#b0a080">${gSm}${s}</li>`).join(''):`<li style="color:var(--text-dim);font-size:.78rem;line-height:1.6">AI 持續演進，賢者也要與時俱進 🔮</li>`;
  document.getElementById('r-gear').innerHTML=plan.gear.length?plan.gear.map(g=>`<li style="display:flex;align-items:center;margin-bottom:5px;font-size:.8rem;color:#b0a080">${oSm}${g}</li>`).join(''):`<li style="color:var(--text-dim);font-size:.78rem;line-height:1.6">善用手邊工具，持續探索新裝備</li>`;
  // roadmap
  const rm=document.getElementById('roadmap');rm.innerHTML='';
  ranks.forEach((r,i)=>{
    const isCur=r===rank,isPast=i<idx,info=roadmap[r];
    const n=document.createElement('div');
    n.className='road-node'+(isCur?' current':isPast?' past':'');
    n.innerHTML=`<div style="font-size:.6rem;color:${isCur?'#c9a84c':isPast?'#2ecc71':'#3a2a1a'};letter-spacing:.06em;margin-bottom:4px">${isPast?'✅ 已達成':isCur?'📍 你在這裡':'🔒 未解鎖'}</div><div style="font-weight:700;font-size:.72rem;color:${isCur?'#c9a84c':isPast?'#2ecc71':'#3a2a1a'};margin-bottom:6px">${icons[i]} ${r}</div><div>${info.skills.slice(0,2).map(s=>`<span class="road-tag">${s}</span>`).join('')}</div>`;
    rm.appendChild(n);
    if(i<ranks.length-1){const a=document.createElement('div');a.className='road-arrow'+(idx>i?' lit':'');a.textContent='›';rm.appendChild(a);}
  });
  show('s-result');
}

function openShare(){
  const idx=getRankIdx(),rank=ranks[idx],plan=roadmap[rank];
  document.getElementById('sh-user').textContent=st.userName;
  document.getElementById('sh-rank').textContent=icons[idx]+' '+rank;
  document.getElementById('sh-time').textContent=certTime;
  document.getElementById('sh-next').textContent=plan.next;
  document.getElementById('sh-nextsk').textContent=plan.skills.length?'待解鎖：'+plan.skills.join('、'):'';
  document.getElementById('sh-sk-wrap').style.display=st.mySkills.length?'block':'none';
  document.getElementById('sh-ge-wrap').style.display=st.myGear.length?'block':'none';
  document.getElementById('sh-sk').innerHTML=st.mySkills.map(s=>`<span class="badge b-skill">${s}</span>`).join('');
  document.getElementById('sh-ge').innerHTML=st.myGear.map(g=>`<span class="badge b-gear">${g}</span>`).join('');
  document.getElementById('modal').classList.add('open');
}
function closeShare(){document.getElementById('modal').classList.remove('open');}

function restart(){st={step:0,score:0,userName:'',mySkills:[],myGear:[]};document.getElementById('nameInput').value='';show('s-intro');}
