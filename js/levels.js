/* ============================================================
   LEVELS — Level definitions and configuration
   ============================================================ */

const Levels = (function () {
  const DATA = [
    { id: 1,  targetScore: 30,  spawnDelay: 1400, lifetime: 2200, size: 70, maxObjects: 3, name: 'Principiante' },
    { id: 2,  targetScore: 60,  spawnDelay: 1300, lifetime: 2050, size: 66, maxObjects: 3, name: 'Aprendiz' },
    { id: 3,  targetScore: 100, spawnDelay: 1200, lifetime: 1900, size: 62, maxObjects: 4, name: 'Intermedio' },
    { id: 4,  targetScore: 150, spawnDelay: 1100, lifetime: 1750, size: 59, maxObjects: 4, name: 'Avanzado' },
    { id: 5,  targetScore: 200, spawnDelay: 1000, lifetime: 1600, size: 56, maxObjects: 4, name: 'Experto' },
    { id: 6,  targetScore: 270, spawnDelay: 900,  lifetime: 1450, size: 53, maxObjects: 5, name: 'Élite' },
    { id: 7,  targetScore: 350, spawnDelay: 810,  lifetime: 1300, size: 50, maxObjects: 5, name: 'Maestro' },
    { id: 8,  targetScore: 440, spawnDelay: 730,  lifetime: 1150, size: 47, maxObjects: 5, name: 'Leyenda' },
    { id: 9,  targetScore: 540, spawnDelay: 660,  lifetime: 1000, size: 44, maxObjects: 6, name: 'Mítico' },
    { id: 10, targetScore: 650, spawnDelay: 590,  lifetime: 880,  size: 40, maxObjects: 6, name: 'Dios' },
  ];

  return {
    getAll() { return DATA; },
    getById(id) { return DATA.find(function (l) { return l.id === id; }) || null; },
    getCount() { return DATA.length; },
    getTotalLevels() { return DATA.length; },
  };
})();
