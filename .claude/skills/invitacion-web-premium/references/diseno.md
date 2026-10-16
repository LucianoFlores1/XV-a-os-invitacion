# Diseño

## Paleta

Un solo acento saturado, todo lo demás derivado de él. Tokens en `src/index.css` (`@theme`):

| Token | Uso | Valor de la plantilla (azul) |
|---|---|---|
| `paper` / `paper-2` / `pearl` | fondos claros | `#e9f0ff` / `#f6f9ff` / `#fdfdff` |
| `acento` | botones, títulos en cursiva, íconos | `#1d44c4` |
| `acento-hondo` | estados activos, texto sobre suave | `#12297d` |
| `ink` | texto principal (oscuro, teñido del acento) | `#13235a` |
| `soft` | texto secundario | `#4b5d93` |
| `suave` | acentos claros, brillitos sobre satén | `#bcd2ff` |

- Para otro color usá `scripts/cambiar-paleta.py` (rota todos los tonos de la familia del acento, incluidas las sombras `rgb(...)` de Tailwind, los SVG y los tonos del generador de texturas) y después `node scripts/generar-texturas.cjs`.
- El único color fuera de la paleta es el rojo del "no" en el dress code: es semántico, dejalo.
- Contraste: texto blanco solo sobre el satén del acento; sobre fondos claros usá `ink`/`soft`. Si el acento elegido es claro (amarillo, rosa bebé), oscurecé `acento` hasta que el texto blanco de los botones pase AA.
- Tema único y claro. Nada de modo oscuro: es papel.

## Tipografía

- Display: **Bricolage Grotesque** (títulos en extrabold con `tracking-tight`).
- Cuerpo: **Outfit**.
- Cursiva: **Pinyon Script** solo para el nombre, la firma y la segunda palabra de los títulos ("Guardá *la fecha*", "Poné *tu tema*"). El patrón "palabra en display + palabra en cursiva" es la firma visual.
- Todas autoalojadas con `@fontsource` (no `<link>` a Google Fonts).
- Cursivas grandes con `leading-[1.1]` y `pb-2` para no cortar las colas de las letras.
- Nada de em dashes (—) en los textos visibles.

## Texturas

Raster, generadas por código con `assets/plantilla/scripts/texturas.html` + `generar-texturas.cjs` (Playwright):

- **Satén** (`saten-claro.jpg`, `saten-acento.jpg`): relieve de pliegues diagonales calculado en punto flotante, iluminación difusa + especular. Se hace en canvas a mano porque los filtros SVG (`feTurbulence` + `feDiffuseLighting`) tienen precisión de 8 bits y dejan bandas tipo curvas de nivel. Para cambiar el carácter de los pliegues: `escala` (más alto = más pliegues), `angle`, `brillo`.
- **Glitter** (`glitter.png` blanco, `glitter-acento.png`): tile repetible de 512 px con puntitos y destellos en cruz.
- **Holográfico** (`holo.jpg`): manchas pastel iridiscentes + vetas diagonales + grano. Se usa como `background-clip: text` en el número grande y el "24", en el borde de los cuadros de la cuenta regresiva, en el CD y como fondo de un panel.

Vectoriales (SVG en `src/texturas/`): `damasco-*.svg` (rosetones tono sobre tono, tile 140 px), `puntilla.svg` (festón con ojalitos, `repeat-x`).

Clases útiles (`index.css`): `saten-acento` + `glitter`, `saten-claro` + `glitter-acento`, `paper-tex` (damasco + lino), `lino`, `damasco-blanco` (capa sobre satén), `holo-text`, `holo-rim`, `holo-bg`, `lace` (borde festoneado con máscara), `puntilla-arriba` / `puntilla-abajo`, `sombra-suave`.

## Paneles

`components/Panel.jsx`: ancho completo, `rounded-t-[36px] md:rounded-t-[64px]`, `-mt-10 md:-mt-14` para montarse sobre el anterior, sombra hacia arriba. Tonos: `papel`, `acento` (satén del acento), `claro` (satén claro), `holo`.

- Alterná tonos para que haya ritmo: nunca dos paneles seguidos del mismo tono.
- El contenido va directo sobre el panel. Una tarjeta interna solo cuando hay un objeto con sentido propio (el formulario de confirmación, la cajita de regalo, el reproductor de Spotify).
- Cada panel tiene un solo mensaje: título corto + una línea + (opcional) un objeto o un botón.

## Decoración

`components/Deco.jsx`: `Bow` (moño de satén), `Sparkle` (brillito de 4 puntas), `Perlas` (guirnalda colgante: `caida`, `n`, `k` para el tamaño). Usalos con moderación y con intención: un moño arriba de cada objeto importante, perlas colgando en los bordes superiores de los paneles de papel, brillitos que titilan en las esquinas.

## Agregar una sección

1. Componente nuevo que devuelva `<Panel tono="...">`.
2. Contenido envuelto en `<Reveal>` (entrada con resorte al aparecer).
3. Título con el patrón display + cursiva.
4. Textos en `config.js`.
5. Insertarlo en `App.jsx` respetando la alternancia de tonos.
