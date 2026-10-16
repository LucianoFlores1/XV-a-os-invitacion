import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { Minus, Plus, WhatsappLogo } from '@phosphor-icons/react'
import { CONFIG } from '../config'
import { arpegio, blip, buzz } from '../lib/juice'
import { Bow, Perlas } from './Deco'
import Panel from './Panel'
import Reveal from './Reveal'

const ease = [0.23, 1, 0.32, 1]

function armarMensaje({ nombre, personas, mensaje }) {
  const l = [CONFIG.textos.whatsappMensaje.replace('{nombre}', nombre).replace('{festejada}', CONFIG.nombre), `Personas: ${personas}`]
  if (mensaje.trim()) l.push('', `Mensaje para ${CONFIG.nombre}: ${mensaje.trim()}`)
  return l.join('\n')
}

const campo =
  'w-full rounded-2xl bg-paper px-4 py-3.5 text-ink shadow-[inset_0_0_0_1.5px_rgb(29_68_196/0.15)] focus:shadow-[inset_0_0_0_2px_rgb(29_68_196/0.6)] focus:outline-none'

export default function Rsvp() {
  const [nombre, setNombre] = useState('')
  const [personas, setPersonas] = useState(1)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(0)
  const [enviado, setEnviado] = useState(false)

  function enviar(e) {
    e.preventDefault()
    if (nombre.trim().length < 2) {
      setError('Contanos tu nombre para saber quién confirma.')
      setShake((n) => n + 1)
      buzz(30)
      return
    }
    setError('')
    const texto = armarMensaje({ nombre: nombre.trim(), personas, mensaje })
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
    setEnviado(true)
    buzz(25)
    arpegio()
    const opts = {
      particleCount: 110,
      spread: 80,
      startVelocity: 50,
      colors: ['#1d44c4', '#4f7cf0', '#9dbcff', '#ffffff', '#c9d8ff'],
      shapes: ['star', 'circle'],
      disableForReducedMotion: true,
    }
    confetti({ ...opts, angle: 60, origin: { x: 0, y: 0.85 } })
    confetti({ ...opts, angle: 120, origin: { x: 1, y: 0.85 } })
  }

  return (
    <Panel tono="acento" id="confirmar" className="pt-32 md:pt-40">
      <div aria-hidden className="damasco-blanco" />
      <Reveal className="relative mx-auto max-w-xl">
        <Perlas className="absolute top-0 left-1/2 z-10 w-[94%] -translate-x-1/2" caida={50} />
        <Bow className="absolute -top-14 left-1/2 z-10 w-32 -translate-x-1/2 drop-shadow-[0_10px_12px_rgb(29_68_196/0.3)]" />
        <div className="relative isolate">
          <div aria-hidden className="sombra-suave" />
          <div className="lace paper-tex px-6 pt-24 pb-16 text-center sm:px-12">
            <p className="text-lg text-soft">{CONFIG.textos.rsvpAntes}</p>
            <h2 className="mt-1 pb-1 font-script text-[clamp(3.2rem,12vw,4.8rem)] leading-[1.1] text-acento">Confirmá tu asistencia</h2>
            <p className="mt-3 text-soft">{CONFIG.textos.rsvpDespues}</p>

            <AnimatePresence mode="wait" initial={false}>
              {enviado ? (
                <motion.div
                  key="gracias"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', duration: 0.6, bounce: 0.4 }}
                  className="mt-10"
                >
                  <p className="font-display text-3xl font-extrabold tracking-tight text-ink">{CONFIG.textos.rsvpGracias}</p>
                  <p className="mt-3 text-soft">Se abrió WhatsApp con tu mensaje listo. Solo falta tocar enviar.</p>
                  <button type="button" onClick={() => setEnviado(false)} className="btn btn-soft mt-8">
                    Editar mi respuesta
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={enviar}
                  noValidate
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease }}
                  className="mt-10 flex flex-col gap-6 text-left"
                >
                  <motion.div
                    key={shake}
                    animate={shake ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col gap-2"
                  >
                    <label htmlFor="nombre" className="text-sm font-semibold text-ink">
                      Nombre y apellido
                    </label>
                    <input
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      autoComplete="name"
                      aria-invalid={Boolean(error)}
                      aria-describedby={error ? 'nombre-error' : undefined}
                      className={`${campo} ${error ? 'shadow-[inset_0_0_0_2px_#d33f5c]' : ''}`}
                    />
                    {error && (
                      <p id="nombre-error" className="text-sm font-medium text-[#b42645]">
                        {error}
                      </p>
                    )}
                  </motion.div>


                  <div className="flex items-center justify-between gap-4">
                          <span id="personas-label" className="text-sm font-semibold text-ink">
                            ¿Cuántos van, contándote?
                          </span>
                          <div className="flex items-center gap-1 rounded-full bg-paper p-1 shadow-[inset_0_0_0_1.5px_rgb(29_68_196/0.15)]" role="group" aria-labelledby="personas-label">
                            <button type="button" data-sonido onClick={() => { setPersonas((n) => Math.max(1, n - 1)); blip(false) }} aria-label="Menos" disabled={personas <= 1} className="btn size-10 bg-white text-acento disabled:opacity-40">
                              <Minus size={16} weight="bold" />
                            </button>
                            <AnimatePresence mode="popLayout" initial={false}>
                              <motion.span
                                key={personas}
                                initial={{ y: -12, opacity: 0, scale: 0.7 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 12, opacity: 0, scale: 0.7 }}
                                transition={{ type: 'spring', duration: 0.35, bounce: 0.5 }}
                                className="w-9 text-center font-display text-xl font-extrabold text-ink tabular-nums"
                                aria-live="polite"
                              >
                                {personas}
                              </motion.span>
                            </AnimatePresence>
                            <button type="button" data-sonido onClick={() => { setPersonas((n) => Math.min(10, n + 1)); blip(true) }} aria-label="Más" className="btn size-10 bg-white text-acento">
                              <Plus size={16} weight="bold" />
                            </button>
                          </div>
                        </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="mensaje" className="text-sm font-semibold text-ink">
                      Un mensaje para {CONFIG.nombre} <span className="font-normal text-soft">(opcional)</span>
                    </label>
                    <textarea id="mensaje" rows={3} value={mensaje} onChange={(e) => setMensaje(e.target.value)} className={`${campo} resize-none`} />
                  </div>


                  <button type="submit" data-sonido className="btn btn-primary mt-1 w-full py-4 text-lg">
                    <WhatsappLogo size={24} weight="fill" />
                    Confirmar por WhatsApp
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </Panel>
  )
}
