import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { Minus, Plus, WhatsappLogo } from '@phosphor-icons/react'
import { CONFIG } from '../config'
import { fechaLarga } from '../lib/fecha'
import { usePedidos } from '../lib/pedidos'

const ease = [0.23, 1, 0.32, 1]

function armarMensaje({ nombre, voy, personas, mensaje }, pedidos) {
  const l = []
  if (voy) {
    l.push(`¡Hola! Soy ${nombre} y confirmo mi asistencia a los XV de ${CONFIG.nombre}.`)
    l.push(`Personas: ${personas}`)
  } else {
    l.push(`¡Hola! Soy ${nombre}. Lamentablemente no voy a poder ir a los XV de ${CONFIG.nombre}.`)
  }
  if (voy && pedidos.length) {
    l.push('', 'Temas que quiero que suenen:')
    pedidos.forEach((t) => l.push(`- ${t.titulo} (${t.artista})`))
  }
  if (mensaje.trim()) l.push('', `Mensaje para ${CONFIG.nombre}: ${mensaje.trim()}`)
  return l.join('\n')
}

export default function Rsvp() {
  const { pedidos } = usePedidos()
  const [nombre, setNombre] = useState('')
  const [voy, setVoy] = useState(true)
  const [personas, setPersonas] = useState(1)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const [enviado, setEnviado] = useState(false)

  function enviar(e) {
    e.preventDefault()
    if (nombre.trim().length < 2) {
      setError('Contanos tu nombre para saber quién confirma.')
      return
    }
    setError('')
    const texto = armarMensaje({ nombre: nombre.trim(), voy, personas, mensaje }, pedidos)
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener')
    setEnviado(true)
    if (voy) {
      const opts = { particleCount: 90, spread: 75, startVelocity: 45, colors: ['#9cc3ff', '#c4dbff', '#eef2fb', '#3d6fd6'], disableForReducedMotion: true }
      confetti({ ...opts, angle: 60, origin: { x: 0, y: 0.8 } })
      confetti({ ...opts, angle: 120, origin: { x: 1, y: 0.8 } })
    }
  }

  return (
    <section id="confirmar" className="scroll-mt-6 px-4 py-24 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.9, ease }}
        className="relative mx-auto max-w-xl rounded-[28px] border border-sky/30 bg-[linear-gradient(180deg,rgb(18_42_99/0.7),rgb(11_21_51/0.85))] p-2 shadow-[0_40px_100px_-40px_rgb(46_92_190/0.6)]"
      >
        <div className="rounded-[22px] border border-sky/15 px-6 py-12 text-center sm:px-12">
          <p className="font-serif text-xl text-mist italic">Si vas a venir, me encantaría saberlo</p>
          <h2 className="mt-2 pb-1 font-script text-[clamp(3rem,11vw,4.5rem)] leading-[1.15] text-ink">Confirmá tu asistencia</h2>
          <div aria-hidden className="mx-auto mt-5 flex items-center justify-center gap-3 text-sky/70">
            <span className="h-px w-12 bg-sky/40" />
            <span className="size-1.5 rotate-45 bg-sky/70" />
            <span className="h-px w-12 bg-sky/40" />
          </div>
          <p className="mt-5 text-mist">Tu presencia es el regalo más lindo. {fechaLarga}.</p>

          <AnimatePresence mode="wait" initial={false}>
            {enviado ? (
              <motion.div
                key="gracias"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease }}
                className="mt-10"
              >
                <p className="font-serif text-3xl text-ink">{voy ? '¡Gracias! Te espero.' : 'Gracias por avisar.'}</p>
                <p className="mt-3 text-mist">Se abrió WhatsApp con tu mensaje listo. Solo falta tocar enviar.</p>
                <button type="button" onClick={() => setEnviado(false)} className="btn btn-ghost mt-8">
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
                className="mt-10 flex flex-col gap-6 text-left"
              >
                <div className="flex flex-col gap-2">
                  <label htmlFor="nombre" className="text-sm text-mist">
                    Nombre y apellido
                  </label>
                  <input
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    autoComplete="name"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'nombre-error' : undefined}
                    className={`rounded-2xl border bg-night/60 px-4 py-3.5 text-ink focus:outline-none ${error ? 'border-[#ff9b9b]' : 'border-line focus:border-sky/70'}`}
                  />
                  {error && (
                    <p id="nombre-error" className="text-sm text-[#ffb3b3]">
                      {error}
                    </p>
                  )}
                </div>

                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-2 text-sm text-mist">¿Venís?</legend>
                  <div className="relative grid grid-cols-2 rounded-full border border-line bg-night/60 p-1">
                    <motion.span
                      aria-hidden
                      className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-sky"
                      animate={{ x: voy ? '0%' : '100%' }}
                      transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
                    />
                    {[
                      [true, '¡Sí, voy!'],
                      [false, 'No puedo'],
                    ].map(([v, txt]) => (
                      <button
                        key={txt}
                        type="button"
                        aria-pressed={voy === v}
                        onClick={() => setVoy(v)}
                        className={`relative rounded-full py-3 text-sm font-medium transition-colors duration-200 ${voy === v ? 'text-night' : 'text-ink'}`}
                      >
                        {txt}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <AnimatePresence initial={false}>
                  {voy && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span id="personas-label" className="text-sm text-mist">
                          ¿Cuántos van, contándote?
                        </span>
                        <div className="flex items-center gap-1 rounded-full border border-line bg-night/60 p-1" role="group" aria-labelledby="personas-label">
                          <button type="button" onClick={() => setPersonas((n) => Math.max(1, n - 1))} aria-label="Menos" className="btn size-10 text-ink disabled:opacity-40" disabled={personas <= 1}>
                            <Minus size={16} weight="bold" />
                          </button>
                          <span className="w-8 text-center text-lg font-medium text-ink tabular-nums" aria-live="polite">
                            {personas}
                          </span>
                          <button type="button" onClick={() => setPersonas((n) => Math.min(10, n + 1))} aria-label="Más" className="btn size-10 text-ink">
                            <Plus size={16} weight="bold" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-2">
                  <label htmlFor="mensaje" className="text-sm text-mist">
                    Un mensaje para {CONFIG.nombre} <span className="text-mist/70">(opcional)</span>
                  </label>
                  <textarea
                    id="mensaje"
                    rows={3}
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="resize-none rounded-2xl border border-line bg-night/60 px-4 py-3 text-ink focus:border-sky/70 focus:outline-none"
                  />
                </div>

                {voy && pedidos.length > 0 && (
                  <p className="text-sm text-sky">
                    Incluye tus {pedidos.length} {pedidos.length === 1 ? 'tema pedido' : 'temas pedidos'} de la rocola.
                  </p>
                )}

                <button type="submit" className="btn btn-primary mt-2 w-full py-4 text-base">
                  <WhatsappLogo size={22} weight="fill" />
                  Enviar por WhatsApp
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  )
}
