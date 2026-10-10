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

  // Número de WhatsApp para confirmar asistencia (código país + área + número, sin + ni espacios)
  whatsapp: '5493874824080',

  // Link de una playlist COLABORATIVA de Spotify (Spotify > playlist > ... > Invitar colaboradores).
  // Si queda vacío, los temas pedidos viajan igual dentro del mensaje de confirmación.
  spotifyPlaylistUrl: '',

  // Foto de la quinceañera (opcional). Poné el archivo en /public y escribí su nombre, ej: 'maria-luz.jpg'
  foto: '',

  // Música propia (opcional). Poné un mp3 en /public y escribí su nombre, ej: 'musica.mp3'.
  // Si queda vacío suena la "Radio XV": fragmentos de estos temas.
  musicaPropia: '',
  radio: [
    { titulo: 'Tiempo de Vals', artista: 'Chayanne' },
    { titulo: 'La Original', artista: 'Emilia TINI' },
    { titulo: 'Cupido', artista: 'TINI' },
    { titulo: 'Automático', artista: 'María Becerra' },
    { titulo: 'Disciplina', artista: 'Lali' },
    { titulo: 'Provenza', artista: 'Karol G' },
    { titulo: 'De Música Ligera', artista: 'Soda Stereo' },
  ],

  // Categorías de la rocola: cada una dispara una búsqueda
  generos: [
    { nombre: 'Cumbia', busqueda: 'cumbia argentina' },
    { nombre: 'Cuarteto', busqueda: 'cuarteto la mona jimenez' },
    { nombre: 'Reggaetón', busqueda: 'reggaeton bad bunny karol g' },
    { nombre: 'Pop', busqueda: 'tini emilia lali pop' },
    { nombre: 'Rock nacional', busqueda: 'rock nacional soda stereo' },
    { nombre: 'Para el vals', busqueda: 'vals quince años' },
    { nombre: 'Carioca', busqueda: 'los autenticos decadentes' },
  ],

  // Momentos de la noche
  momentos: [
    { titulo: 'Recepción', texto: 'Llegamos, nos saludamos y brindamos.', icono: 'Champagne' },
    { titulo: 'Mi entrada', texto: 'El momento en que aparezco de azul.', icono: 'Crown' },
    { titulo: 'El vals', texto: 'Con mi familia y las personas que quiero.', icono: 'Heart' },
    { titulo: 'La cena', texto: 'Mesa compartida y buena charla.', icono: 'ForkKnife' },
    { titulo: 'A bailar', texto: 'La pista es de todos. Nadie se queda sentado.', icono: 'DiscoBall' },
    { titulo: 'Carioca', texto: 'Cotillón, disfraces y mucho ruido.', icono: 'Confetti' },
    { titulo: 'Las 15 velas', texto: 'Quince personas, quince recuerdos.', icono: 'Flame' },
    { titulo: 'La torta', texto: 'Soplamos, pedimos un deseo y seguimos.', icono: 'Cake' },
  ],
}

export const deseos = [
  'Que esta noche sea tan linda como la soñaste.',
  'Que nunca te falten amigas para bailar.',
  'Quince años, una noche, mil recuerdos.',
  'Que el azul te traiga suerte siempre.',
  'Que la pista no se vacíe hasta el final.',
  'Que cada vela sea un abrazo.',
]
