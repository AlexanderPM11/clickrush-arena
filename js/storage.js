/* ============================================================
   STORAGE — localStorage wrapper for best score & level progress
   ============================================================ */

const Storage = (function () {
  const BEST_KEY  = 'clickfrenzy_best';
  const LEVEL_KEY = 'clickfrenzy_levels';

  /* ---------- Best score (legacy) ---------- */

  function getBestScore() {
    try {
      return parseInt(localStorage.getItem(BEST_KEY), 10) || 0;
    } catch (_) { return 0; }
  }

  function setBestScore(score) {
    try { localStorage.setItem(BEST_KEY, String(score)); } catch (_) {}
  }

  function saveIfHigher(score) {
    const current = getBestScore();
    if (score > current) { setBestScore(score); return true; }
    return false;
  }

  /* ---------- Level progress ---------- */

  /**
   * Returns the persisted progress object.
   * Shape: { completedLevels: number[], bestScores: Record<number, number> }
   */
  function getProgress() {
    try {
      const raw = localStorage.getItem(LEVEL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
          bestScores: (parsed.bestScores && typeof parsed.bestScores === 'object') ? parsed.bestScores : {},
        };
      }
    } catch (_) {}
    return { completedLevels: [], bestScores: {} };
  }

  function saveProgress(data) {
    try { localStorage.setItem(LEVEL_KEY, JSON.stringify(data)); } catch (_) {}
  }

  /** Highest level ID the player can play (starts at 1). */
  function getUnlockedLevel() {
    const p = getProgress();
    if (p.completedLevels.length === 0) return 1;
    return Math.max.apply(null, p.completedLevels) + 1;
  }

  function isLevelUnlocked(id) {
    return id <= getUnlockedLevel();
  }

  function isLevelCompleted(id) {
    const p = getProgress();
    return p.completedLevels.indexOf(id) !== -1;
  }

  /**
   * Marks a level as completed and stores the score.
   * Returns true if this unlocked a new level.
   */
  function completeLevel(id, score) {
    const p = getProgress();
    const alreadyDone = p.completedLevels.indexOf(id) !== -1;

    if (!alreadyDone) {
      p.completedLevels.push(id);
    }

    const prevBest = p.bestScores[id] || 0;
    if (score > prevBest) {
      p.bestScores[id] = score;
    }

    saveProgress(p);

    /* check if a new level was just unlocked */
    const newlyUnlocked = !alreadyDone && (id === Levels.getTotalLevels() || isLevelUnlocked(id + 1));
    return !alreadyDone;
  }

  /** Returns the best score for a given level (or 0). */
  function getLevelBestScore(id) {
    const p = getProgress();
    return p.bestScores[id] || 0;
  }

  /* ---------- Public API ---------- */
  return {
    getBestScore,
    setBestScore,
    saveIfHigher,
    getProgress,
    getUnlockedLevel,
    isLevelUnlocked,
    isLevelCompleted,
    completeLevel,
    getLevelBestScore,
  };
})();
