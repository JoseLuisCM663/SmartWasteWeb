import { AlertCircle, Wifi } from 'lucide-react'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-200 rounded-full blur opacity-50 animate-pulse"></div>
            <Wifi className="relative w-16 h-16 text-red-500 rotate-45" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sin conexión</h1>
        <p className="text-gray-600 mb-6">
          Parece que no tienes conexión a internet. Por favor, verifica tu conexión y vuelve a intentarlo.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-left text-sm text-blue-700">
              <p className="font-semibold mb-1">Características disponibles offline:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Ver datos en caché</li>
                <li>Navegar por páginas visitadas</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Reintentar
        </button>

        <p className="text-xs text-gray-500 mt-4">
          SmartWaste seguirá funcionando con datos en caché mientras no haya conexión.
        </p>
      </div>
    </div>
  )
}
