/**
 * career-4s.js — Google Apps Script（轉換期 4S 盤點）
 * 前端：career-4s.html / js/career-4s.js
 * 部署為 Web App（執行身分：我，存取權：任何人）
 *
 * 流程（參考 GAS/career-interest.js）：收到 15 題的分數 → 在這裡計分、組 HTML 報告
 *   → PDFShift 轉 PDF → 寄給使用者填的 Email，密件副本給 OWNER_EMAIL。
 *   有設定 SPREADSHEET_ID 時，另外在「4S盤點」分頁加一列紀錄。
 *
 * 這個工具不需要註冊名稱，任何人都能送出，所以：
 *   - 前端只送分數、姓名、Email 和一句「正在面對的改變」；題目、說明、小行動的文字都放在這裡，
 *     不接受前端傳來的報告內容（避免有人用這支 API 寄出任意內容的信）。
 *   - 每天最多寄 DAILY_LIMIT 份，超過回傳 daily_limit。
 *
 * Script Properties：
 *   PDFSHIFT_API_KEY — PDFShift API Key（可沿用其他工具的同一把）
 *   OWNER_EMAIL      — 報告密件副本收件人（Saori）
 *   SPREADSHEET_ID   — 選填。要記錄到試算表才填
 *   COUNT_DATE / COUNT — 程式自己寫入的每日計數，不用手動設定
 *
 * API
 *   POST body(JSON, text/plain): { token, action: 'report', name, email, change, answers: [15 個 1–5 的整數] }
 *        → { ok: true, submittedAt } / { ok: false, error }
 *   error：unauthorized、invalid_email、invalid_data、daily_limit、report_failed、server_error
 */

// ─── 設定 ────────────────────────────────────────────────────────────────────
const TOKEN       = 'saori-4s-2026-fc978e'; // ← 需與前端 FS_TOKEN 相同
const DAILY_LIMIT = 100;                    // 每天最多寄出的報告數
const SHEET_NAME  = '4S盤點';
const NAME_MAX    = 40;
const CHANGE_MAX  = 60;                     // 需與 career-4s.html 的 maxlength 相同

