---
name: invitacion-web-premium
description: Crea invitaciones web interactivas premium, listas para mandar al cliente, para XV años, bodas, cumpleaños, baby showers, bautismos y cualquier evento. Parte de una plantilla probada (sobre animado que se abre con brillos y sonido, portada holográfica, paneles de ancho completo con texturas reales de satén, glitter, damasco, puntilla y perlas, cuenta regresiva, mapa, dress code con íconos, playlist de Spotify, regalo con alias para copiar, confirmación elegante por WhatsApp, partículas, sonidos y vibración) y la adapta a la paleta, el tono y los datos del cliente. Usala siempre que alguien pida una invitación digital, una tarjeta o web para un evento, "una invitación de 15", "la web del casamiento", un save the date, o quiera modificar o mejorar una invitación hecha con esta plantilla, aunque no diga "skill" ni "plantilla".
---

# Invitación web premium

Esta skill sale de un proyecto real (una invitación de XV años) que el cliente aprobó después de varias rondas de feedback. La plantilla en `assets/plantilla/` es esa versión final, ya generalizada: cada decisión de diseño, animación y rendimiento está probada. El trabajo es **adaptarla** al evento nuevo sin perder el nivel de acabado, no reinventarla desde cero (las versiones hechas desde cero salieron genéricas y oscuras, y el cliente las rechazó).

## Flujo de trabajo

### 1. Juntar los datos (preguntar solo lo que falte)

Necesitás, en este orden de importancia:

- Tipo de evento y nombre de quien festeja (y cómo quiere firmar: "María Luz", "Sofi y Tomi").
- Fecha; hora y nombre del salón si los hay (si no, se ocultan solos).
- Link de Google Maps del lugar.
- WhatsApp donde llegan las confirmaciones.
- Color o temática (el color del vestido suele ser la pista).
- Dress code y qué no se permite.
- Opcionales: alias para regalos, playlist de Spotify, canción de fondo, frases propias.

Si el usuario ya dio todo en el mensaje, no preguntes: arrancá. Inferí la audiencia (en XV son chicos de ~15 años; en una boda, adultos de todas las edades) porque cambia el tono de los textos y la música.

### 2. Copiar la plantilla e instalar

```bash
cp -r <skill>/assets/plantilla/. <proyecto>/
cd <proyecto> && npm install
```

### 3. Completar `src/config.js`

Todo lo propio del evento vive ahí: datos, textos (`textos`), dress code (`dressCode`), música (`radio`). Completá también `<title>` y las etiquetas `og:` de `index.html` (es lo que se ve al compartir el link por WhatsApp). Los componentes no deberían tener textos del evento. Leé `references/contenido.md` para el tono, las frases típicas por tipo de evento y las reglas de la música y Spotify.

### 4. Paleta

Si el color no es azul, re-teñí todo con el script y regenerá las texturas:

```bash
python3 <skill>/scripts/cambiar-paleta.py <proyecto> "#c2185b"
node scripts/generar-texturas.cjs
```

El acento queda exacto y los demás tonos se derivan solos. Si ya re-teñiste una vez y querés probar otro color, pasá el actual con `--base "#hex-anterior"`. Revisá contraste después (texto blanco sobre el satén del acento y en los botones: si el acento es muy claro, oscurecelo). Detalles en `references/diseno.md`.

### 5. Ajustar secciones

La plantilla trae: Sobre → Portada → Cinta → Mensaje → Cuenta regresiva → Fecha → Lugar → Dress code → Música → Regalo → Confirmación → Firma. Sacá lo que el evento no use (las secciones de música y regalo se ocultan solas si `spotifyPlaylistUrl` o `alias` están vacíos). Para agregar una sección nueva usá `Panel` con un tono que alterne con sus vecinos (ver `references/diseno.md`).

### 6. Verificar antes de entregar

```bash
npm run build && npx vite preview --port 4173 &
node <skill>/scripts/verificar.cjs http://localhost:4173/ <carpeta-capturas>
node <skill>/scripts/medir-render.cjs http://localhost:4173/
```

Mirá las capturas de verdad (sobre, revelado, cada sección en celular y compu), confirmá cero errores, sin scroll horizontal y que el mensaje de WhatsApp salga bien armado. Checklist completa en `references/qa.md`. Mandale al usuario capturas del resultado.

### 7. Publicar

