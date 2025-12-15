# 🎓 Ejemplos de Uso PWA

## 1️⃣ Usar el Componente PWAStatusCard

El componente `PWAStatusCard` muestra el estado de la aplicación de forma visual.

### En tu componente:

```tsx
import { PWAStatusCard } from '@/components/pwa-status-card'

export function YourComponent() {
  return (
    <div>
      <PWAStatusCard />
      {/* tu contenido */}
    </div>
  )
}
```

---

## 2️⃣ Crear un Botón de Instalación Personalizado

```tsx
'use client'

import { usePWA } from '@/hooks/use-pwa'
import { Download } from 'lucide-react'

export function CustomInstallButton() {
  const { isInstallable, install } = usePWA()

  if (!isInstallable) return null

  return (
    <button
      onClick={install}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
    >
      <Download size={20} />
      Instalar App
    </button>
  )
}
```

---

## 3️⃣ Sincronizar Datos Solo Cuando Hay Conexión

```tsx
'use client'

import { useOnline } from '@/hooks/use-online'
import { useEffect, useState } from 'react'

export function SyncDataOnline() {
  const isOnline = useOnline()
  const [syncStatus, setSyncStatus] = useState('idle')

  useEffect(() => {
    if (!isOnline) {
      setSyncStatus('waiting')
      return
    }

    // Sincronizar datos cuando vuelve la conexión
    async function syncData() {
      setSyncStatus('syncing')
      try {
        const response = await fetch('/api/sync', { method: 'POST' })
        if (response.ok) {
          setSyncStatus('synced')
        }
      } catch (error) {
        setSyncStatus('error')
      }
    }

    syncData()
  }, [isOnline])

  return (
    <div>
      {syncStatus === 'waiting' && <p>⏳ Esperando conexión...</p>}
      {syncStatus === 'syncing' && <p>🔄 Sincronizando...</p>}
      {syncStatus === 'synced' && <p>✅ Sincronizado</p>}
      {syncStatus === 'error' && <p>❌ Error en sincronización</p>}
    </div>
  )
}
```

---

## 4️⃣ Formulario Que Funciona Offline

```tsx
'use client'

import { useOnline } from '@/hooks/use-online'
import { useState, useCallback } from 'react'

interface PendingSubmission {
  id: string
  data: any
  timestamp: number
}

export function OfflineForm() {
  const isOnline = useOnline()
  const [pending, setPending] = useState<PendingSubmission[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(
    async (formData: any) => {
      if (!isOnline) {
        // Guardar localmente si no hay conexión
        const submission: PendingSubmission = {
          id: Date.now().toString(),
          data: formData,
          timestamp: Date.now(),
        }
        setPending(prev => [...prev, submission])
        return
      }

      // Enviar inmediatamente si hay conexión
      setLoading(true)
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })

        if (!response.ok) throw new Error('Error en submit')

        // Sincronizar pendientes después
        if (pending.length > 0) {
          await syncPending()
        }
      } finally {
        setLoading(false)
      }
    },
    [isOnline, pending]
  )

  const syncPending = async () => {
    for (const submission of pending) {
      try {
        await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission.data),
        })
      } catch (error) {
        console.error('Error sincronizando:', error)
      }
    }
    setPending([])
  }

  return (
    <div>
      {!isOnline && (
        <div className="bg-yellow-100 p-3 rounded mb-4">
          ⚠️ Sin conexión - {pending.length} cambios pendientes
          {pending.length > 0 && (
            <button
              onClick={syncPending}
              className="ml-2 text-blue-600 underline"
            >
              Sincronizar ahora
            </button>
          )}
        </div>
      )}

      <form onSubmit={(e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        handleSubmit(Object.fromEntries(formData))
      }}>
        <input type="text" name="title" placeholder="Título" required />
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  )
}
```

---

## 5️⃣ Indicador de Instalación Premium

```tsx
'use client'

import { usePWA } from '@/hooks/use-pwa'
import { Badge } from '@/components/ui/badge'

export function InstallationBadge() {
  const { isInstalled } = usePWA()

  if (!isInstalled) return null

  return (
    <Badge variant="outline" className="gap-2">
      <span className="animate-pulse">●</span>
      App Instalada
    </Badge>
  )
}
```

---

## 6️⃣ Verificador de Compatibilidad PWA

