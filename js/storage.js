/* ============================================================
   STORAGE — localStorage wrapper for persistence
   ============================================================ */

const Storage = (function () {
  const KEY = 'clickfrenzy_best';

  return {
    /**
     * Returns the saved best score, or 0 if none exists.
     */
    getBestScore() {
      try {
        return parseInt(localStorage.getItem(KEY), 10) || 0;
      } catch (_) {
        return 0;
      }
    },

    /**
     * Persists a new best score.
     * @param {number} score
     */
    setBestScore(score) {
      try {
        localStorage.setItem(KEY, String(score));
      } catch (_) {
        /* storage may be full or disabled */
      }
    },

    /**
     * Compares and saves only if score is higher.
     * Returns true if a new record was set.
     * @param {number} score
     * @returns {boolean}
     */
    saveIfHigher(score) {
      const current = this.getBestScore();
      if (score > current) {
        this.setBestScore(score);
        return true;
      }
      return false;
    },
  };
})();
