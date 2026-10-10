// Búsqueda de temas con la API pública de iTunes (sin claves, incluye fragmentos de 30s).
// Primero intenta fetch; si el navegador lo bloquea, usa JSONP.

const BASE = 'https://itunes.apple.com/search'

function jsonp(url) {
  return new Promise((resolve, reject) => {
    const cb = `__itunes_${Math.random().toString(36).slice(2)}`
    const script = document.createElement('script')
    const timer = setTimeout(() => {
      cleanup()
      reject(new Error('timeout'))
    }, 8000)
    function cleanup() {
      clearTimeout(timer)
      delete window[cb]
      script.remove()
    }
    window[cb] = (data) => {
      cleanup()
      resolve(data)
    }
    script.onerror = () => {
      cleanup()
      reject(new Error('jsonp'))
    }
    script.src = `${url}&callback=${cb}`
    document.head.appendChild(script)
  })
}

function normalize(r) {
  return {
    id: String(r.trackId),
    titulo: r.trackName,
    artista: r.artistName,
    tapa: (r.artworkUrl100 || '').replace('100x100', '300x300'),
    preview: r.previewUrl,
  }
}

const cache = new Map()

export async function buscarTemas(term, limit = 8) {
  const key = `${term}|${limit}`
  if (cache.has(key)) return cache.get(key)
  const url = `${BASE}?term=${encodeURIComponent(term)}&entity=song&media=music&country=AR&limit=${limit}`
  let data
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(String(res.status))
    data = await res.json()
  } catch {
    data = await jsonp(url)
  }
  const out = (data.results || []).filter((r) => r.previewUrl).map(normalize)
  cache.set(key, out)
  return out
}

export function spotifySearchUrl(tema) {
  return `https://open.spotify.com/search/${encodeURIComponent(`${tema.titulo} ${tema.artista}`)}`
}
