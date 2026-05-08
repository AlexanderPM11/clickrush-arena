/* ============================================================
   MAIN — Entry point, event binding, navigation
   ============================================================ */

(function () {
  'use strict';

  var playBtn       = document.getElementById('playBtn');
  var restartBtn    = document.getElementById('restartBtn');
  var homeBtn       = document.getElementById('homeBtn');
  var mapHomeBtn    = document.getElementById('mapHomeBtn');
  var nextLevelBtn  = document.getElementById('nextLevelBtn');
  var completeMapBtn = document.getElementById('completeMapBtn');

  /* ---------- Navigation helpers ---------- */

  function goToLevelMap() {
    UI.renderLevelMap(function (levelId) {
      var level = Levels.getById(levelId);
      if (level && Storage.isLevelUnlocked(levelId)) {
        Game.startLevel(level);
      }
    });
    UI.showScreen('level-map');
  }

  function goToStart() {
    document.getElementById('bestScoreDisplay').textContent =
      Storage.getBestScore().toLocaleString();
    UI.showScreen('start');
  }

  /* ---------- Button handlers ---------- */

  playBtn.addEventListener('click', goToLevelMap);

  restartBtn.addEventListener('click', function () {
    var level = Game.getCurrentLevel();
    if (level) Game.startLevel(level);
    else goToLevelMap();
  });

  homeBtn.addEventListener('click', goToLevelMap);

  mapHomeBtn.addEventListener('click', goToStart);

  nextLevelBtn.addEventListener('click', function () {
    var current = Game.getCurrentLevel();
    if (current) {
      var next = Levels.getById(current.id + 1);
      if (next) {
        Game.startLevel(next);
        return;
      }
    }
    goToLevelMap();
  });

  completeMapBtn.addEventListener('click', goToLevelMap);

  /* ---------- Keyboard ---------- */

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      var visibleBtn = document.querySelector('.screen:not(.hidden) .btn-primary');
      if (visibleBtn) {
        visibleBtn.click();
        e.preventDefault();
      }
    }
  });

  /* ---------- Audio warm-up ---------- */

  function warmAudio() { Audio.init(); }
  document.addEventListener('click', warmAudio, { once: true });
  document.addEventListener('touchstart', warmAudio, { once: true });

  /* ---------- Init ---------- */

  document.getElementById('bestScoreDisplay').textContent =
    Storage.getBestScore().toLocaleString();

  UI.showScreen('start');

  console.log('Click Frenzy loaded \u2014 good luck!');
})();
