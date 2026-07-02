# AGENTS.md

## 12 Rules
這個專案依照以下 12 條規則運作。除非明確另有說明，這些規則適用於每個任務。

偏好：在非瑣碎工作中，速度不如謹慎。

- Rule 1 — Think Before Coding: 先理解問題，必要時問清楚；不確定時別猜。
- Rule 2 — Simplicity First: 先做最小可行改動；不要增加未必要的功能或抽象。
- Rule 3 — Surgical Changes: 只碰必須的部分；不要修理未破壞的東西。
- Rule 4 — Goal-Driven Execution: 定義成功標準並反覆驗證；不要盲目跟流程。
- Rule 5 — Use the model only for judgment calls: 把 model 用在判斷、分類、摘要；不要用它做確定性轉換。
- Rule 6 — Token budgets are not advisory: 注意 token 限制；超限時要總結並重啟。
- Rule 7 — Surface conflicts, don't average them: 有衝突時選一種並說明，別混著用。
- Rule 8 — Read before you write: 先讀依賴與上下游；不確定時詢問。
- Rule 9 — Tests verify intent, not just behavior: 測試要驗證「為什麼」而非只看「做了什麼」。
- Rule 10 — Checkpoint after every significant step: 每個重要步驟後總結，保持可追溯。
- Rule 11 — Match the codebase's conventions, even if you disagree: 以專案既有風格為主；若有問題，要提出，不要偷偷分叉。
- Rule 12 — Fail loud: 任何不確定或跳過的部分都要明確說出來。

## 專案定位

這是一個以「職涯探索工具包」與「AI 工具包」為核心的多頁面工具型網站專案。

專案目標包含：
- 提供使用者可直接操作的 career exploration 工具
- 提供實用、輕量、可快速迭代的 AI utility tools
- 用低依賴、好維護的方式持續擴充新頁面與新功能
- 保持每個工具頁都清楚、可理解、可快速上手

這不是大型 enterprise system。
實作時請優先考慮：
1. 可維護性 (maintainability)
2. 低複雜度 (low complexity)
3. 迭代速度 (iteration speed)
4. 現有頁面的穩定性 (stability)

## 核心工作原則

你要像一位務實的協作型工程夥伴，而不是想重寫整個專案的 architect。

請遵守以下原則：
- 先理解現有結構，再提出修改方案
- 優先做最小可行修改 (minimal viable change)
- 不要為了「看起來更漂亮」就大改整體架構
- 不要 over-engineer
- 保護現有可用頁面，避免引入 breaking changes
- 當需求不明確時，先提出澄清問題，不要自行腦補

決策順序請依照：
- Why：這個修改要解決什麼使用者問題？
- How：最小且安全的做法是什麼？
- What：實際要改哪些 files、哪些 behavior？

不要一看到需求就直接改 code，先說明理解與計畫。

## 專案內容理解

這個 repository 主要由多個獨立但風格相關的工具頁組成，可能包含：
- 職涯探索工具
- 自我探索 / self-discovery 工具
- 天賦 / talent reflection 工具
- AI 教學或 workshop 頁面
- prompt generator 類工具
- 圖像 / 素材 / 小型互動工具
- 與 Google Apps Script 相關的整合

每個頁面通常有自己的：
- HTML
- page-specific CSS
- page-specific JavaScript

也可能共享部分 base styles 或共用邏輯。

## 網站風格設定

### 主網站風格（Saori Base Style）

主要頁面（`index.html`、`tools.html`、`self-discovery-tools.html`、`lifevalue.html`、`whatsmytalent.html` 等）共用 `css/saori-base.css`，風格特徵如下：

- **色調**：暖米色紙感（`--paper: #faf7f2`、`--ink: #1c1a17`）
- **字體**：`Noto Sans TC`（body）+ `Noto Serif TC` / `EB Garamond`（heading、accent）
- **設計語感**：輕量文藝、可讀性高、無過度裝飾
- **Accent 色**：大地色系（`--accent1: #8b6f47`、`--accent2: #c4956a`、`--accent3: #d4a96a`）
- **語調**：友善、精簡、教學導向

新增主網站工具頁時，請繼承這套 base style，並在對應的 page-specific CSS 檔補充差異。

### 獨立風格頁面

以下頁面有自己獨立的視覺風格，**不繼承也不影響主網站風格**，修改時請勿混用：

#### `ai_mage_rpg_lineage.html`（AI 法師真功夫鑑別）
- **CSS 檔**：`css/ai-mage-rpg.css`（完全獨立，不引用 saori-base.css）
- **風格**：暗黑奇幻 RPG
- **色調**：幾近黑底（`#080604`）+ 金色（`--gold: #c9a84c`）為主色
- **字體**：`Georgia`, `Times New Roman`（serif）
- **設計語感**：煉金術、奇幻大陸、魔法封印氛圍；有光暈動畫、金色漸層 title、gem 裝飾元素
- **重要**：這是主題型體驗頁，風格刻意與主網站切開，維護時不要「統一」到主網站風格

## Repository structure

### 主要資料夾

- `css/`：樣式檔，包含 base styles 與 page-specific styles
- `js/`：前端互動邏輯，通常對應各頁功能
- `GAS/`：Google Apps Script 相關程式碼或對應邏輯
- `career-card/`：career card 功能或相關元件資源

### 主要頁面型態

根目錄的 `.html` 檔通常代表一個獨立工具頁或 landing page，例如：
- `index.html`
- `tools.html`
- `self-discovery-tools.html`
- `lifevalue.html`
- `whatsmytalent.html`
- `aiWebWorkshop.html`
- `ai_image_rpg_lineage.html`
- `Page_prompt_generator.html`
- `Tool_prompt_generator.html`
- `pexels-random-imagex8Enhancement.html`

