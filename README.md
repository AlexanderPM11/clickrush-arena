# Click Frenzy 🎯

Juego arcade donde debes hacer clic en objetos brillantes que aparecen aleatoriamente en pantalla antes de que desaparezcan. Cada acierto suma puntos, cada fallo cuesta una vida. La dificultad aumenta progresivamente.

## Estructura del proyecto

```
game-project/
├── index.html              # Punto de entrada
├── css/
│   └── style.css           # Estilos completos
├── js/
│   ├── main.js             # Entry point, eventos, inicialización
│   ├── game.js             # Lógica del juego, estado, spawn, dificultad
│   ├── ui.js               # Manipulación del DOM, efectos visuales
│   ├── audio.js            # Sonidos vía Web Audio API
│   └── storage.js          # Persistencia en localStorage
├── assets/
│   ├── sounds/             # (reservado para sonidos externos)
│   ├── images/             # (reservado para imágenes)
│   └── icons/
│       └── favicon.svg     # Favicon
└── README.md
```

## Cómo jugar

1. Abre `index.html` en tu navegador (o sírvelo con cualquier servidor estático).
2. Presiona **Jugar**.
3. Toca los objetos brillantes antes de que desaparezcan.
4. Encadena aciertos para multiplicar tu puntuación (x2, x3, x4).
5. No dejes que se escapen o perderás vidas.
6. Sobrevive los 60 segundos… o hasta que te quedes sin vidas.

## Controles

- **Ratón / táctil**: clic o tap sobre los objetos.
- **Teclado**: Enter o Espacio para iniciar / reintentar.

## Características

- Diseño responsive (móvil y escritorio).
- Sonidos procedurales vía Web Audio API (sin archivos externos).
- Animaciones CSS con partículas, popups y efectos de shake.
- Sistema de combo con multiplicador de puntuación.
- Dificultad progresiva cada 10 segundos.
- Mejor puntuación guardada en localStorage.
- Sin dependencias externas — 100 % JavaScript vanilla.

## Requisitos

Navegador moderno con soporte para:
- CSS Grid / Flexbox
- Web Audio API
- localStorage
- CSS Custom Properties
