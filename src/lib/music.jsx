import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { CONFIG } from '../config'
import { buscarTemas } from './itunes'

const MusicCtx = createContext(null)

// Un solo reproductor para la música de fondo y otro para los fragmentos de la rocola.
// Cuando suena un fragmento, la radio se pausa y vuelve sola al terminar.
export function MusicProvider({ children }) {
  const radio = useRef(null)
  const preview = useRef(null)
  const lista = useRef([])
  const indice = useRef(0)
  const wantRadio = useRef(false)

  const [playing, setPlaying] = useState(false)
  const [actual, setActual] = useState(null)
  const [disponible, setDisponible] = useState(Boolean(CONFIG.musicaPropia))
  const [previewId, setPreviewId] = useState(null)

  // Preparamos la lista antes de que abran el sobre, así el primer toque ya puede sonar.
  useEffect(() => {
    const a = new Audio()
    a.preload = 'auto'
    a.volume = 0.55
    radio.current = a
    const p = new Audio()
    preview.current = p

    if (CONFIG.musicaPropia) {
      a.src = `${import.meta.env.BASE_URL}${CONFIG.musicaPropia}`
      a.loop = true
      setActual({ titulo: 'Música de la fiesta', artista: CONFIG.nombre })
    } else {
      Promise.all(
        CONFIG.radio.map((t) =>
          buscarTemas(`${t.titulo} ${t.artista}`, 1)
            .then((r) => r[0])
            .catch(() => null),
        ),
      ).then((res) => {
        lista.current = res.filter(Boolean)
        if (lista.current.length) {
          if (!a.src) {
            a.src = lista.current[0].preview
            setActual(lista.current[0])
          }
          setDisponible(true)
          // si ya abrieron el sobre mientras cargaba, arrancamos ahora
          if (wantRadio.current && a.paused && !preview.current.src) a.play().catch(() => {})
        }
      })
    }

    a.addEventListener('ended', () => {
      if (!lista.current.length) return
      indice.current = (indice.current + 1) % lista.current.length
      const t = lista.current[indice.current]
      a.src = t.preview
      setActual(t)
      a.play().catch(() => {})
    })
    a.addEventListener('play', () => setPlaying(true))
    a.addEventListener('pause', () => setPlaying(false))

    p.addEventListener('ended', () => {
      setPreviewId(null)
      if (wantRadio.current) a.play().catch(() => {})
    })

    return () => {
      a.pause()
      p.pause()
    }
  }, [])

  const start = useCallback(() => {
    wantRadio.current = true
    const a = radio.current
    // play() dentro del toque desbloquea el audio en iOS aunque la lista todavía cargue
    a.play().catch(() => {})
  }, [])

  const toggle = useCallback(() => {
    const a = radio.current
    if (previewId) {
      preview.current.pause()
      setPreviewId(null)
    }
    if (a.paused) {
      wantRadio.current = true
      a.play().catch(() => {})
    } else {
      wantRadio.current = false
      a.pause()
    }
  }, [previewId])

  const playPreview = useCallback(
    (tema) => {
      const p = preview.current
      if (previewId === tema.id) {
        p.pause()
        setPreviewId(null)
        if (wantRadio.current) radio.current.play().catch(() => {})
        return
      }
      radio.current.pause()
      p.src = tema.preview
      p.volume = 0.8
      p.play().catch(() => setPreviewId(null))
      setPreviewId(tema.id)
    },
    [previewId],
  )

  return (
    <MusicCtx.Provider value={{ start, toggle, playing, actual, disponible, playPreview, previewId }}>
      {children}
    </MusicCtx.Provider>
  )
}

export const useMusic = () => useContext(MusicCtx)
