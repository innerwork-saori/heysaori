// Code.gs

function doPost(e) {
  const BCC_EMAIL = Session.getActiveUser().getEmail();

  // 允許跨來源請求
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    const payload = JSON.parse(e.postData.contents);
    const { recipientEmail, reportName, htmlContent, mode } = payload;

    if (!recipientEmail || !htmlContent) {
      output.setContent(JSON.stringify({ success: false, error: "缺少必要欄位" }));
      return output;
    }

    // 從指令碼屬性取得 PDFShift API Key
    const scriptProps = PropertiesService.getScriptProperties();
    const pdfshiftApiKey = scriptProps.getProperty("PDFSHIFT_API_KEY");

    if (!pdfshiftApiKey) {
      output.setContent(JSON.stringify({ success: false, error: "找不到 API Key" }));
      return output;
    }

    // 呼叫 PDFShift 產生 PDF
    const pdfBytes = generatePDF(htmlContent, pdfshiftApiKey);

    if (!pdfBytes) {
      output.setContent(JSON.stringify({ success: false, error: "PDF 產生失敗" }));
      return output;
    }

    // 寄送 email
    const subject = mode === "job"
      ? `【職能盤點】${reportName} 的職缺能力落差分析報告`
      : `【職能盤點】${reportName} 的職能盤點報告`;

    const body = `親愛的 ${reportName}，\n\n感謝你完成職能盤點！\n\n你的個人報告已附在此封信件中，請查收。\n\n祝你在職涯探索的路上，越走越清晰\n\nSaori\nhttps://heysaori.com/`;

    const htmlBody = `
      <div style="font-family:'Noto Sans TC',sans-serif;max-width:600px;margin:0 auto;color:#1a1410;">
        <div style="background:#1a1410;padding:2rem;text-align:center;">
          <h1 style="color:#faf7f2;font-size:1.4rem;margin:0;letter-spacing:.1em;">職能盤點</h1>
          <p style="color:#d4a84b;font-size:.8rem;margin:.5rem 0 0;letter-spacing:.2em;">Personal Development Tool</p>
        </div>
        <div style="padding:2rem;background:#faf7f2;">
          <p>親愛的 <strong>${reportName}</strong>，</p>
          <p style="line-height:1.8;">感謝你完成職能盤點！<br>你的個人報告已附在此封信件中，請查收。</p>
          <p style="line-height:1.8;">祝你在職涯探索的路上，越走越清晰</p>
          <hr style="border:none;border-top:1px solid #d8cfc0;margin:1.5rem 0;">
          <p style="font-size:.85rem;color:#8a7f72;">
            Saori · 軟體工程師・系統分析師・生涯諮詢師<br>
            <a href="https://heysaori.com/" style="color:#c8502a;">heysaori.com</a>
          </p>
        </div>
      </div>`;

    const blob = Utilities.newBlob(pdfBytes, "application/pdf", `${reportName}_職能盤點報告.pdf`);

    GmailApp.sendEmail(recipientEmail, subject, body, {
      htmlBody: htmlBody,
      attachments: [blob],
      bcc: BCC_EMAIL,
      name: "Saori · 職能盤點"
    });

    output.setContent(JSON.stringify({ success: true }));
  } catch (err) {
    output.setContent(JSON.stringify({ success: false, error: err.toString() }));
  }

  return output;
}

function generatePDF(htmlContent, apiKey) {
  const url = "https://api.pdfshift.io/v3/convert/pdf";

  const requestBody = {
    source: htmlContent,
    landscape: false,
    use_print: false,
    format: "A4",
    margin: { top: "15mm", right: "15mm", bottom: "15mm", left: "15mm" }
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": "Basic " + Utilities.base64Encode("api:" + apiKey)
    },
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();

  if (responseCode === 200 || responseCode === 201) {
    return response.getContent(); // 回傳 byte array
  } else {
    Logger.log("PDFShift error: " + responseCode + " " + response.getContentText());
    return null;
  }
}

// 處理 CORS preflight (OPTIONS)
function doGet(e) {
  return ContentService.createTextOutput("OK");
}
// Code.gs

