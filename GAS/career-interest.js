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
 * PDF 報告（參考 GAS/lifevalue.js）：寫入試算表後 → 組 HTML 報告 → PDFShift 轉 PDF
 *   → 寄給使用者填的 Email，密件副本給 OWNER_EMAIL。
 *   報告寄送失敗不影響試算表：資料已寫入，回傳 emailSent: false。
 *
 * Script Properties 需設定：
 *   PDFSHIFT_API_KEY — PDFShift API Key（可沿用 lifevalue 的同一把）
 *   OWNER_EMAIL      — 報告密件副本收件人（Saori）
 *
 * API
 *   GET  ?action=check&token=TOKEN&name=NAME  → { ok: true } / { ok: false, error: 'not_found' }
 *   POST body(JSON, text/plain):
 *        { token, action: 'submit', name, email, picks, classifications, ranking, reasons, insights, reflections, jobs }
 *        → { ok: true, submittedAt, emailSent } / { ok: false, error }
 *   相容舊版前端：沒有 classifications 時，所有挑選的職業視為「純粹喜歡」；沒有 email 時只寫試算表、不寄報告。
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

    const email = String(body.email || '').trim();
    if (email && !validateEmail(email)) return json({ ok: false, error: 'invalid_email' });

    const data = validateSubmission(body);
    if (!data) return json({ ok: false, error: 'invalid_data' });

    // 避免同時送出互相覆蓋
    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    const submittedAt = Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm');
    let jobInfo;
    try {
      jobInfo = writeSubmission(sheet, data, body.jobs);
      writeSummary(sheet, data, jobInfo.codes);
      logSubmitTime(sheet, submittedAt);
    } finally {
      lock.releaseLock();
    }

    console.log(`[submit] 已寫入試算表：${body.name}（email ${email ? '有' : '沒有'}填）`);

    // 試算表已寫入；報告寄送失敗只回報，不讓整次送出失敗
    let emailSent = false;
    let reportError = '';
    if (email) {
      try {
        sendReport(email, String(body.name).trim(), data, jobInfo, submittedAt);
        emailSent = true;
      } catch (mailErr) {
        reportError = mailErr.message;
        console.error('[report] 失敗：' + mailErr.message + '\n' + mailErr.stack);
      }
    } else {
      console.warn('[report] 沒有收到 email，不寄報告（前端可能還是舊版）');
    }

    // reportError 只給除錯看（瀏覽器開發者工具 → Network → 回應內容），前端不顯示
    return json({ ok: true, submittedAt, emailSent, reportError });
  } catch (err) {
    console.error('[submit] doPost error: ' + err.message + '\n' + err.stack);
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

// ─── 寫入分頁 A:F（依 A 欄 SN 對應列），回傳 { codes, names }（以 SN 為 key）供統計與報告用
function writeSubmission(sheet, data, jobs) {
  if (sheet.getLastRow() < 2) fillTemplate(sheet, jobs);
  // 既有分頁（舊版或從範本複製）的標題統一成目前的格式
  sheet.getRange(1, 2).setValue(HEADERS[1]);
  sheet.getRange(1, 5, 1, 2).setValues([[HEADERS[4], HEADERS[5]]]);

  const lastRow = sheet.getLastRow();
  const rows = sheet.getRange(2, 1, lastRow - 1, 3).getValues(); // A:C

  // 先確認每個挑選的 SN 都找得到對應列
  const codes = {};
  const names = {};
  rows.forEach(r => {
    const sn = Number(r[0]);
    if (Number.isInteger(sn)) {
      codes[sn] = String(r[2] || '');
      names[sn] = String(r[1] || '');
    }
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
  return { codes, names };
}

// ─── 六大類統計：依「純粹喜歡」職業的代碼字母計數（AER → A、E、R 各 1 次）────────
function hollandStats(data, codes) {
  const count = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  data.picks.filter(sn => data.cls[sn] === 'pure').forEach(sn => {
    String(codes[sn] || '').split('').forEach(ch => {
      if (count[ch] !== undefined) count[ch]++;
    });
  });
  const ranked = HOLLAND_ORDER.slice().sort((a, b) =>
    count[b] - count[a] || HOLLAND_ORDER.indexOf(a) - HOLLAND_ORDER.indexOf(b));
  const top = count[ranked[0]];
  const primaryCodes = top > 0 ? ranked.filter(k => count[k] === top) : [];
  return { count, ranked, top, primaryCodes };
}

// ─── H:I 區塊：六大類統計＋主要類型＋反思 ────────────────────────────────────
function writeSummary(sheet, data, codes) {
  const { count, ranked, primaryCodes } = hollandStats(data, codes);
  const primary = primaryCodes.map(k => k + ' ' + HOLLAND_LABELS[k]).join('、') || '—';

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

// ─── PDF 報告：組 HTML → PDFShift → 寄信（流程同 GAS/lifevalue.js）──────────
function sendReport(email, userName, data, jobInfo, submittedAt) {
  const props = PropertiesService.getScriptProperties();
  const ownerEmail = props.getProperty('OWNER_EMAIL') || '';
  console.log(`[report] 開始：寄給 ${email}，副本 ${ownerEmail || '（OWNER_EMAIL 未設定）'}，PDFSHIFT_API_KEY ${props.getProperty('PDFSHIFT_API_KEY') ? '已設定' : '未設定'}`);
  const html = buildReportHtml(userName, data, jobInfo, submittedAt);
  const pdfBlob = convertToPdf(html, props.getProperty('PDFSHIFT_API_KEY'))
    .setName(`${userName}_職業興趣探索報告.pdf`);
  console.log(`[report] PDF 完成：${pdfBlob.getBytes().length} bytes`);
  sendReportEmail(email, ownerEmail, userName, pdfBlob);
  console.log(`[report] 已寄出，今日剩餘寄信額度：${MailApp.getRemainingDailyQuota()}`);
}

/** 試算表 B 欄是「中文 (English)」，拆成兩段給報告排版 */
function splitJobName(full) {
  const s = String(full || '');
  const i = s.lastIndexOf(' (');
  return i > 0 && s.slice(-1) === ')' ? { zh: s.slice(0, i), en: s.slice(i + 2, -1) } : { zh: s, en: '' };
}

// 報告版面沿用職業興趣探索頁：米白紙底、墨色字、Noto Serif TC 標題、--heat 只用在主要類型與名次
function buildReportHtml(userName, data, jobInfo, submittedAt) {
  const C = { paper: '#faf7f2', ink: '#1c1a17', mid: '#5c5650', soft: '#8a8279', line: '#e4dccd', warm: '#f1ebe1', heat: '#b4442c', sand: '#d4a96a' };
  const job = sn => splitJobName(jobInfo.names[sn]);
  const tag = sn => {
    const c = data.cls[sn];
    return c && c !== 'pure' ? `<span class="tag">${CLS_LABELS[c]}</span>` : '';
  };
  const stats = hollandStats(data, jobInfo.codes);
  const pureCount = data.picks.filter(sn => data.cls[sn] === 'pure').length;
  const primaryLabel = stats.primaryCodes.map(k => HOLLAND_LABELS[k]).join('、') || '—';

  const bars = stats.ranked.map(k => {
    const isTop = stats.primaryCodes.indexOf(k) >= 0;
    const pct = stats.top > 0 ? Math.round(stats.count[k] / stats.top * 100) : 0;
    return `<tr class="${isTop ? 'is-top' : ''}">
      <td class="bar-code">${k}</td>
      <td class="bar-label">${HOLLAND_LABELS[k]}</td>
      <td class="bar-track"><div class="bar-bg"><div class="bar-fill" style="width:${pct}%"></div></div></td>
      <td class="bar-count">${stats.count[k]}</td>
    </tr>`;
  }).join('');

  const rankRows = data.ranking.map((sn, i) => {
    const j = job(sn);
    return `<tr>
      <td class="rank">${i + 1}</td>
      <td class="job"><div class="zh">${escHtml(j.zh)}${tag(sn)}</div><div class="en">${escHtml(j.en)}</div></td>
      <td class="reason">${escHtml(data.reasons[sn])}</td>
    </tr>`;
  }).join('');

  // 沒排進前 10 名的挑選：純粹喜歡只列名稱，他人期望／僅是有能力做附上洞察
  const unranked = data.picks.filter(sn => data.ranking.indexOf(sn) < 0);
  const groups = ['pure', 'others', 'capable'].map(c => {
    const sns = unranked.filter(sn => data.cls[sn] === c);
    if (!sns.length) return '';
    const items = sns.map(sn => {
      const j = job(sn);
      const note = c === 'pure' ? '' : (data.insights[sn]
        ? `<div class="note">${escHtml(data.insights[sn])}</div>`
        : '<div class="note is-empty">沒有寫下洞察</div>');
      return `<li><span class="zh">${escHtml(j.zh)}</span> <span class="en">${escHtml(j.en)}</span>${note}</li>`;
    }).join('');
    return `<div class="group"><h3>${CLS_LABELS[c]}</h3><ul>${items}</ul></div>`;
  }).join('');

  const answered = data.reflections.filter(r => r.a);
  const reflections = answered.length ? `
    <section>
      <h2>反思</h2>
      ${answered.map(r => `<div class="qa"><p class="q">${escHtml(r.q)}</p><p class="a">${escHtml(r.a)}</p></div>`).join('')}
    </section>` : '';

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<title>${escHtml(userName)} 的職業興趣探索報告</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;600;700&family=Noto+Sans+TC:wght@400;500&family=EB+Garamond:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif; background: ${C.paper}; color: ${C.ink}; font-size: 13px; line-height: 1.75; }
  .page { padding: 36px 40px 28px; }
  header { display: flex; justify-content: space-between; align-items: flex-end; padding-bottom: 14px; border-bottom: 1px solid ${C.ink}; }
  header .kind { font-size: 12px; color: ${C.mid}; letter-spacing: .08em; }
  header h1 { font-family: 'Noto Serif TC', serif; font-size: 26px; font-weight: 700; letter-spacing: .06em; line-height: 1.3; }
  header .date { font-size: 11px; color: ${C.soft}; }

  .type { display: flex; gap: 32px; align-items: flex-start; padding: 26px 0 24px; border-bottom: 1px solid ${C.line}; page-break-inside: avoid; }
  .type-mark { flex: 0 0 auto; font-family: 'EB Garamond', serif; font-size: 96px; line-height: .9; color: ${C.heat}; letter-spacing: -.02em; }
  .type-body { flex: 1; }
  .type-body h2 { font-family: 'Noto Serif TC', serif; font-size: 18px; font-weight: 600; margin-bottom: 4px; }
  .type-body .lead { font-size: 12px; color: ${C.mid}; margin-bottom: 12px; }
  .bars { width: 100%; border-collapse: collapse; }
  .bars td { padding: 3px 0; font-size: 12px; color: ${C.mid}; vertical-align: middle; }
  .bar-code { width: 22px; font-family: 'EB Garamond', serif; font-size: 15px; color: ${C.soft}; }
  .bar-label { width: 64px; }
  .bars td.bar-track { padding-right: 12px; }
  .bar-bg { height: 7px; background: ${C.warm}; }
  .bar-fill { height: 7px; background: ${C.sand}; }
  .bar-count { width: 24px; text-align: right; font-variant-numeric: tabular-nums; }
  .bars tr.is-top td { color: ${C.ink}; font-weight: 500; }
  .bars tr.is-top .bar-code { color: ${C.heat}; }
  .bars tr.is-top .bar-fill { background: ${C.heat}; }

  section { padding-top: 24px; }
  section > h2 { font-family: 'Noto Serif TC', serif; font-size: 17px; font-weight: 600; letter-spacing: .04em; padding-bottom: 8px; border-bottom: 1px solid ${C.line}; }
  section > .lead { font-size: 12px; color: ${C.mid}; margin: 8px 0 2px; }

  .ranks { width: 100%; border-collapse: collapse; }
  .ranks tr { page-break-inside: avoid; }
  .ranks td { padding: 10px 0; border-bottom: 1px solid ${C.line}; vertical-align: top; }
  .rank { width: 40px; font-family: 'EB Garamond', serif; font-size: 24px; line-height: 1.1; color: ${C.heat}; }
  .ranks td.job { width: 190px; padding-right: 16px; }
  .zh { font-weight: 500; }
  .en { font-family: 'EB Garamond', serif; font-size: 12px; color: ${C.soft}; }
  .reason { color: ${C.mid}; white-space: pre-wrap; }
  .tag { display: inline-block; margin-left: 6px; padding: 0 7px; font-size: 10px; font-weight: 400; line-height: 1.7; color: ${C.mid}; border: 1px solid ${C.line}; border-radius: 9px; vertical-align: 1px; }

  .group { margin-top: 14px; page-break-inside: avoid; }
  .group h3 { font-size: 13px; font-weight: 500; margin-bottom: 4px; }
  .group ul { list-style: none; }
  .group li { padding: 5px 0 5px 12px; border-left: 2px solid ${C.line}; margin-bottom: 4px; }
  .note { color: ${C.mid}; white-space: pre-wrap; }
  .note.is-empty { color: ${C.soft}; font-size: 11px; }

  .qa { padding: 12px 0; border-bottom: 1px solid ${C.line}; page-break-inside: avoid; }
  .q { font-weight: 500; margin-bottom: 4px; }
  .a { color: ${C.mid}; white-space: pre-wrap; }

  footer { margin-top: 32px; padding-top: 12px; border-top: 1px solid ${C.line}; font-size: 11px; color: ${C.soft}; display: flex; justify-content: space-between; }
  footer a { color: ${C.mid}; }
</style>
</head>
<body>
<div class="page">
  <header>
    <div>
      <div class="kind">職業興趣探索報告</div>
      <h1>${escHtml(userName)}</h1>
    </div>
    <div class="date">送出時間 ${escHtml(submittedAt)}</div>
  </header>

  <div class="type">
    <div class="type-mark">${stats.primaryCodes.join('') || '—'}</div>
    <div class="type-body">
      <h2>你的主要類型：${primaryLabel}</h2>
      <p class="lead">依你「純粹喜歡」的 ${pureCount} 個職業計算。每個職業的興趣代碼有 2–3 個字母，每個字母各算一次。</p>
      <table class="bars">${bars}</table>
    </div>
  </div>

  <section>
    <h2>前 10 名</h2>
    <table class="ranks">${rankRows}</table>
  </section>

  ${groups ? `<section><h2>其他挑選的職業</h2><p class="lead">這些職業被你挑進來，但沒有排進前 10 名。</p>${groups}</section>` : ''}

  ${reflections}

  <footer>
    <span>Saori 謝孟娟 職業興趣探索</span>
    <span>想一起聊聊這份結果？<a href="https://lin.ee/YVBqq6u">聯繫 Saori</a></span>
  </footer>
</div>
</body>
</html>`;
}

// ─── 呼叫 PDFShift API（同 GAS/lifevalue.js）────────────────────────────────
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
    console.error("[report] PDFShift error (" + status + "): " + response.getContentText());
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
      <p style="margin-bottom:16px;">謝謝你完成職業興趣探索。你的報告附在這封信裡（PDF），裡面有你的主要興趣類型、前 10 名職業和你寫下的原因。</p>
      <p style="margin-bottom:24px;">諮詢時我們會一起看這份報告，找出這些職業背後共同的興趣線索。</p>
      <a href="https://lin.ee/YVBqq6u" style="display:inline-block;background:#1c1a17;color:#faf7f2;padding:10px 22px;border-radius:4px;text-decoration:none;">聯繫 Saori</a>
      <p style="margin-top:28px;padding-top:16px;border-top:1px solid #e4dccd;font-size:12px;color:#8a8279;">這封信由職業興趣探索工具自動寄出，有問題可以直接回覆。</p>
    </div>`;

  const options = {
    to: email,
    subject: `【職業興趣探索】${userName} 的報告`,
    htmlBody: htmlBody,
    attachments: [pdfBlob],
    name: 'Saori 職業興趣探索'
  };
  if (ownerEmail) options.bcc = ownerEmail;
  MailApp.sendEmail(options);
}

// ─── 工具 ────────────────────────────────────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── 測試用（在 GAS 編輯器直接執行；不寫試算表，報告只寄到 OWNER_EMAIL）─────
function testReportEmail() {
  const owner = PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL');
  if (!owner) throw new Error('請先設定 Script Properties: OWNER_EMAIL');
  const picks = [1, 2, 3, 4, 5, 6, 7, 50, 60, 70, 80, 90];
  const cls = {};
  picks.forEach((sn, i) => { cls[sn] = i < 7 ? 'pure' : i < 10 ? 'others' : 'capable'; });
  const ranking = [3, 1, 2, 7, 6, 5, 4, 50, 80, 60];
  const reasons = {};
  ranking.forEach(sn => { reasons[sn] = '想到可以把腦中的畫面做出來，就忍不住興奮。'; });
  const data = {
    picks, cls, ranking, reasons,
    insights: { 70: '爸媽一直覺得工程師最穩定。' },
    reflections: [{ q: '在你「純粹喜歡」的工作中，你注意到哪些共同的主題或模式？', a: '都跟創作和表達有關。' }]
  };
  const codes = { 1: 'AE', 2: 'AE', 3: 'AE', 4: 'AE', 5: 'AE', 6: 'AEC', 7: 'AEI', 50: 'ESC', 60: 'IR', 70: 'IRC', 80: 'RCI', 90: 'SE' };
  const names = { 1: '遊戲設計師 (Game Designer)', 2: '室內設計師 (Interior Designer)', 3: '音樂家 (Musician)', 4: '演員 (Actor)',
    5: '藝術總監 (Art Director)', 6: '編輯 (Editor)', 7: '記者/特派員 (Reporter/Correspondent)', 50: '空服員 (Flight Attendant)',
    60: '電機工程師 (Electrical Engineer)', 70: '電腦硬體工程師 (Computer Hardware Engineer)', 80: '機長 (Pilot)', 90: '社工師 (Social Worker)' };
  sendReport(owner, '測試用戶', data, { codes, names }, Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy-MM-dd HH:mm'));
  Logger.log('測試報告已寄到 ' + owner);
}

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
 * 6. 專案設定 → 指令碼屬性：新增 PDFSHIFT_API_KEY、OWNER_EMAIL
 *    加入 PDF 報告後會用到 UrlFetchApp（外部連線）與 MailApp（寄信），部署時會要求重新授權
 *    可先在編輯器執行 testReportEmail() 確認 PDF 與寄信正常（只寄到 OWNER_EMAIL）
 *
 * 之後修改程式碼：部署 → 管理部署作業 → 編輯（鉛筆）→ 版本選「新版本」→ 部署
 * （網址不變；若改用「新增部署作業」會產生新網址，前端也要跟著換）
 *
 * ─── 測試 ────────────────────────────────────────────────────────────────────
 * 在瀏覽器開啟：WEB_APP_URL?action=check&token=saori-ci-2026-hT4qW&name=分頁名稱
 * 分頁存在 → {"ok":true}；不存在 → {"ok":false,"error":"not_found"}
 */
