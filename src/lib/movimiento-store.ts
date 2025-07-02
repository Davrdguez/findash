import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'

// Tipo de movimiento
export type Movimiento = {
  id: string
  tipo: 'Ingreso' | 'Gasto'
  categoria: string
  monto: number
  fecha: string
  cliente? : string
}

// Filtros
type Filtros = {
  tipo: string
  categoria: string
  fecha: string
}

// Store completo
type Store = {
  movimientos: Movimiento[]
  filtros: Filtros
  agregar: (movimiento: Omit<Movimiento, 'id'>) => void
  editar: (movimiento: Movimiento) => void
  eliminar: (id: string) => void
  setFiltros: (filtros: Filtros) => void
}

export const useMovimientoStore = create<Store>()(
  persist(
    (set) => ({
      movimientos: [],
      filtros: { tipo: '', categoria: '', fecha: '' },

      agregar: (movimiento) =>
        set((state) => ({
          movimientos: [...state.movimientos, { ...movimiento, id: uuidv4() }],
        })),

      editar: (movimiento) =>
        set((state) => ({
          movimientos: state.movimientos.map((m) =>
            m.id === movimiento.id ? movimiento : m
          ),
        })),

      eliminar: (id) =>
        set((state) => ({
          movimientos: state.movimientos.filter((m) => m.id !== id),
        })),

      setFiltros: (filtros) => set(() => ({ filtros })),
    }),
    {
      name: 'movimiento-storage',
    }
  )
)
