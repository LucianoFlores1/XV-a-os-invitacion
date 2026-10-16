# Animaciones y "juice"

Principio: toda animación tiene un motivo (feedback de un toque, contar una historia, mostrar un cambio de estado). Lo que se ve una sola vez (abrir el sobre, confirmar) puede ser espectacular; lo que se toca seguido (botones) tiene que ser corto (<200 ms). Curvas propias, nunca `ease-in` para UI:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);     /* entradas y respuestas */
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1); /* movimientos en pantalla */
```

Resortes de Motion con `{ type: 'spring', duration, bounce }` y bounce 0.25–0.45 (es una fiesta, puede rebotar). Nunca aparecer desde `scale(0)`: arrancar en 0.85–0.96 con opacidad 0.

## El sobre (components/Intro.jsx)

Secuencia al tocar:
1. `buzz(18)` + `chime()` + estallido de brillitos desde el moño; a los 250 ms `whoosh()`.
2. La solapa rota en X 180° (0.55 s, ease-in-out). A mitad de giro pasa a `z-index: -1` para quedar detrás de la tarjeta.
3. La tarjeta sube con resorte (`y: -58%`).
4. A los 1.15 s se mide el centro de la tarjeta y se anima un radio con `animate(r, max)`; la capa del sobre usa `mask-image: radial-gradient(circle at X Y, transparent r, #000 r+2px)`, así el papel "crece" desde la tarjeta y revela la portada que ya está debajo.
5. Al empezar el revelado: `onOpen()` (arranca la música dentro del gesto del usuario, necesario en iOS), y a los 450 ms lluvia de estrellas desde los costados (`canvas-confetti` con `shapes: ['star']`) + `arpegio()`.

El sobre flota (y/rotate en loop) mientras espera: invita a tocarlo. Mientras el sobre está abierto, `body.locked` evita el scroll.

## Portada

- Número/sigla gigante con `holo-text` que entra con resorte y se desplaza en parallax suave con el scroll (`useScroll` + `useTransform`).
- Nombre en cursiva encima, levemente rotado (-4°), entra con resorte y bounce alto.
- Moños y brillitos flotantes que se mueven con el dedo/mouse/inclinación del celular (`pointermove` + `deviceorientation` → `useSpring`), cada uno con su profundidad.
- Perlas colgando arriba.

## Entradas de secciones

`components/Reveal.jsx`: `whileInView` una sola vez, `y: 32`, `scale: 0.96`, resorte 0.85 s. Escalonar hijos con `delay: i * 0.07`. Nada de entradas fijadas al scroll (scrub): el cliente las rechazó.

## Juice en toques (lib/juice.js)

- `sparkle(x, y)`: brillitos SVG animados con WAAPI que salen del punto tocado. Se dispara en cada `pointerdown` de la página (App.jsx) y en estallidos más grandes en acciones importantes (`sparkleFrom(elemento)`).
- `buzz(ms)`: `navigator.vibrate` (Android).
- Sonidos sintetizados con Web Audio, sin archivos:
  - `pop()` en cualquier botón/link (tono levemente aleatorio para que no canse). Los elementos con sonido propio llevan `data-sonido` para no sumar el pop.
  - `chime()` campanita (copiar alias, abrir sobre).
  - `blip(sube)` para sí/no, contadores, íconos del dress code.
  - `arpegio()` para confirmar y para el revelado.
  - `whoosh()` ruido filtrado que sube (el sobre).
  - `setMudo(true)` cuando la persona pausa la música: los efectos también callan.
- Botones: `:active { scale(0.96) }`, hover con `translateY(-2px)` solo en `(hover: hover)`, brillo que cruza el botón principal cada 4 s (pseudo-elemento animando solo `transform`).
- Contadores: el número sale/entra con resorte (`AnimatePresence mode="popLayout"`).
- Errores: el campo tiembla (`x: [0,-8,8,-5,5,0]`) + vibración larga.
- Confirmar: confeti doble desde abajo a los costados + arpegio + vibración.

## Ambientales

- `components/Particulas.jsx`: un canvas fijo, sprites prerenderizados (brillito blanco, brillito del acento, destello difuso, perlita), ~26 en celular / ~42 en compu, suben despacio con vaivén, y al scrollear se corren según su profundidad. Se pausa con la pestaña oculta y no corre con `prefers-reduced-motion`. DPR limitado a 1.5.
- Glitter de los satenes: opacidad que titila (capa propia con `will-change: opacity`).
- `components/Marquee.jsx`: cinta de satén con puntilla que acelera según la velocidad del scroll (`useVelocity` + `useAnimationFrame`).
- Pin del mapa con dos ondas que laten (`.pulso`, solo transform/opacity).
- CD holográfico que gira mientras suena la música.

## Accesibilidad

`prefers-reduced-motion` apaga partículas, resortes de posición y loops (CSS global + `useReducedMotion`). Los sonidos solo suenan después de un toque del usuario.
