/* ============================================================
   UI — DOM manipulation, rendering, screens, effects
   ============================================================ */

const UI = (function () {
  /* ---------- DOM cache ---------- */
  var dom = {};

  function cacheDom() {
    dom = {
      startScreen:         document.getElementById('startScreen'),
      levelMapScreen:      document.getElementById('levelMapScreen'),
      gameScreen:          document.getElementById('gameScreen'),
      levelCompleteScreen: document.getElementById('levelCompleteScreen'),
      overScreen:          document.getElementById('gameOverScreen'),
      gameArea:            document.getElementById('gameArea'),
      levelMapContainer:   document.getElementById('levelMapContainer'),
      scoreDisplay:        document.getElementById('scoreDisplay'),
      timerDisplay:        document.getElementById('timerDisplay'),
      comboDisplay:        document.getElementById('comboDisplay'),
      livesDisplay:        document.getElementById('livesDisplay'),
      levelLabel:          document.getElementById('levelLabel'),
      targetFill:          document.getElementById('targetFill'),
      comboPopup:          document.getElementById('comboPopup'),
      shakeOverlay:        document.getElementById('shakeOverlay'),

      /* level complete */
      completeLevelInfo:   document.getElementById('completeLevelInfo'),
      completeScore:       document.getElementById('completeScore'),
      completeTarget:      document.getElementById('completeTarget'),
      completeTime:        document.getElementById('completeTime'),
      completeCombo:       document.getElementById('completeCombo'),
      allCompleteMessage:  document.getElementById('allCompleteMessage'),

      /* game over */
      finalScoreDisplay:   document.getElementById('finalScoreDisplay'),
      finalTargetDisplay:  document.getElementById('finalTargetDisplay'),
      gameOverLevelInfo:   document.getElementById('gameOverLevelInfo'),

      /* map */
      mapHomeBtn:          document.getElementById('mapHomeBtn'),
    };
  }

  /* ---------- Screens ---------- */

  var SCREENS = [
    'start', 'level-map', 'game', 'level-complete', 'over',
  ];

  function showScreen(name) {
    var map = {
      'start':           dom.startScreen,
      'level-map':       dom.levelMapScreen,
      'game':            dom.gameScreen,
      'level-complete':  dom.levelCompleteScreen,
      'over':            dom.overScreen,
    };
    SCREENS.forEach(function (k) {
      if (map[k]) map[k].classList.add('hidden');
    });
    var target = map[name];
    if (target) target.classList.remove('hidden');
  }

  /* ---------- HUD ---------- */

  function updateHUD(s) {
    dom.scoreDisplay.textContent = s.score.toLocaleString();

    /* timer (counts up) */
    var mins = Math.floor(s.elapsed / 60);
    var secs = Math.floor(s.elapsed % 60);
    dom.timerDisplay.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;

    /* combo multiplier */
    dom.comboDisplay.textContent = 'x' + getMultiplier(s.combo);

    /* hearts */
    var hearts = dom.livesDisplay.querySelectorAll('.heart');
    hearts.forEach(function (h, i) {
      h.classList.toggle('lost', i >= s.lives);
      h.classList.toggle('active', i < s.lives);
    });

    /* target progress bar */
    if (dom.targetFill) {
      dom.targetFill.style.width = (s.progress * 100).toFixed(1) + '%';
    }
  }

  function updateLevelLabel(level) {
    if (dom.levelLabel) {
      dom.levelLabel.textContent = 'Nivel ' + level.id + ' \u2014 ' + level.name;
    }
  }

  /* ---------- Multiplier ---------- */

  function getMultiplier(combo) {
    if (combo >= 10) return 4;
    if (combo >= 6)  return 3;
    if (combo >= 3)  return 2;
    return 1;
  }

  function getComboMultiplier(combo) {
    return getMultiplier(combo);
  }

  /* ---------- Level map ---------- */

  function renderLevelMap(onPlayLevel) {
    var container = dom.levelMapContainer;
    container.innerHTML = '';

    var allLevels = Levels.getAll();
    var progress  = Storage.getProgress();
    var unlocked  = Storage.getUnlockedLevel();

    var frag = document.createDocumentFragment();

    allLevels.forEach(function (level, idx) {
      var isUnlocked  = level.id <= unlocked;
      var isCompleted = progress.completedLevels.indexOf(level.id) !== -1;
      var bestScore   = progress.bestScores[level.id] || 0;

      /* node */
      var node = document.createElement('div');
      node.className = 'level-node';
      if (isCompleted) node.classList.add('completed');
      else if (isUnlocked) node.classList.add('available');
      else node.classList.add('locked');

      node.innerHTML =
        '<div class="node-circle">' + level.id + '</div>' +
        '<div class="node-info">' +
          '<span class="node-name">' + level.name + '</span>' +
          '<span class="node-target">' + level.targetScore + ' pts</span>' +
          (bestScore > 0
            ? '<span class="node-best">Mejor: ' + bestScore + '</span>'
            : '') +
        '</div>';

      if (isUnlocked) {
        node.addEventListener('click', function () {
          onPlayLevel(level.id);
        });
      }

      frag.appendChild(node);

      /* connector (not after last node) */
      if (idx < allLevels.length - 1) {
        var conn = document.createElement('div');
        conn.className = 'level-connector';
        if (isCompleted) conn.classList.add('completed');
        frag.appendChild(conn);
      }
    });

    container.appendChild(frag);
  }

  /* ---------- Objects ---------- */

  var EMOJIS = ['\u2605', '\u2666', '\u25CF', '\u25C6', '\u2726', '\u2B1F'];
  var COLORS = [
    '#ff3366', '#33ccff', '#ffcc00', '#00ff88',
    '#ff6600', '#cc44ff', '#ff4488', '#44ffcc',
  ];

  function createObject(data, onHit, lifetime) {
    var el = document.createElement('div');
    el.className = 'game-object';
    el.dataset.id = data.id;
    el.style.width   = data.size + 'px';
    el.style.height  = data.size + 'px';
    el.style.left    = data.x + 'px';
    el.style.top     = data.y + 'px';
    el.style.background = 'radial-gradient(circle at 35% 35%, ' +
      data.color + 'dd, ' + data.color + '44)';
    el.style.boxShadow = '0 0 ' + (data.size * 0.25).toFixed(0) + 'px ' +
      data.color + '88, inset 0 -2px 4px rgba(0,0,0,0.2)';

    el.innerHTML =
      '<div class="glow-ring" style="color:' + data.color + '"></div>' +
      '<div class="object-timer" style="animation-duration:' + lifetime + 'ms"></div>' +
      '<span class="emoji">' + data.emoji + '</span>';

    el.addEventListener('click', function (e) { e.stopPropagation(); onHit(); });
    el.addEventListener('touchstart', function (e) {
      e.preventDefault();
      e.stopPropagation();
      onHit();
    }, { passive: false });

    requestAnimationFrame(function () { el.classList.add('show'); });
    return el;
  }

  function removeObject(el, anim) {
    el.classList.remove('show');
    el.classList.add(anim || 'hide');
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 400);
  }

  /* ---------- Particles ---------- */

  function spawnParticles(x, y, color, count) {
    var area = dom.gameArea;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < (count || 10); i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var s   = rand(4, 10);
      var ang = rand(0, Math.PI * 2);
      var dist = rand(40, 120);
      p.style.width  = s + 'px';
      p.style.height = s + 'px';
      p.style.left   = x + 'px';
      p.style.top    = y + 'px';
      p.style.background = color;
      p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
      p.style.boxShadow = '0 0 6px ' + color;
      frag.appendChild(p);
    }
    area.appendChild(frag);
    setTimeout(function () {
      area.querySelectorAll('.particle').forEach(function (el) { el.remove(); });
    }, 800);
  }

  /* ---------- Score popup ---------- */

  function showScorePopup(x, y, text, isCombo) {
    var el = document.createElement('div');
    el.className = 'score-popup' + (isCombo ? ' combo' : '');
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    dom.gameArea.appendChild(el);
    setTimeout(function () { el.remove(); }, 1100);
  }

  /* ---------- Combo popup ---------- */

  function showComboPopup(mult) {
    dom.comboPopup.textContent = 'COMBO x' + mult;
    dom.comboPopup.className = '';
    void dom.comboPopup.offsetWidth;
    dom.comboPopup.classList.add('show');
    setTimeout(function () { dom.comboPopup.classList.remove('show'); }, 800);
  }

  function clearComboPopup() {
    dom.comboPopup.className = '';
    dom.comboPopup.textContent = '';
  }

  /* ---------- Shake ---------- */

  function triggerShake() {
    dom.shakeOverlay.classList.remove('active');
    void dom.shakeOverlay.offsetWidth;
    dom.shakeOverlay.classList.add('active');
    setTimeout(function () { dom.shakeOverlay.classList.remove('active'); }, 350);
  }

  /* ---------- Level complete ---------- */

  function showLevelComplete(level, stats, newlyUnlocked) {
    dom.completeLevelInfo.textContent = 'Nivel ' + level.id + ' \u2014 ' + level.name;
    dom.completeScore.textContent  = stats.score.toLocaleString();
    dom.completeTarget.textContent = stats.target.toLocaleString();

    var mins = Math.floor(stats.elapsed / 60);
    var secs = Math.floor(stats.elapsed % 60);
    dom.completeTime.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
    dom.completeCombo.textContent = 'x' + stats.maxCombo;

    var isLast = level.id >= Levels.getTotalLevels();
    var allMsg = dom.allCompleteMessage;
    if (isLast) {
      allMsg.classList.remove('hidden');
    } else {
      allMsg.classList.add('hidden');
    }

    showScreen('level-complete');
  }

  /* ---------- Game over (level context) ---------- */

  function showGameOver(level, score) {
    dom.gameOverLevelInfo.textContent = 'Nivel ' + level.id + ' \u2014 ' + level.name;
    dom.finalScoreDisplay.textContent = score.toLocaleString();
    dom.finalTargetDisplay.textContent = level.targetScore.toLocaleString();
    showScreen('over');
  }

  /* ---------- Utils ---------- */

  function rand(min, max) { return Math.random() * (max - min) + min; }

  /* ---------- Init ---------- */

  cacheDom();

  /* ---------- Public API ---------- */
  return {
    showScreen: showScreen,
    updateHUD: updateHUD,
    updateLevelLabel: updateLevelLabel,
    renderLevelMap: renderLevelMap,
    createObject: createObject,
    removeObject: removeObject,
    spawnParticles: spawnParticles,
    showScorePopup: showScorePopup,
    showComboPopup: showComboPopup,
    clearComboPopup: clearComboPopup,
    triggerShake: triggerShake,
    showLevelComplete: showLevelComplete,
    showGameOver: showGameOver,
    getComboMultiplier: getComboMultiplier,
    rand: rand,
    COLORS: COLORS,
    EMOJIS: EMOJIS,
    getGameArea: function () { return dom.gameArea; },
  };
})();
