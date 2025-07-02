'use client'

import { useState } from 'react'
import { useMovimientoStore } from '@/lib/movimiento-store'

type Props = {
  onClose: () => void
}

export default function AddMovementForm({ onClose }: Props) {
  const [type, setType] = useState<'Ingreso' | 'Gasto'>('Ingreso')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [cliente, setCliente] = useState('')

  const agregar = useMovimientoStore((state) => state.agregar)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !amount || !date) return

    const nuevo = {
      tipo: type,
      categoria: category,
      monto: parseFloat(amount),
      fecha: date,
      ...(type === 'Ingreso' && { cliente }),
    }

    agregar(nuevo)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-gray-800">
      <h2 className="text-xl font-semibold text-center mb-2">Añadir movimiento</h2>

      {/* Tipo */}
      <div className="flex space-x-2 rounded-md overflow-hidden border border-gray-300">
        <button
          type="button"
          onClick={() => setType('Ingreso')}
          className={`w-1/2 py-2 text-sm font-medium transition ${
            type === 'Ingreso'
              ? 'bg-green-100 text-green-800'
              : 'bg-white hover:bg-gray-50 text-gray-600'
          }`}
        >
          Ingreso
        </button>
        <button
          type="button"
          onClick={() => setType('Gasto')}
          className={`w-1/2 py-2 text-sm font-medium transition ${
            type === 'Gasto'
              ? 'bg-red-100 text-red-800'
              : 'bg-white hover:bg-gray-50 text-gray-600'
          }`}
        >
          Gasto
        </button>
      </div>

      {/* Cliente (solo si es ingreso) */}
      {type === 'Ingreso' && (
        <div>
          <label className="text-sm font-medium mb-1 block">Cliente</label>
          <input
            type="text"
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            placeholder="Nombre del cliente"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
          />
        </div>
      )}

      {/* Categoría */}
      <div>
        <label className="text-sm font-medium mb-1 block">Categoría</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none bg-white"
        >
          <option value="">Selecciona una categoría</option>
          <option value="Comida">Comida</option>
          <option value="Transporte">Transporte</option>
          <option value="Sueldo">Sueldo</option>
          <option value="Entretenimiento">Entretenimiento</option>
        </select>
      </div>

      {/* Monto */}
      <div>
        <label className="text-sm font-medium mb-1 block">Monto</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ej: 1500"
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
        />
      </div>

      {/* Fecha */}
      <div>
        <label className="text-sm font-medium mb-1 block">Fecha</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-violet-500 focus:outline-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-violet-600 text-white py-2 rounded-md font-semibold hover:bg-violet-700 transition"
      >
        Guardar movimiento
      </button>
    </form>
  )
}
