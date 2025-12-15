# 🚀 SmartWaste PWA - Guía Rápida

## ¿Qué es una PWA?

Una **Progressive Web App (PWA)** es una aplicación web que funciona como una app nativa. Puede:
- ✅ Instalarse en el dispositivo
- ✅ Funcionar sin conexión
- ✅ Enviarse a notificaciones push
- ✅ Acceder a hardware del dispositivo

---

## 🎯 Características Implementadas

### 1. **Instalación Nativa**
Tu app ahora puede instalarse como una aplicación nativa en:
- 📱 **Smartphone Android** (Chrome, Edge, Samsung Internet)
- 🍎 **iPhone/iPad** (iOS 16.4+)
- 💻 **Desktop** (Windows, Mac, Linux)

### 2. **Modo Offline**
- El Service Worker cachea automáticamente los recursos
- La app sigue funcionando sin conexión
- Los datos se sincronizan cuando vuelve la conexión

### 3. **Performance**
- Carga más rápida (assets en caché)
- Menos consumo de datos
- Mejor experiencia en conexiones lentas

### 4. **Indicador de Conexión**
- Barra amarilla cuando no hay conexión
- Muestra estado de sincronización

---

## 🛠️ Cómo Usar Los Hooks Nuevos

### `usePWA()` - Control de Instalación
```tsx
'use client'

import { usePWA } from '@/hooks/use-pwa'
import { Download } from 'lucide-react'

export function InstallButton() {
  const { isInstallable, isInstalled, install } = usePWA()

  if (!isInstallable) return null

  return (
    <button 
      onClick={install}
      className="flex items-center gap-2"
    >
      <Download size={20} />
      Instalar SmartWaste
    </button>
  )
}
```

### `useOnline()` - Detectar Conexión
```tsx
'use client'

import { useOnline } from '@/hooks/use-online'

export function SyncStatus() {
  const isOnline = useOnline()

  return (
    <div>
      {isOnline ? '✅ Conectado' : '⚠️ Sin conexión'}
    </div>
  )
}
```

---

## 📝 Archivos PWA Principales

| Archivo | Función |
|---------|---------|
| `public/manifest.json` | Configuración de la app (nombre, iconos, etc.) |
| `public/sw.js` | Service Worker (se genera automáticamente) |
| `src/components/pwa-register.tsx` | Registra el SW y gestiona instalación |
| `src/hooks/use-pwa.ts` | Hook para acceder a funciones PWA |
| `src/hooks/use-online.ts` | Hook para detectar conexión |
| `next.config.ts` | Configuración de next-pwa |

---

## 🧪 Probar la PWA

### En Desktop (Chrome/Edge)
1. Abre `http://localhost:3000`
2. Espera a que cargue
3. Haz clic en el ícono instalador (o mira `/dashboard`)
4. Sigue los pasos

### En Android
1. Abre con Chrome
2. Toca el botón de instalación cuando aparezca
3. Confirma

### En iOS
1. Abre con Safari
2. Toca compartir
3. "Agregar a pantalla de inicio"

---

## 🔄 Estrategias de Caché

### ¿Cómo funciona el caché?

**NetworkFirst** (APIs)
```
Usuario solicita datos
    ↓
¿Hay conexión? → Sí → Obtener de servidor ✅
    ↓
    No → Usar caché ⚡
```

**StaleWhileRevalidate** (Imágenes, CSS)
```
Usuario solicita recurso
    ↓
Mostrar versión en caché ⚡
    ↓
Actualizar caché en background 🔄
```

---

## 💡 Ejemplo: Componente Que Funciona Offline

```tsx
'use client'

import { useOnline } from '@/hooks/use-online'
import { useCallback, useState } from 'react'

export function DataForm() {
  const isOnline = useOnline()
  const [pendingData, setPendingData] = useState<any[]>([])

  const handleSubmit = useCallback(async (data: any) => {
    if (!isOnline) {
      // Guardar localmente
      setPendingData(prev => [...prev, data])
      return
    }

    // Enviar al servidor
    const response = await fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    return response.json()
  }, [isOnline])

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSubmit({ /* data */ })
    }}>
      {!isOnline && <p>⚠️ Cambios pendientes: {pendingData.length}</p>}
      {/* form fields */}
    </form>
  )
}
```

