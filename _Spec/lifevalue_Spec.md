# 價值觀卡網頁工具－需求規格書（v1.1）

## 一、產品目標（Product Goal）

建立一個互動式網頁工具，協助使用者透過價值觀卡排序與反思，釐清：

- 個人核心價值觀
- 工作價值偏好
- 價值觀與現況的落差

最終產出：
- 結構化結果（Top 10 價值觀）
- 個人反思內容
- 可下載 / 寄送的 PDF 報表

---

## 二、使用模式（Modes）

### Mode A：人生價值觀探索（Full Mode）
- 使用全部 70 張卡片
- 適用：人生盤點、自我探索

### Mode B：工作價值觀探索（Work Mode）
- 僅使用「工作類別」卡片
- 適用：求職、轉職、職涯決策

---

## 三、整體流程（User Flow）

```

選擇模式
→ Step 1：重要 / 不重要分類
→ Step 2：篩選 + Top 10 排序
→ Step 3：原因說明
→ Step 4：滿意度評分
→ 結果頁
→ 產生報表（PDF）

```

### 流程控制
- 每一步必須完成才能進入下一步
- 可返回上一步修改
- 自動儲存（LocalStorage）

---

## 四、功能規格（Functional Requirements）

---

### Step 0：模式選擇

#### UI
- 選項：
  - 人生價值觀探索
  - 工作價值觀探索

#### 行為
- 選擇後初始化資料

---

### Step 1：重要 / 不重要分類

#### 資料
- 顯示卡片（70 或子集合）

#### UI / 操作
- 拖拉分類：
  - 左：不重要
  - 右：重要

#### 輔助功能
- 按鈕：
  - 全部標為重要
  - 全部標為不重要

#### 驗證
- 「重要」卡片數量 ≥ 10

---

### Step 2：篩選與排序

#### Step 2-1：篩選（最多 20 張）
- 從「重要」中選擇 ≤ 20 張

#### Step 2-2：Top 10 排序
- 拖拉排序（Drag & Drop）

#### 驗證
- 必須選滿 10 張
- 必須完成排序

---

### Step 3：原因說明

#### UI
- 每張卡一個 Textarea

#### 引導問題（顯示）
- 為什麼這個價值觀重要？
- 哪些經驗支持它？
- 如果沒有它會怎樣？

#### 驗證
- 每張至少輸入 10 字

---

### Step 4：滿意度評分

#### UI
- Slider 或數字選擇（1–10）

#### 說明
- 1 = 幾乎沒有
- 10 = 完全滿足

#### 驗證
- 每張卡必須評分

---

## 五、結果頁（Result Page）

### 顯示內容

#### 1️⃣ 基本資訊
- 模式
- 完成時間

#### 2️⃣ Top 10 價值觀
- 名稱
- 排名
- 原因
- 滿意度

#### 3️⃣ 視覺化（可選）
- 滿意度圖表
- 類別分佈

#### 4️⃣ Insight（自動生成）
- 滿意度最高 / 最低
- 價值觀集中類別
- 落差提醒

---

## 六、報表產生與寄送（Report Generation）

### 功能入口
- 按鈕：「產生報表 PDF」

---

### 使用者輸入
- Email（必填，格式驗證）

---

### 流程

```

前端 → POST → Google Apps Script
→ 組 HTML
→ 呼叫 PDFShift API
→ 產生 PDF
→ 寄送 Email（含附件）
→ 回傳結果

````

---

## 七、API 規格

### 前端 → GAS

#### Request

```json
{
  "token": "your-secret",
  "email": "user@example.com",
  "mode": "full",
  "top10": [
    {
      "name": "成長",
      "rank": 1,
      "reason": "...",
      "satisfaction": 7
    }
  ],
  "created_at": "ISO8601"
}
````

---

#### Response

```json
{
  "success": true,
  "message": "Email sent"
}
```

---

## 八、Google Apps Script（GAS）

### 功能

1. 驗證 token
2. 建立 HTML 報表
3. 呼叫 PDFShift API
4. 轉換 PDF
5. 發送 Email（含附件）
6. 回傳結果

---

### PDFShift API

#### Endpoint

```
POST https://api.pdfshift.io/v3/convert/pdf
```

#### 認證

* API Key 存於 Script Properties

---

### HTML 報表格式（簡化）

```html
<h1>價值觀探索報告</h1>

<h2>Top 10 價值觀</h2>

<div>
  <h3>1. 成長</h3>
  <p>原因：...</p>
  <p>滿意度：7 / 10</p>
</div>
```

---

### Email 發送

```javascript
MailApp.sendEmail({
  to: userEmail,
  bcc: "owner@example.com",
  subject: "你的價值觀探索報告",
  htmlBody: "...",
  attachments: [pdfBlob]
});
```

---

## 九、安全性（Security）

### 必須實作

* Token 驗證
* API Key 不可出現在前端
* GAS endpoint 保護

---

## 十、狀態管理（State Management）

### 儲存方式

* LocalStorage（唯一來源）

### 內容

* mode
* Step 進度
* 使用者輸入

### 行為

* 自動儲存
* 可恢復進度

---

## 十一、資料結構（Data Model）

### Card

