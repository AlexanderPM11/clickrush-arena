/* ============================================================
   GAME — Core game logic, state, spawning, level management
   ============================================================ */

const Game = (function () {
  const MAX_LIVES    = 3;
  const BASE_SCORE   = 10;
  const MIN_OBJ_SIZE = 36;
  const MAX_OBJ_SIZE = 90;

  /* ---------- State ---------- */
  let currentLevel  = null;
  let state         = {};
  let activeObjects = new Map();
  let spawnTimer    = null;
  let tickInterval  = null;
  let objectCount   = 0;
  let gameArea      = null;
  let elapsed       = 0;

  /* ---------- Helpers ---------- */
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

  /* ---------- State factory ---------- */

  function resetState() {
    state = {
      level: currentLevel,
      score: 0,
      lives: MAX_LIVES,
      combo: 0,
      maxCombo: 0,
      isRunning: false,
      totalCaught: 0,
      totalMissed: 0,
      targetReached: false,
    };
    activeObjects.clear();
    objectCount = 0;
    elapsed = 0;
    clearTimeout(spawnTimer);
    clearInterval(tickInterval);
  }

  /* ---------- Object data ---------- */

  function generateObjectData() {
    const areaRect = gameArea.getBoundingClientRect();
    const size = clamp(
      currentLevel.size + rand(-5, 5),
      MIN_OBJ_SIZE,
      MAX_OBJ_SIZE,
    );
    const pad = size + 10;
    return {
      id: ++objectCount,
      size: Math.round(size),
      x: rand(pad, areaRect.width - pad),
      y: rand(pad, areaRect.height - pad),
      color: UI.COLORS[randInt(0, UI.COLORS.length - 1)],
      emoji: UI.EMOJIS[randInt(0, UI.EMOJIS.length - 1)],
    };
  }

  function spawnObject() {
    if (!state.isRunning) return;
    const data = generateObjectData();
    const lifetime = currentLevel.lifetime + rand(-150, 150);

    const el = UI.createObject(data, function () {
      handleObjectClick(data.id);
    }, lifetime);
    gameArea.appendChild(el);

    const timeout = setTimeout(function () {
      if (activeObjects.has(data.id)) {
        handleObjectMiss(data.id);
      }
    }, lifetime);

    activeObjects.set(data.id, {
      el: el,
      timeout: timeout,
      x: data.x,
      y: data.y,
      color: data.color,
    });
  }

  /* ---------- Spawn loop ---------- */

  function spawnLoop() {
    if (!state.isRunning) return;
    if (activeObjects.size < currentLevel.maxObjects) {
      spawnObject();
    }
    const delay = currentLevel.spawnDelay + rand(-100, 100);
    spawnTimer = setTimeout(spawnLoop, delay);
  }

  /* ---------- Click / miss handlers ---------- */

  function handleObjectClick(id) {
    if (!state.isRunning || state.targetReached) return;
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
    UI.showScorePopup(obj.x, obj.y, '+' + points, mult > 1);
    if (mult > 1 && state.combo >= 3) UI.showComboPopup(mult);
    UI.removeObject(obj.el, 'caught');

    /* check win condition */
    if (state.score >= currentLevel.targetScore) {
      state.targetReached = true;
      triggerLevelComplete();
    } else {
      UI.updateHUD(buildHudData());
    }
  }

  function handleObjectMiss(id) {
    if (!state.isRunning || state.targetReached) return;
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

  /* ---------- HUD payload ---------- */

  function buildHudData() {
    return {
      score: state.score,
      target: currentLevel.targetScore,
      elapsed: elapsed,
      lives: state.lives,
      combo: state.combo,
      progress: currentLevel.targetScore > 0
        ? Math.min(1, state.score / currentLevel.targetScore)
        : 0,
    };
  }

  /* ---------- Timer ---------- */

  function startTimer() {
    tickInterval = setInterval(function () {
      if (!state.isRunning) return;
      elapsed += 0.1;
      UI.updateHUD(buildHudData());
    }, 100);
  }

  /* ---------- Level complete ---------- */

  function triggerLevelComplete() {
    state.isRunning = false;
    clearTimeout(spawnTimer);
    clearInterval(tickInterval);

    activeObjects.clear();
    gameArea.querySelectorAll('.game-object').forEach(function (el) { el.remove(); });

    Audio.combo();

    var newlyUnlocked = Storage.completeLevel(currentLevel.id, state.score);

    setTimeout(function () {
      UI.showLevelComplete(currentLevel, {
        score: state.score,
        target: currentLevel.targetScore,
        elapsed: elapsed,
        maxCombo: state.maxCombo,
      }, newlyUnlocked);
    }, 400);
  }

  /* ---------- Game over ---------- */

  function endGame() {
    state.isRunning = false;
    clearTimeout(spawnTimer);
    clearInterval(tickInterval);

    activeObjects.clear();
    gameArea.querySelectorAll('.game-object').forEach(function (el) { el.remove(); });

    Audio.gameOver();

    UI.showGameOver(currentLevel, state.score);
  }

  /* ---------- Public API ---------- */

  function startLevel(levelConfig) {
    Audio.init();
    currentLevel = levelConfig;
    gameArea = document.getElementById('gameArea');

    resetState();
    state.isRunning = true;

    gameArea.innerHTML = '';
    UI.clearComboPopup();

    UI.showScreen('game');
    UI.updateLevelLabel(currentLevel);
    UI.updateHUD(buildHudData());
    Audio.startGame();

    startTimer();
    spawnLoop();
  }

  function getCurrentLevel() {
    return currentLevel;
  }

  return {
    startLevel: startLevel,
    getCurrentLevel: getCurrentLevel,
    isRunning: function () { return state.isRunning; },
  };
})();
