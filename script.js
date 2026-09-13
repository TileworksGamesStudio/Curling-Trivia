/**
 * UNIVERSAL GAME ENGINE — DAILY QUIZ
 * Canadian Curling Ice & Championship Presentation Upgrade
 * Adheres to the Master Visual Update Bible & Section 65.6 Asset Standard
 */
(function () {
  'use strict';

  const CONFIG = {
    csvPath: './puzzles.csv',
    storageKey: 'universal_daily_quiz_state',
    storageVersion: 1,
    homeUrl: 'https://tileworksgamesstudio.github.io/Curling-Menu/'
  };

  // --- AUTHORITATIVE MAPLE LEAF ASSET (SECTION 65.6) ---
  // Pure geometry, no background rectangle or canvas layer
  const MAPLE_LEAF_PATH = 'm325.8 480.69 8.1527-20.11-65.765-60.873 17.392-9.2397-7.6092-44.568 39.676 4.3481 11.957-16.849 30.98 39.133-17.392-84.788 26.089 8.6962 25.001-45.655 23.371 44.568 27.719-7.6092-17.936 84.244 30.98-38.046 10.87 16.305 39.133-3.8046-5.9786 42.937 17.936 11.414-65.765 60.33 7.0656 21.197-58.699-9.7832 1.6305 72.83h-22.284l3.2611-73.374z';

  // --- 12 DISTINCT CURLING VECTOR MOTIFS (SECTION 10) ---
  const CURLING_ICONS = [
    // 1. Curling Stone
    '<svg viewBox="0 0 48 48"><circle cx="24" cy="27" r="17" fill="#081B2E"/><ellipse cx="24" cy="25" rx="14" ry="7" fill="#D71920"/><path d="M19 14h10v6H19z" fill="#FFC700"/><path d="M22 10h10v4H22z" fill="#081B2E"/></svg>',
    // 2. Curling House / Rings
    '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" fill="none" stroke="#081B2E" stroke-width="2.5"/><circle cx="24" cy="24" r="15" fill="none" stroke="#D71920" stroke-width="3"/><circle cx="24" cy="24" r="8" fill="none" stroke="#BACDE0" stroke-width="2"/><circle cx="24" cy="24" r="3" fill="#D71920"/></svg>',
    // 3. Curling Broom
    '<svg viewBox="0 0 48 48"><line x1="10" y1="38" x2="36" y2="10" stroke="#081B2E" stroke-width="3.5" stroke-linecap="round"/><rect x="6" y="34" width="12" height="6" rx="2" transform="rotate(-45 12 37)" fill="#FFC700" stroke="#081B2E" stroke-width="1.5"/></svg>',
    // 4. Brush Head
    '<svg viewBox="0 0 48 48"><rect x="10" y="18" width="28" height="12" rx="3" fill="#D71920" stroke="#081B2E" stroke-width="2"/><line x1="14" y1="24" x2="34" y2="24" stroke="#FFFFFF" stroke-width="2"/><line x1="24" y1="12" x2="24" y2="18" stroke="#081B2E" stroke-width="3"/></svg>',
    // 5. Hack
    '<svg viewBox="0 0 48 48"><rect x="14" y="26" width="20" height="8" rx="2" fill="#081B2E"/><rect x="16" y="16" width="6" height="10" fill="#BACDE0"/><rect x="26" y="16" width="6" height="10" fill="#BACDE0"/></svg>',
    // 6. Curling Stone Handle
    '<svg viewBox="0 0 48 48"><path d="M14 28h20v-6a6 6 0 0 0-6-6h-8a6 6 0 0 0-6 6v6z" fill="none" stroke="#D71920" stroke-width="4" stroke-linecap="round"/><circle cx="16" cy="30" r="3" fill="#081B2E"/><circle cx="32" cy="30" r="3" fill="#081B2E"/></svg>',
    // 7. Hog Line
    '<svg viewBox="0 0 48 48"><line x1="4" y1="24" x2="44" y2="24" stroke="#D71920" stroke-width="5" stroke-linecap="round"/><line x1="4" y1="18" x2="44" y2="18" stroke="#081B2E" stroke-width="1.5" stroke-dasharray="3,3"/><line x1="4" y1="30" x2="44" y2="30" stroke="#081B2E" stroke-width="1.5" stroke-dasharray="3,3"/></svg>',
    // 8. Back Line
    '<svg viewBox="0 0 48 48"><line x1="6" y1="24" x2="42" y2="24" stroke="#081B2E" stroke-width="4"/><circle cx="24" cy="24" r="5" fill="#FFC700" stroke="#081B2E" stroke-width="1.5"/></svg>',
    // 9. Centre Line
    '<svg viewBox="0 0 48 48"><line x1="24" y1="6" x2="24" y2="42" stroke="#BACDE0" stroke-width="4"/><line x1="16" y1="24" x2="32" y2="24" stroke="#D71920" stroke-width="2.5"/></svg>',
    // 10. Ice Pebble Cluster
    '<svg viewBox="0 0 48 48"><circle cx="18" cy="18" r="3" fill="#081B2E"/><circle cx="30" cy="16" r="2.5" fill="#BACDE0"/><circle cx="24" cy="26" r="3.5" fill="#BACDE0"/><circle cx="14" cy="32" r="2" fill="#081B2E"/><circle cx="32" cy="32" r="3" fill="#081B2E"/></svg>',
    // 11. End Scoreboard Indicator
    '<svg viewBox="0 0 48 48"><rect x="8" y="12" width="32" height="24" rx="2" fill="#081B2E"/><text x="24" y="28" fill="#FFC700" font-size="14" font-weight="900" text-anchor="middle" font-family="sans-serif">8</text></svg>',
    // 12. Skip / Throwing Marker
    '<svg viewBox="0 0 48 48"><circle cx="28" cy="14" r="4" fill="#081B2E"/><path d="M12 36l10-8 6 4 10-10" fill="none" stroke="#D71920" stroke-width="3" stroke-linecap="round"/><line x1="14" y1="36" x2="20" y2="36" stroke="#081B2E" stroke-width="3"/></svg>'
  ];

  // --- AMBIENT CURLING & MAPLE LEAF SYSTEM ---
  class IceAmbience {
    constructor(containerEl) {
      this.container = containerEl;
      this.activeEntities = 0;
      this.maxEntities = 11;
      this.spawnTimer = null;
      this.init();
    }

    init() {
      if (!this.container) return;
      // Start spawning periodically
      this.spawn();
      this.spawnTimer = setInterval(() => {
        if (this.activeEntities < this.maxEntities) {
          this.spawn();
        }
      }, 2400);
    }

    spawn() {
      if (!this.container) return;
      const el = document.createElement('div');
      el.className = 'ambient-curling-entity';

      // Decide whether it is a Canadian Maple Leaf or one of the 12 Curling motifs
      const isMaple = Math.random() < 0.28;
      let svgHtml = '';

      if (isMaple) {
        svgHtml = `<svg viewBox="0 0 298.72 341.12" aria-hidden="true"><path d="${MAPLE_LEAF_PATH}" transform="translate(-250.85 -233.44)" fill="${Math.random() > 0.4 ? '#D71920' : '#081B2E'}"/></svg>`;
      } else {
        const iconIndex = Math.floor(Math.random() * CURLING_ICONS.length);
        svgHtml = CURLING_ICONS[iconIndex];
      }

      el.innerHTML = svgHtml;

      // Spatial depth variation (Section 14)
      const depth = Math.random();
      let size, duration, maxOpacity;
      if (depth < 0.35) {
        // Distant
        size = 18 + Math.random() * 8;
        duration = 24 + Math.random() * 8;
        maxOpacity = 0.16;
      } else if (depth < 0.75) {
        // Middle
        size = 28 + Math.random() * 10;
        duration = 18 + Math.random() * 6;
        maxOpacity = 0.24;
      } else {
        // Near
        size = 40 + Math.random() * 12;
        duration = 13 + Math.random() * 4;
        maxOpacity = 0.32;
      }

      const startLeft = Math.random() * 92;
      const drift = (Math.random() - 0.5) * 60;
      const rot = (Math.random() - 0.5) * 90;

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${startLeft}%`;
      el.style.animationDuration = `${duration}s`;
      el.style.setProperty('--entity-max-opacity', maxOpacity);
      el.style.setProperty('--entity-drift', `${drift}px`);
      el.style.setProperty('--entity-rot', `${rot}deg`);

      this.container.appendChild(el);
      this.activeEntities++;

      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
        this.activeEntities--;
      }, duration * 1000);
    }
  }

  // --- RESTRAINED TACTILE SOUND SYNTHESIS ---
  class SoundManager {
    constructor(enabled = true) {
      this.enabled = enabled;
      this.ctx = null;
    }

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    tone(freq, type = 'sine', duration = 0.1, gainVal = 0.08) {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Silent fallback
      }
    }

    tap() {
      // Solid muted stone contact tap
      this.tone(260, 'triangle', 0.04, 0.07);
    }

    correct() {
      // Two-layer chime
      this.tone(523.25, 'sine', 0.1, 0.08);
      setTimeout(() => this.tone(659.25, 'sine', 0.14, 0.07), 65);
    }

    incorrect() {
      // Soft low stone thump
      this.tone(190, 'sawtooth', 0.14, 0.06);
    }

    complete() {
      // Restrained completion chime
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        setTimeout(() => this.tone(f, 'sine', 0.16, 0.07), i * 70);
      });
    }
  }

  // --- DEFENSIVE LOCAL STORAGE ---
  const Storage = {
    load() {
      const fallback = {
        version: CONFIG.storageVersion,
        sound: true,
        streak: 0,
        lastCompletedDate: null,
        history: {},
        inProgress: null
      };

      try {
        const raw = localStorage.getItem(CONFIG.storageKey);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null) return fallback;
        return {
          version: parsed.version || CONFIG.storageVersion,
          sound: typeof parsed.sound === 'boolean' ? parsed.sound : true,
          streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
          lastCompletedDate: parsed.lastCompletedDate || null,
          history: parsed.history && typeof parsed.history === 'object' ? parsed.history : {},
          inProgress: parsed.inProgress && typeof parsed.inProgress === 'object' ? parsed.inProgress : null
        };
      } catch (e) {
        return fallback;
      }
    },
    save(state) {
      try {
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
      } catch (e) {}
    }
  };

  // --- RFC 4180 CSV PARSER ---
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];

      if (c === '"') {
        if (inQuotes && next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === ',' && !inQuotes) {
        row.push(field.trim());
        field = '';
      } else if ((c === '\n' || (c === '\r' && next === '\n')) && !inQuotes) {
        if (c === '\r') i++;
        row.push(field.trim());
        rows.push(row);
        row = [];
        field = '';
      } else {
        field += c;
      }
    }
    if (field || row.length > 0) {
      row.push(field.trim());
      rows.push(row);
    }

    if (rows.length < 2) throw new Error('Data format invalid or missing.');
    const headers = rows[0].map(h => h.toLowerCase());
    const records = [];

    for (let i = 1; i < rows.length; i++) {
      if (rows[i].length === 1 && rows[i][0] === '') continue;
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = rows[i][idx] !== undefined ? rows[i][idx] : '';
      });
      records.push(obj);
    }
    return records;
  }

  // --- DATE RESOLUTION ---
  async function getTodayDateString() {
    try {
      const res = await fetch(window.location.href.split('#')[0].split('?')[0] + '?_t=' + Date.now(), {
        method: 'HEAD',
        cache: 'no-store'
      });
      const header = res.headers.get('Date');
      if (header) {
        const d = new Date(header);
        if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
      }
    } catch (e) {}
    return new Date().toISOString().split('T')[0];
  }

  function resolveAnswerIndex(val) {
    const clean = String(val).trim().toUpperCase();
    if (clean === 'A' || clean === '0') return 0;
    if (clean === 'B' || clean === '1') return 1;
    if (clean === 'C' || clean === '2') return 2;
    if (clean === 'D' || clean === '3') return 3;
    return 0;
  }

  // --- APPLICATION CONTROLLER ---
  class UniversalQuiz {
    constructor() {
      this.state = Storage.load();
      this.sound = new SoundManager(this.state.sound);
      this.roundsByDate = {};
      this.currentDate = null;
      this.vaultDates = [];

      this.activeRound = null;
      this.currentIndex = 0;
      this.sessionAnswers = [];
      this.isReview = false;
      this.selectedAnswer = null;

      this.cacheDom();
      this.bindEvents();
      this.updateSoundButton();

      // Atmospheric floating background initiation
      const bgTrack = document.getElementById('curlingAmbienceTrack');
      if (bgTrack) {
        this.ambience = new IceAmbience(bgTrack);
      }

      this.init();
    }

    cacheDom() {
      this.dom = {
        appHeaderTitle: document.getElementById('appHeaderTitle'),
        headerBackBtn: document.getElementById('headerBackBtn'),
        soundToggleBtn: document.getElementById('soundToggleBtn'),
        statusView: document.getElementById('statusView'),
        statusTitle: document.getElementById('statusTitle'),
        statusMessage: document.getElementById('statusMessage'),
        statusRetryBtn: document.getElementById('statusRetryBtn'),
        menuView: document.getElementById('menuView'),
        menuTodayDate: document.getElementById('menuTodayDate'),
        menuTodayStatus: document.getElementById('menuTodayStatus'),
        menuStreakCount: document.getElementById('menuStreakCount'),
        playTodayBtn: document.getElementById('playTodayBtn'),
        vaultCountBadge: document.getElementById('vaultCountBadge'),
        openVaultBtn: document.getElementById('openVaultBtn'),
        homeBtn: document.getElementById('homeBtn'),
        gameView: document.getElementById('gameView'),
        gameModeLabel: document.getElementById('gameModeLabel'),
        stepperTrack: document.getElementById('stepperTrack'),
        questionText: document.getElementById('questionText'),
        optionsContainer: document.getElementById('optionsContainer'),
        explanationPanel: document.getElementById('explanationPanel'),
        answerIndicator: document.getElementById('answerIndicator'),
        explanationText: document.getElementById('explanationText'),
        nextQuestionBtn: document.getElementById('nextQuestionBtn'),
        resultsView: document.getElementById('resultsView'),
        scoreValue: document.getElementById('scoreValue'),
        scoreTotal: document.getElementById('scoreTotal'),
        resultsBreakdown: document.getElementById('resultsBreakdown'),
        shareScoreBtn: document.getElementById('shareScoreBtn'),
        reviewQuizBtn: document.getElementById('reviewQuizBtn'),
        resultsVaultBtn: document.getElementById('resultsVaultBtn'),
        resultsMenuBtn: document.getElementById('resultsMenuBtn'),
        vaultView: document.getElementById('vaultView'),
        vaultList: document.getElementById('vaultList'),
        vaultEmptyMsg: document.getElementById('vaultEmptyMsg'),
        toastMessage: document.getElementById('toastMessage')
      };
    }

    bindEvents() {
      this.dom.soundToggleBtn.addEventListener('click', () => {
        this.sound.enabled = !this.sound.enabled;
        this.state.sound = this.sound.enabled;
        Storage.save(this.state);
        this.updateSoundButton();
        this.sound.tap();
      });

      this.dom.headerBackBtn.addEventListener('click', () => {
        this.sound.tap();
        this.showView('menuView');
      });

      this.dom.statusRetryBtn.addEventListener('click', () => {
        this.sound.tap();
        this.init();
      });

      this.dom.playTodayBtn.addEventListener('click', () => {
        this.sound.tap();
        this.startRound(this.currentDate);
      });

      this.dom.openVaultBtn.addEventListener('click', () => {
        this.sound.tap();
        this.renderVault();
      });

      this.dom.homeBtn.addEventListener('click', () => {
        this.sound.tap();
        window.location.href = CONFIG.homeUrl;
      });

      this.dom.nextQuestionBtn.addEventListener('click', () => {
        this.sound.tap();
        this.handleNextQuestion();
      });

      this.dom.shareScoreBtn.addEventListener('click', () => this.shareResults());

      this.dom.reviewQuizBtn.addEventListener('click', () => {
        this.sound.tap();
        this.startReview();
      });

      this.dom.resultsVaultBtn.addEventListener('click', () => {
        this.sound.tap();
        this.renderVault();
      });

      this.dom.resultsMenuBtn.addEventListener('click', () => {
        this.sound.tap();
        this.showView('menuView');
      });
    }

    updateSoundButton() {
      this.dom.soundToggleBtn.textContent = this.sound.enabled ? '🔊' : '🔇';
    }

    showView(viewName) {
      const views = ['statusView', 'menuView', 'gameView', 'resultsView', 'vaultView'];
      views.forEach(v => this.dom[v].classList.add('hidden'));
      this.dom[viewName].classList.remove('hidden');

      if (viewName === 'menuView') {
        this.dom.appHeaderTitle.textContent = 'Daily Quiz';
        this.dom.headerBackBtn.classList.add('hidden');
        this.renderMenu();
      } else if (viewName === 'gameView') {
        this.dom.appHeaderTitle.textContent = this.activeRound
          ? (this.activeRound.date === this.currentDate ? 'Daily Puzzle' : `Vault: ${this.activeRound.date}`)
          : 'Match';
        this.dom.headerBackBtn.classList.remove('hidden');
      } else if (viewName === 'vaultView') {
        this.dom.appHeaderTitle.textContent = 'The Vault';
        this.dom.headerBackBtn.classList.remove('hidden');
      } else {
        this.dom.appHeaderTitle.textContent = 'Daily Quiz';
        this.dom.headerBackBtn.classList.remove('hidden');
      }
      window.scrollTo(0, 0);
    }

    async init() {
      this.dom.statusTitle.textContent = 'Preparing Ice';
      this.dom.statusMessage.textContent = 'Loading championship puzzle data...';
      this.dom.statusRetryBtn.classList.add('hidden');
      this.showView('statusView');
      this.dom.headerBackBtn.classList.add('hidden');

      try {
        const [csvRes, todayStr] = await Promise.all([
          fetch(CONFIG.csvPath, { cache: 'no-store' }),
          getTodayDateString()
        ]);

        if (!csvRes.ok) throw new Error('Could not load puzzles.csv.');
        const csvText = await csvRes.text();
        const records = parseCsv(csvText);

        this.roundsByDate = {};
        records.forEach(row => {
          if (!row.date) return;
          if (!this.roundsByDate[row.date]) this.roundsByDate[row.date] = [];
          this.roundsByDate[row.date].push({
            question: row.question || 'Question text missing.',
            options: [
              row.option_a || 'Option A',
              row.option_b || 'Option B',
              row.option_c || 'Option C',
              row.option_d || 'Option D'
            ],
            answerIndex: resolveAnswerIndex(row.answer),
            explanation: row.explanation || ''
          });
        });

        const allDates = Object.keys(this.roundsByDate).sort();
        if (allDates.length === 0) throw new Error('No puzzle records found.');

        if (this.roundsByDate[todayStr]) {
          this.currentDate = todayStr;
          this.vaultDates = allDates.filter(d => d < todayStr);
        } else {
          const available = allDates.filter(d => d <= todayStr);
          if (available.length > 0) {
            this.currentDate = available[available.length - 1];
            this.vaultDates = available.slice(0, -1);
          } else {
            this.currentDate = allDates[0];
            this.vaultDates = [];
          }
        }

        this.vaultDates.sort((a, b) => b.localeCompare(a));
        this.showView('menuView');

      } catch (err) {
        this.dom.statusTitle.textContent = 'Notice';
        this.dom.statusMessage.textContent = err.message || 'Unable to load puzzle at this time.';
        this.dom.statusRetryBtn.classList.remove('hidden');
        this.showView('statusView');
      }
    }

    renderMenu() {
      this.dom.menuStreakCount.textContent = this.state.streak || 0;
      this.dom.vaultCountBadge.textContent = this.vaultDates.length;

      if (!this.currentDate) {
        this.dom.menuTodayDate.textContent = 'Unavailable';
        this.dom.menuTodayStatus.textContent = 'Unavailable';
        this.dom.playTodayBtn.disabled = true;
        return;
      }

      this.dom.menuTodayDate.textContent = `Match: ${this.currentDate}`;
      this.dom.playTodayBtn.disabled = false;

      const historyItem = this.state.history[this.currentDate];
      const inProgressItem = this.state.inProgress && this.state.inProgress.date === this.currentDate;

      if (historyItem && historyItem.completed) {
        this.dom.menuTodayStatus.textContent = `Completed (${historyItem.score}/${historyItem.answers.length})`;
        this.dom.menuTodayStatus.className = 'badge completed';
        this.dom.playTodayBtn.textContent = 'View Results';
      } else if (inProgressItem) {
        const currentCount = inProgressItem.answers ? inProgressItem.answers.length : 0;
        const totalCount = this.roundsByDate[this.currentDate].length;
        this.dom.menuTodayStatus.textContent = `In Progress (${currentCount}/${totalCount})`;
        this.dom.menuTodayStatus.className = 'badge';
        this.dom.playTodayBtn.textContent = 'Resume';
      } else {
        this.dom.menuTodayStatus.textContent = 'Not Started';
        this.dom.menuTodayStatus.className = 'badge';
        this.dom.playTodayBtn.textContent = 'Play';
      }
    }

    startRound(dateStr) {
      const questions = this.roundsByDate[dateStr];
      if (!questions || questions.length === 0) return;

      this.activeRound = { date: dateStr, questions: questions };
      this.isReview = false;
      this.selectedAnswer = null;

      const savedHistory = this.state.history[dateStr];
      if (savedHistory && savedHistory.completed) {
        this.sessionAnswers = savedHistory.answers;
        this.showResults(savedHistory.score);
        return;
      }

      const isCurrent = (dateStr === this.currentDate);
      if (isCurrent && this.state.inProgress && this.state.inProgress.date === dateStr) {
        this.currentIndex = this.state.inProgress.currentIndex || 0;
        this.sessionAnswers = this.state.inProgress.answers || [];
      } else {
        this.currentIndex = 0;
        this.sessionAnswers = [];
      }

      this.dom.gameModeLabel.textContent = isCurrent ? `Today (${dateStr})` : `Vault (${dateStr})`;
      this.showView('gameView');
      this.renderQuestion();
    }

    renderQuestion() {
      const q = this.activeRound.questions[this.currentIndex];
      this.selectedAnswer = null;

      this.dom.questionText.textContent = q.question;
      this.dom.explanationPanel.classList.add('hidden');
      this.dom.optionsContainer.innerHTML = '';
      this.updateStepper();

      const labels = ['A', 'B', 'C', 'D'];
      q.options.forEach((text, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.innerHTML = `<span class="option-key">${labels[idx]}</span><span>${text}</span>`;
        btn.addEventListener('click', () => this.selectOption(idx));
        this.dom.optionsContainer.appendChild(btn);
      });

      const isLast = (this.currentIndex === this.activeRound.questions.length - 1);
      this.dom.nextQuestionBtn.textContent = isLast ? 'Complete Match' : 'Next Question';
    }

    updateStepper() {
      this.dom.stepperTrack.innerHTML = '';
      this.activeRound.questions.forEach((_, idx) => {
        const pip = document.createElement('div');
        pip.className = 'step-pip';
        pip.textContent = idx + 1;
        pip.setAttribute('aria-label', `Question ${idx + 1}`);

        if (idx === this.currentIndex) {
          pip.classList.add('current');
        } else if (idx < this.sessionAnswers.length) {
          const correct = this.sessionAnswers[idx].isCorrect;
          pip.classList.add(correct ? 'correct' : 'incorrect');
        }
        this.dom.stepperTrack.appendChild(pip);
      });
    }

    selectOption(idx) {
      if (this.selectedAnswer !== null) return;
      this.selectedAnswer = idx;

      const q = this.activeRound.questions[this.currentIndex];
      const isCorrect = (idx === q.answerIndex);
      this.sessionAnswers.push({ chosen: idx, isCorrect });

      if (isCorrect) {
        this.sound.correct();
        this.dom.answerIndicator.textContent = '✓ Shot Made';
        this.dom.answerIndicator.className = 'answer-badge correct';
      } else {
        this.sound.incorrect();
        this.dom.answerIndicator.textContent = '✕ Miss';
        this.dom.answerIndicator.className = 'answer-badge incorrect';
      }

      const buttons = this.dom.optionsContainer.querySelectorAll('.option-btn');
      buttons.forEach((btn, bIdx) => {
        btn.disabled = true;
        if (bIdx === q.answerIndex) {
          btn.classList.add('correct');
        } else if (bIdx === idx && !isCorrect) {
          btn.classList.add('incorrect');
        }
        if (bIdx === idx) {
          btn.setAttribute('aria-checked', 'true');
        }
      });

      this.dom.explanationText.textContent = q.explanation || 'No coach notes provided.';
      this.dom.explanationPanel.classList.remove('hidden');
      this.updateStepper();

      if (this.activeRound.date === this.currentDate) {
        this.state.inProgress = {
          date: this.currentDate,
          currentIndex: this.currentIndex,
          answers: this.sessionAnswers
        };
        Storage.save(this.state);
      }

      this.dom.nextQuestionBtn.focus();
    }

    handleNextQuestion() {
      if (this.isReview) {
        if (this.currentIndex < this.activeRound.questions.length - 1) {
          this.currentIndex++;
          this.renderReviewQuestion();
        } else {
          this.showView('resultsView');
        }
        return;
      }

      if (this.currentIndex < this.activeRound.questions.length - 1) {
        this.currentIndex++;
        if (this.activeRound.date === this.currentDate && this.state.inProgress) {
          this.state.inProgress.currentIndex = this.currentIndex;
          Storage.save(this.state);
        }
        this.renderQuestion();
      } else {
        this.finishRound();
      }
    }

    finishRound() {
      const score = this.sessionAnswers.filter(a => a.isCorrect).length;
      const isCurrent = (this.activeRound.date === this.currentDate);

      if (isCurrent) {
        if (this.state.lastCompletedDate) {
          const last = new Date(this.state.lastCompletedDate);
          const curr = new Date(this.currentDate);
          const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            this.state.streak = (this.state.streak || 0) + 1;
          } else if (diffDays > 1) {
            this.state.streak = 1;
          }
        } else {
          this.state.streak = 1;
        }
        this.state.lastCompletedDate = this.currentDate;
        this.state.inProgress = null;
      }

      this.state.history[this.activeRound.date] = {
        completed: true,
        score: score,
        answers: this.sessionAnswers
      };
      Storage.save(this.state);

      this.sound.complete();
      this.showResults(score);
    }

    showResults(score) {
      this.showView('resultsView');
      const total = this.sessionAnswers.length;
      this.dom.scoreValue.textContent = score;
      this.dom.scoreTotal.textContent = `/ ${total}`;

      this.dom.resultsBreakdown.innerHTML = '';
      this.sessionAnswers.forEach((ans, idx) => {
        const pip = document.createElement('div');
        pip.className = `result-pip ${ans.isCorrect ? 'correct' : 'incorrect'}`;
        pip.textContent = ans.isCorrect ? '✓' : '✕';
        pip.setAttribute('aria-label', `End ${idx + 1}: ${ans.isCorrect ? 'Made' : 'Miss'}`);
        this.dom.resultsBreakdown.appendChild(pip);
      });
    }

    startReview() {
      this.isReview = true;
      this.currentIndex = 0;
      this.showView('gameView');
      this.renderReviewQuestion();
    }

    renderReviewQuestion() {
      const q = this.activeRound.questions[this.currentIndex];
      const ans = this.sessionAnswers[this.currentIndex] || { chosen: -1, isCorrect: false };
      this.updateStepper();

      this.dom.questionText.textContent = q.question;
      this.dom.optionsContainer.innerHTML = '';
      const labels = ['A', 'B', 'C', 'D'];

      q.options.forEach((text, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.disabled = true;
        if (idx === q.answerIndex) {
          btn.classList.add('correct');
        } else if (idx === ans.chosen && !ans.isCorrect) {
          btn.classList.add('incorrect');
        }
        btn.innerHTML = `<span class="option-key">${labels[idx]}</span><span>${text}</span>`;
        this.dom.optionsContainer.appendChild(btn);
      });

      if (ans.isCorrect) {
        this.dom.answerIndicator.textContent = '✓ Shot Made';
        this.dom.answerIndicator.className = 'answer-badge correct';
      } else {
        this.dom.answerIndicator.textContent = '✕ Miss';
        this.dom.answerIndicator.className = 'answer-badge incorrect';
      }

      this.dom.explanationText.textContent = q.explanation || 'No coach notes provided.';
      this.dom.explanationPanel.classList.remove('hidden');

      const isLast = (this.currentIndex === this.activeRound.questions.length - 1);
      this.dom.nextQuestionBtn.textContent = isLast ? 'Return to Results' : 'Next Question';
    }

    renderVault() {
      this.showView('vaultView');
      this.dom.vaultList.innerHTML = '';

      if (this.vaultDates.length === 0) {
        this.dom.vaultEmptyMsg.classList.remove('hidden');
        return;
      }
      this.dom.vaultEmptyMsg.classList.add('hidden');

      this.vaultDates.forEach(dateStr => {
        const item = document.createElement('div');
        item.className = 'vault-item';
        item.setAttribute('role', 'listitem');
        item.tabIndex = 0;

        const hist = this.state.history[dateStr];
        const isDone = hist && hist.completed;

        item.innerHTML = `
          <span class="vault-date">${dateStr}</span>
          <span class="badge ${isDone ? 'completed' : ''}">
            ${isDone ? `Score: ${hist.score}/${hist.answers.length}` : 'Play'}
          </span>
        `;

        const playAction = () => {
          this.sound.tap();
          this.startRound(dateStr);
        };

        item.addEventListener('click', playAction);
        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            playAction();
          }
        });

        this.dom.vaultList.appendChild(item);
      });
    }

    shareResults() {
      const score = this.sessionAnswers.filter(a => a.isCorrect).length;
      const total = this.sessionAnswers.length;
      // Red and Yellow curling stone emojis in results sharing
      const icons = this.sessionAnswers.map(a => a.isCorrect ? '🔴' : '🟡').join('');
      const text = `Daily Quiz (Curling Sheet) • ${this.activeRound.date}\nScore: ${score}/${total}\n${icons}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => this.showToast('Match record copied to clipboard!'))
          .catch(() => this.showToast('Unable to copy record.'));
      } else {
        this.showToast('Sharing not supported on this browser.');
      }
    }

    showToast(msg) {
      this.dom.toastMessage.textContent = msg;
      this.dom.toastMessage.classList.add('visible');
      setTimeout(() => this.dom.toastMessage.classList.remove('visible'), 2200);
    }
  }

  document.addEventListener('DOMContentLoaded', () => new UniversalQuiz());
})();