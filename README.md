# Mis XV · María Luz

Invitación web para los 15 años de María Luz (sábado 24 de octubre).

## Qué tiene

Estética clara y luminosa con texturas: fondo de satén celeste con glitter azul plateado que titila, satén azul Francia con glitter blanco en la cinta, la cuenta regresiva y el mapa, papel con damasco tipo encaje y trama de lino, puntilla con ojalitos, guirnaldas de perlas, moños de satén y foil holográfico en el "XV", el "24" y el CD.

- **Sobre de entrada**: al tocarlo suena una campanita, salen brillos, se abre la solapa, sube la tarjeta y el papel se expande en círculo hasta revelar la invitación. Arranca la música.
- **Portada** con "XV" cromado, el nombre de María Luz y decoración que se mueve con el dedo, el mouse o al inclinar el celular.
- **Cinta** azul con el nombre y la fecha, un mensaje en tarjeta con borde de puntilla y una **cuenta regresiva**.
- **Guardá la fecha**: día, botón para agendar, "Cómo llegar" a Google Maps y dress code (elegante sport, sin ropa deportiva ni gorras).
- **Poné tu tema**: la playlist pública de Spotify de la fiesta, embebida, con un botón para abrirla y sumar canciones. Si tocan play ahí, la música de fondo se pausa sola.
- **Regalo**: "Tu presencia es mi mayor regalo" y el alias con botón para copiarlo.
- **Confirmá tu asistencia**: abre WhatsApp (+54 9 387 482-4080) con el mensaje listo.
- **Cierre**: "Con amor, María Luz".
- Cada sección es un panel de ancho completo con su textura (papel, satén azul, satén celeste u holográfico) y puntas superiores redondeadas que se apilan.
- Cada toque deja brillitos, en Android vibra suave y hay sonidos sintetizados (pop en botones, campanita al copiar, arpegio al confirmar, whoosh al abrir el sobre). Si se pausa la música, también se silencian.

## Editar datos

Todo está en [`src/config.js`](src/config.js): hora, nombre del salón, link de la playlist de Spotify, alias para regalos y temas de la música de fondo.

## Texturas

Las texturas de `src/texturas` se generan por código (sin fotos de stock):

```bash
node scripts/generar-texturas.cjs   # satén, glitter y holográfico (renderiza scripts/texturas.html con Playwright)
```

El damasco y la puntilla son SVG.

## Correr en la compu

```bash
npm install
npm run dev
```

## Publicar

Al hacer push a `main` (o a la rama actual), el workflow `.github/workflows/deploy.yml` publica el sitio en GitHub Pages
(hay que activar **Settings > Pages > Source: GitHub Actions** una sola vez).
También se puede subir la carpeta `dist/` (después de `npm run build`) a Netlify o Vercel.
