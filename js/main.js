/* ============================================================
   MAIN — Entry point, event binding, initialisation
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM refs ---------- */
  const playBtn    = document.getElementById('playBtn');
  const restartBtn = document.getElementById('restartBtn');
  const homeBtn    = document.getElementById('homeBtn');

  /* ---------- Button handlers ---------- */

  playBtn.addEventListener('click', () => Game.start());
  restartBtn.addEventListener('click', () => Game.start());

  homeBtn.addEventListener('click', () => {
    UI.showScreen('start');
    document.getElementById('bestScoreDisplay').textContent =
      Storage.getBestScore().toLocaleString();
  });

  /* ---------- Keyboard shortcuts ---------- */

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const visibleBtn = document.querySelector('.screen:not(.hidden) .btn-primary');
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

  console.log('Click Frenzy loaded — good luck!');
})();
