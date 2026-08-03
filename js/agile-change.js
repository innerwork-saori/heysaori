/* ══════════════════════════════════════════════════════════════════
   Agile Mindset Quiz - Main JS
   Modules: quiz-engine + result-engine + UI
   ══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════════
     內嵌資料（Inline Config）
     題目、分類、計分規則、結果文案全部在此維護。
     純靜態專案，不需要 fetch()。
     ════════════════════════════════════════════════════════════════ */
  var QUIZ_CONFIG = {
    meta: {
      title: 'Agile Mindset 測驗',
      subtitle: '了解你的敏捷心態現況',
      totalQuestions: 15,
      scaleMin: 1,
      scaleMax: 10,
      version: '1.0.0'
    },

    scoringRules: {
      overallFormula: '（15 題總分 ÷ 15）× 10',
      categoryFormula: '（分類 3 題總分 ÷ 3）× 10',
      levels: [
        { id: 'low',    label: '仍在建立',  minScore: 0,  maxScore: 69  },
        { id: 'medium', label: '持續成長',  minScore: 70, maxScore: 89  },
        { id: 'high',   label: '強項展現',  minScore: 90, maxScore: 100 }
      ]
    },

    categories: [
      {
        id: 'beginner-mindset',
        label: '初學者心態',
        labelEn: 'Beginner Mindset',
        questionIds: ['q1', 'q2', 'q3']
      },
      {
        id: 'done-over-perfect',
        label: '完成勝於完美',
        labelEn: 'Done is Better than Perfect',
        questionIds: ['q4', 'q5', 'q6']
      },
      {
        id: 'failure-seeking',
        label: '追求失敗勝於迴避失敗',
        labelEn: 'Failure-Seeking over Failure Aversion',
        questionIds: ['q7', 'q8', 'q9']
      },
      {
        id: 'empathy-over-engagement',
        label: '同理勝於投入',
        labelEn: 'Empathy over Engagement',
        questionIds: ['q10', 'q11', 'q12']
      },
      {
        id: 'self-compassion',
        label: '自我慈悲勝於自我批判',
        labelEn: 'Self-Compassion over Self-Judgment',
        questionIds: ['q13', 'q14', 'q15']
      }
    ],

    questions: [
      { id: 'q1',  categoryId: 'beginner-mindset',        text: '你在多大程度上會接受所有想法作為可能性？',                             isReversed: false, weight: 1 },
      { id: 'q2',  categoryId: 'beginner-mindset',        text: '當我面對變革挑戰時，我會提醒自己組織裡有很多人也有和我一樣的感受。',     isReversed: false, weight: 1 },
      { id: 'q3',  categoryId: 'beginner-mindset',        text: '你多常會嘗試新事物，即使你不知道該怎麼做？',                             isReversed: false, weight: 1 },
      { id: 'q4',  categoryId: 'done-over-perfect',       text: '我偏好採用「測試並學習」的方式，而不是花時間取得完整的需求。',             isReversed: false, weight: 1 },
      { id: 'q5',  categoryId: 'done-over-perfect',       text: '你在多大程度上會保持天生的好奇心並尋求學習新事物？',                       isReversed: false, weight: 1 },
      { id: 'q6',  categoryId: 'done-over-perfect',       text: '你在多大程度上能夠在還看不到全貌的情況下採取行動？',                       isReversed: false, weight: 1 },
      { id: 'q7',  categoryId: 'failure-seeking',         text: '我會全心全意地聆聽，而不會去想接下來要說什麼。',                           isReversed: false, weight: 1 },
      { id: 'q8',  categoryId: 'failure-seeking',         text: '即使工作尚未完成或不夠完美，我也能自在地分享我正在進行的工作。',           isReversed: false, weight: 1 },
      { id: 'q9',  categoryId: 'failure-seeking',         text: '當我在對自己重要的事情上失敗時，我會試著保持客觀的角度看待。',             isReversed: false, weight: 1 },
      { id: 'q10', categoryId: 'empathy-over-engagement', text: '你在多大程度上會將失敗和錯誤視為學習的機會？',                            isReversed: false, weight: 1 },
      { id: 'q11', categoryId: 'empathy-over-engagement', text: '我經常反思自己做過的事情，思考如何能做得更好。',                          isReversed: false, weight: 1 },
      { id: 'q12', categoryId: 'empathy-over-engagement', text: '你多常會主動嘗試從另一個角度看待事情？',                                  isReversed: false, weight: 1 },
      { id: 'q13', categoryId: 'self-compassion',         text: '我經常在工作中把自己推出舒適圈。',                                        isReversed: false, weight: 1 },
      { id: 'q14', categoryId: 'self-compassion',         text: '當我感到情緒上的痛苦時，我會試著善待自己。',                              isReversed: false, weight: 1 },
      { id: 'q15', categoryId: 'self-compassion',         text: '當你不知道某件事時，你對於提問感到多自在？',                              isReversed: false, weight: 1 }
    ],

    results: {
      overall: {
        low:    { headline: '敏捷心態：仍在建立',  body: '你的敏捷心態正在萌芽中。每個起點都是珍貴的學習機會，帶著好奇心繼續探索吧！' },
        medium: { headline: '敏捷心態：持續成長',  body: '你已具備相當的敏捷心態，並在多數情境下能靈活回應變化。繼續深化這些優勢，你的影響力將更廣泛。' },
        high:   { headline: '敏捷心態：強項展現',  body: '恭喜！你展現了高度的敏捷心態，能夠擁抱不確定性、從失敗中學習、並以同理心面對自己與他人。' }
      },
      categories: {
        'beginner-mindset': {
          low:    { feedback: '對新想法保持開放仍需練習。試著在下一次對話中，先完整聽完對方的想法再給意見。' },
          medium: { feedback: '你能接受多元想法，偶爾仍會受既有框架影響。刻意練習「先問問題」而非急著評判，會有幫助。' },
          high:   { feedback: '你展現了典型的初學者心態——真誠地將每個想法視為可能性。這是敏捷文化的核心特質之一。' }
        },
        'done-over-perfect': {
          low:    { feedback: '你可能傾向等到「準備好了」才行動。試著設定一個「夠好就發出去」的標準，從小事開始練習。' },
          medium: { feedback: '你能夠在不完美的情況下行動，但有時還是會等待更多確定性。持續練習迭代思維！' },
          high:   { feedback: '你完全內化了「完成勝於完美」的精神——行動優先，從回饋中學習。這讓你的迭代速度遠超他人。' }
        },
        'failure-seeking': {
          low:    { feedback: '失敗對你來說仍是需要避開的事。試著把下一次的小失誤當作實驗資料，而非個人評價。' },
          medium: { feedback: '你能夠理性看待失敗，但情緒上仍有些影響。持續練習把「沒做好」和「我不夠好」分開來。' },
          high:   { feedback: '你真正把失敗視為學習素材，而非威脅。這種心態讓你能冒更聰明的風險，也更能幫助團隊心理安全。' }
        },
        'empathy-over-engagement': {
          low:    { feedback: '你在聆聽與換位思考上還有成長空間。試著在下一次對話中，至少問一個「你是怎麼看這件事？」的問題。' },
          medium: { feedback: '你具備同理心，但有時還是以自身視角為主。有意識地練習「先理解，再回應」的習慣。' },
          high:   { feedback: '你展現了強烈的同理心與反思能力——這讓你在團隊協作與個人成長上都具備深厚的基礎。' }
        },
        'self-compassion': {
          low:    { feedback: '你對自己的批判可能比對他人更嚴格。試著在下一次犯錯時，用對待好朋友的方式對待自己。' },
          medium: { feedback: '你能夠善待自己，但壓力大時自我批判仍可能浮現。持續練習自我慈悲，讓它成為你的預設反應。' },
          high:   { feedback: '你能夠在痛苦和挑戰中善待自己——這是敏捷心態最深層的基礎，也是持續成長不可或缺的能量來源。' }
        }
      }
    }
  };

  /* ── 私有狀態 ─────────────────────────────────────────────────── */
  var state = {
    config: null,
    answers: {},          // { "q1": 7, "q2": 4, ... }
    currentIndex: 0,      // 目前顯示的題目索引（0–14）
    phase: 'start'        // 'start' | 'quiz' | 'result'
  };

  /* ════════════════════════════════════════════════════════════════
     TASK 4.1 — 初始化（同步，直接使用內嵌 QUIZ_CONFIG）
     ════════════════════════════════════════════════════════════════ */

  function initQuiz() {
    state.config = QUIZ_CONFIG;
    renderStartScreen();
  }

  /* ════════════════════════════════════════════════════════════════
     TASK 4.2 — section 切換 / startQuiz / resetQuiz
     ════════════════════════════════════════════════════════════════ */

  /**
   * showSection(sectionId)
   * sectionId: 'start' | 'quiz' | 'result'
   * Hides all sections, shows the target, scrolls to top, moves focus.
   */
  function showSection(sectionId) {
    var sections = document.querySelectorAll('.section');
    sections.forEach(function (s) {
      s.classList.remove('section--active');
    });

    var target = document.getElementById('section-' + sectionId);
    if (!target) {
      console.error('[AgileQuiz] showSection: unknown section', sectionId);
      return;
    }
    target.classList.add('section--active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Move focus for accessibility
    var focusTarget = target.querySelector('h1, h2');
    if (!focusTarget) {
      focusTarget = target;
    }
    if (focusTarget.tabIndex < 0) {
      focusTarget.setAttribute('tabindex', '-1');
    }
    focusTarget.focus({ preventScroll: true });
  }

  function renderStartScreen() {
    // Nothing extra — start section is already visible by default,
    // and showSection('start') handles visibility when resetting.
  }

  function startQuiz() {
    state.phase = 'quiz';
    state.currentIndex = 0;
    showSection('quiz');
    renderQuestion(0);
  }

  function resetQuiz() {
    state.answers = {};
    state.phase = 'start';
    state.currentIndex = 0;
    showSection('start');
    renderStartScreen();
  }

  /* ════════════════════════════════════════════════════════════════
     TASK 4.3 — renderQuestion / renderScaleButtons
     ════════════════════════════════════════════════════════════════ */

  /**
   * renderQuestion(index)
   * Renders question at given index, updates progress bar + label,
   * updates category badge, shows/hides prev button.
   */
  function renderQuestion(index) {
    var config = state.config;
    var question = config.questions[index];
    var total = config.meta.totalQuestions;

    // Find the category for this question
    var category = null;
    config.categories.forEach(function (cat) {
      if (cat.questionIds.indexOf(question.id) !== -1) {
        category = cat;
      }
    });

    // Update question number text
    var numEl = document.getElementById('quiz-question-number');
    if (numEl) numEl.textContent = '第 ' + (index + 1) + ' 題，共 ' + total + ' 題';

    // Update question text
    var textEl = document.getElementById('quiz-question-text');
    if (textEl) textEl.textContent = question.text;

    // Update category badge
    var badgeEl = document.getElementById('quiz-category-label');
    if (badgeEl) {
      badgeEl.textContent = category ? category.label : '';
    }

    // Update progress bar: width = completed questions / total
    var progressPct = (index / total) * 100;
    var fillEl = document.getElementById('progress-bar-fill');
    if (fillEl) fillEl.style.width = progressPct + '%';

    // Update progress label
    var labelEl = document.getElementById('progress-label');
    if (labelEl) labelEl.textContent = '第 ' + (index + 1) + ' 題，共 ' + total + ' 題';

    // Show/hide prev button
    var prevBtn = document.getElementById('btn-prev-question');
    if (prevBtn) {
      prevBtn.style.display = index === 0 ? 'none' : '';
    }

    // Render scale buttons with any previously recorded answer
    var existingAnswer = state.answers[question.id] || null;
    renderScaleButtons(existingAnswer, index);
  }

  /**
   * renderScaleButtons(selectedValue, questionIndex)
   * Builds 10 scale buttons, marks the selected one.
   */
  function renderScaleButtons(selectedValue, questionIndex) {
    var container = document.getElementById('quiz-scale');
    if (!container) return;
    container.innerHTML = '';

    var scaleMin = state.config.meta.scaleMin;   // 1
    var scaleMax = state.config.meta.scaleMax;   // 10

    for (var i = scaleMin; i <= scaleMax; i++) {
      (function (value) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'scale-btn';
        btn.textContent = value;
        btn.dataset.value = value;
        btn.setAttribute('aria-label', value + ' 分');
        btn.setAttribute('aria-pressed', value === selectedValue ? 'true' : 'false');

        if (value === selectedValue) {
          btn.classList.add('scale-btn--selected');
        }

        btn.addEventListener('click', function () {
          onScaleClick(value, questionIndex !== undefined ? questionIndex : state.currentIndex);
        });

        container.appendChild(btn);
      }(i));
    }
  }

  /**
   * onScaleClick(value, questionIndex)
   * Immediately updates visual state, then records answer after 300ms.
   */
  function onScaleClick(value, questionIndex) {
    // Immediate visual feedback
    var buttons = document.querySelectorAll('#quiz-scale .scale-btn');
    buttons.forEach(function (btn) {
      var isSelected = parseInt(btn.dataset.value, 10) === value;
      btn.classList.toggle('scale-btn--selected', isSelected);
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    // Record after short delay so user sees selection
    setTimeout(function () {
      recordAnswer(questionIndex, value);
    }, 300);
  }

  /* ════════════════════════════════════════════════════════════════
     TASK 4.4 — recordAnswer / goToQuestion
     ════════════════════════════════════════════════════════════════ */

  /**
   * recordAnswer(questionIndex, value)
   * Handles isReversed + weight, stores answer, navigates to next or triggers result.
   */
  function recordAnswer(questionIndex, value) {
    var config = state.config;
    var question = config.questions[questionIndex];
    var scaleMin = config.meta.scaleMin;
    var scaleMax = config.meta.scaleMax;
    var total = config.meta.totalQuestions;

    // Handle reversed questions
    var adjustedValue = question.isReversed
      ? (scaleMax + scaleMin) - value
      : value;

    // Apply weight
    var weightedValue = adjustedValue * (question.weight || 1);

    state.answers[question.id] = weightedValue;

    if (questionIndex === total - 1) {
      // Last question — update progress to 100% then show result
      var fillEl = document.getElementById('progress-bar-fill');
      if (fillEl) fillEl.style.width = '100%';
      setTimeout(function () {
        triggerResult();
      }, 300);
    } else {
      state.currentIndex = questionIndex + 1;
      setTimeout(function () {
        renderQuestion(state.currentIndex);
      }, 300);
    }
  }

  /**
   * goToQuestion(index)
   * Navigates directly to a question (used by prev button).
   */
  function goToQuestion(index) {
    if (index < 0) return;
    state.currentIndex = index;
    renderQuestion(index);
  }

  /* ════════════════════════════════════════════════════════════════
     TASK 4.5 — triggerResult / calculateResults / determineLevel
     ════════════════════════════════════════════════════════════════ */

  function triggerResult() {
    var config = state.config;
    var total = config.meta.totalQuestions;

    // Guard: all questions must be answered
    if (Object.keys(state.answers).length < total) {
      // Find first unanswered question
      var firstUnanswered = 0;
      for (var i = 0; i < config.questions.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(state.answers, config.questions[i].id)) {
          firstUnanswered = i;
          break;
        }
      }
      goToQuestion(firstUnanswered);
      return;
    }

    var result = calculateResults(state.answers, config);
    state.phase = 'result';
    renderResult(result);
  }

  /**
   * calculateResults(answers, config)
   * Returns { overallScore, overallLevel, headline, body, categories[] }
   */
  function calculateResults(answers, config) {
    var totalSum = 0;
    var categoryResults = [];
    var scaleMax = config.meta.scaleMax;

    config.categories.forEach(function (category) {
      var catSum = 0;
      category.questionIds.forEach(function (qId) {
        catSum += answers[qId] || 0;
        totalSum += answers[qId] || 0;
      });

      // catScore = (sum of 3 questions / 3) × 10, clamped [0, 100]
      var catScore = clamp(Math.round((catSum / 3) * 10 * 10) / 10, 0, 100);
      var catLevel = determineLevel(catScore, config.scoringRules.levels);
      var catFeedback = config.results.categories[category.id][catLevel].feedback;

      categoryResults.push({
        id: category.id,
        label: category.label,
        score: catScore,
        level: catLevel,
        feedback: catFeedback
      });
    });

    // overallScore = (sum of 15 questions / 15) × 10, clamped [0, 100]
    var overallScore = clamp(Math.round((totalSum / config.meta.totalQuestions) * 10 * 10) / 10, 0, 100);
    var overallLevel = determineLevel(overallScore, config.scoringRules.levels);
    var overallCopy = config.results.overall[overallLevel];

    return {
      overallScore: overallScore,
      overallLevel: overallLevel,
      headline: overallCopy.headline,
      body: overallCopy.body,
      categories: categoryResults
    };
  }

  /**
   * determineLevel(score, levels)
   * Returns the level id whose minScore–maxScore range contains score.
   */
  function determineLevel(score, levels) {
    for (var i = 0; i < levels.length; i++) {
      if (score >= levels[i].minScore && score <= levels[i].maxScore) {
        return levels[i].id;
      }
    }
    // Boundary protection: score = 100 → 'high'
    return levels[levels.length - 1].id;
  }

  /**
   * clamp(value, min, max)
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /* ════════════════════════════════════════════════════════════════
     TASK 4.6 — renderResult
     ════════════════════════════════════════════════════════════════ */

  /**
   * renderResult(result)
   * Validates result data, populates result section, then shows it.
   */
  function renderResult(result) {
    // Guard: validate required fields
    if (!result.headline || !result.body) {
      console.error('[AgileQuiz] renderResult: missing headline or body');
      showResultError();
      return;
    }
    for (var i = 0; i < result.categories.length; i++) {
      if (!result.categories[i].feedback) {
        console.error('[AgileQuiz] renderResult: missing feedback for', result.categories[i].id);
        showResultError();
        return;
      }
    }

    // Overall score — display as integer percentage
    var scoreEl = document.getElementById('result-score-display');
    if (scoreEl) scoreEl.textContent = Math.round(result.overallScore) + '%';

    var headlineEl = document.getElementById('result-headline');
    if (headlineEl) headlineEl.textContent = result.headline;

    var bodyEl = document.getElementById('result-body');
    if (bodyEl) bodyEl.textContent = result.body;

    // Category cards
    var catContainer = document.getElementById('result-categories');
    if (catContainer) {
      catContainer.innerHTML = result.categories.map(function (cat) {
        var levelLabel = getLevelLabel(cat.level);
        return [
          '<div class="category-card category-card--' + cat.level + '">',
          '  <div class="category-card-header">',
          '    <span class="category-label">' + escapeHtml(cat.label) + '</span>',
          '    <span class="category-score">' + cat.score + '%</span>',
          '  </div>',
          '  <div class="level-badge--' + cat.level + '">' + escapeHtml(levelLabel) + '</div>',
          '  <p class="category-feedback">' + escapeHtml(cat.feedback) + '</p>',
          '  <div class="score-bar">',
          '    <div class="score-bar-fill" style="width:' + cat.score + '%"></div>',
          '  </div>',
          '</div>'
        ].join('\n');
      }).join('\n');
    }

    showSection('result');
  }

  /**
   * getLevelLabel(levelId)
   * Returns the display label for a level id from config.
   */
  function getLevelLabel(levelId) {
    if (!state.config) return levelId;
    var levels = state.config.scoringRules.levels;
    for (var i = 0; i < levels.length; i++) {
      if (levels[i].id === levelId) return levels[i].label;
    }
    return levelId;
  }

  /**
   * showResultError()
   * Shows a fallback error message in the result section.
   */
  function showResultError() {
    var container = document.getElementById('result-categories');
    if (container) {
      container.innerHTML = '<p style="color:var(--accent1);text-align:center;padding:2rem 0;">結果載入失敗，請重新作答。</p>';
    }
    showSection('result');
  }

  /**
   * escapeHtml(str)
   * Prevents XSS when injecting user-derived strings into innerHTML.
   */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ════════════════════════════════════════════════════════════════
     啟動 & 事件綁定
     ════════════════════════════════════════════════════════════════ */

  document.addEventListener('DOMContentLoaded', function () {
    // Bind navigation buttons
    var btnStart = document.getElementById('btn-start');
    if (btnStart) btnStart.addEventListener('click', startQuiz);

    var btnRestart = document.getElementById('btn-restart');
    if (btnRestart) btnRestart.addEventListener('click', resetQuiz);

    var btnPrev = document.getElementById('btn-prev-question');
    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        goToQuestion(state.currentIndex - 1);
      });
    }

    initQuiz();
  });

})();