// ─── 內容 ────────────────────────────────────────────────────────────────────
// ⚠ 這一段與 js/career-4s.js 的 FS_AREAS 內容相同，改題目時兩邊要一起改。
//   題目順序就是 answers 陣列的順序。
const AREAS = [
  {
    key: 'situation',
    name: '這件事本身',
    theory: '情境 Situation',
    weak: '讓你慌的，多半是這個改變本身：來得突然、時機不巧，或看不到什麼時候會結束。這不代表你能力不夠，是這一局本來就比較難。',
    questions: [
      { q: '這個改變，是你自己選的嗎？', low: '完全是被迫的', high: '完全是我選的',
        tip: '寫下這件事裡「我還能決定」的三件小事，先挑一件做。' },
      { q: '它來的時間點好嗎？', hint: '想想同一時間，你手上還有沒有別的壓力。', low: '偏偏挑最亂的時候', high: '來得正是時候',
        tip: '列出現在同時壓著你的事，挑一件這週先放下或延後。' },
      // 持續時間（Duration）：不管還在觀望、正在離開或已進新環境都答得出來
      { q: '這段不確定的日子會持續多久，你心裡有底嗎？', low: '完全不知道要多久', high: '大概知道何時會穩下來',
        tip: '給自己訂一個「先撐到這裡」的日期（例如三個月後），到那天再重新評估。' },
      { q: '你以前走過類似的改變嗎？', hint: '換工作、換角色、換領域都算。', low: '完全沒有', high: '有，而且走過來了',
        tip: '回想一次你走過來的改變（換學校、搬家也算），寫下當時幫到你的兩個做法。' }
    ]
  },
  {
    key: 'self',
    name: '你自己',
    theory: '自我 Self',
    weak: '這段時間你對自己比較沒把握。剛進入新角色時懷疑自己很常見，不等於你做不到。',
    questions: [
      { q: '你有多少把握能撐過這一段？', low: '幾乎沒把握', high: '很有把握',
        tip: '每天下班前記下 2 件今天做得順或學會的小事，連續記一週。' },
      { q: '想到接下來的日子，你的心情比較接近哪一邊？', low: '很怕出錯', high: '期待能學到東西',
        tip: '把最擔心的一句話寫下來，在旁邊改寫成「這是個考驗，但我可以學到⋯⋯」。' },
      // 價值（Values）：問的是「知不知道自己在乎什麼」，還沒有方向的人也能回答
      { q: '你清楚自己在工作上最在乎什麼嗎？', hint: '例如成就感、穩定、自由、學習、陪家人的時間。', low: '很模糊，說不上來', high: '很清楚',
        tip: '寫下工作上你最在乎的三件事，之後遇到選擇就拿它們來對照。' },
      { q: '你分得清自己缺的是技能，還是只是缺信心嗎？', low: '一團亂，說不清', high: '很清楚缺什麼',
        tip: '把擔心的事分成兩欄：「我還不會的」和「我會但沒把握的」，各挑一項先處理。' }
    ]
  },
  {
    key: 'support',
    name: '身邊的人',
    theory: '支持 Support',
    weak: '你現在比較像一個人在扛。能問的人、能靠的後援還不夠，或是其實有，但你還沒開口。',
    questions: [
      { q: '家人或伴侶，理解你現在的狀況嗎？', low: '不理解，或幫不上忙', high: '很理解也很支持',
        tip: '找一個晚上跟家人或伴侶說說你現在的狀況，也說出你希望他們怎麼幫你。' },
      { q: '有沒有走過這條路的人可以讓你問？', hint: '前輩、導師、資深同事都算。', low: '一個都沒有', high: '有，而且問得到',
        tip: '聯絡一位走過類似路的前輩，約 20 分鐘請教他當時怎麼過來的。' },
      { q: '課程、社群、諮詢或存款，這類後援夠用嗎？', low: '幾乎沒有', high: '很夠',
        tip: '找一個相關社群或課程加入，順便算一下存款能撐幾個月。' },
      { q: '需要幫忙的時候，你開得了口嗎？', low: '很難開口', high: '很自然就問了',
        tip: '這週向一個人問一個小問題，從最不尷尬的那個人開始。' }
    ]
  },
  {
    key: 'strategy',
    name: '你的做法',
    theory: '策略 Strategies',
    weak: '你手上的應對方法還不夠多。動手處理、換個角度看、照顧壓力，三種都要有一點才撐得久。',
    questions: [
      { q: '你有在動手處理這件事嗎？', hint: '例如問人、學新東西、改履歷、排每天的計畫。', low: '還沒開始', high: '持續在做',
        tip: '挑一件最小的事今天就做：改履歷的一段、報名一堂入門課，或問一個人。' },
      { q: '你能換個角度看這件事嗎？', hint: '例如把它當成學習的機會，或接受自己慢慢上手。', low: '很難，一直往壞處想', high: '常常可以',
        tip: '把「我要一次到位」改成「我先做到七成」，寫下這週的七成長什麼樣子。' },
      { q: '你有在照顧自己的壓力嗎？', hint: '運動、休息、做喜歡的事、找人說說都算。', low: '完全沒有', high: '固定在做',
        tip: '在行事曆上排三個 30 分鐘給自己：散步、運動，或什麼都不做。' }
    ]
  }
];

const STRONG_AT = 4; // 平均 4 分以上：穩
const OK_AT     = 3; // 3 分以上：還可以；以下：偏弱

const QUESTION_COUNT = AREAS.reduce((n, a) => n + a.questions.length, 0);
const SHEET_HEADERS = ['送出時間', '姓名', 'Email', '正在面對的改變', '最需要補的']
  .concat(AREAS.map(a => a.name + '（平均）'))
  .concat(AREAS.reduce((list, a) => list.concat(a.questions.map(q => q.q)), []));

