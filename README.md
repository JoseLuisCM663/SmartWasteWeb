# 🍀 *SmartWaste - Monitoreo Inteligente de Residuos*

*SmartWasteWeb* es una **plataforma web Progressive Web App (PWA)** enfocada en la **gestión inteligente de residuos**, combinando sensores IoT, visualización en tiempo real, análisis de datos y alertas críticas para ayudar a mantener una región más limpia, eficiente y sostenible.

---

## 🚀 *Características Principales*

- 🌱 **Monitoreo de residuos** en tiempo real desde dispositivos inteligentes.
- 📊 **Dashboard visual** con métricas clave, alertas y estado de los contenedores.
- 🛎️ **Alertas automáticas** por llenado crítico de contenedores.
- 🗺️ **Optimización de rutas** de recolección con base en análisis históricos.
- 📁 **Generación de reportes** personalizados por periodo o ubicación.
- 🧠 **Análisis de patrones** de residuos para toma de decisiones estratégicas.
- 🔒 **Acceso seguro** con roles y permisos (admin, operador, usuario).
- 🧪 Validación en entornos reales o simulados para asegurar efectividad.

### 📱 *PWA - Características Web Progresiva*
- ✅ **Instalación nativa** en dispositivos móviles y desktop
- ✅ **Funcionamiento offline** con Service Worker
- ✅ **Caching inteligente** de recursos y datos
- ✅ **Indicador de conexión** visual
- ✅ **Sincronización automática** cuando vuelve la conexión

---

## 🎨 *Diseño Optimizado*

- 🇲🇽 *Experiencia Mexicana:* Localización en español y referencias culturales adaptadas.
- 📱 *UI Responsiva:* Compatible con móviles, tablets y pantallas de escritorio.
- ♿ *Accesibilidad:* Pensado para facilitar la interacción con todos los usuarios.
- ⚡ *PWA First:* Optimizado para instalación y uso como aplicación nativa.

---

## 🛠️ *Tecnologías Utilizadas*

- **Frontend:** Next.js 15, Tailwind CSS, TypeScript
- **PWA:** next-pwa, Service Worker, Manifest
- **UI Components:** Radix UI, Lucide Icons
- **Estilo:** Animaciones suaves, diseño limpio y minimalista

---

## 📦 *Instalación*

### *Requisitos Previos*
- Node.js 18+
- npm o yarn

### *Pasos de Instalación*

1. 📥 *Clona el repositorio:*

```bash
git clone https://github.com/JoseLuisCM663/SmartWasteWeb.git
cd SmartWasteWeb
```

2. *Instala dependencias:*

```bash
npm install
```

3. *Configura las variables de entorno:*

Crea un archivo `.env.local` con el siguiente contenido:

```env
API_URL=http://localhost:8000
```

4. *Inicia el servidor de desarrollo:*

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### *Compilación para Producción*

```bash
npm run build
npm start
```

---

## 📱 *PWA (Progressive Web App)*

Tu aplicación es una PWA completa. Para más información sobre cómo usarla, consulta:
- 📖 [PWA Quick Start Guide](./PWA-QUICK-START.md) - Guía rápida para empezar
- 📚 [PWA Configuration](./PWA-CONFIG.md) - Documentación completa

### *Instalar SmartWaste*

#### *En Navegadores Basados en Chromium (Chrome, Edge)*
1. Abre la aplicación
2. Haz clic en el botón de instalación (ícono + o barra de direcciones)
3. Selecciona "Instalar"

#### *En Safari (iOS 16.4+)*
1. Abre en Safari
2. Tap en el icono de compartir
3. Selecciona "Agregar a pantalla de inicio"

#### *En Android*
1. Abre en Chrome u otro navegador basado en Chromium
2. Espera el prompt de instalación
3. Instala la app

---

## ✨ *Características PWA*

- 🔄 **Sincronización Inteligente**: Los cambios se sincronizan automáticamente con el servidor
- 🌐 **Funcionamiento Offline**: Accede a datos en caché incluso sin conexión
- ⚡ **Carga Rápida**: Service Worker cachea recursos para carga instantánea
- 📲 **Instalación Nativa**: Se comporta como una app nativa en tu dispositivo
- 🔔 **Notificaciones**: Recibe alertas como app nativa

---