import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin } from "lucide-react"

export function ContactSection() {
  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Contáctanos</h2>
          <p className="text-lg text-gray-600">
            ¿Listo para transformar la gestión de residuos en tu ciudad? Contáctanos para una demostración
            personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <Input id="name" placeholder="Tu nombre" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <Input id="email" type="email" placeholder="tu@email.com" />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa/Organización
                </label>
                <Input id="company" placeholder="Nombre de tu empresa" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <Textarea id="message" placeholder="Cuéntanos sobre tu proyecto y necesidades..." rows={4} />
              </div>
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Enviar Mensaje</Button>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Información de Contacto</h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">contacto@smartwaste.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Teléfono</p>
                    <p className="text-gray-600">+52 (55) 1234-5678</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <MapPin className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Oficina</p>
                    <p className="text-gray-600">Ciudad de México, México</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">¿Necesitas una demo?</h4>
              <p className="text-green-800 text-sm mb-4">
                Agenda una demostración personalizada y descubre cómo SmartWaste puede optimizar la gestión de residuos
                en tu ciudad.
              </p>
              <Button
                variant="outline"
                className="bg-transparent border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              >
                Agendar Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
