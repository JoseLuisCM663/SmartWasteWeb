# PWA Reference - Cheat Sheet Rápido

## 🚀 Comandos Rápidos

```bash
npm run dev              # Desarrollo (SW deshabilitado)
npm run build            # Compilar
npm start                # Producción
npm run lint             # Verificar errores
```

## 📱 Instalar en Diferentes Plataformas

| Plataforma | Pasos |
|-----------|-------|
| **Chrome/Edge** | 🔵 Botón instalador (ícono +) → Instalar |
| **Safari iOS** | 📤 Compartir → Agregar a pantalla de inicio |
| **Android Chrome** | 📲 Esperar prompt → Instalar |

## 🎯 Componentes Útiles

### 1. Mostrar Estado Completo
```tsx
import { PWAStatusCard } from '@/components/pwa-status-card'

<PWAStatusCard />
```

### 2. Indicador de Conexión
Ya está en layout.tsx - se muestra automáticamente

### 3. Instalar Manualmente
```tsx
import { usePWA } from '@/hooks/use-pwa'

const { isInstallable, install } = usePWA()

<button onClick={install}>Instalar</button>
```

## 🔌 Hooks Disponibles

### useOnline()
```tsx
import { useOnline } from '@/hooks/use-online'

const isOnline = useOnline()

if (!isOnline) {
  return <p>Sin conexión</p>
}
```

### usePWA()
```tsx
import { usePWA } from '@/hooks/use-pwa'

const { isInstallable, isInstalled, install } = usePWA()

// isInstallable: boolean - Se puede instalar?
// isInstalled: boolean - Ya está instalada?
// install: () => Promise<void> - Función para instalar
```

## 📁 Estructura PWA

```
public/
├── sw.js                    ← Service Worker (generado)
├── manifest.json            ← Configuración de app
└── icons/
    ├── android-chrome-192x192.png
    └── android-chrome-512x512.png

src/
├── components/
│   ├── pwa-register.tsx          ← Registra SW
│   ├── connection-indicator.tsx  ← Indicador conexión
│   └── pwa-status-card.tsx       ← Widget estado
├── hooks/
│   ├── use-pwa.ts                ← Control de instalación
│   └── use-online.ts             ← Detectar conexión
└── app/
    ├── layout.tsx                ← Incluye PWA components
    └── offline/page.tsx          ← Página offline
```

## ✅ Verificación Rápida

1. **Abre DevTools (F12)**
2. **Ve a Application tab**
3. **Service Workers** → Debe mostrar `/sw.js` activado ✅
4. **Manifest** → Todos los datos correctos ✅
5. **Cache Storage** → Archivos precacheados ✅

## 🔄 Service Worker

| Evento | Qué Hace |
|--------|----------|
| **beforeinstallprompt** | Se puede instalar |
| **appinstalled** | App fue instalada |
| **online** | Volvió la conexión |
| **offline** | Se perdió conexión |

## 🎨 Personalizar PWA

### Cambiar Color Tema
**Archivo**: `public/manifest.json`
```json
{
  "theme_color": "#16a34a",
  "background_color": "#ffffff"
}
```

### Cambiar Nombre
**Archivo**: `public/manifest.json`
```json
{
  "name": "Tu Nombre",
  "short_name": "Corto"
}
```

## 📚 Documentación

| Archivo | Para |
|---------|------|
| **PWA-QUICK-START.md** | Inicio rápido |
| **PWA-CONFIG.md** | Detalles técnicos |
| **PWA-EXAMPLES.md** | 10 ejemplos de código |
| **PWA-CHECKLIST.md** | Verificación completa |
| **CAMBIOS-PWA.md** | Resumen de cambios |

## 🐛 Troubleshooting

| Problema | Solución |
|----------|----------|
| **SW no se registra** | Revisa DevTools Console |
| **App no se instala** | Verifica HTTPS (o localhost) + Manifest |
| **Caché no funciona** | DevTools → Application → Clear Storage |
| **Cambios no se ven** | Unregister SW en DevTools + Reload |

## 🔐 HTTPS Obligatorio

```
Desarrollo: http://localhost:3000 ✅ (sin HTTPS)
Producción: https://tudominio.com ✅ (HTTPS obligatorio)
```

Deploy recomendado: **Vercel** (HTTPS automático)

## 💡 Ejemplos Rápidos

### Sincronizar Cuando Haya Conexión
```tsx
'use client'
import { useOnline } from '@/hooks/use-online'

export function Auto Sync() {
  const isOnline = useOnline()

  useEffect(() => {
    if (!isOnline) return
    
    // Sincronizar aquí
    fetch('/api/sync', { method: 'POST' })
  }, [isOnline])
}
```

### Mostrar Botón Solo Si Instalable
```tsx
'use client'
import { usePWA } from '@/hooks/use-pwa'

export function InstallButton() {
  const { isInstallable, install } = usePWA()
  
  if (!isInstallable) return null
  
  return <button onClick={install}>Instalar</button>
}
```

### Detectar Si Está Instalada
```tsx
'use client'
import { usePWA } from '@/hooks/use-pwa'

export function CheckInstalled() {
  const { isInstalled } = usePWA()
  
  return isInstalled ? <p>✅ Instalada</p> : null
}
```

## 🎯 Estrategias de Caché

```
NetworkFirst (APIs)
├─ Intentar red
├─ Si falla, usar caché
└─ Timeout: 10 segundos

CacheFirst (Fonts)
├─ Usar caché
└─ Si no existe, descargar

StaleWhileRevalidate (Assets)
├─ Mostrar caché
└─ Actualizar en background
```

## 📊 Performance

**Métricas a revisar en Lighthouse:**

- FCP (First Contentful Paint): < 1s ✅
- LCP (Largest Contentful Paint): < 2.5s ✅
- CLS (Cumulative Layout Shift): < 0.1 ✅
- PWA Score: 90+ ✅

## 🔗 Links Útiles

- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [MDN PWA](https://developer.mozilla.org/docs/Web/Progressive_web_apps)
- [next-pwa](https://github.com/shadowwalker/next-pwa)
- [Can I Use - PWA](https://caniuse.com/service-workers)

## 🎓 Conceptos Clave

- **PWA**: App web que funciona como app nativa
- **Service Worker**: Script que corre en background
- **Manifest**: Archivo JSON que describe la app
- **Caché**: Almacenamiento local de recursos
- **Offline-first**: Diseñar para funcionar sin conexión

## ⏱️ Tiempo de Implementación

- Lectura rápida: 5 min (este cheat sheet)
- Instalación dev: 10 min (npm run dev)
- Lectura completa: 30 min (todas las guías)
- Testing: 20 min (en dispositivos)

---

**¡Hecho en 15 de diciembre 2025!** 🚀
