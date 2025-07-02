// src/app/facturas/layout.tsx
'use client'

import Link from 'next/link'

export default function FacturasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-2xl font-bold text-violet-600 mb-10">FinDash</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="block text-gray-600 hover:text-violet-600">
            Inicio
          </Link>
          <Link href="/facturas" className="block text-violet-700 font-semibold">
            Facturas
          </Link>
        </nav>

        <div className="mt-10 text-sm text-gray-400">
          <div className="mb-1">Usuario</div>
          <div className="text-black font-medium">demo@email.com</div>
        </div>
      </aside>

      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
