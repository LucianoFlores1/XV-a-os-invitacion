# Mis XV · María Luz

Invitación web para los 15 años de María Luz (sábado 24 de octubre).

## Qué tiene

- **Sobre de entrada** que se abre al tocarlo y arranca la música.
- **Radio XV**: música de fondo en español (fragmentos de 30 segundos de temas como *Tiempo de Vals*, TINI, Emilia, María Becerra, Lali, Soda Stereo). Botón flotante para pausar.
- **Frase** que se ilumina palabra por palabra con el scroll.
- **Cuenta regresiva** al día de la fiesta.
- **Cuándo y dónde**: calendario de octubre, botón para agendar en Google Calendar y botón "Cómo llegar" a Google Maps.
- **Dress code interactivo** (elegante sport): tocás cada prenda y te dice si pasa o no.
- **Así va a ser la noche**: los momentos de la fiesta en un recorrido horizontal.
- **La rocola**: los invitados buscan temas, escuchan un adelanto y los piden. Los pedidos se agregan solos al mensaje de confirmación por WhatsApp y tienen acceso directo a Spotify.
- **Confirmación de asistencia** elegante que abre WhatsApp (+54 9 387 482-4080) con el mensaje listo.

## Editar datos

Todo está en [`src/config.js`](src/config.js): hora, nombre del salón, link de la playlist colaborativa de Spotify, foto, temas de la radio, géneros de la rocola y momentos de la noche.

## Correr en la compu

```bash
npm install
npm run dev
```

## Publicar

Al hacer push a `main`, el workflow `.github/workflows/deploy.yml` publica el sitio en GitHub Pages
(hay que activar **Settings > Pages > Source: GitHub Actions** una sola vez).
También se puede subir la carpeta `dist/` (después de `npm run build`) a Netlify o Vercel.
