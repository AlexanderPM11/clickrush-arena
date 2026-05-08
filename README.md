# Click Frenzy 🎯

Juego arcade por niveles con mapa de progreso estilo "ruta de aventura". Toca los objetos brillantes que aparecen en pantalla antes de que desaparezcan para sumar puntos y superar el objetivo de cada nivel.

## Estructura del proyecto

```
game-project/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── levels.js     30 niveles con curva de dificultad progresiva
│   ├── storage.js    Persistencia (puntuación + progreso de niveles)
│   ├── audio.js      Sonidos vía Web Audio API
│   ├── ui.js         DOM, efectos, pantallas, mapa SVG curvo, iconos SVG
│   ├── game.js       Lógica del juego por niveles
│   └── main.js       Entry point, eventos, navegación
├── assets/
│   └── icons/favicon.svg
└── README.md
```

## Niveles (30)

Cada nivel tiene parámetros fijos que aumentan la dificultad progresivamente:

| Rango | Estilo | Objetivo | Aparición | Duración | Tamaño |
|-------|--------|----------|-----------|----------|--------|
| 1-5 | Novato | 50-100 | ~1200ms | ~1800ms | ~65px |
| 6-10 | Intermedio | 100-170 | ~900ms | ~1400ms | ~55px |
| 11-15 | Avanzado | 170-230 | ~680ms | ~1050ms | ~48px |
| 16-20 | Élite | 230-280 | ~520ms | ~790ms | ~42px |
| 21-25 | Leyenda | 280-310 | ~400ms | ~590ms | ~38px |
| 26-30 | Mítico | 310-330 | ~320ms | ~450ms | ~36px |

## Reglas

- **3 vidas por nivel.** -1 vida cuando un objeto desaparece sin ser tocado.
- Clic en área vacía no tiene efecto.
- Al alcanzar el objetivo → nivel completado. Al perder 3 vidas → game over.
- Los niveles se desbloquean secuencialmente. Se pueden re-jugar.
- Combo: x1 → x2 (3+ aciertos) → x3 (6+) → x4 (10+).
- Los objetos usan iconos SVG variados (estrellas, diamantes, escudos, etc.).

## Controles

Ratón/táctil sobre los objetos. Teclado: Enter/Espacio para acciones.

## Progreso

Guardado automático en localStorage (niveles completados + mejor puntuación).

Sin dependencias externas — 100 % JavaScript vanilla. 24 iconos SVG inline.
