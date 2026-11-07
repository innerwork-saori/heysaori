/**
 * career-interest.js — Google Apps Script（職業興趣探索，已合併舊版 career-card 熱情探索）
 * 前端：career-interest.html / js/career-interest.js
 * 部署為 Web App（執行身分：我，存取權：任何人）
 *
 * 試算表：每位使用者一個分頁，分頁名稱 = 使用者的「註冊名稱」
 * 分頁格式（第一列為標題）：
 *   A: SN   B: 職業名稱   C: 興趣代碼 (Holland Code)
 *   D: 挑選（勾選 TRUE）
 *   E: 排名／分類（前 10 名寫名次；名次中不是純粹喜歡的寫成「9（他人期望）」；沒名次的寫分類名稱）
 *   F: 原因／洞察（有名次的寫原因，沒名次的他人期望／僅是有能力做寫洞察）
 *   G1: 送出時間紀錄（每次送出加一行，保留全部歷史）
 *   H:I: 六大類統計、主要類型、反思問題與回答（每次送出整塊重寫）
 * 若分頁是空白的，送出時會自動補上標題與 100 個職業列。
 *
 * API
 *   GET  ?action=check&token=TOKEN&name=NAME  → { ok: true } / { ok: false, error: 'not_found' }
 *   POST body(JSON, text/plain):
 *        { token, action: 'submit', name, picks, classifications, ranking, reasons, insights, reflections, jobs }
 *        → { ok: true, submittedAt } / { ok: false, error }
 *   相容舊版前端：沒有 classifications 時，所有挑選的職業視為「純粹喜歡」。
 */

// ─── 設定 ────────────────────────────────────────────────────────────────────
const SPREADSHEET_ID = '1i6KtOBA7mByVXK_sC6GqZgWaWS1N07XBWSsBZaYUnyI';
const TOKEN          = 'saori-ci-2026-hT4qW'; // ← 需與前端 CI_TOKEN 相同

// 這些分頁不能被當成註冊名稱（範本、彙整用等），可自行增減
const EXCLUDED_SHEETS = ['工作表1', '範本', 'template'];

const PICK_MIN  = 10;
const PICK_MAX  = 15;
const PURE_MIN  = 5;
const RANK_SIZE = 10; // 一律排 10 名，純粹喜歡不足時可用其他挑選的職業補上
const JOB_COUNT = 100;
const TEXT_MAX  = 1000;
const REFLECTION_COUNT = 5;

// 動機分類（key 需與前端 CLS_LABELS 相同）
const CLS_LABELS = { pure: '純粹喜歡', others: '他人期望', capable: '僅是有能力做' };
const CLS_ORDER  = { pure: 0, others: 1, capable: 2 };

const HOLLAND_ORDER  = ['R', 'I', 'A', 'S', 'E', 'C'];
const HOLLAND_LABELS = { R: '實用型', I: '研究型', A: '藝術型', S: '社會型', E: '企業型', C: '事務型' };

const HEADERS = [
  'SN',
  '職業名稱 (Occupation)',
  '興趣代碼 (Holland Code)',
  '挑選至多 15 項打勾',
  '排名／分類',
  '原因／洞察'
];

// H:I 區塊重寫前會先清空的範圍（列數需大於實際寫入的列數）
const SUMMARY_ROWS = 30;

// ─── 入口 ────────────────────────────────────────────────────────────────────
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.token !== TOKEN) return json({ ok: false, error: 'unauthorized' });
  if (p.action !== 'check') return json({ ok: false, error: 'unknown_action' });

  const sheet = findUserSheet(p.name);
  return json(sheet ? { ok: true } : { ok: false, error: 'not_found' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.token !== TOKEN) return json({ ok: false, error: 'unauthorized' });
    if (body.action !== 'submit') return json({ ok: false, error: 'unknown_action' });

    const sheet = findUserSheet(body.name);
    if (!sheet) return json({ ok: false, error: 'not_found' });

    const data = validateSubmission(body);
    if (!data) return json({ ok: false, error: 'invalid_data' });

    // 避免同時送出互相覆蓋
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    const submittedAt = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm');
    try {
      const codes = writeSubmission(sheet, data, body.jobs);
      writeSummary(sheet, data, codes);
      logSubmitTime(sheet, submittedAt);
    } finally {
      lock.releaseLock();
    }

    return json({ ok: true, submittedAt });
  } catch (err) {
    Logger.log('doPost error: ' + err.message);
    return json({ ok: false, error: 'server_error', detail: err.message });
  }
}