```tsx
'use client'

import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

interface PWASupport {
  serviceWorkers: boolean
  cacheAPI: boolean
  indexedDB: boolean
  notifications: boolean
}

export function PWACompatibilityCheck() {
  const [support, setSupport] = useState<PWASupport>({
    serviceWorkers: false,
    cacheAPI: false,
    indexedDB: false,
    notifications: false,
  })

  useEffect(() => {
    setSupport({
      serviceWorkers: 'serviceWorker' in navigator,
      cacheAPI: 'caches' in window,
      indexedDB: 'indexedDB' in window,
      notifications: 'Notification' in window,
    })
  }, [])

  const allSupported = Object.values(support).every(v => v)

  return (
    <Alert variant={allSupported ? 'default' : 'destructive'}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-semibold">
            {allSupported ? '✅ Compatible' : '⚠️ Compatibilidad Parcial'}
          </p>
          <ul className="text-sm space-y-1">
            {Object.entries(support).map(([key, value]) => (
              <li key={key} className="flex items-center gap-2">
                {value ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  )
}
```

---

## 7️⃣ Sistema de Caché Manual

```tsx
'use client'

import { useCallback } from 'react'

export function useCacheManager() {
  const cacheData = useCallback(async (key: string, data: any) => {
    if (!('caches' in window)) return

    const cache = await caches.open('app-cache-v1')
    const response = new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
    await cache.put(key, response)
  }, [])

  const getCachedData = useCallback(async (key: string) => {
    if (!('caches' in window)) return null

    const cache = await caches.open('app-cache-v1')
    const response = await cache.match(key)

    if (!response) return null

    return response.json()
  }, [])

  const clearCache = useCallback(async () => {
    if (!('caches' in window)) return

    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map(name => caches.delete(name)))
  }, [])

  return { cacheData, getCachedData, clearCache }
}
```

---

## 8️⃣ Monitoreo de Service Worker

```tsx
'use client'

import { useEffect, useState } from 'react'

interface SWState {
  registered: boolean
  active: boolean
  updating: boolean
  waiting: boolean
}

export function useSWMonitoring() {
  const [state, setState] = useState<SWState>({
    registered: false,
    active: false,
    updating: false,
    waiting: false,
  })

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.ready.then(registration => {
      setState(prev => ({ ...prev, registered: true, active: !!registration.active }))

      // Monitorear cambios
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          setState(prev => ({ ...prev, updating: true }))

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              setState(prev => ({ ...prev, updating: false, active: true }))
              // Opcionalmente, recarga la página
              // window.location.reload()
            }
          })
        }
      })

      // Monitorear SW esperando
      if (registration.waiting) {
        setState(prev => ({ ...prev, waiting: true }))
      }
    })
  }, [])

  return state
}

// Uso
export function SWStatus() {
  const sw = useSWMonitoring()

  return (
    <div className="text-sm">
      {sw.registered && <p>✅ Service Worker registrado</p>}
      {sw.active && <p>✅ Service Worker activo</p>}
      {sw.updating && <p>🔄 Actualizando Service Worker</p>}
      {sw.waiting && (
        <div>
          <p>🔔 Actualización disponible</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 underline text-sm"
          >
            Recargar ahora
          </button>
        </div>
      )}
    </div>
  )
}
```

---

## 9️⃣ Notificación de Actualización Disponible

```tsx
'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from '@/components/ui/alert-dialog'

export function UpdateNotifier() {
  const [showUpdate, setShowUpdate] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.ready.then(registration => {
      registration.addEventListener('controllerchange', () => {
        setShowUpdate(true)
      })

      // Checkear actualizaciones cada hora
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000)
    })
  }, [])

  return (
    <AlertDialog open={showUpdate} onOpenChange={setShowUpdate}>
      <AlertDialogContent>
        <AlertDialogTitle>Actualización Disponible</AlertDialogTitle>
        <AlertDialogDescription>
          Una nueva versión de SmartWaste está disponible. Recarga para obtener las últimas características y mejoras.
        </AlertDialogDescription>
        <div className="flex gap-2 justify-end">
          <AlertDialogCancel>Más tarde</AlertDialogCancel>
          <AlertDialogAction onClick={() => window.location.reload()}>
            Actualizar Ahora
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

---

## 🔟 Integración Completa en Dashboard

```tsx
'use client'

import { PWAStatusCard } from '@/components/pwa-status-card'
import { ConnectionIndicator } from '@/components/connection-indicator'
import { UpdateNotifier } from './update-notifier'
import { SyncDataOnline } from './sync-data-online'

export function DashboardWithPWA() {
  return (
    <>
      <ConnectionIndicator />
      <UpdateNotifier />
      
      <div className="space-y-6 p-6">
        <PWAStatusCard />
        <SyncDataOnline />
        
        {/* Tu contenido del dashboard */}
        <div className="grid gap-4">
          {/* dashboard content */}
        </div>
      </div>
    </>
  )
}
```

---

## 🔗 Links Útiles

- [MDN - Using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
- [Web.dev - Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook/)
- [next-pwa Examples](https://github.com/shadowwalker/next-pwa/tree/master/examples)

---

**¿Preguntas?** Revisa los documentos PWA-CONFIG.md y PWA-QUICK-START.md
