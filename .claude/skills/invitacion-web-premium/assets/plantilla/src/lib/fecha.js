import { CONFIG } from '../config'

const [Y, M, D] = CONFIG.fecha.split('-').map(Number)
const [h, m] = (CONFIG.hora || '00:00').split(':').map(Number)

export const fechaEvento = new Date(Y, M - 1, D, h, m)

const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

export const diaSemana = dias[fechaEvento.getDay()]
export const mesNombre = meses[M - 1]
export const anio = Y
export const dia = D
export const mes = M

// "Sábado 24 de octubre"
export const fechaLarga = `${diaSemana[0].toUpperCase()}${diaSemana.slice(1)} ${D} de ${mesNombre}`

const pad = (n) => String(n).padStart(2, '0')

export function googleCalendarUrl() {
  const ymd = `${Y}${pad(M)}${pad(D)}`
  let dates
  if (CONFIG.hora) {
    const fin = new Date(fechaEvento.getTime() + 6 * 3600 * 1000)
    const fmt = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
    dates = `${fmt(fechaEvento)}/${fmt(fin)}`
  } else {
    const sig = new Date(Y, M - 1, D + 1)
    dates = `${ymd}/${sig.getFullYear()}${pad(sig.getMonth() + 1)}${pad(sig.getDate())}`
  }
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${CONFIG.textos.etiqueta} · ${CONFIG.nombre}`,
    dates,
    details: `Los 15 de ${CONFIG.nombre}. Dress code: elegante sport.`,
    location: CONFIG.lugar || CONFIG.mapsUrl,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
