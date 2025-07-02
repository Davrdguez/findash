'use client'

import { useState } from 'react'
import pdfMake from '@/lib/pdfmake-client'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'

// Tipos
type Concepto = {
  descripcion: string
  cantidad: number
  precio: number
}

type Factura = {
  id: string
  cliente: string
  direccion: string
  fecha: string
  numeroFactura: string
  iva: number
  conceptos: Concepto[]
  total: number
}

export default function NuevaFacturaPage() {
  const router = useRouter()

  const [cliente, setCliente] = useState('')
  const [direccion, setDireccion] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().substring(0, 10))
  const [numeroFactura, setNumeroFactura] = useState('FAC-001')
  const [iva, setIVA] = useState(21)
  const [conceptos, setConceptos] = useState<Concepto[]>([
    { descripcion: '', cantidad: 1, precio: 0 },
  ])

  const handleConceptoChange = (
    index: number,
    field: keyof Concepto,
    value: string | number
  ) => {
    const nuevos = [...conceptos]
    nuevos[index] = {
      ...nuevos[index],
      [field]: field === 'cantidad' || field === 'precio' ? Number(value) : value,
    }
    setConceptos(nuevos)
  }

  const agregarConcepto = () => {
    setConceptos([
      ...conceptos,
      { descripcion: '', cantidad: 1, precio: 0 },
    ])
  }

  const totalSinIVA = conceptos.reduce(
    (acc, item) => acc + item.cantidad * item.precio,
    0
  )
  const cantidadIVA = (totalSinIVA * iva) / 100
  const totalConIVA = totalSinIVA + cantidadIVA

  const nuevaFactura: Factura = {
    id: uuidv4(),
    cliente,
    direccion,
    fecha,
    numeroFactura,
    iva,
    conceptos,
    total: totalConIVA,
  }

  const guardarFactura = () => {
    const existentes: Factura[] = JSON.parse(localStorage.getItem('facturas') || '[]')
    localStorage.setItem('facturas', JSON.stringify([...existentes, nuevaFactura]))
    alert('✅ Factura guardada correctamente.')
    router.push('/facturas')
  }

  const generarPDF = () => {
    const docDefinition = {
      content: [
        { text: 'Factura', style: 'header' },
        { text: `Número: ${numeroFactura}` },
        { text: `Fecha: ${fecha}` },
        { text: `Cliente: ${cliente}` },
        { text: `Dirección: ${direccion}` },
        {
          style: 'table',
          table: {
            widths: ['*', 'auto', 'auto', 'auto'],
            body: [
              ['Descripción', 'Cantidad', 'Precio', 'Subtotal'],
              ...conceptos.map((c) => [
                c.descripcion,
                c.cantidad,
                `${c.precio.toFixed(2)} €`,
                `${(c.cantidad * c.precio).toFixed(2)} €`,
              ]),
            ],
          },
        },
        { text: `Subtotal: ${totalSinIVA.toFixed(2)} €`, margin: [0, 10, 0, 0] },
        { text: `IVA (${iva}%): ${cantidadIVA.toFixed(2)} €` },
        { text: `Total: ${totalConIVA.toFixed(2)} €`, style: 'total' },
      ],
      styles: {
        header: { fontSize: 20, bold: true, margin: [0, 0, 0, 20] },
        table: { margin: [0, 10, 0, 10] },
        total: { bold: true, fontSize: 14, margin: [0, 10, 0, 0] },
      },
    }

    pdfMake.createPdf(docDefinition).download(`${numeroFactura}.pdf`)
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🧾 Nueva Factura</h1>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <input
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Número de factura</label>
            <input
              value={numeroFactura}
              onChange={(e) => setNumeroFactura(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IVA (%)</label>
            <input
              type="number"
              value={iva}
              onChange={(e) => setIVA(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-500 text-gray-900"
              min={0}
              max={100}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Conceptos</h2>
          <div className="space-y-3">
            {conceptos.map((c, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <input
                  type="text"
                  placeholder="Descripción"
                  value={c.descripcion}
                  onChange={(e) => handleConceptoChange(i, 'descripcion', e.target.value)}
                  className="md:col-span-6 px-3 py-2 border rounded-md text-gray-900"
                />
                <input
                  type="number"
                  placeholder="Cantidad"
                  value={c.cantidad}
                  onChange={(e) => handleConceptoChange(i, 'cantidad', e.target.value)}
                  className="md:col-span-2 px-3 py-2 border rounded-md text-gray-900"
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={c.precio}
                  onChange={(e) => handleConceptoChange(i, 'precio', e.target.value)}
                  className="md:col-span-2 px-3 py-2 border rounded-md text-gray-900"
                />
                <div className="md:col-span-2 font-medium text-right text-gray-700">
                  {(c.cantidad * c.precio).toFixed(2)} €
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={agregarConcepto}
            className="mt-4 text-sm text-blue-600 hover:underline"
          >
            + Añadir concepto
          </button>
        </div>

        <div className="border-t pt-6 text-right text-gray-900 space-y-1">
          <div>Subtotal: {totalSinIVA.toFixed(2)} €</div>
          <div>IVA ({iva}%): {cantidadIVA.toFixed(2)} €</div>
          <div className="text-lg font-bold">Total: {totalConIVA.toFixed(2)} €</div>
        </div>

        <div className="text-right flex justify-end gap-4">
          <button
            onClick={guardarFactura}
            className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300"
          >
            Guardar factura
          </button>
          <button
            onClick={generarPDF}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  )
}
