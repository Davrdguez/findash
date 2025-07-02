'use client'

import { useState } from 'react'
import { useMovimientoStore } from '@/lib/movimiento-store'
import { Pencil, Trash, CheckCircle } from 'lucide-react'

export default function TransactionTable() {
  const movimientos = useMovimientoStore(state => state.movimientos)
  const eliminar = useMovimientoStore(state => state.eliminar)
  const editar = useMovimientoStore(state => state.editar)

  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [form, setForm] = useState({
    tipo: '',
    cliente: '',
    categoria: '',
    monto: '',
    fecha: '',
  })
  const [guardado, setGuardado] = useState(false)

  const iniciarEdicion = (mov: typeof movimientos[0]) => {
    setEditandoId(mov.id)
    setForm({
      tipo: mov.tipo,
      cliente: mov.cliente || '',
      categoria: mov.categoria,
      monto: mov.monto.toString(),
      fecha: mov.fecha.slice(0, 10),
    })
    setGuardado(false)
  }

  const guardarCambios = () => {
    if (!editandoId) return

    const monto = parseFloat(form.monto)
    if (isNaN(monto)) return

    editar({
      id: editandoId,
      tipo: form.tipo as 'Ingreso' | 'Gasto',
      cliente: form.tipo === 'Ingreso' ? form.cliente : '',
      categoria: form.categoria,
      monto,
      fecha: form.fecha,
    })

    setEditandoId(null)
    setGuardado(true)
    setTimeout(() => setGuardado(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-gray-800">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        Historial de movimientos
        {guardado && (
          <span className="text-green-600 text-sm flex items-center gap-1">
            <CheckCircle className="w-4 h-4" /> Guardado
          </span>
        )}
      </h2>

      {movimientos.length === 0 ? (
        <p className="text-sm text-gray-500">No hay movimientos registrados aún.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Tipo</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Cliente</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Categoría</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Monto</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Fecha</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov) => (
                <tr key={mov.id} className="border-t">
                  {editandoId === mov.id ? (
                    <>
                      <td className="px-4 py-2">
                        <select
                          value={form.tipo}
                          onChange={(e) => setForm(f => ({ ...f, tipo: e.target.value }))}
                          className="text-sm border rounded px-2 py-1 w-full"
                        >
                          <option value="Ingreso">Ingreso</option>
                          <option value="Gasto">Gasto</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        {form.tipo === 'Ingreso' ? (
                          <input
                            type="text"
                            value={form.cliente}
                            onChange={(e) => setForm(f => ({ ...f, cliente: e.target.value }))}
                            className="text-sm border rounded px-2 py-1 w-full"
                            placeholder="Nombre del cliente"
                          />
                        ) : (
                          <span className="text-sm text-gray-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          value={form.categoria}
                          onChange={(e) => setForm(f => ({ ...f, categoria: e.target.value }))}
                          className="text-sm border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={form.monto}
                          onChange={(e) => setForm(f => ({ ...f, monto: e.target.value }))}
                          className="text-sm border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          value={form.fecha}
                          onChange={(e) => setForm(f => ({ ...f, fecha: e.target.value }))}
                          className="text-sm border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={guardarCambios}
                            className="text-green-600 text-sm font-medium"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditandoId(null)}
                            className="text-gray-500 text-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            mov.tipo === 'Ingreso'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {mov.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {mov.tipo === 'Ingreso' ? mov.cliente || '—' : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">{mov.categoria}</td>
                      <td className="px-4 py-2 text-sm">${mov.monto.toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm">
                        {new Date(mov.fecha).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => iniciarEdicion(mov)} title="Editar">
                            <Pencil className="w-4 h-4 text-blue-600" />
                          </button>
                          <button onClick={() => eliminar(mov.id)} title="Eliminar">
                            <Trash className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
