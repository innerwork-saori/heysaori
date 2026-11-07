/**
 * career-interest.js — Google Apps Script（職業興趣探索）
 * 前端：career-interest.html / js/career-interest.js
 * 部署為 Web App（執行身分：我，存取權：任何人）
 *
 * 試算表：每位使用者一個分頁，分頁名稱 = 使用者的「註冊名稱」
 * 分頁格式（與「職業卡.xlsx」相同，第一列為標題）：
 *   A: SN   B: 職業名稱   C: 興趣代碼 (Holland Code)
 *   D: 挑選（勾選 TRUE）   E: 排名（1–10）   F: 挑選、排序的原因
 *   G1: 送出時間紀錄（每次送出加一行，保留全部歷史）
 * 若分頁是空白的，送出時會自動補上標題與 100 個職業列。
 *
 * API
 *   GET  ?action=check&token=TOKEN&name=NAME  → { ok: true } / { ok: false, error: 'not_found' }
 *   POST body(JSON, text/plain): { token, action: 'submit', name, picks, ranking, reasons, jobs }
 *        → { ok: true, submittedAt } / { ok: false, error }
 */

// ─── 設定 ────────────────────────────────────────────────────────────────────
const SPREADSHEET_ID = '1i6KtOBA7mByVXK_sC6GqZgWaWS1N07XBWSsBZaYUnyI';
const TOKEN          = 'saori-ci-2026-hT4qW'; // ← 需與前端 CI_TOKEN 相同

// 這些分頁不能被當成註冊名稱（範本、彙整用等），可自行增減
const EXCLUDED_SHEETS = ['工作表1', '範本', 'template'];

const PICK_MIN  = 10;
const PICK_MAX  = 15;
const RANK_SIZE = 10;
const JOB_COUNT = 100;

const HEADERS = [
  'SN',
  '職業名稱 (Occupation)',
  '興趣代碼 (Holland Code)',
  '挑選至多 15 項打勾',
  '勾選的職業中，排名至少 10 項',
  '挑選、排序的原因'
];

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
      writeSubmission(sheet, data, body.jobs);
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
  const picks   = (Array.isArray(body.picks) ? body.picks : []).map(toSn);
  const ranking = (Array.isArray(body.ranking) ? body.ranking : []).map(toSn);
  const reasons = body.reasons || {};

  if (picks.indexOf(null) >= 0 || ranking.indexOf(null) >= 0) return null;
  if (new Set(picks).size !== picks.length || new Set(ranking).size !== ranking.length) return null;
  if (picks.length < PICK_MIN || picks.length > PICK_MAX) return null;
  if (ranking.length !== RANK_SIZE) return null;
  if (!ranking.every(sn => picks.indexOf(sn) >= 0)) return null;

  const cleanReasons = {};
  for (let i = 0; i < ranking.length; i++) {
    const text = String(reasons[ranking[i]] || '').trim().slice(0, 1000);
    if (!text) return null;
    cleanReasons[ranking[i]] = text;
  }
  return { picks, ranking, reasons: cleanReasons };
}

// ─── 寫入分頁 D/E/F 欄（依 A 欄 SN 對應列）──────────────────────────────────
function writeSubmission(sheet, data, jobs) {
  if (sheet.getLastRow() < 2) fillTemplate(sheet, jobs);
  // 結果不需要挑選說明：既有分頁（舊版或從範本複製）的 B1 也統一成簡短標題
  sheet.getRange(1, 2).setValue(HEADERS[1]);

  const lastRow = sheet.getLastRow();
  const snCol = sheet.getRange(2, 1, lastRow - 1, 1).getValues();

  // 先確認每個挑選的 SN 都找得到對應列
  const rowBySn = {};
  snCol.forEach((r, i) => {
    const sn = Number(r[0]);
    if (Number.isInteger(sn)) rowBySn[sn] = i;
  });
  if (!data.picks.every(sn => rowBySn[sn] !== undefined)) {
    throw new Error('sheet rows do not match SN 1–' + JOB_COUNT);
  }

  // 整批重寫 D:F：先清空（支援重新送出），再填入這次的結果
  const rankOf = {};
  data.ranking.forEach((sn, i) => { rankOf[sn] = i + 1; });
  const values = snCol.map(r => {
    const sn = Number(r[0]);
    const picked = data.picks.indexOf(sn) >= 0;
    return [
      picked ? true : '', // 空字串：核取方塊欄顯示為未勾選，一般欄則保持空白

      rankOf[sn] || '',
      rankOf[sn] ? data.reasons[sn] : ''
    ];
  });
  sheet.getRange(2, 4, values.length, 3).setValues(values);

  // 排序 A:F（第 2 列以下）：D 有勾的在前 → E 名次 1→10 → C 興趣代碼 A→Z
  // 列的順序改變不影響重新送出：上面是依 A 欄 SN 對應列，不是依列號
  sheet.getRange(2, 1, values.length, 6).sort([
    { column: 4, ascending: false },
    { column: 5, ascending: true },
    { column: 3, ascending: true }
  ]);
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