// ─── 入口 ────────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.token !== TOKEN) return json({ ok: false, error: 'unauthorized' });
    if (body.action !== 'report') return json({ ok: false, error: 'unknown_action' });

    const email = String(body.email || '').trim();
    if (!validateEmail(email)) return json({ ok: false, error: 'invalid_email' });

    const data = validateSubmission(body);
    if (!data) return json({ ok: false, error: 'invalid_data' });

    if (!takeDailySlot()) {
      console.warn('[report] 今天已達 DAILY_LIMIT，拒絕送出');
      return json({ ok: false, error: 'daily_limit' });
    }

    const submittedAt = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm');
    const summary = summarize(data.answers);

    // 試算表是選用的紀錄，寫入失敗不影響報告
    try {
      logToSheet(data, email, summary, submittedAt);
    } catch (sheetErr) {
      console.error('[sheet] 失敗：' + sheetErr.message);
    }

    try {
      sendReport(email, data, summary, submittedAt);
    } catch (mailErr) {
      console.error('[report] 失敗：' + mailErr.message + '\n' + mailErr.stack);
      // detail 只給除錯看（瀏覽器開發者工具 → Network → 回應內容），前端不顯示
      return json({ ok: false, error: 'report_failed', detail: mailErr.message });
    }
    return json({ ok: true, submittedAt });
  } catch (err) {
    console.error('[report] doPost error: ' + err.message + '\n' + err.stack);
    return json({ ok: false, error: 'server_error', detail: err.message });
  }
}

// ─── 驗證送出內容，通過則回傳整理後的資料，否則回傳 null ─────────────────────
function validateSubmission(body) {
  const name = String(body.name || '').trim().slice(0, NAME_MAX);
  const change = String(body.change || '').trim().slice(0, CHANGE_MAX);
  const answers = Array.isArray(body.answers) ? body.answers.map(Number) : [];
  if (!name) return null;
  if (answers.length !== QUESTION_COUNT) return null;
  if (!answers.every(v => Number.isInteger(v) && v >= 1 && v <= 5)) return null;
  return { name, change, answers };
}

// ─── 每日上限：這支 API 是公開的，避免被拿來大量寄信、耗盡 PDFShift 額度 ──────
function takeDailySlot() {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const props = PropertiesService.getScriptProperties();
    const today = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd');
    const used = props.getProperty('COUNT_DATE') === today ? Number(props.getProperty('COUNT') || 0) : 0;
    if (used >= DAILY_LIMIT) return false;
    props.setProperties({ COUNT_DATE: today, COUNT: String(used + 1) });
    return true;
  } finally {
    lock.releaseLock();
  }
}

// ─── 計分（與 js/career-4s.js 的 summarize 相同）────────────────────────────
// 各面向取平均（題數不同，不能直接比總分）；同分時並列
function summarize(answers) {
  let n = 0;
  const areaScores = AREAS.map(a => a.questions.map(() => answers[n++]));
  const averages = areaScores.map(list => list.reduce((s, v) => s + v, 0) / list.length);
  const min = Math.min.apply(null, averages);
  const max = Math.max.apply(null, averages);
  const idxOf = target => averages.map((v, a) => (v === target ? a : -1)).filter(a => a >= 0);
  return {
    areaScores, averages, min, max,
    weakest: idxOf(min),
    strongest: idxOf(max),
    allTied: max === min,
    allStrong: min >= STRONG_AT
  };
}

function statusOf(avg) {
  if (avg >= STRONG_AT) return '穩';
  if (avg >= OK_AT) return '還可以';
  return '偏弱';
}

/** 這個面向裡分數最低的那一題（同分取第一題） */
function lowestQuestion(summary, areaIdx) {
  const scores = summary.areaScores[areaIdx];
  return AREAS[areaIdx].questions[scores.indexOf(Math.min.apply(null, scores))];
}

/** 全部題目裡分數最低的那一題（四個面向同分時用） */
function lowestOverall(answers) {
  let n = answers.indexOf(Math.min.apply(null, answers));
  for (let a = 0; a < AREAS.length; a++) {
    if (n < AREAS[a].questions.length) return AREAS[a].questions[n];
    n -= AREAS[a].questions.length;
  }
  return AREAS[0].questions[0];
}

function weakestLabel(summary) {
  return summary.allTied ? '四項同分' : summary.weakest.map(a => AREAS[a].name).join('、');
}

