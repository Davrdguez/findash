'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Barra lateral */}
      <aside className="w-64 bg-white border-r p-4">
        <h1 className="text-2xl font-bold text-violet-600 mb-8">FinDash</h1>
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="text-gray-700 hover:text-violet-600">Inicio</Link>
          <Link href="/facturas" className="text-gray-700 hover:text-violet-600">Facturas</Link>
        </nav>
        <div className="mt-8 text-sm">
          <p className="font-semibold">Usuario</p>
          <p className="text-gray-500">demo@email.com</p>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
