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

  // Playlist de Spotify donde los invitados suman sus temas
  spotifyPlaylistUrl: 'https://open.spotify.com/playlist/1XfF804ZYoSelUoefBbgbS',

  // Alias para regalos
  alias: 'maria.658.1822',

  // Música de fondo: Miley Cyrus, The Climb.
  // Sin archivo propio suena el fragmento oficial de 30 segundos (iTunes) en loop.
  // Para que suene el tema completo, poné el mp3 en /public y escribí su nombre acá, ej: 'the-climb.mp3'.
  musicaPropia: '',
  radio: [{ titulo: 'The Climb', artista: 'Miley Cyrus' }],
}
