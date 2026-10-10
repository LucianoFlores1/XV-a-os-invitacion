// Todo lo editable de la invitación está acá.

export const CONFIG = {
  nombre: 'María Luz',
  iniciales: 'ML',

  // Fecha del evento (año-mes-día). La hora es opcional: si la completás ("21:30"),
  // aparece en la invitación y la cuenta regresiva apunta a esa hora.
  fecha: '2026-10-24',
  hora: '',

  // Nombre del salón (opcional). Si queda vacío se muestra solo el botón del mapa.
  lugar: '',
  mapsUrl: 'https://maps.app.goo.gl/MMp5Ywnx28wY28J49?g_st=iw',

  // WhatsApp para confirmar asistencia (código país + área + número, sin + ni espacios)
  whatsapp: '5493874824080',

  // Link de una playlist COLABORATIVA de Spotify (opcional).
  // Si queda vacío, los temas elegidos viajan igual dentro del mensaje de confirmación.
  spotifyPlaylistUrl: '',

  // Música propia (opcional): poné un mp3 en /public y escribí su nombre, ej: 'musica.mp3'.
  // Si queda vacío suenan fragmentos de estos temas.
  musicaPropia: '',
  radio: [
    { titulo: 'La Original', artista: 'Emilia TINI' },
    { titulo: 'La Morocha', artista: 'Luck Ra BM' },
    { titulo: 'Si Antes Te Hubiera Conocido', artista: 'Karol G' },
    { titulo: 'Una Foto Remix', artista: 'Mesita Nicki Nicole Emilia TINI' },
    { titulo: 'Automático', artista: 'María Becerra' },
    { titulo: 'DtMF', artista: 'Bad Bunny' },
  ],

  // Atajos de búsqueda de la sección de música
  generos: [
    { nombre: 'Cumbia y RKT', busqueda: 'cumbia rkt la joaqui callejero fino' },
    { nombre: 'Cuarteto', busqueda: 'ulises bueno cuarteto' },
    { nombre: 'Reggaetón', busqueda: 'bad bunny karol g reggaeton' },
    { nombre: 'Trap y Bzrp', busqueda: 'bizarrap music sessions' },
    { nombre: 'Pop', busqueda: 'emilia tini maria becerra' },
    { nombre: 'Clásicos de fiesta', busqueda: 'los autenticos decadentes' },
  ],
}
