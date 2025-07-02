'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import pdfMake from '@/lib/pdfmake-client'

type Factura = {
  id: string
  cliente: string
  total: number
  fecha: string
  numeroFactura: string
  direccion?: string
  iva?: number
  conceptos?: { descripcion: string; cantidad: number; precio: number }[]
}

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('facturas')
    if (stored) setFacturas(JSON.parse(stored))
  }, [])

  const handleEliminar = (id: string) => {
    const actualizadas = facturas.filter((f) => f.id !== id)
    setFacturas(actualizadas)
    localStorage.setItem('facturas', JSON.stringify(actualizadas))
  }

  const handleDescargar = (factura: Factura) => {
    const subtotal = factura.total / (1 + (factura.iva ?? 21) / 100)
    const iva = factura.total - subtotal

    const docDefinition = {
      content: [
        { text: 'Factura', style: 'header' },
        { text: `Número: ${factura.numeroFactura}` },
        { text: `Fecha: ${factura.fecha}` },
        { text: `Cliente: ${factura.cliente}` },
        { text: `Dirección: ${factura.direccion ?? '-'}` },
        factura.conceptos?.length
          ? {
              style: 'table',
              table: {
                widths: ['*', 'auto', 'auto', 'auto'],
                body: [
                  ['Descripción', 'Cantidad', 'Precio', 'Subtotal'],
                  ...factura.conceptos.map((c) => [
                    c.descripcion,
                    c.cantidad,
                    `${c.precio.toFixed(2)} €`,
                    `${(c.cantidad * c.precio).toFixed(2)} €`,
                  ]),
                ],
              },
            }
          : '',
        { text: `Subtotal: ${subtotal.toFixed(2)} €`, margin: [0, 10, 0, 0] },
        { text: `IVA (${factura.iva ?? 21}%): ${iva.toFixed(2)} €` },
        { text: `Total: ${factura.total.toFixed(2)} €`, style: 'total' },
      ],
      styles: {
        header: { fontSize: 20, bold: true, margin: [0, 0, 0, 20] },
        table: { margin: [0, 10, 0, 10] },
        total: { bold: true, fontSize: 14, margin: [0, 10, 0, 0] },
      },
    }

    pdfMake.createPdf(docDefinition).download(`${factura.numeroFactura}.pdf`)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Facturas</h1>
        <Link href="/facturas/nueva">
          <button className="bg-violet-600 text-white px-5 py-2 rounded hover:bg-violet-700">
            + Generar factura
          </button>
        </Link>
      </div>

      {facturas.length === 0 ? (
        <p className="text-gray-500">No hay facturas aún.</p>
      ) : (
        <div className="grid gap-4">
          {facturas.map((factura) => (
            <div key={factura.id} className="bg-white p-4 rounded shadow border">
              <div className="text-lg font-semibold">{factura.cliente}</div>
              <div className="text-sm text-gray-700">Nº: {factura.numeroFactura}</div>
              <div className="text-sm text-gray-500">
                Fecha: {factura.fecha} — Total: {factura.total.toFixed(2)} €
              </div>

              <div className="flex flex-wrap gap-4 mt-4">
                <Link href={`/facturas/${factura.id}`}>
                  <button className="text-blue-600 text-sm hover:underline">Ver</button>
                </Link>
                <Link href={`/facturas/editar/${factura.id}`} className="text-yellow-600 text-sm hover:underline">
                  Editar
                </Link>
                <button
                  onClick={() => handleDescargar(factura)}
                  className="text-green-600 text-sm hover:underline"
                >
                  Descargar
                </button>
                <button
                  onClick={() => handleEliminar(factura.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
