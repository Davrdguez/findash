'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

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
}

export default function EditarFacturaPage() {
  const router = useRouter()
  const { id } = useParams()

  const [factura, setFactura] = useState<Factura | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('facturas')
    if (!stored) return
    const facturas: Factura[] = JSON.parse(stored)
    const f = facturas.find((f) => f.id === id)
    if (f) setFactura(f)
  }, [id])

  const handleChange = (field: keyof Factura, value: string | number) => {
    if (!factura) return
    setFactura((prev) => prev ? { ...prev, [field]: value } : null)
  }

  const handleConceptoChange = (index: number, field: keyof Concepto, value: string | number) => {
  if (!factura) return
  const nuevos = [...factura.conceptos]
  nuevos[index] = {
    ...nuevos[index],
    [field]: field === 'cantidad' || field === 'precio' ? Number(value) : value,
  }
  setFactura({ ...factura, conceptos: nuevos })
}


  const agregarConcepto = () => {
    if (!factura) return
    setFactura({
      ...factura,
      conceptos: [...factura.conceptos, { descripcion: '', cantidad: 1, precio: 0 }],
    })
  }

  const guardarCambios = () => {
    const stored = localStorage.getItem('facturas')
    if (!stored || !factura) return
    const facturas: Factura[] = JSON.parse(stored)
    const actualizadas = facturas.map((f) => (f.id === id ? factura : f))
    localStorage.setItem('facturas', JSON.stringify(actualizadas))
    router.push('/facturas')
  }

  if (!factura) return <p className="p-8">Cargando...</p>

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">✏️ Editar Factura</h1>

      <div className="space-y-4 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={factura.cliente}
            onChange={(e) => handleChange('cliente', e.target.value)}
            placeholder="Cliente"
            className="px-3 py-2 border rounded-md text-gray-900"
          />
          <input
            type="text"
            value={factura.direccion}
            onChange={(e) => handleChange('direccion', e.target.value)}
            placeholder="Dirección"
            className="px-3 py-2 border rounded-md text-gray-900"
          />
          <input
            type="date"
            value={factura.fecha}
            onChange={(e) => handleChange('fecha', e.target.value)}
            className="px-3 py-2 border rounded-md text-gray-900"
          />
          <input
            type="text"
            value={factura.numeroFactura}
            onChange={(e) => handleChange('numeroFactura', e.target.value)}
            placeholder="Número de factura"
            className="px-3 py-2 border rounded-md text-gray-900"
          />
          <input
            type="number"
            value={factura.iva}
            onChange={(e) => handleChange('iva', Number(e.target.value))}
            placeholder="IVA"
            className="px-3 py-2 border rounded-md text-gray-900"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mt-6">Conceptos</h2>
          {factura.conceptos.map((c, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
              <input
                value={c.descripcion}
                onChange={(e) => handleConceptoChange(i, 'descripcion', e.target.value)}
                className="col-span-2 px-3 py-2 border rounded-md text-gray-900"
                placeholder="Descripción"
              />
              <input
                type="number"
                value={c.cantidad}
                onChange={(e) => handleConceptoChange(i, 'cantidad', e.target.value)}
                className="px-3 py-2 border rounded-md text-gray-900"
                placeholder="Cantidad"
              />
              <input
                type="number"
                value={c.precio}
                onChange={(e) => handleConceptoChange(i, 'precio', e.target.value)}
                className="px-3 py-2 border rounded-md text-gray-900"
                placeholder="Precio"
              />
            </div>
          ))}
          <button onClick={agregarConcepto} className="mt-4 text-sm text-blue-600 hover:underline">
            + Añadir concepto
          </button>
        </div>

        <button
          onClick={guardarCambios}
          className="w-full mt-6 bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  )
}
