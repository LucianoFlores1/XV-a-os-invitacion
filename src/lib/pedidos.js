import { useCallback, useEffect, useState } from 'react'

const KEY = 'xv-maria-luz-pedidos'

function leer() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

// Estado compartido simple entre la rocola y la confirmación
let estado = leer()
const subs = new Set()

function guardar(next) {
  estado = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // sin almacenamiento disponible: queda en memoria
  }
  subs.forEach((fn) => fn(next))
}

export function usePedidos() {
  const [pedidos, setPedidos] = useState(estado)
  useEffect(() => {
    subs.add(setPedidos)
    return () => subs.delete(setPedidos)
  }, [])
  const agregar = useCallback((tema) => {
    if (estado.some((t) => t.id === tema.id)) return false
    guardar([...estado, tema])
    return true
  }, [])
  const quitar = useCallback((id) => guardar(estado.filter((t) => t.id !== id)), [])
  return { pedidos, agregar, quitar }
}
