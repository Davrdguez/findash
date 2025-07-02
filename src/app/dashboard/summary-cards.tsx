'use client'

import { useMovimientoStore } from '@/lib/movimiento-store'

export default function SummaryCards() {
  const movimientos = useMovimientoStore(state => state.movimientos)

  const totalIngresos = movimientos
    .filter(mov => mov.tipo === 'Ingreso')
    .reduce((sum, mov) => sum + mov.monto, 0)

  const totalGastos = movimientos
    .filter(mov => mov.tipo === 'Gasto')
    .reduce((sum, mov) => sum + mov.monto, 0)

  const balance = totalIngresos - totalGastos

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow">
        <h3 className="font-semibold text-sm mb-1">Ingresos</h3>
        <p className="text-2xl font-bold">+${totalIngresos.toFixed(2)}</p>
      </div>
      <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow">
        <h3 className="font-semibold text-sm mb-1">Gastos</h3>
        <p className="text-2xl font-bold">-${totalGastos.toFixed(2)}</p>
      </div>
      <div className="bg-blue-100 text-blue-800 p-4 rounded-lg shadow">
        <h3 className="font-semibold text-sm mb-1">Balance</h3>
        <p className="text-2xl font-bold">
          {balance >= 0 ? '+' : '-'}${Math.abs(balance).toFixed(2)}
        </p>
      </div>
    </div>
  )
}
