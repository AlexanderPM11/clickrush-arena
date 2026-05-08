/* ============================================================
   ICONS — SVG icon library for game objects
   Organized by category. Each icon is a single SVG path
   designed to be recognizable at small sizes (24×24 viewBox).
   ============================================================ */

const Icons = (function () {
  /* ----------------------------------------------------------
     1. STAR & COSMIC
     ---------------------------------------------------------- */
  var star = [
    { name: 'star-five', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z' },
    { name: 'star-four', path: 'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z' },
    { name: 'sparkle', path: 'M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z' },
    { name: 'moon', path: 'M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.5 5.5 0 0 1-6.55-6.55A8.98 8.98 0 0 0 12 3z' },
    { name: 'comet', path: 'M12 2l2 4 4-1-3 4 5 2-5 3 1 5-4-3-4 3 1-5-5-3 5-2-3-4 4 1z' },
    { name: 'sun', path: 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42' },
    { name: 'planet', path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2v20' },
    { name: 'galaxy', path: 'M12 2a10 10 0 0 1 0 20M12 2a10 10 0 0 0 0 20' },
  ];

  /* ----------------------------------------------------------
     2. HEARTS & LIFE
     ---------------------------------------------------------- */
  var heart = [
    { name: 'heart-filled', path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z' },
    { name: 'heart-pulse', path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09z' },
    { name: 'life', path: 'M12 2a4 4 0 0 0-4 4c0 2 1 3 2 4l2 2 2-2c1-1 2-2 2-4a4 4 0 0 0-4-4z' },
    { name: 'drop', path: 'M12 2l6 10a6 6 0 0 1-12 0z' },
    { name: 'plus', path: 'M11 3h2v8h8v2h-8v8h-2v-8H3v-2h8z' },
    { name: 'leaf', path: 'M21 3c-3 0-7 1-10 4-3 3-4 7-4 10 0 1 .5 2 1.5 2.5C9 19 10 18.5 10 18c0-2 1-5 3-7s5-3 7-3c.5 0 .5-1 0-1z' },
  ];

  /* ----------------------------------------------------------
     3. LIGHTNING & ENERGY
     ---------------------------------------------------------- */
  var energy = [
    { name: 'lightning', path: 'M13 2L4 14h7l-1 8 9-12h-7l1-8z' },
    { name: 'bolt', path: 'M14 2l-8 8h6l-2 10 8-8h-6z' },
    { name: 'power', path: 'M12 2v10M18.36 5.64a10 10 0 1 1-12.72 0' },
    { name: 'zap', path: 'M10 2l-6 12h6l-2 8 10-14h-6l2-6z' },
    { name: 'atom', path: 'M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M3.5 6a10 10 0 0 0 17 0M3.5 18a10 10 0 0 1 17 0' },
    { name: 'wave', path: 'M2 12c2-2 4-3 6-3s4 1 6 3 4 3 6 3 4-1 6-3' },
  ];

  /* ----------------------------------------------------------
     4. DIAMONDS & GEMS
     ---------------------------------------------------------- */
  var gem = [
    { name: 'diamond', path: 'M12 2l10 10-10 10L2 12z' },
    { name: 'gem-cut', path: 'M12 2l5 3 3 5-8 12-8-12 3-5z' },
    { name: 'crystal', path: 'M12 2l8 6-4 14H8L4 8z' },
    { name: 'jewel', path: 'M6 4h12l4 4-10 14L2 8zM2 8h20' },
    { name: 'octagon', path: 'M8 2h8l6 6v8l-6 6H8l-6-6V8z' },
    { name: 'hexagon', path: 'M12 2l10 7v10L12 22 2 19V9z' },
  ];

  /* ----------------------------------------------------------
     5. ROCKETS & SPACE
     ---------------------------------------------------------- */
  var rocket = [
    { name: 'rocket', path: 'M12 2s-4 5-4 10c0 3 1 5 1 5h6s1-2 1-5c0-5-4-10-4-10zM8 17H4M16 17h4' },
    { name: 'satellite', path: 'M8 2h8l2 4v4l-4 8v4h-4v-4l-4-8V6zM12 12v4' },
    { name: 'ufo', path: 'M4 12a8 8 0 0 1 16 0M2 12h20M8 16a4 4 0 0 1 8 0' },
    { name: 'target', path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 3a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z' },
    { name: 'rocket-ship', path: 'M10 2h4l2 6-4 10-4-10zM8 18l-2 4M16 18l2 4M12 14v4' },
  ];

  /* ----------------------------------------------------------
     6. COINS & TREASURE
     ---------------------------------------------------------- */
  var coin = [
    { name: 'coin', path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12z' },
    { name: 'treasure', path: 'M4 20h16l-2-8H6zM10 4h4l2 8H8z' },
    { name: 'gold', path: 'M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z' },
    { name: 'token', path: 'M12 2l2 3h4l-2 3 3 4-4 2 1 5-4-2-4 2 1-5-4-2 3-4-2-3h4z' },
    { name: 'medal', path: 'M8 2h8l-2 6 6 2-4 6 4 6-8-4-8 4 4-6-4-6 6-2z' },
    { name: 'crown', path: 'M2 20h20l-4-10-6 6-6-6z' },
  ];

  /* ----------------------------------------------------------
     7. FIRE & ELEMENTS
     ---------------------------------------------------------- */
  var fire = [
    { name: 'flame', path: 'M12 18c-3.5 0-6-2.5-6-6 0-3 2-5 4-7s1-3 2-4c1 1 3 2.5 5 4.5s2 4.5 2 6.5c0 3-2.5 5-5 5z' },
    { name: 'fire-diamond', path: 'M12 2l4 6 6 4-6 4-4 6-4-6-6-4 6-4z' },
    { name: 'ice', path: 'M12 2v20M2 12h20M4.5 4.5l15 15M19.5 4.5l-15 15' },
    { name: 'wind', path: 'M2 8h14a4 4 0 1 0-4-4M2 16h18a4 4 0 0 1-4 4M2 12h16' },
    { name: 'mountain', path: 'M2 20l8-16 8 16zM10 12l4 8H6z' },
    { name: 'water', path: 'M2 14a6 6 0 0 1 10-4 5 5 0 0 1 9 2 4 4 0 0 1 1 6H2z' },
  ];

  /* ----------------------------------------------------------
     8. SHIELDS & PROTECTION
     ---------------------------------------------------------- */
  var shield = [
    { name: 'shield', path: 'M12 2l9 5v6c0 5.5-4.78 9.5-9 11-4.22-1.5-9-5.5-9-11V7z' },
    { name: 'guard', path: 'M12 2l8 4v6a12 12 0 0 1-8 10 12 12 0 0 1-8-10V6z' },
    { name: 'armor', path: 'M6 4h12l2 4-4 8-6 4-6-4-4-8zM10 4l-2 8 4 2' },
    { name: 'barrier', path: 'M4 4h16v4H4zM4 12h16v4H4zM4 20h16v4H4z' },
    { name: 'stronghold', path: 'M12 2l10 4v4L12 20 2 10V6z' },
    { name: 'check-shield', path: 'M12 2l9 5v6c0 5.5-4.78 9.5-9 11-4.22-1.5-9-5.5-9-11V7zM8 12l3 3 5-5' },
  ];

  /* ----------------------------------------------------------
     9. GAMING
     ---------------------------------------------------------- */
  var gaming = [
    { name: 'joystick', path: 'M6 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM18 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM6 14h12v4a6 6 0 0 1-12 0z' },
    { name: 'trophy', path: 'M6 4h12v4a6 6 0 0 1-12 0zM8 18h8l-1 4H9zM5 8a3 3 0 0 0 0 6M19 8a3 3 0 0 1 0 6' },
    { name: 'flag', path: 'M4 2v20M4 2l16 6-16 6' },
    { name: 'award', path: 'M8 2h8l-2 6 7 3-5 5 2 6-6-3-6 3 2-6-5-5 7-3z' },
    { name: 'star-medal', path: 'M8 2h8l-2 4 5 2-3 5 5 5-7-2-7 2 5-5-3-5 5-2z' },
    { name: 'diamond-cup', path: 'M6 4h12l-2 6 4 4-8 8-8-8 4-4z' },
  ];

  /* ----------------------------------------------------------
     10. MAGIC
     ---------------------------------------------------------- */
  var magic = [
    { name: 'wand', path: 'M4 20L20 4M11 5l2 2M19 13l2 2M13 19l2 2M7 9l2 2' },
    { name: 'scroll', path: 'M6 2h10l2 2v16l-2 2H6l-2-2V4zM8 8h8M8 12h6M8 16h4' },
    { name: 'potion', path: 'M8 4h8l-1 4h2l-3 10v4H10v-4L7 8h2z' },
    { name: 'crystal-ball', path: 'M10 2h4l1 4a5 5 0 1 0-6 0zM12 12v6M8 18h8' },
    { name: 'magic-star', path: 'M12 2l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM10 10l4 4M6 14l4 4' },
    { name: 'spell-book', path: 'M4 4h16v16H4zM8 2v20M8 8l4 2-4 2' },
  ];

  /* ----------------------------------------------------------
     11. WEAPONS & POWER
     ---------------------------------------------------------- */
  var weapon = [
    { name: 'sword', path: 'M10 2l-4 4 4 4-6 8 2 2 8-6 4 4 4-4-4-4 4-4-4-4z' },
    { name: 'axe', path: 'M14 2l6 6-4 4-6-6zM4 20l8-8-4-4-8 8zM16 4l4 4' },
    { name: 'crosshair', path: 'M12 2v4M12 18v4M2 12h4M18 12h4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
    { name: 'missile', path: 'M8 2l6 6-4 12-4-4zM16 8l4 4-8 4z' },
    { name: 'bomb', path: 'M12 2a4 4 0 0 0-4 4c0 1 .5 2 1 3l-5 5a2 2 0 0 0 0 3l6 6a2 2 0 0 0 3 0l5-5c1 .5 2 1 3 1a4 4 0 0 0 0-8 4 4 0 0 0-4-4z' },
    { name: 'blast', path: 'M2 12h4M18 12h4M12 2v4M12 18v4M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3' },
  ];

  /* ----------------------------------------------------------
     12. TECH & FUTURISTIC
     ---------------------------------------------------------- */
  var tech = [
    { name: 'robot', path: 'M8 8h8v2h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2V8zM9 14a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM15 14a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM10 8V4h4v4' },
    { name: 'chip', path: 'M8 2v4M16 2v4M2 8h4M2 16h4M18 8h4M18 16h4M8 18v4M16 18v4M6 6h12v12H6z' },
    { name: 'circuit', path: 'M4 4h16v16H4zM8 8h2v8H8zM14 8h2v8h-2zM8 12h8' },
    { name: 'drone', path: 'M4 8h16M12 8v8M6 16h12l2 4H4zM8 16l-2 4M16 16l2 4' },
    { name: 'gear', path: 'M12 2l2 3h2l3-1 1 3 3 2-1 3v2l1 3-3 2-1 3-3-1h-2l-2 3-3-1-2 3-3-2-1-3 3-2v-2l-3-2 1-3 3-2 1-3 3 1z' },
    { name: 'microchip', path: 'M7 7h10v10H7zM3 10h2M3 14h2M19 10h2M19 14h2M10 3v2M14 3v2M10 19v2M14 19v2' },
  ];

  /* ----------------------------------------------------------
     13. WEATHER & NATURE
     ---------------------------------------------------------- */
  var nature = [
    { name: 'snowflake', path: 'M12 2v20M2 12h20M4.5 4.5l15 15M19.5 4.5l-15 15M6 6l12 12' },
    { name: 'lightning-cloud', path: 'M4 16a4 4 0 0 1 1-8 6 6 0 0 1 11-1 4 4 0 0 1 3 5H12l2-4-6 4h2l-2 4z' },
    { name: 'rain', path: 'M8 4a6 6 0 0 0 0 12h8a4 4 0 0 0 0-8 6 6 0 0 0-8-4zM8 16v4M12 18v4M16 16v4' },
    { name: 'tree', path: 'M12 2l8 10h-4l4 6H8l4-6H8zM12 14v8' },
    { name: 'flower', path: 'M12 2a3 3 0 0 1 3 3c0 2-1 3-2 4h-2c-1-1-2-2-2-4a3 3 0 0 1 3-3zM12 9v6M8 12h8' },
    { name: 'mushroom', path: 'M6 10a6 6 0 0 1 12 0v2H6v-2zM8 12v6a2 2 0 0 0 4 0v-6M12 12v6a2 2 0 0 0 4 0v-6' },
  ];

  /* ----------------------------------------------------------
     14. MIXED / SPECIAL
     ---------------------------------------------------------- */
  var special = [
    { name: 'clover', path: 'M12 2a4 4 0 0 0-4 4c0 .73.2 1.42.54 2H8a4 4 0 1 0 4 4 4 4 0 1 0 4-4h-.54c.34-.58.54-1.27.54-2a4 4 0 0 0-4-4z' },
    { name: 'infinity', path: 'M7 8c-2.21 0-4 1.79-4 4s1.79 4 4 4c1.5 0 2.5-.8 3-1.5.5.7 1.5 1.5 3 1.5 2.21 0 4-1.79 4-4s-1.79-4-4-4c-1.5 0-2.5.8-3 1.5-.5-.7-1.5-1.5-3-1.5z' },
    { name: 'yin-yang', path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 3a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM12 13a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v10' },
    { name: 'eye', path: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
    { name: 'lightbulb', path: 'M8 10a4 4 0 0 1 8 0c0 2-1 3-1 4H9c0-1-1-2-1-4zM9 14h6M10 16h4M11 18h2' },
    { name: 'key', path: 'M8 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 12l4 4 3-3-4-4M14 14l3 3' },
  ];

  /* ----------------------------------------------------------
     MASTER LIST
     ---------------------------------------------------------- */
  var ALL = []
    .concat(star, heart, energy, gem, rocket, coin, fire, shield,
            gaming, magic, weapon, tech, nature, special);

  var CATEGORY_MAP = {
    star: star, heart: heart, energy: energy, gem: gem,
    rocket: rocket, coin: coin, fire: fire, shield: shield,
    gaming: gaming, magic: magic, weapon: weapon, tech: tech,
    nature: nature, special: special,
  };

  var CATEGORY_NAMES = Object.keys(CATEGORY_MAP);

  /* ---------- Randomization (no consecutive repeats) ---------- */

  var lastPath = null;
  var repeatCount = 0;

  /**
   * Returns a random icon path, avoiding the same icon twice in a row.
   * After 2 consecutive uses of the same path, forces a different one.
   */
  function getRandomPath() {
    var idx, icon;
    var maxAttempts = 20;

    for (var attempts = 0; attempts < maxAttempts; attempts++) {
      idx = Math.floor(Math.random() * ALL.length);
      icon = ALL[idx];

      if (icon.path !== lastPath || repeatCount < 2) {
        if (icon.path === lastPath) {
          repeatCount++;
        } else {
          lastPath = icon.path;
          repeatCount = 1;
        }
        return icon.path;
      }
    }

    // Fallback (should rarely reach here)
    lastPath = ALL[0].path;
    repeatCount = 1;
    return lastPath;
  }

  /**
   * Returns a random icon from a specific category.
   */
  function getRandomFromCategory(categoryName) {
    var pool = CATEGORY_MAP[categoryName];
    if (!pool || pool.length === 0) return getRandomPath();
    var icon = pool[Math.floor(Math.random() * pool.length)];
    return icon.path;
  }

  /**
   * Wraps a path string in an SVG element.
   */
  function makeSVG(pathD) {
    return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
           '<path d="' + pathD + '" fill="currentColor"/></svg>';
  }

  /* ---------- Public API ---------- */

  return {
    getAll:       function () { return ALL.slice(); },
    getRandom:    getRandomPath,
    fromCategory: getRandomFromCategory,
    makeSVG:      makeSVG,
    categories:   CATEGORY_NAMES.slice(),
    getCategory:  function (name) { return CATEGORY_MAP[name] ? CATEGORY_MAP[name].slice() : null; },
  };
})();