function doPost(e) {
  const BCC_EMAIL = 'socratescafetw@gmail.com';

  // 允許跨來源請求
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    const payload = JSON.parse(e.postData.contents);
    const { recipientEmail, reportName, htmlContent, mode } = payload;

    if (!recipientEmail || !htmlContent) {
      output.setContent(JSON.stringify({ success: false, error: "缺少必要欄位" }));
      return output;
    }

    // 從指令碼屬性取得 PDFShift API Key
    const scriptProps = PropertiesService.getScriptProperties();
    const pdfshiftApiKey = scriptProps.getProperty("PDFSHIFT_API_KEY");

    if (!pdfshiftApiKey) {
      output.setContent(JSON.stringify({ success: false, error: "找不到 API Key" }));
      return output;
    }

    // 呼叫 PDFShift 產生 PDF
    const pdfBytes = generatePDF(htmlContent, pdfshiftApiKey);

    if (!pdfBytes) {
      output.setContent(JSON.stringify({ success: false, error: "PDF 產生失敗" }));
      return output;
    }

    // 寄送 email
    const subject = mode === "job"
      ? `【職能盤點】${reportName} 的職缺能力落差分析報告`
      : `【職能盤點】${reportName} 的職能盤點報告`;

    const body = `親愛的 ${reportName}，\n\n感謝你完成職能盤點！\n\n你的個人報告已附在此封信件中，請查收。\n\n祝你在職涯探索的路上，越走越清晰 🌱\n\nSaori\nhttps://heysaori.com/`;

    const htmlBody = `
      <div style="font-family:'Noto Sans TC',sans-serif;max-width:600px;margin:0 auto;color:#1a1410;">
        <div style="background:#1a1410;padding:2rem;text-align:center;">
          <h1 style="color:#faf7f2;font-size:1.4rem;margin:0;letter-spacing:.1em;">職能盤點</h1>
          <p style="color:#d4a84b;font-size:.8rem;margin:.5rem 0 0;letter-spacing:.2em;">Personal Development Tool</p>
        </div>
        <div style="padding:2rem;background:#faf7f2;">
          <p>親愛的 <strong>${reportName}</strong>，</p>
          <p style="line-height:1.8;">感謝你完成職能盤點！<br>你的個人報告已附在此封信件中，請查收。</p>
          <p style="line-height:1.8;">祝你在職涯探索的路上，越走越清晰 🌱</p>
          <hr style="border:none;border-top:1px solid #d8cfc0;margin:1.5rem 0;">
          <p style="font-size:.85rem;color:#8a7f72;">
            Saori · 軟體工程師・系統分析師・生涯諮詢師<br>
            <a href="https://heysaori.com/" style="color:#c8502a;">heysaori.com</a>
          </p>
        </div>
      </div>`;

    const blob = Utilities.newBlob(pdfBytes, "application/pdf", `${reportName}_職能盤點報告.pdf`);

    GmailApp.sendEmail(recipientEmail, subject, body, {
      htmlBody: htmlBody,
      attachments: [blob],
      bcc: BCC_EMAIL,
      name: "Saori · 職能盤點"
    });

    output.setContent(JSON.stringify({ success: true }));
  } catch (err) {
    output.setContent(JSON.stringify({ success: false, error: err.toString() }));
  }

  return output;
}

function generatePDF(htmlContent, apiKey) {
  const url = "https://api.pdfshift.io/v3/convert/pdf";

  const requestBody = {
    source: htmlContent,
    landscape: false,
    use_print: false,
    format: "A4",
    margin: { top: "15mm", right: "15mm", bottom: "15mm", left: "15mm" }
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "Authorization": "Basic " + Utilities.base64Encode("api:" + apiKey)
    },
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseCode = response.getResponseCode();

  if (responseCode === 200 || responseCode === 201) {
    return response.getContent(); // 回傳 byte array
  } else {
    Logger.log("PDFShift error: " + responseCode + " " + response.getContentText());
    return null;
  }
}

// 處理 CORS preflight (OPTIONS)
function doGet(e) {
  return ContentService.createTextOutput("OK");
}
