// Todo lo editable de la invitación está acá. Los componentes no deberían tener textos propios del evento.
// Los valores de ejemplo son de una invitación de XV años: reemplazalos con los datos del cliente.

export const CONFIG = {
  nombre: 'María Luz', // como aparece en la portada y la firma
  iniciales: 'ML', // van en el CD y en la tarjeta del sobre

  // Fecha (año-mes-día). La hora es opcional ("21:30"): si está, se muestra y la cuenta regresiva apunta ahí.
  fecha: '2026-10-24',
  hora: '',

  lugar: '', // nombre del salón (opcional)
  mapsUrl: 'https://maps.app.goo.gl/XXXXXXXX', // link de Google Maps que pasa el cliente

  whatsapp: '549XXXXXXXXXX', // código país + área + número, sin + ni espacios
  spotifyPlaylistUrl: '', // playlist colaborativa donde los invitados suman temas (si queda vacío se oculta el reproductor)
  alias: '', // alias para regalos (si queda vacío se oculta la sección de regalo)

  // Música de fondo. Sin archivo propio suena el fragmento oficial de 30 s (iTunes) en loop.
  // Para el tema completo: mp3 en /public y su nombre acá (el cliente tiene que tener derecho a usarlo).
  musicaPropia: '',
  radio: [{ titulo: 'The Climb', artista: 'Miley Cyrus' }],

  // ---------- Textos del evento ----------
  textos: {
    sigla: 'XV', // número/sigla grande holográfico de la portada (XV, 18, "Sí", iniciales de los novios...)
    etiqueta: 'Mis XV', // tarjeta del sobre, cinta y título del calendario
    intro: 'Tenés una invitación',
    heroFrase: 'Te invito a celebrar la noche más linda de mis 15.',
    cinta: ['Mis XV', 'NOMBRE', 'FECHA', 'Noche azul'], // NOMBRE y FECHA se reemplazan solos
    mensaje: {
      antes: 'Hay momentos que se esperan ',
      destacado: 'toda la vida.',
      despues: ' Este es uno de los míos, y quiero vivirlo con vos.',
    },
    cuentaRegresiva: 'Falta muy poquito',
    llegoElDia: '¡Llegó el día!',
    musica: 'Armemos juntos la playlist de la fiesta. Entrá y sumá los temas que no pueden faltar en la pista.',
    regaloTitulo: 'Tu presencia es mi mayor regalo',
    regaloTexto: 'Y si aun así querés hacerme un obsequio, te dejo una sugerencia: mi alias.',
    rsvpAntes: 'Si vas a venir, me encantaría saberlo',
    rsvpDespues: 'Me haría muy feliz que estés.',
    rsvpGracias: '¡Nos vemos en la pista!',
    // {nombre} = quien confirma, {festejada} = CONFIG.nombre
    whatsappMensaje: '¡Hola! Soy {nombre} y confirmo mi asistencia a los XV de {festejada}.',
    despedida: '¡Te espero!',
    firma: 'Con amor,',
  },

  // Dress code. Iconos disponibles: Dress, CoatHanger, HighHeel, SneakerMove, BaseballCap, TShirt, Sneaker, Hoodie, Pants
  dressCode: {
    titulo: 'Elegante sport',
    nota: 'No se permite ropa deportiva ni gorras.',
    prendas: [
      { icono: 'Dress', label: 'Vestido', ok: true },
      { icono: 'CoatHanger', label: 'Camisa', ok: true },
      { icono: 'HighHeel', label: 'Zapatos', ok: true },
      { icono: 'SneakerMove', label: 'Deportivo', ok: false },
      { icono: 'BaseballCap', label: 'Gorras', ok: false },
    ],
  },
}
