'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useMovimientoStore } from '@/lib/movimiento-store'

type ChartData = {
  mes: string
  ingresos: number
  gastos: number
}

export default function ChartSection() {
  const movimientos = useMovimientoStore(state => state.movimientos)

  const [data, setData] = useState<ChartData[]>([])
  const [tipo, setTipo] = useState('')
  const [categoria, setCategoria] = useState('')

  const procesarDatos = useCallback(() => {
    if (!movimientos || movimientos.length === 0) {
      setData([])
      return
    }

    const resumenPorMes: Record<string, { ingresos: number; gastos: number }> = {}

    movimientos
      .filter(mov => {
        const coincideTipo = tipo ? mov.tipo === tipo : true
        const coincideCategoria = categoria ? mov.categoria === categoria : true
        return coincideTipo && coincideCategoria
      })
      .forEach(mov => {
        const fecha = new Date(mov.fecha)
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`

        if (!resumenPorMes[mes]) {
          resumenPorMes[mes] = { ingresos: 0, gastos: 0 }
        }

        if (mov.tipo === 'Ingreso') resumenPorMes[mes].ingresos += mov.monto
        if (mov.tipo === 'Gasto') resumenPorMes[mes].gastos += mov.monto
      })

    const finalData = Object.entries(resumenPorMes).map(([mes, valores]) => ({
      mes,
      ingresos: valores.ingresos,
      gastos: valores.gastos
    }))

    finalData.sort((a, b) => {
      const parseDate = (str: string) => new Date(str + '-01')
      return parseDate(a.mes).getTime() - parseDate(b.mes).getTime()
    })

    setData(finalData)
  }, [movimientos, tipo, categoria])

  useEffect(() => {
    procesarDatos()
  }, [procesarDatos])

  return (
    <div className="bg-white rounded-xl shadow-md p-6 h-full text-gray-800">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold">Evolución mensual</h2>

        <div className="flex flex-wrap gap-3 justify-start md:justify-end">
          {/* Select Tipo */}
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-40 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tipo</option>
            <option value="Ingreso">Ingreso</option>
            <option value="Gasto">Gasto</option>
          </select>

          {/* Select Categoría */}
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-40 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Categoría</option>
            <option value="comida">Comida</option>
            <option value="transporte">Transporte</option>
            <option value="salud">Salud</option>
            {/* Agrega más categorías si lo necesitas */}
          </select>

          {/* Botón Aplicar */}
          <button
            onClick={procesarDatos}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition"
          >
            Aplicar
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No hay datos suficientes para mostrar la gráfica.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="mes"
              tickFormatter={(str) => {
                const [year, month] = str.split('-')
                const nombres = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
                return `${nombres[parseInt(month) - 1]} '${year.slice(2)}`
              }}
            />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ingresos" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
