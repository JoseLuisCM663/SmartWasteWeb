import { Leaf } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">SmartWaste</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Transformando la gestión de residuos urbanos con tecnología IoT y soluciones inteligentes para ciudades
              sostenibles.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Producto</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Características
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Integraciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Acerca de
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Carreras
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Prensa
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Documentación
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Estado del Sistema
                </Link>
              </li>
              <li>
                <Link href="#contacto" className="hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 SmartWaste. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacidad
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Términos
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
