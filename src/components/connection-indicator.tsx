'use client'

import { useOnline } from '@/hooks/use-online'
import { Wifi, WifiOff } from 'lucide-react'

export function ConnectionIndicator() {
  const isOnline = useOnline()

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-2 flex items-center justify-center gap-2 z-50">
      <WifiOff className="w-4 h-4" />
      <span className="text-sm font-medium">Sin conexión - Los cambios se sincronizarán cuando se restaure la conexión</span>
    </div>
  )
}
