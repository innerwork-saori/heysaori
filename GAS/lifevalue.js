/**
 * 價值觀探索報告 - Google Apps Script
 * 功能：接收前端資料 → 組 HTML 報表 → 呼叫 PDFShift API → 寄送 Email
 *
 * Script Properties 需設定：
 *   PDFSHIFT_API_KEY  — PDFShift API Key
 *   GAS_TOKEN         — 前端驗證用 Token
 *   OWNER_EMAIL       — 報表 BCC 收件人（管理員）
 */

// ─── 入口：處理 POST 請求 ────────────────────────────────────────────────────
function doPost(e) {
  try {
    // no-cors 模式下 Content-Type 為 text/plain，postData.contents 仍是 JSON 字串
    const payload = JSON.parse(e.postData.contents);

    // 1. Token 驗證
    const props = PropertiesService.getScriptProperties();
    const validToken = props.getProperty('GAS_TOKEN');
    if (!payload.token || payload.token !== validToken) {
      return jsonResponse({ success: false, message: 'Unauthorized' }, 401);
    }

    // 2. 基本欄位驗證
    const { email, userName, mode, top10, created_at } = payload;
    if (!email || !validateEmail(email)) {
      return jsonResponse({ success: false, message: 'Invalid email' }, 400);
    }
    if (!top10 || !Array.isArray(top10) || top10.length === 0) {
      return jsonResponse({ success: false, message: 'Missing top10 data' }, 400);
    }

    // 3. 組 HTML 報表
    const htmlContent = buildReportHtml({ userName, mode, top10, created_at });

    // 4. 呼叫 PDFShift 產生 PDF
    const pdfBlob = convertToPdf(htmlContent, props.getProperty('PDFSHIFT_API_KEY'));

    // 5. 寄送 Email
    const ownerEmail = props.getProperty('OWNER_EMAIL') || '';
    sendReportEmail({ email, ownerEmail, userName, pdfBlob });

    return jsonResponse({ success: true, message: 'Email sent' });

  } catch (err) {
    Logger.log('Error: ' + err.message);
    return jsonResponse({ success: false, message: err.message }, 500);
  }
}

// ─── 處理 OPTIONS preflight（CORS）────────────────────────────────────────────
function doGet(e) {
  return jsonResponse({ success: false, message: 'Use POST' });
}

// ─── 工具：JSON 回應（含 CORS header）────────────────────────────────────────
function jsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ─── 工具：Email 格式驗證 ────────────────────────────────────────────────────
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── 工具：模式標籤 ──────────────────────────────────────────────────────────
function getModeLabel(mode) {
  return mode === 'work' ? '工作價值觀探索' : '人生價值觀探索';
}

// ─── 工具：滿意度顏色 ────────────────────────────────────────────────────────
function getSatColor(sat) {
  if (sat <= 3) return '#c8502a';
  if (sat <= 6) return '#d4a84b';
  return '#4a7c6f';
}

// ─── 工具：滿意度文字 ────────────────────────────────────────────────────────
function getSatLabel(sat) {
  if (sat <= 2) return '幾乎沒有';
  if (sat <= 4) return '偏低';
  if (sat <= 6) return '普通';
  if (sat <= 8) return '不錯';
  return '完全滿足';
}

