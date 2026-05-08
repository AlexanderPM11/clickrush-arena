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

  /* ---------- Level map (horizontal adventure road) ---------- */

  function renderLevelMap(onPlayLevel) {
    var container = dom.levelMapContainer;
    container.innerHTML = '';

    var allLevels = Levels.getAll();
    var progress  = Storage.getProgress();
    var unlocked  = Storage.getUnlockedLevel();
    var total     = allLevels.length;

    /* ---- World definitions (5 levels each) ---- */
    var WORLDS = [
      { name: 'Novato',    color: '#33ccff' },
      { name: 'Intermedio', color: '#ffcc00' },
      { name: 'Avanzado',  color: '#ff6600' },
      { name: '\u00c9lite',  color: '#cc44ff' },
      { name: 'Leyenda',   color: '#ff3366' },
      { name: 'M\u00edtico',   color: '#ff0044' },
    ];
    var L = 5;
    var NW = WORLDS.length;

    /* ---- Dimensions ---- */
    var ch = container.clientHeight || 500;
    var spacing = 120;
    var worldGap = 80;
    var padL = 80;
    var padR = 80;
    var totalW = padL + total * spacing + (NW - 1) * worldGap + padR;
    var nodeR = 30;

    /* ---- Y positions along a sine wave ---- */
    var cy = ch * 0.44;
    var amp = ch * 0.28;
    var positions = [];
    var worldMidX = [];
    for (var w = 0; w < NW; w++) {
      var baseX = padL + w * (L * spacing + worldGap);
      worldMidX.push(baseX + (L * spacing) / 2);
      for (var j = 0; j < L; j++) {
        var i = w * L + j;
        var x = baseX + j * spacing;
        var y = cy + Math.sin(i * 0.55 + 0.3) * amp;
        y = clamp(y, nodeR + 20, ch - nodeR - 30);
        positions.push({ x: Math.round(x), y: Math.round(y) });
      }
    }

    /* ---- World container ---- */
    var world = document.createElement('div');
    world.className = 'map-world';
    world.style.width = totalW + 'px';
    world.style.height = '100%';
    container.appendChild(world);

    /* ---- SVG gradient defs (one per world) ---- */
    var S = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(S, 'svg');
    svg.setAttribute('class', 'map-svg-layer');
    svg.setAttribute('width', totalW);
    svg.setAttribute('height', ch);
    svg.setAttribute('viewBox', '0 0 ' + totalW + ' ' + ch);
    world.appendChild(svg);

    var defs = document.createElementNS(S, 'defs');
    var defHTML = '';
    for (w = 0; w < NW; w++) {
      var c = WORLDS[w].color;
      defHTML +=
        '<linearGradient id="wg' + w + '" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="' + c + '"/>' +
        '<stop offset="100%" stop-color="' + c + '" stop-opacity="0.5"/>' +
        '</linearGradient>';
    }
    defHTML +=
      '<linearGradient id="pathGradient" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="#00ff88"/>' +
      '<stop offset="100%" stop-color="#33ccff"/>' +
      '</linearGradient>';
    defs.innerHTML = defHTML;
    svg.appendChild(defs);

    /* ---- Draw path segments ---- */
    for (var i = 0; i < total - 1; i++) {
      var cur = positions[i];
      var nxt = positions[i + 1];
      var midY = (cur.y + nxt.y) / 2;
      var d = 'M ' + cur.x + ' ' + cur.y +
              ' C ' + cur.x + ' ' + midY +
              ', ' + nxt.x + ' ' + midY +
              ', ' + nxt.x + ' ' + nxt.y;

      var path = document.createElementNS(S, 'path');
      path.setAttribute('d', d);

      var levelId = allLevels[i].id;
      var isCompleted = progress.completedLevels.indexOf(levelId) !== -1;
      var isNextUnlocked = i + 1 < total && allLevels[i + 1].id <= unlocked;
      var widx = Math.floor(i / L);

      if (isCompleted) {
        path.setAttribute('class', 'path-completed');
        path.setAttribute('stroke', 'url(#wg' + widx + ')');
      } else if (isNextUnlocked) {
        path.setAttribute('class', 'path-available');
        path.setAttribute('stroke', WORLDS[widx].color);
      } else {
        path.setAttribute('class', 'path-locked');
      }

      svg.appendChild(path);
    }

    /* ---- World labels & dividers ---- */
    for (w = 0; w < NW; w++) {
      var midX = worldMidX[w];
      var label = document.createElement('div');
      label.className = 'world-label';
      label.textContent = WORLDS[w].name;
      label.style.left = midX + 'px';
      label.style.setProperty('--wcolor', WORLDS[w].color);
      world.appendChild(label);

      if (w > 0) {
        var divX = midX - (L * spacing) / 2 - worldGap / 2;
        var div = document.createElement('div');
        div.className = 'world-divider';
        div.style.left = divX + 'px';
        world.appendChild(div);
      }
    }

    /* ---- Decorative elements ---- */
    var decoCount = Math.min(40, Math.floor(total * 1.3));
    for (i = 0; i < decoCount; i++) {
      var el = document.createElement('div');
      var types = ['star','crystal','glow','diamond'];
      var t = types[i % types.length];
      el.className = 'map-deco ' + t;
      var dx = 20 + Math.random() * (totalW - 40);
      var dy = 10 + Math.random() * (ch - 20);
      el.style.left = dx + 'px';
      el.style.top  = dy + 'px';
      el.style.setProperty('--dur', (2 + Math.random() * 3) + 's');
      el.style.setProperty('--delay', (Math.random() * 4) + 's');
      if (t === 'star') {
        var sz = 1.5 + Math.random() * 2.5;
        el.style.width = sz + 'px';
        el.style.height = sz + 'px';
      }
      world.appendChild(el);
    }

    /* ---- Render nodes ---- */
    var frag = document.createDocumentFragment();

    for (i = 0; i < total; i++) {
      (function (idx) {
        var level = allLevels[idx];
        var pos   = positions[idx];
        var isUnlocked  = level.id <= unlocked;
        var isCompleted = progress.completedLevels.indexOf(level.id) !== -1;
        var isCurrent   = level.id === unlocked && !isCompleted;
        var bestScore   = progress.bestScores[level.id] || 0;
        var widx = Math.floor(idx / L);

        var node = document.createElement('div');
        node.className = 'level-node';
        if (isCompleted) node.classList.add('completed');
        else if (isUnlocked) node.classList.add('available');
        else node.classList.add('locked');
        if (isUnlocked) node.classList.add('clickable');
        if (isCurrent) node.classList.add('current');

        node.style.left = pos.x + 'px';
        node.style.top  = pos.y + 'px';
        node.style.setProperty('--wcolor', WORLDS[widx].color);

        node.style.animation = 'node-enter 0.3s ease ' + (idx * 0.025) + 's both';

        var circleDelay = (idx * 0.025 + 0.05).toFixed(3);
        node.innerHTML =
          '<div class="node-circle" style="animation:node-circle-enter 0.35s cubic-bezier(0.34,1.56,0.64,1) ' + circleDelay + 's both">' + level.id + '</div>' +
          '<div class="node-info">' +
            '<span class="node-name">' + level.name + '</span>' +
            '<span class="node-score">' + level.targetScore + ' pts</span>' +
            (bestScore > 0 ? '<span class="node-best">\u2605 ' + bestScore + '</span>' : '') +
          '</div>';

        if (isUnlocked) {
          node.addEventListener('click', function (e) {
            if (_mapDragActive) return;
            onPlayLevel(level.id);
          });
        }

        frag.appendChild(node);
      })(i);
    }

    world.appendChild(frag);

    /* ---- Auto-scroll to current level ---- */
    var current = Game.getCurrentLevel();
    var targetIdx = current ? current.id - 1 : unlocked - 1;
    var tp = positions[targetIdx];
    if (tp) {
      var scrollTo = Math.max(0, tp.x - container.clientWidth * 0.3);
      setTimeout(function () {
        container.scrollLeft = scrollTo;
      }, 150);
    }

    /* ---- Hook up horizontal scroll (wheel + drag) ---- */
    setupMapScroll(container);
  }

  /* ---------- Horizontal map scroll (wheel, click-drag, trackpad) ---------- */

  var _mapScrollCleanup = null;
  var _mapDragActive = false;

  function setupMapScroll(container) {
    /* tear down previous */
    if (_mapScrollCleanup) { _mapScrollCleanup(); _mapScrollCleanup = null; }

    /* ---- Inertia-based wheel scrolling ---- */
    var velocity = 0;
    var animId = null;

    function tick() {
      if (Math.abs(velocity) < 0.5) {
        velocity = 0;
        animId = null;
        return;
      }
      container.scrollLeft += velocity;
      velocity *= 0.90;
      animId = requestAnimationFrame(tick);
    }

    function onWheel(e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();

      var delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      if (e.deltaMode === 2) delta *= window.innerHeight;

      velocity += delta * 0.35;
      velocity = Math.max(-80, Math.min(80, velocity));

      if (!animId) animId = requestAnimationFrame(tick);
    }

    container.addEventListener('wheel', onWheel, { passive: false });

    /* ---- Click + drag panning ---- */
    var isDown = false;
    var startX = 0;
    var startScroll = 0;
    var dragVelocity = 0;
    var dragAnimId = null;
    var lastMoveTime = 0;
    var lastMoveX = 0;

    function dragTick() {
      if (Math.abs(dragVelocity) < 0.5) {
        dragVelocity = 0;
        dragAnimId = null;
        return;
      }
      container.scrollLeft += dragVelocity;
      dragVelocity *= 0.93;
      dragAnimId = requestAnimationFrame(dragTick);
    }

    function onDown(e) {
      if (e.button !== 0) return;
      if (dragAnimId) { cancelAnimationFrame(dragAnimId); dragAnimId = null; }
      dragVelocity = 0;
      _mapDragActive = false;
      isDown = true;
      startX = e.clientX;
      startScroll = container.scrollLeft;
      lastMoveTime = Date.now();
      lastMoveX = e.clientX;
      container.style.cursor = 'grabbing';
      container.style.userSelect = 'none';
    }

    function onMove(e) {
      if (!isDown) return;
      e.preventDefault();
      var dx = e.clientX - startX;
      container.scrollLeft = startScroll - dx;
      if (Math.abs(dx) > 4) _mapDragActive = true;
      var now = Date.now();
      var dt = now - lastMoveTime;
      if (dt > 0) {
        dragVelocity = (lastMoveX - e.clientX) / Math.max(16, dt) * 8;
      }
      lastMoveTime = now;
      lastMoveX = e.clientX;
    }

    function onUp() {
      if (!isDown) return;
      isDown = false;
      container.style.cursor = '';
      container.style.userSelect = '';
      setTimeout(function () { _mapDragActive = false; }, 50);
      if (!dragAnimId && Math.abs(dragVelocity) > 0.5) {
        dragAnimId = requestAnimationFrame(dragTick);
      }
    }

    container.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);

    /* ---- Cleanup ---- */
    _mapScrollCleanup = function () {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('mousedown', onDown);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      if (animId) cancelAnimationFrame(animId);
      if (dragAnimId) cancelAnimationFrame(dragAnimId);
      container.style.cursor = '';
      container.style.userSelect = '';
    };
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
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

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
