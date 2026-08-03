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
  /* ── v2 改版：五大構面重新命名、15 道全新題目、計分公式語意更新、15 段新文案 ── */
  var QUIZ_CONFIG = {
    meta: {
      title: 'Agile Mindset 測驗',
      subtitle: '了解你的敏捷心態現況',
      totalQuestions: 15,
      scaleMin: 1,
      scaleMax: 10,
      version: '2.0.0'
    },

    scoringRules: {
      overallFormula: '（15 題總分 ÷ 150）× 100，四捨五入至小數後 1 位',
      categoryFormula: '（分類 3 題總分 ÷ 30）× 100，四捨五入至小數後 1 位',
      levels: [
        { id: 'emerging',  label: '建立中',   minScore: 0,  maxScore: 59  },
        { id: 'growing',   label: '穩定成長', minScore: 60, maxScore: 79  },
        { id: 'thriving',  label: '敏捷強項', minScore: 80, maxScore: 100 }
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
        id: 'action-over-perfection',
        label: '行動導向',
        labelEn: 'Action over Perfection',
        questionIds: ['q4', 'q5', 'q6']
      },
      {
        id: 'failure-embracing',
        label: '擁抱失敗',
        labelEn: 'Failure Embracing',
        questionIds: ['q7', 'q8', 'q9']
      },
      {
        id: 'empathy-collaboration',
        label: '同理與協作',
        labelEn: 'Empathy & Collaboration',
        questionIds: ['q10', 'q11', 'q12']
      },
      {
        id: 'self-care',
        label: '自我照顧',
        labelEn: 'Self-Care',
        questionIds: ['q13', 'q14', 'q15']
      }
    ],

    questions: [
      { id: 'q1',  categoryId: 'beginner-mindset',       text: '面對不熟悉的領域時，我可以坦然承認「我現在還不懂，但我願意學」。',                   isReversed: false, weight: 1 },
      { id: 'q2',  categoryId: 'beginner-mindset',       text: '當有人給我新觀點時，我通常會先好奇地多問幾句，而不是急著反駁。',                    isReversed: false, weight: 1 },
      { id: 'q3',  categoryId: 'beginner-mindset',       text: '我會主動安排時間嘗試自己完全沒碰過的工具、技能或題材。',                            isReversed: false, weight: 1 },
      { id: 'q4',  categoryId: 'action-over-perfection', text: '當一個想法 70% 準備好時，我願意先推出「初版」，再透過回饋調整。',                    isReversed: false, weight: 1 },
      { id: 'q5',  categoryId: 'action-over-perfection', text: '碰到模糊需求時，我傾向先做一個簡單可測試的版本，而不是卡在分析。',                  isReversed: false, weight: 1 },
      { id: 'q6',  categoryId: 'action-over-perfection', text: '當我拖延太久，我會刻意切出一個可以在一兩天內完成的小任務來打破僵局。',              isReversed: false, weight: 1 },
      { id: 'q7',  categoryId: 'failure-embracing',      text: '在重要事情上失敗時，我能在合理時間內從自責轉向「下一次我要怎麼做不同」。',          isReversed: false, weight: 1 },
      { id: 'q8',  categoryId: 'failure-embracing',      text: '我願意分享自己曾經踩雷、失敗的經驗，讓別人也能從中學習。',                          isReversed: false, weight: 1 },
      { id: 'q9',  categoryId: 'failure-embracing',      text: '當嘗試的新做法沒有成功，我通常會紀錄學到什麼，而不是當作沒發生過。',              isReversed: false, weight: 1 },
      { id: 'q10', categoryId: 'empathy-collaboration',  text: '當團隊裡有人狀態不佳，我會留意背後可能的壓力或脈絡，而不是只看表現。',            isReversed: false, weight: 1 },
      { id: 'q11', categoryId: 'empathy-collaboration',  text: '在合作過程中，我會主動詢問對方需要什麼支持或資訊來把事情做好。',                  isReversed: false, weight: 1 },
      { id: 'q12', categoryId: 'empathy-collaboration',  text: '當衝突發生時，我會試著從對方立場重新理解事件，而不是只堅持自己觀點。',            isReversed: false, weight: 1 },
      { id: 'q13', categoryId: 'self-care',              text: '當工作或創作量太大時，我會主動調整節奏，而不是硬撐到筋疲力盡。',                  isReversed: false, weight: 1 },
      { id: 'q14', categoryId: 'self-care',              text: '我能接受自己有狀態不好的日子，不會因為那幾天的表現就全盤否定自己。',              isReversed: false, weight: 1 },
      { id: 'q15', categoryId: 'self-care',              text: '我會刻意安排休息、運動或興趣時間，視為長期保持敏捷與創造力的必要投資。',          isReversed: false, weight: 1 }
    ],

    results: {
      overall: {
        emerging: { headline: '敏捷心態：建立中',   body: '你正在打底，這是最有機會的階段。每個你願意承認「我還不夠懂」的瞬間，都是真正成長的開始。' },
        growing:  { headline: '敏捷心態：穩定成長', body: '你已內化了敏捷的核心精神，並在多數情境下能靈活回應。繼續深化，你的影響力還有很大的空間。' },
        thriving: { headline: '敏捷心態：敏捷強項', body: '你不只理解敏捷，你活出了它。你能在不確定中行動、從失敗中提煉、在協作中感受，這是很難教的素質。' }
      },
      categories: {
        'beginner-mindset': {
          emerging: { feedback: '面對陌生領域時，承認不知道還不太自然。下次可以試試：先說「我還沒研究過這個」，看看對話會往哪裡走。' },
          growing:  { feedback: '你能接受自己不知道，有時還是會有點抗拒。刻意練習：把「好奇」當作回應新事物的第一反應。' },
          thriving: { feedback: '你真的喜歡當新手。這種開放讓你能從每個人、每件事裡學到東西，也讓別人願意跟你分享更多。' }
        },
        'action-over-perfection': {
          emerging: { feedback: '你可能習慣等到準備好再出發。試著定義一個「夠好就發出去」的最低標準，從小事開始練習。' },
          growing:  { feedback: '你懂得迭代，但有時還是會在分析裡多待一會兒。下次設個 timebox——48 小時內，先做出可測試的版本。' },
          thriving: { feedback: '你把行動當成學習的方式。這讓你的迭代速度比大多數人快，也能更早看到真實回饋。' }
        },
        'failure-embracing': {
          emerging: { feedback: '失敗對你來說還是有點刺。試著把下一次的小失誤當成實驗資料，記錄下來而不是急著忘掉。' },
          growing:  { feedback: '你能理性看待失敗，但情緒有時還是會卡住。繼續練習把「這次沒做好」和「我本身不夠好」分開來。' },
          thriving: { feedback: '你把失敗視為素材，而不是判決。這讓你敢冒更聰明的風險，也讓身邊的人更有安全感去嘗試。' }
        },
        'empathy-collaboration': {
          emerging: { feedback: '你在換位思考上還有空間。下次當你要做判斷前，先問一句：「他現在的處境是什麼？」' },
          growing:  { feedback: '你具備同理心，但有時自己的視角還是會先出來。試著刻意慢一拍——先理解，再回應。' },
          thriving: { feedback: '你能感受到別人說不出口的狀態，也知道怎麼調整自己來幫助整體往前。這是協作裡最稀缺的能力。' }
        },
        'self-care': {
          emerging: { feedback: '你可能習慣撐過去，而不是調整節奏。下一次感覺快到極限時，試著刻意停下來問：我現在需要什麼？' },
          growing:  { feedback: '你知道休息重要，但有時還是會覺得放鬆是「偷懶」。記得：可持續的節奏，才是長期敏捷的基礎。' },
          thriving: { feedback: '你把照顧自己當成一種系統設計。這讓你能長期保持清醒、創造力與穩定，而不是靠衝刺燒完就沒了。' }
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
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

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

      // catScore = (sum of 3 questions / 30) × 100, clamped [0, 100]
      var catScore = clamp(Math.round((catSum / 30) * 100 * 10) / 10, 0, 100);
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

    // overallScore = (sum of 15 questions / 150) × 100, clamped [0, 100]
    var overallScore = clamp(Math.round((totalSum / 150) * 100 * 10) / 10, 0, 100);
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
    // Boundary protection: score = 100 → 'thriving'
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