```json
{
  "id": "string",
  "name": "string",
  "category": "string"
}
```

---

### User Result

```json
{
  "mode": "full | work",
  "important": ["card_id"],
  "top10": [
    {
      "card_id": "string",
      "rank": 1,
      "reason": "string",
      "satisfaction": 7
    }
  ],
  "created_at": "timestamp"
}
```

---

## 十二、非功能需求（Non-functional）

### 效能

* 支援 70 張卡流暢操作

### 裝置

* Desktop 優先
* Mobile 基本支援

### UX

* 顯示進度（Step 1/4）
* 操作回饋清楚

---

## 十三、限制與風險（Constraints & Risks）

* Gmail 寄送上限（每日限制）
* PDFShift API 使用量限制
* GAS 為公開 endpoint（需保護）
* PDF 樣式可能因 CSS 不一致而跑版

---

## 十四、未來擴充（Future Scope）

* 使用者登入 / 歷史紀錄
* 多次測驗比較
* AI Insight 分析
* 教練模式（多人管理）



## 價值卡參考

卡面上要有SN編號、價值名稱，與分類。

### 價值觀清單 （忽略英文）
SN	價值名稱	分類
40	能好好照顧家人	人際關係 Interpersonal relationships
45	資產與金錢	工作 Job, Work, Career
48	權威身份 擁有特定地位職權	工作 Job, Work, Career
16	能親近大自然	自我與生活 Self and Life
3	忠於自我	自我與生活 Self and Life
33	歸屬與認同屬於某個身份或團體	人際關係 Interpersonal relationships
64	邏輯清晰	工作 Job, Work, Career
54	清楚的流程與規範	工作 Job, Work, Career
13	舒適的環境	自我與生活 Self and Life
65	能持續自我成長	工作 Job, Work, Career
37	深刻友誼	人際關係 Interpersonal relationships
23	不要傷害別人	美德 Virtue
50	有效率 有效能	工作 Job, Work, Career
1	享受生活與美食	自我與生活 Self and Life
29	保護環境或動植物	美德 Virtue
28	公平正義	美德 Virtue
14	信仰、宗教或靈性的生活	自我與生活 Self and Life
69	有成就感	工作 Job, Work, Career
4	自由自在不受拘束	自我與生活 Self and Life
35	獲得父母認同	人際關係 Interpersonal relationships
55	隨遇而安 順勢而為	工作 Job, Work, Career
24	知恩圖報	美德 Virtue
36	有一個安穩的家	人際關係 Interpersonal relationships
39	有小孩	人際關係 Interpersonal relationships
68	有明確的目標或方向	工作 Job, Work, Career
47	擁有自己的事業	工作 Job, Work, Career
18	有獨處的空間	自我與生活 Self and Life
8	健康的身體與心靈	自我與生活 Self and Life
63	獨立自主	工作 Job, Work, Career
43	對他人社會有影響力	工作 Job, Work, Career
5	內在的平靜	自我與生活 Self and Life
61	創新與創造	工作 Job, Work, Career
6	對生命、人性或人生的洞察智慧	自我與生活 Self and Life
2	有趣的人事物	自我與生活 Self and Life
38	人際和諧	人際關係 Interpersonal relationships
56	工作穩定性	工作 Job, Work, Career
51	領導團隊	工作 Job, Work, Career
32	愛與被愛	人際關係 Interpersonal relationships
19	低調 不張揚	自我與生活 Self and Life
20	忠誠	美德 Virtue
7	保持潔淨身體、心靈或環境	自我與生活 Self and Life
34	能彼此尊重	人際關係 Interpersonal relationships
21	國家主權 民族意識	美德 Virtue
22	不欺騙 不說謊	美德 Virtue
46	晉升的機會與速度	工作 Job, Work, Career
70	有秩序與穩定的環境	工作 Job, Work, Career
15	平凡的生活	自我與生活 Self and Life
41	有伙伴一起打拼	工作 Job, Work, Career
52	務實 重視可行性	工作 Job, Work, Career
9	保有隱私不受人打擾	自我與生活 Self and Life
60	專業	工作 Job, Work, Career
59	追求美感或藝術	工作 Job, Work, Career
10	追求真理與知性	自我與生活 Self and Life
62	追求工作品質	工作 Job, Work, Career
17	規律的生活	自我與生活 Self and Life
27	尊重傳統延續歷史	美德 Virtue
44	負責 勇於承擔責任	工作 Job, Work, Career
66	安全感 工作上或心理面可預測或可掌控	工作 Job, Work, Career
11	自我肯定 喜歡自己	自我與生活 Self and Life
12	自我表達與呈現	自我與生活 Self and Life
25	真誠一致	美德 Virtue
49	社會認可 受人尊重肯定	工作 Job, Work, Career
30	社會公益 關懷弱勢	美德 Virtue
42	解決他人的問題幫助他人成長	工作 Job, Work, Career
67	冒險挑戰	工作 Job, Work, Career
58	發揮自己的天賦能力	工作 Job, Work, Career
53	能被看見 有舞台能發光	工作 Job, Work, Career
26	全人類的福祉	美德 Virtue
31	交友廣闊	人際關係 Interpersonal relationships
57	工作生活平衡	工作 Job, Work, Career