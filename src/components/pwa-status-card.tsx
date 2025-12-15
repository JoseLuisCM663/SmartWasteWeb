'use client'

import { usePWA } from '@/hooks/use-pwa'
import { useOnline } from '@/hooks/use-online'
import { Download, CloudOff, CheckCircle2 } from 'lucide-react'

export function PWAStatusCard() {
  const { isInstallable, isInstalled, install } = usePWA()
  const isOnline = useOnline()

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Estado de la Aplicación</h3>
      
      {/* Estado de instalación */}
      <div className="flex items-center gap-3">
        {isInstalled ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span>Instalada como aplicación nativa</span>
          </div>
        ) : isInstallable ? (
          <button
            onClick={install}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
          >
            <Download className="w-5 h-5" />
            Instalar SmartWaste
          </button>
        ) : (
          <div className="text-gray-600">
            Instala SmartWaste como aplicación nativa para mejor experiencia
          </div>
        )}
      </div>

      {/* Estado de conexión */}
      <div className="flex items-center gap-3">
        {isOnline ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span>Conectado a internet</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-yellow-600">
            <CloudOff className="w-5 h-5" />
            <span>Sin conexión - Los cambios se sincronizarán automáticamente</span>
          </div>
        )}
      </div>

      {/* Información */}
      <div className="text-sm text-gray-600 bg-white rounded p-3 border border-gray-200">
        <p className="font-semibold mb-2">💡 Beneficios de la instalación:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Acceso rápido desde tu pantalla de inicio</li>
          <li>Funciona sin conexión a internet</li>
          <li>Menor consumo de datos</li>
          <li>Experiencia similar a app nativa</li>
        </ul>
      </div>
    </div>
  )
}
