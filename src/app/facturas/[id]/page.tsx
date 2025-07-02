'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type Concepto = {
  descripcion: string
  cantidad: number
  precio: number
}

type Factura = {
  id: string
  cliente: string
  direccion?: string
  numeroFactura: string
  fecha: string
  iva: number
  conceptos: Concepto[]
  total: number
}


export default function VerFacturaPage() {
  const { id } = useParams()
  const router = useRouter()
  const [factura, setFactura] = useState<Factura | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('facturas')
    if (stored) {
      const todas = JSON.parse(stored) as Factura[]
      const encontrada = todas.find((f) => f.id === id)
      if (encontrada) {
        setFactura(encontrada)
      } else {
        router.push('/facturas')
      }
    }
  }, [id, router])

  if (!factura) {
    return <p className="text-gray-500">Cargando factura...</p>
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Factura Nº <span className="text-violet-600">{factura.numeroFactura}</span>
        </h1>
        <Link href="/facturas" className="flex items-center gap-1 text-sm text-violet-600 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Cliente</p>
          <p className="font-medium text-base">{factura.cliente}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Dirección</p>
          <p className="font-medium text-base">{factura.direccion || '—'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
          <p className="font-medium text-base">{factura.fecha}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">IVA aplicado</p>
          <p className="font-medium text-base">{factura.iva}%</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-3">Conceptos</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-md">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
            <tr>
              <th className="p-3 border">Descripción</th>
              <th className="p-3 border text-center">Cantidad</th>
              <th className="p-3 border text-right">Precio</th>
              <th className="p-3 border text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {factura.conceptos.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-3 border">{c.descripcion}</td>
                <td className="p-3 border text-center">{c.cantidad}</td>
                <td className="p-3 border text-right">{c.precio.toFixed(2)} €</td>
                <td className="p-3 border text-right">
                  {(c.cantidad * c.precio).toFixed(2)} €
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end flex-col items-end gap-1 text-sm">
        <p className="text-gray-600 dark:text-gray-300">
          Subtotal:{' '}
          <span className="font-medium">
            {(factura.total / (1 + factura.iva / 100)).toFixed(2)} €
          </span>
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          IVA ({factura.iva}%):{' '}
          <span className="font-medium">
            {(factura.total - factura.total / (1 + factura.iva / 100)).toFixed(2)} €
          </span>
        </p>
        <p className="text-xl font-bold text-violet-700 dark:text-violet-400 mt-2">
          Total: {factura.total.toFixed(2)} €
        </p>
      </div>
    </div>
  )
}