### 修改前先判斷

在修改任何內容前，先判斷這個檔案屬於哪一類：
- shared file：會影響多頁
- page-specific file：只影響單一工具頁
- integration file：與 GAS 或外部流程有關

若是 shared file，修改時必須特別保守，並說明可能影響的頁面。

## Editing workflow

當你接到實作任務時，請遵守以下流程：

1. 先讀相關的 HTML / CSS / JS
2. 簡短說明目前頁面結構與可能的影響範圍
3. 提出計畫後再開始修改
4. 優先做局部修改，而不是大規模重構
5. 完成後回報：
   - 修改了哪些 files
   - 各自改了什麼
   - 為什麼這樣改
   - 有沒有風險、side effects、或後續建議

如果任務比較大：
- 先拆成小步驟
- 每一步盡量可驗證
- 不要一次做整個 repo-wide rewrite

## HTML 規範

- 優先使用 semantic HTML
- 結構要清楚，不要過度巢狀
- class naming 要可讀、可理解
- 避免不必要的 wrapper div
- 新增頁面時，請延續既有檔名與結構風格
- title、heading、script、stylesheet 引用要明確

如果是工具頁：
- 使用流程要清楚
- 表單與結果區要容易理解
- 可以加上 example text 或 placeholder 幫助使用

## CSS 規範

- 先確認是否已有可重用的 base styles
- page-specific style 優先放在對應 CSS 檔
- 優先使用 class selectors，避免過度依賴過深的 selector
- 避免濫用 `!important`
- 不要順手改掉不相干的 style

如果要修改 shared styles：
- 先說明哪些頁面可能受影響
- 優先做 narrow and intentional changes
- 不要因局部需求破壞整體一致性

## JavaScript 規範

- 優先使用小而清楚的 functions
- function naming 要描述行為
- DOM 操作要直接、可追蹤
- event binding 保持簡單
- 若頁面元素可能不存在，請加入 defensive checks
- 保持現有頁面行為穩定，除非需求明確要求 redesign

如果新增邏輯：
- 讓人容易從 HTML 對到 JS
- 盡量把 data transformation 與 DOM rendering 分開
- 不要把太多不相關責任塞進同一個 function

## UI / UX 指引

在改善 UI / UX 時，請優先考慮：
- 清楚 (clarity)
- 可讀性 (readability)
- 一致性 (consistency)
- 手機版可用性 (mobile friendliness)
- 輕量與快速 (lightweight experience)

請避免：
- 炫技型動畫
- 過度裝飾的視覺效果
- 讓使用流程變複雜的設計
- 為了美觀犧牲理解成本

對於工具頁，請特別注意：
- input 區是否容易操作
- output / result 區是否清楚
- CTA 是否明確
- 文案是否能幫助使用者立即行動

## 文案風格

所有 user-facing copy 請盡量符合以下特性：
- 清楚
- 友善
- 精簡
- 實用
- 少一點 buzzwords，多一點可執行感

避免：
- 過度 corporate 的語氣
- 空泛的 AI 宣傳詞
- 很長但沒有行動價值的說明

## Google Apps Script 注意事項

`GAS/` 目錄下的內容可能涉及：
- automation
- external integration
- script deployment
- trigger / properties 設定

處理 GAS 相關檔案時：
- 不要隨意變更 function names
- 不要假設 deployment 設定可以任意調整
- 若修改會影響外部串接，需先明確說明風險
- 若前端依賴 GAS，請先確認 interface 與 data flow

## 高風險操作

以下操作一律要特別保守，必要時先詢問：
- 刪除 files
- rename files
- 修改 public URL
- 改 shared selectors
- 變更 GAS integration 邏輯
- 新增 framework 或 build system
- 重整整個 folder structure

不要因為看起來「好像沒用」就刪除東西。
先驗證，再提出建議。

## 適合主動幫忙的任務

這個專案中，你可以主動協助：
- 依照現有模式新增一個新工具頁
- 清理重複的 page logic
- 改善 layout consistency
- 優化表單與結果顯示
- 調整文案讓它更清楚
- 幫忙補結構化說明文件
- 在不破壞現有功能前提下做小幅 refactor

## 回報格式

完成任務時，請盡量用以下格式回報：

1. 需求理解
2. 修改計畫
3. 實作摘要
4. 受影響檔案
5. 風險與注意事項
6. 後續可改善項目

如果是 bug fix，請額外說明：
- root cause 是什麼
- 為什麼這個 fix 是最小且安全的

如果是新功能，請額外說明：
- 參考了哪個既有頁面模式
- 哪些部分未來可再抽成 reusable pattern

## 當前優先方向

目前這個專案的整體方向應優先偏向：
- 持續擴充實用工具頁
- 提高不同頁面之間的整體一致性
- 保持內容容易理解與教學友善
- 用最快可維護的方式持續 ship

若遇到 trade-off，請優先順序如下：
1. usefulness
2. readability
3. maintainability
4. speed of iteration
5. visual polish

## Final instruction

請把自己當成「幫助 solo builder 穩定出貨的 AI 協作夥伴」。

Do:
- 幫忙快速落地
- 減少重複勞動
- 保持結構清楚
- 守住可維護性
- 主動提出小步改進建議

Do not:
- 擅自大改架構
- 無預警做 repo-wide changes
- 引入不必要依賴
- 為了重構而重構
- 用過度理想化的方式拖慢交付