// ─── 組 HTML 報表 ────────────────────────────────────────────────────────────
function buildReportHtml(data) {
  const { userName, mode, top10, created_at } = data;
  const modeLabel = getModeLabel(mode);
  const dateStr = created_at
    ? Utilities.formatDate(new Date(created_at), 'Asia/Taipei', 'yyyy/MM/dd HH:mm')
    : Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy/MM/dd HH:mm');

  const avgSat = top10.length > 0
    ? (top10.reduce((s, c) => s + (c.satisfaction || 0), 0) / top10.length).toFixed(1)
    : '—';

  // 類別分佈
  const catCount = {};
  top10.forEach(item => {
    if (item.category) {
      catCount[item.category] = (catCount[item.category] || 0) + 1;
    }
  });
  // 只取並列最高的類別
  const catEntries = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
  const topCount = catEntries.length > 0 ? catEntries[0][1] : 0;
  const catSummary = catEntries
    .filter(([, n]) => n === topCount)
    .map(([cat, n]) => `${cat} × ${n}`)
    .join('、');

  // 落差提醒（滿意度 ≤ 4）
  const gaps = top10.filter(item => (item.satisfaction || 0) <= 4);

  // Top 10 列表 HTML
  const top10Rows = top10.map((item, idx) => {
    const sat = item.satisfaction || 0;
    const satColor = getSatColor(sat);
    const satLabel = getSatLabel(sat);
    const barWidth = sat * 10;
    const rankColor = idx < 3 ? '#c8502a' : '#1a1410';
    return `
      <tr>
        <td style="text-align:center;font-size:1.1rem;font-weight:700;color:${rankColor};padding:10px 8px;border-bottom:1px solid #f0ebe0;">${idx + 1}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #f0ebe0;">
          <div style="font-weight:700;font-size:.95rem;color:#1a1410;">${escHtml(item.name)}</div>
          ${item.category ? `<div style="font-size:.72rem;color:#8a7f72;margin-top:2px;">${escHtml(item.category)}</div>` : ''}
        </td>
        <td style="padding:10px 8px;border-bottom:1px solid #f0ebe0;font-size:.82rem;color:#3a3530;line-height:1.6;">${escHtml(item.reason || '')}</td>
        <td style="padding:10px 8px;border-bottom:1px solid #f0ebe0;text-align:center;white-space:nowrap;">
          <div style="font-size:1.3rem;font-weight:700;color:${satColor};">${sat}</div>
          <div style="font-size:.65rem;color:#8a7f72;">/ 10</div>
          <div style="background:#f0ebe0;border-radius:3px;height:6px;width:80px;margin:4px auto 0;overflow:hidden;">
            <div style="background:${satColor};height:100%;width:${barWidth}%;border-radius:3px;"></div>
          </div>
          <div style="font-size:.65rem;color:${satColor};margin-top:3px;">${satLabel}</div>
        </td>
      </tr>`;
  }).join('');

  // 落差提醒 HTML
  const gapHtml = gaps.length > 0 ? `
    <div style="background:#fff8e6;border:1px solid #f0c040;border-radius:8px;padding:14px 18px;margin-top:20px;">
      <div style="font-size:.8rem;font-weight:700;color:#7a5c00;margin-bottom:8px;">⚠️ 落差提醒：以下價值觀滿意度偏低（≤ 4 分）</div>
      ${gaps.map(g => `
        <div style="font-size:.82rem;color:#7a5c00;margin-bottom:5px;display:flex;gap:6px;">
          <span>⚠</span>
          <span><strong>${escHtml(g.name)}</strong>（${g.satisfaction} 分）— 這個對你重要的價值觀目前可能未被充分滿足。</span>
        </div>`).join('')}
    </div>` : '';

  // 洞察與提醒
  const highest = top10.reduce((a, b) => (a.satisfaction || 0) >= (b.satisfaction || 0) ? a : b);
  const lowest  = top10.reduce((a, b) => (a.satisfaction || 0) <= (b.satisfaction || 0) ? a : b);
  const avgSatNum = Number(avgSat);
  const avgSatSub = avgSatNum >= 7
    ? '整體而言你的核心價值觀被滿足得不錯！'
    : avgSatNum >= 5
      ? '有些價值觀還有提升空間。'
      : '你的核心價值觀目前有較大的落差，值得深入探索。';
  const topCatSub = catEntries.filter(([, n]) => n === topCount).length > 1
    ? '你的核心價值觀同時集中在這幾個領域。'
    : '你的核心價值觀主要集中在這個領域。';

  const insightCards = [
    { label: '滿意度最高', value: `${escHtml(highest.name)}（${highest.satisfaction} 分）`, sub: '這是你目前生活中最被滿足的核心價值。' },
    { label: '滿意度最低', value: `${escHtml(lowest.name)}（${lowest.satisfaction} 分）`,  sub: '這個價值觀可能是你目前最需要關注的落差。' },
    { label: '平均滿意度', value: `${avgSat} / 10`, sub: avgSatSub },
    { label: '最集中的類別', value: catSummary || '—', sub: topCatSub }
  ].map(ins => `
    <div style="background:white;border:1px solid #d8cfc0;border-radius:8px;padding:12px 16px;margin-bottom:10px;">
      <div style="font-size:.65rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8a7f72;margin-bottom:4px;">${ins.label}</div>
      <div style="font-size:.92rem;font-weight:700;color:#1a1410;">${ins.value}</div>
      <div style="font-size:.78rem;color:#8a7f72;margin-top:3px;">${ins.sub}</div>
    </div>`).join('');

  // 類別分佈 badges
  const catBadges = catEntries.map(([cat, n]) => {
    const catColors = { '自我與生活': '#4a7c6f', '美德': '#5a6ea0', '人際關係': '#c8502a', '工作': '#d4a84b' };
    const color = catColors[cat] || '#8a7f72';
    return `<span style="display:inline-block;font-size:.75rem;font-weight:600;padding:4px 12px;border-radius:20px;background:${color}22;color:${color};border:1px solid ${color}44;margin:3px;">${escHtml(cat)} × ${n}</span>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>價值觀探索報告 — ${escHtml(userName || '探索者')}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Noto Sans TC', 'Microsoft JhengHei', sans-serif;
    background: #faf7f2;
    color: #1a1410;
    font-size: 14px;
    line-height: 1.6;
  }
  .page { max-width: 800px; margin: 0 auto; padding: 40px 32px; }
  .header {
    background: #1a1410;
    color: #faf7f2;
    padding: 32px 36px;
    border-radius: 12px;
    margin-bottom: 28px;
    position: relative;
    overflow: hidden;
  }
  .header-eyebrow {
    font-size: .7rem;
    letter-spacing: .3em;
    color: #d4a84b;
    text-transform: uppercase;
    margin-bottom: 6px;
    font-weight: 700;
  }
  .header h1 {
    font-family: 'Noto Serif TC', serif;
    font-size: 1.8rem;
    font-weight: 700;
    letter-spacing: .08em;
    margin-bottom: 6px;
  }
  .header-meta { font-size: .8rem; color: rgba(250,247,242,.6); }
  .header-meta span { margin-right: 16px; }
  .section { margin-bottom: 28px; }
  .section-title {
    font-family: 'Noto Serif TC', serif;
    font-size: 1rem;
    font-weight: 600;
    color: #1a1410;
    padding-bottom: 8px;
    border-bottom: 2px solid #d8cfc0;
    margin-bottom: 16px;
  }
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .summary-card {
    background: white;
    border: 1px solid #d8cfc0;
    border-radius: 8px;
    padding: 14px 16px;
  }
  .summary-label { font-size: .65rem; font-weight: 700; letter-spacing: .1em; color: #8a7f72; text-transform: uppercase; margin-bottom: 4px; }
  .summary-value { font-size: 1.1rem; font-weight: 700; color: #1a1410; }
  .summary-sub { font-size: .7rem; color: #8a7f72; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; border: 1px solid #d8cfc0; }
  thead tr { background: #f0ebe0; }
  th { padding: 10px 8px; text-align: left; font-size: .7rem; font-weight: 700; letter-spacing: .08em; color: #8a7f72; border-bottom: 1px solid #d8cfc0; }
  .footer {
    margin-top: 36px;
    padding-top: 20px;
    border-top: 1px solid #d8cfc0;
    font-size: .75rem;
    color: #8a7f72;
    text-align: center;
    line-height: 1.8;
  }
  .footer a { color: #c8502a; text-decoration: none; }
</style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <div class="header-eyebrow">Personal Development Tool</div>
    <h1>${escHtml(userName || '探索者')} 的價值觀探索報告</h1>
    <div class="header-meta">
      <span>📋 ${modeLabel}</span>
      <span>🕐 ${dateStr}</span>
    </div>
  </div>

  <!-- Summary -->
  <div class="section">
    <div class="section-title">📊 摘要</div>
    <div class="summary-grid">
      <div class="summary-card">
        <div class="summary-label">探索模式</div>
        <div class="summary-value" style="font-size:.9rem;">${modeLabel}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">平均滿意度</div>
        <div class="summary-value" style="color:${Number(avgSat) >= 7 ? '#4a7c6f' : Number(avgSat) >= 5 ? '#d4a84b' : '#c8502a'};">${avgSat} <span style="font-size:.7rem;font-weight:400;color:#8a7f72;">/ 10</span></div>
        <div class="summary-sub">${Number(avgSat) >= 7 ? '整體滿足度良好' : Number(avgSat) >= 5 ? '有提升空間' : '落差較大，值得關注'}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">主要類別</div>
        <div class="summary-value" style="font-size:.85rem;">${catSummary || '—'}</div>
      </div>
    </div>
  </div>

  <!-- Top 10 Table -->
  <div class="section">
    <div class="section-title">🏆 Top 10 價值觀</div>
    <table>
      <thead>
        <tr>
          <th style="width:40px;text-align:center;">排名</th>
          <th style="width:160px;">價值觀</th>
          <th>原因說明</th>
          <th style="width:100px;text-align:center;">滿意度</th>
        </tr>
      </thead>
      <tbody>
        ${top10Rows}
      </tbody>
    </table>
    ${gapHtml}
  </div>

  <!-- Category Distribution -->
  <div class="section">
    <div class="section-title">🗂 類別分佈</div>
    <div style="margin-bottom:8px;">${catBadges}</div>
  </div>

  <!-- Insights -->
  <div class="section">
    <div class="section-title">💡 洞察與提醒</div>
    ${insightCards}
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>此報告由 <a href="https://heysaori.com">heysaori.com</a> 價值觀探索工具產生</p>
    <p>想進一步探索你的價值觀？歡迎聯繫 <a href="https://lin.ee/YVBqq6u">Saori</a></p>
  </div>

</div>
</body>
</html>`;
}

// ─── 呼叫 PDFShift API ───────────────────────────────────────────────────────
function convertToPdf(htmlContent, apiKey) {
  if (!apiKey) {
    throw new Error('PDFShift API Key 未設定（Script Properties: PDFSHIFT_API_KEY）');
  }

  const endpoint = 'https://api.pdfshift.io/v3/convert/pdf';
  const credentials = Utilities.base64Encode('api:' + apiKey);

  const requestBody = {
    source: htmlContent,
    landscape: false,
    use_print: false,
    format: 'A4',
    margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
  };

  const options = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(endpoint, options);
  const statusCode = response.getResponseCode();

  if (statusCode !== 200 && statusCode !== 201) {
    const errBody = response.getContentText();
    Logger.log('PDFShift error (' + statusCode + '): ' + errBody);
    throw new Error('PDF 產生失敗（HTTP ' + statusCode + '）');
  }

  return response.getBlob().setName('價值觀探索報告.pdf');
}

// ─── 寄送 Email ──────────────────────────────────────────────────────────────
function sendReportEmail({ email, ownerEmail, userName, pdfBlob }) {
  const displayName = userName || '探索者';
  const subject = `【價值觀探索】${displayName} 的報告已產生`;

  const htmlBody = `
    <div style="font-family:'Microsoft JhengHei',sans-serif;max-width:560px;margin:0 auto;color:#1a1410;">
      <div style="background:#1a1410;padding:28px 32px;border-radius:10px 10px 0 0;">
        <div style="font-size:.7rem;letter-spacing:.3em;color:#d4a84b;text-transform:uppercase;margin-bottom:6px;">Personal Development Tool</div>
        <h1 style="font-size:1.4rem;color:#faf7f2;margin:0;font-weight:700;">你的價值觀探索報告</h1>
      </div>
      <div style="background:white;padding:28px 32px;border:1px solid #d8cfc0;border-top:none;border-radius:0 0 10px 10px;">
        <p style="margin-bottom:16px;">嗨 ${escHtml(displayName)}，</p>
        <p style="margin-bottom:16px;line-height:1.8;">感謝你完成了價值觀探索！你的報告已附在這封信中，請查收 PDF 附件。</p>
        <p style="margin-bottom:24px;line-height:1.8;">如果你想進一步了解自己的價值觀，或是有任何問題，歡迎聯繫 Saori 做更深入的探索。</p>
        <a href="https://lin.ee/YVBqq6u"
           style="display:inline-block;background:#c8502a;color:white;padding:10px 24px;border-radius:6px;text-decoration:none;font-weight:700;font-size:.9rem;">
          聯繫 Saori →
        </a>
        <hr style="border:none;border-top:1px solid #f0ebe0;margin:28px 0;">
        <p style="font-size:.75rem;color:#8a7f72;line-height:1.8;">
          此信件由 <a href="https://heysaori.com" style="color:#c8502a;">heysaori.com</a> 自動產生。<br>
          如有任何問題，請直接回覆此信件。
        </p>
      </div>
    </div>`;

  const mailOptions = {
    to: email,
    subject: subject,
    htmlBody: htmlBody,
    attachments: [pdfBlob],
    name: 'Saori 價值觀探索'
  };

  if (ownerEmail) {
    mailOptions.bcc = ownerEmail;
  }

  MailApp.sendEmail(mailOptions);
  Logger.log('Email sent to: ' + email);
}

// ─── 工具：HTML 跳脫 ─────────────────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

// ─── 測試用（可在 GAS 編輯器直接執行）──────────────────────────────────────
function testSendReport() {
  const mockPayload = {
    token: PropertiesService.getScriptProperties().getProperty('GAS_TOKEN'),
    email: PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL'),
    userName: '測試用戶',
    mode: 'full',
    top10: [
      { name: '能持續自我成長', category: '工作', rank: 1, reason: '成長讓我感到有意義，停滯會讓我焦慮。', satisfaction: 7 },
      { name: '健康的身體與心靈', category: '自我與生活', rank: 2, reason: '沒有健康一切都是空談。', satisfaction: 8 },
      { name: '愛與被愛', category: '人際關係', rank: 3, reason: '愛是生命的核心動力。', satisfaction: 6 },
      { name: '工作生活平衡', category: '工作', rank: 4, reason: '過度工作讓我失去自己。', satisfaction: 4 },
      { name: '忠於自我', category: '自我與生活', rank: 5, reason: '活出真實的自己最重要。', satisfaction: 7 },
      { name: '有成就感', category: '工作', rank: 6, reason: '完成有意義的事讓我充實。', satisfaction: 6 },
      { name: '深刻友誼', category: '人際關係', rank: 7, reason: '真正的朋友是人生的財富。', satisfaction: 8 },
      { name: '自由自在不受拘束', category: '自我與生活', rank: 8, reason: '自由是我最基本的需求。', satisfaction: 5 },
      { name: '公平正義', category: '美德', rank: 9, reason: '不公平的事讓我無法接受。', satisfaction: 3 },
      { name: '創新與創造', category: '工作', rank: 10, reason: '創造新事物讓我興奮。', satisfaction: 6 }
    ],
    created_at: new Date().toISOString()
  };

  // 模擬 doPost
  const props = PropertiesService.getScriptProperties();
  const validToken = props.getProperty('GAS_TOKEN');
  if (mockPayload.token !== validToken) {
    Logger.log('Token 驗證失敗');
    return;
  }

  const htmlContent = buildReportHtml(mockPayload);
  const apiKey = props.getProperty('PDFSHIFT_API_KEY');
  const pdfBlob = convertToPdf(htmlContent, apiKey);
  const ownerEmail = props.getProperty('OWNER_EMAIL') || '';
  sendReportEmail({
    email: mockPayload.email,
    ownerEmail: ownerEmail,
    userName: mockPayload.userName,
    pdfBlob: pdfBlob
  });
  Logger.log('測試完成');
}
