# Click Frenzy 🎯

Juego arcade por niveles donde debes hacer clic en objetos brillantes que aparecen en pantalla antes de que desaparezcan. Supera la puntuación objetivo de cada nivel para avanzar en el mapa de progreso.

## Estructura del proyecto

```
game-project/
├── index.html              # Punto de entrada
├── css/
│   └── style.css           # Estilos completos
├── js/
│   ├── levels.js           # Definición de niveles y configuración
│   ├── storage.js          # Persistencia (puntuación + progreso)
│   ├── audio.js            # Sonidos vía Web Audio API
│   ├── ui.js               # DOM, efectos, pantallas, mapa de niveles
│   ├── game.js             # Lógica del juego por niveles
│   └── main.js             # Entry point, eventos, navegación
├── assets/
│   ├── sounds/             # (reservado)
│   ├── images/             # (reservado)
│   └── icons/
│       └── favicon.svg
└── README.md
```

## Sistema de niveles

| Nivel | Nombre | Objetivo | Aparición | Duración | Tamaño | Objetos |
|-------|--------|----------|-----------|----------|--------|---------|
| 1 | Principiante | 30 pts | 1400ms | 2200ms | 70px | 3 |
| 2 | Aprendiz | 60 pts | 1300ms | 2050ms | 66px | 3 |
| 3 | Intermedio | 100 pts | 1200ms | 1900ms | 62px | 4 |
| 4 | Avanzado | 150 pts | 1100ms | 1750ms | 59px | 4 |
| 5 | Experto | 200 pts | 1000ms | 1600ms | 56px | 4 |
| 6 | Élite | 270 pts | 900ms | 1450ms | 53px | 5 |
| 7 | Maestro | 350 pts | 810ms | 1300ms | 50px | 5 |
| 8 | Leyenda | 440 pts | 730ms | 1150ms | 47px | 5 |
| 9 | Mítico | 540 pts | 660ms | 1000ms | 44px | 6 |
| 10 | Dios | 650 pts | 590ms | 880ms | 40px | 6 |

## Reglas

- **3 vidas por nivel.** Se pierde 1 vida cuando un objeto desaparece sin ser tocado.
- Clic en área vacía no tiene efecto.
- Llegar al objetivo → nivel completado. Perder todas las vidas → game over.
- Los niveles se desbloquean progresivamente. Se puede re-jugar cualquier nivel completado.
- El combo multiplica la puntuación: x1, x2 (3+), x3 (6+), x4 (10+ aciertos seguidos).

## Controles

- **Ratón / táctil**: clic o tap sobre los objetos.
- **Teclado**: Enter o Espacio para acciones principales.

## Progreso

El progreso se guarda automáticamente en `localStorage`:
- Niveles completados y mejor puntuación por nivel.
- Mejor puntuación global.

Sin dependencias externas — 100 % JavaScript vanilla.
