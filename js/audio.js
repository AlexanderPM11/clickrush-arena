/* ============================================================
   AUDIO — Web Audio API sound effects
   ============================================================ */

const Audio = (function () {
  let ctx = null;

  /**
   * Initialises (or resumes) the AudioContext.
   * Must be called from a user-gesture handler.
   */
  function init() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (_) { /* Web Audio not available */ }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  /**
   * Plays a single tone.
   * @param {number} freq    Hz
   * @param {number} dur     Seconds
   * @param {string} type    oscillator type
   * @param {number} vol     gain (0-1)
   */
  function tone(freq, dur, type, vol) {
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol || 0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (_) { /* ignore audio errors */ }
  }

  /* -- Public sound effects -- */

  /** Short click pop, pitch rises with combo level. */
  function click(comboLevel) {
    const base = 600 + Math.min(comboLevel * 40, 400);
    tone(base, 0.09, 'sine', 0.10);
    setTimeout(() => tone(base * 1.25, 0.07, 'sine', 0.06), 40);
  }

  /** Low buzz on miss. */
  function miss() {
    tone(180, 0.25, 'sawtooth', 0.06);
    tone(120, 0.35, 'square', 0.03);
  }

  /** Ascending arpeggio on combo. */
  function combo() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => tone(f, 0.1, 'sine', 0.08), i * 60);
    });
  }

  /** Descending tones on game over. */
  function gameOver() {
    [600, 500, 400, 300].forEach((f, i) => {
      setTimeout(() => tone(f, 0.2, 'sine', 0.08), i * 150);
    });
  }

  /** Cheerful ascending notes on start. */
  function startGame() {
    [400, 500, 600, 800].forEach((f, i) => {
      setTimeout(() => tone(f, 0.12, 'sine', 0.07), i * 80);
    });
  }

  /** Heavy thud when losing a life. */
  function lifeLost() {
    tone(300, 0.15, 'square', 0.05);
    tone(200, 0.3, 'square', 0.04);
  }

  return { init, click, miss, combo, gameOver, startGame, lifeLost };
})();
