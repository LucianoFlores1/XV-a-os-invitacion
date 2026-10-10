import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import confetti from 'canvas-confetti'
import { ArrowUpRight, Check, MagnifyingGlass, Pause, Play, Plus, SpotifyLogo, X } from '@phosphor-icons/react'
import { CONFIG } from '../config'
import { buscarTemas, spotifySearchUrl } from '../lib/itunes'
import { useMusic } from '../lib/music'
import { usePedidos } from '../lib/pedidos'
import { useToast } from '../lib/toast'

const ease = [0.23, 1, 0.32, 1]

function playlistEmbed(url) {
  const m = url.match(/playlist\/([A-Za-z0-9]+)/)
  return m ? `https://open.spotify.com/embed/playlist/${m[1]}?utm_source=generator&theme=0` : null
}

function Vinilo({ tema, girando }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[300px]">
      <div aria-hidden className="absolute inset-[-8%] rounded-full bg-[radial-gradient(circle,rgb(156_195_255/0.22),transparent_65%)]" />
      <div
        className={`spin ${girando ? '' : 'paused'} absolute inset-0 rounded-full shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]`}
        style={{
          background:
            'repeating-radial-gradient(circle at center, #0a0f1f 0px, #0a0f1f 2px, #131b33 3px, #0a0f1f 4px), #0a0f1f',
        }}
      >
        <div aria-hidden className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0deg,rgb(196_219_255/0.12)_40deg,transparent_80deg,transparent_180deg,rgb(196_219_255/0.08)_220deg,transparent_260deg)]" />
        <div className="absolute inset-[30%] overflow-hidden rounded-full border-4 border-night bg-deep">
          {tema?.tapa ? (
            <img src={tema.tapa} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center font-script text-3xl text-sky">{CONFIG.iniciales}</div>
          )}
        </div>
        <div className="absolute top-1/2 left-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-night ring-2 ring-mist/40" />
      </div>
    </div>
  )
}

function Resultado({ tema, pedido, sonando, onPlay, onPedir }) {
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease }}
      className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-white/[0.03]"
    >
      <button
        type="button"
        onClick={() => onPlay(tema)}
        aria-label={sonando ? `Pausar ${tema.titulo}` : `Escuchar ${tema.titulo}`}
        className="group relative size-14 shrink-0 overflow-hidden rounded-xl"
      >
        <img src={tema.tapa} alt="" loading="lazy" className="size-full object-cover" />
        <span className={`absolute inset-0 flex items-center justify-center bg-night/55 text-ink transition-opacity ${sonando ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}>
          {sonando ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}
        </span>
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-ink">{tema.titulo}</p>
        <p className="truncate text-sm text-mist">{tema.artista}</p>
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.9 }}
        onClick={(e) => onPedir(tema, e)}
        aria-label={pedido ? `${tema.titulo} ya está en tus pedidos` : `Pedir ${tema.titulo}`}
        className={`flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
          pedido ? 'border-sky bg-sky text-night' : 'border-line text-ink hover:border-sky/60'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={pedido ? 'ok' : 'add'}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.18, ease }}
          >
            {pedido ? <Check size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </motion.li>
  )
}

