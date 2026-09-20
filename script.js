/**
 * DAILY QUIZ — MASTER CANADIAN CURLING ICE HOUSE ENGINE
 * Championship Rink Simulation: Elevated House, Bottom-Launch Pre-Roll,
 * Strict Alternation, 95% Button Cluster Accuracy, 50% Light Curl,
 * and 9th-Cycle Board-Clearing Mega Take-Out.
 */
(function () {
  'use strict';

  const CONFIG = {
    csvPath: './puzzles.csv',
    storageKey: 'curling_universal_daily_quiz_state',
    storageVersion: 3,
    homeUrl: 'https://tileworksgamesstudio.github.io/Curling-Menu/',
    plusUrl: 'https://example.com/games',
    releaseTimeZone: 'Europe/London'
  };

  // --- AUDIO SYNTHESIZER (RINK & STONE CONTACT ACOUSTICS) ---
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
        // Fails safely if unsupported
      }
    }

    tap() { this.tone(360, 'triangle', 0.04, 0.06); }

    stoneImpact(power = 1) {
      if (!this.enabled) return;
      // Granitic contact low resonance
      this.tone(140 + Math.random() * 40, 'sine', 0.08 * power, 0.05 * power);
      this.tone(80, 'triangle', 0.12 * power, 0.07 * power);
    }

    correct() {
      this.tone(523.25, 'sine', 0.12, 0.10);
      setTimeout(() => this.tone(659.25, 'sine', 0.16, 0.10), 75);
    }

    incorrect() {
      this.tone(220, 'sawtooth', 0.18, 0.07);
    }

    complete() {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        setTimeout(() => this.tone(freq, 'sine', 0.18, 0.10), idx * 75);
      });
    }
  }

  // --- PERSISTENT STORAGE (DEFENSIVE & SCHEMA PRESERVING) ---
  const Storage = {
    load() {
      const fallback = {
        version: CONFIG.storageVersion,
        sound: true,
        backgroundAnimation: true,
        streak: 0,
        bestStreak: 0,
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
          version: CONFIG.storageVersion,
          sound: typeof parsed.sound === 'boolean' ? parsed.sound : true,
          backgroundAnimation: typeof parsed.backgroundAnimation === 'boolean' ? parsed.backgroundAnimation : true,
          streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
          bestStreak: typeof parsed.bestStreak === 'number' ? parsed.bestStreak : (parsed.streak || 0),
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
      } catch (e) {
        // Handled defensively
      }
    }
  };

  // --- RFC 4180 COMPLIANT CSV PARSER ---
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(field.trim());
        field = '';
      } else if ((char === '\n' || (char === '\r' && next === '\n')) && !inQuotes) {
        if (char === '\r') i++;
        row.push(field.trim());
        rows.push(row);
        row = [];
        field = '';
      } else {
        field += char;
      }
    }
    if (field || row.length > 0) {
      row.push(field.trim());
      rows.push(row);
    }

    if (rows.length < 2) throw new Error('Puzzle dataset is missing or invalid.');
    const headers = rows[0].map(h => h.toLowerCase());
    const records = [];

    for (let r = 1; r < rows.length; r++) {
      if (rows[r].length === 1 && rows[r][0] === '') continue;
      const item = {};
      headers.forEach((h, idx) => {
        item[h] = rows[r][idx] !== undefined ? rows[r][idx] : '';
      });
      records.push(item);
    }
    return records;
  }

  // --- AUTHORITATIVE TIME & UK RELEASE DATE RESOLUTION ---
  class ReleaseClock {
    constructor() {
      this.serverOffsetMs = 0;
      this.isSynchronized = false;
    }

    async sync() {
      try {
        const url = window.location.href.split('#')[0].split('?')[0] + '?_t=' + Date.now();
        const start = performance.now();
        const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
        const latency = (performance.now() - start) / 2;
        const dateHeader = res.headers.get('Date');

        if (dateHeader) {
          const serverTime = new Date(dateHeader).getTime() + latency;
          if (!isNaN(serverTime)) {
            this.serverOffsetMs = serverTime - Date.now();
            this.isSynchronized = true;
          }
        }
      } catch (e) {
        this.isSynchronized = false;
      }
    }

    getNow() {
      return new Date(Date.now() + this.serverOffsetMs);
    }

    getTodayUkDateString() {
      const now = this.getNow();
      try {
        const dtf = new Intl.DateTimeFormat('en-CA', {
          timeZone: CONFIG.releaseTimeZone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        return dtf.format(now);
      } catch (e) {
        return now.toISOString().split('T')[0];
      }
    }
  }

  function resolveAnswerIndex(letter) {
    const clean = String(letter).trim().toUpperCase();
    if (clean === 'A' || clean === '0') return 0;
    if (clean === 'B' || clean === '1') return 1;
    if (clean === 'C' || clean === '2') return 2;
    if (clean === 'D' || clean === '3') return 3;
    return 0;
  }

  // ==========================================================================
  // CANADIAN CURLING ICE HOUSE PHYSICS SIMULATION
  // Bottom-Launch, Elevated House, Strict Alternation, Button Convergence,
  // 9th-Cycle Multi-Rock Mega Take-Out, Persistent Sheet State
  // ==========================================================================
  class CurlingIceSimulation {
    constructor(canvas, soundManager, enabled = true) {
      this.canvas = canvas;
      this.ctx = canvas ? canvas.getContext('2d') : null;
      this.sound = soundManager;
      this.enabled = enabled;

      this.stones = [];
      this.shotCount = 0;
      this.activeStone = null;
      this.turnTimer = 0;
      this.animId = null;
      this.lastTime = 0;

      // House geometry calculated dynamically on resize
      this.house = {
        centerX: 0,
        centerY: 0,
        radius12Foot: 0,
        radius8Foot: 0,
        radius4Foot: 0,
        buttonRadius: 0
      };

      this.stoneRadius = 14;
      this.isBoardQuiescent = true;
      this.quiescenceTimer = 0;

      this.handleResize = this.resize.bind(this);
      window.addEventListener('resize', this.handleResize);

      if (this.canvas) {
        this.resize();
        this.start();
      }
    }

    resize() {
      if (!this.canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = this.canvas.clientWidth || window.innerWidth;
      const height = this.canvas.clientHeight || window.innerHeight;

      this.canvas.width = Math.floor(width * dpr);
      this.canvas.height = Math.floor(height * dpr);

      // Elevated House: positioned at ~40% of simulation height
      const simWidth = width;
      const simHeight = height;

      this.house.centerX = simWidth * 0.5;
      this.house.centerY = simHeight * 0.40;

      // Proportional house rings
      const minDim = Math.min(simWidth, simHeight);
      this.house.radius12Foot = minDim * 0.32;
      this.house.radius8Foot = this.house.radius12Foot * 0.66;
      this.house.radius4Foot = this.house.radius12Foot * 0.33;
      this.house.buttonRadius = this.house.radius12Foot * 0.085;

      // Uniform stone size
      this.stoneRadius = Math.max(12, Math.min(18, minDim * 0.038));
    }

    start() {
      if (this.animId) cancelAnimationFrame(this.animId);
      this.lastTime = performance.now();
      const loop = (now) => {
        const dt = Math.min((now - this.lastTime) / 1000, 0.05);
        this.lastTime = now;

        if (this.enabled) {
          this.update(dt);
          this.render();
        }

        this.animId = requestAnimationFrame(loop);
      };
      this.animId = requestAnimationFrame(loop);
    }

    stop() {
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    }

    setEnabled(val) {
      this.enabled = val;
      if (!val && this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    // --- TURN SCHEDULER & LAUNCH SAFETY ---
    update(dt) {
      // 1. Advance physical integration
      let boardMoving = false;
      const currentActive = this.activeStone;

      for (let i = this.stones.length - 1; i >= 0; i--) {
        const s = this.stones[i];
        this.updateStonePhysics(s, dt);

        if (s.isMoving) boardMoving = true;

        // Remove stones that genuinely exit visible sheet boundaries
        const outMargin = this.stoneRadius * 3;
        const simW = this.canvas.clientWidth;
        const simH = this.canvas.clientHeight;

        if (s.x < -outMargin || s.x > simW + outMargin || s.y < -outMargin || s.y > simH + (outMargin * 3)) {
          if (s === this.activeStone) this.activeStone = null;
          this.stones.splice(i, 1);
        }
      }

      // 2. Collision resolution (multi-contact support)
      this.resolveCollisions();

      // 3. Quiescence & Launch progression
      if (!boardMoving && (!currentActive || !currentActive.isMoving)) {
        this.quiescenceTimer += dt;
        if (this.quiescenceTimer > 0.45) {
          this.isBoardQuiescent = true;
        }
      } else {
        this.quiescenceTimer = 0;
        this.isBoardQuiescent = false;
      }

      // 4. Autonomous turn scheduler
      if (this.isBoardQuiescent) {
        this.turnTimer += dt;
        if (this.turnTimer > 1.2 || this.stones.length === 0) {
          this.turnTimer = 0;
          this.launchNextStone();
        }
      }
    }

    updateStonePhysics(stone, dt) {
      // Forward translation with ice friction
      const speed = Math.hypot(stone.vx, stone.vy);

      if (speed > 0.4) {
        stone.isMoving = true;
        stone.x += stone.vx * dt;
        stone.y += stone.vy * dt;

        // Continuous Curl generation: lateral acceleration derived from spin and speed
        const headingX = stone.vx / speed;
        const headingY = stone.vy / speed;
        const perpX = -headingY;
        const perpY = headingX;

        const curlMag = stone.curlCoeff * stone.spin * Math.min(speed, 120);
        stone.vx += perpX * curlMag * dt;
        stone.vy += perpY * curlMag * dt;

        // Ice drag
        const drag = Math.pow(stone.dragFactor, dt);
        stone.vx *= drag;
        stone.vy *= drag;

        // Anti-stall in lower delivery corridor: ensure positive upward velocity
        if (stone.y > this.canvas.clientHeight * 0.75 && stone.vy > -35) {
          stone.vy -= 40 * dt;
        }
      } else {
        stone.vx = 0;
        stone.vy = 0;
        stone.isMoving = false;
      }

      // Angular rotation decay (separate from translation)
      if (Math.abs(stone.spin) > 0.05) {
        stone.angle += stone.spin * dt * 3.5;
        stone.spin *= Math.pow(0.92, dt);
      } else {
        stone.spin = 0;
      }
    }

    resolveCollisions() {
      const len = this.stones.length;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const s1 = this.stones[i];
          const s2 = this.stones[j];

          const dx = s2.x - s1.x;
          const dy = s2.y - s1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = this.stoneRadius * 2;

          if (dist < minDist && dist > 0.001) {
            // Overlap correction
            const overlap = (minDist - dist) * 0.5;
            const nx = dx / dist;
            const ny = dy / dist;

            s1.x -= nx * overlap;
            s1.y -= ny * overlap;
            s2.x += nx * overlap;
            s2.y += ny * overlap;

            // Elastic normal impulse
            const kx = s1.vx - s2.vx;
            const ky = s1.vy - s2.vy;
            const p = 2 * (nx * kx + ny * ky) / 2; // Equal stone mass

            // Conserved kinetic energy for mega take-out; controlled for draws
            const restitution = (s1.isMega || s2.isMega) ? 0.92 : 0.72;

            s1.vx -= p * nx * restitution;
            s1.vy -= p * ny * restitution;
            s2.vx += p * nx * restitution;
            s2.vy += p * ny * restitution;

            s1.isMoving = true;
            s2.isMoving = true;

            // Tangent spin interaction
            s1.spin = -s1.spin * 0.4;
            s2.spin = -s2.spin * 0.4;

            const impactSpeed = Math.hypot(kx, ky);
            if (impactSpeed > 25) {
              this.sound.stoneImpact(Math.min(impactSpeed / 160, 1.5));
            }
          }
        }
      }
    }

    launchNextStone() {
      this.shotCount++;
      const isMega = (this.shotCount % 9 === 0);

      // Strict team alternation: Odd = RED, Even = YELLOW
      const team = (this.shotCount % 2 === 1) ? 'RED' : 'YELLOW';

      const simWidth = this.canvas.clientWidth;
      const simHeight = this.canvas.clientHeight;

      // Bottom-launch offscreen pre-roll origin: tight corridor ±5% of centre
      const launchX = this.house.centerX + (Math.random() - 0.5) * (simWidth * 0.10);
      const launchY = simHeight + (this.stoneRadius * 2.5);

      // Target selection
      let targetX = this.house.centerX;
      let targetY = this.house.centerY;

      if (isMega && this.stones.length > 0) {
        // MEGA TAKE-OUT SOLVER: Target cluster keystone
        let bestTarget = this.stones[0];
        let minDist = 99999;
        this.stones.forEach(st => {
          const d = Math.hypot(st.x - this.house.centerX, st.y - this.house.centerY);
          if (d < minDist) {
            minDist = d;
            bestTarget = st;
          }
        });
        targetX = bestTarget.x;
        targetY = bestTarget.y;
      } else if (this.stones.length > 0) {
        // Compact Button Cluster: solve legal pocket within 10% house radius
        const offsetRadius = Math.random() * (this.house.buttonRadius * 1.6);
        const offsetAngle = Math.random() * Math.PI * 2;
        targetX = this.house.centerX + Math.cos(offsetAngle) * offsetRadius;
        targetY = this.house.centerY + Math.sin(offsetAngle) * offsetRadius;
      }

      // Delivery Velocity Solver
      const travelDist = Math.hypot(targetX - launchX, targetY - launchY);
      const baseDrag = 0.58;

      // Velocity calibrated so stone decelerates precisely at target
      let speed = isMega ? travelDist * 1.55 : Math.sqrt(2 * travelDist * 88);

      const dirX = (targetX - launchX) / travelDist;
      const dirY = (targetY - launchY) / travelDist;

      // Curl configuration: at least 50% light curl throws
      const hasCurl = (Math.random() < 0.65);
      const spinDirection = (Math.random() < 0.5) ? 1 : -1;
      const spin = hasCurl ? (spinDirection * (1.8 + Math.random() * 1.2)) : (spinDirection * 0.4);
      const curlCoeff = hasCurl ? (0.045 + Math.random() * 0.025) : 0.008;

      // Pre-launch curl compensation
      const compensatedDirX = dirX - (spinDirection * (hasCurl ? 0.06 : 0.01));

      const newStone = {
        id: this.shotCount,
        team: team,
        x: launchX,
        y: launchY,
        vx: compensatedDirX * speed,
        vy: dirY * speed,
        spin: spin,
        angle: Math.random() * Math.PI * 2,
        curlCoeff: curlCoeff,
        dragFactor: isMega ? 0.94 : baseDrag,
        isMega: isMega,
        isMoving: true
      };

      this.stones.push(newStone);
      this.activeStone = newStone;
      this.isBoardQuiescent = false;
    }

    // --- RENDER PASS ---
    render() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

      // 1. Draw House & Rink Geometry
      this.renderRink(ctx);

      // 2. Draw Stones
      this.stones.forEach(s => this.renderStone(ctx, s));

      ctx.restore();
    }

    renderRink(ctx) {
      const cx = this.house.centerX;
      const cy = this.house.centerY;
      const h = this.house;

      ctx.save();

      // Centre & Tee Lines
      ctx.strokeStyle = 'rgba(18, 59, 114, 0.18)';
      ctx.lineWidth = 1.5;

      // Centre line (full sheet height)
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, this.canvas.clientHeight);
      ctx.stroke();

      // Tee line (horizontal crosshair through button)
      ctx.beginPath();
      ctx.moveTo(cx - h.radius12Foot * 1.5, cy);
      ctx.lineTo(cx + h.radius12Foot * 1.5, cy);
      ctx.stroke();

      // 12-Foot Blue Ring
      ctx.beginPath();
      ctx.arc(cx, cy, h.radius12Foot, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(18, 59, 114, 0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(18, 59, 114, 0.28)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 8-Foot White Ring
      ctx.beginPath();
      ctx.arc(cx, cy, h.radius8Foot, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.60)';
      ctx.fill();
      ctx.stroke();

      // 4-Foot Red Ring
      ctx.beginPath();
      ctx.arc(cx, cy, h.radius4Foot, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 16, 46, 0.12)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(200, 16, 46, 0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // The Button (White with Blue Target Pip)
      ctx.beginPath();
      ctx.arc(cx, cy, h.buttonRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = 'rgba(18, 59, 114, 0.5)';
      ctx.stroke();

      // Pin Center
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#0B2450';
      ctx.fill();

      ctx.restore();
    }

    renderStone(ctx, stone) {
      const r = this.stoneRadius;
      ctx.save();
      ctx.translate(stone.x, stone.y);

      // Contact Shadow on Ice
      ctx.beginPath();
      ctx.ellipse(2, 3, r * 1.05, r * 0.88, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(11, 36, 80, 0.18)';
      ctx.fill();

      // Outer Granite Body (Circular)
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);

      // Granite Gradient
      const graniteGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
      graniteGrad.addColorStop(0, '#FFFFFF');
      graniteGrad.addColorStop(0.35, '#DFE6EC');
      graniteGrad.addColorStop(0.85, '#92A4B6');
      graniteGrad.addColorStop(1, '#536578');
      ctx.fillStyle = graniteGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(11, 36, 80, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Colored Striking Band
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.76, 0, Math.PI * 2);
      const isRed = (stone.team === 'RED');
      const bandGrad = ctx.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r * 0.76);
      if (isRed) {
        bandGrad.addColorStop(0, '#E62444');
        bandGrad.addColorStop(0.7, '#C8102E');
        bandGrad.addColorStop(1, '#7C0719');
      } else {
        bandGrad.addColorStop(0, '#FFE873');
        bandGrad.addColorStop(0.7, '#FFD52A');
        bandGrad.addColorStop(1, '#B88E00');
      }
      ctx.fillStyle = bandGrad;
      ctx.fill();

      // Centered Rotating Handle
      ctx.rotate(stone.angle);

      // Handle Bracket
      ctx.beginPath();
      ctx.roundRect(-r * 0.18, -r * 0.45, r * 0.36, r * 0.9, 3);
      ctx.fillStyle = '#2B3947';
      ctx.fill();

      // Handle Grip
      ctx.beginPath();
      ctx.roundRect(-r * 0.12, -r * 0.38, r * 0.24, r * 0.76, 2);
      ctx.fillStyle = isRed ? '#FDE8EB' : '#FFF9D9';
      ctx.fill();

      ctx.restore();
    }
  }

  // ==========================================================================
  // CORE APPLICATION CONTROLLER
  // ==========================================================================
  class DailyQuizApp {
    constructor() {
      this.state = Storage.load();
      this.sound = new SoundManager(this.state.sound);
      this.clock = new ReleaseClock();
      this.roundsByDate = {};
      this.todayUkDate = null;
      this.currentActiveDate = null;
      this.vaultDates = [];

      this.activeRound = null;
      this.currentIndex = 0;
      this.sessionAnswers = [];
      this.isReview = false;
      this.selectedAnswer = null;

      this.activeDrawer = null;

      this.cacheDom();
      this.simulation = new CurlingIceSimulation(
        this.dom.curlingRinkCanvas,
        this.sound,
        this.state.backgroundAnimation
      );

      this.bindEvents();
      this.updateTogglesUI();
      this.init();
    }

    cacheDom() {
      this.dom = {
        appHeaderTitle: document.getElementById('appHeaderTitle'),
        headerHomeBtn: document.getElementById('headerHomeBtn'),
        headerBackBtn: document.getElementById('headerBackBtn'),
        quickSoundBtn: document.getElementById('quickSoundBtn'),
        quickSoundIcon: document.getElementById('quickSoundIcon'),
        curlingRinkCanvas: document.getElementById('curlingRinkCanvas'),

        // Views
        statusView: document.getElementById('statusView'),
        statusTitle: document.getElementById('statusTitle'),
        statusMessage: document.getElementById('statusMessage'),
        statusRetryBtn: document.getElementById('statusRetryBtn'),

        menuView: document.getElementById('menuView'),
        playTodayBtn: document.getElementById('playTodayBtn'),
        playTodayTitle: document.getElementById('playTodayTitle'),
        menuTodayBadge: document.getElementById('menuTodayBadge'),
        menuReleaseDate: document.getElementById('menuReleaseDate'),
        openVaultBtn: document.getElementById('openVaultBtn'),
        vaultCountBadge: document.getElementById('vaultCountBadge'),
        openSettingsBtn: document.getElementById('openSettingsBtn'),
        openHowToPlayBtn: document.getElementById('openHowToPlayBtn'),

        // Utility Row
        statsUtilityBtn: document.getElementById('statsUtilityBtn'),
        shareUtilityBtn: document.getElementById('shareUtilityBtn'),
        plusUtilityBtn: document.getElementById('plusUtilityBtn'),

        // Game View
        gameView: document.getElementById('gameView'),
        gameModeBadge: document.getElementById('gameModeBadge'),
        stepperTrack: document.getElementById('stepperTrack'),
        questionCounterLabel: document.getElementById('questionCounterLabel'),
        questionText: document.getElementById('questionText'),
        optionsContainer: document.getElementById('optionsContainer'),
        explanationPanel: document.getElementById('explanationPanel'),
        answerIndicator: document.getElementById('answerIndicator'),
        explanationText: document.getElementById('explanationText'),
        nextQuestionBtn: document.getElementById('nextQuestionBtn'),

        // Results View
        resultsView: document.getElementById('resultsView'),
        resultsHeadline: document.getElementById('resultsHeadline'),
        scoreValue: document.getElementById('scoreValue'),
        scoreTotal: document.getElementById('scoreTotal'),
        resultsBreakdown: document.getElementById('resultsBreakdown'),
        resultsStreakValue: document.getElementById('resultsStreakValue'),
        resultsAccuracyValue: document.getElementById('resultsAccuracyValue'),
        shareScoreBtn: document.getElementById('shareScoreBtn'),
        reviewQuizBtn: document.getElementById('reviewQuizBtn'),
        resultsVaultBtn: document.getElementById('resultsVaultBtn'),
        resultsMenuBtn: document.getElementById('resultsMenuBtn'),

        // Vault View
        vaultView: document.getElementById('vaultView'),
        vaultList: document.getElementById('vaultList'),
        vaultEmptyMsg: document.getElementById('vaultEmptyMsg'),
        vaultTotalBadge: document.getElementById('vaultTotalBadge'),

        // Drawers & Backdrop
        panelBackdrop: document.getElementById('panelBackdrop'),
        howToPlayDrawer: document.getElementById('howToPlayDrawer'),
        closeHowToBtn: document.getElementById('closeHowToBtn'),

        settingsDrawer: document.getElementById('settingsDrawer'),
        closeSettingsBtn: document.getElementById('closeSettingsBtn'),
        toggleAnimationBtn: document.getElementById('toggleAnimationBtn'),
        toggleSoundBtn: document.getElementById('toggleSoundBtn'),
        resetDataBtn: document.getElementById('resetDataBtn'),

        statsDrawer: document.getElementById('statsDrawer'),
        closeStatsBtn: document.getElementById('closeStatsBtn'),
        statPlayed: document.getElementById('statPlayed'),
        statAccuracy: document.getElementById('statAccuracy'),
        statCurrentStreak: document.getElementById('statCurrentStreak'),
        statBestStreak: document.getElementById('statBestStreak'),
        scoreDistributionChart: document.getElementById('scoreDistributionChart'),

        toastMessage: document.getElementById('toastMessage')
      };
    }

    bindEvents() {
      // Navigation
      this.dom.headerBackBtn.addEventListener('click', () => {
        this.sound.tap();
        this.showView('menuView');
      });

      // Quick Sound
      this.dom.quickSoundBtn.addEventListener('click', () => {
        this.toggleSound();
      });

      // Retry
      this.dom.statusRetryBtn.addEventListener('click', () => {
        this.sound.tap();
        this.init();
      });

      // Menu Actions
      this.dom.playTodayBtn.addEventListener('click', () => {
        this.sound.tap();
        this.startRound(this.currentActiveDate);
      });

      this.dom.openVaultBtn.addEventListener('click', () => {
        this.sound.tap();
        this.renderVault();
      });

      this.dom.openSettingsBtn.addEventListener('click', () => {
        this.sound.tap();
        this.openDrawer(this.dom.settingsDrawer);
      });

      this.dom.openHowToPlayBtn.addEventListener('click', () => {
        this.sound.tap();
        this.openDrawer(this.dom.howToPlayDrawer);
      });

      // Utilities
      this.dom.statsUtilityBtn.addEventListener('click', () => {
        this.sound.tap();
        this.renderStats();
        this.openDrawer(this.dom.statsDrawer);
      });

      this.dom.shareUtilityBtn.addEventListener('click', () => {
        this.sound.tap();
        this.shareGameLink();
      });

      this.dom.plusUtilityBtn.addEventListener('click', () => {
        this.sound.tap();
        window.location.href = CONFIG.plusUrl;
      });

      // Drawer Close Handlers
      this.dom.closeHowToBtn.addEventListener('click', () => this.closeActiveDrawer());
      this.dom.closeSettingsBtn.addEventListener('click', () => this.closeActiveDrawer());
      this.dom.closeStatsBtn.addEventListener('click', () => this.closeActiveDrawer());
      this.dom.panelBackdrop.addEventListener('click', () => this.closeActiveDrawer());

      // Settings Switches
      this.dom.toggleAnimationBtn.addEventListener('click', () => {
        this.state.backgroundAnimation = !this.state.backgroundAnimation;
        Storage.save(this.state);
        this.simulation.setEnabled(this.state.backgroundAnimation);
        this.updateTogglesUI();
        this.sound.tap();
      });

      this.dom.toggleSoundBtn.addEventListener('click', () => {
        this.toggleSound();
      });

      this.dom.resetDataBtn.addEventListener('click', () => {
        if (window.confirm('Reset all Daily Quiz progress, history, and streak data on this device?')) {
          localStorage.removeItem(CONFIG.storageKey);
          this.state = Storage.load();
          this.sound.enabled = this.state.sound;
          this.simulation.setEnabled(this.state.backgroundAnimation);
          this.updateTogglesUI();
          this.renderMenu();
          this.closeActiveDrawer();
          this.showToast('Local progress reset.');
        }
      });

      // Quiz Progress
      this.dom.nextQuestionBtn.addEventListener('click', () => {
        this.sound.tap();
        this.handleNextQuestion();
      });

      // Results Actions
      this.dom.shareScoreBtn.addEventListener('click', () => this.shareScoreResult());
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

      // Keyboard Dismissal
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeDrawer) {
          this.closeActiveDrawer();
        }
      });
    }

    toggleSound() {
      this.sound.enabled = !this.sound.enabled;
      this.state.sound = this.sound.enabled;
      Storage.save(this.state);
      this.updateTogglesUI();
      if (this.sound.enabled) this.sound.tap();
    }

    updateTogglesUI() {
      this.dom.quickSoundIcon.textContent = this.sound.enabled ? '🔊' : '🔇';
      this.dom.toggleSoundBtn.setAttribute('aria-checked', String(this.sound.enabled));
      this.dom.toggleSoundBtn.querySelector('.toggle-state').textContent = this.sound.enabled ? 'ON' : 'OFF';

      this.dom.toggleAnimationBtn.setAttribute('aria-checked', String(this.state.backgroundAnimation));
      this.dom.toggleAnimationBtn.querySelector('.toggle-state').textContent = this.state.backgroundAnimation ? 'ON' : 'OFF';
    }

    // --- HORIZONTAL SLIDE DRAWER MANAGEMENT ---
    openDrawer(drawerEl) {
      if (this.activeDrawer && this.activeDrawer !== drawerEl) {
        this.activeDrawer.classList.remove('open');
        this.activeDrawer.hidden = true;
      }
      this.activeDrawer = drawerEl;
      this.dom.panelBackdrop.classList.remove('hidden');

      drawerEl.hidden = false;
      void drawerEl.offsetWidth; // Force synchronous layout reflow

      this.dom.panelBackdrop.classList.add('visible');
      drawerEl.classList.add('open');

      const closeBtn = drawerEl.querySelector('.drawer-close-btn');
      if (closeBtn) closeBtn.focus();
    }

    closeActiveDrawer() {
      if (!this.activeDrawer) return;
      this.sound.tap();
      const target = this.activeDrawer;
      this.activeDrawer = null;

      target.classList.remove('open');
      this.dom.panelBackdrop.classList.remove('visible');

      setTimeout(() => {
        target.hidden = true;
        this.dom.panelBackdrop.classList.add('hidden');
      }, 400);
    }

    showView(viewName) {
      const views = ['statusView', 'menuView', 'gameView', 'resultsView', 'vaultView'];
      views.forEach(v => this.dom[v].classList.add('hidden'));
      this.dom[viewName].classList.remove('hidden');

      if (viewName === 'menuView') {
        this.dom.appHeaderTitle.textContent = 'Daily Quiz';
        this.dom.headerHomeBtn.classList.remove('hidden');
        this.dom.headerBackBtn.classList.add('hidden');
        this.renderMenu();
      } else if (viewName === 'gameView') {
        this.dom.appHeaderTitle.textContent = this.activeRound
          ? (this.activeRound.date === this.currentActiveDate ? 'Daily Quiz' : `Vault: ${this.activeRound.date}`)
          : 'Daily Quiz';
        this.dom.headerHomeBtn.classList.add('hidden');
        this.dom.headerBackBtn.classList.remove('hidden');
      } else if (viewName === 'vaultView') {
        this.dom.appHeaderTitle.textContent = 'The Vault';
        this.dom.headerHomeBtn.classList.add('hidden');
        this.dom.headerBackBtn.classList.remove('hidden');
      } else if (viewName === 'resultsView') {
        this.dom.appHeaderTitle.textContent = 'Summary';
        this.dom.headerHomeBtn.classList.add('hidden');
        this.dom.headerBackBtn.classList.remove('hidden');
      } else {
        this.dom.appHeaderTitle.textContent = 'Daily Quiz';
        this.dom.headerHomeBtn.classList.remove('hidden');
        this.dom.headerBackBtn.classList.add('hidden');
      }
      window.scrollTo(0, 0);
    }

    // --- DATA INITIALIZATION & TIME SYNCHRONIZATION ---
    async init() {
      this.dom.statusTitle.textContent = 'Synchronizing';
      this.dom.statusMessage.textContent = 'Loading authoritative release schedule and puzzles...';
      this.dom.statusRetryBtn.classList.add('hidden');
      this.showView('statusView');

      try {
        const [csvRes] = await Promise.all([
          fetch(CONFIG.csvPath, { cache: 'no-store' }),
          this.clock.sync()
        ]);

        if (!csvRes.ok) throw new Error('Could not retrieve puzzles.csv.');
        const csvRaw = await csvRes.text();
        const records = parseCsv(csvRaw);

        this.roundsByDate = {};
        records.forEach(row => {
          if (!row.date) return;
          if (!this.roundsByDate[row.date]) this.roundsByDate[row.date] = [];
          this.roundsByDate[row.date].push({
            question: row.question || 'Question content not found.',
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
        if (allDates.length === 0) throw new Error('No valid quiz entries found in database.');

        this.todayUkDate = this.clock.getTodayUkDateString();
        const releasedDates = allDates.filter(d => d <= this.todayUkDate);

        if (this.roundsByDate[this.todayUkDate]) {
          this.currentActiveDate = this.todayUkDate;
          this.vaultDates = releasedDates.filter(d => d < this.todayUkDate);
        } else {
          if (releasedDates.length > 0) {
            this.currentActiveDate = releasedDates[releasedDates.length - 1];
            this.vaultDates = releasedDates.slice(0, -1);
          } else {
            this.currentActiveDate = allDates[0];
            this.vaultDates = [];
          }
        }

        this.vaultDates.sort((a, b) => b.localeCompare(a));
        this.showView('menuView');

      } catch (err) {
        this.dom.statusTitle.textContent = 'Connection Notice';
        this.dom.statusMessage.textContent = err.message || 'Unable to initialize puzzle data at this time.';
        this.dom.statusRetryBtn.classList.remove('hidden');
        this.showView('statusView');
      }
    }

    renderMenu() {
      this.dom.vaultCountBadge.textContent = `${this.vaultDates.length} Past`;

      if (!this.currentActiveDate) {
        this.dom.playTodayTitle.textContent = 'No Quiz Available';
        this.dom.menuReleaseDate.textContent = 'Check back later';
        this.dom.playTodayBtn.disabled = true;
        return;
      }

      this.dom.playTodayBtn.disabled = false;
      this.dom.menuReleaseDate.textContent = `Release: ${this.currentActiveDate} • 5 Questions`;

      const hist = this.state.history[this.currentActiveDate];
      const inProg = this.state.inProgress && this.state.inProgress.date === this.currentActiveDate;

      if (hist && hist.completed) {
        this.dom.playTodayTitle.textContent = 'View Today\'s Results';
        this.dom.menuTodayBadge.textContent = `Completed (${hist.score}/${hist.answers.length})`;
        this.dom.menuTodayBadge.className = 'badge completed';
      } else if (inProg) {
        const count = inProg.answers ? inProg.answers.length : 0;
        const total = this.roundsByDate[this.currentActiveDate].length;
        this.dom.playTodayTitle.textContent = 'Resume Daily Quiz';
        this.dom.menuTodayBadge.textContent = `In Progress (${count}/${total})`;
        this.dom.menuTodayBadge.className = 'badge';
      } else {
        this.dom.playTodayTitle.textContent = 'Play Daily Quiz';
        this.dom.menuTodayBadge.textContent = 'Ready';
        this.dom.menuTodayBadge.className = 'badge';
      }
    }

    startRound(dateStr) {
      const questions = this.roundsByDate[dateStr];
      if (!questions || questions.length === 0) return;

      this.activeRound = { date: dateStr, questions: questions };
      this.isReview = false;
      this.selectedAnswer = null;

      const hist = this.state.history[dateStr];
      if (hist && hist.completed) {
        this.sessionAnswers = hist.answers;
        this.showResults(hist.score);
        return;
      }

      const isCurrent = (dateStr === this.currentActiveDate);
      if (isCurrent && this.state.inProgress && this.state.inProgress.date === dateStr) {
        this.currentIndex = this.state.inProgress.currentIndex || 0;
        this.sessionAnswers = this.state.inProgress.answers || [];
      } else {
        this.currentIndex = 0;
        this.sessionAnswers = [];
      }

      this.dom.gameModeBadge.textContent = isCurrent ? `Daily Release • ${dateStr}` : `Vault Archive • ${dateStr}`;
      this.showView('gameView');
      this.renderQuestion();
    }

    renderQuestion() {
      const q = this.activeRound.questions[this.currentIndex];
      const total = this.activeRound.questions.length;
      this.selectedAnswer = null;

      this.dom.questionCounterLabel.textContent = `Question ${this.currentIndex + 1} of ${total}`;
      this.dom.questionText.textContent = q.question;
      this.dom.explanationPanel.classList.add('hidden');
      this.dom.optionsContainer.innerHTML = '';
      this.updateStepper();

      const labels = ['A', 'B', 'C', 'D'];
      q.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.type = 'button';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', 'false');
        btn.innerHTML = `<span class="option-key">${labels[idx]}</span><span>${optText}</span>`;

        btn.addEventListener('click', () => {
          this.selectOption(idx);
        });

        this.dom.optionsContainer.appendChild(btn);
      });

      const isLast = (this.currentIndex === total - 1);
      this.dom.nextQuestionBtn.textContent = isLast ? 'Complete Quiz' : 'Next Question';
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
          pip.classList.add(this.sessionAnswers[idx].isCorrect ? 'correct' : 'incorrect');
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
        this.dom.answerIndicator.textContent = '✓ Correct';
        this.dom.answerIndicator.className = 'badge completed';
      } else {
        this.sound.incorrect();
        this.dom.answerIndicator.textContent = '✕ Incorrect';
        this.dom.answerIndicator.className = 'badge';
        this.dom.answerIndicator.style.borderColor = 'var(--color-incorrect-border)';
        this.dom.answerIndicator.style.color = 'var(--color-incorrect-text)';
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

      this.dom.explanationText.textContent = q.explanation || 'Verified reference answer.';
      this.dom.explanationPanel.classList.remove('hidden');
      this.updateStepper();

      if (this.activeRound.date === this.currentActiveDate) {
        this.state.inProgress = {
          date: this.currentActiveDate,
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
        if (this.activeRound.date === this.currentActiveDate && this.state.inProgress) {
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
      const isCurrent = (this.activeRound.date === this.currentActiveDate);

      if (isCurrent) {
        if (this.state.lastCompletedDate) {
          const last = new Date(this.state.lastCompletedDate);
          const curr = new Date(this.currentActiveDate);
          const diffDays = Math.round((curr - last) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            this.state.streak = (this.state.streak || 0) + 1;
          } else if (diffDays > 1) {
            this.state.streak = 1;
          }
        } else {
          this.state.streak = 1;
        }

        if (this.state.streak > (this.state.bestStreak || 0)) {
          this.state.bestStreak = this.state.streak;
        }
        this.state.lastCompletedDate = this.currentActiveDate;
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

      this.dom.resultsStreakValue.textContent = this.state.streak || 0;
      const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;
      this.dom.resultsAccuracyValue.textContent = `${accuracy}%`;

      this.dom.resultsBreakdown.innerHTML = '';
      this.sessionAnswers.forEach((ans, idx) => {
        const pip = document.createElement('div');
        pip.className = `result-pip ${ans.isCorrect ? 'correct' : 'incorrect'}`;
        pip.textContent = ans.isCorrect ? '✓' : '✕';
        pip.setAttribute('aria-label', `Question ${idx + 1}: ${ans.isCorrect ? 'Correct' : 'Incorrect'}`);
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
      const total = this.activeRound.questions.length;
      const ans = this.sessionAnswers[this.currentIndex] || { chosen: -1, isCorrect: false };
      this.updateStepper();

      this.dom.questionCounterLabel.textContent = `Reviewing ${this.currentIndex + 1} of ${total}`;
      this.dom.questionText.textContent = q.question;
      this.dom.optionsContainer.innerHTML = '';
      const labels = ['A', 'B', 'C', 'D'];

      q.options.forEach((optText, idx) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.disabled = true;
        if (idx === q.answerIndex) {
          btn.classList.add('correct');
        } else if (idx === ans.chosen && !ans.isCorrect) {
          btn.classList.add('incorrect');
        }
        btn.innerHTML = `<span class="option-key">${labels[idx]}</span><span>${optText}</span>`;
        this.dom.optionsContainer.appendChild(btn);
      });

      if (ans.isCorrect) {
        this.dom.answerIndicator.textContent = '✓ Correct';
        this.dom.answerIndicator.className = 'badge completed';
      } else {
        this.dom.answerIndicator.textContent = '✕ Incorrect';
        this.dom.answerIndicator.className = 'badge';
        this.dom.answerIndicator.style.borderColor = 'var(--color-incorrect-border)';
        this.dom.answerIndicator.style.color = 'var(--color-incorrect-text)';
      }

      this.dom.explanationText.textContent = q.explanation || 'Verified reference answer.';
      this.dom.explanationPanel.classList.remove('hidden');

      const isLast = (this.currentIndex === total - 1);
      this.dom.nextQuestionBtn.textContent = isLast ? 'Return to Summary' : 'Next Question';
    }

    renderVault() {
      this.showView('vaultView');
      this.dom.vaultList.innerHTML = '';
      this.dom.vaultTotalBadge.textContent = `${this.vaultDates.length} Puzzles`;

      if (this.vaultDates.length === 0) {
        this.dom.vaultEmptyMsg.classList.remove('hidden');
        return;
      }
      this.dom.vaultEmptyMsg.classList.add('hidden');

      this.vaultDates.forEach(dateStr => {
        const row = document.createElement('button');
        row.className = 'vault-row';
        row.type = 'button';

        const hist = this.state.history[dateStr];
        const isDone = hist && hist.completed;

        row.innerHTML = `
          <span class="vault-row-date">${dateStr}</span>
          <span class="badge ${isDone ? 'completed' : ''}">
            ${isDone ? `Score: ${hist.score}/${hist.answers.length}` : 'Play'}
          </span>
        `;

        row.addEventListener('click', () => {
          this.sound.tap();
          this.startRound(dateStr);
        });

        this.dom.vaultList.appendChild(row);
      });
    }

    renderStats() {
      const completedEntries = Object.values(this.state.history).filter(h => h.completed);
      const playedCount = completedEntries.length;

      let totalQuestions = 0;
      let totalCorrect = 0;
      const scoreDist = [0, 0, 0, 0, 0, 0];

      completedEntries.forEach(item => {
        const score = item.score || 0;
        if (score >= 0 && score <= 5) scoreDist[score]++;
        totalCorrect += score;
        totalQuestions += (item.answers ? item.answers.length : 5);
      });

      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

      this.dom.statPlayed.textContent = playedCount;
      this.dom.statAccuracy.textContent = `${accuracy}%`;
      this.dom.statCurrentStreak.textContent = this.state.streak || 0;
      this.dom.statBestStreak.textContent = this.state.bestStreak || (this.state.streak || 0);

      this.dom.scoreDistributionChart.innerHTML = '';
      const maxDist = Math.max(...scoreDist, 1);

      for (let s = 5; s >= 0; s--) {
        const count = scoreDist[s];
        const pct = Math.max(Math.round((count / maxDist) * 100), 10);
        const row = document.createElement('div');
        row.className = 'dist-bar-row';
        row.innerHTML = `
          <span class="dist-bar-num">${s}</span>
          <div class="dist-bar-track">
            <div class="dist-bar-fill" style="width: ${count > 0 ? pct : 0}%;">${count}</div>
          </div>
        `;
        this.dom.scoreDistributionChart.appendChild(row);
      }
    }

    shareGameLink() {
      const shareData = {
        title: 'Daily Quiz 🍁 Ice House Royale',
        text: 'Test your knowledge on the Daily Quiz ice sheet today!',
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href)
          .then(() => this.showToast('Link copied to clipboard!'))
          .catch(() => this.showToast('Unable to copy link.'));
      } else {
        this.showToast('Sharing not supported on this browser.');
      }
    }

    shareScoreResult() {
      const score = this.sessionAnswers.filter(a => a.isCorrect).length;
      const total = this.sessionAnswers.length;
      const pips = this.sessionAnswers.map(a => a.isCorrect ? '🟩' : '⬛').join('');
      const text = `Daily Quiz 🍁 • ${this.activeRound.date}\nScore: ${score}/${total}\n${pips}\n${window.location.href}`;

      if (navigator.share) {
        navigator.share({ title: 'Daily Quiz Result', text }).catch(() => {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => this.showToast('Result copied to clipboard!'))
          .catch(() => this.showToast('Unable to copy result.'));
      } else {
        this.showToast('Sharing not supported on this browser.');
      }
    }

    showToast(message) {
      this.dom.toastMessage.textContent = message;
      this.dom.toastMessage.classList.add('visible');
      setTimeout(() => {
        this.dom.toastMessage.classList.remove('visible');
      }, 2300);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new DailyQuizApp());
  } else {
    new DailyQuizApp();
  }
})();