// ─── 找分頁：名稱需完全一致（前後空白會被去掉）──────────────────────────────
function findUserSheet(name) {
  const n = String(name || '').trim();
  if (!n || EXCLUDED_SHEETS.indexOf(n) >= 0) return null;
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(n);
}

// ─── 驗證送出內容，通過則回傳整理後的資料，否則回傳 null ─────────────────────
function validateSubmission(body) {
  const toSn = v => {
    const n = Number(v);
    return Number.isInteger(n) && n >= 1 && n <= JOB_COUNT ? n : null;
  };
  const clean = v => String(v || '').trim().slice(0, TEXT_MAX);

  const picks   = (Array.isArray(body.picks) ? body.picks : []).map(toSn);
  const ranking = (Array.isArray(body.ranking) ? body.ranking : []).map(toSn);
  const reasons = body.reasons || {};

  if (picks.indexOf(null) >= 0 || ranking.indexOf(null) >= 0) return null;
  if (new Set(picks).size !== picks.length || new Set(ranking).size !== ranking.length) return null;
  if (picks.length < PICK_MIN || picks.length > PICK_MAX) return null;

  // 分類：舊版前端沒有這個欄位 → 全部視為純粹喜歡
  const rawCls = body.classifications;
  const cls = {};
  for (let i = 0; i < picks.length; i++) {
    const c = rawCls ? rawCls[picks[i]] : 'pure';
    if (!CLS_LABELS[c]) return null;
    cls[picks[i]] = c;
  }
  const pure = picks.filter(sn => cls[sn] === 'pure');
  if (pure.length < PURE_MIN) return null;

  // 名次：一律 10 名，從挑選的職業中排
  if (ranking.length !== RANK_SIZE) return null;
  if (!ranking.every(sn => cls[sn])) return null;

  const cleanReasons = {};
  for (let i = 0; i < ranking.length; i++) {
    const text = clean(reasons[ranking[i]]);
    if (!text) return null;
    cleanReasons[ranking[i]] = text;
  }

  // 洞察（選填）：只收沒排進名次的他人期望／僅是有能力做
  const rawInsights = body.insights || {};
  const insights = {};
  picks.forEach(sn => {
    if (cls[sn] !== 'pure' && ranking.indexOf(sn) < 0) {
      const text = clean(rawInsights[sn]);
      if (text) insights[sn] = text;
    }
  });

  // 反思（選填）：題目文字由前端帶入（含主要類型），回答可空白
  const rawRefl = Array.isArray(body.reflections) ? body.reflections.slice(0, REFLECTION_COUNT) : [];
  const reflections = rawRefl.map(r => ({ q: clean(r && r.q).slice(0, 300), a: clean(r && r.a) }))
    .filter(r => r.q);

  return { picks, cls, ranking, reasons: cleanReasons, insights, reflections };
}

// ─── 寫入分頁 A:F（依 A 欄 SN 對應列），回傳 { sn: 興趣代碼 } 供統計用 ────────
function writeSubmission(sheet, data, jobs) {
  if (sheet.getLastRow() < 2) fillTemplate(sheet, jobs);
  // 既有分頁（舊版或從範本複製）的標題統一成目前的格式
  sheet.getRange(1, 2).setValue(HEADERS[1]);
  sheet.getRange(1, 5, 1, 2).setValues([[HEADERS[4], HEADERS[5]]]);

  const lastRow = sheet.getLastRow();
  const rows = sheet.getRange(2, 1, lastRow - 1, 3).getValues(); // A:C

  // 先確認每個挑選的 SN 都找得到對應列
  const codes = {};
  rows.forEach(r => {
    const sn = Number(r[0]);
    if (Number.isInteger(sn)) codes[sn] = String(r[2] || '');
  });
  if (!data.picks.every(sn => codes[sn] !== undefined)) {
    throw new Error('sheet rows do not match SN 1–' + JOB_COUNT);
  }

  const rankOf = {};
  data.ranking.forEach((sn, i) => { rankOf[sn] = i + 1; });

  // 整批重寫 A:F（支援重新送出：沒挑選的列 D:F 會被清空）
  const out = rows.map(r => {
    const sn = Number(r[0]);
    const c = data.cls[sn];
    const picked = !!c;
    let tag = '';
    let note = '';
    if (rankOf[sn]) {
      tag = c === 'pure' ? rankOf[sn] : `${rankOf[sn]}（${CLS_LABELS[c]}）`;
      note = data.reasons[sn];
    } else if (picked) {
      tag = CLS_LABELS[c];
      note = data.insights[sn] || '';
    }
    return [r[0], r[1], r[2], picked ? true : '', tag, note];
  });

  // 排序：有勾的在前 → 名次 1→10 → 沒名次的純粹喜歡 → 他人期望 → 僅是有能力做 → 興趣代碼 A→Z
  // 在程式裡排好再寫回，不依賴試算表對數字與文字混排的排序規則
  const sortKey = row => {
    const sn = Number(row[0]);
    const c = data.cls[sn];
    if (!c) return 1000;
    if (rankOf[sn]) return rankOf[sn];
    return 100 + CLS_ORDER[c];
  };
  out.sort((a, b) =>
    sortKey(a) - sortKey(b) ||
    String(a[2]).localeCompare(String(b[2])) ||
    Number(a[0]) - Number(b[0])
  );

  sheet.getRange(2, 1, out.length, 6).setValues(out);
  return codes;
}