---

## 🎨 Personalizar la PWA

### Cambiar Color Tema
**Archivo**: `public/manifest.json`
```json
{
  "theme_color": "#16a34a",      // Color principal
  "background_color": "#ffffff"   // Color fondo
}
```

### Cambiar Nombre
**Archivo**: `public/manifest.json`
```json
{
  "name": "Tu Nuevo Nombre",
  "short_name": "Nombre Corto"
}
```

### Agregar Shortcuts
**Archivo**: `public/manifest.json`
```json
{
  "shortcuts": [
    {
      "name": "Ir al Dashboard",
      "short_name": "Dashboard",
      "url": "/dashboard",
      "icons": [{"src": "/icons/android-chrome-192x192.png"}]
    }
  ]
}
```

---

## 📊 Verificar PWA en Chrome

1. Abre **DevTools** (F12)
2. Pestaña **Application**
   - **Service Workers**: Debe mostrar estado "activated"
   - **Manifest**: Debe mostrar todos los datos
   - **Storage**: Cache del SW

3. Pestaña **Lighthouse**
   - Selecciona "Progressive Web App"
   - Analiza - Score debe ser 90+

---

## 🚀 Deployment

### ¡Importante!
Las PWAs **requieren HTTPS** en producción. En desarrollo local (localhost) no es necesario.

### En Vercel (Recomendado)
```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Vercel automáticamente activa HTTPS y tu PWA funciona perfectamente.

### En Otros Hosts
- Asegúrate de usar HTTPS
- Sube los archivos normalmente
- El Service Worker se generará automáticamente

---

## 📱 Testing en Dispositivos Reales

### Android
- Abre en Chrome desde tu PC: `http://192.168.X.X:3000`
- O en tu teléfono en la misma red WiFi

### iOS
- Con iOS 16.4+, abre en Safari
- Tap Compartir → Agregar a pantalla de inicio

---

## ⚙️ Configuración en `next.config.ts`

```typescript
const withPWA = require("next-pwa")({
  dest: "public",                          // Destino del SW
  disable: process.env.NODE_ENV === "development",  // Deshabilitado en dev
  register: true,                          // Registración automática
  skipWaiting: true,                       // Actualizar inmediatamente
  runtimeCaching: [/* estrategias */]     // Estrategias de caché
});
```

---

## 🐛 Troubleshooting

### "La app no se instala"
- ✅ Verifica que uses HTTPS (o localhost en dev)
- ✅ Manifest debe tener todos los campos requeridos
- ✅ Iconos deben existir
- ✅ Service Worker debe registrarse (ve a DevTools)

### "Service Worker no se actualiza"
- Abre DevTools → Application → Service Workers
- Haz clic en "Unregister"
- Recarga la página

### "No funciona sin conexión"
- Verifica que el SW esté activo
- Comprueba el caché en DevTools → Storage → Cache Storage
- Asegúrate de que los recursos estén en la lista de precaché

---

## 📚 Links Útiles

- [MDN - PWA](https://developer.mozilla.org/docs/Web/Progressive_web_apps)
- [web.dev - PWA Guide](https://web.dev/progressive-web-apps/)
- [next-pwa](https://github.com/shadowwalker/next-pwa)
- [Manifest Spec](https://www.w3.org/TR/appmanifest/)
- [Can I Use - PWA Features](https://caniuse.com)

---

## 🎉 ¡Listo!

Tu PWA **SmartWaste** está completamente configurada.

Ahora puedes:
- ✅ Instalar como app nativa
- ✅ Funcionar offline
- ✅ Cachear datos inteligentemente
- ✅ Mejor performance y UX

¡Felicidades! 🚀
