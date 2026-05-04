/**
 * verify.js — Google Apps Script (GAS)
 * 部署為 Web App（Execute as: Me, Who has access: Anyone）
 *
 * Google Sheets 格式（第一列為標題列）：
 *   A: code   B: user_name   C: expired_date（格式 YYYY-MM-DD）
 *
 * 請將下方 SHEET_ID 換成你的 Google Sheets 試算表 ID
 * （從試算表網址 /d/XXXXXX/edit 中取得）
 *
 * 前端呼叫方式（JSONP）：
 *   <script src="GAS_URL?callback=fn&token=TOKEN&code=XXXX"></script>
 */

const SHEET_ID   = '1dFFNGE0FEGYmBpXE6vdPd1tD-9esbgltaVBHfGrmq-8';
const SHEET_NAME = '工作表1'; // 若 tab 名稱不同請自行修改
const TOKEN      = 'saori-lv-2026-xK9mP';       // ← 與 lifevalue.html 共用的 token

// ─── doGet：唯一入口，處理 JSONP 驗證請求 ──────────────────────────────────
// GAS Web App 只有 doGet / doPost 會被呼叫，其他函式名稱不會自動觸發。
// 因為 ContentService 無法設定 CORS header，改用 JSONP 讓前端用 <script> 讀取結果。
function doGet(e) {
  const callback = (e.parameter && e.parameter.callback) ? e.parameter.callback : 'callback';
  const token    = (e.parameter && e.parameter.token)    ? e.parameter.token    : '';
  const code     = (e.parameter && e.parameter.code)     ? e.parameter.code     : '';

  let result;

  if (token !== TOKEN) {
    result = { ok: false, error: 'unauthorized' };
  } else if (!code || code.trim() === '') {
    result = { ok: false, error: 'missing_code' };
  } else {
    result = verifyCode(code.trim());
  }

  // 回傳 JSONP：callback({ ... })
  const jsonp = callback + '(' + JSON.stringify(result) + ')';
  return ContentService
    .createTextOutput(jsonp)
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

// ─── doPost：保留備用（no-cors 模式，無法讀取回應，不用於驗證）──────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.token !== TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const result = verifyCode((body.code || '').trim());
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'server_error', detail: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── 核心驗證邏輯 ────────────────────────────────────────────────────────────
function verifyCode(code) {
  if (!code) return { ok: false, error: 'missing_code' };

  var sheet;
  try {
    sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  } catch (err) {
    return { ok: false, error: 'sheet_not_found', detail: err.message };
  }

  if (!sheet) return { ok: false, error: 'sheet_not_found' };

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return { ok: false, error: 'invalid_code' };

  // 讀取所有資料列（跳過第一列標題）
  const data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  // data[i] = [ code, user_name, expired_date ]

  const inputCode = code.toUpperCase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (var i = 0; i < data.length; i++) {
    const rowCode = String(data[i][0]).trim().toUpperCase();
    const rowName = String(data[i][1]).trim();
    const rawExp  = data[i][2];

    if (rowCode !== inputCode) continue;

    // 解析到期日
    var expiredDate;
    if (rawExp instanceof Date) {
      expiredDate = new Date(rawExp.getTime());
    } else {
      expiredDate = new Date(String(rawExp));
    }
    expiredDate.setHours(23, 59, 59, 999); // 當天結束前都有效

    if (isNaN(expiredDate.getTime())) {
      return { ok: false, error: 'invalid_code' };
    }

    if (expiredDate < today) {
      return {
        ok: false,
        error: 'code_expired',
        expiredAt: Utilities.formatDate(expiredDate, 'Asia/Taipei', 'yyyy-MM-dd')
      };
    }

    // 驗證成功
    return {
      ok: true,
      userName: rowName,
      expiredAt: Utilities.formatDate(expiredDate, 'Asia/Taipei', 'yyyy-MM-dd')
    };
  }

  return { ok: false, error: 'invalid_code' };
}

/*
 * ─── 部署步驟 ────────────────────────────────────────────────────────────────
 * 1. 開啟 Google Apps Script（script.google.com）
 * 2. 建立新專案，貼上此檔案全部內容
 * 3. 將 SHEET_ID 換成你的試算表 ID
 * 4. 點選「部署」→「新增部署作業」
 *    - 類型：Web 應用程式
 *    - 執行身分：我（Me）
 *    - 存取權：任何人（Anyone）
 * 5. 複製部署網址，填入 lifevalue.html 的 VERIFY_GAS_URL 常數
 *
 * ─── Google Sheets 格式 ──────────────────────────────────────────────────────
 * 第一列為標題（隨意命名），第二列起為資料：
 *
 *   A（code）     B（user_name）   C（expired_date）
 *   SAORI2026     王小明           2026-12-31
 *   TEST001       測試用戶         2026-06-30
 *
 * ─── 測試方式 ────────────────────────────────────────────────────────────────
 * 部署後直接在瀏覽器開啟：
 *   GAS_URL?callback=test&token=saori-lv-2026-xK9mP&code=SAORI2026
 * 應看到：test({"ok":true,"userName":"王小明","expiredAt":"2026-12-31"})
 */