export default function Rocola() {
  const { playPreview, previewId } = useMusic()
  const { pedidos, agregar, quitar } = usePedidos()
  const toast = useToast()
  const [genero, setGenero] = useState(CONFIG.generos[3]?.nombre || null)
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('idle') // idle | cargando | ok | error
  const [resultados, setResultados] = useState([])
  const [ultimo, setUltimo] = useState(null)
  const [intento, setIntento] = useState(0)

  const termino = q.trim().length >= 2 ? q.trim() : CONFIG.generos.find((g) => g.nombre === genero)?.busqueda

  useEffect(() => {
    if (!termino) {
      setResultados([])
      setEstado('idle')
      return
    }
    let vivo = true
    setEstado('cargando')
    const t = setTimeout(
      () => {
        buscarTemas(termino, 8)
          .then((r) => {
            if (!vivo) return
            setResultados(r)
            setEstado('ok')
          })
          .catch(() => vivo && setEstado('error'))
      },
      q ? 450 : 0,
    )
    return () => {
      vivo = false
      clearTimeout(t)
    }
  }, [termino, q, intento])

  const enVinilo = resultados.find((r) => r.id === previewId) || pedidos.find((r) => r.id === previewId) || ultimo

  function pedir(tema, e) {
    if (!agregar(tema)) {
      toast('Ese tema ya está en tus pedidos.')
      return
    }
    setUltimo(tema)
    const r = e.currentTarget.getBoundingClientRect()
    confetti({
      particleCount: 40,
      spread: 60,
      startVelocity: 28,
      scalar: 0.8,
      ticks: 120,
      origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight },
      colors: ['#9cc3ff', '#c4dbff', '#eef2fb', '#3d6fd6'],
      disableForReducedMotion: true,
    })
    const n = pedidos.length + 1
    toast(n === 1 ? `¡Pedido! "${tema.titulo}" ya está en tu lista.` : n === 3 ? 'Tres temas. El DJ ya te quiere.' : `Sumaste "${tema.titulo}".`)
  }

  const embed = CONFIG.spotifyPlaylistUrl && playlistEmbed(CONFIG.spotifyPlaylistUrl)

  return (
    <section id="rocola" className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease }}
          className="max-w-2xl"
        >
          <h2 className="font-serif text-5xl leading-tight text-ink md:text-6xl">
            La rocola de <span className="font-script text-sky">{CONFIG.nombre}</span>
          </h2>
          <p className="mt-4 text-lg text-mist">
            Vos elegís la música de la fiesta. Escuchá un adelanto, pedí tus temas y se los mandamos al DJ.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="min-w-0 lg:sticky lg:top-10 lg:self-start">
            <Vinilo tema={enVinilo} girando={Boolean(previewId)} />
            <div className="mt-6 min-h-14 text-center">
              {enVinilo ? (
                <>
                  <p className="truncate font-medium text-ink">{enVinilo.titulo}</p>
                  <p className="truncate text-sm text-mist">{enVinilo.artista}</p>
                </>
              ) : (
                <p className="text-sm text-mist">Tocá una tapa para escuchar un adelanto.</p>
              )}
            </div>
          </div>

          <div className="card min-w-0 p-4 sm:p-6">
            <label htmlFor="buscar" className="text-sm text-mist">
              Buscá tu tema
            </label>
            <div className="relative mt-2">
              <MagnifyingGlass size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-mist" />
              <input
                id="buscar"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Canción o artista"
                autoComplete="off"
                className="w-full rounded-full border border-line bg-night/70 py-3.5 pr-11 pl-12 text-ink placeholder:text-mist/70 focus:border-sky/70 focus:outline-none"
              />
              {q && (
                <button type="button" onClick={() => setQ('')} aria-label="Borrar búsqueda" className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-mist">
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
              {CONFIG.generos.map((g) => {
                const activo = !q && genero === g.nombre
                return (
                  <button
                    key={g.nombre}
                    type="button"
                    onClick={() => {
                      setQ('')
                      setGenero(g.nombre)
                    }}
                    className={`btn shrink-0 border px-4 py-2 text-sm ${activo ? 'border-sky bg-sky text-night' : 'border-line text-ink'}`}
                  >
                    {g.nombre}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 min-h-[380px]">
              {estado === 'cargando' && (
                <ul className="flex flex-col gap-1" aria-label="Buscando">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <li key={i} className="flex items-center gap-3 p-2">
                      <span className="skeleton size-14 rounded-xl" />
                      <span className="flex-1 space-y-2">
                        <span className="skeleton block h-3.5 w-2/3 rounded-full" />
                        <span className="skeleton block h-3 w-1/3 rounded-full" />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {estado === 'error' && (
                <div className="flex flex-col items-center gap-4 py-16 text-center">
                  <p className="text-mist">No pudimos buscar temas ahora.</p>
                  <button type="button" onClick={() => setIntento((n) => n + 1)} className="btn btn-ghost">
                    Probar de nuevo
                  </button>
                </div>
              )}
              {estado === 'ok' && resultados.length === 0 && (
                <p className="py-16 text-center text-mist">No encontramos ese tema. Probá con el nombre del artista.</p>
              )}
              {estado === 'ok' && resultados.length > 0 && (
                <ul className="flex flex-col gap-1">
                  <AnimatePresence initial={false}>
                    {resultados.map((t) => (
                      <Resultado
                        key={t.id}
                        tema={t}
                        sonando={previewId === t.id}
                        pedido={pedidos.some((p) => p.id === t.id)}
                        onPlay={playPreview}
                        onPedir={pedir}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h3 className="font-serif text-3xl text-ink">
              Tus pedidos <span className="text-mist">({pedidos.length})</span>
            </h3>
            {pedidos.length === 0 ? (
              <p className="mt-3 text-mist">Todavía no pediste ningún tema. Tocá el + en los que no pueden faltar.</p>
            ) : (
              <>
                <ul className="mt-4 flex flex-wrap gap-2">
                  <AnimatePresence initial={false}>
                    {pedidos.map((t) => (
                      <motion.li
                        key={t.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.25, ease }}
                        className="flex items-center gap-2 rounded-full border border-line bg-night-2/70 py-1.5 pr-1.5 pl-1.5"
                      >
                        <img src={t.tapa} alt="" className="size-8 rounded-full object-cover" />
                        <span className="max-w-[11rem] truncate text-sm text-ink">{t.titulo}</span>
                        <a href={spotifySearchUrl(t)} target="_blank" rel="noreferrer" aria-label={`Buscar ${t.titulo} en Spotify`} className="p-1.5 text-mist hover:text-sky">
                          <SpotifyLogo size={18} weight="fill" />
                        </a>
                        <button type="button" onClick={() => quitar(t.id)} aria-label={`Quitar ${t.titulo}`} className="p-1.5 text-mist hover:text-ink">
                          <X size={16} />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <p className="mt-4 text-sm text-mist">Viajan solos dentro de tu confirmación por WhatsApp. No tenés que hacer nada más.</p>
              </>
            )}
          </div>

          {embed && (
            <div className="card p-4">
              <iframe
                title="Playlist de la fiesta en Spotify"
                src={embed}
                width="100%"
                height="232"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="rounded-2xl"
              />
              <a href={CONFIG.spotifyPlaylistUrl} target="_blank" rel="noreferrer" className="btn btn-ghost mt-4 w-full">
                <SpotifyLogo size={20} weight="fill" />
                Sumalos a la playlist de la fiesta
                <ArrowUpRight size={16} />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
