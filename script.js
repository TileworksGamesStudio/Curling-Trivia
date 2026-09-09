/**
 * CURLING PUZZLES: TRIVIA ENGINE & CONTINUITY RUNTIME
 * Continuity Standard: Day 0 = 8 September 2026. Day 1 = 9 September 2026.
 * Features:
 * - HTML5 Canvas 2D Granite Collision Physics Engine (Accumulator Timestep)
 * - Manufactured Curling Stone Rendering (Contact Shadow, Granite Body, Micro-lip, 3D Handle)
 * - Web Audio API Procedural Granite Synthesizer
 * - Ambient Rink Density Switching (Quieter Gameplay vs. Richer Menu)
 * - Future Puzzle Protection & Versioned LocalStorage Persistence
 * - Full Screen-Reader & Keyboard Accessibility
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. DATE SCHEDULING ENGINE & CONTINUITY BASELINE
     ========================================================================== */
  const EPOCH_YEAR = 2026;
  const EPOCH_MONTH = 8; // September (0-indexed)
  const EPOCH_DAY = 8;
  const EPOCH_TIMESTAMP = Date.UTC(EPOCH_YEAR, EPOCH_MONTH, EPOCH_DAY, 0, 0, 0);

  const STORAGE_VERSION = 'v3.0';
  const STORAGE_KEYS = {
    SOUND: `curling_trivia_sound_${STORAGE_VERSION}`,
    STATE: `curling_trivia_state_${STORAGE_VERSION}`,
    STATS: `curling_trivia_stats_${STORAGE_VERSION}`
  };

  function getCurrentDayIndex() {
    const now = new Date();
    const currentUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0);
    const diffDays = Math.floor((currentUTC - EPOCH_TIMESTAMP) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0;
  }

  function getFormattedDate(dayIndex) {
    const target = new Date(EPOCH_TIMESTAMP + dayIndex * 86400000);
    return target.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  /* ==========================================================================
     2. PROCEDURAL SOUND SYNTHESIZER (Web Audio API)
     ========================================================================== */
  class CurlingAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.initFromStorage();
    }

    initFromStorage() {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
      this.enabled = saved !== null ? saved === 'true' : true;
    }

    toggle() {
      this.enabled = !this.enabled;
      try {
        localStorage.setItem(STORAGE_KEYS.SOUND, this.enabled.toString());
      } catch (e) {
        console.warn('Storage error', e);
      }
      return this.enabled;
    }

    ensureContext() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playGraniteClack(volume = 0.2) {
      if (!this.enabled) return;
      this.ensureContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Dual frequencies simulate solid granite density
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(680, t);
      osc1.frequency.exponentialRampToValueAtTime(240, t + 0.06);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(950, t);
      osc2.frequency.exponentialRampToValueAtTime(320, t + 0.05);

      gain.gain.setValueAtTime(Math.min(0.28, Math.max(0.04, volume)), t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.08);
      osc2.stop(t + 0.08);
    }

    playSelect() {
      if (!this.enabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(580, t + 0.04);

      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    }

    playCorrect() {
      if (!this.enabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const triad = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

      triad.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.05);
        gain.gain.setValueAtTime(0.12, t + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.05);
        osc.stop(t + i * 0.05 + 0.3);
      });
    }

    playIncorrect() {
      if (!this.enabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.16);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.19);
    }

    playComplete() {
      if (!this.enabled) return;
      this.ensureContext();
      if (!this.ctx) return;
      const chord = [523.25, 659.25, 783.99, 1046.5];
      const t = this.ctx.currentTime;
      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + i * 0.06);
        gain.gain.setValueAtTime(0.11, t + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.52);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.06);
        osc.stop(t + i * 0.06 + 0.54);
      });
    }
  }

  /* ==========================================================================
     3. AUTHENTIC CURLING PHYSICS & CANVAS RENDERER
     ========================================================================== */
  class CurlingBackground {
    constructor(audioSys) {
      this.audio = audioSys;
      this.canvas = document.getElementById('curling-bg-canvas');
      this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
      this.stones = [];
      this.running = true;
      this.mode = 'menu'; // 'menu' | 'game'
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Fixed timestep accumulator parameters
      this.lastTime = performance.now();
      this.accumulator = 0;
      this.fixedDelta = 1000 / 60; // 60Hz physics

      // Ambient takeout launch counter
      this.nextTakeoutTime = performance.now() + 18000;

      if (this.canvas && this.ctx) {
        this.resize();
        window.addEventListener('resize', () => this.resize(), { passive: true });
        this.initStones();
        if (!this.reducedMotion) {
          requestAnimationFrame((t) => this.loop(t));
        } else {
          this.draw();
        }
      }
    }

    setMode(mode) {
      this.mode = mode;
      // In game mode, slow down stones and keep fewer active for low distraction
      this.stones.forEach((s, idx) => {
        if (mode === 'game' && idx >= 3) {
          s.active = false;
        } else {
          s.active = true;
        }
      });
    }

    resize() {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    }

    initStones() {
      const isNarrow = this.width < 600;
      const count = isNarrow ? 5 : 7;
      this.stones = [];

      for (let i = 0; i < count; i++) {
        const radius = isNarrow ? 22 : 28;
        const isYellow = (i % 2 === 0);
        this.stones.push({
          x: (this.width / (count + 1)) * (i + 1),
          y: Math.random() * (this.height - radius * 4) + radius * 2,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: radius,
          mass: radius * radius,
          team: isYellow ? 'yellow' : 'red',
          handleColor: isYellow ? '#f0c647' : '#d63b3b',
          handleTrim: isYellow ? '#d8aa32' : '#b92e34',
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.005,
          active: true
        });
      }
    }

    loop(currentTime) {
      if (!this.running) return;
      const frameDelta = Math.min(currentTime - this.lastTime, 100);
      this.lastTime = currentTime;
      this.accumulator += frameDelta;

      while (this.accumulator >= this.fixedDelta) {
        this.stepPhysics(this.fixedDelta / 1000);
        this.accumulator -= this.fixedDelta;
      }

      // Check infrequent ambient high-speed delivery
      if (currentTime > this.nextTakeoutTime && this.mode === 'menu') {
        this.triggerTakeoutEvent();
        this.nextTakeoutTime = currentTime + 22000 + Math.random() * 14000;
      }

      this.draw();
      requestAnimationFrame((t) => this.loop(t));
    }

    triggerTakeoutEvent() {
      const activeStones = this.stones.filter(s => s.active);
      if (activeStones.length === 0) return;
      const target = activeStones[Math.floor(Math.random() * activeStones.length)];
      target.vx = (Math.random() > 0.5 ? 1 : -1) * (1.6 + Math.random() * 0.8);
      target.vy = (Math.random() - 0.5) * 1.2;
      target.spin = (Math.random() - 0.5) * 0.02;
    }

    stepPhysics(dt) {
      const activeStones = this.stones.filter(s => s.active);
      const count = activeStones.length;
      const speedScale = (this.mode === 'game') ? 0.6 : 1.0;

      // 1. Position & Ice Pebble Friction
      for (let i = 0; i < count; i++) {
        const s = activeStones[i];
        s.x += s.vx * speedScale;
        s.y += s.vy * speedScale;
        s.angle += s.spin;

        // Subtle friction deceleration modeled after curling ice
        s.vx *= 0.9994;
        s.vy *= 0.9994;

        // Keep minimum gentle drift in menu
        const currentSpeed = Math.hypot(s.vx, s.vy);
        if (currentSpeed < 0.12 && this.mode === 'menu') {
          s.vx += (Math.random() - 0.5) * 0.03;
          s.vy += (Math.random() - 0.5) * 0.03;
        }

        // Cushion boundary rebound
        if (s.x - s.radius < 0) {
          s.x = s.radius;
          s.vx = Math.abs(s.vx);
        } else if (s.x + s.radius > this.width) {
          s.x = this.width - s.radius;
          s.vx = -Math.abs(s.vx);
        }

        if (s.y - s.radius < 0) {
          s.y = s.radius;
          s.vy = Math.abs(s.vy);
        } else if (s.y + s.radius > this.height) {
          s.y = this.height - s.radius;
          s.vy = -Math.abs(s.vy);
        }
      }

      // 2. Pairwise Collision & Momentum Transfer
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          const a = activeStones[i];
          const b = activeStones[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const minDist = a.radius + b.radius;

          if (dist < minDist && dist > 0) {
            const nx = dx / dist;
            const ny = dy / dist;

            // Positional penetration resolution (anti-sticking)
            const overlap = (minDist - dist) * 0.5;
            a.x -= nx * overlap;
            a.y -= ny * overlap;
            b.x += nx * overlap;
            b.y += ny * overlap;

            // Elastic collision with natural granite restitution
            const kx = a.vx - b.vx;
            const ky = a.vy - b.vy;
            const impulse = 2 * (nx * kx + ny * ky) / (a.mass + b.mass);
            const restitution = 0.76;

            a.vx -= impulse * b.mass * nx * restitution;
            a.vy -= impulse * b.mass * ny * restitution;
            b.vx += impulse * a.mass * nx * restitution;
            b.vy += impulse * a.mass * ny * restitution;

            // Impact audio
            const impactRelSpeed = Math.abs(impulse);
            if (impactRelSpeed > 0.15) {
              this.audio.playGraniteClack(Math.min(0.25, impactRelSpeed * 0.3));
            }
          }
        }
      }
    }

    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.drawRinkMarkings();

      const activeStones = this.stones.filter(s => s.active);
      for (let i = 0; i < activeStones.length; i++) {
        this.drawCurlingStone(activeStones[i]);
      }
    }

    drawRinkMarkings() {
      const cx = this.width * 0.5;
      const cy = this.height * 0.44;
      const baseR = Math.min(this.width, this.height) * 0.44;

      this.ctx.save();
      this.ctx.lineWidth = 1.8;

      // 12-foot Outer Blue House Ring
      this.ctx.strokeStyle = 'rgba(21, 59, 93, 0.12)';
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      this.ctx.stroke();

      // 8-foot White Ring Division
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, baseR * 0.66, 0, Math.PI * 2);
      this.ctx.stroke();

      // 4-foot Inner Red Ring
      this.ctx.strokeStyle = 'rgba(214, 59, 59, 0.12)';
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, baseR * 0.33, 0, Math.PI * 2);
      this.ctx.stroke();

      // Centre Line & Tee Line
      this.ctx.strokeStyle = 'rgba(21, 59, 93, 0.09)';
      this.ctx.beginPath();
      this.ctx.moveTo(cx, 0);
      this.ctx.lineTo(cx, this.height);
      this.ctx.moveTo(0, cy);
      this.ctx.lineTo(this.width, cy);
      this.ctx.stroke();

      this.ctx.restore();
    }

    drawCurlingStone(s) {
      this.ctx.save();
      this.ctx.translate(s.x, s.y);
      this.ctx.rotate(s.angle);

      // 1. Soft Ice Contact Shadow
      this.ctx.beginPath();
      this.ctx.ellipse(2, 6, s.radius * 0.96, s.radius * 0.88, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(16, 47, 74, 0.18)';
      this.ctx.fill();

      // 2. Granite Stone Body Outer Bevel
      const bodyGrad = this.ctx.createRadialGradient(-s.radius * 0.3, -s.radius * 0.3, s.radius * 0.1, 0, 0, s.radius);
      bodyGrad.addColorStop(0, '#e2e8f0');
      bodyGrad.addColorStop(0.35, '#94a3b8');
      bodyGrad.addColorStop(0.78, '#475569');
      bodyGrad.addColorStop(1, '#1e293b');

      this.ctx.beginPath();
      this.ctx.arc(0, 0, s.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = bodyGrad;
      this.ctx.fill();
      this.ctx.lineWidth = 1.5;
      this.ctx.strokeStyle = 'rgba(16, 47, 74, 0.4)';
      this.ctx.stroke();

      // 3. Striking Band Matte Ring
      this.ctx.beginPath();
      this.ctx.arc(0, 0, s.radius * 0.85, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      this.ctx.lineWidth = 1.2;
      this.ctx.stroke();

      // 4. Granite Top Lip Cup Recess
      const cupGrad = this.ctx.createRadialGradient(0, 0, 1, 0, 0, s.radius * 0.65);
      cupGrad.addColorStop(0, '#64748b');
      cupGrad.addColorStop(1, '#334155');

      this.ctx.beginPath();
      this.ctx.arc(0, 0, s.radius * 0.62, 0, Math.PI * 2);
      this.ctx.fillStyle = cupGrad;
      this.ctx.fill();

      // 5. Handle Base Flange
      this.ctx.beginPath();
      this.ctx.arc(0, 0, s.radius * 0.28, 0, Math.PI * 2);
      this.ctx.fillStyle = '#1e293b';
      this.ctx.fill();

      // 6. Gooseneck Curling Handle
      const hLength = s.radius * 0.88;
      const hWidth = s.radius * 0.22;

      // Handle Shadow onto stone
      this.ctx.beginPath();
      this.ctx.roundRect(-hLength * 0.48, -hWidth * 0.4 + 2.5, hLength, hWidth, 4);
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      this.ctx.fill();

      // Handle Colored Grip Bar
      this.ctx.beginPath();
      this.ctx.roundRect(-hLength * 0.5, -hWidth * 0.5, hLength, hWidth, 4);
      this.ctx.fillStyle = s.handleColor;
      this.ctx.fill();
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = s.handleTrim;
      this.ctx.stroke();

      // Central Mount Bolt
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = '#f8fafc';
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  /* ==========================================================================
     4. PERSISTENCE & STATS STORE
     ========================================================================== */
  class Store {
    static getStats() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.STATS);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.warn('Error reading stats', e);
      }
      return { played: 0, won: 0, streak: 0, maxStreak: 0, totalCorrect: 0 };
    }

    static saveStats(stats) {
      try {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
      } catch (e) {
        console.warn('Error saving stats', e);
      }
    }

    static getPuzzleState(dayIndex) {
      try {
        const raw = localStorage.getItem(`${STORAGE_KEYS.STATE}_day_${dayIndex}`);
        if (raw) return JSON.parse(raw);
      } catch (e) {
        console.warn('Error reading state', e);
      }
      return null;
    }

    static savePuzzleState(dayIndex, state) {
      try {
        localStorage.setItem(`${STORAGE_KEYS.STATE}_day_${dayIndex}`, JSON.stringify(state));
      } catch (e) {
        console.warn('Error saving state', e);
      }
    }

    static clearPuzzleState(dayIndex) {
      try {
        localStorage.removeItem(`${STORAGE_KEYS.STATE}_day_${dayIndex}`);
      } catch (e) {
        console.warn('Error clearing state', e);
      }
    }
  }

  /* ==========================================================================
     5. TRIVIA APPLICATION CONTROLLER
     ========================================================================== */
  class TriviaApp {
    constructor() {
      this.audio = new CurlingAudio();
      this.bg = new CurlingBackground(this.audio);

      this.currentTodayDay = getCurrentDayIndex();
      this.activeMatchDay = this.currentTodayDay;
      this.activePuzzleData = null;
      this.activeQuestionIdx = 0;
      this.userAnswers = [];
      this.isMatchCompleted = false;

      this.cacheDom();
      this.bindEvents();
      this.hideResultsModal();
      this.initView();
      this.updateStatsUI();
    }

    cacheDom() {
      this.screenMenu = document.getElementById('screen-menu');
      this.screenGame = document.getElementById('screen-game');
      this.screenVault = document.getElementById('screen-vault');
      this.resultsModal = document.getElementById('results-modal');
      this.srAnnouncer = document.getElementById('sr-announcer');

      this.headerBackBtn = document.getElementById('header-back-btn');
      this.soundBtn = document.getElementById('sound-btn');
      this.soundIconOn = document.getElementById('sound-icon-on');
      this.soundIconOff = document.getElementById('sound-icon-off');
      this.soundLabel = document.getElementById('sound-label');

      this.menuTodayDate = document.getElementById('menu-today-date');
      this.todayHeading = document.getElementById('today-heading');
      this.menuTodayStatus = document.getElementById('menu-today-status');
      this.playTodayBtn = document.getElementById('play-today-btn');
      this.openVaultBtn = document.getElementById('open-vault-btn');

      this.statPlayed = document.getElementById('stats-played');
      this.statAccuracy = document.getElementById('stats-accuracy');
      this.statStreak = document.getElementById('stats-streak');

      this.gameDayLabel = document.getElementById('game-day-label');
      this.gameCategoryTag = document.getElementById('game-category-tag');
      this.endsTracker = document.getElementById('ends-tracker');
      this.questionStepLabel = document.getElementById('question-step-label');
      this.questionDifficultyLabel = document.getElementById('question-difficulty-label');
      this.questionText = document.getElementById('trivia-question-text');
      this.optionsGroup = document.getElementById('options-group');
      this.optionButtons = Array.from(this.optionsGroup.querySelectorAll('.option-btn'));

      this.explanationCard = document.getElementById('explanation-card');
      this.explanationResultTag = document.getElementById('explanation-result-tag');
      this.explanationBodyText = document.getElementById('explanation-body-text');
      this.nextQuestionBtn = document.getElementById('next-question-btn');
      this.nextBtnText = document.getElementById('next-btn-text');

      this.vaultItemsList = document.getElementById('vault-items-list');

      this.resultsTitle = document.getElementById('results-title');
      this.resultsSubtitle = document.getElementById('results-subtitle');
      this.resultsStoneRow = document.getElementById('results-stone-row');
      this.shareResultsBtn = document.getElementById('share-results-btn');
      this.shareBtnText = document.getElementById('share-btn-text');
      this.resultsReplayBtn = document.getElementById('results-replay-btn');
      this.resultsMenuBtn = document.getElementById('results-menu-btn');
    }

    bindEvents() {
      this.soundBtn.addEventListener('click', () => {
        const enabled = this.audio.toggle();
        this.updateSoundButtonUI(enabled);
      });

      this.headerBackBtn.addEventListener('click', () => this.showScreen('menu'));
      this.playTodayBtn.addEventListener('click', () => this.startMatch(this.currentTodayDay));
      this.openVaultBtn.addEventListener('click', () => this.showVault());

      this.optionButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index, 10);
          this.handleOptionSelect(idx);
        });
      });

      this.nextQuestionBtn.addEventListener('click', () => this.advanceNextQuestion());

      this.resultsMenuBtn.addEventListener('click', () => {
        this.hideResultsModal();
        this.showScreen('menu');
      });

      this.resultsReplayBtn.addEventListener('click', () => {
        this.hideResultsModal();
        Store.clearPuzzleState(this.activeMatchDay);
        this.startMatch(this.activeMatchDay);
      });

      this.shareResultsBtn.addEventListener('click', () => this.shareScore());

      // Keyboard Accessibility
      window.addEventListener('keydown', (e) => {
        if (this.screenGame.classList.contains('active') && !this.resultsModal.classList.contains('is-open')) {
          const key = e.key.toUpperCase();
          if (['A', '1'].includes(key)) this.handleOptionSelect(0);
          else if (['B', '2'].includes(key)) this.handleOptionSelect(1);
          else if (['C', '3'].includes(key)) this.handleOptionSelect(2);
          else if (['D', '4'].includes(key)) this.handleOptionSelect(3);
          else if ((e.key === 'Enter' || e.key === ' ') && !this.explanationCard.hidden) {
            this.advanceNextQuestion();
          }
        } else if (this.resultsModal.classList.contains('is-open') && e.key === 'Escape') {
          this.hideResultsModal();
          this.showScreen('menu');
        }
      });
    }

    announce(text) {
      if (this.srAnnouncer) {
        this.srAnnouncer.textContent = '';
        setTimeout(() => { this.srAnnouncer.textContent = text; }, 50);
      }
    }

    updateSoundButtonUI(enabled) {
      this.soundIconOn.hidden = !enabled;
      this.soundIconOff.hidden = enabled;
      this.soundLabel.textContent = enabled ? 'Sound: ON' : 'Sound: OFF';
      this.soundBtn.setAttribute('aria-pressed', enabled.toString());
    }

    initView() {
      this.updateSoundButtonUI(this.audio.enabled);
      this.menuTodayDate.textContent = getFormattedDate(this.currentTodayDay);
      this.todayHeading.textContent = `Daily Match #${this.currentTodayDay}`;

      const state = Store.getPuzzleState(this.currentTodayDay);
      if (state && state.completed) {
        this.menuTodayStatus.textContent = `Completed (${state.score}/5)`;
        this.menuTodayStatus.style.color = 'var(--curling-green-base)';
        this.playTodayBtn.querySelector('.btn-text').textContent = 'Review Match';
      } else if (state && state.answers && state.answers.length > 0) {
        this.menuTodayStatus.textContent = `In Progress (${state.answers.length}/5)`;
        this.menuTodayStatus.style.color = '#b45309';
        this.playTodayBtn.querySelector('.btn-text').textContent = 'Continue Match';
      } else {
        this.menuTodayStatus.textContent = 'Not Played';
        this.menuTodayStatus.style.color = '#b45309';
        this.playTodayBtn.querySelector('.btn-text').textContent = 'Play Today';
      }
    }

    updateStatsUI() {
      const stats = Store.getStats();
      this.statPlayed.textContent = stats.played;
      const accuracy = stats.played > 0 ? Math.round((stats.totalCorrect / (stats.played * 5)) * 100) : 0;
      this.statAccuracy.textContent = `${accuracy}%`;
      this.statStreak.textContent = stats.streak;
    }

    showScreen(name) {
      this.hideResultsModal();

      this.screenMenu.classList.remove('active');
      this.screenGame.classList.remove('active');
      this.screenVault.classList.remove('active');

      this.screenMenu.hidden = true;
      this.screenGame.hidden = true;
      this.screenVault.hidden = true;
      this.headerBackBtn.hidden = (name === 'menu');

      if (name === 'menu') {
        this.bg.setMode('menu');
        this.screenMenu.classList.add('active');
        this.screenMenu.hidden = false;
        this.initView();
        this.updateStatsUI();
      } else if (name === 'game') {
        this.bg.setMode('game');
        this.screenGame.classList.add('active');
        this.screenGame.hidden = false;
      } else if (name === 'vault') {
        this.bg.setMode('menu');
        this.screenVault.classList.add('active');
        this.screenVault.hidden = false;
      }
    }

    hideResultsModal() {
      this.resultsModal.hidden = true;
      this.resultsModal.classList.remove('is-open');
    }

    showResultsModal() {
      const score = this.calculateScore();
      this.resultsTitle.textContent = score === 5 ? 'Perfect 5-End Match!' : score >= 3 ? 'Handshake Victory!' : 'Match Over';
      this.resultsSubtitle.textContent = `You scored ${score} out of 5 button shots on Match #${this.activeMatchDay}.`;

      this.resultsStoneRow.innerHTML = '';
      this.userAnswers.forEach((ans, i) => {
        const right = (ans === this.activePuzzleData.questions[i].correctIndex);
        const pill = document.createElement('div');
        pill.className = `result-stone-pill ${right ? 'win' : 'miss'}`;
        pill.textContent = right ? '●' : '✕';
        pill.setAttribute('aria-label', `End ${i + 1}: ${right ? 'Correct' : 'Missed'}`);
        this.resultsStoneRow.appendChild(pill);
      });

      this.resultsModal.hidden = false;
      this.resultsModal.classList.add('is-open');
      this.announce(`Match complete. Score: ${score} of 5.`);
    }

    /* ==========================================================================
       6. GAMEPLAY ENGINE & FUTURE PROTECTION
       ========================================================================== */
    startMatch(requestedDay) {
      // Future puzzle protection: players cannot open future dates
      let dayIndex = requestedDay;
      if (dayIndex > this.currentTodayDay) {
        dayIndex = this.currentTodayDay;
      }

      this.activeMatchDay = dayIndex;
      const library = window.CURLING_TRIVIA_PUZZLES || [];
      if (library.length === 0) {
        alert('Curling trivia questions failed to load.');
        return;
      }

      const matched = library.find(p => p.dayIndex === dayIndex) || library[dayIndex % library.length];
      this.activePuzzleData = matched;

      const saved = Store.getPuzzleState(dayIndex);
      if (saved) {
        this.userAnswers = saved.answers || [];
        this.isMatchCompleted = !!saved.completed;
      } else {
        this.userAnswers = [];
        this.isMatchCompleted = false;
      }

      this.activeQuestionIdx = this.userAnswers.length < 5 ? this.userAnswers.length : 0;
      this.gameDayLabel.textContent = (dayIndex === this.currentTodayDay) ? 'Today' : `Match #${dayIndex}`;
      this.showScreen('game');
      this.renderCurrentQuestion();
    }

    renderCurrentQuestion() {
      const q = this.activePuzzleData.questions[this.activeQuestionIdx];
      this.gameCategoryTag.textContent = q.category || 'Curling Rules';
      this.questionStepLabel.textContent = `End ${this.activeQuestionIdx + 1} of 5`;
      this.questionDifficultyLabel.textContent = q.difficulty || 'Medium';
      this.questionText.textContent = q.prompt;

      const slots = this.endsTracker.querySelectorAll('.end-stone-slot');
      slots.forEach((slot, i) => {
        slot.classList.remove('current', 'correct', 'incorrect');
        if (i === this.activeQuestionIdx) slot.classList.add('current');
        if (i < this.userAnswers.length) {
          const isRight = this.userAnswers[i] === this.activePuzzleData.questions[i].correctIndex;
          slot.classList.add(isRight ? 'correct' : 'incorrect');
        }
      });

      const answeredThis = this.userAnswers.length > this.activeQuestionIdx;
      this.optionButtons.forEach((btn, idx) => {
        btn.disabled = answeredThis;
        btn.classList.remove('is-correct', 'is-incorrect');
        btn.querySelector('.choice-text').textContent = q.options[idx];
        btn.querySelector('.feedback-icon').textContent = '';

        if (answeredThis) {
          const userChoice = this.userAnswers[this.activeQuestionIdx];
          if (idx === q.correctIndex) {
            btn.classList.add('is-correct');
            btn.querySelector('.feedback-icon').textContent = '✓';
          } else if (idx === userChoice) {
            btn.classList.add('is-incorrect');
            btn.querySelector('.feedback-icon').textContent = '✕';
          }
        }
      });

      if (answeredThis) {
        this.showExplanation(q, this.userAnswers[this.activeQuestionIdx]);
      } else {
        this.explanationCard.hidden = true;
      }

      this.announce(`End ${this.activeQuestionIdx + 1}: ${q.prompt}`);
    }

    handleOptionSelect(choiceIdx) {
      if (this.userAnswers.length > this.activeQuestionIdx) return;

      const q = this.activePuzzleData.questions[this.activeQuestionIdx];
      const isCorrect = (choiceIdx === q.correctIndex);
      this.userAnswers.push(choiceIdx);

      if (isCorrect) {
        this.audio.playCorrect();
      } else {
        this.audio.playIncorrect();
      }

      this.optionButtons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === q.correctIndex) {
          btn.classList.add('is-correct');
          btn.querySelector('.feedback-icon').textContent = '✓';
        } else if (idx === choiceIdx) {
          btn.classList.add('is-incorrect');
          btn.querySelector('.feedback-icon').textContent = '✕';
        }
      });

      const slots = this.endsTracker.querySelectorAll('.end-stone-slot');
      slots[this.activeQuestionIdx].classList.remove('current');
      slots[this.activeQuestionIdx].classList.add(isCorrect ? 'correct' : 'incorrect');

      const isComplete = this.userAnswers.length === 5;
      const score = this.calculateScore();
      Store.savePuzzleState(this.activeMatchDay, {
        answers: this.userAnswers,
        completed: isComplete,
        score: score
      });

      if (isComplete && !this.isMatchCompleted) {
        this.isMatchCompleted = true;
        this.updateStatsOnCompletion(score);
      }

      this.showExplanation(q, choiceIdx);
    }

    showExplanation(q, choiceIdx) {
      const isCorrect = choiceIdx === q.correctIndex;
      this.explanationResultTag.textContent = isCorrect ? 'Right on the Button! (+1)' : 'Swept Out of the House (Miss)';
      this.explanationResultTag.className = isCorrect ? 'result-tag-correct' : 'result-tag-incorrect';
      this.explanationBodyText.textContent = q.explanation || '';
      this.nextBtnText.textContent = (this.activeQuestionIdx < 4) ? 'Next End' : 'View Results';
      this.explanationCard.hidden = false;

      this.announce(`${isCorrect ? 'Correct' : 'Incorrect'}. ${q.explanation}`);
    }

    advanceNextQuestion() {
      this.audio.playSelect();
      if (this.activeQuestionIdx < 4) {
        this.activeQuestionIdx++;
        this.renderCurrentQuestion();
      } else {
        this.showResultsModal();
      }
    }

    calculateScore() {
      let score = 0;
      this.userAnswers.forEach((ans, i) => {
        if (ans === this.activePuzzleData.questions[i].correctIndex) score++;
      });
      return score;
    }

    updateStatsOnCompletion(score) {
      const stats = Store.getStats();
      stats.played += 1;
      stats.totalCorrect += score;
      if (score >= 3) {
        stats.won += 1;
        stats.streak += 1;
        if (stats.streak > stats.maxStreak) stats.maxStreak = stats.streak;
      } else {
        stats.streak = 0;
      }
      Store.saveStats(stats);
      this.updateStatsUI();
      this.audio.playComplete();
    }

    shareScore() {
      const score = this.calculateScore();
      const stones = this.userAnswers.map((ans, i) => {
        return ans === this.activePuzzleData.questions[i].correctIndex ? '🟡' : '🔴';
      }).join('');

      const shareText = `Curling Trivia Match #${this.activeMatchDay} — ${score}/5\n${stones}\nhttps://tileworksgamesstudio.github.io/Curling-Menu/`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareText).then(() => {
          this.shareBtnText.textContent = 'Copied to Clipboard!';
          setTimeout(() => { this.shareBtnText.textContent = 'Share Score'; }, 2000);
        });
      } else {
        alert(shareText);
      }
    }

    /* ==========================================================================
       7. VAULT ARCHIVE
       ========================================================================== */
    showVault() {
      this.vaultItemsList.innerHTML = '';
      const library = window.CURLING_TRIVIA_PUZZLES || [];

      // Vault strictly contains released matches prior to today
      const released = library.filter(p => p.dayIndex < this.currentTodayDay);

      if (released.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'liquid-card';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.padding = '24px 16px';
        emptyMsg.innerHTML = `
          <p style="font-weight: 800; color: var(--blue-ink-deep); margin-bottom: 4px;">Vault Is Empty</p>
          <p style="font-size: 0.85rem; color: var(--blue-ink-muted);">Yesterday's match slides into the vault at midnight!</p>
        `;
        this.vaultItemsList.appendChild(emptyMsg);
      } else {
        released.slice().reverse().forEach(puzzle => {
          const item = document.createElement('div');
          item.className = 'vault-item-card';

          const state = Store.getPuzzleState(puzzle.dayIndex);
          const scoreText = state && state.completed ? `Score: ${state.score}/5` : 'Not Played';

          item.innerHTML = `
            <div class="vault-info">
              <span class="vault-item-day">Match #${puzzle.dayIndex}</span>
              <span class="vault-item-meta">${getFormattedDate(puzzle.dayIndex)} • 5 Ends</span>
              <span class="vault-score-badge">${scoreText}</span>
            </div>
            <button class="btn btn-secondary" style="min-height: 38px; padding: 0 14px; font-size: 0.85rem;">Play</button>
          `;

          item.querySelector('button').addEventListener('click', () => {
            this.startMatch(puzzle.dayIndex);
          });
          this.vaultItemsList.appendChild(item);
        });
      }

      this.showScreen('vault');
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    new TriviaApp();
  });
})();