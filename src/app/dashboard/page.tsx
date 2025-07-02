'use client'

import { useState } from 'react'
import SummaryCards from './summary-cards'
import TransactionTable from './transaction-table'
import ChartSection from './chart'
import Modal from '@/components/Modal'
import AddMovementForm from '@/components/AddMovementForm'

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <main className="p-4 md:p-6 space-y-6 max-w-screen overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Resumen financiero</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium"
          >
            + Añadir movimiento
          </button>
        </div>

        {/* Tarjetas de resumen */}
        <div className="w-full overflow-x-auto">
          <SummaryCards />
        </div>

        {/* Gráfica + filtros */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          <div className="lg:col-span-2 min-w-0">
            <ChartSection />
          </div>
        </div>

        {/* Tabla de transacciones */}
        <div className="w-full overflow-x-auto">
          <TransactionTable />
        </div>
      </main>

      {showModal && (
        <Modal title="Añadir movimiento" onClose={() => setShowModal(false)}>
          <AddMovementForm onClose={() => setShowModal(false)} />
        </Modal>
      )}
    </>
  )
}
