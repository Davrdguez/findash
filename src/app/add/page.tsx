'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeftCircle } from 'lucide-react'

export default function AddPage() {
  const router = useRouter()
  const [type, setType] = useState<'Ingreso' | 'Gasto'>('Ingreso')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    document.body.classList.add('bg-gray-50')
    return () => document.body.classList.remove('bg-gray-50')
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const movement = { id: Date.now(), type, category, amount: parseFloat(amount), date }
    const existing = JSON.parse(localStorage.getItem('movements') || '[]')
    localStorage.setItem('movements', JSON.stringify([movement, ...existing]))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full space-y-6 border border-gray-100">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:underline"
        >
          <ArrowLeftCircle size={18} /> Volver
        </button>

        <h1 className="text-2xl font-bold text-gray-800">Añadir movimiento</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Selector tipo */}
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-md">
            <button
              type="button"
              onClick={() => setType('Ingreso')}
              className={`py-2 rounded-md text-sm font-semibold ${
                type === 'Ingreso' ? 'bg-green-100 text-green-700' : 'text-gray-500'
              }`}
            >
              Ingreso
            </button>
            <button
              type="button"
              onClick={() => setType('Gasto')}
              className={`py-2 rounded-md text-sm font-semibold ${
                type === 'Gasto' ? 'bg-red-100 text-red-700' : 'text-gray-500'
              }`}
            >
              Gasto
            </button>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Ej: Sueldo, Comida..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ej: 1500"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Guardar movimiento
          </button>
        </form>
      </div>
    </div>
  )
}