La plantilla incluye `.github/workflows/deploy.yml` para GitHub Pages (hay que activar Settings → Pages → Source: GitHub Actions una vez, y agregar la rama que se use al `on.push.branches` del workflow si no es `main`).

## Lo que el cliente aprobó (mantenelo)

- **Claro y luminoso.** Fondo de satén pastel del color del evento, tinta oscura del mismo tono, acento saturado. La primera versión oscura ("noche azul") fue rechazada por "muy oscura y fea".
- **Texturas reales, no colores planos.** Satén con pliegues, glitter que titila, foil holográfico en el número grande, papel con damasco y lino, puntilla con ojalitos, perlas, moños. Sin texturas se ve "soso".
- **Paneles de ancho completo** con puntas superiores redondeadas que se apilan uno sobre otro, cada uno con su textura alternando (papel / satén del acento / satén claro / holográfico). Nada de tarjetas chiquitas flotando en el centro para la información.
- **Juice en todo lo que se toca**: brillitos en cada toque, vibración corta en Android, sonidos sintetizados (pop, campanita, arpegio, whoosh), botones que se hunden, entradas con resorte, lluvia de estrellas al abrir, confeti al confirmar. Ver `references/animaciones.md`.
- **Sobre de entrada** que se abre (solapa, sale la tarjeta) y revela la página con un círculo de papel que crece desde la tarjeta. Es el primer "wow" y además desbloquea el audio en celulares.
- **Partículas ambientales** suaves (brillitos, destellos, perlitas) en un solo canvas.
- **Confirmación elegante**: tarjeta de papel con puntilla y perlas sobre satén, solo nombre, cantidad y mensaje opcional, abre WhatsApp con el texto listo. Sin opción "No puedo" salvo que la pidan.
- **Regalo coqueto**: "Tu presencia es mi mayor regalo" + alias con botón Copiar (campanita y "¡Copiado!").
- **Firma final** tipo "Con amor, [Nombre]".
- **Dress code con íconos**: tilde en lo que va, cruz en lo que no.

## Lo que el cliente rechazó (no lo repitas)

- Colores oscuros como base, y fondos planos sin textura.
- **Scroll-jacking**: secciones fijadas que se mueven en horizontal, frases que se iluminan palabra por palabra fijadas a la pantalla. El scroll tiene que ser natural.
- **Cosas para "jugar" que nadie va a usar**: quiz de "¿pasa o no pasa?" del dress code, botón "pedí un deseo". "Es solo una invitación, no un juego." La interacción va en lo útil (confirmar, copiar el alias, el mapa, la música).
- Tutoriales o pasos ("1. Abrí la playlist, 2. ...").
- Huecos para fotos si no hay fotos (a muchas chicas les da vergüenza): no pongas placeholders de fotos.
- Palabras que no usa la audiencia: para chicos de 15, nada de "rocola". Hablá como ellos, con voseo rioplatense.
- Repetir la misma idea en dos lugares (por ejemplo "tu presencia es el mejor regalo" en la confirmación y en el regalo).
- Inventar datos del evento (horarios, itinerario, "en la entrada habrá un cofre"): si el cliente no lo dijo, no va.

## Rendimiento (el cliente notó lag)

El scroll tiene que ir fluido en un celular medio. Las causas del lag fueron capas fijas de pantalla completa con `mix-blend-mode`, `backdrop-filter` en el botón fijo, animar `background-position` del holográfico y sombras con `filter: drop-shadow` sobre tarjetas grandes. Con las correcciones el costo de dibujado bajó ~65 %. Antes de agregar cualquier efecto, leé `references/rendimiento.md` y medí con `scripts/medir-render.cjs` antes y después.

## Referencias

- `references/diseno.md`: paleta, tipografía, texturas, paneles, decoración, cómo agregar secciones.
- `references/animaciones.md`: recetas del sobre, revelado, resortes, partículas, sonidos, vibración, confeti, cinta reactiva.
- `references/rendimiento.md`: reglas para que el scroll no lagee y cómo medir.
- `references/contenido.md`: tono, frases por tipo de evento, WhatsApp, música legal, Spotify, regalo.
- `references/qa.md`: checklist de entrega.
- `assets/plantilla/`: el proyecto completo (Vite + React + Tailwind v4 + Motion).
- `scripts/cambiar-paleta.py`, `scripts/verificar.cjs`, `scripts/medir-render.cjs`; el generador de texturas está en `assets/plantilla/scripts/`.
