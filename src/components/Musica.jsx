import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { ArrowUpRight, SpotifyLogo } from '@phosphor-icons/react'
import { CONFIG } from '../config'
import { useMusic } from '../lib/music'
import { Sparkle } from './Deco'
import Reveal from './Reveal'

function playlistId(url) {
  return url.match(/playlist\/([A-Za-z0-9]+)/)?.[1]
}

// CD holográfico: gira mientras suena la música de fondo
function CD({ girando }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[260px]">
      <div aria-hidden className="absolute inset-[-12%] rounded-full bg-[radial-gradient(circle,rgb(29_68_196/0.2),transparent_65%)]" />
      <div className={`cd-holo spin ${girando ? '' : 'paused'} absolute inset-0 rounded-full shadow-[0_30px_60px_-24px_rgb(29_68_196/0.65)]`}>
        <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle_at_center,rgb(255_255_255/0)_0px,rgb(255_255_255/0)_3px,rgb(255_255_255/0.35)_4px)]" />
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,transparent_0deg,rgb(255_255_255/0.5)_25deg,transparent_60deg,transparent_180deg,rgb(255_255_255/0.35)_210deg,transparent_250deg)]" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgb(29_68_196/0.15)]" />
        <div className="satin-cobalt absolute inset-[31%] flex items-center justify-center overflow-hidden rounded-full ring-[6px] ring-white/80">
          <span className="font-script text-3xl text-white">{CONFIG.iniciales}</span>
        </div>
      </div>
    </div>
  )
}

export default function Musica() {
  const { playing, pause } = useMusic()
  const iframe = useRef(null)
  const id = playlistId(CONFIG.spotifyPlaylistUrl)

  // Si tocan play dentro del reproductor de Spotify, pausamos la música de fondo
  useEffect(() => {
    const onBlur = () => {
      setTimeout(() => {
        if (document.activeElement === iframe.current) pause()
      }, 0)
    }
    window.addEventListener('blur', onBlur)
    return () => window.removeEventListener('blur', onBlur)
  }, [pause])

  return (
    <section id="musica" className="scroll-mt-4 px-4 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <h2 className="font-display text-[clamp(2.6rem,9vw,4.5rem)] leading-[0.95] font-extrabold tracking-tight text-ink">
            Poné <span className="font-script font-normal text-cobalt">tu tema</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-balance text-soft">
            Armemos juntos la playlist de la fiesta. Entrá y sumá los temas que no pueden faltar en la pista.
          </p>
        </Reveal>

        <div className="mt-12 grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-12">
          <Reveal className="relative min-w-0 text-center">
            <Sparkle className="twinkle absolute top-2 left-[12%] size-5 text-cobalt/70" />
            <Sparkle className="twinkle absolute top-10 right-[12%] size-4 text-cobalt/60" style={{ '--delay': '-1.2s' }} />
            <CD girando={playing} />
            <motion.a
              href={CONFIG.spotifyPlaylistUrl}
              target="_blank"
              rel="noreferrer"
              whileTap={{ scale: 0.96 }}
              className="btn btn-primary mt-10 text-base"
            >
              <SpotifyLogo size={22} weight="fill" />
              Sumar mis temas
              <ArrowUpRight size={16} weight="bold" />
            </motion.a>
          </Reveal>

          <Reveal delay={0.08} className="paper-card lino min-w-0 p-3 sm:p-4">
            {id && (
              <iframe
                ref={iframe}
                title="Playlist de la fiesta en Spotify"
                src={`https://open.spotify.com/embed/playlist/${id}?utm_source=generator`}
                width="100%"
                height="460"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="block rounded-[20px]"
              />
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
