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
      completeLevelInfo:   document.getElementById('completeLevelInfo'),
      completeScore:       document.getElementById('completeScore'),
      completeTarget:      document.getElementById('completeTarget'),
      completeTime:        document.getElementById('completeTime'),
      completeCombo:       document.getElementById('completeCombo'),
      allCompleteMessage:  document.getElementById('allCompleteMessage'),
      finalScoreDisplay:   document.getElementById('finalScoreDisplay'),
      finalTargetDisplay:  document.getElementById('finalTargetDisplay'),
      gameOverLevelInfo:   document.getElementById('gameOverLevelInfo'),
      mapHomeBtn:          document.getElementById('mapHomeBtn'),
    };
  }

  /* ---------- Screens ---------- */

  var SCREENS = ['start','level-map','game','level-complete','over'];

  function showScreen(name) {
    var map = {
      start: dom.startScreen, 'level-map': dom.levelMapScreen,
      game: dom.gameScreen, 'level-complete': dom.levelCompleteScreen,
      over: dom.overScreen,
    };
    SCREENS.forEach(function (k) { if (map[k]) map[k].classList.add('hidden'); });
    var t = map[name];
    if (t) t.classList.remove('hidden');
  }

  /* ---------- HUD ---------- */

  function updateHUD(s) {
    dom.scoreDisplay.textContent = s.score.toLocaleString();
    var mins = Math.floor(s.elapsed / 60);
    var secs = Math.floor(s.elapsed % 60);
    dom.timerDisplay.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
    dom.comboDisplay.textContent = 'x' + getMultiplier(s.combo);
    var hearts = dom.livesDisplay.querySelectorAll('.heart');
    hearts.forEach(function (h, i) { h.classList.toggle('lost', i >= s.lives); });
    if (dom.targetFill) dom.targetFill.style.width = (s.progress * 100).toFixed(1) + '%';
  }

  function updateLevelLabel(level) {
    if (dom.levelLabel) dom.levelLabel.textContent = 'Nivel ' + level.id + ' \u2014 ' + level.name;
  }

  /* ---------- Multiplier ---------- */

  function getMultiplier(combo) {
    if (combo >= 10) return 4;
    if (combo >= 6)  return 3;
    if (combo >= 3)  return 2;
    return 1;
  }

  function getComboMultiplier(combo) { return getMultiplier(combo); }

  /* ---------- Icon helpers (delegated to Icons module) ---------- */

  function getRandomIcon() {
    return Icons.getRandom();
  }

  function getRandomIconColor() {
    var colors = [
      '#ff3366','#33ccff','#ffcc00','#00ff88','#ff6600',
      '#cc44ff','#ff4488','#44ffcc','#ff9900','#66ffcc',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  function makeIconSVG(pathD) {
    return Icons.makeSVG(pathD);
  }

  /* ---------- Level map (curvy SVG path) ---------- */

  function renderLevelMap(onPlayLevel) {
    var container = dom.levelMapContainer;
    container.innerHTML = '';

    var allLevels = Levels.getAll();
    var progress  = Storage.getProgress();
    var unlocked  = Storage.getUnlockedLevel();

    var total = allLevels.length;
    var cw = container.clientWidth || 380;
    var nodeSize = 64;
    var margin = 24;
    var rowH = 86;

    /* calculate positions */
    var positions = [];
    for (var i = 0; i < total; i++) {
      var isRight = i % 2 === 0;
      var x = isRight ? cw - margin - nodeSize / 2 : margin + nodeSize / 2;
      var y = 50 + i * rowH;
      positions.push({
        cx: Math.round(x),
        cy: Math.round(y),
        left: Math.round(x - nodeSize / 2),
        top: Math.round(y - nodeSize / 2),
        side: isRight ? 'right' : 'left',
      });
    }

    var totalH = positions[total - 1].top + nodeSize + 40;
    container.style.height = totalH + 'px';
    container.style.position = 'relative';

    /* SVG gradient defs */
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'map-svg-layer');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', totalH);
    svg.setAttribute('viewBox', '0 0 ' + cw + ' ' + totalH);
    container.appendChild(svg);

    var defs = document.createElementNS(svgNS, 'defs');
    defs.innerHTML =
      '<linearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#00ff88"/>' +
        '<stop offset="100%" stop-color="#33ccff"/>' +
      '</linearGradient>';
    svg.appendChild(defs);

    /* draw path segments */
    for (i = 0; i < total - 1; i++) {
      var curr = positions[i];
      var next = positions[i + 1];
      var midY = (curr.cy + next.cy) / 2;

      var d = 'M ' + curr.cx + ' ' + curr.cy +
              ' C ' + curr.cx + ' ' + midY +
              ', ' + next.cx + ' ' + midY +
              ', ' + next.cx + ' ' + next.cy;

      var path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', d);

      var levelId = allLevels[i].id;
      var isCompleted = progress.completedLevels.indexOf(levelId) !== -1;
      var isNextUnlocked = allLevels[i + 1].id <= unlocked;

      if (isCompleted) {
        path.setAttribute('class', 'path-completed');
      } else if (isNextUnlocked) {
        path.setAttribute('class', 'path-available');
      } else {
        path.setAttribute('class', 'path-locked');
      }

      svg.appendChild(path);
    }

    /* render nodes */
    var frag = document.createDocumentFragment();

    for (i = 0; i < total; i++) {
      (function (idx) {
        var level = allLevels[idx];
        var pos = positions[idx];
        var isUnlocked  = level.id <= unlocked;
        var isCompleted = progress.completedLevels.indexOf(level.id) !== -1;
        var bestScore   = progress.bestScores[level.id] || 0;

        var node = document.createElement('div');
        node.className = 'level-node';
        if (isCompleted) node.classList.add('completed');
        else if (isUnlocked) node.classList.add('available');
        else node.classList.add('locked');
        if (isUnlocked) node.classList.add('clickable');

        node.style.left = pos.left + 'px';
        node.style.top  = pos.top + 'px';
        node.style.animation = 'node-enter 0.35s ease ' + (idx * 0.04) + 's both';

        node.innerHTML =
          '<div class="node-circle">' + level.id + '</div>' +
          '<div class="node-info">' +
            '<span class="node-name">' + level.name + '</span>' +
            '<span class="node-score">' + level.targetScore + ' pts</span>' +
            (bestScore > 0 ? '<span class="node-best">\u2605 ' + bestScore + '</span>' : '') +
          '</div>';

        if (isUnlocked) {
          node.addEventListener('click', function () { onPlayLevel(level.id); });
        }

        frag.appendChild(node);
      })(i);
    }

    container.appendChild(frag);

    /* decorative sparkles on completed paths */
    var sparkleCount = Math.min(8, progress.completedLevels.length * 2);
    for (var s = 0; s < sparkleCount; s++) {
      var spark = document.createElement('div');
      spark.style.cssText =
        'position:absolute;width:4px;height:4px;border-radius:50%;' +
        'background:#00ff88;pointer-events:none;z-index:3;' +
        'box-shadow:0 0 6px #00ff88;' +
        'animation:sparkle ' + (1.5 + Math.random() * 2) + 's ease ' + (Math.random() * 2) + 's infinite;' +
        'left:' + (margin + Math.random() * (cw - margin * 2)) + 'px;' +
        'top:' + (50 + Math.random() * (totalH - 100)) + 'px;';
      container.appendChild(spark);
    }
  }

  /* ---------- Game object creation ---------- */

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
    el.style.boxShadow = '0 0 ' + (data.size * 0.28).toFixed(0) + 'px ' +
      data.color + '88, 0 0 ' + (data.size * 0.5).toFixed(0) + 'px ' +
      data.color + '22, inset 0 -3px 6px rgba(0,0,0,0.2)';

    var iconSvg = makeIconSVG(data.icon);

    el.innerHTML =
      '<div class="glow-ring" style="color:' + data.color + '"></div>' +
      '<div class="object-timer" style="animation-duration:' + lifetime + 'ms"></div>' +
      '<span class="obj-icon">' + iconSvg + '</span>';

    el.addEventListener('click', function (e) { e.stopPropagation(); onHit(); });
    el.addEventListener('touchstart', function (e) {
      e.preventDefault(); e.stopPropagation(); onHit();
    }, { passive: false });

    requestAnimationFrame(function () { el.classList.add('show'); });
    return el;
  }

  function removeObject(el, anim) {
    el.classList.remove('show');
    el.classList.add(anim || 'hide');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 400);
  }

  /* ---------- Particles ---------- */

  function spawnParticles(x, y, color, count) {
    var area = dom.gameArea;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < (count || 10); i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var s   = rand(3, 9);
      var ang = rand(0, Math.PI * 2);
      var dist = rand(35, 110);
      p.style.width  = s + 'px';
      p.style.height = s + 'px';
      p.style.left   = x + 'px';
      p.style.top    = y + 'px';
      p.style.background = color;
      p.style.setProperty('--dx', Math.cos(ang) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(ang) * dist + 'px');
      p.style.boxShadow = '0 0 5px ' + color;
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

  function showLevelComplete(level, stats) {
    dom.completeLevelInfo.textContent = 'Nivel ' + level.id + ' \u2014 ' + level.name;
    dom.completeScore.textContent  = stats.score.toLocaleString();
    dom.completeTarget.textContent = stats.target.toLocaleString();
    var mins = Math.floor(stats.elapsed / 60);
    var secs = Math.floor(stats.elapsed % 60);
    dom.completeTime.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
    dom.completeCombo.textContent = 'x' + stats.maxCombo;
    var isLast = level.id >= Levels.getTotalLevels();
    var allMsg = dom.allCompleteMessage;
    if (isLast) allMsg.classList.remove('hidden');
    else allMsg.classList.add('hidden');
    showScreen('level-complete');
  }

  /* ---------- Game over ---------- */

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
    getRandomIcon: getRandomIcon,
    getRandomIconColor: getRandomIconColor,
    getGameArea: function () { return dom.gameArea; },
  };
})();
