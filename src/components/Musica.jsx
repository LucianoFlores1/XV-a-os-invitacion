import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check, MagnifyingGlass, Pause, Play, Plus, SpotifyLogo, X } from '@phosphor-icons/react'
import { CONFIG } from '../config'
import { buscarTemas, spotifySearchUrl } from '../lib/itunes'
import { buzz, chime, sparkleFrom } from '../lib/juice'
import { useMusic } from '../lib/music'
import { usePedidos } from '../lib/pedidos'
import { useToast } from '../lib/toast'
import Reveal from './Reveal'

const ease = [0.23, 1, 0.32, 1]

function playlistEmbed(url) {
  const m = url.match(/playlist\/([A-Za-z0-9]+)/)
  return m ? `https://open.spotify.com/embed/playlist/${m[1]}?utm_source=generator` : null
}

// CD holográfico: gira mientras suena un adelanto
function CD({ tema, girando }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px]">
      <div aria-hidden className="absolute inset-[-10%] rounded-full bg-[radial-gradient(circle,rgb(29_68_196/0.18),transparent_65%)]" />
      <div
        className={`cd-holo spin ${girando ? '' : 'paused'} absolute inset-0 rounded-full shadow-[0_30px_60px_-24px_rgb(29_68_196/0.65)]`}

      >
        <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle_at_center,rgb(255_255_255/0)_0px,rgb(255_255_255/0)_3px,rgb(255_255_255/0.35)_4px)]" />
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,transparent_0deg,rgb(255_255_255/0.85)_25deg,transparent_60deg,transparent_180deg,rgb(255_255_255/0.6)_210deg,transparent_250deg)] mix-blend-soft-light" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgb(29_68_196/0.15)]" />
        <div className="absolute inset-[31%] overflow-hidden rounded-full bg-cobalt ring-[6px] ring-white/80">
          {tema?.tapa ? (
            <img src={tema.tapa} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center font-script text-3xl text-white">{CONFIG.iniciales}</div>
          )}
        </div>
        <div className="absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper shadow-[inset_0_1px_3px_rgb(29_68_196/0.4)]" />
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
      transition={{ duration: 0.3, ease }}
      className="flex items-center gap-3 rounded-2xl p-2"
    >
      <button
        type="button"
        onClick={() => onPlay(tema)}
        aria-label={sonando ? `Pausar ${tema.titulo}` : `Escuchar ${tema.titulo}`}
        className="relative size-14 shrink-0 overflow-hidden rounded-xl shadow-[0_6px_14px_-6px_rgb(29_68_196/0.5)] transition-transform duration-150 active:scale-95"
      >
        <img src={tema.tapa} alt="" loading="lazy" className="size-full object-cover" />
        <span className={`absolute inset-0 flex items-center justify-center text-white transition-colors ${sonando ? 'bg-cobalt/70' : 'bg-ink/25'}`}>
          {sonando ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}
        </span>
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ink">{tema.titulo}</p>
        <p className="truncate text-sm text-soft">{tema.artista}</p>
      </div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        onClick={(e) => onPedir(tema, e.currentTarget)}
        aria-label={pedido ? `${tema.titulo} ya está en tu lista` : `Agregar ${tema.titulo}`}
        className={`flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ${
          pedido ? 'bg-cobalt text-white' : 'bg-white text-cobalt shadow-[inset_0_0_0_1.5px_rgb(29_68_196/0.3)]'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={pedido ? 'ok' : 'add'}
            initial={{ scale: 0.4, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.5 }}
          >
            {pedido ? <Check size={18} weight="bold" /> : <Plus size={18} weight="bold" />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </motion.li>
  )
}

export default function Musica() {
  const { playPreview, previewId } = useMusic()
  const { pedidos, agregar, quitar } = usePedidos()
  const toast = useToast()
  const [genero, setGenero] = useState(CONFIG.generos[0]?.nombre)
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('idle')
  const [resultados, setResultados] = useState([])
  const [ultimo, setUltimo] = useState(null)
  const [intento, setIntento] = useState(0)

  const termino = q.trim().length >= 2 ? q.trim() : CONFIG.generos.find((g) => g.nombre === genero)?.busqueda

  useEffect(() => {
    if (!termino) return
    let vivo = true
    setEstado('cargando')
    const t = setTimeout(
      () => {
        buscarTemas(termino, 6)
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

  const enCD = resultados.find((r) => r.id === previewId) || ultimo

  function pedir(tema, boton) {
    if (!agregar(tema)) {
      quitar(tema.id)
      toast('Lo sacamos de tu lista.')
      return
    }
    setUltimo(tema)
    buzz()
    chime(1175)
    sparkleFrom(boton, { count: 12, spread: 70 })
    const n = pedidos.length + 1
    toast(n === 1 ? `"${tema.titulo}" ya está en tu lista` : n === 3 ? 'Tres temas. El DJ ya te ama.' : `Sumaste "${tema.titulo}"`)
  }

  const embed = CONFIG.spotifyPlaylistUrl && playlistEmbed(CONFIG.spotifyPlaylistUrl)

  return (
    <section id="musica" className="scroll-mt-4 px-4 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <h2 className="font-display text-[clamp(2.6rem,9vw,4.5rem)] leading-[0.95] font-extrabold tracking-tight text-ink">
            Poné <span className="font-script font-normal text-cobalt">tu tema</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-balance text-soft">¿Qué no puede faltar en la pista? Elegí tus temas y se los pasamos al DJ.</p>
        </Reveal>

        <div className="mt-12 grid items-start gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
          <Reveal className="min-w-0 md:sticky md:top-12">
            <CD tema={enCD} girando={Boolean(previewId)} />
            <div className="mt-5 h-12 text-center">
              {enCD ? (
                <>
                  <p className="truncate font-semibold text-ink">{enCD.titulo}</p>
                  <p className="truncate text-sm text-soft">{enCD.artista}</p>
                </>
              ) : (
                <p className="text-sm text-soft">Tocá una tapa para escuchar un pedacito.</p>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.08} className="paper-card lino min-w-0 p-4 sm:p-6">
            <label htmlFor="buscar" className="sr-only">
              Buscá un tema
            </label>
            <div className="relative">
              <MagnifyingGlass size={20} weight="bold" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-cobalt" />
              <input
                id="buscar"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscá una canción o artista"
                autoComplete="off"
                className="w-full rounded-full bg-paper py-3.5 pr-11 pl-12 text-ink shadow-[inset_0_0_0_1.5px_rgb(29_68_196/0.15)] placeholder:text-soft/80 focus:shadow-[inset_0_0_0_2px_rgb(29_68_196/0.6)] focus:outline-none"
              />
              {q && (
                <button type="button" onClick={() => setQ('')} aria-label="Borrar búsqueda" className="absolute top-1/2 right-3 -translate-y-1/2 p-1 text-soft">
                  <X size={18} weight="bold" />
                </button>
              )}
            </div>

            <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
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
                    className={`btn shrink-0 px-4 py-2 text-sm ${activo ? 'bg-cobalt text-white' : 'bg-white text-cobalt shadow-[inset_0_0_0_1.5px_rgb(29_68_196/0.2)]'}`}
                  >
                    {g.nombre}
                  </button>
                )
              })}
            </div>

            <div className="mt-3 min-h-[440px]">
              {estado === 'cargando' && (
                <ul className="flex flex-col" aria-label="Buscando">
                  {Array.from({ length: 6 }).map((_, i) => (
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
                <div className="flex flex-col items-center gap-4 py-20 text-center">
                  <p className="text-soft">No pudimos buscar temas ahora.</p>
                  <button type="button" onClick={() => setIntento((n) => n + 1)} className="btn btn-soft">
                    Probar de nuevo
                  </button>
                </div>
              )}
              {estado === 'ok' && resultados.length === 0 && (
                <p className="py-20 text-center text-soft">No encontramos ese tema. Probá con el nombre del artista.</p>
              )}
              {estado === 'ok' && resultados.length > 0 && (
                <ul className="flex flex-col">
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
                </ul>
              )}
            </div>
          </Reveal>
        </div>

        <AnimatePresence>
          {pedidos.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: 'spring', duration: 0.6, bounce: 0.3 }}
              className="mt-10"
            >
              <p className="font-display text-xl font-bold text-ink">
                Tu lista <span className="text-cobalt">({pedidos.length})</span>
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                <AnimatePresence initial={false}>
                  {pedidos.map((t) => (
                    <motion.li
                      key={t.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', duration: 0.4, bounce: 0.4 }}
                      className="flex items-center gap-1.5 rounded-full bg-white py-1.5 pr-1.5 pl-1.5 shadow-[0_0_0_1px_rgb(29_68_196/0.12),0_6px_14px_-8px_rgb(29_68_196/0.5)]"
                    >
                      <img src={t.tapa} alt="" className="size-8 rounded-full object-cover" />
                      <span className="max-w-[10rem] truncate pl-1 text-sm font-medium text-ink">{t.titulo}</span>
                      <a href={spotifySearchUrl(t)} target="_blank" rel="noreferrer" aria-label={`Abrir ${t.titulo} en Spotify`} className="p-1.5 text-soft hover:text-cobalt">
                        <SpotifyLogo size={18} weight="fill" />
                      </a>
                      <button type="button" onClick={() => quitar(t.id)} aria-label={`Quitar ${t.titulo}`} className="p-1.5 text-soft hover:text-ink">
                        <X size={15} weight="bold" />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <p className="mt-3 text-sm text-soft">Tu lista viaja sola cuando confirmás la asistencia.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {embed && (
          <Reveal className="paper-card mt-10 p-4">
            <iframe
              title="Playlist de la fiesta en Spotify"
              src={embed}
              width="100%"
              height="232"
              loading="lazy"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="rounded-2xl"
            />
            <a href={CONFIG.spotifyPlaylistUrl} target="_blank" rel="noreferrer" className="btn btn-soft mt-4 w-full">
              <SpotifyLogo size={20} weight="fill" />
              Abrir la playlist de la fiesta
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
