export type Movimiento = {
  tipo: 'Ingreso' | 'Gasto'
  categoria: string
  monto: number
  fecha: string
}

const STORAGE_KEY = 'movimientos'

export function guardarMovimientoLocal(mov: Movimiento) {
  const actual = obtenerMovimientosLocal()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...actual, mov]))
}

export function obtenerMovimientosLocal(): Movimiento[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function borrarMovimientosLocal() {
  localStorage.removeItem(STORAGE_KEY)
}
