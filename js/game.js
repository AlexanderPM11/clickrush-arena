/* ============================================================
   GAME — Core game logic, state, spawning, difficulty
   ============================================================ */

const Game = (function () {
  /* ---------- Constants ---------- */
  const MAX_LIVES        = 3;
  const BASE_SCORE       = 10;

  /* Starting values (eased toward minimums by difficulty) */
  const INITIAL_SPAWN_DELAY = 1400;  // ms
  const MIN_SPAWN_DELAY     = 280;
  const INITIAL_LIFETIME    = 2200;  // ms
  const MIN_LIFETIME        = 350;
  const INITIAL_SIZE        = 65;    // px (average)
  const MIN_OBJECT_SIZE     = 36;
  const MAX_OBJECT_SIZE     = 90;
  const INITIAL_MAX_OBJECTS = 3;

  /* ---------- State ---------- */
  let state = {};
  let activeObjects = new Map();
  let spawnTimer = null;
  let tickInterval = null;
  let objectCount = 0;
  let gameArea = null;
  let elapsed = 0; // survival time in seconds

  /* ---------- Helpers ---------- */
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

  /* ---------- State factory ---------- */

  function resetState() {
    state = {
      score: 0,
      lives: MAX_LIVES,
      combo: 0,
      maxCombo: 0,
      isRunning: false,
      totalCaught: 0,
      totalMissed: 0,
    };
    activeObjects.clear();
    objectCount = 0;
    elapsed = 0;
    clearTimeout(spawnTimer);
    clearInterval(tickInterval);
  }

  /* ---------- Continuous difficulty ---------- */

  /**
   * Returns difficulty parameters that evolve smoothly with survival time.
   * Uses exponential decay so the early game feels forgiving and the
   * late game remains challenging without sharp jumps.
   */
  function getDifficulty() {
    const t = elapsed;

    const spawnDelay = MIN_SPAWN_DELAY
      + (INITIAL_SPAWN_DELAY - MIN_SPAWN_DELAY) * Math.pow(0.955, t);

    const lifetime = MIN_LIFETIME
      + (INITIAL_LIFETIME - MIN_LIFETIME) * Math.pow(0.94, t);

    const baseSize = MIN_OBJECT_SIZE
      + (INITIAL_SIZE - MIN_OBJECT_SIZE) * Math.pow(0.965, t);

    const maxObjects = Math.min(8, INITIAL_MAX_OBJECTS + t / 15);

    const progress = 1
      - (spawnDelay - MIN_SPAWN_DELAY)
        / (INITIAL_SPAWN_DELAY - MIN_SPAWN_DELAY);

    return {
      spawnDelay,
      lifetime,
      baseSize,
      maxObjects: Math.floor(maxObjects),
      progress, // 0 → 1 as difficulty rises
    };
  }

  /* ---------- Object spawning ---------- */

  function generateObjectData() {
    const areaRect = gameArea.getBoundingClientRect();
    const diff = getDifficulty();
    const size = clamp(
      diff.baseSize + rand(-5, 5),
      MIN_OBJECT_SIZE,
      MAX_OBJECT_SIZE,
    );
    const pad = size + 10;
    return {
      id: ++objectCount,
      size,
      x: rand(pad, areaRect.width - pad),
      y: rand(pad, areaRect.height - pad),
      color: UI.COLORS[randInt(0, UI.COLORS.length - 1)],
      emoji: UI.EMOJIS[randInt(0, UI.EMOJIS.length - 1)],
    };
  }

  function spawnObject() {
    if (!state.isRunning) return;
    const diff = getDifficulty();

    const data = generateObjectData();
    const el = UI.createObject(data, () => handleObjectClick(data.id));
    gameArea.appendChild(el);

    const lifetime = diff.lifetime + rand(-150, 150);
    const timeout = setTimeout(() => {
      if (activeObjects.has(data.id)) {
        handleObjectMiss(data.id);
      }
    }, lifetime);

    activeObjects.set(data.id, {
      el,
      timeout,
      x: data.x,
      y: data.y,
      color: data.color,
    });
  }

  /* ---------- Spawn loop ---------- */

  function spawnLoop() {
    if (!state.isRunning) return;
    const diff = getDifficulty();
    if (activeObjects.size < diff.maxObjects) {
      spawnObject();
    }
    const delay = diff.spawnDelay + rand(-100, 100);
    spawnTimer = setTimeout(spawnLoop, delay);
  }

  /* ---------- Click / miss handlers ---------- */

  function handleObjectClick(id) {
    if (!state.isRunning) return;
    const obj = activeObjects.get(id);
    if (!obj) return;

    activeObjects.delete(id);
    clearTimeout(obj.timeout);

    state.combo++;
    if (state.combo > state.maxCombo) state.maxCombo = state.combo;
    state.totalCaught++;

    const mult = UI.getComboMultiplier(state.combo);
    const points = BASE_SCORE * mult;
    state.score += points;

    /* audio */
    if (state.combo >= 3) Audio.combo();
    else Audio.click(state.combo);

    /* visual feedback */
    UI.spawnParticles(obj.x, obj.y, obj.color, 12);
    UI.showScorePopup(obj.x, obj.y, `+${points}`, mult > 1);
    if (mult > 1 && state.combo >= 3) UI.showComboPopup(mult);
    UI.removeObject(obj.el, 'caught');
    UI.updateHUD(buildHudData());
  }

  function handleObjectMiss(id) {
    if (!state.isRunning) return;
    const obj = activeObjects.get(id);
    if (!obj) return;

    activeObjects.delete(id);
    state.combo = 0;
    state.totalMissed++;
    state.lives--;

    Audio.miss();
    Audio.lifeLost();
    UI.triggerShake();
    UI.removeObject(obj.el, 'hide');
    UI.updateHUD(buildHudData());

    if (state.lives <= 0) {
      endGame();
    }
  }

  /* ---------- HUD payload builder ---------- */

  function buildHudData() {
    const diff = getDifficulty();
    return {
      score: state.score,
      elapsed,
      lives: state.lives,
      combo: state.combo,
      totalCaught: state.totalCaught,
      totalMissed: state.totalMissed,
      difficulty: diff.progress,
    };
  }

  /* ---------- Timer (counts up) ---------- */

  function startTimer() {
    tickInterval = setInterval(() => {
      if (!state.isRunning) return;
      elapsed += 0.1;
      UI.updateHUD(buildHudData());
    }, 100);
  }

  /* ---------- Game lifecycle ---------- */

  /**
   * Starts a new game.
   */
  function startGame() {
    Audio.init();
    gameArea = document.getElementById('gameArea');

    resetState();
    state.isRunning = true;

    /* clear any leftover DOM elements */
    gameArea.innerHTML = '';
    UI.clearComboPopup();

    UI.showScreen('game');
    UI.updateHUD(buildHudData());
    Audio.startGame();

    /* count-up timer */
    startTimer();

    /* spawn loop kick-off */
    spawnLoop();
  }

  /**
   * Ends the current game.
   */
  function endGame() {
    state.isRunning = false;
    clearTimeout(spawnTimer);
    clearInterval(tickInterval);

    /* remove remaining objects */
    activeObjects.clear();
    gameArea.querySelectorAll('.game-object').forEach((el) => el.remove());

    Audio.gameOver();

    const isNew = Storage.saveIfHigher(state.score);
    UI.showGameOver(state.score, Storage.getBestScore(), isNew);
  }

  /* ---------- Public API ---------- */
  return {
    start: startGame,
    isRunning() { return state.isRunning; },
  };
})();
