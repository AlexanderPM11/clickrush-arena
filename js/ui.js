/* ============================================================
   UI — DOM manipulation, rendering and visual effects
   ============================================================ */

const UI = (function () {
  /* ---------- DOM references ---------- */
  let dom = {};

  /** Caches all frequently-used DOM nodes. */
  function cacheDom() {
    dom = {
      startScreen: document.getElementById('startScreen'),
      gameScreen: document.getElementById('gameScreen'),
      overScreen: document.getElementById('gameOverScreen'),
      gameArea: document.getElementById('gameArea'),
      scoreDisplay: document.getElementById('scoreDisplay'),
      timerDisplay: document.getElementById('timerDisplay'),
      comboDisplay: document.getElementById('comboDisplay'),
      livesDisplay: document.getElementById('livesDisplay'),
      bestScoreDisplay: document.getElementById('bestScoreDisplay'),
      finalScoreDisplay: document.getElementById('finalScoreDisplay'),
      finalBestDisplay: document.getElementById('finalBestDisplay'),
      finalBestContainer: document.getElementById('finalBestContainer'),
      comboPopup: document.getElementById('comboPopup'),
      shakeOverlay: document.getElementById('shakeOverlay'),
      difficultyFill: document.getElementById('difficultyFill'),
    };
  }

  /* ---------- Screen management ---------- */

  /**
   * Shows one screen, hides the others.
   * @param {'start'|'game'|'over'} name
   */
  function showScreen(name) {
    const map = { start: dom.startScreen, game: dom.gameScreen, over: dom.overScreen };
    Object.values(map).forEach((el) => el.classList.add('hidden'));
    const target = map[name];
    if (target) target.classList.remove('hidden');
  }

  /* ---------- HUD ---------- */

  /**
   * Updates all HUD elements from the game state.
   * @param {object} s  — subset of game state
   */
  function updateHUD(s) {
    dom.scoreDisplay.textContent = s.score.toLocaleString();

    /* elapsed time — counts up, formatted as m:ss */
    const mins = Math.floor(s.elapsed / 60);
    const secs = Math.floor(s.elapsed % 60);
    dom.timerDisplay.textContent = `${mins}:${String(secs).padStart(2, '0')}`;

    const mult = getMultiplier(s.combo);
    dom.comboDisplay.textContent = `x${mult}`;

    /* hearts */
    const hearts = dom.livesDisplay.querySelectorAll('.heart');
    hearts.forEach((h, i) => {
      h.classList.toggle('lost', i >= s.lives);
      h.classList.toggle('active', i < s.lives);
    });

    /* difficulty bar — how far into the difficulty curve */
    const pct = clamp(s.difficulty * 100, 0, 100);
    dom.difficultyFill.style.width = `${pct}%`;
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  /* ---------- Helpers ---------- */

  /**
   * Returns the score multiplier based on raw combo count.
   * @param {number} combo
   * @returns {number}
   */
  function getMultiplier(combo) {
    if (combo >= 10) return 4;
    if (combo >= 6) return 3;
    if (combo >= 3) return 2;
    return 1;
  }

  /* ---------- Object creation ---------- */

  const EMOJIS = ['★', '♦', '●', '◆', '✦', '⬟'];
  const COLORS = [
    '#ff3366', '#33ccff', '#ffcc00', '#00ff88',
    '#ff6600', '#cc44ff', '#ff4488', '#44ffcc',
  ];

  /**
   * Creates a clickable game-object element.
   * @param {object}   data      — { id, x, y, size, color, emoji }
   * @param {function} onHit     — called when the element is clicked/tapped
   * @returns {HTMLElement}
   */
  function createObject(data, onHit) {
    const el = document.createElement('div');
    el.className = 'game-object';
    el.dataset.id = data.id;
    el.style.width = `${data.size}px`;
    el.style.height = `${data.size}px`;
    el.style.left = `${data.x}px`;
    el.style.top = `${data.y}px`;
    el.style.background = `radial-gradient(circle at 35% 35%, ${data.color}dd, ${data.color}44)`;
    el.style.boxShadow = `0 0 ${data.size * 0.25}px ${data.color}88, inset 0 -2px 4px rgba(0,0,0,0.2)`;
    el.innerHTML =
      `<div class="glow-ring" style="color:${data.color}"></div><span class="emoji">${data.emoji}</span>`;

    el.addEventListener('click', (e) => { e.stopPropagation(); onHit(); });
    el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      onHit();
    }, { passive: false });

    /* trigger appear animation on next frame */
    requestAnimationFrame(() => el.classList.add('show'));

    return el;
  }

  /**
   * Removes an object element with a fade-out animation.
   * @param {HTMLElement} el
   * @param {'hide'|'caught'} anim
   */
  function removeObject(el, anim) {
    el.classList.remove('show');
    el.classList.add(anim || 'hide');
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
  }

  /* ---------- Particles ---------- */

  /**
   * Spawns a burst of coloured particles at (x, y).
   */
  function spawnParticles(x, y, color, count) {
    const area = dom.gameArea;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < (count || 10); i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const s = rand(4, 10);
      const angle = rand(0, Math.PI * 2);
      const dist = rand(40, 120);
      p.style.width = `${s}px`;
      p.style.height = `${s}px`;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.background = color;
      p.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      p.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      p.style.boxShadow = `0 0 6px ${color}`;
      frag.appendChild(p);
    }
    area.appendChild(frag);
    setTimeout(() => {
      area.querySelectorAll('.particle').forEach((el) => el.remove());
    }, 800);
  }

  /* ---------- Score popup ---------- */

  /**
   * Animated floating "+N" text at (x, y).
   */
  function showScorePopup(x, y, text, isCombo) {
    const el = document.createElement('div');
    el.className = `score-popup${isCombo ? ' combo' : ''}`;
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    dom.gameArea.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  }

  /* ---------- Combo popup ---------- */

  /**
   * Large centered combo announcement.
   */
  function showComboPopup(mult) {
    dom.comboPopup.textContent = `COMBO x${mult}`;
    dom.comboPopup.className = '';
    void dom.comboPopup.offsetWidth; /* force reflow to restart animation */
    dom.comboPopup.classList.add('show');
    setTimeout(() => dom.comboPopup.classList.remove('show'), 800);
  }

  /* ---------- Screen shake ---------- */

  function triggerShake() {
    dom.shakeOverlay.classList.remove('active');
    void dom.shakeOverlay.offsetWidth;
    dom.shakeOverlay.classList.add('active');
    setTimeout(() => dom.shakeOverlay.classList.remove('active'), 350);
  }

  /* ---------- Game over ---------- */

  /**
   * Populates the game-over screen.
   * @param {number}  score
   * @param {number}  best
   * @param {boolean} isNew
   */
  function showGameOver(score, best, isNew) {
    dom.finalScoreDisplay.textContent = score.toLocaleString();
    dom.finalBestDisplay.textContent = best.toLocaleString();
    dom.finalBestContainer.classList.toggle('new-record', isNew);

    let badge = dom.finalBestContainer.querySelector('.new-record-text');
    if (isNew) {
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'new-record-text';
        badge.textContent = '¡Nuevo récord!';
        dom.finalBestContainer.insertBefore(badge, dom.finalBestContainer.firstChild);
      }
    } else if (badge) {
      badge.remove();
    }

    /* transition after a brief delay so the player sees the last moment */
    setTimeout(() => showScreen('over'), 400);
  }

  /* ---------- Combo popup reset ---------- */

  function clearComboPopup() {
    dom.comboPopup.className = '';
    dom.comboPopup.textContent = '';
  }

  /* ---------- Utilities ---------- */

  function rand(min, max) { return Math.random() * (max - min) + min; }

  /**
   * Hooks up the combo-multiplier logic so game.js doesn't need to know about it.
   * This is used by game.js via the public API.
   */
  function getComboMultiplier(combo) {
    return getMultiplier(combo);
  }

  /* ---------- Init ---------- */

  cacheDom();

  /* ----- Public API ----- */
  return {
    showScreen,
    updateHUD,
    createObject,
    removeObject,
    spawnParticles,
    showScorePopup,
    showComboPopup,
    clearComboPopup,
    triggerShake,
    showGameOver,
    getComboMultiplier,
    /* expose helpers for particle generation */
    rand,
    COLORS,
    EMOJIS,
    /* access to game area for dimensions */
    getGameArea() { return dom.gameArea; },
  };
})();
