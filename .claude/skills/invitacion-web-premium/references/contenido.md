# Contenido y tono

## Voz

- Español rioplatense con voseo ("tocá", "querés", "agendalo", "te espero"). Si el cliente es de otro país, adaptá al registro local.
- En primera persona de quien festeja ("Te invito a celebrar..."), cálida y corta. Un panel = una idea.
- Hablá como la audiencia. XV: chicos nacidos ~15 años antes de la fiesta; nada de palabras de adultos ("rocola", "velada"). Boda: adultos de todas las edades, más clásico.
- No inventes datos: horarios, itinerario, regalos en la entrada, restricciones de color. Si no lo dijeron, no va.
- No repitas una frase en dos secciones.
- Nada de em dashes (—). Comillas tipográficas si hacen falta.

## Frases por tipo de evento (elegí o adaptá, no las pongas todas)

**XV años**
- Portada: "Te invito a celebrar la noche más linda de mis 15."
- Mensaje: "Hay momentos que se esperan *toda la vida.* Este es uno de los míos, y quiero vivirlo con vos."
- Regalo: "Tu presencia es mi mayor regalo" / "Y si aun así querés hacerme un obsequio, te dejo una sugerencia: mi alias."
- Confirmación: "Si vas a venir, me encantaría saberlo" / "Me haría muy feliz que estés." / Gracias: "¡Nos vemos en la pista!"
- Firma: "Con amor," + nombre.

**Boda**
- Portada: "Nos casamos" / "Queremos compartir el día más importante de nuestras vidas con vos."
- Mensaje: "Elegimos *compartir la vida.* Y queremos celebrarlo con las personas que más queremos."
- Regalo: "Su presencia es nuestro mejor regalo. Si desean acompañarnos con un obsequio, les dejamos nuestro alias."
- Gracias: "¡Nos vemos en la fiesta!" · Firma: "Con amor," + "Sofi y Tomi".
- `sigla`: iniciales ("S & T") o "Sí".

**Cumpleaños adulto (30, 40, 50...)**: sigla con el número, tono festivo y directo ("Vení a festejar mis 40").

**Baby shower / bautismo**: tono tierno, paleta muy suave (rosa, celeste, verde salvia), menos glitter, perlas y moños sí. Firma de los papás.

## WhatsApp

`textos.whatsappMensaje` con `{nombre}` y `{festejada}`. El mensaje final suma "Personas: N" y el mensaje opcional. Probalo siempre con `scripts/verificar.cjs` (imprime el texto armado). El número va sin "+" ni espacios: `549` + área + número para Argentina.

## Música de fondo

- Sin archivo propio suena el fragmento oficial de 30 s de iTunes (API pública de búsqueda, con respaldo JSONP) en loop: es la forma legal de usar un tema comercial sin subirlo.
- Para el tema completo, el cliente tiene que pasar el mp3 (con derecho a usarlo); va en `public/` y su nombre en `musicaPropia`. Nunca descargues música de internet por tu cuenta.
- `radio` acepta varios temas (rotan) o uno solo (loop). Elegí según la audiencia y lo que pidió el cliente; si eligió un tema, ese manda.
- La música arranca dentro del toque del sobre (por la política de autoplay); el botón flotante la pausa y con eso se silencian los efectos.

## Spotify

- Playlist de Spotify embebida + botón "Sumar mis temas". Para que los invitados puedan agregar canciones la playlist tiene que ser **colaborativa** (no alcanza con pública): avisale al cliente.
- Guardá el link sin parámetros de rastreo (`?si=...`).
- Si el invitado toca play en el reproductor, la música de fondo se pausa sola (detección por foco del iframe).
- Sin tutoriales ni pasos numerados.

## Regalo

Cajita de regalo (tapa de satén + cinta + moño) con el alias y un botón Copiar (portapapeles con respaldo `execCommand`, campanita, "¡Copiado!"). Si no hay alias, la sección se oculta.

## Dress code

Título grande + nota corta + íconos con tilde (lo que va) y cruz (lo que no). Íconos de Phosphor disponibles en `config.dressCode.prendas[].icono`. Sin juegos ni quizzes.
