#!/bin/bash

# 🚀 SmartWaste PWA - Comandos Útiles
# Ejecuta estos comandos para desarrollar y probar tu PWA

echo \"🎉 SmartWaste PWA - Comandos Disponibles\"
echo \"========================================\"
echo \"\"

# Colores
GREEN='\\033[0;32m'
BLUE='\\033[0;34m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Función para mostrar comandos
show_commands() {
  echo -e \"${BLUE}📝 DESARROLLO${NC}\"
  echo \"  npm run dev           Inicia servidor de desarrollo (puerto 3000)\"
  echo \"  npm run lint          Ejecuta linter\"
  echo \"  npm run build         Compila para producción\"
  echo \"\"
  
  echo -e \"${BLUE}🚀 PRODUCCIÓN${NC}\"
  echo \"  npm run build         Compila la aplicación\"
  echo \"  npm start             Inicia servidor de producción\"
  echo \"  npm run dev -- -H 0.0.0.0  Dev en red local (para dispositivos)\"
  echo \"\"
  
  echo -e \"${BLUE}🧪 TESTING PWA${NC}\"
  echo \"  Verificar en Chrome DevTools:\"
  echo \"    1. F12 → Application\"
  echo \"    2. Service Workers → Ver estado\"
  echo \"    3. Manifest → Ver datos\"
  echo \"    4. Storage → Ver caché\"
  echo \"    5. Lighthouse → Analizar PWA\"
  echo \"\"
  
  echo -e \"${BLUE}📱 TESTING EN DISPOSITIVOS${NC}\"
  echo \"  Desktop:\"
  echo \"    npm run dev\"
  echo \"    Abre http://localhost:3000\"
  echo \"\"
  echo \"  Red Local (móvil)\"
  echo \"    npm run dev -- -H 0.0.0.0\"
  echo \"    Obtén tu IP: ifconfig (Linux/Mac) o ipconfig (Windows)\"
  echo \"    Abre http://192.168.X.X:3000 en tu móvil\"
  echo \"\"
  
  echo -e \"${BLUE}🔍 DEBUGGING${NC}\"
  echo \"  Chrome DevTools:\"
  echo \"    F12 → Sources → sw.js → Ver Service Worker\"
  echo \"    F12 → Console → Ver logs\"
  echo \"    F12 → Network → Ver caché\"
  echo \"\"
  echo \"  Limpiar caché:\"
  echo \"    F12 → Application → Clear Storage → Clear Site Data\"
  echo \"    O: localStorage.clear() en console\"
  echo \"\"
  
  echo -e \"${BLUE}🐳 DOCKER${NC}\"
  echo \"  docker-compose -f docker-compose.dev.yml up\"
  echo \"    Inicia el servidor con Docker\"
  echo \"\"
  
  echo -e \"${BLUE}📚 DOCUMENTACIÓN${NC}\"
  echo \"  Guía Rápida:     PWA-QUICK-START.md\"
  echo \"  Config Completa: PWA-CONFIG.md\"
  echo \"  Checklist:       PWA-CHECKLIST.md\"
  echo \"  Ejemplos:        PWA-EXAMPLES.md\"
  echo \"  Cambios:         CAMBIOS-PWA.md\"
  echo \"\"
}

# Mostrar menú interactivo
if [ $# -eq 0 ]; then
  show_commands
else
  case \"$1\" in
    dev)
      npm run dev
      ;;
    build)
      npm run build
      ;;
    start)
      npm start
      ;;
    local)
      npm run dev -- -H 0.0.0.0
      ;;
    lint)
      npm run lint
      ;;
    help|--help|-h)
      show_commands
      ;;
    *)
      echo \"Comando desconocido: $1\"
      show_commands
      ;;
  esac
fi