// ─── H:I 區塊：六大類統計＋主要類型＋反思 ────────────────────────────────────
function writeSummary(sheet, data, codes) {
  const count = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  data.picks.filter(sn => data.cls[sn] === 'pure').forEach(sn => {
    String(codes[sn] || '').split('').forEach(ch => {
      if (count[ch] !== undefined) count[ch]++;
    });
  });
  const ranked = HOLLAND_ORDER.slice().sort((a, b) =>
    count[b] - count[a] || HOLLAND_ORDER.indexOf(a) - HOLLAND_ORDER.indexOf(b));
  const top = count[ranked[0]];
  const primary = top > 0
    ? ranked.filter(k => count[k] === top).map(k => k + ' ' + HOLLAND_LABELS[k]).join('、')
    : '—';

  const block = [['六大類統計（純粹喜歡的職業）', '次數']];
  ranked.forEach(k => block.push([k + ' ' + HOLLAND_LABELS[k], count[k]]));
  block.push(['主要類型', primary]);
  const boldRows = [0, block.length - 1];

  if (data.reflections.length) {
    block.push(['', '']);
    boldRows.push(block.length);
    block.push(['反思問題', '回答']);
    data.reflections.forEach(r => block.push([r.q, r.a]));
  }

  sheet.getRange(1, 8, SUMMARY_ROWS, 2).clearContent().setFontWeight('normal');
  sheet.getRange(1, 8, block.length, 2).setValues(block).setWrap(true).setVerticalAlignment('top');
  boldRows.forEach(i => sheet.getRange(i + 1, 8, 1, 2).setFontWeight('bold'));
}

// ─── 送出紀錄：G1 保留每一次送出的時間（舊的在上、最新在下）──────────────────
const SUBMIT_LOG_TITLE = '送出時間';

function logSubmitTime(sheet, submittedAt) {
  const cell = sheet.getRange(1, 7);
  const prev = String(cell.getValue() || '');
  const lines = prev.indexOf(SUBMIT_LOG_TITLE) === 0 ? prev.split('\n') : [SUBMIT_LOG_TITLE];
  lines.push(`第 ${lines.length} 次　${submittedAt}`);
  cell.setValue(lines.join('\n')).setFontWeight('bold').setWrap(true);
}

// ─── 空白分頁：補上標題與 100 個職業列 ──────────────────────────────────────
function fillTemplate(sheet, jobs) {
  if (!Array.isArray(jobs) || jobs.length !== JOB_COUNT) {
    throw new Error('empty sheet and no job list to fill it');
  }
  const rows = jobs.map(j => [Number(j[0]), String(j[1]), String(j[2])]);
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold').setWrap(true);
  sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  sheet.getRange(2, 4, rows.length, 1).insertCheckboxes();
  sheet.setFrozenRows(1);
}

// ─── 工具 ────────────────────────────────────────────────────────────────────
function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/*
 * ─── 部署步驟 ────────────────────────────────────────────────────────────────
 * 1. 開啟試算表 → 擴充功能 → Apps Script（或到 script.google.com 新增專案）
 * 2. 貼上此檔案全部內容，儲存
 * 3. 部署 → 新增部署作業 → 類型：網頁應用程式
 *    - 執行身分：我
 *    - 存取權：任何人
 * 4. 第一次部署會要求授權（存取試算表），依指示允許
 * 5. 複製 Web App 網址（.../exec），貼到 js/career-interest.js 的 CI_GAS_URL
 *
 * 之後修改程式碼：部署 → 管理部署作業 → 編輯（鉛筆）→ 版本選「新版本」→ 部署
 * （網址不變；若改用「新增部署作業」會產生新網址，前端也要跟著換）
 *
 * ─── 測試 ────────────────────────────────────────────────────────────────────
 * 在瀏覽器開啟：WEB_APP_URL?action=check&token=saori-ci-2026-hT4qW&name=分頁名稱
 * 分頁存在 → {"ok":true}；不存在 → {"ok":false,"error":"not_found"}
 */
