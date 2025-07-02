'use client'

import { ReactNode, useEffect } from 'react'

type Props = {
  children: ReactNode
  onClose: () => void
  title?: string
}

export default function Modal({ children, onClose, title }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="absolute inset-0"
        onClick={onClose}
        role="button"
        tabIndex={-1}
      />

      <div
        className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Mostrar el título si está definido */}
        {title && (
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  )
}