// ─── 試算表紀錄（選用）：有設定 SPREADSHEET_ID 才寫，每次送出一列 ─────────────
function logToSheet(data, email, summary, submittedAt) {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) return;
  const ss = SpreadsheetApp.openById(id);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, SHEET_HEADERS.length).setValues([SHEET_HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  // 姓名與改變是使用者自由輸入：開頭加 ' 讓試算表當成純文字，不會被當公式執行
  const text = v => (/^[=+\-@]/.test(v) ? "'" + v : v);
  sheet.appendRow([submittedAt, text(data.name), email, text(data.change), weakestLabel(summary)]
    .concat(summary.averages.map(v => Math.round(v * 10) / 10))
    .concat(data.answers));
}

// ─── PDF 報告：組 HTML → PDFShift → 寄信（流程同 GAS/career-interest.js）─────
function sendReport(email, data, summary, submittedAt) {
  const props = PropertiesService.getScriptProperties();
  const ownerEmail = props.getProperty('OWNER_EMAIL') || '';
  const html = buildReportHtml(data, summary, submittedAt);
  const pdfBlob = convertToPdf(html, props.getProperty('PDFSHIFT_API_KEY'))
    .setName(`${data.name}_轉換期4S盤點報告.pdf`);
  console.log(`[report] PDF 完成：${pdfBlob.getBytes().length} bytes`);
  sendReportEmail(email, ownerEmail, data.name, pdfBlob);
  console.log(`[report] 已寄出，今日剩餘寄信額度：${MailApp.getRemainingDailyQuota()}`);
}

// 報告版面沿用盤點頁：米白紙底、墨色字、Noto Serif TC 標題；紅色只用在短掉的那隻腳
function buildReportHtml(data, summary, submittedAt) {
  const C = { paper: '#faf7f2', ink: '#1c1a17', mid: '#5c5650', soft: '#8a8279', line: '#e4dccd', warm: '#f5f0e8', weak: '#a8543a', accent: '#8b6f47' };
  const LEG_H = 130; // 桌腳滿分的長度（px）

  const action = q => `<div class="action">
      <div class="action-title">這週做一件小事</div>
      <div class="action-text">${escHtml(q.tip)}</div>
      <div class="action-why">因為這一題你給的分數最低：${escHtml(q.q)}</div>
    </div>`;

  let label;
  let weakBlocks;
  if (summary.allTied) {
    label = '盤點結果';
    weakBlocks = `<div class="weak is-even">
      <h2>四隻腳一樣長</h2>
      <p class="desc">${summary.allStrong
        ? '四個方向都站得穩，照現在的步調走就好。想更穩的話，可以從下面這件小事開始。'
        : '沒有哪一隻特別短，所以不用急著找「問題出在哪」。先從分數最低的那一題開始補。'}</p>
      ${action(lowestOverall(data.answers))}
    </div>`;
  } else {
    label = summary.allStrong ? '四隻腳都站得穩。想更穩的話，可以多顧一點的是' : '你現在最需要補的是';
    weakBlocks = summary.weakest.map(a => `<div class="weak">
      <h2>${escHtml(AREAS[a].name)}</h2>
      <p class="theory">4S 理論裡的「${escHtml(AREAS[a].theory)}」</p>
      ${summary.allStrong ? '' : `<p class="desc">${escHtml(AREAS[a].weak)}</p>`}
      ${action(lowestQuestion(summary, a))}
    </div>`).join('');
  }

  const isWeak = a => !summary.allStrong && !summary.allTied && summary.weakest.indexOf(a) >= 0;
  const legs = AREAS.map((area, a) => {
    const avg = summary.averages[a];
    return `<td class="${isWeak(a) ? 'is-weak' : ''}">
      <div class="slot"><div class="bar" style="height:${Math.round(avg / 5 * LEG_H)}px"></div></div>
      <div class="leg-name">${escHtml(area.name)}</div>
      <div class="leg-score">${avg.toFixed(1)}</div>
      <div class="leg-status">${statusOf(avg)}</div>
    </td>`;
  }).join('');

  const strongest = summary.allTied ? '' :
    `<p class="strong">你最穩的是${summary.strongest.map(a => `「${escHtml(AREAS[a].name)}」`).join('和')}。先靠它撐著，再慢慢補短的那一邊。</p>`;

  // 作答明細：每題的分數用 5 個圓點表示，兩端文字照題目原樣
  const dots = v => [1, 2, 3, 4, 5].map(i => `<i class="${i <= v ? 'on' : ''}"></i>`).join('');
  const details = AREAS.map((area, a) => `<div class="area">
      <h3>${escHtml(area.name)}<span class="area-theory">${escHtml(area.theory)}</span><span class="area-avg">平均 ${summary.averages[a].toFixed(1)}</span></h3>
      <table class="answers">${area.questions.map((q, i) => {
        const v = summary.areaScores[a][i];
        return `<tr>
          <td class="q">${escHtml(q.q)}<div class="ends">1 ${escHtml(q.low)}　5 ${escHtml(q.high)}</div></td>
          <td class="dots">${dots(v)}</td>
          <td class="v">${v}</td>
        </tr>`;
      }).join('')}</table>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<title>${escHtml(data.name)} 的轉換期 4S 盤點報告</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700&family=Noto+Sans+TC:wght@400;500&family=EB+Garamond:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif; background: ${C.paper}; color: ${C.ink}; font-size: 13px; line-height: 1.75; }
  .page { padding: 36px 40px 28px; }
  header { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 14px; border-bottom: 1px solid ${C.ink}; }
  header .kind { font-size: 12px; color: ${C.mid}; letter-spacing: .08em; }
  header h1 { font-family: 'Noto Serif TC', serif; font-size: 26px; font-weight: 700; letter-spacing: .06em; line-height: 1.3; }
  header .date { font-size: 11px; color: ${C.soft}; }
  .change { padding: 12px 0; border-bottom: 1px solid ${C.line}; color: ${C.mid}; word-break: break-all; }

  .label { font-size: 12px; color: ${C.soft}; letter-spacing: .08em; margin-top: 22px; }
  .weak { border-left: 3px solid ${C.weak}; padding-left: 18px; margin: 8px 0 20px; page-break-inside: avoid; }
  .weak h2 { font-family: 'Noto Serif TC', serif; font-size: 34px; font-weight: 700; letter-spacing: .08em; line-height: 1.3; color: ${C.weak}; }
  .weak.is-even { border-left-color: ${C.accent}; }
  .weak.is-even h2 { color: ${C.ink}; font-size: 28px; margin-bottom: 6px; }
  .theory { font-size: 11px; color: ${C.soft}; letter-spacing: .06em; margin-bottom: 8px; }
  .desc { font-size: 14px; line-height: 1.9; margin-bottom: 12px; }
  .action { background: ${C.warm}; padding: 12px 16px 14px; }
  .action-title { font-size: 11px; font-weight: 500; color: ${C.accent}; letter-spacing: .1em; }
  .action-text { font-family: 'Noto Serif TC', serif; font-size: 15px; font-weight: 600; line-height: 1.8; }
  .action-why { font-size: 11px; color: ${C.soft}; margin-top: 4px; }

  section { padding-top: 22px; }
  section > h2 { font-family: 'Noto Serif TC', serif; font-size: 17px; font-weight: 600; letter-spacing: .04em; padding-bottom: 8px; border-bottom: 1px solid ${C.line}; }
  section > .lead { font-size: 12px; color: ${C.mid}; margin: 8px 0 2px; }

  .table { margin-top: 16px; page-break-inside: avoid; }
  .table-top { height: 9px; background: ${C.ink}; }
  .legs { width: 100%; border-collapse: collapse; table-layout: fixed; }
  .legs td { text-align: center; vertical-align: top; padding: 0; }
  .slot { height: ${LEG_H}px; border-bottom: 1px solid ${C.line}; margin-bottom: 8px; background: linear-gradient(#cfc4b1, #cfc4b1) center / 1px 100% no-repeat; }
  .bar { width: 13px; margin: 0 auto; background: ${C.ink}; }
  .leg-name { font-family: 'Noto Serif TC', serif; font-size: 13px; font-weight: 600; }
  .leg-score { font-family: 'EB Garamond', serif; font-size: 24px; line-height: 1.3; }
  .leg-status { font-size: 11px; color: ${C.soft}; }
  .is-weak .slot { background: repeating-linear-gradient(${C.weak} 0 5px, transparent 5px 10px) center / 2px 100% no-repeat; }
  .is-weak .bar { background: ${C.weak}; }
  .is-weak .leg-name, .is-weak .leg-score, .is-weak .leg-status { color: ${C.weak}; }
  .strong { margin-top: 14px; font-size: 14px; }

  .detail { page-break-before: always; }
  .area { margin-top: 12px; page-break-inside: avoid; }
  .area h3 { font-family: 'Noto Serif TC', serif; font-size: 14px; font-weight: 600; }
  .area-theory { font-family: 'Noto Sans TC', sans-serif; font-size: 11px; font-weight: 400; color: ${C.soft}; margin-left: 10px; }
  .area-avg { float: right; font-family: 'Noto Sans TC', sans-serif; font-size: 11px; font-weight: 400; color: ${C.mid}; }
  .answers { width: 100%; border-collapse: collapse; margin-top: 4px; border-top: 1px solid ${C.line}; }
  .answers td { padding: 4px 0; border-bottom: 1px solid ${C.line}; vertical-align: middle; line-height: 1.5; }
  .answers .q { font-weight: 500; padding-right: 16px; }
  .ends { font-size: 11px; font-weight: 400; color: ${C.soft}; }
  .answers .dots { width: 92px; white-space: nowrap; }
  .dots i { display: inline-block; width: 11px; height: 11px; margin-right: 5px; border: 1px solid ${C.ink}; border-radius: 50%; }
  .dots i.on { background: ${C.ink}; }
  .answers .v { width: 22px; text-align: right; font-family: 'EB Garamond', serif; font-size: 18px; }

  .review { margin-top: 14px; font-size: 12px; color: ${C.mid}; }
  footer { margin-top: 14px; padding-top: 12px; border-top: 1px solid ${C.line}; font-size: 11px; color: ${C.soft}; display: flex; justify-content: space-between; }
  footer a { color: ${C.mid}; }
</style>
</head>
<body>
<div class="page">
  <header>
    <div>
      <div class="kind">轉換期 4S 盤點報告</div>
      <h1>${escHtml(data.name)}</h1>
    </div>
    <div class="date">盤點時間 ${escHtml(submittedAt)}</div>
  </header>
  ${data.change ? `<p class="change">正在面對的改變：${escHtml(data.change)}</p>` : ''}

  <p class="label">${label}</p>
  ${weakBlocks}

  <section>
    <h2>你的四隻腳</h2>
    <p class="lead">把走過改變的你想成一張桌子，靠四隻腳撐著。每隻腳滿分 5 分，越長越穩；虛線是還沒補上的部分。</p>
    <div class="table">
      <div class="table-top"></div>
      <table class="legs"><tr>${legs}</tr></table>
    </div>
    ${strongest}
  </section>

  <section class="detail">
    <h2>作答明細</h2>
    <p class="lead">每題 1 到 5 分，分數越高代表這件事越是在幫你。</p>
    ${details}
    <p class="review">改變是一段路，不是一個點。兩週後再做一次，對照這一頁，看看短的那隻腳有沒有長回來。</p>
  </section>

  <footer>
    <span>Saori 謝孟娟 轉換期 4S 盤點（改編自 Nancy K. Schlossberg 的 4S 轉折理論）</span>
    <span>想一起聊聊這份結果？<a href="https://lin.ee/YVBqq6u">聯繫 Saori</a></span>
  </footer>
</div>
</body>
</html>`;
}

// ─── 呼叫 PDFShift API（同 GAS/career-interest.js）──────────────────────────
function convertToPdf(htmlContent, apiKey) {
  if (!apiKey) {
    throw new Error('PDFShift API Key 未設定（Script Properties: PDFSHIFT_API_KEY）');
  }
  const response = UrlFetchApp.fetch('https://api.pdfshift.io/v3/convert/pdf', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Utilities.base64Encode('api:' + apiKey),
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify({
      source: htmlContent,
      landscape: false,
      use_print: false,
      format: 'A4',
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
    }),
    muteHttpExceptions: true
  });
  const status = response.getResponseCode();
  if (status !== 200 && status !== 201) {
    console.error('[report] PDFShift error (' + status + '): ' + response.getContentText());
    throw new Error('PDF 產生失敗（HTTP ' + status + '）');
  }
  return response.getBlob();
}

// ─── 寄送報告 Email ──────────────────────────────────────────────────────────
function sendReportEmail(email, ownerEmail, userName, pdfBlob) {
  const name = escHtml(userName);
  const htmlBody = `
    <div style="font-family:'Microsoft JhengHei',sans-serif;max-width:560px;margin:0 auto;color:#1c1a17;line-height:1.8;">
      <p style="margin-bottom:16px;">${name} 你好，</p>
      <p style="margin-bottom:16px;">謝謝你完成轉換期 4S 盤點。你的報告附在這封信裡（PDF），裡面有你現在最需要補的那一塊、這週可以做的一件小事，還有 15 題的作答明細。</p>
      <p style="margin-bottom:24px;">建議兩週後再做一次，對照這份報告看看有沒有變化。想找人一起看結果，也歡迎找我聊聊。</p>
      <a href="https://lin.ee/YVBqq6u" style="display:inline-block;background:#1c1a17;color:#faf7f2;padding:10px 22px;border-radius:4px;text-decoration:none;">聯繫 Saori</a>
      <p style="margin-top:28px;padding-top:16px;border-top:1px solid #e4dccd;font-size:12px;color:#8a8279;">這封信由轉換期 4S 盤點工具自動寄出，有問題可以直接回覆。</p>
    </div>`;

  const options = {
    to: email,
    subject: `【轉換期 4S 盤點】${userName} 的報告`,
    htmlBody: htmlBody,
    attachments: [pdfBlob],
    name: 'Saori 轉換期 4S 盤點'
  };
  if (ownerEmail) options.bcc = ownerEmail;
  MailApp.sendEmail(options);
}

// ─── 工具 ────────────────────────────────────────────────────────────────────
function validateEmail(email) {
  return email.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── 測試用（在 GAS 編輯器直接執行；不寫試算表，報告只寄到 OWNER_EMAIL）─────
function testReportEmail() {
  const owner = PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL');
  if (!owner) throw new Error('請先設定 Script Properties: OWNER_EMAIL');
  const data = { name: '測試用戶', change: '工程師轉主管', answers: [4, 2, 3, 5, 4, 3, 5, 4, 2, 1, 3, 2, 4, 3, 2] };
  sendReport(owner, data, summarize(data.answers), Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm'));
  Logger.log('測試報告已寄到 ' + owner);
}

/*
 * ─── 部署步驟 ────────────────────────────────────────────────────────────────
 * 1. 到 script.google.com 新增專案（要記錄到試算表的話，也可以從那份試算表 → 擴充功能 → Apps Script）
 * 2. 貼上此檔案全部內容，儲存
 * 3. 專案設定 → 指令碼屬性：
 *      PDFSHIFT_API_KEY — 必填，可沿用 career-interest / lifevalue 的同一把
 *      OWNER_EMAIL      — 必填，報告密件副本收件人
 *      SPREADSHEET_ID   — 選填，填了才會把每次送出記到試算表的「4S盤點」分頁（沒有會自動建立）
 * 4. 在編輯器執行 testReportEmail()，依指示授權（外部連線、寄信、試算表），確認信箱收到 PDF
 * 5. 部署 → 新增部署作業 → 類型：網頁應用程式
 *    - 執行身分：我
 *    - 存取權：任何人
 * 6. 複製 Web App 網址（.../exec），貼到 js/career-4s.js 的 FS_GAS_URL
 *    （在貼上網址之前，盤點頁不會顯示「寄 PDF 報告」的區塊）
 *
 * 之後修改程式碼：部署 → 管理部署作業 → 編輯（鉛筆）→ 版本選「新版本」→ 部署
 * （網址不變；若改用「新增部署作業」會產生新網址，前端也要跟著換）
 */
