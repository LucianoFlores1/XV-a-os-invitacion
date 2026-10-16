# Rendimiento

El cliente notó lag al scrollear en la versión con texturas. Midiendo con un trace del navegador, el costo de dibujado (RasterTask) bajó de ~2.900 ms a ~1.000 ms en un recorrido completo después de aplicar estas reglas. Medí siempre antes y después de agregar un efecto:

```bash
node <skill>/scripts/medir-render.cjs http://localhost:4173/
```

## Reglas

1. **Nada de `mix-blend-mode` en capas fijas o grandes.** Una capa de grano `fixed` con `multiply` obliga a recomponer toda la pantalla en cada cuadro. El glitter va con opacidad normal.
2. **Nada de `backdrop-filter` en elementos fijos** (el botón de música): re-desenfoca lo que pasa por detrás en cada scroll. Fondo sólido.
3. **No animar `background-position`, `filter`, `width/height`, `top/left`.** Solo `transform` y `opacity`. El holográfico es estático; el brillo de los botones es un pseudo-elemento que se traslada.
4. **Sombras de tarjetas grandes con máscara (`lace`)**: en vez de `filter: drop-shadow` sobre el contenedor, una capa `.sombra-suave` desenfocada y estática detrás.
5. **`will-change` solo en lo que se anima en loop** (glitter, flotantes, brillitos, cinta, CD). Las animaciones de keyframes usan `transform` (no las propiedades sueltas `scale`/`rotate`) para ir por el compositor.
6. **Sin `window.addEventListener('scroll')` que toque React.** Motion (`useScroll`, `useVelocity`) o lectura de `scrollY` dentro de un `requestAnimationFrame` ya existente (partículas).
7. **Un solo canvas para partículas**, sprites prerenderizados, DPR ≤ 1.5, pausado si la pestaña no está visible.
8. **Fondo fijo de la página como capa propia** (`.page-bg` con `position: fixed`), nunca `background-attachment: fixed`.
9. Texturas livianas: los satenes pesan ~25 KB porque son suaves; el total de texturas ronda 270 KB. Íconos importados de a uno (`import { X } from '@phosphor-icons/react'`), nunca `import *`.
10. El iframe de Spotify va con `loading="lazy"`.

## Señales de alarma en el trace

- `RasterTask` o `Paint` que suben mucho tras un cambio → algo se repinta en cada cuadro.
- `UpdateLayoutTree` alto → muchos cambios de estilo por scroll (estado de React actualizado con el scroll).
- `FunctionCall` alto → JS por cuadro (partículas, cinta): está bien si se mantiene en pocos cientos de ms por recorrido.

El navegador headless no tiene GPU y los cuadros por segundo que reporta son ruidosos; usá los totales del trace para comparar y pedile al usuario que lo pruebe en un celular real.
