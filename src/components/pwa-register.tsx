'use client'

import { useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'

export function PWARegister() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)

  useEffect(() => {
    // Registrar el service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado:', registration)
          toast({
            title: 'SmartWaste',
            description: 'Aplicación lista para usar offline',
          })
        })
        .catch((error) => {
          console.error('Error al registrar Service Worker:', error)
        })
    }

    // Detectar si la app es instalable
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    window.addEventListener('appinstalled', () => {
      console.log('SmartWaste instalada como PWA')
      setIsInstallable(false)
      toast({
        title: 'SmartWaste',
        description: 'Aplicación instalada correctamente',
      })
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    const prompt = deferredPrompt as { prompt: () => void; userChoice: Promise<{ outcome: string }> }
    prompt.prompt()
    const { outcome } = await prompt.userChoice

    if (outcome === 'accepted') {
      setIsInstallable(false)
    }
  }

  if (!isInstallable) return null

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50">
      <p className="mb-2 font-semibold">Instalar SmartWaste</p>
      <button
        onClick={handleInstall}
        className="w-full bg-white text-green-600 px-4 py-2 rounded font-semibold hover:bg-green-50"
      >
        Instalar
      </button>
    </div>
  )
}
