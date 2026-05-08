/* ============================================================
   LEVELS — 30 levels with progressive difficulty curve
   ============================================================ */

const Levels = (function () {
  var NAMES = [
    'Principiante','Aprendiz','Novato','Iniciado','Cadete',
    'Intermedio','Oficial','Veterano','Competente','Táctico',
    'Avanzado','Estratega','Especialista','Maestro','Experto',
    'Élite','Superior','Excelente','Genio','Campeón',
    'Leyenda','Inmortal','Implacable','Titán','Coloso',
    'Mítico','Divino','Supremo','Infinito','Dios',
  ];

  var TOTAL = NAMES.length;

  function generate() {
    var levels = [];
    for (var i = 1; i <= TOTAL; i++) {
      var t = (i - 1) / (TOTAL - 1); // 0 → 1

      levels.push({
        id: i,
        name: NAMES[i - 1],
        targetScore: Math.round(50 + 280 * Math.pow(t, 1.15)),
        spawnDelay:  Math.round(280 + 920 * Math.pow(0.935, i - 1)),
        lifetime:    Math.round(350 + 1500 * Math.pow(0.925, i - 1)),
        size:        Math.round(36 + 31 * Math.pow(0.95, i - 1)),
        maxObjects:  Math.min(7, 3 + Math.floor(t * 5)),
      });
    }
    return levels;
  }

  var DATA = generate();

  return {
    getAll:      function () { return DATA; },
    getById:     function (id) { return DATA[id - 1] || null; },
    getCount:    function () { return DATA.length; },
    getTotalLevels: function () { return DATA.length; },
  };
})();
